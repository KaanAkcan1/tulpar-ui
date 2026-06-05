import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { buttonGroupStyles } from "./tulpar-button-group.styles";

@customElement("tulpar-button-group")
export class TulparButtonGroup extends LitElement {
  static override styles = buttonGroupStyles;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this._handleKeydown);
    queueMicrotask(() => {
      this._initializeTabindex();
      this._positionChildren();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this._handleKeydown);
  }

  private _buttons(): HTMLElement[] {
    return Array.from(this.querySelectorAll("tulpar-button"));
  }

  private _initializeTabindex(): void {
    const buttons = this._buttons();
    buttons.forEach((btn, i) => {
      btn.setAttribute("tabindex", i === 0 ? "0" : "-1");
    });
  }

  private _positionChildren(): void {
    const buttons = this._buttons();
    buttons.forEach((btn, i) => {
      if (buttons.length === 1) {
        btn.removeAttribute("data-group-position");
      } else if (i === 0) {
        btn.setAttribute("data-group-position", "first");
      } else if (i === buttons.length - 1) {
        btn.setAttribute("data-group-position", "last");
      } else {
        btn.setAttribute("data-group-position", "middle");
      }
    });
  }

  private _handleKeydown = (e: KeyboardEvent): void => {
    const buttons = this._buttons();
    const currentIndex = buttons.findIndex((b) => b === document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    switch (e.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = buttons.length - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    buttons[currentIndex].setAttribute("tabindex", "-1");
    buttons[nextIndex].setAttribute("tabindex", "0");
    buttons[nextIndex].focus();
  };

  override render() {
    return html`<div class="group" role="group"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-button-group": TulparButtonGroup;
  }
}
