export type IllustrationMetadata = {
  id: string;
  asset: string;
  sceneIds: string[];
  characters: string[];
  location: string;
  timeOfDay: string;
  mood: string;
  palette: string[];
  focalPoint: string;
  spoilerLevel: "none" | "chapter" | "ending";
  altText: string;
  generation: {
    model?: string;
    prompt: string;
    negativePrompt: string;
    seed?: string;
    sourceRights: string;
  };
  cropSafeAreas: Array<"portrait" | "landscape" | "square">;
};
