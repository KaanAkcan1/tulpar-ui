import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-button";
import type { TulparButton } from "./tulpar-button";
import { buttonStyles } from "./tulpar-button.styles";

describe("public type exports", () => {
  it("re-exports all button type unions from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparButton).to.exist;
  });
});

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

    it("secondary severity is wired to the dedicated secondary token (kam, not neutral)", () => {
      // v0.7: secondary severity points at --tulpar-color-secondary-*, no longer
      // the neutral (kara) role — so the two are now distinct. Token CSS isn't
      // loaded in the test document, so inspect the stylesheet text directly
      // (same approach as the variant hover/active scoping tests above).
      const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "");
      const css = stripComments(buttonStyles.cssText);
      const secondaryRule = css.match(/:host\(\[severity="secondary"\]\)\s*\{([^}]*)\}/);
      expect(secondaryRule, "secondary severity rule should exist").to.not.be.null;
      const body = secondaryRule![1];
      expect(body).to.contain("--tulpar-color-secondary-default");
      expect(body).to.contain("--tulpar-color-secondary-on-color");
      expect(body).to.not.contain("--tulpar-color-neutral-");
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

    describe("hover/active scoping (regression: link variant bg leak)", () => {
      // The default-solid hover/active --_btn-bg rule must NOT be unscoped —
      // a descendant selector that matches every host leaks the brand hover
      // color into other variants. For outlined/tonal/ghost it's masked by
      // their own bg overrides, but link only sets --_btn-fg on hover, so
      // the leak makes bg AND text resolve to the same color → invisible
      // text against a brand-colored pill.
      const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "");
      const css = stripComments(buttonStyles.cssText);

      it("scopes default hover bg rule via :host(:not([variant])) + solid", () => {
        expect(css).to.match(/:host\(:not\(\[variant\]\)\)\s+\.btn:hover/);
        expect(css).to.match(/:host\(\[variant="solid"\]\)\s+\.btn:hover/);
      });

      it("scopes default active bg rule via :host(:not([variant])) + solid", () => {
        expect(css).to.match(/:host\(:not\(\[variant\]\)\)\s+\.btn:active/);
        expect(css).to.match(/:host\(\[variant="solid"\]\)\s+\.btn:active/);
      });

      it("never uses unscoped `:host .btn:hover` / `:host .btn:active`", () => {
        // Anchored: forbid the bare `:host ` (space + .btn) form; the scoped
        // `:host(...)` forms remain allowed because they're followed by `(`.
        expect(css).to.not.match(/:host\s+\.btn:hover/);
        expect(css).to.not.match(/:host\s+\.btn:active/);
      });
    });
  });

  describe("color override", () => {
    it("sets --_btn-color-default to primitive .700 when color is set", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button color="kam">X</tulpar-button>`);
      await el.updateComplete;
      const inline = el.style.getPropertyValue("--_btn-color-default");
      expect(inline).to.contain("tulpar-primitive-color-kam-700");
    });

    it("uses yagiz-900 onColor for light/mid-luminance families (ulgen)", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button color="ulgen">X</tulpar-button>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue("--_btn-color-on")).to.contain(
        "tulpar-primitive-color-yagiz-900",
      );
    });

    it("uses colpan-50 onColor for dark families (kam)", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button color="kam">X</tulpar-button>`);
      await el.updateComplete;
      expect(el.style.getPropertyValue("--_btn-color-on")).to.contain(
        "tulpar-primitive-color-colpan-50",
      );
    });

    it("removes the color override when color attribute is unset", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button color="kam">X</tulpar-button>`);
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
    it("loading-label-text has aria-live=polite for SR announcement", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button loading loading-label="Saving">X</tulpar-button>`,
      );
      const live = el.shadowRoot!.querySelector(".loading-label-text") as HTMLElement;
      expect(live.getAttribute("aria-live")).to.equal("polite");
    });

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
        html`<tulpar-button icon-only aria-label="Add"><span slot="start">+</span></tulpar-button>`,
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
        html`<tulpar-button icon-separator><span slot="start">i</span>Label</tulpar-button>`,
      );
      const startSep = startOnly.shadowRoot!.querySelector(".separator--start")!;
      const endSep = startOnly.shadowRoot!.querySelector(".separator--end")!;
      expect(getComputedStyle(startSep).display).to.equal("block");
      expect(getComputedStyle(endSep).display).to.equal("none");

      const endOnly = await fixture<TulparButton>(
        html`<tulpar-button icon-separator>Label<span slot="end">i</span></tulpar-button>`,
      );
      expect(
        getComputedStyle(endOnly.shadowRoot!.querySelector(".separator--start")!).display,
      ).to.equal("none");
      expect(
        getComputedStyle(endOnly.shadowRoot!.querySelector(".separator--end")!).display,
      ).to.equal("block");

      const both = await fixture<TulparButton>(
        html`<tulpar-button icon-separator
          ><span slot="start">a</span>Label<span slot="end">b</span></tulpar-button
        >`,
      );
      expect(
        getComputedStyle(both.shadowRoot!.querySelector(".separator--start")!).display,
      ).to.equal("block");
      expect(getComputedStyle(both.shadowRoot!.querySelector(".separator--end")!).display).to.equal(
        "block",
      );

      const none = await fixture<TulparButton>(
        html`<tulpar-button icon-separator>Label</tulpar-button>`,
      );
      expect(
        getComputedStyle(none.shadowRoot!.querySelector(".separator--start")!).display,
      ).to.equal("none");
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

  describe("focus ring", () => {
    it("uses outline + outline-offset (not box-shadow) for focus-visible", async () => {
      const { buttonStyles } = await import("./tulpar-button.styles");
      const cssText = (buttonStyles as { cssText: string }).cssText;
      expect(cssText).to.include("outline-offset");
      expect(cssText).to.include("forced-colors");
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

    it("disabled anchor has no href attribute (CSP-safe)", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button href="/x" disabled>X</tulpar-button>`,
      );
      const a = el.shadowRoot!.querySelector("a")!;
      expect(a.hasAttribute("href")).to.be.false;
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

    it("dispatches exactly one submit event per click", async () => {
      let count = 0;
      const form = await fixture<HTMLFormElement>(html`
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            count++;
          }}
        >
          <tulpar-button type="submit">Save</tulpar-button>
        </form>
      `);
      const btn = form.querySelector("tulpar-button") as TulparButton;
      btn.shadowRoot!.querySelector("button")!.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(count).to.equal(1);
    });
  });

  describe("form value parity", () => {
    it("carries name/value into FormData on submit", async () => {
      let captured: FormData | null = null;
      const form = await fixture<HTMLFormElement>(html`
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            captured = new FormData(e.target as HTMLFormElement);
          }}
        >
          <tulpar-button type="submit" name="action" value="save">Save</tulpar-button>
        </form>
      `);
      const btn = form.querySelector("tulpar-button") as TulparButton;
      btn.shadowRoot!.querySelector("button")!.click();
      await new Promise((r) => setTimeout(r, 0));
      expect(captured).to.not.be.null;
      expect(captured!.get("action")).to.equal("save");
    });

    it("reflects value attribute changes back to the property", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button name="x" value="initial">A</tulpar-button>`,
      );
      el.value = "updated";
      await el.updateComplete;
      expect(el.value).to.equal("updated");
    });
  });
});
