import { describe, it, expect } from "vitest";
import { buildFallbacks } from "./generate-fallbacks";
import { primitiveColor } from "../src/primitive/color";

describe("buildFallbacks", () => {
  it("maps known semantic fallback keys to primitive values", () => {
    const fb = buildFallbacks();
    expect(fb.borderDefault).toBe(primitiveColor.colpan[200]);
    expect(fb.textPrimary).toBe(primitiveColor.yagiz[900]);
    expect(fb.textInverse).toBe(primitiveColor.colpan[50]);
    expect(fb.bgSurface).toBe(primitiveColor.white);
  });

  it("returns the same shape every run (deterministic)", () => {
    const a = buildFallbacks();
    const b = buildFallbacks();
    expect(a).toEqual(b);
  });
});
