/* ================= Surra players map and challenges (installable app with profiles) =================
   Opt-in: a player appears on the shared map after choosing to join. Players in the same city or up to two cities
   apart can challenge each other: the same 8 reply questions for both, played one after the other. More right
   answers wins, the faster total time breaks a tie. The winner stays; the loser's marker on the players map drops
   back one city (their own lessons, stars and stamps are untouched) and each lesson they finish moves it forward again.
   Firestore: players/{uid} (public to signed-in players), challenges/{id} (only the two players). */
const DUEL = { questions: 8, perQuestion: 15000, range: 2, maxOpen: 3, expireMs: 48 * 3600e3, staleMs: 30 * 24 * 3600e3, winXp: 25, perRight: 5 };
const COMM = cell({ players: [], playersAt: 0, loading: false, error: null, challenges: [], challengesAt: 0 });
const setComm = p => COMM.set({ ...COMM.get(), ...p });
const comm = { timer: 0, lastPull: 0, published: null, publishTimer: 0, session: false };

/* ---------- where you stand on the players map: your journey position, minus cities lost in challenges */
const journeyIdx = s => Math.max(0, ORDER.indexOf(currentStop(s)));
const mapIdx = s => Math.max(0, journeyIdx(s) - ((s.community && s.community.setback) || 0));
const mapStop = s => ORDER[mapIdx(s)];
const commOn = () => ACCT.get().status !== 'off';
// only once this device holds the account's own progress (right after sign-in it may still hold guest progress)
const commReady = () => ACCT.get().status === 'ready' && !!acct.db && !!meUid() && S().owner === meUid();
const meUid = () => (ACCT.get().user && ACCT.get().user.uid) || null;
const onMap = s => !!(s.community && s.community.joined) && commReady();
const tsMs = v => (v && typeof v.toMillis === 'function' ? v.toMillis() : typeof v === 'number' ? v : 0);

function myRecord(s) {
  const p = s.profile || {};
  return {
    name: ((p.name || '').trim() || 'Traveller').slice(0, 24), avatar: String(p.avatar || 'bee').slice(0, 16),
    color: String(p.color || 'fjord').slice(0, 16), stop: mapStop(s), xp: Math.max(0, Math.round(s.xp || 0)),
  };
}

/* ---------- your own entry on the map */
async function publishMe(force) {
  const s = S(); if (!onMap(s)) return;
  const rec = myRecord(s), key = JSON.stringify(rec);
  if (!force && key === comm.published) return;
  const F = acct.F;
  await F.setDoc(F.doc(acct.db, 'players', meUid()), { ...rec, updatedAt: F.serverTimestamp(), v: 1 });
  comm.published = key;
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
async function purgeCommunity(uid) { // account deletion: remove the map entry and every challenge you were part of
  const F = acct.F, col = F.collection(acct.db, 'challenges');
  for (const field of ['from', 'to']) {
    try {
      const snap = await F.getDocs(F.query(col, F.where(field, '==', uid), F.limit(200)));
      const ids = []; snap.forEach(d => ids.push(d.id));
      for (const id of ids) { try { await F.deleteDoc(F.doc(acct.db, 'challenges', id)); } catch (e) { /* keep going */ } }
    } catch (e) { /* keep going */ }
  }
  try { await F.deleteDoc(F.doc(acct.db, 'players', uid)); } catch (e) { /* already gone */ }
  setComm({ players: [], challenges: [] });
}

/* ---------- reading the map
   The notifier keeps a roster of everyone on the map in shared/roster (one read instead of one per player); on top
   of it we fetch only the entries that changed since it was written. Without a fresh roster, read the map directly. */
const ROSTER_FRESH = 3 * 3600e3;
async function refreshPlayers() {
  if (!commReady()) return;
  setComm({ loading: true, error: null });
  try {
    const F = acct.F, col = F.collection(acct.db, 'players'), cutoff = Date.now() - DUEL.staleMs, byUid = new Map();
    const add = (uid, x, seen) => {
      if (!ORDER.includes(x.stop) || (seen && seen < cutoff)) { byUid.delete(uid); return; }
      byUid.set(uid, { uid, name: String(x.name || 'Traveller'), avatar: x.avatar || 'bee', color: x.color || 'fjord', stop: x.stop, xp: Number(x.xp) || 0, seen });
    };
    let roster = null;
    try { const r = await F.getDoc(F.doc(acct.db, 'shared', 'roster')); roster = r.exists() ? r.data() : null; } catch (e) { roster = null; }
    const fresh = roster && Array.isArray(roster.list) && Number(roster.at) > Date.now() - ROSTER_FRESH;
    if (fresh) roster.list.forEach(r => { if (r && r.u) add(r.u, { name: r.n, avatar: r.a, color: r.c, stop: r.s, xp: r.x }, Number(r.t) || 0); });
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
/* settle each finished duel once: the loser's marker drops back a city, the winner earns a bonus */
function applyResults(list, announce) {
  const uid = meUid(), s = S(), done = s.community.applied || {};
  const fresh = list.filter(c => c.status === 'done' && (c.from === uid || c.to === uid) && !done[c.id]);
  if (!fresh.length) return;
  let msgs = [];
  update(st => {
    const ap = st.community.applied;
    for (const c of fresh) {
      const r = myResult(c, uid); if (!r) continue;
      ap[c.id] = { t: c.resolvedAt || Date.now(), r };
      if (r === 'won') { awardXP(st, DUEL.winXp); msgs.push([`You beat ${otherName(c, uid)} in a challenge! +${DUEL.winXp} XP`, 'swords']); }
      if (r === 'lost') {
        const before = mapIdx(st);
        st.community.setback = Math.min(journeyIdx(st), (st.community.setback || 0) + 1);
        const after = mapIdx(st);
        msgs.push([after < before ? `${otherName(c, uid)} won your challenge. You drop back to ${STOPS[ORDER[after]].city} on the players map` : `${otherName(c, uid)} won your challenge`, 'swords']);
      }
      if (r === 'tie') msgs.push([`Your challenge with ${otherName(c, uid)} was a tie`, 'swords']);
    }
    const cut = Date.now() - 90 * 24 * 3600e3; // forget settled duels after three months
    for (const [k, v] of Object.entries(ap)) if (!v || (v.t || 0) < cut) delete ap[k];
  });
  if (announce) msgs.forEach(([m, ic], i) => setTimeout(() => toast(m, ic), 300 + i * 900));
  schedulePublish();
}
function canChallenge(s, target, list) {
  const uid = meUid();
  if (!onMap(s)) return { ok: false, why: 'Join the players map to send challenges' };
  if (target.uid === uid) return { ok: false, why: "That's you" };
  const gap = Math.abs(ORDER.indexOf(target.stop) - mapIdx(s));
  if (gap > DUEL.range) return { ok: false, why: `Out of range: you can challenge players up to ${DUEL.range} cities away` };
  const between = list.filter(c => (c.from === uid && c.to === target.uid) || (c.to === uid && c.from === target.uid));
  if (between.some(c => c.status === 'pending' && !expired(c))) return { ok: false, why: 'A challenge between you is waiting' };
  if (between.some(c => c.created && dateStr(new Date(c.created)) === today())) return { ok: false, why: "You've already had a challenge today" };
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
  await F.setDoc(F.doc(acct.db, 'challenges', id), {
    from: uid, to: target.uid, fromName: rec.name, fromAvatar: rec.avatar, fromColor: rec.color, fromStop: rec.stop,
    toName: String(target.name).slice(0, 24), toAvatar: String(target.avatar).slice(0, 16), toColor: String(target.color).slice(0, 16), toStop: target.stop,
    qs, fromScore: score, fromMs: Math.round(ms), status: 'pending', created: F.serverTimestamp(), v: 1,
  });
  pingNotifier('new', id);
  update(st => { awardXP(st, score * DUEL.perRight); });
  refreshChallenges(true);
}
async function answerChallenge(c, score, ms) {
  const F = acct.F;
  await F.updateDoc(F.doc(acct.db, 'challenges', c.id), { status: 'done', toScore: score, toMs: Math.round(ms), resolvedAt: F.serverTimestamp() });
  pingNotifier('res', c.id);
  const settled = { ...c, status: 'done', toScore: score, toMs: Math.round(ms), resolvedAt: Date.now() };
  update(st => { awardXP(st, score * DUEL.perRight); });
  applyResults([settled], false);
  setComm({ challenges: COMM.get().challenges.map(x => (x.id === c.id ? settled : x)) });
  return myResult(settled, meUid());
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
   (every two minutes; push notifications bring the rest) */
function initCommunity() {
  if (BUILD !== 'pwa') return;
  const tick = () => { if (document.visibilityState === 'visible' && onMap(S())) refreshChallenges(); };
  let started = null;
  const maybeStart = () => { // start when an account's progress is in place, stop on sign-out
    const uid = commReady() ? meUid() : null;
    if (uid === started) return;
    started = uid;
    clearInterval(comm.timer);
    if (!uid) { comm.published = null; setComm({ players: [], challenges: [], playersAt: 0, challengesAt: 0 }); return; }
    if (onMap(S())) publishMe(true).catch(() => { /* next change */ });
    refreshChallenges(true);
    comm.timer = setInterval(tick, 120000);
  };
  ACCT.sub(maybeStart);
  STORE.sub(() => { maybeStart(); if (onMap(S())) schedulePublish(); });
  document.addEventListener('visibilitychange', tick);
  window.addEventListener('focus', tick);
}
