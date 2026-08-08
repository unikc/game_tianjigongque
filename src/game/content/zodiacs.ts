import type { Effect, ZodiacId } from "../types";

export const zodiacs: Record<
  ZodiacId,
  {
    name: string;
    archetype: string;
    description: string;
    special: string;
    effect: Effect;
  }
> = {
  rabbit: {
    name: "卯兔",
    archetype: "静观者",
    description: "看似温顺，擅长留意别人错过的细节。",
    special: "静观",
    effect: { stats: { 谋略: 1, 人情: 1 } },
  },
  tiger: {
    name: "寅虎",
    archetype: "直取者",
    description: "气势天然醒目，敢接下责任，也容易树敌。",
    special: "直取",
    effect: { stats: { 胆识: 2, 礼仪: -1 } },
  },
  monkey: {
    name: "申猴",
    archetype: "机变者",
    description: "反应极快，总能找到规矩没有写明的出口。",
    special: "机变",
    effect: { stats: { 才学: 1, 胆识: 1 } },
  },
  ox: {
    name: "丑牛",
    archetype: "实干者",
    description: "沉稳可靠，往往在别人开口前已经做完一半。",
    special: "实干",
    effect: { stats: { 体力: 1, 礼仪: 1 } },
  },
};
