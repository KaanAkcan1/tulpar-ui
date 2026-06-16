import { css } from "lit";

export const navSectionStyles = css`
  :host {
    display: block;
  }
  .section-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--tulpar-shell-sidenav-fg-muted, #74777a);
    padding: 1rem 0.75rem 0.375rem;
  }
  .section-items {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  /* Rail: hide label text, collapse to a divider.
     Uses :host([data-rail]) — the sidenav reflects data-rail onto each item (B3). */
  :host([data-rail]) .section-label {
    height: 1px;
    padding: 0.5rem 0.75rem;
    overflow: hidden;
    text-indent: -9999px;
    border-top: 1px solid var(--tulpar-shell-sidenav-border, #d9e0df);
  }
`;
