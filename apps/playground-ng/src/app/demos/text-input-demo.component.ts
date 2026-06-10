import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import { TulparTextInputComponent } from '@tulpar-ui/angular';

// ─── Code snippets (outside class to avoid backtick nesting) ─────────────────

const TYPES_CODE = `<!-- text / email / url / tel / search / password -->
<tulpar-text-input-ng type="email" label="Email" autocomplete="email"></tulpar-text-input-ng>
<tulpar-text-input-ng type="password" label="Password" autocomplete="current-password"></tulpar-text-input-ng>
<!-- search: auto-adds search icon + clearable -->
<tulpar-text-input-ng type="search" label="Search" placeholder="Search..."></tulpar-text-input-ng>`;

const SIZES_CODE = `<tulpar-text-input-ng size="xs" label="Extra Small"></tulpar-text-input-ng>
<tulpar-text-input-ng size="sm" label="Small"></tulpar-text-input-ng>
<tulpar-text-input-ng size="md" label="Medium (default)"></tulpar-text-input-ng>
<tulpar-text-input-ng size="lg" label="Large"></tulpar-text-input-ng>
<tulpar-text-input-ng size="xl" label="Extra Large"></tulpar-text-input-ng>
<!-- note: at xs, action buttons (clear/copy/paste) are auto-hidden for touch a11y -->`;

const VARIANTS_CODE = `<tulpar-text-input-ng variant="outlined" label="Outlined (default)"></tulpar-text-input-ng>
<tulpar-text-input-ng variant="filled" label="Filled"></tulpar-text-input-ng>
<tulpar-text-input-ng variant="underlined" label="Underlined"></tulpar-text-input-ng>
<tulpar-text-input-ng variant="ghost" label="Ghost"></tulpar-text-input-ng>`;

const LABEL_POSITIONS_CODE = `<tulpar-text-input-ng labelPosition="top" label="Top (default)"></tulpar-text-input-ng>
<tulpar-text-input-ng labelPosition="float" label="Float"></tulpar-text-input-ng>
<tulpar-text-input-ng labelPosition="float-in" label="Float-in"></tulpar-text-input-ng>
<tulpar-text-input-ng labelPosition="float-on" label="Float-on"></tulpar-text-input-ng>
<tulpar-text-input-ng labelPosition="none" placeholder="No label"></tulpar-text-input-ng>
<!-- fallback: float + ghost → renders as top, console warning -->
<tulpar-text-input-ng labelPosition="float" variant="ghost" label="Float + Ghost (→ top)"></tulpar-text-input-ng>`;

const NECESSITY_CODE = `<!-- icon mode (default): asterisk for required, nothing for optional -->
<tulpar-text-input-ng label="Username" [required]="true" necessityIndicator="icon"></tulpar-text-input-ng>
<!-- label mode: appends "(required)" or "(optional)" text -->
<tulpar-text-input-ng label="Username" [required]="true" necessityIndicator="label"></tulpar-text-input-ng>
<tulpar-text-input-ng label="Nickname" necessityIndicator="label"></tulpar-text-input-ng>
<!-- none: no indicator at all -->
<tulpar-text-input-ng label="Display Name" necessityIndicator="none"></tulpar-text-input-ng>`;

const STATUSES_CODE = `<tulpar-text-input-ng label="Email" [invalid]="true" errorText="Invalid email address"></tulpar-text-input-ng>
<tulpar-text-input-ng label="Username" [warn]="true" warnText="Username may already be taken"></tulpar-text-input-ng>
<tulpar-text-input-ng label="Subdomain" [validating]="true" helperText="Checking availability…"></tulpar-text-input-ng>
<!-- invalid + validating combo (re-checking after edit) -->
<tulpar-text-input-ng label="Slug" [invalid]="true" [validating]="true" errorText="Invalid format"></tulpar-text-input-ng>
<!-- helper only baseline -->
<tulpar-text-input-ng label="Website" helperText="Include https://"></tulpar-text-input-ng>`;

const AFFORDANCES_CODE = `<!-- clearable: x button appears when value is non-empty -->
<tulpar-text-input-ng label="Search" [clearable]="true" [value]="val" (valueChange)="val=$event"></tulpar-text-input-ng>
<!-- show-count: character count overlay in message row -->
<tulpar-text-input-ng label="Bio" [showCount]="true" [maxLength]="50"></tulpar-text-input-ng>
<!-- copyable: copy icon, works great for read-only values -->
<tulpar-text-input-ng label="API Key" [copyable]="true" [readonly]="true" value="sk_test_abc123"></tulpar-text-input-ng>
<!-- pastable: paste icon -->
<tulpar-text-input-ng label="Paste here" [pastable]="true"></tulpar-text-input-ng>
<!-- both -->
<tulpar-text-input-ng label="Token" [copyable]="true" [pastable]="true"></tulpar-text-input-ng>`;

const MASKS_CODE = `<!-- TR phone — 9 in "+90" must be escaped or it becomes a digit token -->
<tulpar-text-input-ng label="Phone" mask="+\\90 (999) 999 99 99"></tulpar-text-input-ng>
<!-- TR plate: auto-uppercase letters -->
<tulpar-text-input-ng label="Plate" mask="99 AAA 999"></tulpar-text-input-ng>
<!-- Credit card -->
<tulpar-text-input-ng label="Card" mask="9999 9999 9999 9999"></tulpar-text-input-ng>
<!-- Date -->
<tulpar-text-input-ng label="Date" mask="99/99/9999" placeholder="DD/MM/YYYY"></tulpar-text-input-ng>
<!-- maskEmit raw vs masked; maskDisplay eager vs lazy; custom slot char -->
<tulpar-text-input-ng label="Raw emit" mask="999-999" maskEmit="raw"></tulpar-text-input-ng>
<tulpar-text-input-ng label="Lazy display" mask="999-999" maskDisplay="lazy"></tulpar-text-input-ng>
<tulpar-text-input-ng label="Custom slot char ·" mask="999-999" maskSlotChar="·"></tulpar-text-input-ng>`;

const SLOTS_CODE = `<!-- prefix slot: static text -->
<tulpar-text-input-ng label="Amount">
  <span slot="prefix">$</span>
</tulpar-text-input-ng>
<!-- suffix slot -->
<tulpar-text-input-ng label="Domain">
  <span slot="suffix">.com</span>
</tulpar-text-input-ng>
<!-- prefix-interactive: a button inside the prefix slot -->
<tulpar-text-input-ng label="Search" [prefixInteractive]="true">
  <button slot="prefix" type="button">Go</button>
</tulpar-text-input-ng>`;

const STATES_CODE = `<tulpar-text-input-ng label="Disabled" [disabled]="true" value="Cannot edit"></tulpar-text-input-ng>
<tulpar-text-input-ng label="Readonly" [readonly]="true" value="Read only value"></tulpar-text-input-ng>
<!-- noMessageSpace: no reserved row beneath input (tight layouts) -->
<tulpar-text-input-ng label="Compact" [noMessageSpace]="true"></tulpar-text-input-ng>`;

// ─── Section list ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'types', title: 'Types' },
  { id: 'sizes', title: 'Sizes' },
  { id: 'variants', title: 'Variants' },
  { id: 'label-positions', title: 'Label Positions' },
  { id: 'necessity', title: 'Necessity' },
  { id: 'statuses', title: 'Statuses' },
  { id: 'affordances', title: 'Affordances' },
  { id: 'masks', title: 'Masks' },
  { id: 'slots', title: 'Slots' },
  { id: 'states', title: 'States' },
];

@Component({
  selector: 'app-text-input-demo',
  standalone: true,
  imports: [TulparTextInputComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Sub-menu -->
    <div class="sub-menu">
      <button
        class="sub-btn"
        [class.active]="activeSection() === 'all'"
        (click)="activeSection.set('all')"
      >All</button>
      @for (s of sections; track s.id) {
        <button
          class="sub-btn"
          [class.active]="activeSection() === s.id"
          (click)="activeSection.set(s.id)"
        >{{ s.title }}</button>
      }
    </div>

    <!-- ── Types ─────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'types') {
      <section class="demo-section">
        <h3 class="demo-title">Types</h3>
        <p class="demo-desc">All 6 input types. Search auto-adds a magnifier icon and clearable affordance. Password shows a reveal toggle.</p>
        <div class="preview preview--col">
          <div class="preview-row">
            <tulpar-text-input-ng type="text" label="Text (default)" placeholder="Plain text"></tulpar-text-input-ng>
            <tulpar-text-input-ng type="email" label="Email" autocomplete="email" placeholder="you@example.com"></tulpar-text-input-ng>
            <tulpar-text-input-ng type="url" label="URL" placeholder="https://"></tulpar-text-input-ng>
          </div>
          <div class="preview-row">
            <tulpar-text-input-ng type="tel" label="Tel" autocomplete="tel" placeholder="+1 555 000 0000"></tulpar-text-input-ng>
            <tulpar-text-input-ng type="search" label="Search" placeholder="Search…"></tulpar-text-input-ng>
            <tulpar-text-input-ng type="password" label="Password" autocomplete="current-password" placeholder="••••••••"></tulpar-text-input-ng>
          </div>
        </div>
        <pre class="code"><code>{{ typesCode }}</code></pre>
      </section>
    }

    <!-- ── Sizes ─────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'sizes') {
      <section class="demo-section">
        <h3 class="demo-title">Sizes</h3>
        <p class="demo-desc">Five sizes: xs → xl. At xs, action buttons (clear/copy/paste) are auto-hidden to respect touch target a11y guidelines.</p>
        <div class="preview preview--col">
          <tulpar-text-input-ng size="xs" label="xs — Extra Small" placeholder="xs"></tulpar-text-input-ng>
          <tulpar-text-input-ng size="sm" label="sm — Small" placeholder="sm"></tulpar-text-input-ng>
          <tulpar-text-input-ng size="md" label="md — Medium (default)" placeholder="md"></tulpar-text-input-ng>
          <tulpar-text-input-ng size="lg" label="lg — Large" placeholder="lg"></tulpar-text-input-ng>
          <tulpar-text-input-ng size="xl" label="xl — Extra Large" placeholder="xl"></tulpar-text-input-ng>
        </div>
        <pre class="code"><code>{{ sizesCode }}</code></pre>
      </section>
    }

    <!-- ── Variants ──────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'variants') {
      <section class="demo-section">
        <h3 class="demo-title">Variants</h3>
        <p class="demo-desc">Four rendering styles. Ghost with float label falls back to top (console warning).</p>
        <div class="preview preview--col">
          <tulpar-text-input-ng variant="outlined" label="Outlined (default)" placeholder="Outlined"></tulpar-text-input-ng>
          <tulpar-text-input-ng variant="filled" label="Filled" placeholder="Filled"></tulpar-text-input-ng>
          <tulpar-text-input-ng variant="underlined" label="Underlined" placeholder="Underlined"></tulpar-text-input-ng>
          <tulpar-text-input-ng variant="ghost" label="Ghost" placeholder="Ghost"></tulpar-text-input-ng>
        </div>
        <pre class="code"><code>{{ variantsCode }}</code></pre>
      </section>
    }

    <!-- ── Label positions ───────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'label-positions') {
      <section class="demo-section">
        <h3 class="demo-title">Label Positions</h3>
        <p class="demo-desc">Five positions. The last example shows the fallback: float + ghost forces top layout with a console warning.</p>
        <div class="preview preview--col">
          <tulpar-text-input-ng labelPosition="top" label="Top (default)" placeholder="top"></tulpar-text-input-ng>
          <tulpar-text-input-ng labelPosition="float" label="Float" placeholder="Click to float label"></tulpar-text-input-ng>
          <tulpar-text-input-ng labelPosition="float-in" label="Float-in" placeholder="float-in"></tulpar-text-input-ng>
          <tulpar-text-input-ng labelPosition="float-on" label="Float-on" placeholder="float-on"></tulpar-text-input-ng>
          <tulpar-text-input-ng labelPosition="none" placeholder="No label (labelPosition=none)"></tulpar-text-input-ng>
          <div>
            <p class="demo-note">Fallback: float + ghost → renders as top (console warning)</p>
            <tulpar-text-input-ng labelPosition="float" variant="ghost" label="Float + Ghost → fallback to top" placeholder="ghost float fallback"></tulpar-text-input-ng>
          </div>
        </div>
        <pre class="code"><code>{{ labelPositionsCode }}</code></pre>
      </section>
    }

    <!-- ── Necessity ─────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'necessity') {
      <section class="demo-section">
        <h3 class="demo-title">Necessity Indicator</h3>
        <p class="demo-desc">Three modes: icon (asterisk), label (appends text), none.</p>
        <div class="preview preview--col">
          <div class="preview-row">
            <tulpar-text-input-ng label="Required (icon)" [required]="true" necessityIndicator="icon" placeholder="required + icon"></tulpar-text-input-ng>
            <tulpar-text-input-ng label="Optional (icon)" necessityIndicator="icon" placeholder="optional + icon (no mark)"></tulpar-text-input-ng>
          </div>
          <div class="preview-row">
            <tulpar-text-input-ng label="Required (label)" [required]="true" necessityIndicator="label" placeholder="required + label text"></tulpar-text-input-ng>
            <tulpar-text-input-ng label="Optional (label)" necessityIndicator="label" placeholder="optional + label text"></tulpar-text-input-ng>
          </div>
          <tulpar-text-input-ng label="No indicator" necessityIndicator="none" placeholder="necessityIndicator=none"></tulpar-text-input-ng>
        </div>
        <pre class="code"><code>{{ necessityCode }}</code></pre>
      </section>
    }

    <!-- ── Statuses ───────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'statuses') {
      <section class="demo-section">
        <h3 class="demo-title">Statuses</h3>
        <p class="demo-desc">invalid + errorText, warn + warnText, validating + helperText, invalid + validating combo, and a helper-only baseline.</p>
        <div class="preview preview--col">
          <tulpar-text-input-ng label="Email" [invalid]="true" errorText="Invalid email address" value="not-an-email"></tulpar-text-input-ng>
          <tulpar-text-input-ng label="Username" [warn]="true" warnText="Username may already be taken" value="john_doe"></tulpar-text-input-ng>
          <tulpar-text-input-ng label="Subdomain" [validating]="true" helperText="Checking availability…" value="my-app"></tulpar-text-input-ng>
          <tulpar-text-input-ng label="Slug" [invalid]="true" [validating]="true" errorText="Invalid format — re-checking" value="bad slug!"></tulpar-text-input-ng>
          <tulpar-text-input-ng label="Website" helperText="Include https://" placeholder="https://example.com"></tulpar-text-input-ng>
        </div>
        <pre class="code"><code>{{ statusesCode }}</code></pre>
      </section>
    }

    <!-- ── Affordances ────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'affordances') {
      <section class="demo-section">
        <h3 class="demo-title">Affordances</h3>
        <p class="demo-desc">clearable, show-count, copyable (great for readonly tokens), pastable, and combined.</p>
        <div class="preview preview--col">
          <tulpar-text-input-ng
            label="Clearable"
            [clearable]="true"
            [value]="clearableVal()"
            (valueChange)="clearableVal.set($event)"
            placeholder="Type something…"
          ></tulpar-text-input-ng>
          <p class="value-display">value = "{{ clearableVal() }}"</p>

          <tulpar-text-input-ng
            label="Show Count (max 50)"
            [showCount]="true"
            [maxLength]="50"
            [value]="countVal()"
            (valueChange)="countVal.set($event)"
            placeholder="Type to see counter…"
          ></tulpar-text-input-ng>

          <tulpar-text-input-ng
            label="API Key (copyable + readonly)"
            [copyable]="true"
            [readonly]="true"
            value="sk_test_4xK7mR9pQnW2vL8hJ5cB"
          ></tulpar-text-input-ng>

          <tulpar-text-input-ng
            label="Pastable"
            [pastable]="true"
            placeholder="Click paste icon…"
          ></tulpar-text-input-ng>

          <tulpar-text-input-ng
            label="Copyable + Pastable"
            [copyable]="true"
            [pastable]="true"
            value="combo"
          ></tulpar-text-input-ng>
        </div>
        <pre class="code"><code>{{ affordancesCode }}</code></pre>
      </section>
    }

    <!-- ── Masks ──────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'masks') {
      <section class="demo-section">
        <h3 class="demo-title">Masks</h3>
        <p class="demo-desc">
          Mask tokens: 9=digit, A=letter, *=any. In Angular templates the backslash before
          the leading digit in "+90" must be doubled to produce a literal escape.
        </p>
        <div class="preview preview--col">
          <tulpar-text-input-ng
            label="TR Phone"
            mask="+\\90 (999) 999 99 99"
            [value]="maskPhone()"
            (valueChange)="maskPhone.set($event)"
            placeholder="+90 (___) ___ __ __"
          ></tulpar-text-input-ng>
          <p class="value-display">masked value = "{{ maskPhone() }}"</p>

          <tulpar-text-input-ng
            label="TR Plate (auto-uppercase letters)"
            mask="99 AAA 999"
            placeholder="34 ABC 123"
          ></tulpar-text-input-ng>

          <tulpar-text-input-ng
            label="Credit Card"
            mask="9999 9999 9999 9999"
            placeholder="0000 0000 0000 0000"
          ></tulpar-text-input-ng>

          <tulpar-text-input-ng
            label="Date"
            mask="99/99/9999"
            placeholder="DD/MM/YYYY"
          ></tulpar-text-input-ng>

          <div class="preview-row">
            <div>
              <tulpar-text-input-ng
                label="maskEmit=raw"
                mask="999-999"
                maskEmit="raw"
                [value]="maskRaw()"
                (valueChange)="maskRaw.set($event)"
              ></tulpar-text-input-ng>
              <p class="value-display">raw = "{{ maskRaw() }}"</p>
            </div>
            <div>
              <tulpar-text-input-ng
                label="maskEmit=masked (default)"
                mask="999-999"
                maskEmit="masked"
                [value]="maskMasked()"
                (valueChange)="maskMasked.set($event)"
              ></tulpar-text-input-ng>
              <p class="value-display">masked = "{{ maskMasked() }}"</p>
            </div>
          </div>

          <div class="preview-row">
            <tulpar-text-input-ng
              label="maskDisplay=eager (default)"
              mask="999-999"
              maskDisplay="eager"
              placeholder="shows placeholder mask on focus"
            ></tulpar-text-input-ng>
            <tulpar-text-input-ng
              label="maskDisplay=lazy"
              mask="999-999"
              maskDisplay="lazy"
              placeholder="mask reveals as you type"
            ></tulpar-text-input-ng>
          </div>

          <tulpar-text-input-ng
            label="Custom slot char ·"
            mask="999-999"
            maskSlotChar="·"
            placeholder="uses · as slot character"
          ></tulpar-text-input-ng>
        </div>
        <pre class="code"><code>{{ masksCode }}</code></pre>
      </section>
    }

    <!-- ── Slots ──────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'slots') {
      <section class="demo-section">
        <h3 class="demo-title">Slots</h3>
        <p class="demo-desc">prefix and suffix slots accept any content. prefix-interactive enables a tabbable / clickable element in the prefix zone.</p>
        <div class="preview preview--col">
          <tulpar-text-input-ng label="Amount (prefix $)">
            <span slot="prefix">$</span>
          </tulpar-text-input-ng>

          <tulpar-text-input-ng label="Domain (suffix .com)">
            <span slot="suffix">.com</span>
          </tulpar-text-input-ng>

          <tulpar-text-input-ng label="Search (prefix-interactive button)" [prefixInteractive]="true">
            <button slot="prefix" type="button" style="padding: 0 8px; cursor:pointer;">Go</button>
          </tulpar-text-input-ng>
        </div>
        <pre class="code"><code>{{ slotsCode }}</code></pre>
      </section>
    }

    <!-- ── States ─────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'states') {
      <section class="demo-section">
        <h3 class="demo-title">States</h3>
        <p class="demo-desc">disabled, readonly, and no-message-space (tight layout — no reserved row below).</p>
        <div class="preview preview--col">
          <tulpar-text-input-ng label="Disabled" [disabled]="true" value="Cannot edit this"></tulpar-text-input-ng>
          <tulpar-text-input-ng label="Readonly" [readonly]="true" value="Read only value"></tulpar-text-input-ng>
          <tulpar-text-input-ng label="No Message Space" [noMessageSpace]="true" placeholder="tight layout — no gap below"></tulpar-text-input-ng>
        </div>
        <pre class="code"><code>{{ statesCode }}</code></pre>
      </section>
    }
  `,
  styles: [`
    :host { display: block; }

    .sub-menu {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 16px 0 24px;
      border-bottom: 1px solid var(--tulpar-color-border-default, #e7e5e4);
      margin-bottom: 32px;
    }

    .sub-btn {
      padding: 6px 14px;
      border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
      border-radius: 20px;
      background: var(--tulpar-color-bg-elevated, #ffffff);
      color: var(--tulpar-color-text-secondary, #57534e);
      font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
      font-size: 13px;
      cursor: pointer;
      transition: background 0.1s, color 0.1s;
    }

    .sub-btn:hover {
      background: var(--tulpar-color-bg-subtle, #f5f5f4);
      color: var(--tulpar-color-text-primary, #1c1917);
    }

    .sub-btn.active {
      background: var(--tulpar-color-brand-default, #2563eb);
      border-color: var(--tulpar-color-brand-default, #2563eb);
      color: #ffffff;
    }

    .demo-section {
      padding-bottom: 48px;
      margin-bottom: 48px;
      border-bottom: 1px solid var(--tulpar-color-border-default, #e7e5e4);
    }

    .demo-section:last-child {
      border-bottom: none;
    }

    .demo-title {
      margin: 0 0 8px;
      font-family: var(--tulpar-font-family-display, Georgia, serif);
      font-size: 22px;
      font-weight: 600;
      color: var(--tulpar-color-text-primary, #1c1917);
    }

    .demo-desc {
      margin: 0 0 20px;
      font-size: 14px;
      color: var(--tulpar-color-text-secondary, #57534e);
      max-width: 620px;
      line-height: 1.6;
    }

    .demo-note {
      margin: 0 0 8px;
      font-size: 12px;
      font-style: italic;
      color: var(--tulpar-color-text-muted, #78716c);
    }

    .preview {
      background: var(--tulpar-color-bg-subtle, #f5f5f4);
      border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
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
      background: var(--tulpar-color-bg-inverse, #1c1917);
      border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
      border-radius: 0 0 6px 6px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
      font-size: 13px;
      line-height: 1.55;
      color: #e7e5e4;
      white-space: pre;
    }

    .value-display {
      margin: 4px 0 0;
      font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
      font-size: 12px;
      color: var(--tulpar-color-text-secondary, #57534e);
    }
  `],
})
export class TextInputDemoComponent {
  readonly sections = SECTIONS;
  activeSection = signal<string>('all');

  // Two-way bound demo signals
  clearableVal = signal('');
  countVal = signal('');
  maskPhone = signal('');
  maskRaw = signal('');
  maskMasked = signal('');

  // Code snippet references
  readonly typesCode = TYPES_CODE;
  readonly sizesCode = SIZES_CODE;
  readonly variantsCode = VARIANTS_CODE;
  readonly labelPositionsCode = LABEL_POSITIONS_CODE;
  readonly necessityCode = NECESSITY_CODE;
  readonly statusesCode = STATUSES_CODE;
  readonly affordancesCode = AFFORDANCES_CODE;
  readonly masksCode = MASKS_CODE;
  readonly slotsCode = SLOTS_CODE;
  readonly statesCode = STATES_CODE;
}
