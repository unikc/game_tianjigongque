/**
 * 不可靠信息内容补丁。
 *
 * 把"隐藏真相"接进第5–9日的实际剧情，制造三种玩家体验：
 *
 * 1. **下注**：第5日你只能听温疏雨自己的说法（belief_wen_honest），
 *    除非才学够高、亲自核对笔迹（known_wen_truth）才谈得上"知道"。
 * 2. **反转**：第8日请她作证时，如果她当年确实收过钱，
 *    她带来的副本里有一页是她自己伪造的——你的救人之举反噬。
 * 3. **复盘**：第9日火场收尾时揭晓纵火主使，此前所有指认宗室的
 *    行动会因猜错而落空。
 *
 * 关键设计：**猜错不是惩罚，是另一条剧情**。走错的路仍然通向完整结局，
 * 只是代价不同。否则玩家会去查攻略而不是自己判断。
 */

import type { Scene } from "../types";

export function applyUnreliableInfoPatch(laterScenes: Record<string, Scene>) {
  const at = (sceneId: string): Scene => {
    const s = laterScenes[sceneId];
    if (!s) throw new Error(`scene missing: ${sceneId}`);
    return s;
  };

  // --------------------------------------------------------------------------
  // 第5日 · 调查层：把"她说的"和"你查的"分开
  // --------------------------------------------------------------------------

  // day5_2c 原有的"先问温疏雨为什么改案"，现在只给一个**信念**。
  const asked = at("day5_2c").choices.find((c) => c.id === "day5_2c_2");
  if (asked) {
    asked.outcome =
      "她说改案是为了让惠嫔活到今天。这个理由你信——但你也清楚，" +
      "你信的只是一段没有旁证的说辞。";
    asked.effect.tags = [...(asked.effect.tags ?? []), "belief_wen_honest"];
  }

  // 新增：真正的调查。门槛是才学，不是运气——愿意投资才学的玩家
  // 才买得到"确定性"这件商品。
  at("day5_2c").choices.push({
    id: "day5_2c_4",
    text: "调出三个月前的原始脉案，逐页比对笔迹与用印。",
    outcome:
      "纸背的压痕和用印顺序对不上她今天的说法。你没有当场点破，" +
      "但从这一刻起，你知道的比她以为你知道的多。",
    effect: {
      stats: { 才学: 1 },
      tags: ["known_wen_truth"],
    },
    next: "day5_3",
    requiresStat: { stat: "才学", min: 5 },
  });

  // --------------------------------------------------------------------------
  // 第8日 · 反转层：救下的人未必干净
  // --------------------------------------------------------------------------

  // 她当年清白：作证成立，这是"善待证人"路线该有的回报。
  const testify = at("day8_1").choices.find((c) => c.id === "day8_1_4");
  if (testify) {
    testify.requiresTruth = { key: "wenLoyalty", value: "honest" };
  }

  // 她当年不干净：同一个选项，同一句"请她出面"，结果完全不同。
  at("day8_1").choices.push({
    id: "day8_1_5",
    text: "请温疏雨出面，补全当年被删去的那部分脉案与死亡记录。",
    outcome:
      "她带来了副本，也带来了一页她自己补写的东西。顾明华当场指出墨色不同——" +
      "你救下的证人，把你一起拖进了伪证里。",
    effect: {
      stats: { 名望: -1 },
      tags: ["ch8_wen_forged", "ch8_truth_public"],
      relations: { 沈令仪: -1, 顾明华: -1 },
    },
    next: "day8_2",
    requiresTag: "ch5_legacy_wen_saved",
    requiresTruth: { key: "wenLoyalty", value: "compromised" },
  });

  // 已经查清真相的玩家，有第三条路：明知她不干净，仍然用她，但先设防。
  at("day8_1").choices.push({
    id: "day8_1_6",
    text: "只让温疏雨陈述你亲自核过的那几页，其余一概不问。",
    outcome:
      "你把她的证词限制在你验证过的范围内。皇后听见了名字，" +
      "顾明华抓不到破绽——你用一个不干净的证人，做成了一件干净的事。",
    effect: {
      stats: { 谋略: 1, 才学: 1 },
      tags: ["ch8_wen_testifies", "ch8_names_heard", "ch8_controlled_witness"],
      relations: { 沈令仪: -1 },
    },
    next: "day8_2",
    requiresTag: "known_wen_truth",
  });

  // --------------------------------------------------------------------------
  // 第9日 · 揭晓层：你一直指认的那个人，未必是放火的人
  // --------------------------------------------------------------------------

  // 主使确实是宗室：此前所有指向宗室的动作在此收网。
  at("day9_3").choices.push({
    id: "day9_3_4",
    text: "把纵火者、春猎那支箭与空印调令并案，直指宗室。",
    outcome: "三件事终于合成一条线。宗室再无法用一句内廷私怨把火压下去。",
    effect: {
      stats: { 谋略: 1 },
      tags: ["ch9_royal_exposed", "ch9_case_consolidated"],
    },
    next: "day9_result",
    requiresTag: "ch9_arsonist_caught",
    requiresTruth: { key: "arsonPatron", value: "royal" },
  });

  // 主使其实是太后母族：同样的并案动作，撞在假线索上。
  at("day9_3").choices.push({
    id: "day9_3_5",
    text: "把纵火者、春猎那支箭与空印调令并案，直指宗室。",
    outcome:
      "并案文书递上去的第二天，那名死士翻供了——他拿的是太后母族的钱，" +
      "穿的是宗室的衣服。你指错了人，真正的主使因此多出七天。",
    effect: {
      stats: { 名望: -1 },
      tags: ["ch9_wrong_patron", "ch9_dowager_warned"],
    },
    next: "day9_result",
    requiresTag: "ch9_arsonist_caught",
    requiresTruth: { key: "arsonPatron", value: "dowager" },
  });

  // 谨慎路线：不并案，先查钱。慢，但不会指错人。
  at("day9_3").choices.push({
    id: "day9_3_6",
    text: "先不并案，查死士领的那笔钱出自哪一房的账。",
    outcome:
      "账走得比人慢。你放弃了一次立刻收网的机会，换来一条不会翻供的线索。",
    effect: {
      stats: { 谋略: 1, 名望: -1 },
      tags: ["ch9_followed_money", "ch9_patron_confirmed"],
    },
    next: "day9_result",
    requiresTag: "ch9_arsonist_caught",
  });
}

/** 供 UI 判断玩家此刻"以为"的事实与"确知"的事实。 */
export function beliefState(tags: string[]) {
  return {
    knowsWen: tags.includes("known_wen_truth"),
    believesWenHonest: tags.includes("belief_wen_honest"),
  };
}
