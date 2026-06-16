import { css } from "lit";

export const utilityStyles = css`
  .utility {
    flex: none;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    padding: 0.5rem 0.625rem;
  }

  /* Rail mode overrides for utility region */
  :host([data-rail]) .utility {
    grid-template-columns: 1fr;
  }
  :host([data-rail]) .utility-end {
    display: none;
  }
`;
