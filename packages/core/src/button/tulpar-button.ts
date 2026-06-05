import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonType = "button" | "submit" | "reset";

@customElement("tulpar-button")
export class TulparButton extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    button {
      font: inherit;
      cursor: pointer;
    }
  `;

  @property({ type: String, reflect: true })
  variant: ButtonVariant = "primary";

  @property({ type: String, reflect: true })
  size: ButtonSize = "md";

  @property({ type: String, reflect: true })
  type: ButtonType = "button";

  override render() {
    return html`<button type=${this.type}><slot></slot></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-button": TulparButton;
  }
}
