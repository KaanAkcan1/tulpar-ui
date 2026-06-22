import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import {
  TulparTagComponent,
  TulparBadgeComponent,
  TulparChipComponent,
  TulparAvatarComponent,
  TulparSkeletonComponent,
  TulparSpinnerComponent,
  TulparProgressComponent,
} from '@tulpar-ui/angular';

// ─── Code snippet strings (outside @Component to avoid backtick nesting) ──────

const TAG_CODE = `<!-- Tone × variant. Tone always pairs with a dot / icon / text. -->
<tulpar-tag-ng tone="info"    dot label="In review" />
<tulpar-tag-ng tone="success" dot label="Active" />
<tulpar-tag-ng tone="warning" variant="outline" dot label="Pending" />
<tulpar-tag-ng tone="danger"  variant="solid"   dot label="Blocked" />

<!-- Shapes: square (default) · pill · sharp -->
<tulpar-tag-ng tone="info" shape="square" label="square" />
<tulpar-tag-ng tone="info" shape="pill"   label="pill" />
<tulpar-tag-ng tone="info" shape="sharp"  label="sharp" />

<!-- Sizes: xs · sm · md · lg · xl -->
<tulpar-tag-ng tone="success" size="xs" dot label="xs" />
<tulpar-tag-ng tone="success" size="xl" dot label="xl" />

<!-- Custom tone (brand family or raw color) -->
<tulpar-tag-ng tone="custom" color="ilay"    label="ilay" />
<tulpar-tag-ng tone="custom" color="#0d9488" label="#0d9488" />`;

const TAG_DUAL_CODE = `<!-- LABEL — prop form vs slot form (slot wins when both set) -->
<tulpar-tag-ng tone="info" dot label="Prop label" />
<tulpar-tag-ng tone="info" dot>Slot label</tulpar-tag-ng>

<!-- ICON — prop form (raw SVG / emoji) vs slot form -->
<tulpar-tag-ng tone="success" icon="✓" label="Prop icon" />
<tulpar-tag-ng tone="success" label="Slot icon">
  <svg slot="icon" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="2"><path d="M3 8l3.5 3.5L13 4"/></svg>
</tulpar-tag-ng>`;

const BADGE_CODE = `<!-- Count + overflow cap (max → "99+"), tabular-nums -->
<tulpar-badge-ng tone="neutral" [count]="3" />
<tulpar-badge-ng tone="info"    [count]="8" />
<tulpar-badge-ng tone="danger"  [count]="128" [max]="99" />

<!-- show-zero: render even when count === 0 (hidden by default) -->
<tulpar-badge-ng tone="neutral" [count]="0" />            <!-- hidden -->
<tulpar-badge-ng tone="neutral" [count]="0" showZero />   <!-- "0" -->

<!-- Dot mode (bare status, ignores count) -->
<tulpar-badge-ng tone="success" dot />
<tulpar-badge-ng tone="warning" dot />

<!-- Variants · shapes · sizes -->
<tulpar-badge-ng tone="info" variant="soft-tonal" [count]="5" />
<tulpar-badge-ng tone="info" variant="outline"    [count]="5" />
<tulpar-badge-ng tone="info" shape="square" [count]="5" />
<tulpar-badge-ng tone="info" size="lg"      [count]="5" />`;

const BADGE_DUAL_CODE = `<!-- LABEL — prop form vs slot form (slot wins; prop seeds a11y noun) -->
<tulpar-badge-ng tone="success" label="NEW" />
<tulpar-badge-ng tone="success">NEW</tulpar-badge-ng>`;

const CHIP_CODE = `// clickable — bridges the core CustomEvent to the (clicked) output
<tulpar-chip-ng tone="info" label="All" (clicked)="log('clicked: All')" />
<tulpar-chip-ng tone="info" label="Open" (clicked)="log('clicked: Open')" />

// removable — the ✕ is an independent tab stop → (removed) output
<tulpar-chip-ng label="kaan@x.com" removable
                (removed)="log('removed: kaan@x.com')" />

// avatar + removable
<tulpar-chip-ng label="Jane Doe" avatar="JD" removable
                (removed)="log('removed: Jane Doe')" />

// ghost (toolbar filter) — transparent rest, soft-tonal hover
<tulpar-chip-ng variant="ghost" label="Status" />

// disabled — no events, not focusable, dimmed
<tulpar-chip-ng label="Archived" disabled />

// shapes · sizes · custom tone
<tulpar-chip-ng tone="success" shape="pill" label="pill" />
<tulpar-chip-ng tone="success" size="xs"    label="xs" />
<tulpar-chip-ng tone="custom"  color="gok"  label="gok" />`;

const CHIP_DUAL_CODE = `<!-- LABEL — prop vs slot -->
<tulpar-chip-ng tone="info" label="Prop label" />
<tulpar-chip-ng tone="info">Slot label</tulpar-chip-ng>

<!-- ICON — prop (raw SVG / emoji) vs slot -->
<tulpar-chip-ng tone="success" icon="✓" label="Prop icon" />
<tulpar-chip-ng tone="success" label="Slot icon">
  <svg slot="icon" viewBox="0 0 16 16" fill="none"
       stroke="currentColor" stroke-width="2"><path d="M3 8l3.5 3.5L13 4"/></svg>
</tulpar-chip-ng>

<!-- AVATAR — prop (initials / image URL) vs slot -->
<tulpar-chip-ng label="Prop avatar" avatar="KA" />
<tulpar-chip-ng label="Slot avatar">
  <span slot="avatar">🦄</span>
</tulpar-chip-ng>`;

const AVATAR_CODE = `<!-- Cascade: image src → initials (from name / initials) → icon fallback -->
<tulpar-avatar-ng src="https://i.pravatar.cc/96?img=12" name="Ada Byron" /> <!-- image -->
<tulpar-avatar-ng name="Jane Doe" />                                        <!-- initials JD -->
<tulpar-avatar-ng initials="KA" name="Kaan Akcan" />                        <!-- override -->
<tulpar-avatar-ng />                                                        <!-- icon fallback -->

<!-- Deterministic palette-locked color from name (or explicit color) -->
<tulpar-avatar-ng name="Mehmet Özkan" />
<tulpar-avatar-ng initials="RT" color="ilay" />

<!-- Shapes: rounded-square (default) · circle -->
<tulpar-avatar-ng name="Ada Byron" shape="rounded-square" />
<tulpar-avatar-ng name="Ada Byron" shape="circle" />

<!-- Sizes: xs · sm · md · lg · xl -->
<tulpar-avatar-ng name="AB" size="xs" />
<tulpar-avatar-ng name="AB" size="xl" />`;

const AVATAR_DUAL_CODE = `<!-- DEFAULT content — prop (initials / name) vs slot (custom node) -->
<!-- prop form: initials drive the rendered content -->
<tulpar-avatar-ng initials="JD" name="Jane Doe" />

<!-- slot form: the default slot overrides the whole cascade -->
<tulpar-avatar-ng name="Jane Doe">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="1.8">
    <circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/>
  </svg>
</tulpar-avatar-ng>`;

const SKELETON_CODE = `<!-- text variant — multi-line bars -->
<tulpar-skeleton-ng variant="text" [lines]="4" />

<!-- rect / circle variants -->
<tulpar-skeleton-ng variant="rect"   height="72px" />
<tulpar-skeleton-ng variant="circle" width="40px" height="40px" />

<!-- explicit width / height / radius overrides -->
<tulpar-skeleton-ng variant="rect" width="120px" height="32px" radius="999px" />

<!-- animations: shimmer (default) · pulse · none -->
<tulpar-skeleton-ng variant="text" [lines]="2" animation="shimmer" />
<tulpar-skeleton-ng variant="text" [lines]="2" animation="pulse" />
<tulpar-skeleton-ng variant="text" [lines]="2" animation="none" />`;

const SPINNER_CODE = `<!-- sizes: xs · sm · md · lg · xl -->
<tulpar-spinner-ng size="xs" /><tulpar-spinner-ng size="md" /><tulpar-spinner-ng size="xl" />

<!-- tones (built-in colorize; omit → inherits currentColor) -->
<tulpar-spinner-ng tone="info" />
<tulpar-spinner-ng tone="success" />
<tulpar-spinner-ng tone="danger" />
<tulpar-spinner-ng tone="custom" color="ilay" />

<!-- track ring (default true) — set [track]="false" for arc only -->
<tulpar-spinner-ng tone="info" [track]="false" />

<!-- delay (ms) — avoid flashing on fast loads -->
<tulpar-spinner-ng [delay]="500" />

<!-- accessible label — prop vs slot (visually hidden, slot wins) -->
<tulpar-spinner-ng label="Loading…" />
<tulpar-spinner-ng><span slot="label">Saving changes…</span></tulpar-spinner-ng>`;

const PROGRESS_CODE = `<!-- linear determinate (value 0..max) + value label (true → "N%") -->
<tulpar-progress-ng [value]="42" [valueLabel]="true" />
<tulpar-progress-ng [value]="78" tone="success" [valueLabel]="true" />

<!-- linear with buffer (secondary buffered value) -->
<tulpar-progress-ng [value]="40" [buffer]="65" />

<!-- linear indeterminate -->
<tulpar-progress-ng indeterminate />

<!-- thickness: thin · regular · thick -->
<tulpar-progress-ng [value]="60" thickness="thin" />
<tulpar-progress-ng [value]="60" thickness="thick" />

<!-- circular determinate + indeterminate; sizes sm · md · lg -->
<tulpar-progress-ng variant="circular" [value]="70" [valueLabel]="true" />
<tulpar-progress-ng variant="circular" indeterminate />
<tulpar-progress-ng variant="circular" [value]="30" size="lg" tone="info" />

<!-- custom formatter (function form of valueLabel) -->
<tulpar-progress-ng [value]="3" [max]="5"
  [valueLabel]="formatStep" />   // (v, min, max) => \`\${v}/\${max} steps\`

<!-- label slot (descriptive text above / beside the bar) -->
<tulpar-progress-ng [value]="55"><span slot="label">Uploading…</span></tulpar-progress-ng>`;

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-atoms-demo',
  standalone: true,
  imports: [
    TulparTagComponent,
    TulparBadgeComponent,
    TulparChipComponent,
    TulparAvatarComponent,
    TulparSkeletonComponent,
    TulparSpinnerComponent,
    TulparProgressComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Display &amp; Status</span>
      <h1 class="page-title">Atoms</h1>
      <p class="page-lede">
        Seven foundational display atoms — <strong>Tag</strong>, <strong>Badge</strong>,
        <strong>Chip</strong>, <strong>Avatar</strong>, <strong>Skeleton</strong>,
        <strong>Spinner</strong>, and <strong>Progress</strong>. They are the system's status,
        identity, and loading vocabulary: small, composable, tonal pieces that render inside lists,
        tables, toolbars, and grid cells. Every atom that takes content offers both a convenience
        <em>prop</em> and a <em>slot</em> — both are shown explicitly below.
      </p>
    </header>

    <!-- ── 1. Tag ─────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Tag</h2>
      <p class="section-desc">
        Static, read-only tonal metadata. Non-interactive (no click, no remove). Default variant is
        <code class="inline-code">soft-tonal</code>; <code class="inline-code">outline</code> and
        <code class="inline-code">solid</code> are opt-in. Tone always pairs with a leading dot, an
        icon, or text — never hue alone. Long labels truncate with an ellipsis + native title.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">soft-tonal</span>
          <div class="row-items">
            <tulpar-tag-ng tone="neutral" [dot]="true" label="Neutral" />
            <tulpar-tag-ng tone="info" [dot]="true" label="Info" />
            <tulpar-tag-ng tone="success" [dot]="true" label="Success" />
            <tulpar-tag-ng tone="warning" [dot]="true" label="Warning" />
            <tulpar-tag-ng tone="danger" [dot]="true" label="Danger" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">outline</span>
          <div class="row-items">
            <tulpar-tag-ng tone="neutral" variant="outline" [dot]="true" label="Neutral" />
            <tulpar-tag-ng tone="info" variant="outline" [dot]="true" label="Info" />
            <tulpar-tag-ng tone="success" variant="outline" [dot]="true" label="Success" />
            <tulpar-tag-ng tone="warning" variant="outline" [dot]="true" label="Warning" />
            <tulpar-tag-ng tone="danger" variant="outline" [dot]="true" label="Danger" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">solid</span>
          <div class="row-items">
            <tulpar-tag-ng tone="neutral" variant="solid" [dot]="true" label="Neutral" />
            <tulpar-tag-ng tone="info" variant="solid" [dot]="true" label="Info" />
            <tulpar-tag-ng tone="success" variant="solid" [dot]="true" label="Success" />
            <tulpar-tag-ng tone="warning" variant="solid" [dot]="true" label="Warning" />
            <tulpar-tag-ng tone="danger" variant="solid" [dot]="true" label="Danger" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items">
            <tulpar-tag-ng tone="info" shape="square" [dot]="true" label="square" />
            <tulpar-tag-ng tone="info" shape="pill" [dot]="true" label="pill" />
            <tulpar-tag-ng tone="info" shape="sharp" [dot]="true" label="sharp" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items">
            <tulpar-tag-ng tone="success" size="xs" [dot]="true" label="xs" />
            <tulpar-tag-ng tone="success" size="sm" [dot]="true" label="sm" />
            <tulpar-tag-ng tone="success" size="md" [dot]="true" label="md" />
            <tulpar-tag-ng tone="success" size="lg" [dot]="true" label="lg" />
            <tulpar-tag-ng tone="success" size="xl" [dot]="true" label="xl" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">custom</span>
          <div class="row-items">
            <tulpar-tag-ng tone="custom" color="ilay" [dot]="true" label="ilay" />
            <tulpar-tag-ng tone="custom" color="umay" [dot]="true" label="umay" />
            <tulpar-tag-ng tone="custom" color="gok" [dot]="true" label="gok" />
            <tulpar-tag-ng tone="custom" color="#0d9488" [dot]="true" label="#0d9488" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">truncate</span>
          <div class="row-items">
            <tulpar-tag-ng tone="neutral" label="truncates a very long label that overflows" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ tagCode }}</code></pre>

      <!-- Prop vs slot -->
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form</div>
          <div class="dual-body">
            <tulpar-tag-ng tone="info" [dot]="true" label="Prop label" />
            <tulpar-tag-ng tone="success" icon="✓" label="Prop icon" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <tulpar-tag-ng tone="info" [dot]="true">Slot label</tulpar-tag-ng>
            <tulpar-tag-ng tone="success" label="Slot icon">
              <svg
                slot="icon"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M3 8l3.5 3.5L13 4" />
              </svg>
            </tulpar-tag-ng>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ tagDualCode }}</code></pre>
    </section>

    <!-- ── 2. Badge ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Badge</h2>
      <p class="section-desc">
        Count / status indicator (pill by default). Counts cap at
        <code class="inline-code">max</code> (e.g. <code class="inline-code">128 → 99+</code>) and
        use tabular figures so the width never jitters. <code class="inline-code">dot</code> mode
        shows bare status; <code class="inline-code">showZero</code> renders a
        <code class="inline-code">0</code>
        (hidden by default). Solid is the default variant.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">count</span>
          <div class="row-items">
            <tulpar-badge-ng tone="neutral" [count]="3" />
            <tulpar-badge-ng tone="info" [count]="8" />
            <tulpar-badge-ng tone="success" [count]="24" />
            <tulpar-badge-ng tone="warning" [count]="42" />
            <tulpar-badge-ng tone="danger" [count]="128" [max]="99" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">show-zero</span>
          <div class="row-items">
            <span class="zero-cell">
              <tulpar-badge-ng tone="neutral" [count]="0" />
              <span class="zero-note">[count]=0 → hidden</span>
            </span>
            <span class="zero-cell">
              <tulpar-badge-ng tone="neutral" [count]="0" [showZero]="true" />
              <span class="zero-note">showZero → "0"</span>
            </span>
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">dot</span>
          <div class="row-items">
            <tulpar-badge-ng tone="success" [dot]="true" />
            <tulpar-badge-ng tone="warning" [dot]="true" />
            <tulpar-badge-ng tone="danger" [dot]="true" />
            <tulpar-badge-ng tone="info" [dot]="true" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">variants</span>
          <div class="row-items">
            <tulpar-badge-ng tone="info" variant="solid" [count]="5" />
            <tulpar-badge-ng tone="info" variant="soft-tonal" [count]="5" />
            <tulpar-badge-ng tone="info" variant="outline" [count]="5" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items">
            <tulpar-badge-ng tone="danger" shape="pill" [count]="9" />
            <tulpar-badge-ng tone="danger" shape="square" [count]="9" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items">
            <tulpar-badge-ng tone="success" size="sm" [count]="7" />
            <tulpar-badge-ng tone="success" size="md" [count]="7" />
            <tulpar-badge-ng tone="success" size="lg" [count]="7" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">on host</span>
          <div class="row-items">
            <span class="badge-host">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 01-3.4 0" />
              </svg>
              <span class="badge-host-pin"><tulpar-badge-ng tone="danger" [count]="5" /></span>
            </span>
            <span class="badge-host">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M4 4h16v16H4z" />
              </svg>
              <span class="badge-host-pin badge-host-pin--dot">
                <tulpar-badge-ng tone="success" [dot]="true" />
              </span>
            </span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ badgeCode }}</code></pre>

      <!-- Prop vs slot -->
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form</div>
          <div class="dual-body">
            <tulpar-badge-ng tone="success" label="NEW" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <tulpar-badge-ng tone="success">NEW</tulpar-badge-ng>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ badgeDualCode }}</code></pre>
    </section>

    <!-- ── 3. Chip ────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Chip</h2>
      <p class="section-desc">
        The interactive display atom. The body is operable (click / Enter / Space →
        <code class="inline-code">clicked</code>) and can carry an independent remove control (<code
          class="inline-code"
          >removed</code
        >). <code class="inline-code">ghost</code> variant is transparent at rest and hovers into
        the soft tint (toolbar filters). <code class="inline-code">disabled</code> fires nothing and
        is not focusable. Interact below — the event log records every
        <code class="inline-code">clicked</code> / <code class="inline-code">removed</code>.
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
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">ghost</span>
          <div class="row-items">
            <tulpar-chip-ng variant="ghost" label="Status" (clicked)="logChip('clicked: Status')" />
            <tulpar-chip-ng variant="ghost" label="Owner" (clicked)="logChip('clicked: Owner')" />
            <tulpar-chip-ng variant="ghost" label="Label" (clicked)="logChip('clicked: Label')" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">disabled</span>
          <div class="row-items">
            <tulpar-chip-ng label="Archived" [disabled]="true" />
            <tulpar-chip-ng label="Read-only" [removable]="true" [disabled]="true" />
          </div>
        </div>
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
          <div class="row-items">
            <tulpar-chip-ng tone="success" size="xs" label="xs" />
            <tulpar-chip-ng tone="success" size="sm" label="sm" />
            <tulpar-chip-ng tone="success" size="md" label="md" />
            <tulpar-chip-ng tone="success" size="lg" label="lg" />
            <tulpar-chip-ng tone="success" size="xl" label="xl" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">custom</span>
          <div class="row-items">
            <tulpar-chip-ng tone="custom" color="ilay" label="ilay" />
            <tulpar-chip-ng tone="custom" color="gok" label="gok" />
            <tulpar-chip-ng tone="custom" color="#0d9488" label="#0d9488" />
          </div>
        </div>

        <!-- Event log -->
        <div class="event-log" aria-live="polite">
          <div class="event-log-head">
            <span class="event-log-title">Event log</span>
            <button class="event-log-clear" type="button" (click)="clearLog()">Clear</button>
          </div>
          @if (chipEvents().length === 0) {
            <div class="event-log-empty">Click a chip or remove a [removable]="true" chip…</div>
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
      <pre class="code"><code>{{ chipCode }}</code></pre>

      <!-- Prop vs slot -->
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form</div>
          <div class="dual-body">
            <tulpar-chip-ng tone="info" label="Prop label" />
            <tulpar-chip-ng tone="success" icon="✓" label="Prop icon" />
            <tulpar-chip-ng label="Prop avatar" avatar="KA" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <tulpar-chip-ng tone="info">Slot label</tulpar-chip-ng>
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
            <tulpar-chip-ng label="Slot avatar">
              <span slot="avatar">🦄</span>
            </tulpar-chip-ng>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ chipDualCode }}</code></pre>
    </section>

    <!-- ── 4. Avatar ──────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Avatar</h2>
      <p class="section-desc">
        Identity atom with a fallback cascade: <strong>image</strong> (<code class="inline-code"
          >src</code
        >) → <strong>initials</strong> (from <code class="inline-code">name</code> or explicit
        <code class="inline-code">initials</code>) → <strong>icon</strong> (when neither is set).
        Initials get a deterministic, palette-locked color from the name (skips amber/red).
        Rounded-square is the default shape; circle is opt-in.
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
        <div class="demo-row">
          <span class="row-label">color</span>
          <div class="row-items av-baseline">
            <tulpar-avatar-ng name="Ada Byron" />
            <tulpar-avatar-ng name="Jane Doe" />
            <tulpar-avatar-ng name="Mehmet Özkan" />
            <tulpar-avatar-ng name="Rachel Tang" />
            <tulpar-avatar-ng initials="IL" color="ilay" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items av-baseline">
            <tulpar-avatar-ng name="Ada Byron" shape="rounded-square" />
            <tulpar-avatar-ng name="Ada Byron" shape="circle" />
          </div>
        </div>
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
      <pre class="code"><code>{{ avatarCode }}</code></pre>

      <!-- Prop vs slot -->
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
      <pre class="code"><code>{{ avatarDualCode }}</code></pre>
    </section>

    <!-- ── 5. Skeleton ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Skeleton</h2>
      <p class="section-desc">
        Loading placeholder that reserves layout to avoid CLS.
        <code class="inline-code">text</code> renders <code class="inline-code">lines</code> bars;
        <code class="inline-code">rect</code> and <code class="inline-code">circle</code> take
        explicit <code class="inline-code">width</code> / <code class="inline-code">height</code> /
        <code class="inline-code">radius</code>. Animation: a directional
        <code class="inline-code">shimmer</code> sweep (default), an opacity
        <code class="inline-code">pulse</code>, or <code class="inline-code">none</code>. All freeze
        under <code class="inline-code">prefers-reduced-motion</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row demo-row--top">
          <span class="row-label">variants</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <tulpar-skeleton-ng variant="text" [lines]="4" />
              <span class="skel-caption">text · 4 lines</span>
            </div>
            <div class="skel-block">
              <tulpar-skeleton-ng variant="rect" height="72px" />
              <span class="skel-caption">rect</span>
            </div>
            <div class="skel-block skel-block--circle">
              <tulpar-skeleton-ng variant="circle" width="56px" height="56px" />
              <span class="skel-caption">circle</span>
            </div>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">overrides</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <tulpar-skeleton-ng variant="rect" width="160px" height="32px" radius="999px" />
              <span class="skel-caption">w/h/radius pill</span>
            </div>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">animations</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <tulpar-skeleton-ng variant="text" [lines]="3" animation="shimmer" />
              <span class="skel-caption">shimmer</span>
            </div>
            <div class="skel-block">
              <tulpar-skeleton-ng variant="text" [lines]="3" animation="pulse" />
              <span class="skel-caption">pulse</span>
            </div>
            <div class="skel-block">
              <tulpar-skeleton-ng variant="text" [lines]="3" animation="none" />
              <span class="skel-caption">none</span>
            </div>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">composed</span>
          <div class="row-items">
            <div class="skel-card">
              <tulpar-skeleton-ng variant="circle" width="40px" height="40px" />
              <div class="skel-card-body">
                <tulpar-skeleton-ng variant="text" [lines]="1" width="60%" />
                <tulpar-skeleton-ng variant="text" [lines]="1" width="40%" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ skeletonCode }}</code></pre>
    </section>

    <!-- ── 6. Spinner ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Spinner</h2>
      <p class="section-desc">
        Indeterminate loader — a round-cap quarter-arc rotating at a steady cadence, with a faint
        track ring. Omitting <code class="inline-code">tone</code> inherits
        <code class="inline-code">currentColor</code>; built-in tones colorize.
        <code class="inline-code">[track]="false"</code> drops the track ring;
        <code class="inline-code">delay</code> defers render to avoid flashing on fast loads. The
        accessible label is visually hidden (prop or slot).
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
        <div class="demo-row">
          <span class="row-label">tones</span>
          <div class="row-items av-baseline">
            <tulpar-spinner-ng tone="neutral" label="Loading" />
            <tulpar-spinner-ng tone="info" label="Loading" />
            <tulpar-spinner-ng tone="success" label="Loading" />
            <tulpar-spinner-ng tone="warning" label="Loading" />
            <tulpar-spinner-ng tone="danger" label="Loading" />
            <tulpar-spinner-ng tone="custom" color="ilay" label="Loading" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">track</span>
          <div class="row-items av-baseline">
            <tulpar-spinner-ng tone="info" [track]="true" label="Loading" />
            <tulpar-spinner-ng tone="info" [track]="false" label="Loading" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">delay</span>
          <div class="row-items av-baseline">
            <button class="trigger-btn" type="button" (click)="toggleDelayedSpinner()">
              {{ showDelayedSpinner() ? 'Hide' : 'Show' }} (delay 500ms)
            </button>
            @if (showDelayedSpinner()) {
              <tulpar-spinner-ng tone="info" [delay]="500" label="Loading" />
            }
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ spinnerCode }}</code></pre>

      <!-- Prop vs slot (accessible label) -->
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
    </section>

    <!-- ── 7. Progress ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Progress</h2>
      <p class="section-desc">
        Linear and circular progress, determinate or indeterminate. Determinate transitions are
        eased; indeterminate is one traveling bar / rotating arc.
        <code class="inline-code">valueLabel</code> can be <code class="inline-code">true</code> (→
        <code class="inline-code">N%</code>) or a formatter function.
        <code class="inline-code">buffer</code> shows a secondary buffered value (linear). Use the
        slider below to drive a live value.
      </p>
      <div class="preview preview--col">
        <!-- Live driver -->
        <div class="demo-row">
          <span class="row-label">live</span>
          <div class="row-items progress-live">
            <input
              class="progress-slider"
              type="range"
              min="0"
              max="100"
              [value]="progressValue()"
              (input)="onProgressInput($event)"
              aria-label="Progress value"
            />
            <span class="progress-value">{{ progressValue() }}%</span>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">&nbsp;</span>
          <div class="row-items progress-live-bars">
            <tulpar-progress-ng [value]="progressValue()" [valueLabel]="true" />
            <tulpar-progress-ng
              variant="circular"
              [value]="progressValue()"
              [valueLabel]="true"
              size="md"
            />
          </div>
        </div>

        <div class="demo-row demo-row--top">
          <span class="row-label">linear det.</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [value]="42" [valueLabel]="true" />
            <tulpar-progress-ng [value]="78" tone="success" [valueLabel]="true" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">buffer</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [value]="40" [buffer]="65" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">indet.</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [indeterminate]="true" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">thickness</span>
          <div class="row-items progress-stack">
            <tulpar-progress-ng [value]="60" thickness="thin" />
            <tulpar-progress-ng [value]="60" thickness="regular" />
            <tulpar-progress-ng [value]="60" thickness="thick" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">circular</span>
          <div class="row-items av-baseline progress-circ-row">
            <tulpar-progress-ng variant="circular" [value]="70" [valueLabel]="true" />
            <tulpar-progress-ng variant="circular" [indeterminate]="true" />
            <tulpar-progress-ng variant="circular" [value]="30" size="sm" tone="info" />
            <tulpar-progress-ng variant="circular" [value]="55" size="lg" tone="success" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
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
      <pre class="code"><code>{{ progressCode }}</code></pre>

      <!-- Prop vs slot (label) -->
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (valueLabel)</div>
          <div class="dual-body progress-stack">
            <tulpar-progress-ng [value]="55" [valueLabel]="true" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (label)</div>
          <div class="dual-body progress-stack">
            <tulpar-progress-ng [value]="55">
              <span slot="label">Uploading…</span>
            </tulpar-progress-ng>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* ── Page header ────────────────────────────────────────────────── */
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
        max-width: 660px;
        line-height: 1.6;
      }

      /* ── Doc sections ───────────────────────────────────────────────── */
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
        max-width: 640px;
        line-height: 1.6;
      }

      /* ── Preview area ───────────────────────────────────────────────── */
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

      /* ── Capability rows ────────────────────────────────────────────── */
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

      .demo-row--top {
        align-items: flex-start;
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

      /* ── Prop vs slot dual cards ────────────────────────────────────── */
      .dual-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-top: 24px;
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

      .dual-note {
        font-size: 11px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      /* ── Badge specifics ────────────────────────────────────────────── */
      .zero-cell {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .zero-note {
        font-size: 11px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .badge-host {
        position: relative;
        display: inline-flex;
        width: 38px;
        height: 38px;
        border-radius: 9px;
        background: var(--tulpar-color-bg-surface, #fff);
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        align-items: center;
        justify-content: center;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .badge-host svg {
        width: 19px;
        height: 19px;
      }

      .badge-host-pin {
        position: absolute;
        top: -6px;
        right: -6px;
      }

      .badge-host-pin--dot {
        top: -3px;
        right: -3px;
      }

      /* ── Chip event log ─────────────────────────────────────────────── */
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
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 12px;
      }

      .event-log-time {
        color: var(--tulpar-color-text-muted, #74777a);
        flex: none;
      }

      .event-log-msg {
        color: var(--tulpar-color-text-primary, #15110b);
      }

      /* ── Skeleton specifics ─────────────────────────────────────────── */
      .skel-variants {
        align-items: flex-start;
        gap: 24px;
      }

      .skel-block {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 180px;
        flex: 1;
        max-width: 260px;
      }

      .skel-block--circle {
        min-width: 0;
        flex: none;
        max-width: none;
      }

      .skel-caption {
        font-size: 11px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .skel-card {
        display: flex;
        gap: 12px;
        align-items: center;
        width: 100%;
        max-width: 320px;
        padding: 14px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 10px;
        background: var(--tulpar-color-bg-surface, #fff);
      }

      .skel-card-body {
        flex: 1;
        min-width: 0;
      }

      /* ── Progress specifics ─────────────────────────────────────────── */
      .progress-stack {
        flex-direction: column;
        align-items: stretch;
        gap: 14px;
        max-width: 320px;
      }

      .progress-live {
        align-items: center;
        gap: 14px;
      }

      .progress-live-bars {
        align-items: center;
        gap: 24px;
      }

      .progress-slider {
        width: 220px;
        max-width: 100%;
        accent-color: var(--tulpar-color-brand-default, #00c57a);
      }

      .progress-value {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 13px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
        min-width: 44px;
      }

      .progress-circ-row {
        gap: 24px;
      }

      /* ── Trigger button (reused from other demos) ───────────────────── */
      .trigger-btn {
        font: inherit;
        font-size: 12.5px;
        font-weight: 600;
        border-radius: 8px;
        padding: 7px 13px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        background: var(--tulpar-color-bg-elevated, #ffffff);
        color: var(--tulpar-color-text-primary, #15110b);
        cursor: pointer;
        transition:
          transform 120ms ease,
          box-shadow 120ms ease;
        white-space: nowrap;
      }

      .trigger-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 8px -2px rgba(16, 24, 40, 0.12);
      }

      .trigger-btn:active {
        transform: translateY(0);
        box-shadow: none;
      }

      /* ── Code block ─────────────────────────────────────────────────── */
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
    `,
  ],
})
export class AtomsDemoComponent {
  // ── Code snippets ──────────────────────────────────────────────────────────
  readonly tagCode = TAG_CODE;
  readonly tagDualCode = TAG_DUAL_CODE;
  readonly badgeCode = BADGE_CODE;
  readonly badgeDualCode = BADGE_DUAL_CODE;
  readonly chipCode = CHIP_CODE;
  readonly chipDualCode = CHIP_DUAL_CODE;
  readonly avatarCode = AVATAR_CODE;
  readonly avatarDualCode = AVATAR_DUAL_CODE;
  readonly skeletonCode = SKELETON_CODE;
  readonly spinnerCode = SPINNER_CODE;
  readonly progressCode = PROGRESS_CODE;

  /** Inline caption for the circular formatter example (avoids raw braces in template). */
  readonly stepFormatterNote = '(v, min, max) => `${v}/${max} steps`';

  // ── 3. Chip — event log ─────────────────────────────────────────────────────
  private _eventId = 0;
  readonly chipEvents = signal<{ id: number; time: string; msg: string }[]>([]);

  logChip(msg: string): void {
    const time = new Date().toLocaleTimeString(undefined, {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    // Prepend newest first; cap at 30 entries.
    this.chipEvents.update((list) => [{ id: ++this._eventId, time, msg }, ...list].slice(0, 30));
  }

  clearLog(): void {
    this.chipEvents.set([]);
  }

  // ── 6. Spinner — delay demo ─────────────────────────────────────────────────
  readonly showDelayedSpinner = signal(false);
  toggleDelayedSpinner(): void {
    this.showDelayedSpinner.update((v) => !v);
  }

  // ── 7. Progress — live driver ───────────────────────────────────────────────
  readonly progressValue = signal(60);
  onProgressInput(e: Event): void {
    this.progressValue.set(Number((e.target as HTMLInputElement).value));
  }

  /** Formatter for the circular step example (function form of valueLabel). */
  readonly formatStep = (value: number, _min: number, max: number): string =>
    `${value}/${max} steps`;
}
