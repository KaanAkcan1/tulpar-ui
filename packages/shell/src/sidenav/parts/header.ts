import { html } from "lit";
import type { TulparSidenav } from "../tulpar-sidenav";

export function renderHeader(_host: TulparSidenav) {
  return html`<div class="header">
    <slot name="header"></slot><slot name="header-actions"></slot>
  </div>`;
}
