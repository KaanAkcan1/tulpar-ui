<script setup lang="ts">
import { computed, useSlots, type Component } from "vue";
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

/** Default icon size per button size — matches the token scale. */
const ICON_SIZE_BY_BUTTON_SIZE: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
};

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
  tooltip?: string;
  /** Lucide-vue-next component (or any Vue component accepting :size) */
  icon?: Component;
  /** Optional override for icon size; defaults to button's size-scale value. */
  iconSize?: number;
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

const slots = useSlots();

/** Auto icon-only when an `icon` is set AND no default-slot content was passed. */
const autoIconOnly = computed(() => Boolean(props.icon) && !slots.default);

/** Effective icon size: explicit `iconSize` overrides per-size default. */
const effectiveIconSize = computed(() => props.iconSize ?? ICON_SIZE_BY_BUTTON_SIZE[props.size]);
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
    :icon-only="props.iconOnly || autoIconOnly || null"
    :icon-position="props.iconPosition"
    :icon-separator="props.iconSeparator || null"
    :href="props.href ?? null"
    :target="props.target ?? null"
    :rel="props.rel ?? null"
    :aria-label="props.ariaLabel ?? null"
    :tooltip="props.tooltip ?? null"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <!--
      :icon prop renders inside <span slot="start">.
      For non-Lucide libraries, consumers still use <span slot="start"> directly.
    -->
    <span v-if="props.icon" slot="start">
      <component :is="props.icon" :size="effectiveIconSize" />
    </span>
    <slot name="start" />
    <slot />
    <slot name="end" />
    <slot name="loading-icon" />
  </tulpar-button>
</template>
