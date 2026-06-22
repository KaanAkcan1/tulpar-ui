<script setup lang="ts">
/**
 * ProgressDemo — linear / circular progress atom (v0.13).
 *
 * Vue mirror of playground-ng's ProgressDemoComponent — same eleven doc-sections,
 * same section labels / ordering / copy, same capability rows, live driver slider,
 * custom value formatter, label dual prop/slot card, and live playground (value
 * slider + variant/tone/thickness-or-size selects + indeterminate/valueLabel
 * checks). Vue idioms only: <TulparProgress> from @tulpar-ui/vue, the function
 * formatter bound as :value-label="formatStep", label slot via <template #label>,
 * and reactive refs for live state.
 */
import { computed, ref } from "vue";
import { TulparProgress } from "@tulpar-ui/vue";
import type {
  ProgressVariant,
  ProgressTone,
  ProgressThickness,
  ProgressSize,
} from "@tulpar-ui/vue";

// ─── Code snippet strings ─────────────────────────────────────────────────────

const linearCode = `<!-- linear determinate (value 0..max) + value label (true → "N%") -->
<TulparProgress :value="42" :value-label="true" />
<TulparProgress :value="78" tone="success" :value-label="true" />`;

const bufferCode = `<!-- linear with a secondary buffered value (e.g. video pre-load) -->
<TulparProgress :value="40" :buffer="65" />`;

const indetCode = `<!-- indeterminate — one traveling bar / rotating arc, unknown duration -->
<TulparProgress indeterminate />
<TulparProgress variant="circular" indeterminate />`;

const thicknessCode = `<!-- thickness (linear): thin · regular (default) · thick -->
<TulparProgress :value="60" thickness="thin" />
<TulparProgress :value="60" thickness="regular" />
<TulparProgress :value="60" thickness="thick" />`;

const tonesCode = `<!-- tones: default fill is brand green; built-in / custom recolor it -->
<TulparProgress :value="60" tone="info" />
<TulparProgress :value="60" tone="success" />
<TulparProgress :value="60" tone="warning" />
<TulparProgress :value="60" tone="danger" />
<TulparProgress :value="60" tone="custom" color="ilay" />

<!-- stateTone: auto-promote to success once value >= max -->
<TulparProgress :value="100" :state-tone="true" :value-label="true" />`;

const circularCode = `<!-- circular determinate + indeterminate; size: sm · md (default) · lg -->
<TulparProgress variant="circular" :value="70" :value-label="true" />
<TulparProgress variant="circular" indeterminate />
<TulparProgress variant="circular" :value="30" size="sm" tone="info" />
<TulparProgress variant="circular" :value="55" size="lg" tone="success" />`;

const formatterCode = `// custom formatter (function form of valueLabel) — also seeds aria-valuetext
const formatStep = (v, min, max) => \`\${v}/\${max} steps\`;

<TulparProgress variant="circular" :value="3" :max="5" :value-label="formatStep" />`;

const dualCode = `<!-- LABEL — prop (valueLabel) vs slot (descriptive text) -->
<TulparProgress :value="55" :value-label="true" />
<TulparProgress :value="55"><template #label>Uploading…</template></TulparProgress>`;

// ─── Static option lists ──────────────────────────────────────────────────────
const variants: ProgressVariant[] = ["linear", "circular"];
const tones: ProgressTone[] = ["neutral", "info", "success", "warning", "danger"];
const thicknesses: ProgressThickness[] = ["thin", "regular", "thick"];
const sizes: ProgressSize[] = ["sm", "md", "lg"];

/** Inline caption for the circular formatter example (avoids raw braces in template). */
const stepFormatterNote = "(v, min, max) => `${v}/${max} steps`";

/** Formatter for the circular step example (function form of valueLabel). */
const formatStep = (value: number, _min: number, max: number): string => `${value}/${max} steps`;

// ─── 1. Live driver ───────────────────────────────────────────────────────────
const liveValue = ref(60);
function onLiveInput(e: Event): void {
  liveValue.value = Number((e.target as HTMLInputElement).value);
}

// ─── 10. Live playground state ──────────────────────────────────────────────
const pgValue = ref(45);
const pgVariant = ref<ProgressVariant>("linear");
const pgTone = ref<ProgressTone>("neutral");
const pgThickness = ref<ProgressThickness>("regular");
const pgSize = ref<ProgressSize>("md");
const pgIndeterminate = ref(false);
const pgValueLabel = ref(true);

function onPgInput(e: Event): void {
  pgValue.value = Number((e.target as HTMLInputElement).value);
}

const pgSnippet = computed(() => {
  const variant = pgVariant.value;
  const indet = pgIndeterminate.value;
  const tone = ` tone="${pgTone.value}"`;
  const vl = pgValueLabel.value ? ' :value-label="true"' : "";
  const sizing =
    variant === "linear" ? ` thickness="${pgThickness.value}"` : ` size="${pgSize.value}"`;
  if (indet) {
    return `<TulparProgress variant="${variant}"${tone}${sizing} indeterminate />`;
  }
  return `<TulparProgress variant="${variant}" :value="${pgValue.value}"${tone}${sizing}${vl} />`;
});
</script>

<template>
  <div class="demo-page demo-page--progress">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Display &amp; Status</span>
      <h1 class="page-title">Progress</h1>
      <p class="page-lede">
        Linear and circular progress, <strong>determinate</strong> or
        <strong>indeterminate</strong>. Determinate transitions are eased; indeterminate is one
        traveling bar / rotating arc. <code class="inline-code">valueLabel</code> can be
        <code class="inline-code">true</code> (→ <code class="inline-code">N%</code>) or a formatter
        function; <code class="inline-code">buffer</code> shows a secondary buffered value (linear).
        The label has both a prop (<code class="inline-code">valueLabel</code>) and a
        <code class="inline-code">#label</code> slot form.
      </p>
    </header>

    <!-- ── 1. Live driver ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Live driver</h2>
      <p class="section-desc">
        Drag the slider to drive a single value into both a linear and a circular determinate bar —
        the eased fill transition and the live <code class="inline-code">valueLabel</code> update in
        lockstep.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">value</span>
          <div class="row-items progress-live">
            <input
              class="progress-slider"
              type="range"
              min="0"
              max="100"
              :value="liveValue"
              @input="onLiveInput"
              aria-label="Progress value"
            />
            <span class="progress-value">{{ liveValue }}%</span>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">&nbsp;</span>
          <div class="row-items progress-live-bars">
            <div style="flex: 1; min-width: 220px; max-width: 360px">
              <TulparProgress :value="liveValue" :value-label="true" />
            </div>
            <TulparProgress variant="circular" :value="liveValue" :value-label="true" size="md" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ linearCode }}</code></pre>
    </section>

    <!-- ── 2. Linear determinate ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Linear determinate</h2>
      <p class="section-desc">
        A horizontal bar fills from <code class="inline-code">min</code> to
        <code class="inline-code">max</code>. <code class="inline-code">valueLabel="true"</code>
        renders a trailing percentage.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">linear</span>
          <div class="row-items progress-stack">
            <TulparProgress :value="42" :value-label="true" />
            <TulparProgress :value="78" tone="success" :value-label="true" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ linearCode }}</code></pre>
    </section>

    <!-- ── 3. Buffer ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Buffer</h2>
      <p class="section-desc">
        <code class="inline-code">buffer</code> draws a fainter secondary fill ahead of the primary
        <code class="inline-code">value</code> — for buffered media or chunked uploads.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">buffer</span>
          <div class="row-items progress-stack">
            <TulparProgress :value="40" :buffer="65" />
            <TulparProgress :value="20" :buffer="90" tone="info" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ bufferCode }}</code></pre>
    </section>

    <!-- ── 4. Indeterminate ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Indeterminate</h2>
      <p class="section-desc">
        When the duration is unknown, omit <code class="inline-code">value</code> and set
        <code class="inline-code">indeterminate</code> — a traveling bar (linear) or rotating arc
        (circular).
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">linear</span>
          <div class="row-items progress-stack">
            <TulparProgress indeterminate />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">circular</span>
          <div class="row-items">
            <TulparProgress variant="circular" indeterminate />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ indetCode }}</code></pre>
    </section>

    <!-- ── 5. Thickness ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Thickness</h2>
      <p class="section-desc">
        Linear bars come in <code class="inline-code">thin</code> ·
        <code class="inline-code">regular</code> (default) · <code class="inline-code">thick</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">thickness</span>
          <div class="row-items progress-stack">
            <TulparProgress :value="60" thickness="thin" />
            <TulparProgress :value="60" thickness="regular" />
            <TulparProgress :value="60" thickness="thick" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ thicknessCode }}</code></pre>
    </section>

    <!-- ── 6. Tones & stateTone ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Tones &amp; stateTone</h2>
      <p class="section-desc">
        The default fill is brand green; built-in and custom tones recolor it.
        <code class="inline-code">stateTone</code> auto-promotes the fill to success once
        <code class="inline-code">value &gt;= max</code> (an explicit danger tone always wins).
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">tones</span>
          <div class="row-items progress-stack">
            <TulparProgress :value="60" tone="info" :value-label="true" />
            <TulparProgress :value="60" tone="warning" :value-label="true" />
            <TulparProgress :value="60" tone="danger" :value-label="true" />
            <TulparProgress :value="60" tone="custom" color="ilay" :value-label="true" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">stateTone</span>
          <div class="row-items progress-stack">
            <TulparProgress :value="100" :state-tone="true" :value-label="true" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ tonesCode }}</code></pre>
    </section>

    <!-- ── 7. Circular ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Circular</h2>
      <p class="section-desc">
        The circular variant takes the same value model in three sizes:
        <code class="inline-code">sm</code> · <code class="inline-code">md</code> (default) ·
        <code class="inline-code">lg</code>. <code class="inline-code">valueLabel</code> renders
        centered.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">circular</span>
          <div class="row-items av-baseline progress-circ-row">
            <TulparProgress variant="circular" :value="70" :value-label="true" />
            <TulparProgress variant="circular" indeterminate />
            <TulparProgress variant="circular" :value="30" size="sm" tone="info" />
            <TulparProgress
              variant="circular"
              :value="55"
              size="lg"
              tone="success"
              :value-label="true"
            />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ circularCode }}</code></pre>
    </section>

    <!-- ── 8. Custom formatter ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Custom value formatter</h2>
      <p class="section-desc">
        Pass a function to <code class="inline-code">valueLabel</code> for non-percentage labels
        (steps, bytes, ratios). The function form is property-only — the wrapper sets it as a DOM
        property — and it also seeds <code class="inline-code">aria-valuetext</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">formatter</span>
          <div class="row-items av-baseline progress-circ-row">
            <TulparProgress
              variant="circular"
              :value="3"
              :max="5"
              size="lg"
              :value-label="formatStep"
            />
            <span class="dual-note">{{ stepFormatterNote }}</span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ formatterCode }}</code></pre>
    </section>

    <!-- ── 9. Prop vs slot — label ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Content — label (prop &amp; slot)</h2>
      <p class="section-desc">
        The numeric label is the <code class="inline-code">valueLabel</code> prop; a descriptive
        text label above / beside the bar is the <code class="inline-code">#label</code> slot. Use
        both together where it helps.
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (valueLabel)</div>
          <div class="dual-body">
            <TulparProgress :value="55" :value-label="true" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (label)</div>
          <div class="dual-body">
            <TulparProgress :value="55">
              <template #label>Uploading…</template>
            </TulparProgress>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualCode }}</code></pre>
    </section>

    <!-- ── 10. Live playground ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Live playground</h2>
      <p class="section-desc">
        Drive value, variant, tone, thickness/size, and the indeterminate / valueLabel / buffer
        toggles. The slider sets the value; the snippet updates live.
      </p>
      <div class="preview preview--col">
        <div class="pg-controls">
          <label class="pg-field">
            <span class="pg-field-label">Value</span>
            <input
              class="progress-slider"
              type="range"
              min="0"
              max="100"
              :value="pgValue"
              @input="onPgInput"
              :disabled="pgIndeterminate"
              aria-label="Playground value"
            />
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Variant</span>
            <select class="pg-select" v-model="pgVariant">
              <option v-for="v in variants" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Tone</span>
            <select class="pg-select" v-model="pgTone">
              <option v-for="t in tones" :key="t" :value="t">{{ t }}</option>
            </select>
          </label>
          <label v-if="pgVariant === 'linear'" class="pg-field">
            <span class="pg-field-label">Thickness</span>
            <select class="pg-select" v-model="pgThickness">
              <option v-for="t in thicknesses" :key="t" :value="t">{{ t }}</option>
            </select>
          </label>
          <label v-else class="pg-field">
            <span class="pg-field-label">Size</span>
            <select class="pg-select" v-model="pgSize">
              <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgIndeterminate" />
            <span>indeterminate</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgValueLabel" />
            <span>valueLabel</span>
          </label>
        </div>
        <div class="pg-stage">
          <div v-if="pgVariant === 'linear'" class="pg-linear">
            <TulparProgress
              variant="linear"
              :value="pgValue"
              :tone="pgTone"
              :thickness="pgThickness"
              :indeterminate="pgIndeterminate"
              :value-label="pgValueLabel"
            />
          </div>
          <TulparProgress
            v-else
            variant="circular"
            :value="pgValue"
            :tone="pgTone"
            :size="pgSize"
            :indeterminate="pgIndeterminate"
            :value-label="pgValueLabel"
          />
          <span v-if="!pgIndeterminate" class="progress-value">{{ pgValue }}%</span>
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet }}</code></pre>
    </section>

    <!-- ── 11. Accessibility ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">11. Accessibility</h2>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>progressbar role.</strong> Determinate bars expose
          <code class="inline-code">aria-valuenow / valuemin / valuemax</code>; indeterminate bars
          omit valuenow so assistive tech announces "busy".
        </div>
        <div class="a11y-note">
          <strong>aria-valuetext.</strong> A formatter <code class="inline-code">valueLabel</code>
          seeds a human-readable value text (e.g. "3 of 5 steps") for screen readers.
        </div>
        <div class="a11y-note">
          <strong>Label the bar.</strong> Use the <code class="inline-code">#label</code> slot (or
          an external label) so the progress has an accessible name describing what is progressing.
        </div>
        <div class="a11y-note">
          <strong>Reduced motion + dark mode.</strong> The indeterminate animation honours
          <code class="inline-code">prefers-reduced-motion</code>; tones flip under
          <code class="inline-code">.dark</code>.
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
  max-width: 680px;
  line-height: 1.6;
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
  max-width: 660px;
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
  gap: 10px;
  align-items: center;
}

.preview--col {
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid
    color-mix(in srgb, var(--tulpar-color-border-default, #d9e0df) 55%, transparent);
}

.demo-row:first-child {
  padding-top: 0;
}

.demo-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.demo-row--top {
  align-items: flex-start;
}

.row-label {
  flex: none;
  width: 92px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
  padding-top: 2px;
}

.row-items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.av-baseline {
  align-items: flex-end;
}

/* ── Progress specifics ───────────────────────────────────────────────── */
.progress-stack {
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
  max-width: 360px;
}

.progress-circ-row {
  gap: 24px;
}

.progress-live {
  align-items: center;
  gap: 14px;
}

.progress-live-bars {
  align-items: center;
  gap: 28px;
}

.progress-slider {
  width: 240px;
  max-width: 100%;
  accent-color: var(--tulpar-color-brand-default, #00c57a);
}

.progress-value {
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
  min-width: 48px;
}

.dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 640px) {
  .dual-grid {
    grid-template-columns: 1fr;
  }
}

.dual-card {
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 10px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  overflow: hidden;
}

.dual-head {
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
  background: color-mix(in srgb, var(--tulpar-color-bg-surface, #fff) 60%, transparent);
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.dual-body {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 18px 16px;
  max-width: 320px;
}

.dual-note {
  font-size: 11px;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* ── Live playground controls ─────────────────────────────────────────── */
.pg-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 14px;
  padding-bottom: 18px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.pg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pg-field-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
}

.pg-select {
  font: inherit;
  font-size: 13px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-elevated, #fff);
  color: var(--tulpar-color-text-primary, #15110b);
  min-width: 120px;
  cursor: pointer;
}

.pg-check {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 13px;
  font-weight: 500;
  color: var(--tulpar-color-text-primary, #15110b);
  cursor: pointer;
  padding-bottom: 7px;
}

.pg-check input {
  width: 16px;
  height: 16px;
  accent-color: var(--tulpar-color-brand-default, #00c57a);
  cursor: pointer;
}

.pg-stage {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 28px;
  min-height: 64px;
  padding: 8px 0;
}

.pg-stage .pg-linear {
  flex: 1;
  min-width: 220px;
  max-width: 360px;
}

/* ── Code block ───────────────────────────────────────────────────────── */
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

.a11y-notes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 10px;
}

.a11y-note {
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
  line-height: 1.6;
}
</style>
