import { describe, it, expect } from "vitest";
import { tulparDark } from "./dark";

describe("tulparDark", () => {
  it("uses dark gray as surface background", () => {
    expect(tulparDark.color.bg.surface).toMatch(/#111827|#1f2937/);
  });
  it("uses light gray for primary text", () => {
    expect(tulparDark.color.text.primary).toMatch(/#f9fafb|#f3f4f6/);
  });
  it("uses blue.400 (lighter) as brand default for better contrast on dark", () => {
    expect(tulparDark.color.brand.default).toBe("#60a5fa");
  });
  it("button sizes are identical across modes (only colors differ)", () => {
    expect(tulparDark.button.size.md.height).toBe("40px");
    expect(tulparDark.button.size.xs.height).toBe("24px");
  });
});
