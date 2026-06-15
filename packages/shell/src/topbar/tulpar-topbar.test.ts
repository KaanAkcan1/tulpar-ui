import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import "./tulpar-topbar";
import type { TulparTopbar } from "./tulpar-topbar";

describe("<tulpar-topbar>", () => {
  it("renders start/default/end slots", async () => {
    const el = await fixture<TulparTopbar>(html`<tulpar-topbar></tulpar-topbar>`);
    const names = [...el.shadowRoot!.querySelectorAll("slot")].map((s) => s.getAttribute("name"));
    expect(names).to.include.members(["start", "end", null]);
  });

  it("hides menu button by default, shows with show-menu-button", async () => {
    const el = await fixture<TulparTopbar>(html`<tulpar-topbar></tulpar-topbar>`);
    expect(el.shadowRoot!.querySelector("button.menu")).to.not.exist;
    el.showMenuButton = true;
    await el.updateComplete;
    const btn = el.shadowRoot!.querySelector("button.menu")!;
    expect(btn).to.exist;
    expect(btn.getAttribute("aria-label")).to.be.a("string").and.not.empty;
  });

  it("dispatches composed tulpar-menu-toggle on menu click", async () => {
    const el = await fixture<TulparTopbar>(html`<tulpar-topbar show-menu-button></tulpar-topbar>`);
    setTimeout(() => el.shadowRoot!.querySelector<HTMLButtonElement>("button.menu")!.click());
    const ev = await oneEvent(el, "tulpar-menu-toggle");
    expect((ev as CustomEvent).composed).to.be.true;
  });
});
