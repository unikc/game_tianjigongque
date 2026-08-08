# Character bible

Every major NPC uses `CharacterBible`: identity and localized names; rank, faction and zodiac; archetype; public persona and hidden motivation; fears, desires and secrets; speech register, rhythm and forbidden phrases; silhouette, palette, materials, motifs and distinguishing features; portrait expressions; relationship axes; narrative roles; localization and voice notes; AI-art prompt provenance; continuity owner and dates.

Character records are source-of-truth metadata. Scene files reference character IDs. Portrait components choose an expression/costume asset and fall back to the formal neutral image or deterministic monogram placeholder.

## Mobile portrait standard

- Production crop is vertical 3:4, waist-up, three-quarter view unless a scene explicitly calls for profile.
- Eye line sits at 16–18% of the source image and must remain visible in 92×124 dossier crops and full-width dialogue crops.
- Record `focalPoint` with every portrait; never rely on browser-default center cropping.
- Use one soft directional light, rice-paper texture, restrained depth of field and a quiet palace environment. Avoid glossy photographic skin, anime exaggeration and actor likeness.
- Keep zodiac identity in motif, palette or gesture rather than a literal mascot.
- Character identity anchors—face shape, hairline, one ornament, dominant material and palette—must survive costume changes.

Current focal calibration: 沈令仪 50/17, 顾明华 49/16, 高福安 51/17, 萧承元 50/16, 林栖梧 50/17, 温疏雨 50/17, 裴照南 50/16.
