<script setup lang="ts">
import "@tulpar-ui/core/radio-group";
import type { SelectionSize } from "@tulpar-ui/core/radio-group";

/**
 * Group nesting: this wrapper uses `display:contents` (via the core element
 * style) so projected `<tulpar-radio>` children remain DOM descendants of
 * the core `<tulpar-radio-group>`. The core group queries children via a
 * descendant selector, so the core elements must not be blocked by an
 * intervening opaque host.
 *
 * v-model: string | null — synced via the group's composed `change`
 * CustomEvent `detail.value`.
 */
interface Props {
  modelValue?: string | null;
  name?: string;
  orientation?: "vertical" | "horizontal";
  size?: SelectionSize;
  label?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  warn?: boolean;
  helperText?: string;
  errorText?: string;
  warnText?: string;
  noMessageSpace?: boolean;
  color?: string;
}

const {
  modelValue = null,
  orientation = "vertical",
  size = "md",
} = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  change: [event: CustomEvent<{ value: string | null }>];
}>();

function onChange(e: Event) {
  const ce = e as CustomEvent<{ value: string | null }>;
  if (ce.detail && "value" in ce.detail) {
    emit("update:modelValue", ce.detail.value);
    emit("change", ce);
  }
}
</script>

<template>
  <tulpar-radio-group
    :value="modelValue ?? undefined"
    :name="name ?? undefined"
    :orientation="orientation"
    :size="size"
    :label="label ?? undefined"
    :disabled="disabled || undefined"
    :readonly="readonly || undefined"
    :required="required || undefined"
    :invalid="invalid || undefined"
    :warn="warn || undefined"
    :helper-text="helperText ?? undefined"
    :error-text="errorText ?? undefined"
    :warn-text="warnText ?? undefined"
    :no-message-space="noMessageSpace || undefined"
    :color="color ?? undefined"
    @change="onChange"
  >
    <slot name="label" />
    <slot name="description" />
    <slot />
  </tulpar-radio-group>
</template>
