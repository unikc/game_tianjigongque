import Image from "next/image";
import type { PortraitExpression } from "./types";

export type PortraitCharacter = {
  name: string;
  portrait: string;
  zodiacIcon: string;
  archetype: string;
  expressions?: Partial<Record<PortraitExpression, string>>;
  focalPoint?: { x: number; y: number };
};

export function Portrait({
  character,
  kind,
  expression = "neutral",
  priority = false,
}: {
  character?: PortraitCharacter;
  kind: string;
  expression?: PortraitExpression;
  priority?: boolean;
}) {
  if (!character)
    return (
      <div className={`portrait ${kind}`} role="img" aria-label="角色剪影">
        <i aria-hidden="true" />
      </div>
    );
  const src = character.expressions?.[expression] ?? character.portrait;
  return (
    <figure
      className={`portrait portrait-art ${kind}`}
      aria-label={`${character.name}，${expression}`}
    >
      <Image
        src={src}
        alt={`${character.name}立绘`}
        fill
        sizes="(max-width: 620px) 100vw, 240px"
        priority={priority}
        unoptimized
        style={{
          objectPosition: `${character.focalPoint?.x ?? 50}% ${character.focalPoint?.y ?? 18}%`,
        }}
      />
      <figcaption aria-hidden="true">
        <span>{character.zodiacIcon}</span>
        {character.archetype}
      </figcaption>
    </figure>
  );
}
