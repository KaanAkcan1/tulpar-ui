import { html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { SelectionControlBase } from "../_internal/selection-control-base";
import { radioStyles } from "./tulpar-radio.styles";

/**
 * `<tulpar-radio>` — a single radio button within a `<tulpar-radio-group>`.
 *
 * A radio is identity-bearing: its `value` distinguishes it from its siblings.
 * Selecting it sets `checked=true`; a radio NEVER toggles itself off on click —
 * only the surrounding group deselects siblings when another is chosen.
 * Form-associated via the base: its `value` is submitted under `name` only
 * while checked (the group mirrors a single `name` onto all radios, so exactly
 * one value submits).
 *
 * There is no custom-icon slot: a dot is the canonical glyph (an icon would
 * read as a checkbox).
 *
 * Tabindex is normally managed by the GROUP (roving). Standalone, the radio's
 * own `tabindex=0` default applies.
 */
export class TulparRadio extends SelectionControlBase {
  static override styles = [SelectionControlBase.styles, radioStyles];

  /** Identity within the group + form value submitted under `name` while checked. */
  @property({ type: String }) value!: string;

  /** Whether the radio is selected. Group-driven in a group; settable standalone. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /**
   * Visual variant. 'default' renders a plain radio box. 'card' wraps in a
   * bordered card (styling in a later chunk — Chunk 7).
   */
  @property({ type: String, reflect: true }) variant: "default" | "card" = "default";

  private _initialChecked = false;

  override connectedCallback() {
    super.connectedCallback();
    // Capture authored initial state for form reset.
    this._initialChecked = this.checked;
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    // Keep form value in sync with `checked`/`value` — covers the initial
    // render AND programmatic changes (e.g. a group/wrapper setting `checked`
    // directly, where `_select` never runs).
    if (changed.has("checked") || changed.has("value")) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
  }

  /** Reset to the authored initial state. */
  override formResetCallback() {
    this.checked = this._initialChecked;
    this._internals.setFormValue(this.checked ? this.value : null);
  }

  /**
   * User selection. A radio only ever selects itself (sets checked=true); it
   * never un-checks itself on click. The group catches the bubbling `change`,
   * reconciles its value, and deselects siblings via apply-down.
   */
  private _select = () => {
    if (this.disabled || this.readonly) return;
    if (this.checked) return; // already selected — no-op, no re-dispatch.
    this.checked = true;
    this._internals.setFormValue(this.value);
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      this._select();
    }
  };

  protected override renderControl(ariaLabel?: string): TemplateResult {
    const { checked, disabled, readonly } = this;
    return html`
      <span
        class="box box--radio"
        part="box"
        role="radio"
        tabindex=${disabled ? -1 : 0}
        aria-checked=${checked ? "true" : "false"}
        aria-label=${ariaLabel ?? nothing}
        aria-disabled=${disabled ? "true" : nothing}
        aria-readonly=${readonly ? "true" : nothing}
        @click=${this._select}
        @keydown=${this._onKeydown}
      >
        <span class="dot" part="glyph"></span>
      </span>
    `;
  }
}

if (!customElements.get("tulpar-radio")) {
  customElements.define("tulpar-radio", TulparRadio);
}
