import { fixture, html, expect, aTimeout, nextFrame } from "@open-wc/testing";
import "./tulpar-spinner";
import type { TulparSpinner } from "./tulpar-spinner";
import { spinnerStyles } from "./tulpar-spinner.styles";

function svg(el: TulparSpinner): SVGSVGElement | null {
  return el.shadowRoot!.querySelector("svg");
}
function srText(el: TulparSpinner): string {
  return (el.shadowRoot!.querySelector(".sr-only")?.textContent ?? "").trim();
}

describe("public type exports", () => {
  it("re-exports TulparSpinner from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparSpinner).to.exist;
  });
  it("re-exports TulparSpinner from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparSpinner).to.exist;
  });
});

describe("<tulpar-spinner>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-spinner")).to.exist;
  });

  it("defaults to md / track on / label='Loading'", async () => {
    const el = await fixture<TulparSpinner>(html`<tulpar-spinner></tulpar-spinner>`);
    expect(el.size).to.equal("md");
    expect(el.track).to.equal(true);
    expect(el.label).to.equal("Loading");
    expect(el.tone).to.equal(undefined);
    expect(el.getAttribute("size")).to.equal("md");
  });

  describe("accessibility", () => {
    it('sets role="status" on the host', async () => {
      const el = await fixture<TulparSpinner>(html`<tulpar-spinner></tulpar-spinner>`);
      expect(el.getAttribute("role")).to.equal("status");
    });

    it("renders the label prop as visually-hidden text", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner label="Saving"></tulpar-spinner>`,
      );
      await el.updateComplete;
      expect(srText(el)).to.equal("Saving");
    });

    it("a slot=label overrides the label prop", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner label="Loading"><span slot="label">Uploading file</span></tulpar-spinner>`,
      );
      await el.updateComplete;
      await nextFrame();
      // The slotted content is projected; the prop fallback is suppressed.
      const slotted = el.querySelector('[slot="label"]');
      expect(slotted?.textContent).to.equal("Uploading file");
    });

    it("marks the visual glyph aria-hidden", async () => {
      const el = await fixture<TulparSpinner>(html`<tulpar-spinner></tulpar-spinner>`);
      await el.updateComplete;
      const glyph = el.shadowRoot!.querySelector(".spinner");
      expect(glyph?.getAttribute("aria-hidden")).to.equal("true");
    });
  });

  describe("delay", () => {
    it("renders nothing synchronously when delay > 0", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner delay="80"></tulpar-spinner>`,
      );
      // Immediately after connect, the glyph must NOT be present.
      expect(svg(el)).to.equal(null);
    });

    it("renders after the delay elapses", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner delay="60"></tulpar-spinner>`,
      );
      expect(svg(el)).to.equal(null);
      await aTimeout(110);
      await el.updateComplete;
      expect(svg(el)).to.not.equal(null);
    });

    it("renders immediately when delay = 0", async () => {
      const el = await fixture<TulparSpinner>(html`<tulpar-spinner></tulpar-spinner>`);
      await el.updateComplete;
      expect(svg(el)).to.not.equal(null);
    });
  });

  describe("track ring", () => {
    it("renders a track circle by default", async () => {
      const el = await fixture<TulparSpinner>(html`<tulpar-spinner></tulpar-spinner>`);
      await el.updateComplete;
      const track = el.shadowRoot!.querySelector("circle.track") as SVGCircleElement;
      expect(track).to.not.equal(null);
      expect(getComputedStyle(track).display).to.not.equal("none");
    });

    it("track=false hides the track circle", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner .track=${false}></tulpar-spinner>`,
      );
      await el.updateComplete;
      const track = el.shadowRoot!.querySelector("circle.track") as SVGCircleElement;
      expect(getComputedStyle(track).display).to.equal("none");
    });
  });

  describe("size reflection", () => {
    it("reflects the size attribute", async () => {
      const el = await fixture<TulparSpinner>(html`<tulpar-spinner size="lg"></tulpar-spinner>`);
      expect(el.getAttribute("size")).to.equal("lg");
    });
  });

  describe("tone", () => {
    it("omitted tone leaves the host color unset (inherits currentColor)", async () => {
      const el = await fixture<TulparSpinner>(html`<tulpar-spinner></tulpar-spinner>`);
      await el.updateComplete;
      expect(el.style.color).to.equal("");
    });

    it("built-in tone sets an inline color on the host", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner tone="info"></tulpar-spinner>`,
      );
      await el.updateComplete;
      expect(el.style.color).to.contain("--tulpar-atom-tone-info-solid-bg");
    });

    it("custom tone emits accent vars and reflects tone=custom", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner tone="custom" color="tulpar"></tulpar-spinner>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("tone")).to.equal("custom");
      expect(el.style.getPropertyValue("--tulpar-spinner-accent-l")).to.not.equal("");
      // Inline color is NOT set for custom (the CSS rule picks -l/-d per mode).
      expect(el.style.color).to.equal("");
    });
  });

  describe("styles", () => {
    it("contains the rotate @keyframes", () => {
      expect(spinnerStyles.cssText).to.include("@keyframes tulpar-spinner-rotate");
      expect(spinnerStyles.cssText).to.include("rotate(360deg)");
    });
    it("contains a prefers-reduced-motion block with the 3-dot cycle", () => {
      expect(spinnerStyles.cssText).to.include("prefers-reduced-motion: reduce");
      expect(spinnerStyles.cssText).to.include("@keyframes tulpar-spinner-dots");
    });
    it("contains a forced-colors block", () => {
      expect(spinnerStyles.cssText).to.include("forced-colors");
      expect(spinnerStyles.cssText).to.include("CanvasText");
    });
  });

  // Regression guard for the slotchange→requestUpdate infinite loop fixed in
  // 816d2a4: assignedNodes({ flatten:true }) counts the rendered `label` prop
  // fallback as assigned, flipping _hasSlotLabel every render and hard-locking
  // the page when the prop form is used. Plain assignedNodes() must be used.
  describe("slot/prop loop guard", () => {
    it("prop-only label does NOT register as slot content", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner label="Loading"></tulpar-spinner>`,
      );
      await el.updateComplete;
      // {flatten:true} would make this true (the regression).
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.false;
    });

    it("real slotted content wins (flag true, prop fallback suppressed)", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner label="Loading"
          ><span slot="label">Uploading file</span></tulpar-spinner
        >`,
      );
      await el.updateComplete;
      await nextFrame();
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.true;
      // The slotted content is projected; the prop fallback is suppressed.
      const slot = el.shadowRoot!.querySelector('slot[name="label"]') as HTMLSlotElement;
      const assigned = slot.assignedNodes().map((n) => n.textContent).join("");
      expect(assigned).to.contain("Uploading file");
      expect(assigned).to.not.contain("Loading");
    });

    it("prop form settles without flipping on a later slotchange (no loop)", async () => {
      const el = await fixture<TulparSpinner>(
        html`<tulpar-spinner label="Loading"></tulpar-spinner>`,
      );
      await el.updateComplete;
      // Let any queued slotchange/requestUpdate cycles run; a true loop would
      // also blow the per-test timeout.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.false;
      // A subsequent update still resolves (the element is not wedged).
      await el.updateComplete;
    });
  });
});
