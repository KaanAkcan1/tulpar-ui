<script setup lang="ts">
const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

const FAMILIES: { name: string; story: string }[] = [
  { name: "al", story: "Al Ruhu · danger" },
  { name: "kizagan", story: "Kızagan Tengri · kritik vurgu" },
  { name: "umay", story: "Umay Ana · highlights" },
  { name: "ilay", story: "İlay · kategorik / charts" },
  { name: "erlik", story: "Erlik Han · help / premium-depth" },
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

const CHART = [1, 2, 3, 4, 5, 6, 7, 8] as const;
</script>

<template>
  <section class="colors">
    <h1>Chromatic Mythology</h1>
    <p class="lede">22 aile · tek OKLCH merdiveni · Türk/Altay mitolojisi.</p>

    <h2>Palet</h2>
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

    <h2>Semantik roller</h2>
    <div class="legend">
      <div v-for="s in SEMANTICS" :key="s.role" class="chip">
        <span class="dot" :style="{ background: `var(${s.varName})` }"></span>
        <span>{{ s.role }}</span>
      </div>
    </div>

    <h2>Chart kategorik seri</h2>
    <div class="chart-row">
      <span
        v-for="n in CHART"
        :key="n"
        class="chart-cell"
        :style="{ background: `var(--tulpar-chart-${n})` }"
        :title="`chart-${n}`"
      >{{ n }}</span>
    </div>
  </section>
</template>

<style scoped>
.colors { padding: 24px; max-width: 1100px; }
h1 { font-family: var(--tulpar-font-family-display, serif); margin: 0 0 4px; }
.lede { color: var(--tulpar-color-text-muted, #74777a); margin: 0 0 24px; }
h2 { margin: 28px 0 12px; font-size: 15px; text-transform: uppercase; letter-spacing: .05em; color: var(--tulpar-color-text-secondary, #27231d); }
.grid { display: flex; flex-direction: column; gap: 10px; }
.row-head { display: flex; gap: 10px; align-items: baseline; margin-bottom: 4px; }
.row-head strong { font-family: var(--tulpar-font-family-mono, monospace); }
.row-head span { font-size: 12px; color: var(--tulpar-color-text-muted, #74777a); }
.ramp { display: grid; grid-template-columns: repeat(11, 1fr); border-radius: 8px; overflow: hidden; }
.swatch { aspect-ratio: 2 / 1; display: flex; align-items: flex-end; padding: 3px 5px; }
.stop { font-size: 9px; color: rgba(255,255,255,.7); mix-blend-mode: difference; }
.legend { display: flex; flex-wrap: wrap; gap: 10px; }
.chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border: 1px solid var(--tulpar-color-border-default, #d9e0df); border-radius: 999px; font-size: 13px; }
.dot { width: 14px; height: 14px; border-radius: 50%; }
.chart-row { display: flex; gap: 4px; }
.chart-cell { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 6px; color: #fff; mix-blend-mode: difference; font-size: 12px; }
</style>
