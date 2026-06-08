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

const isDark = ref(false);
const submittedEmail = ref<string | null>(null);
const dataDisabledClicked = ref(false);

function toggleDark() {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
}

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

const colorCode = `<TulparButton color="gold">Gold</TulparButton>
<TulparButton color="emerald">Emerald</TulparButton>
<TulparButton color="rose">Rose</TulparButton>
<TulparButton color="indigo">Indigo</TulparButton>
<TulparButton color="cyan" variant="outlined">Cyan Outlined</TulparButton>
<TulparButton color="purple" variant="tonal">Purple Tonal</TulparButton>`;

const shapeCode = `<!-- Default (rectangle) -->
<TulparButton shape="default">Default</TulparButton>

<!-- Round (pill) -->
<TulparButton shape="round">Round</TulparButton>

<!-- Circle (icon-only) -->
<TulparButton shape="circle" :icon-only="true" aria-label="Add item">
  <span slot="start"><Plus :size="16" /></span>
</TulparButton>`;

const iconsCode = `<!-- Leading icon -->
<TulparButton severity="success">
  <span slot="start"><Check :size="16" /></span>
  Save
</TulparButton>

<!-- Trailing icon -->
<TulparButton severity="primary">
  Continue
  <span slot="end"><ArrowRight :size="16" /></span>
</TulparButton>

<!-- Both icons -->
<TulparButton severity="primary">
  <span slot="start"><Check :size="16" /></span>
  Save and continue
  <span slot="end"><ArrowRight :size="16" /></span>
</TulparButton>`;

const iconOnlyCode = `<!-- Danger + default shape -->
<TulparButton severity="danger" :icon-only="true" aria-label="Delete item">
  <span slot="start"><Trash2 :size="16" /></span>
</TulparButton>

<!-- Secondary + default shape -->
<TulparButton severity="secondary" :icon-only="true" aria-label="Settings">
  <span slot="start"><Settings :size="16" /></span>
</TulparButton>

<!-- Success + circle shape -->
<TulparButton severity="success" :icon-only="true" shape="circle" aria-label="Save">
  <span slot="start"><Save :size="16" /></span>
</TulparButton>

<!-- Premium + round shape -->
<TulparButton severity="premium" :icon-only="true" shape="round" aria-label="Premium">
  <span slot="start"><Crown :size="16" /></span>
</TulparButton>`;

const iconPositionCode = `<!-- Start (default) -->
<TulparButton icon-position="start" size="lg">
  <span slot="start"><Check :size="16" /></span>
  Confirm
</TulparButton>

<!-- End -->
<TulparButton icon-position="end" size="lg">
  <span slot="end"><Check :size="16" /></span>
  Confirm
</TulparButton>

<!-- Top -->
<TulparButton icon-position="top" size="lg">
  <span slot="start"><Check :size="16" /></span>
  Confirm
</TulparButton>

<!-- Bottom -->
<TulparButton icon-position="bottom" size="lg">
  <span slot="start"><Check :size="16" /></span>
  Confirm
</TulparButton>`;

const iconSeparatorCode = `<!-- Outlined + separator + leading icon -->
<TulparButton variant="outlined" :icon-separator="true">
  <span slot="start"><Download :size="16" /></span>
  Download
</TulparButton>

<!-- Tonal + separator + both icons -->
<TulparButton variant="tonal" :icon-separator="true">
  <span slot="start"><ArrowLeft :size="16" /></span>
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
<TulparButton :block="true" justify="between">
  <span slot="start"><Mail :size="16" /></span>
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
  <TulparButton type="submit" severity="primary">
    <span slot="start"><Mail :size="16" /></span>
    Submit
  </TulparButton>
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
<TulparButton severity="premium">
  <span slot="start"><Crown :size="16" /></span>
  Upgrade to Pro
</TulparButton>

<!-- Tonal premium — softer CTA -->
<TulparButton severity="premium" variant="tonal">
  <span slot="start"><Sparkles :size="16" /></span>
  Get early access
</TulparButton>

<!-- premium = gold accent, distinct from primary (navy)
     Light theme: gold.500 bg + dark text
     Hover: brightens (gold.500 → .400 → .300) -->`;
</script>

<template>
  <div :class="['page', { dark: isDark }]">
    <header class="page-header">
      <div class="header-inner">
        <div class="header-text">
          <p class="eyebrow">Tulpar UI · Vue · v0.3</p>
          <h1 class="page-title">Button — full feature reference</h1>
          <p class="page-lede">
            Live previews and copy-paste code for every Button capability. All examples use Lucide
            icons and the <code class="inline-code">&#60;span slot="..."&#62;</code> projection
            pattern required for Shadow DOM slot routing.
          </p>
        </div>
        <button class="theme-toggle" @click="toggleDark">
          {{ isDark ? "☀ Light" : "☾ Dark" }}
        </button>
      </div>
    </header>

    <main class="main">
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
          Five rendering styles. All examples use <code class="inline-code">severity="primary"</code
          >.
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
          <code class="inline-code">3xl</code>. Default is
          <code class="inline-code">md</code>.
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
          <TulparButton color="gold">Gold</TulparButton>
          <TulparButton color="emerald">Emerald</TulparButton>
          <TulparButton color="rose">Rose</TulparButton>
          <TulparButton color="indigo">Indigo</TulparButton>
          <TulparButton color="cyan" variant="outlined">Cyan Outlined</TulparButton>
          <TulparButton color="purple" variant="tonal">Purple Tonal</TulparButton>
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
        <div class="preview preview--baseline">
          <TulparButton shape="default">Default</TulparButton>
          <TulparButton shape="round">Round</TulparButton>
          <TulparButton shape="circle" :icon-only="true" aria-label="Add item">
            <span slot="start"><Plus :size="16" /></span>
          </TulparButton>
        </div>
        <pre class="code"><code>{{ shapeCode }}</code></pre>
      </section>

      <!-- ── 6. Icons — leading, trailing, both ──────────────────────────── -->
      <section class="doc-section">
        <h2 class="section-title">6. Icons — leading, trailing, both</h2>
        <p class="section-desc">
          Wrap icons in
          <code class="inline-code">&#60;span slot="start"&#62;</code> or
          <code class="inline-code">&#60;span slot="end"&#62;</code> to route them into the correct
          Shadow DOM slot. Without the wrapping span, content falls to the default slot only.
        </p>
        <div class="preview">
          <TulparButton severity="success">
            <span slot="start"><Check :size="16" /></span>
            Save
          </TulparButton>
          <TulparButton severity="primary">
            Continue
            <span slot="end"><ArrowRight :size="16" /></span>
          </TulparButton>
          <TulparButton severity="primary">
            <span slot="start"><Check :size="16" /></span>
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
          Always include <code class="inline-code">aria-label</code> on icon-only buttons for
          screen reader accessibility.
        </p>
        <div class="preview preview--baseline">
          <TulparButton severity="danger" :icon-only="true" aria-label="Delete item">
            <span slot="start"><Trash2 :size="16" /></span>
          </TulparButton>
          <TulparButton severity="secondary" :icon-only="true" aria-label="Settings">
            <span slot="start"><Settings :size="16" /></span>
          </TulparButton>
          <TulparButton
            severity="success"
            :icon-only="true"
            shape="circle"
            aria-label="Save"
          >
            <span slot="start"><Save :size="16" /></span>
          </TulparButton>
          <TulparButton
            severity="premium"
            :icon-only="true"
            shape="round"
            aria-label="Premium"
          >
            <span slot="start"><Crown :size="16" /></span>
          </TulparButton>
        </div>
        <pre class="code"><code>{{ iconOnlyCode }}</code></pre>
      </section>

      <!-- ── 8. Icon position ────────────────────────────────────────────── -->
      <section class="doc-section">
        <h2 class="section-title">8. Icon position</h2>
        <p class="section-desc">
          Control where the icon renders relative to the label:
          <code class="inline-code">start</code>, <code class="inline-code">end</code>,
          <code class="inline-code">top</code>, <code class="inline-code">bottom</code>. Use
          <code class="inline-code">size="lg"</code> for top/bottom layouts to ensure a comfortable
          touch target.
        </p>
        <div class="preview preview--baseline">
          <TulparButton icon-position="start" size="lg">
            <span slot="start"><Check :size="16" /></span>
            Confirm
          </TulparButton>
          <TulparButton icon-position="end" size="lg">
            <span slot="end"><Check :size="16" /></span>
            Confirm
          </TulparButton>
          <TulparButton icon-position="top" size="lg">
            <span slot="start"><Check :size="16" /></span>
            Confirm
          </TulparButton>
          <TulparButton icon-position="bottom" size="lg">
            <span slot="start"><Check :size="16" /></span>
            Confirm
          </TulparButton>
        </div>
        <pre class="code"><code>{{ iconPositionCode }}</code></pre>
      </section>

      <!-- ── 9. Icon separator ───────────────────────────────────────────── -->
      <section class="doc-section">
        <h2 class="section-title">9. Icon separator</h2>
        <p class="section-desc">
          The <code class="inline-code">icon-separator</code> prop draws a visual divider between
          icon and label. Works across all variants.
        </p>
        <div class="preview">
          <TulparButton variant="outlined" :icon-separator="true">
            <span slot="start"><Download :size="16" /></span>
            Download
          </TulparButton>
          <TulparButton variant="tonal" :icon-separator="true">
            <span slot="start"><ArrowLeft :size="16" /></span>
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
          <code class="inline-code">justify</code> controls internal content alignment (start /
          center / end / between).
        </p>
        <div class="preview preview--col">
          <div class="preview-row">
            <TulparButton :raised="true">Raised Solid</TulparButton>
            <TulparButton :raised="true" variant="outlined">Raised Outlined</TulparButton>
          </div>
          <TulparButton :block="true">Block Button</TulparButton>
          <TulparButton :block="true" justify="between">
            <span slot="start"><Mail :size="16" /></span>
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
          The <code class="inline-code">loading</code> prop disables interaction and shows a
          spinner. Control spinner position with
          <code class="inline-code">loading-position</code>. Provide a
          <code class="inline-code">loading-label</code> for status announcements. Use
          <code class="inline-code">slot="loading-icon"</code> to swap the spinner with a custom
          icon.
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
            <input
              class="demo-input"
              name="email"
              type="email"
              placeholder="your@email.com"
            />
            <TulparButton type="submit" severity="primary">
              <span slot="start"><Mail :size="16" /></span>
              Submit
            </TulparButton>
            <TulparButton type="reset" severity="secondary" variant="outlined">
              Reset
            </TulparButton>
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
          <code class="inline-code">&#60;tulpar-button-group&#62;</code> manages roving
          tabindex and keyboard navigation. Horizontal: <kbd>ArrowLeft</kbd> /
          <kbd>ArrowRight</kbd>. Stacked (add <code class="inline-code">stacked</code> attr):
          <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd>. Both: <kbd>Home</kbd> / <kbd>End</kbd>.
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
        <div class="preview">
          <TulparButton severity="premium">
            <span slot="start"><Crown :size="16" /></span>
            Upgrade to Pro
          </TulparButton>
          <TulparButton severity="premium" variant="tonal">
            <span slot="start"><Sparkles :size="16" /></span>
            Get early access
          </TulparButton>
        </div>
        <pre class="code"><code>{{ premiumCode }}</code></pre>
      </section>
    </main>
  </div>
</template>

<style>
/* ─── Reset / base ──────────────────────────────────────────────────────────── */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
  background: var(--tulpar-color-bg-surface, #fafaf9);
  color: var(--tulpar-color-text-primary, #1c1917);
  line-height: 1.5;
}

/* ─── Page shell ───────────────────────────────────────────────────────────── */
.page {
  min-height: 100vh;
}

.page-header {
  background: var(--tulpar-color-bg-elevated, #ffffff);
  border-bottom: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  padding: 40px 32px 36px;
}

.header-inner {
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #78716c);
}

.page-title {
  margin: 0 0 12px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 36px;
  font-weight: 600;
  line-height: 1.15;
  color: var(--tulpar-color-text-primary, #1c1917);
}

.page-lede {
  margin: 0;
  font-size: 15px;
  color: var(--tulpar-color-text-secondary, #57534e);
  max-width: 620px;
  line-height: 1.6;
}

.theme-toggle {
  flex-shrink: 0;
  padding: 8px 16px;
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 6px;
  background: var(--tulpar-color-bg-surface, #fafaf9);
  color: var(--tulpar-color-text-primary, #1c1917);
  font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
}

.theme-toggle:hover {
  background: var(--tulpar-color-bg-subtle, #f5f5f4);
}

/* ─── Main content ─────────────────────────────────────────────────────────── */
.main {
  max-width: 920px;
  margin: 0 auto;
  padding: 40px 32px 80px;
}

/* ─── Section ──────────────────────────────────────────────────────────────── */
.doc-section {
  padding-bottom: 48px;
  margin-bottom: 48px;
  border-bottom: 1px solid var(--tulpar-color-border-default, #e7e5e4);
}

.doc-section:last-child {
  border-bottom: none;
}

.section-title {
  margin: 0 0 10px;
  font-family: var(--tulpar-font-family-display, Georgia, serif);
  font-size: 26px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #1c1917);
}

.section-desc {
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
  max-width: 620px;
  line-height: 1.6;
}

/* ─── Preview box ──────────────────────────────────────────────────────────── */
.preview {
  background: var(--tulpar-color-bg-subtle, #f5f5f4);
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
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
  color: var(--tulpar-color-text-muted, #78716c);
}

/* ─── Code block ───────────────────────────────────────────────────────────── */
.code {
  margin: 0;
  padding: 16px 20px;
  background: var(--tulpar-color-bg-inverse, #1c1917);
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 0 0 6px 6px;
  overflow-x: auto;
  font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", Consolas, monospace;
  font-size: 13px;
  line-height: 1.55;
  color: #e7e5e4;
  white-space: pre;
}

/* ─── Inline code ──────────────────────────────────────────────────────────── */
.inline-code {
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 0.85em;
  background: var(--tulpar-color-bg-subtle, #f5f5f4);
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 3px;
  padding: 1px 5px;
  color: var(--tulpar-color-text-primary, #1c1917);
}

/* ─── Form demo ────────────────────────────────────────────────────────────── */
.demo-form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.demo-input {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 6px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  color: var(--tulpar-color-text-primary, #1c1917);
  font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
  font-size: 14px;
  min-width: 220px;
}

.submit-feedback {
  margin: 8px 0 0;
  font-size: 14px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

/* ─── Feedback ─────────────────────────────────────────────────────────────── */
.click-feedback {
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
}

/* ─── Keyboard hint ────────────────────────────────────────────────────────── */
kbd {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
  border-radius: 3px;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 11px;
  background: var(--tulpar-color-bg-elevated, #ffffff);
  color: var(--tulpar-color-text-primary, #1c1917);
}

/* ─── Custom spinner animation ─────────────────────────────────────────────── */
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
