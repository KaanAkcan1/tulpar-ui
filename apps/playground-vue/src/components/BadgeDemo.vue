<script setup lang="ts">
/**
 * BadgeDemo — compact count / status indicator atom (v0.13).
 *
 * Vue mirror of playground-ng's BadgeDemoComponent — same ten doc-sections,
 * same section labels / ordering / copy, same capability rows + dual prop/slot
 * cards + live playground (count/max steppers, tone/variant/shape/size selects,
 * dot/showZero checks). Vue idioms only: <TulparBadge> from @tulpar-ui/vue,
 * default-slot label form, reactive refs for live state.
 */
import { computed, ref } from "vue";
import { TulparBadge } from "@tulpar-ui/vue";
import type { BadgeTone, BadgeVariant, BadgeShape, BadgeSize } from "@tulpar-ui/vue";

// ─── Code snippet strings ─────────────────────────────────────────────────────

const countCode = `<!-- Count + overflow cap (max → "99+"), tabular figures so width never jitters -->
<TulparBadge tone="neutral" :count="3" />
<TulparBadge tone="info"    :count="8" />
<TulparBadge tone="success" :count="24" />
<TulparBadge tone="warning" :count="42" />
<TulparBadge tone="danger"  :count="128" :max="99" />`;

const zeroCode = `<!-- count === 0 is hidden by default; show-zero forces a "0" -->
<TulparBadge tone="neutral" :count="0" />                <!-- hidden -->
<TulparBadge tone="neutral" :count="0" show-zero />      <!-- "0" -->`;

const dotCode = `<!-- dot mode — bare status, ignores count -->
<TulparBadge tone="success" dot />
<TulparBadge tone="warning" dot />
<TulparBadge tone="danger"  dot />
<TulparBadge tone="info"    dot />`;

const variantsCode = `<!-- variant: solid (default) · soft-tonal · outline -->
<TulparBadge tone="info" variant="solid"      :count="5" />
<TulparBadge tone="info" variant="soft-tonal" :count="5" />
<TulparBadge tone="info" variant="outline"    :count="5" />`;

const shapesCode = `<!-- shape: pill (default) · square -->
<TulparBadge tone="danger" shape="pill"   :count="9" />
<TulparBadge tone="danger" shape="square" :count="9" />`;

const sizesCode = `<!-- size: sm · md (default) · lg -->
<TulparBadge tone="success" size="sm" :count="7" />
<TulparBadge tone="success" size="md" :count="7" />
<TulparBadge tone="success" size="lg" :count="7" />`;

const hostCode = `<!-- Pin a badge to a host element (bell, app tile, …) with position:relative -->
<span style="position:relative; display:inline-flex">
  <svg>…bell…</svg>
  <span style="position:absolute; top:-6px; right:-6px">
    <TulparBadge tone="danger" :count="5" />
  </span>
</span>`;

const dualLabelCode = `<!-- LABEL — prop vs slot (slot wins for content; prop still seeds the a11y noun) -->
<TulparBadge tone="success" label="NEW" />
<TulparBadge tone="success">NEW</TulparBadge>`;

// ─── Static option lists ──────────────────────────────────────────────────────
const tones: BadgeTone[] = ["neutral", "info", "success", "warning", "danger"];
const variants: BadgeVariant[] = ["solid", "soft-tonal", "outline"];
const shapes: BadgeShape[] = ["pill", "square"];
const sizes: BadgeSize[] = ["sm", "md", "lg"];

// ─── Live playground state ────────────────────────────────────────────────────
const pgTone = ref<BadgeTone>("danger");
const pgVariant = ref<BadgeVariant>("solid");
const pgShape = ref<BadgeShape>("pill");
const pgSize = ref<BadgeSize>("md");
const pgCount = ref(8);
const pgMax = ref(99);
const pgDot = ref(false);
const pgShowZero = ref(false);

function decCount() {
  pgCount.value = Math.max(0, pgCount.value - 1);
}
function incCount() {
  pgCount.value = pgCount.value + 1;
}
function decMax() {
  pgMax.value = Math.max(1, pgMax.value - 1);
}
function incMax() {
  pgMax.value = pgMax.value + 1;
}

const pgSnippet = computed(() => {
  if (pgDot.value) {
    return `<TulparBadge tone="${pgTone.value}" variant="${pgVariant.value}" shape="${pgShape.value}" size="${pgSize.value}" dot />`;
  }
  const zero = pgShowZero.value ? " show-zero" : "";
  return `<TulparBadge tone="${pgTone.value}" variant="${pgVariant.value}" shape="${pgShape.value}" size="${pgSize.value}" :count="${pgCount.value}" :max="${pgMax.value}"${zero} />`;
});
</script>

<template>
  <div class="demo-page demo-page--badge">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Display &amp; Status</span>
      <h1 class="page-title">Badge</h1>
      <p class="page-lede">
        A compact count or status indicator — a notification dot, an unread count, a "NEW" pill.
        Counts cap at <code class="inline-code">max</code> (e.g.
        <code class="inline-code">128 → 99+</code>) and use tabular figures so the width never
        jitters as numbers change. <code class="inline-code">dot</code> mode shows bare status;
        <code class="inline-code">solid</code> is the default variant. The <em>label</em> content
        has both a prop and a slot form, shown below.
      </p>
    </header>

    <!-- ── 1. Live playground ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Live playground</h2>
      <p class="section-desc">
        Step the count to watch the overflow cap kick in, then flip tone, variant, shape, size, and
        the dot / showZero toggles. The snippet updates live.
      </p>
      <div class="preview preview--col">
        <div class="pg-controls">
          <label class="pg-field">
            <span class="pg-field-label">Count</span>
            <span class="stepper">
              <button class="stepper-btn" :disabled="pgCount <= 0" @click="decCount">−</button>
              <span class="stepper-value">{{ pgCount }}</span>
              <button class="stepper-btn" @click="incCount">+</button>
            </span>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Max</span>
            <span class="stepper">
              <button class="stepper-btn" :disabled="pgMax <= 1" @click="decMax">−</button>
              <span class="stepper-value">{{ pgMax }}</span>
              <button class="stepper-btn" @click="incMax">+</button>
            </span>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Tone</span>
            <select class="pg-select" v-model="pgTone">
              <option v-for="t in tones" :key="t" :value="t">{{ t }}</option>
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Variant</span>
            <select class="pg-select" v-model="pgVariant">
              <option v-for="v in variants" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Shape</span>
            <select class="pg-select" v-model="pgShape">
              <option v-for="s in shapes" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Size</span>
            <select class="pg-select" v-model="pgSize">
              <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgDot" />
            <span>dot</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgShowZero" />
            <span>showZero</span>
          </label>
        </div>
        <div class="pg-stage">
          <TulparBadge
            :tone="pgTone"
            :variant="pgVariant"
            :shape="pgShape"
            :size="pgSize"
            :count="pgCount"
            :max="pgMax"
            :dot="pgDot"
            :show-zero="pgShowZero"
          />
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet }}</code></pre>
    </section>

    <!-- ── 2. Count & overflow ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Count &amp; overflow</h2>
      <p class="section-desc">
        Set a numeric <code class="inline-code">count</code>. Cap large values with
        <code class="inline-code">max</code> — anything above renders as
        <code class="inline-code">{max}+</code>. Tabular figures keep the pill width stable.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">count</span>
          <div class="row-items">
            <TulparBadge tone="neutral" :count="3" />
            <TulparBadge tone="info" :count="8" />
            <TulparBadge tone="success" :count="24" />
            <TulparBadge tone="warning" :count="42" />
            <TulparBadge tone="danger" :count="128" :max="99" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ countCode }}</code></pre>
    </section>

    <!-- ── 3. Zero handling ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Zero handling</h2>
      <p class="section-desc">
        A <code class="inline-code">count</code> of <code class="inline-code">0</code> hides the
        badge by default (no "0 unread" noise). Opt back in with
        <code class="inline-code">showZero</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">zero</span>
          <div class="row-items">
            <span class="zero-cell">
              <TulparBadge tone="neutral" :count="0" />
              <span class="zero-note">:count="0" → hidden</span>
            </span>
            <span class="zero-cell">
              <TulparBadge tone="neutral" :count="0" :show-zero="true" />
              <span class="zero-note">showZero → "0"</span>
            </span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ zeroCode }}</code></pre>
    </section>

    <!-- ── 4. Dot mode ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Dot mode</h2>
      <p class="section-desc">
        <code class="inline-code">dot</code> renders a bare status dot and ignores any count — for
        "there's something here" affordances on icons and avatars.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">dot</span>
          <div class="row-items">
            <TulparBadge tone="success" dot />
            <TulparBadge tone="warning" dot />
            <TulparBadge tone="danger" dot />
            <TulparBadge tone="info" dot />
            <TulparBadge tone="neutral" dot />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dotCode }}</code></pre>
    </section>

    <!-- ── 5. Variants ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Variants</h2>
      <p class="section-desc">
        <code class="inline-code">solid</code> (default) is the high-emphasis pill;
        <code class="inline-code">soft-tonal</code> and <code class="inline-code">outline</code> are
        quieter for dense UIs.
      </p>
      <div class="preview preview--col">
        <div v-for="v in variants" :key="v" class="demo-row">
          <span class="row-label">{{ v }}</span>
          <div class="row-items">
            <TulparBadge tone="neutral" :variant="v" :count="5" />
            <TulparBadge tone="info" :variant="v" :count="5" />
            <TulparBadge tone="success" :variant="v" :count="5" />
            <TulparBadge tone="warning" :variant="v" :count="5" />
            <TulparBadge tone="danger" :variant="v" :count="5" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ variantsCode }}</code></pre>
    </section>

    <!-- ── 6. Shapes ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Shapes</h2>
      <p class="section-desc">
        <code class="inline-code">pill</code> (default) ·
        <code class="inline-code">square</code> for a chip-like silhouette.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items">
            <TulparBadge tone="danger" shape="pill" :count="9" />
            <TulparBadge tone="danger" shape="square" :count="9" />
            <TulparBadge tone="info" shape="pill" :count="128" :max="99" />
            <TulparBadge tone="info" shape="square" :count="128" :max="99" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ shapesCode }}</code></pre>
    </section>

    <!-- ── 7. Sizes ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Sizes</h2>
      <p class="section-desc">
        Three tiers: <code class="inline-code">sm</code> ·
        <code class="inline-code">md</code> (default) · <code class="inline-code">lg</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline">
            <TulparBadge tone="success" size="sm" :count="7" />
            <TulparBadge tone="success" size="md" :count="7" />
            <TulparBadge tone="success" size="lg" :count="7" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">dot sizes</span>
          <div class="row-items av-baseline">
            <TulparBadge tone="danger" size="sm" dot />
            <TulparBadge tone="danger" size="md" dot />
            <TulparBadge tone="danger" size="lg" dot />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 8. Pinned to a host ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Pinned to a host</h2>
      <p class="section-desc">
        Badges have no built-in anchoring — pin one to any host with a
        <code class="inline-code">position:relative</code> wrapper and an absolutely-positioned
        container. This keeps the badge layout-agnostic and reusable.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">on host</span>
          <div class="row-items">
            <span class="badge-host">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 01-3.4 0" />
              </svg>
              <span class="badge-host-pin"><TulparBadge tone="danger" :count="5" /></span>
            </span>
            <span class="badge-host">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M4 4h16v16H4z" />
              </svg>
              <span class="badge-host-pin badge-host-pin--dot">
                <TulparBadge tone="success" dot />
              </span>
            </span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ hostCode }}</code></pre>
    </section>

    <!-- ── 9. Prop vs slot — label ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Content — label (prop &amp; slot)</h2>
      <p class="section-desc">
        Beyond counts a badge can carry a short text label ("NEW", "BETA"). Use the
        <code class="inline-code">label</code> prop or the default slot — the slot wins for rendered
        content, while the prop still seeds the numeric accessible-name noun.
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form</div>
          <div class="dual-body">
            <TulparBadge tone="success" label="NEW" />
            <TulparBadge tone="info" label="BETA" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <TulparBadge tone="success">NEW</TulparBadge>
            <TulparBadge tone="info">BETA</TulparBadge>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualLabelCode }}</code></pre>
    </section>

    <!-- ── 10. Accessibility ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Accessibility</h2>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Accessible name.</strong> A count badge announces its number with a noun (e.g. "5
          unread") when paired with a <code class="inline-code">label</code>; a dot badge exposes
          its status tone.
        </div>
        <div class="a11y-note">
          <strong>Pinning is the consumer's job.</strong> Position relative to the host yourself;
          the badge stays presentational so it can live in any layout.
        </div>
        <div class="a11y-note">
          <strong>Tabular figures.</strong> Numeric widths are stable, so a badge that pings between
          9 and 10 doesn't shift the host icon.
        </div>
        <div class="a11y-note">
          <strong>Dark mode.</strong> All tones flip automatically under
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
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 18px 16px;
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
  gap: 16px;
  min-height: 56px;
  padding: 8px 0;
}

/* ── Number stepper ───────────────────────────────────────────────────── */
.stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 8px;
  overflow: hidden;
  background: var(--tulpar-color-bg-elevated, #fff);
}

.stepper-btn {
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--tulpar-color-text-primary, #15110b);
  cursor: pointer;
}

.stepper-btn:hover:not(:disabled) {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.stepper-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stepper-value {
  font-size: 14px;
  font-weight: 700;
  min-width: 34px;
  text-align: center;
  line-height: 32px;
  color: var(--tulpar-color-text-primary, #15110b);
  border-left: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-right: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

/* ── Badge host pinning ───────────────────────────────────────────────── */
.zero-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.zero-note {
  font-size: 11px;
  color: var(--tulpar-color-text-muted, #74777a);
}

.badge-host {
  position: relative;
  display: inline-flex;
  width: 38px;
  height: 38px;
  border-radius: 9px;
  background: var(--tulpar-color-bg-surface, #fff);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  align-items: center;
  justify-content: center;
  color: var(--tulpar-color-text-secondary, #57534e);
}

.badge-host svg {
  width: 19px;
  height: 19px;
}

.badge-host-pin {
  position: absolute;
  top: -6px;
  right: -6px;
}

.badge-host-pin--dot {
  top: -3px;
  right: -3px;
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
