<script setup lang="ts">
import { ref, computed } from "vue";
import { TulparCheckboxGroup, TulparCheckbox } from "@tulpar-ui/vue";

// ─── State ───────────────────────────────────────────────────────────────────

const heroValue = ref<string[]>(["design", "code"]);
const basicValue = ref<string[]>(["read"]);
const propSlotValue = ref<string[]>(["email"]);
const sizeValue = ref<string[]>(["a"]);
const horizontalValue = ref<string[]>(["js"]);
const groupLabelPropValue = ref<string[]>(["a"]);
const groupLabelSlotValue = ref<string[]>(["a"]);
const statesInvalidValue = ref<string[]>([]);
const disabledGroupValue = ref<string[]>(["standard"]);
const itemDisabledValue = ref<string[]>(["a"]);
const cardValue = ref<string[]>(["analytics", "security"]);
const colorGroupValue = ref<string[]>(["a", "b"]);
const colorPerItemValue = ref<string[]>(["a", "b"]);

// Select-all outside the group
const allFilterOptions = ["javascript", "typescript", "python", "rust", "go"];
const filterValue = ref<string[]>(["javascript", "typescript"]);
const allFilterSelected = computed(() => filterValue.value.length === allFilterOptions.length);
const someFilterSelected = computed(
  () => filterValue.value.length > 0 && filterValue.value.length < allFilterOptions.length,
);

function onSelectAllFilter(e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  filterValue.value = el.checked ? [...allFilterOptions] : [];
}

// In-context filter panel (separate state)
const frameworkOptions = ["react", "vue", "svelte", "angular"];
const panelValue = ref<string[]>(["vue"]);
const panelAll = computed(() => panelValue.value.length === frameworkOptions.length);
const panelSome = computed(
  () => panelValue.value.length > 0 && panelValue.value.length < frameworkOptions.length,
);
function onPanelSelectAll(e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  panelValue.value = el.checked ? [...frameworkOptions] : [];
}

// ─── Code snippets ────────────────────────────────────────────────────────────

const basicCode = `<TulparCheckboxGroup v-model="selected" label="Permissions" name="perms">
  <TulparCheckbox value="read" label="Read" />
  <TulparCheckbox value="write" label="Write" />
  <TulparCheckbox value="delete" label="Delete" />
</TulparCheckboxGroup>

<!-- Live value: {{ selected }} -->`;

const propsVsSlotsCode = `<!-- (a) PROP form -->
<TulparCheckbox value="email" label="Email" description="Product + account email." />

<!-- (b) SLOT form -->
<TulparCheckbox value="sms">
  <span slot="label">SMS</span>
  <span slot="description">Text messages to your phone.</span>
</TulparCheckbox>`;

const sizesCode = `<!-- group size propagates to every child checkbox -->
<TulparCheckboxGroup v-model="selected" size="xs" label="xs">…</TulparCheckboxGroup>
<TulparCheckboxGroup v-model="selected" size="sm" label="sm">…</TulparCheckboxGroup>
<TulparCheckboxGroup v-model="selected" size="md" label="md">…</TulparCheckboxGroup>
<TulparCheckboxGroup v-model="selected" size="lg" label="lg">…</TulparCheckboxGroup>
<TulparCheckboxGroup v-model="selected" size="xl" label="xl">…</TulparCheckboxGroup>`;

const orientationCode = `<!-- Vertical (default) -->
<TulparCheckboxGroup v-model="selected" orientation="vertical" label="Vertical">
  <TulparCheckbox value="read" label="Read" />
  <TulparCheckbox value="write" label="Write" />
</TulparCheckboxGroup>

<!-- Horizontal -->
<TulparCheckboxGroup v-model="selected" orientation="horizontal" label="Horizontal">
  <TulparCheckbox value="js" label="JavaScript" />
  <TulparCheckbox value="ts" label="TypeScript" />
</TulparCheckboxGroup>`;

const selectAllCode = `<script setup>
const all = ["javascript", "typescript", "python", "rust", "go"];
const selected = ref(["javascript", "typescript"]);

const allSelected = computed(() => selected.value.length === all.length);
const someSelected = computed(
  () => selected.value.length > 0 && selected.value.length < all.length
);

function onSelectAll(e) {
  selected.value = e.target.checked ? [...all] : [];
}
<\/script>

<!-- Parent checkbox lives OUTSIDE the group, derived from the value array -->
<TulparCheckbox
  :model-value="allSelected"
  :indeterminate="someSelected"
  label="Select all languages"
  @change="onSelectAll"
/>

<TulparCheckboxGroup v-model="selected" name="languages">
  <TulparCheckbox v-for="lang in all" :key="lang" :value="lang" :label="lang" />
</TulparCheckboxGroup>`;

const groupLabelCode = `<!-- (a) PROP form — group legend via label + description -->
<TulparCheckboxGroup
  v-model="selected"
  label="Notification channels"
  description="Pick any channels you want to receive alerts on."
>
  <TulparCheckbox value="a" label="Email" />
  <TulparCheckbox value="b" label="SMS" />
</TulparCheckboxGroup>

<!-- (b) SLOT form -->
<TulparCheckboxGroup v-model="selected">
  <span slot="label">Notification channels</span>
  <span slot="description">Pick any channels you want to receive alerts on.</span>
  <TulparCheckbox value="a" label="Email" />
  <TulparCheckbox value="b" label="SMS" />
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
</TulparCheckboxGroup>

<!-- Individual item disabled -->
<TulparCheckboxGroup v-model="value" label="Item disabled">
  <TulparCheckbox value="a" label="Option A" />
  <TulparCheckbox value="b" label="Option B (locked)" :disabled="true" />
  <TulparCheckbox value="c" label="Option C" />
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

const colorCode = `<!-- Group-level color — bind it -->
<TulparCheckboxGroup v-model="selected" :color="'ulgen'" label="Group color: ulgen">
  <TulparCheckbox value="a" label="Option A" />
  <TulparCheckbox value="b" label="Option B" />
</TulparCheckboxGroup>

<!-- Per-item override -->
<TulparCheckboxGroup v-model="selected" :color="'otuken'" label="Per-item override">
  <TulparCheckbox value="a" label="Inherits otuken" />
  <TulparCheckbox value="b" :color="'kizagan'" label="Overrides to kizagan" />
</TulparCheckboxGroup>`;
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Core</span>
      <h1 class="page-title">CheckboxGroup</h1>
      <p class="page-lede">
        A multi-select fieldset managing a <code class="inline-code">string[]</code> value — two-way
        binding, size propagation, orientation, a select-all parent recipe, group legend in prop and
        slot form, a card grid, group + per-item color, and a live filter panel.
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

    <!-- ── 1. Basic — array value, live readout ──────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Basic — array value, two-way</h2>
      <p class="section-desc">
        <code class="inline-code">v-model</code> binds a <code class="inline-code">string[]</code>.
        Toggle options to see the live array update.
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

    <!-- ── 2. Props vs slots — label & description ───────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Props vs slots — label &amp; description</h2>
      <p class="section-desc">
        Each child <code class="inline-code">TulparCheckbox</code> accepts
        <code class="inline-code">label</code> / <code class="inline-code">description</code> props
        OR <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code>.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <TulparCheckboxGroup v-model="propSlotValue" name="ps-prop">
            <TulparCheckbox value="email" label="Email" description="Product + account email." />
            <TulparCheckbox value="push" label="Push" description="Alerts on your devices." />
          </TulparCheckboxGroup>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <TulparCheckboxGroup v-model="propSlotValue" name="ps-slot">
            <TulparCheckbox value="email">
              <span slot="label">Email</span>
              <span slot="description">Product + account email.</span>
            </TulparCheckbox>
            <TulparCheckbox value="push">
              <span slot="label">Push</span>
              <span slot="description">Alerts on your devices.</span>
            </TulparCheckbox>
          </TulparCheckboxGroup>
        </div>
      </div>
      <pre class="code"><code>{{ propsVsSlotsCode }}</code></pre>
    </section>

    <!-- ── 3. Sizes ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Sizes</h2>
      <p class="section-desc">
        The group <code class="inline-code">size</code> propagates to every child checkbox.
      </p>
      <div class="preview preview--row-gap">
        <TulparCheckboxGroup v-model="sizeValue" size="xs" label="xs" name="size-xs">
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup v-model="sizeValue" size="sm" label="sm" name="size-sm">
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup v-model="sizeValue" size="md" label="md" name="size-md">
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup v-model="sizeValue" size="lg" label="lg" name="size-lg">
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup v-model="sizeValue" size="xl" label="xl" name="size-xl">
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 4. Orientation ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Orientation</h2>
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

    <!-- ── 5. Select-all parent recipe ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Select-all parent — indeterminate recipe</h2>
      <p class="section-desc">
        Place an indeterminate <code class="inline-code">TulparCheckbox</code> <em>outside</em> the
        group, deriving its state from the group's value array via computed. The parent drives the
        whole array; the group drives the parent — wired both directions.
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

    <!-- ── 6. Group label + description — prop AND slot ──────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Group label + description — prop &amp; slot</h2>
      <p class="section-desc">
        The group legend can be set via <code class="inline-code">label</code> /
        <code class="inline-code">description</code> props OR group-level
        <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code>.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <TulparCheckboxGroup
            v-model="groupLabelPropValue"
            name="gl-prop"
            label="Notification channels"
            description="Pick any channels you want to receive alerts on."
          >
            <TulparCheckbox value="a" label="Email" />
            <TulparCheckbox value="b" label="SMS" />
            <TulparCheckbox value="c" label="Push" />
          </TulparCheckboxGroup>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <TulparCheckboxGroup v-model="groupLabelSlotValue" name="gl-slot">
            <span slot="label">Notification channels</span>
            <span slot="description">Pick any channels you want to receive alerts on.</span>
            <TulparCheckbox value="a" label="Email" />
            <TulparCheckbox value="b" label="SMS" />
            <TulparCheckbox value="c" label="Push" />
          </TulparCheckboxGroup>
        </div>
      </div>
      <pre class="code"><code>{{ groupLabelCode }}</code></pre>
    </section>

    <!-- ── 7. States ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. States</h2>
      <p class="section-desc">
        Required + invalid with <code class="inline-code">error-text</code>, group-level disabled,
        and per-item disabled.
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

        <TulparCheckboxGroup v-model="itemDisabledValue" label="Item disabled" name="states-item">
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B (locked)" :disabled="true" />
          <TulparCheckbox value="c" label="Option C" />
        </TulparCheckboxGroup>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 8. Card grid ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Card variant grid</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> on each child renders clickable card tiles —
        good for add-on or feature-column selection.
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

    <!-- ── 9. Color — group + per-item ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Color — group + per-item override</h2>
      <p class="section-desc">
        Bind <code class="inline-code">:color</code> on the group to set the checked-fill for all
        children, or on a single <code class="inline-code">TulparCheckbox</code> to override one.
      </p>
      <div class="preview preview--row-gap">
        <TulparCheckboxGroup
          v-model="colorGroupValue"
          :color="'ulgen'"
          label="Group: ulgen"
          name="c-ulgen"
        >
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup
          v-model="colorGroupValue"
          :color="'kizagan'"
          label="Group: kizagan"
          name="c-kizagan"
        >
          <TulparCheckbox value="a" label="Option A" />
          <TulparCheckbox value="b" label="Option B" />
        </TulparCheckboxGroup>
        <TulparCheckboxGroup
          v-model="colorPerItemValue"
          :color="'otuken'"
          label="Per-item override"
          name="c-override"
        >
          <TulparCheckbox value="a" label="Inherits otuken" />
          <TulparCheckbox value="b" :color="'kizagan'" label="Overrides to kizagan" />
        </TulparCheckboxGroup>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 10. In context — filter panel ─────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — multi-select filter panel</h2>
      <p class="section-desc">
        A sidebar filter with a select-all parent, a live selected count, and a clear-all action —
        all wired to one array.
      </p>
      <div class="composition">
        <div class="filter-panel">
          <div class="filter-header">
            <span class="filter-title">Filters</span>
            <button
              type="button"
              class="filter-clear"
              :disabled="panelValue.length === 0"
              @click="panelValue = []"
            >
              Clear all
            </button>
          </div>

          <div class="filter-section">
            <div class="filter-section-head">
              <TulparCheckbox
                :model-value="panelAll"
                :indeterminate="panelSome"
                label="Frameworks"
                size="sm"
                @change="onPanelSelectAll"
              />
            </div>
            <div class="filter-options">
              <TulparCheckboxGroup v-model="panelValue" name="filter-fw" size="sm">
                <TulparCheckbox v-for="fw in frameworkOptions" :key="fw" :value="fw" :label="fw" />
              </TulparCheckboxGroup>
            </div>
          </div>

          <div class="filter-footer">
            <span class="filter-count">
              {{ panelValue.length }} framework{{ panelValue.length !== 1 ? "s" : "" }} selected
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

.preview--cols {
  align-items: flex-start;
  gap: 40px;
}

.preview--row-gap {
  gap: 32px;
}

.preview-col {
  flex: 1;
  min-width: 240px;
}

.preview-label {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
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
