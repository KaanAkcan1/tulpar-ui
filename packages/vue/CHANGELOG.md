# @tulpar-ui/vue

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
