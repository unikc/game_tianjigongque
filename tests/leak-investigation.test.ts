import { describe, expect, it } from "vitest";
import { laterScenes } from "../src/game/content/later-scenes";
import { applyEffect, createGame } from "../src/game/state/engine";
import {
  buildLeakReturnScene,
  leakCanaries,
  leakReaction,
} from "../src/game/state/leak-investigation";
import { deriveTruths, type LeakLink } from "../src/game/state/hidden-truth";

const links: LeakLink[] = [
  "review-copy",
  "courier-route",
  "recipient-household",
];

const seedFor = (link: LeakLink) => {
  for (let seed = 1; seed < 1000; seed += 1) {
    if (deriveTruths(seed).leakLink === link) return seed;
  }
  throw new Error(`No seed for ${link}`);
};

describe("E07 宫中泄漏调查", () => {
  it("三条试探札在内容、载体和回流反应上都互斥", () => {
    expect(new Set(leakCanaries.map((item) => item.message)).size).toBe(3);
    expect(new Set(leakCanaries.map((item) => item.route)).size).toBe(3);
    expect(new Set(leakCanaries.map((item) => item.reaction)).size).toBe(3);
  });

  it("每个种子只产生一条可辨认的回流", () => {
    for (let seed = 1; seed <= 300; seed += 1) {
      const reaction = leakReaction(seed);
      expect(reaction.link).toBe(deriveTruths(seed).leakLink);
      expect(leakCanaries.filter((item) => item === reaction)).toHaveLength(1);
    }
  });

  it("匹配的第二来源才能把推断升级为已知", () => {
    for (const link of links) {
      const state = createGame("巡札", "scholar", seedFor(link));
      state.tags = [`leak:observed:${link}`];
      const scene = buildLeakReturnScene(state);
      const choice = scene.choices.find((item) => item.id.endsWith(link))!;
      expect(choice.effect.tags).toContain(`known_leak_link:${link}`);

      const weak = createGame("巡札", "scholar", seedFor(link));
      weak.tags = [
        `leak:observed:${links.find((candidate) => candidate !== link)}`,
      ];
      const weakChoice = buildLeakReturnScene(weak).choices.find((item) =>
        item.id.endsWith(link),
      )!;
      expect(weakChoice.effect.tags).not.toContain(`known_leak_link:${link}`);
      expect(weakChoice.effect.tags).toContain(`belief_leak:${link}`);
    }
  });

  it("监看错链时不会把另外两链的唯一反应或谢的越权结论写出来", () => {
    const courierSeed = seedFor("courier-route");
    const watchedReview = createGame("错看", "scholar", courierSeed);
    watchedReview.tags = ["leak:observed:review-copy"];
    const reviewText = buildLeakReturnScene(watchedReview).text;
    expect(reviewText).not.toContain("御药院");
    expect(reviewText).not.toContain("路牌");
    expect(reviewText).not.toContain("谢明微将");

    const recipientSeed = seedFor("recipient-household");
    const watchedCourier = createGame("错看", "scholar", recipientSeed);
    watchedCourier.tags = ["leak:observed:courier-route"];
    expect(buildLeakReturnScene(watchedCourier).text).not.toContain("琴匣");
  });

  it("三种错误问责都会留下可追溯后果并继续原第九章", () => {
    for (const truth of links) {
      for (const accused of links.filter((link) => link !== truth)) {
        const state = createGame("误判", "scholar", seedFor(truth));
        const choice = buildLeakReturnScene(state).choices.find((item) =>
          item.id.endsWith(accused),
        )!;
        expect(choice.next).toBe("day9_2");
        expect(choice.effect.tags).toContain(`accused_link:${accused}`);
        expect(choice.effect.tags).toContain("actual-leak-adapts");
        expect(
          choice.effect.tags?.some((tag) => tag.startsWith("known_")),
        ).toBe(false);
        const continued = applyEffect(
          state,
          choice.effect,
          choice.id,
          choice.next,
        );
        expect(continued.sceneId).toBe("day9_2");
      }
    }
  });

  it("新调查只插入第九章，不删除原有选择", () => {
    expect(laterScenes.day9_1.choices).toHaveLength(5);
    expect(
      laterScenes.day9_1.choices.every(
        (choice) => choice.next === "day9_leak_canaries",
      ),
    ).toBe(true);
    expect(laterScenes.day9_leak_canaries.choices).toHaveLength(3);
    expect(laterScenes.day9_leak_return.choices).toHaveLength(4);
    expect(
      laterScenes.day9_leak_return.choices.every(
        (choice) => choice.next === "day9_2",
      ),
    ).toBe(true);
  });

  it("谨慎路线永远可选、不制造指控并继续剧情", () => {
    for (const link of links) {
      const scene = buildLeakReturnScene(
        createGame("慎断", "scholar", seedFor(link)),
      );
      const cautious = scene.choices.find(
        (choice) => choice.id === "day9_leak_rotate_all",
      )!;
      expect(cautious.next).toBe("day9_2");
      expect(cautious.effect.tags).toContain("canaries-published");
      expect(
        cautious.effect.tags?.some((tag) => tag.startsWith("accused_link:")),
      ).toBe(false);
    }
  });
});
