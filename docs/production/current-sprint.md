# Current sprint

> 自动生成自 `docs/production/production-status.json`。请勿直接编辑本文件。

更新日期：2026-08-08

## Sprint goal

完成角色基础、政治合法性与第九章宫中泄漏调查，并保持知识边界与错误路线可玩。

## WIP

| ID | Item | Status | Owner | Exit condition |
| -- | ---- | ------ | ----- | -------------- |
| NIGHT01 | 全游戏夜间视觉与可访问性修复 | `DONE` | Art / Frontend / Codex | 标题、建档、剧情、结算、五个主页分区与弹层均使用成对语义材料；关键文字对比达到 WCAG AA。 |
| SET01 | 外观与语言设置页 | `DONE` | Product / Art / Codex | 日间、夜间与系统跟随可用并持久化；未完成语言明确不可操作；320px 底栏无溢出。 |
| PD01 | 开发版 Production Dashboard | `DONE` | Producer / Codex | 单一数据源生成 Dashboard、roadmap 与 current sprint；发布构建不包含 Dashboard。 |
| E11 | 延迟复仇后果模型 | `DONE` | Narrative + Gameplay | 旧因、知情渠道、等待时机、目标与应对被定义并通过叙事审查。 |
| F01 | 叙事记忆与策略画像基础 | `DONE` | Gameplay / Codex | 五种可并存处世手段由稳定选择记忆纯派生，具备观察边界、来源链、一次归因与可解释玩家反馈。 |
| F02 | 政治合法性与体面台阶 | `DONE` | Gameplay + Narrative / Codex | 第十章摄政署名由三套具名依据通过；证据、帝宠与主张本身均不能自动授权；依据不足时有命名质询和三类体面退路。 |
| E01 | 太后·崔氏「最后一道墙」角色基础 | `DONE` | Narrative + Art + Gameplay / Codex | 角色圣经、正式立绘、公开知识边界、第五／六章记忆回声、第十章三类承认与第十一章限期回收均通过审查。 |
| E02 | 谢明微「镜中敌手」角色基础 | `DONE` | Narrative + Art + Gameplay / Codex | 角色圣经、正式立绘、有限观察模型、第八章自适应复核与第十章权力边界回响均通过审查。 |
| E07 | 宫中内奸调查 | `DONE` | Gameplay + Narrative + Art / Codex | 三条互斥假消息、独立 seeded 泄漏链、观察与已知分层、错误问责后果及第九章原路线可达性全部通过审查。 |
| E03 | 天机阁主「盲眼史官」 | `DONE` | Narrative + Gameplay / Claude | 谶语只产出 belief/hint 且 signpost 措辞与真相无关；价目取自玩家真实私密记忆并确定性选定；无私事者无法交易；三次交易均早于兑现章节；秘录册形成以本人经手为唯一知情渠道的延迟旧账。 |
| E10 | 十二章章首谶诗 | `DONE` | Narrative / Claude | 12首原创谶诗；UI浮层读过后不再弹出；不揭露种子真相；手机尺寸可读。 |
| E05 | 必要的背叛 | `DONE` | Narrative / Claude | 可用牺牲由承诺历史派生；无承诺玩家只见拒绝背叛；已兑现承诺再背叛代价更重；第12章有三条后果场景；7项测试通过。 |
| E04 | 前朝废后「已经赢过的人」 | `DONE` | Narrative / Claude | 三次接触结构完整；台词按种子确定性生成；canon约束通过测试；第11章结果由关系值和选择历史共同决定。 |

WIP count: 0 major features `IN PROGRESS`.

## Not this sprint

- 不新增天机阁主或前朝废后的正式场景。
- 不写章首谶诗，不新增结局。
- 不在延迟后果模型稳定前扩展通用记忆系统。

## Review gates

- Dashboard 只读且无状态修改入口。
- roadmap.md 与 current-sprint.md 必须由结构化数据生成。
- 生产构建不输出 /production 页面或 Dashboard 资源。
- Narrative、Art、Gameplay 与 QA 状态必须可见。
