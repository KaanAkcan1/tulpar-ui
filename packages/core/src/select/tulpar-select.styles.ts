import { css } from "lit";

/**
 * Closed-state baseline styles for `<tulpar-select>`.
 *
 * Only the trigger row + a hidden listbox shell are styled here. The full
 * open/positioned listbox + option visuals land in a later task — keep this
 * minimal so the closed-state tests pass and the trigger is legible.
 *
 * Semantic tokens only (with a light-mode fallback), logical properties.
 */
export const selectStyles = css`
  .control-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    inline-size: 100%;
  }

  .select-trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    inline-size: 100%;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: start;
    padding: 0;
  }

  .select-trigger:disabled {
    cursor: not-allowed;
  }

  .select-value {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .select-value[data-placeholder] {
    color: var(--tulpar-input-text-placeholder, #a8a29e);
  }

  .select-chevron {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--tulpar-input-icon-default, #74777a);
  }

  /* Leading icon mirrored from the selected option. Hidden until populated. */
  .select-leading-icon {
    display: none;
  }

  :host([data-has-leading-icon]) .select-leading-icon {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--tulpar-input-icon-default, #74777a);
  }

  /* Clear (✕) affordance — small icon button at the start of the trailing cluster. */
  .select-clear {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 0.125rem;
    margin-inline-start: 0.25rem;
    cursor: pointer;
    color: var(--tulpar-input-icon-default, #74777a);
    border-radius: 999px;
  }

  .select-clear:hover {
    background: var(--tulpar-input-bg-readonly, #f0f7f5);
  }

  /* ============================================================
   * Listbox surface. Closed = removed from layout. Open = a fixed-position,
   * top-layer scroll container anchored under the trigger by JS (inline
   * left/top). Functional only here — full surface polish (radius/shadow/option
   * visuals) lands in Task 6.1.
   * ============================================================ */
  .select-listbox {
    display: none;
    position: fixed;
    inset-block-start: 0;
    inset-inline-start: 0;
    z-index: var(--tulpar-overlay-z-index, 1000);
    box-sizing: border-box;
    margin: 0;
    max-block-size: var(--tulpar-overlay-size-popover-max-h, min(28rem, 60vh));
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--tulpar-overlay-surface-bg, #ffffff);
    color: var(--tulpar-color-text-primary, #15110b);
    border: 1px solid var(--tulpar-overlay-surface-border, #d9e0df);
    border-radius: 10px;
    box-shadow: var(
      --tulpar-overlay-shadow,
      0 18px 48px -16px rgba(2, 8, 23, 0.34),
      0 6px 16px -8px rgba(2, 8, 23, 0.18)
    );
  }

  /* Native-popover path: neutralize the UA popover box so our coordinates win. */
  .select-listbox[popover] {
    margin: 0;
    inset: auto;
  }

  /* Open is driven by [open] on the host AND, when promoted via the native
     Popover API, by :popover-open — either keeps the surface visible. */
  :host([open]) .select-listbox,
  .select-listbox:popover-open {
    display: block;
  }

  /* ============================================================
   * Listbox status rows — empty / loading / error
   * ============================================================ */
  .select-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    padding-block: 2rem;
    padding-inline: 0.75rem;
    color: var(--tulpar-color-text-muted, #737373);
    font-size: 0.875rem;
  }

  .select-status[data-kind="error"] {
    color: var(--tulpar-input-message-error, #b91c1c);
  }
`;
