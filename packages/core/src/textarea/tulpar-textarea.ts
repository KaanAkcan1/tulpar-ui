import { html, type TemplateResult, nothing } from "lit";
import { property, state } from "lit/decorators.js";
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
  @property({ type: String, reflect: true })
  resize: "none" | "both" | "horizontal" | "vertical" = "vertical";

  @property({ type: Boolean, attribute: "show-count", reflect: true }) showCount = false;

  @state() private _copyConfirm = false;
  @state() private _pasteConfirm = false;

  protected override _hasValue(): boolean {
    return this.value !== "";
  }

  private _onCopy = async () => {
    try {
      await navigator.clipboard.writeText(this.value);
      this._copyConfirm = true;
      setTimeout(() => { this._copyConfirm = false; }, 1500);
    } catch {
      // permission denied — silent
    }
  };

  private _onPasteAction = async () => {
    try {
      const text = await navigator.clipboard.readText();
      this.value = text;
      this._internals.setFormValue(text);
      this.dispatchEvent(new Event("change", { bubbles: true }));
      if (this.autosize) this._resize();
      this._pasteConfirm = true;
      setTimeout(() => { this._pasteConfirm = false; }, 1500);
    } catch {
      this.setAttribute("data-mask-rejected", "");
      setTimeout(() => this.removeAttribute("data-mask-rejected"), 200);
    }
  };

  private _renderActions(): TemplateResult | typeof nothing {
    const showCopy = !this._isXs() && this.copyable && !this.disabled;
    const showPaste = !this._isXs() && this.pastable;
    const hasStatus = this.validating || this.invalid || this.warn;
    if (!showCopy && !showPaste && !hasStatus) return nothing;
    const pasteInert = this.disabled || this.readonly;
    return html`
      <div class="field-textarea-actions">
        ${this._renderStatusZone()}
        ${showPaste
          ? html`<button type="button" class="field-paste-btn"
              aria-label=${this._pasteConfirm ? "Pasted" : "Paste from clipboard"}
              ?disabled=${pasteInert}
              @click=${this._onPasteAction}>
              ${this._pasteConfirm
                ? html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13 l4 4 L19 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>`
                : html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 v14 M6 10 l6 6 l6 -6" stroke="currentColor" stroke-width="2" fill="none"/></svg>`}
            </button>`
          : nothing}
        ${showCopy
          ? html`<button type="button" class="field-copy-btn"
              aria-label=${this._copyConfirm ? "Copied" : "Copy value"}
              @click=${this._onCopy}>
              ${this._copyConfirm
                ? html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 13 l4 4 L19 7" stroke="currentColor" stroke-width="2" fill="none"/></svg>`
                : html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/><rect x="4" y="4" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/></svg>`}
            </button>`
          : nothing}
      </div>
    `;
  }

  private _renderCounter(): TemplateResult | typeof nothing {
    if (!this.showCount) return nothing;
    const len = this.value.length;
    const txt = this.maxLength ? `${len} / ${this.maxLength}` : `${len}`;
    const atLimit = this.maxLength !== undefined && len >= this.maxLength;
    return html`<span class="field-textarea-counter" data-at-limit=${atLimit ? "true" : "false"}>${txt}</span>`;
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
        ${this._renderActions()}
        ${this._renderCounter()}
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
