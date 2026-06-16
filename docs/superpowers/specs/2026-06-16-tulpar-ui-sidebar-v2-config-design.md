# Tulpar UI — Sidebar v2: Self-Contained Config API + Layout + Rail Fixes

**Status:** Design (approved direction, pending spec review)
**Date:** 2026-06-16
**Owner:** Kaan Akcan
**Branch:** continues on `feat/v0.8-shell-sidebar-redesign` (open PR, not yet merged)
**Builds on:** [`2026-06-16-tulpar-ui-v0.7-shell-sidebar-redesign-design.md`](2026-06-16-tulpar-ui-v0.7-shell-sidebar-redesign-design.md)

---

## 1. Summary

The v0.8 sidebar works but its consumption is verbose: the playground hand-builds the brand header, the menu icons (slotted inline SVG), the utility row, and the user block. The owner wants the **package to do the work** — a clean, prop-driven (input → output) API where the consumer sends data and gets a finished, polished sidebar, with slots only as an escape hatch for heavy customization. This iteration also adds a topbar-placement layout mode, a floating reopen button, and fixes three rail bugs.

**Driving principle:** *Normal usage = clean props + events. Heavy customization = slots. The consumer should not have to write markup for the common case.*

### Approved decisions

| Topic | Decision |
|---|---|
| Built-in toggle button | Lives **inside** `tulpar-sidenav` (not the topbar). Default icon = Tulpar brand mark; overridable. |
| Brand/wordmark | Rendered beside the toggle; default = Tulpar wordmark; overridable. |
| Menu | `items` array; **icons travel in the data** (no slotted SVG for the common case). |
| Utility row | Built-in, prop-gated: `show-mode-selection` (default true), `show-config` (default false) + `config-text`. |
| Account block | Built-in, prop-gated: `show-account-block` (default true); `user-name`/`user-role`/`profile-image`; `show-settings` (default false), `show-logout` (default true); settings + logout buttons on the right (non-rail). |
| Theme toggle | Built-in; emits `tulpar-theme-toggle`; **shell flips `dark`** (zero app wiring). Icon syncs via the `.dark` class (CSS). |
| Layout | Shell prop `sidenav-layout="under-topbar" \| "over-topbar"`, default `under-topbar`. |
| Floating reopen | When the sidenav is fully hidden, the **shell** renders a high-z-index toggle button at the screen's top-left, animated. |
| Branch | Same `feat/v0.8-shell-sidebar-redesign`. |

---

## 2. Binding constraints (carried from v0.8)

- **Never change a primitive color value** in `packages/tokens/src/primitive/color.ts`. Re-bind shell semantic tokens to existing primitives or add new tokens resolving to an existing primitive / `rgba()` of one. **Zero invented hex.**
- Component CSS uses semantic `var(--tulpar-shell-…, fallback)` only (no primitive tokens; ESLint enforces); fallbacks mirror resolved primitives.
- Angular wrappers are **signals-only** (no RxJS). Vue wrappers are SFCs.
- Slots remain as escape hatches; props sit *on top of* slots, never replace them (a provided slot overrides the built-in render).

---

## 3. `tulpar-nav-item` — icon in data

The common case must not require slotted SVG. Add an `icon` field that travels in the item data.

- **Core WC** `TulparNavItemData.icon?: string` — raw SVG markup, rendered via Lit `unsafeSVG` into the existing icon position. Universal (Storybook, plain HTML).
  - Security note: `unsafeSVG` trusts the string. Document that `icon` must be author-controlled markup, not user input. (Menu definitions are developer data, so this is acceptable; call it out.)
  - Bundle note: importing `unsafeSVG` into `tulpar-nav-item` (the highest-instance-count element) adds one Lit directive; render it only when `icon` is a string so the directive isn't exercised needlessly.
- The existing `slot="icon"` and `icon-class` paths remain (escape hatches / icon-font usage).
- Existing `count`/`dot`/`kbd`/`badge`/external affordances unchanged.

The richer per-framework icon ergonomics (passing a component) live in the wrappers (§7), not the core.

---

## 4. `tulpar-sidenav` — self-contained, prop-driven API

`tulpar-sidenav` renders a complete sidebar from props. Each built-in region has a slot escape hatch; a provided slot overrides that region's built-in render.

### 4.1 Header: built-in toggle + brand

- **Built-in toggle button** in the header. Emits `tulpar-menu-toggle` (reusing the existing shell-handled event, so the shell's collapse/overlay logic works unchanged). Carries an `aria-label` (default "Toggle navigation", override `toggle-label`) and `aria-expanded` (see state-sync contract below).
  - **State-sync contract for `aria-expanded`:** the collapsed/open state lives on the **shell** (`sidenavCollapsed` / `sidenavOpen`), and rail state already round-trips to the sidenav via `data-rail` (`_updateRailAttr`). Extend the shell to reflect the not-rail collapse/open state onto the slotted sidenav the same way — reflect **`data-collapsed`** (static collapsed) and **`data-open`** (overlay open) onto the slotted `[slot="sidenav"]` element. The sidenav derives `aria-expanded` from these (expanded = visible/not-collapsed; for overlay, expanded = open). This is the only added state channel; no new public props.
  - Default icon = inline Tulpar **brand mark** SVG. Override via `slot="toggle-icon"` (core) / `toggleIcon` component (wrappers).
- **Brand/wordmark** beside the toggle. Default = inline Tulpar **wordmark**. Override via `slot="brand"` (core) / `brand` (wrappers).
  - Trade-off (accepted): the WC ships Tulpar's own mark + wordmark as defaults (this is the reference shell); external consumers override. Keep the inlined SVGs minimal.
  - **Theming the inlined defaults (resolves the prior spec's dark-mode wordmark issue):** the default **wordmark** SVG MUST use `fill="currentColor"` (the sidenav inherits `--tulpar-shell-sidenav-fg`, which is dark text in light mode / light text in dark mode) — NOT a baked `#07291F`. The default **brand mark** (three ascending strokes) keeps its brand greens: it is logo artwork (an asset), not themeable UI chrome, and green reads on both light and dark — so it is exempt from the token rule. No hex is baked into themeable text.
- The existing `slot="header"` remains as a full-header override (wins over the built-in toggle+brand). **When `slot="header"` is provided, the built-in toggle button — and therefore its `tulpar-menu-toggle` emitter — is NOT rendered;** the consumer is responsible for providing their own toggle affordance (this interacts with the overlay/hidden reopen affordance in §5.2, which is shell-rendered and independent of the header slot).
- **Rail (B1 fix):** in rail, the header collapses to **only the toggle button** (brand mark); the wordmark/brand is hidden — no overflow.

### 4.2 Menu

- `items` array (data-driven), each item may carry `icon` (§3). Recursive sections (`type: "section"`) and groups as in v0.8. Auto-rendered.
- Slotted children remain supported (escape hatch).

### 4.3 Utility row (built-in, prop-gated)

- `show-mode-selection` (boolean, default **true**) → renders the Dark/Light toggle. On click emits `tulpar-theme-toggle`. The icon (moon/sun) swaps purely via the ancestor `.dark` class (CSS) — no state in the sidenav. a11y label default "Toggle color theme" (override `theme-label`).
- `show-config` (boolean, default **false**) → renders the Config button. `config-text` (string, default "Configure") sets the label. On click emits `tulpar-config-click`. a11y label override `config-label`.
- The utility row container renders only if at least one of the two is enabled.
- **Rail (B2 fix):** in rail, the mode toggle is **icon-only** (text hidden); the config cell is hidden (as in v0.8 `utility-end`).
- Escape hatch: existing `utility-start` / `utility-end` slots override the built-in cells when provided.

### 4.4 Account block (built-in, prop-gated)

- `show-account-block` (boolean, default **true**) → renders the block.
- `user-name` (string) → name line (rendered when present; if absent, the name line is omitted — graceful empty state, just avatar + buttons).
- `user-role` (string) → secondary line below the name (rendered when present).
- `profile-image` (string URL) → avatar image; when absent, initials are derived from `user-name` (e.g. "Kaan Akcan" → "KA"); when neither present, a neutral placeholder.
- On the right, in order: **settings** then **logout** buttons (rendered only when NOT rail).
  - `show-settings` (boolean, default **false**) → settings button. Emits `tulpar-settings-click`. Click is a **no-op placeholder** for now (panel designed later). Default gear icon, overridable via `slot="settings-icon"` / `settingsIcon`. a11y label override `settings-label`.
  - `show-logout` (boolean, default **true**) → logout button. Emits `tulpar-logout`. Default log-out icon, overridable via `slot="logout-icon"` / `logoutIcon`. a11y label override `logout-label`.
- **Rail:** account block collapses to the avatar only (settings/logout hidden).
- Escape hatch: existing `slot="footer"` overrides the built-in account block when provided.

### 4.5 Events (emitted by `tulpar-sidenav`, bubbling + composed)

| Event | Trigger | Handled by |
|---|---|---|
| `tulpar-menu-toggle` | built-in toggle button | shell (collapse/overlay) |
| `tulpar-theme-toggle` | mode-selection control | **shell** (flips `dark`) |
| `tulpar-config-click` | config button | app (wrapper output) |
| `tulpar-settings-click` | settings button | app (no-op for now) |
| `tulpar-logout` | logout button | app (wrapper output) |

### 4.6 Carried-over v0.8 props

`position` (left/right), `density` (comfortable/compact), `single-expand`, `nav-label` remain.

### 4.7 Rail flyout (B3 fix)

Root cause: v0.8 added `overflow-x: clip` to the scrollable `nav` to kill the rail horizontal scrollbar — but that **clips the rail hover flyouts**, so they don't appear.

Fix: the flyout must **escape the clipped scroll container**. Render the rail flyout in the top layer / detached from the clipped flow — via the `popover` API or `position: fixed` with JS positioning anchored to the focused/hovered item (computed on `pointerenter`/`focus`), with a high stacking context. Keep `overflow-x: clip` (scrollbar fix stays). Flyout direction respects `position` (left/right). Keyboard-reachable (shows on focus). Falls back gracefully where `popover` is unsupported (fixed-position path).
- **Reposition/dismiss on scroll/resize:** with `position: fixed`/JS anchoring, the flyout must reposition or dismiss when the `nav` scrolls or the window resizes (otherwise it detaches from a scrolled-away item). Hide on `pointerleave`/`blur`/scroll; recompute on reopen.

---

## 5. Shell — `sidenav-layout` + floating reopen

### 5.1 `sidenav-layout` (shell prop)

`@property sidenav-layout: "under-topbar" | "over-topbar"` (reflected), default `"under-topbar"`.

- `under-topbar` (current): grid `"topbar topbar" / "sidenav content"` — topbar full width on top, sidenav below.
- `over-topbar`: grid `"sidenav topbar" / "sidenav content"` — sidenav spans full height from the top; topbar only above the content column. Footer behavior: the shell `footer` area spans the content column (not under the sidenav) in over-topbar; under-topbar keeps full-width footer. (Both are grid-only changes; no new colors.)
- Combine correctly with `data-sidenav-position="right"` (mirror the columns/areas).
- **z-index:** existing `z` tokens already place sidenav (200) above topbar (100), so in `over-topbar` the full-height sidenav paints over the topbar's left edge correctly — no z-index rework expected; verify the topbar/sidenav corner (no shadow seam) during implementation.

### 5.2 Floating reopen button (B4)

When there is **no visible affordance to open the sidenav**, the **shell** renders a floating reopen button. Two cases qualify:
1. **Static + collapsed** (the `--_sidenav-col: 0` / `display:none` case, `tulpar-shell.styles.ts:76-81`).
2. **Overlay/mobile + closed** — the sidenav (and its built-in toggle) is off-screen, and the topbar menu button is **opt-in** (`showMenuButton` default `false`), so without this there is no reopen affordance. The floating button covers that gap.

Behavior:
- Top-left of the shell, **high z-index** (above topbar/content/overlay scrim), animated in (slide/fade) and out; honors `prefers-reduced-motion`.
- Shows the same toggle affordance (Tulpar brand mark by default); on click emits `tulpar-menu-toggle` → sidenav reopens (slides back / overlay opens).
- Works in both `under-topbar` and `over-topbar`.
- Does **not** appear in **rail** mode (the rail toggle is always visible), nor when the sidenav is currently visible/open.
- It is shell-rendered and independent of the sidenav's `slot="header"` override, so it remains available even if the consumer replaces the built-in header toggle.

### 5.3 Shell event handling

The shell already handles `tulpar-menu-toggle`. Add handling for **`tulpar-theme-toggle`**: flip `this.dark` (reusing the existing `updated()` view-transition path). `tulpar-config-click` / `tulpar-settings-click` / `tulpar-logout` bubble through to the app (not consumed by the shell).

---

## 6. Rail bug fixes (summary)

- **B1** — rail header shows only the toggle button (brand mark); wordmark/brand hidden; no overflow. (§4.1)
- **B2** — rail mode toggle is icon-only; config hidden. (§4.3)
- **B3** — rail flyout escapes the `overflow-x: clip` container and renders above content. (§4.7)
- **B4** — floating reopen button when hidden. (§5.2)

---

## 7. Wrappers (Angular signals / Vue)

Expose the new API as idiomatic props/inputs + outputs, and add the per-framework icon ergonomics.

### Angular (`@tulpar-ui/angular`, signals only)
- Sidenav inputs: `showModeSelection`, `showConfig`, `configText`, `showAccountBlock`, `userName`, `userRole`, `profileImage`, `showSettings`, `showLogout`, plus a11y label inputs and `toggleIcon`/`brand`/`settingsIcon`/`logoutIcon`.
- **Icon-as-component**: `TulparNavItemData.icon?: string | Type<unknown>`. The wrapper renders a `Type` via `NgComponentOutlet` into the nav-item's `slot="icon"`; a `string` passes through as the core `icon` attribute. Enables `{ label:"Button", href:"/button", icon: Square }` with `lucide-angular`.
- Outputs: `(config)`, `(settings)`, `(logout)` from the corresponding events. (Theme is shell-handled; no app output needed.)

### Vue (`@tulpar-ui/vue`)
- Sidenav props mirroring the above; emits `config`, `settings`, `logout`.
- **Icon-as-component**: `icon?: string | Component`. The wrapper renders a component via `<component :is>` into `slot="icon"`; a string passes through. Enables `{ label:"Button", href:"/button", icon: Square }` with `lucide-vue-next`.

---

## 8. Playgrounds — prove the clean DX

Rewrite both playground shells to the prop-driven API:
- Remove hand-built brand header markup → rely on built-in brand defaults (or one `brand` override).
- Replace verbose slotted-SVG menu with a single `items` array carrying `icon` components (lucide).
- Remove the hand-built utility row and user block → use `show-mode-selection` / `show-config` / `config-text` and `show-account-block` / `user-name` / `user-role` / `show-settings` / `show-logout`, wiring `@config`/`@logout` (and theme handled by shell).
- The result should be markedly less code than the current `App.vue` / `app.ts`. This is the acceptance signal for "the package does the work."
- Add `sidenav-layout` to the settings aside (dogfood under/over). Keep the shell footer (separate from the account block).

---

## 9. Out of scope

- `top` / `bottom` (horizontal) layout.
- Real Configurator panel and Settings panel internals (buttons emit; panels later).
- A bundled Tulpar icon set (consumers bring their own lucide).
- Second brand theme, RTL flyout-mirroring polish.

---

## 10. Testing

- **Core** (`@web/test-runner`): nav-item `icon` SVG renders; sidenav built-in toggle emits `tulpar-menu-toggle` + `aria-expanded`; theme toggle emits `tulpar-theme-toggle`; config/settings/logout emit their events; account block initials-from-name + image; prop gating (`show-*`) renders/omits regions; slot overrides win; rail collapses header/utility/account correctly (B1/B2); flyout escapes clip (B3). Shell: `sidenav-layout` grid swap; floating reopen appears only when hidden and emits toggle (B4); shell handles `tulpar-theme-toggle`.
- **Tokens**: any new token re-bindings snapshot-tested (no primitive value change).
- **Wrappers**: smoke tests for new inputs/outputs + icon-as-component rendering into `slot="icon"`.
- **Visual**: both playgrounds (light/dark, under/over, static/rail/overlay, left/right) + Storybook.
