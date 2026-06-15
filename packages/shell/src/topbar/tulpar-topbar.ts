import { LitElement, html, nothing, svg } from "lit";
import { property } from "lit/decorators.js";
import { topbarStyles } from "./tulpar-topbar.styles";

const MENU_ICON = svg`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
  <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

export class TulparTopbar extends LitElement {
  static override styles = topbarStyles;

  @property({ type: Boolean, attribute: "show-menu-button" }) showMenuButton = false;
  @property({ type: String, attribute: "menu-button-label" }) menuButtonLabel = "Toggle navigation";

  private _toggle() {
    this.dispatchEvent(new CustomEvent("tulpar-menu-toggle", { bubbles: true, composed: true }));
  }

  override render() {
    return html`
      ${this.showMenuButton
        ? html`<button class="menu" aria-label=${this.menuButtonLabel} @click=${this._toggle}>
            ${MENU_ICON}
          </button>`
        : nothing}
      <slot name="start"></slot>
      <div class="center"><slot></slot></div>
      <div class="end"><slot name="end"></slot></div>
    `;
  }
}

if (!customElements.get("tulpar-topbar")) {
  customElements.define("tulpar-topbar", TulparTopbar);
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-topbar": TulparTopbar;
  }
}
