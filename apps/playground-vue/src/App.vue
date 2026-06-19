<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  BookOpen,
  CheckSquare,
  CircleDot,
  FormInput,
  Hash,
  Layers,
  ListChecks,
  MessageCircle,
  MessageSquare,
  MessageSquareText,
  Palette,
  SquareMousePointer,
  TextCursorInput,
  ToggleLeft,
  WrapText,
} from "lucide-vue-next";
import { TulparShell, TulparTopbar, TulparSidenav } from "@tulpar-ui/vue";
import type { ShellSidenavMode, TulparNavItemVueData } from "@tulpar-ui/vue";

// SPA navigation: sidenav links (inline AND rail flyout) dispatch the cancelable
// `tulpar-navigate` event (composed → reaches window). Intercept it, prevent the
// native full-page navigation, and route via vue-router so app state (sidenav
// mode, collapsed, dark) survives. Then notify the web components to refresh
// their active state (they listen for `tulpar-location-changed`).
const router = useRouter();
const onNavigate = (e: Event) => {
  const ce = e as CustomEvent<{ href?: string }>;
  const href = ce.detail?.href;
  if (!href) return;
  ce.preventDefault();
  void router.push(href).then(() => {
    window.dispatchEvent(new Event("tulpar-location-changed"));
  });
};
onMounted(() => window.addEventListener("tulpar-navigate", onNavigate));
onUnmounted(() => window.removeEventListener("tulpar-navigate", onNavigate));

type SidenavPosition = "left" | "right";
type SidenavDensity = "comfortable" | "compact";
type SidenavLayout = "under-topbar" | "over-topbar";

/** Initial dark-mode state — the built-in sidenav toggle flips it from here on. */
const dark = ref(false);

/** Sidenav mode — bound to the shell and switchable live from the configurator. */
const sidenavMode = ref<ShellSidenavMode>("static");

/** Sidenav layout (under/over the topbar) — dogfood the new shell prop. */
const sidenavLayout = ref<SidenavLayout>("under-topbar");

/** Sidenav position + density — dogfood the new sidenav props from the aside. */
const position = ref<SidenavPosition>("left");
const density = ref<SidenavDensity>("comfortable");

/** Aside (configurator) drawer open state — driven via v-model on the shell. */
const asideOpen = ref(false);

/** Data-driven menu — lucide functional components handled by the wrapper. */
const menu: TulparNavItemVueData[] = [
  {
    type: "section",
    label: "Components",
    items: [
      { label: "Button", href: "/button", icon: SquareMousePointer },
      // Collapsible group: a nav-item with its own `items` renders as an
      // expandable group with a chevron. Demonstrates nesting + single-expand.
      {
        label: "Form Inputs",
        icon: FormInput,
        items: [
          { label: "TextInput", href: "/text-input", icon: TextCursorInput },
          { label: "Textarea", href: "/textarea", icon: WrapText },
          { label: "NumberInput", href: "/number-input", icon: Hash },
        ],
      },
      {
        label: "Selection",
        icon: CheckSquare,
        items: [
          { label: "Switch", href: "/switch", icon: ToggleLeft },
          { label: "Checkbox", href: "/checkbox", icon: CheckSquare },
          { label: "RadioGroup", href: "/radio-group", icon: CircleDot },
          { label: "CheckboxGroup", href: "/checkbox-group", icon: ListChecks },
        ],
      },
      // Overlay — directive-driven tooltip / toggletip / popover family (v0.11).
      {
        label: "Overlay",
        icon: Layers,
        items: [
          { label: "Tooltip", href: "/tooltip", icon: MessageSquare },
          { label: "Toggletip", href: "/toggletip", icon: MessageCircle },
          { label: "Popover", href: "/popover", icon: MessageSquareText },
        ],
      },
    ],
  },
  {
    type: "section",
    label: "Foundations",
    items: [{ label: "Colors", href: "/colors", icon: Palette }],
  },
  {
    type: "section",
    label: "Guides",
    items: [{ label: "Sidebar & Theme", href: "/guide", icon: BookOpen }],
  },
];

const sidenavModes: { value: ShellSidenavMode; label: string }[] = [
  { value: "static", label: "Static" },
  { value: "overlay", label: "Overlay" },
  { value: "rail", label: "Rail" },
];

const layouts: { value: SidenavLayout; label: string }[] = [
  { value: "under-topbar", label: "Under topbar" },
  { value: "over-topbar", label: "Over topbar" },
];

const positions: { value: SidenavPosition; label: string }[] = [
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

const densities: { value: SidenavDensity; label: string }[] = [
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
];

function onLogout() {
  // Placeholder action — a real app would clear the session and redirect.
  // eslint-disable-next-line no-console
  console.info("[playground-vue] logout requested");
}
</script>

<template>
  <TulparShell
    :sidenav-mode="sidenavMode"
    :sidenav-layout="sidenavLayout"
    persist-key="playground-vue-shell"
    :dark="dark"
    v-model:aside-open="asideOpen"
  >
    <!-- ── Topbar ───────────────────────────────────────────────────────── -->
    <TulparTopbar slot="topbar">
      <span slot="start" class="topbar-tag">Vue playground</span>
    </TulparTopbar>

    <!-- ── Sidenav (self-contained: built-in brand, toggle, utility, account) -->
    <TulparSidenav
      slot="sidenav"
      nav-label="Main navigation"
      :items="menu"
      :position="position"
      :density="density"
      :single-expand="true"
      :show-config="true"
      config-text="Configurator"
      user-name="Kaan Akcan"
      user-role="Owner"
      :show-settings="true"
      :show-logout="true"
      @config="asideOpen = true"
      @settings="asideOpen = true"
      @logout="onLogout"
    />

    <!-- ── Routed page content (default slot) ───────────────────────────── -->
    <router-view />

    <!-- ── Aside: configurator drawer (dogfoods the shell's aside panel) ──── -->
    <section slot="aside" class="settings" aria-label="Shell configurator">
      <header class="settings-head">
        <h2>Configurator</h2>
        <button
          type="button"
          class="settings-close"
          aria-label="Close configurator"
          @click="asideOpen = false"
        >
          ✕
        </button>
      </header>

      <fieldset class="setting">
        <legend>Sidenav mode</legend>
        <div class="segmented" role="radiogroup" aria-label="Sidenav mode">
          <label v-for="m in sidenavModes" :key="m.value" :class="{ on: sidenavMode === m.value }">
            <input
              type="radio"
              name="sidenav-mode"
              :value="m.value"
              :checked="sidenavMode === m.value"
              @change="sidenavMode = m.value"
            />
            <span>{{ m.label }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="setting">
        <legend>Sidenav layout</legend>
        <div class="segmented" role="radiogroup" aria-label="Sidenav layout">
          <label v-for="l in layouts" :key="l.value" :class="{ on: sidenavLayout === l.value }">
            <input
              type="radio"
              name="sidenav-layout"
              :value="l.value"
              :checked="sidenavLayout === l.value"
              @change="sidenavLayout = l.value"
            />
            <span>{{ l.label }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="setting">
        <legend>Position</legend>
        <div class="segmented" role="radiogroup" aria-label="Sidenav position">
          <label v-for="p in positions" :key="p.value" :class="{ on: position === p.value }">
            <input
              type="radio"
              name="position"
              :value="p.value"
              :checked="position === p.value"
              @change="position = p.value"
            />
            <span>{{ p.label }}</span>
          </label>
        </div>
      </fieldset>

      <fieldset class="setting">
        <legend>Density</legend>
        <div class="segmented" role="radiogroup" aria-label="Sidenav density">
          <label v-for="d in densities" :key="d.value" :class="{ on: density === d.value }">
            <input
              type="radio"
              name="density"
              :value="d.value"
              :checked="density === d.value"
              @change="density = d.value"
            />
            <span>{{ d.label }}</span>
          </label>
        </div>
      </fieldset>

      <p class="settings-hint">
        Brand, navigation, the Dark/Light toggle and the account block are all rendered by
        <code>&lt;TulparSidenav&gt;</code> from props — no app markup. Sidenav mode persists across
        reloads via <code>persist-key</code>; the rest reset on reload. Close with Esc, the ✕, or
        the backdrop.
      </p>
    </section>
  </TulparShell>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
  background: var(--tulpar-color-bg-surface, #f0f7f5);
  color: var(--tulpar-color-text-primary, #15110b);
  line-height: 1.5;
}

/*
 * Bottom-gap fix: the last .doc-section on every demo page carries
 * margin-bottom: 48px (from its scoped style) which adds ~48 px of
 * blank space below the visible content inside the shell's scrollable
 * <main> region (which already has its own 1.5 rem bottom padding).
 * Resetting margin-bottom to 0 on the last section removes that
 * redundant gap while keeping the padding-bottom (which is part of the
 * section's visual structure above the border).
 */
.doc-section:last-child {
  margin-bottom: 0;
}

.topbar-tag {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* ── Aside configurator panel ──────────────────────────────────────────── */
.settings {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 20px;
}

.settings-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.settings-head h2 {
  margin: 0;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 18px;
  font-weight: 600;
}

.settings-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--tulpar-color-text-muted, #74777a);
  font-size: 15px;
  cursor: pointer;
}

.settings-close:hover {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  color: var(--tulpar-color-text-primary, #15110b);
}

.settings-close:focus-visible {
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
  outline-offset: 2px;
}

.setting {
  margin: 0;
  padding: 0;
  border: none;
}

.setting legend {
  padding: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* Segmented control — real radios, visually a segmented button group */
.segmented {
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 10px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.segmented label {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: 7px;
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #27231d);
  cursor: pointer;
  user-select: none;
  transition:
    background 150ms ease-out,
    color 150ms ease-out;
}

.segmented label:hover {
  color: var(--tulpar-color-text-primary, #15110b);
}

.segmented label.on {
  background: var(--tulpar-color-bg-surface, #fff);
  color: var(--tulpar-color-brand-default, #00c57a);
  font-weight: 600;
  box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.08));
}

/* visually hide the native radio but keep it accessible + focusable */
.segmented input {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
}

.segmented label:focus-within {
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .segmented label {
    transition: none;
  }
}

.settings-hint {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--tulpar-color-text-muted, #74777a);
}

.settings-hint code {
  font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}
</style>
