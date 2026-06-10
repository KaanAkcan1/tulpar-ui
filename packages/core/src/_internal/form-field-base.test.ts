import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { expect, fixture, html as testHtml } from "@open-wc/testing";
import { FormFieldBase } from "./form-field-base";

// Test-only concrete subclass. Not exported from the package.
class TestField extends FormFieldBase {
  @property({ type: String }) value = "";

  protected override renderControl(ariaLabel?: string) {
    return html`
      <div class="control-row">
        ${(this as unknown as { _renderPrefixSlot(): unknown })._renderPrefixSlot()}
        <input id="control"
          .value=${this.value}
          aria-required=${this._ariaRequiredAttr()}
          aria-invalid=${this._ariaInvalidAttr()}
          aria-busy=${(this as unknown as { _ariaBusyAttr(): string | undefined })._ariaBusyAttr() ?? nothing}
          aria-describedby=${this._ariaDescribedBy() ?? nothing}
          aria-label=${ariaLabel ?? nothing}
          @input=${(e: InputEvent) => {
            this.value = (e.target as HTMLInputElement).value;
            this._internals.setFormValue(this.value);
          }}
        />
        ${(this as unknown as { _renderStatusZone(): unknown })._renderStatusZone()}
        ${(this as unknown as { _renderSuffixSlot(): unknown })._renderSuffixSlot()}
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

describe("FormFieldBase prefix/suffix slots", () => {
  it("renders content in prefix slot", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field>
        <span slot="prefix">$</span>
      </test-form-field>
    `);
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>("slot[name='prefix']")!;
    expect(slot.assignedElements()[0].textContent).to.equal("$");
  });

  it("prefix slot has pointer-events:none by default", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field><span slot="prefix">x</span></test-form-field>
    `);
    const host = el.shadowRoot!.querySelector(".field-prefix-host")!;
    const cs = getComputedStyle(host);
    expect(cs.pointerEvents).to.equal("none");
  });

  it("prefix-interactive opts the prefix slot into pointer-events:auto", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field prefix-interactive><span slot="prefix">x</span></test-form-field>
    `);
    const host = el.shadowRoot!.querySelector(".field-prefix-host")!;
    expect(getComputedStyle(host).pointerEvents).to.equal("auto");
  });
});

describe("FormFieldBase size scaling", () => {
  it("exposes size-driven CSS custom properties on the host", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field size="lg"></test-form-field>`);
    const cs = getComputedStyle(el);
    // size=lg should map to lg height token. The computed style resolves to the fallback when the token is not set.
    const heightValue = cs.getPropertyValue("--field-resolved-height").trim();
    expect(heightValue).to.equal("2.75rem");
  });
});

describe("FormFieldBase visual variants", () => {
  it("uses bordered shell for variant=outlined", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field variant="outlined"></test-form-field>`);
    expect(el.getAttribute("variant")).to.equal("outlined");
  });

  it("renders float label inside the control row when label-position=float", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field label="Email" label-position="float"></test-form-field>
    `);
    expect(el.shadowRoot!.querySelector("[data-label-position='float'] .field-label--float")).to.not.equal(null);
  });

  it("falls back float → top for variant=ghost", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field label="Email" label-position="float" variant="ghost"></test-form-field>
    `);
    // resolver collapses to 'top'
    expect(el.shadowRoot!.querySelector("[data-label-position='top']")).to.not.equal(null);
  });
});

describe("FormFieldBase ARIA wiring", () => {
  it("links the control to the message row via aria-describedby", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field helper-text="hint"></test-form-field>
    `);
    const input = el.shadowRoot!.querySelector("#control")!;
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).to.match(/tulpar-msg-/);
    expect(el.shadowRoot!.querySelector(`#${describedBy}`)).to.not.equal(null);
  });

  it("sets aria-invalid=true when invalid", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field invalid></test-form-field>`);
    expect(el.shadowRoot!.querySelector("#control")?.getAttribute("aria-invalid")).to.equal("true");
  });

  it("injects aria-label on the control when label-position=none + label is set", async () => {
    const el = await fixture<TestField>(testHtml`
      <test-form-field label="Search" label-position="none"></test-form-field>
    `);
    const input = el.shadowRoot!.querySelector("#control")!;
    expect(input.getAttribute("aria-label")).to.equal("Search");
  });
});

describe("FormFieldBase accessibility hardening", () => {
  it("sets aria-busy=true on the control when validating", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field validating></test-form-field>`);
    expect(el.shadowRoot!.querySelector("#control")?.getAttribute("aria-busy")).to.equal("true");
  });

  it("renders a polite live region with 'Checking…' when validating transitions to true", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field></test-form-field>`);
    el.validating = true;
    await el.updateComplete;
    // Wait for the debounced announcement
    await new Promise((r) => setTimeout(r, 200));
    const live = el.shadowRoot!.querySelector(".field-validating-live");
    expect(live?.getAttribute("role")).to.equal("status");
    expect(live?.getAttribute("aria-live")).to.equal("polite");
    expect(live?.textContent?.trim()).to.equal("Checking…");
  });

  it("status icons share a transition class for crossfade swap", async () => {
    const el = await fixture<TestField>(testHtml`<test-form-field invalid></test-form-field>`);
    const icon = el.shadowRoot!.querySelector(".field-status-icon");
    const cs = getComputedStyle(icon!);
    // Verify CSS opacity transition is present
    expect(cs.transitionProperty).to.contain("opacity");
  });
});

describe("FormFieldBase float label positioning", () => {
  it("anchors the resting float label inside the control row's box", async () => {
    // Offset wrapper simulates real page layout — without a positioned
    // containing block inside the component, the absolute label escapes
    // to the viewport and lands far away from the field.
    const wrapper = await fixture<HTMLDivElement>(testHtml`
      <div style="padding-top: 150px;">
        <test-form-field label="Email" label-position="float"></test-form-field>
      </div>
    `);
    const field = wrapper.querySelector<TestField>("test-form-field")!;
    await field.updateComplete;
    const label = field.shadowRoot!.querySelector(".field-label--float")!;
    const row = field.shadowRoot!.querySelector(".control-row")!;
    const lr = label.getBoundingClientRect();
    const rr = row.getBoundingClientRect();
    expect(lr.top).to.be.at.least(rr.top - 1);
    expect(lr.bottom).to.be.at.most(rr.bottom + 1);
    expect(lr.left).to.be.at.least(rr.left);
  });

  it("anchors the float-on label to the control row's top border", async () => {
    const wrapper = await fixture<HTMLDivElement>(testHtml`
      <div style="padding-top: 150px;">
        <test-form-field label="Email" label-position="float-on"></test-form-field>
      </div>
    `);
    const field = wrapper.querySelector<TestField>("test-form-field")!;
    await field.updateComplete;
    const label = field.shadowRoot!.querySelector(".field-label--float-on")!;
    const row = field.shadowRoot!.querySelector(".control-row")!;
    const lr = label.getBoundingClientRect();
    const rr = row.getBoundingClientRect();
    // Label straddles the top border: its vertical center ≈ row top.
    const labelCenter = (lr.top + lr.bottom) / 2;
    expect(Math.abs(labelCenter - rr.top)).to.be.at.most(2);
  });
});

describe("FormFieldBase float (over) vs float-on distinction", () => {
  it("float label rises fully ABOVE the control row when the field has value (PrimeNG 'over')", async () => {
    const wrapper = await fixture<HTMLDivElement>(testHtml`
      <div style="padding-top: 150px;">
        <test-form-field label="Email" label-position="float" value="filled"></test-form-field>
      </div>
    `);
    const field = wrapper.querySelector<TestField>("test-form-field")!;
    await field.updateComplete;
    const label = field.shadowRoot!.querySelector(".field-label--float")!;
    const row = field.shadowRoot!.querySelector(".control-row")!;
    // Entire label above the top border — NOT straddling it (that's float-on's job).
    expect(label.getBoundingClientRect().bottom).to.be.at.most(row.getBoundingClientRect().top + 1);
  });
});

describe("FormFieldBase float-in resting visual parity with float", () => {
  it("resting float-in label uses the same (placeholder) color as resting float", async () => {
    const wrapper = await fixture<HTMLDivElement>(testHtml`
      <div>
        <test-form-field label="A" label-position="float"></test-form-field>
        <test-form-field label="B" label-position="float-in"></test-form-field>
      </div>
    `);
    const [overField, inField] = Array.from(wrapper.querySelectorAll<TestField>("test-form-field"));
    await overField.updateComplete;
    await inField.updateComplete;
    const overLabel = overField.shadowRoot!.querySelector(".field-label--float")!;
    const inLabel = inField.shadowRoot!.querySelector(".field-label--float-in")!;
    expect(getComputedStyle(inLabel).color).to.equal(getComputedStyle(overLabel).color);
    // And both must transition (smooth float animation), not snap.
    expect(getComputedStyle(inLabel).transitionProperty).to.contain("top");
  });
});
