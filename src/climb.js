/* ================= Surra Kebnekaise: the climb to the queen =================
   Once you reach Kiruna (its Respond lesson is done, or C1 is tested out), Kebnekaise opens: a climb from
   Fjällstationen at 690 m to the north top at 2,097 m, Sweden's highest point, in 12 pitches of about 117 m.
   Each pitch is a question against the clock: a right answer climbs, a wrong one or running out of time makes you
   slip back down a pitch. Two camps catch your fall: once you reach one you never slip below it, and your next
   climb starts there. The pitch into each camp and the last one to the summit are rope pitches: type the line in time.
   On the summit, Fjälldrottningen (bosses.js) waits for the rematch of the race nobody wins on day one: a typing
   race with her motto. She flies at 30 words a minute, 10% slower after every loss, down to 20.
   Reaching the summit is worth 50 km and beating the queen 100 km (journey.js). */
const CLIMB = {
  sid: 'kiruna', base: 690, top: 2097, steps: 12, camps: [4, 8], ropes: [3, 7, 11],
  quizMs: 15000, replyMs: 12000, perChar: 70, replyMaxMs: 40000, ropePerChar: 800, ropeMinMs: 20000,
  slower: 0.1, maxSlower: 0.5,
  names: ['Fjällstationen', 'Läger 1', 'Läger 2', 'Nordtoppen'],
};
const ROPE_TEXTS = [
  ['Akta dig, det är halt på isen!', 'Careful, the ice is slippery!'],
  ['Vi tar en paus vid stugan.', "Let's take a break at the hut."],
  ['Nu ser jag toppen, vi är nästan framme!', "I can see the top now, we're almost there!"],
];

/* ---------- where you are on the mountain */
const climbRec = s => (s && s.climb) || {};
const climbOpen = s => stopDone(s, CLIMB.sid) || !!(s.checkpoints && s.checkpoints.C1);
const climbSummit = s => !!climbRec(s).summit;
const climbWon = s => !!climbRec(s).queen; // beat the queen on the summit
// where your next climb starts: the highest camp you've reached (0 is Fjällstationen)
const climbStart = s => (climbSummit(s) ? CLIMB.steps : CLIMB.camps.includes(climbRec(s).camp) ? climbRec(s).camp : 0);
const altitudeAt = step => Math.round(CLIMB.base + ((CLIMB.top - CLIMB.base) * Math.max(0, Math.min(CLIMB.steps, step))) / CLIMB.steps);
// the highest camp at or below this step (0 is Fjällstationen)
const campFloor = step => CLIMB.camps.filter(c => c <= step).pop() || 0;
const isCamp = step => CLIMB.camps.includes(step);
const campName = step => CLIMB.names[step >= CLIMB.steps ? 3 : CLIMB.camps.indexOf(step) + 1] || CLIMB.names[0];
// one pitch: up on a right answer; down one on a mistake or when time runs out, never below the last camp
function climbMove(step, floor, ok) {
  if (ok) { const next = Math.min(CLIMB.steps, step + 1); return { step: next, floor: Math.max(floor, campFloor(next)), moved: 1 }; }
  const next = Math.max(floor, step - 1);
  return { step: next, floor, moved: next - step };
}
const isRope = step => CLIMB.ropes.includes(step);
const ropeText = step => ROPE_TEXTS[Math.max(0, CLIMB.ropes.indexOf(step))];
// the clock for one pitch: a reply gets time to read it (12 s plus 70 ms a character, 15 to 40 s), a phrase 15 s,
// and a rope pitch 0.8 s a character (about 15 words a minute), at least 20 s
function pitchMs(q, rope) {
  if (rope) return Math.max(CLIMB.ropeMinMs, typeClean(rope).length * CLIMB.ropePerChar);
  if (!q || q.kind !== 'reply') return CLIMB.quizMs;
  const chars = String(q.say || '').length + (q.opts || []).reduce((a, o) => a + String((o && o.sv) || '').length, 0);
  return Math.round(Math.max(CLIMB.quizMs, Math.min(CLIMB.replyMaxMs, CLIMB.replyMs + chars * CLIMB.perChar)));
}
// the queen on the summit: 30 words a minute, a little slower after each loss
function queenWpm(s) {
  const c = climbRec(s), losses = c.queen ? 0 : c.queenTries || 0;
  return Math.round((QUEEN.wpm / (1 + Math.min(CLIMB.maxSlower, CLIMB.slower * losses))) * 10) / 10;
}

/* ---------- the questions: Norrbotten's replies and key phrases, the journey's last and hardest stretch */
function climbPool() {
  const north = LEVELS[LEVEL_INDEX[CLIMB.sid]].stops;
  const replies = north.flatMap(x => STOPS[x].replies.map((_, i) => replyQ(x, i)));
  const quiz = pickN(north.flatMap(x => STOPS[x].phrases.map((_, i) => [x, i])), 12).map(([x, i]) => phraseQ(x, i, 'sv2en'));
  return shuffle([...replies, ...quiz].filter(Boolean));
}
