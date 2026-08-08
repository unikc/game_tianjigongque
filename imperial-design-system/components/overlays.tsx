"use client";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "./primitives";

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ids-modal-title"
      >
        <h2 id="ids-modal-title">{title}</h2>
        {children}
        <Button ref={closeRef} variant="secondary" onClick={onClose}>
          关闭
        </Button>
      </div>
    </div>
  );
}
export function ConfirmationDialog({
  eyebrow,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="dialog-backdrop">
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="ids-confirm-title"
        aria-describedby="ids-confirm-description"
      >
        <span className="eyebrow">{eyebrow}</span>
        <h2 id="ids-confirm-title">{title}</h2>
        <p id="ids-confirm-description">{description}</p>
        <div className="actions">
          <Button onClick={onConfirm} autoFocus>
            {confirmLabel}
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
export function Toast({ children }: { children: ReactNode }) {
  return (
    <div className="ids-toast" role="status" aria-live="polite">
      {children}
    </div>
  );
}
export function BottomSheet({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="ids-bottom-sheet" aria-label={title}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
export const Drawer = BottomSheet;
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <span className="ids-tooltip" data-tooltip={label}>
      {children}
    </span>
  );
}
