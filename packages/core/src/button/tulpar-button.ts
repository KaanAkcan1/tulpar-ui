import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { buttonStyles } from "./tulpar-button.styles";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonType = "button" | "submit" | "reset";

@customElement("tulpar-button")
export class TulparButton extends LitElement {
  static override styles = buttonStyles;

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

  constructor() {
    super();
    this.addEventListener("click", this._handleClick);
  }

  private _handleClick = (e: Event) => {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  };

  override render() {
    return html`
      <button
        class="btn"
        type=${this.type}
        ?disabled=${this.disabled}
        aria-busy=${this.loading ? "true" : "false"}
      >
        <slot name="start"></slot>
        <slot></slot>
        <slot name="end"></slot>
        <span class="spinner" aria-hidden="true"></span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-button": TulparButton;
  }
}
