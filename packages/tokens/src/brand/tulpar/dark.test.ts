import { describe, it, expect } from "vitest";
import { tulparDark } from "./dark";

describe("tulparDark", () => {
  it("surfaces: navy-tinted mergen ramp", () => {
    expect(tulparDark.color.bg.surface).toBe("#202c43"); // mergen-900
    expect(tulparDark.color.bg.subtle).toBe("#243553"); // mergen-800
  });

  it("text: light colpan, gok-400 link", () => {
    expect(tulparDark.color.text.primary).toBe("#f0f7f5"); // colpan-50
    expect(tulparDark.color.text.link).toBe("#3c9ef4"); // gok-400
  });

  it("brand = bright tulpar-400 + dark ink onColor", () => {
    expect(tulparDark.color.brand.default).toBe("#21d98d"); // tulpar-400
    expect(tulparDark.color.brand.onColor).toBe("#0b0804"); // yagiz-950
  });

  it("secondary = kam-300", () => {
    expect(tulparDark.color.secondary.default).toBe("#8497ff"); // kam-300
  });

  it("severities lighten for dark surfaces", () => {
    expect(tulparDark.color.danger.default).toBe("#f84648"); // al-400
    expect(tulparDark.color.success.default).toBe("#6eae93"); // otuken-300
    expect(tulparDark.color.info.default).toBe("#3c9ef4"); // gok-400
    expect(tulparDark.color.premium.default).toBe("#ecb32a"); // ulgen-400
    expect(tulparDark.color.contrast.default).toBe("#f0f7f5"); // colpan-50
  });

  it("focus ring = kam-300 @ 60%", () => {
    expect(tulparDark.color.focusRing).toBe("rgba(132, 151, 255, 0.60)");
  });

  it("chart series lightens to 400 for dark", () => {
    expect(tulparDark.chart[1]).toBe("#21d98d"); // tulpar-400
    expect(tulparDark.chart[2]).toBe("#6972f8"); // kam-400
  });

  it("reuses light input size tiers", () => {
    expect(tulparDark.input.size).toBe(tulparDark.input.size);
    expect(Object.keys(tulparDark.input.size)).toEqual(["xs", "sm", "md", "lg", "xl"]);
  });
});

describe("tulparDark.shell", () => {
  it("content bg re-bound to mergen[900] (lifted above nav)", () => {
    expect(tulparDark.shell.content.bg).toBe("#202c43"); // mergen[900]
  });

  it("sidenav item height + radius updated, new compact/iconSize", () => {
    expect(tulparDark.shell.sidenav.item.height).toBe("2.5rem");
    expect(tulparDark.shell.sidenav.item.radius).toBe("0.5rem");
    expect(tulparDark.shell.sidenav.item.heightCompact).toBe("2.25rem");
    expect(tulparDark.shell.sidenav.item.iconSize).toBe("1.125rem");
  });

  it("sidenav edge + scrollShadow (dark overlays)", () => {
    expect(tulparDark.shell.sidenav.edge).toBe("rgba(255, 255, 255, 0.04)");
    expect(tulparDark.shell.sidenav.scrollShadow).toBe("rgba(0, 0, 0, 0.3)");
  });

  it("item glow derived from tulpar[400] (#21d98d)", () => {
    expect(tulparDark.shell.sidenav.item.glow).toBe("rgba(33, 217, 141, 0.5)");
  });

  it("item countBg = mergen[800], countFg = colpan[200], dot = tulpar[400]", () => {
    expect(tulparDark.shell.sidenav.item.countBg).toBe("#243553"); // mergen[800]
    expect(tulparDark.shell.sidenav.item.countFg).toBe("#d9e0df"); // colpan[200]
    expect(tulparDark.shell.sidenav.item.dot).toBe("#21d98d"); // tulpar[400]
  });
});

describe("tulparDark v0.7 button polish", () => {
  it("v0.7 polish: dark surface highlight is stronger, disabled uses mergen", () => {
    expect(tulparDark.button.surfaceHighlight).toBe("rgba(255, 255, 255, 0.22)");
    expect(tulparDark.button.disabled.bg).toBe("#243553"); // mergen-800
    expect(tulparDark.transition.easeStandard).toBe("cubic-bezier(0.2, 0, 0, 1)");
    expect(tulparDark.button.size.md.radius).toBe("7px");
  });
});
