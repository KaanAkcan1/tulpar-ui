import { css } from "lit";

export const sidenavStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    background: var(--tulpar-shell-sidenav-bg, #ffffff);
    color: var(--tulpar-shell-sidenav-fg, #334155);
    box-shadow: inset -1px 0 0 var(--tulpar-shell-sidenav-edge, rgba(11, 8, 4, 0.06));
    overflow: hidden;
  }
  :host([position="right"]) {
    box-shadow: inset 1px 0 0 var(--tulpar-shell-sidenav-edge, rgba(11, 8, 4, 0.06));
  }
  :host([density="compact"]) {
    --tulpar-shell-sidenav-item-height: var(--tulpar-shell-sidenav-item-height-compact, 2.25rem);
  }
  nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: clip;
    overscroll-behavior: contain;
    padding: 0.25rem 0.625rem 0.625rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
    position: relative;
    background:
      linear-gradient(var(--tulpar-shell-sidenav-bg, #fff) 30%, transparent) top / 100% 1.5rem
        no-repeat,
      linear-gradient(transparent, var(--tulpar-shell-sidenav-bg, #fff) 70%) bottom / 100% 1.5rem
        no-repeat,
      radial-gradient(
          farthest-side at 50% 0,
          var(--tulpar-shell-sidenav-scroll-shadow, rgba(11, 8, 4, 0.08)),
          transparent
        )
        top / 100% 0.5rem no-repeat,
      radial-gradient(
          farthest-side at 50% 100%,
          var(--tulpar-shell-sidenav-scroll-shadow, rgba(11, 8, 4, 0.08)),
          transparent
        )
        bottom / 100% 0.5rem no-repeat;
    background-attachment: local, local, scroll, scroll;
  }
  .search {
    flex: none;
    padding: 0 0.75rem 0.5rem;
  }
  .search:empty {
    display: none;
  }

  /* Rail mode: pass context down to slotted nav-items and nav-sections */
  :host([data-rail]) ::slotted(tulpar-nav-item),
  :host([data-rail]) ::slotted(tulpar-nav-section) {
    --tulpar-nav-item-rail: 1;
  }
`;
