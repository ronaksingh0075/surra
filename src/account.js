/* ================= Surra accounts: optional email sign-up with verification (installable app only) =================
   Guests learn on this device. Signing up sends a verification email; once verified, progress is backed up to
   Firestore at users/{uid} and follows the person across devices. Without a Firebase config this file is inert. */
const NAV = { go: null };
// off | loading | unavailable | guest | unverified | ready. With profiles set up it starts as loading, before the first render
const ACCT = cell({ status: accountsConfig() ? 'loading' : 'off', user: null, sync: null, syncedAt: 0 });
const setAcct = p => ACCT.set({ ...ACCT.get(), ...p });
const acct = { F: null, auth: null, db: null, retry: 0 };
const appUrl = () => location.origin + location.pathname.replace(/index\.html$/, '');
const errCode = e => String((e && e.code) || (e && e.message) || '');

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src; el.async = true;
    el.onload = resolve; el.onerror = () => { el.remove(); reject(new Error('Could not load ' + src)); };
    document.head.appendChild(el);
  });
}
function accountsConfig() {
  const c = window.SURRA_CONFIG && window.SURRA_CONFIG.firebase;
  return BUILD === 'pwa' && c && c.apiKey && c.projectId ? c : null;
}
async function initAccount() {
  const cfg = accountsConfig();
  if (!cfg) return; // accounts not set up: device-only, the UI hides everything account-related
  setAcct({ status: 'loading' });
  try { if (!window.SurraFirebase) await loadScript('vendor/firebase.js'); }
  catch (e) {
    setAcct({ status: 'unavailable' });
    window.addEventListener('online', () => initAccount(), { once: true });
    return;
  }
  const F = window.SurraFirebase;
  if (!acct.F) {
    const app = F.initializeApp(cfg);
    acct.F = F;
    acct.auth = F.initializeAuth(app, { persistence: [F.indexedDBLocalPersistence, F.browserLocalPersistence] });
    acct.db = F.getFirestore(app);
    const em = window.SURRA_CONFIG.emulators;
    if (em) {
      if (em.auth) F.connectAuthEmulator(acct.auth, em.auth, { disableWarnings: true });
      if (em.firestore) F.connectFirestoreEmulator(acct.db, em.firestore[0], em.firestore[1]);
    }
    F.onAuthStateChanged(acct.auth, u => { onUser(u).catch(() => { /* handled inside */ }); });
    const back = () => {
      if (document.visibilityState !== 'visible') return;
      const st = ACCT.get().status;
      if (st === 'unverified') checkVerified(true);
      else if (st === 'ready') pullCloud();
    };
    document.addEventListener('visibilitychange', back);
    window.addEventListener('focus', back);
  }
}

/* ---------- auth state */
function userInfo(u) {
  return { uid: u.uid, email: u.email || '', name: u.displayName || '', verified: !!u.emailVerified, since: (u.metadata && u.metadata.creationTime) || '' };
}
async function onUser(u) {
  if (!u) { detachRemote(); setAcct({ status: 'guest', user: null, sync: null }); return; }
  if (!u.emailVerified) { detachRemote(); setAcct({ status: 'unverified', user: userInfo(u), sync: null }); return; }
  setAcct({ status: 'ready', user: userInfo(u), sync: 'connecting' });
  await attachCloud(u.uid);
}

/* ---------- progress in the cloud */
function cloudRef(uid) {
  const F = acct.F, d = F.doc(acct.db, 'users', uid);
  return {
    async get() {
      const snap = await F.getDoc(d);
      if (!snap.exists()) return { exists: false };
      let p = null;
      try { p = JSON.parse(snap.get('progress')); } catch (e) { p = null; }
      return p && typeof p === 'object' ? { exists: true, data: () => p } : { exists: false };
    },
    set: state => F.setDoc(d, { progress: JSON.stringify(state), updatedAt: F.serverTimestamp(), v: 1 }),
    remove: () => F.deleteDoc(d),
  };
}
const pristine = s => !s.onboarded || (!totalKm(s) && !Object.keys(s.lessons).length);
/* Guest progress made on this device + the account's progress: lessons keep the best stars, totals add up.
   Trip kilometres follow from the merged stars; detours and challenge results add up. */
function mergeStates(acc, guest) {
  const m = $clone(acc);
  m.onboarded = acc.onboarded || guest.onboarded;
  if (!acc.onboarded) { m.start = guest.start; m.goal = guest.goal; m.settings = $clone(guest.settings); }
  m.extraKm = (Number(acc.extraKm) || 0) + (Number(guest.extraKm) || 0);
  m.detour = [acc.detour, guest.detour].filter(d => d && d.d === today()).reduce((a, d) => ({ d: d.d, n: a.n + d.n }), { d: today(), n: 0 });
  for (const [k, v] of Object.entries(guest.lessons)) m.lessons[k] = Math.max(m.lessons[k] || 0, v);
  for (const k of Object.keys(guest.checkpoints)) if (guest.checkpoints[k]) m.checkpoints[k] = true;
  for (const k of Object.keys(guest.cpTried)) if (guest.cpTried[k]) m.cpTried[k] = true;
  for (const [k, v] of Object.entries(guest.ach)) m.ach[k] = m.ach[k] ? Math.min(m.ach[k], v) : v;
  for (const [k, v] of Object.entries(guest.mistakes)) if (!m.mistakes[k] || (v.t || 0) > (m.mistakes[k].t || 0)) m.mistakes[k] = v;
  for (const [d, v] of Object.entries(guest.log)) m.log[d] = (m.log[d] || 0) + v;
  // boss bees: a win on either device counts; the first race's head start counts once
  m.bosses = m.bosses || {};
  for (const [k, v] of Object.entries(guest.bosses || {})) {
    const a = m.bosses[k] || {}, won = [a.won, v.won].filter(Boolean), best = [a.best, v.best].filter(Boolean);
    m.bosses[k] = { won: won.length ? Math.min(...won) : 0, tries: (a.tries || 0) + (v.tries || 0), ...(best.length ? { best: Math.min(...best) } : {}) };
  }
  // Kebnekaise: the highest camp and best height on either device, the earliest summit and win
  const ca = acc.climb || {}, cg = guest.climb || {}, first = (x, y) => (x && y ? Math.min(x, y) : x || y || 0);
  m.climb = { camp: Math.max(ca.camp || 0, cg.camp || 0), best: Math.max(ca.best || 0, cg.best || 0), tries: (ca.tries || 0) + (cg.tries || 0),
    summit: first(ca.summit, cg.summit), queen: first(ca.queen, cg.queen), queenTries: (ca.queenTries || 0) + (cg.queenTries || 0) };
  if (acc.intro && guest.intro) m.extraKm -= Number(guest.intro.km) || 0;
  m.intro = acc.intro || guest.intro || null;
  ['answers', 'correct', 'talks', 'ownGood', 'perfect', 'fixed', 'typed', 'races', 'raceWins'].forEach(k => { m.stats[k] = (acc.stats[k] || 0) + (guest.stats[k] || 0); });
  ['bestCombo', 'quickBest', 'bestWpm'].forEach(k => { m.stats[k] = Math.max(acc.stats[k] || 0, guest.stats[k] || 0); });
  if (!m.profile.name && guest.profile.name) m.profile = $clone(guest.profile);
  m.createdAt = Math.min(acc.createdAt || Date.now(), guest.createdAt || Date.now());
  return m;
}
async function attachCloud(uid) {
  const ref = cloudRef(uid);
  let snap;
  try { snap = await ref.get(); }
  catch (e) {
    setAcct({ sync: 'offline' });
    clearTimeout(acct.retry);
    acct.retry = setTimeout(() => { if (ACCT.get().status === 'ready') attachCloud(uid); }, 15000);
    return;
  }
  if (ACCT.get().status !== 'ready' || ACCT.get().user.uid !== uid) return; // signed out meanwhile
  const local = STORE.get();
  let next, upload = true;
  if (!snap.exists) next = local;
  else {
    const remote = withDefaults($clone(snap.data()));
    if (local.owner === uid) next = (local.updatedAt || 0) > (remote.updatedAt || 0) ? local : remote;
    else if (local.owner || pristine(local)) next = remote;             // another account's progress, or nothing yet on this device
    else { next = mergeStates(remote, local); toast('Your guest progress was added to your account', 'cloud'); }
    upload = next !== remote;
  }
  next = withDefaults($clone(next));
  next.owner = uid;
  const u = acct.auth.currentUser;
  if (!next.profile.name && u && u.displayName) next.profile.name = u.displayName;
  if (next !== local) { STORE.set(next); writeLocal(next); }
  sync.ref = ref; sync.kind = 'cloud'; sync.mode = 'db';
  if (upload || next.owner !== (snap.exists ? snap.data().owner : null)) { sync.pending = next; flushSync(); }
  else { setEnv({ sync: 'cloud' }); onCloudSaved(); }
}
/* Coming back to the app: pick up progress made on another device. */
let pulling = false;
async function pullCloud() {
  if (pulling || sync.kind !== 'cloud' || !sync.ref || sync.pending) return;
  pulling = true;
  try {
    const snap = await sync.ref.get();
    if (snap.exists && sync.kind === 'cloud' && !sync.pending) {
      const remote = withDefaults($clone(snap.data()));
      if ((remote.updatedAt || 0) > (STORE.get().updatedAt || 0)) { STORE.set(remote); writeLocal(remote); }
    }
  } catch (e) { /* offline: try again next time */ }
  finally { pulling = false; }
}
function onCloudSaved() { setAcct({ sync: 'saved', syncedAt: Date.now() }); }
function onCloudSaveFailed(code, retrying) { setAcct({ sync: retrying ? 'offline' : 'error', syncErr: code }); }

/* ---------- actions (each throws a Firebase error the UI turns into a sentence) */
async function sendVerification(u) {
  try { await acct.F.sendEmailVerification(u, { url: appUrl() }); }
  catch (e) { if (/continue-uri|unauthorized-domain/.test(errCode(e))) await acct.F.sendEmailVerification(u); else throw e; }
}
async function signUp(name, email, password) {
  const cred = await acct.F.createUserWithEmailAndPassword(acct.auth, email.trim(), password);
  if (name) {
    update(s => { s.profile.name = name; });
    try { await acct.F.updateProfile(cred.user, { displayName: name }); } catch (e) { /* the name also lives in progress */ }
  }
  setAcct({ user: userInfo(cred.user) });
  await sendVerification(cred.user);
  setAcct({ verifySentAt: Date.now() });
}
const signIn = (email, password) => acct.F.signInWithEmailAndPassword(acct.auth, email.trim(), password);
async function resetPassword(email) {
  try { await acct.F.sendPasswordResetEmail(acct.auth, email.trim(), { url: appUrl() }); }
  catch (e) { if (/continue-uri|unauthorized-domain/.test(errCode(e))) await acct.F.sendPasswordResetEmail(acct.auth, email.trim()); else throw e; }
}
async function resendVerification() {
  const u = acct.auth.currentUser; if (!u) return;
  await sendVerification(u);
  setAcct({ verifySentAt: Date.now() });
}
async function checkVerified(silent) {
  const u = acct.auth && acct.auth.currentUser; if (!u) return false;
  try { await u.reload(); } catch (e) { if (silent) return false; throw e; }
  if (!u.emailVerified) { setAcct({ user: userInfo(u) }); return false; }
  try { await u.getIdToken(true); } catch (e) { /* refreshed on the next request */ }
  await onUser(u);
  return true;
}
function keepDeviceSettings() {
  const cur = STORE.get(), f = freshState();
  f.onboarded = cur.onboarded; f.start = cur.start; f.goal = cur.goal; f.settings = $clone(cur.settings);
  STORE.set(f); writeLocal(f);
}
async function signOutAccount() {
  if (ACCT.get().status === 'ready') { await flushNow(); await forgetDevicePush(); }
  const wasReady = ACCT.get().status === 'ready';
  detachRemote();
  await acct.F.signOut(acct.auth);
  if (wasReady) keepDeviceSettings(); // the progress stays in the account; this device starts fresh
}
async function deleteAccount(password) {
  const F = acct.F, u = acct.auth.currentUser; if (!u) return;
  await F.reauthenticateWithCredential(u, F.EmailAuthProvider.credential(u.email, password));
  await purgeCommunity(u.uid);
  await forgetNotify(u.uid);
  const ref = cloudRef(u.uid);
  detachRemote();
  try { await ref.remove(); } catch (e) { /* the account is removed regardless */ }
  await F.deleteUser(u);
  keepDeviceSettings();
}
function saveProfile(p) {
  update(s => { s.profile = { ...s.profile, ...p }; });
  const u = acct.auth && acct.auth.currentUser;
  if (u && p.name != null && p.name !== u.displayName) acct.F.updateProfile(u, { displayName: p.name }).catch(() => { /* kept in progress */ });
}
function authMessage(e) {
  const c = errCode(e);
  const M = {
    'auth/email-already-in-use': 'That email already has a Surra account. Sign in instead.',
    'auth/invalid-email': "That email address doesn't look right.",
    'auth/missing-email': 'Enter your email address.',
    'auth/weak-password': 'Choose a password with at least 8 characters.',
    'auth/password-does-not-meet-requirements': 'Choose a longer password with at least 8 characters.',
    'auth/missing-password': 'Enter your password.',
    'auth/invalid-credential': 'Email or password is wrong.',
    'auth/invalid-login-credentials': 'Email or password is wrong.',
    'auth/wrong-password': 'Email or password is wrong.',
    'auth/user-not-found': 'Email or password is wrong.',
    'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
    'auth/network-request-failed': 'No connection. Check your internet and try again.',
    'auth/requires-recent-login': 'For your safety, enter your password again.',
    'auth/user-disabled': 'This account has been switched off.',
    'auth/operation-not-allowed': "Email sign-in isn't switched on for this app yet.",
    'auth/quota-exceeded': 'The email service is busy right now. Try again later.',
    'auth/user-token-expired': 'Please sign in again.',
  };
  return M[c] || 'Something went wrong. Please try again.';
}

/* ---------- installing the app and picking up new versions */
const INSTALL = cell({ can: false, standalone: false, ios: false });
const UPDATE = cell(null);
let installEvt = null;
function initInstall() {
  if (BUILD !== 'pwa') return;
  const standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  INSTALL.set({ can: false, standalone, ios });
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; INSTALL.set({ ...INSTALL.get(), can: true }); });
  window.addEventListener('appinstalled', () => { installEvt = null; INSTALL.set({ ...INSTALL.get(), can: false, standalone: true }); toast('Surra is on your home screen', 'download'); });
}
async function promptInstall() {
  if (!installEvt) return;
  installEvt.prompt();
  try { await installEvt.userChoice; } catch (e) { /* dismissed */ }
  installEvt = null; INSTALL.set({ ...INSTALL.get(), can: false });
}
function initServiceWorker() {
  if (BUILD !== 'pwa' || !('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  let reloading = false, wanted = false;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (wanted && !reloading) { reloading = true; location.reload(); return; }
    if (hadController && !reloading) UPDATE.set(() => { reloading = true; location.reload(); }); // a new version took over in the background
  });
  navigator.serviceWorker.register('sw.js').then(reg => {
    const offer = w => UPDATE.set(() => { wanted = true; w.postMessage('skip'); });
    if (reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing; if (!w) return;
      w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) offer(w); });
    });
    let last = Date.now();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && Date.now() - last > 3600e3) { last = Date.now(); reg.update().catch(() => { /* offline */ }); }
    });
  }).catch(() => { /* runs fine without offline support */ });
}
