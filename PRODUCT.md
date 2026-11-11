# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** development teams at other companies (external customers) who build enterprise web applications in Angular, Vue, or plain HTML. Their job: ship consistent, accessible business UIs (forms, data views, app shells) without re-implementing the same components per framework.
- **First customer:** Berdan Connect (Vue 3 apps `connectFlow`, `connectIk`). Connect is the acceptance bar: it must be able to replace its own shared UI layer with Tulpar without losing anything.
- **Secondary:** Kaan Akcan (owner) and his own projects.

## Product Purpose

Tulpar UI is a framework-agnostic design system. UI behaviour and rendering live once, in Lit web components (`@tulpar-ui/core`, `@tulpar-ui/shell`), with idiomatic Angular and Vue wrappers on top and a 3-layer token system (`@tulpar-ui/tokens`) underneath.

Success means: a consuming application can adopt Tulpar and lose nothing it had before — visuals, behaviour, keyboard and screen-reader support, motion quality — and gain Tulpar's extra features on top. Connect adopting Tulpar is the first concrete proof.

## Positioning

1. **Framework-agnostic core.** One implementation; identical behaviour in Angular and Vue (and plain HTML). Wrappers stay thin and idiomatic.
2. **Selectable themes and page structures.** A 3-layer multi-brand token system (primitive → semantic → brand × mode) plus selectable page structures: Theme 1 **Tulpar** and Theme 2 **Tuğrul** (`tugrul`, a Connect-style page structure). The sidebar is selectable independently of the page structure. Every colour and font stays overridable by the consumer.
3. **"Best of the mature systems, then better"** — the owner's ambition, expressed as a measurable bar (see Product Principles), not as a marketing claim.

## Operating Context

- Distributed as npm packages under the `@tulpar-ui/*` scope; consumers add the tokens CSS and the components they use.
- Showcases: two playgrounds that must stay in parity (Angular `playground-ng`, Vue `playground-vue`) and Storybook (`apps/docs`); deployed to `tulpar-ui-ng`, `tulpar-ui-vue` and `tulpar-ui-docs` on Cloudflare Pages from `main`.
- Consumers may use Tailwind in their own pages; Tulpar itself has no Tailwind dependency.
- Icons are consumer-provided (prop or slot, e.g. Lucide); Tulpar ships no icon set.
- Planned consumer adapters live outside the core: data grid (AG Grid vs own grid — undecided), charts (separate package).

## Capabilities and Constraints

- **Shipped (v0.1–v0.15):** Button, ButtonGroup; TextInput, NumberInput, Textarea; Checkbox, CheckboxGroup, Radio, RadioGroup, Switch; Tooltip, Toggletip, Popover; Toast + Message service; Tag, Badge, Chip, Avatar, Skeleton, Spinner, Progress; Select (+ options data-prop, in-popup search); App shell (shell, topbar, sidenav, nav-item, nav-section).
- **Known state:** a 2026-11-11 retrospective review found 181 findings (21 Blocker) — see `docs/reviews/2026-11-11-retrospective/`. Phase 1 (hardening + token foundation) comes before any new component.
- **Conventions:** element prefix `tulpar-`, CSS prefix `--tulpar-`, dark mode via `.dark`, brand via `[data-brand]`. Angular wrappers are signals-only (no `@Input/@Output`, no RxJS). Components accept rich content via both a prop and a slot.
- **Built-in strings:** English by default, fully overridable (i18n); Turkish ships as a language pack.
- **Browser support:** last 2 major versions of Chrome, Edge, Firefox and Safari (evergreen).
- **Licensing:** all packages are MIT today. Commercial model: **undecided**.
- **Change policy:** additive — no existing feature is removed or replaced without the owner's approval; breaking renames need a deprecation path. Scope grows wave by wave per `docs/roadmap.md`.
- **Open decisions:** cross-shadow accessibility architecture; Angular wrapper model (proxy pattern) and Angular forms API; library-wide tone vocabulary; grid strategy; release cadence. Listed in the retro report §6.

## Brand Commitments

- Name **Tulpar** (the winged horse of Turkic mythology). Palette families are named after Turkic/Altai mythology (al, gok, ulgen, umay, …); Theme 2 is **Tuğrul** (Old Turkic _toğrıl_, a sacred bird of prey).
- Berdan's trademark, logo and brand colours must not ship in the public packages; Connect supplies its own colours on its side.
- No AI attribution in git history (no `Co-Authored-By`, no "Generated with" lines).

## Evidence on Hand

- `docs/roadmap.md` (wave plan, 12-library gap survey), `docs/superpowers/specs/` and `plans/` (v0.1–v0.15), `docs/reviews/2026-11-11-retrospective/` (review + `findings.json`).
- Connect comparison reports exist only on the owner's machine (they contain Berdan-internal details) and must never be committed here.
- **Absent:** no customer testimonials, adoption numbers, benchmarks, pricing or case studies exist. Do not fabricate any.

## Product Principles

1. **Additive, never subtractive.** New behaviour arrives as an option next to what exists; the owner approves any removal.
2. **Accessibility is part of the API.** Every interactive component meets WCAG 2.2 AA and its WAI-ARIA APG pattern, verified in the browser's computed accessibility tree and with axe — not only by attribute checks.
3. **One behaviour everywhere.** Angular, Vue and plain HTML get the same behaviour from the same core; prop and slot forms both work.
4. **Benchmarked, then better.** Every contested decision cites at least three mature systems and states why Tulpar's choice is equal or better.
5. **Everything themable.** Values come from tokens, not hard-coded literals, so brands and page structures can change them.

## Accessibility & Inclusion

WCAG 2.2 Level AA is the required standard for every shipped component (the baseline the EU Accessibility Act relies on for products sold in the EU). Built-in strings must be localisable; Turkish-specific text handling (e.g. dotted/dotless i in search) is required where text is matched.
