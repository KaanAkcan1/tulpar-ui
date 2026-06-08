// Side-effect import: registers Angular's JIT compiler so injectable services
// from lucide-angular (LucideIconConfig etc.) can be processed when the
// component file is loaded.
import "@angular/compiler";
import { describe, it, expect } from "vitest";
import { TulparButtonComponent } from "./tulpar-button.component";

/**
 * Smoke tests at the class level — verify exports + decorator metadata.
 * Instance creation requires a full Angular test environment (TestBed +
 * platform-browser-dynamic) because the component now declares
 * `LucideAngularModule` in `imports` and injects `ElementRef`. The real
 * integration is verified through the workspace build (ng-packagr emits
 * the FESM bundle with full Angular compilation) and the playground app.
 */
describe("TulparButtonComponent (smoke)", () => {
  it("is exported as a class", () => {
    expect(typeof TulparButtonComponent).toBe("function");
    expect(TulparButtonComponent.name).toBe("TulparButtonComponent");
  });

  it("carries Angular component metadata (@Component decorator applied)", () => {
    // ɵcmp is the compiled-output identifier set by the Angular compiler.
    // Its presence proves the class is a real standalone component.
    const metadata = (TulparButtonComponent as unknown as { ɵcmp?: unknown }).ɵcmp;
    expect(metadata).toBeDefined();
  });

  it("declares its component selector as 'tulpar-button-ng'", () => {
    // Standalone components expose their selectors via ɵcmp.selectors.
    const cmp = (TulparButtonComponent as unknown as { ɵcmp: { selectors: string[][] } }).ɵcmp;
    const selectors = cmp.selectors.flat();
    expect(selectors).toContain("tulpar-button-ng");
  });
});
