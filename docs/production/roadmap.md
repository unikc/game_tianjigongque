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
| E04 | 前朝废后「已经赢过的人」 | P1 | `DONE` | L | E08、E11 | Narrative |
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
- **E04 — 前朝废后「已经赢过的人」。** 已完成并通过质量门槛。
- **E05 — 必要的背叛。** 已完成并通过质量门槛。
- **E07 — 宫中内奸调查。** 已完成并通过质量门槛。
- **E08 — 文书权力与替罪弧。** 已完成并通过质量门槛。
- **E10 — 十二章章首谶诗。** 已完成并通过质量门槛。
- **E11 — 延迟复仇。** 已完成并通过质量门槛。

## Next recommended task

**E06 — 自证预言**

- 原因：E03天机阁已建立，E04废后已有可信度机制，预言系统的基础设施到位。E06让玩家发现自己的预防行为促成了预言成真，需要在E04的claim体系上追加causality tag。
- 第一步：在天机阁的signpost谶语里加一条「若你追查某个名字，那个名字会出现在你手边」，然后在第10章追查行为里写入prophecy_causal_link:* tag，第12章结局里检查这条链。
- 验收：同一种子不听谶语不触发预言链；causality事后可重建；不引入超自然元素。
