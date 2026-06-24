// public/sw.js
const CACHE_NAME = 'fs2-cache-v1';

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim all clients immediately so the service worker takes control right away
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip Next.js hot-reloading/development server requests and chrome-extensions
  if (
    request.url.includes('/_next/') ||
    request.url.includes('webpack') ||
    request.url.startsWith('chrome-extension:')
  ) {
    return;
  }

  // Network-First with Cache Fallback strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful same-origin responses
        if (response.status === 200 && request.url.startsWith(self.location.origin)) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network is unavailable
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback plain text if resource is not cached
          return new Response('You are currently offline. Please check your internet connection.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        });
      })
  );
});
