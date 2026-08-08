import type { Effect, GameState } from "../types";
import { courtAttention } from "../state/engine";

export type SideStoryChoice = {
  id: string;
  text: string;
  outcome: string;
  effect: Effect;
  emperor?: { favor?: number; trust?: number };
  demote?: boolean;
};

export type SideStory = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  danger?: boolean;
  choices: SideStoryChoice[];
  available: (state: GameState) => boolean;
};

const owns = (state: GameState, rewardId: string) =>
  state.rewards.some((reward) => reward.id === rewardId);
const carries = (state: GameState, rewardId: string) =>
  owns(state, rewardId) && state.tags.includes(`carried_reward:${rewardId}`);

export const sideStories: SideStory[] = [
  {
    id: "gu-long-grudge",
    eyebrow: "敌对副本 · 暗流",
    title: "长春宫的空茶",
    danger: true,
    text: "顾明华与你交恶已久。今日御前忽然出现一份指称你恃宠越礼的联名帖，落款里甚至有两个从未见过你的宫人。若让它进入正式议处，刚得到的位分未必保得住。",
    available: (state) =>
      state.relations.顾明华 <= -30 + Math.floor(courtAttention(state) / 4) &&
      state.relationshipStrain.顾明华 >= 2,
    choices: [
      {
        id: "gu_grudge_confront",
        text: "带着联名帖去长春宫，当面逐个核对落款。",
        outcome:
          "两个名字当场露出破绽。顾明华没有认输，却撤回了要求降位的最后一句。",
        effect: { stats: { 胆识: 1 }, relations: { 顾明华: 1 } },
      },
      {
        id: "gu_grudge_queen",
        text: "请皇后按宫规密审，不把争宠变成御前笑话。",
        outcome: "沈令仪封存联名帖，也记住你在最难堪的时候仍选择了程序。",
        effect: { stats: { 礼仪: 1 }, relations: { 沈令仪: 1 } },
      },
      {
        id: "gu_grudge_ignore",
        text: "不回应，让皇帝的宠爱替你压下议论。",
        outcome:
          "帖子被压下，降位却成为平息宫议的代价。宠爱能挡住一时，不能替你回答所有人。",
        effect: { stats: { 名望: -1 }, relations: { 顾明华: -1 } },
        emperor: { favor: -8, trust: -5 },
        demote: true,
      },
    ],
  },
  {
    id: "shen-private-ledger",
    eyebrow: "人脉副本 · 亲近",
    title: "坤宁宫的私账",
    text: "沈令仪把一本不入尚宫局的私账交给你。上面没有银钱，只有历年被宫规保住、也被宫规牺牲的人名。她问你：规矩究竟应该保护谁？",
    available: (state) => state.relations.沈令仪 >= 30,
    choices: [
      {
        id: "shen_ledger_reform",
        text: "把能复核宫令的人写进规矩里。",
        outcome: "她第一次与你讨论的不是如何守规矩，而是如何改规矩。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 沈令仪: 1 },
          tags: ["shen_rules_reform"],
        },
        emperor: { trust: 5 },
      },
      {
        id: "shen_ledger_people",
        text: "先替账上仍活着的人补一条退路。",
        outcome:
          "三名旧宫人得到离宫文书。沈令仪没有称赞，只把私账留在了你手边。",
        effect: {
          stats: { 人情: 1 },
          relations: { 沈令仪: 2 },
          tags: ["shen_people_first"],
        },
      },
    ],
  },
  {
    id: "register-hidden-ink",
    eyebrow: "珍藏副本 · 墨痕",
    title: "名册背面的第二层字",
    text: "高福安用灯焰斜照刮痕名册，纸背浮出一道旧押记。改名的人不是临时起意，而是提前三日借走了尚宫局的旧印。",
    available: (state) =>
      carries(state, "keepsake-seat-register") && state.relations.高福安 >= 20,
    choices: [
      {
        id: "register_trace_borrower",
        text: "请高福安追查借印记录。",
        outcome: "一条原本断在宫宴的线，重新连向了宗室女眷与赈银名册。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 高福安: 1 },
          tags: ["knows_register_forger"],
        },
      },
      {
        id: "register_keep_leverage",
        text: "暂不声张，把押记作为日后的筹码。",
        outcome: "秘密没有立刻救人，却在你的珍藏里变成一把尚未出鞘的刀。",
        effect: { stats: { 人情: 1 }, tags: ["holds_register_leverage"] },
      },
    ],
  },
  {
    id: "pearl-false-edict",
    eyebrow: "帝心副本 · 御赐",
    title: "东珠照出的假口谕",
    text: "皇帝让你把御赐东珠与一枚口谕赏珠并放在灯下。真珠暖白，假珠泛青。他没有问你看出了什么，只问你愿不愿意替他记住这次伪造。",
    available: (state) =>
      carries(state, "item-imperial-pearl") && state.emperor.trust >= 40,
    choices: [
      {
        id: "pearl_accept_secret",
        text: "收下这份秘密，也收下以后作证的风险。",
        outcome: "从这一夜起，你不再只是被召见的人，也是皇帝留在暗处的证人。",
        effect: { stats: { 胆识: 1 }, tags: ["knows_false_edict_pearl"] },
        emperor: { trust: 8, favor: 3 },
      },
      {
        id: "pearl_request_record",
        text: "请他留下只有你们二人认得的复核记号。",
        outcome:
          "他在珠匣内侧落下一笔。亲密没有写在情话里，而写在共同承担的证据上。",
        effect: { stats: { 才学: 1 }, tags: ["imperial_private_mark"] },
        emperor: { trust: 5, favor: 6 },
      },
    ],
  },
];

export function availableSideStories(state: GameState) {
  return sideStories.filter(
    (story) =>
      !state.resolvedSideStories.includes(story.id) && story.available(state),
  );
}
