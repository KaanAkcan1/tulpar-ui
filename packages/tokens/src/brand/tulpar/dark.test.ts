import { describe, it, expect } from "vitest";
import { tulparDark } from "./dark";

describe("tulparDark", () => {
  it("uses stone.900 as surface and lighter stone for text", () => {
    expect(tulparDark.color.bg.surface).toBe("#1c1917"); // stone.900
    expect(tulparDark.color.text.primary).toBe("#fafaf9"); // stone.50
  });

  it("uses navy.400 as brand default (lighter for dark contrast)", () => {
    expect(tulparDark.color.brand.default).toBe("#3a679f");
  });

  it("uses navy.300 @ 60% as focus ring", () => {
    expect(tulparDark.color.focusRing).toBe("rgba(102, 137, 184, 0.60)");
  });

  it("button sizes identical across modes (only colors differ); border-radius 4px", () => {
    expect(tulparDark.button.size.md.height).toBe("40px");
    expect(tulparDark.button.size.xs.height).toBe("24px");
    expect(tulparDark.button.borderRadius).toBe("4px");
  });

  it("uses Source Sans 3 for ui font and Source Serif 4 for display", () => {
    expect(tulparDark.font.family.ui).toContain("Source Sans 3");
    expect(tulparDark.font.family.display).toContain("Source Serif 4");
  });
});
