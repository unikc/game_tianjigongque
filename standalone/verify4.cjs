const { chromium } = require("playwright-core");
(async () => {
  const b = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox"],
  });
  const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(
    "file:///home/claude/game_tianjigongque/standalone/out/tianji-palace.html",
  );
  await p.waitForTimeout(1500);
  const tap = async (t) => {
    const e = p.locator(`button:has-text("${t}")`).first();
    if (await e.count()) {
      await e.click();
      await p.waitForTimeout(450);
      return true;
    }
    return false;
  };
  await tap("入宫");
  const inp = p.locator("input").first();
  if (await inp.count()) await inp.fill("陆清和");
  await tap("卯兔");
  await tap("下一步");
  await tap("翰林之女");
  await tap("登记入宫");
  await p.waitForTimeout(600);
  let n = 0;
  for (let i = 0; i < 14; i++) {
    const bs = p.locator("button:visible");
    const c = await bs.count();
    let done = false;
    for (let k = 0; k < c; k++) {
      const t = (await bs.nth(k).innerText()).trim();
      if (t.length > 6 && !/上一步|返回|重来|重新|设置|存档/.test(t)) {
        await bs.nth(k).click();
        n++;
        done = true;
        break;
      }
    }
    if (!done) break;
    await p.waitForTimeout(400);
  }
  const txt = await p.innerText("body");
  console.log("剧情推进步数:", n);
  console.log("当前画面:", txt.slice(0, 180).replace(/\n/g, " | "));
  console.log("错误数:", errs.length);
  errs.slice(0, 3).forEach((e) => console.log("  ERR:", e.slice(0, 150)));
  await p.screenshot({ path: "/tmp/shot_play.png" });
  await b.close();
})();
