import { css } from "lit";

export const numberInputStyles = css`
  .field-input {
    flex: 1 1 auto;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    padding: 0;
    text-align: left;
  }

  .field-input::placeholder {
    color: var(--tulpar-input-text-placeholder, #a8a29e);
  }

  .field-steppers {
    display: inline-flex;
    flex-direction: column;
    margin-left: 0.25rem;
  }

  .field-steppers button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 0.125rem 0.25rem;
    cursor: pointer;
    color: var(--tulpar-input-icon-default, #78716c);
    line-height: 0;
    border-radius: 0.125rem;
  }

  .field-steppers button:hover:not([disabled]) {
    background: var(--tulpar-input-bg-readonly, #fafaf9);
  }

  .field-steppers button[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  :host([data-mask-rejected]) {
    animation: tulpar-number-shake 200ms;
  }

  @keyframes tulpar-number-shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :host([data-mask-rejected]) {
      animation: none;
    }
  }
`;
