import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { expect, fixture, html as testHtml } from "@open-wc/testing";
import { FormFieldBase } from "./form-field-base";

// Test-only concrete subclass. Not exported from the package.
class TestField extends FormFieldBase {
  @property({ type: String }) value = "";

  protected override renderControl() {
    return html`
      <div class="control-row">
        <input
          id="control"
          aria-required=${this._ariaRequiredAttr()}
          .value=${this.value}
          @input=${(e: InputEvent) => {
            this.value = (e.target as HTMLInputElement).value;
            this._internals.setFormValue(this.value);
          }}
        />
        ${(this as unknown as { _renderStatusZone(): unknown })._renderStatusZone()}
      </div>
    `;
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

describe("FormFieldBase label", () => {
  it("renders label from attribute", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field label="Email"></test-form-field>`);
    const labelEl = el.shadowRoot!.querySelector(".field-label");
    expect(labelEl?.textContent?.trim()).to.equal("Email");
  });

  it("renders label from slot, overriding attribute", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field label="ignored">
        <span slot="label">Slot Label</span>
      </test-form-field>
    `);
    const slottedNodes = el.shadowRoot!
      .querySelector<HTMLSlotElement>("slot[name='label']")!
      .assignedElements();
    expect(slottedNodes[0].textContent).to.equal("Slot Label");
  });

  it("hides label row when no label is provided", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field></test-form-field>`);
    const labelEl = el.shadowRoot!.querySelector(".field-label");
    expect(labelEl).to.equal(null);
  });
});

describe("FormFieldBase necessity indicator", () => {
  it("appends asterisk after label when required + indicator=icon", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field label="Email" required></test-form-field>
    `);
    const required = el.shadowRoot!.querySelector(".field-required-marker");
    expect(required?.textContent?.trim()).to.equal("*");
    expect(required?.getAttribute("aria-hidden")).to.equal("true");
  });

  it("renders '(required)' suffix when indicator=label + required", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field label="Email" required necessity-indicator="label"></test-form-field>
    `);
    expect(el.shadowRoot!.textContent).to.match(/Email\s*\(required\)/);
  });

  it("renders '(optional)' suffix when indicator=label + not required", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field label="Phone" necessity-indicator="label"></test-form-field>
    `);
    expect(el.shadowRoot!.textContent).to.match(/Phone\s*\(optional\)/);
  });

  it("renders no marker when indicator=none", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field label="Email" required necessity-indicator="none"></test-form-field>
    `);
    expect(el.shadowRoot!.querySelector(".field-required-marker")).to.equal(null);
  });

  it("sets aria-required when required", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field required></test-form-field>`);
    expect(el.shadowRoot!.querySelector("#control")?.getAttribute("aria-required")).to.equal("true");
  });
});

describe("FormFieldBase message row", () => {
  it("reserves the message row even when no helper/error/warn text is set", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field></test-form-field>`);
    const row = el.shadowRoot!.querySelector(".field-message-row");
    expect(row).to.not.equal(null);
  });

  it("removes the message row when no-message-space is set", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field no-message-space></test-form-field>`);
    expect(el.shadowRoot!.querySelector(".field-message-row")).to.equal(null);
  });

  it("renders helper text when only helperText is set", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field helper-text="Pick a strong password"></test-form-field>`);
    const msg = el.shadowRoot!.querySelector(".field-message");
    expect(msg?.textContent).to.equal("Pick a strong password");
  });

  it("error-text replaces helper-text when invalid", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field helper-text="helper" error-text="bad input" invalid></test-form-field>
    `);
    const msg = el.shadowRoot!.querySelector(".field-message");
    expect(msg?.textContent).to.equal("bad input");
    expect(msg?.getAttribute("role")).to.equal("alert");
  });

  it("warn-text shows when warn + not invalid", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field helper-text="h" warn-text="careful" warn></test-form-field>
    `);
    const msg = el.shadowRoot!.querySelector(".field-message");
    expect(msg?.textContent).to.equal("careful");
    expect(msg?.getAttribute("role")).to.equal("status");
  });

  it("invalid wins over warn", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field warn-text="careful" error-text="bad" invalid warn></test-form-field>
    `);
    expect(el.shadowRoot!.querySelector(".field-message")?.textContent).to.equal("bad");
  });
});

describe("FormFieldBase status icon zone", () => {
  it("renders no status icon when no status is active", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field></test-form-field>`);
    const zone = el.shadowRoot!.querySelector(".field-status-zone");
    // Zone may be in DOM but should be empty (no icon children)
    expect(zone?.children.length ?? 0).to.equal(0);
  });

  it("shows exclamation icon when invalid", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field invalid></test-form-field>`);
    expect(el.shadowRoot!.querySelector(".field-status-icon[data-kind='invalid']")).to.not.equal(null);
  });

  it("shows triangle icon when warn (not invalid)", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field warn></test-form-field>`);
    expect(el.shadowRoot!.querySelector(".field-status-icon[data-kind='warn']")).to.not.equal(null);
  });

  it("shows spinner when validating (overrides invalid+warn icons)", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field invalid warn validating></test-form-field>`);
    expect(el.shadowRoot!.querySelector(".field-status-icon[data-kind='validating']")).to.not.equal(null);
    expect(el.shadowRoot!.querySelector(".field-status-icon[data-kind='invalid']")).to.equal(null);
  });

  it("status icon zone is aria-hidden (message row carries semantic)", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field invalid></test-form-field>`);
    const zone = el.shadowRoot!.querySelector(".field-status-zone");
    expect(zone?.getAttribute("aria-hidden")).to.equal("true");
  });
});
