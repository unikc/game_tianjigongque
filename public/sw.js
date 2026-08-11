/**
 * Service Worker：让「添加到主屏幕」后的天机宫阙可以完全离线游玩。
 *
 * 策略选择说明：
 * - 这是一个纯静态、纯客户端的游戏，没有需要实时同步的服务端数据，
 *   所以对静态资源用 cache-first（最快，且断网可用）。
 * - 导航请求（页面本身）用 network-first 回退缓存：这样你重新部署后，
 *   玩家联网时能拿到新版本，断网时仍能打开旧版本继续玩。
 * - 存档在 localStorage 里，不经过 SW，不受缓存策略影响。
 *
 * 每次发布新版本时把 CACHE_VERSION 加一，旧缓存会在 activate 时清掉。
 */

const CACHE_VERSION = "tianji-v1786420525202";
const PRECACHE = [
  "/",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // 单个资源 404 不应该让整个 SW 安装失败，所以逐个容错
      .then((cache) =>
        Promise.allSettled(PRECACHE.map((url) => cache.add(url))),
      )
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // 只接管同源请求，第三方资源交给浏览器默认处理
  if (url.origin !== self.location.origin) return;

  // 页面导航：优先网络（拿到新版本），断网时回退缓存
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          void caches
            .open(CACHE_VERSION)
            .then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached ?? caches.match("/"))
            .then(
              (cached) =>
                cached ??
                new Response("离线且无缓存", {
                  status: 503,
                  headers: { "Content-Type": "text/plain; charset=utf-8" },
                }),
            ),
        ),
    );
    return;
  }

  // 静态资源（JS/CSS/图片）：网络优先，联网时总是拿最新版本；
  // 断网时才回退到缓存，保证离线可玩。
  // 这样每次部署之后，只要手机有网，下次打开就是新版。
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          void caches
            .open(CACHE_VERSION)
            .then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) =>
            cached ??
            new Response("离线且无缓存", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            }),
        ),
      ),
  );
});
