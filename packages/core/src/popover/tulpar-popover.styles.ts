import { css } from "lit";

/**
 * Popover surface styling — the LARGEST member of the overlay family. Where the
 * tooltip is an inverted chip and the toggletip a small neutral bubble, the
 * popover reads as a substantial, grounded card: a real interactive surface that
 * hosts forms, lists and controls.
 *
 * Design intent (enterprise-refined):
 * - A heavier, layered elevation (two stacked shadows + a hairline top
 *   highlight) so it sits clearly ABOVE app chrome and feels physical, not
 *   floaty. Distinct from the toggletip's lighter lift.
 * - Comfortable padding (popover padding token) and a slightly larger radius so
 *   it reads as a card, not a tooltip.
 * - The content region (`.body`) owns a token-fed `max-height` with internal
 *   scroll, so long content scrolls inside the card while the card stays
 *   anchored. A restrained, theme-aware scrollbar keeps it enterprise-clean.
 * - Origin-aware motion that is calmer than the toggletip's: a smaller scale +
 *   a touch more travel reads as the card "settling" out of the trigger rather
 *   than popping.
 *
 * The surface is positioned by JS via inline left/top (viewport coordinates),
 * so this file owns appearance, the (default-off) arrow, scroll, and motion.
 *
 * Tone reuses the family's single-source approach: tone remaps the three
 * `--_pop-*` custom props, and the surface, arrow and border all paint from
 * them. The focus ring inside a toned surface uses the NEUTRAL overlay focus
 * ring token (not the tone family) — verified ≥3:1 against the tinted bg.
 *
 * Only semantic `--tulpar-overlay-*` / `--tulpar-color-*` tokens are referenced
 * (never primitives — enforced by ESLint on *.styles.ts).
 */
export const popoverStyles = css`
  :host {
    display: contents;

    /* Motion knobs (token-fed, conservative fallbacks). Calmer than toggletip. */
    --_pop-enter: var(--tulpar-overlay-motion-duration-enter, 160ms);
    --_pop-exit: var(--tulpar-overlay-motion-duration-exit, 110ms);
    --_pop-easing: var(--tulpar-overlay-motion-easing, cubic-bezier(0.2, 0.9, 0.3, 1));
    /* How far the card travels along the main axis as it settles in. */
    --_pop-shift: 8px;

    /* Surface paint — neutral overlay surface by default. tone overrides these
       three props (see [data-tone] rules) so surface, arrow and border stay in
       sync from one source. */
    --_pop-bg: var(--tulpar-overlay-surface-bg, #ffffff);
    --_pop-fg: var(--tulpar-color-text-primary, #15110b);
    --_pop-border: var(--tulpar-overlay-surface-border, #d9e0df);
  }

  .surface {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--tulpar-overlay-z-index, 1000);
    box-sizing: border-box;
    width: max-content;
    /* Card-scale sizing: a sensible default min/max so it reads as a panel. */
    min-width: 200px;
    max-width: min(92vw, 380px);
    background: var(--_pop-bg);
    color: var(--_pop-fg);
    border-radius: 14px;
    border: 1px solid var(--_pop-border);
    font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
    font-size: 14px;
    font-weight: 450;
    line-height: 1.5;
    letter-spacing: 0.002em;
    text-align: left;
    overflow: visible;
    /* Heavier, layered elevation — grounded card, clearly above chrome. The
       inset hairline reads as a soft top highlight catching light. */
    box-shadow:
      0 1px 0 0 rgba(255, 255, 255, 0.04) inset,
      var(
        --tulpar-overlay-shadow,
        0 18px 48px -16px rgba(2, 8, 23, 0.34),
        0 6px 16px -8px rgba(2, 8, 23, 0.18)
      );
  }

  /* The surface container is programmatically focused (tabindex=-1) when the
     content has no focusable of its own — it must not show a focus outline in
     that case, but keyboard focus is still moved into it. */
  .surface:focus {
    outline: none;
  }
  .surface:focus-visible {
    outline: 2px solid var(--tulpar-overlay-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
  }

  /* ============================================================
   * Tone (semantic intents). Each tone remaps the three surface custom props.
   * Color is never the sole carrier — pair with a slotted heading/icon.
   * tone is a no-op under forced-colors (system colors win, see below).
   * ============================================================ */
  :host([tone="info"]) {
    --_pop-bg: var(--tulpar-overlay-tone-info-surface, #cfeeff);
    --_pop-fg: var(--tulpar-overlay-tone-info-on-surface, #1b476f);
    --_pop-border: var(--tulpar-overlay-tone-info-border, #1d588b);
  }
  :host([tone="success"]) {
    --_pop-bg: var(--tulpar-overlay-tone-success-surface, #ffeac0);
    --_pop-fg: var(--tulpar-overlay-tone-success-on-surface, #695114);
    --_pop-border: var(--tulpar-overlay-tone-success-border, #886816);
  }
  :host([tone="warning"]) {
    --_pop-bg: var(--tulpar-overlay-tone-warning-surface, #ffd8df);
    --_pop-fg: var(--tulpar-overlay-tone-warning-on-surface, #691f2b);
    --_pop-border: var(--tulpar-overlay-tone-warning-border, #822133);
  }
  :host([tone="danger"]) {
    --_pop-bg: var(--tulpar-overlay-tone-danger-surface, #e7dfff);
    --_pop-fg: var(--tulpar-overlay-tone-danger-on-surface, #41276a);
    --_pop-border: var(--tulpar-overlay-tone-danger-border, #4e2b82);
  }

  /* Native-popover path: neutralize the UA popover box so our coordinates win. */
  .surface[popover] {
    margin: 0;
    inset: auto;
  }

  /* Closed: hidden. [data-open] is the single source of truth for visibility,
     set by JS after the surface is positioned, so the card never flashes at the
     origin before measurement. [data-exiting] keeps it displayed for the exit. */
  .surface:not([data-open]):not([data-exiting]) {
    display: none;
  }
  .surface[data-exiting] {
    display: block;
  }

  /* ============================================================
   * Body — the scrollable content region. Owns the token-fed max-height + the
   * internal scroll. Padding lives here so the scrollbar tucks against the card
   * edge with comfortable inner gutters.
   * ============================================================ */
  .body {
    display: block;
    box-sizing: border-box;
    padding: var(--tulpar-overlay-size-popover-padding, 16px);
    max-height: var(--tulpar-overlay-size-popover-max-h, min(28rem, 60vh));
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Match the card radius so the scroll region clips cleanly at the corners. */
    border-radius: inherit;
    /* Restrained, theme-aware scrollbar. */
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, currentColor 26%, transparent) transparent;
  }
  .body::-webkit-scrollbar {
    width: 10px;
  }
  .body::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 3px solid transparent;
    border-radius: 999px;
    background-color: color-mix(in srgb, currentColor 24%, transparent);
  }
  .body::-webkit-scrollbar-thumb:hover {
    background-color: color-mix(in srgb, currentColor 38%, transparent);
  }
  .body::-webkit-scrollbar-track {
    background: transparent;
  }

  ::slotted(*) {
    /* The card owns the surrounding padding; let slotted content sit flush so a
       full-width header/footer reaches the card edges. */
    margin: 0;
  }

  /* ============================================================
   * Origin-aware enter / exit motion. transform-origin sits on the edge nearest
   * the trigger so the card appears to grow out of the anchor. data-side is
   * applied by JS post-measure.
   * ============================================================ */
  .surface[data-open] {
    display: block;
    animation: pop-enter var(--_pop-enter) var(--_pop-easing) both;
  }
  .surface[data-exiting] {
    pointer-events: none;
    animation: pop-exit var(--_pop-exit) var(--_pop-easing) both;
  }

  .surface[data-side="top"] {
    transform-origin: bottom center;
    --_pop-from-y: var(--_pop-shift);
    --_pop-from-x: 0px;
  }
  .surface[data-side="bottom"] {
    transform-origin: top center;
    --_pop-from-y: calc(-1 * var(--_pop-shift));
    --_pop-from-x: 0px;
  }
  .surface[data-side="left"] {
    transform-origin: center right;
    --_pop-from-x: var(--_pop-shift);
    --_pop-from-y: 0px;
  }
  .surface[data-side="right"] {
    transform-origin: center left;
    --_pop-from-x: calc(-1 * var(--_pop-shift));
    --_pop-from-y: 0px;
  }

  @keyframes pop-enter {
    from {
      opacity: 0;
      transform: translate(var(--_pop-from-x, 0), var(--_pop-from-y, 0)) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
  }
  @keyframes pop-exit {
    from {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(var(--_pop-from-x, 0), var(--_pop-from-y, 0)) scale(0.99);
    }
  }

  /* ============================================================
   * Arrow — default OFF for the popover, but supported when [arrow] is set. A
   * rotated square sharing the surface bg + border so it reads as a notched
   * corner. Two outward-facing borders per side.
   * ============================================================ */
  .arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background: var(--_pop-bg);
    border: 1px solid var(--_pop-border);
    transform: rotate(45deg);
    pointer-events: none;
  }
  .surface[data-side="top"] .arrow {
    border-top: 0;
    border-left: 0;
  }
  .surface[data-side="bottom"] .arrow {
    border-bottom: 0;
    border-right: 0;
  }
  .surface[data-side="left"] .arrow {
    border-bottom: 0;
    border-left: 0;
  }
  .surface[data-side="right"] .arrow {
    border-top: 0;
    border-right: 0;
  }
  .arrow[data-hidden] {
    display: none;
  }

  /* ============================================================
   * Reduced motion — opacity only, no scale/slide.
   * ============================================================ */
  @media (prefers-reduced-motion: reduce) {
    .surface[data-open] {
      animation: pop-fade-in var(--_pop-enter) ease both;
    }
    .surface[data-exiting] {
      animation: pop-fade-out var(--_pop-exit) ease both;
    }
    @keyframes pop-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes pop-fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }

  /* ============================================================
   * Forced colors (Windows High Contrast) — system colors win. tone is a no-op;
   * the surface + arrow use Canvas/CanvasText so they never dissolve.
   * ============================================================ */
  @media (forced-colors: active) {
    .surface {
      background: Canvas;
      color: CanvasText;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
    .arrow {
      background: Canvas;
      border: 1px solid CanvasText;
      box-shadow: none;
    }
  }
`;
