# Tulpar UI — Phase 1.1: Infrastructure (design)

- **Date:** 2026-11-11
- **Status:** Draft — awaiting owner approval
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
