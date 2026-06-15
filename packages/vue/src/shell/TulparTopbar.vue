<script setup lang="ts">
import "@tulpar-ui/shell";

interface Props {
  showMenuButton?: boolean;
  menuButtonLabel?: string;
}

const { showMenuButton = false, menuButtonLabel } = defineProps<Props>();
</script>

<template>
  <tulpar-topbar
    :show-menu-button="showMenuButton || undefined"
    :menu-button-label="menuButtonLabel ?? undefined"
  >
    <slot name="start" />
    <slot />
    <slot name="end" />
  </tulpar-topbar>
</template>
