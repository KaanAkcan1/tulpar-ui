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

/**
 * Resolve a nav item's icon to an HTML string for the rail flyout.
 * Priority: the string `icon` prop (core/data-driven) → the rendered `<svg>`
 * inside a slotted `[slot="icon"]` (Angular/Vue component icons) → the slot's
 * inner HTML as a fallback. Returns undefined when the item has no icon.
 * The result is injected imperatively (not via a lit directive) so the flyout
 * never depends on a single lit-html instance in the consumer bundle.
 */
function iconHTMLOf(n: TulparNavItem): string | undefined {
  if (n.icon) return n.icon;
  const slotted = n.querySelector<HTMLElement>(':scope > [slot="icon"]');
  if (!slotted) return undefined;
  const svg = slotted.querySelector("svg");
  return (svg?.outerHTML ?? slotted.innerHTML) || undefined;
}

export class TulparNavItem extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static override styles = navItemStyles;

  private static _uid = 0;
  private readonly _flyoutId = `tulpar-rail-flyout-${++TulparNavItem._uid}`;

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
  @state() private _childModel: {
    href?: string;
    label: string;
    active: boolean;
    iconHTML?: string;
  }[] = [];

  /** True when the current route matches one of this group's children (active-trail). */
  @state() private _hasActiveChild = false;

  private _onLocationChange = () => {
    this._urlActive = this.href != null && location.pathname === this.href;
    // Keep the active-trail in sync as the route changes (a group with no href is
    // never active itself, but its rail icon must light up when a child is current).
    if (this._hasChildren) {
      this._childModel = this._collectChildModel();
      this._hasActiveChild = this._childModel.some((c) => c.active);
    }
  };

  /** Guard: prevents focusin from re-opening the flyout when focus returns after keyboard close. */
  private _suppressNextFocusOpen = false;

  private _onRailKeydown = (e: KeyboardEvent) => {
    if (!this.hasAttribute("data-rail") || !this._hasChildren) return;
    const rightSide = this.closest("tulpar-sidenav")?.getAttribute("position") === "right";
    const openKey = rightSide ? "ArrowLeft" : "ArrowRight";
    const closeKey = rightSide ? "ArrowRight" : "ArrowLeft";
    if ((e.key === openKey || e.key === "Enter" || e.key === " ") && !this._flyoutVisible) {
      e.preventDefault();
      // Stop the sidenav's arrow-key handler from also running expand()/collapse():
      // in rail mode the flyout is the disclosure, and inline _expanded must NOT be
      // mutated (B2: rail suppresses-but-preserves inline expansion).
      e.stopPropagation();
      this._pinned = true;
      this._showRailFlyout();
      this.updateComplete.then(() => {
        this.shadowRoot?.querySelector<HTMLElement>(".flyout-link")?.focus();
      });
    } else if (e.key === "Escape" || (e.key === closeKey && this._flyoutVisible)) {
      e.preventDefault();
      e.stopPropagation();
      this._onFlyoutHide();
      this._suppressNextFocusOpen = true;
      this.shadowRoot?.querySelector<HTMLElement>("button, a")?.focus();
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    this._onLocationChange();
    window.addEventListener("popstate", this._onLocationChange);
    window.addEventListener("tulpar-location-changed", this._onLocationChange);
    this.addEventListener("keydown", this._onRailKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("popstate", this._onLocationChange);
    window.removeEventListener("tulpar-location-changed", this._onLocationChange);
    this._detachFlyoutListeners();
    this._clearTimers();
    this.removeEventListener("keydown", this._onRailKeydown);
  }

  // ── Rail flyout: fixed-position escape from overflow-x:clip ─────────────

  private _onFlyoutHide = () => {
    this._flyoutVisible = false;
    this._pinned = false;
    this._clearTimers();
    this._detachFlyoutListeners();
  };

  private _detachFlyoutListeners() {
    window.removeEventListener("scroll", this._onFlyoutHide, true);
    window.removeEventListener("resize", this._onFlyoutHide);
  }

  /**
   * Collects the child model for the group flyout from slotted nav-items,
   * resolving each child's active state the same way the child resolves its
   * own `aria-current` (explicit `active` attr, else URL auto-match). Called
   * both on slotchange (initial/`_hasChildren`) and at flyout-open time so the
   * panel reflects the live route, not a stale snapshot.
   */
  private _collectChildModel(): {
    href?: string;
    label: string;
    active: boolean;
    iconHTML?: string;
  }[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>(".children slot");
    const navItems: TulparNavItem[] = [];
    for (const el of slot?.assignedElements() ?? []) {
      if (el.matches("tulpar-nav-item")) navItems.push(el as TulparNavItem);
      else
        el.querySelectorAll?.("tulpar-nav-item").forEach((n) => navItems.push(n as TulparNavItem));
    }
    return navItems.map((n) => ({
      href: n.href,
      label: n.label,
      active: n.active ?? (n.href != null && location.pathname === n.href),
      iconHTML: iconHTMLOf(n),
    }));
  }

  /** The group's own icon as HTML, for the flyout header. */
  private _groupIconHTML(): string | undefined {
    return iconHTMLOf(this);
  }

  private _showRailFlyout() {
    // Rebuild the child model so flyout links reflect the current route, not a
    // stale slotchange-time snapshot.
    this._childModel = this._collectChildModel();
    this._hasActiveChild = this._childModel.some((c) => c.active);
    const rect = this.getBoundingClientRect();
    // Walk up to the nearest sidenav to determine which side it is on.
    // The old approach (reading data-sidenav-position on the nav-item itself)
    // was dead code — that attribute is only set on <tulpar-shell>, not items.
    const rightSide = this.closest("tulpar-sidenav")?.getAttribute("position") === "right";
    const gap = 8; // px gap between item edge and flyout
    // Vertical clamp: top-align to trigger; shift up if panel would overflow viewport bottom.
    // Heuristic height estimate (header ~28px + rows ~32px each + padding ~16px),
    // rounded to 44/row+1; may over/under-reserve. A post-render scrollHeight
    // measure (rAF) would be exact — deferred as a future improvement.
    const estHeight = 44 * (this._childModel.length + 1) + 16;
    const maxTop = window.innerHeight - estHeight - 8;
    const clampedTop = Math.max(8, Math.min(rect.top, maxTop));
    this._flyoutTop = clampedTop;
    // Caret points at the trigger icon's vertical center, relative to the flyout's
    // fixed top. When the panel is shifted up to fit, the caret stays on the icon.
    const iconCenter = rect.top + rect.height / 2;
    this._flyoutCaretY = iconCenter - clampedTop;
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
    this.dispatchEvent(
      new CustomEvent("tulpar-rail-flyout-open", {
        bubbles: true,
        composed: true,
        detail: { item: this },
      }),
    );
    this._flyoutVisible = true;
    window.addEventListener("scroll", this._onFlyoutHide, { capture: true, passive: true });
    window.addEventListener("resize", this._onFlyoutHide, { passive: true });
  }

  private _openTimer?: number;
  private _closeTimer?: number;
  private _pinned = false;
  private static readonly OPEN_DELAY = 120;
  private static readonly CLOSE_DELAY = 240;

  // Test seam: attributes override the delays so timer tests stay deterministic.
  private get _openDelay() {
    const v = Number(this.getAttribute("data-open-delay"));
    return Number.isFinite(v) && v >= 0 ? v : TulparNavItem.OPEN_DELAY;
  }
  private get _closeDelay() {
    const v = Number(this.getAttribute("data-close-delay"));
    return Number.isFinite(v) && v > 0 ? v : TulparNavItem.CLOSE_DELAY;
  }

  private get _coarsePointer() {
    return window.matchMedia?.("(pointer: coarse)").matches ?? false;
  }

  private _clearTimers() {
    if (this._openTimer) {
      clearTimeout(this._openTimer);
      this._openTimer = undefined;
    }
    if (this._closeTimer) {
      clearTimeout(this._closeTimer);
      this._closeTimer = undefined;
    }
  }

  private _onAnchorPointerEnter = () => {
    if (!this.hasAttribute("data-rail") || this._coarsePointer) return;
    this._clearTimers();
    this._openTimer = window.setTimeout(() => this._showRailFlyout(), this._openDelay);
  };

  private _onAnchorPointerLeave = () => {
    if (!this.hasAttribute("data-rail") || this._pinned) return;
    this._clearTimers();
    this._closeTimer = window.setTimeout(() => this._onFlyoutHide(), this._closeDelay);
  };

  private _onAnchorFocusIn = () => {
    if (!this.hasAttribute("data-rail")) return;
    if (this._suppressNextFocusOpen) {
      this._suppressNextFocusOpen = false;
      return;
    }
    this._showRailFlyout(); // focus = instant
  };

  private _onAnchorFocusOut = () => {
    if (this.hasAttribute("data-rail") && !this._pinned) this._onFlyoutHide();
  };

  // Keep the flyout open while the pointer is over it (or the gap bridge): cancel
  // the pending close so travelling from the icon into the panel never dismisses
  // it (WCAG 1.4.13 "hoverable"). The `::before` bridge extends this region across
  // the 8px gap so there is no dead zone.
  private _onFlyoutPointerEnter = () => {
    this._clearTimers();
  };

  private _onFlyoutPointerLeave = () => {
    if (this._pinned) return;
    this._clearTimers();
    this._closeTimer = window.setTimeout(() => this._onFlyoutHide(), this._closeDelay);
  };

  // Flyout child links navigate like the inline links: dispatch the cancelable
  // `tulpar-navigate` so an app router can intercept (preventDefault + SPA nav).
  // Without this, the plain <a href> does a native navigation (full reload), which
  // — in rail, where the flyout is the only way to navigate — resets app state.
  private _onFlyoutLinkClick = (e: MouseEvent) => {
    const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
    if (href == null) return;
    const ev = new CustomEvent("tulpar-navigate", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { href, item: this },
    });
    if (!this.dispatchEvent(ev)) e.preventDefault();
    this._onFlyoutHide();
  };

  private _onAnchorClick = () => {
    if (!this.hasAttribute("data-rail") || !this._hasChildren) return;
    // pin/unpin; on touch this is the only way to open
    this._pinned = !this._pinned;
    if (this._pinned) this._showRailFlyout();
    else {
      // Mirror the Escape handler: swallow the next focusin so the still-focused
      // trigger doesn't immediately reopen the flyout. Consumed single-shot in
      // _onAnchorFocusIn.
      this._onFlyoutHide();
      this._suppressNextFocusOpen = true;
    }
  };

  private get _isActive(): boolean {
    return this.active ?? this._urlActive;
  }

  private _onSlotChange() {
    this._childModel = this._collectChildModel();
    this._hasChildren = this._childModel.length > 0;
    this._hasActiveChild = this._childModel.some((c) => c.active);
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

  closeRailFlyout() {
    if (this._flyoutVisible || this._pinned) this._onFlyoutHide();
  }

  /** Current inline expanded state (read-only; used by the sidenav search filter). */
  get expanded(): boolean {
    return this._expanded;
  }

  expand() {
    // B2: in rail mode the flyout is the disclosure; inline expansion is
    // suppressed-but-preserved, so external expand() calls (e.g. the sidenav's
    // ArrowRight handler) must NOT mutate _expanded. Guarding here makes the
    // invariant robust regardless of event-propagation paths.
    if (this.hasAttribute("data-rail")) return;
    if (!this._hasChildren || this._expanded) return;
    this._expanded = true;
    this.dispatchEvent(
      new CustomEvent("tulpar-nav-item-expand", {
        bubbles: true,
        composed: true,
        detail: { item: this },
      }),
    );
  }

  collapse() {
    if (this.hasAttribute("data-rail")) return; // B2: never mutate inline state in rail
    this._expanded = false;
  }

  private _toggle() {
    this._expanded ? this.collapse() : this.expand();
  }

  /**
   * Shared fixed-position style STRING for both the group flyout and the leaf
   * tooltip. Returns a plain CSS string (bound via `style=${...}`) rather than the
   * `styleMap` directive on purpose: a directive instance created by one copy of
   * lit-html throws `currentDirective._$initialize is not a function` if the
   * element is rendered by a second copy (which can happen in consumer bundlers
   * that don't dedupe lit). A plain string has no such cross-instance dependency.
   * @param extra optional trailing declarations (e.g. the caret custom property)
   */
  private _flyoutPositionStyles(extra = ""): string {
    const parts = [
      "position:fixed",
      `top:${this._flyoutTop}px`,
      this._flyoutLeft !== null ? `left:${this._flyoutLeft}px` : "",
      this._flyoutRight !== null ? `right:${this._flyoutRight}px` : "",
      this._flyoutVisible ? "" : "display:none",
      extra,
    ];
    return parts.filter(Boolean).join(";");
  }

  private _renderInner() {
    return html`
      ${this.icon
        ? html`<span class="icon-slot" aria-hidden="true">${unsafeSVG(this.icon)}</span>`
        : nothing}
      ${this.iconClass ? html`<i class=${this.iconClass} aria-hidden="true"></i>` : nothing}
      <slot name="icon"></slot>
      <span class="label">${this.label}</span>
      <slot name="trailing"></slot>
      ${this.count ? html`<span class="count">${this.count}</span>` : nothing}
      ${this.kbd ? html`<span class="kbd-hint">${this.kbd}</span>` : nothing}
      ${this.badge ? html`<span class="badge">${this.badge}</span>` : nothing}
      ${this.dot
        ? html`<span class="dot" role="img" aria-label=${this.dotLabel ?? "status"}></span>`
        : nothing}
      ${this.href && this.target === "_blank"
        ? html`<span class="external" aria-hidden="true">↗</span>`
        : nothing}
    `;
  }

  override updated() {
    // Inject the group + child icons into the flyout imperatively. We capture the
    // icon as an HTML string (string `icon` prop, or a slotted component's rendered
    // <svg>) and set innerHTML here rather than using a lit directive (unsafeSVG),
    // so the flyout never trips the cross-lit-instance directive crash. Re-injected
    // on each render (idempotent) since Lit owns the placeholder spans.
    if (!this._flyoutVisible || !this._hasChildren) return;
    const root = this.shadowRoot;
    if (!root) return;
    const header = root.querySelector<HTMLElement>(".flyout-header-icon");
    if (header) this._setIcon(header, this._groupIconHTML());
    const iconSpans = root.querySelectorAll<HTMLElement>(".flyout-link-icon");
    this._childModel.forEach((c, i) => this._setIcon(iconSpans[i], c.iconHTML));
  }

  private _setIcon(span: HTMLElement | undefined, htmlStr: string | undefined) {
    if (!span) return;
    const next = htmlStr ?? "";
    if (span.innerHTML !== next) span.innerHTML = next;
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
          class=${this._hasActiveChild ? "is-active-trail" : nothing}
          aria-expanded=${this._hasChildren
            ? String(isRail ? this._flyoutVisible : this._expanded)
            : nothing}
          aria-haspopup=${this._hasChildren ? "true" : nothing}
          aria-controls=${this._hasChildren ? this._flyoutId : nothing}
          @click=${this._hasChildren ? (isRail ? this._onAnchorClick : this._toggle) : nothing}
          @pointerenter=${this._onAnchorPointerEnter}
          @pointerleave=${this._onAnchorPointerLeave}
          @focusin=${this._onAnchorFocusIn}
          @focusout=${this._onAnchorFocusOut}
        >
          ${this._renderInner()}
          ${this._hasChildren
            ? html`<span class="chevron ${isRail ? "rail-cue" : ""}" aria-hidden="true">›</span>`
            : nothing}
        </button>`;

    return html`
      ${link}
      ${isRail
        ? this._hasChildren
          ? html`<div
              id=${this._flyoutId}
              class="rail-flyout is-group ${this.closest("tulpar-sidenav")?.getAttribute(
                "position",
              ) === "right"
                ? "is-right"
                : ""}"
              role="group"
              aria-label=${this.label}
              style=${this._flyoutPositionStyles(
                this._flyoutCaretY != null ? `--flyout-caret-y:${this._flyoutCaretY}px` : "",
              )}
              @pointerenter=${this._onFlyoutPointerEnter}
              @pointerleave=${this._onFlyoutPointerLeave}
            >
              <span class="flyout-caret" aria-hidden="true"></span>
              <div class="flyout-header">
                <span class="flyout-header-icon" aria-hidden="true"></span>
                <span class="flyout-header-label">${this.label}</span>
              </div>
              <div class="flyout-list">
                ${this._childModel.map(
                  (c) =>
                    html`<a
                      class="flyout-link"
                      href=${c.href ?? nothing}
                      aria-current=${c.active ? "page" : nothing}
                      @click=${this._onFlyoutLinkClick}
                    >
                      <span class="flyout-link-icon" aria-hidden="true"></span>
                      <span class="flyout-link-label">${c.label}</span>
                    </a>`,
                )}
              </div>
            </div>`
          : html`<span class="rail-flyout" style=${this._flyoutPositionStyles()} aria-hidden="true"
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
