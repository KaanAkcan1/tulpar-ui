<script setup lang="ts">
import { computed, useSlots, Comment, type Component } from "vue";
import "@tulpar-ui/core/button";
import type {
  ButtonSeverity,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  ButtonIconPosition,
  ButtonLoadingPosition,
  ButtonType,
  ButtonJustify,
  ButtonColor,
} from "@tulpar-ui/core";

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
  name?: string;
  value?: string;
  icon?: Component;
  iconSize?: number;
}

const {
  severity = "primary",
  variant = "solid",
  color,
  shape = "default",
  size = "md",
  type = "button",
  raised = false,
  block = false,
  justify = "center",
  disabled = false,
  dataDisabled = false,
  loading = false,
  loadingLabel,
  loadingPosition = "center",
  iconOnly = false,
  iconPosition = "start",
  iconSeparator = false,
  href,
  target,
  rel,
  ariaLabel,
  tooltip,
  name,
  value,
  icon,
  iconSize,
} = defineProps<Props>();

const emit = defineEmits<{ click: [event: MouseEvent] }>();
const slots = useSlots();

const autoIconOnly = computed(() => {
  if (!icon) return false;
  const slot = slots.default?.();
  if (!slot || slot.length === 0) return true;
  return !slot.some(
    (vnode) =>
      vnode.type !== Comment &&
      !(typeof vnode.children === "string" && !vnode.children.trim()),
  );
});

const effectiveIconSize = computed(() => iconSize ?? ICON_SIZE_BY_BUTTON_SIZE[size]);
</script>

<template>
  <tulpar-button
    :severity="severity"
    :variant="variant"
    :color="color ?? null"
    :shape="shape"
    :size="size"
    :type="type"
    :raised="raised || null"
    :block="block || null"
    :justify="justify"
    :disabled="disabled || null"
    :data-disabled="dataDisabled || null"
    :loading="loading || null"
    :loading-label="loadingLabel ?? null"
    :loading-position="loadingPosition"
    :icon-only="iconOnly || autoIconOnly || null"
    :icon-position="iconPosition"
    :icon-separator="iconSeparator || null"
    :href="href ?? null"
    :target="target ?? null"
    :rel="rel ?? null"
    :aria-label="ariaLabel ?? null"
    :tooltip="tooltip ?? null"
    :name="name ?? null"
    :value="value ?? null"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <span v-if="icon" slot="start">
      <component :is="icon" :size="effectiveIconSize" />
    </span>
    <slot name="start" />
    <slot />
    <slot name="end" />
    <slot name="loading-icon" />
  </tulpar-button>
</template>
