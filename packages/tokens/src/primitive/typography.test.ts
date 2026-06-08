import { describe, it, expect } from "vitest";
import { primitiveTypography } from "./typography";

describe("primitiveTypography", () => {
  it("provides display + ui + mono font family stacks", () => {
    expect(primitiveTypography.fontFamily.display).toContain("Source Serif 4");
    expect(primitiveTypography.fontFamily.ui).toContain("Source Sans 3");
    expect(primitiveTypography.fontFamily.mono).toContain("monospace");
  });

  it("does NOT expose the deprecated v0.1 `body` font family (renamed to `ui`)", () => {
    expect(
      (primitiveTypography.fontFamily as Record<string, string>).body,
    ).toBeUndefined();
  });

  it("provides 11-step type scale from xs to 7xl", () => {
    expect(primitiveTypography.fontSize.xs).toBe("12px");
    expect(primitiveTypography.fontSize.sm).toBe("14px");
    expect(primitiveTypography.fontSize.md).toBe("16px");
    expect(primitiveTypography.fontSize.lg).toBe("18px");
    expect(primitiveTypography.fontSize.xl).toBe("20px");
    expect(primitiveTypography.fontSize["2xl"]).toBe("24px");
    expect(primitiveTypography.fontSize["3xl"]).toBe("30px");
    expect(primitiveTypography.fontSize["4xl"]).toBe("36px");
    expect(primitiveTypography.fontSize["5xl"]).toBe("48px");
    expect(primitiveTypography.fontSize["6xl"]).toBe("60px");
    expect(primitiveTypography.fontSize["7xl"]).toBe("72px");
  });

  it("provides font weights including the new heavy 800", () => {
    expect(primitiveTypography.fontWeight.normal).toBe(400);
    expect(primitiveTypography.fontWeight.medium).toBe(500);
    expect(primitiveTypography.fontWeight.semibold).toBe(600);
    expect(primitiveTypography.fontWeight.bold).toBe(700);
    expect(primitiveTypography.fontWeight.heavy).toBe(800);
  });

  it("provides line heights tight/snug/normal/relaxed (v0.1 `tight` 1.2 is now `snug`)", () => {
    expect(primitiveTypography.lineHeight.tight).toBe(1.05);
    expect(primitiveTypography.lineHeight.snug).toBe(1.2);
    expect(primitiveTypography.lineHeight.normal).toBe(1.55);
    expect(primitiveTypography.lineHeight.relaxed).toBe(1.75);
  });

  it("provides letter spacing tighter/tight/normal/wide/wider", () => {
    expect(primitiveTypography.letterSpacing.tighter).toBe("-0.03em");
    expect(primitiveTypography.letterSpacing.tight).toBe("-0.015em");
    expect(primitiveTypography.letterSpacing.normal).toBe("0");
    expect(primitiveTypography.letterSpacing.wide).toBe("0.025em");
    expect(primitiveTypography.letterSpacing.wider).toBe("0.08em");
  });
});
