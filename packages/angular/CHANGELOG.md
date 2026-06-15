# @tulpar-ui/angular

## 0.6.0

### Minor Changes

- cff45f4: feat: application shell family (tulpar-shell, tulpar-topbar, tulpar-sidenav, tulpar-nav-item) + shell tokens + Angular/Vue wrappers

  Adds the @tulpar-ui/shell package — an enterprise app-layout family (CSS Grid shell with static/overlay/rail sidenav modes, mobile breakpoint, scrim, aside panel, skip-link, dark-mode View Transitions, keyboard nav) plus shell semantic tokens, opt-in localStorage persistence, and idiomatic Angular (signal-based, router bridge) and Vue (router bridge) wrappers.

### Patch Changes

- Updated dependencies [cff45f4]
  - @tulpar-ui/tokens@0.6.0
  - @tulpar-ui/core@0.6.0
  - @tulpar-ui/shell@0.6.0

## 0.5.0

### Minor Changes

- 36f7dc4: Input family: three new public custom elements (`<tulpar-text-input>`,
  `<tulpar-textarea>`, `<tulpar-number-input>`) sharing an internal
  FormFieldBase. Signal-based Angular wrappers and v-model Vue wrappers
  included, plus full Storybook coverage and menu-driven playground demos.

  Differentiators baked in: async `validating` state, copy/paste
  affordances with visual confirmation, layout-shift-safe message row,
  integrated mask engine with case-forcing token alphabet (A/a/L/9/S/\*),
  five label positions including PrimeNG-style float ("over"), and a
  hybrid Intl.NumberFormat API (shorthand attributes + full
  `.formatOptions` property).

  See `docs/migration/v0.4-to-v0.5.md` for usage examples and the
  deferred-items list.

### Patch Changes

- Updated dependencies [36f7dc4]
  - @tulpar-ui/core@0.5.0
  - @tulpar-ui/tokens@0.5.0

## 0.1.1

### Patch Changes

- **Breaking change to `@tulpar-ui/angular` `icon` input.** The `icon` prop on `<tulpar-button-ng>` now accepts an Angular component class (`Type<unknown>`) instead of `LucideIconData`. The wrapper no longer depends on `lucide-angular`. Consumers using `[icon]="<lucide data>"` must either:
  1. Switch to the slot pattern: `<tulpar-button-ng><lucide-angular slot="start" [img]="Check" /></tulpar-button-ng>`.
  2. Wrap their lucide icon in a small Angular component and pass that component to `[icon]`.

  **Install UX fixes:**
  - `@tulpar-ui/angular` no longer declares `lucide-angular` as a peer dependency — Angular 22 consumers can now `npm install @tulpar-ui/angular` without `--legacy-peer-deps`.
  - `@tulpar-ui/core` and `@tulpar-ui/tokens` moved from `peerDependencies` to `dependencies` in `@tulpar-ui/angular` and `@tulpar-ui/vue`, so npm pulls the full dependency graph automatically.

  Despite the breaking icon API change, this is released as a patch because v0.1.0 has zero external consumers (published ~1 hour earlier).

- Updated dependencies
  - @tulpar-ui/tokens@0.1.1
  - @tulpar-ui/core@0.1.1

## 0.1.0

### Minor Changes

- Initial release of Tulpar UI v0.1.
  - @tulpar-ui/tokens: 3-layer token system (primitive → semantic → brand×mode), light/dark, default `tulpar` brand
  - @tulpar-ui/core: `<tulpar-button>` and `<tulpar-button-group>` (Lit 3, form-associated)
  - @tulpar-ui/angular: signal-based `<tulpar-button-ng>` wrapper
  - @tulpar-ui/vue: `<TulparButton>` SFC wrapper

### Patch Changes

- Updated dependencies
  - @tulpar-ui/core@0.1.0
