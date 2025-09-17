// Development Service Worker - Minimal Caching
const CACHE_NAME = 'aegrid-dev-v0.3.0';

// Only cache essential offline assets in development
const ESSENTIAL_ASSETS = ['/offline', '/manifest.json'];

// Install event - minimal caching for development
self.addEventListener('install', event => {
  console.log('🔧 Development Service Worker installing...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        console.log('Caching only essential assets for development');
        return cache.addAll(ESSENTIAL_ASSETS);
      })
      .then(() => {
        console.log('Development Service Worker installed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('🔧 Development Service Worker activating...');

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('🔧 Development Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - NO CACHING in development mode
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // In development, always fetch fresh content
  if (process.env.NODE_ENV === 'development' || url.hostname === 'localhost') {
    event.respondWith(
      fetch(request).catch(() => {
        // Only serve offline page for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline');
        }
        throw new Error('Network error');
      })
    );
    return;
  }

  // For production, use minimal caching
  event.respondWith(
    fetch(request).catch(() => {
      // Only serve from cache for essential assets
      if (ESSENTIAL_ASSETS.includes(url.pathname)) {
        return caches.match(request);
      }

      // For navigation requests, show offline page
      if (request.mode === 'navigate') {
        return caches.match('/offline');
      }

      throw new Error('Network error');
    })
  );
});

// Disable background sync in development
self.addEventListener('sync', _event => {
  console.log('🔧 Background sync disabled in development mode');
});

// Disable push notifications in development
self.addEventListener('push', _event => {
  console.log('🔧 Push notifications disabled in development mode');
});

// Disable notification clicks in development
self.addEventListener('notificationclick', _event => {
  console.log('🔧 Notification clicks disabled in development mode');
});
