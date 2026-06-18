import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import { TulparCheckboxGroupComponent, TulparCheckboxComponent } from '@tulpar-ui/angular';

// ─── Code snippets ─────────────────────────────────────────────────────────────

const BASIC_CODE = `selected = signal<string[]>(['typescript', 'angular']);

<tulpar-checkbox-group-ng
  label="Tech stack"
  name="tech"
  [(value)]="selected"
>
  <tulpar-checkbox-ng value="typescript" label="TypeScript"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="angular"    label="Angular"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="vue"        label="Vue"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="react"      label="React"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const SIZES_CODE = `<tulpar-checkbox-group-ng size="xs" label="XS" name="sz-xs">
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<tulpar-checkbox-group-ng size="md" label="MD (default)" name="sz-md">
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<tulpar-checkbox-group-ng size="xl" label="XL" name="sz-xl">
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const ORIENTATION_CODE = `<!-- Vertical (default) -->
<tulpar-checkbox-group-ng orientation="vertical" label="Vertical" name="or-v">
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="c" label="Option C"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<!-- Horizontal -->
<tulpar-checkbox-group-ng orientation="horizontal" label="Horizontal" name="or-h">
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="c" label="Option C"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const ARRAY_VALUE_CODE = `selected = signal<string[]>(['typescript']);

// The group change event emits CustomEvent<{ value: string[] }>
// Two-way [(value)] keeps the signal in sync automatically.

<tulpar-checkbox-group-ng
  name="stack"
  label="Frameworks"
  [(value)]="selected"
>
  <tulpar-checkbox-ng value="typescript" label="TypeScript"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="angular"    label="Angular"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="vue"        label="Vue"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>

<p>Selected: {{ selected().join(', ') }}</p>`;

const SELECT_ALL_CODE = `// Parent checkbox lives outside the group and drives the array:
allTags = ['Design', 'Engineering', 'Product', 'Marketing'];
selectedTags = signal<string[]>([]);

parentChecked   = computed(() => this.selectedTags().length === this.allTags.length);
parentIndet     = computed(() =>
  this.selectedTags().length > 0 && this.selectedTags().length < this.allTags.length
);

onSelectAll(e: Event) {
  this.selectedTags.set(this.parentChecked() ? [] : [...this.allTags]);
}

// Template:
<tulpar-checkbox-ng
  label="Select all"
  [checked]="parentChecked()"
  [indeterminate]="parentIndet()"
  (change)="onSelectAll($event)"
></tulpar-checkbox-ng>

<tulpar-checkbox-group-ng name="tags" [(value)]="selectedTags">
  @for (tag of allTags; track tag) {
    <tulpar-checkbox-ng [value]="tag" [label]="tag"></tulpar-checkbox-ng>
  }
</tulpar-checkbox-group-ng>`;

const CARD_GRID_CODE = `<tulpar-checkbox-group-ng name="features" orientation="horizontal" [(value)]="features">
  <tulpar-checkbox-ng value="analytics" variant="card" label="Analytics">
    <span slot="description">Real-time usage dashboards</span>
  </tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="api" variant="card" label="API Access">
    <span slot="description">RESTful + GraphQL endpoints</span>
  </tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="sso" variant="card" label="SSO">
    <span slot="description">SAML 2.0 and OIDC providers</span>
  </tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="audit" variant="card" label="Audit Logs">
    <span slot="description">Full activity log export</span>
  </tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const COLORS_CODE = `<tulpar-checkbox-group-ng name="colors-grp" label="Group color (kizagan)" color="kizagan"
  [value]="['a', 'b']">
  <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
</tulpar-checkbox-group-ng>`;

const FILTER_CODE = `// Multi-select filter with live count
allCategories = ['JavaScript', 'TypeScript', 'CSS', 'Accessibility', 'Performance', 'Testing'];
activeFilters = signal<string[]>([]);
filteredCount = computed(() =>
  this.activeFilters().length === 0
    ? this.allCategories.length
    : this.activeFilters().length
);`;

@Component({
  selector: 'app-checkbox-group-demo',
  standalone: true,
  imports: [TulparCheckboxGroupComponent, TulparCheckboxComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Selection</span>
      <h1 class="page-title">Checkbox Group</h1>
      <p class="page-lede">
        A managed group of checkboxes with array two-way binding — vertical/horizontal layout, card
        grid variant, select-all pattern, and signal-driven live value.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-checkbox-group-ng
          label="Notification channels"
          name="hero-notif"
          [(value)]="heroSelected"
          size="lg"
        >
          <tulpar-checkbox-ng value="email" label="Email"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="push" label="Push"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="sms" label="SMS"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="slack" label="Slack"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <p class="hero-value">
          Selected: <strong>{{ heroSelected().join(', ') || '(none)' }}</strong>
        </p>
      </div>
    </section>

    <!-- ── 1. Array two-way binding ───────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Array two-way binding</h2>
      <p class="section-desc">
        Use <code class="inline-code">[(value)]</code> with a
        <code class="inline-code">signal&lt;string[]&gt;</code>. The group's
        <code class="inline-code">change</code> event emits
        <code class="inline-code">CustomEvent&lt;&#123; value: string[] &#125;&gt;</code> and keeps
        the signal in sync automatically.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-group-ng label="Tech stack" name="tech" [(value)]="techSelected">
          <tulpar-checkbox-ng value="typescript" label="TypeScript"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="angular" label="Angular"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="vue" label="Vue"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="react" label="React"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <p class="status-feedback">Value: [{{ techSelected().join(', ') }}]</p>
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
        <tulpar-checkbox-group-ng size="xs" label="XS" name="sz-xs">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng size="sm" label="SM" name="sz-sm">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng size="md" label="MD" name="sz-md">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng size="lg" label="LG" name="sz-lg">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng size="xl" label="XL" name="sz-xl">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 3. Orientation ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Orientation — vertical / horizontal</h2>
      <p class="section-desc">
        <code class="inline-code">vertical</code> (default) stacks checkboxes.
        <code class="inline-code">horizontal</code> lays them in a row.
      </p>
      <div class="preview preview--row">
        <tulpar-checkbox-group-ng orientation="vertical" label="Vertical" name="or-v">
          <tulpar-checkbox-ng value="a" label="Option A" [checked]="true"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="c" label="Option C"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng orientation="horizontal" label="Horizontal" name="or-h">
          <tulpar-checkbox-ng value="a" label="Option A" [checked]="true"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="c" label="Option C"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
      <pre class="code"><code>{{ orientationCode }}</code></pre>
    </section>

    <!-- ── 4. Select-all parent recipe ────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Select-all parent recipe</h2>
      <p class="section-desc">
        A standalone <code class="inline-code">tulpar-checkbox-ng</code> outside the group acts as
        the "select all" parent. Its <code class="inline-code">indeterminate</code> state is derived
        from the array signal with <code class="inline-code">computed()</code> — no RxJS.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-ng
          label="Select all tags"
          [checked]="allTagsChecked()"
          [indeterminate]="someTagsChecked()"
          (change)="onSelectAllTags($event)"
        ></tulpar-checkbox-ng>
        <tulpar-checkbox-group-ng name="tags-grp" [(value)]="selectedTags">
          @for (tag of allTags; track tag) {
            <tulpar-checkbox-ng [value]="tag" [label]="tag"></tulpar-checkbox-ng>
          }
        </tulpar-checkbox-group-ng>
        <p class="status-feedback">
          {{ selectedTags().length }} / {{ allTags.length }} selected:
          {{ selectedTags().join(', ') || '(none)' }}
        </p>
      </div>
      <pre class="code"><code>{{ selectAllCode }}</code></pre>
    </section>

    <!-- ── 5. Card grid variant ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Card grid variant</h2>
      <p class="section-desc">
        Combine <code class="inline-code">variant="card"</code> on individual checkboxes with
        <code class="inline-code">orientation="horizontal"</code> on the group for a feature /
        add-on picker grid.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-group-ng
          name="features"
          orientation="horizontal"
          [(value)]="featuresSelected"
        >
          <tulpar-checkbox-ng value="analytics" variant="card" label="Analytics">
            <span slot="description">Real-time usage dashboards</span>
          </tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="api" variant="card" label="API Access">
            <span slot="description">RESTful + GraphQL endpoints</span>
          </tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="sso" variant="card" label="SSO">
            <span slot="description">SAML 2.0 and OIDC providers</span>
          </tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="audit" variant="card" label="Audit Logs">
            <span slot="description">Full activity log export</span>
          </tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <p class="status-feedback">Add-ons: {{ featuresSelected().join(', ') || '(none)' }}</p>
      </div>
      <pre class="code"><code>{{ cardGridCode }}</code></pre>
    </section>

    <!-- ── 6. Color ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Color</h2>
      <p class="section-desc">Override the checkbox accent at the group level.</p>
      <div class="preview preview--row">
        <tulpar-checkbox-group-ng name="col-default" label="Default brand" [value]="['a']">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng
          name="col-kizagan"
          label="Kizagan"
          color="kizagan"
          [value]="['a']"
        >
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
        <tulpar-checkbox-group-ng name="col-kam" label="Kam" color="kam" [value]="['a']">
          <tulpar-checkbox-ng value="a" label="Option A"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng value="b" label="Option B"></tulpar-checkbox-ng>
        </tulpar-checkbox-group-ng>
      </div>
      <pre class="code"><code>{{ colorsCode }}</code></pre>
    </section>

    <!-- ── 7. In context — blog post filter ───────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — multi-select category filter</h2>
      <p class="section-desc">
        A filter panel where the checkbox group drives a live article count. Selecting categories
        narrows the result set; the count badge updates reactively.
      </p>
      <div class="composition">
        <div class="filter-panel">
          <div class="filter-header">
            <p class="filter-title">Filter by category</p>
            @if (activeFilters().length > 0) {
              <button class="filter-clear" type="button" (click)="activeFilters.set([])">
                Clear all
              </button>
            }
          </div>
          <tulpar-checkbox-group-ng
            name="cat-filter"
            orientation="vertical"
            [(value)]="activeFilters"
          >
            @for (cat of allCategories; track cat) {
              <tulpar-checkbox-ng [value]="cat" [label]="cat"></tulpar-checkbox-ng>
            }
          </tulpar-checkbox-group-ng>
          <div class="filter-footer">
            <span class="filter-count-badge">
              {{ filteredCount() }} {{ filteredCount() === 1 ? 'category' : 'categories' }} shown
            </span>
          </div>
        </div>
        <div class="filter-results">
          <p class="results-label">Articles matching selection</p>
          @if (activeFilters().length === 0) {
            <p class="results-hint">All {{ allCategories.length }} categories selected</p>
          } @else {
            @for (cat of activeFilters(); track cat) {
              <div class="result-item">{{ cat }}</div>
            }
          }
        </div>
      </div>
      <pre class="code"><code>{{ filterCode }}</code></pre>
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

      /* ── Composition ────────────────────────────────────────────────── */
      .composition {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        align-items: flex-start;
      }

      .filter-panel {
        flex: 0 0 220px;
        padding: 16px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
      }

      .filter-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }

      .filter-title {
        margin: 0;
        font-size: 13px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .filter-clear {
        padding: 2px 8px;
        border: none;
        border-radius: 4px;
        background: transparent;
        color: var(--tulpar-color-brand-default, #00c57a);
        font-size: 12px;
        cursor: pointer;
        font-family: inherit;
      }

      .filter-clear:hover {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
      }

      .filter-footer {
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .filter-count-badge {
        font-size: 12px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .filter-results {
        flex: 1;
        min-width: 200px;
        padding: 16px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
      }

      .results-label {
        margin: 0 0 12px;
        font-size: 13px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .results-hint {
        margin: 0;
        font-size: 13px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .result-item {
        padding: 8px 0;
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #57534e);
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .result-item:last-child {
        border-bottom: none;
      }
    `,
  ],
})
export class CheckboxGroupDemoComponent {
  // ── Hero demo ───────────────────────────────────────────────────────────────
  readonly heroSelected = signal<string[]>(['email', 'slack']);

  // ── Array binding demo ──────────────────────────────────────────────────────
  readonly techSelected = signal<string[]>(['typescript', 'angular']);

  // ── Select-all parent recipe ────────────────────────────────────────────────
  readonly allTags = ['Design', 'Engineering', 'Product', 'Marketing', 'Data'];
  readonly selectedTags = signal<string[]>(['Design', 'Engineering']);

  readonly allTagsChecked = computed(() => this.selectedTags().length === this.allTags.length);
  readonly someTagsChecked = computed(
    () => this.selectedTags().length > 0 && this.selectedTags().length < this.allTags.length,
  );

  onSelectAllTags(_e: Event): void {
    this.selectedTags.set(this.allTagsChecked() ? [] : [...this.allTags]);
  }

  // ── Card grid demo ──────────────────────────────────────────────────────────
  readonly featuresSelected = signal<string[]>(['analytics', 'api']);

  // ── Filter composition ──────────────────────────────────────────────────────
  readonly allCategories = [
    'JavaScript',
    'TypeScript',
    'CSS',
    'Accessibility',
    'Performance',
    'Testing',
  ];
  readonly activeFilters = signal<string[]>([]);

  readonly filteredCount = computed(() =>
    this.activeFilters().length === 0 ? this.allCategories.length : this.activeFilters().length,
  );

  // ── Code snippets ───────────────────────────────────────────────────────────
  readonly basicCode = BASIC_CODE;
  readonly sizesCode = SIZES_CODE;
  readonly orientationCode = ORIENTATION_CODE;
  readonly arrayValueCode = ARRAY_VALUE_CODE;
  readonly selectAllCode = SELECT_ALL_CODE;
  readonly cardGridCode = CARD_GRID_CODE;
  readonly colorsCode = COLORS_CODE;
  readonly filterCode = FILTER_CODE;
}
