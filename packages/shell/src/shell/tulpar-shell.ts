import { LitElement, html, nothing } from "lit";
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

  @state() private _isMobile = false;

  private _mql?: MediaQueryList;
  private _lastFocused: HTMLElement | null = null;

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
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._mql?.removeEventListener("change", this._onMql);
    document.removeEventListener("keydown", this._onKeydown);
    this.removeEventListener("tulpar-menu-toggle", this._onMenuToggle);
  }

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
    }
    if (changed.has("sidenavMode")) {
      this._updateRailAttr();
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

  private _updateRailAttr() {
    const isRail = this.sidenavMode === "rail" && this.sidenavCollapsed;
    const sidenav = this.querySelector("[slot='sidenav']");
    if (sidenav) {
      sidenav.toggleAttribute("data-rail", isRail);
    }
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
    const overlayActive =
      (this._isMobile || this.sidenavMode === "overlay") && this.sidenavOpen;
    const maskVisible = overlayActive || this.asideOpen;
    return html`
      <a class="skip-link" href="#tulpar-shell-content">Skip to content</a>
      <div class="topbar"><slot name="topbar"></slot></div>
      <div class="sidenav"><slot name="sidenav"></slot></div>
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
