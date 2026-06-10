import { html, type TemplateResult, nothing } from "lit";
import { property } from "lit/decorators.js";
import { FormFieldBase } from "../_internal/form-field-base";
import { textareaStyles } from "./tulpar-textarea.styles";

export class TulparTextarea extends FormFieldBase {
  static override styles = [FormFieldBase.styles, textareaStyles];

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder?: string;
  @property({ type: Number, attribute: "maxlength" }) maxLength?: number;
  @property({ type: Number, attribute: "minlength" }) minLength?: number;

  protected override _hasValue(): boolean {
    return this.value !== "";
  }

  protected override renderControl(ariaLabel?: string): TemplateResult {
    return html`
      <div class="control-row">
        <textarea
          id="control"
          class="field-textarea"
          .value=${this.value}
          placeholder=${this.placeholder ?? nothing}
          maxlength=${this.maxLength ?? nothing}
          minlength=${this.minLength ?? nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          aria-required=${this._ariaRequiredAttr()}
          aria-invalid=${this._ariaInvalidAttr()}
          aria-busy=${this._ariaBusyAttr() ?? nothing}
          aria-describedby=${this._ariaDescribedBy() ?? nothing}
          aria-label=${ariaLabel ?? nothing}
          @input=${this._onInput}
        ></textarea>
      </div>
    `;
  }

  private _onInput = (e: Event) => {
    this.value = (e.target as HTMLTextAreaElement).value;
    this._internals.setFormValue(this.value);
  };

  // Textarea does NOT expose prefix/suffix slots (multi-line + side-slot is
  // visually unsupported — matches AntD/Mantine). Override to render nothing.
  protected override _renderPrefixSlot(): TemplateResult {
    return html``;
  }
  protected override _renderSuffixSlot(): TemplateResult {
    return html``;
  }
}

if (!customElements.get("tulpar-textarea")) {
  customElements.define("tulpar-textarea", TulparTextarea);
}
