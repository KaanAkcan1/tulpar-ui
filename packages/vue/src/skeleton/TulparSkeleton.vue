<script setup lang="ts">
/**
 * TulparSkeleton — loading placeholder atom (v0.13).
 *
 * Renders a `<tulpar-skeleton>` web component. Forwards every scalar prop as an
 * attribute. The core is purely decorative (aria-hidden) and has no slots.
 */
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

const { variant, lines, width, height, radius, animation } = defineProps<Props>();
</script>

<template>
  <tulpar-skeleton
    :variant="variant ?? undefined"
    :lines="lines ?? undefined"
    :width="width ?? undefined"
    :height="height ?? undefined"
    :radius="radius ?? undefined"
    :animation="animation ?? undefined"
  />
</template>
