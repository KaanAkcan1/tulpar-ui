import { LitElement, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { sidenavStyles } from "./tulpar-sidenav.styles";
import { headerStyles } from "./parts/header.styles";
import { utilityStyles } from "./parts/utility.styles";
import { accountStyles } from "./parts/account.styles";
import { searchStyles } from "./parts/search.styles";
import { renderHeader } from "./parts/header";
import { renderUtility } from "./parts/utility";
import { renderAccount } from "./parts/account";
import { renderSearch } from "./parts/search";
import type { TulparNavItemData } from "../nav-item/tulpar-nav-item";
import type { TulparNavItem } from "../nav-item/tulpar-nav-item";
import "../nav-item/tulpar-nav-item";
import "../nav-section/tulpar-nav-section";

export class TulparSidenav extends LitElement {
  static override styles = [
    sidenavStyles,
    headerStyles,
    utilityStyles,
    accountStyles,
    searchStyles,
  ];

  /**
   * Tell the browser (and Lit) to observe these non-declared attributes so that
   * attributeChangedCallback fires synchronously on mutation, guaranteeing that
   * `await el.updateComplete` after `toggleAttribute("data-collapsed")` catches
   * the re-render. The MutationObserver in connectedCallback is kept as an extra
   * safety net for external mutations that may bypass attributeChangedCallback.
   */
  static override get observedAttributes() {
    return [...super.observedAttributes, "data-collapsed", "data-sidenav-open", "data-rail"];
  }

  override attributeChangedCallback(name: string, oldVal: string | null, newVal: string | null) {
    super.attributeChangedCallback(name, oldVal, newVal);
    if (name === "data-collapsed" || name === "data-sidenav-open" || name === "data-rail") {
      this.requestUpdate();
      if (name === "data-rail") {
        this._reflectRail();
      }
    }
  }

  /**
   * Reflects the host's `data-rail` attribute onto every slotted and
   * data-driven (shadow-DOM) `tulpar-nav-item` / `tulpar-nav-section`
   * so each item can key its own flyout styles on `:host([data-rail])`
   * instead of the non-composable `:host-context()`.
   */
  private _reflectRail() {
    const on = this.hasAttribute("data-rail");
    this.querySelectorAll("tulpar-nav-item, tulpar-nav-section").forEach((n) =>
      n.toggleAttribute("data-rail", on),
    );
    this.shadowRoot
      ?.querySelectorAll("tulpar-nav-item, tulpar-nav-section")
      .forEach((n) => n.toggleAttribute("data-rail", on));
  }

  /** JSON menü verisi — slot ile birlikte kullanılabilir. */
  @property({ attribute: false }) items?: TulparNavItemData[];

  @property({ type: String, attribute: "nav-label" }) navLabel = "Main navigation";

  @property({ type: String, reflect: true }) position: "left" | "right" = "left";
  @property({ type: String, reflect: true }) density: "comfortable" | "compact" = "comfortable";
  @property({ type: Boolean, attribute: "single-expand" }) singleExpand = false;

  /** Accessible label for the built-in toggle button. */
  @property({ attribute: "toggle-label" }) toggleLabel = "Toggle navigation";

  /** Show the built-in search field (filters the menu). Hidden in rail. Default true. */
  @property({ type: Boolean, attribute: "show-search" }) showSearch = true;
  /** Placeholder for the built-in search field. */
  @property({ attribute: "search-placeholder" }) searchPlaceholder = "Search…";
  /** Accessible label for the built-in search field. */
  @property({ attribute: "search-label" }) searchLabel = "Filter navigation";
  /** Text shown when a filter query matches no items. */
  @property({ attribute: "search-empty-text" }) searchEmptyText = "No results";

  /** Show the built-in theme-toggle cell in the utility row. */
  @property({ type: Boolean, attribute: "show-mode-selection" }) showModeSelection = true;
  /** Show the built-in config cell in the utility row. */
  @property({ type: Boolean, attribute: "show-config" }) showConfig = false;
  /** Label text rendered inside the config button. */
  @property({ attribute: "config-text" }) configText = "Configure";
  /** aria-label for the theme-toggle button. */
  @property({ attribute: "theme-label" }) themeLabel = "Toggle color theme";
  /** Theme-toggle label shown while in LIGHT mode (the mode you switch TO). */
  @property({ attribute: "theme-text-dark" }) themeTextDark = "Dark";
  /** Theme-toggle label shown while in DARK mode. */
  @property({ attribute: "theme-text-light" }) themeTextLight = "Light";
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

  /** True when a [slot=search] child is present in light DOM (app-owned search). */
  @state() _hasSearchSlot = false;
  /** Current search/filter query. */
  @state() _query = "";
  /** True when the active query matches no items. */
  @state() private _noResults = false;
  /** Set while the filter mutates group expansion, so single-expand stays out of the way. */
  private _filtering = false;
  /** Snapshot of each group's expanded state before filtering, to restore on clear. */
  private _preFilterExpanded: Map<TulparNavItem, boolean> | null = null;

  /** Mirrors global .dark class on documentElement; self-reflected as data-dark. */
  @state() private _dark = false;
  private _darkObserver: MutationObserver | null = null;

  private _syncDark = () => {
    // Dual-write is intentional: `_dark` (@state) drives the template re-render,
    // and `data-dark` on the host is the CSS hook for `:host([data-dark])` (icon
    // swap). We don't use `@property({reflect:true})` because that would expose
    // `data-dark` as public API; here it's an internal, derived mirror only.
    const dark = document.documentElement.classList.contains("dark");
    if (dark !== this._dark) {
      this._dark = dark;
      this.toggleAttribute("data-dark", dark);
    }
  };

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
      icon=${item.icon ?? nothing}
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
    return (
      (items.find(
        (i) => i.contains(document.activeElement) || i === document.activeElement,
      ) as TulparNavItem) ?? null
    );
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
      e.key === "ArrowRight" ? focused.expand?.() : focused.collapse?.();
      return;
    }
  };

  private _onRailFlyoutOpen = (e: Event) => {
    const opened = (e as CustomEvent).detail.item as TulparNavItem;
    const all = [
      ...this.querySelectorAll<TulparNavItem>("tulpar-nav-item"),
      ...(this.shadowRoot?.querySelectorAll<TulparNavItem>("tulpar-nav-item") ?? []),
    ];
    all.forEach((it) => {
      if (it !== opened) it.closeRailFlyout();
    });
  };

  private _onItemExpand = (e: Event) => {
    // While filtering we expand multiple groups to reveal matches; don't let
    // single-expand collapse them against each other.
    if (this._filtering) return;
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
   * Called whenever the search slot's assigned nodes change.
   * Public so renderSearch() can bind it from parts/search.ts.
   */
  _onSearchSlotChange = (e?: Event) => {
    const slot = e?.target as HTMLSlotElement | undefined;
    if (slot) {
      this._hasSearchSlot = slot.assignedElements().length > 0;
    } else {
      this._hasSearchSlot = !!this.querySelector(':scope > [slot="search"]');
    }
  };

  /** Public so renderSearch() can bind the built-in input. */
  _onSearchInput = (e: Event) => {
    this._query = (e.target as HTMLInputElement).value;
    this._applyFilter();
    this.dispatchEvent(
      new CustomEvent("tulpar-search", {
        bubbles: true,
        composed: true,
        detail: { query: this._query },
      }),
    );
  };

  /** Esc clears the query; public so renderSearch() can bind it. */
  _onSearchKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this._query) {
      e.preventDefault();
      e.stopPropagation();
      this._query = "";
      this._applyFilter();
    }
  };

  /** All nav-items in both light DOM (slotted/wrapper) and shadow DOM (data-driven). */
  private _allNavItems(): TulparNavItem[] {
    return [
      ...this.querySelectorAll<TulparNavItem>("tulpar-nav-item"),
      ...(this.shadowRoot?.querySelectorAll<TulparNavItem>("tulpar-nav-item") ?? []),
    ];
  }

  /**
   * Live label filter. An item shows when its own label matches OR a descendant
   * matches; groups with a matching descendant are auto-expanded (and restored on
   * clear); empty sections are hidden; `_noResults` drives the empty message.
   */
  private _applyFilter() {
    const q = this._query.trim().toLowerCase();
    const items = this._allNavItems();
    const sections = [
      ...this.querySelectorAll("tulpar-nav-section"),
      ...(this.shadowRoot?.querySelectorAll("tulpar-nav-section") ?? []),
    ];

    if (!q) {
      items.forEach((i) => i.removeAttribute("data-search-hidden"));
      sections.forEach((s) => s.removeAttribute("data-search-hidden"));
      this._restoreExpanded();
      this._noResults = false;
      return;
    }

    // Snapshot expanded state on the first keystroke of a fresh query session.
    if (!this._preFilterExpanded) {
      this._preFilterExpanded = new Map();
      for (const it of items) {
        if (typeof it.expand === "function") this._preFilterExpanded.set(it, it.expanded);
      }
    }

    const selfMatch = new Map<TulparNavItem, boolean>();
    for (const it of items) selfMatch.set(it, (it.label ?? "").toLowerCase().includes(q));

    let anyVisible = false;
    this._filtering = true;
    for (const it of items) {
      const descendants = it.querySelectorAll<TulparNavItem>("tulpar-nav-item");
      let visible = selfMatch.get(it) ?? false;
      let descendantMatch = false;
      for (const d of descendants) {
        if (selfMatch.get(d)) {
          descendantMatch = true;
          break;
        }
      }
      visible = visible || descendantMatch;
      it.toggleAttribute("data-search-hidden", !visible);
      if (visible) anyVisible = true;
      // Reveal matches inside a group whose own label didn't match.
      if (descendantMatch && typeof it.expand === "function") it.expand();
    }
    this._filtering = false;

    for (const sec of sections) {
      const childItems = sec.querySelectorAll("tulpar-nav-item");
      const anyChild = [...childItems].some((c) => !c.hasAttribute("data-search-hidden"));
      sec.toggleAttribute("data-search-hidden", !anyChild);
    }

    this._noResults = !anyVisible;
  }

  /** Restore each group's pre-filter expanded state and drop the snapshot. */
  private _restoreExpanded() {
    if (!this._preFilterExpanded) return;
    this._filtering = true;
    for (const [it, wasExpanded] of this._preFilterExpanded) {
      if (wasExpanded) it.expand?.();
      else it.collapse?.();
    }
    this._filtering = false;
    this._preFilterExpanded = null;
  }

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
    this.addEventListener("tulpar-rail-flyout-open", this._onRailFlyoutOpen);
    // Detect initial state synchronously before first render
    this.hasHeaderSlot = !!this.querySelector(':scope > [slot="header"]');
    this._hasUtilityStart = !!this.querySelector(':scope > [slot="utility-start"]');
    this._hasUtilityEnd = !!this.querySelector(':scope > [slot="utility-end"]');
    this._hasFooterSlot = !!this.querySelector(':scope > [slot="footer"]');
    this._hasSearchSlot = !!this.querySelector(':scope > [slot="search"]');
    // Cmd/Ctrl+K focuses the built-in search field.
    document.addEventListener("keydown", this._onGlobalSearchHotkey);
    // Sync dark mode from documentElement and observe future changes
    this._syncDark();
    this._darkObserver = new MutationObserver(this._syncDark);
    this._darkObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    this._attrObserver = new MutationObserver(() => {
      this.requestUpdate();
      this._reflectRail();
    });
    this._attrObserver.observe(this, {
      attributes: true,
      attributeFilter: ["data-collapsed", "data-sidenav-open", "data-rail"],
    });
  }

  override firstUpdated() {
    this._reflectRail();
  }

  override updated() {
    // Only sweep children when we're actually in rail mode.
    // The data-rail toggle ON/OFF transition is already handled by
    // attributeChangedCallback → _reflectRail(), so we only need to re-run
    // here to pick up new items that were added while already railed
    // (e.g. dynamic items change, slot content swap).
    if (this.hasAttribute("data-rail")) this._reflectRail();
  }

  /** Cmd/Ctrl+K → focus the built-in search field (only when it is rendered). */
  private _onGlobalSearchHotkey = (e: KeyboardEvent) => {
    if (e.key !== "k" || !(e.metaKey || e.ctrlKey)) return;
    if (this.hasAttribute("data-rail") || !this.showSearch || this._hasSearchSlot) return;
    const input = this.shadowRoot?.querySelector<HTMLInputElement>(".search-input");
    if (input) {
      e.preventDefault();
      input.focus();
      input.select();
    }
  };

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onGlobalSearchHotkey);
    this.removeEventListener("tulpar-nav-item-expand", this._onItemExpand);
    this.removeEventListener("tulpar-rail-flyout-open", this._onRailFlyoutOpen);
    this._darkObserver?.disconnect();
    this._darkObserver = null;
    this._attrObserver?.disconnect();
    this._attrObserver = null;
  }

  private _onDefaultSlotChange = (e: Event) => {
    this._reflectRail();
    // Propagate slotchange to allow external observers
    void e;
  };

  override render() {
    return html`
      ${renderHeader(this)} ${renderSearch(this)}
      <nav aria-label=${this.navLabel} @keydown=${this._onKeydown}>
        ${this.items?.map((i) => this._renderItem(i)) ?? nothing}
        <slot @slotchange=${this._onDefaultSlotChange}></slot>
        ${this._query && this._noResults
          ? html`<div class="no-results" role="status">${this.searchEmptyText}</div>`
          : nothing}
      </nav>
      ${renderUtility(this)} ${renderAccount(this)}
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
