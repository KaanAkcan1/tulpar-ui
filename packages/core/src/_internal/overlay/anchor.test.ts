import { expect, fixture, html } from "@open-wc/testing";
import { resolveAnchor, warnIfBadTrigger, supportsPopover, supportsCssAnchor } from "./anchor";
import { linkDescribedBy, unlinkDescribedBy, setHasPopup, clearHasPopup, makeLiveRegion } from "./aria";

describe("resolveAnchor", () => {
  it("prefers the focusable element slotted into [slot=trigger]", async () => {
    const host = (await fixture(html`
      <div>
        <button slot="trigger" id="slotted">Trigger</button>
      </div>
    `)) as HTMLElement & { anchor?: string };
    // also set an anchor id that should be ignored when a slotted trigger exists
    const external = document.createElement("button");
    external.id = "external-anchor";
    document.body.appendChild(external);
    host.anchor = "external-anchor";

    const resolved = resolveAnchor(host);
    expect(resolved).to.equal(host.querySelector("#slotted"));

    external.remove();
  });

  it("falls back to document.getElementById(host.anchor)", async () => {
    const host = (await fixture(html`<div></div>`)) as HTMLElement & { anchor?: string };
    const external = document.createElement("button");
    external.id = "my-anchor";
    document.body.appendChild(external);
    host.anchor = "my-anchor";

    expect(resolveAnchor(host)).to.equal(external);
    external.remove();
  });

  it("returns null when neither a slotted trigger nor anchor id resolves", async () => {
    const host = (await fixture(html`<div></div>`)) as HTMLElement & { anchor?: string };
    expect(resolveAnchor(host)).to.equal(null);
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
