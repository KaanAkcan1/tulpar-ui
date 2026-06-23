import { expect, fixture, html } from "@open-wc/testing";
import "./tulpar-option-group";
import "./tulpar-option";
import type { TulparOptionGroup } from "./tulpar-option-group";

describe("tulpar-option-group", () => {
  it("has role=group and renders the label prop", async () => {
    const el = await fixture<TulparOptionGroup>(html`
      <tulpar-option-group label="Fruit">
        <tulpar-option value="a" label="Apple"></tulpar-option>
      </tulpar-option-group>
    `);
    expect(el.getAttribute("role")).to.equal("group");
    expect(el.shadowRoot!.textContent).to.contain("Fruit");
  });

  it("wires aria-labelledby to the header id", async () => {
    const el = await fixture<TulparOptionGroup>(
      html`<tulpar-option-group label="Fruit"></tulpar-option-group>`,
    );
    const header = el.shadowRoot!.querySelector(".group-header")!;
    expect(header.id).to.be.ok;
    expect(el.getAttribute("aria-labelledby")).to.equal(header.id);
  });

  it("label slot wins over the prop", async () => {
    const el = await fixture<TulparOptionGroup>(html`
      <tulpar-option-group label="Prop"><span slot="label">SlotLabel</span></tulpar-option-group>
    `);
    expect(el.shadowRoot!.textContent).to.contain("SlotLabel");
  });

  it("projects option children", async () => {
    const el = await fixture<TulparOptionGroup>(html`
      <tulpar-option-group label="Fruit">
        <tulpar-option value="a" label="Apple"></tulpar-option>
        <tulpar-option value="b" label="Banana"></tulpar-option>
      </tulpar-option-group>
    `);
    expect(el.querySelectorAll("tulpar-option").length).to.equal(2);
  });
});
