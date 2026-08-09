import type { GameState, RelationKey } from "../types";

export type ConsequenceRequirement = {
  any?: string[];
  all?: string[];
};

export type DelayedConsequence = {
  id: string;
  instigator: RelationKey;
  causes: Array<{
    tag: string;
    chapter: number;
    weight: 1 | 2;
    label: string;
    cancelTags?: string[];
  }>;
  knowledge: Array<{
    channel: "direct" | "public" | "witness";
    label: string;
    requires: ConsequenceRequirement;
  }>;
  delayChapters: number;
  timingLabel: string;
  target: {
    kind: "rank" | "evidence" | "command" | "reputation";
    label: string;
  };
  relationMax?: number;
  defuseTags?: string[];
  deathTags?: string[];
  resolvedStoryId: string;
  responses: Array<{
    id: "confront" | "procedure" | "bargain" | "absorb-cost";
    label: string;
  }>;
};

export type DelayedConsequenceStatus =
  | "dormant"
  | "unknown-to-instigator"
  | "waiting"
  | "defused"
  | "ready"
  | "resolved";

const matches = (state: GameState, requirement: ConsequenceRequirement) =>
  (requirement.any?.some((tag) => state.tags.includes(tag)) ?? true) &&
  (requirement.all?.every((tag) => state.tags.includes(tag)) ?? true);

export const delayedConsequences: DelayedConsequence[] = [
  {
    id: "gu-public-humiliation",
    instigator: "顾明华",
    causes: [
      {
        tag: "day3_gu_accused",
        chapter: 3,
        weight: 2,
        label: "玩家曾公开把毒香疑点指向顾明华。",
        cancelTags: ["ch6_gu_placated"],
      },
      {
        tag: "ch8_side_queen",
        chapter: 8,
        weight: 1,
        label: "玩家在凤印争夺中明确站在沈令仪一边。",
      },
    ],
    knowledge: [
      {
        channel: "direct",
        label: "顾明华亲历指控，也身处玩家明确选边的同一场权斗。",
        requires: { any: ["day3_gu_accused", "ch8_side_queen"] },
      },
    ],
    delayChapters: 2,
    timingLabel: "等玩家位分与注目足以让议处真正产生代价。",
    target: { kind: "rank", label: "玩家的位分与御前体面" },
    relationMax: -30,
    resolvedStoryId: "gu-long-grudge",
    responses: [
      { id: "confront", label: "当面对质来源" },
      { id: "procedure", label: "交由宫规复核" },
      { id: "absorb-cost", label: "以帝心压下并承担政治代价" },
    ],
  },
  {
    id: "gao-copy-changes-hands",
    instigator: "高福安",
    causes: [
      {
        tag: "empty_seal_queen",
        chapter: 4,
        weight: 2,
        label: "玩家把高福安冒险交出的空印秘密直接转给皇后。",
      },
    ],
    knowledge: [
      {
        channel: "direct",
        label: "空印由高福安亲手交出，他知道秘密流向。",
        requires: { all: ["empty_seal_queen"] },
      },
    ],
    delayChapters: 2,
    timingLabel: "等下一条文书链出现买家与保命去处。",
    target: { kind: "evidence", label: "空印副本与消息通路的控制权" },
    relationMax: -10,
    defuseTags: ["gao_debt_repaid", "ch9_protect_survivors"],
    deathTags: ["ch9_gao_dead"],
    resolvedStoryId: "gao-copy-changes-hands",
    responses: [
      { id: "procedure", label: "承认转交并保护经手宫人" },
      { id: "bargain", label: "偿还人情，换他只交副本" },
      { id: "absorb-cost", label: "追查流向并留下财源痕迹" },
    ],
  },
  {
    id: "pei-private-order-refused",
    instigator: "裴照南",
    causes: [
      {
        tag: "day4_pei_alienated",
        chapter: 4,
        weight: 1,
        label: "玩家曾越过裴照南封存账簿。",
        cancelTags: ["ch6_legacy_pei_credit"],
      },
      {
        tag: "ch7_pei_removed",
        chapter: 7,
        weight: 2,
        label: "玩家在春猎后撤下裴照南。",
      },
    ],
    knowledge: [
      {
        channel: "direct",
        label: "越权与撤职都发生在裴照南职责范围内。",
        requires: { any: ["day4_pei_alienated", "ch7_pei_removed"] },
      },
    ],
    delayChapters: 2,
    timingLabel: "等宫门或军粮再次需要一纸私令。",
    target: { kind: "command", label: "玩家调动宫门与军令的可信度" },
    defuseTags: ["ch7_pei_defended"],
    resolvedStoryId: "pei-private-order-refused",
    responses: [
      { id: "procedure", label: "接受公开复核" },
      { id: "bargain", label: "归还一部分指挥体面" },
      { id: "absorb-cost", label: "绕过她下令并承担私令责任" },
    ],
  },
];

export function delayedConsequenceStatus(
  state: GameState,
  consequence: DelayedConsequence,
): DelayedConsequenceStatus {
  if (
    state.tags.includes(`revenge_answered:${consequence.id}`) ||
    state.resolvedSideStories.includes(consequence.resolvedStoryId)
  ) {
    return "resolved";
  }

  const caused = consequence.causes.filter((cause) =>
    state.tags.includes(cause.tag),
  );
  if (!caused.length) return "dormant";
  const knownCauses = caused.filter(
    (cause) => !cause.cancelTags?.some((tag) => state.tags.includes(tag)),
  );
  if (!knownCauses.length) return "defused";
  if (
    !consequence.knowledge.some((channel) => matches(state, channel.requires))
  ) {
    return "unknown-to-instigator";
  }
  if (
    consequence.deathTags?.some((tag) => state.tags.includes(tag)) ||
    consequence.defuseTags?.some((tag) => state.tags.includes(tag)) ||
    (consequence.relationMax !== undefined &&
      state.relations[consequence.instigator] > consequence.relationMax)
  ) {
    return "defused";
  }

  const firstKnownCauseChapter = Math.min(
    ...knownCauses.map((cause) => cause.chapter),
  );
  if (
    state.completedChapters.length <
    firstKnownCauseChapter + consequence.delayChapters
  ) {
    return "waiting";
  }
  return "ready";
}

export function delayedConsequenceSeverity(
  state: GameState,
  consequence: DelayedConsequence,
) {
  const knownWeight = consequence.causes
    .filter(
      (cause) =>
        state.tags.includes(cause.tag) &&
        !cause.cancelTags?.some((tag) => state.tags.includes(tag)),
    )
    .reduce((sum, cause) => sum + cause.weight, 0);
  return knownWeight >= 3 ? "settled" : "grudge";
}

export const readyDelayedConsequences = (state: GameState) =>
  delayedConsequences.filter(
    (consequence) => delayedConsequenceStatus(state, consequence) === "ready",
  );

export const isDelayedConsequenceReady = (state: GameState, id: string) => {
  const consequence = delayedConsequences.find((item) => item.id === id);
  return consequence
    ? delayedConsequenceStatus(state, consequence) === "ready"
    : false;
};
