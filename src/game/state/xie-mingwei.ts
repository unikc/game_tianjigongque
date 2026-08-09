import type { Choice, GameState, Scene } from "../types";
import {
  deriveNarrativeMemories,
  type NarrativeMemory,
  type StrategyMode,
} from "./narrative-memory";

export type XieObservationChannel = "official-record" | "public-record";
export type XieObservation = {
  memory: NarrativeMemory;
  channel: XieObservationChannel;
};

const reviewableMemoryChannels: Record<string, XieObservationChannel> = {
  "ledger-entered-official-case": "official-record",
  "medical-witness-formally-kept": "official-record",
  "relief-ledger-entered-public-case": "public-record",
  "court-publicly-pledged-relief": "public-record",
  "queen-relief-order-formalized": "official-record",
};

const modeOrder: StrategyMode[] = [
  "procedure",
  "leverage",
  "care",
  "command",
  "coalition",
];

export function deriveXieObservations(state: GameState): XieObservation[] {
  return deriveNarrativeMemories(state)
    .filter((memory) => reviewableMemoryChannels[memory.id])
    .map((memory) => ({
      memory,
      channel: reviewableMemoryChannels[memory.id],
    }));
}

export function deriveXieLearnedModes(state: GameState): StrategyMode[] {
  const observations = deriveXieObservations(state);
  return modeOrder
    .map((mode) => {
      const matching = observations.filter(({ memory }) =>
        memory.strategies.includes(mode),
      );
      return {
        mode,
        count: Math.min(2, matching.length),
        latest: Math.max(
          -1,
          ...matching.map(({ memory }) =>
            state.history.indexOf(memory.sourceChoiceId),
          ),
        ),
      };
    })
    .filter((entry) => entry.count >= 2)
    .sort(
      (a, b) =>
        b.latest - a.latest ||
        modeOrder.indexOf(a.mode) - modeOrder.indexOf(b.mode),
    )
    .slice(0, 2)
    .map((entry) => entry.mode);
}

const responseCopy: Record<StrategyMode, string> = {
  procedure: "她先把原件与异议页分开，见证只能证明自己看见的那一段。",
  leverage: "她只在收件簿写明缺页，让未交出的部分成为一项公开缺口。",
  care: "她没有催人开口，只问哪些话可以今日入档。",
  command: "她把空白署名处推到你面前，也把期限写在旁边。",
  coalition: "她把各人同意的句子分开誊写，不许‘众议如此’遮住分歧。",
};

export function xieAdaptiveCopy(state: GameState) {
  const observations = deriveXieObservations(state);
  return deriveXieLearnedModes(state).map((mode) => {
    const sources = observations
      .filter(({ memory }) => memory.strategies.includes(mode))
      .slice(-2)
      .map(({ memory }) => `《${memory.label}》`)
      .join("与");
    return `${sources}留下了相同的行事次序；${responseCopy[mode]}`;
  });
}

export const xieReviewBaseChoices: Choice[] = [
  {
    id: "day8_xie_source_review",
    text: "让她按来源逐页复核，接受半刻延误。",
    outcome:
      "三份材料终于有了各自的来处，异议也被永久附在卷末。你赢得可援引的记录，也错过了最快的定局。",
    effect: {
      stats: { 体力: -1, 礼仪: 1 },
      relations: { 谢明微: 1 },
      tags: ["xie:dissent-attached", "xie:source-reviewed"],
    },
    next: "day8_3",
  },
  {
    id: "day8_xie_witness_scope",
    text: "请当事人逐名确认，哪些内容可以公开。",
    outcome:
      "证词因此变窄，却没有人被替她决定何时暴露姓名。谢明微第一次在‘缺页’旁写下：候本人补录。",
    effect: {
      stats: { 人情: 1 },
      relations: { 谢明微: 1 },
      tags: ["xie:testimony-scope-narrow", "xie:delayed-record"],
    },
    next: "day8_3",
  },
  {
    id: "day8_xie_player_liability",
    text: "由你署名担责，命她先收件、后补手续。",
    outcome:
      "材料赶在凤印落定前入案，你的名字也留在所有缺漏之前。谢明微收了件，却没有替你省掉一个责任人。",
    effect: {
      stats: { 胆识: 1 },
      relations: { 谢明微: -1 },
      tags: ["xie:player-authored-emergency-record"],
    },
    next: "day8_3",
  },
  {
    id: "day8_xie_parallel_dissent",
    text: "两人各留一份带异议副本，同时送往两宫。",
    outcome:
      "你失去了独占版本，谢明微也失去了独占解释。两份异议同时抵达，此后谁都不能假装众人从来意见一致。",
    effect: {
      stats: { 谋略: 1 },
      relations: { 谢明微: 1, 沈令仪: -1, 顾明华: -1 },
      tags: [
        "xie:parallel-dissent-records",
        "xie:willing-to-co-review",
        "xie:coalition-disagreement-public",
      ],
    },
    next: "day8_3",
  },
];

export function buildXieReviewScene(state: GameState): Scene {
  const learned = deriveXieLearnedModes(state);
  const choices = xieReviewBaseChoices.map((choice) => ({
    ...choice,
    effect: {
      ...choice.effect,
      tags: [...(choice.effect.tags ?? [])],
    },
  }));
  learned.forEach((mode) => {
    const index =
      mode === "procedure"
        ? 0
        : mode === "care"
          ? 1
          : mode === "command"
            ? 2
            : 3;
    choices[index].effect.tags = [
      ...(choices[index].effect.tags ?? []),
      `xie:countered:${mode}`,
    ];
    if (mode === "procedure") {
      choices[index].effect.stats = {
        ...choices[index].effect.stats,
        体力: -2,
      };
      choices[index].outcome += " 她预先拆开两轮复核，延误比你预计的更久。";
    }
    if (mode === "care") {
      choices[index].effect.stats = {
        ...choices[index].effect.stats,
        名望: -1,
      };
      choices[index].outcome +=
        " 一名材料涉及者拒绝扩大证词，公开案由因此变窄。";
    }
    if (mode === "command") {
      choices[index].effect.stats = {
        ...choices[index].effect.stats,
        体力: -1,
      };
      choices[index].outcome += " 她又补上一道期限，你必须亲自逐页确认。";
    }
    if (mode === "leverage") {
      choices[index].effect.stats = {
        ...choices[index].effect.stats,
        名望: -1,
      };
      choices[index].outcome +=
        " 缺失页也被列入两宫副本，未公开部分不再只由你解释。";
    }
    if (mode === "coalition") {
      choices[index].outcome +=
        " 她让两宫分别签下异议，联盟仍在，裂缝也从此可被援引。";
    }
  });
  return {
    id: "day8_xie_review",
    title: "三份不同的原本",
    chapterLabel: "第8日",
    progress: { current: 3, total: 4 },
    speaker: "司籍女史 · 谢明微",
    portrait: "xie",
    text: "顾明华交来的半份证据、皇后封存的旧档与你刚补上的记录，被摊成了三份不同的‘原本’。\n\n谢明微没有问你相信谁，只问：‘后来的人凭什么知道，哪一页先到？’",
    choices,
  };
}

export function xieCurrentStance(state: GameState) {
  if (state.tags.includes("xie:willing-to-co-review")) return "愿共核底册";
  if (deriveXieLearnedModes(state).length > 0) return "已封住旧路";
  return "仍在观察";
}
