# Imperial Design System (IDS)

IDS is the product contract between narrative, interface, art, audio and engineering for **天机宫阙**. The playable game imports from the root barrel; authoring tools may import narrower modules. Gameplay rules and story content remain in `src/game`.

## Architecture

```text
story/state ──> screen composition ──> IDS components ──> tokens/theme
                                      ├─ portraits/illustrations/backgrounds
                                      ├─ interaction/accessibility
                                      ├─ animation/motion
                                      └─ audio
```

Rules:

1. Content owns words and branching; IDS owns presentation and interaction.
2. Components use semantic tokens. A component must not infer story outcomes.
3. Asset registries use stable IDs; filenames and providers are replaceable.
4. All controls work with touch, keyboard, reduced motion and screen readers.
5. New primitives require a handbook example and an accessibility note.

## Modules

- `tokens`: semantic values and visual meaning.
- `components`: controls, cards, feedback and overlays.
- `layouts`: safe-area-aware game shells and palace backgrounds.
- `portraits`, `illustrations`, `characters`, `chibi`: art contracts and metadata.
- `animation`, `motion`: named, reduced-motion-safe transitions.
- `audio`: engine-neutral cue, bus and settings contracts.
- `interaction`: input and feedback patterns.
- `storybook`: catalog metadata; the rendered handbook is `/ids`.
- `docs`: production guidance.

## Import convention

```tsx
import {
  ChoiceButton,
  Portrait,
  ProgressBar,
} from "../../imperial-design-system";
```

Use deep imports only in infrastructure code to avoid accidental coupling. No component may import from `src/game`.

## Premium composition rules

- Typography: narrative serif at 17–18px/1.82; UI sans at 12–16px. Chinese tracking stays modest except for ceremonial metadata.
- Hierarchy: every screen has one visual focus and one primary action. Cinnabar is reserved for authority, danger and irreversible action.
- Surfaces: canvas has no border, quiet cards use one hairline or one soft shadow, ceremonial objects alone may use double borders.
- Rhythm: use the 4px spacing scale, with 12–20px between related groups and 24–40px between narrative sections.
- Portraits: keep a consistent eye line, shoulder scale and upper-third face placement; dialogue portraits leave negative space toward copy.
- Illustration spacing: important chapter art receives a 4:3 or 16:9 field and is never reduced to a decorative icon when it carries emotion.
- Interaction: controls remain at least 44px, touch feedback is immediate, and destructive actions require confirmation.
- Motion: nothing pops; scene, portrait, dialogue, relationship and decree motion follow the six named patterns in `docs/ANIMATION.md`.
- Audio: UI emits semantic cue IDs from `audio/cues.ts`; missing audio must remain silent and never block progress.
