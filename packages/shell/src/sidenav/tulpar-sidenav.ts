import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { sidenavStyles } from "./tulpar-sidenav.styles";
import type { TulparNavItemData } from "../nav-item/tulpar-nav-item";
import "../nav-item/tulpar-nav-item";
import "../nav-section/tulpar-nav-section";

export class TulparSidenav extends LitElement {
  static override styles = sidenavStyles;

  /** JSON menü verisi — slot ile birlikte kullanılabilir. */
  @property({ attribute: false }) items?: TulparNavItemData[];

  @property({ type: String, attribute: "nav-label" }) navLabel = "Main navigation";

  @property({ type: String, reflect: true }) position: "left" | "right" = "left";
  @property({ type: String, reflect: true }) density: "comfortable" | "compact" = "comfortable";
  @property({ type: Boolean, attribute: "single-expand" }) singleExpand = false;

  private _renderItem(item: TulparNavItemData): unknown {
    if (item.type === "section") {
      return html`<tulpar-nav-section label=${item.label ?? nothing}>
        ${item.items?.map((c) => this._renderItem(c)) ?? nothing}
      </tulpar-nav-section>`;
    }
    return html`<tulpar-nav-item
      href=${item.href ?? nothing}
      label=${item.label}
      icon-class=${item.iconClass ?? nothing}
      badge=${item.badge ?? nothing}
      count=${item.count ?? nothing}
      ?dot=${item.dot ?? false}
      dot-label=${item.dotLabel ?? nothing}
      kbd=${item.kbd ?? nothing}
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
      e.key === "ArrowDown" ? Math.min(current + 1, items.length - 1) : Math.max(current - 1, 0);
    items[next].focus();
  };

  override render() {
    return html`
      <div class="header"><slot name="header"></slot><slot name="header-actions"></slot></div>
      <div class="search"><slot name="search"></slot></div>
      <nav aria-label=${this.navLabel} @keydown=${this._onKeydown}>
        ${this.items?.map((i) => this._renderItem(i)) ?? nothing}
        <slot></slot>
      </nav>
      <div class="utility">
        <div class="utility-start"><slot name="utility-start"></slot></div>
        <div class="utility-end"><slot name="utility-end"></slot></div>
      </div>
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
