import { describe, it, expect } from "vitest";
import { buildFallbacks } from "./generate-fallbacks";
import { primitiveColor } from "../src/primitive/color";

describe("buildFallbacks", () => {
  it("maps known semantic fallback keys to primitive values", () => {
    const fb = buildFallbacks();
    expect(fb.borderDefault).toBe(primitiveColor.stone[200]);
    expect(fb.textPrimary).toBe(primitiveColor.stone[900]);
    expect(fb.textInverse).toBe(primitiveColor.stone[50]);
    expect(fb.bgSurface).toBe(primitiveColor.white);
  });

  it("returns the same shape every run (deterministic)", () => {
    const a = buildFallbacks();
    const b = buildFallbacks();
    expect(a).toEqual(b);
  });
});
