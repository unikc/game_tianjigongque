/**
 * 天机阁（E03 · 盲眼史官）。
 *
 * ── 为什么要有这个系统 ──────────────────────────────────────────────
 *
 * 游戏名叫《天机宫阙》，但改造前「天机」只是标题上的两个字。
 * 与此同时，`hidden-truth.ts` 里已经有三条种子真相在决定剧情走向，
 * 玩家却没有任何**主动**接触它们的入口——只能被动地在场景里撞见。
 *
 * 天机阁把这两个缺口合成一个东西：它是玩家面向隐藏真相的唯一界面。
 *
 * ── 三条硬规则 ──────────────────────────────────────────────────────
 *
 * 1. **谶语只给 `belief_*`，永不给 `known_*`。**
 *    阁主不会告诉你答案，只会告诉你**去哪里看**、或**排除哪一种**。
 *    她给出的是观察窗口，不是结论。玩家仍然要自己下注。
 *
 * 2. **代价必须是玩家真实做过、且确实没让人知道的事。**
 *    价目从 `narrative-memory` 里 visibility === "private" 的记忆中扣取。
 *    这条规则有一个很妙的副作用：一个全程循制留痕、事事公开的玩家
 *    **买不起任何谶语**——因为她没有私事。预知未来这件事，只对
 *    在暗处做过事的人开放。这是取舍，不是门槛。
 *
 * 3. **交出去的秘密是真的会回来的。**
 *    `secret_surrendered:*` 会成为 E11 延迟后果的一条合法知情渠道：
 *    阁主本人确实知道这件事，因为是你亲口告诉她的。
 *    到第十一章，她的册子可能比你手里的证据更有威胁。
 *
 * ── 关于阁主的失明 ──────────────────────────────────────────────────
 *
 * 她读不了任何东西，是别人读给她听。她的能力不是「看见」，而是
 * 四十年间听过太多份档案，因此记得**同一种笔迹在哪几卷里出现过**。
 * 天机不是预言，是别人没读过的记录里能推出来的规律——
 * 这与空印案是同一条物理法则：文书决定什么是真的。
 * 任何暗示她「因盲而通神」的写法都必须视为 bug。
 *
 * ── 实现约束 ────────────────────────────────────────────────────────
 *
 * 纯派生。不新增 GameState 字段、不写入队列、不施加数值效果，
 * 全部状态挂在既有 tags 上，因此旧存档零迁移。
 */

import type { GameState } from "../types";
import { deriveTruths } from "./hidden-truth";
import { deriveNarrativeMemories } from "./narrative-memory";

/** 三道可问的谶语，各自挂在一条种子真相上。 */
export type ForecastId = "physician" | "fire" | "wind";

export type ForecastDefinition = {
  id: ForecastId;
  /** 玩家在阁中提出的问题。 */
  question: string;
  /** 最早可问的章节数（已完成章节数 ≥ 此值）。 */
  fromChapter: number;
  /** 阁主开价时的说法。 */
  priceLine: string;
  /**
   * 谶语的种类，决定它给出的是哪一层帮助：
   * - `signpost`：只告诉你去哪里看（二选一真相不能直接说）
   * - `exclusion`：排除三选一中的一种
   */
  kind: "signpost" | "exclusion";
};

export const forecastDefinitions: readonly ForecastDefinition[] = [
  {
    id: "physician",
    question: "温疏雨改那份脉案，究竟是为了救人，还是她本就在局中？",
    fromChapter: 3,
    priceLine: "医案的事，要用一件你替别人瞒下的事来换。",
    kind: "signpost",
  },
  {
    id: "fire",
    question: "若有一日库房起火，火是从哪一只手里来的？",
    fromChapter: 5,
    priceLine: "火的事贵些。要一件你独自决定、至今无人知道的事。",
    kind: "signpost",
  },
  {
    id: "wind",
    question: "消息若从我们中间漏出去，会是哪一段路？",
    fromChapter: 7,
    priceLine: "路的事最贵。你手里还剩几件没说出口的，我都听得出来。",
    kind: "exclusion",
  },
] as const;

/**
 * 谶语文本。
 *
 * 注意每一条都**没有回答问题**：
 * - signpost 给的是「若甲则你会看到 A，若乙则你会看到 B」——
 *   玩家必须在后面的章节里亲自去看，才知道自己站在哪一边。
 * - exclusion 只划掉三分之一。
 *
 * 这是「有用但不全知」的分界线。任何一条谶语如果单独就能让玩家
 * 确定真相，就是写坏了。
 */
export function forecastReading(state: GameState, id: ForecastId): string {
  const truths = deriveTruths(state.seed);
  // signpost 类**必须**与真相无关：它给的是判读规则，不是判读结果。
  // 若这里按真相分叉写两段文字，玩家一看措辞就知道答案，
  // 「有用但不全知」立刻塌掉。两种可能都写出来，让她自己去看。
  if (id === "physician") {
    return (
      "去看她正月里那几页的墨色。若前后一致，是一只手慢慢补的；" +
      "若中途换过一次，是两只手同时在写。\n\n" +
      "一只手补的案，多半是为了让谁活过那个冬天。两只手的，从一开始就不是为了救人。"
    );
  }
  if (id === "fire") {
    return (
      "放火的人会先把自己家不能失去的那一卷抱走。火熄了你去数：" +
      "若脉案齐整而兵册残缺，先被救的是脉案；反过来，先被救的是兵册。\n\n" +
      "怕丢兵册的是宗室，怕丢脉案的是崔氏门下。哪一卷完好，哪一家就在场。"
    );
  }
  // exclusion 类可以读真相，因为它只划掉三分之一，剩下的仍是二选一。
  const excluded = {
    "review-copy": "长春宫的收件那一段，你可以先放下——那条路这次是干净的。",
    "courier-route":
      "退回复核笺那一段，你可以先放下——那张纸这次没有离开过桌面。",
    "recipient-household":
      "宫门内递那一段，你可以先放下——那条路这次没有人多走一趟。",
  }[
    // 划掉的是**两个假选项中的一个**，不是真相本身。
    (["review-copy", "courier-route", "recipient-household"] as const).filter(
      (link) => link !== truths.leakLink,
    )[0]
  ];
  return `三段路里，我只能替你划掉一段。${excluded}剩下两段，你自己去试。`;
}

/**
 * 谶语兑现后留下的信念标签。
 *
 * signpost 类只留一个「我知道该看哪里」的标记，不预设结论；
 * exclusion 类留下一条真实的排除信息（被排除的那段确实不是真相）。
 */
export function forecastTags(state: GameState, id: ForecastId): string[] {
  const truths = deriveTruths(state.seed);
  const base = [`tianji_forecast:${id}`];
  if (id === "physician") return [...base, "tianji_hint:ledger-ink"];
  if (id === "fire") return [...base, "tianji_hint:fire-salvage"];
  const links = [
    "review-copy",
    "courier-route",
    "recipient-household",
  ] as const;
  const excluded = links.filter((link) => link !== truths.leakLink);
  // 只划掉一段，而不是两段：留下的仍是二选一。
  return [...base, `tianji_excluded:${excluded[0]}`];
}

// ---------------------------------------------------------------------------
// 价目：玩家真实的私密往事
// ---------------------------------------------------------------------------

export type SecretPrice = {
  /** 对应的 NarrativeMemory id。 */
  memoryId: string;
  /** 玩家界面上显示的说法。 */
  label: string;
  detail: string;
  /** 来源选择，供后续追责与 provenance 使用。 */
  sourceChoiceId: string;
};

/**
 * 玩家目前还能付得出的秘密。
 *
 * 只取 visibility === "private" 的记忆：那是确实发生过、
 * 且确实没有第三个人知道的事。已经付过的不再重复计价。
 */
export function availableSecrets(state: GameState): SecretPrice[] {
  return deriveNarrativeMemories(state)
    .filter((memory) => memory.visibility === "private")
    .filter((memory) => !state.tags.includes(`secret_surrendered:${memory.id}`))
    .map((memory) => ({
      memoryId: memory.id,
      label: memory.label,
      detail: memory.detail,
      sourceChoiceId: memory.sourceChoiceId,
    }));
}

/** 已经交给阁主的秘密。 */
export function surrenderedSecrets(state: GameState): SecretPrice[] {
  return deriveNarrativeMemories(state)
    .filter((memory) => state.tags.includes(`secret_surrendered:${memory.id}`))
    .map((memory) => ({
      memoryId: memory.id,
      label: memory.label,
      detail: memory.detail,
      sourceChoiceId: memory.sourceChoiceId,
    }));
}

/**
 * 阁主指定的价。
 *
 * 由种子与本局可付清单确定性选出，因此同一存档重放结果一致；
 * 但不同周目她会要走不同的东西。玩家仍可拒绝——拒绝就没有谶语。
 */
export function demandedSecret(
  state: GameState,
  id: ForecastId,
): SecretPrice | undefined {
  const pool = availableSecrets(state);
  if (!pool.length) return undefined;
  const salt = { physician: 1, fire: 2, wind: 3 }[id];
  const mix =
    Math.imul((Math.abs(state.seed) || 1) ^ (salt * 0x85ebca6b), 2246822519) >>>
    0;
  return pool[mix % pool.length];
}

export type TradeAvailability =
  | { kind: "ready"; forecast: ForecastDefinition; price: SecretPrice }
  | { kind: "already-asked"; forecast: ForecastDefinition }
  | { kind: "too-early"; forecast: ForecastDefinition }
  | { kind: "nothing-to-pay"; forecast: ForecastDefinition };

/**
 * 某一道谶语当前的可交易状态。
 *
 * `nothing-to-pay` 不是失败，而是这套系统最重要的一句话：
 * 你没有私事，所以你买不到未来。
 */
export function tradeAvailability(
  state: GameState,
  id: ForecastId,
): TradeAvailability {
  const forecast = forecastDefinitions.find((item) => item.id === id)!;
  if (state.tags.includes(`tianji_forecast:${id}`))
    return { kind: "already-asked", forecast };
  if (state.completedChapters.length < forecast.fromChapter)
    return { kind: "too-early", forecast };
  const price = demandedSecret(state, id);
  return price
    ? { kind: "ready", forecast, price }
    : { kind: "nothing-to-pay", forecast };
}

/** 当前可以真正成交的谶语。 */
export function tradableForecasts(state: GameState) {
  return forecastDefinitions
    .map((item) => tradeAvailability(state, item.id))
    .filter(
      (item): item is Extract<TradeAvailability, { kind: "ready" }> =>
        item.kind === "ready",
    );
}

// ---------------------------------------------------------------------------
// 册子：阁主手里的东西如何变成威胁
// ---------------------------------------------------------------------------

export type LedgerExposure = "none" | "noted" | "leveraged" | "decisive";

/**
 * 秘录册对玩家的威胁程度。
 *
 * 分级刻意做得慢：交出一件不算什么，两件她开始能讲出一个关于你的故事，
 * 三件她手里的册子比你手里的证据更能决定别人怎么看你。
 */
export function ledgerExposure(state: GameState): LedgerExposure {
  if (state.tags.includes("tianji_ledger_burned")) return "none";
  const count = surrenderedSecrets(state).length;
  if (count >= 3) return "decisive";
  if (count === 2) return "leveraged";
  if (count === 1) return "noted";
  return "none";
}

export const ledgerExposureLabels: Record<LedgerExposure, string> = {
  none: "阁中无你的册页。",
  noted: "阁中记着你的一件事；单独一件说明不了什么。",
  leveraged: "阁中的两件事已经能连成一句关于你的话。",
  decisive: "阁中的册页比你手里的任何一件证物都更能决定别人如何叙述你。",
};

/** 阁主是否确实知道某件事——她只知道玩家亲手交给她的。 */
export function archivistKnows(state: GameState, memoryId: string) {
  return state.tags.includes(`secret_surrendered:${memoryId}`);
}
