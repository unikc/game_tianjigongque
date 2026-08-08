import type { AudioCue } from "./types";

export type AudioEvent =
  | "ui.press"
  | "choice.commit"
  | "paper.turn"
  | "seal.stamp"
  | "relationship.rise"
  | "relationship.fall"
  | "rank.promotion"
  | "scene.transition"
  | "tab.change"
  | "cloth.open"
  | "jade.touch"
  | "jade.advance"
  | "jade.locked";

/** Stable placeholder contract. Production sources are intentionally unset. */
export const audioCueSlots: Record<AudioEvent, Omit<AudioCue, "src">> = {
  "ui.press": {
    id: "ui-press",
    bus: "effects",
    preload: "eager",
    volume: 0.45,
  },
  "choice.commit": {
    id: "choice-commit",
    bus: "effects",
    preload: "scene",
    volume: 0.62,
  },
  "paper.turn": {
    id: "paper-turn",
    bus: "effects",
    preload: "scene",
    volume: 0.5,
  },
  "seal.stamp": {
    id: "seal-stamp",
    bus: "effects",
    preload: "scene",
    volume: 0.72,
  },
  "relationship.rise": {
    id: "relationship-rise",
    bus: "effects",
    preload: "lazy",
    volume: 0.55,
  },
  "relationship.fall": {
    id: "relationship-fall",
    bus: "effects",
    preload: "lazy",
    volume: 0.5,
  },
  "rank.promotion": {
    id: "rank-promotion",
    bus: "effects",
    preload: "scene",
    volume: 0.75,
  },
  "scene.transition": {
    id: "scene-transition",
    bus: "effects",
    preload: "scene",
    volume: 0.42,
  },
  "tab.change": {
    id: "tab-change",
    bus: "effects",
    preload: "eager",
    volume: 0.32,
  },
  "cloth.open": {
    id: "cloth-open",
    bus: "effects",
    preload: "scene",
    volume: 0.38,
  },
  "jade.touch": {
    id: "jade-touch",
    bus: "effects",
    preload: "eager",
    volume: 0.36,
  },
  "jade.advance": {
    id: "jade-advance",
    bus: "effects",
    preload: "scene",
    volume: 0.48,
  },
  "jade.locked": {
    id: "jade-locked",
    bus: "effects",
    preload: "lazy",
    volume: 0.28,
  },
};

export type SceneAudioProfile = {
  music?: string;
  ambience?: "palace" | "garden" | "wind" | "birds" | "night-insects" | "rain";
  futureVoice?: string;
};
