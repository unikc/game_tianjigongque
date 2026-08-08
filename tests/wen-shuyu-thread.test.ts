import { describe, expect, it } from "vitest";
import { laterScenes } from "../src/game/content/later-scenes";
import { isChoiceAvailable } from "../src/game/state/availability";
import {
  applyEffect,
  createGame,
  resolveEnding,
} from "../src/game/state/engine";
import type { GameState } from "../src/game/types";

/**
 * 温疏雨命运线的回归测试。
 *
 * 这条线跨越第5、8、9章，是验证"选择有回响"是否真的落地的最短路径：
 * 玩家在第5章赏花宴上的一个决定，会在四个月后的冷宫火场里
 * 决定一个具体的人是死是活。
 *
 * 这些断言存在的意义是防止后续改内容时把因果链改断——
 * 那种断裂在类型系统和普通枚举测试里都看不出来。
 */

function pick(state: GameState, sceneId: string, choiceId: string): GameState {
  const scene = laterScenes[sceneId];
  if (!scene) throw new Error(`场景不存在: ${sceneId}`);
  const choice = scene.choices.find((c) => c.id === choiceId);
  if (!choice) {
    throw new Error(
      `选项不存在: ${sceneId}/${choiceId}，实际有 ${scene.choices
        .map((c) => c.id)
        .join(", ")}`,
    );
  }
  if (!isChoiceAvailable(state, choice)) {
    throw new Error(`选项当前不可选: ${sceneId}/${choiceId}`);
  }
  return applyEffect(state, choice.effect, choice.id, choice.next);
}

function has(state: GameState, sceneId: string, choiceId: string): boolean {
  const choice = laterScenes[sceneId]?.choices.find((c) => c.id === choiceId);
  return !!choice && isChoiceAvailable(state, choice);
}

const start = () => {
  const s = createGame("巡检", "scholar", 205, "rabbit");
  s.sceneId = "day5_1";
  return s;
};

describe("温疏雨命运线", () => {
  it("第5章三种姿态分别走向三个不同的 beat 2", () => {
    expect(pick(start(), "day5_1", "day5_1_1").sceneId).toBe("day5_2a");
    expect(pick(start(), "day5_1", "day5_1_2").sceneId).toBe("day5_2b");
    expect(pick(start(), "day5_1", "day5_1_3").sceneId).toBe("day5_2c");
  });

  it("推她上台作证 → 才解锁公开保护她的选项", () => {
    // 走"当众核对"路线：她暴露了，可以公开保护
    const exposed = pick(start(), "day5_1", "day5_1_2");
    expect(exposed.tags).toContain("ch5_wen_exposed");
    const atBeat3 = pick(exposed, "day5_2b", "day5_2b_1");
    expect(has(atBeat3, "day5_3", "day5_3_2")).toBe(true);
    // 未暴露时该选项不可选，取而代之的是"悄悄调走"
    const quiet = pick(
      pick(start(), "day5_1", "day5_1_1"),
      "day5_2a",
      "day5_2a_1",
    );
    expect(has(quiet, "day5_3", "day5_3_2")).toBe(false);
    expect(has(quiet, "day5_3", "day5_3_4")).toBe(true);
  });

  it("保住她 → 第8章她主动作证，且第9章不会出现在冷宫", () => {
    let s = pick(start(), "day5_1", "day5_1_2");
    s = pick(s, "day5_2b", "day5_2b_1");
    s = pick(s, "day5_3", "day5_3_2"); // 公开保护温疏雨
    expect(s.tags).toContain("ch5_legacy_wen_saved");
    // 第8章：她带来自己抄留的副本
    expect(has(s, "day8_1", "day8_1_4")).toBe(true);
    // 第9章：她没有被关进冷宫，这个选项不该出现
    expect(has(s, "day9_2", "day9_2_4")).toBe(false);
  });

  it("推她上台却没保住她 → 四个月后她出现在冷宫的门后", () => {
    let s = pick(start(), "day5_1", "day5_1_2");
    s = pick(s, "day5_2b", "day5_2b_2"); // 顺势切断差事，怨恨转向她
    s = pick(s, "day5_3", "day5_3_1"); // 只安排惠嫔退养，没管她
    expect(s.tags).toContain("ch5_wen_exposed");
    expect(s.tags).not.toContain("ch5_legacy_wen_saved");
    // 这是这条线最该成立的一条：她成了冷宫里的证人之一
    expect(has(s, "day9_2", "day9_2_4")).toBe(true);
    // 而第8章她已经无法作证
    expect(has(s, "day8_1", "day8_1_4")).toBe(false);
  });

  it("从未把她推到台前 → 她既不作证也不入冷宫", () => {
    let s = pick(start(), "day5_1", "day5_1_3"); // 追查药单
    s = pick(s, "day5_2c", "day5_2c_2"); // 私下问动机
    s = pick(s, "day5_3", "day5_3_4"); // 悄悄调去行宫
    expect(s.tags).toContain("ch5_wen_hidden");
    expect(has(s, "day8_1", "day8_1_4")).toBe(false);
    expect(has(s, "day9_2", "day9_2_4")).toBe(false);
  });

  it("保住的证人在第8章开口 → 成为通往「守门之人」结局的另一条路", () => {
    const base = createGame("巡检", "scholar", 205, "rabbit");
    // 没有裴照南那条线，仅靠温疏雨作证，同样能走到守门之人
    const viaWen: GameState = {
      ...base,
      tags: ["ch12_reform", "ch8_wen_testifies"],
    };
    expect(resolveEnding(viaWen).id).toBe("gatekeeper");
    // 两条线都没有时，改革只落到「青简新章」
    const withoutWitness: GameState = { ...base, tags: ["ch12_reform"] };
    expect(resolveEnding(withoutWitness).id).toBe("jade-reform");
  });

  it("第5章每个场景在任意路径下都至少有两个可选项", () => {
    const seen = new Set<string>();
    const walk = (state: GameState, depth: number) => {
      if (depth > 4 || state.sceneId === "day5_result") return;
      const scene = laterScenes[state.sceneId];
      expect(scene, state.sceneId).toBeDefined();
      seen.add(state.sceneId);
      const available = scene.choices.filter((c) =>
        isChoiceAvailable(state, c),
      );
      expect(
        available.length,
        `${state.sceneId} 可选项不足`,
      ).toBeGreaterThanOrEqual(2);
      available.forEach((c) =>
        walk(applyEffect(state, c.effect, c.id, c.next), depth + 1),
      );
    };
    walk(start(), 0);
    // 确认三个 beat2 变体都被真实走到过，而不是死代码
    expect(seen).toContain("day5_2a");
    expect(seen).toContain("day5_2b");
    expect(seen).toContain("day5_2c");
  });
});
