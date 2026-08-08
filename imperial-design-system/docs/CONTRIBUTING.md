# Contributing

Before adding a component, confirm that at least two screens need the same interaction. Define its semantic state names, public props, empty/loading/error behavior, minimum 44px touch target, focus order, screen-reader announcement and reduced-motion behavior. Add a `/ids` example. Use tokens; add a semantic token when meaning is new rather than naming a color after one screen.

Changes must pass formatting, lint, typecheck, tests and production build. Visual changes should be checked at 320×568 and 390×844, with large text, keyboard-only input, reduced motion and high contrast.

Breaking API changes require a migration note. Do not put narrative branching or character-specific exceptions inside IDS.
