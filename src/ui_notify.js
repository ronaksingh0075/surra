/* ================= Surra UI: prompts that bring people onto the road, rivals, notification settings, what's new ================= */
function LiveDot() { return html`<span class="livedot" aria-hidden="true"></span>`; }
function RaceStack({ n, s = 34 }) {
  const shown = Math.max(1, Math.min(4, n || 1)), colors = Object.keys(AV_COLORS);
  return html`<span class="racestack" aria-hidden="true">
    ${Array.from({ length: shown }, (_, i) => html`<${Avatar} p=${{ avatar: 'bee', color: colors[(i * 2 + 1) % colors.length] }} s=${s} />`)}
    ${n > shown ? html`<span class="rs-more" style=${`width:${s}px;height:${s}px`}>+${n - shown > 99 ? 99 : n - shown}</span>` : null}
  </span>`;
}
const cities = n => (n === 1 ? 'one city' : `${n} cities`);
function gapText(d) { return d === 0 ? 'same city as you' : d > 0 ? `${cities(d)} ahead` : `${cities(-d)} behind`; }

/* ---------- Home: the one prompt that matters most right now */
function PromptCard({ s, go }) {
  const a = ACCT.use(), P = PUSH.use(), R = RACE.use();
  const [busy, setBusy] = useState(false), [err, setErr] = useState(null);
  const kind = promptFor(s, a, P);
  useEffect(() => { if (kind === 'signup' || kind === 'join') loadRace(); }, [kind]);
  if (!kind) return null;
  if (kind === 'verify') return html`<section class="card nudge" aria-label="Confirm your email">
      <span class="nudge-i"><${Icon} n="mail" /></span>
      <div class="tx"><b>Confirm your email to start backing up</b><span>We sent a link to ${a.user.email}. Then you can join the players map.</span></div>
      <button class="btn small" onClick=${() => go({ name: 'account' })}>Open</button>
    </section>`;
  const city = STOPS[currentStop(s)].city, near = raceNear(R.counts, ORDER.indexOf(currentStop(s))), total = R.total || 0;
  const nearLine = near ? `${near === 1 ? 'One learner is' : `${near} learners are`} within two cities of ${city} right now.` : '';
  const run = async (fn) => { setBusy(true); setErr(null); try { await fn(); } catch (e) { setErr("Couldn't do that right now. Check your connection and try again."); } setBusy(false); };
  let c;
  if (kind === 'signup') c = {
    vis: html`<${RaceStack} n=${total || 3} />`, eyebrow: total ? html`<${LiveDot} />${total} on the road` : 'Free profile',
    t: total >= 3 ? `Race ${total} learners to Kiruna` : 'Keep your journey safe',
    p: `Create a free profile to back up your progress, appear on the players map and challenge people near you. ${nearLine}`,
    yes: ['Create free profile', () => go({ name: 'account' })], id: 'signup',
  };
  else if (kind === 'join') c = {
    vis: html`<${RaceStack} n=${total || 3} />`, eyebrow: total ? html`<${LiveDot} />${total} on the road` : 'Players map',
    t: total ? `${total === 1 ? 'One learner is' : `${total} learners are`} racing to Kiruna` : 'Be the first on the players map',
    p: `Join the map to see them, climb the standings, challenge anyone up to two cities away and race players in your city. ${nearLine}`,
    yes: [busy ? 'Joining…' : 'Join the map', () => run(async () => { await joinMap(); toast(`You're on the map in ${STOPS[mapStop(S())].city}`, 'users'); })], id: 'join',
  };
  else if (kind === 'push') c = {
    vis: html`<span class="prompt-i"><${Icon} n="bell" s=${24} /></span>`, eyebrow: 'Challenge alerts',
    t: "Know when you're challenged",
    p: 'Get a notification when someone challenges you, answers your challenge or wants a typing race. Nothing else unless you turn it on.',
    yes: [P.busy ? 'One moment…' : 'Turn on alerts', () => run(async () => {
      const r = await enablePush();
      if (r === 'on') toast('Challenge alerts are on', 'bell');
      else if (r === 'denied') setErr('Notifications are blocked for Surra. Allow them in your browser or phone settings, then try again.');
      else if (r === 'error') setErr("Couldn't turn them on. Try again in a moment.");
    })], id: 'push',
  };
  else c = {
    vis: html`<span class="prompt-i"><${Icon} n="bell" s=${24} /></span>`, eyebrow: 'Challenge alerts',
    t: 'Get challenge alerts on your iPhone',
    p: 'Add Surra to your Home Screen first: tap Share, then “Add to Home Screen”. Open Surra from there and turn alerts on in Me.',
    yes: null, id: 'install',
  };
  return html`<section class=${cx('card', 'prompt', 'pr-' + c.id)} aria-label=${c.t}>
    <div class="prompt-top">${c.vis}<span class="eyebrow">${c.eyebrow}</span></div>
    <b class="prompt-t">${c.t}</b>
    <p class="prompt-p">${c.p}</p>
    ${err ? html`<span class="err">${err}</span>` : null}
    <div class="prompt-acts">
      ${c.yes ? html`<button class="btn primary small" disabled=${busy || P.busy} onClick=${c.yes[1]}>${c.yes[0]}</button>` : null}
      <button class="linkbtn" onClick=${() => snooze(c.id)}>${c.yes ? 'Not now' : 'Got it'}</button>
    </div>
  </section>`;
}

/* ---------- Home: where you stand in the race, and who you could challenge or race */
function RivalsCard({ s, go, onChallenge, onRace }) {
  const a = ACCT.use(), C = COMM.use();
  const ready = a.status === 'ready' && onMap(s);
  useEffect(() => { if (ready && Date.now() - (COMM.get().playersAt || 0) > 5 * 60e3) { refreshPlayers(); refreshChallenges(); } }, [ready]);
  if (!ready) return null;
  const list = mapPlayers(s, C.players), me = mapIdx(s), at = p => ORDER.indexOf(p.stop), here = mapStop(s);
  const { ranked, rank, ahead } = standing(list), mine = ranked[rank - 1] || { km: totalKm(s) };
  const rivals = list.filter(p => !p.me && Math.abs(at(p) - me) <= DUEL.range)
    .sort((x, y) => (y.stop === here) - (x.stop === here) || isOnline(y) - isOnline(x) || Math.abs(at(x) - me) - Math.abs(at(y) - me) || (y.seen || 0) - (x.seen || 0)).slice(0, 3);
  const loading = !C.playersAt;
  return html`<section class="card rivals" aria-label="Your place in the race">
    <div class="rivals-head">
      <div class="tx"><span class="eyebrow"><${LiveDot} />On the road · ranked by kilometres</span>
        <b class="display">${loading ? 'Loading the race…' : list.length > 1 ? `You're #${rank} of ${list.length}` : 'Just you so far'}</b>
        <span>${loading ? '' : ahead ? `${ahead.name} is next ahead, ${fmtKm(Math.max(0, ahead.km - mine.km))} in front.` : list.length > 1 ? `You lead the race with ${fmtKm(mine.km)}. Hold your ground!` : 'Invite a friend and race them to Kiruna.'}</span></div>
      <button class="iconbtn" onClick=${() => go({ name: 'players' })} aria-label="Open the players map"><${Icon} n="map" /></button>
    </div>
    ${isSafe(here) ? html`<p class="rivals-safe"><${Icon} n="shield" s=${15} />You're in a safehouse: no challenges in or out of ${STOPS[here].city}.</p>` : null}
    ${!loading && rivals.length ? html`<div class="plist">${rivals.map(p => {
      const ch = canChallenge(s, p, C.challenges), rc = canRace(s, p), stake = stakeFor(here, p.stop);
      return html`<div class=${cx('prow acts', rc.ok && ch.ok && 'two')}><span class="pav"><${Avatar} p=${p} s=${40} />${isOnline(p) ? html`<span class="ponline" aria-hidden="true"></span>` : null}</span>
        <div class="tx"><b>${p.name}</b><span>${STOPS[p.stop].city} · ${gapText(at(p) - me)} · ${fmtKm(p.km)}</span>${ch.ok && stake ? html`<span class="stake">${stake} km at stake</span>` : !ch.ok && !rc.ok ? html`<span class="why">${ch.why}</span>` : null}</div>
        <div class="rowbtns">
          ${rc.ok ? html`<button class=${cx('btn small', ch.ok ? 'ghost' : 'primary')} onClick=${() => onRace(p)} aria-label=${`Typing race with ${p.name}`}><${Icon} n="flower" s=${16} />Race</button>` : null}
          ${ch.ok || !rc.ok ? html`<button class="btn small primary" disabled=${!ch.ok} onClick=${() => onChallenge(p)} aria-label=${`Challenge ${p.name}`}><${Icon} n="swords" s=${16} />Challenge</button>` : null}
        </div></div>`;
    })}</div>` : !loading ? html`<p class="muted rivals-empty">Nobody within two cities of you yet. Finish lessons to catch up with others, or bring a friend along.</p>` : null}
    <div class="rivals-foot"><button class="btn ghost small" onClick=${shareInvite}><${Icon} n="invite" s=${17} />Invite a friend</button>
      <button class="linkbtn" onClick=${() => go({ name: 'players' })}>Players map</button></div>
  </section>`;
}

/* ---------- small asks at the right moment */
function PushAsk({ text }) {
  const a = ACCT.use(), P = PUSH.use();
  const [done, setDone] = useState(null);
  if (done === 'on') return html`<p class="pushask ok" role="status"><${Icon} n="check" s=${17} w=${3} />Alerts are on. We'll let you know.</p>`;
  if (a.status !== 'ready' || P.support !== 'ok' || !P.loaded || P.here || P.perm === 'denied') return null;
  const go = async () => { const r = await enablePush(); setDone(r); if (r === 'denied') toast('Notifications are blocked for Surra in your settings', 'info'); };
  return html`<div class="pushask"><span class="pa-i"><${Icon} n="bell" s=${19} /></span><span class="tx">${text}</span>
    <button class="btn small primary" disabled=${P.busy} onClick=${go}>${P.busy ? '…' : 'Turn on'}</button></div>`;
}
function SignupNudge({ result }) {
  const a = ACCT.use(), R = RACE.use();
  if (BUILD !== 'pwa' || a.status !== 'guest') return null;
  const n = R.total || 0;
  return html`<div class="signnudge">
    <${RaceStack} n=${n || 3} s=${30} />
    <div class="tx"><b>${result.newStamp ? 'Keep this stamp safe' : 'Keep your progress safe'}</b>
      <span>Create a free profile to back it up and race ${n >= 3 ? `${n} other learners` : 'other learners'} on the players map.</span></div>
    <button class="btn small primary" onClick=${() => NAV.go({ name: 'account' })}>Create free profile</button>
  </div>`;
}
function GuestCity({ sid, n, onClose }) {
  const a = ACCT.use();
  return html`<div class="sheet-head">
      <span class="signbadge pl"><${Icon} n="users" s=${22} /></span>
      <div style="min-width:0"><div class="eyebrow">${LEVELS[LEVEL_INDEX[sid]].id} · ${LEVELS[LEVEL_INDEX[sid]].region}</div><h2>${STOPS[sid].city}</h2></div>
      <button class="iconbtn close" onClick=${onClose} aria-label="Close"><${Icon} n="close" /></button>
    </div>
    <div class="guestcity"><${RaceStack} n=${n || 1} s=${40} />
      <p><b>${n === 0 ? "You're the only one here so far." : n === 1 ? 'One learner is here.' : `${n} learners are here.`}</b> ${a.status === 'unverified' ? 'Confirm your email to see who they are and challenge them.' : 'Create a free profile to see who they are, join the race and challenge anyone up to two cities away.'}</p>
      <button class="btn primary wide" onClick=${() => { onClose(); NAV.go({ name: 'account' }); }}>${a.status === 'unverified' ? 'Confirm my email' : 'Create a free profile'}</button></div>`;
}

/* ---------- Me: notification settings */
function NotifyCard({ go }) {
  const a = ACCT.use(), P = PUSH.use(), s = useApp();
  const [err, setErr] = useState(null);
  if (BUILD !== 'pwa' || P.support === 'off' || a.status === 'off') return null;
  const ready = a.status === 'ready' && !!a.user && s.owner === a.user.uid;
  const wrap = body => html`<section class="card notifycard" aria-label="Notifications"><h3 class="cardh"><${Icon} n="bell" s=${19} />Notifications</h3>${body}</section>`;
  if (!ready) return wrap(html`<div class="setrow"><div class="tx"><b>Challenge alerts</b><span>${a.status === 'guest' ? 'Create a free profile to get a notification when someone challenges you.' : a.status === 'unverified' ? 'Confirm your email, then turn on notifications here.' : 'Connecting…'}</span></div>
    ${a.status === 'guest' ? html`<button class="btn small primary" onClick=${() => go({ name: 'account' })}>Create profile</button>` : null}</div>`);
  const doc = P.doc, prefs = { ...PUSH_DEFAULTS, ...((doc && doc.push) || {}) }, devices = ((doc && doc.subs) || []).length, hour = hourOf(doc);
  const act = async fn => { setErr(null); try { await fn(); } catch (e) { setErr("Couldn't save that. Check your connection and try again."); } };
  const on = async () => {
    setErr(null);
    const r = await enablePush();
    if (r === 'denied') setErr('Notifications are blocked for Surra on this device. Allow them in your browser or phone settings, then try again.');
    else if (r === 'error') setErr("Couldn't turn them on. Try again in a moment.");
    else if (r === 'on') toast('Notifications are on for this device', 'bell');
  };
  const deviceTxt = P.support === 'install' ? 'On iPhone and iPad, add Surra to your Home Screen first (Share, then “Add to Home Screen”), open it from there and turn them on here.'
    : P.support === 'no' ? "This browser can't show notifications. Try Chrome, Edge, Firefox or Safari."
    : P.perm === 'denied' ? 'Blocked for Surra on this device. Allow notifications in your browser or phone settings to turn them on.'
    : !P.loaded ? 'Checking…'
    : P.here ? `On for this device${devices > 1 ? ` and ${devices - 1} other${devices > 2 ? 's' : ''}` : ''}.` : devices ? `Off here, on for ${devices === 1 ? 'one other device' : `${devices} other devices`}.` : 'Off. Turn them on to hear about challenges as they happen.';
  const canToggle = P.support === 'ok' && P.loaded && P.perm !== 'denied';
  return wrap(html`
    <div class="setrow"><div class="tx"><b>This device</b><span>${deviceTxt}</span></div>
      ${canToggle ? (P.here ? html`<button class="btn ghost small" disabled=${P.busy} onClick=${() => act(disablePush)}>Turn off</button>` : html`<button class="btn small primary" disabled=${P.busy} onClick=${on}>${P.busy ? 'One moment…' : 'Turn on'}</button>`) : null}</div>
    ${devices || P.here ? html`
      <div class="setrow"><div class="tx"><b>Challenges, races and results</b><span>When someone challenges you or invites you to a typing race, answers your challenge, or a challenge is about to expire.</span></div>
        <${Seg} label="Challenges and results" value=${prefs.duels} options=${[{ v: true, l: 'On' }, { v: false, l: 'Off' }]} onChange=${v => act(() => setPushPref('duels', v))} /></div>
      <div class="setrow"><div class="tx"><b>Practice reminder</b><span>${prefs.streak ? `At ${hourLabel(hour)} on days you haven't practised yet, with how far it is to your next city.` : 'A nudge at a time you choose on days you haven’t practised.'}</span></div>
        <div class="setctl">${prefs.streak ? html`<label class="vh" for="remind-hour">Reminder time</label><select id="remind-hour" class="select" value=${hour} onChange=${e => act(() => setRemindHour(Number(e.target.value)))}>${REMIND_HOURS.map(h => html`<option value=${h} selected=${h === hour}>${hourLabel(h)}</option>`)}</select>` : null}
          <${Seg} label="Practice reminder" value=${prefs.streak} options=${[{ v: false, l: 'Off' }, { v: true, l: 'On' }]} onChange=${v => act(() => setPushPref('streak', v))} /></div></div>
      <div class="setrow"><div class="tx"><b>Rival alerts</b><span>When someone overtakes you in kilometres or joins near you. At most one a day.</span></div>
        <${Seg} label="Rival alerts" value=${prefs.rivals} options=${[{ v: false, l: 'Off' }, { v: true, l: 'On' }]} onChange=${v => act(() => setPushPref('rivals', v))} /></div>
      <p class="faint quiet">Alerts wait until morning if they arrive between 22:00 and 08:00, except a reminder at the time you picked.</p>` : null}
    ${err ? html`<span class="err">${err}</span>` : null}`);
}
function InviteRow() {
  const a = ACCT.use();
  if (BUILD !== 'pwa' || a.status !== 'ready') return null;
  return html`<div class="setrow"><div class="tx"><b>Invite a friend</b><span>Send a link to someone learning Swedish and race them to Kiruna. When they join, you'll hear about it.</span></div>
    <button class="btn ghost small" onClick=${shareInvite}><${Icon} n="invite" s=${17} />Invite</button></div>`;
}

/* ---------- what's new in this version */
function NewsSheet({ s, go, onClose }) {
  const a = ACCT.use(), P = PUSH.use();
  const [busy, setBusy] = useState(false);
  const close = () => { markNews(); onClose(); };
  let cta = null;
  if (a.status === 'guest') cta = ['Create a free profile', () => { close(); go({ name: 'account' }); }];
  else if (a.status === 'ready' && commReady() && !onMap(s)) cta = [busy ? 'Joining…' : 'Join the players map', async () => { setBusy(true); try { await joinMap(); toast(`You're on the map in ${STOPS[mapStop(S())].city}`, 'users'); } catch (e) { toast("Couldn't join right now. Try again from the Map tab.", 'info'); } setBusy(false); close(); }];
  else if (a.status === 'ready' && P.support === 'ok' && P.loaded && !P.here && P.perm !== 'denied') cta = [busy ? 'One moment…' : 'Turn on challenge alerts', async () => { setBusy(true); const r = await enablePush(); setBusy(false); if (r === 'on') toast('Challenge alerts are on', 'bell'); close(); }];
  return html`<${Sheet} onClose=${close} label="What's new in Surra">
    <div class="sheet-head">
      <span class="signbadge pl"><${Icon} n="sparkle" s=${22} /></span>
      <div style="min-width:0"><div class="eyebrow">Surra ${NEWS.id}</div><h2>What's new</h2></div>
      <button class="iconbtn close" onClick=${close} aria-label="Close"><${Icon} n="close" /></button>
    </div>
    <ul class="news">${NEWS.since(s.settings.news).map(it => html`<li><span class="news-i"><${Icon} n=${it.icon} s=${20} /></span><span><b>${it.t}</b><span>${it.d}</span></span></li>`)}</ul>
    <div class="actions news-acts">
      ${cta ? html`<button class="btn primary wide" disabled=${busy} onClick=${cta[1]}>${cta[0]}<${Icon} n="arrowR" s=${18} /></button>` : null}
      <button class=${cx('btn', 'wide', cta ? 'ghost' : 'primary')} onClick=${close}>${cta ? 'Maybe later' : 'Got it'}</button>
    </div>
  <//>`;
}
