import { html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { SelectionControlBase } from "../_internal/selection-control-base";
import { checkboxStyles } from "./tulpar-checkbox.styles";

/**
 * `<tulpar-checkbox>` — a staged tri-state checkbox.
 *
 * A checkbox is "staged": the user's selection is pending until the surrounding
 * form is submitted. Supports checked, unchecked, and indeterminate states.
 * Form-associated via the base: its value ('on' by default) is submitted under
 * `name` only while checked.
 *
 * Indeterminate is purely presentational — it renders the dash and sets
 * aria-checked="mixed" but does NOT change `checked`. Set it programmatically.
 * Clicking an indeterminate checkbox resolves to checked=true, indeterminate=false.
 */
export class TulparCheckbox extends SelectionControlBase {
  static override styles = [SelectionControlBase.styles, checkboxStyles];

  /** Whether the checkbox is checked. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /**
   * Presentational indeterminate state (aria-checked="mixed").
   * Does NOT affect `checked`. Setting it via JS only.
   * Clicking resolves to checked=true, indeterminate=false.
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** Form value submitted under `name` while checked. */
  @property({ type: String }) value = "on";

  /**
   * Visual variant. 'default' renders a plain checkbox box.
   * 'card' wraps in a bordered card (styling in a later chunk — Chunk 7).
   */
  @property({ type: String, reflect: true }) variant: "default" | "card" = "default";

  private _initialChecked = false;
  private _initialIndeterminate = false;

  override connectedCallback() {
    super.connectedCallback();
    // Capture authored initial state for form reset.
    this._initialChecked = this.checked;
    this._initialIndeterminate = this.indeterminate;
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    // Keep form value in sync with `checked`/`value` — covers the initial
    // render AND programmatic changes (e.g. an Angular wrapper setting `checked`
    // directly, where `_toggle` never runs).
    if (changed.has("checked") || changed.has("value")) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  /** Reset to the authored initial state. */
  override formResetCallback() {
    this.checked = this._initialChecked;
    this.indeterminate = this._initialIndeterminate;
    this._internals.setFormValue(this.checked ? this.value : null);
  }

  private _toggle = () => {
    if (this.disabled || this.readonly) return;
    if (this.indeterminate) {
      // §6.2: resolve mixed → checked, never to unchecked directly.
      this.indeterminate = false;
      this.checked = true;
    } else {
      this.checked = !this.checked;
    }
    this._internals.setFormValue(this.checked ? this.value : null);
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      this._toggle();
    }
  };

  private _onIconSlotChange = (e: Event) => {
    const slot = e.target as HTMLSlotElement;
    const hasIcon = slot.assignedElements({ flatten: true }).length > 0;
    if (hasIcon) this.setAttribute("data-has-icon", "");
    else this.removeAttribute("data-has-icon");
  };

  protected override renderControl(ariaLabel?: string): TemplateResult {
    const { checked, indeterminate, disabled, readonly } = this;
    const ariaChecked = indeterminate ? "mixed" : checked ? "true" : "false";
    return html`
      <span
        class="box"
        part="box"
        role="checkbox"
        tabindex=${disabled ? -1 : 0}
        aria-checked=${ariaChecked}
        aria-label=${ariaLabel ?? nothing}
        aria-required=${this._ariaRequiredAttr()}
        aria-invalid=${this._ariaInvalidAttr()}
        aria-describedby=${this._ariaDescribedBy() ?? nothing}
        aria-disabled=${disabled ? "true" : nothing}
        aria-readonly=${readonly ? "true" : nothing}
        @click=${this._toggle}
        @keydown=${this._onKeydown}
      >
        <svg
          class="glyph glyph--check"
          viewBox="0 0 16 16"
          part="glyph"
          aria-hidden="true"
        >
          <path
            class="tick"
            pathLength="1"
            d="M3.5 8.5 L6.8 11.8 L12.5 4.8"
          />
        </svg>
        <span class="glyph glyph--dash" part="glyph" aria-hidden="true"></span>
        <slot
          name="icon"
          class="glyph glyph--custom"
          @slotchange=${this._onIconSlotChange}
        ></slot>
      </span>
    `;
  }
}

if (!customElements.get("tulpar-checkbox")) {
  customElements.define("tulpar-checkbox", TulparCheckbox);
}
