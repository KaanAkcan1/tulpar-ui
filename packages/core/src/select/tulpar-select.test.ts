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

describe("tulpar-select (clearable + icon mirror)", () => {
  it("shows the clear button only when clearable + has value + not required", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select label="X" clearable value="a">
        <tulpar-option value="a" label="A"></tulpar-option>
      </tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".select-clear")).to.be.ok;
  });
  it("hides the clear button when required (required-suppressed)", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select label="X" clearable required value="a">
        <tulpar-option value="a" label="A"></tulpar-option>
      </tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".select-clear")).to.be.null;
  });
  it("hides the clear button when no value", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select label="X" clearable>
        <tulpar-option value="a" label="A"></tulpar-option>
      </tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".select-clear")).to.be.null;
  });
  it("hides the clear button when disabled", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select label="X" clearable disabled value="a">
        <tulpar-option value="a" label="A"></tulpar-option>
      </tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".select-clear")).to.be.null;
  });
  it("hides the clear button when readonly", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select label="X" clearable readonly value="a">
        <tulpar-option value="a" label="A"></tulpar-option>
      </tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".select-clear")).to.be.null;
  });
  it("clicking clear resets value, fires change, does not open", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select label="X" clearable value="a">
        <tulpar-option value="a" label="A"></tulpar-option>
      </tulpar-select>`,
    );
    await el.updateComplete;
    let changed: string | null = null;
    el.addEventListener("change", (e) => {
      changed = (e as CustomEvent).detail.value;
    });
    (el.shadowRoot!.querySelector(".select-clear") as HTMLButtonElement).click();
    await el.updateComplete;
    expect(el.value).to.equal("");
    expect(changed).to.equal("");
    expect(el.open).to.be.false;
  });
  it("mirrors the selected option's leading icon into the trigger", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select label="X" value="a">
        <tulpar-option value="a" label="A"><svg slot="icon" data-test-icon></svg></tulpar-option>
      </tulpar-select>`,
    );
    await el.updateComplete;
    const leading = el.shadowRoot!.querySelector(".select-leading-icon")!;
    expect(leading.querySelector("[data-test-icon]"), "cloned icon present").to.be.ok;
    expect(el.hasAttribute("data-has-leading-icon")).to.be.true;
  });
  it("shows no leading icon when the selected option has none", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select label="X" value="a"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.hasAttribute("data-has-leading-icon")).to.be.false;
  });
});

describe("tulpar-select (open/close)", () => {
  it("opens on trigger click and sets aria-expanded=true + [open]", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".select-trigger") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).to.be.true;
    expect(el.shadowRoot!.querySelector(".select-trigger")!.getAttribute("aria-expanded")).to.equal(
      "true",
    );
  });
  it("toggles closed on a second trigger click", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    const t = el.shadowRoot!.querySelector(".select-trigger") as HTMLElement;
    t.click();
    await el.updateComplete;
    t.click();
    await el.updateComplete;
    expect(el.open).to.be.false;
  });
  it("clicking an option commits its value, closes, fires change", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><tulpar-option value="a" label="A"></tulpar-option
        ><tulpar-option value="b" label="B"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    let changed: string | null = null;
    el.addEventListener("change", (e) => {
      changed = (e as CustomEvent).detail.value;
    });
    (el.shadowRoot!.querySelector(".select-trigger") as HTMLElement).click();
    await el.updateComplete;
    const second = el.querySelectorAll("tulpar-option")[1] as HTMLElement;
    second.click();
    await el.updateComplete;
    expect(el.value).to.equal("b");
    expect(changed).to.equal("b");
    expect(el.open).to.be.false;
  });
  it("clicking a disabled option does nothing", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><tulpar-option value="a" label="A" disabled></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".select-trigger") as HTMLElement).click();
    await el.updateComplete;
    (el.querySelector("tulpar-option") as HTMLElement).click();
    await el.updateComplete;
    expect(el.value).to.equal("");
    expect(el.open).to.be.true; // stays open
  });
  it("outside pointerdown closes without changing value", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" value="a"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".select-trigger") as HTMLElement).click();
    await el.updateComplete;
    document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.open).to.be.false;
    expect(el.value).to.equal("a");
  });
  it("does NOT close on pointerdown inside the listbox", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".select-trigger") as HTMLElement).click();
    await el.updateComplete;
    el.shadowRoot!.querySelector(".select-listbox")!.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, composed: true }),
    );
    await el.updateComplete;
    expect(el.open).to.be.true;
  });
  it("disabled select does not open", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" disabled
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".select-trigger") as HTMLElement).click();
    await el.updateComplete;
    expect(el.open).to.be.false;
  });
});
