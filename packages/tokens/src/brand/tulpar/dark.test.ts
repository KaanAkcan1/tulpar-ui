import { describe, it, expect } from "vitest";
import { tulparDark } from "./dark";

describe("tulparDark", () => {
  it("uses stone.900 as surface and lighter stone for text", () => {
    expect(tulparDark.color.bg.surface).toBe("#1c1917");
    expect(tulparDark.color.text.primary).toBe("#fafaf9");
  });

  it("uses navy.400 as brand default", () => {
    expect(tulparDark.color.brand.default).toBe("#3a679f");
    expect(tulparDark.color.brand.onColor).toBe("#1c1917"); // stone.900 (inverse)
  });

  it("provides info (blue.400), help (purple.400) for dark mode", () => {
    expect(tulparDark.color.info.default).toBe("#60a5fa");
    expect(tulparDark.color.help.default).toBe("#c084fc");
  });

  it("inverts contrast severity to stone.50 default (light on dark)", () => {
    expect(tulparDark.color.contrast.default).toBe("#fafaf9");
    expect(tulparDark.color.contrast.onColor).toBe("#1c1917");
  });

  it("uses navy.300 @ 60% as focus ring", () => {
    expect(tulparDark.color.focusRing).toBe("rgba(102, 137, 184, 0.60)");
  });

  it("button sizes identical across modes; border-radius 4px", () => {
    expect(tulparDark.button.size.md.height).toBe("40px");
    expect(tulparDark.button.borderRadius).toBe("4px");
  });
});
