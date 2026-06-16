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
    min-height: var(--tulpar-shell-sidenav-item-height, 2.5rem);
    padding: 0 0.75rem;
    border: none;
    border-radius: var(--tulpar-shell-sidenav-item-radius, 0.5rem);
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
  a[aria-current="page"],
  button[aria-current="page"] {
    background: var(--tulpar-shell-sidenav-item-bg-active, #deffea);
    color: var(--tulpar-shell-sidenav-item-fg-active, #0b7e52);
    font-weight: 600;
    box-shadow:
      inset 2px 0 0 -1px var(--tulpar-shell-sidenav-item-indicator, #00c57a),
      inset 6px 0 8px -6px var(--tulpar-shell-sidenav-item-glow, rgba(0, 197, 122, 0.5));
  }
  a[aria-current="page"] .icon-slot,
  a[aria-current="page"] ::slotted([slot="icon"]),
  a[aria-current="page"] i {
    color: var(--tulpar-shell-sidenav-item-indicator, #00c57a);
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
  .count {
    margin-inline-start: auto;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    padding: 0.0625rem 0.5rem;
    border-radius: 999px;
    background: var(--tulpar-shell-sidenav-item-count-bg, #e9f1ef);
    color: var(--tulpar-shell-sidenav-item-count-fg, #636568);
  }
  .kbd-hint {
    margin-inline-start: auto;
    font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
    font-size: 0.6875rem;
    color: var(--tulpar-shell-sidenav-fg-muted, #74777a);
  }
  .dot {
    margin-inline-start: auto;
    width: 0.4375rem;
    height: 0.4375rem;
    border-radius: 50%;
    background: var(--tulpar-shell-sidenav-item-dot, #00c57a);
  }
  .external {
    margin-inline-start: 0.25rem;
    font-size: 0.75rem;
    color: var(--tulpar-shell-sidenav-fg-muted, #74777a);
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
