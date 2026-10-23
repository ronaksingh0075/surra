/* ================= Surra UI: NPC bees: the three races of onboarding and the boss battles at the safehouses ================= */

/* ---------- a bee with character: Bettan wears a bow, Sixten shades, the bosses a crown and the queen a taller one */
function NpcHat({ id }) {
  if (id === 'bettan') return html`<g class="bow"><circle cx="6.6" cy="-6.9" r="2.2" /><circle cx="10.6" cy="-7.6" r="2.2" /><circle class="mid" cx="8.6" cy="-7.2" r="1.3" /></g>`;
  if (id === 'sixten') return html`<g class="shades"><path d="M5.2 -2.6h3.2" /><rect x="8.1" y="-3.9" width="5.2" height="2.9" rx="1.3" /><path class="shine" d="M9.2 -3.1h1.4" /></g>`;
  if (id === 'queen') return html`<g class="qcrown"><path class="crown" d="M4 -7l-1.4-8.8 3.6 3.2 3-6 3 6 3.6-3.2-1.4 8.8z" />
    <circle class="tip" cx="2.6" cy="-15.8" r="1" /><circle class="tip" cx="9.2" cy="-18.8" r="1.1" /><circle class="tip" cx="15.8" cy="-15.8" r="1" />
    <circle class="jewel" cx="9.2" cy="-10.3" r="1.5" /><circle class="jewel b" cx="5.7" cy="-9.4" r=".85" /><circle class="jewel b" cx="12.7" cy="-9.4" r=".85" /></g>`;
  return html`<path class="crown" d="M4.4 -7.2l-1-6.4 3.2 2.5 2.6-4.2 2.6 4.2 3.2-2.5-1 6.4z" />`;
}
function NpcBee({ npc, s = 40 }) {
  const id = npc && npc.id, boss = !!id && id !== BETTAN.id && id !== SIXTEN.id;
  return html`<svg width=${s} height=${s} viewBox="-17 -20 34 34" class=${cx('bee npc', boss && 'boss', id === QUEEN.id && 'queen', npc && npc.tint && 'tint-' + npc.tint)} aria-hidden="true">
    <${BeeShape} />
    <g class="bee-bob"><${NpcHat} id=${id} /></g>
  </svg>`;
}

/* ---------- onboarding: three races at your level. Bettan, then her big brother Sixten, then a bee nobody beats */
const HEAT_COPY = {
  bettan: { t: 'Race Bettan to the blomma', d: 'Your first rival, a Swedish bee from Malmö. Type the sentence before she reaches the flower.', sub: 'Swedish bee',
    win: ['You beat Bettan!', 'That’s every race in Surra: type the Swedish, word by word. Bettan says lycka till.'],
    lose: ['Bettan got there first', 'She’s had a lot of practice. Her big brother is up next, and he’s quicker.'] },
  sixten: { t: 'Sixten, her big brother', d: 'Faster than Bettan, and he doesn’t wait for anyone. Same rules: type it before he reaches the flower.', sub: 'Big brother',
    win: ['You beat Sixten!', 'Not many do that on their first day. But one more bee wants to race.'],
    lose: ['Sixten got there first', 'He’s quick. You’ll catch him on the road. But one more bee wants to race.'] },
  queen: { t: 'Fjälldrottningen', d: 'The queen bee of Kebnekaise has flown down from Sweden’s highest mountain to see who’s new. They say she has never lost a race.', sub: 'Queen bee' },
};
function IntroGauntlet({ level, cta, onRaced, onDone }) {
  const s = useApp();
  const heats = useMemo(() => introHeats(level), [level]);
  const [hi, setHi] = useState(0);
  const [res, setRes] = useState([]); // per race: { won, wpm, ms, km }
  const [phase, setPhase] = useState('ready'); // ready | countdown | race | whoosh (the queen only) | done
  const [goAt, setGoAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [view, setView] = useState({ me: 0, npc: 0, zoom: false });
  const R = useRef({ me: 0, npc: 0, last: 0, over: false, zoom: false });
  const T = useRef([]);
  useEffect(() => () => T.current.forEach(clearTimeout), []);
  const heat = heats[hi], bee = heat.bee, queen = !!heat.queen, copy = HEAT_COPY[bee.id];
  const [sv, en] = heat.text, text = typeClean(sv), r = res[hi];
  const top = () => { try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } };
  const end = (won, tr) => {
    if (R.current.over) return;
    R.current.over = true;
    if (queen) { won = false; R.current.npc = 1; } // nobody beats the queen on day one
    const out = { won, wpm: tr ? tr.wpm : 0, ms: tr ? tr.ms : Math.max(0, Date.now() - goAt) };
    let km = 0;
    const prev = S().intro && S().intro.bees && S().intro.bees[bee.id]; // raced before a reload: the head start is already counted
    update(x => { km = introRecord(x, bee.id, out, heat.km(out)); if (out.wpm) x.stats.bestWpm = Math.max(x.stats.bestWpm || 0, out.wpm); });
    setRes(rr => { const n = rr.slice(); n[hi] = { ...out, km: km || (prev && prev.km) || 0 }; return n; });
    setView({ me: won ? 1 : R.current.me, npc: R.current.npc, zoom: R.current.zoom });
    if (onRaced) onRaced();
    if (queen) { setPhase('whoosh'); T.current.push(setTimeout(() => { setPhase('done'); sfx('done'); top(); }, 1300)); }
    else { setPhase('done'); sfx(won ? 'level' : 'done'); }
  };
  useEffect(() => {
    if (phase !== 'countdown' && phase !== 'race') return;
    const t = setInterval(() => {
      const n = Date.now(); setNow(n);
      if (phase !== 'race' || R.current.over) return;
      const dt = R.current.last ? n - R.current.last : 0; R.current.last = n;
      if (queen) {
        const q = queenStep(R.current.npc, dt, n - goAt, R.current.me, R.current.zoom, text.length, n - (R.current.key || goAt));
        if (q.zooming && !R.current.zoom) sfx('whoosh');
        R.current.npc = q.at; R.current.zoom = q.zooming;
      } else R.current.npc = npcStep(R.current.npc, dt, heat.cps, text.length, heat.band, R.current.me);
      setView({ me: R.current.me, npc: R.current.npc, zoom: R.current.zoom });
      if (R.current.npc >= 1) end(false, null);
    }, queen ? 50 : 100);
    return () => clearInterval(t);
  }, [phase, hi]);
  useEffect(() => { if (phase === 'countdown' && goAt && now >= goAt) { R.current.last = Date.now(); setPhase('race'); } }, [now, phase, goAt]);
  const start = () => { R.current = { me: 0, npc: 0, last: 0, over: false, zoom: false }; setView({ me: 0, npc: 0, zoom: false }); setGoAt(Date.now() + 3000); setNow(Date.now()); setPhase('countdown'); };
  const next = () => { R.current = { me: 0, npc: 0, last: 0, over: false, zoom: false }; setView({ me: 0, npc: 0, zoom: false }); setHi(hi + 1); setPhase('ready'); top(); };
  const lanes = [
    { id: 'me', name: 'You', me: true, at: view.me, p: { ...s.profile, avatar: s.profile.avatar || 'bee' }, sub: r && r.wpm ? `${r.wpm} wpm` : null },
    { id: bee.id, name: bee.lane || bee.name, npc: bee, at: view.npc, sub: copy.sub, zoom: queen && view.zoom, trail: queen && view.zoom },
  ];
  const cd = Math.ceil((goAt - now) / 1000);
  const strip = html`<ol class="heats" aria-label="Three races">${heats.map((h, i) => {
    const rr = res[i], known = !h.queen || i <= hi; // the third bee is a mystery until her race
    return html`<li class=${cx('heat', i === hi && 'on', rr && (rr.won ? 'won' : 'lost'), h.queen && 'q')} key=${h.bee.id} aria-label=${known ? `${h.bee.name}${rr ? (rr.won ? ', won' : ', lost') : ''}` : 'A mystery bee'}>
      <span class="hb">${known ? html`<${NpcBee} npc=${h.bee} s=${30} />` : html`<span class="mystery" aria-hidden="true">?</span>`}</span>
      <span class="hn">${known ? h.bee.lane || h.bee.name : '???'}</span>
      ${rr ? html`<span class="hr">${rr.won ? html`<${Icon} n="check" s=${12} w=${3} />Won` : 'Lost'}</span>` : null}
    </li>`;
  })}</ol>`;
  if (queen && phase === 'done') return html`<div class="card onb-race night" key="teaser">${strip}<${KebneTeaser} level=${level} cta=${cta} onDone=${() => onDone({})} /></div>`;
  return html`<div class=${cx('card onb-race', queen && 'night')} key=${'heat' + hi}>
    ${strip}
    ${phase === 'ready' ? html`<div class=${cx('npc-intro', queen && 'qreveal')}><${NpcBee} npc=${bee} s=${queen ? 84 : 64} />
      <div class="tx"><span class="eyebrow">Race ${hi + 1} of 3${queen ? ' · Boss bee' : ''}</span><b>${copy.t}</b><span>${copy.d}</span></div></div>` : null}
    <${BeeTrack} lanes=${lanes} />
    ${phase === 'countdown' ? html`<div class="race-count num" aria-live="assertive">${cd > 0 ? cd : 'Kör!'}</div>` : null}
    ${phase === 'whoosh' ? html`<div class="race-count whoosh" aria-live="assertive">Whoosh!</div>` : null}
    ${phase !== 'done' && phase !== 'whoosh' ? html`<${TypeBox} key=${'tb' + hi} text=${text} easy=${true} live=${phase === 'race'} armed=${phase === 'countdown'} night=${queen} startAt=${goAt} label="Type the sentence"
        onProgress=${p => { const at = p.chars / p.total; if (at !== R.current.me) R.current.key = Date.now(); R.current.me = at; setView({ me: R.current.me, npc: R.current.npc, zoom: R.current.zoom }); }} onDone=${tr => end(true, tr)} />
      <p class="faint onb-en">Means: ${en}</p>` : null}
    ${phase === 'ready' ? html`<div class="actions"><button class="btn primary wide" onClick=${start}><${Icon} n=${queen ? 'crown' : 'flower'} s=${20} />${queen ? 'Race the queen' : 'Start the race'}</button>
      ${hi === 0 ? html`<span class="faint onb-hint">Letter help is on: a, o and e count for å, ä and ö.</span>` : null}
      <button class="linkbtn" onClick=${() => onDone({ skipped: true })}>Skip the races</button></div>` : null}
    ${phase === 'done' && r ? html`<div class=${cx('onb-result', r.won ? 'win' : 'lose')} role="status">
        <b class="display">${r.won ? copy.win[0] : copy.lose[0]}</b>
        <span class="num">${r.won && r.wpm ? `${r.wpm} wpm · ` : ''}${r.km ? `+${r.km} km head start` : 'No kilometres this time'}</span>
        <p>${r.won ? copy.win[1] : copy.lose[1]}</p>
      </div>
      <div class="actions"><button class="btn primary wide" onClick=${next}>${hi === 0 ? html`Next: ${SIXTEN.name}` : 'One more bee…'}<${Icon} n="arrowR" s=${20} /></button>
        <button class="linkbtn" onClick=${() => onDone({ skipped: true })}>Skip the races</button></div>` : null}
  </div>`;
}

/* ---------- after the queen: where she lives, and the road there */
function KebneTeaser({ level, cta, onDone }) {
  const s = useApp(), head = (s.intro && s.intro.km) || 0;
  return html`<div class="teaser" role="status">
    <${KebneScene} mode="teaser" label="Kebnekaise at night under the northern lights, with the queen bee landing on the summit" />
    <div class="eyebrow">Fjälldrottningen wins</div>
    <h2 class="display">Nobody beats the queen. Yet.</h2>
    <p class="teaser-p">She lives on top of Kebnekaise, Sweden’s highest mountain, at the far end of the road beside Kiruna. Travel north one conversation at a time, climb to the summit and race her again. She’ll be waiting.</p>
    <${RoadToKiruna} level=${level} />
    <div class="motto"><span class="sp-lab"><${Icon} n="crown" s=${14} />Her motto, and your race on the summit</span><b class="sv" lang="sv">${QUEEN.motto}</b><span>${QUEEN.mottoEn} ${QUEEN.note}</span></div>
    ${head ? html`<p class="teaser-km num"><${Icon} n="road" s=${17} />+${head} km head start</p>` : null}
    <button class="btn primary wide onb-next" onClick=${onDone}>${cta || 'Start the road to Kiruna'}<${Icon} n="arrowR" s=${20} /></button>
  </div>`;
}
// the five regions from your first city to Kiruna, with Kebnekaise at the end
function RoadToKiruna({ level }) {
  const li = Math.max(0, LEVEL_IDS.indexOf(level)), sid = LEVELS[li].stops[0], prev = ORDER[ORDER.indexOf(sid) - 1];
  const left = ROUTE_KM - (prev ? CUM_KM[prev] : 0), X = i => 22 + i * 64, x0 = X(li), x1 = 336, len = x1 - x0;
  return html`<div class="road2k">
    <svg viewBox="0 0 360 70" role="img" aria-label=${`${fmtKm(left)} from ${STOPS[sid].city} to Kiruna, then up Kebnekaise`}>
      <path class="r2-base" d="M22 34H336" />
      <path class="r2-road" d=${`M${x0} 34H${x1}`} style=${`stroke-dasharray:${len};stroke-dashoffset:${len}`} />
      ${LEVELS.map((L, i) => html`<g class=${cx('r2-stop', i < li && 'past', i === li && 'here')} key=${L.id}><circle cx=${X(i)} cy="34" r=${i === li ? 6 : 4.5} /><text x=${X(i)} y="60">${L.id}</text></g>`)}
      <g class="r2-peak" transform="translate(336 34)"><path class="m" d="M-15 9L0-15 15 9z" /><path class="sn" d="M-5.2-6.6L0-15l5.2 8.4-2.6-1.5L0-5.5l-2.5-2.6z" />
        <path class="cr" d="M-5-21.5l-.8-5 2.6 2 3.2-4.3 3.2 4.3 2.6-2-.8 5z" /></g>
      <g class="r2-you" transform=${`translate(${x0} 16)`}><text y="-2">${STOPS[sid].city}</text></g>
    </svg>
    <p><b class="num">${fmtKm(left)}</b> from ${STOPS[sid].city} to Kiruna, then ${fmtN(CLIMB.top - CLIMB.base)} m up.</p>
  </div>`;
}

/* ---------- boss battle: 8 replies, then the motto, before the boss reaches the blomma */
function BossRoom({ sid, onExit, onNext, onAgain }) {
  const s = useApp(), B = BOSSES[sid], st = STOPS[sid], L = LEVELS[LEVEL_INDEX[sid]];
  const [T] = useState(() => bossTime(S(), sid) * 1000);
  const [rec0] = useState(() => ({ ...bossRec(S(), sid) }));
  const [clear0] = useState(() => bossClear(S(), sid)); // the road was open before this battle
  const [queue, setQueue] = useState(() => bossPool(sid));
  const [qi, setQi] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro | countdown | quiz | sprint | done
  const [right, setRight] = useState(0);
  const [pick, setPick] = useState(null);
  const [goAt, setGoAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [typed, setTyped] = useState(0);
  const [res, setRes] = useState(null);
  const [askExit, setAskExit] = useState(false);
  const R = useRef({ over: false, right: 0, lock: false });
  const motto = typeClean(B.motto), opens = bossOpens(sid), live = phase === 'quiz' || phase === 'sprint';
  useBodyLock(true);
  useBack(() => (live ? setAskExit(true) : onExit()), !askExit);
  const finish = (won, ms) => {
    if (R.current.over) return;
    R.current.over = true;
    const time = ms || Math.max(0, Date.now() - goAt);
    let km = 0, region = null;
    update(x => {
      const t0 = tripKm(x), li = LEVEL_INDEX[sid] + 1, locked = li < LEVELS.length && !levelUnlocked(x, li);
      x.bosses = x.bosses || {};
      const b = { ...(x.bosses[sid] || {}) };
      b.tries = (b.tries || 0) + 1;
      if (won) { if (!b.won) b.won = Date.now(); b.best = b.best ? Math.min(b.best, time) : time; }
      x.bosses[sid] = b;
      const road = tripKm(x) - t0;
      if (road > 0) { logKm(x, road); km = road; }
      if (locked && levelUnlocked(x, li)) region = li; // the boss was the last thing between you and a new region
    });
    if (km) schedulePublish();
    if (region != null) setTimeout(() => CELEBRATE.set({ li: region }), 1100);
    setRes({ won, ms: time, km, right: R.current.right });
    setPhase('done'); sfx(won ? 'level' : 'bad');
  };
  useEffect(() => {
    if (!['countdown', 'quiz', 'sprint'].includes(phase)) return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => { if (phase === 'countdown' && goAt && now >= goAt) setPhase('quiz'); }, [now, phase, goAt]);
  const el = goAt ? Math.max(0, now - goAt) : 0;
  useEffect(() => { if (live && el >= T) finish(false); }, [now]);
  const q = queue[qi];
  const correct = q ? (q.kind === 'reply' ? q.opts.findIndex(o => o.ok) : q.opts.indexOf(q.answer)) : -1;
  const answer = k => {
    if (R.current.lock || phase !== 'quiz' || R.current.over || !q) return;
    R.current.lock = true;
    const ok = k === correct;
    setPick({ k, ok }); sfx(ok ? 'ok' : 'bad');
    setTimeout(() => {
      if (R.current.over) return;
      R.current.lock = false; setPick(null);
      if (ok) {
        R.current.right += 1; setRight(R.current.right);
        if (R.current.right >= BOSS.replies) { setPhase('sprint'); return; }
      } else setQueue(qq => [...qq, { ...q, uid: uid(), opts: shuffle(q.opts) }]); // a missed one comes back
      setQi(i => i + 1);
    }, ok ? 380 : 1250);
  };
  const start = () => { R.current = { over: false, right: 0, lock: false }; setGoAt(Date.now() + 3000); setNow(Date.now()); setPhase('countdown'); };
  const leave = () => { if (live) finish(false); onExit(); };
  // the track
  const doneAt = res ? Math.min(1, res.ms / T) : 0;
  const bossAt = phase === 'intro' || phase === 'countdown' ? 0 : phase === 'done' ? (res && !res.won ? 1 : doneAt) : Math.min(1, el / T);
  const meAt = Math.min(1, right * BOSS.step + (phase === 'sprint' ? BOSS.sprint * typed : phase === 'done' && res && res.won ? BOSS.sprint : 0));
  const lanes = [
    { id: 'me', name: 'You', me: true, at: meAt, p: { ...s.profile, avatar: s.profile.avatar || 'bee' }, sub: `${Math.min(right, BOSS.replies)}/${BOSS.replies}` },
    { id: B.id, name: B.name, npc: B, at: bossAt, sub: 'Boss bee' },
  ];
  const losses = rec0.won ? 0 : rec0.tries || 0, slower = Math.round(Math.min(BOSS.maxSlower, BOSS.slower * losses) * 100);
  const optBtn = (k, label) => html`<button class=${cx('opt', pick && pick.k === k && (pick.ok ? 'right qfx-ok' : 'wrong qfx-bad'), pick && !pick.ok && k === correct && 'right')} disabled=${!!pick} onClick=${() => answer(k)}><span class="k">${k + 1}</span><span>${label}</span></button>`;
  let body;
  if (phase === 'intro') body = html`<div class="results boss-intro">
      <${NpcBee} npc=${B} s=${104} />
      <div class="eyebrow"><${Icon} n="shield" s=${13} />Boss bee · ${st.city} · ${L.id}</div>
      <h2>${B.name}</h2>
      <p class="muted" style="max-width:44ch">${B.blurb}</p>
      <ul class="stakes">
        <li><${Icon} n="chat" s=${18} /><span><b>Answer ${BOSS.replies} replies right.</b> Each one flies you a tenth of the way to the blomma.</span></li>
        <li><${Icon} n="keyboard" s=${18} /><span><b>Then type ${B.name}'s motto</b> for the final stretch: real spoken Swedish.</span></li>
        <li><${Icon} n="timer" s=${18} /><span><b>${B.name} reaches the blomma in ${mmss(T)}.</b>${slower ? ` Tired after ${losses} ${losses === 1 ? 'try' : 'tries'}: ${slower}% slower.` : ''}</span></li>
        <li><${Icon} n="road" s=${18} /><span>${rec0.won ? `A rematch for fun: you beat ${B.name} already.` : clear0 ? `Win ${KM.boss} km and the badge. Your road is open already.` : `Win ${KM.boss} km${opens ? ` and the road to ${opens.city}` : ''}.`}</span></li>
      </ul>
      <div class="actions"><button class="btn primary wide" onClick=${start}><${Icon} n="crown" s=${20} />Start the battle</button><button class="btn ghost wide" onClick=${onExit}>Not now</button></div>
    </div>`;
  else if (phase === 'countdown') body = html`<div class="race-live"><${BeeTrack} lanes=${lanes} /><div class="race-count num" aria-live="assertive">${Math.ceil((goAt - now) / 1000) > 0 ? Math.ceil((goAt - now) / 1000) : 'Kör!'}</div></div>`;
  else if (phase === 'quiz' && q) body = html`<div class="race-live">
      <${BeeTrack} lanes=${lanes} />
      <div key=${q.uid} class="bossq">
        ${q.kind === 'reply' ? html`<div class="say"><div class="avatar" aria-hidden="true">${initialOf(q.who)}</div><div class="bubble" style="flex:1"><div class="eyebrow" style="margin-bottom:4px">${q.who}</div><div class="big">${q.say}</div>${q.cue ? html`<div class="en">${q.cue}</div>` : null}</div></div>
          <div class="opts">${q.opts.map((o, k) => optBtn(k, o.sv))}</div>`
        : html`<div class="qtitle">What does this mean?</div><div class="bubble"><div class="big sv" lang="sv">${q.prompt}</div></div>
          <div class="opts">${q.opts.map((o, k) => optBtn(k, o))}</div>`}
      </div>
    </div>`;
  else if (phase === 'sprint') body = html`<div class="race-live">
      <${BeeTrack} lanes=${lanes} />
      <div class="notice"><${Icon} n="keyboard" /><span><b>Final stretch!</b> Type ${B.name}'s motto to reach the blomma.</span></div>
      <${TypeBox} text=${motto} easy=${true} live=${true} startAt=${goAt} label=${`Type ${B.name}'s motto`} onProgress=${p => setTyped(p.chars / p.total)} onDone=${r => finish(true, r.ms)} />
      <p class="faint onb-en">${B.mottoEn}</p>
    </div>`;
  else if (phase === 'done' && res && res.won) {
    const tries = (rec0.tries || 0) + 1, cpDone = !!s.checkpoints[L.id];
    const next = rec0.won ? `A rematch for fun: the road was already open.` : !opens || clear0 ? '' : !opens.newLevel || cpDone ? `The road to ${opens.city} is open.` : `Pass the ${L.id} checkpoint and the road to ${opens.city} is yours.`;
    body = html`<div class="results">
      <${NpcBee} npc=${B} s=${72} />
      <div class="eyebrow">Boss beaten</div>
      <h2>You beat ${B.name}!</h2>
      <${BeeTrack} lanes=${lanes} />
      <div class="resgrid"><div><b class="num">${raceSecs(res.ms)}</b><span>Time</span></div><div><b class="num">${res.km ? `+${res.km}` : '–'}</b><span>km</span></div><div><b class="num">${tries}</b><span>${tries === 1 ? 'Try' : 'Tries'}</span></div></div>
      ${next ? html`<p class="muted" style="max-width:44ch">${next}</p>` : null}
      <div class="motto"><span class="sp-lab"><${Icon} n="chat" s=${14} />${B.name}'s motto</span><b class="sv" lang="sv">${B.motto}</b><span>${B.mottoEn} ${B.note}</span></div>
      <${SignupNudge} result=${{ newStamp: false }} />
      <div class="actions"><button class="btn primary wide" onClick=${onNext}>Continue the journey<${Icon} n="arrowR" s=${20} /></button><button class="btn ghost wide" onClick=${onExit}>Done</button></div>
    </div>`;
  } else if (phase === 'done' && res) body = html`<div class="results">
      <${NpcBee} npc=${B} s=${72} />
      <div class="eyebrow">${B.name} got there first</div>
      <h2>So close</h2>
      <${BeeTrack} lanes=${lanes} />
      <p class="muted" style="max-width:44ch">You had ${res.right} of ${BOSS.replies} replies${res.right >= BOSS.replies ? ' and were typing the motto' : ''}. ${rec0.won ? 'Rematches are at full speed.' : slower + BOSS.slower * 100 <= BOSS.maxSlower * 100 ? `${B.name} will be a little slower on your next try.` : `${B.name} is as slow as a boss bee gets now.`}</p>
      <div class="actions"><button class="btn primary wide" onClick=${onAgain}>Try again<${Icon} n="arrowR" s=${20} /></button><button class="btn ghost wide" onClick=${onExit}>Later</button></div>
    </div>`;
  return html`<div class="room race boss" role="dialog" aria-modal="true" aria-label=${`Boss battle with ${B.name}`}>
    <div class="room-top">
      <button class="iconbtn" onClick=${() => (live ? setAskExit(true) : onExit())} aria-label=${live ? 'Leave the battle' : 'Close'}><${Icon} n="close" /></button>
      <b style="flex:1">Boss battle · ${st.city}</b>
      ${live ? html`<span class="qscore num" aria-label=${`${B.name} reaches the blomma in ${mmss(T - el)}`}>${mmss(T - el)}</span>` : html`<span class="chip">${L.id}</span>`}
    </div>
    <div class="room-body"><div class="room-inner">${body}</div></div>
    ${askExit ? html`<${Confirm} title="Leave the battle?" text=${`It counts as a try, and ${B.name} gets a little slower.`} yes="Leave" no="Keep going" danger onYes=${leave} onNo=${() => setAskExit(false)} />` : null}
  </div>`;
}

/* ---------- where bosses show up: Home, the city sheet and Practice */
function BossCard({ s, sid, startAction, openStop }) {
  const B = BOSSES[sid], st = STOPS[sid], L = LEVELS[LEVEL_INDEX[sid]], op = bossOpens(sid), tries = bossRec(s, sid).tries || 0;
  return html`<section class="card cont bosscard" aria-label="Boss battle">
    <div class="bosscard-top"><${NpcBee} npc=${B} s=${76} />
      <div class="tx"><div class="eyebrow">Boss battle · ${st.city} · ${L.id}</div><h2 class="display">${B.name} guards the road</h2></div></div>
    <p class="theme">Beat ${B.name} to travel on${op ? ` to ${op.city}` : ''}: answer ${BOSS.replies} replies, then type the motto before ${B.name} reaches the blomma.</p>
    ${tries ? html`<p class="muted bosscard-tries">${tries} ${tries === 1 ? 'try' : 'tries'} so far. ${B.name} gets a little slower each time.</p>` : null}
    <div class="row"><button class="btn primary" onClick=${() => startAction({ type: 'boss', sid })}><${Icon} n="crown" s=${19} />Battle ${B.name}</button>
      <button class="linkbtn" onClick=${() => openStop(sid)}>About ${st.city}</button></div>
  </section>`;
}
function BossRow({ s, sid, start, next }) {
  const B = BOSSES[sid], st = STOPS[sid], op = bossOpens(sid), won = bossWon(s, sid), ready = bossReady(s, sid), open = bossClear(s, sid);
  return html`<button class=${cx('lessonrow bossrow', next && 'next')} disabled=${!ready} onClick=${() => start({ type: 'boss', sid })}>
    <span class="li npc-li"><${NpcBee} npc=${B} s=${36} /></span>
    <span class="tx"><b>${B.name} <span class="faint" style="font-weight:700">· Boss bee</span></b>
      <span>${won ? 'Beaten. Rematch any time, just for fun.' : !ready ? `Finish “Respond” in ${st.city} to face ${B.name}.` : open ? `Your road is open already. Beat ${B.name} for ${KM.boss} km and the badge.` : `Beat ${B.name} to travel on${op ? ` to ${op.city}` : ''}, and win ${KM.boss} km.`}</span></span>
    ${won ? html`<span class="chip moss"><${Icon} n="check" s=${14} w=${3} />Beaten</span>` : html`<${Icon} n=${ready ? 'crown' : 'lock'} />`}
  </button>`;
}
function BossList({ s, start, openStop }) {
  const list = Object.keys(BOSSES).filter(sid => stopOpen(s, sid)), all = Object.keys(BOSSES).length + 1;
  const won = Object.keys(BOSSES).filter(sid => bossWon(s, sid)).length + (climbWon(s) ? 1 : 0);
  return html`<section class="card" style="margin-top:16px">
    <div class="sec-head"><h2 class="display">Boss bees</h2><span class="chip glow num">${won}/${all}</span></div>
    <p class="muted sec-sub">Each safehouse has a boss who guards the road out: beat them for ${KM.boss} km each, or rematch for fun. The queen waits on top of Kebnekaise.</p>
    ${list.map(sid => html`<${BossRow} s=${s} sid=${sid} start=${start} next=${false} />`)}
    ${Object.keys(BOSSES).filter(sid => !stopOpen(s, sid)).length ? html`<p class="faint" style="font-size:13px;margin:8px 0">More bosses wait further up the road.</p>` : null}
    <${ClimbRow} s=${s} start=${start} next=${false} />
  </section>`;
}
