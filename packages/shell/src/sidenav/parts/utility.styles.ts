import { css } from "lit";

export const utilityStyles = css`
  .utility {
    flex: none;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.5rem 0.625rem;
  }

  /* When both cells are present, switch to two equal columns */
  .utility:has(.util-cell + .util-cell),
  .utility:has(.util-theme):has(.util-config) {
    grid-template-columns: 1fr 1fr;
  }

  /* Utility cell buttons */
  .util-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    padding: 0.375rem 0.5rem;
    border: none;
    border-radius: var(--tulpar-radius-sm, 0.25rem);
    background: none;
    color: var(--tulpar-shell-sidenav-fg, #334155);
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1;
    transition: background 120ms ease;
    white-space: nowrap;
    overflow: hidden;
  }

  .util-btn:hover {
    background: var(--tulpar-shell-sidenav-item-hover-bg, rgba(11, 8, 4, 0.06));
  }

  .util-btn:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, #00c57a);
    outline-offset: 2px;
  }

  .util-btn svg {
    flex: none;
  }

  /* ── Theme-toggle icon swap driven by host[data-dark] ──────────────────────
   * Light mode (default): show moon ("go dark"), hide sun.
   * Dark mode (host reflects data-dark from MutationObserver): show sun ("go light").
   * Driven by data-dark on the host so icon and text share one signal and can
   * never desync — :host-context(.dark) was dropped to eliminate the race.
   * ────────────────────────────────────────────────────────────────────────── */
  .util-theme .icon-sun {
    display: none;
  }
  .util-theme .icon-moon {
    display: inline;
  }

  :host([data-dark]) .util-theme .icon-sun {
    display: inline;
  }
  :host([data-dark]) .util-theme .icon-moon {
    display: none;
  }

  /* ── Rail mode (B2) ─────────────────────────────────────────────────────── */

  /* In rail mode: only the theme icon is shown — hide text + config button */
  :host([data-rail]) .utility {
    grid-template-columns: 1fr;
    justify-items: center;
  }

  :host([data-rail]) .util-text {
    display: none;
  }

  :host([data-rail]) .util-config {
    display: none;
  }
`;
