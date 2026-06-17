import { html, nothing } from "lit";
import type { TulparSidenav } from "../tulpar-sidenav";
import { initials } from "../../_internal/initials";

// Gear / settings SVG icon
const settingsIcon = html`<svg
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

// Log-out SVG icon
const logoutIcon = html`<svg
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
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
  <polyline points="16 17 21 12 16 7" />
  <line x1="21" y1="12" x2="9" y2="12" />
</svg>`;

/**
 * Renders the account block at the bottom of the sidenav.
 *
 * Slot-vs-built-in precedence:
 * - If `[slot=footer]` child is present → render `<slot name="footer">`, no built-in.
 * - Else if `showAccountBlock` is false → render nothing (but keep a hidden detection
 *   slot so dynamic fill is caught).
 * - Else render the built-in `.account` block with avatar, meta, and action buttons.
 *
 * A hidden `<slot name="footer">` is always present in DOM (when built-in renders) so
 * that slotchange fires even when the consumer adds a footer child after first render.
 */
export function renderAccount(host: TulparSidenav) {
  // Footer slot override: consumer has placed a [slot=footer] child.
  if (host._hasFooterSlot) {
    return html`<div class="footer">
      <slot name="footer" @slotchange=${host._onFooterSlotChange}></slot>
    </div>`;
  }

  // Built-in suppressed — still keep a hidden slot for dynamic detection.
  if (!host.showAccountBlock) {
    return html`<slot
      name="footer"
      style="display:none"
      @slotchange=${host._onFooterSlotChange}
    ></slot>`;
  }

  // ── Avatar ───────────────────────────────────────────────────────────────
  const avatar = host.profileImage
    ? html`<img class="account-avatar-img" src=${host.profileImage} alt="" aria-hidden="true" />`
    : html`<span class="account-avatar" aria-hidden="true">${initials(host.userName)}</span>`;

  // ── Meta (name + role) ───────────────────────────────────────────────────
  const nameLine = host.userName
    ? html`<span class="account-name">${host.userName}</span>`
    : nothing;
  const roleLine = host.userRole
    ? html`<span class="account-role">${host.userRole}</span>`
    : nothing;
  const hasMeta = host.userName || host.userRole;

  // ── Action buttons ───────────────────────────────────────────────────────
  const settingsBtn = host.showSettings
    ? html`<button
        class="account-settings account-icon-btn"
        type="button"
        aria-label=${host.settingsLabel}
        @click=${() =>
          host.dispatchEvent(
            new CustomEvent("tulpar-settings-click", { bubbles: true, composed: true }),
          )}
      >
        <slot name="settings-icon">${settingsIcon}</slot>
      </button>`
    : nothing;

  const logoutBtn = host.showLogout
    ? html`<button
        class="account-logout account-icon-btn"
        type="button"
        aria-label=${host.logoutLabel}
        @click=${() =>
          host.dispatchEvent(new CustomEvent("tulpar-logout", { bubbles: true, composed: true }))}
      >
        <slot name="logout-icon">${logoutIcon}</slot>
      </button>`
    : nothing;

  const hasActions = host.showSettings || host.showLogout;

  return html`<div class="account">
    ${avatar} ${hasMeta ? html`<div class="account-meta">${nameLine}${roleLine}</div>` : nothing}
    ${hasActions ? html`<div class="account-actions">${settingsBtn}${logoutBtn}</div>` : nothing}
    <!-- Hidden detection slot so dynamic footer fill flips _hasFooterSlot -->
    <slot name="footer" style="display:none" @slotchange=${host._onFooterSlotChange}></slot>
  </div>`;
}
