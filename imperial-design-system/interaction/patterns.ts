export type InteractionPattern = {
  id: string;
  intent: string;
  trigger: string;
  feedback: string;
  keyboard: string;
  screenReader: string;
};
export const interactionPatterns: InteractionPattern[] = [
  {
    id: "choose",
    intent: "commit a narrative choice",
    trigger: "tap or Enter/Space",
    feedback: "immediate outcome then state deltas",
    keyboard: "native button order",
    screenReader: "announce outcome through polite live region",
  },
  {
    id: "confirm-destructive",
    intent: "prevent accidental reset",
    trigger: "explicit confirmation",
    feedback: "modal focus and clear consequence",
    keyboard: "Escape cancels; focus contained by app inert state",
    screenReader: "alertdialog with title and description",
  },
  {
    id: "inspect-stats",
    intent: "optional secondary detail",
    trigger: "details summary",
    feedback: "expanded state",
    keyboard: "native summary",
    screenReader: "native disclosure semantics",
  },
];
