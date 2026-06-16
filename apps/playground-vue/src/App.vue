<script setup lang="ts">
import { ref } from "vue";
import { TulparShell, TulparTopbar, TulparSidenav } from "@tulpar-ui/vue";
import type { TulparNavItemData, ShellSidenavMode } from "@tulpar-ui/vue";

/** Dark-mode flag — forwarded to the shell, which toggles the `.dark` class. */
const dark = ref(false);

/** Sidenav mode — bound to the shell and switchable live from the settings drawer. */
const sidenavMode = ref<ShellSidenavMode>("static");

/** Aside (settings) drawer open state — driven via v-model on the shell. */
const asideOpen = ref(false);

const sidenavModes: { value: ShellSidenavMode; label: string }[] = [
  { value: "static", label: "Static" },
  { value: "overlay", label: "Overlay" },
  { value: "rail", label: "Rail" },
];

/** Sidenav menu — hrefs map 1:1 to the routes declared in router.ts. */
const menu: TulparNavItemData[] = [
  {
    label: "Components",
    items: [
      { label: "Button", href: "/button" },
      { label: "TextInput", href: "/text-input" },
      { label: "Textarea", href: "/textarea" },
      { label: "NumberInput", href: "/number-input" },
      { label: "Colors", href: "/colors" },
    ],
  },
];
</script>

<template>
  <TulparShell
    :sidenav-mode="sidenavMode"
    persist-key="playground-vue-shell"
    :dark="dark"
    v-model:aside-open="asideOpen"
  >
    <!-- ── Topbar ───────────────────────────────────────────────────────── -->
    <TulparTopbar slot="topbar" show-menu-button>
      <div slot="start" class="brand">
        <span class="brand-mark">▲</span>
        <span class="brand-name">Tulpar UI</span>
        <span class="brand-tag">Vue playground</span>
      </div>
      <button
        slot="end"
        type="button"
        class="settings-trigger"
        aria-label="Open settings"
        @click="asideOpen = true"
      >
        <span aria-hidden="true">⚙</span>
        <span>Settings</span>
      </button>
    </TulparTopbar>

    <!-- ── Sidenav ──────────────────────────────────────────────────────── -->
    <TulparSidenav slot="sidenav" nav-label="Components" :items="menu" />

    <!-- ── Routed page content (default slot) ───────────────────────────── -->
    <router-view />

    <!-- ── Footer ───────────────────────────────────────────────────────── -->
    <footer slot="footer" class="app-footer">Tulpar UI · Vue playground · v0.6</footer>

    <!-- ── Aside: settings drawer (dogfoods the shell's aside panel) ─────── -->
    <section slot="aside" class="settings" aria-label="Shell settings">
      <header class="settings-head">
        <h2>Settings</h2>
        <button
          type="button"
          class="settings-close"
          aria-label="Close settings"
          @click="asideOpen = false"
        >
          ✕
        </button>
      </header>

      <fieldset class="setting">
        <legend>Theme</legend>
        <div class="segmented" role="radiogroup" aria-label="Theme">
          <label :class="{ on: !dark }">
            <input type="radio" name="theme" :checked="!dark" @change="dark = false" />
            <span>☾ Light</span>
          </label>
          <label :class="{ on: dark }">
            <input type="radio" name="theme" :checked="dark" @change="dark = true" />
            <span>★ Dark</span>
          </label>
        </div>
      </fieldset>

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

      <p class="settings-hint">
        State persists across reloads via <code>persist-key</code>. Close with Esc, the ✕, or the
        backdrop.
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

.brand {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.brand-mark {
  font-size: 16px;
  color: var(--tulpar-color-brand-default, #00c57a);
}

.brand-name {
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 17px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.brand-tag {
  font-size: 12px;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* Topbar settings trigger */
.settings-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 8px;
  background: var(--tulpar-color-bg-surface, #f0f7f5);
  color: var(--tulpar-color-text-primary, #15110b);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
}

.settings-trigger:hover {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.settings-trigger:focus-visible {
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(81,78,207,.4));
  outline-offset: 2px;
}

.app-footer {
  font-size: 13px;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* ── Aside settings panel ──────────────────────────────────────────────── */
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
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(81,78,207,.4));
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
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(81,78,207,.4));
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
