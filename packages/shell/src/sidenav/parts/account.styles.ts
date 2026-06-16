import { css } from "lit";

export const accountStyles = css`
  /* ── Slot-override footer wrapper ───────────────────────────────────────── */
  .footer {
    flex: none;
    padding: 0.625rem 0.75rem 0.75rem;
    box-shadow: inset 0 1px 0 var(--tulpar-shell-sidenav-edge, rgba(11, 8, 4, 0.06));
  }

  /* ── Built-in account block ─────────────────────────────────────────────── */
  .account {
    flex: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0.625rem 0.75rem 0.75rem;
    box-shadow: inset 0 1px 0 var(--tulpar-shell-sidenav-edge, rgba(11, 8, 4, 0.06));
  }

  /* ── Avatar (initials fallback) ─────────────────────────────────────────── */
  .account-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 1.75rem; /* 28px */
    height: 1.75rem;
    border-radius: 0.375rem; /* squircle-ish */
    background: linear-gradient(
      135deg,
      var(--tulpar-color-brand-active, #0b7e52),
      var(--tulpar-color-brand-hover, #00a468)
    );
    color: var(--tulpar-color-text-inverse, #f0f7f5);
    font-size: 0.6875rem; /* 11px */
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.02em;
    user-select: none;
  }

  /* ── Avatar (profile image) ─────────────────────────────────────────────── */
  .account-avatar-img {
    display: block;
    flex: none;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.375rem;
    object-fit: cover;
  }

  /* ── Meta (name + role) ─────────────────────────────────────────────────── */
  .account-meta {
    display: flex;
    flex-direction: column;
    gap: 0.0625rem; /* 1px */
    min-width: 0;
    flex: 1;
  }

  .account-name {
    display: block;
    font-size: 0.8125rem; /* 13px */
    font-weight: 600;
    line-height: 1.25;
    color: var(--tulpar-shell-sidenav-fg, #334155);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .account-role {
    display: block;
    font-size: 0.6875rem; /* 11px */
    font-weight: 400;
    line-height: 1.25;
    color: var(--tulpar-shell-sidenav-fg-muted, #74777a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Action buttons (settings + logout) ─────────────────────────────────── */
  .account-actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.125rem;
    flex: none;
    margin-inline-start: auto;
  }

  .account-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: none;
    border-radius: var(--tulpar-radius-sm, 0.25rem);
    background: none;
    color: var(--tulpar-shell-sidenav-fg-muted, #74777a);
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
  }

  .account-icon-btn:hover {
    background: var(--tulpar-shell-sidenav-item-hover-bg, rgba(11, 8, 4, 0.06));
    color: var(--tulpar-shell-sidenav-fg, #334155);
  }

  .account-icon-btn:focus-visible {
    outline: 2px solid var(--tulpar-color-focus-ring, #00c57a);
    outline-offset: 2px;
  }

  /* ── Rail mode: avatar only, hide meta + actions ────────────────────────── */
  :host([data-rail]) .account {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 0.5rem 0.75rem;
  }

  :host([data-rail]) .account-meta {
    display: none;
  }

  :host([data-rail]) .account-actions {
    display: none;
  }
`;
