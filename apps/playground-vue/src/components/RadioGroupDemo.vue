<script setup lang="ts">
import { ref } from "vue";
import { TulparRadioGroup, TulparRadio } from "@tulpar-ui/vue";

// ─── State ───────────────────────────────────────────────────────────────────

const heroValue = ref("monthly");
const basicValue = ref("yearly");
const propSlotValue = ref("email");
const sizeValue = ref("md");
const orientationValue = ref("monthly");
const horizontalValue = ref("light");
const groupLabelPropValue = ref("system");
const groupLabelSlotValue = ref("system");
const statesGroupValue = ref<string | null>(null);
const disabledGroupValue = ref("standard");
const itemDisabledValue = ref("free");
const cardValue = ref("pro");
const colorGroupValue = ref("b");
const colorPerRadioValue = ref("b");
const compositionValue = ref("important");

// ─── Code snippets ────────────────────────────────────────────────────────────

const basicCode = `<TulparRadioGroup v-model="value" label="Billing period" name="billing">
  <TulparRadio value="monthly" label="Monthly" />
  <TulparRadio value="yearly" label="Yearly" />
  <TulparRadio value="lifetime" label="Lifetime" />
</TulparRadioGroup>

<!-- Live value: {{ value }} -->`;

const propsVsSlotsCode = `<!-- (a) PROP form — radio label + description as attributes -->
<TulparRadio value="email" label="Email" description="Get notified by email." />

<!-- (b) SLOT form — rich label + description -->
<TulparRadio value="sms">
  <span slot="label">SMS</span>
  <span slot="description">Text messages to your phone.</span>
</TulparRadio>`;

const sizesCode = `<!-- size propagates from the group to every radio -->
<TulparRadioGroup v-model="value" size="xs" label="Extra small">…</TulparRadioGroup>
<TulparRadioGroup v-model="value" size="sm" label="Small">…</TulparRadioGroup>
<TulparRadioGroup v-model="value" size="md" label="Medium">…</TulparRadioGroup>
<TulparRadioGroup v-model="value" size="lg" label="Large">…</TulparRadioGroup>
<TulparRadioGroup v-model="value" size="xl" label="Extra large">…</TulparRadioGroup>`;

const orientationCode = `<!-- Vertical (default) -->
<TulparRadioGroup v-model="value" orientation="vertical" label="Vertical">
  <TulparRadio value="monthly" label="Monthly" />
  <TulparRadio value="yearly" label="Yearly" />
</TulparRadioGroup>

<!-- Horizontal -->
<TulparRadioGroup v-model="value" orientation="horizontal" label="Horizontal">
  <TulparRadio value="light" label="Light" />
  <TulparRadio value="dark" label="Dark" />
</TulparRadioGroup>`;

const groupLabelCode = `<!-- (a) PROP form — group legend via label + description -->
<TulparRadioGroup
  v-model="value"
  label="Appearance"
  description="Choose how Tulpar UI looks in this browser."
>
  <TulparRadio value="light" label="Light" />
  <TulparRadio value="dark" label="Dark" />
  <TulparRadio value="system" label="System" />
</TulparRadioGroup>

<!-- (b) SLOT form — rich group legend -->
<TulparRadioGroup v-model="value">
  <span slot="label">Appearance</span>
  <span slot="description">Choose how Tulpar UI looks in this browser.</span>
  <TulparRadio value="light" label="Light" />
  <TulparRadio value="dark" label="Dark" />
  <TulparRadio value="system" label="System" />
</TulparRadioGroup>`;

const statesCode = `<!-- Required + invalid -->
<TulparRadioGroup
  :model-value="null"
  :required="true"
  :invalid="true"
  label="Choose a plan"
  error-text="Please select a plan to continue."
>
  <TulparRadio value="free" label="Free" />
  <TulparRadio value="pro" label="Pro" />
</TulparRadioGroup>

<!-- Group-level disabled -->
<TulparRadioGroup v-model="value" :disabled="true" label="Disabled group">
  <TulparRadio value="standard" label="Standard" />
  <TulparRadio value="express" label="Express" />
</TulparRadioGroup>

<!-- Individual item disabled -->
<TulparRadioGroup v-model="value" label="Item disabled">
  <TulparRadio value="free" label="Free" />
  <TulparRadio value="pro" label="Pro (unavailable)" :disabled="true" />
  <TulparRadio value="enterprise" label="Enterprise" />
</TulparRadioGroup>`;

const cardVariantCode = `<TulparRadioGroup v-model="plan" orientation="horizontal" label="Choose a plan">
  <TulparRadio variant="card" value="starter" label="Starter">
    <span slot="description">$9 / mo · Up to 5 users</span>
  </TulparRadio>
  <TulparRadio variant="card" value="pro" label="Pro">
    <span slot="description">$29 / mo · Up to 25 users</span>
  </TulparRadio>
  <TulparRadio variant="card" value="enterprise" label="Enterprise">
    <span slot="description">Custom pricing · Unlimited</span>
  </TulparRadio>
</TulparRadioGroup>`;

const colorCode = `<!-- Group-level color — bind it -->
<TulparRadioGroup v-model="value" :color="'ulgen'" label="Group color: ulgen">
  <TulparRadio value="a" label="Option A" />
  <TulparRadio value="b" label="Option B" />
</TulparRadioGroup>

<!-- Per-radio override — a single radio overrides the group color -->
<TulparRadioGroup v-model="value" :color="'otuken'" label="Per-radio override">
  <TulparRadio value="a" label="Inherits otuken" />
  <TulparRadio value="b" :color="'kizagan'" label="Overrides to kizagan" />
</TulparRadioGroup>`;

const keyboardCode = `<!-- Keyboard navigation is managed by tulpar-radio-group (roving tabindex):
       Tab / Shift+Tab          — enter / leave the group
       ArrowDown / ArrowRight   — next option (wraps)
       ArrowUp / ArrowLeft      — previous option (wraps)
       Home                     — first option
       End                      — last option
     Disabled options are skipped. Arrowing changes focus AND value. -->`;
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Core</span>
      <h1 class="page-title">RadioGroup</h1>
      <p class="page-lede">
        A single-select fieldset — two-way value, vertical or horizontal orientation, size
        propagation, group legend in prop and slot form, a card variant for plan pickers, group +
        per-radio color, and full roving-tabindex keyboard navigation.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <TulparRadioGroup v-model="heroValue" label="Billing period" name="billing-hero" size="lg">
          <TulparRadio value="monthly" label="Monthly" />
          <TulparRadio value="yearly" label="Yearly" />
          <TulparRadio value="lifetime" label="Lifetime" />
        </TulparRadioGroup>
        <TulparRadioGroup
          v-model="heroValue"
          orientation="horizontal"
          name="billing-hero-h"
          size="lg"
        >
          <TulparRadio value="monthly" label="Monthly" />
          <TulparRadio value="yearly" label="Yearly" />
          <TulparRadio value="lifetime" label="Lifetime" />
        </TulparRadioGroup>
      </div>
    </section>

    <!-- ── 1. Basic ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Basic — vertical group, two-way value</h2>
      <p class="section-desc">
        <code class="inline-code">v-model</code> binds the selected radio's
        <code class="inline-code">value</code>. Selecting an option updates the bound value and
        deselects its siblings.
      </p>
      <div class="preview preview--col">
        <TulparRadioGroup v-model="basicValue" label="Billing period" name="basic">
          <TulparRadio value="monthly" label="Monthly" />
          <TulparRadio value="yearly" label="Yearly" />
          <TulparRadio value="lifetime" label="Lifetime" />
        </TulparRadioGroup>
        <p class="live-value">
          value: <strong>{{ basicValue }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ basicCode }}</code></pre>
    </section>

    <!-- ── 2. Props vs slots — radio label & description ─────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Props vs slots — radio label &amp; description</h2>
      <p class="section-desc">
        Each <code class="inline-code">TulparRadio</code> takes
        <code class="inline-code">label</code> / <code class="inline-code">description</code> props
        OR <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code>. Both render identically.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <TulparRadioGroup v-model="propSlotValue" name="ps-prop">
            <TulparRadio value="email" label="Email" description="Get notified by email." />
            <TulparRadio value="push" label="Push" description="Alerts on your devices." />
          </TulparRadioGroup>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <TulparRadioGroup v-model="propSlotValue" name="ps-slot">
            <TulparRadio value="email">
              <span slot="label">Email</span>
              <span slot="description">Get notified by email.</span>
            </TulparRadio>
            <TulparRadio value="push">
              <span slot="label">Push</span>
              <span slot="description">Alerts on your devices.</span>
            </TulparRadio>
          </TulparRadioGroup>
        </div>
      </div>
      <pre class="code"><code>{{ propsVsSlotsCode }}</code></pre>
    </section>

    <!-- ── 3. Sizes ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Sizes</h2>
      <p class="section-desc">
        The group <code class="inline-code">size</code> propagates to every radio:
        <code class="inline-code">xs</code> through <code class="inline-code">xl</code>.
      </p>
      <div class="preview preview--row-gap">
        <TulparRadioGroup v-model="sizeValue" size="xs" label="xs" name="size-xs">
          <TulparRadio value="md" label="Option A" />
          <TulparRadio value="b" label="Option B" />
        </TulparRadioGroup>
        <TulparRadioGroup v-model="sizeValue" size="sm" label="sm" name="size-sm">
          <TulparRadio value="md" label="Option A" />
          <TulparRadio value="b" label="Option B" />
        </TulparRadioGroup>
        <TulparRadioGroup v-model="sizeValue" size="md" label="md" name="size-md">
          <TulparRadio value="md" label="Option A" />
          <TulparRadio value="b" label="Option B" />
        </TulparRadioGroup>
        <TulparRadioGroup v-model="sizeValue" size="lg" label="lg" name="size-lg">
          <TulparRadio value="md" label="Option A" />
          <TulparRadio value="b" label="Option B" />
        </TulparRadioGroup>
        <TulparRadioGroup v-model="sizeValue" size="xl" label="xl" name="size-xl">
          <TulparRadio value="md" label="Option A" />
          <TulparRadio value="b" label="Option B" />
        </TulparRadioGroup>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 4. Orientation ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Orientation</h2>
      <p class="section-desc">
        <code class="inline-code">orientation="vertical"</code> (default) stacks options;
        <code class="inline-code">orientation="horizontal"</code> lays them out in a row.
      </p>
      <div class="preview preview--row-gap">
        <TulparRadioGroup
          v-model="orientationValue"
          orientation="vertical"
          label="Vertical (default)"
          name="orient-v"
        >
          <TulparRadio value="monthly" label="Monthly" />
          <TulparRadio value="yearly" label="Yearly" />
          <TulparRadio value="lifetime" label="Lifetime" />
        </TulparRadioGroup>
        <TulparRadioGroup
          v-model="horizontalValue"
          orientation="horizontal"
          label="Horizontal"
          name="orient-h"
        >
          <TulparRadio value="light" label="Light" />
          <TulparRadio value="dark" label="Dark" />
          <TulparRadio value="system" label="System" />
        </TulparRadioGroup>
      </div>
      <pre class="code"><code>{{ orientationCode }}</code></pre>
    </section>

    <!-- ── 5. Group label + description — prop AND slot ──────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Group label + description — prop &amp; slot</h2>
      <p class="section-desc">
        The group legend can be set via the <code class="inline-code">label</code> /
        <code class="inline-code">description</code> props OR via group-level
        <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code>.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <TulparRadioGroup
            v-model="groupLabelPropValue"
            name="gl-prop"
            label="Appearance"
            description="Choose how Tulpar UI looks in this browser."
          >
            <TulparRadio value="light" label="Light" />
            <TulparRadio value="dark" label="Dark" />
            <TulparRadio value="system" label="System" />
          </TulparRadioGroup>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <TulparRadioGroup v-model="groupLabelSlotValue" name="gl-slot">
            <span slot="label">Appearance</span>
            <span slot="description">Choose how Tulpar UI looks in this browser.</span>
            <TulparRadio value="light" label="Light" />
            <TulparRadio value="dark" label="Dark" />
            <TulparRadio value="system" label="System" />
          </TulparRadioGroup>
        </div>
      </div>
      <pre class="code"><code>{{ groupLabelCode }}</code></pre>
    </section>

    <!-- ── 6. States ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. States</h2>
      <p class="section-desc">
        Required + invalid with <code class="inline-code">error-text</code>, group-level disabled,
        and per-item disabled.
      </p>
      <div class="preview preview--row-gap">
        <TulparRadioGroup
          :model-value="statesGroupValue"
          :required="true"
          :invalid="true"
          label="Choose a plan"
          error-text="Please select a plan to continue."
          name="states-invalid"
        >
          <TulparRadio value="free" label="Free" />
          <TulparRadio value="pro" label="Pro" />
        </TulparRadioGroup>

        <TulparRadioGroup
          v-model="disabledGroupValue"
          :disabled="true"
          label="Disabled group"
          name="states-disabled"
        >
          <TulparRadio value="standard" label="Standard" />
          <TulparRadio value="express" label="Express" />
        </TulparRadioGroup>

        <TulparRadioGroup v-model="itemDisabledValue" label="Item disabled" name="states-item">
          <TulparRadio value="free" label="Free" />
          <TulparRadio value="pro" label="Pro (unavailable)" :disabled="true" />
          <TulparRadio value="enterprise" label="Enterprise" />
        </TulparRadioGroup>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 7. Card variant — plan picker ─────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Card variant — plan picker</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> on each
        <code class="inline-code">TulparRadio</code> renders arrow-key navigable cards — ideal for
        plan or layout pickers. Each shows a single clean selection dot.
      </p>
      <div class="preview">
        <TulparRadioGroup
          v-model="cardValue"
          orientation="horizontal"
          label="Choose a plan"
          name="card-plans"
        >
          <TulparRadio variant="card" value="starter" label="Starter">
            <span slot="description">$9 / mo · Up to 5 users</span>
          </TulparRadio>
          <TulparRadio variant="card" value="pro" label="Pro">
            <span slot="description">$29 / mo · Up to 25 users</span>
          </TulparRadio>
          <TulparRadio variant="card" value="enterprise" label="Enterprise">
            <span slot="description">Custom · Unlimited</span>
          </TulparRadio>
        </TulparRadioGroup>
      </div>
      <pre class="code"><code>{{ cardVariantCode }}</code></pre>
    </section>

    <!-- ── 8. Color — group + per-radio override ─────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Color — group + per-radio override</h2>
      <p class="section-desc">
        Bind <code class="inline-code">:color</code> on the group to set the accent for every radio,
        or on a single <code class="inline-code">TulparRadio</code> to override just that one.
      </p>
      <div class="preview preview--row-gap">
        <TulparRadioGroup
          v-model="colorGroupValue"
          :color="'ulgen'"
          label="Group: ulgen"
          name="c-ulgen"
        >
          <TulparRadio value="a" label="Option A" />
          <TulparRadio value="b" label="Option B" />
        </TulparRadioGroup>
        <TulparRadioGroup
          v-model="colorGroupValue"
          :color="'kizagan'"
          label="Group: kizagan"
          name="c-kizagan"
        >
          <TulparRadio value="a" label="Option A" />
          <TulparRadio value="b" label="Option B" />
        </TulparRadioGroup>
        <TulparRadioGroup
          v-model="colorPerRadioValue"
          :color="'otuken'"
          label="Per-radio override"
          name="c-override"
        >
          <TulparRadio value="a" label="Inherits otuken" />
          <TulparRadio value="b" :color="'kizagan'" label="Overrides to kizagan" />
        </TulparRadioGroup>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 9. Keyboard navigation ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Keyboard navigation</h2>
      <p class="section-desc">
        The group implements roving tabindex — only the selected (or first) option is in the tab
        sequence. Arrow keys move focus and change the value; disabled options are skipped.
      </p>
      <div class="preview">
        <div class="keyboard-table">
          <div class="keyboard-row">
            <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd>
            <span>Enter or leave the group</span>
          </div>
          <div class="keyboard-row">
            <kbd>↓</kbd> / <kbd>→</kbd>
            <span>Next option (wraps to first)</span>
          </div>
          <div class="keyboard-row">
            <kbd>↑</kbd> / <kbd>←</kbd>
            <span>Previous option (wraps to last)</span>
          </div>
          <div class="keyboard-row">
            <kbd>Home</kbd>
            <span>First option</span>
          </div>
          <div class="keyboard-row">
            <kbd>End</kbd>
            <span>Last option</span>
          </div>
          <div class="keyboard-row">
            <kbd>disabled</kbd>
            <span>Skipped during arrow navigation</span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ keyboardCode }}</code></pre>
    </section>

    <!-- ── 10. In context — notification frequency ───────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — notification frequency</h2>
      <p class="section-desc">
        A settings composition: a single-select frequency picker using the card variant with
        descriptions, plus a live readout of the chosen value.
      </p>
      <div class="composition">
        <div class="plan-card">
          <h3 class="plan-card-title">Email notifications</h3>
          <p class="plan-card-sub">How often should we send you a digest?</p>
          <TulparRadioGroup v-model="compositionValue" name="freq-picker" class="plan-group">
            <TulparRadio variant="card" value="important" label="Important only">
              <span slot="description">Only security alerts and account changes.</span>
            </TulparRadio>
            <TulparRadio variant="card" value="daily" label="Daily digest">
              <span slot="description">One summary email every morning.</span>
            </TulparRadio>
            <TulparRadio variant="card" value="realtime" label="Real-time">
              <span slot="description">Every event, as it happens.</span>
            </TulparRadio>
          </TulparRadioGroup>
          <p class="plan-selected">
            Selected: <strong>{{ compositionValue }}</strong>
          </p>
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
  align-items: flex-start;
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

kbd {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 3px;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 11px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  color: var(--tulpar-color-text-primary, #15110b);
}

.keyboard-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keyboard-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

.composition {
  display: flex;
}

.plan-card {
  flex: 1;
  max-width: 580px;
  padding: 24px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 12px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
}

.plan-card-title {
  margin: 0 0 6px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 20px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.plan-card-sub {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

.plan-group {
  display: block;
  margin-bottom: 16px;
}

.plan-selected {
  margin: 16px 0 0;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
}
</style>
