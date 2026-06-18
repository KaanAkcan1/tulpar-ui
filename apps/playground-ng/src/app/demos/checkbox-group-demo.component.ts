import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import { TulparCheckboxGroupComponent, TulparCheckboxComponent } from '@tulpar-ui/angular';

// ─── Code snippets ─────────────────────────────────────────────────────────────

const BASIC_CODE = `<tulpar-checkbox-group-ng [(value)]="selected" label="Permissions" name="perms">
  <tulpar-checkbox-ng value="read" label="Read"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="write" label="Write"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="delete" label="Delete"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<!-- Live value: {{ selected() | json }} -->`;

const PROPS_VS_SLOTS_CODE = `<!-- (a) PROP form -->
<tulpar-checkbox-ng value="email" label="Email" description="Product + account email.">
</tulpar-checkbox-ng>

<!-- (b) SLOT form -->
<tulpar-checkbox-ng value="sms">
  <span slot="label">SMS</span>
  <span slot="description">Text messages to your phone.</span>
</tulpar-checkbox-ng>`;

const SIZES_CODE = `<!-- group size propagates to every child checkbox -->
<tulpar-checkbox-group-ng [(value)]="selected" size="xs" label="xs">…</tulpar-checkbox-group-ng>
<tulpar-checkbox-group-ng [(value)]="selected" size="sm" label="sm">…</tulpar-checkbox-group-ng>
<tulpar-checkbox-group-ng [(value)]="selected" size="md" label="md">…</tulpar-checkbox-group-ng>
<tulpar-checkbox-group-ng [(value)]="selected" size="lg" label="lg">…</tulpar-checkbox-group-ng>
<tulpar-checkbox-group-ng [(value)]="selected" size="xl" label="xl">…</tulpar-checkbox-group-ng>`;

const ORIENTATION_CODE = `<!-- Vertical (default) -->
<tulpar-checkbox-group-ng [(value)]="selected" orientation="vertical" label="Vertical">
  <tulpar-checkbox-ng value="read" label="Read"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="write" label="Write"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<!-- Horizontal -->
<tulpar-checkbox-group-ng [(value)]="selected" orientation="horizontal" label="Horizontal">
  <tulpar-checkbox-ng value="js" label="JavaScript"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="ts" label="TypeScript"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const SELECT_ALL_CODE = `// component
readonly all = ['javascript', 'typescript', 'python', 'rust', 'go'];
readonly selected = signal<string[]>(['javascript', 'typescript']);

readonly allSelected = computed(() => this.selected().length === this.all.length);
readonly someSelected = computed(
  () => this.selected().length > 0 && this.selected().length < this.all.length,
);

onSelectAll(e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  this.selected.set(el.checked ? [...this.all] : []);
}

<!-- Parent checkbox lives OUTSIDE the group, derived from the value array -->
<tulpar-checkbox-ng
  [checked]="allSelected()"
  [indeterminate]="someSelected()"
  label="Select all languages"
  (change)="onSelectAll($event)"
></tulpar-checkbox-ng>

<tulpar-checkbox-group-ng [(value)]="selected" name="languages">
  @for (lang of all; track lang) {
    <tulpar-checkbox-ng [value]="lang" [label]="lang"></tulpar-checkbox-ng>
  }
</tulpar-checkbox-group-ng>`;

const GROUP_LABEL_CODE = `<!-- (a) PROP form — group legend via label + description -->
<tulpar-checkbox-group-ng
  [(value)]="selected"
  label="Notification channels"
  description="Pick any channels you want to receive alerts on."
>
  <tulpar-checkbox-ng value="a" label="Email"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="SMS"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<!-- (b) SLOT form -->
<tulpar-checkbox-group-ng [(value)]="selected">
  <span slot="label">Notification channels</span>
  <span slot="description">Pick any channels you want to receive alerts on.</span>
  <tulpar-checkbox-ng value="a" label="Email"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="SMS"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const STATES_CODE = `<!-- Required + invalid -->
<tulpar-checkbox-group-ng
  [required]="true"
  [invalid]="true"
  label="Required selection"
  errorText="Select at least one option."
>
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<!-- Group disabled -->
<tulpar-checkbox-group-ng [(value)]="value" [disabled]="true" label="Disabled group">
  <tulpar-checkbox-ng value="standard" label="Standard"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="express" label="Express"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<!-- Individual item disabled -->
<tulpar-checkbox-group-ng [(value)]="value" label="Item disabled">
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B (locked)" [disabled]="true"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="c" label="Option C"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const CARD_CODE = `<tulpar-checkbox-group-ng [(value)]="selected" orientation="horizontal" label="Add-ons">
  <tulpar-checkbox-ng variant="card" value="analytics" label="Analytics">
    <span slot="description">Usage reports + dashboards</span>
  </tulpar-checkbox-ng>
  <tulpar-checkbox-ng variant="card" value="security" label="Security">
    <span slot="description">SSO, audit logs, 2FA</span>
  </tulpar-checkbox-ng>
  <tulpar-checkbox-ng variant="card" value="support" label="Priority support">
    <span slot="description">24 / 7 dedicated SLA</span>
  </tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const COLOR_CODE = `<!-- Group-level color — bind it -->
<tulpar-checkbox-group-ng [(value)]="selected" [color]="'ulgen'" label="Group color: ulgen">
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<!-- Per-item override -->
<tulpar-checkbox-group-ng [(value)]="selected" [color]="'otuken'" label="Per-item override">
  <tulpar-checkbox-ng value="a" label="Inherits otuken"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" [color]="'kizagan'" label="Overrides to kizagan"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

@Component({
  selector: 'app-checkbox-group-demo',
  standalone: true,
  imports: [TulparCheckboxGroupComponent, TulparCheckboxComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Core</span>
      <h1 class="page-title">CheckboxGroup</h1>
      <p class="page-lede">
        A multi-select fieldset managing a <code class="inline-code">string[]</code> value — two-way
        binding, size propagation, orientation, a select-all parent recipe, group legend in prop and
        slot form, a card grid, group + per-item color, and a live filter panel.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-checkbox-group-ng [(value)]="heroValue" label="Skills" name="hero-skills" size="lg">
          <tulpar-checkbox-ng value="design" label="Design"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="code" label="Code"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="research" label="Research"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="strategy" label="Strategy"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng
          [(value)]="heroValue"
          orientation="horizontal"
          name="hero-skills-h"
          size="lg"
        >
          <tulpar-checkbox-ng value="design" label="Design"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="code" label="Code"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="research" label="Research"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
    </section>

    <!-- ── 1. Basic — array value, live readout ─────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Basic — array value, two-way</h2>
      <p class="section-desc">
        <code class="inline-code">[(value)]</code> binds a
        <code class="inline-code">string[]</code>. Toggle options to see the live array update.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-group-ng [(value)]="basicValue" label="Permissions" name="basic-perms">
          <tulpar-checkbox-ng value="read" label="Read"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="write" label="Write"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="delete" label="Delete"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="admin" label="Admin"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <p class="live-value">
          value: <strong>{{ basicValueJson() }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ basicCode }}</code></pre>
    </section>

    <!-- ── 2. Props vs slots — label & description ──────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Props vs slots — label &amp; description</h2>
      <p class="section-desc">
        Each child <code class="inline-code">tulpar-checkbox-ng</code> accepts
        <code class="inline-code">label</code> / <code class="inline-code">description</code> inputs
        OR <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code>.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <tulpar-checkbox-group-ng [(value)]="propSlotValue" name="ps-prop">
            <tulpar-checkbox-ng value="email" label="Email" description="Product + account email.">
            </tulpar-checkbox-ng>
            <tulpar-checkbox-ng value="push" label="Push" description="Alerts on your devices.">
            </tulpar-checkbox-ng>
          </tulpar-checkbox-group-ng>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <tulpar-checkbox-group-ng [(value)]="propSlotValue" name="ps-slot">
            <tulpar-checkbox-ng value="email">
              <span slot="label">Email</span>
              <span slot="description">Product + account email.</span>
            </tulpar-checkbox-ng>
            <tulpar-checkbox-ng value="push">
              <span slot="label">Push</span>
              <span slot="description">Alerts on your devices.</span>
            </tulpar-checkbox-ng>
          </tulpar-checkbox-group-ng>
        </div>
      </div>
      <pre class="code"><code>{{ propsVsSlotsCode }}</code></pre>
    </section>

    <!-- ── 3. Sizes ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Sizes</h2>
      <p class="section-desc">
        The group <code class="inline-code">size</code> propagates to every child checkbox.
      </p>
      <div class="preview preview--row-gap">
        <tulpar-checkbox-group-ng [(value)]="sizeValue" size="xs" label="xs" name="size-xs">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng [(value)]="sizeValue" size="sm" label="sm" name="size-sm">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng [(value)]="sizeValue" size="md" label="md" name="size-md">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng [(value)]="sizeValue" size="lg" label="lg" name="size-lg">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng [(value)]="sizeValue" size="xl" label="xl" name="size-xl">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 4. Orientation ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Orientation</h2>
      <p class="section-desc">
        <code class="inline-code">orientation="vertical"</code> (default) or
        <code class="inline-code">orientation="horizontal"</code>.
      </p>
      <div class="preview preview--row-gap">
        <tulpar-checkbox-group-ng
          [(value)]="basicValue"
          orientation="vertical"
          label="Vertical"
          name="orient-v"
        >
          <tulpar-checkbox-ng value="read" label="Read"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="write" label="Write"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="delete" label="Delete"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng
          [(value)]="horizontalValue"
          orientation="horizontal"
          label="Horizontal"
          name="orient-h"
        >
          <tulpar-checkbox-ng value="js" label="JavaScript"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="ts" label="TypeScript"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="py" label="Python"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
      <pre class="code"><code>{{ orientationCode }}</code></pre>
    </section>

    <!-- ── 5. Select-all parent recipe ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Select-all parent — indeterminate recipe</h2>
      <p class="section-desc">
        Place an indeterminate <code class="inline-code">tulpar-checkbox-ng</code> <em>outside</em>
        the group, deriving its state from the group's value array via computed. The parent drives
        the whole array; the group drives the parent — wired both directions.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-ng
          [checked]="allFilterSelected()"
          [indeterminate]="someFilterSelected()"
          label="Select all languages"
          (change)="onSelectAllFilter($event)"
        ></tulpar-checkbox-ng>
        <div class="indent-group">
          <tulpar-checkbox-group-ng [(value)]="filterValue" name="lang-filter">
            @for (lang of allFilterOptions; track lang) {
              <tulpar-checkbox-ng [value]="lang" [label]="lang"></tulpar-checkbox-ng>
            }
          </tulpar-checkbox-group-ng>
        </div>
        <p class="live-value">
          Selected ({{ filterValue().length }} / {{ allFilterOptions.length }}):
          <strong>{{ filterValue().join(', ') || '(none)' }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ selectAllCode }}</code></pre>
    </section>

    <!-- ── 6. Group label + description — prop AND slot ─────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Group label + description — prop &amp; slot</h2>
      <p class="section-desc">
        The group legend can be set via <code class="inline-code">label</code> /
        <code class="inline-code">description</code> inputs OR group-level
        <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code>.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <tulpar-checkbox-group-ng
            [(value)]="groupLabelPropValue"
            name="gl-prop"
            label="Notification channels"
            description="Pick any channels you want to receive alerts on."
          >
            <tulpar-checkbox-ng value="a" label="Email"></tulpar-checkbox-ng>
            <tulpar-checkbox-ng value="b" label="SMS"></tulpar-checkbox-ng>
            <tulpar-checkbox-ng value="c" label="Push"></tulpar-checkbox-ng>
          </tulpar-checkbox-group-ng>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <tulpar-checkbox-group-ng [(value)]="groupLabelSlotValue" name="gl-slot">
            <span slot="label">Notification channels</span>
            <span slot="description">Pick any channels you want to receive alerts on.</span>
            <tulpar-checkbox-ng value="a" label="Email"></tulpar-checkbox-ng>
            <tulpar-checkbox-ng value="b" label="SMS"></tulpar-checkbox-ng>
            <tulpar-checkbox-ng value="c" label="Push"></tulpar-checkbox-ng>
          </tulpar-checkbox-group-ng>
        </div>
      </div>
      <pre class="code"><code>{{ groupLabelCode }}</code></pre>
    </section>

    <!-- ── 7. States ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. States</h2>
      <p class="section-desc">
        Required + invalid with <code class="inline-code">errorText</code>, group-level disabled,
        and per-item disabled.
      </p>
      <div class="preview preview--row-gap">
        <tulpar-checkbox-group-ng
          [(value)]="statesInvalidValue"
          [required]="true"
          [invalid]="true"
          label="Required selection"
          errorText="Select at least one option."
          name="states-invalid"
        >
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="c" label="Option C"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>

        <tulpar-checkbox-group-ng
          [(value)]="disabledGroupValue"
          [disabled]="true"
          label="Disabled group"
          name="states-disabled"
        >
          <tulpar-checkbox-ng value="standard" label="Standard"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="express" label="Express"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="overnight" label="Overnight"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>

        <tulpar-checkbox-group-ng
          [(value)]="itemDisabledValue"
          label="Item disabled"
          name="states-item"
        >
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B (locked)" [disabled]="true">
          </tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="c" label="Option C"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 8. Card grid ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Card variant grid</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> on each child renders clickable card tiles —
        good for add-on or feature-column selection.
      </p>
      <div class="preview">
        <tulpar-checkbox-group-ng
          [(value)]="cardValue"
          orientation="horizontal"
          label="Add-ons"
          name="card-addons"
        >
          <tulpar-checkbox-ng variant="card" value="analytics" label="Analytics">
            <span slot="description">Usage reports + dashboards</span>
          </tulpar-checkbox-ng>
          <tulpar-checkbox-ng variant="card" value="security" label="Security">
            <span slot="description">SSO, audit logs, 2FA</span>
          </tulpar-checkbox-ng>
          <tulpar-checkbox-ng variant="card" value="support" label="Priority support">
            <span slot="description">24 / 7 dedicated SLA</span>
          </tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
      <pre class="code"><code>{{ cardCode }}</code></pre>
    </section>

    <!-- ── 9. Color — group + per-item ──────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Color — group + per-item override</h2>
      <p class="section-desc">
        Bind <code class="inline-code">[color]</code> on the group to set the checked-fill for all
        children, or on a single <code class="inline-code">tulpar-checkbox-ng</code> to override
        one.
      </p>
      <div class="preview preview--row-gap">
        <tulpar-checkbox-group-ng
          [(value)]="colorGroupValue"
          [color]="'ulgen'"
          label="Group: ulgen"
          name="c-ulgen"
        >
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng
          [(value)]="colorGroupValue"
          [color]="'kizagan'"
          label="Group: kizagan"
          name="c-kizagan"
        >
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng
          [(value)]="colorPerItemValue"
          [color]="'otuken'"
          label="Per-item override"
          name="c-override"
        >
          <tulpar-checkbox-ng value="a" label="Inherits otuken"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" [color]="'kizagan'" label="Overrides to kizagan">
          </tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 10. In context — filter panel ────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — multi-select filter panel</h2>
      <p class="section-desc">
        A sidebar filter with a select-all parent, a live selected count, and a clear-all action —
        all wired to one array.
      </p>
      <div class="composition">
        <div class="filter-panel">
          <div class="filter-header">
            <span class="filter-title">Filters</span>
            <button
              type="button"
              class="filter-clear"
              [disabled]="panelValue().length === 0"
              (click)="panelValue.set([])"
            >
              Clear all
            </button>
          </div>

          <div class="filter-section">
            <div class="filter-section-head">
              <tulpar-checkbox-ng
                [checked]="panelAll()"
                [indeterminate]="panelSome()"
                label="Frameworks"
                size="sm"
                (change)="onPanelSelectAll($event)"
              ></tulpar-checkbox-ng>
            </div>
            <div class="filter-options">
              <tulpar-checkbox-group-ng [(value)]="panelValue" name="filter-fw" size="sm">
                @for (fw of frameworkOptions; track fw) {
                  <tulpar-checkbox-ng [value]="fw" [label]="fw"></tulpar-checkbox-ng>
                }
              </tulpar-checkbox-group-ng>
            </div>
          </div>

          <div class="filter-footer">
            <span class="filter-count">
              {{ panelValue().length }} framework{{ panelValue().length !== 1 ? 's' : '' }} selected
            </span>
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

      .indent-group {
        padding-left: 24px;
        border-left: 2px solid var(--tulpar-color-border-default, #d9e0df);
        margin-left: 4px;
      }

      .composition {
        display: flex;
      }

      .filter-panel {
        width: 260px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
        overflow: hidden;
      }

      .filter-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .filter-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .filter-clear {
        padding: 3px 8px;
        border: none;
        border-radius: 4px;
        background: transparent;
        font-size: 12px;
        color: var(--tulpar-color-text-muted, #74777a);
        cursor: pointer;
      }

      .filter-clear:not(:disabled):hover {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .filter-clear:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .filter-section {
        padding: 14px 16px;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .filter-section-head {
        margin-bottom: 10px;
      }

      .filter-options {
        padding-left: 20px;
      }

      .filter-footer {
        padding: 12px 16px;
      }

      .filter-count {
        font-size: 12px;
        color: var(--tulpar-color-text-muted, #74777a);
      }
    `,
  ],
})
export class CheckboxGroupDemoComponent {
  // ── State ──────────────────────────────────────────────────────────────────
  readonly heroValue = signal<string[]>(['design', 'code']);
  readonly basicValue = signal<string[]>(['read']);
  readonly propSlotValue = signal<string[]>(['email']);
  readonly sizeValue = signal<string[]>(['a']);
  readonly horizontalValue = signal<string[]>(['js']);
  readonly groupLabelPropValue = signal<string[]>(['a']);
  readonly groupLabelSlotValue = signal<string[]>(['a']);
  readonly statesInvalidValue = signal<string[]>([]);
  readonly disabledGroupValue = signal<string[]>(['standard']);
  readonly itemDisabledValue = signal<string[]>(['a']);
  readonly cardValue = signal<string[]>(['analytics', 'security']);
  readonly colorGroupValue = signal<string[]>(['a', 'b']);
  readonly colorPerItemValue = signal<string[]>(['a', 'b']);

  readonly basicValueJson = computed(() => JSON.stringify(this.basicValue()));

  // ── Select-all outside the group ────────────────────────────────────────────
  readonly allFilterOptions = ['javascript', 'typescript', 'python', 'rust', 'go'];
  readonly filterValue = signal<string[]>(['javascript', 'typescript']);
  readonly allFilterSelected = computed(
    () => this.filterValue().length === this.allFilterOptions.length,
  );
  readonly someFilterSelected = computed(
    () => this.filterValue().length > 0 && this.filterValue().length < this.allFilterOptions.length,
  );

  onSelectAllFilter(e: Event): void {
    const el = e.target as HTMLElement & { checked: boolean };
    this.filterValue.set(el.checked ? [...this.allFilterOptions] : []);
  }

  // ── In-context filter panel ─────────────────────────────────────────────────
  readonly frameworkOptions = ['react', 'vue', 'svelte', 'angular'];
  readonly panelValue = signal<string[]>(['vue']);
  readonly panelAll = computed(() => this.panelValue().length === this.frameworkOptions.length);
  readonly panelSome = computed(
    () => this.panelValue().length > 0 && this.panelValue().length < this.frameworkOptions.length,
  );

  onPanelSelectAll(e: Event): void {
    const el = e.target as HTMLElement & { checked: boolean };
    this.panelValue.set(el.checked ? [...this.frameworkOptions] : []);
  }

  // ── Code snippets ───────────────────────────────────────────────────────────
  readonly basicCode = BASIC_CODE;
  readonly propsVsSlotsCode = PROPS_VS_SLOTS_CODE;
  readonly sizesCode = SIZES_CODE;
  readonly orientationCode = ORIENTATION_CODE;
  readonly selectAllCode = SELECT_ALL_CODE;
  readonly groupLabelCode = GROUP_LABEL_CODE;
  readonly statesCode = STATES_CODE;
  readonly cardCode = CARD_CODE;
  readonly colorCode = COLOR_CODE;
}
