<script setup lang="ts">
import { ref } from "vue";
import { TulparSwitch, TulparButton } from "@tulpar-ui/vue";
import { Sun, Moon, Wifi, Bell, Shield, Eye } from "lucide-vue-next";

// ─── State ───────────────────────────────────────────────────────────────────
const heroChecked = ref(true);
const loadingChecked = ref(false);
const isLoading = ref(false);

function triggerAsyncToggle() {
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

// heroCode intentionally removed — hero section uses no snippet block

const sizesCode = `<TulparSwitch size="xs" v-model="checked" label="Extra small" />
<TulparSwitch size="sm" v-model="checked" label="Small" />
<TulparSwitch size="md" v-model="checked" label="Medium (default)" />
<TulparSwitch size="lg" v-model="checked" label="Large" />
<TulparSwitch size="xl" v-model="checked" label="Extra large" />`;

const labelPositionCode = `<!-- label at the end (default) -->
<TulparSwitch v-model="checked" label="Notifications" label-position="end" />

<!-- label at the start -->
<TulparSwitch v-model="checked" label="Dark mode" label-position="start" />`;

const labelSlotCode = `<TulparSwitch v-model="checked">
  <span slot="label">Enable two-factor authentication</span>
  <span slot="description">
    Adds an extra layer of security to your account login.
  </span>
</TulparSwitch>`;

const statesCode = `<!-- Checked -->
<TulparSwitch :model-value="true" label="Checked" />

<!-- Disabled (off) -->
<TulparSwitch :model-value="false" :disabled="true" label="Disabled" />

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
  loading.value = true;
  setTimeout(() => {
    checked.value = !checked.value;
    loading.value = false;
  }, 1200);
}
<\/script>

<TulparButton @click="toggle" :disabled="loading">Async toggle</TulparButton>
<TulparSwitch :model-value="checked" :loading="loading" label="Saving preference…" />`;

const showIconCode = `<!-- Default check/cross icons -->
<TulparSwitch v-model="checked" :show-icon="true" label="With icons" />`;

const customIconCode = `<TulparSwitch v-model="checked" :show-icon="true">
  <svg slot="icon-on" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" width="10" height="10">
    <!-- sun icon -->
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="6"/>
    <line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/>
  </svg>
  <svg slot="icon-off" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" width="10" height="10">
    <!-- moon icon -->
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
</TulparSwitch>`;

const colorCode = `<TulparSwitch v-model="checked" color="ulgen" label="Ulgen (gold)" />
<TulparSwitch v-model="checked" color="kizagan" label="Kizagan (red)" />
<TulparSwitch v-model="checked" on-color="otuken" off-color="kam"
  label="On=Otuken / Off=Kam" />`;
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Selection</span>
      <h1 class="page-title">Switch</h1>
      <p class="page-lede">
        A boolean toggle control — five sizes, start/end label, named slots for label + description,
        loading state, custom icons, and color overrides. Form-associated via the underlying web
        component.
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
        <code class="inline-code">xl</code>.
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

    <!-- ── 3. Label + description slots ─────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Label + description slots</h2>
      <p class="section-desc">
        Use <code class="inline-code">slot="label"</code> and
        <code class="inline-code">slot="description"</code> for rich content alongside the switch.
      </p>
      <div class="preview preview--col">
        <TulparSwitch :model-value="true">
          <span slot="label">Enable two-factor authentication</span>
          <span slot="description">
            Adds an extra layer of security to your account login. You will need an authenticator
            app.
          </span>
        </TulparSwitch>
        <TulparSwitch :model-value="false">
          <span slot="label">Marketing emails</span>
          <span slot="description">Receive product updates, tips, and special offers.</span>
        </TulparSwitch>
      </div>
      <pre class="code"><code>{{ labelSlotCode }}</code></pre>
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
      <h2 class="section-title">5. Loading — async demo</h2>
      <p class="section-desc">
        The <code class="inline-code">loading</code> prop shows a spinner inside the thumb and
        prevents interaction. Click the button below to simulate a 1.2 s async preference save.
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

    <!-- ── 6. Show icon ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. show-icon — check / cross indicator</h2>
      <p class="section-desc">
        <code class="inline-code">show-icon</code> renders a check mark when on and a cross when off
        inside the track.
      </p>
      <div class="preview">
        <TulparSwitch :model-value="true" :show-icon="true" label="Show-icon on" />
        <TulparSwitch :model-value="false" :show-icon="true" label="Show-icon off" />
        <TulparSwitch :model-value="true" size="lg" :show-icon="true" label="Large with icon" />
      </div>
      <pre class="code"><code>{{ showIconCode }}</code></pre>
    </section>

    <!-- ── 7. Custom icon-on / icon-off ─────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Custom icon-on / icon-off slots</h2>
      <p class="section-desc">
        Replace the default check/cross with any SVG via
        <code class="inline-code">slot="icon-on"</code> and
        <code class="inline-code">slot="icon-off"</code>. Classic example: sun for day, moon for
        night.
      </p>
      <div class="preview">
        <TulparSwitch :model-value="true" :show-icon="true" size="lg" label="Day / Night">
          <Sun slot="icon-on" :size="12" />
          <Moon slot="icon-off" :size="12" />
        </TulparSwitch>
        <TulparSwitch :model-value="false" :show-icon="true" size="lg" label="Day / Night (off)">
          <Sun slot="icon-on" :size="12" />
          <Moon slot="icon-off" :size="12" />
        </TulparSwitch>
      </div>
      <pre class="code"><code>{{ customIconCode }}</code></pre>
    </section>

    <!-- ── 8. Color ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Color</h2>
      <p class="section-desc">
        Override the on-state color with <code class="inline-code">color</code> or independently
        control on/off track colors with <code class="inline-code">on-color</code> /
        <code class="inline-code">off-color</code>.
      </p>
      <div class="preview preview--col">
        <TulparSwitch :model-value="true" color="ulgen" label="Ulgen (antique gold)" />
        <TulparSwitch :model-value="true" color="kizagan" label="Kizagan (danger red)" />
        <TulparSwitch :model-value="true" color="otuken" label="Otuken (forest green)" />
        <TulparSwitch
          :model-value="true"
          on-color="otuken"
          off-color="kizagan"
          label="On=Otuken / Off=Kizagan"
        />
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 9. Real-world — Settings card ─────────────────────────────────────── -->
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
