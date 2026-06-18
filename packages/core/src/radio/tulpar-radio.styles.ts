import { css } from "lit";

/**
 * Styles for <tulpar-radio>. Mirrors <tulpar-checkbox>'s box (border, fill,
 * press, hover, focus, reduced-motion) but the box is round and the glyph is a
 * single centered dot rather than a check/dash. House idioms: only semantic
 * tokens with literal `var()` fallbacks; `:focus-visible` ring + forced-colors
 * CanvasText; reduced-motion shows the dot at final size instantly with no
 * transition. No `:host-context`.
 */
export const radioStyles = css`
  /* ── Box (the focusable role=radio span) ───────────────────────────────── */
  .box--radio {
    position: relative;
    display: grid;
    place-items: center;
    flex: none;
    box-sizing: border-box;
    width: var(--_sel-control-size, 18px);
    height: var(--_sel-control-size, 18px);
    border-radius: 50%;
    border: 1.5px solid
      var(--_sel-control-border, var(--tulpar-selection-control-border, #b8c1be));
    background: var(--tulpar-selection-control-bg, #fff);
    cursor: pointer;
    transition:
      background-color 140ms cubic-bezier(0.2, 0, 0, 1),
      border-color 140ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* Checked — fill + border become the brand/custom color. */
  :host([checked]) .box--radio {
    background: var(--_sel-fill);
    border-color: var(--_sel-fill);
  }

  /* ── Hover (unchecked, not disabled) ───────────────────────────────────── */
  :host(:not([checked]):not([disabled])) .root:hover .box--radio {
    border-color: var(--tulpar-selection-control-border-hover, #909396);
    background: color-mix(
      in srgb,
      var(--_sel-fill) 5%,
      var(--tulpar-selection-control-bg, #fff)
    );
  }

  /* ── Press ─────────────────────────────────────────────────────────────── */
  :host(:not([disabled])) .box--radio:active {
    transform: scale(0.94);
    transition: transform 90ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* ── Dot glyph ─────────────────────────────────────────────────────────── */
  .dot {
    width: 0;
    height: 0;
    border-radius: 50%;
    background: var(--_sel-glyph, #15110b);
    pointer-events: none;
    /* Unchecked → checked is handled below; collapse uses a shorter ease. */
    transition:
      width 120ms ease,
      height 120ms ease;
  }

  :host([checked]) .dot {
    width: 40%;
    height: 40%;
    /* Springy pop on appear. */
    transition:
      width 180ms cubic-bezier(0.34, 1.4, 0.64, 1),
      height 180ms cubic-bezier(0.34, 1.4, 0.64, 1);
  }

  /* ── Disabled ──────────────────────────────────────────────────────────── */
  :host([disabled]) .box--radio {
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── Focus ring ────────────────────────────────────────────────────────── */
  .box--radio:focus-visible {
    outline: 2px solid var(--tulpar-selection-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
  }
  @media (forced-colors: active) {
    .box--radio:focus-visible {
      outline-color: CanvasText;
    }
  }

  /* ── Reduced motion ────────────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .box--radio,
    .dot {
      transition: none !important;
    }
    /* Dot appears at its final size instantly when checked. */
    :host([checked]) .dot {
      width: 40%;
      height: 40%;
    }
  }
`;
