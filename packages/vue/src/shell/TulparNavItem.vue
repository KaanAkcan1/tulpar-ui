<script setup lang="ts">
import "@tulpar-ui/shell";

interface Props {
  href?: string;
  label?: string;
  /** Raw SVG string forwarded to the element's `icon` attribute. */
  icon?: string;
  iconClass?: string;
  badge?: string;
  active?: boolean;
  disabled?: boolean;
  target?: string;
  count?: string;
  dot?: boolean;
  dotLabel?: string;
  kbd?: string;
}

const {
  href,
  label,
  icon,
  iconClass,
  badge,
  active = false,
  disabled = false,
  target,
  count,
  dot = false,
  dotLabel,
  kbd,
} = defineProps<Props>();
</script>

<template>
  <tulpar-nav-item
    :href="href ?? undefined"
    :label="label ?? undefined"
    :icon="icon ?? undefined"
    :icon-class="iconClass ?? undefined"
    :badge="badge ?? undefined"
    :target="target ?? undefined"
    :count="count ?? undefined"
    :dot-label="dotLabel ?? undefined"
    :kbd="kbd ?? undefined"
    :active="active || undefined"
    :disabled="disabled || undefined"
    :dot="dot || undefined"
  >
    <slot />
  </tulpar-nav-item>
</template>
