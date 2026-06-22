import { css } from "lit";

/**
 * Styles for <tulpar-spinner> — indeterminate loader (quarter-arc).
 *
 * House idioms (matching tulpar-skeleton.styles.ts / tulpar-tag.styles.ts):
 * - Only semantic / atom tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - @media (prefers-reduced-motion: reduce) → no spin; a calm 3-dot opacity
 *   cycle is shown instead (the rotating arc is hidden, the dots are revealed).
 * - @media (forced-colors: active) → strokes/dots map to CanvasText.
 *
 * ## Geometry
 * The SVG is authored in a fixed 24×24 viewBox (two circles, r=9). The host
 * scales the box per size tier (xs14 / sm16 / md20 / lg24 / xl28). Because the
 * px stroke scales WITH the box, a single constant viewBox stroke-width (2.6)
 * yields the spec ratio (stroke ≈ size × 0.11) at EVERY size — no per-size
 * stroke override needed.
 *
 * Quarter-ish arc: circumference = 2·π·9 ≈ 56.55. dasharray = full
 * circumference; dashoffset 40.7 reveals ~28% (a touch more than a clean 25%
 * for legibility at xs/sm). stroke-linecap: round (house consistency w/ switch).
 *
 * ## Tone
 * The arc + track inherit `currentColor` by default (the element colorizes the
 * host inline for built-in / custom tones; omitted tone → page currentColor).
 * The faint track ring is currentColor @ ~0.12 opacity.
 */
export const spinnerStyles = css`
  /* ── Size tier (outer diameter px; default md) ────────────────────────── */
  :host {
    --_spin-size: 20px;
  }
  :host([size="xs"]) {
    --_spin-size: 14px;
  }
  :host([size="sm"]) {
    --_spin-size: 16px;
  }
  :host([size="lg"]) {
    --_spin-size: 24px;
  }
  :host([size="xl"]) {
    --_spin-size: 28px;
  }

  /* ── Host ─────────────────────────────────────────────────────────────── */
  :host {
    display: inline-flex;
    vertical-align: middle;
    line-height: 0;
  }
  /* Before the delay elapses the element renders nothing; the host reserves no
     visible glyph until ready. */

  .spinner {
    display: block;
    width: var(--_spin-size);
    height: var(--_spin-size);
  }
  .spinner svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* ── Custom-tone color (the element sets -accent-l/-d inline vars) ─────── */
  /* Built-in tones set host color inline directly. Custom tones get the light
     accent here; this rule swaps to the dark accent under .dark. */
  :host([tone="custom"]) {
    color: var(--tulpar-spinner-accent-l);
  }
  :host-context(.dark)[tone="custom"] {
    color: var(--tulpar-spinner-accent-d);
  }

  /* ── Track ring (faint full circle) ───────────────────────────────────── */
  circle.track {
    stroke: currentColor;
    opacity: 0.12;
  }
  /* Hidden when track is off. */
  :host(:not([track])) circle.track {
    display: none;
  }

  /* ── Arc (the moving quarter) ─────────────────────────────────────────── */
  circle.arc {
    stroke: currentColor;
    stroke-linecap: round;
    /* circumference ≈ 56.55; offset 40.7 → ~28% visible arc */
    stroke-dasharray: 56.549;
    stroke-dashoffset: 40.7;
  }

  /* ── Spin animation (default) ─────────────────────────────────────────── */
  @media (prefers-reduced-motion: no-preference) {
    .spinner svg {
      transform-origin: 50% 50%;
      animation: tulpar-spinner-rotate 0.7s linear infinite;
    }
  }
  @keyframes tulpar-spinner-rotate {
    to {
      transform: rotate(360deg);
    }
  }

  /* ── Reduced-motion fallback → 3-dot opacity cycle (no rotation) ──────── */
  .dots {
    display: none;
    align-items: center;
    justify-content: center;
    gap: calc(var(--_spin-size) * 0.18);
    width: var(--_spin-size);
    height: var(--_spin-size);
  }
  .dots span {
    display: block;
    width: calc(var(--_spin-size) * 0.2);
    height: calc(var(--_spin-size) * 0.2);
    border-radius: 50%;
    background: currentColor;
    opacity: 0.3;
  }
  @media (prefers-reduced-motion: reduce) {
    /* Replace the spinning arc with a calm 3-dot opacity cycle. */
    .spinner {
      display: none;
    }
    .dots {
      display: inline-flex;
    }
    .dots span {
      animation: tulpar-spinner-dots 1.2s ease-in-out infinite;
    }
    .dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .dots span:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
  @keyframes tulpar-spinner-dots {
    0%,
    100% {
      opacity: 0.3;
    }
    40% {
      opacity: 1;
    }
  }

  /* ── Visually-hidden accessible label ─────────────────────────────────── */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* ── Forced colors (HCM) ──────────────────────────────────────────────── */
  @media (forced-colors: active) {
    circle.track {
      stroke: GrayText;
      opacity: 1;
    }
    circle.arc {
      stroke: CanvasText;
    }
    .dots span {
      background: CanvasText;
      opacity: 1;
    }
  }
`;
