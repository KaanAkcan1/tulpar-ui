import { describe, it, expect } from "vitest";
import { tulparLight } from "../brand/tulpar/light";

describe("OverlayTokens (tulpar light)", () => {
  const overlay = tulparLight.overlay;

  it("exposes neutral surface + inverted tooltip slots", () => {
    expect(overlay.surface.bg).toBeDefined();
    expect(overlay.surface.border).toBeDefined();
    expect(overlay.tooltip.bg).toBeDefined();
    expect(overlay.tooltip.text).toBeDefined();
  });

  it("exposes a numeric zIndex string", () => {
    expect(overlay.zIndex).toMatch(/^\d+$/);
  });

  it("pins the signature open delay and exit duration", () => {
    expect(overlay.motion.delayOpen).toBe("400ms");
    expect(overlay.motion.durationExit).toBe("110ms");
  });

  it("provides all four tone surfaces with surface/onSurface/border", () => {
    for (const tone of ["info", "success", "warning", "danger"] as const) {
      const t = overlay.tone[tone];
      expect(t.surface, `${tone}.surface`).toBeDefined();
      expect(t.onSurface, `${tone}.onSurface`).toBeDefined();
      expect(t.border, `${tone}.border`).toBeDefined();
    }
  });
});
