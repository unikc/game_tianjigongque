import { describe, expect, it } from "vitest";
import { createGame, applyEffect } from "../src/game/state/engine";
import { deriveTruths } from "../src/game/state/hidden-truth";
import {
  availableSecrets,
  demandedSecret,
  forecastDefinitions,
  forecastReading,
  forecastTags,
  ledgerExposure,
  surrenderedSecrets,
  tradeAvailability,
  tradableForecasts,
} from "../src/game/state/tianji-pavilion";
import {
  delayedConsequences,
  delayedConsequenceStatus,
} from "../src/game/state/delayed-consequences";
import type { ChapterId, GameState } from "../src/game/types";

const chapters = (upTo: number) =>
  Array.from(
    { length: upTo },
    (_, index) => `chapter-${index + 1}` as ChapterId,
  );

/**
 * 造一个「有私事可付」的玩家：她在第2章独自辨认过刮痕，
 * 那条记忆的 visibility 是 private。
 */
function withPrivateHistory(seed = 7): GameState {
  const state = createGame("持盈", "scholar", seed, "rabbit");
  state.history.push("day2_rabbit_trace");
  state.completedChapters = chapters(4);
  return state;
}

/** 造一个「全程走明路」的玩家：只有公开与当事人可见的往事。 */
function withoutPrivateHistory(seed = 7): GameState {
  const state = createGame("循制", "scholar", seed, "ox");
  state.history.push("day2_rank_access", "duck_admit");
  state.completedChapters = chapters(4);
  return state;
}

describe("天机阁 · E03", () => {
  it("没有免费的谶语：无私事可付时不成交", () => {
    const state = withoutPrivateHistory();
    expect(availableSecrets(state)).toHaveLength(0);
    expect(tradableForecasts(state)).toHaveLength(0);
    expect(tradeAvailability(state, "physician").kind).toBe("nothing-to-pay");
  });

  it("走明路的玩家买不到未来，这是取舍而不是缺陷", () => {
    const open = withoutPrivateHistory();
    const shadowed = withPrivateHistory();
    expect(tradableForecasts(open)).toHaveLength(0);
    expect(tradableForecasts(shadowed).length).toBeGreaterThan(0);
  });

  it("要走的秘密必须是玩家确实做过的事", () => {
    const state = withPrivateHistory();
    const price = demandedSecret(state, "physician")!;
    expect(price).toBeDefined();
    // 价目一定能追溯到 history 里一个真实的选择 id。
    expect(state.history).toContain(price.sourceChoiceId);
  });

  it("同一存档重放时，阁主要走的是同一件事", () => {
    const a = withPrivateHistory(31);
    const b = withPrivateHistory(31);
    expect(demandedSecret(a, "fire")?.memoryId).toBe(
      demandedSecret(b, "fire")?.memoryId,
    );
  });

  it("signpost 类谶语与真相无关：措辞不泄底", () => {
    // 找两个 wenLoyalty 相反的种子，读出来的文本必须一字不差。
    const honest = [...Array(400).keys()].find(
      (seed) => deriveTruths(seed + 1).wenLoyalty === "honest",
    )!;
    const compromised = [...Array(400).keys()].find(
      (seed) => deriveTruths(seed + 1).wenLoyalty === "compromised",
    )!;
    expect(forecastReading(withPrivateHistory(honest + 1), "physician")).toBe(
      forecastReading(withPrivateHistory(compromised + 1), "physician"),
    );

    const royal = [...Array(400).keys()].find(
      (seed) => deriveTruths(seed + 1).arsonPatron === "royal",
    )!;
    const dowager = [...Array(400).keys()].find(
      (seed) => deriveTruths(seed + 1).arsonPatron === "dowager",
    )!;
    expect(forecastReading(withPrivateHistory(royal + 1), "fire")).toBe(
      forecastReading(withPrivateHistory(dowager + 1), "fire"),
    );
  });

  it("exclusion 类只划掉一段假路，绝不划掉真相", () => {
    for (let seed = 1; seed <= 120; seed += 1) {
      const state = withPrivateHistory(seed);
      const truth = deriveTruths(seed).leakLink;
      const tags = forecastTags(state, "wind");
      const excluded = tags
        .find((tag) => tag.startsWith("tianji_excluded:"))!
        .slice("tianji_excluded:".length);
      expect(excluded).not.toBe(truth);
      // 只划掉一段，剩下的仍是二选一。
      expect(tags.filter((t) => t.startsWith("tianji_excluded:"))).toHaveLength(
        1,
      );
    }
  });

  it("谶语只给 belief/hint，永不直接给 known_*", () => {
    const state = withPrivateHistory();
    forecastDefinitions.forEach((forecast) => {
      forecastTags(state, forecast.id).forEach((tag) => {
        expect(tag.startsWith("known_")).toBe(false);
      });
    });
  });

  it("每道谶语都早于它所预言的章节", () => {
    const payoffChapter: Record<string, number> = {
      physician: 5,
      fire: 9,
      wind: 9,
    };
    forecastDefinitions.forEach((forecast) => {
      expect(forecast.fromChapter).toBeLessThan(payoffChapter[forecast.id]);
    });
  });

  it("交出的秘密进入秘录册，并按件数升级威胁", () => {
    let state = withPrivateHistory();
    expect(ledgerExposure(state)).toBe("none");
    const price = demandedSecret(state, "physician")!;
    state = applyEffect(
      state,
      {
        tags: [`secret_surrendered:${price.memoryId}`, "secret_source:tianji"],
      },
      "tianji_trade_ch4_pay_physician",
      "day4_result",
    );
    expect(surrenderedSecrets(state)).toHaveLength(1);
    expect(ledgerExposure(state)).toBe("noted");
    // 同一件事不会被重复计价。
    expect(
      availableSecrets(state).some((s) => s.memoryId === price.memoryId),
    ).toBe(false);
  });

  it("烧掉册子是唯一的化解方式", () => {
    let state = withPrivateHistory();
    const price = demandedSecret(state, "physician")!;
    state = applyEffect(
      state,
      {
        tags: [`secret_surrendered:${price.memoryId}`, "secret_source:tianji"],
      },
      "pay",
      "day4_result",
    );
    expect(ledgerExposure(state)).toBe("noted");
    state.tags.push("tianji_ledger_burned");
    expect(ledgerExposure(state)).toBe("none");
  });

  it("秘录册形成一笔真实的延迟旧账，且知情渠道是她本人经手", () => {
    const consequence = delayedConsequences.find(
      (item) => item.id === "tianji-ledger-called-in",
    )!;
    expect(consequence.instigator).toBe("卫夷则");
    expect(consequence.knowledge[0].channel).toBe("direct");

    const state = withPrivateHistory();
    state.tags.push("secret_source:tianji");
    state.completedChapters = chapters(5);
    expect(delayedConsequenceStatus(state, consequence)).toBe("waiting");
    state.completedChapters = chapters(6);
    expect(delayedConsequenceStatus(state, consequence)).toBe("ready");
    state.tags.push("tianji_ledger_burned");
    expect(delayedConsequenceStatus(state, consequence)).toBe("defused");
  });

  it("关系再好也不会让册子消失——她不由敌意驱动", () => {
    const consequence = delayedConsequences.find(
      (item) => item.id === "tianji-ledger-called-in",
    )!;
    const state = withPrivateHistory();
    state.tags.push("secret_source:tianji");
    state.completedChapters = chapters(6);
    state.relations.卫夷则 = 80;
    expect(delayedConsequenceStatus(state, consequence)).toBe("ready");
  });

  it("不读取任何种子真相作为 NPC 的知情渠道", () => {
    const consequence = delayedConsequences.find(
      (item) => item.id === "tianji-ledger-called-in",
    )!;
    const forbidden = ["wenLoyalty", "arsonPatron", "leakLink"];
    const serialized = JSON.stringify(consequence);
    forbidden.forEach((key) => expect(serialized).not.toContain(key));
  });
});
