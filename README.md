# 《天机宫阙》

一个移动端优先的宫廷叙事生存游戏。本仓库包含“入宫第一日”可玩纵切：选择出身与生肖命宫、结识关键人物、处理“绣鸭献瑞”，并获得首封位分与个性评语。对话演出采用面向 iOS 竖屏剧情手游的大幅角色立绘与底部选择结构。

## 启动

需要 Node.js 22.13 或更新版本。

```bash
pnpm install
pnpm dev
```

常用检查：`pnpm lint`、`pnpm typecheck`、`pnpm test`、`pnpm build`、`pnpm format:check`。

## 架构

- `src/game/content`：出身和场景内容。
- `src/game/characters`：人物定义。
- `src/game/state`：纯函数状态更新、存档迁移与种子评分。
- `src/components/game`：可复用游戏界面与流程控制。
- `app`：Next.js App Router 入口与全局视觉系统。

运行状态保存在组件本地，同时序列化至 `localStorage`。公开数值和人物关系可查看；判断标签与评分细节保持隐藏。

## 新增场景

在 `src/game/content/scenes.ts` 中增加一个符合 `Scene` 类型的对象，为每个选择提供唯一 `id`、效果与 `next`。随后从已有选择指向新场景。数值更新请通过 `applyEffect`，避免在界面中直接修改状态。

## 替换占位美术

宫殿、云纹、印章与名牌由 CSS 构成；三位主要 NPC 已接入本地正式立绘。新增角色时在 `src/game/characters` 登记固定尺寸图片、表情映射、生肖图标与能力，叙事内容无需绑定具体文件。完整规范见 `docs/art-direction.md`。
