# 08 — Documentation, Decisions & Storybook (agent DOCS)

## Area summary

The project writes a lot of documentation: 22 specs, 19 plans, 3 migration guides, a roadmap, a layering ADR, 5 package READMEs and 24 story files. The thinking in it is often strong. Examples: APG-driven a11y contracts, ≥3-system benchmarks, and binding out-of-scope lists.

The trouble is that the record is no longer trustworthy as a record. Five problems show this:
- **No document gets closed.** Plans show 0 of 1,767 checkboxes ticked. 21 of 22 specs still say Draft, Approved or pending. Nothing is marked Implemented or Superseded.
- **Consumer docs promise APIs that do not exist.** Examples: `<tulpar-popover-ng>`, Vue `TulparPopover`, `v-tulpar-popover-ref`, and Angular `TulparToast`/`TulparMessage` in a pending changeset.
- **Breaking changes are undocumented.** A breaking palette rewrite shipped with no changeset, and a migration guide calls the change "purely additive".
- **Specs and code have drifted in many places.** Several specs mandate patterns that are themselves invalid ARIA. The K1 root cause is the spec.
- **There is no machine-generated API reference.** The project has no Custom Elements Manifest.

Three recorded architectural decisions are wrong by industry evidence: the Angular `-ng` wrapper element, "no ControlValueAccessor", and the fragmented intent vocabulary.

**Verdict: Needs work.** The content is good. The documentation lifecycle and the consumer-facing layer are weak.

## Findings table

| ID | Title | Severity | Merge-blocking | Confidence |
|---|---|---|---|---|
| DOC-1 | CLAUDE.md is stale well beyond the status line (K3+) | Major | No | Verified |
| DOC-2 | READMEs + changeset document overlay APIs that do not exist | Major | No (fix before release) | Verified |
| DOC-3 | READMEs cover ~⅓ of the shipped surface | Major | No | Verified |
| DOC-4 | Breaking palette rewrite shipped without changeset; migration guide says "no breaking changes" | Major | No (Yes for next release) | Verified |
| DOC-5 | Pending changesets contain wrong API names / tokens → wrong CHANGELOG | Major | No (Yes for next release) | Verified |
| DOC-6 | Internal milestone names (v0.7…v0.15) collide with semver (npm still 0.6.0) | Major | No | Verified |
| DOC-7 | Plans: 0/1,767 checkboxes ticked; the "plan as contract" record is untrustworthy | Major | No | Verified |
| DOC-8 | Spec lifecycle: no Implemented/Superseded status, no decision log | Minor | No | Verified |
| DOC-9 | Select specs (v0.14/v0.15) mandate invalid ARIA; spec is the K1 root cause, plus other drifts | Major | Yes (v0.15 branch) | Verified |
| DOC-10 | v0.13 atoms spec ↔ code drift (Tag live region, Chip nested button, Progress, Badge) | Major | No | Verified |
| DOC-11 | v0.11 overlay spec self-contradicts; code misses acceptance criteria | Major | No | Verified |
| DOC-12 | v0.12 toast spec ↔ code drift (no `<tulpar-toaster>`, message pill, cross-channel dismiss) | Major | No | Verified |
| DOC-13 | v0.10 selection spec ↔ code drift (readonly radio group, unlabeled aria-label) | Major | No | Verified |
| DOC-14 | v0.1–v0.8 spec ↔ code drift (30 items: form lifecycle, mask events, skip link, rail a11y, Vue slot carriers, spec-less sidenav search) | Major | No | Verified (sub-review + spot-checks) |
| DOC-15 | Layering ADR rule 4 never executed (hand-rolled rail-flyout positioning) | Minor | No | Verified |
| DOC-16 | Consumer documentation set incomplete for a commercial DS (no CEM, API tables, a11y, browser, policies) | Major | No | Verified |
| DOC-17 | Storybook: v8 (2 majors behind), a11y "test: error" is a no-op, 0 play tests, no docs pages | Major | No | Verified |
| DOC-18 | Decision: Angular `-ng` wrapper element + `display:contents` is the wrong wrapper model | Major | No | Verified |
| DOC-19 | Decision: "no ControlValueAccessor — form association bubbles to Reactive Forms" is false | Major | No | Verified |
| DOC-20 | Decision: four intent vocabularies (severity / tone / color, warn vs warning, outlined vs outline) | Major | No | Verified |
| DOC-21 | Dark-mode contract: `.dark` only, no `color-scheme` anywhere | Minor | No | Verified |
| DOC-22 | Broken relative links in plans/specs (25+) | Minor | No | Verified |
| DOC-23 | Language mixing (TR/EN) and terminology drift across docs | Minor | No | Verified |
| DOC-24 | Repo hygiene in the documentation layer (tracked build output, `.claire/` worktree files, "." commit messages) | Nit | No | Verified |

---

### DOC-1: CLAUDE.md is stale well beyond the status line (extends K3)
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `CLAUDE.md` (Status, Authoritative Docs, Architecture, Tech Stack, Out of Scope, Shipped so far, Execution Workflow, Form-associated)
- Problem: K3 (the status line) is known. Every other section is also stale:
  - **Tech Stack:** "TypeScript 5.4+" → root `package.json` has `typescript ^6.0.0`, and the playgrounds use `~6.0`. "Node 22.22.3 (pinned in .nvmrc)" → `.nvmrc` = `26.13.0` and `engines.node >=26.13.0`. "Vue 3.4+" → the wrapper peer is `vue ^3.5.0`. "Storybook 8" is correct (8.6.18 installed), but that version is outdated (DOC-17). "Vite (library mode)" hides the fact that core/shell/tokens/vue use `vite ^5.1.0` while angular/playground-vue use `^8`.
  - **Architecture quick ref:** lists 5 core elements. The code registers 22 public core elements and 5 shell elements (`tulpar-nav-section` is missing). Shell is still marked "[v0.6 target]".
  - **Authoritative Docs:** points only to the v0.1 button spec/plan and the v0.6 docs. `docs/roadmap.md` is not linked, and neither are the 16 later specs. The rule "The plan is the working contract … the spec is authoritative" therefore points at a superseded plan.
  - **Out of Scope for v0.6:** still lists "Public Tooltip / Badge / Icon components". Tooltip shipped in v0.11 and Badge in v0.13. It also lists "Configurator panel (v2 — needs Select/Switch/Checkbox first)", and all three now exist. CLAUDE.md calls this list "binding", so agents get wrong scope guidance.
  - **Shipped so far:** stops at v0.6. v0.7 palette/button polish, v0.8 sidebar, v0.10 selection, v0.11 overlay, v0.12 toast, v0.13 atoms and v0.14/v0.15 select are all missing.
  - **Execution Workflow:** "start at the first unchecked task". All plans have 0 ticks (DOC-7), so an agent that follows this instruction restarts at task 1.
  - **Form-associated section:** claims native form association "bubbles up to Angular Reactive Forms". It does not (DOC-19).
  - The Commands section is correct. All scripts exist (`dev`, `dev:ng`, `dev:vue`, `dev:storybook`, `--filter docs storybook`, `playground-ng start`, `playground-vue dev`), and ports 4310/5273/6006 match `angular.json:54`, `vite.config.ts:15` and the docs script.
- Evidence: `package.json` (engines, typescript), `.nvmrc`, `packages/vue/package.json` (peer vue ^3.5.0), `apps/docs/node_modules/storybook` 8.6.18, a `git grep` of `customElement("…")` registrations.
- Why it matters: CLAUDE.md is the steering document for every agent session. Stale scope lists and a stale "authoritative" pointer produce wrong decisions. Wrong toolchain claims mislead contributors.
- Correct solution: Make CLAUDE.md *point* to living sources instead of duplicating them:
  - "Shipped" and "Status" → link to `docs/roadmap.md §2` (already maintained).
  - "Out of scope" → "see the current milestone spec's §Out-of-scope + roadmap §7".
  - Tech stack versions → "see `package.json` / `pnpm-workspace.yaml` catalog". Pin nothing in prose.
  - Keep only rules and conventions in CLAUDE.md.

  This follows the CLAUDE.md best practice: short, rules-first, references over copies (Anthropic Claude Code memory docs, https://docs.anthropic.com/en/docs/claude-code/memory).
- Interim: Patch the five stale sections by hand. Add a CI check that greps `.nvmrc` against the Node line, or delete the line.
- Effort: S

### DOC-2: READMEs and a changeset document overlay APIs that do not exist
- Severity: Major
- Merge-blocking for current branches: No (must be fixed before the next npm release; READMEs ship in the tarball, see `files: ["dist","README.md","LICENSE"]`)
- Confidence: Verified
- Where:
  - `packages/angular/README.md:72-75` — `<tulpar-popover-ng id="acctMenu" …>`. No Angular selector `tulpar-popover-ng` exists. The selectors are only the directives `[tulparPopover]`/`[tulparPopoverRef]` (all selectors in `packages/angular/src` were grepped).
  - `packages/vue/README.md:50` — `import { …, TulparPopover } from "@tulpar-ui/vue"`. Not exported (`packages/vue/src/index.ts` exports only `vTulparPopover`).
  - `packages/vue/README.md:64` — `v-tulpar-popover-ref="'acctMenu'"`. No such directive. The real idioms are `v-tulpar-popover:ref="'id'"` or `v-tulpar-popover="{ ref: 'id' }"` (`packages/vue/src/overlay/overlay-directive-base.ts:88-98`).
  - `packages/vue/README.md:68` — "`open` supports `v-model:open`". A directive cannot emit `update:open`. The code uses an `onOpenChange` callback (`vue/src/overlay/overlay-directive-base.ts:53-56`).
  - `.changeset/v0-11-overlay-family.md:25-26` — "`v-tulpar-popover-ref` directives + `TulparPopover` with `v-model:open`". This text will be published in the CHANGELOG.
- Evidence: see the paths above. Copying the README example into an app fails to compile (Vue: missing export) or renders an unknown element (Angular, with `CUSTOM_ELEMENTS_SCHEMA` errors suppressed).
- Why it matters: The first thing a consumer copies does not work. For a potentially commercial DS, this is the worst kind of doc bug.
- Correct solution: Generate the usage snippets from tested sources. Make README examples doctests: extract the fenced blocks and type-check them in CI, as Angular Material and Lit do for docs snippets. Better still, point READMEs to the Storybook/docs site for per-component API and keep only install + one example in each README (Shoelace/Web Awesome, Carbon and Spectrum WC all do this). Fix the four snippets now.
- Effort: S (fix) / M (snippet type-check in CI)

### DOC-3: READMEs cover about a third of the shipped surface
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - `README.md:19-24`: the packages table omits `@tulpar-ui/shell`. It describes core as "`<tulpar-button>`, input family", and quick starts show only Button.
  - `packages/core/README.md`: documents button, inputs and overlay only. The "Subpath exports" table (`:99-110`) lists 8 subpaths, but `package.json#exports` has 22+. Missing: switch, checkbox(-group), radio(-group), toast + `toast()/message()` API, tag, badge, chip, avatar, skeleton, spinner, progress, select/option/option-group.
  - `packages/angular/README.md` and `packages/vue/README.md`: same gap. There is no mention of selection, toast service (`provideTulparToast`, `useTulparToast`), atoms or Select.
  - `packages/shell/README.md:36-41`: the components table omits `tulpar-nav-section` (exported by `packages/shell/src/index.ts`).
  - `README.md:65` and `packages/angular/README.md:26`: they use `"node_modules/@tulpar-ui/tokens/dist/css/tulpar.css"`. This bypasses the package `exports` map. The exported path is `@tulpar-ui/tokens/css/tulpar.css`, and Angular CLI `styles` resolves package specifiers.
  - `docs/roadmap.md:35`: "imperative service + `<tulpar-toaster>`". No such element exists; the toaster is a `div[data-tulpar-toaster-root]` (`_internal/toaster/toaster-root.ts`).
- Evidence: `node -e` dump of `exports` maps, and `git grep customElement(` (22 core tags).
- Why it matters: npm consumers see READMEs first. Two thirds of the product is invisible there.
- Correct solution: One README pattern per package: install → minimum setup → link to the per-component docs. The component list in the README must be generated from the CEM (DOC-16), so it cannot drift again.
- Effort: S–M

### DOC-4: A breaking palette rewrite shipped without a changeset; the migration guide says "no breaking changes"
- Severity: Major
- Merge-blocking for current branches: No (Yes for the next npm release)
- Confidence: Verified
- Where:
  - `packages/tokens/src/primitive/color.ts` (commit `f9d9eee feat(tokens): replace primitive palette with 22 Chromatic Mythology families`).
  - `.changeset/` has no changeset that mentions palette or primitives. `v0-8-shell-sidebar-redesign.md:9` even says "No primitive token values changed."
  - `docs/migration/v0.6-to-v0.10.md:3-7`: "v0.10 is a purely additive release. There are **no breaking changes**…"
- Problem: The published `@tulpar-ui/tokens@0.6.0` exports `primitiveColor.navy/gold/slate/blue…` (`git show @tulpar-ui/tokens@0.6.0:packages/tokens/src/primitive/color.ts` → `navy:` :6, `gold:` :21, `slate:` :49, `blue:` :198). Current code removed all 21 of those families. That removes TS exports and `--tulpar-primitive-color-*` CSS variables, and it changes the brand color to tulpar green (spec `2026-06-15-…-palette-design.md:7-13,45-50`). This is a breaking change for anyone who used primitives or the default brand look. Nothing in the release pipeline records it.
- Why it matters: The next `changeset version` produces a CHANGELOG that hides the most visible change in the project. Consumers who upgrade get a different brand color and missing CSS variables with no warning.
- Correct solution: Add a changeset for `@tulpar-ui/tokens` (minor, which is valid for 0.x under semver §4, but labelled **BREAKING** in the text). Add a "Palette migration" section with an old→new family map, and correct the v0.6→v0.10 guide. Make it a process rule: every PR that removes or renames an exported symbol, CSS variable, attribute or event needs a changeset with a `BREAKING:` prefix. Enforce it with an API-diff check (api-extractor for TS exports plus a CEM diff for elements, e.g. `@custom-elements-manifest/analyzer` + a diff script). Spectrum WC and Carbon publish breaking changes only with migration notes (https://opensource.adobe.com/spectrum-web-components/support-and-compatibility/).
- Effort: S (doc) / M (API-diff gate)

### DOC-5: Pending changesets contain wrong API names and token names (they become the published CHANGELOG)
- Severity: Major
- Merge-blocking for current branches: No (Yes before `changeset version`)
- Confidence: Verified
- Where:
  - `.changeset/v0.12-toast-message.md:8`: "Angular (`provideTulparToast`, `TulparToast`/`TulparMessage`, …)". The real exports are `TulparToastService`, `TulparMessageService` and `provideTulparToast` (`packages/angular/src/public-api.ts`).
  - `.changeset/v0-11-overlay-family.md:18` uses token names `--tulpar-color-overlay-surface`, `--tulpar-z-overlay` and similar. The code uses `--tulpar-overlay-surface-bg`, `--tulpar-overlay-z-index` and `--tulpar-overlay-tone-*` (verified by the v0.11 drift sub-review).
  - `.changeset/v0-11-overlay-family.md:25-26`: the Vue API that does not exist (DOC-2).
  - `v0.13`, `v0-14` and `v0-15` changesets omit `@tulpar-ui/shell`. This is correct because shell did not change. The `linked` group still bumps it, which is fine.
- Why it matters: The CHANGELOG is the contract text that npm users read.
- Correct solution: Review changesets as API documentation in PR review, with the same rigor as code. Derive the changeset's API list from the CEM/api-extractor diff (DOC-4).
- Effort: S

### DOC-6: Internal milestone names (v0.7…v0.15) collide with semver; npm is still 0.6.0
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: every spec and plan filename, the roadmap, `docs/migration/v0.6-to-v0.10.md`, and the changeset names. `git tag` shows `@tulpar-ui/*@0.6.0` as the last release. The 9 pending changesets are all `minor`, and `config.json` has `"linked": [["@tulpar-ui/*"]]`.
- Problem: With linked versioning, the next release bumps everything once, to **0.7.0**. That one npm version contains internal milestones "v0.7" to "v0.15". So the guide "Migrating … to v0.10" refers to a version that will never exist on npm. Users who read "Select (v0.14)" in docs will look for `@tulpar-ui/core@0.14`. This overlaps K4 but is a separate *naming* problem.
- Why it matters: For a commercial product, docs version numbers must equal installable versions.
- Correct solution: Pick one model and record it as a decision:
  - **(a) Release every milestone** (recommended). Run `changeset version` + publish at the end of each milestone, so the milestone name equals the npm version.
  - **(b) Rename milestones** to feature names (for example "Wave 2 · Select"), and let semver be produced by changesets only.

  Either way, rename the migration guide to the real npm range (`0.6 → 0.7`). Mature systems tie docs to released versions: Carbon, Spectrum and Web Awesome docs are versioned per npm release.
- Effort: S (decision) / S (rename)

### DOC-7: Plans have 0 of 1,767 checkboxes ticked; the "plan as working contract" record cannot be trusted
- Severity: Major (process)
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: all 19 files in `docs/superpowers/plans/`. Counts: v0.1 0/205, v0.2 0/53, v0.3 0/53, v0.4 0/143, v0.1.1 0/43, v0.5 0/266, v0.6a 0/42, v0.6b 0/59, palette 0/62, sidebar-v2 0/63, button-polish 0/63, sidebar-redesign 0/86, v0.10 0/73, v0.8 0/78, v0.11 0/104, v0.12 0/44, v0.13 0/55, v0.14 0/89, v0.15 0/86.
- Problem: CLAUDE.md calls the plan "the working contract" and says to resume "at the first unchecked task". In practice the plans are write-once. The actual execution record lives only in commit history. A reader cannot tell from the plan whether a task was done, skipped or changed. The drift findings (DOC-9…13) show that many plan and spec items were changed during execution without any written trace. Plans also accumulate review edits after approval: the v0.15 plan has 2+ "address plan-review" commits, and none of that is reflected as status.
- Why it matters: The record is not trustworthy, and the documented resume procedure is broken. For an owner who reviews merges from GitHub, a plan that says "nothing done" next to a branch that says "all done" adds noise instead of signal.
- Correct solution (lightweight, industry-standard):
  1. **Tick as you go, in the same commit** as the task (the `superpowers:executing-plans` / `subagent-driven-development` flow already expects it). Add a pre-merge check: `grep -c '- \[ \]'` on the milestone's plan must be 0, or each remaining item carries `~~struck~~ — deferred: <reason>`.
  2. When the plan is done, add a **closing block** to the plan header: `Status: Implemented — branch/PR, merged <sha>, deviations: …`. Deviations get one line each, with a link to the spec errata.
  3. Keep durable *decisions* out of plans. Record them in ADRs (`docs/adr/NNNN-title.md`, MADR format, https://adr.github.io/madr/). Plans are disposable execution scripts; ADRs and specs are the record.
  4. Do not retro-tick old plans. Add one line to each old plan: "Historical — executed; see git history / roadmap §2."
- Effort: S

### DOC-8: Spec lifecycle — no Implemented/Superseded status and no decision log
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: the status headers of all 22 specs (`grep -m1 '^\*\*(Status|Durum)'`):
  - v0.4, v0.5 and v0.10 say "Draft".
  - v0.11, v0.12, v0.14 and v0.15 say "Draft — pending spec review".
  - v0.13 says "pending user approval".
  - Palette says "plan bekliyor" (awaiting plan).
  - Sidebar specs say "pending spec review".
  - None says Implemented or Superseded.
- Problem: Later specs override earlier ones, for example the v0.2 redesign and v0.7 polish over the v0.1 button spec, and v0.8 over v0.6 shell. The old specs carry no "superseded by" pointer. Specs were also edited during execution without errata (DOC-9…13).
- Correct solution: Use the status lifecycle `Draft → Approved → Implemented (sha) → Superseded by <link>`, the same as IETF/RFC status and Python PEP "Final/Superseded". Put the active decisions in an ADR index. Specs stay as design history, and errata get a dated "Changes after approval" section at the bottom.
- Effort: S

### DOC-9: The Select specs (v0.14/v0.15) mandate invalid ARIA — the spec is the root cause of K1 — plus other drifts
- Severity: Major
- Merge-blocking for current branches: Yes for `feat/v0.15-select-completion` (K1 is already a blocker; the spec must be fixed together with it, otherwise the next implementer re-introduces the bug)
- Confidence: Verified (code lines re-checked by me; the remainder comes from a delegated read-only sub-review with file:line evidence)
- Where / Problem:
  1. **The spec mandates the search input inside the listbox.**
     - S15 `2026-06-24-…-v0.15-select-completion-design.md:21-22`: "an opt-in search input inside the listbox".
     - S15 `:223`: "sticky search input at the top of the listbox".
     - S15 `:256`: "rendered inside the listbox, §5.1".
     - The code follows the spec: `core/src/select/tulpar-select.ts:854-863` puts `role="listbox"` → `${this._renderSearch()}`.
     - The status rows (`role=status`/`alert`, `:789-815`) also sit inside the listbox.
     - ARIA 1.2 *Required Owned Elements* of `listbox` = `group` / `option` only (https://www.w3.org/TR/wai-aria-1.2/#listbox).
     - **The spec is wrong.**
  2. **S15 contradicts itself on the trigger role.** `:252-253` says the searchable trigger is an opener "without role=combobox", and `:428` says the trigger is the combobox while closed. The code (`:883`) uses `button` when searchable.
  3. **The accessible-name contract fails.** S14 `:168` says "aria-labelledby → the FormFieldBase label". The code uses `<label for="control">` (`_internal/form-field-base.ts:268,275`) pointing at a `<div role=combobox>`. A `<div>` is not labelable, so the trigger has no accessible name when a visible label is used.
  4. **`aria-activedescendant` (S14 `:156,178`) is a string IDREF across the shadow boundary.** `_internal/listbox/active-descendant-controller.ts:87-88` sets it on a shadow-DOM trigger pointing to light-DOM slotted options. The reference is dead in slotted mode. Data-mode works.
  5. **Typeahead lands on disabled options**, contrary to S14 `:153`. `listbox/collection.ts:24` and `typeahead.ts:41,48` do not filter disabled options.
  6. **There is no constraint validation for `required`** (S14 `:231-233`). `setValidity` is not used anywhere in `packages/core/src` (verified with grep).
  7. **The loading row cannot be reached.** Opening is refused while `loading` is set (`tulpar-select.ts:453,495,508`), contrary to S14 `:129,242`.
  8. **Other gaps:** no duplicate-value dev-warn (S14 `:149`), positional data-mode ids instead of value-derived ids (S15 `:102`), and the Angular option-group wrapper lacks `disabled` (S15 `:212-214`). These overlap K2.
- Why it matters: The spec is the reusable foundation for Combobox, MultiSelect and Menu (roadmap Wave 2). An invalid ARIA pattern in the spec spreads to every future listbox component.
- Correct solution (spec first, then code):
  - **Structure:** follow APG *Select-Only Combobox* for the non-searchable case. For the searchable case, follow the APG *Editable Combobox With List Autocomplete* (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/). Use a popup container (a plain `div[popover]`, or `role=dialog` with a name). Inside it, put `<input role=combobox aria-autocomplete=list aria-controls=LB aria-activedescendant>` and, as a **sibling**, `<div role=listbox id=LB>` containing only options and groups. The live status row is a sibling of the listbox, not a child. The trigger becomes `role=button aria-haspopup=dialog aria-expanded`.
  - **Precedent:** GitHub Primer SelectPanel uses the input and listbox as siblings in a dialog. Carbon ComboBox, Fluent v9 Combobox, React Aria ComboBox and MUI Autocomplete instead make the trigger itself the editable combobox.
  - **Cross-shadow references:** use ARIA element reflection (`trigger.ariaActiveDescendantElement = optionEl`, `ariaLabelledByElements`). It is valid toward shadow-including ancestors (https://w3c.github.io/aria/#ARIAMixin). Otherwise, render a labelable control.
  - **Validation:** use `ElementInternals.setValidity({valueMissing:true}, msg, anchor)` for `required` across the FormFieldBase family (https://html.spec.whatwg.org/multipage/custom-elements.html#dom-elementinternals-setvalidity), as Shoelace/Web Awesome form controls and Lion do.
  - Rewrite S15 §4/§5.1 and add an errata note to S14.
- Effort: M

### DOC-10: v0.13 atoms spec ↔ code drift (Tag/Badge/Chip split implemented, but with a11y errors)
- Severity: Major
- Merge-blocking for current branches: No (already on main)
- Confidence: Verified (Tag/Chip lines re-checked by me; the rest from the sub-review)
- Where / Problem (spec S13 = `2026-06-22-…-v0.13-display-status-atoms-design.md`):
  - The split itself (Tag static, Chip interactive, Badge count/dot) is implemented as specified, and the defaults match. Note: S13 `:213` says Tag has **no** remove control. The review brief's "Tag with optional remove" comes from `docs/roadmap.md:110` ("Tag = static tonal metadata label (optional `✕`)"). **So the roadmap contradicts the spec.**
  - **Tag is a live region.** `tag/tulpar-tag.ts:95` sets `role="status"` on every tag. S13 `:217` says "non-interactive; renders as inline text". In a grid that makes hundreds of polite live regions. **The code is wrong.**
  - **Chip nests interactive controls, and the spec design causes it.** The host is `role="button"` (`chip/tulpar-chip.ts:123`) with a remove `<button>` inside (`:410-420`). The children of `role=button` are presentational, and axe reports `nested-interactive`. S13 `:254-255` describes exactly this layout. **The spec is wrong.** Correct: host = no role or `group`, with the body as an inner `<button part=body>` and the remove `<button>` as its sibling. For the future ChipGroup, use React Spectrum TagGroup (grid/row/gridcell, https://react-spectrum.adobe.com/react-spectrum/TagGroup.html) or Carbon DismissibleTag (separate close button).
  - **Progress `aria-labelledby` points into its own shadow** (`progress/tulpar-progress.ts:219` → id rendered at `:366`). The reference is dead.
  - **Omitted `value` does not give indeterminate**, contrary to S13 `:324`. The code checks `this.indeterminate` only (`:342,392`).
  - **Unspecified scope:** Progress `tone="flow"` and sizes `xs…xl` (`tulpar-progress.ts:11-20`). The spec gives `sm|md|lg` (S13 `:332,457`) and has no `flow`.
  - **Badge lacks the `custom` tone** that S13 `:108-115` gives it (`badge/tulpar-badge.ts:6,273`).
  - **Wrapper event names:** S13 `:360,366` says `tulpar-click`/`tulpar-remove` outputs. The code uses `clicked`/`removed` (consistent, so the spec should change).
- Correct solution: Fix the Tag role and the Progress labelling in code. Rewrite the Chip anatomy in the spec, then in code. Add an errata section to S13 for flow/xs/xl, or remove them. Align the roadmap §5 Tag line with the spec.
- Effort: M

### DOC-11: The v0.11 overlay spec contradicts itself; the code misses some acceptance criteria
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (sub-review with file:line; changeset/README items re-checked by me)
- Where / Problem (spec S11 = `2026-06-18-…-v0.11-overlay-family-design.md`):
  - **The composition decision is correctly implemented**: `for="id"` plus inline directives plus Ref directives (Angular `[tulparXRef]`, Vue `:ref` arg / `{ref}`). However, **the spec still describes the superseded slot-wrap/element model**:
    - S11 `:53-54` lists `tulpar-tooltip-ng` and Vue `TulparTooltip/TulparPopover` elements.
    - S11 `:141` shows `tooltipTone="info"`, which contradicts S11 `:241` (tooltip has no tone).
    - S11 `:293-298` says "portals to a defined root", which contradicts S11 `:438-439` ("No body portal"). `overlay-root.ts:48 getOverlayRoot()` is dead code.
    - These stale passages are the source of the README/changeset errors in DOC-2.
  - **Acceptance criteria not met:**
    - There is no scroll/resize repositioning or closing for tooltip, toggletip or popover (S11 `:96-100`, `:324`).
    - Esc on a hover-opened tooltip calls `trigger.focus()`, which re-opens the tooltip (`tooltip/tulpar-tooltip.ts:410-415` + `:273-280`). This contradicts S11 `:186` "without moving focus".
    - The toggletip sets `aria-haspopup="dialog"` with no dialog role on the surface (`toggletip/tulpar-toggletip.ts:236,524`), while S11 `:19,191` specifies disclosure + live region.
    - Tooltip and toggletip `boundary` support only `viewport` (S11 `:92-93` promises scroll-parent and element).
    - Delays are magic numbers (`_internal/overlay/delay-controller.ts:25-29`), while S11 `:227` says tokens. The token exists in `tokens/src/brand/tulpar/light.ts:367`.
    - Touch "degrades to toggletip" (S11 `:18`) is not implemented, so a tooltip never opens on touch. The READMEs still promise it (`core/README.md:86-87`, both wrapper READMEs).
  - **Wrapper `open` binding:**
    - Angular uses `openControlled` + `openChange` (`angular/src/overlay/overlay-directive-base.ts:63`), so `[(open)]` banana syntax does not work. S11 `:172,376` promises it.
    - Vue `v-model:open` (S11 `:173,377`) is impossible on a directive.
  - S11 `:203` "every dismiss path returns focus to the trigger" is itself wrong for outside-click (APG: do not steal focus from what the user clicked). The code's behavior is right. **Fix the spec.**
- Correct solution:
  - Spec errata: remove the element-wrapper and portal passages and document the real binding idioms.
  - Code: autoUpdate on scroll/resize, the same model as Floating UI `autoUpdate` (https://floating-ui.com/docs/autoUpdate). Make the toggletip pure disclosure (`aria-expanded` only). Do not refocus on Esc for hover-opened tooltips. Read delays from tokens. Implement or explicitly defer the touch degradation, and delete the README claim until then. Rename the Angular input to `open` to get `[(open)]`.
- Effort: M

### DOC-12: v0.12 toast/message spec ↔ code drift
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (sub-review; `message.dismiss` re-checked by me at `core/src/toast/toast-service.ts:850-858`)
- Where / Problem (spec S12 = `2026-06-18-…-v0.12-toast-message-design.md`):
  - **There is no `<tulpar-toaster>` element** (S12 `:21,55-57`). The toaster is a plain `div[role=region]` (`_internal/toaster/toaster-root.ts:256-271`). Defaults are set only through `toast.setDefaults`. Roadmap `:35` repeats the non-existent element.
  - **Dismiss is not separated by channel.** `message.dismiss()` with no id removes **all** entries, including persistent error toasts (`toast-service.ts:850-858`). `toast.dismiss()` removes messages too (`:737-745`). The spec has per-channel APIs (S12 `:89,93`). **The code is wrong.**
  - **Message is not rendered as the specified pill** (S12 `:182`). It reuses the 360px toast card, including the timer ring.
  - **`message.danger()` gets `role=alert`/assertive** (`tulpar-toast.ts:503-513`), while S12 `:223` says Message is always `status`/polite.
  - **Angular API names differ:** the spec and changeset say `TulparToast`/`TulparMessage`; the code exports `TulparToastService`/`TulparMessageService`/`provideTulparToast`. There is no Angular queue `signal()` (S12 `:306-307`).
  - **Options shape:** `action` (S12 `:106`) became `actions[]` (`toast-service.ts:74`). The `toast.promise` return type contradicts itself in the spec (`:83-87` vs `:142`). The public CSS hooks `--tulpar-toast-bg/-accent/-text` (S12 `:287-288`) do not exist. Token names differ (`--tulpar-feedback-*` vs `--tulpar-color-feedback-*`, `--tulpar-z-toast` vs `--tulpar-feedback-z-index`).
  - The Vue composable is a global singleton, not app-bound (S12 `:316-317`).
- Correct solution: Fix in code: channel-scoped dismiss, Message pill variant, Message role always `status`. Add spec errata for names, tokens, `actions` and the toaster element. Decide whether `<tulpar-toaster>` becomes real; Sonner, PrimeNG `<p-toast>` and Web Awesome all expose a declarative host. If it does not, delete it from the spec and the roadmap.
- Effort: M

### DOC-13: v0.10 selection spec ↔ code drift
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified (`_ariaLabel` re-checked by me at `_internal/selection-control-base.ts:195-198`)
- Where / Problem (S10 = `2026-06-17-…-v0.10-selection-family-design.md`):
  - **A readonly radio group still changes value with Arrow/Home/End.** `radio-group/tulpar-radio-group.ts:79-81,214-224` ignore `readonly`, while S10 `:165` says "not user-changeable". **The code is wrong.**
  - **An unlabeled control cannot get a name.** S10 `:137` tells consumers to put `aria-label` on the host. `_ariaLabel()` returns `this._hasLabel() ? undefined : this.label`, which is always `undefined` when there is no label, and the host `aria-label` is not forwarded to the inner `role=switch|checkbox|radio`. **The code is wrong.** The fix is to reflect the host's `aria-label`/`aria-labelledby` into the shadow control, or to use `ElementInternals.ariaLabel` delegation.
  - **There is no group reconciliation on form reset** (S10 `:302`).
  - `aria-required` is set on `role=group` (`selection-group-base.ts:209`). That attribute is not supported on `group`. Use it only on `radiogroup`. **The spec should change** (S10 `:377`).
  - The `description` prop exists in code but not in the spec (S10 `:135`). **The spec is stale**; the code follows the dual prop+slot rule.
- Effort: S–M

### DOC-14: v0.1–v0.8 spec ↔ code drift
See the appendix at the end of this file (30 drift items + superseded-spec list).

### DOC-15: Layering ADR rule 4 was never executed (hand-rolled rail-flyout positioning)
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - `docs/architecture/internal-layering.md:16-17`: "First known candidate: shell's rail-flyout positioning ↔ future public Tooltip. Apply rule 3 when Tooltip is built."
  - Tooltip shipped in v0.11 with a 1,263-line `core/src/_internal/overlay` engine (flip/shift positioner, anchor, delay).
  - The shell still positions the flyout by hand: `shell/src/nav-item/tulpar-nav-item.ts:203-235` uses `estHeight = 44 * (n+1) + 16`. Its own comment says "may over/under-reserve … deferred".
  - No `@tulpar-ui/base` package exists, and the ADR was not updated with the outcome.
- Problem: The decision record names a concrete trigger. The trigger fired, and nothing happened or was recorded.
- Correct solution: Apply rule 3 as written. The positioner is >50 lines, so promote `_internal/overlay/{positioner,anchor}` to a published-but-undocumented `@tulpar-ui/base` (or `@tulpar-ui/overlay-engine`), as Spectrum WC does with `@spectrum-web-components/overlay` and Shoelace/Web Awesome with the shared `popup` primitive. Then make the shell flyout consume it. Update the ADR with an "Outcome" line. If the owner chooses not to do this, record that decision in the ADR.
- Effort: M

### DOC-16: The consumer documentation set is incomplete for a commercial DS
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: whole repo. `git grep` for `custom-elements`, `customElements.json`, `setCustomElementsManifest` and `cem analyze` returns nothing. There is no `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, `.github/ISSUE_TEMPLATE` or browser-support doc (`git grep -il "browser support|browserslist"` matches only an old migration note). Package `package.json` files have no `customElements` field and no `sideEffects` field.
- Benchmark (what mature WC systems ship vs Tulpar):

| Item | Web Awesome / Shoelace | Spectrum WC | Carbon WC | Tulpar |
|---|---|---|---|---|
| Custom Elements Manifest in package + generated API tables (attrs, props, events, slots, parts, CSS vars) | yes (https://webawesome.com/docs/components/tooltip) | yes (`custom-elements.json` per package) | yes | **no** — hand-written argTypes |
| Per-framework getting started | yes | yes | yes | README snippets only (partly wrong, DOC-2) |
| Theming guide + token reference | yes | yes | yes | palette list in tokens README + one Colors story; no semantic token reference |
| Per-component accessibility section | woven into the docs | yes, "Accessibility" section per component, WCAG AA target | yes | none in consumer docs (only in specs) |
| Browser support matrix | yes | yes, "latest 2 majors of Chrome/Firefox/Edge/Safari" (https://opensource.adobe.com/spectrum-web-components/support-and-compatibility/) | yes, latest Chrome/Firefox/Safari (https://carbondesignsystem.com/help/faq/) | **none**, although Popover API, `ElementInternals` and `:state()` set real minimums (Safari 17+ for popover) |
| Versioning / deprecation policy | yes | "breaking only in major" | yes | none (and DOC-6 naming problem) |
| Editor tooling (VS Code custom data, JetBrains web-types) | yes (`vscode.html-custom-data.json`, https://shoelace.style/getting-started/usage) | — | — | none |
| CONTRIBUTING / SECURITY / CoC | yes | yes | yes | none (only MIT LICENSE) |

- Why it matters: Without a CEM there is no reliable API reference, no IDE autocomplete, no Storybook props table and no API-diff gate (DOC-4). Generated wrappers and lint rules are also impossible. The manifest is the standard (https://github.com/webcomponents/custom-elements-manifest).
- Correct solution:
  1. Add `@custom-elements-manifest/analyzer` with the Lit plugin to core and shell builds. Publish `custom-elements.json` and set `"customElements": "custom-elements.json"` in `package.json`.
  2. Storybook: `setCustomElementsManifest()` in `preview.ts`, so autodocs tables are generated.
  3. Generate `vscode.html-custom-data.json` and `web-types.json` from the CEM.
  4. Write MDX docs pages: Introduction, Getting started (Angular/Vue/vanilla), Theming & dark mode, Token reference (generated from the tokens TS), Accessibility statement (target WCAG 2.2 AA + per-component keyboard table taken from the specs), Browser support, Versioning & deprecation policy.
  5. Add `CONTRIBUTING.md`, `SECURITY.md` (GitHub private vulnerability reporting) and `CODE_OF_CONDUCT.md`.
  6. Declare `sideEffects` (the element-registering entry points are side-effectful; types-only entries are not).
- Effort: M–L

### DOC-17: Storybook — v8 (two majors behind), a11y "test: error" is a no-op, 0 play tests, no docs pages
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `apps/docs/package.json` (`storybook ^8.0.0`, installed 8.6.18), `apps/docs/.storybook/{main,preview}.ts`, `apps/docs/stories/*.stories.ts`, `.github/workflows/*.yml`
- Problem:
  1. **Version:** Storybook 9 (2025) and 10 (Oct 2025, ESM-only, now 10.3) are current (https://storybook.js.org/releases/10.0, https://storybook.js.org/blog/storybook-10/). 8.x is two majors behind.
  2. **a11y gate is fake.** `preview.ts` and 16 story files set `a11y: { test: "error" }`. That parameter only has an effect with the Vitest addon / test-runner. Neither is installed, and CI only runs `build-storybook` (`deploy.yml:41`). The a11y checks happen only when someone opens the panel by hand. This gives false assurance.
  3. **No interaction tests:** 0 `play:` functions across 24 story files. Keyboard contracts (Select, RadioGroup, overlays) are not exercised in Storybook. They are covered in WTR, which is good, but stories are the consumer-visible proof.
  4. **No docs pages:** no MDX (Introduction, Getting started, Theming, Tokens, Accessibility). The only foundation story is `Foundations/Colors`.
  5. **Props tables are hand-maintained** (`argTypes` in every file, no CEM). They drift: Select `argTypes` (`Select.stories.ts:33-58`) omits the v0.15 `searchable` and `options` props, which appear only in stories.
  6. **Taxonomy is inconsistent.** Groups are `Components/*` (Button, inputs, selection and Select mixed), `Display & Status/*`, `Feedback/*`, `Overlay/*`, and `Shell/TulparShell` (class-style name, unlike the others). There is no "Forms" or "Inputs" group.
  7. **The dark theme switch toggles only `.dark`.** The tokens CSS has no `color-scheme` (`grep color-scheme packages/tokens/dist/css/tulpar.css` returns nothing), so native scrollbars, inputs and `<select>` stay light in the dark story canvas (see DOC-21).
  8. **Copy nits from web-design-guidelines:** placeholders without an ellipsis (`Select.stories.ts:289-343` "Default border ring", and others). The guideline is placeholders ending with "…", and only for example patterns.
  - **Coverage is good.** Every public element has a story: radio via RadioGroup, option/option-group via Select, topbar/sidenav/nav-section via Shell.
- Correct solution:
  - Upgrade to Storybook 10 with `@storybook/web-components-vite`.
  - Add `@storybook/addon-vitest` with browser mode, so `a11y.test: "error"` actually fails CI, and run it in `ci.yml`.
  - Wire the CEM (DOC-16) and drop hand-written argTypes.
  - Add `play` functions for the keyboard contracts of Select, RadioGroup, Popover and Toast.
  - Add the MDX foundation pages.
  - Normalize titles to `Foundations/ · Actions/ · Forms/ · Selection/ · Overlay/ · Feedback/ · Display & Status/ · Shell/`, with tag-style names.
- Effort: M

### DOC-18: Decision — the Angular `-ng` wrapper element with a `display:contents` host is the wrong wrapper model
- Severity: Major (architecture; breaking to change, so decide before 1.0)
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `CLAUDE.md` "Angular wrapper selector" ("Wrappers use `tulpar-<name>-ng` … to avoid recursion … Don't try to share the same selector"). Implementation: `packages/angular/src/**` (`selector: "tulpar-text-input-ng"`, `styles: [":host { display: contents; }"]`). The documented fallout is in `packages/angular/README.md:13-15`: "size and spacing applied to `tulpar-button-ng` will not take effect". The owner's memory notes also record a production bug: "shell attrs land on the wrapper not the core (broke A4, A2 dark, rail)".
- Problem: The recursion concern is unfounded. An Angular component whose selector equals the custom-element tag and whose template is `<ng-content>` makes the custom element *itself* the component host. Angular creates the host by tag name, the browser upgrades it, and nothing recurses. The `-ng` model doubles every element in the DOM. It breaks host styling, `:has()`/sibling selectors, `nextElementSibling` logic (Chip focus relocation, v0.13 sub-review), attribute mirroring and `form`/ARIA relationships.
- Industry evidence:
  - Ionic `@ionic/angular` proxies use `selector: 'ion-button', template: '<ng-content></ng-content>'` (https://zenn.dev/teatwo/articles/542f37e3406906; source `packages/angular/src/directives/proxies.ts`).
  - The Stencil Angular output target generates the same model (https://stenciljs.com/docs/angular).
  - Shoelace/Web Awesome recommend using the elements directly in Angular with `CUSTOM_ELEMENTS_SCHEMA`.
- Correct solution: Use same-selector proxy components (`selector: 'tulpar-button'`, `template: '<ng-content/>'`, `ChangeDetectionStrategy.OnPush`), with signal `input()`s written to the host element properties through `effect()` or host bindings. Outputs are re-emitted from the element's events. This removes the wrapper element, `display:contents` and the attribute-mirroring workarounds. Ship it as a breaking 0.x minor with a migration note: the `-ng` selectors are deprecated, kept as aliases for one minor and then removed.
- Effort: L

### DOC-19: Decision — "no ControlValueAccessor; form association bubbles up to Reactive Forms" is false
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `CLAUDE.md` "Form-associated custom elements" ("The wrapper does NOT add another ControlValueAccessor — … bubbles up to Angular Reactive Forms / Vue native binding without extra plumbing"). `git grep -l "NG_VALUE_ACCESSOR\|ControlValueAccessor" packages/angular/src` returns **nothing**. There is no `formControl`/`ngModel` usage in `apps/playground-ng/src`, so the claim was never exercised.
- Problem: Form association (`ElementInternals`) feeds *native* `<form>` submission only. Angular forms bind through a `ControlValueAccessor` directive. The built-in accessors (`DefaultValueAccessor` and others) match only `input`, `textarea`, `select` and `[ngDefaultControl]`. On `<tulpar-text-input-ng formControlName="x">`, Angular throws "No value accessor for form control". So no Tulpar input, select or selection control can be used with Reactive Forms or `ngModel`. That covers the majority of enterprise Angular form code.
- Evidence: Angular docs: "Defines an interface that acts as a bridge between the Angular forms API and a native element in the DOM" (https://angular.dev/api/forms/ControlValueAccessor). Stencil generates value accessors exactly for this (`valueAccessorConfigs`, https://stenciljs.com/docs/angular). Ionic ships `TextValueAccessor`/`BooleanValueAccessor`/`SelectValueAccessor`.
- Correct solution: Ship CVA directives in `@tulpar-ui/angular`:
  - `TulparTextValueAccessor` for text-input, textarea, number-input and select: `value` + `input`/`change`.
  - `TulparBooleanValueAccessor` for checkbox and switch: `checked` + `change`.
  - Radio-group and checkbox-group: `value` + `change`.
  - Each accessor also wires `setDisabledState` and `touched` on blur.
  - Optionally, add Angular Signal Forms (`[field]`/`FormValueControl`) support, since Angular 21+ makes signal-based form controls the forward path.
  - Correct CLAUDE.md. This is consistent with the "signals only" preference; a CVA is not RxJS.
- Effort: M

### DOC-20: Decision — four intent vocabularies (severity / tone / color; warn vs warning; outlined vs outline)
- Severity: Major (API design; cheap now, breaking later)
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - Button: `severity` = `primary|secondary|info|success|warn|help|danger|contrast|premium` and `variant` = `solid|outlined|tonal|ghost|link` (`button/tulpar-button.ts:13-26`).
  - Atoms and overlays: `tone` = `neutral|info|success|warning|danger|custom` (`_internal/tone/tone-resolver.ts:53`) and `variant` = `soft-tonal|outline|solid` (`tag`, `badge`, `chip`).
  - Fields: `variant` = `outlined|filled|underlined|ghost` (`form-field-base.ts:7`) and a `warn` boolean.
  - Selection: `color` (`selection-group-base.ts:32`).
  - Progress `tone` adds `flow`. Badge `tone` lacks `custom`.
- Problem: The same concept (status intent) has three prop names (`severity`, `tone`, `color`) and two spellings (`warn`/`warning`). The same appearance has two spellings (`outlined`/`outline`, `tonal`/`soft-tonal`). Consumers must memorize per-component vocabularies, and the grid (the terminal target) will render all of them side by side.
- Industry evidence:
  - Web Awesome uses one `variant` (`brand|neutral|success|warning|danger`) plus one `appearance` (`accent|filled|outlined|plain`) across button, badge, tag, callout and others (https://webawesome.com/docs/).
  - Shoelace uses one `variant` across all components.
  - Carbon uses `kind` consistently.
  - Spectrum uses `variant` + `treatment`.
- Correct solution: Record an ADR with **one intent prop** (`tone`, already used by 8 components) and **one appearance prop** with one spelling set. Map the button's brand intents (`primary`, `secondary`, `contrast`, `premium`, `help`) as the tone values `brand`, `secondary` and the others. Accept the old names as deprecated aliases with a dev warning for one minor. Do this before Wave 2 adds Combobox, Menu and Dialog.
- Effort: M

### DOC-21: Dark-mode contract — `.dark` only, and no `color-scheme` anywhere
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `CLAUDE.md` (theme triggers), `packages/tokens/README.md:69-76`. `grep -n color-scheme packages/tokens/dist/css/tulpar.css` returns nothing. The memory note `reference_host_context_dark_fails_in_shell` records a known failure mode.
- Problem: The `.dark` class (Tailwind-compatible) is a reasonable trigger. The verdict on the decision is **Correct, but incomplete**:
  - Without `color-scheme: light`/`dark` on the themed root, UA-rendered parts (scrollbars, autofill, date/number spinners, native `<select>` popups, `light-dark()`) stay light.
  - There is no documented `prefers-color-scheme` "system" mode.
- Correct solution:
  - Emit `color-scheme: light` on `:root` and `color-scheme: dark` on `.dark` (and on `[data-theme=dark]` if added).
  - Document a `system` option, for example `<html class="dark">` set by a small helper or a `@media (prefers-color-scheme: dark) :root:not(.light)` block.
  - Web Awesome sets `color-scheme` in its `.wa-dark` theme class, and Spectrum's `<sp-theme color="dark">` does the same.
  - The web-design-guidelines rule is "`color-scheme: dark` on `<html>`" in dark mode.
- Effort: S

### DOC-22: Broken relative links in plans and specs (25+)
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified (script resolved each `](path)` relative to the file)
- Where:
  - `docs/superpowers/plans/2026-06-23-…-v0.14-select.md` and `…-v0.15-select-completion.md` use `../../packages/...`. From `docs/superpowers/plans/` that resolves to `docs/packages/...`; it needs `../../../`. There are 13 links like this.
  - `docs/superpowers/specs/2026-06-23-…-v0.14-select-design.md` has the same problem (`anchor.ts`, `positioner.ts`).
  - The v0.1–v0.3 plans use repo-root paths (`docs/superpowers/specs/...`), which GitHub resolves relative to the file, so they are broken.
  - `2026-06-09-…-v0.5-…-implementation.md` links `../superpowers/specs/...`, which is wrong depth.
- Correct solution: Add `markdown-link-check` or `lychee` (https://github.com/lycheeverse/lychee) to CI for `**/*.md`, then fix the reported links.
- Effort: S

### DOC-23: Language mixing (TR/EN) and terminology drift
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified (Turkish-character density per file)
- Where:
  - These are mostly Turkish: v0.1 button spec, v0.6 shell spec, v0.6a/v0.6b plans, palette spec, brand-assets spec, v0.7 button-polish spec (1,577 Turkish chars / 2,290 words), and `docs/architecture/internal-layering.md` (fully Turkish).
  - From v0.8 on, docs are English with Turkish fragments (for example the v0.15 plan/spec, roadmap "12'de").
  - Code comments and READMEs are English.
  - Terminology drift:
    - status intent is called "severity / tone / color" (DOC-20);
    - the "Ref idiom" is called "reference-by-id", "Ref mode" or "`for`-id model";
    - "message" means both the field message row and the Message toast;
    - "warn" and "warning".
- Why it matters: A commercial DS needs English public-facing docs. Contributors need one glossary. The binding ADR (`internal-layering.md`) is currently unreadable to non-Turkish contributors.
- Correct solution: Make it a rule that public and binding docs (README, ADR, specs, roadmap) are English and that working notes may be Turkish. Add `docs/glossary.md`, and lint it with Vale (https://vale.sh) using a project vocabulary. Translate `internal-layering.md` when it is next touched.
- Effort: S–M

### DOC-24: Repo hygiene in the documentation layer
- Severity: Nit
- Merge-blocking for current branches: No
- Confidence: Verified
- Where:
  - `build-output.txt` (UTF-16 build log) is tracked.
  - `.claire/worktrees/feat+v0.6-shell/...` is tracked (2 files from a stray worktree).
  - `apps/docs/public/tokens/tulpar.css` is a generated copy that `copy-tokens.mjs` rewrites. It is tracked, so it drifts.
  - 10+ commits have the message "." (for example `b0dbced`, `9a686c6`, `79c9f65`), including one on `docs/roadmap.md` (2026-06-22).
- Correct solution: Remove these files and add them to `.gitignore`. Enforce Conventional Commits with commitlint in the existing husky hook; the changeset flow benefits from it.
- Effort: S

---

## Decision quality (task item 4)

| Decision | Verdict | Evidence / correct alternative |
|---|---|---|
| Lit WCs + thin framework wrappers | **Correct** | Same base as Web Awesome/Shoelace, Spectrum WC, Carbon WC, Material Web (Material Web is in maintenance mode since 2024-06, https://github.com/material-components/material-web/discussions/5642, which shows the risk of depending on a single vendor's WC set). Ionic uses Stencil + generated wrappers, which is the same idea. |
| `tulpar-` prefix | **Correct** | Every system prefixes (`wa-`, `sl-`, `sp-`, `cds-`, `fluent-`, `md-`, `ion-`). The longer prefix is a fair collision trade-off. Future: support scoped custom-element registries when Baseline. |
| Angular `-ng` wrapper selector + `display:contents` | **Wrong** | DOC-18. Same-selector proxies (Ionic, Stencil). |
| No CVA, "native form association bubbles to Reactive Forms" | **Wrong** | DOC-19. |
| Vue SFC wrappers with `display:contents` slot carriers | **Questionable** | It works, but it adds a span per slot. Ionic Vue / Stencil `defineContainer` render the custom element via a render function and pass children through, so consumers write `slot="label"` on their own nodes. Revisit together with DOC-18. |
| `FormFieldBase` / `SelectionControlBase` internal abstract classes | **Correct, with a caveat** | Inheritance is fine for a closed family. Lion uses mixins and Web Awesome a `FormControlController` (composition). The caveat: public types (`FieldSize`, `FieldVariant`, `LabelPosition`) are *declared* in `_internal/form-field-base.ts:6-8` and re-exported. Move public types to a public `types.ts`, so `_internal` holds no public API. |
| `_internal` layering + copy ≤50 lines / promote to `@tulpar-ui/base` | **Correct rule, not followed** | DOC-15. |
| Tone vocabulary vs button severity | **Wrong (fragmented)** | DOC-20. |
| Overlay composition = directive on trigger + reference-by-id (`for`) | **Correct** | Matches Web Awesome `<wa-tooltip for="id">` (https://webawesome.com/docs/components/tooltip) and the native `popovertarget`/`commandfor` IDREF model. Caveat: IDREF does not cross shadow roots. Document that the trigger and overlay must share a tree scope, or accept an element reference (`.anchor = el`). The *spec text* still has the superseded wrap model (DOC-11). |
| Popover-API top-layer listbox | **Correct** | Escapes `overflow`/stacking contexts, which is the standard 2024+ approach (Web Awesome, Spectrum overlay). It requires a browser-support statement (DOC-16). |
| `aria-activedescendant` virtual focus | **Correct pattern, wrong execution** | APG select-only combobox uses it. A string IDREF across the shadow boundary is dead, so use `ariaActiveDescendantElement` (DOC-9). |
| Imperative toast/message service + auto-mounted root | **Correct** | Sonner, PrimeNG `MessageService` and the Web Awesome/Shoelace `toast()` helper. Channel-separated dismiss is missing (DOC-12). |
| Chromatic Mythology palette (22 named families) | **Correct for brand, Questionable for DX** | A distinctive primitive layer is legitimate. Consumers use semantics, which is fine. But the opaque names (`al`, `kam`, `gok`) need a hue legend in the docs (name → hue/role table), and the swap was shipped as a silent break (DOC-4). |
| 3-layer tokens (primitive → semantic → brand×mode) | **Correct** | Matches Spectrum (global/alias/component), Carbon and Material 3 (ref/sys/comp). Next step: also emit **DTCG 2025.10** JSON. The format reached its first stable version on 2025-10-28 (https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/), which enables Figma/Tokens Studio/Style Dictionary interop. |
| `.dark` class for dark mode | **Correct, incomplete** | DOC-21 (`color-scheme`, system mode). |

## Plans process (task item 3) — verdict

The process as documented (brainstorm → spec → review → plan → execute → parity → changeset, roadmap §8) is good. The *record-keeping* is not followed: 0 ticks, no closing status, no errata, and drift fixed silently in code. **The record cannot be trusted** for "what was decided and done". Recommended lightweight practice: see DOC-7 (tick in the same commit, closing block with sha and deviations, ADRs for durable decisions, CI check before merge).

## Things done well

- Specs are rich and decision-oriented. They benchmark real systems, cite APG/WCAG criteria, and carry explicit binding out-of-scope lists. No out-of-scope item from v0.10–v0.15 was implemented (all 3 sub-reviews confirmed this).
- `docs/roadmap.md` is a strong living doc: a 12-library gap analysis, ordered waves, locked decisions, and an up-to-date "Current state" table.
- The `_internal` layering is written down as a binding ADR with a concrete threshold rule and ESLint enforcement.
- The overlay composition decision (`for`-id + directives) is implemented consistently in core, Angular and Vue, and it matches Web Awesome.
- Every public element has Storybook coverage with many state stories, and the a11y and themes addons are installed.
- Migration guides exist from v0.3 onward, which is rare for a pre-1.0 project. They need accuracy fixes (DOC-4/6), not removal.
- READMEs explain *why* (for example "Which one?" for tooltip/toggletip/popover, and the `display:contents` caveat), not only *how*.
- The Commands section in CLAUDE.md and the playground READMEs is accurate: scripts and ports were verified.

## Open questions for the owner

1. Versioning model (DOC-6): release every milestone to npm (milestone = version), or rename milestones to feature names and let changesets drive semver?
2. Angular wrapper model (DOC-18): accept a breaking move to same-selector proxies before 1.0, or keep `-ng` and document its limits permanently?
3. Intent vocabulary (DOC-20): which single prop name (`tone` or `variant`) and spelling set do you want before Wave 2?
4. Docs language policy (DOC-23): English for all public and binding docs, with Turkish allowed in working notes only?
5. `<tulpar-toaster>` (DOC-12): make it a real declarative host element, or delete it from the spec and roadmap?
6. Rail-flyout positioning (DOC-15): promote the overlay engine to `@tulpar-ui/base` now, or record "won't share" in the ADR?
7. Built-in sidenav search (DOC-14): it shipped with no spec, against an earlier out-of-scope line, and its global Cmd/Ctrl+K shortcut is on by default. Keep it (and write a spec addendum with an opt-in shortcut), or remove it?

---

## Appendix — DOC-14: v0.1–v0.8 spec ↔ code drift

- Severity: Major (aggregate)
- Merge-blocking for current branches: No (all on main)
- Confidence: Verified. Items marked (R) were re-checked by me. The rest come from a delegated read-only sub-review that cited file:line on both sides.

Most of these items are **code bugs** that belong to the code-area agents. They are listed here because the spec was the contract and nothing recorded the divergence. **"Fix" names the side that should change.**

### Unspecified scope and out-of-scope violations (doc/process issues)

- **(R) Built-in sidenav search ships without any spec, and an earlier spec put it out of scope.**
  - The v0.7 sidebar spec `2026-06-16-…-v0.7-shell-sidebar-redesign-design.md:194` lists "Command/search **component** (only the `search` slot ships)" under out-of-scope.
  - The code ships `show-search` **default true** (`shell/src/sidenav/tulpar-sidenav.ts:76`), a document-level Cmd/Ctrl+K shortcut (`:428,460-469`) and a `tulpar-search` event.
  - It arrived in commit `5562a36` (2026-06-17) with only a changeset (`.changeset/v0.8-sidenav-search-filter.md`). `git grep show-search docs/` finds no spec.
  - A global keyboard shortcut that is on by default and has no spec is a real consumer risk: it conflicts with app shortcuts.
  - **Fix:** write a mini-spec addendum (owner decision), and make the shortcut opt-in.
- **Progress `tone="flow"` and the xs/xl sizes** have no spec (see DOC-10).

### Shell (v0.6 / v0.7 / sidebar-v2 / v0.8)

| # | Spec (file:line) | Code (file:line) | Fix |
|---|---|---|---|
| 1 | v0.6 `:131,231` skip link "İçeriğe atla" (skip to content) | (R) `shell/tulpar-shell.ts:254,259`: `href="#tulpar-shell-content"` targets a `<main>` inside the shadow root. Fragment navigation does not reach into shadow DOM, so the link does nothing. The text is hard-coded English. | code (focus `main` via a click handler; add `tabindex=-1`; i18n prop) |
| 2 | v0.7 `:145` the overlay/mobile sidenav keeps a focus trap | `tulpar-shell.ts:125-146` moves initial focus only. There is no trap and no `inert` on the content. | code (`inert` on the rest of the page, the modern standard) |
| 3 | v0.8 `:198-199` the flyout closes on Esc and outside click, with a safe triangle | `nav-item/tulpar-nav-item.ts:244-245` handles scroll/resize only. There is no outside-click close and no safe triangle. | code (WCAG 1.4.13) |
| 4 | v0.8 `:240-245` the rail trigger gets `aria-label` = label | `nav-item.styles.ts:162-170` sets `display:none` on the label. The button at `nav-item.ts:486-499` has no `aria-label`, so rail items have no accessible name. | code |
| 5 | sidebar-v2 `:126` over-topbar grid with 2 rows | `shell/tulpar-shell.styles.ts:77`: `grid-template-rows: 1fr` against 3 area rows (`:79-82`) | code |
| 6 | sidebar-v2 `:78,86,92` default-true booleans | Angular `tulpar-sidenav.component.ts:68,73` and Vue `TulparSidenav.vue:272-284` bind via `[attr.x]` / `null`. `false` removes the attribute, so the core default `true` stays. Consumers cannot turn these off. | code (bind properties) |
| 7 | v0.7 `:120` `position="right"` | `tulpar-shell.styles.ts:106-117` always uses `inset-inline-start` / `translateX(-100%)` in overlay/mobile mode | code |
| 8 | v0.6 `:129` `tulpar-shell-change` fires on every state change; `:121` `mobile-breakpoint` is reactive | `tulpar-shell.ts:164-177` does not fire it for mode or programmatic collapse. The media query is created only in `connectedCallback` (`:74`). | code |
| 9 | `internal-layering.md:9-10` | `eslint.config.js:43-46` blocks only the bare `@tulpar-ui/*/_internal*`. Relative `../../core/src/_internal` paths and `.vue` files are not covered (no violation today). | config |

### Input family (v0.5)

| # | Spec | Code | Fix |
|---|---|---|---|
| 10 | v0.5 `:778-779` `formResetCallback` / `formDisabledCallback` | (R) not implemented in `form-field-base.ts` or any input subclass. Only the selection controls implement reset. Form reset and `<fieldset disabled>` do nothing. | code |
| 11 | v0.5 `:777` `setFormValue` on every value change | called only in user-event handlers (`text-input.ts:205`, `textarea.ts:183`, `number-input.ts:127,230`). Initial and programmatic values are never submitted. | code |
| 12 | v0.5 `:486,828` a masked input emits input events (v-model) | `text-input.ts:203,210` + `mask-engine.ts:198-205` prevent default and never dispatch. Vue `v-model` and the Angular signal break on masked fields. | code |
| 13 | v0.5 `:532` caret management; `:517-519` paste example | `mask-engine.ts:136-161` appends only, and paste replaces the whole value. The spec's paste example output is also wrong. | code + spec |
| 14 | v0.5 `:86-90` `value: string` | Angular `text-input.component.ts:30` and `textarea.component.ts:29` use `[attr.value]="value() or null"`, so `''` becomes null. The component's own spec test uses `[value]`. | code |
| 15 | v0.5 `:544,688` NumberInput copy/paste | not rendered (`number-input.ts:91`), yet both wrappers forward `copyable`/`pastable` (dead props) | code |
| 16 | v0.5 `:753` the stepper is reachable; spinbutton semantics | the stepper has `tabindex=-1` and there is no `role=spinbutton` / `aria-valuenow` | code + spec (APG spinbutton) |
| 17 | v0.5 `:698-724` token names `--tulpar-input-bg`, `-height-{size}` | `--tulpar-input-bg-default`, `--tulpar-input-size-{s}-height` (`form-field-base.styles.ts`). The spec is also inconsistent with itself (`:712` vs `:758`). | spec |
| 18 | v0.5 `:747` `aria-describedby` targets an element that exists | `form-field-base.ts:131` references a message element that `:139-150` may not render. The counter is never described. | code |

### Button (v0.1 / v0.3 / v0.3.1 / v0.4 / v0.7 polish)

| # | Spec | Code | Fix |
|---|---|---|---|
| 19 | v0.3 `:178` `loading-label` is visible in every loading position | `button/tulpar-button.styles.ts:509-516` hides `.label`, and the loading label lives inside it (`tulpar-button.ts:338-341`). In `center` mode the text is invisible and absent from the a11y tree, so the v0.4 live announcement never fires. | code |
| 20 | v0.3 `:179` the default spinner shows when the `loading-icon` slot is empty | (R) `vue/src/button/TulparButton.vue:131-134` always renders empty `<span slot="start/end/loading-icon">` carriers. The slot is never empty, so Vue loading buttons show **no spinner**, and `data-has-start/end` is always set (the separator is drawn on the wrong side). The same pattern is used in every Vue wrapper (for example `TulparTextInput.vue:108-110`). This contradicts the CLAUDE.md "Vue slot forwarding" guidance, which never says to make carriers conditional. | code (`v-if="$slots.x"`) + CLAUDE.md |
| 21 | v0.4 `:123,147` ButtonGroup finds buttons inside wrappers (`display:contents`) | (R) `button-group/tulpar-button-group.ts:60` uses `:scope > tulpar-button`. `display:contents` does not change the DOM, so `<tulpar-button-ng>` children are never found. The promised test does not exist. The Angular playground works around it with raw `<tulpar-button>`. | code (or retract the spec; see DOC-18) |
| 22 | v0.4 `:82-83` `requestSubmit(this)` | `tulpar-button.ts:275-277` submits with no submitter, deliberately, because Chromium rejects a FACE as the submitter. `SubmitEvent.submitter` is null. | spec (document the limitation) |
| 23 | v0.7 polish `:81` every transform is removed under reduced motion | hover-lift `translateY(-1px)` remains (`styles.ts:328,404,681`) | code |
| 24 | v0.7 polish `:83` width is preserved in every loading mode | deliberately reverted in `a98aef1`; not recorded | spec |
| 25 | v0.3 `:126` link ignores `raised`/`shape`; `:211` icon-only ignores `icon-position` | `styles.ts:344-356,377-381,592-595` apply them | code |
| 26 | v0.7 polish token names (`--tulpar-spinner-duration`, `--tulpar-button-radius-{size}` …) | shipped as `--tulpar-button-spinner-duration`, `--tulpar-button-size-{size}-radius` … | spec |

### Tokens / palette (v0.2, v0.7 chromatic)

| # | Spec | Code | Fix |
|---|---|---|---|
| 27 | chromatic `:186-188`, success criterion 9 (`:221`): no old Tailwind/navy fallback hex remains | `#2563eb` (old Tailwind blue) is still used in `shell/tulpar-shell.styles.ts:175`, `core/toast/tulpar-toast.styles.ts:33,49`, `_internal/tone/tone-resolver.ts:198`, `Popover.stories.ts:167`, ng/vue toast and message demos, and the **CLAUDE.md:127 example** | code + CLAUDE.md |
| 28 | chromatic `:18`: no outside colour value | `tokens/src/primitive/shadow.ts:3-6` uses `rgba(10,37,64,…)`, which is the old navy-700 | code |
| 29 | chromatic `:92` `variant="secondary"`; `:82` `neutral` button | the code uses `severity="secondary"` and has no `neutral` severity (the token role exists in `semantic/color.ts:29`) | spec (and see DOC-20) |
| 30 | chromatic `:33` primitives as OKLCH; `:118-121` dark surface steps | primitives are hex, and the dark surfaces are one step lighter (`brand/tulpar/dark.ts:11-15`) | spec |

### Superseded but unmarked (misleading old specs)

- v0.1: `:443` a box-shadow focus ring (code uses `outline`), `:476` an `as` prop (never built).
- v0.2: `:54,221-233,283` navy/gold brand and the `--tulpar-primitive-gold-500` example. That name never existed in this form, and it would now fail lint.
- v0.3: `:136-140` navy/gold steps, `:43` "No built-in tooltip", `:162` 4px radius.
- v0.3.1: `:28,110` an inner `<span role=tooltip>` with "no collision detection". The button now delegates to `<tulpar-tooltip>` (`tulpar-button.ts:284-298`).
- v0.4: `:155,285` a lucide/tokens peer (reversed by v0.1.1).
- v0.6: `:143,232` a rail label flyout (replaced by the v0.8 group flyout).
- v0.7 sidebar: `:117` `tulpar-sidenav-toggle` (now `tulpar-menu-toggle`), `:134` top-layer flyout (now `position: fixed`).
- Only one spec in the set carries a "Supersedes" marker (v0.7 sidebar `:6`).

### What matches (v0.1–v0.8)

- The 22 palette families and the role mapping (`brand/tulpar/light.ts`).
- The `:root` / `.dark` / `[data-brand]` triggers (`tokens/build/generate-css.ts:62-74`).
- No primitive tokens in any `*.styles.ts`.
- Button severities, reflected kebab attributes, `delegatesFocus`, forced colors, `aria-busy`, `role=toolbar`, and the form submit/reset basics.
- `aria-current` and the group `aria-expanded`/`aria-controls` in the shell.
- No v0.6 out-of-scope item (top/mix, breadcrumb, user menu, RTL) was implemented.
