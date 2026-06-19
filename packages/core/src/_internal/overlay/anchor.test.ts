import { expect, fixture, html } from "@open-wc/testing";
import {
  resolveAnchor,
  warnIfBadTrigger,
  warnIfUnresolvedFor,
  supportsPopover,
  supportsCssAnchor,
} from "./anchor";
import { linkDescribedBy, unlinkDescribedBy, setHasPopup, clearHasPopup, makeLiveRegion } from "./aria";

describe("resolveAnchor", () => {
  it("resolves the trigger from the host's `for` attribute via getElementById", async () => {
    const wrap = (await fixture(html`
      <div>
        <button id="my-trigger">Trigger</button>
        <div for="my-trigger"></div>
      </div>
    `)) as HTMLElement;
    const host = wrap.querySelector("div[for]") as HTMLElement & { for?: string };
    expect(resolveAnchor(host)).to.equal(wrap.querySelector("#my-trigger"));
  });

  it("prefers the host's `for` property over the attribute", async () => {
    const wrap = (await fixture(html`
      <div>
        <button id="prop-trigger">Trigger</button>
        <div for="attr-trigger"></div>
      </div>
    `)) as HTMLElement;
    const host = wrap.querySelector("div[for]") as HTMLElement & { for?: string };
    // No #attr-trigger exists; the property points at the real one.
    host.for = "prop-trigger";
    expect(resolveAnchor(host)).to.equal(wrap.querySelector("#prop-trigger"));
  });

  it("returns null when `for` is unset", async () => {
    const host = (await fixture(html`<div></div>`)) as HTMLElement & { for?: string };
    expect(resolveAnchor(host)).to.equal(null);
  });

  it("returns null when `for` points at a non-existent id", async () => {
    const host = (await fixture(html`<div for="nope"></div>`)) as HTMLElement & { for?: string };
    expect(resolveAnchor(host)).to.equal(null);
  });

  it("resolves against the host's ownerDocument (fixture-scoped)", async () => {
    const wrap = (await fixture(html`
      <div>
        <button id="owner-doc-trigger">Trigger</button>
        <div for="owner-doc-trigger"></div>
      </div>
    `)) as HTMLElement;
    const host = wrap.querySelector("div[for]") as HTMLElement & { for?: string };
    expect(host.ownerDocument).to.equal(document);
    expect(resolveAnchor(host)).to.equal(wrap.querySelector("#owner-doc-trigger"));
  });

  it("resolves a sibling trigger inside the same shadow root (not the document)", async () => {
    // for-id wiring must work when the overlay host and its trigger are siblings
    // inside a shadow root (e.g. <tulpar-button> delegating its `tooltip` to a
    // shadow-sibling <tulpar-tooltip>). document.getElementById cannot see into
    // a shadow root, so resolution is scoped to the host's containing root.
    const wrap = (await fixture(html`<div></div>`)) as HTMLElement;
    const root = wrap.attachShadow({ mode: "open" });
    root.innerHTML = `
      <button id="shadow-trigger">Trigger</button>
      <div for="shadow-trigger"></div>
    `;
    const host = root.querySelector("div[for]") as HTMLElement & { for?: string };
    const trigger = root.querySelector("#shadow-trigger");
    // Not reachable from the document — proves we're not falling back to it.
    expect(document.getElementById("shadow-trigger")).to.equal(null);
    expect(resolveAnchor(host)).to.equal(trigger);
  });
});

describe("warnIfBadTrigger", () => {
  let calls: unknown[][];
  let original: typeof console.warn;
  beforeEach(() => {
    calls = [];
    original = console.warn;
    console.warn = (...args: unknown[]) => {
      calls.push(args);
    };
  });
  afterEach(() => {
    console.warn = original;
  });

  it("warns for a non-focusable trigger", () => {
    const span = document.createElement("span");
    warnIfBadTrigger(span);
    expect(calls.length).to.equal(1);
  });

  it("warns for a disabled trigger (tooltip-on-disabled trap)", () => {
    const btn = document.createElement("button");
    btn.setAttribute("disabled", "");
    warnIfBadTrigger(btn);
    expect(calls.length).to.equal(1);
  });

  it("does not warn for a focusable, enabled trigger", () => {
    const btn = document.createElement("button");
    warnIfBadTrigger(btn);
    expect(calls.length).to.equal(0);
  });

  it("does not warn for null", () => {
    warnIfBadTrigger(null);
    expect(calls.length).to.equal(0);
  });
});

describe("warnIfUnresolvedFor", () => {
  let calls: unknown[][];
  let original: typeof console.warn;
  beforeEach(() => {
    calls = [];
    original = console.warn;
    console.warn = (...args: unknown[]) => {
      calls.push(args);
    };
  });
  afterEach(() => {
    console.warn = original;
  });

  it("warns when `for` is set but resolves to no element", async () => {
    const host = (await fixture(html`<div for="ghost"></div>`)) as HTMLElement & { for?: string };
    warnIfUnresolvedFor(host, null);
    expect(calls.length).to.equal(1);
  });

  it("does not warn when `for` resolves to an element", async () => {
    const wrap = (await fixture(html`
      <div>
        <button id="real">x</button>
        <div for="real"></div>
      </div>
    `)) as HTMLElement;
    const host = wrap.querySelector("div[for]") as HTMLElement & { for?: string };
    warnIfUnresolvedFor(host, wrap.querySelector("#real") as HTMLElement);
    expect(calls.length).to.equal(0);
  });

  it("does not warn when `for` is unset (no trigger requested)", async () => {
    const host = (await fixture(html`<div></div>`)) as HTMLElement & { for?: string };
    warnIfUnresolvedFor(host, null);
    expect(calls.length).to.equal(0);
  });
});

describe("capability probes", () => {
  it("supportsPopover returns a boolean", () => {
    expect(typeof supportsPopover()).to.equal("boolean");
  });
  it("supportsCssAnchor returns a boolean", () => {
    expect(typeof supportsCssAnchor()).to.equal("boolean");
  });
});

describe("aria helpers", () => {
  it("linkDescribedBy sets the attribute and unlink clears it", () => {
    const trigger = document.createElement("button");
    const surface = document.createElement("div");
    linkDescribedBy(trigger, surface);
    const id = surface.id;
    expect(id).to.not.equal("");
    expect(trigger.getAttribute("aria-describedby")).to.equal(id);

    unlinkDescribedBy(trigger, surface);
    expect(trigger.hasAttribute("aria-describedby")).to.equal(false);
  });

  it("linkDescribedBy preserves pre-existing describedby tokens", () => {
    const trigger = document.createElement("button");
    trigger.setAttribute("aria-describedby", "pre-existing");
    const surface = document.createElement("div");
    linkDescribedBy(trigger, surface);
    const tokens = trigger.getAttribute("aria-describedby")!.split(/\s+/);
    expect(tokens).to.include("pre-existing");
    expect(tokens).to.include(surface.id);

    unlinkDescribedBy(trigger, surface);
    expect(trigger.getAttribute("aria-describedby")).to.equal("pre-existing");
  });

  it("linkDescribedBy is idempotent", () => {
    const trigger = document.createElement("button");
    const surface = document.createElement("div");
    linkDescribedBy(trigger, surface);
    linkDescribedBy(trigger, surface);
    const tokens = trigger.getAttribute("aria-describedby")!.split(/\s+/);
    expect(tokens.filter((t) => t === surface.id).length).to.equal(1);
  });

  it("setHasPopup / clearHasPopup manage aria-haspopup", () => {
    const trigger = document.createElement("button");
    setHasPopup(trigger, "menu");
    expect(trigger.getAttribute("aria-haspopup")).to.equal("menu");
    clearHasPopup(trigger);
    expect(trigger.hasAttribute("aria-haspopup")).to.equal(false);
  });

  it("makeLiveRegion returns a polite live region", () => {
    const region = makeLiveRegion();
    expect(region.getAttribute("aria-live")).to.equal("polite");
  });
});
