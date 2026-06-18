import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  signal,
} from '@angular/core';
import { TulparSwitchComponent, TulparButtonComponent } from '@tulpar-ui/angular';
import { LucideAngularModule, Sun, Moon, Wifi, Bell, Shield, Eye } from 'lucide-angular';

// ─── Icon components for [iconOn] / [iconOff] (named-component prop form) ──
@Component({
  selector: 'app-sun-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-angular [img]="iconData" [size]="size()"></lucide-angular>`,
})
class AppSunIcon {
  readonly iconData = Sun;
  size = input(12);
}

@Component({
  selector: 'app-moon-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-angular [img]="iconData" [size]="size()"></lucide-angular>`,
})
class AppMoonIcon {
  readonly iconData = Moon;
  size = input(12);
}

// ─── Code snippets ─────────────────────────────────────────────────────────────

const SIZES_CODE = `<tulpar-switch-ng size="xs" [checked]="true" label="Extra small"></tulpar-switch-ng>
<tulpar-switch-ng size="sm" [checked]="true" label="Small"></tulpar-switch-ng>
<tulpar-switch-ng size="md" [checked]="true" label="Medium (default)"></tulpar-switch-ng>
<tulpar-switch-ng size="lg" [checked]="true" label="Large"></tulpar-switch-ng>
<tulpar-switch-ng size="xl" [checked]="true" label="Extra large"></tulpar-switch-ng>`;

const LABEL_POSITION_CODE = `<!-- label at the end (default) -->
<tulpar-switch-ng [(checked)]="checked" label="Notifications" labelPosition="end"></tulpar-switch-ng>

<!-- label at the start -->
<tulpar-switch-ng [(checked)]="checked" label="Dark mode" labelPosition="start"></tulpar-switch-ng>`;

const PROPS_VS_SLOTS_CODE = `<!-- (a) PROP form — label + description as inputs -->
<tulpar-switch-ng
  [checked]="true"
  label="Two-factor authentication"
  description="Adds an extra layer of security to your account login."
></tulpar-switch-ng>

<!-- (b) SLOT form — rich content via named slots -->
<tulpar-switch-ng [checked]="true">
  <span slot="label">Two-factor authentication</span>
  <span slot="description">
    Adds an extra layer of security to your account login.
  </span>
</tulpar-switch-ng>`;

const STATES_CODE = `<!-- Checked -->
<tulpar-switch-ng [checked]="true" label="Checked"></tulpar-switch-ng>

<!-- Disabled (off) -->
<tulpar-switch-ng [disabled]="true" label="Disabled off"></tulpar-switch-ng>

<!-- Disabled (on) -->
<tulpar-switch-ng [checked]="true" [disabled]="true" label="Disabled on"></tulpar-switch-ng>

<!-- Readonly -->
<tulpar-switch-ng [checked]="true" [readonly]="true" label="Readonly"></tulpar-switch-ng>

<!-- Required + invalid + error text -->
<tulpar-switch-ng
  [required]="true"
  [invalid]="true"
  label="Accept terms"
  errorText="You must accept the terms to continue."
></tulpar-switch-ng>`;

const LOADING_CODE = `// component
readonly checked = signal(false);
readonly loading = signal(false);

onAsyncToggle(e: Event) {
  e.preventDefault(); // revert-then-commit: let the signal drive checked
  if (this.loading()) return;
  this.loading.set(true);
  setTimeout(() => {
    this.checked.update((v) => !v);
    this.loading.set(false);
  }, 1200);
}

<!-- template -->
<tulpar-switch-ng
  [(checked)]="checked"
  [loading]="loading()"
  label="Auto-save drafts"
  (change)="onAsyncToggle($event)"
></tulpar-switch-ng>
<tulpar-button-ng
  size="sm"
  severity="secondary"
  variant="outlined"
  [disabled]="loading()"
  (clicked)="onAsyncToggle($event)"
>Toggle with async</tulpar-button-ng>`;

const SHOW_ICON_CODE = `<!-- Default check / cross indicator inside the track -->
<tulpar-switch-ng [checked]="true" [showIcon]="true" label="Show-icon on"></tulpar-switch-ng>
<tulpar-switch-ng [showIcon]="true" label="Show-icon off"></tulpar-switch-ng>`;

const ICON_PROP_CODE = `<!-- Custom icons via PROP — pass a component class to [iconOn] / [iconOff] -->
@Component({
  selector: 'app-sun-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: \`<lucide-angular [img]="iconData" [size]="size()"></lucide-angular>\`,
})
class AppSunIcon { readonly iconData = Sun; size = input(12); }

<tulpar-switch-ng
  [checked]="true"
  [showIcon]="true"
  size="lg"
  [iconOn]="AppSunIcon"
  [iconOff]="AppMoonIcon"
  label="Day / Night (prop)"
></tulpar-switch-ng>`;

const ICON_SLOT_CODE = `<!-- Custom icons via SLOT — any SVG works -->
<tulpar-switch-ng [checked]="true" [showIcon]="true" size="lg" label="Day / Night (slot)">
  <span slot="icon-on">
    <lucide-angular [img]="Sun" [size]="12"></lucide-angular>
  </span>
  <span slot="icon-off">
    <lucide-angular [img]="Moon" [size]="12"></lucide-angular>
  </span>
</tulpar-switch-ng>`;

const COLOR_CODE = `<!-- Single color override (on-state) — bind it -->
<tulpar-switch-ng [checked]="true" [color]="'ulgen'" label="Ulgen (gold)"></tulpar-switch-ng>
<tulpar-switch-ng [checked]="true" [color]="'otuken'" label="Otuken (forest)"></tulpar-switch-ng>
<tulpar-switch-ng [checked]="true" [color]="'kizagan'" label="Kizagan (danger)"></tulpar-switch-ng>

<!-- Independent on / off track colors — bind both -->
<tulpar-switch-ng
  [checked]="true"
  [onColor]="'otuken'"
  [offColor]="'kizagan'"
  label="On = Otuken / Off = Kizagan"
></tulpar-switch-ng>`;

@Component({
  selector: 'app-switch-demo',
  standalone: true,
  // AppSunIcon / AppMoonIcon are rendered dynamically via NgComponentOutlet
  // inside the switch wrapper ([iconOn] / [iconOff] class-reference bindings),
  // so their selectors never appear in this template.
  imports: [TulparSwitchComponent, TulparButtonComponent, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Core</span>
      <h1 class="page-title">Switch</h1>
      <p class="page-lede">
        An immediate on/off toggle — five sizes, start/end label, label &amp; description in both
        prop and slot form, loading state, default and custom icons (prop + slot), and per-state
        color overrides. Form-associated via the underlying web component.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-switch-ng [(checked)]="heroChecked" size="lg" label="Enable notifications">
        </tulpar-switch-ng>
        <tulpar-switch-ng
          [(checked)]="heroChecked"
          size="lg"
          labelPosition="start"
          label="Dark mode"
        ></tulpar-switch-ng>
      </div>
    </section>

    <!-- ── 1. Sizes ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Sizes</h2>
      <p class="section-desc">
        Five sizes: <code class="inline-code">xs</code>, <code class="inline-code">sm</code>,
        <code class="inline-code">md</code> (default), <code class="inline-code">lg</code>,
        <code class="inline-code">xl</code>. All checked.
      </p>
      <div class="preview preview--col">
        <tulpar-switch-ng [checked]="true" size="xs" label="Extra small"></tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" size="sm" label="Small"></tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" size="md" label="Medium (default)"></tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" size="lg" label="Large"></tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" size="xl" label="Extra large"></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 2. Label position ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Label position</h2>
      <p class="section-desc">
        <code class="inline-code">labelPosition="end"</code> (default) or
        <code class="inline-code">labelPosition="start"</code>.
      </p>
      <div class="preview preview--col">
        <tulpar-switch-ng [checked]="true" label="Notifications" labelPosition="end">
        </tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" label="Dark mode" labelPosition="start">
        </tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ labelPositionCode }}</code></pre>
    </section>

    <!-- ── 3. Props vs slots — label & description ──────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Props vs slots — label &amp; description</h2>
      <p class="section-desc">
        Every content capability works in BOTH forms. Use the
        <code class="inline-code">label</code> / <code class="inline-code">description</code> inputs
        for plain text, or the <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code> slots for rich content. Both render
        identically.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <tulpar-switch-ng
            [checked]="true"
            label="Two-factor authentication"
            description="Adds an extra layer of security to your account login."
          ></tulpar-switch-ng>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <tulpar-switch-ng [checked]="true">
            <span slot="label">Two-factor authentication</span>
            <span slot="description"> Adds an extra layer of security to your account login. </span>
          </tulpar-switch-ng>
        </div>
      </div>
      <pre class="code"><code>{{ propsVsSlotsCode }}</code></pre>
    </section>

    <!-- ── 4. States ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. States</h2>
      <p class="section-desc">
        Checked, disabled (on/off), readonly, required + invalid with
        <code class="inline-code">errorText</code>.
      </p>
      <div class="preview preview--col">
        <tulpar-switch-ng [checked]="true" label="Checked"></tulpar-switch-ng>
        <tulpar-switch-ng [disabled]="true" label="Disabled off"></tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" [disabled]="true" label="Disabled on"></tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" [readonly]="true" label="Readonly"></tulpar-switch-ng>
        <tulpar-switch-ng
          [required]="true"
          [invalid]="true"
          label="Accept terms"
          errorText="You must accept the terms to continue."
        ></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 5. Loading — async demo ──────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Loading — async (revert-then-commit)</h2>
      <p class="section-desc">
        The <code class="inline-code">loading</code> input shows a spinner inside the thumb and
        prevents interaction. Click the button to simulate a 1.2 s async preference save — the
        switch commits its new value only after the work resolves.
      </p>
      <div class="preview preview--col">
        <tulpar-switch-ng
          [(checked)]="loadingChecked"
          [loading]="isLoading()"
          label="Auto-save drafts"
          [helperText]="
            isLoading()
              ? 'Saving preference…'
              : loadingChecked()
                ? 'Auto-save is on'
                : 'Auto-save is off'
          "
          (change)="triggerAsyncToggle($event)"
        ></tulpar-switch-ng>
        <tulpar-button-ng
          size="sm"
          severity="secondary"
          variant="outlined"
          [disabled]="isLoading()"
          (clicked)="triggerAsyncToggle($event)"
        >
          {{ isLoading() ? 'Saving…' : 'Toggle with async' }}
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ loadingCode }}</code></pre>
    </section>

    <!-- ── 6. show-icon — default check / cross ─────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. show-icon — check / cross indicator</h2>
      <p class="section-desc">
        <code class="inline-code">showIcon</code> renders a check mark when on and a cross when off
        inside the track. The icon color follows the track color.
      </p>
      <div class="preview">
        <tulpar-switch-ng [checked]="true" [showIcon]="true" label="Show-icon on">
        </tulpar-switch-ng>
        <tulpar-switch-ng [showIcon]="true" label="Show-icon off"></tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" size="lg" [showIcon]="true" label="Large with icon">
        </tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ showIconCode }}</code></pre>
    </section>

    <!-- ── 7. Custom icons — prop form ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Custom icons — prop form</h2>
      <p class="section-desc">
        Pass a component class to <code class="inline-code">[iconOn]</code> /
        <code class="inline-code">[iconOff]</code> — the wrapper renders it into the right slot via
        <code class="inline-code">NgComponentOutlet</code>. Classic example: sun for day, moon for
        night.
      </p>
      <div class="preview">
        <tulpar-switch-ng
          [checked]="true"
          [showIcon]="true"
          size="lg"
          [iconOn]="AppSunIcon"
          [iconOff]="AppMoonIcon"
          label="Day / Night (prop, on)"
        ></tulpar-switch-ng>
        <tulpar-switch-ng
          [showIcon]="true"
          size="lg"
          [iconOn]="AppSunIcon"
          [iconOff]="AppMoonIcon"
          label="Day / Night (prop, off)"
        ></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ iconPropCode }}</code></pre>
    </section>

    <!-- ── 8. Custom icons — slot form ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Custom icons — slot form</h2>
      <p class="section-desc">
        The same custom icons via <code class="inline-code">slot="icon-on"</code> /
        <code class="inline-code">slot="icon-off"</code> — the escape hatch for any SVG or
        non-Lucide icon library.
      </p>
      <div class="preview">
        <tulpar-switch-ng
          [checked]="true"
          [showIcon]="true"
          size="lg"
          label="Day / Night (slot, on)"
        >
          <span slot="icon-on"><lucide-angular [img]="Sun" [size]="12"></lucide-angular></span>
          <span slot="icon-off"><lucide-angular [img]="Moon" [size]="12"></lucide-angular></span>
        </tulpar-switch-ng>
        <tulpar-switch-ng [showIcon]="true" size="lg" label="Day / Night (slot, off)">
          <span slot="icon-on"><lucide-angular [img]="Sun" [size]="12"></lucide-angular></span>
          <span slot="icon-off"><lucide-angular [img]="Moon" [size]="12"></lucide-angular></span>
        </tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ iconSlotCode }}</code></pre>
    </section>

    <!-- ── 9. Color — on-color / off-color (bound) ──────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Color — on-color / off-color</h2>
      <p class="section-desc">
        Override the on-state color with <code class="inline-code">[color]</code>, or independently
        control the on/off track colors with <code class="inline-code">[onColor]</code> /
        <code class="inline-code">[offColor]</code>. The core resolves design-system color names
        (<code class="inline-code">ulgen</code>, <code class="inline-code">otuken</code>, …).
      </p>
      <div class="preview preview--col">
        <tulpar-switch-ng [checked]="true" [color]="'ulgen'" label="Ulgen (antique gold)">
        </tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" [color]="'otuken'" label="Otuken (forest green)">
        </tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" [color]="'kizagan'" label="Kizagan (danger red)">
        </tulpar-switch-ng>
        <tulpar-switch-ng [checked]="true" [color]="'kam'" label="Kam (indigo)"></tulpar-switch-ng>
        <tulpar-switch-ng
          [checked]="true"
          [onColor]="'otuken'"
          [offColor]="'kizagan'"
          label="On = Otuken / Off = Kizagan"
        ></tulpar-switch-ng>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 10. In context — Settings card ───────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — Settings card</h2>
      <p class="section-desc">
        Switches grouped in a settings card. Each row has a label + description and an independent
        boolean state.
      </p>
      <div class="composition">
        <div class="settings-card">
          <h3 class="settings-card-title">Device settings</h3>
          <div class="settings-list">
            <div class="settings-row">
              <lucide-angular class="settings-icon" [img]="Wifi" [size]="18"></lucide-angular>
              <tulpar-switch-ng [(checked)]="wifiEnabled" [noMessageSpace]="true">
                <span slot="label">Wi-Fi</span>
                <span slot="description">Connect to wireless networks automatically.</span>
              </tulpar-switch-ng>
            </div>
            <div class="settings-row">
              <lucide-angular class="settings-icon" [img]="Bell" [size]="18"></lucide-angular>
              <tulpar-switch-ng [(checked)]="notificationsEnabled" [noMessageSpace]="true">
                <span slot="label">Push notifications</span>
                <span slot="description">Receive alerts for activity and updates.</span>
              </tulpar-switch-ng>
            </div>
            <div class="settings-row">
              <lucide-angular class="settings-icon" [img]="Shield" [size]="18"></lucide-angular>
              <tulpar-switch-ng [(checked)]="privacyEnabled" [noMessageSpace]="true">
                <span slot="label">Privacy mode</span>
                <span slot="description">Hide your online status from other users.</span>
              </tulpar-switch-ng>
            </div>
            <div class="settings-row">
              <lucide-angular class="settings-icon" [img]="Eye" [size]="18"></lucide-angular>
              <tulpar-switch-ng [(checked)]="visibilityEnabled" [noMessageSpace]="true">
                <span slot="label">Profile visibility</span>
                <span slot="description">Allow others to find you by name or email.</span>
              </tulpar-switch-ng>
            </div>
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
        gap: 24px;
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

      .preview--col {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }

      .preview--cols {
        align-items: flex-start;
        gap: 40px;
      }

      .preview-col {
        flex: 1;
        min-width: 240px;
      }

      .preview-label {
        margin: 0 0 12px;
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

      .composition {
        display: flex;
      }

      .settings-card {
        flex: 1;
        max-width: 520px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
        overflow: hidden;
      }

      .settings-card-title {
        margin: 0;
        padding: 16px 20px;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 16px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .settings-list {
        display: flex;
        flex-direction: column;
      }

      .settings-row {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .settings-row:last-child {
        border-bottom: none;
      }

      .settings-icon {
        margin-top: 2px;
        flex-shrink: 0;
        color: var(--tulpar-color-text-muted, #74777a);
      }
    `,
  ],
})
export class SwitchDemoComponent {
  // ── State ──────────────────────────────────────────────────────────────────
  readonly heroChecked = signal(true);

  readonly loadingChecked = signal(false);
  readonly isLoading = signal(false);

  readonly notificationsEnabled = signal(true);
  readonly wifiEnabled = signal(true);
  readonly privacyEnabled = signal(false);
  readonly visibilityEnabled = signal(true);

  triggerAsyncToggle(e: Event): void {
    e.preventDefault(); // revert-then-commit: let the signal drive checked
    if (this.isLoading()) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.loadingChecked.update((v) => !v);
      this.isLoading.set(false);
    }, 1200);
  }

  // ── Lucide icon references ──────────────────────────────────────────────────
  protected readonly Sun = Sun;
  protected readonly Moon = Moon;
  protected readonly Wifi = Wifi;
  protected readonly Bell = Bell;
  protected readonly Shield = Shield;
  protected readonly Eye = Eye;

  // ── Named icon components for [iconOn] / [iconOff] ──────────────────────────
  protected readonly AppSunIcon = AppSunIcon;
  protected readonly AppMoonIcon = AppMoonIcon;

  // ── Code snippets ───────────────────────────────────────────────────────────
  readonly sizesCode = SIZES_CODE;
  readonly labelPositionCode = LABEL_POSITION_CODE;
  readonly propsVsSlotsCode = PROPS_VS_SLOTS_CODE;
  readonly statesCode = STATES_CODE;
  readonly loadingCode = LOADING_CODE;
  readonly showIconCode = SHOW_ICON_CODE;
  readonly iconPropCode = ICON_PROP_CODE;
  readonly iconSlotCode = ICON_SLOT_CODE;
  readonly colorCode = COLOR_CODE;
}
