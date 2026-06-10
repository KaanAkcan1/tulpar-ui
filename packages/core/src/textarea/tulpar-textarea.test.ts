import { expect, fixture, html } from "@open-wc/testing";
import "./tulpar-textarea";
import type { TulparTextarea } from "./tulpar-textarea";

describe("<tulpar-textarea> baseline", () => {
  it("registers the element", () => {
    expect(customElements.get("tulpar-textarea")).to.exist;
  });

  it("renders a <textarea>", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector("textarea#control")).to.exist;
  });

  it("reflects value to the underlying textarea", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea value="hello"></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea#control")!.value).to.equal("hello");
  });

  it("updates value on user input + reports to form", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form><tulpar-textarea name="bio"></tulpar-textarea></form>
    `);
    const el = form.querySelector<TulparTextarea>("tulpar-textarea")!;
    const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea#control")!;
    ta.value = "my story";
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(new FormData(form).get("bio")).to.equal("my story");
  });

  it("does NOT render prefix/suffix slot hosts", async () => {
    const el = await fixture<TulparTextarea>(html`
      <tulpar-textarea><span slot="prefix">$</span></tulpar-textarea>
    `);
    expect(el.shadowRoot!.querySelector(".field-prefix-host")).to.equal(null);
    expect(el.shadowRoot!.querySelector(".field-suffix-host")).to.equal(null);
  });

  it("inherits FormFieldBase anatomy (label + message row)", async () => {
    const el = await fixture<TulparTextarea>(html`
      <tulpar-textarea label="Bio" helper-text="Tell us about yourself"></tulpar-textarea>
    `);
    expect(el.shadowRoot!.querySelector(".field-label")).to.not.equal(null);
    expect(el.shadowRoot!.querySelector(".field-message")?.textContent).to.equal("Tell us about yourself");
  });
});

describe("<tulpar-textarea> autosize", () => {
  it("autosize default on, min-rows=2, max-rows=6", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea></tulpar-textarea>`);
    expect(el.autosize).to.equal(true);
    expect(el.minRows).to.equal(2);
    expect(el.maxRows).to.equal(6);
  });

  it("grows height with content", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea></tulpar-textarea>`);
    const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea#control")!;
    const initialHeight = ta.style.height;
    ta.value = "line 1\nline 2\nline 3\nline 4";
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    expect(ta.style.height).to.not.equal(initialHeight);
  });

  it("caps height at max-rows", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea max-rows="3"></tulpar-textarea>`);
    const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea#control")!;
    ta.value = Array.from({ length: 20 }, (_, i) => `line ${i}`).join("\n");
    ta.dispatchEvent(new Event("input", { bubbles: true }));
    await el.updateComplete;
    const heightPx = parseFloat(ta.style.height);
    const lineHeight = parseFloat(getComputedStyle(ta).lineHeight) || 20;
    expect(heightPx).to.be.at.most(3 * lineHeight + 1); // +1 tolerance
    expect(ta.style.overflowY).to.equal("auto");
  });

  it("setting rows disables autosize", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea rows="5"></tulpar-textarea>`);
    expect(el.autosize).to.equal(false);
  });
});

describe("<tulpar-textarea> resize attribute", () => {
  it("default resize=vertical", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea></tulpar-textarea>`);
    expect(el.resize).to.equal("vertical");
    const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea#control")!;
    expect(getComputedStyle(ta).resize).to.equal("vertical");
  });

  it("setting resize=none applies CSS resize:none", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea resize="none"></tulpar-textarea>`);
    const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea#control")!;
    expect(getComputedStyle(ta).resize).to.equal("none");
  });

  it("setting resize=both applies CSS resize:both", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea resize="both"></tulpar-textarea>`);
    const ta = el.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea#control")!;
    expect(getComputedStyle(ta).resize).to.equal("both");
  });
});

describe("<tulpar-textarea> show-count overlay", () => {
  it("renders counter inside the control row when show-count", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea show-count value="hi"></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector(".field-textarea-counter")).to.not.equal(null);
  });

  it("counter shows X / Y when maxlength set", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea show-count maxlength="100" value="hi"></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector(".field-textarea-counter")?.textContent?.trim()).to.equal("2 / 100");
  });

  it("counter shows bare count without maxlength", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea show-count value="abc"></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector(".field-textarea-counter")?.textContent?.trim()).to.equal("3");
  });

  it("no counter when show-count is false", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea value="hi"></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector(".field-textarea-counter")).to.equal(null);
  });
});

describe("<tulpar-textarea> corner actions (copy/paste)", () => {
  let originalWriteText: typeof navigator.clipboard.writeText;
  let originalReadText: typeof navigator.clipboard.readText;
  let writeCalls: string[] = [];
  let readReturn = "";

  beforeEach(() => {
    writeCalls = [];
    originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    originalReadText = navigator.clipboard.readText.bind(navigator.clipboard);
    navigator.clipboard.writeText = async (text: string) => { writeCalls.push(text); };
    navigator.clipboard.readText = async () => readReturn;
  });

  afterEach(() => {
    navigator.clipboard.writeText = originalWriteText;
    navigator.clipboard.readText = originalReadText;
  });

  it("renders copy button in top-right action cluster when copyable", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea copyable value="hi"></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector(".field-textarea-actions .field-copy-btn")).to.not.equal(null);
  });

  it("renders paste button when pastable", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea pastable></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector(".field-textarea-actions .field-paste-btn")).to.not.equal(null);
  });

  it("auto-hides actions at size=xs", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea copyable pastable value="hi" size="xs"></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector(".field-copy-btn")).to.equal(null);
    expect(el.shadowRoot!.querySelector(".field-paste-btn")).to.equal(null);
  });

  it("copy writes value to clipboard", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea copyable value="hello world"></tulpar-textarea>`);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".field-copy-btn")!.click();
    await new Promise((r) => setTimeout(r, 10));
    expect(writeCalls).to.deep.equal(["hello world"]);
  });

  it("paste sets value from clipboard + resizes", async () => {
    readReturn = "pasted text";
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea pastable></tulpar-textarea>`);
    el.shadowRoot!.querySelector<HTMLButtonElement>(".field-paste-btn")!.click();
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    expect(el.value).to.equal("pasted text");
  });

  it("status icon renders in the action cluster when validating", async () => {
    const el = await fixture<TulparTextarea>(html`<tulpar-textarea validating copyable value="x"></tulpar-textarea>`);
    expect(el.shadowRoot!.querySelector(".field-textarea-actions .field-status-icon")).to.not.equal(null);
  });
});
