import { css } from "lit";

export const topbarStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-sizing: border-box;
    height: var(--tulpar-shell-topbar-height, 4rem);
    padding: 0 1rem;
    background: var(--tulpar-shell-topbar-bg, #ffffff);
    color: var(--tulpar-shell-topbar-fg, #0f172a);
    border-bottom: 1px solid var(--tulpar-shell-topbar-border, #e2e8f0);
  }
  .center {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  button.menu {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  button.menu:hover {
    background: var(--tulpar-shell-sidenav-item-bg-hover, #f1f5f9);
  }
  button.menu:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, #514ecf);
    outline-offset: 2px;
  }
`;
