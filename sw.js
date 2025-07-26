// Service Worker for Contrail Coffee & Chocolate
// プッシュ通知機能のみ

// Service Worker インストール
self.addEventListener('install', (event) => {
  // 即座にアクティブ化
  self.skipWaiting();
});

// Service Worker アクティベーション
self.addEventListener('activate', (event) => {
  // 古いキャッシュを削除
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 既存のキャッシュを全て削除
          return caches.delete(cacheName);
        })
      );
    })
  );
  
  // 全てのクライアントを制御
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
