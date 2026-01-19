// Service Worker for MarryLocal
// Simplified version to avoid potential issues

const CACHE_NAME = 'marrylocal-v4';
const STATIC_CACHE = 'marrylocal-static-v4';
const API_CACHE = 'marrylocal-api-v4';

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing.');
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        // Add other critical static assets here if needed
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating.');
  self.clients.claim();

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - handle caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and non-HTTP requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Don't intercept requests for JavaScript and CSS assets to avoid issues
  if (request.url.includes('.js') || request.url.includes('.css') || request.url.includes('/assets/')) {
    return; // Let the browser handle these directly
  }

  // Cache Google Fonts
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.open('google-fonts').then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(response => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Cache API responses
  if (url.origin === 'https://localm-api.dgsbuu.easypanel.host' && url.pathname.startsWith('/localm-api/')) {
    event.respondWith(
      caches.open(API_CACHE).then(cache => {
        return cache.match(request).then(response => {
          if (response) {
            return response;
          }
          return fetch(request).then(response => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(request).then(response => {
      if (response) {
        return response;
      }
      return fetch(request).then(response => {
        // Only cache static assets that are not JS/CSS
        if (request.method === 'GET' && response.status === 200 &&
            !request.url.includes('/assets/') &&
            !request.url.includes('.js') &&
            !request.url.includes('.css')) {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Return cached version if available, otherwise offline page
        return caches.match('/index.html');
      });
    })
  );
});

// Message event - handle cache clearing
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(names => {
      return Promise.all(names.map(name => caches.delete(name)));
    }).then(() => {
      event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
    });
  }
});