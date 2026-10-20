/* ================= Surra journey: kilometres on the road, the race standings and safehouses =================
   Kilometres replace XP. Each city's three lessons cover the real road into that city (Malmö to Ystad is 60 km),
   scaled by stars, so a perfect journey from Malmö to Kiruna is about 2,700 km. Lab lessons are 20 km side trips,
   and a passed checkpoint or a beaten boss bee is worth 50 km. Practice (reviews, Snabbsvar, replays, typing) earns detours: about 1 km
   per right answer, up to 40 km a day, so the standings follow the journey rather than grinding.
   Challenges put kilometres at stake: a quarter of the road between the two players' cities (10 to 100 km).
   Safehouses (Malmö, Göteborg, Stockholm, Umeå): nobody can challenge you there and you can't challenge from one.
   Trip kilometres are worked out from your stars, so they can't be counted twice; everything else (detours,
   challenge and race results) adds up in s.extraKm, which can be negative but never takes the total below 0. */
// road distance into each city from the one before it, in km (rounded to 5). Malmö: from Kastrup over the Öresund Bridge.
const ROAD_KM = {
  malmo: 30, ystad: 60, lund: 65, helsingborg: 55, goteborg: 215, jonkoping: 150, linkoping: 130, norrkoping: 45,
  orebro: 115, vasteras: 95, uppsala: 80, stockholm: 70, gavle: 175, sundsvall: 215, ostersund: 185, umea: 360,
  lulea: 265, jokkmokk: 195, gallivare: 95, kiruna: 120,
};
const SAFEHOUSES = ['malmo', 'goteborg', 'stockholm', 'umea'];
const KM = {
  share: { learn: 0.3, reply: 0.4, talk: 0.3 }, // of the road into the city, at three stars
  stars: [0, 0.5, 0.75, 1], // 1 star covers half of a lesson's share, 2 stars three quarters
  life: 20, checkpoint: 50, boss: 50, summit: 50, queen: 100, detourCap: 40,
  stakeMin: 10, stakeMax: 100, raceStake: 10,
};
const CUM_KM = (() => { let t = 0; const o = {}; ORDER.forEach(sid => { t += ROAD_KM[sid] || 0; o[sid] = t; }); return o; })();
const ROUTE_KM = CUM_KM[ORDER[ORDER.length - 1]];
const roadBetween = (a, b) => Math.abs((CUM_KM[a] || 0) - (CUM_KM[b] || 0));
const isSafe = sid => SAFEHOUSES.includes(sid);
const round5 = n => Math.round(n / 5) * 5;
const fmtKm = n => `${fmtN(Math.round(n || 0))} km`;
// what a challenge between two cities puts at stake (0 when either player is in a safehouse)
function stakeFor(a, b) {
  if (isSafe(a) || isSafe(b)) return 0;
  return Math.max(KM.stakeMin, Math.min(KM.stakeMax, round5(roadBetween(a, b) / 4)));
}
// a typing race in your city: a flat 10 km, friendly in a safehouse
const raceStakeAt = sid => (isSafe(sid) ? 0 : KM.raceStake);

/* ---------- trip kilometres, from stars */
function lessonKm(sid, lesson, stars) {
  const f = KM.stars[Math.max(0, Math.min(3, stars || 0))];
  if (!f) return 0;
  if (lesson === 'life') return Math.round(KM.life * f);
  return Math.round((ROAD_KM[sid] || 0) * (KM.share[lesson] || 0) * f);
}
function tripKm(s) {
  let t = 0;
  for (const sid of ORDER) {
    for (const l of ['learn', 'reply', 'talk']) t += lessonKm(sid, l, starsOf(s, sid, l));
    if (LIFE[sid]) t += lessonKm(sid, 'life', starsOf(s, sid, 'life'));
  }
  for (const id of LEVEL_IDS) if (s.checkpoints[id]) t += KM.checkpoint;
  for (const sid of Object.keys(BOSSES)) if (bossWon(s, sid)) t += KM.boss; // a beaten boss bee (bosses.js)
  if (climbSummit(s)) t += KM.summit; // the top of Kebnekaise (climb.js)
  if (climbWon(s)) t += KM.queen; // and the queen beaten up there
  return t;
}
const totalKm = s => Math.max(0, Math.round(tripKm(s) + (Number(s.extraKm) || 0)));
const citiesOf = s => ORDER.filter(sid => stopDone(s, sid)).length;
// the road into the city you're working on: how much of it your lessons there have covered
function legOf(s) {
  const sid = currentStop(s), total = ROAD_KM[sid] || 0;
  const got = Math.min(total, ['learn', 'reply', 'talk'].reduce((a, l) => a + lessonKm(sid, l, starsOf(s, sid, l)), 0));
  const i = ORDER.indexOf(sid);
  return { sid, from: i > 0 ? ORDER[i - 1] : null, total, got, left: Math.max(0, total - got) };
}

/* ---------- the day's kilometres (for the week chart and the notifier's "practised today") */
function logKm(s, n) {
  n = Math.round(n || 0);
  if (n > 0) {
    const t = today();
    s.log[t] = (s.log[t] || 0) + n;
    const keys = Object.keys(s.log).sort(); while (keys.length > 70) delete s.log[keys.shift()];
  }
  const h = new Date().getHours();
  if (h >= 22) addAch(s, 'night');
  if (h < 7) addAch(s, 'morning');
}
const todayKm = s => s.log[today()] || 0;
const weekKm = s => weekDays().reduce((a, d) => a + (s.log[d] || 0), 0);
const lastActive = s => Object.keys(s.log || {}).filter(d => s.log[d] > 0).sort().pop() || '';
// practice detours: about a kilometre per right answer, up to KM.detourCap a day. Returns what was added.
function addDetour(s, n) {
  const t = today();
  if (!s.detour || s.detour.d !== t) s.detour = { d: t, n: 0 };
  const add = Math.max(0, Math.min(Math.round(n || 0), KM.detourCap - s.detour.n));
  s.detour.n += add;
  s.extraKm = (Number(s.extraKm) || 0) + add;
  logKm(s, add);
  return add;
}
const detourLeft = s => (s.detour && s.detour.d === today() ? Math.max(0, KM.detourCap - s.detour.n) : KM.detourCap);
// a challenge or race result: + or -, and a loss never takes you below zero. Returns the change.
function addResultKm(s, n) {
  n = Math.round(n || 0);
  if (n > 0) { s.extraKm = (Number(s.extraKm) || 0) + n; logKm(s, n); return n; }
  const lose = Math.min(-n, totalKm(s));
  s.extraKm = (Number(s.extraKm) || 0) - lose;
  return -lose;
}
/* ---------- the standings: by kilometres, then cities visited */
const byKm = (a, b) => (b.km || 0) - (a.km || 0) || (b.cities || 0) - (a.cities || 0) || (a.me ? -1 : b.me ? 1 : 0) || (b.seen || 0) - (a.seen || 0);
function standing(list) {
  const ranked = list.slice().sort(byKm), i = ranked.findIndex(p => p.me);
  return { ranked, rank: i + 1, ahead: i > 0 ? ranked[i - 1] : null, behind: i >= 0 && i < ranked.length - 1 ? ranked[i + 1] : null };
}
