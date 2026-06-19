import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { buttonStyles } from "./tulpar-button.styles";
import { warnDev } from "../_internal/warn-dev";
// Side-effect import: registers <tulpar-tooltip>. The button delegates its
// `tooltip` convenience attribute to the real, accessible, collision-aware
// tooltip (WCAG 1.4.13) instead of the old CSS-only chip. Importing the module
// (not the class) keeps registration order-safe; the element is only ever
// instantiated lazily — buttons that never set `tooltip` create no overlay
// machinery (see `render()`).
import "../tooltip/tulpar-tooltip";

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
  | "al"
  | "kizagan"
  | "umay"
  | "ilay"
  | "erlik"
  | "kam"
  | "mergen"
  | "gok"
  | "ay"
  | "yersu"
  | "tulpar"
  | "otuken"
  | "kayin"
  | "ulgen"
  | "kuyas"
  | "alaz"
  | "burkut"
  | "colpan"
  | "ayzit"
  | "boz"
  | "kara"
  | "yagiz";

/**
 * For `color` override, on-color (foreground) is chosen per family at the .700
 * override stop. Light/mid-luminance families keep dark ink even at .700.
 */
const ON_COLOR_MAP: Record<ButtonColor, string> = {
  al: "var(--tulpar-primitive-color-colpan-50)",
  kizagan: "var(--tulpar-primitive-color-colpan-50)",
  umay: "var(--tulpar-primitive-color-colpan-50)",
  ilay: "var(--tulpar-primitive-color-colpan-50)",
  erlik: "var(--tulpar-primitive-color-colpan-50)",
  kam: "var(--tulpar-primitive-color-colpan-50)",
  mergen: "var(--tulpar-primitive-color-colpan-50)",
  gok: "var(--tulpar-primitive-color-colpan-50)",
  ay: "var(--tulpar-primitive-color-colpan-50)",
  yersu: "var(--tulpar-primitive-color-colpan-50)",
  tulpar: "var(--tulpar-primitive-color-yagiz-900)",
  otuken: "var(--tulpar-primitive-color-colpan-50)",
  kayin: "var(--tulpar-primitive-color-yagiz-900)",
  ulgen: "var(--tulpar-primitive-color-yagiz-900)",
  kuyas: "var(--tulpar-primitive-color-yagiz-900)",
  alaz: "var(--tulpar-primitive-color-colpan-50)",
  burkut: "var(--tulpar-primitive-color-colpan-50)",
  colpan: "var(--tulpar-primitive-color-yagiz-900)",
  ayzit: "var(--tulpar-primitive-color-yagiz-900)",
  boz: "var(--tulpar-primitive-color-yagiz-900)",
  kara: "var(--tulpar-primitive-color-colpan-50)",
  yagiz: "var(--tulpar-primitive-color-colpan-50)",
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
   * Convenience string tooltip. When set, the button delegates to a real
   * `<tulpar-tooltip>` rendered as a sibling in its shadow root: the inner
   * control is given a stable id and the tooltip references it by `for`, so the
   * control gets collision-aware positioning, hover/focus reveal with delay,
   * hover-bridge, Escape-to-dismiss and a working `aria-describedby` (the
   * tooltip self-wires that onto the resolved trigger) — i.e. WCAG 1.4.13
   * (hoverable / dismissible / persistent) compliance.
   *
   * The for-id binding (not a slot-wrap) keeps `<tulpar-tooltip>` at
   * `display:contents` with a `position:fixed` top-layer surface, so adding it
   * as a shadow sibling never disturbs the button's own layout (icon slots,
   * loading, icon-only, groups).
   *
   * Lazy: when this attribute is unset, no `<tulpar-tooltip>` is rendered and no
   * overlay machinery is instantiated.
   *
   * For richer needs (custom content, placement, controlled open) use
   * `<tulpar-tooltip>` directly.
   */
  @property({ type: String, reflect: true })
  tooltip?: string;

  /**
   * Stable per-instance id minted for the inner interactive control (the shadow
   * `<button>`/`<a>`). Used as the `for` target of the delegated
   * `<tulpar-tooltip>`. Resolved within this button's shadow root (the tooltip
   * is a sibling), so it never collides with light-DOM ids.
   */
  private readonly _controlId = `tulpar-btn-control-${(TulparButton._seq += 1)}`;

  private static _seq = 0;

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
    const hasTooltip = !!this.tooltip;
    const control = this.href ? this._renderAnchor(hasTooltip) : this._renderButton(hasTooltip);
    // Lazy: only instantiate <tulpar-tooltip> (and its overlay machinery) when a
    // tooltip string is actually set. The tooltip is rendered as a SIBLING of the
    // control and references it by `for` (the control carries `id=_controlId`).
    // The tooltip is `display:contents` with a `position:fixed` surface, so it
    // adds no box and the button's own layout (icons, loading, sizing) is
    // unaffected. The tooltip self-wires hover/focus/Esc + aria-describedby onto
    // the resolved inner control.
    if (!hasTooltip) return control;
    return html`
      ${control}
      <tulpar-tooltip .for=${this._controlId} .text=${this.tooltip}></tulpar-tooltip>
    `;
  }

  private _renderButton(hasTooltip = false): TemplateResult {
    return html`
      <button
        class="btn"
        type="button"
        id=${hasTooltip ? this._controlId : nothing}
        ?disabled=${this.disabled}
        aria-busy=${this.loading ? "true" : "false"}
      >
        ${this._renderContents()}
      </button>
    `;
  }

  private _renderAnchor(hasTooltip = false): TemplateResult {
    return html`
      <a
        class="btn"
        id=${hasTooltip ? this._controlId : nothing}
        href=${this.disabled ? nothing : (this.href ?? nothing)}
        target=${this.target ?? nothing}
        rel=${this.rel ?? nothing}
        aria-disabled=${this.disabled ? "true" : "false"}
        aria-busy=${this.loading ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
      >
        ${this._renderContents()}
      </a>
    `;
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
    this.toggleAttribute(
      "data-has-start",
      TulparButton._slotHasContent(e.target as HTMLSlotElement),
    );
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
