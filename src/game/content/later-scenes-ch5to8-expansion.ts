/**
 * 第5-8章场景扩充补丁（E05前置铺垫）。
 *
 * 目标：
 *   1. 给第5章温疏雨、第6章裴照南、第7章春猎、第8章沈令仪
 *      各增加有情感重量的场景，让角色关系在第9章之前真正建立起来。
 *   2. 引入承诺语法：玩家在第5-7章向具体角色许下可被记住的诺言，
 *      第8-11章的E05会从这里取材。
 *   3. 不改动既有分支的next/effect，只追加新场景和新选项。
 */

import type { Choice, Scene } from "../types";

const mk = (
  id: string,
  title: string,
  chapterLabel: string,
  progress: { current: number; total: number },
  text: string,
  choices: Choice[],
  extra?: Partial<Scene>,
): Scene => ({ id, title, chapterLabel, progress, text, choices, ...extra });

// ---------------------------------------------------------------------------
// 第5章：温疏雨的账 + 林栖梧的名字册
// ---------------------------------------------------------------------------

function buildChapter5Extension(laterScenes: Record<string, Scene>) {
  laterScenes.day5_wen_private = mk(
    "day5_wen_private",
    "太医的账",
    "第5日",
    { current: 4, total: 5 },
    [
      "散场后，温疏雨在回廊等你。她没有先开口，只把那份脉案副本叠好，放在你手边。",
      "",
      "她说：改了一行。当时只想让惠嫔活过那个冬天。但那一行改过之后，她就再也没有办法只是一个太医了。",
      "",
      "她等着你回答，像是在问一个真正的问题：以后还有没有地方落脚。",
    ].join("\n"),
    [
      {
        id: "day5_3_wen_protect",
        text: "说：太医院不是只有一种活法。你帮我，我保你一条路。",
        outcome:
          "她抬起头，第一次不是以职务的眼光看你。你们还没到可以信任的程度，但一个诺言已经出了口。",
        effect: {
          stats: { 人情: 1 },
          relations: { 温疏雨: 4 },
          tags: ["promise_protect_wen", "ch5_wen_bond"],
        },
        next: "day5_lin_names",
      },
      {
        id: "day5_3_wen_leverage",
        text: "说：那一行改过的案，我先替你压着。对你有用的时候再说。",
        outcome:
          "她的表情没有变。她懂这种话的意思——这不是保护，是把她变成一张还没出的牌。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 温疏雨: -2 },
          tags: ["holds_wen_leverage", "ch5_wen_tool"],
        },
        next: "day5_lin_names",
      },
      {
        id: "day5_3_wen_honest",
        text: "如实说：我现在也没有路。我们先各自站稳，以后看情况。",
        outcome: "她点点头，把副本收回去。这是你们之间迄今最诚实的一句话。",
        effect: {
          stats: { 胆识: 1 },
          relations: { 温疏雨: 2 },
          tags: ["ch5_wen_honest_start"],
        },
        next: "day5_lin_names",
      },
    ],
  );

  laterScenes.day5_lin_names = mk(
    "day5_lin_names",
    "姓名册",
    "第5日",
    { current: 5, total: 5 },
    [
      "林栖梧在你离开前叫住你，从袖子里取出一张叠了很多次的纸。",
      "上面是一列名字——都是从宫宴名册上被刮去的，她一个一个记下来的。",
      "",
      "她说不知道该交给谁，所以先交给你。",
    ].join("\n"),
    [
      {
        id: "day5_3_lin_accept",
        text: "收下名单，告诉她你会记得每一个名字。",
        outcome:
          "你把那张纸叠起来放进袖中。从这一刻起，你知道的名字比任何一份官方名册都多，也比任何人都更难假装不知道。",
        effect: {
          stats: { 人情: 1 },
          relations: { 林栖梧: 5 },
          tags: [
            "holds_deleted_names",
            "promise_remember_names",
            "ch5_lin_trust",
          ],
        },
        next: "day5_result",
      },
      {
        id: "day5_3_lin_formal",
        text: "说：把这个交给尚仪局，比交给我更有用。",
        outcome:
          "你没有拒绝她，只是把责任引向了规则。她把名单收回去，沉默了一会儿才说好。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 林栖梧: 1 },
          tags: ["ch5_lin_redirected"],
        },
        next: "day5_result",
      },
      {
        id: "day5_3_lin_keep",
        text: "说：你自己保管，谁也不交。等到有人真的能用上它的时候。",
        outcome:
          "她把名单收起来。这张纸仍然在她手里——在你们都知道彼此知道的情况下，安全地藏着。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 林栖梧: 3 },
          tags: ["lin_holds_names", "ch5_lin_keeper"],
        },
        next: "day5_result",
      },
    ],
  );

  // 把两个新场景挂在 day5_3 之后
  const day5_3 = laterScenes.day5_3;
  if (day5_3) {
    day5_3.choices.forEach((c) => {
      if (c.next === "day5_result") c.next = "day5_wen_private";
    });
  }
}

// ---------------------------------------------------------------------------
// 第6章：裴照南的军粮册末页
// ---------------------------------------------------------------------------

function buildChapter6Extension(laterScenes: Record<string, Scene>) {
  laterScenes.day6_pei_ledger = mk(
    "day6_pei_ledger",
    "军粮册末页",
    "第6日",
    { current: 4, total: 4 },
    [
      "裴照南在你离开前递来一份折叠的纸——军粮账末页的拓样。",
      "",
      "她说：末页有一个名字，是她兄长的。他不可能在那个时间到那个地方，但字迹是真的。",
      "",
      "她不是来求你的。她在告诉你这件事，意味着她在赌你怎么处理它。",
    ].join("\n"),
    [
      {
        id: "day6_3_pei_investigate",
        text: "说：帮你查。但查出来之后怎么处理，你要接受。",
        outcome:
          "她点头。你们第一次谈到之后——不是在救人的场合，而是在可能要审讯她兄长的场合。",
        effect: {
          stats: { 胆识: 1 },
          relations: { 裴照南: 5 },
          tags: [
            "promise_investigate_pei_brother",
            "ch6_pei_deal",
            "ch6_pei_bond_deep",
          ],
        },
        next: "day6_result",
      },
      {
        id: "day6_3_pei_leverage",
        text: "说：先不查。但这张纸你先放我这里。",
        outcome: "她没有立刻回答。把拓样留下，意味着她把自己的退路也留下了。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 裴照南: -3 },
          tags: ["holds_pei_brother_ledger", "ch6_pei_leverage_taken"],
        },
        next: "day6_result",
      },
      {
        id: "day6_3_pei_return",
        text: "把纸还给她，说这件事你管不了。",
        outcome:
          "她把拓样收回去。你们之间什么也没有多，什么也没有少——只是她知道了，你不是那个能帮她的人。",
        effect: {
          stats: { 礼仪: 1 },
          relations: { 裴照南: -1 },
          tags: ["ch6_pei_paper_returned"],
        },
        next: "day6_result",
      },
    ],
  );

  // 挂在 day6_3 之后
  const day6_3 = laterScenes.day6_3;
  if (day6_3) {
    day6_3.choices.forEach((c) => {
      if (c.next === "day6_result") c.next = "day6_pei_ledger";
    });
  }
}

// ---------------------------------------------------------------------------
// 第7章：猎场前夜 + 皇帝醒来
// ---------------------------------------------------------------------------

function buildChapter7Extension(laterScenes: Record<string, Scene>) {
  laterScenes.day7_eve = mk(
    "day7_eve",
    "猎场前夜",
    "第7日",
    { current: 1, total: 5 },
    [
      "春猎前夜，宫里比平时安静。你在廊下站了很久，先后碰到了两个人。",
      "",
      "温疏雨来送药，说猎场随行名单里有一个临时加进去的名字——一个药材供应商，不该出现在围场里。",
      "裴照南来送令牌，说羽林明日布防有一段空隙，她请示过皇后，皇后说没问题，但她自己不信。",
    ].join("\n"),
    [
      {
        id: "day7_eve_trust_wen",
        text: "让温疏雨把那个名字告诉你，你来决定怎么做。",
        outcome:
          "她说了一个没听过的名字，是猎场的药材供应商。你记下来，打算明天留意。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 温疏雨: 2 },
          tags: ["ch7_wen_warning", "ch7_name_known"],
        },
        next: "day7_1",
      },
      {
        id: "day7_eve_trust_pei",
        text: "让裴照南把那段空隙补上，无论皇后怎么说。",
        outcome:
          "她看了你一眼，说好。这是她第一次先听你的，再回去告诉皇后她已经处置了。",
        effect: {
          stats: { 胆识: 1 },
          relations: { 裴照南: 3 },
          tags: ["ch7_pei_gap_covered", "ch7_pei_defers_to_you"],
        },
        next: "day7_1",
      },
      {
        id: "day7_eve_both",
        text: "两件事都记下来，明天自己盯着。",
        outcome:
          "两个人都离开了，都以为你会处理好。你把两条线记在心里，准备明天把它们拼起来。",
        effect: {
          stats: { 才学: 1 },
          tags: ["ch7_wen_warning", "ch7_name_known", "ch7_eve_both_threads"],
        },
        next: "day7_1",
      },
    ],
  );

  laterScenes.day7_emperor_wakes = mk(
    "day7_emperor_wakes",
    "他说的第一句话",
    "第7日",
    { current: 5, total: 5 },
    [
      "无论那支箭是否射中，皇帝在帐里醒来的第一件事，是问你在哪里。",
      "",
      "近侍说你就在帐外。他让人把你叫进去，屏退所有人。",
      "",
      "他看着你，没有先说谢谢，也没有先问箭从哪里来。他说的是：",
      "你昨天选了什么，我都看见了。",
    ].join("\n"),
    [
      {
        id: "day7_3_emp_truth",
        text: "告诉他你看见了什么，包括那道让你犹豫的选择。",
        outcome: [
          "他听完没有说话，很久之后才说：你告诉我这件事，比任何一个结果都更贵重。",
          "你们之间从这一刻开始，有一件只有两个人知道的事。",
        ].join("\n"),
        effect: {
          stats: { 胆识: 1 },
          emperor: { trust: 8, favor: 3 },
          tags: [
            "ch7_told_emperor_truth",
            "emperor_knows_hesitation",
            "promise_to_emperor_honest",
          ],
        },
        next: "day7_result",
      },
      {
        id: "day7_3_emp_reassure",
        text: "说一切都在控制之内，让他安心休养。",
        outcome: [
          "他点点头，闭上眼睛。你走出帐外才意识到，你刚才说的不完全是真话。",
          "他不知道你犹豫过。这件事从今往后就是你自己的。",
        ].join("\n"),
        effect: {
          stats: { 礼仪: 1 },
          emperor: { favor: 5, trust: -2 },
          tags: ["ch7_reassured_emperor", "ch7_hid_hesitation"],
        },
        next: "day7_result",
      },
      {
        id: "day7_3_emp_ask",
        text: "反问他：你看见了什么？",
        outcome: [
          "他笑了一下，这是受伤以来第一次。",
          "他说：我看见你在那一秒里选了什么先救。他没有说那个选择是对是错。",
          "这件事他知道，你也知道他知道了。",
        ].join("\n"),
        effect: {
          emperor: { trust: 5, favor: 5 },
          tags: ["ch7_emperor_saw_choice", "ch7_mutual_knowledge"],
        },
        next: "day7_result",
      },
    ],
  );

  // 把余波接在第3个 beat 之后
  const day7_3 = laterScenes.day7_3;
  if (day7_3) {
    day7_3.choices.forEach((c) => {
      if (c.next === "day7_result") c.next = "day7_emperor_wakes";
    });
  }

  // 更新 progress
  if (laterScenes.day7_1)
    laterScenes.day7_1.progress = { current: 2, total: 5 };
  if (laterScenes.day7_2)
    laterScenes.day7_2.progress = { current: 3, total: 5 };
  if (laterScenes.day7_3)
    laterScenes.day7_3.progress = { current: 4, total: 5 };
}

// ---------------------------------------------------------------------------
// 第8章：沈令仪的三年理由
// ---------------------------------------------------------------------------

function buildChapter8Extension(laterScenes: Record<string, Scene>) {
  laterScenes.day8_shen_why = mk(
    "day8_shen_why",
    "三年的理由",
    "第8日",
    { current: 3, total: 4 },
    [
      "沈令仪说完那句话之后，帘后没有声音。",
      "",
      "她承认三年前她就知道，她放走了一个主犯，条件是宗室军队不入京。",
      "她让证据停在她手里，而不是让它烧掉，也不是让它公开。",
      "",
      "她等你问为什么。",
    ].join("\n"),
    [
      {
        id: "day8_3_shen_why",
        text: "问：为什么不早说？",
        outcome: [
          "她反问：早说给谁听？给皇帝听，他会平衡两方。给太后听，她会把母族摘干净。",
          "给朝臣听，他们会用这件事做最顺手的那件事。",
          "她说：我把它留下来，是因为我是皇后。皇后的事，皇后处理。",
        ].join("\n"),
        effect: {
          stats: { 才学: 1 },
          relations: { 沈令仪: 2 },
          tags: ["ch8_shen_reason_known", "ch8_queen_logic_understood"],
        },
        next: "day8_xie_review",
        ...{ speaker: "皇后 · 沈令仪", portrait: "queen" as const },
      },
      {
        id: "day8_3_shen_condemn",
        text: "说：你替所有人做了一个没人授权你做的决定。",
        outcome: [
          "她看着你，半晌才说：是。",
          "她没有反驳，也没有道歉。那个是说得比什么都重。",
        ].join("\n"),
        effect: {
          stats: { 胆识: 1 },
          relations: { 沈令仪: -1 },
          tags: ["ch8_shen_condemned", "ch8_queen_admits_overreach"],
        },
        next: "day8_xie_review",
        ...{ speaker: "皇后 · 沈令仪", portrait: "queen" as const },
      },
      {
        id: "day8_3_shen_understand",
        text: "说：我明白了。那件事以后，你没有退路，我们一样。",
        outcome: [
          "她沉默了很久，然后说：你是第一个不问我对不对的人。",
          "这句话让你们之间多了一种东西——从这一刻起，你们不再只是利益上的同盟。",
        ].join("\n"),
        effect: {
          stats: { 人情: 1 },
          relations: { 沈令仪: 5 },
          tags: ["ch8_shen_alliance_deep", "ch8_queen_real_bond"],
        },
        next: "day8_xie_review",
        ...{ speaker: "皇后 · 沈令仪", portrait: "queen" as const },
      },
    ],
  );

  // 插在 day8_2 之后
  const day8_2 = laterScenes.day8_2;
  if (day8_2) {
    day8_2.choices.forEach((c) => {
      if (c.next === "day8_xie_review") c.next = "day8_shen_why";
    });
  }
  if (laterScenes.day8_3)
    laterScenes.day8_3.progress = { current: 4, total: 4 };
}

// ---------------------------------------------------------------------------
// 承诺回收点（第9、11章）
// ---------------------------------------------------------------------------

function buildPromiseCallbacks(laterScenes: Record<string, Scene>) {
  // 第9章：温疏雨因承诺而回来
  const day9_2 = laterScenes.day9_2;
  if (day9_2) {
    day9_2.choices.push({
      id: "day9_wen_returns",
      text: "【温疏雨】她听说你在火场——她自己来了。",
      outcome: [
        "你没有叫她，她自己来了。她和你一起从烟里拉出了高福安，还顺手抢出了鼠册半页。",
        "这是你欠她的那条路，今晚她自己走进来了。",
      ].join("\n"),
      effect: {
        stats: { 人情: 1 },
        relations: { 温疏雨: 4, 高福安: 2 },
        tags: [
          "ch9_wen_came_back",
          "promise_protect_wen_honored",
          "ch9_gao_alive",
          "ch9_partial_mouse_ledger",
        ],
      },
      next: "day9_3",
      requiresTag: "promise_protect_wen",
    });
  }

  // 第11章：林栖梧的姓名册用在宫门前
  const day11_1 = laterScenes.day11_1;
  if (day11_1) {
    day11_1.choices.push({
      id: "day11_lin_names_used",
      text: "【林栖梧】展开那张姓名册，让宫门外的人知道政变军里有谁的亲属被刮去了名字。",
      outcome: [
        "你逐一念出那些名字。人群里有人开始哭，有人开始骂。",
        "政变军没有立刻后退，但他们后面的人开始退。",
        "你当时只是说了会记得每一个名字。今晚那些名字替你说话了。",
      ].join("\n"),
      effect: {
        stats: { 名望: 2 },
        relations: { 林栖梧: 6 },
        tags: [
          "ch11_names_used",
          "promise_remember_names_honored",
          "ch11_gate_public_resistance",
        ],
      },
      next: "day11_2",
      requiresTag: "promise_remember_names",
      requiresAnyTag: ["holds_deleted_names"],
    });

    // 第11章：裴照南因承诺而站在玩家这边
    day11_1.choices.push({
      id: "day11_pei_brother_truth",
      text: "【裴照南】她站在你这边——因为你当初答应帮她查兄长的事。",
      outcome: [
        "她的兄长最终被查清是被冒名，那个军粮账是伪造的。",
        "她现在站在宫门里，把这件事作为她守门的理由之一。",
        "你当初说帮你查，但查出来怎么处理你要接受。她接受了，所以她在这里。",
      ].join("\n"),
      effect: {
        stats: { 胆识: 1 },
        relations: { 裴照南: 5 },
        tags: [
          "ch11_pei_defends",
          "promise_investigate_pei_brother_honored",
          "ch11_pei_brother_cleared",
        ],
      },
      next: "day11_2",
      requiresTag: "promise_investigate_pei_brother",
    });
  }
}

// ---------------------------------------------------------------------------
// 主导出
// ---------------------------------------------------------------------------

export function applyMidChapterExpansion(laterScenes: Record<string, Scene>) {
  buildChapter5Extension(laterScenes);
  buildChapter6Extension(laterScenes);
  buildChapter7Extension(laterScenes);
  buildChapter8Extension(laterScenes);
  buildPromiseCallbacks(laterScenes);
}
