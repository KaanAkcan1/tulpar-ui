<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { TulparNumberInput } from "@tulpar-ui/vue";

// ─── Section list ─────────────────────────────────────────────────────────────
const sections = [
  { id: "basics", title: "Basics" },
  { id: "formatting", title: "Formatting" },
  { id: "constraints", title: "Constraints" },
  { id: "steppers", title: "Steppers" },
  { id: "keyboard", title: "Keyboard" },
  { id: "format-extras", title: "Format Extras" },
  { id: "advanced", title: "Advanced" },
];

const activeSection = ref("all");

// Two-way bound demo refs
const qty = ref<number | null>(1);

// Formatting
const tryAmount = ref<number | null>(1500);
const usdAmount = ref<number | null>(29.99);
const eurAmount = ref<number | null>(19.99);
const percentVal = ref<number | null>(0.125);

// Constraints
const noEmptyVal = ref<number | null>(0);

// Keyboard
const kbVal = ref<number | null>(50);

// Advanced
const advancedVal = ref<number | null>(-1234567.89);
const advancedRef = ref<HTMLElement | null>(null);
const compactTRYOptions: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "TRY",
  notation: "compact",
  currencySign: "accounting",
};

watchEffect(() => {
  if (advancedRef.value) {
    (advancedRef.value as any).formatOptions = compactTRYOptions;
  }
});

// ─── Code snippets ────────────────────────────────────────────────────────────

const basicsCode = `<!-- Quantity: min/max/step with steppers, two-way binding -->
<TulparNumberInput
  label="Quantity"
  :min="1"
  :max="100"
  :step="1"
  v-model="qty"
/>`;

const formattingCode = `<!-- TRY currency (tr-TR) -->
<TulparNumberInput label="Amount" format-style="currency" currency="TRY" locale="tr-TR"
  :min-fraction-digits="2" :max-fraction-digits="2" />
<!-- USD (en-US) -->
<TulparNumberInput label="Price" format-style="currency" currency="USD" locale="en-US"
  :min-fraction-digits="2" :max-fraction-digits="2" />
<!-- EUR (de-DE) -->
<TulparNumberInput label="Betrag" format-style="currency" currency="EUR" locale="de-DE"
  :min-fraction-digits="2" :max-fraction-digits="2" />
<!-- Percent: value 0.125 → %12,5 (Intl ×100 semantics) -->
<TulparNumberInput label="Percent" format-style="percent" locale="tr-TR" :value="0.125" />
<!-- Grouping off -->
<TulparNumberInput label="No Grouping" :use-grouping="false" :value="1234567" />`;

const constraintsCode = `<!-- min/max clamp-on-blur -->
<TulparNumberInput label="Clamped (0–100)" :min="0" :max="100" />
<!-- integer-only: pressing '.' shakes the field -->
<TulparNumberInput label="Integer only" :integer-only="true" />
<!-- allow-empty=false: empty → reverts to last valid value -->
<TulparNumberInput label="Required (no empty)" .allowEmpty="false" :value="0" />`;

const steppersCode = `<!-- Default steppers -->
<TulparNumberInput label="Default steppers" :min="0" :max="100" />
<!-- Hide steppers -->
<TulparNumberInput label="No steppers" :hide-steppers="true" />
<!-- Long-press acceleration: hold to accelerate -->
<TulparNumberInput
  label="Accelerating (hold)"
  :step-hold-delay="300"
  :step-hold-interval="30"
  :min="0"
  :max="1000"
  helper-text="Hold stepper to accelerate"
/>`;

const keyboardCode = `<!-- ↑/↓ ±step, Shift×10, Ctrl×100, Home→min, End→max -->
<TulparNumberInput
  label="Keyboard demo"
  :min="0"
  :max="1000"
  :step="5"
  helper-text="↑/↓ ±5 · Shift ×10 · Ctrl ×100 · Home/End"
/>`;

const formatExtrasCode = `<TulparNumberInput label="Prefix ~" format-prefix="~" />
<TulparNumberInput label="Suffix adet" format-suffix=" adet" />
<TulparNumberInput label="Combined" format-prefix="~" format-suffix=" adet" />`;

const advancedCode = `// formatOptions is a JS property (not an attr) — set via template ref + watchEffect
const compactTRYOptions = { style: 'currency', currency: 'TRY', notation: 'compact', currencySign: 'accounting' }

const advancedRef = ref(null)
watchEffect(() => {
  if (advancedRef.value) advancedRef.value.formatOptions = compactTRYOptions
})

<TulparNumberInput ref="advancedRef" label="Compact TRY (accounting)" locale="tr-TR" />`;
</script>

<template>
  <!-- Sub-menu -->
  <div class="sub-menu">
    <button
      class="sub-btn"
      :class="{ active: activeSection === 'all' }"
      @click="activeSection = 'all'"
    >All</button>
    <button
      v-for="s in sections"
      :key="s.id"
      class="sub-btn"
      :class="{ active: activeSection === s.id }"
      @click="activeSection = s.id"
    >{{ s.title }}</button>
  </div>

  <!-- ── Basics ─────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'basics'" class="demo-section">
    <h3 class="demo-title">Basics</h3>
    <p class="demo-desc">Quantity spinner with min/max/step and two-way binding.</p>
    <div class="preview preview--col">
      <TulparNumberInput
        label="Quantity"
        :min="1"
        :max="100"
        :step="1"
        v-model="qty"
        helper-text="Min 1 · Max 100"
      />
      <p class="value-display">qty = {{ qty }}</p>
    </div>
    <pre class="code"><code>{{ basicsCode }}</code></pre>
  </section>

  <!-- ── Formatting ─────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'formatting'" class="demo-section">
    <h3 class="demo-title">Formatting</h3>
    <p class="demo-desc">Currency (TRY/USD/EUR), percent (Intl ×100 semantics — value 0.125 displays as 12.5%), and grouping toggle.</p>
    <div class="preview preview--col">
      <div class="preview-row">
        <TulparNumberInput
          label="TRY (tr-TR)"
          format-style="currency"
          currency="TRY"
          locale="tr-TR"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          v-model="tryAmount"
        />
        <TulparNumberInput
          label="USD (en-US)"
          format-style="currency"
          currency="USD"
          locale="en-US"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          v-model="usdAmount"
        />
        <TulparNumberInput
          label="EUR (de-DE)"
          format-style="currency"
          currency="EUR"
          locale="de-DE"
          :min-fraction-digits="2"
          :max-fraction-digits="2"
          v-model="eurAmount"
        />
      </div>
      <div class="preview-row">
        <TulparNumberInput
          label="Percent (Intl ×100)"
          format-style="percent"
          locale="tr-TR"
          v-model="percentVal"
          helper-text="value=0.125 → displays %12,5"
        />
        <TulparNumberInput
          label="Grouping ON (default)"
          :value="1234567"
          :use-grouping="true"
        />
        <TulparNumberInput
          label="Grouping OFF"
          :value="1234567"
          :use-grouping="false"
        />
      </div>
    </div>
    <pre class="code"><code>{{ formattingCode }}</code></pre>
  </section>

  <!-- ── Constraints ────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'constraints'" class="demo-section">
    <h3 class="demo-title">Constraints</h3>
    <p class="demo-desc">min/max clamp on blur. integer-only shakes on '.' press. allow-empty=false reverts to last valid value when left empty.</p>
    <div class="preview preview--col">
      <TulparNumberInput
        label="Clamped (0–100)"
        :min="0"
        :max="100"
        helper-text="Type 999 and blur — clamps to 100"
      />

      <TulparNumberInput
        label="Integer only"
        :integer-only="true"
        helper-text="Press '.' — field shakes (blocked)"
      />

      <TulparNumberInput
        label="allow-empty=false"
        v-model="noEmptyVal"
        helper-text="Clear and blur — reverts to last value"
        :allow-empty.prop="false"
      />
      <p class="value-display">value = {{ noEmptyVal }}</p>
    </div>
    <pre class="code"><code>{{ constraintsCode }}</code></pre>
  </section>

  <!-- ── Steppers ───────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'steppers'" class="demo-section">
    <h3 class="demo-title">Steppers</h3>
    <p class="demo-desc">Default steppers, hide-steppers, and long-press acceleration (step-hold-delay + step-hold-interval).</p>
    <div class="preview preview--col">
      <TulparNumberInput
        label="Default steppers"
        :min="0"
        :max="100"
      />
      <TulparNumberInput
        label="No steppers (hide-steppers)"
        :hide-steppers="true"
      />
      <TulparNumberInput
        label="Long-press acceleration"
        :step-hold-delay="300"
        :step-hold-interval="30"
        :min="0"
        :max="1000"
        helper-text="Hold stepper button — value accelerates"
      />
    </div>
    <pre class="code"><code>{{ steppersCode }}</code></pre>
  </section>

  <!-- ── Keyboard ───────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'keyboard'" class="demo-section">
    <h3 class="demo-title">Keyboard Navigation</h3>
    <p class="demo-desc">Focus the input and use keyboard shortcuts:</p>
    <ul class="key-list">
      <li><kbd>↑</kbd> / <kbd>↓</kbd> — increment / decrement by step</li>
      <li><kbd>Shift</kbd> + <kbd>↑</kbd>/<kbd>↓</kbd> — ×10 step</li>
      <li><kbd>Ctrl</kbd> + <kbd>↑</kbd>/<kbd>↓</kbd> — ×100 step</li>
      <li><kbd>Home</kbd> — jump to min</li>
      <li><kbd>End</kbd> — jump to max</li>
    </ul>
    <div class="preview preview--col">
      <TulparNumberInput
        label="Keyboard demo (step=5, min=0, max=1000)"
        :min="0"
        :max="1000"
        :step="5"
        v-model="kbVal"
        helper-text="↑/↓ ±5 · Shift ×10 · Ctrl ×100 · Home/End"
      />
      <p class="value-display">value = {{ kbVal }}</p>
    </div>
    <pre class="code"><code>{{ keyboardCode }}</code></pre>
  </section>

  <!-- ── Format Extras ──────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'format-extras'" class="demo-section">
    <h3 class="demo-title">Format Extras — prefix &amp; suffix</h3>
    <p class="demo-desc">format-prefix and format-suffix append static strings around the formatted value.</p>
    <div class="preview preview--col">
      <TulparNumberInput label="Prefix ~" format-prefix="~" :value="42" />
      <TulparNumberInput label="Suffix (adet)" format-suffix=" adet" :value="10" />
      <TulparNumberInput label="Combined" format-prefix="~" format-suffix=" adet" :value="5" />
    </div>
    <pre class="code"><code>{{ formatExtrasCode }}</code></pre>
  </section>

  <!-- ── Advanced ───────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'advanced'" class="demo-section">
    <h3 class="demo-title">Advanced — formatOptions</h3>
    <p class="demo-desc">
      <code class="inline-code">formatOptions</code> is a JS property on the WC (not an attribute).
      In Vue, set it via a template ref + <code class="inline-code">watchEffect</code> to push it onto the element after mount.
    </p>
    <div class="preview preview--col">
      <TulparNumberInput
        ref="advancedRef"
        label="Compact TRY accounting"
        locale="tr-TR"
        v-model="advancedVal"
        helper-text="-1234567.89 renders as compact accounting notation"
      />
      <p class="value-display">raw value = {{ advancedVal }}</p>
    </div>
    <pre class="code"><code>{{ advancedCode }}</code></pre>
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
  transition: background 0.1s, color 0.1s;
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

.preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
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

.inline-code {
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 0.85em;
  background: var(--tulpar-color-bg-subtle, #f5f5f4);
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 3px;
  padding: 1px 5px;
  color: var(--tulpar-color-text-primary, #1c1917);
}

.key-list {
  margin: 0 0 20px;
  padding-left: 20px;
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
  line-height: 1.8;
}

kbd {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 3px;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 11px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  color: var(--tulpar-color-text-primary, #1c1917);
}
</style>
