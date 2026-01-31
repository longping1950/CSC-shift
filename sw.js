const CACHE_NAME = 'csc-shift-v3';
// 使用相對路徑 ./ 以相容 GitHub Pages 子目錄
const urlsToCache = [
  './shift.html',
  './schedule.html',
  './manifest.json',
  './web/favicon.ico',
  './web/icon-192.png',
  './web/icon-512.png',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  // 強制讓 Service Worker 立即進入 waiting 狀態，不需等待舊的 SW 停止
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Cache addAll error: ', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    Promise.all([
      // 清理舊的快取
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // 讓 Service Worker 立即接管所有頁面，不需重新整理
      self.clients.claim()
    ])
  );
});