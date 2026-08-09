import { BASE_STATS, origins } from "../content/origins";
import { zodiacs } from "../content/zodiacs";
import type {
  Effect,
  ChapterId,
  GameState,
  OriginId,
  PromotionDecision,
  PromotionRoute,
  Rank,
  RelationKey,
  StatKey,
  ZodiacId,
} from "../types";
import { relationshipProfiles, relationKeys } from "../relationships";
import {
  basisMet,
  basisText,
  promotionBases,
  promotionReason,
} from "./promotion-basis";
export const SAVE_KEY = "tianji-palace-save";

/**
 * localStorage 的安全包装。
 *
 * 隐私模式 Safari、被沙箱限制的 iframe、以及关闭了站点数据的浏览器里，
 * 访问 localStorage 会直接抛 SecurityError。裸调用会让整个 React 树
 * 挂掉，玩家看到的是白屏——比"存档丢失"严重得多。
 *
 * 这里的取舍：存档能力可以降级，可玩性不能。读失败当作没有存档，
 * 写失败静默忽略，游戏继续在内存中进行。
 */
export const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      /* 存储不可用时无需清理 */
    }
  },
  /** 供 UI 提示玩家"本次进度不会被保存" */
  available(): boolean {
    try {
      const probe = "__tianji_probe__";
      localStorage.setItem(probe, "1");
      localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  },
};
export const ACTION_POINT_CAP = 5;
export type PalaceAction =
  | "study"
  | "attend"
  | "confide"
  | "network"
  | "rest"
  | "raiseFunds";

export function resourceStage(value: number) {
  if (value >= 7) return { label: "充沛", tone: "secure" } as const;
  if (value >= 4) return { label: "平稳", tone: "steady" } as const;
  if (value >= 2) return { label: "吃紧", tone: "strained" } as const;
  return { label: "危急", tone: "critical" } as const;
}
export const rankOrder: Rank[] = [
  "答应",
  "常在",
  "贵人",
  "嫔",
  "妃",
  "贵妃",
  "皇贵妃",
  "皇后",
];
const relations = Object.fromEntries(
  relationKeys.map((key) => [key, relationshipProfiles[key].initialValue]),
) as Record<RelationKey, number>;
const relationshipStrain = Object.fromEntries(
  relationKeys.map((key) => [key, 0]),
) as Record<RelationKey, number>;
const coreStats: StatKey[] = ["才学", "谋略", "胆识", "礼仪", "人情"];
export function growthCost(value: number) {
  if (value < 4) return 1;
  if (value < 6) return 2;
  if (value < 8) return 3;
  if (value < 9) return 4;
  return Infinity;
}
export function rankAttention(rank: Rank = "答应") {
  return [0, 4, 9, 16, 26, 40, 58, 78][rankOrder.indexOf(rank)] ?? 0;
}
export function courtAttention(state: GameState) {
  const chapter = state.completedChapters.length + 1;
  const attended = state.tags.includes(
    `action_attended_emperor_chapter_${chapter}`,
  );
  const confided = state.tags.includes(
    `action_confided_emperor_chapter_${chapter}`,
  );
  const publicVisits = state.tags.filter((tag) =>
    tag.startsWith(`action_networked_chapter_${chapter}_`),
  ).length;
  const raisedFunds = state.tags.includes(
    `action_raised_funds_chapter_${chapter}`,
  );
  return Math.min(
    100,
    rankAttention(state.rank) +
      (attended ? 3 : 0) +
      (confided ? 1 : 0) +
      publicVisits * 2 +
      (raisedFunds ? 2 : 0),
  );
}

export function isRelationshipAvailable(state: GameState, key: RelationKey) {
  if (relationshipProfiles[key].knownAfter > state.completedChapters.length) {
    return false;
  }
  if (key === "林栖梧" && state.tags.includes("day3_lin_dead")) return false;
  if (
    key === "高福安" &&
    (state.tags.includes("ch9_evidence_saved") ||
      state.tags.includes("ch9_arsonist_caught"))
  ) {
    return false;
  }
  return true;
}
export function createGame(
  name: string,
  origin: OriginId,
  seed = Math.floor(Math.random() * 2147483646) + 1,
  zodiac: ZodiacId = "rabbit",
): GameState {
  const stats = { ...BASE_STATS };
  Object.entries(origins[origin].deltas).forEach(
    ([k, v]) => (stats[k as StatKey] += v ?? 0),
  );
  Object.entries(zodiacs[zodiac].effect.stats ?? {}).forEach(
    ([k, v]) => (stats[k as StatKey] += v ?? 0),
  );
  return {
    version: 8,
    name: name.trim() || "陆清和",
    origin,
    zodiac,
    sceneId: "entry",
    stats,
    relations: { ...relations },
    history: [],
    tags: [],
    seed,
    introCompleted: true,
    completedChapters: [],
    rewards: [],
    growthPoints: 0,
    emperor: { favor: 0, trust: 0 },
    actionPoints: 3,
    relationshipStrain: { ...relationshipStrain },
    resolvedSideStories: [],
    chaptersWithoutEmperor: 0,
    resourcePressure: { exhaustion: 0, arrears: 0 },
    rank: undefined,
  };
}
export function applyEffect(
  state: GameState,
  effect: Effect,
  choiceId: string,
  next: string,
): GameState {
  const stats = { ...state.stats };
  const rel = { ...state.relations };
  Object.entries(effect.stats ?? {}).forEach(
    ([k, v]) =>
      (stats[k as StatKey] = Math.max(
        0,
        Math.min(10, stats[k as StatKey] + (v ?? 0)),
      )),
  );
  Object.entries(effect.relations ?? {}).forEach(
    ([k, v]) =>
      (rel[k as RelationKey] = Math.max(
        -100,
        Math.min(100, rel[k as RelationKey] + (v ?? 0) * 10),
      )),
  );
  return {
    ...state,
    stats,
    relations: rel,
    emperor: {
      favor: Math.max(
        0,
        Math.min(100, state.emperor.favor + (effect.emperor?.favor ?? 0)),
      ),
      trust: Math.max(
        0,
        Math.min(100, state.emperor.trust + (effect.emperor?.trust ?? 0)),
      ),
    },
    sceneId: next,
    history: [...state.history, choiceId],
    tags: [...new Set([...state.tags, ...(effect.tags ?? [])])],
  };
}

/**
 * 晋位里程碑。
 *
 * 每条路线现在有两层门槛：
 *   1. 数值下限（必要条件）——保证晋位节奏不会因为一次幸运选择而崩坏。
 *   2. 具名依据（充分条件）——`promotion-basis.ts` 里登记的具体往事。
 *
 * 两者同时满足才晋位。
 */
const promotionMilestones: Array<{
  chapter: number;
  rank: Rank;
  routes?: Record<PromotionRoute, (state: GameState) => boolean>;
  labels?: Record<PromotionRoute, string>;
}> = [
  { chapter: 2, rank: "常在" },
  { chapter: 3, rank: "贵人" },
  {
    chapter: 5,
    rank: "嫔",
    routes: {
      帝心: (s) =>
        s.emperor.favor >= 18 &&
        s.emperor.trust >= 10 &&
        basisMet(
          s,
          promotionBases.find((b) => b.id === "pin-imperial-public-trust")!,
        ),
      清议: (s) =>
        s.stats.名望 >= 4 &&
        coreStats.some((k) => s.stats[k] >= 5) &&
        basisMet(
          s,
          promotionBases.find((b) => b.id === "pin-merit-official-record")!,
        ),
      人脉: (s) =>
        Math.max(...Object.values(s.relations)) >= 20 &&
        Object.values(s.relations).reduce((sum, v) => sum + v, 0) >= 10 &&
        basisMet(
          s,
          promotionBases.find((b) => b.id === "pin-network-key-ally")!,
        ),
    },
    labels: {
      帝心: "宠爱18 · 信任10 · 御前独立判断",
      清议: "名望4 · 一项修习5 · 正式入档往事",
      人脉: "一人亲近20 · 总人脉10 · 为具体人出手",
    },
  },
  {
    chapter: 7,
    rank: "妃",
    routes: {
      帝心: (s) =>
        s.emperor.favor >= 30 &&
        s.emperor.trust >= 20 &&
        basisMet(
          s,
          promotionBases.find(
            (b) => b.id === "fei-imperial-demonstrated-judgment",
          )!,
        ),
      清议: (s) =>
        s.stats.名望 >= 6 &&
        coreStats.filter((k) => s.stats[k] >= 6).length >= 2 &&
        basisMet(
          s,
          promotionBases.find((b) => b.id === "fei-merit-two-records")!,
        ),
      人脉: (s) =>
        Object.values(s.relations).filter((v) => v >= 20).length >= 2 &&
        basisMet(
          s,
          promotionBases.find((b) => b.id === "fei-network-second-alliance")!,
        ),
    },
    labels: {
      帝心: "宠爱30 · 信任20 · 大局独立判断",
      清议: "名望6 · 两项修习6 · 两件正式记录",
      人脉: "两人亲近20 · 两位具名盟友有往事",
    },
  },
  {
    chapter: 9,
    rank: "贵妃",
    routes: {
      帝心: (s) =>
        s.emperor.favor >= 42 &&
        s.emperor.trust >= 30 &&
        basisMet(
          s,
          promotionBases.find((b) => b.id === "guifei-imperial-high-stakes")!,
        ),
      清议: (s) =>
        s.stats.名望 >= 7 &&
        coreStats.filter((k) => s.stats[k] >= 7).length >= 2 &&
        s.rewards.filter((r) => r.kind !== "title").length >= 2 &&
        basisMet(
          s,
          promotionBases.find((b) => b.id === "guifei-merit-evidence-chain")!,
        ),
      人脉: (s) =>
        Object.values(s.relations).filter((v) => v >= 30).length >= 2 &&
        Object.values(s.relationshipStrain).every((v) => v < 2) &&
        basisMet(
          s,
          promotionBases.find(
            (b) => b.id === "guifei-network-no-public-enemies",
          )!,
        ),
    },
    labels: {
      帝心: "宠爱42 · 信任30 · 御前关乎大局的决断",
      清议: "名望7 · 两项修习7 · 两件证物 · 文书链",
      人脉: "两人亲近30 · 无长期敌对 · 多场合出手",
    },
  },
  {
    chapter: 11,
    rank: "皇贵妃",
    routes: {
      帝心: (s) =>
        s.emperor.favor >= 52 &&
        s.emperor.trust >= 40 &&
        basisMet(
          s,
          promotionBases.find(
            (b) => b.id === "huangguifei-imperial-trust-across-crisis",
          )!,
        ),
      清议: (s) =>
        s.stats.名望 >= 8 &&
        coreStats.filter((k) => s.stats[k] >= 7).length >= 3 &&
        basisMet(
          s,
          promotionBases.find(
            (b) => b.id === "huangguifei-merit-institutional",
          )!,
        ),
      人脉: (s) =>
        Object.values(s.relations).filter((v) => v >= 40).length >= 2 &&
        s.resolvedSideStories.length >= 1 &&
        basisMet(
          s,
          promotionBases.find(
            (b) => b.id === "huangguifei-network-cross-chapter",
          )!,
        ),
    },
    labels: {
      帝心: "宠爱52 · 信任40 · 数次危局无替罪",
      清议: "名望8 · 三项修习7 · 跨章节文书链",
      人脉: "两人亲近40 · 完成暗线 · 三章以上出手",
    },
  },
  {
    chapter: 12,
    rank: "皇后",
    routes: {
      帝心: (s) =>
        s.tags.includes("ch12_phoenix") &&
        s.emperor.favor >= 65 &&
        s.emperor.trust >= 50,
      清议: (s) =>
        s.tags.includes("ch12_phoenix") &&
        s.stats.名望 >= 9 &&
        coreStats.filter((k) => s.stats[k] >= 8).length >= 3,
      人脉: (s) =>
        s.tags.includes("ch12_phoenix") &&
        Object.values(s.relations).filter((v) => v >= 50).length >= 2,
    },
    labels: {
      帝心: "凤位选择 · 宠爱65 · 信任50",
      清议: "凤位选择 · 名望9 · 三项修习8",
      人脉: "凤位选择 · 两人亲近50",
    },
  },
];

export function evaluatePromotion(
  state: GameState,
  completingChapter?: ChapterId,
): PromotionDecision {
  const from = state.rank ?? "答应";
  const completedCount =
    state.completedChapters.length +
    (completingChapter && !state.completedChapters.includes(completingChapter)
      ? 1
      : 0);
  const next = promotionMilestones.find(
    (item) => rankOrder.indexOf(item.rank) > rankOrder.indexOf(from),
  );
  if (!next || completedCount < next.chapter)
    return { from, status: "none", criteria: [] };
  if (!next.routes)
    return { from, to: next.rank, status: "promoted", criteria: [] };

  const rankForBasis = next.rank as "嫔" | "妃" | "贵妃" | "皇贵妃" | "皇后";
  const criteria = (Object.keys(next.routes) as PromotionRoute[]).map(
    (route) => {
      const met = next.routes![route](state);
      const basisHint =
        !met && rankForBasis !== "皇后"
          ? basisText(
              state,
              rankForBasis as "嫔" | "妃" | "贵妃" | "皇贵妃",
              route,
            ).text
          : undefined;
      return { route, met, label: next.labels![route], basisHint };
    },
  );

  const winningRoute = criteria.find((c) => c.met)?.route;
  if (winningRoute) {
    const reason =
      rankForBasis !== "皇后"
        ? promotionReason(
            state,
            rankForBasis as "嫔" | "妃" | "贵妃" | "皇贵妃",
            winningRoute,
          )
        : "";
    return {
      from,
      to: next.rank,
      status: "promoted",
      route: winningRoute,
      reason: reason || undefined,
      criteria,
    };
  }
  return { from, to: next.rank, status: "held", criteria };
}

export function seeded(seed: number) {
  let x = seed % 2147483647;
  if (x <= 0) x += 2147483646;
  return () => ((x = (x * 16807) % 2147483647) - 1) / 2147483646;
}
export function evaluate(state: GameState): {
  rank: Rank;
  score: number;
  comment: string;
} {
  const s = state.stats,
    r = state.relations;
  const random = seeded(state.seed)();
  let score =
    s.才学 +
    s.谋略 * 1.25 +
    s.胆识 +
    s.礼仪 * 1.15 +
    s.人情 +
    s.体力 * 0.2 +
    s.银钱 * 0.15 +
    s.名望 * 0.35 +
    (r.沈令仪 / 10) * 0.8 +
    (r.顾明华 / 10) * 0.45 +
    (r.高福安 / 10) * 0.55 +
    random * 2;
  if (
    state.tags.includes("values_evidence") &&
    state.history.includes("duck_investigate")
  )
    score += 0.4;
  if (state.origin === "scholar" && state.history.includes("duck_symbol"))
    score += 0.5;
  if (state.origin === "merchant" && state.tags.includes("socially_generous"))
    score += 0.5;
  if (state.origin === "general" && state.history.includes("duck_admit"))
    score += 0.5;
  if (state.history.includes("duck_admit")) score += 0.8;
  if (state.history.includes("duck_faint")) score -= 0.6;
  const rank: Rank =
    score >= 15.5 && state.history.length >= 5
      ? "贵人"
      : score >= 12
        ? "常在"
        : "答应";
  const comment = state.history.includes("duck_faint")
    ? "此人遇事能屈能躺，地砖寒凉，望赐软垫。"
    : state.tags.includes("uses_humor")
      ? "御前敢论鸭者不多，论完还能得封的更少。"
      : state.tags.includes("values_evidence")
        ? "此人记性甚好。建议传话时，先想想昨日说过什么。"
        : "此人看似沉默，实则已把在场每个人记在心里。建议说话时注意身后。";
  return { rank, score, comment };
}
export function archetype(state: GameState) {
  if (state.history.includes("duck_faint")) return "风险回避大师";
  if (state.tags.includes("uses_humor")) return "御前机辩人";
  if (state.tags.includes("socially_generous")) return "人情经营家";
  if (state.tags.includes("claims_ownership")) return "直行破局者";
  return "谨慎观局者";
}
const chapterRewards: Record<
  ChapterId,
  { rewards: GameState["rewards"]; growthPoints: number }
> = {
  "chapter-1": {
    rewards: [
      {
        id: "title-first-audience",
        name: "御前初见",
        description: "在绣鸭风波中完成第一次御前应答。",
        kind: "title",
        asset: "/backgrounds/palace-courtyard-spring-v01.webp",
      },
      {
        id: "item-imperial-pearl",
        name: "御赐东珠",
        description: "御前随赏的东珠。光泽很好，来处更重要。",
        kind: "item",
        asset: "/items/imperial-pearl-v01.webp",
        rarity: "imperial",
        consumable: false,
      },
    ],
    growthPoints: 1,
  },
  "chapter-2": {
    rewards: [
      {
        id: "keepsake-seat-register",
        name: "刮痕名册",
        description: "一页提醒你：宫中的位置从不只用来坐。",
        kind: "keepsake",
        asset: "/items/scratched-seat-register-v01.webp",
      },
    ],
    growthPoints: 1,
  },
  "chapter-3": {
    rewards: [
      {
        id: "keepsake-cold-incense-lid",
        name: "合欢冷匣",
        description:
          "洗净毒粉后的盒盖。御库纹样是假的，送礼人的名字也可能是假的。",
        kind: "keepsake",
        asset: "/backgrounds/banquet-hall-empty-seat-v01.webp",
        rarity: "rare",
      },
    ],
    growthPoints: 1,
  },
  "chapter-4": {
    rewards: [
      {
        id: "item-empty-seal",
        name: "空印纹样",
        description:
          "从旧纸留下的印痕与纹路拓记。可以诱敌，也可能把持有者变成伪诏共犯。",
        kind: "item",
        asset: "/backgrounds/palace-courtyard-spring-v01.webp",
        rarity: "imperial",
        consumable: false,
      },
    ],
    growthPoints: 1,
  },
  "chapter-5": {
    rewards: [
      {
        id: "evidence-relief-list",
        name: "赈灾名单",
        description: "一份将假皇嗣与真银两相连的名单。",
        kind: "keepsake",
        asset: "/chapters/chapter-5-unfallen-child.webp",
        rarity: "rare",
      },
    ],
    growthPoints: 1,
  },
  "chapter-6": {
    rewards: [
      {
        id: "evidence-river-ledger",
        name: "河堤账页",
        description: "泥水浸过的账页，每个数字后面都是一户人家。",
        kind: "keepsake",
        asset: "/chapters/chapter-6-flood.webp",
        rarity: "rare",
      },
    ],
    growthPoints: 1,
  },
  "chapter-7": {
    rewards: [
      {
        id: "item-broken-arrow",
        name: "断箭",
        description: "来自羽林库存的箭簇，曾越过春猎围障。",
        kind: "item",
        asset: "/chapters/chapter-7-spring-hunt.webp",
        rarity: "rare",
        consumable: false,
      },
    ],
    growthPoints: 1,
  },
  "chapter-8": {
    rewards: [
      {
        id: "item-phoenix-impression",
        name: "凤印拓样",
        description: "它不能发号施令，却能辨认谁在冒用皇后的名义。",
        kind: "item",
        asset: "/chapters/chapter-8-phoenix-seal.webp",
        rarity: "imperial",
        consumable: false,
      },
    ],
    growthPoints: 1,
  },
  "chapter-9": {
    rewards: [
      {
        id: "evidence-ash-ledger",
        name: "灰烬账页",
        description: "火没有烧掉的几行名字。",
        kind: "keepsake",
        asset: "/chapters/chapter-9-palace-fire.webp",
        rarity: "rare",
      },
    ],
    growthPoints: 1,
  },
  "chapter-10": {
    rewards: [
      {
        id: "title-night-signatory",
        name: "金殿署名",
        description: "在无人愿意签字的一夜承担了一道命令。",
        kind: "title",
        asset: "/chapters/chapter-10-empty-throne.webp",
      },
    ],
    growthPoints: 1,
  },
  "chapter-11": {
    rewards: [
      {
        id: "keepsake-gate-order",
        name: "宫门军令",
        description: "最后一道门前留下的停战军令。",
        kind: "keepsake",
        asset: "/chapters/chapter-11-blood-edict.webp",
        rarity: "imperial",
      },
    ],
    growthPoints: 1,
  },
  "chapter-12": {
    rewards: [
      {
        id: "title-dawn-after",
        name: "天明以后",
        description: "你决定了位置如何留下，也看见决定之后的世界。",
        kind: "title",
        asset: "/chapters/chapter-12-after-dawn.webp",
      },
    ],
    growthPoints: 1,
  },
};

export function completeChapter(state: GameState, chapterId: ChapterId) {
  if (state.completedChapters.includes(chapterId)) return state;
  const grant = chapterRewards[chapterId];
  const promotion = evaluatePromotion(state, chapterId);
  const currentRank = state.rank ?? "答应";
  const rank =
    promotion.status === "promoted" && promotion.to
      ? promotion.to
      : currentRank;
  const attention = courtAttention({ ...state, rank });
  const nextStrain = Object.fromEntries(
    (Object.entries(state.relations) as [RelationKey, number][]).map(
      ([name, value]) => [
        name,
        value - (name === "顾明华" ? Math.floor(attention / 3) : 0) <= -30
          ? (state.relationshipStrain[name] ?? 0) + 1
          : Math.max(0, (state.relationshipStrain[name] ?? 0) - 1),
      ],
    ),
  ) as Record<RelationKey, number>;
  const chapterNumber = state.completedChapters.length + 1;
  const sawEmperor = state.tags.some(
    (tag) =>
      tag === `action_attended_emperor_chapter_${chapterNumber}` ||
      tag === `action_confided_emperor_chapter_${chapterNumber}`,
  );
  const chaptersWithoutEmperor = sawEmperor
    ? 0
    : state.chaptersWithoutEmperor + 1;
  const rankIndex = rankOrder.indexOf(rank);
  const stipend = [1, 1, 2, 2, 3, 4, 5, 6][rankIndex] ?? 1;
  const upkeep = [0, 0, 1, 1, 1, 2, 2, 3][rankIndex] ?? 0;
  const nextMoney = Math.min(10, state.stats.银钱 + stipend - upkeep);
  const resourcePressure = {
    exhaustion:
      state.stats.体力 <= 2
        ? Math.min(3, state.resourcePressure.exhaustion + 1)
        : Math.max(0, state.resourcePressure.exhaustion - 1),
    arrears:
      nextMoney <= 1
        ? Math.min(3, state.resourcePressure.arrears + 1)
        : Math.max(0, state.resourcePressure.arrears - 1),
  };
  return {
    ...state,
    completedChapters: [...state.completedChapters, chapterId],
    rewards: [...state.rewards, ...grant.rewards],
    tags:
      chapterId === "chapter-1"
        ? [...new Set([...state.tags, "day3_has_pearl"])]
        : state.tags,
    growthPoints: state.growthPoints + grant.growthPoints,
    stats: {
      ...state.stats,
      体力: Math.min(10, state.stats.体力 + 1),
      银钱: nextMoney,
    },
    actionPoints: Math.min(ACTION_POINT_CAP, state.actionPoints + 2),
    relationshipStrain: nextStrain,
    emperor: {
      ...state.emperor,
      favor: Math.max(
        0,
        state.emperor.favor - (chaptersWithoutEmperor >= 2 ? 3 : 0),
      ),
    },
    chaptersWithoutEmperor,
    resourcePressure,
    rank,
  };
}

export function spendGrowthPoint(state: GameState, stat: StatKey) {
  const cost = growthCost(state.stats[stat]);
  if (
    !coreStats.includes(stat) ||
    !Number.isFinite(cost) ||
    state.growthPoints < cost
  )
    return state;
  return {
    ...state,
    growthPoints: state.growthPoints - cost,
    stats: { ...state.stats, [stat]: state.stats[stat] + 1 },
  };
}
export function residenceFor(state: GameState) {
  const rankIndex = rankOrder.indexOf(state.rank ?? "答应");
  if ((state.rank ?? "答应") === "皇后")
    return {
      id: "fengyi",
      name: "凤仪宫",
      trait: "中轴正宫",
      description: "六宫文书汇集于此，所见皆是权力，也皆是责任。",
      bonus: "夜谈信任额外 +2",
      asset: "/chapters/chapter-8-phoenix-seal.webp",
    } as const;
  if (rankIndex >= 5)
    return {
      id: "zhaoyang",
      name: "昭阳宫",
      trait: "近御书房",
      description: "离帝王日常最近，召见便利，也更容易落入众目。",
      bonus: "伴驾宠爱额外 +2",
      asset: "/backgrounds/banquet-hall-empty-seat-v01.webp",
    } as const;
  if (rankIndex >= 3)
    return {
      id: "jinghe",
      name: "景和宫",
      trait: "向阳得气",
      description: "南窗明净，草木安宁，最宜调养久困宫墙的心神。",
      bonus: "休息体力额外 +1",
      asset: "/backgrounds/palace-courtyard-spring-v01.webp",
    } as const;
  if (rankIndex >= 2)
    return {
      id: "chenglou",
      name: "承露宫",
      trait: "邻御花园",
      description: "紧邻西园夹道，消息与人情都比别处先到一步。",
      bonus: "走动关系额外 +5",
      asset: "/backgrounds/palace-courtyard-spring-v01.webp",
    } as const;
  return {
    id: "tingyu",
    name: "听雨轩",
    trait: "地僻清静",
    description: "远离六宫喧声，适合读书修身，却少有帝驾经过。",
    bonus: "修习点额外 +1",
    asset: "/backgrounds/palace-courtyard-spring-v01.webp",
  } as const;
}
export function performPalaceAction(
  state: GameState,
  action: PalaceAction,
): GameState {
  if (state.actionPoints < 1) return state;
  const residence = residenceFor(state);
  if (
    (["study", "confide"] as const).includes(action as "study" | "confide") &&
    state.stats.体力 < 1
  )
    return state;
  if (action === "network" && state.stats.银钱 < 1) return state;
  if (
    action === "raiseFunds" &&
    (state.stats.体力 < 1 || state.stats.银钱 >= 9)
  )
    return state;
  if (action === "rest" && state.stats.体力 >= 10) return state;
  if (action === "study") {
    const studyTag = `action_studied_chapter_${state.completedChapters.length + 1}`;
    if (state.tags.includes(studyTag)) return state;
    return {
      ...state,
      actionPoints: state.actionPoints - 1,
      growthPoints: state.growthPoints + (residence.id === "tingyu" ? 2 : 1),
      stats: { ...state.stats, 体力: state.stats.体力 - 1 },
      tags: [...new Set([...state.tags, "action_studied", studyTag])],
    };
  }
  if (action === "attend") {
    const attendTag = `action_attended_emperor_chapter_${state.completedChapters.length + 1}`;
    if (state.tags.includes(attendTag)) return state;
    const newFavor = Math.min(
      70,
      state.emperor.favor + 6 + (residence.id === "zhaoyang" ? 2 : 0),
    );
    return {
      ...state,
      actionPoints: state.actionPoints - 1,
      emperor: {
        ...state.emperor,
        favor: newFavor,
      },
      relations:
        newFavor >= 40
          ? {
              ...state.relations,
              顾明华: Math.max(-100, state.relations.顾明华 - 10),
            }
          : state.relations,
      tags: [...new Set([...state.tags, "action_attended_emperor", attendTag])],
    };
  }
  if (action === "confide") {
    const confideTag = `action_confided_emperor_chapter_${state.completedChapters.length + 1}`;
    const attendTag = `action_attended_emperor_chapter_${state.completedChapters.length + 1}`;
    if (state.tags.includes(confideTag) || !state.tags.includes(attendTag))
      return state;
    return {
      ...state,
      actionPoints: state.actionPoints - 1,
      stats: { ...state.stats, 体力: state.stats.体力 - 1 },
      emperor: {
        favor: Math.min(
          70,
          state.emperor.favor + (state.stats.才学 >= 4 ? 2 : 0),
        ),
        trust: Math.min(
          70,
          state.emperor.trust + 5 + (residence.id === "fengyi" ? 2 : 0),
        ),
      },
      tags: [
        ...new Set([...state.tags, "action_confided_emperor", confideTag]),
      ],
    };
  }
  if (action === "network") {
    const relations = (
      Object.entries(state.relations) as [RelationKey, number][]
    ).filter(([name]) => isRelationshipAvailable(state, name));
    if (!relations.length) return state;
    const eligibleRelations = state.tags.includes("debt:高福安")
      ? relations.filter(([name]) => name !== "高福安")
      : relations;
    const target = (
      eligibleRelations.length ? eligibleRelations : relations
    ).sort((a, b) => a[1] - b[1])[0][0];
    return {
      ...state,
      actionPoints: state.actionPoints - 1,
      stats: { ...state.stats, 银钱: state.stats.银钱 - 1 },
      relations: {
        ...state.relations,
        [target]: Math.min(
          100,
          state.relations[target] + 10 + (residence.id === "chenglou" ? 5 : 0),
        ),
      },
      tags: [
        ...new Set([
          ...state.tags,
          "action_networked",
          `action_networked_chapter_${state.completedChapters.length + 1}_${state.actionPoints}`,
        ]),
      ],
    };
  }
  if (action === "raiseFunds") {
    const fundsTag = `action_raised_funds_chapter_${state.completedChapters.length + 1}`;
    if (state.tags.includes(fundsTag)) return state;
    return {
      ...state,
      actionPoints: state.actionPoints - 1,
      stats: {
        ...state.stats,
        体力: state.stats.体力 - 1,
        银钱: Math.min(10, state.stats.银钱 + 2),
      },
      relations: {
        ...state.relations,
        高福安: Math.max(-100, state.relations.高福安 - 10),
      },
      tags: [
        ...new Set([
          ...state.tags,
          "action_raised_funds",
          "debt:高福安",
          fundsTag,
        ]),
      ],
    };
  }
  return {
    ...state,
    actionPoints: state.actionPoints - 1,
    stats: {
      ...state.stats,
      体力: Math.min(
        10,
        state.stats.体力 +
          (state.stats.体力 <= 2 ? 3 : 2) +
          (residence.id === "jinghe" ? 1 : 0),
      ),
    },
    tags: [...new Set([...state.tags, "action_rested"])],
  };
}

const endingTitles = {
  "phoenix-throne": "凤座无眠",
  regent: "垂帘听政",
  "dual-palaces": "两宫共治",
  "minghua-alliance": "明华同盟",
  "shadow-network": "墨中无名",
  "jade-reform": "青简新章",
  gatekeeper: "守门之人",
  "spring-beyond-palace": "宫外春深",
  "palace-history": "一卷宫史",
  "golden-cage": "金笼",
  scapegoat: "代罪之人",
  "closed-gate": "宫门未开",
} as const;

export function resolveEnding(state: GameState) {
  const has = (tag: string) => state.tags.includes(tag);
  let id: keyof typeof endingTitles;
  if (has("ch11_truth_traded") && has("ch12_truth_sealed")) id = "closed-gate";
  else if (has("ch11_self_hostage") && has("ch12_full_truth")) id = "scapegoat";
  else if (has("ch12_freedom") && has("ending_palace_history"))
    id = "palace-history";
  else if (has("ch12_freedom")) id = "spring-beyond-palace";
  else if (has("ch12_truth_sealed")) id = "shadow-network";
  // 「守门之人」原本只有裴照南这一条路。但这个结局的内核是
  // "有人愿意为真相守住一道门"——你在第5章保下、并在第8章
  // 让她开口的温疏雨，同样是那个守门的人。
  else if (
    has("ch12_reform") &&
    (has("ch7_pei_truth") || has("ch8_wen_testifies"))
  )
    id = "gatekeeper";
  else if (has("ch12_reform") || has("ending_jade_reform")) id = "jade-reform";
  else if (has("ch8_gu_ascends")) id = "minghua-alliance";
  else if (has("ch8_dual_rule")) id = "dual-palaces";
  else if (has("ch10_player_regent") || has("ch7_emperor_wounded"))
    id = "regent";
  else if (state.relations.沈令仪 < 0 && state.relations.顾明华 < 0)
    id = "golden-cage";
  else id = "phoenix-throne";
  return { id, title: endingTitles[id] };
}
export function serialize(state: GameState) {
  return JSON.stringify(state);
}
export function resumeDestination(state: GameState): "hub" | "play" {
  return state.sceneId === "evaluation" ||
    state.sceneId === "result" ||
    /^day(?:[2-9]|1[0-2])_result$/.test(state.sceneId)
    ? "play"
    : "hub";
}
export function deserialize(raw: string): GameState | null {
  try {
    const p = JSON.parse(raw);
    if (
      !p ||
      typeof p.name !== "string" ||
      !(p.origin in origins) ||
      (p.zodiac !== undefined && !(p.zodiac in zodiacs))
    )
      return null;
    const fresh = createGame(
      p.name,
      p.origin,
      p.seed || 1,
      p.zodiac || "rabbit",
    );
    const completedChapters: ChapterId[] = Array.isArray(p.completedChapters)
      ? p.completedChapters.filter(
          (chapterId: unknown): chapterId is ChapterId =>
            chapterId === "chapter-1" ||
            chapterId === "chapter-2" ||
            chapterId === "chapter-3" ||
            chapterId === "chapter-4" ||
            chapterId === "chapter-5" ||
            chapterId === "chapter-6" ||
            chapterId === "chapter-7" ||
            chapterId === "chapter-8" ||
            chapterId === "chapter-9" ||
            chapterId === "chapter-10" ||
            chapterId === "chapter-11" ||
            chapterId === "chapter-12",
        )
      : [];
    const savedRewards = Array.isArray(p.rewards) ? p.rewards : [];
    const canonicalRewards: GameState["rewards"] = completedChapters.flatMap(
      (chapterId: ChapterId) => chapterRewards[chapterId]?.rewards ?? [],
    );
    const rewards: GameState["rewards"] = [...savedRewards];
    canonicalRewards.forEach((reward) => {
      const savedIndex = rewards.findIndex((saved) => saved.id === reward.id);
      if (savedIndex === -1) {
        rewards.push(reward);
      } else {
        rewards[savedIndex] = {
          ...reward,
          ...rewards[savedIndex],
          asset: reward.asset,
        };
      }
    });
    const savedRank: Rank = rankOrder.includes(p.rank) ? p.rank : "答应";
    const progressRanks: Array<[ChapterId, Rank]> = [
      ["chapter-2", "常在"],
      ["chapter-3", "贵人"],
      ["chapter-5", "嫔"],
      ["chapter-7", "妃"],
      ["chapter-9", "贵妃"],
      ["chapter-11", "皇贵妃"],
    ];
    const migratedRank = progressRanks.reduce(
      (rank, [chapterId, earned]) =>
        completedChapters.includes(chapterId) &&
        rankOrder.indexOf(earned) > rankOrder.indexOf(rank)
          ? earned
          : rank,
      savedRank,
    );
    return {
      ...fresh,
      ...p,
      version: 8,
      stats: Object.fromEntries(
        (Object.keys(fresh.stats) as StatKey[]).map((stat) => {
          const saved = p.stats?.[stat];
          return [
            stat,
            typeof saved === "number" && Number.isFinite(saved)
              ? Math.max(0, Math.min(10, saved))
              : fresh.stats[stat],
          ];
        }),
      ) as GameState["stats"],
      relations: Object.fromEntries(
        (Object.keys(fresh.relations) as RelationKey[]).map((name) => {
          const saved = p.relations?.[name];
          const migrated =
            typeof saved === "number"
              ? p.version >= 7
                ? saved
                : saved * 10
              : 0;
          return [name, Math.max(-100, Math.min(100, migrated))];
        }),
      ) as Record<RelationKey, number>,
      tags: [
        ...new Set([
          ...(Array.isArray(p.tags) ? p.tags : []),
          ...(completedChapters.includes("chapter-1")
            ? ["day3_has_pearl"]
            : []),
        ]),
      ],
      history: Array.isArray(p.history) ? p.history : [],
      completedChapters,
      rank: p.rank || completedChapters.length ? migratedRank : undefined,
      rewards,
      growthPoints: typeof p.growthPoints === "number" ? p.growthPoints : 0,
      emperor: {
        favor: Math.max(
          0,
          Math.min(100, (p.emperor?.favor ?? 0) * (p.version >= 7 ? 1 : 10)),
        ),
        trust: Math.max(
          0,
          Math.min(100, (p.emperor?.trust ?? 0) * (p.version >= 7 ? 1 : 10)),
        ),
      },
      actionPoints:
        typeof p.actionPoints === "number"
          ? Math.max(
              0,
              Math.min(
                ACTION_POINT_CAP,
                p.actionPoints + (p.version >= 6 ? 0 : 2),
              ),
            )
          : Math.min(ACTION_POINT_CAP, completedChapters.length * 2 + 3),
      relationshipStrain: {
        ...Object.fromEntries(
          (Object.keys(fresh.relationshipStrain) as RelationKey[]).map(
            (name) => [
              name,
              typeof p.relationshipStrain?.[name] === "number" &&
              Number.isFinite(p.relationshipStrain[name])
                ? Math.max(0, Math.floor(p.relationshipStrain[name]))
                : 0,
            ],
          ),
        ),
      },
      resolvedSideStories: Array.isArray(p.resolvedSideStories)
        ? p.resolvedSideStories
        : [],
      chaptersWithoutEmperor:
        typeof p.chaptersWithoutEmperor === "number"
          ? Math.max(0, p.chaptersWithoutEmperor)
          : 0,
      resourcePressure: {
        exhaustion:
          typeof p.resourcePressure?.exhaustion === "number"
            ? Math.max(
                0,
                Math.min(3, Math.floor(p.resourcePressure.exhaustion)),
              )
            : 0,
        arrears:
          typeof p.resourcePressure?.arrears === "number"
            ? Math.max(0, Math.min(3, Math.floor(p.resourcePressure.arrears)))
            : 0,
      },
    };
  } catch {
    return null;
  }
}
