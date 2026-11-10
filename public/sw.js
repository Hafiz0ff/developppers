// Maskani PWA Service Worker v3 - Instant update & offline fallback
const CACHE_NAME = "maskani-v3";
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/apple-touch-icon.png",
  "/favicon.png",
];

// Install: pre-cache essential icons & immediately activate
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((err) => console.warn("[SW] Cache addAll warning:", err))
  );
});

// Activate: clean up ALL old caches (including maskani-v1) immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[SW] Deleting stale cache:", key);
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: Strict Network-First for navigation & API, Cache-first only for icons
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Ignore non-GET, chrome-extension, or internal API mutations
  if (request.method !== "GET" || request.url.includes("/api/")) {
    return;
  }

  // Handle navigation requests (HTML pages) - ALWAYS NETWORK FIRST
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/").then((cached) => {
          return (
            cached ||
            new Response("Шумо дар ҳолати офлайни Maskani қарор доред / Вы находитесь в офлайн-режиме Maskani", {
              headers: { "Content-Type": "text/html; charset=utf-8" },
            })
          );
        });
      })
    );
    return;
  }

  // For next static chunks and images - Network first with fallback to cache
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
