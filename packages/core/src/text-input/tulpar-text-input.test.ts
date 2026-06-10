import { expect, fixture, html } from "@open-wc/testing";
import "./tulpar-text-input";
import type { TulparTextInput, TextInputType } from "./tulpar-text-input";

describe("<tulpar-text-input> baseline", () => {
  it("registers the element", () => {
    expect(customElements.get("tulpar-text-input")).to.exist;
  });

  it("renders a single-line input", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input></tulpar-text-input>`);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control");
    expect(input).to.exist;
    expect(input!.tagName).to.equal("INPUT");
  });

  it("reflects value to the underlying input", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input value="hello"></tulpar-text-input>`);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("hello");
  });

  it("updates value on user input + reports to form", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-text-input name="email"></tulpar-text-input></form>
    `);
    const el = form.querySelector<TulparTextInput>("tulpar-text-input")!;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.value = "user@example.com";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(new FormData(form).get("email")).to.equal("user@example.com");
  });
});

describe("<tulpar-text-input> type variants", () => {
  const cases: TextInputType[] = ["text", "email", "url", "tel", "search", "password"];
  for (const t of cases) {
    it(`forwards type=${t} to the underlying input`, async () => {
      const el = await fixture<TulparTextInput>(html`<tulpar-text-input type=${t}></tulpar-text-input>`);
      const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
      expect(input.type).to.equal(t);
    });
  }
});

describe("<tulpar-text-input> autocomplete dev warning", () => {
  let originalWarn: typeof console.warn;
  let warnCalls: { args: unknown[] }[] = [];

  beforeEach(() => {
    warnCalls = [];
    originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnCalls.push({ args });
    };
  });

  afterEach(() => {
    console.warn = originalWarn;
  });

  it("warns when type=password but autocomplete is unset", async () => {
    await fixture<TulparTextInput>(html`<tulpar-text-input type="password"></tulpar-text-input>`);
    expect(warnCalls.length).to.equal(1);
    expect(String(warnCalls[0].args[0])).to.match(/autocomplete/i);
  });

  it("does not warn when autocomplete is set", async () => {
    await fixture<TulparTextInput>(html`
      <tulpar-text-input type="password" autocomplete="current-password"></tulpar-text-input>
    `);
    expect(warnCalls.length).to.equal(0);
  });

  it("does not warn for non-sensitive type=text", async () => {
    await fixture<TulparTextInput>(html`<tulpar-text-input></tulpar-text-input>`);
    expect(warnCalls.length).to.equal(0);
  });

  it("warns for type=email + type=tel when autocomplete is unset", async () => {
    await fixture<TulparTextInput>(html`<tulpar-text-input type="email"></tulpar-text-input>`);
    expect(warnCalls.length).to.equal(1);
    warnCalls = [];
    await fixture<TulparTextInput>(html`<tulpar-text-input type="tel"></tulpar-text-input>`);
    expect(warnCalls.length).to.equal(1);
  });
});

describe("<tulpar-text-input> clearable", () => {
  it("does not render clear button when clearable=false", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input value="hi"></tulpar-text-input>`);
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.equal(null);
  });

  it("does not render clear button when value is empty", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input clearable></tulpar-text-input>`);
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.equal(null);
  });

  it("renders clear button when clearable + value present", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input clearable value="hi"></tulpar-text-input>`);
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.not.equal(null);
  });

  it("auto-hides clear button at size=xs (touch target a11y)", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input clearable value="hi" size="xs"></tulpar-text-input>`);
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.equal(null);
  });

  it("clears value + focuses input + dispatches change on click", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input clearable value="hi"></tulpar-text-input>`);
    let changed = false;
    el.addEventListener("change", () => { changed = true; });
    el.shadowRoot!.querySelector<HTMLButtonElement>(".field-clear-btn")!.click();
    await el.updateComplete;
    // Give focus + microtask a chance to settle
    await new Promise((r) => setTimeout(r, 0));
    expect(el.value).to.equal("");
    expect(changed).to.equal(true);
  });
});

describe("<tulpar-text-input> show-count", () => {
  it("shows current length when show-count and no maxlength", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input show-count value="abc"></tulpar-text-input>`);
    expect(el.shadowRoot!.querySelector(".field-counter")?.textContent?.trim()).to.equal("3");
  });

  it("shows X / Y when show-count and maxlength set", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input show-count maxlength="10" value="abc"></tulpar-text-input>`);
    expect(el.shadowRoot!.querySelector(".field-counter")?.textContent?.trim()).to.equal("3 / 10");
  });

  it("switches counter to error color when at maxlength", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input show-count maxlength="3" value="abc"></tulpar-text-input>`);
    const counter = el.shadowRoot!.querySelector<HTMLElement>(".field-counter")!;
    expect(counter.dataset.atLimit).to.equal("true");
  });

  it("does not render counter when show-count is false", async () => {
    const el = await fixture<TulparTextInput>(html`<tulpar-text-input value="abc"></tulpar-text-input>`);
    expect(el.shadowRoot!.querySelector(".field-counter")).to.equal(null);
  });
});
