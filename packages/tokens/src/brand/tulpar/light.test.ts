import { describe, it, expect } from "vitest";
import { tulparLight } from "./light";

describe("tulparLight", () => {
  it("uses white as surface and warm stone for subtle/muted backgrounds", () => {
    expect(tulparLight.color.bg.surface).toBe("#ffffff");
    expect(tulparLight.color.bg.subtle).toBe("#fafaf9"); // stone.50
    expect(tulparLight.color.bg.muted).toBe("#f5f5f4"); // stone.100
  });

  it("uses stone for text (warm dark)", () => {
    expect(tulparLight.color.text.primary).toBe("#1c1917"); // stone.900
    expect(tulparLight.color.text.secondary).toBe("#44403c"); // stone.700
    expect(tulparLight.color.text.muted).toBe("#78716c"); // stone.500
  });

  it("uses navy.700 as brand default", () => {
    expect(tulparLight.color.brand.default).toBe("#0a2540");
    expect(tulparLight.color.brand.hover).toBe("#061a30"); // navy.800
    expect(tulparLight.color.brand.onColor).toBe("#fafaf9"); // stone.50
  });

  it("uses red.700/green.700/amber.700 for danger/success/warning (refined)", () => {
    expect(tulparLight.color.danger.default).toBe("#b91c1c"); // red.700
    expect(tulparLight.color.success.default).toBe("#15803d"); // green.700
    expect(tulparLight.color.warning.default).toBe("#b45309"); // amber.700
  });

  it("uses navy@40% as focus ring", () => {
    expect(tulparLight.color.focusRing).toBe("rgba(10, 37, 64, 0.40)");
  });

  it("provides all 7 button sizes with 4px border radius (conservative)", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
    sizes.forEach((s) => {
      expect(tulparLight.button.size[s].height).toBeDefined();
    });
    expect(tulparLight.button.size.md.height).toBe("40px");
    expect(tulparLight.button.size["3xl"].height).toBe("72px");
    expect(tulparLight.button.borderRadius).toBe("4px");
  });

  it("uses Source Sans 3 for ui font and Source Serif 4 for display", () => {
    expect(tulparLight.font.family.ui).toContain("Source Sans 3");
    expect(tulparLight.font.family.display).toContain("Source Serif 4");
    expect(tulparLight.font.family.mono).toContain("JetBrains Mono");
  });
});
