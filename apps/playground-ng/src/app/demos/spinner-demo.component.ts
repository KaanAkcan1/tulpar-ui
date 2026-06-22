import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  signal,
} from '@angular/core';
import { TulparSpinnerComponent, type SpinnerSize, type SpinnerTone } from '@tulpar-ui/angular';

// ─── Code snippet strings (outside @Component to avoid backtick nesting) ──────

const SIZES_CODE = `<!-- size: xs · sm · md (default) · lg · xl -->
<tulpar-spinner-ng size="xs" label="Loading" />
<tulpar-spinner-ng size="sm" label="Loading" />
<tulpar-spinner-ng size="md" label="Loading" />
<tulpar-spinner-ng size="lg" label="Loading" />
<tulpar-spinner-ng size="xl" label="Loading" />`;

const TONES_CODE = `<!-- omit tone → inherits currentColor; built-in tones colorize -->
<tulpar-spinner-ng tone="neutral" label="Loading" />
<tulpar-spinner-ng tone="info"    label="Loading" />
<tulpar-spinner-ng tone="success" label="Loading" />
<tulpar-spinner-ng tone="warning" label="Loading" />
<tulpar-spinner-ng tone="danger"  label="Loading" />
<!-- custom tone -->
<tulpar-spinner-ng tone="custom" color="ilay" label="Loading" />`;

const INHERIT_CODE = `<!-- No tone → arc inherits the surrounding currentColor -->
<span style="color: #9333ea">
  <tulpar-spinner-ng label="Loading" />
</span>`;

const TRACK_CODE = `<!-- track ring (default true). [track]="false" → arc only -->
<tulpar-spinner-ng tone="info" [track]="true"  label="Loading" />
<tulpar-spinner-ng tone="info" [track]="false" label="Loading" />`;

const DELAY_CODE = `<!-- delay (ms) defers the render to avoid flashing on fast loads -->
@if (show()) {
  <tulpar-spinner-ng tone="info" [delay]="500" label="Loading" />
}
// If the data arrives before 500ms, the spinner never paints.`;

const DUAL_CODE = `<!-- accessible label — prop vs slot (visually hidden; slot wins) -->
<tulpar-spinner-ng label="Loading…" />
<tulpar-spinner-ng><span slot="label">Saving changes…</span></tulpar-spinner-ng>`;

const INLINE_CODE = `<!-- Inline inside a button while an async action runs -->
<button class="btn" disabled>
  <tulpar-spinner-ng size="xs" label="Saving" />
  Saving…
</button>`;

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
    gap: 16px;
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
  .dual-note { font-size: 11px; color: var(--tulpar-color-text-muted, #74777a); }

  /* ── Inline-in-button demo ────────────────────────────────────────────── */
  .inline-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    padding: 9px 16px;
    border-radius: 8px;
    border: none;
    background: var(--tulpar-color-brand-default, #00c57a);
    color: #fff;
    cursor: default;
  }
  .inherit-swatch { color: #9333ea; display: inline-flex; align-items: center; }

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
    min-height: 64px;
    padding: 8px 0;
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
  }
  .trigger-btn:hover { transform: translateY(-1px); box-shadow: 0 3px 8px -2px rgba(16, 24, 40, 0.12); }

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
  selector: 'app-spinner-demo',
  standalone: true,
  imports: [TulparSpinnerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Display &amp; Status</span>
      <h1 class="page-title">Spinner</h1>
      <p class="page-lede">
        An indeterminate loader — a round-cap quarter-arc rotating at a steady cadence over a faint
        track ring. Omitting <code class="inline-code">tone</code> inherits
        <code class="inline-code">currentColor</code> (so it tints to wherever it sits); built-in
        tones colorize it. <code class="inline-code">[track]="false"</code> drops the track ring,
        and <code class="inline-code">delay</code> defers the render to avoid flashing on fast
        loads. The accessible label is visually hidden and has both a prop and a slot form.
      </p>
    </header>

    <!-- ── 1. Sizes ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Sizes</h2>
      <p class="section-desc">
        Five tiers from <code class="inline-code">xs</code> to <code class="inline-code">xl</code>.
        The stroke width scales proportionally with the diameter.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline">
            <tulpar-spinner-ng size="xs" label="Loading" />
            <tulpar-spinner-ng size="sm" label="Loading" />
            <tulpar-spinner-ng size="md" label="Loading" />
            <tulpar-spinner-ng size="lg" label="Loading" />
            <tulpar-spinner-ng size="xl" label="Loading" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 2. Tones ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Tones</h2>
      <p class="section-desc">
        Built-in tones colorize the arc; <code class="inline-code">custom</code> +
        <code class="inline-code">color</code> takes a brand family or any CSS color.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">tones</span>
          <div class="row-items">
            <tulpar-spinner-ng tone="neutral" label="Loading" />
            <tulpar-spinner-ng tone="info" label="Loading" />
            <tulpar-spinner-ng tone="success" label="Loading" />
            <tulpar-spinner-ng tone="warning" label="Loading" />
            <tulpar-spinner-ng tone="danger" label="Loading" />
            <tulpar-spinner-ng tone="custom" color="ilay" label="Loading" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ tonesCode }}</code></pre>
    </section>

    <!-- ── 3. Inherit currentColor ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Inherit currentColor</h2>
      <p class="section-desc">
        With no <code class="inline-code">tone</code>, the arc inherits the surrounding text colour
        — so a spinner inside coloured text or a coloured button just works, no prop needed.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">inherit</span>
          <div class="row-items">
            <span class="inherit-swatch"><tulpar-spinner-ng label="Loading" /></span>
            <span style="color:#16876a; display:inline-flex"
              ><tulpar-spinner-ng label="Loading"
            /></span>
            <span style="color:#c0322b; display:inline-flex"
              ><tulpar-spinner-ng label="Loading"
            /></span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ inheritCode }}</code></pre>
    </section>

    <!-- ── 4. Track ring ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Track ring</h2>
      <p class="section-desc">
        The faint full-circle track behind the arc is on by default. Drop it with
        <code class="inline-code">[track]="false"</code> for a bare arc.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">track</span>
          <div class="row-items av-baseline">
            <tulpar-spinner-ng tone="info" size="lg" [track]="true" label="Loading" />
            <tulpar-spinner-ng tone="info" size="lg" [track]="false" label="Loading" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ trackCode }}</code></pre>
    </section>

    <!-- ── 5. Delay ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Delay</h2>
      <p class="section-desc">
        <code class="inline-code">delay</code> (ms) defers the spinner's render so quick loads never
        flash a spinner. Toggle below: the spinner only appears after 500 ms.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">delay</span>
          <div class="row-items av-baseline">
            <button class="trigger-btn" type="button" (click)="toggleDelayed()">
              {{ showDelayed() ? 'Hide' : 'Show' }} (delay 500ms)
            </button>
            @if (showDelayed()) {
              <tulpar-spinner-ng tone="info" size="lg" [delay]="500" label="Loading" />
            }
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ delayCode }}</code></pre>
    </section>

    <!-- ── 6. Inline in a button ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Inline in a button</h2>
      <p class="section-desc">
        A tiny <code class="inline-code">xs</code> spinner with no tone inherits the button's text
        colour — the canonical "saving…" affordance.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">inline</span>
          <div class="row-items">
            <button class="inline-btn" disabled>
              <tulpar-spinner-ng size="xs" label="Saving" />
              Saving…
            </button>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ inlineCode }}</code></pre>
    </section>

    <!-- ── 7. Prop vs slot — label ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Content — label (prop &amp; slot)</h2>
      <p class="section-desc">
        The accessible label is visually hidden but read by assistive tech. Provide it via the
        <code class="inline-code">label</code> prop or the
        <code class="inline-code">slot="label"</code>
        (slot wins).
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (label)</div>
          <div class="dual-body av-baseline">
            <tulpar-spinner-ng tone="info" size="lg" label="Loading…" />
            <span class="dual-note">label="Loading…" (visually hidden)</span>
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (label)</div>
          <div class="dual-body av-baseline">
            <tulpar-spinner-ng tone="info" size="lg">
              <span slot="label">Saving changes…</span>
            </tulpar-spinner-ng>
            <span class="dual-note">slot="label" (visually hidden)</span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualCode }}</code></pre>
    </section>

    <!-- ── 8. Live playground ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Live playground</h2>
      <p class="section-desc">
        Drive size, tone, the custom colour, and the track toggle. The snippet updates live.
      </p>
      <div class="preview preview--col">
        <div class="pg-controls">
          <label class="pg-field">
            <span class="pg-field-label">Size</span>
            <select class="pg-select" [value]="pgSize()" (change)="setPgSize($event)">
              @for (s of sizes; track s) {
                <option [value]="s">{{ s }}</option>
              }
            </select>
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Tone</span>
            <select class="pg-select" [value]="pgTone()" (change)="setPgTone($event)">
              <option value="">(inherit)</option>
              @for (t of tones; track t) {
                <option [value]="t">{{ t }}</option>
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
              [checked]="pgTrack()"
              (change)="pgTrack.set($any($event.target).checked)"
            />
            <span>track</span>
          </label>
        </div>
        <div class="pg-stage">
          <tulpar-spinner-ng
            [size]="pgSize()"
            [tone]="$any(pgTone()) || undefined"
            [color]="pgTone() === 'custom' ? pgColor() : undefined"
            [track]="pgTrack()"
            label="Loading"
          />
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet() }}</code></pre>
    </section>

    <!-- ── 9. Accessibility ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Accessibility</h2>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Always label.</strong> The spinner exposes a visually-hidden accessible name (prop
          or slot) — without it, assistive tech announces nothing useful for the wait.
        </div>
        <div class="a11y-note">
          <strong>Use delay to prevent flicker.</strong> A 300–500 ms
          <code class="inline-code">delay</code> avoids a jarring flash on sub-perceptual loads.
        </div>
        <div class="a11y-note">
          <strong>Reduced motion.</strong> The animation honours
          <code class="inline-code">prefers-reduced-motion</code>; the loader stays meaningful
          without spinning.
        </div>
        <div class="a11y-note">
          <strong>currentColor by default.</strong> No tone means it inherits its context, so it
          stays legible against any surface, including dark mode.
        </div>
      </div>
    </section>
  `,
  styles: [PAGE_STYLES],
})
export class SpinnerDemoComponent {
  readonly sizesCode = SIZES_CODE;
  readonly tonesCode = TONES_CODE;
  readonly inheritCode = INHERIT_CODE;
  readonly trackCode = TRACK_CODE;
  readonly delayCode = DELAY_CODE;
  readonly dualCode = DUAL_CODE;
  readonly inlineCode = INLINE_CODE;

  readonly sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  readonly tones: SpinnerTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'custom'];
  readonly customColors = ['ilay', 'umay', 'gok', 'ulgen', 'kizagan', 'erlik', '#0d9488'] as const;

  // ── 5. Delay demo ─────────────────────────────────────────────────────────
  readonly showDelayed = signal<boolean>(false);
  toggleDelayed(): void {
    this.showDelayed.update((v) => !v);
  }

  // ── 8. Live playground state ──────────────────────────────────────────────
  readonly pgSize = signal<SpinnerSize>('lg');
  readonly pgTone = signal<string>('info');
  readonly pgColor = signal<string>('ilay');
  readonly pgTrack = signal<boolean>(true);

  setPgSize(e: Event) {
    this.pgSize.set((e.target as HTMLSelectElement).value as SpinnerSize);
  }
  setPgTone(e: Event) {
    this.pgTone.set((e.target as HTMLSelectElement).value);
  }
  setPgColor(e: Event) {
    this.pgColor.set((e.target as HTMLSelectElement).value);
  }

  readonly pgSnippet = computed(() => {
    const tone = this.pgTone();
    const toneAttr = tone ? ` tone="${tone}"` : '';
    const colorAttr = tone === 'custom' ? ` color="${this.pgColor()}"` : '';
    const trackAttr = this.pgTrack() ? '' : ' [track]="false"';
    return `<tulpar-spinner-ng size="${this.pgSize()}"${toneAttr}${colorAttr}${trackAttr} label="Loading" />`;
  });
}
