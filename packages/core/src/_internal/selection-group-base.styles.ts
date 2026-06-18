import { css } from "lit";

/**
 * Shared styles for the selection GROUP family (CheckboxGroup / RadioGroup).
 *
 * Owns the fieldset-like anatomy: a bolder legend (the "question" reads
 * stronger than the child labels — FE design report), an optional description,
 * a flex `.items` container that stacks vertically by default and wraps
 * horizontally on `[orientation=horizontal]`, plus the shared selection
 * message row. Only semantic tokens with literal `var()` fallbacks; no
 * `:host-context`. Subclass sheets compose this after `selectionMessageRowStyles`.
 */
export const selectionGroupBaseStyles = css`
  :host {
    display: block;
    font-family: var(--tulpar-font-family-ui, system-ui);
  }

  .group {
    border: 0;
    margin: 0;
    padding: 0;
    min-inline-size: 0;
  }

  .legend {
    font-weight: 600;
    font-size: var(--tulpar-selection-group-legend-fs, 14px);
    line-height: 1.3;
    color: var(--tulpar-selection-label, #15110b);
    margin-block-end: 0.5rem;
  }

  :host([disabled]) .legend {
    color: var(--tulpar-selection-glyph-disabled, #74777a);
  }

  .description {
    display: block;
    font-size: var(--tulpar-selection-group-desc-fs, 12px);
    line-height: 1.3;
    color: var(--tulpar-selection-description, #4f5153);
    margin-block-end: 0.5rem;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: var(--tulpar-selection-group-gap, 0.5rem);
  }

  :host([orientation="horizontal"]) .items {
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: var(--tulpar-selection-group-gap-horizontal, 1.25rem);
  }

  /* When children are card variants and the group is horizontal, use a
     responsive equal-height grid instead of a wrapping flex row. */
  :host([orientation="horizontal"][data-has-cards]) .items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    flex-direction: unset;
    flex-wrap: unset;
    gap: var(--tulpar-selection-group-gap, 0.5rem);
  }
`;
