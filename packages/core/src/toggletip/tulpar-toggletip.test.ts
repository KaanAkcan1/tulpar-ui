import { fixture, html, expect, aTimeout, oneEvent } from "@open-wc/testing";
import "./tulpar-toggletip";
import type { TulparToggletip } from "./tulpar-toggletip";
import { __resetOverlayRootForTest } from "../_internal/overlay/overlay-root";

function surface(el: TulparToggletip): HTMLElement {
  return el.shadowRoot!.querySelector(".surface") as HTMLElement;
}

function live(el: TulparToggletip): HTMLElement {
  return el.shadowRoot!.querySelector('[aria-live]') as HTMLElement;
}

function isOpen(el: TulparToggletip): boolean {
  return surface(el).hasAttribute("data-open");
}

function key(target: EventTarget, k: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
}

afterEach(() => {
  __resetOverlayRootForTest();
});

describe("public type exports", () => {
  it("re-exports TulparToggletip from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparToggletip).to.exist;
  });
  it("re-exports TulparToggletip from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparToggletip).to.exist;
  });
});

describe("<tulpar-toggletip> skeleton + disclosure + live region", () => {
  async function mk(): Promise<{ el: TulparToggletip; trigger: HTMLButtonElement }> {
    const el = await fixture<TulparToggletip>(
      html`<tulpar-toggletip text="More info"
        ><button slot="trigger">?</button></tulpar-toggletip
      >`,
    );
    await el.updateComplete;
    return { el, trigger: el.querySelector("button")! };
  }

  it("registers the custom element", () => {
    expect(customElements.get("tulpar-toggletip")).to.exist;
  });

  it("host is display:contents", async () => {
    const { el } = await mk();
    expect(getComputedStyle(el).display).to.equal("contents");
  });

  it("renders a surface", async () => {
    const { el } = await mk();
    expect(surface(el)).to.exist;
  });

  it("pre-inserts an aria-live=polite region in the DOM before injection", async () => {
    const { el } = await mk();
    const region = live(el);
    expect(region).to.exist;
    expect(region.getAttribute("aria-live")).to.equal("polite");
    // Empty before open.
    expect(region.textContent).to.equal("");
  });

  it("defaults placement=top and reflects data-placement on the surface", async () => {
    const { el } = await mk();
    expect(el.placement).to.equal("top");
    expect(surface(el).hasAttribute("data-placement")).to.be.true;
  });

  it("has sensible numeric/boolean defaults", async () => {
    const { el } = await mk();
    expect(el.offset).to.equal(8);
    expect(el.crossOffset).to.equal(0);
    expect(el.containerPadding).to.equal(12);
    expect(el.boundary).to.equal("viewport");
    expect(el.flip).to.be.true;
    expect(el.arrow).to.be.true;
    expect(el.tone).to.equal("neutral");
  });

  it("trigger gets aria-expanded=false initially (disclosure)", async () => {
    const { trigger } = await mk();
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
  });

  it("clicking the trigger toggles open/closed", async () => {
    const { el, trigger } = await mk();
    expect(isOpen(el)).to.be.false;
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
  });

  it("activating the trigger toggles open/closed (native click path)", async () => {
    // A native <button> synthesizes a `click` for mouse AND Enter/Space, so the
    // real activation path is a `click` — exercise that, not a synthetic keydown
    // (which does not synthesize a click in the browser and masked the wedge bug).
    const { el, trigger } = await mk();
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
  });

  it("regression: a keyboard activation does not strand a swallowed click", async () => {
    // In a real browser, a native <button>'s Enter/Space activation fires a
    // keydown and THEN synthesizes a `click`. The old code toggled on keydown and
    // set an unbounded `_swallowNextClick=true`; but its `preventDefault()` on the
    // activation keydown CANCELS the synthesized click in Chromium, so the flag was
    // never consumed and stranded at `true` — then wrongly swallowed the next
    // GENUINE mouse click, wedging the toggle.
    //
    // We model the real cancelled-click activation faithfully: a keydown WITHOUT a
    // paired synthesized click (it's cancelled), then later genuine clicks. With
    // the fix, keydown never toggles and never sets a flag, so the keyboard
    // activation has no effect here and each subsequent click toggles cleanly.
    // Against the OLD logic, the keydown would open AND strand the swallow flag,
    // so the first genuine click below would be eaten and the assertion fails.
    const { el, trigger } = await mk();

    // A keyboard activation. With the fix this is a no-op (the native click does
    // the toggling); against old logic it toggles AND sets the unbounded swallow
    // flag — which then eats the FIRST genuine click below.
    key(trigger, "Enter");
    await el.updateComplete;

    // Count toggles caused strictly by the genuine clicks that follow.
    const clickToggles: boolean[] = [];
    el.addEventListener("tulpar-toggle", (e) => {
      clickToggles.push((e as CustomEvent<{ open: boolean }>).detail.open);
    });

    // Three genuine mouse clicks. Each one MUST toggle exactly once — no click may
    // be silently swallowed by a stranded flag. Against the old logic the first
    // click is swallowed, so only two toggle events fire (and the parity inverts).
    trigger.click();
    await el.updateComplete;
    trigger.click();
    await el.updateComplete;
    trigger.click();
    await el.updateComplete;

    // Every genuine click toggled: exactly three events, alternating from a clean
    // closed start. (Old logic: keydown left it open + swallowed click #1, so this
    // would be [false, true] — length 2 — and the assertion fails.)
    expect(clickToggles, "each genuine click toggles exactly once").to.deep.equal([
      true,
      false,
      true,
    ]);
    expect(isOpen(el), "ends open after three clean toggles").to.be.true;
  });

  it("prevents default on Space keydown (no page scroll while focused)", async () => {
    const { trigger } = await mk();
    const ev = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    trigger.dispatchEvent(ev);
    expect(ev.defaultPrevented).to.be.true;
  });

  it("injects the content text into the live region on open", async () => {
    const { el, trigger } = await mk();
    expect(live(el).textContent).to.equal("");
    trigger.click();
    await el.updateComplete;
    expect(live(el).textContent).to.contain("More info");
  });

  it("does not move focus into the bubble on open", async () => {
    const { el, trigger } = await mk();
    trigger.focus();
    trigger.click();
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).to.be.null;
  });

  it("surface is not focusable", async () => {
    const { el, trigger } = await mk();
    trigger.click();
    await el.updateComplete;
    expect(surface(el).hasAttribute("tabindex")).to.be.false;
  });

  it("Escape closes AND returns focus to the trigger", async () => {
    const { el, trigger } = await mk();
    trigger.focus();
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
    expect(document.activeElement).to.equal(trigger);
  });

  it("outside click (light-dismiss) closes", async () => {
    const { el, trigger } = await mk();
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
  });

  it("clicking inside the surface does not close", async () => {
    const { el, trigger } = await mk();
    trigger.click();
    await el.updateComplete;
    surface(el).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
  });
});

describe("<tulpar-toggletip> controlled + imperative + events", () => {
  async function mk(): Promise<{ el: TulparToggletip; trigger: HTMLButtonElement }> {
    const el = await fixture<TulparToggletip>(
      html`<tulpar-toggletip text="Hi"><button slot="trigger">?</button></tulpar-toggletip>`,
    );
    await el.updateComplete;
    return { el, trigger: el.querySelector("button")! };
  }

  it("show() opens and emits tulpar-open with detail.open=true", async () => {
    const { el } = await mk();
    let detail: { open: boolean } | undefined;
    el.addEventListener("tulpar-open", (e) => {
      detail = (e as CustomEvent<{ open: boolean }>).detail;
    });
    el.show();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    expect(detail).to.deep.equal({ open: true });
  });

  it("hide() closes and emits tulpar-close", async () => {
    const { el } = await mk();
    el.show();
    await el.updateComplete;
    let closed = false;
    el.addEventListener("tulpar-close", () => {
      closed = true;
    });
    el.hide();
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
    expect(closed).to.be.true;
  });

  it("toggle() flips state and emits tulpar-toggle", async () => {
    const { el } = await mk();
    const toggles: boolean[] = [];
    el.addEventListener("tulpar-toggle", (e) => {
      toggles.push((e as CustomEvent<{ open: boolean }>).detail.open);
    });
    el.toggle();
    await el.updateComplete;
    el.toggle();
    await el.updateComplete;
    expect(toggles).to.deep.equal([true, false]);
  });

  it("controlled open property reflects to the surface", async () => {
    const { el } = await mk();
    el.open = true;
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    el.open = false;
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
  });

  it("reflects data-side for origin-aware motion", async () => {
    const { el } = await mk();
    el.show();
    await el.updateComplete;
    expect(surface(el).hasAttribute("data-side")).to.be.true;
  });

  it("keeps the surface inside the shadow root while open (stays styled)", async () => {
    const { el } = await mk();
    el.show();
    await el.updateComplete;
    const s = surface(el);
    expect(s.getRootNode()).to.equal(el.shadowRoot);
    expect(getComputedStyle(s).position).to.equal("fixed");
    expect(getComputedStyle(s).zIndex).to.not.equal("auto");
  });

  it("oneEvent import retained", () => {
    expect(oneEvent).to.be.a("function");
  });

  it("reposition() re-measures without throwing", async () => {
    const { el } = await mk();
    el.show();
    await el.updateComplete;
    el.reposition();
    await aTimeout(0);
    expect(surface(el).style.top).to.match(/px$/);
  });
});

describe("<tulpar-toggletip> tone (semantic intents)", () => {
  async function mk(tone?: string): Promise<{ el: TulparToggletip; trigger: HTMLButtonElement }> {
    const el = await fixture<TulparToggletip>(
      html`<tulpar-toggletip text="Hi" tone=${tone ?? "neutral"}
        ><button slot="trigger">?</button></tulpar-toggletip
      >`,
    );
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    return { el, trigger: el.querySelector("button")! };
  }

  /**
   * Resolve one of the component's internal surface props (`--_tg-bg`, etc.) to
   * its computed color via a probe inside the shadow root. These props are the
   * single source of truth the surface + arrow paint from, and they carry the
   * tone token (with the same in-CSS fallback), so the assertion holds whether
   * or not the external tokens stylesheet is loaded in the test harness.
   */
  function resolveInternal(el: TulparToggletip, prop: string): string {
    const probe = document.createElement("span");
    probe.style.color = `var(${prop})`;
    probe.style.position = "absolute";
    el.shadowRoot!.appendChild(probe);
    const c = getComputedStyle(probe).color;
    probe.remove();
    return c;
  }

  it("reflects tone to the host attribute", async () => {
    const { el } = await mk("info");
    expect(el.getAttribute("tone")).to.equal("info");
  });

  it("default neutral uses the neutral overlay surface bg", async () => {
    const { el } = await mk("neutral");
    const s = surface(el);
    // Internal bg prop resolves to the neutral overlay surface token.
    expect(getComputedStyle(s).backgroundColor).to.equal(resolveInternal(el, "--_tg-bg"));
  });

  (["info", "success", "warning", "danger"] as const).forEach((tone) => {
    it(`tone="${tone}" applies the matching tone surface/on-surface vars`, async () => {
      const { el } = await mk(tone);
      const s = surface(el);
      const cs = getComputedStyle(s);
      // The tone remaps the internal surface props; the surface paints from them.
      expect(cs.backgroundColor).to.equal(resolveInternal(el, "--_tg-bg"));
      expect(cs.color).to.equal(resolveInternal(el, "--_tg-fg"));
      expect(cs.borderTopColor).to.equal(resolveInternal(el, "--_tg-border"));
      // And the tone bg differs from the neutral surface (proves the override).
      const neutral = await fixture<TulparToggletip>(
        html`<tulpar-toggletip text="x"><button slot="trigger">?</button></tulpar-toggletip>`,
      );
      await neutral.updateComplete;
      expect(cs.backgroundColor).to.not.equal(resolveInternal(neutral, "--_tg-bg"));
    });
  });

  it("arrow inherits the tone surface bg + border", async () => {
    const { el } = await mk("danger");
    const arrow = el.shadowRoot!.querySelector(".arrow") as HTMLElement;
    expect(getComputedStyle(arrow).backgroundColor).to.equal(resolveInternal(el, "--_tg-bg"));
  });

  it("renders a slotted status icon", async () => {
    const el = await fixture<TulparToggletip>(
      html`<tulpar-toggletip text="Heads up" tone="warning">
        <button slot="trigger">?</button>
        <svg slot="icon" width="16" height="16" aria-hidden="true"></svg>
      </tulpar-toggletip>`,
    );
    await el.updateComplete;
    const iconSlot = el.shadowRoot!.querySelector('slot[name="icon"]') as HTMLSlotElement;
    expect(iconSlot.assignedElements().length).to.equal(1);
    // The icon wrapper becomes visible when filled.
    const wrap = el.shadowRoot!.querySelector(".icon") as HTMLElement;
    expect(wrap.classList.contains("icon--filled")).to.be.true;
  });

  it("icon wrapper stays collapsed when no icon is slotted", async () => {
    const { el } = await mk("info");
    const wrap = el.shadowRoot!.querySelector(".icon") as HTMLElement;
    expect(wrap.classList.contains("icon--filled")).to.be.false;
    expect(getComputedStyle(wrap).display).to.equal("none");
  });
});
