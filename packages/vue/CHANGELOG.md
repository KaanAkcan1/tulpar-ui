# @tulpar-ui/vue

## 0.7.0

### Minor Changes

- b2e35ab: Overlay family: three new public custom elements — `<tulpar-tooltip>` (brief
  text, hover/focus, WCAG 1.4.13 hoverable/dismissible/persistent, inverted chip),
  `<tulpar-toggletip>` (click-triggered, touch-safe, live-region announced), and
  `<tulpar-popover>` (non-modal dialog for rich/interactive content, focus moves in
  on open, light-dismiss, focus returns to trigger) — all built on a shared,
  package-private positioning primitive (JS-primary flip/shift core with native
  Popover API enhancement). **Composition is the directive + `for`-id model, never
  slot-wrap**: the overlay and its trigger are separate nodes and the overlay
  references the trigger by id (`<tulpar-tooltip for="id">`), so "a tooltip on a
  button" never inverts into "a button inside a tooltip". New overlay tokens
  (neutral + inverted-tooltip surfaces, overlay shadow ramp, `--tulpar-z-overlay`,
  motion delays/durations) and a semantic `tone` prop on toggletip/popover
  (`neutral | info | success | warning | danger`) mapped to conventional status
  hues (info = blue, success = green, warning = amber, danger = red), with the §7
  tone × mode contrast matrix asserted in CI. Angular ships
  `tulparTooltip`/`tulparToggletip`/`tulparPopover` (inline) + `…Ref` (reference)
  directives with signal `open` + `openChange`; Vue ships `v-tulpar-tooltip` /
  `v-tulpar-toggletip` / `v-tulpar-popover-ref` directives + `TulparPopover` with
  `v-model:open`.

  **Button DOM-contract change:** the Button `tooltip` attribute now renders a real
  accessible `<tulpar-tooltip>` via `for`-id (hoverable / dismissible / persistent —
  WCAG 1.4.13) instead of the old CSS-only span; the static `#tulpar-btn-tooltip`
  span is **removed**. The `tooltip` attribute itself is unchanged (lazy/conditional
  wiring — Button users who never set it pay no overlay cost), but consumers that
  targeted the internal `#tulpar-btn-tooltip` node directly must update.

- 1c637cb: Shell sidebar redesign: lit-pill active state, new `tulpar-nav-section` grouping element, richer nav-items (`count`/`dot`/`dot-label`/`kbd`), sidenav `position` (left/right), `density` (comfortable/compact), `single-expand` accordion, rail overflow fix, and new `header-actions`/`search`/`utility-start`/`utility-end`/`footer` slots. Angular and Vue wrappers gain `TulparNavSection`, the new sidenav inputs/props, and the additional nav-item inputs/props. No primitive token values changed.

  Sidebar is now self-contained and prop-driven (the package does the work — minimal consumer code):
  - Built-in toggle button + brand in the sidenav header (default Tulpar mark + themed `currentColor` wordmark; override via `toggle-icon`/`brand` slots).
  - Data-driven menu icons: `TulparNavItemData.icon` accepts an SVG string (core); wrappers also accept a framework icon **component** (lucide-angular `Type` / lucide-vue-next `Component`).
  - Built-in utility row: `show-mode-selection` (default on; theme toggle emits `tulpar-theme-toggle`, the shell flips dark — zero app wiring) and `show-config` + `config-text` (emits `config`).
  - Built-in account block: `show-account-block`, `user-name`, `user-role`, `profile-image` (initials fallback), `show-settings`, `show-logout` with `settings`/`logout` events; settings + logout actions on the right (non-rail).
  - Shell `sidenav-layout` (`under-topbar` default / `over-topbar`) and a floating reopen button when the sidenav is fully hidden.
  - Rail fixes: header collapses to the toggle only, theme toggle is icon-only, and the hover flyout escapes the clipped nav. A11y labels (`toggle-label`, `theme-label`, `config-label`, `settings-label`, `logout-label`) are overridable; slots remain as escape hatches for heavy customization.

- 9e6e689: Selection family: five new public custom elements — `<tulpar-switch>` (async loading, thumb icons, per-state color), `<tulpar-checkbox>` (indeterminate, card variant, custom icon), `<tulpar-radio>` (card variant), `<tulpar-radio-group>` (WAI-ARIA roving tabindex, arrow navigation, value propagation), and `<tulpar-checkbox-group>` (string[] value, group change event, select-all via indeterminate API). Backed by two new unexported internal bases (`SelectionControlBase`, `SelectionGroupBase`). Angular and Vue wrappers ship signal-based / v-model-ready counterparts for all five elements. No breaking changes to existing surface.
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

### Patch Changes

- a27c42a: Button enterprise polish: surface physics, motion, press feedback, focus clarity, semantic disabled, radius scale, premium light, reflow-safe loading.
- Updated dependencies [b2e35ab]
- Updated dependencies [1c637cb]
- Updated dependencies [9e6e689]
- Updated dependencies [a27c42a]
- Updated dependencies [bc1b23f]
- Updated dependencies [5562a36]
  - @tulpar-ui/core@0.7.0
  - @tulpar-ui/shell@0.7.0

## 0.6.0

### Minor Changes

- cff45f4: feat: application shell family (tulpar-shell, tulpar-topbar, tulpar-sidenav, tulpar-nav-item) + shell tokens + Angular/Vue wrappers

  Adds the @tulpar-ui/shell package — an enterprise app-layout family (CSS Grid shell with static/overlay/rail sidenav modes, mobile breakpoint, scrim, aside panel, skip-link, dark-mode View Transitions, keyboard nav) plus shell semantic tokens, opt-in localStorage persistence, and idiomatic Angular (signal-based, router bridge) and Vue (router bridge) wrappers.

### Patch Changes

- Updated dependencies [cff45f4]
  - @tulpar-ui/core@0.6.0
  - @tulpar-ui/shell@0.6.0

## 0.5.0

### Minor Changes

- 36f7dc4: Input family: three new public custom elements (`<tulpar-text-input>`,
  `<tulpar-textarea>`, `<tulpar-number-input>`) sharing an internal
  FormFieldBase. Signal-based Angular wrappers and v-model Vue wrappers
  included, plus full Storybook coverage and menu-driven playground demos.

  Differentiators baked in: async `validating` state, copy/paste
  affordances with visual confirmation, layout-shift-safe message row,
  integrated mask engine with case-forcing token alphabet (A/a/L/9/S/\*),
  five label positions including PrimeNG-style float ("over"), and a
  hybrid Intl.NumberFormat API (shorthand attributes + full
  `.formatOptions` property).

  See `docs/migration/v0.4-to-v0.5.md` for usage examples and the
  deferred-items list.

### Patch Changes

- Updated dependencies [36f7dc4]
  - @tulpar-ui/core@0.5.0

## 0.1.1

### Patch Changes

- **Breaking change to `@tulpar-ui/angular` `icon` input.** The `icon` prop on `<tulpar-button-ng>` now accepts an Angular component class (`Type<unknown>`) instead of `LucideIconData`. The wrapper no longer depends on `lucide-angular`. Consumers using `[icon]="<lucide data>"` must either:
  1. Switch to the slot pattern: `<tulpar-button-ng><lucide-angular slot="start" [img]="Check" /></tulpar-button-ng>`.
  2. Wrap their lucide icon in a small Angular component and pass that component to `[icon]`.

  **Install UX fixes:**
  - `@tulpar-ui/angular` no longer declares `lucide-angular` as a peer dependency — Angular 22 consumers can now `npm install @tulpar-ui/angular` without `--legacy-peer-deps`.
  - `@tulpar-ui/core` and `@tulpar-ui/tokens` moved from `peerDependencies` to `dependencies` in `@tulpar-ui/angular` and `@tulpar-ui/vue`, so npm pulls the full dependency graph automatically.

  Despite the breaking icon API change, this is released as a patch because v0.1.0 has zero external consumers (published ~1 hour earlier).

- Updated dependencies
  - @tulpar-ui/core@0.1.1

## 0.1.0

### Minor Changes

- Initial release of Tulpar UI v0.1.
  - @tulpar-ui/tokens: 3-layer token system (primitive → semantic → brand×mode), light/dark, default `tulpar` brand
  - @tulpar-ui/core: `<tulpar-button>` and `<tulpar-button-group>` (Lit 3, form-associated)
  - @tulpar-ui/angular: signal-based `<tulpar-button-ng>` wrapper
  - @tulpar-ui/vue: `<TulparButton>` SFC wrapper

### Patch Changes

- Updated dependencies
  - @tulpar-ui/core@0.1.0
