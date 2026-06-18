<script setup lang="ts">
import { ref, computed } from "vue";
import { TulparCheckbox } from "@tulpar-ui/vue";

// ─── State ───────────────────────────────────────────────────────────────────

// Select-all demo
const selectAllItems = ["read", "write", "delete", "admin"];
const selectedPermissions = ref<string[]>(["read", "write"]);

const allSelected = computed(() => selectedPermissions.value.length === selectAllItems.length);
const someSelected = computed(
  () =>
    selectedPermissions.value.length > 0 &&
    selectedPermissions.value.length < selectAllItems.length,
);

function onSelectAllChange(e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  if (el.checked) {
    selectedPermissions.value = [...selectAllItems];
  } else {
    selectedPermissions.value = [];
  }
}

function onItemChange(item: string, e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  if (el.checked) {
    selectedPermissions.value = [...selectedPermissions.value, item];
  } else {
    selectedPermissions.value = selectedPermissions.value.filter((v) => v !== item);
  }
}

// Card variant grid
const selectedPlans = ref<string[]>(["starter"]);

function onPlanChange(plan: string, e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  if (el.checked) {
    selectedPlans.value = [...selectedPlans.value, plan];
  } else {
    selectedPlans.value = selectedPlans.value.filter((v) => v !== plan);
  }
}

// Real-world: permissions list
const permissionGroups = ref({
  users: { create: true, read: true, update: false, delete: false },
  content: { create: true, read: true, update: true, delete: false },
  billing: { create: false, read: true, update: false, delete: false },
});

// ─── Code snippets ────────────────────────────────────────────────────────────

// heroCode intentionally removed — hero section uses no snippet block

const sizesCode = `<TulparCheckbox size="xs" :model-value="true" label="Extra small" />
<TulparCheckbox size="sm" :model-value="true" label="Small" />
<TulparCheckbox size="md" :model-value="true" label="Medium (default)" />
<TulparCheckbox size="lg" :model-value="true" label="Large" />
<TulparCheckbox size="xl" :model-value="true" label="Extra large" />`;

const labelSlotCode = `<TulparCheckbox :model-value="true">
  <span slot="label">Remember me</span>
  <span slot="description">Stay signed in for 30 days on this device.</span>
</TulparCheckbox>`;

const statesCode = `<TulparCheckbox :model-value="true" label="Checked" />
<TulparCheckbox :model-value="false" :disabled="true" label="Disabled" />
<TulparCheckbox :model-value="true" :disabled="true" label="Disabled checked" />
<TulparCheckbox :model-value="true" :readonly="true" label="Readonly" />
<TulparCheckbox
  :model-value="false"
  :required="true"
  :invalid="true"
  label="Accept terms"
  error-text="You must accept the terms to continue."
/>`;

const indeterminateCode = `<script setup>
const items = ["read", "write", "delete", "admin"];
const selected = ref(["read", "write"]);

const allSelected = computed(() => selected.value.length === items.length);
const someSelected = computed(
  () => selected.value.length > 0 && selected.value.length < items.length
);

function onSelectAll(e) {
  selected.value = e.target.checked ? [...items] : [];
}
<\/script>

<!-- Parent — indeterminate when some (but not all) are selected -->
<TulparCheckbox
  :model-value="allSelected"
  :indeterminate="someSelected"
  label="Select all"
  @change="onSelectAll"
/>

<!-- Children -->
<TulparCheckbox
  v-for="item in items"
  :key="item"
  :model-value="selected.includes(item)"
  :label="item"
  @change="e => onItemChange(item, e)"
/>`;

const cardVariantCode = `<TulparCheckbox
  variant="card"
  :model-value="selected.includes('starter')"
  label="Starter"
  @change="e => onPlanChange('starter', e)"
>
  <span slot="description">Up to 5 users · 10 GB storage</span>
</TulparCheckbox>`;

const colorCode = `<TulparCheckbox :model-value="true" color="ulgen" label="Ulgen (gold)" />
<TulparCheckbox :model-value="true" color="kizagan" label="Kizagan (red)" />
<TulparCheckbox :model-value="true" color="otuken" label="Otuken (forest)" />`;
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Selection</span>
      <h1 class="page-title">Checkbox</h1>
      <p class="page-lede">
        A boolean selection control with indeterminate state, card variant, custom icon slot, five
        sizes, and full state coverage. Works standalone or inside a CheckboxGroup.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <TulparCheckbox :model-value="true" size="lg" label="I agree to the terms of service" />
        <TulparCheckbox :model-value="false" size="lg" label="Subscribe to newsletter" />
        <TulparCheckbox
          :model-value="true"
          :indeterminate="false"
          size="lg"
          label="Select all items"
        />
      </div>
    </section>

    <!-- ── 1. Sizes ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Sizes</h2>
      <p class="section-desc">
        Five sizes: <code class="inline-code">xs</code> through <code class="inline-code">xl</code>.
        Default is <code class="inline-code">md</code>.
      </p>
      <div class="preview preview--col">
        <TulparCheckbox size="xs" :model-value="true" label="Extra small" />
        <TulparCheckbox size="sm" :model-value="true" label="Small" />
        <TulparCheckbox size="md" :model-value="true" label="Medium (default)" />
        <TulparCheckbox size="lg" :model-value="true" label="Large" />
        <TulparCheckbox size="xl" :model-value="true" label="Extra large" />
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 2. Label + description ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Label + description slots</h2>
      <p class="section-desc">
        Use <code class="inline-code">slot="label"</code> and
        <code class="inline-code">slot="description"</code> for supporting text below the label.
      </p>
      <div class="preview preview--col">
        <TulparCheckbox :model-value="true">
          <span slot="label">Remember me</span>
          <span slot="description">Stay signed in for 30 days on this device.</span>
        </TulparCheckbox>
        <TulparCheckbox :model-value="false">
          <span slot="label">Marketing emails</span>
          <span slot="description">Get occasional updates about new features and offers.</span>
        </TulparCheckbox>
      </div>
      <pre class="code"><code>{{ labelSlotCode }}</code></pre>
    </section>

    <!-- ── 3. States ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. States</h2>
      <p class="section-desc">
        Checked, unchecked, disabled, readonly, required + invalid with
        <code class="inline-code">error-text</code>.
      </p>
      <div class="preview preview--col">
        <TulparCheckbox :model-value="true" label="Checked" />
        <TulparCheckbox :model-value="false" label="Unchecked" />
        <TulparCheckbox :model-value="false" :disabled="true" label="Disabled" />
        <TulparCheckbox :model-value="true" :disabled="true" label="Disabled checked" />
        <TulparCheckbox :model-value="true" :readonly="true" label="Readonly" />
        <TulparCheckbox
          :model-value="false"
          :required="true"
          :invalid="true"
          label="Accept terms"
          error-text="You must accept the terms to continue."
        />
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 4. Indeterminate + Select-all demo ────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Indeterminate + select-all</h2>
      <p class="section-desc">
        The <code class="inline-code">indeterminate</code> prop renders a dash instead of a
        checkmark — used for a "select all" parent whose children are partially selected. Wire it
        via a <code class="inline-code">computed</code> that checks whether some (but not all) items
        are selected.
      </p>
      <div class="preview preview--col">
        <TulparCheckbox
          :model-value="allSelected"
          :indeterminate="someSelected"
          label="Select all permissions"
          @change="onSelectAllChange"
        />
        <div class="indent-group">
          <TulparCheckbox
            v-for="item in selectAllItems"
            :key="item"
            :model-value="selectedPermissions.includes(item)"
            :label="item"
            @change="(e) => onItemChange(item, e)"
          />
        </div>
        <p class="live-value">
          Selected: <strong>{{ selectedPermissions.join(", ") || "(none)" }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ indeterminateCode }}</code></pre>
    </section>

    <!-- ── 5. Card variant ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Card variant</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> wraps the checkbox and its label in a
        clickable card surface — great for plan pickers and feature toggles.
      </p>
      <div class="preview">
        <div class="card-grid">
          <TulparCheckbox
            variant="card"
            :model-value="selectedPlans.includes('starter')"
            @change="(e) => onPlanChange('starter', e)"
          >
            <span slot="label">Starter</span>
            <span slot="description">Up to 5 users · 10 GB storage</span>
          </TulparCheckbox>
          <TulparCheckbox
            variant="card"
            :model-value="selectedPlans.includes('pro')"
            @change="(e) => onPlanChange('pro', e)"
          >
            <span slot="label">Pro</span>
            <span slot="description">Up to 25 users · 100 GB storage</span>
          </TulparCheckbox>
          <TulparCheckbox
            variant="card"
            :model-value="selectedPlans.includes('enterprise')"
            @change="(e) => onPlanChange('enterprise', e)"
          >
            <span slot="label">Enterprise</span>
            <span slot="description">Unlimited users · 1 TB storage</span>
          </TulparCheckbox>
        </div>
      </div>
      <pre class="code"><code>{{ cardVariantCode }}</code></pre>
    </section>

    <!-- ── 6. Color ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Color</h2>
      <p class="section-desc">
        The <code class="inline-code">color</code> prop overrides the checked state color with any
        design-system palette value.
      </p>
      <div class="preview">
        <TulparCheckbox :model-value="true" color="ulgen" label="Ulgen (gold)" />
        <TulparCheckbox :model-value="true" color="kizagan" label="Kizagan (red)" />
        <TulparCheckbox :model-value="true" color="otuken" label="Otuken (forest)" />
        <TulparCheckbox :model-value="true" color="kam" label="Kam (purple)" />
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 7. Real-world — permissions list ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — permissions matrix</h2>
      <p class="section-desc">
        A role-editor table using checkboxes for each CRUD permission per resource. Each column is
        an independent boolean with a label.
      </p>
      <div class="composition">
        <div class="permissions-card">
          <table class="permissions-table">
            <thead>
              <tr>
                <th class="perm-resource">Resource</th>
                <th>Create</th>
                <th>Read</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(perms, resource) in permissionGroups" :key="resource">
                <td class="perm-resource-name">{{ resource }}</td>
                <td v-for="action in ['create', 'read', 'update', 'delete']" :key="action">
                  <TulparCheckbox
                    :model-value="(perms as Record<string, boolean>)[action]"
                    :no-message-space="true"
                    size="sm"
                    @change="
                      (e: Event) => {
                        const el = e.target as HTMLElement & { checked: boolean };
                        (permissionGroups as Record<string, Record<string, boolean>>)[resource][
                          action
                        ] = el.checked;
                      }
                    "
                  />
                </td>
              </tr>
            </tbody>
          </table>
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
  gap: 24px;
  align-items: center;
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
  gap: 12px;
  align-items: center;
}

.preview--col {
  flex-direction: column;
  align-items: flex-start;
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

.indent-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 24px;
  border-left: 2px solid var(--tulpar-color-border-default, #d9e0df);
  margin-left: 4px;
}

.live-value {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  width: 100%;
}

.composition {
  display: flex;
}

.permissions-card {
  flex: 1;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 12px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
  overflow: hidden;
}

.permissions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.permissions-table th {
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--tulpar-color-text-muted, #74777a);
  text-align: center;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.perm-resource {
  text-align: left !important;
}

.permissions-table td {
  padding: 12px 16px;
  text-align: center;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.permissions-table tr:last-child td {
  border-bottom: none;
}

.perm-resource-name {
  text-align: left;
  font-weight: 500;
  color: var(--tulpar-color-text-primary, #15110b);
  text-transform: capitalize;
}
</style>
