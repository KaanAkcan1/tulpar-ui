import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sidenavStyles } from "./tulpar-sidenav.styles";
import type { TulparNavItemData } from "../nav-item/tulpar-nav-item";
import "../nav-item/tulpar-nav-item";

export class TulparSidenav extends LitElement {
  static override styles = sidenavStyles;

  /** JSON menü verisi — slot ile birlikte kullanılabilir. */
  @property({ attribute: false }) items?: TulparNavItemData[];

  @property({ type: String, attribute: "nav-label" }) navLabel = "Main navigation";

  private _renderItem(item: TulparNavItemData): unknown {
    return html`<tulpar-nav-item
      href=${item.href ?? nothing}
      label=${item.label}
      icon-class=${item.iconClass ?? nothing}
      badge=${item.badge ?? nothing}
      target=${item.target ?? nothing}
      ?disabled=${item.disabled ?? false}
      .active=${item.active}
      >${item.items?.map((c) => this._renderItem(c)) ?? nothing}</tulpar-nav-item
    >`;
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = [
      ...this.querySelectorAll<HTMLElement>("tulpar-nav-item:not([disabled])"),
      ...(this.shadowRoot?.querySelectorAll<HTMLElement>("tulpar-nav-item:not([disabled])") ?? []),
    ].filter((i) => i.offsetParent !== null); // görünmeyen (kapalı grup) item'ları atla
    const current = items.findIndex(
      (i) => i.contains(document.activeElement) || i === document.activeElement,
    );
    if (current === -1) return;
    e.preventDefault();
    const next =
      e.key === "ArrowDown"
        ? Math.min(current + 1, items.length - 1)
        : Math.max(current - 1, 0);
    items[next].focus();
  };

  override render() {
    return html`
      <div class="header"><slot name="header"></slot></div>
      <nav aria-label=${this.navLabel} @keydown=${this._onKeydown}>
        ${this.items?.map((i) => this._renderItem(i)) ?? nothing}
        <slot></slot>
      </nav>
      <div class="footer"><slot name="footer"></slot></div>
    `;
  }
}

if (!customElements.get("tulpar-sidenav")) {
  customElements.define("tulpar-sidenav", TulparSidenav);
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-sidenav": TulparSidenav;
  }
}
