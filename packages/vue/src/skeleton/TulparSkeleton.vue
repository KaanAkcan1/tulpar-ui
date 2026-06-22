<script setup lang="ts">
/**
 * TulparSkeleton — loading placeholder atom (v0.13).
 *
 * Renders a `<tulpar-skeleton>` web component. Forwards every scalar prop as an
 * attribute. The core is purely decorative (aria-hidden) and has no slots.
 */
import { ref, watchEffect } from "vue";
import "@tulpar-ui/core/skeleton";
import type { SkeletonVariant, SkeletonAnimation } from "@tulpar-ui/core/skeleton";

interface Props {
  /** Shape variant. */
  variant?: SkeletonVariant;
  /** Number of text-line bars (text variant only). */
  lines?: number;
  /** Explicit width override (any CSS length). */
  width?: string;
  /** Explicit height override (any CSS length). */
  height?: string;
  /** Explicit corner-radius override (any CSS length). */
  radius?: string;
  /** Animation style. */
  animation?: SkeletonAnimation;
}

const props = defineProps<Props>();

// ── DOM property binding for `lines` ──────────────────────────────────────────
// `lines` is set as a JS property — and only when provided. Binding
// `:lines="undefined"` in the template overwrites the core's reactive default
// (lines=1) with `undefined`, collapsing the text variant to zero bars. Setting
// it via a template ref + watchEffect leaves the core default intact when the
// prop is omitted.
const skeletonRef = ref<HTMLElement & { lines?: number }>();

watchEffect(() => {
  const el = skeletonRef.value;
  if (!el) return;
  if (props.lines !== undefined) el.lines = props.lines;
});
</script>

<template>
  <tulpar-skeleton
    ref="skeletonRef"
    :variant="props.variant ?? undefined"
    :width="props.width ?? undefined"
    :height="props.height ?? undefined"
    :radius="props.radius ?? undefined"
    :animation="props.animation ?? undefined"
  />
</template>
