// Schema checks for the Surra curriculum.
const fs = require('fs');
const vm = require('vm');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(['data_a.js', 'data_b.js', 'facts.js', 'life.js'].map(f => fs.readFileSync(__dirname + '/../src/' + f, 'utf8')).join('\n') + '\n;this.LEVELS=LEVELS;this.STOPS=STOPS;this.FACTS=FACTS;this.FACT_THEMES=FACT_THEMES;this.LIFE=LIFE;this.LIFE_FACTS=LIFE_FACTS;', ctx);
const { LEVELS, STOPS, FACTS, FACT_THEMES, LIFE, LIFE_FACTS } = ctx;

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

// life-science track: lab lessons at work stops, and life-science signposts
let lifeCount = { lessons: 0, phrases: 0, replies: 0, builds: 0, facts: 0 };
const checkReply = (where, r) => {
  if (!r.who || !r.say || !r.en) errs.push(`${where}: missing who/say/en`);
  if (!r.opts || r.opts.length !== 3) { errs.push(`${where}: needs 3 options`); return; }
  const ok = r.opts.filter(o => o[2] === 1).length; if (ok !== 1) errs.push(`${where}: ${ok} correct`);
  r.opts.forEach((o, j) => { if (o.length !== 4 || !o[0] || !o[1] || !o[3]) errs.push(`${where} o${j}: malformed`); });
  if (new Set(r.opts.map(o => o[0])).size !== 3) errs.push(`${where}: duplicate options`);
};
const checkBuild = (where, b) => {
  const tiles = tok(b.sv).concat((b.extra || []).map(t => t.toLowerCase()));
  for (const alt of (b.alt || [])) { const pool = tiles.slice(); for (const t of tok(alt)) { const k = pool.indexOf(t); if (k < 0) errs.push(`${where}: alt token "${t}" not in tiles`); else pool.splice(k, 1); } }
  for (const e of (b.extra || [])) if (tok(b.sv).includes(e.toLowerCase())) errs.push(`${where}: extra "${e}" duplicates a real tile`);
};
for (const [sid, L] of Object.entries(LIFE)) {
  const st = STOPS[sid];
  if (!st) { errs.push(`life ${sid}: unknown stop`); continue; }
  if (!['pro', 'mixed'].includes(st.reg)) errs.push(`life ${sid}: only work stops get a lab lesson`);
  if (L.level !== st.level) errs.push(`life ${sid}: level ${L.level} != ${st.level}`);
  for (const k of ['title', 'en', 'intro']) if (!L[k]) errs.push(`life ${sid}: missing ${k}`);
  if (L.phrases.length !== 6) errs.push(`life ${sid}: ${L.phrases.length} phrases`);
  L.phrases.forEach((p, i) => { if (p.length < 2 || !p[0] || !p[1]) errs.push(`life ${sid} p${i}: bad phrase`); });
  if (new Set(L.phrases.map(p => p[1])).size !== L.phrases.length) errs.push(`life ${sid}: duplicate phrase translations`);
  if (L.replies.length !== 4) errs.push(`life ${sid}: ${L.replies.length} replies`);
  L.replies.forEach((r, i) => checkReply(`life ${sid} r${i}`, r));
  if (L.builds.length !== 2) errs.push(`life ${sid}: ${L.builds.length} builds`);
  L.builds.forEach((b, i) => checkBuild(`life ${sid} b${i}`, b));
  lifeCount.lessons++; lifeCount.phrases += L.phrases.length; lifeCount.replies += L.replies.length; lifeCount.builds += L.builds.length;
}
for (const [sid, f] of Object.entries(LIFE_FACTS)) {
  if (!STOPS[sid]) errs.push(`life fact ${sid}: unknown stop`);
  if (f.t !== 'science' || !f.h || f.h.length > 44 || !f.b || f.b.split(/\s+/).length > 52 || !Array.isArray(f.w) || f.w.length !== 2) errs.push(`life fact ${sid}: malformed`);
  lifeCount.facts++;
}
counts.life = lifeCount;

// colour themes: every palette defines every token in both modes, and text stays readable (WCAG contrast)
const tctx = {}; vm.createContext(tctx);
vm.runInContext(fs.readFileSync(__dirname + '/../src/themes.js', 'utf8') + '\n;this.THEMES=THEMES;this.THEME_VARS=THEME_VARS;', tctx);
const lum = hex => { const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const FIXED = { light: { moss: '#3B7A4E', lingon: '#C2394F', fx: ['#A93A2F', '#9A5A08', '#3B7A4E', '#6B4FC4', '#0E7470'] }, dark: { moss: '#7CCB8F', lingon: '#F57E93', fx: ['#EC7A64', '#F6B44E', '#7CCB8F', '#B39BFF', '#5FD3C8'] } };
const themeIds = new Set();
for (const t of tctx.THEMES) {
  if (themeIds.has(t.id)) errs.push(`theme ${t.id}: duplicate id`); themeIds.add(t.id);
  for (const mode of ['light', 'dark']) {
    const c = t[mode] || {};
    for (const k of tctx.THEME_VARS) if (!/^#[0-9A-Fa-f]{6}$/.test(c[k] || '')) errs.push(`theme ${t.id}/${mode}: missing or bad --${k}`);
    if (errs.length) continue;
    const need = (a, b, min, what) => { const r = contrast(c[a] || a, c[b] || b); if (r < min) errs.push(`theme ${t.id}/${mode}: ${what} contrast ${r.toFixed(2)} < ${min}`); };
    need('glow-ink', 'glow', 4.5, 'button text');
    need('ink', 'surface', 7, 'body text'); need('ink', 'bg', 7, 'body text on page');
    need('ink-2', 'surface', 4.5, 'secondary text'); need('ink-2', 'surface-2', 4.5, 'secondary text on tiles'); need('ink-2', 'bg', 4.5, 'secondary text on page');
    need('falu', 'surface', 4.5, 'accent/link'); need('falu', 'bg', 4.5, 'accent/link on page');
    need('ink', 'glow-soft', 4.5, 'text on soft chips');
    need('ink-3', 'surface', 2.8, 'faint text');
    for (const fx of FIXED[mode].fx) need(fx, 'surface', 4.5, 'fact label ' + fx);
    need(FIXED[mode].moss, 'surface', 4.5, 'correct green'); need(FIXED[mode].lingon, 'surface', 4.0, 'wrong red');
  }
}
if (Object.keys(STOPS).length !== 20) errs.push(`expected 20 stops, got ${Object.keys(STOPS).length}`);
// ---------- the map: every stop and every road must sit on land (independent of tools/mapgen.js)
const MAP = JSON.parse(fs.readFileSync(__dirname + '/../src/mapdata.json', 'utf8'));
const mapStats = (() => {
  const parse = s => s.split(' ').map(q => q.split(',').map(Number));
  const land = MAP.sweden.map(parse), lakes = MAP.lakes.map(parse);
  const inRing = (q, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > q[1]) !== (yj > q[1]) && q[0] < (xj - xi) * (q[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  const segD = (q, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy; const t = l ? Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / l)) : 0; return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy); };
  const edgeD = (q, rs) => { let d = Infinity; for (const r of rs) for (let i = 0, j = r.length - 1; i < r.length; j = i++) d = Math.min(d, segD(q, r[j], r[i])); return d; };
  const margin = q => (!land.some(r => inRing(q, r)) ? -edgeD(q, land) : lakes.some(r => inRing(q, r)) ? -edgeD(q, lakes) : Math.min(edgeD(q, land), edgeD(q, lakes)));
  const ORDER = LEVELS.flatMap(l => l.stops), P = MAP.cities;
  let cityMin = Infinity, roadMin = Infinity, samples = 0;
  for (const sid of ORDER) {
    if (!P[sid]) { errs.push(`map: no position for ${sid}`); continue; }
    const m = margin(P[sid]); cityMin = Math.min(cityMin, m);
    if (m < 0.8) errs.push(`map: ${sid} is ${m < 0 ? 'in the water' : 'on the shoreline'} (${m.toFixed(2)})`);
  }
  // roads are cubic Bézier paths ("M x y C x1 y1 x2 y2 x y ...")
  const curvesOf = d => { const n = d.match(/-?\d+(\.\d+)?/g).map(Number), out = []; let p = [n[0], n[1]]; for (let i = 2; i + 5 < n.length + 1; i += 6) { const q = [n[i + 4], n[i + 5]]; out.push([p, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], q]); p = q; } return out; };
  const bz = ([a, b, cc, d], t) => { const u = 1 - t; return [0, 1].map(j => u * u * u * a[j] + 3 * u * u * t * b[j] + 3 * u * t * t * cc[j] + t * t * t * d[j]); };
  for (let i = 0; i < ORDER.length - 1; i++) {
    const key = ORDER[i] + '-' + ORDER[i + 1], seg = MAP.roads.segs[key];
    if (!seg) { errs.push(`map: no road for ${key}`); continue; }
    const curves = seg.p.flatMap(id => { const raw = MAP.roads.pieces[id.replace(/^-/, '')]; if (!raw) { errs.push(`map: ${key} uses missing piece ${id}`); return []; } const cv = curvesOf(raw); return id[0] === '-' ? cv.reverse().map(([a, b, cc, d]) => [d, cc, b, a]) : cv; });
    if (!curves.length) continue;
    const start = curves[0][0], end = curves[curves.length - 1][3], A = P[ORDER[i]], B = P[ORDER[i + 1]];
    if (Math.hypot(start[0] - A[0], start[1] - A[1]) > 0.05 || Math.hypot(end[0] - B[0], end[1] - B[1]) > 0.05) errs.push(`map: ${key} does not run from ${ORDER[i]} to ${ORDER[i + 1]}`);
    let worst = Infinity, where = null;
    for (const cv of curves) {
      const n = Math.max(6, Math.ceil(Math.hypot(cv[3][0] - cv[0][0], cv[3][1] - cv[0][1]) / 0.25));
      for (let k = 0; k <= n; k++) {
        const q = bz(cv, k / n), nearCity = Math.min(Math.hypot(q[0] - A[0], q[1] - A[1]), Math.hypot(q[0] - B[0], q[1] - B[1])) < 2;
        const m = margin(q), need = nearCity ? 0.2 : 0.5; samples++;
        if (!nearCity) roadMin = Math.min(roadMin, m);
        if (m < need && m < worst) { worst = m; where = q; }
      }
    }
    if (where) errs.push(`map: road ${key} reaches the water near ${where.map(v => v.toFixed(1))} (${worst.toFixed(2)})`);
  }
  return { cities: ORDER.length, closestCity: +cityMin.toFixed(2), roadSamples: samples, closestRoad: +roadMin.toFixed(2) };
})();
counts.map = mapStats;
console.log(errs.length ? errs.join('\n') : 'All checks passed', '\n', counts, '\n themes:', tctx.THEMES.length);
process.exit(errs.length ? 1 : 0);
