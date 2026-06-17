<script setup lang="ts">
const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const FAMILIES: { name: string; story: string }[] = [
  { name: "al", story: "Al Ruhu · danger" },
  { name: "kizagan", story: "Kızagan Tengri · critical accent" },
  { name: "umay", story: "Umay Ana · highlights" },
  { name: "ilay", story: "İlay · categorical / charts" },
  { name: "erlik", story: "Erlik Han · help / premium depth" },
  { name: "kam", story: "Kam · secondary / focus" },
  { name: "mergen", story: "Mergen Han · dark surfaces" },
  { name: "gok", story: "Gök Tengri · info / link" },
  { name: "ay", story: "Ay Ata · muted info" },
  { name: "yersu", story: "Yer-Su · data viz" },
  { name: "tulpar", story: "Tulpar · primary / success" },
  { name: "otuken", story: "Ötüken · success / deep green" },
  { name: "kayin", story: "Uluğ Kayın · growth / charts" },
  { name: "ulgen", story: "Ülgen · premium / ratings" },
  { name: "kuyas", story: "Kuyaş · warning" },
  { name: "alaz", story: "Alaz Han · notifications" },
  { name: "burkut", story: "Bürküt Ata · earth / charts" },
  { name: "colpan", story: "Çolpan · neutral light surfaces" },
  { name: "ayzit", story: "Ayzıt · neutral silver" },
  { name: "boz", story: "Boz · neutral warm" },
  { name: "kara", story: "Kara Han · neutral / muted text" },
  { name: "yagiz", story: "Yağız Yer · ink / contrast" },
];

const SEMANTICS: { role: string; varName: string }[] = [
  { role: "brand / primary", varName: "--tulpar-color-brand-default" },
  { role: "secondary", varName: "--tulpar-color-secondary-default" },
  { role: "success", varName: "--tulpar-color-success-default" },
  { role: "danger", varName: "--tulpar-color-danger-default" },
  { role: "warn", varName: "--tulpar-color-warn-default" },
  { role: "info", varName: "--tulpar-color-info-default" },
  { role: "help", varName: "--tulpar-color-help-default" },
  { role: "premium", varName: "--tulpar-color-premium-default" },
  { role: "neutral", varName: "--tulpar-color-neutral-default" },
  { role: "contrast", varName: "--tulpar-color-contrast-default" },
];

const SURFACES: { role: string; varName: string }[] = [
  { role: "bg / default", varName: "--tulpar-color-bg-default" },
  { role: "bg / surface", varName: "--tulpar-color-bg-surface" },
  { role: "bg / subtle", varName: "--tulpar-color-bg-subtle" },
  { role: "bg / muted", varName: "--tulpar-color-bg-muted" },
  { role: "bg / elevated", varName: "--tulpar-color-bg-elevated" },
  { role: "border / default", varName: "--tulpar-color-border-default" },
];

const HERO = [
  { name: "tulpar", story: "primary / success" },
  { name: "ulgen", story: "premium / gold" },
  { name: "gok", story: "info / link" },
  { name: "al", story: "danger" },
  { name: "kuyas", story: "warning" },
  { name: "erlik", story: "help" },
];

const CHART = [1, 2, 3, 4, 5, 6, 7, 8] as const;
</script>

<template>
  <div class="demo-page">
    <!-- ── Page header ───────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Foundation</span>
      <h1 class="page-title">Colors</h1>
      <p class="page-lede">
        Chromatic Mythology — 22 color families on a single OKLCH ladder, drawn from Turkic/Altaic
        myth. Every semantic role binds to one of these primitives per brand and mode.
      </p>
    </header>

    <!-- ── Hero: signature spirits ───────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <div v-for="h in HERO" :key="h.name" class="hero-card">
          <div
            class="hero-swatch"
            :style="{ background: `var(--tulpar-primitive-color-${h.name}-500)` }"
          ></div>
          <div class="hero-meta">
            <strong>{{ h.name }}</strong>
            <span>{{ h.story }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Full palette ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Palette</h2>
      <p class="section-desc">
        Each family runs the same 11-stop ladder (50–950). Hover a swatch for its token name.
      </p>
      <div class="grid">
        <div v-for="fam in FAMILIES" :key="fam.name" class="row">
          <div class="row-head">
            <strong>{{ fam.name }}</strong>
            <span>{{ fam.story }}</span>
          </div>
          <div class="ramp">
            <div
              v-for="stop in STOPS"
              :key="stop"
              class="swatch"
              :style="{ background: `var(--tulpar-primitive-color-${fam.name}-${stop})` }"
              :title="`${fam.name}-${stop}`"
            >
              <span class="stop">{{ stop }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Semantic roles ────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Semantic roles</h2>
      <p class="section-desc">
        Components only ever reference semantic tokens — never raw primitives. This is the layer
        that lets a brand or mode swap repaint the whole system.
      </p>
      <div class="token-grid">
        <div v-for="s in SEMANTICS" :key="s.role" class="token-card">
          <span class="token-dot" :style="{ background: `var(${s.varName})` }"></span>
          <span class="token-meta">
            <strong>{{ s.role }}</strong>
            <code>{{ s.varName }}</code>
          </span>
        </div>
      </div>
    </section>

    <!-- ── Surfaces & borders ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Surfaces &amp; borders</h2>
      <p class="section-desc">
        The neutral chrome tokens that build cards, panels, and dividers — mode-aware out of the
        box.
      </p>
      <div class="token-grid">
        <div v-for="s in SURFACES" :key="s.role" class="token-card">
          <span
            class="token-dot token-dot--bordered"
            :style="{ background: `var(${s.varName})` }"
          ></span>
          <span class="token-meta">
            <strong>{{ s.role }}</strong>
            <code>{{ s.varName }}</code>
          </span>
        </div>
      </div>
    </section>

    <!-- ── Chart series ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">Chart categorical series</h2>
      <p class="section-desc">
        Eight distinguishable hues for data visualization, ordered for maximum adjacent contrast.
      </p>
      <div class="chart-row">
        <span
          v-for="n in CHART"
          :key="n"
          class="chart-cell"
          :style="{ background: `var(--tulpar-chart-${n})` }"
          :title="`chart-${n}`"
          >{{ n }}</span
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ── Page header ───────────────────────────────────────────────────────── */
.page-header {
  margin-bottom: 40px;
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

/* ── Sections ──────────────────────────────────────────────────────────── */
.doc-section {
  padding-bottom: 44px;
  margin-bottom: 44px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.doc-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 10px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 22px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.section-desc {
  margin: 0 0 22px;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
  max-width: 640px;
  line-height: 1.6;
}

/* ── Hero ──────────────────────────────────────────────────────────────── */
.hero {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
}

.hero-card {
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 12px;
  overflow: hidden;
  background: var(--tulpar-color-bg-elevated, #ffffff);
}

.hero-swatch {
  height: 76px;
}

.hero-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
}

.hero-meta strong {
  font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
  font-size: 13px;
  color: var(--tulpar-color-text-primary, #15110b);
}

.hero-meta span {
  font-size: 11px;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* ── Palette grid ──────────────────────────────────────────────────────── */
.grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row-head {
  display: flex;
  gap: 10px;
  align-items: baseline;
  margin-bottom: 5px;
}

.row-head strong {
  font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
  font-size: 13px;
  color: var(--tulpar-color-text-primary, #15110b);
}

.row-head span {
  font-size: 12px;
  color: var(--tulpar-color-text-muted, #74777a);
}

.ramp {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.swatch {
  aspect-ratio: 2 / 1;
  display: flex;
  align-items: flex-end;
  padding: 3px 5px;
}

.stop {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.75);
  mix-blend-mode: difference;
}

/* ── Token cards (semantic + surfaces) ─────────────────────────────────── */
.token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.token-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 10px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
}

.token-dot {
  width: 28px;
  height: 28px;
  flex: none;
  border-radius: 8px;
}

.token-dot--bordered {
  border: 1px solid var(--tulpar-color-border-default, #c3cdcb);
}

.token-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.token-meta strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
}

.token-meta code {
  font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
  font-size: 11px;
  color: var(--tulpar-color-text-muted, #74777a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Chart row ─────────────────────────────────────────────────────────── */
.chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chart-cell {
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #fff;
  mix-blend-mode: difference;
  font-size: 12px;
  font-weight: 600;
}
</style>
