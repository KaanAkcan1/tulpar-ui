import { describe, it, expect } from "vitest";
import { tulparLight } from "./light";

describe("tulparLight", () => {
  it("uses white as surface and warm stone for subtle/muted backgrounds", () => {
    expect(tulparLight.color.bg.surface).toBe("#ffffff");
    expect(tulparLight.color.bg.subtle).toBe("#fafaf9");
    expect(tulparLight.color.bg.muted).toBe("#f5f5f4");
  });

  it("uses stone for text (warm dark)", () => {
    expect(tulparLight.color.text.primary).toBe("#1c1917");
    expect(tulparLight.color.text.secondary).toBe("#44403c");
    expect(tulparLight.color.text.muted).toBe("#78716c");
  });

  it("uses navy.700 as brand default (WCAG AA contrast with white text)", () => {
    expect(tulparLight.color.brand.default).toBe("#0a2540"); // navy.700
    expect(tulparLight.color.brand.hover).toBe("#061a30"); // navy.800
    expect(tulparLight.color.brand.active).toBe("#03101f"); // navy.900
    expect(tulparLight.color.brand.onColor).toBe("#fafaf9");
  });

  it("uses .700 default / .800 hover / .900 active for danger/success/warn (AA contrast)", () => {
    expect(tulparLight.color.danger.default).toBe("#b91c1c"); // red.700
    expect(tulparLight.color.danger.hover).toBe("#991b1b"); // red.800
    expect(tulparLight.color.success.default).toBe("#15803d"); // green.700
    expect(tulparLight.color.warn.default).toBe("#b45309"); // amber.700
  });

  it("provides info (blue.700), help (purple.700), contrast (stone.900) — new in v0.3", () => {
    expect(tulparLight.color.info.default).toBe("#1d4ed8"); // blue.700
    expect(tulparLight.color.info.hover).toBe("#1e40af"); // blue.800
    expect(tulparLight.color.help.default).toBe("#7e22ce"); // purple.700
    expect(tulparLight.color.help.hover).toBe("#6b21a8"); // purple.800
    expect(tulparLight.color.contrast.default).toBe("#1c1917"); // stone.900
    expect(tulparLight.color.contrast.hover).toBe("#292524"); // stone.800
  });

  it("uses stone.700 for neutral (secondary) — AA contrast with white", () => {
    expect(tulparLight.color.neutral.default).toBe("#44403c");
    expect(tulparLight.color.neutral.hover).toBe("#292524");
  });

  it("uses navy@40% as focus ring", () => {
    expect(tulparLight.color.focusRing).toBe("rgba(10, 37, 64, 0.40)");
  });

  it("provides all 7 button sizes with 4px border radius", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
    sizes.forEach((s) => {
      expect(tulparLight.button.size[s].height).toBeDefined();
    });
    expect(tulparLight.button.size.md.height).toBe("40px");
    expect(tulparLight.button.borderRadius).toBe("4px");
  });

  it("uses Source Sans 3 for ui font and Source Serif 4 for display", () => {
    expect(tulparLight.font.family.ui).toContain("Source Sans 3");
    expect(tulparLight.font.family.display).toContain("Source Serif 4");
    expect(tulparLight.font.family.mono).toContain("JetBrains Mono");
  });
});
