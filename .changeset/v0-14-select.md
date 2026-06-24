---
"@tulpar-ui/core": minor
"@tulpar-ui/angular": minor
"@tulpar-ui/vue": minor
---

Select (single): new public elements `<tulpar-select>` + `<tulpar-option>` +
`<tulpar-option-group>` — a form-associated single-select that subclasses the
input field base (label/positions/helper-error-warn/required/sizes/variants), lifts
its listbox to the native Popover-API top layer (positioned by the shared flip/shift
positioner, registered on the Escape stack), and implements the WAI-ARIA select-only
combobox pattern with `aria-activedescendant` virtual focus, typeahead, full keyboard
map, grouped + two-line/icon options, clearable, and loading/empty/error states.
Establishes the package-private `_internal/listbox/` foundation (collection +
active-index + typeahead + keymap) for the rest of Wave 2. The input family also gains
a soft `:focus-visible` ring (opt-out via the `--tulpar-color-focus-ring` token).
Angular ships signal wrappers (`tulpar-select-ng` with `model()` two-way value); Vue
ships SFC wrappers with `v-model`. Deferred (binding): `options` data-prop, Combobox,
MultiSelect, virtualization, in-popup search, mobile-native fallback.
