import { css } from "lit";

export const searchStyles = css`
  .search-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    height: 2.25rem;
    padding: 0 0.625rem;
    border-radius: 0.5rem;
    background: var(--tulpar-shell-sidenav-item-bg-hover, #f1f5f9);
    border: 1px solid transparent;
    color: var(--tulpar-shell-sidenav-fg, #334155);
    transition:
      background-color 150ms var(--tulpar-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)),
      border-color 150ms var(--tulpar-easing-decelerate, cubic-bezier(0, 0, 0.2, 1)),
      box-shadow 150ms var(--tulpar-easing-decelerate, cubic-bezier(0, 0, 0.2, 1));
  }
  .search-field:focus-within {
    background: var(--tulpar-shell-sidenav-bg, #ffffff);
    border-color: var(--tulpar-shell-sidenav-item-indicator, #00c57a);
    box-shadow: 0 0 0 3px var(--tulpar-shell-sidenav-item-glow, rgba(0, 197, 122, 0.25));
  }
  .search-icon {
    display: inline-flex;
    flex: none;
    color: var(--tulpar-shell-sidenav-fg-muted, #74777a);
  }
  .search-field:focus-within .search-icon {
    color: var(--tulpar-shell-sidenav-item-indicator, #00c57a);
  }
  .search-input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 0.875rem;
    padding: 0;
  }
  .search-input::placeholder {
    color: var(--tulpar-shell-sidenav-fg-muted, #74777a);
  }
  /* Hide the native clear/decoration so the field reads cleanly across engines. */
  .search-input::-webkit-search-cancel-button,
  .search-input::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }

  .no-results {
    padding: 0.75rem 0.875rem;
    font-size: 0.8125rem;
    color: var(--tulpar-shell-sidenav-fg-muted, #74777a);
  }

  @media (prefers-reduced-motion: reduce) {
    .search-field {
      transition: none;
    }
  }
`;
