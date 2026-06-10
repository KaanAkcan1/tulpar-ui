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
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input value="hello"></tulpar-text-input>`,
    );
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
      const el = await fixture<TulparTextInput>(
        html`<tulpar-text-input type=${t}></tulpar-text-input>`,
      );
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
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input value="hi"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.equal(null);
  });

  it("does not render clear button when value is empty", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input clearable></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.equal(null);
  });

  it("renders clear button when clearable + value present", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input clearable value="hi"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.not.equal(null);
  });

  it("auto-hides clear button at size=xs (touch target a11y)", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input clearable value="hi" size="xs"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.equal(null);
  });

  it("clears value + focuses input + dispatches change on click", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input clearable value="hi"></tulpar-text-input>`,
    );
    let changed = false;
    el.addEventListener("change", () => {
      changed = true;
    });
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
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input show-count value="abc"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-counter")?.textContent?.trim()).to.equal("3");
  });

  it("shows X / Y when show-count and maxlength set", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input show-count maxlength="10" value="abc"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-counter")?.textContent?.trim()).to.equal("3 / 10");
  });

  it("switches counter to error color when at maxlength", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input show-count maxlength="3" value="abc"></tulpar-text-input>`,
    );
    const counter = el.shadowRoot!.querySelector<HTMLElement>(".field-counter")!;
    expect(counter.dataset.atLimit).to.equal("true");
  });

  it("does not render counter when show-count is false", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input value="abc"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-counter")).to.equal(null);
  });
});

describe("<tulpar-text-input> password reveal toggle", () => {
  it("auto-renders reveal toggle when type=password", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input type="password" autocomplete="current-password"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-reveal-btn")).to.not.equal(null);
  });

  it("does not render reveal toggle when no-reveal-toggle is set", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input
        type="password"
        no-reveal-toggle
        autocomplete="current-password"
      ></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-reveal-btn")).to.equal(null);
  });

  it("auto-hides reveal toggle at size=xs (touch target a11y)", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input
        type="password"
        size="xs"
        autocomplete="current-password"
      ></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-reveal-btn")).to.equal(null);
  });

  it("clicking reveal toggles input type and aria-label", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input type="password" autocomplete="current-password"></tulpar-text-input>`,
    );
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".field-reveal-btn")!;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.type).to.equal("password");
    expect(btn.getAttribute("aria-label")).to.equal("Show password");
    btn.click();
    await el.updateComplete;
    expect(input.type).to.equal("text");
    expect(btn.getAttribute("aria-label")).to.equal("Hide password");
  });
});

describe("<tulpar-text-input> search auto-enrichment", () => {
  it("auto-renders search icon in prefix when type=search and no user prefix slot", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input type="search"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-search-icon")).to.not.equal(null);
  });

  it("user prefix slot wins over auto search icon", async () => {
    const el = await fixture<TulparTextInput>(html`
      <tulpar-text-input type="search"><span slot="prefix">X</span></tulpar-text-input>
    `);
    // Auto icon should NOT render because user slot has content
    expect(el.shadowRoot!.querySelector(".field-search-icon")).to.equal(null);
  });

  it("implicit clearable=true when type=search", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input type="search" value="hi"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.not.equal(null);
  });

  it("explicit clearable=false overrides the implicit", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input type="search" value="hi" .clearable=${false}></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-clear-btn")).to.equal(null);
  });
});

describe("<tulpar-text-input> copyable + pastable", () => {
  // Manual stubbing of navigator.clipboard methods
  let originalWriteText: typeof navigator.clipboard.writeText;
  let originalReadText: typeof navigator.clipboard.readText;
  let writeCalls: string[] = [];
  let readReturn: string | Promise<string> = "";

  beforeEach(() => {
    writeCalls = [];
    originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    originalReadText = navigator.clipboard.readText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async (text: string) => {
      writeCalls.push(text);
    };
    navigator.clipboard.readText = async () => {
      if (readReturn instanceof Promise) return readReturn;
      return readReturn;
    };
  });

  afterEach(() => {
    navigator.clipboard.writeText = originalWriteText;
    navigator.clipboard.readText = originalReadText;
  });

  it("renders copy button when copyable", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input copyable value="hello"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-copy-btn")).to.not.equal(null);
  });

  it("renders paste button when pastable", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input pastable></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-paste-btn")).to.not.equal(null);
  });

  it("paste button is inert when readonly", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input pastable readonly></tulpar-text-input>`,
    );
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>(".field-paste-btn")!;
    expect(btn.hasAttribute("disabled")).to.equal(true);
  });

  it("auto-hides copy + paste at size=xs", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input copyable pastable value="hi" size="xs"></tulpar-text-input>`,
    );
    expect(el.shadowRoot!.querySelector(".field-copy-btn")).to.equal(null);
    expect(el.shadowRoot!.querySelector(".field-paste-btn")).to.equal(null);
  });

  it("clicking copy calls clipboard.writeText with current value", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input copyable value="hello"></tulpar-text-input>`,
    );
    el.shadowRoot!.querySelector<HTMLButtonElement>(".field-copy-btn")!.click();
    await new Promise((r) => setTimeout(r, 10));
    expect(writeCalls).to.deep.equal(["hello"]);
  });

  it("clicking paste sets value from clipboard.readText", async () => {
    readReturn = "pasted";
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input pastable></tulpar-text-input>`,
    );
    el.shadowRoot!.querySelector<HTMLButtonElement>(".field-paste-btn")!.click();
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    expect(el.value).to.equal("pasted");
  });
});

describe("<tulpar-text-input> mask integration", () => {
  it("formats input as masked display when mask is set", async () => {
    const el = await fixture<TulparTextInput>(html`
      <tulpar-text-input mask="999-999"></tulpar-text-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.dispatchEvent(
      new InputEvent("beforeinput", {
        data: "5",
        inputType: "insertText",
        cancelable: true,
        bubbles: true,
      }),
    );
    await el.updateComplete;
    expect(input.value).to.equal("5__-___");
    expect(el.rawValue).to.equal("5");
  });

  it("emits masked value to the form by default", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-text-input name="code" mask="99-99"></tulpar-text-input></form>
    `);
    const el = form.querySelector<TulparTextInput>("tulpar-text-input")!;
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    for (const ch of ["1", "2", "3", "4"]) {
      input.dispatchEvent(
        new InputEvent("beforeinput", {
          data: ch,
          inputType: "insertText",
          cancelable: true,
          bubbles: true,
        }),
      );
    }
    await el.updateComplete;
    expect(el.value).to.equal("12-34");
    expect(new FormData(form).get("code")).to.equal("12-34");
  });

  it("emits raw value when mask-emit=raw", async () => {
    const el = await fixture<TulparTextInput>(html`
      <tulpar-text-input mask="999" mask-emit="raw"></tulpar-text-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.dispatchEvent(
      new InputEvent("beforeinput", {
        data: "1",
        inputType: "insertText",
        cancelable: true,
        bubbles: true,
      }),
    );
    await el.updateComplete;
    expect(el.value).to.equal("1");
    expect(el.rawValue).to.equal("1");
  });

  it("rejects letter at digit slot + sets data-mask-rejected", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input mask="999"></tulpar-text-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.dispatchEvent(
      new InputEvent("beforeinput", {
        data: "a",
        inputType: "insertText",
        cancelable: true,
        bubbles: true,
      }),
    );
    expect(el.hasAttribute("data-mask-rejected")).to.equal(true);
    expect(el.rawValue).to.equal("");
  });

  it("backspace removes the last raw char", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input mask="99-99"></tulpar-text-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    for (const ch of ["1", "2", "3"]) {
      input.dispatchEvent(
        new InputEvent("beforeinput", {
          data: ch,
          inputType: "insertText",
          cancelable: true,
          bubbles: true,
        }),
      );
    }
    await el.updateComplete;
    expect(el.rawValue).to.equal("123");
    input.dispatchEvent(
      new InputEvent("beforeinput", {
        inputType: "deleteContentBackward",
        cancelable: true,
        bubbles: true,
      }),
    );
    await el.updateComplete;
    expect(el.rawValue).to.equal("12");
  });

  it("paste cleanses + fills tokens left-to-right", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input mask="999"></tulpar-text-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    const dt = new DataTransfer();
    dt.setData("text/plain", "abc12d3xyz");
    input.dispatchEvent(
      new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }),
    );
    await el.updateComplete;
    expect(el.rawValue).to.equal("123");
  });

  it("lazy display mode shows literals only when empty", async () => {
    const el = await fixture<TulparTextInput>(html`
      <tulpar-text-input mask="99-99" mask-display="lazy"></tulpar-text-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("  -  ");
  });

  it("custom mask-slot-char renders in the eager template", async () => {
    const el = await fixture<TulparTextInput>(html`
      <tulpar-text-input mask="99" mask-slot-char="·"></tulpar-text-input>
    `);
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    expect(input.value).to.equal("··");
  });

  it("rawValue is available even when mask-emit=masked", async () => {
    const el = await fixture<TulparTextInput>(
      html`<tulpar-text-input mask="99-99"></tulpar-text-input>`,
    );
    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input#control")!;
    input.dispatchEvent(
      new InputEvent("beforeinput", {
        data: "7",
        inputType: "insertText",
        cancelable: true,
        bubbles: true,
      }),
    );
    await el.updateComplete;
    expect(el.value).to.equal("7_-__");
    expect(el.rawValue).to.equal("7");
  });
});
