# Selection Family — Unified Playground Spec (ng + vue)

**Status:** Draft for approval
**Date:** 2026-06-18
**Scope:** The 4 selection demo pages (`Switch`, `Checkbox`, `RadioGroup`, `CheckboxGroup`) in BOTH `playground-ng` and `playground-vue`. This spec is the single source of truth — every section below is built **identically** in both frameworks (same order, same titles, same examples, same compositions). No per-framework improvisation.

## Design language (do NOT reinvent)
Reuse the existing `ButtonDemo` scaffolding verbatim: `.demo-page` → `.page-header` (`.page-tag` + `.page-title` + `.page-lede`) → numbered `.doc-section`s each with `.section-title`, `.section-desc` (with `.inline-code`), a `.preview` block, and a `<pre class="code">` snippet, closing with a real-world `.composition`. Same scoped styles, same spacing, same enterprise tone. The componentry on display is the v0.10 selection family.

## Cross-cutting rules (apply to every page)
1. **Prop AND slot, both shown.** Every content capability is demonstrated in BOTH forms, side by side, in a dedicated "Props vs slots" section:
   - `label` — `label="…"` prop AND `<span slot="label">…</span>`.
   - `description` — `description="…"` prop AND `<span slot="description">…</span>`.
   - Switch icons — `:icon-on`/`:icon-off` (Vue) / `[iconOn]`/`[iconOff]` (ng) component props AND `<svg slot="icon-on">`/`<svg slot="icon-off">`.
   - Checkbox icon — `:icon`/`[icon]` prop AND `<svg slot="icon">`.
2. **Colors actually applied.** Vue: bind colors (`:on-color="'otuken'"`, `:off-color`, `:color`) — NEVER static `on-color="…"` (Vue treats `on*` as an event). ng: `[onColor]`, `[offColor]`, `[color]`. Show brand default + 3–4 design-system color overrides per control.
3. **Code snippets match the rendered preview exactly** (copy-paste-correct for that framework).
4. **Every interactive example is wired** with a signal (ng) / ref (vue) so two-way binding visibly works.
5. **No raw/broken glyphs.** Verify each radio shows a single clean dot (no stray clusters), each checkbox a clean check/dash, each switch a clean thumb. (Investigate + fix the reported "cluster of black dots" — likely a card-grid radio or a broken icon slot; confirm in-browser.)

---

## Page 1 — Switch (`/switch`)
Tag: "Core" · Title: "Switch" · Lede: immediate on/off toggle; loading, icons, per-state color.

Sections (identical both frameworks):
1. **Sizes** — xs–xl row, `size` prop, all checked.
2. **Label position** — `start` vs `end` (label-position prop).
3. **Props vs slots — label & description** — two rows: (a) `label`/`description` props; (b) `<span slot="label">`/`<span slot="description">`. Both render identically.
4. **States** — checked / disabled (on+off) / readonly / required+invalid (`error-text`). label-prop based.
5. **Loading (async)** — a button toggles `loading=true`, then after ~1.2 s sets `checked` + clears `loading` (real revert-then-commit). Show the script.
6. **Icons — show-icon + custom (prop AND slot)** — (a) `show-icon` default check/cross; (b) custom via PROP (`:icon-on=Sun` / `:icon-off=Moon`); (c) custom via SLOT (`<svg slot="icon-on">`). All three render.
7. **Color — on-color / off-color (bound)** — brand default + amber/forest/danger overrides, BOUND syntax. Icon color follows track color.
8. **In context** — a real Settings card (4 rows, label+description each, independent state).

## Page 2 — Checkbox (`/checkbox`)
Tag: "Core" · Title: "Checkbox".

1. **Sizes** — xs–xl.
2. **Props vs slots — label & description** — both forms.
3. **States** — checked / disabled / disabled-checked / readonly / required+invalid (error-text).
4. **Indeterminate + select-all** — an external parent checkbox whose `checked`/`indeterminate` derives (computed/signal) from a value array driving N child checkboxes; toggling parent selects/clears all. Fully wired.
5. **Custom icon (prop AND slot)** — (a) `:icon=Star` prop; (b) `<svg slot="icon">` heart. Both render; the indeterminate dash is never overridden.
6. **Color** — checked-fill brand default + 3–4 overrides (`:color` bound).
7. **Card variant** — single card + a responsive grid of selectable cards (title via label + supporting line via description), selected = tinted+border+lift. Verify the card radio/checkbox glyph is clean.
8. **In context** — a permissions matrix (groups of checkboxes with a select-all per group).

## Page 3 — RadioGroup (`/radio-group`)
Tag: "Core" · Title: "RadioGroup" (radios shown inside the group).

1. **Basic** — vertical group, `value` two-way, 3 radios (label prop).
2. **Props vs slots — radio label & description** — `<tulpar-radio label/description>` props AND `<span slot="label/description">`.
3. **Sizes** — group `size` propagates xs–xl.
4. **Orientation** — vertical vs horizontal.
5. **Group label + description** — group legend via `label`/`description` prop AND via `<span slot="label/description">` (group-level).
6. **States** — group disabled / required+invalid (error-text) / individual radio disabled.
7. **Card variant — plan picker** — 3–4 selectable cards (title + description + optional badge), arrow-key navigable. Verify clean single dots (no clusters).
8. **Color** — group-level `color` + per-radio override.
9. **Keyboard** — a short doc table (Arrow ↑↓←→ roving, Home/End, disabled skipped).
10. **In context** — notification-frequency settings composition.

## Page 4 — CheckboxGroup (`/checkbox-group`)
Tag: "Core" · Title: "CheckboxGroup".

1. **Basic** — `value: string[]` two-way; live `value` display.
2. **Props vs slots — checkbox label & description** — both forms.
3. **Sizes** — group size propagates.
4. **Orientation** — vertical vs horizontal.
5. **Select-all parent recipe** — an external indeterminate parent OUTSIDE the group, derived from `value.length` vs child count; wired both directions.
6. **Group label + description** — prop AND slot (group-level).
7. **States** — group disabled / required+invalid / individual disabled.
8. **Card grid** — responsive selectable card grid (feature/report-column picker).
9. **Color** — group + per-item.
10. **In context** — a multi-select filter panel with a live count + clear-all.

---

## Routing & menu (parity)
Both playgrounds expose the 4 pages under a **"Selection"** sidenav section, in this order: Switch, Checkbox, RadioGroup, CheckboxGroup. Same icons (toggle / check-square / circle-dot / list-checks). Routes `/switch`, `/checkbox`, `/radio-group`, `/checkbox-group`.

## Build & verify
- ng: `[(checked)]`/`[(value)]` signals; vue: `v-model`. Code snippets framework-correct.
- After building EACH page, run headless Playwright on both playgrounds: screenshot every section, confirm (a) slot AND prop label/description render, (b) colors apply, (c) icons (prop + slot) render, (d) no stray glyph clusters, (e) loading/select-all/two-way all work. Fix before claiming done. `/frontend-design` quality pass per page.
- `pnpm --filter playground-ng build` + `pnpm --filter playground-vue build` must compile; `pnpm lint`; `pnpm format:check`.

## Open verification item
The "cluster of black dots" inside some radios (user-reported): reproduce in-browser, identify (likely card-variant radio dot or a mis-rendered slot), and fix as part of Page 3 (and anywhere else it appears).
