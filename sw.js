var CACHE_NAME = 'gate-alert-v1';
var ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './icon.svg',
  './manifest.json',
];

// Install — cache all assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (response) {
        // Cache new successful requests
        if (response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    }).catch(function () {
      // If both cache and network fail, return a basic offline page
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
