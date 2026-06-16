<p align="center">
  <a href="https://github.com/KaanAkcan1/tulpar-ui">
    <img src="https://raw.githubusercontent.com/KaanAkcan1/tulpar-ui/main/assets/brand/svg/tulpar-ui-icon.svg" width="56" alt="Tulpar UI" />
  </a>
</p>

# @tulpar-ui/tokens

Design tokens for Tulpar UI — three layers that keep brand themes
and dark mode fully independent of component code:

1. **Primitive** — raw values (`tulpar.500`, `kara.900`, `spacing.4`)
2. **Semantic** — intent names (`color.bg.surface`, `color.brand.default`)
3. **Brand × Mode** — maps semantic → primitive per brand and light/dark

The build step emits a single CSS file that sets all `--tulpar-*` custom
properties. Components import nothing directly; they reference the
semantic tokens through `var(--tulpar-*)`.

## Palette — Chromatic Mythology

The primitive layer ships 22 color families, each named for a figure or
element from Turkic mythology:

`al`, `kizagan`, `umay`, `ilay`, `erlik`, `kam`, `mergen`, `gok`, `ay`,
`yersu`, `tulpar`, `otuken`, `kayin`, `ulgen`, `kuyas`, `alaz`, `burkut`,
`colpan`, `ayzit`, `boz`, `kara`, `yagiz`.

The semantic layer binds intents to those families:

| Intent | Family |
|---|---|
| brand | `tulpar` |
| secondary | `kam` |
| success | `otuken` |
| danger | `al` |
| warn | `kuyas` |
| info | `gok` |
| help | `erlik` |
| premium | `ulgen` |
| neutral | `kara` |
| contrast | `yagiz` |

Surfaces, text, and focus:

- **Light surfaces** — `colpan` + white
- **Dark surfaces** — `mergen`
- **Ink / text** — `yagiz`
- **Muted** — `kara`
- **Focus** — `kam`

Data-viz chart ramp (`--tulpar-chart-1` … `--tulpar-chart-8`):

`tulpar` → `kam` → `kuyas` → `ilay` → `yersu` → `burkut` → `erlik` → `kayin`

## Install

```bash
pnpm add @tulpar-ui/tokens
```

## Usage

```ts
// Once, in your app entry point
import "@tulpar-ui/tokens/css/tulpar.css";
```

Apply a brand and optional dark mode on the root element:

```html
<!-- default brand, light mode -->
<html data-brand="tulpar">
  <!-- add class="dark" for dark mode -->
</html>
```

## TypeScript exports

Primitive token objects (raw values):

```ts
import {
  primitiveColor,
  primitiveSpacing,
  primitiveTypography,
  primitiveRadius,
  primitiveShadow,
  primitiveTransition,
} from "@tulpar-ui/tokens";
```

Brand token objects (semantic → primitive mappings per mode):

```ts
import { tulparLight, tulparDark } from "@tulpar-ui/tokens";
```

Type exports:

```ts
import type {
  SemanticTokens,
  ColorTokens,
  ButtonTokens,
  ButtonSizeTokens,
  VariantColorTokens,
} from "@tulpar-ui/tokens";
```

CSS fallback map (for components that need hard-coded fallbacks):

```ts
import { FALLBACKS } from "@tulpar-ui/tokens";
import type { FallbackKey } from "@tulpar-ui/tokens";
```

Full docs: https://github.com/KaanAkcan1/tulpar-ui#readme
