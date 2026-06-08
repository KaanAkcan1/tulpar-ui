import { describe, it, expect } from "vitest";
import { tulparDark } from "./dark";

describe("tulparDark", () => {
  it("uses stone.900 as surface and lighter stone for text", () => {
    expect(tulparDark.color.bg.surface).toBe("#1c1917");
    expect(tulparDark.color.text.primary).toBe("#fafaf9");
  });

  it("uses navy.300 as brand default (luminance parity with other .400 severities + AA contrast)", () => {
    expect(tulparDark.color.brand.default).toBe("#6689b8"); // navy.300
    expect(tulparDark.color.brand.hover).toBe("#99b1d0"); // navy.200
    expect(tulparDark.color.brand.active).toBe("#ccd8e8"); // navy.100
    expect(tulparDark.color.brand.onColor).toBe("#1c1917"); // stone.900
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

  it("uses gold.400 for premium severity in dark mode (AA contrast with stone.900 text)", () => {
    expect(tulparDark.color.premium.default).toBe("#c9a23e"); // gold.400
    expect(tulparDark.color.premium.hover).toBe("#dbb958"); // gold.300
    expect(tulparDark.color.premium.onColor).toBe("#1c1917"); // stone.900
  });

  it("button sizes identical across modes; border-radius 4px", () => {
    expect(tulparDark.button.size.md.height).toBe("40px");
    expect(tulparDark.button.borderRadius).toBe("4px");
  });
});
