/* ================= Surra NPC bees: the three races of onboarding, and the boss bees of the four safehouses =================
   Onboarding is three short races at the level you picked. Bettan keeps it close (she hurries when you lead and
   dawdles when she leads), so most first races are won by a whisker. Sixten, her big brother, flies about five words
   a minute faster and is less forgiving. The third bee is Fjälldrottningen, the queen bee of Kebnekaise: she matches
   your speed wing to wing, then zooms past in the last stretch, and nobody beats her on day one. She waits on the
   summit for the rematch (climb.js).
   Each safehouse has a boss bee who guards the road out of the city. A boss battle is a race to the blomma: every
   right reply flies you a tenth of the way, and the boss's motto (real spoken Swedish) is the final stretch. The boss
   flies steadily, a little slower after every loss. Beat the boss to travel past the safehouse and win 50 km.
   Players who were already past a safehouse before bosses existed keep their road open; the boss is optional there. */
const BETTAN = { id: 'bettan', name: 'Bettan', wpm: { A1: 11, A2: 13, B1: 15, B2: 17, C1: 19 }, band: { k: 3, lo: 0.55, hi: 1.8 } };
const SIXTEN = { id: 'sixten', name: 'Sixten', tint: 'fjord', wpm: { A1: 16, A2: 18, B1: 21, B2: 24, C1: 27 }, band: { k: 2, lo: 0.75, hi: 1.35 } };
const QUEEN = {
  id: 'queen', name: 'Fjälldrottningen', lane: 'Drottningen', tint: 'aurora', wpm: 30,
  blurb: "The queen bee of Kebnekaise. She waits on the north top, Sweden's highest point, for anyone who makes it all the way to Kiruna.",
  motto: 'Den som väntar på något gott väntar aldrig för länge.', mottoEn: 'Good things come to those who wait.',
  note: 'A Swedish proverb. Word for word: whoever waits for something good never waits too long.',
};
const SIXTEN_TEXTS = {
  A1: ['Jag bor i Malmö och jobbar på ett kafé.', 'I live in Malmö and work at a café.'],
  A2: ['Kan vi ses på lördag i stället?', 'Can we meet on Saturday instead?'],
  B1: ['Jag håller inte riktigt med dig där.', "I don't quite agree with you there."],
  B2: ['Han antydde att det kanske blir försenat.', 'He hinted that it might be delayed.'],
  C1: ['Vi får se hur det blir, sa hon lugnt.', "We'll see how it goes, she said calmly."],
};
const INTRO_TEXTS = {
  A1: ['Hej! Jag heter Bettan och jag älskar fika.', "Hi! My name is Bettan and I love fika."],
  A2: ['Vi ses på stationen klockan sju, okej?', "See you at the station at seven, okay?"],
  B1: ['Jag tycker att vi borde åka tåg oftare.', 'I think we should take the train more often.'],
  B2: ['Det är inte i går vi sågs, eller hur?', "It's been ages since we last met, hasn't it?"],
  C1: ['Det är ingen ko på isen, vi hinner i tid.', "No need to panic, we'll make it in time."],
};
// head-start kilometres, once per bee: Bettan 10 for a win (5 for trying), Sixten 10 for a win. Nobody beats the queen.
const INTRO = { win: 10, lose: 5, sixten: 10 };
const BOSSES = {
  malmo: {
    id: 'malte', name: 'Malte', tint: 'falu', time: 120,
    blurb: "Malmö's boss bee. Laid-back and friendly, but nobody leaves Skåne without beating him.",
    motto: 'Ska vi ta en fika på Möllan?', mottoEn: 'Shall we grab a fika at Möllan?',
    note: 'Möllan is what Malmö calls Möllevångstorget, its favourite square.',
  },
  goteborg: {
    id: 'gosta', name: 'Gösta', tint: 'fjord', time: 120,
    blurb: "Göteborg's boss bee. Never misses a chance for a pun, and never lets you leave without a race.",
    motto: 'Ta det gött, vi ses på Liseberg!', mottoEn: 'Take it easy, see you at Liseberg!',
    note: 'Gött is how Göteborg says good, and Liseberg is the city’s amusement park.',
  },
  stockholm: {
    id: 'stina', name: 'Stina', tint: 'ljung', time: 130,
    blurb: "Stockholm's boss bee. Always in a hurry, always on her way somewhere, always fast.",
    motto: 'Asså, jag har typ inte tid, vi hörs!', mottoEn: "Like, I kind of don't have time, talk later!",
    note: 'Asså (alltså) and typ are everyday fillers, the Swedish “like”.',
  },
  umea: {
    id: 'ulla', name: 'Ulla', tint: 'moss', time: 140,
    blurb: "Umeå's boss bee. Calm as a birch forest, and the last guard before the far north.",
    motto: 'Nä men hörru, int ska du väl åka redan?', mottoEn: "Well, listen, you're not leaving already, are you?",
    note: 'Hörru is hör du, and int is how the north says inte.',
  },
};
const BOSS = { replies: 8, step: 0.1, sprint: 0.2, slower: 0.1, maxSlower: 0.5, pool: 14 }; // a win is worth KM.boss (journey.js)

/* ---------- where bosses stand in the way */
const bossRec = (s, sid) => ((s && s.bosses) || {})[sid] || {};
const bossWon = (s, sid) => !!bossRec(s, sid).won;
// the road past this safehouse is open: the boss is beaten, the level is below where you started, or you were
// already further down the road before boss bees existed
function bossClear(s, sid) {
  if (!BOSSES[sid] || bossWon(s, sid)) return true;
  if (LEVEL_INDEX[sid] < startIdx(s)) return true;
  const i = ORDER.indexOf(sid);
  return ORDER.slice(i + 1).some(x => ['learn', 'reply', 'talk', 'life'].some(l => starsOf(s, x, l) > 0));
}
// the first boss between the start of the journey and this stop who still blocks the road (or null)
function blockingBoss(s, sid) {
  const i = ORDER.indexOf(sid);
  return Object.keys(BOSSES).find(h => ORDER.indexOf(h) < i && !bossClear(s, h)) || null;
}
const bossesBefore = (s, sid) => !blockingBoss(s, sid);
// can you battle this boss now? Once the city's Respond lesson is done (or its level is behind you or tested out)
function bossReady(s, sid) {
  if (!BOSSES[sid] || !stopOpen(s, sid)) return false;
  const li = LEVEL_INDEX[sid];
  return stopDone(s, sid) || li < startIdx(s) || !!s.checkpoints[LEVEL_IDS[li]];
}
// how long the boss takes to reach the blomma, in seconds: 10% slower after each loss, up to 50%
function bossTime(s, sid) {
  const b = bossRec(s, sid), losses = b.won ? 0 : (b.tries || 0);
  return Math.round(BOSSES[sid].time * (1 + Math.min(BOSS.maxSlower, BOSS.slower * losses)));
}
// the road a win opens: the next city, or the next region once its checkpoint is passed too
function bossOpens(sid) {
  const i = ORDER.indexOf(sid), nx = ORDER[i + 1];
  return nx ? { sid: nx, city: STOPS[nx].city, newLevel: LEVEL_INDEX[nx] !== LEVEL_INDEX[sid] } : null;
}

/* ---------- the battle's questions: the city's replies, a few from the region before it, and its key phrases */
function bossPool(sid) {
  const li = LEVEL_INDEX[sid], stops = LEVELS[li].stops, before = stops.slice(0, stops.indexOf(sid));
  const here = STOPS[sid].replies.map((_, i) => replyQ(sid, i));
  const extra = pickN(before.flatMap(x => STOPS[x].replies.map((_, i) => [x, i])), 4).map(([x, i]) => replyQ(x, i));
  const quiz = pickN(STOPS[sid].phrases.map((_, i) => i), BOSS.pool - here.length - extra.length).map(i => phraseQ(sid, i, 'sv2en'));
  return shuffle([...here, ...extra, ...quiz].filter(Boolean));
}

/* ---------- pace: how far an NPC bee gets in dt milliseconds
   A rubber band speeds a bee up when you lead and slows it when it leads: 1 + k x your lead, between lo and hi
   times its base speed. Bettan's band is strong (true means hers), Sixten's is mild, bosses fly steadily. */
function npcStep(at, dtMs, cps, len, rubber, mine) {
  const b = rubber === true ? BETTAN.band : rubber;
  const m = b ? Math.max(b.lo, Math.min(b.hi, 1 + b.k * ((mine || 0) - at))) : 1;
  return Math.min(1, at + ((dtMs / 1000) * cps * m) / Math.max(1, len));
}
/* the queen on day one: she matches your own speed, so the race is neck and neck and the lead changes hands, then
   she kicks for the blomma in the last stretch. Her kick is tied to how far you've typed, not to the clock: she
   reaches the flower before you've typed the final letters, so no typing speed beats her. If you stop typing she
   carries on at an easy pace and wins anyway. */
const QUEEN_RACE = { kick: 0.84, sit: 0.01, swing: 0.035, swingMs: 1500, startCps: 2.2, floorCps: 0.7, idleMs: 3000, cruiseCps: 2.6,
  gain: 12, slow: 0.5, fast: 2.6, sprintMs: 3600, sure: 0.4, lead: 0.03, warmMs: 900 };
function queenStep(at, dtMs, elMs, mine, zooming, len = 50, idleMs = 0) {
  const Q = QUEEN_RACE, me = mine || 0, n = Math.max(1, len);
  if (zooming || me >= Q.kick || at >= Q.kick + 0.03) // the kick: away she goes, and she's home before you finish
    return { at: Math.min(1, Math.max(at + dtMs / Q.sprintMs, me + (1 - me) * Q.sure + Q.lead)), zooming: true };
  // your average speed so far, from your first few letters (a gentle opening pace until then); stop typing and she cruises on
  const avg = me > 0.02 ? me / Math.max(elMs, Q.warmMs) : Q.startCps / n / 1000;
  const yours = idleMs > Q.idleMs ? Q.cruiseCps / n / 1000 : Math.max(avg, Q.floorCps / n / 1000);
  // she aims a whisker behind you, swinging either side of you so the lead changes hands
  const aim = me - Q.sit + Q.swing * Math.sin(elMs / Q.swingMs);
  const m = idleMs > Q.idleMs ? 1 : Math.max(Q.slow, Math.min(Q.fast, 1 + Q.gain * (aim - at)));
  return { at: Math.max(0, Math.min(Q.kick + 0.03, at + dtMs * yours * m)), zooming: false };
}
const introText = level => INTRO_TEXTS[level] || INTRO_TEXTS.A2;
// the three races of onboarding, at your level
const introHeats = level => [
  { bee: BETTAN, text: introText(level), cps: ((BETTAN.wpm[level] || 13) * 5) / 60, band: BETTAN.band, km: r => (r.won ? INTRO.win : INTRO.lose) },
  { bee: SIXTEN, text: SIXTEN_TEXTS[level] || SIXTEN_TEXTS.A2, cps: ((SIXTEN.wpm[level] || 21) * 5) / 60, band: SIXTEN.band, km: r => (r.won ? INTRO.sixten : 0) },
  { bee: QUEEN, text: [QUEEN.motto, QUEEN.mottoEn], queen: true, km: () => 0 },
];
// record one onboarding race and its head start, once per bee (a 1.7 record holds Bettan's race only). Returns the km added.
function introRecord(x, bee, r, km) {
  const old = x.intro, it = old ? { ...old, bees: { ...(old.bees || { bettan: { won: !!old.won, wpm: old.wpm || 0, km: old.km || 0 } }) } } : { at: Date.now(), km: 0, bees: {} };
  x.intro = it;
  if (it.bees[bee]) return 0;
  const add = km > 0 ? addResultKm(x, km) : 0;
  it.bees[bee] = { won: !!r.won, wpm: r.wpm || 0, km: add };
  it.km = (it.km || 0) + add;
  if (bee === BETTAN.id) { it.won = !!r.won; it.wpm = r.wpm || 0; }
  return add;
}
