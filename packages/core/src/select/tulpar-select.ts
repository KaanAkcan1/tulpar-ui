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

/** Counter for stable per-instance listbox ids. */
let seq = 0;
/** Separate counter for stamped `<tulpar-option>` ids (distinct id namespace). */
let optSeq = 0;

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

  /**
   * When set, offers a clear (✕) affordance once a value is selected — UNLESS
   * the field is `required` (a required field must never offer clear).
   */
  @property({ type: Boolean, reflect: true }) clearable = false;

  /** Open state. Drives listbox visibility; open/close is wired in a later task. */
  @property({ type: Boolean, reflect: true }) open = false;

  /** Active (keyboard-highlighted) option index. Used by later nav tasks. */
  @state() protected _activeIndex = -1;

  @query(".select-trigger") protected _triggerEl!: HTMLElement;
  @query(".select-listbox") protected _listboxEl!: HTMLElement;
  @query(".select-leading-icon") protected _leadingIconEl!: HTMLElement;

  /** Stable per-instance listbox id — used on the listbox + trigger aria-controls. */
  private _listboxId = `tulpar-select-listbox-${++seq}`;

  protected override _hasValue(): boolean {
    return this.value !== "";
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    if (changed.has("value")) {
      // single form-value sync point (covers _commit + programmatic value set)
      this._internals.setFormValue(this.value);
    }
    // Mirror the selected option's leading icon into the trigger. Cheap to run
    // on every update — it short-circuits when there is no selection/icon. This
    // is plain imperative DOM (clone-only), NOT a slotchange loop.
    this._syncLeadingIcon();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Seed the native form value so a server-rendered initial value is submitted.
    this._internals.setFormValue(this.value);
    // Stamp ids on any options already present in light DOM.
    this._ensureOptionIds();
  }

  /**
   * Stamp a stable `id` onto every `<tulpar-option>` that lacks one (needed for
   * `aria-activedescendant`). This is the ONLY place that mutates option DOM —
   * keeping {@link _options} a pure reader. Called from `connectedCallback` and
   * `_onOptionsSlotChange`, so ids are guaranteed before options are read.
   */
  private _ensureOptionIds(): void {
    const opts = this.querySelectorAll<TulparOption>("tulpar-option");
    opts.forEach((opt) => {
      opt.id ||= `tulpar-opt-${++optSeq}`;
    });
  }

  /**
   * Discover light-DOM options in document order — pure reader. `querySelectorAll`
   * returns `<tulpar-option>` descendants (including those nested in
   * `<tulpar-option-group>`) in document order — the simplest correct approach.
   * Comment/whitespace nodes are never matched. Ids are already stamped by
   * {@link _ensureOptionIds} (connectedCallback/slotchange), so no mutation here.
   */
  protected _options(): OptionLike[] {
    const opts = Array.from(this.querySelectorAll<TulparOption>("tulpar-option"));
    return opts.map((opt) => ({
      value: opt.value,
      label: opt.resolvedLabel,
      disabled: opt.disabled,
      el: opt,
    }));
  }

  protected _collection(): Collection {
    return buildCollection(this._options());
  }

  protected _selectedLabel(): string {
    const c = this._collection();
    const i = c.indexByValue(this.value);
    return i >= 0 ? c.items[i].label : "";
  }

  /** The light-DOM `<tulpar-option>` element for the current value (or null). */
  protected _selectedOptionEl(): HTMLElement | null {
    const c = this._collection();
    const i = c.indexByValue(this.value);
    return i >= 0 ? (c.items[i].el ?? null) : null;
  }

  /**
   * Commit a new value: update the property and emit a bubbling `change` event.
   * The single mutation path reused by clear (here) and by option selection in a
   * later task. Setting `this.value` triggers `updated()`, which is the single
   * form-value sync point — so `_commit` does NOT call `setFormValue` itself.
   */
  protected _commit(value: string): void {
    this.value = value;
    this.dispatchEvent(
      new CustomEvent<SelectChangeDetail>("change", {
        detail: { value },
        bubbles: true,
      }),
    );
  }

  /**
   * Clone the selected option's `slot="icon"` child into the trigger's leading
   * span. Clone-only (the original stays in the option). Toggles the
   * `data-has-leading-icon` host attribute so CSS can show/hide the zone.
   */
  private _syncLeadingIcon(): void {
    const span = this._leadingIconEl;
    if (!span) return;
    const icon = this._selectedOptionEl()?.querySelector('[slot="icon"]') ?? null;
    span.replaceChildren();
    if (icon) {
      span.appendChild(icon.cloneNode(true));
      this.setAttribute("data-has-leading-icon", "");
    } else {
      this.removeAttribute("data-has-leading-icon");
    }
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
    // Newly projected options get their stable ids before the label refresh.
    this._ensureOptionIds();
    this.requestUpdate();
  };

  /**
   * Clear handler: must NOT open the listbox (stop the click reaching the
   * trigger), reset the value through the single commit path, and keep keyboard
   * focus on the trigger.
   */
  protected _onClear = (e: Event): void => {
    e.stopPropagation();
    this._commit("");
    queueMicrotask(() => this._triggerEl?.focus());
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

  /**
   * Clear (✕) button — rendered only when `clearable` is on, a value is set, the
   * field is interactive, and it is NOT required (a required field must never
   * offer clear). Sits at the start of the trailing cluster (before the
   * chevron/spinner).
   */
  private _renderClearButton(): TemplateResult | typeof nothing {
    if (!this.clearable || this.required || this.value === "" || this.disabled || this.readonly)
      return nothing;
    return html`<button
      type="button"
      class="select-clear"
      aria-label="Clear selection"
      @click=${this._onClear}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M4 4 L12 12 M12 4 L4 12"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          fill="none"
        ></path>
      </svg>
    </button>`;
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
          <span class="select-leading-icon" aria-hidden="true"></span>
          <span class="select-value" data-placeholder=${showPlaceholder ? "" : nothing}
            >${showPlaceholder ? this.placeholder : label}</span
          >
          ${this._renderClearButton()}
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
