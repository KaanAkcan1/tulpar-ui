import { css } from "lit";

export const headerStyles = css`
  .header {
    flex: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 0.875rem;
  }

  /* Built-in toggle button */
  .sidenav-toggle {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0.25rem;
    border-radius: var(--tulpar-radius-sm, 0.25rem);
    cursor: pointer;
    color: var(--tulpar-shell-sidenav-fg, #334155);
    line-height: 0;
    transition: background 120ms ease;
  }

  .sidenav-toggle:hover {
    background: var(--tulpar-shell-sidenav-item-hover-bg, rgba(11, 8, 4, 0.06));
  }

  .sidenav-toggle:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, #00c57a);
    outline-offset: 2px;
  }

  /* Brand wordmark — sits next to the toggle */
  .brand {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
  }

  /* Rail mode B1: collapse header to toggle only — hide the wordmark */
  :host([data-rail]) .brand {
    display: none;
  }

  /* Rail mode: center the toggle in the narrowed header */
  :host([data-rail]) .header {
    justify-content: center;
    padding-inline: 0;
  }
`;
