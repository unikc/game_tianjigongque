# Art direction and visual grammar

The palace is restrained, tactile and politically legible—not a generic dashboard. Rice paper carries narrative; ink carries secrets and political ambiguity; imperial red marks authority, danger or direct royal attention; old gold marks promotion, reward and rarity; jade marks learning, growth and skill. Royal blue is institutional distance; bronze is craft and inventory.

Use asymmetry, seals, plaques, ruled paper, negative space and layered architecture. Avoid glassmorphism, neon gradients, SaaS cards, emoji as production iconography, and decoration that competes with dialogue. UI ornament must clarify hierarchy or provenance.

## Read-only memory cards

- Use `ReadOnlyMemoryCard` only for a player-visible action that already happened; it is an `<article>`, never a button-like tile.
- Keep three layers: a 16–17 px named method, a concise 13–14 px description, and one 12–13 px human-readable source beginning with “见于”.
- Never show internal tags, weights, progress bars, personality scores or locked future methods.
- Show at most four cards, use a single column at 320–430 px, and do not add hover or pressed affordances.

Portraits preserve silhouette and facial identity across costumes and expressions. Keep the face, hairline, distinctive ornament, zodiac motif and palette anchors consistent. Backgrounds reserve a calm dialogue-safe area and encode location, time and mood in metadata.

## Screen modes

The four permanent destinations share tokens but not identical material treatment: 寝宫 uses atmospheric architecture and open depth; 人物 uses vertical silk-ledger rhythm; 珍藏 uses a lacquered display glow; 行录 uses ruled archival paper and full-bleed illustrated chapter covers. This distinction should remain subtle enough that navigation feels like moving through one palace rather than switching applications.

## Palace hub page layout

人物、珍藏、行录与设置 use the shared `HubPageHeader`; their title baseline, horizontal padding and first-content rhythm must remain identical at 320–430px portrait widths.

- The hub's `.paper` is the only page-level scrolling container. A tab must not introduce a competing root scroller.
- Root pages must not use an empty toolbar, negative margin or `:has()`-dependent spacer for alignment.
- A page header contains a 12px eyebrow, a 22–24px title at 1.25 leading, an optional 13px description of no more than two lines, and an optional trailing action with a 44px touch target.
- Optional actions live inside the header. If there is no action, no height is reserved for one.
- The header-to-first-component gap is 12px; gaps between peer sections are 16px. A page's first component must not add its own top margin.
- Bottom-navigation and safe-area avoidance belong only to `GameShell` / `ChapterHub`. Individual tabs must not add a second bottom-navigation spacer.
- Mode-specific materials may differ, but they begin after the same page header and may not move the title baseline.

## Ceremonial feedback

Relationship changes use a short silk-thread draw rather than generic dots. Rank and decree moments use a single physical seal-stamp motion. Motion is brief, purposeful and fully disabled by reduced-motion settings. Sound consumers listen for the `imperial:audio-cue` event; final mastered assets are supplied separately so UI code never hard-codes media files.

## Typography

On iOS, narrative copy uses the platform Songti family and controls use PingFang SC. Body dialogue targets 17px on standard iPhone widths, 16px on compact-height devices, with 1.7–1.8 leading. Labels remain sans-serif and never substitute letter spacing for hierarchy.
