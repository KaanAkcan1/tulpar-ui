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

  describe("loading state", () => {
    it("reflects loading attribute and sets aria-busy", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button loading>X</tulpar-button>`,
      );
      expect(el.hasAttribute("loading")).to.be.true;
      expect(el.shadowRoot!.querySelector("button")!.getAttribute("aria-busy")).to.equal("true");
    });

    it("renders a spinner when loading", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button loading>X</tulpar-button>`,
      );
      const spinner = el.shadowRoot!.querySelector(".spinner");
      expect(spinner).to.exist;
    });

    it("suppresses clicks when loading", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button loading>X</tulpar-button>`,
      );
      let clicked = false;
      el.addEventListener("click", () => { clicked = true; });
      el.shadowRoot!.querySelector("button")!.click();
      expect(clicked).to.be.false;
    });
  });

  describe("icon-only mode", () => {
    it("reflects icon-only attribute", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button icon-only aria-label="Save"></tulpar-button>`,
      );
      expect(el.hasAttribute("icon-only")).to.be.true;
    });

    it("warns when icon-only is used without aria-label (in dev)", async () => {
      const warn = console.warn;
      let warned = false;
      console.warn = () => { warned = true; };
      try {
        await fixture<TulparButton>(html`<tulpar-button icon-only></tulpar-button>`);
        expect(warned).to.be.true;
      } finally {
        console.warn = warn;
      }
    });
  });

  describe("polymorphism", () => {
    it("renders an <a> element when href is set", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button href="/save">Save</tulpar-button>`,
      );
      const link = el.shadowRoot!.querySelector("a");
      expect(link).to.exist;
      expect(link!.getAttribute("href")).to.equal("/save");
    });

    it("renders a <button> element when href is NOT set", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button>Save</tulpar-button>`);
      expect(el.shadowRoot!.querySelector("button")).to.exist;
      expect(el.shadowRoot!.querySelector("a")).to.not.exist;
    });

    it("applies aria-disabled to <a> instead of disabled attribute when disabled", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button href="/x" disabled>X</tulpar-button>`,
      );
      const link = el.shadowRoot!.querySelector("a");
      expect(link!.getAttribute("aria-disabled")).to.equal("true");
      expect(link!.getAttribute("tabindex")).to.equal("-1");
    });
  });

  describe("form integration", () => {
    it("submits parent form when type='submit' is clicked", async () => {
      let submitted = false;
      const form = await fixture<HTMLFormElement>(html`
        <form @submit=${(e: Event) => { e.preventDefault(); submitted = true; }}>
          <tulpar-button type="submit">Save</tulpar-button>
        </form>
      `);
      const btn = form.querySelector("tulpar-button") as TulparButton;
      btn.shadowRoot!.querySelector("button")!.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(submitted).to.be.true;
    });

    it("resets parent form when type='reset' is clicked", async () => {
      const form = await fixture<HTMLFormElement>(html`
        <form>
          <input name="x" value="initial" />
          <tulpar-button type="reset">Reset</tulpar-button>
        </form>
      `);
      const input = form.querySelector("input")!;
      input.value = "changed";
      const btn = form.querySelector("tulpar-button") as TulparButton;
      btn.shadowRoot!.querySelector("button")!.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(input.value).to.equal("initial");
    });

    it("does NOT submit when disabled", async () => {
      let submitted = false;
      const form = await fixture<HTMLFormElement>(html`
        <form @submit=${(e: Event) => { e.preventDefault(); submitted = true; }}>
          <tulpar-button type="submit" disabled>Save</tulpar-button>
        </form>
      `);
      const btn = form.querySelector("tulpar-button") as TulparButton;
      btn.shadowRoot!.querySelector("button")!.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(submitted).to.be.false;
    });
  });
});
