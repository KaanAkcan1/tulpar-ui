import { fixture, html, expect } from "@open-wc/testing";
import "../button/tulpar-button";
import "./tulpar-button-group";
import type { TulparButtonGroup } from "./tulpar-button-group";

describe("<tulpar-button-group>", () => {
  it("renders with role='group'", async () => {
    const el = await fixture<TulparButtonGroup>(html`
      <tulpar-button-group>
        <tulpar-button>A</tulpar-button>
        <tulpar-button>B</tulpar-button>
      </tulpar-button-group>
    `);
    const inner = el.shadowRoot!.querySelector("div");
    expect(inner!.getAttribute("role")).to.equal("group");
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
});
