import { css } from "lit";

export const textareaStyles = css`
  .control-row {
    align-items: stretch;
    min-height: unset;
  }

  .field-textarea {
    width: 100%;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: inherit;
    font: inherit;
    resize: vertical;
    padding: 0;
  }

  .field-textarea::placeholder {
    color: var(--tulpar-input-text-placeholder, #a8a29e);
  }

  :host([resize='none']) .field-textarea {
    resize: none;
  }

  :host([resize='both']) .field-textarea {
    resize: both;
  }

  :host([resize='horizontal']) .field-textarea {
    resize: horizontal;
  }

  :host([resize='vertical']) .field-textarea {
    resize: vertical;
  }
`;
