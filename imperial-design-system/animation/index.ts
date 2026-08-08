export type MotionPreference = "full" | "reduced";
export type AnimationPrimitive =
  | "fade"
  | "slide"
  | "seal-stamp"
  | "portrait-enter"
  | "scene-transition"
  | "number-change";
export const animationClass = (primitive: AnimationPrimitive) =>
  `ids-motion-${primitive}`;
export const motionPolicy = {
  maxDecorativeDurationMs: 480,
  reducedMotionDurationMs: 1,
  neverAnimateEssentialText: true,
} as const;
