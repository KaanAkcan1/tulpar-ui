<script setup lang="ts">
import "@tulpar-ui/core/radio";
import type { SelectionSize, SelectionLabelPosition } from "@tulpar-ui/core/radio";

interface Props {
  value: string;
  modelValue?: boolean;
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
}

const {
  modelValue = false,
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
  <tulpar-radio
    :value="value"
    :checked="modelValue || undefined"
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
    <slot />
  </tulpar-radio>
</template>
