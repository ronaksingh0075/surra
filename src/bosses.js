/* ================= Surra NPC bees: Bettan (your first race) and the boss bees of the four safehouses =================
   Bettan races newcomers during onboarding: one short sentence at the level they picked. She keeps the race close
   (she hurries when you lead and dawdles when she leads), so most first races are won by a whisker.
   Each safehouse has a boss bee who guards the road out of the city. A boss battle is a race to the blomma: every
   right reply flies you a tenth of the way, and the boss's motto (real spoken Swedish) is the final stretch. The boss
   flies steadily, a little slower after every loss. Beat the boss to travel past the safehouse and win 50 km.
   Players who were already past a safehouse before bosses existed keep their road open; the boss is optional there. */
const BETTAN = { id: 'bettan', name: 'Bettan', wpm: { A1: 11, A2: 13, B1: 15, B2: 17, C1: 19 } };
const INTRO_TEXTS = {
  A1: ['Hej! Jag heter Bettan och jag älskar fika.', "Hi! My name is Bettan and I love fika."],
  A2: ['Vi ses på stationen klockan sju, okej?', "See you at the station at seven, okay?"],
  B1: ['Jag tycker att vi borde åka tåg oftare.', 'I think we should take the train more often.'],
  B2: ['Det är inte i går vi sågs, eller hur?', "It's been ages since we last met, hasn't it?"],
  C1: ['Det är ingen ko på isen, vi hinner i tid.', "No need to panic, we'll make it in time."],
};
const INTRO = { win: 10, lose: 5 }; // head-start kilometres after the first race
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
   Bettan's rubber band: 1 + 3 x your lead, between 0.55 and 1.8 times her base speed. */
function npcStep(at, dtMs, cps, len, rubber, mine) {
  const m = rubber ? Math.max(0.55, Math.min(1.8, 1 + 3 * ((mine || 0) - at))) : 1;
  return Math.min(1, at + ((dtMs / 1000) * cps * m) / Math.max(1, len));
}
const introText = level => INTRO_TEXTS[level] || INTRO_TEXTS.A2;
