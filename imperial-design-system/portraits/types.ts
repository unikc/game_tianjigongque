export type PortraitExpression =
  | "neutral"
  | "pleased"
  | "displeased"
  | "suspicious"
  | "surprised"
  | "sad";
export type PortraitCostume = "formal" | "court" | "private" | "seasonal";
export type PortraitPose = "front" | "three-quarter" | "profile";

export type PortraitSet = {
  characterId: string;
  defaultExpression: PortraitExpression;
  defaultCostume: PortraitCostume;
  assets: Partial<
    Record<`${PortraitCostume}:${PortraitExpression}:${PortraitPose}`, string>
  >;
  placeholder: { monogram: string; accent: string };
};
