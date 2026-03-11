const CACHE_VERSION = 'v1';
const STATIC_CACHE = `masakapa-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `masakapa-dynamic-${CACHE_VERSION}`;

// Aset statis yang selalu di-cache saat install
const STATIC_ASSETS = [
  '/',
  '/saved',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// URL yang TIDAK boleh di-cache (selalu butuh network)
const NEVER_CACHE = [
  '/api/generate/menus',
  '/api/generate/recipe',
  'generativelanguage.googleapis.com',
];

// ── INSTALL: cache semua static assets ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ── ACTIVATE: hapus cache lama ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ── FETCH: strategi caching ──
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET request
  if (request.method !== 'GET') return;

  // Skip API calls ke Gemini & route generate — selalu network
  if (NEVER_CACHE.some((u) => request.url.includes(u))) return;

  // Skip chrome-extension atau non-http
  if (!url.protocol.startsWith('http')) return;

  // Strategi: Network First untuk navigasi halaman
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Strategi: Cache First untuk aset statis (js, css, font, image)
  if (
    url.pathname.match(/\.(js|css|woff2?|png|jpg|svg|ico)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Default: Network First
  event.respondWith(networkFirst(request));
});

// ── Cache First: cek cache dulu, fallback ke network ──
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// ── Network First: coba network dulu, fallback ke cache ──
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback ke halaman offline jika navigate
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/');
      return offlinePage || new Response('Offline', { status: 503 });
    }

    return new Response('Offline', { status: 503 });
  }
}
