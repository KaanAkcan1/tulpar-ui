import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { expect, fixture, html as testHtml } from "@open-wc/testing";
import { FormFieldBase } from "./form-field-base";

// Test-only concrete subclass. Not exported from the package.
class TestField extends FormFieldBase {
  @property({ type: String }) value = "";

  protected override renderControl() {
    return html`<input
      .value=${this.value}
      @input=${(e: InputEvent) => {
        this.value = (e.target as HTMLInputElement).value;
        this._internals.setFormValue(this.value);
      }}
    />`;
  }
}
if (!customElements.get("test-form-field")) {
  customElements.define("test-form-field", TestField);
}

describe("FormFieldBase skeleton", () => {
  it("registers as a form-associated custom element", () => {
    expect((TestField as unknown as { formAssociated: boolean }).formAssociated).to.equal(true);
  });

  it("renders with display:block and full width", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field></test-form-field>`);
    const cs = getComputedStyle(el);
    expect(cs.display).to.equal("block");
  });

  it("participates in form submission via setFormValue", async () => {
    const form = await fixture<HTMLFormElement>(testHtml`
      <form>
        <test-form-field name="myfield"></test-form-field>
      </form>
    `);
    const field = form.querySelector<TestField>("test-form-field")!;
    field.value = "hello";
    field["_internals"].setFormValue("hello");
    const fd = new FormData(form);
    expect(fd.get("myfield")).to.equal("hello");
  });
});
