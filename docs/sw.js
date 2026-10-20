// Surra service worker: works offline, updates when a new version is published.
const VERSION = '168f13ec49';
const CACHE = 'surra-' + VERSION;
const ASSETS = ["./","app.css","app.js","config.js","fonts/caprasimo-latin-400-normal.woff2","fonts/caprasimo-latin-ext-400-normal.woff2","fonts/nunito-latin-ext-wght-normal.woff2","fonts/nunito-latin-wght-italic.woff2","fonts/nunito-latin-wght-normal.woff2","icons/apple-touch-icon.png","icons/badge-96.png","icons/badge.svg","icons/favicon-32.png","icons/icon-192.png","icons/icon-512.png","icons/icon.svg","icons/maskable-512.png","index.html","manifest.webmanifest","vendor/firebase.js","vendor/preact-htm.js"];
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
