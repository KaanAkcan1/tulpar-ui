import { describe, it, expect } from "vitest";
import { tulparLight } from "../brand/tulpar/light";
import { tulparDark } from "../brand/tulpar/dark";
import type { FeedbackToneTokens } from "./feedback";

/**
 * Minimal WCAG 2.1 relative-luminance + contrast-ratio helper.
 * Accepts 3/6-digit hex (`#abc`, `#aabbcc`) and `rgb()/rgba()` strings
 * (alpha is ignored — feedback toasts sit on opaque surfaces, so the
 * worst-case opaque comparison is the meaningful accessibility floor).
 *
 * Copied verbatim from overlay.contrast.test.ts — do NOT hand-roll a new
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

const TONES = ["info", "success", "warning", "danger"] as const;

describe("feedback tone contrast matrix (WCAG AA)", () => {
  for (const { name: mode, tokens } of MODES) {
    for (const toneName of TONES) {
      const tone: FeedbackToneTokens = tokens.feedback.tone[toneName];

      it(`${mode}/${toneName}: onSurface vs surface >= 4.5 (body text AA)`, () => {
        expect(contrast(tone.onSurface, tone.surface)).toBeGreaterThanOrEqual(4.5);
      });

      it(`${mode}/${toneName}: border vs surface >= 3 (non-text UI boundary AA)`, () => {
        expect(contrast(tone.border, tone.surface)).toBeGreaterThanOrEqual(3);
      });

      it(`${mode}/${toneName}: accent vs surface >= 3 (timer-ring / accent line)`, () => {
        expect(contrast(tone.accent, tone.surface)).toBeGreaterThanOrEqual(3);
      });
    }
  }

  // High-contrast danger escalation: saturated surface + white text.
  // Both light and dark dangerHc are tested against the white `on` text.
  for (const { name: mode, tokens } of MODES) {
    const hc = tokens.feedback.dangerHc;

    it(`${mode}/dangerHc: on(white) vs surface >= 4.5 (body text AA)`, () => {
      expect(contrast(hc.on, hc.surface)).toBeGreaterThanOrEqual(4.5);
    });
  }
});
