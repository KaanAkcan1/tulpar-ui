---
"@tulpar-ui/core": minor
"@tulpar-ui/angular": minor
"@tulpar-ui/vue": minor
"@tulpar-ui/tokens": minor
---

Input family: three new public custom elements (`<tulpar-text-input>`,
`<tulpar-textarea>`, `<tulpar-number-input>`) sharing an internal
FormFieldBase. Signal-based Angular wrappers and v-model Vue wrappers
included, plus full Storybook coverage and menu-driven playground demos.

Differentiators baked in: async `validating` state, copy/paste
affordances with visual confirmation, layout-shift-safe message row,
integrated mask engine with case-forcing token alphabet (A/a/L/9/S/*),
five label positions including PrimeNG-style float ("over"), and a
hybrid Intl.NumberFormat API (shorthand attributes + full
`.formatOptions` property).

See `docs/migration/v0.4-to-v0.5.md` for usage examples and the
deferred-items list.
