/* ================= Surra core: state, progress rules, AI, speech, sound ================= */
'use strict';
const { html, render, useState, useEffect, useRef, useMemo, useCallback } = window.htmPreact;

/* ---------- small utils */
const $clone = o => JSON.parse(JSON.stringify(o));
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const pickN = (a, n) => shuffle(a).slice(0, n);
const rnd = a => a[Math.floor(Math.random() * a.length)];
const pad2 = n => String(n).padStart(2, '0');
const dateStr = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const today = () => dateStr(new Date());
const dayOffset = k => { const d = new Date(); d.setDate(d.getDate() + k); return dateStr(d); };
const fmtN = n => Number(n || 0).toLocaleString('sv-SE');
const cx = (...a) => a.filter(Boolean).join(' ');
let UID = 0; const uid = () => 'q' + (++UID);

/* ---------- curriculum indexes */
const LEVEL_IDS = LEVELS.map(l => l.id);
const ORDER = LEVELS.flatMap(l => l.stops);
const LEVEL_INDEX = {};
LEVELS.forEach((l, i) => l.stops.forEach(s => { LEVEL_INDEX[s] = i; }));
ORDER.forEach(id => { STOPS[id].id = id; });
const LESSON_META = {
  learn: { sv: 'Lär dig', en: 'Key phrases', desc: '8 phrases with audio, a quiz and a matching game', icon: 'book' },
  reply: { sv: 'Svara', en: 'Respond', desc: 'Pick, build and write the right reply in real situations', icon: 'bolt' },
  talk: { sv: 'Samtal', en: 'Conversation', desc: 'A live role-play with feedback on every message', icon: 'chat' },
  life: { sv: 'Labbet', en: 'Life science', desc: 'Lab and industry Swedish: phrases, replies and sentences', icon: 'flask' },
};
const REG_LABEL = { casual: 'Vardag', pro: 'Jobb', mixed: 'Vardag & jobb' };
const REG_EN = { casual: 'Casual', pro: 'Work', mixed: 'Casual + work' };
const GOALS = [{ v: 30, sv: 'Lätt', en: 'Easy' }, { v: 60, sv: 'Lagom', en: 'Just right' }, { v: 100, sv: 'Seriöst', en: 'Serious' }, { v: 150, sv: 'Intensivt', en: 'Intense' }];
const ACH = [
  { id: 'first', sv: 'Första steget', en: 'Finish your first lesson', icon: 'flag' },
  { id: 'talk1', sv: 'Första samtalet', en: 'Finish a conversation', icon: 'chat' },
  { id: 'talk5', sv: 'Pratkvarn', en: 'Finish 5 conversations', icon: 'chat' },
  { id: 'combo10', sv: 'Tio i rad', en: '10 right answers in a row', icon: 'bolt' },
  { id: 'perfect', sv: 'Felfri', en: 'A lesson without a mistake', icon: 'star' },
  { id: 'own5', sv: 'Egen röst', en: '5 of your own replies rated good', icon: 'pen' },
  { id: 'streak7', sv: 'Hela ljusstaken', en: 'All seven candles: a 7-day streak', icon: 'candle' },
  { id: 'streak30', sv: 'Midvinterljus', en: 'A 30-day streak', icon: 'candle' },
  { id: 'quick15', sv: 'Blixtsnabb', en: '15 or more in Snabbsvar', icon: 'timer' },
  { id: 'fix10', sv: 'Envis', en: 'Fix 10 mistakes in review', icon: 'refresh' },
  { id: 'facts10', sv: 'Nyfiken', en: 'Unlock 10 “Did you know?” facts', icon: 'bulb' },
  { id: 'lab5', sv: 'Labbråtta', en: 'Finish 5 life-science lessons', icon: 'flask' },
  { id: 'duel1', sv: 'Utmanare', en: 'Win a challenge on the players map', icon: 'swords' },
  { id: 'factsAll', sv: 'Allvetare', en: 'Unlock all 80 facts', icon: 'book' },
  { id: 'night', sv: 'Nattuggla', en: 'Practise after 22:00', icon: 'moon' },
  { id: 'morning', sv: 'Morgonpigg', en: 'Practise before 07:00', icon: 'sun' },
  { id: 'cp_A1', sv: 'Skånepasset', en: 'Pass the A1 checkpoint', icon: 'stamp' },
  { id: 'cp_A2', sv: 'Götalandspasset', en: 'Pass the A2 checkpoint', icon: 'stamp' },
  { id: 'cp_B1', sv: 'Svealandspasset', en: 'Pass the B1 checkpoint', icon: 'stamp' },
  { id: 'cp_B2', sv: 'Norrlandspasset', en: 'Pass the B2 checkpoint', icon: 'stamp' },
  { id: 'cp_C1', sv: 'Norrbottenspasset', en: 'Pass the C1 checkpoint', icon: 'stamp' },
  { id: 'all20', sv: 'Hela vägen', en: 'Collect all 20 city stamps', icon: 'mountain' },
];

/* ---------- reactive cells */
function cell(initial) {
  let v = initial; const subs = new Set();
  return {
    get: () => v,
    set(n) { v = n; subs.forEach(f => f(v)); },
    use() { const [x, setX] = useState(v); useEffect(() => { subs.add(setX); setX(v); return () => subs.delete(setX); }, []); return x; },
    sub(f) { subs.add(f); return () => subs.delete(f); },
  };
}
const ENV = cell({ ai: 'checking', tts: false, sync: 'device' });
const setEnv = p => ENV.set({ ...ENV.get(), ...p });
const TOASTS = cell([]);
const CELEBRATE = cell(null);

/* ---------- persistent state */
const LS_KEY = 'surra.progress.v1';
function freshState() {
  return {
    v: 1, onboarded: false, start: 'A2', goal: 60, xp: 0,
    streak: { count: 0, last: null, best: 0 }, log: {}, lessons: {}, checkpoints: {}, cpTried: {}, mistakes: {}, ach: {},
    stats: { answers: 0, correct: 0, bestCombo: 0, talks: 0, ownGood: 0, quickBest: 0, perfect: 0, fixed: 0 },
    settings: { translations: 'show', work: 'mix', rate: 'normal', sound: true, nudge: true, palette: 'mysig', mode: 'auto' },
    profile: { name: '', avatar: 'bee', color: 'fjord' }, owner: null,
    community: { joined: false, setback: 0, applied: {} },
    createdAt: Date.now(), updatedAt: 0,
  };
}
function withDefaults(s) {
  const d = freshState();
  if (!s || typeof s !== 'object' || s.v !== 1) return d;
  for (const k of Object.keys(d)) {
    if (s[k] === undefined || s[k] === null && d[k] !== null) s[k] = d[k];
    else if (['streak', 'stats', 'settings', 'profile', 'community'].includes(k)) for (const kk of Object.keys(d[k])) if (s[k][kk] === undefined) s[k][kk] = d[k][kk];
  }
  if (!LEVEL_IDS.includes(s.start)) s.start = 'A2';
  return s;
}
function readLocal() { try { const raw = localStorage.getItem(LS_KEY); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }
function writeLocal(s) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) { /* storage blocked: keep going in memory */ } }

const STORE = cell(withDefaults(readLocal()));
const S = () => STORE.get();
let newAchievements = [];
function update(fn) {
  const prev = STORE.get();
  const next = $clone(prev);
  fn(next);
  evalAchievements(next);
  next.updatedAt = Date.now();
  STORE.set(next);
  persist(next);
  const fresh = newAchievements; newAchievements = [];
  fresh.forEach((id, i) => { const a = ACH.find(x => x.id === id); if (a) setTimeout(() => toast(`Badge unlocked: ${a.sv}`, a.icon), 500 + i * 700); });
  THEMES.filter(t => t.unlock && !t.unlock.test(prev) && t.unlock.test(next))
    .forEach((t, i) => setTimeout(() => toast(`New colour theme: ${t.sv}! Try it in Settings`, 'sparkle'), 900 + (fresh.length + i) * 700));
}
const useApp = () => STORE.use();

/* ---------- account sync: the artifact database on claude.ai, or a Surra account in the installable app (falls back to this device) */
const sync = { mode: 'local', kind: null, ref: null, timer: 0, pending: null, chain: Promise.resolve(), backoff: 4000 };
function persist(s) {
  writeLocal(s);
  if (sync.mode !== 'db') return;
  sync.pending = s; clearTimeout(sync.timer); sync.timer = setTimeout(flushSync, 1200);
}
function flushSync() {
  clearTimeout(sync.timer);
  const s = sync.pending; if (!s || !sync.ref) return;
  sync.pending = null;
  const ref = sync.ref, kind = sync.kind;
  sync.chain = sync.chain
    .then(() => ref.set($clone(s)))
    .then(() => {
      if (sync.ref !== ref) return;
      sync.backoff = 4000;
      setEnv({ sync: kind === 'cloud' ? 'cloud' : 'account' });
      if (kind === 'cloud') onCloudSaved();
    })
    .catch(e => {
      if (sync.ref !== ref) return;
      const c = String((e && e.code) || '');
      const transient = c === 'unavailable' || c === 'resource_exhausted' || (kind === 'cloud' && (!c || /unavailable|resource-exhausted|deadline|aborted|internal|unknown|network/.test(c)));
      if (transient) {
        sync.pending = sync.pending || s;
        sync.timer = setTimeout(flushSync, sync.backoff + Math.random() * 3000);
        sync.backoff = Math.min(sync.backoff * 2, 60000);
        if (kind === 'cloud') onCloudSaveFailed(c, true);
      } else {
        sync.mode = 'local'; setEnv({ sync: 'device' });
        if (kind === 'cloud') onCloudSaveFailed(c, false);
      }
    });
}
function flushNow(ms = 5000) {
  if (sync.pending) flushSync();
  return Promise.race([sync.chain.catch(() => {}), new Promise(r => setTimeout(r, ms))]);
}
function detachRemote() {
  clearTimeout(sync.timer);
  sync.mode = 'local'; sync.kind = null; sync.ref = null; sync.pending = null; sync.backoff = 4000;
  setEnv({ sync: 'device' });
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSync(); });
window.addEventListener('online', () => { if (sync.pending) { clearTimeout(sync.timer); flushSync(); } });
async function initSync() {
  const C = window.claude;
  if (!C || typeof C.use !== 'function') return;
  let db = null, user = null;
  try { [db, user] = await Promise.all([C.use('db'), C.use('user')]); } catch (e) { return; }
  if (!db || !user) return;
  let id = null;
  try { id = await user.id(); } catch (e) { /* no identity */ }
  if (!id) return;
  let ref, snap;
  try { ref = db.doc('data/users/' + id + '/progress'); snap = await ref.get(); } catch (e) { return; }
  sync.ref = ref; sync.mode = 'db'; sync.kind = 'claude';
  const local = STORE.get();
  if (snap.exists) {
    const remote = withDefaults($clone(snap.data()));
    if ((remote.updatedAt || 0) > (local.updatedAt || 0)) { STORE.set(remote); writeLocal(remote); }
    else if ((local.updatedAt || 0) > (remote.updatedAt || 0)) persist(local);
  } else if (local.onboarded) persist(local);
  setEnv({ sync: 'account' });
}

/* ---------- progress rules */
const startIdx = s => Math.max(0, LEVEL_IDS.indexOf(s.start));
const starsOf = (s, sid, l) => s.lessons[sid + ':' + l] || 0;
const stopDone = (s, sid) => starsOf(s, sid, 'reply') > 0;
function levelUnlocked(s, li) { return li <= startIdx(s) || !!s.checkpoints[LEVEL_IDS[li - 1]]; }
function stopOpen(s, sid) {
  const li = LEVEL_INDEX[sid];
  if (!levelUnlocked(s, li)) return false;
  if (li < startIdx(s) || s.checkpoints[LEVEL_IDS[li]]) return true;
  const st = LEVELS[li].stops, k = st.indexOf(sid);
  return k === 0 || stopDone(s, st[k - 1]);
}
function nextAction(s) {
  for (let li = startIdx(s); li < LEVELS.length; li++) {
    const L = LEVELS[li];
    if (s.checkpoints[L.id]) continue;
    if (!levelUnlocked(s, li)) return { type: 'locked', li };
    for (let k = 0; k < L.stops.length; k++) {
      const sid = L.stops[k];
      if (!stopOpen(s, sid)) break;
      if (!starsOf(s, sid, 'learn')) return { type: 'lesson', sid, lesson: 'learn' };
      if (!starsOf(s, sid, 'reply')) return { type: 'lesson', sid, lesson: 'reply' };
      const nx = L.stops[k + 1];
      const nextStarted = nx && (starsOf(s, nx, 'learn') || starsOf(s, nx, 'reply'));
      if (!starsOf(s, sid, 'talk') && !nextStarted && !(k === L.stops.length - 1 && s.cpTried[L.id])) return { type: 'lesson', sid, lesson: 'talk' };
    }
    return { type: 'checkpoint', li };
  }
  return { type: 'done' };
}
function currentStop(s) {
  const a = nextAction(s);
  if (a.type === 'lesson') return a.sid;
  if (a.type === 'checkpoint') return LEVELS[a.li].stops[3];
  return 'kiruna';
}
function highestLevel(s) { let h = 0; for (let i = 0; i < LEVELS.length; i++) if (levelUnlocked(s, i)) h = i; return h; }
function levelState(s, li) {
  if (s.checkpoints[LEVEL_IDS[li]]) return 'passed';
  if (!levelUnlocked(s, li)) return 'locked';
  if (li < startIdx(s)) return 'review';
  const a = nextAction(s);
  if ((a.type === 'lesson' && LEVEL_INDEX[a.sid] === li) || (a.type === 'checkpoint' && a.li === li)) return 'current';
  return 'open';
}
function stampState(s, sid) {
  if (!stopDone(s, sid)) return 'off';
  return ['learn', 'reply', 'talk'].every(l => starsOf(s, sid, l) >= 3) ? 'gold' : 'on';
}
/* ---------- life-science track (work focus: mix or life sciences) */
const lifeOn = s => s.settings.work !== 'general';
const lifeFirst = s => s.settings.work === 'life';
const LIFE_IDS = ORDER.filter(sid => LIFE[sid]);
const lifeFactOpen = (s, sid) => ['learn', 'reply', 'talk', 'life'].some(l => starsOf(s, sid, l) > 0);
const lifeDone = s => LIFE_IDS.filter(sid => starsOf(s, sid, 'life') > 0).length;
function nextLife(s) { return LIFE_IDS.find(sid => stopOpen(s, sid) && !starsOf(s, sid, 'life')) || null; }

/* ---------- facts: each lesson finished at a stop unlocks one; the gold stamp unlocks the fourth */
const FACT_TOTAL = ORDER.reduce((a, sid) => a + (FACTS[sid] || []).length, 0);
function factsUnlocked(s, sid) {
  const n = ['learn', 'reply', 'talk'].filter(l => starsOf(s, sid, l) > 0).length;
  return Math.min((FACTS[sid] || []).length, n + (n === 3 && stampState(s, sid) === 'gold' ? 1 : 0));
}
const factsTotal = s => ORDER.reduce((a, sid) => a + factsUnlocked(s, sid), 0);
const factHint = i => (i < 3 ? `Finish ${['one lesson', 'two lessons', 'all three lessons'][i]} here to unlock` : 'Earn the gold stamp here (3 stars on every lesson)');
function dailyFact(s) {
  const open = ORDER.flatMap(sid => Array.from({ length: factsUnlocked(s, sid) }, (_, i) => [sid, i]));
  if (!open.length) return { sid: currentStop(s), i: 0, locked: true };
  let h = 7; for (const c of today()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const [sid, i] = open[h % open.length];
  return { sid, i, locked: false };
}
function liveStreak(s) { const l = s.streak.last; return (l === today() || l === dayOffset(-1)) ? s.streak.count : 0; }
const todayXP = s => s.log[today()] || 0;
function weekDays() {
  const d = new Date(); const dow = (d.getDay() + 6) % 7; const out = [];
  for (let i = 0; i < 7; i++) { const x = new Date(d); x.setDate(d.getDate() - dow + i); out.push(dateStr(x)); }
  return out;
}
function awardXP(s, n) {
  n = Math.max(0, Math.round(n));
  const t = today();
  s.xp += n; s.log[t] = (s.log[t] || 0) + n;
  const keys = Object.keys(s.log).sort(); while (keys.length > 70) delete s.log[keys.shift()];
  if (s.streak.last !== t) {
    s.streak.count = s.streak.last === dayOffset(-1) ? s.streak.count + 1 : 1;
    s.streak.last = t; s.streak.best = Math.max(s.streak.best || 0, s.streak.count);
  }
  const h = new Date().getHours();
  if (h >= 22) addAch(s, 'night');
  if (h < 7) addAch(s, 'morning');
}
function addAch(s, id) { if (!s.ach[id]) { s.ach[id] = Date.now(); newAchievements.push(id); } }
function evalAchievements(s) {
  if (Object.keys(s.lessons).some(k => !k.startsWith('cp:'))) addAch(s, 'first');
  if (s.stats.talks >= 1) addAch(s, 'talk1');
  if (s.stats.talks >= 5) addAch(s, 'talk5');
  if (s.stats.bestCombo >= 10) addAch(s, 'combo10');
  if (s.stats.perfect >= 1) addAch(s, 'perfect');
  if (s.stats.ownGood >= 5) addAch(s, 'own5');
  if (liveStreak(s) >= 7) addAch(s, 'streak7');
  if (liveStreak(s) >= 30) addAch(s, 'streak30');
  if (s.stats.quickBest >= 15) addAch(s, 'quick15');
  if (s.stats.fixed >= 10) addAch(s, 'fix10');
  LEVEL_IDS.forEach(id => { if (s.checkpoints[id]) addAch(s, 'cp_' + id); });
  if (ORDER.every(sid => stopDone(s, sid))) addAch(s, 'all20');
  const ft = factsTotal(s);
  if (ft >= 10) addAch(s, 'facts10');
  if (lifeDone(s) >= 5) addAch(s, 'lab5');
  if (s.community && Object.values(s.community.applied || {}).some(a => a && a.r === 'won')) addAch(s, 'duel1');
  if (ft >= FACT_TOTAL) addAch(s, 'factsAll');
}
function talkVariant(stop, work) {
  const t = stop.talk;
  if (!t.general) return t;
  if (work === 'general') return t.general;
  if (work === 'life') return t.life;
  return Math.random() < 0.5 ? t.general : t.life;
}

/* ---------- questions */
const optObj = o => ({ sv: o[0], en: o[1], ok: !!o[2], note: o[3] });
function replyQ(sid, i) {
  const r = STOPS[sid].replies[i]; if (!r) return null;
  return { kind: 'reply', uid: uid(), key: `${sid}:r${i}`, sid, who: r.who, say: r.say, en: r.en, cue: r.cue, opts: shuffle(r.opts.map(optObj)) };
}
function tokens(sv) { return sv.replace(/[.,!?:;“”"]/g, ' ').split(/\s+/).filter(Boolean); }
const NAMES = new Set(['Sam', 'Kanada', 'Malmö', 'Lund', 'Göteborg', 'Stockholm', 'Kiruna', 'Lisa', 'Sverige']);
function tileText(t, i) { return i === 0 && !NAMES.has(t) && t !== 'I' ? t.charAt(0).toLowerCase() + t.slice(1) : t; }
function buildQ(sid, i) {
  const b = STOPS[sid].builds[i]; if (!b) return null;
  const real = tokens(b.sv).map(tileText);
  const tiles = shuffle(real.concat(b.extra || []).map((t, k) => ({ id: k, t })));
  return { kind: 'build', uid: uid(), key: `${sid}:b${i}`, sid, en: b.en, sv: b.sv, alt: b.alt || [], note: b.note, tiles };
}
function gapQ(sid, i) {
  const g = (STOPS[sid].gaps || [])[i]; if (!g) return null;
  return { kind: 'gap', uid: uid(), key: `${sid}:g${i}`, sid, sv: g.sv, en: g.en, a: g.a, cue: g.cue, why: g.why, opts: shuffle(g.opts) };
}
function phraseQ(sid, i, dir, pool) {
  const ph = STOPS[sid].phrases; const p = ph[i]; if (!p) return null;
  const others = pickN((pool || ph.map((_, j) => j)).filter(j => j !== i), 3).map(j => ph[j]);
  const sv2en = dir === 'sv2en';
  return {
    kind: 'quiz', uid: uid(), key: `${sid}:p${i}`, sid, dir, prompt: sv2en ? p[0] : p[1], answer: sv2en ? p[1] : p[0], pair: p,
    opts: shuffle([sv2en ? p[1] : p[0], ...others.map(o => sv2en ? o[1] : o[0])]),
  };
}
function lifeReplyQ(sid, i) {
  const r = LIFE[sid] && LIFE[sid].replies[i]; if (!r) return null;
  return { kind: 'reply', uid: uid(), key: `${sid}:lr${i}`, sid, who: r.who, say: r.say, en: r.en, cue: r.cue, opts: shuffle(r.opts.map(optObj)), life: true };
}
function lifeBuildQ(sid, i) {
  const b = LIFE[sid] && LIFE[sid].builds[i]; if (!b) return null;
  const real = tokens(b.sv).map(tileText);
  const tiles = shuffle(real.concat(b.extra || []).map((t, k) => ({ id: k, t })));
  return { kind: 'build', uid: uid(), key: `${sid}:lb${i}`, sid, en: b.en, sv: b.sv, alt: b.alt || [], note: b.note, tiles, life: true };
}
function lifePhraseQ(sid, i, dir) {
  const ph = LIFE[sid] && LIFE[sid].phrases; const p = ph && ph[i]; if (!p) return null;
  const others = pickN(ph.map((_, j) => j).filter(j => j !== i), 3).map(j => ph[j]);
  const sv2en = dir === 'sv2en';
  return { kind: 'quiz', uid: uid(), key: `${sid}:lp${i}`, sid, dir, prompt: sv2en ? p[0] : p[1], answer: sv2en ? p[1] : p[0], pair: p, opts: shuffle([sv2en ? p[1] : p[0], ...others.map(o => (sv2en ? o[1] : o[0]))]), life: true };
}
function qFromKey(key) {
  const [sid, part] = String(key).split(':'); if (!STOPS[sid] || !part) return null;
  if (part[0] === 'l') {
    const t = part[1], i = Number(part.slice(2));
    if (t === 'r') return lifeReplyQ(sid, i);
    if (t === 'b') return lifeBuildQ(sid, i);
    if (t === 'p') return lifePhraseQ(sid, i, Math.random() < 0.5 ? 'sv2en' : 'en2sv');
    return null;
  }
  const t = part[0], i = Number(part.slice(1));
  if (t === 'r') return replyQ(sid, i);
  if (t === 'b') return buildQ(sid, i);
  if (t === 'g') return gapQ(sid, i);
  if (t === 'p') return phraseQ(sid, i, Math.random() < 0.5 ? 'sv2en' : 'en2sv');
  return null;
}
function lessonLearn(sid) {
  const st = STOPS[sid]; const qs = [];
  [[0, 1, 2, 3], [4, 5, 6, 7]].forEach((block, b) => {
    block.forEach(i => qs.push({ kind: 'card', uid: uid(), sid, i, phrase: st.phrases[i] }));
    pickN(block, 3).forEach((i, n) => qs.push(phraseQ(sid, i, (n + b) % 2 ? 'en2sv' : 'sv2en', b === 0 ? block : null)));
  });
  qs.push({ kind: 'match', uid: uid(), key: null, sid, pairs: pickN([0, 1, 2, 3, 4, 5, 6, 7], 5).map(i => ({ i, sv: st.phrases[i][0], en: st.phrases[i][1] })) });
  return { type: 'learn', sid, title: `${st.city} · Key phrases`, questions: qs };
}
function lessonReply(sid) {
  const st = STOPS[sid];
  let R = shuffle(st.replies.map((_, i) => replyQ(sid, i)));
  if (LIFE[sid] && lifeFirst(S())) R = shuffle([...R.slice(0, 4), ...pickN(LIFE[sid].replies.map((_, i) => i), 2).map(i => lifeReplyQ(sid, i))]);
  const O = shuffle([...st.builds.map((_, i) => buildQ(sid, i)), ...(st.gaps || []).map((_, i) => gapQ(sid, i))]);
  const out = []; let oi = 0;
  R.forEach((r, k) => { out.push(r); if (k % 2 === 1 && oi < O.length) out.push(O[oi++]); });
  while (oi < O.length) out.push(O[oi++]);
  return { type: 'reply', sid, title: `${st.city} · Respond`, questions: out };
}
function lessonLife(sid) {
  const L = LIFE[sid], qs = [];
  L.phrases.forEach((p, i) => qs.push({ kind: 'card', uid: uid(), sid, i, phrase: p }));
  pickN(L.phrases.map((_, i) => i), 3).forEach((i, n) => qs.push(lifePhraseQ(sid, i, n % 2 ? 'en2sv' : 'sv2en')));
  const B = L.builds.map((_, i) => lifeBuildQ(sid, i));
  shuffle(L.replies.map((_, i) => lifeReplyQ(sid, i))).forEach((r, k) => { qs.push(r); if (k % 2 === 1 && B.length) qs.push(B.shift()); });
  qs.push(...B);
  return { type: 'life', sid, title: `${STOPS[sid].city} · ${L.title}`, questions: qs.filter(Boolean) };
}
function lessonGuided(sid) {
  const st = STOPS[sid];
  return { type: 'guided', sid, title: `${st.city} · Conversation`, questions: [{ kind: 'scene', uid: uid(), sid }, ...shuffle(st.replies.map((_, i) => replyQ(sid, i)))] };
}
function lessonCheckpoint(li) {
  const L = LEVELS[li];
  const R = pickN(L.stops.flatMap(sid => STOPS[sid].replies.map((_, i) => [sid, i])), 6).map(([a, b]) => replyQ(a, b));
  const B = pickN(L.stops.flatMap(sid => STOPS[sid].builds.map((_, i) => [sid, i])), 3).map(([a, b]) => buildQ(a, b));
  const G = pickN(L.stops.flatMap(sid => (STOPS[sid].gaps || []).map((_, i) => [sid, i])), 3).map(([a, b]) => gapQ(a, b));
  while (G.length < 3) { const sid = rnd(L.stops); G.push(phraseQ(sid, Math.floor(Math.random() * 8), 'en2sv')); }
  return { type: 'checkpoint', li, levelId: L.id, title: `Checkpoint ${L.id} · ${L.region}`, questions: shuffle([...R, ...B, ...G]), pass: 9, requeue: false };
}
function lessonReview(s) {
  const keys = Object.keys(s.mistakes).sort((a, b) => (s.mistakes[a].t || 0) - (s.mistakes[b].t || 0)).slice(0, 10);
  const qs = keys.map(qFromKey).filter(Boolean);
  const pool = ORDER.filter(sid => stopOpen(s, sid) && (starsOf(s, sid, 'learn') || stopDone(s, sid) || LEVEL_INDEX[sid] < startIdx(s)));
  const src = pool.length ? pool : [currentStop(s)];
  while (qs.length < 6) {
    const sid = rnd(src);
    qs.push(Math.random() < 0.55 ? replyQ(sid, Math.floor(Math.random() * 6)) : phraseQ(sid, Math.floor(Math.random() * 8), Math.random() < 0.5 ? 'sv2en' : 'en2sv'));
  }
  return { type: 'review', title: 'Repetera', questions: qs, fromMistakes: keys.length };
}

/* ---------- finishing a lesson */
function completeLesson(lesson, st) {
  const acc = st.total ? st.correctFirst / st.total : 1;
  const stars = acc >= 0.9 ? 3 : acc >= 0.7 ? 2 : 1;
  const out = { stars, acc, xp: 0, newStamp: false, levelUp: null, passed: null, prevStars: 0, newFacts: [] };
  const fsid = lesson.sid && FACTS[lesson.sid] ? lesson.sid : null;
  const factsBefore = fsid ? factsUnlocked(S(), fsid) : 0;
  const lifeBefore = fsid && LIFE_FACTS[fsid] ? lifeFactOpen(S(), fsid) : true;
  update(s => {
    s.stats.answers += st.total; s.stats.correct += st.correctFirst;
    s.stats.bestCombo = Math.max(s.stats.bestCombo, st.bestCombo);
    s.stats.ownGood += st.ownGood || 0;
    st.missed.forEach(k => { const m = s.mistakes[k] || { n: 0 }; m.n += 1; m.t = Date.now(); s.mistakes[k] = m; });
    st.fixed.forEach(k => { if (s.mistakes[k]) { delete s.mistakes[k]; s.stats.fixed += 1; } });
    const mk = Object.keys(s.mistakes); if (mk.length > 120) mk.sort((a, b) => s.mistakes[a].t - s.mistakes[b].t).slice(0, mk.length - 120).forEach(k => delete s.mistakes[k]);
    let bonus = 15;
    if (lesson.type === 'learn' || lesson.type === 'reply' || lesson.type === 'guided') {
      const key = lesson.sid + ':' + (lesson.type === 'guided' ? 'talk' : lesson.type);
      out.prevStars = s.lessons[key] || 0;
      if (lesson.type === 'reply' && !out.prevStars) out.newStamp = true;
      s.lessons[key] = Math.max(out.prevStars, stars);
      if (lesson.type === 'guided') { s.stats.talks += 1; bonus = 25; }
    }
    if (lesson.type === 'life') {
      const key = lesson.sid + ':life';
      out.prevStars = s.lessons[key] || 0;
      s.lessons[key] = Math.max(out.prevStars, stars);
      bonus = 20;
    }
    if (lesson.type === 'checkpoint') {
      s.cpTried[lesson.levelId] = true;
      out.passed = st.correctFirst >= lesson.pass;
      if (out.passed) {
        bonus = 100;
        if (!s.checkpoints[lesson.levelId]) { s.checkpoints[lesson.levelId] = true; out.levelUp = lesson.li + 1; }
        s.lessons['cp:' + lesson.levelId] = Math.max(s.lessons['cp:' + lesson.levelId] || 0, stars);
      } else bonus = 10;
    }
    if (lesson.type === 'review') bonus = 10;
    if (lesson.type !== 'review' && s.community && s.community.setback > 0) { s.community.setback -= 1; out.caughtUp = true; }
    if (acc === 1 && st.total >= 5) { s.stats.perfect += 1; bonus += 10; }
    out.xp = st.xp + bonus;
    awardXP(s, out.xp);
    if (fsid) for (let i = factsBefore; i < factsUnlocked(s, fsid); i++) out.newFacts.push(i);
    if (fsid && !lifeBefore && lifeFactOpen(s, fsid)) out.newLifeFact = true;
  });
  return out;
}
function recordTalk(sid, stars, xp) {
  const before = factsUnlocked(S(), sid), newFacts = [];
  update(s => {
    const prev = s.lessons[sid + ':talk'] || 0;
    s.lessons[sid + ':talk'] = Math.max(prev, stars); s.stats.talks += 1; awardXP(s, xp);
    for (let i = before; i < factsUnlocked(s, sid); i++) newFacts.push(i);
  });
  return newFacts;
}

/* ---------- toasts */
let toastSeq = 0;
function toast(msg, icon) {
  const id = ++toastSeq;
  TOASTS.set([...TOASTS.get(), { id, msg, icon: icon || 'star' }].slice(-3));
  setTimeout(() => TOASTS.set(TOASTS.get().filter(t => t.id !== id)), 3800);
}

/* ---------- speech (device voices) */
const tts = { voice: null, last: '', at: 0 };
function initTTS() {
  if (!('speechSynthesis' in window)) { setEnv({ tts: false }); return; }
  const choose = () => {
    let vs = [];
    try { vs = window.speechSynthesis.getVoices() || []; } catch (e) { vs = []; }
    const sv = vs.filter(v => /^sv([-_]|$)/i.test(v.lang || ''));
    const rank = v => (/alva|klara|sofie|hedvig|oskar/i.test(v.name) ? 3 : 0) + (/premium|enhanced|natural|neural/i.test(v.name) ? 2 : 0) + (v.localService ? 1 : 0);
    sv.sort((a, b) => rank(b) - rank(a));
    tts.voice = sv[0] || null;
    setEnv({ tts: vs.length === 0 ? true : !!tts.voice });
  };
  choose();
  try { window.speechSynthesis.addEventListener('voiceschanged', choose); } catch (e) { window.speechSynthesis.onvoiceschanged = choose; }
}
function speak(text) {
  if (!('speechSynthesis' in window) || !text) return;
  try {
    const now = Date.now(); const slow = tts.last === text && now - tts.at < 4000;
    tts.last = text; tts.at = now;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/[“”"]/g, '').replace(/___/g, '…'));
    u.lang = tts.voice ? tts.voice.lang : 'sv-SE';
    if (tts.voice) u.voice = tts.voice;
    u.rate = slow ? 0.66 : (S().settings.rate === 'slow' ? 0.8 : 0.95);
    window.speechSynthesis.speak(u);
  } catch (e) { /* no audio */ }
}

/* ---------- sound effects */
let AC = null;
function sfx(kind) {
  if (!S().settings.sound) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const seq = { ok: [659, 988], bad: [233, 196], done: [523, 659, 784, 1047], level: [392, 523, 659, 784, 1047, 1319], tick: [1175] }[kind] || [440];
    const t0 = AC.currentTime + 0.01;
    seq.forEach((f, i) => {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = kind === 'bad' ? 'sine' : 'triangle'; o.frequency.value = f;
      const st = t0 + i * (kind === 'bad' ? 0.13 : 0.085), peak = kind === 'bad' ? 0.09 : 0.07;
      g.gain.setValueAtTime(0.0001, st); g.gain.exponentialRampToValueAtTime(peak, st + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, st + 0.32);
      o.connect(g); g.connect(AC.destination); o.start(st); o.stop(st + 0.34);
    });
  } catch (e) { /* audio blocked */ }
}

/* ---------- Claude (sample capability) */
let SAMPLE = null;
async function initAI() {
  const C = window.claude;
  if (!C || typeof C.use !== 'function') { setEnv({ ai: 'off' }); return; }
  try { const s = await C.use('sample'); SAMPLE = s || null; setEnv({ ai: s ? 'ready' : 'off' }); } catch (e) { setEnv({ ai: 'off' }); }
}
const AI_GONE = ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'];
function aiErrorText(e) {
  const c = e && e.code;
  if (AI_GONE.includes(c)) { setEnv({ ai: 'off' }); return "Claude isn't available on this page, so conversations switch to guided mode."; }
  if (c === 'rate_limited') return "You've hit a usage limit for now. Try again a little later.";
  if (c === 'session_expired') return 'Your Claude session expired. Sign in again, then retry.';
  if (c === 'refused') return "Claude couldn't respond to that. Try rephrasing your message.";
  if (c === 'invalid_json' || c === 'empty_completion') return 'The reply came back garbled. Send it again.';
  if (c === 'prompt_too_large') return 'This conversation got too long. Finish it to get your scorecard.';
  return 'The connection dropped. Try again.';
}
const LEVEL_GUIDE = {
  A1: 'Use very short, simple sentences (about 8 words max), present tense and everyday words. Repeat key words.',
  A2: 'Use short, simple sentences with everyday vocabulary and present, past and future tense. Avoid idioms.',
  B1: 'Use natural everyday Swedish with some linked sentences and common expressions. Avoid rare idioms.',
  B2: 'Use natural spoken Swedish at a normal pace, including particles like ju, väl and nog and some common idioms.',
  C1: 'Speak like a fluent native: idiomatic, nuanced, with implied meaning, humour and complex structures.',
};
const REG_GUIDE = {
  casual: 'Casual everyday Swedish between peers: relaxed and friendly.',
  pro: 'Swedish workplace register: polite, clear and collegial (Swedes say du at work too, but phrasing is more careful).',
  mixed: 'Polite everyday Swedish that adapts to the situation.',
};
function talkRules(stop, v) {
  return `You are the conversation partner inside Surra, a game for practising spoken Swedish. Stay in this role for the whole conversation.

SCENE: ${v.scene}
YOU PLAY: ${v.who}. ${v.persona}
LEARNER: an adult practising Swedish at CEFR ${stop.level}. ${LEVEL_GUIDE[stop.level]}
REGISTER: ${REG_GUIDE[stop.reg]}
LEARNER'S GOALS:
${v.goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

You already opened the scene by saying: "${v.open}"

Every time the learner writes, answer with ONLY one JSON object and nothing else:
{"feedback":{"verdict":"great","corrected":"...","natural":"...","note":"..."},"reply":"...","reply_en":"...","goals_done":[1],"hint":"...","end":false}

Rules:
- "reply": your next line in Swedish, in character. 1 to 3 short sentences of natural spoken Swedish pitched at ${stop.level}. Move the scene toward the learner's goals and usually end with a question.
- "reply_en": an English translation of "reply".
- "feedback" judges ONLY the learner's latest message. "corrected": their message with grammar, spelling and word order fixed, keeping their meaning (identical if already correct). "natural": how a Swede would most naturally say it here. "note": one short English sentence naming the single most useful fix, or what worked well. "verdict": "great" if correct and natural, "good" if understandable with small slips, "fix" if there is a real error, the wrong register, or English.
- If the learner writes English or mixes languages, stay in character, reply in simple Swedish, set "verdict" to "fix" and put the Swedish version in "natural".
- "goals_done": the numbers of every goal the learner has achieved so far in the whole conversation.
- "hint": one short English suggestion for what the learner could say next, including a Swedish starter phrase in quotes.
- "end": true once all goals are done or the learner has written 8 messages; then let "reply" close the scene naturally.`;
}
function scorePrompt(stop, v, transcript) {
  return `You are a warm, precise Swedish teacher reviewing a learner's role-play from Surra, a Swedish speaking game.
Learner level: CEFR ${stop.level}. Scene: ${v.scene} The partner was ${v.who}.
Learner's goals:
${v.goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

Transcript (P = partner, L = learner):
${transcript}

Reply with ONLY a JSON object:
{"stars":2,"score":74,"summary":"...","went_well":["..."],"fixes":[{"you":"...","better":"...","why":"..."}],"phrases":[{"sv":"...","en":"..."}],"goals_done":[1,2]}

- "stars": 3 = goals met with mostly correct, natural Swedish for ${stop.level}; 2 = goals mostly met with some errors; 1 = partly done.
- "score": 0-100 against ${stop.level} expectations, not native level.
- "summary": two encouraging, specific sentences in English.
- "went_well": up to 3 short English points.
- "fixes": up to 3 of the most useful corrections, quoting the learner's own words in "you".
- "phrases": up to 3 natural Swedish phrases that would have helped in this scene, with English.`;
}
function ownPrompt(q, stop, best, text) {
  return `You grade one reply in Surra, a game that trains people to respond in Swedish conversations.
Learner level: CEFR ${stop.level}. Register: ${REG_GUIDE[stop.reg]}
Situation: ${q.who} says: "${q.say}" (${q.en}).${q.cue ? ' Context: ' + q.cue : ''}
A good model answer: "${best}"
The learner's own reply: "${text}"

Reply with ONLY a JSON object: {"score":2,"verdict":"good","corrected":"...","natural":"...","note":"..."}
- "score": 3 = fits the situation, correct and natural; 2 = fits with small slips; 1 = understandable but wrong register, odd or several errors; 0 = doesn't answer the situation or isn't Swedish.
- "verdict": "great" for 3, "good" for 2, "fix" for 0-1.
- "corrected": their reply with errors fixed, same meaning.
- "natural": how a Swede would naturally reply here.
- "note": one short, encouraging English sentence with the single most useful point.`;
}
function genPrompt(stop, work) {
  const focus = stop.reg === 'casual' ? '' : (work === 'life' ? ' Set work situations in the life-science and pharmaceutical industry.' : work === 'mix' ? ' Mix general office situations with life-science and pharma workplace situations.' : ' Use general office situations.');
  const existing = stop.replies.map(r => r.say).join(' | ');
  return `Create 6 new practice items for Surra, a game that trains people to respond in Swedish conversations.
Level: CEFR ${stop.level}. Theme: ${stop.theme} (${stop.en}). Register: ${REG_GUIDE[stop.reg]}${focus}

Each item: someone says one line to the learner, who picks the best reply out of 3. Exactly one option is best. The two others must be believable traps for a ${stop.level} learner: wrong meaning, wrong tense, wrong word order, wrong register or a literal translation from English.

Reply with ONLY a JSON array of 6 objects shaped like this:
{"who":"A colleague","say":"Swedish line","en":"English translation","cue":"","opts":[["Swedish reply","English translation",true,"why it works"],["...","...",false,"why it's wrong"],["...","...",false,"why it's wrong"]]}

Use correct, modern, natural Swedish. Vary the situations and don't reuse these lines: ${existing}`;
}
function normTurn(r) {
  if (!r || typeof r !== 'object' || typeof r.reply !== 'string' || !r.reply.trim()) return null;
  const f = r.feedback && typeof r.feedback === 'object' ? r.feedback : null;
  const verdict = f && ['great', 'good', 'fix'].includes(f.verdict) ? f.verdict : 'good';
  return {
    reply: r.reply.trim(), reply_en: typeof r.reply_en === 'string' ? r.reply_en : '',
    feedback: f ? { verdict, corrected: String(f.corrected || ''), natural: String(f.natural || ''), note: String(f.note || '') } : null,
    goals_done: Array.isArray(r.goals_done) ? r.goals_done.map(Number).filter(n => n >= 1 && n <= 4) : [],
    hint: typeof r.hint === 'string' ? r.hint : '', end: r.end === true,
  };
}
function normScore(r) {
  if (!r || typeof r !== 'object') return null;
  const stars = Math.min(3, Math.max(1, Math.round(Number(r.stars) || 1)));
  const arr = x => Array.isArray(x) ? x : [];
  return {
    stars, score: Math.min(100, Math.max(0, Math.round(Number(r.score) || stars * 30))),
    summary: String(r.summary || ''), went_well: arr(r.went_well).map(String).slice(0, 3),
    fixes: arr(r.fixes).filter(f => f && f.better).slice(0, 3).map(f => ({ you: String(f.you || ''), better: String(f.better), why: String(f.why || '') })),
    phrases: arr(r.phrases).filter(p => p && p.sv).slice(0, 3).map(p => ({ sv: String(p.sv), en: String(p.en || '') })),
  };
}
function normGen(r, sid) {
  const arr = Array.isArray(r) ? r : (r && Array.isArray(r.items) ? r.items : []);
  return arr.filter(x => x && typeof x.say === 'string' && Array.isArray(x.opts) && x.opts.length === 3 && x.opts.filter(o => Array.isArray(o) && o[2] === true).length === 1 && x.opts.every(o => Array.isArray(o) && typeof o[0] === 'string' && o[0].trim()))
    .slice(0, 8)
    .map(x => ({ kind: 'reply', uid: uid(), key: null, sid, who: String(x.who || 'Someone'), say: x.say, en: String(x.en || ''), cue: x.cue ? String(x.cue) : '', opts: shuffle(x.opts.map(o => ({ sv: String(o[0]), en: String(o[1] || ''), ok: o[2] === true, note: String(o[3] || '') }))) }));
}
