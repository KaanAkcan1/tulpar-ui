---
"@tulpar-ui/tokens": patch
"@tulpar-ui/core": patch
"@tulpar-ui/shell": patch
"@tulpar-ui/angular": patch
"@tulpar-ui/vue": patch
---

Correct build outputs for publishing:

- `@tulpar-ui/angular` is built in partial compilation mode and published in Angular Package Format from `dist` (`publishConfig.directory`).
- Dev warnings follow Lit's convention: `warnDev` reads `DEV` from `esm-env`, so warnings print under the `development` export condition and are off in production builds and in unbundled scripts.
- Manifest hygiene: `workspace:^` internal ranges, explicit `sideEffects` (element chunks are named `tulpar-*.js`), `@tulpar-ui/tokens` as a dependency of every component package, a `./package.json` export, no `.d.ts.map` files, and no `vue-router` peer on `@tulpar-ui/vue`.
