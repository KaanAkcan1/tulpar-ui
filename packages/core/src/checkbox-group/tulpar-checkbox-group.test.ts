import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-checkbox-group";
import "../checkbox/tulpar-checkbox";
import type { TulparCheckboxGroup } from "./tulpar-checkbox-group";
import type { TulparCheckbox } from "../checkbox/tulpar-checkbox";

function box(el: TulparCheckbox): HTMLSpanElement {
  return el.shadowRoot!.querySelector(".box") as HTMLSpanElement;
}

async function settle(el: TulparCheckboxGroup) {
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
}

describe("public type exports", () => {
  it("re-exports TulparCheckboxGroup from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparCheckboxGroup).to.exist;
  });
  it("re-exports TulparCheckboxGroup from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparCheckboxGroup).to.exist;
  });
});

describe("<tulpar-checkbox-group>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-checkbox-group")).to.exist;
  });

  it("is not form-associated", () => {
    const ctor = customElements.get("tulpar-checkbox-group") as unknown as {
      formAssociated?: boolean;
    };
    expect(ctor.formAssociated).to.not.equal(true);
  });

  it("value reflects authored checked children (DOM order)", async () => {
    const el = await fixture<TulparCheckboxGroup>(html`
      <tulpar-checkbox-group name="g">
        <tulpar-checkbox value="a"></tulpar-checkbox>
        <tulpar-checkbox value="b" checked></tulpar-checkbox>
        <tulpar-checkbox value="c" checked></tulpar-checkbox>
      </tulpar-checkbox-group>
    `);
    await settle(el);
    expect(el.value).to.deep.equal(["b", "c"]);
  });

  it("toggling a child updates value and emits a composed, bubbling group change with detail", async () => {
    const el = await fixture<TulparCheckboxGroup>(html`
      <tulpar-checkbox-group name="g">
        <tulpar-checkbox value="a"></tulpar-checkbox>
        <tulpar-checkbox value="b"></tulpar-checkbox>
      </tulpar-checkbox-group>
    `);
    await settle(el);

    let evt: CustomEvent | null = null;
    el.addEventListener("change", (e) => {
      if (e instanceof CustomEvent && e.detail && "value" in e.detail) evt = e;
    });

    const first = el.querySelector("tulpar-checkbox") as TulparCheckbox;
    box(first).click();
    await settle(el);

    expect(el.value).to.deep.equal(["a"]);
    expect(evt).to.not.be.null;
    const ce = evt as unknown as CustomEvent;
    expect(ce.detail.value).to.deep.equal(["a"]);
    expect(ce.bubbles).to.be.true;
    expect(ce.composed).to.be.true;
  });

  it("setting value programmatically checks the matching children (no re-dispatch)", async () => {
    const el = await fixture<TulparCheckboxGroup>(html`
      <tulpar-checkbox-group name="g">
        <tulpar-checkbox value="a"></tulpar-checkbox>
        <tulpar-checkbox value="b"></tulpar-checkbox>
        <tulpar-checkbox value="c"></tulpar-checkbox>
      </tulpar-checkbox-group>
    `);
    await settle(el);

    let dispatched = false;
    el.addEventListener("change", (e) => {
      if (e instanceof CustomEvent && e.detail && "value" in e.detail) dispatched = true;
    });

    el.value = ["a", "c"];
    await settle(el);

    const kids = el.querySelectorAll("tulpar-checkbox") as NodeListOf<TulparCheckbox>;
    expect(kids[0].checked).to.be.true;
    expect(kids[1].checked).to.be.false;
    expect(kids[2].checked).to.be.true;
    expect(dispatched).to.be.false;
  });

  it("keeps children independently Tab-reachable (no roving tabindex)", async () => {
    const el = await fixture<TulparCheckboxGroup>(html`
      <tulpar-checkbox-group name="g">
        <tulpar-checkbox value="a"></tulpar-checkbox>
        <tulpar-checkbox value="b"></tulpar-checkbox>
      </tulpar-checkbox-group>
    `);
    await settle(el);
    const kids = el.querySelectorAll("tulpar-checkbox") as NodeListOf<TulparCheckbox>;
    for (const k of kids) {
      expect(box(k).getAttribute("tabindex")).to.equal("0");
    }
  });

  it("name propagation → multiple FormData pairs for multiple checked children", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <tulpar-checkbox-group name="fruits">
          <tulpar-checkbox value="apple"></tulpar-checkbox>
          <tulpar-checkbox value="pear"></tulpar-checkbox>
          <tulpar-checkbox value="plum"></tulpar-checkbox>
        </tulpar-checkbox-group>
      </form>
    `);
    const group = form.querySelector("tulpar-checkbox-group") as TulparCheckboxGroup;
    await settle(group);

    group.value = ["apple", "plum"];
    await settle(group);

    const data = new FormData(form);
    expect(data.getAll("fruits")).to.deep.equal(["apple", "plum"]);
  });

  it("form.reset restores authored checked children", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <tulpar-checkbox-group name="fruits">
          <tulpar-checkbox value="apple" checked></tulpar-checkbox>
          <tulpar-checkbox value="pear"></tulpar-checkbox>
        </tulpar-checkbox-group>
      </form>
    `);
    const group = form.querySelector("tulpar-checkbox-group") as TulparCheckboxGroup;
    await settle(group);
    expect(group.value).to.deep.equal(["apple"]);

    const pear = form.querySelectorAll("tulpar-checkbox")[1] as TulparCheckbox;
    box(pear).click();
    await settle(group);
    expect(group.value).to.deep.equal(["apple", "pear"]);

    form.reset();
    await settle(group);
    expect(new FormData(form).getAll("fruits")).to.deep.equal(["apple"]);
  });

  it("consumer select-all recipe: external checkbox drives group.value to all / none", async () => {
    const wrap = await fixture<HTMLElement>(html`
      <div>
        <tulpar-checkbox id="all"></tulpar-checkbox>
        <tulpar-checkbox-group name="g">
          <tulpar-checkbox value="a"></tulpar-checkbox>
          <tulpar-checkbox value="b"></tulpar-checkbox>
          <tulpar-checkbox value="c"></tulpar-checkbox>
        </tulpar-checkbox-group>
      </div>
    `);
    const group = wrap.querySelector("tulpar-checkbox-group") as TulparCheckboxGroup;
    const all = wrap.querySelector("#all") as TulparCheckbox;
    const allValues = ["a", "b", "c"];
    await settle(group);

    // Consumer wires the parent: checked → select all, unchecked → clear.
    all.addEventListener("change", () => {
      group.value = all.checked ? [...allValues] : [];
    });
    // Consumer derives the parent state from value.length.
    const syncParent = () => {
      const n = group.value.length;
      all.checked = n === allValues.length;
      all.indeterminate = n > 0 && n < allValues.length;
    };
    group.addEventListener("change", syncParent);

    // Select all.
    box(all).click();
    await settle(group);
    const kids = group.querySelectorAll("tulpar-checkbox") as NodeListOf<TulparCheckbox>;
    expect(Array.from(kids).every((k) => k.checked)).to.be.true;
    expect(group.value).to.deep.equal(allValues);

    // Toggle one child off → parent becomes indeterminate via consumer recipe.
    box(kids[1]).click();
    await settle(group);
    expect(group.value).to.deep.equal(["a", "c"]);
    expect(all.indeterminate).to.be.true;
    expect(all.checked).to.be.false;
  });

  it("slotchange: a child added later participates in value", async () => {
    const el = await fixture<TulparCheckboxGroup>(html`
      <tulpar-checkbox-group name="g">
        <tulpar-checkbox value="a" checked></tulpar-checkbox>
      </tulpar-checkbox-group>
    `);
    await settle(el);
    expect(el.value).to.deep.equal(["a"]);

    const added = document.createElement("tulpar-checkbox") as TulparCheckbox;
    added.value = "b";
    el.appendChild(added);
    await settle(el);

    box(added).click();
    await settle(el);
    expect(el.value).to.deep.equal(["a", "b"]);
  });
});
