<script setup lang="ts">
import { ref } from "vue";
import { TulparShell, TulparTopbar, TulparSidenav } from "@tulpar-ui/vue";
import type { TulparNavItemData } from "@tulpar-ui/vue";

/** Dark-mode flag — forwarded to the shell, which toggles the `.dark` class. */
const dark = ref(false);

/** Aside drawer open state — driven via v-model on the shell. */
const asideOpen = ref(false);

/** Sidenav menu — hrefs map 1:1 to the routes declared in router.ts. */
const menu: TulparNavItemData[] = [
  {
    label: "Components",
    items: [
      { label: "Button", href: "/button" },
      { label: "TextInput", href: "/text-input" },
      { label: "Textarea", href: "/textarea" },
      { label: "NumberInput", href: "/number-input" },
    ],
  },
];
</script>

<template>
  <TulparShell
    sidenav-mode="static"
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
        class="theme-toggle"
        :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="dark = !dark"
      >
        {{ dark ? "☀ Light" : "☾ Dark" }}
      </button>
    </TulparTopbar>

    <!-- ── Sidenav ──────────────────────────────────────────────────────── -->
    <TulparSidenav slot="sidenav" nav-label="Components" :items="menu" />

    <!-- ── Routed page content (default slot) ───────────────────────────── -->
    <router-view />

    <!-- ── Footer ───────────────────────────────────────────────────────── -->
    <footer slot="footer" class="app-footer">Tulpar UI · Vue playground · v0.6</footer>
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
  background: var(--tulpar-color-bg-surface, #fafaf9);
  color: var(--tulpar-color-text-primary, #1c1917);
  line-height: 1.5;
}

.brand {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
}

.brand-mark {
  font-size: 16px;
  color: var(--tulpar-color-brand-default, #2563eb);
}

.brand-name {
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 17px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #1c1917);
}

.brand-tag {
  font-size: 12px;
  color: var(--tulpar-color-text-muted, #78716c);
}

.theme-toggle {
  padding: 6px 14px;
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 6px;
  background: var(--tulpar-color-bg-surface, #fafaf9);
  color: var(--tulpar-color-text-primary, #1c1917);
  font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.theme-toggle:hover {
  background: var(--tulpar-color-bg-subtle, #f5f5f4);
}

.app-footer {
  font-size: 13px;
  color: var(--tulpar-color-text-muted, #78716c);
}
</style>
