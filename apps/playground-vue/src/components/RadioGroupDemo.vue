<script setup lang="ts">
import { ref } from "vue";
import { TulparRadioGroup, TulparRadio } from "@tulpar-ui/vue";

// ─── State ───────────────────────────────────────────────────────────────────

const heroValue = ref("monthly");
const orientationValue = ref("monthly");
const horizontalValue = ref("light");
const statesGroupValue = ref<string | null>(null);
const disabledGroupValue = ref("standard");
const cardValue = ref("pro");
const colorValue = ref("green");
const compositionValue = ref("pro");

// ─── Code snippets ────────────────────────────────────────────────────────────

// heroCode intentionally removed — hero section uses no snippet block

const orientationCode = `<!-- Vertical (default) -->
<TulparRadioGroup v-model="value" orientation="vertical" label="Choose one">
  <TulparRadio value="a" label="Option A" />
  <TulparRadio value="b" label="Option B" />
  <TulparRadio value="c" label="Option C" />
</TulparRadioGroup>

<!-- Horizontal -->
<TulparRadioGroup v-model="value" orientation="horizontal" label="Choose one">
  <TulparRadio value="light" label="Light" />
  <TulparRadio value="dark" label="Dark" />
  <TulparRadio value="system" label="System" />
</TulparRadioGroup>`;

const groupDescCode = `<TulparRadioGroup v-model="value" name="theme" required>
  <span slot="label">Appearance</span>
  <span slot="description">
    Choose how Tulpar UI looks to you. This setting applies to this browser.
  </span>
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

const colorCode = `<TulparRadioGroup v-model="value" color="ulgen" label="Color: ulgen">
  <TulparRadio value="a" label="Option A" />
  <TulparRadio value="b" label="Option B" />
</TulparRadioGroup>`;

const keyboardCode = `<!-- Keyboard navigation is managed by tulpar-radio-group automatically.
     The group implements roving tabindex:
       - Tab / Shift+Tab  — enter/leave the group
       - ArrowDown / ArrowRight — next option
       - ArrowUp / ArrowLeft   — previous option
       - Home                  — first option
       - End                   — last option
     Focus wraps at boundaries. Only the selected (or first) item is in the
     tab sequence; arrowing changes focus AND value. -->`;
</script>

<template>
  <div class="demo-page">
    <header class="page-header">
      <span class="page-tag">Selection</span>
      <h1 class="page-title">RadioGroup</h1>
      <p class="page-lede">
        A single-select fieldset — vertical or horizontal orientation, card variant for plan
        pickers, group-level label + description, and full roving-tabindex keyboard navigation out
        of the box.
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

    <!-- ── 1. Orientation ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Orientation</h2>
      <p class="section-desc">
        <code class="inline-code">orientation="vertical"</code> (default) stacks options in a
        column. <code class="inline-code">orientation="horizontal"</code> lays them out in a row.
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

    <!-- ── 2. Group label + description slots ─────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Group label + description</h2>
      <p class="section-desc">
        Use <code class="inline-code">slot="label"</code> and
        <code class="inline-code">slot="description"</code> on the group for a rich legend above the
        options.
      </p>
      <div class="preview">
        <TulparRadioGroup v-model="horizontalValue" name="theme-desc" :required="true">
          <span slot="label">Appearance</span>
          <span slot="description"
            >Choose how Tulpar UI looks. This setting applies to this browser.</span
          >
          <TulparRadio value="light" label="Light" />
          <TulparRadio value="dark" label="Dark" />
          <TulparRadio value="system" label="System" />
        </TulparRadioGroup>
      </div>
      <pre class="code"><code>{{ groupDescCode }}</code></pre>
    </section>

    <!-- ── 3. States ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. States</h2>
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

        <TulparRadioGroup v-model="orientationValue" label="Item disabled" name="states-item">
          <TulparRadio value="free" label="Free" />
          <TulparRadio value="pro" label="Pro (unavailable)" :disabled="true" />
          <TulparRadio value="enterprise" label="Enterprise" />
        </TulparRadioGroup>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 4. Card variant ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Card variant — plan picker</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> on each
        <code class="inline-code">TulparRadio</code> renders clickable cards — ideal for plan or
        layout pickers.
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

    <!-- ── 5. Color ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Color</h2>
      <p class="section-desc">
        Override the selected-state accent with any design-system palette value via
        <code class="inline-code">color</code> on the group.
      </p>
      <div class="preview preview--row-gap">
        <TulparRadioGroup
          v-model="colorValue"
          color="ulgen"
          label="Ulgen (gold)"
          name="color-ulgen"
        >
          <TulparRadio value="green" label="Option A" />
          <TulparRadio value="gold" label="Option B" />
        </TulparRadioGroup>
        <TulparRadioGroup
          v-model="colorValue"
          color="kizagan"
          label="Kizagan (red)"
          name="color-kizagan"
        >
          <TulparRadio value="green" label="Option A" />
          <TulparRadio value="red" label="Option B" />
        </TulparRadioGroup>
        <TulparRadioGroup
          v-model="colorValue"
          color="otuken"
          label="Otuken (forest)"
          name="color-otuken"
        >
          <TulparRadio value="green" label="Option A" />
          <TulparRadio value="forest" label="Option B" />
        </TulparRadioGroup>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 6. Keyboard navigation ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Keyboard navigation</h2>
      <p class="section-desc">
        The group implements roving tabindex — only the selected (or first) option is in the tab
        sequence. Arrow keys move focus and change the value simultaneously.
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
        </div>
      </div>
      <pre class="code"><code>{{ keyboardCode }}</code></pre>
    </section>

    <!-- ── 7. Real-world — plan picker ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — pricing plan picker</h2>
      <p class="section-desc">
        A full plan selection card using the card variant with descriptions, showing the selected
        plan detail below.
      </p>
      <div class="composition">
        <div class="plan-card">
          <h3 class="plan-card-title">Choose your plan</h3>
          <p class="plan-card-sub">You can upgrade or downgrade at any time.</p>
          <TulparRadioGroup v-model="compositionValue" name="plan-picker" class="plan-group">
            <TulparRadio variant="card" value="free" label="Free">
              <span slot="description">$0 / mo · 1 user · 1 GB storage · Community support</span>
            </TulparRadio>
            <TulparRadio variant="card" value="pro" label="Pro">
              <span slot="description"
                >$29 / mo · 25 users · 100 GB storage · Priority support</span
              >
            </TulparRadio>
            <TulparRadio variant="card" value="enterprise" label="Enterprise">
              <span slot="description">Custom pricing · Unlimited · Dedicated support + SLA</span>
            </TulparRadio>
          </TulparRadioGroup>
          <p class="plan-selected">
            Selected plan: <strong>{{ compositionValue }}</strong>
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
