import { describe, expect, it } from "vitest";
import { scenes } from "../src/game/content/scenes";
import { createGame } from "../src/game/state/engine";
import { evaluatePlayerRegency } from "../src/game/state/political-legitimacy";
import {
  buildXieReviewScene,
  deriveXieLearnedModes,
  deriveXieObservations,
  xieAdaptiveCopy,
} from "../src/game/state/xie-mingwei";

function withHistory(...history: string[]) {
  const state = createGame("清和", "scholar", 808);
  state.history = history;
  return state;
}

describe("Xie Mingwei adaptive rival", () => {
  it("never learns private, actor-only, or unreviewed court memories", () => {
    const state = withHistory(
      "day2_rabbit_trace",
      "day2_trust_gu",
      "day3_seal_room",
      "day4_set_bait",
    );
    expect(deriveXieObservations(state)).toEqual([]);
    expect(deriveXieLearnedModes(state)).toEqual([]);
  });

  it("records only explicitly reviewable official and public memories", () => {
    const state = withHistory("day4_seize_ledger", "day5_3_2", "day6_1_3");
    expect(deriveXieObservations(state).map((entry) => entry.channel)).toEqual([
      "official-record",
      "official-record",
      "public-record",
    ]);
  });

  it("requires two distinct observations, caps active adaptations at two, and is deterministic", () => {
    const one = withHistory("day4_seize_ledger");
    expect(deriveXieLearnedModes(one)).toEqual([]);
    const many = withHistory(
      "day4_seize_ledger",
      "day5_3_2",
      "day5_3_3",
      "day6_1_3",
      "day6_3_1",
    );
    const first = deriveXieLearnedModes(many);
    many.seed = 2147483000;
    expect(first).toHaveLength(2);
    expect(deriveXieLearnedModes(many)).toEqual(first);
    expect(xieAdaptiveCopy(many)).toHaveLength(2);
  });

  it("changes the review response without removing any path", () => {
    const state = withHistory("day4_seize_ledger", "day5_3_3");
    const scene = buildXieReviewScene(state);
    expect(scene.choices).toHaveLength(4);
    expect(scene.choices.every((choice) => choice.next === "day8_3")).toBe(
      true,
    );
    expect(
      scene.choices.some((choice) =>
        choice.effect.tags?.includes("xie:countered:procedure"),
      ),
    ).toBe(true);
    expect(scene.choices[0].effect.stats?.体力).toBe(-2);
    expect(scene.choices[0].outcome).toContain("两轮复核");
  });

  it("gives every review route a distinct permanent tradeoff", () => {
    const tags = buildXieReviewScene(
      withHistory("day4_seize_ledger", "day5_3_3"),
    ).choices.map((choice) => choice.effect.tags?.[0]);
    expect(new Set(tags).size).toBe(4);
    expect(tags).toEqual(
      expect.arrayContaining([
        "xie:dissent-attached",
        "xie:testimony-scope-narrow",
        "xie:player-authored-emergency-record",
        "xie:parallel-dissent-records",
      ]),
    );
    const parallel = buildXieReviewScene(withHistory()).choices[3];
    expect(parallel.effect.relations).toMatchObject({
      沈令仪: -1,
      顾明华: -1,
    });
  });

  it("anchors adaptive feedback in named official records", () => {
    const state = withHistory("day4_seize_ledger", "day5_3_3");
    expect(xieAdaptiveCopy(state)[0]).toContain("《雨夜军粮册》");
    expect(xieAdaptiveCopy(state)[0]).toContain("《赈账入案》");
    expect(xieAdaptiveCopy(state)[0].split("。")).toHaveLength(2);
  });

  it("routes chapter eight through the review and preserves chapter ten authority boundaries", () => {
    expect(
      scenes.day8_2.choices.every(
        (choice) => choice.next === "day8_xie_review",
      ),
    ).toBe(true);
    const state = withHistory(
      "day4_seize_ledger",
      "day5_3_3",
      "day8_xie_source_review",
      "day10_2_1",
    );
    state.tags.push("xie:source-reviewed", "xie:dissent-attached");
    expect(evaluatePlayerRegency(state).accepted).toBe(false);
    expect(scenes.day10_2.text).toContain("不能替下一张命令找来服从");
  });
});
