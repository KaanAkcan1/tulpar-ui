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
