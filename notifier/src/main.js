/* ================= Surra notifier =================
   Sends Surra's push notifications. It runs as a Google Apps Script under the Google account that owns the
   Firebase project, and reads Firestore with that account's own access.
   - doPost: the app pings it right after a challenge is sent, answered or declined, after an invite is claimed and
     when someone invites a player in their city to a live typing race, so the other player hears about it within seconds.
   - tick (every 10 minutes): catches anything a ping missed, sends alerts held overnight, keeps the players roster
     and the public race counts fresh, alerts rivals, warns about challenges about to expire, and sends the
     practice reminders people asked for.
   Set-up steps are in notifier/README.md. Run setup() once from the editor; testPush() sends a hello to the most
   recently active device. */

const SURRA = {
  project: 'surra-abf91',
  contact: 'https://ronaksingh0075.github.io/surra/', // VAPID subject: how push services can reach the sender
  tz: 'Europe/Stockholm', // when a player's time zone is unknown
  quiet: [22, 8], // alerts that arrive between 22:00 and 08:00 local time wait until morning
  expireMs: 48 * 3600e3, // challenges expire after two days
  warnMs: 6 * 3600e3, // "about six hours left" warning
  staleMs: 30 * 24 * 3600e3, // players not seen for 30 days leave the roster
  fullScanMs: 6 * 3600e3, // re-read the whole map this often (incremental reads in between)
  range: 2, // rivals: players up to two cities apart
  pushHosts: [/(^|\.)fcm\.googleapis\.com$/, /(^|\.)android\.googleapis\.com$/, /(^|\.)push\.services\.mozilla\.com$/, /(^|\.)push\.apple\.com$/, /(^|\.)notify\.windows\.com$/],
};
const NOTIFIER_VERSION = '1.1.0';
const DEFAULT_PREFS = { duels: true, streak: false, rivals: false };

/* ================= entry points ================= */
function doGet() {
  const key = PropertiesService.getScriptProperties().getProperty('VAPID_PUBLIC');
  return ContentService.createTextOutput(JSON.stringify({ ok: true, app: 'surra-notifier', version: NOTIFIER_VERSION, vapid: key || null }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { return reply('bad request'); }
  const t = String(body.t || ''), id = String(body.id || '');
  if (!/^(new|res|ref|race)$/.test(t) || !/^[A-Za-z0-9_-]{6,64}$/.test(id)) return reply('bad request');
  const cache = CacheService.getScriptCache(), key = 'ping:' + t + ':' + id;
  if (cache.get(key)) return reply('duplicate');
  cache.put(key, '1', 120);
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) return reply('busy'); // the next tick catches it
  try {
    const st = loadState();
    const r = t === 'new' ? onNewChallenge(FS.get('challenges/' + id), st)
      : t === 'res' ? onResult(FS.get('challenges/' + id), st)
      : t === 'race' ? onRaceInvite(FS.get('races/' + id))
      : onInvite(id, st);
    if (st.dirty) saveState(st);
    return reply(r);
  } catch (err) {
    console.error('doPost ' + t + ' ' + id + ': ' + (err && err.stack || err));
    return reply('error');
  } finally { lock.releaseLock(); }
}

function tick() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    const st = loadState(), now = Date.now(), since = new Date((st.tick || now - 3600e3) - 120e3);
    st.tick = now;
    // 1. challenges sent or answered since the last run (usually the app's ping got there first)
    safe('new', () => FS.query(select('challenges', where('created', '>', since), { limit: 300 }))
      .forEach(c => { if (c.status === 'pending' && !c.pushTo) safe('new ' + c._id, () => onNewChallenge(c, st)); }));
    safe('res', () => FS.query(select('challenges', where('resolvedAt', '>', since), { limit: 300 }))
      .forEach(c => { if (c.status !== 'pending' && !c.pushRes) safe('res ' + c._id, () => onResult(c, st)); }));
    // 2. alerts that waited for morning
    safe('held', () => sendHeld(st, now));
    // 3. the map: who moved or joined, the roster for players and the counts for guests
    safe('map', () => scanPlayers(st, now));
    // 4. once an hour
    const hour = Utilities.formatDate(new Date(now), 'UTC', 'yyyy-MM-dd HH');
    if (st.hour !== hour) {
      st.hour = hour;
      safe('expiring', () => warnExpiring(st, now));
      safe('reminders', () => remindPractice(st, now));
      prune(st, now);
    }
    saveState(st);
  } finally { lock.releaseLock(); }
}

/* ================= events ================= */
function onNewChallenge(c, st) {
  if (!c || c.status !== 'pending' || c.pushTo) return 'skip';
  if (Date.now() - (c.created || 0) > SURRA.expireMs) return 'expired';
  markChallenge(c._id, { pushTo: Date.now() });
  const n = FS.get('notify/' + c.to);
  if (!wants(n, 'duels')) return 'off';
  const left = (c.created + SURRA.expireMs - Date.now()) / 1000;
  return deliver(st, c.to, n, msgChallenge(c), { ttl: left, urgency: 'high' }, 'duels');
}
function onResult(c, st) {
  if (!c || c.status === 'pending' || c.pushRes) return 'skip';
  markChallenge(c._id, { pushRes: Date.now() });
  if (c.fromSeen) return 'seen';
  const n = FS.get('notify/' + c.from);
  if (!wants(n, 'duels')) return 'off';
  return deliver(st, c.from, n, msgResult(c), { ttl: 72 * 3600 }, 'duels');
}
function onInvite(uid, st) {
  if (st.ref[uid]) return 'done';
  const n = FS.get('notify/' + uid);
  if (!n || !n.ref || n.ref === uid) return 'skip';
  st.ref[uid] = Date.now(); st.dirty = true;
  const inviter = FS.get('notify/' + n.ref);
  if (!wants(inviter, 'duels')) return 'off';
  return deliver(st, n.ref, inviter, msgInvite(n.name), { ttl: 72 * 3600 }, 'duels');
}
// a live typing race: worth a ping only while the invite is open (two minutes), and never at night
function onRaceInvite(r) {
  if (!r || r.status !== 'open' || r.pushTo) return 'skip';
  if (Date.now() - (r.created || 0) > 110e3) return 'expired';
  FS.patch('races/' + r._id, { pushTo: Date.now() }, ['pushTo'], true);
  const n = FS.get('notify/' + r.b);
  if (!wants(n, 'duels')) return 'off';
  if (isQuiet(n.tz, Date.now())) return 'quiet';
  return pushTo(r.b, n, msgRace(r), { ttl: 120, urgency: 'high' }) ? 'sent' : 'not delivered';
}
function warnExpiring(st, now) {
  // pending challenges made 42 to 44 hours ago: about six hours left to answer
  const to = new Date(now - SURRA.expireMs + SURRA.warnMs), from = new Date(to.getTime() - 2 * 3600e3);
  FS.query(select('challenges', and(where('created', '>=', from), where('created', '<', to)), { limit: 300 })).forEach(c => safe('warn ' + c._id, () => {
    if (c.status !== 'pending' || c.pushExp) return;
    markChallenge(c._id, { pushExp: Date.now() });
    const n = FS.get('notify/' + c.to);
    if (!wants(n, 'duels') || isQuiet(n.tz, now)) return; // a nudge: not worth waking anyone for
    pushTo(c.to, n, msgExpiring(c), { ttl: 5 * 3600 });
  }));
}
function remindPractice(st, now) {
  // everyone whose chosen reminder hour falls in this UTC hour and who asked for reminders
  const slot = new Date(now).getUTCHours();
  FS.query(select('notify', and(where('slot', '==', slot), where('push.streak', '==', true)), { limit: 2000 })).forEach(n => safe('remind ' + n._id, () => {
    if (!wants(n, 'streak') || !n.day) return;
    const uid = n._id, tz = n.tz || SURRA.tz, today = localDay(tz, now);
    if (n.day >= today || st.streak[uid] === today) return;
    const off = Math.round((Date.parse(today) - Date.parse(n.day)) / 864e5);
    if (!(off >= 1 && off <= 7)) return; // after a quiet week, stop reminding until they're back
    st.streak[uid] = today; // (the bookkeeping keeps its old name: one reminder a day per player)
    pushTo(uid, n, msgReminder(n), { ttl: Math.max(1800, hoursToMidnight(tz, now) * 3600), topic: 'practice' });
  }));
}

/* ---------- the players map: roster for players, counts for guests, alerts for rivals
   pos[uid] = [stop index, name, avatar, color, km, last seen, cities]. Players ahead in kilometres rank higher;
   an app from before kilometres writes only "xp", which then holds its kilometres too. */
const kmOf = p => Math.max(0, Math.round(Number(p.km != null ? p.km : p.xp) || 0));
function scanPlayers(st, now) {
  const full = !st.scan || now - (st.full || 0) > SURRA.fullScanMs;
  const docs = full ? FS.query(select('players', null, { limit: 5000 }))
    : FS.query(select('players', where('updatedAt', '>', new Date(st.scan - 120e3)), { limit: 1000 }));
  const before = st.pos, pos = full ? {} : Object.assign({}, before), events = [];
  docs.forEach(p => {
    const idx = ORDER.indexOf(p.stop), seen = Number(p.updatedAt) || 0;
    if (idx < 0 || now - seen > SURRA.staleMs) { delete pos[p._id]; return; }
    const prev = before[p._id];
    const km = kmOf(p), cities = Number.isInteger(p.cities) ? p.cities : -1;
    pos[p._id] = [idx, String(p.name || 'Traveller').slice(0, 24), String(p.avatar || 'bee').slice(0, 16), String(p.color || 'fjord').slice(0, 16), km, seen, cities];
    if (!st.booted) return; // the very first scan only learns where everyone is
    if (!prev) { if (seen > (st.scan || 0) - 120e3) events.push({ kind: 'near', who: p._id, idx: idx }); } // joined since the last look
    else if (km > (prev[4] || 0)) events.push({ kind: 'pass', who: p._id, fromKm: prev[4] || 0, km: km, idx: idx });
  });
  if (full) { // stale entries fall away on full scans
    Object.keys(pos).forEach(uid => { if (now - pos[uid][5] > SURRA.staleMs) delete pos[uid]; });
    st.full = now;
  }
  const flat = m => Object.keys(m).sort().map(u => u + ':' + m[u].join('|')).join(';');
  const changed = flat(pos) !== flat(before);
  st.pos = pos; st.scan = now; st.booted = true;
  if (changed || now - (st.rosterAt || 0) > 2 * 3600e3) { writeRoster(pos, now); st.rosterAt = now; }
  if (events.length) rivalAlerts(st, events, now);
}
function writeRoster(pos, now) {
  const list = Object.keys(pos).map(uid => {
    const p = pos[uid], r = { u: uid, n: p[1], a: p[2], c: p[3], s: ORDER[p[0]], x: p[4], k: p[4], t: p[5] };
    if (p[6] != null && p[6] >= 0) r.y = p[6];
    return r;
  });
  FS.patch('shared/roster', { at: now, list: list });
  const counts = {}; let active = 0;
  list.forEach(r => { counts[r.s] = (counts[r.s] || 0) + 1; if (now - r.t < 7 * 864e5) active++; });
  FS.patch('public/map', { at: now, counts: counts, total: list.length, active: active });
}
function rivalAlerts(st, events, now) {
  const pos = st.pos, targets = {};
  events.forEach(ev => {
    const who = pos[ev.who]; if (!who) return;
    Object.keys(pos).forEach(uid => {
      if (uid === ev.who || targets[uid]) return;
      const at = pos[uid][0], km = pos[uid][4] || 0, near = Math.abs(at - ev.idx) <= SURRA.range;
      // overtaken: they had more kilometres than this player before the scan and fewer now
      const hit = ev.kind === 'pass' ? near && km >= ev.fromKm && km < ev.km : near;
      if (hit) targets[uid] = { kind: ev.kind, name: who[1], stop: ORDER[ev.idx], gap: Math.abs(at - ev.idx), km: ev.km, lead: ev.km - km };
    });
  });
  const uids = Object.keys(targets); if (!uids.length) return;
  const docs = FS.getMany(uids.map(u => 'notify/' + u));
  uids.forEach(uid => safe('rival ' + uid, () => {
    const n = docs['notify/' + uid];
    if (!wants(n, 'rivals')) return;
    const day = localDay(n.tz, now); if (st.rival[uid] === day) return; // one a day at most
    st.rival[uid] = day;
    const t = targets[uid];
    deliver(st, uid, n, t.kind === 'pass' ? msgPassed(t.name, t.stop, t.lead) : msgNear(t.name, t.stop, t.gap), { ttl: 12 * 3600 }, 'rivals');
  }));
}

/* ---------- delivery: now, or in the morning if it's night where they are */
function wants(n, kind) {
  if (!n || !Array.isArray(n.subs) || !n.subs.length) return false;
  const p = Object.assign({}, DEFAULT_PREFS, n.push || {});
  return p[kind] === true;
}
function deliver(st, uid, n, msg, opts, kind) {
  if (isQuiet(n.tz, Date.now())) {
    st.held.push({ uid: uid, kind: kind, msg: msg, ttl: Math.round(opts.ttl || 86400), urgency: opts.urgency || 'normal', at: Date.now() });
    st.dirty = true;
    return 'held';
  }
  return pushTo(uid, n, msg, opts) ? 'sent' : 'not delivered';
}
function sendHeld(st, now) {
  if (!st.held.length) return;
  const keep = [], docs = FS.getMany(unique(st.held.map(h => 'notify/' + h.uid)));
  st.held.forEach(h => {
    const n = docs['notify/' + h.uid], age = (now - h.at) / 1000;
    if (!n || age > 36 * 3600 || age > h.ttl || !wants(n, h.kind)) return;
    if (isQuiet(n.tz, now)) { keep.push(h); return; }
    safe('held ' + h.uid, () => pushTo(h.uid, n, h.msg, { ttl: Math.max(600, h.ttl - age), urgency: h.urgency }));
  });
  st.held = keep.slice(-500);
}
function pushTo(uid, n, msg, opts) {
  const gone = []; let sent = 0;
  (n.subs || []).forEach(sub => {
    let r = 'error';
    try { r = sendPush(sub, Object.assign({}, msg, { at: Date.now() }), opts || {}); } catch (err) { console.warn('push to ' + uid + ': ' + err); }
    if (r === 'ok') sent++;
    else if (r === 'gone' || r === 'invalid') gone.push(sub && sub.e);
  });
  if (gone.length) safe('drop', () => {
    const fresh = FS.get('notify/' + uid); if (!fresh) return;
    FS.patch('notify/' + uid, { subs: (fresh.subs || []).filter(s => gone.indexOf(s && s.e) < 0) }, ['subs'], true);
  });
  return sent;
}
function markChallenge(id, fields) { FS.patch('challenges/' + id, fields, Object.keys(fields), true); }

/* ---------- the messages */
const CITY_OF = sid => CITY[sid] || 'the road';
// what a challenge puts at stake: a quarter of the road between the two cities, 10 to 100 km, nothing in a safehouse
const CUM_KM = (() => { let t = 0; const o = {}; ORDER.forEach(sid => { t += ROAD_KM[sid] || 0; o[sid] = t; }); return o; })();
function stakeFor(a, b) {
  if (SAFEHOUSES.indexOf(a) >= 0 || SAFEHOUSES.indexOf(b) >= 0) return 0;
  const d = Math.abs((CUM_KM[a] || 0) - (CUM_KM[b] || 0));
  return Math.max(KM_RULES.stakeMin, Math.min(KM_RULES.stakeMax, Math.round(d / 4 / 5) * 5));
}
const raceStake = sid => (SAFEHOUSES.indexOf(sid) >= 0 ? 0 : KM_RULES.raceStake);
const secs = ms => Math.round((Number(ms) || 0) / 1000) + ' s';
const cityCount = n => (n === 1 ? 'one city' : n + ' cities');
function outcome(c) {
  if (c.status !== 'done' || c.toScore == null) return null;
  if (c.toScore !== c.fromScore) return c.toScore > c.fromScore ? 'to' : 'from';
  if (c.toMs !== c.fromMs) return c.toMs < c.fromMs ? 'to' : 'from';
  return 'tie';
}
function msgChallenge(c) {
  const stake = stakeFor(c.fromStop, c.toStop);
  return { title: c.fromName + ' challenged you', body: c.fromScore + ' of 8 right in ' + secs(c.fromMs) + '. ' + (stake ? stake + ' km at stake. ' : '') + 'Can you beat it? You have 48 hours.', tag: 'duel-' + c._id, url: './?open=challenges' };
}
function msgResult(c) {
  const base = { tag: 'result-' + c._id, url: './?open=challenges' };
  if (c.status === 'declined') return Object.assign(base, { title: c.toName + ' declined your challenge', body: 'No harm done. Try someone else near you.' });
  const o = outcome(c), you = c.fromScore, them = c.toScore;
  const stake = stakeFor(c.fromStop, c.toStop);
  if (o === 'from') return Object.assign(base, { title: 'You beat ' + c.toName + '!', body: you + '–' + them + '. ' + (stake ? '+' + stake + ' km on your road.' : 'A friendly win.') });
  if (o === 'to') return Object.assign(base, { title: c.toName + ' won your challenge', body: them + '–' + you + '. ' + (stake ? 'The ' + stake + ' km at stake went to ' + c.toName + '. ' : '') + 'A rematch is one tap away.' });
  return Object.assign(base, { title: 'A tie with ' + c.toName, body: you + '–' + them + ' in the same time. Nobody gains or loses.' });
}
function msgExpiring(c) {
  return { title: 'Six hours left to answer ' + c.fromName, body: c.fromName + "'s challenge expires soon. 8 replies, 15 seconds each.", tag: 'duel-' + c._id, url: './?open=challenges' };
}
function msgReminder(n) {
  const next = n.next ? ' Next up: ' + n.next + '.' : '';
  return { title: 'Time for ' + CITY_OF(n.stop) + '?', body: 'One short lesson moves you down the road.' + next, tag: 'practice', url: './' };
}
function msgPassed(name, stop, lead) {
  return { title: name + ' just overtook you', body: (lead > 0 ? 'They lead you by ' + lead + ' km, in ' : "They're in ") + CITY_OF(stop) + '. Challenge them, or take a lesson to win it back.', tag: 'rival', url: './?open=players' };
}
function msgRace(r) {
  const stake = raceStake(r.stop);
  return { title: r.an + ' wants to race you now!', body: 'A typing race in ' + CITY_OF(r.stop) + (stake ? ', ' + stake + ' km to the winner' : ', just for fun') + '. Tap to join in the next two minutes.', tag: 'race-' + r._id, url: './?open=race&race=' + r._id };
}
function msgNear(name, stop, gap) {
  return { title: name + ' joined near you', body: (gap === 0 ? 'A new player is in ' + CITY_OF(stop) + ', right where you are.' : 'A new player is in ' + CITY_OF(stop) + ', ' + cityCount(gap) + ' from you.') + ' Say hej with a challenge?', tag: 'rival', url: './?open=players' };
}
function msgInvite(name) {
  return { title: (name || 'Your friend') + ' joined from your invite', body: 'Find them on the players map and challenge them when you are close.', tag: 'invite', url: './?open=players' };
}

/* ================= web push (RFC 8291 encryption, RFC 8292 VAPID) ================= */
function sendPush(sub, msg, opts) {
  if (!sub || !validEndpoint(sub.e) || !sub.k || !sub.a) return 'invalid';
  const body = encryptPush(sub, JSON.stringify(msg));
  const headers = { Authorization: vapidHeader(sub.e), 'Content-Encoding': 'aes128gcm', TTL: String(Math.max(60, Math.round(opts.ttl || 86400))), Urgency: opts.urgency || 'normal' };
  if (opts.topic) headers.Topic = opts.topic;
  const res = UrlFetchApp.fetch(sub.e, { method: 'post', contentType: 'application/octet-stream', payload: toJavaBytes(body), headers: headers, muteHttpExceptions: true });
  const code = res.getResponseCode();
  if (code >= 200 && code < 300) return 'ok';
  if (code === 404 || code === 410) return 'gone';
  console.warn('push service said ' + code + ': ' + String(res.getContentText()).slice(0, 200));
  return 'error';
}
function validEndpoint(url) {
  const m = /^https:\/\/([^/:?#]+)(:\d+)?\//.exec(String(url || ''));
  return !!m && SURRA.pushHosts.some(re => re.test(m[1].toLowerCase()));
}
function encryptPush(sub, text) {
  const C = SurraCrypto, uaPublic = b64uDecode(sub.k), authSecret = b64uDecode(sub.a);
  const asPrivate = C.p256.utils.randomPrivateKey(), asPublic = C.p256.getPublicKey(asPrivate, false);
  const shared = C.p256.getSharedSecret(asPrivate, uaPublic, true).slice(1); // the x coordinate
  const ikm = C.hkdf(C.sha256, shared, authSecret, C.concatBytes(utf8('WebPush: info\u0000'), uaPublic, asPublic), 32);
  const salt = C.randomBytes(16);
  const cek = C.hkdf(C.sha256, ikm, salt, utf8('Content-Encoding: aes128gcm\u0000'), 16);
  const nonce = C.hkdf(C.sha256, ikm, salt, utf8('Content-Encoding: nonce\u0000'), 12);
  const sealed = C.gcm(cek, nonce).encrypt(C.concatBytes(utf8(text), new Uint8Array([2]))); // one record, padding delimiter 2
  const head = new Uint8Array(21 + asPublic.length);
  head.set(salt, 0);
  new DataView(head.buffer).setUint32(16, 4096);
  head[20] = asPublic.length;
  head.set(asPublic, 21);
  return C.concatBytes(head, sealed);
}
function vapidHeader(endpoint) {
  const aud = /^https:\/\/[^/]+/.exec(endpoint)[0], cache = CacheService.getScriptCache(), key = 'vapid:' + aud;
  const hit = cache.get(key); if (hit) return hit;
  const k = vapidKeys(), now = Math.floor(Date.now() / 1000), enc = o => b64uEncode(utf8(JSON.stringify(o)));
  const input = enc({ typ: 'JWT', alg: 'ES256' }) + '.' + enc({ aud: aud, exp: now + 12 * 3600, sub: SURRA.contact });
  const sig = SurraCrypto.p256.sign(SurraCrypto.sha256(utf8(input)), k.priv).toCompactRawBytes();
  const header = 'vapid t=' + input + '.' + b64uEncode(sig) + ', k=' + k.pubText;
  cache.put(key, header, 6 * 3600);
  return header;
}
function vapidKeys() {
  const p = PropertiesService.getScriptProperties(), priv = p.getProperty('VAPID_PRIVATE'), pub = p.getProperty('VAPID_PUBLIC');
  if (!priv || !pub) throw new Error('The VAPID keys are missing. Run setup() first.');
  return { priv: b64uDecode(priv), pubText: pub };
}

/* ================= Firestore over REST, with the script owner's access ================= */
const FS = {
  userProject: true,
  base: () => 'https://firestore.googleapis.com/v1/projects/' + SURRA.project + '/databases/(default)/documents',
  name: path => 'projects/' + SURRA.project + '/databases/(default)/documents/' + path,
  call(method, url, body) {
    const headers = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
    if (FS.userProject) headers['x-goog-user-project'] = SURRA.project;
    const opts = { method: method, headers: headers, muteHttpExceptions: true };
    if (body !== undefined) { opts.contentType = 'application/json'; opts.payload = JSON.stringify(body); }
    const res = UrlFetchApp.fetch(url, opts), code = res.getResponseCode(), text = res.getContentText();
    if (code === 404) return null;
    if (code === 403 && FS.userProject && /USER_PROJECT_DENIED|serviceusage/i.test(text)) { FS.userProject = false; return FS.call(method, url, body); }
    if (code >= 300) throw new Error('Firestore ' + method + ' ' + code + ': ' + String(text).slice(0, 300));
    return text ? JSON.parse(text) : {};
  },
  get(path) { const d = FS.call('get', FS.base() + '/' + path); return d && d.name ? fromDoc(d) : null; },
  getMany(paths) {
    const out = {}; if (!paths.length) return out;
    for (let i = 0; i < paths.length; i += 100) {
      (FS.call('post', FS.base() + ':batchGet', { documents: paths.slice(i, i + 100).map(FS.name) }) || []).forEach(x => { if (x.found) { const d = fromDoc(x.found); out[d._path] = d; } });
    }
    return out;
  },
  query(q) { return (FS.call('post', FS.base() + ':runQuery', { structuredQuery: q }) || []).filter(x => x.document).map(x => fromDoc(x.document)); },
  patch(path, data, mask, mustExist) {
    const qs = (mask || []).map(f => 'updateMask.fieldPaths=' + encodeURIComponent(f));
    if (mustExist) qs.push('currentDocument.exists=true');
    return FS.call('patch', FS.base() + '/' + path + (qs.length ? '?' + qs.join('&') : ''), { fields: toFields(data) });
  },
};
const OPS = { '==': 'EQUAL', '>': 'GREATER_THAN', '>=': 'GREATER_THAN_OR_EQUAL', '<': 'LESS_THAN', '<=': 'LESS_THAN_OR_EQUAL' };
function where(field, op, value) { return { fieldFilter: { field: { fieldPath: field }, op: OPS[op], value: toValue(value) } }; }
function and() { const f = Array.prototype.slice.call(arguments); return { compositeFilter: { op: 'AND', filters: f } }; }
function select(collection, filter, opts) {
  const q = { from: [{ collectionId: collection }] };
  if (filter) q.where = filter;
  if (opts && opts.orderBy) q.orderBy = opts.orderBy;
  if (opts && opts.limit) q.limit = opts.limit;
  return q;
}
function toValue(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'string') return { stringValue: v };
  if (v instanceof Date) return { timestampValue: v.toISOString() };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
  return { mapValue: { fields: toFields(v) } };
}
function toFields(o) { const f = {}; Object.keys(o).forEach(k => { if (o[k] !== undefined && k.charAt(0) !== '_') f[k] = toValue(o[k]); }); return f; }
function fromValue(v) {
  if (!v) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return Date.parse(v.timestampValue);
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
  if ('mapValue' in v) return fromFields(v.mapValue.fields);
  return null;
}
function fromFields(f) { const o = {}; Object.keys(f || {}).forEach(k => { o[k] = fromValue(f[k]); }); return o; }
function fromDoc(d) { const o = fromFields(d.fields), path = d.name.split('/documents/')[1]; o._path = path; o._id = path.split('/').pop(); return o; }

/* ---------- the notifier's own bookkeeping in meta/state (no app can read it) */
function loadState() {
  const d = FS.get('meta/state') || {};
  // state from before kilometres kept XP in pos: forget positions once so the next scan doesn't see everyone overtaking
  const old = d.v !== 2;
  return {
    v: 2, tick: d.tick || 0, hour: d.hour || '', scan: d.scan || 0, full: old ? 0 : d.full || 0, rosterAt: d.rosterAt || 0, booted: old ? false : !!d.booted,
    pos: old ? {} : d.pos || {}, held: d.held || [], streak: d.streak || {}, rival: d.rival || {}, ref: d.ref || {}, dirty: false,
  };
}
function saveState(st) {
  const copy = Object.assign({}, st); delete copy.dirty;
  FS.patch('meta/state', copy);
  st.dirty = false;
}
function prune(st, now) {
  const old = (day, days) => !day || Date.parse(day) < now - days * 864e5;
  Object.keys(st.streak).forEach(u => { if (old(st.streak[u], 3)) delete st.streak[u]; });
  Object.keys(st.rival).forEach(u => { if (old(st.rival[u], 3)) delete st.rival[u]; });
  Object.keys(st.ref).forEach(u => { if (now - st.ref[u] > 120 * 864e5) delete st.ref[u]; });
}

/* ================= helpers ================= */
function reply(text) { return ContentService.createTextOutput(String(text)).setMimeType(ContentService.MimeType.TEXT); }
function safe(label, fn) { try { return fn(); } catch (err) { console.error(label + ': ' + (err && err.stack || err)); return null; } }
function unique(a) { return a.filter((x, i) => a.indexOf(x) === i); }
function localDay(tz, t) { return Utilities.formatDate(new Date(t || Date.now()), tz || SURRA.tz, 'yyyy-MM-dd'); }
function localHour(tz, t) { return Number(Utilities.formatDate(new Date(t || Date.now()), tz || SURRA.tz, 'H')); }
function isQuiet(tz, t) { const h = localHour(tz, t); return h >= SURRA.quiet[0] || h < SURRA.quiet[1]; }
function hoursToMidnight(tz, t) { const d = new Date(t || Date.now()); return 24 - localHour(tz, t) - Number(Utilities.formatDate(d, tz || SURRA.tz, 'm')) / 60; }
function utf8(s) { return new TextEncoder().encode(String(s)); }
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
function b64uEncode(bytes) {
  let out = '', i = 0;
  for (; i + 2 < bytes.length; i += 3) { const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]; out += B64[n >> 18] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63]; }
  if (i < bytes.length) { const n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8); out += B64[n >> 18] + B64[(n >> 12) & 63] + (i + 1 < bytes.length ? B64[(n >> 6) & 63] : ''); }
  return out;
}
function b64uDecode(str) {
  const s = String(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''), out = [];
  let buf = 0, bits = 0;
  for (let i = 0; i < s.length; i++) {
    const v = B64.indexOf(s[i]); if (v < 0) throw new Error('bad base64');
    buf = (buf << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out.push((buf >> bits) & 255); }
  }
  return new Uint8Array(out);
}
function toJavaBytes(u8) { const a = new Array(u8.length); for (let i = 0; i < u8.length; i++) a[i] = u8[i] > 127 ? u8[i] - 256 : u8[i]; return a; }

/* ================= set-up and checks (run these from the Apps Script editor) ================= */
function setup() {
  selfTest();
  const p = PropertiesService.getScriptProperties();
  if (!p.getProperty('VAPID_PRIVATE')) {
    const priv = SurraCrypto.p256.utils.randomPrivateKey();
    p.setProperties({ VAPID_PRIVATE: b64uEncode(priv), VAPID_PUBLIC: b64uEncode(SurraCrypto.p256.getPublicKey(priv, false)) });
  }
  FS.query(select('players', null, { limit: 1 })); // proves Firestore access before anything is scheduled
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'tick').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('tick').timeBased().everyMinutes(10).create();
  tick();
  console.log('The Surra notifier is running: it checks in every 10 minutes.\nVAPID public key (Surra\'s src/config.js, notifier.vapid):\n' + p.getProperty('VAPID_PUBLIC'));
}
function testPush() {
  const docs = FS.query(select('notify', null, { orderBy: [{ field: { fieldPath: 'updatedAt' }, direction: 'DESCENDING' }], limit: 10 }));
  const n = docs.filter(d => (d.subs || []).length)[0];
  if (!n) { console.log('No device has notifications on yet. Turn them on in Surra (Me, then Notifications) and run this again.'); return; }
  const sent = pushTo(n._id, n, { title: 'Hej från Surra!', body: 'Notifications are working. Lycka till på resan!', tag: 'test', url: './' }, { ttl: 3600, urgency: 'high' });
  console.log('Sent to ' + sent + ' of ' + n.subs.length + ' device(s) for ' + (n.name || n._id) + '.');
}
function status() {
  const st = loadState();
  console.log(JSON.stringify({
    version: NOTIFIER_VERSION, lastTick: st.tick ? new Date(st.tick).toISOString() : null, onMap: Object.keys(st.pos).length,
    heldForMorning: st.held.length, triggers: ScriptApp.getProjectTriggers().map(t => t.getHandlerFunction()),
    vapid: PropertiesService.getScriptProperties().getProperty('VAPID_PUBLIC'),
  }, null, 2));
}
function selfTest() {
  // a full round trip: encrypt for a made-up browser, decrypt as that browser would, check the VAPID signature
  const C = SurraCrypto, uaPriv = C.p256.utils.randomPrivateKey(), uaPub = C.p256.getPublicKey(uaPriv, false), auth = C.randomBytes(16);
  const msg = JSON.stringify({ title: 'Hej', body: 'åäö ✓' });
  const body = encryptPush({ k: b64uEncode(uaPub), a: b64uEncode(auth) }, msg);
  const salt = body.slice(0, 16), keyLen = body[20], asPub = body.slice(21, 21 + keyLen), sealed = body.slice(21 + keyLen);
  const shared = C.p256.getSharedSecret(uaPriv, asPub, true).slice(1);
  const ikm = C.hkdf(C.sha256, shared, auth, C.concatBytes(utf8('WebPush: info\u0000'), uaPub, asPub), 32);
  const plain = C.gcm(C.hkdf(C.sha256, ikm, salt, utf8('Content-Encoding: aes128gcm\u0000'), 16), C.hkdf(C.sha256, ikm, salt, utf8('Content-Encoding: nonce\u0000'), 12)).decrypt(sealed);
  const text = decodeURIComponent(escape(String.fromCharCode.apply(null, plain.slice(0, -1))));
  if (text !== msg || plain[plain.length - 1] !== 2) throw new Error('Self-test failed: push encryption round trip');
  const k = C.p256.utils.randomPrivateKey(), h = C.sha256(utf8('surra'));
  if (!C.p256.verify(C.p256.sign(h, k).toCompactRawBytes(), h, C.p256.getPublicKey(k))) throw new Error('Self-test failed: signatures');
  console.log('Self-test passed: push encryption and signatures work here.');
}
