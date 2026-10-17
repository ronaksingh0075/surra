/* ================= Surra typing races against another player, live =================
   Race someone in your city to the blomma: you both type the same paragraph from the same moment and watch each
   other's bee. The host creates races/{id}; the other player has two minutes to join (the notifier pings them,
   and an open app checks every half minute). Both start at the same server moment, five seconds after the join,
   each sends their progress about once a second, and the first to finish wins: the race is decided as soon as
   the other player can no longer beat the winner's time. Ten kilometres are at stake, nothing in a safehouse.
   Firestore: races/{id} (only the two players can read it or change their own side). */
const LRACE = { inviteMs: 120e3, leadMs: 5000, maxMs: 240e3, settleMs: 3000, tickMs: 1000, pollMs: 30e3 };
const RACES = cell({ invites: [], at: 0 });
const rc = { timer: 0, pulling: false, last: 0, closed: new Set(), live: null }; // live: the race on screen right now, which settles itself
const raceDocId = uid => 'r' + String(9999999999999 - Date.now()).padStart(13, '0') + '_' + uid.slice(0, 8);
function normRace(id, x) {
  return { id, ...x, created: tsMs(x.created), joined: tsMs(x.joined), text: Number(x.text) || 0, len: Number(x.len) || 0,
    pa: Number(x.pa) || 0, pb: Number(x.pb) || 0, ta: x.ta == null ? null : Number(x.ta), tb: x.tb == null ? null : Number(x.tb) };
}
const raceSide = (r, uid) => (r.a === uid ? 'a' : r.b === uid ? 'b' : null);
const raceRival = (r, side) => (side === 'a' ? { uid: r.b, name: r.bn, avatar: r.ba, color: r.bc } : { uid: r.a, name: r.an, avatar: r.aa, color: r.ac });
const inviteOpen = (r, now = Date.now()) => r.status === 'open' && !!r.created && now - r.created < LRACE.inviteMs;
// 'a' | 'b' | 'tie' | 'none' (nobody finished in time) | null (still running). `now` is server time if known.
function raceOutcome(r, now) {
  if (r.status !== 'on' || !r.joined) return null;
  const el = now - (r.joined + LRACE.leadMs);
  if (r.ta != null && r.tb != null) return r.ta < r.tb ? 'a' : r.tb < r.ta ? 'b' : 'tie';
  const first = r.ta != null ? ['a', r.ta] : r.tb != null ? ['b', r.tb] : null;
  if (first) return el > first[1] + LRACE.settleMs ? first[0] : null;
  return el > LRACE.maxMs ? 'none' : null;
}
function canRace(s, target) {
  const uid = meUid();
  if (!onMap(s)) return { ok: false, why: 'Join the players map to race other players' };
  if (target.uid === uid) return { ok: false, why: "That's you" };
  if (target.stop !== mapStop(s)) return { ok: false, why: `Typing races are for players in the same city` };
  return { ok: true, online: isOnline(target) };
}

/* ---------- the race document */
async function createRace(target) {
  const s = S(), uid = meUid(), rec = myRecord(s), F = acct.F, id = raceDocId(uid);
  try { await publishMe(true); } catch (e) { /* the rules check the city from the map entry */ }
  const text = raceTextIndex(STOPS[rec.stop].level);
  const t0 = Date.now();
  await F.setDoc(F.doc(acct.db, 'races', id), {
    a: uid, b: target.uid, an: rec.name, aa: rec.avatar, ac: rec.color,
    bn: String(target.name || 'Traveller').slice(0, 24), ba: String(target.avatar || 'bee').slice(0, 16), bc: String(target.color || 'fjord').slice(0, 16),
    stop: rec.stop, text, len: raceText(text).length, status: 'open', created: F.serverTimestamp(), v: 1,
  });
  pingNotifier('race', id);
  return { id, sent: [t0, Date.now()] };
}
async function getRace(id) {
  const snap = await acct.F.getDoc(acct.F.doc(acct.db, 'races', id));
  return snap.exists() ? normRace(id, snap.data()) : null;
}
async function acceptRace(r) {
  const F = acct.F, t0 = Date.now();
  await F.updateDoc(F.doc(acct.db, 'races', r.id), { status: 'on', joined: F.serverTimestamp() });
  return { sent: [t0, Date.now()] };
}
async function closeRace(r) { // decline an invite, or take your own back
  rc.closed.add(r.id);
  RACES.set({ ...RACES.get(), invites: RACES.get().invites.filter(x => x.id !== r.id) });
  try { await acct.F.updateDoc(acct.F.doc(acct.db, 'races', r.id), { status: 'off' }); } catch (e) { /* expires on its own */ }
}
function sendRaceProgress(r, side, p, t) {
  const F = acct.F, d = { ['p' + side]: Math.max(0, Math.min(r.len, Math.round(p))) };
  if (t != null) d['t' + side] = Math.max(0, Math.round(t));
  return F.updateDoc(F.doc(acct.db, 'races', r.id), d);
}
// estimate how far this device's clock is from the server's: a server timestamp written between t0 and t1
const clockOffset = (serverMs, [t0, t1]) => (serverMs ? serverMs - (t0 + t1) / 2 : 0);

/* ---------- settling a race once: the winner gains the stake, the loser gives it up */
function applyRace(r, outcome) {
  const uid = meUid(), side = raceSide(r, uid), done = (S().community.races || {})[r.id];
  if (!side || done || !outcome) return done || null;
  const res = outcome === 'none' ? 'none' : outcome === 'tie' ? 'tie' : outcome === side ? 'won' : 'lost', stake = raceStakeAt(r.stop);
  let km = 0;
  update(st => {
    const L = st.community.races = st.community.races || {};
    if (L[r.id]) return;
    if (res === 'won') km = addResultKm(st, stake);
    if (res === 'lost') km = addResultKm(st, -stake);
    const mine = r['t' + side];
    if (res !== 'none') { st.stats.races = (st.stats.races || 0) + 1; if (res === 'won') st.stats.raceWins = (st.stats.raceWins || 0) + 1; }
    if (mine) st.stats.bestWpm = Math.max(st.stats.bestWpm || 0, wpmOf(r.len, mine));
    L[r.id] = { t: Date.now(), r: res, km };
    const cut = Date.now() - 90 * 864e5; for (const [k, v] of Object.entries(L)) if (!v || (v.t || 0) < cut) delete L[k];
  });
  schedulePublish();
  return { r: res, km };
}

/* ---------- looking for invites (and settling races you left early) */
async function pollRaces(full) {
  if (!onMap(S()) || rc.pulling) return;
  rc.pulling = true; rc.last = Date.now();
  const F = acct.F, uid = meUid(), col = F.collection(acct.db, 'races');
  try {
    const qs = [F.getDocs(F.query(col, F.where('b', '==', uid), F.limit(20)))];
    if (full) qs.push(F.getDocs(F.query(col, F.where('a', '==', uid), F.limit(20))));
    const snaps = await Promise.all(qs), list = [];
    snaps.forEach(sn => sn.forEach(d => list.push(normRace(d.id, d.data()))));
    const now = Date.now(), invites = list.filter(r => r.b === uid && inviteOpen(r, now) && !rc.closed.has(r.id));
    const before = new Set(RACES.get().invites.map(r => r.id));
    RACES.set({ invites, at: now });
    const fresh = invites.filter(r => !before.has(r.id));
    if (fresh.length) { sfx('tick'); toast(`${fresh[0].an} wants to race you to the blomma!`, 'flower'); }
    for (const r of list) {
      const o = raceOutcome(r, now);
      if (o && r.id !== rc.live) applyRace(r, o);
      // tidy up after three days, so a player who was away still settles the race when they're back
      const old = now - (r.created || now) > 3 * 864e5;
      if (old && (o || r.status !== 'on' || !inviteOpen(r, now))) { try { await F.deleteDoc(F.doc(acct.db, 'races', r.id)); } catch (e) { /* the other player may have removed it */ } }
    }
  } catch (e) { /* offline, or the races rules aren't live yet */ }
  rc.pulling = false;
}
function initRaces() {
  if (BUILD !== 'pwa') return;
  // invites every half minute while the app is open; the players-map tick (every two minutes) also settles races
  const tick = () => { if (document.visibilityState === 'visible' && onMap(S())) pollRaces(false); };
  clearInterval(rc.timer);
  rc.timer = setInterval(tick, LRACE.pollMs);
}
