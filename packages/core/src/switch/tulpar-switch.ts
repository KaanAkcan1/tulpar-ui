import { html, svg, type TemplateResult, nothing } from "lit";
import { property } from "lit/decorators.js";
import { SelectionControlBase, resolveSelectionColor } from "../_internal/selection-control-base";
import { switchStyles } from "./tulpar-switch.styles";

/** Two-segment tick, round caps, ~1em, currentColor. */
const defaultCheckSvg = svg`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M5 13 l4 4 L19 7" stroke="currentColor" stroke-width="2.5"
    stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

/** X cross, round caps, ~1em, currentColor. */
const defaultCrossSvg = svg`<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <path d="M7 7 L17 17 M17 7 L7 17" stroke="currentColor" stroke-width="2.5"
    stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

/**
 * `<tulpar-switch>` — an immediate-apply on/off toggle.
 *
 * A switch applies its change immediately on toggle (no pending state). It is
 * form-associated via the base: its value ('on' by default) is submitted under
 * `name` only while checked.
 */
export class TulparSwitch extends SelectionControlBase {
  static override styles = [SelectionControlBase.styles, switchStyles];

  /** Whether the switch is on. */
  @property({ type: Boolean, reflect: true }) checked = false;

  /** Form value submitted under `name` while checked. */
  @property({ type: String }) value = "on";

  /** Loading: aria-busy, spinner visible, toggle suppressed. Stays focusable. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Reveal the thumb check/cross icons (hidden by default). */
  @property({ type: Boolean, attribute: "show-icon", reflect: true }) showIcon = false;

  /** Custom checked-track color → inline `--_sw-track-on`. */
  @property({ type: String, attribute: "on-color" }) onColor?: string;

  /** Custom unchecked-track color → inline `--_sw-track-off`. */
  @property({ type: String, attribute: "off-color" }) offColor?: string;

  private _initialChecked = false;

  override connectedCallback() {
    super.connectedCallback();
    // Capture the authored initial state for form reset.
    this._initialChecked = this.checked;
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    // Keep the form value in sync with `checked`/`value` — covers the initial
    // render AND programmatic changes (e.g. an Angular wrapper setting `checked`
    // directly, where `_toggle` never runs).
    if (changed.has("checked") || changed.has("value")) {
      this._internals.setFormValue(this.checked ? this.value : null);
    }
    if (changed.has("onColor")) {
      if (this.onColor)
        this.style.setProperty("--_sw-track-on", resolveSelectionColor(this.onColor));
      else this.style.removeProperty("--_sw-track-on");
    }
    if (changed.has("offColor")) {
      if (this.offColor)
        this.style.setProperty("--_sw-track-off", resolveSelectionColor(this.offColor));
      else this.style.removeProperty("--_sw-track-off");
    }
  }

  /** Reset to the authored initial state. */
  override formResetCallback() {
    this.checked = this._initialChecked;
    this._internals.setFormValue(this.checked ? this.value : null);
  }

  private _toggle = () => {
    if (this.disabled || this.readonly || this.loading) return;
    this.checked = !this.checked;
    this._internals.setFormValue(this.checked ? this.value : null);
    this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
  };

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
      e.preventDefault();
      this._toggle();
    }
  };

  protected override renderControl(ariaLabel?: string): TemplateResult {
    return html`
      <button
        class="track"
        part="track"
        role="switch"
        type="button"
        aria-checked=${this.checked ? "true" : "false"}
        aria-busy=${this.loading ? "true" : nothing}
        aria-label=${ariaLabel ?? nothing}
        aria-required=${this._ariaRequiredAttr()}
        aria-invalid=${this._ariaInvalidAttr()}
        aria-describedby=${this._ariaDescribedBy() ?? nothing}
        ?disabled=${this.disabled}
        @click=${this._toggle}
        @keydown=${this._onKeydown}
      >
        <span class="thumb" part="thumb">
          <span class="thumb-glyph" part="thumb-icon">
            <slot name="icon-on" class="ic ic--on">${defaultCheckSvg}</slot>
            <slot name="icon-off" class="ic ic--off">${defaultCrossSvg}</slot>
            <span class="spinner" aria-hidden="true"></span>
          </span>
        </span>
      </button>
    `;
  }
}

if (!customElements.get("tulpar-switch")) {
  customElements.define("tulpar-switch", TulparSwitch);
}
