/* ================= Surra players map and challenges (installable app with profiles) =================
   Opt-in: a player appears on the shared map after choosing to join. Players in the same city or up to two cities
   apart can challenge each other as often as they like (one open challenge between the same two players at a
   time): the same 8 reply questions for both, played one after the other. More right answers wins, the faster
   total time breaks a tie. Kilometres are at stake (see journey.js): the winner gains a quarter of the road
   between the two cities, the loser gives it up. Nobody can challenge, or be challenged, in a safehouse.
   Firestore: players/{uid} (public to signed-in players), challenges/{id} (only the two players). */
const DUEL = { questions: 8, perQuestion: 15000, range: 2, maxOpen: 3, expireMs: 48 * 3600e3, staleMs: 30 * 24 * 3600e3 };
const ONLINE_MS = 5 * 60e3; // seen this recently counts as online (the app checks in every few minutes while open)
const COMM = cell({ players: [], playersAt: 0, loading: false, error: null, challenges: [], challengesAt: 0 });
const setComm = p => COMM.set({ ...COMM.get(), ...p });
const comm = { timer: 0, lastPull: 0, published: null, publishedAt: 0, publishTimer: 0, legacy: false };

/* ---------- where you stand on the players map: the city you're working on */
const journeyIdx = s => Math.max(0, ORDER.indexOf(currentStop(s)));
const mapIdx = journeyIdx;
const mapStop = s => ORDER[mapIdx(s)];
const commOn = () => ACCT.get().status !== 'off';
// only once this device holds the account's own progress (right after sign-in it may still hold guest progress)
const commReady = () => ACCT.get().status === 'ready' && !!acct.db && !!meUid() && S().owner === meUid();
const meUid = () => (ACCT.get().user && ACCT.get().user.uid) || null;
const onMap = s => !!(s.community && s.community.joined) && commReady();
const tsMs = v => (v && typeof v.toMillis === 'function' ? v.toMillis() : typeof v === 'number' ? v : 0);
const isOnline = p => !!p && (p.me || (p.seen && Date.now() - p.seen < ONLINE_MS));

function myRecord(s) {
  const p = s.profile || {}, km = totalKm(s);
  return {
    name: ((p.name || '').trim() || 'Traveller').slice(0, 24), avatar: String(p.avatar || 'bee').slice(0, 16),
    color: String(p.color || 'fjord').slice(0, 16), stop: mapStop(s), km, cities: citiesOf(s),
  };
}

/* ---------- your own entry on the map. "xp" carries the kilometres too, for app versions from before kilometres;
   until the new security rules are live the app writes only the older fields. */
async function publishMe(force) {
  const s = S(); if (!onMap(s)) return;
  const rec = myRecord(s), key = JSON.stringify(rec);
  if (!force && key === comm.published) return;
  const F = acct.F, ref = F.doc(acct.db, 'players', meUid());
  const full = { name: rec.name, avatar: rec.avatar, color: rec.color, stop: rec.stop, xp: rec.km, km: rec.km, cities: rec.cities, updatedAt: F.serverTimestamp(), v: 2 };
  const legacy = { name: rec.name, avatar: rec.avatar, color: rec.color, stop: rec.stop, xp: rec.km, updatedAt: F.serverTimestamp(), v: 2 };
  if (comm.legacy) await F.setDoc(ref, legacy);
  else {
    try { await F.setDoc(ref, full); }
    catch (e) { if (errCode(e) !== 'permission-denied') throw e; comm.legacy = true; await F.setDoc(ref, legacy); }
  }
  comm.published = key; comm.publishedAt = Date.now();
  const list = COMM.get().players.filter(p => p.uid !== meUid());
  setComm({ players: [...list, { uid: meUid(), ...rec, seen: Date.now() }] });
}
function schedulePublish() {
  clearTimeout(comm.publishTimer);
  comm.publishTimer = setTimeout(() => { publishMe().catch(() => { /* tried again on the next change */ }); }, 1500);
}
async function joinMap() {
  update(s => { s.community.joined = true; });
  try { await publishMe(true); }
  catch (e) { update(s => { s.community.joined = false; }); throw e; }
  refreshPlayers(); refreshChallenges(true);
}
async function leaveMap() {
  const uid = meUid(), F = acct.F;
  // answer what's open first: decline challenges waiting for you, withdraw your own
  for (const c of COMM.get().challenges.filter(x => x.status === 'pending')) {
    try {
      if (c.to === uid) await F.updateDoc(F.doc(acct.db, 'challenges', c.id), { status: 'declined', resolvedAt: F.serverTimestamp() });
      else await F.deleteDoc(F.doc(acct.db, 'challenges', c.id));
    } catch (e) { /* expires on its own */ }
  }
  await F.deleteDoc(F.doc(acct.db, 'players', uid));
  update(s => { s.community.joined = false; });
  comm.published = null;
  setComm({ players: COMM.get().players.filter(p => p.uid !== uid) });
  refreshChallenges(true);
}
async function purgeCommunity(uid) { // account deletion: remove the map entry and every challenge and race you were part of
  const F = acct.F;
  for (const [col, fields] of [['challenges', ['from', 'to']], ['races', ['a', 'b']]]) {
    for (const field of fields) {
      try {
        const snap = await F.getDocs(F.query(F.collection(acct.db, col), F.where(field, '==', uid), F.limit(200)));
        const ids = []; snap.forEach(d => ids.push(d.id));
        for (const id of ids) { try { await F.deleteDoc(F.doc(acct.db, col, id)); } catch (e) { /* keep going */ } }
      } catch (e) { /* keep going */ }
    }
  }
  try { await F.deleteDoc(F.doc(acct.db, 'players', uid)); } catch (e) { /* already gone */ }
  setComm({ players: [], challenges: [] });
}

/* ---------- reading the map
   The notifier keeps a roster of everyone on the map in shared/roster (one read instead of one per player); on top
   of it we fetch only the entries that changed since it was written. Without a fresh roster, read the map directly. */
const ROSTER_FRESH = 3 * 3600e3;
const kmOf = x => { const v = x.km != null ? x.km : x.xp; return Math.max(0, Math.round(Number(v) || 0)); };
async function refreshPlayers() {
  if (!commReady()) return;
  setComm({ loading: true, error: null });
  try {
    const F = acct.F, col = F.collection(acct.db, 'players'), cutoff = Date.now() - DUEL.staleMs, byUid = new Map();
    const add = (uid, x, seen) => {
      if (!ORDER.includes(x.stop) || (seen && seen < cutoff)) { byUid.delete(uid); return; }
      const cities = Number.isInteger(x.cities) ? x.cities : null;
      byUid.set(uid, { uid, name: String(x.name || 'Traveller'), avatar: x.avatar || 'bee', color: x.color || 'fjord', stop: x.stop, km: kmOf(x), cities, seen });
    };
    let roster = null;
    try { const r = await F.getDoc(F.doc(acct.db, 'shared', 'roster')); roster = r.exists() ? r.data() : null; } catch (e) { roster = null; }
    const fresh = roster && Array.isArray(roster.list) && Number(roster.at) > Date.now() - ROSTER_FRESH;
    if (fresh) roster.list.forEach(r => { if (r && r.u) add(r.u, { name: r.n, avatar: r.a, color: r.c, stop: r.s, km: r.k, xp: r.x, cities: r.y }, Number(r.t) || 0); });
    const snap = await F.getDocs(fresh ? F.query(col, F.where('updatedAt', '>', new Date(Number(roster.at) - 120e3)), F.limit(300)) : F.query(col, F.limit(400)));
    snap.forEach(d => { const x = d.data(); add(d.id, x, tsMs(x.updatedAt)); });
    setComm({ players: [...byUid.values()], playersAt: Date.now(), loading: false });
  } catch (e) { setComm({ loading: false, error: errCode(e) || 'error' }); }
}
/* the list the map draws: your own entry always shows where you are right now */
function mapPlayers(s, players) {
  const uid = meUid(), list = players.filter(p => p.uid !== uid);
  if (onMap(s)) list.push({ uid, ...myRecord(s), seen: Date.now(), me: true });
  return list;
}

/* ---------- challenges */
const challengeId = uid => String(9999999999999 - Date.now()).padStart(13, '0') + '_' + uid.slice(0, 8); // newest sorts first
function normalize(id, x) {
  return { id, ...x, created: tsMs(x.created), resolvedAt: tsMs(x.resolvedAt), fromScore: Number(x.fromScore) || 0, fromMs: Number(x.fromMs) || 0, toScore: x.toScore == null ? null : Number(x.toScore), toMs: x.toMs == null ? null : Number(x.toMs) };
}
const expired = c => c.status === 'pending' && c.created && Date.now() - c.created > DUEL.expireMs;
const stakeOf = c => stakeFor(c.fromStop, c.toStop);
function outcome(c) { // 'from' | 'to' | 'tie' | null
  if (c.status !== 'done' || c.toScore == null) return null;
  if (c.toScore !== c.fromScore) return c.toScore > c.fromScore ? 'to' : 'from';
  if (c.toMs !== c.fromMs) return c.toMs < c.fromMs ? 'to' : 'from';
  return 'tie';
}
const myResult = (c, uid) => { const o = outcome(c); if (!o) return null; if (o === 'tie') return 'tie'; return (o === 'to') === (c.to === uid) ? 'won' : 'lost'; };
const otherName = (c, uid) => (c.from === uid ? c.toName : c.fromName);
function challengeLists(list, uid) {
  return {
    incoming: list.filter(c => c.to === uid && c.status === 'pending' && !expired(c)),
    sent: list.filter(c => c.from === uid && c.status === 'pending'),
    results: list.filter(c => c.status !== 'pending').sort((a, b) => (b.resolvedAt || b.created) - (a.resolvedAt || a.created)),
    unseen: list.filter(c => c.from === uid && c.status !== 'pending' && !c.fromSeen),
  };
}
async function refreshChallenges(force) {
  if (!commReady()) return;
  if (!force && Date.now() - comm.lastPull < 15000) return;
  comm.lastPull = Date.now();
  const F = acct.F, uid = meUid(), col = F.collection(acct.db, 'challenges');
  try {
    const [a, b] = await Promise.all([
      F.getDocs(F.query(col, F.where('to', '==', uid), F.limit(20))),
      F.getDocs(F.query(col, F.where('from', '==', uid), F.limit(20))),
    ]);
    const list = [];
    a.forEach(d => list.push(normalize(d.id, d.data())));
    b.forEach(d => list.push(normalize(d.id, d.data())));
    applyResults(list, true);
    setComm({ challenges: list, challengesAt: Date.now() });
  } catch (e) { /* offline: try again on the next visit */ }
}
/* settle each finished duel once: the winner gains the stake, the loser gives it up (never below zero) */
function applyResults(list, announce) {
  const uid = meUid(), s = S(), done = s.community.applied || {};
  const fresh = list.filter(c => c.status === 'done' && (c.from === uid || c.to === uid) && !done[c.id]);
  if (!fresh.length) return;
  const msgs = [];
  update(st => {
    const ap = st.community.applied;
    for (const c of fresh) {
      const r = myResult(c, uid); if (!r) continue;
      const stake = stakeOf(c), who = otherName(c, uid);
      let km = 0;
      if (r === 'won') { km = addResultKm(st, stake); msgs.push([stake ? `You beat ${who} in a challenge! +${km} km` : `You beat ${who} in a friendly challenge`, 'swords']); }
      if (r === 'lost') { km = addResultKm(st, -stake); msgs.push([stake ? `${who} won your challenge. ${km ? `−${-km} km` : 'No kilometres to lose yet'}` : `${who} won your friendly challenge`, 'swords']); }
      if (r === 'tie') msgs.push([`Your challenge with ${who} was a tie`, 'swords']);
      ap[c.id] = { t: c.resolvedAt || Date.now(), r, km };
    }
    const cut = Date.now() - 90 * 24 * 3600e3; // forget settled duels after three months
    for (const [k, v] of Object.entries(ap)) if (!v || (v.t || 0) < cut) delete ap[k];
  });
  if (announce) msgs.forEach(([m, ic], i) => setTimeout(() => toast(m, ic), 300 + i * 900));
  schedulePublish();
}
function canChallenge(s, target, list) {
  const uid = meUid(), here = mapStop(s);
  if (!onMap(s)) return { ok: false, why: 'Join the players map to send challenges' };
  if (target.uid === uid) return { ok: false, why: "That's you" };
  if (isSafe(here)) return { ok: false, why: `${STOPS[here].city} is a safehouse: no challenges in or out` };
  if (isSafe(target.stop)) return { ok: false, why: `Safe in ${STOPS[target.stop].city}, a safehouse` };
  const gap = Math.abs(ORDER.indexOf(target.stop) - mapIdx(s));
  if (gap > DUEL.range) return { ok: false, why: `Out of range: you can challenge players up to ${DUEL.range} cities away` };
  const between = list.filter(c => (c.from === uid && c.to === target.uid) || (c.to === uid && c.from === target.uid));
  if (between.some(c => c.status === 'pending' && !expired(c))) return { ok: false, why: 'A challenge between you is waiting' };
  if (list.filter(c => c.from === uid && c.status === 'pending' && !expired(c)).length >= DUEL.maxOpen) return { ok: false, why: `You have ${DUEL.maxOpen} challenges waiting for answers` };
  return { ok: true };
}
/* the same 8 replies for both players, from the lower player's city and the one before it */
function duelKeys(stopA, stopB) {
  const base = Math.min(ORDER.indexOf(stopA), ORDER.indexOf(stopB));
  const here = ORDER[base], prev = ORDER[base - 1], next = ORDER[base + 1];
  const keysOf = (sid, n) => pickN(STOPS[sid].replies.map((_, i) => `${sid}:r${i}`), n);
  return shuffle(prev ? [...keysOf(here, 5), ...keysOf(prev, 3)] : [...keysOf(here, 6), ...keysOf(next, 2)]);
}
function duelQuestion(key) { const m = /^([a-z]+):r(\d+)$/.exec(key); return m && STOPS[m[1]] ? replyQ(m[1], Number(m[2])) : null; }
async function sendChallenge(target, qs, score, ms) {
  const s = S(), uid = meUid(), rec = myRecord(s), F = acct.F, id = challengeId(uid);
  try { await publishMe(true); } catch (e) { /* the challenge still says where you are */ }
  await F.setDoc(F.doc(acct.db, 'challenges', id), {
    from: uid, to: target.uid, fromName: rec.name, fromAvatar: rec.avatar, fromColor: rec.color, fromStop: rec.stop,
    toName: String(target.name).slice(0, 24), toAvatar: String(target.avatar).slice(0, 16), toColor: String(target.color).slice(0, 16), toStop: target.stop,
    qs, fromScore: score, fromMs: Math.round(ms), status: 'pending', created: F.serverTimestamp(), v: 1,
  });
  pingNotifier('new', id);
  refreshChallenges(true);
}
async function answerChallenge(c, score, ms) {
  const F = acct.F;
  await F.updateDoc(F.doc(acct.db, 'challenges', c.id), { status: 'done', toScore: score, toMs: Math.round(ms), resolvedAt: F.serverTimestamp() });
  pingNotifier('res', c.id);
  const settled = { ...c, status: 'done', toScore: score, toMs: Math.round(ms), resolvedAt: Date.now() };
  applyResults([settled], false);
  setComm({ challenges: COMM.get().challenges.map(x => (x.id === c.id ? settled : x)) });
  const ap = (S().community.applied || {})[c.id];
  return { result: myResult(settled, meUid()), km: ap ? ap.km : 0 };
}
async function declineChallenge(c) {
  const F = acct.F;
  await F.updateDoc(F.doc(acct.db, 'challenges', c.id), { status: 'declined', resolvedAt: F.serverTimestamp() });
  pingNotifier('res', c.id);
  setComm({ challenges: COMM.get().challenges.map(x => (x.id === c.id ? { ...x, status: 'declined', resolvedAt: Date.now() } : x)) });
}
async function withdrawChallenge(c) {
  const F = acct.F;
  await F.deleteDoc(F.doc(acct.db, 'challenges', c.id));
  setComm({ challenges: COMM.get().challenges.filter(x => x.id !== c.id) });
}
async function markSeen(c) {
  const F = acct.F;
  setComm({ challenges: COMM.get().challenges.map(x => (x.id === c.id ? { ...x, fromSeen: true } : x)) });
  try { await F.updateDoc(F.doc(acct.db, 'challenges', c.id), { fromSeen: true }); } catch (e) { /* shown as seen on this device */ }
}

/* ---------- staying in step: publish your position as it changes, look for challenges while the app is open
   (every two minutes; push notifications bring the rest). While the app is open the map entry is refreshed every
   few minutes, so others can see you're around for a live typing race. */
const HEARTBEAT_MS = 4 * 60e3;
function initCommunity() {
  if (BUILD !== 'pwa') return;
  const tick = () => {
    if (document.visibilityState !== 'visible' || !onMap(S())) return;
    refreshChallenges();
    if (Date.now() - comm.publishedAt > HEARTBEAT_MS) publishMe(true).catch(() => { /* next tick */ });
    if (Date.now() - rc.last > 10e3) pollRaces(true);
  };
  let started = null;
  const maybeStart = () => { // start when an account's progress is in place, stop on sign-out
    const uid = commReady() ? meUid() : null;
    if (uid === started) return;
    started = uid;
    clearInterval(comm.timer);
    if (!uid) { comm.published = null; comm.legacy = false; setComm({ players: [], challenges: [], playersAt: 0, challengesAt: 0 }); return; }
    if (onMap(S())) publishMe(true).catch(() => { /* next change */ });
    refreshChallenges(true);
    pollRaces(true); // race invites waiting for you, and races you left before they were settled
    comm.timer = setInterval(tick, 120000);
  };
  ACCT.sub(maybeStart);
  STORE.sub(() => { maybeStart(); if (onMap(S())) schedulePublish(); });
  document.addEventListener('visibilitychange', tick);
  window.addEventListener('focus', tick);
}
