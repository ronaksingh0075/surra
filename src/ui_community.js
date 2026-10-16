/* ================= Surra UI: players map, player lists, duels and the challenges inbox ================= */
const daysAgo = t => { if (!t) return null; const d = Math.floor((new Date(today()) - new Date(dateStr(new Date(t)))) / 864e5); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`; };
const secs = ms => `${Math.round((ms || 0) / 1000)} s`;
const otherOf = (c, uid) => (c.from === uid ? { name: c.toName, avatar: c.toAvatar, color: c.toColor, stop: c.toStop } : { name: c.fromName, avatar: c.fromAvatar, color: c.fromColor, stop: c.fromStop });

/* ---------- the Players view on the Map tab */
function PlayersMap({ s, go, openPlayers }) {
  const a = ACCT.use(), C = COMM.use(), R = RACE.use(), P = PUSH.use();
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null);
  const ready = a.status === 'ready' && !!a.user && s.owner === a.user.uid;
  const guest = a.status === 'guest' || a.status === 'unverified';
  useEffect(() => {
    if (!ready) return;
    refreshPlayers(); refreshChallenges();
    const t = setInterval(() => { if (document.visibilityState === 'visible') refreshPlayers(); }, 120000);
    return () => clearInterval(t);
  }, [ready]);
  useEffect(() => { if (guest) loadRace(); }, [guest]);
  const joined = onMap(s);
  // people without a confirmed profile see the race too, as anonymous bees: names and challenges come with a profile
  const list = ready ? mapPlayers(s, C.players) : guest ? [...anonPlayers(R.counts), { uid: 'me', name: profileName(s), avatar: s.profile.avatar, color: s.profile.color, stop: currentStop(s), xp: s.xp, me: true, anon: true }] : [];
  const others = list.filter(p => !p.me), near = others.filter(p => Math.abs(ORDER.indexOf(p.stop) - mapIdx(s)) <= DUEL.range).length;
  const join = async () => {
    setBusy(true); setErr(null);
    try { await joinMap(); toast(`You're on the map in ${STOPS[mapStop(S())].city}`, 'users'); }
    catch (e) { setErr("Couldn't join right now. Check your connection and try again."); }
    setBusy(false);
  };
  const total = R.total || 0;
  let card = null;
  if (a.status === 'guest') card = { t: total ? `${total === 1 ? 'One learner is' : `${total} learners are`} racing to Kiruna` : 'See who else is on the road', p: 'Create a free profile to see who they are, join the map and challenge people near you.', b: ['Create a free profile', () => go({ name: 'account' })] };
  else if (a.status === 'unverified') card = { t: 'Confirm your email first', p: `Once your email is confirmed you can see who's on the road${total ? ` (${total} so far)` : ''}, join the map and send challenges.`, b: ['Open your profile', () => go({ name: 'account' })] };
  else if (a.status === 'loading') card = { t: 'Connecting…', p: 'Looking for other players.' };
  else if (a.status === 'unavailable') card = { t: "Can't reach Surra right now", p: 'The players map needs a connection. Your own journey works offline.' };
  else if (a.status === 'ready' && !ready) card = { t: 'Connecting…', p: 'Loading your profile.' };
  else if (ready && !joined) card = { t: others.length ? `Join ${others.length} player${others.length === 1 ? '' : 's'} on the map` : 'Join the players map', p: 'Other players will see your name, avatar and city, and can challenge you to a duel. You can leave any time in Me.', b: [busy ? 'Joining…' : 'Join the map', join] };
  const ask = ready && joined && P.support === 'ok' && P.loaded && !P.here && P.perm !== 'denied' && !snoozed(s, 'push');
  const askOn = async () => { const r = await enablePush(); if (r === 'on') toast('Challenge alerts are on', 'bell'); else if (r === 'denied') toast('Notifications are blocked for Surra in your settings', 'info'); };
  return html`<div class="mapbox">
    <${ZoomMap} s=${s} players=${list} onCluster=${openPlayers} focus=${{ k: 2.4, sid: ready ? mapStop(s) : currentStop(s) }} />
    ${ready ? html`<div class="pstat" aria-live="polite"><${Icon} n="users" s=${16} />
      <span>${C.error ? "Couldn't load players" : !C.playersAt && C.loading ? 'Loading players…' : others.length ? (joined ? `${others.length} other${others.length === 1 ? '' : 's'} · ${near} near you` : `${others.length} other player${others.length === 1 ? '' : 's'}`) : joined ? 'Just you so far' : 'No players yet'}</span>
      ${C.error ? html`<button class="linkbtn" onClick=${refreshPlayers}>Retry</button>` : joined ? html`<button class="linkbtn" onClick=${shareInvite} aria-label="Invite a friend">Invite</button>` : null}</div>`
      : guest && total ? html`<div class="pstat" aria-live="polite"><${LiveDot} /><span>${total} on the road${R.active && R.active < total ? ` · ${R.active} active this week` : ''}</span></div>` : null}
    ${ask ? html`<div class="pjoin pask" role="region" aria-label="Challenge alerts">
      <b>Get a ping when you're challenged</b><span>A notification when someone challenges you or answers yours. Nothing else unless you turn it on.</span>
      <div class="row"><button class="btn primary small" disabled=${P.busy} onClick=${askOn}><${Icon} n="bell" s=${16} />Turn on alerts</button><button class="linkbtn" onClick=${() => snooze('push')}>Not now</button></div>
    </div>` : null}
    ${joined && s.community.setback ? html`<div class="psetback"><${Icon} n="swords" s=${15} /><span>You're ${s.community.setback === 1 ? 'one city' : `${s.community.setback} cities`} behind your journey after a lost challenge. Each lesson you finish moves you forward again.</span></div>` : null}
    ${card ? html`<div class="pjoin" role="region" aria-label=${card.t}>
      <b>${card.t}</b><span>${card.p}</span>${err ? html`<span class="err">${err}</span>` : null}
      ${card.b ? html`<button class="btn primary small" disabled=${busy} onClick=${card.b[1]}>${card.b[0]}</button>` : null}
    </div>` : null}
  </div>`;
}

/* ---------- who's in a city */
function PlayersSheet({ sid, players, onClose, onChallenge }) {
  const s = useApp(), C = COMM.use(), L = LEVELS[LEVEL_INDEX[sid]];
  if (players.length && players[0].anon) return html`<${Sheet} onClose=${onClose} label=${`Learners in ${STOPS[sid].city}`}><${GuestCity} sid=${sid} n=${players.filter(p => !p.me).length} onClose=${onClose} /><//>`;
  const list = players.slice().sort((a, b) => (b.me ? 1 : 0) - (a.me ? 1 : 0) || b.xp - a.xp);
  return html`<${Sheet} onClose=${onClose} label=${`Players in ${STOPS[sid].city}`}>
    <div class="sheet-head">
      <span class="signbadge pl"><${Icon} n="users" s=${22} /></span>
      <div style="min-width:0"><div class="eyebrow">${L.id} · ${L.region}</div><h2>${STOPS[sid].city}</h2></div>
      <button class="iconbtn close" onClick=${onClose} aria-label="Close"><${Icon} n="close" /></button>
    </div>
    <p class="muted" style="margin:4px 0 12px">${list.length === 1 ? 'One player is here.' : `${list.length} players are here.`} Challenge anyone up to ${DUEL.range} cities from you.</p>
    <div class="plist">
      ${list.map(p => {
        const ch = p.me ? null : canChallenge(s, p, C.challenges);
        return html`<div class=${cx('prow', p.me && 'me')}>
          <${Avatar} p=${p} s=${44} />
          <div class="tx"><b>${p.name}</b><span>${fmtN(p.xp)} XP${p.seen && !p.me ? ` · active ${daysAgo(p.seen)}` : ''}</span>${ch && !ch.ok ? html`<span class="why">${ch.why}</span>` : null}</div>
          ${p.me ? html`<span class="chip glow">You</span>` : html`<button class="btn small primary" disabled=${!ch.ok} onClick=${() => onChallenge(p)} aria-label=${`Challenge ${p.name}`}><${Icon} n="swords" s=${16} />Challenge</button>`}
        </div>`;
      })}
    </div>
  <//>`;
}

/* ---------- a duel: 8 replies, 15 seconds each */
function DuelRoom({ mode, target, challenge, onExit, onDecline }) {
  const s = useApp();
  const keys = useMemo(() => (mode === 'answer' ? challenge.qs : duelKeys(mapStop(S()), target.stop)), []);
  const qs = useMemo(() => keys.map(duelQuestion).filter(Boolean), []);
  const other = mode === 'answer' ? otherOf(challenge, meUid()) : target;
  const [phase, setPhase] = useState('intro'); // intro | play | saving | done | error
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [left, setLeft] = useState(DUEL.perQuestion);
  const [askExit, setAskExit] = useState(false);
  const [res, setRes] = useState(null);
  const R = useRef({ score: 0, ms: 0, t0: 0, lock: false });
  useBodyLock(true);
  useBack(() => (phase === 'play' ? setAskExit(true) : phase === 'saving' ? null : onExit()), !askExit);
  const finish = async () => {
    setPhase('saving');
    const { score, ms } = R.current;
    try {
      if (mode === 'send') { await sendChallenge(target, keys, score, ms); setRes({ score, ms }); }
      else { const r = await answerChallenge(challenge, score, ms); setRes({ score, ms, result: r, city: STOPS[mapStop(S())].city }); }
      setPhase('done'); sfx('done');
    } catch (e) { setRes({ score, ms, err: errCode(e) }); setPhase('error'); }
  };
  const answer = k => {
    const r = R.current; if (r.lock || phase !== 'play') return; r.lock = true;
    const q = qs[i], ok = k >= 0 && q.opts[k].ok;
    r.ms += k >= 0 ? Math.min(DUEL.perQuestion, performance.now() - r.t0) : DUEL.perQuestion;
    if (ok) r.score += 1;
    setPick({ k, ok }); sfx(ok ? 'ok' : 'bad');
    setTimeout(() => { setPick(null); if (i + 1 < qs.length) setI(i + 1); else finish(); }, ok ? 450 : 1150);
  };
  useEffect(() => {
    if (phase !== 'play') return;
    R.current.t0 = performance.now(); R.current.lock = false; setLeft(DUEL.perQuestion);
    const iv = setInterval(() => {
      const l = Math.max(0, DUEL.perQuestion - (performance.now() - R.current.t0)); setLeft(l);
      if (l <= 0) { clearInterval(iv); answer(-1); }
    }, 100);
    return () => clearInterval(iv);
  }, [phase, i]);
  const start = () => { R.current = { score: 0, ms: 0, t0: 0, lock: false }; setI(0); setPhase('play'); };
  const q = qs[i], correct = q ? q.opts.findIndex(o => o.ok) : -1;
  const back = mapIdx(s) > 0 ? STOPS[ORDER[mapIdx(s) - 1]].city : null;
  const stakes = html`<ul class="stakes">
    <li><${Icon} n="trophy" s=${18} /><span><b>Win:</b> you stay where you are and earn +${DUEL.winXp} XP.</span></li>
    <li><${Icon} n="arrowL" s=${18} /><span><b>Lose:</b> ${back ? `your marker drops back to ${back} on the players map.` : 'nothing happens, you are at the start already.'} Your lessons, stars and stamps are never affected.</span></li>
  </ul>`;
  let body;
  if (phase === 'intro') body = html`<div class="results duel-intro">
      <div class="duel-vs"><${Avatar} p=${s.profile} s=${56} /><span class="vs">vs</span><${Avatar} p=${other} s=${56} /></div>
      <h2>${mode === 'send' ? `Challenge ${other.name}` : `${other.name} challenged you`}</h2>
      <p class="muted" style="max-width:46ch">${mode === 'send'
        ? `You'll both answer the same ${DUEL.questions} replies, ${DUEL.perQuestion / 1000} seconds each. You play first, then ${other.name} has two days to answer. More right answers wins; a faster time breaks a tie.`
        : `${other.name} got ${challenge.fromScore} of ${DUEL.questions} right in ${secs(challenge.fromMs)}. Answer the same ${DUEL.questions} replies, ${DUEL.perQuestion / 1000} seconds each. Beat that score, or match it faster, to win.`}</p>
      ${stakes}
      <div class="actions">
        <button class="btn primary wide" onClick=${start}>${mode === 'send' ? 'Play your round' : 'Play now'}<${Icon} n="arrowR" s=${20} /></button>
        ${mode === 'answer' && onDecline ? html`<button class="btn ghost wide" onClick=${onDecline}>Decline</button>` : html`<button class="btn ghost wide" onClick=${onExit}>Not now</button>`}
      </div>
    </div>`;
  else if (phase === 'play' && q) body = html`<div key=${q.uid}>
      <div class="say"><div class="avatar" aria-hidden="true">${initialOf(q.who)}</div><div class="bubble" style="flex:1"><div class="eyebrow" style="margin-bottom:4px">${q.who}</div><div class="big">${q.say}</div>${q.cue ? html`<div class="en">${q.cue}</div>` : null}</div></div>
      <div class="opts">${q.opts.map((o, k) => html`<button class=${cx('opt', pick && pick.k === k && (pick.ok ? 'right qfx-ok' : 'wrong qfx-bad'), pick && !pick.ok && k === correct && 'right')} disabled=${!!pick} onClick=${() => answer(k)}><span class="k">${k + 1}</span><span>${o.sv}</span></button>`)}</div>
      ${pick && pick.k < 0 ? html`<p class="muted" style="margin-top:12px;text-align:center">Time's up for this one.</p>` : null}
    </div>`;
  else if (phase === 'saving') body = html`<div class="loadingbox"><span class="spinner" aria-hidden="true"></span><b>${mode === 'send' ? 'Sending your challenge…' : 'Checking the result…'}</b></div>`;
  else if (phase === 'error') body = html`<div class="results">
      <h2>${mode === 'send' ? "Couldn't send it" : "Couldn't save your round"}</h2>
      <p class="muted">You got ${res.score} of ${DUEL.questions} right. Check your connection and try again.</p>
      <div class="actions"><button class="btn primary wide" onClick=${finish}>Try again</button><button class="btn ghost wide" onClick=${onExit}>Close</button></div>
    </div>`;
  else if (phase === 'done' && mode === 'send') body = html`<div class="results">
      <div class="duel-vs"><${Avatar} p=${s.profile} s=${56} /><span class="vs">vs</span><${Avatar} p=${other} s=${56} /></div>
      <div class="eyebrow">Challenge sent</div>
      <h2 class="num">${res.score} of ${DUEL.questions} right</h2>
      <div class="resgrid"><div><b>${secs(res.ms)}</b><span>Time</span></div><div><b>+${res.score * DUEL.perRight}</b><span>XP</span></div><div><b>48 h</b><span>To answer</span></div></div>
      <p class="muted" style="max-width:44ch">${notifierCfg() ? `${other.name} gets a notification if they have alerts on, and has 48 hours to answer.` : `${other.name} will see it next time they open Surra.`} You'll find the result on Home and under Challenges.</p>
      <${PushAsk} text=${`Get a notification when ${other.name} answers`} />
      <div class="actions"><button class="btn primary wide" onClick=${onExit}>Done</button></div>
    </div>`;
  else if (phase === 'done') {
    const r = res.result, theirs = challenge.fromScore;
    body = html`<div class="results">
      <div class=${cx('duel-vs', r)}><${Avatar} p=${s.profile} s=${56} /><span class="vs num">${res.score}–${theirs}</span><${Avatar} p=${other} s=${56} /></div>
      <div class="eyebrow">${r === 'won' ? 'You won' : r === 'lost' ? `${other.name} won` : 'A tie'}</div>
      <h2>${r === 'won' ? 'Snyggt! You stay put' : r === 'lost' ? `Back to ${res.city}` : 'Nobody moves'}</h2>
      <div class="resgrid"><div><b>${secs(res.ms)}</b><span>Your time</span></div><div><b>${secs(challenge.fromMs)}</b><span>${other.name}</span></div><div><b>+${res.score * DUEL.perRight + (r === 'won' ? DUEL.winXp : 0)}</b><span>XP</span></div></div>
      <p class="muted" style="max-width:44ch">${r === 'won' ? `You keep your place in ${res.city}.` : r === 'lost' ? `Your marker on the players map moved back one city. Your lessons and stamps are untouched, and each lesson you finish moves you forward again.` : 'Same score, same time. Remarkable.'}</p>
      <div class="actions"><button class="btn primary wide" onClick=${onExit}>Done</button></div>
    </div>`;
  }
  return html`<div class="room" role="dialog" aria-modal="true" aria-label=${mode === 'send' ? `Challenge ${other.name}` : `Challenge from ${other.name}`}>
    <div class="room-top">
      <button class="iconbtn" onClick=${() => (phase === 'play' ? setAskExit(true) : phase === 'saving' ? null : onExit())} aria-label=${phase === 'play' ? 'Leave challenge' : 'Close'}><${Icon} n="close" /></button>
      ${phase === 'play' ? html`<div class="timer" role="timer" aria-label=${`${Math.ceil(left / 1000)} seconds left`}><i style=${`width:${(left / DUEL.perQuestion) * 100}%`}></i></div><span class="qscore num">${i + 1}/${qs.length}</span>`
        : html`<b style="flex:1">${mode === 'send' ? 'Challenge' : 'Challenge from ' + other.name}</b>`}
    </div>
    <div class="room-body"><div class="room-inner">${body}</div></div>
    ${askExit ? html`<${Confirm} title="Leave the challenge?" text=${mode === 'send' ? 'Nothing is sent until you finish your round.' : 'You can play it later from Challenges, until it expires.'} yes="Leave" no="Keep playing" danger onYes=${onExit} onNo=${() => setAskExit(false)} />` : null}
  </div>`;
}

/* ---------- the inbox */
function ChallengeRow({ c, uid, children, sub }) {
  const o = otherOf(c, uid);
  return html`<div class="prow"><${Avatar} p=${o} s=${40} /><div class="tx"><b>${children}</b><span>${sub}</span></div></div>`;
}
function ChallengesSheet({ onClose, onPlay }) {
  const C = COMM.use(), uid = meUid(), L = challengeLists(C.challenges, uid);
  const [busy, setBusy] = useState(null);
  useEffect(() => { refreshChallenges(true); }, []);
  useEffect(() => { L.unseen.forEach(c => markSeen(c)); }, [L.unseen.map(c => c.id).join()]);
  const act = async (c, fn) => { setBusy(c.id); try { await fn(c); } catch (e) { toast("Couldn't update that challenge. Try again.", 'info'); } setBusy(null); };
  const hours = c => Math.max(1, Math.ceil((DUEL.expireMs - (Date.now() - c.created)) / 3600e3));
  const resultText = c => {
    const o = otherOf(c, uid).name;
    if (c.status === 'declined') return c.from === uid ? `${o} declined your challenge` : `You declined ${o}'s challenge`;
    const r = myResult(c, uid), mine = c.from === uid ? c.fromScore : c.toScore, theirs = c.from === uid ? c.toScore : c.fromScore;
    return r === 'won' ? `You beat ${o} ${mine}–${theirs}` : r === 'lost' ? `${o} beat you ${theirs}–${mine}` : `A tie with ${o}, ${mine}–${theirs}`;
  };
  return html`<${Sheet} onClose=${onClose} label="Challenges">
    <div class="sheet-head">
      <span class="signbadge pl"><${Icon} n="swords" s=${22} /></span>
      <div style="min-width:0"><div class="eyebrow">Players map</div><h2>Challenges</h2></div>
      <button class="iconbtn close" onClick=${onClose} aria-label="Close"><${Icon} n="close" /></button>
    </div>
    ${!C.challenges.length ? html`<p class="muted" style="margin-top:8px">No challenges yet. Open a city on the players map and challenge someone up to ${DUEL.range} cities away.</p>` : null}
    ${L.incoming.length ? html`<div class="section"><div class="eyebrow">Waiting for you</div><div class="plist">
      ${L.incoming.map(c => html`<div class="prow"><${Avatar} p=${otherOf(c, uid)} s=${40} />
        <div class="tx"><b>${c.fromName} challenged you</b><span>${c.fromScore} of ${DUEL.questions} in ${secs(c.fromMs)} · ${hours(c)} h left</span></div>
        <div class="rowbtns"><button class="btn small primary" onClick=${() => onPlay(c)}>Play</button><button class="btn small ghost" disabled=${busy === c.id} onClick=${() => act(c, declineChallenge)}>Decline</button></div></div>`)}
    </div></div>` : null}
    ${L.sent.length ? html`<div class="section"><div class="eyebrow">Sent</div><div class="plist">
      ${L.sent.map(c => html`<div class="prow"><${Avatar} p=${otherOf(c, uid)} s=${40} />
        <div class="tx"><b>${expired(c) ? `${c.toName} didn't answer in time` : `Waiting for ${c.toName}`}</b><span>You got ${c.fromScore} of ${DUEL.questions}${expired(c) ? '' : ` · ${hours(c)} h left`}</span></div>
        <button class="btn small ghost" disabled=${busy === c.id} onClick=${() => act(c, withdrawChallenge)}>${expired(c) ? 'Remove' : 'Withdraw'}</button></div>`)}
    </div></div>` : null}
    ${L.results.length ? html`<div class="section"><div class="eyebrow">Results</div><div class="plist">
      ${L.results.slice(0, 12).map(c => html`<${ChallengeRow} c=${c} uid=${uid} sub=${daysAgo(c.resolvedAt || c.created)}>${resultText(c)}<//>`)}
    </div></div>` : null}
  <//>`;
}

/* ---------- Home: new challenges and fresh results */
function ChallengeCard({ onPlay, onOpen }) {
  const s = useApp(), C = COMM.use(), a = ACCT.use();
  if (a.status !== 'ready' || !onMap(s)) return null;
  const uid = meUid(), L = challengeLists(C.challenges, uid);
  if (L.incoming.length) {
    const c = L.incoming[0];
    return html`<section class="card duelcard" aria-label="Challenge">
      <${Avatar} p=${otherOf(c, uid)} s=${48} />
      <div class="tx"><span class="eyebrow">${L.incoming.length > 1 ? `${L.incoming.length} challenges waiting` : 'New challenge'}</span>
        <b>${c.fromName} challenged you</b><span>They got ${c.fromScore} of ${DUEL.questions} right. Can you beat it?</span>
        <div class="row"><button class="btn primary small" onClick=${() => onPlay(c)}><${Icon} n="swords" s=${16} />Play</button><button class="linkbtn" onClick=${onOpen}>All challenges</button></div></div>
    </section>`;
  }
  if (L.unseen.length) {
    const c = L.unseen[0], r = myResult(c, uid);
    return html`<section class="card duelcard" aria-label="Challenge result">
      <${Avatar} p=${otherOf(c, uid)} s=${48} />
      <div class="tx"><span class="eyebrow">Challenge result</span>
        <b>${c.status === 'declined' ? `${c.toName} declined your challenge` : r === 'won' ? `You beat ${c.toName}!` : r === 'lost' ? `${c.toName} won your challenge` : `A tie with ${c.toName}`}</b>
        <span>${c.status === 'declined' ? 'No harm done. Try someone else nearby.' : `${c.fromScore}–${c.toScore}. ${r === 'won' ? `+${DUEL.winXp} XP and you stay put.` : r === 'lost' ? 'Your marker dropped back one city. A lesson moves you forward again.' : 'Nobody moves.'}`}</span>
        <div class="row"><button class="btn ghost small" onClick=${onOpen}>See challenges</button><button class="linkbtn" onClick=${() => markSeen(c)}>Dismiss</button></div></div>
    </section>`;
  }
  return null;
}

/* ---------- Me: show or hide yourself */
function MapPresenceRow() {
  const a = ACCT.use(), s = useApp();
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null);
  if (a.status !== 'ready') return null;
  const on = onMap(s);
  const set = async v => {
    if (v === on || busy) return;
    setBusy(true); setErr(null);
    try { if (v) await joinMap(); else await leaveMap(); }
    catch (e) { setErr("Couldn't update that. Check your connection and try again."); }
    setBusy(false);
  };
  return html`<div class="setrow"><div class="tx"><b>Players map</b>
      <span>${on ? 'Other players can see your name, avatar and city, and challenge you. Turning this off removes you from the map.' : 'Join to see where other players are and challenge people near you.'}</span>
      ${err ? html`<span class="err">${err}</span>` : null}</div>
    <${Seg} label="Show me on the players map" value=${on} options=${[{ v: true, l: 'On' }, { v: false, l: 'Off' }]} onChange=${set} /></div>`;
}
