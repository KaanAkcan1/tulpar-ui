import { html, type TemplateResult, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { FormFieldBase } from "../_internal/form-field-base";
import { buildIntlOptions } from "../_internal/intl-format-builder";
import { numberInputStyles } from "./tulpar-number-input.styles";

export class TulparNumberInput extends FormFieldBase {
  static override styles = [FormFieldBase.styles, numberInputStyles];

  @property({ type: Number }) value: number | null = null;
  @property({ type: Number }) min?: number;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) step = 1;
  @property({ type: String }) placeholder?: string;
  @property({ type: Boolean, attribute: "allow-empty" }) allowEmpty = true;
  @property({ type: Boolean, attribute: "integer-only", reflect: true }) integerOnly = false;

  // Format — shorthand attribute layer
  @property({ type: String, attribute: "format-style" })
  formatStyle: "decimal" | "currency" | "percent" = "decimal";
  @property({ type: String }) currency?: string;
  @property({ type: String }) locale: string =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  @property({ type: Number, attribute: "min-fraction-digits" }) minFractionDigits?: number;
  @property({ type: Number, attribute: "max-fraction-digits" }) maxFractionDigits?: number;
  @property({ type: Boolean, attribute: "use-grouping" }) useGrouping = true;
  @property({ type: String, attribute: "format-prefix" }) formatPrefix?: string;
  @property({ type: String, attribute: "format-suffix" }) formatSuffix?: string;

  // Format — full Intl property (advanced; JS only)
  @property({ attribute: false }) formatOptions?: Intl.NumberFormatOptions;

  @state() private _focused = false;
  @state() private _typingBuffer: string | null = null;

  protected override _hasValue(): boolean {
    return this.value !== null && !Number.isNaN(this.value);
  }

  private get _intl(): Intl.NumberFormat {
    return new Intl.NumberFormat(
      this.locale,
      buildIntlOptions({
        formatStyle: this.formatStyle,
        currency: this.currency,
        useGrouping: this.useGrouping,
        minFractionDigits: this.minFractionDigits,
        maxFractionDigits: this.maxFractionDigits,
        integerOnly: this.integerOnly,
        formatOptions: this.formatOptions,
      }),
    );
  }

  private get _displayValue(): string {
    if (this._focused && this._typingBuffer !== null) return this._typingBuffer;
    if (this.value === null || Number.isNaN(this.value)) return "";
    const formatted = this._intl.format(this.value);
    return `${this.formatPrefix ?? ""}${formatted}${this.formatSuffix ?? ""}`;
  }

  protected override renderControl(ariaLabel?: string): TemplateResult {
    return html`
      <div class="control-row">
        ${this._renderPrefixSlot()}
        <input
          id="control"
          class="field-input"
          type="text"
          inputmode=${this.integerOnly ? "numeric" : "decimal"}
          .value=${this._displayValue}
          placeholder=${this.placeholder ?? nothing}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          aria-required=${this._ariaRequiredAttr()}
          aria-invalid=${this._ariaInvalidAttr()}
          aria-busy=${this._ariaBusyAttr() ?? nothing}
          aria-describedby=${this._ariaDescribedBy() ?? nothing}
          aria-label=${ariaLabel ?? nothing}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
          @input=${this._onInput}
          @wheel=${this._onWheel}
        />
        ${this._renderStatusZone()}
        ${this._renderSuffixSlot()}
      </div>
    `;
  }

  private _onWheel = (e: WheelEvent) => {
    // Mouse-wheel increment disabled by design (a11y / accidental-edit hazard;
    // all 10 surveyed enterprise systems agree).
    if (this._focused) e.preventDefault();
  };

  private _onFocus = () => {
    this._focused = true;
    // Seed buffer with the raw (unformatted) number so the user edits digits, not grouping chars.
    this._typingBuffer = this.value === null || Number.isNaN(this.value) ? "" : String(this.value);
  };

  private _onInput = (e: Event) => {
    this._typingBuffer = (e.target as HTMLInputElement).value;
  };

  private _onBlur = () => {
    this._focused = false;
    const parsed = this._parseTypingBuffer();
    if (parsed !== undefined) {
      this.value = this._clamp(parsed);
    } else if (this._typingBuffer === "" && this.allowEmpty) {
      this.value = null;
    }
    this._typingBuffer = null;
    this._internals.setFormValue(this.value === null ? null : String(this.value));
    this.dispatchEvent(new Event("change", { bubbles: true }));
  };

  private _parseTypingBuffer(): number | undefined {
    if (this._typingBuffer === null || this._typingBuffer === "") {
      return this.allowEmpty ? undefined : (this.min ?? 0);
    }
    // Heuristic cleanup: strip everything except digits, sign, separators; normalize comma to dot.
    const cleaned = this._typingBuffer
      .replace(/[^\d.,\-]/g, "")
      .replace(",", ".");
    const n = parseFloat(cleaned);
    return Number.isNaN(n) ? undefined : n;
  }

  protected _clamp(n: number): number {
    if (this.min !== undefined && n < this.min) return this.min;
    if (this.max !== undefined && n > this.max) return this.max;
    return n;
  }
}

if (!customElements.get("tulpar-number-input")) {
  customElements.define("tulpar-number-input", TulparNumberInput);
}
