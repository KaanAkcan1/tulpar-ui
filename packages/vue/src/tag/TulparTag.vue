<script setup lang="ts">
/**
 * TulparTag — static tonal metadata atom (v0.13).
 *
 * Renders a `<tulpar-tag>` web component. Forwards every scalar prop as an
 * attribute and the `icon` named slot through a display:contents carrier so the
 * core shadow `<slot name="icon">` receives it (see CLAUDE.md Vue slot gotcha).
 */
import "@tulpar-ui/core/tag";
import type { TagVariant, TagShape, TagSize } from "@tulpar-ui/core/tag";

interface Props {
  /** Tone (status / category). Built-in or "custom". */
  tone?: string;
  /** Custom-tone base: a brand family name or any raw CSS color. */
  color?: string;
  /** Custom-tone surface override. */
  bg?: string;
  /** Custom-tone accent override. */
  accent?: string;
  /** Custom-tone text override. */
  text?: string;
  /** Visual variant. */
  variant?: TagVariant;
  /** Corner shape. */
  shape?: TagShape;
  /** Size tier. */
  size?: TagSize;
  /** Show a leading tone-colored dot (ignored when `icon` is set). */
  dot?: boolean;
  /** Leading icon: raw SVG string or emoji. `slot="icon"` wins. */
  icon?: string;
  /** Dim + non-interactive. */
  disabled?: boolean;
  /** Convenience label (alias of the default slot). Slot wins when both set. */
  label?: string;
}

const {
  tone,
  color,
  bg,
  accent,
  text,
  variant,
  shape,
  size,
  dot = false,
  icon,
  disabled = false,
  label,
} = defineProps<Props>();
</script>

<template>
  <tulpar-tag
    :tone="tone ?? undefined"
    :color="color ?? undefined"
    :bg="bg ?? undefined"
    :accent="accent ?? undefined"
    :text="text ?? undefined"
    :variant="variant ?? undefined"
    :shape="shape ?? undefined"
    :size="size ?? undefined"
    :dot="dot || undefined"
    :icon="icon ?? undefined"
    :disabled="disabled || undefined"
    :label="label ?? undefined"
  >
    <span v-if="$slots.icon" style="display: contents" slot="icon"><slot name="icon" /></span>
    <slot />
  </tulpar-tag>
</template>
