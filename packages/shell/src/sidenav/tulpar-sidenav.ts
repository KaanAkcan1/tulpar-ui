import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { sidenavStyles } from "./tulpar-sidenav.styles";
import { headerStyles } from "./parts/header.styles";
import { utilityStyles } from "./parts/utility.styles";
import { accountStyles } from "./parts/account.styles";
import { renderHeader } from "./parts/header";
import { renderUtility } from "./parts/utility";
import { renderAccount } from "./parts/account";
import type { TulparNavItemData } from "../nav-item/tulpar-nav-item";
import type { TulparNavItem } from "../nav-item/tulpar-nav-item";
import "../nav-item/tulpar-nav-item";
import "../nav-section/tulpar-nav-section";

export class TulparSidenav extends LitElement {
  static override styles = [sidenavStyles, headerStyles, utilityStyles, accountStyles];

  /**
   * Tell the browser (and Lit) to observe these non-declared attributes so that
   * attributeChangedCallback fires synchronously on mutation, guaranteeing that
   * `await el.updateComplete` after `toggleAttribute("data-collapsed")` catches
   * the re-render. The MutationObserver in connectedCallback is kept as an extra
   * safety net for external mutations that may bypass attributeChangedCallback.
   */
  static override get observedAttributes() {
    return [
      ...super.observedAttributes,
      "data-collapsed",
      "data-sidenav-open",
      "data-rail",
    ];
  }

  override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === "data-collapsed" || name === "data-sidenav-open" || name === "data-rail") {
      this.requestUpdate();
    }
  }

  /** JSON menü verisi — slot ile birlikte kullanılabilir. */
  @property({ attribute: false }) items?: TulparNavItemData[];

  @property({ type: String, attribute: "nav-label" }) navLabel = "Main navigation";

  @property({ type: String, reflect: true }) position: "left" | "right" = "left";
  @property({ type: String, reflect: true }) density: "comfortable" | "compact" = "comfortable";
  @property({ type: Boolean, attribute: "single-expand" }) singleExpand = false;

  /** Accessible label for the built-in toggle button. */
  @property({ attribute: "toggle-label" }) toggleLabel = "Toggle navigation";

  /** Show the built-in theme-toggle cell in the utility row. */
  @property({ type: Boolean, attribute: "show-mode-selection" }) showModeSelection = true;
  /** Show the built-in config cell in the utility row. */
  @property({ type: Boolean, attribute: "show-config" }) showConfig = false;
  /** Label text rendered inside the config button. */
  @property({ attribute: "config-text" }) configText = "Configure";
  /** aria-label for the theme-toggle button. */
  @property({ attribute: "theme-label" }) themeLabel = "Toggle color theme";
  /** aria-label for the config button. */
  @property({ attribute: "config-label" }) configLabel = "Open configurator";

  // ── Account block props (Chunk 5) ────────────────────────────────────────
  /** Show the built-in account block at the bottom. Defaults to true. */
  @property({ type: Boolean, attribute: "show-account-block" }) showAccountBlock = true;
  /** Display name of the signed-in user. */
  @property({ attribute: "user-name" }) userName?: string;
  /** Role/title line below the user name. */
  @property({ attribute: "user-role" }) userRole?: string;
  /** URL of the user's profile image. When provided, shows an <img> instead of initials. */
  @property({ attribute: "profile-image" }) profileImage?: string;
  /** Show the settings icon button. Defaults to false (opt-in). */
  @property({ type: Boolean, attribute: "show-settings" }) showSettings = false;
  /** Show the logout icon button. Defaults to true. */
  @property({ type: Boolean, attribute: "show-logout" }) showLogout = true;
  /** aria-label for the settings button. */
  @property({ attribute: "settings-label" }) settingsLabel = "Settings";
  /** aria-label for the logout button. */
  @property({ attribute: "logout-label" }) logoutLabel = "Log out";

  /** True when the consumer has placed a [slot=header] child into light DOM. */
  @state() hasHeaderSlot = false;

  /** True when a [slot=utility-start] child is present in light DOM. */
  @state() _hasUtilityStart = false;
  /** True when a [slot=utility-end] child is present in light DOM. */
  @state() _hasUtilityEnd = false;

  /** True when a [slot=footer] child is present in light DOM. */
  @state() _hasFooterSlot = false;

  private _attrObserver: MutationObserver | null = null;

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

  private _focusableItems(): HTMLElement[] {
    return [
      ...this.querySelectorAll<HTMLElement>("tulpar-nav-item:not([disabled])"),
      ...(this.shadowRoot?.querySelectorAll<HTMLElement>("tulpar-nav-item:not([disabled])") ?? []),
    ].filter((i) => i.offsetParent !== null); // görünmeyen (kapalı grup) item'ları atla
  }

  private _focusedItem(): TulparNavItem | null {
    const items = this._focusableItems();
    return (items.find(
      (i) => i.contains(document.activeElement) || i === document.activeElement,
    ) as TulparNavItem) ?? null;
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const items = this._focusableItems();
      const current = items.findIndex(
        (i) => i.contains(document.activeElement) || i === document.activeElement,
      );
      if (current === -1) return;
      e.preventDefault();
      const next =
        e.key === "ArrowDown" ? Math.min(current + 1, items.length - 1) : Math.max(current - 1, 0);
      items[next].focus();
      return;
    }

    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      const list = this._focusableItems();
      (e.key === "Home" ? list[0] : list[list.length - 1])?.focus();
      return;
    }

    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const focused = this._focusedItem();
      if (!focused) return;
      e.preventDefault();
      (e.key === "ArrowRight" ? focused.expand?.() : focused.collapse?.());
      return;
    }
  };

  private _onItemExpand = (e: Event) => {
    if (!this.singleExpand) return;
    const opened = (e as CustomEvent).detail.item as TulparNavItem;
    this.querySelectorAll<TulparNavItem>("tulpar-nav-item").forEach((it) => {
      if (it !== opened && !it.contains(opened)) it.collapse?.();
    });
  };

  /**
   * Called whenever the header slot's assigned nodes change.
   * Public so renderHeader() can bind it from parts/header.ts.
   */
  _onHeaderSlotChange = (e?: Event) => {
    const slot = e?.target as HTMLSlotElement | undefined;
    if (slot) {
      this.hasHeaderSlot = slot.assignedElements().length > 0;
    } else {
      this.hasHeaderSlot = !!this.querySelector(':scope > [slot="header"]');
    }
  };

  /**
   * Called whenever the utility-start slot's assigned nodes change.
   * Public so renderUtility() can bind it from parts/utility.ts.
   */
  _onUtilityStartSlotChange = (e?: Event) => {
    const slot = e?.target as HTMLSlotElement | undefined;
    if (slot) {
      this._hasUtilityStart = slot.assignedElements().length > 0;
    } else {
      this._hasUtilityStart = !!this.querySelector(':scope > [slot="utility-start"]');
    }
  };

  /**
   * Called whenever the utility-end slot's assigned nodes change.
   * Public so renderUtility() can bind it from parts/utility.ts.
   */
  _onUtilityEndSlotChange = (e?: Event) => {
    const slot = e?.target as HTMLSlotElement | undefined;
    if (slot) {
      this._hasUtilityEnd = slot.assignedElements().length > 0;
    } else {
      this._hasUtilityEnd = !!this.querySelector(':scope > [slot="utility-end"]');
    }
  };

  /**
   * Called whenever the footer slot's assigned nodes change.
   * Public so renderAccount() can bind it from parts/account.ts.
   */
  _onFooterSlotChange = (e?: Event) => {
    const slot = e?.target as HTMLSlotElement | undefined;
    if (slot) {
      this._hasFooterSlot = slot.assignedElements().length > 0;
    } else {
      this._hasFooterSlot = !!this.querySelector(':scope > [slot="footer"]');
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener("tulpar-nav-item-expand", this._onItemExpand);
    // Detect initial state synchronously before first render
    this.hasHeaderSlot = !!this.querySelector(':scope > [slot="header"]');
    this._hasUtilityStart = !!this.querySelector(':scope > [slot="utility-start"]');
    this._hasUtilityEnd = !!this.querySelector(':scope > [slot="utility-end"]');
    this._hasFooterSlot = !!this.querySelector(':scope > [slot="footer"]');
    this._attrObserver = new MutationObserver(() => {
      this.requestUpdate();
    });
    this._attrObserver.observe(this, {
      attributes: true,
      attributeFilter: ["data-collapsed", "data-sidenav-open", "data-rail"],
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("tulpar-nav-item-expand", this._onItemExpand);
    this._attrObserver?.disconnect();
    this._attrObserver = null;
  }

  override render() {
    return html`
      ${renderHeader(this)}
      <div class="search"><slot name="search"></slot></div>
      <nav aria-label=${this.navLabel} @keydown=${this._onKeydown}>
        ${this.items?.map((i) => this._renderItem(i)) ?? nothing}
        <slot></slot>
      </nav>
      ${renderUtility(this)}
      ${renderAccount(this)}
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
