export type StatKey =
  | "才学"
  | "谋略"
  | "胆识"
  | "礼仪"
  | "人情"
  | "体力"
  | "银钱"
  | "名望";
export type RelationKey = "沈令仪" | "顾明华" | "高福安";
export type OriginId = "scholar" | "merchant" | "general";
export type ZodiacId = "rabbit" | "tiger" | "monkey" | "ox";
export type Effect = {
  stats?: Partial<Record<StatKey, number>>;
  relations?: Partial<Record<RelationKey, number>>;
  emperor?: { favor?: number; trust?: number };
  tags?: string[];
};
export type Choice = {
  id: string;
  text: string;
  outcome: string;
  effect: Effect;
  next: string;
  requiresZodiac?: ZodiacId;
  requiresRank?: Rank;
  requiresTag?: string;
  requiresStat?: { stat: StatKey; min: number };
  requiresEmperor?: { favor?: number; trust?: number };
  requiresRewardId?: string;
  requiresAnyTag?: string[];
  excludesTag?: string;
  requiresRelation?: { name: RelationKey; min?: number; max?: number };
};
export type PromotionRoute = "帝心" | "清议" | "人脉";
export type PromotionDecision = {
  from: Rank;
  to?: Rank;
  status: "promoted" | "held" | "none";
  route?: PromotionRoute;
  criteria: Array<{ route: PromotionRoute; met: boolean; label: string }>;
};
export type Scene = {
  id: string;
  title: string;
  speaker?: string;
  portrait?: "queen" | "zhaoyi" | "eunuch" | "duck";
  portraitLabel?: string;
  backgroundId?: string;
  chapterLabel?: string;
  progress?: { current: number; total: number };
  text: string;
  choices: Choice[];
};
export type GameState = {
  version: 7;
  name: string;
  origin: OriginId;
  zodiac: ZodiacId;
  sceneId: string;
  stats: Record<StatKey, number>;
  relations: Record<RelationKey, number>;
  history: string[];
  tags: string[];
  seed: number;
  introCompleted: boolean;
  rank?: Rank;
  completedChapters: ChapterId[];
  rewards: Reward[];
  growthPoints: number;
  emperor: { favor: number; trust: number };
  actionPoints: number;
  relationshipStrain: Record<RelationKey, number>;
  resolvedSideStories: string[];
  chaptersWithoutEmperor: number;
};
export type Rank =
  | "答应"
  | "常在"
  | "贵人"
  | "嫔"
  | "妃"
  | "贵妃"
  | "皇贵妃"
  | "皇后";
export type ChapterId =
  | "chapter-1"
  | "chapter-2"
  | "chapter-3"
  | "chapter-4"
  | "chapter-5"
  | "chapter-6"
  | "chapter-7"
  | "chapter-8"
  | "chapter-9"
  | "chapter-10"
  | "chapter-11"
  | "chapter-12";
export type Reward = {
  id: string;
  name: string;
  description: string;
  kind: "title" | "keepsake" | "item";
  asset?: string;
  rarity?: "common" | "rare" | "imperial";
  consumable?: boolean;
};

export type CharacterDefinition = {
  id: string;
  name: string;
  rank: string;
  zodiac: "rabbit" | "tiger" | "rat" | "ox";
  archetype: string;
  publicPersona: string;
  hiddenMotivation: string;
  portrait: string;
  focalPoint?: { x: number; y: number };
  expressions: Partial<
    Record<"neutral" | "pleased" | "displeased" | "suspicious", string>
  >;
  zodiacIcon: string;
  abilities: string[];
};
