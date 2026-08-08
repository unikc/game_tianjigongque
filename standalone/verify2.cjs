const { chromium } = require("playwright-core");

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto(
    "file:///home/claude/game_tianjigongque/standalone/out/tianji-palace.html",
  );
  await page.waitForTimeout(1500);

  const clickText = async (t) => {
    const el = page.locator(`button:has-text("${t}")`).first();
    if ((await el.count()) === 0) return false;
    await el.click();
    await page.waitForTimeout(500);
    return true;
  };

  await clickText("入宫");
  await page.waitForTimeout(400);
  // 名字输入
  const input = page.locator("input[type=text]").first();
  if (await input.count()) await input.fill("陆清和");
  await clickText("下一步");
  await page.waitForTimeout(400);
  await clickText("下一步");
  await page.waitForTimeout(400);

  let steps = 0;
  for (let i = 0; i < 40; i++) {
    const txt = await page.innerText("body");
    const btns = page.locator("button:visible");
    const n = await btns.count();
    if (n === 0) break;
    // 优先点看起来像剧情选项的按钮
    let clicked = false;
    for (let b = 0; b < n; b++) {
      const label = (await btns.nth(b).innerText()).trim();
      if (label && label.length > 3 && !/重来|重新开始|返回|设置/.test(label)) {
        await btns.nth(b).click();
        clicked = true;
        steps++;
        break;
      }
    }
    if (!clicked) break;
    await page.waitForTimeout(350);
  }

  const finalTxt = await page.innerText("body");
  console.log("推进步数:", steps);
  console.log("末屏片段:", finalTxt.slice(0, 200).replace(/\n/g, " | "));
  console.log("是否出现属性面板:", /才学|谋略|胆识/.test(finalTxt));
  console.log("错误数:", errors.length);
  errors.slice(0, 5).forEach((e) => console.log("  ERR:", e.slice(0, 160)));

  // 存档验证
  const saved = await page.evaluate(() =>
    Object.keys(localStorage).length ? Object.keys(localStorage) : [],
  );
  console.log("localStorage 键:", saved);

  await page.screenshot({ path: "/tmp/shot3.png", fullPage: false });
  await browser.close();
})();
