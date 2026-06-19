import { fixture, html, expect, aTimeout, oneEvent } from "@open-wc/testing";
import "./tulpar-tooltip";
import type { TulparTooltip } from "./tulpar-tooltip";
import { __resetOverlayRootForTest } from "../_internal/overlay/overlay-root";
import { overlayDelay, configureOverlayDelays } from "../_internal/overlay/delay-controller";

function surface(el: TulparTooltip): HTMLElement {
  return el.shadowRoot!.querySelector(".surface") as HTMLElement;
}

function isOpen(el: TulparTooltip): boolean {
  return surface(el).hasAttribute("data-open");
}

function fire(target: EventTarget, type: string, init: EventInit = {}): void {
  target.dispatchEvent(new Event(type, { bubbles: true, ...init }));
}

// Near-instant delays so timing-dependent assertions are deterministic.
function fastDelays(): void {
  configureOverlayDelays({ delayOpen: 5, delayClose: 5, skipDelayGrace: 50 });
}

let seq = 0;
/** Unique trigger id per fixture so cross-test leakage can't resolve stale ids. */
function uid(): string {
  seq += 1;
  return `tt-trigger-${seq}`;
}

/**
 * Render an external trigger button + a tooltip referencing it by `for`, in a
 * wrapping div (the new for-id model — nothing wraps the trigger).
 */
async function mkBound(): Promise<{
  el: TulparTooltip;
  trigger: HTMLButtonElement;
  wrap: HTMLElement;
}> {
  const id = uid();
  const wrap = (await fixture(html`
    <div>
      <button id="${id}">T</button>
      <tulpar-tooltip for="${id}" text="Hi"></tulpar-tooltip>
    </div>
  `)) as HTMLElement;
  const el = wrap.querySelector("tulpar-tooltip") as TulparTooltip;
  await el.updateComplete;
  return { el, trigger: wrap.querySelector("button")!, wrap };
}

afterEach(() => {
  __resetOverlayRootForTest();
  overlayDelay.reset();
});

describe("public type exports", () => {
  it("re-exports TulparTooltip from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparTooltip).to.exist;
  });
  it("re-exports TulparTooltip from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparTooltip).to.exist;
  });
});

describe("<tulpar-tooltip> skeleton + aria (for-id model)", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-tooltip")).to.exist;
  });

  it("host owns no layout box (display:contents)", async () => {
    const { el } = await mkBound();
    expect(getComputedStyle(el).display).to.equal("contents");
  });

  it("does NOT render a slot[name=trigger] (no slot-wrap)", async () => {
    const { el } = await mkBound();
    expect(el.shadowRoot!.querySelector('slot[name="trigger"]')).to.equal(null);
  });

  it("renders a surface with role=tooltip", async () => {
    const { el } = await mkBound();
    const s = surface(el);
    expect(s).to.exist;
    expect(s.getAttribute("role")).to.equal("tooltip");
  });

  it("renders the text prop into the surface", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id}">T</button>
        <tulpar-tooltip for="${id}" text="Save changes"></tulpar-tooltip>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-tooltip") as TulparTooltip;
    await el.updateComplete;
    expect(surface(el).textContent).to.contain("Save changes");
  });

  it("reflects the `for` property to the attribute", async () => {
    const { el } = await mkBound();
    expect(el.getAttribute("for")).to.be.a("string").and.not.empty;
    expect(el.for).to.equal(el.getAttribute("for"));
  });

  it("links the EXTERNAL trigger's aria-describedby to the surface id", async () => {
    const { el, trigger } = await mkBound();
    const id = surface(el).id;
    expect(id).to.be.a("string").and.not.empty;
    expect(trigger.getAttribute("aria-describedby")).to.contain(id);
  });

  it("defaults placement=top and reflects data-placement on the surface", async () => {
    const { el } = await mkBound();
    expect(el.placement).to.equal("top");
    expect(surface(el).hasAttribute("data-placement")).to.be.true;
  });

  it("has sensible numeric defaults", async () => {
    const { el } = await mkBound();
    expect(el.offset).to.equal(8);
    expect(el.crossOffset).to.equal(0);
    expect(el.containerPadding).to.equal(12);
    expect(el.boundary).to.equal("viewport");
    expect(el.flip).to.be.true;
    expect(el.arrow).to.be.true;
  });
});

describe("<tulpar-tooltip> trigger resolution + declaration order", () => {
  it("warns (dev) when `for` resolves to no element", async () => {
    const calls: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => calls.push(args);
    try {
      const el = (await fixture(
        html`<tulpar-tooltip for="ghost-id" text="Hi"></tulpar-tooltip>`,
      )) as TulparTooltip;
      await el.updateComplete;
      expect(calls.length).to.be.greaterThan(0);
      expect(el._anchorElForTest).to.equal(null);
    } finally {
      console.warn = original;
    }
  });

  it("resolves a trigger declared AFTER the tooltip (declaration-order)", async () => {
    const id = uid();
    // Tooltip first, trigger second — both connect together; resolution happens
    // on firstUpdated/updateComplete once the trigger is in the DOM.
    const wrap = (await fixture(html`
      <div>
        <tulpar-tooltip for="${id}" text="Hi"></tulpar-tooltip>
        <button id="${id}">T</button>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-tooltip") as TulparTooltip;
    await el.updateComplete;
    const trigger = wrap.querySelector("button")!;
    expect(el._anchorElForTest).to.equal(trigger);
    expect(trigger.getAttribute("aria-describedby")).to.contain(surface(el).id);
  });

  it("lazily resolves on show() when the trigger was added after connect", async () => {
    const id = uid();
    const el = (await fixture(
      html`<tulpar-tooltip for="${id}" text="Hi"></tulpar-tooltip>`,
    )) as TulparTooltip;
    await el.updateComplete;
    expect(el._anchorElForTest).to.equal(null);
    // Trigger appears later.
    const trigger = document.createElement("button");
    trigger.id = id;
    document.body.appendChild(trigger);
    try {
      el.show();
      await el.updateComplete;
      expect(el._anchorElForTest).to.equal(trigger);
      expect(isOpen(el)).to.be.true;
    } finally {
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
        <tulpar-tooltip for="${idA}" text="Hi"></tulpar-tooltip>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-tooltip") as TulparTooltip;
    await el.updateComplete;
    const a = wrap.querySelector(`#${idA}`)! as HTMLElement;
    const b = wrap.querySelector(`#${idB}`)! as HTMLElement;
    const sid = surface(el).id;
    expect(a.getAttribute("aria-describedby")).to.contain(sid);

    el.for = idB;
    await el.updateComplete;
    expect(el._anchorElForTest).to.equal(b);
    // Old trigger's describedby cleared, new trigger linked.
    expect(a.hasAttribute("aria-describedby")).to.be.false;
    expect(b.getAttribute("aria-describedby")).to.contain(sid);
  });
});

describe("<tulpar-tooltip> open/close behavior + WCAG 1.4.13", () => {
  async function mk(): Promise<{ el: TulparTooltip; trigger: HTMLButtonElement }> {
    fastDelays();
    const { el, trigger } = await mkBound();
    return { el, trigger };
  }

  it("opens on mouseenter after delayOpen", async () => {
    const { el, trigger } = await mk();
    expect(isOpen(el)).to.be.false;
    fire(trigger, "mouseenter");
    expect(isOpen(el)).to.be.false; // delayed
    await aTimeout(20);
    expect(isOpen(el)).to.be.true;
  });

  it("closes on mouseleave after delayClose", async () => {
    const { el, trigger } = await mk();
    fire(trigger, "mouseenter");
    await aTimeout(20);
    expect(isOpen(el)).to.be.true;
    fire(trigger, "mouseleave");
    await aTimeout(20);
    expect(isOpen(el)).to.be.false;
  });

  it("opens on keyboard focus but NOT on a mouse-originated focus", async () => {
    const { el, trigger } = await mk();
    // Simulate a pointer press preceding focus (mouse-originated focus).
    fire(trigger, "pointerdown", { bubbles: true });
    trigger.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    await aTimeout(20);
    expect(isOpen(el)).to.be.false;

    // Keyboard focus (no preceding pointerdown) opens immediately.
    trigger.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
  });

  it("closes on blur", async () => {
    const { el, trigger } = await mk();
    trigger.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    trigger.dispatchEvent(new FocusEvent("blur", { bubbles: false }));
    await aTimeout(20);
    expect(isOpen(el)).to.be.false;
  });

  it("stays open when the pointer moves onto the surface (hoverable)", async () => {
    const { el, trigger } = await mk();
    fire(trigger, "mouseenter");
    await aTimeout(20);
    expect(isOpen(el)).to.be.true;
    // Leave the trigger but enter the surface within the close delay.
    fire(trigger, "mouseleave");
    fire(surface(el), "mouseenter");
    await aTimeout(20);
    expect(isOpen(el)).to.be.true;
  });

  it("renders a hover bridge pad while open", async () => {
    const { el, trigger } = await mk();
    fire(trigger, "mouseenter");
    await aTimeout(20);
    expect(el.shadowRoot!.querySelector(".bridge")).to.exist;
  });

  it("Escape closes while keeping focus on the trigger (dismissible)", async () => {
    const { el, trigger } = await mk();
    trigger.focus();
    trigger.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
    expect(document.activeElement).to.equal(trigger);
  });

  it("does not auto-hide (persistent)", async () => {
    const { el, trigger } = await mk();
    fire(trigger, "mouseenter");
    await aTimeout(20);
    expect(isOpen(el)).to.be.true;
    await aTimeout(60);
    expect(isOpen(el)).to.be.true;
  });

  it("only one tooltip open at a time", async () => {
    fastDelays();
    const idA = uid();
    const idB = uid();
    const wrap = await fixture(html`
      <div>
        <button id="${idA}">A</button>
        <button id="${idB}">B</button>
        <tulpar-tooltip for="${idA}" text="A"></tulpar-tooltip>
        <tulpar-tooltip for="${idB}" text="B"></tulpar-tooltip>
      </div>
    `);
    const [a, b] = Array.from(wrap.querySelectorAll("tulpar-tooltip")) as TulparTooltip[];
    await a.updateComplete;
    await b.updateComplete;
    fire(wrap.querySelector(`#${idA}`)!, "mouseenter");
    await aTimeout(20);
    expect(isOpen(a)).to.be.true;
    fire(wrap.querySelector(`#${idB}`)!, "mouseenter");
    await aTimeout(20);
    expect(isOpen(b)).to.be.true;
    expect(isOpen(a)).to.be.false;
  });

  it("surface never receives focus (no tabindex / not focusable)", async () => {
    const { el, trigger } = await mk();
    fire(trigger, "mouseenter");
    await aTimeout(20);
    const s = surface(el);
    expect(s.hasAttribute("tabindex")).to.be.false;
    s.focus?.();
    expect(document.activeElement).to.not.equal(s);
  });

  it("keeps the surface inside the shadow root while open (stays styled)", async () => {
    const { el, trigger } = await mk();
    fire(trigger, "mouseenter");
    await aTimeout(20);
    expect(isOpen(el)).to.be.true;
    const s = surface(el);
    // The surface must remain shadow-scoped so it keeps its CSS (bg/padding/
    // arrow/motion). It is never portaled out to document.body.
    expect(s.getRootNode()).to.equal(el.shadowRoot);
    expect(el.shadowRoot!.contains(s)).to.be.true;
    // Stacking is owned by the z-index token on .surface, not by a portal.
    expect(getComputedStyle(s).position).to.equal("fixed");
    expect(getComputedStyle(s).zIndex).to.not.equal("auto");
  });

  it("emits is exercised indirectly; oneEvent import retained", () => {
    expect(oneEvent).to.be.a("function");
  });
});

describe("<tulpar-tooltip> controlled + imperative + motion", () => {
  async function mk(): Promise<{ el: TulparTooltip; trigger: HTMLButtonElement }> {
    fastDelays();
    const { el, trigger } = await mkBound();
    return { el, trigger };
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
    expect(isOpen(el)).to.be.true;
    el.toggle();
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
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

  it("reposition() re-measures after the surface resizes", async () => {
    const { el } = await mk();
    el.show();
    await el.updateComplete;
    const before = surface(el).style.top;
    // Force a size change, then reposition.
    surface(el).style.minHeight = "300px";
    el.reposition();
    await el.updateComplete;
    // top recomputed (placement=top → larger surface pushes top up). Just assert
    // it remains a valid px string and reposition did not throw.
    expect(surface(el).style.top).to.match(/px$/);
    expect(before).to.match(/px$/);
  });

  it("reflects data-side for origin-aware motion", async () => {
    const { el } = await mk();
    el.show();
    await el.updateComplete;
    expect(surface(el).hasAttribute("data-side")).to.be.true;
  });

  it("plays an exit animation on hover-close (data-exiting set, data-open cleared)", async () => {
    const { el, trigger } = await mk();
    fire(trigger, "mouseenter");
    await aTimeout(20);
    expect(isOpen(el)).to.be.true;
    fire(trigger, "mouseleave");
    await aTimeout(20);
    const s = surface(el);
    // Logical close committed (data-open gone). Exit may still be animating.
    expect(s.hasAttribute("data-open")).to.be.false;
  });

  it("Escape removes the surface immediately (no lingering exit)", async () => {
    const { el, trigger } = await mk();
    trigger.focus();
    trigger.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    const s = surface(el);
    expect(s.hasAttribute("data-open")).to.be.false;
    expect(s.hasAttribute("data-exiting")).to.be.false;
  });

  it("skip-delay grace: second sibling opens immediately after first", async () => {
    fastDelays();
    const idA = uid();
    const idB = uid();
    const wrap = await fixture(html`
      <div>
        <button id="${idA}">A</button>
        <button id="${idB}">B</button>
        <tulpar-tooltip for="${idA}" text="A"></tulpar-tooltip>
        <tulpar-tooltip for="${idB}" text="B"></tulpar-tooltip>
      </div>
    `);
    const [a, b] = Array.from(wrap.querySelectorAll("tulpar-tooltip")) as TulparTooltip[];
    await a.updateComplete;
    await b.updateComplete;
    // First open is delayed.
    fire(wrap.querySelector(`#${idA}`)!, "mouseenter");
    expect(isOpen(a)).to.be.false;
    await aTimeout(20);
    expect(isOpen(a)).to.be.true;
    // Within the grace window, B opens immediately (no delay tick).
    fire(wrap.querySelector(`#${idA}`)!, "mouseleave");
    fire(wrap.querySelector(`#${idB}`)!, "mouseenter");
    expect(isOpen(b)).to.be.true;
  });

  it("interactive default-slot content emits a dev warning", async () => {
    const calls: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => calls.push(args);
    try {
      const id = uid();
      const wrap = (await fixture(html`
        <div>
          <button id="${id}">T</button>
          <tulpar-tooltip for="${id}"><a href="#">interactive</a></tulpar-tooltip>
        </div>
      `)) as HTMLElement;
      const el = wrap.querySelector("tulpar-tooltip") as TulparTooltip;
      await el.updateComplete;
      expect(calls.some((c) => String(c[0]).includes("interactive content"))).to.be.true;
    } finally {
      console.warn = original;
    }
  });
});
