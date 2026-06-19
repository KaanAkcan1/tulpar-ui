---
"@tulpar-ui/tokens": minor
"@tulpar-ui/core": minor
"@tulpar-ui/angular": minor
"@tulpar-ui/vue": minor
---

Overlay family: three new public custom elements — `<tulpar-tooltip>` (brief
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
