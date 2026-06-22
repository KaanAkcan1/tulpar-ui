import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-tag";
import type { TulparTag } from "./tulpar-tag";
import { tagStyles } from "./tulpar-tag.styles";

function tagEl(el: TulparTag): HTMLElement {
  return el.shadowRoot!.querySelector(".tag") as HTMLElement;
}

describe("public type exports", () => {
  it("re-exports TulparTag from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparTag).to.exist;
  });
  it("re-exports TulparTag from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparTag).to.exist;
  });
});

describe("<tulpar-tag>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-tag")).to.exist;
  });

  it("defaults to neutral / soft-tonal / square / md", async () => {
    const el = await fixture<TulparTag>(html`<tulpar-tag label="Tag"></tulpar-tag>`);
    expect(el.tone).to.equal("neutral");
    expect(el.variant).to.equal("soft-tonal");
    expect(el.shape).to.equal("square");
    expect(el.size).to.equal("md");
    // reflected attributes drive the CSS
    expect(el.getAttribute("tone")).to.equal("neutral");
    expect(el.getAttribute("variant")).to.equal("soft-tonal");
    // role for AT
    expect(el.getAttribute("role")).to.equal("status");
  });

  it("renders the label from the prop and from the default slot", async () => {
    const fromProp = await fixture<TulparTag>(html`<tulpar-tag label="Hello"></tulpar-tag>`);
    expect(tagEl(fromProp).textContent).to.contain("Hello");

    const fromSlot = await fixture<TulparTag>(html`<tulpar-tag>Slotted</tulpar-tag>`);
    const slot = fromSlot.shadowRoot!.querySelector(".label slot") as HTMLSlotElement;
    expect(slot.assignedNodes({ flatten: true }).map((n) => n.textContent).join("")).to.contain(
      "Slotted",
    );
  });

  describe("variant → tone tokens (computed style)", () => {
    it("soft-tonal success has a non-transparent background", async () => {
      const el = await fixture<TulparTag>(
        html`<tulpar-tag tone="success" variant="soft-tonal" label="Active"></tulpar-tag>`,
      );
      const bg = getComputedStyle(tagEl(el)).backgroundColor;
      expect(bg).to.not.equal("rgba(0, 0, 0, 0)");
      expect(bg).to.not.equal("transparent");
    });

    it("outline danger has a transparent fill but a colored border", async () => {
      const el = await fixture<TulparTag>(
        html`<tulpar-tag tone="danger" variant="outline" label="Error"></tulpar-tag>`,
      );
      const cs = getComputedStyle(tagEl(el));
      expect(cs.backgroundColor).to.be.oneOf(["rgba(0, 0, 0, 0)", "transparent"]);
      // border color resolves to the danger outline token (not transparent)
      expect(cs.borderTopColor).to.not.equal("rgba(0, 0, 0, 0)");
    });

    it("solid info has a saturated fill and white-ish text", async () => {
      const el = await fixture<TulparTag>(
        html`<tulpar-tag tone="info" variant="solid" label="Info"></tulpar-tag>`,
      );
      const cs = getComputedStyle(tagEl(el));
      expect(cs.backgroundColor).to.not.equal("rgba(0, 0, 0, 0)");
      // info solid text token is #ffffff
      expect(cs.color).to.equal("rgb(255, 255, 255)");
    });
  });

  describe("shape → radius", () => {
    it("square uses the per-size radius (md = 6px)", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag label="x"></tulpar-tag>`);
      expect(getComputedStyle(tagEl(el)).borderTopLeftRadius).to.equal("6px");
    });
    it("pill uses a full pill radius", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag shape="pill" label="x"></tulpar-tag>`);
      // pill = 9999px; browsers visually clamp to half-height but the computed
      // longhand reports the authored value here.
      expect(getComputedStyle(tagEl(el)).borderTopLeftRadius).to.equal("9999px");
    });
    it("sharp uses 2px", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag shape="sharp" label="x"></tulpar-tag>`);
      expect(getComputedStyle(tagEl(el)).borderTopLeftRadius).to.equal("2px");
    });
  });

  describe("size", () => {
    it("md height is 24px; sm height is 20px", async () => {
      const md = await fixture<TulparTag>(html`<tulpar-tag label="x"></tulpar-tag>`);
      expect(getComputedStyle(tagEl(md)).height).to.equal("24px");
      const sm = await fixture<TulparTag>(html`<tulpar-tag size="sm" label="x"></tulpar-tag>`);
      expect(getComputedStyle(tagEl(sm)).height).to.equal("20px");
    });
  });

  describe("dot + icon", () => {
    it("dot renders a visible leading dot", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag dot label="On"></tulpar-tag>`);
      await el.updateComplete;
      const dot = el.shadowRoot!.querySelector(".dot") as HTMLElement;
      expect(getComputedStyle(dot).display).to.not.equal("none");
    });

    it("icon prop renders a leading icon glyph", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag icon="★" label="Star"></tulpar-tag>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector(".icon") as HTMLElement;
      expect(getComputedStyle(icon).display).to.not.equal("none");
      const target = el.shadowRoot!.querySelector(".icon-prop-target") as HTMLElement;
      expect(target.textContent).to.equal("★");
    });

    it("icon wins over dot when both are set", async () => {
      const el = await fixture<TulparTag>(
        html`<tulpar-tag dot icon="★" label="Both"></tulpar-tag>`,
      );
      await el.updateComplete;
      const dot = el.shadowRoot!.querySelector(".dot") as HTMLElement;
      const icon = el.shadowRoot!.querySelector(".icon") as HTMLElement;
      expect(getComputedStyle(icon).display).to.not.equal("none");
      expect(getComputedStyle(dot).display).to.equal("none");
      expect(el.hasAttribute("data-show-icon")).to.be.true;
      expect(el.hasAttribute("data-show-dot")).to.be.false;
    });

    it("slotted icon wins over the icon prop (prop target hidden)", async () => {
      const el = await fixture<TulparTag>(
        html`<tulpar-tag icon="★" label="x"><svg slot="icon"></svg></tulpar-tag>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("data-slot-icon")).to.be.true;
      const target = el.shadowRoot!.querySelector(".icon-prop-target") as HTMLElement;
      expect(getComputedStyle(target).display).to.equal("none");
    });
  });

  describe("truncation", () => {
    it("sets the native title when the label overflows", async () => {
      const long = "this is a very very very long label that should certainly overflow the box";
      const el = await fixture<TulparTag>(
        html`<tulpar-tag style="--tulpar-tag-max-width:60px" label=${long}></tulpar-tag>`,
      );
      await el.updateComplete;
      // firstUpdated schedules an overflow re-check on the next frame; wait for
      // two frames so scrollWidth is laid out and the title is synced.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      expect(el.getAttribute("title")).to.equal(long);
    });

    it("sets the native title when a SLOTTED label overflows", async () => {
      const long = "this is a very very very long slotted label that should certainly overflow";
      const el = await fixture<TulparTag>(
        html`<tulpar-tag style="--tulpar-tag-max-width:60px">${long}</tulpar-tag>`,
      );
      await el.updateComplete;
      // slotchange + firstUpdated both schedule an overflow re-check; wait two
      // frames so scrollWidth is laid out and the title is synced from _slotText.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      expect(el.getAttribute("title")).to.equal(long);
    });

    it("does NOT set title for a short label", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag label="ok"></tulpar-tag>`);
      await el.updateComplete;
      expect(el.hasAttribute("title")).to.be.false;
    });
  });

  describe("disabled", () => {
    it("dims via reduced opacity", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag disabled label="x"></tulpar-tag>`);
      expect(el.hasAttribute("disabled")).to.be.true;
      expect(Number(getComputedStyle(el).opacity)).to.be.lessThan(1);
    });
  });

  it("has NO remove / close button", async () => {
    const el = await fixture<TulparTag>(html`<tulpar-tag label="x"></tulpar-tag>`);
    expect(el.shadowRoot!.querySelector("button")).to.equal(null);
    expect(el.shadowRoot!.querySelector('[part="remove"]')).to.equal(null);
  });

  describe("custom tone", () => {
    it("sets inline --tulpar-tag-* vars from a brand family", async () => {
      const el = await fixture<TulparTag>(
        html`<tulpar-tag tone="custom" color="ilay" label="x"></tulpar-tag>`,
      );
      await el.updateComplete;
      expect(el.style.getPropertyValue("--tulpar-tag-surface-l").trim()).to.not.equal("");
      expect(el.style.getPropertyValue("--tulpar-tag-surface-d").trim()).to.not.equal("");
    });

    it("clears inline custom vars when switching back to a built-in tone", async () => {
      const el = await fixture<TulparTag>(
        html`<tulpar-tag tone="custom" color="ilay" label="x"></tulpar-tag>`,
      );
      await el.updateComplete;
      el.tone = "success";
      await el.updateComplete;
      expect(el.style.getPropertyValue("--tulpar-tag-surface-l").trim()).to.equal("");
    });

    it("solid variant fills with the resolved accent, not the soft surface", async () => {
      // A raw CSS color resolves via color-mix (a real computed value even when
      // the token sheet isn't loaded), unlike brand-family primitive vars.
      const raw = "#0d9488";
      const solid = await fixture<TulparTag>(
        html`<tulpar-tag tone="custom" variant="solid" color=${raw} label="x"></tulpar-tag>`,
      );
      await solid.updateComplete;
      const solidBg = getComputedStyle(tagEl(solid)).backgroundColor;
      // a real fill (not the transparent fallback)
      expect(solidBg).to.not.be.oneOf(["rgba(0, 0, 0, 0)", "transparent"]);

      // For the same custom color, soft-tonal tints toward white; solid uses the
      // saturated accent — so the two backgrounds must differ.
      const soft = await fixture<TulparTag>(
        html`<tulpar-tag tone="custom" variant="soft-tonal" color=${raw} label="x"></tulpar-tag>`,
      );
      await soft.updateComplete;
      const softBg = getComputedStyle(tagEl(soft)).backgroundColor;
      expect(solidBg).to.not.equal(softBg);

      // solid uses the accent inline var, distinct from the soft surface var
      const surfaceL = solid.style.getPropertyValue("--tulpar-tag-surface-l").trim();
      const accentL = solid.style.getPropertyValue("--tulpar-tag-accent-l").trim();
      expect(accentL).to.not.equal("");
      expect(accentL).to.not.equal(surfaceL);
    });
  });

  describe("styles", () => {
    it("includes a forced-colors block", () => {
      expect(tagStyles.cssText).to.include("forced-colors");
    });
  });

  // Regression guard for the slotchange→requestUpdate infinite loop fixed in
  // 816d2a4: assignedNodes({ flatten:true }) counts the rendered `label` prop
  // fallback as assigned, flipping _hasSlotLabel every render and hard-locking
  // the page when the prop form is used. Plain assignedNodes() must be used.
  describe("slot/prop loop guard", () => {
    it("prop-only label does NOT register as slot content", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag label="Active"></tulpar-tag>`);
      await el.updateComplete;
      // {flatten:true} would make this true (the regression).
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.false;
    });

    it("real slotted content wins (flag true, prop fallback suppressed)", async () => {
      const el = await fixture<TulparTag>(
        html`<tulpar-tag label="Active">Slotted</tulpar-tag>`,
      );
      await el.updateComplete;
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.true;
      // The default slot renders the slotted child; the prop fallback is suppressed.
      const slot = el.shadowRoot!.querySelector(".label slot") as HTMLSlotElement;
      const assigned = slot.assignedNodes().map((n) => n.textContent).join("");
      expect(assigned).to.contain("Slotted");
      expect(assigned).to.not.contain("Active");
    });

    it("prop form settles without flipping on a later slotchange (no loop)", async () => {
      const el = await fixture<TulparTag>(html`<tulpar-tag label="Active"></tulpar-tag>`);
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
