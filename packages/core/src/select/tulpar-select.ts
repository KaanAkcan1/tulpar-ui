import { html, nothing, type TemplateResult } from "lit";
import { property, query } from "lit/decorators.js";
import { FormFieldBase } from "../_internal/form-field-base";
import { buildCollection, type Collection, type OptionLike } from "../_internal/listbox/collection";
import {
  firstEnabled,
  lastEnabled,
  nextEnabled,
  pageMove,
  prevEnabled,
} from "../_internal/listbox/active-index";
import { Typeahead } from "../_internal/listbox/typeahead";
import { resolveKeyAction } from "../_internal/listbox/keymap";
import { ListboxOverlay } from "../_internal/listbox/listbox-overlay";
import { ActiveDescendantController } from "../_internal/listbox/active-descendant-controller";
import type { TulparOption } from "./tulpar-option";
import { selectStyles } from "./tulpar-select.styles";
// Register <tulpar-spinner> so the loading state renders (side-effect import).
import "../spinner";

/** Detail payload of the `change` event dispatched when the value commits. */
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
 * A form-associated combobox trigger that shows the selected option's label (or
 * a placeholder), discovers light-DOM `<tulpar-option>` children, reflects its
 * value as the native form value, and opens a top-layer listbox with full
 * keyboard navigation (arrows / Home / End / Page / typeahead), virtual focus
 * (`aria-activedescendant`), light dismiss, and a bubbling `change` event.
 *
 * The element delegates two clusters to internal controllers:
 * - {@link ListboxOverlay} — open/close, top-layer promotion, positioning,
 *   light dismiss, Escape stack, scroll/resize dismissal.
 * - {@link ActiveDescendantController} — the active index + the DOM reflection of
 *   virtual focus (`data-active`/`aria-activedescendant`) and selection
 *   (`aria-selected`/`data-selected`).
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

  /** Text to display inside the listbox loading status row. */
  @property({ type: String, attribute: "loading-text" }) loadingText = "Loading…";

  /**
   * When truthy, renders an error status row inside the listbox (role=alert).
   * The trigger stays neutral — this is a listbox-content state, NOT field validation.
   */
  @property({ type: String }) error?: string;

  /** Text to display inside the listbox empty status row when there are no options. */
  @property({ type: String, attribute: "empty-text" }) emptyText = "No options";

  /**
   * When set, offers a clear (✕) affordance once a value is selected — UNLESS
   * the field is `required` (a required field must never offer clear).
   */
  @property({ type: Boolean, reflect: true }) clearable = false;

  /** Open state. Drives listbox visibility + `aria-expanded` via render. */
  @property({ type: Boolean, reflect: true }) open = false;

  @query(".select-trigger") protected _triggerEl!: HTMLElement;
  @query(".select-listbox") protected _listboxEl!: HTMLElement;
  @query(".select-leading-icon") protected _leadingIconEl!: HTMLElement;

  /** Stable per-instance listbox id — used on the listbox + trigger aria-controls. */
  private _listboxId = `tulpar-select-listbox-${++seq}`;

  /**
   * Value snapshot taken on open, so Escape can revert an arrow-key preview back
   * to what was selected before the listbox opened.
   */
  protected _valueBeforeOpen = "";

  /** Buffered type-to-jump matcher (500ms window). Reset on every open. */
  private _typeahead = new Typeahead(500);

  /**
   * Generic overlay lifecycle (top-layer promotion, positioning, light dismiss,
   * Escape stack, scroll/resize dismissal). The Select keeps the
   * Select-specific bits (active-index seeding, commit, trigger focus) and
   * delegates the overlay mechanics here.
   */
  private _overlay = new ListboxOverlay({
    host: this,
    getTrigger: () => this._triggerEl ?? null,
    getListbox: () => this._listboxEl ?? null,
    onDismiss: () => this._dismiss(),
    onScrollOrResize: () => this._doClose(),
    onOutsidePointerDown: () => this._doClose(),
  });

  /**
   * Virtual-focus controller: owns the active index and the imperative DOM
   * reflection of virtual focus (`data-active` + `aria-activedescendant`) and
   * selection (`aria-selected` + `data-selected`). The keymap interpreter, open
   * seeding, and hover handler drive it; `updated()` re-applies its attributes so
   * they survive a re-render that rebuilt the option collection.
   */
  private _active = new ActiveDescendantController({
    getTrigger: () => this._triggerEl ?? null,
    getListbox: () => this._listboxEl ?? null,
    getCollection: () => this._collection(),
  });

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
    // Stamp each option with the Select's size so option geometry (row height,
    // padding, font) matches the trigger. Plain attribute writes (no reactive
    // @property), so they cannot re-enter the update cycle.
    this._syncOptionSizes();
    // Re-apply the virtual-focus (data-active + aria-activedescendant) and the
    // selected (aria-selected + data-selected) attributes AFTER every render so
    // they survive a re-render that re-reads the option collection. These are
    // plain attribute writes (no reactive @property), so they cannot re-enter
    // the update cycle. Build the collection ONCE and share it across both.
    const collection = this._collection();
    this._active.applyActiveAttrs(collection);
    this._active.applySelectedAttrs(this.value, collection);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Seed the native form value so a server-rendered initial value is submitted.
    this._internals.setFormValue(this.value);
    // Stamp ids on any options already present in light DOM.
    this._ensureOptionIds();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    // Full overlay teardown: pop the Escape stack, drop the document/window
    // listeners, disconnect the ResizeObserver. Mirrors the popover so a removed
    // element never wedges the page with a live outside-click listener.
    this._overlay.destroy();
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
   * Mirror the Select's `size` onto every `<tulpar-option>` via a `data-size`
   * attribute, so option geometry (row height / padding / font) matches the
   * trigger's size tier. Plain attribute writes — NOT reactive props — so they
   * cannot re-enter the Lit update cycle. Called from `updated()` (catches a
   * `size` change) and after a slotchange (catches newly projected options).
   */
  private _syncOptionSizes(): void {
    const size = this.size;
    this.querySelectorAll<TulparOption>("tulpar-option").forEach((opt) => {
      if (opt.getAttribute("data-size") !== size) opt.setAttribute("data-size", size);
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

  // ── Open / close ──────────────────────────────────────────────────────────

  /**
   * Open the listbox: refuse when non-interactive, snapshot the value (for a
   * later Escape-revert), seed the active index to the selected option (or the
   * first enabled one), then hand the overlay mechanics to the controller. The
   * reflected `open` property drives the listbox visibility + `aria-expanded`
   * via render; we await `updateComplete` inside the controller before
   * positioning so the surface is measured after it is displayed.
   */
  protected _doOpen(): void {
    if (this.disabled || this.readonly || this.loading) return;
    if (this.open) return;
    this.open = true;
    this._valueBeforeOpen = this.value;
    this._typeahead.reset();
    const c = this._collection();
    const selected = c.indexByValue(this.value);
    // Seed the active index directly (not via setActive, which early-returns on a
    // no-change) so the open below + applyActiveAttrs reflect it even when it
    // equals the prior index.
    this._active.activeIndex = selected >= 0 ? selected : firstEnabled(c.items);
    void this._overlay.open().then(() => {
      // After the surface is rendered + positioned, apply the active attributes
      // and bring the selected/active option into view immediately.
      this._active.applyActiveAttrs();
      this._active.scrollActiveIntoView();
    });
  }

  /**
   * Close the listbox and return DOM focus to the trigger. The active state is
   * intentionally NOT reset — the listbox is hidden (display:none) and `_doOpen`
   * re-seeds + `applyActiveAttrs` clears any stale flags on the next open.
   */
  protected _doClose(): void {
    if (!this.open) return;
    this.open = false;
    this._overlay.close();
    this._triggerEl?.focus();
  }

  /** Escape-stack callback — close (focus returns to the trigger in `_doClose`). */
  protected _dismiss(): void {
    this._doClose();
  }

  // ── Trigger interaction ───────────────────────────────────────────────────
  protected _onTriggerClick = (): void => {
    if (this.disabled || this.readonly || this.loading) return;
    if (this.open) this._doClose();
    else this._doOpen();
  };

  /**
   * Keyboard model — single source of truth for the key contract is the pure
   * {@link resolveKeyAction}; this handler only performs the resolved side
   * effects. Virtual-focus: arrows/Home/End/Page move only the active index;
   * DOM focus stays on the trigger.
   */
  protected _onTriggerKeydown = (e: KeyboardEvent): void => {
    if (!this.open && (this.disabled || this.readonly || this.loading)) return;
    const action = resolveKeyAction(e.key, {
      open: this.open,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
    });
    if (action.type === "none") return;
    if (action.preventDefault) e.preventDefault();

    const c = this._collection();
    const items = c.items;
    const active = this._active.activeIndex;
    switch (action.type) {
      case "open":
        this._doOpen();
        break;
      case "open-typeahead": {
        this._doOpen();
        const t = this._typeahead.type(
          e.key,
          c.labels,
          performance.now(),
          this._active.activeIndex,
        );
        if (t >= 0) this._active.setActive(t, this._collection());
        break;
      }
      case "move-next":
        this._active.setActive(nextEnabled(items, active), c);
        break;
      case "move-prev":
        this._active.setActive(prevEnabled(items, active), c);
        break;
      case "first":
        this._active.setActive(firstEnabled(items), c);
        break;
      case "last":
        this._active.setActive(lastEnabled(items), c);
        break;
      case "page-down":
        this._active.setActive(pageMove(items, active, this._active.visibleRows(c)), c);
        break;
      case "page-up":
        this._active.setActive(pageMove(items, active, -this._active.visibleRows(c)), c);
        break;
      case "commit":
        if (active >= 0) this._commit(items[active].value);
        this._doClose();
        break;
      case "close":
        this._doClose();
        break;
      case "revert":
        e.stopPropagation();
        // Restore the value WITHOUT firing `change`, then close.
        this.value = this._valueBeforeOpen;
        this._internals.setFormValue(this.value);
        this._doClose();
        break;
      case "typeahead": {
        const t = this._typeahead.type(e.key, c.labels, performance.now(), active);
        if (t >= 0) this._active.setActive(t, c);
        break;
      }
    }
  };

  /**
   * Hover unifies with keyboard: hovering an option makes it the active one so
   * mouse and keyboard share ONE highlight. Event-delegated on the listbox; only
   * acts while open. The controller's `setActive` early-returns when the index is
   * unchanged.
   */
  protected _onListboxPointerOver = (e: Event): void => {
    if (!this.open) return;
    const c = this._collection();
    const items = c.items;
    for (const node of e.composedPath()) {
      if (node instanceof HTMLElement && node.tagName === "TULPAR-OPTION") {
        const idx = items.findIndex((it) => it.el === node);
        if (idx >= 0 && !items[idx].disabled) this._active.setActive(idx, c);
        return;
      }
    }
  };

  /**
   * Commit on option click (event-delegated on the listbox). Walk the composed
   * path for the nearest `<tulpar-option>`; if found and NOT disabled, commit its
   * value and close. A disabled-option click is a no-op (stays open).
   */
  protected _onListboxClick = (e: Event): void => {
    const path = e.composedPath();
    for (const node of path) {
      if (node instanceof HTMLElement && node.tagName === "TULPAR-OPTION") {
        if ((node as TulparOption).disabled) return;
        this._commit((node as TulparOption).value);
        this._doClose();
        return;
      }
    }
  };

  /**
   * Refresh the trigger label when the projected options change. SAFE because
   * the default `<slot>` is never conditionally removed from render (see the
   * class-level Lit-trap note).
   */
  protected _onOptionsSlotChange = (): void => {
    // Newly projected options get their stable ids + size before the label
    // refresh (so the size lands even on the same render frame).
    this._ensureOptionIds();
    this._syncOptionSizes();
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

  private _renderStatusRow(hasErrorSlot: boolean): TemplateResult | typeof nothing {
    if (this.loading) {
      return html`<div class="select-status" data-kind="loading" role="status">
        <tulpar-spinner size="sm"></tulpar-spinner>
        <span class="select-status-text"><slot name="loading">${this.loadingText}</slot></span>
      </div>`;
    }
    if (this.error || hasErrorSlot) {
      return html`<div class="select-status" data-kind="error" role="alert">
        <span class="select-status-text"><slot name="error">${this.error}</slot></span>
      </div>`;
    }
    if (this._collection().items.length === 0) {
      return html`<div class="select-status" data-kind="empty" role="status">
        <span class="select-status-text"><slot name="empty">${this.emptyText}</slot></span>
      </div>`;
    }
    return nothing;
  }

  private _renderListbox(): TemplateResult {
    const hasErrorSlot = !!this.querySelector('[slot="error"]');
    const showOptions = !this.loading && !this.error && !hasErrorSlot;
    return html`<div
      class="select-listbox"
      role="listbox"
      id=${this._listboxId}
      part="listbox"
      aria-busy=${this.loading ? "true" : nothing}
      @click=${this._onListboxClick}
      @pointerover=${this._onListboxPointerOver}
    >
      <div class="select-options" ?hidden=${!showOptions}>
        <slot @slotchange=${this._onOptionsSlotChange}></slot>
      </div>
      ${this._renderStatusRow(hasErrorSlot)}
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
