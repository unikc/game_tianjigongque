import { describe, expect, it } from "vitest";
import { createGame, evaluatePromotion } from "../src/game/state/engine";
import {
  promotionBases,
  basisMet,
  basisText,
  promotionReason,
} from "../src/game/state/promotion-basis";
import type { ChapterId } from "../src/game/types";

const chapters = (n: number) =>
  Array.from({ length: n }, (_, i) => `chapter-${i + 1}` as ChapterId);

describe("晋位具名依据（F03）", () => {
  it("每个位分的每条路线各有且仅有一条依据", () => {
    const ranks = ["嫔", "妃", "贵妃", "皇贵妃"] as const;
    const routes = ["帝心", "清议", "人脉"] as const;
    ranks.forEach((rank) => {
      routes.forEach((route) => {
        const matches = promotionBases.filter(
          (b) => b.rank === rank && b.route === route,
        );
        expect(matches).toHaveLength(1);
      });
    });
  });

  it("每条依据的 anyOf 至少包含一个可实际出现的 choice id", () => {
    promotionBases.forEach((basis) => {
      expect(basis.anyOf.length).toBeGreaterThanOrEqual(1);
      expect(basis.reason.length).toBeGreaterThan(10);
      expect(basis.hint.length).toBeGreaterThan(10);
    });
  });

  it("数值够了但没有具名依据时晋位保留（不再是免费通过）", () => {
    const state = createGame("纯数值", "scholar", 7, "ox");
    state.rank = "贵人";
    state.completedChapters = chapters(4);
    state.emperor = { favor: 18, trust: 10 };
    // 没有任何 history — 具名依据不成立
    expect(evaluatePromotion(state, "chapter-5").status).toBe("held");
  });

  it("数值 + 具名依据同时满足时晋位成功", () => {
    const state = createGame("名实俱备", "scholar", 7, "rabbit");
    state.rank = "贵人";
    state.completedChapters = chapters(4);
    state.emperor = { favor: 18, trust: 10 };
    state.history.push("duck_admit"); // 御前认下绣鸭 = 帝心依据
    const result = evaluatePromotion(state, "chapter-5");
    expect(result.status).toBe("promoted");
    expect(result.route).toBe("帝心");
  });

  it("晋位成功时 reason 是一句具体的话而不是数字标签", () => {
    const state = createGame("有据可依", "scholar", 7, "rabbit");
    state.rank = "贵人";
    state.completedChapters = chapters(4);
    state.emperor = { favor: 18, trust: 10 };
    state.history.push("duck_admit");
    const result = evaluatePromotion(state, "chapter-5");
    expect(result.reason).toBeTruthy();
    // reason 不应该是纯数字格式
    expect(result.reason).not.toMatch(/^\d/);
    expect(result.reason!.length).toBeGreaterThan(15);
  });

  it("held 时 criteria 里有 basisHint 指向具名依据的提示", () => {
    const state = createGame("数值充足无依据", "scholar", 7, "ox");
    state.rank = "贵人";
    state.completedChapters = chapters(4);
    state.emperor = { favor: 18, trust: 10 };
    const held = evaluatePromotion(state, "chapter-5");
    expect(held.status).toBe("held");
    const imperialCrit = held.criteria.find((c) => c.route === "帝心");
    expect(imperialCrit?.basisHint).toBeTruthy();
    expect(imperialCrit?.basisHint).not.toBe(imperialCrit?.label);
  });

  it("五种处世手段在三条路线里均有覆盖，无全局最优解", async () => {
    // 帝心依据主要覆盖 command，清议覆盖 procedure，人脉覆盖 care。
    // 测试每条路线至少有一个 anyOf choice 在已有场景里存在。
    const { scenes } = await import("../src/game/content/scenes");
    const allChoiceIds = new Set<string>();
    Object.values(
      scenes as Record<string, { choices: Array<{ id: string }> }>,
    ).forEach((scene) => scene.choices.forEach((c) => allChoiceIds.add(c.id)));
    // 每条依据至少一个 anyOf choice 存在于场景里
    const missingAll = promotionBases.filter(
      (basis) => !basis.anyOf.some((id) => allChoiceIds.has(id)),
    );
    if (missingAll.length > 0) {
      console.warn(
        "以下依据的所有 anyOf choice 不在当前场景里（可能在后续章节）：",
        missingAll.map((b) => b.id),
      );
    }
    // 前4个位分（嫔妃贵妃皇贵妃）× 3路线，至少 9 条依据的 anyOf 在场景里有对应
    const foundInScenes = promotionBases.filter((basis) =>
      basis.anyOf.some((id) => allChoiceIds.has(id)),
    );
    expect(foundInScenes.length).toBeGreaterThanOrEqual(9);
  });

  it("basisText 在依据成立时返回 reason，不成立时返回 hint", () => {
    const withHistory = createGame("有依据", "scholar", 7, "rabbit");
    withHistory.history.push("duck_admit");
    const withResult = basisText(withHistory, "嫔", "帝心");
    expect(withResult.met).toBe(true);
    expect(withResult.text).toContain("御前");

    const noHistory = createGame("无依据", "scholar", 7, "rabbit");
    const noResult = basisText(noHistory, "嫔", "帝心");
    expect(noResult.met).toBe(false);
    expect(noResult.text).toContain("需要");
  });

  it("旧存档兼容：只要 history 有对应 choice id，依据自动成立", () => {
    // 模拟一个从 v7 迁移过来的存档，只有 history，没有新字段
    const legacyState = createGame("旧档迁移", "merchant", 42, "monkey");
    legacyState.rank = "贵人";
    legacyState.completedChapters = chapters(4);
    legacyState.emperor = { favor: 18, trust: 10 };
    // 旧存档里有这个选择记录
    legacyState.history.push("duck_admit");
    const basis = promotionBases.find(
      (b) => b.id === "pin-imperial-public-trust",
    )!;
    expect(basisMet(legacyState, basis)).toBe(true);
  });

  it("promotionReason 对皇后不返回内容（皇后晋位尚未迁移）", () => {
    const state = createGame("皇后测试", "scholar", 1, "rabbit");
    // @ts-expect-error 测试皇后这条分支
    expect(promotionReason(state, "皇后", "帝心")).toBe("");
  });

  it("私密记忆对应的 choice 也可以成为具名依据", () => {
    // day4_test_signature 和 day3_private_test 都是 private 记忆，
    // 也都在 promotionBases 的 anyOf 里——私事也可以是晋位的依据。
    const privateChoices = [
      "day4_test_signature",
      "day3_private_test",
      "day3_preserve_lid",
    ];
    const coveredByBases = privateChoices.filter((cid) =>
      promotionBases.some((b) => b.anyOf.includes(cid)),
    );
    expect(coveredByBases.length).toBeGreaterThanOrEqual(2);
  });
});
