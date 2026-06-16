import { html } from "lit";
import type { TulparSidenav } from "../tulpar-sidenav";

export function renderUtility(_host: TulparSidenav) {
  return html`<div class="utility">
    <div class="utility-start"><slot name="utility-start"></slot></div>
    <div class="utility-end"><slot name="utility-end"></slot></div>
  </div>`;
}
