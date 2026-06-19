import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import {
  TulparButtonComponent,
  TulparToggletipDirective,
  TulparToggletipRefDirective,
} from '@tulpar-ui/angular';
import {
  LucideAngularModule,
  Info,
  CircleCheck,
  TriangleAlert,
  CircleAlert,
  HelpCircle,
} from 'lucide-angular';

// ─── Code snippet strings ─────────────────────────────────────────────────────

const INTRO_CODE = `<!-- A toggletip is CLICK-triggered (a tooltip is hover-triggered).
     Because it appears on an explicit action, its content is announced via
     a polite aria-live region. Focus never enters the bubble; Esc closes it
     and returns focus to the trigger. -->
<button tulparToggletip="This metric counts active users in the last 28 days.">
  What is MAU?
</button>`;

const TONE_CODE = `<!-- Five tones, each pairing a status icon (slot="icon") with the bubble.
     The directive value is the text; project the icon as a child of the host?
     No — the icon goes in the declared element. For the inline directive use
     the text + tone; for an icon use the Ref form (see below). -->
<button tulparToggletip="Synced 2 minutes ago." toggletipTone="neutral">Neutral</button>
<button tulparToggletip="Your changes were saved." toggletipTone="success">Success</button>
<button tulparToggletip="Read replicas may lag briefly." toggletipTone="info">Info</button>
<button tulparToggletip="This plan expires in 3 days." toggletipTone="warning">Warning</button>
<button tulparToggletip="Two payments failed this cycle." toggletipTone="danger">Danger</button>`;

const TONE_ICON_CODE = `<!-- For a status ICON inside the bubble, declare the element and reference it.
     The icon lives in slot="icon"; the bubble inherits the tone. -->
<tulpar-toggletip id="tt-success" tone="success">
  <lucide-angular slot="icon" [img]="CircleCheck" [size]="16" />
  Your changes were saved to the server.
</tulpar-toggletip>
<button tulparToggletipRef="tt-success">Save status</button>`;

const PLACEMENT_CODE = `<!-- Same side-align grammar as the tooltip, plus auto. Arrow on by default. -->
<button tulparToggletip="Opens above"  toggletipPlacement="top">top</button>
<button tulparToggletip="Opens right"  toggletipPlacement="right">right</button>
<button tulparToggletip="No arrow" [toggletipArrow]="false">arrow off</button>
<button tulparToggletip="Best-fit side" toggletipPlacement="auto">auto</button>`;

const MARKUP_CODE = `<!-- Brief text via the directive value… -->
<button tulparToggletip="A short, plain-text explanation.">Brief</button>

<!-- …or short markup via the declared element + Ref. Keep it NON-interactive
     (no links/buttons) — a toggletip is a disclosure, not a dialog. -->
<tulpar-toggletip id="tt-markup">
  <strong>Heads up:</strong> billing runs on the 1st of each month.
</tulpar-toggletip>
<button tulparToggletipRef="tt-markup">Short markup</button>`;

const KEYBOARD_CODE = `<!-- The trigger is a real button, so Enter / Space toggle it natively.
     Esc closes the bubble and returns focus to the trigger. Focus never
     moves into the bubble (it is non-interactive). -->
<button tulparToggletip="Press Esc to close — focus returns right here.">
  Keyboard demo
</button>`;

@Component({
  selector: 'app-toggletip-demo',
  standalone: true,
  imports: [
    TulparButtonComponent,
    TulparToggletipDirective,
    TulparToggletipRefDirective,
    LucideAngularModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── Page header ─────────────────────────────────────────────────── -->
    <header class="page-header">
      <span class="page-tag">Overlay · Directive</span>
      <h1 class="page-title">Toggletip</h1>
      <p class="page-lede">
        A click-triggered disclosure bubble — <code class="inline-code">[tulparToggletip]</code> attaches a
        <code class="inline-code">&lt;tulpar-toggletip&gt;</code> to any host. Unlike a tooltip it toggles on
        click, announces via a polite live region, carries a semantic <em>tone</em>, and returns focus on
        <kbd>Esc</kbd>. Content is brief and non-interactive.
      </p>
    </header>

    <!-- ── Hero ────────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <div class="hero">
        <tulpar-button-ng
          severity="secondary"
          variant="outlined"
          tulparToggletip="Monthly Active Users — distinct users with at least one session in the last 28 days."
          toggletipTone="info"
        >
          <lucide-angular slot="start" [img]="HelpCircle" [size]="16" />
          What is MAU?
        </tulpar-button-ng>
      </div>
    </section>

    <!-- ── 1. Intro ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Click to disclose</h2>
      <p class="section-desc">
        Click (or <kbd>Enter</kbd>/<kbd>Space</kbd>) toggles the bubble. An outside click or <kbd>Esc</kbd>
        dismisses it. The content is announced through a pre-inserted <code class="inline-code">aria-live</code>
        region, so screen readers hear it without focus moving in.
      </p>
      <div class="preview">
        <button class="plain-btn" tulparToggletip="This metric counts active users in the last 28 days.">
          What is MAU?
        </button>
      </div>
      <pre class="code"><code>{{ introCode }}</code></pre>
    </section>

    <!-- ── 2. Tone showcase ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Tone showcase</h2>
      <p class="section-desc">
        Five tones via <code class="inline-code">[toggletipTone]</code>:
        <code class="inline-code">neutral · info · success · warning · danger</code>. The inline form sets the
        tone on the text bubble; the icon variants below declare the element so a status icon can sit in
        <code class="inline-code">slot="icon"</code>.
      </p>
      <div class="preview">
        <button class="plain-btn" tulparToggletip="Synced 2 minutes ago." toggletipTone="neutral">Neutral</button>
        <button class="plain-btn" tulparToggletip="Read replicas may lag briefly." toggletipTone="info">Info</button>
        <button class="plain-btn" tulparToggletip="Your changes were saved." toggletipTone="success">Success</button>
        <button class="plain-btn" tulparToggletip="This plan expires in 3 days." toggletipTone="warning">Warning</button>
        <button class="plain-btn" tulparToggletip="Two payments failed this cycle." toggletipTone="danger">Danger</button>
      </div>
      <pre class="code"><code>{{ toneCode }}</code></pre>
    </section>

    <!-- ── 3. Tone + status icon (Ref form) ────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Tone with a status icon</h2>
      <p class="section-desc">
        To pair a tone with an icon, declare a <code class="inline-code">&lt;tulpar-toggletip&gt;</code> with
        an icon in <code class="inline-code">slot="icon"</code> and reference it via
        <code class="inline-code">[tulparToggletipRef]</code>.
      </p>
      <div class="preview preview--baseline">
        <tulpar-toggletip id="tt-info" tone="info">
          <lucide-angular slot="icon" [img]="Info" [size]="16" />
          Read replicas may lag a few seconds behind the primary.
        </tulpar-toggletip>
        <button class="plain-btn" tulparToggletipRef="tt-info">Replica lag</button>

        <tulpar-toggletip id="tt-success" tone="success">
          <lucide-angular slot="icon" [img]="CircleCheck" [size]="16" />
          Your changes were saved to the server.
        </tulpar-toggletip>
        <button class="plain-btn" tulparToggletipRef="tt-success">Save status</button>

        <tulpar-toggletip id="tt-warning" tone="warning">
          <lucide-angular slot="icon" [img]="TriangleAlert" [size]="16" />
          Your trial ends in 3 days — add a card to avoid interruption.
        </tulpar-toggletip>
        <button class="plain-btn" tulparToggletipRef="tt-warning">Trial</button>

        <tulpar-toggletip id="tt-danger" tone="danger">
          <lucide-angular slot="icon" [img]="CircleAlert" [size]="16" />
          Two payments failed this billing cycle.
        </tulpar-toggletip>
        <button class="plain-btn" tulparToggletipRef="tt-danger">Billing</button>
      </div>
      <pre class="code"><code>{{ toneIconCode }}</code></pre>
    </section>

    <!-- ── 4. Placement + arrow ────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Placement &amp; arrow</h2>
      <p class="section-desc">
        The same collision-aware <code class="inline-code">side-align</code> grammar as the tooltip, plus
        <code class="inline-code">auto</code>. The arrow is on by default — drop it with
        <code class="inline-code">[toggletipArrow]="false"</code>.
      </p>
      <div class="preview preview--baseline">
        <button class="plain-btn" tulparToggletip="Opens above the trigger" toggletipPlacement="top">top</button>
        <button class="plain-btn" tulparToggletip="Opens to the right" toggletipPlacement="right">right</button>
        <button class="plain-btn" tulparToggletip="Opens below" toggletipPlacement="bottom">bottom</button>
        <button class="plain-btn" tulparToggletip="No arrow on this one" [toggletipArrow]="false">arrow off</button>
        <button class="plain-btn" tulparToggletip="Best-fit side picked automatically" toggletipPlacement="auto">auto</button>
      </div>
      <pre class="code"><code>{{ placementCode }}</code></pre>
    </section>

    <!-- ── 5. Brief vs short markup ────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Brief text vs short markup</h2>
      <p class="section-desc">
        Pass plain text via the directive value for the trivial case, or declare the element with light markup
        (kept non-interactive) and reference it. Both stay terse — a toggletip is a disclosure, not a dialog.
      </p>
      <div class="preview preview--baseline">
        <button class="plain-btn" tulparToggletip="A short, plain-text explanation.">Brief</button>

        <tulpar-toggletip id="tt-markup">
          <span><strong>Heads up:</strong> billing runs on the 1st of each month.</span>
        </tulpar-toggletip>
        <button class="plain-btn" tulparToggletipRef="tt-markup">Short markup</button>
      </div>
      <pre class="code"><code>{{ markupCode }}</code></pre>
    </section>

    <!-- ── 6. Keyboard ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Keyboard — Enter/Space toggle, Esc returns focus</h2>
      <p class="section-desc">
        The trigger is a native button, so <kbd>Enter</kbd> and <kbd>Space</kbd> toggle it. <kbd>Esc</kbd>
        closes the bubble and moves focus back to the trigger. Try it: tab to the button, press
        <kbd>Enter</kbd>, then <kbd>Esc</kbd>.
      </p>
      <div class="preview">
        <button class="plain-btn" tulparToggletip="Press Esc to close — focus returns right here.">
          Keyboard demo
        </button>
      </div>
      <pre class="code"><code>{{ keyboardCode }}</code></pre>
    </section>

    <!-- ── Footnote ────────────────────────────────────────────────────── -->
    <section class="doc-section doc-section--note">
      <p class="note">
        <strong>Dark mode</strong> recolours the bubble and tone accents via semantic tokens.
        <strong>Reduced motion</strong> suppresses the open/close animation.
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
        max-width: 660px;
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
        max-width: 640px;
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
    `,
  ],
})
export class ToggletipDemoComponent {
  protected readonly Info = Info;
  protected readonly CircleCheck = CircleCheck;
  protected readonly TriangleAlert = TriangleAlert;
  protected readonly CircleAlert = CircleAlert;
  protected readonly HelpCircle = HelpCircle;

  protected readonly introCode = INTRO_CODE;
  protected readonly toneCode = TONE_CODE;
  protected readonly toneIconCode = TONE_ICON_CODE;
  protected readonly placementCode = PLACEMENT_CODE;
  protected readonly markupCode = MARKUP_CODE;
  protected readonly keyboardCode = KEYBOARD_CODE;
}
