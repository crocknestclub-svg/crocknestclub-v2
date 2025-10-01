self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.open('cnc-static-v1').then(async (cache) => {
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req).catch(() => undefined);
      if (res && res.ok && (req.url.startsWith(self.origin) || req.destination === 'image')) {
        cache.put(req, res.clone());
      }
      return res || new Response('Offline', { status: 503 });
    })
  );
});

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data?.json() || {}; } catch {}
  const title = data.title || 'Crocknestclub';
  const options = { body: data.message || 'New notification', icon: '/favicon.ico' };
  event.waitUntil(self.registration.showNotification(title, options));
});


