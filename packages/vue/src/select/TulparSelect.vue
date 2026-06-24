<script setup lang="ts">
/**
 * TulparSelect — single-select dropdown wrapper (v0.14).
 *
 * Renders a `<tulpar-select>` web component. Forwards every scalar prop as an
 * attribute, named slots (label/prefix/suffix) through display:contents
 * carriers (see CLAUDE.md Vue slot gotcha), and bridges the core `change`
 * CustomEvent for v-model:value support:
 *   - `update:value` → v-model:value  (two-way string binding)
 *   - `change`       → raw CustomEvent passthrough for explicit @change handlers
 *
 * The default slot projects `<tulpar-option>` / `<tulpar-option-group>` children
 * into the core's default slot naturally (no carrier needed for default slot).
 */
import "@tulpar-ui/core/select";
import type { SelectChangeDetail } from "@tulpar-ui/core/select";
import type { FieldSize, FieldVariant, LabelPosition, NecessityIndicator } from "@tulpar-ui/core";

export type { SelectChangeDetail };

interface Props {
  /** Currently selected option value ("" = nothing selected → placeholder). */
  value?: string;
  /** Text shown on the trigger when no value is selected. */
  placeholder?: string;
  /** When set, shows a clear (✕) affordance once a value is selected. */
  clearable?: boolean;
  /** Shows a spinner in the trigger instead of the chevron. */
  loading?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Native form field name. */
  name?: string;
  /** Size tier. */
  size?: FieldSize;
  /** Visual variant. */
  variant?: FieldVariant;
  /** Dim + non-interactive. */
  disabled?: boolean;
  /** Read-only (trigger non-clickable). */
  readonly?: boolean;
  /** Marks the field as required (also suppresses the clear affordance). */
  required?: boolean;
  /** Convenience label (alias of the `label` slot). Slot wins when both set. */
  label?: string;
  /** Label position. */
  labelPosition?: LabelPosition;
  /** Necessity indicator style. */
  necessityIndicator?: NecessityIndicator;
  /** Helper text beneath the field. */
  helperText?: string;
  /** Error message beneath the field. */
  errorText?: string;
  /** Warning message beneath the field. */
  warnText?: string;
  /** Puts the field in the invalid visual state. */
  invalid?: boolean;
  /** Puts the field in the warning visual state. */
  warn?: boolean;
  /** Puts the field in the validating visual state. */
  validating?: boolean;
  /** Suppresses the reserved space below the field for helper/error/warn text. */
  noMessageSpace?: boolean;
  /** Makes the prefix icon/slot slot focusable/interactive. */
  prefixInteractive?: boolean;
  /** Makes the suffix icon/slot slot focusable/interactive. */
  suffixInteractive?: boolean;
  /** Text shown in the empty listbox status row. */
  emptyText?: string;
  /** Text shown in the loading listbox status row. */
  loadingText?: string;
  /**
   * When truthy, renders an error status row inside the listbox.
   * Distinct from `invalid` / `errorText` — this is a listbox-content state.
   */
  error?: string;
}

const {
  value,
  placeholder,
  clearable = false,
  loading = false,
  open = false,
  name,
  size,
  variant,
  disabled = false,
  readonly = false,
  required = false,
  label,
  labelPosition,
  necessityIndicator,
  helperText,
  errorText,
  warnText,
  invalid = false,
  warn = false,
  validating = false,
  noMessageSpace = false,
  prefixInteractive = false,
  suffixInteractive = false,
  emptyText,
  loadingText,
  error,
} = defineProps<Props>();

const emit = defineEmits<{
  /** Fires with the new value whenever the selection commits. Use v-model:value. */
  "update:value": [value: string];
  /** Raw core change CustomEvent passthrough for explicit @change handlers. */
  change: [event: CustomEvent<SelectChangeDetail>];
}>();

function onChange(e: Event) {
  const detail = (e as CustomEvent<SelectChangeDetail>).detail;
  emit("update:value", detail.value);
  emit("change", e as CustomEvent<SelectChangeDetail>);
}
</script>

<template>
  <tulpar-select
    :value="value ?? undefined"
    :placeholder="placeholder ?? undefined"
    :clearable="clearable || undefined"
    :loading="loading || undefined"
    :open="open || undefined"
    :name="name ?? undefined"
    :size="size ?? undefined"
    :variant="variant ?? undefined"
    :disabled="disabled || undefined"
    :readonly="readonly || undefined"
    :required="required || undefined"
    :label="label ?? undefined"
    :label-position="labelPosition ?? undefined"
    :necessity-indicator="necessityIndicator ?? undefined"
    :helper-text="helperText ?? undefined"
    :error-text="errorText ?? undefined"
    :warn-text="warnText ?? undefined"
    :invalid="invalid || undefined"
    :warn="warn || undefined"
    :validating="validating || undefined"
    :no-message-space="noMessageSpace || undefined"
    :prefix-interactive="prefixInteractive || undefined"
    :suffix-interactive="suffixInteractive || undefined"
    :empty-text="emptyText ?? undefined"
    :loading-text="loadingText ?? undefined"
    :error="error ?? undefined"
    @change="onChange"
  >
    <!-- Named slot carriers: keep the real slot= attribute so the core's
         named slots receive the projected content. Without this carrier the
         Vue compiler strips slot targeting and the shadow slot stays empty. -->
    <span v-if="$slots.label" style="display: contents" slot="label"><slot name="label" /></span>
    <span v-if="$slots.prefix" style="display: contents" slot="prefix"><slot name="prefix" /></span>
    <span v-if="$slots.suffix" style="display: contents" slot="suffix"><slot name="suffix" /></span>
    <!-- Default slot: options / option-groups project naturally. -->
    <slot />
  </tulpar-select>
</template>
