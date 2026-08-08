export type SceneBackground = {
  id: string;
  label: string;
  time: "dawn" | "day" | "dusk" | "night";
  mood: "ceremonial" | "quiet" | "tense" | "intimate";
  asset?: string;
  fallback: "palace-css";
};

export const backgrounds: Record<string, SceneBackground> = {
  "palace-courtyard-day": {
    id: "palace-courtyard-day",
    label: "承熙宫外朝",
    time: "day",
    mood: "ceremonial",
    fallback: "palace-css",
    asset: "/backgrounds/palace-courtyard-spring-v01.webp",
  },
  "palace-courtyard-spring": {
    id: "palace-courtyard-spring",
    label: "春日宫门",
    time: "dawn",
    mood: "quiet",
    fallback: "palace-css",
    asset: "/backgrounds/palace-courtyard-spring-v01.webp",
  },
  "banquet-hall-empty-seat": {
    id: "banquet-hall-empty-seat",
    label: "宫宴空席",
    time: "dusk",
    mood: "tense",
    fallback: "palace-css",
    asset: "/backgrounds/banquet-hall-empty-seat-v01.webp",
  },
};
