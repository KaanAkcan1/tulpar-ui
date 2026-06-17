import { LitElement, html, nothing } from "lit";
import { brandMark } from "../_internal/brand-mark";
import { property, state } from "lit/decorators.js";
import { shellStyles } from "./tulpar-shell.styles";

export type ShellSidenavMode = "static" | "overlay" | "rail";

export interface ShellState {
  sidenavMode: ShellSidenavMode;
  collapsed: { desktop: boolean; mobile: boolean };
  dark: boolean;
}

export class TulparShell extends LitElement {
  static override styles = shellStyles;

  @property({ type: String, reflect: true, attribute: "sidenav-mode" })
  sidenavMode: ShellSidenavMode = "static";

  @property({ type: String, attribute: "mobile-breakpoint" })
  mobileBreakpoint = "(max-width: 991px)";

  @property({ type: Boolean, attribute: "sidenav-collapsed" })
  sidenavCollapsed = false;

  /** overlay/mobil modda açık mı */
  @property({ type: Boolean, attribute: false })
  sidenavOpen = false;

  @property({ type: Boolean, reflect: true, attribute: "aside-open" })
  asideOpen = false;

  @property({ type: String, reflect: true, attribute: "content-width" })
  contentWidth: "fluid" | "fixed" = "fluid";

  @property({ type: String, reflect: true, attribute: "content-padding" })
  contentPadding: "none" | "compact" | "comfortable" = "comfortable";

  @property({ type: String, reflect: true, attribute: "footer-mode" })
  footerMode: "inline" | "fixed" = "inline";

  @property({ type: Boolean })
  dark = false;

  /** Controls sidenav vertical extent relative to topbar */
  @property({ type: String, reflect: true, attribute: "sidenav-layout" })
  sidenavLayout: "under-topbar" | "over-topbar" = "under-topbar";

  @state() private _isMobile = false;

  private _mql?: MediaQueryList;
  private _lastFocused: HTMLElement | null = null;
  private _sidenavObserver?: MutationObserver;

  private _onMql = (e: MediaQueryListEvent | MediaQueryList) => {
    this._isMobile = e.matches;
    this.toggleAttribute("data-mobile", e.matches);
    if (!e.matches) this._setSidenavOpen(false);
  };

  private _onKeydown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (this.asideOpen) {
      this.asideOpen = false;
      this._restoreFocus();
      this.dispatchEvent(new CustomEvent("tulpar-aside-close", { bubbles: true, composed: true }));
    } else if (this.sidenavOpen) {
      this._setSidenavOpen(false);
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    this._mql = window.matchMedia(this.mobileBreakpoint);
    this._mql.addEventListener("change", this._onMql);
    this._onMql(this._mql);
    document.addEventListener("keydown", this._onKeydown);
    this.addEventListener("tulpar-menu-toggle", this._onMenuToggle);
    this.addEventListener("tulpar-theme-toggle", this._onThemeToggle);
    // Watch the sidenav slot for position attribute changes
    this._sidenavObserver = new MutationObserver(() => this._syncSidenavPosition());
    this._observeSidenavSlot();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._mql?.removeEventListener("change", this._onMql);
    document.removeEventListener("keydown", this._onKeydown);
    this.removeEventListener("tulpar-menu-toggle", this._onMenuToggle);
    this.removeEventListener("tulpar-theme-toggle", this._onThemeToggle);
    this._sidenavObserver?.disconnect();
  }

  private _onThemeToggle = () => {
    this.dark = !this.dark;
  };

  private _onFabClick = () => {
    // Dispatch tulpar-menu-toggle so listeners (including ourselves) react,
    // and the event is observable by tests and external consumers.
    this.dispatchEvent(
      new CustomEvent("tulpar-menu-toggle", { bubbles: true, composed: true }),
    );
  };

  private _onMenuToggle = () => {
    // Mobile always forces overlay behaviour regardless of sidenavMode
    if (this._isMobile || this.sidenavMode === "overlay") {
      this._setSidenavOpen(!this.sidenavOpen);
    } else {
      this.sidenavCollapsed = !this.sidenavCollapsed;
      this._emitChange();
    }
  };

  private _setSidenavOpen(open: boolean) {
    this.sidenavOpen = open;
    this.toggleAttribute("data-sidenav-open", open);
    if (open) {
      this._focusPanel("sidenav");
    } else {
      this._restoreFocus();
    }
    this._emitChange();
  }

  private _focusPanel(slotName: "aside" | "sidenav") {
    // Only record the ORIGINAL trigger. If a second panel opens while one is
    // already open, don't overwrite _lastFocused with focus already inside the
    // first panel — otherwise closing restores focus to the wrong place.
    if (!this._lastFocused) {
      this._lastFocused = document.activeElement as HTMLElement | null;
    }
    requestAnimationFrame(() => {
      const slotted = this.querySelector<HTMLElement>(`[slot="${slotName}"]`);
      // focusable child first; fall back to the panel container itself
      const target =
        slotted?.querySelector<HTMLElement>(
          "a[href], button:not([disabled]), input, [tabindex]:not([tabindex='-1'])",
        ) ?? slotted;
      // If the fallback is a non-focusable container (no tabindex), make it
      // programmatically focusable so target?.focus() actually moves focus.
      if (target && target === slotted && !target.hasAttribute("tabindex")) {
        target.setAttribute("tabindex", "-1");
      }
      target?.focus();
    });
  }

  private _restoreFocus() {
    this._lastFocused?.focus();
    this._lastFocused = null;
  }

  private _emitChange() {
    const detail: ShellState = {
      sidenavMode: this.sidenavMode,
      collapsed: { desktop: this.sidenavCollapsed, mobile: !this.sidenavOpen },
      dark: this.dark,
    };
    this.dispatchEvent(
      new CustomEvent("tulpar-shell-change", { bubbles: true, composed: true, detail }),
    );
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has("sidenavCollapsed")) {
      this.toggleAttribute("data-collapsed", this.sidenavCollapsed);
      // Rail mode: propagate data-rail to slotted sidenav
      this._updateRailAttr();
      this._updateStateAttrs();
    }
    if (changed.has("sidenavOpen")) {
      this._updateStateAttrs();
    }
    if (changed.has("sidenavMode")) {
      this._updateRailAttr();
      this._updateStateAttrs();
    }
    if (changed.has("dark")) {
      const apply = () => document.documentElement.classList.toggle("dark", this.dark);
      if (document.startViewTransition) {
        const t = document.startViewTransition(apply);
        t.ready.catch(() => {});
        t.finished.catch(() => {});
      } else {
        apply();
      }
      if (changed.get("dark") !== undefined) this._emitChange();
    }
    if (changed.has("asideOpen")) {
      if (this.asideOpen) {
        this._focusPanel("aside");
      } else if (changed.get("asideOpen") === true) {
        // was open, now closed — restore focus
        this._restoreFocus();
      }
    }
  }

  private _syncSidenavPosition() {
    const sidenav = this.querySelector("[slot='sidenav']");
    const pos = sidenav?.getAttribute("position") ?? "left";
    if (pos === "right") {
      this.setAttribute("data-sidenav-position", "right");
    } else {
      this.removeAttribute("data-sidenav-position");
    }
  }

  private _observeSidenavSlot() {
    // Re-observe whenever the slotted sidenav element changes
    this._sidenavObserver?.disconnect();
    const sidenav = this.querySelector("[slot='sidenav']");
    if (sidenav) {
      this._sidenavObserver?.observe(sidenav, { attributes: true, attributeFilter: ["position"] });
    }
    this._syncSidenavPosition();
    this._updateStateAttrs();
  }

  private _updateRailAttr() {
    const isRail = this.sidenavMode === "rail" && this.sidenavCollapsed;
    const sidenav = this.querySelector("[slot='sidenav']");
    if (sidenav) {
      sidenav.toggleAttribute("data-rail", isRail);
    }
  }

  /** Reflect collapsed/open state attributes onto the slotted sidenav element. */
  private _updateStateAttrs() {
    const sidenav = this.querySelector("[slot='sidenav']");
    if (!sidenav) return;
    const collapsed = this.sidenavMode === "static" && this.sidenavCollapsed;
    sidenav.toggleAttribute("data-collapsed", collapsed);
    sidenav.toggleAttribute("data-sidenav-open", this.sidenavOpen);
  }

  private _onMaskClick() {
    if (this.asideOpen) {
      this.asideOpen = false;
      this._restoreFocus();
      this.dispatchEvent(new CustomEvent("tulpar-aside-close", { bubbles: true, composed: true }));
    } else {
      this._setSidenavOpen(false);
    }
  }

  override render() {
    const overlayActive = (this._isMobile || this.sidenavMode === "overlay") && this.sidenavOpen;
    const maskVisible = overlayActive || this.asideOpen;
    const showFab =
      (this.sidenavMode === "static" && this.sidenavCollapsed) ||
      ((this._isMobile || this.sidenavMode === "overlay") && !this.sidenavOpen);
    return html`
      <a class="skip-link" href="#tulpar-shell-content">Skip to content</a>
      <div class="topbar"><slot name="topbar"></slot></div>
      <div class="sidenav"><slot name="sidenav" @slotchange=${this._observeSidenavSlot}></slot></div>
      <main id="tulpar-shell-content">
        <div class="content-box"><slot></slot></div>
      </main>
      <div class="footer"><slot name="footer"></slot></div>
      ${maskVisible
        ? html`<button class="mask" aria-label="Close panel" @click=${this._onMaskClick}></button>`
        : nothing}
      <div class="aside" role="complementary" ?inert=${!this.asideOpen}>
        <slot name="aside"></slot>
      </div>
      ${showFab
        ? html`<button class="sidenav-fab" aria-label="Open navigation" @click=${this._onFabClick}>${brandMark}</button>`
        : nothing}
    `;
  }
}

if (!customElements.get("tulpar-shell")) {
  customElements.define("tulpar-shell", TulparShell);
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-shell": TulparShell;
  }
}
