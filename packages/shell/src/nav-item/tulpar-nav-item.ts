import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { navItemStyles } from "./tulpar-nav-item.styles";

export interface TulparNavItemData {
  label: string;
  href?: string;
  iconClass?: string;
  badge?: string;
  items?: TulparNavItemData[];
  disabled?: boolean;
  target?: string;
  active?: boolean;
}

export class TulparNavItem extends LitElement {
  static override styles = navItemStyles;

  @property({ type: String }) href?: string;
  @property({ type: String }) label = "";
  @property({ type: String, attribute: "icon-class" }) iconClass?: string;
  @property({ type: String }) badge?: string;
  @property({ type: String }) target?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /** Manuel override; verilmezse URL eşleşmesinden hesaplanır. */
  @property({ type: Boolean }) active?: boolean;

  @state() private _expanded = false;
  @state() private _hasChildren = false;
  @state() private _urlActive = false;

  private _onLocationChange = () => {
    this._urlActive = this.href != null && location.pathname === this.href;
  };

  override connectedCallback() {
    super.connectedCallback();
    this._onLocationChange();
    window.addEventListener("popstate", this._onLocationChange);
    window.addEventListener("tulpar-location-changed", this._onLocationChange);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this._onLocationChange);
    window.removeEventListener("tulpar-location-changed", this._onLocationChange);
  }

  private get _isActive(): boolean {
    return this.active ?? this._urlActive;
  }

  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasChildren = slot
      .assignedElements()
      .some((el) => el.tagName.toLowerCase() === "tulpar-nav-item");
  }

  private _onClick(e: MouseEvent) {
    if (!this.href) return;
    const ev = new CustomEvent("tulpar-navigate", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { href: this.href, item: this },
    });
    if (!this.dispatchEvent(ev)) e.preventDefault();
  }

  private _toggle() {
    this._expanded = !this._expanded;
  }

  private _renderInner() {
    return html`
      ${this.iconClass ? html`<i class=${this.iconClass} aria-hidden="true"></i>` : nothing}
      <slot name="icon"></slot>
      <span class="label">${this.label}</span>
      ${this.badge ? html`<span class="badge">${this.badge}</span>` : nothing}
    `;
  }

  override render() {
    const link = this.href
      ? html`<a
          href=${this.href}
          target=${this.target ?? nothing}
          aria-current=${this._isActive ? "page" : nothing}
          @click=${this._onClick}
          >${this._renderInner()}</a
        >`
      : html`<button
          type="button"
          aria-expanded=${this._hasChildren ? String(this._expanded) : nothing}
          @click=${this._hasChildren ? this._toggle : nothing}
        >
          ${this._renderInner()}
          ${this._hasChildren ? html`<span class="chevron" aria-hidden="true">›</span>` : nothing}
        </button>`;

    return html`
      ${link}
      <div class="children" role="group" ?hidden=${this._hasChildren && !this._expanded}>
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }
}

if (!customElements.get("tulpar-nav-item")) {
  customElements.define("tulpar-nav-item", TulparNavItem);
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-nav-item": TulparNavItem;
  }
}
