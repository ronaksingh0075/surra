/* ================= Surra UI: profile, sign-up and email verification, install, updates ================= */
const AV_COLORS = {
  fjord: ['#2D6E8E', '#F0FAFF'], glow: ['#F2A93B', '#2A1906'], falu: ['#A93A2F', '#FFF4EC'],
  moss: ['#3B7A4E', '#F2FFF4'], lingon: ['#C2394F', '#FFF1F3'], lavender: ['#7D63D6', '#FFFFFF'],
};
function Avatar({ p, s = 36 }) {
  const [bg, fg] = AV_COLORS[p.color] || AV_COLORS.fjord;
  const inner = p.avatar === 'initial'
    ? html`<span class="av-initial" style=${`font-size:${Math.round(s * 0.46)}px`}>${((p.name || '').trim().charAt(0) || '?').toUpperCase()}</span>`
    : GLYPHS[p.avatar] ? html`<${Glyph} n=${p.avatar} s=${Math.round(s * 0.58)} />` : html`<${BeeLogo} s=${Math.round(s * 0.82)} />`;
  return html`<span class="avatar" style=${`width:${s}px;height:${s}px;background:${bg};color:${fg}`} aria-hidden="true">${inner}</span>`;
}
function OnboardSignIn() {
  const a = ACCT.use();
  if (!['guest', 'unverified', 'loading'].includes(a.status)) return null;
  return html`<p class="muted" style="font-size:15px">Already have a profile? <button class="linkbtn" onClick=${() => NAV.go({ name: 'account', mode: 'signin' })}>Sign in</button></p>`;
}
function AccountNudge({ s }) {
  const a = ACCT.use();
  if (a.status === 'unverified') {
    return html`<section class="card nudge" aria-label="Confirm your email">
      <span class="nudge-i"><${Icon} n="mail" /></span>
      <div class="tx"><b>Confirm your email to start backing up</b><span>We sent a link to ${a.user.email}.</span></div>
      <button class="btn small" onClick=${() => NAV.go({ name: 'account' })}>Open</button>
    </section>`;
  }
  if (a.status !== 'guest' || !s.settings.nudge || !Object.keys(s.lessons).length) return null;
  return html`<section class="card nudge" aria-label="Save your progress">
    <span class="nudge-i"><${Icon} n="cloud" /></span>
    <div class="tx"><b>Keep your journey safe</b><span>Create a free profile to back up your progress and carry on from any device.</span></div>
    <div class="nudge-acts"><button class="btn small primary" onClick=${() => NAV.go({ name: 'account' })}>Create profile</button><button class="linkbtn" onClick=${() => update(x => { x.settings.nudge = false; })}>Not now</button></div>
  </section>`;
}
function AccountRow() {
  const a = ACCT.use();
  if (a.status === 'off') return null;
  const txt = a.status === 'ready' ? `Signed in as ${a.user.email}. Progress is backed up to your account.`
    : a.status === 'unverified' ? `Confirm ${a.user.email} to start backing up.`
    : a.status === 'unavailable' ? "Can't reach the sign-in service right now. Progress is saved on this device."
    : a.status === 'loading' ? 'Connecting…' : 'Create a free profile to back up your progress and use it on any device.';
  return html`<div class="setrow"><div class="tx"><b>Profile & backup</b><span>${txt}</span></div>
    <button class="btn ghost small" onClick=${() => NAV.go({ name: 'account' })}>${a.status === 'ready' || a.status === 'unverified' ? 'Manage' : 'Sign in'}</button></div>`;
}
function InstallRow() {
  const i = INSTALL.use();
  if (BUILD !== 'pwa') return null;
  const txt = i.standalone ? 'Installed. Surra opens from your home screen and works offline.'
    : i.can ? 'Add Surra to your home screen. It opens full screen and works offline.'
    : i.ios ? 'On iPhone or iPad: tap the Share button in Safari, then "Add to Home Screen".'
    : 'Use your browser menu and choose "Install app" or "Add to Home screen".';
  return html`<div class="setrow"><div class="tx"><b>Install the app</b><span>${txt}</span></div>
    ${i.can && !i.standalone ? html`<button class="btn small primary" onClick=${promptInstall}><${Icon} n="download" s=${18} />Install</button>` : null}</div>`;
}
function UpdateBanner() {
  const apply = UPDATE.use();
  if (!apply) return null;
  return html`<div class="updatebar" role="status"><span>A new version of Surra is ready.</span><button class="btn small primary" onClick=${() => { UPDATE.set(null); apply(); }}>Update</button></div>`;
}

/* ---------- account page */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function Field({ id, label, hint, children }) {
  return html`<div class="field"><label for=${id}>${label}</label>${children}${hint ? html`<span class="hint">${hint}</span>` : null}</div>`;
}
function PasswordInput({ id, value, onInput, autocomplete }) {
  const [show, setShow] = useState(false);
  return html`<div class="pw"><input id=${id} type=${show ? 'text' : 'password'} value=${value} onInput=${e => onInput(e.target.value)} autocomplete=${autocomplete} required minlength="8" />
    <button type="button" class="iconbtn small plain" onClick=${() => setShow(!show)} aria-label=${show ? 'Hide password' : 'Show password'} aria-pressed=${String(show)}><${Icon} n=${show ? 'eyeOff' : 'eye'} s=${19} /></button></div>`;
}
function Notice({ kind, children }) {
  if (!children) return null;
  return html`<div class=${cx('notice', kind === 'err' && 'err', kind === 'ok' && 'ok')} role=${kind === 'err' ? 'alert' : 'status'}><${Icon} n=${kind === 'err' ? 'info' : kind === 'ok' ? 'check' : 'mail'} /><span>${children}</span></div>`;
}
function useBusy() {
  const [busy, setBusy] = useState(false), [err, setErr] = useState(''), [ok, setOk] = useState('');
  const run = async (fn) => {
    if (busy) return;
    setBusy(true); setErr(''); setOk('');
    try { await fn(); } catch (e) { setErr(authMessage(e)); } finally { setBusy(false); }
  };
  return { busy, err, ok, setErr, setOk, run };
}
function AuthForms({ initial }) {
  const s = useApp();
  const [mode, setMode] = useState(initial === 'signin' ? 'signin' : 'create');
  const [name, setName] = useState(s.profile.name || ''), [email, setEmail] = useState(''), [pw, setPw] = useState('');
  const B = useBusy();
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
    B.run(() => (mode === 'create' ? signUp(name.trim().slice(0, 40), email, pw) : signIn(email, pw)));
  };
  const tab = m => { setMode(m); B.setErr(''); B.setOk(''); };
  return html`<section class="card authcard">
    <div class="auth-hero">
      <${Avatar} p=${s.profile} s=${64} />
      <div><h2 class="display">Save your journey</h2><p class="muted">Free, and only takes a minute.</p></div>
    </div>
    <ul class="perks">
      <li><${Icon} n="cloud" s=${19} /><span>Back up your stars, stamps, streak and facts</span></li>
      <li><${Icon} n="map" s=${19} /><span>Carry on from your phone, tablet or laptop</span></li>
      <li><${Icon} n="lock" s=${19} /><span>Only your email, name and progress are stored</span></li>
    </ul>
    ${mode === 'reset' ? null : html`<div style="margin-top:16px"><${Seg} label="Account" value=${mode} options=${[{ v: 'create', l: 'Create profile' }, { v: 'signin', l: 'Sign in' }]} onChange=${tab} /></div>`}
    <form class="authform" onSubmit=${submit} novalidate>
      ${mode === 'reset' ? html`<p class="muted">Enter your email and we'll send you a link to choose a new password.</p>` : null}
      ${mode === 'create' ? html`<${Field} id="acct-name" label="What should we call you?"><input id="acct-name" value=${name} onInput=${e => setName(e.target.value)} autocomplete="nickname" maxlength="40" required /><//>` : null}
      <${Field} id="acct-email" label="Email"><input id="acct-email" type="email" inputmode="email" value=${email} onInput=${e => setEmail(e.target.value)} autocomplete="email" autocapitalize="off" spellcheck="false" required /><//>
      ${mode === 'reset' ? null : html`<${Field} id="acct-pw" label="Password" hint=${mode === 'create' ? 'At least 8 characters.' : null}><${PasswordInput} id="acct-pw" value=${pw} onInput=${setPw} autocomplete=${mode === 'create' ? 'new-password' : 'current-password'} /><//>`}
      <${Notice} kind="err">${B.err}<//>
      <${Notice} kind="ok">${B.ok}<//>
      <button class="btn primary wide" type="submit" disabled=${B.busy}>${B.busy ? 'One moment…' : mode === 'create' ? 'Create my profile' : mode === 'signin' ? 'Sign in' : 'Send reset link'}</button>
      ${mode === 'create' ? html`<p class="faint smallprint">We'll email you a link to confirm your address. Your guest progress on this device comes with you.</p>` : null}
      ${mode === 'signin' ? html`<button type="button" class="linkbtn" style="justify-self:center" onClick=${() => tab('reset')}>Forgot your password?</button>` : null}
      ${mode === 'reset' ? html`<button type="button" class="linkbtn" style="justify-self:center" onClick=${() => tab('signin')}>Back to sign in</button>` : null}
    </form>
  </section>`;
}
function VerifyEmail() {
  const a = ACCT.use();
  const B = useBusy();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const wait = Math.max(0, 60 - Math.floor((now - (a.verifySentAt || 0)) / 1000));
  const check = () => B.run(async () => { const ok = await checkVerified(false); if (!ok) B.setErr("Not confirmed yet. The email can take a minute to arrive, so check your spam folder too."); });
  return html`<section class="card verify">
    <span class="verify-i"><${Icon} n="mail" s=${30} /></span>
    <h2 class="display">Check your inbox</h2>
    <p>We sent a confirmation link to <b>${a.user.email}</b>. Open it on any device, then come back here.</p>
    <p class="muted" style="font-size:14px">Until then, your progress is saved on this device.</p>
    <${Notice} kind="err">${B.err}<//>
    <${Notice} kind="ok">${B.ok}<//>
    <div class="verify-acts">
      <button class="btn primary wide" disabled=${B.busy} onClick=${check}>${B.busy ? 'Checking…' : "I've confirmed my email"}</button>
      <button class="btn ghost wide" disabled=${B.busy || wait > 0} onClick=${() => B.run(async () => { await resendVerification(); B.setOk('Sent again. It can take a minute to arrive.'); })}>${wait > 0 ? `Send again in ${wait}s` : 'Send the email again'}</button>
      <button class="linkbtn" onClick=${() => B.run(signOutAccount)}>Use a different email</button>
    </div>
  </section>`;
}
function ProfileView() {
  const s = useApp(), a = ACCT.use();
  const [name, setName] = useState(s.profile.name || '');
  const [ask, setAsk] = useState(null); // 'out' | 'delete'
  const [pw, setPw] = useState('');
  const B = useBusy(), D = useBusy();
  const stamps = ORDER.filter(sid => stopDone(s, sid)).length;
  const since = a.user.since ? new Date(a.user.since) : null;
  const choices = [{ id: 'bee' }, { id: 'initial' }, ...ORDER.map(sid => ({ id: STOPS[sid].glyph, sid, open: stopDone(s, sid) }))];
  const syncTxt = a.sync === 'saved' ? `Backed up${a.syncedAt ? ` at ${new Date(a.syncedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}` : ''}`
    : a.sync === 'offline' ? 'Offline. Changes will back up when you reconnect.'
    : a.sync === 'error' ? "Couldn't back up. Sign out and in again to retry."
    : 'Connecting…';
  return html`<section class="card profilecard">
      <div class="prof-head">
        <${Avatar} p=${s.profile} s=${84} />
        <div style="min-width:0">
          <h2 class="display">${s.profile.name || 'Hej!'}</h2>
          <p class="muted prof-mail"><${Icon} n="check" s=${15} w=${3} />${a.user.email}</p>
          <div class="tags"><span class="chip glow">${LEVELS[highestLevel(s)].rank}</span>${since && !isNaN(since) ? html`<span class="chip">Since ${since.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>` : null}</div>
        </div>
      </div>
      <p class=${cx('syncline', a.sync === 'error' && 'bad')}><${Icon} n="cloud" s=${17} />${syncTxt}</p>
      <div class="statgrid" style="margin-top:14px">
        <div class="statbox"><b>${fmtN(s.xp)}</b><span>XP</span></div>
        <div class="statbox"><b>${liveStreak(s)}</b><span>Day streak</span></div>
        <div class="statbox"><b>${stamps}/20</b><span>Stamps</span></div>
        <div class="statbox"><b>${factsTotal(s)}/${FACT_TOTAL}</b><span>Facts</span></div>
      </div>
    </section>
    <section class="card" style="margin-top:16px">
      <h3 class="cardh">Edit your profile</h3>
      <form class="authform" style="margin-top:8px" onSubmit=${e => { e.preventDefault(); const n = name.trim().slice(0, 40); if (!n) { B.setErr('Your name can’t be empty.'); return; } saveProfile({ name: n }); B.setErr(''); B.setOk('Saved.'); }}>
        <${Field} id="prof-name" label="Name"><div class="inline"><input id="prof-name" value=${name} onInput=${e => setName(e.target.value)} maxlength="40" autocomplete="nickname" /><button class="btn small" type="submit">Save</button></div><//>
        <${Notice} kind="err">${B.err}<//><${Notice} kind="ok">${B.ok}<//>
      </form>
      <span class="eyebrow" style="display:block;margin-top:16px">Emblem</span>
      <p class="muted" style="font-size:13.5px">Each city stamp you collect unlocks its emblem.</p>
      <div class="avpick" role="group" aria-label="Choose an emblem">
        ${choices.map(c => {
          const locked = c.sid && !c.open;
          return html`<button class=${cx('avopt', locked && 'locked')} aria-pressed=${String(s.profile.avatar === c.id)} disabled=${locked} onClick=${() => saveProfile({ avatar: c.id })} title=${c.sid ? (locked ? `Collect the ${STOPS[c.sid].city} stamp` : STOPS[c.sid].city) : c.id === 'bee' ? 'Bee' : 'Your initial'} aria-label=${c.sid ? `${STOPS[c.sid].city} emblem${locked ? ', locked' : ''}` : c.id === 'bee' ? 'Bee emblem' : 'Your initial'}>
            ${locked ? html`<span class="avlock"><${Glyph} n=${c.id} s=${22} /><${Icon} n="lock" s=${12} w=${2.6} /></span>` : html`<${Avatar} p=${{ ...s.profile, avatar: c.id }} s=${44} />`}
          </button>`;
        })}
      </div>
      <span class="eyebrow" style="display:block;margin-top:14px">Colour</span>
      <div class="swatches" role="group" aria-label="Choose a colour">
        ${Object.keys(AV_COLORS).map(k => html`<button class="swatch" style=${`background:${AV_COLORS[k][0]}`} aria-pressed=${String(s.profile.color === k)} aria-label=${k} onClick=${() => saveProfile({ color: k })}></button>`)}
      </div>
    </section>
    <section class="card" style="margin-top:16px">
      <h3 class="cardh">Account</h3>
      <div class="setrow"><div class="tx"><b>Password</b><span>We'll email you a link to choose a new one.</span></div>
        <button class="btn ghost small" disabled=${D.busy} onClick=${() => D.run(async () => { await resetPassword(a.user.email); D.setOk(`Reset link sent to ${a.user.email}.`); })}>Change</button></div>
      <div class="setrow"><div class="tx"><b>Sign out</b><span>Your progress stays in your account. This device starts fresh as a guest.</span></div>
        <button class="btn ghost small" onClick=${() => setAsk('out')}><${Icon} n="logout" s=${17} />Sign out</button></div>
      <div class="setrow"><div class="tx"><b>Delete account</b><span>Permanently removes your profile and backed-up progress.</span></div>
        <button class="btn ghost small danger" onClick=${() => { setPw(''); D.setErr(''); setAsk('delete'); }}><${Icon} n="trash" s=${17} />Delete</button></div>
      <${Notice} kind="ok">${D.ok}<//>
      ${!ask ? html`<${Notice} kind="err">${D.err}<//>` : null}
    </section>
    ${ask === 'out' ? html`<${Confirm} title="Sign out?" text="Your progress is safe in your account. This device will start fresh as a guest." yes="Sign out" no="Cancel" onNo=${() => setAsk(null)} onYes=${() => { setAsk(null); D.run(signOutAccount); }} />` : null}
    ${ask === 'delete' ? html`<div class="confirm"><div class="scrim" onClick=${() => setAsk(null)}></div>
      <form class="box" role="alertdialog" aria-label="Delete your account" onSubmit=${e => { e.preventDefault(); D.run(async () => { await deleteAccount(pw); setAsk(null); toast('Your account was deleted', 'trash'); }); }}>
        <b style="font-size:18px">Delete your account?</b>
        <p class="muted">This removes your profile and all backed-up progress. It can't be undone. Enter your password to confirm.</p>
        <${Field} id="del-pw" label="Password"><${PasswordInput} id="del-pw" value=${pw} onInput=${setPw} autocomplete="current-password" /><//>
        <${Notice} kind="err">${D.err}<//>
        <div class="row"><button type="button" class="btn ghost" onClick=${() => setAsk(null)}>Cancel</button><button type="submit" class="btn bad" disabled=${D.busy || pw.length < 6}>${D.busy ? 'Deleting…' : 'Delete'}</button></div>
      </form></div>` : null}`;
}
function AccountSection({ mode }) {
  const a = ACCT.use();
  if (a.status === 'ready') return html`<${ProfileView} />`;
  if (a.status === 'unverified') return html`<${VerifyEmail} />`;
  if (a.status === 'guest') return html`<${AuthForms} initial=${mode} />`;
  if (a.status === 'unavailable') return html`<section class="card"><${Notice} kind="err">Can't reach the sign-in service right now. Your progress is saved on this device.<//><button class="btn primary wide" style="margin-top:14px" onClick=${initAccount}>Try again</button></section>`;
  if (a.status === 'off') return null;
  return html`<div class="loadingbox"><div class="spinner"></div><b>Connecting…</b></div>`;
}
function AccountPage({ go, mode }) {
  const a = ACCT.use();
  const back = () => go({ name: S().onboarded ? 'home' : 'onboard' });
  useBack(back);
  return html`<div class="wrap" style="max-width:680px">
    <div class="page-head"><button class="iconbtn" onClick=${back} aria-label="Back"><${Icon} n="arrowL" /></button><h1>${a.status === 'ready' ? 'Your profile' : a.status === 'unverified' ? 'Almost there' : 'Profile'}</h1></div>
    ${a.status === 'off' ? html`<section class="card"><p>Profiles aren't available in this version of Surra. Your progress is saved on this device.</p></section>` : html`<${AccountSection} mode=${mode} />`}
  </div>`;
}
