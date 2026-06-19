<script setup lang="ts">
// ── Directive registration ──────────────────────────────────────────────────
// In <script setup>, a const named `vTulparTooltip` is auto-registered as the
// local directive `v-tulpar-tooltip` — no `directives: {}` block needed. The
// equivalent Options-API / global registrations are:
//   directives: { tulparTooltip: vTulparTooltip }   // per-component
//   app.directive("tulpar-tooltip", vTulparTooltip)  // global (main.ts)
import { ref } from "vue";
import { TulparButton } from "@tulpar-ui/vue";
import { vTulparTooltip, type TooltipPlacement } from "@tulpar-ui/vue";
import "@tulpar-ui/core/tooltip";
import { Settings, Info, Bell, Bold, Italic, Underline, Link2 } from "lucide-vue-next";

// The Ref idiom (section 9) uses the SAME directive with the `:ref` arg —
// `v-tulpar-tooltip:ref="'shared-tip'"` — so no separate registration is needed.

// The 12 placements (auto rendered separately).
const placements: TooltipPlacement[] = [
  "top-start",
  "top",
  "top-end",
  "right-start",
  "right",
  "right-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "left-start",
  "left",
  "left-end",
];

// ── Controlled / imperative (section 8) ─────────────────────────────────────
const open = ref(false);

function onOpenChange(isOpen: boolean) {
  open.value = isOpen;
}

/** Locate the directive-created <tulpar-tooltip> whose `for` points at the trigger. */
function impTooltipEl(): (HTMLElement & { show(): void; hide(): void }) | null {
  return document.querySelector('tulpar-tooltip[for="imp-trigger"]') as
    | (HTMLElement & { show(): void; hide(): void })
    | null;
}

function showTip() {
  impTooltipEl()?.show();
}
function hideTip() {
  impTooltipEl()?.hide();
}

// ─── Code snippet strings ─────────────────────────────────────────────────────

const inlineCode = `<!-- The directive attaches a <tulpar-tooltip> next to the host —
     no wrapper element, no <TulparTooltip> component. -->
<button v-tulpar-tooltip="'Save your changes'">Save</button>`;

const anyElementCode = `<!-- On an icon-only button (fills the a11y gap) -->
<TulparButton :icon="Settings" aria-label="Open settings"
  v-tulpar-tooltip="'Open settings'" />

<!-- On a NON-button element — the directive attaches to anything -->
<span class="info-dot" tabindex="0" v-tulpar-tooltip="'Pulled from the billing API'">
  <Info :size="18" />
</span>

<!-- On a plain text span -->
<span v-tulpar-tooltip="'The unique customer reference'">CUST-4815</span>`;

const placementCode = `<!-- Full side-align grammar: top|bottom|left|right × start|center|end -->
<button v-tulpar-tooltip="{ text: 'top-start', placement: 'top-start' }">top-start</button>
<button v-tulpar-tooltip="{ text: 'top', placement: 'top' }">top</button>
<button v-tulpar-tooltip="{ text: 'top-end', placement: 'top-end' }">top-end</button>
<button v-tulpar-tooltip="{ text: 'right', placement: 'right' }">right</button>
<!-- …bottom-* and left-* follow the same grammar -->

<!-- auto: the positioner picks the side with the most room and reflects the
     resolved placement onto the surface's data-placement attribute -->
<button v-tulpar-tooltip="{ text: 'auto', placement: 'auto' }">auto</button>`;

const arrowCode = `<!-- Arrow on (default) -->
<button v-tulpar-tooltip="'With a pointer arrow'">Arrow on</button>

<!-- Arrow off: pass arrow: false in the config object -->
<button v-tulpar-tooltip="{ text: 'No arrow', arrow: false }">Arrow off</button>

<!-- Custom offset (gap between trigger and chip) -->
<button v-tulpar-tooltip="{ text: 'Pushed further out', offset: 16 }">Offset 16</button>`;

const delayGroupCode = `<!-- A toolbar of triggers: the shared delay controller skips the
     open-delay when you move BETWEEN siblings, so the toolbar feels
     instant once the first tip is showing — but the FIRST hover still
     waits the normal grace, so a passing cursor doesn't flash tips. -->
<div class="toolbar">
  <button v-tulpar-tooltip="'Bold (Ctrl+B)'"><b>B</b></button>
  <button v-tulpar-tooltip="'Italic (Ctrl+I)'"><i>I</i></button>
  <button v-tulpar-tooltip="'Underline (Ctrl+U)'"><u>U</u></button>
  <button v-tulpar-tooltip="'Insert link (Ctrl+K)'">link</button>
</div>`;

const disabledCode = `<!-- A truly :disabled button receives no pointer events, so a tooltip
     on it would NEVER show (the disabled trap). Use :data-disabled —
     it LOOKS disabled but still hovers/focuses — and tooltip the host.
     In dev, tooltipping a real :disabled host logs a console warning. -->
<TulparButton :data-disabled="true"
  v-tulpar-tooltip="'You need edit permission to publish'">
  Publish
</TulparButton>`;

const hoverableCode = `<!-- WCAG 1.4.13: the tooltip is HOVERABLE. An invisible bridge pad spans
     the offset gap, so you can move the pointer from the trigger onto the
     chip without it vanishing — useful when the content is long. The tip
     also stays until you leave (persistent) and Esc dismisses it. -->
<button v-tulpar-tooltip="'Move your cursor onto this tip — it stays open because the surface is hoverable.'">
  Hover, then reach the tip
</button>`;

const controlledCode = `<!-- Controlled: onOpenChange reflects every transition; bind your own state.
     Imperative: grab the created <tulpar-tooltip> via its for-id and call
     show()/hide() on the element ref. -->
<button id="imp-trigger"
  v-tulpar-tooltip="{ text: 'Driven imperatively', onOpenChange }">
  Imperative target
</button>
<button @click="showTip">show()</button>
<button @click="hideTip">hide()</button>
<p>State: {{ open ? 'open' : 'closed' }}</p>

<script setup>
function impTooltipEl() {
  return document.querySelector('tulpar-tooltip[for="imp-trigger"]');
}
function showTip() { impTooltipEl()?.show(); }
function hideTip() { impTooltipEl()?.hide(); }
<\/script>`;

const refReuseCode = `<!-- Declare ONE <tulpar-tooltip id> and point several triggers at it via
     the :ref arg. The directive sets the declared element's "for" to the
     active host (last-wins single-active-trigger). The consumer owns the
     declared element's lifecycle. -->
<tulpar-tooltip id="shared-tip" text="Shared explanation chip"></tulpar-tooltip>

<button v-tulpar-tooltip:ref="'shared-tip'">Trigger A</button>
<button v-tulpar-tooltip:ref="'shared-tip'">Trigger B</button>
<button v-tulpar-tooltip:ref="'shared-tip'">Trigger C</button>`;

const forIdCode = `<!-- The plain core form — no Vue directive at all. Declare the
     <tulpar-tooltip> and bind it to a trigger by id with the "for" attribute.
     This is what the directive automates under the hood. -->
<button id="forid-btn">Hover me</button>
<tulpar-tooltip for="forid-btn" text="Wired purely by the for-id attribute"></tulpar-tooltip>`;
</script>

<template>
  <div class="demo-page">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Overlay · Directive</span>
      <h1 class="page-title">Tooltip</h1>
      <p class="page-lede">
        A hover/focus-triggered descriptive chip wired by a directive —
        <code class="inline-code">v-tulpar-tooltip</code> attaches a
        <code class="inline-code">&lt;tulpar-tooltip&gt;</code> to <em>any</em> host element without
        wrapping it. Collision-aware placement, an optional arrow, a shared delay group, and full
        WCAG 1.4.13 (hoverable / dismissible / persistent) behaviour.
      </p>
    </header>

    <!-- ── Hero ────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <TulparButton severity="primary" v-tulpar-tooltip="'The directive needs no wrapper'">
          Hover me
        </TulparButton>
        <TulparButton
          severity="secondary"
          variant="outlined"
          :icon="Bell"
          aria-label="Notifications"
          v-tulpar-tooltip="'3 unread notifications'"
        />
        <span
          class="hero-chip"
          tabindex="0"
          v-tulpar-tooltip="'Tooltips attach to non-button elements too'"
        >
          Focus me (a span)
        </span>
      </div>
    </section>

    <!-- ── 1. Inline directive ─────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Inline directive — the for-id model</h2>
      <p class="section-desc">
        <code class="inline-code">v-tulpar-tooltip="text"</code> mints an id on the host (if it has
        none), creates a <code class="inline-code">&lt;tulpar-tooltip&gt;</code>, sets its
        <code class="inline-code">for</code> to that id, and appends it next to the host. No
        <code class="inline-code">&lt;TulparTooltip&gt;</code> component, no slot-wrap.
      </p>
      <div class="preview">
        <button class="plain-btn" v-tulpar-tooltip="'Save your changes'">Save</button>
      </div>
      <pre class="code"><code>{{ inlineCode }}</code></pre>
    </section>

    <!-- ── 2. Attaches to anything ─────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Attaches to any element</h2>
      <p class="section-desc">
        Button, icon-only button, or a non-button element (a focusable span / icon). The directive
        never wraps the host — it sits beside it in the light DOM and resolves the
        <code class="inline-code">for</code> id.
      </p>
      <div class="preview preview--baseline">
        <TulparButton
          :icon="Settings"
          aria-label="Open settings"
          v-tulpar-tooltip="'Open settings'"
        />
        <span
          class="info-dot"
          tabindex="0"
          role="button"
          aria-label="Source info"
          v-tulpar-tooltip="'Pulled from the billing API'"
        >
          <Info :size="18" />
        </span>
        <span class="ref-text" tabindex="0" v-tulpar-tooltip="'The unique customer reference'"
          >CUST-4815</span
        >
      </div>
      <pre class="code"><code>{{ anyElementCode }}</code></pre>
    </section>

    <!-- ── 3. Placements + auto ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Placements — 12 + auto</h2>
      <p class="section-desc">
        The full <code class="inline-code">side-align</code> grammar:
        <code class="inline-code">top|bottom|left|right</code> ×
        <code class="inline-code">start|center|end</code>. <code class="inline-code">auto</code> lets
        the positioner pick the side with the most room and reflects the resolved value onto the
        surface's <code class="inline-code">data-placement</code>.
      </p>
      <div class="preview placement-grid">
        <button
          v-for="p in placements"
          :key="p"
          class="plain-btn"
          v-tulpar-tooltip="{ text: p, placement: p }"
        >
          {{ p }}
        </button>
        <button
          class="plain-btn plain-btn--accent"
          v-tulpar-tooltip="{ text: 'auto-resolved', placement: 'auto' }"
        >
          auto
        </button>
      </div>
      <pre class="code"><code>{{ placementCode }}</code></pre>
    </section>

    <!-- ── 4. Arrow + offset ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Arrow &amp; offset</h2>
      <p class="section-desc">
        The arrow is on by default. Pass <code class="inline-code">{ arrow: false }</code> to drop
        it, and <code class="inline-code">{ offset }</code> to tune the gap between trigger and chip.
      </p>
      <div class="preview preview--baseline">
        <button class="plain-btn" v-tulpar-tooltip="'With a pointer arrow'">Arrow on</button>
        <button class="plain-btn" v-tulpar-tooltip="{ text: 'No arrow', arrow: false }">
          Arrow off
        </button>
        <button class="plain-btn" v-tulpar-tooltip="{ text: 'Pushed further out', offset: 16 }">
          Offset 16
        </button>
      </div>
      <pre class="code"><code>{{ arrowCode }}</code></pre>
    </section>

    <!-- ── 5. Delay group ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Delay group — skip-delay toolbar</h2>
      <p class="section-desc">
        Tooltips share a delay controller. The first hover waits the normal grace (so a cursor
        passing over doesn't flash tips), but moving <em>between</em> sibling triggers skips that
        delay — the toolbar feels instant. Compare the grouped toolbar with the lone, ungrouped
        button.
      </p>
      <div class="preview preview--col">
        <div>
          <p class="preview-label">Grouped toolbar (skip-delay between siblings)</p>
          <div class="fmt-toolbar">
            <button class="fmt-btn" aria-label="Bold" v-tulpar-tooltip="'Bold (Ctrl+B)'">
              <Bold :size="16" />
            </button>
            <button class="fmt-btn" aria-label="Italic" v-tulpar-tooltip="'Italic (Ctrl+I)'">
              <Italic :size="16" />
            </button>
            <button class="fmt-btn" aria-label="Underline" v-tulpar-tooltip="'Underline (Ctrl+U)'">
              <Underline :size="16" />
            </button>
            <button class="fmt-btn" aria-label="Insert link" v-tulpar-tooltip="'Insert link (Ctrl+K)'">
              <Link2 :size="16" />
            </button>
          </div>
        </div>
        <div>
          <p class="preview-label">Lone trigger (full open-delay each time)</p>
          <button class="plain-btn" v-tulpar-tooltip="'Waits the full grace every hover'">
            Ungrouped
          </button>
        </div>
      </div>
      <pre class="code"><code>{{ delayGroupCode }}</code></pre>
    </section>

    <!-- ── 6. Disabled trap ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. The disabled trap</h2>
      <p class="section-desc">
        A real <code class="inline-code">:disabled</code> button swallows pointer events, so a
        tooltip on it could never show. Use <code class="inline-code">:data-disabled</code> (looks
        disabled, still hoverable/focusable) and tooltip that. Tooltipping a genuinely disabled host
        logs a dev warning.
      </p>
      <div class="preview preview--baseline">
        <TulparButton
          :data-disabled="true"
          v-tulpar-tooltip="'You need edit permission to publish'"
        >
          Publish (data-disabled)
        </TulparButton>
        <TulparButton
          :disabled="true"
          v-tulpar-tooltip="'This tip will not show (and warns in dev)'"
        >
          Publish (disabled)
        </TulparButton>
      </div>
      <pre class="code"><code>{{ disabledCode }}</code></pre>
    </section>

    <!-- ── 7. Hoverable proof ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Hoverable &amp; persistent (WCAG 1.4.13)</h2>
      <p class="section-desc">
        An invisible bridge pad spans the offset gap, so you can travel from the trigger onto the
        chip without it disappearing. The tip stays until you leave (persistent) and <kbd>Esc</kbd>
        dismisses it while returning focus to the trigger (dismissible).
      </p>
      <div class="preview">
        <button
          class="plain-btn"
          v-tulpar-tooltip="'Move your cursor onto this tip — it stays open because the surface itself is hoverable.'"
        >
          Hover, then reach the tip
        </button>
      </div>
      <pre class="code"><code>{{ hoverableCode }}</code></pre>
    </section>

    <!-- ── 8. Controlled + imperative ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Controlled &amp; imperative</h2>
      <p class="section-desc">
        <code class="inline-code">onOpenChange</code> fires on every open/close transition. For
        imperative control, grab the directive-created
        <code class="inline-code">&lt;tulpar-tooltip&gt;</code> (it carries the host id in its
        <code class="inline-code">for</code>) and call <code class="inline-code">show()</code> /
        <code class="inline-code">hide()</code> on the element.
      </p>
      <div class="preview preview--col">
        <button
          id="imp-trigger"
          class="plain-btn"
          v-tulpar-tooltip="{ text: 'Driven imperatively', onOpenChange }"
        >
          Imperative target
        </button>
        <div class="preview-row">
          <button class="plain-btn plain-btn--accent" @click="showTip">show()</button>
          <button class="plain-btn" @click="hideTip">hide()</button>
          <span class="state-badge" :class="{ 'state-badge--on': open }">
            {{ open ? "open" : "closed" }}
          </span>
        </div>
      </div>
      <pre class="code"><code>{{ controlledCode }}</code></pre>
    </section>

    <!-- ── 9. Ref reuse ────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Ref reuse — one chip, many triggers</h2>
      <p class="section-desc">
        Declare a single <code class="inline-code">&lt;tulpar-tooltip id&gt;</code> and point several
        triggers at it with the <code class="inline-code">:ref</code> arg. Each host re-targets the
        declared element's <code class="inline-code">for</code> on activation (last-wins
        single-active-trigger). You own the declared element's lifecycle.
      </p>
      <div class="preview preview--baseline">
        <tulpar-tooltip id="shared-tip" text="Shared explanation chip"></tulpar-tooltip>
        <button class="plain-btn" v-tulpar-tooltip:ref="'shared-tip'">Trigger A</button>
        <button class="plain-btn" v-tulpar-tooltip:ref="'shared-tip'">Trigger B</button>
        <button class="plain-btn" v-tulpar-tooltip:ref="'shared-tip'">Trigger C</button>
      </div>
      <pre class="code"><code>{{ refReuseCode }}</code></pre>
    </section>

    <!-- ── 10. Plain for-id core form ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Plain core form — no directive</h2>
      <p class="section-desc">
        The directive is sugar over the core element's <code class="inline-code">for</code>-id
        binding. You can always drop to the raw element and wire it by id yourself.
      </p>
      <div class="preview preview--baseline">
        <button id="forid-btn" class="plain-btn">Hover me</button>
        <tulpar-tooltip for="forid-btn" text="Wired purely by the for-id attribute"></tulpar-tooltip>
      </div>
      <pre class="code"><code>{{ forIdCode }}</code></pre>
    </section>

    <!-- ── Footnote ────────────────────────────────────────────────────── -->
    <section class="doc-section doc-section--note">
      <p class="note">
        <strong>Dark mode</strong> — toggle the sidenav theme switch; the chip recolours via semantic
        tokens. <strong>Reduced motion</strong> — the open/close animation is suppressed under
        <code class="inline-code">prefers-reduced-motion: reduce</code>; the tip simply appears and
        disappears.
      </p>
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
  max-width: 660px;
  line-height: 1.6;
}

.hero {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  padding: 36px 28px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 14px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.hero-chip {
  display: inline-flex;
  align-items: center;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px dashed var(--tulpar-color-border-strong, #b9c4c2);
  background: var(--tulpar-color-bg-elevated, #fff);
  color: var(--tulpar-color-text-secondary, #57534e);
  font-size: 14px;
  cursor: default;
}

.hero-chip:focus-visible {
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(0, 197, 122, 0.5));
  outline-offset: 2px;
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

.doc-section--note {
  padding-bottom: 0;
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

.preview {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  padding: 28px 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.preview--baseline {
  align-items: baseline;
}

.preview--col {
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
}

.preview-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

.placement-grid {
  gap: 8px;
}

.plain-btn {
  appearance: none;
  font: inherit;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 7px;
  border: 1px solid var(--tulpar-color-border-strong, #b9c4c2);
  background: var(--tulpar-color-bg-elevated, #fff);
  color: var(--tulpar-color-text-primary, #15110b);
  cursor: pointer;
  transition: border-color 120ms ease-out;
}

.plain-btn:hover {
  border-color: var(--tulpar-color-brand-default, #00c57a);
}

.plain-btn:focus-visible {
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(0, 197, 122, 0.5));
  outline-offset: 2px;
}

.plain-btn--accent {
  border-color: var(--tulpar-color-brand-default, #00c57a);
  color: var(--tulpar-color-brand-default, #00c57a);
  font-weight: 600;
}

.info-dot,
.ref-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--tulpar-color-text-secondary, #57534e);
  cursor: default;
}

.info-dot {
  width: 34px;
  height: 34px;
  justify-content: center;
  border-radius: 999px;
  background: var(--tulpar-color-bg-elevated, #fff);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.ref-text {
  font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
  font-size: 13px;
  text-decoration: underline dotted;
  text-underline-offset: 3px;
}

.info-dot:focus-visible,
.ref-text:focus-visible {
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(0, 197, 122, 0.5));
  outline-offset: 2px;
}

.fmt-toolbar,
.fmt-btn {
  display: inline-flex;
  align-items: center;
}

.fmt-toolbar {
  gap: 2px;
  padding: 4px;
  border-radius: 9px;
  background: var(--tulpar-color-bg-elevated, #fff);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

.fmt-btn {
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--tulpar-color-text-secondary, #57534e);
  cursor: pointer;
}

.fmt-btn:hover {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  color: var(--tulpar-color-text-primary, #15110b);
}

.fmt-btn:focus-visible {
  outline: 2px solid var(--tulpar-color-focus-ring, rgba(0, 197, 122, 0.5));
  outline-offset: 2px;
}

.state-badge {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  color: var(--tulpar-color-text-muted, #74777a);
}

.state-badge--on {
  background: color-mix(in srgb, var(--tulpar-color-brand-default, #00c57a) 18%, transparent);
  color: var(--tulpar-color-brand-default, #00c57a);
}

.code {
  margin: 0;
  padding: 16px 20px;
  background: var(--tulpar-color-bg-inverse, #15110b);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 0 0 6px 6px;
  overflow-x: auto;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
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

kbd {
  display: inline-block;
  padding: 1px 5px;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 3px;
  font-family: "JetBrains Mono", Consolas, monospace;
  font-size: 11px;
  background: var(--tulpar-color-bg-elevated, #fff);
  color: var(--tulpar-color-text-primary, #15110b);
}

.note {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--tulpar-color-text-secondary, #57534e);
  padding: 16px 18px;
  border-left: 3px solid var(--tulpar-color-brand-default, #00c57a);
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border-radius: 0 8px 8px 0;
}
</style>
