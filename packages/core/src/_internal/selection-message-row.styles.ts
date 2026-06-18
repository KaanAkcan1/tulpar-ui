import { css } from "lit";

/**
 * Message-row styles for the selection family. Sanctioned ≤50-line copy of
 * FormFieldBase's message-row CSS (see docs/architecture/internal-layering.md),
 * renamed onto `--tulpar-selection-message-*` vars with literal fallbacks so
 * the selection family can theme its messages independently of the input
 * family. Subclass style sheets compose this after the base sheet.
 */
export const selectionMessageRowStyles = css`
  .selection-message-row {
    min-height: var(--tulpar-selection-message-row-height, 1.25rem);
    margin-top: 0.25rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    line-height: 1.25rem;
  }

  .selection-message {
    color: var(--tulpar-selection-message-helper, #4f5153);
  }

  .selection-message[data-kind="error"] {
    color: var(--tulpar-selection-message-error, #b22128);
  }

  .selection-message[data-kind="warn"] {
    color: var(--tulpar-selection-message-warn, #b45309);
  }
`;
