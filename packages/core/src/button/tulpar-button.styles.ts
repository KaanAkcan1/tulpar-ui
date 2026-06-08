import { css, unsafeCSS } from "lit";
import { FALLBACKS } from "@tulpar-ui/tokens/fallbacks";

const FB_BORDER = unsafeCSS(FALLBACKS.borderDefault);
const FB_TEXT_PRIMARY = unsafeCSS(FALLBACKS.textPrimary);
const FB_TEXT_INVERSE = unsafeCSS(FALLBACKS.textInverse);

export const buttonStyles = css`
  /* ============================================================
   * Host base
   * ============================================================ */
  :host {
    display: inline-flex;
    position: relative; /* anchor for absolutely-positioned tooltip */

    /* Default severity (primary) — color stops feed the variant rules below.
       Severity selectors below override these. JS color attribute overrides
       these via inline style.setProperty(). */
    --_btn-color-default: var(--tulpar-color-brand-default);
    --_btn-color-hover: var(--tulpar-color-brand-hover);
    --_btn-color-active: var(--tulpar-color-brand-active);
    --_btn-color-disabled: var(--tulpar-color-brand-disabled);
    --_btn-color-on: var(--tulpar-color-brand-on-color);
    --_btn-color-subtle: var(--tulpar-color-brand-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-brand-subtle-hover);

    /* Default icon size — sized rules below override per size attr. */
    --_btn-icon-size: 16px;

    /* Default separator color — variant rules override (solid uses
       rgba on white text; link uses transparent). */
    --_btn-separator: var(--tulpar-color-border-default, ${FB_BORDER});
  }

  :host([block]) {
    display: flex;
    width: 100%;
  }

  :host([disabled]),
  :host([data-disabled]),
  :host([loading]) {
    cursor: not-allowed;
  }

  /* ============================================================
   * Severity → semantic color stops
   * ============================================================ */
  :host([severity="secondary"]) {
    --_btn-color-default: var(--tulpar-color-neutral-default);
    --_btn-color-hover: var(--tulpar-color-neutral-hover);
    --_btn-color-active: var(--tulpar-color-neutral-active);
    --_btn-color-disabled: var(--tulpar-color-neutral-disabled);
    --_btn-color-on: var(--tulpar-color-neutral-on-color);
    --_btn-color-subtle: var(--tulpar-color-neutral-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-neutral-subtle-hover);
  }
  :host([severity="info"]) {
    --_btn-color-default: var(--tulpar-color-info-default);
    --_btn-color-hover: var(--tulpar-color-info-hover);
    --_btn-color-active: var(--tulpar-color-info-active);
    --_btn-color-disabled: var(--tulpar-color-info-disabled);
    --_btn-color-on: var(--tulpar-color-info-on-color);
    --_btn-color-subtle: var(--tulpar-color-info-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-info-subtle-hover);
  }
  :host([severity="success"]) {
    --_btn-color-default: var(--tulpar-color-success-default);
    --_btn-color-hover: var(--tulpar-color-success-hover);
    --_btn-color-active: var(--tulpar-color-success-active);
    --_btn-color-disabled: var(--tulpar-color-success-disabled);
    --_btn-color-on: var(--tulpar-color-success-on-color);
    --_btn-color-subtle: var(--tulpar-color-success-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-success-subtle-hover);
  }
  :host([severity="warn"]) {
    --_btn-color-default: var(--tulpar-color-warn-default);
    --_btn-color-hover: var(--tulpar-color-warn-hover);
    --_btn-color-active: var(--tulpar-color-warn-active);
    --_btn-color-disabled: var(--tulpar-color-warn-disabled);
    --_btn-color-on: var(--tulpar-color-warn-on-color);
    --_btn-color-subtle: var(--tulpar-color-warn-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-warn-subtle-hover);
  }
  :host([severity="help"]) {
    --_btn-color-default: var(--tulpar-color-help-default);
    --_btn-color-hover: var(--tulpar-color-help-hover);
    --_btn-color-active: var(--tulpar-color-help-active);
    --_btn-color-disabled: var(--tulpar-color-help-disabled);
    --_btn-color-on: var(--tulpar-color-help-on-color);
    --_btn-color-subtle: var(--tulpar-color-help-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-help-subtle-hover);
  }
  :host([severity="danger"]) {
    --_btn-color-default: var(--tulpar-color-danger-default);
    --_btn-color-hover: var(--tulpar-color-danger-hover);
    --_btn-color-active: var(--tulpar-color-danger-active);
    --_btn-color-disabled: var(--tulpar-color-danger-disabled);
    --_btn-color-on: var(--tulpar-color-danger-on-color);
    --_btn-color-subtle: var(--tulpar-color-danger-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-danger-subtle-hover);
  }
  :host([severity="contrast"]) {
    --_btn-color-default: var(--tulpar-color-contrast-default);
    --_btn-color-hover: var(--tulpar-color-contrast-hover);
    --_btn-color-active: var(--tulpar-color-contrast-active);
    --_btn-color-disabled: var(--tulpar-color-contrast-disabled);
    --_btn-color-on: var(--tulpar-color-contrast-on-color);
    --_btn-color-subtle: var(--tulpar-color-contrast-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-contrast-subtle-hover);
  }
  :host([severity="premium"]) {
    --_btn-color-default: var(--tulpar-color-premium-default);
    --_btn-color-hover: var(--tulpar-color-premium-hover);
    --_btn-color-active: var(--tulpar-color-premium-active);
    --_btn-color-disabled: var(--tulpar-color-premium-disabled);
    --_btn-color-on: var(--tulpar-color-premium-on-color);
    --_btn-color-subtle: var(--tulpar-color-premium-subtle);
    --_btn-color-subtle-hover: var(--tulpar-color-premium-subtle-hover);
  }

  /* ============================================================
   * Button base
   * ============================================================ */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--tulpar-button-icon-gap, 8px);
    font-family: var(--tulpar-font-family-ui, system-ui);
    font-weight: var(--tulpar-button-font-weight, 500);
    font-size: var(--_btn-font-size);
    line-height: 1;
    height: var(--_btn-height);
    padding: 0 var(--_btn-padding-x);
    border-radius: var(--tulpar-button-border-radius, 4px);
    border: var(--tulpar-button-border-width, 1px) solid transparent;
    cursor: inherit;
    text-decoration: none;
    user-select: none;
    transition: var(--tulpar-transition-default, all 150ms ease);
    background: var(--_btn-bg, transparent);
    color: var(--_btn-fg, currentColor);
    border-color: var(--_btn-border, transparent);
    position: relative;
    box-sizing: border-box;
  }

  :host([block]) .btn {
    width: 100%;
  }

  /* ============================================================
   * Size scale
   * ============================================================ */
  /* Lit reflects size="md" by default — no fallback selector needed. */
  :host([size="xs"]) .btn {
    --_btn-height: var(--tulpar-button-size-xs-height, 24px);
    --_btn-padding-x: var(--tulpar-button-size-xs-padding-x, 8px);
    --_btn-font-size: var(--tulpar-button-size-xs-font-size, 12px);
    --_btn-icon-size: 12px;
  }
  :host([size="sm"]) .btn {
    --_btn-height: var(--tulpar-button-size-sm-height, 32px);
    --_btn-padding-x: var(--tulpar-button-size-sm-padding-x, 12px);
    --_btn-font-size: var(--tulpar-button-size-sm-font-size, 14px);
    --_btn-icon-size: 14px;
  }
  :host([size="md"]) .btn {
    --_btn-height: var(--tulpar-button-size-md-height, 40px);
    --_btn-padding-x: var(--tulpar-button-size-md-padding-x, 16px);
    --_btn-font-size: var(--tulpar-button-size-md-font-size, 14px);
    --_btn-icon-size: 16px;
  }
  :host([size="lg"]) .btn {
    --_btn-height: var(--tulpar-button-size-lg-height, 48px);
    --_btn-padding-x: var(--tulpar-button-size-lg-padding-x, 20px);
    --_btn-font-size: var(--tulpar-button-size-lg-font-size, 16px);
    --_btn-icon-size: 18px;
  }
  :host([size="xl"]) .btn {
    --_btn-height: var(--tulpar-button-size-xl-height, 56px);
    --_btn-padding-x: var(--tulpar-button-size-xl-padding-x, 24px);
    --_btn-font-size: var(--tulpar-button-size-xl-font-size, 18px);
    --_btn-icon-size: 20px;
  }
  :host([size="2xl"]) .btn {
    --_btn-height: var(--tulpar-button-size-2xl-height, 64px);
    --_btn-padding-x: var(--tulpar-button-size-2xl-padding-x, 28px);
    --_btn-font-size: var(--tulpar-button-size-2xl-font-size, 20px);
    --_btn-icon-size: 24px;
  }
  :host([size="3xl"]) .btn {
    --_btn-height: var(--tulpar-button-size-3xl-height, 72px);
    --_btn-padding-x: var(--tulpar-button-size-3xl-padding-x, 32px);
    --_btn-font-size: var(--tulpar-button-size-3xl-font-size, 24px);
    --_btn-icon-size: 28px;
  }

  /* ============================================================
   * Variant rendering (consumes --_btn-color-* private vars)
   * ============================================================ */
  /* Default and explicit solid */
  :host,
  :host([variant="solid"]) {
    --_btn-bg: var(--_btn-color-default);
    --_btn-fg: var(--_btn-color-on);
    --_btn-border: transparent;
  }
  :host .btn:hover,
  :host([variant="solid"]) .btn:hover {
    --_btn-bg: var(--_btn-color-hover);
  }
  :host .btn:active,
  :host([variant="solid"]) .btn:active {
    --_btn-bg: var(--_btn-color-active);
  }

  /* Outlined */
  :host([variant="outlined"]) {
    --_btn-bg: transparent;
    --_btn-fg: var(--_btn-color-hover);
    --_btn-border: var(--_btn-color-default);
    --_btn-separator: var(--tulpar-color-border-default, ${FB_BORDER});
  }
  :host([variant="outlined"]) .btn:hover {
    --_btn-bg: var(--_btn-color-subtle);
    --_btn-border: var(--_btn-color-hover);
  }
  :host([variant="outlined"]) .btn:active {
    --_btn-bg: var(--_btn-color-subtle-hover);
  }

  /* Tonal */
  :host([variant="tonal"]) {
    --_btn-bg: var(--_btn-color-subtle);
    --_btn-fg: var(--_btn-color-hover);
    --_btn-border: transparent;
    --_btn-separator: var(--tulpar-color-border-default, ${FB_BORDER});
  }
  :host([variant="tonal"]) .btn:hover {
    --_btn-bg: var(--_btn-color-subtle-hover);
  }

  /* Ghost */
  :host([variant="ghost"]) {
    --_btn-bg: transparent;
    --_btn-fg: var(--_btn-color-hover);
    --_btn-border: transparent;
    --_btn-separator: var(--tulpar-color-border-default, ${FB_BORDER});
  }
  :host([variant="ghost"]) .btn:hover {
    --_btn-bg: var(--_btn-color-subtle);
  }

  /* Link */
  :host([variant="link"]) {
    --_btn-bg: transparent;
    --_btn-fg: var(--_btn-color-default);
    --_btn-border: transparent;
    --_btn-separator: transparent;
  }
  :host([variant="link"]) .btn {
    padding: 0;
    height: auto;
    border: none;
    text-decoration: underline;
  }
  :host([variant="link"]) .btn:hover {
    --_btn-fg: var(--_btn-color-hover);
  }

  /* Solid + light text → use rgba white for separator */
  :host([variant="solid"]) {
    --_btn-separator: rgba(255, 255, 255, 0.25);
  }

  /* ============================================================
   * Shape
   * ============================================================ */
  :host([shape="round"]) .btn {
    border-radius: var(--tulpar-button-radius-round, 9999px);
  }
  :host([shape="circle"]) .btn {
    border-radius: 9999px;
    width: var(--_btn-height);
    padding: 0;
    aspect-ratio: 1 / 1;
  }

  /* ============================================================
   * Modifiers — raised, justify, icon-position
   * ============================================================ */
  :host([raised]) .btn {
    box-shadow: var(
      --tulpar-button-shadow-raised,
      var(--tulpar-shadow-md, 0 1px 3px rgba(10, 37, 64, 0.08), 0 8px 24px rgba(10, 37, 64, 0.06))
    );
  }

  :host([justify="start"]) .btn {
    justify-content: flex-start;
  }
  :host([justify="end"]) .btn {
    justify-content: flex-end;
  }
  :host([justify="center"]) .btn {
    justify-content: center;
  }
  :host([justify="between"]) .btn {
    justify-content: space-between;
  }

  :host([icon-position="start"]) .btn {
    flex-direction: row;
  }
  :host([icon-position="end"]) .btn {
    flex-direction: row-reverse;
  }
  :host([icon-position="top"]) .btn,
  :host([icon-position="bottom"]) .btn {
    height: auto;
    padding: var(--_btn-padding-x);
  }
  :host([icon-position="top"]) .btn {
    flex-direction: column;
  }
  :host([icon-position="bottom"]) .btn {
    flex-direction: column-reverse;
  }

  /* ============================================================
   * Icon separator
   * ============================================================ */
  .separator {
    display: none;
    background: var(--tulpar-button-separator-color, var(--_btn-separator));
    flex-shrink: 0;
  }
  /* Only show the separator on the side that actually has a slotted icon.
     data-has-start / data-has-end are toggled by slotchange listeners,
     so empty .start / .end wrappers do not get a phantom 1px line when
     the user only passed an icon on one side. */
  :host([icon-separator][data-has-start]) .separator--start {
    display: block;
  }
  :host([icon-separator][data-has-end]) .separator--end {
    display: block;
  }

  :host(:not([icon-position])) .separator,
  :host([icon-position="start"]) .separator,
  :host([icon-position="end"]) .separator {
    width: 1px;
    align-self: stretch;
    margin: 4px 0;
  }
  :host([icon-position="top"]) .separator,
  :host([icon-position="bottom"]) .separator {
    height: 1px;
    width: 100%;
    align-self: stretch;
    margin: 4px 0;
  }

  /* ============================================================
   * Slotted icon sizing (library-agnostic normalization)
   * ============================================================ */
  ::slotted([slot="start"]),
  ::slotted([slot="end"]) {
    width: var(--tulpar-button-icon-size, var(--_btn-icon-size));
    height: var(--tulpar-button-icon-size, var(--_btn-icon-size));
    flex-shrink: 0;
  }

  /* ============================================================
   * Focus ring
   * ============================================================ */
  .btn:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, var(--_btn-color-active));
    outline-offset: 2px;
  }
  @media (forced-colors: active) {
    .btn:focus-visible {
      outline-color: CanvasText;
    }
  }

  /* ============================================================
   * Disabled / data-disabled
   * ============================================================ */
  :host([disabled]) .btn,
  :host([data-disabled]) .btn {
    opacity: 0.5;
    cursor: not-allowed;
  }
  :host([disabled]) .btn {
    pointer-events: none;
  }
  /* data-disabled intentionally does NOT block pointer events */

  /* ============================================================
   * Loading state
   * ============================================================ */
  :host([loading]) .btn {
    pointer-events: none;
  }

  .spinner {
    display: none;
    align-items: center;
    justify-content: center;
  }
  .spinner .default-spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: tulpar-button-spin 600ms linear infinite;
    display: inline-block;
  }

  /* Loading — center (default): hide label + slotted icons, overlay spinner */
  :host([loading]:not([loading-position])) .label,
  :host([loading][loading-position="center"]) .label,
  :host([loading]:not([loading-position])) .start,
  :host([loading][loading-position="center"]) .start,
  :host([loading]:not([loading-position])) .end,
  :host([loading][loading-position="center"]) .end {
    visibility: hidden;
  }
  :host([loading]:not([loading-position])) .spinner,
  :host([loading][loading-position="center"]) .spinner {
    display: inline-flex;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    visibility: visible;
  }

  /* Loading — start: spinner takes start slot's position, hide start slot */
  :host([loading][loading-position="start"]) .start {
    display: none;
  }
  :host([loading][loading-position="start"]) .spinner {
    display: inline-flex;
    order: -1;
  }

  /* Loading — end: spinner takes end slot's position, hide end slot */
  :host([loading][loading-position="end"]) .end {
    display: none;
  }
  :host([loading][loading-position="end"]) .spinner {
    display: inline-flex;
    order: 99;
  }

  /* Loading label */
  .loading-label-text {
    display: none;
  }
  :host([loading][loading-label]) .label-text {
    display: none;
  }
  :host([loading][loading-label]) .loading-label-text {
    display: inline;
  }

  @keyframes tulpar-button-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spinner .default-spinner {
      animation-duration: 1500ms;
    }
    .btn {
      transition: none;
    }
  }

  /* ============================================================
   * Icon-only mode
   * ============================================================ */
  :host([icon-only]) .btn,
  :host([shape="circle"]) .btn {
    /* Empty .label/.end are still flex items; gap between them would
       shift the lone icon off-center. Collapse gap so centering is true. */
    gap: 0;
  }
  :host([icon-only]) .btn {
    padding: 0;
    width: var(--_btn-height);
  }
  :host([icon-only]) .separator {
    display: none;
  }
  /* Hide the empty label/end wrappers in icon-only so their inner
     whitespace text nodes don't add a few pixels and offset the icon.
     Convention: icon-only buttons place their icon in the start slot
     (the Vue wrapper's :icon prop does this automatically). */
  :host([icon-only]) .label,
  :host([icon-only]) .end {
    display: none;
  }

  /* ============================================================
   * Tooltip (string-only, hover/focus reveal, fixed-below position)
   * ============================================================ */
  .tooltip {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--tulpar-color-text-primary, ${FB_TEXT_PRIMARY});
    color: var(--tulpar-color-text-inverse, ${FB_TEXT_INVERSE});
    font-family: var(--tulpar-font-family-ui, system-ui);
    font-size: 12px;
    font-weight: 500;
    line-height: 1.3;
    padding: 6px 10px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 150ms ease;
    z-index: 100;
    box-shadow: 0 2px 6px rgba(10, 37, 64, 0.18);
  }
  :host(:hover) .tooltip,
  :host(:focus-within) .tooltip {
    opacity: 1;
  }
  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .tooltip {
      transition: none;
    }
  }

  /* ============================================================
   * Group positioning — row (default)
   * ============================================================ */
  :host([data-group-position="middle"]) .btn {
    border-radius: 0;
  }
  :host([data-group-position="first"]) .btn {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  :host([data-group-position="last"]) .btn {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  :host([data-group-position="middle"]),
  :host([data-group-position="last"]) {
    margin-left: -1px;
  }

  /* Group positioning — stacked (vertical) */
  :host([data-group-orientation="stacked"][data-group-position="middle"]) .btn {
    border-radius: 0;
  }
  :host([data-group-orientation="stacked"][data-group-position="first"]) .btn {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: var(--tulpar-button-border-radius, 4px);
    border-top-right-radius: var(--tulpar-button-border-radius, 4px);
  }
  :host([data-group-orientation="stacked"][data-group-position="last"]) .btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: var(--tulpar-button-border-radius, 4px);
    border-bottom-right-radius: var(--tulpar-button-border-radius, 4px);
  }
  :host([data-group-orientation="stacked"][data-group-position="middle"]),
  :host([data-group-orientation="stacked"][data-group-position="last"]) {
    margin-left: 0;
    margin-top: -1px;
  }
`;
