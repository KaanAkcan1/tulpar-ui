import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  signal,
} from '@angular/core';
import {
  TulparChipComponent,
  type ChipVariant,
  type ChipShape,
  type ChipSize,
} from '@tulpar-ui/angular';

// ─── Code snippet strings (outside @Component to avoid backtick nesting) ──────

const CLICK_CODE = `// clickable — body is operable (click / Enter / Space) → (clicked) output
<tulpar-chip-ng tone="neutral" label="All"  (clicked)="log('clicked: All')" />
<tulpar-chip-ng tone="info"  icon="●" label="Open" (clicked)="log('clicked: Open')" />
<tulpar-chip-ng tone="success" label="Done" (clicked)="log('clicked: Done')" />`;

const REMOVE_CODE = `// removable — the ✕ is an INDEPENDENT tab stop → (removed) output
<tulpar-chip-ng label="kaan@x.com" removable (removed)="log('removed: kaan@x.com')" />

// avatar + removable (the chip carries an avatar prop)
<tulpar-chip-ng label="Jane Doe" avatar="JD" removable
                (removed)="log('removed: Jane Doe')" />`;

const VARIANTS_CODE = `// variant: soft-tonal (default) · outline · solid · ghost
<tulpar-chip-ng tone="info" variant="soft-tonal" label="Soft tonal" />
<tulpar-chip-ng tone="info" variant="outline"    label="Outline" />
<tulpar-chip-ng tone="info" variant="solid"      label="Solid" />
// ghost — transparent at rest, soft-tonal on hover (toolbar filters)
<tulpar-chip-ng tone="info" variant="ghost"      label="Ghost" />`;

const STATE_CODE = `// disabled — fires nothing, not focusable, dimmed
<tulpar-chip-ng label="Archived" disabled />
<tulpar-chip-ng label="Read-only" removable disabled />`;

const SHAPES_SIZES_CODE = `// shape: square (default) · pill · sharp
<tulpar-chip-ng tone="info" shape="square" label="square" />
<tulpar-chip-ng tone="info" shape="pill"   label="pill" />
<tulpar-chip-ng tone="info" shape="sharp"  label="sharp" />

// size: xs · sm · md (default) · lg · xl
<tulpar-chip-ng tone="success" size="xs" label="xs" />
<tulpar-chip-ng tone="success" size="xl" label="xl" />`;

const CUSTOM_CODE = `// tone="custom" + color: brand family (mode-aware) OR any raw CSS color
<tulpar-chip-ng tone="custom" color="ilay" label="ilay" />
<tulpar-chip-ng tone="custom" color="gok"  label="gok" />
<tulpar-chip-ng tone="custom" color="#0d9488" label="#0d9488" />`;

const DUAL_LABEL_CODE = `<!-- LABEL — prop vs slot (slot wins when both set) -->
<tulpar-chip-ng tone="info" label="Prop label" />
<tulpar-chip-ng tone="info">Slot label</tulpar-chip-ng>`;

const DUAL_ICON_CODE = `<!-- ICON — prop (raw SVG / emoji) vs slot -->
<tulpar-chip-ng tone="success" icon="✓" label="Prop icon" />
<tulpar-chip-ng tone="success" label="Slot icon">
  <svg slot="icon" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="2"><path d="M3 8l3.5 3.5L13 4"/></svg>
</tulpar-chip-ng>`;

const DUAL_AVATAR_CODE = `<!-- AVATAR — prop (initials / image URL) vs slot -->
<tulpar-chip-ng label="Prop avatar" avatar="KA" />
<tulpar-chip-ng label="Slot avatar">
  <span slot="avatar">🦄</span>
</tulpar-chip-ng>`;

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
  .event-log-clear:hover { background: var(--tulpar-color-bg-subtle, #e9f1ef); }
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
    font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
    font-size: 12px;
  }
  .event-log-time { color: var(--tulpar-color-text-muted, #74777a); flex: none; }
  .event-log-msg { color: var(--tulpar-color-text-primary, #15110b); }

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
    gap: 16px;
    min-height: 56px;
    padding: 8px 0;
  }

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
  selector: 'app-chip-demo',
  standalone: true,
  imports: [TulparChipComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
            <select class="pg-select" [value]="pgTone()" (change)="setPgTone($event)">
              @for (t of tones; track t) {
                <option [value]="t">{{ t }}</option>
              }
            </select>
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
            <span class="pg-field-label">Shape</span>
            <select class="pg-select" [value]="pgShape()" (change)="setPgShape($event)">
              @for (s of shapes; track s) {
                <option [value]="s">{{ s }}</option>
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
          @if (pgTone() === 'custom') {
            <label class="pg-field">
              <span class="pg-field-label">Color</span>
              <select class="pg-select" [value]="pgColor()" (change)="setPgColor($event)">
                @for (c of customColors; track c) {
                  <option [value]="c">{{ c }}</option>
                }
              </select>
            </label>
          }
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgRemovable()"
              (change)="pgRemovable.set($any($event.target).checked)"
            />
            <span>removable</span>
          </label>
          <label class="pg-check">
            <input
              type="checkbox"
              [checked]="pgDisabled()"
              (change)="pgDisabled.set($any($event.target).checked)"
            />
            <span>disabled</span>
          </label>
        </div>
        <div class="pg-stage">
          <tulpar-chip-ng
            [tone]="pgTone()"
            [color]="pgTone() === 'custom' ? pgColor() : undefined"
            [variant]="pgVariant()"
            [shape]="pgShape()"
            [size]="pgSize()"
            [removable]="pgRemovable()"
            [disabled]="pgDisabled()"
            label="Live chip"
            (clicked)="logChip('clicked: Live chip')"
            (removed)="logChip('removed: Live chip')"
          />
        </div>

        <!-- Event log -->
        <div class="event-log" aria-live="polite">
          <div class="event-log-head">
            <span class="event-log-title">Event log</span>
            <button class="event-log-clear" type="button" (click)="clearLog()">Clear</button>
          </div>
          @if (chipEvents().length === 0) {
            <div class="event-log-empty">
              Click a chip or its ✕ to log clicked / removed events…
            </div>
          } @else {
            <ul class="event-log-list">
              @for (e of chipEvents(); track e.id) {
                <li class="event-log-item">
                  <span class="event-log-time">{{ e.time }}</span>
                  <span class="event-log-msg">{{ e.msg }}</span>
                </li>
              }
            </ul>
          }
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet() }}</code></pre>
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
            <tulpar-chip-ng tone="neutral" label="All" (clicked)="logChip('clicked: All')" />
            <tulpar-chip-ng
              tone="info"
              icon="●"
              label="Open"
              (clicked)="logChip('clicked: Open')"
            />
            <tulpar-chip-ng tone="success" label="Done" (clicked)="logChip('clicked: Done')" />
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
            <tulpar-chip-ng
              label="kaan@x.com"
              [removable]="true"
              (removed)="logChip('removed: kaan@x.com')"
            />
            <tulpar-chip-ng
              label="Jane Doe"
              avatar="JD"
              [removable]="true"
              (removed)="logChip('removed: Jane Doe')"
            />
            <tulpar-chip-ng
              tone="info"
              label="design"
              [removable]="true"
              (clicked)="logChip('clicked: design')"
              (removed)="logChip('removed: design')"
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
        @for (v of variants; track v) {
          <div class="demo-row">
            <span class="row-label">{{ v }}</span>
            <div class="row-items">
              <tulpar-chip-ng
                tone="neutral"
                [variant]="v"
                label="Status"
                (clicked)="logChip('clicked: ' + v)"
              />
              <tulpar-chip-ng
                tone="info"
                [variant]="v"
                label="Owner"
                (clicked)="logChip('clicked: ' + v)"
              />
              <tulpar-chip-ng
                tone="success"
                [variant]="v"
                label="Label"
                (clicked)="logChip('clicked: ' + v)"
              />
            </div>
          </div>
        }
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
            <tulpar-chip-ng
              label="Archived"
              [disabled]="true"
              (clicked)="logChip('SHOULD NOT FIRE')"
            />
            <tulpar-chip-ng
              label="Read-only"
              [removable]="true"
              [disabled]="true"
              (removed)="logChip('SHOULD NOT FIRE')"
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
            <tulpar-chip-ng tone="info" shape="square" label="square" />
            <tulpar-chip-ng tone="info" shape="pill" label="pill" />
            <tulpar-chip-ng tone="info" shape="sharp" label="sharp" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline">
            <tulpar-chip-ng tone="success" size="xs" label="xs" />
            <tulpar-chip-ng tone="success" size="sm" label="sm" />
            <tulpar-chip-ng tone="success" size="md" label="md" />
            <tulpar-chip-ng tone="success" size="lg" label="lg" />
            <tulpar-chip-ng tone="success" size="xl" label="xl" />
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
            <tulpar-chip-ng tone="custom" color="ilay" label="ilay" />
            <tulpar-chip-ng tone="custom" color="umay" label="umay" />
            <tulpar-chip-ng tone="custom" color="gok" label="gok" />
            <tulpar-chip-ng tone="custom" color="ulgen" label="ulgen" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">raw css</span>
          <div class="row-items">
            <tulpar-chip-ng tone="custom" color="#0d9488" label="#0d9488" />
            <tulpar-chip-ng
              tone="custom"
              bg="#fdf4ff"
              accent="#9333ea"
              text="#3b0764"
              label="parts"
            />
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
            <tulpar-chip-ng tone="info" label="Prop label" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <tulpar-chip-ng tone="info">Slot label</tulpar-chip-ng>
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
        <code class="inline-code">slot="icon"</code> (any node).
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (icon)</div>
          <div class="dual-body">
            <tulpar-chip-ng tone="success" icon="✓" label="Prop icon" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (icon)</div>
          <div class="dual-body">
            <tulpar-chip-ng tone="success" label="Slot icon">
              <svg
                slot="icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 8l3.5 3.5L13 4" />
              </svg>
            </tulpar-chip-ng>
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
        or <code class="inline-code">slot="avatar"</code> (any node).
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (avatar)</div>
          <div class="dual-body">
            <tulpar-chip-ng label="Prop avatar" avatar="KA" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (avatar)</div>
          <div class="dual-body">
            <tulpar-chip-ng label="Slot avatar">
              <span slot="avatar">🦄</span>
            </tulpar-chip-ng>
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
  `,
  styles: [PAGE_STYLES],
})
export class ChipDemoComponent {
  readonly clickCode = CLICK_CODE;
  readonly removeCode = REMOVE_CODE;
  readonly variantsCode = VARIANTS_CODE;
  readonly stateCode = STATE_CODE;
  readonly shapesSizesCode = SHAPES_SIZES_CODE;
  readonly customCode = CUSTOM_CODE;
  readonly dualLabelCode = DUAL_LABEL_CODE;
  readonly dualIconCode = DUAL_ICON_CODE;
  readonly dualAvatarCode = DUAL_AVATAR_CODE;

  readonly tones = ['neutral', 'info', 'success', 'warning', 'danger', 'custom'] as const;
  readonly variants: ChipVariant[] = ['soft-tonal', 'outline', 'solid', 'ghost'];
  readonly shapes: ChipShape[] = ['square', 'pill', 'sharp'];
  readonly sizes: ChipSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  readonly customColors = ['ilay', 'umay', 'gok', 'ulgen', 'kizagan', 'erlik', '#0d9488'] as const;

  // ── Event log ───────────────────────────────────────────────────────────────
  private _eventId = 0;
  readonly chipEvents = signal<{ id: number; time: string; msg: string }[]>([]);

  logChip(msg: string): void {
    const time = new Date().toLocaleTimeString(undefined, {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.chipEvents.update((list) => [{ id: ++this._eventId, time, msg }, ...list].slice(0, 30));
  }

  clearLog(): void {
    this.chipEvents.set([]);
  }

  // ── Live playground state ──────────────────────────────────────────────────
  readonly pgTone = signal<string>('info');
  readonly pgVariant = signal<ChipVariant>('soft-tonal');
  readonly pgShape = signal<ChipShape>('square');
  readonly pgSize = signal<ChipSize>('md');
  readonly pgColor = signal<string>('ilay');
  readonly pgRemovable = signal<boolean>(true);
  readonly pgDisabled = signal<boolean>(false);

  setPgTone(e: Event) {
    this.pgTone.set((e.target as HTMLSelectElement).value);
  }
  setPgVariant(e: Event) {
    this.pgVariant.set((e.target as HTMLSelectElement).value as ChipVariant);
  }
  setPgShape(e: Event) {
    this.pgShape.set((e.target as HTMLSelectElement).value as ChipShape);
  }
  setPgSize(e: Event) {
    this.pgSize.set((e.target as HTMLSelectElement).value as ChipSize);
  }
  setPgColor(e: Event) {
    this.pgColor.set((e.target as HTMLSelectElement).value);
  }

  readonly pgSnippet = computed(() => {
    const tone = this.pgTone();
    const colorAttr = tone === 'custom' ? ` color="${this.pgColor()}"` : '';
    const rm = this.pgRemovable() ? ' removable' : '';
    const dis = this.pgDisabled() ? ' disabled' : '';
    return `<tulpar-chip-ng tone="${tone}"${colorAttr} variant="${this.pgVariant()}" shape="${this.pgShape()}" size="${this.pgSize()}"${rm}${dis} label="Live chip"\n  (clicked)="log('clicked')" (removed)="log('removed')" />`;
  });
}
