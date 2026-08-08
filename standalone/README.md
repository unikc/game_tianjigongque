# standalone 单文件构建

把整个游戏打包成**一个自包含的 HTML 文件**，不需要任何服务器，双击即可运行。

用途：离线演示、发给别人试玩、在无法部署时快速验证改动效果。

## 用法

```bash
pnpm standalone
```

产物在 `standalone/out/tianji-palace.html`（约 2.2MB）。

## 它做了什么

| 步骤          | 说明                                                                                 |
| ------------- | ------------------------------------------------------------------------------------ |
| esbuild       | 把 React 应用打成单文件 IIFE，约 385KB                                               |
| tailwindcss   | 编译 `app/globals.css`，内联进 `<style>`                                             |
| inline.py     | 把 `public/` 下 2MB 图片压缩后转为 data URI（约 0.78MB），替换掉 JS/CSS 里的资源路径 |
| build_html.py | 组装成单个 HTML                                                                      |

## 两个垫片，以及为什么需要它们

**`shim.js`** — 浏览器里没有 `process`，Next 与 React 的若干分支会去探测它。缺失时抛 `process is not defined`，页面白屏。

**`next-image-shim.tsx`** — `next/image` 依赖 Next 运行时与图片优化端点，脱离 Next 后解析为 `undefined`，React 抛 error #130（组件类型无效），一进入剧情就崩。

这里刻意选择**构建期 alias** 而不是修改 `imperial-design-system/portraits/Portrait.tsx`：那个组件是线上 Next 应用真实使用的，改它会牺牲正式站点的图片优化。为了一个演示产物去降级生产代码，是不划算的交易。

## 验证脚本

```bash
node standalone/verify.cjs    # 首屏渲染 + 首次交互
node standalone/verify2.cjs   # 自动推进剧情
node standalone/verify3.cjs   # localStorage 被禁用时的降级行为
node standalone/verify4.cjs   # 完整走到御前裁定与首封位分
```

需要一个 Chromium。脚本里写的是 `/opt/pw-browsers/chromium-1194/...`，本地跑请改成你自己的路径，或 `npx playwright install chromium` 后改用默认查找。

`verify3.cjs` 值得单独说一句：它模拟 `localStorage` 抛 `SecurityError` 的环境（隐私模式 Safari、沙箱 iframe、关闭站点数据的浏览器）。仓库里那个"storage 不可用导致白屏"的 bug 就是它抓出来的——这类问题在正常浏览器里永远复现不了，但真实用户会遇到。

## 局限

- 图片经过压缩（最长边 520px、WebP q62），清晰度低于线上版本。这是为了把体积控制在可分发的范围，不适合当作美术验收的依据。
- 单文件体积 2.2MB，首次打开需要解析全部内联资源，低端设备上会有可感知的等待。
- 存档仍依赖 `localStorage`。以 `file://` 打开时各浏览器策略不一，进度未必能跨次保留。
