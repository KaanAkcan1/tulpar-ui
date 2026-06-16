import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import { TulparNumberInputComponent } from '@tulpar-ui/angular';

// ─── Code snippets ────────────────────────────────────────────────────────────

const BASICS_CODE = `<!-- Quantity: min/max/step with steppers, two-way binding -->
<tulpar-number-input-ng
  label="Quantity"
  [min]="1"
  [max]="100"
  [step]="1"
  [value]="qty"
  (valueChange)="qty=$event"
></tulpar-number-input-ng>`;

const FORMATTING_CODE = `<!-- TRY currency (tr-TR) -->
<tulpar-number-input-ng label="Amount" formatStyle="currency" currency="TRY" locale="tr-TR"
  [minFractionDigits]="2" [maxFractionDigits]="2"></tulpar-number-input-ng>
<!-- USD (en-US) -->
<tulpar-number-input-ng label="Price" formatStyle="currency" currency="USD" locale="en-US"
  [minFractionDigits]="2" [maxFractionDigits]="2"></tulpar-number-input-ng>
<!-- EUR (de-DE) -->
<tulpar-number-input-ng label="Betrag" formatStyle="currency" currency="EUR" locale="de-DE"
  [minFractionDigits]="2" [maxFractionDigits]="2"></tulpar-number-input-ng>
<!-- Percent: value 0.125 → %12,5 (Intl ×100 semantics) -->
<tulpar-number-input-ng label="Percent" formatStyle="percent" locale="tr-TR" [value]="0.125"></tulpar-number-input-ng>
<!-- Grouping off -->
<tulpar-number-input-ng label="No Grouping" [useGrouping]="false" [value]="1234567"></tulpar-number-input-ng>`;

const CONSTRAINTS_CODE = `<!-- min/max clamp-on-blur -->
<tulpar-number-input-ng label="Clamped (0–100)" [min]="0" [max]="100"></tulpar-number-input-ng>
<!-- integer-only: pressing '.' shakes the field -->
<tulpar-number-input-ng label="Integer only" [integerOnly]="true"></tulpar-number-input-ng>
<!-- allow-empty=false: empty → reverts to last valid value -->
<tulpar-number-input-ng label="Required (no empty)" [allowEmpty]="false" [value]="0"></tulpar-number-input-ng>`;

const STEPPERS_CODE = `<!-- Default steppers -->
<tulpar-number-input-ng label="Default steppers" [min]="0" [max]="100"></tulpar-number-input-ng>
<!-- Hide steppers -->
<tulpar-number-input-ng label="No steppers" [hideSteppers]="true"></tulpar-number-input-ng>
<!-- Long-press acceleration: hold to accelerate -->
<tulpar-number-input-ng
  label="Accelerating (hold)"
  [stepHoldDelay]="300"
  [stepHoldInterval]="30"
  [min]="0"
  [max]="1000"
  helperText="Hold stepper to accelerate"
></tulpar-number-input-ng>`;

const KEYBOARD_CODE = `<!-- ↑/↓ ±step, Shift×10, Ctrl×100, Home→min, End→max -->
<tulpar-number-input-ng
  label="Keyboard demo"
  [min]="0"
  [max]="1000"
  [step]="5"
  helperText="↑/↓ ±5 · Shift ×10 · Ctrl ×100 · Home/End"
></tulpar-number-input-ng>`;

const FORMAT_EXTRAS_CODE = `<tulpar-number-input-ng label="Prefix ~" formatPrefix="~"></tulpar-number-input-ng>
<tulpar-number-input-ng label="Suffix adet" formatSuffix=" adet"></tulpar-number-input-ng>
<tulpar-number-input-ng label="Combined" formatPrefix="~" formatSuffix=" adet"></tulpar-number-input-ng>`;

const ADVANCED_CODE = `// formatOptions is a JS property (not an attr) — set via the Angular wrapper
// The wrapper's effect() pushes it onto the WC element ref automatically.
<tulpar-number-input-ng
  label="Compact TRY (accounting)"
  locale="tr-TR"
  [formatOptions]="compactTRYOptions"
></tulpar-number-input-ng>
// compactTRYOptions = { style: 'currency', currency: 'TRY', notation: 'compact', currencySign: 'accounting' }`;

// ─── Section list ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'basics', title: 'Basics' },
  { id: 'formatting', title: 'Formatting' },
  { id: 'constraints', title: 'Constraints' },
  { id: 'steppers', title: 'Steppers' },
  { id: 'keyboard', title: 'Keyboard' },
  { id: 'format-extras', title: 'Format Extras' },
  { id: 'advanced', title: 'Advanced' },
];

@Component({
  selector: 'app-number-input-demo',
  standalone: true,
  imports: [TulparNumberInputComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Form</span>
      <h1 class="page-title">NumberInput</h1>
      <p class="page-lede">
        The numeric field — locale-aware currency and percent formatting, min/max clamping,
        integer-only mode, accelerating steppers, and rich keyboard control. Built on FormFieldBase.
      </p>
    </header>

    <!-- Sub-menu -->
    <div class="sub-menu">
      <button
        class="sub-btn"
        [class.active]="activeSection() === 'all'"
        (click)="activeSection.set('all')"
      >
        All
      </button>
      @for (s of sections; track s.id) {
        <button
          class="sub-btn"
          [class.active]="activeSection() === s.id"
          (click)="activeSection.set(s.id)"
        >
          {{ s.title }}
        </button>
      }
    </div>

    <!-- ── Basics ─────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'basics') {
      <section class="demo-section">
        <h3 class="demo-title">Basics</h3>
        <p class="demo-desc">Quantity spinner with min/max/step and two-way binding.</p>
        <div class="preview preview--col">
          <tulpar-number-input-ng
            label="Quantity"
            [min]="1"
            [max]="100"
            [step]="1"
            [value]="qty()"
            (valueChange)="qty.set($event)"
            helperText="Min 1 · Max 100"
          ></tulpar-number-input-ng>
          <p class="value-display">qty() = {{ qty() }}</p>
        </div>
        <pre class="code"><code>{{ basicsCode }}</code></pre>
      </section>
    }

    <!-- ── Formatting ─────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'formatting') {
      <section class="demo-section">
        <h3 class="demo-title">Formatting</h3>
        <p class="demo-desc">
          Currency (TRY/USD/EUR), percent (Intl ×100 semantics — value 0.125 displays as 12.5%), and
          grouping toggle.
        </p>
        <div class="preview preview--col">
          <div class="preview-row">
            <tulpar-number-input-ng
              label="TRY (tr-TR)"
              formatStyle="currency"
              currency="TRY"
              locale="tr-TR"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [value]="tryAmount()"
              (valueChange)="tryAmount.set($event)"
            ></tulpar-number-input-ng>

            <tulpar-number-input-ng
              label="USD (en-US)"
              formatStyle="currency"
              currency="USD"
              locale="en-US"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [value]="usdAmount()"
              (valueChange)="usdAmount.set($event)"
            ></tulpar-number-input-ng>

            <tulpar-number-input-ng
              label="EUR (de-DE)"
              formatStyle="currency"
              currency="EUR"
              locale="de-DE"
              [minFractionDigits]="2"
              [maxFractionDigits]="2"
              [value]="eurAmount()"
              (valueChange)="eurAmount.set($event)"
            ></tulpar-number-input-ng>
          </div>

          <div class="preview-row">
            <tulpar-number-input-ng
              label="Percent (Intl ×100)"
              formatStyle="percent"
              locale="tr-TR"
              [value]="percentVal()"
              (valueChange)="percentVal.set($event)"
              helperText="value=0.125 → displays %12,5"
            ></tulpar-number-input-ng>

            <tulpar-number-input-ng
              label="Grouping ON (default)"
              [value]="1234567"
              [useGrouping]="true"
            ></tulpar-number-input-ng>

            <tulpar-number-input-ng
              label="Grouping OFF"
              [value]="1234567"
              [useGrouping]="false"
            ></tulpar-number-input-ng>
          </div>
        </div>
        <pre class="code"><code>{{ formattingCode }}</code></pre>
      </section>
    }

    <!-- ── Constraints ────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'constraints') {
      <section class="demo-section">
        <h3 class="demo-title">Constraints</h3>
        <p class="demo-desc">
          min/max clamp on blur. integer-only shakes on '.' press. allow-empty=false reverts to last
          valid value when left empty.
        </p>
        <div class="preview preview--col">
          <tulpar-number-input-ng
            label="Clamped (0–100)"
            [min]="0"
            [max]="100"
            helperText="Type 999 and blur — clamps to 100"
          ></tulpar-number-input-ng>

          <tulpar-number-input-ng
            label="Integer only"
            [integerOnly]="true"
            helperText="Press '.' — field shakes (blocked)"
          ></tulpar-number-input-ng>

          <tulpar-number-input-ng
            label="allow-empty=false"
            [allowEmpty]="false"
            [value]="noEmptyVal()"
            (valueChange)="noEmptyVal.set($event)"
            helperText="Clear and blur — reverts to last value"
          ></tulpar-number-input-ng>
          <p class="value-display">value = {{ noEmptyVal() }}</p>
        </div>
        <pre class="code"><code>{{ constraintsCode }}</code></pre>
      </section>
    }

    <!-- ── Steppers ───────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'steppers') {
      <section class="demo-section">
        <h3 class="demo-title">Steppers</h3>
        <p class="demo-desc">
          Default steppers, hide-steppers, and long-press acceleration (stepHoldDelay +
          stepHoldInterval).
        </p>
        <div class="preview preview--col">
          <tulpar-number-input-ng
            label="Default steppers"
            [min]="0"
            [max]="100"
          ></tulpar-number-input-ng>

          <tulpar-number-input-ng
            label="No steppers (hide-steppers)"
            [hideSteppers]="true"
          ></tulpar-number-input-ng>

          <tulpar-number-input-ng
            label="Long-press acceleration"
            [stepHoldDelay]="300"
            [stepHoldInterval]="30"
            [min]="0"
            [max]="1000"
            helperText="Hold stepper button — value accelerates"
          ></tulpar-number-input-ng>
        </div>
        <pre class="code"><code>{{ steppersCode }}</code></pre>
      </section>
    }

    <!-- ── Keyboard ───────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'keyboard') {
      <section class="demo-section">
        <h3 class="demo-title">Keyboard Navigation</h3>
        <p class="demo-desc">Focus the input and use keyboard shortcuts:</p>
        <ul class="key-list">
          <li><kbd>↑</kbd> / <kbd>↓</kbd> — increment / decrement by step</li>
          <li><kbd>Shift</kbd> + <kbd>↑</kbd>/<kbd>↓</kbd> — ×10 step</li>
          <li><kbd>Ctrl</kbd> + <kbd>↑</kbd>/<kbd>↓</kbd> — ×100 step</li>
          <li><kbd>Home</kbd> — jump to min</li>
          <li><kbd>End</kbd> — jump to max</li>
        </ul>
        <div class="preview preview--col">
          <tulpar-number-input-ng
            label="Keyboard demo (step=5, min=0, max=1000)"
            [min]="0"
            [max]="1000"
            [step]="5"
            [value]="kbVal()"
            (valueChange)="kbVal.set($event)"
            helperText="↑/↓ ±5 · Shift ×10 · Ctrl ×100 · Home/End"
          ></tulpar-number-input-ng>
          <p class="value-display">value = {{ kbVal() }}</p>
        </div>
        <pre class="code"><code>{{ keyboardCode }}</code></pre>
      </section>
    }

    <!-- ── Format extras ──────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'format-extras') {
      <section class="demo-section">
        <h3 class="demo-title">Format Extras — prefix &amp; suffix</h3>
        <p class="demo-desc">
          formatPrefix and formatSuffix append static strings around the formatted value.
        </p>
        <div class="preview preview--col">
          <tulpar-number-input-ng
            label="Prefix ~"
            formatPrefix="~"
            [value]="42"
          ></tulpar-number-input-ng>
          <tulpar-number-input-ng
            label="Suffix (adet)"
            formatSuffix=" adet"
            [value]="10"
          ></tulpar-number-input-ng>
          <tulpar-number-input-ng
            label="Combined"
            formatPrefix="~"
            formatSuffix=" adet"
            [value]="5"
          ></tulpar-number-input-ng>
        </div>
        <pre class="code"><code>{{ formatExtrasCode }}</code></pre>
      </section>
    }

    <!-- ── Advanced ───────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'advanced') {
      <section class="demo-section">
        <h3 class="demo-title">Advanced — formatOptions</h3>
        <p class="demo-desc">
          <code class="inline-code">formatOptions</code> is a JS property on the WC (not an
          attribute). The Angular wrapper's <code class="inline-code">effect()</code> pushes it onto
          the element ref automatically.
        </p>
        <div class="preview preview--col">
          <tulpar-number-input-ng
            label="Compact TRY accounting"
            locale="tr-TR"
            [formatOptions]="compactTRYOptions"
            [value]="advancedVal()"
            (valueChange)="advancedVal.set($event)"
            helperText="-1234567.89 renders as compact accounting notation"
          ></tulpar-number-input-ng>
          <p class="value-display">raw value = {{ advancedVal() }}</p>
        </div>
        <pre class="code"><code>{{ advancedCode }}</code></pre>
      </section>
    }

    <!-- ── In context — an order line ───────────────────────────────────────── -->
    @if (activeSection() === 'all') {
      <section class="demo-section">
        <h3 class="demo-title">In context — an order summary</h3>
        <p class="demo-desc">
          A quantity stepper drives a live total — currency formatting, clamping, and two-way binding
          composed into a real checkout row.
        </p>
        <div class="order-card">
          <div class="order-line">
            <div class="order-product">
              <span class="order-name">Tulpar UI · Team license</span>
              <span class="order-unit">{{ orderUnitDisplay() }} / seat</span>
            </div>
            <tulpar-number-input-ng
              label="Seats"
              [min]="1"
              [max]="50"
              [step]="1"
              [value]="orderQty()"
              (valueChange)="orderQty.set($event)"
              [noMessageSpace]="true"
            ></tulpar-number-input-ng>
          </div>
          <div class="order-total">
            <span>Total</span>
            <strong>{{ orderTotalDisplay() }}</strong>
          </div>
        </div>
      </section>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .page-header {
        margin-bottom: 8px;
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

      .order-card {
        max-width: 460px;
        padding: 22px 24px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 14px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
      }

      .order-line {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 16px;
        padding-bottom: 18px;
        margin-bottom: 18px;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .order-product {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .order-name {
        font-size: 15px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .order-unit {
        font-size: 13px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .order-total {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        font-size: 14px;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .order-total strong {
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 22px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
        font-variant-numeric: tabular-nums;
      }

      .sub-menu {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 16px 0 24px;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
        margin-bottom: 32px;
      }

      .sub-btn {
        padding: 6px 14px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 20px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        color: var(--tulpar-color-text-secondary, #57534e);
        font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
        font-size: 13px;
        cursor: pointer;
        transition:
          background 0.1s,
          color 0.1s;
      }

      .sub-btn:hover {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .sub-btn.active {
        background: var(--tulpar-color-brand-default, #00c57a);
        border-color: var(--tulpar-color-brand-default, #00c57a);
        color: #ffffff;
      }

      .demo-section {
        padding-bottom: 48px;
        margin-bottom: 48px;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .demo-section:last-child {
        border-bottom: none;
      }

      .demo-title {
        margin: 0 0 8px;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 22px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .demo-desc {
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
        gap: 8px;
        align-items: flex-start;
      }

      .preview--col {
        flex-direction: column;
        align-items: stretch;
      }

      .preview-row {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: flex-start;
      }

      .code {
        margin: 0;
        padding: 16px 20px;
        background: var(--tulpar-color-bg-inverse, #15110b);
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 0 0 6px 6px;
        overflow-x: auto;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 13px;
        line-height: 1.55;
        color: #d9e0df;
        white-space: pre;
      }

      .value-display {
        margin: 4px 0 0;
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 12px;
        color: var(--tulpar-color-text-secondary, #57534e);
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

      .key-list {
        margin: 0 0 20px;
        padding-left: 20px;
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #57534e);
        line-height: 1.8;
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
    `,
  ],
})
export class NumberInputDemoComponent {
  readonly sections = SECTIONS;
  activeSection = signal<string>('all');

  // Basics
  qty = signal<number | null>(1);

  // Formatting
  tryAmount = signal<number | null>(1500);
  usdAmount = signal<number | null>(29.99);
  eurAmount = signal<number | null>(19.99);
  percentVal = signal<number | null>(0.125);

  // Constraints
  noEmptyVal = signal<number | null>(0);

  // Keyboard
  kbVal = signal<number | null>(50);

  // Real-world composition (order summary)
  private readonly UNIT_PRICE = 12;
  private readonly usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  orderQty = signal<number | null>(3);
  readonly orderUnitDisplay = computed(() => this.usd.format(this.UNIT_PRICE));
  readonly orderTotalDisplay = computed(() =>
    this.usd.format(this.UNIT_PRICE * (this.orderQty() ?? 0)),
  );

  // Advanced
  advancedVal = signal<number | null>(-1234567.89);
  readonly compactTRYOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'TRY',
    notation: 'compact',
    currencySign: 'accounting',
  };

  // Code snippets
  readonly basicsCode = BASICS_CODE;
  readonly formattingCode = FORMATTING_CODE;
  readonly constraintsCode = CONSTRAINTS_CODE;
  readonly steppersCode = STEPPERS_CODE;
  readonly keyboardCode = KEYBOARD_CODE;
  readonly formatExtrasCode = FORMAT_EXTRAS_CODE;
  readonly advancedCode = ADVANCED_CODE;
}
