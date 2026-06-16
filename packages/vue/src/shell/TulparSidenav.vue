<script setup lang="ts">
import "@tulpar-ui/shell";
import { ref, watchEffect } from "vue";
import type { TulparNavItemData, TulparSidenav as TulparSidenavEl } from "@tulpar-ui/shell";

interface Props {
  items?: TulparNavItemData[];
  navLabel?: string;
  position?: "left" | "right";
  density?: "comfortable" | "compact";
  singleExpand?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  position: "left",
  density: "comfortable",
  singleExpand: false,
});

// `items` is attribute: false on the WC — it must be set as a JS property, not a
// stringified attribute. Bind through a ref + watchEffect so the array reaches
// the element as-is.
const hostRef = ref<TulparSidenavEl | null>(null);
watchEffect(() => {
  if (hostRef.value) hostRef.value.items = props.items;
});
</script>

<template>
  <tulpar-sidenav
    ref="hostRef"
    :nav-label="navLabel ?? undefined"
    :position="position"
    :density="density"
    :single-expand="singleExpand || undefined"
  >
    <slot name="header" />
    <slot name="header-actions" />
    <slot name="search" />
    <slot name="utility-start" />
    <slot name="utility-end" />
    <slot />
    <slot name="footer" />
  </tulpar-sidenav>
</template>
