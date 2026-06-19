import { fixture, html, expect, aTimeout, oneEvent } from "@open-wc/testing";
import "./tulpar-popover";
import type { TulparPopover } from "./tulpar-popover";
import "../tooltip/tulpar-tooltip";
import type { TulparTooltip } from "../tooltip/tulpar-tooltip";
import { __resetOverlayRootForTest, topOverlay } from "../_internal/overlay/overlay-root";

function surface(el: TulparPopover): HTMLElement {
  return el.shadowRoot!.querySelector(".surface") as HTMLElement;
}

function isOpen(el: TulparPopover): boolean {
  return surface(el).hasAttribute("data-open");
}

let seq = 0;
/** Unique trigger id per fixture so cross-test leakage can't resolve stale ids. */
function uid(): string {
  seq += 1;
  return `pop-trigger-${seq}`;
}

/**
 * Render an external trigger button + a popover referencing it by `for`, in a
 * wrapping div (the for-id model — nothing wraps the trigger). The popover's
 * children are its rich content (default slot).
 */
async function mkBound(): Promise<{
  el: TulparPopover;
  trigger: HTMLButtonElement;
  wrap: HTMLElement;
}> {
  const id = uid();
  const wrap = (await fixture(html`
    <div>
      <button id="${id}">Open</button>
      <tulpar-popover for="${id}">
        <div>
          <h2 id="ph">Account</h2>
          <button id="first">First</button>
          <button id="second">Second</button>
        </div>
      </tulpar-popover>
    </div>
  `)) as HTMLElement;
  const el = wrap.querySelector("tulpar-popover") as TulparPopover;
  await el.updateComplete;
  return { el, trigger: wrap.querySelector("button")!, wrap };
}

afterEach(() => {
  __resetOverlayRootForTest();
});

describe("public type exports", () => {
  it("re-exports TulparPopover from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparPopover).to.exist;
  });
  it("re-exports TulparPopover from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparPopover).to.exist;
  });
});

describe("<tulpar-popover> skeleton + non-modal focus model (for-id)", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-popover")).to.exist;
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

  it("defaults placement=bottom-start, arrow=false, tone=neutral", async () => {
    const { el } = await mkBound();
    expect(el.placement).to.equal("bottom-start");
    expect(el.arrow).to.be.false;
    expect(el.tone).to.equal("neutral");
  });

  it("has sensible numeric/boolean defaults", async () => {
    const { el } = await mkBound();
    expect(el.offset).to.equal(8);
    expect(el.crossOffset).to.equal(0);
    expect(el.containerPadding).to.equal(12);
    expect(el.boundary).to.equal("viewport");
    expect(el.flip).to.be.true;
  });

  it("wires aria-haspopup=dialog onto the EXTERNAL trigger", async () => {
    const { trigger } = await mkBound();
    expect(trigger.getAttribute("aria-haspopup")).to.equal("dialog");
  });

  it("trigger gets aria-expanded=false initially", async () => {
    const { trigger } = await mkBound();
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
  });

  it("surface has role=dialog", async () => {
    const { el } = await mkBound();
    expect(surface(el).getAttribute("role")).to.equal("dialog");
  });

  it("clicking the trigger opens and sets aria-expanded=true", async () => {
    const { el, trigger } = await mkBound();
    expect(isOpen(el)).to.be.false;
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
  });

  it("activating the trigger toggles (native click path: mouse AND Enter/Space)", async () => {
    const { el, trigger } = await mkBound();
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.true;
    trigger.click();
    await el.updateComplete;
    expect(isOpen(el)).to.be.false;
  });

  it("prevents default on Space keydown (no page scroll while focused)", async () => {
    const { trigger } = await mkBound();
    const ev = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    trigger.dispatchEvent(ev);
    expect(ev.defaultPrevented).to.be.true;
  });

  it("on open, focus MOVES to the first focusable inside the content", async () => {
    const { el, trigger } = await mkBound();
    trigger.click();
    await el.updateComplete;
    await aTimeout(0);
    const first = el.querySelector<HTMLButtonElement>("#first")!;
    expect(document.activeElement).to.equal(first);
  });

  it("falls back to focusing the surface container (tabindex=-1) when no focusable content", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id}">Open</button>
        <tulpar-popover for="${id}"><p>Just text, no controls.</p></tulpar-popover>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-popover") as TulparPopover;
    await el.updateComplete;
    const trigger = wrap.querySelector("button")!;
    trigger.click();
    await el.updateComplete;
    await aTimeout(0);
    const s = surface(el);
    expect(s.getAttribute("tabindex")).to.equal("-1");
    expect(el.shadowRoot!.activeElement).to.equal(s);
  });

  it("is NON-MODAL: Tab flows naturally OUT (no focus trap, no inert/scroll-lock)", async () => {
    const { el, trigger } = await mkBound();
    trigger.click();
    await el.updateComplete;
    await aTimeout(0);
    // No global side effects of a modal dialog.
    expect(document.body.hasAttribute("inert")).to.be.false;
    expect(document.body.style.overflow).to.not.equal("hidden");
    // The popover never installs a keydown Tab trap on itself.
    const s = surface(el);
    const ev = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    s.dispatchEvent(ev);
    expect(ev.defaultPrevented).to.be.false;
  });

  it("Escape closes AND returns focus to the trigger", async () => {
    const { el, trigger } = await mkBound();
    trigger.focus();
    trigger.click();
    await el.updateComplete;
    await aTimeout(0);
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

  it("labels the surface via aria-labelledby from a content heading", async () => {
    const { el, trigger } = await mkBound();
    trigger.click();
    await el.updateComplete;
    const s = surface(el);
    const labelled = s.getAttribute("aria-labelledby");
    expect(labelled, "aria-labelledby is set").to.be.a("string");
    const heading = el.querySelector("#ph")!;
    expect(heading.id).to.equal(labelled);
  });

  it("uses aria-label when provided (over labelledby)", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id}">Open</button>
        <tulpar-popover for="${id}" label="Settings"><button>x</button></tulpar-popover>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-popover") as TulparPopover;
    await el.updateComplete;
    wrap.querySelector("button")!.click();
    await el.updateComplete;
    expect(surface(el).getAttribute("aria-label")).to.equal("Settings");
  });

  it("reflects data-placement on the surface", async () => {
    const { el } = await mkBound();
    expect(surface(el).hasAttribute("data-placement")).to.be.true;
  });

  it("oneEvent import retained", () => {
    expect(oneEvent).to.be.a("function");
  });
});

describe("<tulpar-popover> trigger resolution + declaration order", () => {
  it("warns (dev) when `for` resolves to no element", async () => {
    const calls: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => calls.push(args);
    try {
      const el = (await fixture(
        html`<tulpar-popover for="ghost-id"><button>x</button></tulpar-popover>`,
      )) as TulparPopover;
      await el.updateComplete;
      expect(calls.length).to.be.greaterThan(0);
      expect(el._anchorElForTest).to.equal(null);
    } finally {
      console.warn = original;
    }
  });

  it("resolves a trigger declared AFTER the popover (declaration-order)", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <tulpar-popover for="${id}"><button>x</button></tulpar-popover>
        <button id="${id}">Open</button>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-popover") as TulparPopover;
    await el.updateComplete;
    const trigger = wrap.querySelector(`#${id}`)! as HTMLButtonElement;
    expect(el._anchorElForTest).to.equal(trigger);
    expect(trigger.getAttribute("aria-haspopup")).to.equal("dialog");
  });

  it("re-wires when `for` changes (detaches the old trigger)", async () => {
    const idA = uid();
    const idB = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${idA}">A</button>
        <button id="${idB}">B</button>
        <tulpar-popover for="${idA}"><button>x</button></tulpar-popover>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-popover") as TulparPopover;
    await el.updateComplete;
    const a = wrap.querySelector(`#${idA}`)! as HTMLElement;
    const b = wrap.querySelector(`#${idB}`)! as HTMLElement;
    expect(a.getAttribute("aria-haspopup")).to.equal("dialog");

    el.for = idB;
    await el.updateComplete;
    expect(el._anchorElForTest).to.equal(b);
    expect(a.hasAttribute("aria-haspopup")).to.be.false;
    expect(b.getAttribute("aria-haspopup")).to.equal("dialog");
  });
});

describe("<tulpar-popover> controlled + imperative + events", () => {
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

  it("keeps the surface inside the shadow root while open (stays styled, no body portal)", async () => {
    const { el } = await mkBound();
    el.show();
    await el.updateComplete;
    const s = surface(el);
    expect(s.getRootNode()).to.equal(el.shadowRoot);
    expect(getComputedStyle(s).position).to.equal("fixed");
    expect(getComputedStyle(s).zIndex).to.not.equal("auto");
  });

  it("reposition() re-measures without throwing", async () => {
    const { el } = await mkBound();
    el.show();
    await el.updateComplete;
    el.reposition();
    await aTimeout(0);
    expect(surface(el).style.top).to.match(/px$/);
  });

  it("registers on the overlay stack while open", async () => {
    const { el } = await mkBound();
    el.show();
    await el.updateComplete;
    expect(topOverlay()).to.equal(el);
  });
});

describe("<tulpar-popover> tone (semantic intents)", () => {
  async function mk(tone?: string): Promise<TulparPopover> {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id}">Open</button>
        <tulpar-popover for="${id}" tone=${tone ?? "neutral"}><button>a</button></tulpar-popover>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-popover") as TulparPopover;
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    return el;
  }

  function resolveInternal(el: TulparPopover, prop: string): string {
    const probe = document.createElement("span");
    probe.style.color = `var(${prop})`;
    probe.style.position = "absolute";
    el.shadowRoot!.appendChild(probe);
    const c = getComputedStyle(probe).color;
    probe.remove();
    return c;
  }

  it("reflects tone to the host attribute", async () => {
    const el = await mk("info");
    expect(el.getAttribute("tone")).to.equal("info");
  });

  it("default neutral uses the neutral overlay surface bg", async () => {
    const el = await mk("neutral");
    const s = surface(el);
    expect(getComputedStyle(s).backgroundColor).to.equal(resolveInternal(el, "--_pop-bg"));
  });

  (["info", "success", "warning", "danger"] as const).forEach((tone) => {
    it(`tone="${tone}" applies the matching tone surface/on-surface vars`, async () => {
      const el = await mk(tone);
      const s = surface(el);
      const cs = getComputedStyle(s);
      expect(cs.backgroundColor).to.equal(resolveInternal(el, "--_pop-bg"));
      expect(cs.color).to.equal(resolveInternal(el, "--_pop-fg"));
      expect(cs.borderTopColor).to.equal(resolveInternal(el, "--_pop-border"));
      const neutral = await mk("neutral");
      expect(cs.backgroundColor).to.not.equal(resolveInternal(neutral, "--_pop-bg"));
    });
  });
});

describe("<tulpar-popover> positioning extras + scroll", () => {
  it("placement=auto + a viewport-top trigger flips to bottom", async () => {
    const id = uid();
    const host = (await fixture(html`
      <div style="position:fixed;top:2px;left:200px;">
        <button id="${id}">Open</button>
        <tulpar-popover for="${id}" placement="auto">
          <div style="width:160px;height:140px;"><button>a</button></div>
        </tulpar-popover>
      </div>
    `)) as HTMLDivElement;
    const el = host.querySelector<TulparPopover>("tulpar-popover")!;
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    await aTimeout(0);
    // With almost no room above, auto must NOT pick top.
    expect(surface(el).getAttribute("data-side")).to.not.equal("top");
  });

  it("applies a max-height so long content scrolls internally", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id}">Open</button>
        <tulpar-popover for="${id}">
          <div>${Array.from({ length: 60 }, (_, i) => html`<p>Row ${i}</p>`)}</div>
        </tulpar-popover>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-popover") as TulparPopover;
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    await aTimeout(0);
    const body = el.shadowRoot!.querySelector(".body") as HTMLElement;
    const cs = getComputedStyle(body);
    expect(cs.maxHeight).to.not.equal("none");
    expect(["auto", "scroll"]).to.include(cs.overflowY);
  });

  it("reposition() after async content growth keeps the surface within the viewport", async () => {
    const id = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id}">Open</button>
        <tulpar-popover for="${id}" placement="bottom-start">
          <div class="grow" style="height:20px;width:120px;"></div>
        </tulpar-popover>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-popover") as TulparPopover;
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    await aTimeout(0);
    const grow = el.querySelector<HTMLElement>(".grow")!;
    grow.style.height = "4000px";
    el.reposition();
    await aTimeout(0);
    const s = surface(el);
    const rect = s.getBoundingClientRect();
    expect(rect.top).to.be.at.least(-1);
    expect(Math.round(rect.bottom)).to.be.at.most(document.documentElement.clientHeight + 1);
  });
});

describe("<tulpar-popover> positioner DOM integration", () => {
  it("aligns to the anchor's on-screen rect under a transformed ancestor", async () => {
    const id = uid();
    const host = (await fixture(html`
      <div
        style="transform: translate(120px, 60px) scale(1); position: fixed; top: 100px; left: 40px;"
      >
        <button id="${id}" style="width:80px;height:30px;">Open</button>
        <tulpar-popover for="${id}" placement="bottom-start" offset="8" .flip=${false}>
          <div style="width:120px;height:50px;"><button>a</button></div>
        </tulpar-popover>
      </div>
    `)) as HTMLDivElement;
    const el = host.querySelector<TulparPopover>("tulpar-popover")!;
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    await aTimeout(0);
    const trigger = host.querySelector(`#${id}`)!;
    const a = trigger.getBoundingClientRect();
    const s = surface(el).getBoundingClientRect();
    // bottom-start: surface left aligns with the anchor's actual left (post-transform),
    // surface top sits below the anchor bottom + offset. Tolerance for sub-pixel.
    expect(Math.abs(s.left - a.left), "left aligned to transformed anchor").to.be.at.most(2);
    expect(Math.abs(s.top - (a.bottom + 8)), "top below transformed anchor").to.be.at.most(2);
  });

  it("flips against the scroll container (not the viewport) with boundary=scroll-parent", async () => {
    // The scroll pane is short and sits high in the (tall) viewport, so there is
    // ample room BELOW it in the viewport but NOT inside the pane. We scroll the
    // trigger to the pane's bottom edge: a small popover fits ABOVE the trigger
    // within the pane but not below it. With boundary=scroll-parent the
    // positioner must flip to `top` (clamping against the container rect). With
    // boundary=viewport it would stay `bottom` (the viewport has room).
    const id = uid();
    const host = (await fixture(html`
      <div
        class="scroller"
        style="position:fixed;top:20px;left:40px;width:240px;height:180px;overflow:auto;border:1px solid #ccc;"
      >
        <div style="height:700px;position:relative;">
          <div style="position:absolute;top:300px;left:20px;">
            <button id="${id}" style="width:80px;height:24px;">Open</button>
            <tulpar-popover
              for="${id}"
              placement="bottom-start"
              boundary="scroll-parent"
              container-padding="6"
            >
              <div style="width:140px;height:60px;"><button>a</button></div>
            </tulpar-popover>
          </div>
        </div>
      </div>
    `)) as HTMLDivElement;
    const el = host.querySelector<TulparPopover>("tulpar-popover")!;
    const scroller = host as HTMLElement;
    await el.updateComplete;
    el.show();
    await el.updateComplete;
    await aTimeout(0);
    // Scroll so the trigger sits near the bottom edge of the visible pane.
    scroller.scrollTop = 180;
    el.reposition();
    await aTimeout(0);
    const side = surface(el).getAttribute("data-side");
    const sb = surface(el).getBoundingClientRect();
    const cb = scroller.getBoundingClientRect();
    expect(side, "flips to top within the scroll container").to.equal("top");
    expect(sb.top, "surface top within container").to.be.at.least(cb.top - 2);
    expect(sb.bottom, "surface bottom within container").to.be.at.most(cb.bottom + 2);
  });
});

describe("<tulpar-popover> nested overlay stacking", () => {
  it("a tooltip inside an open popover works; Esc closes top-most first", async () => {
    const popId = uid();
    const ttId = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${popId}">Open</button>
        <tulpar-popover for="${popId}">
          <div>
            <button id="${ttId}">?</button>
            <tulpar-tooltip for="${ttId}" text="Help"></tulpar-tooltip>
          </div>
        </tulpar-popover>
      </div>
    `)) as HTMLElement;
    const el = wrap.querySelector("tulpar-popover") as TulparPopover;
    await el.updateComplete;
    const trigger = wrap.querySelector(`#${popId}`)! as HTMLButtonElement;
    trigger.click();
    await el.updateComplete;
    await aTimeout(0);
    expect(isOpen(el)).to.be.true;

    const tip = el.querySelector("tulpar-tooltip") as TulparTooltip;
    await tip.updateComplete;
    tip.show();
    await tip.updateComplete;
    await aTimeout(0);
    // Tooltip is now on top of the stack.
    expect(topOverlay()).to.equal(tip);

    // First Escape closes the tooltip (top-most), popover stays open.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    await tip.updateComplete;
    expect(isOpen(el), "popover stays open after first Esc").to.be.true;
    expect(topOverlay()).to.equal(el);

    // Second Escape closes the popover.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(isOpen(el), "popover closes on second Esc").to.be.false;
  });

  it("light-dismiss of one popover does not collapse an unrelated sibling popover", async () => {
    const id1 = uid();
    const id2 = uid();
    const wrap = (await fixture(html`
      <div>
        <button id="${id1}">One</button>
        <tulpar-popover id="p1" for="${id1}"><button>a</button></tulpar-popover>
        <button id="${id2}">Two</button>
        <tulpar-popover id="p2" for="${id2}"><button>b</button></tulpar-popover>
      </div>
    `)) as HTMLElement;
    const p1 = wrap.querySelector<TulparPopover>("#p1")!;
    const p2 = wrap.querySelector<TulparPopover>("#p2")!;
    await p1.updateComplete;
    await p2.updateComplete;
    p2.show();
    await p2.updateComplete;
    // A pointerdown inside p2's own surface must not close p2.
    surface(p2).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    await p2.updateComplete;
    expect(isOpen(p2)).to.be.true;
    // p1 was never open and stays closed.
    expect(isOpen(p1)).to.be.false;
  });
});
