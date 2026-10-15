// Surra service worker: works offline, updates when a new version is published.
const VERSION = '93d1e354c2';
const CACHE = 'surra-' + VERSION;
const ASSETS = ["./","app.css","app.js","config.js","fonts/caprasimo-latin-400-normal.woff2","fonts/caprasimo-latin-ext-400-normal.woff2","fonts/nunito-latin-ext-wght-normal.woff2","fonts/nunito-latin-wght-italic.woff2","fonts/nunito-latin-wght-normal.woff2","icons/apple-touch-icon.png","icons/favicon-32.png","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","icons/maskable-512.png","index.html","manifest.webmanifest","vendor/firebase.js","vendor/preact-htm.js"];
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
