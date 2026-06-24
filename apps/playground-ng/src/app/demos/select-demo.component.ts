import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import {
  TulparSelectComponent,
  TulparOptionComponent,
  TulparOptionGroupComponent,
  type FieldVariant,
  type FieldSize,
  type LabelPosition,
} from '@tulpar-ui/angular';

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

// ─── Code snippet strings (outside @Component to avoid backtick nesting) ──────

const PG_HINT_CODE = `<!-- bind any control; the live select below reflects it -->
<tulpar-select-ng [(value)]="value" variant="outlined" size="md"
                  placeholder="Pick a framework" clearable>
  <tulpar-option-ng value="angular" label="Angular" />
  <tulpar-option-ng value="vue"     label="Vue" />
  <tulpar-option-ng value="svelte"  label="Svelte" />
</tulpar-select-ng>`;

const VARIANTS_CODE = `// variant: outlined (default) · filled · underlined · ghost
<tulpar-select-ng variant="outlined"   label="Outlined"   placeholder="Choose…" />
<tulpar-select-ng variant="filled"     label="Filled"     placeholder="Choose…" />
<tulpar-select-ng variant="underlined" label="Underlined" placeholder="Choose…" />
<tulpar-select-ng variant="ghost"      label="Ghost"      placeholder="Choose…" />`;

const SIZES_CODE = `// size: xs · sm · md (default) · lg · xl
<tulpar-select-ng size="xs" placeholder="xs" />
<tulpar-select-ng size="sm" placeholder="sm" />
<tulpar-select-ng size="md" placeholder="md" />
<tulpar-select-ng size="lg" placeholder="lg" />
<tulpar-select-ng size="xl" placeholder="xl" />`;

const LABEL_POS_CODE = `// label-position: top (default) · float · float-in · float-on · none
<tulpar-select-ng label="Country" label-position="top"      placeholder="Select…" />
<tulpar-select-ng label="Country" label-position="float"    placeholder="Select…" />
<tulpar-select-ng label="Country" label-position="float-in" placeholder="Select…" />
<tulpar-select-ng label="Country" label-position="float-on" placeholder="Select…" />
<tulpar-select-ng label="Country" label-position="none"     placeholder="Select…" />

<!-- label — prop vs slot (slot wins) -->
<tulpar-select-ng label="Prop label" placeholder="…" />
<tulpar-select-ng placeholder="…"><span slot="label">Slot label</span></tulpar-select-ng>`;

const OPTIONS_CODE = `<!-- plain · leading icon · two-line description — PROP form -->
<tulpar-option-ng value="ts" label="TypeScript" />
<tulpar-option-ng value="ts" label="TypeScript" description="Typed superset of JS" />

<!-- SLOT form: default slot = label, slot="icon", slot="description" -->
<tulpar-option-ng value="js">
  <svg slot="icon" viewBox="0 0 16 16">…</svg>
  JavaScript
  <span slot="description">The language of the web</span>
</tulpar-option-ng>`;

const GROUPS_CODE = `<!-- option-group: header (prop or slot) + nested options; one disabled -->
<tulpar-select-ng placeholder="Pick a city" label="Destination">
  <tulpar-option-group-ng label="Europe">
    <tulpar-option-ng value="ist" label="Istanbul" />
    <tulpar-option-ng value="ldn" label="London" />
  </tulpar-option-group-ng>
  <tulpar-option-group-ng>
    <span slot="label">Americas</span>
    <tulpar-option-ng value="nyc" label="New York" />
    <tulpar-option-ng value="sao" label="São Paulo" disabled />
  </tulpar-option-group-ng>
</tulpar-select-ng>`;

const CLEARABLE_CODE = `// clearable — shows ✕ once a value is set (NOT when required)
<tulpar-select-ng clearable label="Optional" placeholder="Pick one" />
<tulpar-select-ng clearable required label="Required"   <!-- ✕ suppressed --> />`;

const VALIDATION_CODE = `// invalid + error-text · warn + warn-text · required
<tulpar-select-ng invalid error-text="Please choose a plan" label="Plan" required />
<tulpar-select-ng warn warn-text="Legacy region — migrate soon" label="Region" />
<tulpar-select-ng required label="Role" placeholder="Select a role" />`;

const STATES_CODE = `// listbox content states — empty · loading · error
<tulpar-select-ng empty-text="No results" label="Empty" />     <!-- no options -->
<tulpar-select-ng loading loading-text="Fetching…" label="Loading" />
<tulpar-select-ng error="Failed to load options" label="Error" />`;

const LONG_CODE = `// 30+ options → the listbox scrolls and flips above the trigger near
// the viewport bottom. Long labels truncate with an ellipsis in the trigger.
<tulpar-select-ng placeholder="Select a country" label="Country">
  @for (c of countries; track c.code) {
    <tulpar-option-ng [value]="c.code" [label]="c.name" />
  }
</tulpar-select-ng>`;

// ─── Realistic data ───────────────────────────────────────────────────────────

interface Country {
  code: string;
  name: string;
}

const COUNTRIES: Country[] = [
  { code: 'tr', name: 'Türkiye' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'es', name: 'Spain' },
  { code: 'it', name: 'Italy' },
  { code: 'nl', name: 'Netherlands' },
  { code: 'se', name: 'Sweden' },
  { code: 'no', name: 'Norway' },
  { code: 'dk', name: 'Denmark' },
  { code: 'fi', name: 'Finland' },
  { code: 'pl', name: 'Poland' },
  { code: 'pt', name: 'Portugal' },
  { code: 'ie', name: 'Ireland' },
  { code: 'ch', name: 'Switzerland' },
  { code: 'at', name: 'Austria' },
  { code: 'be', name: 'Belgium' },
  { code: 'gr', name: 'Greece' },
  { code: 'cz', name: 'Czechia' },
  { code: 'us', name: 'United States' },
  { code: 'ca', name: 'Canada' },
  { code: 'mx', name: 'Mexico' },
  { code: 'br', name: 'Brazil' },
  { code: 'ar', name: 'Argentina' },
  { code: 'jp', name: 'Japan' },
  { code: 'kr', name: 'South Korea' },
  { code: 'cn', name: 'China' },
  { code: 'in', name: 'India' },
  { code: 'au', name: 'Australia' },
  { code: 'nz', name: 'New Zealand' },
  { code: 'za', name: 'South Africa' },
  { code: 'eg', name: 'Egypt' },
];

const LONG_LABELS: Country[] = [
  {
    code: 'congo',
    name: 'Democratic Republic of the Congo (Kinshasa) — Central Africa',
  },
  {
    code: 'uk-long',
    name: 'United Kingdom of Great Britain and Northern Ireland',
  },
  {
    code: 'venezuela',
    name: 'Bolivarian Republic of Venezuela — South American Federation',
  },
];

// ─── Shared page-shell styles (mirrors chip-demo) ─────────────────────────────

const PAGE_STYLES = `
  :host { display: block; }

  .page-header { margin-bottom: 12px; }
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
  .doc-section:last-child { border-bottom: none; margin-bottom: 0; }

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
  .preview--col { flex-direction: column; align-items: stretch; gap: 0; }

  .demo-row {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 14px 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--tulpar-color-border-default, #d9e0df) 55%, transparent);
  }
  .demo-row:first-child { padding-top: 0; }
  .demo-row:last-child { border-bottom: none; padding-bottom: 0; }

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

  /* Each demo select occupies a fixed comfortable width */
  .field { width: 240px; max-width: 100%; }
  .field--sm { width: 200px; }
  .field--lg { width: 280px; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 18px 24px;
  }

  .dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 640px) { .dual-grid { grid-template-columns: 1fr; } }
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
  .dual-body { padding: 18px 16px; }

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
  .pg-field { display: flex; flex-direction: column; gap: 6px; }
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
  .pg-check input { width: 16px; height: 16px; accent-color: var(--tulpar-color-brand-default, #00c57a); cursor: pointer; }
  .pg-stage {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 16px;
    min-height: 56px;
    padding: 8px 0;
  }
  .pg-stage .field { width: 300px; }
  .pg-value {
    margin-top: 14px;
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
    font-size: 12px;
    color: var(--tulpar-color-text-secondary, #57534e);
  }
  .pg-value strong { color: var(--tulpar-color-text-primary, #15110b); }

  .code {
    margin: 0;
    padding: 16px 20px;
    background: var(--tulpar-color-bg-inverse, #15110b);
    border: 1px solid var(--tulpar-color-border-default, #d9e0df);
    border-radius: 0 0 6px 6px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
    font-size: 13px;
    line-height: 1.55;
    color: #d9e0df;
    white-space: pre;
  }
  .inline-code {
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
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
  .a11y-note { font-size: 13px; color: var(--tulpar-color-text-secondary, #57534e); line-height: 1.6; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-select-demo',
  standalone: true,
  imports: [TulparSelectComponent, TulparOptionComponent, TulparOptionGroupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
            <select class="pg-select" [value]="pgVariant()" (change)="setPgVariant($event)">
              @for (v of variants; track v) {
                <option [value]="v">{{ v }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Size</span>
            <select class="pg-select" [value]="pgSize()" (change)="setPgSize($event)">
              @for (s of sizes; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Label position</span>
            <select class="pg-select" [value]="pgLabelPos()" (change)="setPgLabelPos($event)">
              @for (p of labelPositions; track p) {
                <option [value]="p">{{ p }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Placeholder</span>
            <input
              class="pg-text"
              type="text"
              [value]="pgPlaceholder()"
              (input)="pgPlaceholder.set($any($event.target).value)"
            />
          </label>
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgClearable()"
              (change)="pgClearable.set($any($event.target).checked)"
            />
            <span>clearable</span>
          </label>
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgLoading()"
              (change)="pgLoading.set($any($event.target).checked)"
            />
            <span>loading</span>
          </label>
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgDisabled()"
              (change)="pgDisabled.set($any($event.target).checked)"
            />
            <span>disabled</span>
          </label>
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgRequired()"
              (change)="pgRequired.set($any($event.target).checked)"
            />
            <span>required</span>
          </label>
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgInvalid()"
              (change)="pgInvalid.set($any($event.target).checked)"
            />
            <span>invalid</span>
          </label>
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgWarn()"
              (change)="pgWarn.set($any($event.target).checked)"
            />
            <span>warn</span>
          </label>
        </div>
        <div class="pg-stage">
          <tulpar-select-ng
            class="field"
            [(value)]="pgValue"
            [variant]="pgVariant()"
            [size]="pgSize()"
            label="Framework"
            [labelPosition]="pgLabelPos()"
            [placeholder]="pgPlaceholder()"
            [clearable]="pgClearable()"
            [loading]="pgLoading()"
            [disabled]="pgDisabled()"
            [required]="pgRequired()"
            [invalid]="pgInvalid()"
            [warn]="pgWarn()"
            errorText="Selection is required"
            warnText="Heads up — double-check this one"
          >
            @for (f of frameworks; track f.value) {
              <tulpar-option-ng [value]="f.value" [label]="f.label" />
            }
          </tulpar-select-ng>
        </div>
        <div class="pg-value">
          value = <strong>{{ pgValue() || '(empty)' }}</strong>
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
          @for (v of variants; track v) {
            <tulpar-select-ng class="field" [variant]="v" [label]="v" placeholder="Choose a fruit">
              @for (o of fruits; track o.value) {
                <tulpar-option-ng [value]="o.value" [label]="o.label" />
              }
            </tulpar-select-ng>
          }
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
        @for (s of sizes; track s) {
          <div class="demo-row">
            <span class="row-label">{{ s }}</span>
            <div class="row-items">
              <tulpar-select-ng class="field" [size]="s" placeholder="Select a fruit">
                @for (o of fruits; track o.value) {
                  <tulpar-option-ng [value]="o.value" [label]="o.label" />
                }
              </tulpar-select-ng>
            </div>
          </div>
        }
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
          @for (p of labelPositions; track p) {
            <tulpar-select-ng
              class="field"
              label="Country"
              [labelPosition]="p"
              placeholder="Select a country"
            >
              @for (o of europe; track o.code) {
                <tulpar-option-ng [value]="o.code" [label]="o.name" />
              }
            </tulpar-select-ng>
          }
        </div>
      </div>
      <div class="dual-grid" style="margin-top: 16px">
        <div class="dual-card">
          <div class="dual-head">Label — prop form</div>
          <div class="dual-body">
            <tulpar-select-ng class="field" label="Prop label" placeholder="Select…">
              @for (o of europe; track o.code) {
                <tulpar-option-ng [value]="o.code" [label]="o.name" />
              }
            </tulpar-select-ng>
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Label — slot form</div>
          <div class="dual-body">
            <tulpar-select-ng class="field" placeholder="Select…">
              <span slot="label">Slot label</span>
              @for (o of europe; track o.code) {
                <tulpar-option-ng [value]="o.code" [label]="o.name" />
              }
            </tulpar-select-ng>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ labelPosCode }}</code></pre>
    </section>

    <!-- ── 5. Options ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Options — plain · icon · description</h2>
      <p class="section-desc">
        An option can be plain, carry a <code class="inline-code">slot="icon"</code> leading icon,
        or show a second <code class="inline-code">description</code> line. Each capability is shown
        in <strong>prop</strong> form AND <strong>slot</strong> form.
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (label · description)</div>
          <div class="dual-body">
            <tulpar-select-ng class="field" label="Language" placeholder="Pick a language">
              <tulpar-option-ng value="ts" label="TypeScript" />
              <tulpar-option-ng
                value="js"
                label="JavaScript"
                description="The language of the web"
              />
              <tulpar-option-ng value="py" label="Python" description="Batteries included" />
              <tulpar-option-ng value="rs" label="Rust" description="Fearless concurrency" />
            </tulpar-select-ng>
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (icon · label · description)</div>
          <div class="dual-body">
            <tulpar-select-ng class="field" label="Language" placeholder="Pick a language">
              <tulpar-option-ng value="ts">
                <span slot="icon" aria-hidden="true">🟦</span>
                TypeScript
                <span slot="description">Typed superset of JavaScript</span>
              </tulpar-option-ng>
              <tulpar-option-ng value="js">
                <span slot="icon" aria-hidden="true">🟨</span>
                JavaScript
                <span slot="description">The language of the web</span>
              </tulpar-option-ng>
              <tulpar-option-ng value="go">
                <span slot="icon" aria-hidden="true">🔵</span>
                Go
                <span slot="description">Simple, fast, concurrent</span>
              </tulpar-option-ng>
            </tulpar-select-ng>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ optionsCode }}</code></pre>
    </section>

    <!-- ── 6. Groups ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Groups</h2>
      <p class="section-desc">
        <code class="inline-code">tulpar-option-group-ng</code> bundles options under a sticky
        header (header via <code class="inline-code">label</code> prop OR
        <code class="inline-code">slot="label"</code>). One option inside is
        <code class="inline-code">disabled</code> — keyboard nav skips it.
      </p>
      <div class="preview">
        <tulpar-select-ng class="field--lg field" label="Destination" placeholder="Pick a city">
          <tulpar-option-group-ng label="Europe">
            <tulpar-option-ng value="ist" label="Istanbul" />
            <tulpar-option-ng value="ldn" label="London" />
            <tulpar-option-ng value="par" label="Paris" />
            <tulpar-option-ng value="ber" label="Berlin" />
          </tulpar-option-group-ng>
          <tulpar-option-group-ng>
            <span slot="label">Americas</span>
            <tulpar-option-ng value="nyc" label="New York" />
            <tulpar-option-ng value="sfo" label="San Francisco" />
            <tulpar-option-ng value="sao" label="São Paulo (sold out)" [disabled]="true" />
            <tulpar-option-ng value="yyz" label="Toronto" />
          </tulpar-option-group-ng>
          <tulpar-option-group-ng label="Asia-Pacific">
            <tulpar-option-ng value="tyo" label="Tokyo" />
            <tulpar-option-ng value="sin" label="Singapore" />
            <tulpar-option-ng value="syd" label="Sydney" />
          </tulpar-option-group-ng>
        </tulpar-select-ng>
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
            <tulpar-select-ng
              class="field"
              [clearable]="true"
              label="Optional pick"
              value="vue"
              placeholder="Pick a framework"
            >
              @for (f of frameworks; track f.value) {
                <tulpar-option-ng [value]="f.value" [label]="f.label" />
              }
            </tulpar-select-ng>
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">required</span>
          <div class="row-items">
            <tulpar-select-ng
              class="field"
              [clearable]="true"
              [required]="true"
              label="Required pick"
              value="angular"
              placeholder="Pick a framework"
            >
              @for (f of frameworks; track f.value) {
                <tulpar-option-ng [value]="f.value" [label]="f.label" />
              }
            </tulpar-select-ng>
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
          <tulpar-select-ng
            class="field"
            [invalid]="true"
            [required]="true"
            label="Plan"
            placeholder="Choose a plan"
            errorText="Please choose a plan"
          >
            <tulpar-option-ng value="free" label="Free" />
            <tulpar-option-ng value="pro" label="Pro" />
            <tulpar-option-ng value="ent" label="Enterprise" />
          </tulpar-select-ng>
          <tulpar-select-ng
            class="field"
            [warn]="true"
            label="Region"
            value="eu-west-1"
            warnText="Legacy region — migrate soon"
          >
            <tulpar-option-ng value="eu-west-1" label="eu-west-1 (legacy)" />
            <tulpar-option-ng value="eu-central-1" label="eu-central-1" />
            <tulpar-option-ng value="us-east-1" label="us-east-1" />
          </tulpar-select-ng>
          <tulpar-select-ng
            class="field"
            [required]="true"
            label="Role"
            placeholder="Select a role"
          >
            <tulpar-option-ng value="admin" label="Administrator" />
            <tulpar-option-ng value="editor" label="Editor" />
            <tulpar-option-ng value="viewer" label="Viewer" />
          </tulpar-select-ng>
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
          <tulpar-select-ng
            class="field"
            label="Empty"
            placeholder="No options yet"
            emptyText="No results found"
          />
          <tulpar-select-ng
            class="field"
            [loading]="true"
            label="Loading"
            placeholder="Fetching…"
            loadingText="Fetching options…"
          >
            <tulpar-option-ng value="a" label="A" />
            <tulpar-option-ng value="b" label="B" />
          </tulpar-select-ng>
          <tulpar-select-ng
            class="field"
            label="Error"
            placeholder="Open me"
            error="Failed to load options. Try again."
          >
            <tulpar-option-ng value="a" label="A" />
            <tulpar-option-ng value="b" label="B" />
          </tulpar-select-ng>
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
          <tulpar-select-ng
            class="field"
            label="Country (32 options)"
            placeholder="Select a country"
          >
            @for (c of countries; track c.code) {
              <tulpar-option-ng [value]="c.code" [label]="c.name" />
            }
          </tulpar-select-ng>
          <tulpar-select-ng
            class="field"
            label="Long labels (truncate)"
            placeholder="Select a region"
          >
            @for (c of longLabels; track c.code) {
              <tulpar-option-ng [value]="c.code" [label]="c.name" />
            }
          </tulpar-select-ng>
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
  `,
  styles: [PAGE_STYLES],
})
export class SelectDemoComponent {
  readonly pgHintCode = PG_HINT_CODE;
  readonly variantsCode = VARIANTS_CODE;
  readonly sizesCode = SIZES_CODE;
  readonly labelPosCode = LABEL_POS_CODE;
  readonly optionsCode = OPTIONS_CODE;
  readonly groupsCode = GROUPS_CODE;
  readonly clearableCode = CLEARABLE_CODE;
  readonly validationCode = VALIDATION_CODE;
  readonly statesCode = STATES_CODE;
  readonly longCode = LONG_CODE;

  readonly variants: FieldVariant[] = ['outlined', 'filled', 'underlined', 'ghost'];
  readonly sizes: FieldSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  readonly labelPositions: LabelPosition[] = ['top', 'float', 'float-in', 'float-on', 'none'];

  readonly countries = COUNTRIES;
  readonly longLabels = LONG_LABELS;
  readonly europe = COUNTRIES.slice(0, 8);

  readonly fruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'mango', label: 'Mango' },
    { value: 'orange', label: 'Orange' },
  ];

  readonly frameworks = [
    { value: 'angular', label: 'Angular' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'react', label: 'React' },
    { value: 'solid', label: 'Solid' },
    { value: 'qwik', label: 'Qwik' },
  ];

  // ── Live playground state ──────────────────────────────────────────────────
  readonly pgValue = signal<string>('');
  readonly pgVariant = signal<FieldVariant>('outlined');
  readonly pgSize = signal<FieldSize>('md');
  readonly pgLabelPos = signal<LabelPosition>('top');
  readonly pgPlaceholder = signal<string>('Pick a framework');
  readonly pgClearable = signal<boolean>(true);
  readonly pgLoading = signal<boolean>(false);
  readonly pgDisabled = signal<boolean>(false);
  readonly pgRequired = signal<boolean>(false);
  readonly pgInvalid = signal<boolean>(false);
  readonly pgWarn = signal<boolean>(false);

  setPgVariant(e: Event) {
    this.pgVariant.set((e.target as HTMLSelectElement).value as FieldVariant);
  }
  setPgSize(e: Event) {
    this.pgSize.set((e.target as HTMLSelectElement).value as FieldSize);
  }
  setPgLabelPos(e: Event) {
    this.pgLabelPos.set((e.target as HTMLSelectElement).value as LabelPosition);
  }
}
