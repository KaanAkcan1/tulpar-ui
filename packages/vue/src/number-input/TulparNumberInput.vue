<script setup lang="ts">
import { ref, watchEffect } from "vue";
import "@tulpar-ui/core/number-input";
import type { FieldSize, FieldVariant, LabelPosition, NecessityIndicator } from "@tulpar-ui/core";

interface Props {
  modelValue?: number | null;
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
  prefixInteractive?: boolean;
  suffixInteractive?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  allowEmpty?: boolean;
  hideSteppers?: boolean;
  integerOnly?: boolean;
  formatStyle?: "decimal" | "currency" | "percent";
  currency?: string;
  locale?: string;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  useGrouping?: boolean;
  formatPrefix?: string;
  formatSuffix?: string;
  stepHoldDelay?: number;
  stepHoldInterval?: number;
  formatOptions?: Intl.NumberFormatOptions;
}

// Use withDefaults + props object reference so watchEffect can react to formatOptions changes.
const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  necessityIndicator: "icon",
  size: "md",
  variant: "outlined",
  step: 1,
  allowEmpty: true,
  useGrouping: true,
  formatStyle: "decimal",
  stepHoldDelay: 500,
  stepHoldInterval: 50,
});

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
  change: [event: Event];
}>();

// formatOptions is attribute: false on the WC — must be set as a JS property.
const hostRef = ref<(HTMLElement & { formatOptions?: Intl.NumberFormatOptions }) | null>(null);
watchEffect(() => {
  if (hostRef.value) {
    hostRef.value.formatOptions = props.formatOptions;
  }
});

function onChange(e: Event) {
  const target = e.target as HTMLElement & { value: number | null };
  emit("update:modelValue", target.value);
  emit("change", e);
}
</script>

<template>
  <tulpar-number-input
    ref="hostRef"
    :value="props.modelValue"
    :label="props.label ?? undefined"
    :label-position="props.labelPosition ?? undefined"
    :necessity-indicator="props.necessityIndicator"
    :helper-text="props.helperText ?? undefined"
    :error-text="props.errorText ?? undefined"
    :warn-text="props.warnText ?? undefined"
    :no-message-space="props.noMessageSpace || undefined"
    :size="props.size"
    :variant="props.variant"
    :disabled="props.disabled || undefined"
    :readonly="props.readonly || undefined"
    :required="props.required || undefined"
    :invalid="props.invalid || undefined"
    :warn="props.warn || undefined"
    :validating="props.validating || undefined"
    :copyable="props.copyable || undefined"
    :pastable="props.pastable || undefined"
    :name="props.name ?? undefined"
    :prefix-interactive="props.prefixInteractive || undefined"
    :suffix-interactive="props.suffixInteractive || undefined"
    :min="props.min ?? undefined"
    :max="props.max ?? undefined"
    :step="props.step"
    :placeholder="props.placeholder ?? undefined"
    :hide-steppers="props.hideSteppers || undefined"
    :integer-only="props.integerOnly || undefined"
    :format-style="props.formatStyle"
    :currency="props.currency ?? undefined"
    :locale="props.locale ?? undefined"
    :min-fraction-digits="props.minFractionDigits ?? undefined"
    :max-fraction-digits="props.maxFractionDigits ?? undefined"
    :format-prefix="props.formatPrefix ?? undefined"
    :format-suffix="props.formatSuffix ?? undefined"
    :step-hold-delay="props.stepHoldDelay"
    :step-hold-interval="props.stepHoldInterval"
    :allow-empty.prop="props.allowEmpty"
    :use-grouping.prop="props.useGrouping"
    @change="onChange"
  >
    <slot name="prefix" />
    <slot name="suffix" />
    <slot name="label" />
  </tulpar-number-input>
</template>
