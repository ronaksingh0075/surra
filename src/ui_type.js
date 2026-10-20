/* ================= Surra UI: typing box, letter keys, spoken tips, the bee race and race invites ================= */

/* ---------- how a line sounds in everyday speech, and one expert tip */
function SpokenLine({ sv, tip = true }) {
  const s = useApp();
  if (!spokenOn(s)) return null;
  const f = spokenForm(sv), t = tip ? spokenTip(sv) : null;
  if (!f && !t) return null;
  return html`<div class="spoken">
    ${f ? html`<div class="sp-form"><span class="sp-lab"><${Icon} n="chat" s=${14} />How it sounds</span><span class="sv" lang="sv">${f}</span></div>` : null}
    ${t ? html`<div class="sp-tip"><${Icon} n="bulb" s=${15} /><span>${t}</span></div>` : null}
  </div>`;
}

/* ---------- the typing box: word by word, like Typeracer */
function LetterKeys({ onKey, next }) {
  return html`<div class="letterkeys" role="group" aria-label="Swedish letters">
    ${TYPE_KEYS.map(k => html`<button type="button" class=${cx('lkey', next === k && 'next')} aria-label=${`Type ${k}`}
      onPointerDown=${e => e.preventDefault()} onMouseDown=${e => e.preventDefault()} onClick=${() => onKey(k)}>${k}</button>`)}
  </div>`;
}
function TypeBox({ text, easy, live = true, hidden = false, startAt = 0, onProgress, onDone, autoFocus = true, label = 'Type the text' }) {
  const [view, setView] = useState({ at: 0, cur: '' });
  const st = useRef(null);
  const inp = useRef(null);
  if (!st.current || st.current.text !== text) st.current = { text, at: 0, cur: '', keys: 0, errs: 0, t0: 0, done: false };
  useEffect(() => { setView({ at: 0, cur: '' }); }, [text]);
  useEffect(() => { if (live && autoFocus && inp.current) { try { inp.current.focus({ preventScroll: true }); } catch (e) { inp.current.focus(); } } }, [live, text]);
  const elapsed = () => (startAt ? Date.now() - startAt : performance.now() - st.current.t0);
  const apply = raw => {
    const S = st.current; if (S.done || !live) return;
    let v = String(raw).replace(/\n/g, ' '), a = S.at;
    const w0 = wordAt(text, a), wasOk = matchLen(S.cur, w0, easy) === S.cur.length;
    if (v.length > S.cur.length) { S.keys += v.length - S.cur.length; if (!S.t0) S.t0 = performance.now(); }
    for (;;) { // move past every word the input now covers
      const w = wordAt(text, a);
      if (!w || matchLen(v, w, easy) < w.length) break;
      a += w.length; v = v.slice(w.length);
      if (a >= text.length) break;
    }
    const w = wordAt(text, a), m = matchLen(v, w, easy);
    if (v.length > S.cur.length && m < v.length && wasOk) S.errs += 1;
    S.at = a; S.cur = a >= text.length ? '' : v;
    setView({ at: S.at, cur: S.cur });
    const chars = Math.min(text.length, a + (a >= text.length ? 0 : m)), ms = Math.max(1, elapsed());
    if (onProgress) onProgress({ chars, total: text.length, errs: S.errs, keys: S.keys, ms });
    if (a >= text.length && !S.done) {
      S.done = true;
      if (onDone) onDone({ ms, chars: text.length, errs: S.errs, keys: S.keys, wpm: wpmOf(text.length, ms), acc: accOf(S.keys, S.errs) });
    }
  };
  const { at, cur } = view, word = wordAt(text, at), m = matchLen(cur, word, easy), bad = m < cur.length;
  const want = text[at + m] || '', nextKey = TYPE_KEYS.includes(want.toLowerCase()) ? want.toLowerCase() : null;
  const insertKey = k => { const c = want && want.toLowerCase() === k ? want : k; apply(st.current.cur + c); if (inp.current) inp.current.focus(); };
  // the text: what you've typed (shown with the real letters), the slip, the current word and what's left
  const words = []; let i = 0;
  while (i < text.length) {
    const w = wordAt(text, i), start = i, chars = [];
    for (let k = 0; k < w.length; k++) {
      const pos = start + k, ch = text[pos];
      const state = pos < at || (pos >= at && pos < at + m) ? 'ok' : pos >= at + m && pos < at + cur.length && start === at ? 'bad' : 'todo';
      const show = hidden && state !== 'ok' && /\p{L}/u.test(ch) ? '•' : ch;
      chars.push(html`<span class=${'c ' + state}>${show}</span>`);
    }
    words.push(html`<span class=${cx('w', start === at && 'now')}>${chars}</span>`);
    i += w.length;
  }
  const done = at >= text.length;
  return html`<div class=${cx('typebox', bad && 'slip', done && 'done', hidden && 'hidden')}>
    <div class="tb-text" lang="sv" aria-hidden=${hidden ? 'true' : null}>${words}</div>
    <label class="vh" for="type-input">${label}</label>
    <input id="type-input" ref=${inp} class=${cx('tb-input', bad && 'bad')} value=${cur} disabled=${!live || done} lang="sv"
      autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck=${false} inputmode="text" enterkeyhint="next"
      placeholder=${done ? 'Klart!' : live ? (at === 0 && !cur ? 'Börja skriva här…' : '') : 'Get ready…'}
      onInput=${e => apply(e.target.value)} onPaste=${e => e.preventDefault()} onDrop=${e => e.preventDefault()}
      onKeyDown=${e => { if (e.key === 'Enter') { e.preventDefault(); apply(st.current.cur + ' '); } }} />
    ${bad ? html`<p class="tb-slip" role="status">${want ? `Not quite: the next letter is “${want === ' ' ? 'space' : want}”. Delete back to the green part.` : 'Delete back to the green part.'}</p>` : null}
    ${live && !done ? html`<${LetterKeys} onKey=${insertKey} next=${nextKey} />` : null}
  </div>`;
}

/* ---------- a typing question inside a lesson */
function TypeQ({ q, s, check, phase }) {
  const easy = !q.strict && letterEasy(s), hear = q.mode === 'hear';
  useEffect(() => { if (hear) { const t = setTimeout(() => speak(q.sv), 350); return () => clearTimeout(t); } }, [q.uid]);
  const done = r => { const allow = Math.max(1, Math.floor(q.sv.length / 25)); check(r.errs <= allow, { type: r }); };
  return html`<div class="qtitle"><${Icon} n="keyboard" s=${18} />${hear ? 'Listen and type what you hear' : q.strict ? 'Type it with the right letters' : 'Type it in Swedish'}</div>
    <div class="bubble typeprompt">
      <div class="big">${hear ? html`<span class="muted">${q.en}</span>` : q.en}</div>
      ${hear ? html`<div class="acts"><${SayBtn} text=${q.sv} /><span class="faint" style="font-size:13px">Tap to hear it again (twice for slow)</span></div>` : null}
    </div>
    <${TypeBox} key=${q.uid} text=${q.sv} easy=${easy} hidden=${hear} live=${phase === 'answer'} onDone=${done} label=${hear ? 'Type what you hear' : 'Type the Swedish'} />
    <p class="faint typehint">${q.strict ? 'Here the letters count: a, o and e won’t do for å, ä and ö.' : easy ? 'Letter help is on: a, o and e count for å, ä, ö and é. Change it in Settings.' : 'Exact letters: å, ä, ö and é count. Change it in Settings.'}</p>`;
}

/* ---------- the race track: bees flying to the blomma */
function RaceBee({ lane }) {
  if (lane.npc) return html`<${NpcBee} npc=${lane.npc} s=${36} />`;
  if (lane.p && lane.p.avatar) return html`<${Avatar} p=${lane.p} s=${28} />`;
  return html`<svg width="34" height="34" viewBox="-16 -16 32 32" class=${cx('bee', lane.tint)} aria-hidden="true"><${BeeShape} /></svg>`;
}
function BeeTrack({ lanes }) {
  return html`<div class="beetrack" role="img" aria-label=${lanes.map(l => `${l.name}: ${Math.round(Math.min(1, l.at) * 100)} percent`).join(', ')}>
    <div class="bt-head"><span>Start</span><span class="bt-goal"><${Icon} n="flower" s=${15} />Blomma</span></div>
    ${lanes.map(l => html`<div class=${cx('lane', l.me && 'me', l.at >= 1 && 'done', l.zoom && 'zoom')} key=${l.id}>
      <div class="lane-name"><b>${l.name}</b>${l.sub ? html`<span>${l.sub}</span>` : null}</div>
      <div class="lane-road"><span class="lane-flower"><${Icon} n="flower" s=${20} /></span>
        ${l.trail ? html`<span class="lane-trail" style=${`width:${(Math.min(1, Math.max(0, l.at)) * 100).toFixed(2)}%`}></span>` : null}
        <span class="lane-bee" style=${`left:${(Math.min(1, Math.max(0, l.at)) * 100).toFixed(2)}%`}><${RaceBee} lane=${l} /></span></div>
    </div>`)}
  </div>`;
}
const raceSecs = ms => `${(Math.max(0, ms) / 1000).toFixed(1)} s`;
const mmss = ms => { const t = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(t / 60)}:${pad2(t % 60)}`; };

/* ---------- a race: against the pacer bees, or live against a player in your city */
function RaceRoom({ mode, target, race, onExit, onAgain }) { // mode: 'bees' | 'host' | 'guest'
  const s = useApp(), uid = meUid();
  const level = mode === 'bees' ? STOPS[currentStop(S())].level : STOPS[(race && race.stop) || mapStop(S())].level;
  const [phase, setPhase] = useState(mode === 'bees' ? 'ready' : mode === 'host' ? 'invite' : 'joining');
  const [R, setR] = useState(race || null);
  const [beeText] = useState(() => raceTextIndex(level));
  const textN = mode === 'bees' ? beeText : R ? R.text : 0, text = raceText(textN);
  const [goAt, setGoAt] = useState(0); // Date.now() when typing starts
  const [now, setNow] = useState(Date.now());
  const [me, setMe] = useState({ chars: 0 });
  const [mine, setMine] = useState(null);
  const [result, setResult] = useState(null);
  const [askExit, setAskExit] = useState(false);
  const [err, setErr] = useState('');
  const off = useRef(0), sent = useRef(-1), finishSent = useRef(false), alive = useRef(true), meChars = useRef(0);
  meChars.current = me.chars;
  const side = R ? raceSide(R, uid) : mode === 'host' ? 'a' : 'b';
  const rival = R ? raceRival(R, side) : target || {};
  const other = side === 'a' ? 'b' : 'a';
  const pace = PACERS[level] || PACERS.A2, easy = true;
  useBodyLock(true);
  useEffect(() => () => { alive.current = false; }, []);
  const live = mode !== 'bees';
  useEffect(() => { // this room settles its own race; the background check leaves it alone
    if (!live || !R) return;
    const id = R.id; rc.live = id;
    return () => { if (rc.live === id) rc.live = null; };
  }, [R && R.id]);
  const running = ['countdown', 'race', 'finish'].includes(phase) || (phase === 'waiting' && live);
  useEffect(() => { // a clock for the countdown and the bees
    if (!running) return;
    const t = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(t);
  }, [running]);
  useEffect(() => { if (phase === 'countdown' && goAt && now >= goAt) setPhase('race'); }, [now, phase, goAt]);
  // ---- live: start the race
  useEffect(() => {
    if (phase === 'invite') {
      (async () => {
        try {
          const { id, sent: t } = await createRace(target);
          const r = await getRace(id);
          if (!alive.current) return;
          off.current = clockOffset(r && r.created, t); setR(r); setPhase('waiting');
        } catch (e) { setErr(errCode(e)); setPhase('error'); }
      })();
    }
    if (phase === 'joining') {
      (async () => {
        try {
          const fresh = await getRace(race.id);
          if (!fresh || fresh.status !== 'open' || !inviteOpen(fresh)) { setR(fresh); setPhase('gone'); return; }
          const { sent: t } = await acceptRace(fresh);
          const r = await getRace(race.id);
          if (!alive.current) return;
          off.current = clockOffset(r.joined, t); setR(r);
          RACES.set({ ...RACES.get(), invites: RACES.get().invites.filter(x => x.id !== r.id) });
          setGoAt(r.joined + LRACE.leadMs - off.current); setPhase('countdown');
        } catch (e) { setErr(errCode(e)); setPhase('error'); }
      })();
    }
  }, [phase]);
  // ---- live: keep in step (about once a second)
  useEffect(() => {
    if (!live || !R || !['waiting', 'countdown', 'race', 'finish'].includes(phase)) return;
    let stop = false, busy = false;
    const step = async () => {
      if (busy || stop) return; busy = true;
      try {
        if (phase === 'race' && meChars.current !== sent.current && !finishSent.current) { const c = meChars.current; sent.current = c; await sendRaceProgress(R, side, c, null); }
        const r = await getRace(R.id);
        if (stop || !alive.current || !r) return;
        setR(r);
        if (phase === 'waiting') {
          if (r.status === 'on' && r.joined) { setGoAt(r.joined + LRACE.leadMs - off.current); setPhase('countdown'); }
          else if (r.status === 'off') setPhase('declined');
          else if (Date.now() + off.current - r.created > LRACE.inviteMs) { closeRace(r); setPhase('expired'); }
        }
        if (phase === 'race' || phase === 'finish') {
          const o = raceOutcome(r, Date.now() + off.current);
          if (o) { const res = applyRace(r, o); setResult({ ...res, outcome: o }); setPhase('done'); sfx(res && res.r === 'won' ? 'level' : 'done'); }
        }
      } catch (e) { /* try again next second */ }
      finally { busy = false; }
    };
    step();
    const t = setInterval(step, phase === 'waiting' ? 1500 : LRACE.tickMs);
    return () => { stop = true; clearInterval(t); };
  }, [phase, R && R.id]);
  // ---- finishing
  const onDone = r => {
    setMine(r);
    if (mode === 'bees') {
      const beat = pace.filter(w => (text.length / (w * 5)) * 60000 > r.ms).length, place = pace.length - beat + 1;
      let km = 0;
      update(st => { km = addDetour(st, 1 + beat); st.stats.bestWpm = Math.max(st.stats.bestWpm || 0, r.wpm); st.stats.typed = (st.stats.typed || 0) + 1; });
      setResult({ place, beat, km }); setPhase('done'); sfx(place === 1 ? 'level' : 'done');
      return;
    }
    finishSent.current = true; setPhase('finish');
    const send = (n = 0) => sendRaceProgress(R, side, text.length, r.ms).catch(() => { if (n < 4 && alive.current) setTimeout(() => send(n + 1), 800); });
    send();
  };
  const startBees = () => { setGoAt(Date.now() + 3200); setNow(Date.now()); setPhase('countdown'); };
  const leave = () => {
    if (live && R && phase === 'waiting') closeRace(R);
    onExit();
  };
  useBack(() => (['race', 'countdown', 'finish'].includes(phase) && live ? setAskExit(true) : leave()), !askExit);
  // ---- the lanes
  const el = goAt ? Math.max(0, now - goAt) : 0;
  const mineAt = mine ? 1 : me.chars / text.length;
  const lanes = [{ id: 'me', name: 'You', me: true, at: phase === 'ready' ? 0 : mineAt, p: { ...s.profile, avatar: s.profile.avatar || 'bee' }, sub: mine ? `${mine.wpm} wpm` : null }];
  if (mode === 'bees') pace.forEach((w, k) => {
    const cps = (w * 5) / 60000, wob = 1 + 0.08 * Math.sin(el / 1700 + k * 1.9);
    lanes.push({ id: 'b' + k, name: PACER_NAMES[k][0], sub: `${w} wpm`, tint: 't' + k, at: phase === 'ready' || phase === 'countdown' ? 0 : Math.min(1, (el * cps * wob) / text.length) });
  });
  else if (R) {
    const t = R['t' + other];
    lanes.push({ id: 'rival', name: rival.name || 'Rival', p: { avatar: rival.avatar || 'bee', color: rival.color || 'fjord', name: rival.name }, at: t != null ? 1 : (R['p' + other] || 0) / (R.len || text.length), sub: t != null ? `${wpmOf(R.len || text.length, t)} wpm` : null });
  }
  // ---- what to show
  const stake = live && R ? raceStakeAt(R.stop) : 0;
  const head = html`<div class="room-top">
    <button class="iconbtn" onClick=${() => (['race', 'countdown', 'finish'].includes(phase) && live ? setAskExit(true) : leave())} aria-label="Leave the race"><${Icon} n="close" /></button>
    <b style="flex:1">${mode === 'bees' ? 'Bee race' : `Race vs ${rival.name || 'a player'}`}</b>
    ${phase === 'race' ? html`<span class="qscore num">${raceSecs(el)}</span>` : html`<span class="chip">${level}</span>`}
  </div>`;
  let body;
  if (phase === 'ready') body = html`<div class="results race-intro">
      <span class="qi race-qi"><${Icon} n="flower" s=${38} /></span>
      <h2>Bee race</h2>
      <p class="muted" style="max-width:46ch">Race three pacer bees to the blomma. Type the paragraph word by word: a space after each word moves you on, and a slip has to be fixed first.</p>
      <${BeeTrack} lanes=${lanes} />
      <div class="actions"><button class="btn primary wide" onClick=${startBees}>Start<${Icon} n="arrowR" s=${20} /></button><button class="btn ghost wide" onClick=${onExit}>Back</button></div>
    </div>`;
  else if (phase === 'invite' || phase === 'joining') body = html`<div class="loadingbox"><span class="spinner" aria-hidden="true"></span><b>${phase === 'invite' ? `Inviting ${rival.name}…` : `Joining ${rival.name}'s race…`}</b></div>`;
  else if (phase === 'waiting') {
    const left = R ? LRACE.inviteMs - (Date.now() + off.current - R.created) : LRACE.inviteMs;
    body = html`<div class="results race-wait">
      <div class="duel-vs"><${Avatar} p=${s.profile} s=${56} /><span class="vs">vs</span><${Avatar} p=${rival} s=${56} /></div>
      <h2>Waiting for ${rival.name}</h2>
      <p class="muted" style="max-width:44ch">${isOnline(target) ? `${rival.name} is in the app right now.` : `${rival.name} gets a notification if alerts are on.`} The race starts the moment they join. ${stake ? `${stake} km to the winner.` : 'A friendly race: this is a safehouse.'}</p>
      <div class="race-clock num" aria-live="polite">${mmss(left)}</div>
      <div class="actions"><button class="btn ghost wide" onClick=${() => { if (R) closeRace(R); onAgain && onAgain({ mode: 'bees' }); }}>Race the bees instead</button><button class="btn ghost wide" onClick=${leave}>Cancel</button></div>
    </div>`;
  }
  else if (['declined', 'expired', 'gone', 'error'].includes(phase)) body = html`<div class="results">
      <h2>${phase === 'declined' ? `${rival.name} can't race right now` : phase === 'expired' ? `${rival.name} didn't join in time` : phase === 'gone' ? 'This race has ended' : "Couldn't start the race"}</h2>
      <p class="muted" style="max-width:44ch">${phase === 'error' ? (err === 'permission-denied' ? 'Live races need the latest version of Surra on both phones, in the same city.' : 'Check your connection and try again.') : 'The pacer bees are always up for it.'}</p>
      <div class="actions"><button class="btn primary wide" onClick=${() => onAgain && onAgain({ mode: 'bees' })}>Race the bees</button><button class="btn ghost wide" onClick=${onExit}>Close</button></div>
    </div>`;
  else if (phase === 'countdown' || phase === 'race' || phase === 'finish') {
    const cd = Math.ceil((goAt - now) / 1000);
    body = html`<div class="race-live">
      <${BeeTrack} lanes=${lanes} />
      ${phase === 'countdown' ? html`<div class="race-count num" aria-live="assertive">${cd > 3 ? 'Klara…' : cd > 0 ? cd : 'Kör!'}</div>` : null}
      ${phase === 'finish' ? html`<div class="notice"><${Icon} n="flower" /><span>You reached the blomma in ${raceSecs(mine.ms)}. Waiting for ${rival.name}…</span></div>` : null}
      <${TypeBox} text=${text} easy=${easy} live=${phase === 'race'} startAt=${goAt} onProgress=${p => setMe({ chars: p.chars })} onDone=${onDone} label="Type the paragraph" />
    </div>`;
  }
  else if (phase === 'done' && mode === 'bees') body = html`<div class="results">
      <div class="eyebrow">${result.place === 1 ? 'First to the blomma!' : `Place ${result.place} of ${pace.length + 1}`}</div>
      <h2 class="num">${mine.wpm} wpm</h2>
      <${BeeTrack} lanes=${lanes} />
      <div class="resgrid"><div><b>${raceSecs(mine.ms)}</b><span>Time</span></div><div><b>${mine.acc}%</b><span>Accuracy</span></div><div><b>+${result.km}</b><span>km</span></div></div>
      <p class="muted" style="max-width:44ch">${result.beat === pace.length ? 'You beat every bee, even the wasp.' : result.beat ? `You beat ${result.beat === 1 ? 'one bee' : `${result.beat} bees`}. ${PACER_NAMES[pace.length - result.beat - 1] ? `${PACER_NAMES[pace.length - result.beat - 1][0]} is next.` : ''}` : 'The bees won this one. Try again?'}${result.km ? '' : ' Today\'s practice kilometres are used up.'}</p>
      <div class="actions"><button class="btn primary wide" onClick=${() => onAgain && onAgain({ mode: 'bees' })}>Race again</button><button class="btn ghost wide" onClick=${onExit}>Done</button></div>
    </div>`;
  else if (phase === 'done') {
    const r = result || {}, theirT = R && R['t' + other];
    body = html`<div class="results">
      <div class=${cx('duel-vs', r.r)}><${Avatar} p=${s.profile} s=${56} /><span class="vs">vs</span><${Avatar} p=${rival} s=${56} /></div>
      <div class="eyebrow">${r.r === 'won' ? 'You won' : r.r === 'lost' ? `${rival.name} won` : r.r === 'tie' ? 'A dead heat' : 'Nobody finished'}</div>
      <h2>${r.r === 'won' ? 'First to the blomma!' : r.r === 'lost' ? 'So close' : r.r === 'tie' ? 'Exactly the same time' : 'Race over'}</h2>
      <${BeeTrack} lanes=${lanes} />
      <div class="resgrid"><div><b>${mine ? `${mine.wpm}` : '–'}</b><span>Your wpm</span></div><div><b>${theirT ? wpmOf(R.len, theirT) : '–'}</b><span>${rival.name}</span></div><div><b>${r.km > 0 ? '+' : ''}${r.km || 0}</b><span>km</span></div></div>
      <div class="actions"><button class="btn primary wide" onClick=${() => onAgain && onAgain({ mode: 'host', target: { ...rival, stop: R.stop } })}>Race ${rival.name} again</button><button class="btn ghost wide" onClick=${onExit}>Done</button></div>
    </div>`;
  }
  return html`<div class="room race" role="dialog" aria-modal="true" aria-label=${mode === 'bees' ? 'Bee race' : 'Typing race'}>${head}
    <div class="room-body"><div class="room-inner">${body}</div></div>
    ${askExit ? html`<${Confirm} title="Leave the race?" text=${`If ${rival.name || 'your rival'} reaches the blomma, it counts as a loss.`} yes="Leave" no="Keep racing" danger onYes=${onExit} onNo=${() => setAskExit(false)} />` : null}
  </div>`;
}

/* ---------- Home: someone in your city wants to race */
function RaceInviteCard({ onJoin }) {
  const R = RACES.use(), a = ACCT.use();
  const [, tick] = useState(0);
  useEffect(() => { if (!R.invites.length) return; const t = setInterval(() => tick(x => x + 1), 1000); return () => clearInterval(t); }, [R.invites.length]);
  if (a.status !== 'ready') return null;
  const r = R.invites.find(x => inviteOpen(x));
  if (!r) return null;
  return html`<section class="card duelcard raceinvite" aria-label="Typing race invite">
    <${Avatar} p=${{ avatar: r.aa, color: r.ac, name: r.an }} s=${48} />
    <div class="tx"><span class="eyebrow"><${LiveDot} />Typing race · ${STOPS[r.stop].city}</span>
      <b>${r.an} wants to race you now</b><span>${raceStakeAt(r.stop) ? `${raceStakeAt(r.stop)} km to the winner.` : 'A friendly race in a safehouse.'} ${mmss(LRACE.inviteMs - (Date.now() - r.created))} left to join.</span>
      <div class="row"><button class="btn primary small" onClick=${() => onJoin(r)}><${Icon} n="flower" s=${16} />Join the race</button><button class="linkbtn" onClick=${() => closeRace(r)}>Not now</button></div></div>
  </section>`;
}
