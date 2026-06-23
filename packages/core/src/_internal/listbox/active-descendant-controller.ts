/**
 * Active-descendant (virtual-focus) controller — the reusable DOM-reflection
 * machinery for a listbox whose DOM focus NEVER leaves the trigger (Select now;
 * Combobox/MultiSelect later). It owns the ACTIVE index and reflects two
 * distinct states onto the option elements + trigger:
 *
 * - Virtual focus (the keyboard-highlighted option): `data-active` on the
 *   option + `aria-activedescendant` on the trigger.
 * - Selection (the committed value): `aria-selected="true"` + `data-selected`
 *   on the value-matching option.
 *
 * Mirrors {@link ListboxOverlay}'s shape: a plain class constructed with element
 * accessor callbacks; the host element keeps the component-specific bits
 * (key-action interpretation, commit, focus policy) and drives this controller
 * via {@link setActive}/{@link applyActiveAttrs}/{@link applySelectedAttrs}.
 *
 * ## Why imperative attribute writes (not a reactive `@state`)
 * The reflected attributes are plain DOM writes — NOT template-managed by Lit —
 * so they SURVIVE a host re-render that re-reads the option collection. The host
 * re-applies them from `updated()` (via {@link applyActiveAttrs} +
 * {@link applySelectedAttrs}) so the attributes always match state after a
 * render that rebuilt the collection. Because they are not reactive properties,
 * they cannot re-enter the Lit update cycle.
 */

import type { Collection } from "./collection";

/** Host wiring the controller needs: element accessors + the collection reader. */
export interface ActiveDescendantConfig {
  /** Returns the shadow trigger that carries `aria-activedescendant` (may be null pre-render). */
  getTrigger: () => HTMLElement | null;
  /** Returns the shadow listbox surface (used for the page-size estimate; may be null). */
  getListbox: () => HTMLElement | null;
  /** Returns the current option {@link Collection} (the host passes its `_collection()`). */
  getCollection: () => Collection;
}

export class ActiveDescendantController {
  private readonly cfg: ActiveDescendantConfig;
  /** Active (keyboard-highlighted) option index. `-1` = nothing active. */
  private _activeIndex = -1;

  constructor(cfg: ActiveDescendantConfig) {
    this.cfg = cfg;
  }

  /** Current active (keyboard-highlighted) index. `-1` = nothing active. */
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(i: number) {
    this._activeIndex = i;
  }

  // ------------------------------------------------------------------
  // Active (virtual focus) movement
  // ------------------------------------------------------------------

  /**
   * Move the active (keyboard-highlighted) option to `i`. DOM focus NEVER leaves
   * the trigger; the active option is communicated via `aria-activedescendant`
   * on the trigger + a `data-active` attribute on the option (which both keyboard
   * nav AND hover share — one highlight). Then scroll it into view. Idempotent:
   * early-returns when the index is unchanged (so hover spam is cheap).
   */
  setActive(i: number, collection?: Collection): void {
    if (i === this._activeIndex) return;
    this._activeIndex = i;
    this.applyActiveAttrs(collection);
    this.scrollActiveIntoView(collection);
  }

  /**
   * Write the `data-active` flag onto the matching option and the trigger's
   * `aria-activedescendant`, reading the current active index. Idempotent and
   * side-effect-free beyond plain attribute writes — safe to call from the host's
   * `updated()` so the attributes always match state after a re-render. Accepts a
   * pre-built collection so the host can build it ONCE per update and share it.
   */
  applyActiveAttrs(collection?: Collection): void {
    const items = (collection ?? this.cfg.getCollection()).items;
    const i = this._activeIndex;
    items.forEach((item, idx) => item.el.toggleAttribute("data-active", idx === i));
    const trigger = this.cfg.getTrigger();
    if (!trigger) return;
    const activeId = i >= 0 ? (items[i]?.el.id ?? "") : "";
    if (activeId) trigger.setAttribute("aria-activedescendant", activeId);
    else trigger.removeAttribute("aria-activedescendant");
  }

  /**
   * Reflect the SELECTED state (distinct from active) onto the option whose value
   * matches `value`: `aria-selected="true"` + `data-selected`, removed from the
   * rest. Plain attribute writes — safe to call from the host's `updated()`.
   */
  applySelectedAttrs(value: string, collection?: Collection): void {
    const items = (collection ?? this.cfg.getCollection()).items;
    items.forEach((item) => {
      const selected = item.value !== "" && item.value === value;
      item.el.toggleAttribute("data-selected", selected);
      if (selected) item.el.setAttribute("aria-selected", "true");
      else item.el.removeAttribute("aria-selected");
    });
  }

  /** Scroll the active option into view (nearest), guarding the -1 sentinel. */
  scrollActiveIntoView(collection?: Collection): void {
    const item = (collection ?? this.cfg.getCollection()).items[this._activeIndex];
    item?.el.scrollIntoView({ block: "nearest" });
  }

  /**
   * Estimate how many option rows fit in the visible listbox — used by PageUp/
   * PageDown. Falls back to 10 when the listbox or first option isn't measurable.
   */
  visibleRows(collection?: Collection): number {
    const lb = this.cfg.getListbox();
    const first = (collection ?? this.cfg.getCollection()).items[0]?.el;
    if (!lb || !first) return 10;
    const rows = Math.floor(lb.clientHeight / (first.offsetHeight || 1));
    return rows > 0 ? rows : 10;
  }
}
