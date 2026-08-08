import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "../utilities/cx";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "text";
  }
>(function Button({ variant = "primary", className, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cx(variant === "text" ? "text-button" : variant, className)}
      {...props}
    />
  );
});
export function ChoiceButton({
  index,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { index: number }) {
  return (
    <button className="choice" {...props}>
      <span aria-hidden="true">{["一", "二", "三", "四", "五"][index]}</span>
      {children}
    </button>
  );
}
export function SaveIndicator({ label = "本局已存" }) {
  return (
    <span className="save" role="status">
      {label}
    </span>
  );
}
export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safe)}
    >
      <i style={{ width: `${safe}%` }} />
    </div>
  );
}
export function CharacterNamePlate({ children }: { children: ReactNode }) {
  return <span className="speaker">{children}</span>;
}
export function RankBadge({ children }: { children: ReactNode }) {
  return <div className="plaque">{children}</div>;
}
export function ImperialSeal({ children }: { children: ReactNode }) {
  return (
    <div className="seal" aria-hidden="true">
      {children}
    </div>
  );
}
export function StatChip({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="stat">
      {label}
      <b>{value}</b>
    </div>
  );
}
export function RelationshipCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  const direction =
    value > 10 ? "positive" : value < -10 ? "negative" : "neutral";
  const status =
    value >= 86
      ? "生死之交"
      : value >= 61
        ? "同盟"
        : value >= 31
          ? "亲近"
          : value >= 11
            ? "熟悉"
            : value <= -61
              ? "死敌"
              : value <= -31
                ? "敌视"
                : value <= -11
                  ? "疏远"
                  : "初识";
  return (
    <div className="relation" data-direction={direction}>
      <div className="relation-heading">
        <span>{label}</span>
        <b>{status}</b>
      </div>
      <div
        className="relation-axis"
        role="meter"
        aria-label={`${label}关系`}
        aria-valuemin={-100}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={status}
      >
        <i style={{ width: `${(Math.abs(value) / 100) * 50}%` }} />
        <em aria-hidden="true" />
      </div>
      <div className="relation-legend" aria-hidden="true">
        <span>疏远</span>
        <span>初识</span>
        <span>亲近</span>
      </div>
    </div>
  );
}
export function StatBar({
  label,
  value,
  max = 100,
}: {
  label: string;
  value: number;
  max?: number;
}) {
  return (
    <div className="ids-stat-bar">
      <span>{label}</span>
      <ProgressBar label={label} value={(value / max) * 100} />
    </div>
  );
}
