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

  /* Closed listbox is removed from layout. Opening is wired in a later task. */
  .select-listbox {
    display: none;
  }

  :host([open]) .select-listbox {
    display: block;
  }
`;
