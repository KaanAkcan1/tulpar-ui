<script setup lang="ts">
import "@tulpar-ui/shell";
import { ref, watchEffect } from "vue";
import type { TulparNavItemData, TulparSidenav as TulparSidenavEl } from "@tulpar-ui/shell";

interface Props {
  items?: TulparNavItemData[];
  navLabel?: string;
}

const props = defineProps<Props>();

// `items` is attribute: false on the WC — it must be set as a JS property, not a
// stringified attribute. Bind through a ref + watchEffect so the array reaches
// the element as-is.
const hostRef = ref<TulparSidenavEl | null>(null);
watchEffect(() => {
  if (hostRef.value) hostRef.value.items = props.items;
});
</script>

<template>
  <tulpar-sidenav ref="hostRef" :nav-label="navLabel ?? undefined">
    <slot name="header" />
    <slot />
    <slot name="footer" />
  </tulpar-sidenav>
</template>
