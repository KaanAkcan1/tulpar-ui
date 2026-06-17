import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "./tulpar-nav-item";
import "../sidenav/tulpar-sidenav";
import type { TulparNavItem } from "./tulpar-nav-item";
import type { TulparSidenav } from "../sidenav/tulpar-sidenav";

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
    // Bypass intent timer — test is about positioning, not timing.
    (el as unknown as { _showRailFlyout(): void })._showRailFlyout();
    await el.updateComplete;
    const fly = el.shadowRoot!.querySelector(".rail-flyout") as HTMLElement;
    expect(fly).to.exist;
    expect(getComputedStyle(fly).position).to.equal("fixed");
  });

  it("group item label aligns and fills identically to a leaf item with a trailing chip (A1)", async () => {
    const group = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg width='18' height='18'></svg>">
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await group.updateComplete;

    // The CSS invariant: label is the SOLE flex-grow source; the chevron must NOT have
    // a competing auto-margin or grow/shrink (which was the A1 bug).
    //
    // Note: getComputedStyle().marginInlineStart resolves `auto` to a pixel value in
    // real Chromium (WTR), so we cannot detect `margin-inline-start: auto` that way.
    // Instead we assert flexShrink, which is set to "0" by `flex: none` in the fix
    // (default is "1") — this cleanly distinguishes the fixed state from the bug.
    const chevronStyle = getComputedStyle(group.shadowRoot!.querySelector(".chevron") as HTMLElement);
    expect(chevronStyle.flexGrow, "chevron does not grow").to.equal("0");
    expect(chevronStyle.flexShrink, "chevron does not shrink (flex:none applied)").to.equal("0");

    const labelStyle = getComputedStyle(group.shadowRoot!.querySelector(".label") as HTMLElement);
    expect(labelStyle.flexGrow, "label is the sole flex grow source").to.equal("1");
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

  it("requests an update when data-rail is toggled at runtime", async () => {
    const el = await fixture<TulparNavItem>(
      html`<tulpar-nav-item label="Group" icon="<svg></svg>"></tulpar-nav-item>`,
    );
    await el.updateComplete;
    el.toggleAttribute("data-rail", true);
    // If data-rail is observed, a new update is pending → hasUpdated stays true and the
    // returned promise resolves on the next render. Spy via isUpdatePending.
    expect((el as unknown as { isUpdatePending: boolean }).isUpdatePending).to.be.true;
    await el.updateComplete;
  });

  it("rail mode hides inline children without mutating expanded state", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>">
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    el.expand();
    await el.updateComplete;
    const childGroup = el.shadowRoot!.querySelector(".children") as HTMLElement;
    expect(getComputedStyle(childGroup).display).to.not.equal("none"); // expanded, visible

    // Enter rail: inline children hidden, but state preserved
    el.toggleAttribute("data-rail", true);
    await el.updateComplete;
    expect(getComputedStyle(childGroup).display).to.equal("none");

    // Leave rail: inline children restored (state was never mutated)
    el.toggleAttribute("data-rail", false);
    await el.updateComplete;
    expect(getComputedStyle(childGroup).display).to.not.equal("none");
  });

  it("group trigger exposes disclosure ARIA in rail mode", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>" data-rail>
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector("button")!;
    expect(trigger.getAttribute("aria-haspopup")).to.equal("true");
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
    expect(trigger.getAttribute("aria-controls")).to.be.a("string").and.not.empty;
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    await el.updateComplete;
    expect(trigger.getAttribute("aria-expanded")).to.equal("true");
  });

  it("rail ArrowRight opens the flyout without mutating inline expanded state (B2)", async () => {
    // The sidenav's own arrow handler calls expand(); the nav-item must
    // stopPropagation in rail so inline _expanded is never flipped — otherwise
    // leaving rail would reveal a group that wasn't expanded before.
    const el = await fixture<TulparSidenav>(html`
      <tulpar-sidenav data-rail>
        <tulpar-nav-item label="Group" icon="<svg></svg>">
          <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
        </tulpar-nav-item>
      </tulpar-sidenav>
    `);
    await el.updateComplete;
    const group = el.querySelector("tulpar-nav-item") as TulparNavItem;
    await group.updateComplete;
    group.shadowRoot!.querySelector<HTMLElement>("button")!.focus();
    group.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    await group.updateComplete;
    // Flyout opened (rail aria-expanded true), but leaving rail must show the
    // group still collapsed — inline _expanded was never mutated.
    group.removeAttribute("data-rail");
    el.removeAttribute("data-rail");
    await group.updateComplete;
    expect(group.shadowRoot!.querySelector("button")!.getAttribute("aria-expanded")).to.equal(
      "false",
    );
  });

  it("Escape closes the flyout and the flyout id matches aria-controls", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>" data-rail>
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    (el as unknown as { _showRailFlyout(): void })._showRailFlyout();
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector("button")!;
    const flyout = el.shadowRoot!.querySelector(".rail-flyout.is-group")!;
    expect(flyout.id).to.equal(trigger.getAttribute("aria-controls"));
    el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await el.updateComplete;
    expect((flyout as HTMLElement).style.display).to.equal("none");
  });

  it("opens the rail flyout after a hover-intent delay, closes after a grace delay", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>" data-rail
        data-open-delay="10" data-close-delay="20">
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector("a, button") as HTMLElement;
    const isOpen = () => {
      const f = el.shadowRoot!.querySelector(".rail-flyout") as HTMLElement;
      return f && f.style.display !== "none";
    };
    trigger.dispatchEvent(new PointerEvent("pointerenter"));
    expect(isOpen(), "not open immediately on hover").to.be.false;
    await new Promise((r) => setTimeout(r, 60)); // 6× open delay
    expect(isOpen(), "open after intent delay").to.be.true;
    trigger.dispatchEvent(new PointerEvent("pointerleave"));
    expect(isOpen(), "still open during grace").to.be.true;
    await new Promise((r) => setTimeout(r, 80)); // 4× close delay
    expect(isOpen(), "closed after grace").to.be.false;
  });

  it("opens the rail flyout immediately on focus", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>" data-rail>
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector("a, button") as HTMLElement;
    trigger.dispatchEvent(new FocusEvent("focusin"));
    await el.updateComplete;
    const f = el.shadowRoot!.querySelector(".rail-flyout") as HTMLElement;
    expect(f.style.display).to.not.equal("none");
  });

  it("click pins the flyout open (does not navigate the group)", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>" data-rail>
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector("button") as HTMLElement;
    trigger.click();
    await el.updateComplete;
    const f = el.shadowRoot!.querySelector(".rail-flyout") as HTMLElement;
    expect(f.style.display).to.not.equal("none");
    // leaving does NOT close a pinned flyout
    trigger.dispatchEvent(new PointerEvent("pointerleave"));
    await new Promise((r) => setTimeout(r, 280));
    expect(f.style.display).to.not.equal("none");
  });

  it("pins the caret Y to the trigger icon center", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>" data-rail>
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    // Show the flyout via the public hover entry (simulate pointerenter on the anchor)
    const trigger = el.shadowRoot!.querySelector("a, button") as HTMLElement;
    trigger.dispatchEvent(new PointerEvent("pointerenter"));
    // open immediately for the test (intent timer covered separately) — call internal show
    (el as unknown as { _showRailFlyout(): void })._showRailFlyout();
    await el.updateComplete;
    const flyout = el.shadowRoot!.querySelector(".rail-flyout.is-group") as HTMLElement;
    expect(flyout.style.getPropertyValue("--flyout-caret-y")).to.match(/\d+px/);
    // Position is bound as a plain CSS string (not the styleMap directive) so the
    // component never trips the cross-lit-instance "currentDirective._$initialize"
    // crash in consumer bundlers that don't dedupe lit-html.
    expect(flyout.getAttribute("style")).to.be.a("string").and.contain("position:fixed");
  });

  it("rail group shows a flyout panel with header + child links", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Form Inputs" icon="<svg></svg>" data-rail>
        <tulpar-nav-item href="/text" label="TextInput"></tulpar-nav-item>
        <tulpar-nav-item href="/area" label="Textarea"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    const flyout = el.shadowRoot!.querySelector(".rail-flyout")!;
    expect(flyout.classList.contains("is-group"), "group variant").to.be.true;
    expect(flyout.querySelector(".flyout-header")!.textContent).to.include("Form Inputs");
    const links = flyout.querySelectorAll(".flyout-link");
    expect(links.length).to.equal(2);
    expect((links[0] as HTMLAnchorElement).getAttribute("href")).to.equal("/text");
  });

  it("rail flyout injects child + group icons (imperatively, no directive)", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg id='g'></svg>" data-rail>
        <tulpar-nav-item href="/c1" label="C1" icon="<svg id='c1'></svg>"></tulpar-nav-item>
        <tulpar-nav-item href="/c2" label="C2" icon="<svg id='c2'></svg>"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    (el as unknown as { _showRailFlyout(): void })._showRailFlyout(); // visible → icons inject
    await el.updateComplete;
    const root = el.shadowRoot!;
    expect(root.querySelector(".flyout-header-icon svg#g"), "group icon injected").to.exist;
    const icons = root.querySelectorAll(".flyout-link-icon");
    expect(icons[0].querySelector("svg#c1"), "child 1 icon").to.exist;
    expect(icons[1].querySelector("svg#c2"), "child 2 icon").to.exist;
  });

  it("rail flyout stays open while the pointer is over it (hoverable, WCAG 1.4.13)", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>" data-rail
        data-open-delay="10" data-close-delay="20">
        <tulpar-nav-item href="/c" label="Child"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector("button") as HTMLElement;
    const isOpen = () => {
      const f = el.shadowRoot!.querySelector(".rail-flyout") as HTMLElement;
      return f && f.style.display !== "none";
    };
    // Open via hover intent.
    trigger.dispatchEvent(new PointerEvent("pointerenter"));
    await new Promise((r) => setTimeout(r, 60));
    expect(isOpen(), "open after intent").to.be.true;
    // Leaving the trigger arms the close timer...
    trigger.dispatchEvent(new PointerEvent("pointerleave"));
    // ...but entering the flyout cancels it (hoverable).
    const flyout = el.shadowRoot!.querySelector(".rail-flyout.is-group") as HTMLElement;
    flyout.dispatchEvent(new PointerEvent("pointerenter"));
    await new Promise((r) => setTimeout(r, 80)); // > close delay
    expect(isOpen(), "stays open while hovered").to.be.true;
    // Leaving the flyout finally closes it.
    flyout.dispatchEvent(new PointerEvent("pointerleave"));
    await new Promise((r) => setTimeout(r, 80));
    expect(isOpen(), "closes after leaving the flyout").to.be.false;
  });

  it("rail flyout child link auto-activates from current URL pathname", async () => {
    const el = await fixture<TulparNavItem>(html`
      <tulpar-nav-item label="Group" icon="<svg></svg>" data-rail>
        <tulpar-nav-item href="/other" label="Other"></tulpar-nav-item>
        <tulpar-nav-item href="${location.pathname}" label="Here"></tulpar-nav-item>
      </tulpar-nav-item>
    `);
    await el.updateComplete;
    // Open the flyout so the model is rebuilt against the live route.
    (el as unknown as { _showRailFlyout(): void })._showRailFlyout();
    await el.updateComplete;
    const links = el.shadowRoot!.querySelectorAll(".flyout-link");
    expect(links[0].getAttribute("aria-current"), "non-matching child").to.be.null;
    expect(links[1].getAttribute("aria-current"), "URL-matching child").to.equal("page");
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

    // Trigger the flyout directly (bypasses intent timer; timer tested separately).
    (navItem as unknown as { _showRailFlyout(): void })._showRailFlyout();
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
