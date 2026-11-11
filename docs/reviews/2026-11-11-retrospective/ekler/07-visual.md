# 07 — VISUAL: playgrounds as a product surface + rendered component quality

## Area summary

I reviewed both playgrounds on every route (23 pages plus a 404 probe) at 1440×900 light, 1440×900 dark and 375×812 mobile. That gave 144 full-page screenshots. I also captured rail mode once, the configurator, and every overlay in light and dark.
On 21 of 23 pages the two apps match on h2 headings and on `tulpar-*` element counts, so mechanical parity is good. The visual system is coherent across both themes.
The weak point is the **Vue wrapper layer**. Vue forwards unset props as `''` to the core elements. This erases core defaults on 9 components. On the NumberInput page it crashes rendering, and every field without an explicit locale is blank.
Four more shell-level defects affect both apps:
- The scroll architecture is broken: scroll position is kept across routes, and the document scrolls behind the app frame.
- The closed off-canvas drawers are still focusable.
- Escape does not close a tooltip that hover opened.
- The focus-ring and match-highlight tokens fall below 3:1.

**Overall verdict: Needs work.** The look is good, but a blocker in one framework and the a11y gaps mean it is not product-ready.

Method note: this was a single-context run. Impeccable critique normally uses two isolated sub-agents; I am already the dedicated sub-agent, so I did not spawn more. I ran the Impeccable detector (`detect.mjs`) on both playground sources and on core/shell. I loaded these skills: impeccable, playwright-cli, web-design-guidelines (rules fetched live), design-references (linear.app, vercel, stripe, ibm), ui-ux-pro-max, design-taste-frontend (anti-slop only), frontend-design, fronend-design, minimalist-ui (restraint only), redesign-existing-projects (checklist), genjutsu (motion principles).

Environment note (Info): the Angular dev server already on :4310 (not mine, started 10:02) served a **stale bundle** from before the 10:50 merge. It had no v0.15 Select sections. For that reason I ran a fresh `ng serve --port 4311` and used it for all `ng-*` screenshots and diffs. I stopped it afterwards. The Vue server on :5273 was already running and current; I did not start or stop it.

Screenshot root: `C:\Users\KAAN~1.AKC\AppData\Local\Temp\claude\c--Source-Kaan-tulpar-ui\b970f3d3-5fd6-42d8-b52f-a4deae3d71f0\scratchpad\review\shots\visual\` (abbreviated `shots/visual/` below). Naming: `<app>-<route>-<light|dark|mobile>.png`; `tiles/` holds crops.

## Findings table

| ID | Title | Severity | Merge-blocking | Confidence |
|---|---|---|---|---|
| VIS-1 | Vue wrappers turn unset props into `''` and wipe core defaults (NumberInput crashes, Tag/Chip lose fill) | Blocker | No (on main) | Verified |
| VIS-2 | Off-canvas sidenav and closed configurator stay in the tab order; wrong `aria-expanded`; mobile menu button overlaps the topbar | Blocker | No | Verified |
| VIS-3 | Shell scroll architecture: scroll kept across routes, document scrolls behind the app frame | Major | No | Verified |
| VIS-4 | Escape does not close a hover-opened tooltip (WCAG 1.4.13) | Major | No | Verified (cause Plausible) |
| VIS-5 | Focus ring is 1.85:1 (light) and 2.63:1 (dark), below 3:1 | Major | No | Verified |
| VIS-6 | K8 confirmed and extended: match highlight is ≈1.1–1.3:1 on active rows in both themes; hardcoded `color-mix` | Major | Yes (feat/v0.15) | Verified |
| VIS-7 | Vue Switch `on-color` never reaches the core (Vue reads `onColor` as a listener) | Major | No | Verified |
| VIS-8 | No `color-scheme` in dark mode; native controls stay light; select border equals its background | Major | No | Verified |
| VIS-9 | Playgrounds do not use Tulpar's own controls (59 native `<select>`, native checkboxes and radios, hand-made configurator) | Major | No | Verified |
| VIS-10 | Parity drifts (Button page, nav icons, icon size, document titles, meta) caused by two hand-written page sets | Minor | No | Verified |
| VIS-11 | Vue NumberInput demo teaches a wrong pattern and throws (mutates a readonly prop) | Minor | No | Verified |
| VIS-12 | Horizontal overflow at 375px on /select, /progress, /toast (both apps) | Minor | No | Verified |
| VIS-13 | No landing page and no 404: `/` and unknown routes silently redirect to /button | Minor | No | Verified |
| VIS-14 | Demo page template inconsistent; numbered h2s; no section anchors or deep links | Minor | No | Verified |
| VIS-15 | Colors page: unreadable step labels, hover-only info, conflicting "success" roles | Minor | No | Verified |
| VIS-16 | Visual weight: glow shadows on every solid button, heavy unthemed code blocks, saturated panels | Minor | No | Verified |
| VIS-17 | Empty topbar; brand placed in the sidenav under it | Minor | No | Verified |
| VIS-18 | Copy and terminology inconsistencies (atoms, class-name labels, Turkish toasts, `...`) | Minor | No | Verified |
| VIS-19 | Select trigger's accessible name is the placeholder, not the label | Minor | No | Verified (a11y tree) |
| VIS-20 | Static Tag gets `role="status"` (a live region) | Minor | No | Verified |
| VIS-21 | Motion and asset nits: progress animates `width`; third-party avatars; Google Fonts CDN | Nit | No | Verified |
| VIS-22 | Dead Vite scaffold files in playground-vue | Nit | No | Verified |
| VIS-23 | The :4310 Angular dev server served a stale bundle after the merge | Info | No | Verified |

---

### VIS-1: Vue wrappers turn unset props into `''` and wipe core defaults
- Severity: Blocker
- Merge-blocking for current branches: No (pattern exists on main, in 24 wrapper SFCs). It blocks any release of `@tulpar-ui/vue`.
- Confidence: Verified
- Where: `packages/vue/src/tag/TulparTag.vue:62-64` (`:variant="variant ?? undefined"` …), `packages/vue/src/number-input/TulparNumberInput.vue:114` (`:locale="props.locale ?? undefined"`), and the same pattern in 24 `.vue` files (`grep -rl '?? undefined"' packages/vue/src` → 24).
- Problem:
  - For a custom element, Vue sets a bound key as a DOM **property** when `key in el`. When the value is `null`/`undefined` and the current property is a string, Vue's `patchDOMProp` writes `''`. So "prop not given" becomes `el.variant = ''`, and that overrides the Lit default.
  - Runtime census on the Vue pages:

    | Component | Empty props |
    |---|---|
    | tulpar-select | `variant=""` 34×, `size=""` 33× |
    | tulpar-tag | `variant/shape/size=""` up to 41× |
    | tulpar-chip | `variant/shape/size/tone=""` |
    | tulpar-badge | `variant/shape/size=""` |
    | tulpar-avatar | `shape/size=""` |
    | tulpar-skeleton | `animation=""` 12× |
    | tulpar-spinner | `track/size=""` |
    | tulpar-progress | `size/variant=""` |
    | tulpar-number-input | `.locale === ''` 14× |

  - Angular shows the same problem only once (`tulpar-spinner track=""` 19×).
  - Visible results:
    - **NumberInput:** `new Intl.NumberFormat('')` throws `RangeError: Invalid language tag`. Render aborts, and the control is not drawn at all (9 page errors).
    - **Tag "Tones" row:** no tonal fill (`bg rgba(0,0,0,0)` in Vue vs `rgb(227,234,238)` etc. in Angular).
    - **Chip:** several chips lose their fill.
- Evidence:
  - `shots/visual/vue-number-input-broken.png`: the "Basics" demo shows only `qty = 1`, with no field.
  - `shots/visual/ng-number-input-viewport.png`: same demo, field rendered.
  - `shots/visual/VIS-tag-tones-vue-vs-ng.png`: Vue on top (no fill), Angular below.
  - Console: `pageerror: RangeError: Invalid language tag:` ×9 at `get _intl (tulpar-number-input…js:111)`.
  - Scripts: `review/vis-empty.js`, `review/vis-empty2.js`.
- Why it matters: the documented default rendering of 9 Vue components is wrong. One input renders nothing unless `locale` is passed. Unit smoke tests ("defaults are correct") do not catch it, because the defaults live in the core and only break after the hand-off.
- Correct solution:
  1. A wrapper must **not forward props the consumer did not set**. Build the binding object in a `computed` that drops `undefined` keys, then `v-bind` it: `const fwd = computed(() => Object.fromEntries(Object.entries(props).filter(([,v]) => v !== undefined)))`. Vue then never touches unset properties.
  2. The other option is the `.attr` modifier (`:variant.attr`). With it, `undefined` removes the attribute and Lit keeps its default. Reference: Vue docs "Passing DOM Properties" (https://vuejs.org/guide/extras/web-components#passing-dom-properties) and Vue `runtime-dom` `patchDOMProp` behaviour.
  3. Separately, harden the core: treat `''` like "unset" for enum props (a `converter` or `willUpdate` normalisation). Guard `Intl.NumberFormat` against invalid tags (`Intl.getCanonicalLocales` in try/catch, then fall back to `navigator.language`). Shoelace/Web Awesome normalise enum props this way.
  4. Add one wrapper-level browser test per component: mount with no props, then assert that `el.variant` (etc.) equals the core default. Happy-dom smoke tests do not cover this.
- Effort: M

### VIS-2: Off-canvas sidenav and closed configurator stay in the tab order; wrong state; mobile menu button overlaps the topbar
- Severity: Blocker (a11y: WCAG 2.4.3 Focus Order, 2.4.7 Focus Visible, 4.1.2 Name/Role/Value)
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/shell/src/sidenav/tulpar-sidenav.ts`, `packages/shell/src/shell/tulpar-shell.ts` (aside panel, mobile toggle). Both apps.
- Problem:
  - At 375px the sidenav is moved off-canvas (`left:-280`) but stays `visibility: visible`. Tabbing from page start goes "Skip to content" → "Toggle navigation" @x=-266 → "Filter navigation" @x=-233 → "Button" @x=-270 → … Focus is invisible off-screen.
  - The in-sidenav toggle reports `aria-expanded="true"` while the drawer is closed.
  - The closed configurator aside also stays in the a11y tree. Playwright's `getByRole('button', {name:/configurator/})` resolved to the hidden "Close configurator" button, and the click timed out "outside of the viewport".
  - The shell's floating "Open navigation" button (fixed at 8,8, 40×40) covers the topbar start slot. "Vue playground" / "Angular playground" is clipped to "ayground" / "r playground".
- Evidence:
  - `review/vis-tab.js` output for both apps: `Skip to content @x=8 | Toggle navigation @x=-266 | Filter navigation @x=-233 | Button @x=-270 | Form Inputs @x=-270 | Selection @x=-270`.
  - Screenshots: `shots/visual/vue-mobile-viewport.png`, `shots/visual/tiles/ng-button-mobile_0.png`.
- Why it matters: keyboard and screen-reader users on small screens navigate a hidden menu. It is a hard WCAG failure in the product's own app shell.
- Correct solution:
  - A closed drawer must be `inert` (the HTML `inert` attribute, Baseline 2023), or `visibility:hidden` after the exit transition. On mobile the open drawer follows the APG modal-dialog pattern: focus moves in, focus is trapped, Escape closes, focus returns to the opener (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
  - `aria-expanded` lives on the opener and reflects the real state.
  - Render the mobile menu button **inside** the topbar's start region instead of as a fixed overlay, so it takes layout space. Material 3 top app bar navigation icon, Carbon UI Shell header menu button and Polaris Frame all do this.
  - The same `inert` rule applies to the closed aside.
- Effort: M

### VIS-3: Shell scroll architecture (scroll kept across routes; the document scrolls behind the frame)
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/shell/src/shell/tulpar-shell.ts` (inner `<main id="tulpar-shell-content">` is the scroller); `apps/playground-ng/src/app/app.config.ts:14` (`withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })` has no effect); `apps/playground-vue/src/router.ts` (no `scrollBehavior`, no title handling); `packages/core/src/_internal/form-field-base.styles.ts:313-322` (`.field-validating-live { position:absolute … }`).
- Problem:
  1. **Route change keeps scroll.** I scrolled /button by 3000px and clicked "Tag": the new page opens at `main.scrollTop = 3000` in both apps. Router scroll restoration targets `window`, which does not scroll.
  2. **The document scrolls behind the app frame.** The shell is 900px tall, but `document.scrollingElement.scrollHeight` is 10161 on /select. The cause: 39 visually-hidden `.field-validating-live` spans and 9 hidden form `<input>`s have `offsetParent === BODY`. Neither the field host nor `main` is positioned, so these absolute boxes escape `main`'s overflow clipping. Any `scrollIntoView` (focus, find-in-page, demo scripts) then scrolls the whole frame: the topbar slides away and a blank band appears at the bottom.
- Evidence:
  - `review/vis-route.js` → `{"vue":{"mainScrollTop":3000,"h1":"Tag"},"ng":{"mainScrollTop":3000}}`.
  - Eval: `{"sh":10161,"ih":900,"sy":40}`; containing-block census `field-validating-live -> BODY 39`, `INPUT -> BODY 9`.
  - Screenshots: `shots/visual/vue-select-search-dark.png` and `shots/visual/ng-select-search-dark.png` (topbar shifted off, empty strip at bottom).
- Why it matters: every navigation drops the user mid-page, deep-link anchors and browser find behave oddly, and the frame "jumps". These are basic product-shell expectations.
- Correct solution:
  - Use **document-level scrolling** with a `position: sticky` topbar and a sticky, independently scrolling sidenav. Native router scroll restoration (Vue `scrollBehavior`, Angular `withInMemoryScrolling`), `scroll-margin-top` anchors, find-in-page and mobile address-bar collapse then work unchanged. Carbon UI Shell, GitHub, MDN, Radix and MUI docs are built this way.
  - Independently, apply the visually-hidden pattern correctly: field hosts get `:host { position: relative }` (or `contain: layout`). Then the `.sr-only`-style live region and the hidden input are anchored to their component. Without a positioned ancestor, the pattern leaks.
- Interim: the shell resets `main.scrollTop = 0` on `tulpar-location-changed` and gives `main` `position: relative` (both labelled Interim; restoration on Back still lost).
- Effort: M

### VIS-4: Escape does not close a hover-opened tooltip
- Severity: Major (WCAG 2.2 SC 1.4.13 "Dismissible")
- Merge-blocking for current branches: No
- Confidence: Verified behaviour; Plausible cause
- Where: `packages/core/src/tooltip/tulpar-tooltip.ts:409-414` (`_dismiss()` → `_doClose(true)` then `trigger.focus()`); `packages/core/src/_internal/overlay/overlay-root.ts:37-41`.
- Problem: I hovered the trigger, the tooltip opened, and I pressed Escape. The tooltip is still open after 800ms. This happens in both apps and on 4 different sections ("1. Inline directive", "2. Attaches to any element", "4. Arrow & offset", "7. Hoverable"). It closes only when the pointer leaves. `document.activeElement` became the trigger BUTTON after Escape.
  - Plausible cause: `_dismiss` moves focus to the trigger, and the focus-open path immediately re-opens the tooltip.
- Evidence: `review/vis-tipesc.js` → `"vue-hoverOpen":1,"vue-afterEscHover":1,…"ng-afterEscHover":1`; `review/vis-tipesc2.js` → all three sections `afterEsc:1`. Screenshots `shots/visual/vue-tooltip-open-light.png`, `shots/visual/ng-tooltip-open-dark.png`.
- Why it matters: the playground page itself claims "full WCAG 1.4.13 behaviour". Users who magnify the screen cannot get rid of a tooltip that covers content.
- Correct solution: follow the WAI-ARIA APG tooltip pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) and WCAG Understanding 1.4.13:
  - Escape closes the tooltip and sets a "dismissed" latch. The latch blocks re-open until the pointer leaves the trigger or focus moves away and back.
  - Escape must **not** move focus. Focus goes back to the trigger only if focus was inside the tooltip surface, which applies only to interactive surfaces such as toggletip and popover. Radix Tooltip and Spectrum/React Aria `useTooltipTrigger` implement exactly this latch.
  - Add a WTR test: hover → Escape → `open === false`, and still false 500ms later with the pointer unmoved.
- Effort: S

### VIS-5: Focus ring below 3:1 in both themes
- Severity: Major (WCAG 2.2 SC 1.4.11 Non-text Contrast; SC 2.4.13 Focus Appearance, AAA)
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: semantic token `--tulpar-color-focus-ring` (light `rgba(81, 78, 207, 0.4)`, dark `rgba(132, 151, 255, 0.6)`), used by every component and by the playground CSS (`apps/playground-vue/src/App.vue` `.settings-close:focus-visible`).
- Problem: a 2px outline with 2px offset, composited on the demo surface, measures **1.85:1** in light (#b0b3e6 on #f0f7f5) and **2.63:1** in dark. The ring sits next to the page surface, so it needs 3:1 against it.
- Evidence: `shots/visual/vue-focus-ring-light.png`, `shots/visual/vue-focus-ring-dark.png`; computed `outline: solid 2px rgba(81, 78, 207, 0.4) off 2px`; contrast computed in `node` (WCAG relative-luminance formula).
- Why it matters: keyboard users lose their place. A "potentially commercial" design system fails a WCAG AA SC by default.
- Correct solution:
  - Make the focus-ring token **opaque** per brand × mode, with ≥3:1 against `color.bg.surface` and `color.bg.subtle` in both modes.
  - Preferably use a two-tone ring that works on any surface: a 2px solid ring plus a 2px inner gap in the surface colour (`box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--ring)`).
  - Benchmarks:

    | System | Focus ring |
    |---|---|
    | IBM Carbon | `$focus` #0f62fe 2px + `$focus-inset` white |
    | GitHub Primer | 2px solid `focus.outlineColor` (opaque accent) |
    | GOV.UK | 3px yellow + black |

  - None of them uses a translucent ring.
- Effort: S

### VIS-6: K8 confirmed and extended — search-match highlight is invisible on active rows, in both themes
- Severity: Major
- Merge-blocking for current branches: Yes for `feat/v0.15-select-completion` (the feature it introduces is not perceivable on the row the user is on)
- Confidence: Verified
- Where: `packages/core/src/select/tulpar-option.styles.ts:322-327` (`mark[part="match"] { background: color-mix(in srgb, var(--tulpar-color-brand-default) 14%, transparent); color: inherit; font-weight: 600 }`), `:194-196` (active row `bg-subtle`), `:240-244` (selected+active brand 12%).
- Problem: contrast of the mark background against the row it sits on:

  | Row state | Contrast |
  |---|---|
  | Dark, active row (rgb 36,53,83) | **1.32:1** |
  | Light, active row | **1.12:1** |
  | Light, selected + active | **1.11:1** |

  The only remaining cue is font-weight 600. The component also hardcodes a `color-mix` recipe instead of using a semantic token. That breaks the 3-layer token contract: a brand cannot tune the highlight.
- Evidence: `shots/visual/ng-select-search-dark.png` and `shots/visual/vue-select-search-dark.png` ("Ankara" active row: the `An` mark cannot be seen); `review/vis-select.js` computed styles (`bg: color(srgb 0.129 0.851 0.553 / 0.14)`; active `bg rgb(36,53,83)`).
- Why it matters: the matched run is the feature's main affordance. It must survive the hover, active and selected states.
- Correct solution (token-level):
  - Add semantic tokens `color.highlight.text` and `color.highlight.bg` (CSS `--tulpar-color-highlight-text` / `--tulpar-color-highlight-bg`), bound per brand × mode in `brand/tulpar/*.ts`.
  - Use **foreground emphasis, not a tinted chip**:
    - `mark[part=match] { background: var(--tulpar-color-highlight-bg, transparent); color: var(--tulpar-color-highlight-text); font-weight: 600 }`.
    - Light: bind `highlight.text` to the brand text step that reaches ≥4.5:1 on `bg-subtle` and on the selected-active fill (a 700-ish step).
    - Dark: bind it to the brand 300/400 step (brand-default on the dark active row measures 6.65:1).
    - `highlight.bg` = transparent in both modes, or a ≥3:1 tint if a box is wanted.
  - Keep the `forced-colors: Mark/MarkText` branch.
  - Benchmarks:

    | System | Highlight treatment |
    |---|---|
    | VS Code quick-open | `list.highlightForeground`: accent text, no fill |
    | Linear / Raycast command menus | bold + accent foreground |
    | GitHub | `mark` with an opaque attention-muted fill sized for contrast on hovered rows |

- Interim: raise the alpha to ≥0.32 in dark and ≥0.28 in light (Interim only; still not themeable).
- Effort: S

### VIS-7: Vue Switch `on-color` never reaches the core
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/vue/src/switch/TulparSwitch.vue:11,61` (prop `onColor`); `apps/playground-vue/src/components/SwitchDemo.vue:125,345-361`.
- Problem: Vue normalises `on-color` to `onColor`. Keys of the form `on[A-Z]…` are treated as event listeners, so Vue warns "Wrong type passed as event handler to on-color". At runtime the core `tulpar-switch` has `on-color` attribute `null` and `.onColor === undefined`, while `off-color="kizagan"` arrives. The demo tells users to "Always bind these in Vue". The demo already binds it (`:on-color="'otuken'"`) and it still fails.
- Evidence: eval → `[{"attr":null,"off":"kizagan"}]`; console `[Vue warn]: Wrong type passed as event handler to on-color`. Screenshot `shots/visual/vue-switch-light.png` §9 (on-track stays default brand) vs `shots/visual/ng-switch-light.png`.
- Why it matters: a public API is unusable in one framework. The playground documents the bug as if it were a usage rule.
- Correct solution: do not name props `on*`, because that prefix is reserved for listeners in Vue (and in JSX/React and Solid). Rename the API in core and in all wrappers to `checked-color` / `unchecked-color` (this matches `aria-checked`, and is what Element Plus did when it moved off `active-color`). Keep `on-color` as a deprecated alias in core only, for one minor version, then remove it. Changeset as a breaking change on the Vue side.
- Effort: S

### VIS-8: No `color-scheme` for dark mode; native controls stay light; native select border equals its background
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: tokens CSS (`@tulpar-ui/tokens/css/tulpar.css`): no `color-scheme` anywhere (grep across `packages/tokens`, `packages/shell/src`, the playgrounds: only the unused Vite scaffold `style.css` has it).
- Problem: with `html.dark`, computed `color-scheme` is `normal`. Native checkboxes render as white squares, scrollbars stay light, and native `<select>` dropdowns stay light. In the dark playground panels, the native select's border colour equals its background (`rgb(36,53,83)` both), so the control has no visible boundary.
- Evidence: eval → `{"htmlCS":"normal","selBg":"rgb(36, 53, 83)","selBorder":"rgb(36, 53, 83) 1px solid"}`; screenshots `shots/visual/vue-select-dark.png`, `shots/visual/vue-badge-dark.png`, `shots/visual/tiles/vue-badge-dark_0.png` (white checkboxes, borderless selects).
- Why it matters: every consumer app gets light scrollbars, autofill and native pickers inside a dark Tulpar UI. web-design-guidelines: "`color-scheme: dark` on `<html>`".
- Correct solution: the brand × mode layer emits `:root { color-scheme: light; } .dark { color-scheme: dark; }`. If a brand later supports auto, use `color-scheme: light dark` with the `light-dark()` function. The playgrounds also add `<meta name="theme-color">` per mode.
- Effort: S

### VIS-9: The playgrounds do not use Tulpar's own controls
- Severity: Major (credibility of the product showcase)
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: 29 native `<select>` in `apps/playground-vue/src/components/*.vue` and 30 in `apps/playground-ng/src/app/demos/*.ts`; 15+ native checkboxes; `apps/playground-vue/src/App.vue` configurator (hand-made radio "segmented" control, hand-made close button).
- Problem: CLAUDE.md lists the configurator as out of scope for v0.6 ("needs Select/Switch/Checkbox first"). The configurator now **exists and works** in both apps: mode/layout/position/density, Escape closes it, persist-key works. Select, Switch, Checkbox, RadioGroup and Button have shipped since. Even so, every "Live playground" control panel and the configurator use unstyled native controls. In dark mode these produce the defects in VIS-8.
- Evidence: `shots/visual/vue-configurator-light.png`, `shots/visual/ng-rail-light.png`, every `*-dark.png` live-playground panel.
- Why it matters: the showcase does not trust its own components. Real composition bugs (form layout, density, dark) stay hidden instead of being caught in the playground.
- Correct solution:
  - Rebuild the playground control panels and the configurator from `tulpar-select`, `tulpar-switch`, `tulpar-checkbox` and `tulpar-radio-group` (a segmented ButtonGroup for mode/density).
  - Update the CLAUDE.md out-of-scope line, because its precondition is now met. This is an owner decision on scope wording; the change itself only touches the playgrounds.
- Effort: M

### VIS-10: Parity drifts between ng and vue (root cause: two hand-written page sets)
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where / Problem (mechanical diff with `review/vis-parity.js` + `review/vis-parity2.js`; full text diff in `review/vis-parity2-diff.txt`):
  - **/button:**
    - §17 title differs ("`:icon` prop — Lucide convenience API (v0.3.1)" vs "Named-component icon (Pattern 2)") and the example count differs (`tulpar-button` 4 vs 2; page total 85 vs 83).
    - §19 title differs ("Escape hatch — non-Lucide icon libraries" vs "Non-Lucide icon libraries").
    - Copy differs in §6–§12, §16, §18 (e.g. §12 Vue adds "…with a tooltip that explains why the action is unavailable").
    - Section heights differ by up to +157px (ng §6–§8, §16).
  - **Sidenav icons:** 24px in Vue vs 18px in Angular (measured `svg 24×24` vs `18×18`). Different glyphs for 4 items:

    | Item | Angular | Vue |
    |---|---|---|
    | RadioGroup | `Circle` | `CircleDot` |
    | CheckboxGroup | `CheckSquare` | `ListChecks` |
    | Toggletip | `MessageSquareText` | `MessageCircle` |
    | Popover | `PanelTop` | `MessageSquareText` |

    Vue also reuses `CircleDot` (RadioGroup + Chip) and `MessageCircle` (Toggletip + Message).
  - **Document title:** Vue never updates `document.title` (route `meta.title` is unused; it stays "Tulpar UI — Vue Playground"). Angular sets it, and the titles differ too ("RadioGroup — …" vs "Radio Group — …").
  - **index.html:** Vue has `description` + `og:*`; Angular has none.
  - **Height drifts** worth a look (Plausible content drift): switch §5 658 vs 897px, tooltip §8 709 vs 522px, guide "Menu & items API" 1255 vs 1562px.
- Evidence: `shots/visual/tiles/vue-button-light_0.png` vs `shots/visual/tiles/ng-button-light_0.png` (icon size); `shots/visual/vue-rail-dark-flyout.png` vs `shots/visual/ng-rail-dark-flyout.png` (different Overlay icons); `apps/playground-ng/src/app/app.ts:49-115` (`[size]="18"`, icon map) vs `apps/playground-vue/src/App.vue:71-140`.
- Why it matters: CLAUDE.md makes parity mandatory. The drift comes from structure: about 6,500 lines of per-page scoped CSS in Vue alone (ToastDemo 640, PopoverDemo 390 …), mirrored by hand in Angular, with no shared page spec.
- Correct solution:
  - One source of truth for page content: a framework-neutral spec per page (sections, ids, copy, example list) in a shared workspace file.
  - One shared stylesheet for the doc chrome (DocPage / DocSection / Example / CodeBlock), consumed by thin per-framework components.
  - A CI parity check: the heading + `tulpar-*` count diff I ran is ~40 lines of Playwright and would have caught every drift above, including the stale Select sections.
  - Make the Angular nav-item wrapper accept `LucideIconData` directly, like the Vue wrapper accepts components. That removes the 25 boilerplate `Icon*` components in `app.ts` and the size mismatch.
- Effort: M

### VIS-11: Vue NumberInput "Advanced — formatOptions" demo teaches a wrong pattern and throws
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `apps/playground-vue/src/components/NumberInputDemo.vue:35-47, 115-123, 318-340`.
- Problem: `ref="advancedRef"` on `<TulparNumberInput>` returns the **Vue component instance**, not the element. `advancedRef.value.formatOptions = …` writes to readonly props: "[Vue warn]: Attempting to mutate prop 'formatOptions'" and `TypeError: 'set' on proxy: trap returned falsish`. The wrapper already exposes a `formatOptions` prop (`TulparNumberInput.vue:45,67-73`). The demo copy ("set it via a template ref + watchEffect") is wrong.
- Evidence: console from the capture run (`review/vis-capture-out.json`, errors for `/number-input`).
- Why it matters: it documents an anti-pattern and a red console on a showcase page.
- Correct solution: `<TulparNumberInput :format-options="compactTRYOptions" … />`, with copy explaining that the wrapper forwards it as a DOM property. Match the Angular demo (`[formatOptions]`).
- Effort: S

### VIS-12: Horizontal overflow at 375px
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where / Problem: `main.scrollWidth > clientWidth` in both apps:
  - /select: 443/375 (§3 Sizes, §7 Placeholder & clearable, §12 Searchable: a `.demo-row` with a label column plus a fixed 240px select)
  - /progress: 401/375 (§2 Live driver)
  - /toast: 392/375 (§3, §5, §11 inline `tulpar-toast` 343px wide plus padding)
- Evidence: `review/vis-mobile.js` output; `shots/visual/vue-select-mobile.png`, `shots/visual/ng-progress-mobile.png`.
- Why it matters: the content scrolls sideways on phones (ui-ux-pro-max `horizontal-scroll`).
- Correct solution: below ~480px the demo-row stacks the row label above the items (`grid-template-columns: 1fr`). Components inside demos get `max-inline-size: 100%`. The inline-toast demo sets `inline-size: 100%`.
- Effort: S

### VIS-13: No landing page and no 404
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `apps/playground-vue/src/router.ts` (`/` → redirect `/button`; `/:pathMatch(.*)*` → redirect `/button`); `apps/playground-ng/src/app/app.routes.ts` (`''` and `**` → `button`).
- Problem: `/does-not-exist` silently shows Button in both apps (`finalUrl …/button`). There is no overview page with what Tulpar is, how to install it, a component index with status, or a link to the sibling playground.
- Evidence: `shots/visual/vue-does-not-exist-light.png`, `shots/visual/ng-does-not-exist-light.png` (identical to Button).
- Why it matters: broken deep links look like they work; first-time visitors land mid-reference. redesign-existing-projects: "No custom 404 page" is a standard omission.
- Correct solution: an Overview route at `/`, and a NotFound component on the catch-all route (Vue Router catch-all component, Angular `path: '**', component: NotFoundComponent`) that suggests the closest route.
- Effort: S

### VIS-14: Demo page template inconsistent; numbered h2s; no deep links
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where / Problem:
  - TextInput, Textarea and NumberInput use a filter-chip bar ("All / Basics / Formatting …") with unnumbered h2s, and the filter state is not in the URL. The other 18 component pages use a long "1. … 19." numbered h2 list. Colors and Guide use unnumbered h2s.
  - No h2 has an `id` or an anchor link, and there is no in-page TOC. The Button page is 12,000px tall with no way to link to "Loading states".
  - Numbered markers on non-sequential content are a templated tell (frontend-design: "numbering only when the content actually is a sequence"; design-taste "section-number eyebrows").
- Evidence: `shots/visual/vue-number-input-broken.png` (chips) vs `shots/visual/tiles/vue-button-light_0.png` (numbered); `grep activeSection` → only `NumberInputDemo.vue`, `TextInputDemo.vue`, `TextareaDemo.vue`.
- Why it matters: inconsistent IA across pages, and reference content that cannot be linked (ui-ux-pro-max `deep-linking`; web-design-guidelines "URL reflects state", "heading anchors need scroll-margin-top").
- Correct solution: one DocPage template.
  - Unnumbered h2 with a slug `id` and a hover anchor.
  - Sticky right-rail TOC at ≥1280px.
  - Optional page tabs (Examples / API / Accessibility) with state in the URL.
  - Benchmarks: Carbon, Polaris, Radix and MUI component docs all use this.
- Effort: M

### VIS-15: Colors page legibility and role copy
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `apps/playground-vue/src/components/ColorsDemo.vue` and `apps/playground-ng/src/app/demos/colors-demo.component.ts`.
- Problem:
  - Step labels use one fixed text colour, so the 300–600 labels are unreadable on mid-tone swatches (e.g. al-400, umay-500/600, gok-400–600, otuken-300/400).
  - The token name is shown only on hover ("Hover a swatch for its token name"), so keyboard and touch users cannot get it. There are no hex/OKLCH values and no copy action.
  - Role copy conflicts: the hero card says "tulpar — primary / success", the palette says "otuken — success / deep green", and the Button "Success" severity renders otuken.
- Evidence: `shots/visual/tiles/vue-colors-light_0.png`, `shots/visual/tiles/vue-colors-dark_0.png`.
- Why it matters: this is the reference page for the mythology palette. It must be readable and correct.
- Correct solution:
  - Pick the label colour per step by contrast (or from an `on-*` token per step).
  - Print token name and value inline.
  - Add click-to-copy with a toast.
  - State one role per family, sourced from the semantic layer (generate the role labels from `semantic/*.ts`, do not hand-write them).
  - Benchmarks: Radix Colors docs, Tailwind palette page, Carbon colour tokens page.
- Effort: S

### VIS-16: Visual weight — glow shadows, heavy unthemed code blocks, saturated panels
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where / Problem:
  - (a) Every solid button carries a brand-tinted outer glow plus a bevel. Computed: `inset 0 1px 0 rgba(255,255,255,.18), inset 0 -1px 0 rgba(0,0,0,.12), 0 1px 2px -1px oklch(.48 .11 157 / .9), 0 5px 14px -3px oklch(.72 .17 157 / .42)`. Nine glowing severities in a row read as "raised/glow" AI styling.
  - (b) Code blocks are a fixed warm near-black (`#15110b`). They are identical in light and dark, so a brown slab sits on the navy dark surface. They take a large share of every page's height, with no syntax highlighting and no copy button.
  - (c) Toast page "Use Toast when… / Use Dialog instead…" are fully saturated green and red panels.
  - (d) The Impeccable detector flags a 3px brand `border-left` "side-tab" accent in Tooltip, Toggletip and Popover demos in both apps (`TooltipDemo.vue:740`, `ToggletipDemo.vue:442`, `PopoverDemo.vue:798`, ng equivalents).
  - (e) Emoji used as demo content (🦄 in Chip avatar slot).
- Evidence: `shots/visual/tiles/vue-button-light_0.png`, `shots/visual/tiles/vue-button-dark_0.png`, `shots/visual/ng-toast-open-dark.png`; detector JSON `review/vis-detect.json`.
- Benchmarks (design-references):

  | System | Treatment |
  |---|---|
  | linear.app | "depth carried by surface ladder + hairline borders… resists drop shadows almost entirely" |
  | IBM Carbon | "Card hierarchy is carried by 1px hairlines and surface change, never by drop shadow" |
  | Vercel | "stacked shadows 4–12% black… never a single heavy drop-shadow" |
  | Stripe | Level 1 = `rgba(0,55,112,.08) 0 1px 3px` |

  None puts a coloured glow on a default button.
- Correct solution:
  - Solid button elevation = none, or the `shadow-xs` token (1px). Keep the "raised" modifier as the opt-in it already is.
  - Code blocks use semantic `color.bg.code` / `color.text.code` per mode, syntax highlighting (Shiki), a copy button, and collapse after ~8 lines ("Show code", as Storybook, Radix and MUI do).
  - Use-when/avoid boxes use the tonal `bg-subtle` + tone border.
  - Replace side-tab accents with a full hairline border.
- Effort: M

### VIS-17: Empty topbar; brand sits in the sidenav beneath it
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `apps/playground-vue/src/App.vue` `<TulparTopbar>` (only a 12px "Vue playground" label); same in Angular.
- Problem: a 64px full-width bar carries one muted 12px label. The brand, search and theme toggle sit in the sidenav under it, so the visual hierarchy is upside down.
- Evidence: `shots/visual/tiles/vue-button-light_0.png`.
- Correct solution: the topbar carries the brand mark plus the controls a docs surface needs:
  - framework switch (link to the sibling playground on the same route)
  - version / changelog link
  - ⌘K search
  - theme toggle
  - repo link

  Carbon, MUI and Radix docs all do this. This uses existing topbar slots only; no out-of-scope components such as the user-menu dropdown are needed.
- Effort: S

### VIS-18: Copy and terminology inconsistencies
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where / Problem:
  - The nav section is "Display & Status atoms" (internal jargon) while the page eyebrow says "DISPLAY & STATUS".
  - Nav labels are class names ("TextInput", "NumberInput", "RadioGroup", "CheckboxGroup") next to prose labels ("Sidebar & Theme").
  - Case styles are mixed ("Form Inputs" Title Case vs "Display & Status atoms").
  - Toast demos fire Turkish strings ("Depolama alanı %90 dolu.") inside an English playground.
  - `placeholder="Search..."` (TextInputDemo.vue:34) uses three dots instead of `…`.
  - Message page has a "4. Dark mode" section although dark is a global toggle.
- Evidence: `shots/visual/ng-toast-open-dark.png`; menu arrays in `App.vue:71-140` / `app.ts:590-663`.
- Correct solution: one copy register. Use human labels in nav ("Text input", "Radio group"); keep class names in code blocks. Use sentence case for nav and headings (web-design-guidelines and frontend-design). Keep demo strings in English, or demo i18n deliberately on a labelled example. Drop "atoms".
- Effort: S

### VIS-19: Select trigger's accessible name is the placeholder, not the label
- Severity: Minor
- Merge-blocking for current branches: No (check with the a11y agent)
- Confidence: Verified (accessibility tree)
- Where: `packages/core/src/select/tulpar-select.ts` (trigger naming).
- Problem: the Playwright a11y snapshot of /select §12 shows `generic "City"` followed by `button "Select a city"`. The label is not part of the trigger's accessible name.
- Evidence: snapshot excerpt in this session (`playwright-cli snapshot f219e791`).
- Correct solution: the APG select-only combobox (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/) sets `aria-labelledby="label-id trigger-value-id"`, so the name is "City, Select a city".
- Effort: S

### VIS-20: Static Tag gets `role="status"`
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/core/src/tag/tulpar-tag.ts:94-95` (`if (!this.hasAttribute("role")) this.setAttribute("role", "status")`).
- Problem: `status` is a live region. A page with 40 tags (the Tag demo) declares 40 polite live regions, and any label change is announced. The component's own copy calls Tag "static, read-only metadata".
- Correct solution: no role (plain text). If grouping is needed, consumers wrap tags in `role="list"` / `listitem`. Reserve `status` for Badge-like live counts that the consumer opts into. Carbon and Spectrum tags carry no live role.
- Effort: S

### VIS-21: Motion and asset nits
- Severity: Nit
- Merge-blocking for current branches: No
- Confidence: Verified
- Where / Problem:
  - (a) `packages/core/src/progress/tulpar-progress.styles.ts:115,129` animate `width` (layout).
  - (b) The detector flags overshoot easings `cubic-bezier(0.34,1.3–1.56,…)` in switch, radio and toast. The genjutsu lens rates switch, radio and toast swipe-back as acceptable feedback overshoot, so this is noted only.
  - (c) The Avatar demo depends on `i.pravatar.cc` (third-party request, privacy) and `invalid.example`, which logs `net::ERR_NAME_NOT_RESOLVED` as a console error on every visit.
  - (d) Fonts load from the Google Fonts CDN via `<link>` (GDPR/KVKK exposure, and no fonts offline).
- Correct solution:
  - (a) `transform: scaleX(var(--p))` with `transform-origin: inline-start` (genjutsu / ui-ux-pro-max `transform-performance`).
  - (c) Bundle 2 local avatar images; simulate the error state with a same-origin 404 path.
  - (d) Self-host via `@fontsource/source-sans-3` etc. with `font-display: swap`.
- Effort: S

### VIS-22: Dead Vite scaffold files
- Severity: Nit
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `apps/playground-vue/src/components/HelloWorld.vue`, `apps/playground-vue/src/style.css` (purple scaffold tokens, not imported by `main.ts`), `apps/playground-vue/src/assets/vite.svg`.
- Correct solution: delete them. They mislead readers (style.css is the only file in the repo that declares `color-scheme`).
- Effort: S

### VIS-23: The pre-existing Angular dev server served a stale bundle
- Severity: Info
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: process on :4310 (`ng serve`, started 10:02); merge commits at 10:50.
- Problem: `main.js` from :4310 has no "Data-prop authoring" string, so Select shows "11. Accessibility" with no v0.15 sections. A fresh server on :4311 has them. Anyone verifying v0.15 in the already-running Angular playground would wrongly conclude that parity is broken, or that it works. This is the gotcha CLAUDE.md already notes for `.angular/cache`.
- Correct solution: verification scripts always start a fresh `ng serve` (or `ng build` + static serve) per check. The Phase-4 parity CI job runs against a production build, not a watch server.
- Effort: S

---

## Things done well
- Mechanical parity is real: 21/23 routes have identical h2 lists and identical `tulpar-*` counts in both frameworks, including the large v0.15 Select page (16 headings).
- The dark theme is applied consistently through semantic tokens. Overlay surfaces portal with the theme (overlay-root mirrors `.dark`), and no light "islands" appeared in components (the islands are the native controls, VIS-8).
- Rail mode works in both apps, including the Angular wrapper nesting: 72px rail, hover flyout with group title, and correct active state (`shots/visual/*-rail-dark-flyout.png`).
- Overlays: the popover flips at the right edge (`*-popover-flip-*.png`). Toggletip closes on Escape **and returns focus** to the trigger, and closes on outside click. The configurator closes on Escape.
- Forced-colors handling on options and matches (`Highlight`, `Mark/MarkText`) and reduced-motion branches in Progress and Toast are carefully done.
- A skip link exists, `<html lang="en">` is set, and the Angular router sets per-route titles.
- Live-playground pattern (controls + live snippet) on every component page is the right teaching structure.

## Open questions for the owner
1. **Shell scroll model (VIS-3).** Move to document scrolling with a sticky topbar and sidenav (my recommendation), or keep the inner `main` scroller and own scroll restoration in the shell? This is an architecture change to `@tulpar-ui/shell`.
2. **Switch colour API rename (VIS-7).** Rename `on-color`/`off-color` to `checked-color`/`unchecked-color` in core and every wrapper, with a deprecation alias? It is a public API change.
3. **Configurator scope (VIS-9).** CLAUDE.md lists the configurator as out of scope "until Select/Switch/Checkbox exist". They now exist and a configurator ships in both apps. Should the out-of-scope line be updated, and the playground controls rebuilt from Tulpar components?
4. **Single-source playground content (VIS-10).** Do you accept a shared page spec + shared doc-chrome CSS + a CI parity job? This changes how playground pages are authored.
5. **Brand expression choices I did not mark as defects:**
   - Serif display headings (Source Serif 4) on a product-docs surface.
   - An indigo "Secondary" severity: Carbon and PrimeVue make secondary neutral; MUI's is a hue.
   - A navy-blue dark surface family ("mergen") under a green brand.

   They are coherent, but they are brand decisions. Confirm them deliberately, or put them through `design-references`.
