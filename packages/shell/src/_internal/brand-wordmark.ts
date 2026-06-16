import { html } from "lit";

/** Default brand lockup text. Uses currentColor (inherits sidenav fg) so it themes. */
export const brandWordmark = html`<span
  style="font-family: var(--tulpar-font-family-display, Georgia, serif); font-weight:600; font-size:1rem; letter-spacing:-0.01em; color: currentColor;"
  >Tulpar UI</span
>`;
