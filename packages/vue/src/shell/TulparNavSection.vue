<script setup lang="ts">
import "@tulpar-ui/shell";

interface Props {
  label?: string;
}

const { label } = defineProps<Props>();
</script>

<template>
  <tulpar-nav-section :label="label ?? undefined">
    <slot />
  </tulpar-nav-section>
</template>
