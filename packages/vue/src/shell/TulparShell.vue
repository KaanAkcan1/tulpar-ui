<script setup lang="ts">
import "@tulpar-ui/shell";
import { getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { ShellSidenavMode, ShellState, TulparShell as TulparShellEl } from "@tulpar-ui/shell";
import { persistShellState } from "@tulpar-ui/shell";

// Minimal structural type for the bits of a vue-router instance we use. We never
// import `vue-router` statically — that would force router-less apps to install
// it (the externalized bare import would fail to resolve at runtime). Instead we
// resolve it dynamically below; when absent, the nav-item's native <a> takes over.
interface RouterLike {
  push: (to: string) => unknown;
  afterEach: (hook: () => void) => () => void;
}

interface Props {
  sidenavMode?: ShellSidenavMode;
  mobileBreakpoint?: string;
  sidenavCollapsed?: boolean;
  asideOpen?: boolean;
  contentWidth?: "fluid" | "fixed";
  contentPadding?: "none" | "compact" | "comfortable";
  footerMode?: "inline" | "fixed";
  persistKey?: string;
  dark?: boolean;
}

const {
  sidenavMode = "static",
  mobileBreakpoint = "(max-width: 991px)",
  contentWidth = "fluid",
  contentPadding = "comfortable",
  footerMode = "inline",
  asideOpen = false,
  dark = false,
  persistKey,
} = defineProps<Props>();

const emit = defineEmits<{
  "update:asideOpen": [value: boolean];
  "shell-change": [state: ShellState];
}>();

const el = ref<TulparShellEl>();

// Resolve the active vue-router instance WITHOUT importing `vue-router`. When an
// app calls `app.use(router)`, vue-router registers itself on the app context's
// globalProperties as `$router` — the very instance `useRouter()` would inject.
// Reading it here keeps vue-router a fully optional peer: a router-less app has
// no `$router`, `router` stays undefined, and the nav-item's native <a>
// navigation takes over. No static import means no module-resolution failure
// when the package isn't installed, and no async/Suspense setup.
const instance = getCurrentInstance();
const router = instance?.appContext.config.globalProperties.$router as RouterLike | undefined;
let removeRouterHook: (() => void) | undefined;
let dispose: (() => void) | undefined;

onMounted(() => {
  if (persistKey && el.value) dispose = persistShellState(el.value, persistKey);
  removeRouterHook = router?.afterEach(() =>
    window.dispatchEvent(new Event("tulpar-location-changed")),
  );
  // Apply the initial dark value once the element ref exists (the watch below
  // only fires on subsequent changes; el.value is still undefined during setup).
  if (el.value) el.value.dark = dark;
});

onBeforeUnmount(() => {
  dispose?.();
  removeRouterHook?.();
});

watch(
  () => dark,
  (v) => {
    if (el.value) el.value.dark = v;
  },
);

function onNavigate(e: Event) {
  if (!router) return; // no router → let native <a> navigation happen
  e.preventDefault();
  router.push((e as CustomEvent).detail.href);
}
</script>

<template>
  <tulpar-shell
    ref="el"
    :sidenav-mode="sidenavMode"
    :mobile-breakpoint="mobileBreakpoint"
    :sidenav-collapsed="sidenavCollapsed || undefined"
    :aside-open="asideOpen || undefined"
    :content-width="contentWidth"
    :content-padding="contentPadding"
    :footer-mode="footerMode"
    @tulpar-navigate="onNavigate"
    @tulpar-aside-close="emit('update:asideOpen', false)"
    @tulpar-shell-change="emit('shell-change', ($event as CustomEvent).detail)"
  >
    <slot name="topbar" />
    <slot name="sidenav" />
    <slot />
    <slot name="footer" />
    <slot name="aside" />
  </tulpar-shell>
</template>
