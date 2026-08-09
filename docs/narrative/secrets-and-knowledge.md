# Secrets and knowledge

For every secret, record the truth, who knows it, who suspects it, available evidence, plausible false explanations and when the player may learn it.

| Secret   | Truth                                                                        | Evidence/state tags                                                 | Playable consequence                                                                                            |
| -------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 春猎刺杀 | The order-bearer and witness carry different halves of the chain of command. | `ch7_order_captured`, `ch7_witness_saved`, `ch7_witness_lost`       | Chapter 8 testimony changes; no single hunt choice preserves every advantage.                                   |
| 皇帝伤情 | The court exploits uncertainty about the emperor's condition.                | `ch7_emperor_wounded`, `ch7_emperor_safe`, `ch8_health_disclosed`   | Public treatment costs favor but can build trust and block competing rumors.                                    |
| 凤印名册 | The ledger is politically useful but implicates more than one faction.       | `ch8_demand_ledger`, `ch8_shares_queen_guilt`, `ch8_truth_public`   | Shen and Gu relations diverge; later accusations inherit the chosen posture.                                    |
| 鼠咬残账 | The surviving fragment is only partial proof.                                | `ch9_mouse_ledger`, `ch9_partial_mouse_ledger`, `ch9_evidence_lost` | The royal accusation requires the arsonist; survivor protection requires a witness, ledger, or exposed network. |
| 宫火泄漏 | 三条互斥假消息中，只有真实失守的文书链会引发行动；链路不等于个人通敌。       | `belief_leak:*`, `known_leak_link:*`, `accused_link:*`              | 单一回流只形成推断；与独立观察相合才成为已知。误判会伤害合作并让真实链改路，但不封死第十章。                    |

## 延迟后果知情规则

延迟复仇只读取发起者亲历、公开针对该人或明确向该人转述的标签。负关系、玩家持有的秘密以及 `wenLoyalty` / `arsonPatron` 等种子真相均不能替 NPC 补全知识。第一批渠道定义与旧因、等待时机及取消条件统一记录在 `delayed-consequences.md`。

## 事实不等于授权

假口谕、皇帝伤情与文书真伪属于事实知识；它们可以推翻一道命令或证明御前出现权力真空，但不会自动指定谁可以摄政。第十章署名原型的职位、受益人、依据组合与体面退路记录在 `political-legitimacy.md`。

# 崔太后的认知边界

- `arsonPatron:dowager` 表示太后母族／崔氏势力卷入，不表示崔太后本人下令。
- 她只读取亲历事件、公开处置与正式上报：第五章最终落款、第六章公开认捐与正式开仓、第十章口谕核验。
- 私查账路、随机种子真相、未上呈的证词和玩家数值都不能改变她的台词或判断。
- 同一公开历史在不同种子下必须得到同一份崔太后认知与回应。

# 谢明微的认知边界

- 只读取白名单中的正式入档或公开记录，每条必须保留稳定 choice 与 memory provenance。
- `court` 不等于自动送进司籍；私密选择、当事人密谈、关系值、珍藏和种子真相永远不能补全观察。
- 至少两件不同且合法可见的往事才形成一次预判；每种最多计两件、每局最多启用两种预判。
- 她能退回来源链断裂的口谕，但不能借此判断谁应摄政。
- 第九章她只知道复核副本是否离开桌面；不知道路牌去向、长春宫近侍行为或纵火主使。即便复核链失守，也不能自动判定她本人通敌。
