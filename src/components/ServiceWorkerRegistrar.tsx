"use client";

import { useEffect } from "react";

/**
 * 注册 Service Worker，让 PWA 支持离线游玩。
 *
 * 两个刻意的限制：
 * 1. 只在生产构建注册。开发时 SW 缓存会让你改了代码看不到效果，很坑。
 * 2. 原生 App（Capacitor）里不注册。那边资源本来就打包在本地，
 *    再加一层 SW 缓存没有收益，还多一个出问题的地方。
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    // Capacitor 原生外壳用 capacitor:// 协议，跳过
    if (!window.location.protocol.startsWith("http")) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // 注册失败不影响游戏本身，静默处理即可
      });
    };

    // 等页面加载完再注册，避免和首屏资源抢带宽
    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
