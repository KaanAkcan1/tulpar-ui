import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles } from "./tulpar-button.styles";

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

@customElement("tulpar-button")
export class TulparButton extends LitElement {
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

  // --- Tooltip ---
  @property({ type: String, reflect: true })
  tooltip?: string;

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.addEventListener("click", this._handleClick);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if ((this.iconOnly || this.shape === "circle") && !this.getAttribute("aria-label")) {
      console.warn("[tulpar-button] icon-only/circle buttons require an aria-label", this);
    }
    this._applyColorOverride();
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
      form.requestSubmit();
    } else if (this.type === "reset") {
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
        type=${this.type}
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
        href=${this.disabled ? "javascript:void(0)" : (this.href ?? "")}
        target=${this.target ?? ""}
        rel=${this.rel ?? ""}
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
        <slot name="start"></slot>
      </span>
      <span class="separator separator--start" aria-hidden="true"></span>
      <span class="label">
        <span class="label-text"><slot></slot></span>
        <span class="loading-label-text">${this.loadingLabel ?? ""}</span>
      </span>
      <span class="separator separator--end" aria-hidden="true"></span>
      <span class="end">
        <slot name="end"></slot>
      </span>
      <span class="spinner" aria-hidden="true">
        <slot name="loading-icon">
          <span class="default-spinner"></span>
        </slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-button": TulparButton;
  }
}
