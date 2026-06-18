import { property } from "lit/decorators.js";
import { SelectionGroupBase } from "../_internal/selection-group-base";
import { checkboxGroupStyles } from "./tulpar-checkbox-group.styles";
import type { TulparCheckbox } from "../checkbox/tulpar-checkbox";

/**
 * `<tulpar-checkbox-group>` — a multi-select group of `<tulpar-checkbox>`.
 *
 * The group's `value` is the array of `value`s of its checked children, in DOM
 * order. It is NOT form-associated: each checked child submits its own
 * name/value pair natively (the group mirrors its `name` onto every child, so a
 * multi-checked group produces multiple FormData entries under one name).
 *
 * Children keep independent focus — no roving tabindex. Select-all /
 * indeterminate-parent is consumer-driven and lives OUTSIDE the group; this
 * component ships nothing for it.
 *
 * The canonical event consumers bind to is the group's own
 * `CustomEvent('change', { detail: { value } })` (composed, bubbling). The raw
 * child `change` events still bubble, but the group's detail-carrying event is
 * the one to use.
 */
export class TulparCheckboxGroup extends SelectionGroupBase {
  static override styles = [SelectionGroupBase.styles, checkboxGroupStyles];

  /** The `value`s of the currently checked children, in DOM order. */
  @property({ type: Array }) value: string[] = [];

  protected get _childTag() {
    return "tulpar-checkbox";
  }

  protected get _groupRole() {
    return "group";
  }

  /** Internal guard so reflecting value down doesn't re-dispatch on reconcile. */
  private _applyingValue = false;
  /** True once `value` was authored/set so connect doesn't clobber it. */
  private _valueAuthored = false;

  /** Suppress the canonical change during the initial connect reconcile. */
  private _silentReconcile = false;

  override connectedCallback() {
    // Capture whether `value` was authored before the base's connect runs its
    // apply-down/reconcile-up pass (which would otherwise clobber authored
    // `checked` children when `value` is empty).
    this._valueAuthored = this.value.length > 0;
    this._silentReconcile = true;
    super.connectedCallback();
    this._silentReconcile = false;
    // Delegate: bubbling child `change` events are caught here and reconciled
    // up into the group's value + canonical event.
    this.addEventListener("change", this._onChildChange);
  }

  override disconnectedCallback() {
    this.removeEventListener("change", this._onChildChange);
    super.disconnectedCallback();
  }

  protected override updated(changed: Map<string, unknown>) {
    super.updated(changed);
    if (changed.has("value")) {
      // Programmatic value set → reflect down, never re-dispatch.
      this._applyValueToChildren();
    }
  }

  private _checkboxes(): TulparCheckbox[] {
    return this._childElements() as TulparCheckbox[];
  }

  /** Down: check children whose value is in the group's value array. */
  protected _applyValueToChildren() {
    // On initial connect with no authored `value`, defer to the children's own
    // authored `checked` state instead of unchecking them.
    if (!this._valueAuthored && this.value.length === 0) return;
    this._applyingValue = true;
    try {
      for (const child of this._checkboxes()) {
        child.checked = this.value.includes(child.value);
      }
    } finally {
      this._applyingValue = false;
    }
  }

  /** Up: recompute value from checked children; dispatch the group change. */
  protected _reconcileFromChildren() {
    const next = this._checkboxes()
      .filter((c) => c.checked)
      .map((c) => c.value);
    if (!this._sameValue(next, this.value)) {
      this.value = next;
      this._valueAuthored = true;
      if (!this._silentReconcile) this._dispatchChange();
    }
  }

  private _sameValue(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }

  private _onChildChange = (e: Event) => {
    // Ignore the group's own re-dispatched CustomEvent (it carries detail) and
    // any change fired while we are reflecting value down.
    if (e instanceof CustomEvent && e.detail && "value" in e.detail) return;
    const target = e.target as HTMLElement | null;
    if (!target || target === this) return;
    if (!this._checkboxes().includes(target as TulparCheckbox)) return;
    if (this._applyingValue) return;
    this._reconcileFromChildren();
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
}

if (!customElements.get("tulpar-checkbox-group")) {
  customElements.define("tulpar-checkbox-group", TulparCheckboxGroup);
}
