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
    <span slot="start" style="display: contents"><slot name="start" /></span>
    <slot />
    <span slot="end" style="display: contents"><slot name="end" /></span>
  </tulpar-topbar>
</template>
