import { describe, it, expect } from "vitest";
import { tulparLight } from "../brand/tulpar/light";
import { tulparDark } from "../brand/tulpar/dark";

/**
 * Minimal WCAG 2.1 relative-luminance + contrast-ratio helper.
 * Accepts 3/6-digit hex (`#abc`, `#aabbcc`) and `rgb()/rgba()` strings
 * (alpha is ignored — atoms sit on opaque surfaces, so the worst-case
 * opaque comparison is the meaningful accessibility floor).
 *
 * Copied verbatim from feedback.contrast.test.ts — do NOT hand-roll a new
 * helper; keep these in sync if the algorithm changes.
 */
function parseColor(input: string): [number, number, number] {
  const s = input.trim();
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((ch) => ch + ch)
        .join("");
    }
    const n = parseInt(hex, 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    return [parts[0], parts[1], parts[2]];
  }
  throw new Error(`Unsupported color: ${input}`);
}

function luminance(color: string): number {
  const [r, g, b] = parseColor(color).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const MODES = [
  { name: "light", tokens: tulparLight },
  { name: "dark", tokens: tulparDark },
] as const;

describe("atom tone contrast matrix (WCAG AA)", () => {
  for (const { name: mode, tokens } of MODES) {
    for (const t of ["neutral", "info", "success", "warning", "danger"] as const) {
      const a = tokens.atom.tone[t];
      it(`${mode}/${t} soft text vs surface >= 4.5`, () =>
        expect(contrast(a.soft.text, a.soft.surface)).toBeGreaterThanOrEqual(4.5));
      it(`${mode}/${t} soft border vs surface >= 3`, () =>
        expect(contrast(a.soft.border, a.soft.surface)).toBeGreaterThanOrEqual(3));
      it(`${mode}/${t} outline border vs page >= 3`, () =>
        expect(contrast(a.outline.border, tokens.color.bg.surface)).toBeGreaterThanOrEqual(3));
      it(`${mode}/${t} outline text vs page >= 4.5`, () =>
        expect(contrast(a.outline.text, tokens.color.bg.surface)).toBeGreaterThanOrEqual(4.5));
      it(`${mode}/${t} solid text vs bg >= 4.5`, () =>
        expect(contrast(a.solid.text, a.solid.bg)).toBeGreaterThanOrEqual(4.5));
    }
  }
});
