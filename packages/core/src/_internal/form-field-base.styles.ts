import { css } from "lit";

export const formFieldBaseStyles = css`
  :host {
    display: block;
    width: 100%;
    font-family: inherit;
    color: var(--tulpar-input-text-default, #1c1917);
  }

  :host([disabled]) {
    pointer-events: none;
    cursor: not-allowed;
  }

  .field-label {
    display: block;
    font-size: 0.875rem;
    color: var(--tulpar-input-label-default, #44403c);
    margin-bottom: 0.25rem;
    line-height: 1.25;
  }

  .field-required-marker {
    color: var(--tulpar-input-label-required, #dc2626);
    margin-left: 0.125rem;
  }

  .field-necessity-text {
    color: var(--tulpar-input-message-helper, #57534e);
    font-weight: normal;
  }

  .field-message-row {
    min-height: var(--tulpar-input-message-row-height, 1.25rem);
    margin-top: 0.25rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    line-height: 1.25rem;
  }

  .field-message {
    color: var(--tulpar-input-message-helper, #57534e);
  }

  .field-message[data-kind='error'] {
    color: var(--tulpar-input-message-error, #b91c1c);
  }

  .field-message[data-kind='warn'] {
    color: var(--tulpar-input-message-warn, #b45309);
  }

  .field-status-zone {
    display: inline-flex;
    align-items: center;
    margin-left: 0.25rem;
    transition: opacity 150ms ease-out;
  }

  .field-status-zone:empty {
    display: none;
  }

  .field-status-icon[data-kind='invalid'] {
    color: var(--tulpar-input-icon-invalid, #b91c1c);
  }
  .field-status-icon[data-kind='warn'] {
    color: var(--tulpar-input-icon-warn, #d97706);
  }
  .field-status-icon[data-kind='validating'] {
    color: var(--tulpar-input-icon-validating, #133a66);
  }

  .field-status-icon--spin {
    animation: tulpar-input-spinner 800ms linear infinite;
  }

  @keyframes tulpar-input-spinner {
    to { transform: rotate(360deg); }
  }

  .field-prefix-host, .field-suffix-host {
    display: inline-flex;
    align-items: center;
    pointer-events: none;
    padding: 0 0.25rem;
  }

  :host([prefix-interactive]) .field-prefix-host {
    pointer-events: auto;
  }
  :host([suffix-interactive]) .field-suffix-host {
    pointer-events: auto;
  }

  :host {
    --field-resolved-height: var(--tulpar-input-size-md-height, 2.25rem);
    --field-resolved-padding-x: var(--tulpar-input-size-md-padding-x, 0.75rem);
    --field-resolved-padding-y: var(--tulpar-input-size-md-padding-y, 0.375rem);
    --field-resolved-font-size: var(--tulpar-input-size-md-font-size, 0.875rem);
  }

  :host([size='xs']) {
    --field-resolved-height: var(--tulpar-input-size-xs-height, 1.5rem);
    --field-resolved-padding-x: var(--tulpar-input-size-xs-padding-x, 0.5rem);
    --field-resolved-padding-y: var(--tulpar-input-size-xs-padding-y, 0.125rem);
    --field-resolved-font-size: var(--tulpar-input-size-xs-font-size, 0.75rem);
  }
  :host([size='sm']) {
    --field-resolved-height: var(--tulpar-input-size-sm-height, 1.75rem);
    --field-resolved-padding-x: var(--tulpar-input-size-sm-padding-x, 0.625rem);
    --field-resolved-padding-y: var(--tulpar-input-size-sm-padding-y, 0.25rem);
    --field-resolved-font-size: var(--tulpar-input-size-sm-font-size, 0.875rem);
  }
  :host([size='lg']) {
    --field-resolved-height: var(--tulpar-input-size-lg-height, 2.75rem);
    --field-resolved-padding-x: var(--tulpar-input-size-lg-padding-x, 0.875rem);
    --field-resolved-padding-y: var(--tulpar-input-size-lg-padding-y, 0.5rem);
    --field-resolved-font-size: var(--tulpar-input-size-lg-font-size, 1rem);
  }
  :host([size='xl']) {
    --field-resolved-height: var(--tulpar-input-size-xl-height, 3.25rem);
    --field-resolved-padding-x: var(--tulpar-input-size-xl-padding-x, 1rem);
    --field-resolved-padding-y: var(--tulpar-input-size-xl-padding-y, 0.625rem);
    --field-resolved-font-size: var(--tulpar-input-size-xl-font-size, 1.125rem);
  }

  /* ── Variant: control-row shell ─────────────────────────────────────── */

  .control-row {
    display: inline-flex;
    align-items: center;
    width: 100%;
    min-height: var(--field-resolved-height);
    padding: var(--field-resolved-padding-y) var(--field-resolved-padding-x);
    font-size: var(--field-resolved-font-size);
    background: var(--tulpar-input-bg-default, #fff);
    color: var(--tulpar-input-text-default, #1c1917);
    border: 1px solid var(--tulpar-input-border-default, #e7e5e4);
    border-radius: var(--tulpar-input-radius, 0.375rem);
    position: relative;
  }

  :host([variant='filled']) .control-row {
    background: var(--tulpar-input-bg-readonly, #fafaf9);
    border-color: transparent;
  }

  :host([variant='underlined']) .control-row {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--tulpar-input-border-default, #e7e5e4);
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
  }

  :host([variant='ghost']) .control-row {
    background: transparent;
    border-color: transparent;
  }

  :host([variant='ghost']) .control-row:focus-within {
    outline: 2px solid var(--tulpar-input-border-focus, #133a66);
    outline-offset: -1px;
  }

  /* ── Float label common ──────────────────────────────────────────────── */

  .field-label--float,
  .field-label--float-in,
  .field-label--float-on {
    position: absolute;
    pointer-events: none;
  }

  .field-label--float {
    top: 50%;
    left: var(--field-resolved-padding-x);
    transform: translateY(-50%);
    color: var(--tulpar-input-text-placeholder, #a8a29e);
    background: transparent;
    transition: transform 150ms ease, top 150ms ease, font-size 150ms ease;
  }

  [data-label-position='float'] .control-row:focus-within ~ .field-label--float,
  [data-label-position='float'][data-has-value] .field-label--float {
    top: 0;
    transform: translateY(-50%) scale(0.85);
    background: var(--tulpar-input-label-float-bg, #fff);
    padding: 0 0.25rem;
    color: var(--tulpar-input-label-default, #44403c);
  }

  [data-label-position='float-in'] .field-label--float-in {
    top: 50%;
    left: var(--field-resolved-padding-x);
    transform: translateY(-50%);
  }

  [data-label-position='float-in'] .control-row:focus-within ~ .field-label--float-in,
  [data-label-position='float-in'][data-has-value] .field-label--float-in {
    top: 0.25rem;
    transform: none;
    font-size: 0.7rem;
    color: var(--tulpar-input-label-default, #44403c);
  }

  [data-label-position='float-on'] .field-label--float-on {
    top: 0;
    left: var(--field-resolved-padding-x);
    transform: translateY(-50%);
    background: var(--tulpar-input-label-float-bg, #fff);
    padding: 0 0.25rem;
    font-size: 0.75rem;
    color: var(--tulpar-input-label-default, #44403c);
  }

  /* Truncation for long labels in float modes (full text preserved for screen readers
     via the <label> element; only visual rendering ellipsizes). */
  .field-label--float,
  .field-label--float-in,
  .field-label--float-on {
    max-width: calc(80% - var(--field-resolved-padding-x));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .field-validating-live {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  .field-status-icon {
    transition: opacity 150ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .field-status-icon,
    .field-label--float,
    .field-label--float-in,
    .field-label--float-on {
      transition: none !important;
    }
    .field-status-icon--spin {
      animation: none;
      opacity: 0.7;
    }
    :host([data-mask-rejected]) {
      animation: none !important;
    }
  }
`;
