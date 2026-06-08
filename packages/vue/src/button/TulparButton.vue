<script setup lang="ts">
import "@tulpar-ui/core/button";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonType = "button" | "submit" | "reset";

interface Props {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  type: "button",
  disabled: false,
  loading: false,
  iconOnly: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <tulpar-button
    :variant="props.variant"
    :size="props.size"
    :type="props.type"
    :disabled="props.disabled || null"
    :loading="props.loading || null"
    :icon-only="props.iconOnly || null"
    :href="props.href ?? null"
    :target="props.target ?? null"
    :rel="props.rel ?? null"
    :aria-label="props.ariaLabel ?? null"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <slot name="start" />
    <slot />
    <slot name="end" />
  </tulpar-button>
</template>
