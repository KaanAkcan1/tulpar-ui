<script setup lang="ts">
/**
 * TulparBadge — count / status indicator atom (v0.13).
 *
 * Renders a `<tulpar-badge>` web component. Forwards every scalar prop as an
 * attribute. Only the default slot is supported by the core (no named slots).
 */
import "@tulpar-ui/core/badge";
import type { BadgeTone, BadgeVariant, BadgeShape, BadgeSize } from "@tulpar-ui/core/badge";

interface Props {
  /** Tone (status / category). */
  tone?: BadgeTone;
  /** Visual variant. */
  variant?: BadgeVariant;
  /** Numeric count. Ignored in `dot` mode. */
  count?: number;
  /** Overflow cap: counts above this render as `${max}+`. */
  max?: number;
  /** Show the badge when `count === 0` (hidden by default). */
  showZero?: boolean;
  /** Bare status dot (ignores count). */
  dot?: boolean;
  /** Corner shape. */
  shape?: BadgeShape;
  /** Size tier. */
  size?: BadgeSize;
  /** Convenience short label (alias of the default slot). */
  label?: string;
}

const {
  tone,
  variant,
  count,
  max,
  showZero = false,
  dot = false,
  shape,
  size,
  label,
} = defineProps<Props>();
</script>

<template>
  <tulpar-badge
    :tone="tone ?? undefined"
    :variant="variant ?? undefined"
    :count="count ?? undefined"
    :max="max ?? undefined"
    :show-zero="showZero || undefined"
    :dot="dot || undefined"
    :shape="shape ?? undefined"
    :size="size ?? undefined"
    :label="label ?? undefined"
  >
    <slot />
  </tulpar-badge>
</template>
