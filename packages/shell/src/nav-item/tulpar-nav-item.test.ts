import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "./tulpar-nav-item";
import "../sidenav/tulpar-sidenav";
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

  it("group item label aligns and fills identically to a leaf item with a trailing chip", async () => {
    const leaf = await fixture<TulparNavItem>(html`
      <tulpar-nav-item href="/a" label="Alpha" icon="<svg width='18' height='18'></svg>" count="3"></tulpar-nav-item>
    `);
    const group = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg width='18' height='18'></svg>">
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await leaf.updateComplete;
    await group.updateComplete;
    const leafLabel = leaf.shadowRoot!.querySelector(".label") as HTMLElement;
    const groupLabel = group.shadowRoot!.querySelector(".label") as HTMLElement;
    // Same left offset (icon + gap), AND the group label is not gap-collapsed:
    expect(Math.abs(groupLabel.getBoundingClientRect().left - leafLabel.getBoundingClientRect().left))
      .to.be.lessThan(1);
    // The group chevron must sit flush at the trailing edge — assert the label fills to it.
    const groupRow = group.shadowRoot!.querySelector("a, button") as HTMLElement;
    const chevron = group.shadowRoot!.querySelector(".chevron") as HTMLElement;
    const rowRight = groupRow.getBoundingClientRect().right;
    // chevron right edge should be within the row's right padding (~0.75rem ≈ 12px), i.e.
    // the chevron is NOT pushed away from the trailing edge by a competing auto-margin.
    expect(rowRight - chevron.getBoundingClientRect().right).to.be.lessThan(16);
  });

  it("detects children nested inside a display:contents wrapper (Angular wrapper case)", async () => {
    // Simulate the Angular wrapper: a non-nav element wrapping a real nav-item.
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group">
        <div style="display: contents">
          <tulpar-nav-item href="/child" label="Child"></tulpar-nav-item>
        </div>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    // A group with children renders a <button> exposing aria-expanded and a chevron.
    const btn = el.shadowRoot!.querySelector("button");
    expect(btn, "group renders as a button").to.exist;
    expect(btn!.getAttribute("aria-expanded")).to.equal("false");
    expect(el.shadowRoot!.querySelector(".chevron"), "chevron shown").to.exist;
  });

  it("rail flyout on right-side sidenav is positioned to the LEFT of the item (B3-right)", async () => {
    // Wrap the nav-item inside a position="right" sidenav so that
    // closest("tulpar-sidenav")?.getAttribute("position") resolves to "right".
    // We use a slotted item in light DOM so closest() can traverse the DOM tree.
    const sidenav = await fixture<HTMLElement>(html`
      <tulpar-sidenav position="right" data-rail style="position:fixed;right:0;top:0;width:60px;">
        <tulpar-nav-item href="/x" label="Longish label" data-rail></tulpar-nav-item>
      </tulpar-sidenav>
    `);
    await sidenav.updateComplete;
    const navItem = sidenav.querySelector<TulparNavItem>("tulpar-nav-item")!;
    await navItem.updateComplete;

    // Trigger the flyout via pointerenter on the anchor inside shadow DOM.
    const a = navItem.shadowRoot!.querySelector("a")!;
    a.dispatchEvent(new Event("pointerenter"));
    await navItem.updateComplete;

    const fly = navItem.shadowRoot!.querySelector(".rail-flyout") as HTMLElement;
    expect(fly).to.exist;

    // The flyout should appear to the LEFT of the item.
    // When rightSide=true, the component sets `right` (CSS) = window.innerWidth - rect.left + gap,
    // which means the flyout's right edge is flush with (or near) the item's left edge.
    // Verify: the inline style has a `right` value set (not `left`).
    expect(fly.style.right).to.not.equal("");
    expect(fly.style.left).to.equal("");
  });
});
