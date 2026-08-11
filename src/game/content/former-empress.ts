/**
 * E04 · 前朝废后「已经赢过的人」
 *
 * ── 设计原则 ──────────────────────────────────────────────────────────
 *
 * 昭君妃是上一个皇帝的遗孀，在萧承元登基后被关入冷宫，
 * 对外宣称「病亡」，实际活了将近二十年。
 *
 * 她的核心特质：
 *   - 她「已经赢过了」——她活下来了，代价是放弃了一切可见的东西
 *   - 她的信息有真有假有过时有选择性：玩家每次见她都要判断
 *   - 她的建议在两个章节分别影响一个决定，效果异步出现
 *   - 她从不撒谎，但她选择说什么
 *
 * 她绝对不是萧承元的前妻（canon 约束）。
 * 她也绝对不复制天机阁的功能——她不做预言，她做回忆。
 * 天机阁说「将来会看见什么」，废后说「我当年看见了什么，那件事现在还在吗」。
 *
 * ── 三次接触结构 ──────────────────────────────────────────────────────
 *
 * 第9章（冷宫开门）：初见。她是三名「已宣布病亡」的证人之一。
 *   - 玩家救出证人后，她说了一句话，然后消失在人群里
 *   - 她不解释自己是谁，玩家不一定认出她
 *
 * 第10章（间接）：她让人送来一件旧物或一个名字
 *   - 那件物品或那个名字在当天的某个决定里会起作用
 *   - 玩家不能当面问她，只能判断要不要用她送来的东西
 *
 * 第11章（宫门）：她亲自出现在宫门前
 *   - 她站在玩家这边还是对面，取决于玩家对她的处理方式
 *   - 她出现的方式决定了玩家能从她那里得到什么
 *
 * ── 可信度机制 ────────────────────────────────────────────────────────
 *
 * 「former_empress_claim:*」tag 记录她说过的话
 * 「claim_verified:*」tag 记录哪些话后来被证实
 * 「claim_outdated:*」tag 记录哪些话是真的但已经过时
 * 「claim_manipulated:*」tag 记录哪些话是她有意留下让玩家用来对付自己的
 *
 * 玩家在第12章可以回顾：哪些话准了，为什么准了。
 */

import type { Scene, Choice } from "../types";
import type { GameState } from "../types";

// ---------------------------------------------------------------------------
// 第9章：冷宫开门——初见
// ---------------------------------------------------------------------------

/**
 * 静态骨架——出现在场景注册表里供遍历工具使用。
 * 运行时由 buildFormerEmpressFirstMeeting 生成真实内容。
 */
export const formerEmpressFirstMeetingSkeleton: Scene = {
  id: "former_empress_ch9",
  title: "冷宫里的人",
  chapterLabel: "第9日",
  text: "三名证人走到天光下。其中一个人在你耳边说了一句话。",
  choices: [
    {
      id: "fe_ch9_ask",
      text: "问她是谁。",
      outcome: "她没有正面回答，只转身走了。",
      effect: { tags: ["fe_asked_identity"] },
      next: "day9_3",
    },
    {
      id: "fe_ch9_listen",
      text: "只是听，不问。",
      outcome: "你记住了那句话，没有追上去。",
      effect: { tags: ["fe_listened_only"] },
      next: "day9_3",
    },
    {
      id: "fe_ch9_ignore",
      text: "你有更急的事，没有留意她说了什么。",
      outcome: "她走进人群，那句话跟着消失了。",
      effect: { tags: ["fe_ignored_first"] },
      next: "day9_3",
    },
  ],
};

export function buildFormerEmpressFirstMeeting(
  state: GameState,
  returnTo: string,
): Scene {
  // 她说的那句话，根据种子推导（不能揭露隐藏真相，只能暗示她知道什么）
  // 两种变体：关于皇后的，或关于纵火的
  const variant = Math.abs(state.seed) % 2 === 0 ? "queen" : "fire";

  const herLine =
    variant === "queen"
      ? "皇后存着一份二十年前的供词。她没有用，不是因为不想，是因为等到合适的时候。"
      : "今晚的火不是为了毁账，是为了让一个人有理由离开她待的地方。";

  const choices: Choice[] = [
    {
      id: "fe_ch9_ask",
      text: "抓住她的袖子。「你是谁？」",
      outcome:
        "她停了半步，然后说：\n「你不需要知道我是谁。你只需要知道我说的话是不是真的。」\n她走了。你不知道她是哪位宫人，也不知道她刚才说的那句话该信到几分。",
      effect: {
        tags: [
          "fe_asked_identity",
          "fe_claim_received",
          `fe_claim:${variant}`,
          "former_empress_known",
        ],
        relations: { 昭君妃: 2 },
      },
      next: returnTo,
    },
    {
      id: "fe_ch9_listen",
      text: "把那句话记下来，没有追问。",
      outcome:
        "她在你耳边说完，退后一步，看了你一眼。\n那眼神不是感谢，也不是警告，是在评估你是否值得听见那句话。\n然后她走了。",
      effect: {
        stats: { 谋略: 1 },
        tags: [
          "fe_listened_only",
          "fe_claim_received",
          `fe_claim:${variant}`,
          "former_empress_known",
        ],
        relations: { 昭君妃: 4 },
      },
      next: returnTo,
    },
    {
      id: "fe_ch9_ignore",
      text: "火场里有更急的事。你没有停下来。",
      outcome:
        "她在你身边说了什么，你听见了音节，但没有留在脑子里。\n后来你再找她，她已经混进了其他获救的宫人里，再也认不出来了。",
      effect: {
        tags: ["fe_ignored_first"],
      },
      next: returnTo,
    },
  ];

  return {
    id: "former_empress_ch9",
    title: "冷宫里的人",
    chapterLabel: "第9日",
    progress: { current: 4, total: 5 },
    text:
      "三名「已宣布病亡」的证人走到天光下。\n\n" +
      "其中有一个人——不是最年轻的那个，也不是最虚弱的——在你经过的时候伸手拦住你，在你耳边说了一句话：\n\n" +
      `「${herLine}」\n\n` +
      "然后她退开了，像是只是随手拍了一下你的肩。",
    choices,
  };
}

// ---------------------------------------------------------------------------
// 第10章：间接接触——旧物或名字
// ---------------------------------------------------------------------------

export function applyFormerEmpressCh10(laterScenes: Record<string, Scene>) {
  // 副本：她送来的东西（只有听过她说话的玩家才能触发）
  laterScenes.former_empress_ch10_item = {
    id: "former_empress_ch10_item",
    title: "没有落款的东西",
    chapterLabel: "第10日",
    text:
      "有人在你桌上放了一件东西，没有留下名字。\n\n" +
      "是一枚旧印，已经磨得看不出字迹，背面刻着一个数字：十七。\n" +
      "同时夹着一张纸，上面只有一行字：\n\n" +
      "「太后母族旧账共十九册，第十七册在礼部库房的哪一格，我记得。如果你用得上，来找我。」\n\n" +
      "她没有说她在哪里。",
    choices: [
      {
        id: "fe_ch10_use_info",
        text: "按她说的去礼部库房找那一册。",
        outcome:
          "第十七格的第三列，有一册旧账，年份是十八年前。\n" +
          "里面有三笔开支，核对下来，能和今天案子里的一个数字对上。\n" +
          "那个数字你一直找不到来源。现在找到了。\n\n" +
          "你不知道她为什么知道这个，也不知道她记了多少年。",
        effect: {
          stats: { 谋略: 1, 才学: 1 },
          relations: { 昭君妃: 3 },
          tags: [
            "fe_info_used_ch10",
            "fe_claim_verified:ledger-17",
            "ch10_old_ledger_found",
          ],
        },
        next: "day10_1",
      },
      {
        id: "fe_ch10_ignore_item",
        text: "不去。你不知道她是谁，也不知道那里有没有陷阱。",
        outcome:
          "旧印和那张纸放在桌上，你没有动它。\n" +
          "礼部库房第十七格的那册旧账，你没有去找。\n" +
          "也许里面什么都没有。也许有。",
        effect: {
          tags: ["fe_info_ignored_ch10"],
          relations: { 昭君妃: -1 },
        },
        next: "day10_1",
      },
      {
        id: "fe_ch10_verify_first",
        text: "先让人去确认那一格是否真的有旧账，再决定要不要用。",
        outcome:
          "派去的人回来说：有一册，年份对。\n\n" +
          "你让他把书目记下来，但没有让他取回来。\n" +
          "你现在知道她说的是真的——至少这一件是真的。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 昭君妃: 2 },
          tags: [
            "fe_info_verified_not_used",
            "fe_claim_verified:ledger-17",
          ],
        },
        next: "day10_1",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 第11章：她出现在宫门前
// ---------------------------------------------------------------------------

export function buildFormerEmpressFinalScene(
  state: GameState,
  returnTo: string,
): Scene {
  const wasIgnored = state.tags.includes("fe_ignored_first");
  const infoUsed = state.tags.includes("fe_info_used_ch10");
  const claimReceived = state.tags.includes("fe_claim_received");
  const relation = state.relations.昭君妃 ?? 0;

  if (wasIgnored && !claimReceived) {
    // 玩家当时没有听——她不会出现
    return {
      id: "former_empress_ch11",
      title: "冷宫的人没有来",
      chapterLabel: "第11日",
      text:
        "宫门前很乱。你想起冷宫里那三个人——你当时太忙，没有停下来听她说什么。\n\n" +
        "她没有出现在今晚的任何地方。\n\n" +
        "也许她只是一个普通的宫人，碰巧活下来了。\n" +
        "也许不是。你永远不会知道了。",
      choices: [
        {
          id: "fe_ch11_accept",
          text: "继续手头的事。",
          outcome: "宫门的事更要紧。",
          effect: { tags: ["fe_final_missed"] },
          next: returnTo,
        },
      ],
    };
  }

  // 她出现了——但她站在哪里取决于玩家的选择
  const standsWithPlayer = relation >= 5 || infoUsed;
  const standsAgainst = relation <= -3 && !infoUsed;

  if (standsAgainst) {
    return {
      id: "former_empress_ch11",
      title: "她站在对面",
      chapterLabel: "第11日",
      text:
        "宫门前的那个人，你认出来了。\n\n" +
        "是她。\n\n" +
        "她没有拿武器，也没有跟着政变军——她只是站在人群里，在你能看见的位置，让你知道她在。\n\n" +
        "然后她对着旁边一个你认识的人，说了什么。\n" +
        "那个人的脸色变了。",
      choices: [
        {
          id: "fe_ch11_confront",
          text: "走过去。当着所有人的面，问她在说什么。",
          outcome:
            "她转过来，看了你一会儿，然后说：\n" +
            "「我只是告诉他，你当初听见了什么，然后选择没有理会。」\n\n" +
            "那句话是真的。\n" +
            "她没有撒谎，只是让别人知道了你那天的选择。",
          effect: {
            stats: { 名望: -1, 胆识: 1 },
            relations: { 昭君妃: 2 },
            tags: ["fe_final_confronted", "fe_choice_exposed"],
          },
          next: returnTo,
        },
        {
          id: "fe_ch11_ignore_again",
          text: "忽视她。今晚的事比她更要紧。",
          outcome:
            "你没有去理她。\n\n" +
            "事情结束后，那个她说过话的人，态度有了一点变化。\n" +
            "你不确定是不是因为她说的那句话。",
          effect: {
            tags: ["fe_final_ignored_again", "fe_consequence_unclear"],
          },
          next: returnTo,
        },
      ],
    };
  }

  // 她站在玩家这边
  return {
    id: "former_empress_ch11",
    title: "她站在你这边",
    chapterLabel: "第11日",
    text:
      "宫门前，你看见了她。\n\n" +
      "她走过来，没有等你先开口，说：\n" +
      "「我在冷宫里活了十九年。我看见过七次有人试图在今天这种夜里做他们想做的事。」\n" +
      "她停了一下。\n" +
      "「六次失败了。有一次没有。我就是那一次失败的代价。」\n\n" +
      "然后她问你：你今晚想要什么？",
    choices: [
      {
        id: "fe_ch11_take_help",
        text: "告诉她你想要什么。让她站在你身边。",
        outcome:
          "她点头。\n\n" +
          "她在宫门前站了整整一夜，谁也不知道她是谁，只看见有一个活了很久的人，站在你旁边，好像她早就知道今晚会发生什么。\n\n" +
          "也许她确实知道。",
        effect: {
          stats: { 名望: 1 },
          relations: { 昭君妃: 5 },
          tags: [
            "fe_final_allied",
            "former_empress_at_gate",
            infoUsed ? "fe_advice_honored" : "fe_presence_only",
          ],
        },
        next: returnTo,
      },
      {
        id: "fe_ch11_ask_why",
        text: "先问她：你为什么要帮我？",
        outcome:
          "她想了一下，说：\n" +
          "「我不是在帮你。我只是想看见那件事今晚是否能被拦住。」\n" +
          "她顿了顿。\n" +
          "「如果你是拦住它的人，我就站在你这边。如果不是，我也只是一个看热闹的老宫人。」\n\n" +
          "这个答案你没有办法反驳，也没有办法完全信任。",
        effect: {
          stats: { 谋略: 1 },
          relations: { 昭君妃: 3 },
          tags: ["fe_final_cautious", "former_empress_at_gate"],
        },
        next: returnTo,
      },
      {
        id: "fe_ch11_send_away",
        text: "让她走。今晚你不需要一个来历不明的人站在你身边。",
        outcome:
          "她看了你一眼，没有坚持，转身走了。\n\n" +
          "你不知道那是失望还是满意。\n" +
          "她活了十九年，大概已经学会了从所有结果里找到某种答案。",
        effect: {
          relations: { 昭君妃: -2 },
          tags: ["fe_final_dismissed"],
        },
        next: returnTo,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 注册与挂接
// ---------------------------------------------------------------------------

/** 运行时场景 id → 回程目标 */
export const formerEmpressSceneTargets: Record<string, string> = {};

export function applyE04FormerEmpress(laterScenes: Record<string, Scene>) {
  // 静态骨架注册到场景图
  laterScenes.former_empress_ch9 = formerEmpressFirstMeetingSkeleton;
  laterScenes.former_empress_ch11 = {
    id: "former_empress_ch11",
    title: "宫门前的人",
    chapterLabel: "第11日",
    text: "她出现了，或者没有。",
    choices: [
      {
        id: "fe_ch11_accept",
        text: "面对她。",
        outcome: "事情向前推进。",
        effect: {},
        next: "day11_2",
      },
    ],
  };

  // 第9章：冷宫开门之后追加废后相遇选项
  const day9_2 = laterScenes.day9_2;
  if (day9_2) {
    const back = day9_2.choices[0]?.next ?? "day9_3";
    formerEmpressSceneTargets["former_empress_ch9"] = back;

    day9_2.choices.push({
      id: "day9_2_former_empress",
      text: "其中一个被救出来的人在你耳边说了一句话。",
      outcome: "你停下来听了。",
      effect: {},
      next: "former_empress_ch9",
      requiresAnyTag: ["ch9_witnesses_saved", "ch9_mouse_ledger"],
    });
  }

  // 第10章：副本
  applyFormerEmpressCh10(laterScenes);

  // 第11章：在 day11_1 追加入口
  const day11_1 = laterScenes.day11_1;
  if (day11_1) {
    const back = day11_1.choices[0]?.next ?? "day11_2";
    formerEmpressSceneTargets["former_empress_ch11"] = back;

    day11_1.choices.push({
      id: "day11_1_former_empress",
      text: "宫门前，你认出了一张脸。",
      outcome: "是冷宫里的那个人。",
      effect: {},
      next: "former_empress_ch11",
      requiresTag: "former_empress_known",
    });
  }
}
