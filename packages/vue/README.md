<p align="center">
  <a href="https://github.com/KaanAkcan1/tulpar-ui">
    <img src="https://raw.githubusercontent.com/KaanAkcan1/tulpar-ui/main/assets/brand/svg/tulpar-ui-icon.svg" width="56" alt="Tulpar UI" />
  </a>
</p>

# @tulpar-ui/vue

Vue 3 SFC wrappers for Tulpar UI Web Components.

## Install

```bash
pnpm add @tulpar-ui/vue @tulpar-ui/tokens
```

## Usage

```ts
// main.ts — load tokens once
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

### Input family

```vue
<script setup>
import { TulparTextInput, TulparNumberInput, TulparTextarea } from "@tulpar-ui/vue";
</script>
```

### Overlay family

Overlays attach to a trigger via a **directive on the trigger** — nothing
wraps the trigger. The directive drives a core overlay (`for` = the host
element), so "a tooltip on a button" never inverts into "a button inside a
tooltip".

```vue
<script setup>
import { vTulparTooltip, vTulparToggletip, TulparPopover } from "@tulpar-ui/vue";
</script>

<template>
  <!-- inline: object value carries the config -->
  <button v-tulpar-tooltip="{ text: 'Kaydet', placement: 'top' }">Save</button>
  <button v-tulpar-toggletip="{ text: 'Optional billing field', tone: 'info' }" aria-label="Info">
    ⓘ
  </button>

  <!-- reference-by-id: declare a rich overlay once, reference it from triggers -->
  <TulparPopover id="acctMenu" placement="bottom-start" label="Account">
    <form><!-- inputs, Save / Cancel --></form>
  </TulparPopover>
  <button v-tulpar-popover-ref="'acctMenu'">Account</button>
</template>
```

`open` supports `v-model:open`. `tone`
(`neutral | info | success | warning | danger`) applies to toggletip and
popover (conventional status hues: info = blue, success = green, warning =
amber, danger = red); pair it with the matching status icon — color is never
the sole carrier. Tooltips have no tone and **degrade to a toggletip on
touch**, so never put load-bearing info in one.

## Vite config

Declare all `tulpar-` tags as custom elements so Vue's compiler does
not treat the underlying Web Components as Vue components:

```ts
// vite.config.ts
import vue from "@vitejs/plugin-vue";

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith("tulpar-"),
        },
      },
    }),
  ],
};
```

Full docs: https://github.com/KaanAkcan1/tulpar-ui#readme
