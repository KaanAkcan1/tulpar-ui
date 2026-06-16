import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  signal,
} from '@angular/core';
import { TulparButtonComponent } from '@tulpar-ui/angular';
import '@tulpar-ui/core/button-group';
import {
  LucideAngularModule,
  Check,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Crown,
  Mail,
  Settings,
  Save,
  Download,
  Heart,
  Plus,
  Sparkles,
  Loader2,
} from 'lucide-angular';

// ─── Demo icon component for Pattern 2 (named-component [icon] prop) ──
@Component({
  selector: 'app-check-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-angular [img]="iconData" [size]="size()"></lucide-angular>`,
})
class AppCheckIcon {
  readonly iconData = Check;
  size = input(16);
}

// ─── Code snippet strings (defined outside @Component to avoid backtick nesting) ──

const SEVERITY_CODE = `<tulpar-button-ng severity="primary">Primary</tulpar-button-ng>
<tulpar-button-ng severity="secondary">Secondary</tulpar-button-ng>
<tulpar-button-ng severity="info">Info</tulpar-button-ng>
<tulpar-button-ng severity="success">Success</tulpar-button-ng>
<tulpar-button-ng severity="warn">Warn</tulpar-button-ng>
<tulpar-button-ng severity="help">Help</tulpar-button-ng>
<tulpar-button-ng severity="danger">Danger</tulpar-button-ng>
<tulpar-button-ng severity="contrast">Contrast</tulpar-button-ng>
<tulpar-button-ng severity="premium">Premium</tulpar-button-ng>`;

const VARIANT_CODE = `<tulpar-button-ng variant="solid">Solid</tulpar-button-ng>
<tulpar-button-ng variant="outlined">Outlined</tulpar-button-ng>
<tulpar-button-ng variant="tonal">Tonal</tulpar-button-ng>
<tulpar-button-ng variant="ghost">Ghost</tulpar-button-ng>
<tulpar-button-ng variant="link">Link</tulpar-button-ng>`;

const SIZE_CODE = `<tulpar-button-ng size="xs">Extra Small</tulpar-button-ng>
<tulpar-button-ng size="sm">Small</tulpar-button-ng>
<tulpar-button-ng size="md">Medium</tulpar-button-ng>
<tulpar-button-ng size="lg">Large</tulpar-button-ng>
<tulpar-button-ng size="xl">Extra Large</tulpar-button-ng>
<tulpar-button-ng size="2xl">2XL</tulpar-button-ng>
<tulpar-button-ng size="3xl">3XL</tulpar-button-ng>`;

const COLOR_CODE = `<tulpar-button-ng color="ulgen">Ulgen</tulpar-button-ng>
<tulpar-button-ng color="otuken">Otuken</tulpar-button-ng>
<tulpar-button-ng color="kizagan">Kizagan</tulpar-button-ng>
<tulpar-button-ng color="kam">Kam</tulpar-button-ng>
<tulpar-button-ng color="yersu" variant="outlined">Yersu Outlined</tulpar-button-ng>
<tulpar-button-ng color="erlik" variant="tonal">Erlik Tonal</tulpar-button-ng>`;

const SHAPE_CODE = `<!-- Default (rectangle) -->
<tulpar-button-ng shape="default">Default</tulpar-button-ng>

<!-- Round (pill) -->
<tulpar-button-ng shape="round">Round</tulpar-button-ng>

<!-- Circle (icon-only) — slot pattern + explicit [iconOnly]="true" -->
<tulpar-button-ng shape="circle" ariaLabel="Add item" [iconOnly]="true">
  <lucide-angular slot="start" [img]="Plus" [size]="16"></lucide-angular>
</tulpar-button-ng>`;

const ICONS_CODE = `<!-- Leading icon via slot="start" -->
<tulpar-button-ng severity="success">
  <lucide-angular slot="start" [img]="Check" [size]="16"></lucide-angular>
  Save
</tulpar-button-ng>

<!-- Trailing icon via slot="end" -->
<tulpar-button-ng severity="primary">
  Continue
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>

<!-- Both: slot="start" for leading, slot="end" for trailing -->
<tulpar-button-ng severity="primary">
  <lucide-angular slot="start" [img]="Check" [size]="16"></lucide-angular>
  Save and continue
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>`;

const ICON_ONLY_CODE = `<!-- Icon-only: slot="start" pattern + explicit [iconOnly]="true" -->
<tulpar-button-ng severity="danger" ariaLabel="Delete item" [iconOnly]="true">
  <lucide-angular slot="start" [img]="Trash2" [size]="16"></lucide-angular>
</tulpar-button-ng>
<tulpar-button-ng severity="secondary" ariaLabel="Settings" [iconOnly]="true">
  <lucide-angular slot="start" [img]="Settings" [size]="16"></lucide-angular>
</tulpar-button-ng>

<!-- Icon-only + circle shape -->
<tulpar-button-ng severity="success" shape="circle" ariaLabel="Save" [iconOnly]="true">
  <lucide-angular slot="start" [img]="Save" [size]="16"></lucide-angular>
</tulpar-button-ng>

<!-- Explicit iconOnly + round shape -->
<tulpar-button-ng severity="premium" [iconOnly]="true" shape="round" ariaLabel="Premium">
  <lucide-angular slot="start" [img]="Crown" [size]="16"></lucide-angular>
</tulpar-button-ng>`;

const ICON_POSITION_CODE = `<!-- Start (default) -->
<tulpar-button-ng iconPosition="start" size="lg">
  <lucide-angular slot="start" [img]="Check" [size]="18"></lucide-angular>
  Confirm
</tulpar-button-ng>

<!-- Top -->
<tulpar-button-ng iconPosition="top" size="lg">
  <lucide-angular slot="start" [img]="Check" [size]="18"></lucide-angular>
  Confirm
</tulpar-button-ng>

<!-- Bottom -->
<tulpar-button-ng iconPosition="bottom" size="lg">
  <lucide-angular slot="start" [img]="Check" [size]="18"></lucide-angular>
  Confirm
</tulpar-button-ng>

<!-- End — use slot="end" -->
<tulpar-button-ng iconPosition="end" size="lg">
  Confirm
  <span slot="end"><lucide-angular [img]="Check" [size]="18"></lucide-angular></span>
</tulpar-button-ng>`;

const ICON_SEPARATOR_CODE = `<!-- Outlined + separator + leading icon -->
<tulpar-button-ng variant="outlined" [iconSeparator]="true">
  <lucide-angular slot="start" [img]="Download" [size]="16"></lucide-angular>
  Download
</tulpar-button-ng>

<!-- Tonal + separator + both icons (leading + trailing via slots) -->
<tulpar-button-ng variant="tonal" [iconSeparator]="true">
  <lucide-angular slot="start" [img]="ArrowLeft" [size]="16"></lucide-angular>
  Navigate
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>

<!-- Solid + separator + trailing icon -->
<tulpar-button-ng variant="solid" [iconSeparator]="true">
  Next
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>`;

const MODIFIERS_CODE = `<!-- Raised solid -->
<tulpar-button-ng [raised]="true">Raised Solid</tulpar-button-ng>

<!-- Raised outlined -->
<tulpar-button-ng [raised]="true" variant="outlined">Raised Outlined</tulpar-button-ng>

<!-- Block (full-width) -->
<tulpar-button-ng [block]="true">Block Button</tulpar-button-ng>

<!-- Block + justify=between with icons -->
<tulpar-button-ng [block]="true" justify="between">
  <lucide-angular slot="start" [img]="Mail" [size]="16"></lucide-angular>
  Send Email
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>`;

const LOADING_CODE = `<!-- Loading (default center) -->
<tulpar-button-ng [loading]="true">Save</tulpar-button-ng>

<!-- Loading position start -->
<tulpar-button-ng [loading]="true" loadingPosition="start">Save</tulpar-button-ng>

<!-- Loading position end -->
<tulpar-button-ng [loading]="true" loadingPosition="end">Save</tulpar-button-ng>

<!-- Loading with label -->
<tulpar-button-ng [loading]="true" loadingLabel="Saving…">Save</tulpar-button-ng>

<!-- Loading with custom icon (Loader2 spinning) -->
<tulpar-button-ng [loading]="true" severity="success">
  <span slot="loading-icon" class="spin-icon">
    <lucide-angular [img]="Loader2" [size]="16"></lucide-angular>
  </span>
  Upload
</tulpar-button-ng>`;

const DISABLED_CODE = `<!-- Regular disabled (no interaction) -->
<tulpar-button-ng [disabled]="true">Disabled</tulpar-button-ng>

<!-- data-disabled (click still fires — useful with tooltip wrapper) -->
<div title="You need edit permissions to perform this action">
  <tulpar-button-ng [dataDisabled]="true" (clicked)="onDataDisabledClick()">
    Restricted Action
  </tulpar-button-ng>
</div>`;

const POLYMORPHISM_CODE = `<!-- External link — renders as <a> -->
<tulpar-button-ng href="https://example.com" target="_blank" rel="noopener noreferrer">
  <span slot="start"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
  Visit Example
</tulpar-button-ng>

<!-- Internal link -->
<tulpar-button-ng href="/dashboard" severity="secondary" variant="outlined">
  Go to Dashboard
</tulpar-button-ng>`;

const FORM_CODE = `<form (submit)="onSubmit($event)">
  <input name="email" type="email" placeholder="your@email.com" />
  <tulpar-button-ng type="submit" severity="primary">
    <lucide-angular slot="start" [img]="Mail" [size]="16"></lucide-angular>
    Submit
  </tulpar-button-ng>
  <tulpar-button-ng type="reset" severity="secondary" variant="outlined">
    Reset
  </tulpar-button-ng>
</form>`;

const BUTTON_GROUP_CODE = `<!-- Horizontal group (ArrowLeft/Right navigation) -->
<tulpar-button-group>
  <tulpar-button severity="secondary" variant="outlined">Day</tulpar-button>
  <tulpar-button severity="secondary" variant="outlined">Week</tulpar-button>
  <tulpar-button severity="secondary" variant="outlined">Month</tulpar-button>
</tulpar-button-group>

<!-- Stacked group (ArrowUp/Down navigation) -->
<tulpar-button-group stacked>
  <tulpar-button severity="secondary" variant="ghost">Edit profile</tulpar-button>
  <tulpar-button severity="secondary" variant="ghost">Settings</tulpar-button>
  <tulpar-button severity="danger" variant="ghost">Sign out</tulpar-button>
</tulpar-button-group>

<!-- Keyboard navigation:
  Horizontal: ArrowLeft / ArrowRight
  Stacked:    ArrowUp / ArrowDown
  Both:       Home (first) / End (last) -->`;

const PREMIUM_CODE = `<!-- Solid premium — ulgen antique-gold marketing CTA -->
<tulpar-button-ng severity="premium">
  <lucide-angular slot="start" [img]="Crown" [size]="16"></lucide-angular>
  Upgrade to Pro
</tulpar-button-ng>

<!-- Tonal premium — softer CTA -->
<tulpar-button-ng severity="premium" variant="tonal">
  <lucide-angular slot="start" [img]="Sparkles" [size]="16"></lucide-angular>
  Get early access
</tulpar-button-ng>

<!-- Larger icon for premium large CTA -->
<tulpar-button-ng severity="premium" size="lg">
  <lucide-angular slot="start" [img]="Crown" [size]="24"></lucide-angular>
  Go Pro
</tulpar-button-ng>

<!-- premium = ulgen antique-gold accent, distinct from primary (tulpar green)
     Light theme: ulgen.500 bg + dark ink
     Hover: brightens (ulgen.500 -> .400 -> .300) -->`;

const ICON_PROP_CODE = `<!-- Pattern 2: [icon] accepts an Angular component class (Type<unknown>) -->
<!-- The component is rendered via NgComponentOutlet in slot="start" -->
<!-- It receives a 'size' input bound to the button's icon-size scale -->

// Define a reusable icon component
@Component({
  selector: 'app-check-icon',
  standalone: true,
  imports: [LucideAngularModule],
  template: \`<lucide-angular [img]="iconData" [size]="size()"></lucide-angular>\`,
})
class AppCheckIcon {
  readonly iconData = Check;
  size = input(16);
}

// Then expose it on the host component:
//   readonly AppCheckIcon = AppCheckIcon;
<tulpar-button-ng [icon]="AppCheckIcon">Save (named)</tulpar-button-ng>

<!-- [iconSize] override is forwarded to the component's 'size' input -->
<tulpar-button-ng [icon]="AppCheckIcon" [iconSize]="24" size="lg">Save large</tulpar-button-ng>`;

const TOOLTIP_CODE = `<!-- Tooltip on icon-only button (fills the a11y gap) -->
<tulpar-button-ng tooltip="Open settings" ariaLabel="Open settings" [iconOnly]="true">
  <lucide-angular slot="start" [img]="Settings" [size]="16"></lucide-angular>
</tulpar-button-ng>

<!-- Tooltip on a labelled button -->
<tulpar-button-ng severity="danger" tooltip="Permanently delete this item">
  <lucide-angular slot="start" [img]="Trash2" [size]="16"></lucide-angular>
  Delete
</tulpar-button-ng>

<!-- Tooltip on an anchor button -->
<tulpar-button-ng
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  tooltip="Opens in a new tab"
>
  Visit Example
</tulpar-button-ng>`;

const SLOT_ESCAPE_HATCH_CODE = `<!-- Non-Lucide libraries (Heroicons, Tabler, custom SVG) -->
<!-- Project any element/component into slot="start" or slot="end" -->
<tulpar-button-ng severity="primary">
  <span slot="start">
    <!-- Any component or SVG; you control sizing via class/style -->
    <my-hero-icon class="w-4 h-4"></my-hero-icon>
  </span>
  Save with Heroicon
</tulpar-button-ng>

<!-- Multi-icon pattern (two icons) — slots are the only option;
     [icon] (Pattern 2) supports a single leading icon component only -->
<tulpar-button-ng severity="secondary" variant="outlined">
  <span slot="start"><lucide-angular [img]="ArrowLeft" [size]="16"></lucide-angular></span>
  Navigate
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>`;

@Component({
  selector: 'app-button-demo',
  standalone: true,
  // AppCheckIcon is intentionally NOT in imports: its selector never appears in
  // this template — it is rendered dynamically via NgComponentOutlet inside the
  // button wrapper ([icon] class-reference binding).
  imports: [TulparButtonComponent, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- ── 1. Severity ─────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">1. Severity</h2>
      <p class="section-desc">
        Nine semantic severity values covering the full intent palette. Default variant is
        <code class="inline-code">solid</code>.
      </p>
      <div class="preview">
        <tulpar-button-ng severity="primary">Primary</tulpar-button-ng>
        <tulpar-button-ng severity="secondary">Secondary</tulpar-button-ng>
        <tulpar-button-ng severity="info">Info</tulpar-button-ng>
        <tulpar-button-ng severity="success">Success</tulpar-button-ng>
        <tulpar-button-ng severity="warn">Warn</tulpar-button-ng>
        <tulpar-button-ng severity="help">Help</tulpar-button-ng>
        <tulpar-button-ng severity="danger">Danger</tulpar-button-ng>
        <tulpar-button-ng severity="contrast">Contrast</tulpar-button-ng>
        <tulpar-button-ng severity="premium">Premium</tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ severityCode }}</code></pre>
    </section>

    <!-- ── 2. Variant ──────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">2. Variant</h2>
      <p class="section-desc">
        Five rendering styles. All examples use
        <code class="inline-code">severity="primary"</code>.
      </p>
      <div class="preview">
        <tulpar-button-ng variant="solid">Solid</tulpar-button-ng>
        <tulpar-button-ng variant="outlined">Outlined</tulpar-button-ng>
        <tulpar-button-ng variant="tonal">Tonal</tulpar-button-ng>
        <tulpar-button-ng variant="ghost">Ghost</tulpar-button-ng>
        <tulpar-button-ng variant="link">Link</tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ variantCode }}</code></pre>
    </section>

    <!-- ── 3. Size ─────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">3. Size</h2>
      <p class="section-desc">
        Seven sizes from <code class="inline-code">xs</code> to
        <code class="inline-code">3xl</code>. Default is <code class="inline-code">md</code>.
      </p>
      <div class="preview preview--baseline">
        <tulpar-button-ng size="xs">Extra Small</tulpar-button-ng>
        <tulpar-button-ng size="sm">Small</tulpar-button-ng>
        <tulpar-button-ng size="md">Medium</tulpar-button-ng>
        <tulpar-button-ng size="lg">Large</tulpar-button-ng>
        <tulpar-button-ng size="xl">Extra Large</tulpar-button-ng>
        <tulpar-button-ng size="2xl">2XL</tulpar-button-ng>
        <tulpar-button-ng size="3xl">3XL</tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ sizeCode }}</code></pre>
    </section>

    <!-- ── 4. Color override ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">4. Color override</h2>
      <p class="section-desc">
        The <code class="inline-code">color</code> prop overrides the severity's palette with any
        design-system color. Severity remains as a DOM hint for accessibility semantics.
      </p>
      <div class="preview">
        <tulpar-button-ng color="ulgen">Ulgen</tulpar-button-ng>
        <tulpar-button-ng color="otuken">Otuken</tulpar-button-ng>
        <tulpar-button-ng color="kizagan">Kizagan</tulpar-button-ng>
        <tulpar-button-ng color="kam">Kam</tulpar-button-ng>
        <tulpar-button-ng color="yersu" variant="outlined">Yersu Outlined</tulpar-button-ng>
        <tulpar-button-ng color="erlik" variant="tonal">Erlik Tonal</tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ colorCode }}</code></pre>
    </section>

    <!-- ── 5. Shape ────────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">5. Shape</h2>
      <p class="section-desc">
        <code class="inline-code">default</code> (rectangle),
        <code class="inline-code">round</code> (pill), and
        <code class="inline-code">circle</code> (icon-only).
      </p>
      <div class="preview">
        <tulpar-button-ng shape="default">Default</tulpar-button-ng>
        <tulpar-button-ng shape="round">Round</tulpar-button-ng>
        <tulpar-button-ng shape="circle" ariaLabel="Add item" [iconOnly]="true">
          <lucide-angular slot="start" [img]="Plus" [size]="16"></lucide-angular>
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ shapeCode }}</code></pre>
    </section>

    <!-- ── 6. Icons — leading, trailing, both ──────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">6. Icons — leading, trailing, both</h2>
      <p class="section-desc">
        Project a Lucide icon into <code class="inline-code">slot="start"</code> for a leading icon,
        or <code class="inline-code">slot="end"</code> for a trailing icon. For multi-icon layouts,
        combine both slots on the same button.
      </p>
      <div class="preview">
        <tulpar-button-ng severity="success">
          <lucide-angular slot="start" [img]="Check" [size]="16"></lucide-angular>
          Save
        </tulpar-button-ng>
        <tulpar-button-ng severity="primary">
          Continue
          <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
        </tulpar-button-ng>
        <tulpar-button-ng severity="primary">
          <lucide-angular slot="start" [img]="Check" [size]="16"></lucide-angular>
          Save and continue
          <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ iconsCode }}</code></pre>
    </section>

    <!-- ── 7. Icon-only ────────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">7. Icon-only</h2>
      <p class="section-desc">
        Project a single icon into <code class="inline-code">slot="start"</code> and set
        <code class="inline-code">[iconOnly]="true"</code> explicitly when there's no text. Always
        include <code class="inline-code">ariaLabel</code> for screen reader accessibility.
      </p>
      <div class="preview preview--baseline">
        <tulpar-button-ng severity="danger" ariaLabel="Delete item" [iconOnly]="true">
          <lucide-angular slot="start" [img]="Trash2" [size]="16"></lucide-angular>
        </tulpar-button-ng>
        <tulpar-button-ng severity="secondary" ariaLabel="Settings" [iconOnly]="true">
          <lucide-angular slot="start" [img]="Settings" [size]="16"></lucide-angular>
        </tulpar-button-ng>
        <tulpar-button-ng severity="success" shape="circle" ariaLabel="Save" [iconOnly]="true">
          <lucide-angular slot="start" [img]="Save" [size]="16"></lucide-angular>
        </tulpar-button-ng>
        <tulpar-button-ng severity="premium" [iconOnly]="true" shape="round" ariaLabel="Premium">
          <lucide-angular slot="start" [img]="Crown" [size]="16"></lucide-angular>
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ iconOnlyCode }}</code></pre>
    </section>

    <!-- ── 8. Icon position ────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">8. Icon position</h2>
      <p class="section-desc">
        Control where the icon renders relative to the label:
        <code class="inline-code">start</code>, <code class="inline-code">end</code>,
        <code class="inline-code">top</code>, <code class="inline-code">bottom</code>.
      </p>
      <div class="preview preview--baseline">
        <tulpar-button-ng iconPosition="start" size="lg">
          <lucide-angular slot="start" [img]="Check" [size]="18"></lucide-angular>
          Confirm
        </tulpar-button-ng>
        <tulpar-button-ng iconPosition="end" size="lg">
          Confirm
          <span slot="end"><lucide-angular [img]="Check" [size]="18"></lucide-angular></span>
        </tulpar-button-ng>
        <tulpar-button-ng iconPosition="top" size="lg">
          <lucide-angular slot="start" [img]="Check" [size]="18"></lucide-angular>
          Confirm
        </tulpar-button-ng>
        <tulpar-button-ng iconPosition="bottom" size="lg">
          <lucide-angular slot="start" [img]="Check" [size]="18"></lucide-angular>
          Confirm
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ iconPositionCode }}</code></pre>
    </section>

    <!-- ── 9. Icon separator ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">9. Icon separator</h2>
      <p class="section-desc">
        The <code class="inline-code">iconSeparator</code> input draws a visual divider between icon
        and label. Works across all variants.
      </p>
      <div class="preview">
        <tulpar-button-ng variant="outlined" [iconSeparator]="true">
          <lucide-angular slot="start" [img]="Download" [size]="16"></lucide-angular>
          Download
        </tulpar-button-ng>
        <tulpar-button-ng variant="tonal" [iconSeparator]="true">
          <lucide-angular slot="start" [img]="ArrowLeft" [size]="16"></lucide-angular>
          Navigate
          <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
        </tulpar-button-ng>
        <tulpar-button-ng variant="solid" [iconSeparator]="true">
          Next
          <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ iconSeparatorCode }}</code></pre>
    </section>

    <!-- ── 10. Modifiers ──────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">10. Modifiers — raised, block, justify</h2>
      <p class="section-desc">
        <code class="inline-code">raised</code> adds a drop shadow.
        <code class="inline-code">block</code> stretches to full container width.
        <code class="inline-code">justify</code> controls internal content alignment.
      </p>
      <div class="preview preview--col">
        <div class="preview-row">
          <tulpar-button-ng [raised]="true">Raised Solid</tulpar-button-ng>
          <tulpar-button-ng [raised]="true" variant="outlined">Raised Outlined</tulpar-button-ng>
        </div>
        <tulpar-button-ng [block]="true">Block Button</tulpar-button-ng>
        <tulpar-button-ng [block]="true" justify="between">
          <lucide-angular slot="start" [img]="Mail" [size]="16"></lucide-angular>
          Send Email
          <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ modifiersCode }}</code></pre>
    </section>

    <!-- ── 11. Loading states ─────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">11. Loading states</h2>
      <p class="section-desc">
        The <code class="inline-code">loading</code> input disables interaction and shows a spinner.
        Control spinner position with <code class="inline-code">loadingPosition</code>. Use
        <code class="inline-code">slot="loading-icon"</code> to swap the spinner.
      </p>
      <div class="preview">
        <tulpar-button-ng [loading]="true">Save</tulpar-button-ng>
        <tulpar-button-ng [loading]="true" loadingPosition="start">Save</tulpar-button-ng>
        <tulpar-button-ng [loading]="true" loadingPosition="end">Save</tulpar-button-ng>
        <tulpar-button-ng [loading]="true" loadingLabel="Saving…">Save</tulpar-button-ng>
        <tulpar-button-ng [loading]="true" severity="success">
          <span slot="loading-icon" class="spin-icon">
            <lucide-angular [img]="Loader2" [size]="16"></lucide-angular>
          </span>
          Upload
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ loadingCode }}</code></pre>
    </section>

    <!-- ── 12. Disabled vs data-disabled ─────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">12. Disabled vs data-disabled</h2>
      <p class="section-desc">
        <code class="inline-code">disabled</code> prevents all interaction.
        <code class="inline-code">dataDisabled</code> applies disabled styling but still fires click
        events — useful when wrapping with a tooltip.
      </p>
      <div class="preview preview--baseline">
        <tulpar-button-ng [disabled]="true">Disabled</tulpar-button-ng>
        <div title="You need edit permissions to perform this action">
          <tulpar-button-ng [dataDisabled]="true" (clicked)="onDataDisabledClick()">
            Restricted Action
          </tulpar-button-ng>
        </div>
        @if (dataDisabledClicked()) {
          <span class="click-feedback">Click received!</span>
        }
      </div>
      <pre class="code"><code>{{ disabledCode }}</code></pre>
    </section>

    <!-- ── 13. Polymorphism ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">13. Polymorphism — href renders &lt;a&gt;</h2>
      <p class="section-desc">
        Pass an <code class="inline-code">href</code> input to render the button as an anchor
        element. All ARIA and keyboard semantics are preserved.
      </p>
      <div class="preview">
        <tulpar-button-ng href="https://example.com" target="_blank" rel="noopener noreferrer">
          <span slot="start"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
          Visit Example
        </tulpar-button-ng>
        <tulpar-button-ng href="/dashboard" severity="secondary" variant="outlined">
          Go to Dashboard
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ polymorphismCode }}</code></pre>
    </section>

    <!-- ── 14. Form integration ───────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">14. Form integration</h2>
      <p class="section-desc">
        <code class="inline-code">type="submit"</code> and
        <code class="inline-code">type="reset"</code> integrate with native HTML forms via
        <code class="inline-code">formAssociated</code> internals — no extra wiring needed.
      </p>
      <div class="preview preview--col">
        <form class="demo-form" (submit)="onSubmit($event)">
          <input class="demo-input" name="email" type="email" placeholder="your@email.com" />
          <tulpar-button-ng type="submit" severity="primary">
            <lucide-angular slot="start" [img]="Mail" [size]="16"></lucide-angular>
            Submit
          </tulpar-button-ng>
          <tulpar-button-ng type="reset" severity="secondary" variant="outlined">
            Reset
          </tulpar-button-ng>
        </form>
        @if (submittedEmail() !== null) {
          <p class="submit-feedback">
            Submitted: <strong>{{ submittedEmail() || '(empty)' }}</strong>
          </p>
        }
      </div>
      <pre class="code"><code>{{ formCode }}</code></pre>
    </section>

    <!-- ── 15. Button Group ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">15. Button Group — horizontal + stacked</h2>
      <p class="section-desc">
        <code class="inline-code">&lt;tulpar-button-group&gt;</code> manages roving tabindex and
        keyboard navigation. Horizontal: <kbd>ArrowLeft</kbd> / <kbd>ArrowRight</kbd>. Stacked:
        <kbd>ArrowUp</kbd> / <kbd>ArrowDown</kbd>. Both: <kbd>Home</kbd> / <kbd>End</kbd>.
      </p>
      <div class="preview preview--col">
        <div>
          <p class="preview-label">Horizontal</p>
          <tulpar-button-group>
            <tulpar-button severity="secondary" variant="outlined">Day</tulpar-button>
            <tulpar-button severity="secondary" variant="outlined">Week</tulpar-button>
            <tulpar-button severity="secondary" variant="outlined">Month</tulpar-button>
          </tulpar-button-group>
        </div>
        <div>
          <p class="preview-label">Stacked</p>
          <tulpar-button-group stacked>
            <tulpar-button severity="secondary" variant="ghost">Edit profile</tulpar-button>
            <tulpar-button severity="secondary" variant="ghost">Settings</tulpar-button>
            <tulpar-button severity="danger" variant="ghost">Sign out</tulpar-button>
          </tulpar-button-group>
        </div>
      </div>
      <pre class="code"><code>{{ buttonGroupCode }}</code></pre>
    </section>

    <!-- ── 16. Premium CTA ───────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">16. Premium CTA — the antique-gold marketing example</h2>
      <p class="section-desc">
        <code class="inline-code">severity="premium"</code> is the
        <code class="inline-code">ulgen</code> antique-gold spirit — the accent for marketing
        calls-to-action, distinct from <code class="inline-code">primary</code> (tulpar green).
      </p>
      <div class="preview preview--baseline">
        <tulpar-button-ng severity="premium">
          <lucide-angular slot="start" [img]="Crown" [size]="16"></lucide-angular>
          Upgrade to Pro
        </tulpar-button-ng>
        <tulpar-button-ng severity="premium" variant="tonal">
          <lucide-angular slot="start" [img]="Sparkles" [size]="16"></lucide-angular>
          Get early access
        </tulpar-button-ng>
        <tulpar-button-ng severity="premium" size="lg">
          <lucide-angular slot="start" [img]="Crown" [size]="24"></lucide-angular>
          Go Pro
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ premiumCode }}</code></pre>
    </section>

    <!-- ── 17. Named-component icon (Pattern 2) ─────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">17. Named-component icon (Pattern 2)</h2>
      <p class="section-desc">
        The <code class="inline-code">[icon]</code> input accepts an Angular
        <code class="inline-code">Type&lt;unknown&gt;</code> (a component class) and renders it via
        <code class="inline-code">NgComponentOutlet</code> in
        <code class="inline-code">slot="start"</code>.
      </p>
      <div class="preview preview--baseline">
        <tulpar-button-ng [icon]="AppCheckIcon">Save (named)</tulpar-button-ng>
        <tulpar-button-ng [icon]="AppCheckIcon" [iconSize]="24" size="lg"
          >Save large</tulpar-button-ng
        >
      </div>
      <pre class="code"><code>{{ iconPropCode }}</code></pre>
    </section>

    <!-- ── 18. Tooltip ───────────────────────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">18. Tooltip (v0.3.1)</h2>
      <p class="section-desc">
        Pass a string to <code class="inline-code">tooltip</code> to show an inline tooltip on hover
        and focus. Especially useful for icon-only buttons.
      </p>
      <div class="preview preview--baseline">
        <tulpar-button-ng tooltip="Open settings" ariaLabel="Open settings" [iconOnly]="true">
          <lucide-angular slot="start" [img]="Settings" [size]="16"></lucide-angular>
        </tulpar-button-ng>
        <tulpar-button-ng severity="danger" tooltip="Permanently delete this item">
          <lucide-angular slot="start" [img]="Trash2" [size]="16"></lucide-angular>
          Delete
        </tulpar-button-ng>
        <tulpar-button-ng
          href="https://example.com"
          target="_blank"
          rel="noopener noreferrer"
          tooltip="Opens in a new tab"
        >
          Visit Example
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ tooltipCode }}</code></pre>
    </section>

    <!-- ── 19. Non-Lucide icon libraries ─────────────────────────────── -->
    <section class="doc-section">
      <h2 class="section-title">19. Non-Lucide icon libraries</h2>
      <p class="section-desc">
        The slot pattern works with any icon library — Heroicons, Tabler, Material, or custom SVG.
        Project via <code class="inline-code">&lt;span slot="start"&gt;</code>.
      </p>
      <div class="preview preview--baseline">
        <tulpar-button-ng severity="primary">
          <span slot="start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </span>
          Save with custom icon
        </tulpar-button-ng>
        <tulpar-button-ng severity="secondary" variant="outlined">
          <span slot="start"><lucide-angular [img]="ArrowLeft" [size]="16"></lucide-angular></span>
          Navigate
          <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
        </tulpar-button-ng>
      </div>
      <pre class="code"><code>{{ slotEscapeHatchCode }}</code></pre>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
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
        gap: 8px;
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
        gap: 8px;
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

      .demo-form {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }

      .demo-input {
        height: 40px;
        padding: 0 12px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 6px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        color: var(--tulpar-color-text-primary, #15110b);
        font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
        font-size: 14px;
        min-width: 220px;
      }

      .submit-feedback {
        margin: 8px 0 0;
        font-size: 14px;
        color: var(--tulpar-color-text-secondary, #57534e);
      }

      .click-feedback {
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
    `,
  ],
})
export class ButtonDemoComponent {
  submittedEmail = signal<string | null>(null);
  dataDisabledClicked = signal(false);

  // ─── Lucide icon references ────────────────────────────────────────────────
  protected readonly Check = Check;
  protected readonly ArrowRight = ArrowRight;
  protected readonly ArrowLeft = ArrowLeft;
  protected readonly Trash2 = Trash2;
  protected readonly Crown = Crown;
  protected readonly Mail = Mail;
  protected readonly Settings = Settings;
  protected readonly Save = Save;
  protected readonly Download = Download;
  protected readonly Heart = Heart;
  protected readonly Plus = Plus;
  protected readonly Sparkles = Sparkles;
  protected readonly Loader2 = Loader2;

  // ─── Pattern 2 demo: named icon component ─────────────────────────────────
  protected readonly AppCheckIcon = AppCheckIcon;

  // ─── Code snippet properties ───────────────────────────────────────────────
  severityCode = SEVERITY_CODE;
  variantCode = VARIANT_CODE;
  sizeCode = SIZE_CODE;
  colorCode = COLOR_CODE;
  shapeCode = SHAPE_CODE;
  iconsCode = ICONS_CODE;
  iconOnlyCode = ICON_ONLY_CODE;
  iconPositionCode = ICON_POSITION_CODE;
  iconSeparatorCode = ICON_SEPARATOR_CODE;
  modifiersCode = MODIFIERS_CODE;
  loadingCode = LOADING_CODE;
  disabledCode = DISABLED_CODE;
  polymorphismCode = POLYMORPHISM_CODE;
  formCode = FORM_CODE;
  buttonGroupCode = BUTTON_GROUP_CODE;
  premiumCode = PREMIUM_CODE;
  iconPropCode = ICON_PROP_CODE;
  tooltipCode = TOOLTIP_CODE;
  slotEscapeHatchCode = SLOT_ESCAPE_HATCH_CODE;

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    this.submittedEmail.set(String(fd.get('email') ?? ''));
  }

  onDataDisabledClick(): void {
    this.dataDisabledClicked.set(true);
    setTimeout(() => this.dataDisabledClicked.set(false), 2000);
  }
}
