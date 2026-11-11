---
name: design-references
description: Comparative reference library of 70+ real-world design systems in DESIGN.md format (Linear, Vercel, Stripe, IBM, Figma, Notion, Supabase, Sentry, Raycast, …) from VoltAgent/awesome-design-md. Use before any Tulpar UI visual/UX decision (new component anatomy, density, radius, color roles, focus rings, menu/listbox/popover styling, motion) to benchmark how mature product systems solve the same problem.
---

# Design References (awesome-design-md)

Local copy of [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) in
`library/design-md/<brand>/DESIGN.md`. Each file holds tokens (colors, typography, radius, spacing),
component rules and the *rationale* behind them, in a machine-readable form.

`VoltAgent/awesome-claude-design` is the same collection packaged for Claude Design — nothing extra to install.

## Hard rules for Tulpar UI

1. **Reference, never source.** Use these to *benchmark* decisions (what do mature systems do for a
   menu item height, a listbox hover, a focus ring?). Never copy a brand's palette, typeface, logo or
   signature look into Tulpar. Tulpar keeps its own 3-layer token system and mythology palette.
2. **Semantic tokens only** in component CSS still applies — any value inspired by a reference is
   expressed through Tulpar's semantic/brand layers.
3. **Compare ≥3 systems** before settling a contested decision, and cite which ones in the spec
   ("Linear 32px menu row, Vercel 36px, IBM Carbon 40px → Tulpar md 36px").
4. Pair with `/ui-ux-pro-max`, `/frontend-design`, `/design-taste-frontend` — this library supplies
   evidence, those skills supply judgment.

## Which files to read (enterprise / product-UI relevant)

| Need | Best references |
|---|---|
| Dense product UI, menus, command surfaces | `linear.app`, `raycast`, `superhuman`, `cursor`, `warp` |
| Developer-platform neutral systems | `vercel`, `supabase`, `sentry`, `posthog`, `hashicorp`, `mongodb`, `clickhouse` |
| Enterprise / data-heavy | `ibm` (Carbon), `stripe`, `airtable`, `notion`, `figma`, `miro`, `intercom`, `zapier` |
| Forms, inputs, pickers | `stripe`, `wise`, `revolut`, `cal`, `airtable` |
| Restrained editorial tone | `notion`, `mintlify`, `resend`, `claude` |

Consumer/automotive/marketing files (`ferrari`, `nike`, `bugatti`, `spacex`, …) are rarely relevant —
skip unless the question is about brand expression.

## How to use

1. Identify the decision (e.g. "Menu item anatomy: height, padding, icon slot, shortcut hint, danger tone").
2. `Grep` the library for the concept across files, e.g. `menu|dropdown|listbox|popover|focus|radius`
   in `library/design-md/*/DESIGN.md`, then read the matching sections of 3–5 relevant systems.
3. Summarize the spread in a small comparison table, pick a Tulpar value with rationale, and record
   it in the spec's design-decisions section.
