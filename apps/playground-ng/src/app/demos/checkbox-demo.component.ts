import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import { TulparCheckboxComponent } from '@tulpar-ui/angular';

// ─── Code snippets ─────────────────────────────────────────────────────────────

const SIZES_CODE = `<tulpar-checkbox-ng size="xs" label="Extra Small"></tulpar-checkbox-ng>
<tulpar-checkbox-ng size="sm" label="Small"></tulpar-checkbox-ng>
<tulpar-checkbox-ng size="md" label="Medium (default)"></tulpar-checkbox-ng>
<tulpar-checkbox-ng size="lg" label="Large"></tulpar-checkbox-ng>
<tulpar-checkbox-ng size="xl" label="Extra Large"></tulpar-checkbox-ng>`;

const LABEL_SLOTS_CODE = `<!-- label + description via named slots -->
<tulpar-checkbox-ng [checked]="true">
  <span slot="label">Remember me</span>
  <span slot="description">Stay signed in for 30 days</span>
</tulpar-checkbox-ng>`;

const STATES_CODE = `<!-- Checked -->
<tulpar-checkbox-ng label="Checked" [checked]="true"></tulpar-checkbox-ng>

<!-- Disabled -->
<tulpar-checkbox-ng label="Disabled off" [disabled]="true"></tulpar-checkbox-ng>
<tulpar-checkbox-ng label="Disabled on" [checked]="true" [disabled]="true"></tulpar-checkbox-ng>

<!-- Readonly -->
<tulpar-checkbox-ng label="Readonly on" [checked]="true" [readonly]="true"></tulpar-checkbox-ng>

<!-- Invalid + required -->
<tulpar-checkbox-ng
  label="Accept terms"
  [required]="true"
  [invalid]="true"
  errorText="You must accept the terms"
></tulpar-checkbox-ng>`;

const INDETERMINATE_CODE = `// Signal-driven select-all
allItems = ['Billing', 'Reports', 'Users'];
checkedItems = signal<string[]>([]);

parentChecked  = computed(() => this.checkedItems().length === this.allItems.length);
parentIndet    = computed(() =>
  this.checkedItems().length > 0 && this.checkedItems().length < this.allItems.length
);

onParentChange() {
  this.checkedItems.set(this.parentChecked() ? [] : [...this.allItems]);
}

onChildChange(item: string, checked: boolean) {
  this.checkedItems.update(items =>
    checked ? [...items, item] : items.filter(i => i !== item)
  );
}

<!-- Template -->
<tulpar-checkbox-ng
  label="Select all"
  [checked]="parentChecked()"
  [indeterminate]="parentIndet()"
  (change)="onParentChange()"
></tulpar-checkbox-ng>
@for (item of allItems; track item) {
  <tulpar-checkbox-ng
    [label]="item"
    [checked]="checkedItems().includes(item)"
    (change)="onChildChange(item, $any($event.target).checked)"
  ></tulpar-checkbox-ng>
}`;

const CUSTOM_ICON_CODE = `<!-- Custom check icon via slot="icon" -->
<tulpar-checkbox-ng label="Star-checked" [checked]="true">
  <span slot="icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"
         viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02
                       12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  </span>
</tulpar-checkbox-ng>`;

const CARD_VARIANT_CODE = `<!-- Single card -->
<tulpar-checkbox-ng variant="card" label="Express shipping" [checked]="true">
  <span slot="description">Arrives in 2–3 business days</span>
</tulpar-checkbox-ng>

<!-- Grid of cards -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
  <tulpar-checkbox-ng variant="card" label="Read"  [checked]="true"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng variant="card" label="Write" [checked]="true"></tulpar-checkbox-ng>
  <tulpar-checkbox-ng variant="card" label="Delete"                ></tulpar-checkbox-ng>
  <tulpar-checkbox-ng variant="card" label="Admin"                 ></tulpar-checkbox-ng>
</div>`;

const COLORS_CODE = `<tulpar-checkbox-ng label="Default brand" [checked]="true"></tulpar-checkbox-ng>
<tulpar-checkbox-ng label="Otuken" [checked]="true" color="otuken"></tulpar-checkbox-ng>
<tulpar-checkbox-ng label="Kizagan" [checked]="true" color="kizagan"></tulpar-checkbox-ng>
<tulpar-checkbox-ng label="Kam" [checked]="true" color="kam"></tulpar-checkbox-ng>`;

const PERMISSIONS_CODE = `<!-- Real-world: role-based permissions with indeterminate select-all -->
<div class="permissions-card">
  <tulpar-checkbox-ng
    label="All permissions"
    [checked]="allPermsChecked()"
    [indeterminate]="somePermsChecked()"
    (change)="onToggleAll()"
  ></tulpar-checkbox-ng>
  <!-- child items ... -->
</div>`;

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  imports: [TulparCheckboxComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Selection</span>
      <h1 class="page-title">Checkbox</h1>
      <p class="page-lede">
        A multi-select control with full state management — indeterminate "select all", card
        variant, custom icon slot, and signal-driven composition.
      </p>
    </header>

    <!-- ── Hero ──────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-checkbox-ng
          label="Subscribe to newsletter"
          [checked]="true"
          size="lg"
        ></tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="lg">
          <span slot="label">Remember me</span>
          <span slot="description">Stay signed in for 30 days</span>
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng
          label="I accept the terms"
          [required]="true"
          size="lg"
        ></tulpar-checkbox-ng>
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
        <tulpar-checkbox-ng size="xs" label="Extra Small" [checked]="true"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="sm" label="Small" [checked]="true"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="md" label="Medium" [checked]="true"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="lg" label="Large" [checked]="true"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng size="xl" label="Extra Large" [checked]="true"></tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ sizesCode }}</code></pre>
    </section>

    <!-- ── 2. Label + description slots ───────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Label + description slots</h2>
      <p class="section-desc">
        Use <code class="inline-code">slot="label"</code> and
        <code class="inline-code">slot="description"</code> for rich multi-line rows.
      </p>
      <div class="preview">
        <tulpar-checkbox-ng [checked]="true">
          <span slot="label">Remember me</span>
          <span slot="description">Stay signed in for 30 days</span>
        </tulpar-checkbox-ng>
        <tulpar-checkbox-ng>
          <span slot="label">Agree to privacy policy</span>
          <span slot="description">We will never sell your personal data</span>
        </tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ labelSlotsCode }}</code></pre>
    </section>

    <!-- ── 3. States ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. States</h2>
      <p class="section-desc">
        Checked, disabled (on/off), readonly, and invalid with required error text.
      </p>
      <div class="preview preview--col">
        <div class="preview-row">
          <tulpar-checkbox-ng label="Checked" [checked]="true"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng label="Disabled off" [disabled]="true"></tulpar-checkbox-ng>
          <tulpar-checkbox-ng
            label="Disabled on"
            [checked]="true"
            [disabled]="true"
          ></tulpar-checkbox-ng>
          <tulpar-checkbox-ng
            label="Readonly on"
            [checked]="true"
            [readonly]="true"
          ></tulpar-checkbox-ng>
        </div>
        <tulpar-checkbox-ng
          label="Accept terms"
          [required]="true"
          [invalid]="true"
          errorText="You must accept the terms to continue"
        ></tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ statesCode }}</code></pre>
    </section>

    <!-- ── 4. Indeterminate + select-all ──────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Indeterminate — signal-driven select all</h2>
      <p class="section-desc">
        The parent checkbox is <code class="inline-code">indeterminate</code> when some (but not
        all) children are checked. All state is derived from a
        <code class="inline-code">signal()</code> array — no RxJS.
      </p>
      <div class="preview preview--col">
        <tulpar-checkbox-ng
          label="Select all"
          [checked]="parentChecked()"
          [indeterminate]="parentIndeterminate()"
          (change)="onParentChange($event)"
        ></tulpar-checkbox-ng>
        <div class="child-list">
          @for (item of permissionItems; track item) {
            <tulpar-checkbox-ng
              [label]="item"
              [checked]="checkedPermissions().includes(item)"
              (change)="onChildChange(item, $any($event.target).checked)"
            ></tulpar-checkbox-ng>
          }
        </div>
        <p class="status-feedback">Selected: {{ checkedPermissions().join(', ') || '(none)' }}</p>
      </div>
      <pre class="code"><code>{{ indeterminateCode }}</code></pre>
    </section>

    <!-- ── 5. Custom icon slot ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Custom icon slot</h2>
      <p class="section-desc">
        Project any SVG or icon component into
        <code class="inline-code">slot="icon"</code> to replace the default checkmark.
      </p>
      <div class="preview preview--baseline">
        <!-- Star icon -->
        <tulpar-checkbox-ng label="Starred" [checked]="true">
          <span slot="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              />
            </svg>
          </span>
        </tulpar-checkbox-ng>
        <!-- Heart icon -->
        <tulpar-checkbox-ng label="Favorited" [checked]="true">
          <span slot="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </span>
        </tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ customIconCode }}</code></pre>
    </section>

    <!-- ── 6. Card variant ─────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Card variant</h2>
      <p class="section-desc">
        <code class="inline-code">variant="card"</code> wraps the checkbox in a bordered card
        surface. Ideal for plan pickers and option grids.
      </p>
      <div class="preview preview--col">
        <p class="preview-label">Single card</p>
        <tulpar-checkbox-ng variant="card" [checked]="true">
          <span slot="label">Express shipping</span>
          <span slot="description">Arrives in 2–3 business days</span>
        </tulpar-checkbox-ng>
        <p class="preview-label">Grid of cards</p>
        <div class="card-grid">
          <tulpar-checkbox-ng
            variant="card"
            label="Read"
            [checked]="cardPermRead()"
          ></tulpar-checkbox-ng>
          <tulpar-checkbox-ng
            variant="card"
            label="Write"
            [checked]="cardPermWrite()"
          ></tulpar-checkbox-ng>
          <tulpar-checkbox-ng
            variant="card"
            label="Delete"
            [checked]="cardPermDelete()"
          ></tulpar-checkbox-ng>
          <tulpar-checkbox-ng
            variant="card"
            label="Admin"
            [checked]="cardPermAdmin()"
          ></tulpar-checkbox-ng>
        </div>
      </div>
      <pre class="code"><code>{{ cardVariantCode }}</code></pre>
    </section>

    <!-- ── 7. Color ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Color</h2>
      <p class="section-desc">Override the checkbox accent with any design-system color name.</p>
      <div class="preview preview--baseline">
        <tulpar-checkbox-ng label="Default brand" [checked]="true"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng label="Otuken" [checked]="true" color="otuken"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng label="Kizagan" [checked]="true" color="kizagan"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng label="Kam" [checked]="true" color="kam"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng label="Yersu" [checked]="true" color="yersu"></tulpar-checkbox-ng>
        <tulpar-checkbox-ng label="Erlik" [checked]="true" color="erlik"></tulpar-checkbox-ng>
      </div>
      <pre class="code"><code>{{ colorsCode }}</code></pre>
    </section>

    <!-- ── 8. In context — permissions panel ──────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">In context — role permissions panel</h2>
      <p class="section-desc">
        Checkboxes compose into a hierarchical permissions UI — select-all parent with indeterminate
        derived from child state, grouped into resource sections.
      </p>
      <div class="composition">
        <div class="permissions-card">
          <p class="permissions-title">Editor Role Permissions</p>

          <p class="permissions-group-label">Content</p>
          <div class="permissions-group">
            <tulpar-checkbox-ng
              label="All content permissions"
              [checked]="allContentChecked()"
              [indeterminate]="someContentChecked()"
              (change)="onToggleAllContent($event)"
            ></tulpar-checkbox-ng>
            <div class="permissions-children">
              @for (p of contentPermissions; track p) {
                <tulpar-checkbox-ng
                  [label]="p"
                  [checked]="checkedContent().includes(p)"
                  (change)="onContentChange(p, $any($event.target).checked)"
                ></tulpar-checkbox-ng>
              }
            </div>
          </div>

          <p class="permissions-group-label">Media</p>
          <div class="permissions-group">
            <tulpar-checkbox-ng
              label="All media permissions"
              [checked]="allMediaChecked()"
              [indeterminate]="someMediaChecked()"
              (change)="onToggleAllMedia($event)"
            ></tulpar-checkbox-ng>
            <div class="permissions-children">
              @for (p of mediaPermissions; track p) {
                <tulpar-checkbox-ng
                  [label]="p"
                  [checked]="checkedMedia().includes(p)"
                  (change)="onMediaChange(p, $any($event.target).checked)"
                ></tulpar-checkbox-ng>
              }
            </div>
          </div>
        </div>
      </div>
      <pre class="code"><code>{{ permissionsCode }}</code></pre>
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
        gap: 20px;
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
        gap: 12px;
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
        gap: 12px;
        align-items: center;
      }

      .preview-label {
        margin: 0 0 8px;
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

      .child-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-left: 24px;
      }

      .status-feedback {
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .card-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        width: 100%;
        max-width: 400px;
      }

      /* ── Composition ────────────────────────────────────────────────── */
      .composition {
        display: flex;
      }

      .permissions-card {
        flex: 1;
        max-width: 420px;
        padding: 20px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 12px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
      }

      .permissions-title {
        margin: 0 0 16px;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 16px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .permissions-group-label {
        margin: 16px 0 8px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .permissions-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .permissions-children {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding-left: 24px;
      }
    `,
  ],
})
export class CheckboxDemoComponent {
  // ── Indeterminate select-all demo ───────────────────────────────────────────
  readonly permissionItems = ['Billing', 'Reports', 'Users', 'Settings'];
  readonly checkedPermissions = signal<string[]>(['Billing', 'Reports']);

  readonly parentChecked = computed(
    () => this.checkedPermissions().length === this.permissionItems.length,
  );
  readonly parentIndeterminate = computed(
    () =>
      this.checkedPermissions().length > 0 &&
      this.checkedPermissions().length < this.permissionItems.length,
  );

  onParentChange(_e: Event): void {
    this.checkedPermissions.set(this.parentChecked() ? [] : [...this.permissionItems]);
  }

  onChildChange(item: string, checked: boolean): void {
    this.checkedPermissions.update((items) =>
      checked ? [...items, item] : items.filter((i) => i !== item),
    );
  }

  // ── Card variant demo ───────────────────────────────────────────────────────
  readonly cardPermRead = signal(true);
  readonly cardPermWrite = signal(true);
  readonly cardPermDelete = signal(false);
  readonly cardPermAdmin = signal(false);

  // ── Permissions composition ─────────────────────────────────────────────────
  readonly contentPermissions = ['Create articles', 'Edit articles', 'Publish articles'];
  readonly mediaPermissions = ['Upload files', 'Delete files'];

  readonly checkedContent = signal<string[]>(['Create articles', 'Edit articles']);
  readonly checkedMedia = signal<string[]>([]);

  readonly allContentChecked = computed(
    () => this.checkedContent().length === this.contentPermissions.length,
  );
  readonly someContentChecked = computed(
    () =>
      this.checkedContent().length > 0 &&
      this.checkedContent().length < this.contentPermissions.length,
  );
  readonly allMediaChecked = computed(
    () => this.checkedMedia().length === this.mediaPermissions.length,
  );
  readonly someMediaChecked = computed(
    () =>
      this.checkedMedia().length > 0 && this.checkedMedia().length < this.mediaPermissions.length,
  );

  onToggleAllContent(_e: Event): void {
    this.checkedContent.set(this.allContentChecked() ? [] : [...this.contentPermissions]);
  }

  onContentChange(p: string, checked: boolean): void {
    this.checkedContent.update((items) => (checked ? [...items, p] : items.filter((i) => i !== p)));
  }

  onToggleAllMedia(_e: Event): void {
    this.checkedMedia.set(this.allMediaChecked() ? [] : [...this.mediaPermissions]);
  }

  onMediaChange(p: string, checked: boolean): void {
    this.checkedMedia.update((items) => (checked ? [...items, p] : items.filter((i) => i !== p)));
  }

  // ── Code snippets ───────────────────────────────────────────────────────────
  readonly sizesCode = SIZES_CODE;
  readonly labelSlotsCode = LABEL_SLOTS_CODE;
  readonly statesCode = STATES_CODE;
  readonly indeterminateCode = INDETERMINATE_CODE;
  readonly customIconCode = CUSTOM_ICON_CODE;
  readonly cardVariantCode = CARD_VARIANT_CODE;
  readonly colorsCode = COLORS_CODE;
  readonly permissionsCode = PERMISSIONS_CODE;
}
