/**
 * 天机谶语的兑现层。
 *
 * 谶语本身不给答案——它给的是一个**观察窗口**。这个文件负责把那扇窗
 * 装到真正会发生事情的章节里：
 *
 *   tianji_hint:ledger-ink   →  第5章：比对正月脉案的墨色
 *   tianji_hint:fire-salvage →  第9章：火后先数哪一卷完好
 *   tianji_excluded:*        →  第9章：三札分路时已知一段是干净的
 *
 * 三者的共同结构：
 *   1. 谶语只解锁**动作**，不解锁**结论**。玩家仍要去看、去数、去试。
 *   2. 看完之后得到的是既有的 `known_*` 标签——天机阁不发明新的知识体系，
 *      它只是通往同一套知识的第二条路。
 *   3. 这条路的代价是一件私密往事，另一条路的代价是修习属性。
 *      两条路都不免费，也都不比对方优越。
 *
 * 为什么要有第二条路：改造前，「确定性」这件商品只卖给才学高的玩家。
 * 走人情或胆识路线的玩家，无论多用心，都只能一路靠猜。
 * 天机阁给了她们一个**用别的东西付账**的机会。
 */

import type { Scene } from "../types";

export function applyTianjiPayoff(laterScenes: Record<string, Scene>) {
  const at = (sceneId: string): Scene | undefined => laterScenes[sceneId];

  // --------------------------------------------------------------------------
  // 第5章 · 问医的兑现
  //
  // 既有的 known_wen_truth 需要才学 5。这里是同一个终点的另一条路：
  // 你不需要读得懂脉案，你只需要在第4章问过、并且付了价。
  // --------------------------------------------------------------------------
  const day5 = at("day5_2c");
  if (day5) {
    day5.choices.push({
      id: "day5_2c_tianji",
      text: "【天机】按阁中所指，只看正月那几页的墨色。",
      outcome:
        "你不必读懂脉理，只要把纸举到光下。正月的墨在第三页中途换过一次——" +
        "或者没有。你看清了是哪一种，也因此知道了她那句话里，哪一半是真的。\n\n" +
        "阁主没有告诉你答案。她只告诉你该看哪里，剩下的是你自己看见的。",
      effect: {
        stats: { 谋略: 1 },
        tags: ["known_wen_truth", "known_via_tianji"],
      },
      next: "day5_3",
      requiresTag: "tianji_hint:ledger-ink",
      // 才学够高的玩家已经有 day5_2c_4，这里不重复给。
      excludesTag: "known_wen_truth",
    });
  }

  // --------------------------------------------------------------------------
  // 第9章 · 问火的兑现
  //
  // 既有的三条并案路线要么赌对、要么赌错、要么慢慢查钱。
  // 谶语给出第四条：先数卷，再决定并不并案。
  // 它不直接给出主使，而是给出**一个可靠的观察**，玩家据此自行判断。
  // --------------------------------------------------------------------------
  const day9 = at("day9_3");
  if (day9) {
    day9.choices.push({
      id: "day9_3_tianji",
      text: "【天机】先不问人，先数卷：看火后哪一卷是完好的。",
      outcome:
        "你让人把抢出来的册子按类分开摆在阶上。脉案与兵册各占一边，" +
        "其中一边整齐得不像刚从火里出来。\n\n" +
        "怕丢兵册的是宗室，怕丢脉案的是崔氏门下。你现在知道那一夜谁在场了——" +
        "但你仍然不知道，是那一家的谁下的令。",
      effect: {
        stats: { 谋略: 1, 才学: 1 },
        tags: [
          "ch9_patron_confirmed",
          "known_via_tianji",
          "ch9_salvage_counted",
        ],
      },
      next: "day9_result",
      requiresTag: "tianji_hint:fire-salvage",
    });
  }
}

/**
 * 第9章三札分路：谶语划掉的那一段。
 *
 * 由 `buildLeakReturnScene` 在运行时调用——排除信息必须体现在
 * **选项本身**上，而不是另加一个选项，否则玩家会以为多了一条路，
 * 而实际上是少了一条错路。
 */
export function tianjiExcludedLink(tags: string[]): string | undefined {
  return tags
    .find((tag) => tag.startsWith("tianji_excluded:"))
    ?.slice("tianji_excluded:".length);
}
