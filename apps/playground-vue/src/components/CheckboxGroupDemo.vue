<script setup lang="ts">
import { ref, computed } from "vue";
import { TulparCheckboxGroup, TulparCheckbox } from "@tulpar-ui/vue";

// ─── State ───────────────────────────────────────────────────────────────────

const heroValue = ref<string[]>(["design", "code"]);
const basicValue = ref<string[]>(["read"]);
const horizontalValue = ref<string[]>(["js"]);
const statesInvalidValue = ref<string[]>([]);
const disabledGroupValue = ref<string[]>(["standard"]);
const cardValue = ref<string[]>(["analytics", "security"]);
const colorValue = ref<string[]>(["a"]);
const filterValue = ref<string[]>(["javascript", "typescript"]);

// Select-all outside the group
const allFilterOptions = ["javascript", "typescript", "python", "rust", "go"];
const allFilterSelected = computed(() => filterValue.value.length === allFilterOptions.length);
const someFilterSelected = computed(
  () => filterValue.value.length > 0 && filterValue.value.length < allFilterOptions.length,
);

function onSelectAllFilter(e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  filterValue.value = el.checked ? [...allFilterOptions] : [];
}

// ─── Code snippets ────────────────────────────────────────────────────────────

// heroCode intentionally removed — hero section uses no snippet block

const basicCode = `<TulparCheckboxGroup v-model="selected" label="Permissions" name="perms">
  <TulparCheckbox value="read" label="Read" />
  <TulparCheckbox value="write" label="Write" />
  <TulparCheckbox value="delete" label="Delete" />
</TulparCheckboxGroup>

<!-- Live value: {{ selected }} -->`;

const orientationCode = `<!-- Vertical (default) -->
<TulparCheckboxGroup v-model="selected" orientation="vertical" label="Vertical">
  <TulparCheckbox value="a" label="Option A" />
  <TulparCheckbox value="b" label="Option B" />
</TulparCheckboxGroup>

<!-- Horizontal -->
<TulparCheckboxGroup v-model="selected" orientation="horizontal" label="Horizontal">
  <TulparCheckbox value="js" label="JavaScript" />
  <TulparCheckbox value="ts" label="TypeScript" />
  <TulparCheckbox value="py" label="Python" />
</TulparCheckboxGroup>`;

const statesCode = `<!-- Required + invalid -->
<TulparCheckboxGroup
  :model-value="[]"
  :required="true"
  :invalid="true"
  label="Required selection"
  error-text="Select at least one option."
>
  <TulparCheckbox value="a" label="Option A" />
  <TulparCheckbox value="b" label="Option B" />
</TulparCheckboxGroup>

<!-- Group disabled -->
<TulparCheckboxGroup v-model="value" :disabled="true" label="Disabled group">
  <TulparCheckbox value="standard" label="Standard" />
  <TulparCheckbox value="express" label="Express" />
</TulparCheckboxGroup>`;

const selectAllCode = `<script setup>
const all = ["javascript", "typescript", "python", "rust", "go"];
const selected = ref(["javascript"]);

const allSelected = computed(() => selected.value.length === all.length);
const someSelected = computed(
  () => selected.value.length > 0 && selected.value.length < all.length
);

function onSelectAll(e) {
  selected.value = e.target.checked ? [...all] : [];
}
<\/script>

<!-- Parent checkbox (OUTSIDE the group) -->
<TulparCheckbox
  :model-value="allSelected"
  :indeterminate="someSelected"
  label="Select all languages"
  @change="onSelectAll"
/>

<!-- The group controls its own items -->
<TulparCheckboxGroup v-model="selected" name="languages">
  <TulparCheckbox v-for="lang in all" :key="lang" :value="lang" :label="lang" />
</TulparCheckboxGroup>`;

const cardCode = `<TulparCheckboxGroup v-model="selected" orientation="horizontal" label="Add-ons">
  <TulparCheckbox variant="card" value="analytics" label="Analytics">
    <span slot="description">Usage reports + dashboards</span>
  </TulparCheckbox>
  <TulparCheckbox variant="card" value="security" label="Security">
    <span slot="description">SSO, audit logs, 2FA</span>
  </TulparCheckbox>
  <TulparCheckbox variant="card" value="support" label="Priority support">
    <span slot="description">24 / 7 dedicated SLA</span>
  </TulparCheckbox>
</TulparCheckboxGroup>`;

const colorCode = `<TulparCheckboxGroup v-model="selected" color="ulgen" label="Color: ulgen">
  <TulparCheckbox value="a" label="Option A" />
  <TulparCheckbox value="b" label="Option B" />
</TulparCheckboxGroup>`;
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Selection</span>
      <h1 class="page-title">CheckboxGroup</h1>
      <p class="page-lede">
        A multi-select fieldset managing a <code class="inline-code">string[]</code> value —
        vertical or horizontal, card variant for feature pickers, select-all parent recipe, and live
        detail.value events.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <TulparCheckboxGroup v-model="heroValue" label="Skills" name="hero-skills" size="lg">
          <TulparCheckbox value="design" label="Design" />
          <TulparCheckbox value="code" label="Code" />
          <TulparCheckbox value="research" label="Research" />
          <TulparCheckbox value="strategy" label="Strategy" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup
          v-model="heroValue"
          orientation="horizontal"
          name="hero-skills-h"
          size="lg"
        >
          <TulparCheckbox value="design" label="Design" />
          <TulparCheckbox value="code" label="Code" />
          <TulparCheckbox value="research" label="Research" />
        </TulparCheckboxGroup>
      </div>
    </section>

    <!-- ── 1. Array value — live value ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Array value — live detail.value</h2>
      <p class="section-desc">
        <code class="inline-code">v-model</code> binds to a
        <code class="inline-code">string[]</code> synchronized via the group's composed
        <code class="inline-code">change</code> CustomEvent. Toggle options to see the live array
        update.
      </p>
      <div class="preview preview--col">
        <TulparCheckboxGroup v-model="basicValue" label="Permissions" name="basic-perms">
          <TulparCheckbox value="read" label="Read" />
          <TulparCheckbox value="write" label="Write" />
          <TulparCheckbox value="delete" label="Delete" />
          <TulparCheckbox value="admin" label="Admin" />
        </TulparCheckboxGroup>
        <p class="live-value">
          value: <strong>{{ JSON.stringify(basicValue) }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ basicCode }}</code></pre>
    </section>

    <!-- ── 2. Orientation ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Orientation</h2>
      <p class="section-desc">
        <code class="inline-code">orientation="vertical"</code> (default) or
        <code class="inline-code">orientation="horizontal"</code>.
      </p>
      <div class="preview preview--row-gap">
        <TulparCheckboxGroup
          v-model="basicValue"
          orientation="vertical"
          label="Vertical"
          name="orient-v"
        >
          <TulparCheckbox value="read" label="Read" />
          <TulparCheckbox value="write" label="Write" />
          <TulparCheckbox value="delete" label="Delete" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup
          v-model="horizontalValue"
          orientation="horizontal"
          label="Horizontal"
          name="orient-h"
        >
          <TulparCheckbox value="js" label="JavaScript" />
          <TulparCheckbox value="ts" label="TypeScript" />
          <TulparCheckbox value="py" label="Python" />
        </TulparCheckboxGroup>
      </div>
      <pre class="code"><code>{{ orientationCode }}</code></pre>
    </section>

    <!-- ── 3. States ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. States</h2>
      <p class="section-desc">
        Required + invalid with <code class="inline-code">error-text</code>, and group-level
        disabled.
      </p>
      <div class="preview preview--row-gap">
        <TulparCheckboxGroup
          :model-value="statesInvalidValue"
          :required="true"
          :invalid="true"
          label="Required selection"
          error-text="Select at least one option."
          name="states-invalid"
        >
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
          <TulparCheckbox value="c" label="Option C" />
        </TulparCheckboxGroup>

        <TulparCheckboxGroup
          v-model="disabledGroupValue"
          :disabled="true"
          label="Disabled group"
          name="states-disabled"
        >
          <TulparCheckbox value="standard" label="Standard" />
          <TulparCheckbox value="express" label="Express" />
          <TulparCheckbox value="overnight" label="Overnight" />
        </TulparCheckboxGroup>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 4. Select-all parent ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Select-all parent — indeterminate recipe</h2>
      <p class="section-desc">
        Place an indeterminate <code class="inline-code">TulparCheckbox</code> <em>outside</em> the
        group, deriving its state from the group's value array. The group itself does not know about
        the parent — the parent drives the whole array via a computed.
      </p>
      <div class="preview preview--col">
        <TulparCheckbox
          :model-value="allFilterSelected"
          :indeterminate="someFilterSelected"
          label="Select all languages"
          @change="onSelectAllFilter"
        />
        <div class="indent-group">
          <TulparCheckboxGroup v-model="filterValue" name="lang-filter">
            <TulparCheckbox
              v-for="lang in allFilterOptions"
              :key="lang"
              :value="lang"
              :label="lang"
            />
          </TulparCheckboxGroup>
        </div>
        <p class="live-value">
          Selected ({{ filterValue.length }} / {{ allFilterOptions.length }}):
          <strong>{{ filterValue.join(", ") || "(none)" }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ selectAllCode }}</code></pre>
    </section>

    <!-- ── 5. Card grid ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Card variant grid</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> on each child renders clickable card tiles —
        good for add-on or feature selection.
      </p>
      <div class="preview">
        <TulparCheckboxGroup
          v-model="cardValue"
          orientation="horizontal"
          label="Add-ons"
          name="card-addons"
        >
          <TulparCheckbox variant="card" value="analytics" label="Analytics">
            <span slot="description">Usage reports + dashboards</span>
          </TulparCheckbox>
          <TulparCheckbox variant="card" value="security" label="Security">
            <span slot="description">SSO, audit logs, 2FA</span>
          </TulparCheckbox>
          <TulparCheckbox variant="card" value="support" label="Priority support">
            <span slot="description">24 / 7 dedicated SLA</span>
          </TulparCheckbox>
        </TulparCheckboxGroup>
      </div>
      <pre class="code"><code>{{ cardCode }}</code></pre>
    </section>

    <!-- ── 6. Color ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Color</h2>
      <p class="section-desc">
        Pass <code class="inline-code">color</code> on the group to override the checked-state
        accent for all child checkboxes.
      </p>
      <div class="preview preview--row-gap">
        <TulparCheckboxGroup
          v-model="colorValue"
          color="ulgen"
          label="Ulgen (gold)"
          name="color-ulgen"
        >
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup
          v-model="colorValue"
          color="kizagan"
          label="Kizagan (red)"
          name="color-kizagan"
        >
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup
          v-model="colorValue"
          color="otuken"
          label="Otuken (forest)"
          name="color-otuken"
        >
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 7. Real-world — multi-select filter ───────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — content filter sidebar</h2>
      <p class="section-desc">
        A sidebar filter panel with select-all parents per category and a live selected count badge.
      </p>
      <div class="composition">
        <div class="filter-panel">
          <div class="filter-header">
            <span class="filter-title">Filters</span>
            <button
              type="button"
              class="filter-clear"
              :disabled="filterValue.length === 0"
              @click="filterValue = []"
            >
              Clear all
            </button>
          </div>

          <div class="filter-section">
            <div class="filter-section-head">
              <TulparCheckbox
                :model-value="allFilterSelected"
                :indeterminate="someFilterSelected"
                label="Languages"
                size="sm"
                @change="onSelectAllFilter"
              />
            </div>
            <div class="filter-options">
              <TulparCheckboxGroup v-model="filterValue" name="filter-lang" size="sm">
                <TulparCheckbox
                  v-for="lang in allFilterOptions"
                  :key="lang"
                  :value="lang"
                  :label="lang"
                />
              </TulparCheckboxGroup>
            </div>
          </div>

          <div class="filter-footer">
            <span class="filter-count">
              {{ filterValue.length }} language{{ filterValue.length !== 1 ? "s" : "" }} selected
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 12px;
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

.hero {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: flex-start;
  padding: 32px 28px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 14px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.doc-section {
  padding-bottom: 48px;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.doc-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 10px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 26px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.section-desc {
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
  gap: 16px;
  align-items: flex-start;
}

.preview--col {
  flex-direction: column;
}

.preview--row-gap {
  gap: 32px;
}

.code {
  margin: 0;
  padding: 16px 20px;
  background: var(--tulpar-color-bg-inverse, #15110b);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 0 0 6px 6px;
  overflow-x: auto;
  font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  line-height: 1.55;
  color: #d9e0df;
  white-space: pre;
}

.inline-code {
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 0.85em;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 3px;
  padding: 1px 5px;
  color: var(--tulpar-color-text-primary, #15110b);
}

.live-value {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

.indent-group {
  padding-left: 24px;
  border-left: 2px solid var(--tulpar-color-border-default, #d9e0df);
  margin-left: 4px;
}

.composition {
  display: flex;
}

.filter-panel {
  width: 260px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 12px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
  overflow: hidden;
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.filter-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.filter-clear {
  padding: 3px 8px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 12px;
  color: var(--tulpar-color-text-muted, #74777a);
  cursor: pointer;
}

.filter-clear:not(:disabled):hover {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  color: var(--tulpar-color-text-primary, #15110b);
}

.filter-clear:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.filter-section {
  padding: 14px 16px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.filter-section-head {
  margin-bottom: 10px;
}

.filter-options {
  padding-left: 20px;
}

.filter-footer {
  padding: 12px 16px;
}

.filter-count {
  font-size: 12px;
  color: var(--tulpar-color-text-muted, #74777a);
}
</style>
