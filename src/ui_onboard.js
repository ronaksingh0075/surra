/* ================= Surra UI: joining the race after the queen, and the guide to the journey ahead =================
   After losing to the queen, a new player creates a profile to join the race to beat her (required: the journey starts
   straight away and the email can be confirmed later; offline, they start anyway and are asked again once they're
   back online). Then a short guide shows what lies ahead, page by page: the road, real conversations, culture, rivals,
   and the boss bees up to the queen on Kebnekaise. */

/* ---------- joining the race: create a profile (or sign in) */
function JoinRace({ raced, later, onDone, onOffline }) {
  const s = useApp(), a = ACCT.use(), race = RACE.use();
  const [mode, setMode] = useState('create'); // create | signin | reset
  const [name, setName] = useState(s.profile.name || ''), [email, setEmail] = useState(''), [pw, setPw] = useState('');
  const [slow, setSlow] = useState(false);
  const B = useBusy();
  const done = useRef(false);
  const finish = kind => { if (!done.current) { done.current = true; onDone(kind); } };
  // already signed in (or profiles aren't part of this version): nothing to do here
  useEffect(() => { if (['off', 'ready', 'unverified'].includes(a.status) && !B.busy) finish(a.status === 'off' ? 'off' : 'account'); }, [a.status]);
  useEffect(() => { if (a.status !== 'loading') return; const t = setTimeout(() => setSlow(true), 8000); return () => clearTimeout(t); }, [a.status]);
  const tab = m => { setMode(m); B.setErr(''); B.setOk(''); };
  const submit = e => {
    e.preventDefault();
    if (mode === 'reset') {
      if (!EMAIL_RE.test(email.trim())) { B.setErr("That email address doesn't look right."); return; }
      B.run(async () => { await resetPassword(email); B.setOk(`If ${email.trim()} has a Surra profile, a reset link is on its way. Check your inbox and spam folder.`); });
      return;
    }
    if (mode === 'create' && !name.trim()) { B.setErr('Tell us what to call you.'); return; }
    if (!EMAIL_RE.test(email.trim())) { B.setErr("That email address doesn't look right."); return; }
    if (pw.length < 8) { B.setErr('Choose a password with at least 8 characters.'); return; }
    B.run(async () => {
      if (mode === 'create') await signUp(name.trim().slice(0, 40), email, pw); else await signIn(email, pw);
      finish(mode === 'create' ? 'created' : 'signedin');
    });
  };
  const offline = a.status === 'unavailable' || (a.status === 'loading' && slow);
  const total = Number(race && race.total) || 0;
  const head = (s.intro && s.intro.km) || 0;
  const hero = html`<div class="join-hero">
      <${NpcBee} npc=${QUEEN} s=${raced ? 84 : 72} />
      <span class="eyebrow">${later ? 'Back online' : raced ? 'The race to Kebnekaise' : 'The race to Kiruna'}</span>
      <h2 class="display">${raced ? 'Join the race to beat her' : later ? 'Create your profile' : 'Join the race north'}</h2>
      <p class="join-p">${raced ? `Learners from all over are racing north to Kiruna and up Kebnekaise for a rematch with the queen. Create your profile to join them${head ? `, and keep your ${head} km head start` : ''}.`
        : later ? 'Your journey is saved on this device. Create your profile to keep it safe and race the other learners on the road north.'
        : 'Learners from all over are racing to Kiruna, where the queen waits on top of Kebnekaise. Create your profile to join them.'}</p>
      ${total >= 3 ? html`<p class="join-proof"><${LiveDot} /><b class="num">${fmtN(total)}</b> learners are on the road right now</p>` : null}
    </div>`;
  if (offline) return html`<div class="card onb-race night onb-join">
    ${hero}
    <${Notice} kind="err">You're offline, or the sign-in service can't be reached right now.<//>
    <div class="actions">
      <button class="btn primary wide" onClick=${() => { setSlow(false); if (a.status === 'unavailable') initAccount(); }}><${Icon} n="refresh" s=${19} />Try again</button>
      ${onOffline ? html`<button class="linkbtn" onClick=${onOffline}>Start now, and sign up when I'm back online</button>` : null}
    </div>
  </div>`;
  if (a.status === 'loading' || a.status === 'off') return html`<div class="card onb-race night onb-join"><div class="loadingbox"><div class="spinner"></div><b>Connecting…</b></div></div>`;
  return html`<div class="card onb-race night onb-join">
    ${hero}
    ${mode === 'reset' ? null : html`<ul class="perks join-perks">
      <li><${Icon} n="cloud" s=${19} /><span>${head ? 'Your kilometres, stamps and head start, backed up' : 'Your kilometres and stamps, backed up'}</span></li>
      <li><${Icon} n="swords" s=${19} /><span>Race and challenge other learners on the road</span></li>
      <li><${Icon} n="map" s=${19} /><span>Carry on from any phone, tablet or laptop</span></li>
    </ul>`}
    <form class="authform" onSubmit=${submit} novalidate>
      ${mode === 'reset' ? html`<p class="muted">Enter your email and we'll send you a link to choose a new password.</p>` : null}
      ${mode === 'create' ? html`<${Field} id="join-name" label="What should we call you?" hint="Shown to other players if you join the players map."><input id="join-name" value=${name} onInput=${e => setName(e.target.value)} autocomplete="nickname" maxlength="40" required /><//>` : null}
      <${Field} id="join-email" label="Email"><input id="join-email" type="email" inputmode="email" value=${email} onInput=${e => setEmail(e.target.value)} autocomplete="email" autocapitalize="off" spellcheck="false" required /><//>
      ${mode === 'reset' ? null : html`<${Field} id="join-pw" label="Password" hint=${mode === 'create' ? 'At least 8 characters.' : null}><${PasswordInput} id="join-pw" value=${pw} onInput=${setPw} autocomplete=${mode === 'create' ? 'new-password' : 'current-password'} /><//>`}
      <${Notice} kind="err">${B.err}<//>
      <${Notice} kind="ok">${B.ok}<//>
      <button class="btn primary wide" type="submit" disabled=${B.busy}>${B.busy ? 'One moment…' : mode === 'create' ? html`<${Icon} n="crown" s=${19} />Join the race` : mode === 'signin' ? 'Sign in' : 'Send reset link'}</button>
      ${mode === 'create' ? html`<p class="faint smallprint">We'll email you a link to confirm your address. Click it whenever suits you: your journey starts now. Only your email, name and progress are stored.</p>` : null}
      <div class="join-alt">
        ${mode === 'create' ? html`<span>Already have a profile?</span><button type="button" class="linkbtn" onClick=${() => tab('signin')}>Sign in</button>` : null}
        ${mode === 'signin' ? html`<button type="button" class="linkbtn" onClick=${() => tab('reset')}>Forgot your password?</button><button type="button" class="linkbtn" onClick=${() => tab('create')}>New here? Create a profile</button>` : null}
        ${mode === 'reset' ? html`<button type="button" class="linkbtn" onClick=${() => tab('signin')}>Back to sign in</button>` : null}
      </div>
    </form>
  </div>`;
}
// after onboarding without a connection: the sign-up comes back as soon as the sign-in service can be reached
function JoinLater() {
  return html`<div class="wrap"><div class="onb"><${JoinRace} later=${true} onDone=${() => update(x => { delete x.signupDue; })} /></div></div>`;
}

/* ---------- the guide: what lies ahead, page by page */
const GUIDE_PAGES = ['road', 'talk', 'culture', 'rivals', 'queen'];
// a real reply from your first region whose right answer sounds different out loud
function guideReply(level) {
  const li = Math.max(0, LEVEL_IDS.indexOf(level));
  for (let l = li; l < LEVELS.length; l++) for (const sid of LEVELS[l].stops) for (const r of STOPS[sid].replies) {
    const ok = r.opts.find(o => o[2]), sp = ok && spokenForm(ok[0]);
    if (sp) { const wrong = r.opts.filter(o => !o[2]).slice(0, 2); return { sid, r, opts: [wrong[0], ok, wrong[1]].filter(Boolean), ok: ok[0], sp }; }
  }
  return null;
}
function GuideChat({ level }) {
  const g = useMemo(() => guideReply(level), [level]);
  if (!g) return null;
  return html`<div class="g-chat" aria-hidden="true">
    <div class="g-say"><span class="avatar">${initialOf(g.r.who)}</span><div class="bubble"><span class="eyebrow">${g.r.who}</span><b class="sv" lang="sv">${g.r.say}</b></div></div>
    <div class="g-opts">${g.opts.map((o, k) => html`<span class=${cx('g-opt', o[2] && 'ok')} style=${`animation-delay:${0.7 + k * 0.22}s`} key=${k}>${o[2] ? html`<${Icon} n="check" s=${15} w=${3} />` : null}<span lang="sv">${o[0]}</span></span>`)}</div>
    <div class="g-sound"><span class="sp-lab"><${Icon} n="chat" s=${14} />How it sounds</span><b class="sv" lang="sv">${g.sp}</b></div>
  </div>`;
}
function GuideSigns({ level }) {
  const L = LEVELS[Math.max(0, LEVEL_IDS.indexOf(level))];
  const signs = L.stops.slice(0, 3).map(sid => ({ sid, f: FACTS[sid][0] }));
  return html`<div class="g-culture" aria-hidden="true">
    <div class="g-post">${signs.map((x, k) => html`<div class=${cx('g-board', 'b-' + x.f.t, k % 2 && 'flip')} style=${`animation-delay:${0.25 + k * 0.28}s`} key=${x.sid}>
      <${Icon} n=${FACT_THEMES[x.f.t].icon} s=${15} /><span><b>${STOPS[x.sid].city}</b>${x.f.h}</span></div>`)}<span class="g-pole"></span></div>
    <div class="g-stamps">${L.stops.map((sid, k) => html`<span class=${cx('g-stamp', k === 0 && 'got')} key=${sid}><${Glyph} n=${STOPS[sid].glyph} s=${22} /><small>${STOPS[sid].city}</small></span>`)}</div>
  </div>`;
}
function GuideRace({ level }) {
  const s = useApp(), L = LEVELS[Math.max(0, LEVEL_IDS.indexOf(level))];
  const lanes = [
    { id: 'me', name: 'You', me: true, at: 0, p: { ...s.profile, avatar: s.profile.avatar || 'bee' }, sub: STOPS[L.stops[0]].city },
    { id: 'r1', name: 'A learner', at: 0, p: { avatar: 'bee', color: 'moss', name: 'A' }, sub: STOPS[L.stops[1]].city },
    { id: 'r2', name: 'A learner', at: 0, p: { avatar: 'bee', color: 'lavender', name: 'B' }, sub: STOPS[L.stops[2]].city },
  ];
  return html`<div class="g-race" aria-hidden="true"><${BeeTrack} lanes=${lanes} />
    <div class="g-chips"><span class="chip glow"><${Icon} n="swords" s=${14} />Challenges up to 2 cities away</span><span class="chip"><${Icon} n="flower" s=${14} />Live typing races</span><span class="chip moss"><${Icon} n="shield" s=${14} />Safehouses</span></div>
  </div>`;
}
function GuideQueen() {
  const bosses = Object.keys(BOSSES);
  return html`<div class="g-queen">
    <${KebneScene} mode="teaser" label="The queen bee lands on the summit of Kebnekaise under the northern lights" />
    <div class="g-bosses" aria-hidden="true">${bosses.map((sid, k) => html`<span class="g-boss" style=${`animation-delay:${0.4 + k * 0.18}s`} key=${sid}><${NpcBee} npc=${BOSSES[sid]} s=${40} /><small>${BOSSES[sid].name} · ${STOPS[sid].city}</small></span>`)}</div>
  </div>`;
}
function OnbGuide({ start, work, setWork, onDone }) {
  const s = useApp(), a = ACCT.use();
  const [i, setI] = useState(0);
  const sw = useRef(null);
  const n = GUIDE_PAGES.length, page = GUIDE_PAGES[i], last = i === n - 1;
  const preview = useMemo(() => withDefaults({ ...freshState(), start }), [start]);
  const go = k => { const j = Math.max(0, Math.min(n - 1, k)); if (j !== i) { setI(j); sfx('tick'); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } } };
  useBack(() => go(i - 1), i > 0);
  const li = Math.max(0, LEVEL_IDS.indexOf(start)), first = LEVELS[li].stops[0], prev = ORDER[ORDER.indexOf(first) - 1];
  const left = ROUTE_KM - (prev ? CUM_KM[prev] : 0), cities = ORDER.length - ORDER.indexOf(first);
  const name = (s.profile.name || '').trim();
  const welcome = a.status === 'unverified' ? html`<div class="notice ok g-welcome" role="status"><${Icon} n="mail" /><span><b>Welcome to the race${name ? `, ${name}` : ''}!</b> We sent a link to ${a.user.email}. Confirm it whenever suits you to back up your progress.</span></div>`
    : a.status === 'ready' ? html`<div class="notice ok g-welcome" role="status"><${Icon} n="check" /><span><b>Welcome${name ? `, ${name}` : ''}!</b> Your progress is backed up to your profile.</span></div>` : null;
  const P = {
    road: { eyebrow: 'The road', title: `${STOPS[first].city} to Kiruna`,
      art: html`<div class="mapcard g-map" aria-hidden="true"><${ZoomMap} s=${preview} interactive=${false} /></div>`,
      text: `${cities} cities and ${fmtKm(left)} of real road, from ${LEVELS[li].region} to the far north. Every lesson takes you further down it, so your progress is counted in kilometres, not streaks.`,
      chips: [`${cities} cities`, fmtKm(left), `${LEVELS[li].id} to C1`] },
    talk: { eyebrow: 'Real conversations', title: 'Talk like a Swede', art: html`<${GuideChat} level=${start} />`,
      text: 'Every city is a real situation, from ordering fika to a job interview. Pick the reply that fits, then see how Swedes actually say it.' },
    culture: { eyebrow: 'Culture on the road', title: 'A stamp in every city', art: html`<${GuideSigns} level=${start} />`,
      text: `Lessons unlock ${FACT_TOTAL} stories about Swedish history, food, nature and language, each with a word to learn. Finish a city's lessons to stamp your passport.` },
    rivals: { eyebrow: 'Rivals on the road', title: 'Race other learners north', art: html`<${GuideRace} level=${start} />`,
      text: 'Join the players map to challenge anyone up to two cities away, or race someone in your city live. The winner takes the kilometres, and safehouses keep you safe while you learn.' },
    queen: { eyebrow: 'Boss bees and the queen', title: 'She’ll be waiting', art: html`<${GuideQueen} />`,
      text: 'Boss bees guard Malmö, Göteborg, Stockholm and Umeå: beat them to travel on. At the end of the road, climb Kebnekaise and race Fjälldrottningen on the summit.' },
  }[page];
  const touchStart = e => { const t = e.touches && e.touches[0]; if (t) sw.current = [t.clientX, t.clientY]; };
  const touchEnd = e => {
    const t = e.changedTouches && e.changedTouches[0], o = sw.current; sw.current = null;
    if (!t || !o) return;
    const dx = t.clientX - o[0], dy = t.clientY - o[1];
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) go(i + (dx < 0 ? 1 : -1));
  };
  return html`<section class="card guide" aria-label=${`Your journey ahead, page ${i + 1} of ${n}`} onTouchStart=${touchStart} onTouchEnd=${touchEnd}>
    ${i === 0 ? welcome : null}
    <div class="g-top"><span class="eyebrow">Your journey · ${i + 1} of ${n}</span>${last ? null : html`<button class="linkbtn g-skip" onClick=${onDone}>Skip</button>`}</div>
    <div class=${cx('g-page', 'gp-' + page)} key=${page}>
      <div class="g-art">${P.art}</div>
      <span class="eyebrow g-eyebrow">${P.eyebrow}</span>
      <h2 class="display">${P.title}</h2>
      <p class="g-text">${P.text}</p>
      ${P.chips ? html`<div class="g-chips">${P.chips.map(c => html`<span class="chip glow num" key=${c}>${c}</span>`)}</div>` : null}
      ${page === 'talk' ? html`<div class="g-field"><span class="eyebrow">Your field</span>
        <${Seg} label="Your field" value=${work} options=${[{ v: 'mix', l: 'Mix' }, { v: 'general', l: 'Office' }, { v: 'life', l: 'Life sciences' }]} onChange=${setWork} />
        <p class="muted">${WORK_HELP[work]}</p></div>` : null}
    </div>
    <div class="g-dots" role="group" aria-label="Pages">${GUIDE_PAGES.map((p, k) => html`<button class=${cx('g-dot', k === i && 'on', k < i && 'done')} key=${p} aria-label=${`Page ${k + 1}`} aria-current=${k === i ? 'step' : null} onClick=${() => go(k)}></button>`)}</div>
    <div class="g-nav">
      ${i > 0 ? html`<button class="btn ghost g-back" aria-label="Back" onClick=${() => go(i - 1)}><${Icon} n="arrowL" s=${19} /><span class="lbl">Back</span></button>` : html`<span></span>`}
      ${last ? html`<button class="btn primary" onClick=${onDone}>Start my journey<${Icon} n="arrowR" s=${20} /></button>`
        : html`<button class="btn primary" onClick=${() => go(i + 1)}>Next<${Icon} n="arrowR" s=${20} /></button>`}
    </div>
  </section>`;
}
