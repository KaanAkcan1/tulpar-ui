import { css } from "lit";

/**
 * Styles for <tulpar-checkbox>. Box control lives inside the base
 * `<span class="control">` slot. House idioms (matching tulpar-switch.styles
 * and selection-control-base.styles): only semantic tokens with literal
 * `var()` fallbacks; `:focus-visible` ring + forced-colors CanvasText;
 * reduced-motion disables all transitions and shows the tick instantly.
 *
 * The box is a grid square; glyphs (check SVG, dash span, custom slot) are
 * all stacked in the same grid cell via `grid-area: 1 / 1`.
 */
export const checkboxStyles = css`
  /* ── Box (the focusable role=checkbox span) ────────────────────────────── */
  .box {
    position: relative;
    display: grid;
    place-items: center;
    flex: none;
    box-sizing: border-box;
    width: var(--_sel-control-size, 18px);
    height: var(--_sel-control-size, 18px);
    border-radius: calc(var(--_sel-control-size, 18px) * 0.28);
    border: 1.5px solid var(--_sel-control-border, var(--tulpar-selection-control-border, #b8c1be));
    background: var(--tulpar-selection-control-bg, #fff);
    cursor: pointer;
    transition:
      background-color 140ms cubic-bezier(0.2, 0, 0, 1),
      border-color 140ms cubic-bezier(0.2, 0, 0, 1);
    overflow: hidden;
  }

  /* Checked and indeterminate — fill + border become the brand/custom color. */
  :host([checked]) .box,
  :host([indeterminate]) .box {
    background: var(--_sel-fill);
    border-color: var(--_sel-fill);
  }

  /* ── Hover (unchecked, not disabled) ────────────────────────────────────── */
  :host(:not([checked]):not([disabled])) .root:hover .box {
    border-color: var(--tulpar-selection-control-border-hover, #909396);
    background: color-mix(in srgb, var(--_sel-fill) 5%, var(--tulpar-selection-control-bg, #fff));
  }

  /* ── Press ───────────────────────────────────────────────────────────────── */
  :host(:not([disabled])) .box:active {
    transform: scale(0.96);
    transition: transform 90ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* ── Glyphs (stacked in a single grid cell) ─────────────────────────────── */
  .glyph--check,
  .glyph--dash,
  .glyph--custom {
    grid-area: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  }

  /* ── Check SVG ───────────────────────────────────────────────────────────── */
  .glyph--check {
    width: 70%;
    height: 70%;
    overflow: visible;
  }

  .tick {
    fill: none;
    stroke: var(--_sel-glyph, #15110b);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    /* No transition by default (unchecked). */
  }

  /* When checked (and NOT indeterminate), animate the tick in. */
  :host([checked]:not([indeterminate])) .tick {
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 200ms cubic-bezier(0.65, 0, 0.35, 1) 40ms;
  }

  /* Hide check when indeterminate or when a custom icon slot is occupied. */
  :host([indeterminate]) .glyph--check,
  :host([data-has-icon]:not([indeterminate])) .glyph--check {
    display: none;
  }

  /* ── Indeterminate dash ──────────────────────────────────────────────────── */
  .glyph--dash {
    width: 60%;
    height: 2px;
    border-radius: 999px;
    background: var(--_sel-glyph, #15110b);
    transform: scaleX(0.4);
    opacity: 0;
    transition:
      transform 160ms cubic-bezier(0.2, 0, 0, 1),
      opacity 160ms cubic-bezier(0.2, 0, 0, 1);
  }

  :host([indeterminate]) .glyph--dash {
    transform: scaleX(1);
    opacity: 1;
  }

  /* ── Custom icon slot ────────────────────────────────────────────────────── */
  .glyph--custom {
    width: 70%;
    height: 70%;
    opacity: 0;
  }

  :host([data-has-icon]:not([indeterminate])) .glyph--custom {
    opacity: 1;
  }

  ::slotted(*) {
    color: var(--_sel-glyph, #15110b);
    width: 100%;
    height: 100%;
  }

  /* ── Disabled ────────────────────────────────────────────────────────────── */
  :host([disabled]) .box {
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── Focus ring ──────────────────────────────────────────────────────────── */
  .box:focus-visible {
    outline: 2px solid var(--tulpar-selection-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
  }
  @media (forced-colors: active) {
    .box:focus-visible {
      outline-color: CanvasText;
    }
  }

  /* ── Reduced motion ──────────────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .box,
    .tick,
    .glyph--dash {
      transition: none !important;
    }
    /* Show tick instantly when checked (no dash animation either). */
    :host([checked]:not([indeterminate])) .tick {
      stroke-dashoffset: 0;
    }
  }
`;
