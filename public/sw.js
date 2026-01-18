//https://www.youtube.com/watch?v=dQNkufTnA-k&t=1s&ab_channel=ImranSayed-CodeytekAcademy
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-core.prod.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-precaching.prod.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-routing.prod.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-expiration.prod.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-strategies.prod.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-cacheable-response.prod.js');

workbox.core.clientsClaim();
self.skipWaiting();

workbox.precaching.cleanupOutdatedCaches();
// Removed precacheAndRoute since manifest is not injected

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
// @see https://developers.google.com/web/tools/workbox/guides/common-recipes#google_fonts
workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://fonts.googleapis.com',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
    })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
// @see https://developers.google.com/web/tools/workbox/guides/common-recipes#google_fonts
workbox.routing.registerRoute(
({url}) => url.origin === 'https://fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

/**
 * We use CacheFirst for images because, images are not going to change very often,
 * so it does not make sense to revalidate images on every request.
 *
 * @see https://developers.google.com/web/tools/workbox/guides/common-recipes#caching_images
 */

/*
registerRoute(
({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images',
        plugins: [
            new CacheableResponsePlugin({
                    statuses: [0, 200],
                }),
            new ExpirationPlugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                }),
        ],
    }),
);*/

// @see https://developers.google.com/web/tools/workbox/guides/common-recipes#cache_css_and_javascript_files
workbox.routing.registerRoute(
({request}) => request.destination === 'script' ||
    request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'static-resources',
    })
);
  

workbox.routing.registerRoute(
    ({url}) => url.origin === 'https://localm-api.dgsbuu.easypanel.host' &&
               url.pathname.startsWith('/localm-api/'),

    new workbox.strategies.CacheFirst({
      cacheName: 'api-cache',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200, 404],
        })
      ]
    })
  );

  