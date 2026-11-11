# 04 — CORE-B: Overlay family, Feedback (toast/message), Display atoms, Select v0.14/v0.15

Reviewer: CORE-B. Mode: read-only code review plus `git log`. No build or tests were run.
Skills used as lenses: web-design-guidelines (Vercel ruleset fetched live), impeccable (audit), genjutsu (motion principles), ui-ux-pro-max.

## Area summary

The engineering is careful. JSDoc is strong, Lit loop traps are avoided, listeners are cleaned up, and every atom has reduced-motion and forced-colors handling. The unit coverage of the pure helpers (keymap, active-index, filter, positioner, queue, timer) is good.

**Verdict: Needs work. One a11y defect class is close to Weak.**

1. **One root cause breaks five components: ID references that cross a shadow-root boundary.** Tooltip `aria-describedby`, popover `aria-labelledby`, progress `aria-labelledby`, and select `aria-activedescendant` (slotted mode) all point at ids in a different tree, so they resolve to nothing. The tests only compare attribute strings, so they pass green.
2. The select trigger also has **no accessible name**: `<label for="control">` points at a `<div>`, and a `<div>` is not labelable.
3. The overlay engine **does not follow the anchor on scroll**, although the v0.11 spec requires it. Reconnecting a tooltip, popover or toggletip silently drops its trigger listeners.
4. The toast service has a hover/focus counter that can stick, a global F6 hijack, and an `alertdialog` role used without moving focus.
5. All K2 items are confirmed except one, which is confirmed with a refinement (see CB-12).

## Findings table

| ID | Title | Sev | Merge-blocking | Conf |
|---|---|---|---|---|
| CB-1 | Cross-shadow IDREFs: tooltip describedby, popover/progress labelledby, select activedescendant are dead | Blocker | No (main) / Yes for v0.15 search input | Verified |
| CB-2 | Select trigger has no accessible name (`<label for>` → non-labelable div) | Blocker | No (v0.14, on main) | Verified |
| CB-3 | K1 extension + correct searchable structure (status rows inside listbox, trigger haspopup) | Major | Yes (v0.15) | Verified |
| CB-4 | K2 verification, item by item | Major | Yes (v0.15) | Verified |
| CB-5 | Typeahead lands on disabled options; Enter commits a disabled value | Major | No | Verified |
| CB-6 | Overlays don't reposition on scroll (spec §3 violation); CSS Anchor never wired; manual popover reimplements light dismiss | Major | No | Verified |
| CB-7 | Tooltip/toggletip/popover lose trigger listeners after DOM move (disconnect→reconnect) | Major | No | Verified |
| CB-8 | Toast hover/focus counter can stick → all timers in a location paused forever | Major | No | Plausible |
| CB-9 | Toast ARIA model: `alertdialog` without focus, live regions created on insert, actionable toasts auto-expire | Major | No | Verified (roles) / Plausible (AT) |
| CB-10 | Toaster F6 handler hijacks F6/Shift+F6 globally and forever | Major | No | Verified |
| CB-11 | Chip: `role=button` host contains a real `<button>` (nested interactive; remove button flattened) | Major | No | Verified |
| CB-12 | Diacritic fold is incomplete and asymmetric (É/Ñ/Á…, query "é" vs label "É") | Minor | Yes (v0.15) | Verified |
| CB-13 | Tag uses `role="status"` → every tag is a live region | Minor | No | Verified |
| CB-14 | Toggletip sets `aria-haspopup="dialog"` but the surface is not a dialog | Minor | No | Verified |
| CB-15 | Popover focus model: Tab out lands after the host, not after the trigger; no focus-outside close | Minor | No | Plausible |
| CB-16 | Built-in English strings not localizable (select, toast, chip, spinner, badge, progress %) | Minor | No | Verified |
| CB-17 | Select `change` fires when the value did not change; no `input` event | Minor | No | Verified |
| CB-18 | `message.dismiss()` / `toast.dismiss()` with no id dismiss BOTH families; `setDefaults({maxVisible})` orphans live toasts | Minor | No | Verified |
| CB-19 | Toast loading spinner ignores reduced motion + inline `<style>` (CSP); swipe disabled under reduced motion; tap-jitter dismiss | Minor | No | Verified / Plausible |
| CB-20 | Toaster root not in the top layer → under/inert behind native modal dialogs | Minor | No | Plausible |
| CB-21 | Select closes on any scroll and refocuses trigger; mobile keyboard can close searchable select | Minor | No | Plausible |
| CB-22 | Avatar: primitive tokens written from component `.ts`; initials not grapheme/locale-safe | Minor | No | Verified |
| CB-23 | Dead overlay code: `getOverlayRoot` portal + theme observer, `supportsCssAnchor` unused | Nit | No | Verified |
| CB-24 | Hard-coded motion durations/easings bypass motion tokens | Nit | No | Verified |
| CB-25 | Smaller Select keyboard gaps vs APG (closed Home/End; Escape-stack; Space preventDefault on overlay triggers) | Nit | No | Verified |
| CB-26 | Test gaps: tests assert attribute strings, not resolved relationships | Info | No | Verified |

---

### CB-1: Cross-shadow IDREFs — the ARIA relationship resolves to nothing
- Severity: Blocker
- Merge-blocking for current branches: No for main (shipped v0.11/v0.13/v0.14). Yes for feat/v0.15: the new search input reuses the same broken `aria-activedescendant` in slotted mode.
- Confidence: Verified. Reading the code is enough: ARIA IDREFs resolve only inside the node tree of the element that carries the attribute. The runtime AT effect is for the visual agent to confirm.
- Where:
  - `_internal/overlay/aria.ts:33-38` + `tooltip/tulpar-tooltip.ts` `_wireTrigger`. The trigger sits in the light DOM. `aria-describedby` points at `.surface`'s id, and `.surface` is inside the tooltip's **shadow root**. The `<tulpar-button tooltip>` delegation has the same problem: the surface sits in a nested shadow root.
  - `popover/tulpar-popover.ts` `_applyLabelling`. The surface is in the shadow root. `aria-labelledby` points at a slotted heading, and that heading is in the **light DOM**.
  - `progress/tulpar-progress.ts:219` + `:366`. The host is in the light DOM. `aria-labelledby=_labelId`, and the element with that id is a `<span>` in the **shadow root**.
  - `_internal/listbox/active-descendant-controller.ts:82-87`. The shadow trigger or search input gets `aria-activedescendant=<id>`. In slotted mode that id is on a light-DOM `<tulpar-option>` (`tulpar-select.ts:285-293`). Data mode works, because the options are stamped in the same shadow root.
- Problem: The browser looks up each IDREF with `getElementById` inside its own tree. Every relationship above therefore resolves to nothing:
  - The tooltip text is never announced as a description.
  - The popover dialog has no name.
  - The progressbar is unnamed when you use `slot="label"`.
  - A screen reader announces nothing while you arrow through a slotted select. Slotted is the default authoring mode.
- Evidence: Tests only check strings, for example `tulpar-tooltip.test.ts:113` `expect(trigger.getAttribute("aria-describedby")).to.contain(id)`, `tulpar-progress.test.ts:158`, and `tulpar-select.test.ts:303`. Background: [Nolan Lawson, "Shadow DOM and accessibility: the trouble with ARIA"](https://nolanlawson.com/2022/11/28/shadow-dom-and-accessibility-the-trouble-with-aria/).
- Why it matters: This is a WCAG 4.1.2 and 1.3.1 failure in the most used components. It is invisible in CI. For a commercial DS this is the class of bug that fails enterprise a11y procurement audits.
- Correct solution: Do not use string IDREFs across a shadow boundary. Use one of these, per case:
  1. **ARIA element reflection.** It is Baseline 2025 (April 2025) per [MDN ariaActiveDescendantElement](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaActiveDescendantElement). A reference may point into the **same or a parent (ancestor) tree**, not into a child shadow tree. That makes it right for **select** (`trigger.ariaActiveDescendantElement = optionEl`; light-DOM options are in the ancestor tree) and for **popover** (`surface.ariaLabelledByElements = [heading]`).
  2. **Keep the relationship inside one tree** when the target lives in your own shadow. For **progress**, put `role="progressbar"` and the value ARIA on an inner shadow element whose `aria-labelledby` points at the label wrapper in the same shadow root. Web Awesome / Shoelace `<sl-progress-bar>` does this: `role=progressbar` on `part="base"`. As an alternative, set role and values through `ElementInternals` and name the host with `internals.ariaLabelledByElements = slot.assignedElements()`.
  3. **Tooltip:** you cannot reference a child shadow. Make the **host** the description target. Set `internals.role = "tooltip"` on `<tulpar-tooltip>` and have the trigger reference the host. The host is in the trigger's own tree for both the light-DOM case and the button-delegation case. The accessible-description computation includes the host's flat-tree (slotted plus shadow) text. Watch the WICG Reference Target proposal (`shadowrootreferencetarget`) as the future native fix. Do not depend on it yet.
  4. Put a shared `_internal/aria-ref.ts` helper in front of all of these, so components never write raw IDREFs across roots. Add one lint or test rule for it (see CB-26).
- Interim: For select only, stamp the `<tulpar-option>` ids and set `aria-activedescendant` only in data mode, and use element reflection in slotted mode. Do not copy options into the shadow DOM.
- Effort: M

### CB-2: Select trigger has no accessible name
- Severity: Blocker
- Merge-blocking for current branches: No (v0.14 is on main). It must be fixed before the next release.
- Confidence: Verified. Per the HTML spec, `label[for]` associates only with *labelable elements* (button, input, meter, output, progress, select, textarea, form-associated custom elements). A `<div>` is not one of them.
- Where: `_internal/form-field-base.ts:268-276` renders `<label for="control">`. `select/tulpar-select.ts:880-892` renders `<div class="select-trigger" id="control" role="combobox"|"button">` with `aria-label` only when label-position is `none`.
- Problem: With a visible label (top/float), the combobox has no name. The visible label is not associated, and clicking the label does not focus the trigger. In searchable mode the trigger is `role=button`, so it takes its name from content ("Apple"), not from the field label.
- Why it matters: This fails WCAG 4.1.2 Name, Role, Value, and 2.5.3 Label in Name, on the primary form control of Wave 2.
- Correct solution: Give the label an id and set `aria-labelledby="<labelId>"` on the trigger. Both live in the same shadow root, so this is safe. In button mode use `aria-labelledby="<labelId> <valueId>"`, which follows the APG select-only combobox example where the name comes from the label and the value is announced separately. Forward label clicks to `_triggerEl.focus()` yourself, or render a real `<button>` as the trigger, which is labelable. Native `<button>` is what React Aria `Select` and Radix `Select.Trigger` use. Reference: [APG Select-Only Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/).
- Effort: S

### CB-3: K1 extension — status rows also sit inside `role=listbox`; correct searchable structure
- Severity: Major (K1 itself is already logged; this finding adds evidence and gives the target structure)
- Merge-blocking for current branches: Yes (feat/v0.15-select-completion)
- Confidence: Verified
- Where: `select/tulpar-select.ts:851-871` (`_renderListbox`), `:787-820` (`_renderStatusRow`), `:883-885` (trigger role/haspopup in searchable mode)
- Problem:
  1. Besides the search `<input role=combobox>` (K1), the loading, error, empty and no-match rows (`role=status` / `role=alert`, with a nested `<tulpar-spinner role=status>`) are rendered **inside** `role=listbox`. A listbox may own only `option` and `group`.
  2. These live regions are inserted conditionally. A newly inserted live region is often not announced (NVDA, VoiceOver), so "No matches" may never be spoken.
  3. In searchable mode the trigger says `aria-haspopup="listbox"`, but the popup is now a composite of a text field and a listbox. That is a dialog-like popup.
- Correct structure (what React Aria `Select` + `Autocomplete` + `SearchField` + `ListBox` inside a `Popover`, and Ark/Zag `Combobox`, do):
  ```
  trigger: <button aria-haspopup="dialog" aria-expanded aria-labelledby="label value">   (searchable)
           <div role=combobox aria-haspopup=listbox …>                                    (non-searchable, unchanged)
  popup:   <div role="dialog" aria-labelledby="label">              ← top-layer surface
             <input role="combobox" aria-autocomplete="list" aria-expanded="true"
                    aria-controls="lb" aria-activedescendant(Element)>
             <div role="listbox" id="lb" aria-labelledby="label"> …options/groups only… </div>
             <div role="status" aria-live="polite" class="sr-only|visible">  ← ALWAYS rendered; only its text changes
           </div>
  ```
  Put the visible empty/no-match/error rows outside the listbox as siblings. Announce through one persistent live region, for example "No matches" or "5 results". The positioning surface becomes the wrapper, not the listbox. The CSS Lit slot trap is not affected, because the options `<slot>` stays unconditional. References: [APG Combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [React Aria Select — searchable](https://react-spectrum.adobe.com/react-aria/Select.html).
- Effort: M

### CB-4: K2 verification, item by item
- Severity: Major (group)
- Merge-blocking for current branches: Yes (v0.15). Items a, b and c are user-visible functional bugs.
- Confidence: Verified by code-path reading. Each item has an exact repro for the visual agent.

| K2 item | Result | Evidence and mechanism |
|---|---|---|
| a. Data-mode empty/no-match row computed from previous render | **Verified** | `_renderStatusRow` (`:799`) calls `this._collection()`. In data mode, `_options()` reads `this.renderRoot.querySelectorAll("tulpar-option")` (`:358`), which is the DOM from the **previous** render. `updated()` does not request a second render. Repro: `el.options=[]` → open → "No options"; then `el.options=[{value:'a',label:'A'}]` while open. The empty row stays next to the new option until some other update happens. The reverse also happens: `options` going from [A] to [] shows no empty row. Fix: compute status from the data array (`this.options`) in data mode, as `_selectedLabel` already does (`:380`), or derive both from one `willUpdate` model. |
| b. `_filterResult` not recomputed on slot change during an active query | **Verified (worse than stated)** | `willUpdate` recomputes only on `_query/options/searchable` (`:186`). `_onOptionsSlotChange` calls a bare `requestUpdate()` (`:648`). `_applyFilterToDom` then indexes `f.matched[i]` for the new list. Any index past the old length gives `!undefined === true` → **newly added options are hidden** and skipped by nav. Repro: searchable, type "a", then append `<tulpar-option label="Avocado">`. It does not appear even though it matches. Fix: keep a `_optionsVersion` counter that `slotchange` bumps, and recompute in `willUpdate` when it changes. |
| c. Reopen seeds active from stale filter | **Verified** | `_doClose` does not clear `_query`. `_doOpen` sets `_query=""` (`:459`) and then reads `this._collection()` (`:460`) **before** `willUpdate` runs, so `hidden` flags come from the old `_filterResult`. `firstEnabled` then skips previously filtered-out rows. Repro: no value; search "zz" (all hidden) → Escape twice → reopen. Active is -1 (nothing highlighted), or it lands on the old first match instead of row 0. Fix: clear `_query` and `_filterResult` in `_doClose`, or seed active in the `_overlay.open().then` callback after the update. |
| d. Home/End in search input move options instead of caret | **Verified** | `keymap.ts` searchable branch lets Home/End fall through to the shared switch → `first`/`last` with `preventDefault:true`. APG editable combobox: Home/End move the caret inside the textbox ("optionally" for listbox nav). React Aria and Ark keep caret behavior. Fix: in searchable mode return `NONE` for Home/End (and ArrowLeft/Right). |
| e. FOLD lacks uppercase accented Latin | **Verified + additional bug** | See CB-12. |
| f. `options` → `null` leaves slotted options without ids | **Verified** | `_ensureOptionIds` returns early while `options != null` (`:288`) and runs only from `connectedCallback` and `slotchange`. Setting `options=null` changes no slot assignment, so no `slotchange` fires and no ids are stamped. Frameworks set properties before connect, so this happens in real use. Result: `aria-activedescendant` is removed (`applyActiveAttrs` finds `id=""`). Fix: call `_ensureOptionIds()` from `updated()` when `changed.has("options")`. Better: compute ids in the collection layer. |

- Additional bug found: `_applyFilterToDom` and `_options()` both depend on `querySelectorAll` order matching `_rawLabels()`. Option-group `hidden` is computed from `children.every(c=>c.hidden)`. That is fine. However, a slotted `<tulpar-option>` nested inside an arbitrary wrapper element (not a group) is matched too. Keep that in mind when you add the version counter.
- Effort: M (together)

### CB-5: Typeahead lands on disabled options; Enter commits a disabled value
- Severity: Major
- Merge-blocking for current branches: No (v0.14 code)
- Confidence: Verified (code path). No test covers it.
- Where: `_internal/listbox/typeahead.ts` (searches `labels` with no disabled check); `tulpar-select.ts:540-546, 590-593` (`c.labels` includes disabled items); `:567-569` (`commit` has no disabled guard).
- Problem: Take a closed select with "Banana" disabled. Type `b` → it opens with Banana active → press Enter → `change` fires with `value="banana"`. Disabled options are skipped by arrows and clicks, but not by typeahead or commit.
- Why it matters: The user can select a disabled value, and that breaks business rules.
- Correct solution: Pass a navigability predicate to `Typeahead.type` (skip `disabled || hidden`), the same rule as `active-index.ts`. Also guard `commit` with `if (active >= 0 && !items[active].disabled)`. APG says disabled options are not selectable. Also fold the typeahead with the same `normalize()` as the filter, so "ş" finds "Şişli" consistently.
- Effort: S

### CB-6: Overlay positioning — no scroll reflow, CSS Anchor never wired, `popover="manual"` re-implements native behavior
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `tooltip/tulpar-tooltip.ts` `reposition()` (called only on open and on placement change), `toggletip/…` (same), `popover/tulpar-popover.ts` (ResizeObserver on the surface and body only, not on the anchor, and no scroll listener), `_internal/overlay/anchor.ts:68` `supportsCssAnchor()` (never imported).
- Problem: The spec (`docs/superpowers/specs/2026-06-18-tulpar-ui-v0.11-overlay-family-design.md` §3, lines 64-76) says the JS engine handles "nested scroll containers … scroll/resize reflow", and that CSS Anchor is a progressive enhancement. In reality:
  - (a) An open popover, toggletip or focus-opened tooltip stays at fixed viewport coordinates while its trigger scrolls away.
  - (b) Anchor resize or move is not observed.
  - (c) There is no `size` step, so the surface has no `max-height` against the available space.
  - (d) CSS Anchor Positioning is not used anywhere.
- Browser support check (web search, 2026-11): CSS Anchor Positioning became **Baseline Newly Available in January 2026**, when Firefox 147 shipped it unflagged ([web.dev, Jan 2026](https://web.dev/blog/web-platform-01-2026); [caniuse](https://caniuse.com/css-anchor-positioning)). It is not "Widely available" until about mid-2028. The Popover API is Baseline 2024.
- Correct strategy:
  1. **Now (required):** add a Floating-UI-style `autoUpdate`. Attach passive `scroll` listeners to every overflow ancestor of the anchor (shadow-inclusive; `_nearestScrollParent` already walks it) and to the window. Add a `ResizeObserver` on the anchor **and** the surface. Throttle repositioning with `requestAnimationFrame`. Reference: [Floating UI autoUpdate](https://floating-ui.com/docs/autoUpdate). Add a `size` step that sets `--available-height`.
  2. **Use the native platform where it is already Baseline:** `popover="auto"` for popover and toggletip, so the browser provides light dismiss, Escape, nested-popover stacking and invoker focus. Keep `manual` only for tooltip, or use `popover="hint"` where supported. The current `manual` setup plus a hand-written pointerdown light-dismiss plus a global Escape stack duplicates the platform and behaves differently from it.
  3. **CSS Anchor as the enhancement the spec promised:** when `supportsCssAnchor()` is true, use the *implicit anchor* from `showPopover({source: trigger})` or `popovertarget`, together with `position-anchor: auto`, `position-area`, and `position-try-fallbacks: flip-block, flip-inline`. This avoids tree-scoped `anchor-name` problems across shadow roots. Keep the JS engine as the fallback and for the arrow. Revisit "CSS-first" when Baseline becomes Widely available. The spec's JS-primary decision is still defensible for a commercial product, but only if the JS path actually does the reflow.
- Effort: M

### CB-7: Tooltip/toggletip/popover lose trigger listeners after a DOM move
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (code path). No reconnect test exists (`grep -i "reconnect|disconnect"` in the three test files returns nothing).
- Where: `tooltip/tulpar-tooltip.ts` `disconnectedCallback` (calls `_detachTriggerListeners()` but keeps `this._anchorEl`) → on reconnect `_wireTrigger()` sees `next === this._anchorEl` and returns early without re-attaching. The same pattern is in `toggletip` and `popover`.
- Problem: When a framework moves the element (list re-sort, Angular `*ngFor` move, Vue `<KeepAlive>`, CDK drag), the overlay never opens again. The trigger keeps `aria-haspopup` and `aria-expanded`, so it lies to AT.
- Correct solution: In `disconnectedCallback`, set `this._anchorEl = null` after detaching and unlinking, and close the overlay (`_doClose(true)`). This is the Lit "symmetrical connect/disconnect" rule ([Lit lifecycle docs](https://lit.dev/docs/components/lifecycle/#disconnectedcallback)). The select has a related issue: `disconnectedCallback` destroys the overlay but leaves `open=true`, so after reconnect `_doOpen` returns early. Reset `open` there too.
- Effort: S

### CB-8: Toast hover/focus counter can stick → timers paused forever
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Plausible. Needs a real browser. Repro below.
- Where: `toast/toast-service.ts` `pointerenter/pointerleave/focusin/focusout` listeners and `_hoverCount`. `_doRemove` never decrements for the element it removes.
- Problem: The counter is incremented on `pointerenter` and `focusin`. When a toast is removed while it is hovered or focused (click ×, press Esc, click an action, or the timer expires after a focus-out race), the removed node gets no `pointerleave` and, in Chromium, no `focusout`. The counter stays above 0, so `_isHovered(location)` stays true. Every later toast at that location is created, but the pause stays in force (`_pauseLocation` on later enters; `_resumeLocation` only fires at 0). The stack also stays "expanded".
- Repro for the visual agent: create 2 toasts → hover toast A → click its × → move the mouse away → wait 10 s. Toast B should not auto-dismiss if the bug is real. Repeat with keyboard: F6 → Tab to × → Enter.
- Correct solution: Track hover and focus **per location container**, not per toast. Put one `pointerenter`/`pointerleave` and `focusin`/`focusout` pair on the location container (Sonner and Radix Viewport do this). Derive "paused" from `container.matches(':hover') || container.contains(document.activeElement)`. Also pause on `document.visibilityState === "hidden"`, which Sonner does and the timer here does not.
- Effort: S

### CB-9: Toast ARIA model
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified for roles. Plausible for AT announcement; the code itself notes "MANUAL SR PASS REQUIRED".
- Where: `toast/tulpar-toast.ts:503-512` (`_ariaRole`: actions → `alertdialog`), `:549-556` (role and `aria-live` on a card created with its content), `toast-service.ts` (default `duration` 5000 also applies when `actions` exist).
- Problem:
  1. `role="alertdialog"` requires focus to move into the dialog ([APG Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)). The toast deliberately does not move focus, so this is a dialog role without dialog behavior. It is also mixed with `aria-live`.
  2. Each toast is a **newly inserted** live region that already holds its text. Announcement of such regions is unreliable (VoiceOver, JAWS).
  3. Toasts with an "Undo"/"Retry" action disappear after 5 s by default. That is a WCAG 2.2.1 Timing Adjustable risk. Hover/focus pause helps mouse and keyboard users, but not screen-reader users who never reach the toast.
- Correct solution (Sonner / Radix Toast / Spectrum):
  - Keep one **persistent** `aria-live="polite"` list on the location container (`<ol>` + `<li>`). Use `role="status"` and `role="alert"` only through that region, with `assertive` only for danger.
  - Never use `alertdialog` for a non-modal toast. Make actions reachable through the landmark hotkey (see CB-10).
  - Give actionable toasts a longer default or no auto-dismiss. Spectrum and Carbon do not auto-dismiss toasts that have actions. Radix suggests longer durations and an `altText` for actions.
  - Also: the `aria-label` on `<span class="toast-count">` (`:566`) is on a generic element, and ARIA 1.2 prohibits naming generics. Use visually hidden text instead.
- Effort: M

### CB-10: F6 handler hijacks F6/Shift+F6 globally and forever
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `_internal/toaster/toaster-root.ts` `onKeydown`: `if (e.key !== "F6") return; e.preventDefault();` runs unconditionally. The listener is bound on the first toast and never removed, because the root persists after the last toast is dismissed. `firstFocusable(root)` uses light-DOM `querySelectorAll`, so it never finds the shadow buttons and falls back to the root.
- Problem: After the first toast, F6 (browser pane/address-bar cycling, an a11y shortcut) and Shift+F6 are broken page-wide, even with zero toasts. The region label "Notifications" is hard-coded English and does not name the hotkey.
- Correct solution: Intercept only while visible toasts exist. Make the hotkey configurable and announce it in the region label (Sonner: `hotkey={['altKey','KeyT']}`, `aria-label="Notifications alt+T"`; Radix: `F8`, `label="Notifications ({hotkey})"`). When no toasts exist, let the event pass and do not call `preventDefault`. Focus the first toast host (`tabindex=-1`), not the root.
- Effort: S

### CB-11: Chip — interactive host containing a real button
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (ARIA spec: `button` has "Children Presentational: True")
- Where: `chip/tulpar-chip.ts:122-123` (host `role="button"` + `tabindex=0`), `:410-421` (shadow `<button class="x" aria-label="Remove …">`)
- Problem: The remove button is a descendant of an element with role `button`. AT flattens it to presentational content, so the remove control is not reachable as a button in browse mode. The chip's name-from-content also includes "Remove <label>". This is the axe `nested-interactive` violation.
- Correct solution: Do not put a role on the host. Render two **sibling** controls in the shadow root: `<button part="action">label</button>` and `<button part="remove" aria-label="Remove label">`. This is how Material Web `md-input-chip` (primary action plus trailing remove action) and React Aria `TagGroup` (row with a separate remove button) are built. Keep Delete/Backspace on the primary button. Because `ChipGroup` (roving tabindex) is reserved for Wave 2, design the two-button anatomy now so the group can expose it as a grid row later.
- Effort: M

### CB-12: Diacritic fold incomplete and asymmetric
- Severity: Minor
- Merge-blocking for current branches: Yes (v0.15; small fix)
- Confidence: Verified
- Where: `_internal/listbox/filter.ts` `FOLD` + `normalize()`
- Problem: Uppercase accented Latin (É È Ê Á À Â Ä Ã Å Í Ó Ô Õ Ú Ù Û Ñ, and others) is not in `FOLD`. It falls to `toLowerCase()`, which gives "é" and is **not** folded further. This causes an asymmetry:
  - The query "e" does not match "Émile".
  - The query "é" folds to "e" but the label "É" becomes "é", so typing the exact accented letter **does not match** a capitalized accented label.
  - Also: Œ/Æ/ß and Polish/Czech letters (ł, č, ř…) are missing.
- Correct solution: Keep the 1:1 index map but generate the fold instead of hand-listing it. For each UTF-16 unit: `ch.toLocaleLowerCase(locale).normalize("NFD")[0]`. This drops combining marks per character and keeps length 1:1. Keep the explicit Turkish overrides (İ/I/ı → i) first. Use the document or element `lang` for the locale. React Aria `useFilter` uses `Intl.Collator({usage:'search', sensitivity:'base'})`. Your 1:1 approach is fine for highlight ranges, but the table must be complete. Add tests for É/Ñ and for the "é" vs "É" case.
- Effort: S

### CB-13: Tag uses `role="status"`
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `tag/tulpar-tag.ts:94-95`
- Problem: Every tag becomes a polite live region. A table with 50 status tags means 50 live regions, and any text change is announced. A static label is not a status message.
- Correct solution: No role (generic inline text), the same as Carbon `Tag` (read-only), Spectrum `Badge`, and Polaris `Badge`. When tags form a set, the consumer wraps them in a list. Use `role=status` only on an explicit live usage, for example a `live` opt-in prop.
- Effort: S

### CB-14: Toggletip `aria-haspopup="dialog"` without a dialog
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `toggletip/tulpar-toggletip.ts` `_wireTrigger` (`setHasPopup(next,"dialog")`), surface has no role. Content is announced through a separate hidden live region and is also present as plain text in the surface.
- Problem: AT announces "opens dialog" and then no dialog appears. Content can be read twice: once through the live region and once in browse mode on the surface.
- Correct solution: Use the Inclusive Components toggletip pattern ([Heydon Pickering](https://inclusive-components.design/tooltips-toggletips/)). Use a plain `<button aria-expanded>` with no `aria-haspopup`. The bubble **is** the `role="status"` live region, and its content is inserted on open and cleared on close. Do not keep a second hidden copy.
- Effort: S

### CB-15: Popover non-modal focus order
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Plausible
- Where: `popover/tulpar-popover.ts` `_focusInitial`, the "Tab flows out; no trap" model
- Problem: The surface is in the top layer, but its DOM position is wherever `<tulpar-popover>` is placed (by id reference, often far from the trigger). Tab from the last element in the popover goes to the element after the **host**, not after the trigger (WCAG 2.4.3). Focus can also be left inside an open, detached popover. `FOCUSABLE_SELECTOR` does not find light-DOM custom elements that delegate focus, such as `<tulpar-button>`. A `default-open` popover steals focus on page load.
- Correct solution: Use native invoker semantics, `popovertarget`/`commandfor` or `showPopover({source})`. They give the browser's "popover focus navigation" (Tab from the invoker goes into the popover, and Tab out returns after the invoker). Close on focus outside, as Radix `Popover` does by default with `onFocusOutside` → dismiss. Honor `autofocus` inside the content, as native `<dialog>`/popover do. Do not move focus on `default-open` at connect time.
- Effort: M

### CB-16: Built-in English strings not localizable
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:

| String | Location | Overridable? |
|---|---|---|
| "Clear selection" | `tulpar-select.ts:731` | No |
| "Search" / "Search {label}" | `tulpar-select.ts:784` | No |
| "Loading…" / "No options" / "No matches" / "Search…" | `tulpar-select.ts:78,87,109,112` | Yes (props + slots) |
| "Dismiss notification" | `tulpar-toast.ts:610` | No |
| "×N notifications" | `tulpar-toast.ts:566` | No |
| "Notifications" (region label) | `toaster-root.ts` | No |
| "Remove {label}" | `tulpar-chip.ts:388` | No |
| "Loading" (spinner default label) | `tulpar-spinner.ts` | Yes (prop) |
| Badge noun "items" | `tulpar-badge.ts` | Yes (prop) |
| Progress value label `${pct}%` | `tulpar-progress.ts:206` | No; Turkish writes "%50" |

- Problem: Strings that a consumer cannot override block a Turkish-first owner and non-English customers. The hard-coded percent format is wrong for Turkish.
- Correct solution: Add one central, `lang`-aware message registry. Web Awesome / Shoelace use `@shoelace-style/localize`: components read the closest `lang`, and translations are registered once. Expose a per-instance prop override as well (the select already does this). Use `Intl.NumberFormat(lang, {style:'percent'})` for the progress value label. Do not add more one-off `*-text` props per string.
- Effort: M

### CB-17: Select `change` semantics
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `tulpar-select.ts:414-422` (`_commit` has no equality guard), `:567-569`
- Problem: Enter, Tab or a click on the already-selected option dispatches `change` with the same value. Native `<select>` fires `input` + `change` only when the value changes. There is no `input` event, which Vue `v-model` on native-like elements and some form libraries expect.
- Correct solution: `if (value === this.value) return;` before the dispatch. Dispatch `input` (bubbles, composed) and then `change` (bubbles), the same as native `<select>`. React Aria `onSelectionChange` also does not fire on reselection.
- Effort: S

### CB-18: Service-level dismiss scope and `setDefaults` orphaning
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `toast-service.ts` `_message.dismiss()` and `_toast.dismiss()` with no id (both iterate all `_entries`). `_toast.setDefaults` → `_createQueue()` when `maxVisible` changes.
- Problem:
  1. `message.dismiss()` also removes every toast, and `toast.dismiss()` also removes every message.
  2. Changing `maxVisible` while toasts are visible replaces the queue. The live entries are no longer in it, so stacking and promotion stop working for them, and `_queue.dismiss(id)` becomes a no-op.
- Correct solution: Filter by `entry.variant` (store it in `ToastEntry`). In `setDefaults`, migrate the existing records (`queue.setMaxVisible(n)` then re-promote) instead of replacing the queue.
- Effort: S

### CB-19: Toast motion and gesture details
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified (1, 2, 3). Plausible (4).
- Where: `toast-service.ts` `ICON_SPINNER`; `tulpar-toast.ts:656-657, 700-712, 756-757`
- Problem:
  1. The promise-loading spinner animates with an inline `<style>@keyframes` and `style="animation:…"`. Nothing reduces this under `prefers-reduced-motion`, unlike `<tulpar-spinner>`, which has a 3-dot fallback.
  2. The inline `<style>` needs CSP `style-src 'unsafe-inline'`, which is a commercial blocker for strict-CSP customers.
  3. Swipe-to-dismiss is **disabled** under reduced motion. Reduced motion means reducing animation, not removing a function. The dismissal should still work, just without the travel animation.
  4. Velocity ≥ 0.11 px/ms with no minimum distance: a mouse click with 2 px of jitter in 15 ms (about 0.13 px/ms) dismisses the toast, and text selection inside a toast is impossible. ui-ux-pro-max `drag-threshold`.
- Correct solution: Render `<tulpar-spinner size="sm">` as the loading icon, which reuses its reduced-motion and a11y handling and needs no inline style. Keep swipe under reduced motion and swap the transition for an opacity cut. Require `|dx| ≥ 10px` before velocity counts (Sonner checks a minimum swipe amount). Restrict swipe to `pointerType !== "mouse"` or require a drag threshold for the mouse.
- Effort: S

### CB-20: Toaster root is not in the top layer
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Plausible
- Where: `toaster-root.ts` (`position:fixed; z-index: var(--tulpar-feedback-z-index, 9000)`)
- Problem: Overlays (select, popover, tooltip) are in the top layer. The toaster is not. When a consumer opens a native modal `<dialog>` (Dialog is parked, so apps use the native one), toasts render under the `::backdrop`, and the toast buttons are inert.
- Repro for the visual agent: open `<dialog>` with `showModal()` → call `toast("x",{actions:[…]})` → try to click the action.
- Correct solution: Make the toaster root `popover="manual"` and call `showPopover()` when the first toast mounts. When a new toast arrives while another top-layer element is above it, hide and show it again to move it back to the top. Confirm the inert interaction in browsers before shipping, because HTML treats top-layer elements opened after a modal differently from older ones.
- Effort: S

### CB-21: Select closes on any scroll and refocuses the trigger; mobile risk
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Plausible
- Where: `listbox-overlay.ts` (`window` capture `scroll` + `resize` → `_doClose`); `tulpar-select.ts:481-486` (`_doClose` always calls `_triggerEl.focus()`)
- Problem:
  1. In searchable mode, focus is in the search input. A page scroll closes the listbox and calls `focus()` on the trigger, which can scroll the page back to it. Pass `{preventScroll:true}` and focus only when focus was inside the component.
  2. On mobile, focusing the search input opens the virtual keyboard. The keyboard can cause a scroll or a layout-viewport resize, depending on `interactive-widget`, and that closes the listbox right after it opens.
  3. An outside pointerdown also returns focus to the trigger. APG lets focus go wherever the user clicked.
- Repro for the visual agent: Android Chrome / iOS Safari, searchable select near the bottom of the page → tap → watch whether it closes when the keyboard appears.
- Correct solution: Reposition instead of closing on ancestor scroll (the same autoUpdate as CB-6). Close only if the anchor leaves the clip rect, as Radix and React Aria do. Ignore `visualViewport` and keyboard resizes. Return focus only on keyboard and Escape dismissal. The mobile-native fallback is deferred by the roadmap and is **not** proposed here.
- Effort: M

### CB-22: Avatar token layering and initials
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `avatar/tulpar-avatar.ts` `_applyColorVars` (`var(--tulpar-primitive-color-${family}-600)` set from the `.ts`); `_initials` (`parts[0][0]`, `toLocaleUpperCase()` with no locale)
- Problem:
  1. The spec allows a primitive-family palette (spec v0.13 §avatar), but writing primitive vars from component TS bypasses the CLAUDE.md rule "component styles use only semantic tokens". The lint rule checks only `*.styles.ts`. A second brand cannot re-map avatar colors.
  2. Initials use UTF-16 code units: emoji and combining sequences break, for example "Ö" written as O + U+0308.
  3. The spec says "locale-aware uppercase", but `toLocaleUpperCase()` with no argument uses the runtime default locale, not the content `lang`. "ilker" gives "I", not "İ", on a non-Turkish OS.
- Correct solution: Add an `atom.avatar.palette.{n}` semantic layer that each brand binds to primitives, and set only `--tulpar-avatar-bg-*` from those. Extend the lint rule to template strings in `.ts` that build `--tulpar-primitive-`. Use `Intl.Segmenter` (graphemes) and `toLocaleUpperCase(this.closest('[lang]')?.lang)`.
- Effort: S

### CB-23: Dead overlay code
- Severity: Nit
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `_internal/overlay/overlay-root.ts` `getOverlayRoot()` (portal root plus a `MutationObserver` on `<html>`, never called by any component; grep shows only tests); `anchor.ts` `supportsCssAnchor()` (unused)
- Problem: The JSDoc describes an architecture ("single shared portal root") that does not exist. That misleads maintainers and the AST graph.
- Correct solution: Delete the unused code, or wire it as CB-6 describes. Rename the module to `overlay-stack.ts`.
- Effort: S

### CB-24: Hard-coded motion values bypass the motion tokens
- Severity: Nit
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - `tulpar-option.styles.ts:63,120` (90 ms `ease`)
  - `tulpar-select.styles.ts:440,444` (120 ms)
  - `tulpar-toast.styles.ts:271` (120 ms)
  - `tulpar-toast.ts:756-757` (JS `transform 200ms ease, opacity 160ms ease`)
  - `ICON_SPINNER` (0.8 s)
  - `toast-service.ts` exit-duration read from `--tulpar-feedback-motion-duration-exit`, with fallback **0 ms**: without the token sheet, exits never animate; with it, JS and CSS can drift
- Problem: ui-ux-pro-max `motion-consistency` and genjutsu say one duration/easing scale. Overlays use `--tulpar-overlay-motion-*` correctly, but these spots do not. Exit easing is `ease`, not the `ease-in` exit curve.
- Correct solution: Use the tokens everywhere. Remove the exit timing duplicated in JS: listen for `transitionend` or `animationend`, or use `element.getAnimations()` and `Promise.all(a.finished)`, with a fallback timeout. Do not parse CSS vars.
- Effort: S

### CB-25: Smaller keyboard and APG gaps
- Severity: Nit
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `keymap.ts`; `overlay-root.ts onKeydown`; popover/toggletip `_onTriggerKeydown`
- Problem:
  1. Closed state: Home/End do not open and jump to first/last, which APG select-only lists. A Space typed during a typeahead buffer ("New York") opens or commits instead of extending the buffer.
  2. The global Escape stack never checks `e.defaultPrevented` or `e.isComposing` (IME). It does not stop propagation either, so Escape on a tooltip inside a native `<dialog>` also closes the dialog.
  3. `preventDefault` on Space keydown on a native `<button>` trigger is unnecessary (buttons do not scroll the page), and it can suppress activation in some engines.
- Correct solution: Follow the APG select-only keyboard table. Skip Escape when `e.isComposing || e.defaultPrevented`. Call `stopPropagation()` after the top overlay handles it (Radix `DismissableLayer`). Remove the Space `preventDefault` on native buttons.
- Effort: S

### CB-26: Test gaps — strings, not relationships
- Severity: Info
- Merge-blocking for current branches: No
- Confidence: Verified
- Missing behaviors:
  - IDREF **resolution** (CB-1): assert `root.getElementById(ref)` resolves in the same root, or use `@open-wc/testing`'s `expect(el).to.be.accessible()` (axe) per component. axe flags `aria-valid-attr-value` and `nested-interactive`.
  - Select accessible name (CB-2).
  - Typeahead on a disabled option (CB-5).
  - Slotchange during an active query, reopen after a filtered close, `options → null` (CB-4).
  - Overlay reconnect (CB-7) and scroll reposition (CB-6).
  - Toast removal while hovered or focused (CB-8). F6 with no toasts (CB-10). `message.dismiss()` scope (CB-18).
  - Reduced-motion paths for the toast spinner (CB-19).
- Correct solution: Add axe-core (`chai-a11y-axe`, already part of the open-wc stack) to every component suite. Add a small `expectIdrefResolves(el, attr)` helper.
- Effort: M

---

## Things done well
- Pure, unit-testable cores (`keymap`, `active-index`, `filter`, `positioner`, `queue`, `timer-controller`). The keyboard contract is readable in one file.
- Lit slotchange-loop discipline is consistent and well documented: unconditional slots, attribute toggles, no reactive writes in `updated()`.
- Top-layer promotion with an in-shadow fallback. The containing-block correction nudge for transformed ancestors is a real-world detail that many libraries miss.
- Listener symmetry on close and destroy in `ListboxOverlay`. The Escape stack gives the topmost overlay priority.
- Every atom has `prefers-reduced-motion` and `forced-colors` branches, and the reduced-motion alternatives keep the state visible (spinner 3-dot, skeleton static tint).
- WCAG 1.4.13 tooltip mechanics are present: hover bridge, hoverable surface, Escape dismiss, keyboard-focus open without click-open.
- The dev-warnings for a disabled or non-focusable trigger and an unresolved `for` are excellent DX.
- Progress handles `aria-valuenow` removal when indeterminate and a formatter → `aria-valuetext`. This is correct apart from the naming bug in CB-1.

## Open questions for the owner
1. **Overlay strategy (CB-6):** keep JS-primary as the spec says, adding the missing autoUpdate, or move to `popover="auto"` + CSS Anchor-first now that both are Baseline (anchor since Jan 2026, still "newly available")? My recommendation: add autoUpdate now and switch to `popover="auto"` now; put CSS Anchor behind feature detection.
2. **Searchable select structure (CB-3):** accept the `role=dialog` popup wrapper, with the search field and listbox as siblings, as the v0.15 fix before merge, or ship v0.15 search as experimental?
3. **Toast actions and timing (CB-9):** should actionable toasts be persistent by default (Spectrum/Carbon), or keep 5 s with a longer default (Radix/Sonner)?
4. **i18n (CB-16):** adopt a central `lang`-aware message registry now (affects every component), or keep per-component text props until a dedicated i18n version?
5. **Chip anatomy (CB-11):** fix the two-button anatomy now, or together with ChipGroup in Wave 2? The current a11y defect argues for now.
