import type { Effect, GameState } from "../types";
import { courtAttention } from "../state/engine";
import { isDelayedConsequenceReady } from "../state/delayed-consequences";

export type SideStoryChoice = {
  id: string;
  text: string;
  outcome: string;
  effect: Effect;
  emperor?: { favor?: number; trust?: number };
  demote?: boolean;
  requiresStat?: { stat: keyof GameState["stats"]; min: number };
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
    id: "exhaustion-physician-order",
    eyebrow: "困局副本 · 强撑",
    title: "太医留下的禁足单",
    danger: true,
    text: "你连续两章带着倦色走出宫门。太医把脉后没有开药，只留下一张三日禁足单。偏偏今夜有人送来一封必须亲自辨认的密信。",
    available: (state) => state.resourcePressure.exhaustion >= 2,
    choices: [
      {
        id: "exhaustion_obey",
        text: "关门静养，让别人替你看住今夜。",
        outcome: "你错过了一条消息，却保住了还能走到更远处的身体。",
        effect: { stats: { 体力: 4, 名望: -1 }, tags: ["obeyed_physician"] },
      },
      {
        id: "exhaustion_hire_eyes",
        text: "出一份银钱，请高福安替你辨认送信人。",
        outcome: "你没有踏出寝宫，密信背后的脚步却被记了下来。",
        effect: {
          stats: { 体力: 2, 银钱: -1, 谋略: 1 },
          relations: { 高福安: 1 },
          tags: ["delegated_secret_watch"],
        },
        requiresStat: { stat: "银钱", min: 1 },
      },
    ],
  },
  {
    id: "arrears-red-mark",
    eyebrow: "困局副本 · 月例",
    title: "月例簿上的红圈",
    danger: true,
    text: "你的月例刚入账便见了底。尚宫局在名字旁画了一个红圈：再有一笔临时支取，就要写明是谁替你担保。",
    available: (state) => state.resourcePressure.arrears >= 2,
    choices: [
      {
        id: "arrears_ask_gao",
        text: "请高福安担保，先把眼前的窟窿补上。",
        outcome:
          "银钱到账得很快。高福安把担保凭据折好，提醒你宫里没有白借的人情。",
        effect: {
          stats: { 银钱: 3 },
          relations: { 高福安: -1 },
          tags: ["debt:高福安"],
        },
      },
      {
        id: "arrears_cut_display",
        text: "撤掉本月陈设，把拮据公开当成节俭。",
        outcome: "有人笑你寒酸，也有人第一次相信你不靠排场撑住位分。",
        effect: {
          stats: { 银钱: 2, 名望: 1 },
          relations: { 顾明华: -1 },
          tags: ["public_frugality"],
        },
      },
    ],
  },
  {
    id: "gu-long-grudge",
    eyebrow: "敌对副本 · 暗流",
    title: "长春宫的空茶",
    danger: true,
    text: "顾明华与你交恶已久。今日御前忽然出现一份指称你恃宠越礼的联名帖，落款里甚至有两个从未见过你的宫人。若让它进入正式议处，刚得到的位分未必保得住。",
    available: (state) =>
      isDelayedConsequenceReady(state, "gu-public-humiliation") &&
      state.relations.顾明华 <= -30 + Math.floor(courtAttention(state) / 4) &&
      state.relationshipStrain.顾明华 >= 2,
    choices: [
      {
        id: "gu_grudge_confront",
        text: "带着联名帖去长春宫，当面逐个核对落款。",
        outcome:
          "两个名字当场露出破绽。顾明华没有认输，却撤回了要求降位的最后一句。",
        effect: {
          stats: { 胆识: 1 },
          relations: { 顾明华: 1 },
          tags: ["revenge_answered:gu-public-humiliation"],
        },
      },
      {
        id: "gu_grudge_queen",
        text: "请皇后按宫规密审，不把争宠变成御前笑话。",
        outcome: "沈令仪封存联名帖，也记住你在最难堪的时候仍选择了程序。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 沈令仪: 1 },
          tags: ["revenge_answered:gu-public-humiliation"],
        },
      },
      {
        id: "gu_grudge_ignore",
        text: "不回应，让皇帝的宠爱替你压下议论。",
        outcome:
          "帖子被压下，降位却成为平息宫议的代价。宠爱能挡住一时，不能替你回答所有人。",
        effect: {
          stats: { 名望: -1 },
          relations: { 顾明华: -1 },
          tags: ["revenge_answered:gu-public-humiliation"],
        },
        emperor: { favor: -8, trust: -5 },
        demote: true,
      },
    ],
  },
  {
    id: "gao-copy-changes-hands",
    eyebrow: "旧账副本 · 易手",
    title: "高福安袖中的第二份",
    danger: true,
    text: "当初，你把空印的秘密交给了皇后。今日高福安来得比平日更客气：那份拓记并非只有一份，另一份已经有人出价。他不问你忠于谁，只问当初替你冒险的人，如今该靠谁保命。",
    available: (state) =>
      isDelayedConsequenceReady(state, "gao-copy-changes-hands"),
    choices: [
      {
        id: "gao_copy_protect_clerks",
        text: "由你在归档页署名，换经手宫人的名字从案卷里摘出去。",
        outcome:
          "高福安收回了待价的名单，副本则正式归档。从此没人能说你不知情，但替你递纸的人得以全身而退。",
        effect: {
          relations: { 高福安: 1 },
          tags: [
            "revenge_answered:gao-copy-changes-hands",
            "gao_clerks_protected",
            "liability:empty_seal_signed_archive",
          ],
        },
      },
      {
        id: "gao_copy_repay_debt",
        text: "拿两份银钱偿还旧情，请他只交副本，不交来路。",
        outcome:
          "银钱封不住所有嘴，却让高福安肯替你封住这一张。他把收据留给自己，提醒你人情还清了，痕迹没有。",
        effect: {
          stats: { 银钱: -2 },
          relations: { 高福安: 1 },
          tags: ["revenge_answered:gao-copy-changes-hands", "gao_debt_repaid"],
        },
        requiresStat: { stat: "银钱", min: 2 },
      },
      {
        id: "gao_copy_trace_buyer",
        text: "让副本照常易手，暗中追查是谁肯为它出价。",
        outcome:
          "你找到了买家，也让高福安知道你宁愿冒失去证据的风险，也不肯再欠他一次。",
        effect: {
          stats: { 谋略: 1, 名望: -1 },
          relations: { 高福安: -1 },
          tags: [
            "revenge_answered:gao-copy-changes-hands",
            "gao_copy_buyer_traced",
          ],
        },
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
