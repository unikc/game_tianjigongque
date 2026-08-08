import type { ReactNode } from "react";
export type PalaceCardKind =
  | "chapter"
  | "event"
  | "inventory"
  | "skill"
  | "achievement";
export function PalaceCard({
  kind,
  title,
  eyebrow,
  children,
  locked = false,
}: {
  kind: PalaceCardKind;
  title: string;
  eyebrow?: string;
  children?: ReactNode;
  locked?: boolean;
}) {
  return (
    <article
      className={`ids-card ids-card-${kind}`}
      data-locked={locked || undefined}
    >
      <span className="eyebrow">{eyebrow ?? kind}</span>
      <h3>{title}</h3>
      {children}
    </article>
  );
}
export const ChapterCard = PalaceCard;
export const EventCard = PalaceCard;
export const InventoryItem = PalaceCard;
export const SkillCard = PalaceCard;
export const AchievementCard = PalaceCard;
