import { css } from "lit";

export const textInputStyles = css`
  .field-input {
    flex: 1 1 auto;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    padding: 0;
  }

  .field-input::placeholder {
    color: var(--tulpar-input-text-placeholder, #a8a29e);
  }

  .field-reveal-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 0.125rem;
    margin-left: 0.25rem;
    cursor: pointer;
    color: var(--tulpar-input-icon-default, #78716c);
    border-radius: 999px;
  }

  .field-reveal-btn:hover {
    background: var(--tulpar-input-bg-readonly, #fafaf9);
  }

  .field-clear-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 0.125rem;
    margin-left: 0.25rem;
    cursor: pointer;
    color: var(--tulpar-input-icon-default, #78716c);
    border-radius: 999px;
  }

  .field-clear-btn:hover {
    background: var(--tulpar-input-bg-readonly, #fafaf9);
  }

  .field-counter {
    margin-left: auto;
    color: var(--tulpar-input-message-helper, #57534e);
    font-size: 0.75rem;
  }

  .field-counter[data-at-limit='true'] {
    color: var(--tulpar-input-message-error, #b91c1c);
  }

  .field-search-icon {
    display: inline-flex;
    align-items: center;
    color: var(--tulpar-input-icon-default, #78716c);
  }
`;
