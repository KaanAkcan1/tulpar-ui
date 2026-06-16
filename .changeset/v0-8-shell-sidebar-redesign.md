---
"@tulpar-ui/tokens": minor
"@tulpar-ui/core": minor
"@tulpar-ui/shell": minor
"@tulpar-ui/angular": minor
"@tulpar-ui/vue": minor
---

Shell sidebar redesign: lit-pill active state, new `tulpar-nav-section` grouping element, richer nav-items (`count`/`dot`/`dot-label`/`kbd`), sidenav `position` (left/right), `density` (comfortable/compact), `single-expand` accordion, rail overflow fix, and new `header-actions`/`search`/`utility-start`/`utility-end`/`footer` slots. Angular and Vue wrappers gain `TulparNavSection`, the new sidenav inputs/props, and the additional nav-item inputs/props. No primitive token values changed.

Sidebar is now self-contained and prop-driven (the package does the work — minimal consumer code):

- Built-in toggle button + brand in the sidenav header (default Tulpar mark + themed `currentColor` wordmark; override via `toggle-icon`/`brand` slots).
- Data-driven menu icons: `TulparNavItemData.icon` accepts an SVG string (core); wrappers also accept a framework icon **component** (lucide-angular `Type` / lucide-vue-next `Component`).
- Built-in utility row: `show-mode-selection` (default on; theme toggle emits `tulpar-theme-toggle`, the shell flips dark — zero app wiring) and `show-config` + `config-text` (emits `config`).
- Built-in account block: `show-account-block`, `user-name`, `user-role`, `profile-image` (initials fallback), `show-settings`, `show-logout` with `settings`/`logout` events; settings + logout actions on the right (non-rail).
- Shell `sidenav-layout` (`under-topbar` default / `over-topbar`) and a floating reopen button when the sidenav is fully hidden.
- Rail fixes: header collapses to the toggle only, theme toggle is icon-only, and the hover flyout escapes the clipped nav. A11y labels (`toggle-label`, `theme-label`, `config-label`, `settings-label`, `logout-label`) are overridable; slots remain as escape hatches for heavy customization.
