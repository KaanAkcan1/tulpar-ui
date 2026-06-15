import { describe, it, expect } from "vitest";
import { tulparLight, tulparDark } from "../brand/tulpar";
import { flattenTokens } from "../../build/generate-css";

describe("shell semantic tokens", () => {
  it("both modes bind the full shell contract", () => {
    for (const brand of [tulparLight, tulparDark]) {
      expect(brand.shell.topbar.height).toBeTruthy();
      expect(brand.shell.sidenav.width).toBeTruthy();
      expect(brand.shell.sidenav.railWidth).toBeTruthy();
      expect(brand.shell.sidenav.item.height).toBeTruthy();
      expect(brand.shell.mask.bg).toBeTruthy();
      expect(brand.shell.z.aside).toBeTruthy();
    }
  });

  it("flattens to --tulpar-shell-* custom properties", () => {
    const flat = flattenTokens(tulparLight as unknown as Record<string, unknown>, "tulpar");
    expect(flat["--tulpar-shell-sidenav-width"]).toBeDefined();
    expect(flat["--tulpar-shell-sidenav-rail-width"]).toBeDefined();
    expect(flat["--tulpar-shell-z-mask"]).toBeDefined();
  });
});
