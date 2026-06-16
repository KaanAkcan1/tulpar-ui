import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import { navItemStyles } from "./tulpar-nav-item.styles";

export interface TulparNavItemData {
  label: string;
  href?: string;
  /** Raw SVG string rendered via unsafeSVG. Author-controlled markup, not user input. */
  icon?: string;
  iconClass?: string;
  badge?: string;
  items?: TulparNavItemData[];
  disabled?: boolean;
  target?: string;
  active?: boolean;
  type?: "item" | "section";
  count?: string;
  dot?: boolean;
  dotLabel?: string;
  kbd?: string;
}

export class TulparNavItem extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static override styles = navItemStyles;

  @property({ type: String }) href?: string;
  @property({ type: String }) label = "";
  /** Raw SVG string rendered via unsafeSVG. `icon` is author-controlled markup, not user input. */
  @property({ type: String }) icon?: string;
  @property({ type: String, attribute: "icon-class" }) iconClass?: string;
  @property({ type: String }) badge?: string;
  @property({ type: String }) target?: string;
  @property({ type: Boolean, reflect: true }) disabled = false;
  /**
   * Manual active override. MUST stay `undefined` when unset (no `= false`
   * initializer) so `active ?? _urlActive` can fall back to URL auto-match.
   * Defaulting to false would permanently disable auto-activation.
   */
  @property({ type: Boolean }) active?: boolean;
  @property({ type: String }) count?: string;
  @property({ type: Boolean }) dot = false;
  @property({ type: String, attribute: "dot-label" }) dotLabel?: string;
  @property({ type: String }) kbd?: string;

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
    if (this.disabled) return;
    if (!this.href) return;
    const ev = new CustomEvent("tulpar-navigate", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { href: this.href, item: this },
    });
    if (!this.dispatchEvent(ev)) e.preventDefault();
  }

  expand() {
    if (!this._hasChildren || this._expanded) return;
    this._expanded = true;
    this.dispatchEvent(
      new CustomEvent("tulpar-nav-item-expand", { bubbles: true, composed: true, detail: { item: this } }),
    );
  }

  collapse() {
    this._expanded = false;
  }

  private _toggle() {
    this._expanded ? this.collapse() : this.expand();
  }

  private _renderInner() {
    return html`
      ${this.icon ? html`<span class="icon-slot" aria-hidden="true">${unsafeSVG(this.icon)}</span>` : nothing}
      ${this.iconClass ? html`<i class=${this.iconClass} aria-hidden="true"></i>` : nothing}
      <slot name="icon"></slot>
      <span class="label">${this.label}</span>
      <slot name="trailing"></slot>
      ${this.count ? html`<span class="count">${this.count}</span>` : nothing}
      ${this.kbd ? html`<span class="kbd-hint">${this.kbd}</span>` : nothing}
      ${this.badge ? html`<span class="badge">${this.badge}</span>` : nothing}
      ${this.dot ? html`<span class="dot" role="img" aria-label=${this.dotLabel ?? "status"}></span>` : nothing}
      ${this.href && this.target === "_blank"
        ? html`<span class="external" aria-hidden="true">↗</span>`
        : nothing}
    `;
  }

  override render() {
    const link = this.href
      ? html`<a
          href=${this.href}
          target=${this.target ?? nothing}
          rel=${this.target === "_blank" ? "noopener noreferrer" : nothing}
          aria-current=${this._isActive ? "page" : nothing}
          tabindex=${this.disabled ? "-1" : nothing}
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
