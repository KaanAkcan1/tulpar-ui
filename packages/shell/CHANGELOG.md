# @tulpar-ui/shell

## 0.7.0

### Minor Changes

- 1c637cb: Shell sidebar redesign: lit-pill active state, new `tulpar-nav-section` grouping element, richer nav-items (`count`/`dot`/`dot-label`/`kbd`), sidenav `position` (left/right), `density` (comfortable/compact), `single-expand` accordion, rail overflow fix, and new `header-actions`/`search`/`utility-start`/`utility-end`/`footer` slots. Angular and Vue wrappers gain `TulparNavSection`, the new sidenav inputs/props, and the additional nav-item inputs/props. No primitive token values changed.

  Sidebar is now self-contained and prop-driven (the package does the work — minimal consumer code):
  - Built-in toggle button + brand in the sidenav header (default Tulpar mark + themed `currentColor` wordmark; override via `toggle-icon`/`brand` slots).
  - Data-driven menu icons: `TulparNavItemData.icon` accepts an SVG string (core); wrappers also accept a framework icon **component** (lucide-angular `Type` / lucide-vue-next `Component`).
  - Built-in utility row: `show-mode-selection` (default on; theme toggle emits `tulpar-theme-toggle`, the shell flips dark — zero app wiring) and `show-config` + `config-text` (emits `config`).
  - Built-in account block: `show-account-block`, `user-name`, `user-role`, `profile-image` (initials fallback), `show-settings`, `show-logout` with `settings`/`logout` events; settings + logout actions on the right (non-rail).
  - Shell `sidenav-layout` (`under-topbar` default / `over-topbar`) and a floating reopen button when the sidenav is fully hidden.
  - Rail fixes: header collapses to the toggle only, theme toggle is icon-only, and the hover flyout escapes the clipped nav. A11y labels (`toggle-label`, `theme-label`, `config-label`, `settings-label`, `logout-label`) are overridable; slots remain as escape hatches for heavy customization.

- bc1b23f: Sidebar fixes + rail flyout:
  - Rail mode now reveals a nav group's children via an enterprise flyout submenu
    (hover-intent + click-to-pin, safe-grace close, single-open, keyboard + Disclosure
    ARIA, caret, reduced-motion aware). Inline expansion is suppressed but preserved
    across rail toggles.
  - Theme toggle shows the target mode ("Dark" in light, "Light" in dark) via new
    overridable `theme-text-dark` / `theme-text-light` props; icon + text driven by a
    single `data-dark` signal.
  - Group items now detect children through framework wrappers (fixes Angular groups
    rendering always-expanded with no chevron).
  - Group-item label now sits flush against its icon.
  - New tokens: `--tulpar-shell-sidenav-flyout-bg/-border/-header-fg/-divider`,
    `--tulpar-shell-sidenav-rail-cue`, `--tulpar-shadow-sm/-md/-flyout`, `--tulpar-easing-decelerate`
    (the `shadow-sm/-md` + `easing-decelerate` also resolve previously-dangling references in
    component CSS).

- 5562a36: Built-in sidenav search with live menu filtering:
  - New `show-search` prop (default true; hidden in rail) renders a built-in search
    field that filters the navigation as you type — matching items stay, groups
    with a matching child auto-expand, empty sections hide, and clearing the query
    restores the prior state (including group expansion). A `[slot="search"]` child
    still overrides the built-in field.
  - `Cmd/Ctrl+K` focuses the search; `Esc` clears it; a `tulpar-search` event emits
    the query. New props: `search-placeholder`, `search-label`, `search-empty-text`.
  - Forwarded through the Angular (`showSearch`/`searchPlaceholder`/`searchLabel`/
    `searchEmptyText`) and Vue wrappers.

## 0.6.0

### Minor Changes

- cff45f4: feat: application shell family (tulpar-shell, tulpar-topbar, tulpar-sidenav, tulpar-nav-item) + shell tokens + Angular/Vue wrappers

  Adds the @tulpar-ui/shell package — an enterprise app-layout family (CSS Grid shell with static/overlay/rail sidenav modes, mobile breakpoint, scrim, aside panel, skip-link, dark-mode View Transitions, keyboard nav) plus shell semantic tokens, opt-in localStorage persistence, and idiomatic Angular (signal-based, router bridge) and Vue (router bridge) wrappers.
