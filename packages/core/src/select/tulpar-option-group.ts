import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import { optionGroupStyles } from "./tulpar-option-group.styles";

/**
 * `<tulpar-option-group>` — groups `<tulpar-option>` children under a header.
 *
 * ## Accessibility
 * - Sets `role="group"` on itself (via `connectedCallback`).
 * - Renders a `.group-header` div with a stable per-instance `id` and marks
 *   itself `aria-labelledby` → that id. The header is `aria-hidden="true"`
 *   because the group is already labelled via `aria-labelledby` — prevents
 *   double announcement by assistive technology.
 *
 * ## Content
 * - `label` prop OR `label` slot → header text. Slot wins when both are set.
 *   Uses a real named `<slot name="label">` with `this.label` as fallback
 *   content — the dual prop+slot pattern used across the design system.
 * - Default slot → projects `<tulpar-option>` children.
 */

let groupSeq = 0;

export class TulparOptionGroup extends LitElement {
  static override styles = optionGroupStyles;

  /** Convenience label (alias of the `label` slot). Slot wins when both set. */
  @property({ type: String }) label?: string;

  private _headerId = `tulpar-optgroup-${++groupSeq}`;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute("role")) {
      this.setAttribute("role", "group");
    }
    this.setAttribute("aria-labelledby", this._headerId);
  }

  override render() {
    return html`
      <div class="group-header" id=${this._headerId} part="header" aria-hidden="true">
        <slot name="label">${this.label}</slot>
      </div>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-option-group": TulparOptionGroup;
  }
}

if (!customElements.get("tulpar-option-group")) {
  customElements.define("tulpar-option-group", TulparOptionGroup);
}
