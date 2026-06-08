import { css } from "lit";

export const buttonGroupStyles = css`
  :host {
    display: inline-flex;
  }
  :host([stacked]) {
    flex-direction: column;
  }
  .group {
    display: inline-flex;
  }
  :host([stacked]) .group {
    flex-direction: column;
  }
`;
