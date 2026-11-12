# Phase 1.1 Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. **Tick each checkbox in the same commit that completes it.**

**Goal:** Align the toolchain, add three-engine + accessibility test infrastructure, make CI a real gate, and make every package's build output correct to publish — without changing component behaviour.

**Architecture:** Mechanical upgrades land one tool at a time, each commit green. Shared test helpers live in a private workspace package `tooling/test-utils`. Build-output fixes are verified by `scripts/check-dist.mjs` (CI step `check:dist`) and a tarball smoke app outside the workspace. Violations found by new gates are fixed only when the fix is type-only or behaviour-neutral; everything else is recorded with an owning package.

**Tech Stack:** pnpm 12 (catalog strict), Vite 8.3, Vitest 5.1, happy-dom 21, vite-plugin-dts 5, @vitejs/plugin-vue 6, vue-tsc 3, typescript-eslint 8 (TypeScript `~6.0`), @web/test-runner 1.0 + Playwright 1.65 (Chromium/Firefox/WebKit), @open-wc/testing 5, Storybook 10 (+ `@storybook/addon-docs`), ng-packagr 22.2, Analog 2.9, @custom-elements-manifest/analyzer 0.11, esm-env 1.2, @changesets/cli 3.

**Spec:** `docs/superpowers/specs/2026-11-11-tulpar-ui-phase1.1-infra-design.md`

## Global Constraints

- No change to any public component API or runtime behaviour; no feature removed. (Dev warnings follow Lit's convention — owner decision in the spec.)
- No transition periods (no external consumers yet).
- Node 26 LTS; `.nvmrc` stays `26.13.0`; `engines.node` becomes `>=26`. Node ≥ 25 has no corepack — set `packageManager` by hand.
- CI runner `ubuntu-26.04`; actions on major tags; no dependency bot.
- TypeScript stays on `~6.0.x` (typescript-eslint 8 supports `<6.1`).
- No Tailwind dependency; `packages/angular` stays signals-only, no RxJS.
- One version per tool across the repo; every shared dependency referenced as `catalog:`.
- Every commit leaves `pnpm build && pnpm lint && pnpm test` green in Chromium. Baseline: core 1,371 · shell 103 · angular 202 · vue 244 · tokens 197 tests.
- Shell commands are Git Bash (the owner develops on Windows).
- Commit messages: Conventional Commits, no AI attribution.
- Stop rules: one new lint rule > 200 violations, or > 20 new `ENG-*` engine failures → stop and report to the owner.
- `release.yml` never publishes automatically during phase 1.

**Known deviation from the spec's upgrade order:** pnpm 12 + catalog strict (Task 9) runs after the build-output and typecheck tasks (7, 8), because those tasks do not depend on the package manager and the catalog move is easier once every tool is already on its target version.

## Review Focus

1. **Dev loop after removing `pre*` hooks** — `pnpm dev:vue` / `pnpm dev:ng` / `pnpm dev:storybook` must still build packages first, then watch; with every `packages/*/dist` deleted there must be no "cannot find module @tulpar-ui/…". Test: Task 9 Step 5.
2. **A consumer that installs only the packed tarballs** (outside the workspace, pnpm strict layout) must resolve tokens CSS, load Lit once, and register every element it imports. Test: Task 7 Step 6.
3. **Windows line endings** — two consecutive builds on Windows leave `git status` clean. Test: Task 1 Step 4.
4. **Dev warnings in consumer builds** — printed in both playgrounds' dev servers, absent from their production bundles. Test: Task 7 Step 4.
5. **Harness-only engine failures** — a Firefox/WebKit failure caused by timing or the test harness must be fixed, not listed as `ENG-*`. Test: Task 5 Step 7.

---

### Task 0: Dependency baseline

- [x] **Step 1: Run** `pnpm outdated -r > /tmp/outdated-before.txt; pnpm audit --prod --audit-level high` and attach both outputs to the Task 11 close-out (spec §5.3: every package starts with this check). _(Outputs saved in `.superpowers/sdd/.../task0-*.txt`, not `/tmp`.)_

### Task 1: Repo hygiene and line endings

**Files:**
- Create: `.gitattributes`, `scripts/sync-exports.ts`
- Modify: `.gitignore`, `README.md`, `packages/{core,shell}/package.json`
- Delete: `packages/{core,shell}/build/sync-exports.ts`, `build-output.txt`, tracked files under `.claire/`

**Interfaces:**
- Produces: `tsx ../../scripts/sync-exports.ts <packageDir> [--check]` — rewrites `<packageDir>/package.json` exports from `src/*/index.ts`; writes **only** when the serialized result differs; `--check` exits 1 on drift.
- Produces: in core and shell, `"build": "tsx ../../scripts/sync-exports.ts . && vite build && <cem step added in Task 6>"` (no `prebuild`).

- [x] **Step 1:** Add `.gitattributes`: `* text=auto eol=lf`; `binary` for `*.png *.jpg *.ico *.woff *.woff2 *.tgz`.
- [x] **Step 2:** Commit `git add --renormalize .` alone: `chore: normalize line endings to LF`.
- [x] **Step 3:** Merge both `sync-exports.ts` copies into `scripts/sync-exports.ts` (interface above); call it from `build` (not `prebuild`) and from `sync-exports` / `sync-exports:check`.
- [x] **Step 4: Verify** — `pnpm build && pnpm build && git status --porcelain` → Expected: empty.
- [x] **Step 5:** `git rm -r .claire build-output.txt`; add `graphify-out/`, `.wrangler/`, `.playwright/`, `*.log`, `build-output*.txt` to `.gitignore`; add `@tulpar-ui/shell` to the README package table.
- [x] **Step 6:** Commit `chore: repo hygiene (gitattributes, shared sync-exports, stray files)`.

### Task 2: Lint toolchain and guardrails

**Files:**
- Modify: `eslint.config.js`, root `package.json` (devDeps, scripts, `lint-staged`)
- Create: `scripts/lint-probe.mjs`, `eslint-suppressions.json` (generated), `scripts/check-suppressions.mjs`

**Interfaces:**
- Produces: `pnpm lint:probe` — `scripts/lint-probe.mjs` uses `new ESLint().lintText(code, { filePath })` with virtual file paths and asserts the reported rule IDs; exits 1 on mismatch.
- Produces: `pnpm check:suppressions` — exits 1 if any rule's count in `eslint-suppressions.json` is higher than in `origin/main` (new code may not add suppressions).

- [x] **Step 1:** Upgrade to the `typescript-eslint` 8 meta-package (`tseslint.config()`), ESLint to the newest major every plugin in Step 6 supports, TypeScript catalog entry `~6.0.x`. Keep existing rules. Run `pnpm lint` → green.
- [x] **Step 2: Write `scripts/lint-probe.mjs`** with three cases:
  - `filePath: "packages/core/src/__probe__/a.ts"`, code `export const c = "var(--tulpar-primitive-color-colpan-50)";` → expects `no-restricted-syntax`.
  - `filePath: "packages/shell/src/__probe__/b.ts"`, code `import "../../../core/src/_internal/warn-dev";` → expects `no-restricted-imports`.
  - `filePath: "packages/shell/src/__probe__/c.ts"`, code `import "@tulpar-ui/core/src/_internal/warn-dev";` → expects `no-restricted-imports`.
  - Control: `filePath: "packages/core/src/button/__probe__.ts"`, code `import "../_internal/warn-dev";` → expects **no** error (own-package `_internal` stays legal).
- [x] **Step 3: Run** `pnpm lint:probe` → Expected: FAIL on the first three cases (rules not extended yet).
- [x] **Step 4:** Extend `no-restricted-syntax` to `Literal` and `TemplateElement` for `packages/{core,shell}/src/**/*.ts`, excluding `**/*.test.ts`. Extend `no-restricted-imports` with cross-package patterns only: `**/packages/*/src/_internal/**`, `../../*/src/_internal/**`, `../../../*/src/_internal/**`, `@tulpar-ui/*/src/_internal/**`. Wrap the intentional primitive uses in **block** disables with a reason: `/* eslint-disable no-restricted-syntax -- custom-colour escape hatch, moved to the brand layer in phase 1.2 */ … /* eslint-enable */` around `packages/core/src/button/tulpar-button.ts` L67-88 and L249, and `packages/core/src/avatar/tulpar-avatar.ts` L196-213.
- [x] **Step 5: Run** `pnpm lint:probe` → PASS (all four cases). `pnpm lint` → green.
- [x] **Step 6:** Add `eslint-plugin-lit` + `eslint-plugin-wc` (recommended) for `packages/{core,shell}/src`, `eslint-plugin-vue` (flat `recommended`) for `**/*.vue`, `angular-eslint` (TS + template recommended) for `packages/angular` and `apps/playground-ng`. Apply behaviour-neutral autofixes only; record the rest with `eslint --suppress-all`. If one rule exceeds 200 violations → stop and report.
- [x] **Step 7:** Add `check:suppressions`; `lint-staged`: `eslint --fix` (rules whose fix is behaviour-neutral) then `prettier --write`.
- [x] **Step 8:** Commit `chore(lint): typescript-eslint 8, lit/wc/vue/angular linters, closed guardrail gaps`.

### Task 3: Vite 8, vite-plugin-dts 5, externals by pattern

**Files:**
- Create: `scripts/vite-externals.ts`, `scripts/check-dist.mjs`
- Modify: `packages/{tokens,core,shell,vue}/vite.config.ts`, `packages/vue/package.json` (`@vitejs/plugin-vue` 6, `vue-tsc` 3), `apps/playground-ng/angular.json` (remove `"prebundle": false`), `apps/playground-vue/vite.config.ts` (remove `resolve.dedupe`), root `package.json` (`check:dist`)
- Not in this task: `apps/docs` Vite (Storybook 8 accepts only Vite ≤ 6) → Task 6.

**Interfaces:**
- Produces: `externalsFrom(pkgJsonPath: string): RegExp[]` — one RegExp per name in `dependencies` + `peerDependencies` matching the bare name and any subpath (`/^lit($|\/)/`), plus `/^@lit\//`, `/^lit-html($|\/)/`, `/^lit-element($|\/)/`.
- Produces: `pnpm check:dist` — exits 1 if any `packages/*/dist/**/*.js` contains `litHtmlVersions` (extended in Task 7).

- [x] **Step 1:** Write `check-dist.mjs`; **run** `pnpm build && pnpm check:dist` → Expected: FAIL, at least one file reported (shell `tulpar-nav-item-*.js` among them).
- [x] **Step 2:** Upgrade Vite to 8.3.x and vite-plugin-dts to 5.x in tokens, core, shell, vue; `@vitejs/plugin-vue` 6.x and `vue-tsc` 3.x in vue. Replace `rollupOptions.external` in core, shell and vue with `externalsFrom(resolve(__dirname, "package.json"))`.
- [x] **Step 3: Run** `pnpm build && pnpm check:dist` → PASS. `pnpm test` → baseline.
- [x] **Step 4:** Remove `"prebundle": false` and `resolve.dedupe`. Start both playgrounds; with `playwright-cli` verify in each: collapse to rail and open a flyout, open a toast, `globalThis.litHtmlVersions.length === 1`, no console errors.
- [x] **Step 5:** If Step 4 is clean, replace the "avoid Lit directives / dual instance" code comments (`grep -rniE "dual|duplicate|cross-instance" packages/*/src --include=*.ts`) with one line: cause fixed in phase 1.1 (INF-2). No code change.
- [x] **Step 6:** Commit `build: vite 8 + externals by pattern; single lit-html instance; drop playground workarounds`.

### Task 4: Vitest 5, happy-dom 21, Analog 2.9

**Files:**
- Modify: `packages/{tokens,vue,angular}/package.json`, `packages/vue/vite.config.ts` (test block), `packages/angular/vitest.config.ts`

- [x] **Step 1:** Upgrade Vitest 5.1.x, happy-dom 21.x, `@analogjs/vite-plugin-angular` + `@analogjs/vitest-angular` 2.9.x; apply Vitest migration notes for removed options.
- [x] **Step 2: Run** the three package test commands → Expected: 197 / 244 / 202 passed.
- [x] **Step 3: Run** `pnpm install` → Expected: no `unmet peer vitest` (K7 closed).
- [x] **Step 4: Run** `for i in $(seq 10); do pnpm -r --filter "./packages/*" run test || break; done` → Expected: 10/10 green, no `UNKNOWN: unknown error, open …\Temp\…` (K5 closed). (Playground Karma tests are excluded, as in CI.)
- [x] **Step 5:** Commit `test: vitest 5 + happy-dom 21 + analog 2.9 everywhere (fixes K5, K7)`.

### Task 5: Test runner 1.0, three engines, accessibility helpers

**Files:**
- Create: `tooling/test-utils/package.json` (`"name": "@tulpar-ui/test-utils"`, `"private": true`), `tooling/test-utils/src/aria-snapshot-plugin.ts` (server side), `tooling/test-utils/src/a11y.ts` (browser side), `tooling/test-utils/src/engine-known-failures.ts`, `tooling/test-utils/src/index.ts`
- Modify: `pnpm-workspace.yaml` (`tooling/*`), `packages/{core,shell}/web-test-runner.config.js`, `packages/{core,shell}/package.json`, `packages/core/src/switch/tulpar-switch.test.ts`
- Modify: `packages/{tokens,angular,vue}/package.json` (add `test:ci`, same as `test`)

**Interfaces:**
- Produces (server): `ariaSnapshotPlugin(): TestRunnerPlugin` — command `aria-snapshot` with payload `{ selector: string }`; uses the Playwright page of the session: `page.locator(selector).ariaSnapshot()` and returns the YAML string. Registered in both WTR configs.
- Produces (browser): `expectA11yNode(target: Element, expected: { role: string; name?: string | RegExp; states?: Partial<Record<"checked" | "expanded" | "invalid" | "required" | "disabled" | "selected", boolean | "mixed">> }): Promise<void>` — gives `target` a temporary `data-a11y-probe` id, calls the command, parses the first node, asserts role, name and states.
- Produces: `itUnlessEngine(id: string, title: string, fn: Mocha.Func): void` and `ENGINE_KNOWN_FAILURES: ReadonlyArray<{ id: string; engines: ("firefox" | "webkit")[]; test: string; reason: string; ownerPackage: "1.2" | "1.3" | "1.4" | "1.5" | "1.6" | "1.7" }>`; `id` is a retro finding ID or `ENG-<n>`.
- Produces scripts (core, shell): `test` (Chromium), `test:all-browsers` (Chromium + Firefox + WebKit), `test:ci` (all browsers; coverage collected in the Chromium run only).

- [x] **Step 1:** Upgrade `@web/test-runner` + `@web/test-runner-playwright` to 1.0.x, `@open-wc/testing` to 5.x; add `nodeResolve: { exportConditions: ["development"] }` to both WTR configs (needed by Task 7's dev warnings). Run `pnpm test` → baseline.
- [x] **Step 2: Write the failing example tests** in `tulpar-switch.test.ts`:

```ts
it("is exposed as a named switch", async () => {
  const el = await fixture(html`<tulpar-switch label="Wi-Fi"></tulpar-switch>`);
  await expectA11yNode(el, { role: "switch", name: "Wi-Fi", states: { checked: false } });
});
it("passes axe", async () => {
  const el = await fixture(html`<tulpar-switch label="Wi-Fi"></tulpar-switch>`);
  await expect(el).to.be.accessible();
});
```

- [x] **Step 3: Run** `pnpm --filter @tulpar-ui/core exec wtr --files src/switch/tulpar-switch.test.ts` → Expected: FAIL (`expectA11yNode` not found).
- [x] **Step 4:** Implement `tooling/test-utils` per the interfaces; add it as a devDependency of core and shell. Run Step 3 → PASS. (The retro found Switch correctly named, so this proves the helper, not a fix.)
- [x] **Step 5:** Add Firefox and WebKit launchers behind `test:all-browsers` / `test:ci`; copy core's coverage `include`/`exclude` to shell; set thresholds to the measured value where below 80% and record the numbers for Task 11.
- [x] **Step 6: Run** `pnpm exec playwright install firefox webkit`, then `test:all-browsers` for core and shell.
- [x] **Step 7:** For every failure decide: harness/timing → fix in the test or config; product bug → entry in `ENGINE_KNOWN_FAILURES` (retro ID if it matches, else `ENG-<n>`) and the test switches to `itUnlessEngine`. Stop and report if > 20 `ENG-*` entries.
- [x] **Step 8: Run** `test:ci` for core and shell → green in three engines; coverage report produced.
- [x] **Step 9:** Commit `test: wtr 1.0, chromium+firefox+webkit, aria-snapshot and axe helpers`.

### Task 6: Storybook 10 and Custom Elements Manifest

**Files:**
- Modify: `apps/docs/package.json` (Vite 8.3 here), `apps/docs/.storybook/main.ts`, `apps/docs/.storybook/preview.ts`, `packages/{core,shell}/package.json` (`build` gets the CEM step; `"customElements": "custom-elements.json"`; `files`)
- Create: `packages/{core,shell}/custom-elements-manifest.config.mjs`

**Interfaces:**
- Produces: `packages/{core,shell}/custom-elements.json` (generated at build, published, git-ignored).

- [x] **Step 1:** `npx storybook@latest upgrade` in `apps/docs`; accept automigrations; ensure `@storybook/addon-docs` is installed and listed (autodocs moved out of essentials in 9+); bump the docs Vite to 8.3.x.
- [x] **Step 2: Run** `pnpm --filter docs build-storybook` → success.
- [x] **Step 3:** Append `cem analyze --litelement` to core and shell `build` (config excludes `src/_internal/**`, `**/*.test.ts`); publish the manifest; in `preview.ts` import `setCustomElementsManifest` from `@storybook/web-components-vite` and pass the merged core + shell manifests.
- [x] **Step 4: Verify** — `pnpm build`; `node -e "const m=require('./packages/core/custom-elements.json');console.log(m.modules.flatMap(x=>x.declarations||[]).filter(d=>d.customElement).length)"` → 24; shell → 5. Storybook Button docs page → properties table lists `size`, `variant`, `disabled`.
- [x] **Step 5:** Commit `docs: storybook 10 + custom elements manifest for core and shell`.

### Task 7: Correct build outputs

**Files:**
- Create: `packages/angular/tsconfig.lib.prod.json`, `.changeset/phase1-1-build-outputs.md` (patch: tokens, core, shell, angular, vue)
- Modify: `packages/angular/{package.json,ng-package.json}`, `packages/core/src/_internal/warn-dev.ts`, `packages/core/package.json` (dep `esm-env`), every `packages/*/package.json` (hygiene), `packages/*/tsconfig.json` (`declarationMap`), `scripts/check-dist.mjs`

**Interfaces:**
- Consumes: `pnpm check:dist` (Task 3).
- Produces: `warnDev(message: string, ...args: unknown[]): void` — unchanged signature; gate `import { DEV } from "esm-env"`.

- [x] **Step 1:** Extend `check-dist.mjs`: fail when `packages/angular/dist/fesm2022/*.mjs` contains `ɵɵdefineComponent` or lacks `ɵɵngDeclareComponent`. Run → FAIL.
- [x] **Step 2:** `tsconfig.lib.prod.json` with `angularCompilerOptions.compilationMode: "partial"`; `build` uses it, `dev` stays full. Make the source `package.json` APF-minimal (no `main/module/types/exports`) and add `"publishConfig": { "directory": "dist", "linkDirectory": true }` so workspace consumers resolve `dist` (dist is built before the playground starts — see Task 9 Step 5). Run `pnpm --filter @tulpar-ui/angular build && pnpm check:dist` → PASS; no "types condition would be overridden" warning; `pnpm --filter playground-ng build` → success.
- [x] **Step 3:** Rewrite `warn-dev.ts` with `esm-env` `DEV`; its tests stay green (WTR has the `development` condition from Task 5).
- [x] **Step 4: Verify** — in **both** playgrounds add, in a dev-only probe, `<tulpar-tooltip for="does-not-exist">` (unresolved `for` triggers `warnDev`): dev server → console warning appears; production build → `grep -r "<the warning text>" apps/playground-*/dist` finds nothing. Remove the probe.
- [x] **Step 5:** Manifest hygiene in every published package: `workspace:^`; `sideEffects` (`false` for vue; `["**/*.css"]` for tokens; for core/shell list `./dist/index.js`, `./dist/*/index.js` and the hashed element chunks `./dist/tulpar-*.js`); drop the `vue-router` peer and external; `@tulpar-ui/tokens` as a `dependency` of core, shell, angular and vue; `"./package.json": "./package.json"` export; `declarationMap: false` for publish builds.
- [x] **Step 6: Tarball smoke test (outside the workspace)** — `pnpm -r --filter "./packages/*" pack --pack-destination "$TMP/tulpar-smoke/tarballs"`; create a minimal Vite app in `$TMP/tulpar-smoke/app` whose `package.json` uses `pnpm.overrides` mapping every `@tulpar-ui/*` to `file:../tarballs/<name>.tgz`; install with `--ignore-workspace`; import `@tulpar-ui/tokens/css/tulpar.css`, `@tulpar-ui/core/button`, `@tulpar-ui/core/select`, `@tulpar-ui/shell/shell`; `vite build && vite preview`; with `playwright-cli` assert the button renders styled, `globalThis.litHtmlVersions.length === 1`, and `customElements.get(...)` is defined for `tulpar-button`, `tulpar-select`, `tulpar-option`, `tulpar-shell`, `tulpar-sidenav`, `tulpar-nav-item`. Review every `npm pack --dry-run` file list. Nothing from `$TMP` is committed.
- [x] **Step 7:** Add the patch changeset; commit `build: angular partial + APF, esm-env dev warnings, manifest hygiene`.

### Task 8: Type-check gate

**Files:**
- Modify: `packages/{tokens,core,shell,angular,vue}/package.json` (`typecheck`), root `package.json`, source files only for type-only fixes

**Interfaces:**
- Produces: `pnpm typecheck` — `tsc -b --noEmit` (tokens, core, shell incl. test tsconfigs), `tsc -p tsconfig.lib.prod.json --noEmit` for angular, `vue-tsc --noEmit` for vue and playground-vue. Requires built `dist` of core/shell (run after `pnpm build`).

- [x] **Step 1:** Add scripts; **run** `pnpm build && pnpm typecheck` → record error counts per package.
- [x] **Step 2:** Fix type-only errors; for errors that need a behaviour change add `// @ts-expect-error <finding ID or ENG-n> — fixed in <package>`.
- [x] **Step 3: Run** `pnpm typecheck` → exit 0; `pnpm test` → baseline.
- [x] **Step 4:** Commit `chore: typecheck gate for all packages`.

### Task 9: pnpm 12, catalog strict, explicit scripts, framework bumps

**Files:**
- Modify: root `package.json` (`packageManager`, `engines`, `scripts`), `.npmrc`, `pnpm-workspace.yaml`, every `package.json` with a shared dep, `apps/docs/package.json` (`predev` → explicit), `apps/playground-{ng,vue}` (Angular 22.2.x, Vue 3.5.45+, current official Lucide packages)

- [x] **Step 1:** Set `"packageManager": "pnpm@12.<x>.<y>"` (current 12.x) by hand; install pnpm 12 globally (`npm i -g pnpm@12`); move settings from `.npmrc` to `pnpm-workspace.yaml`; set `allowBuilds` for packages that need install scripts (esbuild, playwright, others reported by `pnpm install`).
- [x] **Step 2:** Upgrade `@changesets/cli` to 3.x (`pnpm changeset status` still lists the pending changesets). Move every dependency used by more than one package into the catalog (`catalog:`); enable `catalogMode: strict`. **Run** `pnpm install` → success; `pnpm why vite`, `pnpm why vitest`, `pnpm why happy-dom`, `pnpm why typescript` each show one version.
- [x] **Step 3:** Replace **every** `pre*` hook with explicit scripts: root `dev`, `dev:ng`, `dev:vue`, `dev:storybook` start with `pnpm build &&`; tokens `build` runs `build:fallbacks` explicitly; core/shell already explicit (Task 1); docs `dev`/`storybook` call the tokens build explicitly. Remove `enable-pre-post-scripts` from `.npmrc`. Set `engines.node` to `>=26`.
- [x] **Step 4:** Bump Angular to 22.2.x and Vue to 3.5.45+; replace `lucide-angular` / `lucide-vue-next` with the current official Lucide packages, same icons in both playgrounds (parity). **Run** `pnpm audit --prod --audit-level high` → exit 0 (an advisory without a fix goes to `audit.ignoreGhsas` with a reason and review date).
- [ ] **Step 5: Verify the dev loop** — delete every `packages/*/dist`, run `pnpm dev:vue` → packages build first, playground serves on 5273 with no resolution errors; same for `pnpm dev:ng` (4310) and `pnpm dev:storybook` (6006). Confirm Select, Toast and rail mode render in both playgrounds. _(Not done as written: live `dev:vue` check done; `dev:ng` and `dev:storybook` verified via production builds only. Live check pending with owner.)_
- [x] **Step 6:** Commit `chore: pnpm 12, strict catalog, explicit dev scripts, angular 22.2 / vue 3.5.45 / lucide`.

### Task 10: CI as a gate

**Files:**
- Modify: `.github/workflows/{ci,deploy,release}.yml`

- [x] **Step 1:** `ci.yml`: top-level `permissions: contents: read`; triggers `pull_request`, `push` on `main` and `phase*/**`; cache `~/.cache/ms-playwright` keyed on the Playwright version; `playwright install --with-deps chromium firefox webkit`; steps: install → lint → `check:suppressions` → `lint:probe` → format:check → sync-exports:check (core, shell) → build → typecheck → check:dist → `pnpm -r --filter "./packages/*" run test:ci` → build apps (`playground-ng`, `playground-vue`, docs) → `pnpm audit --prod --audit-level high` → changeset status (informational).
- [x] **Step 2:** `deploy.yml`: `on: workflow_run: { workflows: [CI], types: [completed], branches: [main] }` + `workflow_dispatch`; job `if: github.event_name == 'workflow_dispatch' || (github.event.workflow_run.conclusion == 'success' && github.event.workflow_run.event == 'push')`; checkout `ref: ${{ github.event.workflow_run.head_sha || github.sha }}`.
- [x] **Step 3:** `release.yml`: `on: workflow_dispatch` only; job `if: github.ref == 'refs/heads/main'`; comment that phase 1.8 restores the CI-gated trigger with OIDC.
- [x] **Step 4:** Push the branch → CI runs on `phase1/1.1-infra`; fix until green in all three engines. _(Done by the controller after owner approval; CI run 43159150351 on 27ecb36 is green in all three engines.)_
- [x] **Step 5:** Commit `ci: typecheck, three engines, app builds, audit; deploy after CI; manual release`.

### Task 11: Acceptance and close-out

**Files:**
- Modify: `CLAUDE.md` (Tech Stack, Commands), this plan (ticks), the spec (status → Implemented + close-out block)

- [x] **Step 1:** Run every item of the spec's §6 Acceptance; record command + outcome in the spec's close-out block, plus Task 0's before/after `pnpm outdated` and audit.
- [x] **Step 2:** In the close-out list every `ENG-*` entry, every suppressed ESLint rule with count, every `@ts-expect-error`, measured coverage — each with its owning package.
- [x] **Step 3:** Update CLAUDE.md: tool versions, new scripts (`typecheck`, `test:all-browsers`, `test:ci`, `check:dist`, `lint:probe`, `check:suppressions`), explicit dev scripts, "release is manual until 1.8", dev warnings follow Lit's convention.
- [x] **Step 4:** Commit `docs: close out phase 1.1`. Report "branch ready for review".
