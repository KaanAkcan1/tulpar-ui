import { css } from "lit";

/**
 * Styles for <tulpar-skeleton> — loading placeholder.
 *
 * House idioms (matching tulpar-tag.styles.ts / tulpar-badge.styles.ts):
 * - Only semantic / atom tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - base / sheen are neutral surface tokens that auto-flip via the generated
 *   token sheet; literal fallbacks cover the no-token case (e.g. WTR).
 * - @media (prefers-reduced-motion: reduce) → static diagonal tint (no movement).
 * - @media (forced-colors: active) → dashed CanvasText outline (the gradient is
 *   invisible in HCM, so the shape must be drawn as a border).
 *
 * ## Shimmer
 * A directional 100° sweep — calmer than an opacity pulse across dense rows:
 *   background: linear-gradient(100deg, base 40%, sheen 50%, base 60%)
 *              right / 220% 100%;
 *   @keyframes shimmer { to { background-position: left } }
 */
export const skeletonStyles = css`
  /* ── base / sheen pipeline (light default; .dark swap) ────────────────── */
  :host {
    /* Light: a light gray surface + a lighter sheen. */
    --_sk-base: var(--tulpar-atom-tone-neutral-soft-surface, #e9ecef);
    --_sk-sheen: var(--tulpar-color-bg-subtle, #f8f9fa);
  }
  :host-context(.dark) {
    /* Dark: a deep neutral base + a slightly lighter sheen. */
    --_sk-base: var(--tulpar-atom-tone-neutral-soft-surface, #23272d);
    --_sk-sheen: var(--tulpar-color-bg-subtle, #2b3035);
  }

  /* ── Host ─────────────────────────────────────────────────────────────── */
  :host {
    display: block;
    box-sizing: border-box;
  }
  :host([variant="circle"]) {
    display: inline-block;
    vertical-align: middle;
  }

  /* ── Bar (the painted placeholder) ────────────────────────────────────── */
  .bar {
    display: block;
    box-sizing: border-box;
    width: 100%;
    background-color: var(--_sk-base);
    border-radius: 6px;
  }

  /* Text variant: thin lines with small radius; stack with vertical rhythm. */
  :host([variant="text"]) .bar {
    height: 0.7em;
    border-radius: 2px;
    margin: 6px 0;
  }
  :host([variant="text"]) .bar:first-child {
    margin-top: 0;
  }
  :host([variant="text"]) .bar:last-child {
    margin-bottom: 0;
  }

  /* Rect variant: a block; default height is generous, override via height. */
  :host([variant="rect"]) .bar {
    height: 72px;
    border-radius: 6px;
  }

  /* Circle variant: a round placeholder. */
  :host([variant="circle"]) .bar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  /* ── Shimmer animation (default) ──────────────────────────────────────── */
  @media (prefers-reduced-motion: no-preference) {
    :host([animation="shimmer"]) .bar,
    :host(:not([animation])) .bar {
      background-image: linear-gradient(
        100deg,
        var(--_sk-base) 40%,
        var(--_sk-sheen) 50%,
        var(--_sk-base) 60%
      );
      background-repeat: no-repeat;
      background-size: 220% 100%;
      background-position: right;
      animation: tulpar-skeleton-shimmer 1.4s linear infinite;
    }
  }
  @keyframes tulpar-skeleton-shimmer {
    to {
      background-position: left;
    }
  }

  /* ── Pulse animation (opacity throb) ──────────────────────────────────── */
  @media (prefers-reduced-motion: no-preference) {
    :host([animation="pulse"]) .bar {
      animation: tulpar-skeleton-pulse 1.5s ease-in-out infinite;
    }
  }
  @keyframes tulpar-skeleton-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* ── No animation (static) ────────────────────────────────────────────── */
  :host([animation="none"]) .bar {
    animation: none;
    background-image: none;
  }

  /* ── Reduced motion → static diagonal tint (no movement) ──────────────── */
  @media (prefers-reduced-motion: reduce) {
    .bar {
      animation: none !important;
      background-image: repeating-linear-gradient(
        115deg,
        var(--_sk-base),
        var(--_sk-base) 8px,
        var(--_sk-sheen) 8px,
        var(--_sk-sheen) 16px
      );
      background-size: auto;
      background-position: 0 0;
    }
  }

  /* ── Forced colors (HCM) — the gradient is invisible, draw the shape ───── */
  @media (forced-colors: active) {
    .bar {
      background: Canvas !important;
      background-image: none !important;
      border: 1px dashed CanvasText;
      animation: none !important;
    }
  }
`;
