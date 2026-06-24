import { css } from "lit";

/**
 * Visual language for `<tulpar-option>` — the listbox row (Task 6.1).
 *
 * The signature of the whole Select lives here: **three independently legible
 * signals that stack without confusion** (the rule both design skills push —
 * meaning is never carried by color alone, and one state must never read as
 * another):
 *
 * 1. **active / hover (unified)** — a NEUTRAL `bg-subtle` wash, no rail, no
 *    check. Mouse-hover and keyboard-active share ONE highlight (the Select
 *    moves `data-active` on pointer-enter), and it never reads as "selected".
 * 2. **selected (committed value)** — the one saturated moment: a 2px brand left
 *    rail (`::before`), a trailing brand checkmark, a faint brand tint, the label
 *    bumped to ~550, and the leading icon adopting brand. Three redundant cues so
 *    selection survives color-blindness AND forced-colors.
 * 3. **selected + active** — keeps rail + check + weight, DEEPENS the fill. The
 *    highlight never erases the selected cues.
 *
 * Geometry is per-size: the Select stamps `data-size` on each option to match its
 * own size, so an `md` Select gets `md` rows. Option radius is 7px — concentric
 * inside the panel's 10px radius across the 4px panel gutter.
 *
 * House idioms:
 * - Semantic tokens only via `var()` with literal fallbacks; NO
 *   `--tulpar-primitive-*` (ESLint `no-restricted-syntax` on *.styles.ts).
 * - Logical properties throughout (RTL-ready per spec §10).
 * - :host attributes drive every state; the parent Select sets `aria-selected` /
 *   `data-active` / `data-selected` / `data-size`; we only style against them.
 */
export const optionStyles = css`
  :host {
    /* Per-size knobs (md defaults; overridden by [data-size] below). */
    --_opt-min-h: 2.25rem;
    --_opt-pad-x: 0.75rem;
    --_opt-font: 0.875rem;
    --_opt-gap: 0.5rem;

    position: relative;
    display: flex;
    align-items: center;
    gap: var(--_opt-gap);
    /* Inline padding owns the row's horizontal rhythm; a thin block padding keeps
       a comfortable touch row without over-tall rows. */
    padding-inline: var(--_opt-pad-x);
    padding-block: 0.25rem;
    min-block-size: var(--_opt-min-h);
    cursor: pointer;
    /* Concentric inside the 10px panel across its 4px gutter. */
    border-radius: 7px;
    /* A whisker of inline margin so the row's hover wash + selected rail sit
       inside the panel padding rather than flush to the scroll edge. */
    margin-inline: 4px;
    color: var(--tulpar-color-text-primary, #15110b);
    font-size: var(--_opt-font);
    line-height: 1.25;
    box-sizing: border-box;
    outline: none;
    user-select: none;
    -webkit-user-select: none;
    /* Snappy, near-instant wash; background only (cheap, no reflow). */
    transition: background 90ms ease;
  }

  /* ── Per-size geometry ───────────────────────────────────────────────────
     The Select stamps data-size to match its own size (xs–xl). Rows run a touch
     shorter than the trigger of the same size. */
  :host([data-size="xs"]) {
    --_opt-min-h: 26px;
    --_opt-pad-x: 0.5rem;
    --_opt-font: 0.75rem;
    --_opt-gap: 0.375rem;
  }
  :host([data-size="sm"]) {
    --_opt-min-h: 30px;
    --_opt-pad-x: 0.625rem;
    --_opt-font: 0.875rem;
    --_opt-gap: 0.5rem;
  }
  :host([data-size="md"]) {
    --_opt-min-h: 36px;
    --_opt-pad-x: 0.75rem;
    --_opt-font: 0.875rem;
    --_opt-gap: 0.5rem;
  }
  :host([data-size="lg"]) {
    --_opt-min-h: 42px;
    --_opt-pad-x: 0.875rem;
    --_opt-font: 1rem;
    --_opt-gap: 0.625rem;
  }
  :host([data-size="xl"]) {
    --_opt-min-h: 48px;
    --_opt-pad-x: 1rem;
    --_opt-font: 1.125rem;
    --_opt-gap: 0.625rem;
  }

  /* ── Selected left rail (::before) ───────────────────────────────────────
     A 2px brand bar pinned to the inline-start edge, vertically inset so it reads
     as a tab marker, not a full-height border. Hidden until selected. */
  :host::before {
    content: "";
    position: absolute;
    inset-inline-start: 0;
    inset-block: 18%;
    inline-size: 2px;
    border-start-end-radius: 2px;
    border-end-end-radius: 2px;
    background: var(--tulpar-color-brand-default, #00c57a);
    opacity: 0;
    transition: opacity 90ms ease;
  }

  /* ── Text column ─────────────────────────────────────────────────────────── */
  .opt-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-inline-size: 0;
  }

  .opt-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .opt-desc {
    font-size: 0.8em;
    color: var(--tulpar-color-text-muted, #737373);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Leading icon ────────────────────────────────────────────────────────
     Hidden by default; shown when [data-has-icon] is set by the slotchange
     handler (attr-toggle pattern — avoids the Lit re-render loop). */
  .opt-icon {
    display: none;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    inline-size: 1rem;
    block-size: 1rem;
    color: var(--tulpar-color-text-muted, #737373);
  }
  .opt-icon svg {
    inline-size: 100%;
    block-size: 100%;
  }

  :host([data-has-icon]) .opt-icon {
    display: inline-flex;
  }

  /* ── Trailing check zone (always reserved) ───────────────────────────────
     The zone keeps its width even when empty, so selection moving between rows
     never shifts the labels. The glyph is hidden until selected. */
  .opt-check {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 1.25em;
    block-size: 1.25em;
    margin-inline-start: 0.25rem;
    visibility: hidden;
    color: var(--tulpar-color-brand-default, #00c57a);
  }
  .opt-check svg {
    inline-size: 1em;
    block-size: 1em;
  }
  :host([data-size="xs"]) .opt-check svg,
  :host([data-size="sm"]) .opt-check svg {
    inline-size: 0.875em;
    block-size: 0.875em;
  }

  /* ============================================================
   * Signal 1 — active / hover (unified). Neutral wash ONLY. No rail, no check.
   * The Select moves data-active to the hovered row, so hover === active.
   * ============================================================ */
  :host([data-active]) {
    background: var(--tulpar-color-bg-subtle, #f7f7f6);
  }

  /* ============================================================
   * Signal 2 — selected (committed value). The signature: rail + check + tint +
   * weight, with the leading icon adopting brand. The faint tint is the
   * established selection-card recipe (brand 8% over the surface; 12% under
   * .dark). Color is never the sole carrier — the rail + check are shape cues.
   * ============================================================ */
  :host([aria-selected="true"]) {
    background: color-mix(
      in srgb,
      var(--tulpar-color-brand-default, #00c57a) 8%,
      var(--tulpar-overlay-surface-bg, #ffffff)
    );
    color: var(--tulpar-color-text-primary, #15110b);
  }
  :host([aria-selected="true"])::before {
    opacity: 1;
  }
  :host([aria-selected="true"]) .opt-label {
    font-weight: 550;
  }
  :host([aria-selected="true"]) .opt-icon {
    color: var(--tulpar-color-brand-default, #00c57a);
  }
  :host([aria-selected="true"]) .opt-check {
    visibility: visible;
  }

  /* NOTE on the dark tint: the spec asks for 8% (light) then 12% (dark). The
     only in-shell-safe way to vary by theme is an auto-flipping token —
     host-context(.dark) does NOT flip inside tulpar-shell (see
     reference_host_context_dark_fails_in_shell) and a dedicated
     --tulpar-select-option token is deferred by spec section 5.7. We therefore
     mix the brand over the AUTO-FLIPPING overlay-surface-bg: because the surface
     token darkens in dark mode, the same 8% mix reads as a deeper, more-present
     tint over the dark surface — approximating the 8%-to-12% intent without a
     theme selector. Tasteful, token-clean, shell-correct. */

  /* ============================================================
   * Signal 3 — selected + active simultaneously. Keep rail + check + weight,
   * DEEPEN the fill (brand 12% over bg-subtle) so the active highlight reads on
   * top of selection without erasing it.
   * ============================================================ */
  :host([aria-selected="true"][data-active]) {
    background: color-mix(
      in srgb,
      var(--tulpar-color-brand-default, #00c57a) 12%,
      var(--tulpar-color-bg-subtle, #f7f7f6)
    );
  }

  /* ============================================================
   * Disabled — muted, non-interactive, skipped by nav. A disabled *selected*
   * option keeps the check but in muted ink (not brand) and drops the rail/tint.
   * ============================================================ */
  :host([disabled]) {
    color: color-mix(in srgb, var(--tulpar-color-text-muted, #737373) 70%, transparent);
    cursor: not-allowed;
    pointer-events: none;
    background: transparent;
  }
  :host([disabled]) .opt-desc {
    color: color-mix(in srgb, var(--tulpar-color-text-muted, #737373) 70%, transparent);
  }
  :host([disabled]) .opt-icon {
    color: var(--tulpar-color-text-muted, #737373);
    opacity: 0.6;
  }
  :host([disabled])::before {
    opacity: 0;
  }
  :host([disabled][aria-selected="true"]) {
    background: transparent;
  }
  :host([disabled][aria-selected="true"]) .opt-check {
    color: var(--tulpar-color-text-muted, #737373);
  }

  /* ============================================================
   * Forced colors (Windows High Contrast). The tint/rail dissolve, so:
   * - active → system Highlight / HighlightText.
   * - selected → keep the check (forced-color-adjust:auto) + a 1px CanvasText
   *   outline so selection stays distinguishable from active.
   * ============================================================ */
  @media (forced-colors: active) {
    :host([data-active]) {
      forced-color-adjust: none;
      background: Highlight;
      color: HighlightText;
    }
    :host([aria-selected="true"]) {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      outline: 1px solid CanvasText;
      outline-offset: -1px;
    }
    :host([aria-selected="true"][data-active]) {
      background: Highlight;
      color: HighlightText;
    }
    :host([aria-selected="true"]) .opt-check {
      forced-color-adjust: auto;
    }
    :host::before {
      display: none;
    }
    :host([disabled]) {
      color: GrayText;
    }
  }

  /* Reduced motion — drop the wash/rail transitions. */
  @media (prefers-reduced-motion: reduce) {
    :host,
    :host::before {
      transition: none;
    }
  }
`;
