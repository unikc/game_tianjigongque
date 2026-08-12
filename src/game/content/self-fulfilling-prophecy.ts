/**
 * E06 · 自证预言
 *
 * ── 命题 ────────────────────────────────────────────────────────────
 *
 * 天机阁说：「放火的人会先把自己家的那一卷抱走。」
 *
 * 玩家听了这句话，去第九章火场里主动追查那一卷。
 * 正因为她去追，放火的人发现有人在查，提前销毁了证据——
 * 或者反过来：正因为她去抢，她手里的那一卷替她证明了真相。
 *
 * 事后可以重建因果链：若你当初没有听谶语、没有追那一卷，
 * 今天的结果会完全不同。预言成真，不是因为它预知了未来，
 * 是因为你相信了它，所以它成了真的。
 *
 * ── 机制 ────────────────────────────────────────────────────────────
 *
 * tag 链：
 *   tianji_forecast:fire         → 听了火的谶语
 *   prophecy_causal_link:fire    → 在第9章主动追查了那一卷
 *   prophecy_fulfilled:fire      → 第10章发现追查行为改变了结果
 *   prophecy_loop_closed         → 玩家意识到这是自证预言
 *
 * 没有听谶语 → 不触发链；
 * 听了谶语但没追查 → 预言没有成真，也没有「失败」；
 * 听了 + 追查 → 第10章有一段揭示，第12章结局里有一行注脚。
 *
 * ── 不引入超自然元素 ────────────────────────────────────────────────
 *
 * 卫夷则的谶语是纯理性推断，不是神谶。
 * 自证预言的揭示也是纯因果分析：
 *   「你的追查改变了对方的行为，对方的行为印证了谶语」。
 * 没有宿命，没有神秘力量，只有行为与后果的闭环。
 */

import type { Scene } from "../types";
import type { GameState } from "../types";

// ---------------------------------------------------------------------------
// 第10章：揭示时刻
// 触发条件：有 tianji_forecast:fire AND prophecy_causal_link:fire
// ---------------------------------------------------------------------------

export function buildProphecyRevealScene(
  state: GameState,
  returnTo: string,
): Scene {
  const heardForecast = state.tags.includes("tianji_forecast:fire");
  const didSearch = state.tags.includes("prophecy_causal_link:fire");

  if (!heardForecast || !didSearch) {
    // 条件不满足——返回一个透明的跳过场景
    return {
      id: "prophecy_reveal",
      title: "火场之后",
      chapterLabel: "第十日",
      text: "那场火已经过去了。",
      choices: [
        {
          id: "prophecy_skip",
          text: "继续。",
          outcome: "",
          effect: {},
          next: returnTo,
        },
      ],
    };
  }

  // 触发揭示
  return {
    id: "prophecy_reveal",
    title: "谶语是怎么成真的",
    chapterLabel: "第十日",
    text:
      "你翻出了天机阁的那条谶语：「放火的人会先把自己家的那一卷抱走。」\n\n" +
      "然后你把自己在火场里做的事重新想了一遍。\n\n" +
      "你去抢那一卷，是因为你听了这句话。\n" +
      "你去抢的时候，对方发现有人冲向那个方向，所以才更快地做了他们接下来做的事。\n\n" +
      "谶语成真了。\n" +
      "但它不是因为预知了未来才成真的——\n" +
      "是因为你相信了它，然后按它行动，它才成了真的。\n\n" +
      "卫夷则大概知道会这样。她卖给你的不是答案，是一个会自动成真的行动指令。",
    choices: [
      {
        id: "prophecy_accept_loop",
        text: "接受这件事。你被用了，但结果仍然是你想要的。",
        outcome:
          "你把这件事放在心里，没有回去找卫夷则对质。\n" +
          "她大概也知道你想通了。\n\n" +
          "从此你对天机阁的谶语多了一层警惕：它给你的不只是信息，是行动方向。\n" +
          "而行动方向，永远改变你看见的那个世界。",
        effect: {
          stats: { 谋略: 1, 才学: 1 },
          tags: ["prophecy_fulfilled:fire", "prophecy_loop_closed", "doubts_tianji"],
        },
        next: returnTo,
      },
      {
        id: "prophecy_confront_wei",
        text: "去找卫夷则。问她：你知道会这样，你为什么还卖给我这条谶语？",
        outcome:
          "她听完你的话，沉默了一会儿，然后说：\n\n" +
          "「你想要的结果，需要你主动去追。如果我只是告诉你「去追那一卷」，" +
          "你会按自己的判断决定信不信我。但如果我给你一条让你自己推断出「应该去追」的话——\n" +
          "你会按自己的判断去追，然后觉得那是你自己的决定。」\n\n" +
          "她补了一句：「那确实是你自己的决定。我只是给你一条可以推导出那个决定的信息。」\n\n" +
          "你没有办法说她错了。",
        effect: {
          stats: { 才学: 1 },
          relations: { 卫夷则: -2 },
          tags: [
            "prophecy_fulfilled:fire",
            "prophecy_loop_closed",
            "confronted_wei_on_loop",
          ],
        },
        next: returnTo,
      },
      {
        id: "prophecy_use_knowledge",
        text: "把这个发现记下来，以后用在别的地方。",
        outcome:
          "你没有去找卫夷则，也没有把这件事放下。\n" +
          "你把它作为一种理解方式存起来：\n" +
          "有一类话，它的价值不在于它是否真实，而在于它能让听的人产生什么行动。\n\n" +
          "这个理解，以后会有用的。",
        effect: {
          stats: { 谋略: 2 },
          tags: [
            "prophecy_fulfilled:fire",
            "prophecy_loop_closed",
            "learned_prediction_mechanics",
          ],
        },
        next: returnTo,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// 第9章：在火场追查行为时写入因果标签
// 这个 patch 挂在现有的 day9_2 场景里
// ---------------------------------------------------------------------------

export function applyE06ProphecyHooks(laterScenes: Record<string, Scene>) {
  // 1. 静态骨架供遍历工具使用
  laterScenes.prophecy_reveal = {
    id: "prophecy_reveal",
    title: "谶语是怎么成真的",
    chapterLabel: "第十日",
    text: "那场火之后，你重新想了一遍你做过的事。",
    choices: [
      {
        id: "prophecy_accept_loop",
        text: "接受这件事。",
        outcome: "你被用了，但结果仍然是你想要的。",
        effect: { tags: ["prophecy_fulfilled:fire", "prophecy_loop_closed"] },
        next: "day10_1",
      },
      {
        id: "prophecy_confront_wei",
        text: "去找卫夷则对质。",
        outcome: "她说：那确实是你自己的决定。",
        effect: { tags: ["prophecy_fulfilled:fire", "confronted_wei_on_loop"] },
        next: "day10_1",
      },
      {
        id: "prophecy_use_knowledge",
        text: "把这个理解存起来。",
        outcome: "这个发现以后会有用。",
        effect: { tags: ["prophecy_fulfilled:fire", "learned_prediction_mechanics"] },
        next: "day10_1",
      },
    ],
  };

  // 2. 第9章火场：追查那一卷时写入因果标签
  // 找到第9章里「先取牌位后的鼠册」这类主动追查选项，追加因果 tag
  const day9_2 = laterScenes.day9_2;
  if (day9_2) {
    day9_2.choices.forEach((choice) => {
      // 选择了追查鼠册/账册的选项
      if (
        choice.id.includes("ledger") ||
        choice.id.includes("mouse") ||
        (choice.effect?.tags ?? []).some(
          (t) => t.includes("mouse_ledger") || t.includes("ledger"),
        )
      ) {
        const existing = choice.effect.tags ?? [];
        if (!existing.includes("prophecy_causal_link:fire")) {
          choice.effect.tags = [...existing, "prophecy_causal_link:fire"];
        }
      }
    });
  }

  // 3. 第10章：在 day10_1 之前插入揭示场景入口
  const day10_1 = laterScenes.day10_1;
  if (day10_1) {
    day10_1.choices.push({
      id: "day10_prophecy_reveal",
      text: "【天机】你想起了卫夷则那条关于火的谶语。",
      outcome: "那条谶语成真了。但它是怎么成真的——",
      effect: {},
      next: "prophecy_reveal",
      requiresTag: "tianji_forecast:fire",
      requiresAnyTag: ["prophecy_causal_link:fire"],
    });
  }

  // 4. 第12章结局注脚：若预言链已闭合，在结局文本里加一行
  // 这里用 tag 标记，实际文本在 resolveEnding 里注入
  // (resolveEnding 已经读 state.tags，所以直接在这里定义好 tag 名称即可)
}
