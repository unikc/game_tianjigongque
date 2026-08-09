import { describe, expect, it } from "vitest";
import { scenes } from "../src/game/content/scenes";
import { isChoiceAvailable } from "../src/game/state/availability";
import {
  cuiAcceptanceCopy,
  cuiMemoryCallback,
  deriveCuiKnowledge,
  deriveCuiResponsibility,
} from "../src/game/state/dowager-cui";
import { createGame } from "../src/game/state/engine";

function withHistory(...history: string[]) {
  const state = createGame("清和", "scholar", 808);
  state.history = history;
  return state;
}

describe("Empress Dowager Cui continuity", () => {
  it("knows only witnessed or formally reported choices, independent of seed truth", () => {
    const first = withHistory("day5_3_3", "day6_3_1");
    const second = withHistory("day5_3_3", "day6_3_1");
    first.seed = 1;
    second.seed = 2147483000;
    first.tags.push("arsonPatron:dowager", "ch6_bank_trail");
    expect(deriveCuiKnowledge(first)).toEqual(deriveCuiKnowledge(second));
    expect(cuiMemoryCallback(first)).toBe(cuiMemoryCallback(second));
  });

  it("does not turn private trails into Cui knowledge", () => {
    const state = withHistory("day6_2a_1");
    state.tags.push("ch6_bank_trail", "arsonPatron:dowager");
    expect(deriveCuiKnowledge(state)).toEqual([]);
    expect(cuiMemoryCallback(state)).toBeNull();
  });

  it("remembers three public precedents distinctly", () => {
    expect(cuiMemoryCallback(withHistory("day5_3_1"))).toContain("退路");
    expect(cuiMemoryCallback(withHistory("day6_1_3"))).toContain("满朝");
    expect(cuiMemoryCallback(withHistory("day5_3_3", "day6_3_1"))).toContain(
      "问罪与办事",
    );
    expect(
      cuiMemoryCallback(withHistory("day5_3_3", "day6_3_1")),
    ).not.toContain("崔家");
  });

  it("gives every accepted regency package a distinct acknowledgement", () => {
    const copies = [
      "legitimacy:regency:precedent-and-coalition",
      "legitimacy:regency:public-record-and-concession",
      "legitimacy:regency:shared-duty-and-concession",
    ].map((tag) => cuiAcceptanceCopy([tag]));
    expect(new Set(copies).size).toBe(3);
    expect(copies.every(Boolean)).toBe(true);
  });

  it("moves from guarding continuity to witnessing transition", () => {
    expect(deriveCuiResponsibility(withHistory())).toBe("guards-continuity");
    expect(deriveCuiResponsibility(withHistory("day5_3_2"))).toBe(
      "permits-accountability",
    );
    const accepted = withHistory("day5_3_2");
    accepted.tags.push("cui_accepts_limited_regency");
    expect(deriveCuiResponsibility(accepted)).toBe("witnesses-transition");
  });

  it("carries limited regency into chapter eleven only when earned", () => {
    const choice = scenes.day11_1.choices.find(
      (item) => item.id === "day11_limited_regency_order",
    )!;
    expect(isChoiceAvailable(withHistory(), choice)).toBe(false);
    const limited = withHistory();
    limited.tags.push("legitimacy:regency:limited");
    expect(isChoiceAvailable(limited, choice)).toBe(true);
    expect(choice.effect.stats?.体力).toBe(-1);
    expect(choice.outcome).toContain("外门撞击");
  });

  it("presents Cui as the source-aware verifier in chapter ten", () => {
    expect(scenes.day10_2.portrait).toBe("dowager");
    expect(scenes.day10_2.text).toContain("不替它作真");
    const outcomes = scenes.day10_2.choices.map((choice) => choice.outcome);
    expect(new Set(outcomes).size).toBe(outcomes.length);
  });
});
