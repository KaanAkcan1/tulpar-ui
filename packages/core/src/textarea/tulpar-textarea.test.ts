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
