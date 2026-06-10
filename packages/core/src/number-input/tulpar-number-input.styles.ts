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
`;
