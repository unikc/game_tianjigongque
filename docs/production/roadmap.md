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

| ID  | Epic                     | Priority | Status    | Complexity | Dependencies           | Current owner                 |
| --- | ------------------------ | -------- | --------- | ---------- | ---------------------- | ----------------------------- |
| F01 | 叙事记忆与策略画像基础   | P0       | `DONE`    | M          | E08、E11               | Gameplay / Codex              |
| F02 | 政治合法性与体面台阶     | P0       | `DONE`    | L          | E08、晋位路线          | Gameplay + Narrative          |
| E01 | 太后·崔氏「最后一道墙」  | P1       | `DONE`    | XL         | F02、角色圣经          | Narrative                     |
| E02 | 谢明微「镜中敌手」       | P0       | `PLANNED` | XL         | F01、E08               | Narrative + Gameplay          |
| E03 | 天机阁主「盲眼史官」     | P0       | `DONE`    | L          | E08、E11、F01          | Narrative + Gameplay / Claude |
| E04 | 前朝废后「已经赢过的人」 | P1       | `PLANNED` | L          | E08、E11               | Narrative                     |
| E05 | 必要的背叛               | P1       | `PLANNED` | XL         | E11、角色关系重量      | Narrative                     |
| E06 | 自证预言                 | P1       | `PLANNED` | L          | E03、F01               | Narrative + Gameplay          |
| E07 | 宫中内奸调查             | P0       | `DONE`    | XL         | E08、种子真相          | Gameplay + Narrative          |
| E08 | 文书权力与替罪弧         | P0       | `DONE`    | L          | 现有证据标签、现有结局 | Gameplay + Narrative          |
| E09 | 胜利与道德转型           | P1       | `PLANNED` | XL         | F01、结局整合          | Narrative                     |
| E10 | 十二章章首谶诗           | P2       | `PLANNED` | M          | E03、E06               | Narrative + Art               |
| E11 | 延迟复仇                 | P0       | `DONE`    | L          | E08                    | Narrative + Gameplay          |

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
- **E07 — 宫中内奸调查。** 已完成并通过质量门槛。
- **E08 — 文书权力与替罪弧。** 已完成并通过质量门槛。
- **E11 — 延迟复仇。** 已完成并通过质量门槛。

## Next recommended task

**F03 — 晋位判定迁移到合法性依据**

- 原因：F01 处世留痕与晋位数值门槛目前互不相通，玩家全程建立的行事方式不影响能走多远；F02 已验证「依据绑定职位与来源」的模型可用，E03 又让私密记忆成为可消费资源，迁移时机成熟。
- 第一步：把第五、七、九章的三条晋位路线各改写为一条具名依据：帝心须引用皇帝公开采信的具体一事，清议须有两件正式入档且无异议的往事，人脉须有两名具名角色愿为某次具体行为署名。数值降为必要条件而非充分条件。
- 验收：晋位提示显示具体事由而非纯数值；五种处世手段仍可并存且无优劣排序；旧存档不因迁移丢失既有位分；第十二章凤位不再存在纯数值路线。
