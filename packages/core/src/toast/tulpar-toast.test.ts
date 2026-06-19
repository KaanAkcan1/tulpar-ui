import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-toast";
import type { TulparToast, ToastAction } from "./tulpar-toast";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shadow(el: TulparToast): ShadowRoot {
  return el.shadowRoot!;
}

function closeBtn(el: TulparToast): HTMLButtonElement | null {
  return shadow(el).querySelector(".toast-close") as HTMLButtonElement | null;
}

function iconEl(el: TulparToast): Element | null {
  return shadow(el).querySelector(".toast-icon");
}

function titleEl(el: TulparToast): Element | null {
  return shadow(el).querySelector(".toast-title");
}

function descEl(el: TulparToast): Element | null {
  return shadow(el).querySelector(".toast-description");
}

function actionBtns(el: TulparToast): NodeListOf<HTMLButtonElement> {
  return shadow(el).querySelectorAll(".toast-actions button");
}

// ─── Public type exports ──────────────────────────────────────────────────────

describe("public type exports", () => {
  it("re-exports TulparToast from toast index", async () => {
    const mod = await import("./index");
    expect((mod as Record<string, unknown>).TulparToast).to.exist;
  });

  it("re-exports TulparToast from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparToast).to.exist;
  });
});

// ─── Registration ─────────────────────────────────────────────────────────────

describe("<tulpar-toast> registration", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-toast")).to.exist;
  });
});

// ─── Default tone ─────────────────────────────────────────────────────────────

describe("<tulpar-toast> default tone", () => {
  it("defaults to tone='info'", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Hello"></tulpar-toast>`);
    expect(el.tone).to.equal("info");
  });

  it("reflects tone attribute as 'info' by default", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Hello"></tulpar-toast>`);
    expect(el.getAttribute("tone")).to.equal("info");
  });
});

// ─── Built-in tone surface ────────────────────────────────────────────────────

describe("<tulpar-toast> built-in tone", () => {
  for (const tone of ["info", "success", "warning", "danger"] as const) {
    it(`tone='${tone}' sets the tone attribute and uses no inline vars`, async () => {
      const el = await fixture<TulparToast>(
        html`<tulpar-toast tone=${tone} heading="Test"></tulpar-toast>`,
      );
      await el.updateComplete;
      expect(el.getAttribute("tone")).to.equal(tone);
      // No custom-tone inline vars should be set on the host
      expect(el.style.getPropertyValue("--tulpar-toast-surface-l").trim()).to.equal("");
      expect(el.style.getPropertyValue("--tulpar-toast-surface-d").trim()).to.equal("");
    });
  }

  it("tone='info' host does not have inline --tulpar-toast-* vars", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="info" heading="Info"></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(el.style.getPropertyValue("--tulpar-toast-surface-l").trim()).to.equal("");
  });
});

// ─── Custom tone vars ─────────────────────────────────────────────────────────

describe("<tulpar-toast> custom tone inline vars", () => {
  it("tone='custom' with color='ilay' applies -l/-d inline vars on the host", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="custom" color="ilay" heading="Custom"></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(el.style.getPropertyValue("--tulpar-toast-surface-l").trim()).to.include(
      "--tulpar-primitive-color-ilay-50",
    );
    expect(el.style.getPropertyValue("--tulpar-toast-surface-d").trim()).to.include(
      "--tulpar-primitive-color-ilay-900",
    );
    expect(el.style.getPropertyValue("--tulpar-toast-on-surface-l").trim()).to.include(
      "--tulpar-primitive-color-ilay-900",
    );
    expect(el.style.getPropertyValue("--tulpar-toast-accent-l").trim()).to.include(
      "--tulpar-primitive-color-ilay-600",
    );
  });

  it("tone='custom' with raw hex applies color-mix() inline vars", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="custom" color="#0d9488" heading="Custom hex"></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(el.style.getPropertyValue("--tulpar-toast-surface-l").trim()).to.include("color-mix");
    expect(el.style.getPropertyValue("--tulpar-toast-surface-l").trim()).to.include("#0d9488");
  });

  it("bg/accent/text props override custom tone vars", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast
        tone="custom"
        color="ilay"
        bg="#ff0000"
        accent="#00ff00"
        text="#0000ff"
        heading="Overrides"
      ></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(el.style.getPropertyValue("--tulpar-toast-surface-l").trim()).to.equal("#ff0000");
    expect(el.style.getPropertyValue("--tulpar-toast-surface-d").trim()).to.equal("#ff0000");
    expect(el.style.getPropertyValue("--tulpar-toast-accent-l").trim()).to.equal("#00ff00");
    expect(el.style.getPropertyValue("--tulpar-toast-on-surface-l").trim()).to.equal("#0000ff");
  });
});

// ─── high-contrast ────────────────────────────────────────────────────────────

describe("<tulpar-toast> high-contrast", () => {
  it("danger + high-contrast applies [high-contrast] attribute", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="danger" high-contrast heading="Critical"></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(el.hasAttribute("high-contrast")).to.be.true;
    expect(el.highContrast).to.be.true;
  });

  it("info + high-contrast does NOT produce a highContrast result (no-op)", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="info" high-contrast heading="Info HC"></tulpar-toast>`,
    );
    await el.updateComplete;
    // highContrast prop is still true (it's just a passthrough attribute),
    // but the tone resolver returns highContrast:false for non-danger.
    // The [data-hc] styling attr should NOT be set on the host for info.
    expect(el.hasAttribute("data-hc")).to.be.false;
  });

  it("danger high-contrast sets [data-hc] on host", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="danger" high-contrast heading="HC danger"></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(el.hasAttribute("data-hc")).to.be.true;
  });
});

// ─── Icon (default per tone) ──────────────────────────────────────────────────

describe("<tulpar-toast> icon default per tone", () => {
  for (const tone of ["info", "success", "warning", "danger"] as const) {
    it(`tone='${tone}' renders a default SVG icon`, async () => {
      const el = await fixture<TulparToast>(
        html`<tulpar-toast tone=${tone} heading="Test"></tulpar-toast>`,
      );
      const ic = iconEl(el);
      expect(ic).to.exist;
      const svgEl = ic!.querySelector("svg");
      expect(svgEl).to.exist;
    });
  }
});

// ─── Icon prop forms ──────────────────────────────────────────────────────────

describe("<tulpar-toast> icon prop", () => {
  it("icon='' (empty string) removes the icon", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="No icon" icon=""></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(iconEl(el)).to.be.null;
  });

  it("icon=false removes the icon (boolean false via property)", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="No icon"></tulpar-toast>`);
    (el as TulparToast).iconProp = false;
    await el.updateComplete;
    expect(iconEl(el)).to.be.null;
  });

  it("icon='success' renders the success SVG icon (built-in name)", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="info" icon="success" heading="Custom icon name"></tulpar-toast>`,
    );
    await el.updateComplete;
    const ic = iconEl(el);
    expect(ic).to.exist;
    expect(ic!.querySelector("svg")).to.exist;
  });

  it("icon='<svg>...</svg>' renders a raw SVG string", async () => {
    const rawSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>';
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Raw SVG"></tulpar-toast>`);
    el.icon = rawSvg;
    await el.updateComplete;
    const ic = iconEl(el);
    expect(ic).to.exist;
    // The raw SVG string is injected as innerHTML
    expect(ic!.innerHTML).to.include("<svg");
  });

  it("icon='🎉' renders an emoji icon", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Emoji" icon="🎉"></tulpar-toast>`);
    await el.updateComplete;
    const ic = iconEl(el);
    expect(ic).to.exist;
    expect(ic!.textContent).to.include("🎉");
  });
});

// ─── Icon slot wins ───────────────────────────────────────────────────────────

describe("<tulpar-toast> slot='icon' wins over prop", () => {
  it("slot='icon' is rendered (the slot element exists in shadow DOM)", async () => {
    const el = await fixture<TulparToast>(html`
      <tulpar-toast heading="Slotted icon">
        <span slot="icon" data-test-icon>★</span>
      </tulpar-toast>
    `);
    const iconSlot = shadow(el).querySelector('slot[name="icon"]') as HTMLSlotElement;
    expect(iconSlot).to.exist;
    expect(iconSlot.assignedElements()[0]).to.have.attribute("data-test-icon");
  });
});

// ─── Title / description via props ───────────────────────────────────────────

describe("<tulpar-toast> title/description props", () => {
  it("heading prop renders the title text", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="Hello World"></tulpar-toast>`,
    );
    const t = titleEl(el);
    expect(t).to.exist;
    expect(t!.textContent?.trim()).to.include("Hello World");
  });

  it("description prop renders description text", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="T" description="More info"></tulpar-toast>`,
    );
    const d = descEl(el);
    expect(d).to.exist;
    expect(d!.textContent?.trim()).to.include("More info");
  });

  it("no description prop → description wrapper is hidden (no [data-has-description])", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    // The .toast-description wrapper is always in the DOM; its visibility is
    // controlled by [data-has-description] on the host (absent = hidden via CSS).
    expect(el.hasAttribute("data-has-description")).to.be.false;
  });
});

// ─── Title / description via slots ───────────────────────────────────────────

describe("<tulpar-toast> title/description slots", () => {
  it("slot='title' is present in shadow DOM and receives slotted content", async () => {
    const el = await fixture<TulparToast>(html`
      <tulpar-toast>
        <span slot="title" data-t>My Title</span>
      </tulpar-toast>
    `);
    const titleSlot = shadow(el).querySelector('slot[name="title"]') as HTMLSlotElement;
    expect(titleSlot).to.exist;
    expect(titleSlot.assignedElements()[0]).to.have.attribute("data-t");
  });

  it("slot='description' is present in shadow DOM and receives slotted content", async () => {
    const el = await fixture<TulparToast>(html`
      <tulpar-toast heading="T">
        <span slot="description" data-d>My Description</span>
      </tulpar-toast>
    `);
    const descSlot = shadow(el).querySelector('slot[name="description"]') as HTMLSlotElement;
    expect(descSlot).to.exist;
    expect(descSlot.assignedElements()[0]).to.have.attribute("data-d");
  });
});

// ─── Actions ─────────────────────────────────────────────────────────────────

describe("<tulpar-toast> actions", () => {
  it("renders action buttons from actions property", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Saved"></tulpar-toast>`);
    el.actions = [
      { label: "Undo", onClick: () => {} },
      { label: "View", onClick: () => {} },
    ];
    await el.updateComplete;
    const btns = actionBtns(el);
    expect(btns.length).to.equal(2);
    expect(btns[0].textContent?.trim()).to.equal("Undo");
    expect(btns[1].textContent?.trim()).to.equal("View");
  });

  it("clicking an action button calls onClick", async () => {
    let called = false;
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    const actions: ToastAction[] = [{ label: "Undo", onClick: () => { called = true; } }];
    el.actions = actions;
    await el.updateComplete;
    const btn = actionBtns(el)[0];
    btn.click();
    expect(called).to.be.true;
  });

  it("clicking an action fires a tulpar-action CustomEvent", async () => {
    let evt: CustomEvent | null = null;
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    el.actions = [{ label: "Undo", onClick: () => {} }];
    await el.updateComplete;
    el.addEventListener("tulpar-action", (e) => (evt = e as CustomEvent));
    actionBtns(el)[0].click();
    expect(evt).to.not.be.null;
    expect((evt as unknown as CustomEvent).detail).to.deep.include({ label: "Undo" });
  });

  it("no actions → no action container rendered", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    expect(shadow(el).querySelector(".toast-actions")).to.be.null;
  });

  it("first action button has .primary class", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    el.actions = [
      { label: "A", onClick: () => {} },
      { label: "B", onClick: () => {} },
    ];
    await el.updateComplete;
    const btns = actionBtns(el);
    expect(btns[0].classList.contains("action-primary")).to.be.true;
    expect(btns[1].classList.contains("action-primary")).to.be.false;
  });
});

// ─── Closable ─────────────────────────────────────────────────────────────────

describe("<tulpar-toast> closable", () => {
  it("closable defaults to true → close button present", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    expect(el.closable).to.be.true;
    expect(closeBtn(el)).to.exist;
  });

  it("close button has aria-label", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    const btn = closeBtn(el);
    expect(btn!.getAttribute("aria-label")).to.be.a("string").and.not.empty;
  });

  it("clicking the close button dispatches a cancelable tulpar-dismiss event", async () => {
    let evt: CustomEvent | null = null;
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    el.addEventListener("tulpar-dismiss", (e) => (evt = e as CustomEvent));
    closeBtn(el)!.click();
    expect(evt).to.not.be.null;
    expect((evt as unknown as CustomEvent).cancelable).to.be.true;
  });

  it("closable=false → no close button", async () => {
    // Use .closable=${false} (property binding) not ?closable=${false}
    // (boolean attr binding), because the boolean attr absent still lets the
    // class default of true take effect in Lit with reflect:true.
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="T" .closable=${false}></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(closeBtn(el)).to.be.null;
  });

  it("closable=false via property", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    el.closable = false;
    await el.updateComplete;
    expect(closeBtn(el)).to.be.null;
  });
});

// ─── Host focusability ────────────────────────────────────────────────────────

describe("<tulpar-toast> host focusability", () => {
  it("host has tabindex='-1' (at minimum reachable programmatically)", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    const ti = el.getAttribute("tabindex");
    // Accept -1 or 0; both make the host focusable via F6-style region jump.
    expect(ti).to.be.oneOf(["-1", "0"]);
  });
});

// ─── ARIA / role ──────────────────────────────────────────────────────────────

describe("<tulpar-toast> ARIA", () => {
  it("default (info, no actions) → role=status, aria-live=polite", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Saved"></tulpar-toast>`);
    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    expect(card).to.exist;
    expect(card.getAttribute("role")).to.equal("status");
    expect(card.getAttribute("aria-live")).to.equal("polite");
  });

  it("danger tone → role=alert, aria-live=assertive", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="danger" heading="Error"></tulpar-toast>`,
    );
    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    expect(card.getAttribute("role")).to.equal("alert");
    expect(card.getAttribute("aria-live")).to.equal("assertive");
  });
});

// ─── Slotted description wrapper (fix #1) ────────────────────────────────────

describe("<tulpar-toast> slotted description wrapper", () => {
  it("slotted description with no prop still gets .toast-description wrapper (visible)", async () => {
    const el = await fixture<TulparToast>(html`
      <tulpar-toast heading="T">
        <span slot="description" data-desc>Slotted body</span>
      </tulpar-toast>
    `);
    // The .toast-description wrapper is always in the DOM.
    // Verify it is VISIBLE: [data-has-description] must be on the host.
    const wrapper = descEl(el);
    expect(wrapper, ".toast-description wrapper must be present in shadow DOM").to.exist;
    expect(
      el.hasAttribute("data-has-description"),
      "[data-has-description] must be set so CSS shows the wrapper",
    ).to.be.true;
  });
});

// ─── Reactive icon (fix #2) ──────────────────────────────────────────────────

describe("<tulpar-toast> reactive iconProp", () => {
  it("setting iconProp=false then back to undefined re-shows the icon", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    // Icon is visible initially.
    expect(iconEl(el)).to.exist;

    // Suppress the icon.
    (el as TulparToast).iconProp = false;
    await el.updateComplete;
    expect(iconEl(el)).to.be.null;

    // Re-enable by clearing iconProp.
    (el as TulparToast).iconProp = undefined;
    await el.updateComplete;
    // The icon container should be back and its target should have SVG content.
    const ic = iconEl(el);
    expect(ic, "icon container must reappear after iconProp reset to undefined").to.exist;
    const target = ic!.querySelector(".icon-prop-target");
    expect(target, "icon-prop-target must exist").to.exist;
    expect(target!.querySelector("svg"), "default SVG must be re-injected").to.exist;
  });
});

// ─── alertdialog role (fix #3) ───────────────────────────────────────────────

describe("<tulpar-toast> alertdialog role", () => {
  it("toast with actions uses role=alertdialog (spec §5.3)", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Confirm"></tulpar-toast>`);
    el.actions = [{ label: "Undo", onClick: () => {} }];
    await el.updateComplete;
    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    expect(card.getAttribute("role")).to.equal("alertdialog");
  });

  it("toast with actions + danger tone still uses role=alertdialog (actions win)", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="danger" heading="Danger"></tulpar-toast>`,
    );
    el.actions = [{ label: "Dismiss", onClick: () => {} }];
    await el.updateComplete;
    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    expect(card.getAttribute("role")).to.equal("alertdialog");
  });

  it("danger tone without actions retains role=alert", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast tone="danger" heading="Error"></tulpar-toast>`,
    );
    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    expect(card.getAttribute("role")).to.equal("alert");
  });

  it("non-danger tone without actions retains role=status", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Info"></tulpar-toast>`);
    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    expect(card.getAttribute("role")).to.equal("status");
  });
});

// ─── Styles ──────────────────────────────────────────────────────────────────

describe("<tulpar-toast> styles", () => {
  it("styles contain forced-colors CanvasText border rule", async () => {
    const mod = await import("./tulpar-toast.styles");
    const css = mod.toastStyles.cssText;
    expect(css).to.include("forced-colors");
    expect(css).to.include("CanvasText");
  });

  it("styles contain focus-visible rule", async () => {
    const mod = await import("./tulpar-toast.styles");
    const css = mod.toastStyles.cssText;
    expect(css).to.include(":focus-visible");
  });

  it("styles contain reduced-motion rule", async () => {
    const mod = await import("./tulpar-toast.styles");
    const css = mod.toastStyles.cssText;
    expect(css).to.include("prefers-reduced-motion");
  });

  it("styles do NOT reference --tulpar-primitive-* (enforced by ESLint, guarded here)", async () => {
    const mod = await import("./tulpar-toast.styles");
    const css = mod.toastStyles.cssText;
    expect(css).to.not.include("--tulpar-primitive-");
  });
});
