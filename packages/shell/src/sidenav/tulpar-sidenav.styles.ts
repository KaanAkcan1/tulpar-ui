import { css } from "lit";

export const sidenavStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    background: var(--tulpar-shell-sidenav-bg, #f8fafc);
    color: var(--tulpar-shell-sidenav-fg, #334155);
    border-inline-end: 1px solid var(--tulpar-shell-sidenav-border, #e2e8f0);
    overflow: hidden;
  }
  nav {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .header,
  .footer {
    flex: none;
    padding: 0.5rem;
  }
  .footer {
    border-top: 1px solid var(--tulpar-shell-sidenav-border, #e2e8f0);
    margin-top: auto;
  }

  /* Rail mode: pass context down to slotted nav-items */
  :host([data-rail]) ::slotted(tulpar-nav-item) {
    --tulpar-nav-item-rail: 1;
  }
`;
