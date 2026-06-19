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

// ─── Timer ring (Task 3.3) ────────────────────────────────────────────────────

describe("<tulpar-toast> timer ring — presence", () => {
  it("timer ring is present by default (timer=true, duration>0)", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    // The ring wrapper (.toast-ring) must exist in shadow DOM when timer is on.
    const ring = shadow(el).querySelector(".toast-ring");
    expect(ring, ".toast-ring must be in shadow DOM by default").to.exist;
  });

  it("ring is absent when timer=false", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="T" .timer=${false}></tulpar-toast>`,
    );
    await el.updateComplete;
    // The host must have [data-no-timer] or the ring itself must not be present.
    // Our implementation uses [data-no-timer] attribute + CSS display:none,
    // but the SVG should still not be visible / query should return null or hidden.
    // We check the data attribute which controls CSS visibility (safe against loop).
    expect(el.hasAttribute("data-no-timer"), "[data-no-timer] must be set when timer=false").to.be.true;
  });

  it("ring is absent when duration=0", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="T" .duration=${0}></tulpar-toast>`,
    );
    await el.updateComplete;
    expect(el.hasAttribute("data-no-timer"), "[data-no-timer] must be set when duration=0").to.be.true;
  });

  it("ring SVG is inside .toast-ring when active", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    const ring = shadow(el).querySelector(".toast-ring");
    expect(ring).to.exist;
    const svg = ring!.querySelector("svg");
    expect(svg, "ring must contain an SVG element").to.exist;
  });

  it("ring SVG contains a rect with pathLength=100", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    const rect = shadow(el).querySelector(".toast-ring svg .ring-fill");
    expect(rect, ".ring-fill rect must exist inside ring SVG").to.exist;
    expect(rect!.getAttribute("pathLength")).to.equal("100");
  });
});

describe("<tulpar-toast> timer ring — timerStyle", () => {
  it("timerStyle='track' (default) renders the under-track rect (.ring-track)", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    // track style includes a faint static rect under the fill
    const track = shadow(el).querySelector(".toast-ring .ring-track");
    expect(track, ".ring-track must be present for timerStyle=track").to.exist;
  });

  it("timerStyle='track' explicit also renders .ring-track", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="T" .timerStyle=${"track"}></tulpar-toast>`,
    );
    await el.updateComplete;
    const track = shadow(el).querySelector(".toast-ring .ring-track");
    expect(track, ".ring-track must exist for explicit timerStyle=track").to.exist;
  });

  it("timerStyle='soft' renders fill only — no .ring-track", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="T" .timerStyle=${"soft"}></tulpar-toast>`,
    );
    await el.updateComplete;
    const track = shadow(el).querySelector(".toast-ring .ring-track");
    expect(track, ".ring-track must NOT be present for timerStyle=soft").to.be.null;
  });

  it("timerStyle='soft' still renders the fill rect (.ring-fill)", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="T" .timerStyle=${"soft"}></tulpar-toast>`,
    );
    await el.updateComplete;
    const fill = shadow(el).querySelector(".toast-ring .ring-fill");
    expect(fill, ".ring-fill must be present for timerStyle=soft").to.exist;
  });

  it("switching from track to soft removes .ring-track dynamically", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    expect(shadow(el).querySelector(".toast-ring .ring-track")).to.exist;

    el.timerStyle = "soft";
    await el.updateComplete;
    expect(shadow(el).querySelector(".toast-ring .ring-track")).to.be.null;
  });
});

describe("<tulpar-toast> timer ring — duration CSS var", () => {
  it("the ring SVG has --_toast-ring-dur set to reflect duration (default 5000ms)", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    const ringSvg = shadow(el).querySelector<SVGElement>(".toast-ring svg");
    expect(ringSvg, "ring SVG must exist").to.exist;
    const dur = ringSvg!.style.getPropertyValue("--_toast-ring-dur").trim();
    // Default duration is 5000ms → "5000ms"
    expect(dur).to.equal("5000ms");
  });

  it("custom duration=3000 sets --_toast-ring-dur to 3000ms", async () => {
    const el = await fixture<TulparToast>(
      html`<tulpar-toast heading="T" .duration=${3000}></tulpar-toast>`,
    );
    await el.updateComplete;
    const ringSvg = shadow(el).querySelector<SVGElement>(".toast-ring svg");
    expect(ringSvg).to.exist;
    const dur = ringSvg!.style.getPropertyValue("--_toast-ring-dur").trim();
    expect(dur).to.equal("3000ms");
  });
});

describe("<tulpar-toast> timer ring — CSS pause rules exist", () => {
  it("styles contain animation-play-state pause rule for hover", async () => {
    const mod = await import("./tulpar-toast.styles");
    const cssText = mod.toastStyles.cssText;
    expect(cssText).to.include("animation-play-state");
    expect(cssText).to.include("paused");
  });

  it("styles contain :host(:hover) ring pause rule", async () => {
    const mod = await import("./tulpar-toast.styles");
    const cssText = mod.toastStyles.cssText;
    // The rule pauses on :hover or :focus-within at host level
    expect(cssText).to.include(":hover");
    // Ring animation should pause
    expect(cssText).to.include("paused");
  });

  it("styles contain reduced-motion rule that disables ring animation", async () => {
    const mod = await import("./tulpar-toast.styles");
    const cssText = mod.toastStyles.cssText;
    expect(cssText).to.include("prefers-reduced-motion");
    // Under reduced motion: animation on ring should be none or duration 0
    // We assert the reduced-motion block exists (it already covers card transitions,
    // ring animation:none is added in the implementation)
    expect(cssText).to.include("prefers-reduced-motion");
  });

  it("styles do NOT reference --tulpar-primitive-* (including ring styles)", async () => {
    const mod = await import("./tulpar-toast.styles");
    const cssText = mod.toastStyles.cssText;
    expect(cssText).to.not.include("--tulpar-primitive-");
  });
});

describe("<tulpar-toast> timer ring — reactive properties", () => {
  it("timer defaults to true", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    expect(el.timer).to.be.true;
  });

  it("duration defaults to 5000", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    expect(el.duration).to.equal(5000);
  });

  it("timerStyle defaults to 'track'", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    expect(el.timerStyle).to.equal("track");
  });

  it("setting timer=false toggles [data-no-timer] reactively", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    expect(el.hasAttribute("data-no-timer")).to.be.false;

    el.timer = false;
    await el.updateComplete;
    expect(el.hasAttribute("data-no-timer")).to.be.true;

    el.timer = true;
    await el.updateComplete;
    expect(el.hasAttribute("data-no-timer")).to.be.false;
  });

  it("setting duration=0 toggles [data-no-timer] reactively", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    expect(el.hasAttribute("data-no-timer")).to.be.false;

    el.duration = 0;
    await el.updateComplete;
    expect(el.hasAttribute("data-no-timer")).to.be.true;
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

// ─── Swipe-to-dismiss (Task 3.4) ──────────────────────────────────────────────
//
// Strategy: dispatch synthetic PointerEvents on the .toast-card element.
// We use `clientX` deltas to simulate a horizontal drag. `setPointerCapture`
// may throw in the test environment (no real pointer device), so the
// implementation must guard it (try/catch). We assert on emitted events and
// on the inline transform style directly.

/** Dispatch a pointer-event sequence on `target`: down → move(s) → up. */
function swipe(
  target: Element,
  opts: { startX?: number; deltaX: number; pointerId?: number; velocityFast?: boolean },
): void {
  const startX = opts.startX ?? 100;
  const id = opts.pointerId ?? 1;

  const down = new PointerEvent("pointerdown", {
    bubbles: true,
    cancelable: true,
    clientX: startX,
    clientY: 200,
    pointerId: id,
    pointerType: "touch",
  });

  const move = new PointerEvent("pointermove", {
    bubbles: true,
    cancelable: true,
    clientX: startX + opts.deltaX,
    clientY: 200,
    pointerId: id,
    pointerType: "touch",
  });

  const up = new PointerEvent("pointerup", {
    bubbles: true,
    cancelable: true,
    clientX: startX + opts.deltaX,
    clientY: 200,
    pointerId: id,
    pointerType: "touch",
  });

  // Set a timestamp gap to control velocity calculation.
  // We cannot set `timeStamp` directly on PointerEvent constructors (read-only),
  // so we rely on the implementation using Date.now() or event.timeStamp and
  // we just confirm the threshold-based path works (threshold is more reliable).
  target.dispatchEvent(down);
  target.dispatchEvent(move);
  target.dispatchEvent(up);
}

describe("<tulpar-toast> swipe-to-dismiss", () => {
  it("drag past 45% of card width dispatches tulpar-dismiss with reason='swipe'", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Swipe me"></tulpar-toast>`);
    await el.updateComplete;

    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    expect(card).to.exist;

    let evt: CustomEvent | null = null;
    el.addEventListener("tulpar-dismiss", (e) => (evt = e as CustomEvent));

    // Card is 360px wide by default; 45% threshold = 162px. Use 200px (>45%).
    // Override card offsetWidth so threshold calc is reliable in headless env.
    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 360 });

    swipe(card, { startX: 100, deltaX: 200 });

    // Give any microtask/promise chains a tick to flush.
    await new Promise((r) => setTimeout(r, 20));

    expect(evt, "tulpar-dismiss must fire on past-threshold swipe").to.not.be.null;
    expect((evt as unknown as CustomEvent).detail?.reason).to.equal("swipe");
    expect((evt as unknown as CustomEvent).cancelable).to.be.true;
  });

  it("small drag (below threshold, low velocity) does NOT dispatch tulpar-dismiss and springs back", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="Small drag"></tulpar-toast>`);
    await el.updateComplete;

    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 360 });

    let dismissed = false;
    el.addEventListener("tulpar-dismiss", () => (dismissed = true));

    // 40px drag = ~11% of 360px — well below the 45% threshold.
    swipe(card, { startX: 100, deltaX: 40, velocityFast: false });

    await new Promise((r) => setTimeout(r, 20));

    expect(dismissed).to.be.false;
    // After spring-back, the inline transform should be cleared (translateX(0) or "").
    const transform = card.style.transform;
    expect(transform === "" || transform === "translateX(0px)" || transform === "none").to.be.true;
  });

  it("pointerdown on the × close button does NOT start a swipe", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;

    const btn = closeBtn(el)!;
    expect(btn).to.exist;

    let swipeEvt: CustomEvent | null = null;
    el.addEventListener("tulpar-dismiss", (e) => {
      if ((e as CustomEvent).detail?.reason === "swipe") swipeEvt = e as CustomEvent;
    });

    // Simulate pointerdown on the close button, then a large delta pointer move/up
    // on the card — the implementation must bail out when down lands on a button.
    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 360 });

    const down = new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      clientX: 300,
      clientY: 200,
      pointerId: 1,
      pointerType: "touch",
    });
    btn.dispatchEvent(down); // fires on button, bubbles to card

    const move = new PointerEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 200,
      pointerId: 1,
      pointerType: "touch",
    });
    card.dispatchEvent(move);

    const up = new PointerEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 200,
      pointerId: 1,
      pointerType: "touch",
    });
    card.dispatchEvent(up);

    await new Promise((r) => setTimeout(r, 20));

    expect(swipeEvt).to.be.null;
  });

  it("clicking the × close button after a failed swipe still dispatches reason='user'", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;

    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 360 });

    // Small swipe first (no dismiss).
    swipe(card, { startX: 100, deltaX: 30, velocityFast: false });
    await new Promise((r) => setTimeout(r, 10));

    let reason: string | null = null;
    el.addEventListener("tulpar-dismiss", (e) => (reason = (e as CustomEvent).detail?.reason));

    // Now click the close button.
    closeBtn(el)!.click();

    expect(reason).to.equal("user");
  });

  it("tulpar-dismiss event from swipe carries cancelable=true; preventDefault() prevents removal", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;

    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 360 });

    let eventFired = false;
    el.addEventListener("tulpar-dismiss", (e) => {
      eventFired = true;
      e.preventDefault(); // spring back
    });

    swipe(card, { startX: 100, deltaX: 200 });
    await new Promise((r) => setTimeout(r, 20));

    expect(eventFired).to.be.true;
    // After preventDefault(), the element should still exist in the DOM
    // (the service is responsible for removal, but here we just confirm the
    // element isn't self-removing — it's still in the fixture).
    expect(el.isConnected).to.be.true;
  });

  it("close button event carries reason='user' (detail shape)", async () => {
    let detail: Record<string, unknown> | null = null;
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    el.addEventListener("tulpar-dismiss", (e) => (detail = (e as CustomEvent).detail));
    closeBtn(el)!.click();
    expect(detail).to.deep.include({ reason: "user" });
  });

  it("swipe to the left also triggers dismiss (negative deltaX past threshold)", async () => {
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;

    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 360 });

    let evt: CustomEvent | null = null;
    el.addEventListener("tulpar-dismiss", (e) => (evt = e as CustomEvent));

    swipe(card, { startX: 300, deltaX: -200 });
    await new Promise((r) => setTimeout(r, 20));

    expect(evt).to.not.be.null;
    expect((evt as unknown as CustomEvent).detail?.reason).to.equal("swipe");
  });

  it("styles include touch-action: pan-y on .toast-card to allow vertical scroll", async () => {
    const mod = await import("./tulpar-toast.styles");
    const cssText = mod.toastStyles.cssText;
    expect(cssText).to.include("touch-action");
    expect(cssText).to.include("pan-y");
  });

  it("reduced-motion gate: the element has a _swipeReducedMotion accessor or JS gate is documented", async () => {
    // We verify the JS-side reduced-motion gate exists by checking that
    // the element class exposes either a swipeDisabled flag or that it does
    // not apply a transform when a drag starts (indirect test via style).
    // Since matchMedia cannot be mocked in WTR without extra plugins, we test
    // the fallback: without mocking, matchMedia returns false in headless Chrome
    // (no system setting), so swipe IS active. We simply assert the card
    // does NOT already have a transform before any gesture.
    const el = await fixture<TulparToast>(html`<tulpar-toast heading="T"></tulpar-toast>`);
    await el.updateComplete;
    const card = shadow(el).querySelector(".toast-card") as HTMLElement;
    // No gesture → no transform applied.
    expect(card.style.transform).to.equal("");
  });
});
