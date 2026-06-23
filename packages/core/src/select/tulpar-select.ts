import { html, nothing, type TemplateResult } from "lit";
import { property, query, state } from "lit/decorators.js";
import { FormFieldBase } from "../_internal/form-field-base";
import { buildCollection, type Collection, type OptionLike } from "../_internal/listbox/collection";
import type { TulparOption } from "./tulpar-option";
import { selectStyles } from "./tulpar-select.styles";
// Register <tulpar-spinner> so the loading state renders (side-effect import).
import "../spinner";

/** Detail payload of the `change` event (emitted in a later task). */
export interface SelectChangeDetail {
  value: string;
}

let seq = 0;

/**
 * `<tulpar-select>` — single-select dropdown built on {@link FormFieldBase}.
 *
 * This file is the CLOSED-STATE scaffold: a form-associated trigger that shows
 * the selected option's label (or a placeholder), discovers light-DOM
 * `<tulpar-option>` children, and reflects its value as the native form value.
 *
 * The listbox markup is rendered but kept hidden (`display:none` while closed);
 * open/close, positioning, keyboard navigation, and the `change` event are
 * wired in later tasks (Task 4.1/5.1).
 *
 * ## Content discovery
 * `_options()` walks `<tulpar-option>` descendants in document order — both
 * direct children and those nested inside `<tulpar-option-group>` — and builds
 * the {@link Collection} the trigger reads for its display label.
 *
 * ## CRITICAL Lit trap
 * The default `<slot>` inside the listbox is ALWAYS present — it is never
 * conditionally swapped in `render()`. Because of that, the `slotchange`
 * handler can safely call `requestUpdate()` to refresh the trigger label. Do
 * NOT introduce any conditional that removes/re-adds the options slot — that
 * would re-trigger slotchange on every update and lock the page (see CLAUDE.md
 * slotchange→requestUpdate infinite-loop reference).
 */
export class TulparSelect extends FormFieldBase {
  static override styles = [FormFieldBase.styles, selectStyles];

  /** Currently selected option value ("" = nothing selected → placeholder). */
  @property({ type: String }) value = "";

  /** Text shown on the trigger when no value is selected. */
  @property({ type: String }) placeholder = "";

  /** Shows a spinner in the trigger instead of the chevron. */
  @property({ type: Boolean, reflect: true }) loading = false;

  /** Open state. Drives listbox visibility; open/close is wired in a later task. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Active (keyboard-highlighted) option index. Used by later nav tasks. */
  @state() protected _activeIndex = -1;

  @query(".select-trigger") protected _triggerEl!: HTMLElement;
  @query(".select-listbox") protected _listboxEl!: HTMLElement;

  /** Stable per-instance listbox id — used on the listbox + trigger aria-controls. */
  private _listboxId = `tulpar-select-listbox-${++seq}`;

  protected override _hasValue(): boolean {
    return this.value !== "";
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (changed.has("value")) {
      this._internals.setFormValue(this.value);
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Seed the native form value so a server-rendered initial value is submitted.
    this._internals.setFormValue(this.value);
  }

  /**
   * Discover light-DOM options in document order. `querySelectorAll` returns
   * `<tulpar-option>` descendants (including those nested in
   * `<tulpar-option-group>`) in document order — the simplest correct approach.
   * Comment/whitespace nodes are never matched. Each option is assigned a stable
   * `id` if it lacks one (needed later for `aria-activedescendant`).
   */
  protected _options(): OptionLike[] {
    const opts = Array.from(this.querySelectorAll<TulparOption>("tulpar-option"));
    return opts.map((opt) => {
      if (!opt.id) opt.id = `tulpar-opt-${++seq}`;
      return {
        value: opt.value,
        label: opt.resolvedLabel,
        disabled: opt.disabled,
        el: opt,
      };
    });
  }

  protected _collection(): Collection {
    return buildCollection(this._options());
  }

  protected _selectedLabel(): string {
    const c = this._collection();
    const i = c.indexByValue(this.value);
    return i >= 0 ? c.items[i].label : "";
  }

  // ── Trigger interaction (STUBS) ───────────────────────────────────────────
  // Open/close + keyboard navigation are wired in Task 4.1/5.1.
  protected _onTriggerClick = (): void => {};
  protected _onTriggerKeydown = (): void => {};

  /**
   * Refresh the trigger label when the projected options change. SAFE because
   * the default `<slot>` is never conditionally removed from render (see the
   * class-level Lit-trap note).
   */
  protected _onOptionsSlotChange = (): void => {
    this.requestUpdate();
  };

  private _renderChevron(): TemplateResult {
    return html`<span class="select-chevron" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
        <path
          d="M4 6 L8 10 L12 6"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </span>`;
  }

  private _renderTriggerSpinner(): TemplateResult {
    return html`<tulpar-spinner size="sm"></tulpar-spinner>`;
  }

  private _renderListbox(): TemplateResult {
    return html`<div class="select-listbox" role="listbox" id=${this._listboxId} part="listbox">
      <slot @slotchange=${this._onOptionsSlotChange}></slot>
    </div>`;
  }

  protected override renderControl(ariaLabel?: string): TemplateResult {
    const label = this._selectedLabel();
    const showPlaceholder = label === "";
    return html`
      <div class="control-row">
        ${this._renderPrefixSlot()}
        <button
          class="select-trigger"
          type="button"
          id="control"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls=${this._listboxId}
          aria-label=${ariaLabel ?? nothing}
          aria-required=${this._ariaRequiredAttr()}
          aria-invalid=${this._ariaInvalidAttr()}
          aria-describedby=${this._ariaDescribedBy() ?? nothing}
          ?disabled=${this.disabled}
          @click=${this._onTriggerClick}
          @keydown=${this._onTriggerKeydown}
        >
          <span class="select-value" data-placeholder=${showPlaceholder ? "" : nothing}
            >${showPlaceholder ? this.placeholder : label}</span
          >
          ${this.loading ? this._renderTriggerSpinner() : this._renderChevron()}
        </button>
        ${this._renderStatusZone()} ${this._renderSuffixSlot()}
      </div>
      ${this._renderListbox()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-select": TulparSelect;
  }
}

if (!customElements.get("tulpar-select")) {
  customElements.define("tulpar-select", TulparSelect);
}
