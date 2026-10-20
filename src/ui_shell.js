/* ================= Surra app shell: header, bottom tabs and the five sections ================= */
const TABS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'map', label: 'Map', icon: 'map' },
  { id: 'practice', label: 'Practice', icon: 'bolt' },
  { id: 'pass', label: 'Passport', icon: 'stamp' },
  { id: 'me', label: 'Me', icon: 'user' },
];

/* ---------- Android back button: close the top-most thing first (installable app only) */
const BACK = [];
function useBack(handler, on = true) {
  const ref = useRef(handler); ref.current = handler;
  useEffect(() => {
    if (!on || BUILD !== 'pwa') return;
    const h = () => ref.current();
    BACK.push(h);
    return () => { const i = BACK.lastIndexOf(h); if (i >= 0) BACK.splice(i, 1); };
  }, [on]);
}
const backNav = { tab: () => 'home', setTab: null, armed: false };
function armBack() { if (BUILD === 'pwa' && !backNav.armed) { try { history.pushState({ surra: 1 }, ''); backNav.armed = true; } catch (e) { /* ignore */ } } }
function initBack() {
  if (BUILD !== 'pwa') return;
  try { history.replaceState({ surra: 0 }, ''); } catch (e) { return; }
  armBack();
  window.addEventListener('popstate', () => {
    backNav.armed = false;
    if (BACK.length) { BACK[BACK.length - 1](); armBack(); return; }
    if (backNav.tab() !== 'home' && backNav.setTab) { backNav.setTab('home'); armBack(); }
    // on Home with nothing open, the next back press leaves the app
  });
}

/* ---------- header */
function TopBar({ s, go }) {
  const a = ACCT.use(), C = COMM.use();
  const km = totalKm(s), cities = citiesOf(s), leg = legOf(s), city = STOPS[leg.sid].city;
  const race = a.status === 'ready' && onMap(s) && C.playersAt ? standing(mapPlayers(s, C.players)) : null;
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const set = () => document.documentElement.style.setProperty('--hdr-h', el.offsetHeight + 'px');
    set();
    if (window.ResizeObserver) { const ro = new ResizeObserver(set); ro.observe(el); return () => ro.disconnect(); }
  }, []);
  return html`<header class="topbar" ref=${ref}>
    <button class="brand" onClick=${() => go({ name: 'home' })} aria-label="Surra home"><${BeeLogo} /><span class="display">Surra</span></button>
    <div class="stats" role="group" aria-label="Your progress">
      <button class="stat" onClick=${() => go({ name: 'pass' })} aria-label=${`${fmtN(km)} kilometres travelled`} title="Kilometres travelled">
        <span class="si road"><${Icon} n="road" s=${18} /></span><span class="num">${fmtShort(km)}</span><span class="unit keep">km</span></button>
      <button class="stat" onClick=${() => go({ name: 'pass' })} aria-label=${`${cities} of 20 cities visited`} title="Cities visited">
        <span class="si gold"><${Icon} n="stamp" s=${18} /></span><span class="num">${cities}</span><span class="unit">${cities === 1 ? 'city' : 'cities'}</span></button>
      ${race && race.ranked.length > 1 ? html`<button class="stat" onClick=${() => go({ name: 'players' })} aria-label=${`Number ${race.rank} of ${race.ranked.length} on the players map`} title="Your place in the race">
          <span class="si gold"><${Icon} n="trophy" s=${18} /></span><span class="num">#${race.rank}</span><span class="unit">of ${race.ranked.length}</span></button>`
        : html`<button class="stat" onClick=${() => go({ name: 'map' })} aria-label=${leg.left ? `${leg.left} km of road to ${city}` : `${city} reached`} title="The road ahead">
          <${Ring} v=${leg.got} max=${leg.total} size=${20} /><span class="num">${leg.left}</span><span class="unit keep">km</span><span class="unit">to ${city}</span></button>`}
    </div>
  </header>`;
}
const fmtShort = n => (n < 10000 ? fmtN(n) : n < 1e6 ? (n / 1000).toFixed(n < 1e5 ? 1 : 0).replace(/\.0$/, '') + 'k' : (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M');

function TabBar({ tab, setTab, s }) {
  const a = ACCT.use(), C = COMM.use();
  const mistakes = Object.keys(s.mistakes).length;
  const duels = a.status === 'ready' && onMap(s) ? challengeLists(C.challenges, meUid()).incoming.length : 0;
  return html`<nav class="tabbar" aria-label="Sections">
    ${TABS.map(t => {
      const badge = t.id === 'practice' ? mistakes : t.id === 'map' ? duels : 0, dot = t.id === 'me' && a.status === 'unverified';
      return html`<button class=${cx('tab', tab === t.id && 'on')} aria-current=${tab === t.id ? 'page' : null} onClick=${() => setTab(t.id)}
          aria-label=${t.label + (badge ? (t.id === 'map' ? `, ${badge} challenge${badge === 1 ? '' : 's'} waiting` : `, ${badge} to review`) : '') + (dot ? ', confirm your email' : '')}>
        <span class="ti">${t.id === 'me' && a.status === 'ready' ? html`<${Avatar} p=${s.profile} s=${26} />` : html`<${Icon} n=${t.icon} s=${22} />`}
          ${badge ? html`<span class="tbadge" aria-hidden="true">${badge > 9 ? '9+' : badge}</span>` : null}
          ${dot ? html`<span class="tdot" aria-hidden="true"></span>` : null}
        </span>
        <span class="tl" aria-hidden="true">${t.label}</span>
      </button>`;
    })}
  </nav>`;
}

/* ---------- Home */
function RoadCard({ s, go }) {
  const leg = legOf(s), city = STOPS[leg.sid].city, from = leg.from ? STOPS[leg.from].city : null;
  const pct = leg.total ? Math.round((100 * leg.got) / leg.total) : 100, tk = todayKm(s);
  return html`<section class="card today roadcard" aria-label="The road ahead">
    <div class="today-ring"><${Ring} v=${leg.got} max=${leg.total} size=${64} /><b class="num">${pct}%</b></div>
    <div class="tx">
      <span class="eyebrow">${from ? `${from} to ${city}` : `Over the bridge into ${city}`} · ${leg.total} km</span>
      <b>${leg.left ? `${leg.left} km of road to go` : `${city} reached. Snyggt!`}</b>
      <span>${tk ? `+${tk} km today · ` : ''}${fmtKm(totalKm(s))} in total${isSafe(leg.sid) ? ' · a safehouse' : ''}</span>
    </div>
    <button class="iconbtn" onClick=${() => go({ name: 'pass' })} aria-label="Open your passport"><${Icon} n="arrowR" /></button>
  </section>`;
}
function LifeTrackCard({ s, startAction, openStop }) {
  const sid = nextLife(s), done = lifeDone(s);
  return html`<section class="card lifecard" aria-label="Life-science track">
    <div class="lifecard-top"><span class="lifeicon"><${Icon} n="flask" s=${22} /></span>
      <div class="tx"><span class="eyebrow">Life-science track · ${done}/${LIFE_IDS.length}</span>
        <b>${sid ? `${STOPS[sid].city}: ${LIFE[sid].en}` : done === LIFE_IDS.length ? 'Every lab lesson done!' : 'Unlock more stops to continue'}</b>
        <span>${sid ? LIFE[sid].intro : done === LIFE_IDS.length ? 'Replay any of them from Practice to keep your industry Swedish sharp.' : 'Lab lessons open as you reach the work stops on your journey.'}</span></div></div>
    <div class="row">${sid ? html`<button class="btn primary small" onClick=${() => startAction({ type: 'lesson', sid, lesson: 'life' })}>Start lab lesson<${Icon} n="arrowR" s=${18} /></button>
      <button class="linkbtn" onClick=${() => openStop(sid)}>About ${STOPS[sid].city}</button>` : null}</div>
  </section>`;
}
function HomeTab({ s, go, startAction, openStop, openRegion, playChallenge, openChallenges, challengePlayer, racePlayer, joinRace }) {
  const L = LEVELS[LEVEL_INDEX[currentStop(s)]];
  return html`<div class="page">
    <${RaceInviteCard} onJoin=${joinRace} />
    <${ChallengeCard} onPlay=${playChallenge} onOpen=${openChallenges} />
    <${ContinueCard} s=${s} startAction=${startAction} openStop=${openStop} openRegion=${openRegion} />
    <${PromptCard} s=${s} go=${go} />
    <${RivalsCard} s=${s} go=${go} onChallenge=${challengePlayer} onRace=${racePlayer} />
    <${RoadCard} s=${s} go=${go} />
    ${lifeFirst(s) ? html`<${LifeTrackCard} s=${s} startAction=${startAction} openStop=${openStop} />` : null}
    <${FactOfDay} s=${s} />
    <button class="card mapteaser" onClick=${() => go({ name: 'map' })} aria-label="Open the journey map">
      <div class="mt-map" aria-hidden="true"><${ZoomMap} s=${s} interactive=${false} focus=${{ k: 2.6 }} /></div>
      <div class="mt-tx"><span class="eyebrow">${L.id} · ${L.region}</span><b>Open the map</b><span>Zoom in for roads, cities and fact signposts</span></div>
      <${Icon} n="arrowR" />
    </button>
  </div>`;
}

/* ---------- Map */
function MapTab({ s, mode, setMode, go, openStop, openRegion, openFact, openPlayers, openChallenges }) {
  const a = ACCT.use(), C = COMM.use();
  const players = commOn();
  const m = mode === 'players' && !players ? 'map' : mode;
  const L = a.status === 'ready' && onMap(s) ? challengeLists(C.challenges, meUid()) : null, waiting = L ? L.incoming.length + L.unseen.length : 0;
  return html`<div class=${cx('maptab', m === 'list' && 'listmode')}>
    <div class="maptab-head">
      <${Seg} label="Map view" value=${m} options=${[{ v: 'map', l: 'Map' }, ...(players ? [{ v: 'players', l: 'Players' }] : []), { v: 'list', l: 'Stops' }]} onChange=${setMode} />
      ${m === 'players' && L ? html`<button class="btn small ghost chbtn" onClick=${openChallenges} aria-label=${`Challenges${waiting ? `, ${waiting} new` : ''}`}><${Icon} n="swords" s=${17} /><span class="lbl">Challenges</span>${waiting ? html`<span class="badge">${waiting}</span>` : null}</button>`
        : html`<span class="chip glow">${LEVELS[highestLevel(s)].rank}</span>`}
    </div>
    ${m === 'map' ? html`<div class="mapbox"><${ZoomMap} s=${s} onStop=${openStop} onRegion=${openRegion} onFact=${openFact} focus=${{ k: 2.4 }} /></div>`
      : m === 'players' ? html`<${PlayersMap} s=${s} go=${go} openPlayers=${openPlayers} />`
      : html`<div class="page"><${JourneyList} s=${s} openStop=${openStop} openRegion=${openRegion} /></div>`}
  </div>`;
}

/* ---------- Practice */
function PracticeTab({ s, startAction, openStop }) {
  const env = ENV.use();
  const mistakes = Object.keys(s.mistakes).length, cur = currentStop(s);
  const cps = LEVELS.map((L, li) => ({ L, li })).filter(({ li }) => levelUnlocked(s, li));
  return html`<div class="page">
    <h1 class="pagetitle display">Practice</h1>
    <div class="practice-grid">
      <button class="card pcard" onClick=${() => startAction({ type: 'review' })}>
        <span class="qi"><${Icon} n="refresh" s=${22} /></span><b>Review ${mistakes ? html`<span class="badge">${mistakes}</span>` : null}</b>
        <span>${mistakes ? `Fix the ${mistakes} item${mistakes === 1 ? '' : 's'} you missed` : 'A mixed refresher from your stops'}</span></button>
      <button class="card pcard" onClick=${() => startAction({ type: 'quick' })}>
        <span class="qi"><${Icon} n="timer" s=${22} /></span><b>Snabbsvar</b>
        <span>${s.stats.quickBest ? `60 seconds of quick replies. Best: ${s.stats.quickBest}` : '60 seconds of quick replies'}</span></button>
      <button class="card pcard" onClick=${() => startAction({ type: 'race', mode: 'bees' })}>
        <span class="qi"><${Icon} n="flower" s=${22} /></span><b>Bee race</b>
        <span>${s.stats.bestWpm ? `Beat the pacer bees to the blomma. Best: ${s.stats.bestWpm} wpm` : commOn() ? 'Beat the pacer bees, or race a player in your city' : 'Type a paragraph faster than the pacer bees'}</span></button>
      ${env.ai === 'ready' ? html`<button class="card pcard" onClick=${() => startAction({ type: 'generate', sid: cur })}>
        <span class="qi"><${Icon} n="sparkle" s=${22} /></span><b>Fresh situations</b><span>Claude writes 6 new drills for ${STOPS[cur].city}</span></button>` : null}
    </div>
    <p class="faint detour-left">${detourLeft(s) ? `Practice adds up to ${detourLeft(s)} more km of detours today.` : `Today's ${KM.detourCap} km of practice detours are used up. Lessons still cover new road.`}</p>
    <section class="card" style="margin-top:16px">
      <div class="sec-head"><h2 class="display">Typing</h2>${s.stats.bestWpm ? html`<span class="chip glow num">${s.stats.bestWpm} wpm best</span>` : null}</div>
      <p class="muted sec-sub">Type real Swedish, word by word. ${letterEasy(s) ? 'Letter help is on: a, o and e count for å, ä, ö and é.' : 'Exact letters: å, ä, ö and é count.'}</p>
      <button class="lessonrow" onClick=${() => startAction({ type: 'letters' })}>
        <span class="li"><${Icon} n="keyboard" /></span>
        <span class="tx"><b>Å, ä och ö</b><span>The three extra letters, and why far, får and för are three different words</span></span>
        <${Stars} n=${s.lessons['type:letters'] || 0} />
      </button>
      <button class="lessonrow" onClick=${() => startAction({ type: 'lesson', sid: cur, lesson: 'type' })}>
        <span class="li"><${Icon} n="pen" /></span>
        <span class="tx"><b>Phrases from ${STOPS[cur].city}</b><span>Type the eight key phrases of your current stop</span></span>
        <${Stars} n=${starsOf(s, cur, 'type')} />
      </button>
      ${env.tts ? html`<button class="lessonrow" onClick=${() => startAction({ type: 'lesson', sid: cur, lesson: 'hear' })}>
        <span class="li"><${Icon} n="speaker" /></span>
        <span class="tx"><b>Hear and type</b><span>Listen to ${STOPS[cur].city}'s phrases and type what you hear</span></span>
        <${Icon} n="arrowR" />
      </button>` : null}
    </section>
    ${lifeOn(s) ? html`<section class="card" style="margin-top:16px">
      <div class="sec-head"><h2 class="display">Life-science lab</h2><span class="chip glow num">${lifeDone(s)}/${LIFE_IDS.length}</span></div>
      <p class="muted sec-sub">Lab and industry Swedish at the work stops: safety, clinics, launches, tenders and TLV.</p>
      ${LIFE_IDS.map(sid => {
        const open = stopOpen(s, sid), L = LIFE[sid];
        return html`<button class=${cx('lessonrow', open && 'liferow')} onClick=${() => (open ? startAction({ type: 'lesson', sid, lesson: 'life' }) : openStop(sid))}>
          <span class="li"><${Icon} n=${open ? 'flask' : 'lock'} /></span>
          <span class="tx"><b>${L.en} <span class="faint" style="font-weight:700">· ${STOPS[sid].city}</span></b><span>${open ? L.intro : lockReason(s, sid)}</span></span>
          ${open ? html`<${Stars} n=${starsOf(s, sid, 'life')} />` : html`<span class="chip">${L.level}</span>`}
        </button>`;
      })}
    </section>` : null}
    <${BossList} s=${s} start=${startAction} openStop=${openStop} />
    <section class="card" style="margin-top:16px">
      <div class="sec-head"><h2 class="display">Checkpoints</h2></div>
      <p class="muted sec-sub">12 questions from a whole region. Pass to unlock the next one, or retake for practice.</p>
      ${cps.map(({ L, li }) => html`<button class="lessonrow" onClick=${() => startAction({ type: 'checkpoint', li })}>
        <span class="li"><${Icon} n="flag" /></span>
        <span class="tx"><b>${L.id} · ${L.region}</b><span>${s.checkpoints[L.id] ? 'Passed. Retake any time.' : `Pass to unlock ${LEVELS[li + 1] ? LEVELS[li + 1].region : 'the finish'}`}</span></span>
        ${s.checkpoints[L.id] ? html`<span class="chip moss"><${Icon} n="check" s=${14} w=${3} />Passed</span>` : html`<${Icon} n="arrowR" />`}
      </button>`)}
    </section>
  </div>`;
}

/* ---------- Me */
function MeTab({ go }) {
  const a = ACCT.use();
  return html`<div class="page">
    <h1 class="pagetitle display">${a.status === 'ready' ? 'Your profile' : a.status === 'off' ? 'Settings' : 'Profile'}</h1>
    ${a.status !== 'off' ? html`<div><${AccountSection} /></div>` : null}
    <${NotifyCard} go=${go} />
    <${Settings} go=${go} embedded />
    <p class="faint about">Surra · made in Stockholm with Claude · <a href="https://github.com/ronaksingh0075/surra" target="_blank" rel="noopener">source</a></p>
  </div>`;
}

/* ---------- a race invite from a notification: wait for the profile to load, then open it */
function openRaceLink(id, open, tries = 0) {
  if (!commReady()) { if (tries < 20) setTimeout(() => openRaceLink(id, open, tries + 1), 500); return; }
  getRace(id).then(r => {
    if (r && r.b === meUid() && inviteOpen(r)) open(r);
    else toast(r && r.status === 'on' ? 'That race has already started' : 'That race invite has ended', 'flower');
  }).catch(() => toast("Couldn't open that race. Check your connection.", 'info'));
}

/* ---------- the app */
function App() {
  const s = useApp();
  const [tab, setTabRaw] = useState('home');
  const [mapMode, setMapMode] = useState('map');
  const [view, setView] = useState(() => (S().onboarded ? null : { name: 'onboard' }));
  const [room, setRoom] = useState(null);
  const [sheet, setSheet] = useState(null);
  const [news, setNews] = useState(false);
  useEffect(() => { applyTheme(s.settings); }, [s.settings.palette, s.settings.mode, themeOpen(s, themeById(s.settings.palette))]);
  useEffect(() => { if (s.onboarded && view && view.name === 'onboard') setView(null); }, [s.onboarded]);
  const setTab = t => { setSheet(null); setTabRaw(t); armBack(); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } };
  backNav.tab = () => tab; backNav.setTab = setTab;
  useEffect(() => {
    initBack();
    if (PENDING.open) { const t = PENDING.open; PENDING.open = null; setTimeout(() => NAV.open && NAV.open(t), 60); }
    const t = setTimeout(() => { if (newsDue(S())) setNews(true); }, 1500);
    return () => clearTimeout(t);
  }, []);
  const go = v => {
    setSheet(null); setRoom(null);
    const n = v.name;
    if (n === 'onboard') { setView({ name: 'onboard' }); return; }
    if (n === 'account' && !S().onboarded) { setView({ name: 'account', mode: v.mode }); return; }
    setView(null);
    if (n === 'players') setMapMode('players');
    setTab({ home: 'home', map: 'map', players: 'map', practice: 'practice', pass: 'pass', settings: 'me', account: 'me', me: 'me' }[n] || 'home');
  };
  NAV.go = go;
  // a tap on a notification: open where it points, on top of any lesson in progress
  NAV.open = t => {
    if (!S().onboarded) return;
    setView(null);
    if (String(t).startsWith('race:')) { openRaceLink(String(t).slice(5), r => { setSheet(null); setRoom({ name: 'race', mode: 'guest', race: r, k: Date.now() }); }); return; }
    if (t === 'challenges') { setMapMode('players'); setTabRaw('map'); armBack(); setSheet({ type: 'challenges' }); return; }
    if (room) { setSheet(null); setTabRaw({ players: 'map', challenges: 'map' }[t] || t); if (t === 'players') setMapMode('players'); return; }
    go({ name: t });
  };
  const startAction = a => {
    setSheet(null);
    const k = Date.now();
    if (a.type === 'lesson') {
      if (!stopOpen(S(), a.sid)) { setSheet({ type: 'stop', sid: a.sid }); return; }
      if (a.lesson === 'learn') setRoom({ name: 'lesson', lesson: lessonLearn(a.sid), k });
      else if (a.lesson === 'reply') setRoom({ name: 'lesson', lesson: lessonReply(a.sid), k });
      else if (a.lesson === 'life' && LIFE[a.sid]) setRoom({ name: 'lesson', lesson: lessonLife(a.sid), k });
      else if (a.lesson === 'type' || a.lesson === 'hear') setRoom({ name: 'lesson', lesson: lessonType(a.sid, a.lesson === 'hear' ? 'hear' : 'see'), k });
      else setRoom(ENV.get().ai === 'off' ? { name: 'lesson', lesson: lessonGuided(a.sid), k } : { name: 'talk', sid: a.sid, k });
    } else if (a.type === 'checkpoint') setRoom({ name: 'lesson', lesson: lessonCheckpoint(a.li), k });
    else if (a.type === 'boss') { if (bossReady(S(), a.sid)) setRoom({ name: 'boss', sid: a.sid, k }); else setSheet({ type: 'stop', sid: a.sid }); }
    else if (a.type === 'climb') { if (climbOpen(S())) setRoom({ name: 'climb', k }); else setSheet({ type: 'stop', sid: CLIMB.sid }); }
    else if (a.type === 'review') setRoom({ name: 'lesson', lesson: lessonReview(S()), k });
    else if (a.type === 'quick') setRoom({ name: 'quick', k });
    else if (a.type === 'letters') setRoom({ name: 'lesson', lesson: lessonLetters(), k });
    else if (a.type === 'race') setRoom({ name: 'race', mode: a.mode || 'bees', target: a.target, race: a.race, k });
    else if (a.type === 'generate') setRoom(ENV.get().ai === 'ready' ? { name: 'generate', sid: a.sid, k } : null);
    else setRoom(null);
  };
  const closeRoom = () => setRoom(null);
  const continueJourney = () => { const a = nextAction(S()); if (a.type === 'done') closeRoom(); else startAction(a); };
  const openStop = sid => setSheet({ type: 'stop', sid });
  const openRegion = li => setSheet({ type: 'region', li });
  const openFact = f => setSheet({ type: 'fact', ...f });
  const openPlayers = p => setSheet({ type: 'players', ...p });
  const openChallenges = () => setSheet({ type: 'challenges' });
  const challengePlayer = target => { setSheet(null); setRoom({ name: 'duel', mode: 'send', target, k: Date.now() }); };
  const playChallenge = c => { setSheet(null); setRoom({ name: 'duel', mode: 'answer', challenge: c, k: Date.now() }); };
  const racePlayer = target => { setSheet(null); setRoom({ name: 'race', mode: 'host', target, k: Date.now() }); };
  const joinRace = r => { setSheet(null); setRoom({ name: 'race', mode: 'guest', race: r, k: Date.now() }); };
  if (view && view.name === 'onboard') return html`<${Onboarding} done=${() => { setView(null); setTab('home'); }} go=${go} /><${Toasts} /><${UpdateBanner} />`;
  if (view && view.name === 'account') return html`<${AccountPage} go=${go} mode=${view.mode} /><${Toasts} /><${UpdateBanner} />`;
  const body = tab === 'map' ? html`<${MapTab} s=${s} mode=${mapMode} setMode=${setMapMode} go=${go} openStop=${openStop} openRegion=${openRegion} openFact=${openFact} openPlayers=${openPlayers} openChallenges=${openChallenges} />`
    : tab === 'practice' ? html`<${PracticeTab} s=${s} startAction=${startAction} openStop=${openStop} />`
    : tab === 'pass' ? html`<div class="page"><${Pass} go=${go} embedded /></div>`
    : tab === 'me' ? html`<${MeTab} go=${go} />`
    : html`<${HomeTab} s=${s} go=${go} startAction=${startAction} openStop=${openStop} openRegion=${openRegion} playChallenge=${playChallenge} openChallenges=${openChallenges} challengePlayer=${challengePlayer} racePlayer=${racePlayer} joinRace=${joinRace} />`;
  let roomEl = null;
  if (room && room.name === 'lesson') roomEl = html`<${Player} key=${room.k} lesson=${room.lesson} onExit=${closeRoom} onNext=${continueJourney} />`;
  else if (room && room.name === 'talk') roomEl = html`<${Talk} key=${room.k} sid=${room.sid} onExit=${closeRoom} onNext=${continueJourney} onRestart=${() => setRoom({ name: 'talk', sid: room.sid, k: Date.now() })} onGuided=${() => setRoom({ name: 'lesson', lesson: lessonGuided(room.sid), k: Date.now() })} />`;
  else if (room && room.name === 'quick') roomEl = html`<${Quick} key=${room.k} onExit=${closeRoom} />`;
  else if (room && room.name === 'duel') roomEl = html`<${DuelRoom} key=${room.k} mode=${room.mode} target=${room.target} challenge=${room.challenge} onExit=${closeRoom}
    onDecline=${room.challenge ? (async () => { try { await declineChallenge(room.challenge); toast(`You declined ${room.challenge.fromName}'s challenge`, 'swords'); } catch (e) { toast("Couldn't decline right now. Try again.", 'info'); } closeRoom(); }) : null} />`;
  else if (room && room.name === 'boss') roomEl = html`<${BossRoom} key=${room.k} sid=${room.sid} onExit=${closeRoom} onNext=${continueJourney} onAgain=${() => setRoom({ name: 'boss', sid: room.sid, k: Date.now() })} />`;
  else if (room && room.name === 'climb') roomEl = html`<${ClimbRoom} key=${room.k} onExit=${closeRoom} onNext=${continueJourney} onAgain=${() => setRoom({ name: 'climb', k: Date.now() })} />`;
  else if (room && room.name === 'race') roomEl = html`<${RaceRoom} key=${room.k} mode=${room.mode} target=${room.target} race=${room.race} onExit=${closeRoom} onAgain=${o => setRoom({ name: 'race', ...o, k: Date.now() })} />`;
  else if (room && room.name === 'generate') roomEl = html`<${Generate} key=${room.k} sid=${room.sid} onExit=${closeRoom} onReady=${lesson => setRoom({ name: 'lesson', lesson, k: Date.now() })} />`;
  return html`<div class=${cx('shell', 'tab-' + tab)}>
      <div class="wrap shell-top"><${TopBar} s=${s} go=${go} /></div>
      <main class="shell-main">${body}</main>
      <${TabBar} tab=${tab} setTab=${setTab} s=${s} />
    </div>
    ${roomEl}
    ${sheet && sheet.type === 'stop' ? html`<${StopSheet} key=${'s' + sheet.sid} sid=${sheet.sid} s=${s} onClose=${() => setSheet(null)} start=${startAction} />` : null}
    ${sheet && sheet.type === 'region' ? html`<${RegionSheet} key=${'r' + sheet.li} li=${sheet.li} s=${s} onClose=${() => setSheet(null)} openStop=${openStop} start=${startAction} />` : null}
    ${sheet && sheet.type === 'players' ? html`<${PlayersSheet} key=${'p' + sheet.sid} sid=${sheet.sid} players=${sheet.players} onClose=${() => setSheet(null)} onChallenge=${challengePlayer} onRace=${racePlayer} />` : null}
    ${sheet && sheet.type === 'challenges' ? html`<${ChallengesSheet} onClose=${() => setSheet(null)} onPlay=${playChallenge} />` : null}
    ${sheet && sheet.type === 'fact' ? html`<${FactSheet} key=${'f' + sheet.sid + sheet.i} s=${s} sid=${sheet.sid} i=${sheet.i} onClose=${() => setSheet(null)} openStop=${openStop} />` : null}
    ${news && !room && !sheet ? html`<${NewsSheet} s=${s} go=${go} onClose=${() => setNews(false)} />` : null}
    <${Toasts} /><${Celebrate} /><${UpdateBanner} />`;
}
