import { describe, expect, it } from "vitest";
import { createGame } from "../src/game/state/engine";
import {
  canObserveMemory,
  deriveNarrativeMemories,
  deriveStrategyProfile,
  observedNarrativeMemories,
  strategyModes,
} from "../src/game/state/narrative-memory";

describe("narrative memory and observed methods", () => {
  it("derives all five methods from stable choice memories", () => {
    const state = createGame("清和", "scholar", 41);
    state.history.push(
      "day2_restore_name",
      "day2_trust_gu",
      "day3_save_lin",
      "day3_guard_lin",
      "day4_set_bait",
      "day4_trust_pei",
      "day4_send_queen",
    );
    const profile = deriveStrategyProfile(state);
    expect(profile.map((entry) => entry.mode)).toEqual(
      Object.keys(strategyModes),
    );
    expect(profile.every((entry) => entry.count > 0)).toBe(true);
    expect(profile.filter((entry) => entry.formed).length).toBeGreaterThan(1);
  });

  it("deduplicates multiple source tags into one stable memory", () => {
    const state = createGame("留痕", "scholar", 42);
    state.history.push("day4_set_bait");
    state.tags.push("day4_bait_set", "day4_forgery_complicit");
    const memories = deriveNarrativeMemories(state).filter(
      (memory) => memory.id === "blank-seal-bait-order",
    );
    expect(memories).toHaveLength(1);
    expect(memories[0].strategies).toEqual(["leverage", "command"]);
  });

  it("never guesses a named choice from ambiguous result tags", () => {
    const state = createGame("旧档", "scholar", 49);
    state.tags.push(
      "observes_before_acting",
      "day2_kept_evidence",
      "day2_outsider_hand",
    );
    const ids = deriveNarrativeMemories(state).map((memory) => memory.id);
    expect(ids).not.toContain("entry-watch-before-speaking");
    expect(ids).not.toContain("seat-register-restored");
    expect(ids).not.toContain("seat-register-fiber-trace");
  });

  it("keeps private observations away from the court and NPCs", () => {
    const state = createGame("静观", "scholar", 43);
    state.history.push("day2_rabbit_trace");
    const memory = deriveNarrativeMemories(state)[0];
    expect(memory.visibility).toBe("private");
    expect(canObserveMemory(memory, "self")).toBe(true);
    expect(canObserveMemory(memory, "court")).toBe(false);
    expect(canObserveMemory(memory, "顾明华")).toBe(false);
  });

  it("limits actor memories to named witnesses and shares public memories", () => {
    const state = createGame("见证", "scholar", 44);
    state.history.push("day2_trust_gu", "day2_rank_access");
    expect(
      observedNarrativeMemories(state, "顾明华").map((memory) => memory.id),
    ).toEqual(
      expect.arrayContaining(["gu-quiet-bargain", "seat-register-open-table"]),
    );
    expect(
      observedNarrativeMemories(state, "温疏雨").map((memory) => memory.id),
    ).toEqual(["seat-register-open-table"]);
  });

  it("keeps court records collective without making every NPC omniscient", () => {
    const state = createGame("内廷", "scholar", 50);
    state.history.push("day3_seal_room");
    expect(observedNarrativeMemories(state, "court")).toHaveLength(1);
    expect(observedNarrativeMemories(state, "顾明华")).toHaveLength(0);
    expect(observedNarrativeMemories(state, "温疏雨")).toHaveLength(1);
  });

  it("tracks resolved and superseded memories without erasing history", () => {
    const state = createGame("旧事", "scholar", 45);
    state.history.push("day2_trust_gu", "day4_keep_seal");
    state.tags.push("day3_gu_accused", "empty_seal_burned");
    const statuses = Object.fromEntries(
      deriveNarrativeMemories(state).map((memory) => [
        memory.id,
        memory.status,
      ]),
    );
    expect(statuses["gu-quiet-bargain"]).toBe("superseded");
    expect(statuses["blank-seal-held"]).toBe("resolved");
  });

  it("caps method counts, ignores unknown tags and replays deterministically", () => {
    const state = createGame("重演", "scholar", 46);
    state.history.push(
      "day2_restore_name",
      "day2_rabbit_trace",
      "day2_rank_access",
      "day2_split_task",
      "day3_seal_room",
      "unknown_old_choice",
    );
    state.tags.push("unknown:legacy:tag");
    const first = deriveStrategyProfile(state);
    const second = deriveStrategyProfile(structuredClone(state));
    expect(first).toEqual(second);
    expect(first.find((entry) => entry.mode === "procedure")?.count).toBe(3);
    expect(
      deriveNarrativeMemories(state).some((memory) =>
        memory.id.includes("unknown"),
      ),
    ).toBe(false);
  });

  it("never reads seeded hidden truths as an observed method", () => {
    const first = createGame("甲", "scholar", 47);
    const second = createGame("乙", "scholar", 48);
    first.tags.push("truth:arsonPatron:royal", "truth:wenLoyalty:honest");
    second.tags.push(
      "truth:arsonPatron:dowager",
      "truth:wenLoyalty:compromised",
    );
    expect(deriveStrategyProfile(first)).toEqual(deriveStrategyProfile(second));
  });
});
