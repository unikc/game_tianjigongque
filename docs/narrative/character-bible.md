# Character bible

Track identity, rank history, zodiac tendency, public persona, private motive, fears, desires, speech pattern, secrets, relationships and current life status for every recurring character.

## Active relationship canon

| Character | Public role                           | What the relationship measures                                                                                                               | Current high-value beat                                                                            |
| --------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 萧承元    | Emperor                               | `favor` is emotional attraction and visible preference; `trust` is confidence in the protagonist's judgment. They must not rise in lockstep. | The chapter 7 hunt forces the player to choose his body, his witness, or his command.              |
| 崔氏      | 皇太后                                | 对主角是否愿意承担、限制并公开交接权力的承认；不是讨好度。                                                                                   | 第十章按第五、六章的公开先例，接受合法摄政或要求主角退到共署、联署、限期代行。                     |
| 谢明微    | 尚仪局司籍女史                        | 互认与争锋：双方是否承认对方留下、复核并附记异议的方法。                                                                                     | 第八章根据她合法读到的正式记录，预判玩家惯用方法并主持三份原本的复核。                             |
| 沈令仪    | Empress / title may change with state | Institutional legitimacy and willingness to share power.                                                                                     | Chapter 8 remembers demands for the ledger versus an admission of shared guilt.                    |
| 顾明华    | 昭仪 / title may change with state    | Rivalry, intimacy, and the cost of public alignment.                                                                                         | Supporting Shen publicly strains Gu; private bargaining can preserve her alliance.                 |
| 高福安    | 内侍                                  | Access to testimony, records, and court logistics.                                                                                           | Chapter 9 can leave him alive, dead, or politically exposed; portrait/status UI must reflect this. |
| 林栖梧    | 答应 / status may change              | Trust in the protagonist as the person who chose whether to protect or expose her.                                                           | Her poison-case testimony can survive her even when she does not.                                  |
| 温疏雨    | 太医                                  | Professional and moral trust: whether evidence and a patient's safety can be placed in the protagonist's hands.                              | Medical truth must only change the bond when Wen knows what the protagonist chose.                 |
| 裴照南    | 羽林副统领 / title may change         | Confidence built through shared risk, command, and the willingness to entrust one another with evidence.                                     | Military duty and family obligation should pull this relationship in different directions.         |

Every named NPC encountered in playable scenes should enter the人物名册. Dead characters remain listed but are visually muted and described in the past tense.

Every known named NPC must also have a visible relationship spectrum with the protagonist. Register ordinary court relationships in `src/game/relationships.ts`; its exhaustive type is the implementation gate for future additions. `0` means 初识, while negative values describe distance, caution or conflict rather than universal dislike. The Emperor remains a special dual-axis relationship: favor and trust stay independent, while the shared spectrum displays their lower value as the bond's stable foundation. Unknown characters are not shown early. A dead character keeps a frozen “生前关系” and cannot receive gifts or routine relationship actions.

## 崔太后 · “最后一道墙”

- 身份：萧承元之母，皇太后。她与“太后母族／崔氏门下”必须分开书写；母族涉案不等于她亲自下令。
- 公开职责：维持皇室礼制、继承连续性与权力交接的可承认性。她不控制玉玺、宫门、粮船或所有文书。
- 私人动机：让危局后的命令仍有人承认，同时避免王朝成为母族的私产。
- 隐藏恐惧：每个拿着证据、印信或兵力的人都自称替皇帝行事；她也知道自己的权威部分来自崔氏。
- 政治目标：迫使任何临时权力具名、限期、有见证，并说明“明日由谁认”。
- 不愿承认：她维护的秩序曾保护过母族，也可能把无辜者写成体面的代价。
- 可改变之处：从守礼制，到允许具体追责，最终愿为一场受约束的交接作证；她不会被普通好感数值收买。
- 语言：短句、正式、少修辞；常问“由谁签”“谁来担”“天亮以后呢”。
- 对萧承元：爱护但不替他伪造意志；她要保住的是皇权连续性，不是儿子的每个决定。
- 对沈令仪：承认其中宫职责，也警惕她以职责吞并所有程序。
- 对顾明华：欣赏其行动力，却不把机敏当作授权。
- 对主角：只有主角愿意自限并让他人见证时，才承认她能接住权力。

## 谢明微 · “镜中敌手”

- 身份：尚仪局司籍女史，负责名册、脉案副本、印库领用与账册进入公案前的来源复核；她不能判医学真假、罪责、凤位或摄政资格。
- 公开形象：短句、精确，习惯补回别人省略的责任人。她不说“这是假的”，而说“这一页无法证明是谁在何时交来的”。
- 私人动机：建立不会随执印者更替而被重写的复核记录，并让自己的署名成为新秩序不能绕开的部分。
- 隐藏恐惧：早年一份救济名册被上官换掉末页，最终由誊写人担罪；她最怕再次替别人的笔迹负责。
- 误解：把未入档的保护一概视为怯懦或操纵。林栖梧与温疏雨会迫使她承认，延后公开有时是在保全证人。
- 不愿承认：她不仅追求公正，也想成为决定官方版本如何生成的人。
- 可改变之处：从“未记录便未发生”，走向“记录也必须为活人留下进入它的时机”；也可能成为更冷硬的守门人。
- 与沈令仪：沈维护秩序与分权；谢只复核具体材料是否可被援引。
- 与顾明华：顾用信息换位置；谢把“不完整”本身写进记录。
- 与高福安：高知道纸在哪里，谢决定那张纸以后算不算数。
- 与崔太后：谢能指出口谕链在哪里断裂；崔太后才判断谁有资格接住下一道命令。
