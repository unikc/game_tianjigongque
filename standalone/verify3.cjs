const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox"],
  });

  // 模拟 artifact 沙箱：禁用 storage，看游戏会不会直接崩
  const ctx = await browser.newContext({
    viewport: { width: 420, height: 900 },
    javaScriptEnabled: true,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.addInitScript(() => {
    // 让 localStorage 的读写抛异常，模拟被沙箱阻断的浏览器
    const boom = () => {
      throw new DOMException("Access denied", "SecurityError");
    };
    try {
      Object.defineProperty(window, "localStorage", {
        configurable: true,
        get() {
          return { getItem: boom, setItem: boom, removeItem: boom };
        },
      });
    } catch (e) {}
  });

  await page.goto("file:///mnt/user-data/outputs/tianji-palace.html");
  await page.waitForTimeout(1800);

  const txt = await page.innerText("body");
  console.log("storage 被禁时首屏长度:", txt.length);
  console.log("首屏:", txt.slice(0, 80).replace(/\n/g, " | "));
  console.log("错误数:", errors.length);
  errors.slice(0, 4).forEach((e) => console.log("  ERR:", e.slice(0, 180)));
  await page.screenshot({ path: "/tmp/shot_nostorage.png" });
  await browser.close();
})();
