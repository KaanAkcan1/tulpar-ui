<script setup lang="ts">
import { ref } from "vue";
import { useTulparMessage } from "@tulpar-ui/vue";

// The imperative message service — top-center pills, 3 s auto-dismiss, duplicate
// grouping. Works anywhere; no plugin required (auto-mounts on first call).
const msg = useTulparMessage();

const groupCount = ref(0);

// ─── Code snippet strings ─────────────────────────────────────────────────────

const tonesCode = `const msg = useTulparMessage();

msg.info("Senkronize edildi.");
msg.success("Kopyalandı.");
msg.warning("Bağlantı yavaş.");
msg.danger("Yükleme başarısız.");`;

const groupingCode = `const msg = useTulparMessage();

// Default: group:true — same (tone + text) → ×N counter
msg.success("Kopyalandı.");   // shows ×1
msg.success("Kopyalandı.");   // merges → ×2
msg.success("Kopyalandı.");   // merges → ×3

// group:false — each call creates a separate pill
msg.success("Kopyalandı.", { group: false });
msg.success("Kopyalandı.", { group: false }); // two separate pills`;

const durationCode = `const msg = useTulparMessage();

// Default 3 s
msg.info("3 saniye (varsayılan).");

// Custom duration
msg.info("6 saniye.", { duration: 6000 });

// Very short (1 s)
msg.success("Hızlı onay.", { duration: 1000 });`;

const whenToUseCode = `// Message: top-center, single line, 3s auto-dismiss, duplicate grouping.
// Ideal for: redundant confirmations ("Copied", "Saved", "Synced"),
//            lightweight status updates that need no action.
//
// A Message that needs an action is a TOAST.
// toast.success("Dosya silindi.", {
//   actions: [{ label: "Geri al", onClick: undo }],
//   timer: false,
// });`;

// ─── 1. Tones ──────────────────────────────────────────────────────────────
function showInfo() {
  msg.info("Senkronize edildi.");
}
function showSuccess() {
  msg.success("Kopyalandı.");
}
function showWarning() {
  msg.warning("Bağlantı yavaş.");
}
function showDanger() {
  msg.danger("Yükleme başarısız.");
}

// ─── 2. Grouping ───────────────────────────────────────────────────────────
function showGrouped() {
  groupCount.value += 1;
  msg.success("Kopyalandı.");
}
function showUngrouped() {
  msg.info("Senkronize edildi.", { group: false });
}

// ─── 3. Duration ───────────────────────────────────────────────────────────
function showDefault() {
  msg.info("3 saniye (varsayılan).");
}
function show6s() {
  msg.info("6 saniye süre.", { duration: 6000 });
}
function show1s() {
  msg.success("Hızlı onay.", { duration: 1000 });
}
</script>

<template>
  <div class="demo-page">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Feedback</span>
      <h1 class="page-title">Message</h1>
      <p class="page-lede">
        Messages are lightweight, top-center pills for transient redundant confirmations ("Copied",
        "Saved", "Synced"). They auto-dismiss in 3 s, deduplicate repeated calls into a ×N counter,
        and carry no actions. A Message that needs an action is a
        <router-link class="page-link" to="/toast">Toast</router-link>.
      </p>
    </header>

    <!-- ── When / when-not card ──────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="decision-grid">
        <div class="decision-col decision-col--yes">
          <p class="decision-head">Message — use when…</p>
          <ul class="decision-list">
            <li>The same info is visible / verifiable elsewhere (redundant)</li>
            <li>No action is needed ("Copied", "Saved to drafts")</li>
            <li>Single-line, no title/description hierarchy needed</li>
            <li>Rapid, repeated triggers should collapse into a counter</li>
          </ul>
        </div>
        <div class="decision-col decision-col--no">
          <p class="decision-head">Use Toast instead when…</p>
          <ul class="decision-list">
            <li>An action is needed (Undo, Retry, Extend session)</li>
            <li>Title + description hierarchy is required</li>
            <li>The event is non-redundant (background error, job result)</li>
            <li>The message must persist until dismissed by the user</li>
          </ul>
        </div>
      </div>
      <pre class="code"><code>{{ whenToUseCode }}</code></pre>
    </section>

    <!-- ── 1. Tones ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Tones</h2>
      <p class="section-desc">
        Four tones: <code class="inline-code">info</code> ·
        <code class="inline-code">success</code> · <code class="inline-code">warning</code> ·
        <code class="inline-code">danger</code>. Each shows as a top-center pill with its status icon
        and auto-dismisses in 3 s. Messages use
        <code class="inline-code">role="status"</code> /
        <code class="inline-code">aria-live="polite"</code> and never steal focus.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn trigger-btn--info" @click="showInfo">Info</button>
        <button class="trigger-btn trigger-btn--success" @click="showSuccess">Success</button>
        <button class="trigger-btn trigger-btn--warning" @click="showWarning">Warning</button>
        <button class="trigger-btn trigger-btn--danger" @click="showDanger">Danger</button>
      </div>
      <pre class="code"><code>{{ tonesCode }}</code></pre>
    </section>

    <!-- ── 2. Grouping ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Grouping</h2>
      <p class="section-desc">
        <strong>Default (<code class="inline-code">group:true</code>):</strong> Calls with the same
        tone + text merge into a single pill with a ×N counter — ideal for repeated triggers (copy
        button, auto-save). <code class="inline-code">group:false</code> creates a separate pill each
        time. Press the "Copy" button rapidly to see the counter increment.
      </p>
      <div class="preview">
        <div class="stack-demo-cols">
          <div class="stack-demo-col">
            <p class="preview-label">group:true (default) — counter increments</p>
            <button class="trigger-btn trigger-btn--success" @click="showGrouped">
              Kopyala (tekrar bas!)
            </button>
            <div v-if="groupCount > 0" class="reason-badge-wrap">
              <span class="reason-badge"> ×{{ groupCount }} kez tetiklendi </span>
            </div>
          </div>
          <div class="stack-demo-col">
            <p class="preview-label">group:false — ayrı pill her seferinde</p>
            <button class="trigger-btn trigger-btn--info" @click="showUngrouped">
              Senkronize (group:false)
            </button>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ groupingCode }}</code></pre>
    </section>

    <!-- ── 3. Duration ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Duration</h2>
      <p class="section-desc">
        Default auto-dismiss is 3 s. Pass <code class="inline-code">duration</code> to override
        per-call. Unlike Toast, there is no <code class="inline-code">timer:false</code> on Message —
        if you need a persistent notification with a close button, use Toast instead.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" @click="showDefault">Default (3s)</button>
        <button class="trigger-btn" @click="show6s">Custom 6s</button>
        <button class="trigger-btn trigger-btn--success" @click="show1s">Quick (1s)</button>
      </div>
      <pre class="code"><code>{{ durationCode }}</code></pre>
    </section>

    <!-- ── 4. Dark mode ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Dark mode</h2>
      <p class="section-desc">
        Message pill surfaces flip automatically when the
        <code class="inline-code">.dark</code> class is present on
        <code class="inline-code">&lt;body&gt;</code> — deep tinted background, lightened text, 1px
        border for separation. Toggle dark mode via the sidenav theme switch and fire a message to
        verify.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn trigger-btn--info" @click="showInfo">Info (dark safe)</button>
        <button class="trigger-btn trigger-btn--success" @click="showSuccess">
          Success (dark safe)
        </button>
        <button class="trigger-btn trigger-btn--warning" @click="showWarning">
          Warning (dark safe)
        </button>
        <button class="trigger-btn trigger-btn--danger" @click="showDanger">
          Danger (dark safe)
        </button>
      </div>
      <div class="dark-note">
        Toggle the Dark/Light switch in the sidenav, then click a button above — tone surfaces adapt
        automatically with the brand layer's semantic token bindings.
      </div>
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
  max-width: 640px;
  line-height: 1.6;
}

.page-link {
  color: var(--tulpar-color-brand-default, #00c57a);
  font-weight: 600;
  text-decoration: none;
}

.page-link:hover {
  text-decoration: underline;
}

/* ── When / when-not decision card ──────────────────────────────── */
.decision-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}
@media (max-width: 640px) {
  .decision-grid {
    grid-template-columns: 1fr;
  }
}

.decision-col {
  padding: 16px 20px;
  border-radius: 10px;
  border: 1px solid;
}

.decision-col--yes {
  border-color: #b4e3d2;
  background: #e9f7f1;
}

.decision-col--no {
  border-color: #f0dca5;
  background: #fdf6e7;
}

.decision-head {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--tulpar-color-text-primary, #15110b);
}

.decision-list {
  margin: 0;
  padding: 0 0 0 18px;
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
  line-height: 1.7;
}

/* ── Doc sections ────────────────────────────────────────────────── */
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
  max-width: 620px;
  line-height: 1.6;
}

/* ── Preview area ────────────────────────────────────────────────── */
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

.preview--trigger-grid {
  gap: 8px;
}

/* ── Trigger buttons ─────────────────────────────────────────────── */
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

.trigger-btn--info {
  border-color: #bfd3ff;
  background: #eff4ff;
  color: #2563eb;
}

.trigger-btn--success {
  border-color: #b4e3d2;
  background: #e9f7f1;
  color: #16876a;
}

.trigger-btn--warning {
  border-color: #f0dca5;
  background: #fdf6e7;
  color: #b7791f;
}

.trigger-btn--danger {
  border-color: #f4c2bf;
  background: #fdeceb;
  color: #c0322b;
}

/* ── Stacking / grouping demo cols ───────────────────────────────── */
.stack-demo-cols {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
}

.stack-demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* ── Group counter badge ─────────────────────────────────────────── */
.reason-badge-wrap {
  padding: 0;
}

.reason-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  background: var(--tulpar-color-bg-surface, #fff);
  color: var(--tulpar-color-text-secondary, #57534e);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
}

/* ── Dark mode note ──────────────────────────────────────────────── */
.dark-note {
  padding: 12px 20px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-top: none;
  border-bottom: none;
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
  line-height: 1.6;
}

.preview-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* ── Code block ──────────────────────────────────────────────────── */
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
