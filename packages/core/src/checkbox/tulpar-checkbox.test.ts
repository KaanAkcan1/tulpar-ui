import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-checkbox";
import type { TulparCheckbox } from "./tulpar-checkbox";
import { checkboxStyles } from "./tulpar-checkbox.styles";
import { selectionControlBaseStyles } from "../_internal/selection-control-base.styles";

function box(el: TulparCheckbox): HTMLSpanElement {
  return el.shadowRoot!.querySelector(".box") as HTMLSpanElement;
}

function pressKey(el: TulparCheckbox, key: string) {
  const b = box(el);
  b.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
}

describe("public type exports", () => {
  it("re-exports TulparCheckbox from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparCheckbox).to.exist;
  });
  it("re-exports TulparCheckbox from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparCheckbox).to.exist;
  });
});

describe("<tulpar-checkbox>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-checkbox")).to.exist;
  });

  it("defaults checked=false with role=checkbox and aria-checked=false", async () => {
    const el = await fixture<TulparCheckbox>(
      html`<tulpar-checkbox label="Accept"></tulpar-checkbox>`,
    );
    expect(el.checked).to.be.false;
    const b = box(el);
    expect(b.getAttribute("role")).to.equal("checkbox");
    expect(b.getAttribute("aria-checked")).to.equal("false");
  });

  it("click toggles checked + aria-checked", async () => {
    const el = await fixture<TulparCheckbox>(
      html`<tulpar-checkbox label="Accept"></tulpar-checkbox>`,
    );
    box(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(box(el).getAttribute("aria-checked")).to.equal("true");
    box(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
    expect(box(el).getAttribute("aria-checked")).to.equal("false");
  });

  it("Space toggles checked", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox></tulpar-checkbox>`);
    pressKey(el, " ");
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  it("clicking the label text (default variant) toggles checked", async () => {
    const el = await fixture<TulparCheckbox>(
      html`<tulpar-checkbox label="Accept"></tulpar-checkbox>`,
    );
    const label = el.shadowRoot!.querySelector(".label") as HTMLElement;
    label.click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  it("clicking the box once does not double-toggle via root forwarding", async () => {
    const el = await fixture<TulparCheckbox>(
      html`<tulpar-checkbox label="Accept"></tulpar-checkbox>`,
    );
    box(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
  });

  it("indeterminate → aria-checked=mixed, independent of checked", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox></tulpar-checkbox>`);
    expect(el.checked).to.be.false;
    el.indeterminate = true;
    await el.updateComplete;
    expect(box(el).getAttribute("aria-checked")).to.equal("mixed");
    // checked remains false
    expect(el.checked).to.be.false;
  });

  it("clicking an indeterminate checkbox sets checked=true and indeterminate=false", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox></tulpar-checkbox>`);
    el.indeterminate = true;
    await el.updateComplete;
    box(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(el.indeterminate).to.be.false;
    expect(box(el).getAttribute("aria-checked")).to.equal("true");
  });

  it("emits a composed, bubbling change event on toggle", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox></tulpar-checkbox>`);
    let evt: Event | null = null;
    el.addEventListener("change", (e) => (evt = e));
    box(el).click();
    await el.updateComplete;
    expect(evt).to.not.be.null;
    expect((evt as unknown as Event).bubbles).to.be.true;
    expect((evt as unknown as Event).composed).to.be.true;
  });

  it("submits value 'on' via FormData when checked, nothing when unchecked", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-checkbox name="agree"></tulpar-checkbox></form>
    `);
    const el = form.querySelector("tulpar-checkbox") as TulparCheckbox;

    let data = new FormData(form);
    expect(data.get("agree")).to.equal(null);

    box(el).click();
    await el.updateComplete;
    data = new FormData(form);
    expect(data.get("agree")).to.equal("on");
  });

  it("indeterminate alone does not submit a value", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-checkbox name="agree"></tulpar-checkbox></form>
    `);
    const el = form.querySelector("tulpar-checkbox") as TulparCheckbox;
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.checked).to.be.false;
    expect(new FormData(form).get("agree")).to.equal(null);
  });

  it("submits custom value when value is set", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-checkbox name="color" value="blue" checked></tulpar-checkbox></form>
    `);
    const el = form.querySelector("tulpar-checkbox") as TulparCheckbox;
    await el.updateComplete;
    const data = new FormData(form);
    expect(data.get("color")).to.equal("blue");
  });

  it("syncs FormData when checked is set programmatically (no click)", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-checkbox name="agree"></tulpar-checkbox></form>
    `);
    const el = form.querySelector("tulpar-checkbox") as TulparCheckbox;
    el.checked = true;
    await el.updateComplete;
    expect(new FormData(form).get("agree")).to.equal("on");
    el.checked = false;
    await el.updateComplete;
    expect(new FormData(form).get("agree")).to.equal(null);
  });

  it("formResetCallback restores initial checked and indeterminate", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-checkbox name="agree" checked></tulpar-checkbox></form>
    `);
    const el = form.querySelector("tulpar-checkbox") as TulparCheckbox;
    box(el).click();
    await el.updateComplete;
    expect(el.checked).to.be.false;
    form.reset();
    await el.updateComplete;
    expect(el.checked).to.be.true;
    expect(new FormData(form).get("agree")).to.equal("on");
  });

  it("formResetCallback restores initial indeterminate=false", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-checkbox name="x"></tulpar-checkbox></form>
    `);
    const el = form.querySelector("tulpar-checkbox") as TulparCheckbox;
    el.indeterminate = true;
    await el.updateComplete;
    form.reset();
    await el.updateComplete;
    expect(el.indeterminate).to.be.false;
  });

  it("disabled blocks toggle", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox disabled></tulpar-checkbox>`);
    box(el).click();
    pressKey(el, " ");
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it("readonly blocks toggle", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox readonly></tulpar-checkbox>`);
    box(el).click();
    pressKey(el, " ");
    await el.updateComplete;
    expect(el.checked).to.be.false;
  });

  it("custom icon slot sets data-has-icon attribute", async () => {
    const el = await fixture<TulparCheckbox>(html`
      <tulpar-checkbox>
        <svg slot="icon" aria-hidden="true"><path d="M3 8l4 4 6-6"/></svg>
      </tulpar-checkbox>
    `);
    await el.updateComplete;
    expect(el.hasAttribute("data-has-icon")).to.be.true;
  });

  it("dash glyph is present in shadow DOM", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox></tulpar-checkbox>`);
    expect(el.shadowRoot!.querySelector(".glyph--dash")).to.exist;
  });

  it("indeterminate host attribute is set when indeterminate=true", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox></tulpar-checkbox>`);
    el.indeterminate = true;
    await el.updateComplete;
    expect(el.hasAttribute("indeterminate")).to.be.true;
  });

  it("variant=card reflects to attribute", async () => {
    const el = await fixture<TulparCheckbox>(
      html`<tulpar-checkbox variant="card"></tulpar-checkbox>`,
    );
    await el.updateComplete;
    expect(el.getAttribute("variant")).to.equal("card");
    expect(el.variant).to.equal("card");
  });

  it("variant defaults to 'default'", async () => {
    const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox></tulpar-checkbox>`);
    expect(el.variant).to.equal("default");
  });

  describe("a11y wiring", () => {
    it("invalid + required set aria-invalid / aria-required", async () => {
      const el = await fixture<TulparCheckbox>(
        html`<tulpar-checkbox invalid required></tulpar-checkbox>`,
      );
      const b = box(el);
      expect(b.getAttribute("aria-invalid")).to.equal("true");
      expect(b.getAttribute("aria-required")).to.equal("true");
    });

    it("disabled sets aria-disabled on box", async () => {
      const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox disabled></tulpar-checkbox>`);
      const b = box(el);
      expect(b.getAttribute("aria-disabled")).to.equal("true");
    });

    it("readonly sets aria-readonly on box", async () => {
      const el = await fixture<TulparCheckbox>(html`<tulpar-checkbox readonly></tulpar-checkbox>`);
      const b = box(el);
      expect(b.getAttribute("aria-readonly")).to.equal("true");
    });
  });

  describe("styles", () => {
    it("focus-visible adds an outline on the box", () => {
      const css = checkboxStyles.cssText;
      expect(css).to.match(/\.box:focus-visible/);
      expect(css).to.include("outline");
      expect(css).to.include("forced-colors");
    });

    it("reduced motion disables transitions", () => {
      const css = checkboxStyles.cssText;
      expect(css).to.match(/prefers-reduced-motion:\s*reduce/);
      expect(css).to.include("transition: none");
    });

    it("reduced motion shows tick instantly (dashoffset 0)", () => {
      const css = checkboxStyles.cssText;
      expect(css).to.include("stroke-dashoffset: 0");
    });
  });

  describe("variant=card", () => {
    it("card CSS rules exist in shared base styles", () => {
      const css = selectionControlBaseStyles.cssText;
      expect(css).to.include('[variant="card"]');
      expect(css).to.include("border");
      expect(css).to.include("border-radius");
    });

    it("card: clicking the root label (not the box) toggles checked", async () => {
      const el = await fixture<TulparCheckbox>(
        html`<tulpar-checkbox variant="card" label="Card option"></tulpar-checkbox>`,
      );
      const root = el.shadowRoot!.querySelector(".root") as HTMLElement;
      root.click();
      await el.updateComplete;
      expect(el.checked).to.be.true;
      root.click();
      await el.updateComplete;
      expect(el.checked).to.be.false;
    });

    it("card: checked attribute is present after selection", async () => {
      const el = await fixture<TulparCheckbox>(
        html`<tulpar-checkbox variant="card" label="Card option"></tulpar-checkbox>`,
      );
      const root = el.shadowRoot!.querySelector(".root") as HTMLElement;
      root.click();
      await el.updateComplete;
      expect(el.hasAttribute("checked")).to.be.true;
    });

    it("card: inner control retains role=checkbox and aria-checked", async () => {
      const el = await fixture<TulparCheckbox>(
        html`<tulpar-checkbox variant="card" label="Card option"></tulpar-checkbox>`,
      );
      const b = box(el);
      expect(b.getAttribute("role")).to.equal("checkbox");
      expect(b.getAttribute("aria-checked")).to.equal("false");

      b.click();
      await el.updateComplete;
      expect(b.getAttribute("aria-checked")).to.equal("true");
    });

    it("card: indeterminate also reflects to host attribute (indeterminate card state)", async () => {
      const el = await fixture<TulparCheckbox>(
        html`<tulpar-checkbox variant="card"></tulpar-checkbox>`,
      );
      el.indeterminate = true;
      await el.updateComplete;
      expect(el.hasAttribute("indeterminate")).to.be.true;
    });

    it("card+invalid: invalid attribute is reflected to host", async () => {
      const el = await fixture<TulparCheckbox>(
        html`<tulpar-checkbox variant="card" invalid label="Option"></tulpar-checkbox>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("invalid")).to.be.true;
    });

    it("card+disabled: disabled attribute is reflected to host", async () => {
      const el = await fixture<TulparCheckbox>(
        html`<tulpar-checkbox variant="card" disabled label="Option"></tulpar-checkbox>`,
      );
      await el.updateComplete;
      expect(el.hasAttribute("disabled")).to.be.true;
    });

    it("card CSS: card checked selector includes --_sel-fill border reference", () => {
      const css = selectionControlBaseStyles.cssText;
      expect(css).to.include("[checked]");
      expect(css).to.include("--_sel-fill");
    });

    it("card CSS: invalid+checked suppresses tint (overrides background)", () => {
      const css = selectionControlBaseStyles.cssText;
      expect(css).to.include("[invalid][checked]");
    });

    it("card CSS: reduced-motion block present for card", () => {
      const css = selectionControlBaseStyles.cssText;
      // The base styles file has a reduced-motion block for [variant="card"]
      expect(css).to.match(/prefers-reduced-motion/);
      expect(css).to.include('[variant="card"]');
    });

    it("card CSS: forced-colors block provides CanvasText outline fallback", () => {
      const css = selectionControlBaseStyles.cssText;
      expect(css).to.include("forced-colors");
      expect(css).to.include("CanvasText");
    });
  });
});
