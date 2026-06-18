import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  signal,
} from '@angular/core';
import { TulparCheckboxComponent } from '@tulpar-ui/angular';
import { LucideAngularModule, Star } from 'lucide-angular';

// ─── Icon component for [icon] (named-component prop form) ──
@Component({
  selector: 'app-star-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-angular [img]="iconData" [size]="size()"></lucide-angular>`,
})
class AppStarIcon {
  readonly iconData = Star;
  size = input(12);
}

type Resource = 'users' | 'content' | 'billing';

// ─── Code snippets ─────────────────────────────────────────────────────────────

const SIZES_CODE = `<tulpar-checkbox-ng size="xs" [checked]="true" label="Extra small"></tulpar-checkbox-ng>
<tulpar-checkbox-ng size="sm" [checked]="true" label="Small"></tulpar-checkbox-ng>
<tulpar-checkbox-ng size="md" [checked]="true" label="Medium (default)"></tulpar-checkbox-ng>
<tulpar-checkbox-ng size="lg" [checked]="true" label="Large"></tulpar-checkbox-ng>
<tulpar-checkbox-ng size="xl" [checked]="true" label="Extra large"></tulpar-checkbox-ng>`;

const PROPS_VS_SLOTS_CODE = `<!-- (a) PROP form -->
<tulpar-checkbox-ng
  [checked]="true"
  label="Remember me"
  description="Stay signed in for 30 days on this device."
></tulpar-checkbox-ng>

<!-- (b) SLOT form -->
<tulpar-checkbox-ng [checked]="true">
  <span slot="label">Remember me</span>
  <span slot="description">Stay signed in for 30 days on this device.</span>
</tulpar-checkbox-ng>`;

const STATES_CODE = `<tulpar-checkbox-ng [checked]="true" label="Checked"></tulpar-checkbox-ng>
<tulpar-checkbox-ng [disabled]="true" label="Disabled"></tulpar-checkbox-ng>
<tulpar-checkbox-ng [checked]="true" [disabled]="true" label="Disabled checked"></tulpar-checkbox-ng>
<tulpar-checkbox-ng [checked]="true" [readonly]="true" label="Readonly"></tulpar-checkbox-ng>
<tulpar-checkbox-ng
  [required]="true"
  [invalid]="true"
  label="Accept terms"
  errorText="You must accept the terms to continue."
></tulpar-checkbox-ng>`;

const INDETERMINATE_CODE = `// component
readonly items = ['read', 'write', 'delete', 'admin'];
readonly selected = signal<string[]>(['read', 'write']);

readonly allSelected = computed(() => this.selected().length === this.items.length);
readonly someSelected = computed(
  () => this.selected().length > 0 && this.selected().length < this.items.length,
);

onSelectAll(e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  this.selected.set(el.checked ? [...this.items] : []);
}

onItemChange(item: string, e: Event) {
  const el = e.target as HTMLElement & { checked: boolean };
  this.selected.update((s) => (el.checked ? [...s, item] : s.filter((v) => v !== item)));
}

<!-- Parent — indeterminate when some (but not all) are selected -->
<tulpar-checkbox-ng
  [checked]="allSelected()"
  [indeterminate]="someSelected()"
  label="Select all"
  (change)="onSelectAll($event)"
></tulpar-checkbox-ng>

<!-- Children -->
@for (item of items; track item) {
  <tulpar-checkbox-ng
    [checked]="selected().includes(item)"
    [label]="item"
    (change)="onItemChange(item, $event)"
  ></tulpar-checkbox-ng>
}`;

const ICON_PROP_CODE = `<!-- Custom check glyph via PROP — pass a component class -->
@Component({
  selector: 'app-star-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: \`<lucide-angular [img]="iconData" [size]="size()"></lucide-angular>\`,
})
class AppStarIcon { readonly iconData = Star; size = input(12); }

<tulpar-checkbox-ng [checked]="true" [icon]="AppStarIcon" label="Star (prop)"></tulpar-checkbox-ng>

<!-- The indeterminate dash is NEVER overridden by a custom icon -->
<tulpar-checkbox-ng
  [indeterminate]="true"
  [icon]="AppStarIcon"
  label="Indeterminate"
></tulpar-checkbox-ng>`;

const ICON_SLOT_CODE = `<!-- Custom check glyph via SLOT — any SVG (here a heart) -->
<tulpar-checkbox-ng [checked]="true" label="Heart (slot)">
  <svg slot="icon" viewBox="0 0 24 24" width="12" height="12"
    fill="currentColor" aria-hidden="true">
    <path d="M12 21s-7.5-4.9-10-9.3C.4 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3
      C17 5 18.6 8.6 17 11.7 14.5 16.1 12 21 12 21z" />
  </svg>
</tulpar-checkbox-ng>`;

const COLOR_CODE = `<tulpar-checkbox-ng [checked]="true" [color]="'ulgen'" label="Ulgen (gold)"></tulpar-checkbox-ng>
<tulpar-checkbox-ng [checked]="true" [color]="'otuken'" label="Otuken (forest)"></tulpar-checkbox-ng>
<tulpar-checkbox-ng [checked]="true" [color]="'kizagan'" label="Kizagan (red)"></tulpar-checkbox-ng>
<tulpar-checkbox-ng [checked]="true" [color]="'kam'" label="Kam (indigo)"></tulpar-checkbox-ng>
<tulpar-checkbox-ng [checked]="true" [color]="'yersu'" label="Yersu (teal)"></tulpar-checkbox-ng>`;

const CARD_VARIANT_CODE = `<tulpar-checkbox-ng
  variant="card"
  [checked]="selected().includes('pro')"
  (change)="onPlanChange('pro', $event)"
>
  <span slot="label">Pro</span>
  <span slot="description">Up to 25 users · 100 GB storage</span>
</tulpar-checkbox-ng>`;

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  // AppStarIcon is rendered dynamically via NgComponentOutlet inside the
  // checkbox wrapper ([icon] class-reference binding).
  imports: [TulparCheckboxComponent, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Core</span>
      <h1 class="page-title">Checkbox</h1>
      <p class="page-lede">
        A boolean selection control — five sizes, label &amp; description in prop and slot form,
        indeterminate select-all, custom check glyph (prop + slot), per-color overrides, and a card
        variant. Works standalone or inside a CheckboxGroup.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-checkbox-ng [checked]="true" size="lg" label="I agree to the terms of service">
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="lg" label="Subscribe to newsletter"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng
          [indeterminate]="true"
          size="lg"
          label="Select all"
        ></tulpar-checkbox-ng>
      </div>
    </section>

    <!-- ── 1. Sizes ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Sizes</h2>
      <p class="section-desc">
        Five sizes: <code class="inline-code">xs</code> through <code class="inline-code">xl</code>.
        Default is <code class="inline-code">md</code>.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-ng size="xs" [checked]="true" label="Extra small"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="sm" [checked]="true" label="Small"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng
          size="md"
          [checked]="true"
          label="Medium (default)"
        ></tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="lg" [checked]="true" label="Large"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="xl" [checked]="true" label="Extra large"></tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 2. Props vs slots — label & description ──────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Props vs slots — label &amp; description</h2>
      <p class="section-desc">
        Use <code class="inline-code">label</code> /
        <code class="inline-code">description</code> inputs for plain text, or
        <code class="inline-code">slot="label"</code> /
        <code class="inline-code">slot="description"</code> for rich content. Both render
        identically.
      </p>
      <div class="preview preview--cols">
        <div class="preview-col">
          <p class="preview-label">Prop form</p>
          <tulpar-checkbox-ng
            [checked]="true"
            label="Remember me"
            description="Stay signed in for 30 days on this device."
          ></tulpar-checkbox-ng>
        </div>
        <div class="preview-col">
          <p class="preview-label">Slot form</p>
          <tulpar-checkbox-ng [checked]="true">
            <span slot="label">Remember me</span>
            <span slot="description">Stay signed in for 30 days on this device.</span>
          </tulpar-checkbox-ng>
        </div>
      </div>
      <pre class="code"><code>{{ propsVsSlotsCode }}</code></pre>
    </section>

    <!-- ── 3. States ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. States</h2>
      <p class="section-desc">
        Checked, disabled, disabled-checked, readonly, required + invalid with
        <code class="inline-code">errorText</code>.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-ng [checked]="true" label="Checked"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng [disabled]="true" label="Disabled"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng [checked]="true" [disabled]="true" label="Disabled checked">
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng
          [checked]="true"
          [readonly]="true"
          label="Readonly"
        ></tulpar-checkbox-ng>
        <tulpar-checkbox-ng
          [required]="true"
          [invalid]="true"
          label="Accept terms"
          errorText="You must accept the terms to continue."
        ></tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 4. Indeterminate + select-all ────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Indeterminate + select-all</h2>
      <p class="section-desc">
        The <code class="inline-code">indeterminate</code> input renders a dash instead of a
        checkmark — for a "select all" parent whose children are partially selected. Wire it via a
        <code class="inline-code">computed</code> checking whether some (but not all) items are
        selected. Toggle the parent to select / clear all.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-ng
          [checked]="allSelected()"
          [indeterminate]="someSelected()"
          label="Select all permissions"
          (change)="onSelectAllChange($event)"
        ></tulpar-checkbox-ng>
        <div class="indent-group">
          @for (item of selectAllItems; track item) {
            <tulpar-checkbox-ng
              [checked]="selectedPermissions().includes(item)"
              [label]="item"
              (change)="onItemChange(item, $event)"
            ></tulpar-checkbox-ng>
          }
        </div>
        <p class="live-value">
          Selected: <strong>{{ selectedPermissions().join(', ') || '(none)' }}</strong>
        </p>
      </div>
      <pre class="code"><code>{{ indeterminateCode }}</code></pre>
    </section>

    <!-- ── 5. Custom icon — prop form ───────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Custom check glyph — prop form</h2>
      <p class="section-desc">
        Pass a component class to <code class="inline-code">[icon]</code> to replace the default
        checkmark. The <code class="inline-code">indeterminate</code> dash is never overridden by a
        custom icon.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-ng [checked]="true" [icon]="AppStarIcon" label="Star (prop)">
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng [checked]="true" size="lg" [icon]="AppStarIcon" label="Star large">
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng
          [indeterminate]="true"
          [icon]="AppStarIcon"
          label="Indeterminate keeps the dash"
        ></tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ iconPropCode }}</code></pre>
    </section>

    <!-- ── 6. Custom icon — slot form ───────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Custom check glyph — slot form</h2>
      <p class="section-desc">
        The same swap via <code class="inline-code">slot="icon"</code> — the escape hatch for any
        SVG or non-Lucide icon. Here, a filled heart.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-ng [checked]="true" label="Heart (slot)">
          <svg
            slot="icon"
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 21s-7.5-4.9-10-9.3C.4 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3C17 5 18.6 8.6 17 11.7 14.5 16.1 12 21 12 21z"
            />
          </svg>
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng [checked]="true" size="lg" label="Heart large (slot)">
          <svg
            slot="icon"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 21s-7.5-4.9-10-9.3C.4 8.6 2 5 5.5 5c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3C17 5 18.6 8.6 17 11.7 14.5 16.1 12 21 12 21z"
            />
          </svg>
        </tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ iconSlotCode }}</code></pre>
    </section>

    <!-- ── 7. Color ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Color</h2>
      <p class="section-desc">
        Bind <code class="inline-code">[color]</code> to override the checked-fill with any
        design-system palette value.
      </p>
      <div class="preview">
        <tulpar-checkbox-ng [checked]="true" [color]="'ulgen'" label="Ulgen (gold)">
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng [checked]="true" [color]="'otuken'" label="Otuken (forest)">
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng [checked]="true" [color]="'kizagan'" label="Kizagan (red)">
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng [checked]="true" [color]="'kam'" label="Kam (indigo)">
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng [checked]="true" [color]="'yersu'" label="Yersu (teal)">
        </tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 8. Card variant ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Card variant</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> wraps the checkbox and its label in a
        clickable card surface — selected cards are tinted with a brand border. Great for plan
        pickers and feature toggles.
      </p>
      <div class="preview">
        <div class="card-grid">
          <tulpar-checkbox-ng
            variant="card"
            [checked]="selectedPlans().includes('starter')"
            (change)="onPlanChange('starter', $event)"
          >
            <span slot="label">Starter</span>
            <span slot="description">Up to 5 users · 10 GB storage</span>
          </tulpar-checkbox-ng>
          <tulpar-checkbox-ng
            variant="card"
            [checked]="selectedPlans().includes('pro')"
            (change)="onPlanChange('pro', $event)"
          >
            <span slot="label">Pro</span>
            <span slot="description">Up to 25 users · 100 GB storage</span>
          </tulpar-checkbox-ng>
          <tulpar-checkbox-ng
            variant="card"
            [checked]="selectedPlans().includes('enterprise')"
            (change)="onPlanChange('enterprise', $event)"
          >
            <span slot="label">Enterprise</span>
            <span slot="description">Unlimited users · 1 TB storage</span>
          </tulpar-checkbox-ng>
        </div>
      </div>
      <pre class="code"><code>{{ cardVariantCode }}</code></pre>
    </section>

    <!-- ── 9. In context — permissions matrix ───────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — permissions matrix</h2>
      <p class="section-desc">
        A role editor — each resource has a select-all parent (indeterminate when partially
        selected) plus a CRUD checkbox per action. Toggle a parent to flip the whole row.
      </p>
      <div class="composition">
        <div class="permissions-card">
          <table class="permissions-table">
            <thead>
              <tr>
                <th class="perm-resource">Resource</th>
                <th>All</th>
                <th>Create</th>
                <th>Read</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              @for (resource of resources; track resource) {
                <tr>
                  <td class="perm-resource-name">{{ resource }}</td>
                  <td>
                    <tulpar-checkbox-ng
                      [checked]="groupAll(resource)"
                      [indeterminate]="groupSome(resource)"
                      [noMessageSpace]="true"
                      size="sm"
                      (change)="onGroupSelectAll(resource, $event)"
                    ></tulpar-checkbox-ng>
                  </td>
                  @for (action of actions; track action) {
                    <td>
                      <tulpar-checkbox-ng
                        [checked]="permissionGroups()[resource][action]"
                        [noMessageSpace]="true"
                        size="sm"
                        (change)="onActionChange(resource, action, $event)"
                      ></tulpar-checkbox-ng>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
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
        gap: 12px 24px;
        align-items: center;
      }

      .preview--col {
        flex-direction: column;
        align-items: flex-start;
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

      .indent-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-left: 24px;
        border-left: 2px solid var(--tulpar-color-border-default, #d9e0df);
        margin-left: 4px;
      }

      .live-value {
        margin: 4px 0 0;
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 12px;
        width: 100%;
      }

      .composition {
        display: flex;
      }

      .permissions-card {
        flex: 1;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
        overflow: hidden;
      }

      .permissions-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }

      .permissions-table th {
        padding: 12px 16px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--tulpar-color-text-muted, #74777a);
        text-align: center;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
      }

      .perm-resource {
        text-align: left !important;
      }

      .permissions-table td {
        padding: 12px 16px;
        text-align: center;
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .permissions-table tr:last-child td {
        border-bottom: none;
      }

      .perm-resource-name {
        text-align: left;
        font-weight: 500;
        color: var(--tulpar-color-text-primary, #15110b);
        text-transform: capitalize;
      }
    `,
  ],
})
export class CheckboxDemoComponent {
  // ── Select-all demo ─────────────────────────────────────────────────────────
  readonly selectAllItems = ['read', 'write', 'delete', 'admin'];
  readonly selectedPermissions = signal<string[]>(['read', 'write']);

  readonly allSelected = computed(
    () => this.selectedPermissions().length === this.selectAllItems.length,
  );
  readonly someSelected = computed(
    () =>
      this.selectedPermissions().length > 0 &&
      this.selectedPermissions().length < this.selectAllItems.length,
  );

  onSelectAllChange(e: Event): void {
    const el = e.target as HTMLElement & { checked: boolean };
    this.selectedPermissions.set(el.checked ? [...this.selectAllItems] : []);
  }

  onItemChange(item: string, e: Event): void {
    const el = e.target as HTMLElement & { checked: boolean };
    this.selectedPermissions.update((s) =>
      el.checked ? [...s, item] : s.filter((v) => v !== item),
    );
  }

  // ── Card variant grid ───────────────────────────────────────────────────────
  readonly selectedPlans = signal<string[]>(['pro']);

  onPlanChange(plan: string, e: Event): void {
    const el = e.target as HTMLElement & { checked: boolean };
    this.selectedPlans.update((s) => (el.checked ? [...s, plan] : s.filter((v) => v !== plan)));
  }

  // ── Permissions matrix ──────────────────────────────────────────────────────
  readonly resources: Resource[] = ['users', 'content', 'billing'];
  readonly actions = ['create', 'read', 'update', 'delete'] as const;
  readonly permissionGroups = signal<Record<Resource, Record<string, boolean>>>({
    users: { create: true, read: true, update: false, delete: false },
    content: { create: true, read: true, update: true, delete: false },
    billing: { create: false, read: true, update: false, delete: false },
  });

  groupAll(resource: Resource): boolean {
    const g = this.permissionGroups()[resource];
    return this.actions.every((a) => g[a]);
  }

  groupSome(resource: Resource): boolean {
    const g = this.permissionGroups()[resource];
    const vals = this.actions.map((a) => g[a]);
    return vals.some(Boolean) && !vals.every(Boolean);
  }

  onGroupSelectAll(resource: Resource, e: Event): void {
    const el = e.target as HTMLElement & { checked: boolean };
    this.permissionGroups.update((groups) => {
      const next = { ...groups, [resource]: { ...groups[resource] } };
      for (const a of this.actions) next[resource][a] = el.checked;
      return next;
    });
  }

  onActionChange(resource: Resource, action: string, e: Event): void {
    const el = e.target as HTMLElement & { checked: boolean };
    this.permissionGroups.update((groups) => {
      const next = { ...groups, [resource]: { ...groups[resource] } };
      next[resource][action] = el.checked;
      return next;
    });
  }

  // ── Named icon component for [icon] ─────────────────────────────────────────
  protected readonly AppStarIcon = AppStarIcon;

  // ── Code snippets ───────────────────────────────────────────────────────────
  readonly sizesCode = SIZES_CODE;
  readonly propsVsSlotsCode = PROPS_VS_SLOTS_CODE;
  readonly statesCode = STATES_CODE;
  readonly indeterminateCode = INDETERMINATE_CODE;
  readonly iconPropCode = ICON_PROP_CODE;
  readonly iconSlotCode = ICON_SLOT_CODE;
  readonly colorCode = COLOR_CODE;
  readonly cardVariantCode = CARD_VARIANT_CODE;
}
