import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "./tulpar-nav-item";
import type { TulparNavItem } from "./tulpar-nav-item";

describe("<tulpar-nav-item>", () => {
  it("renders a real anchor with href", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/home" label="Home"></tulpar-nav-item>`,
    );
    const a = el.shadowRoot!.querySelector("a")!;
    expect(a).to.exist;
    expect(a.getAttribute("href")).to.equal("/home");
    expect(a.textContent).to.include("Home");
  });

  it("dispatches cancelable tulpar-navigate on click and cancels default when prevented", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/x" label="X"></tulpar-nav-item>`,
    );
    el.addEventListener("tulpar-navigate", (e) => e.preventDefault());
    const a = el.shadowRoot!.querySelector("a")!;
    setTimeout(() => a.click());
    const ev = (await oneEvent(el, "tulpar-navigate")) as CustomEvent;
    expect(ev.cancelable).to.be.true;
    expect(ev.detail.href).to.equal("/x");
  });

  it("sets aria-current=page when active", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/y" label="Y" active></tulpar-nav-item>`,
    );
    expect(el.shadowRoot!.querySelector("a")!.getAttribute("aria-current")).to.equal("page");
  });

  it("auto-activates from current URL pathname", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="${location.pathname}" label="here"></tulpar-nav-item>`,
    );
    expect(el.shadowRoot!.querySelector("a")!.getAttribute("aria-current")).to.equal("page");
  });

  it("renders badge and iconClass", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/b" label="B" badge="3" icon-class="pi pi-home"></tulpar-nav-item>`,
    );
    expect(el.shadowRoot!.querySelector(".badge")!.textContent).to.equal("3");
    expect(el.shadowRoot!.querySelector("i.pi.pi-home")).to.exist;
  });

  it("acts as a collapsible group when it has child nav items", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group">
        <tulpar-nav-item href="/child" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn).to.exist;
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    btn.click();
    await el.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
  });
});
