/* ================= Surra UI: NPC bees: Bettan's first race (onboarding) and the boss battles at the safehouses ================= */

/* ---------- a bee with character: Bettan wears a flower, the bosses wear a crown */
function NpcBee({ npc, s = 40 }) {
  const boss = !!npc && npc.id !== 'bettan';
  return html`<svg width=${s} height=${s} viewBox="-17 -20 34 34" class=${cx('bee npc', boss && 'boss', npc && npc.tint && 'tint-' + npc.tint)} aria-hidden="true">
    <${BeeShape} />
    <g class="bee-bob">${boss ? html`<path class="crown" d="M4.4 -7.2l-1-6.4 3.2 2.5 2.6-4.2 2.6 4.2 3.2-2.5-1 6.4z" />`
      : html`<g class="bow"><circle cx="6.6" cy="-6.9" r="2.2" /><circle cx="10.6" cy="-7.6" r="2.2" /><circle class="mid" cx="8.6" cy="-7.2" r="1.3" /></g>`}</g>
  </svg>`;
}

/* ---------- onboarding: a first race against Bettan, one short sentence at your level */
function IntroRace({ level, result, onResult, onNext }) {
  const s = useApp();
  const [sv, en] = introText(level), text = typeClean(sv), cps = ((BETTAN.wpm[level] || 13) * 5) / 60;
  const [phase, setPhase] = useState(result && !result.skipped ? 'done' : 'ready'); // ready | countdown | race | done
  const [goAt, setGoAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [view, setView] = useState({ me: result && result.won ? 1 : 0, npc: result && !result.won && !result.skipped ? 1 : 0 });
  const R = useRef({ me: 0, npc: 0, last: 0, over: false });
  const end = (won, r) => {
    if (R.current.over) return;
    R.current.over = true;
    setView({ me: won ? 1 : R.current.me, npc: R.current.npc });
    setPhase('done'); sfx(won ? 'level' : 'done');
    onResult({ won, wpm: r ? r.wpm : 0, ms: r ? r.ms : Date.now() - goAt });
  };
  useEffect(() => {
    if (phase !== 'countdown' && phase !== 'race') return;
    const t = setInterval(() => {
      const n = Date.now(); setNow(n);
      if (phase !== 'race' || R.current.over) return;
      const dt = R.current.last ? n - R.current.last : 0; R.current.last = n;
      R.current.npc = npcStep(R.current.npc, dt, cps, text.length, true, R.current.me);
      setView({ me: R.current.me, npc: R.current.npc });
      if (R.current.npc >= 1) end(false, null);
    }, 100);
    return () => clearInterval(t);
  }, [phase]);
  useEffect(() => { if (phase === 'countdown' && goAt && now >= goAt) { R.current.last = Date.now(); setPhase('race'); } }, [now, phase, goAt]);
  const start = () => { R.current = { me: 0, npc: 0, last: 0, over: false }; setView({ me: 0, npc: 0 }); setGoAt(Date.now() + 3000); setNow(Date.now()); setPhase('countdown'); };
  const lanes = [
    { id: 'me', name: 'You', me: true, at: view.me, p: { ...s.profile, avatar: s.profile.avatar || 'bee' }, sub: result && result.wpm ? `${result.wpm} wpm` : null },
    { id: 'bettan', name: 'Bettan', npc: BETTAN, at: view.npc, sub: 'Swedish bee' },
  ];
  const cd = Math.ceil((goAt - now) / 1000);
  return html`<div class="onb-race">
    <div class="npc-intro"><${NpcBee} npc=${BETTAN} s=${64} />
      <div class="tx"><b>Race Bettan to the blomma</b>
        <span>Your first rival, a Swedish bee from Malmö. Type the sentence before she reaches the flower.</span></div></div>
    <${BeeTrack} lanes=${lanes} />
    ${phase === 'countdown' ? html`<div class="race-count num" aria-live="assertive">${cd > 0 ? cd : 'Kör!'}</div>` : null}
    ${phase !== 'done' ? html`<${TypeBox} text=${text} easy=${true} live=${phase === 'race'} startAt=${goAt} label="Type the sentence"
        onProgress=${p => { R.current.me = p.chars / p.total; setView({ me: R.current.me, npc: R.current.npc }); }} onDone=${r => end(true, r)} />
      <p class="faint onb-en">Means: ${en}</p>` : null}
    ${phase === 'ready' ? html`<div class="actions"><button class="btn primary wide" onClick=${start}><${Icon} n="flower" s=${20} />Start the race</button>
      <span class="faint onb-hint">Letter help is on: a, o and e count for å, ä and ö.</span>
      <button class="linkbtn" onClick=${() => { onResult({ skipped: true }); onNext(); }}>Skip the race</button></div>` : null}
    ${phase === 'done' && result ? html`<div class=${cx('onb-result', result.won ? 'win' : 'lose')} role="status">
        <b class="display">${result.won ? 'You beat Bettan!' : 'Bettan got there first'}</b>
        <span class="num">${result.won ? `${result.wpm} wpm · ` : ''}+${result.km || 0} km head start</span>
        <p>${result.won ? 'That’s every race in Surra: type the Swedish, word by word. Bettan says lycka till on the road.' : 'She’s had a lot of practice. The pacer bees in Practice are always up for a rematch.'}</p>
      </div>
      <div class="actions"><button class="btn primary wide" onClick=${onNext}>Next<${Icon} n="arrowR" s=${20} /></button>
        <button class="linkbtn" onClick=${start}>Race again</button></div>` : null}
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
  const list = Object.keys(BOSSES).filter(sid => stopOpen(s, sid));
  if (!list.length) return null;
  return html`<section class="card" style="margin-top:16px">
    <div class="sec-head"><h2 class="display">Boss bees</h2><span class="chip glow num">${Object.keys(BOSSES).filter(sid => bossWon(s, sid)).length}/${Object.keys(BOSSES).length}</span></div>
    <p class="muted sec-sub">Each safehouse has a boss who guards the road out. Beat them for ${KM.boss} km each, or rematch for fun.</p>
    ${list.map(sid => html`<${BossRow} s=${s} sid=${sid} start=${start} next=${false} />`)}
    ${Object.keys(BOSSES).filter(sid => !stopOpen(s, sid)).length ? html`<p class="faint" style="font-size:13px;margin-top:8px">More bosses wait further up the road.</p>` : null}
  </section>`;
}
