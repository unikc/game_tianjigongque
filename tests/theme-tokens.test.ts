import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (file: string) => readFile(path.join(root, file), "utf8");

function hexToRgb(hex: string) {
  return [1, 3, 5].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16),
  );
}

function luminance(hex: string) {
  return hexToRgb(hex)
    .map((channel) => channel / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );
}

function contrast(foreground: string, background: string) {
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  );
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe("day and night theme tokens", () => {
  it("keeps night text roles above WCAG AA on both paper surfaces", async () => {
    const css = await read("imperial-design-system/tokens/tokens.css");
    const night = css.slice(css.indexOf('html[data-game-theme="night"]'));
    const token = (name: string) => {
      const value = night.match(
        new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, "i"),
      )?.[1];
      expect(value, name).toBeTruthy();
      return value!;
    };
    const paper = token("--ids-surface-paper");
    const raised = token("--ids-surface-raised");
    for (const role of [
      "--ids-color-ink",
      "--ids-color-fog",
      "--ids-color-jade",
      "--ids-color-imperial-red",
      "--ids-color-disabled",
      "--ids-color-warning",
    ]) {
      expect(contrast(token(role), paper), role).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(token("--ids-color-ink"), raised)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it("uses semantic surfaces for the highest-risk game components", async () => {
    const css = await read("app/globals.css");
    expect(css).toMatch(
      /\.choice\s*\{[\s\S]*?background: var\(--ids-surface-raised\)/,
    );
    expect(css).toMatch(
      /\.origin-card\s*\{[\s\S]*?background: var\(--ids-surface-raised\)/,
    );
    expect(css).toMatch(
      /\.contact-dossier\s*\{[\s\S]*?background: var\(--ids-surface-translucent\)/,
    );
    expect(css).not.toMatch(
      /html\[data-game-theme="night"\]\s*\{\s*--ids-color-ink/,
    );
  });
});
