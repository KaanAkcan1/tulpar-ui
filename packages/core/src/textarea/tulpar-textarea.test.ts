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
