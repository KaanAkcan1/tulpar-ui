<script setup lang="ts">
import { ref } from "vue";
import { TulparButton } from "@tulpar-ui/vue";
import "@tulpar-ui/core/button-group";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Crown,
  Mail,
  Settings,
  Save,
  Download,
  Plus,
  Sparkles,
  Loader2,
} from "lucide-vue-next";

const submittedEmail = ref<string | null>(null);
const dataDisabledClicked = ref(false);

function onSubmit(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const fd = new FormData(form);
  submittedEmail.value = String(fd.get("email") ?? "");
}

function onDataDisabledClick() {
  dataDisabledClicked.value = true;
  setTimeout(() => (dataDisabledClicked.value = false), 2000);
}

// ─── Code snippets ────────────────────────────────────────────────────────────

const severityCode = `<TulparButton severity="primary">Primary</TulparButton>
<TulparButton severity="secondary">Secondary</TulparButton>
<TulparButton severity="info">Info</TulparButton>
<TulparButton severity="success">Success</TulparButton>
<TulparButton severity="warn">Warn</TulparButton>
<TulparButton severity="help">Help</TulparButton>
<TulparButton severity="danger">Danger</TulparButton>
<TulparButton severity="contrast">Contrast</TulparButton>
<TulparButton severity="premium">Premium</TulparButton>`;

const variantCode = `<TulparButton variant="solid">Solid</TulparButton>
<TulparButton variant="outlined">Outlined</TulparButton>
<TulparButton variant="tonal">Tonal</TulparButton>
<TulparButton variant="ghost">Ghost</TulparButton>
<TulparButton variant="link">Link</TulparButton>`;

const sizeCode = `<TulparButton size="xs">Extra Small</TulparButton>
<TulparButton size="sm">Small</TulparButton>
<TulparButton size="md">Medium</TulparButton>
<TulparButton size="lg">Large</TulparButton>
<TulparButton size="xl">Extra Large</TulparButton>
<TulparButton size="2xl">2XL</TulparButton>
<TulparButton size="3xl">3XL</TulparButton>`;

const colorCode = `<TulparButton color="ulgen">Ulgen</TulparButton>
<TulparButton color="otuken">Otuken</TulparButton>
<TulparButton color="kizagan">Kizagan</TulparButton>
<TulparButton color="kam">Kam</TulparButton>
<TulparButton color="yersu" variant="outlined">Yersu Outlined</TulparButton>
<TulparButton color="erlik" variant="tonal">Erlik Tonal</TulparButton>`;

const shapeCode = `<!-- Default (rectangle) -->
<TulparButton shape="default">Default</TulparButton>

<!-- Round (pill) -->
<TulparButton shape="round">Round</TulparButton>

<!-- Circle (icon-only) — :icon prop, auto icon-only -->
<TulparButton shape="circle" :icon="Plus" aria-label="Add item" />`;

const iconsCode = `<!-- Leading icon via :icon prop -->
<TulparButton severity="success" :icon="Check">Save</TulparButton>

<!-- Trailing icon — use slot="end" (single icon prop always renders at start) -->
<TulparButton severity="primary">
  Continue
  <span slot="end"><ArrowRight :size="16" /></span>
</TulparButton>

<!-- Both icons — :icon for start, slot="end" for trailing -->
<TulparButton severity="primary" :icon="Check">
  Save and continue
  <span slot="end"><ArrowRight :size="16" /></span>
</TulparButton>`;

const iconOnlyCode = `<!-- Auto icon-only: icon set + no text → icon-only applied automatically -->
<TulparButton severity="danger" :icon="Trash2" aria-label="Delete item" />
<TulparButton severity="secondary" :icon="Settings" aria-label="Settings" />

<!-- Auto icon-only + circle shape -->
<TulparButton severity="success" :icon="Save" shape="circle" aria-label="Save" />

<!-- Explicit iconOnly still works (useful when you need to be explicit) -->
<TulparButton severity="premium" :icon-only="true" shape="round" :icon="Crown" aria-label="Premium" />`;

const iconPositionCode = `<!-- Start (default) -->
<TulparButton :icon="Check" icon-position="start" size="lg">Confirm</TulparButton>

<!-- Top -->
<TulparButton :icon="Check" icon-position="top" size="lg">Confirm</TulparButton>

<!-- Bottom -->
<TulparButton :icon="Check" icon-position="bottom" size="lg">Confirm</TulparButton>

<!-- End — use slot="end" (icon prop is always in start slot) -->
<TulparButton icon-position="end" size="lg">
  Confirm
  <span slot="end"><Check :size="18" /></span>
</TulparButton>`;

const iconSeparatorCode = `<!-- Outlined + separator + leading icon -->
<TulparButton variant="outlined" :icon-separator="true" :icon="Download">Download</TulparButton>

<!-- Tonal + separator + both icons (leading via prop, trailing via slot) -->
<TulparButton variant="tonal" :icon-separator="true" :icon="ArrowLeft">
  Navigate
  <span slot="end"><ArrowRight :size="16" /></span>
</TulparButton>

<!-- Solid + separator + trailing icon -->
<TulparButton variant="solid" :icon-separator="true">
  Next
  <span slot="end"><ArrowRight :size="16" /></span>
</TulparButton>`;

const modifiersCode = `<!-- Raised solid -->
<TulparButton :raised="true">Raised Solid</TulparButton>

<!-- Raised outlined -->
<TulparButton :raised="true" variant="outlined">Raised Outlined</TulparButton>

<!-- Block (full-width) -->
<TulparButton :block="true">Block Button</TulparButton>

<!-- Block + justify=between with icons -->
<TulparButton :block="true" justify="between" :icon="Mail">
  Send Email
  <span slot="end"><ArrowRight :size="16" /></span>
</TulparButton>`;

const loadingCode = `<!-- Loading (default center) -->
<TulparButton :loading="true">Save</TulparButton>

<!-- Loading position start -->
<TulparButton :loading="true" loading-position="start">Save</TulparButton>

<!-- Loading position end -->
<TulparButton :loading="true" loading-position="end">Save</TulparButton>

<!-- Loading with label -->
<TulparButton :loading="true" loading-label="Saving…">Save</TulparButton>

<!-- Loading with custom icon (Loader2 spinning) -->
<TulparButton :loading="true" severity="success">
  <span slot="loading-icon" class="spin-icon">
    <Loader2 :size="16" />
  </span>
  Upload
</TulparButton>`;

const disabledCode = `<!-- Regular disabled (no interaction) -->
<TulparButton :disabled="true">Disabled</TulparButton>

<!-- data-disabled (click still fires — useful with tooltip wrapper) -->
<div title="You need edit permissions to perform this action">
  <TulparButton :data-disabled="true" @click="onDataDisabledClick">
    Restricted Action
  </TulparButton>
</div>`;

const polymorphismCode = `<!-- External link — renders as <a> -->
<TulparButton href="https://example.com" target="_blank" rel="noopener noreferrer">
  <span slot="start"><ArrowRight :size="16" /></span>
  Visit Example
</TulparButton>

<!-- Internal link -->
<TulparButton href="/dashboard" severity="secondary" variant="outlined">
  Go to Dashboard
</TulparButton>`;

const formCode = `<form @submit="onSubmit">
  <input name="email" type="email" placeholder="your@email.com" />
  <TulparButton type="submit" severity="primary" :icon="Mail">Submit</TulparButton>
  <TulparButton type="reset" severity="secondary" variant="outlined">
    Reset
  </TulparButton>
</form>`;

const buttonGroupCode = `<!-- Horizontal group (ArrowLeft/Right navigation) -->
<tulpar-button-group>
  <tulpar-button severity="secondary" variant="outlined">Day</tulpar-button>
  <tulpar-button severity="secondary" variant="outlined">Week</tulpar-button>
  <tulpar-button severity="secondary" variant="outlined">Month</tulpar-button>
</tulpar-button-group>

<!-- Stacked group (ArrowUp/Down navigation) -->
<tulpar-button-group stacked>
  <tulpar-button severity="secondary" variant="ghost">Edit profile</tulpar-button>
  <tulpar-button severity="secondary" variant="ghost">Settings</tulpar-button>
  <tulpar-button severity="danger" variant="ghost">Sign out</tulpar-button>
</tulpar-button-group>

<!-- Keyboard navigation:
  Horizontal: ArrowLeft / ArrowRight
  Stacked:    ArrowUp / ArrowDown
  Both:       Home (first) / End (last) -->`;

const premiumCode = `<!-- Solid premium — gold marketing CTA -->
<TulparButton severity="premium" :icon="Crown">Upgrade to Pro</TulparButton>

<!-- Tonal premium — softer CTA -->
<TulparButton severity="premium" variant="tonal" :icon="Sparkles">Get early access</TulparButton>

<!-- Icon-size override for premium large CTA -->
<TulparButton severity="premium" size="lg" :icon="Crown" :icon-size="24">Go Pro</TulparButton>

<!-- premium = gold accent, distinct from primary (navy)
     Light theme: gold.500 bg + dark text
     Hover: brightens (gold.500 → .400 → .300) -->`;

const tooltipCode = `<!-- Tooltip on icon-only button (fills the a11y gap) -->
<TulparButton :icon="Settings" tooltip="Open settings" aria-label="Open settings" />

<!-- Tooltip on a regular button -->
<TulparButton severity="danger" :icon="Trash2" tooltip="Permanently delete this item">
  Delete
</TulparButton>

<!-- Tooltip on an anchor button -->
<TulparButton
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  tooltip="Opens in a new tab"
>
  Visit Example
</TulparButton>`;

const iconPropCode = `<!-- :icon prop — convenience for Lucide icons (replaces verbose slot boilerplate) -->
<TulparButton severity="success" :icon="Check">Save</TulparButton>

<!-- :icon-size override — useful for larger CTAs -->
<TulparButton severity="premium" size="lg" :icon="Crown" :icon-size="24">Go Pro</TulparButton>

<!-- Auto icon-only: icon + no text = square, no extra props needed -->
<TulparButton severity="danger" :icon="Trash2" aria-label="Delete" />

<!-- Icon prop respects icon-position for top/bottom layouts -->
<TulparButton :icon="Check" icon-position="top" size="lg">Confirm</TulparButton>`;

const slotEscapeHatchCode = `<!-- Escape hatch: non-Lucide libraries (Heroicons, Tabler, custom SVG) -->
<!-- When :icon is not an option, use <span slot="start"> directly -->
<TulparButton severity="primary">
  <span slot="start">
    <!-- Any Vue component, SVG, or img that accepts width/height -->
    <MyHeroIcon class="w-4 h-4" />
  </span>
  Save with Heroicon
</TulparButton>

<!-- Multi-icon pattern (two icons) — slot is the only option here;
     :icon supports a single leading icon only -->
<TulparButton severity="primary">
  <span slot="start"><ArrowLeft :size="16" /></span>
  Navigate
  <span slot="end"><ArrowRight :size="16" /></span>
</TulparButton>`;
</script>

<template>
  <div class="demo-page">
    <header class="demo-page-header">
      <p class="eyebrow">Tulpar UI · Vue · v0.6</p>
      <h1 class="page-title">Button — full feature reference</h1>
      <p class="page-lede">Live previews and copy-paste code for every Button capability.</p>
    </header>

    <!-- ── 1. Severity ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Severity</h2>
      <p class="section-desc">
        Nine semantic severity values covering the full intent palette. Default variant is
        <code class="inline-code">solid</code>.
      </p>
      <div class="preview">
        <TulparButton severity="primary">Primary</TulparButton>
        <TulparButton severity="secondary">Secondary</TulparButton>
        <TulparButton severity="info">Info</TulparButton>
        <TulparButton severity="success">Success</TulparButton>
        <TulparButton severity="warn">Warn</TulparButton>
        <TulparButton severity="help">Help</TulparButton>
        <TulparButton severity="danger">Danger</TulparButton>
        <TulparButton severity="contrast">Contrast</TulparButton>
        <TulparButton severity="premium">Premium</TulparButton>
      </div>
      <pre class="code"><code>{{ severityCode }}</code></pre>
    </section>

    <!-- ── 2. Variant ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Variant</h2>
      <p class="section-desc">
        Five rendering styles. All examples use
        <code class="inline-code">severity="primary"</code>.
      </p>
      <div class="preview">
        <TulparButton variant="solid">Solid</TulparButton>
        <TulparButton variant="outlined">Outlined</TulparButton>
        <TulparButton variant="tonal">Tonal</TulparButton>
        <TulparButton variant="ghost">Ghost</TulparButton>
        <TulparButton variant="link">Link</TulparButton>
      </div>
      <pre class="code"><code>{{ variantCode }}</code></pre>
    </section>

    <!-- ── 3. Size ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Size</h2>
      <p class="section-desc">
        Seven sizes from <code class="inline-code">xs</code> to
        <code class="inline-code">3xl</code>. Default is <code class="inline-code">md</code>.
      </p>
      <div class="preview preview--baseline">
        <TulparButton size="xs">Extra Small</TulparButton>
        <TulparButton size="sm">Small</TulparButton>
        <TulparButton size="md">Medium</TulparButton>
        <TulparButton size="lg">Large</TulparButton>
        <TulparButton size="xl">Extra Large</TulparButton>
        <TulparButton size="2xl">2XL</TulparButton>
        <TulparButton size="3xl">3XL</TulparButton>
      </div>
      <pre class="code"><code>{{ sizeCode }}</code></pre>
    </section>

    <!-- ── 4. Color override ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Color override</h2>
      <p class="section-desc">
        The <code class="inline-code">color</code> prop overrides the severity's palette with any
        design-system color. Severity remains as a DOM hint for accessibility semantics.
      </p>
      <div class="preview">
        <TulparButton color="ulgen">Ulgen</TulparButton>
        <TulparButton color="otuken">Otuken</TulparButton>
        <TulparButton color="kizagan">Kizagan</TulparButton>
        <TulparButton color="kam">Kam</TulparButton>
        <TulparButton color="yersu" variant="outlined">Yersu Outlined</TulparButton>
        <TulparButton color="erlik" variant="tonal">Erlik Tonal</TulparButton>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 5. Shape ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Shape</h2>
      <p class="section-desc">
        <code class="inline-code">default</code> (rectangle),
        <code class="inline-code">round</code> (pill), and
        <code class="inline-code">circle</code> (icon-only).
      </p>
      <div class="preview">
        <TulparButton shape="default">Default</TulparButton>
        <TulparButton shape="round">Round</TulparButton>
        <TulparButton shape="circle" :icon="Plus" aria-label="Add item" />
      </div>
      <pre class="code"><code>{{ shapeCode }}</code></pre>
    </section>

    <!-- ── 6. Icons — leading, trailing, both ──────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Icons — leading, trailing, both</h2>
      <p class="section-desc">
        Use the <code class="inline-code">:icon</code> prop for Lucide icons — it renders into the
        <code class="inline-code">slot="start"</code> automatically. For a trailing icon, use
        <code class="inline-code">&#60;span slot="end"&#62;</code>. For multi-icon, combine both.
      </p>
      <div class="preview">
        <TulparButton severity="success" :icon="Check">Save</TulparButton>
        <TulparButton severity="primary">
          Continue
          <span slot="end"><ArrowRight :size="16" /></span>
        </TulparButton>
        <TulparButton severity="primary" :icon="Check">
          Save and continue
          <span slot="end"><ArrowRight :size="16" /></span>
        </TulparButton>
      </div>
      <pre class="code"><code>{{ iconsCode }}</code></pre>
    </section>

    <!-- ── 7. Icon-only ────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Icon-only</h2>
      <p class="section-desc">
        When <code class="inline-code">:icon</code> is set and no text is in the default slot,
        icon-only mode is applied <em>automatically</em> — no extra prop needed. Always include
        <code class="inline-code">aria-label</code> for screen reader accessibility.
      </p>
      <div class="preview preview--baseline">
        <TulparButton severity="danger" :icon="Trash2" aria-label="Delete item" />
        <TulparButton severity="secondary" :icon="Settings" aria-label="Settings" />
        <TulparButton severity="success" :icon="Save" shape="circle" aria-label="Save" />
        <TulparButton
          severity="premium"
          :icon-only="true"
          shape="round"
          :icon="Crown"
          aria-label="Premium"
        />
      </div>
      <pre class="code"><code>{{ iconOnlyCode }}</code></pre>
    </section>

    <!-- ── 8. Icon position ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Icon position</h2>
      <p class="section-desc">
        Control where the icon renders relative to the label:
        <code class="inline-code">start</code>, <code class="inline-code">end</code>,
        <code class="inline-code">top</code>, <code class="inline-code">bottom</code>. The
        <code class="inline-code">:icon</code> prop always renders in the start slot; for
        <code class="inline-code">icon-position="end"</code> use
        <code class="inline-code">&#60;span slot="end"&#62;</code>.
      </p>
      <div class="preview preview--baseline">
        <TulparButton :icon="Check" icon-position="start" size="lg">Confirm</TulparButton>
        <TulparButton icon-position="end" size="lg">
          Confirm
          <span slot="end"><Check :size="18" /></span>
        </TulparButton>
        <TulparButton :icon="Check" icon-position="top" size="lg">Confirm</TulparButton>
        <TulparButton :icon="Check" icon-position="bottom" size="lg">Confirm</TulparButton>
      </div>
      <pre class="code"><code>{{ iconPositionCode }}</code></pre>
    </section>

    <!-- ── 9. Icon separator ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Icon separator</h2>
      <p class="section-desc">
        The <code class="inline-code">icon-separator</code> prop draws a visual divider between icon
        and label. Works across all variants.
      </p>
      <div class="preview">
        <TulparButton variant="outlined" :icon-separator="true" :icon="Download"
          >Download</TulparButton
        >
        <TulparButton variant="tonal" :icon-separator="true" :icon="ArrowLeft">
          Navigate
          <span slot="end"><ArrowRight :size="16" /></span>
        </TulparButton>
        <TulparButton variant="solid" :icon-separator="true">
          Next
          <span slot="end"><ArrowRight :size="16" /></span>
        </TulparButton>
      </div>
      <pre class="code"><code>{{ iconSeparatorCode }}</code></pre>
    </section>

    <!-- ── 10. Modifiers ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Modifiers — raised, block, justify</h2>
      <p class="section-desc">
        <code class="inline-code">raised</code> adds a drop shadow.
        <code class="inline-code">block</code> stretches to full container width.
        <code class="inline-code">justify</code> controls internal content alignment (start / center
        / end / between).
      </p>
      <div class="preview preview--col">
        <div class="preview-row">
          <TulparButton :raised="true">Raised Solid</TulparButton>
          <TulparButton :raised="true" variant="outlined">Raised Outlined</TulparButton>
        </div>
        <TulparButton :block="true">Block Button</TulparButton>
        <TulparButton :block="true" justify="between" :icon="Mail">
          Send Email
          <span slot="end"><ArrowRight :size="16" /></span>
        </TulparButton>
      </div>
      <pre class="code"><code>{{ modifiersCode }}</code></pre>
    </section>

    <!-- ── 11. Loading states ─────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">11. Loading states</h2>
      <p class="section-desc">
        The <code class="inline-code">loading</code> prop disables interaction and shows a spinner.
        Control spinner position with <code class="inline-code">loading-position</code>. Provide a
        <code class="inline-code">loading-label</code> for status announcements. Use
        <code class="inline-code">slot="loading-icon"</code> to swap the spinner with a custom icon.
      </p>
      <div class="preview">
        <TulparButton :loading="true">Save</TulparButton>
        <TulparButton :loading="true" loading-position="start">Save</TulparButton>
        <TulparButton :loading="true" loading-position="end">Save</TulparButton>
        <TulparButton :loading="true" loading-label="Saving…">Save</TulparButton>
        <TulparButton :loading="true" severity="success">
          <span slot="loading-icon" class="spin-icon">
            <Loader2 :size="16" />
          </span>
          Upload
        </TulparButton>
      </div>
      <pre class="code"><code>{{ loadingCode }}</code></pre>
    </section>

    <!-- ── 12. Disabled vs data-disabled ─────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">12. Disabled vs data-disabled</h2>
      <p class="section-desc">
        <code class="inline-code">disabled</code> prevents all interaction.
        <code class="inline-code">data-disabled</code> applies disabled styling but still fires
        click events — useful when wrapping with a tooltip that explains why the action is
        unavailable.
      </p>
      <div class="preview preview--baseline">
        <TulparButton :disabled="true">Disabled</TulparButton>
        <div title="You need edit permissions to perform this action">
          <TulparButton :data-disabled="true" @click="onDataDisabledClick">
            Restricted Action
          </TulparButton>
        </div>
        <span v-if="dataDisabledClicked" class="click-feedback">Click received!</span>
      </div>
      <pre class="code"><code>{{ disabledCode }}</code></pre>
    </section>

    <!-- ── 13. Polymorphism ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">13. Polymorphism — href renders &lt;a&gt;</h2>
      <p class="section-desc">
        Pass an <code class="inline-code">href</code> prop to render the button as an anchor
        element. All ARIA and keyboard semantics are preserved.
      </p>
      <div class="preview">
        <TulparButton href="https://example.com" target="_blank" rel="noopener noreferrer">
          <span slot="start"><ArrowRight :size="16" /></span>
          Visit Example
        </TulparButton>
        <TulparButton href="/dashboard" severity="secondary" variant="outlined">
          Go to Dashboard
        </TulparButton>
      </div>
      <pre class="code"><code>{{ polymorphismCode }}</code></pre>
    </section>

    <!-- ── 14. Form integration ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">14. Form integration</h2>
      <p class="section-desc">
        <code class="inline-code">type="submit"</code> and
        <code class="inline-code">type="reset"</code> integrate with native HTML forms via
        <code class="inline-code">formAssociated</code> internals — no extra wiring needed.
      </p>
      <div class="preview preview--col">
        <form class="demo-form" @submit="onSubmit">
          <input class="demo-input" name="email" type="email" placeholder="your@email.com" />
          <TulparButton type="submit" severity="primary" :icon="Mail">Submit</TulparButton>
          <TulparButton type="reset" severity="secondary" variant="outlined"> Reset </TulparButton>
        </form>
        <p v-if="submittedEmail !== null" class="submit-feedback">
          Submitted: <strong>{{ submittedEmail || "(empty)" }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ formCode }}</code></pre>
    </section>

    <!-- ── 15. Button Group ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">15. Button Group — horizontal + stacked</h2>
      <p class="section-desc">
        <code class="inline-code">&#60;tulpar-button-group&#62;</code> manages roving tabindex and
        keyboard navigation. Horizontal: <kbd>ArrowLeft</kbd> / <kbd>ArrowRight</kbd>. Stacked (add
        <code class="inline-code">stacked</code> attr): <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd>.
        Both: <kbd>Home</kbd> / <kbd>End</kbd>.
      </p>
      <div class="preview preview--col">
        <div>
          <p class="preview-label">Horizontal</p>
          <tulpar-button-group>
            <tulpar-button severity="secondary" variant="outlined">Day</tulpar-button>
            <tulpar-button severity="secondary" variant="outlined">Week</tulpar-button>
            <tulpar-button severity="secondary" variant="outlined">Month</tulpar-button>
          </tulpar-button-group>
        </div>
        <div>
          <p class="preview-label">Stacked</p>
          <tulpar-button-group stacked>
            <tulpar-button severity="secondary" variant="ghost">Edit profile</tulpar-button>
            <tulpar-button severity="secondary" variant="ghost">Settings</tulpar-button>
            <tulpar-button severity="danger" variant="ghost">Sign out</tulpar-button>
          </tulpar-button-group>
        </div>
      </div>
      <pre class="code"><code>{{ buttonGroupCode }}</code></pre>
    </section>

    <!-- ── 16. Premium CTA ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">16. Premium CTA — the gold marketing example</h2>
      <p class="section-desc">
        <code class="inline-code">severity="premium"</code> is the gold accent for marketing
        calls-to-action. Light theme: gold.500 background + dark text. Hover
        <em>brightens</em> (gold.500 → .400 → .300) — intentionally distinct from
        <code class="inline-code">primary</code> (navy), which darkens on hover.
      </p>
      <div class="preview preview--baseline">
        <TulparButton severity="premium" :icon="Crown">Upgrade to Pro</TulparButton>
        <TulparButton severity="premium" variant="tonal" :icon="Sparkles"
          >Get early access</TulparButton
        >
        <TulparButton severity="premium" size="lg" :icon="Crown" :icon-size="24"
          >Go Pro</TulparButton
        >
      </div>
      <pre class="code"><code>{{ premiumCode }}</code></pre>
    </section>

    <!-- ── 17. :icon prop — Lucide convenience API ───────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">17. :icon prop — Lucide convenience API (v0.3.1)</h2>
      <p class="section-desc">
        Pass any <code class="inline-code">lucide-vue-next</code> component reference via
        <code class="inline-code">:icon</code>. The wrapper renders it into
        <code class="inline-code">slot="start"</code> at the correct size for the button's
        <code class="inline-code">size</code>. Use <code class="inline-code">:icon-size</code>
        to override. Auto icon-only kicks in when no default-slot text is provided.
      </p>
      <div class="preview preview--baseline">
        <TulparButton severity="success" :icon="Check">Save</TulparButton>
        <TulparButton severity="premium" size="lg" :icon="Crown" :icon-size="24"
          >Go Pro</TulparButton
        >
        <TulparButton severity="danger" :icon="Trash2" aria-label="Delete" />
        <TulparButton :icon="Check" icon-position="top" size="lg">Confirm</TulparButton>
      </div>
      <pre class="code"><code>{{ iconPropCode }}</code></pre>
    </section>

    <!-- ── 18. Tooltip ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">18. Tooltip (v0.3.1)</h2>
      <p class="section-desc">
        Pass a string to <code class="inline-code">tooltip</code> to show an inline tooltip on hover
        and focus. Especially useful for icon-only buttons where the label is visually hidden — the
        tooltip satisfies the a11y gap alongside <code class="inline-code">aria-label</code>.
        Tooltip appears below the button, 150 ms fade.
      </p>
      <div class="preview preview--baseline">
        <TulparButton :icon="Settings" tooltip="Open settings" aria-label="Open settings" />
        <TulparButton severity="danger" :icon="Trash2" tooltip="Permanently delete this item">
          Delete
        </TulparButton>
        <TulparButton
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          tooltip="Opens in a new tab"
        >
          Visit Example
        </TulparButton>
      </div>
      <pre class="code"><code>{{ tooltipCode }}</code></pre>
    </section>

    <!-- ── 19. Escape hatch — non-Lucide icon libraries ──────────────── -->
    <section class="doc-section">
      <h2 class="section-title">19. Escape hatch — non-Lucide icon libraries</h2>
      <p class="section-desc">
        The <code class="inline-code">:icon</code> prop is Lucide-optimised (passes
        <code class="inline-code">:size</code> automatically). For Heroicons, Tabler, Material, or
        custom SVG, project your icon directly via
        <code class="inline-code">&#60;span slot="start"&#62;</code> — the slot pattern still works
        as the underlying Web Component escape hatch. Multi-icon layouts (two icons) also require
        the slot pattern, since <code class="inline-code">:icon</code> supports a single leading
        icon only.
      </p>
      <div class="preview preview--baseline">
        <TulparButton severity="primary">
          <span slot="start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </span>
          Save with custom icon
        </TulparButton>
        <TulparButton severity="secondary" variant="outlined">
          <span slot="start"><ArrowLeft :size="16" /></span>
          Navigate
          <span slot="end"><ArrowRight :size="16" /></span>
        </TulparButton>
      </div>
      <pre class="code"><code>{{ slotEscapeHatchCode }}</code></pre>
    </section>
  </div>
</template>

<style scoped>
.demo-page-header {
  margin-bottom: 40px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
}

.page-title {
  margin: 0 0 12px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 32px;
  font-weight: 600;
  line-height: 1.15;
  color: var(--tulpar-color-text-primary, #15110b);
}

.page-lede {
  margin: 0;
  font-size: 15px;
  color: var(--tulpar-color-text-secondary, #57534e);
  max-width: 620px;
  line-height: 1.6;
}

.doc-section {
  padding-bottom: 48px;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.doc-section:last-child {
  border-bottom: none;
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
  max-width: 620px;
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
  gap: 8px;
  align-items: center;
}

.preview--baseline {
  align-items: baseline;
}

.preview--col {
  flex-direction: column;
  align-items: flex-start;
}

.preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.preview-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
}

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

.demo-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.demo-input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 6px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  color: var(--tulpar-color-text-primary, #15110b);
  font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
  font-size: 14px;
  min-width: 220px;
}

.submit-feedback {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

.click-feedback {
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

kbd {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 3px;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 11px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  color: var(--tulpar-color-text-primary, #15110b);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spin-icon {
  display: inline-flex;
  animation: spin 1s linear infinite;
}
</style>
