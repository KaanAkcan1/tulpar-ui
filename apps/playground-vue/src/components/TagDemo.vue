<script setup lang="ts">
/**
 * TagDemo — static tonal metadata atom (v0.13).
 *
 * Vue mirror of playground-ng's TagDemoComponent — same ten doc-sections, same
 * section labels / ordering / copy, same capability rows, dual prop/slot cards,
 * and live playground. Vue idioms only: <TulparTag> from @tulpar-ui/vue, the
 * icon slot via <template #icon>, the label slot as the default slot, and
 * reactive refs for the live playground state.
 */
import { computed, ref } from "vue";
import { TulparTag } from "@tulpar-ui/vue";
import type { TagVariant, TagShape, TagSize } from "@tulpar-ui/vue";

// ─── Code snippet strings ─────────────────────────────────────────────────────

const tonesCode = `<!-- Five built-in tones. Default variant is soft-tonal. -->
<TulparTag tone="neutral" dot label="Neutral" />
<TulparTag tone="info"    dot label="Info" />
<TulparTag tone="success" dot label="Success" />
<TulparTag tone="warning" dot label="Warning" />
<TulparTag tone="danger"  dot label="Danger" />`;

const variantsCode = `<!-- variant: soft-tonal (default) · outline · solid -->
<TulparTag tone="info" variant="soft-tonal" dot label="Soft tonal" />
<TulparTag tone="info" variant="outline"    dot label="Outline" />
<TulparTag tone="info" variant="solid"      dot label="Solid" />`;

const shapesCode = `<!-- shape: square (default) · pill · sharp -->
<TulparTag tone="info" shape="square" dot label="square" />
<TulparTag tone="info" shape="pill"   dot label="pill" />
<TulparTag tone="info" shape="sharp"  dot label="sharp" />`;

const sizesCode = `<!-- size: xs · sm · md (default) · lg · xl -->
<TulparTag tone="success" size="xs" dot label="xs" />
<TulparTag tone="success" size="sm" dot label="sm" />
<TulparTag tone="success" size="md" dot label="md" />
<TulparTag tone="success" size="lg" dot label="lg" />
<TulparTag tone="success" size="xl" dot label="xl" />`;

const customCode = `<!-- tone="custom" + color: brand family (mode-aware) OR any raw CSS color -->
<TulparTag tone="custom" color="ilay" dot label="ilay" />
<TulparTag tone="custom" color="umay" dot label="umay" />
<TulparTag tone="custom" color="gok"  dot label="gok" />
<TulparTag tone="custom" color="#0d9488" dot label="#0d9488" />

<!-- Part overrides (bg / accent / text) layer on top of the custom base -->
<TulparTag tone="custom" bg="#fdf4ff" accent="#9333ea" text="#3b0764" dot label="parts" />`;

const stateCode = `<!-- disabled — dimmed, non-interactive -->
<TulparTag tone="info" dot label="Disabled" disabled />

<!-- truncate — long labels ellipsis with a native title tooltip -->
<TulparTag tone="neutral" label="truncates a very long label that overflows the row" />`;

const dualLabelCode = `<!-- LABEL — prop form vs slot form (slot wins when both set) -->
<TulparTag tone="info" dot label="Prop label" />
<TulparTag tone="info" dot>Slot label</TulparTag>`;

const dualIconCode = `<!-- ICON — prop form (raw SVG / emoji) vs slot form -->
<TulparTag tone="success" icon="✓" label="Prop icon" />
<TulparTag tone="success" label="Slot icon">
  <template #icon>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
         stroke-width="2"><path d="M3 8l3.5 3.5L13 4"/></svg>
  </template>
</TulparTag>`;

// ─── Static option lists ──────────────────────────────────────────────────────
const variants: TagVariant[] = ["soft-tonal", "outline", "solid"];
const shapes: TagShape[] = ["square", "pill", "sharp"];
const sizes: TagSize[] = ["xs", "sm", "md", "lg", "xl"];
const tones = ["neutral", "info", "success", "warning", "danger", "custom"] as const;
const customColors = ["ilay", "umay", "gok", "ulgen", "kizagan", "erlik", "#0d9488"] as const;

// ─── Live playground state ────────────────────────────────────────────────────
const pgTone = ref<string>("info");
const pgVariant = ref<TagVariant>("soft-tonal");
const pgShape = ref<TagShape>("square");
const pgSize = ref<TagSize>("md");
const pgColor = ref<string>("ilay");
const pgDot = ref(true);
const pgDisabled = ref(false);

const pgSnippet = computed(() => {
  const tone = pgTone.value;
  const colorAttr = tone === "custom" ? ` color="${pgColor.value}"` : "";
  const dotAttr = pgDot.value ? " dot" : "";
  const disAttr = pgDisabled.value ? " disabled" : "";
  return `<TulparTag tone="${tone}"${colorAttr} variant="${pgVariant.value}" shape="${pgShape.value}" size="${pgSize.value}"${dotAttr}${disAttr} label="Live tag" />`;
});
</script>

<template>
  <div class="demo-page demo-page--tag">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Display &amp; Status</span>
      <h1 class="page-title">Tag</h1>
      <p class="page-lede">
        Static, read-only tonal metadata. A Tag labels an object with a status or category — it is
        <strong>non-interactive</strong> (no click, no remove; for that, reach for
        <strong>Chip</strong>). The default variant is <code class="inline-code">soft-tonal</code>;
        <code class="inline-code">outline</code> and <code class="inline-code">solid</code> are
        opt-in. Tone always pairs with a leading dot, an icon, or text — never hue alone. Both the
        <em>label</em> and <em>icon</em> content props have a matching slot form, shown below.
      </p>
    </header>

    <!-- ── 1. Tones ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Tones</h2>
      <p class="section-desc">
        Five built-in tones: <code class="inline-code">neutral</code> ·
        <code class="inline-code">info</code> · <code class="inline-code">success</code> ·
        <code class="inline-code">warning</code> · <code class="inline-code">danger</code>. Each
        maps to a semantic token pair; a leading <code class="inline-code">dot</code> reinforces the
        tone for colour-blind users.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">tones</span>
          <div class="row-items">
            <TulparTag tone="neutral" dot label="Neutral" />
            <TulparTag tone="info" dot label="Info" />
            <TulparTag tone="success" dot label="Success" />
            <TulparTag tone="warning" dot label="Warning" />
            <TulparTag tone="danger" dot label="Danger" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ tonesCode }}</code></pre>
    </section>

    <!-- ── 2. Variants ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Variants</h2>
      <p class="section-desc">
        Three visual weights. <code class="inline-code">soft-tonal</code> (default) is the quietest;
        <code class="inline-code">outline</code> trades fill for a border;
        <code class="inline-code">solid</code>
        is the loudest, for the rare case a tag needs to dominate.
      </p>
      <div class="preview preview--col">
        <div v-for="v in variants" :key="v" class="demo-row">
          <span class="row-label">{{ v }}</span>
          <div class="row-items">
            <TulparTag tone="neutral" :variant="v" dot label="Neutral" />
            <TulparTag tone="info" :variant="v" dot label="Info" />
            <TulparTag tone="success" :variant="v" dot label="Success" />
            <TulparTag tone="warning" :variant="v" dot label="Warning" />
            <TulparTag tone="danger" :variant="v" dot label="Danger" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ variantsCode }}</code></pre>
    </section>

    <!-- ── 3. Shapes ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Shapes</h2>
      <p class="section-desc">
        <code class="inline-code">square</code> (default, gently rounded) ·
        <code class="inline-code">pill</code> (fully rounded) ·
        <code class="inline-code">sharp</code> (no radius, for dense data tables).
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items">
            <TulparTag tone="info" shape="square" dot label="square" />
            <TulparTag tone="info" shape="pill" dot label="pill" />
            <TulparTag tone="info" shape="sharp" dot label="sharp" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ shapesCode }}</code></pre>
    </section>

    <!-- ── 4. Sizes ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Sizes</h2>
      <p class="section-desc">
        Five tiers from <code class="inline-code">xs</code> to <code class="inline-code">xl</code>.
        <code class="inline-code">md</code> is the default; the dot, icon, and padding all scale
        with the tier.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline">
            <TulparTag tone="success" size="xs" dot label="xs" />
            <TulparTag tone="success" size="sm" dot label="sm" />
            <TulparTag tone="success" size="md" dot label="md" />
            <TulparTag tone="success" size="lg" dot label="lg" />
            <TulparTag tone="success" size="xl" dot label="xl" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 5. Custom tone ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Custom tone</h2>
      <p class="section-desc">
        <code class="inline-code">tone="custom"</code> unlocks
        <code class="inline-code">color</code> — a brand family name (<code class="inline-code"
          >ilay · umay · gok · ulgen · kizagan · erlik</code
        >, mode-aware light/dark flip) or any raw CSS color (contrast is the author's
        responsibility). Part overrides <code class="inline-code">bg</code> /
        <code class="inline-code">accent</code> / <code class="inline-code">text</code> layer on
        top.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">family</span>
          <div class="row-items">
            <TulparTag tone="custom" color="ilay" dot label="ilay" />
            <TulparTag tone="custom" color="umay" dot label="umay" />
            <TulparTag tone="custom" color="gok" dot label="gok" />
            <TulparTag tone="custom" color="ulgen" dot label="ulgen" />
            <TulparTag tone="custom" color="kizagan" dot label="kizagan" />
            <TulparTag tone="custom" color="erlik" dot label="erlik" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">raw css</span>
          <div class="row-items">
            <TulparTag tone="custom" color="#0d9488" dot label="#0d9488" />
            <TulparTag tone="custom" color="rebeccapurple" dot label="rebeccapurple" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">parts</span>
          <div class="row-items">
            <TulparTag
              tone="custom"
              bg="#fdf4ff"
              accent="#9333ea"
              text="#3b0764"
              dot
              label="bg / accent / text"
            />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ customCode }}</code></pre>
    </section>

    <!-- ── 6. States & edge cases ─────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. States &amp; edge cases</h2>
      <p class="section-desc">
        <code class="inline-code">disabled</code> dims the tag and removes any cursor affordance.
        Long labels truncate with an ellipsis and expose the full text via a native
        <code class="inline-code">title</code> tooltip — width never blows out a table column.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">disabled</span>
          <div class="row-items">
            <TulparTag tone="info" dot label="Disabled" disabled />
            <TulparTag tone="success" variant="solid" dot label="Disabled solid" disabled />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">truncate</span>
          <div class="row-items truncate-cell">
            <TulparTag
              tone="neutral"
              label="truncates a very long label that overflows the available row width"
            />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ stateCode }}</code></pre>
    </section>

    <!-- ── 7. Prop vs slot — label ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Content — label (prop &amp; slot)</h2>
      <p class="section-desc">
        The body text accepts both a convenience <code class="inline-code">label</code> prop and the
        default slot. When both are set the slot wins — the prop is a shorthand, never a
        replacement.
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form</div>
          <div class="dual-body">
            <TulparTag tone="info" dot label="Prop label" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <TulparTag tone="info" dot>Slot label</TulparTag>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualLabelCode }}</code></pre>
    </section>

    <!-- ── 8. Prop vs slot — icon ─────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Content — icon (prop &amp; slot)</h2>
      <p class="section-desc">
        A leading icon replaces the dot. The <code class="inline-code">icon</code> prop takes a raw
        SVG string or an emoji; the <code class="inline-code">#icon</code> slot takes any node
        (inline SVG, a Lucide component, an <code class="inline-code">&lt;img&gt;</code>). Slot
        wins.
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (icon)</div>
          <div class="dual-body">
            <TulparTag tone="success" icon="✓" label="Prop icon" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (icon)</div>
          <div class="dual-body">
            <TulparTag tone="success" label="Slot icon">
              <template #icon>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </template>
            </TulparTag>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualIconCode }}</code></pre>
    </section>

    <!-- ── 9. Live playground ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Live playground</h2>
      <p class="section-desc">
        Drive every prop from one control panel — tone, variant, shape, size, the custom color, and
        the dot / disabled toggles. The rendered tag and a matching snippet update live.
      </p>
      <div class="preview preview--col">
        <div class="pg-controls">
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
          <label v-if="pgTone === 'custom'" class="pg-field">
            <span class="pg-field-label">Color</span>
            <select class="pg-select" v-model="pgColor">
              <option v-for="c in customColors" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgDot" />
            <span>dot</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgDisabled" />
            <span>disabled</span>
          </label>
        </div>
        <div class="pg-stage">
          <TulparTag
            :tone="pgTone"
            :color="pgTone === 'custom' ? pgColor : undefined"
            :variant="pgVariant"
            :shape="pgShape"
            :size="pgSize"
            :dot="pgDot"
            :disabled="pgDisabled"
            label="Live tag"
          />
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet }}</code></pre>
    </section>

    <!-- ── 10. Accessibility ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Accessibility</h2>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Not a status region.</strong> A Tag is decorative metadata, not a live region — it
          does not announce on change. Render status updates through Toast / Message instead.
        </div>
        <div class="a11y-note">
          <strong>Colour is never the only signal.</strong> Always pair a tone with a dot, an icon,
          or descriptive text so the meaning survives for colour-blind users and in greyscale.
        </div>
        <div class="a11y-note">
          <strong>Truncation keeps the full text.</strong> Ellipsised labels expose the complete
          string via a native <code class="inline-code">title</code>, readable by assistive tech.
        </div>
        <div class="a11y-note">
          <strong>Dark mode.</strong> Every tone (built-in and custom-family) flips automatically
          when <code class="inline-code">.dark</code> is on an ancestor — no extra markup.
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

.truncate-cell {
  max-width: 280px;
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

/* ── A11y notes ───────────────────────────────────────────────────────── */
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
