import type { ChapterId, GameState, RelationKey } from "../types";

export type StrategyMode =
  | "procedure"
  | "leverage"
  | "care"
  | "command"
  | "coalition";

export type MemoryVisibility = "private" | "actor" | "court" | "public";
export type MemoryStatus = "active" | "resolved" | "superseded";
export type MemoryObserver = "self" | "court" | RelationKey;

export type NarrativeMemory = {
  id: string;
  chapter: ChapterId;
  sceneId: string;
  sourceChoiceId: string;
  label: string;
  detail: string;
  sourceActors: RelationKey[];
  visibility: MemoryVisibility;
  status: MemoryStatus;
  strategies: readonly [StrategyMode] | readonly [StrategyMode, StrategyMode];
  provenance: readonly string[];
};

type NarrativeMemoryDefinition = Omit<NarrativeMemory, "status"> & {
  resolvedBy?: readonly string[];
  supersededBy?: readonly string[];
};

export const strategyModes: Record<
  StrategyMode,
  { label: string; description: string }
> = {
  procedure: {
    label: "循制留痕",
    description: "你曾借规制、见证与正式记录，让事情留下可复核的来处。",
  },
  leverage: {
    label: "藏锋持筹",
    description: "你曾把秘密或证据留在手中，等待更合适的交换时机。",
  },
  care: {
    label: "护人留路",
    description: "你曾先替具体的人保住性命、体面或日后的退路。",
  },
  command: {
    label: "当机担责",
    description: "你曾亲自作出决断，也把由此而来的责任留在自己名下。",
  },
  coalition: {
    label: "合议借势",
    description: "你曾把权责分给与事之人，让几方共同把事情做成。",
  },
};

const definitions: readonly NarrativeMemoryDefinition[] = [
  {
    id: "entry-watch-before-speaking",
    chapter: "chapter-1",
    sceneId: "entry",
    sourceChoiceId: "entry_watch",
    label: "宫门初启",
    detail: "你先看清众人的慌张与镇定，才决定如何开口。",
    sourceActors: ["高福安"],
    visibility: "actor",
    strategies: ["leverage"],
    provenance: ["choice:entry_watch"],
  },
  {
    id: "entry-own-the-duck",
    chapter: "chapter-1",
    sceneId: "duck",
    sourceChoiceId: "duck_admit",
    label: "绣鸭献瑞",
    detail: "你在御前认下绣鸭，把失仪变成自己可以回答的一句话。",
    sourceActors: ["沈令仪", "顾明华", "高福安"],
    visibility: "court",
    strategies: ["command"],
    provenance: ["choice:duck_admit"],
  },
  {
    id: "seat-register-restored",
    chapter: "chapter-2",
    sceneId: "day2_register",
    sourceChoiceId: "day2_restore_name",
    label: "一席之争",
    detail: "你恢复旧帖上的名字，也把名册被改动的痕迹一并留下。",
    sourceActors: ["沈令仪", "顾明华", "高福安", "林栖梧"],
    visibility: "court",
    strategies: ["procedure", "care"],
    provenance: ["choice:day2_restore_name", "document:seat-register"],
  },
  {
    id: "seat-register-fiber-trace",
    chapter: "chapter-2",
    sceneId: "day2_register",
    sourceChoiceId: "day2_rabbit_trace",
    label: "一席之争",
    detail: "你独自对着窗光辨认刮痕与纸纤维，没有把判断说给旁人。",
    sourceActors: [],
    visibility: "private",
    strategies: ["procedure"],
    provenance: ["choice:day2_rabbit_trace", "document:seat-register"],
  },
  {
    id: "seat-register-open-table",
    chapter: "chapter-2",
    sceneId: "day2_summons",
    sourceChoiceId: "day2_rank_access",
    label: "一席之争",
    detail: "你请两宫把帖子送到同一张案前，当面核清先后。",
    sourceActors: ["沈令仪", "顾明华", "高福安"],
    visibility: "public",
    strategies: ["procedure", "coalition"],
    provenance: ["choice:day2_rank_access", "document:seat-register"],
  },
  {
    id: "seat-register-side-seat",
    chapter: "chapter-2",
    sceneId: "day2_register",
    sourceChoiceId: "day2_add_side_seat",
    label: "一席之争",
    detail: "你没有抹掉任何人的帖子，而是另添一席保住两边体面。",
    sourceActors: ["沈令仪", "顾明华", "高福安", "林栖梧"],
    visibility: "court",
    strategies: ["care", "coalition"],
    provenance: ["choice:day2_add_side_seat", "document:seat-register"],
  },
  {
    id: "seat-register-delegated-reply",
    chapter: "chapter-2",
    sceneId: "day2_summons",
    sourceChoiceId: "day2_split_task",
    label: "一席之争",
    detail: "你请高福安代送回帖，自己去取能核实席位的名册。",
    sourceActors: ["高福安"],
    visibility: "actor",
    strategies: ["coalition", "procedure"],
    provenance: ["choice:day2_split_task", "document:seat-register"],
  },
  {
    id: "gu-quiet-bargain",
    chapter: "chapter-2",
    sceneId: "day2_request",
    sourceChoiceId: "day2_trust_gu",
    label: "长春宫的请求",
    detail: "你答应暂守秘密，也请顾明华欠下一个解释。",
    sourceActors: ["顾明华"],
    visibility: "actor",
    strategies: ["leverage"],
    provenance: ["choice:day2_trust_gu", "consequence:gu-public-humiliation"],
    supersededBy: ["day3_gu_accused"],
  },
  {
    id: "incense-save-lin-first",
    chapter: "chapter-3",
    sceneId: "day3_incense",
    sourceChoiceId: "day3_save_lin",
    label: "合欢香冷",
    detail: "你让太医先救林栖梧，把洗清自己的先机放到后面。",
    sourceActors: ["林栖梧", "温疏雨"],
    visibility: "actor",
    strategies: ["care"],
    provenance: ["choice:day3_save_lin", "document:medical-record"],
  },
  {
    id: "incense-seal-and-register",
    chapter: "chapter-3",
    sceneId: "day3_incense",
    sourceChoiceId: "day3_seal_room",
    label: "合欢香冷",
    detail: "你封住香房，逐一登记碰过礼盒的人。",
    sourceActors: ["林栖梧", "温疏雨", "高福安"],
    visibility: "court",
    strategies: ["procedure", "command"],
    provenance: ["choice:day3_seal_room", "document:medical-record"],
  },
  {
    id: "incense-guard-lin",
    chapter: "chapter-3",
    sceneId: "day3_vigil",
    sourceChoiceId: "day3_guard_lin",
    label: "留谁到天明",
    detail: "你守住林栖梧到晨钟响起，让她活到能够作证。",
    sourceActors: ["林栖梧", "温疏雨"],
    visibility: "actor",
    strategies: ["care", "command"],
    provenance: ["choice:day3_guard_lin", "document:medical-record"],
  },
  {
    id: "blank-seal-held",
    chapter: "chapter-4",
    sceneId: "day4_blank_seal",
    sourceChoiceId: "day4_keep_seal",
    label: "雨夜空印",
    detail: "你把空印留在袖中，没有立刻让第三个人知道。",
    sourceActors: ["高福安"],
    visibility: "actor",
    strategies: ["leverage"],
    provenance: ["choice:day4_keep_seal", "document:blank-seal"],
    resolvedBy: ["empty_seal_burned"],
  },
  {
    id: "blank-seal-to-queen",
    chapter: "chapter-4",
    sceneId: "day4_blank_seal",
    sourceChoiceId: "day4_send_queen",
    label: "雨夜空印",
    detail: "你把空印交给沈令仪，请她封存印库并增设宫门值守。",
    sourceActors: ["沈令仪", "高福安"],
    visibility: "actor",
    strategies: ["procedure", "coalition"],
    provenance: [
      "choice:day4_send_queen",
      "consequence:gao-copy-changes-hands",
    ],
  },
  {
    id: "ledger-trusted-to-pei",
    chapter: "chapter-4",
    sceneId: "day4_ledger",
    sourceChoiceId: "day4_trust_pei",
    label: "雨夜军粮册",
    detail: "你给裴照南一夜查清家门，也为自己留下末页拓印。",
    sourceActors: ["裴照南"],
    visibility: "actor",
    strategies: ["leverage", "coalition"],
    provenance: ["choice:day4_trust_pei", "document:military-order"],
  },
  {
    id: "ledger-entered-official-case",
    chapter: "chapter-4",
    sceneId: "day4_ledger",
    sourceChoiceId: "day4_seize_ledger",
    label: "雨夜军粮册",
    detail: "你拒绝以私情处置军粮册，让它正式进入公案。",
    sourceActors: ["裴照南", "沈令仪"],
    visibility: "court",
    strategies: ["procedure", "command"],
    provenance: ["choice:day4_seize_ledger", "document:military-order"],
  },
  {
    id: "blank-seal-bait-order",
    chapter: "chapter-4",
    sceneId: "day4_gu_offer",
    sourceChoiceId: "day4_set_bait",
    label: "没有字的命令",
    detail: "你亲手写下诱敌的假调令，也把责任留在自己的笔下。",
    sourceActors: ["顾明华"],
    visibility: "actor",
    strategies: ["leverage", "command"],
    provenance: ["choice:day4_set_bait", "document:blank-seal"],
  },
  {
    id: "medical-witness-formally-kept",
    chapter: "chapter-5",
    sceneId: "day5_3",
    sourceChoiceId: "day5_3_2",
    label: "脉案留档",
    detail: "你公开保护温疏雨，让证人与脉案一并进入正式记录。",
    sourceActors: ["温疏雨"],
    visibility: "court",
    strategies: ["care", "procedure"],
    provenance: ["choice:day5_3_2", "document:medical-record"],
  },
  {
    id: "relief-ledger-entered-public-case",
    chapter: "chapter-5",
    sceneId: "day5_3",
    sourceChoiceId: "day5_3_3",
    label: "赈账入案",
    detail: "你把后宫丑闻转为公开亏空调查，让名单进入可复核的公案。",
    sourceActors: ["沈令仪"],
    visibility: "public",
    strategies: ["procedure", "command"],
    provenance: ["choice:day5_3_3", "document:relief-ledger"],
  },
  {
    id: "court-publicly-pledged-relief",
    chapter: "chapter-6",
    sceneId: "day6_1",
    sourceChoiceId: "day6_1_3",
    label: "满朝认捐",
    detail: "你当众摊开亏空，迫使百官把银两与姓名一并留在账上。",
    sourceActors: ["顾明华"],
    visibility: "public",
    strategies: ["command"],
    provenance: ["choice:day6_1_3", "document:relief-ledger"],
  },
  {
    id: "queen-relief-order-formalized",
    chapter: "chapter-6",
    sceneId: "day6_3",
    sourceChoiceId: "day6_3_1",
    label: "开仓落款",
    detail: "你把问罪与赈运分开，请皇后先为开仓命令正式落款。",
    sourceActors: ["沈令仪"],
    visibility: "court",
    strategies: ["coalition", "care"],
    provenance: ["choice:day6_3_1", "document:relief-order"],
  },
] as const;

// Choice history is the canonical source: result tags may be shared by several
// choices, so using them as a fallback could falsely attribute a specific act.
const hasSource = (state: GameState, memory: NarrativeMemoryDefinition) =>
  state.history.includes(memory.sourceChoiceId);

const statusFor = (
  state: GameState,
  memory: NarrativeMemoryDefinition,
): MemoryStatus => {
  if (memory.supersededBy?.some((tag) => state.tags.includes(tag)))
    return "superseded";
  if (memory.resolvedBy?.some((tag) => state.tags.includes(tag)))
    return "resolved";
  return "active";
};

export function deriveNarrativeMemories(state: GameState): NarrativeMemory[] {
  return definitions
    .filter((memory) => hasSource(state, memory))
    .map((definition) => ({
      id: definition.id,
      chapter: definition.chapter,
      sceneId: definition.sceneId,
      sourceChoiceId: definition.sourceChoiceId,
      label: definition.label,
      detail: definition.detail,
      sourceActors: [...definition.sourceActors],
      visibility: definition.visibility,
      strategies: definition.strategies,
      provenance: definition.provenance,
      status: statusFor(state, definition),
    }));
}

export function canObserveMemory(
  memory: NarrativeMemory,
  observer: MemoryObserver,
) {
  if (observer === "self") return true;
  if (observer === "court")
    return memory.visibility === "court" || memory.visibility === "public";
  return (
    memory.visibility === "public" || memory.sourceActors.includes(observer)
  );
}

export function observedNarrativeMemories(
  state: GameState,
  observer: MemoryObserver,
) {
  return deriveNarrativeMemories(state).filter((memory) =>
    canObserveMemory(memory, observer),
  );
}

export type StrategyProfileEntry = {
  mode: StrategyMode;
  count: number;
  formed: boolean;
  example?: NarrativeMemory;
};

export function deriveStrategyProfile(
  state: GameState,
  observer: MemoryObserver = "self",
): StrategyProfileEntry[] {
  const memories = observedNarrativeMemories(state, observer);
  return (Object.keys(strategyModes) as StrategyMode[]).map((mode) => {
    const matching = memories
      .filter((memory) => memory.strategies.includes(mode))
      .sort(
        (a, b) =>
          state.history.indexOf(a.sourceChoiceId) -
          state.history.indexOf(b.sourceChoiceId),
      );
    return {
      mode,
      count: Math.min(3, matching.length),
      formed: matching.length >= 2,
      example: matching.at(-1),
    };
  });
}
