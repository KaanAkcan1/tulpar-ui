<script setup lang="ts">
import type { Component } from "vue";
import "@tulpar-ui/core/checkbox";
import type { SelectionSize, SelectionLabelPosition } from "@tulpar-ui/core/checkbox";

interface Props {
  modelValue?: boolean;
  indeterminate?: boolean;
  value?: string;
  variant?: "default" | "card";
  size?: SelectionSize;
  label?: string;
  labelPosition?: SelectionLabelPosition;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  warn?: boolean;
  helperText?: string;
  errorText?: string;
  warnText?: string;
  noMessageSpace?: boolean;
  name?: string;
  color?: string;
  description?: string;
  /** Convenience: render a component into the `icon` slot (custom check glyph). */
  icon?: Component;
}

const {
  modelValue = false,
  value = "on",
  variant = "default",
  size = "md",
  labelPosition = "end",
} = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  change: [event: Event];
}>();

function onChange(e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  emit("update:modelValue", el.checked);
  emit("change", e);
}
</script>

<template>
  <tulpar-checkbox
    :checked="modelValue || undefined"
    :indeterminate="indeterminate || undefined"
    :value="value"
    :variant="variant"
    :size="size"
    :label="label ?? undefined"
    :label-position="labelPosition"
    :disabled="disabled || undefined"
    :readonly="readonly || undefined"
    :required="required || undefined"
    :invalid="invalid || undefined"
    :warn="warn || undefined"
    :helper-text="helperText ?? undefined"
    :error-text="errorText ?? undefined"
    :warn-text="warnText ?? undefined"
    :no-message-space="noMessageSpace || undefined"
    :name="name ?? undefined"
    :color="color ?? undefined"
    :description="description ?? undefined"
    @change="onChange"
  >
    <!-- Render the icon component directly with the slot attr so its root <svg>
         is the slotted node — the core's ::slotted sizing then fits it to the
         glyph box (a wrapping span would let the icon overflow at its intrinsic
         size). -->
    <component :is="icon" v-if="icon" slot="icon" />
    <slot />
  </tulpar-checkbox>
</template>
