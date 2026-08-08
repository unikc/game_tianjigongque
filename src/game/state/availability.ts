import type { Choice, GameState } from "../types";

export function isChoiceAvailable(state: GameState, choice: Choice) {
  const relation = choice.requiresRelation;
  const canPayResources = (["体力", "银钱"] as const).every((stat) => {
    const change = choice.effect.stats?.[stat] ?? 0;
    return change >= 0 || state.stats[stat] >= Math.abs(change);
  });
  return (
    canPayResources &&
    (!choice.requiresZodiac || choice.requiresZodiac === state.zodiac) &&
    (!choice.requiresRank || choice.requiresRank === state.rank) &&
    (!choice.requiresTag || state.tags.includes(choice.requiresTag)) &&
    (!choice.requiresAnyTag ||
      choice.requiresAnyTag.some((tag) => state.tags.includes(tag))) &&
    (!choice.excludesTag || !state.tags.includes(choice.excludesTag)) &&
    (!choice.requiresStat ||
      state.stats[choice.requiresStat.stat] >= choice.requiresStat.min) &&
    (!choice.requiresEmperor ||
      state.emperor.favor >= (choice.requiresEmperor.favor ?? 0)) &&
    (!choice.requiresEmperor ||
      state.emperor.trust >= (choice.requiresEmperor.trust ?? 0)) &&
    (!choice.requiresRewardId ||
      state.rewards.some((reward) => reward.id === choice.requiresRewardId)) &&
    (!relation ||
      ((relation.min === undefined ||
        state.relations[relation.name] >= relation.min) &&
        (relation.max === undefined ||
          state.relations[relation.name] <= relation.max)))
  );
}
