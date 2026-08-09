import { describe, expect, it } from "vitest";
import { relationshipProfiles, relationKeys } from "../src/game/relationships";
import {
  createGame,
  deserialize,
  isRelationshipAvailable,
  performPalaceAction,
} from "../src/game/state/engine";

describe("relationship registry", () => {
  it("gives every registered court character a visible relationship state", () => {
    const state = createGame("清和", "scholar", 1);
    expect(Object.keys(state.relations).sort()).toEqual(
      [...relationKeys].sort(),
    );
    expect(Object.keys(state.relationshipStrain).sort()).toEqual(
      [...relationKeys].sort(),
    );
    for (const key of relationKeys) {
      expect(relationshipProfiles[key].label).not.toBe("");
      expect(state.relations[key]).toBe(relationshipProfiles[key].initialValue);
    }
  });

  it("adds newly registered relationships to older saves without exposing them early", () => {
    const migrated = deserialize(
      JSON.stringify({
        version: 8,
        name: "旧局",
        origin: "scholar",
        zodiac: "rabbit",
        sceneId: "",
        relations: { 沈令仪: 20, 顾明华: -10, 高福安: 0 },
      }),
    );
    expect(migrated?.relations).toMatchObject({
      崔氏: 0,
      谢明微: 0,
      沈令仪: 20,
      顾明华: -10,
      高福安: 0,
      林栖梧: 0,
      温疏雨: 0,
      裴照南: 0,
    });
    expect(relationshipProfiles.崔氏.knownAfter).toBeGreaterThan(0);
    expect(relationshipProfiles.谢明微.knownAfter).toBeGreaterThan(0);
    expect(relationshipProfiles.林栖梧.knownAfter).toBeGreaterThan(0);
    expect(relationshipProfiles.温疏雨.knownAfter).toBeGreaterThan(
      relationshipProfiles.林栖梧.knownAfter,
    );
  });

  it("does not spend routine relationship actions on unknown or dead people", () => {
    const state = createGame("清和", "scholar", 1);
    state.actionPoints = 1;
    state.stats.银钱 = 2;
    state.relations.沈令仪 = 30;
    state.relations.顾明华 = 20;
    state.relations.高福安 = 10;
    expect(isRelationshipAvailable(state, "林栖梧")).toBe(false);
    const next = performPalaceAction(state, "network");
    expect(next.relations.高福安).toBe(20);
    expect(next.relations.林栖梧).toBe(0);
  });
});
