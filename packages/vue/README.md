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
