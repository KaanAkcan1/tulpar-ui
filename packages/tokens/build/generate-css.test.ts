import { describe, it, expect } from "vitest";
import { generateCSS, flattenTokens } from "./generate-css";
import { tulparLight } from "../src/brand/tulpar/light";

describe("flattenTokens", () => {
  it("flattens nested tokens into kebab-case CSS variables", () => {
    const flat = flattenTokens({ color: { bg: { surface: "#fff" } } }, "tulpar");
    expect(flat["--tulpar-color-bg-surface"]).toBe("#fff");
  });

  it("preserves '2xl' and '3xl' keys correctly", () => {
    const flat = flattenTokens({ button: { size: { "2xl": { height: "64px" } } } }, "tulpar");
    expect(flat["--tulpar-button-size-2xl-height"]).toBe("64px");
  });

  it("converts numeric primitive keys", () => {
    const flat = flattenTokens({ blue: { 500: "#3b82f6" } }, "tulpar-primitive");
    expect(flat["--tulpar-primitive-blue-500"]).toBe("#3b82f6");
  });
});

describe("generateCSS", () => {
  it("produces a CSS block for a brand + mode selector", () => {
    const css = generateCSS(tulparLight, '[data-brand="tulpar"]', "tulpar");
    expect(css).toContain('[data-brand="tulpar"] {');
    expect(css).toMatch(/--tulpar-color-bg-surface:\s*#ffffff/);
    expect(css).toContain("}");
  });

  it("includes all 7 button sizes in output", () => {
    const css = generateCSS(tulparLight, ":root", "tulpar");
    expect(css).toContain("--tulpar-button-size-xs-height");
    expect(css).toContain("--tulpar-button-size-md-height");
    expect(css).toContain("--tulpar-button-size-3xl-height");
  });
});
