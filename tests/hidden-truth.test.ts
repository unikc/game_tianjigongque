import { describe, expect, it } from "vitest";
import { laterScenes } from "../src/game/content/later-scenes";
import { isChoiceAvailable } from "../src/game/state/availability";
import { createGame } from "../src/game/state/engine";
import { deriveTruths } from "../src/game/state/hidden-truth";
import type { GameState } from "../src/game/types";

/**
 * 隐藏真相系统的回归测试。
 *
 * 这套机制最容易坏的地方是"分布退化"——某个真相在实际种子空间里
 * 几乎不出现，于是那条剧情线等于死代码，而类型系统和普通枚举测试
 * 都发现不了。所以这里既测确定性，也测分布。
 */

const seeded = (seed: number): GameState =>
  createGame("巡检", "scholar", seed, "rabbit");

const canPick = (state: GameState, sceneId: string, choiceId: string) => {
  const c = laterScenes[sceneId]?.choices.find((x) => x.id === choiceId);
  if (!c) throw new Error(`choice missing: ${sceneId}/${choiceId}`);
  return isChoiceAvailable(state, c);
};

describe("隐藏真相", () => {
  it("同一种子永远推导出同一组真相", () => {
    for (const seed of [1, 7, 42, 205, 99991]) {
      expect(deriveTruths(seed)).toEqual(deriveTruths(seed));
    }
  });

  it("三种真相彼此独立，十二种世界组合都能出现", () => {
    const pairs = new Set<string>();
    for (let seed = 1; seed <= 1200; seed += 1) {
      const t = deriveTruths(seed);
      pairs.add(`${t.wenLoyalty}|${t.arsonPatron}|${t.leakLink}`);
    }
    expect(pairs.size).toBe(12);
  });

  it("两种真相在种子空间里都足够常见，不存在死剧情线", () => {
    let compromised = 0;
    let dowager = 0;
    const leakCounts = new Map<string, number>();
    const N = 600;
    for (let seed = 1; seed <= N; seed += 1) {
      const t = deriveTruths(seed);
      if (t.wenLoyalty === "compromised") compromised += 1;
      if (t.arsonPatron === "dowager") dowager += 1;
      leakCounts.set(t.leakLink, (leakCounts.get(t.leakLink) ?? 0) + 1);
    }
    // 每条线至少要占到一成，否则玩家几生几世遇不到
    expect(compromised / N).toBeGreaterThan(0.1);
    expect(dowager / N).toBeGreaterThan(0.1);
    expect(leakCounts.size).toBe(3);
    for (const count of leakCounts.values()) {
      expect(count / N).toBeGreaterThan(0.1);
    }
  });

  it("第8日：同样救下温疏雨，她是否干净决定了两个不同结果", () => {
    const honest = [1, 2, 4, 5].find(
      (s) => deriveTruths(s).wenLoyalty === "honest",
    )!;
    const dirty = [3, 6, 9, 12, 15].find(
      (s) => deriveTruths(s).wenLoyalty === "compromised",
    )!;

    const a = seeded(honest);
    a.tags = ["ch5_legacy_wen_saved"];
    expect(canPick(a, "day8_1", "day8_1_4")).toBe(true); // 她清白，作证成立
    expect(canPick(a, "day8_1", "day8_1_5")).toBe(false); // 伪证线不出现

    const b = seeded(dirty);
    b.tags = ["ch5_legacy_wen_saved"];
    expect(canPick(b, "day8_1", "day8_1_4")).toBe(false);
    expect(canPick(b, "day8_1", "day8_1_5")).toBe(true); // 反转：她把你拖进伪证
  });

  it("查清真相的玩家，即使她不干净也有一条可控的路", () => {
    const dirty = [3, 6, 9, 12, 15].find(
      (s) => deriveTruths(s).wenLoyalty === "compromised",
    )!;
    const s = seeded(dirty);
    s.tags = ["ch5_legacy_wen_saved"];
    expect(canPick(s, "day8_1", "day8_1_6")).toBe(false); // 没查过，没有这条路
    s.tags = ["ch5_legacy_wen_saved", "known_wen_truth"];
    expect(canPick(s, "day8_1", "day8_1_6")).toBe(true); // 查过了，可以控制证词
  });

  it("第9日：并案指认宗室，猜对与猜错各自成立且互斥", () => {
    const royal = [1, 2, 3, 4, 5].find(
      (s) => deriveTruths(s).arsonPatron === "royal",
    )!;
    const dowager = [1, 2, 3, 4, 5, 6].find(
      (s) => deriveTruths(s).arsonPatron === "dowager",
    )!;

    const a = seeded(royal);
    a.tags = ["ch9_arsonist_caught"];
    expect(canPick(a, "day9_3", "day9_3_4")).toBe(true);
    expect(canPick(a, "day9_3", "day9_3_5")).toBe(false);

    const b = seeded(dowager);
    b.tags = ["ch9_arsonist_caught"];
    expect(canPick(b, "day9_3", "day9_3_4")).toBe(false);
    expect(canPick(b, "day9_3", "day9_3_5")).toBe(true); // 指错人，但剧情继续
  });

  it("猜错不是死路：谨慎路线在任何真相下都可选", () => {
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const s = seeded(seed);
      s.tags = ["ch9_arsonist_caught"];
      expect(canPick(s, "day9_3", "day9_3_6")).toBe(true);
    }
  });

  it("第9日在任何真相下都至少有两个可选项", () => {
    for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 42, 205]) {
      const s = seeded(seed);
      s.tags = ["ch9_arsonist_caught", "ch9_witnesses_saved"];
      const n = laterScenes.day9_3.choices.filter((c) =>
        isChoiceAvailable(s, c),
      ).length;
      expect(n, `seed ${seed}`).toBeGreaterThanOrEqual(2);
    }
  });
});
