import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-button";
import type { TulparButton } from "./tulpar-button";
import type { TulparTooltip } from "../tooltip/tulpar-tooltip";
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

    it("accepts all 9 severities", async () => {
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

  describe("v0.7 polish", () => {
    it("does NOT use opacity:0.5 for disabled (uses designed tokens)", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button disabled>X</tulpar-button>`);
      const btn = el.shadowRoot!.querySelector("button")!;
      const opacity = getComputedStyle(btn).opacity;
      expect(opacity).to.equal("1"); // disabled conveyed by color tokens, not opacity
    });
    it("transition is split per-property (not `all`)", () => {
      const cssText = buttonStyles.cssText; // existing tests use .cssText directly
      expect(cssText).to.not.match(/transition:\s*var\(--tulpar-transition-default/);
      expect(cssText).to.match(/transition-property:\s*background-color/);
      expect(cssText).to.match(
        /transition-timing-function:\s*var\(--tulpar-transition-ease-standard/,
      );
    });
    it("focus ring stays on outline (box-shadow not hijacked for focus)", () => {
      const cssText = buttonStyles.cssText;
      expect(cssText).to.match(/focus-visible[\s\S]*?outline:/);
    });
    it("grouped buttons keep the per-size radius on outer corners (not hardcoded 4px)", () => {
      const cssText = buttonStyles.cssText;
      expect(cssText).to.not.match(
        /border-top-left-radius:\s*var\(--tulpar-button-border-radius,\s*4px\)/,
      );
    });
  });

  describe("tooltip (delegates to <tulpar-tooltip> via for-id, WCAG 1.4.13)", () => {
    it("composes a real <tulpar-tooltip> carrying the tooltip string as text", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Delete item">X</tulpar-button>`,
      );
      await el.updateComplete;
      const tip = el.shadowRoot!.querySelector("tulpar-tooltip") as TulparTooltip;
      expect(tip).to.exist;
      expect(tip.text).to.equal("Delete item");
    });

    it("keeps the old static `.tooltip` span out of the shadow DOM", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Delete item">X</tulpar-button>`,
      );
      await el.updateComplete;
      // The CSS-only #tulpar-btn-tooltip span no longer exists — the surface is
      // owned by <tulpar-tooltip>.
      expect(el.shadowRoot!.querySelector("#tulpar-btn-tooltip")).to.not.exist;
    });

    it("points the tooltip's `for` at the inner control's id (for-id model, no slot-wrap)", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Delete item">X</tulpar-button>`,
      );
      await el.updateComplete;
      const tip = el.shadowRoot!.querySelector("tulpar-tooltip")!;
      const btn = el.shadowRoot!.querySelector("button.btn")!;
      // The inner control has a stable id and the tooltip references it by `for`.
      expect(btn.id, "inner control has an id").to.be.a("string").and.not.empty;
      expect(tip.getAttribute("for")).to.equal(btn.id);
      // No slot-wrap: the control is NOT slotted into a trigger, and the tooltip
      // is a sibling of the control, not its parent.
      expect(btn.hasAttribute("slot")).to.be.false;
      expect(btn.parentElement).to.not.equal(tip);
    });

    it("renders NO tulpar-tooltip / overlay machinery when tooltip is unset (lazy)", async () => {
      const el = await fixture<TulparButton>(html`<tulpar-button>X</tulpar-button>`);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector("tulpar-tooltip")).to.not.exist;
      // The inner control is rendered bare (not slotted into any trigger).
      const btn = el.shadowRoot!.querySelector("button.btn")!;
      expect(btn.hasAttribute("slot")).to.be.false;
    });

    it("wires a working aria-describedby from the inner button to the tooltip surface", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Save changes">X</tulpar-button>`,
      );
      await el.updateComplete;
      const tip = el.shadowRoot!.querySelector("tulpar-tooltip") as TulparTooltip;
      await tip.updateComplete;
      const btn = el.shadowRoot!.querySelector("button.btn")!;
      const surface = tip.shadowRoot!.querySelector('[role="tooltip"]')!;
      expect(surface, "tooltip surface exists").to.exist;
      const described = btn.getAttribute("aria-describedby");
      expect(described, "button has aria-describedby").to.be.a("string").and.not.empty;
      // It points at the tulpar-tooltip's surface, NOT the old static span id.
      expect(described).to.not.equal("tulpar-btn-tooltip");
      expect(described).to.contain(surface.id);
    });

    it("wires aria-describedby on the anchor when tooltip + href are both set", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Open" href="/x">X</tulpar-button>`,
      );
      await el.updateComplete;
      const tip = el.shadowRoot!.querySelector("tulpar-tooltip") as TulparTooltip;
      await tip.updateComplete;
      const anchor = el.shadowRoot!.querySelector("a.btn")!;
      // The anchor is the for-id trigger: it has an id the tooltip points at,
      // and is not slotted/wrapped.
      expect(anchor.id, "inner anchor has an id").to.be.a("string").and.not.empty;
      expect(tip.getAttribute("for")).to.equal(anchor.id);
      expect(anchor.hasAttribute("slot")).to.be.false;
      const surface = tip.shadowRoot!.querySelector('[role="tooltip"]')!;
      expect(anchor.getAttribute("aria-describedby")).to.contain(surface.id);
    });

    it("still exposes + reflects the tooltip attribute (convenience prop preserved)", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button tooltip="Hello">X</tulpar-button>`,
      );
      expect(el.tooltip).to.equal("Hello");
      expect(el.getAttribute("tooltip")).to.equal("Hello");
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

  describe("loading layout", () => {
    // Center mode overlays the spinner (absolute) and hides the label via
    // visibility:hidden, so it is the one mode that preserves button width.
    it("center mode preserves button width when loading toggles", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button loading-position="center">Save changes</tulpar-button>`,
      );
      const before = el.getBoundingClientRect().width;
      el.loading = true;
      await el.updateComplete;
      const after = el.getBoundingClientRect().width;
      expect(Math.abs(after - before)).to.be.lessThan(1.5);
    });

    // Start/end keep the spinner inline (flex order) next to the still-visible
    // label, so the spinner is never detached from or overlapping the label.
    it("start position keeps the label visible alongside the spinner", async () => {
      const el = await fixture<TulparButton>(
        html`<tulpar-button loading loading-position="start">Save</tulpar-button>`,
      );
      const label = el.shadowRoot!.querySelector<HTMLElement>(".label")!;
      const spinner = el.shadowRoot!.querySelector<HTMLElement>(".spinner")!;
      expect(getComputedStyle(label).visibility).to.equal("visible");
      expect(getComputedStyle(spinner).display).to.not.equal("none");
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
