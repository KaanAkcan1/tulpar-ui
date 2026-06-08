import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-button";
import type { TulparButton } from "./tulpar-button";

describe("<tulpar-button>", () => {
  describe("defaults", () => {
    it("renders with default severity=primary, variant=solid, size=md", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button>Click me</tulpar-button>`);
      expect(el.severity).to.equal("primary");
      expect(el.variant).to.equal("solid");
      expect(el.size).to.equal("md");
    });

    it("renders the slotted label", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button>Save</tulpar-button>`);
      expect(el.shadowRoot!.querySelector("button")).to.exist;
      expect(el.textContent?.trim()).to.equal("Save");
    });

    it("exposes the button tag in shadow DOM", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button>X</tulpar-button>`);
      expect(el.shadowRoot!.querySelector("button")).to.exist;
    });
  });

  describe("severity", () => {
    it("reflects severity attribute to host", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button severity="danger">Delete</tulpar-button>`,
      );
      expect(el.getAttribute("severity")).to.equal("danger");
      expect(el.severity).to.equal("danger");
    });

    it("accepts all 8 severities", async () => {
      const severities = [
        "primary",
        "secondary",
        "info",
        "success",
        "warn",
        "help",
        "danger",
        "contrast",
        "premium",
      ] as const;
      for (const s of severities) {
        const el = await fixture<TulparButton>(
          html`<tulpar-button severity=${s}>X</tulpar-button>`,
        );
        expect(el.severity).to.equal(s);
      }
    });
  });

  describe("variant", () => {
    it("reflects variant attribute to host", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button variant="outlined">X</tulpar-button>`,
      );
      expect(el.getAttribute("variant")).to.equal("outlined");
    });

    it("accepts all 5 variants", async () => {
      const variants = ["solid", "outlined", "tonal", "ghost", "link"] as const;
      for (const v of variants) {
        const el = await fixture<TulparButton>(html`<tulpar-button variant=${v}>X</tulpar-button>`);
        expect(el.variant).to.equal(v);
      }
    });
  });

  describe("color override", () => {
    it("sets --_btn-color-default to primitive .700 when color is set", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button color="gold">X</tulpar-button>`);
      await el.updateComplete;
      const inline = el.style.getPropertyValue("--_btn-color-default");
      expect(inline).to.contain("tulpar-primitive-color-gold-700");
    });

    it("uses stone-900 onColor for light-luminance families (yellow, lime)", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button color="yellow">X</tulpar-button>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue("--_btn-color-on")).to.contain(
        "tulpar-primitive-color-stone-900",
      );
    });

    it("uses stone-50 onColor for dark families (purple, navy, red)", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button color="purple">X</tulpar-button>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue("--_btn-color-on")).to.contain(
        "tulpar-primitive-color-stone-50",
      );
    });

    it("removes the color override when color attribute is unset", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button color="purple">X</tulpar-button>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue("--_btn-color-default")).to.not.equal("");
      el.removeAttribute("color");
      await el.updateComplete;
      expect(el.style.getPropertyValue("--_btn-color-default")).to.equal("");
    });
  });

  describe("shape", () => {
    it("reflects shape attribute (default | round | circle)", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button shape="round">X</tulpar-button>`);
      expect(el.shape).to.equal("round");
    });

    it("warns when shape=circle is set without aria-label", async () => {
      const warn = console.warn;
      let warned = false;
      console.warn = () => {
        warned = true;
      };
      try {
        await fixture<TulparButton>(html`<tulpar-button shape="circle"></tulpar-button>`);
        expect(warned).to.be.true;
      } finally {
        console.warn = warn;
      }
    });
  });

  describe("disabled state", () => {
    it("reflects the disabled attribute and suppresses clicks", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button disabled>X</tulpar-button>`);
      expect(el.disabled).to.be.true;
      let clicked = false;
      el.addEventListener("click", () => {
        clicked = true;
      });
      el.shadowRoot!.querySelector("button")!.click();
      expect(clicked).to.be.false;
    });

    it("data-disabled styles WITHOUT suppressing clicks", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button data-disabled>X</tulpar-button>`);
      expect(el.hasAttribute("data-disabled")).to.be.true;
      let clicked = false;
      el.addEventListener("click", () => {
        clicked = true;
      });
      el.shadowRoot!.querySelector("button")!.click();
      expect(clicked).to.be.true; // NOT suppressed
    });
  });

  describe("loading state", () => {
    it("reflects loading + sets aria-busy", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button loading>X</tulpar-button>`);
      expect(el.hasAttribute("loading")).to.be.true;
      expect(el.shadowRoot!.querySelector("button")!.getAttribute("aria-busy")).to.equal("true");
    });

    it("renders the spinner element", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button loading>X</tulpar-button>`);
      expect(el.shadowRoot!.querySelector(".spinner")).to.exist;
    });

    it("suppresses clicks when loading", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button loading>X</tulpar-button>`);
      let clicked = false;
      el.addEventListener("click", () => {
        clicked = true;
      });
      el.shadowRoot!.querySelector("button")!.click();
      expect(clicked).to.be.false;
    });

    it("renders loading-label content", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button loading loading-label="Saving…">Save</tulpar-button>`,
      );
      const loadingLabelText = el.shadowRoot!.querySelector(".loading-label-text");
      expect(loadingLabelText!.textContent?.trim()).to.equal("Saving…");
    });

    it("accepts loading-position attribute", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button loading loading-position="start">X</tulpar-button>`,
      );
      expect(el.loadingPosition).to.equal("start");
    });

    it("renders a custom loading-icon slot when provided", async () => {
      const el = await fixture<TulparButton>(html`
        <tulpar-button loading>
          <svg slot="loading-icon" data-custom-spinner></svg>
          Save
        </tulpar-button>
      `);
      const slot = el.shadowRoot!.querySelector('slot[name="loading-icon"]') as HTMLSlotElement;
      const assigned = slot.assignedElements();
      expect(assigned[0].hasAttribute("data-custom-spinner")).to.be.true;
    });
  });

  describe("icon-only mode", () => {
    it("reflects icon-only attribute", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button icon-only aria-label="Save"></tulpar-button>`,
      );
      expect(el.hasAttribute("icon-only")).to.be.true;
    });

    it("warns when icon-only is used without aria-label", async () => {
      const warn = console.warn;
      let warned = false;
      console.warn = () => {
        warned = true;
      };
      try {
        await fixture<TulparButton>(html`<tulpar-button icon-only></tulpar-button>`);
        expect(warned).to.be.true;
      } finally {
        console.warn = warn;
      }
    });

    it("collapses .btn gap to 0 so a lone icon stays centered", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button icon-only aria-label="Add"><span slot="start">+</span></tulpar-button>`,
      );
      const btn = el.shadowRoot!.querySelector(".btn") as HTMLElement;
      expect(getComputedStyle(btn).gap).to.equal("0px");
    });

    it("collapses .btn gap to 0 for shape=circle as well", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button shape="circle" aria-label="Add"
          ><span slot="start">+</span></tulpar-button
        >`,
      );
      const btn = el.shadowRoot!.querySelector(".btn") as HTMLElement;
      expect(getComputedStyle(btn).gap).to.equal("0px");
    });

    it("hides empty .label and .end wrappers so the lone icon is truly centered", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button icon-only aria-label="Add"
          ><span slot="start">+</span></tulpar-button
        >`,
      );
      const label = el.shadowRoot!.querySelector(".label") as HTMLElement;
      const end = el.shadowRoot!.querySelector(".end") as HTMLElement;
      expect(getComputedStyle(label).display).to.equal("none");
      expect(getComputedStyle(end).display).to.equal("none");
    });
  });

  describe("icon-position layout", () => {
    it("accepts the four icon-position values", async () => {
      const positions = ["start", "end", "top", "bottom"] as const;
      for (const p of positions) {
        const el = await fixture<TulparButton>(
          html`<tulpar-button icon-position=${p}>X</tulpar-button>`,
        );
        expect(el.iconPosition).to.equal(p);
      }
    });
  });

  describe("icon-separator", () => {
    it("reflects icon-separator attribute (default false)", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button>X</tulpar-button>`);
      expect(el.iconSeparator).to.be.false;
      const elOn = await fixture<TulparButton>(
        html`<tulpar-button icon-separator>X</tulpar-button>`,
      );
      expect(elOn.iconSeparator).to.be.true;
    });

    it("renders .separator elements in the shadow DOM", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button icon-separator>X</tulpar-button>`);
      const separators = el.shadowRoot!.querySelectorAll(".separator");
      expect(separators.length).to.equal(2); // start + end
    });

    it("only shows separator on the side with a slotted icon", async () => {
      const startOnly = await fixture<TulparButton>(
        html`<tulpar-button icon-separator
          ><span slot="start">i</span>Label</tulpar-button
        >`,
      );
      const startSep = startOnly.shadowRoot!.querySelector(".separator--start")!;
      const endSep = startOnly.shadowRoot!.querySelector(".separator--end")!;
      expect(getComputedStyle(startSep).display).to.equal("block");
      expect(getComputedStyle(endSep).display).to.equal("none");

      const endOnly = await fixture<TulparButton>(
        html`<tulpar-button icon-separator>Label<span slot="end">i</span></tulpar-button>`,
      );
      expect(getComputedStyle(endOnly.shadowRoot!.querySelector(".separator--start")!).display).to.equal(
        "none",
      );
      expect(getComputedStyle(endOnly.shadowRoot!.querySelector(".separator--end")!).display).to.equal(
        "block",
      );

      const both = await fixture<TulparButton>(
        html`<tulpar-button icon-separator
          ><span slot="start">a</span>Label<span slot="end">b</span></tulpar-button
        >`,
      );
      expect(getComputedStyle(both.shadowRoot!.querySelector(".separator--start")!).display).to.equal(
        "block",
      );
      expect(getComputedStyle(both.shadowRoot!.querySelector(".separator--end")!).display).to.equal(
        "block",
      );

      const none = await fixture<TulparButton>(
        html`<tulpar-button icon-separator>Label</tulpar-button>`,
      );
      expect(getComputedStyle(none.shadowRoot!.querySelector(".separator--start")!).display).to.equal(
        "none",
      );
      expect(getComputedStyle(none.shadowRoot!.querySelector(".separator--end")!).display).to.equal(
        "none",
      );
    });
  });

  describe("modifiers", () => {
    it("reflects raised boolean", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button raised>X</tulpar-button>`);
      expect(el.hasAttribute("raised")).to.be.true;
    });

    it("reflects block boolean", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button block>X</tulpar-button>`);
      expect(el.hasAttribute("block")).to.be.true;
    });

    it("accepts justify enum", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button justify="between">X</tulpar-button>`,
      );
      expect(el.justify).to.equal("between");
    });
  });

  describe("tooltip", () => {
    it("renders a tooltip span when tooltip attribute is set", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Delete item">X</tulpar-button>`,
      );
      const tip = el.shadowRoot!.querySelector(".tooltip");
      expect(tip).to.exist;
      expect(tip!.getAttribute("role")).to.equal("tooltip");
      expect(tip!.textContent?.trim()).to.equal("Delete item");
    });

    it("does NOT render tooltip span when tooltip is unset", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button>X</tulpar-button>`);
      expect(el.shadowRoot!.querySelector(".tooltip")).to.not.exist;
    });

    it("sets aria-describedby on the inner button when tooltip is set", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Save changes">X</tulpar-button>`,
      );
      const btn = el.shadowRoot!.querySelector("button")!;
      expect(btn.getAttribute("aria-describedby")).to.equal("tulpar-btn-tooltip");
    });

    it("sets aria-describedby on the anchor when tooltip + href are both set", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Open" href="/x">X</tulpar-button>`,
      );
      const anchor = el.shadowRoot!.querySelector("a")!;
      expect(anchor.getAttribute("aria-describedby")).to.equal("tulpar-btn-tooltip");
    });
  });

  describe("polymorphism", () => {
    it("renders an <a> when href is set", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button href="/save">Save</tulpar-button>`,
      );
      expect(el.shadowRoot!.querySelector("a")).to.exist;
    });

    it("renders a <button> when href is NOT set", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button>Save</tulpar-button>`);
      expect(el.shadowRoot!.querySelector("button")).to.exist;
      expect(el.shadowRoot!.querySelector("a")).to.not.exist;
    });

    it("applies aria-disabled + tabindex=-1 to <a> when disabled", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button href="/x" disabled>X</tulpar-button>`,
      );
      const link = el.shadowRoot!.querySelector("a");
      expect(link!.getAttribute("aria-disabled")).to.equal("true");
      expect(link!.getAttribute("tabindex")).to.equal("-1");
    });
  });

  describe("form integration", () => {
    it("submits parent form when type=submit is clicked", async () => {
      let submitted = false;
      const form = await fixture<HTMLFormElement>(html`
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            submitted = true;
          }}
        >
          <tulpar-button type="submit">Save</tulpar-button>
        </form>
      `);
      const btn = form.querySelector("tulpar-button") as TulparButton;
      btn.shadowRoot!.querySelector("button")!.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(submitted).to.be.true;
    });

    it("resets parent form when type=reset is clicked", async () => {
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
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            submitted = true;
          }}
        >
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
