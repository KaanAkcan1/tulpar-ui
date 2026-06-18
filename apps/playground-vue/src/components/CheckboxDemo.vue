<script setup lang="ts">
import { ref, computed } from "vue";
import { TulparCheckbox } from "@tulpar-ui/vue";
import { Star } from "lucide-vue-next";

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
  selectedPermissions.value = el.checked ? [...selectAllItems] : [];
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
const selectedPlans = ref<string[]>(["pro"]);

function onPlanChange(plan: string, e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  if (el.checked) {
    selectedPlans.value = [...selectedPlans.value, plan];
  } else {
    selectedPlans.value = selectedPlans.value.filter((v) => v !== plan);
  }
}

// Permissions matrix with per-group select-all
type Resource = "users" | "content" | "billing";
const actions = ["create", "read", "update", "delete"] as const;
const permissionGroups = ref<Record<Resource, Record<string, boolean>>>({
  users: { create: true, read: true, update: false, delete: false },
  content: { create: true, read: true, update: true, delete: false },
  billing: { create: false, read: true, update: false, delete: false },
});

function groupAll(resource: Resource): boolean {
  return actions.every((a) => permissionGroups.value[resource][a]);
}
function groupSome(resource: Resource): boolean {
  const vals = actions.map((a) => permissionGroups.value[resource][a]);
  return vals.some(Boolean) && !vals.every(Boolean);
}
function onGroupSelectAll(resource: Resource, e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  for (const a of actions) permissionGroups.value[resource][a] = el.checked;
}

// ─── Code snippets ────────────────────────────────────────────────────────────

const sizesCode = `<TulparCheckbox size="xs" :model-value="true" label="Extra small" />
<TulparCheckbox size="sm" :model-value="true" label="Small" />
<TulparCheckbox size="md" :model-value="true" label="Medium (default)" />
<TulparCheckbox size="lg" :model-value="true" label="Large" />
<TulparCheckbox size="xl" :model-value="true" label="Extra large" />`;

const propsVsSlotsCode = `<!-- (a) PROP form -->
<TulparCheckbox
  :model-value="true"
  label="Remember me"
  description="Stay signed in for 30 days on this device."
/>

<!-- (b) SLOT form -->
<TulparCheckbox :model-value="true">
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

const iconPropCode = `<!-- Custom check glyph via PROP — pass a lucide component -->
<script setup>
import { Star } from "lucide-vue-next";
<\/script>

<TulparCheckbox :model-value="true" :icon="Star" label="Star (prop)" />

<!-- The indeterminate dash is NEVER overridden by a custom icon -->
<TulparCheckbox :model-value="false" :indeterminate="true" :icon="Star" label="Indeterminate" />`;

const iconSlotCode = `<!-- Custom check glyph via SLOT — any SVG (here a heart) -->
<TulparCheckbox :model-value="true" label="Heart (slot)">
  <svg slot="icon" viewBox="0 0 24 24" width="12" height="12"
    fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7.5-4.9-10-9.3C.4 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3
      C17 5 18.6 8.6 17 11.7 14.5 16.1 12 21 12 21z" />
  </svg>
</TulparCheckbox>`;

const colorCode = `<TulparCheckbox :model-value="true" :color="'ulgen'" label="Ulgen (gold)" />
<TulparCheckbox :model-value="true" :color="'otuken'" label="Otuken (forest)" />
<TulparCheckbox :model-value="true" :color="'kizagan'" label="Kizagan (red)" />
<TulparCheckbox :model-value="true" :color="'kam'" label="Kam (indigo)" />`;

const cardVariantCode = `<TulparCheckbox
  variant="card"
  :model-value="selected.includes('pro')"
  @change="e => onPlanChange('pro', e)"
>
  <span slot="label">Pro</span>
  <span slot="description">Up to 25 users · 100 GB storage</span>
</TulparCheckbox>`;
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Core</span>
      <h1 class="page-title">Checkbox</h1>
      <p class="page-lede">
        A boolean selection control — five sizes, label &amp; description in prop and slot form,
        indeterminate select-all, custom check glyph (prop + slot), per-color overrides, and a card
        variant. Works standalone or inside a CheckboxGroup.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <TulparCheckbox :model-value="true" size="lg" label="I agree to the terms of service" />
        <TulparCheckbox :model-value="false" size="lg" label="Subscribe to newsletter" />
        <TulparCheckbox :model-value="false" :indeterminate="true" size="lg" label="Select all" />
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

    <!-- ── 2. Props vs slots — label & description ───────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Props vs slots — label &amp; description</h2>
      <p class="section-desc">
        Use <code class="inline-code">label</code> /
        <code class="inline-code">description</code> props for plain text, or
        <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code> for rich content. Both render
        identically.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <TulparCheckbox
            :model-value="true"
            label="Remember me"
            description="Stay signed in for 30 days on this device."
          />
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <TulparCheckbox :model-value="true">
            <span slot="label">Remember me</span>
            <span slot="description">Stay signed in for 30 days on this device.</span>
          </TulparCheckbox>
        </div>
      </div>
      <pre class="code"><code>{{ propsVsSlotsCode }}</code></pre>
    </section>

    <!-- ── 3. States ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. States</h2>
      <p class="section-desc">
        Checked, disabled, disabled-checked, readonly, required + invalid with
        <code class="inline-code">error-text</code>.
      </p>
      <div class="preview preview--col">
        <TulparCheckbox :model-value="true" label="Checked" />
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
        checkmark — for a "select all" parent whose children are partially selected. Wire it via a
        <code class="inline-code">computed</code> checking whether some (but not all) items are
        selected. Toggle the parent to select / clear all.
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

    <!-- ── 5. Custom icon — prop form ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Custom check glyph — prop form</h2>
      <p class="section-desc">
        Pass a <code class="inline-code">lucide-vue-next</code> component to
        <code class="inline-code">:icon</code> to replace the default checkmark. The
        <code class="inline-code">indeterminate</code> dash is never overridden by a custom icon.
      </p>
      <div class="preview preview--col">
        <TulparCheckbox :model-value="true" :icon="Star" label="Star (prop)" />
        <TulparCheckbox :model-value="true" size="lg" :icon="Star" label="Star large" />
        <TulparCheckbox
          :model-value="false"
          :indeterminate="true"
          :icon="Star"
          label="Indeterminate keeps the dash"
        />
      </div>
      <pre class="code"><code>{{ iconPropCode }}</code></pre>
    </section>

    <!-- ── 6. Custom icon — slot form ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Custom check glyph — slot form</h2>
      <p class="section-desc">
        The same swap via <code class="inline-code">slot="icon"</code> — the escape hatch for any
        SVG or non-Lucide icon. Here, a filled heart.
      </p>
      <div class="preview preview--col">
        <TulparCheckbox :model-value="true" label="Heart (slot)">
          <svg
            slot="icon"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 21s-7.5-4.9-10-9.3C.4 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3C17 5 18.6 8.6 17 11.7 14.5 16.1 12 21 12 21z"
            />
          </svg>
        </TulparCheckbox>
        <TulparCheckbox :model-value="true" size="lg" label="Heart large (slot)">
          <svg
            slot="icon"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 21s-7.5-4.9-10-9.3C.4 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3C17 5 18.6 8.6 17 11.7 14.5 16.1 12 21 12 21z"
            />
          </svg>
        </TulparCheckbox>
      </div>
      <pre class="code"><code>{{ iconSlotCode }}</code></pre>
    </section>

    <!-- ── 7. Color ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Color</h2>
      <p class="section-desc">
        Bind <code class="inline-code">:color</code> to override the checked-fill with any
        design-system palette value.
      </p>
      <div class="preview">
        <TulparCheckbox :model-value="true" :color="'ulgen'" label="Ulgen (gold)" />
        <TulparCheckbox :model-value="true" :color="'otuken'" label="Otuken (forest)" />
        <TulparCheckbox :model-value="true" :color="'kizagan'" label="Kizagan (red)" />
        <TulparCheckbox :model-value="true" :color="'kam'" label="Kam (indigo)" />
        <TulparCheckbox :model-value="true" :color="'yersu'" label="Yersu (teal)" />
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 8. Card variant ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Card variant</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> wraps the checkbox and its label in a
        clickable card surface — selected cards are tinted with a brand border. Great for plan
        pickers and feature toggles.
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

    <!-- ── 9. In context — permissions matrix ────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — permissions matrix</h2>
      <p class="section-desc">
        A role editor — each resource has a select-all parent (indeterminate when partially
        selected) plus a CRUD checkbox per action. Toggle a parent to flip the whole row.
      </p>
      <div class="composition">
        <div class="permissions-card">
          <table class="permissions-table">
            <thead>
              <tr>
                <th class="perm-resource">Resource</th>
                <th>All</th>
                <th>Create</th>
                <th>Read</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resource in ['users', 'content', 'billing'] as const" :key="resource">
                <td class="perm-resource-name">{{ resource }}</td>
                <td>
                  <TulparCheckbox
                    :model-value="groupAll(resource)"
                    :indeterminate="groupSome(resource)"
                    :no-message-space="true"
                    size="sm"
                    @change="(e) => onGroupSelectAll(resource, e)"
                  />
                </td>
                <td v-for="action in actions" :key="action">
                  <TulparCheckbox
                    :model-value="permissionGroups[resource][action]"
                    :no-message-space="true"
                    size="sm"
                    @change="
                      (e) => {
                        const el = e.target as HTMLElement & { checked: boolean };
                        permissionGroups[resource][action] = el.checked;
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
  gap: 12px 24px;
  align-items: center;
}

.preview--col {
  flex-direction: column;
  align-items: flex-start;
}

.preview--cols {
  align-items: flex-start;
  gap: 40px;
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
