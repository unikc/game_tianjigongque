import { describe, expect, it } from "vitest";
import {
  delayedConsequences,
  delayedConsequenceSeverity,
  delayedConsequenceStatus,
  isDelayedConsequenceReady,
  readyDelayedConsequences,
} from "../src/game/state/delayed-consequences";
import { sideStories } from "../src/game/content/side-stories";
import { createGame } from "../src/game/state/engine";
import type { ChapterId } from "../src/game/types";

const chapters = (count: number) =>
  Array.from(
    { length: count },
    (_, index) => `chapter-${index + 1}` as ChapterId,
  );

describe("delayed consequences", () => {
  it("requires a known cause, hostile relation and elapsed chapters", () => {
    const definition = delayedConsequences.find(
      (item) => item.id === "gu-public-humiliation",
    )!;
    const state = createGame("清和", "scholar", 1);
    expect(delayedConsequenceStatus(state, definition)).toBe("dormant");

    state.tags.push("day3_gu_accused");
    state.relations.顾明华 = -40;
    state.completedChapters = chapters(3);
    expect(delayedConsequenceStatus(state, definition)).toBe("waiting");

    state.completedChapters = chapters(5);
    expect(delayedConsequenceStatus(state, definition)).toBe("ready");
  });

  it("does not infer a grievance from hostility alone", () => {
    const state = createGame("清和", "scholar", 1);
    state.completedChapters = chapters(12);
    state.relations.顾明华 = -100;
    expect(isDelayedConsequenceReady(state, "gu-public-humiliation")).toBe(
      false,
    );
  });

  it("never derives revenge knowledge from seeded hidden truths", () => {
    const first = createGame("清和", "scholar", 1);
    const second = createGame("清和", "scholar", 9876);
    for (const state of [first, second]) {
      state.completedChapters = chapters(6);
      state.relations.顾明华 = -40;
      state.tags.push("day3_gu_accused");
    }
    first.tags.push("truth:arsonPatron:royal", "truth:wenLoyalty:honest");
    second.tags.push(
      "truth:arsonPatron:dowager",
      "truth:wenLoyalty:compromised",
    );
    expect(readyDelayedConsequences(first).map((item) => item.id)).toEqual(
      readyDelayedConsequences(second).map((item) => item.id),
    );
  });

  it("resolves a consequence with an explicit response memory", () => {
    const state = createGame("清和", "scholar", 1);
    state.completedChapters = chapters(6);
    state.tags.push("day3_gu_accused");
    state.relations.顾明华 = -40;
    expect(isDelayedConsequenceReady(state, "gu-public-humiliation")).toBe(
      true,
    );
    state.tags.push("revenge_answered:gu-public-humiliation");
    expect(isDelayedConsequenceReady(state, "gu-public-humiliation")).toBe(
      false,
    );
  });

  it("defines multiple targets and at least three responses per grievance", () => {
    expect(delayedConsequences).toHaveLength(3);
    expect(
      new Set(delayedConsequences.map((item) => item.target.kind)).size,
    ).toBe(3);
    delayedConsequences.forEach((item) => {
      expect(item.responses.length).toBeGreaterThanOrEqual(3);
      expect(item.causes[0].label).not.toBe("");
      expect(item.knowledge[0].label).not.toBe("");
    });
  });

  it("defuses dead actors and explicitly repaired grievances", () => {
    const gao = delayedConsequences.find(
      (item) => item.id === "gao-copy-changes-hands",
    )!;
    const state = createGame("清和", "scholar", 1);
    state.completedChapters = chapters(9);
    state.tags.push("empty_seal_queen");
    state.relations.高福安 = -20;
    expect(delayedConsequenceStatus(state, gao)).toBe("ready");
    state.tags.push("ch9_gao_dead");
    expect(delayedConsequenceStatus(state, gao)).toBe("defused");
  });

  it("lets a later grievance survive an earlier reconciliation", () => {
    const gu = delayedConsequences.find(
      (item) => item.id === "gu-public-humiliation",
    )!;
    const pei = delayedConsequences.find(
      (item) => item.id === "pei-private-order-refused",
    )!;
    const state = createGame("清和", "scholar", 1);
    state.completedChapters = chapters(10);
    state.relations.顾明华 = -40;
    state.tags.push("day3_gu_accused", "ch6_gu_placated", "ch8_side_queen");
    expect(delayedConsequenceStatus(state, gu)).toBe("ready");
    expect(delayedConsequenceSeverity(state, gu)).toBe("grudge");

    state.tags.push(
      "day4_pei_alienated",
      "ch6_legacy_pei_credit",
      "ch7_pei_removed",
    );
    expect(delayedConsequenceStatus(state, pei)).toBe("ready");
  });

  it("makes every Gao response carry a cost or lasting responsibility", () => {
    const story = sideStories.find(
      (item) => item.id === "gao-copy-changes-hands",
    )!;
    const signed = story.choices.find(
      (choice) => choice.id === "gao_copy_protect_clerks",
    )!;
    expect(signed.effect.stats?.名望).toBeUndefined();
    expect(signed.effect.tags).toContain("liability:empty_seal_signed_archive");
    expect(
      story.choices.every(
        (choice) =>
          Boolean(choice.requiresStat) ||
          Boolean(choice.effect.stats?.名望 && choice.effect.stats.名望 < 0) ||
          choice.effect.tags?.some((tag) => tag.startsWith("liability:")),
      ),
    ).toBe(true);
  });
});
