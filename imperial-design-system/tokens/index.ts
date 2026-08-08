export const tokens = {
  color: {
    authority: "var(--ids-color-imperial-red)",
    reward: "var(--ids-color-old-gold)",
    narrative: "var(--ids-color-rice-paper)",
    intrigue: "var(--ids-color-ink)",
    growth: "var(--ids-color-jade)",
  },
  touchTarget: "var(--ids-touch-min)",
  duration: {
    fast: "var(--ids-duration-fast)",
    standard: "var(--ids-duration-standard)",
    scene: "var(--ids-duration-scene)",
  },
} as const;

export const visualSemantics = {
  authority: "Imperial Red — authority, danger, royal attention",
  reward: "Old Gold — promotion, reward, rarity",
  growth: "Jade — growth, learning, skills",
  intrigue: "Ink — politics, secrets, concealed information",
  narrative: "Rice Paper — dialogue, memory, story",
} as const;
