# Tulpar UI

A Lit-based design system with Angular and Vue wrappers. Enterprise-grade
palette (Navy + Gold brand, 17 chromatic families) and Source Serif 4 +
Source Sans 3 typography.

## Packages

- `@tulpar-ui/tokens` — Design tokens (CSS custom properties + TypeScript exports)
- `@tulpar-ui/core` — Lit Web Components (source of truth)
- `@tulpar-ui/angular` — Angular wrappers
- `@tulpar-ui/vue` — Vue 3 wrappers

## Fonts (consumer-loaded)

Tulpar UI does not bundle fonts. Load these in your app shell:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600;700;800&family=Source+Sans+3:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
```

## Documentation

Storybook: `pnpm --filter docs storybook`

## Development

```bash
pnpm install
pnpm build
pnpm test
```

## Status

v0.3 — Button API expansion (severity + variant + composable modifiers + 21-family color override + icon-position/separator + stacked ButtonGroup).

See [v0.3 spec](docs/superpowers/specs/2026-06-08-tulpar-ui-v0.3-button-api-expansion-design.md) and [v0.3 plan](docs/superpowers/plans/2026-06-08-tulpar-ui-v0.3-button-api-expansion-implementation.md).

Previous versions: [v0.2](docs/superpowers/specs/2026-06-08-tulpar-ui-v0.2-design-system-redesign.md), [v0.1](docs/superpowers/specs/2026-06-05-tulpar-ui-v0.1-button-design.md).
