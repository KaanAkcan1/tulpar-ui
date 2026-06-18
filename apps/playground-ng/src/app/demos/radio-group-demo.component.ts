import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TulparRadioGroupComponent, TulparRadioComponent } from '@tulpar-ui/angular';

// ─── Code snippets ─────────────────────────────────────────────────────────────

const BASIC_CODE = `<tulpar-radio-group-ng [(value)]="value" label="Billing period" name="billing">
  <tulpar-radio-ng value="monthly" label="Monthly"></tulpar-radio-ng>
  <tulpar-radio-ng value="yearly" label="Yearly"></tulpar-radio-ng>
  <tulpar-radio-ng value="lifetime" label="Lifetime"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<!-- Live value: {{ value() }} -->`;

const PROPS_VS_SLOTS_CODE = `<!-- (a) PROP form — radio label + description as inputs -->
<tulpar-radio-ng value="email" label="Email" description="Get notified by email."></tulpar-radio-ng>

<!-- (b) SLOT form — rich label + description -->
<tulpar-radio-ng value="sms">
  <span slot="label">SMS</span>
  <span slot="description">Text messages to your phone.</span>
</tulpar-radio-ng>`;

const SIZES_CODE = `<!-- size propagates from the group to every radio -->
<tulpar-radio-group-ng [(value)]="value" size="xs" label="Extra small">…</tulpar-radio-group-ng>
<tulpar-radio-group-ng [(value)]="value" size="sm" label="Small">…</tulpar-radio-group-ng>
<tulpar-radio-group-ng [(value)]="value" size="md" label="Medium">…</tulpar-radio-group-ng>
<tulpar-radio-group-ng [(value)]="value" size="lg" label="Large">…</tulpar-radio-group-ng>
<tulpar-radio-group-ng [(value)]="value" size="xl" label="Extra large">…</tulpar-radio-group-ng>`;

const ORIENTATION_CODE = `<!-- Vertical (default) -->
<tulpar-radio-group-ng [(value)]="value" orientation="vertical" label="Vertical">
  <tulpar-radio-ng value="monthly" label="Monthly"></tulpar-radio-ng>
  <tulpar-radio-ng value="yearly" label="Yearly"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<!-- Horizontal -->
<tulpar-radio-group-ng [(value)]="value" orientation="horizontal" label="Horizontal">
  <tulpar-radio-ng value="light" label="Light"></tulpar-radio-ng>
  <tulpar-radio-ng value="dark" label="Dark"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const GROUP_LABEL_CODE = `<!-- (a) PROP form — group legend via label + description -->
<tulpar-radio-group-ng
  [(value)]="value"
  label="Appearance"
  description="Choose how Tulpar UI looks in this browser."
>
  <tulpar-radio-ng value="light" label="Light"></tulpar-radio-ng>
  <tulpar-radio-ng value="dark" label="Dark"></tulpar-radio-ng>
  <tulpar-radio-ng value="system" label="System"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<!-- (b) SLOT form — rich group legend -->
<tulpar-radio-group-ng [(value)]="value">
  <span slot="label">Appearance</span>
  <span slot="description">Choose how Tulpar UI looks in this browser.</span>
  <tulpar-radio-ng value="light" label="Light"></tulpar-radio-ng>
  <tulpar-radio-ng value="dark" label="Dark"></tulpar-radio-ng>
  <tulpar-radio-ng value="system" label="System"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const STATES_CODE = `<!-- Required + invalid -->
<tulpar-radio-group-ng
  [required]="true"
  [invalid]="true"
  label="Choose a plan"
  errorText="Please select a plan to continue."
>
  <tulpar-radio-ng value="free" label="Free"></tulpar-radio-ng>
  <tulpar-radio-ng value="pro" label="Pro"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<!-- Group-level disabled -->
<tulpar-radio-group-ng [(value)]="value" [disabled]="true" label="Disabled group">
  <tulpar-radio-ng value="standard" label="Standard"></tulpar-radio-ng>
  <tulpar-radio-ng value="express" label="Express"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<!-- Individual item disabled -->
<tulpar-radio-group-ng [(value)]="value" label="Item disabled">
  <tulpar-radio-ng value="free" label="Free"></tulpar-radio-ng>
  <tulpar-radio-ng value="pro" label="Pro (unavailable)" [disabled]="true"></tulpar-radio-ng>
  <tulpar-radio-ng value="enterprise" label="Enterprise"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const CARD_VARIANT_CODE = `<tulpar-radio-group-ng [(value)]="plan" orientation="horizontal" label="Choose a plan">
  <tulpar-radio-ng variant="card" value="starter" label="Starter">
    <span slot="description">$9 / mo · Up to 5 users</span>
  </tulpar-radio-ng>
  <tulpar-radio-ng variant="card" value="pro" label="Pro">
    <span slot="description">$29 / mo · Up to 25 users</span>
  </tulpar-radio-ng>
  <tulpar-radio-ng variant="card" value="enterprise" label="Enterprise">
    <span slot="description">Custom pricing · Unlimited</span>
  </tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const COLOR_CODE = `<!-- Group-level color — bind it -->
<tulpar-radio-group-ng [(value)]="value" [color]="'ulgen'" label="Group color: ulgen">
  <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
  <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
</tulpar-radio-group-ng>

<!-- Per-radio override — a single radio overrides the group color -->
<tulpar-radio-group-ng [(value)]="value" [color]="'otuken'" label="Per-radio override">
  <tulpar-radio-ng value="a" label="Inherits otuken"></tulpar-radio-ng>
  <tulpar-radio-ng value="b" [color]="'kizagan'" label="Overrides to kizagan"></tulpar-radio-ng>
</tulpar-radio-group-ng>`;

const KEYBOARD_CODE = `<!-- Keyboard navigation is managed by tulpar-radio-group (roving tabindex):
       Tab / Shift+Tab          — enter / leave the group
       ArrowDown / ArrowRight   — next option (wraps)
       ArrowUp / ArrowLeft      — previous option (wraps)
       Home                     — first option
       End                      — last option
     Disabled options are skipped. Arrowing changes focus AND value. -->`;

@Component({
  selector: 'app-radio-group-demo',
  standalone: true,
  imports: [TulparRadioGroupComponent, TulparRadioComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Core</span>
      <h1 class="page-title">RadioGroup</h1>
      <p class="page-lede">
        A single-select fieldset — two-way value, vertical or horizontal orientation, size
        propagation, group legend in prop and slot form, a card variant for plan pickers, group +
        per-radio color, and full roving-tabindex keyboard navigation.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-radio-group-ng
          [(value)]="heroValue"
          label="Billing period"
          name="billing-hero"
          size="lg"
        >
          <tulpar-radio-ng value="monthly" label="Monthly"></tulpar-radio-ng>
          <tulpar-radio-ng value="yearly" label="Yearly"></tulpar-radio-ng>
          <tulpar-radio-ng value="lifetime" label="Lifetime"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng
          [(value)]="heroValue"
          orientation="horizontal"
          name="billing-hero-h"
          size="lg"
        >
          <tulpar-radio-ng value="monthly" label="Monthly"></tulpar-radio-ng>
          <tulpar-radio-ng value="yearly" label="Yearly"></tulpar-radio-ng>
          <tulpar-radio-ng value="lifetime" label="Lifetime"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
    </section>

    <!-- ── 1. Basic ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Basic — vertical group, two-way value</h2>
      <p class="section-desc">
        <code class="inline-code">[(value)]</code> binds the selected radio's
        <code class="inline-code">value</code>. Selecting an option updates the bound value and
        deselects its siblings.
      </p>
      <div class="preview preview--col">
        <tulpar-radio-group-ng [(value)]="basicValue" label="Billing period" name="basic">
          <tulpar-radio-ng value="monthly" label="Monthly"></tulpar-radio-ng>
          <tulpar-radio-ng value="yearly" label="Yearly"></tulpar-radio-ng>
          <tulpar-radio-ng value="lifetime" label="Lifetime"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <p class="live-value">
          value: <strong>{{ basicValue() }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ basicCode }}</code></pre>
    </section>

    <!-- ── 2. Props vs slots — radio label & description ────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Props vs slots — radio label &amp; description</h2>
      <p class="section-desc">
        Each <code class="inline-code">tulpar-radio-ng</code> takes
        <code class="inline-code">label</code> / <code class="inline-code">description</code> inputs
        OR <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code>. Both render identically.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <tulpar-radio-group-ng [(value)]="propSlotValue" name="ps-prop">
            <tulpar-radio-ng value="email" label="Email" description="Get notified by email.">
            </tulpar-radio-ng>
            <tulpar-radio-ng value="push" label="Push" description="Alerts on your devices.">
            </tulpar-radio-ng>
          </tulpar-radio-group-ng>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <tulpar-radio-group-ng [(value)]="propSlotValue" name="ps-slot">
            <tulpar-radio-ng value="email">
              <span slot="label">Email</span>
              <span slot="description">Get notified by email.</span>
            </tulpar-radio-ng>
            <tulpar-radio-ng value="push">
              <span slot="label">Push</span>
              <span slot="description">Alerts on your devices.</span>
            </tulpar-radio-ng>
          </tulpar-radio-group-ng>
        </div>
      </div>
      <pre class="code"><code>{{ propsVsSlotsCode }}</code></pre>
    </section>

    <!-- ── 3. Sizes ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Sizes</h2>
      <p class="section-desc">
        The group <code class="inline-code">size</code> propagates to every radio:
        <code class="inline-code">xs</code> through <code class="inline-code">xl</code>.
      </p>
      <div class="preview preview--row-gap">
        <tulpar-radio-group-ng [(value)]="sizeValue" size="xs" label="xs" name="size-xs">
          <tulpar-radio-ng value="md" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng [(value)]="sizeValue" size="sm" label="sm" name="size-sm">
          <tulpar-radio-ng value="md" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng [(value)]="sizeValue" size="md" label="md" name="size-md">
          <tulpar-radio-ng value="md" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng [(value)]="sizeValue" size="lg" label="lg" name="size-lg">
          <tulpar-radio-ng value="md" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng [(value)]="sizeValue" size="xl" label="xl" name="size-xl">
          <tulpar-radio-ng value="md" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 4. Orientation ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Orientation</h2>
      <p class="section-desc">
        <code class="inline-code">orientation="vertical"</code> (default) stacks options;
        <code class="inline-code">orientation="horizontal"</code> lays them out in a row.
      </p>
      <div class="preview preview--row-gap">
        <tulpar-radio-group-ng
          [(value)]="orientationValue"
          orientation="vertical"
          label="Vertical (default)"
          name="orient-v"
        >
          <tulpar-radio-ng value="monthly" label="Monthly"></tulpar-radio-ng>
          <tulpar-radio-ng value="yearly" label="Yearly"></tulpar-radio-ng>
          <tulpar-radio-ng value="lifetime" label="Lifetime"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng
          [(value)]="horizontalValue"
          orientation="horizontal"
          label="Horizontal"
          name="orient-h"
        >
          <tulpar-radio-ng value="light" label="Light"></tulpar-radio-ng>
          <tulpar-radio-ng value="dark" label="Dark"></tulpar-radio-ng>
          <tulpar-radio-ng value="system" label="System"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ orientationCode }}</code></pre>
    </section>

    <!-- ── 5. Group label + description — prop AND slot ─────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Group label + description — prop &amp; slot</h2>
      <p class="section-desc">
        The group legend can be set via the <code class="inline-code">label</code> /
        <code class="inline-code">description</code> inputs OR via group-level
        <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code>.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <tulpar-radio-group-ng
            [(value)]="groupLabelPropValue"
            name="gl-prop"
            label="Appearance"
            description="Choose how Tulpar UI looks in this browser."
          >
            <tulpar-radio-ng value="light" label="Light"></tulpar-radio-ng>
            <tulpar-radio-ng value="dark" label="Dark"></tulpar-radio-ng>
            <tulpar-radio-ng value="system" label="System"></tulpar-radio-ng>
          </tulpar-radio-group-ng>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <tulpar-radio-group-ng [(value)]="groupLabelSlotValue" name="gl-slot">
            <span slot="label">Appearance</span>
            <span slot="description">Choose how Tulpar UI looks in this browser.</span>
            <tulpar-radio-ng value="light" label="Light"></tulpar-radio-ng>
            <tulpar-radio-ng value="dark" label="Dark"></tulpar-radio-ng>
            <tulpar-radio-ng value="system" label="System"></tulpar-radio-ng>
          </tulpar-radio-group-ng>
        </div>
      </div>
      <pre class="code"><code>{{ groupLabelCode }}</code></pre>
    </section>

    <!-- ── 6. States ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. States</h2>
      <p class="section-desc">
        Required + invalid with <code class="inline-code">errorText</code>, group-level disabled,
        and per-item disabled.
      </p>
      <div class="preview preview--row-gap">
        <tulpar-radio-group-ng
          [(value)]="statesGroupValue"
          [required]="true"
          [invalid]="true"
          label="Choose a plan"
          errorText="Please select a plan to continue."
          name="states-invalid"
        >
          <tulpar-radio-ng value="free" label="Free"></tulpar-radio-ng>
          <tulpar-radio-ng value="pro" label="Pro"></tulpar-radio-ng>
        </tulpar-radio-group-ng>

        <tulpar-radio-group-ng
          [(value)]="disabledGroupValue"
          [disabled]="true"
          label="Disabled group"
          name="states-disabled"
        >
          <tulpar-radio-ng value="standard" label="Standard"></tulpar-radio-ng>
          <tulpar-radio-ng value="express" label="Express"></tulpar-radio-ng>
        </tulpar-radio-group-ng>

        <tulpar-radio-group-ng
          [(value)]="itemDisabledValue"
          label="Item disabled"
          name="states-item"
        >
          <tulpar-radio-ng value="free" label="Free"></tulpar-radio-ng>
          <tulpar-radio-ng
            value="pro"
            label="Pro (unavailable)"
            [disabled]="true"
          ></tulpar-radio-ng>
          <tulpar-radio-ng value="enterprise" label="Enterprise"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 7. Card variant — plan picker ────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Card variant — plan picker</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> on each
        <code class="inline-code">tulpar-radio-ng</code> renders arrow-key navigable cards — ideal
        for plan or layout pickers. Each shows a single clean selection dot.
      </p>
      <div class="preview">
        <tulpar-radio-group-ng
          [(value)]="cardValue"
          orientation="horizontal"
          label="Choose a plan"
          name="card-plans"
        >
          <tulpar-radio-ng variant="card" value="starter" label="Starter">
            <span slot="description">$9 / mo · Up to 5 users</span>
          </tulpar-radio-ng>
          <tulpar-radio-ng variant="card" value="pro" label="Pro">
            <span slot="description">$29 / mo · Up to 25 users</span>
          </tulpar-radio-ng>
          <tulpar-radio-ng variant="card" value="enterprise" label="Enterprise">
            <span slot="description">Custom · Unlimited</span>
          </tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ cardVariantCode }}</code></pre>
    </section>

    <!-- ── 8. Color — group + per-radio override ────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Color — group + per-radio override</h2>
      <p class="section-desc">
        Bind <code class="inline-code">[color]</code> on the group to set the accent for every
        radio, or on a single <code class="inline-code">tulpar-radio-ng</code> to override just that
        one.
      </p>
      <div class="preview preview--row-gap">
        <tulpar-radio-group-ng
          [(value)]="colorGroupValue"
          [color]="'ulgen'"
          label="Group: ulgen"
          name="c-ulgen"
        >
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng
          [(value)]="colorGroupValue"
          [color]="'kizagan'"
          label="Group: kizagan"
          name="c-kizagan"
        >
          <tulpar-radio-ng value="a" label="Option A"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" label="Option B"></tulpar-radio-ng>
        </tulpar-radio-group-ng>
        <tulpar-radio-group-ng
          [(value)]="colorPerRadioValue"
          [color]="'otuken'"
          label="Per-radio override"
          name="c-override"
        >
          <tulpar-radio-ng value="a" label="Inherits otuken"></tulpar-radio-ng>
          <tulpar-radio-ng value="b" [color]="'kizagan'" label="Overrides to kizagan">
          </tulpar-radio-ng>
        </tulpar-radio-group-ng>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 9. Keyboard navigation ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Keyboard navigation</h2>
      <p class="section-desc">
        The group implements roving tabindex — only the selected (or first) option is in the tab
        sequence. Arrow keys move focus and change the value; disabled options are skipped.
      </p>
      <div class="preview">
        <div class="keyboard-table">
          <div class="keyboard-row">
            <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd>
            <span>Enter or leave the group</span>
          </div>
          <div class="keyboard-row">
            <kbd>↓</kbd> / <kbd>→</kbd>
            <span>Next option (wraps to first)</span>
          </div>
          <div class="keyboard-row">
            <kbd>↑</kbd> / <kbd>←</kbd>
            <span>Previous option (wraps to last)</span>
          </div>
          <div class="keyboard-row">
            <kbd>Home</kbd>
            <span>First option</span>
          </div>
          <div class="keyboard-row">
            <kbd>End</kbd>
            <span>Last option</span>
          </div>
          <div class="keyboard-row">
            <kbd>disabled</kbd>
            <span>Skipped during arrow navigation</span>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ keyboardCode }}</code></pre>
    </section>

    <!-- ── 10. In context — notification frequency ──────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — notification frequency</h2>
      <p class="section-desc">
        A settings composition: a single-select frequency picker using the card variant with
        descriptions, plus a live readout of the chosen value.
      </p>
      <div class="composition">
        <div class="plan-card">
          <h3 class="plan-card-title">Email notifications</h3>
          <p class="plan-card-sub">How often should we send you a digest?</p>
          <tulpar-radio-group-ng [(value)]="compositionValue" name="freq-picker" class="plan-group">
            <tulpar-radio-ng variant="card" value="important" label="Important only">
              <span slot="description">Only security alerts and account changes.</span>
            </tulpar-radio-ng>
            <tulpar-radio-ng variant="card" value="daily" label="Daily digest">
              <span slot="description">One summary email every morning.</span>
            </tulpar-radio-ng>
            <tulpar-radio-ng variant="card" value="realtime" label="Real-time">
              <span slot="description">Every event, as it happens.</span>
            </tulpar-radio-ng>
          </tulpar-radio-group-ng>
          <p class="plan-selected">
            Selected: <strong>{{ compositionValue() }}</strong>
          </p>
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
        gap: 32px;
        align-items: flex-start;
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
        align-items: flex-start;
      }

      .preview--col {
        flex-direction: column;
        align-items: flex-start;
      }

      .preview--cols {
        align-items: flex-start;
        gap: 40px;
      }

      .preview--row-gap {
        gap: 32px;
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

      .live-value {
        margin: 4px 0 0;
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

      .keyboard-table {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .keyboard-row {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .composition {
        display: flex;
      }

      .plan-card {
        flex: 1;
        max-width: 580px;
        padding: 24px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
      }

      .plan-card-title {
        margin: 0 0 6px;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 20px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .plan-card-sub {
        margin: 0 0 20px;
        font-size: 14px;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .plan-group {
        display: block;
        margin-bottom: 16px;
      }

      .plan-selected {
        margin: 16px 0 0;
        font-size: 14px;
        color: var(--tulpar-color-text-secondary, #57534e);
      }
    `,
  ],
})
export class RadioGroupDemoComponent {
  // ── State ──────────────────────────────────────────────────────────────────
  readonly heroValue = signal('monthly');
  readonly basicValue = signal('yearly');
  readonly propSlotValue = signal('email');
  readonly sizeValue = signal('md');
  readonly orientationValue = signal('monthly');
  readonly horizontalValue = signal('light');
  readonly groupLabelPropValue = signal('system');
  readonly groupLabelSlotValue = signal('system');
  readonly statesGroupValue = signal<string | null>(null);
  readonly disabledGroupValue = signal('standard');
  readonly itemDisabledValue = signal('free');
  readonly cardValue = signal('pro');
  readonly colorGroupValue = signal('b');
  readonly colorPerRadioValue = signal('b');
  readonly compositionValue = signal('important');

  // ── Code snippets ───────────────────────────────────────────────────────────
  readonly basicCode = BASIC_CODE;
  readonly propsVsSlotsCode = PROPS_VS_SLOTS_CODE;
  readonly sizesCode = SIZES_CODE;
  readonly orientationCode = ORIENTATION_CODE;
  readonly groupLabelCode = GROUP_LABEL_CODE;
  readonly statesCode = STATES_CODE;
  readonly cardVariantCode = CARD_VARIANT_CODE;
  readonly colorCode = COLOR_CODE;
  readonly keyboardCode = KEYBOARD_CODE;
}
