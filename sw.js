// sw.js - Versioned Service Worker for Daily Recovery App
const CACHE_NAME = 'recovery-app-v3'; // Increment version on every update
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install: cache files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing version 3...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate immediately
});

// Activate: remove old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating version 3...');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Control all clients immediately
});

// Fetch: respond with cache first, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
