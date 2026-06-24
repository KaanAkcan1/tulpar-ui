<script setup lang="ts">
/* ════════════════════════════════════════════════════════════════════════════
 * SELECT DEMO — EXAMPLE SPEC (IDENTICAL in playground-ng + playground-vue)
 * ════════════════════════════════════════════════════════════════════════════
 * "Live playground first." Ten doc-sections, same order, same copy in BOTH apps:
 *
 *  1. Live playground   — controls: variant · size · label-position · placeholder
 *                         · clearable · loading · disabled · required · invalid/warn.
 *  2. Variants          — outlined · filled · underlined · ghost.
 *  3. Sizes             — xs · sm · md · lg · xl.
 *  4. Label positions   — top · float · float-in · float-on · none + label PROP vs SLOT.
 *  5. Options           — plain · leading icon · two-line description, each in PROP and SLOT form.
 *  6. Groups            — option-group, sticky headers, a disabled option inside a group.
 *  7. Placeholder · clearable — clear affordance + required-suppresses-clear.
 *  8. Validation        — invalid + error-text · warn + warn-text · required.
 *  9. Listbox states    — empty · loading · error.
 * 10. Long list (30+ → scroll/flip-up) + long labels (truncate). Realistic data
 *     (countries + frameworks + timezones).
 * ════════════════════════════════════════════════════════════════════════════ */
import { ref } from "vue";
import { TulparSelect, TulparOption, TulparOptionGroup } from "@tulpar-ui/vue";
import type { FieldVariant, FieldSize, LabelPosition } from "@tulpar-ui/vue";

// ─── Code snippet strings ─────────────────────────────────────────────────────

const pgHintCode = `<!-- bind any control; the live select below reflects it -->
<TulparSelect v-model:value="value" variant="outlined" size="md"
              placeholder="Pick a framework" clearable>
  <TulparOption value="angular" label="Angular" />
  <TulparOption value="vue"     label="Vue" />
  <TulparOption value="svelte"  label="Svelte" />
</TulparSelect>`;

const variantsCode = `// variant: outlined (default) · filled · underlined · ghost
<TulparSelect variant="outlined"   label="Outlined"   placeholder="Choose…" />
<TulparSelect variant="filled"     label="Filled"     placeholder="Choose…" />
<TulparSelect variant="underlined" label="Underlined" placeholder="Choose…" />
<TulparSelect variant="ghost"      label="Ghost"      placeholder="Choose…" />`;

const sizesCode = `// size: xs · sm · md (default) · lg · xl
<TulparSelect size="xs" placeholder="xs" />
<TulparSelect size="sm" placeholder="sm" />
<TulparSelect size="md" placeholder="md" />
<TulparSelect size="lg" placeholder="lg" />
<TulparSelect size="xl" placeholder="xl" />`;

const labelPosCode = `// label-position: top (default) · float · float-in · float-on · none
<TulparSelect label="Country" label-position="top"      placeholder="Select…" />
<TulparSelect label="Country" label-position="float"    placeholder="Select…" />
<TulparSelect label="Country" label-position="float-in" placeholder="Select…" />
<TulparSelect label="Country" label-position="float-on" placeholder="Select…" />
<TulparSelect label="Country" label-position="none"     placeholder="Select…" />

<!-- label — prop vs slot (slot wins) -->
<TulparSelect label="Prop label" placeholder="…" />
<TulparSelect placeholder="…"><template #label>Slot label</template></TulparSelect>`;

const optionsCode = `<!-- plain · leading icon · two-line description — PROP form -->
<TulparOption value="ts" label="TypeScript" />
<TulparOption value="ts" label="TypeScript" description="Typed superset of JS" />

<!-- SLOT form: default slot = label, #icon, #description -->
<TulparOption value="js">
  <template #icon><svg viewBox="0 0 16 16">…</svg></template>
  JavaScript
  <template #description>The language of the web</template>
</TulparOption>`;

const groupsCode = `<!-- option-group: header (prop or slot) + nested options; one disabled -->
<TulparSelect placeholder="Pick a city" label="Destination">
  <TulparOptionGroup label="Europe">
    <TulparOption value="ist" label="Istanbul" />
    <TulparOption value="ldn" label="London" />
  </TulparOptionGroup>
  <TulparOptionGroup>
    <template #label>Americas</template>
    <TulparOption value="nyc" label="New York" />
    <TulparOption value="sao" label="São Paulo" disabled />
  </TulparOptionGroup>
</TulparSelect>`;

const clearableCode = `// clearable — shows ✕ once a value is set (NOT when required)
<TulparSelect clearable label="Optional" placeholder="Pick one" />
<TulparSelect clearable required label="Required"   <!-- ✕ suppressed --> />`;

const validationCode = `// invalid + error-text · warn + warn-text · required
<TulparSelect invalid error-text="Please choose a plan" label="Plan" required />
<TulparSelect warn warn-text="Legacy region — migrate soon" label="Region" />
<TulparSelect required label="Role" placeholder="Select a role" />`;

const statesCode = `// listbox content states — empty · loading · error
<TulparSelect empty-text="No results" label="Empty" />     <!-- no options -->
<TulparSelect loading loading-text="Fetching…" label="Loading" />
<TulparSelect error="Failed to load options" label="Error" />`;

const longCode = `// 30+ options → the listbox scrolls and flips above the trigger near
// the viewport bottom. Long labels truncate with an ellipsis in the trigger.
<TulparSelect placeholder="Select a country" label="Country">
  <TulparOption v-for="c in countries" :key="c.code"
                :value="c.code" :label="c.name" />
</TulparSelect>`;

// ─── Realistic data ───────────────────────────────────────────────────────────

interface Country {
  code: string;
  name: string;
}

const countries: Country[] = [
  { code: "tr", name: "Türkiye" },
  { code: "de", name: "Germany" },
  { code: "fr", name: "France" },
  { code: "gb", name: "United Kingdom" },
  { code: "es", name: "Spain" },
  { code: "it", name: "Italy" },
  { code: "nl", name: "Netherlands" },
  { code: "se", name: "Sweden" },
  { code: "no", name: "Norway" },
  { code: "dk", name: "Denmark" },
  { code: "fi", name: "Finland" },
  { code: "pl", name: "Poland" },
  { code: "pt", name: "Portugal" },
  { code: "ie", name: "Ireland" },
  { code: "ch", name: "Switzerland" },
  { code: "at", name: "Austria" },
  { code: "be", name: "Belgium" },
  { code: "gr", name: "Greece" },
  { code: "cz", name: "Czechia" },
  { code: "us", name: "United States" },
  { code: "ca", name: "Canada" },
  { code: "mx", name: "Mexico" },
  { code: "br", name: "Brazil" },
  { code: "ar", name: "Argentina" },
  { code: "jp", name: "Japan" },
  { code: "kr", name: "South Korea" },
  { code: "cn", name: "China" },
  { code: "in", name: "India" },
  { code: "au", name: "Australia" },
  { code: "nz", name: "New Zealand" },
  { code: "za", name: "South Africa" },
  { code: "eg", name: "Egypt" },
];

const longLabels: Country[] = [
  { code: "congo", name: "Democratic Republic of the Congo (Kinshasa) — Central Africa" },
  { code: "uk-long", name: "United Kingdom of Great Britain and Northern Ireland" },
  { code: "venezuela", name: "Bolivarian Republic of Venezuela — South American Federation" },
];

const europe = countries.slice(0, 8);

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
];

const frameworks = [
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "react", label: "React" },
  { value: "solid", label: "Solid" },
  { value: "qwik", label: "Qwik" },
];

// ─── Static option lists ──────────────────────────────────────────────────────
const variants: FieldVariant[] = ["outlined", "filled", "underlined", "ghost"];
const sizes: FieldSize[] = ["xs", "sm", "md", "lg", "xl"];
const labelPositions: LabelPosition[] = ["top", "float", "float-in", "float-on", "none"];

// ─── Live playground state ────────────────────────────────────────────────────
const pgValue = ref<string>("");
const pgVariant = ref<FieldVariant>("outlined");
const pgSize = ref<FieldSize>("md");
const pgLabelPos = ref<LabelPosition>("top");
const pgPlaceholder = ref<string>("Pick a framework");
const pgClearable = ref(true);
const pgLoading = ref(false);
const pgDisabled = ref(false);
const pgRequired = ref(false);
const pgInvalid = ref(false);
const pgWarn = ref(false);
</script>

<template>
  <div class="demo-page demo-page--select">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Form Inputs</span>
      <h1 class="page-title">Select</h1>
      <p class="page-lede">
        A form-associated single-select combobox. The trigger shows the selected option (or a
        placeholder) and opens a top-layer listbox with full keyboard navigation —
        <strong>virtual focus</strong> (DOM focus stays on the trigger via
        <code class="inline-code">aria-activedescendant</code>), arrows / Home / End / Page,
        type-to-jump, light dismiss, and Escape-revert. Options support a leading icon and a
        two-line description, can be grouped under sticky headers, and the listbox renders empty,
        loading, and error states. <em>Label</em>, option <em>icon</em>, and <em>description</em>
        all have prop and slot forms.
      </p>
    </header>

    <!-- ── 1. Live playground ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Live playground</h2>
      <p class="section-desc">
        Drive a live select from the panel — variant, size, label position, placeholder, and the
        clearable / loading / disabled / required / invalid / warn toggles. The committed value is
        shown beneath.
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
            <span class="pg-field-label">Size</span>
            <select class="pg-select" v-model="pgSize">
              <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Label position</span>
            <select class="pg-select" v-model="pgLabelPos">
              <option v-for="p in labelPositions" :key="p" :value="p">{{ p }}</option>
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Placeholder</span>
            <input class="pg-text" type="text" v-model="pgPlaceholder" />
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgClearable" />
            <span>clearable</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgLoading" />
            <span>loading</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgDisabled" />
            <span>disabled</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgRequired" />
            <span>required</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgInvalid" />
            <span>invalid</span>
          </label>
          <label class="pg-check">
            <input type="checkbox" v-model="pgWarn" />
            <span>warn</span>
          </label>
        </div>
        <div class="pg-stage">
          <TulparSelect
            class="field"
            v-model:value="pgValue"
            :variant="pgVariant"
            :size="pgSize"
            label="Framework"
            :label-position="pgLabelPos"
            :placeholder="pgPlaceholder"
            :clearable="pgClearable"
            :loading="pgLoading"
            :disabled="pgDisabled"
            :required="pgRequired"
            :invalid="pgInvalid"
            :warn="pgWarn"
            error-text="Selection is required"
            warn-text="Heads up — double-check this one"
          >
            <TulparOption
              v-for="f in frameworks"
              :key="f.value"
              :value="f.value"
              :label="f.label"
            />
          </TulparSelect>
        </div>
        <div class="pg-value">
          value = <strong>{{ pgValue || "(empty)" }}</strong>
        </div>
      </div>
      <pre class="code"><code>{{ pgHintCode }}</code></pre>
    </section>

    <!-- ── 2. Variants ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Variants</h2>
      <p class="section-desc">
        <code class="inline-code">outlined</code> (default) ·
        <code class="inline-code">filled</code> · <code class="inline-code">underlined</code> ·
        <code class="inline-code">ghost</code> — the same trigger chrome shared across the input
        family.
      </p>
      <div class="preview">
        <div class="grid">
          <TulparSelect
            v-for="v in variants"
            :key="v"
            class="field"
            :variant="v"
            :label="v"
            placeholder="Choose a fruit"
          >
            <TulparOption v-for="o in fruits" :key="o.value" :value="o.value" :label="o.label" />
          </TulparSelect>
        </div>
      </div>
      <pre class="code"><code>{{ variantsCode }}</code></pre>
    </section>

    <!-- ── 3. Sizes ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Sizes</h2>
      <p class="section-desc">
        Five size tiers from <code class="inline-code">xs</code> to
        <code class="inline-code">xl</code>. Option rows match the trigger's size automatically.
      </p>
      <div class="preview preview--col">
        <div v-for="s in sizes" :key="s" class="demo-row">
          <span class="row-label">{{ s }}</span>
          <div class="row-items">
            <TulparSelect class="field" :size="s" placeholder="Select a fruit">
              <TulparOption v-for="o in fruits" :key="o.value" :value="o.value" :label="o.label" />
            </TulparSelect>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 4. Label positions ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Label positions</h2>
      <p class="section-desc">
        <code class="inline-code">top</code> (default) · <code class="inline-code">float</code> ·
        <code class="inline-code">float-in</code> · <code class="inline-code">float-on</code> ·
        <code class="inline-code">none</code>. The label is supplied via the
        <code class="inline-code">label</code> prop OR the <code class="inline-code">label</code>
        slot (slot wins) — both shown below.
      </p>
      <div class="preview">
        <div class="grid">
          <TulparSelect
            v-for="p in labelPositions"
            :key="p"
            class="field"
            label="Country"
            :label-position="p"
            placeholder="Select a country"
          >
            <TulparOption v-for="o in europe" :key="o.code" :value="o.code" :label="o.name" />
          </TulparSelect>
        </div>
      </div>
      <div class="dual-grid" style="margin-top: 16px">
        <div class="dual-card">
          <div class="dual-head">Label — prop form</div>
          <div class="dual-body">
            <TulparSelect class="field" label="Prop label" placeholder="Select…">
              <TulparOption v-for="o in europe" :key="o.code" :value="o.code" :label="o.name" />
            </TulparSelect>
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Label — slot form</div>
          <div class="dual-body">
            <TulparSelect class="field" placeholder="Select…">
              <template #label>Slot label</template>
              <TulparOption v-for="o in europe" :key="o.code" :value="o.code" :label="o.name" />
            </TulparSelect>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ labelPosCode }}</code></pre>
    </section>

    <!-- ── 5. Options ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Options — plain · icon · description</h2>
      <p class="section-desc">
        An option can be plain, carry a <code class="inline-code">#icon</code> leading icon, or show
        a second <code class="inline-code">description</code> line. Each capability is shown in
        <strong>prop</strong> form AND <strong>slot</strong> form.
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (label · description)</div>
          <div class="dual-body">
            <TulparSelect class="field" label="Language" placeholder="Pick a language">
              <TulparOption value="ts" label="TypeScript" />
              <TulparOption value="js" label="JavaScript" description="The language of the web" />
              <TulparOption value="py" label="Python" description="Batteries included" />
              <TulparOption value="rs" label="Rust" description="Fearless concurrency" />
            </TulparSelect>
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (icon · label · description)</div>
          <div class="dual-body">
            <TulparSelect class="field" label="Language" placeholder="Pick a language">
              <TulparOption value="ts">
                <template #icon><span aria-hidden="true">🟦</span></template>
                TypeScript
                <template #description>Typed superset of JavaScript</template>
              </TulparOption>
              <TulparOption value="js">
                <template #icon><span aria-hidden="true">🟨</span></template>
                JavaScript
                <template #description>The language of the web</template>
              </TulparOption>
              <TulparOption value="go">
                <template #icon><span aria-hidden="true">🔵</span></template>
                Go
                <template #description>Simple, fast, concurrent</template>
              </TulparOption>
            </TulparSelect>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ optionsCode }}</code></pre>
    </section>

    <!-- ── 6. Groups ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Groups</h2>
      <p class="section-desc">
        <code class="inline-code">TulparOptionGroup</code> bundles options under a sticky header
        (header via <code class="inline-code">label</code> prop OR
        <code class="inline-code">#label</code> slot). One option inside is
        <code class="inline-code">disabled</code> — keyboard nav skips it.
      </p>
      <div class="preview">
        <TulparSelect class="field field--lg" label="Destination" placeholder="Pick a city">
          <TulparOptionGroup label="Europe">
            <TulparOption value="ist" label="Istanbul" />
            <TulparOption value="ldn" label="London" />
            <TulparOption value="par" label="Paris" />
            <TulparOption value="ber" label="Berlin" />
          </TulparOptionGroup>
          <TulparOptionGroup>
            <template #label>Americas</template>
            <TulparOption value="nyc" label="New York" />
            <TulparOption value="sfo" label="San Francisco" />
            <TulparOption value="sao" label="São Paulo (sold out)" disabled />
            <TulparOption value="yyz" label="Toronto" />
          </TulparOptionGroup>
          <TulparOptionGroup label="Asia-Pacific">
            <TulparOption value="tyo" label="Tokyo" />
            <TulparOption value="sin" label="Singapore" />
            <TulparOption value="syd" label="Sydney" />
          </TulparOptionGroup>
        </TulparSelect>
      </div>
      <pre class="code"><code>{{ groupsCode }}</code></pre>
    </section>

    <!-- ── 7. Placeholder · clearable ─────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Placeholder &amp; clearable</h2>
      <p class="section-desc">
        The <code class="inline-code">placeholder</code> shows until a value is committed.
        <code class="inline-code">clearable</code> adds a ✕ once a value is set — but a
        <code class="inline-code">required</code> field never offers clear (a required field must
        keep a value).
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">optional</span>
          <div class="row-items">
            <TulparSelect
              class="field"
              clearable
              label="Optional pick"
              value="vue"
              placeholder="Pick a framework"
            >
              <TulparOption
                v-for="f in frameworks"
                :key="f.value"
                :value="f.value"
                :label="f.label"
              />
            </TulparSelect>
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">required</span>
          <div class="row-items">
            <TulparSelect
              class="field"
              clearable
              required
              label="Required pick"
              value="angular"
              placeholder="Pick a framework"
            >
              <TulparOption
                v-for="f in frameworks"
                :key="f.value"
                :value="f.value"
                :label="f.label"
              />
            </TulparSelect>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ clearableCode }}</code></pre>
    </section>

    <!-- ── 8. Validation ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Validation</h2>
      <p class="section-desc">
        <code class="inline-code">invalid</code> + <code class="inline-code">error-text</code> for
        errors, <code class="inline-code">warn</code> +
        <code class="inline-code">warn-text</code> for soft warnings, and
        <code class="inline-code">required</code> for the necessity indicator. These are field-level
        states (distinct from the listbox content states below).
      </p>
      <div class="preview">
        <div class="grid">
          <TulparSelect
            class="field"
            invalid
            required
            label="Plan"
            placeholder="Choose a plan"
            error-text="Please choose a plan"
          >
            <TulparOption value="free" label="Free" />
            <TulparOption value="pro" label="Pro" />
            <TulparOption value="ent" label="Enterprise" />
          </TulparSelect>
          <TulparSelect
            class="field"
            warn
            label="Region"
            value="eu-west-1"
            warn-text="Legacy region — migrate soon"
          >
            <TulparOption value="eu-west-1" label="eu-west-1 (legacy)" />
            <TulparOption value="eu-central-1" label="eu-central-1" />
            <TulparOption value="us-east-1" label="us-east-1" />
          </TulparSelect>
          <TulparSelect class="field" required label="Role" placeholder="Select a role">
            <TulparOption value="admin" label="Administrator" />
            <TulparOption value="editor" label="Editor" />
            <TulparOption value="viewer" label="Viewer" />
          </TulparSelect>
        </div>
      </div>
      <pre class="code"><code>{{ validationCode }}</code></pre>
    </section>

    <!-- ── 9. Listbox states ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Listbox states — empty · loading · error</h2>
      <p class="section-desc">
        Independent of field validation, the listbox renders a status row:
        <code class="inline-code">empty-text</code> when there are no options,
        <code class="inline-code">loading</code> (spinner in the trigger + a loading row), and
        <code class="inline-code">error</code> for a load failure (<code class="inline-code"
          >role="alert"</code
        >). Open each to see the state.
      </p>
      <div class="preview">
        <div class="grid">
          <TulparSelect
            class="field"
            label="Empty"
            placeholder="No options yet"
            empty-text="No results found"
          />
          <TulparSelect
            class="field"
            loading
            label="Loading"
            placeholder="Fetching…"
            loading-text="Fetching options…"
          >
            <TulparOption value="a" label="A" />
            <TulparOption value="b" label="B" />
          </TulparSelect>
          <TulparSelect
            class="field"
            label="Error"
            placeholder="Open me"
            error="Failed to load options. Try again."
          >
            <TulparOption value="a" label="A" />
            <TulparOption value="b" label="B" />
          </TulparSelect>
        </div>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 10. Long list & long labels ────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Long list &amp; long labels</h2>
      <p class="section-desc">
        With 30+ options the listbox scrolls and flips above the trigger when near the viewport
        bottom. Long option labels truncate with an ellipsis in the trigger. Try type-to-jump (e.g.
        press <code class="inline-code">g</code> for Germany).
      </p>
      <div class="preview">
        <div class="grid">
          <TulparSelect class="field" label="Country (32 options)" placeholder="Select a country">
            <TulparOption v-for="c in countries" :key="c.code" :value="c.code" :label="c.name" />
          </TulparSelect>
          <TulparSelect class="field" label="Long labels (truncate)" placeholder="Select a region">
            <TulparOption v-for="c in longLabels" :key="c.code" :value="c.code" :label="c.name" />
          </TulparSelect>
        </div>
      </div>
      <pre class="code"><code>{{ longCode }}</code></pre>
    </section>

    <!-- ── 11. Accessibility ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">11. Accessibility</h2>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Virtual focus.</strong> DOM focus stays on the trigger (<code class="inline-code"
            >role="combobox"</code
          >); arrowing moves the active option via
          <code class="inline-code">aria-activedescendant</code> — not a roving tabindex.
        </div>
        <div class="a11y-note">
          <strong>Keyboard.</strong> Open with Enter / Space / Arrow / Alt+Down. Navigate with
          Arrows, Home / End, Page Up/Down, and type-to-jump. Commit with Enter; Escape reverts the
          arrow preview and closes; focus always returns to the trigger.
        </div>
        <div class="a11y-note">
          <strong>Light dismiss.</strong> Outside-click, scroll, and resize close the listbox; a
          click inside the listbox does not. Disabled options are skipped by keyboard nav and ignore
          clicks.
        </div>
        <div class="a11y-note">
          <strong>Dark mode.</strong> Trigger, listbox, every variant, and all status rows flip
          under <code class="inline-code">.dark</code>.
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
  align-items: flex-start;
}

.preview--col {
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.demo-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 14px 0;
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
  width: 104px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
  padding-top: 10px;
}

.row-items {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 18px;
  min-width: 0;
  flex: 1;
}

.field {
  width: 240px;
  max-width: 100%;
}

.field--lg {
  width: 280px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px 24px;
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

.pg-text {
  font: inherit;
  font-size: 13px;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-elevated, #fff);
  color: var(--tulpar-color-text-primary, #15110b);
  min-width: 150px;
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
  align-items: flex-start;
  gap: 16px;
  min-height: 56px;
  padding: 8px 0;
}

.pg-stage .field {
  width: 300px;
}

.pg-value {
  margin-top: 14px;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 12px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

.pg-value strong {
  color: var(--tulpar-color-text-primary, #15110b);
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
