# 《天机宫阙》制作路线图

> 自动生成自 `docs/production/production-status.json`。请勿直接编辑本文件。

更新日期：2026-08-08
目标：第一季商业化 iOS 纵向切片

## 制作原则

- 同时最多两项重大功能处于 `IN PROGRESS`。
- 当前十二章主线稳定性优先于新增篇幅。
- 新角色共用统一的叙事记忆、秘密归属、信息可信度与确定性种子系统。
- `DONE` 必须满足 `AGENTS/ImperialProducer.md` 的全部质量门槛。

## Epic dashboard

| ID | Epic | Priority | Status | Complexity | Dependencies | Current owner |
| --- | ---- | -------- | ------ | ---------- | ------------ | ------------- |
| F01 | 叙事记忆与策略画像基础 | P0 | `DONE` | M | E08、E11 | Gameplay / Codex |
| F02 | 政治合法性与体面台阶 | P0 | `DONE` | L | E08、晋位路线 | Gameplay + Narrative |
| E01 | 太后·崔氏「最后一道墙」 | P1 | `DONE` | XL | F02、角色圣经 | Narrative |
| E02 | 谢明微「镜中敌手」 | P0 | `PLANNED` | XL | F01、E08 | Narrative + Gameplay |
| E03 | 天机阁主「盲眼史官」 | P0 | `DONE` | L | E08、E11、F01 | Narrative + Gameplay / Claude |
| E04 | 前朝废后「已经赢过的人」 | P1 | `PLANNED` | L | E08、E11 | Narrative |
| E05 | 必要的背叛 | P1 | `DONE` | XL | E11、角色关系重量 | Narrative |
| E06 | 自证预言 | P1 | `PLANNED` | L | E03、F01 | Narrative + Gameplay |
| E07 | 宫中内奸调查 | P0 | `DONE` | XL | E08、种子真相 | Gameplay + Narrative |
| E08 | 文书权力与替罪弧 | P0 | `DONE` | L | 现有证据标签、现有结局 | Gameplay + Narrative |
| E09 | 胜利与道德转型 | P1 | `PLANNED` | XL | F01、结局整合 | Narrative |
| E10 | 十二章章首谶诗 | P2 | `DONE` | M | E03、E06 | Narrative + Art |
| E11 | 延迟复仇 | P0 | `DONE` | L | E08 | Narrative + Gameplay |

## Development order

1. E08 文书生命周期与来源链
2. E11 延迟后果模型
3. F01 叙事记忆与策略画像
4. F02 政治合法性
5. E01/E02 角色基础
6. E07/E05 调查与背叛
7. E04 前朝废后
8. E03/E06/E10 天机与预言
9. E09 结局道德转型

## Completed foundations

- **F01 — 叙事记忆与策略画像基础。** 已完成并通过质量门槛。
- **F02 — 政治合法性与体面台阶。** 已完成并通过质量门槛。
- **E01 — 太后·崔氏「最后一道墙」。** 已完成并通过质量门槛。
- **E03 — 天机阁主「盲眼史官」。** 已完成并通过质量门槛。
- **E05 — 必要的背叛。** 已完成并通过质量门槛。
- **E07 — 宫中内奸调查。** 已完成并通过质量门槛。
- **E08 — 文书权力与替罪弧。** 已完成并通过质量门槛。
- **E10 — 十二章章首谶诗。** 已完成并通过质量门槛。
- **E11 — 延迟复仇。** 已完成并通过质量门槛。

## Next recommended task

**E04 — 前朝废后「已经赢过的人」**

- 原因：E05承诺-背叛系统建立后，玩家开始理解「已经赢过的代价」。E04的前废后可以给玩家看一个走到更高处之后的样子——她的建议既有用又有毒，正好是E05后序剧情需要的张力来源。
- 第一步：在第9章「声称已死的证人」场景里引入废后的第一次接触，建立来历与历史感，第10-11章给出两次需要判断可信度的建议。
- 验收：玩家无法确定她是在帮忙还是在操纵，但事后可以追溯理由；不与天机阁功能重复；不改写萧承元前妻身份。
