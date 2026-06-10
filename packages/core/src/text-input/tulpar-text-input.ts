import { html, type TemplateResult, nothing } from "lit";
import { property } from "lit/decorators.js";
import { FormFieldBase } from "../_internal/form-field-base";
import { textInputStyles } from "./tulpar-text-input.styles";
import { warnDev } from "../_internal/warn-dev";

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
  @property({ type: Boolean, reflect: true }) clearable = false;

  protected override firstUpdated() {
    this._maybeWarnAutocomplete();
  }

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
        ${this._renderClearButton()}
        ${this._renderSuffixSlot()}
      </div>
    `;
  }

  private _maybeWarnAutocomplete() {
    const sensitive = ["email", "password", "tel"] as const;
    if ((sensitive as readonly string[]).includes(this.type) && !this.autocomplete) {
      warnDev(
        `[tulpar] <tulpar-text-input type="${this.type}"> has no 'autocomplete' attribute. Set one (e.g. autocomplete="current-password") to improve security and browser autofill UX.`,
      );
    }
  }

  private _onInput = (e: Event) => {
    this.value = (e.target as HTMLInputElement).value;
    this._internals.setFormValue(this.value);
  };

  private _onClear = () => {
    this.value = "";
    this._internals.setFormValue("");
    this.dispatchEvent(new Event("change", { bubbles: true }));
    this.requestUpdate();
    // re-focus the underlying input
    queueMicrotask(() => {
      this.shadowRoot?.querySelector<HTMLInputElement>("#control")?.focus();
    });
  };

  private _renderClearButton(): TemplateResult | typeof nothing {
    // Auto-hide at xs (cannot meet 44pt touch target — see spec §4.6 xs constraints).
    if (this._isXs() || !this.clearable || this.disabled || this.readonly || this.value === "") return nothing;
    return html`
      <button
        type="button"
        class="field-clear-btn"
        aria-label="Clear value"
        @click=${this._onClear}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
        </svg>
      </button>
    `;
  }
}

if (!customElements.get("tulpar-text-input")) {
  customElements.define("tulpar-text-input", TulparTextInput);
}
