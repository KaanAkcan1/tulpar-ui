# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Tulpar UI** — A from-scratch design system that ships as Web Components (Lit-based) with idiomatic Angular and Vue wrappers. The goal is a single source of truth for UI behavior + rendering, consumable from any framework.

**Status:** v0.5 (input family) complete; v0.6 in progress — shell family (@tulpar-ui/shell) + infra hardening. Ships Button/ButtonGroup + TextInput/NumberInput/Textarea.

**Owner:** Kaan Akcan. This is a personal project being built gradually — possible commercial product down the line.

## Authoritative Docs

Always read these before making architectural decisions or expanding scope:

- **Spec:** [`docs/superpowers/specs/2026-06-05-tulpar-ui-v0.1-button-design.md`](docs/superpowers/specs/2026-06-05-tulpar-ui-v0.1-button-design.md)
- **Implementation plan:** [`docs/superpowers/plans/2026-06-05-tulpar-ui-v0.1-button-implementation.md`](docs/superpowers/plans/2026-06-05-tulpar-ui-v0.1-button-implementation.md)
- **Shell spec (v0.6b):** [`docs/superpowers/specs/2026-06-10-tulpar-ui-v0.6-shell-design.md`](docs/superpowers/specs/2026-06-10-tulpar-ui-v0.6-shell-design.md)
- **Infra plan (v0.6a):** [`docs/superpowers/plans/2026-06-10-tulpar-ui-v0.6a-infra-quality.md`](docs/superpowers/plans/2026-06-10-tulpar-ui-v0.6a-infra-quality.md)
- **Shell plan (v0.6b):** [`docs/superpowers/plans/2026-06-10-tulpar-ui-v0.6b-shell-family.md`](docs/superpowers/plans/2026-06-10-tulpar-ui-v0.6b-shell-family.md)
- **Internal layering:** [`docs/architecture/internal-layering.md`](docs/architecture/internal-layering.md)

The plan is the working contract. Follow it task by task. If a question is unclear, the spec is authoritative.

## Architecture (Quick Reference)

```
@tulpar-ui/tokens   → TS source of truth, generates CSS custom properties (3-layer multi-brand)
@tulpar-ui/core     → Lit Web Components — <tulpar-button>, <tulpar-button-group>, <tulpar-text-input>, <tulpar-number-input>, <tulpar-textarea> (source of truth)
@tulpar-ui/angular  → Signal-based Angular wrapper (<tulpar-button-ng>, <tulpar-text-input-ng>, …)
@tulpar-ui/vue      → Vue 3 SFC wrapper (<TulparButton>, <TulparTextInput>, …)
@tulpar-ui/shell    → App shell (tulpar-shell, tulpar-topbar, tulpar-sidenav, tulpar-nav-item) [v0.6 target]
```

**Element prefix:** `tulpar-` (defensive against collisions like Toast UI's `tui-`)

**CSS prefix:** `--tulpar-`

**Theme triggers:**
- Brand: `[data-brand="tulpar"]` (default fallback at `:root`)
- Dark mode: `.dark` class (Tailwind-compatible — works the same way as Berdan's existing pattern)

**Token layers:**
1. Primitive — raw values (`blue.600`, `gray.900`)
2. Semantic — anlamsal isimler (`color.bg.surface`, `color.brand.default`)
3. Brand × Mode — semantic → primitive bindings per brand + light/dark

## Tech Stack

| Concern | Tool |
|---|---|
| Package manager | pnpm 9 + catalogs (workspaces) |
| Build | Vite (library mode) |
| Versioning + publish | Changesets (linked versioning for `@tulpar-ui/*`) |
| TypeScript | 5.4+, strict, ES2022, `useDefineForClassFields: false`, `experimentalDecorators: true` (Lit requirement) |
| Web Component lib | Lit 3 |
| Component testing (core) | `@web/test-runner` + `@open-wc/testing` (real-browser Shadow DOM) |
| Wrapper testing | Vitest + happy-dom |
| Angular | v22, signal-based inputs, `CUSTOM_ELEMENTS_SCHEMA` inside wrapper |
| Vue | 3.4+, SFC, `compilerOptions.isCustomElement` for `tulpar-` |
| Docs | Storybook 8 + `@storybook/web-components-vite` + addon-themes + addon-a11y |
| Linting | ESLint flat config + Prettier |
| Node | 22.22.3 (pinned in `.nvmrc`) |

## Commands

```bash
pnpm install                                # install all workspace deps
pnpm build                                  # build all packages in topological order
pnpm test                                   # run all tests
pnpm lint                                   # ESLint
pnpm format                                 # Prettier write
pnpm format:check                           # Prettier check

# Dev loop (recommended) — full topological build first, then runs every
# workspace package in watch mode in parallel with the playground.
# Edit any package source → its dist rebuilds → Angular/Vite dev server
# picks up the dist change and reloads. No more stale dist.
#
# Angular note: dev:ng also runs `ng cache clean` during predev — Angular CLI's
# .angular/cache doesn't reliably invalidate when symlinked workspace package
# dist changes, so we wipe it on every dev start. Requires the previous dev
# server to be stopped first (otherwise the cache db is locked).
pnpm dev                                    # ALL: tokens + core + wrappers + playground-ng + playground-vue + Storybook
pnpm dev:ng                                 # tokens + core + angular wrappers + playground-ng (localhost:4310)
pnpm dev:vue                                # tokens + core + vue wrappers + playground-vue (localhost:5273)
pnpm dev:storybook                          # tokens + core + Storybook (localhost:6006)

# Per-package
pnpm --filter @tulpar-ui/tokens build
pnpm --filter @tulpar-ui/core test
pnpm --filter docs storybook                # localhost:6006
pnpm --filter playground-ng start           # localhost:4310 (no watch loop — uses last built dist)
pnpm --filter playground-vue dev            # localhost:5273 (no watch loop — uses last built dist)

# Release flow
pnpm changeset                              # create a changeset for pending changes
pnpm version-packages                       # bump versions per changesets
pnpm release                                # build + publish to npm
```

## Working Conventions

### Angular wrapper selector

Wrappers use `tulpar-<name>-ng` selector (e.g., `tulpar-button-ng`) to avoid recursion with the underlying Web Component (`<tulpar-button>`). Don't try to share the same selector.

### Vue + Web Components

Apps consuming `@tulpar-ui/vue` must configure Vite with:

```ts
vue({
  template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("tulpar-") } }
})
```

Otherwise Vue's compiler will treat `<tulpar-button>` as a Vue component and throw.

### Token usage in component CSS

Component CSS (inside Lit's `css` tagged template) **only** uses semantic tokens (`var(--tulpar-color-brand-default)`). Never reference primitive tokens directly inside component styles — that would defeat the multi-brand layer. **This is enforced by ESLint:** a `no-restricted-syntax` rule on `*.styles.ts` rejects any `--tulpar-primitive-*` reference. Bind primitives in the brand layer (`brand/tulpar/*.ts`) instead.

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

### Playgrounds (playground-ng + playground-vue)

These are the living, hands-on showcases — treat them as a product surface, not a scratchpad.

- **Parity is mandatory.** The two playgrounds must stay in lockstep: same sidenav/menu structure, same pages, same examples, same visual design. A feature, section, or example present in one MUST be present in the other. Never let one drift ahead.
- **Spec first, then apply to both.** Before building/editing playground pages, write a detailed spec of exactly what each page demonstrates — every prop, every state, every variant, every slot — then implement that identical spec in BOTH frameworks. Do not improvise per-framework.
- **Show every feature, both prop and slot forms.** For every capability, demonstrate it. Where a component accepts content via both a prop and a slot (label, description, icons, …), show BOTH usages explicitly — they must both work.
- **Run `/frontend-design` (and `/ui-ux-pro-max`) on every page.** Enterprise-grade, strong UI/UX. Verify visually in a real browser (headless Playwright screenshots) before claiming done — don't trust the build alone.

### Props vs slots (dual support)

Components accept rich content via **both** a convenience prop and a slot, never one instead of the other. `label`, `description`, and icons (e.g. switch `icon-on`/`icon-off`, checkbox `icon`) all have a prop form AND a slot form; the prop sits on top of the slot (slot wins when both are set). Wrappers must forward both. See [`feedback_optional_prop_does_not_remove_slot`].

### Vue wrapper slot forwarding (gotcha)

A Vue SFC that renders `<slot name="label" />` inside a web component does NOT reach the element's named slot — Vue consumes the `slot=` targeting and projects the content without it, so the core's shadow `<slot name="label">` stays empty. Forward each slot through a transparent carrier that keeps the real `slot` attribute, e.g. `<span style="display:contents" slot="label"><slot name="label" /></span>` (verify in-browser). This applies to every Vue wrapper, not just selection.

### Form-associated custom elements

Buttons use `static formAssociated = true` + `attachInternals()`. The wrapper does NOT add another `ControlValueAccessor` — the Web Component already integrates with native `<form>`, and that bubbles up to Angular Reactive Forms / Vue native binding without extra plumbing.

### Tests

- Core: real browser via Web Test Runner. Test in `*.test.ts` adjacent to the component.
- Wrappers: smoke tests only (class is exported, defaults are correct). Full integration is verified visually in playground apps.

## User Preferences (Important)

These were established during brainstorming and apply throughout this project:

- **Push back, don't validate.** When user asks "is X really the right call?", give honest analysis with concrete trade-offs and counter-examples. Don't soften to please.
- **Gradual building.** User wants to shape this slowly. Don't add scope beyond what's in the current spec. Each version is tightly scoped (v0.1 Button → v0.5 input family → v0.6 shell); don't pull future components forward.
- **Angular: signals.** All new Angular code uses `input()`, `output()`, `signal()`, `computed()`. No `@Input/@Output`, no RxJS subscriptions for state, no `BehaviorSubject` for view state.
- **Discuss backend/architecture changes first.** Don't refactor or restructure mid-implementation without checking. If the plan needs to deviate, surface it.
- **Defensive defaults.** Tulpar UI is potentially commercial — choose collision-safe, conservative options when in doubt (e.g., full `tulpar-` prefix, not `tui-`).
- **Out-of-scope is enforced.** The current spec's "out of scope" list is binding. If a use-case demands an out-of-scope component, surface it as a future scope question, don't sneak it in.

## Shipped so far

- **v0.1–v0.4:** Button + ButtonGroup, architecture foundation, design-system redesign, button API expansion, enterprise hardening.
- **v0.5:** Input family — TextInput, NumberInput, Textarea (shared internal `FormFieldBase`).
- **v0.6 (in progress):** `@tulpar-ui/shell` app shell + infra hardening (pnpm 9 catalogs, CI/CD, glob exports, `_internal` rule, tokens split, primitive-token lint, READMEs, MIT license).

## Out of Scope for v0.6

(See the v0.6 shell spec for the full list)

- Configurator panel (v2 — needs Select/Switch/Checkbox first)
- Runtime color preset API (separate tokens-package spec)
- `top` / `mix` shell layout modes
- Breadcrumb, user-menu dropdown, separate footer component
- RTL
- Second brand theme
- React wrapper
- SSR optimization tuning
- Mobile-native (RN/Flutter)
- Split button, dropdown menu button, toggle button, badged button, FAB
- Public Tooltip / Badge / Icon components

## Execution Workflow

The plan uses checkbox (`- [ ]`) syntax. Recommended approaches:

- **Subagent-driven** (`superpowers:subagent-driven-development`) — fresh subagent per task, review between tasks
- **Inline** (`superpowers:executing-plans`) — execute tasks in this session with checkpoints

If user says "implementation'a başlayalım" or similar, invoke the appropriate skill and start at the first unchecked task.
