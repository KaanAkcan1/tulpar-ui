import { html, type TemplateResult, nothing } from "lit";
import { property } from "lit/decorators.js";
import { FormFieldBase } from "../_internal/form-field-base";
import { textInputStyles } from "./tulpar-text-input.styles";

export type TextInputType = "text" | "email" | "url" | "tel" | "search" | "password";

export class TulparTextInput extends FormFieldBase {
  static override styles = [FormFieldBase.styles, textInputStyles];

  @property({ type: String, reflect: true }) type: TextInputType = "text";
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder?: string;
  @property({ type: String }) autocomplete?: string;
  @property({ type: Number, attribute: "maxlength" }) maxLength?: number;
  @property({ type: Number, attribute: "minlength" }) minLength?: number;
  @property({ type: String }) pattern?: string;

  protected override _hasValue(): boolean {
    return this.value !== "";
  }

  protected override renderControl(ariaLabel?: string): TemplateResult {
    return html`
      <div class="control-row">
        ${this._renderPrefixSlot()}
        <input
          id="control"
          class="field-input"
          .type=${this.type}
          .value=${this.value}
          placeholder=${this.placeholder ?? nothing}
          autocomplete=${this.autocomplete ?? nothing}
          maxlength=${this.maxLength ?? nothing}
          minlength=${this.minLength ?? nothing}
          pattern=${this.pattern ?? nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          aria-required=${this._ariaRequiredAttr()}
          aria-invalid=${this._ariaInvalidAttr()}
          aria-busy=${this._ariaBusyAttr() ?? nothing}
          aria-describedby=${this._ariaDescribedBy() ?? nothing}
          aria-label=${ariaLabel ?? nothing}
          @input=${this._onInput}
        />
        ${this._renderStatusZone()}
        ${this._renderSuffixSlot()}
      </div>
    `;
  }

  private _onInput = (e: Event) => {
    this.value = (e.target as HTMLInputElement).value;
    this._internals.setFormValue(this.value);
  };
}

if (!customElements.get("tulpar-text-input")) {
  customElements.define("tulpar-text-input", TulparTextInput);
}
