import { css } from "lit";

/**
 * Styles for <tulpar-toast>.
 *
 * House idioms (matching tulpar-switch.styles.ts):
 * - Only semantic tokens via var() with literal fallbacks; NO --tulpar-primitive-* refs.
 * - :focus-visible ring + forced-colors CanvasText border.
 * - prefers-reduced-motion respected (drops transform/scale to opacity only).
 *
 * ## Internal custom property pipeline
 *
 * Built-in tones (info/success/warning/danger):
 *   The host has [tone="info|success|..."] and .styles.ts maps it to the
 *   semantic --tulpar-feedback-tone-<tone>-* vars, which already flip for
 *   .dark via the generated CSS token sheet.
 *
 * Custom tones:
 *   The element sets --tulpar-toast-surface-l / -d etc. as inline styles on
 *   the host.  The :host / :host-context(.dark) rules here pick the right pair
 *   into the internal --_toast-* pipeline consumed everywhere below.
 */
export const toastStyles = css`
  /* ── Internal variable pipeline (custom tone: -l → light, -d → dark) ── */
  :host {
    /* Defaults point to the built-in semantic token for the active tone.
       For built-in tones [tone="info|success|..."] the :host([tone=...])
       rules below override these with the right family. For custom tones
       the -l vars set inline on the host will win here. */
    --_toast-surface: var(--tulpar-toast-surface-l, transparent);
    --_toast-on-surface: var(--tulpar-toast-on-surface-l, inherit);
    --_toast-border: var(--tulpar-toast-border-l, var(--tulpar-color-border-default, #e2e8f0));
    --_toast-accent: var(--tulpar-toast-accent-l, var(--tulpar-color-brand-default, #2563eb));
  }

  /* Dark mode: flip to -d variants for custom tones. */
  :host-context(.dark) {
    --_toast-surface: var(--tulpar-toast-surface-d, transparent);
    --_toast-on-surface: var(--tulpar-toast-on-surface-d, inherit);
    --_toast-border: var(--tulpar-toast-border-d, var(--tulpar-color-border-default, #334155));
    --_toast-accent: var(--tulpar-toast-accent-d, var(--tulpar-color-brand-default, #60a5fa));
  }

  /* ── Built-in tone overrides (semantic tokens → internal vars) ── */
  :host([tone="info"]) {
    --_toast-surface:    var(--tulpar-feedback-tone-info-surface,    #eff6ff);
    --_toast-on-surface: var(--tulpar-feedback-tone-info-on-surface, #1e3a5f);
    --_toast-border:     var(--tulpar-feedback-tone-info-border,     #93c5fd);
    --_toast-accent:     var(--tulpar-feedback-tone-info-accent,     #2563eb);
  }

  :host([tone="success"]) {
    --_toast-surface:    var(--tulpar-feedback-tone-success-surface,    #f0fdf4);
    --_toast-on-surface: var(--tulpar-feedback-tone-success-on-surface, #14532d);
    --_toast-border:     var(--tulpar-feedback-tone-success-border,     #86efac);
    --_toast-accent:     var(--tulpar-feedback-tone-success-accent,     #16a34a);
  }

  :host([tone="warning"]) {
    --_toast-surface:    var(--tulpar-feedback-tone-warning-surface,    #fffbeb);
    --_toast-on-surface: var(--tulpar-feedback-tone-warning-on-surface, #451a03);
    --_toast-border:     var(--tulpar-feedback-tone-warning-border,     #fcd34d);
    --_toast-accent:     var(--tulpar-feedback-tone-warning-accent,     #d97706);
  }

  :host([tone="danger"]) {
    --_toast-surface:    var(--tulpar-feedback-tone-danger-surface,    #fef2f2);
    --_toast-on-surface: var(--tulpar-feedback-tone-danger-on-surface, #450a0a);
    --_toast-border:     var(--tulpar-feedback-tone-danger-border,     #fca5a5);
    --_toast-accent:     var(--tulpar-feedback-tone-danger-accent,     #dc2626);
  }

  /* ── High-contrast danger escalation ── */
  :host([data-hc]) {
    --_toast-surface:    var(--tulpar-feedback-danger-hc-surface, #b91c1c);
    --_toast-on-surface: var(--tulpar-feedback-danger-hc-on,      #ffffff);
    --_toast-border:     transparent;
    --_toast-accent:     #ffffff;
  }

  /* ── Host layout ── */
  :host {
    display: block;
    width: var(--tulpar-feedback-size-toast-max-width, 360px);
    max-width: calc(100vw - 32px);
    box-sizing: border-box;
    /* Enables the F6 region jump to land on the host element itself */
    outline: none;
  }

  /* ── Card ─────────────────────────────────────────────────────────────── */
  .toast-card {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-start;
    padding: var(--tulpar-feedback-size-toast-padding, 12px 16px);
    border-radius: var(--tulpar-feedback-size-toast-radius, 12px);
    background: var(--_toast-surface);
    border: 1px solid var(--_toast-border);
    color: var(--_toast-on-surface);
    box-shadow: var(--tulpar-feedback-shadow, 0 4px 6px -2px rgba(10, 37, 64, 0.10), 0 12px 28px -6px rgba(10, 37, 64, 0.18), 0 0 0 1px rgba(0,0,0,0.04));
  }

  /* ── Icon ─────────────────────────────────────────────────────────────── */
  .toast-icon {
    flex: 0 0 auto;
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    margin-top: 1px;
    color: var(--_toast-accent);
    font-size: 16px;
    line-height: 1;
  }

  .toast-icon svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  /* Slotted icon: size it to the icon area regardless of intrinsic size */
  .toast-icon ::slotted(*) {
    width: 18px;
    height: 18px;
    display: block;
  }

  /* ── Body (title + description) ───────────────────────────────────────── */
  .toast-body {
    flex: 1 1 auto;
    min-width: 0;
  }

  .toast-title {
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--_toast-accent);
  }

  /* High-contrast: title reads on saturated surface → use on-surface */
  :host([data-hc]) .toast-title {
    color: var(--_toast-on-surface);
  }

  /* .toast-description is always in the DOM; hidden unless the host has
     [data-has-description] (set by _syncDescriptionAttr / _onDescSlotChange). */
  .toast-description {
    display: none;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
    margin-top: 2px;
    color: var(--_toast-on-surface);
    opacity: 0.85;
  }

  :host([data-has-description]) .toast-description {
    display: block;
  }

  :host([data-hc]) .toast-description {
    opacity: 1;
  }

  /* ── Actions ──────────────────────────────────────────────────────────── */
  .toast-actions {
    display: flex;
    gap: 7px;
    margin-top: 9px;
  }

  .toast-actions button {
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    border-radius: 7px;
    padding: 4px 10px;
    cursor: pointer;
    border: 1px solid rgba(0, 0, 0, 0.12);
    background: rgba(255, 255, 255, 0.7);
    color: var(--_toast-on-surface);
    transition: background-color 120ms ease, opacity 120ms ease;
  }

  .toast-actions button:hover {
    background: rgba(255, 255, 255, 0.9);
  }

  .toast-actions button.action-primary {
    border: none;
    color: #fff;
    background: var(--_toast-accent);
  }

  .toast-actions button.action-primary:hover {
    opacity: 0.9;
  }

  :host([data-hc]) .toast-actions button.action-primary {
    background: rgba(255, 255, 255, 0.22);
  }

  /* ── Close button ─────────────────────────────────────────────────────── */
  .toast-close {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    padding: 0;
    margin: 0;
    margin-top: 1px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--_toast-on-surface);
    opacity: 0.55;
    font-size: 16px;
    line-height: 1;
    border-radius: 4px;
    transition: opacity 120ms ease;
  }

  .toast-close:hover {
    opacity: 0.85;
  }

  :host([data-hc]) .toast-close {
    color: rgba(255, 255, 255, 0.85);
    opacity: 1;
  }

  /* ── Focus ring (host-level for the F6 jump) ──────────────────────────── */
  :host(:focus-visible) {
    outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
    border-radius: var(--tulpar-feedback-size-toast-radius, 12px);
  }

  .toast-close:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
  }

  .toast-actions button:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
    outline-offset: 2px;
  }

  /* ── Forced colors (HCM) ──────────────────────────────────────────────── */
  @media (forced-colors: active) {
    .toast-card {
      border: 1px solid CanvasText;
    }

    :host(:focus-visible) {
      outline-color: CanvasText;
    }

    .toast-close:focus-visible,
    .toast-actions button:focus-visible {
      outline-color: CanvasText;
    }

    .toast-icon {
      color: CanvasText;
    }

    .toast-title,
    .toast-description,
    .toast-close {
      color: CanvasText;
      opacity: 1;
    }

    .toast-actions button {
      color: ButtonText;
      background: ButtonFace;
      border-color: ButtonText;
    }

    .toast-actions button.action-primary {
      color: ButtonText;
      background: Highlight;
      border-color: ButtonText;
    }
  }

  /* ── Reduced motion ───────────────────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    .toast-card {
      transition: none !important;
    }

    .toast-close,
    .toast-actions button {
      transition: none !important;
    }
  }
`;
