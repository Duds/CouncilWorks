const CACHE_NAME = 'aegrid-v1.0.0';
const OFFLINE_URL = '/offline';

// Assets to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/mobile/dashboard',
  '/mobile/assets',
  '/mobile/inspections',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/assets',
  '/api/rcm-templates',
  '/api/maintenance/schedule'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.ok && shouldCacheAPI(url.pathname)) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // Serve from cache when offline
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Return offline response for API calls
              return new Response(
                JSON.stringify({ 
                  error: 'Offline', 
                  message: 'This request is not available offline' 
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Handle other requests
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then((response) => {
            // Cache static assets
            if (shouldCacheAsset(url.pathname)) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            throw new Error('Network error');
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'inspection-sync') {
    event.waitUntil(syncInspections());
  } else if (event.tag === 'asset-sync') {
    event.waitUntil(syncAssets());
  }
});

// Push notifications for maintenance reminders
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New maintenance task available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Aegrid Maintenance', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/mobile/maintenance')
    );
  }
});

// Helper functions
function shouldCacheAPI(pathname) {
  return API_CACHE_PATTERNS.some(pattern => pathname.startsWith(pattern));
}

function shouldCacheAsset(pathname) {
  return (
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2')
  );
}

// Sync functions for offline data
async function syncInspections() {
  try {
    console.log('Syncing offline inspections...');
    
    // Get offline inspections from IndexedDB
    const offlineInspections = await getOfflineData('inspections');
    
    for (const inspection of offlineInspections) {
      if (inspection.syncStatus === 'pending') {
        try {
          const response = await fetch('/api/inspections', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(inspection.data)
          });

          if (response.ok) {
            // Mark as synced
            await updateOfflineData('inspections', inspection.id, {
              syncStatus: 'synced',
              syncedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Failed to sync inspection:', error);
        }
      }
    }
  } catch (error) {
    console.error('Sync inspections failed:', error);
  }
}

async function syncAssets() {
  try {
    console.log('Syncing offline assets...');
    
    // Get offline asset updates from IndexedDB
    const offlineAssets = await getOfflineData('assets');
    
    for (const asset of offlineAssets) {
      if (asset.syncStatus === 'pending') {
        try {
          const response = await fetch(`/api/assets/${asset.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(asset.data)
          });

          if (response.ok) {
            // Mark as synced
            await updateOfflineData('assets', asset.id, {
              syncStatus: 'synced',
              syncedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('Failed to sync asset:', error);
        }
      }
    }
  } catch (error) {
    console.error('Sync assets failed:', error);
  }
}

// IndexedDB helper functions (simplified)
async function getOfflineData(storeName) {
  // This would interact with IndexedDB
  // For now, return empty array
  return [];
}

async function updateOfflineData(storeName, id, updates) {
  // This would update IndexedDB
  // For now, just log
  console.log(`Updating ${storeName} ${id}:`, updates);
}
