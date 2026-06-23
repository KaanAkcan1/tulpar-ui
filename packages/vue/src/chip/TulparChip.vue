<script setup lang="ts">
/**
 * TulparChip — interactive tonal label atom (v0.13).
 *
 * Renders a `<tulpar-chip>` web component. Forwards every scalar prop as an
 * attribute, the `icon` + `avatar` named slots through display:contents
 * carriers (see CLAUDE.md Vue slot gotcha), and bridges the core CustomEvents:
 *   - `tulpar-click`  → `clicked` output
 *   - `tulpar-remove` → `removed` output
 * Emit names mirror the Angular wrapper for cross-framework consistency.
 */
import "@tulpar-ui/core/chip";
import type { ChipVariant, ChipShape, ChipSize } from "@tulpar-ui/core/chip";

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
  /** Visual variant. `ghost` = transparent rest → soft-tonal hover. */
  variant?: ChipVariant;
  /** Corner shape. */
  shape?: ChipShape;
  /** Size tier. */
  size?: ChipSize;
  /** Leading icon: name, raw SVG string, or emoji. `slot="icon"` wins. */
  icon?: string;
  /** Leading avatar: an image URL or initials. `slot="avatar"` wins. */
  avatar?: string;
  /** Show the trailing remove control (an independent tab stop). */
  removable?: boolean;
  /** Dim + non-interactive + not focusable. */
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
  icon,
  avatar,
  removable = false,
  disabled = false,
  label,
} = defineProps<Props>();

const emit = defineEmits<{
  /** Fires when the chip body is activated (click / Enter / Space). */
  clicked: [event: CustomEvent];
  /** Fires when the remove control fires (click / Delete / Backspace). */
  removed: [event: CustomEvent];
}>();
</script>

<template>
  <tulpar-chip
    :tone="tone ?? undefined"
    :color="color ?? undefined"
    :bg="bg ?? undefined"
    :accent="accent ?? undefined"
    :text="text ?? undefined"
    :variant="variant ?? undefined"
    :shape="shape ?? undefined"
    :size="size ?? undefined"
    :icon="icon ?? undefined"
    :avatar="avatar ?? undefined"
    :removable="removable || undefined"
    :disabled="disabled || undefined"
    :label="label ?? undefined"
    @tulpar-click="emit('clicked', $event as CustomEvent)"
    @tulpar-remove="emit('removed', $event as CustomEvent)"
  >
    <span v-if="$slots.avatar" style="display: contents" slot="avatar"><slot name="avatar" /></span>
    <span v-if="$slots.icon" style="display: contents" slot="icon"><slot name="icon" /></span>
    <slot />
  </tulpar-chip>
</template>
