import { expect, fixture, html } from "@open-wc/testing";
import "./tulpar-select";
import "./tulpar-option";
import type { TulparSelect } from "./tulpar-select";

describe("tulpar-select (closed-state)", () => {
  it("is form-associated and reflects the selected value", async () => {
    const el = await fixture<TulparSelect>(html`
      <tulpar-select label="Fruit" value="b">
        <tulpar-option value="a" label="Apple"></tulpar-option>
        <tulpar-option value="b" label="Banana"></tulpar-option>
      </tulpar-select>
    `);
    await el.updateComplete;
    expect(el.value).to.equal("b");
    expect(el.shadowRoot!.querySelector(".select-value")!.textContent).to.contain("Banana");
  });

  it("shows the placeholder when no value", async () => {
    const el = await fixture<TulparSelect>(html`
      <tulpar-select label="Fruit" placeholder="Pick one">
        <tulpar-option value="a" label="Apple"></tulpar-option>
      </tulpar-select>
    `);
    await el.updateComplete;
    const v = el.shadowRoot!.querySelector(".select-value")!;
    expect(v.textContent).to.contain("Pick one");
    expect(v.getAttribute("data-placeholder")).to.equal("");
  });

  it("trigger has role=combobox + aria-haspopup=listbox + aria-expanded=false", async () => {
    const el = await fixture<TulparSelect>(html`<tulpar-select label="X"></tulpar-select>`);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector(".select-trigger")!;
    expect(trigger.getAttribute("role")).to.equal("combobox");
    expect(trigger.getAttribute("aria-haspopup")).to.equal("listbox");
    expect(trigger.getAttribute("aria-expanded")).to.equal("false");
  });

  it("listbox has role=listbox and is hidden when closed", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    const lb = el.shadowRoot!.querySelector(".select-listbox")!;
    expect(lb.getAttribute("role")).to.equal("listbox");
    // closed: not visible
    expect(getComputedStyle(lb).display).to.equal("none");
  });

  it("setting value programmatically updates the form value and trigger label", async () => {
    const el = await fixture<TulparSelect>(html`
      <tulpar-select label="X"
        ><tulpar-option value="a" label="Apple"></tulpar-option
      ></tulpar-select>
    `);
    el.value = "a";
    await el.updateComplete;
    expect(el.value).to.equal("a");
    expect(el.shadowRoot!.querySelector(".select-value")!.textContent).to.contain("Apple");
  });

  it("aria-controls on the trigger points at the listbox id", async () => {
    const el = await fixture<TulparSelect>(html`<tulpar-select label="X"></tulpar-select>`);
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector(".select-trigger")!;
    const lb = el.shadowRoot!.querySelector(".select-listbox")!;
    expect(trigger.getAttribute("aria-controls")).to.equal(lb.id);
  });
});
