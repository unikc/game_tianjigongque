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
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    const siblings = backdrop?.parentElement
      ? Array.from(backdrop.parentElement.children).filter(
          (element): element is HTMLElement =>
            element instanceof HTMLElement && element !== backdrop,
        )
      : [];

    document.body.style.overflow = "hidden";
    siblings.forEach((element) => {
      element.inert = true;
    });
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !sheet) return;

      const focusable = Array.from(
        sheet.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      siblings.forEach((element) => {
        element.inert = false;
      });
      previousFocus?.focus();
    };
  }, [onClose]);
  return (
    <div
      ref={backdropRef}
      className="ids-sheet-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        ref={sheetRef}
        className="ids-bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ids-sheet-title"
      >
        <header>
          <h2 id="ids-sheet-title">{title}</h2>
          <button ref={closeRef} onClick={onClose} aria-label="关闭设置">
            ×
          </button>
        </header>
        {children}
      </section>
    </div>
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
