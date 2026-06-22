import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-progress";
import type { TulparProgress } from "./tulpar-progress";
import { progressStyles } from "./tulpar-progress.styles";

function fill(el: TulparProgress): HTMLElement | null {
  return el.shadowRoot!.querySelector(".fill");
}
function buffer(el: TulparProgress): HTMLElement | null {
  return el.shadowRoot!.querySelector(".buffer");
}
function ringFill(el: TulparProgress): SVGCircleElement | null {
  return el.shadowRoot!.querySelector("circle.ring-fill");
}
function valueEl(el: TulparProgress): HTMLElement | null {
  return el.shadowRoot!.querySelector(".value");
}

describe("public type exports", () => {
  it("re-exports TulparProgress from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparProgress).to.exist;
  });
  it("re-exports TulparProgress from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparProgress).to.exist;
  });
});

describe("<tulpar-progress>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-progress")).to.exist;
  });

  it("defaults to linear / regular / md / 0..100", async () => {
    const el = await fixture<TulparProgress>(html`<tulpar-progress></tulpar-progress>`);
    expect(el.variant).to.equal("linear");
    expect(el.thickness).to.equal("regular");
    expect(el.size).to.equal("md");
    expect(el.min).to.equal(0);
    expect(el.max).to.equal(100);
    expect(el.indeterminate).to.equal(false);
  });

  describe("accessibility", () => {
    it('sets role="progressbar" + aria-valuemin/max/now', async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("role")).to.equal("progressbar");
      expect(el.getAttribute("aria-valuemin")).to.equal("0");
      expect(el.getAttribute("aria-valuemax")).to.equal("100");
      expect(el.getAttribute("aria-valuenow")).to.equal("40");
    });

    it("clamps aria-valuenow to the bounds", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="250" max="100"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("aria-valuenow")).to.equal("100");
    });

    it("respects custom min/max", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="3" min="0" max="5"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("aria-valuemax")).to.equal("5");
      expect(el.getAttribute("aria-valuenow")).to.equal("3");
    });

    it("DROPS aria-valuenow when indeterminate", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40" indeterminate></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("aria-valuenow")).to.equal(false);
      expect(el.getAttribute("aria-valuemin")).to.equal("0");
      expect(el.getAttribute("aria-valuemax")).to.equal("100");
    });
  });

  describe("value label", () => {
    it("valueLabel=true renders the percentage", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="42"></tulpar-progress>`,
      );
      el.valueLabel = true;
      await el.updateComplete;
      expect(valueEl(el)?.textContent?.trim()).to.equal("42%");
    });

    it("a formatter sets the label text + aria-valuetext", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="3" max="5"></tulpar-progress>`,
      );
      el.valueLabel = (v, _min, max) => `Step ${v} of ${max}`;
      await el.updateComplete;
      expect(valueEl(el)?.textContent?.trim()).to.equal("Step 3 of 5");
      expect(el.getAttribute("aria-valuetext")).to.equal("Step 3 of 5");
    });

    it("no label by default (data-value-label absent)", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="42"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("data-value-label")).to.equal(false);
    });
  });

  describe("descriptive label slot", () => {
    it("renders slotted label content + wires aria-labelledby (linear)", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40"><span slot="label">Uploading…</span></tulpar-progress>`,
      );
      await el.updateComplete;
      // the label slot wrapper exists, is shown, and carries the labelledby id
      const wrapper = el.shadowRoot!.querySelector(".label") as HTMLElement;
      expect(wrapper).to.exist;
      expect(getComputedStyle(wrapper).display).to.not.equal("none");
      const slot = wrapper.querySelector("slot[name='label']") as HTMLSlotElement;
      expect(slot).to.exist;
      const assigned = slot.assignedNodes({ flatten: true }).filter((n) => n instanceof Element);
      expect((assigned[0] as Element).textContent).to.equal("Uploading…");
      // host carries data-label + aria-labelledby → the wrapper's id
      expect(el.hasAttribute("data-label")).to.equal(true);
      const labelledby = el.getAttribute("aria-labelledby");
      expect(labelledby).to.be.a("string").and.not.equal("");
      expect(wrapper.id).to.equal(labelledby);
    });

    it("wires aria-labelledby for the circular variant too", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress variant="circular" value="40"
          ><span slot="label">Syncing</span></tulpar-progress
        >`,
      );
      await el.updateComplete;
      const wrapper = el.shadowRoot!.querySelector(".label") as HTMLElement;
      expect(el.getAttribute("aria-labelledby")).to.equal(wrapper.id);
    });

    it("no slot content → no data-label, no aria-labelledby we own", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("data-label")).to.equal(false);
      expect(el.hasAttribute("aria-labelledby")).to.equal(false);
      // the slot wrapper is still in the shadow tree (always rendered)
      expect(el.shadowRoot!.querySelector("slot[name='label']")).to.exist;
    });

    it("an element carrier with content registers (any element node counts)", async () => {
      // The slotchange detector treats any assigned ELEMENT node as content
      // (mirrors spinner/tag); only loose whitespace-only TEXT nodes are
      // ignored. An empty-but-present element wrapper therefore registers.
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40"><b slot="label">Done</b></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("data-label")).to.equal(true);
    });

    it("label (descriptive) and value-label (numeric %) are distinct + coexist", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="42"><span slot="label">Uploading…</span></tulpar-progress>`,
      );
      el.valueLabel = true;
      await el.updateComplete;
      // numeric value label still renders the %
      expect(valueEl(el)?.textContent?.trim()).to.equal("42%");
      // descriptive label slot also renders
      expect(el.hasAttribute("data-label")).to.equal(true);
      expect(el.hasAttribute("data-value-label")).to.equal(true);
    });

    it("does not stomp a consumer-supplied aria-labelledby when slot is empty", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40" aria-labelledby="external-id"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("aria-labelledby")).to.equal("external-id");
    });
  });

  describe("linear determinate", () => {
    it("fill width reflects the fraction", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="60"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(fill(el)?.getAttribute("style") ?? "").to.contain("width:60");
    });
  });

  describe("buffer (linear)", () => {
    it("renders the buffer segment when set", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="30" buffer="70"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("data-buffer")).to.equal(true);
      const b = buffer(el)!;
      expect(getComputedStyle(b).display).to.not.equal("none");
      expect(b.getAttribute("style") ?? "").to.contain("width:70");
    });

    it("no buffer attribute when unset", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="30"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("data-buffer")).to.equal(false);
    });
  });

  describe("circular", () => {
    it("renders the ring (track + fill circles)", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress variant="circular" value="70"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector("circle.ring-track")).to.not.equal(null);
      const rf = ringFill(el)!;
      expect(rf).to.not.equal(null);
      // pathLength=100 → dashoffset = 100 - 70 = 30.
      expect(rf.getAttribute("style") ?? "").to.contain("stroke-dashoffset:30");
    });

    it("uses pathLength=100 on both circles", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress variant="circular" value="50"></tulpar-progress>`,
      );
      await el.updateComplete;
      const circles = el.shadowRoot!.querySelectorAll("circle");
      circles.forEach((c) => expect(c.getAttribute("pathLength")).to.equal("100"));
    });

    it("indeterminate circular drops the inline dashoffset", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress variant="circular" indeterminate></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(ringFill(el)?.getAttribute("style") ?? "").to.not.contain("stroke-dashoffset");
    });
  });

  describe("tone", () => {
    it("default tone leaves color to the brand-green stylesheet", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.style.color).to.equal("");
    });

    it("built-in tone sets an inline color", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40" tone="info"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.style.color).to.contain("--tulpar-atom-tone-info-solid-bg");
    });

    it("state-tone promotes to success at value>=max", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="100" max="100" state-tone></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.style.color).to.contain("--tulpar-atom-tone-success-solid-bg");
    });

    it("consumer danger wins over state-tone success", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="100" max="100" state-tone tone="danger"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.style.color).to.contain("--tulpar-atom-tone-danger-solid-bg");
    });

    it("custom tone emits accent vars (no inline color)", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40" tone="custom" color="tulpar"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.style.getPropertyValue("--tulpar-progress-accent-l")).to.not.equal("");
      expect(el.style.color).to.equal("");
    });
  });

  describe("styles", () => {
    it("contains the determinate width + dashoffset transitions", () => {
      expect(progressStyles.cssText).to.include("transition: width 0.32s");
      expect(progressStyles.cssText).to.include("transition: stroke-dashoffset 0.32s");
    });
    it("contains the indeterminate travel + rotate animations", () => {
      expect(progressStyles.cssText).to.include("@keyframes tulpar-progress-travel");
      expect(progressStyles.cssText).to.include("@keyframes tulpar-progress-rotate");
    });
    it("contains a prefers-reduced-motion block", () => {
      expect(progressStyles.cssText).to.include("prefers-reduced-motion: reduce");
      expect(progressStyles.cssText).to.include("@keyframes tulpar-progress-pulse");
    });
    it("contains a forced-colors block", () => {
      expect(progressStyles.cssText).to.include("forced-colors");
      expect(progressStyles.cssText).to.include("CanvasText");
    });
  });
});
