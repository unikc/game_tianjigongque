/**
 * 晋位依据（F03）。
 *
 * ── 问题 ───────────────────────────────────────────────────────────────
 *
 * 改造前，晋位完全由数值门槛决定：宠爱 ≥ 30、名望 ≥ 6……
 * 玩家全程建立的「我是怎样解决问题的人」与「我能走到多高」平行不相交。
 * F01 的处世留痕因此从来不是晋位的一部分。
 * 更严重的是：帝心路线的「凤座无眠」结局是 `else` 兜底，
 * 等于「没有明确主张的人落进这里」——玩家感觉自己是掉进去的，不是争取到的。
 *
 * ── 解法 ───────────────────────────────────────────────────────────────
 *
 * 每条晋位路线增加一层「具名依据」作为**充分条件**，数值门槛降为**必要条件**。
 * 两者同时满足才晋位；数值不够时保留原有的 `held` 逻辑；
 * 数值够了但没有具名依据时，也是 `held`，并给出「缺少什么」的提示。
 *
 * 具名依据用 `NarrativeMemory` 的 sourceChoiceId 标识，因此：
 * - 提示文本是「因你在 X 场合做过 Y 这件事」，而不是数字；
 * - 旧存档兼容：只要选择历史里有对应 choice id，依据自动成立；
 * - 五种处世手段保持平等：每条路线有一种主要手段，但三条路线
 *   各自主张不同的手段，没有全局最优解。
 *
 * ── 架构 ───────────────────────────────────────────────────────────────
 *
 * 纯派生，不新增 GameState 字段。
 * 与 `political-legitimacy.ts` 完全平行：同一套「依据绑定职位与来源」的模型，
 * 只是这里的职位是后宫位分，来源是选择历史。
 *
 * ── 关于皇后（第12章）───────────────────────────────────────────────────
 *
 * 皇后晋位本次**不迁移**。原因：第十二章「登凤座」涉及全部结局分支，
 * 改动风险最高，且 F02（政治合法性）已经在第十章建立了一套完整的
 * 「凭什么」逻辑，皇后晋位应当接入那套系统而不是单独再搭一套。
 * 这是 `docs/narrative/tianji-pavilion.md` 里已记录的已知风险，
 * 留待专门 sprint 处理。
 */

import type { GameState } from "../types";

/**
 * 一条具名依据：某次具体的选择成为晋位的理由。
 *
 * 设计约束（与 `political-legitimacy.ts` 保持一致）：
 * - 每条依据绑定一个职位（`rank`）和一条路线（`route`）；
 * - 玩家的选择不能自动成为自己的依据——只有确实留下后果的选择才算；
 * - 依据成立后，晋位提示显示 `reason`，不显示数字。
 */
export type PromotionBasis = {
  id: string;
  rank: "嫔" | "妃" | "贵妃" | "皇贵妃";
  route: "帝心" | "清议" | "人脉";
  /** 依据成立所需的选择 id（满足任一即可）。 */
  anyOf: readonly string[];
  /** 晋位提示文案：「因你……」开头的一句话。 */
  reason: string;
  /** `held` 时的提示：还需要什么。 */
  hint: string;
};

/**
 * 全部具名依据。
 *
 * 每个位分 × 三条路线 = 一条依据，共 4 × 3 = 12 条。
 * `anyOf` 里可以有多个 choice id：满足其中一个就成立，
 * 这样不同出身与生肖的玩家都能找到自己的路。
 */
export const promotionBases: readonly PromotionBasis[] = [
  // ── 嫔（第5章）────────────────────────────────────────────────────────
  {
    id: "pin-imperial-public-trust",
    rank: "嫔",
    route: "帝心",
    anyOf: [
      "day3_private_test", // 把毒验结论压下来，自己先知道
      "day3_preserve_lid", // 先封存物证再说
      "duck_admit", // 御前认下绣鸭，主动承担
    ],
    reason:
      "因你在御前或关键时刻独立判断并承担了结果——皇帝的眼睛里有人记住了这件事。",
    hint: "帝心路线需要一次御前可见的独立判断或主动承担。",
  },
  {
    id: "pin-merit-official-record",
    rank: "嫔",
    route: "清议",
    anyOf: [
      "day2_restore_name", // 恢复名册上的名字，留下可复核的来处
      "day3_seal_room", // 封住香房，逐一登记
      "day2_rank_access", // 请两宫当面核清先后
    ],
    reason: "因你至少有一件事已被正式记录在案，言行有据可查，无人能轻易否认。",
    hint: "清议路线需要一件正式入档且无异议的公开往事。",
  },
  {
    id: "pin-network-key-ally",
    rank: "嫔",
    route: "人脉",
    anyOf: [
      "day3_save_lin", // 先救林栖梧
      "day3_guard_lin", // 守夜陪伴林栖梧
      "day4_trust_pei", // 把军粮账簿交给裴照南
      "day2_split_task", // 把请召事务分托给高福安
    ],
    reason:
      "因你在早期关键时刻为一个具体的人选择了保护或信任——有人记得是你做的这件事。",
    hint: "人脉路线需要一次为具体人物主动出手的往事，且对方仍在。",
  },
  // ── 妃（第7章）────────────────────────────────────────────────────────
  {
    id: "fei-imperial-demonstrated-judgment",
    rank: "妃",
    route: "帝心",
    anyOf: [
      "day5_3_2", // 保住温疏雨（医者信任已记录）
      "day4_set_bait", // 独自决断设局，公开承担
      "day3_refuse_easy_answer", // 不把账当最后结论
    ],
    reason:
      "因你在一次没有明显正确答案的局面里作出了独立判断，皇帝看见了你怎么想。",
    hint: "帝心路线需要一次皇帝可见的、你自己承担后果的判断。",
  },
  {
    id: "fei-merit-two-records",
    rank: "妃",
    route: "清议",
    anyOf: [
      "day4_seize_ledger", // 拒绝私情，立即封存呈报
      "day5_3_3", // 赈灾名单转入公案
      "day6_1_3", // 满朝认捐
    ],
    reason:
      "因你在两件以上的公务上留下了正式签署的记录，院中有人拿得出你的文书出处。",
    hint: "清议路线需要两件不同的正式记录，且来处可查。",
  },
  {
    id: "fei-network-second-alliance",
    rank: "妃",
    route: "人脉",
    anyOf: [
      "day4_trust_pei", // 裴照南信任
      "day3_save_lin", // 林栖梧保护
      "day5_3_2", // 温疏雨命运
      "day6_3_1", // 皇后开仓联署
    ],
    reason:
      "因你在不同场合为两个或以上的人作出了有后果的选择，她们各自记着你这个人。",
    hint: "人脉路线需要两位具名角色各有一次你主动出手的往事。",
  },
  // ── 贵妃（第9章）──────────────────────────────────────────────────────
  {
    id: "guifei-imperial-high-stakes",
    rank: "贵妃",
    route: "帝心",
    anyOf: [
      "day4_set_bait", // 担责设局
      "day3_trade_silence", // 以私交换公——他知道了
      "day4_test_signature", // 先对笔锋再上报：审慎且有效
    ],
    reason: "因你在关乎后宫稳定的一次大局面里独立决断并让皇帝亲眼见到了结果。",
    hint: "帝心路线需要一次关乎宫中大局的独立决断，且结果已在御前可见。",
  },
  {
    id: "guifei-merit-evidence-chain",
    rank: "贵妃",
    route: "清议",
    anyOf: [
      "day4_seize_ledger", // 军粮账入公案
      "day5_3_3", // 赈灾名单进公案
      "day6_3_1", // 开仓令正式落款
    ],
    reason:
      "因你手中的记录已经形成一条可供第三方复核的文书链，不依赖任何口述。",
    hint: "清议路线需要三件以上可相互印证的正式文书记录。",
  },
  {
    id: "guifei-network-no-public-enemies",
    rank: "贵妃",
    route: "人脉",
    anyOf: [
      "day5_3_2", // 温疏雨保全
      "day3_guard_lin", // 林栖梧守夜
      "day4_trust_pei", // 裴照南委托
      "day6_3_1", // 皇后联署
    ],
    reason:
      "因你在多个场合为不同的人作出了有代价的选择，她们在公开场合不会主动对你不利。",
    hint: "人脉路线需要至少两名具名角色在公开场合无敌意，且有具体往事为证。",
  },
  // ── 皇贵妃（第11章）───────────────────────────────────────────────────
  {
    id: "huangguifei-imperial-trust-across-crisis",
    rank: "皇贵妃",
    route: "帝心",
    anyOf: [
      "day4_set_bait", // 担责设局
      "tianji_ledger_own", // 当众认下册子，没有甩锅
      "day3_refuse_easy_answer", // 不把轻易的答案当最后结论
    ],
    reason:
      "因你在接连数次危局里没有寻找替罪的人，皇帝的信任已经越过了「你很有用」这一层。",
    hint: "帝心路线需要在两次以上危局里都由你亲自承担、没有将后果推给他人。",
  },
  {
    id: "huangguifei-merit-institutional",
    rank: "皇贵妃",
    route: "清议",
    anyOf: [
      "day2_restore_name", // 名册修复入档
      "day4_seize_ledger", // 军粮账封存
      "day6_3_1", // 开仓令联署
      "day5_3_3", // 赈灾名单入公案
    ],
    reason:
      "因你在朝议或公文层面留下了一套互相印证的记录，任何一件都可以被援引作为你处事方式的证明。",
    hint: "清议路线需要三件以上分布在不同章节的正式记录，且没有被推翻。",
  },
  {
    id: "huangguifei-network-cross-chapter",
    rank: "皇贵妃",
    route: "人脉",
    anyOf: [
      "day3_save_lin", // 林栖梧第3章
      "day5_3_2", // 温疏雨第5章
      "day4_trust_pei", // 裴照南第4章
      "day6_3_1", // 皇后联署第6章
    ],
    reason:
      "因你在分布于四个章节以上的选择里，持续为不同的人作出了有后果的决定，有人愿意为你出现在公开场合。",
    hint: "人脉路线需要在至少三个不同章节里各有一次为具名角色主动出手的往事。",
  },
] as const;

/**
 * 某条路线的具名依据是否已经成立。
 *
 * 依据成立 = 玩家的 history 里有 `anyOf` 中至少一个 choice id。
 */
export function basisMet(state: GameState, basis: PromotionBasis): boolean {
  return basis.anyOf.some((id) => state.history.includes(id));
}

/**
 * 某个位分和路线对应的依据文本。
 *
 * 成立时返回 `reason`（「因你……」），否则返回 `hint`（「需要……」）。
 * 这是 UI 层用来把「宠爱 18 · 信任 10」替换成人话的主要入口。
 */
export function basisText(
  state: GameState,
  rank: PromotionBasis["rank"],
  route: PromotionBasis["route"],
): { met: boolean; text: string } {
  const basis = promotionBases.find(
    (b) => b.rank === rank && b.route === route,
  );
  if (!basis) return { met: false, text: "（暂无依据要求）" };
  const met = basisMet(state, basis);
  return { met, text: met ? basis.reason : basis.hint };
}

/**
 * 晋位时显示的原因文本。
 *
 * 仅在 `status === "promoted"` 时调用，返回推动这次晋位的那条具名依据。
 * 这是「从此刻起，你的位分不只是数字」的核心句。
 */
export function promotionReason(
  state: GameState,
  rank: PromotionBasis["rank"],
  route: "帝心" | "清议" | "人脉",
): string {
  const basis = promotionBases.find(
    (b) => b.rank === rank && b.route === route,
  );
  if (!basis || !basisMet(state, basis)) return "";
  return basis.reason;
}
