// Service Worker for Contrail Coffee & Chocolate
// キャッシュ戦略: 高速読み込み対応

const CACHE_NAME = 'contrail-v1.3.0';
const STATIC_CACHE = 'contrail-static-v1.3.0';
const DYNAMIC_CACHE = 'contrail-dynamic-v1.3.0';

// キャッシュ有効期限設定（ミリ秒）
const CACHE_EXPIRY = {
  STATIC: 5 * 60 * 1000,   // 静的リソース: 5分
  HTML: 5 * 60 * 1000,     // HTML: 5分
  DYNAMIC: 5 * 60 * 1000   // その他: 5分
};

// キャッシュする静的リソース
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  // 画像リソース
  '/assets/images/contrail-logo-transparent.png',
  '/assets/images/contrail-line.png',
  '/assets/images/contrail-main.png',
  '/assets/images/contrail-dot.png',
  '/assets/images/concept-image.png',
  // 外部CSS（Google Fonts）
  'https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;700&family=Noto+Sans+JP:wght@300;400;500&display=swap'
];

// キャッシュエントリにタイムスタンプを追加
function addTimestampToResponse(response, expiryTime) {
  const responseClone = response.clone();
  const headers = new Headers(responseClone.headers);
  headers.set('sw-cache-timestamp', Date.now().toString());
  headers.set('sw-cache-expiry', expiryTime.toString());
  
  return new Response(responseClone.body, {
    status: responseClone.status,
    statusText: responseClone.statusText,
    headers: headers
  });
}

// キャッシュの有効期限をチェック
function isCacheExpired(cachedResponse, maxAge) {
  const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
  if (!cacheTimestamp) return true; // タイムスタンプがない場合は期限切れとみなす
  
  const age = Date.now() - parseInt(cacheTimestamp);
  return age > maxAge;
}

// Service Worker インストール
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(() => {
      // キャッシュ失敗時は無視
    })
  );

  // 即座にアクティブ化
  self.skipWaiting();
});



// フェッチイベント - キャッシュ戦略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 外部リソース（Google Fonts, CDN）の処理
  if (!url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      }).catch(() => {
        // 外部リソース取得失敗時は無視
      })
    );
    return;
  }

  // 静的リソース: Cache First Strategy with Expiry
  if (STATIC_ASSETS.includes(url.pathname) ||
      request.destination === 'image' ||
      request.destination === 'script' ||
      request.destination === 'style') {

    event.respondWith(
      caches.match(request).then((response) => {
        // キャッシュがあり、有効期限内の場合
        if (response && !isCacheExpired(response, CACHE_EXPIRY.STATIC)) {
          return response;
        }

        // キャッシュが期限切れまたは存在しない場合、新しくフェッチ
        return fetch(request).then((fetchResponse) => {
          if (fetchResponse.status === 200) {
            const timestampedResponse = addTimestampToResponse(fetchResponse, CACHE_EXPIRY.STATIC);
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, timestampedResponse);
            });
          }
          return fetchResponse;
        }).catch(() => {
          // ネットワーク失敗時は期限切れでもキャッシュを返す
          return response || Response.error();
        });
      })
    );
    return;
  }

  // HTML: Network First Strategy with Expiry (最新情報を優先)
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request).then((response) => {
        if (response.status === 200) {
          const timestampedResponse = addTimestampToResponse(response, CACHE_EXPIRY.HTML);
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, timestampedResponse);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          // キャッシュが有効期限内または期限切れでもネットワーク失敗時は返す
          if (cachedResponse) {
            return cachedResponse;
          }
          return caches.match('/index.html');
        });
      })
    );
    return;
  }

  // その他: Network First with Cache Fallback and Expiry
  event.respondWith(
    fetch(request).then((response) => {
      if (response.status === 200) {
        const timestampedResponse = addTimestampToResponse(response, CACHE_EXPIRY.DYNAMIC);
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, timestampedResponse);
        });
      }
      return response;
    }).catch(() => {
      return caches.match(request).then((cachedResponse) => {
        // ネットワーク失敗時は期限切れでもキャッシュを返す
        return cachedResponse || Response.error();
      });
    })
  );
});

// 期限切れキャッシュのクリーンアップ
async function cleanExpiredCache() {
  const cacheNames = await caches.keys();
  
  for (const cacheName of cacheNames) {
    if (cacheName === STATIC_CACHE || cacheName === DYNAMIC_CACHE) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const cacheTimestamp = response.headers.get('sw-cache-timestamp');
          const cacheExpiry = response.headers.get('sw-cache-expiry');
          
          if (cacheTimestamp && cacheExpiry) {
            const age = Date.now() - parseInt(cacheTimestamp);
            if (age > parseInt(cacheExpiry)) {
              await cache.delete(request);
            }
          }
        }
      }
    }
  }
}

// バックグラウンド同期（キャッシュクリーンアップ）
self.addEventListener('sync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanExpiredCache());
  }
});

// Service Worker アクティベーション（キャッシュクリーンアップ含む）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // 古いキャッシュ削除
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // 期限切れキャッシュクリーンアップ
      cleanExpiredCache()
    ])
  );
  
  self.clients.claim();
});

// プッシュ通知（将来の拡張用）
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Contrailからのお知らせです',
    icon: '/assets/images/contrail-logo-transparent.png',
    badge: '/assets/images/contrail-logo-transparent.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'サイトを開く',
        icon: '/assets/images/contrail-logo-transparent.png'
      },
      {
        action: 'close',
        title: '閉じる'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Contrail Coffee & Chocolate', options)
  );
});

// 通知クリック処理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
