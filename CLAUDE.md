# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

**Tulpar UI** — A from-scratch design system that ships as Web Components (Lit-based) with idiomatic Angular and Vue wrappers. The goal is a single source of truth for UI behavior + rendering, consumable from any framework.

**Status:** v0.1 in progress. Single component (Button + ButtonGroup), full architectural foundation.

**Owner:** Kaan Akcan. This is a personal project being built gradually — possible commercial product down the line.

## Authoritative Docs

Always read these before making architectural decisions or expanding scope:

- **Spec:** [`docs/superpowers/specs/2026-06-05-tulpar-ui-v0.1-button-design.md`](docs/superpowers/specs/2026-06-05-tulpar-ui-v0.1-button-design.md)
- **Implementation plan:** [`docs/superpowers/plans/2026-06-05-tulpar-ui-v0.1-button-implementation.md`](docs/superpowers/plans/2026-06-05-tulpar-ui-v0.1-button-implementation.md)

The plan is the working contract. Follow it task by task. If a question is unclear, the spec is authoritative.

## Architecture (Quick Reference)

```
@tulpar-ui/tokens   → TS source of truth, generates CSS custom properties (3-layer multi-brand)
@tulpar-ui/core     → Lit Web Components — <tulpar-button>, <tulpar-button-group> (source of truth)
@tulpar-ui/angular  → Signal-based Angular wrapper (<tulpar-button-ng>)
@tulpar-ui/vue      → Vue 3 SFC wrapper (<TulparButton>)
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
| Package manager | pnpm workspaces |
| Build | Vite (library mode) |
| Versioning + publish | Changesets (linked versioning for `@tulpar-ui/*`) |
| TypeScript | 5.4+, strict, ES2022, `useDefineForClassFields: false`, `experimentalDecorators: true` (Lit requirement) |
| Web Component lib | Lit 3 |
| Component testing (core) | `@web/test-runner` + `@open-wc/testing` (real-browser Shadow DOM) |
| Wrapper testing | Vitest + happy-dom |
| Angular | v20, signal-based inputs, `CUSTOM_ELEMENTS_SCHEMA` inside wrapper |
| Vue | 3.4+, SFC, `compilerOptions.isCustomElement` for `tulpar-` |
| Docs | Storybook 8 + `@storybook/web-components-vite` + addon-themes + addon-a11y |
| Linting | ESLint flat config + Prettier |
| Node | 20.11.0 (pinned in `.nvmrc`) |

## Commands

```bash
pnpm install                                # install all workspace deps
pnpm build                                  # build all packages in topological order
pnpm test                                   # run all tests
pnpm lint                                   # ESLint
pnpm format                                 # Prettier write
pnpm format:check                           # Prettier check

# Per-package
pnpm --filter @tulpar-ui/tokens build
pnpm --filter @tulpar-ui/core test
pnpm --filter docs storybook                # localhost:6006
pnpm --filter playground-ng start           # localhost:4200
pnpm --filter playground-vue dev            # localhost:5173

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

Component CSS (inside Lit's `css` tagged template) **only** uses semantic tokens (`var(--tulpar-color-brand-default)`). Never reference primitive tokens directly inside component styles — that would defeat the multi-brand layer.

Provide a fallback in `var()` calls for when tokens CSS hasn't been loaded:
```css
background: var(--tulpar-color-brand-default, #2563eb);
```

### Form-associated custom elements

Buttons use `static formAssociated = true` + `attachInternals()`. The wrapper does NOT add another `ControlValueAccessor` — the Web Component already integrates with native `<form>`, and that bubbles up to Angular Reactive Forms / Vue native binding without extra plumbing.

### Tests

- Core: real browser via Web Test Runner. Test in `*.test.ts` adjacent to the component.
- Wrappers: smoke tests only (class is exported, defaults are correct). Full integration is verified visually in playground apps.

## User Preferences (Important)

These were established during brainstorming and apply throughout this project:

- **Push back, don't validate.** When user asks "is X really the right call?", give honest analysis with concrete trade-offs and counter-examples. Don't soften to please.
- **Gradual building.** User wants to shape this slowly. Don't add scope beyond what's in the spec. v0.1 = Button only.
- **Angular: signals.** All new Angular code uses `input()`, `output()`, `signal()`, `computed()`. No `@Input/@Output`, no RxJS subscriptions for state, no `BehaviorSubject` for view state.
- **Discuss backend/architecture changes first.** Don't refactor or restructure mid-implementation without checking. If the plan needs to deviate, surface it.
- **Defensive defaults.** Tulpar UI is potentially commercial — choose collision-safe, conservative options when in doubt (e.g., full `tulpar-` prefix, not `tui-`).
- **Out-of-scope is enforced.** The spec's "out of scope" list is binding. Split button, dropdown button, FAB, Input, Checkbox — none in v0.1. If a use-case demands one, surface it as a future scope question, don't sneak it in.

## Out of Scope for v0.1

(Repeated for emphasis — see spec for full list)

- Input, Checkbox, Select, or any non-Button component
- Second brand theme
- React wrapper
- SSR optimization
- Mobile-native (RN/Flutter)
- Split button, dropdown menu button, toggle button, badged button, FAB
- Tooltip integration

## Execution Workflow

The plan uses checkbox (`- [ ]`) syntax. Recommended approaches:

- **Subagent-driven** (`superpowers:subagent-driven-development`) — fresh subagent per task, review between tasks
- **Inline** (`superpowers:executing-plans`) — execute tasks in this session with checkpoints

If user says "implementation'a başlayalım" or similar, invoke the appropriate skill and start at the first unchecked task.
