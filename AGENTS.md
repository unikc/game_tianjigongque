# Project instructions

## Goal

Build a tasteful, humorous, historically inspired Chinese palace narrative game. Modern workplace parallels stay implicit and player-facing copy must not use modern business jargon.

## Code

- Use TypeScript with explicit game-domain types and pure state transition functions.
- Keep narrative content data-driven; do not grow one giant conditional component.
- Use local component state and versioned localStorage only. Do not add a backend without a new requirement.
- Keep stats small, relationships clamped to -3…+3, and seeded outcomes deterministic.

## Narrative

- Maintain fictional people and dynasty. Prefer elegant, concise Chinese with restrained absurdity.
- Every choice must reveal character or change visible/hidden state; avoid one obvious best answer.
- Keep hidden motives and scoring invisible to the player.

## Experience

- Design from 320–430 px portrait screens first. No horizontal scrolling; touch targets are at least 44 px.
- Preserve semantic controls, keyboard focus, strong contrast, useful accessible names, and reduced-motion support.
- Images must be local AVIF/WebP (or intentional CSS placeholders), include stable dimensions, and must not imitate identifiable actors or television characters.
- Before finishing, run lint, typecheck, tests, formatting check, and production build.

## Permanent specialist reviews

The repository includes two non-coding specialist agents:

- `AGENTS/ImperialArtDirector.md` guards visual design, typography, illustration, character framing, motion, sound coordination, accessibility and presentation quality.
- `AGENTS/ImperialNarrativeDirector.md` guards story architecture, character consistency, romance, political logic, choice quality, continuity, humor and long-term narrative memory.

For material changes to visual layout, typography, character presentation, art, animation, sound, onboarding, chapter presentation, result screens or major interaction patterns:

1. Inspect the current implementation.
2. Ask the Imperial Art Director to review the relevant experience.
3. Record prioritized P0–P3 recommendations.
4. Implement the highest-value changes in the Imperial Design System when the issue repeats.
5. Review the result against the same criteria.
6. Run accessibility, performance and normal quality checks.

For new chapters, major scenes, recurring NPCs, romance, political conflict, endings, mysteries, factions or major worldbuilding:

1. Inspect `docs/narrative/` and current content data.
2. Ask the Imperial Narrative Director to review the proposal.
3. Record continuity and logic constraints and write a brief story plan.
4. Implement the content.
5. Run a second narrative review and update narrative documentation.
6. Run normal quality checks.

For major scenes, the Narrative Director first defines what the player should feel; the Art Director then defines how presentation and sound support that feeling. Neither review is required for trivial code-only refactors or typo fixes.
