import type { GameState } from "../types";

export type CuiKnowledgeId =
  | "chapter-five-mercy"
  | "chapter-five-witness-record"
  | "chapter-five-public-ledger"
  | "chapter-six-public-accounts"
  | "chapter-six-formal-relief";

export type CuiResponsibilityStance =
  | "guards-continuity"
  | "permits-accountability"
  | "witnesses-transition";

export type CuiKnowledge = {
  id: CuiKnowledgeId;
  sourceChoiceIds: string[];
  label: string;
  detail: string;
};

const knowledgeDefinitions: CuiKnowledge[] = [
  {
    id: "chapter-five-mercy",
    sourceChoiceIds: ["day5_3_1"],
    label: "活退也是落款",
    detail: "你曾让惠嫔活着退养；太后接受了责任安排不必等同于处死一人。",
  },
  {
    id: "chapter-five-witness-record",
    sourceChoiceIds: ["day5_3_2"],
    label: "证人正式留档",
    detail: "你曾公开保护温疏雨，并让药单与脉案进入正式记录。",
  },
  {
    id: "chapter-five-public-ledger",
    sourceChoiceIds: ["day5_3_3"],
    label: "丑闻转入公案",
    detail: "你拒绝交出替罪者，把赈灾名单送进朝廷亏空调查。",
  },
  {
    id: "chapter-six-public-accounts",
    sourceChoiceIds: ["day6_1_3"],
    label: "满朝认捐",
    detail: "你曾公开亏空，银子来得很快，旧怨也来得很快。",
  },
  {
    id: "chapter-six-formal-relief",
    sourceChoiceIds: ["day5_3_3", "day6_3_1"],
    label: "问罪与赈运分开",
    detail: "你把账送进公案，又让皇后先开仓；太后知道你能把问罪与办事分开。",
  },
];

export function deriveCuiKnowledge(
  state: Pick<GameState, "history">,
): CuiKnowledge[] {
  return knowledgeDefinitions.filter((entry) =>
    entry.sourceChoiceIds.every((choiceId) => state.history.includes(choiceId)),
  );
}

export function cuiMemoryCallback(state: Pick<GameState, "history">) {
  const known = deriveCuiKnowledge(state);
  if (known.some((entry) => entry.id === "chapter-six-formal-relief")) {
    return "你曾把赈灾账送进公案，却没有让粮船停下。哀家记得你会分开问罪与办事。";
  }
  if (known.some((entry) => entry.id === "chapter-five-mercy")) {
    return "你从前给惠嫔留过退路。今日也给这张命令留一条退路。";
  }
  if (known.some((entry) => entry.id === "chapter-six-public-accounts")) {
    return "你曾让满朝当场认捐。银子来得快，旧怨也来得快。今日别只图快。";
  }
  return null;
}

export function deriveCuiResponsibility(
  state: Pick<GameState, "history" | "tags">,
): CuiResponsibilityStance {
  if (
    state.tags.some((tag) =>
      [
        "cui_accepts_legitimate_regency",
        "cui_accepts_shared_signature",
        "cui_accepts_public_signature",
        "cui_accepts_limited_regency",
      ].includes(tag),
    )
  ) {
    return "witnesses-transition";
  }
  if (
    deriveCuiKnowledge(state).some((entry) =>
      [
        "chapter-five-mercy",
        "chapter-five-witness-record",
        "chapter-five-public-ledger",
        "chapter-six-formal-relief",
      ].includes(entry.id),
    )
  ) {
    return "permits-accountability";
  }
  return "guards-continuity";
}

export function cuiAcceptanceCopy(tags: readonly string[]) {
  if (tags.includes("legitimacy:regency:precedent-and-coalition")) {
    return "旧例给它来处，共署给它去处。哀家认这是一道摄政令。";
  }
  if (tags.includes("legitimacy:regency:public-record-and-concession")) {
    return "你先写下不能做什么，才有资格写能做什么。哀家为此作证。";
  }
  if (tags.includes("legitimacy:regency:shared-duty-and-concession")) {
    return "两宫肯把名字与你写在一处，哀家便不替她们说不。";
  }
  return null;
}
