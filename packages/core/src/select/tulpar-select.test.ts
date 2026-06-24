import { expect, fixture, html } from "@open-wc/testing";
import "./tulpar-select";
import "./tulpar-option";
import type { TulparSelect } from "./tulpar-select";
import type { TulparOption } from "./tulpar-option";
import { type SelectOptions } from "./select-options";

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
  it("loading-text prop overrides the default loading message", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" loading loading-text="Fetching…"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    expect(
      el.shadowRoot!.querySelector('.select-status[data-kind="loading"]')!.textContent,
    ).to.contain("Fetching…");
  });
  it("error slot child triggers the error row even without the error prop", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><span slot="error">Boom</span><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    const row = el.shadowRoot!.querySelector('.select-status[data-kind="error"]')!;
    expect(row, "error row present from slot").to.be.ok;
    const slot = row.querySelector('slot[name="error"]') as HTMLSlotElement;
    expect(
      slot
        .assignedNodes({ flatten: true })
        .map((n) => n.textContent)
        .join(""),
    ).to.contain("Boom");
  });
  it("loading takes priority over error when both are set", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" loading error="Boom"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.select-status[data-kind="loading"]')).to.be.ok;
    expect(el.shadowRoot!.querySelector('.select-status[data-kind="error"]')).to.be.null;
  });
  it("aria-busy is absent (not 'false') when not loading", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X"
        ><tulpar-option value="a" label="A"></tulpar-option
      ></tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector(".select-listbox")!.hasAttribute("aria-busy")).to.be.false;
  });
});

describe("tulpar-select — data-mode (options prop)", () => {
  const opts: SelectOptions = [
    { value: "a", label: "Apple" },
    { value: "b", label: "Banana", disabled: true },
    {
      label: "Citrus",
      options: [
        { value: "o", label: "Orange" },
        { value: "l", label: "Lemon" },
      ],
    },
  ];

  it("renders options from the data prop into the shadow listbox", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${opts} open></tulpar-select>`,
    );
    await el.updateComplete;
    const shadowOpts = el.renderRoot.querySelectorAll("tulpar-option");
    expect(shadowOpts.length).to.equal(4); // apple, banana, orange, lemon
    expect(el.renderRoot.querySelectorAll("tulpar-option-group").length).to.equal(1);
  });

  it("selecting a data-mode value shows its label on the trigger + sets form value", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${opts} value="o"></tulpar-select>`,
    );
    await el.updateComplete;
    const valueText = el.renderRoot.querySelector(".select-value");
    expect(valueText?.textContent?.trim()).to.equal("Orange");
  });

  it("prop wins: slotted children are inert when options is set", async () => {
    const el = await fixture<TulparSelect>(
      html` <tulpar-select .options=${opts} open>
        <tulpar-option value="z">Zucchini</tulpar-option>
      </tulpar-select>`,
    );
    await el.updateComplete;
    // _options() reads shadow only → 4, not 5
    const shadow = el.renderRoot.querySelectorAll("tulpar-option");
    expect(shadow.length).to.equal(4);
  });

  it("disabled group disables its children", async () => {
    const grouped: SelectOptions = [
      { label: "G", disabled: true, options: [{ value: "x", label: "X" }] },
    ];
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${grouped} open></tulpar-select>`,
    );
    await el.updateComplete;
    const x = el.renderRoot.querySelector('tulpar-option[value="x"]') as HTMLElement;
    expect(x.hasAttribute("disabled")).to.equal(true);
  });

  it("stamps stable ids for activedescendant on data options", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${opts} open></tulpar-select>`,
    );
    await el.updateComplete;
    el.renderRoot.querySelectorAll("tulpar-option").forEach((o) => expect(o.id).to.not.equal(""));
  });
});

describe("tulpar-select — slotted group-disabled parity", () => {
  it("a slotted disabled group disables its child options (parity with data-mode)", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" open>
        <tulpar-option-group label="G" disabled>
          <tulpar-option value="x">X</tulpar-option>
        </tulpar-option-group>
      </tulpar-select>`,
    );
    await el.updateComplete;
    const x = el.querySelector('tulpar-option[value="x"]') as HTMLElement;
    // The group's disabled state must be mirrored onto the child option.
    expect(x.hasAttribute("disabled")).to.equal(true);
    // …and the collection must treat it as disabled (so keyboard nav skips it).
    const items = (
      el as unknown as { _options(): { value: string; disabled: boolean }[] }
    )._options();
    const item = items.find((i) => i.value === "x");
    expect(item?.disabled).to.equal(true);
  });

  it("re-enables child options when the group is re-enabled, preserving a child's own disabled", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select label="X" open>
        <tulpar-option-group label="G" disabled>
          <tulpar-option value="x">X</tulpar-option>
          <tulpar-option value="y" disabled>Y</tulpar-option>
        </tulpar-option-group>
      </tulpar-select>`,
    );
    await el.updateComplete;
    const group = el.querySelector("tulpar-option-group") as HTMLElement;
    const x = el.querySelector('tulpar-option[value="x"]') as HTMLElement;
    const y = el.querySelector('tulpar-option[value="y"]') as HTMLElement;
    expect(x.hasAttribute("disabled")).to.equal(true);
    expect(y.hasAttribute("disabled")).to.equal(true);

    // Re-enable the group: the group-induced disable on `x` must clear, but
    // `y`'s OWN disabled must survive.
    group.removeAttribute("disabled");
    el.requestUpdate();
    await el.updateComplete;
    expect(x.hasAttribute("disabled")).to.equal(false);
    expect(y.hasAttribute("disabled")).to.equal(true);
  });
});

describe("tulpar-select — searchable (render + a11y)", () => {
  const opts: SelectOptions = [
    { value: "a", label: "Apple" },
    { value: "b", label: "Banana" },
  ];

  it("renders a search input in the listbox when searchable", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${opts} searchable open></tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.renderRoot.querySelector(".select-search-input")).to.not.equal(null);
  });

  it("moves the combobox role to the search input (not the trigger) when searchable", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${opts} searchable open></tulpar-select>`,
    );
    await el.updateComplete;
    const trigger = el.renderRoot.querySelector(".select-trigger")!;
    const input = el.renderRoot.querySelector(".select-search-input")!;
    expect(trigger.getAttribute("role")).to.not.equal("combobox");
    expect(input.getAttribute("role")).to.equal("combobox");
    expect(input.getAttribute("aria-controls")).to.equal(trigger.getAttribute("aria-controls"));
  });

  it("non-searchable keeps combobox role on the trigger", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${opts} open></tulpar-select>`,
    );
    await el.updateComplete;
    expect(el.renderRoot.querySelector(".select-trigger")!.getAttribute("role")).to.equal(
      "combobox",
    );
  });

  it("focuses the search input on open", async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${opts} searchable></tulpar-select>`,
    );
    el.renderRoot.querySelector<HTMLElement>(".select-trigger")!.click();
    await el.updateComplete;
    await new Promise((r) => requestAnimationFrame(r));
    expect(el.renderRoot.activeElement).to.equal(
      el.renderRoot.querySelector(".select-search-input"),
    );
  });
});

describe("tulpar-select — searchable (filtering)", () => {
  const opts: SelectOptions = [
    { value: "ist", label: "İstanbul" },
    { value: "ank", label: "Ankara" },
    { value: "izm", label: "İzmir" },
  ];
  const openSearchable = async () => {
    const el = await fixture<TulparSelect>(
      html`<tulpar-select .options=${opts} searchable></tulpar-select>`,
    );
    el.renderRoot.querySelector<HTMLElement>(".select-trigger")!.click();
    await el.updateComplete;
    return el;
  };
  const type = async (el: TulparSelect, q: string) => {
    const input = el.renderRoot.querySelector<HTMLInputElement>(".select-search-input")!;
    input.value = q;
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
  };

  it("hides non-matching options (diacritic-insensitive)", async () => {
    const el = await openSearchable();
    await type(el, "is");
    const visible = [...el.renderRoot.querySelectorAll("tulpar-option")].filter(
      (o) => !(o as HTMLElement).hidden,
    );
    expect(visible.map((o) => (o as TulparOption).value)).to.deep.equal(["ist"]);
  });

  it("arrow nav skips hidden options", async () => {
    const el = await openSearchable();
    await type(el, "i"); // matches İstanbul + İzmir
    const input = el.renderRoot.querySelector<HTMLInputElement>(".select-search-input")!;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await el.updateComplete;
    // active lands on a visible match; committing selects it
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await el.updateComplete;
    expect(["ist", "izm"]).to.include(el.value);
  });

  it("two-stage Escape: first clears query, second reverts/closes", async () => {
    const el = await openSearchable();
    await type(el, "an");
    const input = el.renderRoot.querySelector<HTMLInputElement>(".select-search-input")!;
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).to.equal(true);
    expect(el.renderRoot.querySelector<HTMLInputElement>(".select-search-input")!.value).to.equal(
      "",
    );
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete;
    expect(el.open).to.equal(false);
  });

  it("resets the query on reopen", async () => {
    const el = await openSearchable();
    await type(el, "an");
    el.renderRoot
      .querySelector<HTMLInputElement>(".select-search-input")!
      .dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await el.updateComplete; // cleared query (still open)
    // close + reopen
    (el as unknown as { _doClose(): void })._doClose();
    await el.updateComplete;
    el.renderRoot.querySelector<HTMLElement>(".select-trigger")!.click();
    await el.updateComplete;
    expect(el.renderRoot.querySelector<HTMLInputElement>(".select-search-input")!.value).to.equal(
      "",
    );
  });
});
