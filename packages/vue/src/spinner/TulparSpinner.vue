<script setup lang="ts">
/**
 * TulparSpinner — indeterminate loader atom (v0.13).
 *
 * Renders a `<tulpar-spinner>` web component. Forwards every scalar prop as an
 * attribute and the `label` named slot through a display:contents carrier so
 * the core shadow `<slot name="label">` receives it (see CLAUDE.md Vue slot
 * gotcha). `track` defaults to true to match the core.
 */
import "@tulpar-ui/core/spinner";
import type { SpinnerSize, SpinnerTone } from "@tulpar-ui/core/spinner";

interface Props {
  /** Size tier (outer diameter). */
  size?: SpinnerSize;
  /** Tone. OMITTED → inherit currentColor. Built-in / "custom" colorizes. */
  tone?: SpinnerTone;
  /** Custom-tone base: a brand family name or any CSS color. */
  color?: string;
  /** Faint full track ring behind the arc. */
  track?: boolean;
  /** Delay (ms) before the spinner renders. 0 = render immediately. */
  delay?: number;
  /** Accessible name (visually-hidden). Overridden by a `slot="label"`. */
  label?: string;
}

const { size, tone, color, track = true, delay, label } = defineProps<Props>();
</script>

<template>
  <tulpar-spinner
    :size="size ?? undefined"
    :tone="tone ?? undefined"
    :color="color ?? undefined"
    :track="track || undefined"
    :delay="delay ?? undefined"
    :label="label ?? undefined"
  >
    <span v-if="$slots.label" style="display: contents" slot="label"><slot name="label" /></span>
  </tulpar-spinner>
</template>
