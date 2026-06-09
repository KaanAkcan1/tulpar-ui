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
`;
