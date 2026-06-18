import { css } from "lit";

/**
 * Styles for <tulpar-switch>. Track + thumb live inside the base
 * `<span class="control">` slot. House idioms (matching tulpar-button.styles
 * and selection-control-base.styles): only semantic tokens with literal
 * `var()` fallbacks; `:focus-visible` ring + forced-colors CanvasText;
 * reduced-motion swaps the spin animation for a pulse.
 *
 * Track geometry is derived per tier from the base `--_sel-control-size`:
 *   --_sw-track-h: control-size + 4px   (md 18 → 22)
 *   --_sw-track-w: track-h * 1.75       (md → 38.5)
 *   --_sw-thumb:   track-h - 4px        (md → 18)
 *   --_sw-travel:  track-w - thumb - 4  (md → ~16.5)
 */
export const switchStyles = css`
  :host {
    /* Derived track geometry — single source per tier via --_sel-control-size. */
    --_sw-track-h: calc(var(--_sel-control-size) + 4px);
    --_sw-track-w: calc(var(--_sw-track-h) * 1.75);
    --_sw-thumb: calc(var(--_sw-track-h) - 4px);
    --_sw-travel: calc(var(--_sw-track-w) - var(--_sw-thumb) - 4px);

    /* Track colors — on-color/off-color props set these inline on the host. */
    --_sw-track-on: var(--tulpar-switch-track-on, #00c57a);
    --_sw-track-off: var(--tulpar-switch-track-off, #c8d0ce);

    /* Thumb icon colors. */
    --_sw-icon-on: var(--_sw-track-on);
    --_sw-icon-off: var(--tulpar-switch-thumb-icon-off, #636568);
  }

  /* ── Track (the focusable role=switch button) ─────────────────────────── */
  .track {
    position: relative;
    flex-shrink: 0;
    box-sizing: border-box;
    width: var(--_sw-track-w);
    height: var(--_sw-track-h);
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 999px;
    background: var(--_sw-track-off);
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
    transition: background-color 200ms cubic-bezier(0.2, 0, 0, 1);
  }

  :host([checked]) .track {
    background: var(--_sw-track-on);
  }

  /* ── Thumb ─────────────────────────────────────────────────────────────── */
  .thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: var(--_sw-thumb);
    height: var(--_sw-thumb);
    border-radius: 50%;
    background: var(--tulpar-switch-thumb, #fff);
    box-shadow:
      0 1px 2px rgba(11, 8, 4, 0.28),
      0 2px 6px -1px rgba(11, 8, 4, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
    transform: translateX(0);
    transition: transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1);
    display: grid;
    place-items: center;
  }

  :host([checked]) .thumb {
    transform: translateX(var(--_sw-travel));
  }

  /* Press squish — thumb stretches slightly toward the travel direction. */
  .track:active .thumb {
    width: calc(var(--_sw-thumb) + 3px);
    transition:
      transform 240ms cubic-bezier(0.34, 1.3, 0.64, 1),
      width 120ms cubic-bezier(0.2, 0, 0, 1);
  }

  /* ── Thumb icons ──────────────────────────────────────────────────────── */
  .thumb-glyph {
    position: relative;
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }

  .ic {
    grid-area: 1 / 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    font-size: calc(var(--_sw-thumb) * 0.62);
    line-height: 1;
    transition: opacity 160ms ease;
  }

  .ic svg {
    width: 1em;
    height: 1em;
    display: block;
  }

  .ic--on {
    color: var(--_sw-icon-on);
  }
  .ic--off {
    color: var(--_sw-icon-off);
  }

  /* Icons hidden entirely unless show-icon. */
  .ic--on,
  .ic--off {
    opacity: 0;
  }
  :host([show-icon]) .ic--off {
    opacity: 1;
  }
  :host([show-icon][checked]) .ic--off {
    opacity: 0;
  }
  :host([show-icon][checked]) .ic--on {
    opacity: 1;
  }

  /* ── Spinner (loading) ────────────────────────────────────────────────── */
  .spinner {
    grid-area: 1 / 1;
    width: calc(var(--_sw-thumb) * 0.6);
    height: calc(var(--_sw-thumb) * 0.6);
    border: 2px solid var(--_sw-icon-off);
    border-top-color: transparent;
    border-radius: 50%;
    opacity: 0;
    animation: tulpar-switch-spin var(--tulpar-switch-spinner-duration, 700ms) linear infinite;
  }

  :host([loading]) .track {
    pointer-events: none;
  }
  :host([loading]) .thumb-glyph .ic {
    opacity: 0 !important;
  }
  :host([loading]) .spinner {
    opacity: 1;
  }

  /* ── Focus ring ───────────────────────────────────────────────────────── */
  .track {
    outline: none;
  }
  :host(:focus-visible) .track,
  .track:focus-visible {
    outline: 2px solid var(--tulpar-selection-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 3px;
  }
  @media (forced-colors: active) {
    :host(:focus-visible) .track,
    .track:focus-visible {
      outline-color: CanvasText;
    }
  }

  /* ── Disabled ─────────────────────────────────────────────────────────── */
  :host([disabled]) .track {
    background: var(--tulpar-selection-control-bg-disabled, #e9f1ef);
    cursor: not-allowed;
  }
  :host([disabled]) .thumb {
    box-shadow: none;
    background: var(--tulpar-switch-thumb, #fff);
    opacity: 0.7;
  }

  /* ── Invalid (danger ring; keep brand on-track when checked) ──────────── */
  :host([invalid]) .track {
    box-shadow: inset 0 0 0 1px var(--tulpar-selection-control-border-invalid, #b22128);
  }

  /* ── Dark-mode layered shadow ─────────────────────────────────────────── */
  @media (prefers-color-scheme: dark) {
    .thumb {
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }
  }
  :host-context(.dark) .thumb {
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }

  /* ── Keyframes ────────────────────────────────────────────────────────── */
  @keyframes tulpar-switch-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes tulpar-switch-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  /* ── Reduced motion ───────────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .thumb,
    .track,
    .ic {
      transition: none !important;
    }
    .spinner {
      animation: tulpar-switch-pulse 1.2s ease-in-out infinite;
    }
  }
`;
