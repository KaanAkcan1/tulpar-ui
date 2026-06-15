<script setup lang="ts">
import { ref } from "vue";
import { TulparTextInput } from "@tulpar-ui/vue";

// ─── Section list ─────────────────────────────────────────────────────────────
const sections = [
  { id: "types", title: "Types" },
  { id: "sizes", title: "Sizes" },
  { id: "variants", title: "Variants" },
  { id: "label-positions", title: "Label Positions" },
  { id: "necessity", title: "Necessity" },
  { id: "statuses", title: "Statuses" },
  { id: "affordances", title: "Affordances" },
  { id: "masks", title: "Masks" },
  { id: "slots", title: "Slots" },
  { id: "states", title: "States" },
];

const activeSection = ref("all");

// Two-way bound demo refs
const clearableVal = ref("");
const countVal = ref("");
const maskPhone = ref("");
const maskRaw = ref("");
const maskMasked = ref("");

// ─── Code snippets ────────────────────────────────────────────────────────────

const typesCode = `<!-- text / email / url / tel / search / password -->
<TulparTextInput type="email" label="Email" autocomplete="email" />
<TulparTextInput type="password" label="Password" autocomplete="current-password" />
<!-- search: auto-adds search icon + clearable -->
<TulparTextInput type="search" label="Search" placeholder="Search..." />`;

const sizesCode = `<TulparTextInput size="xs" label="Extra Small" />
<TulparTextInput size="sm" label="Small" />
<TulparTextInput size="md" label="Medium (default)" />
<TulparTextInput size="lg" label="Large" />
<TulparTextInput size="xl" label="Extra Large" />
<!-- note: at xs, action buttons (clear/copy/paste) are auto-hidden for touch a11y -->`;

const variantsCode = `<TulparTextInput variant="outlined" label="Outlined (default)" />
<TulparTextInput variant="filled" label="Filled" />
<TulparTextInput variant="underlined" label="Underlined" />
<TulparTextInput variant="ghost" label="Ghost" />`;

const labelPositionsCode = `<TulparTextInput label-position="top" label="Top (default)" />
<TulparTextInput label-position="float" label="Float" />
<TulparTextInput label-position="float-in" label="Float-in" />
<TulparTextInput label-position="float-on" label="Float-on" />
<TulparTextInput label-position="none" placeholder="No label" />
<!-- fallback: float + ghost → renders as top, console warning -->
<TulparTextInput label-position="float" variant="ghost" label="Float + Ghost (→ top)" />`;

const necessityCode = `<!-- icon mode (default): asterisk for required, nothing for optional -->
<TulparTextInput label="Username" :required="true" necessity-indicator="icon" />
<!-- label mode: appends "(required)" or "(optional)" text -->
<TulparTextInput label="Username" :required="true" necessity-indicator="label" />
<TulparTextInput label="Nickname" necessity-indicator="label" />
<!-- none: no indicator at all -->
<TulparTextInput label="Display Name" necessity-indicator="none" />`;

const statusesCode = `<TulparTextInput label="Email" :invalid="true" error-text="Invalid email address" />
<TulparTextInput label="Username" :warn="true" warn-text="Username may already be taken" />
<TulparTextInput label="Subdomain" :validating="true" helper-text="Checking availability…" />
<!-- invalid + validating combo (re-checking after edit) -->
<TulparTextInput label="Slug" :invalid="true" :validating="true" error-text="Invalid format" />
<!-- helper only baseline -->
<TulparTextInput label="Website" helper-text="Include https://" />`;

const affordancesCode = `<!-- clearable: x button appears when value is non-empty -->
<TulparTextInput label="Search" :clearable="true" v-model="val" />
<!-- show-count: character count overlay in message row -->
<TulparTextInput label="Bio" :show-count="true" :max-length="50" />
<!-- copyable: copy icon, works great for read-only values -->
<TulparTextInput label="API Key" :copyable="true" :readonly="true" value="sk_test_abc123" />
<!-- pastable: paste icon -->
<TulparTextInput label="Paste here" :pastable="true" />`;

const masksCode = `<!-- TR phone — single backslash in Vue template -->
<TulparTextInput label="Phone" mask="+\\90 (999) 999 99 99" />
<!-- TR plate: auto-uppercase letters -->
<TulparTextInput label="Plate" mask="99 AAA 999" />
<!-- Credit card -->
<TulparTextInput label="Card" mask="9999 9999 9999 9999" />
<!-- Date -->
<TulparTextInput label="Date" mask="99/99/9999" placeholder="DD/MM/YYYY" />
<!-- mask-emit raw vs masked; mask-display eager vs lazy; custom slot char -->
<TulparTextInput label="Raw emit" mask="999-999" mask-emit="raw" />
<TulparTextInput label="Lazy display" mask="999-999" mask-display="lazy" />
<TulparTextInput label="Custom slot char ·" mask="999-999" mask-slot-char="·" />`;

const slotsCode = `<!-- prefix slot: static text -->
<TulparTextInput label="Amount">
  <span slot="prefix">$</span>
</TulparTextInput>
<!-- suffix slot -->
<TulparTextInput label="Domain">
  <span slot="suffix">.com</span>
</TulparTextInput>
<!-- prefix-interactive: a button inside the prefix slot -->
<TulparTextInput label="Search" :prefix-interactive="true">
  <button slot="prefix" type="button">Go</button>
</TulparTextInput>`;

const statesCode = `<TulparTextInput label="Disabled" :disabled="true" value="Cannot edit" />
<TulparTextInput label="Readonly" :readonly="true" value="Read only value" />
<!-- no-message-space: no reserved row beneath input (tight layouts) -->
<TulparTextInput label="Compact" :no-message-space="true" />`;
</script>

<template>
  <!-- Sub-menu -->
  <div class="sub-menu">
    <button
      class="sub-btn"
      :class="{ active: activeSection === 'all' }"
      @click="activeSection = 'all'"
    >
      All
    </button>
    <button
      v-for="s in sections"
      :key="s.id"
      class="sub-btn"
      :class="{ active: activeSection === s.id }"
      @click="activeSection = s.id"
    >
      {{ s.title }}
    </button>
  </div>

  <!-- ── Types ──────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'types'" class="demo-section">
    <h3 class="demo-title">Types</h3>
    <p class="demo-desc">
      All 6 input types. Search auto-adds a magnifier icon and clearable affordance. Password shows
      a reveal toggle.
    </p>
    <div class="preview preview--col">
      <div class="preview-row">
        <TulparTextInput type="text" label="Text (default)" placeholder="Plain text" />
        <TulparTextInput
          type="email"
          label="Email"
          autocomplete="email"
          placeholder="you@example.com"
        />
        <TulparTextInput type="url" label="URL" placeholder="https://" />
      </div>
      <div class="preview-row">
        <TulparTextInput type="tel" label="Tel" autocomplete="tel" placeholder="+1 555 000 0000" />
        <TulparTextInput type="search" label="Search" placeholder="Search…" />
        <TulparTextInput
          type="password"
          label="Password"
          autocomplete="current-password"
          placeholder="••••••••"
        />
      </div>
    </div>
    <pre class="code"><code>{{ typesCode }}</code></pre>
  </section>

  <!-- ── Sizes ──────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'sizes'" class="demo-section">
    <h3 class="demo-title">Sizes</h3>
    <p class="demo-desc">
      Five sizes: xs → xl. At xs, action buttons (clear/copy/paste) are auto-hidden to respect touch
      target a11y guidelines.
    </p>
    <div class="preview preview--col">
      <TulparTextInput size="xs" label="xs — Extra Small" placeholder="xs" />
      <TulparTextInput size="sm" label="sm — Small" placeholder="sm" />
      <TulparTextInput size="md" label="md — Medium (default)" placeholder="md" />
      <TulparTextInput size="lg" label="lg — Large" placeholder="lg" />
      <TulparTextInput size="xl" label="xl — Extra Large" placeholder="xl" />
    </div>
    <pre class="code"><code>{{ sizesCode }}</code></pre>
  </section>

  <!-- ── Variants ───────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'variants'" class="demo-section">
    <h3 class="demo-title">Variants</h3>
    <p class="demo-desc">
      Four rendering styles. Ghost with float label falls back to top (console warning).
    </p>
    <div class="preview preview--col">
      <TulparTextInput variant="outlined" label="Outlined (default)" placeholder="Outlined" />
      <TulparTextInput variant="filled" label="Filled" placeholder="Filled" />
      <TulparTextInput variant="underlined" label="Underlined" placeholder="Underlined" />
      <TulparTextInput variant="ghost" label="Ghost" placeholder="Ghost" />
    </div>
    <pre class="code"><code>{{ variantsCode }}</code></pre>
  </section>

  <!-- ── Label Positions ────────────────────────────────────────────────────── -->
  <section
    v-if="activeSection === 'all' || activeSection === 'label-positions'"
    class="demo-section"
  >
    <h3 class="demo-title">Label Positions</h3>
    <p class="demo-desc">
      Five positions. The last example shows the fallback: float + ghost forces top layout with a
      console warning.
    </p>
    <div class="preview preview--col">
      <TulparTextInput label-position="top" label="Top (default)" placeholder="top" />
      <TulparTextInput label-position="float" label="Float" placeholder="Click to float label" />
      <TulparTextInput label-position="float-in" label="Float-in" placeholder="float-in" />
      <TulparTextInput label-position="float-on" label="Float-on" placeholder="float-on" />
      <TulparTextInput label-position="none" placeholder="No label (label-position=none)" />
      <div>
        <p class="demo-note">Fallback: float + ghost → renders as top (console warning)</p>
        <TulparTextInput
          label-position="float"
          variant="ghost"
          label="Float + Ghost → fallback to top"
          placeholder="ghost float fallback"
        />
      </div>
    </div>
    <pre class="code"><code>{{ labelPositionsCode }}</code></pre>
  </section>

  <!-- ── Necessity ──────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'necessity'" class="demo-section">
    <h3 class="demo-title">Necessity Indicator</h3>
    <p class="demo-desc">Three modes: icon (asterisk), label (appends text), none.</p>
    <div class="preview preview--col">
      <div class="preview-row">
        <TulparTextInput
          label="Required (icon)"
          :required="true"
          necessity-indicator="icon"
          placeholder="required + icon"
        />
        <TulparTextInput
          label="Optional (icon)"
          necessity-indicator="icon"
          placeholder="optional + icon (no mark)"
        />
      </div>
      <div class="preview-row">
        <TulparTextInput
          label="Required (label)"
          :required="true"
          necessity-indicator="label"
          placeholder="required + label text"
        />
        <TulparTextInput
          label="Optional (label)"
          necessity-indicator="label"
          placeholder="optional + label text"
        />
      </div>
      <TulparTextInput
        label="No indicator"
        necessity-indicator="none"
        placeholder="necessity-indicator=none"
      />
    </div>
    <pre class="code"><code>{{ necessityCode }}</code></pre>
  </section>

  <!-- ── Statuses ───────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'statuses'" class="demo-section">
    <h3 class="demo-title">Statuses</h3>
    <p class="demo-desc">
      invalid + error-text, warn + warn-text, validating + helper-text, invalid + validating combo,
      and a helper-only baseline.
    </p>
    <div class="preview preview--col">
      <TulparTextInput
        label="Email"
        :invalid="true"
        error-text="Invalid email address"
        value="not-an-email"
      />
      <TulparTextInput
        label="Username"
        :warn="true"
        warn-text="Username may already be taken"
        value="john_doe"
      />
      <TulparTextInput
        label="Subdomain"
        :validating="true"
        helper-text="Checking availability…"
        value="my-app"
      />
      <TulparTextInput
        label="Slug"
        :invalid="true"
        :validating="true"
        error-text="Invalid format — re-checking"
        value="bad slug!"
      />
      <TulparTextInput
        label="Website"
        helper-text="Include https://"
        placeholder="https://example.com"
      />
    </div>
    <pre class="code"><code>{{ statusesCode }}</code></pre>
  </section>

  <!-- ── Affordances ────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'affordances'" class="demo-section">
    <h3 class="demo-title">Affordances</h3>
    <p class="demo-desc">
      clearable, show-count, copyable (great for readonly tokens), pastable, and combined.
    </p>
    <div class="preview preview--col">
      <TulparTextInput
        label="Clearable"
        :clearable="true"
        v-model="clearableVal"
        placeholder="Type something…"
      />
      <p class="value-display">value = "{{ clearableVal }}"</p>

      <TulparTextInput
        label="Show Count (max 50)"
        :show-count="true"
        :max-length="50"
        v-model="countVal"
        placeholder="Type to see counter…"
      />

      <TulparTextInput
        label="API Key (copyable + readonly)"
        :copyable="true"
        :readonly="true"
        value="sk_test_4xK7mR9pQnW2vL8hJ5cB"
      />

      <TulparTextInput label="Pastable" :pastable="true" placeholder="Click paste icon…" />

      <TulparTextInput
        label="Copyable + Pastable"
        :copyable="true"
        :pastable="true"
        value="combo"
      />
    </div>
    <pre class="code"><code>{{ affordancesCode }}</code></pre>
  </section>

  <!-- ── Masks ──────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'masks'" class="demo-section">
    <h3 class="demo-title">Masks</h3>
    <p class="demo-desc">
      Mask tokens: 9=digit, A=letter, *=any. In Vue templates use a single backslash before the
      leading digit in "+90" (the template compiler does not double-escape it like Angular does).
    </p>
    <div class="preview preview--col">
      <TulparTextInput
        label="TR Phone"
        mask="+\90 (999) 999 99 99"
        v-model="maskPhone"
        placeholder="+90 (___) ___ __ __"
      />
      <p class="value-display">masked value = "{{ maskPhone }}"</p>

      <TulparTextInput
        label="TR Plate (auto-uppercase letters)"
        mask="99 AAA 999"
        placeholder="34 ABC 123"
      />

      <TulparTextInput
        label="Credit Card"
        mask="9999 9999 9999 9999"
        placeholder="0000 0000 0000 0000"
      />

      <TulparTextInput label="Date" mask="99/99/9999" placeholder="DD/MM/YYYY" />

      <div class="preview-row">
        <div>
          <TulparTextInput label="mask-emit=raw" mask="999-999" mask-emit="raw" v-model="maskRaw" />
          <p class="value-display">raw = "{{ maskRaw }}"</p>
        </div>
        <div>
          <TulparTextInput
            label="mask-emit=masked (default)"
            mask="999-999"
            mask-emit="masked"
            v-model="maskMasked"
          />
          <p class="value-display">masked = "{{ maskMasked }}"</p>
        </div>
      </div>

      <div class="preview-row">
        <TulparTextInput
          label="mask-display=eager (default)"
          mask="999-999"
          mask-display="eager"
          placeholder="shows placeholder mask on focus"
        />
        <TulparTextInput
          label="mask-display=lazy"
          mask="999-999"
          mask-display="lazy"
          placeholder="mask reveals as you type"
        />
      </div>

      <TulparTextInput
        label="Custom slot char ·"
        mask="999-999"
        mask-slot-char="·"
        placeholder="uses · as slot character"
      />
    </div>
    <pre class="code"><code>{{ masksCode }}</code></pre>
  </section>

  <!-- ── Slots ──────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'slots'" class="demo-section">
    <h3 class="demo-title">Slots</h3>
    <p class="demo-desc">
      prefix and suffix slots accept any content. prefix-interactive enables a tabbable / clickable
      element in the prefix zone.
    </p>
    <div class="preview preview--col">
      <TulparTextInput label="Amount (prefix $)">
        <span slot="prefix">$</span>
      </TulparTextInput>

      <TulparTextInput label="Domain (suffix .com)">
        <span slot="suffix">.com</span>
      </TulparTextInput>

      <TulparTextInput label="Search (prefix-interactive button)" :prefix-interactive="true">
        <button slot="prefix" type="button" style="padding: 0 8px; cursor: pointer">Go</button>
      </TulparTextInput>
    </div>
    <pre class="code"><code>{{ slotsCode }}</code></pre>
  </section>

  <!-- ── States ─────────────────────────────────────────────────────────────── -->
  <section v-if="activeSection === 'all' || activeSection === 'states'" class="demo-section">
    <h3 class="demo-title">States</h3>
    <p class="demo-desc">
      disabled, readonly, and no-message-space (tight layout — no reserved row below).
    </p>
    <div class="preview preview--col">
      <TulparTextInput label="Disabled" :disabled="true" value="Cannot edit this" />
      <TulparTextInput label="Readonly" :readonly="true" value="Read only value" />
      <TulparTextInput
        label="No Message Space"
        :no-message-space="true"
        placeholder="tight layout — no gap below"
      />
    </div>
    <pre class="code"><code>{{ statesCode }}</code></pre>
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
  transition:
    background 0.1s,
    color 0.1s;
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

.demo-note {
  margin: 0 0 8px;
  font-size: 12px;
  font-style: italic;
  color: var(--tulpar-color-text-muted, #78716c);
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
</style>
