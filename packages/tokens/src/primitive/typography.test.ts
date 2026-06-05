import { describe, it, expect } from "vitest";
import { primitiveTypography } from "./typography";

describe("primitiveTypography", () => {
  it("provides font family stacks", () => {
    expect(primitiveTypography.fontFamily.body).toContain("Inter");
    expect(primitiveTypography.fontFamily.mono).toContain("monospace");
  });

  it("provides font sizes from xs to 3xl", () => {
    expect(primitiveTypography.fontSize.xs).toBe("12px");
    expect(primitiveTypography.fontSize.sm).toBe("14px");
    expect(primitiveTypography.fontSize.md).toBe("16px");
    expect(primitiveTypography.fontSize["3xl"]).toBeDefined();
  });

  it("provides font weights", () => {
    expect(primitiveTypography.fontWeight.normal).toBe(400);
    expect(primitiveTypography.fontWeight.medium).toBe(500);
    expect(primitiveTypography.fontWeight.semibold).toBe(600);
    expect(primitiveTypography.fontWeight.bold).toBe(700);
  });

  it("provides line heights", () => {
    expect(primitiveTypography.lineHeight.tight).toBe(1.2);
    expect(primitiveTypography.lineHeight.normal).toBe(1.5);
  });
});
