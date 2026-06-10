<script setup lang="ts">
import { ref } from "vue";
import { TulparTextarea } from "@tulpar-ui/vue";

// ─── Section list ─────────────────────────────────────────────────────────────
const sections = [
  { id: "basics", title: "Basics" },
  { id: "autosize", title: "Autosize" },
  { id: "resize", title: "Resize" },
  { id: "counter", title: "Counter" },
  { id: "actions", title: "Actions" },
  { id: "statuses", title: "Statuses" },
  { id: "sizes-variants", title: "Sizes & Variants" },
];

const activeSection = ref("all");

// Two-way bound demo refs
const counterBody = ref("");

// ─── Code snippets ────────────────────────────────────────────────────────────

const basicsCode = `<TulparTextarea label="Bio" helper-text="Tell us about yourself" placeholder="Start typing…" />
<TulparTextarea label="Notes" placeholder="Optional notes…" />`;

const autosizeCode = `<!-- Default: 2–6 rows, grows as you type -->
<TulparTextarea label="Autosize (2–6 rows)" :autosize="true" />
<!-- Custom min/max rows -->
<TulparTextarea label="1–10 rows" :autosize="true" :min-rows="1" :max-rows="10" />
<!-- Fixed rows=5, autosize disabled -->
<TulparTextarea label="Fixed 5 rows" :autosize="false" :rows="5" />`;

const resizeCode = `<TulparTextarea resize="none" label="No resize" />
<TulparTextarea resize="both" label="Both directions" />
<TulparTextarea resize="horizontal" label="Horizontal only" />
<TulparTextarea resize="vertical" label="Vertical only (default)" />`;

const counterCode = `<!-- Character count overlay; works alongside autosize -->
<TulparTextarea
  label="Post body"
  :show-count="true"
  :max-length="200"
  v-model="body"
/>`;

const actionsCode = `<!-- copyable: copy icon button in corner -->
<TulparTextarea label="Template (copyable)" :copyable="true" value="Dear {{name}}, …" />
<!-- pastable -->
<TulparTextarea label="Paste area" :pastable="true" placeholder="Click paste icon…" />
<!-- both -->
<TulparTextarea label="Copyable + Pastable" :copyable="true" :pastable="true" />`;

const statusesCode = `<TulparTextarea label="Description" :invalid="true" error-text="Description is required" />
<TulparTextarea label="Summary" :warn="true" warn-text="Content may be too long for SMS" />
<TulparTextarea label="Bio" :validating="true" helper-text="Checking for prohibited words…" />`;

const sizesVariantsCode = `<TulparTextarea size="sm" variant="outlined" label="sm outlined" />
<TulparTextarea size="md" variant="filled" label="md filled" />
<TulparTextarea size="lg" variant="underlined" label="lg underlined" />
<TulparTextarea size="sm" variant="ghost" label="sm ghost" />`;
</script>

<template>
  <!-- Sub-menu -->
  <div class="sub-menu">
    <button
      class="sub-btn"
      :class="{ active: activeSection === 'all' }"
      @click="activeSection = 'all'"
    >
      All
    </button>
    <button
      v-for="s in sections"
      :key="s.id"
      class="sub-btn"
      :class="{ active: activeSection === s.id }"
      @click="activeSection = s.id"
    >
      {{ s.title }}
    </button>
  </div>

  <!-- ── Basics ─────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'basics'" class="demo-section">
    <h3 class="demo-title">Basics</h3>
    <p class="demo-desc">Label, helper text, placeholder — the standard setup.</p>
    <div class="preview preview--col">
      <TulparTextarea
        label="Bio"
        helper-text="Tell us about yourself"
        placeholder="Start typing…"
      />
      <TulparTextarea label="Notes" placeholder="Optional notes…" :required="true" />
    </div>
    <pre class="code"><code>{{ basicsCode }}</code></pre>
  </section>

  <!-- ── Autosize ───────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'autosize'" class="demo-section">
    <h3 class="demo-title">Autosize</h3>
    <p class="demo-desc">
      Default grows from 2 to 6 rows. Customise min/max rows or disable entirely with a fixed row
      count.
    </p>
    <div class="preview preview--col">
      <TulparTextarea
        label="Autosize (default 2–6 rows)"
        :autosize="true"
        placeholder="Type to grow…"
      />
      <TulparTextarea
        label="Custom 1–10 rows"
        :autosize="true"
        :min-rows="1"
        :max-rows="10"
        placeholder="Type to grow up to 10 rows…"
      />
      <TulparTextarea
        label="Fixed 5 rows (autosize off)"
        :autosize="false"
        :rows="5"
        placeholder="Fixed height, no grow"
      />
    </div>
    <pre class="code"><code>{{ autosizeCode }}</code></pre>
  </section>

  <!-- ── Resize ─────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'resize'" class="demo-section">
    <h3 class="demo-title">Resize</h3>
    <p class="demo-desc">Controls the CSS resize handle. Default is vertical.</p>
    <div class="preview preview--col">
      <TulparTextarea resize="none" label="None — no handle" placeholder="No resize handle" />
      <TulparTextarea
        resize="both"
        label="Both directions"
        :autosize="false"
        :rows="3"
        placeholder="Drag corner"
      />
      <TulparTextarea
        resize="horizontal"
        label="Horizontal only"
        :autosize="false"
        :rows="3"
        placeholder="Drag right edge"
      />
      <TulparTextarea
        resize="vertical"
        label="Vertical only (default)"
        :autosize="false"
        :rows="3"
        placeholder="Drag bottom edge"
      />
    </div>
    <pre class="code"><code>{{ resizeCode }}</code></pre>
  </section>

  <!-- ── Counter ────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'counter'" class="demo-section">
    <h3 class="demo-title">Character Counter</h3>
    <p class="demo-desc">
      show-count with max-length renders a live character count overlay. Works alongside autosize.
    </p>
    <div class="preview preview--col">
      <TulparTextarea
        label="Post body"
        :show-count="true"
        :max-length="200"
        v-model="counterBody"
        placeholder="Type your post…"
      />
      <p class="value-display">{{ counterBody.length }} / 200 characters</p>
    </div>
    <pre class="code"><code>{{ counterCode }}</code></pre>
  </section>

  <!-- ── Actions ────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'actions'" class="demo-section">
    <h3 class="demo-title">Actions</h3>
    <p class="demo-desc">
      copyable and pastable add icon buttons. Use copyable with prefilled values or readonly.
    </p>
    <div class="preview preview--col">
      <TulparTextarea
        label="Template (copyable)"
        :copyable="true"
        value="Dear {{name}}, thank you for reaching out. We will get back to you shortly."
      />
      <TulparTextarea label="Paste here" :pastable="true" placeholder="Click the paste icon…" />
      <TulparTextarea
        label="Copyable + Pastable"
        :copyable="true"
        :pastable="true"
        placeholder="Both affordances"
      />
    </div>
    <pre class="code"><code>{{ actionsCode }}</code></pre>
  </section>

  <!-- ── Statuses ───────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'statuses'" class="demo-section">
    <h3 class="demo-title">Statuses</h3>
    <p class="demo-desc">invalid, warn, and validating states with matching message text.</p>
    <div class="preview preview--col">
      <TulparTextarea
        label="Description"
        :invalid="true"
        error-text="Description is required"
        placeholder="Required field"
      />
      <TulparTextarea
        label="Summary"
        :warn="true"
        warn-text="Content may be too long for SMS (160 chars)"
        value="This is a fairly long message that might not fit in a single SMS segment…"
      />
      <TulparTextarea
        label="Bio"
        :validating="true"
        helper-text="Checking for prohibited words…"
        value="My bio here"
      />
    </div>
    <pre class="code"><code>{{ statusesCode }}</code></pre>
  </section>

  <!-- ── Sizes & Variants ───────────────────────────────────────────────────── -->
  <section
    v-if="activeSection === 'all' || activeSection === 'sizes-variants'"
    class="demo-section"
  >
    <h3 class="demo-title">Sizes &amp; Variants</h3>
    <p class="demo-desc">A selection of size + variant combos to show the matrix.</p>
    <div class="preview preview--col">
      <TulparTextarea
        size="sm"
        variant="outlined"
        label="sm + outlined"
        placeholder="small outlined"
      />
      <TulparTextarea size="md" variant="filled" label="md + filled" placeholder="medium filled" />
      <TulparTextarea
        size="lg"
        variant="underlined"
        label="lg + underlined"
        placeholder="large underlined"
      />
      <TulparTextarea size="sm" variant="ghost" label="sm + ghost" placeholder="small ghost" />
    </div>
    <pre class="code"><code>{{ sizesVariantsCode }}</code></pre>
  </section>
</template>

<style scoped>
.sub-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 16px 0 24px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  margin-bottom: 32px;
}

.sub-btn {
  padding: 6px 14px;
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 20px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  color: var(--tulpar-color-text-secondary, #57534e);
  font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.1s,
    color 0.1s;
}

.sub-btn:hover {
  background: var(--tulpar-color-bg-subtle, #f5f5f4);
  color: var(--tulpar-color-text-primary, #1c1917);
}

.sub-btn.active {
  background: var(--tulpar-color-brand-default, #2563eb);
  border-color: var(--tulpar-color-brand-default, #2563eb);
  color: #ffffff;
}

.demo-section {
  padding-bottom: 48px;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #e7e5e4);
}

.demo-section:last-child {
  border-bottom: none;
}

.demo-title {
  margin: 0 0 8px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 22px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #1c1917);
}

.demo-desc {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
  max-width: 620px;
  line-height: 1.6;
}

.preview {
  background: var(--tulpar-color-bg-subtle, #f5f5f4);
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-start;
}

.preview--col {
  flex-direction: column;
  align-items: stretch;
}

.code {
  margin: 0;
  padding: 16px 20px;
  background: var(--tulpar-color-bg-inverse, #1c1917);
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 0 0 6px 6px;
  overflow-x: auto;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 13px;
  line-height: 1.55;
  color: #e7e5e4;
  white-space: pre;
}

.value-display {
  margin: 4px 0 0;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 12px;
  color: var(--tulpar-color-text-secondary, #57534e);
}
</style>
