const C = 'quran-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(['./', './index.html', './manifest.json'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.url.includes('/audio/')) return;
  // network-first, fall back to cache (surahs you've opened work offline)
  e.respondWith(
    fetch(r).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => caches.match(r))
  );
});
