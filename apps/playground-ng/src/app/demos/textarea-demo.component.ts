import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TulparTextareaComponent, TulparButtonComponent } from '@tulpar-ui/angular';

// ─── Code snippets ────────────────────────────────────────────────────────────

const BASICS_CODE = `<tulpar-textarea-ng label="Bio" helperText="Tell us about yourself" placeholder="Start typing…"></tulpar-textarea-ng>
<tulpar-textarea-ng label="Notes" placeholder="Optional notes…"></tulpar-textarea-ng>`;

const AUTOSIZE_CODE = `<!-- Default: 2–6 rows, grows as you type -->
<tulpar-textarea-ng label="Autosize (2–6 rows)" [autosize]="true"></tulpar-textarea-ng>
<!-- Custom min/max rows -->
<tulpar-textarea-ng label="1–10 rows" [autosize]="true" [minRows]="1" [maxRows]="10"></tulpar-textarea-ng>
<!-- Fixed rows=5, autosize disabled -->
<tulpar-textarea-ng label="Fixed 5 rows" [autosize]="false" [rows]="5"></tulpar-textarea-ng>`;

const RESIZE_CODE = `<tulpar-textarea-ng resize="none" label="No resize"></tulpar-textarea-ng>
<tulpar-textarea-ng resize="both" label="Both directions"></tulpar-textarea-ng>
<tulpar-textarea-ng resize="horizontal" label="Horizontal only"></tulpar-textarea-ng>
<tulpar-textarea-ng resize="vertical" label="Vertical only (default)"></tulpar-textarea-ng>`;

const COUNTER_CODE = `<!-- Character count overlay; works alongside autosize -->
<tulpar-textarea-ng
  label="Post body"
  [showCount]="true"
  [maxLength]="200"
  [value]="body"
  (valueChange)="body=$event"
></tulpar-textarea-ng>`;

const ACTIONS_CODE = `<!-- copyable: copy icon button in corner -->
<tulpar-textarea-ng label="Template (copyable)" [copyable]="true" value="Dear {{name}}, …"></tulpar-textarea-ng>
<!-- pastable -->
<tulpar-textarea-ng label="Paste area" [pastable]="true" placeholder="Click paste icon…"></tulpar-textarea-ng>
<!-- both -->
<tulpar-textarea-ng label="Copyable + Pastable" [copyable]="true" [pastable]="true"></tulpar-textarea-ng>`;

const STATUSES_CODE = `<tulpar-textarea-ng label="Description" [invalid]="true" errorText="Description is required"></tulpar-textarea-ng>
<tulpar-textarea-ng label="Summary" [warn]="true" warnText="Content may be too long for SMS"></tulpar-textarea-ng>
<tulpar-textarea-ng label="Bio" [validating]="true" helperText="Checking for prohibited words…"></tulpar-textarea-ng>`;

const SIZES_VARIANTS_CODE = `<tulpar-textarea-ng size="sm" variant="outlined" label="sm outlined"></tulpar-textarea-ng>
<tulpar-textarea-ng size="md" variant="filled" label="md filled"></tulpar-textarea-ng>
<tulpar-textarea-ng size="lg" variant="underlined" label="lg underlined"></tulpar-textarea-ng>
<tulpar-textarea-ng size="sm" variant="ghost" label="sm ghost"></tulpar-textarea-ng>`;

// ─── Section list ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 'basics', title: 'Basics' },
  { id: 'autosize', title: 'Autosize' },
  { id: 'resize', title: 'Resize' },
  { id: 'counter', title: 'Counter' },
  { id: 'actions', title: 'Actions' },
  { id: 'statuses', title: 'Statuses' },
  { id: 'sizes-variants', title: 'Sizes & Variants' },
];

@Component({
  selector: 'app-textarea-demo',
  standalone: true,
  imports: [TulparTextareaComponent, TulparButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Form</span>
      <h1 class="page-title">Textarea</h1>
      <p class="page-lede">
        The multi-line text field — autosizing rows, resize control, a live character counter,
        copy/paste affordances, and the full validation-state set. Built on the shared
        FormFieldBase.
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
        <p class="demo-desc">Label, helper text, placeholder — the standard setup.</p>
        <div class="preview preview--col">
          <tulpar-textarea-ng
            label="Bio"
            helperText="Tell us about yourself"
            placeholder="Start typing…"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            label="Notes"
            placeholder="Optional notes…"
            [required]="true"
          ></tulpar-textarea-ng>
        </div>
        <pre class="code"><code>{{ basicsCode }}</code></pre>
      </section>
    }

    <!-- ── Autosize ───────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'autosize') {
      <section class="demo-section">
        <h3 class="demo-title">Autosize</h3>
        <p class="demo-desc">
          Default grows from 2 to 6 rows. Customise min/max rows or disable entirely with a fixed
          row count.
        </p>
        <div class="preview preview--col">
          <tulpar-textarea-ng
            label="Autosize (default 2–6 rows)"
            [autosize]="true"
            placeholder="Type to grow…"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            label="Custom 1–10 rows"
            [autosize]="true"
            [minRows]="1"
            [maxRows]="10"
            placeholder="Type to grow up to 10 rows…"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            label="Fixed 5 rows (autosize off)"
            [autosize]="false"
            [rows]="5"
            placeholder="Fixed height, no grow"
          ></tulpar-textarea-ng>
        </div>
        <pre class="code"><code>{{ autosizeCode }}</code></pre>
      </section>
    }

    <!-- ── Resize ─────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'resize') {
      <section class="demo-section">
        <h3 class="demo-title">Resize</h3>
        <p class="demo-desc">Controls the CSS resize handle. Default is vertical.</p>
        <div class="preview preview--col">
          <tulpar-textarea-ng
            resize="none"
            label="None — no handle"
            placeholder="No resize handle"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            resize="both"
            label="Both directions"
            [autosize]="false"
            [rows]="3"
            placeholder="Drag corner"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            resize="horizontal"
            label="Horizontal only"
            [autosize]="false"
            [rows]="3"
            placeholder="Drag right edge"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            resize="vertical"
            label="Vertical only (default)"
            [autosize]="false"
            [rows]="3"
            placeholder="Drag bottom edge"
          ></tulpar-textarea-ng>
        </div>
        <pre class="code"><code>{{ resizeCode }}</code></pre>
      </section>
    }

    <!-- ── Counter ────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'counter') {
      <section class="demo-section">
        <h3 class="demo-title">Character Counter</h3>
        <p class="demo-desc">
          show-count with maxLength renders a live character count overlay. Works alongside
          autosize.
        </p>
        <div class="preview preview--col">
          <tulpar-textarea-ng
            label="Post body"
            [showCount]="true"
            [maxLength]="200"
            [value]="counterBody()"
            (valueChange)="counterBody.set($event)"
            placeholder="Type your post…"
          ></tulpar-textarea-ng>
          <p class="value-display">{{ counterBody().length }} / 200 characters</p>
        </div>
        <pre class="code"><code>{{ counterCode }}</code></pre>
      </section>
    }

    <!-- ── Actions ────────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'actions') {
      <section class="demo-section">
        <h3 class="demo-title">Actions</h3>
        <p class="demo-desc">
          copyable and pastable add icon buttons. Use copyable with prefilled values or readonly.
        </p>
        <div class="preview preview--col">
          <tulpar-textarea-ng
            label="Template (copyable)"
            [copyable]="true"
            value="Dear {{
              '{{'
            }}name{{'}}'}}, thank you for reaching out. We will get back to you shortly."
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            label="Paste here"
            [pastable]="true"
            placeholder="Click the paste icon…"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            label="Copyable + Pastable"
            [copyable]="true"
            [pastable]="true"
            placeholder="Both affordances"
          ></tulpar-textarea-ng>
        </div>
        <pre class="code"><code>{{ actionsCode }}</code></pre>
      </section>
    }

    <!-- ── Statuses ───────────────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'statuses') {
      <section class="demo-section">
        <h3 class="demo-title">Statuses</h3>
        <p class="demo-desc">invalid, warn, and validating states with matching message text.</p>
        <div class="preview preview--col">
          <tulpar-textarea-ng
            label="Description"
            [invalid]="true"
            errorText="Description is required"
            placeholder="Required field"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            label="Summary"
            [warn]="true"
            warnText="Content may be too long for SMS (160 chars)"
            value="This is a fairly long message that might not fit in a single SMS segment…"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            label="Bio"
            [validating]="true"
            helperText="Checking for prohibited words…"
            value="My bio here"
          ></tulpar-textarea-ng>
        </div>
        <pre class="code"><code>{{ statusesCode }}</code></pre>
      </section>
    }

    <!-- ── Sizes & Variants ───────────────────────────────────────────────────── -->
    @if (activeSection() === 'all' || activeSection() === 'sizes-variants') {
      <section class="demo-section">
        <h3 class="demo-title">Sizes &amp; Variants</h3>
        <p class="demo-desc">A selection of size + variant combos to show the matrix.</p>
        <div class="preview preview--col">
          <tulpar-textarea-ng
            size="sm"
            variant="outlined"
            label="sm + outlined"
            placeholder="small outlined"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            size="md"
            variant="filled"
            label="md + filled"
            placeholder="medium filled"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            size="lg"
            variant="underlined"
            label="lg + underlined"
            placeholder="large underlined"
          ></tulpar-textarea-ng>
          <tulpar-textarea-ng
            size="sm"
            variant="ghost"
            label="sm + ghost"
            placeholder="small ghost"
          ></tulpar-textarea-ng>
        </div>
        <pre class="code"><code>{{ sizesVariantsCode }}</code></pre>
      </section>
    }

    <!-- ── In context — a comment composer ──────────────────────────────────── -->
    @if (activeSection() === 'all') {
      <section class="demo-section">
        <h3 class="demo-title">In context — a comment composer</h3>
        <p class="demo-desc">
          Autosize, a live counter, and a submit action composed into a realistic comment box on an
          elevated surface.
        </p>
        <div class="composer-card">
          <div class="composer-head">
            <span class="composer-avatar" aria-hidden="true">KA</span>
            <span class="composer-name">Kaan Akcan</span>
          </div>
          <tulpar-textarea-ng
            label="Add a comment"
            labelPosition="none"
            [autosize]="true"
            [minRows]="2"
            [maxRows]="8"
            [showCount]="true"
            [maxLength]="500"
            [value]="composerBody()"
            (valueChange)="composerBody.set($event)"
            placeholder="Share your thoughts…"
          ></tulpar-textarea-ng>
          <div class="composer-actions">
            <tulpar-button-ng severity="secondary" variant="ghost" size="sm"
              >Cancel</tulpar-button-ng
            >
            <tulpar-button-ng
              severity="primary"
              size="sm"
              [disabled]="composerBody().trim().length === 0"
              >Post comment</tulpar-button-ng
            >
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

      .composer-card {
        max-width: 560px;
        padding: 20px 22px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 14px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.06));
      }

      .composer-head {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 14px;
      }

      .composer-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        flex: none;
        border-radius: 999px;
        background: var(--tulpar-color-brand-default, #00c57a);
        color: var(--tulpar-color-brand-on-color, #07291f);
        font-size: 12px;
        font-weight: 700;
      }

      .composer-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .composer-actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 14px;
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
    `,
  ],
})
export class TextareaDemoComponent {
  readonly sections = SECTIONS;
  activeSection = signal<string>('all');

  counterBody = signal('');
  composerBody = signal('');

  readonly basicsCode = BASICS_CODE;
  readonly autosizeCode = AUTOSIZE_CODE;
  readonly resizeCode = RESIZE_CODE;
  readonly counterCode = COUNTER_CODE;
  readonly actionsCode = ACTIONS_CODE;
  readonly statusesCode = STATUSES_CODE;
  readonly sizesVariantsCode = SIZES_VARIANTS_CODE;
}
