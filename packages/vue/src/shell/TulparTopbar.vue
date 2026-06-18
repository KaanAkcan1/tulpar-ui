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
    <span style="display: contents" slot="start"><slot name="start" /></span>
    <slot />
    <span style="display: contents" slot="end"><slot name="end" /></span>
  </tulpar-topbar>
</template>
