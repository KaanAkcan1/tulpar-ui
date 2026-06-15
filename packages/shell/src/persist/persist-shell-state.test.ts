import { fixture, html, expect } from "@open-wc/testing";
import "../shell/tulpar-shell";
import type { TulparShell } from "../shell/tulpar-shell";
import { persistShellState } from "./persist-shell-state";

describe("persistShellState", () => {
  afterEach(() => localStorage.removeItem("test-shell"));

  it("restores persisted state on attach", async () => {
    localStorage.setItem(
      "test-shell",
      JSON.stringify({
        sidenavMode: "rail",
        collapsed: { desktop: true, mobile: true },
        dark: false,
      }),
    );
    const el = await fixture<TulparShell>(html`<tulpar-shell></tulpar-shell>`);
    const dispose = persistShellState(el, "test-shell");
    expect(el.sidenavMode).to.equal("rail");
    expect(el.sidenavCollapsed).to.be.true;
    dispose();
  });

  it("writes state on tulpar-shell-change", async () => {
    const el = await fixture<TulparShell>(html`<tulpar-shell></tulpar-shell>`);
    const dispose = persistShellState(el, "test-shell");
    el.dark = true;
    await el.updateComplete;
    const stored = JSON.parse(localStorage.getItem("test-shell")!);
    expect(stored.dark).to.be.true;
    dispose();
    document.documentElement.classList.remove("dark");
  });
});
