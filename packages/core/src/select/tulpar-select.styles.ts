import { css } from "lit";

/**
 * Visual language for `<tulpar-select>` — the combobox trigger + the top-layer
 * listbox surface (Task 6.1).
 *
 * Direction: **restrained-precise** (Linear / Stripe / Vercel register). Two
 * surfaces, two jobs:
 *
 * 1. **Trigger** — visually identical to a same-variant/-size TextInput. All the
 *    field chrome (border/bg/radius/size/variant/focus-within) comes from
 *    `form-field-base.styles.ts`; this file only styles the trigger's INNER row
 *    (leading icon · value/placeholder · clear ✕ · chevron). The chevron rotates
 *    180° on open over the overlay enter duration, and lifts color on hover.
 *
 * 2. **Listbox** — a LIGHTER, FLATTER sibling of the popover: it reads as a
 *    *menu*, not a card. Tighter radius (10px vs the popover's 14px), one notch
 *    softer elevation, a hairline top-highlight, the popover's `currentColor`-keyed
 *    thin scrollbar, and origin-aware enter motion driven by `[data-side]`
 *    (set by the overlay controller after measure). Exit is display-toggled by
 *    the close lifecycle (see the motion note below) — enter-only animation.
 *
 * House idioms:
 * - Semantic tokens only (`--tulpar-input-*`, `--tulpar-overlay-*`,
 *   `--tulpar-color-*`); every `var()` carries a light fallback. NO
 *   `--tulpar-primitive-*` (ESLint `no-restricted-syntax` on *.styles.ts).
 * - Logical properties throughout (RTL-ready per spec §10).
 */
export const selectStyles = css`
  :host {
    /* Motion knobs — reused overlay tokens, conservative fallbacks. The listbox
       is intentionally a touch snappier than the popover (it is a menu). */
    --_lb-enter: var(--tulpar-overlay-motion-duration-enter, 160ms);
    --_lb-exit: var(--tulpar-overlay-motion-duration-exit, 110ms);
    --_lb-easing: var(--tulpar-overlay-motion-easing, cubic-bezier(0.2, 0.9, 0.3, 1));
    /* How far the panel travels along the main axis as it settles in. */
    --_lb-shift: 6px;
  }

  /* ============================================================
   * Trigger inner row. The control-row chrome (border/bg/radius/height/variant)
   * is owned by FormFieldBase; here we lay out the trigger CONTENTS and make the
   * whole row feel like a button.
   * ============================================================ */
  .control-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    inline-size: 100%;
  }

  .select-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    inline-size: 100%;
    min-inline-size: 0;
    background: none;
    border: none;
    font: inherit;
    /* Value text reads at the field's default ink, weight ~450 (a hair lighter
       than a heading, a hair heavier than body — the Stripe/Linear field feel). */
    color: var(--tulpar-input-text-default, #15110b);
    font-weight: 450;
    cursor: pointer;
    text-align: start;
    padding: 0;
    /* Hovering the trigger lifts the chevron via the descendant rule below. */
  }

  .select-trigger:disabled {
    cursor: not-allowed;
  }

  /* The trigger never paints its own focus ring — the field-base control-row
     focus-within ring (shared input-family treatment) is the single source. */
  .select-trigger:focus {
    outline: none;
  }
  .select-trigger:focus-visible {
    outline: none;
  }

  .select-value {
    flex: 1 1 auto;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: start;
  }

  /* No layout shift placeholder → value: same flex slot, only the ink changes.
     Placeholder is muted, non-italic (per spec §5.1). */
  .select-value[data-placeholder] {
    color: var(--tulpar-input-text-placeholder, #a8a29e);
    font-weight: 450;
  }

  /* ── Leading icon (mirrored from the selected option) ─────────────────────
     Hidden until the host gains [data-has-leading-icon]. Sits at the inline
     start, before the value, sized to the field icon scale. */
  .select-leading-icon {
    display: none;
  }

  :host([data-has-leading-icon]) .select-leading-icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 1rem;
    block-size: 1rem;
    color: var(--tulpar-input-icon-default, #74777a);
  }
  :host([data-has-leading-icon]) .select-leading-icon svg {
    inline-size: 100%;
    block-size: 100%;
  }

  /* ── Chevron ──────────────────────────────────────────────────────────────
     16px default (12px xs/sm). Neutral field-icon ink; lifts to text-secondary
     on trigger hover. Rotates 180° on open, synced to the overlay enter motion,
     spinning about its own center. */
  .select-chevron {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 1rem;
    block-size: 1rem;
    color: var(--tulpar-input-icon-default, #74777a);
    transform: rotate(0deg);
    transform-origin: center;
    transition:
      transform var(--_lb-enter) var(--_lb-easing),
      color 120ms ease;
  }
  .select-chevron svg {
    inline-size: 100%;
    block-size: 100%;
  }

  /* Hover anywhere on the trigger lifts the chevron a step. */
  .select-trigger:hover:not(:disabled) .select-chevron {
    color: var(--tulpar-color-text-secondary, #4f5153);
  }

  /* Open → flip. Exit duration on close keeps the snap-back synced. */
  :host([open]) .select-chevron {
    transform: rotate(180deg);
    transition: transform var(--_lb-enter) var(--_lb-easing);
  }
  :host(:not([open])) .select-chevron {
    transition: transform var(--_lb-exit) var(--_lb-easing);
  }

  :host([size="xs"]) .select-chevron,
  :host([size="sm"]) .select-chevron {
    inline-size: 0.75rem;
    block-size: 0.75rem;
  }

  /* ── Clear (✕) ────────────────────────────────────────────────────────────
     14px ghost icon button; rendered only when a value exists (markup-gated).
     Shown on trigger hover / keyboard focus-within; cross-fades 120ms. A faint
     hairline divider separates it from the chevron (dropped at xs). */
  .select-clear {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 1.125rem;
    block-size: 1.125rem;
    padding: 0;
    margin-inline-start: 0.125rem;
    background: transparent;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    color: var(--tulpar-input-icon-default, #74777a);
    /* Faint hairline divider to the trailing chevron. */
    position: relative;
    margin-inline-end: 0.375rem;
    /* Hidden-by-default reveal: faded out until the trigger is hovered/focused. */
    opacity: 0;
    transition:
      opacity 120ms ease,
      color 120ms ease,
      background 120ms ease;
  }
  .select-clear::after {
    content: "";
    position: absolute;
    inset-inline-end: -0.375rem;
    inset-block: 0.125rem;
    inline-size: 1px;
    background: var(--tulpar-input-border-default, #d9e0df);
  }

  /* Reveal on hover or keyboard focus within the trigger row, and whenever the
     clear button itself is focused (keyboard reach). */
  .control-row:hover .select-clear,
  .control-row:focus-within .select-clear,
  .select-clear:focus-visible {
    opacity: 1;
  }
  .select-clear:hover {
    color: var(--tulpar-color-text-secondary, #4f5153);
    background: var(--tulpar-color-bg-subtle, #f7f7f6);
  }
  .select-clear:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 1px;
  }
  .select-clear svg {
    inline-size: 0.875rem;
    block-size: 0.875rem;
  }

  /* Drop the divider at xs (too tight to read cleanly). */
  :host([size="xs"]) .select-clear::after {
    display: none;
  }
  :host([size="xs"]) .select-clear {
    margin-inline-end: 0.125rem;
  }

  /* ============================================================
   * Listbox surface — lighter, flatter sibling of the popover.
   *
   * Closed = removed from layout (display:none — the closed-state test asserts
   * this). Open = a fixed-position, top-layer scroll container anchored under the
   * trigger by JS (inline left/top + min-inline-size). Width grows to content up
   * to a cap, never narrower than the trigger (min-inline-size set imperatively).
   * ============================================================ */
  .select-listbox {
    display: none;
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: var(--tulpar-overlay-z-index, 1000);
    box-sizing: border-box;
    margin: 0;
    /* Padding: a thin block gutter so the first/last option float off the panel
       edges; options own their inline padding (inline:0 here). */
    padding-block: 4px;
    padding-inline: 0;
    /* Content may grow wider than the trigger up to this cap. */
    max-inline-size: min(92vw, 28rem);
    max-block-size: var(--tulpar-overlay-size-popover-max-h, min(28rem, 60vh));
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--tulpar-overlay-surface-bg, #ffffff);
    color: var(--tulpar-color-text-primary, #15110b);
    border: 1px solid var(--tulpar-overlay-surface-border, #d9e0df);
    /* Tighter than the popover (14px) — it reads as a menu, not a card. */
    border-radius: 10px;
    /* One notch softer than the popover elevation + an inset top-highlight
       hairline (light catching the top edge). */
    box-shadow:
      0 1px 0 0 rgba(255, 255, 255, 0.05) inset,
      var(
        --tulpar-overlay-shadow,
        0 12px 32px -14px rgba(2, 8, 23, 0.26),
        0 4px 10px -6px rgba(2, 8, 23, 0.14)
      );
    /* Restrained, theme-aware scrollbar — reuses the popover treatment. */
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, currentColor 26%, transparent) transparent;
  }
  .select-listbox::-webkit-scrollbar {
    inline-size: 10px;
  }
  .select-listbox::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 3px solid transparent;
    border-radius: 999px;
    background-color: color-mix(in srgb, currentColor 24%, transparent);
  }
  .select-listbox::-webkit-scrollbar-thumb:hover {
    background-color: color-mix(in srgb, currentColor 38%, transparent);
  }
  .select-listbox::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Native-popover path: neutralize the UA popover box so our coordinates win. */
  .select-listbox[popover] {
    margin: 0;
    inset: auto;
  }

  /* The options wrapper carries no chrome — options are laid out as a flat
     vertical run (group elements provide their own spacing/sticky header). */
  .select-options {
    display: block;
  }

  /* ============================================================
   * Open visibility + origin-aware enter motion.
   *
   * [open] on the host AND :popover-open (native top-layer path) each reveal the
   * surface. The panel grows out of the trigger-nearest edge: opacity 0→1 +
   * scale(.98→1) + a small translate along the main axis. transform-origin +
   * travel direction follow [data-side], applied by the overlay controller after
   * it measures (top when flipped up, bottom otherwise).
   *
   * MOTION SCOPE (intentional, documented): the close lifecycle sets the host
   * open=false which immediately reverts the surface to display:none — there is
   * no data-exiting mount-through hook on the listbox (unlike the popover). So
   * this ships an ENTER-ONLY animation; the chevron snap-back on close still
   * reads as a close affordance. Adding a true exit animation would require a
   * close-lifecycle change (out of scope for this visual task).
   * ============================================================ */
  :host([open]) .select-listbox,
  .select-listbox:popover-open {
    display: block;
    animation: lb-enter var(--_lb-enter) var(--_lb-easing) both;
  }

  .select-listbox[data-side="top"] {
    transform-origin: bottom center;
    --_lb-from-y: var(--_lb-shift);
  }
  .select-listbox[data-side="bottom"] {
    transform-origin: top center;
    --_lb-from-y: calc(-1 * var(--_lb-shift));
  }

  @keyframes lb-enter {
    from {
      opacity: 0;
      transform: translateY(var(--_lb-from-y, calc(-1 * var(--_lb-shift)))) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* ============================================================
   * Listbox status rows — empty / loading / error
   * ============================================================ */
  .select-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    padding-block: 2rem;
    padding-inline: 0.75rem;
    color: var(--tulpar-color-text-muted, #737373);
    font-size: 0.875rem;
  }

  .select-status[data-kind="error"] {
    color: var(--tulpar-input-message-error, #b91c1c);
  }

  /* ============================================================
   * Reduced motion — opacity-only enter; chevron snaps (no rotate transition).
   * ============================================================ */
  @media (prefers-reduced-motion: reduce) {
    :host([open]) .select-listbox,
    .select-listbox:popover-open {
      animation: lb-fade-in var(--_lb-enter) ease both;
    }
    @keyframes lb-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    .select-chevron {
      transition: color 120ms ease;
    }
    :host([open]) .select-chevron,
    :host(:not([open])) .select-chevron {
      transition: color 120ms ease;
    }
  }

  /* ============================================================
   * Forced colors (Windows High Contrast) — system colors win so the menu never
   * dissolves; reuses the popover's block.
   * ============================================================ */
  @media (forced-colors: active) {
    .select-listbox {
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
    .select-clear::after {
      background: CanvasText;
    }
  }
`;
