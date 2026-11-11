# 01 — INFRA review (monorepo, build, packaging, CI/CD, release, deps, test infra)

## Area summary

The monorepo foundation is good: pnpm workspaces, Changesets, a PR CI, Cloudflare deploys, per-component subpath exports for core and shell, and a real-browser test runner (WTR) for core. Lit's TypeScript settings are correct.

The **published artifacts** are the weak part. Four confirmed problems ship (or would ship) broken output to npm:
- `@tulpar-ui/angular` is published in **full** Ivy compilation mode, which Angular forbids for npm.
- `@tulpar-ui/shell` bundles a **second private copy of lit-html**. This is the real root cause of the "Lit directive cross-instance crash".
- The Angular wrapper **statically imports the "optional" `@angular/router`**.
- Dev warnings in core are **compiled away at library build time**.

The toolchain has drifted across three majors (vite 5 and 8, vitest 1 and 3, typescript-eslint 7 on ESLint 9 and TS 6, which is unsupported). The catalog covers only 2 packages. K5 has a concrete root cause in Vitest 1.6. The release flow uses a long-lived token without provenance and is not gated by CI.

**Verdict: Needs work.** The source structure is solid. Packaging and release correctness must be fixed before the next npm publish (0.7.0).

## Findings table

| ID | Title | Severity | Merge-blocking | Confidence |
|---|---|---|---|---|
| INF-1 | `@tulpar-ui/angular` built and published in FULL Ivy compilation mode | Blocker | No (blocks next release) | Verified |
| INF-2 | `@tulpar-ui/shell` dist bundles a private lit-html copy (root cause of the "directive cross-instance crash") | Blocker | No (blocks next release) | Verified |
| INF-3 | Angular wrapper statically imports "optional" peer `@angular/router` | Major | No | Verified |
| INF-4 | Angular publishes from the package root with hand-written exports; ng-packagr's dist/package.json is corrupted (the "types condition overridden" warning) | Major | No | Verified |
| INF-5 | `warnDev` is permanently disabled in the published core (`import.meta.env` inlined as PROD at lib build) | Major | No | Verified |
| INF-6 | Wrappers are a single entry that side-effect-imports every core component, so there is no tree-shaking | Major | No | Verified |
| INF-7 | No Custom Elements Manifest (`custom-elements.json`) | Major | No | Verified |
| INF-8 | Release pipeline: long-lived NPM_TOKEN, no provenance, no `repository` field, publish not gated by CI | Major | No | Verified |
| INF-9 | Toolchain version drift and unsupported combos; catalog covers only 2 deps (includes K7) | Major | No | Verified |
| INF-10 | K5 root cause: Vitest 1.6 fs-cache `writeFile` into `%TEMP%\<id>\web\<sha1>` on Windows | Minor | No | Plausible (strong) |
| INF-11 | WTR coverage thresholds are dead config (never run with `--coverage`) | Minor | No | Verified |
| INF-12 | Browser matrix is Chromium-only; no automated axe checks; no visual regression | Major | No | Verified |
| INF-13 | Lint guardrails have holes: primitive-token rule bypassed in component `.ts`; `_internal` rule bypassable by relative paths; `.vue` and Lit templates unlinted | Minor | No | Verified |
| INF-14 | No `.gitattributes`; `core.autocrlf=true` plus an unconditional `sync-exports` rewrite cause the CRLF noise | Minor | No | Verified |
| INF-15 | No typecheck gate in CI for tokens/core/shell/vue | Minor | No | Verified |
| INF-16 | Deployed playgrounds run vulnerable Angular 22.0.0 / Vue / postcss / nanoid; no Dependabot/Renovate | Major | No | Verified |
| INF-17 | Manifest hygiene: `workspace:*` exact pins, missing `sideEffects`, unneeded `vue-router` peer, tokens dependency inconsistent, broken `.d.ts.map` | Minor | No | Verified |
| INF-18 | CI workflow hardening: no `permissions`, tag-pinned actions, apps/Storybook not built on PR | Minor | No | Verified |
| INF-19 | Changesets: 0.7.0 bundles 9 milestones; milestone names (v0.15) diverge from npm semver; Version PR stale since 24 Jun (adds to K4) | Info | No | Verified |
| INF-20 | Repo hygiene: tracked junk (`.claire/worktrees`, UTF-16 `build-output.txt`), `graphify-out` only locally excluded, 31 commits titled "." | Minor | No | Verified |
| INF-21 | pnpm 9.15.9 is the final 9.x; `engines.node >=26.13.0` is stricter than the dev machine (26.3) | Minor | No | Verified |

---

### INF-1: `@tulpar-ui/angular` built and published in FULL Ivy compilation mode
- Severity: Blocker
- Merge-blocking for current branches: No (it blocks the next publish)
- Confidence: Verified
- Where: `packages/angular/tsconfig.json` (no `compilationMode`); `packages/angular/package.json` build script; the published tarball `@tulpar-ui/angular@0.6.0`.
- Problem: ng-packagr runs with the default (full) compilation mode. The output contains `ɵɵdefineComponent` (25 hits) and no `ɵɵngDeclareComponent` (0 hits). ng-packagr itself writes a guard into `dist/package.json`: `"prepublishOnly": "...compiled in full compilation mode. This is not allowed..."`. The guard does not fire, because Changesets publishes the package root, not `dist/` (see INF-4).
- Evidence: `grep -c ɵɵngDeclareComponent dist/fesm2022/*.mjs` returns 0, and `ɵɵdefineComponent` returns 25. I downloaded `npm pack @tulpar-ui/angular@0.6.0` into `review/npmpack/`. The published fesm also contains 0 `ngDeclareComponent`. **The package already on npm is full-compiled.**
- Why it matters: full-Ivy instructions are private API and change between Angular **patch** releases. A consumer on Angular 22.x ≠ the build version can get runtime errors. Consumers' Angular linker cannot process the package.
- Correct solution: build with partial compilation as Angular documents. Quote: "If you intend to publish your library to npm, compile with partial-Ivy code by setting `"compilationMode": "partial"`" (https://angular.dev/tools/libraries/creating-libraries). Add `tsconfig.lib.prod.json` with `angularCompilerOptions.compilationMode: "partial"` and use it in `build`. Keep full mode only for `dev`. Deprecate 0.6.0 on npm after 0.7.0 ships.
- Effort: S

### INF-2: `@tulpar-ui/shell` dist bundles a private lit-html copy
- Severity: Blocker
- Merge-blocking for current branches: No (blocks next release)
- Confidence: Verified
- Where: `packages/shell/vite.config.ts` and `packages/core/vite.config.ts` (`rollupOptions.external: ["lit", "lit/decorators.js"]`); `packages/shell/src/nav-item/tulpar-nav-item.ts` imports `lit/directives/unsafe-svg.js`.
- Problem: `external` is an exact-string list. Any other Lit subpath is **inlined**, and lit-html internals come with it. `shell/dist/tulpar-nav-item-*.js` (1069 lines) contains a full lit-html runtime (template parser, ChildPart, directive classes). Line 251 holds `(H.litHtmlVersions ??= []).push("3.3.3")`. Every consumer of `@tulpar-ui/shell` therefore loads **two lit-html instances**.
- Evidence: in `shell/dist/tulpar-nav-item-D8Oe8KBC.js`, lines 8, 30, 209-268 and 251 (`litHtmlVersions.push`). The only bare imports in the dist are `lit` and `lit/decorators.js`. The memory note `reference_lit_directive_dual_instance_crash.md` records `litHtmlVersions === ["3.3.3","3.3.3"]`. That was blamed on consumer pre-bundling, and the fixes were "avoid directives" plus `prebundle:false`/`resolve.dedupe` in the playgrounds. **This was diagnosed as a consumer-bundler problem; the actual cause is our own library build.** The workaround ("never use `styleMap`/`unsafeSVG`") also made it into component code (comments in `tulpar-select` and `toast-service`).
- Why it matters: every real consumer app gets the dual instance, extra kilobytes and directive crashes. The workarounds put a permanent design constraint ("no Lit directives") on all future components.
- Correct solution: externalize **every** dependency and peer dependency by pattern, never by exact string. Use `external: [/^lit($|\/)/, /^@lit\//, /^lit-html($|\/)/, /^lit-element($|\/)/, /^@tulpar-ui\//]`. Better, derive the list from `package.json` `dependencies` + `peerDependencies`, as `rollup-plugin-node-externals` and Vite library guides do. Add a CI check that asserts `litHtmlVersions` does not appear in any `dist/**/*.js`. After the fix, remove the playground `prebundle:false`/dedupe hacks, then re-evaluate whether the "no directives" rule is still needed (it should not be).
- Effort: S

### INF-3: Angular wrapper statically imports the "optional" `@angular/router`
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/angular/src/shell/tulpar-shell.component.ts:13`; `packages/angular/package.json` `peerDependenciesMeta["@angular/router"].optional: true`.
- Problem: the source has `import { NavigationEnd, Router } from "@angular/router"` at top level. The single FESM (`dist/fesm2022/tulpar-ui-angular.mjs`, line 9) therefore imports the router for **every** consumer. `inject(Router, { optional: true })` only makes the *provider* optional, not the *module*. A router-less app that imports `TulparButtonComponent` fails to resolve `@angular/router`. The Vue wrapper solves the same problem correctly with a structural `RouterLike` and no import (`TulparShell.vue:7-56`).
- Evidence: the dist import list (command output in this review) contains `import { Router, NavigationEnd } from '@angular/router';`.
- Why it matters: the peer metadata promises something the code does not deliver.
- Correct solution: move router integration into a **secondary entry point** (`@tulpar-ui/angular/router`, ng-packagr secondary entry). It can provide a `withTulparRouter()` or a `TulparRouterLink` directive, which is the Angular Material/CDK pattern. Alternatively, make `@angular/router` a required peer. The secondary entry point is the correct answer and is also needed for INF-6.
- Effort: M

### INF-4: Angular publishes from the package root with hand-written exports; ng-packagr's `dist/package.json` is corrupted
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/angular/package.json` (`main/module/types/exports` → `./dist/...`); `packages/angular/dist/package.json`.
- Problem: ng-packagr is designed to generate the publishable `package.json` in `dest` and to be published **from `dist/`**. Here the root package.json carries its own `exports`. ng-packagr merges them and produces `".": { "import": "./dist/fesm2022/...", "types": "./types/...", "default": "./fesm2022/..." }`. That output has mixed path bases, `types` after `import`, and `"main": "./dist/fesm2022"` relative to `dist`. This is exactly the "types condition would be overridden" warning. The root package.json is what gets published, so the ng-packagr metadata is lost: `sideEffects: false`, the `tslib` dependency, the `./package.json` export and the partial-compilation guard.
- Evidence: `packages/angular/dist/package.json` (quoted above); the published tarball's `package.json` has no `sideEffects` and no `typings`.
- Why it matters: this hides INF-1 and causes the warning. Consumers' tooling sees a non-standard Angular package format (APF).
- Correct solution: follow the Angular Package Format. Keep the source `package.json` minimal (name, version, peers, deps; **no** main/module/types/exports). Let ng-packagr write `dist/package.json`. Publish `dist` with `"publishConfig": { "directory": "dist" }`, which pnpm/changesets honour. Reference: https://angular.dev/tools/libraries/angular-package-format.
- Effort: S

### INF-5: `warnDev` is permanently disabled in the published core
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/core/src/_internal/warn-dev.ts`; `packages/core/dist/warn-dev-BUb2H4m0.js`.
- Problem: Vite library mode statically replaces `import.meta.env` with the **library's** build env. The dist contains `const c = { DEV: !1, PROD: !0 }`, so `isProd` is always true and no warning is ever printed in a consumer app. The source comment ("tree-shaken by the consumer's bundler") describes the intent; the build produces the opposite.
- Evidence: the dist file content quoted above.
- Why it matters: every dev-time API misuse warning (invalid prop combos and similar) is silent for all users.
- Correct solution: use export conditions, as Lit itself does. Ship a `development` build alongside the default build (`"exports": { "./x": { "types", "development": "./dist/dev/x.js", "default": "./dist/x.js" } }`). Alternatively, depend on the `esm-env` package (`import { DEV } from "esm-env"`), which resolves through `development`/`production` conditions in the consumer's bundler and is the Svelte/Vite-ecosystem standard. Either way, never read `import.meta.env` in library source.
- Interim: read only `globalThis.process?.env?.NODE_ENV !== "production"`, because consumer bundlers replace that expression.
- Effort: S (interim) / M (dual build)

### INF-6: Wrappers are a single entry that side-effect-imports every core component
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/vue/vite.config.ts` (single `src/index.ts` entry); `packages/angular/ng-package.json` (single entry); dist import lists of both wrappers.
- Problem: `@tulpar-ui/vue/dist/index.js` and the Angular FESM start with 20+ bare `import "@tulpar-ui/core/<x>"` statements. Bare imports are side effects, so no bundler can drop them. An app that uses only `TulparButton` ships and registers every component (select, toast, popover, shell...). Core's per-component subpath exports are wasted.
- Evidence: the `grep ^import` output for both dists in this review.
- Why it matters: bundle size grows linearly with the library. That is unacceptable for the planned Grid/Gantt scale.
- Correct solution:
  - Angular: one **ng-packagr secondary entry point per component** (`@tulpar-ui/angular/button`), the Angular Material model. It can be combined with INF-3.
  - Vue: a multi-entry build (`preserveModules` or one entry per component) with per-component subpath exports, plus `"sideEffects": false` on the Vue package.
  - Core: declare which files really have side effects (`"sideEffects": ["./dist/*/index.js", "./dist/tulpar-*.js"]`), so pure helpers can be tree-shaken while registrations are kept.
  - Keep the root barrel for convenience.
- Effort: L

### INF-7: No Custom Elements Manifest
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: whole repo (`git ls-files | grep custom-elements` returns nothing); `apps/docs/.storybook/` has no `setCustomElementsManifest`, but `main.ts` uses `docs: { autodocs: "tag" }`.
- Problem: there is no `custom-elements.json` and no `"customElements"` field in `packages/core/package.json` or `packages/shell/package.json`.
- Why it matters: CEM is the de-facto standard metadata for WC libraries (Shoelace/Web Awesome, Spectrum WC, Material Web, FAST). It drives:
  - Storybook web-components autodocs: the args table and controls stay empty without it.
  - VS Code custom-data and JetBrains web-types: HTML IntelliSense.
  - Framework-wrapper and JSX-types generation.
  - Doc sites and API linting.

  Hand-maintaining two wrappers without it means prop drift is caught only by review. For a library that may become commercial, this metadata is basic product hygiene.
- Correct solution: add `@custom-elements-manifest/analyzer` (0.11.0) with `--litelement` to the core and shell builds. Publish the manifest and set `"customElements": "custom-elements.json"`. Wire `setCustomElementsManifest()` in `.storybook/preview.ts`. Later, generate VS Code/JetBrains data (`custom-element-vs-code-integration`, `custom-element-jet-brains-integration`). Add a CI check that each wrapper's inputs/props are a subset of the manifest's attributes (this catches wrapper drift). Reference: https://custom-elements-manifest.open-wc.org/.
- Effort: M

### INF-8: Release pipeline is token-based, unprovenanced, ungated
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `.github/workflows/release.yml`; all `packages/*/package.json` (no `repository`).
- Problem:
  1. The workflow uses a long-lived `NPM_TOKEN` written into `~/.npmrc`. `id-token: write` is granted but unused, so there is no provenance (`npm view @tulpar-ui/core dist.attestations` returns nothing).
  2. No package has `repository`/`homepage`/`bugs`. Trusted publishing **requires** `repository.url` to exactly match the GitHub repo.
  3. `release.yml` triggers on every push to `main` and runs `pnpm build && changeset publish` **without lint/test**. It runs in parallel with `ci.yml`, so a red main can publish.
  4. The workflow-level `permissions` include `contents: write` + `pull-requests: write` + `id-token: write` for the whole job.
- Evidence: the files themselves.
- Why it matters: supply-chain trust (npm's 2025 token hardening pushes everyone to OIDC), and a broken publish cannot be undone.
- Correct solution:
  - Use npm **Trusted Publishing (OIDC)**. Configure the trusted publisher on npmjs.com for each `@tulpar-ui/*` package and remove `NPM_TOKEN`. Provenance is then automatic. Requirements: npm CLI ≥ 11.5.1 and Node ≥ 22.14 (https://docs.npmjs.com/trusted-publishers). pnpm needs ≥ 10.x for OIDC, which links to INF-21.
  - Add `repository: { type: "git", url: "git+https://github.com/KaanAkcan1/tulpar-ui.git", directory: "packages/<x>" }`.
  - Gate publishing on CI: run the release job with `on: workflow_run: workflows: [CI], types: [completed], branches: [main]` + `if: conclusion == 'success'`, or merge release into ci.yml as a job with `needs: verify`.
- Effort: S-M

### INF-9: Toolchain drift and unsupported combinations; the catalog covers only 2 deps
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `pnpm-workspace.yaml` (catalog: only `lit`, `vite-plugin-dts`); package manifests; `pnpm outdated -r` output saved at `review/infra-outdated.txt`.
- Problem (installed versions):
  - **vite**: 5.4.21 (tokens, core, shell, vue, docs) and 8.0.16 (angular, playground-vue). That is 3 majors apart in one repo.
  - **vitest**: 1.6.1 (tokens, vue) and 3.2.6 (angular); latest is 5.1.0. `@angular/build@22` wants `^4.0.8` (K7).
  - **happy-dom**: 14.12.3 (vue) and 20.10.2 (angular).
  - **@typescript-eslint 7.18** has peer `eslint: ^8.56.0` (`npm view` output). It runs on **ESLint 9.39** and **TypeScript 6.0.3** (7.x supports TS < 5.6). The combination is outside the support matrix; it works by luck. The current line is typescript-eslint 8.72 (peer `eslint ^8.57||^9||^10`, `typescript <6.1`).
  - **vite-plugin-dts** 3.9 (latest 5.x); **@vitejs/plugin-vue** 5 in the package and 6 in the playground; **vue-tsc** 2 and 3.
  - **Storybook** 8.6 (latest 10.6). `@storybook/addon-essentials` is gone in 9+.
  - **@web/test-runner** 0.20 → 1.0; **@open-wc/testing** 4 → 5; **@changesets/cli** 2 → 3.
- Why it matters: two vites mean two transform pipelines (playground vs library). Unsupported lint combos can silently skip rules. Every upgrade gets harder the longer the drift lasts.
- Correct solution:
  - Move **every** shared devDependency into the pnpm catalog (vite, vitest, happy-dom, typescript, tsx, @web/*, @open-wc/testing, playwright, vue, vue-tsc, @vitejs/plugin-vue, @angular/*). Enable `catalogMode: strict` (pnpm ≥ 10.12) so non-catalog versions are rejected.
  - Upgrade in this order: (1) typescript-eslint 8 via the `typescript-eslint` meta-package and `tseslint.config()`; (2) vite 8 + vite-plugin-dts 4/5 everywhere; (3) vitest 4+ everywhere, which also fixes K7 and K5; (4) Storybook 9→10 with its automigrate (`npx storybook@latest upgrade`); (5) WTR 1.0.
  - Add Renovate with grouped presets (see INF-16).
- Effort: M-L (stepwise)

### INF-10: K5 root cause — Vitest 1.6 fs-cache writes on Windows
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Plausible (strong; code path read, not reproduced)
- Where: `node_modules/.pnpm/vitest@1.6.1…/vitest/dist/vendor/cli-api.OdDWuB7Y.js:7945-7957` and `:10479`.
- Problem: in the forks pool, Vitest 1.6 writes every transformed module to `join(os.tmpdir(), nanoid(), transformMode, sha1(id))` with a plain `writeFile` and **no** atomic rename. `transformMode` is `web` for happy-dom projects, and `tmpDir` is under `%TEMP%`. That matches the error path exactly: `…\Temp\…\web\<hash>`. When a module is re-fetched while a worker or Windows Defender still holds the file open, `open` fails with `UNKNOWN`/`EBUSY`. The failure is more likely under `pnpm -r run test`, where several Vitest processes and WTR run concurrently. `@tulpar-ui/vue` is the only package on Vitest 1.6 **with happy-dom** (the `web` mode). Tokens runs in node env, so its path would be `ssr`. **K5 therefore originates in `@tulpar-ui/vue`.** Vitest 3.2.6 (angular) already changed this code to `atomicWriteFile` with a fallback (`coverage.DfSpMS-b.js:2554`). Vitest 4 dropped vite-node for Vite's Module Runner, which removes this temp-file cache entirely.
- Evidence: the code excerpts above.
- Why it matters: flaky full-suite runs train people to ignore red results.
- Correct solution: upgrade `@tulpar-ui/vue` (and tokens) to the catalog Vitest ≥ 4, as in INF-9. Verify with 10 consecutive `pnpm test` runs on Windows.
- Interim: `test.pool = "threads"` in `packages/vue/vite.config.ts`, or run the test step with `--workspace-concurrency=1`.
- Effort: S (with INF-9)

### INF-11: WTR coverage thresholds are dead config
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/core/web-test-runner.config.js` and `packages/shell/web-test-runner.config.js` (`coverageConfig.threshold` 80%); `"test": "wtr"` in both package.json files; `ci.yml`.
- Problem: WTR collects coverage and enforces thresholds only with `--coverage` (or `coverage: true`), and neither is set. Shell's config also lacks the `include`/`exclude` that core has, so enabling it would measure Lit itself. The Vitest wrappers have no coverage config at all.
- Correct solution: add `coverage: true` in CI (`wtr --coverage`). Copy core's `include`/`exclude` to shell. Upload lcov as a CI artifact or to Codecov. Keep the 80% thresholds once they are measured.
- Effort: S

### INF-12: Chromium-only browser matrix; no automated axe; no visual regression
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: both WTR configs (`browsers: [playwrightLauncher({ product: "chromium" })]`); `ci.yml` installs only chromium; `grep "to.be.accessible"` across `packages/*/src` returns 0.
- Problem: the components depend on browser-divergent platform features: the Popover API top layer, `ElementInternals`/form association, `:focus-visible`, `delegatesFocus`, and `aria-activedescendant` in shadow roots. None of this is tested in Firefox or WebKit. The changesets advertise "full WCAG-2.2 a11y contract", but there is no automated axe assertion, although `@open-wc/testing` already ships `expect(el).to.be.accessible()` (chai-a11y-axe). There is no screenshot or visual regression for a design system with a 3-layer theme and a dark mode.
- Why it matters: a WC library is consumed in all engines. Safari bugs surface at customers first.
- Correct solution:
  1. In CI, add `playwrightLauncher({ product: "firefox" })` and `({ product: "webkit" })`, as Shoelace and Spectrum WC do. Keep Chromium-only locally if speed matters.
  2. Add `await expect(el).to.be.accessible()` per component state (open-wc a11y docs).
  3. Add visual regression: either `@web/test-runner-visual-regression` in WTR or Playwright `toHaveScreenshot` over Storybook stories (light/dark). Chromatic is the hosted option. This is new test infrastructure; scheduling it is the owner's decision.
- Effort: M

### INF-13: Lint guardrails have holes
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `eslint.config.js`.
- Problem:
  - **Primitive-token rule** only covers `TemplateElement`s in `*.styles.ts`. `packages/core/src/button/tulpar-button.ts:67-70` (`"var(--tulpar-primitive-color-colpan-50)"`) and `packages/core/src/avatar/tulpar-avatar.ts:196-213` reference primitives directly, and lint stays green. Strings (`Literal`) and inline `css` in component `.ts` files are not checked. This may be a deliberate custom-tone escape; then it should be an explicit, commented `eslint-disable-next-line` with a reason, not a silent gap.
  - **`_internal` rule**: I probed it with `eslint --stdin`. `@tulpar-ui/core/_internal/x` is flagged. `../../../core/src/_internal/x` and `@tulpar-ui/core/src/_internal/x` are **not** flagged.
  - **Coverage**: only `**/*.{ts,tsx}`. All `.vue` wrappers are unlinted (no `eslint-plugin-vue`). Angular templates are unlinted (no `angular-eslint`). Lit templates have no `eslint-plugin-lit`/`eslint-plugin-wc`, the standard for Lit libraries (binding typos, `no-invalid-html`, attribute-value rules).
  - `lint-staged` runs only Prettier, not ESLint.
- Correct solution: extend `no-restricted-syntax` to `Literal` and `TemplateElement` in `packages/{core,shell}/src/**/*.ts` (excluding tokens). Add `group: ["**/_internal/**"]` for relative cross-package paths, or use `eslint-plugin-boundaries` / `import/no-relative-packages`. Add `eslint-plugin-vue` (flat `recommended`), `angular-eslint`, and `eslint-plugin-lit` + `eslint-plugin-wc`. Run `eslint --fix` in lint-staged.
- Effort: S-M

### INF-14: No `.gitattributes`; CRLF noise root cause
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: repo root (no `.gitattributes`); system git config `core.autocrlf=true`; `packages/{core,shell}/build/sync-exports.ts`.
- Problem: on checkout, `autocrlf=true` turns LF into CRLF in the working tree. `git ls-files --eol` shows `packages/core/src/index.ts` as `i/lf w/crlf`. `prebuild` runs `sync-exports.ts`, which **unconditionally** `writeFileSync`s `package.json` with `\n`, even when exports did not change. After every build, `package.json` is LF (`i/lf w/lf`) while other files are CRLF. That causes the "package.json changed" noise, and Prettier (`endOfLine: "lf"`) flags every CRLF file in `format:check` (the "pre-existing CRLF noise" in memory).
- Correct solution: commit a `.gitattributes` with `* text=auto eol=lf` (plus `*.png binary` etc.). Run `git add --renormalize .` once. Make `sync-exports` write only when `next !== current`, which also stops needless mtime churn in watch mode. The two copies of the script are 95% identical; move the script to a root `scripts/` folder with a package-path arg.
- Effort: S

### INF-15: No typecheck gate in CI for tokens/core/shell/vue
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: no `typecheck`/`tsc` script in any package; `ci.yml`.
- Problem: Vite (esbuild) strips types. `vite-plugin-dts` logs diagnostics but does not fail the build. WTR's esbuild plugin does not typecheck. Only the Angular package (ng-packagr) and playground-vue (`vue-tsc -b`, deploy only) typecheck. Today `tsc --noEmit` on core and shell and `vue-tsc --noEmit` on vue are clean (I ran them), but nothing keeps them clean.
- Correct solution: add a `typecheck` script per package (`tsc -b --noEmit`; `vue-tsc --noEmit` for vue; test tsconfigs included) and a CI step. Use `tsc -b` with project references, which already exist (`composite`, `references`).
- Effort: S

### INF-16: Deployed playgrounds run vulnerable framework versions; no automated dependency updates
- Severity: Major
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `pnpm audit --prod` (saved at `review/infra-audit-prod.json`): 20 advisories (15 high, 5 moderate), all under `apps/playground-ng` and `apps/playground-vue`. Examples:
  - `@angular/core|common|compiler 22.0.0`: GHSA-rgjc-h3x7-9mwg, GHSA-jj27-h5hq-8x99, GHSA-48r7-hpm6-gfxm, GHSA-hh8m-fm6v-7cvg.
  - `@angular/router <22.2.1`: GHSA-62vg-58rm-qff7.
  - `@vue/server-renderer <3.5.42`: GHSA-g2v6-rqmx-r4w6.
  - `postcss`, `nanoid`, `source-map-js`, `zod`.

  The full (dev-inclusive) audit reports 228 (13 critical). There is no `.github/dependabot.yml` or `renovate.json`. `lucide-angular` and `lucide-vue-next` 1.0.0 are **deprecated**.
- Why it matters: these playgrounds are public (`*.pages.dev`) and built from these versions. The published packages themselves only depend on `lit`, so npm users are not affected.
- Correct solution: bump Angular to 22.2.x and Vue to 3.5.45 now. Add Renovate (`config:recommended`, group `angular`/`vue`/`storybook`/`vitest`, `rangeStrategy: bump`, weekly lockfile maintenance) or Dependabot with groups. Add `pnpm audit --prod --audit-level high` as a CI step. Replace the deprecated lucide packages with `@lucide/angular` / `@lucide/vue` (check the current names).
- Effort: S (bump) + S (Renovate)

### INF-17: Manifest hygiene
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `packages/*/package.json`.
- Problem:
  1. `workspace:*` publishes **exact** pins. The published angular 0.6.0 depends on `"@tulpar-ui/core": "0.6.0"`. If an app installs `@tulpar-ui/core@0.7.1` alongside, it gets two core copies. Core's `customElements.get` guard then silently keeps whichever loads first, so the result is version skew without an error.
  2. No `sideEffects` field in core, shell, tokens or vue (see INF-6). For tokens it should be `["**/*.css"]`.
  3. `@tulpar-ui/vue` declares `vue-router` as an optional peer (and externalizes it), but the code **never imports it** (`TulparShell.vue` uses a structural `RouterLike`). Its `^4.0.0` range would also warn on the current vue-router 5.5.
  4. The tokens dependency is inconsistent. Angular depends on `@tulpar-ui/tokens`; vue and shell do not, although their CSS needs the token CSS. Core lists tokens in both `dependencies` and `devDependencies`, and its runtime use (`FALLBACKS`) is inlined at build anyway.
  5. `declarationMap` publishes `.d.ts.map` pointing to `../../src/...`, which is not in `files`, so "Go to source definition" is broken for consumers.
  6. There is no `"./package.json"` export, and no `keywords`, `homepage` or `repository` (INF-8).
- Correct solution:
  1. Use `workspace:^`.
  2. Add correct `sideEffects` arrays.
  3. Drop the `vue-router` peer and the external entry.
  4. Make tokens an explicit `dependency` of every package whose CSS needs it, or document it as a required peer. One rule for all packages.
  5. Either include `src` in `files` (Lit's choice) or set `declarationMap: false` for publish.
  6. Add `"./package.json": "./package.json"`.

  Lit as a regular `dependency` with `^3` is correct (Lit's publishing guidance; Material Web and Spectrum WC do the same), and it does not need to become a peer once INF-2 is fixed.
- Effort: S

### INF-18: CI workflow hardening
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `.github/workflows/ci.yml`, `deploy.yml`.
- Problem:
  - `ci.yml` has no `permissions:` block, so it inherits the repo default (possibly write-all).
  - All actions are pinned by mutable tags (`@v4`, `@v1`, `@v3`), not commit SHAs.
  - Playwright browsers are not cached.
  - The playgrounds and Storybook are only built in `deploy.yml` **after** merge, so a wrapper change that breaks `playground-ng` compiles is discovered on main.
  - There are no PR preview deploys.
  - `deploy.yml` does not depend on CI success.
- Correct solution: add `permissions: contents: read` at the top of `ci.yml`. Pin third-party actions to SHAs with Renovate `helpers:pinGitHubActionDigests`, per GitHub's security hardening guide (https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-third-party-actions). Cache `~/.cache/ms-playwright` keyed on the playwright version. Add `pnpm --filter "./apps/*" build` (without Karma tests) to CI. Use `wrangler pages deploy --branch=${{ github.head_ref }}` for PR previews. Run deploy via `workflow_run` on CI success.
- Effort: S

### INF-19: Changesets/versioning process (adds to K4)
- Severity: Info
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: `.changeset/config.json` (`linked: [["@tulpar-ui/*"]]`); `origin/changeset-release/main` (commit da68758, 24 Jun 2026, not merged into origin/main).
- Problem: **Why npm is still 0.6.0:** `changesets/action` publishes only after the bot's "Version Packages" PR (`changeset-release/main`) is merged. That PR was never merged, and the owner works with a "no PRs, I merge" flow. The pending branch bumps all packages to **0.7.0**. That one version would contain v0.7 through v0.14 (and v0.15 after the next push), so 9 internal milestones collapse into one npm minor. Internal names ("v0.15") will never match npm versions. With `linked`, a package without a changeset (shell is missing from several) stays behind, while wrappers pin exact versions (INF-17).
- Correct solution: decide on one model. **Recommended:** switch to `fixed: [["@tulpar-ui/*"]]`, since the wrappers are lockstep with core. Release (merge the Version PR) at the end of each milestone, so the npm version tracks the milestone. Pre-1.0 semver with "minor = may break" is fine. Document it in `docs/` and run `changeset status` as a required check. If the owner does not want bot PRs, use `changeset version` locally plus a tag-triggered publish workflow instead of the action's PR mode.
- Effort: S

### INF-20: Repo hygiene
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: tracked files.
- Problem:
  - `.claire/worktrees/feat+v0.6-shell/packages/shell/src/{persist,topbar}/index.ts` are tracked. This is a typo'd worktree path, added in commit `05ddc41` (message ".").
  - `build-output.txt` is a tracked UTF-16 PowerShell log from 9 June (commit `3bebd83`, ".").
  - `graphify-out/` (root and `packages/graphify-out/`) is excluded only via the local `.git/info/exclude`, not `.gitignore`. Other clones will see it.
  - `.wrangler/` and `.playwright/` are not ignored. They are empty today.
  - 31 commits on the branch have the message ".".
  - The root README package table omits `@tulpar-ui/shell`.
- Correct solution: `git rm` the stray files. Add `graphify-out/`, `.wrangler/`, `.playwright/` and `*.log`/`build-output*.txt` to `.gitignore`. Add commitlint (Conventional Commits) to the husky `commit-msg` hook; most commits already follow `feat(...)`/`chore:`.
- Effort: S

### INF-21: Package manager and engines
- Severity: Minor
- Merge-blocking for current branches: No
- Confidence: Verified
- Where: root `package.json` (`"packageManager": "pnpm@9.15.9"`, `engines.node ">=26.13.0"`); `.npmrc`.
- Problem:
  - `npm view pnpm dist-tags`: `latest-9` is 9.15.9 (the final 9.x); `latest` is 12.18.0.
  - pnpm ≥ 10 brings defaults this repo needs: dependency lifecycle scripts blocked by default (`onlyBuiltDependencies`, a supply-chain control), `catalogMode: strict`, settings in `pnpm-workspace.yaml`, and OIDC trusted publishing (INF-8).
  - `.npmrc` `enable-pre-post-scripts` makes npm warn "Unknown project config … will stop working in the next major version of npm". The dev loop also relies on implicit `pre*` hooks, which are non-obvious.
  - `engines.node >=26.13.0` warns on the owner's own Node 26.3 machine (seen in every pnpm command here). Without `engine-strict` it is only noise.
- Correct solution: move to the current pnpm major via `corepack use pnpm@latest`. Move settings into `pnpm-workspace.yaml`, set `onlyBuiltDependencies: [esbuild, playwright, …]`, and turn the `pre*` hooks into explicit scripts (`"dev": "pnpm build && pnpm -r --parallel …"`). Set engines to the supported range (`">=22.12"` for contributors). Pin the exact version only in `.nvmrc`.
- Effort: S-M

---

## Things done well
- Lit TS config (`experimentalDecorators: true`, `useDefineForClassFields: false`) is **correct and current**. Lit still says: "We recommend that TypeScript developers use experimental decorators for now for optimal compiler output" (https://lit.dev/docs/components/decorators/). Standard decorators would need `accessor` on every field and produce larger output. **Keep it; no migration now.**
- Per-component subpath exports for core and shell, generated from `src/*/index.ts`, with a CI drift check (`sync-exports:check`).
- `customElements.get()` guards before every `define`.
- The Vue wrapper's optional router integration (structural `RouterLike`, no import) is a good pattern; Angular should copy it.
- The Vue build externalizes `@tulpar-ui/*` with a regex, with a comment explaining why. The same lesson simply was not applied to `lit` in core and shell (INF-2).
- Real-browser component tests (WTR + Playwright) with 1371 core tests; distinct WTR ports to avoid collisions.
- CI concurrency/cancel, frozen lockfile, `node-version-file: .nvmrc`, changeset status hint; deploy has least-privilege `permissions`.
- `_internal` layering rule exists and catches the package-specifier case.

## Open questions for the owner
1. **Release cadence model (INF-19):** release to npm per milestone (merge the bot PR each time, or do local `changeset version` + tag publish)? `fixed` or `linked`? Should 0.7.0 ship only after INF-1/2/3/4 are fixed? (Recommended: yes.)
2. **Wrapper entry-point split (INF-6):** accept secondary entry points (`@tulpar-ui/angular/button`, `@tulpar-ui/vue/button`) as the public import style before 1.0, when changing it is cheap?
3. **Cross-browser and visual regression (INF-12):** add Firefox/WebKit to CI now (cheap)? Schedule visual regression (Playwright screenshots vs Chromatic) as an infra milestone?
4. **Primitive references in `tulpar-button.ts`/`tulpar-avatar.ts` (INF-13):** an intended custom-tone escape hatch (then make it explicit), or a violation to move into the brand layer?
5. **Toolchain upgrade wave (INF-9/21):** schedule one "infra 2" slice (pnpm major, catalog strict, vite 8, vitest 4+, typescript-eslint 8, Storybook 10, WTR 1) separate from component milestones?

Artifacts: `review/npmpack/*.tgz` (published 0.6.0 tarballs), `review/infra-outdated.txt`, `review/infra-audit-prod.json`.
