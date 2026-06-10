<script setup lang="ts">
import "@tulpar-ui/core/textarea";
import type { FieldSize, FieldVariant, LabelPosition, NecessityIndicator } from "@tulpar-ui/core";

interface Props {
  modelValue?: string;
  label?: string;
  labelPosition?: LabelPosition;
  necessityIndicator?: NecessityIndicator;
  helperText?: string;
  errorText?: string;
  warnText?: string;
  noMessageSpace?: boolean;
  size?: FieldSize;
  variant?: FieldVariant;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  warn?: boolean;
  validating?: boolean;
  copyable?: boolean;
  pastable?: boolean;
  name?: string;
  placeholder?: string;
  maxLength?: number;
  minLength?: number;
  showCount?: boolean;
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
  rows?: number;
  resize?: "none" | "both" | "horizontal" | "vertical";
}

const {
  modelValue = "",
  necessityIndicator = "icon",
  size = "md",
  variant = "outlined",
  autosize = true,
  minRows = 2,
  maxRows = 6,
  resize = "vertical",
} = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [event: Event];
}>();

function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLElement & { value: string }).value);
}
</script>

<template>
  <tulpar-textarea
    :value="modelValue"
    :label="label ?? undefined"
    :label-position="labelPosition ?? undefined"
    :necessity-indicator="necessityIndicator"
    :helper-text="helperText ?? undefined"
    :error-text="errorText ?? undefined"
    :warn-text="warnText ?? undefined"
    :no-message-space="noMessageSpace || undefined"
    :size="size"
    :variant="variant"
    :disabled="disabled || undefined"
    :readonly="readonly || undefined"
    :required="required || undefined"
    :invalid="invalid || undefined"
    :warn="warn || undefined"
    :validating="validating || undefined"
    :copyable="copyable || undefined"
    :pastable="pastable || undefined"
    :name="name ?? undefined"
    :placeholder="placeholder ?? undefined"
    :maxlength="maxLength ?? undefined"
    :minlength="minLength ?? undefined"
    :show-count="showCount || undefined"
    :autosize="autosize"
    :min-rows="minRows"
    :max-rows="maxRows"
    :rows="rows ?? undefined"
    :resize="resize"
    @input="onInput"
    @change="(e: Event) => emit('change', e)"
  >
    <slot name="label" />
  </tulpar-textarea>
</template>
