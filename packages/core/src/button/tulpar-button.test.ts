import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-button";
import type { TulparButton } from "./tulpar-button";

describe("<tulpar-button>", () => {
  it("renders with default variant=primary and size=md", async () => {
    const el = await fixture<TulparButton>(html`<tulpar-button>Click me</tulpar-button>`);
    expect(el.variant).to.equal("primary");
    expect(el.size).to.equal("md");
  });

  it("renders the slotted label", async () => {
    const el = await fixture<TulparButton>(html`<tulpar-button>Save</tulpar-button>`);
    const innerButton = el.shadowRoot!.querySelector("button");
    expect(innerButton).to.exist;
    expect(el.textContent?.trim()).to.equal("Save");
  });

  it("exposes the button tag in shadow DOM", async () => {
    const el = await fixture<TulparButton>(html`<tulpar-button>X</tulpar-button>`);
    const tag = el.shadowRoot!.querySelector("button");
    expect(tag).to.exist;
  });

  describe("disabled state", () => {
    it("reflects the disabled attribute to host", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button disabled>X</tulpar-button>`,
      );
      expect(el.hasAttribute("disabled")).to.be.true;
      expect(el.disabled).to.be.true;
    });

    it("does NOT dispatch click events when disabled", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button disabled>X</tulpar-button>`,
      );
      let clicked = false;
      el.addEventListener("click", () => { clicked = true; });
      el.shadowRoot!.querySelector("button")!.click();
      expect(clicked).to.be.false;
    });
  });
});
