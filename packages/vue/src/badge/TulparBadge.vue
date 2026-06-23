<script setup lang="ts">
/**
 * TulparBadge — count / status indicator atom (v0.13).
 *
 * Renders a `<tulpar-badge>` web component. Forwards every scalar prop as an
 * attribute. Only the default slot is supported by the core (no named slots).
 */
import { ref, watchEffect } from "vue";
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

const props = withDefaults(defineProps<Props>(), {
  showZero: false,
  dot: false,
});

// ── DOM property binding for numeric props ────────────────────────────────────
// `count` / `max` are set as JS properties — and only when provided. Binding
// `:max="undefined"` in the template overwrites the core's reactive default
// (max=99) with `undefined`, which coerces to 0 and makes every count render as
// "0+". Setting them via a template ref + watchEffect leaves the core defaults
// intact when a prop is omitted.
const badgeRef = ref<HTMLElement & { count?: number; max?: number }>();

watchEffect(() => {
  const el = badgeRef.value;
  if (!el) return;
  if (props.count !== undefined) el.count = props.count;
  if (props.max !== undefined) el.max = props.max;
});
</script>

<template>
  <tulpar-badge
    ref="badgeRef"
    :tone="props.tone ?? undefined"
    :variant="props.variant ?? undefined"
    :show-zero="props.showZero || undefined"
    :dot="props.dot || undefined"
    :shape="props.shape ?? undefined"
    :size="props.size ?? undefined"
    :label="props.label ?? undefined"
  >
    <slot />
  </tulpar-badge>
</template>
