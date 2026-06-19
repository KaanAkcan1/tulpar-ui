import { css } from "lit";

/**
 * Toggletip surface styling — a SURFACE (like a popover), not the inverted
 * tooltip chip. The toggletip is a click-triggered disclosure that reveals a
 * brief, non-interactive bubble on the neutral overlay surface.
 *
 * Design intent (enterprise-refined): the bubble reads as a calm, physical card
 * that emerges from the trigger. Motion is origin-aware — the surface scales up
 * from the edge nearest the trigger (transform-origin keyed off `data-side`)
 * with a brief, eased enter and a shorter exit. The arrow is a true rotated
 * square sharing the surface bg + border, so it reads as a notched corner.
 *
 * The surface is positioned by JS via inline left/top (viewport coordinates),
 * so this file owns appearance, the arrow, and motion only.
 *
 * Only semantic `--tulpar-overlay-*` tokens are referenced (never primitives —
 * enforced by ESLint on *.styles.ts).
 */
export const toggletipStyles = css`
  :host {
    display: contents;

    /* Motion knobs (token-fed, with conservative fallbacks). */
    --_tg-enter: var(--tulpar-overlay-motion-duration-enter, 160ms);
    --_tg-exit: var(--tulpar-overlay-motion-duration-exit, 110ms);
    --_tg-easing: var(--tulpar-overlay-motion-easing, cubic-bezier(0.2, 0.9, 0.3, 1));
    /* How far the surface slides in along the main axis as it scales up. */
    --_tg-shift: 5px;

    /* Surface paint — neutral overlay surface by default. tone overrides these
       three custom props (see [data-tone] rules), so the surface, arrow and
       border all stay in sync from a single source. */
    --_tg-bg: var(--tulpar-overlay-surface-bg, #ffffff);
    --_tg-fg: var(--tulpar-color-text-primary, #15110b);
    --_tg-border: var(--tulpar-overlay-surface-border, #d9e0df);
  }

  .surface {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--tulpar-overlay-z-index, 1000);
    box-sizing: border-box;
    width: max-content;
    max-width: var(--tulpar-overlay-size-tooltip-max-width, 32ch);
    /* Comfortable padding like a popover (not the tight tooltip padding). */
    padding: var(--tulpar-overlay-size-popover-padding, 16px);
    background: var(--_tg-bg);
    color: var(--_tg-fg);
    border-radius: 10px;
    border: 1px solid var(--_tg-border);
    font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
    font-size: 13px;
    font-weight: 450;
    line-height: 1.5;
    letter-spacing: 0.003em;
    text-align: left;
    overflow: visible;
    box-shadow: var(
      --tulpar-overlay-shadow,
      0 10px 30px -10px rgba(2, 8, 23, 0.28),
      0 2px 6px -2px rgba(2, 8, 23, 0.12)
    );
    pointer-events: none;
  }

  /* ============================================================
   * Tone (semantic intents). Each tone remaps the three surface custom props,
   * so the surface, arrow and border all stay in sync from one source. Color is
   * never the sole carrier — pair with a slotted [slot="icon"] (WCAG 1.4.1).
   * tone is intentionally a no-op under forced-colors (system colors win — see
   * the forced-colors block below, which comes later and overrides these).
   * ============================================================ */
  :host([tone="info"]) {
    --_tg-bg: var(--tulpar-overlay-tone-info-surface, #cfeeff);
    --_tg-fg: var(--tulpar-overlay-tone-info-on-surface, #1b476f);
    --_tg-border: var(--tulpar-overlay-tone-info-border, #1d588b);
  }
  :host([tone="success"]) {
    --_tg-bg: var(--tulpar-overlay-tone-success-surface, #ffeac0);
    --_tg-fg: var(--tulpar-overlay-tone-success-on-surface, #695114);
    --_tg-border: var(--tulpar-overlay-tone-success-border, #886816);
  }
  :host([tone="warning"]) {
    --_tg-bg: var(--tulpar-overlay-tone-warning-surface, #ffd8df);
    --_tg-fg: var(--tulpar-overlay-tone-warning-on-surface, #691f2b);
    --_tg-border: var(--tulpar-overlay-tone-warning-border, #822133);
  }
  :host([tone="danger"]) {
    --_tg-bg: var(--tulpar-overlay-tone-danger-surface, #e7dfff);
    --_tg-fg: var(--tulpar-overlay-tone-danger-on-surface, #41276a);
    --_tg-border: var(--tulpar-overlay-tone-danger-border, #4e2b82);
  }

  /* Native-popover path: neutralize the UA popover box so our coordinates win. */
  .surface[popover] {
    margin: 0;
    inset: auto;
  }

  /* Closed: hidden. [data-open] is the single source of truth for visibility,
     set by JS after the surface is positioned, so the bubble never flashes at
     the origin before measurement. [data-exiting] keeps it displayed for the
     brief exit animation. */
  .surface:not([data-open]):not([data-exiting]) {
    display: none;
  }
  .surface[data-exiting] {
    display: block;
  }

  /* ============================================================
   * Body — content + optional status icon laid out as a row.
   * ============================================================ */
  .body {
    display: flex;
    align-items: flex-start;
    gap: 9px;
  }
  .icon {
    display: inline-flex;
    flex: none;
    /* Optically align the icon to the first line of text. */
    margin-top: 1px;
    line-height: 0;
  }
  /* When no icon is slotted the wrapper collapses (no phantom gap). */
  .icon:not(.icon--filled) {
    display: none;
  }
  .content {
    display: block;
    min-width: 0;
    white-space: normal;
    word-break: break-word;
  }

  /* ============================================================
   * Origin-aware enter / exit motion.
   * transform-origin sits on the edge nearest the trigger so the surface
   * appears to grow out of the anchor. data-side is applied by JS post-measure.
   * ============================================================ */
  .surface[data-open] {
    display: block;
    animation: tg-enter var(--_tg-enter) var(--_tg-easing) both;
    pointer-events: auto;
  }
  .surface[data-exiting] {
    pointer-events: none;
    animation: tg-exit var(--_tg-exit) var(--_tg-easing) both;
  }

  .surface[data-side="top"] {
    transform-origin: bottom center;
    --_tg-from-y: var(--_tg-shift);
    --_tg-from-x: 0px;
  }
  .surface[data-side="bottom"] {
    transform-origin: top center;
    --_tg-from-y: calc(-1 * var(--_tg-shift));
    --_tg-from-x: 0px;
  }
  .surface[data-side="left"] {
    transform-origin: center right;
    --_tg-from-x: var(--_tg-shift);
    --_tg-from-y: 0px;
  }
  .surface[data-side="right"] {
    transform-origin: center left;
    --_tg-from-x: calc(-1 * var(--_tg-shift));
    --_tg-from-y: 0px;
  }

  @keyframes tg-enter {
    from {
      opacity: 0;
      transform: translate(var(--_tg-from-x, 0), var(--_tg-from-y, 0)) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
  }
  @keyframes tg-exit {
    from {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(var(--_tg-from-x, 0), var(--_tg-from-y, 0)) scale(0.98);
    }
  }

  /* ============================================================
   * Arrow — a rotated square sharing the surface bg + border, so it reads as a
   * true notched corner. Two adjacent borders are shown per side.
   * ============================================================ */
  .arrow {
    position: absolute;
    width: 11px;
    height: 11px;
    background: var(--_tg-bg);
    border: 1px solid var(--_tg-border);
    transform: rotate(45deg);
    pointer-events: none;
  }
  /* Show only the two outward-facing borders so the arrow joins the surface
     edge cleanly (the inner two borders would draw a line across the body). */
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
      animation: tg-fade-in var(--_tg-enter) ease both;
    }
    .surface[data-exiting] {
      animation: tg-fade-out var(--_tg-exit) ease both;
    }
    @keyframes tg-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes tg-fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }

  /* ============================================================
   * Forced colors (Windows High Contrast) — system colors win. tone is a no-op
   * here; the surface + arrow use Canvas/CanvasText so they never dissolve.
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
