import type { PortraitExpression } from "../portraits/types";

export type CharacterBible = {
  id: string;
  displayName: string;
  nameVariants: Record<string, string>;
  rank: string;
  faction: string;
  zodiac: string;
  ageBand: string;
  pronouns: string;
  archetype: string;
  publicPersona: string;
  hiddenMotivation: string;
  fears: string[];
  desires: string[];
  secrets: string[];
  speech: {
    register: string;
    rhythm: string;
    verbalTics: string[];
    forbiddenPhrases: string[];
  };
  visual: {
    silhouette: string;
    palette: string[];
    materials: string[];
    motifs: string[];
    distinguishingFeatures: string[];
  };
  portrait: {
    base: string;
    expressions: Partial<Record<PortraitExpression, string>>;
    altText: string;
  };
  relationshipAxes: string[];
  narrativeRoles: string[];
  localizationNotes: string[];
  voiceDirection: string;
  aiArtPrompt: { positive: string; negative: string; seedNotes: string };
  continuity: { introducedIn: string; lastUpdated: string; owner: string };
};
