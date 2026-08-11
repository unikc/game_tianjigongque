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
  // ── 失败预警副本：三条出局路径的最后一次警告 ────────────────────────

  {
    id: "political-purge-warning",
    eyebrow: "危局副本 · 清算前夕",
    title: "墙外有人在数你的名字",
    danger: true,
    text:
      "你连续几章没有结交任何新的盟友，而顾明华那边的动作比往常更频繁。" +
      "宫里开始流传一句话——不知从哪里起——说你这个人「位分配不上她的动作」。" +
      "这不是弹劾，还没到那一步。但你能感觉到，下一步的名字已经被写进了某人的册子里。",
    available: (state) =>
      (state.relationshipStrain.顾明华 ?? 0) >= 2 &&
      state.relations.顾明华 <= -30 &&
      !Object.values(state.relations).some((v) => v >= 20) &&
      !state.tags.includes("political_purge_warning_seen"),
    choices: [
      {
        id: "purge_warn_find_ally",
        text: "主动去一个你一直没有深交的人那里，把她当作真正的盟友来对待。",
        outcome:
          "你选择了一个平时来往不多的人，说了一些比你习惯说的更真实的话。" +
          "她没有立刻回应，但她看你的眼神不一样了。这需要时间，但种子已经落下。",
        effect: {
          stats: { 人情: 1 },
          tags: ["political_purge_warning_seen", "ch_ally_sought"],
        },
      },
      {
        id: "purge_warn_find_emperor",
        text: "请求觐见，让皇帝亲眼看见你现在的样子——不是在表演，是在告诉他你的处境。",
        outcome:
          "你没有抱怨，只是如实说了。他听完没有立刻表态，但第二天顾明华的动作慢了一拍。" +
          "帝心是最贵的护符，也是最难维持的。",
        effect: {
          emperor: { trust: 5, favor: 3 },
          tags: ["political_purge_warning_seen"],
        },
      },
      {
        id: "purge_warn_ignore",
        text: "不理会。宫里总有人在数别人的名字，轮到你了也一样。",
        outcome:
          "你没有动。那句话还在墙外流传，而你选择相信时间站在你这边。" +
          "也许是，也许不是——但现在你已经知道了那个声音的存在。",
        effect: {
          stats: { 名望: -1 },
          tags: ["political_purge_warning_seen", "purge_warning_ignored"],
        },
      },
    ],
  },

  {
    id: "emperor-gone-cold",
    eyebrow: "危局副本 · 帝心冷却",
    title: "召见簿上三个空格",
    danger: true,
    text:
      "你已经连续三章没有被单独召见了。不是因为你做错了什么——是因为别人做对了什么。" +
      "帝王的注意力是有限的，而你最近恰好不在那个有限的范围里。" +
      "尚宫局的人开始在你面前说话更简短了。这是宫里的语言，比任何明确的消息都更难反驳。",
    available: (state) =>
      state.emperor.favor <= 15 &&
      state.emperor.trust <= 10 &&
      state.chaptersWithoutEmperor >= 3 &&
      state.completedChapters.length >= 5 &&
      !state.tags.includes("emperor_cold_warning_seen"),
    choices: [
      {
        id: "emperor_cold_attend",
        text: "备一份有实质内容的奏对，请求在下一次朝会后单独留下片刻。",
        outcome:
          "你没有带珠宝，也没有带说好话。你带的是一件他还没有解决的事的进展。" +
          "他听完，让你留到了掌灯时分。这不算宠爱，但它是信任。",
        effect: {
          emperor: { trust: 8, favor: 4 },
          stats: { 才学: 1 },
          tags: ["emperor_cold_warning_seen"],
        },
      },
      {
        id: "emperor_cold_accept",
        text: "接受现在的距离，把精力放在朝臣和后宫的关系上。",
        outcome:
          "你退出了帝王的视野，但你在别的地方深扎了根。" +
          "这是另一种活法——不靠帝心，靠别的东西。",
        effect: {
          stats: { 名望: 1, 人情: 1 },
          tags: ["emperor_cold_warning_seen", "emperor_path_abandoned"],
        },
      },
    ],
  },

  {
    id: "stamina-last-warning",
    eyebrow: "危局副本 · 强撑到头",
    title: "太医说这次不一样",
    danger: true,
    text:
      "太医这次来的时候没有带药箱。他把脉之后没有说话，只是让你的贴身宫人出去，然后说：" +
      "「再有一章这样下去，我没有办法只写禁足单了。」\n\n" +
      "他用的是「没有办法」，不是「不建议」。",
    available: (state) =>
      state.resourcePressure.exhaustion >= 3 &&
      state.stats.体力 <= 2 &&
      !state.tags.includes("stamina_last_warning_seen"),
    choices: [
      {
        id: "stamina_warn_rest",
        text: "这一章什么都不做，只休息。把所有约定都推掉。",
        outcome:
          "你关掉了门，让人传话说身体不适。损失了两件可能重要的事，" +
          "但你第一次在宫里睡了一整夜。",
        effect: {
          stats: { 体力: 5, 名望: -1 },
          tags: ["stamina_last_warning_seen", "obeyed_physician"],
          relations: { 顾明华: -1 },
        },
      },
      {
        id: "stamina_warn_push",
        text: "告诉太医你知道了，然后继续今天的安排。",
        outcome:
          "你把他的话压进一个等回来再想的格子里。" +
          "今天的事确实重要，但身体不会等你决定它什么时候重要。",
        effect: {
          stats: { 名望: 1 },
          tags: ["stamina_last_warning_seen", "ignored_physician_final"],
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
    id: "tianji-ledger-audit",
    eyebrow: "秘录副本 · 欠录",
    title: "阁中传来的一页抄件",
    danger: true,
    text:
      "一名不认识的小内侍送来一页抄件，没有落款。抄的是你自己说过的话——" +
      "一字不差，连你当时的停顿都用朱点标了出来。\n\n" +
      "纸背只有一行小字：“存档已满三件，按例知会本人。”\n\n" +
      "这不是勒索。天机阁从不勒索。她只是在告诉你：册子已经厚到能讲出一个关于你的故事了。",
    available: (state) =>
      isDelayedConsequenceReady(state, "tianji-ledger-called-in"),
    choices: [
      {
        id: "tianji_audit_request_copy",
        text: "回请一份完整抄件，看看她究竟记了什么。",
        outcome:
          "抄件送来了，比你记得的更全。你第一次从别人的笔下读到自己——" +
          "每一件都是真的，连起来却像另一个人。你把它收进箱底，从此知道对手会看到什么。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 卫夷则: 2 },
          tags: ["tianji_ledger_read"],
        },
      },
      {
        id: "tianji_audit_buy_back",
        text: "出重金赎回那三页。",
        outcome:
          "银钱退了回来，附一句话：“进了册子的，不用钱赎。”你只损失了一次试探，" +
          "以及她从此知道你在意什么。",
        effect: {
          stats: { 银钱: -3, 名望: -1 },
          relations: { 卫夷则: -2 },
          tags: ["tianji_buyback_refused"],
        },
        requiresStat: { stat: "银钱", min: 3 },
      },
      {
        id: "tianji_audit_preempt_self",
        text: "先一步把这三件事告诉沈令仪，由你自己的口说出来。",
        outcome:
          "皇后听完没有责难，只问了一句：“还有吗？”——你说没有了。" +
          "秘密仍然存在，但它不再是别人手里独有的东西。",
        effect: {
          stats: { 胆识: 1, 名望: 1 },
          relations: { 沈令仪: 3 },
          tags: ["tianji_ledger_pre_disclosed"],
        },
      },
      {
        id: "tianji_audit_ignore",
        text: "把抄件烧了，当作没有收到。",
        outcome:
          "纸烧得很快。烧掉的只是抄件——原本仍在西苑那座没有灯的楼里，摊在案上。",
        effect: { stats: { 体力: -1 }, tags: ["tianji_notice_ignored"] },
      },
    ],
  },
  {
    id: "tianji-ledger-fire",
    eyebrow: "秘录副本 · 火中",
    title: "西苑那座楼也在烧",
    danger: true,
    text:
      "十二宫的火没有停在十二宫。风向偏了，西苑的阁楼也着了。\n\n" +
      "你赶到时，卫夷则站在阶下没有动。她看不见火，但她听得见哪一架在塌。" +
      "“东边第三架。”她说，“那一架上有你。”\n\n" +
      "没有人拦你。她也没有说该救哪一架。",
    available: (state) =>
      state.completedChapters.length >= 8 &&
      state.tags.includes("secret_source:tianji") &&
      !state.tags.includes("tianji_ledger_burned"),
    choices: [
      {
        id: "tianji_fire_take_own",
        text: "冲进去，只抱走有你那几页的那一架。",
        outcome:
          "你抱着自己的册页出来，手上烧了两处。身后还有一整座阁在塌——" +
          "别人的名字你一页也没有救。卫夷则始终没有说话。",
        effect: {
          stats: { 体力: -3, 胆识: 1, 名望: -1 },
          relations: { 卫夷则: -4 },
          tags: ["tianji_ledger_burned", "tianji_saved_only_self"],
        },
        requiresStat: { stat: "体力", min: 3 },
      },
      {
        id: "tianji_fire_save_archive",
        text: "先救最靠外的那几架——那里的名字最多。",
        outcome:
          "你救出了整整四架旧档，其中没有一架是你的。你的三页烧掉了，" +
          "连同别人再也无法用它讲述你的可能。这不是你选的结果，只是你选的顺序带来的。",
        effect: {
          stats: { 体力: -3, 名望: 2 },
          relations: { 卫夷则: 8 },
          tags: ["tianji_ledger_burned", "tianji_saved_archive"],
        },
        requiresStat: { stat: "体力", min: 3 },
      },
      {
        id: "tianji_fire_lead_her_out",
        text: "不救册子，先把她扶出去。",
        outcome:
          "她起初不肯走，说这里每一架她都听得出来。你还是把她带了出来。" +
          "阁烧了大半，你的那几页不知去向——她记得，但她的记忆不能当证据。",
        effect: {
          stats: { 体力: -2, 人情: 1 },
          relations: { 卫夷则: 10 },
          tags: ["tianji_archivist_saved", "tianji_ledger_unverifiable"],
        },
      },
      {
        id: "tianji_fire_stand_back",
        text: "站在阶下，看着它烧完。",
        outcome:
          "火自己停了。烧掉了三成，你的那一架不在其中。" +
          "卫夷则转过身：“东边第三架还在。你听见了吗？”",
        effect: {
          stats: { 名望: -1 },
          tags: ["tianji_watched_burn"],
        },
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
