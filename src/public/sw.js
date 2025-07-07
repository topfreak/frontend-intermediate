importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js"
);

if (workbox) {
  workbox.precaching.precacheAndRoute([
    { url: "/", revision: null },
    { url: "/index.html", revision: null },
    { url: "/app.bundle.js", revision: null },
    { url: "/manifest.json", revision: null },
    { url: "/images/logo-192x192.png", revision: null },
    { url: "/images/logo-512x512.png", revision: null },
    { url: "/favicon.png", revision: null },
    { url: "/libs/feather.min.js", revision: null },
  ]);

  // Cache first untuk file statis (CSS, JS, gambar)
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === "style" ||
      request.destination === "script" ||
      request.destination === "image",
    new workbox.strategies.CacheFirst({
      cacheName: "static-resources",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        }),
      ],
    })
  );

  // Network first untuk API Dicoding
  workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://story-api.dicoding.dev",
    new workbox.strategies.NetworkFirst({
      cacheName: "api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 hari
        }),
      ],
    })
  );

  // Fallback offline page (opsional)
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === "document") {
      return caches.match("/index.html");
    }
    return Response.error();
  });

  // Push notification handler
  self.addEventListener("push", (event) => {
    const payload = event.data
      ? event.data.json()
      : { title: "Notifikasi", options: {} };
    event.waitUntil(
      self.registration.showNotification(payload.title, payload.options)
    );
  });

  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
  });
} else {
  console.log("Workbox gagal dimuat");
}
