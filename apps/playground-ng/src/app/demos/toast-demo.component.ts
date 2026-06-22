import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import {
  TulparToastComponent,
  TulparToastService,
  type ToastLocation,
} from '@tulpar-ui/angular';

// ─── Code snippet strings (outside @Component to avoid backtick nesting) ──────

const TONES_CODE = `const toast = inject(TulparToastService);

toast.info('Dosya buluta yüklendi.');
toast.success('Değişiklikler kaydedildi.');
toast.warning('Depolama alanı %90 dolu.');
toast.danger('Bağlantı kesildi.', { timer: false });
toast.danger('Kritik hata — işlem başarısız.', { highContrast: true, timer: false });`;

const CONTENT_PROP_CODE = `const toast = inject(TulparToastService);

// title-only (positional message)
toast.info('Dosya kopyalandı.');

// title + description (prop form)
toast.success('Değişiklikler kaydedildi.', {
  description: 'Tüm alanlar doğrulandı ve veritabanına yazıldı.',
});

// single action
toast.warning('Bağlantı yavaş.', {
  actions: [{ label: 'Yenile', onClick: () => window.location.reload() }],
  timer: false,
});

// two actions
toast.danger('Dosya silinemedi.', {
  description: 'İzin hatası — dosyaya erişim reddedildi.',
  actions: [
    { label: 'Tekrar dene', onClick: () => console.log('retry') },
    { label: 'İptal', onClick: () => console.log('cancel') },
  ],
  timer: false,
});

// no auto-dismiss (closable:false)
toast.info('İndirme başlatıldı.', { closable: false, timer: false });`;

const CONTENT_SLOT_CODE = `<!-- Slot form — declarative <tulpar-toast-ng> element -->

<!-- title via slot="title" -->
<tulpar-toast-ng tone="success">
  <span slot="title"><strong>Başarı</strong> — tüm testler geçti.</span>
</tulpar-toast-ng>

<!-- description via slot="description" -->
<tulpar-toast-ng tone="warning" heading="Dikkat">
  <span slot="description">
    Bu işlem <em>geri alınamaz</em>. Devam etmek istiyor musunuz?
  </span>
</tulpar-toast-ng>`;

const ICONS_PROP_CODE = `const toast = inject(TulparToastService);

// default per-tone icon (no input needed)
toast.success('İkon: tone varsayılanı');

// built-in icon name
toast.info('İkon: name', { icon: 'info' });

// raw inline SVG string
toast.warning('İkon: özel SVG', {
  icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
});

// emoji
toast.info('İkon: emoji', { icon: '🚀' });

// no icon
toast.success('İkon yok', { icon: false });`;

const ICONS_SLOT_CODE = `<!-- slot="icon" — any content: Lucide, custom SVG, img -->

<tulpar-toast-ng tone="info" heading="Lucide ile özel ikon">
  <span slot="icon">
    <!-- Lucide icon via angular component: -->
    <lucide-angular [img]="ZapIcon" [size]="20"></lucide-angular>
  </span>
</tulpar-toast-ng>

<tulpar-toast-ng tone="success" heading="İnline SVG ikonu">
  <span slot="icon">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  </span>
</tulpar-toast-ng>`;

const CUSTOM_TONE_CODE = `const toast = inject(TulparToastService);

// Brand family (mode-aware light/dark flip)
toast.custom('İlay tonu', { color: 'ilay' });
toast.custom('Umay tonu', { color: 'umay' });
toast.custom('Gök tonu',  { color: 'gok'  });

// Raw hex color (contrast is author's responsibility)
toast.custom('Özel renk', { color: '#0d9488' });

// Part overrides (bg / accent / text)
toast.custom('Part override', {
  bg:     '#fdf4ff',
  accent: '#9333ea',
  text:   '#3b0764',
});

// CSS variable part override (via inline style on a container)
// --tulpar-toast-bg / --tulpar-toast-accent / --tulpar-toast-text`;

const TIMER_CODE = `const toast = inject(TulparToastService);

// Track style (default) — faint track + depleting fill
toast.info('Timer: track (varsayılan)', { timerStyle: 'track' });

// Soft style — depleting fill only, no track
toast.info('Timer: soft', { timerStyle: 'soft' });

// Custom duration (10 s)
toast.info('10 saniye süre', { duration: 10000, timerStyle: 'track' });

// Persistent — no ring, no auto-dismiss (timer: false)
toast.warning('Kalıcı toast — kapatmak için × tıklayın', { timer: false });

// Hover/focus pauses the timer — try hovering on any toast above.`;

const STACKING_CODE = `const toast = inject(TulparToastService);

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

const LOCATION_CODE = `const toast = inject(TulparToastService);

// Per-call location override (6 positions)
toast.info('Sol üst',        { location: 'top-left'      });
toast.info('Üst orta',       { location: 'top-center'    });
toast.info('Sağ üst',        { location: 'top-right'     });
toast.info('Sol alt',        { location: 'bottom-left'   });
toast.info('Alt orta',       { location: 'bottom-center' });
toast.info('Sağ alt',        { location: 'bottom-right'  }); // default`;

const ASYNC_CODE = `const toast = inject(TulparToastService);

// toast.promise — loading → success/error; resolved value in message
const save = (): Promise<{ count: number }> =>
  new Promise((res, rej) => setTimeout(() => Math.random() > 0.3 ? res({ count: 7 }) : rej(new Error('timeout')), 2000));

await toast.promise(save(), {
  loading: 'Kaydediliyor…',
  success: (data) => \`\${data.count} kayıt güncellendi.\`,
  error:   (err)  => \`Hata: \${(err as Error).message}\`,
});

// toast.update — mutate a live toast in place
const id = toast.info('Yükleniyor…', { timer: false });
setTimeout(() => toast.update(id, { tone: 'success', title: 'Tamamlandı!' }), 2000);

// toast.dismiss(id) — dismiss one; toast.dismiss() — dismiss all
const id2 = toast.warning('Bu toast 2s içinde kapatılacak', { timer: false });
setTimeout(() => toast.dismiss(id2), 2000);

// onDismiss callback — reason: 'timeout' | 'user' | 'action' | 'swipe' | 'programmatic'
toast.info('Kapanma sebebini incele', {
  onDismiss: (reason) => console.log('Dismissed:', reason),
});`;

const RICH_CONTENT_CODE = `// Declarative element with arbitrary default slot content
<tulpar-toast-ng tone="info" [timer]="false">
  <span slot="title">Dosya işleniyor</span>
  <span slot="description">
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
  </span>
</tulpar-toast-ng>`;

const A11Y_CODE = `// F6 → jumps focus to the toast region from anywhere on the page
// Esc → dismisses the currently focused toast
// Shift+F6 → reverse-cycles the region

// Swipe to dismiss (touch/pointer):
// Horizontal swipe past threshold → dismisses with reason:'swipe'
// Below threshold → springs back to original position
// Disabled under prefers-reduced-motion

// Actionable toast (has action[]) → escalates to alertdialog inside
// a labelled region — WCAG 2.4 + SC 4.1.3 compliant:
toast.danger('Oturumunuz sona eriyor.', {
  actions: [{ label: 'Uzat', onClick: () => extendSession() }],
  timer: false,
});

// Dark mode: the toast surface flips automatically when .dark class is on <body>
// prefers-reduced-motion: the perimeter ring animation is replaced by a static border`;

// ─── Component ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-toast-demo',
  standalone: true,
  imports: [TulparToastComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Feedback</span>
      <h1 class="page-title">Toast</h1>
      <p class="page-lede">
        Toasts are code-triggered, transient, non-blocking feedback shown in a corner of the
        screen. They stack, timer out, and carry optional actions. Use them for background
        events, confirmations with an action (Undo), and errors that need user attention.
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
            <li>You need to show loading → result in one place (<code class="inline-code">toast.promise</code>)</li>
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
        Five tones: <code class="inline-code">info</code> · <code class="inline-code">success</code> ·
        <code class="inline-code">warning</code> · <code class="inline-code">danger</code> ·
        <code class="inline-code">danger high-contrast</code>. Each carries its status icon.
        High-contrast danger escalates to a saturated surface with white text for genuinely urgent failures.
      </p>
      <div class="preview">
        <button class="trigger-btn trigger-btn--info"    (click)="showInfo()">Info</button>
        <button class="trigger-btn trigger-btn--success" (click)="showSuccess()">Success</button>
        <button class="trigger-btn trigger-btn--warning" (click)="showWarning()">Warning</button>
        <button class="trigger-btn trigger-btn--danger"  (click)="showDanger()">Danger</button>
        <button class="trigger-btn trigger-btn--danger-hc" (click)="showDangerHC()">Danger high-contrast</button>
      </div>
      <pre class="code"><code>{{ tonesCode }}</code></pre>
    </section>

    <!-- ── 2. Content forms — prop form ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Content forms — prop form</h2>
      <p class="section-desc">
        Every content capability is available as imperative options: title-only, title + description,
        single action, two actions, long-text wrap, and <code class="inline-code">closable:false</code>.
        The <code class="inline-code">description</code> prop is free-form text; actions accept a
        label + onClick. Both slot forms are shown in the next section.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" (click)="showTitleOnly()">Title only</button>
        <button class="trigger-btn" (click)="showTitleDesc()">Title + description</button>
        <button class="trigger-btn" (click)="showSingleAction()">Single action</button>
        <button class="trigger-btn" (click)="showTwoActions()">Two actions</button>
        <button class="trigger-btn" (click)="showLongText()">Long text wrap</button>
        <button class="trigger-btn" (click)="showNoClose()">closable:false</button>
        <button class="trigger-btn" (click)="showPersistent()">Persistent (timer:false)</button>
      </div>
      <pre class="code"><code>{{ contentPropCode }}</code></pre>
    </section>

    <!-- ── 3. Content forms — slot form ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Content forms — slot form</h2>
      <p class="section-desc">
        The declarative <code class="inline-code">&lt;tulpar-toast-ng&gt;</code> element supports
        <code class="inline-code">slot="title"</code> and <code class="inline-code">slot="description"</code>
        for rich content. Slots win when both prop and slot are present.
        The Fire buttons below launch live toasts via the imperative API using equivalent rich markup.
      </p>
      <div class="preview preview--col">
        <div class="slot-demo-label">slot="title" — rich markup in the heading</div>
        <tulpar-toast-ng tone="success" [timer]="false">
          <span slot="title"><strong>Başarı</strong> — tüm testler geçti ✓</span>
        </tulpar-toast-ng>
        <div class="slot-fire-row">
          <button class="trigger-btn" (click)="fireSlotTitle()">Fire (rich title)</button>
        </div>

        <div class="slot-demo-label" style="margin-top:16px">slot="description" — body with em</div>
        <tulpar-toast-ng tone="warning" heading="Dikkat" [timer]="false">
          <span slot="description">
            Bu işlem <em>geri alınamaz</em>. Devam etmek istiyor musunuz?
          </span>
        </tulpar-toast-ng>
        <div class="slot-fire-row">
          <button class="trigger-btn" (click)="fireSlotDescription()">Fire (rich description)</button>
        </div>
      </div>
      <pre class="code"><code>{{ contentSlotCode }}</code></pre>
    </section>

    <!-- ── 4. Icons — prop form ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Icons — prop form</h2>
      <p class="section-desc">
        Icons via the <code class="inline-code">icon</code> option: default per-tone (nothing needed),
        built-in name, raw SVG string, or emoji. Pass <code class="inline-code">icon: false</code> to remove.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" (click)="showIconDefault()">Default per-tone</button>
        <button class="trigger-btn" (click)="showIconName()">Built-in name</button>
        <button class="trigger-btn" (click)="showIconSvg()">Raw SVG string</button>
        <button class="trigger-btn" (click)="showIconEmoji()">Emoji 🚀</button>
        <button class="trigger-btn" (click)="showIconFalse()">No icon (false)</button>
      </div>
      <pre class="code"><code>{{ iconsPropCode }}</code></pre>
    </section>

    <!-- ── 5. Icons — slot form ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Icons — slot form</h2>
      <p class="section-desc">
        <code class="inline-code">slot="icon"</code> on the declarative element accepts any content:
        a Lucide SVG (inline), a custom <code class="inline-code">&lt;svg&gt;</code>, or an
        <code class="inline-code">&lt;img&gt;</code>. Tulpar ships only the four built-in tone icons;
        consumers bring their own via this slot. The Fire button below fires a live toast with a
        custom icon via the raw-SVG icon prop.
      </p>
      <div class="preview preview--col">
        <div class="slot-demo-label">slot="icon" — inline SVG (custom shield)</div>
        <tulpar-toast-ng tone="info" heading="Güvenlik uyarısı" [timer]="false">
          <span slot="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </span>
        </tulpar-toast-ng>
        <div class="slot-fire-row">
          <button class="trigger-btn" (click)="fireIconSlot()">Fire (custom icon)</button>
        </div>

        <div class="slot-demo-label" style="margin-top:16px">slot="icon" — circle-check SVG</div>
        <tulpar-toast-ng tone="success" heading="Doğrulama tamamlandı" [timer]="false">
          <span slot="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </span>
        </tulpar-toast-ng>
      </div>
      <pre class="code"><code>{{ iconsSlotCode }}</code></pre>
    </section>

    <!-- ── 6. Custom tone ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Custom tone</h2>
      <p class="section-desc">
        <code class="inline-code">color</code> accepts a brand family name
        (<code class="inline-code">ilay · umay · gok · ulgen · kizagan · erlik</code>, mode-aware) or a
        raw CSS color (contrast is author's responsibility). Part overrides
        (<code class="inline-code">bg · accent · text</code>) layer on top.
        <code class="inline-code">custom</code> tone is visual-only — semantics remain <code class="inline-code">status</code>.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn trigger-btn--custom" (click)="showCustomIlay()">color: 'ilay'</button>
        <button class="trigger-btn trigger-btn--custom" (click)="showCustomUmay()">color: 'umay'</button>
        <button class="trigger-btn trigger-btn--custom" (click)="showCustomGok()">color: 'gok'</button>
        <button class="trigger-btn trigger-btn--custom" (click)="showCustomHex()">color: '#0d9488'</button>
        <button class="trigger-btn trigger-btn--custom" (click)="showCustomPartOverride()">Part override (bg/accent/text)</button>
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
        Hover or focus any toast to <strong>pause the timer</strong> — resume on leave/blur.
        Under <code class="inline-code">prefers-reduced-motion</code>, the ring becomes a static border.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" (click)="showTimerTrack()">Track style (default)</button>
        <button class="trigger-btn" (click)="showTimerSoft()">Soft style</button>
        <button class="trigger-btn" (click)="showTimerCustomDuration()">Custom duration (10s)</button>
        <button class="trigger-btn" (click)="showTimerFalse()">Persistent (timer:false)</button>
        <button class="trigger-btn trigger-btn--info" (click)="showTimerPauseDemo()">Hover pause proof</button>
      </div>
      <pre class="code"><code>{{ timerCode }}</code></pre>
    </section>

    <!-- ── 8. Stacking ───────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Stacking</h2>
      <p class="section-desc">
        Default: collapsed stack of up to <strong>3</strong> visible toasts — hover or focus the stack to expand it
        (and pause all timers). Beyond <code class="inline-code">maxVisible</code>, toasts <strong>queue</strong> and
        promote as visible ones dismiss (Sonner-style). Use <code class="inline-code">expand:true</code> to show an
        always-expanded list instead of the collapsed fan.
      </p>

      <!-- Live control panel -->
      <div class="preview preview--col stack-controls-preview">

        <!-- maxVisible row -->
        <div class="stack-control-row">
          <label class="stack-control-label" for="stack-max-visible">
            Max visible
          </label>
          <div class="stack-stepper">
            <button
              class="stepper-btn"
              [disabled]="stackMaxVisible() <= 1"
              (click)="decrementMaxVisible()"
              aria-label="Decrease max visible"
            >−</button>
            <span class="stepper-value" id="stack-max-visible">{{ stackMaxVisible() }}</span>
            <button
              class="stepper-btn"
              [disabled]="stackMaxVisible() >= 8"
              (click)="incrementMaxVisible()"
              aria-label="Increase max visible"
            >+</button>
          </div>
          <span class="stack-control-hint">
            Beyond this, toasts <strong>queue</strong> and promote as visible ones dismiss
          </span>
        </div>

        <!-- expand row -->
        <div class="stack-control-row">
          <label class="stack-control-label" for="stack-expand-toggle">
            Expand mode
          </label>
          <button
            id="stack-expand-toggle"
            class="stack-toggle"
            [class.stack-toggle--on]="stackExpand()"
            (click)="toggleStackExpand()"
            [attr.aria-pressed]="stackExpand()"
          >
            <span class="stack-toggle-knob"></span>
          </button>
          <span class="stack-control-hint">
            {{ stackExpand() ? 'Always-expanded list' : 'Collapsed fan (hover / focus to expand)' }}
          </span>
        </div>

        <!-- live state badge -->
        <div class="stack-state-badge">
          <code>setDefaults&#40;&#123; maxVisible: {{ stackMaxVisible() }}, expand: {{ stackExpand() }} &#125;&#41;</code>
        </div>

        <!-- fire button -->
        <div class="stack-fire-row">
          <button class="trigger-btn trigger-btn--info stack-fire-btn" (click)="fireStackToasts()">
            Fire {{ stackMaxVisible() + 3 }} toasts
          </button>
          <span class="stack-fire-hint">
            Fires maxVisible + 3 = <strong>{{ stackMaxVisible() + 3 }}</strong> toasts so you can see the cap, queue &amp; drain
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
        <code class="inline-code">top-center</code>. Each location maintains its own independent stack.
      </p>
      <div class="preview">
        <div class="location-grid">
          <button class="trigger-btn trigger-btn--loc" (click)="showLocation('top-left')">top-left</button>
          <button class="trigger-btn trigger-btn--loc" (click)="showLocation('top-center')">top-center</button>
          <button class="trigger-btn trigger-btn--loc" (click)="showLocation('top-right')">top-right</button>
          <button class="trigger-btn trigger-btn--loc" (click)="showLocation('bottom-left')">bottom-left</button>
          <button class="trigger-btn trigger-btn--loc" (click)="showLocation('bottom-center')">bottom-center</button>
          <button class="trigger-btn trigger-btn--loc" (click)="showLocation('bottom-right')">bottom-right</button>
        </div>
      </div>
      <pre class="code"><code>{{ locationCode }}</code></pre>
    </section>

    <!-- ── 10. Async / lifecycle ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Async / lifecycle</h2>
      <p class="section-desc">
        <code class="inline-code">toast.promise</code> shows a loading toast and automatically
        updates it on settle — success receives the resolved value. <code class="inline-code">toast.update</code>
        mutates a live toast. <code class="inline-code">toast.dismiss(id)</code> dismisses one;
        <code class="inline-code">toast.dismiss()</code> dismisses all.
        The <code class="inline-code">onDismiss</code> callback fires with a reason on every dismissal.
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
        <button class="trigger-btn trigger-btn--info" (click)="showPromiseSuccess()">promise → success</button>
        <button class="trigger-btn trigger-btn--danger" (click)="showPromiseError()">promise → error</button>
        <button class="trigger-btn" (click)="showUpdate()">update (2s delay)</button>
        <button class="trigger-btn" (click)="showDismissId()">dismiss(id) after 2s</button>
        <button class="trigger-btn trigger-btn--danger" (click)="toast.dismiss()">dismiss() — all</button>
        <button class="trigger-btn" (click)="showOnDismiss()">onDismiss callback</button>
      </div>

      @if (lastDismissReason()) {
        <div class="reason-badge-wrap">
          <span class="reason-badge">
            onDismiss reason: <strong>{{ lastDismissReason() }}</strong>
          </span>
        </div>
      }

      <pre class="code"><code>{{ asyncCode }}</code></pre>
    </section>

    <!-- ── 11. Rich content ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">11. Rich content</h2>
      <p class="section-desc">
        The declarative element's default slot accepts arbitrary markup — avatars, progress bars,
        anything. This is the escape hatch when the imperative API's title/description/action model
        is insufficient. The Fire button below fires a live toast via
        <code class="inline-code">toast.custom(HTMLElement)</code> — the canonical imperative rich-content API.
        Use sparingly; complex markup belongs in a Dialog.
      </p>
      <div class="preview preview--col">
        <div class="slot-demo-label">Default slot — avatar + inline progress bar</div>
        <tulpar-toast-ng tone="info" [timer]="false">
          <span slot="title">Dosya işleniyor</span>
          <span slot="description">
            <div class="rich-content-row">
              <div class="rich-avatar">📄</div>
              <div class="rich-file-info">
                <div class="rich-filename">rapor_q4_final.xlsx</div>
                <div class="rich-progress-bar">
                  <div class="rich-progress-fill" style="width:62%"></div>
                </div>
                <div class="rich-progress-label">62% — kalan süre ~5s</div>
              </div>
            </div>
          </span>
        </tulpar-toast-ng>
        <div class="slot-fire-row">
          <button class="trigger-btn trigger-btn--info" (click)="fireRichToast()">Fire rich toast</button>
        </div>
      </div>
      <pre class="code"><code>{{ richContentCode }}</code></pre>
    </section>

    <!-- ── 12. A11y ───────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">12. Accessibility</h2>
      <p class="section-desc">
        Toasts announce without stealing focus. Actionable toasts (with <code class="inline-code">action</code>)
        escalate to <code class="inline-code">alertdialog</code> inside a labelled region.
        Keyboard access: <kbd>F6</kbd> jumps focus to the toast region; <kbd>Esc</kbd> dismisses
        the focused toast. Swipe-to-dismiss with spring-back below threshold.
        The perimeter ring freezes under <code class="inline-code">prefers-reduced-motion</code>.
      </p>
      <div class="preview preview--trigger-grid">
        <button class="trigger-btn" (click)="showA11ySwipe()">Swipe-to-dismiss demo</button>
        <button class="trigger-btn" (click)="showA11yEsc()">Esc on focused toast</button>
        <button class="trigger-btn" (click)="showA11yF6()">F6 jump to region</button>
        <button class="trigger-btn trigger-btn--danger" (click)="showA11yActionable()">Actionable → alertdialog</button>
        <button class="trigger-btn" (click)="showA11yDark()">Dark mode note</button>
        <button class="trigger-btn" (click)="showA11yReducedMotion()">Reduced-motion note</button>
      </div>
      <div class="a11y-notes">
        <div class="a11y-note">
          <strong>Swipe:</strong> Horizontal swipe past threshold → <code class="inline-code">reason:'swipe'</code>; below threshold springs back. Disabled under <code class="inline-code">prefers-reduced-motion</code>.
        </div>
        <div class="a11y-note">
          <strong>F6 / Shift+F6:</strong> Jumps focus to the toast notification region from anywhere. Esc dismisses the focused toast; focus restores when the region empties.
        </div>
        <div class="a11y-note">
          <strong>Dark mode:</strong> Add <code class="inline-code">.dark</code> to <code class="inline-code">&lt;body&gt;</code>. All tone surfaces flip automatically — deep tinted background, lightened text, 1px border.
        </div>
        <div class="a11y-note">
          <strong>prefers-reduced-motion:</strong> The timer ring animation is replaced by a static border. Enter/exit transitions reduce to a ≤100ms opacity fade only.
        </div>
      </div>
      <pre class="code"><code>{{ a11yCode }}</code></pre>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

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
        .decision-grid { grid-template-columns: 1fr; }
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

      /* ── Dark mode — decision cols ───────────────────────────────────── */
      :host-context(.dark) .decision-col--yes {
        background: #11302a;
        border-color: #1e4a38;
      }
      :host-context(.dark) .decision-col--yes .decision-list {
        color: #5fcfae;
      }
      :host-context(.dark) .decision-col--yes .decision-head {
        color: #5fcfae;
      }

      :host-context(.dark) .decision-col--no {
        background: #371714;
        border-color: #552421;
      }
      :host-context(.dark) .decision-col--no .decision-list {
        color: #f08b84;
      }
      :host-context(.dark) .decision-col--no .decision-head {
        color: #f08b84;
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
        transition: transform 120ms ease, box-shadow 120ms ease;
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

      /* ── Dark mode — tinted trigger buttons ──────────────────────────── */
      :host-context(.dark) .trigger-btn--info {
        background: #15233f;
        border-color: #1e3460;
        color: #7ea6ff;
      }

      :host-context(.dark) .trigger-btn--success {
        background: #11302a;
        border-color: #1e4a38;
        color: #5fcfae;
      }

      :host-context(.dark) .trigger-btn--warning {
        background: #332810;
        border-color: #4d3c18;
        color: #e6b450;
      }

      :host-context(.dark) .trigger-btn--danger {
        background: #371714;
        border-color: #552421;
        color: #f08b84;
      }

      :host-context(.dark) .trigger-btn--custom {
        background: #2d1f4a;
        border-color: #3e2c6b;
        color: #c4a0ff;
      }

      /* ── Location grid ───────────────────────────────────────────────── */
      .location-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, auto);
        gap: 8px;
        width: 100%;
        max-width: 380px;
      }

      /* ── Slot fire row ───────────────────────────────────────────────── */
      .slot-fire-row {
        margin-top: 10px;
        margin-bottom: 6px;
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
        transition: background 150ms ease, border-color 150ms ease;
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
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
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

      /* ── Dark mode — promise flow badges ─────────────────────────────── */
      :host-context(.dark) .step--loading {
        background: #15233f;
        border-color: #1e3460;
        color: #7ea6ff;
      }

      :host-context(.dark) .step--success {
        background: #11302a;
        border-color: #1e4a38;
        color: #5fcfae;
      }

      :host-context(.dark) .step--error {
        background: #371714;
        border-color: #552421;
        color: #f08b84;
      }

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

      kbd {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
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
    `,
  ],
})
export class ToastDemoComponent {
  protected readonly toast = inject(TulparToastService);

  readonly lastDismissReason = signal<string | null>(null);

  // ── 8. Stacking — live control signals ───────────────────────────────────
  readonly stackMaxVisible = signal<number>(3);
  readonly stackExpand     = signal<boolean>(false);

  // ── Code snippets ────────────────────────────────────────────────────────
  readonly tonesCode = TONES_CODE;
  readonly contentPropCode = CONTENT_PROP_CODE;
  readonly contentSlotCode = CONTENT_SLOT_CODE;
  readonly iconsPropCode = ICONS_PROP_CODE;
  readonly iconsSlotCode = ICONS_SLOT_CODE;
  readonly customToneCode = CUSTOM_TONE_CODE;
  readonly timerCode = TIMER_CODE;
  readonly stackingCode = STACKING_CODE;
  readonly locationCode = LOCATION_CODE;
  readonly asyncCode = ASYNC_CODE;
  readonly richContentCode = RICH_CONTENT_CODE;
  readonly a11yCode = A11Y_CODE;

  // ── 1. Tones ──────────────────────────────────────────────────────────────
  showInfo() { this.toast.info('Dosya buluta yüklendi.'); }
  showSuccess() { this.toast.success('Değişiklikler kaydedildi.'); }
  showWarning() { this.toast.warning('Depolama alanı %90 dolu.'); }
  showDanger() { this.toast.danger('Bağlantı kesildi.', { timer: false }); }
  showDangerHC() {
    this.toast.danger('Kritik hata — işlem başarısız.', { highContrast: true, timer: false });
  }

  // ── 2. Content forms — prop form ──────────────────────────────────────────
  showTitleOnly() { this.toast.info('Dosya kopyalandı.'); }
  showTitleDesc() {
    this.toast.success('Değişiklikler kaydedildi.', {
      description: 'Tüm alanlar doğrulandı ve veritabanına yazıldı.',
    });
  }
  showSingleAction() {
    this.toast.warning('Bağlantı yavaş.', {
      actions: [{ label: 'Yenile', onClick: () => console.log('[demo] refresh clicked') }],
      timer: false,
    });
  }
  showTwoActions() {
    this.toast.danger('Dosya silinemedi.', {
      description: 'İzin hatası — dosyaya erişim reddedildi.',
      actions: [
        { label: 'Tekrar dene', onClick: () => console.log('[demo] retry') },
        { label: 'İptal', onClick: () => console.log('[demo] cancel') },
      ],
      timer: false,
    });
  }
  showLongText() {
    this.toast.info(
      'Bu bildirim çok uzun bir başlığa sahip ve kart genişliği içinde nasıl sardığını göstermek için tasarlandı.',
      {
        description:
          'Açıklama satırı da uzun olabilir ve birden fazla satıra yayılabilir; bu durum kart yüksekliğini dinamik olarak artırır.',
      },
    );
  }
  showNoClose() {
    this.toast.info('İndirme başlatıldı.', { closable: false, duration: 4000 });
  }
  showPersistent() {
    this.toast.info('Kalıcı — manuel kapatma gerekli.', { timer: false });
  }

  // ── 3. Content forms — slot form — live fire buttons ─────────────────────
  /**
   * Fire (rich title): builds an HTMLElement with bold markup and passes it to
   * toast.custom(HTMLElement) so it projects into the toast's default slot.
   */
  fireSlotTitle() {
    const node = document.createElement('span');
    node.setAttribute('slot', 'title');
    node.innerHTML = '<strong>Başarı</strong> — tüm testler geçti ✓';
    this.toast.custom(node, { timer: false });
  }

  /**
   * Fire (rich description): fires a warning toast with the heading prop +
   * an HTMLElement carrying <em> markup for the description slot.
   */
  fireSlotDescription() {
    const descSpan = document.createElement('span');
    descSpan.setAttribute('slot', 'description');
    descSpan.innerHTML = 'Bu işlem <em>geri alınamaz</em>. Devam etmek istiyor musunuz?';
    this.toast.custom(descSpan, { title: 'Dikkat', timer: false });
  }

  // ── 4. Icons — prop form ──────────────────────────────────────────────────
  showIconDefault() { this.toast.success('İkon: tone varsayılanı'); }
  showIconName() { this.toast.info('İkon: name prop', { icon: 'info' }); }
  showIconSvg() {
    this.toast.warning('İkon: özel SVG string', {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
    });
  }
  showIconEmoji() { this.toast.info('Emoji ikonu 🚀', { icon: '🚀' }); }
  showIconFalse() { this.toast.success('İkon yok', { icon: false }); }

  // ── 5. Icons — slot form — live fire button ───────────────────────────────
  /** Fire (custom icon): live toast with shield SVG via raw-SVG icon prop */
  fireIconSlot() {
    this.toast.info('Güvenlik uyarısı', {
      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      timer: false,
    });
  }

  // ── 6. Custom tone ────────────────────────────────────────────────────────
  showCustomIlay() { this.toast.custom('İlay tonu (brand family, mode-aware)', { color: 'ilay' }); }
  showCustomUmay() { this.toast.custom('Umay tonu (brand family, mode-aware)', { color: 'umay' }); }
  showCustomGok()  { this.toast.custom('Gök tonu (brand family, mode-aware)',  { color: 'gok'  }); }
  showCustomHex()  { this.toast.custom('Raw hex rengi — kontrast sizin sorumluluğunuzda.', { color: '#0d9488' }); }
  showCustomPartOverride() {
    this.toast.custom('Part override örneği', {
      bg:     '#fdf4ff',
      accent: '#9333ea',
      text:   '#3b0764',
    });
  }

  // ── 7. Timer ──────────────────────────────────────────────────────────────
  showTimerTrack()         { this.toast.info('Timer: track stili (varsayılan)', { timerStyle: 'track' }); }
  showTimerSoft()          { this.toast.info('Timer: soft stili', { timerStyle: 'soft' }); }
  showTimerCustomDuration() { this.toast.info('10 saniye süre', { duration: 10_000, timerStyle: 'track' }); }
  showTimerFalse()         { this.toast.warning('Kalıcı — timer:false, otomatik kapanmaz.', { timer: false }); }
  showTimerPauseDemo()     { this.toast.info('Üzerinde bekle — timer duraklar. Fareyi çek — devam eder.', { duration: 8_000 }); }

  // ── 8. Stacking — live control methods ───────────────────────────────────
  decrementMaxVisible() {
    const next = Math.max(1, this.stackMaxVisible() - 1);
    this.stackMaxVisible.set(next);
    this.toast.setDefaults({ maxVisible: next });
  }

  incrementMaxVisible() {
    const next = Math.min(8, this.stackMaxVisible() + 1);
    this.stackMaxVisible.set(next);
    this.toast.setDefaults({ maxVisible: next });
  }

  toggleStackExpand() {
    const next = !this.stackExpand();
    this.stackExpand.set(next);
    this.toast.setDefaults({ expand: next });
  }

  fireStackToasts() {
    const maxVisible = this.stackMaxVisible();
    const expand     = this.stackExpand();
    // Apply current settings BEFORE firing so the queue rebuilds with them.
    this.toast.setDefaults({ maxVisible, expand });
    const count = maxVisible + 3;
    for (let i = 1; i <= count; i++) {
      this.toast.info(`Toast #${i} / ${count}`, { duration: 5000 });
    }
  }

  // ── 9. Location ───────────────────────────────────────────────────────────
  showLocation(location: string) {
    const labels: Record<string, string> = {
      'top-left':      'Sol üst',
      'top-center':    'Üst orta',
      'top-right':     'Sağ üst',
      'bottom-left':   'Sol alt',
      'bottom-center': 'Alt orta',
      'bottom-right':  'Sağ alt (varsayılan)',
    };
    this.toast.info(labels[location] ?? location, { location: location as ToastLocation });
  }

  // ── 10. Async / lifecycle ─────────────────────────────────────────────────
  showPromiseSuccess() {
    const fakeApi = (): Promise<{ count: number }> =>
      new Promise((res) => setTimeout(() => res({ count: 7 }), 2000));
    this.toast.promise(fakeApi(), {
      loading: 'Kaydediliyor…',
      success: (data) => `${data.count} kayıt başarıyla güncellendi.`,
      error:   (err)  => `Hata: ${(err as Error).message}`,
    });
  }
  showPromiseError() {
    const fakeFailApi = (): Promise<never> =>
      new Promise((_res, rej) => setTimeout(() => rej(new Error('sunucu hatası')), 2000));
    this.toast.promise(fakeFailApi(), {
      loading: 'Yükleniyor…',
      success: 'Tamamlandı.',
      error:   (err) => `Hata: ${(err as Error).message}`,
    }).catch(() => { /* handled by the toast */ });
  }
  showUpdate() {
    const id = this.toast.info('Güncelleme bekleniyor… (2s)', { timer: false });
    setTimeout(() => this.toast.update(id, { tone: 'success', title: 'Güncelleme tamamlandı!' }), 2000);
  }
  showDismissId() {
    const id = this.toast.warning('Bu toast 2s içinde programatik kapatılacak.', { timer: false });
    setTimeout(() => this.toast.dismiss(id), 2000);
  }
  showOnDismiss() {
    this.toast.info('Kapat veya bekle — sebebi aşağıda görün.', {
      duration: 4000,
      onDismiss: (reason) => this.lastDismissReason.set(reason),
    });
  }

  // ── 11. Rich content — live fire ─────────────────────────────────────────
  /**
   * Fires a live toast via toast.custom(HTMLElement) — the canonical imperative
   * rich-content API. Builds the same avatar + progress-bar markup as the
   * declarative preview and appends it as a light-DOM child of the toast element.
   */
  fireRichToast() {
    const node = document.createElement('div');
    node.style.cssText = 'display:flex;gap:10px;align-items:center;margin-top:6px;';
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

    // Wrap in a span with slot="description" so it projects into the right slot
    const descSpan = document.createElement('span');
    descSpan.setAttribute('slot', 'description');
    descSpan.appendChild(node);

    // toast.custom(HTMLElement) appends the element as a light-DOM child of the
    // toast host, projecting into the named slot via the slot="description" attr.
    // Title comes via the `title` option (heading prop).
    this.toast.custom(descSpan, {
      title: 'Dosya işleniyor',
      timer: false,
    });
  }

  // ── 12. A11y ─────────────────────────────────────────────────────────────
  showA11ySwipe() {
    this.toast.info('Yatay kaydırarak kapat (swipe-to-dismiss). Eşiğin altında yayaya döner.', { duration: 8_000 });
  }
  showA11yEsc() {
    this.toast.info('Bu tosta tıkla (focus), sonra Esc bas — kapanır.', { duration: 8_000 });
  }
  showA11yF6() {
    this.toast.info('F6 tuşu ile toast bölgesine atla (sayfanın herhangi bir yerinden).', { duration: 8_000 });
  }
  showA11yActionable() {
    this.toast.danger('Oturumunuz sona eriyor.', {
      description: 'Oturumunuzu uzatmak ister misiniz?',
      actions: [{ label: 'Uzat', onClick: () => console.log('[demo] session extended') }],
      timer: false,
    });
  }
  showA11yDark() {
    this.toast.info('Dark mod notu: <body> üzerindeki .dark sınıfı tüm ton yüzeylerini çevirir.', { duration: 6_000 });
  }
  showA11yReducedMotion() {
    this.toast.info('prefers-reduced-motion: Animasyon → statik kenarlık ve ≤100ms opacity geçişi.', { duration: 6_000 });
  }
}
