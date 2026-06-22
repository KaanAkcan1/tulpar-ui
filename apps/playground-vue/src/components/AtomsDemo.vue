<script setup lang="ts">
/**
 * AtomsDemo — Display & Status atoms showcase (v0.13).
 *
 * Vue mirror of playground-ng's AtomsDemoComponent — same seven doc-sections,
 * same section labels / ordering / copy, same capability rows + dual prop/slot
 * cards. Framework idioms differ only: <TulparTag> etc. from @tulpar-ui/vue,
 * slot forms via <template #icon>/<template #avatar>/<template #label> and the
 * default slot, chip events via @clicked/@removed, and the progress formatter
 * bound as a prop (:value-label="formatStep").
 */
import { ref } from "vue";
import {
  TulparTag,
  TulparBadge,
  TulparChip,
  TulparAvatar,
  TulparSkeleton,
  TulparSpinner,
  TulparProgress,
} from "@tulpar-ui/vue";

// ─── Code snippet strings ─────────────────────────────────────────────────────

const tagCode = `<!-- Tone × variant. Tone always pairs with a dot / icon / text. -->
<TulparTag tone="info"    dot label="In review" />
<TulparTag tone="success" dot label="Active" />
<TulparTag tone="warning" variant="outline" dot label="Pending" />
<TulparTag tone="danger"  variant="solid"   dot label="Blocked" />

<!-- Shapes: square (default) · pill · sharp -->
<TulparTag tone="info" shape="square" label="square" />
<TulparTag tone="info" shape="pill"   label="pill" />
<TulparTag tone="info" shape="sharp"  label="sharp" />

<!-- Sizes: xs · sm · md · lg · xl -->
<TulparTag tone="success" size="xs" dot label="xs" />
<TulparTag tone="success" size="xl" dot label="xl" />

<!-- Custom tone (brand family or raw color) -->
<TulparTag tone="custom" color="ilay"    label="ilay" />
<TulparTag tone="custom" color="#0d9488" label="#0d9488" />`;

const tagDualCode = `<!-- LABEL — prop form vs slot form (slot wins when both set) -->
<TulparTag tone="info" dot label="Prop label" />
<TulparTag tone="info" dot>Slot label</TulparTag>

<!-- ICON — prop form (raw SVG / emoji) vs slot form -->
<TulparTag tone="success" icon="✓" label="Prop icon" />
<TulparTag tone="success" label="Slot icon">
  <template #icon>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
         stroke-width="2"><path d="M3 8l3.5 3.5L13 4"/></svg>
  </template>
</TulparTag>`;

const badgeCode = `<!-- Count + overflow cap (max → "99+"), tabular-nums -->
<TulparBadge tone="neutral" :count="3" />
<TulparBadge tone="info"    :count="8" />
<TulparBadge tone="danger"  :count="128" :max="99" />

<!-- show-zero: render even when count === 0 (hidden by default) -->
<TulparBadge tone="neutral" :count="0" />                <!-- hidden -->
<TulparBadge tone="neutral" :count="0" show-zero />      <!-- "0" -->

<!-- Dot mode (bare status, ignores count) -->
<TulparBadge tone="success" dot />
<TulparBadge tone="warning" dot />

<!-- Variants · shapes · sizes -->
<TulparBadge tone="info" variant="soft-tonal" :count="5" />
<TulparBadge tone="info" variant="outline"    :count="5" />
<TulparBadge tone="info" shape="square" :count="5" />
<TulparBadge tone="info" size="lg"      :count="5" />`;

const badgeDualCode = `<!-- LABEL — prop form vs slot form (slot wins; prop seeds a11y noun) -->
<TulparBadge tone="success" label="NEW" />
<TulparBadge tone="success">NEW</TulparBadge>`;

const chipCode = `// clickable — bridges the core CustomEvent to the @clicked output
<TulparChip tone="info" label="All" @clicked="log('clicked: All')" />
<TulparChip tone="info" label="Open" @clicked="log('clicked: Open')" />

// removable — the ✕ is an independent tab stop → @removed output
<TulparChip label="kaan@x.com" removable
            @removed="log('removed: kaan@x.com')" />

// avatar + removable
<TulparChip label="Jane Doe" avatar="JD" removable
            @removed="log('removed: Jane Doe')" />

// ghost (toolbar filter) — transparent rest, soft-tonal hover
<TulparChip variant="ghost" label="Status" />

// disabled — no events, not focusable, dimmed
<TulparChip label="Archived" disabled />

// shapes · sizes · custom tone
<TulparChip tone="success" shape="pill" label="pill" />
<TulparChip tone="success" size="xs"    label="xs" />
<TulparChip tone="custom"  color="gok"  label="gok" />`;

const chipDualCode = `<!-- LABEL — prop vs slot -->
<TulparChip tone="info" label="Prop label" />
<TulparChip tone="info">Slot label</TulparChip>

<!-- ICON — prop (raw SVG / emoji) vs slot -->
<TulparChip tone="success" icon="✓" label="Prop icon" />
<TulparChip tone="success" label="Slot icon">
  <template #icon>
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
         stroke-width="2"><path d="M3 8l3.5 3.5L13 4"/></svg>
  </template>
</TulparChip>

<!-- AVATAR — prop (initials / image URL) vs slot -->
<TulparChip label="Prop avatar" avatar="KA" />
<TulparChip label="Slot avatar">
  <template #avatar>🦄</template>
</TulparChip>`;

const avatarCode = `<!-- Cascade: image src → initials (from name / initials) → icon fallback -->
<TulparAvatar src="https://i.pravatar.cc/96?img=12" name="Ada Byron" /> <!-- image -->
<TulparAvatar name="Jane Doe" />                                        <!-- initials JD -->
<TulparAvatar initials="KA" name="Kaan Akcan" />                        <!-- override -->
<TulparAvatar />                                                        <!-- icon fallback -->

<!-- Deterministic palette-locked color from name (or explicit color) -->
<TulparAvatar name="Mehmet Özkan" />
<TulparAvatar initials="RT" color="ilay" />

<!-- Shapes: rounded-square (default) · circle -->
<TulparAvatar name="Ada Byron" shape="rounded-square" />
<TulparAvatar name="Ada Byron" shape="circle" />

<!-- Sizes: xs · sm · md · lg · xl -->
<TulparAvatar name="AB" size="xs" />
<TulparAvatar name="AB" size="xl" />`;

const avatarDualCode = `<!-- DEFAULT content — prop (initials / name) vs slot (custom node) -->
<!-- prop form: initials drive the rendered content -->
<TulparAvatar initials="JD" name="Jane Doe" />

<!-- slot form: the default slot overrides the whole cascade -->
<TulparAvatar name="Jane Doe">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" stroke-width="1.8">
    <circle cx="12" cy="8" r="3.2"/><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/>
  </svg>
</TulparAvatar>`;

const skeletonCode = `<!-- text variant — multi-line bars -->
<TulparSkeleton variant="text" :lines="4" />

<!-- rect / circle variants -->
<TulparSkeleton variant="rect"   height="72px" />
<TulparSkeleton variant="circle" width="40px" height="40px" />

<!-- explicit width / height / radius overrides -->
<TulparSkeleton variant="rect" width="120px" height="32px" radius="999px" />

<!-- animations: shimmer (default) · pulse · none -->
<TulparSkeleton variant="text" :lines="2" animation="shimmer" />
<TulparSkeleton variant="text" :lines="2" animation="pulse" />
<TulparSkeleton variant="text" :lines="2" animation="none" />`;

const spinnerCode = `<!-- sizes: xs · sm · md · lg · xl -->
<TulparSpinner size="xs" /><TulparSpinner size="md" /><TulparSpinner size="xl" />

<!-- tones (built-in colorize; omit → inherits currentColor) -->
<TulparSpinner tone="info" />
<TulparSpinner tone="success" />
<TulparSpinner tone="danger" />
<TulparSpinner tone="custom" color="ilay" />

<!-- track ring (default true) — set :track="false" for arc only -->
<TulparSpinner tone="info" :track="false" />

<!-- delay (ms) — avoid flashing on fast loads -->
<TulparSpinner :delay="500" />

<!-- accessible label — prop vs slot (visually hidden, slot wins) -->
<TulparSpinner label="Loading…" />
<TulparSpinner><template #label>Saving changes…</template></TulparSpinner>`;

const progressCode = `<!-- linear determinate (value 0..max) + value label (true → "N%") -->
<TulparProgress :value="42" :value-label="true" />
<TulparProgress :value="78" tone="success" :value-label="true" />

<!-- linear with buffer (secondary buffered value) -->
<TulparProgress :value="40" :buffer="65" />

<!-- linear indeterminate -->
<TulparProgress indeterminate />

<!-- thickness: thin · regular · thick -->
<TulparProgress :value="60" thickness="thin" />
<TulparProgress :value="60" thickness="thick" />

<!-- circular determinate + indeterminate; sizes sm · md · lg -->
<TulparProgress variant="circular" :value="70" :value-label="true" />
<TulparProgress variant="circular" indeterminate />
<TulparProgress variant="circular" :value="30" size="lg" tone="info" />

<!-- custom formatter (function form of valueLabel) -->
<TulparProgress :value="3" :max="5"
  :value-label="formatStep" />   // (v, min, max) => \`\${v}/\${max} steps\`

<!-- label slot (descriptive text above / beside the bar) -->
<TulparProgress :value="55"><template #label>Uploading…</template></TulparProgress>`;

/** Inline caption for the circular formatter example (avoids raw braces in template). */
const stepFormatterNote = "(v, min, max) => `${v}/${max} steps`";

// ─── 3. Chip — event log ──────────────────────────────────────────────────────
let _eventId = 0;
const chipEvents = ref<{ id: number; time: string; msg: string }[]>([]);

function logChip(msg: string): void {
  const time = new Date().toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  // Prepend newest first; cap at 30 entries.
  chipEvents.value = [{ id: ++_eventId, time, msg }, ...chipEvents.value].slice(0, 30);
}

function clearLog(): void {
  chipEvents.value = [];
}

// ─── 6. Spinner — delay demo ──────────────────────────────────────────────────
const showDelayedSpinner = ref(false);
function toggleDelayedSpinner(): void {
  showDelayedSpinner.value = !showDelayedSpinner.value;
}

// ─── 7. Progress — live driver ────────────────────────────────────────────────
const progressValue = ref(60);
function onProgressInput(e: Event): void {
  progressValue.value = Number((e.target as HTMLInputElement).value);
}

/** Formatter for the circular step example (function form of valueLabel). */
const formatStep = (value: number, _min: number, max: number): string => `${value}/${max} steps`;
</script>

<template>
  <div class="demo-page demo-page--atoms">
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
            <TulparTag tone="neutral" dot label="Neutral" />
            <TulparTag tone="info" dot label="Info" />
            <TulparTag tone="success" dot label="Success" />
            <TulparTag tone="warning" dot label="Warning" />
            <TulparTag tone="danger" dot label="Danger" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">outline</span>
          <div class="row-items">
            <TulparTag tone="neutral" variant="outline" dot label="Neutral" />
            <TulparTag tone="info" variant="outline" dot label="Info" />
            <TulparTag tone="success" variant="outline" dot label="Success" />
            <TulparTag tone="warning" variant="outline" dot label="Warning" />
            <TulparTag tone="danger" variant="outline" dot label="Danger" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">solid</span>
          <div class="row-items">
            <TulparTag tone="neutral" variant="solid" dot label="Neutral" />
            <TulparTag tone="info" variant="solid" dot label="Info" />
            <TulparTag tone="success" variant="solid" dot label="Success" />
            <TulparTag tone="warning" variant="solid" dot label="Warning" />
            <TulparTag tone="danger" variant="solid" dot label="Danger" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items">
            <TulparTag tone="info" shape="square" dot label="square" />
            <TulparTag tone="info" shape="pill" dot label="pill" />
            <TulparTag tone="info" shape="sharp" dot label="sharp" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items">
            <TulparTag tone="success" size="xs" dot label="xs" />
            <TulparTag tone="success" size="sm" dot label="sm" />
            <TulparTag tone="success" size="md" dot label="md" />
            <TulparTag tone="success" size="lg" dot label="lg" />
            <TulparTag tone="success" size="xl" dot label="xl" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">custom</span>
          <div class="row-items">
            <TulparTag tone="custom" color="ilay" dot label="ilay" />
            <TulparTag tone="custom" color="umay" dot label="umay" />
            <TulparTag tone="custom" color="gok" dot label="gok" />
            <TulparTag tone="custom" color="#0d9488" dot label="#0d9488" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">truncate</span>
          <div class="row-items">
            <TulparTag tone="neutral" label="truncates a very long label that overflows" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ tagCode }}</code></pre>

      <!-- Prop vs slot -->
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form</div>
          <div class="dual-body">
            <TulparTag tone="info" dot label="Prop label" />
            <TulparTag tone="success" icon="✓" label="Prop icon" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <TulparTag tone="info" dot>Slot label</TulparTag>
            <TulparTag tone="success" label="Slot icon">
              <template #icon>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </template>
            </TulparTag>
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
        <code class="inline-code">max</code> (e.g. <code class="inline-code">128 → 99+</code>) and use
        tabular figures so the width never jitters. <code class="inline-code">dot</code> mode shows
        bare status; <code class="inline-code">showZero</code> renders a
        <code class="inline-code">0</code> (hidden by default). Solid is the default variant.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">count</span>
          <div class="row-items">
            <TulparBadge tone="neutral" :count="3" />
            <TulparBadge tone="info" :count="8" />
            <TulparBadge tone="success" :count="24" />
            <TulparBadge tone="warning" :count="42" />
            <TulparBadge tone="danger" :count="128" :max="99" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">show-zero</span>
          <div class="row-items">
            <span class="zero-cell">
              <TulparBadge tone="neutral" :count="0" />
              <span class="zero-note">:count=0 → hidden</span>
            </span>
            <span class="zero-cell">
              <TulparBadge tone="neutral" :count="0" :show-zero="true" />
              <span class="zero-note">showZero → "0"</span>
            </span>
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">dot</span>
          <div class="row-items">
            <TulparBadge tone="success" dot />
            <TulparBadge tone="warning" dot />
            <TulparBadge tone="danger" dot />
            <TulparBadge tone="info" dot />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">variants</span>
          <div class="row-items">
            <TulparBadge tone="info" variant="solid" :count="5" />
            <TulparBadge tone="info" variant="soft-tonal" :count="5" />
            <TulparBadge tone="info" variant="outline" :count="5" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items">
            <TulparBadge tone="danger" shape="pill" :count="9" />
            <TulparBadge tone="danger" shape="square" :count="9" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items">
            <TulparBadge tone="success" size="sm" :count="7" />
            <TulparBadge tone="success" size="md" :count="7" />
            <TulparBadge tone="success" size="lg" :count="7" />
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
              <span class="badge-host-pin"><TulparBadge tone="danger" :count="5" /></span>
            </span>
            <span class="badge-host">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                <path d="M4 4h16v16H4z" />
              </svg>
              <span class="badge-host-pin badge-host-pin--dot">
                <TulparBadge tone="success" dot />
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
            <TulparBadge tone="success" label="NEW" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <TulparBadge tone="success">NEW</TulparBadge>
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
        <code class="inline-code">clicked</code>) and can carry an independent remove control
        (<code class="inline-code">removed</code>). <code class="inline-code">ghost</code> variant is
        transparent at rest and hovers into the soft tint (toolbar filters).
        <code class="inline-code">disabled</code> fires nothing and is not focusable. Interact below
        — the event log records every <code class="inline-code">clicked</code> /
        <code class="inline-code">removed</code>.
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">clickable</span>
          <div class="row-items">
            <TulparChip tone="neutral" label="All" @clicked="logChip('clicked: All')" />
            <TulparChip tone="info" icon="●" label="Open" @clicked="logChip('clicked: Open')" />
            <TulparChip tone="success" label="Done" @clicked="logChip('clicked: Done')" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">removable</span>
          <div class="row-items">
            <TulparChip
              label="kaan@x.com"
              removable
              @removed="logChip('removed: kaan@x.com')"
            />
            <TulparChip
              label="Jane Doe"
              avatar="JD"
              removable
              @removed="logChip('removed: Jane Doe')"
            />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">ghost</span>
          <div class="row-items">
            <TulparChip variant="ghost" label="Status" @clicked="logChip('clicked: Status')" />
            <TulparChip variant="ghost" label="Owner" @clicked="logChip('clicked: Owner')" />
            <TulparChip variant="ghost" label="Label" @clicked="logChip('clicked: Label')" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">disabled</span>
          <div class="row-items">
            <TulparChip label="Archived" disabled />
            <TulparChip label="Read-only" removable disabled />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items">
            <TulparChip tone="info" shape="square" label="square" />
            <TulparChip tone="info" shape="pill" label="pill" />
            <TulparChip tone="info" shape="sharp" label="sharp" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items">
            <TulparChip tone="success" size="xs" label="xs" />
            <TulparChip tone="success" size="sm" label="sm" />
            <TulparChip tone="success" size="md" label="md" />
            <TulparChip tone="success" size="lg" label="lg" />
            <TulparChip tone="success" size="xl" label="xl" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">custom</span>
          <div class="row-items">
            <TulparChip tone="custom" color="ilay" label="ilay" />
            <TulparChip tone="custom" color="gok" label="gok" />
            <TulparChip tone="custom" color="#0d9488" label="#0d9488" />
          </div>
        </div>

        <!-- Event log -->
        <div class="event-log" aria-live="polite">
          <div class="event-log-head">
            <span class="event-log-title">Event log</span>
            <button class="event-log-clear" type="button" @click="clearLog">Clear</button>
          </div>
          <div v-if="chipEvents.length === 0" class="event-log-empty">
            Click a chip or remove a removable chip…
          </div>
          <ul v-else class="event-log-list">
            <li v-for="e in chipEvents" :key="e.id" class="event-log-item">
              <span class="event-log-time">{{ e.time }}</span>
              <span class="event-log-msg">{{ e.msg }}</span>
            </li>
          </ul>
        </div>
      </div>
      <pre class="code"><code>{{ chipCode }}</code></pre>

      <!-- Prop vs slot -->
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form</div>
          <div class="dual-body">
            <TulparChip tone="info" label="Prop label" />
            <TulparChip tone="success" icon="✓" label="Prop icon" />
            <TulparChip label="Prop avatar" avatar="KA" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form</div>
          <div class="dual-body">
            <TulparChip tone="info">Slot label</TulparChip>
            <TulparChip tone="success" label="Slot icon">
              <template #icon>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 8l3.5 3.5L13 4" />
                </svg>
              </template>
            </TulparChip>
            <TulparChip label="Slot avatar">
              <template #avatar>🦄</template>
            </TulparChip>
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
            <TulparAvatar src="https://i.pravatar.cc/96?img=12" name="Ada Byron" />
            <TulparAvatar name="Jane Doe" />
            <TulparAvatar initials="KA" name="Kaan Akcan" />
            <TulparAvatar />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">color</span>
          <div class="row-items av-baseline">
            <TulparAvatar name="Ada Byron" />
            <TulparAvatar name="Jane Doe" />
            <TulparAvatar name="Mehmet Özkan" />
            <TulparAvatar name="Rachel Tang" />
            <TulparAvatar initials="IL" color="ilay" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">shapes</span>
          <div class="row-items av-baseline">
            <TulparAvatar name="Ada Byron" shape="rounded-square" />
            <TulparAvatar name="Ada Byron" shape="circle" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline">
            <TulparAvatar name="Ada Byron" size="xs" />
            <TulparAvatar name="Ada Byron" size="sm" />
            <TulparAvatar name="Ada Byron" size="md" />
            <TulparAvatar name="Ada Byron" size="lg" />
            <TulparAvatar name="Ada Byron" size="xl" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ avatarCode }}</code></pre>

      <!-- Prop vs slot -->
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (default content)</div>
          <div class="dual-body av-baseline">
            <TulparAvatar initials="JD" name="Jane Doe" size="lg" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (default content)</div>
          <div class="dual-body av-baseline">
            <TulparAvatar name="Jane Doe" size="lg">
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
            </TulparAvatar>
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
              <TulparSkeleton variant="text" :lines="4" />
              <span class="skel-caption">text · 4 lines</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="rect" height="72px" />
              <span class="skel-caption">rect</span>
            </div>
            <div class="skel-block skel-block--circle">
              <TulparSkeleton variant="circle" width="56px" height="56px" />
              <span class="skel-caption">circle</span>
            </div>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">overrides</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <TulparSkeleton variant="rect" width="160px" height="32px" radius="999px" />
              <span class="skel-caption">w/h/radius pill</span>
            </div>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">animations</span>
          <div class="row-items skel-variants">
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="3" animation="shimmer" />
              <span class="skel-caption">shimmer</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="3" animation="pulse" />
              <span class="skel-caption">pulse</span>
            </div>
            <div class="skel-block">
              <TulparSkeleton variant="text" :lines="3" animation="none" />
              <span class="skel-caption">none</span>
            </div>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">composed</span>
          <div class="row-items">
            <div class="skel-card">
              <TulparSkeleton variant="circle" width="40px" height="40px" />
              <div class="skel-card-body">
                <TulparSkeleton variant="text" :lines="1" width="60%" />
                <TulparSkeleton variant="text" :lines="1" width="40%" />
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
        <code class="inline-code">:track="false"</code> drops the track ring;
        <code class="inline-code">delay</code> defers render to avoid flashing on fast loads. The
        accessible label is visually hidden (prop or slot).
      </p>
      <div class="preview preview--col">
        <div class="demo-row">
          <span class="row-label">sizes</span>
          <div class="row-items av-baseline">
            <TulparSpinner size="xs" label="Loading" />
            <TulparSpinner size="sm" label="Loading" />
            <TulparSpinner size="md" label="Loading" />
            <TulparSpinner size="lg" label="Loading" />
            <TulparSpinner size="xl" label="Loading" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">tones</span>
          <div class="row-items av-baseline">
            <TulparSpinner tone="neutral" label="Loading" />
            <TulparSpinner tone="info" label="Loading" />
            <TulparSpinner tone="success" label="Loading" />
            <TulparSpinner tone="warning" label="Loading" />
            <TulparSpinner tone="danger" label="Loading" />
            <TulparSpinner tone="custom" color="ilay" label="Loading" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">track</span>
          <div class="row-items av-baseline">
            <TulparSpinner tone="info" :track="true" label="Loading" />
            <TulparSpinner tone="info" :track="false" label="Loading" />
          </div>
        </div>
        <div class="demo-row">
          <span class="row-label">delay</span>
          <div class="row-items av-baseline">
            <button class="trigger-btn" type="button" @click="toggleDelayedSpinner">
              {{ showDelayedSpinner ? "Hide" : "Show" }} (delay 500ms)
            </button>
            <TulparSpinner v-if="showDelayedSpinner" tone="info" :delay="500" label="Loading" />
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ spinnerCode }}</code></pre>

      <!-- Prop vs slot (accessible label) -->
      <div class="dual-grid">
        <div class="dual-card">
          <div class="dual-head">Prop form (label)</div>
          <div class="dual-body av-baseline">
            <TulparSpinner tone="info" size="lg" label="Loading…" />
            <span class="dual-note">label="Loading…" (visually hidden)</span>
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (label)</div>
          <div class="dual-body av-baseline">
            <TulparSpinner tone="info" size="lg">
              <template #label>Saving changes…</template>
            </TulparSpinner>
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
        <code class="inline-code">valueLabel</code> can be <code class="inline-code">true</code>
        (→ <code class="inline-code">N%</code>) or a formatter function.
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
              :value="progressValue"
              @input="onProgressInput"
              aria-label="Progress value"
            />
            <span class="progress-value">{{ progressValue }}%</span>
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">&nbsp;</span>
          <div class="row-items progress-live-bars">
            <TulparProgress :value="progressValue" :value-label="true" />
            <TulparProgress
              variant="circular"
              :value="progressValue"
              :value-label="true"
              size="md"
            />
          </div>
        </div>

        <div class="demo-row demo-row--top">
          <span class="row-label">linear det.</span>
          <div class="row-items progress-stack">
            <TulparProgress :value="42" :value-label="true" />
            <TulparProgress :value="78" tone="success" :value-label="true" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">buffer</span>
          <div class="row-items progress-stack">
            <TulparProgress :value="40" :buffer="65" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">indet.</span>
          <div class="row-items progress-stack">
            <TulparProgress indeterminate />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">thickness</span>
          <div class="row-items progress-stack">
            <TulparProgress :value="60" thickness="thin" />
            <TulparProgress :value="60" thickness="regular" />
            <TulparProgress :value="60" thickness="thick" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">circular</span>
          <div class="row-items av-baseline progress-circ-row">
            <TulparProgress variant="circular" :value="70" :value-label="true" />
            <TulparProgress variant="circular" indeterminate />
            <TulparProgress variant="circular" :value="30" size="sm" tone="info" />
            <TulparProgress variant="circular" :value="55" size="lg" tone="success" />
          </div>
        </div>
        <div class="demo-row demo-row--top">
          <span class="row-label">formatter</span>
          <div class="row-items av-baseline progress-circ-row">
            <TulparProgress
              variant="circular"
              :value="3"
              :max="5"
              size="lg"
              :value-label="formatStep"
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
            <TulparProgress :value="55" :value-label="true" />
          </div>
        </div>
        <div class="dual-card">
          <div class="dual-head">Slot form (label)</div>
          <div class="dual-body progress-stack">
            <TulparProgress :value="55">
              <template #label>Uploading…</template>
            </TulparProgress>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
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
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
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
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
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
</style>
