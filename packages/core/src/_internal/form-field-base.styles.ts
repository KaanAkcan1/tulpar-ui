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
`;
