import { html, nothing } from "lit";
import type { TulparSidenav } from "../tulpar-sidenav";

// Moon SVG icon
const moonIcon = html`<svg
  class="icon-moon"
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
</svg>`;

// Sun SVG icon
const sunIcon = html`<svg
  class="icon-sun"
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <circle cx="12" cy="12" r="5" />
  <line x1="12" y1="1" x2="12" y2="3" />
  <line x1="12" y1="21" x2="12" y2="23" />
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
  <line x1="1" y1="12" x2="3" y2="12" />
  <line x1="21" y1="12" x2="23" y2="12" />
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
</svg>`;

// Gear SVG icon
const gearIcon = html`<svg
  class="icon-gear"
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <circle cx="12" cy="12" r="3" />
  <path
    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
  />
</svg>`;

/**
 * Renders the utility row at the bottom of the sidenav.
 *
 * Slot-vs-built-in precedence (spec §4.3):
 * - If `utility-start` slot is filled → render a `.util-cell` containing that slot;
 *   the built-in theme toggle is suppressed entirely.
 * - If `utility-start` slot is empty → render built-in `.util-theme` button when
 *   `showModeSelection` is true; otherwise render nothing for that position.
 * - Same mutual-exclusion logic applies to `utility-end` / built-in `.util-config`.
 *
 * Detection: `host._hasUtilityStart` / `host._hasUtilityEnd` are set synchronously
 * in connectedCallback (via querySelector) and updated dynamically via @slotchange
 * handlers bound below.
 *
 * The entire `.utility` container is omitted when no cell (built-in or slotted) is
 * visible — i.e. both props are false AND no slot content is present.
 */
export function renderUtility(host: TulparSidenav) {
  // Determine what to show in the "start" (left) cell:
  // priority: slotted content > built-in > nothing
  const startCell = host._hasUtilityStart
    ? html`<div class="util-cell">
        <slot
          name="utility-start"
          @slotchange=${host._onUtilityStartSlotChange}
        ></slot>
      </div>`
    : host.showModeSelection
      ? html`<button
            class="util-theme util-btn"
            type="button"
            aria-label=${host.themeLabel}
            @click=${() =>
              host.dispatchEvent(
                new CustomEvent("tulpar-theme-toggle", { bubbles: true, composed: true }),
              )}
          >
            ${moonIcon}${sunIcon}
            <span class="util-text">${host.hasAttribute("data-dark") ? host.themeTextLight : host.themeTextDark}</span>
          </button>
          <slot
            name="utility-start"
            style="display:none"
            @slotchange=${host._onUtilityStartSlotChange}
          ></slot>`
      : html`<slot
          name="utility-start"
          style="display:none"
          @slotchange=${host._onUtilityStartSlotChange}
        ></slot>`;

  // Determine what to show in the "end" (right) cell:
  const endCell = host._hasUtilityEnd
    ? html`<div class="util-cell">
        <slot
          name="utility-end"
          @slotchange=${host._onUtilityEndSlotChange}
        ></slot>
      </div>`
    : host.showConfig
      ? html`<button
            class="util-config util-btn"
            type="button"
            aria-label=${host.configLabel}
            @click=${() =>
              host.dispatchEvent(
                new CustomEvent("tulpar-config-click", { bubbles: true, composed: true }),
              )}
          >
            ${gearIcon}
            <span class="util-text">${host.configText}</span>
          </button>
          <slot
            name="utility-end"
            style="display:none"
            @slotchange=${host._onUtilityEndSlotChange}
          ></slot>`
      : html`<slot
          name="utility-end"
          style="display:none"
          @slotchange=${host._onUtilityEndSlotChange}
        ></slot>`;

  // Determine whether the container should render at all.
  // Show it when any visible cell exists.
  const hasStart = host._hasUtilityStart || host.showModeSelection;
  const hasEnd = host._hasUtilityEnd || host.showConfig;
  if (!hasStart && !hasEnd) {
    return nothing;
  }

  return html`<div class="utility">${startCell}${endCell}</div>`;
}
