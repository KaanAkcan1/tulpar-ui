import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  signal,
} from '@angular/core';
import { TulparAvatarComponent, type AvatarShape, type AvatarSize } from '@tulpar-ui/angular';

// ─── Code snippet strings (outside @Component to avoid backtick nesting) ──────

const CASCADE_CODE = `<!-- Fallback cascade: image → initials → icon -->
<tulpar-avatar-ng src="https://i.pravatar.cc/96?img=12" name="Ada Byron" /> <!-- image -->
<tulpar-avatar-ng name="Jane Doe" />                  <!-- initials JD (from name) -->
<tulpar-avatar-ng initials="KA" name="Kaan Akcan" /> <!-- explicit initials override -->
<tulpar-avatar-ng />                                  <!-- generic user icon fallback -->`;

const BROKEN_CODE = `<!-- Broken / missing image falls back to initials, then icon -->
<tulpar-avatar-ng src="https://invalid.example/none.png" name="Lin Wei" />
<tulpar-avatar-ng src="https://invalid.example/none.png" />`;

const COLOR_CODE = `<!-- Deterministic palette-locked color derived from name (skips amber/red) -->
<tulpar-avatar-ng name="Ada Byron" />
<tulpar-avatar-ng name="Jane Doe" />
<tulpar-avatar-ng name="Mehmet Özkan" />
<tulpar-avatar-ng name="Rachel Tang" />

<!-- Explicit single-accent override (family name or CSS color) -->
<tulpar-avatar-ng initials="IL" color="ilay" />
<tulpar-avatar-ng initials="HX" color="#0d9488" />`;

const SHAPES_CODE = `<!-- shape: rounded-square (default) · circle -->
<tulpar-avatar-ng name="Ada Byron" shape="rounded-square" />
<tulpar-avatar-ng name="Ada Byron" shape="circle" />`;

const SIZES_CODE = `<!-- size: xs · sm · md (default) · lg · xl -->
<tulpar-avatar-ng name="Ada Byron" size="xs" />
<tulpar-avatar-ng name="Ada Byron" size="sm" />
<tulpar-avatar-ng name="Ada Byron" size="md" />
<tulpar-avatar-ng name="Ada Byron" size="lg" />
<tulpar-avatar-ng name="Ada Byron" size="xl" />`;

const GROUP_CODE = `<!-- Overlapping avatar group (consumer layout, negative margin) -->
<span class="stack">
  <tulpar-avatar-ng name="Ada Byron" size="sm" />
  <tulpar-avatar-ng name="Jane Doe" size="sm" />
  <tulpar-avatar-ng name="Mehmet Özkan" size="sm" />
  <tulpar-avatar-ng initials="+5" color="gok" size="sm" />
</span>`;

const DUAL_CODE = `<!-- DEFAULT content — prop (initials / name) vs slot (custom node) -->
<!-- prop form: initials drive the rendered content -->
<tulpar-avatar-ng initials="JD" name="Jane Doe" size="lg" />

<!-- slot form: the default slot overrides the whole cascade -->
<tulpar-avatar-ng name="Jane Doe" size="lg">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="1.8">
    <circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/>
  </svg>
</tulpar-avatar-ng>`;

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

  /* ── Avatar group stack ───────────────────────────────────────────────── */
  .stack { display: inline-flex; align-items: center; }
  .stack tulpar-avatar-ng { margin-left: -8px; }
  .stack tulpar-avatar-ng:first-child { margin-left: 0; }

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
  .pg-select, .pg-input {
    font: inherit;
    font-size: 13px;
    padding: 7px 10px;
    border-radius: 8px;
    border: 1px solid var(--tulpar-color-border-default, #d9e0df);
    background: var(--tulpar-color-bg-elevated, #fff);
    color: var(--tulpar-color-text-primary, #15110b);
    min-width: 120px;
  }
  .pg-select { cursor: pointer; }
  .pg-stage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px;
    min-height: 64px;
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
  selector: 'app-avatar-demo',
  standalone: true,
  imports: [TulparAvatarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Display &amp; Status</span>
      <h1 class="page-title">Avatar</h1>
      <p class="page-lede">
        The identity atom with a three-step fallback cascade:
        <strong>image</strong> (<code class="inline-code">src</code>) →
        <strong>initials</strong> (from <code class="inline-code">name</code> or explicit
        <code class="inline-code">initials</code>) → <strong>icon</strong> (when neither is set, or
        the image fails to load). Initials get a deterministic, palette-locked colour derived from
        the name. Rounded-square is the default shape; circle is opt-in. The default content also
        has a slot form — shown below.
      </p>
    </header>

    <!-- ── 1. Live playground ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Live playground</h2>
      <p class="section-desc">
        Type a name to watch the initials and the deterministic colour update, paste an image URL to
        promote it over the cascade, and flip the shape / size / override colour. The snippet
        updates live.
      </p>
      <div class="preview preview--col">
        <div class="pg-controls">
          <label class="pg-field">
            <span class="pg-field-label">Name</span>
            <input
              class="pg-input"
              type="text"
              [value]="pgName()"
              (input)="setPgName($event)"
              placeholder="Ada Byron"
            />
          </label>
          <label class="pg-field">
            <span class="pg-field-label">Image src</span>
            <input
              class="pg-input"
              type="text"
              [value]="pgSrc()"
              (input)="setPgSrc($event)"
              placeholder="https://…"
            />
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
          <label class="pg-field">
            <span class="pg-field-label">Color</span>
            <select class="pg-select" [value]="pgColor()" (change)="setPgColor($event)">
              <option value="">(hashed from name)</option>
              @for (c of customColors; track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
          </label>
        </div>
        <div class="pg-stage">
          <tulpar-avatar-ng
            [name]="pgName() || undefined"
            [src]="pgSrc() || undefined"
            [shape]="pgShape()"
            [size]="pgSize()"
            [color]="pgColor() || undefined"
          />
          <tulpar-avatar-ng
            [name]="pgName() || undefined"
            [src]="pgSrc() || undefined"
            [shape]="pgShape()"
            size="md"
            [color]="pgColor() || undefined"
          />
        </div>
      </div>
      <pre class="code"><code>{{ pgSnippet() }}</code></pre>
    </section>

    <!-- ── 2. Fallback cascade ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Fallback cascade</h2>
      <p class="section-desc">
        When <code class="inline-code">src</code> loads, the image wins. Otherwise initials are
        derived from <code class="inline-code">name</code> (or set explicitly via
        <code class="inline-code">initials</code>). With neither, a generic user icon renders.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">cascade</span>
          <div class="row-items av-baseline">
            <tulpar-avatar-ng src="https://i.pravatar.cc/96?img=12" name="Ada Byron" />
            <tulpar-avatar-ng name="Jane Doe" />
            <tulpar-avatar-ng initials="KA" name="Kaan Akcan" />
            <tulpar-avatar-ng />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ cascadeCode }}</code></pre>
    </section>

    <!-- ── 3. Broken image ────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Broken / missing image</h2>
      <p class="section-desc">
        A failed image load gracefully falls down the cascade — to initials when a
        <code class="inline-code">name</code> is present, otherwise to the icon. No broken-image
        glyph ever shows.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">fallback</span>
          <div class="row-items av-baseline">
            <tulpar-avatar-ng src="https://invalid.example/none.png" name="Lin Wei" />
            <tulpar-avatar-ng src="https://invalid.example/none.png" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ brokenCode }}</code></pre>
    </section>

    <!-- ── 4. Deterministic color ─────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Deterministic color</h2>
      <p class="section-desc">
        The initials background is a stable brand-family colour hashed from
        <code class="inline-code">name</code> — the same person always gets the same colour, and the
        hash skips amber/red so initials never look like an error. Override with an explicit
        <code class="inline-code">color</code> (family name or CSS color).
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">hashed</span>
          <div class="row-items av-baseline">
            <tulpar-avatar-ng name="Ada Byron" />
            <tulpar-avatar-ng name="Jane Doe" />
            <tulpar-avatar-ng name="Mehmet Özkan" />
            <tulpar-avatar-ng name="Rachel Tang" />
            <tulpar-avatar-ng name="Sven Olsen" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">override</span>
          <div class="row-items av-baseline">
            <tulpar-avatar-ng initials="IL" color="ilay" />
            <tulpar-avatar-ng initials="UM" color="umay" />
            <tulpar-avatar-ng initials="GK" color="gok" />
            <tulpar-avatar-ng initials="HX" color="#0d9488" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 5. Shapes ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Shapes</h2>
      <p class="section-desc">
        <code class="inline-code">rounded-square</code> (default) ·
        <code class="inline-code">circle</code>. The shape clips the image and the initials surface
        identically.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items av-baseline">
            <tulpar-avatar-ng name="Ada Byron" shape="rounded-square" />
            <tulpar-avatar-ng name="Ada Byron" shape="circle" />
            <tulpar-avatar-ng
              src="https://i.pravatar.cc/96?img=5"
              name="Img"
              shape="rounded-square"
            />
            <tulpar-avatar-ng src="https://i.pravatar.cc/96?img=5" name="Img" shape="circle" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ shapesCode }}</code></pre>
    </section>

    <!-- ── 6. Sizes ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Sizes</h2>
      <p class="section-desc">
        Five tiers from <code class="inline-code">xs</code> to <code class="inline-code">xl</code>.
        The initials font and icon scale with the diameter.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline">
            <tulpar-avatar-ng name="Ada Byron" size="xs" />
            <tulpar-avatar-ng name="Ada Byron" size="sm" />
            <tulpar-avatar-ng name="Ada Byron" size="md" />
            <tulpar-avatar-ng name="Ada Byron" size="lg" />
            <tulpar-avatar-ng name="Ada Byron" size="xl" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 7. Avatar group ────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Overlapping group</h2>
      <p class="section-desc">
        The avatar is layout-agnostic — compose an overlapping group yourself with a negative-margin
        wrapper. The trailing "+N" tile is just an avatar with explicit initials and colour.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">group</span>
          <div class="row-items">
            <span class="stack">
              <tulpar-avatar-ng name="Ada Byron" size="sm" shape="circle" />
              <tulpar-avatar-ng name="Jane Doe" size="sm" shape="circle" />
              <tulpar-avatar-ng name="Mehmet Özkan" size="sm" shape="circle" />
              <tulpar-avatar-ng initials="+5" color="gok" size="sm" shape="circle" />
            </span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ groupCode }}</code></pre>
    </section>

    <!-- ── 8. Prop vs slot — default content ──────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Content — default (prop &amp; slot)</h2>
      <p class="section-desc">
        The rendered content comes from the cascade props (<code class="inline-code">src</code> /
        <code class="inline-code">name</code> / <code class="inline-code">initials</code>), or you
        can override the whole cascade by projecting your own node into the default slot — for a
        custom icon, emoji, or status overlay.
      </p>
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (default content)</div>
          <div class="dual-body av-baseline">
            <tulpar-avatar-ng initials="JD" name="Jane Doe" size="lg" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (default content)</div>
          <div class="dual-body av-baseline">
            <tulpar-avatar-ng name="Jane Doe" size="lg">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" />
              </svg>
            </tulpar-avatar-ng>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ dualCode }}</code></pre>
    </section>

    <!-- ── 9. Accessibility ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Accessibility</h2>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Image avatars</strong> get <code class="inline-code">alt</code> text — from the
          <code class="inline-code">alt</code> prop, falling back to
          <code class="inline-code">name</code>.
        </div>
        <div class="a11y-note">
          <strong>Initials / icon avatars</strong> expose
          <code class="inline-code">role="img"</code> with
          <code class="inline-code">aria-label="{{ '{name}' }}"</code> so the identity is announced,
          not the two letters.
        </div>
        <div class="a11y-note">
          <strong>Deterministic colour</strong> aids recognition but is never the only signal — the
          name is always available to assistive tech.
        </div>
        <div class="a11y-note">
          <strong>Dark mode.</strong> Initials surfaces flip automatically under
          <code class="inline-code">.dark</code>.
        </div>
      </div>
    </section>
  `,
  styles: [PAGE_STYLES],
})
export class AvatarDemoComponent {
  readonly cascadeCode = CASCADE_CODE;
  readonly brokenCode = BROKEN_CODE;
  readonly colorCode = COLOR_CODE;
  readonly shapesCode = SHAPES_CODE;
  readonly sizesCode = SIZES_CODE;
  readonly groupCode = GROUP_CODE;
  readonly dualCode = DUAL_CODE;

  readonly shapes: AvatarShape[] = ['rounded-square', 'circle'];
  readonly sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  readonly customColors = ['ilay', 'umay', 'gok', 'ulgen', 'kizagan', 'erlik', '#0d9488'] as const;

  // ── Live playground state ──────────────────────────────────────────────────
  readonly pgName = signal<string>('Ada Byron');
  readonly pgSrc = signal<string>('');
  readonly pgShape = signal<AvatarShape>('circle');
  readonly pgSize = signal<AvatarSize>('lg');
  readonly pgColor = signal<string>('');

  setPgName(e: Event) {
    this.pgName.set((e.target as HTMLInputElement).value);
  }
  setPgSrc(e: Event) {
    this.pgSrc.set((e.target as HTMLInputElement).value);
  }
  setPgShape(e: Event) {
    this.pgShape.set((e.target as HTMLSelectElement).value as AvatarShape);
  }
  setPgSize(e: Event) {
    this.pgSize.set((e.target as HTMLSelectElement).value as AvatarSize);
  }
  setPgColor(e: Event) {
    this.pgColor.set((e.target as HTMLSelectElement).value);
  }

  readonly pgSnippet = computed(() => {
    const name = this.pgName() ? ` name="${this.pgName()}"` : '';
    const src = this.pgSrc() ? ` src="${this.pgSrc()}"` : '';
    const color = this.pgColor() ? ` color="${this.pgColor()}"` : '';
    return `<tulpar-avatar-ng${src}${name}${color} shape="${this.pgShape()}" size="${this.pgSize()}" />`;
  });
}
