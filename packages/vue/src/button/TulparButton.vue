<script setup lang="ts">
import "@tulpar-ui/core/button";

export type ButtonSeverity =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warn"
  | "help"
  | "danger"
  | "contrast"
  | "premium";

export type ButtonVariant = "solid" | "outlined" | "tonal" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonShape = "default" | "round" | "circle";
export type ButtonIconPosition = "start" | "end" | "top" | "bottom";
export type ButtonLoadingPosition = "start" | "center" | "end";
export type ButtonType = "button" | "submit" | "reset";
export type ButtonJustify = "start" | "center" | "end" | "between";
export type ButtonColor =
  | "navy"
  | "gold"
  | "stone"
  | "slate"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

interface Props {
  severity?: ButtonSeverity;
  variant?: ButtonVariant;
  color?: ButtonColor;
  shape?: ButtonShape;
  size?: ButtonSize;
  type?: ButtonType;
  raised?: boolean;
  block?: boolean;
  justify?: ButtonJustify;
  disabled?: boolean;
  dataDisabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  loadingPosition?: ButtonLoadingPosition;
  iconOnly?: boolean;
  iconPosition?: ButtonIconPosition;
  iconSeparator?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  severity: "primary",
  variant: "solid",
  shape: "default",
  size: "md",
  type: "button",
  raised: false,
  block: false,
  justify: "center",
  disabled: false,
  dataDisabled: false,
  loading: false,
  loadingPosition: "center",
  iconOnly: false,
  iconPosition: "start",
  iconSeparator: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <tulpar-button
    :severity="props.severity"
    :variant="props.variant"
    :color="props.color ?? null"
    :shape="props.shape"
    :size="props.size"
    :type="props.type"
    :raised="props.raised || null"
    :block="props.block || null"
    :justify="props.justify"
    :disabled="props.disabled || null"
    :data-disabled="props.dataDisabled || null"
    :loading="props.loading || null"
    :loading-label="props.loadingLabel ?? null"
    :loading-position="props.loadingPosition"
    :icon-only="props.iconOnly || null"
    :icon-position="props.iconPosition"
    :icon-separator="props.iconSeparator || null"
    :href="props.href ?? null"
    :target="props.target ?? null"
    :rel="props.rel ?? null"
    :aria-label="props.ariaLabel ?? null"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <slot name="start" />
    <slot />
    <slot name="end" />
    <slot name="loading-icon" />
  </tulpar-button>
</template>
