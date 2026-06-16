import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { navSectionStyles } from "./tulpar-nav-section.styles";

let _uid = 0;

export class TulparNavSection extends LitElement {
  static override styles = navSectionStyles;

  @property({ type: String }) label?: string;

  private readonly _labelId = `tulpar-nav-section-${++_uid}`;

  override render() {
    return html`
      ${this.label
        ? html`<div class="section-label" id=${this._labelId}>${this.label}</div>`
        : nothing}
      <div
        role="group"
        aria-labelledby=${this.label ? this._labelId : nothing}
        class="section-items"
      >
        <slot></slot>
      </div>
    `;
  }
}

if (!customElements.get("tulpar-nav-section")) {
  customElements.define("tulpar-nav-section", TulparNavSection);
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-nav-section": TulparNavSection;
  }
}
