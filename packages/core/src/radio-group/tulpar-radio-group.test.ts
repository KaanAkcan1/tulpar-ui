import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-radio-group";
import "../radio/tulpar-radio";
import type { TulparRadioGroup } from "./tulpar-radio-group";
import type { TulparRadio } from "../radio/tulpar-radio";

function box(el: TulparRadio): HTMLSpanElement {
  return el.shadowRoot!.querySelector(".box--radio") as HTMLSpanElement;
}

async function settle(el: TulparRadioGroup) {
  await new Promise((r) => setTimeout(r, 0));
  await el.updateComplete;
}

function radios(group: TulparRadioGroup): TulparRadio[] {
  return Array.from(group.querySelectorAll("tulpar-radio")) as TulparRadio[];
}

function arrow(group: TulparRadioGroup, from: TulparRadio, key: string) {
  box(from).dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, composed: true }),
  );
}

describe("public type exports", () => {
  it("re-exports TulparRadioGroup from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparRadioGroup).to.exist;
  });
  it("re-exports TulparRadioGroup from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparRadioGroup).to.exist;
  });
});

describe("<tulpar-radio-group>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-radio-group")).to.exist;
  });

  it("is not form-associated", () => {
    const ctor = customElements.get("tulpar-radio-group") as unknown as {
      formAssociated?: boolean;
    };
    expect(ctor.formAssociated).to.not.equal(true);
  });

  it("renders role=radiogroup with aria-labelledby when labelled", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group label="Pick one" name="g">
        <tulpar-radio value="a"></tulpar-radio>
        <tulpar-radio value="b"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const grp = el.shadowRoot!.querySelector('[role="radiogroup"]') as HTMLElement;
    expect(grp).to.exist;
    expect(grp.getAttribute("aria-labelledby")).to.be.a("string");
  });

  it("authored <tulpar-radio checked> seeds the group value", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a"></tulpar-radio>
        <tulpar-radio value="b" checked></tulpar-radio>
        <tulpar-radio value="c"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    expect(el.value).to.equal("b");
  });

  it("selecting a child sets value, emits composed change {detail.value}, deselects siblings", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a" checked></tulpar-radio>
        <tulpar-radio value="b"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);

    let evt: CustomEvent | null = null;
    el.addEventListener("change", (e) => {
      if (e instanceof CustomEvent && e.detail && "value" in e.detail) evt = e;
    });

    const [a, b] = radios(el);
    box(b).click();
    await settle(el);

    expect(el.value).to.equal("b");
    expect(a.checked).to.be.false;
    expect(b.checked).to.be.true;
    const ce = evt as unknown as CustomEvent;
    expect(ce).to.not.be.null;
    expect(ce.detail.value).to.equal("b");
    expect(ce.bubbles).to.be.true;
    expect(ce.composed).to.be.true;
  });

  it("programmatic value checks the matching child + unchecks others (no re-dispatch)", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a"></tulpar-radio>
        <tulpar-radio value="b"></tulpar-radio>
        <tulpar-radio value="c"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);

    let dispatched = false;
    el.addEventListener("change", (e) => {
      if (e instanceof CustomEvent && e.detail && "value" in e.detail) dispatched = true;
    });

    el.value = "c";
    await settle(el);

    const [a, b, c] = radios(el);
    expect(a.checked).to.be.false;
    expect(b.checked).to.be.false;
    expect(c.checked).to.be.true;
    expect(dispatched).to.be.false;
  });

  it("roving tabindex: only the checked radio is tab-reachable, rest -1", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a"></tulpar-radio>
        <tulpar-radio value="b" checked></tulpar-radio>
        <tulpar-radio value="c"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const [a, b, c] = radios(el);
    expect(a.tabIndex).to.equal(-1);
    expect(b.tabIndex).to.equal(0);
    expect(c.tabIndex).to.equal(-1);
  });

  it("roving tabindex: with none checked, the first non-disabled radio is reachable", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a" disabled></tulpar-radio>
        <tulpar-radio value="b"></tulpar-radio>
        <tulpar-radio value="c"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const [a, b, c] = radios(el);
    expect(a.tabIndex).to.equal(-1);
    expect(b.tabIndex).to.equal(0);
    expect(c.tabIndex).to.equal(-1);
  });

  it("ArrowDown moves selection+focus to the next radio (selection follows focus)", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a" checked></tulpar-radio>
        <tulpar-radio value="b"></tulpar-radio>
        <tulpar-radio value="c"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const [a, b] = radios(el);
    arrow(el, a, "ArrowDown");
    await settle(el);
    expect(el.value).to.equal("b");
    expect(b.checked).to.be.true;
    expect(a.checked).to.be.false;
  });

  it("ArrowRight behaves like ArrowDown", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a" checked></tulpar-radio>
        <tulpar-radio value="b"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const [a] = radios(el);
    arrow(el, a, "ArrowRight");
    await settle(el);
    expect(el.value).to.equal("b");
  });

  it("ArrowDown wraps from last to first", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a"></tulpar-radio>
        <tulpar-radio value="b"></tulpar-radio>
        <tulpar-radio value="c" checked></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const [a, , c] = radios(el);
    arrow(el, c, "ArrowDown");
    await settle(el);
    expect(el.value).to.equal("a");
    expect(a.checked).to.be.true;
  });

  it("ArrowUp / ArrowLeft move to the previous radio with wrap to last", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a" checked></tulpar-radio>
        <tulpar-radio value="b"></tulpar-radio>
        <tulpar-radio value="c"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const [a, b, c] = radios(el);
    arrow(el, a, "ArrowUp");
    await settle(el);
    expect(el.value).to.equal("c"); // wrapped to last
    expect(c.checked).to.be.true;
    expect(b.checked).to.be.false;

    arrow(el, c, "ArrowLeft");
    await settle(el);
    expect(el.value).to.equal("b");
    expect(b.checked).to.be.true;
  });

  it("Home jumps to the first, End to the last non-disabled radio", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a"></tulpar-radio>
        <tulpar-radio value="b" checked></tulpar-radio>
        <tulpar-radio value="c"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const [a, b, c] = radios(el);
    arrow(el, b, "Home");
    await settle(el);
    expect(el.value).to.equal("a");
    expect(a.checked).to.be.true;

    arrow(el, a, "End");
    await settle(el);
    expect(el.value).to.equal("c");
    expect(c.checked).to.be.true;
  });

  it("arrows skip disabled radios", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a" checked></tulpar-radio>
        <tulpar-radio value="b" disabled></tulpar-radio>
        <tulpar-radio value="c"></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    const [a, b, c] = radios(el);
    arrow(el, a, "ArrowDown");
    await settle(el);
    expect(el.value).to.equal("c"); // skipped disabled b
    expect(b.checked).to.be.false;
    expect(c.checked).to.be.true;
  });

  it("name propagation → a single FormData pair for the checked radio", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <tulpar-radio-group name="choice">
          <tulpar-radio value="a"></tulpar-radio>
          <tulpar-radio value="b"></tulpar-radio>
          <tulpar-radio value="c"></tulpar-radio>
        </tulpar-radio-group>
      </form>
    `);
    const group = form.querySelector("tulpar-radio-group") as TulparRadioGroup;
    await settle(group);

    group.value = "b";
    await settle(group);

    const data = new FormData(form);
    expect(data.getAll("choice")).to.deep.equal(["b"]);
  });

  it("form.reset restores the authored checked radio", async () => {
    const form = await fixture<HTMLFormElement>(html`
      <form>
        <tulpar-radio-group name="choice">
          <tulpar-radio value="a" checked></tulpar-radio>
          <tulpar-radio value="b"></tulpar-radio>
        </tulpar-radio-group>
      </form>
    `);
    const group = form.querySelector("tulpar-radio-group") as TulparRadioGroup;
    await settle(group);
    expect(group.value).to.equal("a");

    const [, b] = radios(group);
    box(b).click();
    await settle(group);
    expect(group.value).to.equal("b");

    form.reset();
    await settle(group);
    expect(new FormData(form).getAll("choice")).to.deep.equal(["a"]);
  });

  it("slotchange: a radio added later participates in the group", async () => {
    const el = await fixture<TulparRadioGroup>(html`
      <tulpar-radio-group name="g">
        <tulpar-radio value="a" checked></tulpar-radio>
      </tulpar-radio-group>
    `);
    await settle(el);
    expect(el.value).to.equal("a");

    const added = document.createElement("tulpar-radio") as TulparRadio;
    added.value = "b";
    el.appendChild(added);
    await settle(el);

    box(added).click();
    await settle(el);
    expect(el.value).to.equal("b");
    expect(radios(el)[0].checked).to.be.false;
  });
});
