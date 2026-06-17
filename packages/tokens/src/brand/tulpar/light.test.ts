import { describe, it, expect } from "vitest";
import { tulparLight } from "./light";

describe("tulparLight", () => {
  it("surfaces: white cards, colpan tinted bg, white elevated/overlay", () => {
    expect(tulparLight.color.bg.surface).toBe("#ffffff");
    expect(tulparLight.color.bg.subtle).toBe("#f0f7f5"); // colpan-50
    expect(tulparLight.color.bg.muted).toBe("#e9f1ef"); // colpan-100
    expect(tulparLight.color.bg.elevated).toBe("#ffffff");
    expect(tulparLight.color.bg.overlay).toBe("#ffffff");
  });

  it("text: warm yagiz ink, cool kara muted, gok link", () => {
    expect(tulparLight.color.text.primary).toBe("#15110b"); // yagiz-900
    expect(tulparLight.color.text.secondary).toBe("#27231d"); // yagiz-700
    expect(tulparLight.color.text.muted).toBe("#74777a"); // kara-500
    expect(tulparLight.color.text.link).toBe("#1c6eb3"); // gok-600
  });

  it("brand = signature bright tulpar-500 + dark ink onColor", () => {
    expect(tulparLight.color.brand.default).toBe("#00c57a"); // tulpar-500
    expect(tulparLight.color.brand.hover).toBe("#00a468"); // tulpar-600
    expect(tulparLight.color.brand.active).toBe("#0b7e52"); // tulpar-700
    expect(tulparLight.color.brand.onColor).toBe("#15110b"); // yagiz-900
  });

  it("secondary = kam (indigo, white text)", () => {
    expect(tulparLight.color.secondary.default).toBe("#393b8b"); // kam-700
    expect(tulparLight.color.secondary.onColor).toBe("#f0f7f5"); // colpan-50
  });

  it("severities map to mythology families", () => {
    expect(tulparLight.color.success.default).toBe("#256b52"); // otuken-500
    expect(tulparLight.color.danger.default).toBe("#b22128"); // al-600
    expect(tulparLight.color.warn.default).toBe("#935f17"); // kuyas-700
    expect(tulparLight.color.info.default).toBe("#1c6eb3"); // gok-600
    expect(tulparLight.color.help.default).toBe("#602ea3"); // erlik-600
    expect(tulparLight.color.contrast.default).toBe("#15110b"); // yagiz-900
    expect(tulparLight.color.neutral.default).toBe("#4f5153"); // kara-700
  });

  it("premium = ulgen antique gold + dark ink + brighten-on-hover", () => {
    expect(tulparLight.color.premium.default).toBe("#d7a40f"); // ulgen-500
    expect(tulparLight.color.premium.hover).toBe("#ecb32a"); // ulgen-400
    expect(tulparLight.color.premium.onColor).toBe("#15110b"); // yagiz-900
  });

  it("focus ring = kam @ 40%", () => {
    expect(tulparLight.color.focusRing).toBe("rgba(81, 78, 207, 0.40)");
  });

  it("chart series anchors at 500 (categorical, colorblind-aware order)", () => {
    expect(tulparLight.chart[1]).toBe("#00c57a"); // tulpar
    expect(tulparLight.chart[2]).toBe("#514ecf"); // kam
    expect(tulparLight.chart[4]).toBe("#b93c90"); // ilay
    expect(tulparLight.chart[8]).toBe("#8fb31c"); // kayin
  });

  it("provides all 7 button sizes with 4px border radius", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl"] as const;
    sizes.forEach((s) => expect(tulparLight.button.size[s].height).toBeDefined());
    expect(tulparLight.button.size.md.height).toBe("40px");
    expect(tulparLight.button.borderRadius).toBe("4px");
  });
});

describe("tulparLight.shell", () => {
  it("sidenav bg re-bound to white", () => {
    expect(tulparLight.shell.sidenav.bg).toBe("#ffffff"); // c.white
  });

  it("sidenav item height + radius re-bound, new compact/iconSize", () => {
    expect(tulparLight.shell.sidenav.item.height).toBe("2.5rem");
    expect(tulparLight.shell.sidenav.item.radius).toBe("0.5rem");
    expect(tulparLight.shell.sidenav.item.heightCompact).toBe("2.25rem");
    expect(tulparLight.shell.sidenav.item.iconSize).toBe("1.125rem");
  });

  it("sidenav edge + scrollShadow derived from yagiz[950] (#0b0804)", () => {
    expect(tulparLight.shell.sidenav.edge).toBe("rgba(11, 8, 4, 0.06)");
    expect(tulparLight.shell.sidenav.scrollShadow).toBe("rgba(11, 8, 4, 0.08)");
  });

  it("item glow derived from tulpar[500] (#00c57a)", () => {
    expect(tulparLight.shell.sidenav.item.glow).toBe("rgba(0, 197, 122, 0.5)");
  });

  it("item countBg = colpan[100], countFg = kara[600], dot = tulpar[500]", () => {
    expect(tulparLight.shell.sidenav.item.countBg).toBe("#e9f1ef"); // colpan[100]
    expect(tulparLight.shell.sidenav.item.countFg).toBe("#636568"); // kara[600]
    expect(tulparLight.shell.sidenav.item.dot).toBe("#00c57a");     // tulpar[500]
  });
});

describe("tulparLight.input", () => {
  it("uses surface bg + colpan border for default; kam focus", () => {
    expect(tulparLight.input.bg.default).toBe(tulparLight.color.bg.surface);
    expect(tulparLight.input.border.default).toBe(tulparLight.color.border.default);
    expect(tulparLight.input.border.focus).toBe("#514ecf"); // kam-500
  });

  it("invalid + warn states track danger/warn colors", () => {
    expect(tulparLight.input.border.invalid).toBe(tulparLight.color.danger.default);
    expect(tulparLight.input.border.warn).toBe(tulparLight.color.warn.default);
  });

  it("ships 5 size tiers (xs..xl)", () => {
    expect(Object.keys(tulparLight.input.size)).toEqual(["xs", "sm", "md", "lg", "xl"]);
  });
});
