import { css } from "lit";

/**
 * Styles for <tulpar-progress> — linear + circular progress.
 *
 * House idioms (matching tulpar-spinner.styles.ts / tulpar-skeleton.styles.ts):
 * - Only semantic / atom tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - @media (prefers-reduced-motion: reduce) → determinate snaps with a short
 *   fade (no width / dashoffset travel); indeterminate becomes an opacity pulse
 *   on a static track (no traveling bar).
 * - @media (forced-colors: active) → fill CanvasText, track GrayText.
 *
 * ## Geometry (circular)
 * Both ring circles declare pathLength="100" so the circumference is normalized
 * to 100 at EVERY size — the determinate dashoffset is simply (100 - pct), with
 * no per-size circumference math. The ring is rotated -90deg so 0% starts at 12
 * o'clock and fills clockwise.
 *
 * ## Tone
 * The fill reads `currentColor`; the host `color` is set to the tone accent
 * (brand green by default). The track is a neutral surface token. Custom tones
 * emit -accent-l/-d inline vars; this file maps them to `color` per mode.
 */
export const progressStyles = css`
  /* ── Tone color (default brand green; built-in tones set color inline) ──── */
  :host {
    color: var(--tulpar-color-brand-default, #00c57a);
    --_prog-track: var(--tulpar-atom-tone-neutral-soft-surface, #dde4e8);
  }
  :host-context(.dark) {
    --_prog-track: var(--tulpar-atom-tone-neutral-soft-surface, #2b3035);
  }
  /* Custom tone: the element emits -accent-l/-d; pick per mode. */
  :host([tone="custom"]) {
    color: var(--tulpar-progress-accent-l, var(--tulpar-color-brand-default, #00c57a));
  }
  :host-context(.dark)[tone="custom"] {
    color: var(--tulpar-progress-accent-d, var(--tulpar-color-brand-default, #00c57a));
  }

  /* ── Host ─────────────────────────────────────────────────────────────── */
  :host {
    display: block;
    box-sizing: border-box;
  }
  :host([variant="circular"]) {
    display: inline-flex;
    vertical-align: middle;
  }

  /* ─────────────────────────── LINEAR ────────────────────────────────────── */
  .track {
    position: relative;
    display: block;
    width: 100%;
    height: 6px;
    border-radius: 9999px;
    background: var(--_prog-track);
    overflow: hidden;
  }
  /* Thickness tiers (regular default). */
  :host([thickness="thin"]) .track {
    height: 4px;
  }
  :host([thickness="thick"]) .track {
    height: 8px;
  }

  /* Buffer: a fainter secondary segment behind the fill. */
  .buffer {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 0;
    border-radius: 9999px;
    background: currentColor;
    opacity: 0.24;
    transition: width 0.32s cubic-bezier(0.2, 0, 0, 1);
  }
  :host(:not([data-buffer])) .buffer {
    display: none;
  }

  /* Determinate fill. */
  .fill {
    position: absolute;
    inset: 0;
    height: 100%;
    width: 0;
    border-radius: 9999px;
    background: currentColor;
    transition: width 0.32s cubic-bezier(0.2, 0, 0, 1);
  }

  /* Indeterminate linear: one ~40%-wide traveling bar. */
  :host([indeterminate][variant="linear"]) .fill,
  :host([indeterminate]:not([variant="circular"])) .fill {
    width: 40%;
    inset: 0 auto 0 0;
  }
  @media (prefers-reduced-motion: no-preference) {
    :host([indeterminate][variant="linear"]) .fill,
    :host([indeterminate]:not([variant="circular"])) .fill {
      transition: none;
      animation: tulpar-progress-travel 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }
  @keyframes tulpar-progress-travel {
    0% {
      transform: translateX(-120%);
    }
    100% {
      transform: translateX(360%);
    }
  }
  /* Reduced motion: a static full bar that pulses opacity (no travel). */
  @media (prefers-reduced-motion: reduce) {
    :host([indeterminate][variant="linear"]) .fill,
    :host([indeterminate]:not([variant="circular"])) .fill {
      width: 100%;
      transition: none;
      animation: tulpar-progress-pulse 1.5s ease-in-out infinite;
    }
    /* Determinate snaps with a short fade instead of a width slide. */
    .fill,
    .buffer {
      transition: opacity 0.12s linear;
    }
  }
  @keyframes tulpar-progress-pulse {
    0%,
    100% {
      opacity: 0.35;
    }
    50% {
      opacity: 0.85;
    }
  }

  /* Value label (linear) — sits beside the bar. */
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .row .track {
    flex: 1;
  }
  .value {
    flex: none;
    font-family: inherit;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: var(--tulpar-color-text-secondary, #4f5153);
    min-width: 2.5em;
    text-align: right;
  }
  :host(:not([data-value-label])) .value {
    display: none;
  }

  /* ─────────────────────────── CIRCULAR ──────────────────────────────────── */
  .circular {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
  }
  :host([size="sm"]) .circular {
    width: 32px;
    height: 32px;
  }
  :host([size="lg"]) .circular {
    width: 56px;
    height: 56px;
  }
  .circular svg {
    display: block;
    width: 100%;
    height: 100%;
    /* 0% at 12 o'clock, fill clockwise. */
    transform: rotate(-90deg);
  }
  circle.ring-track {
    stroke: var(--_prog-track);
  }
  circle.ring-fill {
    stroke: currentColor;
    stroke-linecap: round;
    /* pathLength=100 → dasharray 100; offset = 100 - pct (set inline). */
    stroke-dasharray: 100;
    transition: stroke-dashoffset 0.32s cubic-bezier(0.2, 0, 0, 1);
  }
  @media (prefers-reduced-motion: reduce) {
    circle.ring-fill {
      transition: opacity 0.12s linear;
    }
  }

  /* Indeterminate circular: a rotating quarter-ish arc (spinner-style). */
  :host([indeterminate][variant="circular"]) circle.ring-fill {
    /* ~25% visible arc on a pathLength-100 ring. */
    stroke-dasharray: 25 75;
    stroke-dashoffset: 0;
    transition: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    :host([indeterminate][variant="circular"]) .circular svg {
      transform-origin: 50% 50%;
      animation: tulpar-progress-rotate 0.9s linear infinite;
    }
  }
  @keyframes tulpar-progress-rotate {
    from {
      transform: rotate(-90deg);
    }
    to {
      transform: rotate(270deg);
    }
  }
  /* Reduced motion: no rotation; static arc that pulses opacity. */
  @media (prefers-reduced-motion: reduce) {
    :host([indeterminate][variant="circular"]) circle.ring-fill {
      animation: tulpar-progress-pulse 1.5s ease-in-out infinite;
    }
  }

  /* Centered percentage label inside the ring. */
  .circular .value {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    text-align: center;
    font-size: 11px;
    color: var(--tulpar-color-text-secondary, #4f5153);
  }
  :host([size="lg"]) .circular .value {
    font-size: 13px;
  }
  :host(:not([data-value-label])) .circular .value {
    display: none;
  }

  /* ── Visually-hidden helper (unused content fallback) ─────────────────── */
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
    .fill,
    .buffer {
      background: CanvasText;
    }
    .track {
      background: GrayText;
    }
    circle.ring-fill {
      stroke: CanvasText;
    }
    circle.ring-track {
      stroke: GrayText;
    }
    .value {
      color: CanvasText;
    }
  }
`;
