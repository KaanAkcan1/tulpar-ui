<script setup lang="ts">
/**
 * TulparOption — single option inside `<tulpar-select>` (v0.14).
 *
 * Renders a `<tulpar-option>` web component. Forwards scalar props as
 * attributes and named slots (icon / description) through display:contents
 * carriers so the core's shadow named slots receive them correctly.
 * The default slot is projected naturally (the option's label text).
 */
import "@tulpar-ui/core/select";

interface Props {
  /** The option value — passed to the parent Select on selection. Required. */
  value: string;
  /** Convenience label (alias of the default slot). Slot wins when both set. */
  label?: string;
  /** Optional description line (alias of the `description` slot). Slot wins. */
  description?: string;
  /** Dims + marks as non-selectable. Keyboard nav skips disabled options. */
  disabled?: boolean;
}

const { value, label, description, disabled = false } = defineProps<Props>();
</script>

<template>
  <tulpar-option
    :value="value"
    :label="label ?? undefined"
    :description="description ?? undefined"
    :disabled="disabled || undefined"
  >
    <!-- Named slot carriers for icon and description. -->
    <span v-if="$slots.icon" style="display: contents" slot="icon"><slot name="icon" /></span>
    <span v-if="$slots.description" style="display: contents" slot="description"
      ><slot name="description"
    /></span>
    <!-- Default slot: the label text. Guarded with v-if so a prop-only option
         (`<TulparOption :label="…" />` with no slot content) does NOT project
         Vue's whitespace `#text` placeholder nodes into the core's default slot —
         those empty assigned nodes would otherwise suppress the core's
         `<slot>${this.label}</slot>` fallback and render a blank option row. -->
    <slot v-if="$slots.default" />
  </tulpar-option>
</template>
