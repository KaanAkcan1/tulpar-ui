<script setup lang="ts">
import { ref } from "vue";
import { TulparSwitch, TulparButton } from "@tulpar-ui/vue";
import { Sun, Moon, Wifi, Bell, Shield, Eye } from "lucide-vue-next";

// ─── State ───────────────────────────────────────────────────────────────────
const heroChecked = ref(true);
const loadingChecked = ref(false);
const isLoading = ref(false);

function triggerAsyncToggle() {
  // Real revert-then-commit: show loading, then commit the new value.
  isLoading.value = true;
  setTimeout(() => {
    loadingChecked.value = !loadingChecked.value;
    isLoading.value = false;
  }, 1200);
}

// Real-world settings card
const notificationsEnabled = ref(true);
const wifiEnabled = ref(true);
const privacyEnabled = ref(false);
const visibilityEnabled = ref(true);

// ─── Code snippets ────────────────────────────────────────────────────────────

const sizesCode = `<TulparSwitch size="xs" :model-value="true" label="Extra small" />
<TulparSwitch size="sm" :model-value="true" label="Small" />
<TulparSwitch size="md" :model-value="true" label="Medium (default)" />
<TulparSwitch size="lg" :model-value="true" label="Large" />
<TulparSwitch size="xl" :model-value="true" label="Extra large" />`;

const labelPositionCode = `<!-- label at the end (default) -->
<TulparSwitch v-model="checked" label="Notifications" label-position="end" />

<!-- label at the start -->
<TulparSwitch v-model="checked" label="Dark mode" label-position="start" />`;

const propsVsSlotsCode = `<!-- (a) PROP form — label + description as attributes -->
<TulparSwitch
  v-model="checked"
  label="Two-factor authentication"
  description="Adds an extra layer of security to your account login."
/>

<!-- (b) SLOT form — rich content via named slots -->
<TulparSwitch v-model="checked">
  <span slot="label">Two-factor authentication</span>
  <span slot="description">
    Adds an extra layer of security to your account login.
  </span>
</TulparSwitch>`;

const statesCode = `<!-- Checked -->
<TulparSwitch :model-value="true" label="Checked" />

<!-- Disabled (off) -->
<TulparSwitch :model-value="false" :disabled="true" label="Disabled off" />

<!-- Disabled (on) -->
<TulparSwitch :model-value="true" :disabled="true" label="Disabled on" />

<!-- Readonly -->
<TulparSwitch :model-value="true" :readonly="true" label="Readonly" />

<!-- Required + invalid + error text -->
<TulparSwitch
  :model-value="false"
  :required="true"
  :invalid="true"
  label="Accept terms"
  error-text="You must accept the terms to continue."
/>`;

const loadingCode = `<script setup>
const checked = ref(false);
const loading = ref(false);

function toggle() {
  // revert-then-commit: flag loading, then commit after the async work
  loading.value = true;
  setTimeout(() => {
    checked.value = !checked.value;
    loading.value = false;
  }, 1200);
}
<\/script>

<TulparSwitch :model-value="checked" :loading="loading" label="Auto-save drafts" />
<TulparButton @click="toggle" :disabled="loading">Toggle with async</TulparButton>`;

const showIconCode = `<!-- Default check / cross indicator inside the track -->
<TulparSwitch :model-value="true" :show-icon="true" label="Show-icon on" />
<TulparSwitch :model-value="false" :show-icon="true" label="Show-icon off" />`;

const iconPropCode = `<!-- Custom icons via PROP — pass a lucide-vue-next component -->
<script setup>
import { Sun, Moon } from "lucide-vue-next";
<\/script>

<TulparSwitch
  :model-value="true"
  :show-icon="true"
  size="lg"
  :icon-on="Sun"
  :icon-off="Moon"
  label="Day / Night (prop)"
/>`;

const iconSlotCode = `<!-- Custom icons via SLOT — any SVG works -->
<TulparSwitch :model-value="true" :show-icon="true" size="lg" label="Day / Night (slot)">
  <Sun slot="icon-on" :size="12" />
  <Moon slot="icon-off" :size="12" />
</TulparSwitch>`;

const colorCode = `<!-- Single color override (on-state) — BIND it -->
<TulparSwitch :model-value="true" :color="'ulgen'" label="Ulgen (gold)" />
<TulparSwitch :model-value="true" :color="'otuken'" label="Otuken (forest)" />
<TulparSwitch :model-value="true" :color="'kizagan'" label="Kizagan (danger)" />

<!-- Independent on / off track colors — bind both -->
<TulparSwitch
  :model-value="true"
  :on-color="'otuken'"
  :off-color="'kizagan'"
  label="On = Otuken / Off = Kizagan"
/>`;
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Core</span>
      <h1 class="page-title">Switch</h1>
      <p class="page-lede">
        An immediate on/off toggle — five sizes, start/end label, label &amp; description in both
        prop and slot form, loading state, default and custom icons (prop + slot), and per-state
        color overrides. Form-associated via the underlying web component.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <TulparSwitch v-model="heroChecked" size="lg" label="Enable notifications" />
        <TulparSwitch v-model="heroChecked" size="lg" label-position="start" label="Dark mode" />
      </div>
    </section>

    <!-- ── 1. Sizes ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Sizes</h2>
      <p class="section-desc">
        Five sizes: <code class="inline-code">xs</code>, <code class="inline-code">sm</code>,
        <code class="inline-code">md</code> (default), <code class="inline-code">lg</code>,
        <code class="inline-code">xl</code>. All checked.
      </p>
      <div class="preview preview--col">
        <TulparSwitch :model-value="true" size="xs" label="Extra small" />
        <TulparSwitch :model-value="true" size="sm" label="Small" />
        <TulparSwitch :model-value="true" size="md" label="Medium (default)" />
        <TulparSwitch :model-value="true" size="lg" label="Large" />
        <TulparSwitch :model-value="true" size="xl" label="Extra large" />
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 2. Label position ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Label position</h2>
      <p class="section-desc">
        <code class="inline-code">label-position="end"</code> (default) or
        <code class="inline-code">label-position="start"</code>.
      </p>
      <div class="preview preview--col">
        <TulparSwitch :model-value="true" label="Notifications" label-position="end" />
        <TulparSwitch :model-value="true" label="Dark mode" label-position="start" />
      </div>
      <pre class="code"><code>{{ labelPositionCode }}</code></pre>
    </section>

    <!-- ── 3. Props vs slots — label & description ───────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Props vs slots — label &amp; description</h2>
      <p class="section-desc">
        Every content capability works in BOTH forms. Use the
        <code class="inline-code">label</code> / <code class="inline-code">description</code> props
        for plain text, or the <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code> slots for rich content. Both render
        identically.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <TulparSwitch
            :model-value="true"
            label="Two-factor authentication"
            description="Adds an extra layer of security to your account login."
          />
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <TulparSwitch :model-value="true">
            <span slot="label">Two-factor authentication</span>
            <span slot="description"> Adds an extra layer of security to your account login. </span>
          </TulparSwitch>
        </div>
      </div>
      <pre class="code"><code>{{ propsVsSlotsCode }}</code></pre>
    </section>

    <!-- ── 4. States ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. States</h2>
      <p class="section-desc">
        Checked, disabled (on/off), readonly, required + invalid with
        <code class="inline-code">error-text</code>.
      </p>
      <div class="preview preview--col">
        <TulparSwitch :model-value="true" label="Checked" />
        <TulparSwitch :model-value="false" :disabled="true" label="Disabled off" />
        <TulparSwitch :model-value="true" :disabled="true" label="Disabled on" />
        <TulparSwitch :model-value="true" :readonly="true" label="Readonly" />
        <TulparSwitch
          :model-value="false"
          :required="true"
          :invalid="true"
          label="Accept terms"
          error-text="You must accept the terms to continue."
        />
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 5. Loading — async demo ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Loading — async (revert-then-commit)</h2>
      <p class="section-desc">
        The <code class="inline-code">loading</code> prop shows a spinner inside the thumb and
        prevents interaction. Click the button to simulate a 1.2 s async preference save — the
        switch commits its new value only after the work resolves.
      </p>
      <div class="preview preview--col">
        <TulparSwitch
          :model-value="loadingChecked"
          :loading="isLoading"
          label="Auto-save drafts"
          :helper-text="
            isLoading
              ? 'Saving preference…'
              : loadingChecked
                ? 'Auto-save is on'
                : 'Auto-save is off'
          "
        />
        <TulparButton
          size="sm"
          severity="secondary"
          variant="outlined"
          :disabled="isLoading"
          @click="triggerAsyncToggle"
        >
          {{ isLoading ? "Saving…" : "Toggle with async" }}
        </TulparButton>
      </div>
      <pre class="code"><code>{{ loadingCode }}</code></pre>
    </section>

    <!-- ── 6. show-icon — default check / cross ──────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. show-icon — check / cross indicator</h2>
      <p class="section-desc">
        <code class="inline-code">show-icon</code> renders a check mark when on and a cross when off
        inside the track. The icon color follows the track color.
      </p>
      <div class="preview">
        <TulparSwitch :model-value="true" :show-icon="true" label="Show-icon on" />
        <TulparSwitch :model-value="false" :show-icon="true" label="Show-icon off" />
        <TulparSwitch :model-value="true" size="lg" :show-icon="true" label="Large with icon" />
      </div>
      <pre class="code"><code>{{ showIconCode }}</code></pre>
    </section>

    <!-- ── 7. Custom icons — prop form ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Custom icons — prop form</h2>
      <p class="section-desc">
        Pass a <code class="inline-code">lucide-vue-next</code> component to
        <code class="inline-code">:icon-on</code> / <code class="inline-code">:icon-off</code> — the
        wrapper renders it into the right slot. Classic example: sun for day, moon for night.
      </p>
      <div class="preview">
        <TulparSwitch
          :model-value="true"
          :show-icon="true"
          size="lg"
          :icon-on="Sun"
          :icon-off="Moon"
          label="Day / Night (prop, on)"
        />
        <TulparSwitch
          :model-value="false"
          :show-icon="true"
          size="lg"
          :icon-on="Sun"
          :icon-off="Moon"
          label="Day / Night (prop, off)"
        />
      </div>
      <pre class="code"><code>{{ iconPropCode }}</code></pre>
    </section>

    <!-- ── 8. Custom icons — slot form ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Custom icons — slot form</h2>
      <p class="section-desc">
        The same custom icons via <code class="inline-code">slot="icon-on"</code> /
        <code class="inline-code">slot="icon-off"</code> — the escape hatch for any SVG or
        non-Lucide icon library.
      </p>
      <div class="preview">
        <TulparSwitch
          :model-value="true"
          :show-icon="true"
          size="lg"
          label="Day / Night (slot, on)"
        >
          <Sun slot="icon-on" :size="12" />
          <Moon slot="icon-off" :size="12" />
        </TulparSwitch>
        <TulparSwitch
          :model-value="false"
          :show-icon="true"
          size="lg"
          label="Day / Night (slot, off)"
        >
          <Sun slot="icon-on" :size="12" />
          <Moon slot="icon-off" :size="12" />
        </TulparSwitch>
      </div>
      <pre class="code"><code>{{ iconSlotCode }}</code></pre>
    </section>

    <!-- ── 9. Color — on-color / off-color (bound) ───────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Color — on-color / off-color</h2>
      <p class="section-desc">
        Override the on-state color with <code class="inline-code">:color</code>, or independently
        control the on/off track colors with <code class="inline-code">:on-color</code> /
        <code class="inline-code">:off-color</code>. Always <strong>bind</strong> these in Vue — a
        static <code class="inline-code">on-color</code> is parsed as an event handler.
      </p>
      <div class="preview preview--col">
        <TulparSwitch :model-value="true" :color="'ulgen'" label="Ulgen (antique gold)" />
        <TulparSwitch :model-value="true" :color="'otuken'" label="Otuken (forest green)" />
        <TulparSwitch :model-value="true" :color="'kizagan'" label="Kizagan (danger red)" />
        <TulparSwitch :model-value="true" :color="'kam'" label="Kam (indigo)" />
        <TulparSwitch
          :model-value="true"
          :on-color="'otuken'"
          :off-color="'kizagan'"
          label="On = Otuken / Off = Kizagan"
        />
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 10. In context — Settings card ────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — Settings card</h2>
      <p class="section-desc">
        Switches grouped in a settings card. Each row has a label + description and an independent
        boolean state.
      </p>
      <div class="composition">
        <div class="settings-card">
          <h3 class="settings-card-title">Device settings</h3>
          <div class="settings-list">
            <div class="settings-row">
              <Wifi class="settings-icon" :size="18" />
              <TulparSwitch v-model="wifiEnabled" :no-message-space="true">
                <span slot="label">Wi-Fi</span>
                <span slot="description">Connect to wireless networks automatically.</span>
              </TulparSwitch>
            </div>
            <div class="settings-row">
              <Bell class="settings-icon" :size="18" />
              <TulparSwitch v-model="notificationsEnabled" :no-message-space="true">
                <span slot="label">Push notifications</span>
                <span slot="description">Receive alerts for activity and updates.</span>
              </TulparSwitch>
            </div>
            <div class="settings-row">
              <Shield class="settings-icon" :size="18" />
              <TulparSwitch v-model="privacyEnabled" :no-message-space="true">
                <span slot="label">Privacy mode</span>
                <span slot="description">Hide your online status from other users.</span>
              </TulparSwitch>
            </div>
            <div class="settings-row">
              <Eye class="settings-icon" :size="18" />
              <TulparSwitch v-model="visibilityEnabled" :no-message-space="true">
                <span slot="label">Profile visibility</span>
                <span slot="description">Allow others to find you by name or email.</span>
              </TulparSwitch>
            </div>
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

/* ── Hero ──────────────────────────────────────────────────────────────── */
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

/* ── Sections ──────────────────────────────────────────────────────────── */
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

/* ── Preview block ─────────────────────────────────────────────────────── */
.preview {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.preview--col {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
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

/* ── Code block ─────────────────────────────────────────────────────────── */
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

/* ── Composition ─────────────────────────────────────────────────────────── */
.composition {
  display: flex;
}

.settings-card {
  flex: 1;
  max-width: 520px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 12px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
  overflow: hidden;
}

.settings-card-title {
  margin: 0;
  padding: 16px 20px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.settings-list {
  display: flex;
  flex-direction: column;
}

.settings-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.settings-row:last-child {
  border-bottom: none;
}

.settings-icon {
  margin-top: 2px;
  flex-shrink: 0;
  color: var(--tulpar-color-text-muted, #74777a);
}
</style>
