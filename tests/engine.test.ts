import { describe, expect, it } from "vitest";
import { scenes } from "../src/game/content/scenes";
import { availableSideStories } from "../src/game/content/side-stories";
import { isChoiceAvailable } from "../src/game/state/availability";
import type { ChapterId } from "../src/game/types";
import {
  applyEffect,
  completeChapter,
  courtAttention,
  createGame,
  deserialize,
  evaluate,
  resolveEnding,
  resumeDestination,
  serialize,
  spendGrowthPoint,
  performPalaceAction,
  growthCost,
  evaluatePromotion,
} from "../src/game/state/engine";

describe("game engine", () => {
  it("initializes each origin's stats", () => {
    expect(createGame("甲", "scholar", 7, "rabbit").stats).toMatchObject({
      才学: 3,
      谋略: 3,
      人情: 2,
      体力: 3,
    });
    expect(createGame("乙", "merchant", 7, "monkey").stats).toMatchObject({
      才学: 2,
      胆识: 2,
      银钱: 3,
      人情: 2,
      名望: 0,
    });
    expect(createGame("丙", "general", 7, "ox").stats).toMatchObject({
      胆识: 3,
      体力: 6,
      礼仪: 1,
    });
  });
  it("applies effects and records choice", () => {
    const next = applyEffect(
      createGame("甲", "scholar", 1),
      { stats: { 胆识: 2 }, tags: ["uses_humor"] },
      "joke",
      "queen",
    );
    expect(next.stats.胆识).toBe(3);
    expect(next.history).toEqual(["joke"]);
    expect(next.tags).toContain("uses_humor");
  });
  it("bounds relationships", () => {
    let s = createGame("甲", "scholar", 1);
    s = applyEffect(s, { relations: { 沈令仪: 9, 顾明华: -9 } }, "x", "queen");
    expect(s.relations.沈令仪).toBe(90);
    expect(s.relations.顾明华).toBe(-90);
  });
  it("evaluates deterministically for a seed", () => {
    const s = createGame("甲", "merchant", 9234);
    expect(evaluate(s)).toEqual(evaluate(s));
  });
  it("requires a complete route for the highest rank", () => {
    const s = createGame("甲", "scholar", 1);
    Object.keys(s.stats).forEach(
      (k) => (s.stats[k as keyof typeof s.stats] = 6),
    );
    expect(evaluate(s).rank).not.toBe("贵人");
    s.history = ["1", "2", "3", "4", "5"];
    expect(evaluate(s).rank).toBe("贵人");
  });
  it("serializes and migrates partial old saves", () => {
    const s = createGame("清和", "general", 10);
    expect(deserialize(serialize(s))).toEqual(s);
    const migrated = deserialize(
      JSON.stringify({
        version: 1,
        name: "旧人",
        origin: "merchant",
        sceneId: "entry",
        stats: { 银钱: 4 },
        seed: 2,
      }),
    );
    expect(migrated?.version).toBe(8);
    expect(migrated?.resourcePressure).toEqual({ exhaustion: 0, arrears: 0 });
    expect(migrated?.zodiac).toBe("rabbit");
    expect(migrated?.stats.银钱).toBe(4);
    expect(migrated?.relations.高福安).toBe(0);
    expect(deserialize("broken")).toBeNull();
    const lateSave = deserialize(
      JSON.stringify({
        version: 4,
        name: "旧局晋位",
        origin: "scholar",
        rank: "贵人",
        completedChapters: [
          "chapter-1",
          "chapter-2",
          "chapter-3",
          "chapter-4",
          "chapter-5",
          "chapter-6",
          "chapter-7",
          "chapter-8",
          "chapter-9",
          "chapter-10",
          "chapter-11",
        ],
      }),
    );
    expect(lateSave?.rank).toBe("皇贵妃");
    expect(lateSave?.actionPoints).toBe(5);
  });
  it("rejects incompatible saves and clamps corrupted numeric state", () => {
    expect(
      deserialize(JSON.stringify({ name: "坏档", origin: "assassin" })),
    ).toBeNull();
    expect(
      deserialize(
        JSON.stringify({ name: "坏档", origin: "scholar", zodiac: "dragon" }),
      ),
    ).toBeNull();
    const repaired = deserialize(
      JSON.stringify({
        version: 7,
        name: "修复档",
        origin: "scholar",
        stats: { 才学: 99, 谋略: -4, 胆识: "many" },
        relationshipStrain: { 沈令仪: -3, 顾明华: 2.9 },
      }),
    );
    expect(repaired?.stats.才学).toBe(10);
    expect(repaired?.stats.谋略).toBe(0);
    expect(repaired?.stats.胆识).toBe(1);
    expect(repaired?.relationshipStrain.沈令仪).toBe(0);
    expect(repaired?.relationshipStrain.顾明华).toBe(2);
  });
  it("resumes terminal checkpoints on their result screen", () => {
    const state = createGame("续局", "scholar", 1);
    for (const sceneId of [
      "evaluation",
      "result",
      ...Array.from({ length: 11 }, (_, index) => `day${index + 2}_result`),
    ]) {
      expect(resumeDestination({ ...state, sceneId })).toBe("play");
    }
    expect(resumeDestination({ ...state, sceneId: "day7_2" })).toBe("hub");
  });
  it("grants chapter rewards once and spends growth points safely", () => {
    const initial = createGame("清和", "scholar", 10);
    const rewarded = completeChapter(initial, "chapter-1");
    expect(rewarded.completedChapters).toEqual(["chapter-1"]);
    expect(rewarded.rewards.map((reward) => reward.name)).toEqual([
      "御前初见",
      "御赐东珠",
    ]);
    expect(rewarded.growthPoints).toBe(1);
    expect(completeChapter(rewarded, "chapter-1")).toBe(rewarded);
    const grown = spendGrowthPoint(rewarded, "才学");
    expect(grown.stats.才学).toBe(rewarded.stats.才学 + 1);
    expect(grown.growthPoints).toBe(0);
    expect(spendGrowthPoint(grown, "才学")).toBe(grown);
  });
  it("gives every collected reward artwork without requiring equipment", () => {
    let state = createGame("清和", "scholar", 10);
    for (let chapter = 1; chapter <= 12; chapter += 1) {
      state = completeChapter(state, `chapter-${chapter}` as ChapterId);
    }
    expect(state.rewards.length).toBeGreaterThan(0);
    expect(state.rewards.every((reward) => Boolean(reward.asset))).toBe(true);
    expect("equippedRewardId" in state).toBe(false);
  });
  it("lets the protagonist act and build bounded imperial favor", () => {
    let state = completeChapter(createGame("清和", "scholar", 10), "chapter-1");
    const beforeFavor = state.emperor.favor;
    state = performPalaceAction(state, "attend");
    expect(state.emperor.favor).toBe(beforeFavor + 6);
    expect(state.actionPoints).toBe(4);
    state = performPalaceAction(state, "confide");
    expect(state.emperor.trust).toBe(5);
    const beforeRelations = { ...state.relations };
    state = performPalaceAction(state, "network");
    expect(
      Object.keys(state.relations).some(
        (key) =>
          state.relations[key as keyof typeof state.relations] >
          beforeRelations[key as keyof typeof beforeRelations],
      ),
    ).toBe(true);
  });
  it("applies the current residence bonus to palace actions", () => {
    const novice = createGame("听雨", "scholar", 12);
    const studied = performPalaceAction(novice, "study");
    expect(studied.growthPoints).toBe(2);

    const garden = createGame("承露", "scholar", 13);
    garden.rank = "贵人";
    garden.relations.顾明华 = -10;
    const networked = performPalaceAction(garden, "network");
    expect(networked.relations.顾明华).toBe(5);

    const sunny = createGame("景和", "scholar", 14);
    sunny.rank = "嫔";
    sunny.stats.体力 = 3;
    expect(performPalaceAction(sunny, "rest").stats.体力).toBe(6);

    const nearEmperor = createGame("昭阳", "scholar", 15);
    nearEmperor.rank = "贵妃";
    expect(performPalaceAction(nearEmperor, "attend").emperor.favor).toBe(8);
  });
  it("links leisure, imperial presence and court attention", () => {
    const initial = createGame("起居巡检", "scholar", 16);
    const blockedTalk = performPalaceAction(initial, "confide");
    expect(blockedTalk).toBe(initial);
    expect(courtAttention(initial)).toBe(0);

    const attended = performPalaceAction(initial, "attend");
    expect(attended.actionPoints).toBe(initial.actionPoints - 1);
    expect(courtAttention(attended)).toBe(3);

    const talked = performPalaceAction(attended, "confide");
    expect(talked.actionPoints).toBe(attended.actionPoints - 1);
    expect(courtAttention(talked)).toBe(4);

    const networked = performPalaceAction(talked, "network");
    expect(courtAttention(networked)).toBe(6);
  });
  it("spends stamina and money, blocks unpaid costs and grants rank stipend", () => {
    const exhausted = createGame("力竭巡检", "scholar", 17);
    exhausted.stats.体力 = 0;
    expect(performPalaceAction(exhausted, "study")).toBe(exhausted);

    const penniless = createGame("俸例巡检", "scholar", 18);
    penniless.stats.银钱 = 0;
    expect(performPalaceAction(penniless, "network")).toBe(penniless);
    const paidChoice = Object.values(scenes)
      .flatMap((scene) => scene.choices)
      .find((choice) => (choice.effect.stats?.银钱 ?? 0) < 0)!;
    expect(isChoiceAvailable(penniless, paidChoice)).toBe(false);

    const beforeSilver = createGame("领俸巡检", "scholar", 19);
    const afterSilver = completeChapter(beforeSilver, "chapter-1");
    expect(afterSilver.stats.银钱).toBeGreaterThan(beforeSilver.stats.银钱);
  });
  it("turns resource scarcity into recoverable pressure and playable events", () => {
    let state = createGame("困局巡检", "scholar", 20);
    expect(state.stats.体力).toBe(3);

    state.stats.体力 = 1;
    state.stats.银钱 = 0;
    const rested = performPalaceAction(state, "rest");
    expect(rested.stats.体力).toBe(4);

    const raised = performPalaceAction(
      { ...state, actionPoints: 3 },
      "raiseFunds",
    );
    expect(raised.stats.银钱).toBe(2);
    expect(raised.stats.体力).toBe(0);
    expect(raised.relations.高福安).toBe(-10);
    expect(courtAttention(raised)).toBe(2);
    expect(raised.tags).toContain("debt:高福安");
    expect(performPalaceAction(raised, "raiseFunds")).toBe(raised);

    const flush = createGame("银钱巡检", "merchant", 21);
    flush.stats.银钱 = 9;
    expect(performPalaceAction(flush, "raiseFunds")).toBe(flush);

    state = completeChapter(state, "chapter-1");
    state.stats.体力 = 1;
    state.stats.银钱 = 0;
    state = completeChapter(state, "chapter-2");
    expect(state.resourcePressure).toEqual({ exhaustion: 2, arrears: 2 });
    expect(availableSideStories(state).map((story) => story.id)).toEqual(
      expect.arrayContaining([
        "exhaustion-physician-order",
        "arrears-red-mark",
      ]),
    );
  });
  it("uses escalating training costs and reserves level ten for story breakthroughs", () => {
    expect([3, 4, 6, 8, 9].map(growthCost)).toEqual([1, 2, 3, 4, Infinity]);
    const state = createGame("清和", "scholar", 10);
    state.stats.才学 = 9;
    state.growthPoints = 99;
    expect(spendGrowthPoint(state, "才学")).toBe(state);
  });
  it("turns sustained hostility and relationship milestones into playable events", () => {
    let state = createGame("清和", "scholar", 10);
    state.relations.顾明华 = -40;
    state.tags.push("day3_gu_accused");
    for (const chapter of [1, 2, 3, 4, 5] as const) {
      state = completeChapter(state, `chapter-${chapter}`);
    }
    expect(state.relationshipStrain.顾明华).toBeGreaterThanOrEqual(2);
    expect(availableSideStories(state).map((story) => story.id)).toContain(
      "gu-long-grudge",
    );
    state.relations.沈令仪 = 30;
    expect(availableSideStories(state).map((story) => story.id)).toContain(
      "shen-private-ledger",
    );
  });
  it("uses carried keepsakes to unlock hidden side stories", () => {
    let state = createGame("清和", "scholar", 12);
    state = completeChapter(state, "chapter-1");
    state = completeChapter(state, "chapter-2");
    state.relations.高福安 = 20;
    expect(availableSideStories(state).map((story) => story.id)).not.toContain(
      "register-hidden-ink",
    );
    state.tags.push("carried_reward:keepsake-seat-register");
    expect(availableSideStories(state).map((story) => story.id)).toContain(
      "register-hidden-ink",
    );
  });
  it("resolves all 6,480 origin, zodiac and choice combinations", () => {
    const origins = ["scholar", "merchant", "general"] as const;
    const zodiacs = ["rabbit", "tiger", "monkey", "ox"] as const;
    const ranks = new Set<string>();
    let completed = 0;
    const walk = (state: ReturnType<typeof createGame>) => {
      if (state.sceneId === "evaluation") {
        const result = evaluate(state);
        expect(Number.isFinite(result.score)).toBe(true);
        expect(
          Object.values(state.relations).every((v) => v >= -100 && v <= 100),
        ).toBe(true);
        ranks.add(result.rank);
        completed += 1;
        return;
      }
      const scene = scenes[state.sceneId];
      expect(scene).toBeDefined();
      for (const choice of scene.choices.filter(
        (item) => !item.requiresZodiac || item.requiresZodiac === state.zodiac,
      )) {
        expect(choice.outcome.length).toBeGreaterThan(8);
        walk(applyEffect(state, choice.effect, choice.id, choice.next));
      }
    };
    origins.forEach((origin, originIndex) =>
      zodiacs.forEach((zodiac, zodiacIndex) =>
        walk(
          createGame("巡检", origin, 31 + originIndex + zodiacIndex, zodiac),
        ),
      ),
    );
    expect(completed).toBe(6480);
    expect(ranks).toEqual(new Set(["答应", "常在", "贵人"]));
  });

  it("resolves every available second-day branch without broken scenes", () => {
    const zodiacs = ["rabbit", "tiger", "monkey", "ox"] as const;
    const ranks = ["答应", "常在", "贵人"] as const;
    let completed = 0;
    const walk = (state: ReturnType<typeof createGame>) => {
      if (state.sceneId === "day2_result") {
        completed += 1;
        expect(state.history.at(-1)?.startsWith("day2_")).toBe(true);
        expect(
          Object.values(state.relations).every(
            (value) => value >= -100 && value <= 100,
          ),
        ).toBe(true);
        return;
      }
      const scene = scenes[state.sceneId];
      expect(scene, state.sceneId).toBeDefined();
      const available = scene.choices.filter(
        (choice) =>
          (!choice.requiresZodiac || choice.requiresZodiac === state.zodiac) &&
          (!choice.requiresRank || choice.requiresRank === state.rank) &&
          (!choice.requiresTag || state.tags.includes(choice.requiresTag)),
      );
      expect(available.length).toBeGreaterThanOrEqual(3);
      available.forEach((choice) =>
        walk(applyEffect(state, choice.effect, choice.id, choice.next)),
      );
    };
    zodiacs.forEach((zodiac) =>
      ranks.forEach((rank) => {
        const state = createGame("巡检", "scholar", 71, zodiac);
        state.rank = rank;
        state.sceneId = "day2_summons";
        walk(state);
      }),
    );
    expect(completed).toBe(1872);
  });

  it("resolves every third-day branch and its conditional pearl choice", () => {
    const zodiacs = ["rabbit", "tiger", "monkey", "ox"] as const;
    let completed = 0;
    let pearlRoutes = 0;
    const walk = (state: ReturnType<typeof createGame>) => {
      if (state.sceneId === "day3_result") {
        completed += 1;
        expect(
          state.tags.includes("day3_lin_alive") ||
            state.tags.includes("day3_lin_dead"),
        ).toBe(true);
        return;
      }
      const scene = scenes[state.sceneId];
      expect(scene, state.sceneId).toBeDefined();
      const available = scene.choices.filter(
        (choice) =>
          (!choice.requiresZodiac || choice.requiresZodiac === state.zodiac) &&
          (!choice.requiresRank || choice.requiresRank === state.rank) &&
          (!choice.requiresTag || state.tags.includes(choice.requiresTag)),
      );
      expect(available.length).toBeGreaterThanOrEqual(3);
      available.forEach((choice) => {
        if (choice.id === "day3_use_pearl") pearlRoutes += 1;
        walk(applyEffect(state, choice.effect, choice.id, choice.next));
      });
    };
    zodiacs.forEach((zodiac) => {
      let state = createGame("巡检", "scholar", 91, zodiac);
      state = completeChapter(state, "chapter-1");
      state = completeChapter(state, "chapter-2");
      state.sceneId = "day3_incense";
      walk(state);
    });
    expect(completed).toBe(1728);
    expect(pearlRoutes).toBeGreaterThan(0);
  });

  it("resolves every rain-night empty-seal branch", () => {
    let completed = 0;
    const walk = (state: ReturnType<typeof createGame>) => {
      if (state.sceneId === "day4_result") {
        completed += 1;
        expect(
          state.tags.some((tag) =>
            ["day4_bait_set", "empty_seal_burned", "day4_rumor_bait"].includes(
              tag,
            ),
          ),
        ).toBe(true);
        return;
      }
      const scene = scenes[state.sceneId];
      expect(scene, state.sceneId).toBeDefined();
      scene.choices.forEach((choice) =>
        walk(applyEffect(state, choice.effect, choice.id, choice.next)),
      );
    };
    const state = createGame("巡检", "scholar", 121, "rabbit");
    state.sceneId = "day4_blank_seal";
    walk(state);
    expect(completed).toBe(243);
  });

  it("resolves chapters five through twelve without broken branches", () => {
    for (let chapter = 5; chapter <= 12; chapter += 1) {
      let completed = 0;
      const walk = (state: ReturnType<typeof createGame>) => {
        if (state.sceneId === `day${chapter}_result`) {
          completed += 1;
          expect(state.history.at(-1)).toMatch(new RegExp(`^day${chapter}_3_`));
          return;
        }
        const scene = scenes[state.sceneId];
        expect(scene, state.sceneId).toBeDefined();
        const available = scene.choices.filter((choice) =>
          isChoiceAvailable(state, choice),
        );
        expect(available.length).toBeGreaterThanOrEqual(2);
        available.forEach((choice) => {
          expect(choice.outcome.length).toBeGreaterThan(12);
          walk(applyEffect(state, choice.effect, choice.id, choice.next));
        });
      };
      let state = createGame("巡检", "scholar", 200 + chapter, "rabbit");
      for (let previous = 1; previous < chapter; previous += 1) {
        state = completeChapter(state, `chapter-${previous}` as ChapterId);
      }
      state.sceneId = `day${chapter}_1`;
      walk(state);
      expect(completed).toBeGreaterThan(0);
    }
  });

  it("holds or grants promotion through visible imperial, merit and network routes", () => {
    const base = createGame("晋位巡检", "scholar", 303, "rabbit");
    base.rank = "贵人";
    base.completedChapters = [
      "chapter-1",
      "chapter-2",
      "chapter-3",
      "chapter-4",
    ];
    expect(evaluatePromotion(base, "chapter-5").status).toBe("held");

    const imperial = structuredClone(base);
    imperial.emperor = { favor: 18, trust: 10 };
    expect(evaluatePromotion(imperial, "chapter-5")).toMatchObject({
      status: "promoted",
      to: "嫔",
      route: "帝心",
    });

    const merit = structuredClone(base);
    merit.stats.名望 = 4;
    merit.stats.才学 = 5;
    expect(evaluatePromotion(merit, "chapter-5")).toMatchObject({
      status: "promoted",
      route: "清议",
    });

    const network = structuredClone(base);
    network.relations.沈令仪 = 20;
    network.relations.顾明华 = 0;
    network.relations.高福安 = -5;
    expect(evaluatePromotion(network, "chapter-5")).toMatchObject({
      status: "promoted",
      route: "人脉",
    });
  });

  it("carries the chapter seven hunt consequence into chapter eight", () => {
    let state = createGame("跨章巡检", "scholar", 707, "rabbit");
    const saveWitness = scenes.day7_1.choices.find(
      (choice) => choice.id === "day7_1_2",
    )!;
    state = applyEffect(
      state,
      saveWitness.effect,
      saveWitness.id,
      saveWitness.next,
    );
    const woundedCouncil = scenes.day8_1.choices.find(
      (choice) => choice.id === "day8_wounded_council",
    )!;
    const safeTestimony = scenes.day8_1.choices.find(
      (choice) => choice.id === "day8_safe_testimony",
    )!;
    expect(isChoiceAvailable(state, woundedCouncil)).toBe(true);
    expect(isChoiceAvailable(state, safeTestimony)).toBe(false);
  });

  it("unlocks a distinct story option when training meets its threshold", () => {
    const state = createGame("修习巡检", "scholar", 410, "rabbit");
    state.stats.才学 = 4;
    const choice = scenes.day5_1.choices.find(
      (item) => item.id === "day5_1_growth",
    );
    expect(choice?.requiresStat).toEqual({ stat: "才学", min: 4 });
    expect(state.stats[choice!.requiresStat!.stat]).toBeGreaterThanOrEqual(
      choice!.requiresStat!.min,
    );
    const next = applyEffect(state, choice!.effect, choice!.id, choice!.next);
    expect(next.tags).toContain("ch5_growth_breakthrough");
  });

  it("keeps all twelve formal endings reachable from accumulated state", () => {
    const cases: Array<[string[], string, boolean?]> = [
      [[], "phoenix-throne"],
      [["ch10_player_regent"], "regent"],
      [["ch8_dual_rule"], "dual-palaces"],
      [["ch8_gu_ascends"], "minghua-alliance"],
      [["ch12_truth_sealed"], "shadow-network"],
      [["ch12_reform"], "jade-reform"],
      [["ch12_reform", "ch7_pei_truth"], "gatekeeper"],
      [["ch12_freedom"], "spring-beyond-palace"],
      [["ch12_freedom", "ending_palace_history"], "palace-history"],
      [[], "golden-cage", true],
      [["ch11_self_hostage", "ch12_full_truth"], "scapegoat"],
      [["ch11_truth_traded", "ch12_truth_sealed"], "closed-gate"],
    ];
    const ids = cases.map(([tags, expected, hostile]) => {
      const state = createGame("结局巡检", "scholar", 501, "rabbit");
      state.tags = tags;
      if (hostile) {
        state.relations.沈令仪 = -1;
        state.relations.顾明华 = -1;
      }
      expect(resolveEnding(state).id).toBe(expected);
      return resolveEnding(state).id;
    });
    expect(new Set(ids).size).toBe(12);
  });
});
