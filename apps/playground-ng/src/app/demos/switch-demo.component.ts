import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TulparSwitchComponent } from '@tulpar-ui/angular';

// ─── Code snippets ─────────────────────────────────────────────────────────────

const SIZES_CODE = `<tulpar-switch-ng size="xs" label="Extra Small"></tulpar-switch-ng>
<tulpar-switch-ng size="sm" label="Small"></tulpar-switch-ng>
<tulpar-switch-ng size="md" label="Medium (default)"></tulpar-switch-ng>
<tulpar-switch-ng size="lg" label="Large"></tulpar-switch-ng>
<tulpar-switch-ng size="xl" label="Extra Large"></tulpar-switch-ng>`;

const LABEL_POSITION_CODE = `<!-- end (default) — label after the track -->
<tulpar-switch-ng label="Notifications" labelPosition="end"></tulpar-switch-ng>

<!-- start — label before the track -->
<tulpar-switch-ng label="Notifications" labelPosition="start"></tulpar-switch-ng>`;

const SLOTS_CODE = `<!-- Label + description via named slots -->
<tulpar-switch-ng>
  <span slot="label">Marketing emails</span>
  <span slot="description">Receive product updates and promotions</span>
</tulpar-switch-ng>`;

const STATES_CODE = `<!-- Checked -->
<tulpar-switch-ng label="Checked" [checked]="true"></tulpar-switch-ng>

<!-- Disabled -->
<tulpar-switch-ng label="Disabled off" [disabled]="true"></tulpar-switch-ng>
<tulpar-switch-ng label="Disabled on" [checked]="true" [disabled]="true"></tulpar-switch-ng>

<!-- Readonly -->
<tulpar-switch-ng label="Readonly" [checked]="true" [readonly]="true"></tulpar-switch-ng>

<!-- Invalid + required + error-text -->
<tulpar-switch-ng
  label="Accept terms"
  [required]="true"
  [invalid]="true"
  errorText="You must accept the terms"
></tulpar-switch-ng>`;

const LOADING_CODE = `loading = signal(false);
checked = signal(false);

onAsyncToggle() {
  if (this.loading()) return;
  this.loading.set(true);
  setTimeout(() => {
    this.checked.update(v => !v);
    this.loading.set(false);
  }, 1200);
}

<!-- Template -->
<tulpar-switch-ng
  label="Saving preference…"
  [(checked)]="checked"
  [loading]="loading()"
  (change)="onAsyncToggle()"
></tulpar-switch-ng>`;

const SHOW_ICON_CODE = `<!-- Built-in check / x icons -->
<tulpar-switch-ng label="With icons" [showIcon]="true" [checked]="true"></tulpar-switch-ng>`;

const CUSTOM_ICON_CODE = `<!-- Sun = on, Moon = off via named slots -->
<tulpar-switch-ng [checked]="true">
  <span slot="icon-on">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="6"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="7.05" y2="7.05"/>
      <line x1="16.95" y1="16.95" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="6" y2="12"/>
      <line x1="18" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="7.05" y2="16.95"/>
      <line x1="16.95" y1="7.05" x2="19.78" y2="4.22"/>
    </svg>
  </span>
  <span slot="icon-off">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2.5"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  </span>
</tulpar-switch-ng>`;

const COLORS_CODE = `<!-- on-color / off-color forwarded from wrapper -->
<tulpar-switch-ng label="Custom green" [checked]="true" onColor="#16a34a"></tulpar-switch-ng>
<tulpar-switch-ng label="Custom amber off" offColor="#f59e0b"></tulpar-switch-ng>
<tulpar-switch-ng label="Danger" [checked]="true" onColor="#dc2626"></tulpar-switch-ng>`;

const SETTINGS_CODE = `<div class="settings-card">
  <tulpar-switch-ng [(checked)]="notifEmail">
    <span slot="label">Email notifications</span>
    <span slot="description">Daily digest of activity</span>
  </tulpar-switch-ng>
  <tulpar-switch-ng [(checked)]="notifPush">
    <span slot="label">Push notifications</span>
    <span slot="description">Instant alerts on your device</span>
  </tulpar-switch-ng>
  <tulpar-switch-ng [(checked)]="notifSms" [disabled]="true">
    <span slot="label">SMS notifications</span>
    <span slot="description">Requires phone number verification</span>
  </tulpar-switch-ng>
</div>`;

@Component({
  selector: 'app-switch-demo',
  standalone: true,
  imports: [TulparSwitchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Selection</span>
      <h1 class="page-title">Switch</h1>
      <p class="page-lede">
        A binary toggle control — semantically a checkbox, visually a sliding track. Five sizes,
        label positions, loading state, custom colors, and icon slots.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-switch-ng label="Wi-Fi" [checked]="true" size="lg"></tulpar-switch-ng>
        <tulpar-switch-ng label="Bluetooth" size="lg"></tulpar-switch-ng>
        <tulpar-switch-ng
          label="Airplane mode"
          [checked]="true"
          size="lg"
          onColor="#dc2626"
        ></tulpar-switch-ng>
      </div>
    </section>

    <!-- ── 1. Sizes ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Sizes</h2>
      <p class="section-desc">
        Five sizes from <code class="inline-code">xs</code> to <code class="inline-code">xl</code>.
        Default is <code class="inline-code">md</code>.
      </p>
      <div class="preview preview--baseline">
        <tulpar-switch-ng size="xs" label="Extra Small"></tulpar-switch-ng>
        <tulpar-switch-ng size="sm" label="Small"></tulpar-switch-ng>
        <tulpar-switch-ng size="md" label="Medium"></tulpar-switch-ng>
        <tulpar-switch-ng size="lg" label="Large"></tulpar-switch-ng>
        <tulpar-switch-ng size="xl" label="Extra Large"></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 2. Label position ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Label position</h2>
      <p class="section-desc">
        <code class="inline-code">end</code> (default) places the label after the track;
        <code class="inline-code">start</code> places it before.
      </p>
      <div class="preview">
        <tulpar-switch-ng label="Label end (default)" labelPosition="end"></tulpar-switch-ng>
        <tulpar-switch-ng label="Label start" labelPosition="start"></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ labelPositionCode }}</code></pre>
    </section>

    <!-- ── 3. Label + description slots ───────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Label + description slots</h2>
      <p class="section-desc">
        Project rich content into <code class="inline-code">slot="label"</code> and
        <code class="inline-code">slot="description"</code> for multi-line settings rows.
      </p>
      <div class="preview">
        <tulpar-switch-ng>
          <span slot="label">Marketing emails</span>
          <span slot="description">Receive product updates and promotions</span>
        </tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true">
          <span slot="label">Security alerts</span>
          <span slot="description">Notify me of suspicious login attempts</span>
        </tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ slotsCode }}</code></pre>
    </section>

    <!-- ── 4. States ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. States</h2>
      <p class="section-desc">
        Checked, disabled (on/off), readonly, and invalid with required error-text.
      </p>
      <div class="preview preview--col">
        <div class="preview-row">
          <tulpar-switch-ng label="Checked" [checked]="true"></tulpar-switch-ng>
          <tulpar-switch-ng label="Disabled off" [disabled]="true"></tulpar-switch-ng>
          <tulpar-switch-ng
            label="Disabled on"
            [checked]="true"
            [disabled]="true"
          ></tulpar-switch-ng>
          <tulpar-switch-ng
            label="Readonly on"
            [checked]="true"
            [readonly]="true"
          ></tulpar-switch-ng>
        </div>
        <tulpar-switch-ng
          label="Accept terms"
          [required]="true"
          [invalid]="true"
          errorText="You must accept the terms to continue"
        ></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 5. Loading (async toggle) ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Loading — async toggle</h2>
      <p class="section-desc">
        The <code class="inline-code">loading</code> input disables interaction and shows a spinner
        inside the track. Click the switch below to see the ~1.2 s async simulation.
      </p>
      <div class="preview">
        <tulpar-switch-ng
          label="Dark mode"
          [(checked)]="asyncChecked"
          [loading]="asyncLoading()"
          (change)="onAsyncToggle($event)"
        ></tulpar-switch-ng>
        @if (asyncLoading()) {
          <span class="status-feedback">Saving preference…</span>
        } @else {
          <span class="status-feedback">Value: {{ asyncChecked() }}</span>
        }
      </div>
      <pre class="code"><code>{{ loadingCode }}</code></pre>
    </section>

    <!-- ── 6. Show icon ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Show icon</h2>
      <p class="section-desc">
        The <code class="inline-code">showIcon</code> input renders built-in check / ✕ icons inside
        the thumb.
      </p>
      <div class="preview preview--baseline">
        <tulpar-switch-ng size="sm" [showIcon]="true" label="Off with icon"></tulpar-switch-ng>
        <tulpar-switch-ng
          size="sm"
          [showIcon]="true"
          [checked]="true"
          label="On with icon"
        ></tulpar-switch-ng>
        <tulpar-switch-ng size="md" [showIcon]="true" label="MD off"></tulpar-switch-ng>
        <tulpar-switch-ng
          size="md"
          [showIcon]="true"
          [checked]="true"
          label="MD on"
        ></tulpar-switch-ng>
        <tulpar-switch-ng size="lg" [showIcon]="true" label="LG off"></tulpar-switch-ng>
        <tulpar-switch-ng
          size="lg"
          [showIcon]="true"
          [checked]="true"
          label="LG on"
        ></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ showIconCode }}</code></pre>
    </section>

    <!-- ── 7. Custom icon slots ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Custom icon slots — sun / moon</h2>
      <p class="section-desc">
        Project any SVG or icon component into
        <code class="inline-code">slot="icon-on"</code> and
        <code class="inline-code">slot="icon-off"</code> to replace the built-in check/✕ with custom
        graphics.
      </p>
      <div class="preview preview--baseline">
        <!-- Sun on, Moon off — interactive -->
        <tulpar-switch-ng size="lg" [(checked)]="themeChecked" label="Theme">
          <!-- Sun icon — on state -->
          <span slot="icon-on">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.22" y1="4.22" x2="7.05" y2="7.05" />
              <line x1="16.95" y1="16.95" x2="19.78" y2="19.78" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.22" y1="19.78" x2="7.05" y2="16.95" />
              <line x1="16.95" y1="7.05" x2="19.78" y2="4.22" />
            </svg>
          </span>
          <!-- Moon icon — off state -->
          <span slot="icon-off">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </span>
        </tulpar-switch-ng>
        <span class="status-feedback">{{ themeChecked() ? 'Light' : 'Dark' }}</span>
      </div>
      <pre class="code"><code>{{ customIconCode }}</code></pre>
    </section>

    <!-- ── 8. on-color / off-color ────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. on-color / off-color</h2>
      <p class="section-desc">
        Override the track color per-state with any CSS color value. Useful for semantic intent
        beyond the design system's default brand green.
      </p>
      <div class="preview preview--baseline">
        <tulpar-switch-ng
          label="Custom green"
          [checked]="true"
          onColor="#16a34a"
        ></tulpar-switch-ng>
        <tulpar-switch-ng label="Custom amber off" offColor="#f59e0b"></tulpar-switch-ng>
        <tulpar-switch-ng label="Danger on" [checked]="true" onColor="#dc2626"></tulpar-switch-ng>
        <tulpar-switch-ng label="Purple on" [checked]="true" onColor="#7c3aed"></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ colorsCode }}</code></pre>
    </section>

    <!-- ── 9. In context — settings card ──────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — notification settings card</h2>
      <p class="section-desc">
        Switches rarely live alone. Here they compose into a settings list with grouped on/off
        toggles for notification preferences.
      </p>
      <div class="composition">
        <div class="settings-card">
          <p class="settings-card-title">Notifications</p>
          <div class="settings-row">
            <tulpar-switch-ng [(checked)]="notifEmail">
              <span slot="label">Email notifications</span>
              <span slot="description">Daily digest of activity in your workspace</span>
            </tulpar-switch-ng>
          </div>
          <div class="settings-row">
            <tulpar-switch-ng [(checked)]="notifPush">
              <span slot="label">Push notifications</span>
              <span slot="description">Instant alerts on your connected devices</span>
            </tulpar-switch-ng>
          </div>
          <div class="settings-row">
            <tulpar-switch-ng [(checked)]="notifSms" [disabled]="true">
              <span slot="label">SMS notifications</span>
              <span slot="description">Requires phone number verification first</span>
            </tulpar-switch-ng>
          </div>
          <div class="settings-row">
            <tulpar-switch-ng [(checked)]="notifMarketing">
              <span slot="label">Marketing updates</span>
              <span slot="description">Product news, feature releases and tips</span>
            </tulpar-switch-ng>
          </div>
          <p class="settings-summary">Active: {{ activeNotifCount() }} / 4</p>
        </div>
      </div>
      <pre class="code"><code>{{ settingsCode }}</code></pre>
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

      .hero {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: center;
        padding: 32px 28px;
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
        gap: 16px;
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
        gap: 16px;
        align-items: center;
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

      .status-feedback {
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      /* ── Real-world composition ─────────────────────────────────────── */
      .composition {
        display: flex;
      }

      .settings-card {
        flex: 1;
        max-width: 480px;
        padding: 20px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
      }

      .settings-card-title {
        margin: 0 0 16px;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 16px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .settings-row {
        padding: 12px 0;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .settings-row:last-of-type {
        border-bottom: none;
      }

      .settings-summary {
        margin: 12px 0 0;
        font-size: 12px;
        color: var(--tulpar-color-text-muted, #74777a);
      }
    `,
  ],
})
export class SwitchDemoComponent {
  // ── Async loading demo ──────────────────────────────────────────────────────
  readonly asyncChecked = signal(false);
  readonly asyncLoading = signal(false);

  onAsyncToggle(e: Event): void {
    e.preventDefault(); // let the signal drive the checked state
    if (this.asyncLoading()) return;
    this.asyncLoading.set(true);
    setTimeout(() => {
      this.asyncChecked.update((v) => !v);
      this.asyncLoading.set(false);
    }, 1200);
  }

  // ── Theme demo ──────────────────────────────────────────────────────────────
  readonly themeChecked = signal(false);

  // ── Settings card demo ──────────────────────────────────────────────────────
  readonly notifEmail = signal(true);
  readonly notifPush = signal(false);
  readonly notifSms = signal(false);
  readonly notifMarketing = signal(true);

  readonly activeNotifCount = () =>
    [this.notifEmail(), this.notifPush(), this.notifSms(), this.notifMarketing()].filter(Boolean)
      .length;

  // ── Code snippets ───────────────────────────────────────────────────────────
  readonly sizesCode = SIZES_CODE;
  readonly labelPositionCode = LABEL_POSITION_CODE;
  readonly slotsCode = SLOTS_CODE;
  readonly statesCode = STATES_CODE;
  readonly loadingCode = LOADING_CODE;
  readonly showIconCode = SHOW_ICON_CODE;
  readonly customIconCode = CUSTOM_ICON_CODE;
  readonly colorsCode = COLORS_CODE;
  readonly settingsCode = SETTINGS_CODE;
}
