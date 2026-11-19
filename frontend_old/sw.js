self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Basic pass-through; can be expanded for offline caching later.
self.addEventListener('fetch', () => {});
