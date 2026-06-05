import { css } from "lit";

export const buttonStyles = css`
  :host {
    display: inline-flex;
  }

  :host([disabled]),
  :host([loading]) {
    cursor: not-allowed;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--tulpar-button-icon-gap, 8px);

    font-family: var(--tulpar-font-family-body, system-ui);
    font-weight: var(--tulpar-button-font-weight, 500);
    font-size: var(--_btn-font-size);
    line-height: 1;

    height: var(--_btn-height);
    padding: 0 var(--_btn-padding-x);
    border-radius: var(--tulpar-button-border-radius, 6px);
    border: var(--tulpar-button-border-width, 1px) solid transparent;

    cursor: inherit;
    text-decoration: none;
    user-select: none;
    transition: var(--tulpar-transition-default, all 150ms ease);

    background: var(--_btn-bg, transparent);
    color: var(--_btn-fg, currentColor);
    border-color: var(--_btn-border, transparent);
  }

  /* --- Sizes via host attribute --- */
  :host([size="xs"])  .btn { --_btn-height: var(--tulpar-button-size-xs-height,  24px); --_btn-padding-x: var(--tulpar-button-size-xs-padding-x,  8px); --_btn-font-size: var(--tulpar-button-size-xs-font-size, 12px); }
  :host([size="sm"])  .btn { --_btn-height: var(--tulpar-button-size-sm-height,  32px); --_btn-padding-x: var(--tulpar-button-size-sm-padding-x, 12px); --_btn-font-size: var(--tulpar-button-size-sm-font-size, 14px); }
  :host([size="md"])  .btn { --_btn-height: var(--tulpar-button-size-md-height,  40px); --_btn-padding-x: var(--tulpar-button-size-md-padding-x, 16px); --_btn-font-size: var(--tulpar-button-size-md-font-size, 14px); }
  :host([size="lg"])  .btn { --_btn-height: var(--tulpar-button-size-lg-height,  48px); --_btn-padding-x: var(--tulpar-button-size-lg-padding-x, 20px); --_btn-font-size: var(--tulpar-button-size-lg-font-size, 16px); }
  :host([size="xl"])  .btn { --_btn-height: var(--tulpar-button-size-xl-height,  56px); --_btn-padding-x: var(--tulpar-button-size-xl-padding-x, 24px); --_btn-font-size: var(--tulpar-button-size-xl-font-size, 18px); }
  :host([size="2xl"]) .btn { --_btn-height: var(--tulpar-button-size-2xl-height, 64px); --_btn-padding-x: var(--tulpar-button-size-2xl-padding-x, 28px); --_btn-font-size: var(--tulpar-button-size-2xl-font-size, 20px); }
  :host([size="3xl"]) .btn { --_btn-height: var(--tulpar-button-size-3xl-height, 72px); --_btn-padding-x: var(--tulpar-button-size-3xl-padding-x, 32px); --_btn-font-size: var(--tulpar-button-size-3xl-font-size, 24px); }

  /* --- Variants --- */
  :host([variant="primary"]) .btn {
    --_btn-bg: var(--tulpar-color-brand-default, #2563eb);
    --_btn-fg: var(--tulpar-color-brand-on-color, #fff);
  }
  :host([variant="primary"]) .btn:hover { background: var(--tulpar-color-brand-hover, #1d4ed8); }
  :host([variant="primary"]) .btn:active { background: var(--tulpar-color-brand-active, #1e40af); }

  :host([variant="secondary"]) .btn {
    --_btn-bg: transparent;
    --_btn-fg: var(--tulpar-color-brand-default, #2563eb);
    --_btn-border: var(--tulpar-color-border-default, #e5e7eb);
  }
  :host([variant="secondary"]) .btn:hover {
    --_btn-bg: var(--tulpar-color-brand-subtle, #eff6ff);
    --_btn-border: var(--tulpar-color-border-strong, #d1d5db);
  }

  :host([variant="danger"]) .btn {
    --_btn-bg: var(--tulpar-color-danger-default, #dc2626);
    --_btn-fg: var(--tulpar-color-danger-on-color, #fff);
  }
  :host([variant="danger"]) .btn:hover { background: var(--tulpar-color-danger-hover, #b91c1c); }

  :host([variant="ghost"]) .btn {
    --_btn-bg: transparent;
    --_btn-fg: var(--tulpar-color-text-primary, #111827);
  }
  :host([variant="ghost"]) .btn:hover {
    --_btn-bg: var(--tulpar-color-brand-subtle, rgba(0,0,0,0.05));
  }

  :host([variant="link"]) .btn {
    --_btn-bg: transparent;
    --_btn-fg: var(--tulpar-color-brand-default, #2563eb);
    --_btn-padding-x: 0;
    --_btn-height: auto;
    border: none;
    text-decoration: underline;
  }

  /* --- Focus ring --- */
  .btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px var(--tulpar-color-focus-ring, rgba(59, 130, 246, 0.5));
  }

  /* --- Disabled --- */
  :host([disabled]) .btn {
    opacity: 0.5;
    pointer-events: none;
    cursor: not-allowed;
  }

  /* --- Loading --- */
  :host([loading]) .btn {
    pointer-events: none;
  }
  :host([loading]) .label,
  :host([loading]) ::slotted(*) {
    visibility: hidden;
  }
  .spinner {
    position: absolute;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: tulpar-spin 600ms linear infinite;
  }
  :host(:not([loading])) .spinner { display: none; }

  @keyframes tulpar-spin {
    to { transform: rotate(360deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .spinner { animation-duration: 1500ms; }
    .btn { transition: none; }
  }

  /* --- Icon-only mode (square padding) --- */
  :host([icon-only]) .btn {
    padding: 0;
    width: var(--_btn-height);
  }

  /* --- Position context for spinner --- */
  .btn { position: relative; }

  /* --- Button-group positioning (set by tulpar-button-group via attribute) --- */
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
`;
