import { expect, fixture, html } from "@open-wc/testing";
import { html as litHtml, type TemplateResult } from "lit";
import { SelectionControlBase } from "./selection-control-base";

/**
 * Tiny concrete subclass purely for exercising the base. Registers a
 * throwaway tag and fills the abstract control slot with a marker span.
 */
class TestSelectionControl extends SelectionControlBase {
  protected renderControl(): TemplateResult {
    return litHtml`<span class="control" part="control"></span>`;
  }
}
customElements.define("test-selection-control", TestSelectionControl);

async function mount(template = html`<test-selection-control></test-selection-control>`) {
  return fixture<TestSelectionControl>(template);
}

describe("SelectionControlBase — anatomy", () => {
  it("renders a <label class=root> as the click target", async () => {
    const el = await mount();
    const root = el.shadowRoot!.querySelector("label.root");
    expect(root).to.exist;
    expect(root!.getAttribute("part")).to.equal("base");
  });

  it("places the label attribute text in .label", async () => {
    const el = await mount(
      html`<test-selection-control label="Accept terms"></test-selection-control>`,
    );
    const label = el.shadowRoot!.querySelector(".label")!;
    expect(label.textContent).to.contain("Accept terms");
  });

  it("slotted label content wins over the label attribute", async () => {
    const el = await mount(
      html`<test-selection-control label="attr"
        ><span slot="label">Slotted</span></test-selection-control
      >`,
    );
    await el.updateComplete;
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="label"]')!;
    const assigned = slot.assignedNodes({ flatten: true });
    expect(assigned.some((n) => n.textContent?.includes("Slotted"))).to.be.true;
    expect(el.hasAttribute("data-has-label")).to.be.true;
  });

  it("hides .text and omits data-has-label when no label attr and no slot", async () => {
    const el = await mount();
    await el.updateComplete;
    const text = el.shadowRoot!.querySelector<HTMLElement>(".text")!;
    expect(text.hasAttribute("hidden")).to.be.true;
    expect(el.hasAttribute("data-has-label")).to.be.false;
  });
});

describe("SelectionControlBase — properties / reflection", () => {
  it("reflects label-position=start and reverses the row", async () => {
    const el = await mount(
      html`<test-selection-control label="x" label-position="start"></test-selection-control>`,
    );
    expect(el.getAttribute("label-position")).to.equal("start");
    const root = el.shadowRoot!.querySelector(".root")!;
    expect(getComputedStyle(root).flexDirection).to.equal("row-reverse");
  });

  it("reflects size and resolves --_sel-control-size per tier", async () => {
    const el = await mount(html`<test-selection-control size="lg"></test-selection-control>`);
    expect(el.getAttribute("size")).to.equal("lg");
    const root = el.shadowRoot!.querySelector(".root")!;
    expect(getComputedStyle(root).getPropertyValue("--_sel-control-size").trim()).to.equal("20px");
  });

  it("blocks interaction and reflects when disabled", async () => {
    const el = await mount(html`<test-selection-control disabled></test-selection-control>`);
    expect(el.hasAttribute("disabled")).to.be.true;
    const root = el.shadowRoot!.querySelector(".root")!;
    expect(getComputedStyle(root).pointerEvents).to.equal("none");
  });

  it("stays interactive when readonly (focusable)", async () => {
    const el = await mount(html`<test-selection-control readonly></test-selection-control>`);
    expect(el.hasAttribute("readonly")).to.be.true;
    const root = el.shadowRoot!.querySelector(".root")!;
    expect(getComputedStyle(root).pointerEvents).to.not.equal("none");
  });

  it("plumbs required to a reflected attribute", async () => {
    const el = await mount(html`<test-selection-control required></test-selection-control>`);
    expect(el.hasAttribute("required")).to.be.true;
  });
});

describe("SelectionControlBase — message row", () => {
  it("shows an error with role=alert when invalid + errorText", async () => {
    const el = await mount(
      html`<test-selection-control invalid error-text="Required field"></test-selection-control>`,
    );
    await el.updateComplete;
    const node = el.shadowRoot!.querySelector('[role="alert"]')!;
    expect(node).to.exist;
    expect(node.textContent).to.contain("Required field");
  });
});

describe("SelectionControlBase — custom fill", () => {
  it("applies the custom fill inline and resolves --_sel-fill to it", async () => {
    const el = await mount();
    el.color = "#f00";
    await el.updateComplete;
    // Setter writes an inline --_sel-custom-fill var so the disabled rule can
    // still override; data-custom-fill makes --_sel-fill resolve through it.
    expect(el.style.getPropertyValue("--_sel-custom-fill")).to.equal("#f00");
    expect(el.hasAttribute("data-custom-fill")).to.be.true;
    expect(getComputedStyle(el).getPropertyValue("--_sel-fill").trim()).to.equal("#f00");
  });

  it("muted disabled fill overrides the custom fill", async () => {
    const el = await mount(html`<test-selection-control disabled></test-selection-control>`);
    el.color = "#f00";
    await el.updateComplete;
    // disabled token rule wins over the inline custom fill on :host
    const resolved = getComputedStyle(el).getPropertyValue("--_sel-fill").trim();
    expect(resolved).to.not.equal("#f00");
  });
});

describe("SelectionControlBase — form association", () => {
  it("is form-associated", () => {
    expect(SelectionControlBase.formAssociated).to.be.true;
  });
});
