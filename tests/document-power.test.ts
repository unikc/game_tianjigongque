import { describe, expect, it } from "vitest";
import { createGame, completeChapter } from "../src/game/state/engine";
import { deriveDocumentFootprint } from "../src/game/state/document-power";

describe("document power footprint", () => {
  it("derives document contact without adding save state", () => {
    let state = createGame("清和", "scholar", 31);
    expect(deriveDocumentFootprint(state)).toEqual({
      entries: [],
      systemsTouched: 0,
      publicChains: 0,
      scapegoatExposure: "none",
      liabilityFlags: [],
    });
    state = completeChapter(state, "chapter-1");
    state = completeChapter(state, "chapter-2");
    const footprint = deriveDocumentFootprint(state);
    expect(
      footprint.entries.find((entry) => entry.id === "seat-register"),
    ).toMatchObject({ stages: ["possessed"] });
    expect("documentFootprint" in state).toBe(false);
  });

  it("tracks public chains without revealing seeded truths", () => {
    const state = createGame("执笔", "merchant", 32);
    state.tags.push(
      "ch5_truth_public",
      "ch6_public_accounts",
      "ch8_demand_ledger",
      "ch8_truth_public",
      "ch10_pearl_proof",
    );
    const footprint = deriveDocumentFootprint(state);
    expect(footprint.systemsTouched).toBe(4);
    expect(footprint.publicChains).toBe(2);
    expect(footprint.scapegoatExposure).toBe("emerging");
    expect(JSON.stringify(footprint)).not.toContain("arsonPatron");
    expect(JSON.stringify(footprint)).not.toContain("wenLoyalty");
  });

  it("does not treat scene or choice identifiers as completed evidence events", () => {
    const state = createGame("未成之事", "scholar", 36);
    state.tags.push("day2_register", "day4_check_archive");
    expect(deriveDocumentFootprint(state).entries).toEqual([]);
  });

  it("distinguishes a blank-seal rubbing from control of the original", () => {
    const base = completeChapter(
      completeChapter(
        completeChapter(
          completeChapter(createGame("印证", "scholar", 37), "chapter-1"),
          "chapter-2",
        ),
        "chapter-3",
      ),
      "chapter-4",
    );
    expect(base.rewards.map((reward) => reward.id)).toContain(
      "item-empty-seal",
    );
    expect(
      deriveDocumentFootprint(base).entries.find(
        (entry) => entry.id === "blank-seal",
      ),
    ).toBeUndefined();

    const held = { ...base, tags: [...base.tags, "empty_seal_player"] };
    expect(
      deriveDocumentFootprint(held).entries.find(
        (entry) => entry.id === "blank-seal",
      )?.stages,
    ).toContain("possessed");

    const burned = { ...base, tags: [...base.tags, "empty_seal_burned"] };
    expect(
      deriveDocumentFootprint(burned).entries.find(
        (entry) => entry.id === "blank-seal",
      )?.stages,
    ).toEqual(["destroyed"]);
  });

  it("keeps public centrality separate from attributable risky acts", () => {
    const reformer = createGame("明账", "scholar", 34);
    reformer.tags.push(
      "day2_kept_evidence",
      "ch5_truth_public",
      "ch6_public_accounts",
      "ch7_order_captured",
      "ch8_demand_ledger",
      "ch10_pearl_proof",
      "ch11_gate_informed_public",
    );
    expect(deriveDocumentFootprint(reformer)).toMatchObject({
      scapegoatExposure: "central",
      liabilityFlags: [],
    });

    const forger = createGame("借印", "scholar", 35);
    forger.tags.push("day4_forgery_complicit", "ch11_counterfeit_retreat");
    const risky = deriveDocumentFootprint(forger);
    expect(risky.publicChains).toBe(0);
    expect(risky.liabilityFlags).toEqual([
      "day4_forgery_complicit",
      "ch11_counterfeit_retreat",
    ]);
  });

  it("registers signed delayed-consequence liability in the document footprint", () => {
    const state = createGame("署名", "scholar", 38);
    state.tags.push("liability:empty_seal_signed_archive");
    expect(deriveDocumentFootprint(state).liabilityFlags).toEqual([
      "liability:empty_seal_signed_archive",
    ]);
  });

  it("makes accumulated document centrality a deterministic future hook", () => {
    const state = createGame("总录", "general", 33);
    state.tags.push(
      "knows_register_forger",
      "ch5_truth_public",
      "ch6_public_accounts",
      "ch7_order_captured",
      "ch8_truth_public",
      "ch10_pearl_proof",
      "ch11_public_trial",
    );
    const first = deriveDocumentFootprint(state);
    const second = deriveDocumentFootprint(state);
    expect(first).toEqual(second);
    expect(first.systemsTouched).toBeGreaterThanOrEqual(5);
    expect(first.scapegoatExposure).toBe("central");
  });
});
