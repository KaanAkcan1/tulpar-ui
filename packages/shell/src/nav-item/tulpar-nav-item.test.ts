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

  it("dispatches cancelable tulpar-navigate and prevents native navigation when canceled", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/x" label="X"></tulpar-nav-item>`,
    );
    el.addEventListener("tulpar-navigate", (e) => e.preventDefault());
    const a = el.shadowRoot!.querySelector("a")!;
    let nativeEvent: MouseEvent | undefined;
    a.addEventListener("click", (e) => {
      nativeEvent = e as MouseEvent;
    });
    setTimeout(() => a.click());
    const ev = (await oneEvent(el, "tulpar-navigate")) as CustomEvent;
    expect(ev.cancelable).to.be.true;
    expect(ev.detail.href).to.equal("/x");
    expect(nativeEvent?.defaultPrevented).to.be.true;
  });

  it("does not prevent native navigation when tulpar-navigate is not canceled", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/x" label="X"></tulpar-nav-item>`,
    );
    const a = el.shadowRoot!.querySelector("a")!;
    let preventedByComponent: boolean | undefined;
    a.addEventListener("click", (e) => {
      preventedByComponent = e.defaultPrevented; // component's @click ran first (attached in render)
      e.preventDefault(); // stop the test runner from actually navigating
    });
    a.click();
    expect(preventedByComponent).to.be.false;
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
      html`<tulpar-nav-item
        href="/b"
        label="B"
        badge="3"
        icon-class="pi pi-home"
      ></tulpar-nav-item>`,
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

  it("disabled item is out of tab order and does not navigate", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/z" label="Z" disabled></tulpar-nav-item>`,
    );
    const a = el.shadowRoot!.querySelector("a")!;
    expect(a.getAttribute("tabindex")).to.equal("-1");
    let fired = false;
    el.addEventListener("tulpar-navigate", () => {
      fired = true;
    });
    // Prevent actual navigation so the test runner is not disrupted.
    // The component's _onClick returns early when disabled, so it will NOT
    // call preventDefault — we must stop real navigation ourselves here.
    a.addEventListener("click", (e) => e.preventDefault());
    a.click();
    await el.updateComplete;
    expect(fired).to.be.false;
  });

  it("renders a numeric count in the trailing area", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/i" label="Inbox" count="12"></tulpar-nav-item>`,
    );
    expect(el.shadowRoot!.querySelector(".count")!.textContent).to.equal("12");
  });
  it("renders a status dot with aria-label", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/i" label="Inbox" dot dot-label="3 unread"></tulpar-nav-item>`,
    );
    const dot = el.shadowRoot!.querySelector(".dot")!;
    expect(dot).to.exist;
    expect(dot.getAttribute("aria-label")).to.equal("3 unread");
  });
  it("adds rel=noopener and external glyph for target=_blank", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="https://x.dev" label="Docs" target="_blank"></tulpar-nav-item>`,
    );
    const a = el.shadowRoot!.querySelector("a")!;
    expect(a.getAttribute("rel")).to.contain("noopener");
    expect(el.shadowRoot!.querySelector(".external")).to.exist;
  });

  it("renders an inline SVG icon from the icon string prop", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item href="/x" label="X" icon='<svg class="probe"></svg>'></tulpar-nav-item>`,
    );
    expect(el.shadowRoot!.querySelector("svg.probe")).to.exist;
  });

  it("rail flyout uses fixed positioning to escape the clipped nav (B3)", async () => {
    const el = await fixture<TulparNavItem>(html`<tulpar-nav-item href="/x" label="Longish label"></tulpar-nav-item>`);
    el.setAttribute("data-rail", "");
    await el.updateComplete;
    const a = el.shadowRoot!.querySelector("a")!;
    a.dispatchEvent(new Event("pointerenter"));
    await el.updateComplete;
    const fly = el.shadowRoot!.querySelector(".rail-flyout") as HTMLElement;
    expect(fly).to.exist;
    expect(getComputedStyle(fly).position).to.equal("fixed");
  });
});
