<script setup lang="ts">
import "@tulpar-ui/core/text-input";
import type {
  TextInputType,
  FieldSize,
  FieldVariant,
  LabelPosition,
  NecessityIndicator,
} from "@tulpar-ui/core";

interface Props {
  modelValue?: string;
  type?: TextInputType;
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
  clearable?: boolean;
  showCount?: boolean;
  noRevealToggle?: boolean;
  copyable?: boolean;
  pastable?: boolean;
  placeholder?: string;
  autocomplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  name?: string;
  mask?: string;
  maskEmit?: "masked" | "raw";
  maskDisplay?: "eager" | "lazy";
  maskSlotChar?: string;
  prefixInteractive?: boolean;
  suffixInteractive?: boolean;
}

const {
  modelValue = "",
  type = "text",
  necessityIndicator = "icon",
  size = "md",
  variant = "outlined",
  maskEmit = "masked",
  maskDisplay = "eager",
  maskSlotChar = "_",
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
  <tulpar-text-input
    :type="type"
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
    :clearable="clearable || undefined"
    :show-count="showCount || undefined"
    :no-reveal-toggle="noRevealToggle || undefined"
    :copyable="copyable || undefined"
    :pastable="pastable || undefined"
    :placeholder="placeholder ?? undefined"
    :autocomplete="autocomplete ?? undefined"
    :maxlength="maxLength ?? undefined"
    :minlength="minLength ?? undefined"
    :pattern="pattern ?? undefined"
    :name="name ?? undefined"
    :mask="mask ?? undefined"
    :mask-emit="maskEmit"
    :mask-display="maskDisplay"
    :mask-slot-char="maskSlotChar"
    :prefix-interactive="prefixInteractive || undefined"
    :suffix-interactive="suffixInteractive || undefined"
    @input="onInput"
    @change="(e: Event) => emit('change', e)"
  >
    <span style="display: contents" slot="prefix"><slot name="prefix" /></span>
    <span style="display: contents" slot="suffix"><slot name="suffix" /></span>
    <span style="display: contents" slot="label"><slot name="label" /></span>
    <!-- Default passthrough: lets consumers use <span slot="x"> (Vue 3 drops the
         legacy slot directive, so a literal slot attr routes here to the core). -->
    <slot />
  </tulpar-text-input>
</template>
