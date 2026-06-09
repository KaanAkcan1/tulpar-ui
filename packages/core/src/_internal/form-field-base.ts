import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { formFieldBaseStyles } from "./form-field-base.styles";
import { resolveLabelPosition } from "./label-position-resolver";

export type FieldSize = "xs" | "sm" | "md" | "lg" | "xl";
export type FieldVariant = "outlined" | "filled" | "underlined" | "ghost";
export type LabelPosition = "top" | "float" | "float-in" | "float-on" | "none";
export type NecessityIndicator = "icon" | "label" | "none";

/**
 * Internal abstract base class for Tulpar UI input components.
 *
 * Owns: anatomy (label + necessity + position, message row, status visuals,
 * prefix/suffix slots), sizing, variant CSS hooks, form-association plumbing,
 * ARIA wiring.
 *
 * NOT exported from @tulpar-ui/core. Public components subclass it but never
 * expose its type. Consumers see only the concrete tags
 * (<tulpar-text-input>, <tulpar-textarea>, <tulpar-number-input>).
 */
export abstract class FormFieldBase extends LitElement {
  static override styles = formFieldBaseStyles;
  static formAssociated = true;

  protected _internals: ElementInternals;

  // --- Identity (form-association) ---
  @property({ type: String, reflect: true }) name?: string;

  // --- Sizing & visual ---
  @property({ type: String, reflect: true }) size: FieldSize = "md";
  @property({ type: String, reflect: true }) variant: FieldVariant = "outlined";

  // --- State ---
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;

  // --- Label ---
  @property({ type: String }) label?: string;
  @property({ type: String, attribute: 'label-position', reflect: true })
  labelPosition?: LabelPosition;

  // --- Necessity ---
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: String, attribute: 'necessity-indicator' })
  necessityIndicator: NecessityIndicator = 'icon';

  // --- Message row ---
  @property({ type: String, attribute: 'helper-text' }) helperText?: string;
  @property({ type: String, attribute: 'error-text' }) errorText?: string;
  @property({ type: String, attribute: 'warn-text' }) warnText?: string;
  @property({ type: Boolean, attribute: 'no-message-space', reflect: true }) noMessageSpace = false;

  // --- Status ---
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) warn = false;
  @property({ type: Boolean, reflect: true }) validating = false;

  // --- Prefix/Suffix ---
  @property({ type: Boolean, attribute: 'prefix-interactive', reflect: true })
  prefixInteractive = false;

  @property({ type: Boolean, attribute: 'suffix-interactive', reflect: true })
  suffixInteractive = false;

  private static _idCounter = 0;
  protected _msgId = `tulpar-msg-${++FormFieldBase._idCounter}`;

  private _liveAnnouncementTimer?: number;
  @state() private _liveAnnouncement = "";

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has("validating")) {
      if (this._liveAnnouncementTimer) clearTimeout(this._liveAnnouncementTimer);
      if (this.validating) {
        this._liveAnnouncementTimer = window.setTimeout(() => {
          this._liveAnnouncement = "Checking…";
        }, 150);
      } else {
        this._liveAnnouncement = "";
      }
    }
  }

  protected _hasLabelSlotContent(): boolean {
    return Array.from(this.children).some((c) => c.slot === "label");
  }

  protected _renderLabelContent(): TemplateResult {
    const ind = this.necessityIndicator;
    const req = this.required;
    if (ind === 'none') {
      return html`<slot name="label">${this.label}</slot>`;
    }
    if (ind === 'icon') {
      return html`
        <slot name="label">${this.label}</slot>${req
          ? html`<span class="field-required-marker" aria-hidden="true">*</span>`
          : nothing}
      `;
    }
    // label mode
    const suffix = req ? '(required)' : '(optional)';
    return html`<slot name="label">${this.label}</slot> <span class="field-necessity-text">${suffix}</span>`;
  }

  protected _ariaRequiredAttr() {
    return this.required ? 'true' : 'false';
  }

  protected _ariaInvalidAttr() {
    return this.invalid ? 'true' : 'false';
  }

  protected _ariaDescribedBy() {
    const hasMessage = !this.noMessageSpace && (this.helperText || this.errorText || this.warnText);
    return hasMessage ? this._msgId : undefined;
  }

  protected _renderMessageText(): TemplateResult | typeof nothing {
    let text: string | undefined;
    let role: 'alert' | 'status' | undefined;
    let kind: 'error' | 'warn' | 'helper' | undefined;
    if (this.invalid && this.errorText) {
      text = this.errorText;
      role = 'alert';
      kind = 'error';
    } else if (this.warn && this.warnText) {
      text = this.warnText;
      role = 'status';
      kind = 'warn';
    } else if (this.helperText) {
      text = this.helperText;
      kind = 'helper';
    }
    return text
      ? html`<span id=${this._msgId} class="field-message" data-kind=${kind} role=${role ?? nothing}>${text}</span>`
      : nothing;
  }

  protected _renderMessageRow(): TemplateResult | typeof nothing {
    if (this.noMessageSpace) return nothing;
    return html`<div class="field-message-row">${this._renderMessageText()}</div>`;
  }

  protected _renderValidatingLiveRegion(): TemplateResult {
    return html`<span class="field-validating-live" role="status" aria-live="polite">${this._liveAnnouncement}</span>`;
  }

  protected _renderStatusIcon(): TemplateResult | typeof nothing {
    // Precedence: validating > invalid > warn
    let kind: 'validating' | 'invalid' | 'warn' | undefined;
    if (this.validating) kind = 'validating';
    else if (this.invalid) kind = 'invalid';
    else if (this.warn) kind = 'warn';

    if (!kind) return nothing;

    switch (kind) {
      case 'validating':
        // CSS-based rotation (not SVG SMIL) so prefers-reduced-motion @media query disables it.
        return html`<span class="field-status-icon field-status-icon--spin" data-kind="validating">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="36" stroke-dashoffset="9" />
          </svg>
        </span>`;
      case 'invalid':
        return html`<span class="field-status-icon" data-kind="invalid">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path d="M12 6 v8" stroke="white" stroke-width="2" stroke-linecap="round" />
            <circle cx="12" cy="17" r="1.25" fill="white" />
          </svg>
        </span>`;
      case 'warn':
        return html`<span class="field-status-icon" data-kind="warn">
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 L22 20 L2 20 Z" fill="currentColor" />
            <path d="M12 10 v5" stroke="white" stroke-width="2" stroke-linecap="round" />
            <circle cx="12" cy="17.5" r="0.9" fill="white" />
          </svg>
        </span>`;
    }
  }

  protected _renderStatusZone(): TemplateResult {
    return html`
      <span class="field-status-zone" aria-hidden="true">${this._renderStatusIcon()}</span>
    `;
  }

  protected _renderPrefixSlot(): TemplateResult {
    return html`<span class="field-prefix-host"><slot name="prefix"></slot></span>`;
  }

  protected _renderSuffixSlot(): TemplateResult {
    return html`<span class="field-suffix-host"><slot name="suffix"></slot></span>`;
  }

  protected _hasValue(): boolean {
    // Subclasses with non-string value should override.
    const v = (this as unknown as { value?: unknown }).value;
    return v !== undefined && v !== null && v !== "";
  }

  /** True when size is the most compact tier — used to hide action buttons that cannot meet touch target minimums. */
  protected _isXs(): boolean {
    return this.size === "xs";
  }

  protected _ariaBusyAttr() {
    return this.validating ? "true" : undefined;
  }

  protected _resolvedLabelPosition(): LabelPosition {
    return resolveLabelPosition({
      requested: this.labelPosition,
      hasLabel: this._hasLabelSlotContent() || !!this.label,
      variant: this.variant,
      size: this.size,
    });
  }

  /**
   * Subclasses implement the actual control (the underlying <input>,
   * <textarea>, or composite UI).
   */
  protected abstract renderControl(ariaLabel?: string): TemplateResult;

  protected override render() {
    const pos = this._resolvedLabelPosition();
    const showTopLabel = pos === "top";
    const isFloat = pos === "float" || pos === "float-in" || pos === "float-on";
    const ariaLabel = pos === "none" ? this.label : undefined;
    const hasValue = this._hasValue();

    return html`
      <div class="field-shell" data-label-position=${pos} data-has-value=${hasValue ? "" : nothing}>
        ${showTopLabel
          ? html`<label class="field-label" part="label" for="control">${this._renderLabelContent()}</label>`
          : nothing}
        ${this.renderControl(ariaLabel)}
        ${isFloat
          ? html`<label class="field-label field-label--${pos}" part="label" for="control">${this._renderLabelContent()}</label>`
          : nothing}
        ${this._renderMessageRow()}
        ${this._renderValidatingLiveRegion()}
      </div>
    `;
  }
}
