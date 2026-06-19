import { css } from "lit";

/**
 * Tooltip surface styling — an inverted chip that grows from the trigger.
 *
 * Design intent (enterprise-refined, not decorative): the chip should read as a
 * physical object that emerges from the anchor. Motion is therefore
 * origin-aware — the surface scales up from the edge nearest the trigger
 * (transform-origin keyed off `data-side`) with a brief, eased enter and a
 * shorter, snappier exit. The arrow is a true rotated square sharing the chip's
 * surface + shadow so it reads as a notched corner, not a pasted-on triangle.
 *
 * The surface is positioned by JS via inline left/top (viewport coordinates),
 * so this file owns only appearance, the arrow, the hover bridge, and motion.
 *
 * Only semantic `--tulpar-overlay-*` tokens are referenced (never primitives —
 * enforced by ESLint on *.styles.ts).
 */
export const tooltipStyles = css`
  :host {
    /* The host owns no layout box in normal flow: the trigger is an external
       element referenced by the for attribute, and the surface is
       position:fixed (promoted to the top layer when opened). display:contents
       keeps the host out of layout while still rendering the shadow surface. */
    display: contents;

    /* Motion knobs (token-fed, with conservative fallbacks). */
    --_tt-enter: var(--tulpar-overlay-motion-duration-enter, 160ms);
    --_tt-exit: var(--tulpar-overlay-motion-duration-exit, 110ms);
    --_tt-easing: var(--tulpar-overlay-motion-easing, cubic-bezier(0.2, 0.9, 0.3, 1));
    /* How far the chip slides in along the main axis as it scales up. */
    --_tt-shift: 4px;
  }

  .surface {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--tulpar-overlay-z-index, 1000);
    box-sizing: border-box;
    width: max-content;
    max-width: var(--tulpar-overlay-size-tooltip-max-width, 32ch);
    padding: var(--tulpar-overlay-size-tooltip-padding, 7px 11px);
    background: var(--tulpar-overlay-tooltip-bg, #15110b);
    color: var(--tulpar-overlay-tooltip-text, #f0f7f5);
    border-radius: 8px;
    /* Transparent border by default; forced-colors swaps in a real one. */
    border: 1px solid transparent;
    font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
    font-size: 12.5px;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.005em;
    text-align: left;
    overflow: visible;
    box-shadow: var(
      --tulpar-overlay-shadow,
      0 10px 30px -10px rgba(2, 8, 23, 0.28),
      0 2px 6px -2px rgba(2, 8, 23, 0.12)
    );
    pointer-events: none;
  }

  /* Native-popover path: neutralize the UA popover box so our coordinates win. */
  .surface[popover] {
    margin: 0;
    inset: auto;
  }

  /* Closed: hidden. [data-open] is the single source of truth for visibility,
     set by JS after the surface is positioned, so the chip never flashes at the
     origin before measurement. While [data-exiting] (the brief close
     animation) the surface stays displayed so the exit can play. */
  .surface:not([data-open]):not([data-exiting]) {
    display: none;
  }
  .surface[data-exiting] {
    display: block;
  }

  /* ============================================================
   * Origin-aware enter / exit motion
   * The transform-origin sits on the edge nearest the trigger so the chip
   * appears to grow out of the anchor. data-side is applied by JS post-measure.
   * ============================================================ */
  .surface[data-open] {
    display: block;
    animation: tt-enter var(--_tt-enter) var(--_tt-easing) both;
  }

  /* While exiting, the surface stops intercepting the pointer and plays a
     shorter exit. The JS removes it from the DOM after the exit (or instantly
     on Esc), so the animation is fully interruptible. */
  .surface[data-exiting] {
    pointer-events: none;
    animation: tt-exit var(--_tt-exit) var(--_tt-easing) both;
  }

  /* transform-origin + slide direction per side. The chip is on the named side
     of the anchor, so it grows toward the anchor from its far edge. */
  .surface[data-side="top"] {
    transform-origin: bottom center;
    --_tt-from-y: var(--_tt-shift);
    --_tt-from-x: 0px;
  }
  .surface[data-side="bottom"] {
    transform-origin: top center;
    --_tt-from-y: calc(-1 * var(--_tt-shift));
    --_tt-from-x: 0px;
  }
  .surface[data-side="left"] {
    transform-origin: center right;
    --_tt-from-x: var(--_tt-shift);
    --_tt-from-y: 0px;
  }
  .surface[data-side="right"] {
    transform-origin: center left;
    --_tt-from-x: calc(-1 * var(--_tt-shift));
    --_tt-from-y: 0px;
  }

  @keyframes tt-enter {
    from {
      opacity: 0;
      transform: translate(var(--_tt-from-x, 0), var(--_tt-from-y, 0)) scale(0.94);
    }
    to {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
  }
  @keyframes tt-exit {
    from {
      opacity: 1;
      transform: translate(0, 0) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(var(--_tt-from-x, 0), var(--_tt-from-y, 0)) scale(0.97);
    }
  }

  /* ============================================================
   * Content
   * ============================================================ */
  .content {
    display: block;
    white-space: normal;
    word-break: break-word;
  }

  /* ============================================================
   * Arrow — a rotated square sharing the chip surface + a sliver of its shadow,
   * so it reads as a true notched corner.
   * ============================================================ */
  .arrow {
    position: absolute;
    width: 9px;
    height: 9px;
    background: var(--tulpar-overlay-tooltip-bg, #15110b);
    /* A faint matching shadow on the outer two faces only. */
    box-shadow: var(--tulpar-overlay-shadow, 0 2px 6px -2px rgba(2, 8, 23, 0.18));
    transform: rotate(45deg);
    pointer-events: none;
    /* Clip the inner half so the arrow's shadow doesn't bleed over the chip. */
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
  }
  /* Orient the visible (outer) faces per side by re-rotating the clip via the
     element's rotation; the clip above keeps the outer corner, and per-side
     placement (set inline by JS) puts it on the correct edge. */
  .surface[data-side="bottom"] .arrow {
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }
  .surface[data-side="left"] .arrow {
    clip-path: polygon(100% 0, 0 100%, 100% 100%);
  }
  .surface[data-side="right"] .arrow {
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }
  .arrow[data-hidden] {
    display: none;
  }

  /* ============================================================
   * Hover bridge — invisible pad spanning the offset gap so the pointer can
   * travel trigger → surface without crossing dead space (WCAG 1.4.13). It is
   * part of the surface, so it extends the surface's pointer region.
   * ============================================================ */
  .bridge {
    position: absolute;
    background: transparent;
    pointer-events: auto;
  }
  .surface[data-open] {
    pointer-events: auto;
  }

  /* ============================================================
   * Reduced motion — opacity only, no scale/slide.
   * ============================================================ */
  @media (prefers-reduced-motion: reduce) {
    .surface[data-open] {
      animation: tt-fade-in var(--_tt-enter) ease both;
    }
    .surface[data-exiting] {
      animation: tt-fade-out var(--_tt-exit) ease both;
    }
    @keyframes tt-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes tt-fade-out {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  }

  /* ============================================================
   * Forced colors (Windows High Contrast) — give the chip a real border and a
   * visible arrow so it doesn't dissolve into the canvas.
   * ============================================================ */
  @media (forced-colors: active) {
    .surface {
      border: 1px solid CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }
    .arrow {
      background: Canvas;
      box-shadow: none;
      border: 1px solid CanvasText;
      clip-path: none;
    }
  }
`;
