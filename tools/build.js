// Build Surra two ways from the same source:
//   docs/            the installable web app (PWA) served by GitHub Pages: offline-ready, optional Firebase profiles
//   build/surra.html the single-page claude.ai artifact (progress syncs to the Claude account, live role-plays)
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const esbuild = require('esbuild');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'docs');
const ART = path.join(ROOT, 'build');
const NM = path.join(ROOT, 'node_modules');
const rd = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const write = (file, data) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, data); };
const kb = f => (fs.statSync(f).size / 1024).toFixed(1) + ' KB';

const map = JSON.parse(rd('mapdata.json'));
// colours for the pre-paint script, so a chosen theme shows from the first frame (no flash of the default palette)
function prepaint() {
  const vm = require('vm'); const ctx = {}; vm.createContext(ctx);
  vm.runInContext(rd('themes.js') + '\n;this.THEMES=THEMES;this.THEME_VARS=THEME_VARS;', ctx);
  const P = {}; for (const t of ctx.THEMES) P[t.id] = t.base ? { b: [t.light.bg, t.dark.bg] } : { l: t.light, d: t.dark };
  return `<script>try{(function(){var s=JSON.parse(localStorage.getItem('surra.progress.v1')||'null'),o=(s&&s.settings)||{},P=${JSON.stringify(P)},t=P[o.palette]||P.mysig,f=o.mode==='light'||o.mode==='dark',m=f?o.mode:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'),r=document.documentElement,c=t.b?{bg:t.b[m==='dark'?1:0]}:t[m==='dark'?'d':'l'];if(f)r.setAttribute('data-theme',m);if(!t.b)for(var k in c)r.style.setProperty('--'+k,c[k]);r.style.background=c.bg;r.style.colorScheme=m;var e=document.querySelectorAll('meta[name=theme-color]');for(var i=0;i<e.length;i++){e[i].setAttribute('content',c.bg);e[i].removeAttribute('media')}})()}catch(e){}</script>`;
}
const FILES = ['data_a.js', 'data_b.js', 'facts.js', 'life.js', '@map', 'core.js', 'journey.js', 'spoken.js', 'typing.js', 'bosses.js', 'climb.js', 'themes.js', 'account.js', 'community.js', 'race.js', 'notify.js', 'ui.js', 'ui_map.js', 'ui_account.js', 'ui_community.js', 'ui_notify.js', 'ui_type.js', 'ui_boss.js', 'ui_climb.js', 'ui_onboard.js', 'ui_shell.js', 'boot.js'];
function bundle(build) {
  return [
    '(function () {',
    `const BUILD = '${build}';`,
    "if (!window.htmPreact) { document.getElementById('app').innerHTML = '<div class=\"splash\"><div><div class=\"display\">Surra</div><p class=\"muted\">The page could not load its interface library. Check your connection and open it again.</p></div></div>'; return; }",
    ...FILES.map(f => (f === '@map' ? 'const MAP = ' + JSON.stringify(map) + ';' : rd(f))),
    '})();',
  ].join('\n');
}

async function buildPwa() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  // app script + styles
  const js = (await esbuild.transform(bundle('pwa'), { minify: true, target: 'es2019', legalComments: 'none' })).code;
  write(path.join(OUT, 'app.js'), js);
  const fontCss = [
    ['Caprasimo', 'normal', '400', 'caprasimo-latin-400-normal.woff2', 'latin'],
    ['Caprasimo', 'normal', '400', 'caprasimo-latin-ext-400-normal.woff2', 'ext'],
    ['Nunito', 'normal', '200 1000', 'nunito-latin-wght-normal.woff2', 'latin'],
    ['Nunito', 'normal', '200 1000', 'nunito-latin-ext-wght-normal.woff2', 'ext'],
    ['Nunito', 'italic', '200 1000', 'nunito-latin-wght-italic.woff2', 'latin'],
  ].map(([fam, style, weight, file, range]) => {
    const from = path.join(NM, file.startsWith('caprasimo') ? '@fontsource/caprasimo/files' : '@fontsource-variable/nunito/files', file);
    fs.mkdirSync(path.join(OUT, 'fonts'), { recursive: true });
    fs.copyFileSync(from, path.join(OUT, 'fonts', file));
    const ur = range === 'latin'
      ? 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
      : 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';
    return `@font-face{font-family:'${fam}';font-style:${style};font-display:swap;font-weight:${weight};src:url(fonts/${file}) format('woff2');unicode-range:${ur}}`;
  }).join('\n');
  const css = (await esbuild.transform(fontCss + '\n' + rd('style.css'), { loader: 'css', minify: true })).code;
  write(path.join(OUT, 'app.css'), css);
  // libraries
  fs.mkdirSync(path.join(OUT, 'vendor'), { recursive: true });
  fs.copyFileSync(path.join(NM, 'htm/preact/standalone.umd.js'), path.join(OUT, 'vendor/preact-htm.js'));
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'firebase-entry.js')], bundle: true, format: 'iife', globalName: 'SurraFirebase',
    minify: true, target: 'es2019', platform: 'browser', legalComments: 'none', outfile: path.join(OUT, 'vendor/firebase.js'), logLevel: 'warning',
  });
  // config, icons, manifest
  fs.copyFileSync(path.join(SRC, 'config.js'), path.join(OUT, 'config.js'));
  fs.mkdirSync(path.join(OUT, 'icons'), { recursive: true });
  for (const f of fs.readdirSync(path.join(SRC, 'icons'))) fs.copyFileSync(path.join(SRC, 'icons', f), path.join(OUT, 'icons', f));
  write(path.join(OUT, 'manifest.webmanifest'), JSON.stringify({
    name: 'Surra · Swedish conversation', short_name: 'Surra', id: './', start_url: './?source=app', scope: './',
    display: 'standalone', background_color: '#FCEFE6', theme_color: '#A93A2F', lang: 'en', dir: 'ltr', categories: ['education'],
    description: 'Travel Sweden from Malmö to Kiruna and learn to respond in real Swedish conversations, from fika small talk to job interviews. A1 to C1.',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }, null, 2));
  write(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Surra · Swedish conversation, A1 to C1</title>
<meta name="description" content="Travel Sweden from Malmö to Kiruna and learn to respond in real Swedish conversations, from fika small talk to job interviews. A1 to C1.">
<meta name="theme-color" content="#FCEFE6" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#16122A" media="(prefers-color-scheme: dark)">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Surra">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon.svg" type="image/svg+xml">
<link rel="icon" href="icons/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
${prepaint()}
<link rel="preload" href="fonts/nunito-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="app.css">
</head>
<body>
<div id="app"><div class="splash"><div><div class="display">Surra</div><p class="muted">Packing your bags for Malmö…</p></div></div></div>
<noscript><p style="padding:16px;font-family:sans-serif">Surra needs JavaScript to run.</p></noscript>
<script src="config.js"></script>
<script src="vendor/preact-htm.js"></script>
<script src="app.js"></script>
</body>
</html>
`);
  write(path.join(OUT, '.nojekyll'), '');
  // service worker: precache everything; the version changes whenever any file does
  const assets = [];
  const walk = d => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else assets.push(path.relative(OUT, p).split(path.sep).join('/')); } };
  walk(OUT);
  const list = assets.filter(a => !a.startsWith('.') && a !== 'sw.js').sort();
  const hash = crypto.createHash('sha256');
  list.forEach(a => hash.update(a).update(fs.readFileSync(path.join(OUT, a))));
  const version = hash.digest('hex').slice(0, 10);
  write(path.join(OUT, 'sw.js'), `// Surra service worker: works offline, updates when a new version is published.
const VERSION = '${version}';
const CACHE = 'surra-' + VERSION;
const ASSETS = ${JSON.stringify(['./', ...list])};
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('surra-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // sign-in and backup go straight to the network
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(r => r || fetch(req)).catch(() => fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
});
// push notifications from the Surra notifier: { title, body, tag, url }
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (er) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Surra', {
    body: d.body || '', tag: d.tag || undefined, renotify: !!d.tag, icon: 'icons/icon-192.png', badge: 'icons/badge-96.png',
    lang: 'en', timestamp: d.at || Date.now(), data: { url: d.url || './' },
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const win = wins.find(c => c.url.startsWith(self.registration.scope));
    if (win) { win.postMessage({ type: 'open', url }); try { await win.focus(); } catch (er) { /* already in front */ } return; }
    await self.clients.openWindow(url);
  })());
});
// the browser renewed the subscription: keep it going; the app saves the new one next time it opens
self.addEventListener('pushsubscriptionchange', e => {
  const opts = e.oldSubscription && e.oldSubscription.options;
  if (opts && opts.applicationServerKey) e.waitUntil(self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: opts.applicationServerKey }).catch(() => {}));
});
`);
  return { version, files: list.length };
}

function buildArtifact() {
  const LIB = 'https://cdn.jsdelivr.net/npm/htm@3.1.1/preact/standalone.umd.js';
  const page = lib => `<title>Surra</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Nunito:ital,wght@0,400..900;1,400..700&display=swap">
<style>
${rd('style.css')}
</style>
<div id="app"><div class="splash"><div><div class="display">Surra</div><p class="muted">Packing your bags for Malmö…</p></div></div></div>
<script src="${lib}"></script>
<script>
${bundle('artifact')}
</script>
`;
  write(path.join(ART, 'surra.html'), page(LIB));
  write(path.join(ART, 'test/index.html'), '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body>' + page('lib.js') + '</body></html>');
  fs.copyFileSync(path.join(NM, 'htm/preact/standalone.umd.js'), path.join(ART, 'test/lib.js'));
}

(async () => {
  const r = await buildPwa();
  buildArtifact();
  console.log(`docs/ (installable app): ${r.files} files, version ${r.version}`);
  console.log(`  app.js ${kb(path.join(OUT, 'app.js'))} · app.css ${kb(path.join(OUT, 'app.css'))} · firebase.js ${kb(path.join(OUT, 'vendor/firebase.js'))}`);
  console.log(`build/surra.html (artifact): ${kb(path.join(ART, 'surra.html'))}`);
})().catch(e => { console.error(e); process.exit(1); });
