# 05 — Wrappers review (packages/angular + packages/vue)

## Area summary

- Scope: all 24 Angular wrappers/directives/services and all 24 Vue SFCs/directives/composables, compared against the public `@property`/event/slot surface of `packages/core` and `packages/shell` (extracted by script, see `review/wr/api.mjs`, `review/wr/parity.mjs`).
- The props surface is in good shape: almost every core property is forwarded in both frameworks. Signals-only Angular and `<script setup>` Vue are applied consistently.
- But two **verified Blockers** sit on `main` since June: (1) in Vue, the `label` prop of TextInput/Textarea/NumberInput never renders (no visible label, no accessible name); (2) in Angular, an overlay directive on any `*-ng` wrapper anchors to a `display:contents` element, so the tooltip renders at the viewport top-left and `aria-describedby` lands on a non-focusable node.
- Both have one root cause each: an inconsistent Vue slot-carrier rule, and the Angular "wrapper element around the custom element" architecture. The Angular architecture also causes the sidenav attribute-mirroring hack and breaks `<tulpar-button-group>` with wrapper children.
- The decision "wrappers need no ControlValueAccessor because the elements are form-associated" is **wrong for Angular**. Reactive/template-driven/Signal Forms do not read ElementInternals. Angular 22's stable `FormValueControl`/`FormCheckboxControl` is the right fix.
- Packaging: single entry points + no `sideEffects` mean that importing one wrapper registers every element. Angular hard-imports the "optional" `@angular/router`.
- Verdict: **Needs work** (API breadth is solid; integration architecture and Vue slot handling are weak).

## Findings table

| ID | Title | Severity | Merge-blocking | Confidence |
|---|---|---|---|---|
| WR-1 | Vue TextInput/Textarea/NumberInput: `label` prop never renders | Blocker | No (on main since 6e2036c) | Verified |
| WR-2 | Angular overlay directives on `*-ng` wrappers: wrong position + broken `aria-describedby` | Blocker | No (on main) | Verified |
| WR-3 | Angular double-element wrapper architecture is the wrong pattern | Major | No | Verified |
| WR-4 | No Angular Forms integration; the "FACE is enough" decision is false | Major | No | Verified (code+docs) / Plausible (runtime error) |
| WR-5 | Angular outputs named like native DOM events fire twice | Major | No | Verified (Angular source) |
| WR-6 | Vue slot forwarding is inconsistent (3 different strategies; `#label`, `#topbar` silently fail) | Major | No | Verified |
| WR-7 | No tree-shaking: single entry, side-effect imports of every element, no `sideEffects` | Major | No | Verified |
| WR-8 | Angular statically imports the optional peer `@angular/router` | Major | No | Verified |
| WR-9 | ButtonGroup: no wrapper in either framework; wrapper buttons are invisible to the group | Major | No | Verified |
| WR-10 | API parity gaps between core, Angular and Vue (matrix) | Minor | No | Verified |
| WR-11 | Angular binds state through attributes; inverted `allow-empty`; `value \|\| null` | Minor | No | Verified (code) |
| WR-12 | Overlay directive design: sibling insertion, one-shot ref lookup, unprefixed `openChange` | Minor | No | Verified (code) |
| WR-13 | SSR: Angular overlay directives and shell touch the DOM/window on the server | Minor | No | Plausible |
| WR-14 | README drift: documented APIs that do not exist | Minor | No | Verified |
| WR-15 | Package hygiene: spec `.d.ts` shipped, Vue toolchain off-catalog, tokens dep inconsistent | Minor | No | Verified |
| WR-16 | No Custom Elements Manifest → no typing for raw `<tulpar-*>`, hand-maintained parity | Minor | No | Verified |
| WR-17 | Test gaps hide wrapper bugs; Angular playground not zoneless | Minor | No | Verified |
| WR-18 | Small Angular idiom nits | Nit | No | Verified |

---

## Parity matrix (core → Angular / Vue)

Legend: OK = forwarded; **–** = missing; ≠ = forwarded but with a different name/shape. Base-class props (FormFieldBase, SelectionControlBase, SelectionGroupBase) are included in the comparison. Script output: `review/wr/parity.mjs`.

| Core element | Props | Events (core → NG / Vue) | Named slots (core → NG / Vue) |
|---|---|---|---|
| tulpar-button | NG OK, Vue OK (+ `icon`, `iconSize`, `ariaLabel` helpers in both) | native `click` → NG `clicked` ≠ Vue `click` | start/end/loading-icon → NG OK / Vue OK but carriers are unconditional (WR-6) |
| tulpar-button-group | `stacked` | – | **no wrapper in either** (WR-9) |
| tulpar-text-input | NG OK / Vue OK | `input`+`change` → NG `valueChange`+`change` (WR-5) / Vue `update:modelValue`+`change` | label/prefix/suffix → NG OK / Vue unconditional carriers → **label prop broken** (WR-1) |
| tulpar-textarea | NG OK / Vue OK (`prefix/suffixInteractive` not relevant) | NG `valueChange` only (**no `change`**) / Vue `update:modelValue`+`change` | label → NG OK / Vue unconditional (WR-1) |
| tulpar-number-input | NG **– `prefixInteractive`, `suffixInteractive`** / Vue OK | NG `valueChange` only (**no `change`**) / Vue `update:modelValue`+`change` | label/prefix/suffix → NG OK / Vue unconditional (WR-1) |
| tulpar-select | NG OK / Vue OK | `change` → NG `[(value)]`+`changed` ≠ Vue `v-model:value`+`change` | label/prefix/suffix/no-match OK; **loading/error/empty**: NG only via catch-all `<ng-content>`, Vue **–** for `#loading/#error/#empty` |
| tulpar-option | OK both (`highlight` is internal) | – | icon/description OK both (Vue `v-if` carriers) |
| tulpar-option-group | **– `disabled` in both** (core shipped it in v0.15) | – | label OK both |
| tulpar-switch | OK both (+`iconOn/iconOff`) | NG `[(checked)]`+`change` (WR-5) / Vue `v-model`+`change` | icon-on/off, label, description → NG OK / Vue **no named slots** (only literal `slot=` attr in default) |
| tulpar-checkbox | OK both; `indeterminate` is one-way in both (core clears it on click) | as switch | icon/label/description → NG OK / Vue **no named slots** |
| tulpar-radio | OK both | as switch | label/description → NG OK / Vue **no named slots** |
| tulpar-radio-group / checkbox-group | OK both | NG `[(value)]`+`change` / Vue `v-model`+`change` | label/description → NG OK / Vue **no named slots** |
| tulpar-tag / chip / avatar / skeleton / spinner / progress | OK both | chip `tulpar-click/remove` → `clicked/removed` both | OK both (Vue `v-if` carriers) |
| tulpar-badge | OK (`placement` reserved for Wave 2 — not a gap); Vue exports `BadgePlacement` type, NG does not | – | OK |
| tulpar-toast | OK (`iconProp`/`count` internal) | `tulpar-dismiss/action` → NG emits **CustomEvent** ≠ Vue emits **detail** | title/description/icon OK |
| toast service | NG `TulparToastService`/`TulparMessageService`, `provideTulparToast()` **takes no defaults** ≠ Vue `useTulparToast()`/`TulparToastPlugin` **accepts defaults** | | |
| tooltip/toggletip/popover directives | NG: text, placement, tone, arrow, offset, `openControlled` only; Vue: also crossOffset, containerPadding, boundary, flip, label, open, defaultOpen → **NG missing 6 config keys** | NG `openChange` / Vue `onOpenChange` callback | n/a |
| tulpar-shell | **`sidenavOpen` missing in both**; `sidenavCollapsed` one-way in both | `tulpar-shell-change` OK; `tulpar-menu-toggle` not surfaced in either | Vue `#topbar/#sidenav/#footer/#aside` outlets have **no carriers** (WR-6) |
| tulpar-sidenav / nav-item / nav-section / topbar | OK both | config/settings/logout OK; `tulpar-search`, `tulpar-theme-toggle` not surfaced (native bubbling works) | Vue topbar start/end unconditional carriers |

Exports: both entry points export every wrapped component. Type-name drift: Angular exports `SelectionSize as SwitchSize`, Vue exports `SelectionSize`. Neither exports a ButtonGroup wrapper.

Graphify hint (`FieldSize`/`SelectionSize` from core `_internal`): **cleared**. Vue and Angular import them from public entries (`@tulpar-ui/core`, `@tulpar-ui/core/switch`), which re-export from `_internal`. No `_internal` path appears in `packages/vue/dist/**/*.d.ts` or `packages/angular/dist/types` (grep: 0 hits).

---

### WR-1: Vue TextInput/Textarea/NumberInput — `label` prop never renders

- Severity: Blocker
- Merge-blocking for current branches: No (on `main` since commit 6e2036c, 2026-06-18)
- Confidence: Verified
- Where: `packages/vue/src/text-input/TulparTextInput.vue:108-110`, `textarea/TulparTextarea.vue:90`, `number-input/TulparNumberInput.vue:125-127`; core `packages/core/src/_internal/form-field-base.ts:99-114`
- Problem: the Vue wrappers always render `<span style="display:contents" slot="label"><slot name="label"/></span>`, even when the consumer passes no label slot. The core renders the prop as **slot fallback**: `<slot name="label">${this.label}</slot>`. An assigned empty span suppresses the fallback, so `<TulparTextInput label="Email">` shows no label. The core's `_hasLabelSlotContent()` also counts any child with `slot="label"`, so it believes a label exists.
- Evidence: Vue playground built from this branch (`apps/playground-vue/dist`), in Chromium:
  - `/text-input`: `label="Text (default)"`, label slot assigned = `SPAN:` (empty), rendered label text = `""`. Same result for "Email" and "URL".
  - `/textarea`: `label=Bio assigned=1 renderedLabelText=[]`. `/number-input`: `label=TRY (tr-TR) assigned=1 text=[]`.
  - Screenshot: `review/shots/wr-vue-textinput-label.png` shows the fields with no label text above them. Only placeholders are visible.
  - The later wrappers already know this rule. `TulparSidenav.vue:181-184` says: "An unconditional empty <span slot="x"> registers as assigned slot content".
- Why it matters: every Vue form field built with the prop form has no visible label and no accessible name (`<label for=control>` contains an empty slot). This fails WCAG 1.3.1, 2.4.6, 3.3.2 and 4.1.2. It is the primary input API.
- Correct solution: (1) Wrapper: render each named carrier only when the slot is filled: `<span v-if="$slots.label" style="display:contents" slot="label"><slot name="label"/></span>`. Apply this to every carrier in TextInput, Textarea, NumberInput, Button, and Topbar (see WR-6). (2) Core (cross-ref core agent): stop using "any assigned node" as the slot-wins test. Decide with `slot.assignedNodes({flatten:true})` + the existing `hasMeaningfulContent()` helper (`_internal/slot-content.ts`), and render the prop outside the slot when the slot has no meaningful content. This makes the core robust against any framework carrier. Shoelace/Web Awesome use this pattern (`HasSlotController`, which ignores empty/whitespace nodes).
- Effort: S

### WR-2: Angular overlay directives on `*-ng` wrappers anchor to a `display:contents` element

- Severity: Blocker
- Merge-blocking for current branches: No (on `main`)
- Confidence: Verified
- Where: `packages/angular/src/overlay/overlay-directive-base.ts:96-104` (`ensureHostId` on the directive host), `tulpar-tooltip.directive.ts:84-95`; core `tooltip/tulpar-tooltip.ts:469` (`anchor.getBoundingClientRect()`), `_internal/overlay/aria.ts:27-35`. The same pattern exists in the popover and toggletip directives.
- Problem: `<tulpar-button-ng tulparTooltip="…">` (the documented usage, `apps/playground-ng/src/app/demos/tooltip-demo.component.ts:35,153,199,309`) puts the `id` and the `for` target on `<tulpar-button-ng>`. That element is `:host { display: contents }` and has no box. The core measures this rect and writes `aria-describedby` onto it.
- Evidence: Angular playground dist, `/tooltip`: the wrapper `tulpar-trg-1` has `display: contents`, `rect [0,0,0,0]`. On hover over the real button at (386,316), the tooltip opens with surface at `x=12,y=8`, which is the viewport top-left. Screenshot: `review/shots/wr-ng-tooltip-on-wrapper.png`. ARIA: `wrapperAttrs=…,id,aria-describedby`; inner shadow `<button>` `aria-describedby=null`.
- Why it matters: every tooltip/popover/toggletip on a Tulpar Angular component is mispositioned. The description is not announced, because the focused element is the inner button, not the wrapper.
- Correct solution: fix the root cause in WR-3 (the host must be the custom element itself). Separately (cross-ref overlay agent), a directive on a shadow host still needs the core to expose the description on the focusable inner control. Use `ElementInternals`/`ariaDescribedByElements` where supported, or let `tulpar-button` delegate (as its `tooltip` prop already does). The Reference Target proposal (WICG) is the emerging standard.
- Interim: in `OverlayDirectiveBase`, resolve the anchor to the first rendered element child when `getComputedStyle(host).display === 'contents'`. Put the id there. This fixes position only.
- Effort: S (interim) / part of WR-3 (correct)

### WR-3: Angular double-element wrapper architecture (`<tulpar-x-ng>` + inner `<tulpar-x>`) is the wrong pattern

- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: every Angular component (`styles: [":host { display: contents; }"]` + template that renders the core tag); `packages/angular/src/shell/tulpar-sidenav.component.ts` (`afterNextRender` + `MutationObserver` mirroring `data-rail`, `data-collapsed`, `data-sidenav-open` from wrapper to core); CLAUDE.md "Angular wrapper selector".
- Problem: each Angular wrapper creates two elements. Everything that targets "the element" hits the wrong one:
  - Shell attributes land on `<tulpar-sidenav-ng>`. This is the current mirroring hack, and the memory note on A4/A2/rail regressions.
  - Overlay anchoring and ARIA break (WR-2).
  - `<tulpar-button-group>` uses `:scope > tulpar-button` and misses wrapper children (WR-9).
  - `id`/`class`/`aria-*`/`data-*`/`style` written by consumers on `<tulpar-x-ng>` never reach the custom element.
  - `role=listbox` gets `tulpar-option-ng` generic intermediates in its owned-element chain.
  - Two DOM nodes per atom double the node count in large lists (relevant for the Grid roadmap).
  - The CLAUDE.md rationale is incorrect: using the same selector only "recurses" if the wrapper's template re-renders the tag. The industry pattern never renders it.
- Evidence: `tulpar-sidenav.component.ts` (STATE_ATTRS mirror); `shell/src/shell/tulpar-shell.ts:200-234` writes `data-rail`/`data-collapsed` on `this.querySelector("[slot='sidenav']")`; WR-2 and WR-9 measurements; Vue does not have the problem because a single-root SFC renders the core element as its root, so attrs fall through.
- Why it matters: this is the source of a whole class of Angular-only bugs. It forces "mirror state attrs down" patches for every future container (Grid, Gantt, menus).
- Correct solution: the **proxy-component pattern** used by Ionic Angular and the Stencil Angular output target.
  - The Angular component's `selector` IS the custom-element tag (`selector: 'tulpar-button'`) and the template is `<ng-content/>`. Angular instantiates the real custom element as the component host, so there is exactly one element.
  - Inputs are pushed as **properties** onto `inject(ElementRef).nativeElement`: via `host: { '[severity]': 'severity()' }`, or an `effect()`/`afterRenderEffect()` per input group. Events are re-exposed as `output()`s or `model()` updates from host listeners (`host: { '(change)': '…' }`).
  - Extras such as the `icon: Type` convenience stay possible: a template `<span slot="start"><ng-container *ngComponentOutlet…/></span><ng-content/>` becomes the custom element's light-DOM children.
  - Trade-offs: (a) breaking selector change (`tulpar-button-ng` → `tulpar-button`). Do it before 1.0, and keep the old selector for one minor version with a dev warning. (b) Apps that also declare `CUSTOM_ELEMENTS_SCHEMA` and use the raw tag in the same component now get the Angular component. This is desired. (c) The pattern can be generated from a Custom Elements Manifest (WR-16).
  - For shell→sidenav state, cross-ref the shell agent: the correct core mechanism is `@lit/context` (a provider on `tulpar-shell`, a consumer in `tulpar-sidenav`), not attribute writes on slotted children. Context events are composed and bubble through any wrapper.
  - References: Ionic `@ionic/angular` proxies (`selector: 'ion-button'`, `template: '<ng-content></ng-content>'`); Stencil `@stencil/angular-output-target` (`proxyInputs`/`proxyOutputs`); Lit docs "Using Lit components in Angular".
- Interim: keep wrappers. Replace `display: contents` anchors with explicit forwarding (WR-2 interim) and keep the mirror. This is not recommended long-term.
- Effort: L

### WR-4: No Angular Forms integration — the "form-associated is enough" decision is false

- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (code + Angular docs); Plausible for the exact runtime error (not reproduced)
- Where: all Angular form wrappers; decision text in `docs/superpowers/specs/2026-06-09-tulpar-ui-v0.5-input-family-design.md:780` ("native form-association bubbles to Reactive Forms automatically"), `…v0.10-selection-family-design.md:390`, `…v0.14-select-design.md:140`, CLAUDE.md "Form-associated custom elements".
- Problem: Angular forms bind through `NG_VALUE_ACCESSOR` (or, since v22, the Signal Forms control contract). They never read `ElementInternals`/FACE state. `DefaultValueAccessor` only matches `input:not([type=checkbox])[formControl…]`, `textarea[…]`, `[ngModel]` on those, and `[ngDefaultControl]`. So `formControlName`/`[formControl]`/`ngModel` on `<tulpar-text-input-ng>` raises "No value accessor for form control". Repo grep finds no `ControlValueAccessor`, `NG_VALUE_ACCESSOR`, `FormValueControl` or `ngDefaultControl`. FACE only makes the value part of a **native** `<form>` submission and `FormData`.
  - Current shapes do not meet Angular 22's contract either. TextInput/Textarea/NumberInput use `value = input()` + `valueChange = output()`, which is not a `ModelSignal`. Checkbox and Switch have `checked = model()` **and** a `value` input. `FormCheckboxControl` declares `value?: undefined` ("must not define a value property"). No wrapper exposes a `touched` model, so blur never marks a control touched.
- Evidence: angular.dev DefaultValueAccessor selector list (search result above, angular.dev/api/forms/DefaultValueAccessor); angular.dev/guide/forms/signals/custom-controls: "Custom Signal Form Controls can be used with Signal, Reactive and Template-Driven Forms without any extra compatibility code"; angular.dev/api/forms/signals/FormCheckboxControl: "stable since v22.0", `readonly value?: undefined`.
- Why it matters: enterprise Angular apps (the stated target) build forms with Reactive Forms or, from v22, Signal Forms. Today they need hand-written glue for every field, which makes the library unusable in the most common Angular scenario.
- Correct solution (Angular 22, peer is `^22`):
  - TextInput/Textarea/NumberInput/Select/RadioGroup/CheckboxGroup implement `FormValueControl<T>`: `value = model<T>()`. Optional contract inputs: `disabled`, `readonly`, `required`, `invalid`, `errors`, `min/max/minLength/maxLength/pattern`. Add `touched = model(false)` set on `focusout`.
  - Checkbox/Switch implement `FormCheckboxControl`: `checked = model()`, and **rename** the submit-value input, because `value` is forbidden (owner decision below).
  - Map `errors()` to `errorText`/`invalid` so Signal Forms validation shows in the core UI.
  - This one contract serves `[formField]`, `formControlName` and `ngModel`, per angular.dev. No CVA is needed.
  - Fix the spec/CLAUDE.md text. Add one wrapper test per form control that binds `formControlName` and `[formField]`.
  - Vue: `v-model` on the wrappers works today. Recommended: migrate to `defineModel()` (Vue 3.4+, idiomatic). Make Select use plain `v-model` (`modelValue`) like the other value controls, or document why it uses `v-model:value`. `v-model` on a **raw** `<tulpar-text-input>` also works (Vue applies `vModelText` to custom elements: `input` event + `value` property). It is wrong for checkbox-like raw elements, so document "use the wrappers for v-model" (Plausible, not reproduced).
- Effort: M

### WR-5: Angular outputs named like native DOM events fire twice

- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (Angular runtime source); Plausible for the double-call in an app (not reproduced)
- Where: `change = output()` in `checkbox`, `switch`, `radio`, `radio-group`, `checkbox-group`, `text-input` components.
- Problem: the core dispatches `change` with `bubbles: true` (checkbox/switch also `composed: true`). It bubbles through the light-DOM wrapper host. For `(change)="h($event)"` on `<tulpar-checkbox-ng>`, Angular's `listenerInternal` registers **both** a native DOM listener on the host element **and** a subscription to the component output named `change`. `h` runs twice: once with the native Event, once with the re-emitted one. For radio/checkbox groups it can run three times (child native change, group native change, output).
  - Naming is also inconsistent: Select uses `changed`, Button `clicked`, Textarea and NumberInput have no change output at all.
- Evidence: `node_modules/.pnpm/@angular+core@22.0.0…/fesm2022/_debug_node-chunk.mjs:16022-16050`: `listenToDomEvent(...)` for element nodes, then `tNode.outputs?.[eventName]` → `listenToOutput(...)`. angular.dev/guide/components/outputs: "Avoid choosing output names that collide with events on DOM elements like HTMLElement."
- Why it matters: double side effects (double API calls, double toasts, double analytics).
- Correct solution: never name an output after a DOM event. Value changes are already covered by `model()` (`checkedChange`/`valueChange`). Remove the `change` outputs, or rename them to `tulparChange`. Document that the native `(change)`/`(input)` events still bubble from the host. Use one naming scheme across all wrappers in both frameworks (e.g., Angular `clicked/changed` ↔ Vue `click/change` is acceptable only if it is documented as a rule). Vue does not double-fire: declared `emits` are removed from fallthrough listeners.
- Effort: S

### WR-6: Vue slot forwarding uses three inconsistent strategies; idiomatic `#slot` usage silently fails

- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - (a) Unconditional carriers: `TulparButton.vue:131-134`, `TulparTextInput.vue:108-110`, `TulparTextarea.vue:90`, `TulparNumberInput.vue:125-127`, `TulparTopbar.vue:17,19`.
  - (b) Correct `v-if="$slots.x"` carriers: Select, Option, OptionGroup, Tag, Chip, Spinner, Progress, Toast, Sidenav.
  - (c) **No named slots**, only a default `<slot/>` relying on a literal `slot="label"` attribute: Checkbox, Switch, Radio, RadioGroup, CheckboxGroup.
  - (d) Named outlets **without** carriers: `TulparShell.vue` (`<slot name="topbar"/>` etc.).
- Problem: (a) breaks prop fallbacks (WR-1) and sets `data-has-start`/`data-has-end` on text-only buttons. (c) `<TulparCheckbox><template #label>…</template></TulparCheckbox>` renders nothing, because no `label` outlet exists. (d) `<TulparShell><template #topbar>…</template>` projects the topbar **without** `slot="topbar"`, so it lands in the shell's main content slot. The playground avoids (c) and (d) by using `slot="…"` attributes (`App.vue:183-210`, `CheckboxDemo.vue:83`). That is Vue 2 syntax, and eslint-plugin-vue's `vue/no-deprecated-slot-attribute` flags it in consumer templates (Plausible).
- Evidence: Vue playground `/button`: 42 of 48 text-only buttons carry `data-has-start` and `data-has-end`. This drives `:host([icon-separator][data-has-start]) .separator--start` in `tulpar-button.styles.ts:423`. Grep output for `slot="` per file is in the transcript.
- Why it matters: Vue users will write `#label`/`#topbar` first, because that is the idiomatic API. Silent failures plus the WR-1 Blocker show that the CLAUDE.md "Vue slot carrier gotcha" rule is not applied uniformly.
- Correct solution: one rule for every Vue wrapper. Each **named** core slot gets `<span v-if="$slots.x" style="display:contents" slot="x"><slot name="x"/></span>`. Keep the default `<slot/>` passthrough for advanced users. Add `defineSlots<{ label?(): any; … }>()` so Volar autocompletes slot names. Extract the carrier into one internal component (`SlotCarrier`) so the rule cannot drift. Update the playground to show `#label` (idiomatic) as the primary slot form.
- Effort: S–M

### WR-7: No tree-shaking — single entry point, every element registered on import, no `sideEffects`

- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/vue/package.json` / `packages/angular/package.json` (single `"."` export, no `sideEffects`); `packages/vue/dist/index.js:2-25` (bare `import "@tulpar-ui/core/button"; import "@tulpar-ui/core/text-input"; …` for every component); `packages/angular/ng-package.json` (one entry, one FESM); `packages/core/package.json` (no `sideEffects`).
- Problem: bare side-effect imports cannot be dropped by bundlers. `import { TulparButton } from "@tulpar-ui/vue"` pulls in and **registers** all ~25 custom elements (select, toast, shell, …) and their Lit code. The same holds for the Angular FESM.
- Why it matters: bundle size and startup cost. A commercial design system is judged on this.
- Correct solution: per-component entry points that mirror core's subpaths. Vue: `@tulpar-ui/vue/button` etc. via a Vite multi-entry lib build plus an `exports` map; keep the root barrel for convenience. Angular: ng-packagr **secondary entry points** (`@tulpar-ui/angular/button`, `/shell`, …), the Angular Material model. Declare `"sideEffects"` precisely: wrappers `false`; core lists its element-definition modules as side effects. Check with a bundle-size test (size-limit) in CI.
- Effort: M

### WR-8: Angular statically imports the "optional" peer `@angular/router`

- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/angular/src/shell/tulpar-shell.component.ts` (`import { NavigationEnd, Router } from "@angular/router"`); `packages/angular/dist/fesm2022/tulpar-ui-angular.mjs:8`; `package.json` `peerDependenciesMeta["@angular/router"].optional = true`.
- Problem: there is one FESM, and it statically imports the router. An app without `@angular/router` fails to resolve the module even if it only uses `TulparButtonComponent`. The subscription also uses `Router.events.subscribe`, an RxJS subscription, against the project's signals-only rule. On the server, `window.dispatchEvent` inside the NavigationEnd handler would throw (see WR-13).
- Why it matters: the declared optional peer is not optional, and installation fails for router-less apps.
- Correct solution: move router integration out of the component. Expose an `InjectionToken<TulparNavigate>` that the shell injects optionally. Ship `provideTulparRouter()` in a secondary entry point (`@tulpar-ui/angular/router`, see WR-7) that implements it with `Router.navigateByUrl`. For location-change notification, use `Router.currentNavigation()` (signal, Angular 20+) inside an `effect`, or the provider's own hook. This keeps RxJS out of the wrappers. The Vue wrapper already does this correctly (`globalProperties.$router`, no static import).
- Effort: S–M

### WR-9: ButtonGroup has no wrapper; wrapper buttons are invisible to `<tulpar-button-group>`

- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: core `packages/core/src/button-group/tulpar-button-group.ts:60` (`querySelectorAll(":scope > tulpar-button")`); no `button-group` folder in `packages/angular/src` or `packages/vue/src`; playgrounds use the raw element (`apps/playground-ng/src/app/demos/button-demo.component.ts:232-243`).
- Problem: an Angular consumer writes `<tulpar-button-group><tulpar-button-ng>…`. The group's direct children are `tulpar-button-ng`, so the group finds zero buttons. Result: no roving tabindex, no first/middle/last joining. A raw `<tulpar-button-group>` also forces the consumer to add `CUSTOM_ELEMENTS_SCHEMA`, with no typing.
- Evidence: in-browser simulation in the Angular playground: group with two `tulpar-button-ng(display:contents) > tulpar-button` children → `tabindex=null pos=null` for both buttons.
- Why it matters: ButtonGroup shipped in v0.1 and is a core composition primitive. It is unusable with Angular wrapper buttons.
- Correct solution: the WR-3 proxy pattern removes the problem (children are real `tulpar-button`s). Add `TulparButtonGroupComponent` / `TulparButtonGroup` wrappers (`stacked` prop + default slot) in both frameworks. Cross-ref core: query descendants that the group owns (as the selection groups already do, `selection-group-base.ts:94-100`), not only `:scope >`.
- Effort: S (wrappers) + WR-3

### WR-10: API parity gaps (from the matrix)

- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: see the parity matrix above.
- Problem:
  - `tulpar-option-group[disabled]` (v0.15 "group disabled parity") is not forwarded by either wrapper.
  - Angular NumberInput lacks `prefixInteractive`/`suffixInteractive`; Vue has them.
  - Angular overlay directives lack `crossOffset`, `containerPadding`, `boundary`, `flip`, `defaultOpen`, `label`; Vue has them.
  - Vue Select has no `#loading/#error/#empty` outlets.
  - Angular Textarea/NumberInput have no change output; Vue has `change`.
  - Toast `dismissed/action` payload: CustomEvent (NG) vs detail (Vue).
  - `provideTulparToast()` takes no defaults; the Vue plugin does.
  - Shell: `sidenavOpen` is not exposed and `sidenavCollapsed` is not two-way in either framework. Checkbox `indeterminate` is one-way, but the core clears it on click.
  - Type export names differ (`SwitchSize` vs `SelectionSize`).
- Why it matters: violates the CLAUDE.md parity rule and the "props-vs-slots dual support" rule. Users switching frameworks hit different APIs.
- Correct solution: close each gap. Make `sidenavCollapsed`, `asideOpen`, `indeterminate` and select `open` `model()`s / `v-model:x`. Accept `provideTulparToast(defaults?)` → `provideEnvironmentInitializer(() => toast.setDefaults(defaults))`. The structural fix is WR-16 (generate from a manifest, or test parity against it).
- Effort: S

### WR-11: Angular binds state through attributes; inverted `allow-empty`; `value || null`

- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified (code)
- Where:
  - `tulpar-number-input.component.ts`: `[attr.allow-empty]="allowEmpty() ? null : ''"` plus `[allowEmpty]="allowEmpty()"`.
  - `text-input`/`textarea`/`select`: `[attr.value]="value() || null"`.
  - `number-input`: `locale = input(navigator.language)`.
- Problem:
  - The attribute binding for `allow-empty` is **inverted**: `false` writes the attribute and therefore sets `true`. It only works because the property binding that follows overwrites it in template order.
  - `value() || null` removes the attribute for `""`. Lit's String converter then sets the property to `null`, not `""`, and core types `value: string`.
  - Binding non-reflected state through attributes also does not set the property when the property changed but the attribute did not.
  - `locale` defaults to the server's or client's `navigator.language`. In SSR this produces a hydration attribute mismatch.
- Why it matters: subtle state bugs, and fragile code that depends on binding order.
- Correct solution: bind **properties** (`[value]`, `[allowEmpty]`, `[autosize]`) for all state. Under `CUSTOM_ELEMENTS_SCHEMA` Angular sets them directly; with WR-3 they become host property bindings. Do not set `locale` unless the consumer provides one, and let the core default. Cross-ref core: boolean attributes that default to `true` (`allow-empty`, `autosize`, `use-grouping`) break the HTML boolean-attribute rule. The core's own `no-reveal-toggle` shows the correct negative-name form (`no-autosize`, …).
- Effort: S

### WR-12: Overlay directive design details

- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified (code)
- Where: `angular/src/overlay/*.ts`, `vue/src/overlay/overlay-directive-factory.ts`
- Problem:
  - The inline form appends the overlay element as a **sibling** of the host (`host.parentNode.appendChild`). This injects a foreign child into `<ul>`, `<tr>`, flex/grid layouts, `:last-child` CSS, and `<tulpar-button-group>`.
  - The Ref form resolves `getElementById(ref)` once in `ngOnInit`/`mounted`. A popover declared later (in an `@if` or another component) is silently never wired, and a change to `ref` is ignored (Angular).
  - `openControlled`/`openChange` are not prefixed, so a host with both `tulparTooltip` and `tulparPopover` (a common pattern) gets ambiguous bindings that fire both.
  - The Angular inline popover takes only a string, so rich content forces the Ref form with a raw `<tulpar-popover>`. That needs `CUSTOM_ELEMENTS_SCHEMA` in the consumer, with no typing.
- Correct solution: append the created overlay to a single overlay root (`document.body` or a library-owned container). The core already uses top-layer/Popover API and resolves `for` via `ownerDocument.getElementById`, which works from `body` for light-DOM hosts. Resolve the Ref target reactively (`effect` on `ref()` + retry in `afterNextRender`). Use prefixed models: `tooltipOpen = model()`, `popoverOpen = model()`. Ship thin typed components for the declared overlays (`tulpar-popover` proxy per WR-3) so the Ref form is typed.
- Effort: S–M

### WR-13: SSR safety of Angular overlay directives and shell

- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Plausible (no SSR build exercised)
- Where: Angular overlay directives `ngOnInit` (`doc.createElement` + `appendChild`); `tulpar-shell.component.ts` (`window.dispatchEvent` in a router subscription).
- Problem: on the server, the directives create and serialize foreign DOM nodes inside Angular-managed parents. This risks hydration mismatch (NG0500-family). `window` is undefined on the server when NavigationEnd fires during SSR. Vue is fine: directive `mounted` is client-only. Module-level `customElements.define` is safe under Node, because Lit's `node` build installs a `customElements` shim (`@lit/reactive-element/node/reactive-element.js`: `customElements??=`).
- Correct solution: perform DOM creation in `afterNextRender` (browser-only by contract) and guard `window` with `inject(PLATFORM_ID)`/`isPlatformBrowser`, or move it into the WR-8 provider. This is not "SSR optimization tuning" (out of scope). It is crash/hydration safety.
- Effort: S

### WR-14: README drift — documented APIs do not exist

- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/angular/README.md` (overlay section): `<tulpar-popover-ng …>` (no such component) and "`open` is a signal input" (actual: `openControlled`). `packages/vue/README.md:47-68`: imports `TulparPopover` (not exported), uses `v-tulpar-popover-ref` (actual: `v-tulpar-popover:ref`), and "`open` supports `v-model:open`" (no such component).
- Problem: the README describes the archived slot-model API (archive/v0.11-slot-model). Neither README documents forms integration, event names or slot syntax.
- Correct solution: regenerate the README examples from the playground's verified snippets. Add sections for Forms (WR-4), v-model names, slot syntax (WR-6) and per-component imports (WR-7).
- Effort: S

### WR-15: Package hygiene

- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - `packages/vue/tsconfig.json` excludes `**/*.test.ts` only, so `dist/select/TulparSelect.spec.d.ts`, `TulparOption.spec.d.ts`, … are published.
  - `packages/vue/package.json`: `vite ^5.1.0`, `vitest ^1.3.0`, `happy-dom ^14`, `@vitejs/plugin-vue ^5` are off-catalog (Angular uses `vite ^8`, `vitest ^3`). This matches the graphify hint for tokens.
  - `packages/angular/package.json` lists `@tulpar-ui/tokens` as a dependency but never imports it; Vue does not list it.
- Correct solution: exclude `**/*.spec.ts` from the dts build. Move Vue dev tooling to `catalog:`. Decide one policy for tokens: either both wrappers depend on `@tulpar-ui/tokens` (the CSS is required at runtime, so this is reasonable), or neither does and the README says to install it.
- Effort: S

### WR-16: No Custom Elements Manifest — raw elements untyped, wrappers hand-maintained

- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified (no `custom-elements.json`, no `customElements` field in any package.json)
- Problem: consumers who must use raw tags (declared overlays, button-group, any element without a wrapper) get no Volar or Angular Language Service typing. Core only augments `HTMLElementTagNameMap`. Wrapper APIs are hand-copied, and the WR-10 gaps are the drift.
- Correct solution: generate `custom-elements.json` with `@custom-elements-manifest/analyzer` and reference it via `"customElements"` in core's package.json. From it, generate (a) Vue `GlobalComponents`/JSX typings for raw tags, and (b) optionally the wrappers themselves (Stencil output-target style, Lit `@lit-labs/gen-wrapper-*`, `@wc-toolkit/*`), or at least a CI parity test that diffs each wrapper against the manifest. This also feeds IDE docs and Storybook autodocs.
- Effort: M

### WR-17: Test gaps hide wrapper bugs; Angular playground is not zoneless

- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: no Vue tests exist for `TulparTextInput`, `TulparTextarea`, `TulparNumberInput` (file list). All wrapper tests run in happy-dom. `apps/playground-ng/src/app/app.config.ts:11` uses `provideZoneChangeDetection` with `zone.js` polyfills, while `packages/angular/vitest.setup.ts` uses `provideZonelessChangeDetection`.
- Problem: "smoke only" let WR-1 and WR-2 live on main for 5 months. Happy-dom cannot catch slot-fallback rendering, layout anchoring or ARIA. New Angular 21+/22 apps are zoneless by default, so the hands-on surface does not reflect the consumer default.
- Correct solution: keep smoke tests, and add a small real-browser wrapper suite (Vitest browser mode + Playwright) per component: (1) prop → core property forwarding, (2) prop renders when no slot is used and slot wins when it is used, (3) two-way binding and event names fire once, (4) Angular forms binding (WR-4). Switch playground-ng to `provideZonelessChangeDetection()` and drop `zone.js`. The wrappers are already zoneless-compatible (signals, OnPush, template listeners).
- Effort: M

### WR-18: Angular idiom nits

- Severity: Nit
- Merge-blocking for current branches: No
- Confidence: Verified
- Where/Problem:
  - `standalone: true` on every component is redundant (default since Angular 19).
  - `@for (item of items(); track $index)` in `tulpar-sidenav.component.ts` reuses nav-item instances on reorder. Track by `item.href ?? item.label`.
  - `TulparToastService` is `providedIn: 'root'` **and** re-provided by `provideTulparToast()`. This is redundant and creates a second instance per environment injector.
  - The shell's `persistShellState` effect does DOM work; `afterRenderEffect` is the intended API.
  - Tests use deprecated `BrowserDynamicTestingModule`/`platformBrowserDynamicTesting`; use `BrowserTestingModule`/`platformBrowserTesting`.
- Effort: S

---

## Things done well

- Angular wrappers are consistently signals-only (`input()`, `model()`, `output()`, `computed`, `afterRenderEffect`). There is no `@Input/@Output` and no `rxjs` dependency in `package.json`. Every component is OnPush and zoneless-compatible.
- Property breadth: almost every core property is forwarded in both frameworks (script-verified). Non-serialisable props (`options`, `formOptions`, `valueLabel`, `actions`) correctly go through properties.
- The Vue router integration is exemplary: `vue-router` is truly optional (no static import; `globalProperties.$router`).
- The Vue overlay directive uses `mounted`/`beforeUnmount` (client-only, cleaned up). The Vue `external` regex keeps core subpaths out of the wrapper bundle.
- Core groups and select discover children with descendant queries, which tolerates wrappers. `slot-content.ts` already ignores Vue's `<!---->` placeholders.
- Types are re-exported only from public core subpaths. No `_internal` path leaks into either wrapper's `.d.ts` (graphify hint cleared).
- The overlay "directive on trigger, no slot-wrap" composition is the right model. Only the anchoring host is wrong (WR-2/WR-3).
- The toast API is thin, typed and identical across frameworks (`toast`/`message`).

## Open questions for the owner

1. **Angular architecture (WR-3):** adopt the Ionic/Stencil proxy pattern (selector = `tulpar-button`, one element) before 1.0? It is a breaking selector change. Option: keep the `-ng` selectors for one minor version with a deprecation warning.
2. **Checkbox/Switch submit value (WR-4):** Angular 22's `FormCheckboxControl` forbids a `value` member. Rename the Angular input (e.g., `submitValue`/`formValue`) while the core attribute stays `value`? Or keep `value` and skip Signal Forms support for these two controls?
3. **Vue v-model naming:** standardise Select on `v-model` (`modelValue`) like the other value controls? Or move all value controls to explicit `v-model:value` / `v-model:checked`? Either is fine, but pick one.
4. **Wrapper generation (WR-16):** keep hand-written wrappers plus a manifest-based parity test, or generate the thin layer from a Custom Elements Manifest and hand-write only the extras (icon components, router, toast)?
5. **Event naming rule (WR-5/WR-10):** one scheme across frameworks (e.g., value via `model`/`v-model`, domain events `tulparX`/`tulpar-x`, no outputs named after DOM events)?

Evidence artifacts: `review/shots/wr-vue-textinput-label.png`, `review/shots/wr-ng-tooltip-on-wrapper.png`, `review/wr/api.mjs`, `review/wr/parity.mjs`. Browser checks ran against the already-built `apps/playground-vue/dist` and `apps/playground-ng/dist/playground-ng/browser`, served from a temporary local static server that has been stopped. The repo is unchanged (`git status` clean).
