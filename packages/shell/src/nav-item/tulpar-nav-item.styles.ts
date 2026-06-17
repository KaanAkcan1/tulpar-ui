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
    /* label (flex:1) is the SOLE slack source — keeps the group label flush to the
       icon, pixel-identical to a leaf item. The chevron rides at row end via flex
       order, not a competing auto-margin. */
    margin-inline-start: 0;
    flex: none;
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
  @media (prefers-reduced-motion: no-preference) {
    a[aria-current="page"]::after {
      content: "";
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: 6px;
      background: linear-gradient(
        to top,
        var(--tulpar-shell-sidenav-item-indicator, #00c57a),
        transparent
      );
      opacity: 0;
      animation: tulpar-nav-ignite 260ms var(--tulpar-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)) 1;
      pointer-events: none;
    }
    @keyframes tulpar-nav-ignite {
      from { transform: translateY(100%); opacity: 0.8; }
      to { transform: translateY(0); opacity: 0; }
    }
  }

  /* Rail mode: hide the inline label/badge/chevron — they show via the JS-positioned .rail-flyout */
  :host([data-rail]) .label,
  :host([data-rail]) .badge,
  :host([data-rail]) .chevron,
  :host([data-rail]) .count,
  :host([data-rail]) .kbd-hint,
  :host([data-rail]) .dot,
  :host([data-rail]) .external {
    display: none;
  }

  /* Rail: inline children never render in the strip — they appear in the flyout.
     Expanded state is preserved (not toggled), so leaving rail restores it. */
  :host([data-rail]) .children {
    display: none;
  }

  /* Group flyout panel (overrides base .rail-flyout tooltip defaults) */
  :host([data-rail]) .rail-flyout.is-group {
    padding: 6px;
    min-width: 200px;
    max-width: 280px;
    white-space: normal;
    pointer-events: auto;
    overflow: visible;
    border-radius: 0.5rem;
    background: var(--tulpar-shell-sidenav-flyout-bg, #ffffff);
    border: 1px solid var(--tulpar-shell-sidenav-flyout-border, #d9e0df);
    box-shadow: var(--tulpar-shadow-flyout, 0 4px 6px -2px rgba(10, 37, 64, 0.1), 0 12px 28px -6px rgba(10, 37, 64, 0.14));
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  :host([data-rail]) .rail-flyout.is-group .flyout-header {
    display: flex;
    align-items: center;
    min-height: 1.75rem;
    padding: 0 0.5rem 0.375rem;
    margin-bottom: 2px;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: var(--tulpar-shell-sidenav-flyout-header-fg, #636568);
    border-bottom: 1px solid var(--tulpar-shell-sidenav-flyout-divider, #d9e0df);
  }
  :host([data-rail]) .rail-flyout.is-group .flyout-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2rem;
    padding: 0 0.5rem;
    border-radius: 0.375rem;
    color: var(--tulpar-shell-sidenav-fg, #27231d);
    font-size: 0.875rem;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background-color 120ms var(--tulpar-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }
  :host([data-rail]) .rail-flyout.is-group .flyout-link:hover {
    background: var(--tulpar-shell-sidenav-item-bg-hover, #e9f1ef);
  }
  :host([data-rail]) .rail-flyout.is-group .flyout-link[aria-current="page"] {
    background: var(--tulpar-shell-sidenav-item-bg-active, #deffea);
    color: var(--tulpar-shell-sidenav-item-fg-active, #0b7e52);
    font-weight: 600;
  }
  :host([data-rail]) .rail-flyout.is-group .flyout-link:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, #514ecf);
    outline-offset: -2px;
  }

  /* Caret notch (rotated square; fill + 1px border) */
  :host([data-rail]) .rail-flyout.is-group .flyout-caret {
    position: absolute;
    top: var(--flyout-caret-y, 20px);
    width: 8px;
    height: 8px;
    transform: translateY(-50%) rotate(45deg);
    background: var(--tulpar-shell-sidenav-flyout-bg, #ffffff);
    left: -5px;
    border-left: 1px solid var(--tulpar-shell-sidenav-flyout-border, #d9e0df);
    border-top: 1px solid var(--tulpar-shell-sidenav-flyout-border, #d9e0df);
  }
  :host([data-rail]) .rail-flyout.is-group.is-right .flyout-caret {
    left: auto;
    right: -5px;
    border-left: none;
    border-top: none;
    border-right: 1px solid var(--tulpar-shell-sidenav-flyout-border, #d9e0df);
    border-bottom: 1px solid var(--tulpar-shell-sidenav-flyout-border, #d9e0df);
  }

  /* Chevron discoverability cue on group icons */
  :host([data-rail]) a,
  :host([data-rail]) button {
    justify-content: center;
  }
  :host([data-rail]) .chevron.rail-cue {
    display: block;
    position: absolute;
    right: calc(50% - 20px + 2px);
    bottom: calc(50% - 20px + 2px);
    margin: 0;
    font-size: 0.6875rem;
    line-height: 1;
    color: var(--tulpar-shell-sidenav-rail-cue, #74777a);
    opacity: 0.5;
    transform: none;
    transition: opacity 120ms var(--tulpar-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
    pointer-events: none;
  }
  :host([data-rail]) a:hover .chevron.rail-cue,
  :host([data-rail]) button:hover .chevron.rail-cue {
    opacity: 1;
  }

  /* Rail flyout: fixed-position label tooltip that escapes overflow-x:clip (B3) */
  .rail-flyout {
    position: fixed;
    z-index: var(--tulpar-shell-z-aside, 300);
    background: var(--tulpar-shell-sidenav-bg, #f8fafc);
    border: 1px solid var(--tulpar-shell-sidenav-border, #e2e8f0);
    border-radius: 0.375rem;
    padding: 0.375rem 0.625rem;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 2px 8px var(--tulpar-shadow-sm, rgba(11, 8, 4, 0.08));
    font-size: 0.875rem;
    color: var(--tulpar-shell-sidenav-fg, #334155);
  }
`;
