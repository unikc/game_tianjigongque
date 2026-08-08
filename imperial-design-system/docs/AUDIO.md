# Audio

Audio is optional enhancement. Cues declare a stable ID, source, bus and preload policy. Buses are master, music, ambience, voice and effects; each has independent volume plus global mute. Scene ambience may preload at scene entry, voice is lazy, and music crossfades rather than overlaps.

The repository contains no copyrighted production audio. Future assets need provenance, license, loop points, loudness target, transcript for voice and a non-audio feedback equivalent. User settings persist independently from game saves. Audio failures must never block progression.

Stable semantic events live in `audio/cues.ts`. UI code emits semantic names rather than file paths so final licensed assets can be replaced without changing gameplay. Required families are music, palace/garden/weather ambience, UI press, choice, paper, brush, wood, jade, seal, relationship, achievement, promotion, scene transition and future voice. Every audible event requires a simultaneous visual state change; voice requires transcripts.
