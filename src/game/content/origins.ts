import type { OriginId, StatKey } from "../types";
export const BASE_STATS: Record<StatKey, number> = {
  才学: 1,
  谋略: 1,
  胆识: 1,
  礼仪: 1,
  人情: 1,
  体力: 2,
  银钱: 1,
  名望: 1,
};
export const origins: Record<
  OriginId,
  {
    name: string;
    description: string;
    deltas: Partial<Record<StatKey, number>>;
  }
> = {
  scholar: {
    name: "翰林之女",
    deltas: { 才学: 2, 谋略: 1, 体力: -1 },
    description:
      "自幼读书识字，擅长从一句话里听出三层意思，却未必知道什么时候应该装作没听懂。",
  },
  merchant: {
    name: "商贾之家",
    deltas: { 银钱: 2, 人情: 1, 名望: -1 },
    description:
      "熟悉账目、人情与礼物的真正价值，知道一只玉镯有时比十句真话更有效。",
  },
  general: {
    name: "武将之后",
    deltas: { 胆识: 2, 体力: 1, 礼仪: -1 },
    description:
      "不怕事，也不太怕人。最大的危险，是偶尔会把宫里的暗示当成一句正常的话。",
  },
};
