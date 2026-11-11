---
"@tulpar-ui/core": minor
"@tulpar-ui/angular": minor
"@tulpar-ui/vue": minor
---

Select completion: `<tulpar-select>` gains an **`options` data-prop** — author a
Select from a typed array (`SelectOption` / `SelectOptionGroup`, exported) instead of
slotted `<tulpar-option>` children; data-mode renders real options into the shadow
listbox so all existing styling/active-descendant/form-value behavior is reused, and
the prop wins over slotted children. It also gains an opt-in **`searchable`** in-popup
search: a sticky filter input whose matching is case- and **Turkish/diacritic-insensitive**
(`İstanbul` matches `is`), with the matched run **highlighted** (`<mark part="match">`,
text labels only) and a first-class **no-match** row (`no-match-text` prop + `no-match`
slot); `search-placeholder` customizes the input. While searchable the combobox role
moves to the search input and typing replaces typeahead; two-stage Escape (clear query →
revert) and query-reset-on-open are built in. `<tulpar-option-group>` gains a `disabled`
prop (parity with `SelectOptionGroup.disabled`), and filtered-out options/groups now
render `display:none`. The package-private `_internal/listbox/` foundation adds a pure
`filter` unit (1:1 fold + substring matcher) and `hidden`-aware navigation +
`clear-query` in the keymap — reused by the upcoming Combobox/MultiSelect. Angular
(`tulpar-select-ng`) and Vue (`TulparSelect`) wrappers forward `options` (as a property),
`searchable`, `search-placeholder`, `no-match-text`, and the `no-match` slot, and
re-export `SelectOptions`. Still deferred (binding): Combobox (free-text + custom
`filterFn`), MultiSelect, virtualization, mobile-native `<select>` fallback.
