import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
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

  static override get observedAttributes() {
    return [...super.observedAttributes, "data-rail"];
  }

  override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === "data-rail") this.requestUpdate();
  }

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

  /** Whether the rail flyout is currently visible. */
  @state() private _flyoutVisible = false;
  /** Computed fixed position for the rail flyout. */
  @state() private _flyoutTop = 0;
  @state() private _flyoutLeft: number | null = null;
  @state() private _flyoutRight: number | null = null;
  /** Caret Y offset relative to the flyout top, pinned to the trigger icon center. */
  @state() private _flyoutCaretY: number | null = null;
  /** Child model for the group flyout panel. */
  @state() private _childModel: { href?: string; label: string; active?: boolean }[] = [];

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
    this._detachFlyoutListeners();
  }

  // ── Rail flyout: fixed-position escape from overflow-x:clip ─────────────

  private _onFlyoutHide = () => {
    this._flyoutVisible = false;
    this._detachFlyoutListeners();
  };

  private _detachFlyoutListeners() {
    window.removeEventListener("scroll", this._onFlyoutHide, true);
    window.removeEventListener("resize", this._onFlyoutHide);
  }

  private _showRailFlyout() {
    const rect = this.getBoundingClientRect();
    // Walk up to the nearest sidenav to determine which side it is on.
    // The old approach (reading data-sidenav-position on the nav-item itself)
    // was dead code — that attribute is only set on <tulpar-shell>, not items.
    const rightSide =
      this.closest("tulpar-sidenav")?.getAttribute("position") === "right";
    const gap = 8; // px gap between item edge and flyout
    this._flyoutTop = rect.top;
    // Caret points at the trigger icon's vertical center, relative to the flyout's
    // fixed top. When the panel is shifted up to fit, the caret stays on the icon.
    const iconCenter = rect.top + rect.height / 2;
    this._flyoutCaretY = iconCenter - this._flyoutTop;
    if (rightSide) {
      // Flyout must appear to the LEFT of the item.
      // Use CSS `right` anchored to the right viewport edge so the flyout
      // extends leftward from the item's left edge.
      this._flyoutLeft = null;
      this._flyoutRight = window.innerWidth - rect.left + gap;
    } else {
      this._flyoutRight = null;
      this._flyoutLeft = rect.right + gap;
    }
    this._flyoutVisible = true;
    window.addEventListener("scroll", this._onFlyoutHide, { capture: true, passive: true });
    window.addEventListener("resize", this._onFlyoutHide, { passive: true });
  }

  private _onAnchorPointerEnter = () => {
    if (this.hasAttribute("data-rail")) this._showRailFlyout();
  };

  private _onAnchorPointerLeave = () => {
    if (this.hasAttribute("data-rail")) this._onFlyoutHide();
  };

  private _onAnchorFocusIn = () => {
    if (this.hasAttribute("data-rail")) this._showRailFlyout();
  };

  private _onAnchorFocusOut = () => {
    if (this.hasAttribute("data-rail")) this._onFlyoutHide();
  };

  private get _isActive(): boolean {
    return this.active ?? this._urlActive;
  }

  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const navItems: TulparNavItem[] = [];
    for (const el of slot.assignedElements()) {
      if (el.matches("tulpar-nav-item")) navItems.push(el as TulparNavItem);
      else el.querySelectorAll?.("tulpar-nav-item").forEach((n) => navItems.push(n as TulparNavItem));
    }
    this._hasChildren = navItems.length > 0;
    this._childModel = navItems.map((n) => ({
      href: n.href,
      label: n.label,
      active: n.active ?? false,
    }));
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
    const isRail = this.hasAttribute("data-rail");

    const link = this.href
      ? html`<a
          href=${this.href}
          target=${this.target ?? nothing}
          rel=${this.target === "_blank" ? "noopener noreferrer" : nothing}
          aria-current=${this._isActive ? "page" : nothing}
          tabindex=${this.disabled ? "-1" : nothing}
          @click=${this._onClick}
          @pointerenter=${this._onAnchorPointerEnter}
          @pointerleave=${this._onAnchorPointerLeave}
          @focusin=${this._onAnchorFocusIn}
          @focusout=${this._onAnchorFocusOut}
          >${this._renderInner()}</a
        >`
      : html`<button
          type="button"
          aria-expanded=${this._hasChildren ? String(this._expanded) : nothing}
          @click=${this._hasChildren ? this._toggle : nothing}
          @pointerenter=${this._onAnchorPointerEnter}
          @pointerleave=${this._onAnchorPointerLeave}
          @focusin=${this._onAnchorFocusIn}
          @focusout=${this._onAnchorFocusOut}
        >
          ${this._renderInner()}
          ${this._hasChildren ? html`<span class="chevron ${isRail ? "rail-cue" : ""}" aria-hidden="true">›</span>` : nothing}
        </button>`;

    return html`
      ${link}
      ${isRail
        ? this._hasChildren
          ? html`<div
              class="rail-flyout is-group ${this.closest("tulpar-sidenav")?.getAttribute("position") === "right" ? "is-right" : ""}"
              role="group"
              aria-label=${this.label}
              style=${styleMap({
                position: "fixed",
                top: `${this._flyoutTop}px`,
                ...(this._flyoutLeft !== null ? { left: `${this._flyoutLeft}px` } : {}),
                ...(this._flyoutRight !== null ? { right: `${this._flyoutRight}px` } : {}),
                ...(this._flyoutCaretY != null ? { "--flyout-caret-y": `${this._flyoutCaretY}px` } : {}),
                display: this._flyoutVisible ? "" : "none",
              })}
            >
              <span class="flyout-caret" aria-hidden="true"></span>
              <div class="flyout-header">${this.label}</div>
              ${this._childModel.map(
                (c) => html`<a
                  class="flyout-link"
                  href=${c.href ?? nothing}
                  aria-current=${c.active ? "page" : nothing}
                  >${c.label}</a
                >`,
              )}
            </div>`
          : html`<span
              class="rail-flyout"
              style=${styleMap({
                position: "fixed",
                top: `${this._flyoutTop}px`,
                ...(this._flyoutLeft !== null ? { left: `${this._flyoutLeft}px` } : {}),
                ...(this._flyoutRight !== null ? { right: `${this._flyoutRight}px` } : {}),
                display: this._flyoutVisible ? "" : "none",
              })}
              aria-hidden="true"
              >${this.label}</span
            >`
        : nothing}
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
