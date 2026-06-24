# Tulpar UI — Component Roadmap

> **Living planning doc.** Records the ordered build plan from v0.12 (current) toward the
> AG-Grid-equivalent data grid (the terminal target), plus the component **gap analysis** that
> informed the ordering. Update as waves complete. Purpose: stop re-researching the landscape every
> planning session — the sequence and the "why" live here.

**Last updated:** 2026-06-24

---

## 1. Destination

- **Terminal target:** an **AG-Grid-equivalent data grid** — virtualization, column pin/resize/reorder,
  row grouping + aggregation, filtering, inline cell/row editing, export.
- **After the grid:** Gantt / Scheduler.
- **Principle (from `project_long_term_roadmap` memory):** primitives first; design primitive APIs so
  they don't block the Grid/Gantt later. Cheap-to-add-upfront, expensive-to-retrofit items:
  - compact size + bare/borderless appearance on inputs (grid cell editors)
  - density scale tokens (compact/comfortable/spacious) — grid row height builds on it
  - checkbox `indeterminate` (grid row selection) — **already shipped**
  - portal/teleport overlay engine (cells live in scroll containers) — **already shipped (v0.11)**
  - DatePicker is required before Gantt

---

## 2. Current state (shipped, as of v0.14)

| Family | Components | Version |
|---|---|---|
| Buttons | Button, ButtonGroup | v0.1–v0.4 |
| Inputs | TextInput, NumberInput, Textarea (shared `FormFieldBase` internal; soft `:focus-visible` ring added v0.14) | v0.5 |
| Selection | Checkbox, CheckboxGroup, Radio, RadioGroup, Switch | v0.10 |
| Overlay | Tooltip, Toggletip, Popover (+ `_internal/overlay` engine) | v0.11 |
| Feedback | Toast, Message (imperative service + `<tulpar-toaster>`) | v0.12 |
| Display & status | Tag, Badge, Chip, Avatar, Skeleton, Spinner, Progress (+ `_internal/tone`) | v0.13 |
| Data entry (Wave 2) | **Select** (`<tulpar-select>` + `<tulpar-option>` + `<tulpar-option-group>`; `_internal/listbox` foundation) | v0.14 |
| Shell | tulpar-shell, topbar, sidenav, nav-item | v0.6–v0.8 |
| Infra | 3-layer multi-brand tokens; conventional tone system `neutral/info/success/warning/danger/custom`; `_internal` layering rule; primitive-token lint; CI/CD; changesets | v0.6 |

---

## 3. Gap analysis (surveyed 2026-06-22)

**Libraries surveyed (12):** MUI/MUI-X · Ant Design · shadcn/ui · Radix · React Aria · Chakra ·
Mantine · Fluent UI v9 · Carbon · PrimeVue/PrimeNG · Element Plus · Vuetify.

"12'de" = how many of the 12 ship it (table-stakes signal). "Grid" = directly needed for the
AG-Grid destination. Tier: **A** = grid-critical/table-stakes · **B** = completeness · **C** = lower ·
**D** = niche/skip.

| Component | 12'de | Grid | Tier |
|---|---|---|---|
| Select / Combobox / MultiSelect | 12 / 11 / 11 | ✓✓ editor+filter | A |
| Date Picker (+time/range) | 12 | ✓✓ editor+filter | A |
| Menu / Dropdown (+Context menu) | 12 | ✓✓ header/right-click | A |
| Dialog / Modal (+service) | 12 | ✓ config/confirm | A |
| Progress (bar+circular) | 12 | ✓ | A |
| Spinner / Loader | 11 | ✓ | A |
| Skeleton | 11 | ✓ loading | A |
| Tag | 11 | ✓ cell/status | A |
| Badge | 11 | ✓ cell | A |
| Chip | 7 (Tag-merged elsewhere) | ✓ cell | A |
| Avatar | 11 | ✓ cell | A |
| Pagination | 11 | ✓✓ footer | A |
| Tabs | 12 | ✓ side panel | A |
| Slider (+range) | 12 | ○ range filter | B |
| Accordion / Collapse | 12 | ○ | B |
| Alert / Banner (in-page, static) | 10 | ○ | B |
| Drawer / Sheet | 11 | ○ | B |
| Tree / TreeView | 9 | ✓ grouping | B |
| Segmented control (SelectButton) | 11 | ○ | B |
| Breadcrumb · Stepper · Card · Divider | 11–12 | ○ | B |
| Tags-input · Pin/OTP · Rating · File upload | 6–9 | ○ | B/C |
| Color Picker · Timeline · Statistic · Descriptions · List · Empty/Result · HoverCard · Carousel · Scroll-area · Splitter | varies | ○ | C |
| **Skip (niche):** Command palette (2/12), Cascader, Transfer/PickList, Mentions, Knob, QR, OrgChart, Watermark | low | ✗ | D |

---

## 4. Wave plan (ordered — AG-Grid last)

- **Wave 1 — Display & status atoms** `[DONE — v0.13]`
  Tag · Badge · Chip · Avatar · Skeleton · Spinner · Progress.
  _Cheap, high-frequency; immediate enterprise completeness; double as grid cell renderers + loading states._
- **Wave 2 — Overlay-anchored data entry & menus** (rides the v0.11 engine) `[IN PROGRESS]`
  **Select** `[DONE — v0.14: single select; established `_internal/listbox` = collection + active-index + typeahead + keymap]` →
  Combobox → MultiSelect · Menu/Dropdown (+Context) · DatePicker.
  _The shared listbox internal is now in place; ChipGroup, the `options` data-prop, Combobox (free-text filter),
  MultiSelect, virtualization, in-popup search, and a mobile-native `<select>` fallback are the remaining Wave-2 work
  (deferred from v0.14, binding)._
- **Wave 3 — Modal & disclosure**
  Dialog (**+ imperative service**, mirrors Toast) · Drawer/Sheet · Tabs · Accordion · Alert (in-page).
- **Wave 4 — Input family completion**
  Slider · Segmented control · Rating · Tags-input · Pin/OTP · File upload.
- **Wave 5 — Tabular**
  Pagination · Tree/TreeView · basic DataTable (non-virtualized stepping stone).
- **Wave 6 — Terminal**
  Data Grid (AG-Grid equivalent) → later Gantt / Scheduler.

---

## 5. Locked decisions

- **Ordering:** atoms first (Wave 1), Grid last. Re-discussed and confirmed 2026-06-22 against the full gap list.
- **Tag / Chip / Badge are three distinct components:**
  - **Badge** = count/status indicator (small label, dot, "12+"); attached-to-host mode deferred.
  - **Tag** = static tonal metadata label (optional `✕`); read-only.
  - **Chip** = interactive (selectable / removable / clickable); ChipGroup deferred to Wave 2.
- **Wave 1 scope:** Progress = linear **+ circular** (determinate + indeterminate); Avatar standalone
  (image/initials/icon fallback + sizes — group/stack & status-dot deferred); Badge standalone
  (attached mode deferred); Chip standalone (ChipGroup deferred).
- **Tone-resolver** promoted from `toast/tone-resolver.ts` to **`core/src/_internal/tone/`**, parameterized
  by CSS-var prefix (`--tulpar-tag-*`, `--tulpar-badge-*`, `--tulpar-toast-*`). In-package refactor; both
  toast and the atoms consume it.
- **Tone vocabulary:** `neutral | info | success | warning | danger | custom` (custom = brand-family
  name `al·gok·ulgen·otuken·kizagan·erlik·ilay·umay…` or raw CSS color + part overrides). Atoms default
  to `neutral`; toast/overlay keep their existing defaults.
- **Appearance variants** (tag/chip/badge): `soft-tonal` (default) / `outline` / `solid` — exact visual
  language (radius, size scale, spacing, motion) locked via `/frontend-design` + `/ui-ux-pro-max` + static
  HTML mockups before the spec.

---

## 6. Cross-cutting primitive prep

- **Density scale tokens** (compact/comfortable/spacious) — not built yet; introduce when first needed
  (Select cell-editor / grid). Roadmap-critical for grid row height.
- **Compact + bare/borderless input appearance** — for grid cell editors (Wave 2/5).
- Checkbox `indeterminate` — **done**.
- Portal/overlay engine — **done (v0.11)**.

---

## 7. Deferred / out of scope (for now)

Command palette · Cascader · Transfer/PickList · Mentions · Color picker (low priority) · Carousel ·
Charts (separate package/spec) · Gantt/Scheduler (post-grid) · RTL · React wrapper · second brand theme ·
SSR tuning · mobile-native.

---

## 8. Process per wave

Each wave/component follows the project flow: **brainstorm → spec (`docs/superpowers/specs/`) →
spec-review loop → implementation plan (`docs/superpowers/plans/`) → execute → playground parity (ng+vue) →
changeset**. Visual/UX judgments go through `/frontend-design` + `/ui-ux-pro-max` first.
