/* ================= Surra UI ================= */

/* ---------- icons (24px, stroke) */
const circ = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
const ICONS = {
  close: 'M6 6l12 12M18 6L6 18', x: 'M6 6l12 12M18 6L6 18', check: 'M5 12.5l4.5 4.5L19 7.5',
  speaker: ['M4 9.5v5h3.5l5 4v-13l-5 4H4z', 'M16 9a4.5 4.5 0 0 1 0 6', 'M18.6 6.5a8 8 0 0 1 0 11'],
  lock: ['M7.5 11V8a4.5 4.5 0 0 1 9 0v3', 'M5.5 11h13v10h-13z'],
  star: 'M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4-4.7-4.6 6.5-.9z',
  candle: ['M9.5 21V11h5v10', 'M8 21h8', 'M12 8c-1.6-1.3-1.4-3.3 0-5 1.4 1.7 1.6 3.7 0 5z'],
  bolt: 'M13 2.5L4.5 13.5h6.5l-1 8 8.5-11h-6.5z',
  chat: 'M5 4.5h14a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-8.5L6 20.5V17H5a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2z',
  flag: ['M5 21V4', 'M5 4.5h11.5l-2.2 4 2.2 4H5'],
  moon: 'M20 14.5A8.2 8.2 0 0 1 9.5 4a8.2 8.2 0 1 0 10.5 10.5z',
  sun: [circ(12, 12, 4), 'M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4'],
  pen: ['M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z', 'M13.5 7.5l3.5 3.5'],
  refresh: ['M20 11.5a8 8 0 1 0-2.4 5.6', 'M20 4.5v7h-7'],
  stamp: ['M9.5 3.5h5v5.5l3.5 3v3h-12v-3l3.5-3z', 'M5 19.5h14'],
  mountain: ['M2.5 20l7-11.5 4 6 3-4.5 5 10z'],
  timer: [circ(12, 13.5, 7.5), 'M12 9.5v4.2l2.6 1.6', 'M9.5 2.5h5'],
  book: ['M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z', 'M12 6.5V20'],
  map: ['M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z', 'M9 4v14', 'M15 6v14'],
  gear: [circ(12, 12, 3.2), 'M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1'],
  arrowR: 'M5 12h14M13 6l6 6-6 6', arrowL: 'M19 12H5M11 6l-6 6 6 6',
  chevDown: 'M6 9l6 6 6-6', chevUp: 'M6 15l6-6 6 6',
  bulb: ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z'],
  send: 'M4 12L20 4l-5.5 16-3.2-6.8z',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  info: [circ(12, 12, 9), 'M12 11v5.5M12 7.8v.01'],
  pin: ['M12 21s-6.5-6-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z', circ(12, 9.5, 2.3)],
  trophy: ['M8 4h8v5a4 4 0 0 1-8 0z', 'M8 6H4.5a3 3 0 0 0 3.6 4', 'M16 6h3.5a3 3 0 0 1-3.6 4', 'M12 13v4', 'M8.5 21h7', 'M10 17h4v4h-4z'],
  columns: ['M3 9l9-5 9 5z', 'M5.5 9v9.5M9.5 9v9.5M14.5 9v9.5M18.5 9v9.5', 'M3 21h18'],
  cup: ['M4.5 9.5h11v4.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z', 'M15.5 11h1.8a2.6 2.6 0 0 1 0 5.2h-2.1', 'M8.5 3.5c-.9 1.1.9 2 0 3.2M12 3.5c-.9 1.1.9 2 0 3.2'],
  pine: ['M12 2.8l4.6 6.2h-2.8l4.4 6.3H5.8l4.4-6.3H7.4z', 'M12 15.3V21'],
  aring: ['M4.5 4.5h15A1.5 1.5 0 0 1 21 6v9a1.5 1.5 0 0 1-1.5 1.5H11L6.5 20v-3.5h-2A1.5 1.5 0 0 1 3 15V6a1.5 1.5 0 0 1 1.5-1.5z', 'M7.5 9h9M7.5 12.3h5.5'],
  user: [circ(12, 8, 4), 'M4.5 20.5c1.2-4 4.1-6 7.5-6s6.3 2 7.5 6'],
  mail: ['M3.5 6h17v12.5h-17z', 'M4 6.6l8 6.4 8-6.4'],
  logout: ['M10 4.5H5.5v15H10', 'M14.5 8l4 4-4 4', 'M18.5 12H9.5'],
  cloud: 'M7.2 18.5a4.6 4.6 0 0 1-.7-9.15 6 6 0 0 1 11.5 1.3 4 4 0 0 1-.5 7.85z',
  download: ['M12 4v11', 'M7.5 10.5L12 15l4.5-4.5', 'M5 19.5h14'],
  trash: ['M4.5 7h15', 'M9.5 7V4.5h5V7', 'M6.5 7l1 13h9l1-13'],
  eye: ['M2.5 12s3.5-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.5 6.5-9.5 6.5S2.5 12 2.5 12z', circ(12, 12, 3)],
  home: ['M3.5 11.2L12 4l8.5 7.2', 'M6 9.6V20h12V9.6', 'M10 20v-5.6h4V20'],
  flask: ['M9 3.5h6', 'M10 3.5v6.2L4.9 18.1a1.6 1.6 0 0 0 1.4 2.4h11.4a1.6 1.6 0 0 0 1.4-2.4L14 9.7V3.5', 'M7.3 14.6h9.4'],
  plus: 'M12 5v14M5 12h14', minus: 'M5 12h14',
  locate: [circ(12, 12, 3.4), circ(12, 12, 7.5), 'M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22'],
  fit: ['M4 9V4h5', 'M20 9V4h-5', 'M4 15v5h5', 'M20 15v5h-5'],
  sign: ['M12 21.5V9', 'M5 3.5h11.5l3 3-3 3H5z', 'M9 21.5h6'],
  users: [circ(9, 8, 3.5), 'M2.5 20c.9-3.6 3.4-5.5 6.5-5.5s5.6 1.9 6.5 5.5', 'M15.5 4.8a3.5 3.5 0 0 1 0 6.4', 'M17.5 14.8c2.1.7 3.4 2.5 4 5.2'],
  swords: ['M14.5 17.5L3 6V3h3l11.5 11.5', 'M13 19l6-6', 'M16 16l4 4', 'M19 21l2-2', 'M14.5 6.5L18 3h3v3l-3.5 3.5', 'M5 14l4 4', 'M7 17l-3 3', 'M3 19l2 2'],
  eyeOff: ['M3 3l18 18', 'M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4', 'M6.3 6.8C3.9 8.4 2.5 12 2.5 12s3.5 6.5 9.5 6.5a9.3 9.3 0 0 0 4.4-1.1', 'M9.9 9.9a3 3 0 0 0 4.2 4.2'],
  bell: ['M18 9.6a6 6 0 0 0-12 0c0 5-1.9 6.6-2.6 7.2h17.2c-.7-.6-2.6-2.2-2.6-7.2z', 'M10 20.2a2.2 2.2 0 0 0 4 0'],
  invite: [circ(9.5, 8, 3.6), 'M3 20.3c1-3.7 3.5-5.6 6.5-5.6s5.5 1.9 6.5 5.6', 'M18.5 7.5v6M15.5 10.5h6'],
};
const GLYPHS = {
  tower: ['M9 21V4.5l6-1.5v18', 'M9 8.5l6-1.6M9 12.5l6-1.6M9 16.5l6-1.6', 'M6 21h12'],
  stones: ['M3 19h18', 'M4.5 15.5l.7-3M7.5 17v-4.5M10.5 17.5V13M13.5 17.5V13M16.5 17v-4.5M19.5 15.5l-.7-3'],
  church: ['M5 21V9.5l2-3 2 3V21', 'M15 21V9.5l2-3 2 3V21', 'M9 21v-8h6v8', 'M11 21v-3.2h2V21', 'M3.5 21h17'],
  keep: ['M7 21V7.5h10V21', 'M7 7.5V4h2v2h2V4h2v2h2V4h2v3.5', 'M10.8 21v-4h2.4v4', 'M10 11h.01M14 11h.01'],
  ship: ['M3 15h18l-3 4.5H6z', 'M12 15V3', 'M12 4.5l5.5 8.5H12', 'M12 6.5l-4.5 6.5H12'],
  match: ['M8.5 20.5L16 9', 'M16.4 8.6c-2-1.6-1.6-4 .3-5.8.1 2.1 2.6 2.7 1.6 5.1-.4 1-1.1 1.2-1.9.7z'],
  plane: ['M3 13.5l18-7-5.5 13.5-3.3-5.2z', 'M12.2 14.8L21 6.5'],
  wave: ['M3 8c3 0 3 2 6 2s3-2 6-2 3 2 6 2', 'M3 13c3 0 3 2 6 2s3-2 6-2 3 2 6 2', 'M3 18c3 0 3 2 6 2s3-2 6-2 3 2 6 2'],
  castle: ['M4 21V9h3.5v12', 'M16.5 21V9H20v12', 'M7.5 21v-8.5h9V21', 'M4 9V6.5h3.5V9M16.5 9V6.5H20V9', 'M10.8 21v-3.6h2.4V21'],
  cucumber: ['M4.5 17.5c2.5-7.5 9-12.5 15.5-12.5-.6 6.5-6 12.6-14.2 13.6a1.2 1.2 0 0 1-1.3-1.1z', 'M9.5 13.5h.01M12.5 10.5h.01M14.5 13.5h.01M11 16h.01'],
  book: ['M12 6.5C10 5 7 4.5 3.5 5v13.5c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5z', 'M12 6.5V20'],
  crown: ['M4 17l-1-9 5 4 4-7 4 7 5-4-1 9z', 'M4 20.5h16'],
  goat: ['M5 11.5h10v4.5H5z', 'M6.5 16v4.5M9 16v4.5M11.5 16v4.5M14 16v4.5', 'M15 11.5l2-4h3.5l-1.2 3.2', 'M17.8 7.5c-.2-2.6 2.2-4.2 4-2.6', 'M5 11.5L3 9'],
  columns: ['M3 9l9-5 9 5z', 'M5.5 9v10M9.5 9v10M14.5 9v10M18.5 9v10', 'M3 21h18'],
  monster: ['M2 17c2 0 2-4.5 4-4.5s2 4.5 4 4.5', 'M10 17c2 0 2-5.5 4-5.5s2 5.5 4 5.5', 'M18 17c1.2 0 1.4-6.5 3-6.5 .8 0 1 .8 1 1.5', 'M2 20.5h20'],
  birch: ['M12 21V10.5', 'M10.5 14h1.5M12 17h1.5M10.5 19.5h1.5', 'M12 10.5c-4.2 0-6.5-3.2-5.3-6.2.9-2.2 3.9-2.3 5.3-1 1.4-1.3 4.4-1.2 5.3 1 1.2 3-1.1 6.2-5.3 6.2z'],
  anchor: [circ(12, 5, 2), 'M12 7v14', 'M8 11h8', 'M4.5 14.5c0 3.8 3.4 6.5 7.5 6.5s7.5-2.7 7.5-6.5'],
  antlers: ['M12 20.5v-5', circ(12, 13.5, 2.2), 'M10.4 12C7.5 11 6 8.5 6 5', 'M6 8.5L3.5 6.5M6.6 10.4L3.5 10', 'M13.6 12c2.9-1 4.4-3.5 4.4-7', 'M18 8.5l2.5-2M17.4 10.4l3.1-.4'],
  mountain: ['M2 20l7-11.5 4 6 3-4.5 6 10z', 'M7.3 11.3L9 8.5l1.6 2.4'],
  aurora: ['M3 15c3-6 6-2 9-8', 'M7 18c3-6 6-2 9-8', 'M11 20.5c3-6 6-2 9-8', 'M5 5h.01M19 4h.01M15 3.5h.01'],
};
function Icon({ n, s = 22, w = 2, fill = false, cls }) {
  const d = ICONS[n] || ICONS.star; const ps = Array.isArray(d) ? d : [d];
  return html`<svg class=${cls} width=${s} height=${s} viewBox="0 0 24 24" fill=${fill ? 'currentColor' : 'none'} stroke=${fill ? 'none' : 'currentColor'} stroke-width=${w} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ps.map(p => html`<path d=${p} />`)}</svg>`;
}
function Glyph({ n, s = 24 }) {
  const ps = GLYPHS[n] || GLYPHS.stones;
  return html`<svg width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ps.map(p => html`<path d=${p} />`)}</svg>`;
}
function Stars({ n, s = 15 }) {
  return html`<span class="stars" role="img" aria-label=${`${n} of 3 stars`}>${[1, 2, 3].map(i => html`<span class=${i <= n ? '' : 'off'}><${Icon} n="star" s=${s} fill /></span>`)}</span>`;
}
function Ring({ v, max, size = 24 }) {
  const r = (size - 5) / 2, c = 2 * Math.PI * r, p = Math.min(1, max ? v / max : 0), h = size / 2;
  return html`<svg class="ring" width=${size} height=${size} viewBox=${`0 0 ${size} ${size}`} aria-hidden="true"><circle class="bg" cx=${h} cy=${h} r=${r} /><circle class="fg" cx=${h} cy=${h} r=${r} stroke-dasharray=${c} stroke-dashoffset=${c * (1 - p)} transform=${`rotate(-90 ${h} ${h})`} /></svg>`;
}
function SayBtn({ text, small }) {
  const env = ENV.use();
  if (!env.tts) return null;
  return html`<button class=${cx('iconbtn', small && 'small')} type="button" onClick=${e => { e.stopPropagation(); speak(text); }} aria-label="Listen (tap twice to hear it slower)" title="Listen · tap twice for slow"><${Icon} n="speaker" s=${small ? 17 : 22} /></button>`;
}
/* ---------- facts */
function FactCard({ sid, i, fact, fresh, city = true }) {
  const f = fact || FACTS[sid][i], th = FACT_THEMES[f.t];
  return html`<article class=${cx('fact', 'f-' + f.t, fresh && 'fresh')}>
    <div class="fact-top"><span class="fact-th"><${Icon} n=${th.icon} s=${15} />${th.en}</span>${city ? html`<span class="fact-city">${STOPS[sid].city}</span>` : null}</div>
    <h3>${f.h}</h3>
    <p>${f.b}</p>
    <div class="fact-word"><${SayBtn} text=${f.w[0]} small /><span class="sv" lang="sv">${f.w[0]}</span><span class="en">${f.w[1]}</span></div>
  </article>`;
}
function LockedFact({ sid, i, fact, hint }) {
  const f = fact || FACTS[sid][i], th = FACT_THEMES[f.t];
  return html`<div class=${cx('fact', 'locked', 'f-' + f.t)}><span class="fact-th"><${Icon} n=${th.icon} s=${15} />${th.en}</span><span class="lockline"><${Icon} n="lock" s=${15} />${hint || factHint(i)}</span></div>`;
}
function NewFacts({ sid, list }) {
  if (!sid || !list || !list.length) return null;
  return html`<div class="newfact"><span class="eyebrow newfact-label"><${Icon} n="bulb" s=${15} />${list.length > 1 ? `${list.length} new facts unlocked` : 'New fact unlocked'}</span>
    ${list.map(i => html`<${FactCard} key=${i} sid=${sid} i=${i} fresh city=${false} />`)}</div>`;
}
function FactOfDay({ s }) {
  const d = dailyFact(s);
  const f = FACTS[d.sid][d.i], th = FACT_THEMES[f.t];
  return html`<section class="factday" aria-label="Did you know?">
    <div class="sec-head" style="margin-bottom:8px;align-items:center"><span class="eyebrow">Did you know?</span><span class="chip num">${factsTotal(s)}/${FACT_TOTAL} facts</span></div>
    ${d.locked ? html`<div class=${cx('fact', 'teaser', 'f-' + f.t)}>
        <div class="fact-top"><span class="fact-th"><${Icon} n=${th.icon} s=${15} />${th.en}</span><span class="fact-city">${STOPS[d.sid].city}</span></div>
        <h3>${f.h}</h3>
        <p class="lockline"><${Icon} n="lock" s=${15} />Finish your first lesson in ${STOPS[d.sid].city} to read this one.</p>
      </div>`
      : html`<${FactCard} sid=${d.sid} i=${d.i} />`}
  </section>`;
}
function FactShelf({ s }) {
  const [th, setTh] = useState('all');
  const total = factsTotal(s);
  const life = lifeOn(s);
  const items = ORDER.flatMap(sid => [...Array.from({ length: factsUnlocked(s, sid) }, (_, i) => [sid, i, FACTS[sid][i]]), ...(life && LIFE_FACTS[sid] && lifeFactOpen(s, sid) ? [[sid, 'life', LIFE_FACTS[sid]]] : [])])
    .filter(([, , f]) => th === 'all' || f.t === th);
  return html`<section class="card" style="margin-top:16px">
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h2 class="display" style="font-size:26px">Fika facts</h2><span class="chip glow num">${total}/${FACT_TOTAL}</span></div>
    <p class="muted" style="font-size:14px;margin:4px 0 14px">Each lesson you finish at a stop unlocks a fact about Sweden. A gold stamp unlocks the fourth.</p>
    <div class="themechips" role="group" aria-label="Filter facts by theme">
      ${[['all', 'All', null], ...Object.keys(FACT_THEMES).filter(k => k !== 'science' || life).map(k => [k, FACT_THEMES[k].en, FACT_THEMES[k].icon])].map(([k, l, ic]) => html`<button class="chip" aria-pressed=${String(th === k)} onClick=${() => setTh(k)}>${ic ? html`<${Icon} n=${ic} s=${14} />` : null}${l}</button>`)}
    </div>
    ${items.length ? html`<div class="factgrid">${items.map(([sid, i, f]) => html`<${FactCard} key=${sid + i} sid=${sid} fact=${f} />`)}</div>`
      : html`<div class="lockmsg" style="margin-top:12px"><${Icon} n="lock" /><span>${total ? 'No facts in this theme yet. Keep travelling.' : 'Finish a lesson to unlock your first fact.'}</span></div>`}
  </section>`;
}
function BeeShape() {
  return html`<g class="bee-bob">
    <g transform="translate(-3.5 -5) rotate(-22)"><ellipse class="wing" cx="0" cy="-3" rx="3.4" ry="5.4" /></g>
    <g transform="translate(2 -5.5) rotate(18)"><ellipse class="wing" cx="0" cy="-3" rx="3.4" ry="5.4" /></g>
    <ellipse class="body" cx="0" cy="0" rx="8.6" ry="6.2" />
    <path d="M-3.2 -5.6q2.2 5.6 0 11.2M1 -6q2.2 6 0 12" fill="none" stroke="var(--ink)" stroke-width="2.1" />
    <path d="M-8.4 .6l-3 .9" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round" />
    <circle class="head" cx="9.2" cy="-1.2" r="3.9" />
    <circle cx="10.3" cy="-2.1" r="1.05" fill="var(--surface)" />
  </g>`;
}
function BeeLogo({ s = 34 }) {
  return html`<svg width=${s} height=${s} viewBox="-16 -16 32 32" class="bee" aria-hidden="true"><${BeeShape} /></svg>`;
}

/* ---------- sheet & confirm */
function useBodyLock(on) {
  useEffect(() => { if (!on) return; const p = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = p; }; }, [on]);
}
function Sheet({ onClose, label, children }) {
  const ref = useRef(null);
  useBodyLock(true);
  useBack(onClose);
  useEffect(() => {
    const prev = document.activeElement;
    if (ref.current) ref.current.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); if (prev && prev.focus) try { prev.focus(); } catch (e) { /* gone */ } };
  }, []);
  return html`<div class="scrim" onClick=${onClose}></div>
    <div class="sheet" role="dialog" aria-modal="true" aria-label=${label} tabindex="-1" ref=${ref}><div class="grab"></div>${children}</div>`;
}
function Confirm({ title, text, yes, no, onYes, onNo, danger }) {
  useBack(onNo);
  return html`<div class="confirm"><div class="scrim" onClick=${onNo}></div>
    <div class="box" role="alertdialog" aria-label=${title}><b style="font-size:18px">${title}</b>${text ? html`<p class="muted">${text}</p>` : null}
      <div class="row"><button class="btn ghost" onClick=${onNo}>${no}</button><button class=${cx('btn', danger ? 'bad' : 'primary')} onClick=${onYes}>${yes}</button></div></div></div>`;
}

/* ---------- the map */
/* ---------- home */
function ContinueCard({ s, startAction, openStop, openRegion }) {
  const a = nextAction(s);
  if (a.type === 'lesson') {
    const st = STOPS[a.sid], L = LEVELS[LEVEL_INDEX[a.sid]];
    return html`<section class="card cont" aria-label="Next stop">
      <div class="eyebrow">Next stop · ${L.id} ${L.region}</div>
      <h2 class="display">${st.city}</h2>
      <p class="theme">${st.theme} <span class="muted" style="font-weight:700">· ${st.en}</span></p>
      <div class="lessons-mini">${['learn', 'reply', 'talk'].map(l => html`<span class=${cx('lmini', starsOf(s, a.sid, l) && 'done', l === a.lesson && 'now')}>${starsOf(s, a.sid, l) ? html`<${Icon} n="check" s=${14} w=${3} />` : null}${LESSON_META[l].en}</span>`)}</div>
      <div class="row">
        <button class="btn primary" onClick=${() => startAction(a)}>Continue: ${LESSON_META[a.lesson].en}<${Icon} n="arrowR" s=${20} /></button>
        <button class="linkbtn" onClick=${() => openStop(a.sid)}>About ${st.city}</button>
      </div>
    </section>`;
  }
  if (a.type === 'checkpoint') {
    const L = LEVELS[a.li], nx = LEVELS[a.li + 1];
    return html`<section class="card cont" aria-label="Checkpoint">
      <div class="eyebrow">Checkpoint · ${L.id} ${L.region}</div>
      <h2 class="display">${nx ? `On to ${nx.region}` : 'The final test'}</h2>
      <p class="theme">${nx ? `Pass the ${L.id} checkpoint to unlock ${nx.region} (${nx.id}).` : 'Pass the C1 checkpoint to finish the journey in Kiruna.'}</p>
      <p class="muted" style="margin-block:6px 18px">12 questions from all four ${L.region} stops. Get 9 right to pass.</p>
      <div class="row"><button class="btn primary" onClick=${() => startAction(a)}>Start checkpoint<${Icon} n="arrowR" s=${20} /></button><button class="linkbtn" onClick=${() => openRegion(a.li)}>Review ${L.region}</button></div>
    </section>`;
  }
  return html`<section class="card cont">
    <div class="eyebrow">Journey complete</div>
    <h2 class="display">Kiruna!</h2>
    <p class="theme">You've travelled from Malmö to Kiruna. Keep your Swedish sharp with quick replies, reviews and new conversations.</p>
    <div class="row" style="margin-top:16px"><button class="btn primary" onClick=${() => startAction({ type: 'quick' })}>Play Snabbsvar<${Icon} n="arrowR" s=${20} /></button></div>
  </section>`;
}
function JourneyList({ s, openStop, openRegion }) {
  const cur = currentStop(s);
  return html`<section class="journey" aria-label="All stops">
    ${LEVELS.map((L, li) => {
      const ls = levelState(s, li), done = L.stops.filter(sid => stopDone(s, sid)).length;
      return html`<div class=${cx('leg', ls)} key=${L.id}>
        <button class="leg-head" onClick=${() => openRegion(li)} aria-label=${`${L.id} ${L.region}. ${L.en}.`}>
          <span class="lvl">${L.id}</span>
          <span class="leg-title"><h3>${L.region}</h3><p>${L.en} · <i>${L.title}</i></p></span>
          ${ls === 'passed' ? html`<span class="chip moss"><${Icon} n="check" s=${14} w=${3} />Passed</span>` : ls === 'locked' ? html`<span class="chip"><${Icon} n="lock" s=${14} />Locked</span>` : html`<span class="chip glow num">${done}/4</span>`}
        </button>
        <div class="stops-row">
          ${L.stops.map(sid => {
            const st = STOPS[sid], open = stopOpen(s, sid), dn = stopDone(s, sid), now = cur === sid && ls !== 'passed';
            return html`<button class=${cx('stopchip', dn && 'done', now && 'now', !open && 'locked')} onClick=${() => openStop(sid)} key=${sid}>
              <span class="glyphbox"><${Glyph} n=${st.glyph} s=${22} /></span>
              <span class="tx"><span class="nm">${st.city}</span><span class="th">${st.theme}</span></span>
              ${!open ? html`<span class="faint"><${Icon} n="lock" s=${15} /></span>` : dn ? html`<${Stars} n=${Math.min(starsOf(s, sid, 'learn') || 0, starsOf(s, sid, 'reply'))} s=${11} />` : null}
            </button>`;
          })}
          <button class=${cx('stopchip cp', s.checkpoints[L.id] && 'done', !levelUnlocked(s, li) && 'locked')} onClick=${() => openRegion(li)}>
            <span class="glyphbox"><${Icon} n="flag" s=${20} /></span>
            <span class="tx"><span class="nm">Checkpoint</span><span class="th">${s.checkpoints[L.id] ? 'Passed' : !levelUnlocked(s, li) ? 'Locked' : L.stops.every(sid => stopDone(s, sid)) ? 'Ready' : 'Test out any time'}</span></span>
          </button>
        </div>
      </div>`;
    })}
  </section>`;
}
/* ---------- sheets */
function RegionSheet({ li, s, onClose, openStop, start }) {
  const L = LEVELS[li], nx = LEVELS[li + 1], unlocked = levelUnlocked(s, li), passed = !!s.checkpoints[L.id];
  const cur = currentStop(s);
  return html`<${Sheet} onClose=${onClose} label=${`${L.id} ${L.region}`}>
    <div class="sheet-head">
      <span class="lvl" style=${passed ? 'background:var(--moss-soft);color:var(--moss)' : unlocked ? 'background:var(--glow);color:var(--glow-ink)' : ''}>${L.id}</span>
      <div style="min-width:0"><div class="eyebrow">${L.en} · Rank: ${L.rank}</div><h2>${L.region}</h2></div>
      <button class="iconbtn close" onClick=${onClose} aria-label="Close"><${Icon} n="close" /></button>
    </div>
    <p class="muted" style="margin-top:10px">${L.blurb}</p>
    <div class="section"><span class="eyebrow">Stops</span>
      ${L.stops.map(sid => {
        const st = STOPS[sid], open = stopOpen(s, sid);
        return html`<button class=${cx('lessonrow', cur === sid && !passed && 'next')} onClick=${() => openStop(sid)}>
          <span class="li"><${Glyph} n=${st.glyph} s=${24} /></span>
          <span class="tx"><b>${st.city} <span class="faint" style="font-weight:700">· ${st.theme}</span></b><span>${st.en}</span></span>
          ${open ? html`<${Stars} n=${starsOf(s, sid, 'reply')} />` : html`<span class="faint"><${Icon} n="lock" s=${18} /></span>`}
        </button>`;
      })}
    </div>
    <div class="section"><span class="eyebrow">Checkpoint</span>
      ${passed ? html`<div class="tip"><${Icon} n="check" /><span>Passed. ${nx ? `${nx.region} is open.` : 'You finished the journey!'} You can retake it any time for practice.</span></div>
        <button class="btn ghost wide" style="margin-top:10px" onClick=${() => start({ type: 'checkpoint', li })}>Retake for practice</button>`
      : unlocked ? html`<div class="tip"><${Icon} n="flag" /><span>12 questions mixed from all four stops. Get 9 right to ${nx ? `unlock ${nx.region}` : 'finish the journey'}. Feeling confident? Take it now to skip ahead.</span></div>
        <button class="btn primary wide" style="margin-top:10px" onClick=${() => start({ type: 'checkpoint', li })}>Take the ${L.id} checkpoint</button>`
      : html`<div class="lockmsg"><${Icon} n="lock" />Pass the ${LEVELS[li - 1].id} checkpoint to unlock ${L.region}.</div>`}
    </div>
  <//>`;
}
function lockReason(s, sid) {
  const li = LEVEL_INDEX[sid];
  if (!levelUnlocked(s, li)) return `Pass the ${LEVELS[li - 1].id} checkpoint to unlock ${LEVELS[li].region}.`;
  const st = LEVELS[li].stops, k = st.indexOf(sid);
  return `Finish “Respond” in ${STOPS[st[k - 1]].city} first, or pass the ${LEVELS[li].id} checkpoint to skip ahead.`;
}
function StopSheet({ sid, s, onClose, start }) {
  const env = ENV.use();
  const st = STOPS[sid], L = LEVELS[LEVEL_INDEX[sid]], open = stopOpen(s, sid);
  const a = nextAction(s), nextL = a.type === 'lesson' && a.sid === sid ? a.lesson : null;
  const [all, setAll] = useState(false);
  const v = st.talk.general ? (s.settings.work === 'life' ? st.talk.life : st.talk.general) : st.talk;
  const partner = v.who.split(',')[0];
  const stamp = stampState(s, sid);
  const talkDesc = env.ai === 'off'
    ? 'Guided version: choose replies in the scene. Live role-play needs Claude.'
    : `Role-play with ${partner}${st.talk.general && s.settings.work === 'mix' ? ' (office or life-science version)' : ''}. Claude answers and corrects every message.`;
  return html`<${Sheet} onClose=${onClose} label=${st.city}>
    <div class="sheet-head">
      <div class=${cx('stamp', stamp)} style="width:78px;flex:none" aria-label=${stamp === 'off' ? 'Stamp not collected yet' : 'Stamp collected'}><div class="in"><${Glyph} n=${st.glyph} s=${26} /><span class="lv">${L.id}</span></div></div>
      <div style="min-width:0">
        <div class="eyebrow">${L.id} · ${L.region}</div>
        <h2>${st.city}</h2>
        <div class="tags"><span class="chip falu">${REG_EN[st.reg]}</span><span class="chip">${st.theme}</span></div>
      </div>
      <button class="iconbtn close" onClick=${onClose} aria-label="Close"><${Icon} n="close" /></button>
    </div>
    <p style="margin-top:14px"><b>${st.en}.</b> ${st.intro}</p>
    ${open ? html`<div class="section"><span class="eyebrow">Lessons</span>
        ${['learn', 'reply', 'talk'].map(l => html`<button class=${cx('lessonrow', nextL === l && 'next')} onClick=${() => start({ type: 'lesson', sid, lesson: l })}>
          <span class="li"><${Icon} n=${LESSON_META[l].icon} /></span>
          <span class="tx"><b>${LESSON_META[l].en} <span class="faint" style="font-weight:700">· ${LESSON_META[l].sv}</span></b><span>${l === 'talk' ? talkDesc : LESSON_META[l].desc}</span></span>
          <${Stars} n=${starsOf(s, sid, l)} />
        </button>`)}
        ${lifeOn(s) && LIFE[sid] ? html`<button class=${cx('lessonrow', 'liferow')} onClick=${() => start({ type: 'lesson', sid, lesson: 'life' })}>
          <span class="li"><${Icon} n="flask" /></span>
          <span class="tx"><b>${LIFE[sid].en} <span class="faint" style="font-weight:700">· Life science</span></b><span>${LIFE[sid].intro}</span></span>
          <${Stars} n=${starsOf(s, sid, 'life')} />
        </button>` : null}
        ${env.ai === 'ready' ? html`<button class="lessonrow" onClick=${() => start({ type: 'generate', sid })}>
          <span class="li"><${Icon} n="sparkle" /></span>
          <span class="tx"><b>Fresh situations</b><span>Claude writes 6 new reply drills on this theme</span></span>
          <${Icon} n="arrowR" />
        </button>` : null}
      </div>`
      : html`<div class="section lockmsg"><${Icon} n="lock" /><span>${lockReason(s, sid)}</span></div>`}
    <div class="section"><div class="tip"><${Icon} n="bulb" /><span><b>Culture note.</b> ${st.culture}</span></div></div>
    <div class="section"><span class="eyebrow">Did you know? · ${factsUnlocked(s, sid)}/${FACTS[sid].length}</span>
      <div class="factlist">${FACTS[sid].map((f, i) => (i < factsUnlocked(s, sid) ? html`<${FactCard} key=${i} sid=${sid} i=${i} city=${false} />` : html`<${LockedFact} key=${i} sid=${sid} i=${i} />`))}
        ${lifeOn(s) && LIFE_FACTS[sid] ? (lifeFactOpen(s, sid) ? html`<${FactCard} sid=${sid} fact=${LIFE_FACTS[sid]} city=${false} />` : html`<${LockedFact} sid=${sid} fact=${LIFE_FACTS[sid]} hint="Finish any lesson here to unlock" />`) : null}</div>
    </div>
    <div class="section"><span class="eyebrow">Key phrases</span>
      ${st.phrases.slice(0, all ? 8 : 4).map(p => html`<div class="phrase"><${SayBtn} text=${p[0]} small /><div class="tx"><div class="sv">${p[0]}</div><div class="en">${p[1]}</div></div></div>`)}
      ${all ? null : html`<button class="linkbtn" onClick=${() => setAll(true)}>Show all 8 phrases</button>`}
    </div>
  <//>`;
}

/* ---------- lesson player */
const PRAISE = ['Snyggt!', 'Rätt!', 'Helt rätt!', 'Bra jobbat!', 'Perfekt!', 'Kanon!'];
const normTxt = x => String(x).toLowerCase().replace(/[.,!?:;“”"]/g, ' ').replace(/\s+/g, ' ').trim();
const initialOf = who => (String(who).replace(/^(A|An|The|Your)\s+/i, '').trim()[0] || '?').toUpperCase();
function evaluate(q, sel) {
  if (sel == null || sel === 'own') return false;
  if (q.kind === 'reply') return !!(q.opts[sel] && q.opts[sel].ok);
  if (q.kind === 'gap') return q.opts[sel] === q.a;
  if (q.kind === 'quiz') return q.opts[sel] === q.answer;
  if (q.kind === 'build') {
    const built = normTxt(sel.map(id => q.tiles.find(t => t.id === id).t).join(' '));
    return [q.sv, ...q.alt].some(x => normTxt(x) === built);
  }
  return false;
}
const canCheck = (q, sel) => q.kind === 'build' ? Array.isArray(sel) && sel.length > 0 : sel != null && sel !== 'own';

function CardQ({ q, s }) {
  const show = s.settings.translations === 'show';
  const [en, setEn] = useState(show);
  useEffect(() => setEn(show), [q.uid]);
  const [sv, enT, note] = q.phrase;
  return html`<div class="qtitle"><${Icon} n="sparkle" s=${18} />New phrase</div>
    <div class="fcard">
      <div class="big">${sv}</div>
      <div style="margin-top:12px;display:flex;justify-content:center"><${SayBtn} text=${sv} /></div>
      ${en ? html`<div class="en">${enT}</div>` : html`<button class="reveal" onClick=${() => setEn(true)}>Show the meaning</button>`}
      ${note ? html`<div class="note"><${Icon} n="bulb" s=${18} /><span>${note}</span></div>` : null}
    </div>`;
}
function SceneQ({ q, s }) {
  const st = STOPS[q.sid];
  const v = st.talk.general ? st.talk.general : st.talk;
  return html`<div class="qtitle"><${Icon} n="chat" s=${18} />Guided conversation</div>
    <div class="scene"><div class="eyebrow">The scene</div><p style="margin-top:4px">${v.scene}</p>
      <div class="notice" style="margin-top:12px"><${Icon} n="info" /><span>Live role-play needs Claude, which isn't available here. In this guided version you choose the best reply in six situations from ${st.city}.</span></div></div>`;
}
function ReplyQ({ q, sel, setSel, phase, check, s, lesson }) {
  const env = ENV.use();
  const show = s.settings.translations === 'show';
  const [en, setEn] = useState(show);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  useEffect(() => { setEn(show); setText(''); setErr(''); setBusy(false); }, [q.uid]);
  const locked = phase !== 'answer';
  const own = sel === 'own';
  const best = q.opts.find(o => o.ok);
  const grade = async () => {
    const t = text.trim(); if (!t || busy) return;
    if (!SAMPLE) { setErr(aiErrorText({ code: 'not_granted' })); return; }
    setBusy(true); setErr('');
    try {
      const r = await SAMPLE.json(ownPrompt(q, STOPS[q.sid], best.sv, t), { modelTier: 'quick', cache: false });
      const score = Math.max(0, Math.min(3, Math.round(Number(r && r.score) || 0)));
      const verdict = r && ['great', 'good', 'fix'].includes(r.verdict) ? r.verdict : score >= 3 ? 'great' : score === 2 ? 'good' : 'fix';
      check(score >= 2, { own: { text: t, score, verdict, corrected: String((r && r.corrected) || ''), natural: String((r && r.natural) || ''), note: String((r && r.note) || '') }, bonus: score >= 3 ? 5 : 0, ownGood: score >= 2 });
    } catch (e) { setErr(aiErrorText(e)); }
    finally { setBusy(false); }
  };
  const allowOwn = env.ai === 'ready' && lesson.type !== 'checkpoint' && phase === 'answer';
  return html`<div class="qtitle"><${Icon} n="chat" s=${18} />${q.retry ? 'Try this one again' : lesson.type === 'guided' ? 'What do you say?' : 'Choose the best reply'}</div>
    <div class="say">
      <div class="avatar" aria-hidden="true">${initialOf(q.who)}</div>
      <div class="bubble" style="flex:1">
        <div class="eyebrow" style="margin-bottom:4px">${q.who}</div>
        <div class="big">${q.say}</div>
        ${en ? html`<div class="en">${q.en}</div>` : null}
        <div class="acts"><${SayBtn} text=${q.say} small />${show ? null : html`<button class="chip" onClick=${() => setEn(!en)}>${en ? 'Hide English' : 'Show English'}</button>`}</div>
      </div>
    </div>
    ${q.cue ? html`<div class="cue"><${Icon} n="info" s=${17} />${q.cue}</div>` : null}
    ${own && !locked ? html`<div class="ownbox">
        <label class="eyebrow" for="own-reply">Your reply in Swedish</label>
        <textarea id="own-reply" value=${text} onInput=${e => setText(e.target.value)} placeholder="Skriv ditt svar…" autocomplete="off" autocapitalize="sentences" spellcheck="false" style="margin-top:6px"></textarea>
        ${err ? html`<div class="notice err" style="margin-top:8px"><${Icon} n="info" /><span>${err}</span></div>` : null}
        <button class="btn primary wide" style="margin-top:10px" disabled=${!text.trim() || busy} onClick=${grade}>${busy ? 'Claude is reading…' : 'Get feedback'}</button>
      </div>`
      : html`<div class="opts" role="radiogroup" aria-label="Replies">${q.opts.map((o, i) => html`<button class=${cx('opt', sel === i && 'sel', locked && !own && o.ok && 'right', locked && sel === i && !o.ok && 'wrong')} role="radio" aria-checked=${sel === i ? 'true' : 'false'} disabled=${locked} onClick=${() => setSel(i)}><span class="k">${i + 1}</span><span>${o.sv}</span></button>`)}</div>`}
    ${allowOwn ? html`<div style="margin-top:14px;text-align:center"><button class="linkbtn" onClick=${() => setSel(own ? null : 'own')}>${own ? 'Pick from the options instead' : 'Write my own reply instead'}</button></div>` : null}`;
}
function BuildQ({ q, sel, setSel, phase }) {
  const chosen = Array.isArray(sel) ? sel : [];
  const locked = phase !== 'answer';
  return html`<div class="qtitle"><${Icon} n="pen" s=${18} />Build the sentence in Swedish</div>
    <div class="bubble" style="margin-bottom:18px"><div class="big">${q.en}</div></div>
    <div class="answer-area" aria-label="Your sentence">${chosen.length ? chosen.map(id => { const t = q.tiles.find(x => x.id === id); return html`<button class="tile in" disabled=${locked} onClick=${() => setSel(chosen.filter(x => x !== id))}>${t.t}</button>`; }) : html`<span class="faint" style="padding:10px 4px">Tap the words in order…</span>`}</div>
    <div class="bank">${q.tiles.map(t => { const used = chosen.includes(t.id); return html`<button class=${cx('tile', used && 'used')} disabled=${used || locked} tabindex=${used ? -1 : 0} onClick=${() => setSel([...chosen, t.id])}>${t.t}</button>`; })}</div>`;
}
function GapQ({ q, sel, setSel, phase }) {
  const [a, b] = q.sv.split('___');
  const locked = phase !== 'answer';
  return html`<div class="qtitle"><${Icon} n="pen" s=${18} />Fill the gap</div>
    ${q.cue ? html`<div class="cue"><${Icon} n="info" s=${17} />${q.cue}</div>` : null}
    <div class="bubble" style="margin-bottom:18px"><div class="gapline">${a}<span class="blank">${sel != null ? q.opts[sel] : ' '}</span>${b}</div><div class="en">${q.en}</div></div>
    <div class="opts" role="radiogroup">${q.opts.map((o, i) => html`<button class=${cx('opt', sel === i && 'sel', locked && o === q.a && 'right', locked && sel === i && o !== q.a && 'wrong')} role="radio" aria-checked=${sel === i ? 'true' : 'false'} disabled=${locked} onClick=${() => setSel(i)}><span class="k">${i + 1}</span><span>${o}</span></button>`)}</div>`;
}
function QuizQ({ q, sel, setSel, phase }) {
  const sv2en = q.dir === 'sv2en', locked = phase !== 'answer';
  return html`<div class="qtitle"><${Icon} n="book" s=${18} />${sv2en ? 'What does this mean?' : 'How do you say this in Swedish?'}</div>
    <div class="fcard" style="margin-bottom:18px"><div class="big">${q.prompt}</div>${sv2en ? html`<div style="margin-top:10px;display:flex;justify-content:center"><${SayBtn} text=${q.prompt} /></div>` : null}</div>
    <div class="opts" role="radiogroup">${q.opts.map((o, i) => html`<button class=${cx('opt', sel === i && 'sel', locked && o === q.answer && 'right', locked && sel === i && o !== q.answer && 'wrong')} role="radio" aria-checked=${sel === i ? 'true' : 'false'} disabled=${locked} onClick=${() => setSel(i)}><span class="k">${i + 1}</span><span>${o}</span></button>`)}</div>`;
}
function MatchQ({ q, check }) {
  const [left] = useState(() => shuffle(q.pairs));
  const [right] = useState(() => shuffle(q.pairs));
  const [a, setA] = useState(null), [b, setB] = useState(null), [done, setDone] = useState([]), [bad, setBad] = useState(null);
  const miss = useRef(0);
  useEffect(() => {
    if (a == null || b == null) return;
    if (a === b) {
      const d = [...done, a]; setDone(d); setA(null); setB(null); sfx('tick');
      if (d.length === q.pairs.length) setTimeout(() => check(miss.current <= 1, { match: true, miss: miss.current }), 380);
    } else {
      miss.current += 1; setBad([a, b]); sfx('bad');
      const t = setTimeout(() => { setBad(null); setA(null); setB(null); }, 520);
      return () => clearTimeout(t);
    }
  }, [a, b]);
  const tileCls = (i, side) => cx('mtile', done.includes(i) && 'ok', (side === 'a' ? a : b) === i && 'sel', bad && bad[side === 'a' ? 0 : 1] === i && 'no');
  return html`<div class="qtitle"><${Icon} n="sparkle" s=${18} />Match the pairs</div>
    <div class="match">
      <div class="col">${left.map(p => html`<button class=${tileCls(p.i, 'a')} disabled=${done.includes(p.i)} onClick=${() => { setA(p.i); speak(p.sv); }} lang="sv">${p.sv}</button>`)}</div>
      <div class="col">${right.map(p => html`<button class=${tileCls(p.i, 'b')} disabled=${done.includes(p.i)} onClick=${() => setB(p.i)}>${p.en}</button>`)}</div>
    </div>`;
}
function Feedback({ q, fb, sel }) {
  const title = (ok, okText, badText) => html`<div class="fb-title"><${Icon} n=${ok ? 'check' : 'x'} w=${3} />${ok ? okText : badText}</div>`;
  if (fb.match) return html`${title(fb.ok, fb.miss ? 'All matched!' : 'Flawless!', 'All matched')}<div class="fb-text">${fb.miss ? `${fb.miss} wrong ${fb.miss === 1 ? 'try' : 'tries'} on the way.` : 'Every pair on the first try.'}</div>`;
  if (q.kind === 'reply' && fb.own) {
    const o = fb.own, best = q.opts.find(x => x.ok);
    return html`${title(fb.ok, o.verdict === 'great' ? 'Utmärkt!' : 'Bra svar!', 'Almost there')}
      <div class="fb-scroll">
        ${o.note ? html`<div class="fb-text">${o.note}</div>` : null}
        ${o.corrected && normTxt(o.corrected) !== normTxt(o.text) ? html`<div class="fb-text"><span class="eyebrow">Corrected</span><br /><span class="sv">${o.corrected}</span></div>` : null}
        ${o.natural ? html`<div class="fb-text" style="display:flex;gap:8px;align-items:center"><span style="flex:1"><span class="eyebrow">How a Swede might say it</span><br /><span class="sv">${o.natural}</span></span><${SayBtn} text=${o.natural} small /></div>` : null}
        <div class="fb-text"><span class="eyebrow">Model answer</span><br /><span class="sv">${best.sv}</span> <span class="muted">· ${best.en}</span></div>
      </div>`;
  }
  if (q.kind === 'reply') {
    const chosen = q.opts[sel], best = q.opts.find(o => o.ok);
    return html`${title(fb.ok, rnd(PRAISE), 'Not quite')}
      <div class="fb-scroll">
        ${fb.ok ? html`<div class="fb-text">${best.note}</div>` : html`<div class="fb-text">${chosen ? chosen.note : ''}</div><div class="fb-text" style="display:flex;gap:8px;align-items:center"><span style="flex:1">Better: <span class="sv">${best.sv}</span> <span class="muted">· ${best.en}</span></span><${SayBtn} text=${best.sv} small /></div>`}
        <details><summary style="cursor:pointer;font-weight:800;font-size:14px">All three replies, translated</summary>
          <div class="altlist">${q.opts.map(o => html`<div class=${cx('alt', o.ok && 'best')}><b>${o.sv}</b><div class="en">${o.en}</div><div>${o.note}</div></div>`)}</div></details>
      </div>`;
  }
  if (q.kind === 'build') {
    return html`${title(fb.ok, rnd(PRAISE), 'Not quite')}
      <div class="fb-text" style="display:flex;gap:8px;align-items:center"><span style="flex:1">${fb.ok ? '' : 'Correct: '}<span class="sv">${q.sv}</span></span><${SayBtn} text=${q.sv} small /></div>
      ${q.note ? html`<div class="fb-text">${q.note}</div>` : null}`;
  }
  if (q.kind === 'gap') {
    const full = q.sv.replace('___', q.a);
    return html`${title(fb.ok, rnd(PRAISE), 'Not quite')}
      <div class="fb-text" style="display:flex;gap:8px;align-items:center"><span class="sv" style="flex:1">${full}</span><${SayBtn} text=${full} small /></div>
      <div class="fb-text">${q.why}</div>`;
  }
  if (q.kind === 'quiz') {
    return html`${title(fb.ok, rnd(PRAISE), 'Not quite')}
      <div class="fb-text" style="display:flex;gap:8px;align-items:center"><span style="flex:1"><span class="sv">${q.pair[0]}</span> <span class="muted">· ${q.pair[1]}</span></span><${SayBtn} text=${q.pair[0]} small /></div>`;
  }
  return null;
}
function Results({ lesson, result, onExit, onNext }) {
  const st = lesson.sid ? STOPS[lesson.sid] : null;
  const isCp = lesson.type === 'checkpoint';
  const title = isCp ? (result.passed ? 'Checkpoint passed!' : 'Not this time') : lesson.type === 'review' ? 'Review done' : lesson.type === 'ai' ? 'Fresh round done' : 'Lesson complete';
  const nx = isCp ? LEVELS[lesson.li + 1] : null;
  return html`<div class="results">
    <div class="bigstars" role="img" aria-label=${`${result.stars} of 3 stars`}>${[1, 2, 3].map(i => html`<${Icon} n="star" s=${54} fill cls=${isCp && !result.passed ? '' : i <= result.stars ? 'on' : ''} />`)}</div>
    <h2>${title}</h2>
    ${isCp ? html`<p class="muted" style="max-width:40ch">${result.correct} of ${result.total} right. ${result.passed ? (nx ? `${nx.region} is now open.` : 'You have finished the journey!') : `You need ${lesson.pass}. Go through the stops again and retake it whenever you like.`}</p>` : null}
    ${lesson.type === 'review' && lesson.fromMistakes ? html`<p class="muted">Items answered correctly leave your review pile.</p>` : null}
    <div class="resgrid"><div><b>+${result.xp}</b><span>XP</span></div><div><b>${Math.round(result.acc * 100)}%</b><span>Accuracy</span></div><div><b>${result.bestCombo}</b><span>Best combo</span></div></div>
    ${result.newStamp && st ? html`<div style="display:grid;justify-items:center;gap:10px;margin-top:4px">
      <div class="stamp on slam" style="width:124px"><div class="in"><${Glyph} n=${st.glyph} s=${34} /><span class="nm">${st.city}</span><span class="lv">${st.level}</span></div></div>
      <b>New stamp in your passport</b></div>` : null}
    <${NewFacts} sid=${lesson.sid} list=${result.newFacts} />
    ${lesson.type !== 'review' ? html`<${SignupNudge} result=${result} />` : null}
    ${result.newLifeFact && lifeOn(S()) ? html`<div class="newfact"><span class="eyebrow newfact-label"><${Icon} n="flask" s=${15} />Life-science signpost unlocked</span><${FactCard} sid=${lesson.sid} fact=${LIFE_FACTS[lesson.sid]} fresh city=${false} /></div>` : null}
    <div class="actions"><button class="btn primary wide" onClick=${onNext}>Continue<${Icon} n="arrowR" s=${20} /></button><button class="btn ghost wide" onClick=${onExit}>Done</button></div>
  </div>`;
}
function Player({ lesson, onExit, onNext }) {
  const s = useApp();
  const [queue, setQueue] = useState(() => lesson.questions.filter(Boolean));
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState('answer');
  const [sel, setSel] = useState(null);
  const [fb, setFb] = useState(null);
  const [combo, setCombo] = useState(0);
  const [result, setResult] = useState(null);
  const [askExit, setAskExit] = useState(false);
  const stat = useRef({ correctFirst: 0, total: 0, xp: 0, combo: 0, bestCombo: 0, missed: [], fixed: [], seen: {}, requeued: {}, ownGood: 0 });
  const contRef = useRef(null), bodyRef = useRef(null);
  const q = queue[idx];
  useBodyLock(true);
  useBack(() => (phase === 'done' ? onExit() : setAskExit(true)), !askExit);
  const check = (ok, extra = {}) => {
    const st = stat.current, first = !st.seen[q.uid];
    st.seen[q.uid] = true;
    if (first) {
      st.total += 1;
      if (ok) { st.correctFirst += 1; st.combo += 1; st.bestCombo = Math.max(st.bestCombo, st.combo); st.xp += 10 + Math.min(st.combo - 1, 5) * 2 + (extra.bonus || 0); }
      else { st.combo = 0; if (q.key && lesson.type !== 'review') st.missed.push(q.key); }
    } else if (ok) st.xp += 4;
    if (ok && lesson.type === 'review' && q.key) st.fixed.push(q.key);
    if (extra.ownGood) st.ownGood += 1;
    if (!ok && lesson.requeue !== false && !st.requeued[q.uid] && q.kind !== 'match') {
      st.requeued[q.uid] = true;
      setQueue(qq => [...qq, { ...q, opts: q.opts ? shuffle(q.opts) : q.opts, tiles: q.tiles ? shuffle(q.tiles) : q.tiles, retry: true }]);
    }
    setCombo(st.combo); setFb({ ok, ...extra }); setPhase('feedback'); sfx(ok ? 'ok' : 'bad');
  };
  const finish = () => {
    const st = stat.current;
    const r = completeLesson(lesson, st);
    setResult({ ...r, bestCombo: st.bestCombo, total: st.total, correct: st.correctFirst });
    setPhase('done'); sfx(r.passed === false ? 'bad' : 'done');
    if (r.levelUp != null) setTimeout(() => CELEBRATE.set({ li: r.levelUp }), 1100);
  };
  const next = () => {
    if (idx + 1 >= queue.length) { finish(); return; }
    setIdx(i => i + 1); setPhase('answer'); setSel(null); setFb(null);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  };
  const doCheck = () => { if (q && canCheck(q, sel)) check(evaluate(q, sel)); };
  useEffect(() => { if (phase === 'feedback' && contRef.current) contRef.current.focus(); }, [phase]);
  useEffect(() => {
    const onKey = e => {
      if (askExit || !q) return;
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'TEXTAREA' || tag === 'INPUT') return;
      if (e.key === 'Enter') {
        if (phase === 'answer' && (q.kind === 'card' || q.kind === 'scene')) { e.preventDefault(); next(); }
        else if (phase === 'answer' && canCheck(q, sel)) { e.preventDefault(); doCheck(); }
      } else if (phase === 'answer' && /^[1-4]$/.test(e.key) && q.opts && ['reply', 'gap', 'quiz'].includes(q.kind) && sel !== 'own') {
        const i = Number(e.key) - 1; if (i < q.opts.length) setSel(i);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
  const pct = phase === 'done' ? 100 : Math.round((idx / Math.max(1, queue.length)) * 100);
  const props = { q, sel, setSel, phase, fb, check, s, lesson };
  const body = !q ? null
    : q.kind === 'card' ? html`<${CardQ} ...${props} />`
    : q.kind === 'scene' ? html`<${SceneQ} ...${props} />`
    : q.kind === 'reply' ? html`<${ReplyQ} ...${props} />`
    : q.kind === 'build' ? html`<${BuildQ} ...${props} />`
    : q.kind === 'gap' ? html`<${GapQ} ...${props} />`
    : q.kind === 'quiz' ? html`<${QuizQ} ...${props} />`
    : q.kind === 'match' ? html`<${MatchQ} key=${q.uid} ...${props} />` : null;
  let foot = null;
  if (phase === 'feedback' && fb) foot = html`<div class=${cx('room-foot', fb.ok ? 'ok' : 'bad')} role="status"><div class="inner"><${Feedback} q=${q} fb=${fb} sel=${sel} /><button ref=${contRef} class=${cx('btn wide', fb.ok ? 'good' : 'bad')} onClick=${next}>Continue</button></div></div>`;
  else if (phase === 'answer' && q && (q.kind === 'card' || q.kind === 'scene')) foot = html`<div class="room-foot"><div class="inner"><button class="btn primary wide" onClick=${next}>${q.kind === 'scene' ? 'Start' : 'Next'}</button></div></div>`;
  else if (phase === 'answer' && q && q.kind === 'match') foot = html`<div class="room-foot"><div class="inner"><p class="muted" style="text-align:center;font-weight:700">Tap a Swedish phrase, then its meaning.</p></div></div>`;
  else if (phase === 'answer' && q && sel !== 'own') foot = html`<div class="room-foot"><div class="inner"><button class="btn primary wide" disabled=${!canCheck(q, sel)} onClick=${doCheck}>Check</button></div></div>`;
  return html`<div class="room" role="dialog" aria-modal="true" aria-label=${lesson.title}>
    <div class="room-top">
      <button class="iconbtn" aria-label=${phase === 'done' ? 'Close' : 'Leave lesson'} onClick=${() => (phase === 'done' ? onExit() : setAskExit(true))}><${Icon} n="close" /></button>
      <div class="progress" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow=${pct}><i style=${`width:${pct}%`}></i></div>
      <span class="combo" aria-live="polite">${combo >= 2 && phase !== 'done' ? html`<${Icon} n="bolt" s=${16} />${combo}×` : ''}</span>
    </div>
    <div class="room-body" ref=${bodyRef}><div class="room-inner">
      ${phase === 'done' && result ? html`<${Results} lesson=${lesson} result=${result} onExit=${onExit} onNext=${onNext} />`
        : html`<div class="eyebrow" style="margin-bottom:12px">${lesson.title}</div>${body}`}
    </div></div>
    ${phase !== 'done' ? foot : null}
    ${askExit ? html`<${Confirm} title="Leave this lesson?" text="Your answers in this lesson won't be saved." yes="Leave" no="Keep going" danger onYes=${onExit} onNo=${() => setAskExit(false)} />` : null}
  </div>`;
}

/* ---------- live conversation with Claude */
function Talk({ sid, onExit, onNext, onRestart, onGuided }) {
  const env = ENV.use();
  const s = useApp();
  const stop = STOPS[sid];
  const [v] = useState(() => talkVariant(stop, S().settings.work));
  const [msgs, setMsgs] = useState(() => [{ id: 1, from: 'them', text: v.open, en: v.open_en }]);
  const hist = useRef([]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [goals, setGoals] = useState([]);
  const [hint, setHint] = useState(v.hint);
  const [showHint, setShowHint] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [ended, setEnded] = useState(false);
  const [card, setCard] = useState(null);
  const [scoring, setScoring] = useState(false);
  const [openFb, setOpenFb] = useState(null);
  const [enOn, setEnOn] = useState({});
  const [sceneOpen, setSceneOpen] = useState(true);
  const [askExit, setAskExit] = useState(false);
  const ctl = useRef(null), endRef = useRef(null), taRef = useRef(null), bodyRef = useRef(null);
  const mine = msgs.filter(m => m.from === 'me').length;
  useEffect(() => { if (card && bodyRef.current) bodyRef.current.scrollTop = 0; }, [card]);
  const showEn = s.settings.translations === 'show';
  useBodyLock(true);
  useBack(() => (card || mine === 0 ? onExit() : setAskExit(true)), !askExit);
  useEffect(() => { if (endRef.current) endRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' }); }, [msgs.length, busy, ended, scoring]);
  useEffect(() => () => { if (ctl.current) ctl.current.abort(); }, []);
  useEffect(() => { if (env.ai === 'off' && !card && mine === 0) onGuided(); }, [env.ai]);

  const send = async () => {
    const t = text.trim();
    if (!t || busy || ended || scoring) return;
    if (!SAMPLE) { setErr(aiErrorText({ code: 'not_granted' })); return; }
    setErr(''); setText(''); setBusy(true); setShowHint(false); setDrawer(false); setSceneOpen(false);
    const id = Date.now();
    setMsgs(m => [...m, { id, from: 'me', text: t }]);
    const userTurn = { role: 'user', content: t };
    const input = [{ role: 'user', content: talkRules(stop, v) }, ...hist.current, userTurn];
    const c = new AbortController(); ctl.current = c;
    try {
      const raw = await SAMPLE.json(input, { modelTier: 'quick', cache: false, signal: c.signal });
      const r = normTurn(raw);
      if (!r) throw { code: 'invalid_json' };
      hist.current = [...hist.current, userTurn, { role: 'assistant', content: JSON.stringify(raw) }];
      setMsgs(m => m.map(x => (x.id === id ? { ...x, fb: r.feedback } : x)).concat({ id: id + 1, from: 'them', text: r.reply, en: r.reply_en }));
      if (r.feedback && r.feedback.verdict === 'fix') setOpenFb(id);
      setGoals(g => Array.from(new Set([...g, ...r.goals_done])).sort());
      if (r.hint) setHint(r.hint);
      if (r.end || mine + 1 >= 10) setEnded(true);
    } catch (e) {
      setMsgs(m => m.filter(x => x.id !== id)); setText(t);
      if (!e || e.code !== 'cancelled') setErr(aiErrorText(e));
    } finally { setBusy(false); }
  };
  const finish = async () => {
    if (scoring) return;
    if (ctl.current) ctl.current.abort();
    setScoring(true); setErr('');
    const transcript = msgs.map(m => (m.from === 'me' ? 'L: ' : 'P: ') + m.text).join('\n');
    try {
      const raw = await SAMPLE.json(scorePrompt(stop, v, transcript), { modelTier: 'default', cache: false });
      const sc = normScore(raw);
      if (!sc) throw { code: 'invalid_json' };
      const xp = 30 + sc.stars * 10 + Math.min(mine, 8) * 2;
      const newFacts = recordTalk(sid, sc.stars, xp);
      setCard({ ...sc, xp, newFacts }); sfx('done');
    } catch (e) { setErr(aiErrorText(e)); }
    finally { setScoring(false); }
  };
  const saveWithout = () => {
    const stars = Math.max(1, Math.min(3, Math.round((goals.length / v.goals.length) * 3)));
    const xp = 25 + stars * 8;
    const newFacts = recordTalk(sid, stars, xp);
    setCard({ stars, score: null, summary: `You completed ${goals.length} of ${v.goals.length} goals in this conversation.`, went_well: [], fixes: [], phrases: [], xp, newFacts });
  };
  const insert = p => { setText(t => (t.trim() ? t.trimEnd() + ' ' : '') + p.replace(/…$/, ' ')); if (taRef.current) taRef.current.focus(); };

  if (env.ai === 'checking') {
    return html`<div class="room"><div class="room-top"><button class="iconbtn" onClick=${onExit} aria-label="Close"><${Icon} n="close" /></button><b>${stop.city} · Conversation</b></div>
      <div class="room-body"><div class="loadingbox"><div class="spinner"></div><b>Connecting to Claude…</b></div></div></div>`;
  }
  const head = html`<div class="room-top">
    <button class="iconbtn" aria-label="Leave conversation" onClick=${() => (card || mine === 0 ? onExit() : setAskExit(true))}><${Icon} n="close" /></button>
    <div style="flex:1;min-width:0"><div class="eyebrow">${stop.city} · ${v.title}</div><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${v.who}</b></div>
    <span class=${cx('chip num', goals.length === v.goals.length ? 'moss' : 'glow')} title="Goals done">${goals.length}/${v.goals.length}</span>
    ${card ? null : html`<button class="btn small" disabled=${mine < 2 || scoring} onClick=${finish}>Finish</button>`}
  </div>`;
  if (card) {
    return html`<div class="room" role="dialog" aria-modal="true" aria-label="Conversation scorecard">${head}
      <div class="room-body" ref=${bodyRef}><div class="room-inner"><div class="results" style="justify-items:stretch;text-align:left">
        <div style="display:grid;justify-items:center;gap:10px;text-align:center">
          <div class="bigstars">${[1, 2, 3].map(i => html`<${Icon} n="star" s=${54} fill cls=${i <= card.stars ? 'on' : ''} />`)}</div>
          <h2>${card.stars === 3 ? 'Strålande!' : card.stars === 2 ? 'Bra samtal!' : 'Bra början!'}</h2>
          ${card.summary ? html`<p class="muted" style="max-width:52ch">${card.summary}</p>` : null}
        </div>
        <div class="resgrid" style="justify-self:center"><div><b>+${card.xp}</b><span>XP</span></div><div><b>${card.score == null ? '–' : card.score}</b><span>Score</span></div><div><b>${goals.length}/${v.goals.length}</b><span>Goals</span></div></div>
        <div style="justify-self:center;width:100%;display:grid;justify-items:center"><${NewFacts} sid=${sid} list=${card.newFacts} /></div>
        ${card.went_well.length ? html`<div class="scorecard"><span class="eyebrow">What worked</span><ul>${card.went_well.map(w => html`<li>${w}</li>`)}</ul></div>` : null}
        ${card.fixes.length ? html`<div class="scorecard"><span class="eyebrow">Polish these</span>${card.fixes.map(f => html`<div class="fixrow">${f.you ? html`<span class="you">${f.you}</span>` : null}<span class="better" style="display:flex;gap:8px;align-items:center"><span style="flex:1">${f.better}</span><${SayBtn} text=${f.better} small /></span>${f.why ? html`<span class="muted" style="font-size:14px">${f.why}</span>` : null}</div>`)}</div>` : null}
        ${card.phrases.length ? html`<div class="scorecard"><span class="eyebrow">Phrases for next time</span>${card.phrases.map(p => html`<div class="phrase"><${SayBtn} text=${p.sv} small /><div class="tx"><div class="sv">${p.sv}</div><div class="en">${p.en}</div></div></div>`)}</div>` : null}
        <div class="actions" style="justify-self:center"><button class="btn primary wide" onClick=${onNext}>Continue the journey<${Icon} n="arrowR" s=${20} /></button><button class="btn ghost wide" onClick=${onRestart}>Talk again</button><button class="btn ghost wide" onClick=${onExit}>Done</button></div>
      </div></div></div></div>`;
  }
  return html`<div class="room" role="dialog" aria-modal="true" aria-label=${`Conversation: ${v.title}`}>${head}
    <div class="room-body"><div class="room-inner">
      <div class="scene">
        <button class="leg-head" onClick=${() => setSceneOpen(!sceneOpen)} aria-expanded=${sceneOpen ? 'true' : 'false'}>
          <span class="leg-title"><span class="eyebrow">The scene · ${REG_EN[stop.reg]} · ${stop.level}</span></span><${Icon} n=${sceneOpen ? 'chevUp' : 'chevDown'} s=${18} />
        </button>
        ${sceneOpen ? html`<p style="margin-top:6px">${v.scene}</p><p class="muted" style="margin-top:6px;font-size:14px">You're talking to <b>${v.who}</b>. Write in Swedish. Each message gets feedback.</p>` : null}
        <ul class="goals" aria-label="Your goals">${v.goals.map((g, i) => html`<li class=${goals.includes(i + 1) ? 'on' : ''}><span class="box">${goals.includes(i + 1) ? html`<${Icon} n="check" s=${13} w=${3.4} />` : null}</span><span>${g}</span></li>`)}</ul>
      </div>
      <div class="chat" aria-live="polite">
        ${msgs.map(m => m.from === 'them'
          ? html`<div class="msg them" key=${m.id}><span class="who">${v.who.split(',')[0]}</span><div class="bub" lang="sv">${m.text}${(showEn || enOn[m.id]) && m.en ? html`<div class="en" lang="en">${m.en}</div>` : null}</div>
              <div class="acts"><${SayBtn} text=${m.text} small />${!showEn && m.en ? html`<button class="chip" onClick=${() => setEnOn({ ...enOn, [m.id]: !enOn[m.id] })}>${enOn[m.id] ? 'Hide English' : 'English'}</button>` : null}</div></div>`
          : html`<div class="msg me" key=${m.id}><div class="bub" lang="sv">${m.text}</div>
              ${m.fb ? html`<button class=${cx('verdict', m.fb.verdict)} onClick=${() => setOpenFb(openFb === m.id ? null : m.id)} aria-expanded=${openFb === m.id ? 'true' : 'false'}>${m.fb.verdict === 'great' ? 'Great' : m.fb.verdict === 'good' ? 'Good · small tweak' : 'Fix this'}<${Icon} n=${openFb === m.id ? 'chevUp' : 'chevDown'} s=${14} w=${2.6} /></button>` : null}
              ${m.fb && openFb === m.id ? html`<div class="fbbox">
                ${m.fb.note ? html`<div>${m.fb.note}</div>` : null}
                ${m.fb.corrected && normTxt(m.fb.corrected) !== normTxt(m.text) ? html`<div><div class="lab">Corrected</div><span class="sv">${m.fb.corrected}</span></div>` : null}
                ${m.fb.natural && normTxt(m.fb.natural) !== normTxt(m.fb.corrected || m.text) ? html`<div style="display:flex;gap:8px;align-items:center"><div style="flex:1"><div class="lab">More natural</div><span class="sv">${m.fb.natural}</span></div><${SayBtn} text=${m.fb.natural} small /></div>` : null}
              </div>` : null}</div>`)}
        ${busy ? html`<div class="typing" aria-label="Typing"><i></i><i></i><i></i></div>` : null}
        ${ended && !scoring ? html`<div class="notice"><${Icon} n="flag" /><span>The scene has wrapped up. Get your scorecard to see what to polish.</span></div>` : null}
        ${scoring ? html`<div class="loadingbox" style="padding:20px"><div class="spinner"></div><b>Claude is reviewing your conversation…</b><span class="muted">This can take up to a minute.</span></div>` : null}
      </div>
      <div ref=${endRef} style="height:4px"></div>
    </div></div>
    <div class="room-foot"><div class="inner composer">
      ${err ? html`<div class="notice err"><${Icon} n="info" /><span style="flex:1">${err}</span>${scoring ? null : ended || mine >= 2 ? html`<button class="btn small ghost" onClick=${saveWithout}>Save without scorecard</button>` : null}${env.ai === 'off' ? html`<button class="btn small" onClick=${onGuided}>Guided version</button>` : null}</div>` : null}
      ${ended ? html`<button class="btn primary wide" disabled=${scoring} onClick=${finish}>${scoring ? 'Reviewing…' : 'Get my scorecard'}</button>` : html`
        ${showHint ? html`<div class="hintbox"><b>Hint:</b> ${hint}</div>` : null}
        ${drawer ? html`<div class="drawer" aria-label="Phrases to insert">${stop.phrases.map(p => html`<button onClick=${() => insert(p[0])}>${p[0]}</button>`)}</div>` : null}
        <div class="bar">
          <label class="vh" for="talk-input">Your reply in Swedish</label>
          <textarea id="talk-input" ref=${taRef} rows="1" value=${text} onInput=${e => setText(e.target.value)} placeholder="Skriv på svenska…" autocomplete="off" autocapitalize="sentences" spellcheck="false"
            onKeyDown=${e => { if (e.key === 'Enter' && !e.shiftKey && !('ontouchstart' in window)) { e.preventDefault(); send(); } }} disabled=${scoring}></textarea>
          <button class="iconbtn" style="width:52px;height:52px;background:var(--glow);color:var(--glow-ink)" onClick=${send} disabled=${!text.trim() || busy || scoring} aria-label="Send"><${Icon} n="send" /></button>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <button class="chip" onClick=${() => setShowHint(!showHint)} aria-pressed=${showHint ? 'true' : 'false'}><${Icon} n="bulb" s=${15} />Hint</button>
          <button class="chip" onClick=${() => setDrawer(!drawer)} aria-pressed=${drawer ? 'true' : 'false'}><${Icon} n="list" s=${15} />Phrases</button>
          <span class="faint" style="font-size:12.5px">Tip: your keyboard's mic lets you speak your reply.</span>
        </div>`}
    </div></div>
    ${askExit ? html`<${Confirm} title="Leave the conversation?" text="It won't count toward your stars unless you finish it." yes="Leave" no="Keep talking" danger onYes=${onExit} onNo=${() => setAskExit(false)} />` : null}
  </div>`;
}

/* ---------- Claude-written practice */
function Generate({ sid, onExit, onReady }) {
  const stop = STOPS[sid];
  const [err, setErr] = useState('');
  const [k, setK] = useState(0);
  useBodyLock(true);
  useBack(onExit);
  useEffect(() => {
    const c = new AbortController();
    setErr('');
    (async () => {
      try {
        if (!SAMPLE) throw { code: 'not_granted' };
        const raw = await SAMPLE.json(genPrompt(stop, S().settings.work), { modelTier: 'default', cache: false, signal: c.signal });
        const qs = normGen(raw, sid);
        if (qs.length < 3) throw { code: 'invalid_json' };
        if (!c.signal.aborted) onReady({ type: 'ai', sid, title: `${stop.city} · Fresh situations`, questions: qs });
      } catch (e) { if (!e || e.code !== 'cancelled') setErr(aiErrorText(e)); }
    })();
    return () => c.abort();
  }, [k]);
  return html`<div class="room" role="dialog" aria-modal="true" aria-label="Fresh situations">
    <div class="room-top"><button class="iconbtn" onClick=${onExit} aria-label="Cancel"><${Icon} n="close" /></button><b>Fresh situations · ${stop.city}</b></div>
    <div class="room-body"><div class="room-inner">${err
      ? html`<div class="loadingbox"><div class="notice err"><${Icon} n="info" /><span>${err}</span></div><button class="btn primary" onClick=${() => setK(k + 1)}>Try again</button><button class="btn ghost" onClick=${onExit}>Back</button></div>`
      : html`<div class="loadingbox"><div class="spinner"></div><b>Claude is writing new situations…</b><p class="muted">${stop.theme} at ${stop.level}. This can take up to a minute.</p><button class="btn ghost small" onClick=${onExit}>Cancel</button></div>`}
    </div></div>
  </div>`;
}

/* ---------- Snabbsvar: 60-second quick-fire */
function Quick({ onExit }) {
  const s = useApp();
  const pool = useMemo(() => { const p = ORDER.filter(sid => stopOpen(s, sid)); return p.length ? p : [ORDER[0]]; }, []);
  const [phase, setPhase] = useState('ready');
  const [left, setLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [q, setQ] = useState(null);
  const [flash, setFlash] = useState(null);
  const [res, setRes] = useState(null);
  const sc = useRef(0), lock = useRef(false);
  useBodyLock(true);
  useBack(onExit);
  const labPool = useMemo(() => (lifeFirst(s) ? LIFE_IDS.filter(sid => stopOpen(s, sid)) : []), []);
  const nextQ = () => {
    const sid = rnd(pool);
    if (labPool.length && Math.random() < 0.3) { const ls = rnd(labPool); setQ(lifeReplyQ(ls, Math.floor(Math.random() * LIFE[ls].replies.length))); lock.current = false; return; }
    setQ(Math.random() < 0.6 ? replyQ(sid, Math.floor(Math.random() * 6)) : phraseQ(sid, Math.floor(Math.random() * 8), 'sv2en'));
    lock.current = false;
  };
  const end = () => {
    const n = sc.current; let best = 0;
    update(st => { best = st.stats.quickBest || 0; st.stats.quickBest = Math.max(best, n); if (n > 0) awardXP(st, n * 3); });
    setRes({ score: n, best: Math.max(best, n), record: n > best && n > 0, xp: n * 3 }); setPhase('over'); sfx('done');
  };
  const start = () => { sc.current = 0; setScore(0); setLeft(60); setRes(null); setPhase('play'); nextQ(); };
  useEffect(() => {
    if (phase !== 'play') return;
    const t0 = Date.now();
    const iv = setInterval(() => { const l = Math.max(0, 60 - (Date.now() - t0) / 1000); setLeft(l); if (l <= 0) { clearInterval(iv); end(); } }, 100);
    return () => clearInterval(iv);
  }, [phase]);
  const pickA = i => {
    if (lock.current || phase !== 'play' || !q) return;
    lock.current = true;
    const ok = q.kind === 'reply' ? q.opts[i].ok : q.opts[i] === q.answer;
    setFlash({ i, ok }); sfx(ok ? 'ok' : 'bad');
    if (ok) { sc.current += 1; setScore(sc.current); }
    setTimeout(() => { setFlash(null); nextQ(); }, ok ? 260 : 950);
  };
  const correctIdx = q ? q.opts.findIndex(o => (q.kind === 'reply' ? o.ok : o === q.answer)) : -1;
  return html`<div class="room" role="dialog" aria-modal="true" aria-label="Snabbsvar">
    <div class="room-top">
      <button class="iconbtn" onClick=${onExit} aria-label="Close"><${Icon} n="close" /></button>
      ${phase === 'play' ? html`<div class="timer" role="timer" aria-label=${`${Math.ceil(left)} seconds left`}><i style=${`width:${(left / 60) * 100}%`}></i></div><span class="qscore num" aria-live="polite">${score}</span>` : html`<b style="flex:1">Snabbsvar</b>`}
    </div>
    <div class="room-body"><div class="room-inner">
      ${phase === 'ready' ? html`<div class="results">
          <span class="qi" style="width:72px;height:72px;border-radius:24px;display:grid;place-items:center;background:var(--glow);color:var(--glow-ink)"><${Icon} n="timer" s=${40} /></span>
          <h2>Snabbsvar</h2>
          <p class="muted" style="max-width:44ch">Quick replies: answer as many situations and phrases as you can in 60 seconds. Questions come from every stop you've opened. Best so far: <b>${s.stats.quickBest || 0}</b>.</p>
          <div class="actions"><button class="btn primary wide" onClick=${start}>Start<${Icon} n="arrowR" s=${20} /></button></div>
        </div>`
      : phase === 'over' && res ? html`<div class="results">
          <div class="eyebrow">${res.record ? 'New personal best!' : 'Time!'}</div>
          <h2 class="num">${res.score} right</h2>
          <div class="resgrid"><div><b>+${res.xp}</b><span>XP</span></div><div><b>${res.best}</b><span>Best</span></div><div><b>60s</b><span>Time</span></div></div>
          <div class="actions"><button class="btn primary wide" onClick=${start}>Play again</button><button class="btn ghost wide" onClick=${onExit}>Done</button></div>
        </div>`
      : q ? html`<div key=${q.uid}>
          ${q.kind === 'reply' ? html`<div class="say"><div class="avatar" aria-hidden="true">${initialOf(q.who)}</div><div class="bubble" style="flex:1"><div class="eyebrow" style="margin-bottom:4px">${q.who}</div><div class="big">${q.say}</div>${q.cue ? html`<div class="en">${q.cue}</div>` : null}</div></div>`
            : html`<div class="fcard" style="margin-bottom:18px"><div class="eyebrow">What does it mean?</div><div class="big" style="margin-top:6px">${q.prompt}</div></div>`}
          <div class="opts">${q.opts.map((o, i) => html`<button class=${cx('opt', flash && flash.i === i && (flash.ok ? 'right qfx-ok' : 'wrong qfx-bad'), flash && !flash.ok && i === correctIdx && 'right')} onClick=${() => pickA(i)}><span class="k">${i + 1}</span><span>${q.kind === 'reply' ? o.sv : o}</span></button>`)}</div>
        </div>` : null}
    </div></div>
  </div>`;
}

/* ---------- passport (stamps, badges, stats) */
function Candles({ s, big }) {
  const days = weekDays(), hts = [24, 30, 36, 42, 36, 30, 24].map(h => (big ? h * 1.4 : h));
  const lbl = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return html`<div style="display:grid;justify-items:center;gap:6px" role="img" aria-label=${`Practised ${days.filter(d => s.log[d]).length} of 7 days this week`}>
    <div class="candles">${days.map((d, i) => html`<div class=${cx('c', s.log[d] > 0 && 'on')}><span class="flame"></span><span class="stick" style=${`height:${hts[i]}px`}></span><span class="d faint" style="font-size:10px;font-weight:900;margin-top:4px">${lbl[i]}</span></div>`)}</div>
  </div>`;
}
const badgeList = () => ACH.filter(a => a.id !== 'duel1' || commOn()); // the duel badge only where the players map exists
function Pass({ go, embedded }) {
  const s = useApp();
  const days = weekDays();
  const mx = Math.max(s.goal, ...days.map(d => s.log[d] || 0));
  const acc = s.stats.answers ? Math.round((100 * s.stats.correct) / s.stats.answers) : 0;
  const stamps = ORDER.filter(sid => stopDone(s, sid)).length;
  const t = today();
  return html`<div class=${embedded ? '' : 'wrap'}>
    ${embedded ? html`<h1 class="pagetitle display">Your passport</h1>` : html`<div class="page-head"><button class="iconbtn" onClick=${() => go({ name: 'home' })} aria-label="Back"><${Icon} n="arrowL" /></button><h1>Your passport</h1></div>`}
    <div class="grid2">
      <section class="card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
          <div><span class="eyebrow">This week</span><p style="font-size:22px;font-weight:900;margin-top:4px" class="num">${liveStreak(s)}-day streak</p><p class="muted" style="font-size:14px">Best: ${s.streak.best || 0} ${(s.streak.best || 0) === 1 ? 'day' : 'days'}. Light all seven candles in a week.</p></div>
          <${Candles} s=${s} />
        </div>
        <div class="week" aria-label="XP per day this week">${days.map((d, i) => { const v = s.log[d] || 0; return html`<div class="col"><span class="v">${v || ''}</span><span class=${cx('bar', v > 0 && 'on', d === t && 'today')} style=${`height:${Math.max(4, (v / mx) * 84)}px`}></span><span class="d">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span></div>`; })}</div>
        <p class="faint" style="font-size:12.5px;margin-top:8px">Daily goal: ${s.goal} XP</p>
      </section>
      <section class="card">
        <span class="eyebrow">Totals</span>
        <div class="statgrid" style="margin-top:10px">
          <div class="statbox"><b>${fmtN(s.xp)}</b><span>XP earned</span></div>
          <div class="statbox"><b>${acc}%</b><span>First-try accuracy</span></div>
          <div class="statbox"><b>${s.stats.talks}</b><span>Conversations</span></div>
          <div class="statbox"><b>${s.stats.bestCombo}</b><span>Best combo</span></div>
          <div class="statbox"><b>${s.stats.quickBest}</b><span>Snabbsvar best</span></div>
          <div class="statbox"><b>${Object.keys(s.mistakes).length}</b><span>Items to review</span></div>
        </div>
      </section>
    </div>
    <section class="card" style="margin-top:16px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h2 class="display" style="font-size:26px">City stamps</h2><span class="chip glow num">${stamps}/20</span></div>
      <p class="muted" style="font-size:14px;margin:4px 0 16px">Finish “Respond” at a stop to earn its stamp. Three stars on all three lessons turns it gold.</p>
      <div class="stampgrid">${ORDER.map(sid => { const st = STOPS[sid], ss = stampState(s, sid); return html`<div class=${cx('stamp', ss)} title=${st.city} aria-label=${`${st.city}: ${ss === 'off' ? 'not yet' : ss === 'gold' ? 'gold stamp' : 'stamped'}`}><div class="in"><${Glyph} n=${st.glyph} s=${26} /><span class="nm">${st.city}</span><span class="lv">${st.level}</span></div></div>`; })}</div>
    </section>
    <${FactShelf} s=${s} />
    <section class="card" style="margin-top:16px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h2 class="display" style="font-size:26px">Badges</h2><span class="chip glow num">${badgeList().filter(a => s.ach[a.id]).length}/${badgeList().length}</span></div>
      <div class="achs" style="margin-top:14px">${badgeList().map(a => html`<div class=${cx('ach', s.ach[a.id] && 'on')}><span class="ai"><${Icon} n=${a.icon} s=${20} /></span><span style="min-width:0"><b>${a.sv}</b><span>${a.en}</span></span></div>`)}</div>
    </section>
  </div>`;
}

/* ---------- settings */
function Seg({ value, options, onChange, label }) {
  return html`<div class="seg" role="group" aria-label=${label}>${options.map(o => html`<button aria-pressed=${String(value === o.v)} onClick=${() => onChange(o.v)}>${o.l}</button>`)}</div>`;
}
function ThemePicker({ s }) {
  const mode = themeMode(s.settings);
  return html`<div class="themegrid" role="radiogroup" aria-label="Colour theme">
    ${THEMES.map(t => {
      const open = themeOpen(s, t), c = t[mode], on = (s.settings.palette || 'mysig') === t.id;
      return html`<button class=${cx('themecard', !open && 'locked')} role="radio" aria-checked=${String(on)} disabled=${!open}
        onClick=${() => update(x => { x.settings.palette = t.id; })} aria-label=${`${t.sv}, ${t.en}${open ? '' : `. ${t.unlock.hint}`}`}>
        <span class="tc-preview" style=${`background:${c.bg}`} aria-hidden="true">
          <span class="tc-card" style=${`background:${c.surface};border-color:${c.line}`}>
            <span class="tc-title" style=${`background:${c.falu}`}></span>
            <span class="tc-text" style=${`background:${c['ink-3']}`}></span>
            <span class="tc-btn" style=${`background:${c.glow};box-shadow:0 2px 0 ${c['glow-2']}`}></span>
          </span>
          <span class="tc-bee"><${BeeLogo} s=${26} /></span>
          ${on ? html`<span class="tc-check"><${Icon} n="check" s=${14} w=${3.2} /></span>` : null}
          ${open ? null : html`<span class="tc-lock"><${Icon} n="lock" s=${16} /></span>`}
        </span>
        <span class="tc-name"><b>${t.sv}</b><span>${open ? t.en : t.unlock.hint}</span></span>
      </button>`;
    })}
  </div>`;
}
const WORK_HELP = {
  general: 'Everyday office scenarios in role-plays and drills.',
  mix: 'Office and life-science scenarios, plus a lab lesson at each work stop and science signposts on the map.',
  life: 'Lab and industry Swedish everywhere: lab lessons, life-science replies in Respond, science signposts and pharma role-plays.',
};
function Settings({ go, embedded }) {
  const s = useApp(), env = ENV.use();
  const [reset, setReset] = useState(false);
  const set = fn => update(fn);
  return html`<div class=${embedded ? '' : 'wrap'} style=${embedded ? '' : 'max-width:760px'}>
    ${embedded ? null : html`<div class="page-head"><button class="iconbtn" onClick=${() => go({ name: 'home' })} aria-label="Back"><${Icon} n="arrowL" /></button><h1>Settings</h1></div>`}
    <section class="card" style="margin-bottom:16px">
      <div class="setrow col"><div class="tx"><b>Colour theme</b><span>Repaint Surra in the colours of Sweden. Two more themes unlock as you practise.</span></div>
        <${ThemePicker} s=${s} /></div>
      <div class="setrow"><div class="tx"><b>Light or dark</b><span>Follow your device, or pick one.</span></div>
        <${Seg} label="Light or dark" value=${s.settings.mode || 'auto'} options=${[{ v: 'auto', l: 'Auto' }, { v: 'light', l: 'Light' }, { v: 'dark', l: 'Dark' }]} onChange=${v => set(x => { x.settings.mode = v; })} /></div>
    </section>
    <section class="card">
      <div class="setrow"><div class="tx"><b>Daily goal</b><span>XP to earn each day. A lesson earns roughly 50–200 XP, depending on accuracy.</span></div>
        <${Seg} label="Daily goal" value=${s.goal} options=${GOALS.map(g => ({ v: g.v, l: `${g.sv} ${g.v}` }))} onChange=${v => set(x => { x.goal = v; })} /></div>
      <div class="setrow"><div class="tx"><b>Starting level</b><span>Levels up to this one are open. Higher levels unlock through checkpoints.</span></div>
        <${Seg} label="Starting level" value=${s.start} options=${LEVEL_IDS.map(id => ({ v: id, l: id }))} onChange=${v => set(x => { x.start = v; })} /></div>
      <div class="setrow"><div class="tx"><b>Your field</b><span>${WORK_HELP[s.settings.work] || WORK_HELP.mix}</span></div>
        <${Seg} label="Your field" value=${s.settings.work} options=${[{ v: 'mix', l: 'Mix' }, { v: 'general', l: 'Office' }, { v: 'life', l: 'Life sciences' }]} onChange=${v => set(x => { x.settings.work = v; })} /></div>
      <div class="setrow"><div class="tx"><b>English translations</b><span>Show them right away, or tap to reveal for more challenge.</span></div>
        <${Seg} label="English translations" value=${s.settings.translations} options=${[{ v: 'show', l: 'Show' }, { v: 'tap', l: 'Tap to reveal' }]} onChange=${v => set(x => { x.settings.translations = v; })} /></div>
      <div class="setrow"><div class="tx"><b>Speech speed</b><span>${env.tts ? 'Uses a Swedish voice on your device. Tap a speaker twice to hear it slower.' : "No Swedish voice was found on this device. Add one in your system's speech settings to hear audio."}</span></div>
        <${Seg} label="Speech speed" value=${s.settings.rate} options=${[{ v: 'normal', l: 'Normal' }, { v: 'slow', l: 'Slow' }]} onChange=${v => set(x => { x.settings.rate = v; })} /></div>
      <div class="setrow"><div class="tx"><b>Sound effects</b><span>Chimes for right and wrong answers.</span></div>
        <${Seg} label="Sound effects" value=${s.settings.sound} options=${[{ v: true, l: 'On' }, { v: false, l: 'Off' }]} onChange=${v => set(x => { x.settings.sound = v; })} /></div>
    </section>
    <section class="card" style="margin-top:16px">
      ${embedded ? null : html`<${AccountRow} go=${go} />`}
      <${MapPresenceRow} />
      <${InviteRow} />
      <${InstallRow} />
      <div class="setrow"><div class="tx"><b>Conversations with Claude</b><span>${env.ai === 'ready' ? 'Available. Role-plays and feedback use your own Claude account; you\'ll be asked to allow it the first time.' : env.ai === 'checking' ? 'Checking…' : BUILD === 'pwa' ? 'Live role-plays run in the claude.ai version of Surra. Here, conversations use the guided version.' : 'Not available on this page, so conversations use the guided version.'}</span></div></div>
      <div class="setrow"><div class="tx"><b>Your progress</b><span>${env.sync === 'account' ? 'Saved to your Claude account, so it follows you across devices.' : env.sync === 'cloud' ? 'Backed up to your Surra account, so it follows you across devices.' : 'Saved on this device only.'}</span></div></div>
      <div class="setrow"><div class="tx"><b>Start over</b><span>Erase XP, stars, stamps and streaks.</span></div><button class="btn ghost small" onClick=${() => setReset(true)}>Reset progress</button></div>
    </section>
    ${reset ? html`<${Confirm} title="Erase all progress?" text="This deletes your XP, stars, stamps, badges and streak. It can't be undone." yes="Erase" no="Cancel" danger onYes=${() => { setReset(false); update(x => { const f = freshState(); f.owner = x.owner; f.profile = x.profile; Object.keys(x).forEach(k => delete x[k]); Object.assign(x, f); }); go({ name: 'onboard' }); }} onNo=${() => setReset(false)} />` : null}
  </div>`;
}

/* ---------- onboarding */
function Onboarding({ done, go }) {
  const s = useApp();
  const [start, setStart] = useState(s.start || 'A2');
  const [goal, setGoal] = useState(s.goal || 60);
  const [work, setWork] = useState(s.settings.work || 'mix');
  const preview = useMemo(() => withDefaults({ ...freshState(), start }), [start]);
  const startOpts = [
    { v: 'A1', b: 'New to Swedish', t: 'Start in Malmö with greetings and fika.' },
    { v: 'A2', b: 'I know the basics', t: 'Start in Göteborg with small talk and bookings. Skåne stays open for review.' },
    { v: 'B1', b: 'I can hold a simple conversation', t: 'Start in Örebro with opinions, meetings and interviews.' },
    { v: 'B2', b: "I'm comfortable but want nuance", t: 'Start in Gävle with hints, negotiation and storytelling.' },
  ];
  return html`<div class="wrap"><div class="onb">
    <div class="onb-hero">
      <${BeeLogo} s=${64} />
      <h1 class="display">Surra</h1>
      <p>Travel Sweden from Malmö to Kiruna and learn to <b>respond</b> in real conversations, from fika small talk to job interviews and negotiations. A1 to C1.</p>
      <${OnboardSignIn} />
    </div>
    <div style="display:grid;grid-template-columns:minmax(0,1fr);gap:18px">
      <div class="card"><span class="eyebrow">Where should your journey start?</span>
        <div class="choice" style="margin-top:10px">${startOpts.map(o => html`<button aria-pressed=${String(start === o.v)} onClick=${() => setStart(o.v)}><span class="lvl" style="width:44px;height:44px">${o.v}</span><span class="tx"><b>${o.b}</b><span>${o.t}</span></span></button>`)}</div>
      </div>
      <div class="card"><span class="eyebrow">Daily goal</span>
        <div style="margin-top:10px"><${Seg} label="Daily goal" value=${goal} options=${GOALS.slice(0, 3).map(g => ({ v: g.v, l: `${g.sv} · ${g.v} XP` }))} onChange=${setGoal} /></div>
        <p class="muted" style="font-size:13.5px;margin-top:8px">“Lagom” is about one lesson a day.</p>
        <span class="eyebrow" style="display:block;margin-top:18px">Your field</span>
        <div style="margin-top:10px"><${Seg} label="Your field" value=${work} options=${[{ v: 'mix', l: 'Mix' }, { v: 'general', l: 'Office' }, { v: 'life', l: 'Life sciences' }]} onChange=${setWork} /></div>
        <p class="muted" style="font-size:13.5px;margin-top:8px">${WORK_HELP[work]}</p>
      </div>
    </div>
    <div class="mapcard onb-map" aria-hidden="true"><${ZoomMap} s=${preview} interactive=${false} /></div>
    <button class="btn primary wide" style="max-width:420px;justify-self:center" onClick=${() => { update(x => { x.onboarded = true; x.start = start; x.goal = goal; x.settings.work = work; x.settings.news = NEWS.id; }); done(); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } }}>Start my journey<${Icon} n="arrowR" s=${20} /></button>
  </div></div>`;
}

/* ---------- overlays */
function Toasts() {
  const t = TOASTS.use();
  return html`<div class="toasts" aria-live="polite">${t.map(x => html`<div class="toast" key=${x.id}><span class="ti"><${Icon} n=${x.icon} s=${17} /></span><span>${x.msg}</span></div>`)}</div>`;
}
function Celebrate() {
  const c = CELEBRATE.use();
  const sparks = useMemo(() => Array.from({ length: 36 }, (_, i) => ({ l: Math.random() * 100, d: 2.4 + Math.random() * 2.4, w: Math.random() * 1.2, c: ['var(--glow)', 'var(--falu)', 'var(--moss)', 'var(--aurora-b)'][i % 4] })), [c]);
  useEffect(() => { if (c) sfx('level'); }, [c]);
  useBack(() => CELEBRATE.set(null), !!c);
  if (!c) return null;
  const L = LEVELS[c.li], fin = !L;
  return html`<div class="celebrate" role="dialog" aria-modal="true" aria-label=${fin ? 'Journey complete' : `${L.region} unlocked`}>
    ${sparks.map(p => html`<span class="spark" style=${`left:${p.l}%;background:${p.c};animation-duration:${p.d}s;animation-delay:${p.w}s`}></span>`)}
    <div class="inner">
      <${BeeLogo} s=${70} />
      <div class="eyebrow">${fin ? 'Journey complete' : `New region · ${L.id}`}</div>
      <h2>${fin ? 'Kiruna!' : `Välkommen till ${L.region}!`}</h2>
      <p style="font-size:17px">${fin ? 'You made it from Malmö to Kiruna and passed every checkpoint. Du pratar svenska på riktigt nu.' : `${L.en}: ${L.blurb} Your new rank: ${L.rank}.`}</p>
      <button class="btn primary" onClick=${() => CELEBRATE.set(null)}>Let's go<${Icon} n="arrowR" s=${20} /></button>
    </div>
  </div>`;
}
