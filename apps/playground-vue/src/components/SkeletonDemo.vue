<script setup lang="ts">
/**
 * SkeletonDemo — loading placeholder atom (v0.13).
 *
 * Vue mirror of playground-ng's SkeletonDemoComponent — same eight doc-sections,
 * same section labels / ordering / copy, same capability rows, live loading
 * swap (~1.6 s fetch sim), and live playground (variant/animation selects, lines
 * stepper, width/height inputs). Vue idioms only: <TulparSkeleton> from
 * @tulpar-ui/vue + reactive refs.
 */
import { computed, ref } from "vue";
import { TulparSkeleton } from "@tulpar-ui/vue";
import type { SkeletonVariant, SkeletonAnimation } from "@tulpar-ui/vue";

// ─── Code snippet strings ─────────────────────────────────────────────────────

const variantsCode = `<!-- variant: text (multi-line bars) · rect · circle -->
<TulparSkeleton variant="text" :lines="4" />
<TulparSkeleton variant="rect" height="72px" />
<TulparSkeleton variant="circle" width="56px" height="56px" />`;

const linesCode = `<!-- text variant: control the number of line bars; last line is shortened -->
<TulparSkeleton variant="text" :lines="1" />
<TulparSkeleton variant="text" :lines="3" />
<TulparSkeleton variant="text" :lines="5" />`;

const sizeCode = `<!-- explicit width / height / radius overrides (any CSS length) -->
<TulparSkeleton variant="rect" width="120px" height="32px" />
<TulparSkeleton variant="rect" width="160px" height="32px" radius="999px" />
<TulparSkeleton variant="rect" width="100%"  height="120px" radius="12px" />`;

const animCode = `<!-- animation: shimmer (default) · pulse · none -->
<TulparSkeleton variant="text" :lines="3" animation="shimmer" />
<TulparSkeleton variant="text" :lines="3" animation="pulse" />
<TulparSkeleton variant="text" :lines="3" animation="none" />
<!-- all freeze automatically under prefers-reduced-motion -->`;

const composedCode = `<!-- Compose skeletons into a card placeholder to reserve layout (no CLS) -->
<div class="card">
  <TulparSkeleton variant="circle" width="40px" height="40px" />
  <div class="body">
    <TulparSkeleton variant="text" :lines="1" width="60%" />
    <TulparSkeleton variant="text" :lines="1" width="40%" />
  </div>
</div>`;

const swapCode = `// Real-world pattern: show skeletons while loading, swap to content when ready
<template v-if="loading">
  <TulparSkeleton variant="text" :lines="3" />
</template>
<template v-else>
  <p>{{ content }}</p>
</template>`;

// ─── Static option lists ──────────────────────────────────────────────────────
const variants: SkeletonVariant[] = ["text", "rect", "circle"];
const animations: SkeletonAnimation[] = ["shimmer", "pulse", "none"];

// ─── 6. Loading swap ──────────────────────────────────────────────────────────
const loading = ref(false);
let _timer: ReturnType<typeof setTimeout> | null = null;
function reload(): void {
  loading.value = true;
  if (_timer) clearTimeout(_timer);
  _timer = setTimeout(() => (loading.value = false), 1600);
}

// ─── 7. Live playground state ───────────────────────────────────────────────
const pgVariant = ref<SkeletonVariant>("text");
const pgAnim = ref<SkeletonAnimation>("shimmer");
const pgLines = ref(3);
const pgWidth = ref<string>("");
const pgHeight = ref<string>("72px");

function decLines() {
  pgLines.value = Math.max(1, pgLines.value - 1);
}
function incLines() {
  pgLines.value = Math.min(8, pgLines.value + 1);
}

const pgSnippet = computed(() => {
  const v = pgVariant.value;
  const anim = ` animation="${pgAnim.value}"`;
  const w = pgWidth.value ? ` width="${pgWidth.value}"` : "";
  if (v === "text") {
    return `<TulparSkeleton variant="text"${anim} :lines="${pgLines.value}"${w} />`;
  }
  const h = pgHeight.value ? ` height="${pgHeight.value}"` : "";
  return `<TulparSkeleton variant="${v}"${anim}${w}${h} />`;
});
</script>

<template>
  <div class="demo-page demo-page--skeleton">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Display &amp; Status</span>
      <h1 class="page-title">Skeleton</h1>
      <p class="page-lede">
        A loading placeholder that <strong>reserves layout</strong> so content swap-in causes no
        layout shift (CLS). <code class="inline-code">text</code> renders
        <code class="inline-code">lines</code> bars; <code class="inline-code">rect</code> and
        <code class="inline-code">circle</code> take explicit
        <code class="inline-code">width</code> / <code class="inline-code">height</code> /
        <code class="inline-code">radius</code>. Three animation modes — a directional
        <code class="inline-code">shimmer</code> (default), an opacity
        <code class="inline-code">pulse</code>, or <code class="inline-code">none</code> — all
        freeze under <code class="inline-code">prefers-reduced-motion</code>. The skeleton is purely
        decorative and has no slots.
      </p>
    </header>

    <!-- ── 1. Live playground ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Live playground</h2>
      <p class="section-desc">
        Pick a variant, animation, line count, and width — the rendered skeleton and snippet update
        live. (<code class="inline-code">lines</code> applies to the text variant only.)
      </p>
      <div class="preview preview--col">
        <div class="pg-controls">
          <label class="pg-field">
            <span class="pg-field-label">Variant</span>
            <select class="pg-select" v-model="pgVariant">
              <option v-for="v in variants" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Animation</span>
            <select class="pg-select" v-model="pgAnim">
              <option v-for="a in animations" :key="a" :value="a">{{ a }}</option>
            </select>
          </label>
          <label v-if="pgVariant === 'text'" class="pg-field">
            <span class="pg-field-label">Lines</span>
            <span class="stepper">
              <button class="stepper-btn" :disabled="pgLines <= 1" @click="decLines">−</button>
              <span class="stepper-value">{{ pgLines }}</span>
              <button class="stepper-btn" :disabled="pgLines >= 8" @click="incLines">+</button>
            </span>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Width</span>
            <input class="pg-input" type="text" v-model="pgWidth" placeholder="100%" />
          </label>
          <label v-if="pgVariant !== 'text'" class="pg-field">
            <span class="pg-field-label">Height</span>
            <input class="pg-input" type="text" v-model="pgHeight" placeholder="72px" />
          </label>
        </div>
        <div class="pg-stage">
          <TulparSkeleton
            v-if="pgVariant === 'text'"
            :variant="pgVariant"
            :animation="pgAnim"
            :lines="pgLines"
            :width="pgWidth || undefined"
          />
          <TulparSkeleton
            v-else
            :variant="pgVariant"
            :animation="pgAnim"
            :width="pgWidth || undefined"
            :height="pgHeight || undefined"
          />
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet }}</code></pre>
    </section>

    <!-- ── 2. Variants ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Variants</h2>
      <p class="section-desc">
        <code class="inline-code">text</code> for paragraphs (multi-line bars),
        <code class="inline-code">rect</code> for blocks (images, cards),
        <code class="inline-code">circle</code> for avatars.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">variants</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="4" />
              <span class="skel-caption">text · 4 lines</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="rect" height="72px" />
              <span class="skel-caption">rect</span>
            </div>
            <div class="skel-block skel-block--circle">
              <TulparSkeleton variant="circle" width="56px" height="56px" />
              <span class="skel-caption">circle</span>
            </div>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ variantsCode }}</code></pre>
    </section>

    <!-- ── 3. Lines ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Text lines</h2>
      <p class="section-desc">
        The <code class="inline-code">lines</code> prop sets how many bars the text variant renders;
        the last bar is shortened so it reads like a real paragraph.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">lines</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="1" />
              <span class="skel-caption">1</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="3" />
              <span class="skel-caption">3</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="5" />
              <span class="skel-caption">5</span>
            </div>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ linesCode }}</code></pre>
    </section>

    <!-- ── 4. Size overrides ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Width / height / radius</h2>
      <p class="section-desc">
        Any CSS length works — fixed px, percentages, or a fully-rounded
        <code class="inline-code">radius</code> for pill-shaped placeholders.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">overrides</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <TulparSkeleton variant="rect" width="120px" height="32px" />
              <span class="skel-caption">120×32</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="rect" width="160px" height="32px" radius="999px" />
              <span class="skel-caption">pill radius</span>
            </div>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">&nbsp;</span>
          <div class="row-items">
            <div class="skel-fill">
              <TulparSkeleton variant="rect" width="100%" height="120px" radius="12px" />
            </div>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ sizeCode }}</code></pre>
    </section>

    <!-- ── 5. Animations ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Animations</h2>
      <p class="section-desc">
        <code class="inline-code">shimmer</code> (default) sweeps a highlight across the bar;
        <code class="inline-code">pulse</code> fades opacity; <code class="inline-code">none</code>
        is static. Every mode is suppressed under
        <code class="inline-code">prefers-reduced-motion</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">animations</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="3" animation="shimmer" />
              <span class="skel-caption">shimmer</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="3" animation="pulse" />
              <span class="skel-caption">pulse</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="3" animation="none" />
              <span class="skel-caption">none</span>
            </div>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ animCode }}</code></pre>
    </section>

    <!-- ── 6. Composed ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Composed placeholder</h2>
      <p class="section-desc">
        Combine variants to mirror a real component's layout — here an avatar + two text lines for a
        list-item or comment-card placeholder.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">composed</span>
          <div class="row-items">
            <div class="skel-card">
              <TulparSkeleton variant="circle" width="40px" height="40px" />
              <div class="skel-card-body">
                <TulparSkeleton variant="text" :lines="1" width="60%" />
                <TulparSkeleton variant="text" :lines="1" width="40%" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ composedCode }}</code></pre>
    </section>

    <!-- ── 7. Live swap ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Live loading swap</h2>
      <p class="section-desc">
        The real-world pattern: render the skeleton while loading, then swap to content. Press the
        button to simulate a 1.6 s fetch — the skeleton's reserved space means the content drops in
        with zero layout shift.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">demo</span>
          <div class="row-items" style="flex-direction: column; align-items: flex-start; gap: 12px">
            <div class="swap-card">
              <div class="swap-row">
                <TulparSkeleton v-if="loading" variant="circle" width="40px" height="40px" />
                <span v-else style="font-size: 28px">🦄</span>
                <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 8px">
                  <TulparSkeleton v-if="loading" variant="text" :lines="2" />
                  <template v-else>
                    <strong style="font-size: 14px">Tulpar UI</strong>
                    <span style="font-size: 13px; color: var(--tulpar-color-text-secondary, #57534e)">
                      Web Components with idiomatic Angular &amp; Vue wrappers.
                    </span>
                  </template>
                </div>
              </div>
            </div>
            <button class="trigger-btn" @click="reload" :disabled="loading">
              {{ loading ? "Loading…" : "Reload (simulate fetch)" }}
            </button>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ swapCode }}</code></pre>
    </section>

    <!-- ── 8. Accessibility ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Accessibility</h2>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Decorative by design.</strong> The skeleton is marked
          <code class="inline-code">aria-hidden</code> — it carries no semantic content, so it never
          pollutes the screen-reader tree.
        </div>
        <div class="a11y-note">
          <strong>Announce loading separately.</strong> Pair skeletons with a live region (e.g.
          "Loading results…") if the wait is meaningful; the placeholder itself is silent.
        </div>
        <div class="a11y-note">
          <strong>Reserve layout.</strong> Match the skeleton's dimensions to the real content to
          avoid layout shift when it swaps in.
        </div>
        <div class="a11y-note">
          <strong>Reduced motion.</strong> All animations freeze under
          <code class="inline-code">prefers-reduced-motion</code>. Dark mode flips the surface
          automatically.
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

/* ── Skeleton specifics ───────────────────────────────────────────────── */
.skel-variants {
  align-items: flex-start;
  gap: 24px;
}

.skel-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 180px;
  flex: 1;
  max-width: 260px;
}

.skel-block--circle {
  min-width: 0;
  flex: none;
  max-width: none;
}

.skel-caption {
  font-size: 11px;
  color: var(--tulpar-color-text-muted, #74777a);
}

.skel-card {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 320px;
  padding: 14px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 10px;
  background: var(--tulpar-color-bg-surface, #fff);
}

.skel-card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skel-fill {
  width: 100%;
  max-width: 360px;
}

/* ── Loading swap demo ────────────────────────────────────────────────── */
.swap-card {
  width: 100%;
  max-width: 360px;
  padding: 16px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 10px;
  background: var(--tulpar-color-bg-surface, #fff);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.swap-row {
  display: flex;
  align-items: center;
  gap: 12px;
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

.pg-select,
.pg-input {
  font: inherit;
  font-size: 13px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-elevated, #fff);
  color: var(--tulpar-color-text-primary, #15110b);
  min-width: 110px;
}

.pg-select {
  cursor: pointer;
}

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

.pg-stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 64px;
  padding: 8px 0;
  max-width: 360px;
}

.trigger-btn {
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  border-radius: 8px;
  padding: 7px 13px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-elevated, #fff);
  color: var(--tulpar-color-text-primary, #15110b);
  cursor: pointer;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;
  white-space: nowrap;
  align-self: flex-start;
}

.trigger-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 8px -2px rgba(16, 24, 40, 0.12);
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
