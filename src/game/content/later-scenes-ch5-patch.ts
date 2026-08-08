/**
 * 第5章「未落之子」分支补丁 + 温疏雨命运线。
 *
 * 设计目标：把第5章从"9个装饰性按钮"改造成一条能一路读到第9章的人物命运线。
 *
 * 核心后果轴是**温疏雨这个太医证人的处境**：
 *   - 你在赏花宴上是否把她推到台前作证（ch5_wen_exposed）
 *   - 事后你有没有保住她（ch5_wen_protected / ch5_wen_hidden）
 * 这三种状态会在第8章（她愿不愿意替你作证）和第9章（她是不是冷宫里
 * 那三名"早被宣布病亡"的证人之一）产生截然不同的结果。
 *
 * 之所以选温疏雨作为主轴：她是原稿里唯一一个横跨第5、7、8章都会出现、
 * 却始终没有自己命运的角色。给她一条命运线，成本最低、回报最高。
 *
 * 实现方式与第6章补丁一致：生成器产出骨架，这里做运行时改写与追加，
 * 不改动 types.ts / engine.ts 的任何结构。
 */

import type { Choice, Scene } from "../types";

export function applyChapter5Patch(laterScenes: Record<string, Scene>) {
  // --------------------------------------------------------------------------
  // 1. beat 1 三个选项分流到三个不同的 beat 2，并给"当众核对"这条路
  //    额外打上 ch5_wen_exposed —— 你让她当众作证，等于把她的名字
  //    写进了所有人的账本。
  // --------------------------------------------------------------------------
  const beat1 = laterScenes.day5_1.choices;
  beat1[0].next = "day5_2a"; // 封住消息，先救惠嫔
  beat1[1].next = "day5_2b"; // 当众核对脉案与用药
  beat1[2].next = "day5_2c"; // 扣住送药宫人

  // 当众核对 = 让温疏雨公开作证，她因此暴露
  beat1[1].outcome =
    "矛盾被摆上桌面。惠嫔家族无法再用一声哭遮住三个月的假脉案——" +
    "但温疏雨的名字也从此进了所有人的账本。";
  beat1[1].effect.tags = [...(beat1[1].effect.tags ?? []), "ch5_wen_exposed"];

  // --------------------------------------------------------------------------
  // 2. 三个 beat 2 变体：同一件事（惠嫔的妹妹被家族当人质），
  //    但你手里的筹码不同，因此可选的解法不同。
  // --------------------------------------------------------------------------
  const mk = (
    id: string,
    title: string,
    text: string,
    choices: Choice[],
  ): Scene => ({
    id,
    title,
    chapterLabel: "第5日",
    progress: { current: 2, total: 3 },
    text,
    choices,
  });

  // 2a：你封锁了消息 —— 真相还攥在你手里，是最完整的筹码
  laterScenes.day5_2a = mk(
    "day5_2a",
    "被扣住的妹妹",
    "帘子放下之后，惠嫔才敢说完整的话。她的家族用妹妹作人质，又借“皇嗣”拿到了赈灾差事。" +
      "消息还没有传出去——真相此刻只有你们三个人知道。",
    [
      {
        id: "day5_2a_1",
        text: "用尚未外泄的脉案，换她妹妹平安入宫。",
        outcome: "人质获救，假孕真相仍完整地留在你手里，随时可以出鞘。",
        effect: {
          stats: { 谋略: 1 },
          tags: ["ch5_sister_saved", "ch5_leverage_intact"],
        },
        next: "day5_3",
      },
      {
        id: "day5_2a_2",
        text: "公开假孕，切断家族的赈灾差事。",
        outcome: "差事被收回，惠嫔也失去了最后一层保护——是你亲手掀开的帘子。",
        effect: { stats: { 胆识: 1 }, tags: ["ch5_truth_public"] },
        next: "day5_3",
      },
      {
        id: "day5_2a_3",
        text: "让谎言延续，逼家族补回赈银。",
        outcome: "一批银子回到账上，你却成为维护假皇嗣的人。",
        effect: { stats: { 人情: 1 }, tags: ["ch5_lie_continues"] },
        next: "day5_3",
      },
    ],
  );

  // 2b：你让温疏雨当众作证 —— 真相已经公开，没有"用真相交换"这条路了，
  //     取而代之的是她现在需要你保护
  laterScenes.day5_2b = mk(
    "day5_2b",
    "被扣住的妹妹",
    "假脉案已经当众对不上，惠嫔无从抵赖。她的家族用妹妹作人质，又借“皇嗣”拿到了赈灾差事。" +
      "温疏雨站在阶下没有走——她刚刚当着所有人的面，把自己变成了证人。",
    [
      {
        id: "day5_2b_1",
        text: "以已公开的假孕为凭，直接命家族交还妹妹。",
        outcome: "家族失去了谈判的筹码，只能交人；温疏雨的证词是唯一支点。",
        effect: {
          stats: { 谋略: 1 },
          tags: ["ch5_sister_saved", "ch5_truth_public"],
        },
        next: "day5_3",
      },
      {
        id: "day5_2b_2",
        text: "顺势切断家族的赈灾差事。",
        outcome: "差事被收回，家族的怨恨转向那个开口的太医。",
        effect: {
          stats: { 胆识: 1 },
          tags: ["ch5_truth_public", "ch5_wen_resented"],
        },
        next: "day5_3",
      },
      {
        id: "day5_2b_3",
        text: "先安置温疏雨，再谈妹妹的事。",
        outcome: "你把证人挪到了太医院的西厢，那里至少有门闩。",
        effect: {
          stats: { 人情: 1 },
          tags: ["ch5_wen_sheltered"],
          relations: { 高福安: 1 },
        },
        next: "day5_3",
      },
    ],
  );

  // 2c：你从药入手 —— 线索指向宗室，但温疏雨的改案还没有解释
  laterScenes.day5_2c = mk(
    "day5_2c",
    "被扣住的妹妹",
    "送药宫人供出药来自宗室女眷。惠嫔承认配合假孕：家族用她妹妹作人质，" +
      "又借“皇嗣”拿到了赈灾差事。而温疏雨为什么改脉案，仍然没有人解释。",
    [
      {
        id: "day5_2c_1",
        text: "顺着药单往上追，把宗室一并钉住。",
        outcome: "药单指向一个你还惹不起的名字，妹妹仍在别人手里。",
        effect: {
          stats: { 谋略: 1 },
          tags: ["ch5_royal_drug_trail"],
        },
        next: "day5_3",
      },
      {
        id: "day5_2c_2",
        text: "先问温疏雨为什么改案。",
        outcome:
          "她说改案是为了让惠嫔活到今天。这个理由你信，但写不进任何一份公文。",
        effect: {
          stats: { 人情: 1 },
          tags: ["ch5_wen_motive_known"],
        },
        next: "day5_3",
      },
      {
        id: "day5_2c_3",
        text: "用药单交换妹妹平安入宫。",
        outcome: "人质获救，宗室那条线你暂时放过了。",
        effect: {
          stats: { 胆识: 1 },
          tags: ["ch5_sister_saved"],
        },
        next: "day5_3",
      },
    ],
  );

  // --------------------------------------------------------------------------
  // 3. beat 3「脉案落款」：原本"保护温疏雨"是无条件可选的，
  //    这不合理——她没被推到台前时，根本不需要你公开保护。
  //    现在按 beat1/beat2 的实际处境分成三种互斥解法。
  // --------------------------------------------------------------------------
  const beat3 = laterScenes.day5_3.choices;

  // "安排惠嫔平安退养" → 留下仁慈的遗产，供第12章读取
  beat3[0].effect.tags = [...(beat3[0].effect.tags ?? []), "ch5_legacy_mercy"];
  beat3[0].effect.relations = {
    ...(beat3[0].effect.relations ?? {}),
    高福安: 1,
  };

  // "保护温疏雨" → 只有当你把她推到台前（或已把她藏起来）时才成立
  beat3[1].requiresAnyTag = ["ch5_wen_exposed", "ch5_wen_sheltered"];
  beat3[1].effect.tags = [
    ...(beat3[1].effect.tags ?? []),
    "ch5_legacy_wen_saved",
  ];
  beat3[1].effect.relations = {
    ...(beat3[1].effect.relations ?? {}),
    顾明华: -1,
  };

  // "呈上赈灾名单" → 把后宫丑闻升级成朝廷亏空
  beat3[2].effect.tags = [
    ...(beat3[2].effect.tags ?? []),
    "ch5_legacy_exposed_court",
  ];
  beat3[2].effect.emperor = {
    ...(beat3[2].effect.emperor ?? {}),
    favor: 2,
    trust: 3,
  };

  // 没把她推到台前的路线，需要一个替代的第三解法，
  // 否则这条路只剩两个选项，可选面太窄。
  laterScenes.day5_3.choices.push({
    id: "day5_3_4",
    text: "不惊动任何人，把温疏雨调去行宫医署。",
    outcome:
      "没有人需要为脉案负责，她也悄无声息地离开了这座宫城——" +
      "这是最安全的处置，代价是她欠你的那份情，从此无从谈起。",
    effect: {
      stats: { 谋略: 1 },
      tags: ["ch5_wen_hidden"],
    },
    next: "day5_result",
    excludesTag: "ch5_wen_exposed",
  });
}

// ----------------------------------------------------------------------------
// 温疏雨命运线的下游：第8章与第9章。
// ----------------------------------------------------------------------------

export function applyWenShuyuThread(laterScenes: Record<string, Scene>) {
  // --------------------------------------------------------------------------
  // 第8章「皇后的三年」：如果你当初保住了温疏雨，她现在愿意主动出面，
  // 补全皇后三年前删掉的那部分记录——你不必再去逼皇后交账册。
  // 这是"善待证人"这一路线在权力斗争中真正兑现价值的时刻。
  // --------------------------------------------------------------------------
  laterScenes.day8_1?.choices.push({
    id: "day8_1_4",
    text: "请温疏雨出面，补全当年被删去的那部分脉案与死亡记录。",
    outcome:
      "她带来了三年前自己抄留的副本。皇后看着那些被她亲手划掉的名字，" +
      "第一次没有说“为了大局”。",
    effect: {
      stats: { 才学: 1 },
      tags: ["ch8_wen_testifies", "ch8_names_heard"],
      relations: { 沈令仪: -1 },
    },
    next: "day8_2",
    requiresTag: "ch5_legacy_wen_saved",
  });

  // --------------------------------------------------------------------------
  // 第9章「冷宫开门」：那三名"早被宣布病亡"的证人是谁，取决于你在第5章
  // 怎么处置温疏雨。
  //
  //   - 你把她推到台前却没保住她（exposed 且非 saved）：她就是其中之一。
  //     这是最残酷、也最应该让玩家记住的后果。
  //   - 你保住了她或把她调走了：她不在冷宫里，这个选项不出现。
  // --------------------------------------------------------------------------
  laterScenes.day9_2?.choices.push({
    id: "day9_2_4",
    text: "认出其中一个声音——先砸开温疏雨那扇门。",
    outcome:
      "门后是四个月前被记为病亡的太医温疏雨。她当众作过一次证，" +
      "然后就从所有名册上消失了。这一次你没有再迟到。",
    effect: {
      stats: { 胆识: 1 },
      tags: ["ch9_witnesses_saved", "ch9_wen_rescued"],
      relations: { 高福安: 1 },
    },
    next: "day9_3",
    requiresTag: "ch5_wen_exposed",
    excludesTag: "ch5_legacy_wen_saved",
  });
}
