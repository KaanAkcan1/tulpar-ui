import { fixture, html, expect, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import "./tulpar-shell";
import "../sidenav/tulpar-sidenav";
import type { TulparShell } from "./tulpar-shell";

describe("<tulpar-shell>", () => {
  it("renders grid areas with all five slots", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell></tulpar-shell>`);
    for (const name of ["topbar", "sidenav", "footer", "aside"]) {
      expect(el.shadowRoot!.querySelector(`slot[name="${name}"]`)).to.exist;
    }
    expect(el.shadowRoot!.querySelector("main slot:not([name])")).to.exist;
  });

  it("renders a skip link targeting the content area", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell></tulpar-shell>`);
    const skip = el.shadowRoot!.querySelector("a.skip-link")!;
    expect(skip).to.exist;
    const target = skip.getAttribute("href")!.slice(1);
    expect(el.shadowRoot!.getElementById(target)).to.exist;
  });

  it("reflects sidenav-mode and defaults to static", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell></tulpar-shell>`);
    expect(el.sidenavMode).to.equal("static");
    el.sidenavMode = "rail";
    await el.updateComplete;
    expect(el.getAttribute("sidenav-mode")).to.equal("rail");
  });

  it("toggles on tulpar-menu-toggle from slotted content and emits tulpar-shell-change", async () => {
    // WTR viewport is 800×600; use a breakpoint smaller than that so we stay in desktop mode
    const el = await fixture<TulparShell>(
      html`<tulpar-shell mobile-breakpoint="(max-width: 499px)"
        ><div slot="topbar" id="t"></div
      ></tulpar-shell>`,
    );
    setTimeout(() =>
      el
        .querySelector("#t")!
        .dispatchEvent(new CustomEvent("tulpar-menu-toggle", { bubbles: true, composed: true })),
    );
    const ev = (await oneEvent(el, "tulpar-shell-change")) as CustomEvent;
    expect(ev.detail.collapsed.desktop).to.be.true;
  });

  it("shows mask when aside is open and closes on Escape", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell aside-open></tulpar-shell>`);
    expect(el.shadowRoot!.querySelector(".mask")).to.exist;
    setTimeout(() => sendKeys({ press: "Escape" }));
    const ev = await oneEvent(el, "tulpar-aside-close");
    expect(ev).to.exist;
  });

  it("closes overlay sidenav on mask click", async () => {
    const el = await fixture<TulparShell>(
      html`<tulpar-shell sidenav-mode="overlay"></tulpar-shell>`,
    );
    el.sidenavOpen = true;
    await el.updateComplete;
    const mask = el.shadowRoot!.querySelector<HTMLElement>(".mask")!;
    mask.click();
    await el.updateComplete;
    expect(el.sidenavOpen).to.be.false;
  });

  it("applies content props as host attributes", async () => {
    const el = await fixture<TulparShell>(
      html`<tulpar-shell
        content-width="fixed"
        content-padding="compact"
        footer-mode="fixed"
      ></tulpar-shell>`,
    );
    expect(el.getAttribute("content-width")).to.equal("fixed");
    expect(el.getAttribute("content-padding")).to.equal("compact");
    expect(el.getAttribute("footer-mode")).to.equal("fixed");
  });

  it("manages documentElement .dark class via dark prop", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell></tulpar-shell>`);
    el.dark = true;
    await el.updateComplete;
    // startViewTransition applies the class in a rendering frame (not a microtask),
    // and the number of frames varies by engine — poll until it lands rather than
    // assuming a fixed rAF count (one rAF is flaky on headless Chromium / CI).
    await waitUntil(
      () => document.documentElement.classList.contains("dark"),
      "dark class should be added",
    );
    el.dark = false;
    await el.updateComplete;
    await waitUntil(
      () => !document.documentElement.classList.contains("dark"),
      "dark class should be removed",
    );
  });

  it("moves focus into aside when opened and restores on close", async () => {
    const el = await fixture<TulparShell>(html`
      <tulpar-shell>
        <button id="opener">open</button>
        <button slot="aside" id="inside">x</button>
      </tulpar-shell>
    `);
    el.querySelector<HTMLButtonElement>("#opener")!.focus();
    el.asideOpen = true;
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    expect(document.activeElement).to.equal(el.querySelector("#inside"));
    el.asideOpen = false;
    await el.updateComplete;
    expect(document.activeElement).to.equal(el.querySelector("#opener"));
  });

  it("restores focus to original trigger when aside closes over an open sidenav", async () => {
    const el = await fixture<TulparShell>(html`
      <tulpar-shell sidenav-mode="overlay">
        <button id="opener">open</button>
        <a slot="sidenav" id="nav-link" href="#">nav</a>
        <button slot="aside" id="inside">x</button>
      </tulpar-shell>
    `);
    // Original trigger gains focus, then opens the overlay sidenav.
    el.querySelector<HTMLButtonElement>("#opener")!.focus();
    el.dispatchEvent(new CustomEvent("tulpar-menu-toggle", { bubbles: true }));
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    expect(document.activeElement).to.equal(el.querySelector("#nav-link"));

    // Open aside while sidenav is still open — focus moves into aside but the
    // recorded trigger must remain the original #opener, not the nav link.
    el.asideOpen = true;
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    expect(document.activeElement).to.equal(el.querySelector("#inside"));

    // Closing aside restores focus to the ORIGINAL trigger, not into the sidenav.
    el.asideOpen = false;
    await el.updateComplete;
    expect(document.activeElement).to.equal(el.querySelector("#opener"));
  });

  it("sets data-rail on slotted sidenav in rail+collapsed mode", async () => {
    const el = await fixture<TulparShell>(html`
      <tulpar-shell sidenav-mode="rail">
        <div slot="sidenav" id="sn"></div>
      </tulpar-shell>
    `);
    el.sidenavCollapsed = true;
    await el.updateComplete;
    expect(el.querySelector("#sn")!.hasAttribute("data-rail")).to.be.true;
  });

  it("reflects data-sidenav-position=right when slotted sidenav has position=right", async () => {
    const el = await fixture<TulparShell>(html`
      <tulpar-shell>
        <tulpar-sidenav slot="sidenav" position="right"></tulpar-sidenav>
      </tulpar-shell>
    `);
    await el.updateComplete;
    expect(el.getAttribute("data-sidenav-position")).to.equal("right");
  });

  it("grid-template-areas swaps sidenav and content columns for right-positioned sidenav", async () => {
    const el = await fixture<TulparShell>(html`
      <tulpar-shell>
        <tulpar-sidenav slot="sidenav" position="right"></tulpar-sidenav>
      </tulpar-shell>
    `);
    await el.updateComplete;
    const areas = getComputedStyle(el).gridTemplateAreas;
    // right position: content comes before sidenav in the row
    expect(areas).to.include("content");
    expect(areas).to.include("sidenav");
    // "content sidenav" order (content before sidenav) when position=right
    expect(areas.indexOf("content")).to.be.lessThan(areas.indexOf("sidenav"));
  });

  // ── Task 7.1 ──────────────────────────────────────────────────────────────
  it("reflects collapsed/open state onto the slotted sidenav", async () => {
    const el = await fixture<TulparShell>(
      html`<tulpar-shell sidenav-mode="static"><div slot="sidenav"></div></tulpar-shell>`,
    );
    el.sidenavCollapsed = true;
    await el.updateComplete;
    expect(el.querySelector('[slot="sidenav"]')!.hasAttribute("data-collapsed")).to.be.true;
  });

  // ── Task 7.2 ──────────────────────────────────────────────────────────────
  it("flips dark when a tulpar-theme-toggle bubbles up", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell></tulpar-shell>`);
    const before = el.dark;
    el.dispatchEvent(new CustomEvent("tulpar-theme-toggle", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.dark).to.equal(!before);
  });

  // ── Task 7.3 ──────────────────────────────────────────────────────────────
  it("over-topbar layout puts sidenav before topbar in the grid", async () => {
    const el = await fixture<TulparShell>(
      html`<tulpar-shell sidenav-layout="over-topbar"></tulpar-shell>`,
    );
    expect(el.getAttribute("sidenav-layout")).to.equal("over-topbar");
    const areas = getComputedStyle(el).gridTemplateAreas;
    expect(areas.indexOf("sidenav")).to.be.lessThan(areas.indexOf("topbar"));
  });

  // ── Task 7.4 ──────────────────────────────────────────────────────────────
  it("shows a floating reopen button when static+collapsed and emits toggle", async () => {
    const el = await fixture<TulparShell>(
      html`<tulpar-shell sidenav-mode="static"></tulpar-shell>`,
    );
    el.sidenavCollapsed = true;
    await el.updateComplete;
    const fab = el.shadowRoot!.querySelector(".sidenav-fab") as HTMLButtonElement;
    expect(fab).to.exist;
    setTimeout(() => fab.click());
    expect(await oneEvent(el, "tulpar-menu-toggle")).to.exist;
  });

  it("no floating button in rail mode (desktop)", async () => {
    // Force desktop: a narrow headless viewport would set _isMobile=true, which
    // correctly shows the FAB (mobile treats rail as overlay). This test asserts
    // the DESKTOP rail behaviour, so pin mobile-breakpoint off.
    const el = await fixture<TulparShell>(
      html`<tulpar-shell sidenav-mode="rail" mobile-breakpoint="(max-width: 0px)"></tulpar-shell>`,
    );
    el.sidenavCollapsed = true;
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".sidenav-fab")).to.be.null;
  });

  it("shows the floating button when overlay sidenav is closed", async () => {
    const el = await fixture<TulparShell>(
      html`<tulpar-shell sidenav-mode="overlay"></tulpar-shell>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".sidenav-fab")).to.exist;
  });
});
