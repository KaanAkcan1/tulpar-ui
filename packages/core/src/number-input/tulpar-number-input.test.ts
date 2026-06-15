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
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${1234.5} locale="en-US"></tulpar-number-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("1,234.5");
  });

  it("renders TRY currency in tr-TR locale", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input
        format-style="currency"
        currency="TRY"
        locale="tr-TR"
        min-fraction-digits="2"
        max-fraction-digits="2"
        .value=${1234.5}
      ></tulpar-number-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.contain("1.234,50");
  });

  it("applies format-prefix and format-suffix to the display", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input
        format-suffix=" adet"
        locale="tr-TR"
        .value=${1234}
      ></tulpar-number-input>
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
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input locale="en-US" .value=${1234567}></tulpar-number-input>`,
    );
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
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input min="0" max="100"></tulpar-number-input>`,
    );
    typeAndBlur(el, "999");
    await el.updateComplete;
    expect(el.value).to.equal(100);
  });

  it("in-range value passes through unclamped", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input min="0" max="100"></tulpar-number-input>`,
    );
    typeAndBlur(el, "42");
    await el.updateComplete;
    expect(el.value).to.equal(42);
  });

  it("empty input → null when allow-empty (default)", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input min="0" .value=${5}></tulpar-number-input>`,
    );
    typeAndBlur(el, "");
    await el.updateComplete;
    expect(el.value).to.equal(null);
  });

  it("empty input → min when allow-empty=false", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input min="10" .allowEmpty=${false}></tulpar-number-input>`,
    );
    typeAndBlur(el, "");
    await el.updateComplete;
    expect(el.value).to.equal(10);
  });

  it("dispatches change event on blur", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input></tulpar-number-input>`);
    let changed = false;
    el.addEventListener("change", () => {
      changed = true;
    });
    typeAndBlur(el, "7");
    await el.updateComplete;
    expect(changed).to.equal(true);
  });
});

describe("<tulpar-number-input> steppers", () => {
  it("renders increment + decrement buttons by default", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input></tulpar-number-input>`);
    expect(el.shadowRoot!.querySelector(".field-steppers .stepper-inc")).to.not.equal(null);
    expect(el.shadowRoot!.querySelector(".field-steppers .stepper-dec")).to.not.equal(null);
  });

  it("hides steppers when hide-steppers is set", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input hide-steppers></tulpar-number-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-steppers")).to.equal(null);
  });

  it("auto-hides steppers at size=xs", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input size="xs"></tulpar-number-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-steppers")).to.equal(null);
  });

  it("increments by step on pointerdown+pointerup", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${5} step="2"></tulpar-number-input>`,
    );
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".stepper-inc")!;
    btn.dispatchEvent(new PointerEvent("pointerdown"));
    btn.dispatchEvent(new PointerEvent("pointerup"));
    await el.updateComplete;
    expect(el.value).to.equal(7);
  });

  it("decrements by step", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${5} step="1"></tulpar-number-input>`,
    );
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".stepper-dec")!;
    btn.dispatchEvent(new PointerEvent("pointerdown"));
    btn.dispatchEvent(new PointerEvent("pointerup"));
    await el.updateComplete;
    expect(el.value).to.equal(4);
  });

  it("steps from min (or 0) when value is null", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input min="10"></tulpar-number-input>`,
    );
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".stepper-inc")!;
    btn.dispatchEvent(new PointerEvent("pointerdown"));
    btn.dispatchEvent(new PointerEvent("pointerup"));
    await el.updateComplete;
    expect(el.value).to.equal(11); // min(10) + step(1)
  });

  it("disables increment when value === max", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${10} max="10"></tulpar-number-input>`,
    );
    const incBtn = el.shadowRoot!.querySelector<HTMLButtonElement>(".stepper-inc")!;
    expect(incBtn.disabled).to.equal(true);
  });

  it("disables decrement when value === min", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${0} min="0"></tulpar-number-input>`,
    );
    const decBtn = el.shadowRoot!.querySelector<HTMLButtonElement>(".stepper-dec")!;
    expect(decBtn.disabled).to.equal(true);
  });

  it("long-press repeats after step-hold-delay at step-hold-interval", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input
        .value=${0}
        step="1"
        step-hold-delay="50"
        step-hold-interval="20"
      ></tulpar-number-input>
    `);
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".stepper-inc")!;
    btn.dispatchEvent(new PointerEvent("pointerdown"));
    await new Promise((r) => setTimeout(r, 150));
    btn.dispatchEvent(new PointerEvent("pointerup"));
    await el.updateComplete;
    // Initial press (+1) + at least 3 acceleration ticks (50ms delay then 20ms intervals over ~100ms)
    expect(el.value).to.be.greaterThan(3);
  });

  it("stops repeating on pointerleave", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input
        .value=${0}
        step="1"
        step-hold-delay="30"
        step-hold-interval="20"
      ></tulpar-number-input>
    `);
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".stepper-inc")!;
    btn.dispatchEvent(new PointerEvent("pointerdown"));
    await new Promise((r) => setTimeout(r, 80));
    btn.dispatchEvent(new PointerEvent("pointerleave"));
    const valueAtLeave = el.value;
    await new Promise((r) => setTimeout(r, 80));
    expect(el.value).to.equal(valueAtLeave); // no further ticks
  });
});

describe("<tulpar-number-input> keyboard", () => {
  function key(el: TulparNumberInput, opts: KeyboardEventInit) {
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.dispatchEvent(new KeyboardEvent("keydown", { ...opts, bubbles: true, cancelable: true }));
  }

  it("ArrowUp adds step; ArrowDown subtracts step", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${5} step="1"></tulpar-number-input>`,
    );
    key(el, { key: "ArrowUp" });
    await el.updateComplete;
    expect(el.value).to.equal(6);
    key(el, { key: "ArrowDown" });
    await el.updateComplete;
    expect(el.value).to.equal(5);
  });

  it("Shift+ArrowUp multiplies step by 10", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${5} step="1"></tulpar-number-input>`,
    );
    key(el, { key: "ArrowUp", shiftKey: true });
    await el.updateComplete;
    expect(el.value).to.equal(15);
  });

  it("Ctrl+ArrowUp multiplies step by 100", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${5} step="1"></tulpar-number-input>`,
    );
    key(el, { key: "ArrowUp", ctrlKey: true });
    await el.updateComplete;
    expect(el.value).to.equal(105);
  });

  it("Home jumps to min", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${50} min="0"></tulpar-number-input>`,
    );
    key(el, { key: "Home" });
    await el.updateComplete;
    expect(el.value).to.equal(0);
  });

  it("End jumps to max", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${5} max="99"></tulpar-number-input>`,
    );
    key(el, { key: "End" });
    await el.updateComplete;
    expect(el.value).to.equal(99);
  });

  it("arrow stepping respects clamp bounds", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input .value=${99} max="100" step="5"></tulpar-number-input>`,
    );
    key(el, { key: "ArrowUp" });
    await el.updateComplete;
    expect(el.value).to.equal(100); // clamped, not 104
  });
});

describe("<tulpar-number-input> integer-only", () => {
  it("rejects decimal point key + adds data-mask-rejected", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input integer-only></tulpar-number-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    const ev = new KeyboardEvent("keydown", { key: ".", bubbles: true, cancelable: true });
    input.dispatchEvent(ev);
    expect(ev.defaultPrevented).to.equal(true);
    expect(el.hasAttribute("data-mask-rejected")).to.equal(true);
  });

  it("rejects comma decimal separator too", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input integer-only></tulpar-number-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    const ev = new KeyboardEvent("keydown", { key: ",", bubbles: true, cancelable: true });
    input.dispatchEvent(ev);
    expect(ev.defaultPrevented).to.equal(true);
  });

  it("allows decimal keys when integer-only is off", async () => {
    const el = await fixture<TulparNumberInput>(html`<tulpar-number-input></tulpar-number-input>`);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    const ev = new KeyboardEvent("keydown", { key: ".", bubbles: true, cancelable: true });
    input.dispatchEvent(ev);
    expect(ev.defaultPrevented).to.equal(false);
  });

  it("formats with no fraction digits when integer-only", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input
        integer-only
        locale="en-US"
        .value=${1234.5}
      ></tulpar-number-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.not.contain(".5");
    expect(input.value).to.not.contain(",5");
  });

  it("uses numeric inputmode when integer-only", async () => {
    const el = await fixture<TulparNumberInput>(
      html`<tulpar-number-input integer-only></tulpar-number-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.getAttribute("inputmode")).to.equal("numeric");
  });
});

describe("<tulpar-number-input> format prefix/suffix string", () => {
  it("prepends format-prefix to displayed value", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input format-prefix="₺ " .value=${1234} locale="en-US"></tulpar-number-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("₺ 1,234");
  });

  it("appends format-suffix to displayed value", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input
        format-suffix=" adet"
        .value=${1234}
        locale="tr-TR"
      ></tulpar-number-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("1.234 adet");
  });

  it("both prefix and suffix simultaneously", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input
        format-prefix="~"
        format-suffix=" kg"
        .value=${5}
        locale="en-US"
      ></tulpar-number-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("~5 kg");
  });

  it("renders slot prefix host alongside format strings", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input format-prefix="$">
        <span slot="prefix">icon</span>
      </tulpar-number-input>
    `);
    expect(el.shadowRoot!.querySelector(".field-prefix-host")).to.not.equal(null);
  });

  it("typing buffer (focused) shows raw value without format prefix/suffix", async () => {
    const el = await fixture<TulparNumberInput>(html`
      <tulpar-number-input
        format-suffix=" adet"
        .value=${1234}
        locale="en-US"
      ></tulpar-number-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.focus();
    input.dispatchEvent(new Event("focus", { bubbles: true }));
    await el.updateComplete;
    expect(input.value).to.equal("1234"); // raw buffer, no suffix
  });
});
