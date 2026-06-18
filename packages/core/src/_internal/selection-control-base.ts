import { LitElement, html, type CSSResultGroup, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { selectionControlBaseStyles } from "./selection-control-base.styles";
import { selectionMessageRowStyles } from "./selection-message-row.styles";
import { renderMessageRow, type SelectionMessageHost } from "./selection-message-row";

export type SelectionSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SelectionLabelPosition = "start" | "end";

/**
 * Internal abstract base for the Tulpar UI selection family
 * (Switch / Checkbox / Radio).
 *
 * Owns: the `<label class="root">` anatomy (label + description + message
 * row), sizing, custom-fill plumbing, form-association, ARIA id generation.
 * The concrete control surface (track / box) is supplied by the subclass via
 * `renderControl()`.
 *
 * NOT exported from @tulpar-ui/core — never added to src/index.ts. Public
 * components subclass it but never expose its type.
 */
export abstract class SelectionControlBase extends LitElement implements SelectionMessageHost {
  // Explicit CSSResultGroup annotation so subclasses can do
  // `[SelectionControlBase.styles, own]` without a static-side mismatch.
  static override styles: CSSResultGroup = [selectionControlBaseStyles, selectionMessageRowStyles];
  static formAssociated = true;

  protected _internals: ElementInternals;

  // --- Identity (form-association) ---
  @property({ type: String, reflect: true }) name?: string;

  // --- Sizing & layout ---
  @property({ type: String, reflect: true }) size: SelectionSize = "md";
  @property({ type: String, attribute: "label-position", reflect: true })
  labelPosition: SelectionLabelPosition = "end";

  // --- Label ---
  @property({ type: String }) label?: string;

  // --- State ---
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) warn = false;

  // --- Message row ---
  @property({ type: String, attribute: "helper-text" }) helperText?: string;
  @property({ type: String, attribute: "error-text" }) errorText?: string;
  @property({ type: String, attribute: "warn-text" }) warnText?: string;
  @property({ type: Boolean, attribute: "no-message-space", reflect: true }) noMessageSpace = false;

  // --- Custom fill ---
  // Not reflected to an attribute — applied as an inline custom property so it
  // wins on the host without an attribute selector. Setting it toggles
  // data-custom-fill, which flips the glyph to the on-custom contrast color.
  private _color?: string;
  @property({ type: String })
  get color(): string | undefined {
    return this._color;
  }
  set color(value: string | undefined) {
    const old = this._color;
    this._color = value || undefined;
    if (this._color) {
      // Apply as a dedicated inline var rather than --_sel-fill directly, so
      // the disabled token rule in CSS can still override the resolved fill.
      this.style.setProperty("--_sel-custom-fill", this._color);
      this.setAttribute("data-custom-fill", "");
    } else {
      this.style.removeProperty("--_sel-custom-fill");
      this.removeAttribute("data-custom-fill");
    }
    this.requestUpdate("color", old);
  }

  private static _idCounter = 0;
  _msgId = `tulpar-sel-msg-${++SelectionControlBase._idCounter}`;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /** Propagate `<fieldset disabled>` to this control. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  /** Subclasses override to restore their initial value on form reset. */
  formResetCallback() {}

  /** True when an attribute label or a slotted label is present. */
  protected _hasLabel(): boolean {
    return !!this.label || this._hasLabelSlotContent();
  }

  protected _hasLabelSlotContent(): boolean {
    return Array.from(this.children).some((c) => c.slot === "label");
  }

  protected _hasDescriptionSlotContent(): boolean {
    return Array.from(this.children).some((c) => c.slot === "description");
  }

  private _onLabelSlotChange = () => {
    if (this._hasLabel()) this.setAttribute("data-has-label", "");
    else this.removeAttribute("data-has-label");
  };

  private _onDescriptionSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const has = slot.assignedNodes({ flatten: true }).length > 0;
    if (has) this.setAttribute("data-has-description", "");
    else this.removeAttribute("data-has-description");
  };

  protected override firstUpdated() {
    // Seed the has-label attribute for the attribute-only label case
    // (slotchange does not fire when the slot has no assigned light DOM).
    this._onLabelSlotChange();
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has("label")) this._onLabelSlotChange();
  }

  protected _ariaRequiredAttr() {
    return this.required ? "true" : "false";
  }

  protected _ariaInvalidAttr() {
    return this.invalid ? "true" : "false";
  }

  protected _ariaDescribedBy(): string | undefined {
    const hasMessage = !this.noMessageSpace && (this.helperText || this.errorText || this.warnText);
    return hasMessage ? this._msgId : undefined;
  }

  /** Accessible name for the control when no visible label is associated. */
  protected _ariaLabel(): string | undefined {
    return this._hasLabel() ? undefined : this.label;
  }

  /**
   * Subclass supplies the actual control surface (track | box). The optional
   * ariaLabel should be applied to the focusable element when there is no
   * visible label.
   */
  protected abstract renderControl(ariaLabel?: string): TemplateResult;

  protected override render(): TemplateResult {
    const hasLabel = this._hasLabel();
    return html`
      <label class="root" part="base">
        <span class="control" part="control">${this.renderControl(this._ariaLabel())}</span>
        <span class="text" part="text" ?hidden=${!hasLabel}>
          <span class="label" part="label"
            ><slot name="label" @slotchange=${this._onLabelSlotChange}>${this.label}</slot></span
          >
          <span class="description" part="description"
            ><slot name="description" @slotchange=${this._onDescriptionSlotChange}></slot
          ></span>
        </span>
      </label>
      ${renderMessageRow(this)}
    `;
  }
}
