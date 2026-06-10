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
  @property({ type: Boolean }) autosize = true;
  @property({ type: Number, attribute: "min-rows" }) minRows = 2;
  @property({ type: Number, attribute: "max-rows" }) maxRows = 6;
  @property({ type: Number }) rows?: number;

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
          rows=${this.rows ?? nothing}
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

  override firstUpdated() {
    if (this.rows !== undefined) this.autosize = false;
    if (this.autosize) {
      requestAnimationFrame(() => this._resize());
    }
  }

  override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has("rows") && this.rows !== undefined) {
      this.autosize = false;
    }
    if (this.autosize && (changed.has("value") || changed.has("minRows") || changed.has("maxRows"))) {
      this._resize();
    }
  }

  private _onInput = (e: Event) => {
    this.value = (e.target as HTMLTextAreaElement).value;
    this._internals.setFormValue(this.value);
    if (this.autosize) {
      requestAnimationFrame(() => this._resize());
    }
  };

  private _resize() {
    const ta = this.shadowRoot?.querySelector<HTMLTextAreaElement>("textarea#control");
    if (!ta) return;
    const lineHeight = parseFloat(getComputedStyle(ta).lineHeight) || 20;
    const min = this.minRows * lineHeight;
    const max = this.maxRows * lineHeight;
    ta.style.height = "auto";
    const h = Math.min(Math.max(ta.scrollHeight, min), max);
    ta.style.height = `${h}px`;
    ta.style.overflowY = ta.scrollHeight > max ? "auto" : "hidden";
  }

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
