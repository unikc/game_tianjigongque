import { describe, expect, it } from "vitest";
import { scenes } from "../src/game/content/scenes";
import { applyEffect, createGame } from "../src/game/state/engine";
import {
  evaluatePlayerRegency,
  resolveLegitimacyTransition,
} from "../src/game/state/political-legitimacy";

function withHistory(...history: string[]) {
  const state = createGame("清和", "scholar", 808);
  state.history = history;
  return state;
}

describe("contextual political legitimacy", () => {
  it.each([
    ["旧例与共署", ["day8_1_growth", "day10_1_2"]],
    ["公议与自限", ["day8_3_3", "day10_1_1"]],
    ["共管与让步", ["day8_3_1", "day8_2_2"]],
  ])("accepts the named %s package", (label, history) => {
    const result = evaluatePlayerRegency(withHistory(...history));
    expect(result.accepted).toBe(true);
    expect(result.acceptedAlternative?.label).toBe(label);
  });

  it("keeps evidence and vacancy facts separate from authority", () => {
    const result = evaluatePlayerRegency(withHistory("day10_2_1", "day10_2_3"));
    expect(result.accepted).toBe(false);
    expect(result.bases).toHaveLength(0);
    expect(result.facts.map((fact) => fact.id)).toEqual([
      "false-order-proven",
      "vacancy-witnessed",
    ]);
  });

  it("never converts favor, trust, rank or the claim itself into authority", () => {
    const state = withHistory("day10_3_1");
    state.emperor = { favor: 100, trust: 100 };
    state.rank = "皇贵妃";
    state.tags.push("ch10_player_regent_claim", "ch10_pearl_proof");
    expect(evaluatePlayerRegency(state).accepted).toBe(false);
  });

  it("rejects a public-council basis for a personal claim", () => {
    const result = evaluatePlayerRegency(withHistory("day10_1_3", "day10_1_1"));
    expect(
      result.bases.some((basis) => basis.id === "public-council-procedure"),
    ).toBe(true);
    expect(result.accepted).toBe(false);
  });

  it("maps the women-council procedure to its actual choice, not Gu's ascent", () => {
    expect(
      evaluatePlayerRegency(withHistory("day8_3_2")).bases.some(
        (basis) => basis.id === "women-council-procedure",
      ),
    ).toBe(false);
    expect(
      evaluatePlayerRegency(withHistory("day8_3_3")).bases.some(
        (basis) => basis.id === "women-council-procedure",
      ),
    ).toBe(true);
  });

  it("redirects an unsupported personal signature to a recoverable veto", () => {
    const choice = scenes.day10_3.choices.find(
      (candidate) => candidate.id === "day10_3_1",
    )!;
    const state = withHistory("day10_2_1");
    const claimed = applyEffect(state, choice.effect, choice.id, choice.next);
    const next = resolveLegitimacyTransition(claimed, choice.id);
    expect(next.sceneId).toBe("day10_legitimacy_veto");
    expect(choice.outcome).not.toContain("宫门没有失守");
    expect(scenes.day10_legitimacy_veto.choices.map((item) => item.id)).toEqual(
      ["day10_veto_dual", "day10_veto_public", "day10_veto_limited"],
    );
  });

  it("records the accepted package without changing the deterministic seed", () => {
    const choice = scenes.day10_3.choices.find(
      (candidate) => candidate.id === "day10_3_1",
    )!;
    const state = withHistory("day8_1_growth", "day10_1_2");
    const next = resolveLegitimacyTransition(
      applyEffect(state, choice.effect, choice.id, choice.next),
      choice.id,
    );
    expect(next.sceneId).toBe("day10_result");
    expect(next.seed).toBe(808);
    expect(next.tags).toEqual(
      expect.arrayContaining([
        "ch10_player_regent",
        "legitimacy:regency:precedent-and-coalition",
      ]),
    );
  });

  it("is deterministic and ignores unknown legacy history", () => {
    const state = withHistory("day8_3_1", "day8_2_2", "unknown_old_choice");
    expect(evaluatePlayerRegency(state)).toEqual(
      evaluatePlayerRegency(structuredClone(state)),
    );
  });
});
