import { css } from "lit";

export const textareaStyles = css`
  .control-row {
    position: relative;
    align-items: stretch;
    min-height: unset;
  }

  .field-textarea {
    width: 100%;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    resize: vertical;
    padding: 0;
  }

  .field-textarea::placeholder {
    color: var(--tulpar-input-text-placeholder, #a8a29e);
  }

  :host([resize='none']) .field-textarea {
    resize: none;
  }

  :host([resize='both']) .field-textarea {
    resize: both;
  }

  :host([resize='horizontal']) .field-textarea {
    resize: horizontal;
  }

  :host([resize='vertical']) .field-textarea {
    resize: vertical;
  }

  /* ---- Corner action cluster (top-right overlay) ---- */

  .field-textarea-actions {
    position: absolute;
    top: 0.375rem;
    right: 0.375rem;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .field-textarea-actions .field-copy-btn,
  .field-textarea-actions .field-paste-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--tulpar-input-bg-default, #fff);
    border: 1px solid var(--tulpar-input-border-default, #e7e5e4);
    border-radius: 0.25rem;
    padding: 0.125rem 0.25rem;
    cursor: pointer;
    color: var(--tulpar-input-icon-default, #78716c);
  }

  .field-textarea-actions .field-copy-btn:hover,
  .field-textarea-actions .field-paste-btn:hover:not([disabled]) {
    background: var(--tulpar-input-bg-readonly, #fafaf9);
  }

  .field-textarea-actions .field-paste-btn[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ---- Counter overlay (bottom-right inside textarea) ---- */

  .field-textarea-counter {
    position: absolute;
    bottom: 0.375rem;
    right: 0.5rem;
    font-size: 0.75rem;
    color: var(--tulpar-input-message-helper, #57534e);
    pointer-events: none;
    background: var(--tulpar-input-bg-default, #fff);
    opacity: 0.85;
    padding: 0 0.25rem;
    border-radius: 0.25rem;
  }

  .field-textarea-counter[data-at-limit='true'] {
    color: var(--tulpar-input-message-error, #b91c1c);
  }

  /* Reserve room so content doesn't flow under the overlays */
  :host([show-count]) .field-textarea {
    padding-bottom: 1.5rem;
  }

  :host([copyable]) .field-textarea,
  :host([pastable]) .field-textarea {
    padding-right: 4.5rem;
  }

  /* Shake animation on paste-rejection */
  :host([data-mask-rejected]) {
    animation: tulpar-textarea-shake 200ms;
  }

  @keyframes tulpar-textarea-shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([data-mask-rejected]) {
      animation: none;
    }
  }
`;
