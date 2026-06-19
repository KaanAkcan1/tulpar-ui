<script setup lang="ts">
// ── Directive registration ──────────────────────────────────────────────────
// In <script setup>, the imported `vTulparToggletip` const is auto-registered as
// `v-tulpar-toggletip`. The Options-API / global equivalents are:
//   directives: { tulparToggletip: vTulparToggletip }   // per-component
//   app.directive("tulpar-toggletip", vTulparToggletip)  // global (main.ts)
import { TulparButton } from "@tulpar-ui/vue";
import { vTulparToggletip } from "@tulpar-ui/vue";
import "@tulpar-ui/core/toggletip";
import { Info, CircleCheck, TriangleAlert, CircleAlert, HelpCircle } from "lucide-vue-next";

// ─── Code snippet strings ─────────────────────────────────────────────────────

const introCode = `<!-- A toggletip is CLICK-triggered (a tooltip is hover-triggered).
     Because it appears on an explicit action, its content is announced via
     a polite aria-live region. Focus never enters the bubble; Esc closes it
     and returns focus to the trigger. -->
<button v-tulpar-toggletip="'This metric counts active users in the last 28 days.'">
  What is MAU?
</button>`;

const toneCode = `<!-- Five tones, each tinting the bubble. The directive value is the text;
     pass the tone in the config object. For a status ICON inside the bubble,
     declare the element and use the Ref form (see below). -->
<button v-tulpar-toggletip="{ text: 'Synced 2 minutes ago.', tone: 'neutral' }">Neutral</button>
<button v-tulpar-toggletip="{ text: 'Read replicas may lag briefly.', tone: 'info' }">Info</button>
<button v-tulpar-toggletip="{ text: 'Your changes were saved.', tone: 'success' }">Success</button>
<button v-tulpar-toggletip="{ text: 'This plan expires in 3 days.', tone: 'warning' }">Warning</button>
<button v-tulpar-toggletip="{ text: 'Two payments failed this cycle.', tone: 'danger' }">Danger</button>`;

const toneIconCode = `<!-- For a status ICON inside the bubble, declare the element and reference it.
     The icon lives in slot="icon"; the bubble inherits the tone. -->
<tulpar-toggletip id="tt-success" tone="success">
  <CircleCheck slot="icon" :size="16" />
  Your changes were saved to the server.
</tulpar-toggletip>
<button v-tulpar-toggletip:ref="'tt-success'">Save status</button>`;

const placementCode = `<!-- Same side-align grammar as the tooltip, plus auto. Arrow on by default. -->
<button v-tulpar-toggletip="{ text: 'Opens above', placement: 'top' }">top</button>
<button v-tulpar-toggletip="{ text: 'Opens right', placement: 'right' }">right</button>
<button v-tulpar-toggletip="{ text: 'No arrow', arrow: false }">arrow off</button>
<button v-tulpar-toggletip="{ text: 'Best-fit side', placement: 'auto' }">auto</button>`;

const markupCode = `<!-- Brief text via the directive value… -->
<button v-tulpar-toggletip="'A short, plain-text explanation.'">Brief</button>

<!-- …or short markup via the declared element + Ref. Keep it NON-interactive
     (no links/buttons) — a toggletip is a disclosure, not a dialog. -->
<tulpar-toggletip id="tt-markup">
  <span><strong>Heads up:</strong> billing runs on the 1st of each month.</span>
</tulpar-toggletip>
<button v-tulpar-toggletip:ref="'tt-markup'">Short markup</button>`;

const keyboardCode = `<!-- The trigger is a real button, so Enter / Space toggle it natively.
     Esc closes the bubble and returns focus to the trigger. Focus never
     moves into the bubble (it is non-interactive). -->
<button v-tulpar-toggletip="'Press Esc to close — focus returns right here.'">
  Keyboard demo
</button>`;
</script>

<template>
  <div class="demo-page">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Overlay · Directive</span>
      <h1 class="page-title">Toggletip</h1>
      <p class="page-lede">
        A click-triggered disclosure bubble —
        <code class="inline-code">v-tulpar-toggletip</code> attaches a
        <code class="inline-code">&lt;tulpar-toggletip&gt;</code> to any host. Unlike a tooltip it
        toggles on click, announces via a polite live region, carries a semantic <em>tone</em>, and
        returns focus on <kbd>Esc</kbd>. Content is brief and non-interactive.
      </p>
    </header>

    <!-- ── Hero ────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <TulparButton
          severity="secondary"
          variant="outlined"
          :icon="HelpCircle"
          v-tulpar-toggletip="{
            text: 'Monthly Active Users — distinct users with at least one session in the last 28 days.',
            tone: 'info',
          }"
        >
          What is MAU?
        </TulparButton>
      </div>
    </section>

    <!-- ── 1. Intro ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Click to disclose</h2>
      <p class="section-desc">
        Click (or <kbd>Enter</kbd>/<kbd>Space</kbd>) toggles the bubble. An outside click or
        <kbd>Esc</kbd> dismisses it. The content is announced through a pre-inserted
        <code class="inline-code">aria-live</code> region, so screen readers hear it without focus
        moving in.
      </p>
      <div class="preview">
        <button
          class="plain-btn"
          v-tulpar-toggletip="'This metric counts active users in the last 28 days.'"
        >
          What is MAU?
        </button>
      </div>
      <pre class="code"><code>{{ introCode }}</code></pre>
    </section>

    <!-- ── 2. Tone showcase ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Tone showcase</h2>
      <p class="section-desc">
        Five tones via the config <code class="inline-code">tone</code> field:
        <code class="inline-code">neutral · info · success · warning · danger</code>. The inline
        form sets the tone on the text bubble; the icon variants below declare the element so a
        status icon can sit in <code class="inline-code">slot="icon"</code>.
      </p>
      <div class="preview">
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'Synced 2 minutes ago.', tone: 'neutral' }"
        >
          Neutral
        </button>
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'Read replicas may lag briefly.', tone: 'info' }"
        >
          Info
        </button>
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'Your changes were saved.', tone: 'success' }"
        >
          Success
        </button>
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'This plan expires in 3 days.', tone: 'warning' }"
        >
          Warning
        </button>
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'Two payments failed this cycle.', tone: 'danger' }"
        >
          Danger
        </button>
      </div>
      <pre class="code"><code>{{ toneCode }}</code></pre>
    </section>

    <!-- ── 3. Tone + status icon (Ref form) ────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Tone with a status icon</h2>
      <p class="section-desc">
        To pair a tone with an icon, declare a
        <code class="inline-code">&lt;tulpar-toggletip&gt;</code> with an icon in
        <code class="inline-code">slot="icon"</code> and reference it via the
        <code class="inline-code">:ref</code> arg.
      </p>
      <div class="preview preview--baseline">
        <tulpar-toggletip id="tt-info" tone="info">
          <Info slot="icon" :size="16" />
          Read replicas may lag a few seconds behind the primary.
        </tulpar-toggletip>
        <button class="plain-btn" v-tulpar-toggletip:ref="'tt-info'">Replica lag</button>

        <tulpar-toggletip id="tt-success" tone="success">
          <CircleCheck slot="icon" :size="16" />
          Your changes were saved to the server.
        </tulpar-toggletip>
        <button class="plain-btn" v-tulpar-toggletip:ref="'tt-success'">Save status</button>

        <tulpar-toggletip id="tt-warning" tone="warning">
          <TriangleAlert slot="icon" :size="16" />
          Your trial ends in 3 days — add a card to avoid interruption.
        </tulpar-toggletip>
        <button class="plain-btn" v-tulpar-toggletip:ref="'tt-warning'">Trial</button>

        <tulpar-toggletip id="tt-danger" tone="danger">
          <CircleAlert slot="icon" :size="16" />
          Two payments failed this billing cycle.
        </tulpar-toggletip>
        <button class="plain-btn" v-tulpar-toggletip:ref="'tt-danger'">Billing</button>
      </div>
      <pre class="code"><code>{{ toneIconCode }}</code></pre>
    </section>

    <!-- ── 4. Placement + arrow ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Placement &amp; arrow</h2>
      <p class="section-desc">
        The same collision-aware <code class="inline-code">side-align</code> grammar as the tooltip,
        plus <code class="inline-code">auto</code>. The arrow is on by default — drop it with
        <code class="inline-code">{ arrow: false }</code>.
      </p>
      <div class="preview preview--baseline">
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'Opens above the trigger', placement: 'top' }"
        >
          top
        </button>
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'Opens to the right', placement: 'right' }"
        >
          right
        </button>
        <button class="plain-btn" v-tulpar-toggletip="{ text: 'Opens below', placement: 'bottom' }">
          bottom
        </button>
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'No arrow on this one', arrow: false }"
        >
          arrow off
        </button>
        <button
          class="plain-btn"
          v-tulpar-toggletip="{ text: 'Best-fit side picked automatically', placement: 'auto' }"
        >
          auto
        </button>
      </div>
      <pre class="code"><code>{{ placementCode }}</code></pre>
    </section>

    <!-- ── 5. Brief vs short markup ────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Brief text vs short markup</h2>
      <p class="section-desc">
        Pass plain text via the directive value for the trivial case, or declare the element with
        light markup (kept non-interactive) and reference it. Both stay terse — a toggletip is a
        disclosure, not a dialog.
      </p>
      <div class="preview preview--baseline">
        <button class="plain-btn" v-tulpar-toggletip="'A short, plain-text explanation.'">
          Brief
        </button>

        <tulpar-toggletip id="tt-markup">
          <span><strong>Heads up:</strong> billing runs on the 1st of each month.</span>
        </tulpar-toggletip>
        <button class="plain-btn" v-tulpar-toggletip:ref="'tt-markup'">Short markup</button>
      </div>
      <pre class="code"><code>{{ markupCode }}</code></pre>
    </section>

    <!-- ── 6. Keyboard ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Keyboard — Enter/Space toggle, Esc returns focus</h2>
      <p class="section-desc">
        The trigger is a native button, so <kbd>Enter</kbd> and <kbd>Space</kbd> toggle it.
        <kbd>Esc</kbd> closes the bubble and moves focus back to the trigger. Try it: tab to the
        button, press <kbd>Enter</kbd>, then <kbd>Esc</kbd>.
      </p>
      <div class="preview">
        <button
          class="plain-btn"
          v-tulpar-toggletip="'Press Esc to close — focus returns right here.'"
        >
          Keyboard demo
        </button>
      </div>
      <pre class="code"><code>{{ keyboardCode }}</code></pre>
    </section>

    <!-- ── Footnote ────────────────────────────────────────────────────── -->
    <section class="doc-section doc-section--note">
      <p class="note">
        <strong>Dark mode</strong> recolours the bubble and tone accents via semantic tokens.
        <strong>Reduced motion</strong> suppresses the open/close animation.
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
