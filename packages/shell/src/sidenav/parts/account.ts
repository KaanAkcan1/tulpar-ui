import { html } from "lit";
import type { TulparSidenav } from "../tulpar-sidenav";

export function renderAccount(_host: TulparSidenav) {
  return html`<div class="footer"><slot name="footer"></slot></div>`;
}
