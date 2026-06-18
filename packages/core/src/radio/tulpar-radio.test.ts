import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-radio";
import type { TulparRadio } from "./tulpar-radio";
import { radioStyles } from "./tulpar-radio.styles";

function box(el: TulparRadio): HTMLSpanElement {
  return el.shadowRoot!.querySelector(".box--radio") as HTMLSpanElement;
}

function pressKey(el: TulparRadio, key: string) {
  const b = box(el);
  b.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
}

describe("public type exports", () => {
  it("re-exports TulparRadio from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparRadio).to.exist;
  });
  it("re-exports TulparRadio from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparRadio).to.exist;
  });
});

describe("<tulpar-radio>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-radio")).to.exist;
  });

  it("defaults checked=false with role=radio and aria-checked=false", async () => {
    const el = await fixture<TulparRadio>(
      html`<tulpar-radio value="a" label="Option A"></tulpar-radio>`,
    );
    expect(el.checked).to.be.false;
    const b = box(el);
    expect(b.getAttribute("role")).to.equal("radio");
    expect(b.getAttribute("aria-checked")).to.equal("false");
  });

  it("requires a value (identity within the group)", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="x"></tulpar-radio>`);
    expect(el.value).to.equal("x");
  });

  it("checked reflects to the host attribute", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a"></tulpar-radio>`);
    el.checked = true;
    await el.updateComplete;
    expect(el.hasAttribute("checked")).to.be.true;
  });

  it("renders a dot glyph in shadow DOM", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a"></tulpar-radio>`);
    expect(el.shadowRoot!.querySelector(".dot")).to.exist;
  });

  it("click selects (checked=true + aria-checked=true)", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a"></tulpar-radio>`);
    box(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(box(el).getAttribute("aria-checked")).to.equal("true");
  });

  it("does NOT un-toggle on a second click", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a"></tulpar-radio>`);
    box(el).click();
    await el.updateComplete;
    box(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  it("Space selects", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a"></tulpar-radio>`);
    pressKey(el, " ");
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  it("emits a composed, bubbling change event on select", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a"></tulpar-radio>`);
    let evt: Event | null = null;
    el.addEventListener("change", (e) => (evt = e));
    box(el).click();
    await el.updateComplete;
    expect(evt).to.not.be.null;
    expect((evt as unknown as Event).bubbles).to.be.true;
    expect((evt as unknown as Event).composed).to.be.true;
  });

  it("does not emit change when already checked", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a" checked></tulpar-radio>`);
    await el.updateComplete;
    let fired = false;
    el.addEventListener("change", () => (fired = true));
    box(el).click();
    await el.updateComplete;
    expect(fired).to.be.false;
  });

  it("disabled blocks select", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a" disabled></tulpar-radio>`);
    box(el).click();
    pressKey(el, " ");
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it("readonly blocks select", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a" readonly></tulpar-radio>`);
    box(el).click();
    pressKey(el, " ");
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it("submits value via FormData when checked, nothing when unchecked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-radio name="choice" value="a"></tulpar-radio></form>
    `);
    const el = form.querySelector("tulpar-radio") as TulparRadio;

    let data = new FormData(form);
    expect(data.get("choice")).to.equal(null);

    box(el).click();
    await el.updateComplete;
    data = new FormData(form);
    expect(data.get("choice")).to.equal("a");
  });

  it("syncs FormData when checked is set programmatically (no click)", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-radio name="choice" value="b"></tulpar-radio></form>
    `);
    const el = form.querySelector("tulpar-radio") as TulparRadio;
    el.checked = true;
    await el.updateComplete;
    expect(new FormData(form).get("choice")).to.equal("b");
    el.checked = false;
    await el.updateComplete;
    expect(new FormData(form).get("choice")).to.equal(null);
  });

  it("formResetCallback restores initial checked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-radio name="choice" value="a" checked></tulpar-radio></form>
    `);
    const el = form.querySelector("tulpar-radio") as TulparRadio;
    el.checked = false;
    await el.updateComplete;
    form.reset();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(new FormData(form).get("choice")).to.equal("a");
  });

  it("variant=card reflects to attribute", async () => {
    const el = await fixture<TulparRadio>(
      html`<tulpar-radio value="a" variant="card"></tulpar-radio>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("variant")).to.equal("card");
    expect(el.variant).to.equal("card");
  });

  it("variant defaults to 'default'", async () => {
    const el = await fixture<TulparRadio>(html`<tulpar-radio value="a"></tulpar-radio>`);
    expect(el.variant).to.equal("default");
  });

  describe("a11y wiring", () => {
    it("disabled sets aria-disabled + tabindex=-1 on box", async () => {
      const el = await fixture<TulparRadio>(html`<tulpar-radio value="a" disabled></tulpar-radio>`);
      const b = box(el);
      expect(b.getAttribute("aria-disabled")).to.equal("true");
      expect(b.getAttribute("tabindex")).to.equal("-1");
    });

    it("readonly sets aria-readonly on box", async () => {
      const el = await fixture<TulparRadio>(html`<tulpar-radio value="a" readonly></tulpar-radio>`);
      expect(box(el).getAttribute("aria-readonly")).to.equal("true");
    });

    it("standalone radio is tab-reachable (tabindex=0)", async () => {
      const el = await fixture<TulparRadio>(html`<tulpar-radio value="a"></tulpar-radio>`);
      expect(box(el).getAttribute("tabindex")).to.equal("0");
    });
  });

  describe("styles", () => {
    it("round box (border-radius 50%)", () => {
      expect(radioStyles.cssText).to.match(/\.box--radio\s*{[^}]*border-radius:\s*50%/);
    });

    it("press applies scale(0.94)", () => {
      expect(radioStyles.cssText).to.include("scale(0.94)");
    });

    it("checked dot grows to final size with a springy transition", () => {
      const css = radioStyles.cssText;
      expect(css).to.match(/:host\(\[checked\]\)\s*\.dot/);
      expect(css).to.include("cubic-bezier(0.34, 1.4, 0.64, 1)");
    });

    it("focus-visible adds an outline + forced-colors fallback", () => {
      const css = radioStyles.cssText;
      expect(css).to.match(/\.box--radio:focus-visible/);
      expect(css).to.include("outline");
      expect(css).to.include("forced-colors");
    });

    it("reduced motion disables transitions and shows the dot at final size", () => {
      const css = radioStyles.cssText;
      expect(css).to.match(/prefers-reduced-motion:\s*reduce/);
      expect(css).to.include("transition: none");
      // Final dot size present inside the reduced-motion block.
      expect(css).to.include("width: 40%");
    });
  });
});
