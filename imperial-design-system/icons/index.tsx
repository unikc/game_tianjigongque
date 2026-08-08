export function SealIcon({ label = "御印" }: { label?: string }) {
  return (
    <span className="ids-icon-seal" role="img" aria-label={label}>
      印
    </span>
  );
}
export function ZodiacGlyph({
  glyph,
  label,
}: {
  glyph: string;
  label: string;
}) {
  return (
    <span className="ids-icon-zodiac" role="img" aria-label={label}>
      {glyph}
    </span>
  );
}
