import { css } from "lit";

export const shellStyles = css`
  :host {
    display: grid;
    height: 100dvh;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: var(--_sidenav-col, var(--tulpar-shell-sidenav-width, 17.5rem)) 1fr;
    grid-template-areas:
      "topbar topbar"
      "sidenav content"
      "footer footer";
    background: var(--tulpar-shell-content-bg, #f1f5f9);
  }
  .skip-link {
    position: absolute;
    z-index: calc(var(--tulpar-shell-z-aside, 300) + 1);
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background: var(--tulpar-shell-topbar-bg, #fff);
    color: var(--tulpar-shell-topbar-fg, #0f172a);
    transform: translateY(-200%);
  }
  .skip-link:focus-visible {
    transform: none;
  }
  .topbar {
    grid-area: topbar;
    z-index: var(--tulpar-shell-z-topbar, 100);
  }
  .sidenav {
    grid-area: sidenav;
    z-index: var(--tulpar-shell-z-sidenav, 200);
    min-height: 0;
    transition: transform 200ms ease-out;
  }
  main {
    grid-area: content;
    min-width: 0;
    overflow: auto;
    padding: var(--_content-padding, var(--tulpar-shell-content-padding-comfortable, 1.5rem));
  }
  :host([content-padding="none"]) main {
    --_content-padding: 0;
  }
  :host([content-padding="compact"]) main {
    --_content-padding: var(--tulpar-shell-content-padding-compact, 0.75rem);
  }
  :host([content-width="fixed"]) main > .content-box {
    max-width: var(--tulpar-shell-content-max-width, 80rem);
    margin-inline: auto;
  }
  .footer {
    grid-area: footer;
    background: var(--tulpar-shell-footer-bg, #fff);
    color: var(--tulpar-shell-footer-fg, #64748b);
    border-top: 1px solid var(--tulpar-shell-footer-border, #e2e8f0);
  }
  :host([footer-mode="fixed"]) .footer {
    position: sticky;
    bottom: 0;
  }

  /* --- right-positioned sidenav: swap grid columns so content is left, sidenav is right --- */
  :host([data-sidenav-position="right"]) {
    grid-template-columns: 1fr var(--_sidenav-col, var(--tulpar-shell-sidenav-width, 17.5rem));
    grid-template-areas:
      "topbar topbar"
      "content sidenav"
      "footer footer";
  }

  /* --- collapsed (static) --- */
  :host([sidenav-mode="static"][data-collapsed]) {
    --_sidenav-col: 0px;
  }
  :host([sidenav-mode="static"][data-collapsed]) .sidenav {
    display: none;
  }

  /* --- rail --- */
  :host([sidenav-mode="rail"][data-collapsed]) {
    --_sidenav-col: var(--tulpar-shell-sidenav-rail-width, 4.5rem);
  }

  /* --- overlay & mobile: sidenav fixed --- */
  :host([sidenav-mode="overlay"]),
  :host([data-mobile]) {
    grid-template-columns: 0 1fr;
  }
  :host([sidenav-mode="overlay"]) .sidenav,
  :host([data-mobile]) .sidenav {
    position: fixed;
    inset-block: 0;
    inset-inline-start: 0;
    width: var(--tulpar-shell-sidenav-width, 17.5rem);
    transform: translateX(-100%);
  }
  :host([sidenav-mode="overlay"][data-sidenav-open]) .sidenav,
  :host([data-mobile][data-sidenav-open]) .sidenav {
    transform: none;
  }

  .mask {
    position: fixed;
    inset: 0;
    z-index: var(--tulpar-shell-z-mask, 150);
    background: var(--tulpar-shell-mask-bg, rgb(2 6 23 / 0.5));
    border: none;
    padding: 0;
    cursor: pointer;
  }
  .aside {
    position: fixed;
    inset-block: 0;
    inset-inline-end: 0;
    width: var(--tulpar-shell-aside-width, 22rem);
    z-index: var(--tulpar-shell-z-aside, 300);
    background: var(--tulpar-shell-aside-bg, #fff);
    border-inline-start: 1px solid var(--tulpar-shell-aside-border, #e2e8f0);
    transform: translateX(100%);
    transition: transform 200ms ease-out;
    overflow: auto;
  }
  :host([aside-open]) .aside {
    transform: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .sidenav,
    .aside {
      transition: none;
    }
  }
`;
