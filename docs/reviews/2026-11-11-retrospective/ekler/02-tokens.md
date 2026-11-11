# 02 — TOKENS: @tulpar-ui/tokens and the theming model

## Area summary

The 3-layer idea (primitive → semantic → brand×mode) is sound. The CSS generator is small and correct. The mythology palette is complete (22 families × 11 stops). Some areas show contrast discipline (overlay/feedback/atom tone tests).
The theming model as a whole is **Needs work**, close to **Weak** for a commercial design system:

- **Accessibility.** The token values fail WCAG 2.2 AA in 57 of 364 foreground/background pairs that components actually render. Failures include the focus ring (1.88:1 light), every control boundary, brand-green text, dark-mode error text, and dark-mode selection messages that render hardcoded light colors.
- **Dark mode.** The dark theme is only partly designed. All 10 `subtle` tints collapse to the page surface. `color-scheme` is never set. The custom-tone and avatar flip uses `:host-context(.dark)`, which only Chromium supports.
- **Fallbacks.** The fallback system (`FALLBACKS`) is effectively unused. 190 hand-typed `var()` fallbacks disagree with the real tokens, and some point to the wrong hue.
- **Missing foundations.** The semantic layer has no foundation scales (radius, spacing, type, motion, z-index). The source format is not DTCG and cannot be exported to Figma or Style Dictionary.

Scripts (read-only, outside the repo): `review/tok/contrast.mjs` (full pair matrix → `contrast.out.txt`), `review/tok/fallbacks.mjs` (fallback vs token diff → `fallbacks.out.txt`), `review/tok/btn.mjs`, `review/tok/av.mjs`, `review/tok/raw.mjs`, `review/tok/fb2.mjs`.

## Findings table

| ID | Title | Severity | Merge-blocking | Confidence |
|---|---|---|---|---|
| TOK-1 | Selection message row uses undefined tokens → light-only hardcoded colors in dark mode (1.75–2.78:1) | Blocker | No (pre-existing on main) | Verified |
| TOK-2 | Focus ring fails 3:1 in both modes; the input family focus is a translucent shadow only; `input-border-focus` is never used | Major | No | Verified |
| TOK-3 | forced-colors gaps: input-family focus and shell active state disappear in Windows High Contrast | Major | No | Verified (code+spec) |
| TOK-4 | `VariantColorTokens` mixes fill and foreground roles → brand/premium text fails AA (1.61–3.69:1) | Major | No | Verified |
| TOK-5 | Control boundaries fail WCAG 1.4.11 (input 1.34, checkbox 1.84, switch 1.57; dark lower) | Major | No | Verified |
| TOK-6 | Dark theme: all `subtle`/`subtleHover` = surface; tonal = ghost; content = surface; borders 1.14:1 | Major | No | Verified |
| TOK-7 | Remaining text-contrast failures (muted on subtle/active option, placeholder, dark link/error/flyout header) | Minor | No | Verified |
| TOK-8 | `:host-context(.dark)` (Chromium-only) still drives avatar + custom-tone dark flip | Major | No | Verified |
| TOK-9 | No `color-scheme` anywhere; no system (auto) mode; no light-island support | Major | No | Verified |
| TOK-10 | Custom tones/avatars expose the primitive palette as runtime API; avatar initials and custom dark borders fail contrast | Major | No | Verified |
| TOK-11 | Fallback system is dead: `FALLBACKS` used once; 190 of 634 literal fallbacks ≠ tokens, some wrong hue | Major | No | Verified |
| TOK-12 | Other references to non-existent tokens (`--tulpar-radius-sm`, `…-item-hover-bg` typo, `text-default`, `bg-surface-raised`) | Minor | No | Verified |
| TOK-13 | "Warning" has two hues and three tonal recipes; `warn` vs `warning` naming | Major | No | Verified |
| TOK-14 | Semantic layer lacks foundation scales (radius, type, motion, z-index); 680 raw lengths, 48 raw durations | Major | No | Verified |
| TOK-15 | Source not DTCG / not exportable; brand×mode duplicates all 370 tokens; no cascade layers | Major | No | Verified |
| TOK-16 | Token tests: contrast gate covers 3 of 11 groups; helper copied 3×; brand tests are hex change-detectors | Minor | No | Verified |
| TOK-17 | tokens (and vue) pin vitest ^1 / vite ^5 outside the catalog; three Vite majors in the repo | Minor | No | Verified |
| TOK-18 | README inaccurate/incomplete (says "single CSS file"; fonts, files, custom brand, type exports) | Minor | No | Verified |
| TOK-19 | Leftovers: navy-tinted shadows from removed palette; `transition: all` default token | Nit | No | Verified |

---

### TOK-1: Selection message row uses undefined tokens → hardcoded light colors in dark mode
- Severity: Blocker
- Merge-blocking for current branches: No (exists on main since v0.10)
- Confidence: Verified
- Where: `packages/core/src/_internal/selection-message-row.styles.ts:12,21,25,29`. The row is used by `selection-control-base.ts:4` (checkbox, radio, switch) and `selection-group-base.ts:4` (checkbox-group, radio-group).
- Problem: The row reads `--tulpar-selection-message-helper|error|warn|row-height`. None of these exist in the token sheet; `SelectionTokens` has no `message` group. The literal fallbacks `#4f5153`, `#b22128`, `#b45309` therefore apply in **both** modes. On the dark surface `mergen-900 #202c43` the results are:
  - helper **1.75:1**
  - error **2.09:1**
  - warn **2.78:1**

  WCAG 1.4.3 requires 4.5:1. In light mode on the shell content background, warn is 4.37:1, which also fails.
- Evidence: `fallbacks.out.txt` section "referenced --tulpar-* NOT defined" lists all four. `contrast.out.txt` has the dark lines `#b22128 … on color-bg-surface [#202c43] 2.09`. A grep for `selection-message-` in `packages/tokens/src` finds no matches.
- Why it matters: Validation errors on checkboxes, radios and switches are almost unreadable in dark mode. The input family (`--tulpar-input-message-*`) flips correctly, so two form families behave differently.
- Correct solution: Do not add a `selection.message` group. Use one cross-family form-message role: either make the selection row consume the existing `--tulpar-input-message-*`, or rename both to `--tulpar-field-message-{helper,error,warn}`. Carbon (`$text-error`) and Atlassian (`color.text.danger`) share one error-text token across all form controls. Add the CI check from TOK-12 so an undefined token reference fails the build.
- Effort: S

### TOK-2: Focus ring fails 3:1; the input focus is a translucent shadow; `input-border-focus` is unused
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `brand/tulpar/light.ts` `focusRing: "rgba(81, 78, 207, 0.40)"` (×3: `color.focusRing`, `selection.focusRing`, `overlay.focusRing`). `dark.ts` `rgba(132,151,255,0.60)` (×3). `core/src/_internal/form-field-base.styles.ts:182-212` (box-shadow ring, `outline:none` in text-input/textarea/number-input/select). Shell fallbacks: `#514ecf` (nav-item, topbar) vs `#00c57a` (account/header/utility).
- Problem: The ring composited over the surface measures:
  - **1.88:1** on white
  - **1.82:1** on the shell content background
  - **2.84:1** on dark `mergen-900`

  WCAG 1.4.11 (AA) covers the visual focus indicator and asks for 3:1. 2.4.13 (AAA) also asks for 3:1 change contrast. The input family draws focus *only* as this 40%-alpha 3px shadow. The token `--tulpar-input-border-focus` (kam-500, a solid colour that would pass) is defined but has no consumer; a grep finds 0 hits in `*.styles.ts`. The same role has three separate tokens, and the shell fallbacks disagree on its colour (indigo vs green).
- Evidence: `contrast.out.txt` lines `color-focus-ring … 1.88`, `… 2.84`. `grep input-border-focus core/src` → none.
- Why it matters: Keyboard users cannot reliably see focus on the main form controls. This is an AA failure on every page.
- Correct solution: Use one focus token, `--tulpar-color-focus-ring`, as an **opaque** colour with ≥3:1 against every surface it sits on. Draw it as `outline: 2px solid` with `outline-offset: 2px`. An outline survives forced-colors (see TOK-3). For fields, also switch the border to the focus colour. Reference systems:
  - Carbon: 2px solid `$focus` plus an input underline.
  - Stripe: the border swaps to primary (`design-references/stripe` text-input-focused).
  - Primer: `focus.outlineColor`, 2px solid.

  Keep a soft halo only as an *additional* decorative layer. Remove `selection.focusRing` and `overlay.focusRing`, or make them aliases.
- Interim: Raise alpha so the composite reaches ≥3:1 and use `input-border-focus` on `:focus-within`.
- Effort: M

### TOK-3: forced-colors gaps — input focus and shell active state disappear
- Severity: Major
- Merge-blocking: No
- Confidence: Verified (code + CSS Color Adjust spec: `box-shadow` is forced to `none` in forced-colors mode)
- Where: No `@media (forced-colors)` in `form-field-base.styles.ts`, `text-input`, `textarea`, `number-input`, `selection-group-base`, `selection-message-row`, `button-group`, or any **shell** stylesheet (`raw` grep list). The input focus is box-shadow only (TOK-2). The shell active item uses `box-shadow: inset 2px … indicator` (`nav-item.styles.ts:49,300`).
- Problem: In Windows High Contrast / forced-colors, box-shadow is removed and backgrounds are forced. The text-input/textarea/number-input/select focus ring vanishes; their own `outline:none` removes the native one. The current-page nav item loses both its tint and its indicator bar.
- Why it matters: Windows HCM users are a core enterprise-accessibility audience. Focus visibility failure there is a 2.4.7 failure (AA).
- Correct solution: Use outline-based focus, as TOK-2 describes. Outline is preserved and recoloured to the system `Highlight`/`CanvasText`. Add a forced-colors block per family, as button, select and selection-control already have, for example `[aria-current=page]{ outline:2px solid Highlight }` or `forced-color-adjust` on the indicator with `Highlight`. Reference: the MDN `forced-colors` guide, and the Fluent UI and Primer forced-colors focus-ring patterns.
- Effort: S–M

### TOK-4: `VariantColorTokens` mixes fill and foreground → brand/premium text fails AA
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `semantic/color.ts` `VariantColorTokens { default, hover, active, disabled, onColor, subtle, subtleHover }`. `button.styles.ts:248-300` uses `hover` as the text colour for outlined, tonal and ghost buttons, and `default` as the text colour for link buttons.
- Problem: One colour serves as both a *fill* and a *text* colour. The bright brand green and the gold work as fills but fail as text (`btn.mjs`):

  | Mode | Severity / case | Ratio | Required |
  |---|---|---|---|
  | light | brand: ghost/outlined text (`tulpar-600` on white) | **3.23** | 4.5 |
  | light | brand: tonal text on subtle / subtleHover | **3.01 / 2.84** | 4.5 |
  | light | brand: link text (`tulpar-500`) | **2.27** | 4.5 |
  | light | premium: ghost/outlined | **1.90** | 4.5 |
  | light | premium: tonal | **1.73 / 1.61** | 4.5 |
  | light | premium: link | **2.28** | 4.5 |
  | light | brand solid **active** (ink on `tulpar-700`) | **3.69** | 4.5 |
  | dark | help: link | **3.15** | 4.5 |
  | dark | help: tonal hover | **4.24** | 4.5 |
  | dark | danger: link | **3.97** | 4.5 |

  The default button severity is brand, so `<tulpar-button variant="ghost|outlined|tonal|link">` fails AA by default in light mode.
- Why it matters: The most common secondary-action styles are inaccessible out of the box, and a token change cannot fix it because no "text" role exists.
- Correct solution: Split roles in the semantic contract, as mature systems do:
  - Primer: `fgColor.accent` vs `bgColor.accent.emphasis` / `.muted`.
  - Atlassian: `color.text.brand` / `color.background.brand.bold` / `.subtlest`.
  - Carbon: `$link-primary` vs `$button-primary`.

  Add `text` and `textHover` (and `border` where needed) to `VariantColorTokens`, bound to a darker step in light mode (for example `tulpar-800`, `ulgen-800`). Use them for every non-solid variant. Retune brand `active` so it keeps ≥4.5 with `onColor`.
- Effort: M

### TOK-5: Control boundaries fail WCAG 1.4.11 (non-text contrast)
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `light.ts`/`dark.ts` `input.border.default`, `selection.control.border`, `switch.trackOff`, `input.bg.readonly` (filled variant), `color.border.*`.
- Problem: These boundaries are the only visual cue that identifies the control, and all fall below 3:1:

  | Control boundary | Light | Dark | Required |
  |---|---|---|---|
  | Text-field border vs field and page (`colpan-200` on white / `mergen-800` on `mergen-950`) | **1.34** | **1.30** (1.14 vs page) | 3.0 |
  | Checkbox/radio unchecked border | **1.84** | **1.36** | 3.0 |
  | Switch off-track vs page | **1.57** | **1.29** | 3.0 |
  | Switch thumb vs on-track | **2.27** | **1.85** | 3.0 |
  | Switch thumb vs off-track | **1.57** | — | 3.0 |
  | `filled` input fill vs page | **1.09** | **1.00** | 3.0 |
  | Checked fill (`tulpar-500`) vs page | **2.27** | — | 3.0 |

- Evidence: `contrast.out.txt` (FAIL lines tagged "1.4.11").
- Why it matters: Low-vision users cannot find empty fields or unchecked boxes. This is an AA failure flagged by every automated audit that checks 1.4.11 (axe flags some; manual audits flag all).
- Correct solution: Add a dedicated `border.input` / `control.border` role at ≥3:1, distinct from the decorative `border.default`. Atlassian introduced `color.border.input` (#8590A2, about 3.2:1) for exactly this reason. Carbon uses a `$border-strong` bottom border on a `$field` fill. Decorative dividers may stay low. For the switch, use a contrasting thumb outline or a darker off-track. For `filled` inputs, keep a ≥3:1 bottom border, as Carbon does.
- Effort: M

### TOK-6: Dark theme — every `subtle`/`subtleHover` equals the surface
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `brand/tulpar/dark.ts` — every intent has `subtle: c.mergen[900], subtleHover: c.mergen[800]`. `color.bg.surface` is also `mergen[900]`, and `shell.content.bg` is too. `border.default` is `mergen[800]`.
- Problem: In dark mode:
  - All 10 intents have identical, untinted "subtle" colours, at **1.00:1** vs the surface.
  - The tonal button has no fill, so it is identical to ghost.
  - The outlined hover background does not change.
  - Brand, danger and success soft states cannot be told apart.
  - Content and surface are the same colour, so cards separate only through `border.default` at **1.14:1**.
- Evidence: `contrast.out.txt` "subtle vs surface" rows: dark = 1.00 for all ten.
- Why it matters: The dark theme loses the semantic colour layer for soft states, and visual hierarchy collapses. The playgrounds hide this because they rarely show tonal or outlined-hover states in dark mode.
- Correct solution: Give each intent a per-intent dark tint, as Radix Colors dark scales (steps 3–4 per hue) and Primer dark (`bgColor.accent.muted` = accent at about 10–15% alpha) do. Either bind `family[950]` / `family[900]`, or derive `color-mix(in oklch, <intent> 14%, <surface>)` at build time. Define a dark elevation ladder: content < surface < elevated < overlay, with distinct steps.
- Effort: S (values) + tests

### TOK-7: Remaining text-contrast failures
- Severity: Minor
- Merge-blocking: No
- Confidence: Verified
- Where/Problem (all from `contrast.out.txt`):

  | Mode | Pair | Ratio | Where it shows |
  |---|---|---|---|
  | light | `text.muted` (`kara-500`) on `bg.subtle` | **4.15** | Select option description on the **active row**: `tulpar-option.styles.ts:139,155` text-muted; `:host([data-active])` bg-subtle at `:194` |
  | light | `text.muted` on `bg.muted` / shell content | **3.92** | |
  | light | input placeholder (`kara-400`) | **3.09** | |
  | dark | `text.link` on subtle / muted | **4.32 / 3.81** | |
  | dark | `input.message.error` (`al-400`) on surface | **3.97** | |
  | dark | sidenav flyout header | **3.98** | |

  `color.neutral.*` has **no consumer** in core/shell; its dark default (`kara-700`, 1.75 vs surface) is dead weight.
- Correct solution: Bind muted text one step darker (`kara-600`) in light mode. Set placeholder ≥4.5:1; the W3C WAI forms tutorial and Atlassian `color.text.subtlest` both treat placeholder as text. Use `al-300` for dark error text. Remove `color.neutral` or give it a consumer. Gate all of this with the TOK-16 test.
- Effort: S

### TOK-8: `:host-context(.dark)` still drives avatar and custom-tone dark flip — only Chromium supports it
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `avatar.styles.ts:63` (all deterministic avatar colours); `chip.styles.ts:80,201,214`; `tag.styles.ts:82,183,197`; `toast.styles.ts:37`; `progress.styles.ts:37,44`; `spinner.styles.ts:73`; `skeleton.styles.ts:28`. `_internal/tone/tone-resolver.ts` documents `:host-context` as the required contract.
- Problem: The memory note frames this as a tulpar-shell quirk. The real cause is broader: `:host-context()` is **not implemented in Firefox or Safari**. MDN browser-compat-data `css/selectors/host-context.json` shows Chrome 54, Firefox `false`, Safari `false`, and the CSSWG has discussed removing it. In Firefox and Safari the following never switch to their dark values:
  - every avatar colour
  - every custom-tone chip, tag, toast, progress and spinner

  Built-in tones are fine because they use auto-flipping tokens.
- Why it matters: Behaviour differs per browser in a cross-framework component library. Shoppers who test in Safari will see light-mode tints on dark pages.
- Correct solution: Set `color-scheme` per mode in the token sheet (TOK-9). Then express mode pairs with CSS `light-dark()`, for example `--_av-bg: light-dark(var(--tulpar-avatar-bg-l), var(--tulpar-avatar-bg-d))`. `color-scheme` is inherited and crosses shadow boundaries. `light-dark()` is Baseline 2024: Chrome 123, Firefox 120, Safari 17.5 (MDN BCD). Better still, remove the need entirely with semantic accent tokens that auto-flip (TOK-10). Update `tone-resolver.ts` docs and the memory note `reference_host_context_dark_fails_in_shell` accordingly.
- Effort: M

### TOK-9: No `color-scheme`; no system (auto) mode; no light-island
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `build/generate-css.ts` emits only custom properties. A grep for `color-scheme` across packages finds nothing; only `apps/playground-vue/src/style.css:19` (the Vite template) has it.
- Problem:
  - Without `color-scheme: dark` on `.dark`, native parts stay light in dark mode: scrollbars, number-input spinners, the textarea resize grip, autofill, `<select>` popups, the caret and form-control defaults. `light-dark()` is also unavailable as a result.
  - There is no `prefers-color-scheme` auto mode. A consumer must write JS to sync the OS preference.
  - A light region inside a `.dark` page is impossible: `.dark [data-brand]` always wins, and there is no `.light` selector.
- Correct solution: Generate the following, which is what Primer (`data-color-mode="auto"`), Spectrum and Web Awesome (`.wa-dark` + color-scheme) ship:
  - `:root, .light { color-scheme: light }`
  - `.dark { color-scheme: dark }`
  - an opt-in `[data-theme="system"]` (or `.tulpar-auto`) block wrapped in `@media (prefers-color-scheme: dark)`
  - `.light` as a scoped inverse

  Keep `.dark` as the Tailwind-compatible trigger; this matches the CLAUDE.md decision.
- Effort: S

### TOK-10: Custom tones and avatars use the primitive palette as runtime API; avatar initials and custom dark borders fail contrast
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `core/src/_internal/tone/tone-resolver.ts:122-147` (`BRAND_FAMILIES` is a hand-copied duplicate of `primitiveColor` keys) and `:205-226`. `avatar/tulpar-avatar.ts:196-213` (`var(--tulpar-primitive-color-<family>-600/500)` inline). `avatar.styles.ts:61` (`--_av-fg: #ffffff` fixed).
- Problem:
  1. The ESLint "semantic only" rule is bypassed through inline styles. Every component now depends on `--tulpar-primitive-color-{22 families}-{steps}` being present and meaning the same thing. A second brand cannot change the palette, and without the token CSS there is no fallback at all.
  2. White initials on family-600 (light) or family-500 (dark) fail for many families (`av.mjs`). Light: tulpar **3.23**, kayin/kuyas **3.44**, ayzit **4.00**, yersu **4.32**. Dark: tulpar **2.27**, kuyas **2.42**, kayin **2.43**, ayzit **2.88**, yersu **3.19**, alaz **3.65**, gok **4.05**, umay **4.26**.
  3. The custom-family dark border (step 500 on 900) is below 3:1 for most families: erlik 1.91, otuken 2.10, kam 2.15, kizagan 2.27, al 2.52. The code comment admits it.
  4. Raw-colour custom tones mix toward `#0a1628`, a navy unrelated to the `mergen` dark surface.
- Correct solution: Add a semantic **accent (display) colour** set to the brand layer, one entry per curated family, with roles `{bg, bgSubtle, fg, border, onBg}` per mode. Primer has `--display-<hue>-bgColor-muted/emphasis`, `-fgColor`, `-borderColor` for labels and avatars; Atlassian has `color.background.accent.<hue>.subtle/bolder` and `color.text.accent.<hue>`. Values are contrast-tested, flip automatically and are brand-overridable, so neither `:host-context` nor primitive vars are needed. Derive `BRAND_FAMILIES` from the token package, not a copied list. Choose avatar `onBg` per family (dark ink on light hues).
- Effort: M–L

### TOK-11: The fallback system is effectively unused, and hand-typed fallbacks drift from the tokens
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `tokens/build/generate-fallbacks.ts` (43 keys). Its only consumer is `button.styles.ts:4` (`FALLBACKS.borderDefault`). There are 634 `var(--tulpar-*, <literal>)` across core and shell.
- Problem: 190 literal fallbacks differ from the light token they stand in for (`fallbacks.out.txt`). Worst cases:
  - **Wrong hue.** `popover.styles.ts:106-118` and `toggletip.styles.ts:81-93` have success = amber (`ulgen`), warning = pink (`kizagan`) and danger = purple (`erlik`), a shifted family map.
  - **Tailwind leftovers.** Shell fallbacks: `#334155`, `#0f172a`, `#2563eb`, `#e2e8f0`. Select: `#737373`, `#a8a29e`, `#b91c1c`. Toast tone fallbacks are all Tailwind (`#eff6ff`, `#93c5fd`, …). `tone-resolver.ts:197-203` uses `#2563eb` / `#60a5fa` as "brand".
  - **Value drift.** Button size radii fall back to `7px` for every size (tokens are 5–12px). The font fallback is `system-ui` (tokens use Source Sans 3). Shell focus fallbacks disagree (`#514ecf` vs `#00c57a`).
- Why it matters: The project rule "provide a fallback when tokens CSS is not loaded" produces a *different, partly wrong* design rather than a degraded one. The 43-key generated map gives a false sense that this is managed.
- Correct solution: Choose one of the following.
  - (a) **Recommended: generate the access layer.** The build emits a typed `tokens.css.ts` with `unsafeCSS` constants whose fallback is the generated light value, for example `t.color.text.primary` → `var(--tulpar-color-text-primary, #15110b)`. Add an ESLint rule that forbids literal `var(--tulpar-…, <literal>)` in `*.styles.ts`. This gives one source of truth, the same idea as vanilla-extract `createThemeContract` and Open Props.
  - (b) **Drop fallbacks and require the token sheet.** Shoelace/Web Awesome, Spectrum WC (`<sp-theme>`) and Carbon WC all require their theme CSS.

  Both options beat 634 hand-maintained literals. This decision belongs to the owner (see the open questions).
- Effort: M

### TOK-12: Other references to non-existent tokens
- Severity: Minor
- Merge-blocking: No
- Confidence: Verified
- Where:
  - `--tulpar-radius-sm`: `chip.styles.ts:394`, `shell sidenav/parts/{account:103, header:21, utility:26}`. No semantic radius exists.
  - `--tulpar-shell-sidenav-item-hover-bg`: `account:113`, `header:29`, `utility:39`. A typo; the real token is `…-item-bg-hover`.
  - `--tulpar-color-text-default` and `--tulpar-color-bg-surface-raised`: `shell/tulpar-shell.styles.ts:162,172` (the sidenav FAB).
- Problem: These always render their fallback. The sidenav toggle hover stays `rgba(11,8,4,.06)`, which is invisible in dark mode. The FAB hover turns light `#f8fafc` in dark mode. The radius ignores the brand.
- Correct solution: Fix the names. Add a build or CI check that collects every `var(--tulpar-…)` in component sources and fails on names that are neither in the token sheet nor in a declared component-hook list. Generate that hook list from Custom Elements Manifest `cssProperties`. This also separates *tokens* from *component hooks*, such as `--tulpar-chip-max-width` and `--tulpar-tag-surface-l`, which today share the `--tulpar-*` namespace without distinction.
- Effort: S

### TOK-13: "Warning" has two hues and three tonal recipes
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `color.warn` = `kuyas` (orange), used by the input warn border/message/icon and button `severity="warn"`. `overlay.tone.warning`, `feedback.tone.warning` and `atom.tone.warning` = `ulgen` (gold). Naming differs too: `warn` vs `warning`.
- Problem: The same intent renders as orange on a field and gold on a toast, tooltip or tag placed beside it. The tonal recipes also differ per family:
  - overlay: surface `[100]`, text `[800]`
  - feedback: surface `[50]`, text `[900]`
  - atom: surface `[100]`, text `[800]`, with different border steps

  `ulgen` is also the `premium` family, so "warning" and "premium" share a hue.
- Why it matters: Status colour must mean one thing everywhere. This is a basic design-system consistency rule (Carbon support colours, Atlassian `warning`).
- Correct solution: Define **one** status-colour role set per intent (`status.<intent>.{surface, surfaceStrong, text, border, icon, onStrong}`) bound once per mode. Overlay, feedback, atom and input alias it. Use one family per intent and one name (`warning`).
- Effort: M

### TOK-14: Semantic layer has no foundation scales
- Severity: Major
- Merge-blocking: No
- Confidence: Verified
- Where: `semantic/types.ts`. The only foundation groups are `font.family`, `transition` (2 values), `easing.decelerate` and `shadow` (3). Everything else is a per-component group. `raw.mjs` over 37 `*.styles.ts` finds:
  - **680** raw px/rem lengths
  - **38** raw `font-size` literals
  - **48** raw durations with about 11 distinct values (80/90/120/140/150/160/180/200/220/300/320 ms) and at least 8 different easings: overlay `(0.2,0.9,0.3,1)`, feedback `(.22,1,.36,1)`, emphasized `(0.2,0,0,1)`, `ease`, `ease-out`, …
  - z-index spread across `shell.z` (100–300), `overlay.zIndex` (1000) and `feedback.zIndex` (9000)
- Problem:
  - Radius has no shared scale. Button radii are 5/6/7/8/9/10/12px, input 6px, toast 12px, nav item 8px. The primitive radius scale (2/4/6/12) is bound by no semantic token, so a brand cannot change "roundness" globally.
  - Reduced-motion is handled per component in 19 places rather than centrally.
- Why it matters: Multi-brand is the core promise of this design system. Today a second brand can change colours but not shape, rhythm or motion feel.
- Correct solution: Add semantic foundation tokens now, without density, which the roadmap defers until first needed:
  - `radius.{control, container, pill}`, or a `radius.{sm, md, lg, full}` scale
  - `motion.duration.{fast, normal, slow}` and `motion.easing.{standard, enter, exit}`, with a `@media (prefers-reduced-motion: reduce)` override in the generated sheet that sets durations to `0ms` or a short opacity value
  - `z.{base, sticky, nav, overlay, toast}`
  - typography roles `font.{size, lineHeight, weight}.<role>`

  Components then consume those. Reference systems: Carbon motion tokens (`$duration-fast-01`, productive/expressive easing), Atlassian `border.radius.*`, Material 3 shape and motion tokens.
- Effort: L (incremental per family)

### TOK-15: Source format is not DTCG / not exportable; brand×mode duplication; no cascade layers
- Severity: Major
- Merge-blocking: No
- Confidence: Verified (repo); Plausible (DTCG 2025.10 module details from spec knowledge)
- Where: `src/brand/tulpar/{light,dark}.ts` (TS object literals with no `$value`/`$type`/`$description`); `build/generate-css.ts`.
- Problem:
  - **Not interoperable.** There is no JSON export, so Figma Variables, Tokens Studio, Style Dictionary and native platforms cannot consume the tokens.
  - **Brand × mode duplication.** Light and dark each restate all 370 semantic tokens. **134 are identical** between modes (sizes, motion, z-index, radii); `button.size` is copy-pasted in `dark.ts`, while `input.size` is referenced. The sheet re-emits all 370 under 3 dark selectors, so `tulpar.css` is 105 KB. `tulpar-light.css` and `tulpar-dark.css` each re-emit all primitives, which are duplicated if both are loaded.
  - **No `@layer`.** A consumer override on `:root` loses to `.dark` / `[data-brand]` at equal specificity, so it depends on load order.
- Correct solution:
  - Author tokens in **DTCG format**: the W3C Design Tokens Community Group spec 2025.10 stable, which has `$value`/`$type`/aliases plus the Resolver module for sets and modifiers. Model brand and mode as modifiers.
  - Build with **Style Dictionary v4+** (native DTCG support) or **Terrazzo**. Emit CSS, a typed TS access layer (feeds TOK-11), and JSON for Figma.
  - Emit mode-invariant tokens once at `:root`; mode blocks contain colours only.
  - Wrap output in `@layer tulpar.tokens` so consumer overrides always win.

  The TS source can stay as a thin generated or typed view. This is the commercial-path standard, used by Adobe Spectrum, Salesforce and Atlassian.
- Effort: L

### TOK-16: Token tests — contrast gate covers 3 of 11 groups
- Severity: Minor
- Merge-blocking: No
- Confidence: Verified
- Where: `semantic/{atom,feedback,overlay}.contrast.test.ts`, each with its own copy of `luminance()`/`contrast()`. `brand/tulpar/{light,dark}.test.ts` assert literal hex values, for example `expect(…contrast.default).toBe("#15110b")`.
- Problem: There is no contrast test for `color.*`, `input.*`, `selection.*`, `switch.*`, `shell.*` or `button` pairs, which is why TOK-2/4/5/6/7 shipped. The hex-pinning tests are change detectors: they fail on every intended retune and catch no real regression.
- Correct solution: Write one table-driven suite. Declare every rendered (fg, bg, min) pair once, as in `review/tok/contrast.mjs`, and run it over both modes and every brand. Use 4.5 for text and 3 for non-text. Report APCA Lc as informational. Share one helper. Replace hex pins with structural tests (every key defined, every alias resolves, every mode has the same key set).
- Effort: S–M

### TOK-17: tokens (and vue) pin vitest ^1 / vite ^5 outside the catalog
- Severity: Minor
- Merge-blocking: No
- Confidence: Verified
- Where: `packages/tokens/package.json:40,42` (`vite ^5.1.0` → installed 5.4.21, `vitest ^1.3.0` → installed 1.6.1). `packages/vue` is the same. core, shell and docs use `vite ^5.1.0`. angular uses `vite ^8` / `vitest ^3`. `apps/playground-vue` uses `vite ^8.0.12`. `pnpm-workspace.yaml` catalog has only `lit` and `vite-plugin-dts`.
- Problem: Three toolchain generations exist side by side. The CLAUDE.md claim "pnpm 9 + catalogs" is only partly true. Vitest 1 and Vite 5 are several majors behind (K7 notes Angular wants vitest 4).
- Correct solution: Add `vite`, `vitest`, `typescript` and `tsx` to the catalog. Move all packages to one supported major (Vite 8 / Vitest 4, verifying the Angular peer). Enforce with `pnpm` `catalogMode: strict`, or a syncpack/manypkg check in CI.
- Effort: S

### TOK-18: README is inaccurate or incomplete
- Severity: Minor
- Merge-blocking: No
- Confidence: Verified
- Where: `packages/tokens/README.md`
- Problem:
  - It says "The build step emits a single CSS file". Three files exist (`tulpar-light.css`, `tulpar-dark.css`, `tulpar.css`), and the light-only/dark-only files are not documented.
  - It does not say that **fonts are not bundled**. `Source Sans 3`, `Source Serif 4` and `JetBrains Mono` must be loaded by the consumer; only the apps load them.
  - There is no token reference and no "create your own brand" guide, although the README promises multi-brand.
  - The type-export list is partial; `InputTokens`, `OverlayTokens`, `FeedbackTokens` and others are not exported from `src/index.ts` at all.
  - It advertises `FALLBACKS` "for components that need fallbacks", which contradicts TOK-11.
  - The intent table hides the warn/warning split (TOK-13).
- Correct solution: Generate the token reference from source (Style Dictionary or Storybook doc block). Document the files, font loading, dark and auto mode, brand authoring and the full type exports.
- Effort: S

### TOK-19: Leftovers — navy shadows and `transition: all`
- Severity: Nit
- Merge-blocking: No
- Confidence: Verified
- Where:
  - `primitive/shadow.ts` uses `rgba(10, 37, 64, …)` (navy from the removed `navy` family; the tests call it "navy-tinted"), as do `primitiveShadow.focus` (navy fallback), `feedback.shadow` and `shadow.flyout`. Dark `shadow.sm/md` reuse the navy primitives.
  - `transition.default = "all 150ms …"`
- Correct solution: Tint shadows from the current ink (`yagiz-950`) or neutral black. Remove the `focus` primitive shadow (TOK-2). Replace `transition: all` with explicit properties (`color, background-color, border-color, box-shadow, opacity, transform`), the common perf and a11y guidance.
- Effort: S

---

## Things done well
- Clear 3-layer intent, and a lint rule that blocks primitive references in `*.styles.ts`.
- Small, readable, tested CSS generator (`flattenTokens` / `generateCSS`), with a predictable kebab naming scheme.
- A complete, consistently stepped 22-family palette with a distinctive identity (mythology names).
- Overlay, feedback and atom tone groups are contrast-tested with explanatory comments on why steps were raised. This is the right habit; extend it (TOK-16).
- Built-in tones are attribute-only and auto-flip through tokens, which keeps dense atom grids cheap.
- `atom.flow` anchors and the switch thumb shadow show the right pattern: auto-flipping tokens instead of mode selectors.
- forced-colors and reduced-motion are handled in most core components (button, select, selection controls, overlays, atoms).
- `FALLBACKS` is generated from primitives with 0 mismatches against the light tokens. The idea is right; only adoption is missing.

## Open questions for the owner
1. **Fallback policy (TOK-11).** Option (a): a generated typed token access layer with build-derived fallbacks. Option (b): require the token stylesheet, as Shoelace, Spectrum and Carbon do. This choice drives a large, mechanical change in core and shell.
2. **Brand green as text (TOK-4).** Keep `#00C57A` as the fill and introduce a darker brand *text* role (for example `tulpar-800`), or change the primary button style for non-solid variants?
3. **Token source format (TOK-15).** Migrate to DTCG JSON + Style Dictionary now, before a second brand or Figma sync exists, or keep TS as the source and add a DTCG export step? Migrating early is cheaper.
4. **Accent/display tokens (TOK-10).** May the public `color="ilay"` API on tag, chip, toast and avatar become a curated, contrast-tested semantic accent set rather than "any of 22 primitive families"? This could narrow the accepted family list.
5. **Warning hue (TOK-13).** Pick one family for "warning": `kuyas` (orange) or `ulgen` (gold, currently also premium).
