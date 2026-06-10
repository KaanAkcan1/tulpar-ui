import { html, type TemplateResult, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { FormFieldBase } from "../_internal/form-field-base";
import { textInputStyles } from "./tulpar-text-input.styles";
import { warnDev } from "../_internal/warn-dev";

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

  constructor() {
    super();
    // Create custom accessor for clearable to track when it's explicitly set
    Object.defineProperty(this, 'clearable', {
      get() {
        return this._clearableExplicitValue !== undefined ? this._clearableExplicitValue : false;
      },
      set(value: boolean) {
        this._clearableExplicitValue = value;
        // Reflect to attribute
        if (value) {
          this.setAttribute('clearable', '');
        } else {
          this.removeAttribute('clearable');
        }
      },
      enumerable: true,
      configurable: true
    });
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
              <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M16 16 L22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
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
    return html`
      <div class="control-row">
        ${this._renderPrefixSlot()}
        <input
          id="control"
          class="field-input"
          .type=${effectiveType}
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
        ${this._renderRevealButton()}
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

  private _renderRevealButton(): TemplateResult | typeof nothing {
    // Auto-hide at xs (cannot meet 44pt touch target — see spec §4.6 xs constraints).
    if (this._isXs() || this.type !== "password" || this.noRevealToggle) return nothing;
    const revealed = this._passwordRevealed;
    return html`
      <button
        type="button"
        class="field-reveal-btn"
        aria-label=${revealed ? "Hide password" : "Show password"}
        @click=${() => { this._passwordRevealed = !this._passwordRevealed; }}
      >
        ${revealed
          ? html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M1 12 C5 6, 11 4, 12 4 S19 6, 23 12 C19 18, 13 20, 12 20 S5 18, 1 12 Z" stroke="currentColor" stroke-width="2" fill="none"/>
              <path d="M3 3 L21 21" stroke="currentColor" stroke-width="2"/>
            </svg>`
          : html`<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M1 12 C5 6, 11 4, 12 4 S19 6, 23 12 C19 18, 13 20, 12 20 S5 18, 1 12 Z" stroke="currentColor" stroke-width="2" fill="none"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>
            </svg>`}
      </button>
    `;
  }

  private _renderClearButton(): TemplateResult | typeof nothing {
    // Auto-hide at xs (cannot meet 44pt touch target — see spec §4.6 xs constraints).
    if (this._isXs() || !this._effectiveClearable || this.disabled || this.readonly || this.value === "") return nothing;
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
        <span class="field-counter" data-at-limit=${atLimit ? "true" : "false"}>${counterText}</span>
      </div>
    `;
  }
}

if (!customElements.get("tulpar-text-input")) {
  customElements.define("tulpar-text-input", TulparTextInput);
}
