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
`;
