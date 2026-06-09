import { LitElement, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { formFieldBaseStyles } from "./form-field-base.styles";

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

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /**
   * Subclasses implement the actual control (the underlying <input>,
   * <textarea>, or composite UI).
   */
  protected abstract renderControl(): TemplateResult;

  protected override render() {
    return html`
      <div class="field-shell">
        ${this.renderControl()}
      </div>
    `;
  }
}
