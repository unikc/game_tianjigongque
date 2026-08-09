import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../utilities/cx";
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

/** Shared paper panel for same-level palace home modules. */
export function PalacePanel({
  tone = "jade",
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  tone?: "jade" | "imperial" | "gold" | "neutral";
}) {
  return (
    <section
      className={cx("ids-palace-panel", `ids-palace-panel-${tone}`, className)}
      {...props}
    />
  );
}

/** Shared title rhythm for every root page inside the palace hub. */
export function HubPageHeader({
  eyebrow,
  title,
  titleId,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="ids-hub-page-header">
      <div>
        <span className="section-label">{eyebrow}</span>
        <h2 id={titleId}>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="ids-hub-page-header-action">{action}</div>}
    </header>
  );
}

/** Read-only record of a player-visible action; never presents hidden scoring. */
export function ReadOnlyMemoryCard({
  title,
  children,
  source,
}: {
  title: string;
  children: ReactNode;
  source: string;
}) {
  return (
    <article className="ids-memory-card">
      <h3>{title}</h3>
      <p>{children}</p>
      <small>{source}</small>
    </article>
  );
}
