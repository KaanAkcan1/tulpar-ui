import { css } from "lit";

/**
 * Baseline styles for <tulpar-option-group> — grouped header + slot.
 *
 * Intentionally minimal (Task 2.2). Sticky-header polish lands in Chunk 6.
 *
 * House idioms:
 * - Only semantic tokens via var() with literal fallbacks; NO
 *   --tulpar-primitive-* refs (ESLint no-restricted-syntax on *.styles.ts).
 * - Logical properties throughout (padding-inline, padding-block, etc.)
 */
export const optionGroupStyles = css`
  :host {
    display: block;
  }

  .group-header {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--tulpar-color-text-muted, #737373);
    padding-block: 0.5rem 0.25rem;
    padding-inline: 0.75rem;
  }
`;
