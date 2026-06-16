import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "./tulpar-sidenav";
import "../nav-item/tulpar-nav-item";
import type { TulparSidenav } from "./tulpar-sidenav";
import type { TulparNavItem } from "../nav-item/tulpar-nav-item";

describe("<tulpar-sidenav>", () => {
  it("renders a nav landmark with aria-label", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    const nav = el.shadowRoot!.querySelector("nav")!;
    expect(nav).to.exist;
    expect(nav.getAttribute("aria-label")).to.be.a("string").and.not.empty;
  });

  it("renders items from JSON data", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    el.items = [
      { label: "Home", href: "/", iconClass: "pi pi-home" },
      { label: "HR", items: [{ label: "Staff", href: "/hr/staff", badge: "3" }] },
    ];
    await el.updateComplete;
    const rendered = el.shadowRoot!.querySelectorAll("tulpar-nav-item");
    expect(rendered.length).to.equal(3); // Home, HR (group), Staff (nested)
  });

  it("slotted items and JSON items can coexist", async () => {
    const el = await fixture<TulparSidenav>(html`
      <tulpar-sidenav><tulpar-nav-item href="/s" label="Slotted"></tulpar-nav-item></tulpar-sidenav>
    `);
    el.items = [{ label: "Json", href: "/j" }];
    await el.updateComplete;
    expect(el.querySelector("tulpar-nav-item")).to.exist; // slot
    expect(el.shadowRoot!.querySelector("tulpar-nav-item")).to.exist; // json
  });

  it("supports header and footer slots", async () => {
    const el = await fixture<TulparSidenav>(html`
      <tulpar-sidenav>
        <div slot="header" id="h">H</div>
        <div slot="footer" id="f">F</div>
      </tulpar-sidenav>
    `);
    const slots = el.shadowRoot!.querySelectorAll("slot[name]");
    expect([...slots].map((s) => s.getAttribute("name"))).to.include.members(["header", "footer"]);
  });

  it("renders a section node from items data", async () => {
    const el = await fixture<TulparSidenav>(html`
      <tulpar-sidenav
        .items=${[
          { type: "section", label: "Components", items: [{ label: "Button", href: "/button" }] },
        ]}
      ></tulpar-sidenav>
    `);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector("tulpar-nav-section")).to.exist;
  });

  it("reflects position and density attributes", async () => {
    const el = await fixture<TulparSidenav>(
      html`<tulpar-sidenav position="right" density="compact"></tulpar-sidenav>`,
    );
    expect(el.getAttribute("position")).to.equal("right");
    expect(el.getAttribute("density")).to.equal("compact");
  });

  it("exposes utility-start, utility-end, search and footer slots", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    const names = [...el.shadowRoot!.querySelectorAll("slot")].map((s) => s.name);
    expect(names).to.include.members(["search", "header-actions", "utility-start", "utility-end", "footer"]);
  });

  it("moves focus between items with ArrowDown/ArrowUp", async () => {
    const el = await fixture<TulparSidenav>(html`
      <tulpar-sidenav>
        <tulpar-nav-item href="/a" label="A"></tulpar-nav-item>
        <tulpar-nav-item href="/b" label="B"></tulpar-nav-item>
      </tulpar-sidenav>
    `);
    const items = el.querySelectorAll("tulpar-nav-item");

    // Bug 1 fix: await child render before accessing shadow DOM
    await items[0].updateComplete;
    const firstAnchor = items[0].shadowRoot!.querySelector("a")!;
    expect(firstAnchor).to.exist;
    firstAnchor.focus();

    // Bug 2 fix: dispatch on the shadow <nav>, not on the host
    // (the @keydown handler is bound to the shadow <nav>)
    const nav = el.shadowRoot!.querySelector("nav")!;
    nav.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await el.updateComplete;
    expect(document.activeElement).to.equal(items[1]);

    // ArrowUp: move focus back to items[0]
    nav.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    await el.updateComplete;
    expect(document.activeElement).to.equal(items[0]);
  });

  it("rail nav does not produce horizontal overflow", async () => {
    const el = await fixture<TulparSidenav>(html`
      <tulpar-sidenav data-rail>
        <tulpar-nav-item href="/averylonglabelthatwouldoverflow" label="A very long label that would overflow"></tulpar-nav-item>
      </tulpar-sidenav>
    `);
    await el.updateComplete;
    const nav = el.shadowRoot!.querySelector("nav")!;
    // Assert that the CSS rule is declared on the nav element.
    // overflow-x:clip is set via inline stylesheet in the shadow root.
    // getComputedStyle may resolve "clip" as "hidden" in some engines — check both.
    const overflowX = getComputedStyle(nav).overflowX;
    expect(overflowX === "clip" || overflowX === "hidden").to.be.true;
  });

  it("Home/End move focus to first/last item", async () => {
    const el = await fixture<TulparSidenav>(html`
      <tulpar-sidenav>
        <tulpar-nav-item href="/a" label="A"></tulpar-nav-item>
        <tulpar-nav-item href="/b" label="B"></tulpar-nav-item>
        <tulpar-nav-item href="/c" label="C"></tulpar-nav-item>
      </tulpar-sidenav>
    `);
    const items = el.querySelectorAll("tulpar-nav-item");
    (items[1] as HTMLElement).focus();
    const nav = el.shadowRoot!.querySelector("nav")!;
    nav.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(items[2].contains(document.activeElement)).to.be.true;
    nav.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    expect(items[0].contains(document.activeElement)).to.be.true;
  });

  it("single-expand collapses sibling groups when one opens", async () => {
    const el = await fixture<TulparSidenav>(html`
      <tulpar-sidenav single-expand>
        <tulpar-nav-item label="G1"><tulpar-nav-item href="/1" label="c1"></tulpar-nav-item></tulpar-nav-item>
        <tulpar-nav-item label="G2"><tulpar-nav-item href="/2" label="c2"></tulpar-nav-item></tulpar-nav-item>
      </tulpar-sidenav>
    `);
    // Use direct children only so we get G1 and G2, not the nested c1/c2
    const [g1, g2] = [...el.children].filter(
      (c) => c.tagName.toLowerCase() === "tulpar-nav-item",
    ) as TulparNavItem[];
    g1.expand();
    g2.expand();
    await el.updateComplete;
    expect(g1.shadowRoot!.querySelector("button")!.getAttribute("aria-expanded")).to.equal("false");
  });

  // ── Chunk 3: built-in toggle + brand + aria state-sync ──────────────────────

  it("renders a built-in toggle button that emits tulpar-menu-toggle", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    const btn = el.shadowRoot!.querySelector(".sidenav-toggle") as HTMLButtonElement;
    expect(btn).to.exist;
    setTimeout(() => btn.click());
    expect(await oneEvent(el, "tulpar-menu-toggle")).to.exist;
  });

  it("toggle button reflects aria-expanded from data-collapsed (initial)", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav data-collapsed></tulpar-sidenav>`);
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")!.getAttribute("aria-expanded")).to.equal("false");
  });

  it("toggle aria-expanded updates live when data-collapsed mutates (MutationObserver)", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")!.getAttribute("aria-expanded")).to.equal("true");
    el.toggleAttribute("data-collapsed", true);
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")!.getAttribute("aria-expanded")).to.equal("false");
  });

  it("does not render built-in toggle/brand when slot=header is provided", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav><div slot="header">custom</div></tulpar-sidenav>`);
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")).to.be.null;
  });

  // ── Chunk 3: rail header collapse (B1) ──────────────────────────────────────

  it("rail collapses header to the toggle button only (B1)", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav data-rail></tulpar-sidenav>`);
    const brand = el.shadowRoot!.querySelector(".brand") as HTMLElement;
    expect(getComputedStyle(brand).display).to.equal("none");
    expect(el.shadowRoot!.querySelector(".sidenav-toggle")).to.exist;
  });

  // ── Chunk 4: built-in utility row (theme toggle + config) ───────────────────

  it("renders mode-selection by default and emits tulpar-theme-toggle", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    const btn = el.shadowRoot!.querySelector(".util-theme") as HTMLButtonElement;
    expect(btn).to.exist;
    setTimeout(() => btn.click());
    expect(await oneEvent(el, "tulpar-theme-toggle")).to.exist;
  });
  it("hides mode-selection when showModeSelection is false", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    el.showModeSelection = false; await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".util-theme")).to.be.null;
  });
  it("renders config button with config-text when showConfig and emits tulpar-config-click", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    el.showConfig = true; el.configText = "Tweak"; await el.updateComplete;
    const c = el.shadowRoot!.querySelector(".util-config") as HTMLButtonElement;
    expect(c).to.exist;
    expect(c.textContent).to.contain("Tweak");
    setTimeout(() => c.click());
    expect(await oneEvent(el, "tulpar-config-click")).to.exist;
  });
  it("omits the utility region entirely when both are off", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav></tulpar-sidenav>`);
    el.showModeSelection = false; el.showConfig = false; await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".utility")).to.be.null;
  });

  // ── Chunk 4: rail utility icon-only (B2) ─────────────────────────────────

  it("rail makes theme toggle icon-only and hides config (B2)", async () => {
    const el = await fixture<TulparSidenav>(html`<tulpar-sidenav data-rail></tulpar-sidenav>`);
    el.showConfig = true; await el.updateComplete;
    const text = el.shadowRoot!.querySelector(".util-theme .util-text") as HTMLElement;
    expect(getComputedStyle(text).display).to.equal("none");
    expect(getComputedStyle(el.shadowRoot!.querySelector(".util-config") as HTMLElement).display).to.equal("none");
  });
});
