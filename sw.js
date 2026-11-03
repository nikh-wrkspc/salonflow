// SalonFlow PWA Service Worker (Network-First Strategy for Instant Netlify Updates)
const CACHE_NAME = 'salonflow-cache-v3-' + Date.now();
const ASSETS_TO_CACHE = [
  './',
  './saloonflow.html',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/store.js',
  './js/pages.js',
  './js/app.js',
  './js/config.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Purging old PWA cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First with Cache Fallback: Always gets fresh Netlify updates
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((networkRes) => {
      if (networkRes && networkRes.status === 200) {
        const resClone = networkRes.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
      }
      return networkRes;
    }).catch(() => {
      return caches.match(e.request).then((cached) => {
        return cached || caches.match('./index.html') || caches.match('./saloonflow.html');
      });
    })
  );
});

// Handle PWA Push Alerts
self.addEventListener('push', (event) => {
  let data = { title: 'SalonFlow Live Queue Alert', body: 'You have an update on your salon token!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const iconUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='28' fill='%230a0a0c'/%3E%3Crect x='8' y='8' width='84' height='84' rx='22' fill='%23818cf8'/%3E%3Ctext x='50' y='65' font-family='sans-serif' font-weight='900' font-style='italic' font-size='46' text-anchor='middle' fill='%23000'%3Esf%3C/text%3E%3C/svg%3E";

  const options = {
    body: data.body,
    icon: iconUrl,
    badge: iconUrl,
    vibrate: [200, 100, 200, 100, 200],
    tag: 'sf-queue-status',
    renotify: true,
    data: { url: data.url || './#token' }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click brings user straight to active token
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || './#token';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          if ('navigate' in client) client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Allow Web Page to trigger SW Notifications directly via postMessage
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const iconUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='28' fill='%230a0a0c'/%3E%3Crect x='8' y='8' width='84' height='84' rx='22' fill='%23818cf8'/%3E%3Ctext x='50' y='65' font-family='sans-serif' font-weight='900' font-style='italic' font-size='46' text-anchor='middle' fill='%23000'%3Esf%3C/text%3E%3C/svg%3E";
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: iconUrl,
      badge: iconUrl,
      vibrate: [200, 100, 200],
      tag: 'sf-live-alert',
      renotify: true,
      data: { url: event.data.url || './#token' }
    });
  }
});
