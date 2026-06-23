<script setup lang="ts">
/**
 * TulparAvatar — identity atom (v0.13).
 *
 * Renders a `<tulpar-avatar>` web component. Forwards every scalar prop as an
 * attribute. The core has no named slots — only the default slot is forwarded
 * (intentionally; the element drives its own image / initials / icon cascade).
 */
import "@tulpar-ui/core/avatar";
import type { AvatarShape, AvatarSize } from "@tulpar-ui/core/avatar";

interface Props {
  /** Image source. When it loads, the image renders over all fallbacks. */
  src?: string;
  /** Person / entity name — drives initials, deterministic color + a11y name. */
  name?: string;
  /** Manual initials override (wins over name-derived initials). */
  initials?: string;
  /** Image alt text. Falls back to `name` when omitted. */
  alt?: string;
  /** Corner shape. */
  shape?: AvatarShape;
  /** Size tier. */
  size?: AvatarSize;
  /** Single-accent override for the initials background. */
  color?: string;
}

const { src, name, initials, alt, shape, size, color } = defineProps<Props>();
</script>

<template>
  <tulpar-avatar
    :src="src ?? undefined"
    :name="name ?? undefined"
    :initials="initials ?? undefined"
    :alt="alt ?? undefined"
    :shape="shape ?? undefined"
    :size="size ?? undefined"
    :color="color ?? undefined"
  >
    <slot />
  </tulpar-avatar>
</template>
