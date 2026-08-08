export type AudioBus = "master" | "music" | "ambience" | "voice" | "effects";
export type AudioCue = {
  id: string;
  src: string;
  bus: AudioBus;
  preload: "eager" | "scene" | "lazy";
  loop?: boolean;
  volume?: number;
};
export type AudioSettings = {
  muted: boolean;
  volumes: Record<AudioBus, number>;
};
export interface AudioEngine {
  play(cue: AudioCue): Promise<void>;
  stop(id: string, fadeMs?: number): void;
  crossfade(from: string, to: AudioCue, durationMs: number): Promise<void>;
  preload(cues: AudioCue[]): Promise<void>;
  setSettings(settings: AudioSettings): void;
}
export const defaultAudioSettings: AudioSettings = {
  muted: false,
  volumes: { master: 1, music: 0.65, ambience: 0.7, voice: 1, effects: 0.8 },
};
