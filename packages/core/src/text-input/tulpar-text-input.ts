import { html, type TemplateResult, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { FormFieldBase } from "../_internal/form-field-base";
import { textInputStyles } from "./tulpar-text-input.styles";
import { warnDev } from "../_internal/warn-dev";
import { MaskController, type MaskHost } from "../_internal/mask-engine";

export type TextInputType = "text" | "email" | "url" | "tel" | "search" | "password";

export class TulparTextInput extends FormFieldBase {
  static override styles = [FormFieldBase.styles, textInputStyles];

  private _clearableExplicitValue: boolean | undefined = undefined;

  @property({ type: String, reflect: true }) type: TextInputType = "text";
  @property({ type: String }) value = "";
  @property({ type: String }) placeholder?: string;
  @property({ type: String }) autocomplete?: string;
  @property({ type: Number, attribute: "maxlength" }) maxLength?: number;
  @property({ type: Number, attribute: "minlength" }) minLength?: number;
  @property({ type: String }) pattern?: string;
  @property({ type: Boolean, reflect: true, noAccessor: true }) clearable = false;
  @property({ type: Boolean, attribute: "show-count" }) showCount = false;
  @property({ type: Boolean, attribute: "no-reveal-toggle" }) noRevealToggle = false;
  @state() private _passwordRevealed = false;
  @state() private _copyConfirm = false;
  @state() private _pasteConfirm = false;

  // --- Mask ---
  @property({ type: String }) mask?: string;
  @property({ type: String, attribute: "mask-emit" }) maskEmit: "masked" | "raw" = "masked";
  @property({ type: String, attribute: "mask-display" }) maskDisplay: "eager" | "lazy" = "eager";
  @property({ type: String, attribute: "mask-slot-char" }) maskSlotChar = "_";

  @state() private _rawValue = "";
  private _maskCtl?: MaskController;

  /** Raw (literal-stripped) value. Always available regardless of mask-emit. */
  get rawValue(): string {
    return this._rawValue;
  }

  /** @internal */
  _maskSetValue(v: string) {
    this.value = v;
    this._internals.setFormValue(v);
  }

  /** @internal */
  _maskSetRaw(v: string) {
    this._rawValue = v;
  }

  /** @internal */
  _maskGetRaw(): string {
    return this._rawValue;
  }

  constructor() {
    super();
    // Create custom accessor for clearable to track when it's explicitly set
    Object.defineProperty(this, "clearable", {
      get() {
        return this._clearableExplicitValue !== undefined ? this._clearableExplicitValue : false;
      },
      set(value: boolean) {
        this._clearableExplicitValue = value;
        // Reflect to attribute
        if (value) {
          this.setAttribute("clearable", "");
        } else {
          this.removeAttribute("clearable");
        }
      },
      enumerable: true,
      configurable: true,
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this._initMask();
  }

  override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has("mask")) this._initMask();
  }

  private _initMask() {
    if (!this.mask) {
      this._maskCtl = undefined;
      return;
    }
    this._maskCtl = new MaskController(new _MaskHostAdapter(this));
    this._maskCtl.compile();
  }

  protected override firstUpdated() {
    this._maybeWarnAutocomplete();
    // Check if clearable was set via attribute
    if (this.hasAttribute("clearable")) {
      this._clearableExplicitValue = true;
    }
  }

  protected override _hasValue(): boolean {
    return this.value !== "";
  }

  private get _effectiveClearable(): boolean {
    // If explicitly set via attribute or property, use that value
    if (this._clearableExplicitValue !== undefined) {
      return this._clearableExplicitValue;
    }
    // Otherwise, for search type, default to true
    if (this.type === "search") {
      return true;
    }
    // For other types, use false
    return false;
  }

  protected override _renderPrefixSlot(): TemplateResult {
    // When type=search and user has not provided a prefix, inject the search icon.
    const hasUserPrefix = this._hasUserPrefixSlot();
    const showSearchIcon = this.type === "search" && !hasUserPrefix;

    if (showSearchIcon) {
      return html`
        <span class="field-prefix-host">
          <span class="field-search-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none" />
              <path
                d="M16 16 L22 22"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </span>
      `;
    }
    // Default behavior: render the prefix slot from light DOM
    return html`<span class="field-prefix-host"><slot name="prefix"></slot></span>`;
  }

  protected override renderControl(ariaLabel?: string): TemplateResult {
    const effectiveType = this.type === "password" && this._passwordRevealed ? "text" : this.type;
    const displayValue = this._maskCtl ? this._maskCtl.displayString() : this.value;
    return html`
      <div class="control-row">
        ${this._renderPrefixSlot()}
        <input
          id="control"
          class="field-input"
          .type=${effectiveType}
          .value=${displayValue}
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
          @beforeinput=${this._onBeforeInput}
          @paste=${this._onPasteEvent}
          @input=${this._onInput}
        />
        ${this._renderStatusZone()} ${this._renderRevealButton()} ${this._renderPasteButton()}
        ${this._renderCopyButton()} ${this._renderClearButton()} ${this._renderSuffixSlot()}
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

  private _hasUserPrefixSlot(): boolean {
    // Check if there are any light DOM children with slot="prefix"
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].slot === "prefix") {
        return true;
      }
    }
    return false;
  }

  private _onInput = (e: Event) => {
    if (this._maskCtl) return; // mask path handles value via beforeinput
    this.value = (e.target as HTMLInputElement).value;
    this._internals.setFormValue(this.value);
  };

  private _onBeforeInput = (e: InputEvent) => {
    if (!this._maskCtl) return; // no mask — let native input flow (handled by @input)
    e.preventDefault();
    if (e.inputType === "deleteContentBackward") {
      this._maskCtl.backspace();
      return;
    }
    if (e.inputType === "insertText" && e.data) {
      for (const ch of e.data) this._maskCtl.acceptChar(ch);
    }
  };

  private _onPasteEvent = (e: ClipboardEvent) => {
    if (!this._maskCtl) return;
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") ?? "";
    this._maskCtl.applyPaste(text);
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

  private _onCopy = async () => {
    try {
      await navigator.clipboard.writeText(this.value);
      this._copyConfirm = true;
      setTimeout(() => {
        this._copyConfirm = false;
      }, 1500);
    } catch {
      // permissions denied — silent
    }
  };

  private _onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (this._maskCtl) {
        this._maskCtl.applyPaste(text);
      } else {
        this.value = text;
        this._internals.setFormValue(text);
      }
      this.dispatchEvent(new Event("change", { bubbles: true }));
      this._pasteConfirm = true;
      setTimeout(() => {
        this._pasteConfirm = false;
      }, 1500);
    } catch {
      // Permission denied or empty — emit data-mask-rejected for shake feedback.
      this.setAttribute("data-mask-rejected", "");
      setTimeout(() => this.removeAttribute("data-mask-rejected"), 200);
    }
  };

  private _renderRevealButton(): TemplateResult | typeof nothing {
    // Auto-hide at xs (cannot meet 44pt touch target — see spec §4.6 xs constraints).
    if (this._isXs() || this.type !== "password" || this.noRevealToggle) return nothing;
    const revealed = this._passwordRevealed;
    return html`
      <button
        type="button"
        class="field-reveal-btn"
        aria-label=${revealed ? "Hide password" : "Show password"}
        @click=${() => {
          this._passwordRevealed = !this._passwordRevealed;
        }}
      >
        ${revealed
          ? html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M1 12 C5 6, 11 4, 12 4 S19 6, 23 12 C19 18, 13 20, 12 20 S5 18, 1 12 Z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <path d="M3 3 L21 21" stroke="currentColor" stroke-width="2" />
            </svg>`
          : html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M1 12 C5 6, 11 4, 12 4 S19 6, 23 12 C19 18, 13 20, 12 20 S5 18, 1 12 Z"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>`}
      </button>
    `;
  }

  private _renderClearButton(): TemplateResult | typeof nothing {
    // Auto-hide at xs (cannot meet 44pt touch target — see spec §4.6 xs constraints).
    if (
      this._isXs() ||
      !this._effectiveClearable ||
      this.disabled ||
      this.readonly ||
      this.value === ""
    )
      return nothing;
    return html`
      <button
        type="button"
        class="field-clear-btn"
        aria-label="Clear value"
        @click=${this._onClear}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 6 L18 18 M18 6 L6 18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            fill="none"
          />
        </svg>
      </button>
    `;
  }

  private _renderCopyButton(): TemplateResult | typeof nothing {
    // Auto-hide at xs (cannot meet 44pt touch target).
    if (this._isXs() || !this.copyable || this.disabled) return nothing;
    return html`
      <button
        type="button"
        class="field-copy-btn"
        aria-label=${this._copyConfirm ? "Copied" : "Copy value"}
        @click=${this._onCopy}
      >
        ${this._copyConfirm
          ? html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 13 l4 4 L19 7" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>`
          : html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <rect
                x="8"
                y="8"
                width="12"
                height="12"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
              <rect
                x="4"
                y="4"
                width="12"
                height="12"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
            </svg>`}
      </button>
    `;
  }

  private _renderPasteButton(): TemplateResult | typeof nothing {
    // Auto-hide at xs (cannot meet 44pt touch target).
    if (this._isXs() || !this.pastable) return nothing;
    const inert = this.disabled || this.readonly;
    return html`
      <button
        type="button"
        class="field-paste-btn"
        aria-label=${this._pasteConfirm ? "Pasted" : "Paste from clipboard"}
        ?disabled=${inert}
        @click=${this._onPaste}
      >
        ${this._pasteConfirm
          ? html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 13 l4 4 L19 7" stroke="currentColor" stroke-width="2" fill="none" />
            </svg>`
          : html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2 v14 M6 10 l6 6 l6 -6"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
              />
            </svg>`}
      </button>
    `;
  }

  protected override _renderMessageRow(): TemplateResult | typeof nothing {
    if (this.noMessageSpace) return nothing;
    if (!this.showCount) return super._renderMessageRow();

    const len = this.value.length;
    const counterText = this.maxLength ? `${len} / ${this.maxLength}` : `${len}`;
    const atLimit = this.maxLength !== undefined && len >= this.maxLength;

    // Compose: include both the base message text AND the counter in the same row.
    return html`
      <div class="field-message-row">
        ${this._renderMessageText()}
        <span class="field-counter" data-at-limit=${atLimit ? "true" : "false"}
          >${counterText}</span
        >
      </div>
    `;
  }
}

/**
 * Module-private adapter — bridges MaskController's MaskHost interface
 * to TulparTextInput's internal methods.
 */
class _MaskHostAdapter implements MaskHost {
  constructor(private el: TulparTextInput) {}

  get value() {
    return this.el.value;
  }
  set value(v: string) {
    this.el._maskSetValue(v);
  }

  get rawValue() {
    return this.el._maskGetRaw();
  }
  set rawValue(v: string) {
    this.el._maskSetRaw(v);
  }

  get mask() {
    return this.el.mask ?? "";
  }
  get maskEmit() {
    return this.el.maskEmit;
  }
  get maskDisplay() {
    return this.el.maskDisplay;
  }
  get maskSlotChar() {
    return this.el.maskSlotChar;
  }

  requestUpdate() {
    this.el.requestUpdate();
  }
  dispatchEvent(e: Event) {
    return this.el.dispatchEvent(e);
  }
  markRejected() {
    this.el.setAttribute("data-mask-rejected", "");
    setTimeout(() => this.el.removeAttribute("data-mask-rejected"), 200);
  }
}

if (!customElements.get("tulpar-text-input")) {
  customElements.define("tulpar-text-input", TulparTextInput);
}
