<script setup lang="ts">
import type { Component } from "vue";
import "@tulpar-ui/core/switch";
import type { SelectionSize, SelectionLabelPosition } from "@tulpar-ui/core/switch";

interface Props {
  modelValue?: boolean;
  value?: string;
  loading?: boolean;
  showIcon?: boolean;
  onColor?: string;
  offColor?: string;
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
  /** Convenience: render a component into the `icon-on` slot. */
  iconOn?: Component;
  /** Convenience: render a component into the `icon-off` slot. */
  iconOff?: Component;
}

const {
  modelValue = false,
  value = "on",
  loading = false,
  showIcon = false,
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
  <tulpar-switch
    :checked="modelValue || undefined"
    :value="value"
    :loading="loading || undefined"
    :show-icon="showIcon || undefined"
    :on-color="onColor ?? undefined"
    :off-color="offColor ?? undefined"
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
    <!-- Render directly with the slot attr so the icon's root <svg> is the
         slotted node and the core's ::slotted sizing fits it to the thumb. -->
    <component :is="iconOn" v-if="iconOn" slot="icon-on" />
    <component :is="iconOff" v-if="iconOff" slot="icon-off" />
    <slot />
  </tulpar-switch>
</template>
