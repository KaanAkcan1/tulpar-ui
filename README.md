<p align="center">
  <a href="https://tulpar-ui-docs.pages.dev">
    <img src="assets/brand/social/readme-banner-1280x320.png" alt="Tulpar UI — Enterprise web components" width="100%" />
  </a>
</p>

# Tulpar UI

From-scratch design system: Lit-based Web Components with idiomatic
Angular and Vue wrappers. Single source of truth for behavior and
rendering, consumable from any framework.

**Docs / Demos:** [Storybook](https://tulpar-ui-docs.pages.dev) ·
[Angular playground](https://tulpar-ui-ng.pages.dev) ·
[Vue playground](https://tulpar-ui-vue.pages.dev)

## Packages

| Package              | Description                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `@tulpar-ui/tokens`  | 3-layer design tokens (primitive → semantic → brand×mode), generated CSS custom properties |
| `@tulpar-ui/core`    | Lit Web Components (`<tulpar-button>`, input family) — source of truth                     |
| `@tulpar-ui/angular` | Signal-based Angular wrappers (`<tulpar-button-ng>`)                                       |
| `@tulpar-ui/vue`     | Vue 3 SFC wrappers (`<TulparButton>`)                                                      |

## Quick start (Vue)

```bash
pnpm add @tulpar-ui/vue @tulpar-ui/tokens
```

```ts
// main.ts
import "@tulpar-ui/tokens/css/tulpar.css";
```

```vue
<script setup>
import { TulparButton } from "@tulpar-ui/vue";
</script>
<template>
  <TulparButton severity="primary">Save</TulparButton>
</template>
```

Vite config requires a custom element declaration:

```ts
vue({
  template: {
    compilerOptions: { isCustomElement: (tag) => tag.startsWith("tulpar-") },
  },
});
```

## Quick start (Angular)

```bash
pnpm add @tulpar-ui/angular @tulpar-ui/tokens
```

Add the tokens CSS to your `angular.json` styles array:

```json
"node_modules/@tulpar-ui/tokens/dist/css/tulpar.css"
```

```ts
import { TulparButtonComponent } from "@tulpar-ui/angular";
```

## Theming

- Brand: `<html data-brand="tulpar">` (default `:root`)
- Dark mode: `.dark` class (Tailwind-compatible)
- Override: any `--tulpar-*` custom property

## Development

```bash
pnpm install
pnpm build          # all packages, topological
pnpm test           # all tests
pnpm dev            # watch everything + playgrounds + Storybook
```

## License

See [LICENSE](./LICENSE).
