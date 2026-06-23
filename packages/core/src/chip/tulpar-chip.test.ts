import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "./tulpar-chip";
import type { TulparChip } from "./tulpar-chip";
import { chipStyles } from "./tulpar-chip.styles";

function chipEl(el: TulparChip): HTMLElement {
  return el.shadowRoot!.querySelector(".chip") as HTMLElement;
}
function removeBtn(el: TulparChip): HTMLButtonElement | null {
  return el.shadowRoot!.querySelector("button.x") as HTMLButtonElement | null;
}
/** Fire a keydown on the host itself (so e.target === the chip). */
function pressKey(el: TulparChip, key: string) {
  el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
}

describe("public type exports", () => {
  it("re-exports TulparChip from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparChip).to.exist;
  });
  it("re-exports TulparChip from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparChip).to.exist;
  });
});

describe("<tulpar-chip>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-chip")).to.exist;
  });

  it("defaults to neutral / soft-tonal / square / md", async () => {
    const el = await fixture<TulparChip>(html`<tulpar-chip label="Chip"></tulpar-chip>`);
    expect(el.tone).to.equal("neutral");
    expect(el.variant).to.equal("soft-tonal");
    expect(el.shape).to.equal("square");
    expect(el.size).to.equal("md");
    expect(el.getAttribute("tone")).to.equal("neutral");
    expect(el.getAttribute("variant")).to.equal("soft-tonal");
  });

  it("is role=button and focusable (tabindex=0) by default", async () => {
    const el = await fixture<TulparChip>(html`<tulpar-chip label="x"></tulpar-chip>`);
    expect(el.getAttribute("role")).to.equal("button");
    expect(el.getAttribute("tabindex")).to.equal("0");
  });

  it("renders the label from the prop and from the default slot", async () => {
    const fromProp = await fixture<TulparChip>(html`<tulpar-chip label="Hello"></tulpar-chip>`);
    expect(chipEl(fromProp).textContent).to.contain("Hello");

    const fromSlot = await fixture<TulparChip>(html`<tulpar-chip>Slotted</tulpar-chip>`);
    const slot = fromSlot.shadowRoot!.querySelector(".label slot") as HTMLSlotElement;
    expect(
      slot
        .assignedNodes({ flatten: true })
        .map((n) => n.textContent)
        .join(""),
    ).to.contain("Slotted");
  });

  // ─── Click activation ──────────────────────────────────────────────────────
  describe("tulpar-click", () => {
    it("fires on click of the chip body", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="All"></tulpar-chip>`);
      setTimeout(() => chipEl(el).click());
      const ev = await oneEvent(el, "tulpar-click");
      expect(ev).to.exist;
    });

    it("fires on Enter when focused", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="All"></tulpar-chip>`);
      setTimeout(() => pressKey(el, "Enter"));
      const ev = await oneEvent(el, "tulpar-click");
      expect(ev).to.exist;
    });

    it("fires on Space when focused", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="All"></tulpar-chip>`);
      setTimeout(() => pressKey(el, " "));
      const ev = await oneEvent(el, "tulpar-click");
      expect(ev).to.exist;
    });
  });

  // ─── Remove control ────────────────────────────────────────────────────────
  describe("removable", () => {
    it("renders a trailing <button> with an aria-label when removable", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip removable label="kaan@x.com"></tulpar-chip>`,
      );
      const btn = removeBtn(el);
      expect(btn).to.exist;
      expect(btn!.getAttribute("aria-label")).to.equal("Remove kaan@x.com");
    });

    it("has no remove button unless removable", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="x"></tulpar-chip>`);
      expect(removeBtn(el)).to.equal(null);
    });

    it("remove button fires tulpar-remove", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip removable label="x"></tulpar-chip>`);
      setTimeout(() => removeBtn(el)!.click());
      const ev = await oneEvent(el, "tulpar-remove");
      expect(ev).to.exist;
    });

    it("clicking remove does NOT also fire tulpar-click (stopPropagation)", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip removable label="x"></tulpar-chip>`);
      let clickFired = false;
      el.addEventListener("tulpar-click", () => (clickFired = true));
      setTimeout(() => removeBtn(el)!.click());
      const ev = await oneEvent(el, "tulpar-remove");
      expect(ev).to.exist;
      expect(clickFired).to.be.false;
    });

    it("Delete on the focused chip fires tulpar-remove", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip removable label="x"></tulpar-chip>`);
      setTimeout(() => pressKey(el, "Delete"));
      const ev = await oneEvent(el, "tulpar-remove");
      expect(ev).to.exist;
    });

    it("Backspace on the focused chip fires tulpar-remove", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip removable label="x"></tulpar-chip>`);
      setTimeout(() => pressKey(el, "Backspace"));
      const ev = await oneEvent(el, "tulpar-remove");
      expect(ev).to.exist;
    });

    it("Delete does nothing when not removable", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="x"></tulpar-chip>`);
      let removeFired = false;
      el.addEventListener("tulpar-remove", () => (removeFired = true));
      pressKey(el, "Delete");
      expect(removeFired).to.be.false;
    });
  });

  // ─── Focus management after remove ─────────────────────────────────────────
  describe("focus after remove", () => {
    it("moves focus to the next sibling chip", async () => {
      const wrap = await fixture<HTMLDivElement>(html`
        <div>
          <tulpar-chip id="a" removable label="A"></tulpar-chip>
          <tulpar-chip id="b" removable label="B"></tulpar-chip>
        </div>
      `);
      const a = wrap.querySelector("#a") as TulparChip;
      const b = wrap.querySelector("#b") as TulparChip;
      a.focus();
      // remove the first; on tulpar-remove a listener detaches it (like a real app)
      a.addEventListener("tulpar-remove", () => a.remove());
      removeBtn(a)!.click();
      await b.updateComplete;
      expect(document.activeElement).to.equal(b);
    });

    it("falls back to the previous sibling chip when there is no next", async () => {
      const wrap = await fixture<HTMLDivElement>(html`
        <div>
          <tulpar-chip id="a" removable label="A"></tulpar-chip>
          <tulpar-chip id="b" removable label="B"></tulpar-chip>
        </div>
      `);
      const a = wrap.querySelector("#a") as TulparChip;
      const b = wrap.querySelector("#b") as TulparChip;
      b.focus();
      b.addEventListener("tulpar-remove", () => b.remove());
      removeBtn(b)!.click();
      await a.updateComplete;
      expect(document.activeElement).to.equal(a);
    });
  });

  // ─── Ghost ─────────────────────────────────────────────────────────────────
  describe("ghost variant", () => {
    it("has a transparent rest background", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip variant="ghost" label="Status"></tulpar-chip>`,
      );
      const bg = getComputedStyle(chipEl(el)).backgroundColor;
      expect(bg).to.be.oneOf(["rgba(0, 0, 0, 0)", "transparent"]);
    });
  });

  // ─── Tone / variant computed styles ────────────────────────────────────────
  describe("variant → tone tokens (computed style)", () => {
    it("soft-tonal success has a non-transparent background", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip tone="success" label="Active"></tulpar-chip>`,
      );
      const bg = getComputedStyle(chipEl(el)).backgroundColor;
      expect(bg).to.not.be.oneOf(["rgba(0, 0, 0, 0)", "transparent"]);
    });

    it("solid info has a saturated fill and white text", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip tone="info" variant="solid" label="Info"></tulpar-chip>`,
      );
      const cs = getComputedStyle(chipEl(el));
      expect(cs.backgroundColor).to.not.equal("rgba(0, 0, 0, 0)");
      expect(cs.color).to.equal("rgb(255, 255, 255)");
    });
  });

  describe("shape → radius", () => {
    it("square uses the per-size radius (md = 6px)", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="x"></tulpar-chip>`);
      expect(getComputedStyle(chipEl(el)).borderTopLeftRadius).to.equal("6px");
    });
    it("pill uses a full pill radius", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip shape="pill" label="x"></tulpar-chip>`,
      );
      expect(getComputedStyle(chipEl(el)).borderTopLeftRadius).to.equal("9999px");
    });
    it("sharp uses 2px", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip shape="sharp" label="x"></tulpar-chip>`,
      );
      expect(getComputedStyle(chipEl(el)).borderTopLeftRadius).to.equal("2px");
    });
  });

  describe("size", () => {
    it("md height is 24px; sm height is 20px", async () => {
      const md = await fixture<TulparChip>(html`<tulpar-chip label="x"></tulpar-chip>`);
      expect(getComputedStyle(chipEl(md)).height).to.equal("24px");
      const sm = await fixture<TulparChip>(html`<tulpar-chip size="sm" label="x"></tulpar-chip>`);
      expect(getComputedStyle(chipEl(sm)).height).to.equal("20px");
    });
  });

  // ─── Leading icon vs avatar ────────────────────────────────────────────────
  describe("leading icon vs avatar", () => {
    it("icon prop renders a leading icon glyph", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip icon="★" label="Star"></tulpar-chip>`);
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector(".icon") as HTMLElement;
      expect(getComputedStyle(icon).display).to.not.equal("none");
      const target = el.shadowRoot!.querySelector(".icon-prop-target") as HTMLElement;
      expect(target.textContent).to.equal("★");
    });

    it("avatar initials render a leading avatar", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip avatar="JD" label="Jane Doe"></tulpar-chip>`,
      );
      await el.updateComplete;
      const avatar = el.shadowRoot!.querySelector(".avatar") as HTMLElement;
      expect(getComputedStyle(avatar).display).to.not.equal("none");
      const target = el.shadowRoot!.querySelector(".avatar-prop-target") as HTMLElement;
      expect(target.textContent).to.equal("JD");
      expect(el.hasAttribute("data-show-avatar")).to.be.true;
    });

    it("avatar image URL renders an <img>", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip avatar="https://example.com/a.png" label="x"></tulpar-chip>`,
      );
      await el.updateComplete;
      const img = el.shadowRoot!.querySelector(".avatar-prop-target img") as HTMLImageElement;
      expect(img).to.exist;
      expect(img.getAttribute("src")).to.equal("https://example.com/a.png");
    });

    it("avatar wins over icon when both are set", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip avatar="JD" icon="★" label="Both"></tulpar-chip>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("data-show-avatar")).to.be.true;
      expect(el.hasAttribute("data-show-icon")).to.be.false;
    });
  });

  // ─── Disabled ──────────────────────────────────────────────────────────────
  describe("disabled", () => {
    it("is not focusable and dims", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip disabled label="x"></tulpar-chip>`);
      expect(el.hasAttribute("tabindex")).to.be.false;
      expect(Number(getComputedStyle(el).opacity)).to.be.lessThan(1);
    });

    it("blocks tulpar-click", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip disabled label="x"></tulpar-chip>`);
      let fired = false;
      el.addEventListener("tulpar-click", () => (fired = true));
      // dispatch a click straight at the body, bypassing pointer-events:none
      chipEl(el).dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
      expect(fired).to.be.false;
    });

    it("regains tabindex when re-enabled", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip disabled label="x"></tulpar-chip>`);
      el.disabled = false;
      await el.updateComplete;
      expect(el.getAttribute("tabindex")).to.equal("0");
    });
  });

  // ─── Custom tone ───────────────────────────────────────────────────────────
  describe("custom tone", () => {
    it("sets inline --tulpar-chip-* vars from a brand family", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip tone="custom" color="ilay" label="x"></tulpar-chip>`,
      );
      await el.updateComplete;
      expect(el.style.getPropertyValue("--tulpar-chip-surface-l").trim()).to.not.equal("");
      expect(el.style.getPropertyValue("--tulpar-chip-surface-d").trim()).to.not.equal("");
    });

    it("clears inline custom vars when switching back to a built-in tone", async () => {
      const el = await fixture<TulparChip>(
        html`<tulpar-chip tone="custom" color="ilay" label="x"></tulpar-chip>`,
      );
      await el.updateComplete;
      el.tone = "success";
      await el.updateComplete;
      expect(el.style.getPropertyValue("--tulpar-chip-surface-l").trim()).to.equal("");
    });
  });

  // ─── Styles cssText ────────────────────────────────────────────────────────
  describe("styles", () => {
    it("includes a focus-visible ring", () => {
      expect(chipStyles.cssText).to.include(":focus-visible");
    });
    it("includes a forced-colors block", () => {
      expect(chipStyles.cssText).to.include("forced-colors");
    });
    it("the remove button has its own focus-visible ring", () => {
      expect(chipStyles.cssText).to.include(".x:focus-visible");
    });
  });

  // ─── Reserved (Wave 2) ─────────────────────────────────────────────────────
  describe("reserved selection (Wave 2)", () => {
    it("does NOT implement selection state / aria-pressed", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="x"></tulpar-chip>`);
      // No selection API on the element, and no aria-pressed on the host.
      expect((el as unknown as Record<string, unknown>).selected).to.be.undefined;
      expect((el as unknown as Record<string, unknown>).selectable).to.be.undefined;
      expect(el.hasAttribute("aria-pressed")).to.be.false;
    });
  });

  // Regression guard for the slotchange→requestUpdate infinite loop fixed in
  // 816d2a4: assignedNodes({ flatten:true }) counts the rendered `label` prop
  // fallback as assigned, flipping _hasSlotLabel every render and hard-locking
  // the page when the prop form is used. Plain assignedNodes() must be used.
  describe("slot/prop loop guard", () => {
    it("prop-only label does NOT register as slot content", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="All"></tulpar-chip>`);
      await el.updateComplete;
      // {flatten:true} would make this true (the regression).
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.false;
    });

    it("real slotted content wins (flag true, prop fallback suppressed)", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="All">Slotted</tulpar-chip>`);
      await el.updateComplete;
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.true;
      // The default slot renders the slotted child; the prop fallback is suppressed.
      const slot = el.shadowRoot!.querySelector(".label slot") as HTMLSlotElement;
      const assigned = slot
        .assignedNodes()
        .map((n) => n.textContent)
        .join("");
      expect(assigned).to.contain("Slotted");
      expect(assigned).to.not.contain("All");
    });

    it("prop form settles without flipping on a later slotchange (no loop)", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="All"></tulpar-chip>`);
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
    // `label` prop is suppressed and the chip renders empty (Vue-only symptom).
    // The prop is rendered as a sibling `.label-prop` span (NOT slot fallback).
    it("comment + whitespace light DOM does NOT suppress the label prop (Vue empty-slot)", async () => {
      const el = await fixture<TulparChip>(html`<tulpar-chip label="All"></tulpar-chip>`);
      await el.updateComplete;
      el.appendChild(document.createTextNode("\n  "));
      el.appendChild(document.createComment(""));
      el.appendChild(document.createTextNode("\n  "));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await el.updateComplete;
      expect((el as unknown as { _hasSlotLabel: boolean })._hasSlotLabel).to.be.false;
      const labelProp = el.shadowRoot!.querySelector(".label-prop");
      expect(labelProp, ".label-prop sibling should render the prop").to.exist;
      expect(labelProp!.textContent).to.contain("All");
      expect(chipEl(el).textContent).to.contain("All");
    });
  });
});
