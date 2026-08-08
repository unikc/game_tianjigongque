import type { ReactNode } from "react";
import { CharacterNamePlate, ImperialSeal } from "./primitives";

export function DialoguePanel({
  speaker,
  title,
  portrait,
  children,
  choices,
}: {
  speaker: string;
  title: string;
  portrait?: ReactNode;
  children: ReactNode;
  choices?: ReactNode;
}) {
  return (
    <section className="dialogue-screen" aria-labelledby="ids-dialogue-title">
      <div className="scene-head">
        <div>
          <CharacterNamePlate>{speaker}</CharacterNamePlate>
          <h2 id="ids-dialogue-title">{title}</h2>
        </div>
        {portrait}
      </div>
      <div className="dialogue">{children}</div>
      {choices && <div className="choices">{choices}</div>}
    </section>
  );
}
export function ImperialEdict({
  seal = "奉天承运",
  children,
}: {
  seal?: string;
  children: ReactNode;
}) {
  return (
    <article className="edict" data-audio-cue="ceremony.seal">
      <ImperialSeal>{seal}</ImperialSeal>
      {children}
    </article>
  );
}
export function LoadingScreen({ label = "正在启卷" }: { label?: string }) {
  return (
    <div className="center ids-loading" role="status" aria-live="polite">
      <ImperialSeal>候</ImperialSeal>
      <p>{label}</p>
    </div>
  );
}
