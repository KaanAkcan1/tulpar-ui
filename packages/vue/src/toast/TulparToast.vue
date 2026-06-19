<script setup lang="ts">
/**
 * TulparToast — declarative / rich SFC (Task 6.2).
 *
 * Renders a `<tulpar-toast>` web component with:
 *  - prop → attribute bindings for all scalar props
 *  - `actions` set as a DOM property via template ref + watchEffect
 *    (functions cannot be serialised to HTML attributes)
 *  - Named slot forwarding through display:contents carriers so the
 *    real `slot` attribute is preserved and the core shadow slot receives
 *    the content.  See CLAUDE.md Vue slot-forwarding gotcha.
 *  - Event forwarding: tulpar-dismiss → emit('dismissed'), tulpar-action → emit('action')
 *
 * Vite config reminder for consuming apps:
 *   vue({ template: { compilerOptions: { isCustomElement: (tag) => tag.startsWith("tulpar-") } } })
 */
import { ref, watchEffect } from "vue";
import "@tulpar-ui/core/toast";
import type { ToastAction, ToneValue } from "@tulpar-ui/core/toast";

interface Props {
  /** Semantic tone variant. */
  tone?: ToneValue;
  /** Custom tone: brand family name or raw CSS color. */
  color?: string;
  /** Custom tone surface (bg) override. */
  bg?: string;
  /** Custom tone accent override. */
  accent?: string;
  /** Custom tone on-surface text override. */
  text?: string;
  /**
   * High-contrast escalation (danger only).
   * Bound as a boolean attribute — false means attribute absent.
   */
  highContrast?: boolean;
  /**
   * Toast heading / title text. Maps to the `heading` attribute on
   * `<tulpar-toast>` (not `title`) to avoid the native tooltip side-effect.
   */
  heading?: string;
  /** Description / body text below the heading. */
  description?: string;
  /**
   * Icon control. Built-in name / raw SVG / emoji / "" (no icon).
   * `slot="icon"` wins when both are present.
   */
  icon?: string;
  /** Show the × close button. */
  closable?: boolean;
  /**
   * Action buttons. Set as a DOM property (not an attribute) since
   * attributes cannot carry onClick functions.
   */
  actions?: ToastAction[];
  /** Show the perimeter countdown ring. */
  timer?: boolean;
  /** Auto-dismiss duration in ms. 0 = persistent. */
  duration?: number;
  /** Ring visual style: 'track' (default) | 'soft'. */
  timerStyle?: "track" | "soft";
}

const props = withDefaults(defineProps<Props>(), {
  tone: "info",
  closable: true,
  timer: true,
  duration: 5000,
  timerStyle: "track",
  highContrast: false,
  actions: () => [],
});

const emit = defineEmits<{
  /** Fires when the core element dispatches `tulpar-dismiss`. */
  dismissed: [detail: { reason: string }];
  /** Fires when the core element dispatches `tulpar-action`. */
  action: [detail: { label: string; action: ToastAction }];
}>();

// ── DOM property binding for `actions` ────────────────────────────────────────
//
// `actions` is an array of objects containing onClick functions. Functions
// cannot be serialised to HTML attributes, so we must set this as a JS
// property on the element directly. We use a template ref + watchEffect so
// the property stays in sync whenever the prop array changes.

const toastRef = ref<HTMLElement & { actions?: ToastAction[] }>();

watchEffect(() => {
  if (toastRef.value) {
    toastRef.value.actions = props.actions;
  }
});

// ── Event forwarding ──────────────────────────────────────────────────────────

function onDismiss(e: Event) {
  emit("dismissed", (e as CustomEvent).detail);
}

function onAction(e: Event) {
  emit("action", (e as CustomEvent).detail);
}
</script>

<template>
  <!--
    Boolean attr semantics (Lit):
    - `|| undefined` → truthy boolean → attr present (e.g. closable, timer)
    - `|| undefined` on false → undefined → Vue omits the attr (Lit sees absent = false)

    String attrs: `?? undefined` passes through the string value or omits
    the attr when undefined/null (Lit picks up the prop default internally).

    highContrast maps to `high-contrast` (kebab-case) — Vue's template
    compiler converts camelCase prop names to kebab-case attrs automatically
    when bound with v-bind syntax.

    `actions` is NOT bound here as an attr — it is set as a DOM property via
    the template ref + watchEffect above.
  -->
  <tulpar-toast
    ref="toastRef"
    :tone="tone"
    :color="color ?? undefined"
    :bg="bg ?? undefined"
    :accent="accent ?? undefined"
    :text="text ?? undefined"
    :high-contrast="highContrast || undefined"
    :heading="heading ?? undefined"
    :description="description ?? undefined"
    :icon="icon ?? undefined"
    :closable="closable || undefined"
    :timer="timer || undefined"
    :duration="duration"
    :timer-style="timerStyle"
    @tulpar-dismiss="onDismiss"
    @tulpar-action="onAction"
  >
    <!--
      Named slot forwarding via display:contents carriers.

      PROBLEM: A Vue SFC that renders <slot name="title" /> directly inside a
      web component does NOT forward to the shadow <slot name="title"> — Vue
      compiles the slot-name targeting and removes the `slot` attribute, so
      the core's named shadow slot stays empty.

      SOLUTION: Wrap each named slot in a transparent <span> that keeps the
      real `slot` attribute. The `style="display:contents"` makes the span
      layout-invisible — it does not affect box model, stacking, or sizing.
      The span IS in the light DOM with `slot="title"`, so the core's shadow
      slot assignment works correctly.

      See CLAUDE.md § "Vue wrapper slot forwarding (gotcha)".
    -->
    <span v-if="$slots.title" style="display:contents" slot="title">
      <slot name="title" />
    </span>

    <span v-if="$slots.description" style="display:contents" slot="description">
      <slot name="description" />
    </span>

    <span v-if="$slots.icon" style="display:contents" slot="icon">
      <slot name="icon" />
    </span>

    <!--
      Default slot — projects into the web component's unnamed default slot.
      No carrier needed: Vue renders the content without a `slot` attribute,
      which is exactly what a default (unnamed) slot expects.
    -->
    <slot />
  </tulpar-toast>
</template>
