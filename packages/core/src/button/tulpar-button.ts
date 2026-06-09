import { LitElement, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { buttonStyles } from "./tulpar-button.styles";
import { warnDev } from "../_internal/warn-dev";

export type ButtonSeverity =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warn"
  | "help"
  | "danger"
  | "contrast"
  | "premium";

export type ButtonVariant = "solid" | "outlined" | "tonal" | "ghost" | "link";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export type ButtonShape = "default" | "round" | "circle";

export type ButtonIconPosition = "start" | "end" | "top" | "bottom";

export type ButtonLoadingPosition = "start" | "center" | "end";

export type ButtonType = "button" | "submit" | "reset";

export type ButtonJustify = "start" | "center" | "end" | "between";

export type ButtonColor =
  | "navy"
  | "gold"
  | "stone"
  | "slate"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

/**
 * For `color` override, on-color (foreground) is chosen per family.
 * Color override now uses the .700 stop (matching severity defaults for
 * WCAG AA contrast with white text). Light-luminance families (yellow,
 * lime) still need dark text even at .700. All other families work with
 * white text.
 */
const ON_COLOR_MAP: Record<ButtonColor, string> = {
  navy: "var(--tulpar-primitive-color-stone-50)",
  gold: "var(--tulpar-primitive-color-stone-50)",
  stone: "var(--tulpar-primitive-color-stone-50)",
  slate: "var(--tulpar-primitive-color-stone-50)",
  red: "var(--tulpar-primitive-color-stone-50)",
  orange: "var(--tulpar-primitive-color-stone-50)",
  amber: "var(--tulpar-primitive-color-stone-50)",
  yellow: "var(--tulpar-primitive-color-stone-900)",
  lime: "var(--tulpar-primitive-color-stone-900)",
  green: "var(--tulpar-primitive-color-stone-50)",
  emerald: "var(--tulpar-primitive-color-stone-50)",
  teal: "var(--tulpar-primitive-color-stone-50)",
  cyan: "var(--tulpar-primitive-color-stone-50)",
  sky: "var(--tulpar-primitive-color-stone-50)",
  blue: "var(--tulpar-primitive-color-stone-50)",
  indigo: "var(--tulpar-primitive-color-stone-50)",
  violet: "var(--tulpar-primitive-color-stone-50)",
  purple: "var(--tulpar-primitive-color-stone-50)",
  fuchsia: "var(--tulpar-primitive-color-stone-50)",
  pink: "var(--tulpar-primitive-color-stone-50)",
  rose: "var(--tulpar-primitive-color-stone-50)",
};

export class TulparButton extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static override styles = buttonStyles;
  static formAssociated = true;
  private _internals: ElementInternals;

  // --- Visual ---
  @property({ type: String, reflect: true })
  severity: ButtonSeverity = "primary";

  @property({ type: String, reflect: true })
  variant: ButtonVariant = "solid";

  @property({ type: String, reflect: true })
  color?: ButtonColor;

  @property({ type: String, reflect: true })
  shape: ButtonShape = "default";

  @property({ type: String, reflect: true })
  size: ButtonSize = "md";

  @property({ type: Boolean, reflect: true })
  raised = false;

  @property({ type: Boolean, reflect: true })
  block = false;

  @property({ type: String, reflect: true })
  justify: ButtonJustify = "center";

  // --- Icon layout ---
  @property({ type: Boolean, reflect: true, attribute: "icon-only" })
  iconOnly = false;

  @property({ type: String, reflect: true, attribute: "icon-position" })
  iconPosition: ButtonIconPosition = "start";

  @property({ type: Boolean, reflect: true, attribute: "icon-separator" })
  iconSeparator = false;

  // --- State ---
  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true, attribute: "data-disabled" })
  dataDisabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: String, reflect: true, attribute: "loading-label" })
  loadingLabel?: string;

  @property({ type: String, reflect: true, attribute: "loading-position" })
  loadingPosition: ButtonLoadingPosition = "center";

  // --- Polymorphism ---
  @property({ type: String, reflect: true })
  href?: string;

  @property({ type: String, reflect: true })
  target?: string;

  @property({ type: String, reflect: true })
  rel?: string;

  // --- Form ---
  @property({ type: String, reflect: true })
  type: ButtonType = "button";

  @property({ type: String, reflect: true })
  name?: string;

  @property({ type: String, reflect: true })
  value?: string;

  // --- Tooltip ---
  /**
   * Simple inline string tooltip.
   *
   * Limitations:
   * - Clipped by ancestors with `overflow: hidden`.
   * - Uses a fixed z-index (100); may be obscured by modals/drawers.
   * - No ESC dismiss, no hover delay, no viewport-edge collision detection.
   *
   * For production needs, use a dedicated tooltip component (planned v0.5, built
   * on the Popover API + CSS Anchor Positioning).
   */
  @property({ type: String, reflect: true })
  tooltip?: string;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this._handleClick, { capture: true });
    if ((this.iconOnly || this.shape === "circle") && !this.getAttribute("aria-label")) {
      warnDev("[tulpar-button] icon-only/circle buttons require an aria-label", this);
    }
    this._applyColorOverride();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClick, {
      capture: true,
    } as EventListenerOptions);
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("color")) {
      this._applyColorOverride();
    }
  }

  /**
   * When the `color` attribute is set, override the private --_btn-color-*
   * custom properties from the chosen chromatic primitive family.
   * Removes the override when `color` is unset.
   */
  private _applyColorOverride(): void {
    if (!this.color) {
      this.style.removeProperty("--_btn-color-default");
      this.style.removeProperty("--_btn-color-hover");
      this.style.removeProperty("--_btn-color-active");
      this.style.removeProperty("--_btn-color-disabled");
      this.style.removeProperty("--_btn-color-on");
      this.style.removeProperty("--_btn-color-subtle");
      this.style.removeProperty("--_btn-color-subtle-hover");
      return;
    }
    const c = this.color;
    this.style.setProperty("--_btn-color-default", `var(--tulpar-primitive-color-${c}-700)`);
    this.style.setProperty("--_btn-color-hover", `var(--tulpar-primitive-color-${c}-800)`);
    this.style.setProperty("--_btn-color-active", `var(--tulpar-primitive-color-${c}-900)`);
    this.style.setProperty("--_btn-color-disabled", `var(--tulpar-primitive-color-${c}-300)`);
    this.style.setProperty("--_btn-color-on", ON_COLOR_MAP[c]);
    this.style.setProperty("--_btn-color-subtle", `var(--tulpar-primitive-color-${c}-50)`);
    this.style.setProperty("--_btn-color-subtle-hover", `var(--tulpar-primitive-color-${c}-100)`);
  }

  private _handleClick = (e: Event): void => {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    if (this.href) return; // anchor handles its own activation
    const form = this._internals.form;
    if (!form) return;
    if (this.type === "submit") {
      e.preventDefault();
      // Chromium rejects FACEs as `requestSubmit` submitters ("not a submit
      // button"), so we can't pass `this`. Instead, push our value into
      // FormData via ElementInternals.setFormValue right before submit, then
      // clear it after so we don't contribute to submits driven by another
      // button. The `name` attribute is read by the browser as the FormData
      // key during form participation.
      this._internals.setFormValue(this.value ?? null);
      form.requestSubmit();
      this._internals.setFormValue(null);
    } else if (this.type === "reset") {
      e.preventDefault();
      form.reset();
    }
  };

  override render() {
    return html`
      ${this.href ? this._renderAnchor() : this._renderButton()} ${this._renderTooltip()}
    `;
  }

  private _renderButton() {
    return html`
      <button
        class="btn"
        type="button"
        ?disabled=${this.disabled}
        aria-busy=${this.loading ? "true" : "false"}
        aria-describedby=${this.tooltip ? "tulpar-btn-tooltip" : ""}
      >
        ${this._renderContents()}
      </button>
    `;
  }

  private _renderAnchor() {
    return html`
      <a
        class="btn"
        href=${this.disabled ? nothing : (this.href ?? nothing)}
        target=${this.target ?? nothing}
        rel=${this.rel ?? nothing}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-busy=${this.loading ? "true" : "false"}
        aria-describedby=${this.tooltip ? "tulpar-btn-tooltip" : ""}
        tabindex=${this.disabled ? "-1" : "0"}
      >
        ${this._renderContents()}
      </a>
    `;
  }

  private _renderTooltip() {
    if (!this.tooltip) return "";
    return html`<span class="tooltip" role="tooltip" id="tulpar-btn-tooltip"
      >${this.tooltip}</span
    >`;
  }

  private _renderContents() {
    return html`
      <span class="start">
        <slot name="start" @slotchange=${this._onStartSlotChange}></slot>
      </span>
      <span class="separator separator--start" aria-hidden="true"></span>
      <span class="label">
        <span class="label-text"><slot></slot></span>
        <span class="loading-label-text" aria-live="polite">${this.loadingLabel ?? ""}</span>
      </span>
      <span class="separator separator--end" aria-hidden="true"></span>
      <span class="end">
        <slot name="end" @slotchange=${this._onEndSlotChange}></slot>
      </span>
      <span class="spinner" aria-hidden="true">
        <slot name="loading-icon">
          <span class="default-spinner"></span>
        </slot>
      </span>
    `;
  }

  private _onStartSlotChange = (e: Event): void => {
    this.toggleAttribute("data-has-start", TulparButton._slotHasContent(e.target as HTMLSlotElement));
  };

  private _onEndSlotChange = (e: Event): void => {
    this.toggleAttribute("data-has-end", TulparButton._slotHasContent(e.target as HTMLSlotElement));
  };

  private static _slotHasContent(slot: HTMLSlotElement): boolean {
    return slot.assignedNodes({ flatten: true }).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      if (n.nodeType === Node.TEXT_NODE) return (n.textContent ?? "").trim() !== "";
      return false;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-button": TulparButton;
  }
}

if (!customElements.get("tulpar-button")) {
  customElements.define("tulpar-button", TulparButton);
}
