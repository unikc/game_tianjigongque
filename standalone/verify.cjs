const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

  await page.goto(
    "file:///home/claude/game_tianjigongque/standalone/out/tianji-palace.html",
  );
  await page.waitForTimeout(2500);

  const title = await page.title();
  const bodyLen = (await page.innerText("body")).length;
  const buttons = await page.locator("button").count();
  console.log("title:", title);
  console.log("可见文字长度:", bodyLen);
  console.log("按钮数:", buttons);
  console.log(
    "首屏文字:",
    (await page.innerText("body")).slice(0, 120).replace(/\n/g, " | "),
  );

  await page.screenshot({ path: "/tmp/shot1.png" });

  // 尝试点第一个按钮，确认交互可用
  if (buttons > 0) {
    await page.locator("button").first().click();
    await page.waitForTimeout(1200);
    console.log(
      "点击后文字:",
      (await page.innerText("body")).slice(0, 120).replace(/\n/g, " | "),
    );
    await page.screenshot({ path: "/tmp/shot2.png" });
  }

  console.log("错误数:", errors.length);
  errors.slice(0, 8).forEach((e) => console.log("  ERR:", e.slice(0, 200)));
  await browser.close();
})();
