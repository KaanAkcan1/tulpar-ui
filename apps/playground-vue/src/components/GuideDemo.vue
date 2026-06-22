<script setup lang="ts">
interface PropRow {
  name: string;
  type: string;
  desc: string;
}

const MENU_SNIPPET = `import { TulparShell, TulparTopbar, TulparSidenav } from "@tulpar-ui/vue";
import type { TulparNavItemVueData } from "@tulpar-ui/vue";
import { SquareMousePointer, FormInput, TextCursorInput } from "lucide-vue-next";

// Lucide functional components are passed straight through as the item icon.
const menu: TulparNavItemVueData[] = [
  {
    type: "section",
    label: "Components",
    items: [
      { label: "Button", href: "/button", icon: SquareMousePointer, kbd: "B" },
      // A nav-item with its own \`items\` becomes a collapsible group (chevron).
      {
        label: "Form Inputs",
        icon: FormInput,
        items: [
          { label: "TextInput", href: "/text-input", icon: TextCursorInput, count: "3" },
          { label: "Textarea", href: "/textarea", badge: "New" },
          { label: "NumberInput", href: "/number-input", dot: true },
        ],
      },
    ],
  },
];`;

const SHELL_SNIPPET = `<TulparShell
  sidenav-mode="static"
  sidenav-layout="under-topbar"
  persist-key="my-app-shell"
  :dark="dark"
  v-model:aside-open="asideOpen"
>
  <TulparTopbar slot="topbar">…</TulparTopbar>

  <!-- Self-contained: brand, toggle, theme switch, nav, utility, account -->
  <TulparSidenav
    slot="sidenav"
    nav-label="Main navigation"
    :items="menu"
    :single-expand="true"
  />

  <router-view />
</TulparShell>`;

const THEME_SNIPPET = `<!-- show-mode-selection is ON by default. The sidenav renders a Dark/Light
     toggle, emits tulpar-theme-toggle, and the shell flips .dark itself.
     Zero app wiring — you do not handle the event. -->
<TulparSidenav slot="sidenav" :items="menu" />

<!-- Opt out if your app drives theme elsewhere: -->
<TulparSidenav slot="sidenav" :items="menu" :show-mode-selection="false" />`;

const itemProps: PropRow[] = [
  { name: "label", type: "string", desc: "Visible text for the item or section." },
  { name: "href", type: "string?", desc: "Navigation target. Omit on a collapsible group parent." },
  {
    name: "type",
    type: "'item' | 'section'",
    desc: "'section' renders a non-interactive group heading. Default 'item'.",
  },
  {
    name: "items",
    type: "TulparNavItemVueData[]?",
    desc: "Children. On a section: grouped entries. On an item: turns it into a collapsible group with a chevron.",
  },
  {
    name: "icon",
    type: "Component | string",
    desc: "Lucide component (wrapper) or raw SVG string (core).",
  },
  { name: "count", type: "string?", desc: "Numeric pill aligned to the trailing edge." },
  { name: "badge", type: "string?", desc: 'Short text badge (e.g. "New", "Beta").' },
  { name: "dot", type: "boolean?", desc: "Small status dot; pair with dotLabel for a11y." },
  { name: "kbd", type: "string?", desc: "Keyboard-shortcut hint rendered in a <kbd> chip." },
  { name: "disabled", type: "boolean?", desc: "Renders the item non-interactive." },
];

const utilityProps: PropRow[] = [
  {
    name: "show-config",
    type: "boolean",
    desc: "Show the configurator action in the utility row.",
  },
  { name: "config-text", type: "string", desc: "Label for the configurator action." },
  { name: "@config", type: "void", desc: "Emitted when the configurator action is activated." },
];

const accountProps: PropRow[] = [
  { name: "show-account-block", type: "boolean", desc: "Show the account card. Default on." },
  { name: "user-name", type: "string", desc: "Display name; also seeds the initials fallback." },
  { name: "user-role", type: "string", desc: "Secondary line under the name." },
  {
    name: "profile-image",
    type: "string",
    desc: "Avatar URL; falls back to initials when absent.",
  },
  { name: "show-settings", type: "boolean", desc: "Show the settings action." },
  { name: "show-logout", type: "boolean", desc: "Show the logout action." },
  { name: "@settings / @logout", type: "void", desc: "Emitted when the respective action fires." },
];

const layoutProps: PropRow[] = [
  {
    name: "shell sidenav-layout",
    type: "'under-topbar' | 'over-topbar'",
    desc: "Whether the sidebar sits beneath the topbar or runs full-height beside it.",
  },
  { name: "position", type: "'left' | 'right'", desc: "Which edge the sidebar docks to." },
  {
    name: "density",
    type: "'comfortable' | 'compact'",
    desc: "Row height / padding scale for the nav.",
  },
  {
    name: "single-expand",
    type: "boolean",
    desc: "Collapse other groups when one expands (accordion behaviour).",
  },
];

const slots: PropRow[] = [
  { name: "toggle-icon", type: "", desc: "Custom collapse/rail toggle glyph." },
  { name: "brand", type: "", desc: "Replace the default brand lockup." },
  { name: "header-actions", type: "", desc: "Actions beside the brand/header." },
  { name: "search", type: "", desc: "A search field above the nav." },
  { name: "utility-start", type: "", desc: "Leading content in the utility row." },
  { name: "utility-end", type: "", desc: "Trailing content in the utility row." },
  { name: "footer", type: "", desc: "Custom footer below the account block." },
];

const a11yLabels: PropRow[] = [
  { name: "toggle-label", type: "", desc: "Accessible name for the collapse/rail toggle." },
  { name: "theme-label", type: "", desc: "Accessible name for the Dark/Light toggle." },
  { name: "config-label", type: "", desc: "Accessible name for the configurator action." },
  { name: "settings-label", type: "", desc: "Accessible name for the settings action." },
  { name: "logout-label", type: "", desc: "Accessible name for the logout action." },
];
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Guide</span>
      <h1 class="page-title">Sidebar &amp; Theme</h1>
      <p class="page-lede">
        The Tulpar shell sidebar is self-contained and prop-driven: brand, nav, the Dark/Light
        toggle, the utility row and the account block all render from props — no app markup. Slots
        remain as escape hatches when you need custom chrome.
      </p>
    </header>

    <!-- ── Overview ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Overview</h2>
      <p class="section-desc">
        Drive the whole sidebar from a single <code>:items</code> array plus a handful of feature
        flags. Everything below is optional; sensible defaults ship out of the box. Reach for slots
        only when a prop cannot express what you need.
      </p>
      <pre class="code"><code>{{ SHELL_SNIPPET }}</code></pre>
    </section>

    <!-- ── Theme ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Theme — Dark / Light</h2>
      <p class="section-desc">
        A built-in theme toggle ships via <code>show-mode-selection</code> (default
        <strong>on</strong>). It emits <code>tulpar-theme-toggle</code> and the shell flips the
        <code>.dark</code> class automatically. You do not wire the event — it just works.
      </p>
      <pre class="code"><code>{{ THEME_SNIPPET }}</code></pre>
    </section>

    <!-- ── Menu / items API ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Menu &amp; items API</h2>
      <p class="section-desc">
        Each entry is a <code>TulparNavItemVueData</code>. Use <code>type: "section"</code> for a
        non-interactive group heading; give any item its own <code>items</code> to make it a
        collapsible group with a chevron. Per-item adornments: <code>icon</code>,
        <code>count</code>, <code>badge</code>, <code>dot</code>, <code>kbd</code>.
      </p>
      <dl class="def">
        <div v-for="r in itemProps" :key="r.name" class="def-row">
          <dt>
            <code>{{ r.name }}</code> <span class="def-type">{{ r.type }}</span>
          </dt>
          <dd>{{ r.desc }}</dd>
        </div>
      </dl>
      <p class="section-desc">
        In the wrappers, <code>icon</code> is a framework component (a lucide component in
        Angular/Vue). In core <code>@tulpar-ui/shell</code>, it is a raw SVG string.
      </p>
      <pre class="code"><code>{{ MENU_SNIPPET }}</code></pre>
    </section>

    <!-- ── Utility row ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Utility row</h2>
      <p class="section-desc">An optional action row above the account block.</p>
      <dl class="def">
        <div v-for="r in utilityProps" :key="r.name" class="def-row">
          <dt>
            <code>{{ r.name }}</code> <span class="def-type">{{ r.type }}</span>
          </dt>
          <dd>{{ r.desc }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── Account block ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Account block</h2>
      <p class="section-desc">
        The signed-in user card at the foot of the sidebar. <code>profile-image</code> falls back to
        initials derived from <code>user-name</code> when omitted.
      </p>
      <dl class="def">
        <div v-for="r in accountProps" :key="r.name" class="def-row">
          <dt>
            <code>{{ r.name }}</code> <span class="def-type">{{ r.type }}</span>
          </dt>
          <dd>{{ r.desc }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── Layout ────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Layout</h2>
      <dl class="def">
        <div v-for="r in layoutProps" :key="r.name" class="def-row">
          <dt>
            <code>{{ r.name }}</code> <span class="def-type">{{ r.type }}</span>
          </dt>
          <dd>{{ r.desc }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── Slots ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Slots — escape hatches</h2>
      <p class="section-desc">
        Reach for a slot only when a prop cannot express your need. Project custom markup with
        <code>slot="…"</code>.
      </p>
      <dl class="def">
        <div v-for="r in slots" :key="r.name" class="def-row">
          <dt>
            <code>{{ r.name }}</code>
          </dt>
          <dd>{{ r.desc }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── A11y labels ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Accessibility labels</h2>
      <p class="section-desc">
        Override the accessible names of the built-in controls (e.g. for localisation). All default
        to sensible English strings.
      </p>
      <dl class="def">
        <div v-for="r in a11yLabels" :key="r.name" class="def-row">
          <dt>
            <code>{{ r.name }}</code>
          </dt>
          <dd>{{ r.desc }}</dd>
        </div>
      </dl>
    </section>

    <!-- ── Feedback family (v0.12) ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Feedback family — Toast &amp; Message</h2>
      <p class="section-desc">
        Transient, code-triggered notifications powered by a single imperative service. Two channels
        split by weight:
      </p>
      <dl class="def">
        <div class="def-row">
          <dt><code>Toast</code></dt>
          <dd>
            Corner card — icon · title · description · action(s) · close. Stacks, timers out (5 s
            default), supports <code>toast.promise</code> for async flows. Use for background events,
            confirmations with an Undo action, and non-critical errors.
            <br /><router-link class="feedback-link" to="/toast">Toast demo →</router-link>
          </dd>
        </div>
        <div class="def-row">
          <dt><code>Message</code></dt>
          <dd>
            Top-center pill — single line, auto-dismiss (3 s), deduplicates repeated calls into a ×N
            counter. No actions, no close button. Use for redundant confirmations: "Copied",
            "Saved".
            <br /><router-link class="feedback-link" to="/message">Message demo →</router-link>
          </dd>
        </div>
      </dl>
      <p class="section-desc" style="margin-top: 12px">
        <strong>Decision rule:</strong> A Message that needs an action is a Toast. Toast that has no
        actions and auto-dismisses in 3 s might be a Message. Both are wrong for critical /
        irreversible info — that needs a Dialog (future spec).
      </p>
    </section>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 40px;
}

.page-tag {
  display: inline-block;
  margin-bottom: 14px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  color: var(--tulpar-color-text-secondary, #57534e);
}

.page-title {
  margin: 0 0 12px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 34px;
  font-weight: 600;
  line-height: 1.1;
  color: var(--tulpar-color-text-primary, #15110b);
}

.page-lede {
  margin: 0;
  font-size: 15px;
  color: var(--tulpar-color-text-secondary, #57534e);
  max-width: 660px;
  line-height: 1.6;
}

.doc-section {
  padding-bottom: 44px;
  margin-bottom: 44px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.doc-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 10px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 22px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.section-desc {
  margin: 0 0 22px;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
  max-width: 660px;
  line-height: 1.6;
}

.section-desc code,
.def code {
  font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
  font-size: 0.85em;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  color: var(--tulpar-color-text-primary, #15110b);
}

/* ── Code blocks ───────────────────────────────────────────────────────── */
.code {
  margin: 0;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-elevated, #ffffff);
  overflow-x: auto;
}

.code code {
  display: block;
  font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--tulpar-color-text-primary, #15110b);
  white-space: pre;
  background: none;
  padding: 0;
}

/* ── Definition lists ──────────────────────────────────────────────────── */
.def {
  display: grid;
  grid-template-columns: minmax(220px, 0.9fr) 2fr;
  gap: 0;
  margin: 0 0 22px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 12px;
  overflow: hidden;
}

.def-row {
  display: contents;
}

.def dt,
.def dd {
  padding: 12px 16px;
  border-top: 1px solid var(--tulpar-color-border-default, #d9e0df);
  font-size: 13.5px;
}

.def-row:first-child dt,
.def-row:first-child dd {
  border-top: none;
}

.def dt {
  background: var(--tulpar-color-bg-subtle, #f4f8f7);
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}

.def dd {
  margin: 0;
  color: var(--tulpar-color-text-secondary, #57534e);
  line-height: 1.55;
}

.def-type {
  font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
  font-size: 11px;
  color: var(--tulpar-color-text-muted, #74777a);
}

.feedback-link {
  color: var(--tulpar-color-brand-default, #00c57a);
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
}

.feedback-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .def {
    grid-template-columns: 1fr;
  }

  .def dd {
    border-top: none;
    padding-top: 0;
  }
}
</style>
