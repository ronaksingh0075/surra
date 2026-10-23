/* ================= Surra UI: Kebnekaise: the mountain, the climb and the queen on the summit ================= */

/* ---------- the mountain: a night scene with the northern lights, drawn once and reused everywhere
   Thirteen waypoints zigzag from Fjällstationen (0) to the north top (12); the camps are at 4 and 8.
   In follow mode the camera zooms in and pans with the climber. */
const KB_PTS = [[44, 216], [112, 202], [70, 188], [130, 174], [92, 160], [156, 146], [118, 132], [180, 118], [148, 104], [204, 90], [176, 76], [222, 62], [232, 46]];
const KB_LEN = KB_PTS.reduce((a, p, i) => (i ? [...a, a[i - 1] + Math.hypot(p[0] - KB_PTS[i - 1][0], p[1] - KB_PTS[i - 1][1])] : [0]), []);
const KB_TRAIL = 'M' + KB_PTS.map(p => p.join(' ')).join(' L');
const KB_RND = (() => { let x = 11; return () => (x = (x * 16807) % 2147483647) / 2147483647; })();
const KB_STARS = Array.from({ length: 30 }, () => [Math.round(KB_RND() * 360), Math.round(KB_RND() * 130), +(0.45 + KB_RND() * 0.85).toFixed(2), +(KB_RND() * 5).toFixed(2)]);
const KB_TWINKLE = Array.from({ length: 7 }, () => [+(4 + KB_RND() * 92).toFixed(1), +(3 + KB_RND() * 30).toFixed(1), +(KB_RND() * 4).toFixed(2)]);
const KB_ROCKS = ['M0 0l3.2-1.2 1.4 2.8-2.6 1.6z', 'M0 0l2.6.4.2 2.6-2.4.2z', 'M0 0l2-1.8 2 1.6-1.2 2z', 'M0 0l2.8.2-.8 2.4z'];
let KB_N = 0;
const kbClamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const fmtM = m => `${fmtN(Math.round(m || 0))} m`;
const pitchGain = step => altitudeAt(Math.min(CLIMB.steps, step + 1)) - altitudeAt(step);
const rightIdx = q => (q.kind === 'reply' ? q.opts.findIndex(o => o.ok) : q.opts.indexOf(q.answer));

function KbTent({ step, on }) {
  const [x, y] = KB_PTS[step];
  return html`<g class=${cx('kb-tent', on && 'on')} transform=${`translate(${x - 14} ${y + 2})`}>
    <circle class="ring" r="11" cy="-3" />
    <path class="t" d="M-8 3L0-9 8 3z" /><path class="t2" d="M0-9L8 3H3z" /><path class="door" d="M-2.4 3L0-2.6 2.4 3z" />
    <path class="pole" d="M0-9v-8" /><path class="pennant" d="M0-17l7 2.2-7 2.2z" />
  </g>`;
}
function KbBee({ crowned, color }) {
  return html`<g class="bee kb-bee" transform="scale(.85)"><${BeeShape} />
    <g class="bee-bob">${crowned ? html`<path class="crown kb-crown" d="M4.4 -7.2l-1-6.4 3.2 2.5 2.6-4.2 2.6 4.2 3.2-2.5-1 6.4z" />`
      : html`<g class="beanie"><path d="M5.2 -3.4Q9.3 -10.2 13.4 -3.4z" style=${`fill:${color}`} /><path class="band" d="M5 -3.6h8.6" /><circle class="pom" cx="9.3" cy="-8.1" r="1.6" /></g>`}</g></g>`;
}
function KbQueen() {
  return html`<g class="bee npc boss queen tint-aurora" transform="scale(-.82 .82)"><${BeeShape} /><g class="bee-bob"><${NpcHat} id="queen" /></g></g>`;
}
function KebneScene({ mode = 'full', step = 0, floor = 0, best = 0, fx = null, storm = false, queen = 'top', crowned = false, flag = false, me = true, label }) {
  const s = useApp(), id = useMemo(() => 'kb' + ++KB_N, []);
  const follow = mode === 'follow', teaser = mode === 'teaser', VW = 360, VH = follow ? 150 : 240, Z = 1.35;
  const st = kbClamp(Math.round(step), 0, CLIMB.steps), [px, py] = KB_PTS[st];
  const face = st >= CLIMB.steps || KB_PTS[st + 1][0] >= px ? 1 : -1;
  const tx = follow ? kbClamp(VW / 2 - px * Z, VW - VW * Z, 0) : 0, ty = follow ? kbClamp(VH * 0.58 - py * Z, VH - 240 * Z, 0) : 0;
  const world = follow ? `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${Z})` : 'none';
  const far = follow ? `translate(${(tx * 0.5).toFixed(1)}px, ${(ty * 0.5).toFixed(1)}px) scale(${1 + (Z - 1) * 0.5})` : 'none';
  const total = KB_LEN[CLIMB.steps], done = KB_LEN[st];
  const beaten = queen === 'beaten', top = flag || st >= CLIMB.steps;
  const near = me && !teaser && st >= CLIMB.steps; // you're on the summit beside her
  const [qx, qy] = beaten ? [272, 47] : near ? [268, 30] : [250, 32];
  const color = (AV_COLORS[s.profile.color] || AV_COLORS.falu)[0];
  const k = fx ? fx.kind : '', n = fx ? fx.n : 0;
  const tag = (txt, x, y, end, sub) => html`<text class="kb-lab" x=${x} y=${y} text-anchor=${end ? 'end' : 'start'}>${txt}${sub ? html`<tspan class="alt" x=${x} dy="10">${sub}</tspan>` : null}</text>`;
  // the sky's moving parts (northern lights, twinkling stars, snow, frost) live in their own layers,
  // so the browser can move them without redrawing the mountain
  return html`<div class=${cx('kebne-box', follow && 'follow', mode === 'card' && 'thumb', storm && 'storm', k && 'fx-' + k, n % 2 ? 'fxa' : 'fxb')}>
    <div class="kb-sky" aria-hidden="true">
      <svg class="kb-au a1" viewBox="0 0 360 240" preserveAspectRatio="none"><defs><linearGradient id=${id + 'a'} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4FE6A6" stop-opacity="0" /><stop offset=".3" stop-color="#4FE6A6" stop-opacity=".6" /><stop offset=".7" stop-color="#9C7BFF" stop-opacity=".45" /><stop offset="1" stop-color="#9C7BFF" stop-opacity="0" /></linearGradient></defs>
        <path fill=${`url(#${id}a)`} d="M-40 74C30 34 100 86 170 48S300 8 400 44L400 80C300 52 238 100 170 80S30 76-40 104Z" /></svg>
      <svg class="kb-au a2" viewBox="0 0 360 240" preserveAspectRatio="none"><defs><linearGradient id=${id + 'b'} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5FE0C0" stop-opacity="0" /><stop offset=".5" stop-color="#5FE0C0" stop-opacity=".4" /><stop offset="1" stop-color="#4FE6A6" stop-opacity="0" /></linearGradient></defs>
        <path fill=${`url(#${id}b)`} d="M-40 44C50 12 120 54 200 24S330 2 400 18L400 40C320 26 262 62 200 46S70 36-40 66Z" /></svg>
      ${KB_TWINKLE.map(([l, t, d]) => html`<i class="kb-tw" style=${`left:${l}%;top:${t}%;animation-delay:-${d}s`}></i>`)}
    </div>
    <svg class=${cx('kebne', 'm-' + mode)} viewBox=${`0 0 ${VW} ${VH}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label=${label || 'Kebnekaise'}>
      <defs><linearGradient id=${id + 't'} x1="1" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#9C7BFF" stop-opacity="0" /><stop offset=".6" stop-color="#9C7BFF" stop-opacity=".7" /><stop offset="1" stop-color="#4FE6A6" /></linearGradient></defs>
      <g class="kb-stars">${KB_STARS.map(([x, y, r]) => html`<circle cx=${x} cy=${y} r=${r} />`)}</g>
      <g class="kb-far" style=${`transform:${far}`}><path d="M0 240L0 166 36 152 72 168 110 138 142 150 180 118 216 140 254 112 290 136 324 114 360 130 360 240Z" /></g>
      <g class="kb-world" style=${`transform:${world}`}>
        <path class="kb-massif" d="M0 240L0 190 30 182 70 150 104 128 136 96 170 70 196 58 212 66 232 44 254 70 284 104 320 136 360 148 360 240Z" />
        <path class="kb-shade" d="M232 44L254 70 284 104 320 136 360 148 360 240 262 240 240 150Z" />
        <path class="kb-snowcap" d="M136 96L170 70 196 58 212 66 232 44 254 70 284 104 272 100 262 110 250 98 238 106 226 94 212 103 198 90 184 100 170 91 156 102 146 96Z" />
        <path class="kb-ground" d="M0 226C60 218 120 232 180 225S300 220 360 229L360 240 0 240Z" />
        <g class="kb-hut" transform="translate(30 214)"><path class="w" d="M-7 0h14v8h-14z" /><path class="r" d="M-9 1L0-7 9 1z" /><path class="win" d="M-2.5 2.5h5v3.5h-5z" /></g>
        <path class="kb-trail" d=${KB_TRAIL} />
        <path class="kb-done" d=${KB_TRAIL} style=${`stroke-dasharray:${total.toFixed(1)} ${total.toFixed(1)};stroke-dashoffset:${(total - done).toFixed(1)}`} />
        ${KB_PTS.map((p, i) => (i && i < CLIMB.steps && !isCamp(i) ? html`<circle class=${cx('kb-wp', i <= st && 'on')} cx=${p[0]} cy=${p[1]} r="1.6" />` : null))}
        ${CLIMB.camps.map(c => html`<${KbTent} key=${c} step=${c} on=${floor >= c || best >= c} />`)}
        <g transform="translate(220 57)"><g class=${cx('kb-flag', top && 'up', k === 'summit' && 'plant')}><path class="pole" d="M0 0v-20" /><g class="cloth"><path class="bl" d="M0-20h-12v8H0z" /><path class="cr" d="M-3.8-20v8M0-16h-12" /></g></g></g>
        ${mode !== 'card' ? html`<g class="kb-labs">
          ${tag(`${CLIMB.names[0]} · ${fmtM(CLIMB.base)}`, 44, 233)}
          ${tag(CLIMB.names[1], 66, 152, true, fmtM(altitudeAt(CLIMB.camps[0])))}
          ${tag(CLIMB.names[2], 122, 96, true, fmtM(altitudeAt(CLIMB.camps[1])))}
          ${tag(`${CLIMB.names[3]} · ${fmtM(CLIMB.top)}`, 214, 30, true)}
        </g>` : null}
        ${teaser ? html`<path class="kb-qtrail" d="M420 196C350 150 318 44 250 32" stroke=${`url(#${id}t)`} />` : null}
        ${queen !== 'none' ? html`<g class="kb-qpos" style=${`transform:translate(${qx}px, ${qy}px)`}><g class=${cx('kb-queen', queen, teaser && 'land')}><${KbQueen} /></g></g>` : null}
        ${me && !teaser ? html`<g class="kb-mepos" style=${`transform:translate(${px}px, ${py - 6}px)`}>
          <g class="kb-face" style=${`transform:scale(${face}, 1)`}><g class=${cx('kb-act', k && 'a-' + k)} key=${'b' + n}><${KbBee} crowned=${crowned} color=${color} /></g></g>
        </g>` : null}
        ${(k === 'slip' || k === 'time') && fx.from ? html`<g class="kb-rocks" key=${'r' + n} transform=${`translate(${fx.from[0]} ${fx.from[1] - 2})`}>${KB_ROCKS.map((d, i) => html`<path class=${'rk k' + i} d=${d} />`)}</g>` : null}
        ${['summit', 'camp', 'win'].includes(k) ? html`<g transform=${`translate(${px} ${py - 8})`} key=${'x' + n}><g class="kb-burst">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => html`<path d="M0-9v-6" transform=${`rotate(${a})`} />`)}<circle r="7" /></g></g>` : null}
        ${fx && fx.gain ? html`<text class=${cx('kb-float', fx.gain > 0 ? 'up' : 'down')} key=${'f' + n} x=${px + 10} y=${py - 16}>${fx.gain > 0 ? '+' : '−'}${fmtM(Math.abs(fx.gain))}</text>` : null}
      </g>
      ${k === 'time' ? html`<g class="kb-gust" key=${'g' + n}>${[0.18, 0.34, 0.5, 0.66, 0.82].map((f, i) => html`<path d=${`M${VW + 20} ${(VH * f).toFixed(0)}h70`} style=${`animation-delay:${i * 0.07}s`} />`)}</g>` : null}
    </svg>
    <div class="kb-fall" aria-hidden="true"><i class="s1"></i><i class="s2"></i>${storm ? html`<i class="s3"></i>` : null}</div>
    ${storm ? html`<div class="kb-frost" aria-hidden="true"></div>` : null}
  </div>`;
}

/* ---------- the climb: 12 pitches against the clock, then the queen */
function ClimbBanner({ fb, onGo }) {
  if (!fb) return null;
  const alt = fmtM(altitudeAt(fb.to)), d = fmtM(Math.abs(altitudeAt(fb.to) - altitudeAt(fb.from)));
  const held = fb.to === 0 ? `You're still at ${CLIMB.names[0]}, ${alt}.` : `${campName(fb.to)} caught you at ${alt}.`;
  const [tone, icon, text] = {
    up: ['ok', 'check', `Up ${d} to ${alt}.`],
    camp: ['ok', 'tent', `${campName(fb.to)}, ${alt}! You won't slip below this camp now.`],
    summit: ['ok', 'flag', `Toppen! ${alt}.`],
    slip: ['bad', 'down', `Slip! Down ${d} to ${alt}.`],
    time: ['bad', 'timer', `Out of time! The wind blew you down to ${alt}.`],
    hold: ['hold', 'tent', fb.why === 'time' ? `Out of time. ${held}` : `Not quite. ${held}`],
  }[fb.kind] || ['ok', 'check', alt];
  return html`<div class=${cx('climb-banner', tone)} role="status"><${Icon} n=${icon} s=${19} /><span>${text}</span>
    ${onGo ? html`<button class="btn primary small" onClick=${onGo}>Keep climbing<${Icon} n="arrowR" s=${17} /></button>` : null}</div>`;
}
function ClimbRoom({ onExit, onNext, onAgain }) {
  const s = useApp();
  const [c0] = useState(() => ({ ...climbRec(S()) }));
  const [won0] = useState(() => climbWon(S()));
  const [met] = useState(() => { const it = S().intro; return !!(it && it.bees && it.bees.queen); }); // raced her on day one
  const [replay, setReplay] = useState(false);
  const [phase, setPhase] = useState(() => (climbSummit(S()) ? 'qintro' : 'intro')); // intro | pitch | fb | top | qintro | qcount | qrace | qdone
  const [pos, setPos] = useState(() => { const st = climbStart(S()); return { step: st, floor: st }; });
  const [queue, setQueue] = useState(() => climbPool());
  const [qi, setQi] = useState(0);
  const [cur, setCur] = useState({ rope: null, q: null });
  const [pick, setPick] = useState(null);
  const [fx, setFx] = useState(null);
  const [fb, setFb] = useState(null);
  const [clock, setClock] = useState({ at: 0, ms: 1 });
  const [now, setNow] = useState(Date.now());
  const [run, setRun] = useState({ right: 0, slips: 0, km: 0 });
  const [askExit, setAskExit] = useState(false);
  const [qw] = useState(() => queenWpm(S()));
  const [goAt, setGoAt] = useState(0);
  const [qv, setQv] = useState({ me: 0, q: 0 });
  const [qres, setQres] = useState(null);
  const R = useRef({ lock: false, over: false, me: 0, q: 0, last: 0, n: 0 });
  const L = useRef({}); L.current = { pos, qi, queue };
  const T = useRef([]);
  const later = (fn, ms) => { T.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => T.current.forEach(clearTimeout), []);
  useBodyLock(true);
  const climbing = phase === 'pitch' || phase === 'fb', racing = phase === 'qcount' || phase === 'qrace', live = climbing || racing;
  useBack(() => (live ? setAskExit(true) : onExit()), !askExit);
  const bump = () => (R.current.n += 1);
  const nextPitch = () => {
    const { pos: p, qi: i, queue: qq } = L.current;
    const rope = isRope(p.step) ? ropeText(p.step) : null, q = rope ? null : qq[i];
    R.current.lock = false;
    const t = Date.now();
    setCur({ rope, q }); setClock({ at: t, ms: pitchMs(q, rope && rope[0]) }); setNow(t);
    setPick(null); setFb(null); setPhase('pitch');
  };
  const startClimb = () => {
    update(x => { const c = x.climb = { ...(x.climb || {}) }; c.tries = (c.tries || 0) + 1; });
    setRun({ right: 0, slips: 0, km: 0 }); setFx(null);
    nextPitch();
  };
  const resolve = (ok, why, k) => {
    if (R.current.lock || phase !== 'pitch') return;
    R.current.lock = true;
    const from = pos.step, m = climbMove(pos.step, pos.floor, ok);
    const camp = ok && m.floor > pos.floor ? m.floor : 0, top = ok && m.step >= CLIMB.steps;
    let km = 0;
    update(x => {
      const c = x.climb = { ...(x.climb || {}) }, t0 = tripKm(x);
      c.best = Math.max(c.best || 0, m.step);
      if (!c.summit && camp > (c.camp || 0)) c.camp = camp;
      if (top && !c.summit) c.summit = Date.now();
      const road = tripKm(x) - t0;
      if (road > 0) { logKm(x, road); km = road; }
    });
    if (km) schedulePublish();
    const kind = ok ? (top ? 'summit' : camp ? 'camp' : 'up') : m.moved ? (why === 'time' ? 'time' : 'slip') : 'hold';
    setFx({ kind, n: bump(), from: KB_PTS[from], gain: altitudeAt(m.step) - altitudeAt(from) });
    setFb({ ok, why, kind, from, to: m.step, camp, km });
    setPick(k != null ? { k, ok } : null);
    setPos({ step: m.step, floor: m.floor });
    setRun(r => ({ right: r.right + (ok ? 1 : 0), slips: r.slips + (ok ? 0 : 1), km: r.km + km }));
    sfx(ok ? (top || camp ? 'done' : 'climb') : m.moved ? 'slip' : 'bad');
    if (cur.q) {
      const q = cur.q;
      setQueue(qq => { let nq = ok ? qq : [...qq, { ...q, uid: uid(), opts: shuffle(q.opts) }]; if (qi + 2 >= nq.length) nq = [...nq, ...climbPool()]; return nq; }); // a missed one comes back
      setQi(i => i + 1);
    }
    setPhase('fb');
    if (ok) later(() => (top ? setPhase('top') : nextPitch()), top ? 1700 : camp ? 1900 : 950);
  };
  useEffect(() => {
    if (phase !== 'pitch') return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [phase]);
  const left = Math.max(0, clock.ms - (now - clock.at));
  useEffect(() => { if (phase === 'pitch' && clock.at && now - clock.at >= clock.ms) resolve(false, 'time'); }, [now]);
  // on a keyboard: 1 to 4 answer, Enter keeps climbing after a slip
  useEffect(() => {
    const onKey = e => {
      const tag = (e.target && e.target.tagName) || '';
      if (askExit || tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (phase === 'pitch' && cur.q && /^[1-4]$/.test(e.key) && Number(e.key) <= cur.q.opts.length) { e.preventDefault(); const k = Number(e.key) - 1; resolve(k === rightIdx(cur.q), 'answer', k); }
      else if (phase === 'fb' && fb && !fb.ok && e.key === 'Enter') { e.preventDefault(); nextPitch(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });
  // the queen: a steady typing race with her motto
  const qText = typeClean(QUEEN.motto), qcps = (qw * 5) / 60;
  const startQueen = () => { R.current = { ...R.current, over: false, me: 0, q: 0, last: 0 }; setQv({ me: 0, q: 0 }); setQres(null); setGoAt(Date.now() + 3000); setNow(Date.now()); setPhase('qcount'); };
  const queenEnd = (won, tr) => {
    if (R.current.over) return;
    R.current.over = true;
    const ms = tr ? tr.ms : Math.max(0, Date.now() - goAt);
    let km = 0;
    update(x => {
      const c = x.climb = { ...(x.climb || {}) }, t0 = tripKm(x);
      c.queenTries = (c.queenTries || 0) + 1;
      if (won) { if (!c.queen) c.queen = Date.now(); c.queenBest = c.queenBest ? Math.min(c.queenBest, ms) : ms; }
      if (tr && tr.wpm) x.stats.bestWpm = Math.max(x.stats.bestWpm || 0, tr.wpm);
      const road = tripKm(x) - t0;
      if (road > 0) { logKm(x, road); km = road; }
    });
    if (km) schedulePublish();
    setQv({ me: won ? 1 : R.current.me, q: won ? R.current.q : 1 });
    setQres({ won, ms, wpm: tr ? tr.wpm : 0, km });
    setFx({ kind: won ? 'win' : 'lose', n: bump() });
    setPhase('qdone'); sfx(won ? 'level' : 'bad');
  };
  useEffect(() => {
    if (!racing) return;
    const t = setInterval(() => {
      const n = Date.now(); setNow(n);
      if (phase !== 'qrace' || R.current.over) return;
      const dt = R.current.last ? n - R.current.last : 0; R.current.last = n;
      R.current.q = npcStep(R.current.q, dt, qcps, qText.length, null, R.current.me);
      setQv({ me: R.current.me, q: R.current.q });
      if (R.current.q >= 1) queenEnd(false, null);
    }, 100);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => { if (phase === 'qcount' && goAt && now >= goAt) { R.current.last = Date.now(); setPhase('qrace'); } }, [now, phase, goAt]);
  const climbAgain = () => { setReplay(true); setPos({ step: 0, floor: 0 }); setFx(null); setPhase('intro'); };
  const leave = () => { if (racing) queenEnd(false, null); onExit(); };

  const losses = won0 ? 0 : c0.queenTries || 0, slower = Math.round(Math.min(CLIMB.maxSlower, CLIMB.slower * losses) * 100);
  const lanes = [
    { id: 'me', name: 'You', me: true, at: qv.me, p: { ...s.profile, avatar: s.profile.avatar || 'bee' }, sub: qres && qres.wpm ? `${qres.wpm} wpm` : null },
    { id: QUEEN.id, name: QUEEN.lane, npc: QUEEN, at: qv.q, sub: `${qw} wpm` },
  ];
  const storm = phase === 'pitch' && left < Math.min(6000, clock.ms * 0.3);
  const sceneLabel = `Kebnekaise. You are at ${fmtM(altitudeAt(pos.step))}${pos.floor ? `, and ${campName(pos.floor)} holds you` : ''}.`;
  let body;
  if (phase === 'intro') {
    const st = pos.step;
    body = html`<div class="results climb-intro">
      <${KebneScene} mode="full" step=${st} floor=${st} best=${c0.best || 0} queen="top" flag=${!!c0.summit} label=${sceneLabel} />
      <div class="eyebrow"><${Icon} n="mountain" s=${13} />Kiruna · C1 · Sweden’s highest mountain</div>
      <h2>Kebnekaise</h2>
      <p class="muted" style="max-width:46ch">${replay ? 'Climb it again from the bottom, just for fun.' : st ? `Your climb starts from ${campName(st)}, ${fmtM(altitudeAt(st))} up.` : `From ${CLIMB.names[0]} at ${fmtM(CLIMB.base)} to the north top at ${fmtM(CLIMB.top)}: Sweden’s highest point, and the queen’s home.`}</p>
      <ul class="stakes">
        <li><${Icon} n="timer" s=${18} /><span><b>${CLIMB.steps} pitches, each against the clock.</b> A right answer climbs about ${fmtM(pitchGain(0))}.</span></li>
        <li><${Icon} n="down" s=${18} /><span><b>Mistakes and running out of time make you slip</b> down a pitch.</span></li>
        <li><${Icon} n="tent" s=${18} /><span><b>Two camps catch your fall,</b> at ${fmtM(altitudeAt(CLIMB.camps[0]))} and ${fmtM(altitudeAt(CLIMB.camps[1]))}. Reach one and you never slip below it, and your next climb starts there.</span></li>
        <li><${Icon} n="keyboard" s=${18} /><span><b>Rope pitches</b> into each camp and up to the summit: type the line before your grip goes.</span></li>
        <li><${Icon} n="crown" s=${18} /><span>${replay ? 'Just for fun: the kilometres for the top are yours already.' : html`<b>On the summit, the rematch with Fjälldrottningen.</b> ${KM.summit} km for the top and ${KM.queen} for the queen.`}</span></li>
      </ul>
      <div class="actions"><button class="btn primary wide" onClick=${startClimb}><${Icon} n="mountain" s=${20} />${st ? `Climb from ${campName(st)}` : 'Start climbing'}</button><button class="btn ghost wide" onClick=${onExit}>Not now</button></div>
    </div>`;
  } else if (climbing) {
    const q = cur.q, correct = q ? rightIdx(q) : -1;
    const shown = phase === 'fb' && fb && !fb.ok;
    const optBtn = (k, label) => html`<button class=${cx('opt', pick && pick.k === k && (pick.ok ? 'right qfx-ok' : 'wrong qfx-bad'), shown && k === correct && 'right')} disabled=${phase !== 'pitch'} onClick=${() => resolve(k === correct, 'answer', k)}><span class="k">${k + 1}</span><span>${label}</span></button>`;
    const nextCamp = CLIMB.camps.find(c => c > pos.step);
    body = html`<div class="climb-live">
      <${KebneScene} mode="follow" step=${pos.step} floor=${pos.floor} best=${Math.max(c0.best || 0, pos.step)} fx=${fx} storm=${storm} queen="top" flag=${!!c0.summit} label=${sceneLabel} />
      <div class="climb-hud">
        <b class="num">${fmtM(altitudeAt(pos.step))}</b>
        <span>${pos.step >= CLIMB.steps ? 'The summit' : `${phase === 'fb' ? 'Next: pitch' : 'Pitch'} ${pos.step + 1} of ${CLIMB.steps}${isRope(pos.step) ? ' · rope' : ''}`}</span>
        <span class="hud-camp"><${Icon} n="tent" s=${14} />${pos.floor ? `${campName(pos.floor)} holds you` : nextCamp ? `${campName(nextCamp)} at ${fmtM(altitudeAt(nextCamp))}` : ''}</span>
      </div>
      ${phase === 'pitch' ? html`<div class=${cx('climb-clock', storm && 'cold')} role="timer" aria-label=${`${Math.ceil(left / 1000)} seconds left`}><i style=${`width:${((left / clock.ms) * 100).toFixed(1)}%`}></i><span class="num">${Math.ceil(left / 1000)} s</span></div>`
        : html`<${ClimbBanner} fb=${fb} onGo=${fb && !fb.ok ? nextPitch : null} />`}
      ${cur.rope ? html`<div class="climbq rope">
          <div class="notice rope-note"><${Icon} n="keyboard" /><span><b>Rope pitch!</b> Type the line before your grip goes.</span></div>
          <${TypeBox} key=${'rope' + clock.at} text=${typeClean(cur.rope[0])} easy=${true} live=${phase === 'pitch'} night=${true} startAt=${clock.at} label="Type the line" onDone=${() => resolve(true, 'rope')} />
          <p class="faint onb-en">${cur.rope[1]}</p>
        </div>`
      : q ? html`<div key=${q.uid} class="bossq climbq">
          ${q.kind === 'reply' ? html`<div class="say"><div class="avatar" aria-hidden="true">${initialOf(q.who)}</div><div class="bubble" style="flex:1"><div class="eyebrow" style="margin-bottom:4px">${q.who}</div><div class="big">${q.say}</div>${q.cue ? html`<div class="en">${q.cue}</div>` : null}</div></div>
            <div class="opts">${q.opts.map((o, k) => optBtn(k, o.sv))}</div>`
          : html`<div class="qtitle">What does this mean?</div><div class="bubble"><div class="big sv" lang="sv">${q.prompt}</div></div>
            <div class="opts">${q.opts.map((o, k) => optBtn(k, o))}</div>`}
        </div>` : null}
    </div>`;
  } else if (phase === 'top') body = html`<div class="results climb-top">
      <${KebneScene} mode="full" step=${CLIMB.steps} floor=${CLIMB.steps} best=${CLIMB.steps} fx=${{ kind: 'summit', n: 1 }} queen="top" flag=${true} label="You on the summit of Kebnekaise, with the queen bee beside you" />
      <div class="eyebrow">${CLIMB.names[3]} · ${fmtM(CLIMB.top)}</div>
      <h2>Toppen!</h2>
      <p class="muted" style="max-width:46ch">You’re standing on Sweden’s highest point. The rocky north top took the title in 2018, when the glacier on the south top melted below it.</p>
      <div class="resgrid"><div><b class="num">${run.right}</b><span>Pitches</span></div><div><b class="num">${run.slips}</b><span>${run.slips === 1 ? 'Slip' : 'Slips'}</span></div><div><b class="num">${run.km ? `+${run.km}` : '–'}</b><span>km</span></div></div>
      <div class="queen-wait"><${NpcBee} npc=${QUEEN} s=${56} /><span><b>${QUEEN.name} is waiting.</b> ${met ? 'She remembers you from your first day.' : 'She has never lost a race on her own mountain.'}</span></div>
      <div class="actions"><button class="btn primary wide" onClick=${() => setPhase('qintro')}><${Icon} n="crown" s=${20} />Meet the queen</button><button class="btn ghost wide" onClick=${onExit}>Later</button></div>
    </div>`;
  else if (phase === 'qintro') body = html`<div class="results climb-queen">
      <${KebneScene} mode="full" step=${CLIMB.steps} floor=${CLIMB.steps} best=${CLIMB.steps} queen="top" flag=${true} crowned=${won0} label="You and the queen bee on the summit of Kebnekaise" />
      <div class="eyebrow"><${Icon} n="crown" s=${13} />${CLIMB.names[3]} · ${fmtM(CLIMB.top)}</div>
      <h2>${QUEEN.name}</h2>
      <p class="muted" style="max-width:46ch">${won0 ? 'You beat her once. She would like a rematch.' : met ? 'The queen bee of Kebnekaise. Nobody beats her on their first day. Today, on her own mountain, you get the rematch.' : 'The queen bee of Kebnekaise. She has never lost a race on her own mountain, and she has been watching you climb.'}</p>
      <ul class="stakes">
        <li><${Icon} n="keyboard" s=${18} /><span><b>Type her motto</b> before she reaches the blomma.</span></li>
        <li><${Icon} n="timer" s=${18} /><span><b>She flies at ${qw} words a minute.</b>${slower ? ` Tired after ${losses} ${losses === 1 ? 'race' : 'races'}: ${slower}% slower.` : ''}</span></li>
        <li><${Icon} n="road" s=${18} /><span>${won0 ? 'A rematch for fun: the kilometres are yours already.' : `Win ${KM.queen} km and Fjällmästare, the last badge.`}</span></li>
      </ul>
      <div class="actions"><button class="btn primary wide" onClick=${startQueen}><${Icon} n="crown" s=${20} />Race the queen</button><button class="btn ghost wide" onClick=${onExit}>Not now</button>
        ${c0.summit ? html`<button class="linkbtn" onClick=${climbAgain}>Climb again from ${CLIMB.names[0]}</button>` : null}</div>
    </div>`;
  else if (racing) body = html`<div class="race-live">
      <${BeeTrack} lanes=${lanes} />
      ${phase === 'qcount' ? html`<div class="race-count num" aria-live="assertive">${Math.ceil((goAt - now) / 1000) > 0 ? Math.ceil((goAt - now) / 1000) : 'Kör!'}</div>` : null}
      <${TypeBox} text=${qText} easy=${true} live=${phase === 'qrace'} armed=${phase === 'qcount'} night=${true} startAt=${goAt} label="Type the queen's motto" onProgress=${p => { R.current.me = p.chars / p.total; setQv({ me: R.current.me, q: R.current.q }); }} onDone=${tr => queenEnd(true, tr)} />
      <p class="faint onb-en">${QUEEN.mottoEn}</p>
    </div>`;
  else if (phase === 'qdone' && qres && qres.won) {
    const fin = nextAction(S()).type === 'done';
    body = html`<div class="results climb-win">
      <${KebneScene} mode="full" step=${CLIMB.steps} floor=${CLIMB.steps} best=${CLIMB.steps} fx=${fx} queen="beaten" flag=${true} crowned=${true} label="You on the summit of Kebnekaise wearing a crown, with the queen bee bowing" />
      <div class="eyebrow">${won0 ? 'Rematch won' : 'Fjällmästare'}</div>
      <h2>You beat the queen!</h2>
      <${BeeTrack} lanes=${lanes} />
      <div class="resgrid"><div><b class="num">${raceSecs(qres.ms)}</b><span>Time</span></div><div><b class="num">${qres.wpm || '–'}</b><span>wpm</span></div><div><b class="num">${qres.km ? `+${qres.km}` : '–'}</b><span>km</span></div></div>
      <p class="muted" style="max-width:46ch">${won0 ? 'Still the master of the mountain.' : fin ? 'Malmö to Kiruna, and the top of Sweden. The whole journey is yours.' : 'Only the C1 checkpoint stands between you and the end of the journey.'}</p>
      <div class="motto"><span class="sp-lab"><${Icon} n="crown" s=${14} />The queen’s motto</span><b class="sv" lang="sv">${QUEEN.motto}</b><span>${QUEEN.mottoEn} ${QUEEN.note}</span></div>
      <${SignupNudge} result=${{ newStamp: false }} />
      <div class="actions">${fin || won0 ? html`<button class="btn primary wide" onClick=${onExit}>Done<${Icon} n="check" s=${20} /></button>`
        : html`<button class="btn primary wide" onClick=${onNext}>Continue the journey<${Icon} n="arrowR" s=${20} /></button><button class="btn ghost wide" onClick=${onExit}>Done</button>`}</div>
    </div>`;
  } else if (phase === 'qdone' && qres) body = html`<div class="results">
      <${NpcBee} npc=${QUEEN} s=${76} />
      <div class="eyebrow">${QUEEN.name} got there first</div>
      <h2>So close</h2>
      <${BeeTrack} lanes=${lanes} />
      <p class="muted" style="max-width:44ch">${won0 ? 'Rematches are at full speed.' : slower + CLIMB.slower * 100 <= CLIMB.maxSlower * 100 ? `She’ll be a little slower next time: ${queenWpm(S())} words a minute.` : `She’s as slow as a queen gets now: ${queenWpm(S())} words a minute.`} You stay on the summit, so the rematch is right here.</p>
      <div class="actions"><button class="btn primary wide" onClick=${onAgain}>Race her again<${Icon} n="arrowR" s=${20} /></button><button class="btn ghost wide" onClick=${onExit}>Later</button></div>
    </div>`;
  const qph = ['qintro', 'qcount', 'qrace', 'qdone', 'top'].includes(phase);
  return html`<div class=${cx('room climb', qph && 'summit')} role="dialog" aria-modal="true" aria-label=${qph ? `${QUEEN.name} on the summit of Kebnekaise` : 'The climb up Kebnekaise'}>
    <div class="room-top">
      <button class="iconbtn" onClick=${() => (live ? setAskExit(true) : onExit())} aria-label=${live ? (racing ? 'Leave the race' : 'Leave the climb') : 'Close'}><${Icon} n="close" /></button>
      <b style="flex:1">${qph ? `${CLIMB.names[3]} · Kebnekaise` : 'Kebnekaise · Kiruna'}</b>
      ${climbing ? html`<span class="chip glow num" aria-label=${`Altitude ${fmtM(altitudeAt(pos.step))}`}><${Icon} n="mountain" s=${14} />${fmtM(altitudeAt(pos.step))}</span>` : html`<span class="chip">C1</span>`}
    </div>
    <div class="room-body"><div class="room-inner">${body}</div></div>
    ${askExit ? html`<${Confirm} title=${racing ? 'Leave the race?' : 'Leave the climb?'} text=${racing ? 'It counts as a race, and the queen gets a little slower.' : `Your camp is saved: your next climb starts from ${campName(replay ? 0 : pos.floor)}, ${fmtM(altitudeAt(replay ? 0 : pos.floor))}.`}
      yes="Leave" no=${racing ? 'Keep racing' : 'Keep climbing'} danger onYes=${leave} onNo=${() => setAskExit(false)} />` : null}
  </div>`;
}

/* ---------- where the mountain shows up: Home, Kiruna and Practice */
function ClimbCard({ s, startAction, openStop }) {
  const top = climbSummit(s), st = climbStart(s), c = climbRec(s);
  return html`<section class="card cont climbcard" aria-label="Kebnekaise">
    <${KebneScene} mode="card" step=${st} floor=${st} best=${c.best || 0} queen="top" flag=${top} label=${top ? 'You on the summit of Kebnekaise, with the queen bee waiting' : `Kebnekaise, with you at ${campName(st)}`} />
    <div class="eyebrow">${top ? `${CLIMB.names[3]} · ${fmtM(CLIMB.top)}` : 'Kebnekaise · Kiruna · C1'}</div>
    <h2 class="display">${top ? 'The queen is waiting' : c.tries && st ? `Back to ${campName(st)}` : 'Climb Kebnekaise'}</h2>
    <p class="theme">${top ? `Race Fjälldrottningen on the summit: type her motto before she reaches the blomma. ${KM.queen} km and the last badge.` : `${CLIMB.steps} pitches up Sweden’s highest mountain. Right answers climb, mistakes and the clock make you slip. ${KM.summit} km for the top, and the queen waits there.`}</p>
    ${c.tries && !top ? html`<p class="muted climb-best">Highest so far: ${fmtM(altitudeAt(c.best || 0))} · ${c.tries} ${c.tries === 1 ? 'climb' : 'climbs'}</p>` : null}
    <div class="row"><button class="btn primary" onClick=${() => startAction({ type: 'climb', sid: CLIMB.sid })}><${Icon} n=${top ? 'crown' : 'mountain'} s=${19} />${top ? 'Race the queen' : st ? `Climb from ${campName(st)}` : 'Start climbing'}</button>
      <button class="linkbtn" onClick=${() => openStop(CLIMB.sid)}>About Kiruna</button></div>
  </section>`;
}
function ClimbRow({ s, start, next }) {
  const open = climbOpen(s), top = climbSummit(s), won = climbWon(s), st = climbStart(s), c = climbRec(s);
  return html`<button class=${cx('lessonrow bossrow climbrow', next && 'next')} disabled=${!open} onClick=${() => start({ type: 'climb', sid: CLIMB.sid })}>
    <span class="li npc-li"><${NpcBee} npc=${QUEEN} s=${36} /></span>
    <span class="tx"><b>Kebnekaise <span class="faint" style="font-weight:700">· ${won ? 'Conquered' : 'Queen bee'}</span></b>
      <span>${won ? 'You beat the queen on the summit. Climb or race again any time.' : !open ? `Finish “Respond” in Kiruna to climb Sweden’s highest mountain and race ${QUEEN.name}.` : top ? `On the summit. Race ${QUEEN.name} at ${queenWpm(s)} words a minute.` : c.tries && st ? `Your next climb starts from ${campName(st)}, ${fmtM(altitudeAt(st))}.` : `Climb ${CLIMB.steps} pitches to the top, then race ${QUEEN.name}.`}</span></span>
    ${won ? html`<span class="chip moss"><${Icon} n="check" s=${14} w=${3} />Won</span>` : html`<${Icon} n=${open ? 'mountain' : 'lock'} />`}
  </button>`;
}
