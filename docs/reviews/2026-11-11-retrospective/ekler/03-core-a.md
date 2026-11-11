# 03 — CORE-A: Button / Input family / Selection family / Shell — code review

Reviewer: CORE-A. Scope: `packages/core` (button, button-group, text-input, number-input + mask engine + intl builder,
textarea, `_internal/form-field-base`, checkbox, checkbox-group, radio, radio-group, switch,
`_internal/selection-control-base`, `selection-group-base`) and `packages/shell` (shell, topbar, sidenav, nav-item,
nav-section, search filter, rail flyout, mobile breakpoint). Read-only: source, tests, built `dist/`, git history.
Skills applied: `web-design-guidelines` (Vercel rules fetched 2026-11-11), `ui-ux-pro-max` (a11y/touch/forms checklist),
`impeccable` audit rubric.

## Area summary

The visual layer and the Lit structure are good: tokens with fallbacks, `:focus-visible`, reduced-motion blocks,
memory-safe listener cleanup, and many tests. The **form and a11y contract under the visuals is weak.**
- No component calls `ElementInternals.setValidity()`. `required`, `min`, `max`, `pattern` and `maxlength` never block
  a submit (CA-1).
- The text fields do not send their initial or programmatic `value` to the form. They also have no reset, disabled
  or restore callbacks (CA-2).
- `change` and `input` events are inconsistent, so framework `v-model`/`ngModel` can go stale (CA-3). Masked inputs
  never emit `input` (CA-4).
- Several controls can lose their accessible name: an icon-only button (CA-6), a checkbox/radio (CA-7, plausible), and
  every rail-mode nav item (CA-14).
- In the shell, the skip link cannot work from a shadow root (CA-12). The mobile drawer has no inert/focus containment
  (CA-13). The `dark` prop wipes the app's `.dark` class on first render (CA-15).
- All dev warnings are compiled out of the published `dist` (CA-20).

**Verdict: Needs work.** No finding was introduced by the branches under review (v0.15-select-completion, skills,
node-26). All of them already exist on `main`, so none blocks a merge. Several are release blockers for a
"commercial-grade" 1.0.

### Impeccable audit score (code-level)

| # | Dimension | Score | Key finding |
|---|---|---|---|
| 1 | Accessibility | 1 | Unnamed controls (CA-6/7/14), no constraint validation (CA-1), broken skip link (CA-12), no drawer inert (CA-13) |
| 2 | Performance | 3 | Fine overall; `Intl.NumberFormat` is rebuilt on every render; JS textarea autosize |
| 3 | Responsive | 2 | Field action buttons ≈18 px and steppers ≈18×10 px, below WCAG 2.5.8 (CA-18) |
| 4 | Theming | 3 | Semantic tokens + fallbacks; but `color` props inject primitive tokens from `.ts` (CA-10); focus ring 1.88:1 (CA-19) |
| 5 | Implementation integrity | 2 | Vocabulary drift (CA-10), dead dev warnings (CA-20), slot-detection heuristics (CA-23) |
| **Total** | | **11/20** | **Acceptable — significant work needed** |

## Findings table

| ID | Title | Severity | Confidence | Effort |
|---|---|---|---|---|
| CA-1 | No constraint validation anywhere (`setValidity` never called) | Blocker | Verified | M |
| CA-2 | Input family: initial/programmatic `value` not submitted; no reset/disabled/restore callbacks | Blocker | Verified | M |
| CA-3 | `change`/`input` event semantics broken in input family; v-model goes stale after clear/paste/step | Major | Verified (code) | M |
| CA-4 | Mask engine: no `input` events, ignores initial `value`, append-only editing, ASCII-only letters, IME-unsafe | Blocker | Verified (code) / Plausible (IME) | L |
| CA-5 | Input/selection hosts are not focusable (`delegatesFocus` missing); Enter does not submit the form | Major | Verified | S |
| CA-6 | Button: host `aria-label` is never forwarded → icon-only buttons have no accessible name; `data-disabled` has no ARIA and lets clicks through | Blocker | Verified (code) | S |
| CA-7 | Checkbox/radio `role` span is not labelled by the wrapping `<label>`; `_ariaLabel()` is dead code; switch name includes description | Blocker | Plausible (high) | S |
| CA-8 | NumberInput is not an APG spinbutton; locale-unaware parsing corrupts values; float drift; percent/currency traps | Major | Verified | M |
| CA-9 | `formDisabledCallback` overwrites the author's `disabled`; reflected `checked` has no `defaultChecked` | Major | Verified | S |
| CA-10 | Library vocabulary split: `severity` vs `tone`, `warn` vs `warning`, `outlined` vs `outline`, `tonal` vs `soft-tonal`, three meanings of `color` | Major | Verified | M |
| CA-11 | Groups reuse the name `change` with two shapes → two `change` events per click | Major | Verified (code) | S |
| CA-12 | Shell skip link points to an id inside the shadow root → does nothing; test asserts the wrong thing | Major | Verified (spec) / Plausible (runtime) | S |
| CA-13 | Overlay/mobile sidenav: closed drawer stays in the tab order; open drawer/aside do not inert the background | Major | Verified (code) | M |
| CA-14 | Rail mode: nav links have no accessible name (`.label{display:none}`, icon `aria-hidden`) | Blocker | Verified (code) | S |
| CA-15 | `<tulpar-shell>` removes the document `.dark` class on first render; no `color-scheme` | Major | Verified (code) | S |
| CA-16 | Nav-item ARIA: `aria-haspopup="true"` on a disclosure, dangling `aria-controls`, disabled not exposed, flyout ignores child `disabled`, `unsafeSVG` still used | Minor | Verified | S |
| CA-17 | Keyboard models use `document.activeElement` → break for data-driven sidenav items and nested shadow roots | Minor | Verified (code) / Plausible (runtime) | S |
| CA-18 | Touch targets below 24 px (clear/reveal/copy/paste ≈18 px, steppers ≈18×10 px); comment claims 44 pt | Major | Verified (CSS) | S |
| CA-19 | Focus ring token 1.88:1 on white (fails SC 1.4.11); input ring is box-shadow only → invisible in forced-colors | Major | Verified (computed) | S |
| CA-20 | Every `warnDev` is compiled out of the published `dist` | Major | Verified (dist) | S |
| CA-21 | Hard-coded English UI strings in core inputs and shell; sidenav exposes label props, shell/inputs do not | Minor | Verified | S |
| CA-22 | ButtonGroup always forces `role=toolbar` + roving tabindex; disabled members trap the arrow keys | Minor | Verified (code) | S |
| CA-23 | Lit hygiene: update-in-`updated`, `Object.defineProperty` accessor hack, non-reactive slot detection, uncleared timers | Minor | Verified | M |
| CA-24 | Sidenav filter: `toLowerCase()` without Turkish/diacritic folding (inconsistent with Select); global Ctrl/Cmd+K | Minor | Verified | S |
| CA-25 | Shell exposes no `banner`/`contentinfo` landmarks | Minor | Verified | S |
| CA-26 | Test gaps: no axe checks, no fieldset/validity/initial-value/accessible-name tests, no data-driven keyboard test | Major | Verified | M |
| CA-27 | Graphify hint: `FieldSize`/`SelectionSize` boundary — NOT a violation (re-exported via public subpaths) | Info | Verified | S |
| CA-28 | Physical CSS properties in input family/shell (`margin-left`, `left:`) | Nit | Verified | S |

---

### CA-1: No constraint validation anywhere (`setValidity` never called)
- Severity: Blocker
- Merge-blocking for current branches: No (pre-existing)
- Confidence: Verified
- Where: `packages/core/src/_internal/form-field-base.ts` (whole file), `_internal/selection-control-base.ts`, `text-input/tulpar-text-input.ts:156-176`, `number-input/tulpar-number-input.ts`, `textarea/tulpar-textarea.ts`
- Problem: `grep -rn "setValidity|checkValidity|reportValidity|states.add" packages/core/src packages/shell/src` (non-test files) returns **zero hits**. The inner `<input required maxlength pattern>` lives in a shadow root, so it has no form owner. Its validity never reaches the outer `<form>`. Results:
  - `<form><tulpar-text-input name=a required></form>` submits empty.
  - `form.checkValidity()` is always `true`.
  - `:invalid` and `:user-invalid` never match the host.
  - An unchecked `required` checkbox/radio-group/switch submits.
  - `min`/`max` on number-input are only clamped on blur, never reported.

  `invalid` is a purely manual boolean.
- Evidence: the grep above returns only `formResetCallback`/`formDisabledCallback` (selection) and `delegatesFocus` (button, nav-item). No test file contains `validity` or `checkValidity` (see CA-26).
- Why it matters: this is the core value of a form-associated custom element (FACE). Native form validation, `requestSubmit()` blocking, Angular `Validators.required` on native binding and the browser's error bubble all silently fail. Users can submit invalid data.
- Correct solution: mirror the native control into ElementInternals after every value/constraint change:
  - Text fields: `this._internals.setValidity(input.validity, input.validationMessage, input)`. The 3rd argument is the **anchor** that the browser bubble points to.
  - Selection controls: compute flags yourself, e.g. `{valueMissing: required && !checked}`. Radio-group handles `valueMissing` once for the group.
  - Expose `checkValidity()`, `reportValidity()`, `validity`, `validationMessage` and `willValidate` as pass-throughs to `_internals`.
  - Drive `invalid` styling from `:state(user-invalid)` through `CustomStateSet` (Baseline 2024). Set it after first blur/submit, like native `:user-invalid`. Keep the `invalid` prop as an author override. Add `customError` via a `setCustomValidity(msg)` method.
  - References: HTML spec "Form-associated custom elements" + `ElementInternals.setValidity`; Web Awesome/Shoelace `FormControlController` (`sl-input` mirrors `input.validity`); Material Web `md-outlined-text-field` (`mixinConstraintValidation`).
- Effort: M

### CA-2: Input family: initial/programmatic `value` not submitted; no reset/disabled/restore callbacks
- Severity: Blocker
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `text-input/tulpar-text-input.ts:202-206` (only `_onInput`, `_onClear`, `_onPaste` and the mask call `setFormValue`), `textarea/tulpar-textarea.ts:181-187`, `number-input/tulpar-number-input.ts:127,195,230`, `_internal/form-field-base.ts` (no `formResetCallback`, `formDisabledCallback` or `formStateRestoreCallback`)
- Problem:
  - `<form><tulpar-text-input name="email" value="a@b.c"></form>` → `new FormData(form).get("email") === null` until the user types. The same happens for `el.value = "x"`, the Vue `:value` binding and the Angular `value` input.
  - `form.reset()` does not clear or restore text, textarea or number fields.
  - `<fieldset disabled>` does not disable them. They stay focusable and look enabled.
  - Bfcache/autofill restore is not handled.

  The selection family does this correctly (`updated()` calls `setFormValue` on `checked`/`value` changes; `checkbox.ts:50-58`), so the two families are inconsistent.
- Evidence: the only text-input FormData test types first (`tulpar-text-input.test.ts:25-36`). No test covers an initial value or a reset.
- Why it matters: edit forms (pre-filled records) submit empty fields. This causes silent data loss on a server-side form post.
- Correct solution: in `FormFieldBase.willUpdate`/`updated`, when `value` changes, call `setFormValue(serialised value)` and refresh validity (CA-1). Add these to the base:
  - `formResetCallback()`: restore `defaultValue`, i.e. the `value` attribute. Use the native split: the attribute is the default, the property is the current value; do not reflect `value`.
  - `formDisabledCallback(d)`: set a private `_formDisabled`, and use effective disabled = `disabled || _formDisabled` (see CA-9).
  - `formStateRestoreCallback(state)`.

  This is the pattern used by Shoelace/Web Awesome (`defaultValue` + `formResetCallback`), Material Web, and FAST `FormAssociated`.
- Effort: M

### CA-3: `change`/`input` event semantics broken in the input family
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (code); runtime effect Plausible
- Where: `text-input/tulpar-text-input.ts:173-176, 227-236, 250-269`; `textarea/tulpar-textarea.ts:41-56, 154`; `number-input/tulpar-number-input.ts:120-129, 217-232`; Vue `vue/src/text-input/TulparTextInput.vue:64-66,105-106`; Angular `angular/src/text-input/tulpar-text-input.component.ts:63-64`
- Problem:
  1. The native `change` of the inner `<input>`/`<textarea>` is **not composed**, so it never leaves the shadow root. A host `change` listener therefore never fires on normal type-and-blur. It fires only on clear/paste (text-input) or paste (textarea).
  2. Clear and paste update `value` but dispatch **only `change`**. The Vue wrapper updates `modelValue` on `input` and the Angular wrapper uses `(input)`. After the user clicks "Clear", the model still holds the old text and the UI shows empty.
  3. Number-input never dispatches `input`. Typing only updates `_typingBuffer`; `value` changes on blur. It dispatches `change` on **every** blur, even with no edit, and on every stepper tick.
  4. `bubbles:true` without `composed:true` on the host's own events, while the selection controls use `composed:true`. This is inconsistent.
- Evidence: line refs above; HTML spec: `change` and `input` from inner controls; `change` is not a composed event.
- Why it matters: forms bound with v-model/ngModel/reactive forms hold wrong state. Analytics and "dirty" tracking miss commits.
- Correct solution: define one event contract for every value-bearing component and document it:
  - `input`: on every user-driven value change, including clear, paste and stepper. Re-dispatch as `new Event("input", {bubbles:true, composed:true})` from the host when the native one does not reach it.
  - `change`: on commit only. That is blur-with-diff, Enter, clear, paste, stepper release or selection. Re-dispatch the inner native `change` from the host.
  - Never dispatch either for programmatic sets.

  This matches native elements and Shoelace/Web Awesome (`input` + `change`, plus `wa-*` aliases). Wrappers then bind `input` for the model and forward `change`.
- Effort: M

### CA-4: Mask engine is not production-safe
- Severity: Blocker (for any masked field used through a wrapper)
- Merge-blocking for current branches: No
- Confidence: Verified (code). IME/mobile behaviour is Plausible.
- Where: `_internal/mask-engine.ts:42-206`, `text-input/tulpar-text-input.ts:43-57, 150-153, 202-225, 427-467`
- Problem:
  1. **No `input` event.** `_onBeforeInput` calls `preventDefault()`, so no native `input` fires. `MaskController._setRaw` never dispatches anything: the `MaskHost.dispatchEvent` member exists (`mask-engine.ts:119`) but is never called. The Vue/Angular models therefore never update for masked fields.
  2. **The initial/programmatic `value` is ignored.** The display is computed from `_rawValue` (`displayString()`), and nothing derives `_rawValue` from `value`. `<tulpar-text-input mask="999" value="123">` renders `___`.
  3. **Editing is append-only.** Only `insertText` and `deleteContentBackward` are handled, always at the end. Caret position and selection are ignored, so select-all-and-type appends. `deleteContentForward`, `deleteByCut`, `insertReplacementText` (autocomplete) and `insertFromDrop` are swallowed.
  4. **IME / Android.** `insertCompositionText` beforeinput is not cancelable. The DOM then diverges while `_onInput` returns early (`if (this._maskCtl) return`). This affects Gboard and CJK input.
  5. **Letters are ASCII-only.** `tokenAccepts` uses `/[A-Za-z]/`, so Turkish letters (Ç Ğ İ Ö Ş Ü) are rejected by `A`/`a`/`L`. `toUpperCase()` is locale-agnostic (`i`→`I`, not `İ`). The plate demo in a Turkish product rejects valid input.
  6. **Partial values submit placeholders.** In masked emit mode, `applyMask(raw, tokens, slotChar)` emits `"12-3_"` to the form.
  7. The demo text "A=letter" (`playground-vue TextInputDemo.vue:365`) contradicts the engine (A = uppercase letter).
- Evidence: line refs; tests cover only the append path (`tulpar-text-input.test.ts:323-470`). There is no initial-value, caret, IME or v-model test.
- Repro (for the visual agent): Vue playground → Masks → type into the "Phone" field and watch the bound ref. Expected: it updates. Predicted: it stays `""`.
- Why it matters: masks are used for phone, IBAN, plate and card numbers, i.e. high-value data entry.
- Correct solution: process on `input` (not `beforeinput`) with selection-range-aware conformance:
  - Read `selectionStart`/`selectionEnd`, compute the new raw value, and re-apply the mask.
  - Restore the caret with `setSelectionRange`.
  - Let composition finish (`compositionend`) before conforming.
  - Derive raw from `value` in `willUpdate`.
  - Use Unicode classes (`/\p{L}/u`, `/\p{Nd}/u`) and `toLocaleUpperCase(lang)`.
  - Emit `input`/`change` per CA-3.
  - Treat an incomplete mask as `valueMissing`/`patternMismatch` via `setValidity`.

  This is what Maskito (Taiga UI, framework-agnostic, `beforeinput` + `input` with selection ranges) and IMask do. Consider adopting Maskito's core as a dependency instead of maintaining a bespoke engine.
- Interim: dispatch `input` in `_setRaw`, and derive raw from `value` in `willUpdate`.
- Effort: L

### CA-5: Input/selection hosts are not focusable; Enter does not submit
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `form-field-base.ts` (no `shadowRootOptions`), `selection-control-base.ts` (same). Only `button/tulpar-button.ts:92-95` and `shell nav-item:41-44` set `delegatesFocus`. `text-input/tulpar-text-input.ts` has no Enter handling.
- Problem:
  - `el.focus()` on `<tulpar-text-input>`, `-number-input`, `-textarea`, `-checkbox`, `-radio` and `-switch` does nothing. "Focus first invalid field", Angular `ViewChild.focus()` and router focus restore all break.
  - An external `<label for="id">` does not focus the control and does not name it: FACE hosts are labelable, but the host has no role and the inner control is in the shadow root.
  - Implicit form submission (Enter in a single-line field) does not work. The inner `<input>` has no form owner.
- Why it matters: WCAG 3.3.1 error-recovery patterns, and keyboard users expect Enter to submit.
- Correct solution:
  - Set `shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true}` on both bases (keep the checkbox/radio roving `tabIndex` logic on the host).
  - In text-input/number-input, on `keydown Enter` (not during IME composition), call `this._internals.form?.requestSubmit()`. Shoelace/Web Awesome `wa-input` does exactly this.
  - Track the **Reference Target** proposal (`shadowRootOptions.referenceTarget`, Chromium origin trial). It fixes external `<label for>` and `aria-labelledby` across the boundary. Until then, document "use the `label` prop".
- Effort: S

### CA-6: Button: host `aria-label` not forwarded; `data-disabled` is not exposed to AT
- Severity: Blocker
- Merge-blocking for current branches: No
- Confidence: Verified (code); the AX-tree result is standard cross-root behaviour
- Where: `button/tulpar-button.ts:213-215` (warns only), `301-330` (inner `<button>`/`<a>` gets no `aria-label`), `139-140` + `styles.ts:469-484` (`data-disabled`); test `tulpar-button.test.ts:192-201` asserts that clicks pass through
- Problem:
  1. The documented usage is `<tulpar-button icon-only aria-label="Save">`. The focusable element is the shadow `<button>`, whose name comes from slotted content (an icon, usually unnamed). `aria-label` on a role-less host is ignored, because it is prohibited on a generic element. The focused button announces as "button" with no name. The dev warning only checks that the host attribute exists, so the broken pattern looks "correct".
  2. `data-disabled` ("soft-disabled") looks disabled but does **not** set `aria-disabled` and does **not** block activation (a test asserts click passes through). Screen-reader and mouse users get an enabled, working control that looks disabled. Also, `data-*` attributes belong to page authors per the HTML spec; a component should not claim one as public API.
- Why it matters: WCAG 4.1.2 Name, Role, Value fail on every icon-only button. Icon-only buttons are common in toolbars and grids, which are the roadmap targets.
- Correct solution:
  - Forward the host ARIA to the inner control. Read `this.getAttribute('aria-label')` (observe `aria-label`, `aria-describedby`, `aria-pressed`, `aria-expanded`, `aria-haspopup`, `aria-controls`). Render it on the inner `<button>`, and set `this._internals.role = 'presentation'` so the host is not a duplicate node. Material Web uses this exact pattern (`requestUpdateOnAriaChange` + `ariaLabel` forwarding).
  - Also accept a `label` prop for icon-only buttons (Web Awesome `label`).
  - Rename `data-disabled` to `soft-disabled` (Material Web) or `focusable-disabled`. Set `aria-disabled="true"` and suppress activation (keep focusability). APG: aria-disabled elements stay focusable but must not act.
- Effort: S

### CA-7: Checkbox/radio role span is not labelled; `_ariaLabel()` is dead code
- Severity: Blocker (if confirmed)
- Merge-blocking for current branches: No
- Confidence: Plausible (high). HTML-AAM associates `<label>` only with *labelable* elements; a `<span role=checkbox>` is not one.
- Where: `_internal/selection-control-base.ts:195-198, 232-247`; `checkbox/tulpar-checkbox.ts:98-112`; `radio/tulpar-radio.ts:84-95`; `switch/tulpar-switch.ts:96-110`
- Problem:
  1. The focusable control is `<span role="checkbox|radio" tabindex=0>` inside `<label class="root">`. The label text is a sibling slot, not content of the span, and the span's own content is `aria-hidden`. Nothing points to the label text: no `aria-labelledby`, and the label element does not label a span. The checkbox can therefore be announced as "checkbox, not checked" with no name.
  2. `_ariaLabel()` returns `this._hasLabel() ? undefined : this.label`. When `_hasLabel()` is false, `label` is falsy, so it **always** returns `undefined`. This is dead code, and there is no path for an aria-label-only checkbox.
  3. Switch uses a real `<button>`, so the wrapping label does name it. But the label wraps the description too, so the accessible name becomes "Notifications Receive weekly email…". The description should be a description (`aria-describedby`), not part of the name.

  No test asserts an accessible name for checkbox/radio/switch (grep: only one switch test checks that `aria-label` is absent).
- Repro (visual agent): Playwright `page.getByRole('checkbox', { name: 'Accept terms' })` on the playground checkbox, or `page.accessibility.snapshot()`. Expected: a named checkbox. Predicted: empty name (at least in Firefox/Safari; Chromium heuristics may differ).
- Correct solution:
  - Give the label span an id and set `aria-labelledby="<labelId>"` on the control (same shadow root, so it works). Set `aria-describedby="<descId> <msgId>"`.
  - Forward a host `aria-label` (as in CA-6) when there is no visible label.
  - For the switch, move the description out of the accessible name with `aria-labelledby` pointing to the label part only.
  - Add accessible-name tests (`computedRole`/`computedName` via WTR + Playwright, or `chai-a11y-axe`).
  - References: APG Checkbox / Radio / Switch patterns; Shoelace uses a native `<input type=checkbox>` in the shadow root with a `<label>`, which also removes the click-forwarding hack in `_onRootClick`.
- Effort: S

### CA-8: NumberInput is not an APG spinbutton; parsing is locale-unaware
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `number-input/tulpar-number-input.ts:71-90, 120-129, 173-203, 234-242`; `_internal/intl-format-builder.ts:19-44`
- Problem:
  1. **Not a spinbutton:** `<input type=text inputmode=decimal>` has no `role="spinbutton"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` or `aria-valuetext`. There is no PageUp/PageDown (APG: large step). Ctrl+Arrow ×100 is non-standard.
  2. **Parse corrupts values:**
     - `replace(/[^\d.,\-]/g,"").replace(",", ".")` replaces only the first comma and ignores the locale.
     - en-US `1,234.5` → `"1.234.5"` → `parseFloat` = **1.234**.
     - tr-TR `1.234,5` → `"1.234.5"` → **1.234**.

     The value is silently wrong after blur.
  3. **Float drift:** `cur + direction*step*multiplier` with `step=0.1` gives `0.30000000000000004`. There is no step-base snapping.
  4. **`format-style="percent"`:** value 0.5 displays "50 %". On focus the buffer is `"0.5"`. A user who types "50" gets 5000 %.
  5. **`format-style="currency"` without `currency`:** `new Intl.NumberFormat(locale,{style:"currency"})` throws `TypeError` inside `render()`, which kills the element. An explicit min>max fraction-digits pair also throws `RangeError`.
  6. `new Intl.NumberFormat(...)` is rebuilt on every render through a getter (perf nit).
- Why it matters: ERP/finance consumers (the roadmap targets AG-Grid-class apps) would get wrong numbers silently.
- Correct solution:
  - Add `role="spinbutton"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and `aria-valuetext` (formatted string) on the input. Add PageUp/PageDown = `step × 10` (APG Spinbutton).
  - Derive group/decimal/minus symbols from `Intl.NumberFormat(locale).formatToParts(-12345.6)` and parse with them. React Aria's `NumberParser` (`@internationalized/number`) is the reference; it also handles percent/currency/unit round-trips.
  - Round the result to the step's precision (`Number((v).toFixed(decimals(step)))`) and snap to `min + k·step`.
  - Validate the options in `willUpdate` (try/catch → `warnDev` + fallback to decimal).
  - Memoise the formatter on option changes.
- Effort: M

### CA-9: `formDisabledCallback` overwrites the author's `disabled`; reflected `checked` has no `defaultChecked`
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `_internal/selection-control-base.ts:131-133`; `checkbox.ts:22,43-48,61-65`; `radio.ts:29,39-43`; `switch.ts:29,48-52`; interaction with `selection-group-base.ts:161-176`
- Problem:
  1. `formDisabledCallback(d){ this.disabled = d; }` writes the public, reflected prop. The sequence `<tulpar-checkbox disabled>` in a `<fieldset>` → fieldset disabled → fieldset enabled sets `disabled=false` and loses the author's state. It also defeats the group's `data-group-disabled` marker bookkeeping, because the reflected attribute now looks "own".
  2. `checked` is reflected, so the `checked` attribute tracks live state. Native semantics are attribute = default and property = current. `_initialChecked` is captured in `connectedCallback`, so a wrapper that sets `checked` before insertion silently becomes the "default", and re-parenting re-captures it.
- Correct solution:
  - Keep `_formDisabled` private state and compute `effectiveDisabled = disabled || _formDisabled`. Expose it through `:state(disabled)` / the `:disabled` pseudo-class (FACE hosts already match `:disabled` when form-disabled).
  - Adopt `defaultChecked`/`defaultValue` (attribute-backed, non-reflecting `checked` property), as native, Shoelace (`@defaultValue('checked')`) and FAST do.
- Effort: S

### CA-10: Library vocabulary split (severity/tone, warn/warning, outlined/outline, tonal/soft-tonal, `color`)
- Severity: Major (API design debt, cheap to fix only before 1.0)
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - `button/tulpar-button.ts:13-24` (`severity`: primary|secondary|info|success|**warn**|help|danger|contrast|premium; `variant`: solid|**outlined**|**tonal**|ghost|link)
  - atoms `badge.ts:6-7`, `tag`, `chip`, `spinner.ts:13`, `progress`, `popover.ts:34`, `toggletip.ts:25` (`tone`: neutral|info|success|**warning**|danger; `variant`: **soft-tonal**|**outline**|solid)
  - `form-field-base.ts:7,55,60` (`variant`: **outlined**|filled|underlined|ghost; boolean `warn` + `warn-text`)
  - `color` meanings:
    - Button `color` = family name → **primitive `-700`** via `style.setProperty` (`button.ts:237-256`)
    - Selection `color` = family name → **primitive `-500`** *or any raw CSS* (`selection-control-base.ts:47-49`)
    - Switch `on-color`/`off-color` (`switch.ts:41-44`)
    - Spinner `tone="custom"`
  - `docs/roadmap.md:118-122` already locked the `tone` vocabulary for the atoms; Button (v0.3, PrimeNG-style) never migrated.
- Problem: the same concept has 2–3 names depending on component age. The `color` props also inject `var(--tulpar-primitive-color-*)` from `.ts`. The ESLint primitive-token rule only covers `*.styles.ts` (CLAUDE.md), so this bypasses the multi-brand layer. A second brand cannot re-map those buttons, and `-700` does not flip in dark mode.
- Why it matters: consumers must memorise per-component spellings (`warn` vs `warning`). Typed wrappers multiply the drift, and renames get more expensive with every release.
- Correct solution: one cross-component vocabulary, as in Web Awesome 3 / Shoelace:
  - semantic **`variant`/`tone`**: `brand|neutral|success|warning|danger` (+`info`);
  - visual **`appearance`**: `accent|filled|outlined|plain` (and `filled-outlined`), applied identically to button, badge, tag, callout and input.

  Fluent 2 uses the same split (`appearance` + `shape` + `size`), and Spectrum 2 uses `variant` + `fillStyle` + `staticColor`. For Tulpar:
  - Rename `severity`→`tone` with the roadmap vocabulary. Keep `help|contrast|premium` as button-only extras, or drop them.
  - Standardise one fill axis: `solid|soft|outline|ghost|link`.
  - Make `color`/custom tone go through a **semantic** custom-tone layer (the existing `_internal/tone/tone-resolver.ts` already does this for atoms), never primitives from TS.
  - Extend the lint rule to `*.ts` string literals containing `--tulpar-primitive-`.
  - Ship deprecated aliases for one minor release, with a changeset.
- Effort: M

### CA-11: Groups reuse the name `change` with two shapes → two `change` events per click
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (code)
- Where: `radio-group/tulpar-radio-group.ts:115-150`, `checkbox-group/tulpar-checkbox-group.ts:117-137`, children `checkbox.ts:77`, `radio.ts:71`
- Problem: a child dispatches `Event('change', {bubbles, composed})`. The group listens on itself but does not stop propagation, then dispatches `CustomEvent('change', {detail:{value}})`. A consumer's `group.addEventListener('change', …)` receives **two** events per user action with different shapes: one has `e.detail` undefined, the other has the value. The JSDoc admits this ("the raw child change events still bubble"). Vue's `@change` / Angular `(change)` on the group fire twice.
- Correct solution: the group should own a single canonical event. Either stop propagation of child `change` at the group and re-dispatch one `change` (as native radios effectively do per group), or keep native-like child events and emit a distinct `tulpar-change`/`value-change` from the group. Shoelace `sl-radio-group` emits one `sl-change`; React Aria uses `onChange(value)` on the group only. Add a test "one change per click".
- Effort: S

### CA-12: Shell skip link cannot work from a shadow root
- Severity: Major (WCAG 2.4.1 Bypass Blocks is partly met by landmarks, but the visible skip link is broken)
- Merge-blocking for current branches: No
- Confidence: Verified (HTML spec fragment navigation); runtime Plausible
- Where: `shell/src/shell/tulpar-shell.ts:254,259`; test `tulpar-shell.test.ts:16-22`
- Problem: `<a href="#tulpar-shell-content">` and `<main id="tulpar-shell-content">` are both in the shell's shadow root. Fragment navigation ("find a potential indicated element") searches the **document** tree, not shadow roots. Activating the link does not scroll and does not move the sequential-focus starting point. `<main>` also has no `tabindex="-1"`, so even a resolved target would not take focus. The test passes because it checks `shadowRoot.getElementById(target)`, which the browser never does.
- Repro: Tab once on the playground (the skip link appears) → Enter → Tab again. Expected: the first focusable element in content. Predicted: the first sidenav item.
- Correct solution: handle the click — `preventDefault()`, then `main.focus({preventScroll:false})` with `tabindex="-1"` on `<main>`, then `main.scrollIntoView()`. Make the text a prop (`skip-link-label`, CA-21). Test it by asserting `shadowRoot.activeElement === main` after a click.
- Effort: S

### CA-13: Overlay/mobile sidenav: no inert/focus containment
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (code)
- Where: `shell/tulpar-shell.styles.ts:107-121` (closed = `transform: translateX(-100%)` only); `tulpar-shell.ts:125-146, 237-275`
- Problem:
  1. On mobile or in overlay mode, the **closed** sidenav is only translated off-screen. It has no `visibility:hidden`, `inert` or `display:none`, so every link stays in the Tab order while invisible. This fails WCAG 2.4.7/2.4.11 (focus not visible/obscured).
  2. While the drawer (or the aside) is **open**, `<main>`, the topbar and the footer are not `inert`, and there is no focus containment. Tab walks behind the scrim. The aside is correctly `inert` when closed, but the sidenav is not.
  3. The Escape listener is on `document` and ignores `e.defaultPrevented`. Escape inside a Select popup inside the aside closes both.
  4. `_focusPanel` queries light-DOM focusables in `[slot=sidenav]`, but `tulpar-sidenav`'s controls live in its shadow root. It always falls back to the host and adds `tabindex="-1"` to the consumer's element.
- Correct solution:
  - Closed: `inert` + `visibility:hidden` on `.sidenav` (after the transition, via `transition-behavior: allow-discrete` or `transitionend`).
  - Open (modal drawer): set `inert` on the topbar/main/footer containers inside the shadow root. Better, render the drawer as a modal `<dialog>` (`showModal()`), which gives top layer, inert background, Escape and focus return for free (APG Dialog (Modal) pattern; Material Web navigation drawer, Fluent `Drawer type="overlay"`).
  - Honour `e.defaultPrevented` on Escape.
  - Focus the sidenav through its own `focus()` (with `delegatesFocus` on `tulpar-sidenav`).
- Effort: M

### CA-14: Rail mode: nav links have no accessible name
- Severity: Blocker
- Merge-blocking for current branches: No
- Confidence: Verified (code)
- Where: `shell/src/nav-item/tulpar-nav-item.styles.ts:161-170` (`:host([data-rail]) .label { display:none }`); `tulpar-nav-item.ts:429-433` (icon `aria-hidden="true"`), `545-547` (leaf tooltip span `aria-hidden="true"`, outside the `<a>`)
- Problem: in rail mode the only text in the link is `display:none`, and the icon is `aria-hidden`. The hover/focus "tooltip" is a separate `aria-hidden` span. Every leaf link in the collapsed rail is announced as "link" with no name. A group button keeps its name only in the flyout `aria-label`, not on the button.
- Correct solution: visually hide instead of removing — `.label` gets the sr-only clip pattern (`position:absolute; width:1px; height:1px; overflow:hidden; clip-path: inset(50%); white-space:nowrap`). Alternatively, set `aria-label=${label}` on the `<a>`/`<button>` when `data-rail` is present. Make the visual tooltip `aria-hidden` (or drop the duplicate). Add a test: rail → `a` accessible name equals the label.
- Effort: S

### CA-15: `<tulpar-shell>` removes the document `.dark` class on first render
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (code; Lit records initial field defaults in the first `changedProperties`)
- Where: `shell/tulpar-shell.ts:42-43, 178-188`
- Problem: `dark = false` is a reactive default, so the first `updated()` sees `changed.has("dark")`. It runs `document.documentElement.classList.toggle("dark", false)`, wrapped in `startViewTransition`. An app that sets `.dark` before the shell upgrades (an anti-FOUC head script, a server-rendered class, or the "Berdan" Tailwind pattern from CLAUDE.md) flashes back to light unless it also sets the prop. A component mutating a global document class is also a strong side effect for a library. `color-scheme` is never set, so native scrollbars and form controls stay light in dark mode (Vercel guideline "color-scheme: dark on html").
- Correct solution:
  - Make theme ownership opt-in. Either `dark` is `undefined` by default and the shell writes only when the value is explicitly set (initialise from `documentElement.classList.contains('dark')`), or theme handling moves to a small `themeController`/`persistShellState` helper.
  - When writing, also set `document.documentElement.style.colorScheme`.
  - Skip the view transition on the first update.
- Effort: S

### CA-16: Nav-item ARIA details
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `shell/src/nav-item/tulpar-nav-item.ts:486-504, 472-479, 177-196, 430`; styles `57-60`
- Problem:
  - (a) Group `<button aria-haspopup="true">` in **inline** mode is a disclosure, not a menu. `aria-haspopup=true` means `menu`, so SRs announce "menu, submenu". APG Disclosure Navigation uses `aria-expanded` + `aria-controls` only.
  - (b) `aria-controls=${_flyoutId}` is rendered in inline mode, but the flyout (with that id) only exists in rail mode. This is a dangling IDREF, and the inline `.children` has no id.
  - (c) Disabled leaf: `tabindex=-1` + `pointer-events:none`, but no `aria-disabled` and the `href` is kept, so SR virtual-cursor activation still navigates.
  - (d) The flyout child model (`href, label, active, iconHTML`) drops `disabled`, so disabled children are live links in rail.
  - (e) The inline `icon` still uses `unsafeSVG`. The project's own memory note `reference_lit_directive_dual_instance_crash` says to avoid it, and the flyout was migrated away but this call was not.
- Correct solution:
  - Inline: remove `aria-haspopup`, give `.children` an id, and point `aria-controls` at it.
  - Rail: the flyout is a group of links, so keep `aria-expanded` and drop `haspopup`.
  - Disabled: render without `href` and with `aria-disabled="true"` (APG link guidance).
  - Carry `disabled` into the child model.
  - Replace `unsafeSVG` with the same imperative `innerHTML` setter already used in `updated()`.
- Effort: S

### CA-17: Keyboard models rely on `document.activeElement`
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified (code); runtime Plausible
- Where: `button-group/tulpar-button-group.ts:96`; `shell/sidenav/tulpar-sidenav.ts:187-207`
- Problem: when focus is inside a shadow root, `document.activeElement` is the **outermost** host.
  - Sidenav data-driven `items` render inside the sidenav's shadow root, so `document.activeElement === <tulpar-sidenav>`. `findIndex` returns −1 and ArrowUp/Down do nothing in data-driven mode. Only the slotted mode is tested (`tulpar-sidenav.test.ts:190-216`).
  - The same failure hits ButtonGroup and the sidenav whenever the app itself renders inside a shadow root (Angular `ViewEncapsulation.ShadowDom`, Lit apps).
- Correct solution: resolve the current item from the event (`e.composedPath()`: find the first path element that is in the item list), or use `this.getRootNode().activeElement` / the item's `:focus-within`. Add a data-driven keyboard test.
- Effort: S

### CA-18: Touch targets below 24 px
- Severity: Major (WCAG 2.2 SC 2.5.8, AA)
- Merge-blocking for current branches: No
- Confidence: Verified (CSS arithmetic)
- Where:
  - `text-input/tulpar-text-input.styles.ts:19-90`: clear/reveal/copy/paste = 14 px svg + 2 px padding ≈ **18×18 px**, spaced 4 px apart.
  - `number-input/tulpar-number-input.styles.ts:21-37`: steppers = 10×6 svg + 2/4 px padding ≈ **18×10 px** each, stacked with 0 gap.
  - `textarea.styles.ts`: same buttons.
  - The code comments ("Auto-hide at xs (cannot meet 44pt touch target)", `tulpar-text-input.ts:272,308`) imply that the other sizes do meet it. They do not.
- Problem: the 2.5.8 spacing exception does not apply (adjacent targets closer than 24 px). Arrow keys are not an "equivalent control on the same page".
- Correct solution: give each action button `min-inline-size/min-block-size: 24px` (Tulpar's own enterprise bar should be 32 px at md). Enlarge the hit area with an invisible `::before` (`inset: -4px`) to keep the visual density. Steppers: one full-height 24 px-wide column split in two (Carbon NumberInput, Fluent SpinButton). Add `touch-action: manipulation`.
- Effort: S

### CA-19: Focus ring contrast and forced-colors
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (computed); forced-colors effect Plausible
- Where: `tokens/src/brand/tulpar/light.ts:119,325,354` (`rgba(81,78,207,0.40)`); used by `form-field-base.styles.ts:182-219` (box-shadow ring), `selection-control-base.styles.ts:168-176`, `button.styles.ts:458-466`
- Problem:
  - kam-500 at 40 % on white = **1.88:1** (computed in Python with WCAG relative luminance). That fails SC 1.4.11 Non-text Contrast (3:1) and SC 2.4.13. Dark mode is 3.2:1 on `#18181b` (passes).
  - The input family draws focus **only** with `box-shadow` and sets `outline:none` on the inner `<input>` (`text-input.styles.ts:8`, `number-input.styles.ts:8`, `textarea.styles.ts:14`). Forced-colors mode removes box-shadow, so focused inputs show no indicator in Windows High Contrast.
  - The input family and the whole shell have zero `@media (forced-colors: active)` rules (grep count 0). Button and selection have them.
- Correct solution:
  - Use a solid focus-ring token (≥3:1 against adjacent colours), e.g. kam-500 at 100 % with 2 px outline + 2 px offset. Pair it with a halo if the soft look is wanted (two-tone ring: GitHub Primer, Fluent 2).
  - On inputs, use `outline: 2px solid transparent` as the base, so forced-colors paints it, and `.control-row:has(:focus-visible){ outline-color: … }`.
  - Add forced-colors blocks for field borders, the nav-item active indicator, and the switch track.
- Effort: S

### CA-20: Every `warnDev` is compiled out of the published package
- Severity: Major (silent loss of the a11y guardrails the project relies on)
- Merge-blocking for current branches: No
- Confidence: Verified (built artefact)
- Where: `core/src/_internal/warn-dev.ts:11-26`; built `packages/core/dist/warn-dev-BUb2H4m0.js`:
  ```js
  const c = { DEV: !1, PROD: !0 };
  ... const o = typeof import.meta < "u" ? c : void 0, ... t = (o == null ? void 0 : o.PROD) === !0 || n === "production";
  ((o?.DEV) === !0 || ... || !t) && !t && console.warn(...)
  ```
- Problem: Vite library mode statically replaces `import.meta.env` at the **library's** build. `PROD` is baked as `true`, so `t` is always true and no consumer ever sees the icon-only aria-label warning, the autocomplete warning, etc. They work only in the repo's own source-level tests.
- Correct solution: do what Lit does. Ship a `development` export condition (a dev build with warnings) next to the default production build (`"exports": {".": {"development": "./dist/dev/index.js", "default": "./dist/index.js"}}`). Vite/webpack/Angular CLI pick `development` in dev automatically. Alternatively, rely only on `process.env.NODE_ENV`, which the consumer's bundler replaces (React approach), and never reference `import.meta.env` in library source.
- Effort: S

### CA-21: Hard-coded English UI strings
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - `text-input.ts:279,321,344,383`: "Show/Hide password", "Clear value", "Copied", "Paste from clipboard"
  - `form-field-base.ts:91,117`: "Checking…", "(required)/(optional)"
  - `number-input.ts:142,157`: "Increment/Decrement"
  - `textarea.ts`
  - `shell.ts:254,264,270`: "Skip to content", "Close panel", "Open navigation"
  - `nav-item.ts:440`: `dotLabel ?? "status"`
- Problem: `tulpar-sidenav` exposes every label as a prop (`nav-label`, `toggle-label`, `search-label` …), but the shell and the input family do not. A Turkish product (the owner's own market) cannot localise these strings.
- Correct solution: one strategy library-wide:
  - a small `@tulpar-ui/core` localisation controller (`setTulparLocale({ clear: "Temizle", … })` + `lang`-aware lookup, as Shoelace `@shoelace-style/localize` does), and
  - per-instance override props for the most common strings.
- Effort: S

### CA-22: ButtonGroup always forces `role=toolbar` + roving tabindex
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified (code)
- Where: `button-group/tulpar-button-group.ts:18-24, 61-66, 94-123`
- Problem:
  - APG: "use toolbar only for 3+ controls". Here a "Cancel / Save" pair becomes a toolbar, and Tab skips the second button (roving), which surprises users in dialog footers.
  - Disabled buttons stay in the roving set. Arrow keys onto one move `tabindex` but `focus()` fails (the inner button is disabled), so focus stays put while `tabindex=0` is on the wrong item.
  - The MutationObserver does not watch `disabled`.
- Correct solution: default to `role="group"` with natural Tab order. Offer an explicit `toolbar` (or `segmented`) mode for roving. Skip `[disabled]` in roving, or use focusable-disabled (`soft-disabled`, CA-6). References: Spectrum `sp-button-group` (group), Carbon ButtonSet (no roving), APG Toolbar.
- Effort: S

### CA-23: Lit hygiene items
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where / Problem:
  - `textarea.ts:168-179`: sets `this.autosize = false` inside `updated()`. This triggers a second update (Lit "change-in-update" warning) and mutates a public prop from another prop. Autosize is JS measurement, has no ResizeObserver for width changes, and ignores padding in the `minRows*lineHeight` maths.
  - `text-input.ts:22,59-78`: `clearable` uses `noAccessor` + an instance `Object.defineProperty`. Setting `el.clearable = true` after first render never calls `requestUpdate()`, so the clear button does not appear until something else re-renders.
  - `form-field-base.ts:99-101`, `selection-control-base.ts:143-149`, `selection-group-base.ts:190-192`: label/description presence is detected with `children.some(c => c.slot === "label")` during render. This is not reactive to later slotting. The Vue wrappers always render a carrier `<span slot="label">`, so "has label" is always true under Vue (an empty `<label>` renders, and `data-has-label` is always set). The atoms already use the robust `_internal/slot-content.ts` (`hasMeaningfulContent(slot.assignedNodes({flatten:true}))`).
  - Timers are not cleared on disconnect: `form-field-base.ts:90` `_liveAnnouncementTimer`; copy/paste/rejection `setTimeout`s in text-input/textarea/number-input.
- Correct solution:
  - Derive autosize in `willUpdate` (`_effectiveAutosize = autosize && rows === undefined`). Use CSS `field-sizing: content` with `min-block-size: calc(var(--min-rows) * 1lh)` / `max-block-size` as the primary path (Chromium 123+), with the JS fallback behind `CSS.supports`.
  - Model `clearable` as `clearable?: boolean` (undefined = auto) with a normal reactive property.
  - Use `hasMeaningfulContent` on `slotchange` → `@state` everywhere (attribute-toggle pattern per the known slotchange-loop memo).
  - Clear timers in `disconnectedCallback`.
- Effort: M

### CA-24: Sidenav filter matching
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `shell/sidenav/tulpar-sidenav.ts:311,335,460-469`
- Problem:
  - `toLowerCase()` is not locale-aware: `"İstanbul".toLowerCase()` → `"i̇stanbul"` (with a combining dot), so the query "ist" does not match. There is no diacritic folding, while `core/_internal/listbox/filter.ts` (Select, v0.15) already folds Turkish and diacritics. Two search behaviours exist in one library.
  - Ctrl/Cmd+K is grabbed globally whenever a sidenav with search is mounted, including when the mobile drawer is closed (it focuses an off-screen input).
- Correct solution: share one fold/match utility. Cross-package `_internal` import is forbidden, so copy it (≤50 lines per `internal-layering.md`) or promote it to a shared package. Gate the hotkey on visibility and allow `hotkey=""` to disable it.
- Effort: S

### CA-25: Shell has no `banner`/`contentinfo` landmarks
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `shell/tulpar-shell.ts:255,262` (`<div class="topbar">`, `<div class="footer">`); `topbar/tulpar-topbar.ts:19-29` (no `<header>`)
- Problem: only `main`, `nav` and `complementary` exist. The topbar and footer are generic, so screen-reader landmark navigation misses them.
- Correct solution: `tulpar-topbar` sets `this._internals.role = "banner"` (or renders `<header>`). The shell footer region gets `role="contentinfo"`. This is the APG Landmark Regions pattern.
- Effort: S

### CA-26: Test gaps (important behaviour not covered)
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (grep over every `*.test.ts` in scope)
- Where: `core/src/{button…switch}/*.test.ts`, `core/src/_internal/*.test.ts`, `shell/src/**/*.test.ts`
- Problem: counts of `fieldset` = 0, `validity|checkValidity` = 0 and `axe|isAccessible` = 0 in every file. Missing:
  - automated a11y (`@open-wc/testing`'s `chai-a11y-axe` `expect(el).to.be.accessible()` is free with the current stack)
  - `<fieldset disabled>` propagation
  - constraint validation
  - initial/programmatic value → FormData (input family)
  - form reset for the input family
  - mask with initial value / caret / v-model event
  - accessible name for checkbox/radio/switch/icon-only button/rail nav-item
  - "one `change` per group click"
  - data-driven sidenav keyboard
  - a skip link that actually moves focus (the existing test asserts the wrong thing, CA-12)
  - `format-style=currency` without a currency code
  - locale parsing (`1,234.5`)
- Correct solution: add an `a11y.test.ts` per component with axe plus `computedName`/`computedRole`. Add a shared "FACE contract" test suite (value/reset/disabled/validity/restore) that runs against every form control; Material Web and FAST both ship such shared harnesses.
- Effort: M

### CA-27: Graphify hint — `FieldSize`/`SelectionSize` `_internal` boundary
- Severity: Info
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `core/src/text-input/index.ts:3-8`, `checkbox/index.ts:2`, `radio/index.ts`, `switch/index.ts`, `radio-group/index.ts`, `checkbox-group/index.ts`; Vue `vue/src/text-input/TulparTextInput.vue:5-7` (`from "@tulpar-ui/core"`), `vue/src/checkbox/TulparCheckbox.vue:4` (`from "@tulpar-ui/core/checkbox"`)
- Finding: **no boundary violation.** The types are defined in `_internal`, re-exported through the public subpath barrels, and the Vue/Angular wrappers import them from public specifiers only. Two observations:
  - Public types physically live in a private module. `dist/text-input/index.d.ts` re-exports from `../_internal/form-field-base`, so `_internal` d.ts files must ship and appear in consumers' "Go to definition".
  - `SelectionSize` is re-exported from 5 subpaths and `FieldSize` only from `text-input` (number-input/textarea consumers must reach for `text-input` or the root).
- Correct solution (Nit): move public types to `core/src/types/{field,selection}.ts` (public, documented) and re-export them from every relevant subpath. `_internal` then holds only implementation.
- Effort: S

### CA-28: Physical CSS properties
- Severity: Nit
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `form-field-base.styles.ts:20,26,58,159-160,265`; `text-input.styles.ts:26,44,56,78`; `number-input.styles.ts:23`; `button.styles.ts` (3); `shell.styles.ts:19` (`left: 0.5rem` on the skip link)
- Problem: RTL is out of scope, but logical properties cost nothing, and the shell/nav-item already use them (mixed style).
- Correct solution: `margin-inline-start`, `padding-inline`, `inset-inline-start`, `transform-origin: left` → logical.
- Effort: S

## Things done well
- Semantic-token CSS with `var()` fallbacks everywhere. `:focus-visible` (not `:focus`) is used consistently, and reduced-motion blocks exist in most components.
- Listener and observer cleanup in `disconnectedCallback` is disciplined (shell, sidenav, nav-item, button, button-group, groups).
- Radio-group roving tabindex, wrap and Home/End are close to APG. The group-owned `disabled`/`readonly` marker logic (`data-group-*`) is careful.
- Checkbox indeterminate → `aria-checked="mixed"`, resolving mixed→checked on click, matches APG.
- Button `delegatesFocus` + form-associated submit/reset handling (including the documented Chromium `requestSubmit` limitation) is well researched.
- The rail flyout honours WCAG 1.4.13 (hover bridge, Escape, pin on click/touch, single open flyout). The cancelable `tulpar-navigate` event lets SPA routers intercept.
- SSR hygiene: no `window`/`document` at module scope. `navigator.language` is guarded.
- Big, readable test suites per component (button 63, sidenav 41, text-input 41 tests).

## Open questions for the owner
1. **Vocabulary migration (CA-10):** do you rename `severity`→`tone` and unify `outlined/outline`, `tonal/soft-tonal`, `warn/warning` before the first public npm release after 0.6? After 1.0 this becomes a semver-major. Do you keep `help|contrast|premium` as button-only tones?
2. **Mask engine (CA-4):** do you fix the bespoke engine, or adopt Maskito (MIT, framework-agnostic) as a dependency? This is a dependency-policy decision.
3. **Theme ownership (CA-15):** should `<tulpar-shell>` own the global `.dark` class at all, or should it move to an opt-in helper next to `persistShellState`?
4. **ButtonGroup semantics (CA-22):** is ButtonGroup meant as a segmented/toolbar control (roving) or a plain layout group? The answer decides the default role.
5. **Mobile drawer (CA-13):** do you accept a native `<dialog>` (top layer) for the overlay sidenav? It changes the stacking model of the shell.
