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

  describe("circular size scale (xs–xl)", () => {
    // box (px) + ring stroke per size; r = box/2 - stroke/2 (pathLength=100).
    const cases: Array<[TulparProgress["size"], number, number]> = [
      ["xs", 24, 3],
      ["sm", 32, 4],
      ["md", 44, 4],
      ["lg", 56, 4],
      ["xl", 64, 5],
    ];
    for (const [size, box, stroke] of cases) {
      it(`size="${size}" renders a ${box}px ring with stroke ${stroke}`, async () => {
        const el = await fixture<TulparProgress>(
          html`<tulpar-progress variant="circular" size=${size!} value="50"></tulpar-progress>`,
        );
        await el.updateComplete;
        const svg = el.shadowRoot!.querySelector("svg")!;
        expect(svg.getAttribute("viewBox")).to.equal(`0 0 ${box} ${box}`);
        expect(svg.getAttribute("stroke-width")).to.equal(String(stroke));
        const ring = el.shadowRoot!.querySelector("circle.ring-fill")!;
        const r = box / 2 - stroke / 2;
        expect(ring.getAttribute("r")).to.equal(String(r));
        // the .circular box width tracks the size
        const wrap = el.shadowRoot!.querySelector(".circular") as HTMLElement;
        expect(getComputedStyle(wrap).width).to.equal(`${box}px`);
      });
    }
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

    // Vue leaves a `<!---->` comment in the light DOM for an empty slot outlet.
    // The shared slot-content detector (used here and by tag/chip/badge/spinner/
    // avatar) must IGNORE comment nodes — counting one would flip _hasSlotLabel
    // and point aria-labelledby at an empty label wrapper.
    it("comment-only assigned nodes do NOT count as label content (Vue empty-slot)", async () => {
      const { hasMeaningfulContent } = await import("../_internal/slot-content");
      // A bare comment node is the exact node Vue leaves for an empty `<slot/>`.
      expect(hasMeaningfulContent([document.createComment("")])).to.equal(false);
      // Whitespace-only text is likewise ignored; real content still counts.
      expect(hasMeaningfulContent([document.createTextNode("   ")])).to.equal(false);
      expect(hasMeaningfulContent([document.createElement("span")])).to.equal(true);
      expect(hasMeaningfulContent([document.createTextNode("Uploading…")])).to.equal(true);
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

  describe("tone=flow (value-driven gradient)", () => {
    const flowColor = (el: TulparProgress) => el.style.color;
    const accentL = (el: TulparProgress) => el.style.getPropertyValue("--tulpar-progress-accent-l");
    const accentD = (el: TulparProgress) => el.style.getPropertyValue("--tulpar-progress-accent-d");

    it("sets a single inline `color` color-mix that references the atom.flow tokens", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="50" tone="flow"></tulpar-progress>`,
      );
      await el.updateComplete;
      const color = flowColor(el);
      // A SINGLE inline color expression (no per-mode -accent-l/-d vars).
      expect(color).to.contain("color-mix(in oklab");
      expect(color).to.contain("var(--tulpar-atom-flow-mid");
      // The old -l/-d accent plumbing must be gone.
      expect(accentL(el)).to.equal("");
      expect(accentD(el)).to.equal("");
    });

    it("the flow `color` is mode-INDEPENDENT — a runtime .dark toggle needs NO recompute (tokens flip it)", async () => {
      // The fix: flip via token inheritance, not :host-context or a JS dark-check.
      // The inline `color` is the SAME string in light and dark — the
      // --tulpar-atom-flow-* tokens (set under .dark by the generated sheet, and
      // inherited across the shadow boundary) re-resolve the color-mix live. So a
      // runtime `.dark` toggle (the playgrounds have a live toggle) changes the
      // rendered fill with NOTHING to recompute in JS and no stale value.
      const host = await fixture<HTMLElement>(html`<div></div>`);
      const el = document.createElement("tulpar-progress");
      el.setAttribute("tone", "flow");
      el.value = 50;
      host.appendChild(el);
      await el.updateComplete;

      const colorLight = flowColor(el);
      expect(colorLight).to.contain("color-mix(in oklab");
      expect(colorLight).to.contain("var(--tulpar-atom-flow-mid");
      // No -accent-l/-d plumbing at all.
      expect(accentL(el)).to.equal("");
      expect(accentD(el)).to.equal("");

      // Toggle .dark on the ancestor at runtime — NO value/prop change. The
      // inline expression is unchanged; the tokens it references do the flipping.
      host.classList.add("dark");
      expect(flowColor(el)).to.equal(colorLight); // same string → never stale

      host.classList.remove("dark");
      expect(flowColor(el)).to.equal(colorLight);
    });

    it("the styles carry NO :host-context / -accent-l/-d flow plumbing", () => {
      const cssText = progressStyles.cssText.replace(/\s+/g, " ");
      // The dead flow rules must be gone (flip is now via the inline token mix).
      expect(cssText).to.not.include(':host([tone="flow"])');
      expect(cssText).to.not.include(':host-context(.dark)[tone="flow"]');
    });

    it("low value leans red (al), high value leans green (otuken) — and they differ", async () => {
      const lo = await fixture<TulparProgress>(
        html`<tulpar-progress value="5" tone="flow"></tulpar-progress>`,
      );
      const hi = await fixture<TulparProgress>(
        html`<tulpar-progress value="95" tone="flow"></tulpar-progress>`,
      );
      await lo.updateComplete;
      await hi.updateComplete;
      const loColor = flowColor(lo);
      const hiColor = flowColor(hi);
      // The inline expressions differ by percentage between low and high values.
      expect(loColor).to.not.equal(hiColor);
      // 5% sits in the low→mid half: references the low (red) anchor token.
      expect(loColor).to.contain("var(--tulpar-atom-flow-low");
      // 95% sits in the mid→high half: references the high (green) anchor token.
      expect(hiColor).to.contain("var(--tulpar-atom-flow-high");
    });

    it("midpoint (50%) is the mid (amber) anchor", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="50" tone="flow"></tulpar-progress>`,
      );
      await el.updateComplete;
      // 100% mid weight at the boundary → references only the mid token.
      expect(flowColor(el)).to.contain("var(--tulpar-atom-flow-mid");
    });

    it("the color-mix carries the light-mode literal fallbacks on the token vars", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="50" tone="flow"></tulpar-progress>`,
      );
      await el.updateComplete;
      // Each token var supplies its light hex as a fallback (tokens CSS may be
      // absent); dark flipping is the generated sheet's job, not a second value.
      expect(flowColor(el)).to.contain("#d7a40f"); // ulgen 500 (mid, light)
    });

    it("recomputes the fill when value changes", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="10" tone="flow"></tulpar-progress>`,
      );
      await el.updateComplete;
      const before = flowColor(el);
      el.value = 90;
      await el.updateComplete;
      const after = flowColor(el);
      expect(after).to.not.equal(before);
    });

    it("indeterminate + flow falls back to the brand accent (no crash, no inline color)", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress tone="flow" indeterminate></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(flowColor(el)).to.equal("");
      expect(accentL(el)).to.equal("");
    });

    it("flow is purely visual — a11y attrs unchanged", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress value="40" tone="flow"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("role")).to.equal("progressbar");
      expect(el.getAttribute("aria-valuemin")).to.equal("0");
      expect(el.getAttribute("aria-valuemax")).to.equal("100");
      expect(el.getAttribute("aria-valuenow")).to.equal("40");
    });

    it("applies to the circular ring too", async () => {
      const el = await fixture<TulparProgress>(
        html`<tulpar-progress variant="circular" value="20" tone="flow"></tulpar-progress>`,
      );
      await el.updateComplete;
      expect(flowColor(el)).to.contain("color-mix(in oklab");
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
