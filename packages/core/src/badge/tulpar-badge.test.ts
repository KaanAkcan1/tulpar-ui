import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-badge";
import type { TulparBadge } from "./tulpar-badge";
import { badgeStyles } from "./tulpar-badge.styles";

function badge(el: TulparBadge): HTMLElement {
  return el.shadowRoot!.querySelector(".badge") as HTMLElement;
}
function countText(el: TulparBadge): string {
  return (el.shadowRoot!.querySelector(".count") as HTMLElement).textContent!.trim();
}

describe("public type exports", () => {
  it("re-exports TulparBadge from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparBadge).to.exist;
  });
  it("re-exports TulparBadge from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparBadge).to.exist;
  });
});

describe("<tulpar-badge>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-badge")).to.exist;
  });

  it("defaults to neutral / solid / pill / md", async () => {
    const el = await fixture<TulparBadge>(html`<tulpar-badge count="3"></tulpar-badge>`);
    expect(el.tone).to.equal("neutral");
    expect(el.variant).to.equal("solid");
    expect(el.shape).to.equal("pill");
    expect(el.size).to.equal("md");
    // solid default → saturated fill (not transparent)
    expect(getComputedStyle(badge(el)).backgroundColor).to.not.equal("rgba(0, 0, 0, 0)");
  });

  describe("numeric mode", () => {
    it("renders the count", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge count="8"></tulpar-badge>`);
      await el.updateComplete;
      expect(countText(el)).to.equal("8");
    });

    it("count=100, max=99 → 99+", async () => {
      const el = await fixture<TulparBadge>(
        html`<tulpar-badge count="100" max="99"></tulpar-badge>`,
      );
      await el.updateComplete;
      expect(countText(el)).to.equal("99+");
    });

    it("custom max caps correctly (max=9 → 9+)", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge count="42" max="9"></tulpar-badge>`);
      await el.updateComplete;
      expect(countText(el)).to.equal("9+");
    });

    it("count=0 is hidden by default", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge count="0"></tulpar-badge>`);
      await el.updateComplete;
      expect(el.hasAttribute("hidden")).to.be.true;
      expect(getComputedStyle(el).display).to.equal("none");
    });

    it("count=0 with show-zero renders 0", async () => {
      const el = await fixture<TulparBadge>(
        html`<tulpar-badge count="0" show-zero></tulpar-badge>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("hidden")).to.be.false;
      expect(countText(el)).to.equal("0");
    });
  });

  describe("dot mode", () => {
    it("renders a circular dot and ignores count", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge dot count="5"></tulpar-badge>`);
      await el.updateComplete;
      const b = badge(el);
      expect(b.classList.contains("is-dot")).to.be.true;
      expect(el.getAttribute("data-mode")).to.equal("dot");
      // dot md = 8px circle
      expect(getComputedStyle(b).width).to.equal("8px");
      expect(getComputedStyle(b).height).to.equal("8px");
    });

    it("dot is not hidden even with no count", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge dot></tulpar-badge>`);
      await el.updateComplete;
      expect(el.hasAttribute("hidden")).to.be.false;
    });
  });

  describe("size", () => {
    it("count height md=18px, sm=16px, lg=20px", async () => {
      const md = await fixture<TulparBadge>(html`<tulpar-badge count="3"></tulpar-badge>`);
      expect(getComputedStyle(badge(md)).height).to.equal("18px");
      const sm = await fixture<TulparBadge>(
        html`<tulpar-badge size="sm" count="3"></tulpar-badge>`,
      );
      expect(getComputedStyle(badge(sm)).height).to.equal("16px");
      const lg = await fixture<TulparBadge>(
        html`<tulpar-badge size="lg" count="3"></tulpar-badge>`,
      );
      expect(getComputedStyle(badge(lg)).height).to.equal("20px");
    });

    it("min-width equals height (count pill)", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge count="3"></tulpar-badge>`);
      expect(getComputedStyle(badge(el)).minWidth).to.equal("18px");
    });
  });

  describe("accessible name", () => {
    it("sets aria-label '3 notifications' from the label noun", async () => {
      const el = await fixture<TulparBadge>(
        html`<tulpar-badge count="3" label="notifications"></tulpar-badge>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("aria-label")).to.equal("3 notifications");
      expect(el.getAttribute("role")).to.equal("img");
    });

    it("falls back to 'items' noun when no label/slot", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge count="7"></tulpar-badge>`);
      await el.updateComplete;
      expect(el.getAttribute("aria-label")).to.equal("7 items");
    });

    it("derives the noun from slotted text when no label", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge count="5">unread</tulpar-badge>`);
      await el.updateComplete;
      expect(el.getAttribute("aria-label")).to.equal("5 unread");
    });

    it("overflow count uses the capped text in the name (99+ notifications)", async () => {
      const el = await fixture<TulparBadge>(
        html`<tulpar-badge count="250" label="notifications"></tulpar-badge>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("aria-label")).to.equal("99+ notifications");
    });

    it("has no aria-label / role when there is no count (dot, no label)", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge dot></tulpar-badge>`);
      await el.updateComplete;
      expect(el.hasAttribute("aria-label")).to.be.false;
      expect(el.hasAttribute("role")).to.be.false;
    });
  });

  describe("placement (reserved, type-only)", () => {
    it("accepts a placement value but performs NO attached rendering", async () => {
      const el = await fixture<TulparBadge>(
        html`<tulpar-badge count="3" placement="top-end"></tulpar-badge>`,
      );
      await el.updateComplete;
      expect(el.placement).to.equal("top-end");
      // no anchored/absolute DOM — the badge renders inline like any other.
      expect(getComputedStyle(badge(el)).position).to.equal("static");
    });
  });

  describe("styles", () => {
    it("uses tabular-nums and a forced-colors block", () => {
      expect(badgeStyles.cssText).to.include("tabular-nums");
      expect(badgeStyles.cssText).to.include("forced-colors");
    });
  });

  // Regression guard for the slotchange→requestUpdate infinite loop fixed in
  // 816d2a4: assignedNodes({ flatten:true }) counts the rendered `label` prop
  // fallback as assigned, flipping _hasSlotLabel every render and hard-locking
  // the page when the prop form is used. Plain assignedNodes() must be used.
  describe("slot/prop loop guard", () => {
    it("prop-only label does NOT register as slot content", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge label="New"></tulpar-badge>`);
      await el.updateComplete;
      // {flatten:true} would make this true (the regression).
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.false;
    });

    it("real slotted content wins (flag true, prop fallback suppressed)", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge label="New">Beta</tulpar-badge>`);
      await el.updateComplete;
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.true;
      // The default slot renders the slotted child; the prop fallback is suppressed.
      const slot = el.shadowRoot!.querySelector(".label slot") as HTMLSlotElement;
      const assigned = slot
        .assignedNodes()
        .map((n) => n.textContent)
        .join("");
      expect(assigned).to.contain("Beta");
      expect(assigned).to.not.contain("New");
    });

    it("prop form settles without flipping on a later slotchange (no loop)", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge label="New"></tulpar-badge>`);
      await el.updateComplete;
      // Let any queued slotchange/requestUpdate cycles run; a true loop would
      // also blow the per-test timeout.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.false;
      // A subsequent update still resolves (the element is not wedged).
      await el.updateComplete;
    });

    // Vue leaves a `<!---->` comment + whitespace text nodes in the light DOM
    // for an empty `<slot/>` outlet. Neither may count as slot content, else the
    // `label` prop is suppressed and the badge renders empty (Vue-only symptom).
    // The prop is rendered as a sibling `.label-prop` span (NOT slot fallback).
    it("comment + whitespace light DOM does NOT suppress the label prop (Vue empty-slot)", async () => {
      const el = await fixture<TulparBadge>(html`<tulpar-badge label="New"></tulpar-badge>`);
      await el.updateComplete;
      el.appendChild(document.createTextNode("\n  "));
      el.appendChild(document.createComment(""));
      el.appendChild(document.createTextNode("\n  "));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await el.updateComplete;
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.false;
      const labelProp = el.shadowRoot!.querySelector(".label-prop");
      expect(labelProp, ".label-prop sibling should render the prop").to.exist;
      expect(labelProp!.textContent).to.contain("New");
    });
  });
});
