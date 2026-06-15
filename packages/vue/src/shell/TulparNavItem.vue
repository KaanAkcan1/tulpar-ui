<script setup lang="ts">
import "@tulpar-ui/shell";

interface Props {
  href?: string;
  label?: string;
  iconClass?: string;
  badge?: string;
  active?: boolean;
  disabled?: boolean;
  target?: string;
}

const {
  href,
  label,
  iconClass,
  badge,
  active = false,
  disabled = false,
  target,
} = defineProps<Props>();
</script>

<template>
  <tulpar-nav-item
    :href="href ?? undefined"
    :label="label ?? undefined"
    :icon-class="iconClass ?? undefined"
    :badge="badge ?? undefined"
    :target="target ?? undefined"
    :active="active || undefined"
    :disabled="disabled || undefined"
  >
    <slot />
  </tulpar-nav-item>
</template>
