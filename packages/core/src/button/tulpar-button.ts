import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles } from "./tulpar-button.styles";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonType = "button" | "submit" | "reset";

@customElement("tulpar-button")
export class TulparButton extends LitElement {
  static override styles = buttonStyles;
  static formAssociated = true;
  private _internals: ElementInternals;

  @property({ type: String, reflect: true })
  variant: ButtonVariant = "primary";

  @property({ type: String, reflect: true })
  size: ButtonSize = "md";

  @property({ type: String, reflect: true })
  type: ButtonType = "button";

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: Boolean, reflect: true, attribute: "icon-only" })
  iconOnly = false;

  @property({ type: String, reflect: true })
  href?: string;

  @property({ type: String, reflect: true })
  target?: string;

  @property({ type: String, reflect: true })
  rel?: string;

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.iconOnly && !this.getAttribute("aria-label")) {
      console.warn(
        '[tulpar-button] icon-only buttons must have an aria-label for accessibility',
        this,
      );
    }
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
    this.addEventListener("click", this._handleClick);
  }

  private _handleClick = (e: Event) => {
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
    return this.href ? this._renderAnchor() : this._renderButton();
  }

  private _renderButton() {
    return html`
      <button
        class="btn"
        type=${this.type}
        ?disabled=${this.disabled}
        aria-busy=${this.loading ? "true" : "false"}
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
        tabindex=${this.disabled ? "-1" : "0"}
      >
        ${this._renderContents()}
      </a>
    `;
  }

  private _renderContents() {
    return html`
      <slot name="start"></slot>
      <slot></slot>
      <slot name="end"></slot>
      <span class="spinner" aria-hidden="true"></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-button": TulparButton;
  }
}
