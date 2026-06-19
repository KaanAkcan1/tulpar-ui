import { describe, it, expect } from "vitest";

/**
 * Structural test for FeedbackTokens.
 *
 * Task 1.2 will add brand values (tulparLight.feedback); until then we
 * exercise the interface via a locally-declared sample object that must
 * satisfy the type.  This keeps the test honest about shape without
 * pulling in brand data that does not yet exist.
 */
import type { FeedbackTokens } from "./feedback";
// Value import so the module resolver fails fast when feedback.ts is absent.
import * as feedbackModule from "./feedback";

const TONE_KEYS = ["info", "success", "warning", "danger"] as const;

/** Minimal sample that satisfies the FeedbackTokens interface. */
const sample: FeedbackTokens = {
  tone: {
    info:    { surface: "#e0f2fe", onSurface: "#0c4a6e", border: "#7dd3fc", accent: "#0ea5e9" },
    success: { surface: "#dcfce7", onSurface: "#14532d", border: "#86efac", accent: "#22c55e" },
    warning: { surface: "#fef9c3", onSurface: "#713f12", border: "#fde047", accent: "#eab308" },
    danger:  { surface: "#fee2e2", onSurface: "#7f1d1d", border: "#fca5a5", accent: "#ef4444" },
  },
  dangerHc: { surface: "#991b1b", on: "#ffffff" },
  shadow: "0 4px 12px rgb(0 0 0 / 0.15)",
  zIndex: "9000",
  motion: {
    durationEnter:      "220ms",
    durationExit:       "160ms",
    durationReposition: "300ms",
    easing:             "cubic-bezier(.22,1,.36,1)",
    defaultDuration:    "5000ms",
    messageDuration:    "3000ms",
  },
  size: {
    toastMaxWidth:  "360px",
    toastPadding:   "12px 16px",
    messagePadding: "8px 14px",
    ringStroke:     "1.5px",
  },
};

describe("FeedbackTokens interface", () => {
  it("module exports at least the FeedbackTokens type (module resolves)", () => {
    // feedbackModule must resolve — this test fails if the file does not exist.
    expect(feedbackModule).toBeDefined();
  });

  it("sample satisfies FeedbackTokens (compile-time guard)", () => {
    // If this assignment compiled, the shape is correct.
    expect(sample).toBeDefined();
  });

  it("provides all four tone surfaces with surface/onSurface/border/accent", () => {
    for (const tone of TONE_KEYS) {
      const t = sample.tone[tone];
      expect(t.surface,   `${tone}.surface`).toBeDefined();
      expect(t.onSurface, `${tone}.onSurface`).toBeDefined();
      expect(t.border,    `${tone}.border`).toBeDefined();
      expect(t.accent,    `${tone}.accent`).toBeDefined();
    }
  });

  it("provides dangerHc with surface and on slots", () => {
    expect(sample.dangerHc.surface).toBeDefined();
    expect(sample.dangerHc.on).toBeDefined();
  });

  it("exposes a shadow string", () => {
    expect(typeof sample.shadow).toBe("string");
    expect(sample.shadow.length).toBeGreaterThan(0);
  });

  it("exposes a numeric zIndex string", () => {
    expect(sample.zIndex).toMatch(/^\d+$/);
  });

  it("exposes all six motion slots", () => {
    const { motion } = sample;
    expect(motion.durationEnter).toBeDefined();
    expect(motion.durationExit).toBeDefined();
    expect(motion.durationReposition).toBeDefined();
    expect(motion.easing).toBeDefined();
    expect(motion.defaultDuration).toBeDefined();
    expect(motion.messageDuration).toBeDefined();
  });

  it("pins canonical motion values in the sample", () => {
    expect(sample.motion.durationEnter).toBe("220ms");
    expect(sample.motion.durationExit).toBe("160ms");
    expect(sample.motion.durationReposition).toBe("300ms");
    expect(sample.motion.defaultDuration).toBe("5000ms");
    expect(sample.motion.messageDuration).toBe("3000ms");
  });

  it("exposes all four size slots", () => {
    const { size } = sample;
    expect(size.toastMaxWidth).toBeDefined();
    expect(size.toastPadding).toBeDefined();
    expect(size.messagePadding).toBeDefined();
    expect(size.ringStroke).toBeDefined();
  });

  it("pins canonical size values in the sample", () => {
    expect(sample.size.toastMaxWidth).toBe("360px");
    expect(sample.size.messagePadding).toBe("8px 14px");
  });
});
