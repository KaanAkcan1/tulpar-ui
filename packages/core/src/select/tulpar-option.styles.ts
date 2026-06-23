import { css } from "lit";

/**
 * Baseline styles for <tulpar-option> — presentational list option.
 *
 * This is intentionally minimal (Task 2.1). Full three-signal polish
 * (rail, color-mix tint, weight) lands in Chunk 6.
 *
 * House idioms:
 * - Only semantic tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - Logical properties throughout (padding-inline, margin-inline-start, etc.)
 * - :host attributes drive all state; the parent Select sets aria-selected /
 *   data-active / data-selected on this element; we only style against them.
 */
export const optionStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-inline: 0.75rem;
    min-block-size: 2.25rem;
    cursor: pointer;
    border-radius: 7px;
    color: var(--tulpar-color-text-primary, #15110b);
    font-size: 0.875rem;
    line-height: 1.25;
    box-sizing: border-box;
    outline: none;
    user-select: none;
    -webkit-user-select: none;
  }

  /* ── Text column ─────────────────────────────────────────────────────── */
  .opt-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-inline-size: 0;
  }

  .opt-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .opt-desc {
    font-size: 0.8em;
    color: var(--tulpar-color-text-muted, #737373);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Leading icon ────────────────────────────────────────────────────── */
  .opt-icon {
    display: contents;
    flex-shrink: 0;
    inline-size: 1rem;
    block-size: 1rem;
    color: var(--tulpar-color-text-muted, #737373);
  }

  /* Hide icon zone when slot is empty */
  .opt-icon:not(:has(> *)):not(:has(slot[name="icon"] > *)) {
    display: none;
  }

  /* ── Trailing check ──────────────────────────────────────────────────── */
  .opt-check {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 1.25em;
    block-size: 1.25em;
    visibility: hidden;
    color: var(--tulpar-color-brand-default, #00c57a);
  }

  /* ── Hover / active state ────────────────────────────────────────────── */
  :host([data-active]) {
    background: var(--tulpar-color-bg-subtle, #f7f7f6);
  }

  /* ── Selected state ──────────────────────────────────────────────────── */
  :host([aria-selected="true"]) {
    background: var(--tulpar-color-brand-subtle, #e6fdf5);
    color: var(--tulpar-color-text-primary, #15110b);
  }

  :host([aria-selected="true"]) .opt-check {
    visibility: visible;
  }

  /* ── Disabled state ──────────────────────────────────────────────────── */
  :host([disabled]) {
    color: var(--tulpar-color-text-muted, #737373);
    cursor: not-allowed;
    pointer-events: none;
  }

  :host([disabled]) .opt-icon,
  :host([disabled]) .opt-desc {
    color: var(--tulpar-color-text-muted, #737373);
  }

  /* ── Forced colors (high-contrast mode) ─────────────────────────────── */
  @media (forced-colors: active) {
    :host([aria-selected="true"]) {
      forced-color-adjust: none;
      background: Highlight;
      color: HighlightText;
    }

    :host([disabled]) {
      color: GrayText;
    }
  }
`;
