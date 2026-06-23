<script setup lang="ts">
/**
 * ChipDemo — interactive tonal label atom (v0.13).
 *
 * Vue mirror of playground-ng's ChipDemoComponent — same eleven doc-sections,
 * same section labels / ordering / copy, same capability rows, dual prop/slot
 * cards (label / icon / avatar), live playground + event log. Vue idioms only:
 * <TulparChip> from @tulpar-ui/vue, @clicked / @removed events, icon/avatar
 * slots via <template #icon> / <template #avatar>, the default slot for label,
 * and reactive refs for live state + event log.
 */
import { computed, ref } from "vue";
import { TulparChip } from "@tulpar-ui/vue";
import type { ChipVariant, ChipShape, ChipSize } from "@tulpar-ui/vue";

// ─── Code snippet strings ─────────────────────────────────────────────────────

const clickCode = `// clickable — body is operable (click / Enter / Space) → @clicked output
<TulparChip tone="neutral" label="All"  @clicked="log('clicked: All')" />
<TulparChip tone="info" icon="●" label="Open" @clicked="log('clicked: Open')" />
<TulparChip tone="success" label="Done" @clicked="log('clicked: Done')" />`;

const removeCode = `// removable — the ✕ is an INDEPENDENT tab stop → @removed output
<TulparChip label="kaan@x.com" removable @removed="log('removed: kaan@x.com')" />

// avatar + removable (the chip carries an avatar prop)
<TulparChip label="Jane Doe" avatar="JD" removable
            @removed="log('removed: Jane Doe')" />`;

const variantsCode = `// variant: soft-tonal (default) · outline · solid · ghost
<TulparChip tone="info" variant="soft-tonal" label="Soft tonal" />
<TulparChip tone="info" variant="outline"    label="Outline" />
<TulparChip tone="info" variant="solid"      label="Solid" />
// ghost — transparent at rest, soft-tonal on hover (toolbar filters)
<TulparChip tone="info" variant="ghost"      label="Ghost" />`;

const stateCode = `// disabled — fires nothing, not focusable, dimmed
<TulparChip label="Archived" disabled />
<TulparChip label="Read-only" removable disabled />`;

const shapesSizesCode = `// shape: square (default) · pill · sharp
<TulparChip tone="info" shape="square" label="square" />
<TulparChip tone="info" shape="pill"   label="pill" />
<TulparChip tone="info" shape="sharp"  label="sharp" />

// size: xs · sm · md (default) · lg · xl
<TulparChip tone="success" size="xs" label="xs" />
<TulparChip tone="success" size="xl" label="xl" />`;

const customCode = `// tone="custom" + color: brand family (mode-aware) OR any raw CSS color
<TulparChip tone="custom" color="ilay" label="ilay" />
<TulparChip tone="custom" color="gok"  label="gok" />
<TulparChip tone="custom" color="#0d9488" label="#0d9488" />`;

const dualLabelCode = `<!-- LABEL — prop vs slot (slot wins when both set) -->
<TulparChip tone="info" label="Prop label" />
<TulparChip tone="info">Slot label</TulparChip>`;

const dualIconCode = `<!-- ICON — prop (raw SVG / emoji) vs slot -->
<TulparChip tone="success" icon="✓" label="Prop icon" />
<TulparChip tone="success" label="Slot icon">
  <template #icon>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
         stroke-width="2"><path d="M3 8l3.5 3.5L13 4"/></svg>
  </template>
</TulparChip>`;

const dualAvatarCode = `<!-- AVATAR — prop (initials / image URL) vs slot -->
<TulparChip label="Prop avatar" avatar="KA" />
<TulparChip label="Slot avatar">
  <template #avatar>🦄</template>
</TulparChip>`;

// ─── Static option lists ──────────────────────────────────────────────────────
const tones = ["neutral", "info", "success", "warning", "danger", "custom"] as const;
const variants: ChipVariant[] = ["soft-tonal", "outline", "solid", "ghost"];
const shapes: ChipShape[] = ["square", "pill", "sharp"];
const sizes: ChipSize[] = ["xs", "sm", "md", "lg", "xl"];
const customColors = ["ilay", "umay", "gok", "ulgen", "kizagan", "erlik", "#0d9488"] as const;

// ─── Event log ────────────────────────────────────────────────────────────────
let _eventId = 0;
const chipEvents = ref<{ id: number; time: string; msg: string }[]>([]);

function logChip(msg: string): void {
  const time = new Date().toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  chipEvents.value = [{ id: ++_eventId, time, msg }, ...chipEvents.value].slice(0, 30);
}

function clearLog(): void {
  chipEvents.value = [];
}

// ─── Live playground state ────────────────────────────────────────────────────
const pgTone = ref<string>("info");
const pgVariant = ref<ChipVariant>("soft-tonal");
const pgShape = ref<ChipShape>("square");
const pgSize = ref<ChipSize>("md");
const pgColor = ref<string>("ilay");
const pgRemovable = ref(true);
const pgDisabled = ref(false);

const pgSnippet = computed(() => {
  const tone = pgTone.value;
  const colorAttr = tone === "custom" ? ` color="${pgColor.value}"` : "";
  const rm = pgRemovable.value ? " removable" : "";
  const dis = pgDisabled.value ? " disabled" : "";
  return `<TulparChip tone="${tone}"${colorAttr} variant="${pgVariant.value}" shape="${pgShape.value}" size="${pgSize.value}"${rm}${dis} label="Live chip"\n  @clicked="log('clicked')" @removed="log('removed')" />`;
});
</script>

<template>
  <div class="demo-page demo-page--chip">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Display &amp; Status</span>
      <h1 class="page-title">Chip</h1>
      <p class="page-lede">
        The <strong>interactive</strong> display atom. Unlike a Tag, a chip's body is operable
        (click / Enter / Space → <code class="inline-code">clicked</code>) and can carry an
        independent remove control (<code class="inline-code">removed</code>) — for filters, token
        inputs, and selection. The <code class="inline-code">ghost</code> variant is transparent at
        rest and hovers into the soft tint. Every event is logged live below; <em>label</em>,
        <em>icon</em> and <em>avatar</em> all have prop and slot forms.
      </p>
    </header>

    <!-- ── 1. Live playground ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Live playground</h2>
      <p class="section-desc">
        Configure a chip from the panel — tone, variant, shape, size, the custom color, and the
        removable / disabled toggles. Click the chip or its ✕ to append to the live event log.
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
            <input type="checkbox" v-model="pgRemovable" />
            <span>removable</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgDisabled" />
            <span>disabled</span>
          </label>
        </div>
        <div class="pg-stage">
          <TulparChip
            :tone="pgTone"
            :color="pgTone === 'custom' ? pgColor : undefined"
            :variant="pgVariant"
            :shape="pgShape"
            :size="pgSize"
            :removable="pgRemovable"
            :disabled="pgDisabled"
            label="Live chip"
            @clicked="logChip('clicked: Live chip')"
            @removed="logChip('removed: Live chip')"
          />
        </div>

        <!-- Event log -->
        <div class="event-log" aria-live="polite">
          <div class="event-log-head">
            <span class="event-log-title">Event log</span>
            <button class="event-log-clear" type="button" @click="clearLog">Clear</button>
          </div>
          <div v-if="chipEvents.length === 0" class="event-log-empty">
            Click a chip or its ✕ to log clicked / removed events…
          </div>
          <ul v-else class="event-log-list">
            <li v-for="e in chipEvents" :key="e.id" class="event-log-item">
              <span class="event-log-time">{{ e.time }}</span>
              <span class="event-log-msg">{{ e.msg }}</span>
            </li>
          </ul>
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet }}</code></pre>
    </section>

    <!-- ── 2. Clickable ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Clickable</h2>
      <p class="section-desc">
        The chip body is a button. Activating it (mouse or keyboard) emits
        <code class="inline-code">clicked</code>. Watch the event log at the bottom of the section.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">clickable</span>
          <div class="row-items">
            <TulparChip tone="neutral" label="All" @clicked="logChip('clicked: All')" />
            <TulparChip tone="info" icon="●" label="Open" @clicked="logChip('clicked: Open')" />
            <TulparChip tone="success" label="Done" @clicked="logChip('clicked: Done')" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ clickCode }}</code></pre>
    </section>

    <!-- ── 3. Removable ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Removable</h2>
      <p class="section-desc">
        <code class="inline-code">removable</code> adds a trailing ✕ that is an
        <strong>independent tab stop</strong> — activating it emits
        <code class="inline-code">removed</code> without firing
        <code class="inline-code">clicked</code>. Perfect for token / tag inputs.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">removable</span>
          <div class="row-items">
            <TulparChip label="kaan@x.com" removable @removed="logChip('removed: kaan@x.com')" />
            <TulparChip
              label="Jane Doe"
              avatar="JD"
              removable
              @removed="logChip('removed: Jane Doe')"
            />
            <TulparChip
              tone="info"
              label="design"
              removable
              @clicked="logChip('clicked: design')"
              @removed="logChip('removed: design')"
            />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ removeCode }}</code></pre>
    </section>

    <!-- ── 4. Variants ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Variants</h2>
      <p class="section-desc">
        <code class="inline-code">soft-tonal</code> (default) ·
        <code class="inline-code">outline</code> · <code class="inline-code">solid</code> ·
        <code class="inline-code">ghost</code>. Ghost is transparent at rest and reveals the soft
        tint on hover — ideal for toolbar filter rows.
      </p>
      <div class="preview preview--col">
        <div v-for="v in variants" :key="v" class="demo-row">
          <span class="row-label">{{ v }}</span>
          <div class="row-items">
            <TulparChip tone="neutral" :variant="v" label="Status" @clicked="logChip('clicked: ' + v)" />
            <TulparChip tone="info" :variant="v" label="Owner" @clicked="logChip('clicked: ' + v)" />
            <TulparChip tone="success" :variant="v" label="Label" @clicked="logChip('clicked: ' + v)" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ variantsCode }}</code></pre>
    </section>

    <!-- ── 5. States ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. States</h2>
      <p class="section-desc">
        <code class="inline-code">disabled</code> dims the chip, removes it from the tab order, and
        suppresses both <code class="inline-code">clicked</code> and
        <code class="inline-code">removed</code> — clicking it logs nothing.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">disabled</span>
          <div class="row-items">
            <TulparChip label="Archived" disabled @clicked="logChip('SHOULD NOT FIRE')" />
            <TulparChip
              label="Read-only"
              removable
              disabled
              @removed="logChip('SHOULD NOT FIRE')"
            />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ stateCode }}</code></pre>
    </section>

    <!-- ── 6. Shapes & sizes ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Shapes &amp; sizes</h2>
      <p class="section-desc">
        <code class="inline-code">square</code> (default) · <code class="inline-code">pill</code> ·
        <code class="inline-code">sharp</code> — and five size tiers from
        <code class="inline-code">xs</code> to <code class="inline-code">xl</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items">
            <TulparChip tone="info" shape="square" label="square" />
            <TulparChip tone="info" shape="pill" label="pill" />
            <TulparChip tone="info" shape="sharp" label="sharp" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline">
            <TulparChip tone="success" size="xs" label="xs" />
            <TulparChip tone="success" size="sm" label="sm" />
            <TulparChip tone="success" size="md" label="md" />
            <TulparChip tone="success" size="lg" label="lg" />
            <TulparChip tone="success" size="xl" label="xl" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ shapesSizesCode }}</code></pre>
    </section>

    <!-- ── 7. Custom tone ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Custom tone</h2>
      <p class="section-desc">
        <code class="inline-code">tone="custom"</code> + <code class="inline-code">color</code>: a
        brand family name (mode-aware) or any raw CSS color. Part overrides (<code
          class="inline-code"
          >bg</code
        >
        / <code class="inline-code">accent</code> / <code class="inline-code">text</code>) layer on
        top.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">family</span>
          <div class="row-items">
            <TulparChip tone="custom" color="ilay" label="ilay" />
            <TulparChip tone="custom" color="umay" label="umay" />
            <TulparChip tone="custom" color="gok" label="gok" />
            <TulparChip tone="custom" color="ulgen" label="ulgen" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">raw css</span>
          <div class="row-items">
            <TulparChip tone="custom" color="#0d9488" label="#0d9488" />
            <TulparChip tone="custom" bg="#fdf4ff" accent="#9333ea" text="#3b0764" label="parts" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ customCode }}</code></pre>
    </section>

    <!-- ── 8. Prop vs slot — label ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Content — label (prop &amp; slot)</h2>
      <p class="section-desc">
        Body text via the <code class="inline-code">label</code> prop or the default slot (slot
        wins).
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form</div>
          <div class="dual-body">
            <TulparChip tone="info" label="Prop label" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <TulparChip tone="info">Slot label</TulparChip>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualLabelCode }}</code></pre>
    </section>

    <!-- ── 9. Prop vs slot — icon ─────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Content — icon (prop &amp; slot)</h2>
      <p class="section-desc">
        Leading icon via the <code class="inline-code">icon</code> prop (raw SVG / emoji) or
        <code class="inline-code">#icon</code> slot (any node).
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (icon)</div>
          <div class="dual-body">
            <TulparChip tone="success" icon="✓" label="Prop icon" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (icon)</div>
          <div class="dual-body">
            <TulparChip tone="success" label="Slot icon">
              <template #icon>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </template>
            </TulparChip>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualIconCode }}</code></pre>
    </section>

    <!-- ── 10. Prop vs slot — avatar ──────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Content — avatar (prop &amp; slot)</h2>
      <p class="section-desc">
        Leading avatar via the <code class="inline-code">avatar</code> prop (initials / image URL)
        or <code class="inline-code">#avatar</code> slot (any node).
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (avatar)</div>
          <div class="dual-body">
            <TulparChip label="Prop avatar" avatar="KA" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (avatar)</div>
          <div class="dual-body">
            <TulparChip label="Slot avatar">
              <template #avatar>🦄</template>
            </TulparChip>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualAvatarCode }}</code></pre>
    </section>

    <!-- ── 11. Accessibility ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">11. Accessibility</h2>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Two operable targets.</strong> The body and the remove control are separate tab
          stops with separate keyboard activation, so screen-reader users can remove a chip without
          triggering its primary action.
        </div>
        <div class="a11y-note">
          <strong>Keyboard.</strong> Body: Enter / Space. Remove: Delete / Backspace (and click).
          Disabled chips leave the tab order entirely.
        </div>
        <div class="a11y-note">
          <strong>Colour + text.</strong> Tone is reinforced by the label and any icon — never hue
          alone.
        </div>
        <div class="a11y-note">
          <strong>Dark mode.</strong> All tones and the ghost hover state flip under
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

/* ── Chip event log ───────────────────────────────────────────────────── */
.event-log {
  margin-top: 16px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 10px;
  background: var(--tulpar-color-bg-surface, #fff);
  overflow: hidden;
}

.event-log-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.event-log-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
}

.event-log-clear {
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-surface, #fff);
  color: var(--tulpar-color-text-secondary, #57534e);
  border-radius: 6px;
  padding: 3px 9px;
  cursor: pointer;
}

.event-log-clear:hover {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.event-log-empty {
  padding: 14px;
  font-size: 12px;
  color: var(--tulpar-color-text-muted, #74777a);
  font-style: italic;
}

.event-log-list {
  margin: 0;
  padding: 6px 0;
  list-style: none;
  max-height: 168px;
  overflow-y: auto;
}

.event-log-item {
  display: flex;
  gap: 12px;
  padding: 4px 14px;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 12px;
}

.event-log-time {
  color: var(--tulpar-color-text-muted, #74777a);
  flex: none;
}

.event-log-msg {
  color: var(--tulpar-color-text-primary, #15110b);
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
