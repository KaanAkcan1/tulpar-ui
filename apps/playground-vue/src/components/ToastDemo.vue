<script setup lang="ts">
import { ref } from "vue";
import { useTulparToast, TulparToast } from "@tulpar-ui/vue";
import type { ToastLocation } from "@tulpar-ui/vue";

// The imperative service — works anywhere (setup, handlers, stores). The app
// installs `TulparToastPlugin` in main.ts as the idiomatic entry point, but the
// composable is self-sufficient (it lazily mounts the toaster on first call).
const toast = useTulparToast();

const lastDismissReason = ref<string | null>(null);

// ── 8. Stacking — live control state ──────────────────────────────────────────
const stackMaxVisible = ref<number>(3);
const stackExpand = ref<boolean>(false);

// ─── Code snippet strings ─────────────────────────────────────────────────────

const tonesCode = `const toast = useTulparToast();

toast.info("Dosya buluta yüklendi.");
toast.success("Değişiklikler kaydedildi.");
toast.warning("Depolama alanı %90 dolu.");
toast.danger("Bağlantı kesildi.", { timer: false });
toast.danger("Kritik hata — işlem başarısız.", { highContrast: true, timer: false });`;

const contentPropCode = `const toast = useTulparToast();

// title-only (positional message)
toast.info("Dosya kopyalandı.");

// title + description (prop form)
toast.success("Değişiklikler kaydedildi.", {
  description: "Tüm alanlar doğrulandı ve veritabanına yazıldı.",
});

// single action
toast.warning("Bağlantı yavaş.", {
  actions: [{ label: "Yenile", onClick: () => window.location.reload() }],
  timer: false,
});

// two actions
toast.danger("Dosya silinemedi.", {
  description: "İzin hatası — dosyaya erişim reddedildi.",
  actions: [
    { label: "Tekrar dene", onClick: () => console.log("retry") },
    { label: "İptal", onClick: () => console.log("cancel") },
  ],
  timer: false,
});

// no auto-dismiss (closable:false)
toast.info("İndirme başlatıldı.", { closable: false, timer: false });`;

const contentSlotCode = `<!-- Slot form — declarative <TulparToast> SFC -->

<!-- title via #title -->
<TulparToast tone="success" :timer="false">
  <template #title><strong>Başarı</strong> — tüm testler geçti.</template>
</TulparToast>

<!-- description via #description -->
<TulparToast tone="warning" heading="Dikkat" :timer="false">
  <template #description>
    Bu işlem <em>geri alınamaz</em>. Devam etmek istiyor musunuz?
  </template>
</TulparToast>`;

const iconsPropCode = `const toast = useTulparToast();

// default per-tone icon (no input needed)
toast.success("İkon: tone varsayılanı");

// built-in icon name
toast.info("İkon: name", { icon: "info" });

// raw inline SVG string
toast.warning("İkon: özel SVG", {
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
});

// emoji
toast.info("İkon: emoji", { icon: "🚀" });

// no icon
toast.success("İkon yok", { icon: false });`;

const iconsSlotCode = `<!-- #icon — any content: Lucide, custom SVG, img -->

<TulparToast tone="info" heading="Lucide ile özel ikon" :timer="false">
  <template #icon>
    <!-- Lucide icon via vue component: -->
    <Zap :size="20" />
  </template>
</TulparToast>

<TulparToast tone="success" heading="İnline SVG ikonu" :timer="false">
  <template #icon>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  </template>
</TulparToast>`;

const customToneCode = `const toast = useTulparToast();

// Brand family (mode-aware light/dark flip)
toast.custom("İlay tonu", { color: "ilay" });
toast.custom("Umay tonu", { color: "umay" });
toast.custom("Gök tonu",  { color: "gok"  });

// Raw hex color (contrast is author's responsibility)
toast.custom("Özel renk", { color: "#0d9488" });

// Part overrides (bg / accent / text)
toast.custom("Part override", {
  bg:     "#fdf4ff",
  accent: "#9333ea",
  text:   "#3b0764",
});

// CSS variable part override (via inline style on a container)
// --tulpar-toast-bg / --tulpar-toast-accent / --tulpar-toast-text`;

const timerCode = `const toast = useTulparToast();

// Track style (default) — faint track + depleting fill
toast.info("Timer: track (varsayılan)", { timerStyle: "track" });

// Soft style — depleting fill only, no track
toast.info("Timer: soft", { timerStyle: "soft" });

// Custom duration (10 s)
toast.info("10 saniye süre", { duration: 10000, timerStyle: "track" });

// Persistent — no ring, no auto-dismiss (timer: false)
toast.warning("Kalıcı toast — kapatmak için × tıklayın", { timer: false });

// Hover/focus pauses the timer — try hovering on any toast above.`;

const stackingCode = `const toast = useTulparToast();

// Live controls — set BEFORE firing so the service rebuilds its queue
toast.setDefaults({ maxVisible: 3, expand: false });

// Fire (maxVisible + 3) toasts to see the cap + queue/overflow behavior.
// Beyond maxVisible, toasts queue and promote as visible ones dismiss.
const count = maxVisible + 3; // e.g. maxVisible=3 → fires 6
for (let i = 1; i <= count; i++) {
  toast.info(\`Toast #\${i} / \${count}\`, { duration: 5000 });
}

// Toggle expand mode (always-expanded list, no hover-to-expand)
toast.setDefaults({ expand: true });`;

const locationCode = `const toast = useTulparToast();

// Per-call location override (6 positions)
toast.info("Sol üst",        { location: "top-left"      });
toast.info("Üst orta",       { location: "top-center"    });
toast.info("Sağ üst",        { location: "top-right"     });
toast.info("Sol alt",        { location: "bottom-left"   });
toast.info("Alt orta",       { location: "bottom-center" });
toast.info("Sağ alt",        { location: "bottom-right"  }); // default`;

const asyncCode = `const toast = useTulparToast();

// toast.promise — loading → success/error; resolved value in message
const save = (): Promise<{ count: number }> =>
  new Promise((res, rej) => setTimeout(() => Math.random() > 0.3 ? res({ count: 7 }) : rej(new Error("timeout")), 2000));

await toast.promise(save(), {
  loading: "Kaydediliyor…",
  success: (data) => \`\${data.count} kayıt güncellendi.\`,
  error:   (err)  => \`Hata: \${(err as Error).message}\`,
});

// toast.update — mutate a live toast in place
const id = toast.info("Yükleniyor…", { timer: false });
setTimeout(() => toast.update(id, { tone: "success", title: "Tamamlandı!" }), 2000);

// toast.dismiss(id) — dismiss one; toast.dismiss() — dismiss all
const id2 = toast.warning("Bu toast 2s içinde kapatılacak", { timer: false });
setTimeout(() => toast.dismiss(id2), 2000);

// onDismiss callback — reason: 'timeout' | 'user' | 'action' | 'swipe' | 'programmatic'
toast.info("Kapanma sebebini incele", {
  onDismiss: (reason) => console.log("Dismissed:", reason),
});`;

const richContentCode = `<!-- Declarative SFC with arbitrary slot content -->
<TulparToast tone="info" :timer="false">
  <template #title>Dosya işleniyor</template>
  <template #description>
    <div style="display:flex; gap:10px; align-items:center; margin-top:6px;">
      <img src="avatar.jpg" width="28" height="28" style="border-radius:50%;" alt=""/>
      <div>
        <div style="font-weight:600; font-size:12px;">rapor_q4.xlsx</div>
        <div style="
          margin-top:4px; height:4px; border-radius:2px;
          background: var(--tulpar-color-border-default,#d9e0df)">
          <div style="width:62%; height:100%; border-radius:2px;
            background: var(--tulpar-color-brand-default,#00c57a)"></div>
        </div>
      </div>
    </div>
  </template>
</TulparToast>`;

const a11yCode = `// F6 → jumps focus to the toast region from anywhere on the page
// Esc → dismisses the currently focused toast
// Shift+F6 → reverse-cycles the region

// Swipe to dismiss (touch/pointer):
// Horizontal swipe past threshold → dismisses with reason:'swipe'
// Below threshold → springs back to original position
// Disabled under prefers-reduced-motion

// Actionable toast (has actions[]) → escalates to alertdialog inside
// a labelled region — WCAG 2.4 + SC 4.1.3 compliant:
toast.danger("Oturumunuz sona eriyor.", {
  actions: [{ label: "Uzat", onClick: () => extendSession() }],
  timer: false,
});

// Dark mode: the toast surface flips automatically when .dark class is on <body>
// prefers-reduced-motion: the perimeter ring animation is replaced by a static border`;

// ─── 1. Tones ──────────────────────────────────────────────────────────────
function showInfo() {
  toast.info("Dosya buluta yüklendi.");
}
function showSuccess() {
  toast.success("Değişiklikler kaydedildi.");
}
function showWarning() {
  toast.warning("Depolama alanı %90 dolu.");
}
function showDanger() {
  toast.danger("Bağlantı kesildi.", { timer: false });
}
function showDangerHC() {
  toast.danger("Kritik hata — işlem başarısız.", { highContrast: true, timer: false });
}

// ─── 2. Content forms — prop form ───────────────────────────────────────────
function showTitleOnly() {
  toast.info("Dosya kopyalandı.");
}
function showTitleDesc() {
  toast.success("Değişiklikler kaydedildi.", {
    description: "Tüm alanlar doğrulandı ve veritabanına yazıldı.",
  });
}
function showSingleAction() {
  toast.warning("Bağlantı yavaş.", {
    actions: [{ label: "Yenile", onClick: () => console.log("[demo] refresh clicked") }],
    timer: false,
  });
}
function showTwoActions() {
  toast.danger("Dosya silinemedi.", {
    description: "İzin hatası — dosyaya erişim reddedildi.",
    actions: [
      { label: "Tekrar dene", onClick: () => console.log("[demo] retry") },
      { label: "İptal", onClick: () => console.log("[demo] cancel") },
    ],
    timer: false,
  });
}
function showLongText() {
  toast.info(
    "Bu bildirim çok uzun bir başlığa sahip ve kart genişliği içinde nasıl sardığını göstermek için tasarlandı.",
    {
      description:
        "Açıklama satırı da uzun olabilir ve birden fazla satıra yayılabilir; bu durum kart yüksekliğini dinamik olarak artırır.",
    },
  );
}
function showNoClose() {
  toast.info("İndirme başlatıldı.", { closable: false, duration: 4000 });
}
function showPersistent() {
  toast.info("Kalıcı — manuel kapatma gerekli.", { timer: false });
}

// ─── 4. Icons — prop form ────────────────────────────────────────────────────
function showIconDefault() {
  toast.success("İkon: tone varsayılanı");
}
function showIconName() {
  toast.info("İkon: name prop", { icon: "info" });
}
function showIconSvg() {
  toast.warning("İkon: özel SVG string", {
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
  });
}
function showIconEmoji() {
  toast.info("Emoji ikonu 🚀", { icon: "🚀" });
}
function showIconFalse() {
  toast.success("İkon yok", { icon: false });
}

// ─── 6. Custom tone ───────────────────────────────────────────────────────────
function showCustomIlay() {
  toast.custom("İlay tonu (brand family, mode-aware)", { color: "ilay" });
}
function showCustomUmay() {
  toast.custom("Umay tonu (brand family, mode-aware)", { color: "umay" });
}
function showCustomGok() {
  toast.custom("Gök tonu (brand family, mode-aware)", { color: "gok" });
}
function showCustomHex() {
  toast.custom("Raw hex rengi — kontrast sizin sorumluluğunuzda.", { color: "#0d9488" });
}
function showCustomPartOverride() {
  toast.custom("Part override örneği", {
    bg: "#fdf4ff",
    accent: "#9333ea",
    text: "#3b0764",
  });
}

// ─── 7. Timer ─────────────────────────────────────────────────────────────────
function showTimerTrack() {
  toast.info("Timer: track stili (varsayılan)", { timerStyle: "track" });
}
function showTimerSoft() {
  toast.info("Timer: soft stili", { timerStyle: "soft" });
}
function showTimerCustomDuration() {
  toast.info("10 saniye süre", { duration: 10_000, timerStyle: "track" });
}
function showTimerFalse() {
  toast.warning("Kalıcı — timer:false, otomatik kapanmaz.", { timer: false });
}
function showTimerPauseDemo() {
  toast.info("Üzerinde bekle — timer duraklar. Fareyi çek — devam eder.", { duration: 8_000 });
}

// ─── 8. Stacking — live control methods ─────────────────────────────────────
function decrementMaxVisible() {
  stackMaxVisible.value = Math.max(1, stackMaxVisible.value - 1);
  toast.setDefaults({ maxVisible: stackMaxVisible.value });
}
function incrementMaxVisible() {
  stackMaxVisible.value = Math.min(8, stackMaxVisible.value + 1);
  toast.setDefaults({ maxVisible: stackMaxVisible.value });
}
function toggleStackExpand() {
  stackExpand.value = !stackExpand.value;
  toast.setDefaults({ expand: stackExpand.value });
}
function fireStackToasts() {
  // Apply current settings BEFORE firing so the queue rebuilds with them.
  toast.setDefaults({ maxVisible: stackMaxVisible.value, expand: stackExpand.value });
  const count = stackMaxVisible.value + 3;
  for (let i = 1; i <= count; i++) {
    toast.info(`Toast #${i} / ${count}`, { duration: 5000 });
  }
}

// ─── 9. Location ──────────────────────────────────────────────────────────────
function showLocation(location: ToastLocation) {
  const labels: Record<string, string> = {
    "top-left": "Sol üst",
    "top-center": "Üst orta",
    "top-right": "Sağ üst",
    "bottom-left": "Sol alt",
    "bottom-center": "Alt orta",
    "bottom-right": "Sağ alt (varsayılan)",
  };
  toast.info(labels[location] ?? location, { location });
}

// ─── 10. Async / lifecycle ──────────────────────────────────────────────────
function showPromiseSuccess() {
  const fakeApi = (): Promise<{ count: number }> =>
    new Promise((res) => setTimeout(() => res({ count: 7 }), 2000));
  void toast.promise(fakeApi(), {
    loading: "Kaydediliyor…",
    success: (data: unknown) => `${(data as { count: number }).count} kayıt başarıyla güncellendi.`,
    error: (err) => `Hata: ${(err as Error).message}`,
  });
}
function showPromiseError() {
  const fakeFailApi = (): Promise<never> =>
    new Promise((_res, rej) => setTimeout(() => rej(new Error("sunucu hatası")), 2000));
  toast
    .promise(fakeFailApi(), {
      loading: "Yükleniyor…",
      success: "Tamamlandı.",
      error: (err) => `Hata: ${(err as Error).message}`,
    })
    .catch(() => {
      /* handled by the toast */
    });
}
function showUpdate() {
  const id = toast.info("Güncelleme bekleniyor… (2s)", { timer: false });
  setTimeout(() => toast.update(id, { tone: "success", title: "Güncelleme tamamlandı!" }), 2000);
}
function showDismissId() {
  const id = toast.warning("Bu toast 2s içinde programatik kapatılacak.", { timer: false });
  setTimeout(() => toast.dismiss(id), 2000);
}
function showOnDismiss() {
  toast.info("Kapat veya bekle — sebebi aşağıda görün.", {
    duration: 4000,
    onDismiss: (reason: string) => {
      lastDismissReason.value = reason;
    },
  });
}

// ─── 3. Content forms — slot form — live fire buttons ───────────────────────

/**
 * Fire (rich title): builds an HTMLElement with bold markup and passes it to
 * toast.custom(HTMLElement) so it projects into the toast's default slot.
 */
function fireSlotTitle() {
  const node = document.createElement("span");
  node.setAttribute("slot", "title");
  node.innerHTML = "<strong>Başarı</strong> — tüm testler geçti ✓";
  toast.custom(node, { timer: false });
}

/**
 * Fire (rich description): fires a toast with the heading prop +
 * an HTMLElement carrying <em> markup for the description slot.
 */
function fireSlotDescription() {
  const descSpan = document.createElement("span");
  descSpan.setAttribute("slot", "description");
  descSpan.innerHTML = "Bu işlem <em>geri alınamaz</em>. Devam etmek istiyor musunuz?";
  toast.custom(descSpan, { title: "Dikkat", timer: false });
}

// ─── 5. Icons — slot form — live fire button ─────────────────────────────────
/** Fire (custom icon): live toast with shield SVG via raw-SVG icon prop */
function fireIconSlot() {
  toast.info("Güvenlik uyarısı", {
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    timer: false,
  });
}

// ─── 11. Rich content — live fire ────────────────────────────────────────────
/**
 * Fires a live toast via toast.custom(HTMLElement) — the canonical imperative
 * rich-content API. Builds the same avatar + progress-bar markup as the
 * declarative preview and appends it as a light-DOM child of the toast element.
 */
function fireRichToast() {
  const node = document.createElement("div");
  node.style.cssText = "display:flex;gap:10px;align-items:center;margin-top:6px;";
  node.innerHTML = `
    <div style="font-size:22px;flex-shrink:0;">📄</div>
    <div style="flex:1;min-width:0;">
      <div style="font-size:12px;font-weight:600;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">rapor_q4_final.xlsx</div>
      <div style="height:4px;border-radius:2px;background:var(--tulpar-color-border-default,#d9e0df);overflow:hidden;">
        <div style="width:62%;height:100%;border-radius:2px;background:var(--tulpar-color-brand-default,#00c57a);"></div>
      </div>
      <div style="margin-top:4px;font-size:11px;color:var(--tulpar-color-text-muted,#74777a);">62% — kalan süre ~5s</div>
    </div>
  `;
  const descSpan = document.createElement("span");
  descSpan.setAttribute("slot", "description");
  descSpan.appendChild(node);
  toast.custom(descSpan, { title: "Dosya işleniyor", timer: false });
}

// ─── 12. A11y ────────────────────────────────────────────────────────────────
function showA11ySwipe() {
  toast.info("Yatay kaydırarak kapat (swipe-to-dismiss). Eşiğin altında yayaya döner.", {
    duration: 8_000,
  });
}
function showA11yEsc() {
  toast.info("Bu tosta tıkla (focus), sonra Esc bas — kapanır.", { duration: 8_000 });
}
function showA11yF6() {
  toast.info("F6 tuşu ile toast bölgesine atla (sayfanın herhangi bir yerinden).", {
    duration: 8_000,
  });
}
function showA11yActionable() {
  toast.danger("Oturumunuz sona eriyor.", {
    description: "Oturumunuzu uzatmak ister misiniz?",
    actions: [{ label: "Uzat", onClick: () => console.log("[demo] session extended") }],
    timer: false,
  });
}
function showA11yDark() {
  toast.info("Dark mod notu: <body> üzerindeki .dark sınıfı tüm ton yüzeylerini çevirir.", {
    duration: 6_000,
  });
}
function showA11yReducedMotion() {
  toast.info("prefers-reduced-motion: Animasyon → statik kenarlık ve ≤100ms opacity geçişi.", {
    duration: 6_000,
  });
}

// dismiss-all helper bound to the template button
function dismissAll() {
  toast.dismiss();
}
</script>

<template>
  <div class="demo-page demo-page--toast">
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Feedback</span>
      <h1 class="page-title">Toast</h1>
      <p class="page-lede">
        Toasts are code-triggered, transient, non-blocking feedback shown in a corner of the screen.
        They stack, timer out, and carry optional actions. Use them for background events,
        confirmations with an action (Undo), and errors that need user attention.
        <strong>Do not use</strong> for critical or irreversible information — that needs a Dialog.
      </p>
    </header>

    <!-- ── When / when-not card ──────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="decision-grid">
        <div class="decision-col decision-col--yes">
          <p class="decision-head">Use Toast when…</p>
          <ul class="decision-list">
            <li>A background operation finishes (save, upload, sync)</li>
            <li>An action can be undone (delete → Undo)</li>
            <li>A non-critical error needs reporting</li>
            <li>
              You need to show loading → result in one place
              (<code class="inline-code">toast.promise</code>)
            </li>
          </ul>
        </div>
        <div class="decision-col decision-col--no">
          <p class="decision-head">Use Dialog / inline banner instead…</p>
          <ul class="decision-list">
            <li>The action is irreversible (delete with no Undo)</li>
            <li>User confirmation is required before proceeding</li>
            <li>The information is too complex for a single line</li>
            <li>The feedback must persist until the user acts</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── 1. Tones ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Tones</h2>
      <p class="section-desc">
        Five tones: <code class="inline-code">info</code> ·
        <code class="inline-code">success</code> · <code class="inline-code">warning</code> ·
        <code class="inline-code">danger</code> ·
        <code class="inline-code">danger high-contrast</code>. Each carries its status icon.
        High-contrast danger escalates to a saturated surface with white text for genuinely urgent
        failures.
      </p>
      <div class="preview">
        <button class="trigger-btn trigger-btn--info" @click="showInfo">Info</button>
        <button class="trigger-btn trigger-btn--success" @click="showSuccess">Success</button>
        <button class="trigger-btn trigger-btn--warning" @click="showWarning">Warning</button>
        <button class="trigger-btn trigger-btn--danger" @click="showDanger">Danger</button>
        <button class="trigger-btn trigger-btn--danger-hc" @click="showDangerHC">
          Danger high-contrast
        </button>
      </div>
      <pre class="code"><code>{{ tonesCode }}</code></pre>
    </section>

    <!-- ── 2. Content forms — prop form ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Content forms — prop form</h2>
      <p class="section-desc">
        Every content capability is available as imperative options: title-only, title +
        description, single action, two actions, long-text wrap, and
        <code class="inline-code">closable:false</code>. The
        <code class="inline-code">description</code> prop is free-form text; actions accept a label +
        onClick. Both slot forms are shown in the next section.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" @click="showTitleOnly">Title only</button>
        <button class="trigger-btn" @click="showTitleDesc">Title + description</button>
        <button class="trigger-btn" @click="showSingleAction">Single action</button>
        <button class="trigger-btn" @click="showTwoActions">Two actions</button>
        <button class="trigger-btn" @click="showLongText">Long text wrap</button>
        <button class="trigger-btn" @click="showNoClose">closable:false</button>
        <button class="trigger-btn" @click="showPersistent">Persistent (timer:false)</button>
      </div>
      <pre class="code"><code>{{ contentPropCode }}</code></pre>
    </section>

    <!-- ── 3. Content forms — slot form ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Content forms — slot form</h2>
      <p class="section-desc">
        The declarative <code class="inline-code">&lt;TulparToast&gt;</code> SFC supports the
        <code class="inline-code">#title</code> and <code class="inline-code">#description</code>
        slots for rich content. Slots win when both prop and slot are present.
        The Fire buttons below launch live toasts via the imperative API using equivalent rich markup.
      </p>
      <div class="preview preview--col">
        <div class="slot-demo-label">#title — rich markup in the heading</div>
        <TulparToast tone="success" :timer="false">
          <template #title><strong>Başarı</strong> — tüm testler geçti ✓</template>
        </TulparToast>
        <div class="slot-fire-row">
          <button class="trigger-btn" @click="fireSlotTitle">Fire (rich title)</button>
        </div>

        <div class="slot-demo-label" style="margin-top: 16px">#description — body with em</div>
        <TulparToast tone="warning" heading="Dikkat" :timer="false">
          <template #description>
            Bu işlem <em>geri alınamaz</em>. Devam etmek istiyor musunuz?
          </template>
        </TulparToast>
        <div class="slot-fire-row">
          <button class="trigger-btn" @click="fireSlotDescription">Fire (rich description)</button>
        </div>
      </div>
      <pre class="code"><code>{{ contentSlotCode }}</code></pre>
    </section>

    <!-- ── 4. Icons — prop form ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Icons — prop form</h2>
      <p class="section-desc">
        Icons via the <code class="inline-code">icon</code> option: default per-tone (nothing
        needed), built-in name, raw SVG string, or emoji. Pass
        <code class="inline-code">icon: false</code> to remove.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" @click="showIconDefault">Default per-tone</button>
        <button class="trigger-btn" @click="showIconName">Built-in name</button>
        <button class="trigger-btn" @click="showIconSvg">Raw SVG string</button>
        <button class="trigger-btn" @click="showIconEmoji">Emoji 🚀</button>
        <button class="trigger-btn" @click="showIconFalse">No icon (false)</button>
      </div>
      <pre class="code"><code>{{ iconsPropCode }}</code></pre>
    </section>

    <!-- ── 5. Icons — slot form ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Icons — slot form</h2>
      <p class="section-desc">
        <code class="inline-code">#icon</code> on the declarative SFC accepts any content: a Lucide
        SVG (inline), a custom <code class="inline-code">&lt;svg&gt;</code>, or an
        <code class="inline-code">&lt;img&gt;</code>. Tulpar ships only the four built-in tone icons;
        consumers bring their own via this slot. The Fire button below fires a live toast with a
        custom icon via the raw-SVG icon prop.
      </p>
      <div class="preview preview--col">
        <div class="slot-demo-label">#icon — inline SVG (custom shield)</div>
        <TulparToast tone="info" heading="Güvenlik uyarısı" :timer="false">
          <template #icon>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </template>
        </TulparToast>
        <div class="slot-fire-row">
          <button class="trigger-btn" @click="fireIconSlot">Fire (custom icon)</button>
        </div>

        <div class="slot-demo-label" style="margin-top: 16px">#icon — circle-check SVG</div>
        <TulparToast tone="success" heading="Doğrulama tamamlandı" :timer="false">
          <template #icon>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </template>
        </TulparToast>
      </div>
      <pre class="code"><code>{{ iconsSlotCode }}</code></pre>
    </section>

    <!-- ── 6. Custom tone ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Custom tone</h2>
      <p class="section-desc">
        <code class="inline-code">color</code> accepts a brand family name
        (<code class="inline-code">ilay · umay · gok · ulgen · kizagan · erlik</code>, mode-aware) or
        a raw CSS color (contrast is author's responsibility). Part overrides
        (<code class="inline-code">bg · accent · text</code>) layer on top.
        <code class="inline-code">custom</code> tone is visual-only — semantics remain
        <code class="inline-code">status</code>.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn trigger-btn--custom" @click="showCustomIlay">
          color: 'ilay'
        </button>
        <button class="trigger-btn trigger-btn--custom" @click="showCustomUmay">
          color: 'umay'
        </button>
        <button class="trigger-btn trigger-btn--custom" @click="showCustomGok">color: 'gok'</button>
        <button class="trigger-btn trigger-btn--custom" @click="showCustomHex">
          color: '#0d9488'
        </button>
        <button class="trigger-btn trigger-btn--custom" @click="showCustomPartOverride">
          Part override (bg/accent/text)
        </button>
      </div>
      <pre class="code"><code>{{ customToneCode }}</code></pre>
    </section>

    <!-- ── 7. Timer ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Timer</h2>
      <p class="section-desc">
        The perimeter countdown ring depletes around the entire card border.
        <code class="inline-code">timerStyle:'track'</code> (default) adds a faint static track;
        <code class="inline-code">'soft'</code> shows only the depleting fill.
        <code class="inline-code">timer:false</code> disables the ring and auto-dismiss entirely.
        Hover or focus any toast to <strong>pause the timer</strong> — resume on leave/blur. Under
        <code class="inline-code">prefers-reduced-motion</code>, the ring becomes a static border.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" @click="showTimerTrack">Track style (default)</button>
        <button class="trigger-btn" @click="showTimerSoft">Soft style</button>
        <button class="trigger-btn" @click="showTimerCustomDuration">Custom duration (10s)</button>
        <button class="trigger-btn" @click="showTimerFalse">Persistent (timer:false)</button>
        <button class="trigger-btn trigger-btn--info" @click="showTimerPauseDemo">
          Hover pause proof
        </button>
      </div>
      <pre class="code"><code>{{ timerCode }}</code></pre>
    </section>

    <!-- ── 8. Stacking ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Stacking</h2>
      <p class="section-desc">
        Default: collapsed stack of up to <strong>3</strong> visible toasts — hover or focus the
        stack to expand it (and pause all timers). Beyond
        <code class="inline-code">maxVisible</code>, toasts <strong>queue</strong> and promote as
        visible ones dismiss (Sonner-style). Use <code class="inline-code">expand:true</code> to show
        an always-expanded list instead of the collapsed fan.
      </p>

      <!-- Live control panel -->
      <div class="preview preview--col stack-controls-preview">
        <!-- maxVisible row -->
        <div class="stack-control-row">
          <label class="stack-control-label" for="stack-max-visible">Max visible</label>
          <div class="stack-stepper">
            <button
              class="stepper-btn"
              :disabled="stackMaxVisible <= 1"
              @click="decrementMaxVisible"
              aria-label="Decrease max visible"
            >
              −
            </button>
            <span class="stepper-value" id="stack-max-visible">{{ stackMaxVisible }}</span>
            <button
              class="stepper-btn"
              :disabled="stackMaxVisible >= 8"
              @click="incrementMaxVisible"
              aria-label="Increase max visible"
            >
              +
            </button>
          </div>
          <span class="stack-control-hint">
            Beyond this, toasts <strong>queue</strong> and promote as visible ones dismiss
          </span>
        </div>

        <!-- expand row -->
        <div class="stack-control-row">
          <label class="stack-control-label" for="stack-expand-toggle">Expand mode</label>
          <button
            id="stack-expand-toggle"
            class="stack-toggle"
            :class="{ 'stack-toggle--on': stackExpand }"
            @click="toggleStackExpand"
            :aria-pressed="stackExpand"
          >
            <span class="stack-toggle-knob"></span>
          </button>
          <span class="stack-control-hint">
            {{ stackExpand ? "Always-expanded list" : "Collapsed fan (hover / focus to expand)" }}
          </span>
        </div>

        <!-- live state badge -->
        <div class="stack-state-badge">
          <code>setDefaults({ maxVisible: {{ stackMaxVisible }}, expand: {{ stackExpand }} })</code>
        </div>

        <!-- fire button -->
        <div class="stack-fire-row">
          <button class="trigger-btn trigger-btn--info stack-fire-btn" @click="fireStackToasts">
            Fire {{ stackMaxVisible + 3 }} toasts
          </button>
          <span class="stack-fire-hint">
            Fires maxVisible + 3 = <strong>{{ stackMaxVisible + 3 }}</strong> toasts so you can see
            the cap, queue &amp; drain
          </span>
        </div>
      </div>
      <pre class="code"><code>{{ stackingCode }}</code></pre>
    </section>

    <!-- ── 9. Location ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Location</h2>
      <p class="section-desc">
        Six positions via per-call <code class="inline-code">location</code> override. The toaster
        global default is <code class="inline-code">bottom-right</code>; Message is always
        <code class="inline-code">top-center</code>. Each location maintains its own independent
        stack.
      </p>
      <div class="preview">
        <div class="location-grid">
          <button class="trigger-btn trigger-btn--loc" @click="showLocation('top-left')">
            top-left
          </button>
          <button class="trigger-btn trigger-btn--loc" @click="showLocation('top-center')">
            top-center
          </button>
          <button class="trigger-btn trigger-btn--loc" @click="showLocation('top-right')">
            top-right
          </button>
          <button class="trigger-btn trigger-btn--loc" @click="showLocation('bottom-left')">
            bottom-left
          </button>
          <button class="trigger-btn trigger-btn--loc" @click="showLocation('bottom-center')">
            bottom-center
          </button>
          <button class="trigger-btn trigger-btn--loc" @click="showLocation('bottom-right')">
            bottom-right
          </button>
        </div>
      </div>
      <pre class="code"><code>{{ locationCode }}</code></pre>
    </section>

    <!-- ── 10. Async / lifecycle ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Async / lifecycle</h2>
      <p class="section-desc">
        <code class="inline-code">toast.promise</code> shows a loading toast and automatically
        updates it on settle — success receives the resolved value.
        <code class="inline-code">toast.update</code> mutates a live toast.
        <code class="inline-code">toast.dismiss(id)</code> dismisses one;
        <code class="inline-code">toast.dismiss()</code> dismisses all. The
        <code class="inline-code">onDismiss</code> callback fires with a reason on every dismissal.
      </p>

      <!-- Promise flow diagram -->
      <div class="promise-flow">
        <span class="step step--loading">loading</span>
        <span class="arrow">→</span>
        <span class="step step--success">success (resolved value)</span>
        <span class="arrow">/</span>
        <span class="step step--error">error (rejection reason)</span>
      </div>

      <div class="preview preview--trigger-grid">
        <button class="trigger-btn trigger-btn--info" @click="showPromiseSuccess">
          promise → success
        </button>
        <button class="trigger-btn trigger-btn--danger" @click="showPromiseError">
          promise → error
        </button>
        <button class="trigger-btn" @click="showUpdate">update (2s delay)</button>
        <button class="trigger-btn" @click="showDismissId">dismiss(id) after 2s</button>
        <button class="trigger-btn trigger-btn--danger" @click="dismissAll">dismiss() — all</button>
        <button class="trigger-btn" @click="showOnDismiss">onDismiss callback</button>
      </div>

      <div v-if="lastDismissReason" class="reason-badge-wrap">
        <span class="reason-badge">
          onDismiss reason: <strong>{{ lastDismissReason }}</strong>
        </span>
      </div>

      <pre class="code"><code>{{ asyncCode }}</code></pre>
    </section>

    <!-- ── 11. Rich content ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">11. Rich content</h2>
      <p class="section-desc">
        The declarative SFC's default slot accepts arbitrary markup — avatars, progress bars,
        anything. This is the escape hatch when the imperative API's title/description/action model
        is insufficient. The Fire button below fires a live toast via
        <code class="inline-code">toast.custom(HTMLElement)</code> — the canonical imperative rich-content API.
        Use sparingly; complex markup belongs in a Dialog.
      </p>
      <div class="preview preview--col">
        <div class="slot-demo-label">Default slot — avatar + inline progress bar</div>
        <TulparToast tone="info" :timer="false">
          <template #title>Dosya işleniyor</template>
          <template #description>
            <div class="rich-content-row">
              <div class="rich-avatar">📄</div>
              <div class="rich-file-info">
                <div class="rich-filename">rapor_q4_final.xlsx</div>
                <div class="rich-progress-bar">
                  <div class="rich-progress-fill" style="width: 62%"></div>
                </div>
                <div class="rich-progress-label">62% — kalan süre ~5s</div>
              </div>
            </div>
          </template>
        </TulparToast>
        <div class="slot-fire-row">
          <button class="trigger-btn trigger-btn--info" @click="fireRichToast">Fire rich toast</button>
        </div>
      </div>
      <pre class="code"><code>{{ richContentCode }}</code></pre>
    </section>

    <!-- ── 12. A11y ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">12. Accessibility</h2>
      <p class="section-desc">
        Toasts announce without stealing focus. Actionable toasts (with
        <code class="inline-code">actions</code>) escalate to
        <code class="inline-code">alertdialog</code> inside a labelled region. Keyboard access:
        <kbd>F6</kbd> jumps focus to the toast region; <kbd>Esc</kbd> dismisses the focused toast.
        Swipe-to-dismiss with spring-back below threshold. The perimeter ring freezes under
        <code class="inline-code">prefers-reduced-motion</code>.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" @click="showA11ySwipe">Swipe-to-dismiss demo</button>
        <button class="trigger-btn" @click="showA11yEsc">Esc on focused toast</button>
        <button class="trigger-btn" @click="showA11yF6">F6 jump to region</button>
        <button class="trigger-btn trigger-btn--danger" @click="showA11yActionable">
          Actionable → alertdialog
        </button>
        <button class="trigger-btn" @click="showA11yDark">Dark mode note</button>
        <button class="trigger-btn" @click="showA11yReducedMotion">Reduced-motion note</button>
      </div>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Swipe:</strong> Horizontal swipe past threshold →
          <code class="inline-code">reason:'swipe'</code>; below threshold springs back. Disabled
          under <code class="inline-code">prefers-reduced-motion</code>.
        </div>
        <div class="a11y-note">
          <strong>F6 / Shift+F6:</strong> Jumps focus to the toast notification region from
          anywhere. Esc dismisses the focused toast; focus restores when the region empties.
        </div>
        <div class="a11y-note">
          <strong>Dark mode:</strong> Add <code class="inline-code">.dark</code> to
          <code class="inline-code">&lt;body&gt;</code>. All tone surfaces flip automatically — deep
          tinted background, lightened text, 1px border.
        </div>
        <div class="a11y-note">
          <strong>prefers-reduced-motion:</strong> The timer ring animation is replaced by a static
          border. Enter/exit transitions reduce to a ≤100ms opacity fade only.
        </div>
      </div>
      <pre class="code"><code>{{ a11yCode }}</code></pre>
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

/* ── When / when-not decision card ──────────────────────────────── */
.decision-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  border-color: #f4c2bf;
  background: #fdeceb;
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

/* ── Dark mode — decision cols (moved to non-scoped block below) ─── */

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

.preview--col {
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
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

.trigger-btn--danger-hc {
  border-color: #c0322b;
  background: #c0322b;
  color: #ffffff;
}

.trigger-btn--custom {
  border-color: #d8c5ff;
  background: #f6f0ff;
  color: #6d28d9;
}

.trigger-btn--loc {
  font-size: 11px;
  padding: 6px 10px;
  text-align: center;
}

/* ── Dark mode — tinted trigger buttons (moved to non-scoped block below) ── */

/* ── Location grid ───────────────────────────────────────────────── */
.location-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 8px;
  width: 100%;
  max-width: 380px;
}

/* ── Stacking live controls ─────────────────────────────────────── */
.stack-controls-preview {
  gap: 0;
  padding: 20px 24px;
}

.stack-control-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
  flex-wrap: wrap;
}

.stack-control-row:last-of-type {
  border-bottom: none;
}

.stack-control-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
  min-width: 90px;
  flex-shrink: 0;
}

.stack-control-hint {
  font-size: 12px;
  color: var(--tulpar-color-text-muted, #74777a);
  line-height: 1.4;
}

/* ── Number stepper ─────────────────────────────────────────────── */
.stack-stepper {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 8px;
  overflow: hidden;
  background: var(--tulpar-color-bg-elevated, #fff);
  flex-shrink: 0;
}

.stepper-btn {
  font: inherit;
  font-size: 16px;
  font-weight: 700;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--tulpar-color-text-primary, #15110b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 100ms ease;
  flex-shrink: 0;
}

.stepper-btn:hover:not(:disabled) {
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
}

.stepper-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.stepper-value {
  font-size: 14px;
  font-weight: 700;
  min-width: 28px;
  text-align: center;
  color: var(--tulpar-color-text-primary, #15110b);
  border-left: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-right: 1px solid var(--tulpar-color-border-default, #d9e0df);
  line-height: 32px;
}

/* ── Expand toggle ──────────────────────────────────────────────── */
.stack-toggle {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 11px;
  border: 2px solid var(--tulpar-color-border-default, #d9e0df);
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  cursor: pointer;
  transition:
    background 150ms ease,
    border-color 150ms ease;
  flex-shrink: 0;
  padding: 0;
}

.stack-toggle--on {
  background: var(--tulpar-color-brand-default, #00c57a);
  border-color: var(--tulpar-color-brand-default, #00c57a);
}

.stack-toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--tulpar-color-bg-elevated, #fff);
  transition: transform 150ms ease;
  pointer-events: none;
}

.stack-toggle--on .stack-toggle-knob {
  transform: translateX(18px);
}

/* ── Live state badge ───────────────────────────────────────────── */
.stack-state-badge {
  margin-top: 14px;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--tulpar-color-bg-inverse, #15110b);
  color: #d9e0df;
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 12.5px;
  display: inline-block;
  max-width: 100%;
  overflow-x: auto;
}

/* ── Fire button row ────────────────────────────────────────────── */
.stack-fire-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.stack-fire-btn {
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.stack-fire-hint {
  font-size: 12px;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* ── Promise flow diagram ────────────────────────────────────────── */
.promise-flow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.step {
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid;
  font-size: 12px;
  font-weight: 600;
}

.step--loading {
  background: #eff4ff;
  border-color: #bfd3ff;
  color: #2563eb;
}

.step--success {
  background: #e9f7f1;
  border-color: #b4e3d2;
  color: #16876a;
}

.step--error {
  background: #fdeceb;
  border-color: #f4c2bf;
  color: #c0322b;
}

/* ── Dark mode — promise flow badges (moved to non-scoped block below) ──── */

.arrow {
  color: var(--tulpar-color-text-muted, #74777a);
  font-size: 14px;
  font-weight: 600;
}

/* ── Dismiss reason badge ────────────────────────────────────────── */
.reason-badge-wrap {
  padding: 12px 24px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border-left: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-right: 1px solid var(--tulpar-color-border-default, #d9e0df);
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

/* ── Slot fire row ───────────────────────────────────────────────── */
.slot-fire-row {
  margin-top: 10px;
  margin-bottom: 6px;
}

/* ── Slot demo labels ────────────────────────────────────────────── */
.slot-demo-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--tulpar-color-text-muted, #74777a);
  text-transform: uppercase;
  margin-bottom: 10px;
}

/* ── Rich content slot demo ──────────────────────────────────────── */
.rich-content-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 6px;
}

.rich-avatar {
  font-size: 22px;
  flex-shrink: 0;
}

.rich-file-info {
  flex: 1;
  min-width: 0;
}

.rich-filename {
  font-size: 12px;
  font-weight: 600;
  color: var(--tulpar-color-text-primary, #15110b);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rich-progress-bar {
  height: 4px;
  border-radius: 2px;
  background: var(--tulpar-color-border-default, #d9e0df);
  overflow: hidden;
}

.rich-progress-fill {
  height: 100%;
  border-radius: 2px;
  background: var(--tulpar-color-brand-default, #00c57a);
}

.rich-progress-label {
  margin-top: 4px;
  font-size: 11px;
  color: var(--tulpar-color-text-muted, #74777a);
}

/* ── A11y notes ─────────────────────────────────────────────────── */
.a11y-notes {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 20px;
  background: var(--tulpar-color-bg-subtle, #e9f1ef);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-top: none;
  border-bottom: none;
}

.a11y-note {
  font-size: 13px;
  color: var(--tulpar-color-text-secondary, #57534e);
  line-height: 1.6;
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

kbd {
  font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
  font-size: 0.8em;
  background: var(--tulpar-color-bg-elevated, #fff);
  border: 1px solid var(--tulpar-color-border-default, #d9e0df);
  border-radius: 4px;
  padding: 1px 6px;
  box-shadow: 0 1px 0 var(--tulpar-color-border-default, #d9e0df);
  color: var(--tulpar-color-text-primary, #15110b);
}

.preview-label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--tulpar-color-text-muted, #74777a);
}
</style>

<!--
  Dark-mode overrides — NOT scoped.
  Vue 3's scoped-CSS compiler incorrectly compiles `:global(.dark) .child` to
  `.dark { … }` (targeting the <html> element itself) and drops the descendant
  selector entirely.  Rules that reference an ancestor global class (.dark on
  <html>) combined with a descendant scoped class must live in an unscoped
  <style> block and use an explicit ancestor path for specificity containment.
-->
<style>
/* ── Dark mode — decision cols (Toast: yes=success, no=danger) ─────── */
.dark .demo-page--toast .decision-col--yes {
  background: #11302a;
  border-color: #1e4a38;
}
.dark .demo-page--toast .decision-col--yes .decision-list {
  color: #5fcfae;
}
.dark .demo-page--toast .decision-col--yes .decision-head {
  color: #5fcfae;
}

.dark .demo-page--toast .decision-col--no {
  background: #371714;
  border-color: #552421;
}
.dark .demo-page--toast .decision-col--no .decision-list {
  color: #f08b84;
}
.dark .demo-page--toast .decision-col--no .decision-head {
  color: #f08b84;
}

/* ── Dark mode — tinted trigger buttons ───────────────────────────── */
.dark .demo-page--toast .trigger-btn--info {
  background: #15233f;
  border-color: #1e3460;
  color: #7ea6ff;
}

.dark .demo-page--toast .trigger-btn--success {
  background: #11302a;
  border-color: #1e4a38;
  color: #5fcfae;
}

.dark .demo-page--toast .trigger-btn--warning {
  background: #332810;
  border-color: #4d3c18;
  color: #e6b450;
}

.dark .demo-page--toast .trigger-btn--danger {
  background: #371714;
  border-color: #552421;
  color: #f08b84;
}

.dark .demo-page--toast .trigger-btn--custom {
  background: #2d1f4a;
  border-color: #3e2c6b;
  color: #c4a0ff;
}

/* ── Dark mode — promise flow badges ──────────────────────────────── */
.dark .demo-page--toast .step--loading {
  background: #15233f;
  border-color: #1e3460;
  color: #7ea6ff;
}

.dark .demo-page--toast .step--success {
  background: #11302a;
  border-color: #1e4a38;
  color: #5fcfae;
}

.dark .demo-page--toast .step--error {
  background: #371714;
  border-color: #552421;
  color: #f08b84;
}
</style>
