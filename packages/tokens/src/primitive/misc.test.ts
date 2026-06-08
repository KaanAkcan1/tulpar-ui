import { describe, it, expect } from "vitest";
import { primitiveRadius } from "./radius";
import { primitiveShadow } from "./shadow";
import { primitiveTransition } from "./transition";

describe("primitiveRadius", () => {
  it("provides radius scale from none to full (conservative — D4 reflex)", () => {
    expect(primitiveRadius.none).toBe("0");
    expect(primitiveRadius.sm).toBe("2px");
    expect(primitiveRadius.md).toBe("4px");
    expect(primitiveRadius.lg).toBe("6px");
    expect(primitiveRadius.xl).toBe("12px");
    expect(primitiveRadius["2xl"]).toBe("16px");
    expect(primitiveRadius.full).toBe("9999px");
  });
});

describe("primitiveShadow", () => {
  it("provides shadow scale from none to xl", () => {
    expect(primitiveShadow.none).toBe("none");
    expect(primitiveShadow.sm).toContain("rgba");
    expect(primitiveShadow.lg).toContain("rgba");
  });

  it("focus shadow includes a ring with 3px spread", () => {
    expect(primitiveShadow.focus).toMatch(/0 0 0 3px/);
  });
});

describe("primitiveTransition", () => {
  it("provides standard durations and easings", () => {
    expect(primitiveTransition.duration.fast).toBe("150ms");
    expect(primitiveTransition.duration.normal).toBe("200ms");
    expect(primitiveTransition.easing.standard).toContain("cubic-bezier");
  });
});
