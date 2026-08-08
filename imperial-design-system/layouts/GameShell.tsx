"use client";
import { useLayoutEffect, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { cx } from "../utilities/cx";
import { backgrounds } from "../backgrounds/registry";

export function PalaceBackground({ sceneId = "palace-courtyard-day" }) {
  const background =
    backgrounds[sceneId] ?? backgrounds["palace-courtyard-day"];
  return (
    <div
      className="palace palace-illustrated"
      aria-hidden="true"
      data-background={sceneId}
      style={
        background.asset
          ? {
              backgroundImage: `linear-gradient(rgb(15 34 32 / 24%), rgb(15 34 32 / 55%)), url(${background.asset})`,
            }
          : undefined
      }
    >
      <div className="palace-layer palace-layer-mist" />
      <div className="palace-layer palace-layer-light" />
      <div className="palace-layer palace-layer-foreground" />
      <div className="sun" />
      <div className="roof" />
      <div className="pillars" />
      <div className="cloud one" />
      <div className="cloud two" />
    </div>
  );
}

export function GameShell({
  children,
  viewId,
  immersive = false,
  compact = false,
  backgroundId,
}: {
  children: ReactNode;
  viewId: string;
  immersive?: boolean;
  compact?: boolean;
  backgroundId?: string;
}) {
  const paperRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    paperRef.current?.scrollTo({ top: 0 });
  }, [viewId]);
  const announceAudioCue = (event: MouseEvent<HTMLElement>) => {
    const button = (event.target as HTMLElement).closest("button");
    if (!button || button.disabled) return;
    const cue =
      button.dataset.audioCue ??
      (button.classList.contains("primary") ? "ui.primary" : "ui.press");
    window.dispatchEvent(
      new CustomEvent("imperial:audio-cue", { detail: { cue } }),
    );
  };
  return (
    <main className="game-shell" onClickCapture={announceAudioCue}>
      <PalaceBackground sceneId={backgroundId} />
      <section
        className={cx("paper", immersive && "immersive", compact && "compact")}
        ref={paperRef}
      >
        {children}
      </section>
    </main>
  );
}
