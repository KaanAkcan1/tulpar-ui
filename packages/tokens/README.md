# @tulpar-ui/tokens

Design tokens for Tulpar UI — three layers that keep brand themes
and dark mode fully independent of component code:

1. **Primitive** — raw values (`blue.600`, `gray.900`, `spacing.4`)
2. **Semantic** — intent names (`color.bg.surface`, `color.brand.default`)
3. **Brand × Mode** — maps semantic → primitive per brand and light/dark

The build step emits a single CSS file that sets all `--tulpar-*` custom
properties. Components import nothing directly; they reference the
semantic tokens through `var(--tulpar-*)`.

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
