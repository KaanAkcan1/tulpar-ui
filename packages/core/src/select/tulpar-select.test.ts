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

const key = (el: TulparSelect, k: string, opts: KeyboardEventInit = {}) =>
  el.shadowRoot!.querySelector(".select-trigger")!.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: k,
      bubbles: true,
      composed: true,
      cancelable: true,
      ...opts,
    }),
  );

describe("tulpar-select (keyboard)", () => {
  const mk = () =>
    html` <tulpar-select label="X">
      <tulpar-option value="a" label="Apple"></tulpar-option>
      <tulpar-option value="b" label="Banana" disabled></tulpar-option>
      <tulpar-option value="c" label="Cherry"></tulpar-option>
    </tulpar-select>`;

  it("ArrowDown on a closed select opens it", async () => {
    const el = await fixture<TulparSelect>(mk());
    await el.updateComplete;
    key(el, "ArrowDown");
    await el.updateComplete;
    expect(el.open).to.be.true;
  });

  it("ArrowDown/ArrowUp move active over ENABLED options (skip disabled, no-wrap) and set aria-activedescendant", async () => {
    const el = await fixture<TulparSelect>(mk());
    await el.updateComplete;
    key(el, "ArrowDown");
    await el.updateComplete; // open, active = first enabled (a, idx 0)
    key(el, "ArrowDown");
    await el.updateComplete; // skip disabled b → c (idx 2)
    const trigger = el.shadowRoot!.querySelector(".select-trigger")!;
    const cOpt = el.querySelectorAll("tulpar-option")[2];
    expect(trigger.getAttribute("aria-activedescendant")).to.equal(cOpt.id);
    expect(cOpt.hasAttribute("data-active")).to.be.true;
    key(el, "ArrowDown");
    await el.updateComplete; // no-wrap, stays at c
    expect(trigger.getAttribute("aria-activedescendant")).to.equal(cOpt.id);
  });

  it("Enter commits the active option and closes", async () => {
    const el = await fixture<TulparSelect>(mk());
    await el.updateComplete;
    let changed: string | null = null;
    el.addEventListener("change", (e) => (changed = (e as CustomEvent).detail.value));
    key(el, "ArrowDown");
    await el.updateComplete; // active a
    key(el, "Enter");
    await el.updateComplete;
    expect(el.value).to.equal("a");
    expect(changed).to.equal("a");
    expect(el.open).to.be.false;
  });

  it("Tab commits the active option then closes", async () => {
    const el = await fixture<TulparSelect>(mk());
    await el.updateComplete;
    key(el, "ArrowDown");
    await el.updateComplete;
    key(el, "Tab");
    await el.updateComplete;
    expect(el.value).to.equal("a");
    expect(el.open).to.be.false;
  });

  it("Escape closes WITHOUT changing value (revert) and does not fire change", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" value="c"
        ><tulpar-option value="a" label="Apple"></tulpar-option
        ><tulpar-option value="c" label="Cherry"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    let fired = false;
    el.addEventListener("change", () => (fired = true));
    key(el, "ArrowDown");
    await el.updateComplete; // open
    key(el, "ArrowUp");
    await el.updateComplete; // move active
    key(el, "Escape");
    await el.updateComplete;
    expect(el.open).to.be.false;
    expect(el.value).to.equal("c");
    expect(fired).to.be.false;
  });

  it("Home/End jump to first/last enabled", async () => {
    const el = await fixture<TulparSelect>(mk());
    await el.updateComplete;
    key(el, "ArrowDown");
    await el.updateComplete; // open
    key(el, "End");
    await el.updateComplete;
    expect(
      el.shadowRoot!.querySelector(".select-trigger")!.getAttribute("aria-activedescendant"),
    ).to.equal(el.querySelectorAll("tulpar-option")[2].id);
    key(el, "Home");
    await el.updateComplete;
    expect(
      el.shadowRoot!.querySelector(".select-trigger")!.getAttribute("aria-activedescendant"),
    ).to.equal(el.querySelectorAll("tulpar-option")[0].id);
  });

  it("typing a letter jumps to the matching option (typeahead)", async () => {
    const el = await fixture<TulparSelect>(mk());
    await el.updateComplete;
    key(el, "ArrowDown");
    await el.updateComplete; // open, active a
    key(el, "c");
    await el.updateComplete; // jump to Cherry
    expect(
      el.shadowRoot!.querySelector(".select-trigger")!.getAttribute("aria-activedescendant"),
    ).to.equal(el.querySelectorAll("tulpar-option")[2].id);
  });

  it("DOM focus stays on the trigger while open (no roving)", async () => {
    const el = await fixture<TulparSelect>(mk());
    await el.updateComplete;
    (el.shadowRoot!.querySelector(".select-trigger") as HTMLElement).focus();
    key(el, "ArrowDown");
    await el.updateComplete;
    key(el, "ArrowDown");
    await el.updateComplete;
    expect(el.shadowRoot!.activeElement).to.equal(el.shadowRoot!.querySelector(".select-trigger"));
  });

  it("the selected option carries aria-selected/data-selected", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" value="a"
        ><tulpar-option value="a" label="Apple"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    const opt = el.querySelector("tulpar-option")!;
    expect(opt.getAttribute("aria-selected")).to.equal("true");
    expect(opt.hasAttribute("data-selected")).to.be.true;
  });
});

describe("tulpar-select (listbox states)", () => {
  it("shows 'No options' when there are zero options", async () => {
    const el = await fixture<TulparSelect>(html`<tulpar-select label="X"></tulpar-select>`);
    await el.updateComplete;
    const status = el.shadowRoot!.querySelector('.select-status[data-kind="empty"]')!;
    expect(status).to.be.ok;
    expect(status.textContent).to.contain("No options");
  });
  it("empty-text prop overrides the default empty message", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" empty-text="Nothing here"></tulpar-select>`,
    );
    await el.updateComplete;
    expect(
      el.shadowRoot!.querySelector('.select-status[data-kind="empty"]')!.textContent,
    ).to.contain("Nothing here");
  });
  it("loading shows a spinner row + aria-busy and a trigger spinner", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" loading
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.select-status[data-kind="loading"]')).to.be.ok;
    expect(el.shadowRoot!.querySelector(".select-listbox")!.getAttribute("aria-busy")).to.equal(
      "true",
    );
    expect(el.shadowRoot!.querySelector(".select-status[data-kind='loading'] tulpar-spinner")).to.be
      .ok;
  });
  it("error prop shows a danger row (role=alert) and keeps the trigger neutral", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" error="Couldn't load"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    const row = el.shadowRoot!.querySelector('.select-status[data-kind="error"]')!;
    expect(row.getAttribute("role")).to.equal("alert");
    expect(row.textContent).to.contain("Couldn't load");
    // trigger not invalid/red:
    expect(el.shadowRoot!.querySelector(".select-trigger")!.getAttribute("aria-invalid")).to.equal(
      "false",
    );
  });
  it("options render normally when present and not loading/error", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".select-status")).to.be.null;
    expect(el.querySelectorAll("tulpar-option").length).to.equal(1);
  });
});
