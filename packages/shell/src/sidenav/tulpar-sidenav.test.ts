import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-sidenav";
import "../nav-item/tulpar-nav-item";
import type { TulparSidenav } from "./tulpar-sidenav";

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
});
