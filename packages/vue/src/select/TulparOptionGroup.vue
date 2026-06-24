<script setup lang="ts">
/**
 * TulparOptionGroup — groups `<tulpar-option>` children under a header (v0.14).
 *
 * Renders a `<tulpar-option-group>` web component. Forwards the `label` prop
 * as an attribute and the `label` named slot through a display:contents carrier
 * so the core's shadow `<slot name="label">` receives it correctly.
 * The default slot projects `<tulpar-option>` children naturally.
 */
import "@tulpar-ui/core/select";

interface Props {
  /** Convenience label (alias of the `label` slot). Slot wins when both set. */
  label?: string;
}

const { label } = defineProps<Props>();
</script>

<template>
  <tulpar-option-group :label="label ?? undefined">
    <!-- Named slot carrier for the group header label. -->
    <span v-if="$slots.label" style="display: contents" slot="label"><slot name="label" /></span>
    <!-- Default slot: projects <tulpar-option> children. -->
    <slot />
  </tulpar-option-group>
</template>
