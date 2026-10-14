// Schema checks for the Surra curriculum.
const fs = require('fs');
const vm = require('vm');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(['data_a.js', 'data_b.js', 'facts.js'].map(f => fs.readFileSync(__dirname + '/../src/' + f, 'utf8')).join('\n') + '\n;this.LEVELS=LEVELS;this.STOPS=STOPS;this.FACTS=FACTS;this.FACT_THEMES=FACT_THEMES;', ctx);
const { LEVELS, STOPS, FACTS, FACT_THEMES } = ctx;

const errs = [];
const tok = s => s.replace(/[.,!?:;“”"–—]/g, ' ').split(/\s+/).filter(Boolean).map(t => t.toLowerCase());
const ids = new Set();
let counts = { phrases: 0, replies: 0, builds: 0, gaps: 0, talks: 0, facts: 0 };
for (const lv of LEVELS) {
  if (lv.stops.length !== 4) errs.push(`${lv.id}: expected 4 stops`);
  for (const sid of lv.stops) {
    const s = STOPS[sid];
    if (!s) { errs.push(`missing stop ${sid}`); continue; }
    if (ids.has(sid)) errs.push(`dup stop ${sid}`); ids.add(sid);
    if (s.level !== lv.id) errs.push(`${sid}: level ${s.level} != ${lv.id}`);
    for (const k of ['city', 'reg', 'theme', 'en', 'intro', 'culture', 'glyph']) if (!s[k]) errs.push(`${sid}: missing ${k}`);
    if (!['casual', 'pro', 'mixed'].includes(s.reg)) errs.push(`${sid}: bad reg`);
    if (s.phrases.length !== 8) errs.push(`${sid}: ${s.phrases.length} phrases`);
    s.phrases.forEach((p, i) => { if (p.length < 2 || !p[0] || !p[1]) errs.push(`${sid} p${i}: bad phrase`); });
    const enSet = new Set(s.phrases.map(p => p[1])); if (enSet.size !== 8) errs.push(`${sid}: duplicate phrase translations`);
    if (s.replies.length !== 6) errs.push(`${sid}: ${s.replies.length} replies`);
    s.replies.forEach((r, i) => {
      if (!r.who || !r.say || !r.en) errs.push(`${sid} r${i}: missing who/say/en`);
      if (r.opts.length !== 3) errs.push(`${sid} r${i}: ${r.opts.length} opts`);
      const ok = r.opts.filter(o => o[2] === 1).length; if (ok !== 1) errs.push(`${sid} r${i}: ${ok} correct`);
      r.opts.forEach((o, j) => { if (o.length !== 4 || !o[0] || !o[1] || !o[3]) errs.push(`${sid} r${i} o${j}: malformed`); });
      if (new Set(r.opts.map(o => o[0])).size !== 3) errs.push(`${sid} r${i}: duplicate options`);
    });
    if (s.builds.length !== 3) errs.push(`${sid}: ${s.builds.length} builds`);
    s.builds.forEach((b, i) => {
      const tiles = tok(b.sv).concat((b.extra || []).map(t => t.toLowerCase()));
      for (const alt of (b.alt || [])) {
        const pool = tiles.slice();
        for (const t of tok(alt)) { const k = pool.indexOf(t); if (k < 0) errs.push(`${sid} b${i}: alt token "${t}" not in tiles`); else pool.splice(k, 1); }
      }
      for (const e of (b.extra || [])) if (tok(b.sv).includes(e.toLowerCase())) errs.push(`${sid} b${i}: extra "${e}" duplicates a real tile`);
    });
    (s.gaps || []).forEach((g, i) => {
      if (!g.sv.includes('___')) errs.push(`${sid} g${i}: no blank`);
      if (!g.opts.includes(g.a)) errs.push(`${sid} g${i}: answer not in opts`);
      if (!g.why || !g.en) errs.push(`${sid} g${i}: missing why/en`);
    });
    const variants = s.talk.general ? [s.talk.general, s.talk.life] : [s.talk];
    if (s.reg === 'pro' && !s.talk.general) errs.push(`${sid}: pro stop without variants`);
    variants.forEach((t, i) => {
      for (const k of ['title', 'scene', 'who', 'persona', 'open', 'open_en', 'hint']) if (!t || !t[k]) errs.push(`${sid} talk${i}: missing ${k}`);
      if (!t.goals || t.goals.length < 3 || t.goals.length > 4) errs.push(`${sid} talk${i}: goals`);
    });
    const fx = FACTS[sid] || [];
    if (fx.length !== 4) errs.push(`${sid}: ${fx.length} facts`);
    if (new Set(fx.map(f => f.t)).size !== 4) errs.push(`${sid}: facts should cover all four themes`);
    fx.forEach((f, i) => {
      if (!FACT_THEMES[f.t]) errs.push(`${sid} f${i}: bad theme ${f.t}`);
      if (!f.h || f.h.length > 44) errs.push(`${sid} f${i}: headline missing or too long (${(f.h || '').length})`);
      const words = (f.b || '').split(/\s+/).length;
      if (!f.b || words > 52) errs.push(`${sid} f${i}: body missing or too long (${words} words)`);
      if (!Array.isArray(f.w) || f.w.length !== 2 || !f.w[0] || !f.w[1]) errs.push(`${sid} f${i}: bad word`);
      if (/[\u16A0-\u16FF]/.test(f.b)) errs.push(`${sid} f${i}: runic characters may not render`);
    });
    counts.facts += fx.length;
    counts.phrases += s.phrases.length; counts.replies += s.replies.length; counts.builds += s.builds.length; counts.gaps += (s.gaps || []).length; counts.talks += variants.length;
  }
}
if (Object.keys(FACTS).length !== 20) errs.push('facts for unknown stops');
if (Object.keys(STOPS).length !== 20) errs.push(`expected 20 stops, got ${Object.keys(STOPS).length}`);
console.log(errs.length ? errs.join('\n') : 'All checks passed', '\n', counts);
process.exit(errs.length ? 1 : 0);
