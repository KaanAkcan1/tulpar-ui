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

## Browser baseline

v0.4 targets:
- Chromium ≥ 65
- Firefox ≥ 78
- **Safari ≥ 17** — required for reliable `delegatesFocus` on form-associated
  custom elements. Safari 16 still works; only focus-ring visibility on inner
  buttons may regress.

## Tooltip

The `tooltip` property on `<tulpar-button>` is a simple inline string tooltip.
Limitations:

- Clipped by ancestors with `overflow: hidden`.
- Fixed `z-index: 100`; may be obscured by modals or drawers.
- No ESC dismiss, no hover delay, no viewport-edge collision detection.

For production tooltips, wait for the dedicated component in v0.5 (Popover API
+ CSS Anchor Positioning).

## Angular wrapper transparency

`<tulpar-button-ng>` uses `display: contents` so its host element is excluded
from layout. Visually identical to placing `<tulpar-button>` directly. CSS that
targets `tulpar-button-ng { … }` for layout (width, padding, border) will not
take effect — apply layout to `<tulpar-button>` instead.

## Status

v0.3 — Button API expansion (severity + variant + composable modifiers + 21-family color override + icon-position/separator + stacked ButtonGroup).

See [v0.3 spec](docs/superpowers/specs/2026-06-08-tulpar-ui-v0.3-button-api-expansion-design.md) and [v0.3 plan](docs/superpowers/plans/2026-06-08-tulpar-ui-v0.3-button-api-expansion-implementation.md).

Previous versions: [v0.2](docs/superpowers/specs/2026-06-08-tulpar-ui-v0.2-design-system-redesign.md), [v0.1](docs/superpowers/specs/2026-06-05-tulpar-ui-v0.1-button-design.md).
