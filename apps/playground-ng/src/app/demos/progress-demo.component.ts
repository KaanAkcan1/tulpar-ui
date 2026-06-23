import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  signal,
} from '@angular/core';
import {
  TulparProgressComponent,
  type ProgressVariant,
  type ProgressTone,
  type ProgressThickness,
  type ProgressSize,
} from '@tulpar-ui/angular';

// ─── Code snippet strings (outside @Component to avoid backtick nesting) ──────

const LINEAR_CODE = `<!-- linear determinate (value 0..max) + value label (true → "N%") -->
<tulpar-progress-ng [value]="42" [valueLabel]="true" />
<tulpar-progress-ng [value]="78" tone="success" [valueLabel]="true" />`;

const BUFFER_CODE = `<!-- linear with a secondary buffered value (e.g. video pre-load) -->
<tulpar-progress-ng [value]="40" [buffer]="65" />`;

const INDET_CODE = `<!-- indeterminate — one traveling bar / rotating arc, unknown duration -->
<tulpar-progress-ng indeterminate />
<tulpar-progress-ng variant="circular" indeterminate />`;

const THICKNESS_CODE = `<!-- thickness (linear): thin · regular (default) · thick -->
<tulpar-progress-ng [value]="60" thickness="thin" />
<tulpar-progress-ng [value]="60" thickness="regular" />
<tulpar-progress-ng [value]="60" thickness="thick" />`;

const TONES_CODE = `<!-- tones: default fill is brand green; built-in / custom recolor it -->
<tulpar-progress-ng [value]="60" tone="info" />
<tulpar-progress-ng [value]="60" tone="success" />
<tulpar-progress-ng [value]="60" tone="warning" />
<tulpar-progress-ng [value]="60" tone="danger" />
<tulpar-progress-ng [value]="60" tone="custom" color="ilay" />

<!-- stateTone: auto-promote to success once value >= max -->
<tulpar-progress-ng [value]="100" [stateTone]="true" [valueLabel]="true" />`;

const FLOW_CODE = `<!-- tone="flow": opt-in value-driven gradient (red → amber → green) -->
<!-- determinate only; same value maps to the same hue on linear + circular -->
<tulpar-progress-ng tone="flow" [value]="10" [valueLabel]="true" />
<tulpar-progress-ng tone="flow" [value]="50" [valueLabel]="true" />
<tulpar-progress-ng tone="flow" [value]="90" [valueLabel]="true" />

<tulpar-progress-ng variant="circular" tone="flow" [value]="35" [valueLabel]="true" />
<tulpar-progress-ng variant="circular" tone="flow" [value]="70" [valueLabel]="true" />`;

const CIRCULAR_CODE = `<!-- circular determinate + indeterminate; size: xs · sm · md (default) · lg · xl -->
<tulpar-progress-ng variant="circular" [value]="70" size="xs" tone="info" />
<tulpar-progress-ng variant="circular" [value]="70" size="md" tone="info" [valueLabel]="true" />
<tulpar-progress-ng variant="circular" [value]="70" size="xl" tone="info" [valueLabel]="true" />
<tulpar-progress-ng variant="circular" indeterminate />`;

const FORMATTER_CODE = `// custom formatter (function form of valueLabel) — also seeds aria-valuetext
formatStep = (v: number, min: number, max: number) => \`\${v}/\${max} steps\`;

<tulpar-progress-ng variant="circular" [value]="3" [max]="5" [valueLabel]="formatStep" />`;

const DUAL_CODE = `<!-- LABEL — prop (valueLabel) vs slot (descriptive text) -->
<tulpar-progress-ng [value]="55" [valueLabel]="true" />
<tulpar-progress-ng [value]="55"><span slot="label">Uploading…</span></tulpar-progress-ng>`;

// ─── Shared page-shell styles (mirrors toast-demo) ────────────────────────────

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
    align-items: center;
  }
  .preview--col { flex-direction: column; align-items: stretch; gap: 0; }

  .demo-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid
      color-mix(in srgb, var(--tulpar-color-border-default, #d9e0df) 55%, transparent);
  }
  .demo-row:first-child { padding-top: 0; }
  .demo-row:last-child { border-bottom: none; padding-bottom: 0; }
  .demo-row--top { align-items: flex-start; }

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
  .av-baseline { align-items: flex-end; }

  /* ── Progress specifics ───────────────────────────────────────────────── */
  .progress-stack {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    max-width: 360px;
  }
  .progress-circ-row { gap: 24px; }
  .progress-live { align-items: center; gap: 14px; }
  .progress-live-bars { align-items: center; gap: 28px; }
  .progress-slider {
    width: 240px;
    max-width: 100%;
    accent-color: var(--tulpar-color-brand-default, #00c57a);
  }
  .progress-value {
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
    font-size: 13px;
    font-weight: 600;
    color: var(--tulpar-color-text-primary, #15110b);
    min-width: 48px;
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
  .dual-body {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 18px 16px;
    max-width: 320px;
  }
  .dual-note { font-size: 11px; color: var(--tulpar-color-text-muted, #74777a); }

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
    align-items: center;
    gap: 28px;
    min-height: 64px;
    padding: 8px 0;
  }
  .pg-stage .pg-linear { flex: 1; min-width: 220px; max-width: 360px; }

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
  selector: 'app-progress-demo',
  standalone: true,
  imports: [TulparProgressComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
        <code class="inline-code">slot="label"</code> form.
      </p>
    </header>

    <!-- ── 1. Live playground ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Live playground</h2>
      <p class="section-desc">
        Drive value, variant, tone, thickness/size, and the indeterminate / valueLabel toggles. Pick
        <code class="inline-code">flow</code> and drag the value slider to watch the fill colour
        flow red → amber → green. The snippet updates live.
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
              [value]="pgValue()"
              (input)="onPgInput($event)"
              [disabled]="pgIndeterminate()"
              aria-label="Playground value"
            />
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Variant</span>
            <select class="pg-select" [value]="pgVariant()" (change)="setPgVariant($event)">
              @for (v of variants; track v) {
                <option [value]="v">{{ v }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Tone</span>
            <select class="pg-select" [value]="pgTone()" (change)="setPgTone($event)">
              @for (t of pgTones; track t) {
                <option [value]="t" [selected]="t === pgTone()">{{ t }}</option>
              }
            </select>
          </label>
          @if (pgVariant() === 'linear') {
            <label class="pg-field">
              <span class="pg-field-label">Thickness</span>
              <select class="pg-select" [value]="pgThickness()" (change)="setPgThickness($event)">
                @for (t of thicknesses; track t) {
                  <option [value]="t">{{ t }}</option>
                }
              </select>
            </label>
          } @else {
            <label class="pg-field">
              <span class="pg-field-label">Size</span>
              <select class="pg-select" [value]="pgSize()" (change)="setPgSize($event)">
                @for (s of sizes; track s) {
                  <option [value]="s">{{ s }}</option>
                }
              </select>
            </label>
          }
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgIndeterminate()"
              (change)="pgIndeterminate.set($any($event.target).checked)"
            />
            <span>indeterminate</span>
          </label>
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgValueLabel()"
              (change)="pgValueLabel.set($any($event.target).checked)"
            />
            <span>valueLabel</span>
          </label>
        </div>
        <div class="pg-stage">
          @if (pgVariant() === 'linear') {
            <div class="pg-linear">
              <tulpar-progress-ng
                variant="linear"
                [value]="pgValue()"
                [tone]="pgTone()"
                [thickness]="pgThickness()"
                [indeterminate]="pgIndeterminate()"
                [valueLabel]="pgValueLabel()"
              />
            </div>
          } @else {
            <tulpar-progress-ng
              variant="circular"
              [value]="pgValue()"
              [tone]="pgTone()"
              [size]="pgSize()"
              [indeterminate]="pgIndeterminate()"
              [valueLabel]="pgValueLabel()"
            />
          }
          @if (!pgIndeterminate()) {
            <span class="progress-value">{{ pgValue() }}%</span>
          }
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet() }}</code></pre>
    </section>

    <!-- ── 2. Live driver ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Live driver</h2>
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
              [value]="liveValue()"
              (input)="onLiveInput($event)"
              aria-label="Progress value"
            />
            <span class="progress-value">{{ liveValue() }}%</span>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">&nbsp;</span>
          <div class="row-items progress-live-bars">
            <div style="flex:1; min-width:220px; max-width:360px">
              <tulpar-progress-ng [value]="liveValue()" [valueLabel]="true" />
            </div>
            <tulpar-progress-ng
              variant="circular"
              [value]="liveValue()"
              [valueLabel]="true"
              size="md"
            />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ linearCode }}</code></pre>
    </section>

    <!-- ── 3. Linear determinate ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Linear determinate</h2>
      <p class="section-desc">
        A horizontal bar fills from <code class="inline-code">min</code> to
        <code class="inline-code">max</code>. <code class="inline-code">valueLabel="true"</code>
        renders a trailing percentage.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">linear</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [value]="42" [valueLabel]="true" />
            <tulpar-progress-ng [value]="78" tone="success" [valueLabel]="true" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ linearCode }}</code></pre>
    </section>

    <!-- ── 4. Buffer ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Buffer</h2>
      <p class="section-desc">
        <code class="inline-code">buffer</code> draws a fainter secondary fill ahead of the primary
        <code class="inline-code">value</code> — for buffered media or chunked uploads.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">buffer</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [value]="40" [buffer]="65" />
            <tulpar-progress-ng [value]="20" [buffer]="90" tone="info" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ bufferCode }}</code></pre>
    </section>

    <!-- ── 5. Indeterminate ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Indeterminate</h2>
      <p class="section-desc">
        When the duration is unknown, omit <code class="inline-code">value</code> and set
        <code class="inline-code">indeterminate</code> — a traveling bar (linear) or rotating arc
        (circular).
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">linear</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [indeterminate]="true" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">circular</span>
          <div class="row-items">
            <tulpar-progress-ng variant="circular" [indeterminate]="true" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ indetCode }}</code></pre>
    </section>

    <!-- ── 6. Thickness ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Thickness</h2>
      <p class="section-desc">
        Linear bars come in <code class="inline-code">thin</code> ·
        <code class="inline-code">regular</code> (default) · <code class="inline-code">thick</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">thickness</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [value]="60" thickness="thin" />
            <tulpar-progress-ng [value]="60" thickness="regular" />
            <tulpar-progress-ng [value]="60" thickness="thick" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ thicknessCode }}</code></pre>
    </section>

    <!-- ── 7. Tones & stateTone ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Tones &amp; stateTone</h2>
      <p class="section-desc">
        The default fill is brand green; built-in and custom tones recolor it.
        <code class="inline-code">stateTone</code> auto-promotes the fill to success once
        <code class="inline-code">value &gt;= max</code> (an explicit danger tone always wins).
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">tones</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [value]="60" tone="info" [valueLabel]="true" />
            <tulpar-progress-ng [value]="60" tone="warning" [valueLabel]="true" />
            <tulpar-progress-ng [value]="60" tone="danger" [valueLabel]="true" />
            <tulpar-progress-ng [value]="60" tone="custom" color="ilay" [valueLabel]="true" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">stateTone</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [value]="100" [stateTone]="true" [valueLabel]="true" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ tonesCode }}</code></pre>
    </section>

    <!-- ── 8. Value-driven tone flow ──────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Value-driven tone flow</h2>
      <p class="section-desc">
        <code class="inline-code">tone="flow"</code> is an opt-in, value-driven gradient: the fill
        flows continuously from red at <code class="inline-code">0</code> through amber at
        <code class="inline-code">~50</code> to green at <code class="inline-code">100</code> — a
        perceptual oklab interpolation across our <em>al → ulgen → otuken</em> palette. It is
        determinate-only (an indeterminate bar has no value to map, so it falls back to brand green)
        and purely visual — accessibility is unchanged. The same value maps to the same hue on both
        the linear bar and the circular ring.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">linear</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng tone="flow" [value]="10" [valueLabel]="true" />
            <tulpar-progress-ng tone="flow" [value]="35" [valueLabel]="true" />
            <tulpar-progress-ng tone="flow" [value]="50" [valueLabel]="true" />
            <tulpar-progress-ng tone="flow" [value]="70" [valueLabel]="true" />
            <tulpar-progress-ng tone="flow" [value]="90" [valueLabel]="true" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">circular</span>
          <div class="row-items av-baseline progress-circ-row">
            <tulpar-progress-ng variant="circular" tone="flow" [value]="10" [valueLabel]="true" />
            <tulpar-progress-ng variant="circular" tone="flow" [value]="35" [valueLabel]="true" />
            <tulpar-progress-ng variant="circular" tone="flow" [value]="50" [valueLabel]="true" />
            <tulpar-progress-ng variant="circular" tone="flow" [value]="70" [valueLabel]="true" />
            <tulpar-progress-ng variant="circular" tone="flow" [value]="90" [valueLabel]="true" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ flowCode }}</code></pre>
    </section>

    <!-- ── 9. Circular ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Circular</h2>
      <p class="section-desc">
        The circular variant takes the same value model in five sizes:
        <code class="inline-code">xs</code> · <code class="inline-code">sm</code> ·
        <code class="inline-code">md</code> (default) · <code class="inline-code">lg</code> ·
        <code class="inline-code">xl</code>. <code class="inline-code">valueLabel</code> renders
        centered.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline progress-circ-row">
            <tulpar-progress-ng variant="circular" [value]="70" size="xs" tone="info" />
            <tulpar-progress-ng variant="circular" [value]="70" size="sm" tone="info" />
            <tulpar-progress-ng
              variant="circular"
              [value]="70"
              size="md"
              tone="info"
              [valueLabel]="true"
            />
            <tulpar-progress-ng
              variant="circular"
              [value]="70"
              size="lg"
              tone="info"
              [valueLabel]="true"
            />
            <tulpar-progress-ng
              variant="circular"
              [value]="70"
              size="xl"
              tone="info"
              [valueLabel]="true"
            />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">states</span>
          <div class="row-items av-baseline progress-circ-row">
            <tulpar-progress-ng variant="circular" [value]="55" [valueLabel]="true" />
            <tulpar-progress-ng variant="circular" [indeterminate]="true" />
            <tulpar-progress-ng
              variant="circular"
              [value]="100"
              size="lg"
              tone="success"
              [valueLabel]="true"
            />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ circularCode }}</code></pre>
    </section>

    <!-- ── 10. Custom formatter ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Custom value formatter</h2>
      <p class="section-desc">
        Pass a function to <code class="inline-code">valueLabel</code> for non-percentage labels
        (steps, bytes, ratios). The function form is property-only — the wrapper sets it as a DOM
        property — and it also seeds <code class="inline-code">aria-valuetext</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">formatter</span>
          <div class="row-items av-baseline progress-circ-row">
            <tulpar-progress-ng
              variant="circular"
              [value]="3"
              [max]="5"
              size="lg"
              [valueLabel]="formatStep"
            />
            <span class="dual-note">{{ stepFormatterNote }}</span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ formatterCode }}</code></pre>
    </section>

    <!-- ── 11. Prop vs slot — label ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">11. Content — label (prop &amp; slot)</h2>
      <p class="section-desc">
        The numeric label is the <code class="inline-code">valueLabel</code> prop; a descriptive
        text label above / beside the bar is the <code class="inline-code">slot="label"</code>. Use
        both together where it helps.
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (valueLabel)</div>
          <div class="dual-body">
            <tulpar-progress-ng [value]="55" [valueLabel]="true" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (label)</div>
          <div class="dual-body">
            <tulpar-progress-ng [value]="55">
              <span slot="label">Uploading…</span>
            </tulpar-progress-ng>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualCode }}</code></pre>
    </section>

    <!-- ── 12. Accessibility ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">12. Accessibility</h2>
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
          <strong>Label the bar.</strong> Use the <code class="inline-code">slot="label"</code> (or
          an external label) so the progress has an accessible name describing what is progressing.
        </div>
        <div class="a11y-note">
          <strong>Reduced motion + dark mode.</strong> The indeterminate animation honours
          <code class="inline-code">prefers-reduced-motion</code>; tones flip under
          <code class="inline-code">.dark</code>.
        </div>
      </div>
    </section>
  `,
  styles: [PAGE_STYLES],
})
export class ProgressDemoComponent {
  readonly linearCode = LINEAR_CODE;
  readonly bufferCode = BUFFER_CODE;
  readonly indetCode = INDET_CODE;
  readonly thicknessCode = THICKNESS_CODE;
  readonly tonesCode = TONES_CODE;
  readonly flowCode = FLOW_CODE;
  readonly circularCode = CIRCULAR_CODE;
  readonly formatterCode = FORMATTER_CODE;
  readonly dualCode = DUAL_CODE;

  /** Inline caption for the circular formatter example (avoids raw braces in template). */
  readonly stepFormatterNote = '(v, min, max) => `${v}/${max} steps`';

  readonly variants: ProgressVariant[] = ['linear', 'circular'];
  /** Tones for the live playground — includes the value-driven `flow` gradient. */
  readonly pgTones: ProgressTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'flow'];
  readonly thicknesses: ProgressThickness[] = ['thin', 'regular', 'thick'];
  readonly sizes: ProgressSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

  /** Formatter for the circular step example (function form of valueLabel). */
  readonly formatStep = (value: number, _min: number, max: number): string =>
    `${value}/${max} steps`;

  // ── 2. Live driver ────────────────────────────────────────────────────────
  readonly liveValue = signal<number>(60);
  onLiveInput(e: Event): void {
    this.liveValue.set(Number((e.target as HTMLInputElement).value));
  }

  // ── 1. Live playground state ───────────────────────────────────────────────
  readonly pgValue = signal<number>(45);
  readonly pgVariant = signal<ProgressVariant>('linear');
  readonly pgTone = signal<ProgressTone>('flow');
  // NOTE: default is `flow` so the page opens demonstrating the value-driven sweep;
  // the <select> below is kept in sync via an explicit [selected] per-option binding.
  readonly pgThickness = signal<ProgressThickness>('regular');
  readonly pgSize = signal<ProgressSize>('md');
  readonly pgIndeterminate = signal<boolean>(false);
  readonly pgValueLabel = signal<boolean>(true);

  onPgInput(e: Event): void {
    this.pgValue.set(Number((e.target as HTMLInputElement).value));
  }
  setPgVariant(e: Event) {
    this.pgVariant.set((e.target as HTMLSelectElement).value as ProgressVariant);
  }
  setPgTone(e: Event) {
    this.pgTone.set((e.target as HTMLSelectElement).value as ProgressTone);
  }
  setPgThickness(e: Event) {
    this.pgThickness.set((e.target as HTMLSelectElement).value as ProgressThickness);
  }
  setPgSize(e: Event) {
    this.pgSize.set((e.target as HTMLSelectElement).value as ProgressSize);
  }

  readonly pgSnippet = computed(() => {
    const variant = this.pgVariant();
    const indet = this.pgIndeterminate();
    const tone = ` tone="${this.pgTone()}"`;
    const vl = this.pgValueLabel() ? ' [valueLabel]="true"' : '';
    const sizing =
      variant === 'linear' ? ` thickness="${this.pgThickness()}"` : ` size="${this.pgSize()}"`;
    if (indet) {
      return `<tulpar-progress-ng variant="${variant}"${tone}${sizing} indeterminate />`;
    }
    return `<tulpar-progress-ng variant="${variant}" [value]="${this.pgValue()}"${tone}${sizing}${vl} />`;
  });
}
