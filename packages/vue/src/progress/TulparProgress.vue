<script setup lang="ts">
/**
 * TulparProgress — linear + circular progress atom (v0.13).
 *
 * Renders a `<tulpar-progress>` web component. Forwards every scalar prop as an
 * attribute and the `label` named slot through a display:contents carrier.
 *
 * `valueLabel` is set as a DOM PROPERTY (not an attribute) via a template ref +
 * watchEffect, because it can be a boolean OR a formatter function — functions
 * cannot be serialised to HTML attributes. The core declares it as
 * `@property({ attribute: false })`, so it is property-only by design.
 */
import { ref, watchEffect } from "vue";
import "@tulpar-ui/core/progress";
import type {
  ProgressVariant,
  ProgressTone,
  ProgressThickness,
  ProgressSize,
  ProgressValueFormatter,
} from "@tulpar-ui/core/progress";

interface Props {
  /** Linear (default) or circular. */
  variant?: ProgressVariant;
  /** Current value (clamped to min..max). Ignored when indeterminate. */
  value?: number;
  /** Lower bound. */
  min?: number;
  /** Upper bound. */
  max?: number;
  /** Unknown-duration mode (traveling bar / rotating arc). */
  indeterminate?: boolean;
  /** Secondary "buffered" value (linear only). */
  buffer?: number;
  /** Tone. Default fill is brand green; built-in / "custom" recolors it. */
  tone?: ProgressTone;
  /** Custom-tone base: a brand family name or any CSS color. */
  color?: string;
  /** Auto-promote to success once value >= max (a consumer's danger wins). */
  stateTone?: boolean;
  /** Bar thickness (linear). */
  thickness?: ProgressThickness;
  /** Ring size (circular). */
  size?: ProgressSize;
  /**
   * Value label: `true` → `${pct}%`; a formatter → its return.
   * Set as a DOM property (not an attribute).
   */
  valueLabel?: boolean | ProgressValueFormatter;
}

const props = withDefaults(defineProps<Props>(), {
  indeterminate: false,
  stateTone: false,
  valueLabel: false,
});

// ── DOM property binding for `valueLabel` ─────────────────────────────────────
// `valueLabel` may be a function (formatter), which cannot be serialised to an
// HTML attribute. The core declares it `attribute: false`, so we set it as a JS
// property on the element directly via a template ref + watchEffect.
const progressRef = ref<HTMLElement & { valueLabel?: boolean | ProgressValueFormatter }>();

watchEffect(() => {
  if (progressRef.value) {
    progressRef.value.valueLabel = props.valueLabel;
  }
});
</script>

<template>
  <tulpar-progress
    ref="progressRef"
    :variant="props.variant ?? undefined"
    :value="props.value ?? undefined"
    :min="props.min ?? undefined"
    :max="props.max ?? undefined"
    :indeterminate="props.indeterminate || undefined"
    :buffer="props.buffer ?? undefined"
    :tone="props.tone ?? undefined"
    :color="props.color ?? undefined"
    :state-tone="props.stateTone || undefined"
    :thickness="props.thickness ?? undefined"
    :size="props.size ?? undefined"
  >
    <span v-if="$slots.label" style="display: contents" slot="label"><slot name="label" /></span>
  </tulpar-progress>
</template>
