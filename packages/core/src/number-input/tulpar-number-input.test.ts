import { expect, fixture, html } from "@open-wc/testing";
import "./tulpar-number-input";
import type { TulparNumberInput } from "./tulpar-number-input";

describe("<tulpar-number-input> baseline", () => {
  it("registers the element", () => {
    expect(customElements.get("tulpar-number-input")).to.exist;
  });

  it("default value is null + allow-empty default true", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input></tulpar-number-input>`);
    expect(el.value).to.equal(null);
    expect(el.allowEmpty).to.equal(true);
  });

  it("displays formatted value (en-US grouping)", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input .value=${1234.5} locale="en-US"></tulpar-number-input>`);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("1,234.5");
  });

  it("renders TRY currency in tr-TR locale", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input format-style="currency" currency="TRY" locale="tr-TR"
        min-fraction-digits="2" max-fraction-digits="2" .value=${1234.5}></tulpar-number-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.contain("1.234,50");
  });

  it("applies format-prefix and format-suffix to the display", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input format-suffix=" adet" locale="tr-TR" .value=${1234}></tulpar-number-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.contain(" adet");
  });

  it("empty display when value=null", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input></tulpar-number-input>`);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("");
  });

  it("reports value to the form as string", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-number-input name="qty"></tulpar-number-input></form>
    `);
    const el = form.querySelector<TulparNumberInput>("tulpar-number-input")!;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.focus();
    input.value = "42";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.blur();
    input.dispatchEvent(new Event("blur", { bubbles: true }));
    await el.updateComplete;
    expect(el.value).to.equal(42);
    expect(new FormData(form).get("qty")).to.equal("42");
  });

  it(".formatOptions property overrides shorthand attrs", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input locale="en-US" .value=${1234567}></tulpar-number-input>`);
    el.formatOptions = { notation: "compact", compactDisplay: "short" };
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("1.2M");
  });
});

describe("<tulpar-number-input> clamp on blur", () => {
  function typeAndBlur(el: TulparNumberInput, text: string) {
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.focus();
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    input.value = text;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.blur();
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  it("clamps value below min on blur", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input min="0" max="100"></tulpar-number-input>
    `);
    typeAndBlur(el, "-5");
    await el.updateComplete;
    expect(el.value).to.equal(0);
  });

  it("clamps value above max on blur", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input min="0" max="100"></tulpar-number-input>`);
    typeAndBlur(el, "999");
    await el.updateComplete;
    expect(el.value).to.equal(100);
  });

  it("in-range value passes through unclamped", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input min="0" max="100"></tulpar-number-input>`);
    typeAndBlur(el, "42");
    await el.updateComplete;
    expect(el.value).to.equal(42);
  });

  it("empty input → null when allow-empty (default)", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input min="0" .value=${5}></tulpar-number-input>`);
    typeAndBlur(el, "");
    await el.updateComplete;
    expect(el.value).to.equal(null);
  });

  it("empty input → min when allow-empty=false", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input min="10" .allowEmpty=${false}></tulpar-number-input>`);
    typeAndBlur(el, "");
    await el.updateComplete;
    expect(el.value).to.equal(10);
  });

  it("dispatches change event on blur", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input></tulpar-number-input>`);
    let changed = false;
    el.addEventListener("change", () => { changed = true; });
    typeAndBlur(el, "7");
    await el.updateComplete;
    expect(changed).to.equal(true);
  });
});
