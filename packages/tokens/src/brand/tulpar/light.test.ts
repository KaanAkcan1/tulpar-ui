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

  it("uses navy.600 as brand default (shifted from navy.700 in v0.2)", () => {
    expect(tulparLight.color.brand.default).toBe("#133a66"); // navy.600
    expect(tulparLight.color.brand.hover).toBe("#0a2540"); // navy.700
    expect(tulparLight.color.brand.active).toBe("#061a30"); // navy.800
    expect(tulparLight.color.brand.onColor).toBe("#fafaf9");
  });

  it("uses red/green/amber .600 for danger/success/warn (default), .700 hover, .800 active", () => {
    expect(tulparLight.color.danger.default).toBe("#dc2626");
    expect(tulparLight.color.danger.hover).toBe("#b91c1c");
    expect(tulparLight.color.success.default).toBe("#16a34a");
    expect(tulparLight.color.warn.default).toBe("#d97706");
  });

  it("provides info (blue.600), help (purple.600), contrast (stone.900) — new in v0.3", () => {
    expect(tulparLight.color.info.default).toBe("#2563eb");
    expect(tulparLight.color.info.hover).toBe("#1d4ed8");
    expect(tulparLight.color.help.default).toBe("#9333ea");
    expect(tulparLight.color.help.hover).toBe("#7e22ce");
    expect(tulparLight.color.contrast.default).toBe("#1c1917"); // stone.900
    expect(tulparLight.color.contrast.hover).toBe("#292524"); // stone.800
  });

  it("uses stone.600 for neutral (secondary) — shifted from stone.200 in v0.2", () => {
    expect(tulparLight.color.neutral.default).toBe("#57534e");
    expect(tulparLight.color.neutral.hover).toBe("#44403c");
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
