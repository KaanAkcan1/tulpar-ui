import { describe, it, expect } from "vitest";
import { primitiveColor } from "./color";

const HEX_RE = /^#[0-9a-f]{6}$/i;
const TAILWIND_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

describe("primitiveColor", () => {
  it("exposes pure black and white", () => {
    expect(primitiveColor.white).toBe("#ffffff");
    expect(primitiveColor.black).toBe("#000000");
  });

  it("provides Navy brand ramp with anchor #0a2540 at stop 700", () => {
    expect(primitiveColor.navy[700]).toBe("#0a2540");
    expect(primitiveColor.navy[50]).toBe("#ebf0f7");
    expect(primitiveColor.navy[950]).toBe("#020713");
  });

  it("provides Gold accent ramp with anchor #b8985a at stop 500", () => {
    expect(primitiveColor.gold[500]).toBe("#b8985a");
    expect(primitiveColor.gold[50]).toBe("#fbf6e9");
    expect(primitiveColor.gold[950]).toBe("#1a160a");
  });

  it("provides Stone (warm) and Slate (cool) neutral ramps", () => {
    expect(primitiveColor.stone[50]).toBe("#fafaf9");
    expect(primitiveColor.stone[900]).toBe("#1c1917");
    expect(primitiveColor.slate[50]).toBe("#f8fafc");
    expect(primitiveColor.slate[900]).toBe("#0f172a");
  });

  it("provides all 17 chromatic families with Tailwind-aligned anchors", () => {
    expect(primitiveColor.red[600]).toBe("#dc2626");
    expect(primitiveColor.orange[500]).toBe("#f97316");
    expect(primitiveColor.amber[700]).toBe("#b45309");
    expect(primitiveColor.yellow[500]).toBe("#eab308");
    expect(primitiveColor.lime[500]).toBe("#84cc16");
    expect(primitiveColor.green[700]).toBe("#15803d");
    expect(primitiveColor.emerald[500]).toBe("#10b981");
    expect(primitiveColor.teal[600]).toBe("#0d9488");
    expect(primitiveColor.cyan[500]).toBe("#06b6d4");
    expect(primitiveColor.sky[500]).toBe("#0ea5e9");
    expect(primitiveColor.blue[600]).toBe("#2563eb");
    expect(primitiveColor.indigo[500]).toBe("#6366f1");
    expect(primitiveColor.violet[500]).toBe("#8b5cf6");
    expect(primitiveColor.purple[500]).toBe("#a855f7");
    expect(primitiveColor.fuchsia[500]).toBe("#d946ef");
    expect(primitiveColor.pink[500]).toBe("#ec4899");
    expect(primitiveColor.rose[500]).toBe("#f43f5e");
  });

  it("every ramp has all 11 stops (50–950) with valid hex format", () => {
    const ramps = [
      "navy", "gold", "stone", "slate",
      "red", "orange", "amber", "yellow",
      "lime", "green", "emerald", "teal",
      "cyan", "sky", "blue", "indigo",
      "violet", "purple", "fuchsia", "pink", "rose",
    ] as const;
    for (const name of ramps) {
      for (const stop of TAILWIND_STOPS) {
        const value = (primitiveColor[name] as Record<number, string>)[stop];
        expect(value, `${name}.${stop}`).toMatch(HEX_RE);
      }
    }
  });

  it("does NOT expose the deprecated v0.1 `gray` family (renamed to `stone`)", () => {
    expect((primitiveColor as Record<string, unknown>).gray).toBeUndefined();
  });
});
