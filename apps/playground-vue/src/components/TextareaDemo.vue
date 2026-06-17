<script setup lang="ts">
import { ref } from "vue";
import { TulparTextarea, TulparButton } from "@tulpar-ui/vue";

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
const composerBody = ref("");

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
  <!-- ── Page header ───────────────────────────────────────────────────────── -->
  <header class="page-header">
    <span class="page-tag">Form</span>
    <h1 class="page-title">Textarea</h1>
    <p class="page-lede">
      The multi-line text field — autosizing rows, resize control, a live character counter,
      copy/paste affordances, and the full validation-state set. Built on the shared FormFieldBase.
    </p>
  </header>

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

  <!-- ── In context — a comment composer ──────────────────────────────────────── -->
  <section v-if="activeSection === 'all'" class="demo-section">
    <h3 class="demo-title">In context — a comment composer</h3>
    <p class="demo-desc">
      Autosize, a live counter, and a submit action composed into a realistic comment box on an
      elevated surface.
    </p>
    <div class="composer-card">
      <div class="composer-head">
        <span class="composer-avatar" aria-hidden="true">KA</span>
        <span class="composer-name">Kaan Akcan</span>
      </div>
      <TulparTextarea
        label="Add a comment"
        label-position="none"
        :autosize="true"
        :min-rows="2"
        :max-rows="8"
        :show-count="true"
        :max-length="500"
        v-model="composerBody"
        placeholder="Share your thoughts…"
      />
      <div class="composer-actions">
        <TulparButton severity="secondary" variant="ghost" size="sm">Cancel</TulparButton>
        <TulparButton severity="primary" size="sm" :disabled="composerBody.trim().length === 0"
          >Post comment</TulparButton
        >
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-header {
  margin-bottom: 8px;
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
  max-width: 640px;
  line-height: 1.6;
}

.composer-card {
  max-width: 560px;
  padding: 20px 22px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 14px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
}

.composer-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.composer-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 999px;
  background: var(--tulpar-color-brand-default, #00c57a);
  color: var(--tulpar-color-brand-on-color, #07291f);
  font-size: 12px;
  font-weight: 700;
}

.composer-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}

.sub-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 16px 0 24px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
  margin-bottom: 32px;
}

.sub-btn {
  padding: 6px 14px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
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
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  color: var(--tulpar-color-text-primary, #15110b);
}

.sub-btn.active {
  background: var(--tulpar-color-brand-default, #00c57a);
  border-color: var(--tulpar-color-brand-default, #00c57a);
  color: #ffffff;
}

.demo-section {
  padding-bottom: 48px;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.demo-section:last-child {
  border-bottom: none;
}

.demo-title {
  margin: 0 0 8px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 22px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.demo-desc {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
  max-width: 620px;
  line-height: 1.6;
}

.preview {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
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
  background: var(--tulpar-color-bg-inverse, #15110b);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 0 0 6px 6px;
  overflow-x: auto;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 13px;
  line-height: 1.55;
  color: #d9e0df;
  white-space: pre;
}

.value-display {
  margin: 4px 0 0;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 12px;
  color: var(--tulpar-color-text-secondary, #57534e);
}
</style>
