import { fixture, html, expect } from "@open-wc/testing";
import "../button/tulpar-button";
import "./tulpar-button-group";
import type { TulparButtonGroup } from "./tulpar-button-group";

describe("<tulpar-button-group>", () => {
  it("host carries role='toolbar' via ElementInternals (shadow div has no role)", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <tulpar-button>B</tulpar-button>
      </tulpar-button-group>
    `);
    const inner = el.shadowRoot!.querySelector("div");
    expect(inner!.getAttribute("role")).to.be.null;
    expect((el as unknown as { __role?: string }).__role).to.equal("toolbar");
  });

  it("aria-orientation flips between horizontal and vertical with `stacked`", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
      </tulpar-button-group>
    `);
    await el.updateComplete;
    expect((el as unknown as { __orientation?: string }).__orientation).to.equal("horizontal");
    el.stacked = true;
    await el.updateComplete;
    expect((el as unknown as { __orientation?: string }).__orientation).to.equal("vertical");
  });

  it("sets tabindex=0 on first button, -1 on others (roving tabindex)", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <tulpar-button>B</tulpar-button>
        <tulpar-button>C</tulpar-button>
      </tulpar-button-group>
    `);
    await el.updateComplete;
    const buttons = el.querySelectorAll("tulpar-button");
    expect(buttons[0].getAttribute("tabindex")).to.equal("0");
    expect(buttons[1].getAttribute("tabindex")).to.equal("-1");
    expect(buttons[2].getAttribute("tabindex")).to.equal("-1");
  });

  it("ArrowRight moves focus to next sibling", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <tulpar-button>B</tulpar-button>
      </tulpar-button-group>
    `);
    await el.updateComplete;
    const buttons = el.querySelectorAll("tulpar-button");
    buttons[0].focus();
    buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await el.updateComplete;
    expect(document.activeElement).to.equal(buttons[1]);
  });

  it("Home moves focus to first button", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <tulpar-button>B</tulpar-button>
        <tulpar-button>C</tulpar-button>
      </tulpar-button-group>
    `);
    await el.updateComplete;
    const buttons = el.querySelectorAll("tulpar-button");
    buttons[2].focus();
    buttons[2].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    await el.updateComplete;
    expect(document.activeElement).to.equal(buttons[0]);
  });

  describe("stacked layout", () => {
    it("reflects stacked attribute and sets data-group-orientation on children", async () => {
      const el = await fixture<TulparButtonGroup>(html`
        <tulpar-button-group stacked>
          <tulpar-button>A</tulpar-button>
          <tulpar-button>B</tulpar-button>
          <tulpar-button>C</tulpar-button>
        </tulpar-button-group>
      `);
      await el.updateComplete;
      const buttons = el.querySelectorAll("tulpar-button");
      buttons.forEach((btn) => {
        expect(btn.getAttribute("data-group-orientation")).to.equal("stacked");
      });
    });

    it("ArrowDown moves focus to next button when stacked", async () => {
      const el = await fixture<TulparButtonGroup>(html`
        <tulpar-button-group stacked>
          <tulpar-button>A</tulpar-button>
          <tulpar-button>B</tulpar-button>
        </tulpar-button-group>
      `);
      await el.updateComplete;
      const buttons = el.querySelectorAll("tulpar-button");
      buttons[0].focus();
      buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      await el.updateComplete;
      expect(document.activeElement).to.equal(buttons[1]);
    });

    it("ArrowRight is ignored when stacked (no horizontal nav)", async () => {
      const el = await fixture<TulparButtonGroup>(html`
        <tulpar-button-group stacked>
          <tulpar-button>A</tulpar-button>
          <tulpar-button>B</tulpar-button>
        </tulpar-button-group>
      `);
      await el.updateComplete;
      const buttons = el.querySelectorAll("tulpar-button");
      buttons[0].focus();
      buttons[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      await el.updateComplete;
      expect(document.activeElement).to.equal(buttons[0]); // unchanged
    });
  });

  it("focusing the host delegates to the inner shadow button", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <tulpar-button>B</tulpar-button>
      </tulpar-button-group>
    `);
    await el.updateComplete;
    const host = el.querySelector("tulpar-button") as HTMLElement;
    host.focus();
    const innerBtn = host.shadowRoot!.querySelector("button") as HTMLElement;
    expect(host.shadowRoot!.activeElement).to.equal(innerBtn);
  });

  it("ignores nested tulpar-button descendants (only direct children)", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <div>
          <tulpar-button>Nested</tulpar-button>
        </div>
        <tulpar-button>B</tulpar-button>
      </tulpar-button-group>
    `);
    await el.updateComplete;
    const direct = el.querySelectorAll(":scope > tulpar-button");
    expect(direct.length).to.equal(2);
    const nested = el.querySelector(":scope > div > tulpar-button")!;
    expect(nested.hasAttribute("data-group-position")).to.be.false;
  });

  it("re-syncs tabindex when a button is added after mount", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <tulpar-button>B</tulpar-button>
      </tulpar-button-group>
    `);
    await el.updateComplete;
    const newBtn = document.createElement("tulpar-button");
    newBtn.textContent = "C";
    el.appendChild(newBtn);
    await new Promise((r) => setTimeout(r, 0));
    const buttons = el.querySelectorAll(":scope > tulpar-button");
    expect(buttons.length).to.equal(3);
    expect(buttons[2].getAttribute("data-group-position")).to.equal("last");
    expect(buttons[1].getAttribute("data-group-position")).to.equal("middle");
  });

  it("re-syncs tabindex when a button is removed after mount", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <tulpar-button>B</tulpar-button>
        <tulpar-button>C</tulpar-button>
      </tulpar-button-group>
    `);
    await el.updateComplete;
    const middle = el.querySelectorAll(":scope > tulpar-button")[1];
    middle.remove();
    await new Promise((r) => setTimeout(r, 0));
    const remaining = el.querySelectorAll(":scope > tulpar-button");
    expect(remaining.length).to.equal(2);
    expect(remaining[0].getAttribute("data-group-position")).to.equal("first");
    expect(remaining[1].getAttribute("data-group-position")).to.equal("last");
  });
});
