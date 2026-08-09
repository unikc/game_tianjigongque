import type { Choice, GameState, Scene } from "../types";
import { deriveTruths, type LeakLink } from "./hidden-truth";

export type CanaryRecord = {
  link: LeakLink;
  mark: "笺" | "路" | "封";
  route: string;
  message: string;
  reaction: string;
};

export const leakCanaries: readonly CanaryRecord[] = [
  {
    link: "review-copy",
    mark: "笺",
    route: "复核副本",
    message: "凤印异议副本子初移入西档，封签用青线。",
    reaction: "西档有人持青线封签找卷，火星随后落在门槛内。",
  },
  {
    link: "courier-route",
    mark: "路",
    route: "内递路线",
    message: "鼠册活口改由御药院偏门转送。",
    reaction: "御药院偏门出现冒名小轿，轿夫手里是抄过一遍的路牌。",
  },
  {
    link: "recipient-household",
    mark: "封",
    route: "收件宫人",
    message: "顾昭仪所得后半册藏在长春宫旧琴匣。",
    reaction: "长春宫旧琴匣被人提前调包，宫外也先传出了半册的藏处。",
  },
] as const;

const observationFor: Record<LeakLink, string> = {
  "review-copy": "leak:observed:review-copy",
  "courier-route": "leak:observed:courier-route",
  "recipient-household": "leak:observed:recipient-household",
};

export function observedLeakLink(state: GameState): LeakLink | undefined {
  return leakCanaries.find((record) =>
    state.tags.includes(observationFor[record.link]),
  )?.link;
}

const labelFor: Record<LeakLink, string> = {
  "review-copy": "暂停复核副本链",
  "courier-route": "更换内递路线",
  "recipient-household": "清查长春宫收件链",
};

const consequenceFor: Record<LeakLink, Choice["effect"]> = {
  "review-copy": {
    relations: { 谢明微: -1 },
    tags: ["review-desk-suspended"],
  },
  "courier-route": {
    relations: { 高福安: -1 },
    tags: ["courier-route-rotated"],
  },
  "recipient-household": {
    relations: { 顾明华: -1 },
    tags: ["gu-household-audited"],
  },
};

export function leakReaction(seed: number): CanaryRecord {
  const truth = deriveTruths(seed).leakLink;
  return leakCanaries.find((record) => record.link === truth)!;
}

export function buildLeakReturnScene(state: GameState): Scene {
  const truth = deriveTruths(state.seed).leakLink;
  const observed = observedLeakLink(state);
  const observedRecord =
    leakCanaries.find((record) => record.link === observed) ?? leakCanaries[0];
  const hasIndependentEvidence = observed === truth;
  const evidenceText = hasIndependentEvidence
    ? truth === "review-copy"
      ? `谢明微将离桌记录与青线封签对上：${leakReaction(state.seed).reaction}`
      : truth === "courier-route"
        ? `监看宫人拿旧路牌时刻簿逐项核对：${leakReaction(state.seed).reaction}`
        : `长春宫守门名录记下先到之人：${leakReaction(state.seed).reaction}`
    : `你守着${observedRecord.route}，预期的动作没有发生。别处只报来一处封条被换，来人与时刻都混在火场里，尚不足以区分余下两链。`;

  return {
    id: "day9_leak_return",
    title: "风声回返",
    chapterLabel: "第9日",
    progress: { current: 3, total: 5 },
    speaker: "宫火回报",
    text: `${evidenceText} 这能证明或排除一段路径，不能替你判定是谁伸了手。`,
    choices: [
      ...leakCanaries.map((record) => {
        const correct = record.link === truth;
        const known = correct && hasIndependentEvidence;
        const base = consequenceFor[record.link];
        return {
          id: `day9_leak_accuse_${record.link}`,
          text: labelFor[record.link],
          outcome: correct
            ? known
              ? "回流痕迹与第二份记录对上了。你封住失守环节，只追问经手次序，没有把代表人物写成现成的罪名。"
              : "这条链被暂时封住，第二次删改没有发生；但单凭一次回流，你仍只掌握一项有力推断。"
            : "这条链上的异样另有旧因。无辜的经手者被停了差，真正失守的环节也因此多出一夜改路。",
          effect: {
            ...base,
            tags: [
              ...(base.tags ?? []),
              `belief_leak:${record.link}`,
              `accused_link:${record.link}`,
              ...(known ? [`known_leak_link:${record.link}`] : []),
              ...(correct ? ["leak-path-contained"] : ["actual-leak-adapts"]),
            ],
          },
          next: "day9_2",
        } satisfies Choice;
      }),
      {
        id: "day9_leak_rotate_all",
        text: "公开三札试探，轮换三条路线，暂不归责。",
        outcome:
          "三条路线一并换手，没有宫人因一次推断被写成罪名。对方也知道试探已经暴露，下一次核验会更慢。",
        effect: { tags: ["canaries-published", "actual-leak-adapts"] },
        next: "day9_2",
      },
    ],
  };
}
