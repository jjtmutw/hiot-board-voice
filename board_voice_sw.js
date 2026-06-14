const CACHE_NAME = "hiot-board-voice-v2";
const APP_SHELL = [
  "./board_voice.html",
  "./board_voice_manifest.webmanifest",
  "./pwa-icon-192.png",
  "./pwa-icon-512.png",
  "./comlogo.png",
  "./tmutitle.png"
];

function canCache(response) {
  return response && response.ok && (response.type === "basic" || response.type === "default");
}

async function putInCache(request, response) {
  if (!canCache(response)) return;

  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  } catch (e) { }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          putInCache(event.request, response);
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./board_voice.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        const network = fetch(event.request)
          .then((response) => {
            putInCache(event.request, response);
            return response;
          })
          .catch(() => cached);

        return cached || network;
      })
  );
});
