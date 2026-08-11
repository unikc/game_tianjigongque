/**
 * E05 · 必要的背叛。
 *
 * ── 核心命题 ────────────────────────────────────────────────────────────
 *
 * 政变夜，玩家不可能同时兑现她在第5–8章许下的所有承诺。
 * 这个场景强迫她选择——不是在好与坏之间，而是在两个都值得保护的人之间。
 *
 * 「背叛」的定义（来自 backlog）：
 *   不是「选了A而不选B」，而是「违背了一个你明确许下的承诺」。
 *   如果你从未承诺过温疏雨，让她面对危险不算背叛。
 *   如果你答应过「我保你一条路」，然后在关键时刻用她换了别的东西，那才是背叛。
 *
 * ── 机制 ────────────────────────────────────────────────────────────────
 *
 * 可用的「牺牲」由玩家的承诺历史决定：
 *   - 没有承诺过的人，不能成为「背叛」的对象——只是「没帮上」。
 *   - 已经交给天机阁的秘密，使部分牺牲的代价更高（阁主知道你做了什么）。
 *   - 自我牺牲（拒绝背叛任何人）不是免费的——有具体的代价。
 *
 * 每条路线保护一种价值，破坏另一种：
 *   牺牲温疏雨 → 保住证据链，失去医学证人
 *   牺牲裴照南 → 保住宫门，失去军事支撑
 *   牺牲沈令仪 → 保住合法性文书，失去政治同盟
 *   拒绝背叛   → 三条路线都弱化，但承诺全部兑现
 *
 * ── 实现约束 ────────────────────────────────────────────────────────────
 *
 * 纯派生。不新增 GameState 字段。
 * 所有可用选项由 state.tags 里已有的 promise_* 标签决定。
 * 「无承诺玩家」只看到「拒绝背叛」这一条路，这不是惩罚，而是她没有走过那条路。
 */

import type { Choice, Scene } from "../types";
import type { GameState } from "../types";

// ---------------------------------------------------------------------------
// 可用牺牲的判断
// ---------------------------------------------------------------------------

type BetrayalCandidate = {
  id: string;
  name: string;
  requiresPromise: string; // 必须持有的承诺 tag
  requiresAlive?: string; // 必须持有（人还在）的 tag
  sacrificeTag: string; // 写入的背叛 tag
  honoredTag?: string; // 若存在，说明承诺已兑现——背叛代价更高
  preserves: string; // 这条选择保住了什么
  costs: string; // 这条选择失去了什么
  text: string; // 选项文字
  outcome: string; // 选后文本
  effect: Choice["effect"];
};

const candidates: readonly BetrayalCandidate[] = [
  {
    id: "betray_wen",
    name: "温疏雨",
    requiresPromise: "promise_protect_wen",
    requiresAlive: "ch5_wen_bond",
    sacrificeTag: "betrayed:温疏雨",
    honoredTag: "promise_protect_wen_honored",
    preserves: "证据链完整——脉案、验毒结果、脂粉账三条文书仍在。",
    costs: "你答应过的那条路消失了。她不会再相信宫里有人能替她守住什么。",
    text: "【背叛温疏雨】把她的名字从证人名单上删去，让她独自面对宗室的问责。",
    outcome: [
      "你亲手把她的名字从那份清单上划掉。",
      "她不在场，所以她当时的表情你永远看不见。",
      "脉案还在，证据链完整。",
      "你答应过的那条路，今晚合上了。",
    ].join("\n"),
    effect: {
      stats: { 谋略: 1, 名望: -1 },
      relations: { 温疏雨: -8 },
      tags: ["betrayed:温疏雨", "ch11_wen_sacrificed", "evidence_chain_intact"],
    },
  },
  {
    id: "betray_pei",
    name: "裴照南",
    requiresPromise: "promise_investigate_pei_brother",
    requiresAlive: "ch6_pei_bond_deep",
    sacrificeTag: "betrayed:裴照南",
    preserves: "宫门仍由你控制，政变军无法从北面突入。",
    costs: "她兄长的案子永远不会有结果。她知道你为什么这样做，这让它更难收场。",
    text: "【背叛裴照南】在军令上签下她兄长谋逆的定论，换取政变军的分裂。",
    outcome: [
      "那份定论需要一个签名，你给了它。",
      "裴照南的兄长从此有了一个无法再翻的罪名。",
      "政变军有人开始迟疑——那个名字牵连了他们自己的家族。",
      "宫门守住了。你当初说帮她查，查出来怎么处理她要接受。",
      "她接受了。这比你预想的更难看。",
    ].join("\n"),
    effect: {
      stats: { 胆识: 1, 名望: -1 },
      relations: { 裴照南: -10 },
      tags: [
        "betrayed:裴照南",
        "ch11_pei_brother_convicted",
        "ch11_north_gate_held",
      ],
    },
  },
  {
    id: "betray_shen",
    name: "沈令仪",
    requiresPromise: "ch8_shen_alliance_deep",
    requiresAlive: "ch8_queen_real_bond",
    sacrificeTag: "betrayed:沈令仪",
    preserves: "合法性文书由你独署，你不再需要和任何人分享这枚印的分量。",
    costs:
      "你们之间的那件事——她是第一个不问你对不对的人——今晚你成了问她对不对的人。",
    text: "【背叛沈令仪】以凤印独署新令，用合法程序把她从摄政序列里推出去。",
    outcome: [
      "合法程序是最干净的刀。",
      "你用她三年前教给你的那套东西，把她从名单上移除。",
      "文书不会说这是背叛。文书只会说：独署，有效。",
      "她没有反抗。她大概早就知道会有这一天。",
      "你们之间有一句话她说过：你是第一个不问我对不对的人。",
      "现在你问了。",
    ].join("\n"),
    effect: {
      stats: { 名望: 1 },
      relations: { 沈令仪: -12 },
      emperor: { trust: 3 },
      tags: ["betrayed:沈令仪", "ch11_queen_removed", "ch11_solo_regency"],
    },
  },
];

// ---------------------------------------------------------------------------
// 判断一个候选人是否可以被背叛（承诺存在 + 人还在）
// ---------------------------------------------------------------------------
function canBetray(state: GameState, c: BetrayalCandidate): boolean {
  if (!state.tags.includes(c.requiresPromise)) return false;
  if (c.requiresAlive && !state.tags.includes(c.requiresAlive)) return false;
  if (state.tags.includes(c.sacrificeTag)) return false; // 已经背叛过了
  return true;
}

// ---------------------------------------------------------------------------
// 运行时构建场景
// ---------------------------------------------------------------------------

export function buildBetrayalScene(state: GameState, returnTo: string): Scene {
  const available = candidates.filter((c) => canBetray(state, c));

  // 自我牺牲选项：拒绝背叛任何人，但三条支线都会弱化
  const refuseChoice: Choice = {
    id: "betray_refuse",
    text: "不交出任何人。用自己的位置作抵押，让所有人在天亮前都还活着。",
    outcome: [
      "你走出宫门，站在最后一道墙和政变军之间。",
      "没有筹码，只有你这个人。",
      "有人向前，有人停下来，没有人知道该不该动。",
      "天亮了，所有人都还活着。",
      "代价是：你欠下的东西比今晚多得多。",
    ].join("\n"),
    effect: {
      stats: { 胆识: 2, 名望: -1 },
      emperor: { trust: 5 },
      tags: ["ch11_no_betrayal", "ch11_self_exposure", "all_promises_kept"],
    },
    next: returnTo,
  };

  if (!available.length) {
    // 玩家没有建立过任何承诺——这不是惩罚，只是她走的是另一条路
    return {
      id: "ch11_betrayal",
      title: "没有欠账的夜晚",
      chapterLabel: "第11日",
      text: [
        "顾明华要一个名字，沈令仪也要一个名字。",
        "你想了很久，发现你手里没有一个可以交出去的人——",
        "不是因为你手里没有人，而是因为你从没有把任何人放进「可以用来换东西」的位置里。",
        "",
        "这不是你算计的结果。这只是你走路的方式。",
      ].join("\n"),
      choices: [refuseChoice],
    };
  }

  const betrayChoices: Choice[] = available.map((c) => {
    // 如果之前已经兑现过承诺（honoredTag 存在），背叛的代价更重
    const alreadyHonored = c.honoredTag && state.tags.includes(c.honoredTag);
    const extraPenalty = alreadyHonored
      ? "\n她曾经回来帮过你。你记得。她大概也记得。"
      : "";
    return {
      id: c.id,
      text: c.text,
      outcome: c.outcome + extraPenalty,
      effect: {
        ...c.effect,
        tags: [
          ...(c.effect.tags ?? []),
          ...(alreadyHonored ? ["betrayed_after_honored"] : []),
        ],
      },
      next: returnTo,
    };
  });

  const ledgerWarning = state.tags.includes("secret_source:tianji")
    ? "\n天机阁的册子里记着你今晚之前做过的事。卫夷则不会主动告诉任何人——但她知道。"
    : "";

  return {
    id: "ch11_betrayal",
    title: "必要的背叛",
    chapterLabel: "第11日",
    progress: { current: 2, total: 3 },
    text: [
      "顾明华要一个名字，沈令仪也要一个名字。",
      "政变军还在城外。宫门还没有完全合上。",
      "",
      "你的手里有几个你曾经明确告诉过她们的事：我在，我记得，我会处理。",
      "今晚，其中至少一件要被你亲手放掉。",
      "",
      "不是因为你是坏人。",
      "是因为局面只有这么宽。" + ledgerWarning,
    ].join("\n"),
    choices: [...betrayChoices, refuseChoice],
  };
}

// ---------------------------------------------------------------------------
// 第11章后果：背叛的回响
// ---------------------------------------------------------------------------

/**
 * 第12章开头：如果玩家背叛了具体的人，那个人以什么方式出现在尾声里。
 * 这些场景在 day12_1 之前注入，作为可绕过的侧枝。
 */
export function applyBetrayalAftermath(laterScenes: Record<string, Scene>) {
  // 温疏雨：她在第12章的结案里缺席，但她的名字仍然在某个地方
  laterScenes.day12_wen_aftermath = {
    id: "day12_wen_aftermath",
    title: "太医院的那条路",
    chapterLabel: "第12日",
    text: [
      "结案公文里，证人名单一共十二个名字。",
      "你记得那条名单原本应该有十三个。",
      "",
      "有人告诉你，温疏雨在宫门血诏那天就离开了太医院。",
      "没有人知道她去了哪里。",
      "她没有被定罪，也没有被平反。",
      "她只是不在了。",
    ].join("\n"),
    choices: [
      {
        id: "day12_wen_restore",
        text: "把她的名字加回证人名单，追加她的陈述作为旁证。",
        outcome:
          "你写上她的名字，后面跟着「现下落不明，陈述以旧档为准」。\n这不是平反，但她的名字不再是空白。",
        effect: {
          stats: { 名望: 1 },
          tags: ["ch12_wen_name_restored", "betrayal_partial_repair:温疏雨"],
        },
        next: "day12_1",
      },
      {
        id: "day12_wen_leave",
        text: "不改动名单。有些账，只能由时间来结。",
        outcome: "十二个名字，结案。\n第十三个名字在别处，不在你能写到的纸上。",
        effect: { tags: ["ch12_wen_name_absent"] },
        next: "day12_1",
      },
    ],
  };

  // 裴照南：她的兄长有了一个无法翻的罪名，她本人仍在宫里
  laterScenes.day12_pei_aftermath = {
    id: "day12_pei_aftermath",
    title: "军粮册那一行",
    chapterLabel: "第12日",
    text: [
      "裴照南在结案的第三天请见。",
      "她没有哭，也没有质问。",
      "她只是把一份旧文书放在你面前——是你当初答应她要查的那份军粮册拓样。",
      "",
      "她说：查出来了。是伪造的。",
      "但定论已经落纸，伪造的证据无法改写真实存在的文书。",
      "",
      "她问：你当初说查出来怎么处理，我要接受。",
      "我接受了。你呢？",
    ].join("\n"),
    choices: [
      {
        id: "day12_pei_reopen",
        text: "重开案卷，以新证据申请复核。",
        outcome:
          "复核需要时间，结果不可预测。\n你把那份拓样接过来，放进新的案卷里。\n裴照南看着你，第一次没有说话。",
        effect: {
          stats: { 名望: -1 },
          relations: { 裴照南: 5 },
          tags: ["ch12_pei_case_reopened", "betrayal_partial_repair:裴照南"],
        },
        next: "day12_1",
      },
      {
        id: "day12_pei_acknowledge",
        text: "收下文书，告诉她这件事你记得，但复核没有胜算。",
        outcome:
          "她把文书放进袖中。\n她说：我知道。我只是想让你亲口说，你记得。\n她走了。留下来的是那句话的重量。",
        effect: {
          relations: { 裴照南: 2 },
          tags: ["ch12_pei_acknowledged"],
        },
        next: "day12_1",
      },
    ],
  };

  // 沈令仪：她被从摄政序列里推出去后，在第12章做了一件事
  laterScenes.day12_shen_aftermath = {
    id: "day12_shen_aftermath",
    title: "皇后最后落的那枚印",
    chapterLabel: "第12日",
    text: [
      "天亮之后，沈令仪把凤印交出来，安静得像是早就准备好了。",
      "",
      "你后来发现，她在被推出摄政序列之前，盖了最后一枚印。",
      "那道批文是为林栖梧争来的——让被刮去名字的宫人得到重新入档的资格。",
      "",
      "她没有告诉任何人这件事。",
      "你是从林栖梧那里才知道的。",
    ].join("\n"),
    choices: [
      {
        id: "day12_shen_acknowledge_act",
        text: "把这道批文正式存档，作为皇后最后的公务记录。",
        outcome:
          "这道批文从此不只是她一个人的事。\n她做了什么，宫史上会有一行。",
        effect: {
          stats: { 名望: 1 },
          relations: { 沈令仪: 4, 林栖梧: 3 },
          tags: [
            "ch12_shen_last_act_recorded",
            "betrayal_partial_repair:沈令仪",
          ],
        },
        next: "day12_1",
      },
      {
        id: "day12_shen_private",
        text: "让这件事留在你们两个人之间。",
        outcome:
          "不存档，不公开。\n你把那道批文收起来，放在一个只有你会找的地方。",
        effect: {
          relations: { 沈令仪: 2 },
          tags: ["ch12_shen_last_act_private"],
        },
        next: "day12_1",
      },
    ],
  };

  // 把后果场景挂在 day12_1 之前，根据 tag 决定哪个生效
  const day12_1 = laterScenes.day12_1;
  if (day12_1) {
    day12_1.choices.push({
      id: "day12_1_wen_aftermath",
      text: "【温疏雨】结案名单上有一个位置是空的。",
      outcome: "你想起那条名单原本应该有十三个名字。",
      effect: {},
      next: "day12_wen_aftermath",
      requiresTag: "betrayed:温疏雨",
    });
    day12_1.choices.push({
      id: "day12_1_pei_aftermath",
      text: "【裴照南】她来请见了。",
      outcome: "她把军粮册拓样放在你面前。",
      effect: {},
      next: "day12_pei_aftermath",
      requiresTag: "betrayed:裴照南",
    });
    day12_1.choices.push({
      id: "day12_1_shen_aftermath",
      text: "【沈令仪】你从林栖梧那里得知她最后做了一件事。",
      outcome: "那道批文不是为了你，也不是为了她自己。",
      effect: {},
      next: "day12_shen_aftermath",
      requiresTag: "betrayed:沈令仪",
    });
  }
}

// ---------------------------------------------------------------------------
// 挂接：把背叛场景注入第11章
// ---------------------------------------------------------------------------

export function applyE05Betrayal(laterScenes: Record<string, Scene>) {
  // 静态骨架：保证遍历工具能走完全图
  laterScenes.ch11_betrayal = {
    id: "ch11_betrayal",
    title: "必要的背叛",
    chapterLabel: "第11日",
    text: "你手里的承诺比今晚能兑现的多。",
    choices: [
      {
        id: "betray_wen",
        text: "把她的名字从证人名单上删去，让她独自面对宗室的问责。",
        outcome: "脉案还在，证据链完整。你答应过的那条路，今晚合上了。",
        effect: { tags: ["betrayed:温疏雨"] },
        next: "day11_2",
      },
      {
        id: "betray_pei",
        text: "在军令上签下她兄长谋逆的定论，换取政变军的分裂。",
        outcome:
          "宫门守住了。你当初说帮她查，查出来怎么处理她要接受。她接受了。",
        effect: { tags: ["betrayed:裴照南"] },
        next: "day11_2",
      },
      {
        id: "betray_shen",
        text: "以凤印独署新令，用合法程序把她从摄政序列里推出去。",
        outcome: "文书只会说：独署，有效。合法程序是最干净的刀。",
        effect: { tags: ["betrayed:沈令仪"] },
        next: "day11_2",
      },
      {
        id: "betray_refuse",
        text: "不交出任何人，用自己的位置作抵押，让所有人在天亮前都还活着。",
        outcome: "天亮了，所有人都还活着。代价是：你欠下的东西比今晚多得多。",
        effect: { tags: ["ch11_no_betrayal"] },
        next: "day11_2",
      },
    ],
  };

  // 把背叛场景插入 day11_1 → ch11_betrayal → day11_2
  const day11_1 = laterScenes.day11_1;
  if (day11_1) {
    day11_1.choices.forEach((c) => {
      if (c.next === "day11_2") c.next = "ch11_betrayal";
    });
  }

  applyBetrayalAftermath(laterScenes);
}
