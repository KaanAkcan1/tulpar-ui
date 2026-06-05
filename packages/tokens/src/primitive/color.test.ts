import { describe, it, expect } from "vitest";
import { primitiveColor } from "./color";

describe("primitiveColor", () => {
  it("exposes the full blue scale (50–900)", () => {
    expect(primitiveColor.blue[50]).toMatch(/^#[0-9a-f]{6}$/i);
    expect(primitiveColor.blue[500]).toMatch(/^#[0-9a-f]{6}$/i);
    expect(primitiveColor.blue[900]).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("exposes the full gray scale (50–900)", () => {
    expect(primitiveColor.gray[50]).toMatch(/^#[0-9a-f]{6}$/i);
    expect(primitiveColor.gray[900]).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("exposes red, green, yellow, orange scales", () => {
    expect(primitiveColor.red[500]).toBeDefined();
    expect(primitiveColor.green[500]).toBeDefined();
    expect(primitiveColor.yellow[500]).toBeDefined();
    expect(primitiveColor.orange[500]).toBeDefined();
  });

  it("exposes pure black and white", () => {
    expect(primitiveColor.white).toBe("#ffffff");
    expect(primitiveColor.black).toBe("#000000");
  });

  it("is readonly (TypeScript const assertion)", () => {
    expect(Object.isFrozen(primitiveColor)).toBe(false);
  });
});
