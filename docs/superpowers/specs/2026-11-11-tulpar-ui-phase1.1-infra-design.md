# Tulpar UI — Phase 1.1: Infrastructure (design)

- **Date:** 2026-11-11
- **Status:** Implemented on branch `phase1/1.1-infra`; pending owner review and merge. Close-out in §10.
- **Branch:** `phase1/1.1-infra`
- **Inputs:** retro review `docs/reviews/2026-11-11-retrospective/` (INF-1…INF-21, K5, K7, DOC-17, DOC-24), phase plan (CLAUDE.md "Current phase plan"), decisions D10–D12.

## 1. Intent

Phase 1 fixes Tulpar's foundation before any new component. Package 1.1 comes first because every later package (tokens, a11y, forms, wrappers) is verified with the tools this package delivers: a single, current toolchain; tests in three browser engines with accessibility assertions; a CI that type-checks and builds everything on every PR; and build outputs that are correct to publish.

Success means: a contributor (or an agent) can run `pnpm install && pnpm build && pnpm lint && pnpm typecheck && pnpm test` on Windows and on CI with no flakes, and the published artifacts are standard and safe — even though npm publishing itself happens only in 1.8.

## 2. Goals

1. **One current toolchain** (INF-9, INF-21, K5, K7).
2. **Test infrastructure for the rest of phase 1** (INF-11, INF-12, D11): Chromium + Firefox + WebKit, axe assertions, accessibility-tree assertions, coverage.
3. **A CI that gates quality** (INF-15, INF-16, INF-18): type-check, build apps on PRs, least-privilege permissions, dependency audit, release and deploy only after CI is green.
4. **Correct build outputs** (INF-1, INF-2, INF-4, INF-5, INF-17).
5. **Lint guardrails without holes** (INF-13).
6. **Repo hygiene** (INF-14, INF-20, DOC-24).
7. **Custom Elements Manifest** generated and published for core and shell (INF-7) — the source for Storybook autodocs now and for wrapper parity checks in 1.7.

## 3. Non-goals (belong to later packages)

- Token changes of any kind → 1.2.
- Component behaviour, ARIA, forms, overlay logic → 1.3–1.6. (Only build/env plumbing in components changes here, e.g. how `warnDev` reads the environment.)
- Angular router secondary entry point (INF-3) and per-component wrapper entry points (INF-6) → 1.7, because the Angular wrappers are rewritten there (D2).
- npm trusted publishing (OIDC), `repository` fields, `fixed` vs `linked`, the 0.7.0 release, the stale "Version Packages" PR → 1.8 (INF-8, INF-19, D12).
- Storybook story content, docs pages and READMEs → 1.8.
- Visual regression testing → separate package **1.1b**, before 1.2 (owner decision, 2026-11-11), so the 1.2 token changes are compared against screenshots of today's look.

## 4. Constraints

- Nothing in the public component API changes; no feature is removed.
- No transition periods are needed (no external consumers yet).
- Node 26 LTS (`.nvmrc` 26.13.0); CI on `ubuntu-26.04`.
- Tulpar has no Tailwind dependency; do not add one.
- Angular code stays signals-only, no RxJS.
- No AI attribution in commits.
- Every step must leave `main`-ready state: build, lint and tests green before the next step starts.

## 5. Decided design

### 5.1 Toolchain alignment

| Tool | Today | Target |
|---|---|---|
| pnpm | 9.15.9 | current major (12.x) via `corepack use pnpm@latest` |
| Vite | 5.4 (tokens, core, shell, vue, docs) + 8.0 (angular, playground) | 8.3.x everywhere |
| Vitest | 1.6 (tokens, vue) + 3.2 (angular) | 5.1.x everywhere (fixes K5, K7: `@angular/build` accepts `^4.0.8 \|\| ^5.0.0`) |
| happy-dom | 14 + 20 | 21.x |
| vite-plugin-dts | 3.9 | 5.x |
| typescript-eslint | 7.18 (unsupported on ESLint 9 / TS 6) | 8.x via the `typescript-eslint` meta-package + `tseslint.config()` |
| ESLint | 9.39 | latest major that every chosen plugin supports |
| @web/test-runner (+ playwright launcher) | 0.20 | 1.0.x |
| @open-wc/testing | 4 | 5.x |
| Storybook | 8.6 | 10.x via `npx storybook@latest upgrade` (automigrate) |
| @changesets/cli | 2 | 3.x |
| @analogjs/vite-plugin-angular + @analogjs/vitest-angular (Angular wrapper tests) | 2.6 | 2.9.x (peer: Vite `^8`, Vitest `^5`) — keeps the single-version rule |
| Angular (playground, wrapper devDeps) | 22.0.0 (security advisories) | 22.2.x |
| Vue | 3.5.34 (advisory on server-renderer) | 3.5.45+ |
| lucide-angular / lucide-vue-next (deprecated) | 1.0.0 | current official Lucide packages |

Rules:
- **Every shared dependency lives in the pnpm catalog** and packages reference `catalog:`. Turn on `catalogMode: strict` so a non-catalog version is rejected.
- **pnpm settings move to `pnpm-workspace.yaml`.** Set `allowBuilds` (esbuild, playwright, …; `onlyBuiltDependencies` is ignored since pnpm 11) so dependency lifecycle scripts are blocked by default. Node ≥ 25 ships without corepack, so the pnpm version is set in `packageManager` directly.
- **Replace implicit `pre*` hooks with explicit scripts** (`"dev:vue": "pnpm build && pnpm -r --parallel …"`) and drop `enable-pre-post-scripts` from `.npmrc` (npm already warns it will stop working).
- **`engines.node`:** `>=26` (the LTS major). The exact version lives only in `.nvmrc`. This removes the warning on the owner's 26.3 machine.
- **Upgrade order (one commit per step, green after each):** typescript-eslint/ESLint → Vite + vite-plugin-dts → Vitest + happy-dom → WTR + open-wc → Storybook → pnpm major + catalog strict → framework bumps (Angular, Vue, Lucide).

### 5.2 Test infrastructure

- **Three engines (D11):** core and shell WTR configs list Chromium, Firefox and WebKit. CI runs all three. Locally the default stays Chromium for speed; `pnpm test:all-browsers` runs all three.
- **Known engine failures:** if Firefox or WebKit expose a real product bug that belongs to a later package (for example `:host-context` in TOK-8), the test is skipped **for that engine only** through one shared list, `test/engine-known-failures.ts`, where every entry names a finding ID and the package that will fix it. The package that fixes the bug removes the entry. Skips without a finding ID are not allowed. *(Builder-check answers — my call, 2026-11-11:)*
  - A failure the retro did not record gets a new ID `ENG-<n>` with a one-line description, the engine, and the owning package, recorded in the same file.
  - A failure caused by the test harness or timing (not the product) is fixed in 1.1, not skipped.
  - **Stop rule:** if more than 20 new product failures (`ENG-*`) appear, 1.1 stops at that point and the list goes to the owner before continuing.
- **Accessibility assertions:**
  - axe: `await expect(el).to.be.accessible()` (chai-a11y-axe, shipped with @open-wc/testing).
  - Accessibility tree: a shared helper backed by a small custom WTR command plugin that calls Playwright's `locator.ariaSnapshot()` (the `a11ySnapshot` command of `@web/test-runner-commands` cannot be used: it calls `page.accessibility.snapshot()`, which Playwright ≥ 1.57 no longer has — verified in Playwright 1.65 types). A test asserts the computed role, name and states (`checked`, `expanded`, `invalid`, `required`) that a screen reader actually gets; description is asserted where the snapshot exposes it. This is the gap the retro found (CB-26: tests compared attribute strings only).
  - 1.1 delivers the helpers and one example test per helper. Adding assertions to every component happens in 1.4 (with the fixes), not here — otherwise 1.1 would add dozens of failing tests for bugs it does not fix.
- **Coverage (INF-11):** CI runs WTR with `--coverage`; shell gets core's `include`/`exclude`; the 80% thresholds apply once measured. If a package is below 80% today, the threshold is set to the measured value and raised later — the number is recorded in the plan, not silently lowered.
- **Flake check:** the acceptance run executes the full `pnpm test` 10 times in a row on Windows (K5).

### 5.3 CI

- `ci.yml`: `permissions: contents: read`; cache Playwright browsers keyed on the Playwright version; steps: install → lint → typecheck → build packages → test (3 engines) → build apps (`playground-ng`, `playground-vue`, Storybook) → `pnpm audit --prod --audit-level high`.
- **Typecheck (INF-15):** a `typecheck` script per package (`tsc -b --noEmit`; `vue-tsc --noEmit` for the Vue package and playground) and a root `pnpm typecheck`.
- **Deploy only after CI (INF-18):** `deploy.yml` runs via `workflow_run` on a successful CI run on `main`.
- **Release is manual until 1.8** *(my call, 2026-11-11)*: `release.yml` changes to `workflow_dispatch` only, so nothing can publish to npm by accident before the phase-1 publish blockers (some of which stay open until 1.8) are fixed. 1.8 restores the automatic, CI-gated trigger together with OIDC/provenance (INF-8). The open "Version Packages" PR (#13) is left unmerged.
- **Changesets for 1.1** *(my call)*: changes that alter published output (partial compilation, externals, `sideEffects`, `warnDev`, manifest fields, CEM) get `patch` changesets so the 0.7.0 changelog is accurate.
- **Audit gate** *(my call)*: `pnpm audit --prod --audit-level high` is blocking. An advisory with no available fix goes into an allowlist in `pnpm-workspace.yaml` (`audit.ignoreGhsas`) with a comment stating the reason and a review date; nothing is ignored without both.
- **Dependency updates (INF-16) — no bot** (owner decision, 2026-11-11: "gerek yok, bir şey kurmayalım"). Instead:
  - Every phase-1 package starts with a manual `pnpm outdated -r` + `pnpm audit` step; updates are applied in that package's first commit.
  - GitHub Actions stay pinned to **major tags** (`@v7`), not commit SHAs. Without a bot, SHA pins would silently go stale (the Node 20 runtime deprecation was exactly that kind of staleness). The blocking audit gate stays.

### 5.4 Build outputs

- **Angular partial compilation (INF-1):** `tsconfig.lib.prod.json` with `"compilationMode": "partial"`; the `build` script uses it. Check: the FESM contains `ɵɵngDeclareComponent` and no `ɵɵdefineComponent`.
- **Angular Package Format (INF-4):** the source `package.json` keeps only name, version, dependencies and peers; ng-packagr writes `dist/package.json`; publishing uses `"publishConfig": { "directory": "dist" }`. The "types condition would be overridden" warning disappears.
- **Externals by pattern (INF-2):** core, shell and vue externalize dependencies and peers by pattern (`/^lit($|\/)/`, `/^@lit\//`, `/^lit-html($|\/)/`, `/^lit-element($|\/)/`, `/^@tulpar-ui\//`), preferably derived from `package.json`. A CI check fails if any `dist/**/*.js` contains `litHtmlVersions`. After this, the playground workarounds go away: `"prebundle": false` in `apps/playground-ng/angular.json` and `resolve.dedupe` in `apps/playground-vue/vite.config.ts`. The "avoid Lit directives" code comments are re-checked; the rule is dropped if both playgrounds run clean without it.
- **Dev warnings (INF-5):** library source never reads `import.meta.env`. `warnDev` uses `esm-env` (`DEV`), which resolves through the consumer's `development`/`production` export conditions. **Owner decision (2026-11-11): follow Lit's convention** — warnings appear in a bundler's dev mode and are removed in production builds; an unbundled CDN `<script>` user gets no warnings. Web Test Runner configs set `nodeResolve.exportConditions: ["development"]` so warning tests keep running. Check: a warning prints in both playgrounds' dev servers and its text is absent from their production bundles.
- **Manifest hygiene (INF-17):** `workspace:^` for internal dependencies; correct `sideEffects` (`false` for the Vue package; explicit arrays for core/shell registration files; `["**/*.css"]` for tokens); drop the unused `vue-router` peer; one rule for `@tulpar-ui/tokens` as a dependency of every package whose CSS needs it; `"./package.json"` export; no `.d.ts.map` pointing at unpublished sources.
- **Publish check:** `npm pack --dry-run` for every package is part of the acceptance and the file list is reviewed.

### 5.5 Lint

- typescript-eslint 8 flat config.
- **Primitive-token rule** extends to string literals and template literals in `packages/{core,shell}/src/**/*.ts` (not only `*.styles.ts`). The two known intentional uses (`tulpar-button.ts` custom colour, `tulpar-avatar.ts` palette) get an explicit `eslint-disable-next-line` with a reason that points to package 1.2, which moves them into the brand layer.
- **`_internal` boundary** also catches relative cross-package paths and `@tulpar-ui/*/src/_internal`.
- **New linters:** `eslint-plugin-lit` + `eslint-plugin-wc` (Lit templates), `eslint-plugin-vue` (flat `recommended`), `angular-eslint` (Angular templates).
- `lint-staged` runs `eslint --fix` as well as Prettier.

### 5.6 Repo hygiene

- `.gitattributes` with `* text=auto eol=lf` (+ binary types), then a one-time `git add --renormalize .` commit.
- `sync-exports` writes `package.json` only when the content changed; the two copies merge into one root script with a package-path argument.
- `git rm` the stray `.claire/worktrees/…` files and `build-output.txt`.
- `.gitignore` adds `graphify-out/`, `.wrangler/`, `.playwright/`, `*.log`, `build-output*.txt`.
- Root README package table includes `@tulpar-ui/shell`.

### 5.7 Violations the new gates find in existing code *(builder-check answer — my call, 2026-11-11)*

New gates (typecheck in CI, `eslint-plugin-lit`/`wc`, `eslint-plugin-vue`, `angular-eslint`, the wider primitive-token and `_internal` rules) will flag existing code. 1.1 must stay an infrastructure package, so:

1. **Type errors are fixed** in 1.1 — type-only changes (annotations, casts with a comment, narrowing). If a type error can only be fixed by changing behaviour, it is suppressed with `// @ts-expect-error <finding ID>` and listed for the owning package.
2. **Lint violations with a safe autofix that does not change runtime behaviour are fixed** in 1.1.
3. **All other lint violations are recorded with ESLint bulk suppressions** (`eslint-suppressions.json`, ESLint ≥ 9.24). Each suppressed rule is mapped in the plan to the package that will clear it (1.3–1.7). New code may not add suppressions.
4. `lint-staged` runs `eslint --fix` only with rules whose autofix is behaviour-neutral; rules that rewrite templates semantically are excluded from the staged-file run.
5. **Stop rule:** if a single new rule reports more than 200 violations, 1.1 stops at that point and the owner decides whether the rule enters now or with its package.

### 5.8 Custom Elements Manifest (INF-7)

- `@custom-elements-manifest/analyzer` (with `--litelement`) runs in the core and shell builds; `custom-elements.json` is published and referenced by `"customElements"` in `package.json`.
- Storybook calls `setCustomElementsManifest()` so autodocs tables and controls fill in.
- The wrapper parity check that consumes the manifest is built in 1.7.

## 6. Acceptance

1. On Windows: `pnpm install`, `pnpm build`, `pnpm lint`, `pnpm typecheck` green; full `pnpm test` green 10 runs in a row.
2. On CI (`ubuntu-26.04`): all jobs green; tests run in Chromium, Firefox and WebKit; every engine skip is listed with a finding ID.
3. One version per tool across the repo (`pnpm why vite|vitest|happy-dom` shows one version); `catalogMode: strict` active.
4. `dist` checks: no `litHtmlVersions` in any package; Angular FESM is partial-compiled; `npm pack --dry-run` file lists reviewed.
5. Both playgrounds run with `pnpm dev:vue` / `pnpm dev:ng` without `prebundle:false` / `dedupe`, rail mode and toasts verified in the browser (the cases that crashed before).
6. `warnDev` prints in a dev build, not in a production build.
7. Storybook 10 builds; autodocs show component properties from the manifest.
8. No change in component behaviour: core 1,371 + shell 103 + wrapper tests stay green in Chromium (the baseline).

9. Every `ENG-*` skip, `@ts-expect-error` and ESLint suppression is listed with its owning package.
10. `release.yml` cannot run without a manual dispatch.

## 7. Left to the builder

- Exact plugin and minor versions, as long as §5.1 majors and the single-version rule hold.
- How to derive externals from `package.json` (plugin vs small helper).
- File layout of the shared test helpers.
- Whether ESLint lands on 9 or 10, decided by plugin support at build time.

## 8. Owner decisions (resolved 2026-11-11)

1. **Visual regression:** separate package 1.1b, before 1.2.
2. **Dependency bot:** none. Manual update step at the start of each package; actions on major tags.
3. **pnpm:** move to the current major (12) in 1.1.

## 9. Builder-check record

A fresh reviewer read this design as the future planner. Its questions were resolved as follows: Angular wrapper tests run on Analog, whose 2.9.x line supports Vite 8 and Vitest 5 (answered by the code, §5.1); the gate-violation policy (§5.7), unrecorded engine failures (§5.2), release trigger and changesets, and the audit gate (§5.3) are the author's calls, marked in place.

## 10. Close-out (2026-11-12)

CI evidence: GitHub Actions run 43159150351 on commit 27ecb36, branch `phase1/1.1-infra`: completed / success, every step, three engines. <https://github.com/KaanAkcan1/tulpar-ui/actions/runs/43159150351>

Local runs: Windows 11, Git Bash, Node 26.3.0 (the pinned `.nvmrc` is 26.13.0; `engines >=26` holds), pnpm 12.18.0, HEAD 27ecb36.

### 10.1 Acceptance results (§6)

| # | Item | Command / evidence | Outcome |
|---|---|---|---|
| 1 | `install`, `build`, `lint`, `typecheck` green on Windows | `pnpm install --frozen-lockfile` (lockfile up to date), `pnpm build`, `pnpm lint`, `pnpm typecheck`: all exit 0 | passed |
| 1 | `pnpm test` green 10 runs in a row | 10 consecutive `pnpm test` runs, all exit 0. Counts in each run: tokens 197, shell 103, core 1,373, vue 244, angular 202, test-utils 9 | passed |
| 2 | CI green, three engines, every skip listed | CI run 43159150351 (above). Locally: `pnpm --filter @tulpar-ui/core --filter @tulpar-ui/shell run test:all-browsers` exit 0 (core 1,373 and shell 103 in Chromium, Firefox and WebKit). Skips: none, 0 `ENG-*` entries | passed |
| 3 | One version per tool; `catalogMode: strict` | `pnpm why -r vite`, `vitest`, `happy-dom` → vite 8.3.5, vitest 5.1.0, happy-dom 21.0.4, one version each. `catalogMode: strict` is set in `pnpm-workspace.yaml` | passed |
| 4 | No `litHtmlVersions` in dist; Angular FESM partial; pack lists reviewed | `pnpm check:dist` exit 0 ("no inlined lit-html; element registrations covered by sideEffects; Angular FESM is partial-compiled"); `grep -rl litHtmlVersions packages/*/dist` → 0 files. `pnpm -r --filter "./packages/*" pack --dry-run` after a fresh `pnpm build` (12 Nov, after the final-review fixes). Files per tarball: tokens 33 (css + `.d.ts` + 2 `.js` + 2 `.map`), core 194 (55 `.js`, 104 `.d.ts`, 31 `.map`, `custom-elements.json`), shell 55 (15 `.js`, 29 `.d.ts`, 7 `.map`, `custom-elements.json`), angular 6 (reflects `publishConfig.directory: dist`: `fesm2022/tulpar-ui-angular.mjs` + map, `types/tulpar-ui-angular.d.ts`, `package.json`, `README.md`, `LICENSE`; no source tree), vue 37 (`dist/index.js` + map, 32 `.d.ts`, `package.json`, `README.md`, `LICENSE`). No `*.spec.d.ts`, `*.test.d.ts`, `*.d.ts.map` or `src/` in any list; `check:dist` now fails on them. The earlier "angular 72, vue 89" figures came from `npm pack` (which ignores `publishConfig.directory`) and a stale vue `dist` that held 10 `*.spec.d.ts` files; both were wrong | passed |
| 5 | Playgrounds run without `prebundle:false` / `dedupe`; rail and toasts verified | Workarounds removed in Task 3. Task 3 and Task 9 verified rail flyout, toast and Select in both playgrounds with `playwright-cli` (Task 9 in light and dark), `litHtmlVersions.length === 1`. Live `pnpm dev:vue` run in Task 9. Live `pnpm dev:ng`: the final-fix round ran `ng serve` with `prebundle.exclude` and a live core edit reached the served page; the owner ran `pnpm dev:ng` from a cold start on 13 Nov (build, `ng cache clean`, five watchers, `ng serve` on 4310, no errors). Live `pnpm dev:storybook`: the owner ran it on 13 Nov and the page opened on 6006 | passed |
| 6 | `warnDev` prints in dev, not in prod | Dev: WTR runs with the `development` condition and the 3 `warn-dev.test.ts` tests pass; the unresolved-`for` probe printed the warning in dev (Task 7). Prod: Vue prod bundle has 0 hits for the warning text (re-grepped today). Angular prod bundle prints nothing at runtime (Task 7 static-serve check) but keeps the dead strings: 15 files in `apps/playground-ng/dist` still contain the text | passed with a recorded deviation (owner decision 1, §10.4) |
| 7 | Storybook 10 builds; autodocs from the manifest | `pnpm --filter docs build-storybook` exit 0 (Storybook 10.6.7). `custom-elements.json`: core 24 elements, shell 5; `"customElements"` is set in `package.json`. Autodocs tables were checked in Task 6, not re-checked in a browser today | passed |
| 8 | No behaviour change; baseline tests green in Chromium | core 1,373 (baseline 1,371), shell 103, angular 202, vue 244, tokens 197: none below baseline | passed |
| 9 | Every `ENG-*` skip, `@ts-expect-error` and ESLint suppression listed with owner | §10.2 | passed |
| 10 | `release.yml` cannot run without a manual dispatch | `.github/workflows/release.yml` has `on: workflow_dispatch` only | passed |

Additional gates, run today: `pnpm lint:probe` (all cases PASS), `pnpm check:suppressions` (first introduction on this branch; passes).

### 10.2 Lists

- **`ENG-*` entries:** none. `ENGINE_KNOWN_FAILURES` is empty (stop rule: more than 20). `itUnlessEngine` exists in `tooling/test-utils` but has no caller. The six Firefox/WebKit failures found in Task 5 were harness or timing issues and were fixed in the tests (Task 5 report §5).
- **`@ts-expect-error`:** none (Task 8; `grep` over `packages`, `apps`, `tooling` and `scripts` finds no occurrence).
- **Suppressed ESLint rules** (`eslint-suppressions.json`, 236 in total, re-counted today):

| Rule | Count | Owning package | Planned fix |
|---|---|---|---|
| `vue/require-default-prop` | 193 | `@tulpar-ui/vue` | 1.7 |
| `vue/no-template-shadow` | 1 | `@tulpar-ui/vue` | 1.7 |
| `@angular-eslint/no-input-rename` | 11 | `@tulpar-ui/angular` | 1.7 |
| `@angular-eslint/no-output-native` | 6 | `@tulpar-ui/angular` | 1.7 |
| `lit/attribute-value-entities` | 23 | `@tulpar-ui/shell` | 1.4 |
| `lit/no-invalid-html` | 1 | `@tulpar-ui/core` | 1.4 |
| `lit/no-legacy-template-syntax` | 1 | `@tulpar-ui/core` | 1.4 |

  Also accepted: `vue/no-deprecated-slot-attribute` is off (Vue 3 needs native `slot=` on custom elements); `eslint-config-prettier` is applied to `.vue`; two extra primitive-token disables in `core/src/_internal/selection-control-base.ts` and `core/src/_internal/tone/tone-resolver.ts` (owner 1.2, brand layer).
- **Coverage** (Chromium, `wtr --coverage`, Task 5 report §7; thresholds 80/80/80/80 unchanged):

| Package | Lines | Branches | Functions | WTR summary |
|---|---|---|---|---|
| `@tulpar-ui/core` | 98.16 % | 89.33 % | 96.35 % | 95.49 % |
| `@tulpar-ui/shell` | 98.43 % | 95.14 % | 99.01 % | 97.75 % |

### 10.3 Dependency baseline

| | Task 0 (before) | Now (HEAD 27ecb36) |
|---|---|---|
| `pnpm outdated -r` | 140 lines (`task0-outdated-before.txt`) | 39 lines: vite 8.3.5 (latest 8.3.8; pinned to the `@angular/build` pin), plus minors of `@vue/test-utils`, `karma-jasmine-html-reporter`, `lint-staged`, `prettier`, `tslib`, `tsx`, `wrangler`, `zone.js`; `@angular/platform-browser-dynamic` is deprecated upstream |
| `pnpm audit --prod --audit-level high` | 20 vulnerabilities (15 high, 5 moderate), all under `apps/playground-*` (`task0-audit-before.txt`) | `No known vulnerabilities found` (re-run today) |
| `pnpm audit` including dev dependencies | not recorded | 69 (11 low, 24 moderate, 34 high), all in dev tooling (undici, fast-uri, minimatch, sharp and others); outside the `--prod` CI gate |

### 10.4 Owner decisions (decided 2026-11-13)

Kaan chose **1-A** and **2-A** on 13 Nov 2026. The option text below is kept as the record.

1. **Angular production bundles keep dead dev-warning strings.** Angular CLI (esbuild) does not fold esm-env's re-exported `DEV`; the strings stay (15 files in `apps/playground-ng/dist`) and the warning never runs. Vite builds drop them. Options: (a) accept, and read acceptance item 6 as "no warning at runtime in production"; (b) replace esm-env with a `#dev` subpath-import condition, which esbuild folds; (c) another approach chosen by the owner. **Correction (final review):** (b) alone does not remove the strings, because Tulpar passes the message text at the call site (`warnDev("...")`), so the literal stays in the bundle unless every call site is also guarded by the `#dev` constant. The industry-standard fix is Lit's dual build: the library strips dev code at its own build, ships the production build as the `default` export condition, and ships the dev build under the `development` condition. **Recommendation: (a) now, as an interim; Lit-style dual build in 1.8.** Cost of (a): a few hundred bytes per Angular app. **Decision: (a) now; the Lit-style dual build is a 1.8 item.**
2. **`playground-ng` initial budget is 2 MB (interim).** The official `@lucide/angular` costs about 3.2 kB per icon (main chunk 1,495,172 B; initial 1.59 MB), so the old 1.5 MB budget does not hold. Options: (1) lazy demo routes in both playgrounds (recommended; the correct fix; measure the initial bundle before restoring 1.5 MB, because the 27 icons used in app, shell and sidenav stay eager); (2) `lucideLegacyIcon` data (about 1.43 MB); (3) keep 2 MB. Playground only; no package impact. **Decision: (1) lazy demo routes in both playgrounds, as a separate follow-up task after this branch merges (before 1.2); measure, then restore the 1.5 MB budget. The 2 MB budget stays until then.** **Done 2026-11-13 (branch `phase1/1.1-lazy-routes`):** all 23 demo routes are lazy in both playgrounds (`loadComponent` / `() => import()`). playground-ng initial 1.59 MB → 1.07 MB (gzip 263 → 182 kB); playground-vue main JS 974 → 544 kB. The initial budget error is back at 1.5 MB.

### 10.5 Open items (not failures)

- Five `pnpm dev:vue` processes from Task 9 (PIDs 55856, 54936, 54044, 23444, 49612, port 5274) and an older owner `dev:vue` may still run; the owner stops them.
- Local `pnpm format:check` shows 42 files as CRLF because of the Windows `autocrlf` working copy; `.gitattributes` sets `eol=lf`, so Linux CI is clean.
- `actionlint` reports only "unknown label ubuntu-26.04" (stale label list).
- Release stays manual until 1.8.

### 10.6 Deferred findings (minor and notes, from the ledger)

| Source | Finding | Target |
|---|---|---|
| Task 1 | pre-existing core test timing flakes under load (`public type exports`, toast swipe); not seen in the 10 runs above | watch (harness) |
| Task 1 | `sync-exports` resolves `dirArg` against cwd; `readdirSync` stack trace when `src` is missing; `.gitignore` `!packages/*/build/` negations may be stale | next infra touch |
| Task 2 | `check-suppressions` failed open when the `origin/main` ref was missing | closed in Task 10 (fails closed under CI) |
| Task 2 | relative `_internal` boundary patterns cover only 2–3 levels of `../` | 1.4 |
| Task 2 | fix-safe `consistent-type-imports` is not applied to `.vue` `<script lang="ts">`; the vetted rule list lives in two configs (drift risk) | 1.7 |
| Task 3 | `tulpar-option.ts` has a long comment line | next touch of core |
| Task 4 | K5 did not reproduce in 10/10 after the upgrade; root cause not isolated | CI is the watch |
| Task 4 | vue tests create happy-dom 22 times (performance hint, not applied) | 1.7 |
| Task 5 | `test:all-browsers` stops at the first failing engine | closed in Task 10 (CI runs each engine as its own step) |
| Task 5 | unverified that WTR keeps `it.skip`-pending tests in `testResults` (an all-skipped file could false-fail `wtr-strict`); `wtr-strict` ignores SIGTERM (as stock WTR) | verify when the first `ENG-*` entry appears |
| Task 5 | `expectA11yNode` throws for `required` (Playwright 1.65 snapshot lacks it) | 1.4 |
| Task 5 | toast tests depend on real timers; auto-dismiss limit 1000 ms, WebKit concurrency 4 | 1.6 (overlay/toast) |
| Task 6 | manifest imported by relative path instead of the exports map | next `sync-exports` change |
| Task 6 | static Lit fields (`shadowRootOptions`, `formAssociated`) and `dataDisabled` stay in manifest members | 1.4 |
| Task 7 | `warnDev` non-DEV branch has no unit test | covered by the CI prod-bundle grep (Task 10) |
| Task 8 | docs/Storybook not in `typecheck`; `as unknown as` cast in `active-descendant-controller.test.ts` | 1.8 / 1.4 |
| Task 9 | root `dev` filter lists are verbose; root-only tools are outside the catalog (documented) | 1.8 |
| Task 9 | `typescript` 5.4.2 is nested in the CEM analyzer and api-extractor (not ours) | upstream |
| Task 9 | live `dev:ng` / `dev:storybook` run | closed 13 Nov (acceptance item 5) |
| Close-out | CI run 43167002951 (5ec4289) failed one WebKit test: `[data-enter] persists through at least one requestAnimationFrame`. Two frames on a loaded runner outlasted the 300 ms wall-clock fallback. The test now holds the fallback timer and sets a 10 s enter duration, so it checks only the rAF claim; component unchanged | fixed in the close-out |
| Close-out | `NG8102` in `packages/angular/src/select/tulpar-option.component.ts:23` (`value() ?? null`; left side is never nullish), pre-existing | 1.7 |
| Close-out | `pnpm dev:ng` rebuilds the angular `dist` in full compilation mode; run `pnpm build` before `pnpm check:dist` after a dev session (documented in CLAUDE.md) | documented |
| Owner decision 1 | Lit-style dual build (production `default` + `development` condition) so no bundler keeps dev strings | 1.8 |
| Owner decision 2 | lazy demo routes in both playgrounds, then restore the 1.5 MB playground-ng budget | done (`phase1/1.1-lazy-routes`) |
| Lazy routes | playground-vue NumberInput page throws `RangeError: Invalid language tag` (pre-existing on `main`, retro VIS-1) and, once that no longer aborts render first, `'set' on proxy … formatOptions`: the demo assigns `formatOptions` to the wrapper component instance, whose props are read-only. Pass it as a prop instead | 1.7 |
| Lazy routes | playground-vue never sets `document.title` (route `meta.title` is unused); playground-ng does. Parity gap | 1.7 |
| Lazy routes | playground-ng `initial` budget warning is still 700 kB (current 1.07 MB) | 1.7 |
| Task 10 | `actions/cache@v4`: check for a newer major at CI time | next CI touch |
