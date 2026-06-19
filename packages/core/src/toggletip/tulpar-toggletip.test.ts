import { fixture, html, expect, aTimeout, oneEvent } from "@open-wc/testing";
import "./tulpar-toggletip";
import type { TulparToggletip } from "./tulpar-toggletip";
import { __resetOverlayRootForTest } from "../_internal/overlay/overlay-root";

function surface(el: TulparToggletip): HTMLElement {
  return el.shadowRoot!.querySelector(".surface") as HTMLElement;
}

function live(el: TulparToggletip): HTMLElement {
  return el.shadowRoot!.querySelector("[aria-live]") as HTMLElement;
}

function isOpen(el: TulparToggletip): boolean {
  return surface(el).hasAttribute("data-open");
}

function key(target: EventTarget, k: string): void {
  target.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));
}

let seq = 0;
/** Unique trigger id per fixture so cross-test leakage can't resolve stale ids. */
function uid(): string {
  seq += 1;
  return `tg-trigger-${seq}`;
}

/**
 * Render an external trigger button + a toggletip referencing it by `for`, in a
 * wrapping div (the for-id model — nothing wraps the trigger).
 */
async function mkBound(opts?: {
  text?: string;
  tone?: string;
}): Promise<{ el: TulparToggletip; trigger: HTMLButtonElement; wrap: HTMLElement }> {
  const id = uid();
  const text = opts?.text ?? "More info";
  const tone = opts?.tone ?? "neutral";
  const wrap = (await fixture(html`
    <div>
      <button id="${id}">?</button>
      <tulpar-toggletip for="${id}" text="${text}" tone="${tone}"></tulpar-toggletip>
    </div>
  `)) as HTMLElement;
  const el = wrap.querySelector("tulpar-toggletip") as TulparToggletip;
  await el.updateComplete;
  return { el, trigger: wrap.querySelector("button")!, wrap };
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

describe("<tulpar-toggletip> skeleton + disclosure + live region (for-id model)", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-toggletip")).to.exist;
  });

  it("host is display:contents", async () => {
    const { el } = await mkBound();
    expect(getComputedStyle(el).display).to.equal("contents");
  });

  it("does NOT render a slot[name=trigger] (no slot-wrap)", async () => {
    const { el } = await mkBound();
    expect(el.shadowRoot!.querySelector('slot[name="trigger"]')).to.equal(null);
  });

  it("reflects the `for` property to the attribute", async () => {
    const { el } = await mkBound();
    expect(el.getAttribute("for")).to.be.a("string").and.not.empty;
    expect(el.for).to.equal(el.getAttribute("for"));
  });

  it("renders a surface", async () => {
    const { el } = await mkBound();
    expect(surface(el)).to.exist;
  });

  it("pre-inserts an aria-live=polite region in the DOM before injection", async () => {
    const { el } = await mkBound();
    const region = live(el);
    expect(region).to.exist;
    expect(region.getAttribute("aria-live")).to.equal("polite");
    // Empty before open.
    expect(region.textContent).to.equal("");
  });

  it("defaults placement=top and reflects data-placement on the surface", async () => {
    const { el } = await mkBound();
    expect(el.placement).to.equal("top");
    expect(surface(el).hasAttribute("data-placement")).to.be.true;
  });

  it("has sensible numeric/boolean defaults", async () => {
    const { el } = await mkBound();
    expect(el.offset).to.equal(8);
    expect(el.crossOffset).to.equal(0);
    expect(el.containerPadding).to.equal(12);
    expect(el.boundary).to.equal("viewport");
    expect(el.flip).to.be.true;
    expect(el.arrow).to.be.true;
    expect(el.tone).to.equal("neutral");
  });

  it("wires aria-haspopup=dialog onto the EXTERNAL trigger", async () => {
    const { trigger } = await mkBound();
    expect(trigger.getAttribute("aria-haspopup")).to.equal("dialog");
  });

  it("trigger gets aria-expanded=false initially (disclosure)", async () => {
    const { trigger } = await mkBound();
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
  });

  it("clicking the trigger toggles open/closed", async () => {
    const { el, trigger } = await mkBound();
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
    const { el, trigger } = await mkBound();
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
    const { el, trigger } = await mkBound();

    // A keyboard activation. With the fix this is a no-op (the native click does
    // the toggling); against old logic it toggles AND sets the unbounded swallow
    // flag — which then eats the FIRST genuine click below.
    key(trigger, "Enter");
    await el.updateComplete;

    const clickToggles: boolean[] = [];
    el.addEventListener("tulpar-toggle", (e) => {
      clickToggles.push((e as CustomEvent<{ open: boolean }>).detail.open);
    });

    trigger.click();
    await el.updateComplete;
    trigger.click();
    await el.updateComplete;
    trigger.click();
    await el.updateComplete;

    expect(clickToggles, "each genuine click toggles exactly once").to.deep.equal([
      true,
      false,
      true,
    ]);
    expect(isOpen(el), "ends open after three clean toggles").to.be.true;
  });

  it("prevents default on Space keydown (no page scroll while focused)", async () => {
    const { trigger } = await mkBound();
    const ev = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    trigger.dispatchEvent(ev);
    expect(ev.defaultPrevented).to.be.true;
  });

  it("injects the content text into the live region on open", async () => {
    const { el, trigger } = await mkBound();
    expect(live(el).textContent).to.equal("");
    trigger.click();
    await el.updateComplete;
    expect(live(el).textContent).to.contain("More info");
  });

  it("announces default-slot content (no text prop) in the live region", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id}">?</button>
        <tulpar-toggletip for="${id}">Slotted disclosure</tulpar-toggletip>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-toggletip") as TulparToggletip;
    await el.updateComplete;
    const trigger = wrap.querySelector("button")!;
    trigger.click();
    await el.updateComplete;
    expect(live(el).textContent).to.contain("Slotted disclosure");
  });

  it("does not move focus into the bubble on open", async () => {
    const { el, trigger } = await mkBound();
    trigger.focus();
    trigger.click();
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).to.be.null;
  });

  it("surface is not focusable", async () => {
    const { el, trigger } = await mkBound();
    trigger.click();
    await el.updateComplete;
    expect(surface(el).hasAttribute("tabindex")).to.be.false;
  });

  it("Escape closes AND returns focus to the trigger", async () => {
    const { el, trigger } = await mkBound();
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
    const { el, trigger } = await mkBound();
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
  });

  it("clicking inside the surface does not close", async () => {
    const { el, trigger } = await mkBound();
    trigger.click();
    await el.updateComplete;
    surface(el).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
  });

  it("pressing the trigger again does not count as an outside dismiss (clean toggle off)", async () => {
    const { el, trigger } = await mkBound();
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    // A pointerdown on the trigger followed by its click: the pointerdown must not
    // light-dismiss (the trigger is not "outside"), and the click toggles closed.
    trigger.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
  });
});

describe("<tulpar-toggletip> trigger resolution + declaration order", () => {
  it("warns (dev) when `for` resolves to no element", async () => {
    const calls: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => calls.push(args);
    try {
      const el = (await fixture(
        html`<tulpar-toggletip for="ghost-id" text="Hi"></tulpar-toggletip>`,
      )) as TulparToggletip;
      await el.updateComplete;
      expect(calls.length).to.be.greaterThan(0);
      expect(el._anchorElForTest).to.equal(null);
    } finally {
      console.warn = original;
    }
  });

  it("resolves a trigger declared AFTER the toggletip (declaration-order)", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <tulpar-toggletip for="${id}" text="Hi"></tulpar-toggletip>
        <button id="${id}">?</button>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-toggletip") as TulparToggletip;
    await el.updateComplete;
    const trigger = wrap.querySelector("button")!;
    expect(el._anchorElForTest).to.equal(trigger);
    expect(trigger.getAttribute("aria-haspopup")).to.equal("dialog");
  });

  it("lazily resolves on show() when the trigger was added after connect", async () => {
    const id = uid();
    const el = (await fixture(
      html`<tulpar-toggletip for="${id}" text="Hi"></tulpar-toggletip>`,
    )) as TulparToggletip;
    await el.updateComplete;
    expect(el._anchorElForTest).to.equal(null);
    const trigger = document.createElement("button");
    trigger.id = id;
    document.body.appendChild(trigger);
    try {
      el.show();
      await el.updateComplete;
      expect(el._anchorElForTest).to.equal(trigger);
      expect(isOpen(el)).to.be.true;
    } finally {
      el.hide();
      trigger.remove();
    }
  });

  it("re-wires when `for` changes (detaches the old trigger)", async () => {
    const idA = uid();
    const idB = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${idA}">A</button>
        <button id="${idB}">B</button>
        <tulpar-toggletip for="${idA}" text="Hi"></tulpar-toggletip>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-toggletip") as TulparToggletip;
    await el.updateComplete;
    const a = wrap.querySelector(`#${idA}`)! as HTMLElement;
    const b = wrap.querySelector(`#${idB}`)! as HTMLElement;
    expect(a.getAttribute("aria-haspopup")).to.equal("dialog");

    el.for = idB;
    await el.updateComplete;
    expect(el._anchorElForTest).to.equal(b);
    // Old trigger's haspopup cleared, new trigger wired.
    expect(a.hasAttribute("aria-haspopup")).to.be.false;
    expect(b.getAttribute("aria-haspopup")).to.equal("dialog");
  });
});

describe("<tulpar-toggletip> controlled + imperative + events", () => {
  it("show() opens and emits tulpar-open with detail.open=true", async () => {
    const { el } = await mkBound();
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
    const { el } = await mkBound();
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
    const { el } = await mkBound();
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
    const { el } = await mkBound();
    el.open = true;
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    el.open = false;
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
  });

  it("reflects data-side for origin-aware motion", async () => {
    const { el } = await mkBound();
    el.show();
    await el.updateComplete;
    expect(surface(el).hasAttribute("data-side")).to.be.true;
  });

  it("keeps the surface inside the shadow root while open (stays styled)", async () => {
    const { el } = await mkBound();
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
    const { el } = await mkBound();
    el.show();
    await el.updateComplete;
    el.reposition();
    await aTimeout(0);
    expect(surface(el).style.top).to.match(/px$/);
  });
});

describe("<tulpar-toggletip> tone (semantic intents)", () => {
  async function mk(tone?: string): Promise<{ el: TulparToggletip; trigger: HTMLButtonElement }> {
    const { el, trigger } = await mkBound({ text: "Hi", tone });
    el.show();
    await el.updateComplete;
    return { el, trigger };
  }

  /**
   * Resolve one of the component's internal surface props (`--_tg-bg`, etc.) to
   * its computed color via a probe inside the shadow root. These props are the
   * single source of truth the surface + arrow paint from.
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
    expect(getComputedStyle(s).backgroundColor).to.equal(resolveInternal(el, "--_tg-bg"));
  });

  (["info", "success", "warning", "danger"] as const).forEach((tone) => {
    it(`tone="${tone}" applies the matching tone surface/on-surface vars`, async () => {
      const { el } = await mk(tone);
      const s = surface(el);
      const cs = getComputedStyle(s);
      expect(cs.backgroundColor).to.equal(resolveInternal(el, "--_tg-bg"));
      expect(cs.color).to.equal(resolveInternal(el, "--_tg-fg"));
      expect(cs.borderTopColor).to.equal(resolveInternal(el, "--_tg-border"));
      const { el: neutral } = await mkBound({ text: "x" });
      expect(cs.backgroundColor).to.not.equal(resolveInternal(neutral, "--_tg-bg"));
    });
  });

  it("arrow inherits the tone surface bg + border", async () => {
    const { el } = await mk("danger");
    const arrow = el.shadowRoot!.querySelector(".arrow") as HTMLElement;
    expect(getComputedStyle(arrow).backgroundColor).to.equal(resolveInternal(el, "--_tg-bg"));
  });

  it("renders a slotted status icon", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id}">?</button>
        <tulpar-toggletip for="${id}" text="Heads up" tone="warning">
          <svg slot="icon" width="16" height="16" aria-hidden="true"></svg>
        </tulpar-toggletip>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-toggletip") as TulparToggletip;
    await el.updateComplete;
    const iconSlot = el.shadowRoot!.querySelector('slot[name="icon"]') as HTMLSlotElement;
    expect(iconSlot.assignedElements().length).to.equal(1);
    const w = el.shadowRoot!.querySelector(".icon") as HTMLElement;
    expect(w.classList.contains("icon--filled")).to.be.true;
  });

  it("icon wrapper stays collapsed when no icon is slotted", async () => {
    const { el } = await mk("info");
    const w = el.shadowRoot!.querySelector(".icon") as HTMLElement;
    expect(w.classList.contains("icon--filled")).to.be.false;
    expect(getComputedStyle(w).display).to.equal("none");
  });
});
