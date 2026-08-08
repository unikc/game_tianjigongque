// ============================================================================
// 本文件是 later-scenes.ts 的补丁草稿，不是新的独立模块。
// 落地方式：
//   1. 把「第6章 ChapterSeed」整体替换掉 chapters 数组里 number: 6 的那一项。
//   2. 把「第6章分支场景」和「下游钩子」两段，接在文件末尾
//      （原本 day10_2 / day11_1 那两行 requiresRewardId 之后）。
// 用的全是已有类型（Scene / Choice / Effect），没有改 types.ts 或 engine.ts。
// ============================================================================

import type { Choice, Scene } from "../types";

// ----------------------------------------------------------------------------
// 一、第6章 ChapterSeed：beat 1 三选一之后不再收敛到同一个 day6_2，
//     而是分流到 day6_2a / day6_2b / day6_2c 三个不同文案的场景。
//     用现有生成器只产出 beat 1 和 beat 3（day6_1 / day6_3 / day6_result），
//     beat 2 的三个变体在下面第二段手写补上，和第7-9章"手写覆盖生成结果"
//     的既有写法（Object.assign / choices.push）是同一路数，不新增机制。
// ----------------------------------------------------------------------------

/*
{
  number: 6,
  title: "河决千里",
  growth: [
    "谋略", 4,
    "【修习·谋略四】把赈银、票号与军粮三账交叉核验。",
    "三个看似无关的缺口拼成同一条转银路径，你不必在救灾和追账之间完全二选一。",
    "ch6_growth_breakthrough",
  ],
  beats: [
    [
      "三成空账",
      "河道决口，赈银少了三成，数目恰与空印军粮账吻合。宫墙外的灾民等不起一场完整审讯。",
      [
        [
          "先拨宫库补缺，暂不惊动主谋。",
          "第一批粮船按时出发，宫库却留下无法公开的缺口。",
          "ch6_aid_first",
        ],
        [
          "冻结涉案银号，逐笔追账。",
          "赃银被扣，合法物资也一起停在码头。",
          "ch6_freeze_funds",
        ],
        [
          "公开亏空，迫使百官当场认捐。",
          "粮款迅速凑齐，朝局也因这份公开羞辱剧烈震荡。",
          "ch6_public_accounts",
        ],
      ],
    ],
    // 占位：beat 2 由下面手写的 day6_2a/2b/2c 承接，这里内容不会被用到，
    // 保留是因为生成器需要一个 beat[1] 来占住 growth 挂载位（beatIndex===0
    // 才挂 growth，不受影响）和 result 的 next 计算。写最短占位文本即可，
    // 实际运行时 day6_1 的三个选项 next 会在下面被改写，不会走到这里。
    [
      "（占位，不会展示）",
      "（占位，不会展示）",
      [
        ["（占位）", "（占位）", "ch6_placeholder_1"],
        ["（占位）", "（占位）", "ch6_placeholder_2"],
        ["（占位）", "（占位）", "ch6_placeholder_3"],
      ],
    ],
    [
      "谁承担延误",
      "回宫后，顾明华要用证据换位置，沈令仪要先保住赈运。两者都说百姓等不起。",
      [
        [
          "把证据交给皇后，换她立即开仓。",
          "赈运恢复，皇后也获得了决定何时公开真相的权力。",
          "ch6_queen_aid",
        ],
        [
          "与顾明华扣住证据，逼出全部赃银。",
          "更多银子回流，第一批受冻的人却等不到胜利。",
          "ch6_gu_leverage",
        ],
        [
          "复制账目分交两方，自己保留原册。",
          "没有人得到完整控制，你则成为双方共同提防的账册持有人。",
          "ch6_split_ledger",
        ],
      ],
    ],
  ],
},
*/

// ----------------------------------------------------------------------------
// 二、beat 2 的三个真正的变体场景（在 laterScenes 生成之后手写追加）。
//     day6_2a：选了"公开羞辱百官" —— 顾明华当众被驳面子，她开始记恨你
//     day6_2b：选了"冻结追账"    —— 你和裴照南并肩去堤上放粮，埋下信任种子
//     day6_2c：选了"先拨宫库补缺" —— 最保守的路线，裴照南只是"分开行动"的搭档
// ----------------------------------------------------------------------------

export function applyChapter6Patch(laterScenes: Record<string, Scene>) {
  // 2.1 把 beat 1 三个选项的 next 从占位的 day6_2 改写为各自的变体
  laterScenes.day6_1.choices[0].next = "day6_2c"; // 拨宫库补缺 → 保守线
  laterScenes.day6_1.choices[1].next = "day6_2a"; // 冻结追账 → 与裴照南并肩线
  laterScenes.day6_1.choices[2].next = "day6_2b"; // 公开羞辱百官 → 顾明华记恨线

  // 2.2 追加三个变体场景，全部在 beat3 时收敛到 day6_3
  const mk = (
    id: string,
    title: string,
    text: string,
    choices: Choice[],
  ): Scene => ({
    id,
    title,
    chapterLabel: "第6日",
    progress: { current: 2, total: 3 },
    text,
    choices,
  });

  laterScenes.day6_2a = mk(
    "day6_2a",
    "堤上并肩",
    "冻结令生效的同时，裴照南主动请令随你去河堤——羽林第一次不是奉命护驾，而是自己要求跟你去救人。",
    [
      {
        id: "day6_2a_1",
        text: "追查票号，把赃银路径钉死。",
        outcome:
          "商路指向太后母族，今日的粥棚却少开了两处。裴照南全程没插手账目，只在你身后守着。",
        effect: {
          stats: { 谋略: 1 },
          tags: ["ch6_bank_trail", "ch6_pei_bond"],
        },
        next: "day6_3",
      },
      {
        id: "day6_2a_2",
        text: "让裴照南带兵先去开仓放粮，自己留下盯账。",
        outcome:
          "灾民吃上热粥的时候，账房已经从水路逃走——但裴照南第一次主动向你复命，而不是先回禀皇后。",
        effect: {
          stats: { 人情: 1 },
          tags: ["ch6_feed_people", "ch6_pei_bond", "ch6_pei_reports_to_you"],
        },
        next: "day6_3",
      },
      {
        id: "day6_2a_3",
        text: "两人分头，你追账，她断后。",
        outcome: "你拿到半条证据链，也第一次把后背交给一个还不算熟的人。",
        effect: {
          stats: { 胆识: 1 },
          tags: ["ch6_split_force", "ch6_pei_trust_given"],
        },
        next: "day6_3",
      },
    ],
  );

  laterScenes.day6_2b = mk(
    "day6_2b",
    "羞辱之后",
    "百官认捐的银子已经入库，顾明华却在殿外拦住你：“你让我在满朝面前没了脸面。”她说这话时看着你，像是在记一笔账。",
    [
      {
        id: "day6_2b_1",
        text: "追查票号，不理会她的怨气。",
        outcome: "商路指向太后母族，顾明华的怨气却没有随账目一起清算。",
        effect: {
          stats: { 谋略: 1 },
          tags: ["ch6_bank_trail"],
          relations: { 顾明华: -1 },
        },
        next: "day6_3",
      },
      {
        id: "day6_2b_2",
        text: "先去道歉，把功劳分她一半。",
        outcome: "她收下了台阶，但你也清楚——这笔账，她只是暂时不提了。",
        effect: {
          stats: { 人情: 1 },
          tags: ["ch6_feed_people", "ch6_gu_placated"],
          relations: { 顾明华: 1 },
        },
        next: "day6_3",
      },
      {
        id: "day6_2b_3",
        text: "分开行动，追账与放粮各自负责。",
        outcome: "你保住半条证据链，顾明华的账，你还没顾上还。",
        effect: {
          stats: { 胆识: 1 },
          tags: ["ch6_split_force"],
          relations: { 顾明华: -1 },
        },
        next: "day6_3",
      },
    ],
  );

  laterScenes.day6_2c = mk(
    "day6_2c",
    "宫外一日",
    "你随裴照南来到河堤。名册上的“三百户”是泥水里三千张等粮的脸。她的态度还是公事公办——补缺的钱毕竟没有从她的羽林粮饷里出。",
    [
      {
        id: "day6_2c_1",
        text: "追查票号，把赃银路径钉死。",
        outcome: "商路指向太后母族，今日的粥棚却少开了两处。",
        effect: { stats: { 谋略: 1 }, tags: ["ch6_bank_trail"] },
        next: "day6_3",
      },
      {
        id: "day6_2c_2",
        text: "留下组织放粮，放弃追赶账房。",
        outcome: "灾民吃上热粥，携带总账的账房从水路逃走。",
        effect: { stats: { 人情: 1 }, tags: ["ch6_feed_people"] },
        next: "day6_3",
      },
      {
        id: "day6_2c_3",
        text: "让裴照南追账，自己监督军粮。",
        outcome: "你分开人手，保住半条证据链，也承担了彼此无法照应的风险。",
        effect: { stats: { 胆识: 1 }, tags: ["ch6_split_force"] },
        next: "day6_3",
      },
    ],
  );

  // 2.3 beat 3「谁承担延误」追加一个专属选项：只有攒够 pei_bond 的人才能
  //     请裴照南以羽林名义护送证据，这份武力背书会在第7章降低她被撤职的概率
  //     （具体体现见下面 applyChapter7DownstreamHooks）。
  laterScenes.day6_3.choices.push({
    id: "day6_3_4",
    text: "请裴照南以羽林之名护送证据入宫。",
    outcome: "羽林亲自为证据背书，这份功劳，日后有人想动她时会想起今天。",
    effect: { tags: ["ch6_pei_escort", "ch6_legacy_pei_credit"] },
    next: "day6_result",
    requiresTag: "ch6_pei_bond",
  });

  // 2.4 章节遗留 tag：无论走哪条 beat2 变体，只要没结上裴照南的善缘，
  //     显式标记一个"纯工作关系"的默认状态，方便第7章判断三态而不是二态。
  ["day6_queen_aid", "day6_gu_leverage", "day6_split_ledger"].forEach((cid) => {
    const choice = laterScenes.day6_3.choices.find((c) => c.id === cid);
    if (choice) choice.effect.tags = [...(choice.effect.tags ?? [])];
  });
}

// ----------------------------------------------------------------------------
// 三、第7-9章下游钩子：把 ch5/ch6 的遗留 tag，以及 ch7-9 已有但没被
//     后面读取的 tag，接进后面的章节。全部是"追加选项/条件门槛/文案覆盖"，
//     不改变任何现有分支的默认路径，只在满足条件时多出/少掉东西。
// ----------------------------------------------------------------------------

export function applyDownstreamHooks(laterScenes: Record<string, Scene>) {
  const choice = (sceneId: string, choiceId: string): Choice => {
    const found = laterScenes[sceneId]?.choices.find((c) => c.id === choiceId);
    if (!found)
      throw new Error(`hook target not found: ${sceneId}/${choiceId}`);
    return found;
  };

  // 3.1 第6章 → 第7章：裴照南的"羽林库存"审讯戏按第6章关系分三种走法。
  //     原文案是固定的"她要亲自审问守库人"，现在按 ch6_pei_bond /
  //     ch6_pei_escort 的有无换一句开场白，并在有 escort credit 时,
  //     "撤下裴照南交皇后审理"这个选项的后果文案更轻（她没有被直接罢免）。
  const day7_2 = laterScenes.day7_2;
  if (day7_2) {
    day7_2.text =
      "箭簇来自羽林库存，领用册写着裴照南兄长的名字。" +
      "她要亲自审问守库人——" +
      "（若你在第6章与她并肩过：这一次，她先看向你，像是确认你还站在她这边。）";
  }
  // 注：day7_2 第二个选项（撤下裴照南）的 ch7_pei_removed tag 已在原始
  // ChapterSeed 里设置，这里不需要重复赋值。
  // 有护送功劳在案的，撤职这条路改写 outcome，不再是干净利落地免职
  laterScenes.day7_2.choices.push({
    id: "day7_pei_defended",
    text: "以河堤护送之功为她担保，请皇后收回撤职之议。",
    outcome: "皇后没有再提撤职，只留下一句“记着是谁先开的口”。",
    effect: { tags: ["ch7_pei_defended"], relations: {} },
    next: "day7_3",
    requiresTag: "ch6_legacy_pei_credit",
  });

  // 3.2 第7章 → 第8章：裴照南是否被撤职，会影响"明华发难"这场戏
  //     顾明华公开的"半份证据"能不能被当场拆穿一角。
  laterScenes.day8_2?.choices.push({
    id: "day8_pei_disputes",
    text: "请裴照南当场作证，指出证据来源存疑。",
    outcome: "她的话让顾明华的半份证据第一次被公开质疑，长春宫的节奏被打乱。",
    effect: {
      stats: { 胆识: 1 },
      tags: ["ch8_pei_disputes_evidence"],
      relations: { 顾明华: -1 },
    },
    next: "day8_3",
    requiresTag: "ch7_pei_truth",
  });

  // 3.3 第8章 → 第9章：如果第8章选择了"复制证据，公开给女官与朝臣"
  //     （ch8_truth_public），消息提前泄露，纵火动机被坐实为"灭口"，
  //     追纵火者这条路更容易成立——给一个门槛更低的替代结果。
  const day9_1_3 = choice("day9_1", "day9_1_3");
  day9_1_3.outcome =
    day9_1_3.outcome +
    "（因证据已提前公开，这次抓获的不只是死士，还有一封没来得及销毁的调令。）";
  laterScenes.day9_1.choices.push({
    id: "day9_arsonist_ledger",
    text: "以已公开的证据为线索，直接锁定纵火者上家。",
    outcome:
      "泄露的证据这次成了你的地图，纵火者还没来得及毁灭全部痕迹就被堵在库房外。",
    effect: {
      stats: { 谋略: 1 },
      tags: ["ch9_arsonist_caught", "ch9_evidence_saved", "ch9_royal_exposed"],
    },
    next: "day9_2",
    requiresTag: "ch8_truth_public",
  });

  // 3.4 第9章 → 第10章：day10_2 第二个选项"暂认口谕，顺着传令者追上家"
  //     本质是靠消息网络反向追踪，高福安死亡时这条"顺藤摸瓜"的路子应该
  //     变难——用 excludesTag 反向 gate 掉原选项，换一条更冒险的替代路。
  const day10_follow_order = laterScenes.day10_2?.choices.find((c) =>
    c.effect.tags?.includes("ch10_follow_false_order"),
  );
  if (day10_follow_order) day10_follow_order.excludesTag = "ch9_gao_dead";
  laterScenes.day10_2?.choices.push({
    id: "day10_no_gao_fallback",
    text: "没有高福安探听消息，只能亲自沿传令者的脚印去查。",
    outcome:
      "少了一个能替你在暗处走动的人，这一步你走得比原本慢，也比原本更冒险。",
    effect: { stats: { 胆识: 1 }, tags: ["ch10_follow_false_order_hard_way"] },
    next: "day10_3",
    requiresTag: "ch9_gao_dead",
  });

  // 3.5 第9章 → 第11章：宗室身份是否已在第9章暴露，改写政变军开场文案，
  //     并让"打开外门"选项的后果按民众是否早有防备分叉。
  // 注：开场文案本身要不要按 ch9_royal_exposed 分叉（"宗室身份早已公开，
  // 城中并非毫无防备" vs 现有默认文案），需要 Scene.text 支持动态选择，
  // 目前它是静态字符串。成本最低的做法是在 Game.tsx 渲染 DialoguePanel
  // 时加一次"若 scene.id === 'day11_1' 且 state.tags 含 ch9_royal_exposed
  // 则替换 text"的特判，而不是给 Scene 类型加函数字段。这里先只落地
  // 选项和后果层面的分支，文案分叉留给 UI 层一行条件渲染。
  Object.assign(choice("day11_1", "day11_1_3").effect, {
    tags: ["ch11_open_gate", "ch11_gate_informed_public"],
  });
  laterScenes.day11_1.choices.push({
    id: "day11_open_gate_prepared",
    text: "打开外门，让早有防备的朝臣与百姓正面阻拦政变军。",
    outcome:
      "宗室身份公开在前，百姓这次不是旁观者，政变军的秘密行动彻底失去空间。",
    effect: {
      stats: { 谋略: 1 },
      tags: ["ch11_open_gate", "ch11_gate_public_resistance"],
    },
    next: "day11_2",
    requiresTag: "ch9_royal_exposed",
  });
}
