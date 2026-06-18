import { html, nothing, type TemplateResult } from "lit";

/**
 * Minimal host contract the selection message-row helper reads from.
 * Both SelectionControlBase and the (future) group bases satisfy this.
 */
export interface SelectionMessageHost {
  invalid: boolean;
  warn: boolean;
  helperText?: string;
  errorText?: string;
  warnText?: string;
  noMessageSpace: boolean;
  _msgId: string;
}

/**
 * Pure helper that renders the selection-family message row.
 *
 * Sanctioned ≤50-line copy of FormFieldBase's message-row logic
 * (see docs/architecture/internal-layering.md). Kept as a free function
 * rather than a mixin so Switch/Checkbox/Radio (and the group bases) can
 * share it without coupling their class hierarchies.
 *
 * Precedence: invalid+errorText (role=alert) > warn+warnText (role=status)
 * > helperText (no role).
 */
export function renderMessageRow(host: SelectionMessageHost): TemplateResult | typeof nothing {
  if (host.noMessageSpace) return nothing;

  let text: string | undefined;
  let role: "alert" | "status" | undefined;
  let kind: "error" | "warn" | "helper" | undefined;
  if (host.invalid && host.errorText) {
    text = host.errorText;
    role = "alert";
    kind = "error";
  } else if (host.warn && host.warnText) {
    text = host.warnText;
    role = "status";
    kind = "warn";
  } else if (host.helperText) {
    text = host.helperText;
    kind = "helper";
  }

  return html`<div class="selection-message-row">
    ${text
      ? html`<span
          id=${host._msgId}
          class="selection-message"
          data-kind=${kind}
          role=${role ?? nothing}
          >${text}</span
        >`
      : nothing}
  </div>`;
}
