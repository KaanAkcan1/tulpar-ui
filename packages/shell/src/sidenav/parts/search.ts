import { html, nothing } from "lit";
import type { TulparSidenav } from "../tulpar-sidenav";

// Magnifier SVG icon
const searchIcon = html`<svg
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
  <circle cx="11" cy="11" r="8" />
  <line x1="21" y1="21" x2="16.65" y2="16.65" />
</svg>`;

/**
 * Renders the search region.
 *
 * Slot-vs-built-in precedence (mirrors the utility row):
 * - If a `[slot="search"]` child is present → render only that slot (the app owns
 *   the search UI); the built-in field is suppressed.
 * - Else if `showSearch` is true → render the built-in filter input.
 * - The whole region is omitted in rail mode and when neither source is present.
 */
export function renderSearch(host: TulparSidenav) {
  // Hidden entirely in rail (icon-only strip has no room; filtering is paused).
  if (host.hasAttribute("data-rail")) {
    return html`<slot
      name="search"
      style="display:none"
      @slotchange=${host._onSearchSlotChange}
    ></slot>`;
  }

  const showBuiltin = host.showSearch && !host._hasSearchSlot;
  if (!showBuiltin && !host._hasSearchSlot) {
    // Keep a hidden slot so slotchange still fires if content is added later.
    return html`<slot
      name="search"
      style="display:none"
      @slotchange=${host._onSearchSlotChange}
    ></slot>`;
  }

  const builtin = showBuiltin
    ? html`<div class="search-field" role="search">
        <span class="search-icon" aria-hidden="true">${searchIcon}</span>
        <input
          class="search-input"
          part="search-input"
          type="search"
          autocomplete="off"
          spellcheck="false"
          placeholder=${host.searchPlaceholder}
          aria-label=${host.searchLabel}
          .value=${host._query}
          @input=${host._onSearchInput}
          @keydown=${host._onSearchKeydown}
        />
      </div>`
    : nothing;

  return html`<div class="search">
    ${builtin}
    <slot
      name="search"
      style=${host._hasSearchSlot ? nothing : "display:none"}
      @slotchange=${host._onSearchSlotChange}
    ></slot>
  </div>`;
}
