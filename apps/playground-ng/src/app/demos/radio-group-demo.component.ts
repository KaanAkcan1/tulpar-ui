import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TulparRadioGroupComponent, TulparRadioComponent } from '@tulpar-ui/angular';

// ─── Code snippets ─────────────────────────────────────────────────────────────

const BASIC_CODE = `selected = signal<string | null>('weekly');

<tulpar-radio-group-ng
  label="Billing frequency"
  name="billing"
  [(value)]="selected"
>
  <tulpar-radio-ng value="monthly" label="Monthly"></tulpar-radio-ng>
  <tulpar-radio-ng value="weekly"  label="Weekly"></tulpar-radio-ng>
  <tulpar-radio-ng value="annual"  label="Annual">
    <span slot="description">Save 20% vs monthly</span>
  </tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const SIZES_CODE = `<!-- xs through xl — applies to all radios in the group -->
<tulpar-radio-group-ng size="xs" label="Extra Small">
  <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
  <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<tulpar-radio-group-ng size="md" label="Medium (default)">
  <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
  <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<tulpar-radio-group-ng size="xl" label="Extra Large">
  <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
  <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const ORIENTATION_CODE = `<!-- Vertical (default) -->
<tulpar-radio-group-ng orientation="vertical" label="Vertical">
  <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
  <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
  <tulpar-radio-ng value="c" label="Option C"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<!-- Horizontal -->
<tulpar-radio-group-ng orientation="horizontal" label="Horizontal">
  <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
  <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
  <tulpar-radio-ng value="c" label="Option C"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const LEGEND_SLOT_CODE = `<!-- Group legend + description via named slots -->
<tulpar-radio-group-ng name="theme">
  <span slot="label">Theme preference</span>
  <span slot="description">Controls the visual appearance of the interface</span>
  <tulpar-radio-ng value="light" label="Light"></tulpar-radio-ng>
  <tulpar-radio-ng value="dark"  label="Dark"></tulpar-radio-ng>
  <tulpar-radio-ng value="system" label="System default"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const STATES_CODE = `<!-- Group-level disabled — all children disabled -->
<tulpar-radio-group-ng label="Disabled group" [disabled]="true" value="a">
  <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
  <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<!-- Group invalid + required + error-text -->
<tulpar-radio-group-ng
  label="Shipping method"
  [required]="true"
  [invalid]="true"
  errorText="Please select a shipping method"
>
  <tulpar-radio-ng value="standard" label="Standard"></tulpar-radio-ng>
  <tulpar-radio-ng value="express"  label="Express"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const CARD_VARIANT_CODE = `<!-- Card-variant radios compose naturally into plan-picker grids -->
<tulpar-radio-group-ng name="plan" [(value)]="selectedPlan">
  <tulpar-radio-ng value="free" variant="card" label="Free">
    <span slot="description">Up to 3 projects</span>
  </tulpar-radio-ng>
  <tulpar-radio-ng value="pro" variant="card" label="Pro">
    <span slot="description">Unlimited projects + priority support</span>
  </tulpar-radio-ng>
  <tulpar-radio-ng value="enterprise" variant="card" label="Enterprise">
    <span slot="description">SSO, audit logs, SLA</span>
  </tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const COLORS_CODE = `<tulpar-radio-group-ng name="colors" label="Color" [(value)]="colorSelected">
  <tulpar-radio-ng value="default" label="Default brand"></tulpar-radio-ng>
  <tulpar-radio-ng value="otuken"  label="Otuken"  color="otuken"></tulpar-radio-ng>
  <tulpar-radio-ng value="kizagan" label="Kizagan" color="kizagan"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const COMPOSITION_CODE = `<!-- Notification frequency — real-world settings row -->
selected = signal<string | null>('instant');

<tulpar-radio-group-ng
  name="notif-freq"
  label="Notification frequency"
  orientation="vertical"
  [(value)]="selected"
>
  <tulpar-radio-ng value="instant">
    <span slot="label">Instant</span>
    <span slot="description">Notified immediately when activity occurs</span>
  </tulpar-radio-ng>
  <tulpar-radio-ng value="daily">
    <span slot="label">Daily digest</span>
    <span slot="description">One summary email each morning at 8 AM</span>
  </tulpar-radio-ng>
  <tulpar-radio-ng value="weekly">
    <span slot="label">Weekly summary</span>
    <span slot="description">One email every Monday with weekly highlights</span>
  </tulpar-radio-ng>
  <tulpar-radio-ng value="never">
    <span slot="label">Never</span>
    <span slot="description">No email notifications — check the app manually</span>
  </tulpar-radio-ng>
</tulpar-radio-group-ng>`;

@Component({
  selector: 'app-radio-group-demo',
  standalone: true,
  imports: [TulparRadioGroupComponent, TulparRadioComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Selection</span>
      <h1 class="page-title">Radio Group</h1>
      <p class="page-lede">
        A managed group of mutually exclusive radio buttons — vertical/horizontal layout, card
        variant for plan pickers, group-level states, and signal two-way binding.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-radio-group-ng
          label="Preferred contact"
          name="hero-contact"
          [(value)]="heroSelected"
          size="lg"
        >
          <tulpar-radio-ng value="email" label="Email"></tulpar-radio-ng>
          <tulpar-radio-ng value="phone" label="Phone"></tulpar-radio-ng>
          <tulpar-radio-ng value="slack" label="Slack"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <p class="hero-value">
          Selected: <strong>{{ heroSelected() ?? '(none)' }}</strong>
        </p>
      </div>
    </section>

    <!-- ── 1. Basic binding ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Basic two-way binding</h2>
      <p class="section-desc">
        Use <code class="inline-code">[(value)]</code> for signal-driven two-way binding. The
        group's <code class="inline-code">name</code> is shared automatically by the group to all
        member radios. Children are slotted directly inside the group wrapper.
      </p>
      <div class="preview preview--col">
        <tulpar-radio-group-ng label="Billing frequency" name="billing" [(value)]="billingSelected">
          <tulpar-radio-ng value="monthly" label="Monthly"></tulpar-radio-ng>
          <tulpar-radio-ng value="weekly" label="Weekly"></tulpar-radio-ng>
          <tulpar-radio-ng value="annual" label="Annual">
            <span slot="description">Save 20% vs monthly</span>
          </tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <p class="status-feedback">Value: {{ billingSelected() ?? '(none)' }}</p>
      </div>
      <pre class="code"><code>{{ basicCode }}</code></pre>
    </section>

    <!-- ── 2. Sizes ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Sizes</h2>
      <p class="section-desc">
        The <code class="inline-code">size</code> prop applies to the whole group.
      </p>
      <div class="preview preview--row">
        <tulpar-radio-group-ng size="xs" label="XS" name="sz-xs" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng size="sm" label="SM" name="sz-sm" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng size="md" label="MD (default)" name="sz-md" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng size="lg" label="LG" name="sz-lg" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng size="xl" label="XL" name="sz-xl" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 3. Orientation ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Orientation — vertical / horizontal</h2>
      <p class="section-desc">
        <code class="inline-code">vertical</code> (default) stacks radios top-to-bottom.
        <code class="inline-code">horizontal</code> lays them out in a row.
      </p>
      <div class="preview preview--row">
        <tulpar-radio-group-ng orientation="vertical" label="Vertical" name="or-vert" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
          <tulpar-radio-ng value="c" label="Option C"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng
          orientation="horizontal"
          label="Horizontal"
          name="or-horiz"
          value="a"
        >
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
          <tulpar-radio-ng value="c" label="Option C"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ orientationCode }}</code></pre>
    </section>

    <!-- ── 4. Legend + description slots ──────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Legend + description slots</h2>
      <p class="section-desc">
        Project rich content into <code class="inline-code">slot="label"</code> and
        <code class="inline-code">slot="description"</code> on the group element.
      </p>
      <div class="preview">
        <tulpar-radio-group-ng name="theme-legend" [(value)]="themeSelected">
          <span slot="label">Theme preference</span>
          <span slot="description">Controls the visual appearance of the interface</span>
          <tulpar-radio-ng value="light" label="Light"></tulpar-radio-ng>
          <tulpar-radio-ng value="dark" label="Dark"></tulpar-radio-ng>
          <tulpar-radio-ng value="system" label="System default"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <p class="status-feedback">Value: {{ themeSelected() ?? '(none)' }}</p>
      </div>
      <pre class="code"><code>{{ legendSlotCode }}</code></pre>
    </section>

    <!-- ── 5. Group states ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Group states — disabled, required, invalid</h2>
      <p class="section-desc">
        State flags on the group propagate to all member radios.
        <code class="inline-code">invalid</code> + <code class="inline-code">errorText</code>
        shows the group-level error message.
      </p>
      <div class="preview preview--row">
        <tulpar-radio-group-ng label="Disabled group" name="st-dis" [disabled]="true" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng
          label="Shipping method"
          name="st-inv"
          [required]="true"
          [invalid]="true"
          errorText="Please select a shipping method"
        >
          <tulpar-radio-ng value="standard" label="Standard"></tulpar-radio-ng>
          <tulpar-radio-ng value="express" label="Express"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng label="Readonly" name="st-ro" [readonly]="true" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 6. Card variant — plan picker ──────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Card variant — plan picker</h2>
      <p class="section-desc">
        Individual <code class="inline-code">tulpar-radio-ng</code> items accept
        <code class="inline-code">variant="card"</code> for a bordered card surface — ideal for plan
        pickers and option selections.
      </p>
      <div class="preview preview--col">
        <tulpar-radio-group-ng name="plan-picker" [(value)]="planSelected" orientation="horizontal">
          <tulpar-radio-ng value="free" variant="card" label="Free">
            <span slot="description">Up to 3 projects — always free</span>
          </tulpar-radio-ng>
          <tulpar-radio-ng value="pro" variant="card" label="Pro">
            <span slot="description">Unlimited projects + priority support</span>
          </tulpar-radio-ng>
          <tulpar-radio-ng value="enterprise" variant="card" label="Enterprise">
            <span slot="description">SSO, audit logs, dedicated SLA</span>
          </tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <p class="status-feedback">
          Plan: <strong>{{ planSelected() ?? '(none)' }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ cardVariantCode }}</code></pre>
    </section>

    <!-- ── 7. Color ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Color</h2>
      <p class="section-desc">Override the radio accent at the group level or per-item.</p>
      <div class="preview preview--row">
        <tulpar-radio-group-ng name="col-grp" label="Group color (otuken)" color="otuken" value="a">
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng name="col-item" label="Per-item colors" value="a">
          <tulpar-radio-ng value="a" label="Kizagan" color="kizagan"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Kam" color="kam"></tulpar-radio-ng>
          <tulpar-radio-ng value="c" label="Yersu" color="yersu"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ colorsCode }}</code></pre>
    </section>

    <!-- ── 8. Keyboard hint ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Keyboard navigation</h2>
      <p class="section-desc">
        Radio groups implement the ARIA radio group pattern with roving tabindex.
        <kbd>ArrowDown</kbd> / <kbd>ArrowRight</kbd> advance; <kbd>ArrowUp</kbd> /
        <kbd>ArrowLeft</kbd> go back; <kbd>Home</kbd> / <kbd>End</kbd> jump to first/last.
      </p>
      <div class="preview">
        <tulpar-radio-group-ng
          name="kbd-demo"
          label="Press Tab to focus, then use Arrow keys"
          [(value)]="kbdSelected"
        >
          <tulpar-radio-ng value="alpha" label="Alpha"></tulpar-radio-ng>
          <tulpar-radio-ng value="beta" label="Beta"></tulpar-radio-ng>
          <tulpar-radio-ng value="gamma" label="Gamma"></tulpar-radio-ng>
          <tulpar-radio-ng value="delta" label="Delta"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <p class="status-feedback">Active: {{ kbdSelected() ?? '(none)' }}</p>
      </div>
    </section>

    <!-- ── 9. In context — notification frequency ─────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — notification frequency settings</h2>
      <p class="section-desc">
        A complete settings panel where the radio group owns a realistic single-choice preference
        with rich descriptions per option.
      </p>
      <div class="composition">
        <div class="notif-card">
          <p class="notif-card-title">Email notifications</p>
          <tulpar-radio-group-ng
            name="notif-freq"
            label="Notification frequency"
            orientation="vertical"
            [(value)]="notifFreqSelected"
          >
            <tulpar-radio-ng value="instant">
              <span slot="label">Instant</span>
              <span slot="description">Notified immediately when activity occurs</span>
            </tulpar-radio-ng>
            <tulpar-radio-ng value="daily">
              <span slot="label">Daily digest</span>
              <span slot="description">One summary email each morning at 8 AM</span>
            </tulpar-radio-ng>
            <tulpar-radio-ng value="weekly">
              <span slot="label">Weekly summary</span>
              <span slot="description">One email every Monday with weekly highlights</span>
            </tulpar-radio-ng>
            <tulpar-radio-ng value="never">
              <span slot="label">Never</span>
              <span slot="description">No email notifications — check the app manually</span>
            </tulpar-radio-ng>
          </tulpar-radio-group-ng>
          <p class="notif-summary">
            Current frequency: <strong>{{ notifFreqSelected() ?? '(none)' }}</strong>
          </p>
        </div>
      </div>
      <pre class="code"><code>{{ compositionCode }}</code></pre>
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
        align-items: flex-start;
        padding: 32px 28px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 14px;
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
      }

      .hero-value {
        margin: 0;
        font-size: 14px;
        color: var(--tulpar-color-text-secondary, #57534e);
        align-self: flex-end;
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
        align-items: flex-start;
      }

      .preview--col {
        flex-direction: column;
        align-items: flex-start;
      }

      .preview--row {
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 24px;
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

      kbd {
        display: inline-block;
        padding: 1px 5px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 3px;
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 11px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        color: var(--tulpar-color-text-primary, #15110b);
      }

      /* ── Composition ────────────────────────────────────────────────── */
      .composition {
        display: flex;
      }

      .notif-card {
        flex: 1;
        max-width: 460px;
        padding: 20px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
      }

      .notif-card-title {
        margin: 0 0 16px;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 16px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .notif-summary {
        margin: 16px 0 0;
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #57534e);
        padding-top: 12px;
        border-top: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }
    `,
  ],
})
export class RadioGroupDemoComponent {
  // ── Hero demo ───────────────────────────────────────────────────────────────
  readonly heroSelected = signal<string | null>('email');

  // ── Basic binding demo ──────────────────────────────────────────────────────
  readonly billingSelected = signal<string | null>('annual');

  // ── Legend slot demo ────────────────────────────────────────────────────────
  readonly themeSelected = signal<string | null>('system');

  // ── Plan picker demo ────────────────────────────────────────────────────────
  readonly planSelected = signal<string | null>('pro');

  // ── Keyboard demo ───────────────────────────────────────────────────────────
  readonly kbdSelected = signal<string | null>('alpha');

  // ── Composition demo ────────────────────────────────────────────────────────
  readonly notifFreqSelected = signal<string | null>('instant');

  // ── Code snippets ───────────────────────────────────────────────────────────
  readonly basicCode = BASIC_CODE;
  readonly sizesCode = SIZES_CODE;
  readonly orientationCode = ORIENTATION_CODE;
  readonly legendSlotCode = LEGEND_SLOT_CODE;
  readonly statesCode = STATES_CODE;
  readonly cardVariantCode = CARD_VARIANT_CODE;
  readonly colorsCode = COLORS_CODE;
  readonly compositionCode = COMPOSITION_CODE;
}
