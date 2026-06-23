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
 *   The label slot is read from the light DOM in render() — no slotchange
 *   handler is wired (avoids the Lit slotchange→requestUpdate loop).
 * - Default slot → projects `<tulpar-option>` children.
 *
 * ## Slot-wins-over-prop mechanism
 * render() reads `this.querySelector('[slot="label"]')` directly. When a
 * slotted label element exists its textContent is rendered inline in the
 * shadow header; otherwise `this.label` prop text is used. This is static
 * (group headers do not change at runtime), so a slotchange-based reactive
 * approach is unnecessary and avoided.
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
    // Slot wins: check light DOM for a child targeting the named "label" slot.
    const labelSlotEl = this.querySelector<Element>('[slot="label"]');
    const headerText = labelSlotEl?.textContent ?? this.label ?? "";

    return html`
      <div class="group-header" id=${this._headerId} part="header" aria-hidden="true">
        ${headerText}
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
