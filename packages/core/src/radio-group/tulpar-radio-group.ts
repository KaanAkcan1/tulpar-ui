import { property } from "lit/decorators.js";
import { SelectionGroupBase } from "../_internal/selection-group-base";
import { radioGroupStyles } from "./tulpar-radio-group.styles";
import type { TulparRadio } from "../radio/tulpar-radio";

/**
 * `<tulpar-radio-group>` — a single-select group of `<tulpar-radio>`.
 *
 * The group's `value` is the `value` of its one checked child (or `null` when
 * none is selected). It is NOT form-associated: the checked child submits its
 * own name/value pair natively (the group mirrors its single `name` onto every
 * radio, so exactly one value submits).
 *
 * Follows the WAI-ARIA radio group pattern: exactly one radio is tab-reachable
 * (the checked one, or the first non-disabled radio if none is checked); arrow
 * keys move selection AND focus between radios, wrapping at the ends; Home/End
 * jump to the first/last non-disabled radio. Selection follows focus.
 *
 * The canonical event consumers bind to is the group's own
 * `CustomEvent('change', { detail: { value } })` (composed, bubbling).
 */
export class TulparRadioGroup extends SelectionGroupBase {
  static override styles = [SelectionGroupBase.styles, radioGroupStyles];

  /** The `value` of the currently checked child, or `null` when none. */
  @property({ type: String }) value: string | null = null;

  protected get _childTag() {
    return "tulpar-radio";
  }

  protected get _groupRole() {
    return "radiogroup";
  }

  /** Internal guard so reflecting value down doesn't re-dispatch on reconcile. */
  private _applyingValue = false;
  /** True once `value` was authored/set so connect doesn't clobber it. */
  private _valueAuthored = false;
  /** Suppress the canonical change during the initial connect reconcile. */
  private _silentReconcile = false;

  override connectedCallback() {
    // Capture whether `value` was authored before the base's connect runs its
    // apply-down/reconcile-up pass (which would otherwise clobber an authored
    // `<tulpar-radio checked>` when `value` is null).
    this._valueAuthored = this.value !== null;
    this._silentReconcile = true;
    super.connectedCallback();
    this._silentReconcile = false;
    // Bubbling child `change` events are caught here and reconciled up.
    this.addEventListener("change", this._onChildChange);
    // Roving-focus keyboard model. The base declares `_onChildKeydown` as an
    // optional hook but does not wire it — bind it on the host (keydown
    // bubbles up from the focused radio's shadow box through composed paths).
    this.addEventListener("keydown", this._keydownListener);
  }

  override disconnectedCallback() {
    this.removeEventListener("change", this._onChildChange);
    this.removeEventListener("keydown", this._keydownListener);
    super.disconnectedCallback();
  }

  private _keydownListener = (e: KeyboardEvent) => this._onChildKeydown(e);

  protected override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has("value")) {
      // Programmatic value set → reflect down, never re-dispatch.
      this._applyValueToChildren();
    }
  }

  private _radios(): TulparRadio[] {
    return this._childElements() as TulparRadio[];
  }

  private _enabledRadios(): TulparRadio[] {
    return this._radios().filter((r) => !r.hasAttribute("disabled"));
  }

  // ── Selection model ─────────────────────────────────────────────────────────

  /** Down: check the matching child, uncheck the rest; refresh roving tabindex. */
  protected _applyValueToChildren() {
    // On initial connect with no authored `value`, defer to a child's own
    // authored `checked` state instead of clearing it.
    if (!this._valueAuthored && this.value === null) {
      this._updateRovingTabindex();
      return;
    }
    this._applyingValue = true;
    try {
      for (const radio of this._radios()) {
        radio.checked = radio.value === this.value;
      }
    } finally {
      this._applyingValue = false;
    }
    this._updateRovingTabindex();
  }

  /** Up: recompute value from the checked child; dispatch the group change. */
  protected _reconcileFromChildren() {
    const checked = this._radios().find((r) => r.checked);
    const next = checked ? checked.value : null;
    if (next !== this.value) {
      this.value = next;
      this._valueAuthored = true;
      if (!this._silentReconcile) this._dispatchChange();
    }
    this._updateRovingTabindex();
  }

  private _onChildChange = (e: Event) => {
    // Ignore the group's own re-dispatched CustomEvent (it carries detail) and
    // any change fired while we are reflecting value down.
    if (e instanceof CustomEvent && e.detail && "value" in e.detail) return;
    const target = e.target as HTMLElement | null;
    if (!target || target === this) return;
    const radio = this._radios().find((r) => r === target);
    if (!radio) return;
    if (this._applyingValue) return;
    // A child selected itself (checked=true). The reconcile must key off the
    // radio that fired — at this instant the previously-checked sibling is
    // still checked too, so "first checked" would pick the stale one.
    if (radio.checked) {
      this.value = radio.value;
      this._valueAuthored = true;
      // Deselect every sibling.
      this._applyValueToChildren();
      this._dispatchChange();
    } else {
      // A radio reported unchecked (rare standalone path) — recompute.
      this._reconcileFromChildren();
    }
  };

  private _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ── Roving tabindex (WAI-ARIA radio pattern) ────────────────────────────────

  /**
   * Exactly one radio is tab-reachable: the checked one, or — if none is
   * checked — the first non-disabled radio. All others get tabindex=-1.
   * We set the host's `tabIndex` property so it wins over the radio's own
   * render-time default tabindex attribute.
   */
  private _updateRovingTabindex() {
    const radios = this._radios();
    if (radios.length === 0) return;
    const checked = radios.find((r) => r.checked && !r.hasAttribute("disabled"));
    const reachable = checked ?? this._enabledRadios()[0] ?? null;
    for (const radio of radios) {
      radio.tabIndex = radio === reachable ? 0 : -1;
    }
  }

  protected override _onSlotChange = () => {
    this._propagate();
    this._applyValueToChildren();
    this._reconcileFromChildren();
    this._updateRovingTabindex();
  };

  // ── Keyboard model (selection follows focus, with wrap) ──────────────────────

  protected override _onChildKeydown(e: KeyboardEvent) {
    const enabled = this._enabledRadios();
    if (enabled.length === 0) return;

    const target = e.target as HTMLElement | null;
    const current = this._radios().find(
      (r) => r === target || (target ? r.contains(target) : false),
    );
    const currentIdx = current ? enabled.indexOf(current) : -1;

    let nextIdx: number | null = null;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        nextIdx = currentIdx < 0 ? 0 : (currentIdx + 1) % enabled.length;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        nextIdx =
          currentIdx < 0 ? enabled.length - 1 : (currentIdx - 1 + enabled.length) % enabled.length;
        break;
      case "Home":
        nextIdx = 0;
        break;
      case "End":
        nextIdx = enabled.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const next = enabled[nextIdx];
    this._selectAndFocus(next);
  }

  /** Select a radio (selection follows focus), reconcile, and focus its box. */
  private _selectAndFocus(radio: TulparRadio) {
    if (!radio.checked) {
      this._applyingValue = true;
      try {
        for (const r of this._radios()) r.checked = r === radio;
      } finally {
        this._applyingValue = false;
      }
      this.value = radio.value;
      this._valueAuthored = true;
      this._dispatchChange();
    }
    this._updateRovingTabindex();
    const focusTarget = radio.shadowRoot?.querySelector(".box--radio") as HTMLElement | null;
    (focusTarget ?? radio).focus();
  }
}

if (!customElements.get("tulpar-radio-group")) {
  customElements.define("tulpar-radio-group", TulparRadioGroup);
}
