import { html, nothing, type TemplateResult } from "lit";

/** Minimal host contract the message-row helper reads (both bases satisfy it). */
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
 * Sanctioned ≤50-line copy of FormFieldBase's message row (internal-layering.md).
 * Free function (not a mixin) so all selection elements share it without coupling.
 * Precedence: invalid+errorText (alert) > warn+warnText (status) > helperText.
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
