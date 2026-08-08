# Mobile performance and offline strategy

Ship the current scene's formal portrait eagerly; lazy-load alternate expressions, later scenes and handbook code. Use responsive AVIF/WebP with explicit dimensions and keep CSS placeholders available. Backgrounds and music load by chapter manifests, not global imports. Registries allow asset URLs to move to a CDN without changing content.

Cache the application shell, tokens, fonts and current chapter manifest for offline play. Queue save writes locally and reconcile only when cloud saves exist. Budgets: no layout shift from art, one active music stream, one ambience stream, bounded decoded audio, and no animation requiring continuous main-thread work.

Run bundle analysis before adding art libraries. Prefer CSS/SVG for seals, frames and simple motifs; code-split `/ids` from the player route.

## Shipping image policy

Keep PNG source masters, but runtime references must use local WebP or AVIF. Portraits, chapter covers, backgrounds, protagonist stages and item art are encoded at WebP quality 82. Every portrait records a stable focal point; chapter art uses fixed cover dimensions to prevent layout shift.
