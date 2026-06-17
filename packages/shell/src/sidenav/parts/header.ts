import { html } from "lit";
import { brandMark } from "../../_internal/brand-mark";
import { brandWordmark } from "../../_internal/brand-wordmark";
import type { TulparSidenav } from "../tulpar-sidenav";

export function renderHeader(host: TulparSidenav) {
  if (host.hasHeaderSlot) {
    return html`<div class="header">
      <slot name="header" @slotchange=${host._onHeaderSlotChange}></slot>
      <slot name="header-actions"></slot>
    </div>`;
  }

  const expanded = String(!host.hasAttribute("data-collapsed"));

  return html`<div class="header">
    <button
      class="sidenav-toggle"
      type="button"
      aria-label=${host.toggleLabel}
      aria-expanded=${expanded}
      @click=${() =>
        host.dispatchEvent(
          new CustomEvent("tulpar-menu-toggle", { bubbles: true, composed: true }),
        )}
    >
      ${brandMark}
    </button>
    <span class="brand">${brandWordmark}</span>
    <slot name="header-actions"></slot>
    <slot name="header" style="display:none" @slotchange=${host._onHeaderSlotChange}></slot>
  </div>`;
}
