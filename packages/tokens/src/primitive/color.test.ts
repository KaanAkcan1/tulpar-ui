import { describe, it, expect } from "vitest";
import { primitiveColor } from "./color";

const HEX_RE = /^#[0-9a-f]{6}$/i;
const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const FAMILIES = [
  "al", "kizagan", "umay", "ilay", "erlik", "kam", "mergen", "gok", "ay",
  "yersu", "tulpar", "otuken", "kayin", "ulgen", "kuyas", "alaz", "burkut",
  "colpan", "ayzit", "boz", "kara", "yagiz",
] as const;

describe("primitiveColor", () => {
  it("exposes pure black and white", () => {
    expect(primitiveColor.white).toBe("#ffffff");
    expect(primitiveColor.black).toBe("#000000");
  });

  it("anchors the brand + key semantic families at stop 500", () => {
    expect(primitiveColor.tulpar[500]).toBe("#00c57a"); // primary
    expect(primitiveColor.kam[500]).toBe("#514ecf"); // secondary / focus
    expect(primitiveColor.al[500]).toBe("#d2202c"); // danger
    expect(primitiveColor.gok[500]).toBe("#1b82d4"); // info
    expect(primitiveColor.kuyas[500]).toBe("#e89413"); // warn
    expect(primitiveColor.ulgen[500]).toBe("#d7a40f"); // premium
    expect(primitiveColor.otuken[500]).toBe("#256b52"); // success
  });

  it("anchors the neutral spine", () => {
    expect(primitiveColor.colpan[50]).toBe("#f0f7f5"); // light surface
    expect(primitiveColor.yagiz[900]).toBe("#15110b"); // ink
    expect(primitiveColor.mergen[950]).toBe("#1b2230"); // dark surface base
  });

  it("provides all 22 families with 11 valid-hex stops each", () => {
    expect(FAMILIES).toHaveLength(22);
    for (const name of FAMILIES) {
      for (const stop of STOPS) {
        const value = (primitiveColor[name] as Record<number, string>)[stop];
        expect(value, `${name}.${stop}`).toMatch(HEX_RE);
      }
    }
  });

  it("does NOT expose the deprecated navy/gold/stone/slate or Tailwind families", () => {
    const removed = ["navy", "gold", "stone", "slate", "red", "blue", "green",
      "amber", "purple", "emerald", "teal", "sky", "indigo", "violet",
      "fuchsia", "pink", "rose", "orange", "yellow", "lime", "cyan", "gray"];
    for (const name of removed) {
      expect((primitiveColor as Record<string, unknown>)[name], name).toBeUndefined();
    }
  });
});
