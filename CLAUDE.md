# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Tulpar UI** — A from-scratch design system that ships as Web Components (Lit-based) with idiomatic Angular and Vue wrappers. The goal is a single source of truth for UI behavior + rendering, consumable from any framework.

**Status (2026-11-11):** v0.1–v0.15 are on `main` (24 core elements + 5 shell elements, see below). npm still publishes 0.6.0 — the pending changesets have not been released. A retrospective review (2026-11-11) found 181 findings (21 Blocker); the next work is **phase 1: hardening + token foundation**, before any new component. See "Current phase plan" below. **Phase 1.1 infra: done on branch `phase1/1.1-infra`, pending merge** (close-out: spec §10). Lazy demo routes in both playgrounds done (owner decision 2026-11-13, playground-ng budget back to 1.5 MB). Next: 1.1b visual regression, then 1.2.

**Owner:** Kaan Akcan. This is a personal project being built gradually — possible commercial product down the line.

## Authoritative Docs

Always read these before making architectural decisions or expanding scope:

- **Roadmap (wave plan + locked decisions):** [`docs/roadmap.md`](docs/roadmap.md)
- **Retrospective review v0.1→v0.15 (known defects, owner decisions):** [`docs/reviews/2026-11-11-retrospective/README.md`](docs/reviews/2026-11-11-retrospective/README.md) — agent reports + `findings.json` in `ekler/`
- **Foundation spec (v0.1):** [`docs/superpowers/specs/2026-06-05-tulpar-ui-v0.1-button-design.md`](docs/superpowers/specs/2026-06-05-tulpar-ui-v0.1-button-design.md)
- **Per-version specs and plans:** `docs/superpowers/specs/` and `docs/superpowers/plans/` (latest: v0.14 Select, v0.15 Select completion)
- **Shell spec (v0.6b):** [`docs/superpowers/specs/2026-06-10-tulpar-ui-v0.6-shell-design.md`](docs/superpowers/specs/2026-06-10-tulpar-ui-v0.6-shell-design.md)
- **Internal layering:** [`docs/architecture/internal-layering.md`](docs/architecture/internal-layering.md)

The plan is the working contract. Follow it task by task. If a question is unclear, the spec is authoritative. **Known spec defect:** the v0.14/v0.15 Select specs mandate the search input inside `role=listbox` (invalid ARIA, retro DOC-9) — fix the spec before the code.

## Architecture (Quick Reference)

```
@tulpar-ui/tokens   → TS source of truth, generates CSS custom properties (3-layer multi-brand)
@tulpar-ui/core     → Lit Web Components (source of truth):
                      button, button-group · text-input, number-input, textarea ·
                      checkbox, checkbox-group, radio, radio-group, switch ·
                      tooltip, toggletip, popover · toast (+ toast/message service) ·
                      tag, badge, chip, avatar, skeleton, spinner, progress ·
                      select, option, option-group
@tulpar-ui/shell    → App shell: tulpar-shell, tulpar-topbar, tulpar-sidenav, tulpar-nav-item, tulpar-nav-section
@tulpar-ui/angular  → Signal-based Angular wrappers (<tulpar-button-ng>, <tulpar-select-ng>, …) + overlay directives + toast service
@tulpar-ui/vue      → Vue 3 SFC wrappers (<TulparButton>, <TulparSelect>, …) + overlay directives + toast composables
```

**Element prefix:** `tulpar-` (defensive against collisions like Toast UI's `tui-`)

**CSS prefix:** `--tulpar-`

**Theme triggers:**
- Brand: `[data-brand="tulpar"]` (default fallback at `:root`)
- Dark mode: `.dark` class (same convention as Tailwind's class strategy). Tulpar has **no** Tailwind dependency or Tailwind theme export. `color-scheme` is not emitted yet (retro TOK-9).

**Page-structure themes (decided 2026-11-11, built in phase 2):** Theme 1 = **Tulpar** (today's layout). Theme 2 = **Tuğrul** (`tugrul`) = a Connect-style page structure. Tuğrul's default colours are Tulpar's colours and stay overridable; the sidebar is selectable independently of the page structure. Nothing in Theme 1 is removed.

**Token layers:**
1. Primitive — raw values (`blue.600`, `gray.900`)
2. Semantic — anlamsal isimler (`color.bg.surface`, `color.brand.default`)
3. Brand × Mode — semantic → primitive bindings per brand + light/dark

## Tech Stack

| Concern | Tool |
|---|---|
| Package manager | pnpm 12.18 (`packageManager` set by hand, no corepack on Node ≥ 25) + `catalogMode: strict`: every shared dependency is `catalog:` |
| Build | Vite 8.3 library mode everywhere (one version, catalog); externals derived from `package.json` by pattern (`scripts/vite-externals.ts`); ng-packagr for Angular in **partial** compilation mode; `scripts/check-dist.mjs` guards the build outputs |
| Versioning + publish | Changesets 3 (linked versioning for `@tulpar-ui/*`). **Release is manual until 1.8:** `release.yml` runs on `workflow_dispatch` only |
| TypeScript | ~6.0 (typescript-eslint 8 supports `<6.1`), strict, ES2022, `useDefineForClassFields: false`, `experimentalDecorators: true` (still Lit's recommendation — keep) |
| Web Component lib | Lit 3 |
| Component testing (core, shell) | `@web/test-runner` 1.0 (via the `wtr-strict` wrapper, which fails a file with 0 tests) + `@open-wc/testing` 5 + Playwright 1.65 in Chromium, Firefox and WebKit. `tooling/test-utils` (`@tulpar-ui/test-utils`) holds `expectA11yNode` (ARIA snapshot), `itUnlessEngine` and the `ENG-*` known-failure list |
| Wrapper testing | Vitest 5.1 + happy-dom 21 in tokens, angular (Analog 2.9) and vue |
| Angular | v22.2, signal-based inputs, `CUSTOM_ELEMENTS_SCHEMA` inside wrapper |
| Vue | 3.5.45, SFC, `compilerOptions.isCustomElement` for `tulpar-` |
| Docs | Storybook 10 + `@storybook/web-components-vite` + addon-themes + addon-a11y; autodocs read `custom-elements.json` (CEM analyzer, built with core and shell) |
| Linting | ESLint 10 flat config (typescript-eslint 8, lit, wc, vue, angular-eslint) + Prettier. Pre-existing violations of new rules sit in `eslint-suppressions.json`; `pnpm check:suppressions` fails when the count grows |
| Dev warnings | `warnDev` follows Lit's convention: `esm-env` `DEV` (the `development` export condition). Prints in dev builds and tests, compiled out in production. Angular CLI (esbuild) keeps the dead strings but never runs them — accepted as an interim (owner decision 2026-11-13); a Lit-style dual build in 1.8 removes them |
| CI | GitHub Actions on `ubuntu-26.04` (pinned): `ci.yml` (PR, push to `main` and push to `phase*/**`: typecheck, build, `check:dist`, lint, tests in three engines, app builds, `pnpm audit --prod`), `deploy.yml` (Cloudflare Pages, after CI succeeds), `release.yml` (changesets, manual dispatch only) |
| Node | 26.13.0 LTS (pinned in `.nvmrc`; CI + deploy read it via `node-version-file`) |

## Commands

```bash
pnpm install                                # install all workspace deps
pnpm build                                  # build all packages in topological order
pnpm typecheck                              # tsc/vue-tsc --noEmit in every package (needs built dist)
pnpm test                                   # run all tests (Chromium)
pnpm lint                                   # ESLint
pnpm check:dist                             # build-output guard: no inlined lit-html, sideEffects cover registrations, Angular partial
pnpm lint:probe                             # proves the custom lint rules still fire
pnpm check:suppressions                     # fails when eslint-suppressions.json grew vs main
pnpm format                                 # Prettier write
pnpm format:check                           # Prettier check

# Dev loop (recommended) — full topological build first, then runs every
# workspace package in watch mode in parallel with the playground.
# Edit any package source → its dist rebuilds → Angular/Vite dev server
# picks up the dist change and reloads. No more stale dist.
#
# Dev scripts are explicit (no `pre*` hooks): each one runs `pnpm build` first.
#
# Angular note: dev:ng also runs `ng cache clean` before it starts — Angular CLI's
# .angular/cache doesn't reliably invalidate when symlinked workspace package
# dist changes, so we wipe it on every dev start. Requires the previous dev
# server to be stopped first (otherwise the cache db is locked).
# dev:ng rebuilds packages/angular/dist in full compilation mode: run `pnpm build`
# before `pnpm check:dist` after a dev session.
pnpm dev                                    # ALL: tokens + core + wrappers + playground-ng + playground-vue + Storybook
pnpm dev:ng                                 # tokens + core + angular wrappers + playground-ng (localhost:4310)
pnpm dev:vue                                # tokens + core + vue wrappers + playground-vue (localhost:5273)
pnpm dev:storybook                          # tokens + core + Storybook (localhost:6006)
#   Autodocs (custom-elements.json) refresh only on `pnpm build`, not in watch mode.
#   Standalone Storybook (builds prerequisites first, no watchers): pnpm --filter docs storybook

# Per-package
pnpm --filter @tulpar-ui/tokens build
pnpm --filter @tulpar-ui/core test
pnpm --filter @tulpar-ui/core test:all-browsers   # Chromium, then Firefox + WebKit (core, shell)
pnpm --filter @tulpar-ui/core test:ci               # Chromium with coverage + Firefox + WebKit (what CI runs)
pnpm --filter docs storybook                # localhost:6006
pnpm --filter playground-ng start           # localhost:4310 (no watch loop — uses last built dist)
pnpm --filter playground-vue dev            # localhost:5273 (no watch loop — uses last built dist)

# Release flow
pnpm changeset                              # create a changeset for pending changes
pnpm version-packages                       # bump versions per changesets
pnpm release                                # build + publish to npm (manual only until 1.8; CI release is workflow_dispatch)
# Publish only via pnpm/changesets — `npm publish` would ship the Angular source tree
# (publishConfig.directory is pnpm-only); OIDC trusted publishing in 1.8.
```

## Working Conventions

### Angular wrapper selector

Wrappers use `tulpar-<name>-ng` selector (e.g., `tulpar-button-ng`) to avoid recursion with the underlying Web Component (`<tulpar-button>`). Don't try to share the same selector.

> **Under review (retro WR-3 / DOC-18, decision pending in phase 1):** the double-element model (`display:contents` wrapper + inner core element) breaks Angular overlay directives (0×0 anchor), ButtonGroup and shell state mirroring. The review found the "recursion" claim above is not true and recommends the Ionic/Stencil proxy pattern (selector = the core tag, template `<ng-content/>`). It is a breaking change — do not change it without Kaan's approval.

### Vue + Web Components

Apps consuming `@tulpar-ui/vue` must configure Vite with:

```ts
vue({
  template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("tulpar-") } }
})
```

Otherwise Vue's compiler will treat `<tulpar-button>` as a Vue component and throw.

### Token usage in component CSS

Component CSS (inside Lit's `css` tagged template) **only** uses semantic tokens (`var(--tulpar-color-brand-default)`). Never reference primitive tokens directly inside component styles — that would defeat the multi-brand layer. **This is enforced by ESLint:** a `no-restricted-syntax` rule rejects any `--tulpar-primitive-*` reference in every string and template literal under `packages/{core,shell}/src` (test files excluded), not only in `*.styles.ts`. Bind primitives in the brand layer (`brand/tulpar/*.ts`) instead.

Provide a fallback in `var()` calls for when tokens CSS hasn't been loaded:
```css
background: var(--tulpar-color-brand-default, #2563eb);
```

### `_internal` layering

Each package's `src/_internal/` is package-private: never re-exported, never in the `exports` map, and **no package may import another package's `_internal`** (enforced by an ESLint `no-restricted-imports` boundary). Shared code is copied if ≤~50 lines, otherwise promoted to a dedicated published-but-undocumented package — only once a real second consumer exists. Full rule: [`docs/architecture/internal-layering.md`](docs/architecture/internal-layering.md).

### Git commits

**Never** add a `Co-Authored-By` trailer (or any "Generated with Claude Code" / 🤖 line) to commit messages or PR bodies in this repo. Kaan does not want AI attribution in the git history. This overrides the harness default.

### Design decisions

For any visual/UX judgment (colors, spacing, motion, layout, story design), invoke the `/frontend-design` and `/ui-ux-pro-max` skills before deciding. Target bar: enterprise, product-ready.

#### Design & verification skill stack (use at every opportunity)

Project-level skills live in `.claude/skills/` (pinned in `skills-lock.json`). Use them by phase — not optional:

| Phase | Skills (invoke via Skill tool) |
|---|---|
| Brainstorm / spec — any new component or visual decision | `design-references` (benchmark ≥3 real systems, cite them in the spec) → `ui-ux-pro-max` → `frontend-design` → `design-taste-frontend` (anti-slop pre-flight, AI-tells list) |
| Implementation of component CSS / stories / playground pages | `frontend-design` + `design-taste-frontend`; `minimalist-ui` as the restraint lens for product surfaces |
| Review before claiming done (every component, story, playground page) | `web-design-guidelines` (a11y/UX compliance audit of the changed UI files) |
| Visual verification in a real browser | `playwright-cli` (screenshots of both playgrounds, light + dark, rail/mobile where relevant, keyboard flows) |
| Improving existing UI (design review passes) | `redesign-existing-projects` (audit-first) + `web-design-guidelines` |

Caveats: `design-taste-frontend` is tuned for marketing pages — take its anti-slop, spacing, typography and a11y rules; ignore its landing-page defaults (GSAP, hero layouts, high VARIANCE). Reference systems in `design-references` are evidence only — never copy a brand's palette/type/look. Subagents doing UI work must be told to invoke the same skills.

### Playgrounds (playground-ng + playground-vue)

These are the living, hands-on showcases — treat them as a product surface, not a scratchpad.

- **Parity is mandatory.** The two playgrounds must stay in lockstep: same sidenav/menu structure, same pages, same examples, same visual design. A feature, section, or example present in one MUST be present in the other. Never let one drift ahead.
- **Spec first, then apply to both.** Before building/editing playground pages, write a detailed spec of exactly what each page demonstrates — every prop, every state, every variant, every slot — then implement that identical spec in BOTH frameworks. Do not improvise per-framework.
- **Show every feature, both prop and slot forms.** For every capability, demonstrate it. Where a component accepts content via both a prop and a slot (label, description, icons, …), show BOTH usages explicitly — they must both work.
- **Run `/frontend-design` (and `/ui-ux-pro-max`) on every page.** Enterprise-grade, strong UI/UX. Verify visually in a real browser (`playwright-cli` screenshots) and audit with `web-design-guidelines` before claiming done — don't trust the build alone.

### Props vs slots (dual support)

Components accept rich content via **both** a convenience prop and a slot, never one instead of the other. `label`, `description`, and icons (e.g. switch `icon-on`/`icon-off`, checkbox `icon`) all have a prop form AND a slot form; the prop sits on top of the slot (slot wins when both are set). Wrappers must forward both. See [`feedback_optional_prop_does_not_remove_slot`].

### Vue wrapper slot forwarding (gotcha)

A Vue SFC that renders `<slot name="label" />` inside a web component does NOT reach the element's named slot — Vue consumes the `slot=` targeting and projects the content without it, so the core's shadow `<slot name="label">` stays empty. Forward each slot through a transparent carrier that keeps the real `slot` attribute, e.g. `<span v-if="$slots.label" style="display:contents" slot="label"><slot name="label" /></span>` (verify in-browser). This applies to every Vue wrapper, not just selection. **Render the carrier only when the slot is filled (`v-if="$slots.x"`)** — an always-rendered empty carrier counts as slotted content and hides the `label` prop (retro WR-1: TextInput/Textarea/NumberInput labels never show).

**Do not forward unset props as `prop ?? undefined`.** Vue then writes `''` to the custom element property and wipes the core default (retro VIS-1: Vue NumberInput crashes with `RangeError`, Tag/Chip lose their tone). Forward only the props that are set.

### Form-associated custom elements

Buttons use `static formAssociated = true` + `attachInternals()`. The wrapper does NOT add another `ControlValueAccessor` — the Web Component already integrates with native `<form>`, and that bubbles up to Angular Reactive Forms / Vue native binding without extra plumbing.

> **Known false (retro WR-4 / DOC-19, fix in phase 1):** Angular forms never read `ElementInternals`, and `DefaultValueAccessor` only matches `input`/`textarea`/`[ngDefaultControl]`, so `formControlName`/`ngModel` do not work on the wrappers today (the package has zero CVAs). Recommended: Angular 22 `FormValueControl` / `FormCheckboxControl`. Also: no component calls `setValidity()`, and the input family does not submit initial values or handle reset/disabled callbacks (retro CA-1, CA-2).

### Tests

- Core: real browser via Web Test Runner. Test in `*.test.ts` adjacent to the component.
- Wrappers: smoke tests only (class is exported, defaults are correct). Full integration is verified visually in playground apps.
- Core and shell tests run in Chromium, Firefox and WebKit (`test:all-browsers`). An engine-specific failure is skipped only through `itUnlessEngine` with an `ENG-*` finding ID; the list is empty today.
- Use `expectA11yNode` (`@tulpar-ui/test-utils`) to assert the computed accessibility tree, and `expect(el).to.be.accessible()` for axe.
- **Gap (retro CB-26, AX-*):** the helpers exist since 1.1, but most existing tests still check attribute strings, so cross-shadow ARIA bugs can pass CI. Adopting the helpers in each component's tests is planned for phase 1.4.

## User Preferences (Important)

These were established during brainstorming and apply throughout this project:

- **Push back, don't validate.** When user asks "is X really the right call?", give honest analysis with concrete trade-offs and counter-examples. Don't soften to please.
- **Gradual building.** User wants to shape this slowly. Don't add scope beyond what's in the current spec. Each version is tightly scoped (see `docs/roadmap.md` waves); don't pull future components forward without an explicit roadmap decision.
- **Never remove a feature without approval.** Work is additive: new behaviour comes as an option/variant next to the existing one. Breaking renames count as removals — propose them with a deprecation path and wait for approval.
- **No decisions mid-discussion.** While brainstorming, don't record or announce anything as "decided" until Kaan says so.
- **Guard the roadmap.** Check Kaan's proposals against the roadmap, specs and code; say plainly when something conflicts, and lead with the correct solution — never a patch that only makes a statement true.
- **Angular: signals.** All new Angular code uses `input()`, `output()`, `signal()`, `computed()`. No `@Input/@Output`, no RxJS subscriptions for state, no `BehaviorSubject` for view state.
- **Discuss backend/architecture changes first.** Don't refactor or restructure mid-implementation without checking. If the plan needs to deviate, surface it.
- **Defensive defaults.** Tulpar UI is potentially commercial — choose collision-safe, conservative options when in doubt (e.g., full `tulpar-` prefix, not `tui-`).
- **Out-of-scope is enforced.** The current spec's "out of scope" list is binding. If a use-case demands an out-of-scope component, surface it as a future scope question, don't sneak it in.

## Shipped so far

- **v0.1–v0.4:** Button + ButtonGroup, architecture foundation, design-system redesign, button API expansion, enterprise hardening.
- **v0.5:** Input family — TextInput, NumberInput, Textarea (shared internal `FormFieldBase`).
- **v0.6:** `@tulpar-ui/shell` app shell + infra hardening (pnpm 9 catalogs, CI/CD, glob exports, `_internal` rule, tokens split, primitive-token lint, READMEs, MIT license).
- **v0.7–v0.8:** Chromatic mythology palette (22 families), button polish, shell sidebar redesign (rail/flyout, sidenav search + Ctrl/Cmd+K).
- **v0.10:** Selection family — Checkbox, CheckboxGroup, Radio, RadioGroup, Switch.
- **v0.11:** Overlay family — Tooltip, Toggletip, Popover (+ `_internal/overlay` engine; directive + ref-by-id composition).
- **v0.12:** Toast + Message (imperative service).
- **v0.13:** Display & status atoms — Tag, Badge, Chip, Avatar, Skeleton, Spinner, Progress.
- **v0.14–v0.15:** Select (single) + `options` data-prop + in-popup search. **v0.15 has 9 known blocking defects on `main`** (retro §3) — first item of phase 1.

## Current phase plan (after the 2026-11-11 retro)

Order approved by Kaan; the details of each phase still need their own design (brainstorm → spec → plan) and approval.

| Phase | Content |
|---|---|
| 0 | CI fix (done: `ubuntu-26.04`, Playwright 1.65) + this CLAUDE.md refresh |
| 1 — hardening + token foundation | v0.15 Select blockers (spec first); cross-shadow ARIA; form contract; Angular architecture + forms; Vue wrapper bugs; token foundation (semantic radius/density/type/motion scales, seed→brand generator, `color-scheme`, opaque focus ring, fill/text roles, `@layer`); vocabulary unification; overlay/toast behaviour; npm publish blockers; toolchain/CI. After phase 1 every Blocker/Major except the shell ones is closed. |
| 2 — Connect layer | Theme 2 **Tuğrul**; Connect-style frame as an option; in-page parts (PageHeader, SectionCard, FieldRow); shell retro findings. |
| 3 — Connect components | Drawer, Dialog + confirm, DatePicker/TimePicker, Tabs, Menu, Empty/Result, Card… (reorders roadmap waves — record the decision in `docs/roadmap.md`). |
| Later | Grid (wrap AG Grid vs own grid — open), ECharts package. |

**Do not publish to npm (and do not merge the "Version Packages" PR) before the phase-1 publish blockers are fixed:** some pending changesets contain wrong API names (retro §4.8). The build-output blockers (Angular full compilation, shell bundling its own lit-html copy, compiled-out dev warnings) were fixed in phase 1.1.

## Out of Scope (current)

From `docs/roadmap.md` §7 plus still-valid v0.6 items. Binding unless Kaan changes it:

- Command palette, Cascader, Transfer/PickList, Mentions, Color picker, Carousel
- Charts (separate package/spec), Gantt/Scheduler (after the grid)
- `top` / `mix` shell layout modes, Breadcrumb, user-menu dropdown, separate footer component
- Split button, dropdown menu button, toggle button, badged button, FAB; public Icon component (icons stay consumer-provided via prop/slot)
- RTL, React wrapper, SSR optimization tuning, mobile-native (RN/Flutter)
- ~~Second brand theme~~ — superseded: the Tuğrul page-structure theme is in scope for phase 2.

## Execution Workflow

The plan uses checkbox (`- [ ]`) syntax. Recommended approaches:

- **Subagent-driven** (`superpowers:subagent-driven-development`) — fresh subagent per task, review between tasks
- **Inline** (`superpowers:executing-plans`) — execute tasks in this session with checkpoints

If user says "implementation'a başlayalım" or similar, invoke the appropriate skill and start at the first unchecked task.

Note: the v0.1–v0.15 plans were never ticked (0 of 1,767 checkboxes, retro DOC-7) even though all their tasks were committed — treat them as historical, not as open work.
