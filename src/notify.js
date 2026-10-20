/* ================= Surra notifications: push alerts, live race counts, invites and deep links =================
   Push notifications need a verified profile. The Surra notifier (a Google Apps Script, see notifier/) sends them:
   challenges and results are on by default; practice reminders and rival alerts are opt-in. Each device has its own
   push subscription. Settings, subscriptions and a small progress summary (used to time reminders) live in
   Firestore at notify/{uid}. Anyone can read public/map: anonymous counts of players per city. */
const PUSH_DEFAULTS = { duels: true, streak: false, rivals: false };
const REMIND_HOURS = [7, 8, 9, 12, 17, 18, 19, 20, 21, 22];
// support: checking | ok | install (iPhone/iPad: add to Home Screen first) | no (browser can't) | off (no notifier set up)
const PUSH = cell({ support: 'checking', perm: 'default', here: null, doc: null, loaded: false, busy: false });
const setPush = p => PUSH.set({ ...PUSH.get(), ...p });
const RACE = cell(readRaceCache());
const nt = { key: null, timer: 0, uid: null, loading: null };
const PENDING = { open: null };
const notifierCfg = () => { const c = window.SURRA_CONFIG && window.SURRA_CONFIG.notifier; return BUILD === 'pwa' && c && c.url && c.vapid ? c : null; };

/* ---------- small helpers */
const b64uToBytes = s => { const t = String(s).replace(/-/g, '+').replace(/_/g, '/'); const b = atob(t + '==='.slice((t.length + 3) % 4)); return Uint8Array.from(b, c => c.charCodeAt(0)); };
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
const permNow = () => { try { return window.Notification ? Notification.permission : 'default'; } catch (e) { return 'default'; } };
const localTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; } };
// the UTC hour in which a reminder for local hour h falls today (half-hour time zones round down)
const utcSlot = h => (((Math.floor((h * 60 + new Date().getTimezoneOffset()) / 60)) % 24) + 24) % 24;
const hourLabel = h => `${pad2(h)}:00`;
const swReady = () => withTimeout(navigator.serviceWorker.ready, 10000);
async function currentSub() {
  if (PUSH.get().support !== 'ok') return null;
  try { const reg = await swReady(); return (reg && reg.pushManager && await reg.pushManager.getSubscription()) || null; } catch (e) { return null; }
}
function sameKey(sub, vapid) {
  const k = sub && sub.options && sub.options.applicationServerKey; if (!k) return true;
  const a = new Uint8Array(k), b = b64uToBytes(vapid);
  return a.length === b.length && a.every((x, i) => x === b[i]);
}
function deviceLabel() {
  const ua = navigator.userAgent || '';
  const os = /android/i.test(ua) ? 'Android' : /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'iPhone or iPad'
    : /mac os/i.test(ua) ? 'Mac' : /windows/i.test(ua) ? 'Windows' : /cros|linux/i.test(ua) ? 'Computer' : 'Device';
  const br = /edg\//i.test(ua) ? 'Edge' : /samsungbrowser/i.test(ua) ? 'Samsung Internet' : /firefox|fxios/i.test(ua) ? 'Firefox' : /chrome|crios/i.test(ua) ? 'Chrome' : /safari/i.test(ua) ? 'Safari' : 'Browser';
  return `${os} · ${br}`.slice(0, 40);
}
const LP_KEY = 'surra.push';
function readLocalPush() { try { return JSON.parse(localStorage.getItem(LP_KEY) || 'null'); } catch (e) { return null; } }
function writeLocalPush(v) { try { if (v) localStorage.setItem(LP_KEY, JSON.stringify(v)); else localStorage.removeItem(LP_KEY); } catch (e) { /* private mode */ } }

/* ---------- what the notifier needs to know to time a reminder */
function nextLabel(s) {
  const a = nextAction(s);
  if (a.type === 'lesson') { const leg = legOf(s); return `${STOPS[a.sid].city} · ${LESSON_META[a.lesson].en}${leg.sid === a.sid && leg.left ? ` · ${leg.left} km to go` : ''}`; }
  if (a.type === 'checkpoint') return `the ${LEVELS[a.li].id} checkpoint`;
  if (a.type === 'boss') return `${STOPS[a.sid].city} · Boss battle with ${BOSSES[a.sid].name}`;
  if (a.type === 'climb') return climbSummit(s) ? 'Kebnekaise · the rematch with the queen' : `Kebnekaise · the climb from ${campName(climbRec(s).camp || 0)}`;
  return 'a review round';
}
const profileName = s => ((s.profile && s.profile.name) || '').trim().slice(0, 24) || 'Traveller';
function summaryOf(s, hour) {
  // "streak" stays 0: the field is kept until every app version has moved to kilometres
  return { tz: localTz().slice(0, 64), slot: utcSlot(hour), day: lastActive(s), streak: 0, stop: currentStop(s), next: nextLabel(s).slice(0, 80), name: profileName(s) };
}
const summaryKey = d => JSON.stringify([d.tz, d.slot, d.day, d.streak, d.stop, d.next, d.name]);
const hourOf = doc => (doc && Number.isInteger(doc.hour) ? doc.hour : 19);
const notifyRef = () => acct.F.doc(acct.db, 'notify', meUid());

/* read the document fresh, change it, write it back (settings and subscriptions can change on several devices) */
async function writeNotify(change) {
  const F = acct.F, ref = notifyRef();
  const snap = await F.getDoc(ref), cur = snap.exists() ? snap.data() : null;
  const d = cur ? { ...cur } : { push: { ...PUSH_DEFAULTS }, subs: [], hour: 19 };
  delete d.updatedAt;
  d.push = { ...PUSH_DEFAULTS, ...(d.push || {}) };
  d.subs = (d.subs || []).slice();
  change(d);
  if (!REMIND_HOURS.includes(d.hour)) d.hour = 19;
  Object.assign(d, summaryOf(S(), d.hour), { v: 1 });
  d.subs = d.subs.slice(-5);
  await F.setDoc(ref, { ...d, updatedAt: F.serverTimestamp() });
  nt.key = summaryKey(d);
  setPush({ doc: d });
  return d;
}
function scheduleSummary() { clearTimeout(nt.timer); nt.timer = setTimeout(() => { pushSummary().catch(() => { /* next change */ }); }, 2500); }
async function pushSummary() {
  const P = PUSH.get(); if (!commReady() || !P.doc) return;
  const sum = summaryOf(S(), hourOf(P.doc)), key = summaryKey(sum);
  if (key === nt.key) return;
  await acct.F.updateDoc(notifyRef(), { ...sum, updatedAt: acct.F.serverTimestamp() });
  nt.key = key;
  setPush({ doc: { ...PUSH.get().doc, ...sum } });
}

/* ---------- this device's subscription */
async function saveSub(sub, replaces) {
  const j = sub.toJSON(), uid = meUid();
  await writeNotify(d => {
    d.subs = d.subs.filter(x => x && x.e !== j.endpoint && x.e !== replaces);
    d.subs.push({ e: j.endpoint, k: j.keys.p256dh, a: j.keys.auth, d: deviceLabel(), t: Date.now() });
  });
  writeLocalPush({ uid, ep: j.endpoint });
  setPush({ here: j.endpoint });
}
async function dropSub(ep) { await writeNotify(d => { d.subs = d.subs.filter(x => x && x.e !== ep); }); }
async function enablePush() {
  const cfg = notifierCfg();
  if (!cfg || PUSH.get().support !== 'ok' || !commReady()) return 'unavailable';
  setPush({ busy: true });
  try {
    let perm = permNow();
    if (perm !== 'granted') perm = await new Promise(res => { const r = Notification.requestPermission(res); if (r && r.then) r.then(res, () => res(permNow())); });
    setPush({ perm });
    if (perm !== 'granted') return perm;
    const reg = await swReady();
    let sub = await reg.pushManager.getSubscription(), old = null;
    if (sub && !sameKey(sub, cfg.vapid)) { old = sub.endpoint; try { await sub.unsubscribe(); } catch (e) { /* replaced below */ } sub = null; }
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToBytes(cfg.vapid) });
    await saveSub(sub, old);
    return 'on';
  } catch (e) { return 'error'; }
  finally { setPush({ busy: false }); }
}
async function disablePush() {
  setPush({ busy: true });
  try {
    const sub = await currentSub(), ep = (sub && sub.endpoint) || PUSH.get().here || (readLocalPush() || {}).ep;
    if (sub) { try { await sub.unsubscribe(); } catch (e) { /* the notifier drops it later */ } }
    if (ep && commReady()) await dropSub(ep);
    writeLocalPush(null);
    setPush({ here: null });
    return true;
  } catch (e) { return false; }
  finally { setPush({ busy: false }); }
}
/* signing out: this device stops getting the account's notifications */
async function forgetDevicePush() {
  try {
    const sub = await withTimeout(currentSub(), 3000), ep = sub ? sub.endpoint : (readLocalPush() || {}).ep;
    if (sub) { try { await sub.unsubscribe(); } catch (e) { /* dropped by the notifier */ } }
    if (ep && commReady() && PUSH.get().doc) await withTimeout(dropSub(ep), 5000);
  } catch (e) { /* the notifier drops dead subscriptions on its own */ }
  writeLocalPush(null);
  setPush({ here: null, doc: null, loaded: false });
}
async function forgetNotify(uid) { // account deletion
  try { const sub = await withTimeout(currentSub(), 3000); if (sub) await sub.unsubscribe(); } catch (e) { /* gone with the account */ }
  try { await acct.F.deleteDoc(acct.F.doc(acct.db, 'notify', uid)); } catch (e) { /* removed by the notifier's clean-up */ }
  writeLocalPush(null);
  setPush({ here: null, doc: null, loaded: false });
}
function setPushPref(key, val) {
  const prev = PUSH.get().doc;
  if (prev) setPush({ doc: { ...prev, push: { ...PUSH_DEFAULTS, ...prev.push, [key]: val } } });
  return writeNotify(d => { d.push[key] = val; }).catch(e => { setPush({ doc: prev }); throw e; });
}
function setRemindHour(h) {
  const prev = PUSH.get().doc;
  if (prev) setPush({ doc: { ...prev, hour: h } });
  return writeNotify(d => { d.hour = h; }).catch(e => { setPush({ doc: prev }); throw e; });
}

/* ---------- loading the settings once this device holds the account's progress */
async function syncNotify() {
  const uid = meUid(); if (!commReady() || !uid) return;
  if (nt.loading && nt.uid === uid) return nt.loading;
  nt.uid = uid;
  nt.loading = (async () => {
    let doc = null;
    try { const snap = await acct.F.getDoc(notifyRef()); doc = snap.exists() ? snap.data() : null; }
    catch (e) { setPush({ loaded: false }); return; }
    if (meUid() !== uid) return;
    nt.key = doc ? summaryKey(doc) : null;
    setPush({ doc, loaded: true, perm: permNow() });
    const cfg = notifierCfg(), mine = readLocalPush();
    if (cfg && PUSH.get().support === 'ok') {
      const sub = await currentSub();
      const listed = ep => !!doc && (doc.subs || []).some(x => x && x.e === ep);
      try {
        if (sub && permNow() === 'granted' && mine && mine.uid === uid) {
          if (!sameKey(sub, cfg.vapid)) { // the notifier's key changed: subscribe again with the new one
            const old = sub.endpoint; await sub.unsubscribe();
            const reg = await swReady();
            await saveSub(await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64uToBytes(cfg.vapid) }), old);
          } else if (!listed(sub.endpoint)) await saveSub(sub, mine.ep !== sub.endpoint ? mine.ep : null); // renewed by the browser
          else setPush({ here: sub.endpoint });
        } else if (sub && (!mine || mine.uid !== uid)) { await sub.unsubscribe(); writeLocalPush(null); } // left by another profile
        else if (!sub && mine && mine.uid === uid) { if (listed(mine.ep)) await dropSub(mine.ep); writeLocalPush(null); } // permission taken back
      } catch (e) { /* tried again next time the app opens */ }
    }
    if (doc) scheduleSummary();
    await claimInvite(PUSH.get().doc);
  })().finally(() => { nt.loading = null; });
  return nt.loading;
}

/* ---------- invites: ?ref=<uid> links. A friend who signs up within two weeks of opening the link counts. */
const REF_KEY = 'surra.ref';
function inviteUrl() { const uid = meUid(); return appUrl() + (uid ? `?ref=${encodeURIComponent(uid)}` : ''); }
async function shareInvite() {
  const url = inviteUrl(), text = "I'm racing from Malmö to Kiruna in Surra, a game for speaking Swedish. Join me on the map and challenge me!";
  if (navigator.share) {
    try { await navigator.share({ title: 'Surra', text, url }); return 'shared'; }
    catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
  }
  try { await navigator.clipboard.writeText(`${text} ${url}`); toast('Invite link copied. Paste it anywhere', 'users'); return 'copied'; }
  catch (e) { toast(`Share this link: ${url}`, 'users'); return 'shown'; }
}
async function claimInvite(doc) {
  let r = null; try { r = JSON.parse(localStorage.getItem(REF_KEY) || 'null'); } catch (e) { r = null; }
  if (!r || !r.uid) return;
  const uid = meUid(), a = ACCT.get(), since = a.user && a.user.since ? Date.parse(a.user.since) : 0;
  const counts = r.uid !== uid && (!doc || !doc.ref) && since && since >= (r.t || 0) - 60e3 && Date.now() - (r.t || 0) < 14 * 864e5;
  if (counts) {
    try { await writeNotify(d => { d.ref = String(r.uid).slice(0, 40); }); pingNotifier('ref', uid); }
    catch (e) { return; } // try again next time
  }
  try { localStorage.removeItem(REF_KEY); } catch (e) { /* private mode */ }
}

/* ---------- links into the app: ?ref= from invites, ?open= from notifications */
const OPEN_TARGETS = ['home', 'map', 'players', 'challenges', 'practice', 'pass', 'me', 'race'];
const RACE_ID = /^r\d{13}_[A-Za-z0-9_-]{1,8}$/;
// ?open=race&race=<id> becomes 'race:<id>'
const targetOf = (open, race) => (open === 'race' ? (RACE_ID.test(race || '') ? 'race:' + race : 'home') : open);
function captureParams() {
  let url; try { url = new URL(location.href); } catch (e) { return; }
  const ref = url.searchParams.get('ref'), open = url.searchParams.get('open'), race = url.searchParams.get('race');
  if (ref && /^[A-Za-z0-9_-]{6,40}$/.test(ref)) { try { if (!localStorage.getItem(REF_KEY)) localStorage.setItem(REF_KEY, JSON.stringify({ uid: ref, t: Date.now() })); } catch (e) { /* private mode */ } }
  if (open && OPEN_TARGETS.includes(open)) PENDING.open = targetOf(open, race);
  if (ref || open) {
    url.searchParams.delete('ref'); url.searchParams.delete('open'); url.searchParams.delete('race');
    try { history.replaceState(history.state, '', url.pathname + url.search + url.hash); } catch (e) { /* ignore */ }
  }
}
const openTarget = href => { try { const q = new URL(href, location.href).searchParams, t = q.get('open'); return OPEN_TARGETS.includes(t) ? targetOf(t, q.get('race')) : 'home'; } catch (e) { return 'home'; } };

/* ---------- the notifier: a nudge right after a challenge changes, so the other player hears about it at once */
function pingNotifier(t, id) {
  const cfg = notifierCfg(); if (!cfg || !id) return;
  try { fetch(cfg.url, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ t, id }) }).catch(() => { /* caught up within ten minutes */ }); }
  catch (e) { /* caught up within ten minutes */ }
}

/* ---------- the race in numbers, for everyone (guests included) */
const RACE_KEY = 'surra.race';
function readRaceCache() {
  const empty = { counts: null, total: 0, active: 0, at: 0, fetched: 0 };
  try { const r = JSON.parse(localStorage.getItem(RACE_KEY) || 'null'); return r && r.counts ? { ...r, fetched: 0 } : empty; } catch (e) { return empty; }
}
async function loadRace(force) {
  if (!acct.F || !acct.db) return;
  const cur = RACE.get(); if (!force && cur.fetched && Date.now() - cur.fetched < 10 * 60e3) return;
  try {
    const snap = await acct.F.getDoc(acct.F.doc(acct.db, 'public', 'map'));
    if (!snap.exists()) { RACE.set({ ...cur, fetched: Date.now() }); return; }
    const d = snap.data(), counts = {};
    ORDER.forEach(sid => { const n = Number(d.counts && d.counts[sid]) || 0; if (n > 0) counts[sid] = n; });
    const next = { counts, total: Number(d.total) || 0, active: Number(d.active) || 0, at: Number(d.at) || 0, fetched: Date.now() };
    RACE.set(next);
    try { localStorage.setItem(RACE_KEY, JSON.stringify(next)); } catch (e) { /* private mode */ }
  } catch (e) { /* offline: keep the cached counts */ }
}
const raceNear = (counts, idx) => ORDER.reduce((a, sid, i) => a + (Math.abs(i - idx) <= DUEL.range ? (counts && counts[sid]) || 0 : 0), 0);
// anonymous markers for people who can't see names yet
function anonPlayers(counts) {
  const colors = Object.keys(AV_COLORS), out = []; let n = 0;
  ORDER.forEach(sid => { for (let i = 0; i < Math.min(99, (counts && counts[sid]) || 0); i++) out.push({ uid: `anon:${sid}:${i}`, name: 'A learner', avatar: 'bee', color: colors[n++ % colors.length], stop: sid, km: 0, anon: true }); });
  return out;
}

/* ---------- prompts: one at a time on Home, each can be put off ("Not now" waits 3, then 6, 12, 24, 30 days) */
function snoozed(s, id) { const z = (s.settings.snooze || {})[id]; return !!z && z[0] > Date.now(); }
function snooze(id) {
  update(x => {
    const z = x.settings.snooze = { ...(x.settings.snooze || {}) }, n = ((z[id] && z[id][1]) || 0) + 1;
    z[id] = [Date.now() + Math.min(30, 3 * 2 ** (n - 1)) * 864e5, n];
  });
}
function promptFor(s, a, P) {
  if (BUILD !== 'pwa' || a.status === 'off') return null;
  if (a.status === 'unverified') return 'verify';
  if (a.status === 'guest' && Object.keys(s.lessons).length && !snoozed(s, 'signup')) return 'signup';
  if (a.status !== 'ready' || !commReady()) return null;
  if (!onMap(s)) return snoozed(s, 'join') ? null : 'join';
  if (P.support === 'ok' && P.loaded && !P.here && P.perm !== 'denied' && !snoozed(s, 'push')) return 'push';
  if (P.support === 'install' && !snoozed(s, 'install')) return 'install';
  return null;
}

/* ---------- what's new: shown once to people who were already on the road before this release */
// newest first; the sheet shows every release since the one a player last saw
const NEWS_RELEASES = [
  { id: '1.9', items: [
    { icon: 'flower', t: 'Invites that cross', d: 'Invite a player to a typing race while they’re inviting you, and you both go straight into one race together.' },
  ] },
  { id: '1.8', items: [
    { icon: 'mountain', t: 'Kebnekaise', d: 'Reach Kiruna and climb Sweden’s highest mountain: right answers take you up, mistakes and running out of time make you slip, and two camps catch your fall.' },
    { icon: 'crown', t: 'The queen of the mountain', d: 'Fjälldrottningen waits on the north top, 2,097 m up. Beat her in a typing race for 100 km and the last badge.' },
  ] },
  { id: '1.7', items: [
    { icon: 'crown', t: 'Boss bees', d: 'Malte, Gösta, Stina and Ulla guard the four safehouses. Answer eight replies and type their motto before they reach the blomma to travel on, and win 50 km.' },
    { icon: 'road', t: 'Your road stays open', d: 'Already past a safehouse? Nothing is locked. Challenge its boss any time from the city for the kilometres and the badge.' },
  ] },
  { id: '1.6', items: [
    { icon: 'road', t: 'Journey kilometres', d: 'XP and streaks are gone. Lessons now cover the real road between cities, and the race is ranked by kilometres.' },
    { icon: 'swords', t: 'Kilometres at stake', d: 'Challenge anyone within two cities as often as you like. Win and you gain a share of the road between you, lose and it comes off your total.' },
    { icon: 'shield', t: 'Safehouses', d: 'Malmö, Göteborg, Stockholm and Umeå are safe: no challenges in or out, so you can learn without losing kilometres.' },
    { icon: 'flower', t: 'Typing races', d: 'Race a player in your city, or the pacer bees, to the blomma. Plus typing practice with å, ä, ö and é.' },
    { icon: 'check', t: 'Fairer choices', d: 'Reply options no longer give the answer away by their length, so challenges are about Swedish.' },
  ] },
];
const versionAfter = (a, b) => { const x = String(a).split('.').map(Number), y = String(b || '0').split('.').map(Number); return (x[0] - (y[0] || 0) || (x[1] || 0) - (y[1] || 0)) > 0; };
const NEWS = { id: NEWS_RELEASES[0].id, since: seen => NEWS_RELEASES.filter(r => versionAfter(r.id, seen)).flatMap(r => r.items) };
const newsDue = s => BUILD === 'pwa' && s.onboarded && (s.settings.news || '') !== NEWS.id;
const markNews = () => update(x => { x.settings.news = NEWS.id; });

/* ---------- start-up */
function initNotify() {
  if (BUILD !== 'pwa') return;
  setPush({ support: notifierCfg() ? 'checking' : 'off' });
  const detect = () => {
    if (!notifierCfg()) return 'off';
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return 'no';
    if (!('PushManager' in window) || !('Notification' in window)) { const i = INSTALL.get(); return i.ios && !i.standalone ? 'install' : 'no'; }
    return 'ok';
  };
  setPush({ support: detect(), perm: permNow() });
  let started = null;
  const maybeStart = () => {
    const st = ACCT.get().status;
    if (['guest', 'unverified', 'ready'].includes(st)) loadRace();
    const uid = commReady() ? meUid() : null;
    if (uid === started) return;
    started = uid;
    if (!uid) { clearTimeout(nt.timer); nt.key = null; setPush({ doc: null, loaded: false, here: null }); return; }
    syncNotify();
  };
  ACCT.sub(maybeStart);
  STORE.sub(() => { maybeStart(); if (commReady() && PUSH.get().doc) scheduleSummary(); });
  if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', e => { if (e.data && e.data.type === 'open' && NAV.open) NAV.open(openTarget(e.data.url)); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { setPush({ perm: permNow() }); loadRace(); } });
}
