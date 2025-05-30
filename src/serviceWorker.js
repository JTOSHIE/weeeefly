/* eslint-env serviceworker */

const CACHE_NAME = 'weeeefly-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/bundle.js',
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone the response before caching
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // Return cached API response if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }

        return fetch(request).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Background sync for failed form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'flight-search') {
    event.waitUntil(
      // Get all pending searches from IndexedDB
      getAllPendingSearches()
        .then(searches => {
          return Promise.all(
            searches.map(search => {
              return fetch('/api/search', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(search)
              })
              .then(() => {
                // Remove from pending after successful sync
                return removePendingSearch(search.id);
              })
              .catch(err => {
                console.error('Background sync failed:', err);
              });
            })
          );
        })
    );
  }
});

// Helper functions for IndexedDB operations
function getAllPendingSearches() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('weeeefly-db', 1);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['pending-searches'], 'readonly');
      const store = transaction.objectStore('pending-searches');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

function removePendingSearch(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('weeeefly-db', 1);
    
    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction(['pending-searches'], 'readwrite');
      const store = transaction.objectStore('pending-searches');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject(deleteRequest.error);
      };
    };
    
    request.onerror = () => {
      reject(request.error);
    };
  });
}

// Listen for skip waiting message
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});