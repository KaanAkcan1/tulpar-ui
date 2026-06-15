import { css } from "lit";

export const navItemStyles = css`
  :host {
    display: block;
  }
  a,
  button {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    box-sizing: border-box;
    min-height: var(--tulpar-shell-sidenav-item-height, 2.75rem);
    padding: 0 0.75rem;
    border: none;
    border-radius: var(--tulpar-shell-sidenav-item-radius, 0.375rem);
    background: transparent;
    color: var(--tulpar-shell-sidenav-fg, #334155);
    font: inherit;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    transition: var(--tulpar-transition-default, 150ms ease-out);
  }
  a:hover,
  button:hover {
    background: var(--tulpar-shell-sidenav-item-bg-hover, #f1f5f9);
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, #514ecf);
    outline-offset: -2px;
  }
  a[aria-current="page"] {
    background: var(--tulpar-shell-sidenav-item-bg-active, #eef2ff);
    color: var(--tulpar-shell-sidenav-item-fg-active, #514ecf);
  }
  /* left:0 assumes vertical sidenav; rail mode overrides this in the shell container task */
  a[aria-current="page"]::before {
    content: "";
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 3px;
    border-radius: 2px;
    background: var(--tulpar-shell-sidenav-item-indicator, #514ecf);
  }
  :host([disabled]) a,
  :host([disabled]) button {
    opacity: 0.45;
    pointer-events: none;
  }
  .badge {
    margin-inline-start: auto;
    min-width: 1.25rem;
    padding: 0.125rem 0.375rem;
    border-radius: 999px;
    font-size: 0.75rem;
    line-height: 1;
    text-align: center;
    background: var(--tulpar-shell-sidenav-item-badge-bg, #514ecf);
    color: var(--tulpar-shell-sidenav-item-badge-fg, #f8fafc);
  }
  .label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chevron {
    margin-inline-start: auto;
    transition: transform 150ms ease-out;
  }
  button[aria-expanded="true"] .chevron {
    transform: rotate(90deg);
  }
  .children {
    padding-inline-start: 1rem;
  }
  /* explicit: keep hidden working if .children later gets a display value */
  .children[hidden] {
    display: none;
  }
  @media (prefers-reduced-motion: reduce) {
    a,
    button,
    .chevron {
      transition: none;
    }
  }

  /* Rail flyout: show label/badge as hover tooltip when ancestor has [data-rail] */
  /* Note: :host-context works in Chromium (WTR target); Firefox fallback is v2 scope */
  :host-context([data-rail]) .label,
  :host-context([data-rail]) .badge,
  :host-context([data-rail]) .chevron {
    position: absolute;
    inset-inline-start: calc(100% + 0.25rem);
    background: var(--tulpar-shell-sidenav-bg, #f8fafc);
    border: 1px solid var(--tulpar-shell-sidenav-border, #e2e8f0);
    border-radius: 0.375rem;
    padding: 0.375rem 0.625rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    z-index: var(--tulpar-shell-z-sidenav, 200);
  }
  :host-context([data-rail]) a:hover .label,
  :host-context([data-rail]) a:focus-visible .label {
    opacity: 1;
  }
`;
