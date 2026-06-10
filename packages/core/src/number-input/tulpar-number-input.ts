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

  // Steppers
  @property({ type: Boolean, attribute: "hide-steppers", reflect: true }) hideSteppers = false;
  @property({ type: Number, attribute: "step-hold-delay" }) stepHoldDelay = 500;
  @property({ type: Number, attribute: "step-hold-interval" }) stepHoldInterval = 50;

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
          @keydown=${this._onKeydown}
          @wheel=${this._onWheel}
        />
        ${this._renderStatusZone()}
        ${this._renderSteppers()}
        ${this._renderSuffixSlot()}
      </div>
    `;
  }

  // --- Stepper hold logic ---

  private _holdTimer?: number;
  private _holdInterval?: number;

  private _startHold(direction: 1 | -1) {
    this._stepBy(direction);
    this._holdTimer = window.setTimeout(() => {
      this._holdInterval = window.setInterval(() => this._stepBy(direction), this.stepHoldInterval);
    }, this.stepHoldDelay);
  }

  private _stopHold = () => {
    if (this._holdTimer) clearTimeout(this._holdTimer);
    if (this._holdInterval) clearInterval(this._holdInterval);
    this._holdTimer = undefined;
    this._holdInterval = undefined;
  };

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._stopHold();
  }

  private _stepBy(direction: 1 | -1, multiplier = 1) {
    const cur = this.value ?? this.min ?? 0;
    const next = this._clamp(cur + direction * this.step * multiplier);
    this.value = next;
    if (this._focused) {
      this._typingBuffer = String(next);
    }
    this._internals.setFormValue(String(next));
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  private _renderSteppers(): TemplateResult | typeof nothing {
    // Auto-hide at xs (cannot meet 44pt touch target — see spec §4.6 xs constraints).
    if (this._isXs() || this.hideSteppers) return nothing;
    const atMax = this.value !== null && this.max !== undefined && this.value >= this.max;
    const atMin = this.value !== null && this.min !== undefined && this.value <= this.min;
    const disabled = this.disabled || this.readonly;
    return html`
      <div class="field-steppers">
        <button type="button" class="stepper-inc" aria-label="Increment" tabindex="-1"
          ?disabled=${disabled || atMax}
          @pointerdown=${() => this._startHold(1)}
          @pointerup=${this._stopHold}
          @pointerleave=${this._stopHold}
          @pointercancel=${this._stopHold}>
          <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 5 L5 1 L9 5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
        </button>
        <button type="button" class="stepper-dec" aria-label="Decrement" tabindex="-1"
          ?disabled=${disabled || atMin}
          @pointerdown=${() => this._startHold(-1)}
          @pointerup=${this._stopHold}
          @pointerleave=${this._stopHold}
          @pointercancel=${this._stopHold}>
          <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1 L5 5 L9 1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>
        </button>
      </div>
    `;
  }

  private _onKeydown = (e: KeyboardEvent) => {
    let multiplier = 1;
    if (e.shiftKey) multiplier = 10;
    else if (e.ctrlKey || e.metaKey) multiplier = 100;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this._stepBy(1, multiplier);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      this._stepBy(-1, multiplier);
    } else if (e.key === "Home" && this.min !== undefined) {
      e.preventDefault();
      this.value = this.min;
      this._internals.setFormValue(String(this.min));
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (e.key === "End" && this.max !== undefined) {
      e.preventDefault();
      this.value = this.max;
      this._internals.setFormValue(String(this.max));
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

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
