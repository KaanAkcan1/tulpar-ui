import { describe, it, expect } from "vitest";
import { tulparLight } from "./light";

describe("tulparLight", () => {
  it("uses white as surface background", () => {
    expect(tulparLight.color.bg.surface).toBe("#ffffff");
  });
  it("uses dark gray for primary text", () => {
    expect(tulparLight.color.text.primary).toMatch(/#111827|#1f2937/);
  });
  it("uses blue.600 as brand default", () => {
    expect(tulparLight.color.brand.default).toBe("#2563eb");
  });
  it("provides white as onColor for brand", () => {
    expect(tulparLight.color.brand.onColor).toBe("#ffffff");
  });
  it("provides all 7 button sizes (xs through 3xl)", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
    sizes.forEach((s) => {
      expect(tulparLight.button.size[s].height).toBeDefined();
      expect(tulparLight.button.size[s].paddingX).toBeDefined();
    });
  });
  it("md size has 40px height (spec default)", () => {
    expect(tulparLight.button.size.md.height).toBe("40px");
  });
  it("xs size is 24px", () => {
    expect(tulparLight.button.size.xs.height).toBe("24px");
  });
  it("3xl size is 72px", () => {
    expect(tulparLight.button.size["3xl"].height).toBe("72px");
  });
});
