import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';
import {
  TulparButtonComponent,
  TulparPopoverDirective,
  TulparPopoverRefDirective,
  TulparTooltipDirective,
} from '@tulpar-ui/angular';
import {
  LucideAngularModule,
  Settings2,
  UserRound,
  Filter,
  Bell,
  HelpCircle,
  Loader2,
} from 'lucide-angular';

// ─── Code snippet strings ─────────────────────────────────────────────────────

const REF_CODE = `<!-- The Ref form is the primary popover API: declare the surface with its
     rich content, then point a trigger at it by id. The popover is NON-MODAL —
     no focus trap, no scroll lock, no background inert. -->
<tulpar-popover id="pop-profile" label="Profile">
  <div class="card">
    <h3>Kaan Akcan</h3>
    <p>kaanakcan@outlook.com</p>
    <button>View profile</button>
    <button>Sign out</button>
  </div>
</tulpar-popover>

<button tulparPopoverRef="pop-profile">Open profile</button>`;

const INLINE_CODE = `<!-- The inline directive covers only the trivial plain-text case -->
<button tulparPopover="A quick note rendered on the popover surface.">
  Quick note
</button>`;

const FORM_CODE = `<!-- Focus MOVES into the surface on open (first focusable element), Tab then
     flows OUT naturally (non-modal), Esc / outside-click dismiss and return
     focus to the trigger. -->
<tulpar-popover id="pop-form" label="Rename project">
  <form (submit)="onRename($event)">
    <label>Project name
      <input name="name" value="Tulpar UI" />
    </label>
    <div class="row">
      <button type="submit">Save</button>
      <button type="button">Cancel</button>
    </div>
  </form>
</tulpar-popover>

<button tulparPopoverRef="pop-form">Rename…</button>`;

const TONE_CODE = `<!-- Five tones tint the surface accent. -->
<tulpar-popover id="pop-danger" tone="danger" label="Delete">…</tulpar-popover>
<button tulparPopoverRef="pop-danger">Delete project</button>`;

const FLIP_CODE = `<!-- placement="auto" (or any side) flips to stay inside the viewport when
     the trigger sits near an edge. The resolved side lands on data-placement. -->
<tulpar-popover id="pop-edge" placement="auto">…</tulpar-popover>
<button tulparPopoverRef="pop-edge" style="margin-left:auto">Near the edge</button>`;

const SCROLL_CODE = `<!-- Long content scrolls inside a capped surface (max-height set in CSS on
     the slotted body) — the popover never grows past the viewport. -->
<tulpar-popover id="pop-scroll" label="Activity">
  <div class="scroll-body"> …many rows… </div>
</tulpar-popover>
<button tulparPopoverRef="pop-scroll">Activity log</button>`;

const ASYNC_CODE = `<!-- Load content after open, then call reposition() so the surface re-anchors
     to its new size. A ResizeObserver also re-positions automatically on growth. -->
<tulpar-popover id="pop-async" label="Details">
  <div>{{ asyncLoaded() ? loadedText : 'Loading…' }}</div>
</tulpar-popover>
<button tulparPopoverRef="pop-async" (openChange)="onAsyncOpen($event)">Load details</button>

// in the component:
onAsyncOpen(open: boolean) {
  if (!open) return;
  setTimeout(() => {
    this.asyncLoaded.set(true);
    const el = document.getElementById('pop-async');
    (el as any)?.reposition();
  }, 700);
}`;

const CONTROLLED_CODE = `<!-- Drive open state from elsewhere via [openControlled], read it via openChange. -->
<button (click)="ext.set(!ext())">Toggle from here</button>

<tulpar-popover id="pop-ext">Opened from an outside button.</tulpar-popover>
<button tulparPopoverRef="pop-ext" [openControlled]="ext()" (openChange)="ext.set($event)">
  Anchor
</button>`;

const NESTED_CODE = `<!-- A tooltip can live inside an open popover. The overlay stack closes the
     INNER tooltip first on Esc, then the popover on a second Esc. -->
<tulpar-popover id="pop-nested" label="Settings">
  <button tulparTooltip="Controls who can see this project">Visibility ⓘ</button>
</tulpar-popover>
<button tulparPopoverRef="pop-nested">Settings</button>`;

@Component({
  selector: 'app-popover-demo',
  standalone: true,
  imports: [
    TulparButtonComponent,
    TulparPopoverDirective,
    TulparPopoverRefDirective,
    TulparTooltipDirective,
    LucideAngularModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Overlay · Directive</span>
      <h1 class="page-title">Popover</h1>
      <p class="page-lede">
        The richest overlay — a click-triggered, NON-MODAL dialog surface
        (<code class="inline-code">role="dialog"</code>) that hosts forms, menus and controls. No focus trap,
        no scroll lock: focus moves in on open, Tab flows back out, <kbd>Esc</kbd> / outside-click dismiss and
        return focus. The <code class="inline-code">[tulparPopoverRef]</code> form is primary.
      </p>
    </header>

    <!-- ── Hero ────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-popover id="pop-hero" label="Account">
          <div class="acct">
            <div class="acct-head">
              <span class="avatar">KA</span>
              <div>
                <p class="acct-name">Kaan Akcan</p>
                <p class="acct-mail">kaanakcan&#64;outlook.com</p>
              </div>
            </div>
            <div class="acct-actions">
              <button class="acct-link">View profile</button>
              <button class="acct-link">Account settings</button>
              <button class="acct-link acct-link--danger">Sign out</button>
            </div>
          </div>
        </tulpar-popover>
        <tulpar-button-ng severity="primary" tulparPopoverRef="pop-hero">
          <lucide-angular slot="start" [img]="UserRound" [size]="16" />
          Account
        </tulpar-button-ng>
      </div>
    </section>

    <!-- ── 1. Ref form (primary) ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Ref form — the primary API</h2>
      <p class="section-desc">
        Declare a <code class="inline-code">&lt;tulpar-popover id&gt;</code> with rich content, then point a
        trigger at it via <code class="inline-code">[tulparPopoverRef]</code>. You own the surface markup and
        its lifecycle; the directive only wires the trigger.
      </p>
      <div class="preview">
        <tulpar-popover id="pop-profile" label="Profile">
          <div class="acct">
            <div class="acct-head">
              <span class="avatar">KA</span>
              <div>
                <p class="acct-name">Kaan Akcan</p>
                <p class="acct-mail">kaanakcan&#64;outlook.com</p>
              </div>
            </div>
            <div class="acct-actions">
              <button class="acct-link">View profile</button>
              <button class="acct-link acct-link--danger">Sign out</button>
            </div>
          </div>
        </tulpar-popover>
        <button class="plain-btn" tulparPopoverRef="pop-profile">Open profile</button>
      </div>
      <pre class="code"><code>{{ refCode }}</code></pre>
    </section>

    <!-- ── 2. Inline plain-text ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Inline directive — plain text only</h2>
      <p class="section-desc">
        For a trivial note, <code class="inline-code">[tulparPopover]="text"</code> creates the surface from a
        string. Anything richer should use the Ref form above.
      </p>
      <div class="preview">
        <button class="plain-btn" tulparPopover="A quick note rendered on the popover surface.">
          Quick note
        </button>
      </div>
      <pre class="code"><code>{{ inlineCode }}</code></pre>
    </section>

    <!-- ── 3. Form-in-popover ──────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Form in a popover — non-modal focus model</h2>
      <p class="section-desc">
        On open, focus moves to the first focusable element (the input). <kbd>Tab</kbd> flows naturally out of
        the surface — there's no trap. <kbd>Esc</kbd> or an outside click closes it and returns focus to the
        trigger.
      </p>
      <div class="preview">
        <tulpar-popover id="pop-form" label="Rename project">
          <form class="pop-form" (submit)="onRename($event)">
            <label class="pop-label">
              Project name
              <input class="pop-input" name="name" value="Tulpar UI" />
            </label>
            <div class="pop-row">
              <button class="plain-btn plain-btn--accent" type="submit">Save</button>
              <button class="plain-btn" type="button">Cancel</button>
            </div>
          </form>
        </tulpar-popover>
        <button class="plain-btn" tulparPopoverRef="pop-form">Rename…</button>
        @if (renamed()) {
          <span class="state-badge state-badge--on">Saved: {{ renamed() }}</span>
        }
      </div>
      <pre class="code"><code>{{ formCode }}</code></pre>
    </section>

    <!-- ── 4. Tone ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Tone</h2>
      <p class="section-desc">
        <code class="inline-code">tone</code> tints the surface accent:
        <code class="inline-code">neutral · info · success · warning · danger</code>.
      </p>
      <div class="preview preview--baseline">
        <tulpar-popover id="pop-info" tone="info">
          <p class="pop-text">Read replicas may lag a few seconds behind the primary database.</p>
        </tulpar-popover>
        <button class="plain-btn" tulparPopoverRef="pop-info">Info</button>

        <tulpar-popover id="pop-warning" tone="warning">
          <p class="pop-text">Your trial ends in 3 days. Add a payment method to keep your data.</p>
        </tulpar-popover>
        <button class="plain-btn" tulparPopoverRef="pop-warning">Warning</button>

        <tulpar-popover id="pop-danger" tone="danger" label="Delete project">
          <p class="pop-text">This permanently deletes <strong>Tulpar UI</strong> and all its data.</p>
          <div class="pop-row">
            <button class="plain-btn" type="button">Cancel</button>
            <button class="plain-btn plain-btn--danger" type="button">Delete</button>
          </div>
        </tulpar-popover>
        <button class="plain-btn" tulparPopoverRef="pop-danger">Delete project</button>
      </div>
      <pre class="code"><code>{{ toneCode }}</code></pre>
    </section>

    <!-- ── 5. Auto / flip at edge ──────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Auto &amp; flip at the edge</h2>
      <p class="section-desc">
        With <code class="inline-code">placement="auto"</code> (or any explicit side), the surface flips to
        stay inside the viewport when the trigger sits near an edge. The trigger below is pinned to the right.
      </p>
      <div class="preview">
        <tulpar-popover id="pop-edge" placement="auto" label="Filters">
          <div class="pop-menu">
            <p class="pop-text">This popover flips its side to stay on-screen near the viewport edge.</p>
            <button class="pop-menu-item">Newest first</button>
            <button class="pop-menu-item">Oldest first</button>
            <button class="pop-menu-item">A–Z</button>
          </div>
        </tulpar-popover>
        <button class="plain-btn edge-trigger" tulparPopoverRef="pop-edge">
          <lucide-angular [img]="Filter" [size]="15" />
          Near the edge
        </button>
      </div>
      <pre class="code"><code>{{ flipCode }}</code></pre>
    </section>

    <!-- ── 6. Max-height scroll ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Max-height scroll</h2>
      <p class="section-desc">
        Long content scrolls inside a capped surface — the popover never overruns the viewport.
      </p>
      <div class="preview">
        <tulpar-popover id="pop-scroll" label="Activity">
          <div class="scroll-body">
            @for (n of activity; track n) {
              <div class="activity-row">
                <span class="activity-dot"></span>
                <span>Event #{{ n }} — user updated the record</span>
              </div>
            }
          </div>
        </tulpar-popover>
        <button class="plain-btn" tulparPopoverRef="pop-scroll">
          <lucide-angular [img]="Bell" [size]="15" />
          Activity log
        </button>
      </div>
      <pre class="code"><code>{{ scrollCode }}</code></pre>
    </section>

    <!-- ── 7. Async + reposition ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Async content + reposition()</h2>
      <p class="section-desc">
        Open first, load later. When the body grows, the surface re-anchors — a built-in
        <code class="inline-code">ResizeObserver</code> calls <code class="inline-code">reposition()</code>
        on growth, and you can call it imperatively too.
      </p>
      <div class="preview">
        <tulpar-popover id="pop-async" label="Details">
          <div class="async-body">
            @if (asyncLoaded()) {
              <p class="pop-text">{{ loadedText }}</p>
            } @else {
              <span class="async-loading">
                <lucide-angular class="spin-icon" [img]="Loader2" [size]="16" />
                Loading…
              </span>
            }
          </div>
        </tulpar-popover>
        <button class="plain-btn" tulparPopoverRef="pop-async" (openChange)="onAsyncOpen($event)">
          Load details
        </button>
      </div>
      <pre class="code"><code>{{ asyncCode }}</code></pre>
    </section>

    <!-- ── 8. Controlled from elsewhere ────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Controlled from elsewhere</h2>
      <p class="section-desc">
        Drive open state from any control via <code class="inline-code">[openControlled]</code>, and read every
        transition back through <code class="inline-code">(openChange)</code>.
      </p>
      <div class="preview preview--baseline">
        <button class="plain-btn plain-btn--accent" (click)="ext.set(!ext())">
          {{ ext() ? 'Close' : 'Open' }} from here
        </button>
        <tulpar-popover id="pop-ext">
          <p class="pop-text">This surface was opened by the button on the left, not by its anchor.</p>
        </tulpar-popover>
        <button
          class="plain-btn"
          tulparPopoverRef="pop-ext"
          [openControlled]="ext()"
          (openChange)="ext.set($event)"
        >
          Anchor
        </button>
        <span class="state-badge" [class.state-badge--on]="ext()">{{ ext() ? 'open' : 'closed' }}</span>
      </div>
      <pre class="code"><code>{{ controlledCode }}</code></pre>
    </section>

    <!-- ── 9. Nested tooltip-in-popover ────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Nested tooltip inside a popover</h2>
      <p class="section-desc">
        Overlays stack. A tooltip inside an open popover closes first on <kbd>Esc</kbd>; a second
        <kbd>Esc</kbd> closes the popover. Hover the control inside the surface to see the inner tip.
      </p>
      <div class="preview">
        <tulpar-popover id="pop-nested" label="Project settings">
          <div class="pop-menu">
            <button class="pop-menu-item" tulparTooltip="Controls who can see this project">
              <span>Visibility</span>
              <lucide-angular [img]="HelpCircle" [size]="14" />
            </button>
            <button class="pop-menu-item" tulparTooltip="Email + in-app alerts for this project">
              <span>Notifications</span>
              <lucide-angular [img]="HelpCircle" [size]="14" />
            </button>
          </div>
        </tulpar-popover>
        <button class="plain-btn" tulparPopoverRef="pop-nested">
          <lucide-angular [img]="Settings2" [size]="15" />
          Settings
        </button>
      </div>
      <pre class="code"><code>{{ nestedCode }}</code></pre>
    </section>

    <!-- ── Footnote ────────────────────────────────────────────────────── -->
    <section class="doc-section doc-section--note">
      <p class="note">
        <strong>Non-modal by design</strong> — the popover never traps focus or locks scroll. A future
        <code class="inline-code">&lt;tulpar-dialog&gt;</code> covers the modal case.
        <strong>Dark mode</strong> recolours the surface via tokens; <strong>reduced motion</strong> drops the
        animation.
      </p>
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
        max-width: 680px;
        line-height: 1.6;
      }

      .hero {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        align-items: center;
        padding: 36px 28px;
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

      .doc-section--note {
        padding-bottom: 0;
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
        max-width: 660px;
        line-height: 1.6;
      }

      .preview {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-bottom: none;
        border-radius: 6px 6px 0 0;
        padding: 28px 24px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
      }

      .preview--baseline {
        align-items: baseline;
      }

      .plain-btn {
        appearance: none;
        font: inherit;
        font-size: 13px;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px 14px;
        border-radius: 7px;
        border: 1px solid var(--tulpar-color-border-strong, #b9c4c2);
        background: var(--tulpar-color-bg-elevated, #fff);
        color: var(--tulpar-color-text-primary, #15110b);
        cursor: pointer;
        transition: border-color 120ms ease-out;
      }

      .plain-btn:hover {
        border-color: var(--tulpar-color-brand-default, #00c57a);
      }

      .plain-btn:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, rgba(0, 197, 122, 0.5));
        outline-offset: 2px;
      }

      .plain-btn--accent {
        border-color: var(--tulpar-color-brand-default, #00c57a);
        color: var(--tulpar-color-brand-default, #00c57a);
        font-weight: 600;
      }

      .plain-btn--danger {
        border-color: var(--tulpar-color-danger-default, #d64545);
        color: var(--tulpar-color-danger-default, #d64545);
        font-weight: 600;
      }

      .edge-trigger {
        margin-left: auto;
      }

      /* ── Popover content styling (slotted light DOM) ───────────────────── */
      .acct {
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-width: 240px;
      }

      .acct-head {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 999px;
        background: var(--tulpar-color-brand-default, #00c57a);
        color: #fff;
        font-weight: 600;
        font-size: 14px;
      }

      .acct-name {
        margin: 0;
        font-weight: 600;
        font-size: 14px;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .acct-mail {
        margin: 2px 0 0;
        font-size: 12px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .acct-actions {
        display: flex;
        flex-direction: column;
        gap: 2px;
        border-top: 1px solid var(--tulpar-color-border-default, #d9e0df);
        padding-top: 10px;
      }

      .acct-link,
      .pop-menu-item {
        appearance: none;
        text-align: left;
        font: inherit;
        font-size: 13px;
        padding: 8px 10px;
        border: none;
        border-radius: 6px;
        background: transparent;
        color: var(--tulpar-color-text-primary, #15110b);
        cursor: pointer;
      }

      .acct-link:hover,
      .pop-menu-item:hover {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
      }

      .acct-link--danger {
        color: var(--tulpar-color-danger-default, #d64545);
      }

      .pop-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
        min-width: 260px;
      }

      .pop-label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .pop-input {
        height: 38px;
        padding: 0 12px;
        border: 1px solid var(--tulpar-color-border-strong, #b9c4c2);
        border-radius: 7px;
        background: var(--tulpar-color-bg-elevated, #fff);
        color: var(--tulpar-color-text-primary, #15110b);
        font: inherit;
        font-size: 14px;
      }

      .pop-input:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, rgba(0, 197, 122, 0.5));
        outline-offset: 1px;
        border-color: var(--tulpar-color-brand-default, #00c57a);
      }

      .pop-row {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .pop-text {
        margin: 0;
        max-width: 280px;
        font-size: 13px;
        line-height: 1.6;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .pop-menu {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 220px;
      }

      .pop-menu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .scroll-body {
        display: flex;
        flex-direction: column;
        gap: 2px;
        width: 280px;
        max-height: 220px;
        overflow-y: auto;
      }

      .activity-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 6px;
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #57534e);
        border-bottom: 1px solid var(--tulpar-color-border-default, #d9e0df);
      }

      .activity-dot {
        flex: none;
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--tulpar-color-brand-default, #00c57a);
      }

      .async-body {
        min-width: 240px;
        min-height: 48px;
        display: flex;
        align-items: center;
      }

      .async-loading {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .state-badge {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .state-badge--on {
        background: color-mix(in srgb, var(--tulpar-color-brand-default, #00c57a) 18%, transparent);
        color: var(--tulpar-color-brand-default, #00c57a);
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

      .inline-code {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.85em;
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 3px;
        padding: 1px 5px;
        color: var(--tulpar-color-text-primary, #15110b);
      }

      kbd {
        display: inline-block;
        padding: 1px 5px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 3px;
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 11px;
        background: var(--tulpar-color-bg-elevated, #fff);
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .note {
        margin: 0;
        font-size: 14px;
        line-height: 1.7;
        color: var(--tulpar-color-text-secondary, #57534e);
        padding: 16px 18px;
        border-left: 3px solid var(--tulpar-color-brand-default, #00c57a);
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        border-radius: 0 8px 8px 0;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .spin-icon {
        display: inline-flex;
        animation: spin 1s linear infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .spin-icon {
          animation: none;
        }
      }
    `,
  ],
})
export class PopoverDemoComponent {
  protected readonly Settings2 = Settings2;
  protected readonly UserRound = UserRound;
  protected readonly Filter = Filter;
  protected readonly Bell = Bell;
  protected readonly HelpCircle = HelpCircle;
  protected readonly Loader2 = Loader2;

  protected readonly activity = Array.from({ length: 12 }, (_, i) => i + 1);

  protected readonly renamed = signal<string | null>(null);
  protected readonly ext = signal(false);
  protected readonly asyncLoaded = signal(false);
  protected readonly loadedText =
    'Fetched after open: this project has 4 collaborators, 218 commits, and was last deployed 2 hours ago.';

  protected onRename(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const name = String(new FormData(form).get('name') ?? '');
    this.renamed.set(name || '(empty)');
  }

  protected onAsyncOpen(open: boolean): void {
    if (!open) {
      // Reset so re-opening shows the loading state again.
      this.asyncLoaded.set(false);
      return;
    }
    setTimeout(() => {
      this.asyncLoaded.set(true);
      const el = document.getElementById('pop-async') as (HTMLElement & { reposition?(): void }) | null;
      el?.reposition?.();
    }, 700);
  }

  protected readonly refCode = REF_CODE;
  protected readonly inlineCode = INLINE_CODE;
  protected readonly formCode = FORM_CODE;
  protected readonly toneCode = TONE_CODE;
  protected readonly flipCode = FLIP_CODE;
  protected readonly scrollCode = SCROLL_CODE;
  protected readonly asyncCode = ASYNC_CODE;
  protected readonly controlledCode = CONTROLLED_CODE;
  protected readonly nestedCode = NESTED_CODE;
}
