import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
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

const COLOR_CODE = `<tulpar-button-ng color="gold">Gold</tulpar-button-ng>
<tulpar-button-ng color="emerald">Emerald</tulpar-button-ng>
<tulpar-button-ng color="rose">Rose</tulpar-button-ng>
<tulpar-button-ng color="indigo">Indigo</tulpar-button-ng>
<tulpar-button-ng color="cyan" variant="outlined">Cyan Outlined</tulpar-button-ng>
<tulpar-button-ng color="purple" variant="tonal">Purple Tonal</tulpar-button-ng>`;

const SHAPE_CODE = `<!-- Default (rectangle) -->
<tulpar-button-ng shape="default">Default</tulpar-button-ng>

<!-- Round (pill) -->
<tulpar-button-ng shape="round">Round</tulpar-button-ng>

<!-- Circle (icon-only) — [icon] prop, auto icon-only -->
<tulpar-button-ng shape="circle" [icon]="Plus" ariaLabel="Add item"></tulpar-button-ng>`;

const ICONS_CODE = `<!-- Leading icon via [icon] prop -->
<tulpar-button-ng severity="success" [icon]="Check">Save</tulpar-button-ng>

<!-- Trailing icon — use slot="end" ([icon] always renders at start) -->
<tulpar-button-ng severity="primary">
  Continue
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>

<!-- Both: [icon] for start, slot="end" for trailing -->
<tulpar-button-ng severity="primary" [icon]="Check">
  Save and continue
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>`;

const ICON_ONLY_CODE = `<!-- Auto icon-only: [icon] set + no text → icon-only applied automatically -->
<tulpar-button-ng severity="danger" [icon]="Trash2" ariaLabel="Delete item"></tulpar-button-ng>
<tulpar-button-ng severity="secondary" [icon]="Settings" ariaLabel="Settings"></tulpar-button-ng>

<!-- Auto icon-only + circle shape -->
<tulpar-button-ng severity="success" [icon]="Save" shape="circle" ariaLabel="Save"></tulpar-button-ng>

<!-- Explicit iconOnly still works (useful when you need to be explicit) -->
<tulpar-button-ng severity="premium" [iconOnly]="true" shape="round" [icon]="Crown" ariaLabel="Premium"></tulpar-button-ng>`;

const ICON_POSITION_CODE = `<!-- Start (default) -->
<tulpar-button-ng [icon]="Check" iconPosition="start" size="lg">Confirm</tulpar-button-ng>

<!-- Top -->
<tulpar-button-ng [icon]="Check" iconPosition="top" size="lg">Confirm</tulpar-button-ng>

<!-- Bottom -->
<tulpar-button-ng [icon]="Check" iconPosition="bottom" size="lg">Confirm</tulpar-button-ng>

<!-- End — use slot="end" ([icon] is always in start slot) -->
<tulpar-button-ng iconPosition="end" size="lg">
  Confirm
  <span slot="end"><lucide-angular [img]="Check" [size]="18"></lucide-angular></span>
</tulpar-button-ng>`;

const ICON_SEPARATOR_CODE = `<!-- Outlined + separator + leading icon -->
<tulpar-button-ng variant="outlined" [iconSeparator]="true" [icon]="Download">Download</tulpar-button-ng>

<!-- Tonal + separator + both icons (leading via prop, trailing via slot) -->
<tulpar-button-ng variant="tonal" [iconSeparator]="true" [icon]="ArrowLeft">
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
<tulpar-button-ng [block]="true" justify="between" [icon]="Mail">
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
  <tulpar-button-ng type="submit" severity="primary" [icon]="Mail">Submit</tulpar-button-ng>
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

const PREMIUM_CODE = `<!-- Solid premium — gold marketing CTA -->
<tulpar-button-ng severity="premium" [icon]="Crown">Upgrade to Pro</tulpar-button-ng>

<!-- Tonal premium — softer CTA -->
<tulpar-button-ng severity="premium" variant="tonal" [icon]="Sparkles">Get early access</tulpar-button-ng>

<!-- Icon-size override for premium large CTA -->
<tulpar-button-ng severity="premium" size="lg" [icon]="Crown" [iconSize]="24">Go Pro</tulpar-button-ng>

<!-- premium = gold accent, distinct from primary (navy)
     Light theme: gold.500 bg + dark text
     Hover: brightens (gold.500 -> .400 -> .300) -->`;

const ICON_PROP_CODE = `<!-- [icon] input — convenience for Lucide icons (replaces verbose slot boilerplate) -->
<!-- Must expose the icon as a class property: protected readonly Check = Check; -->
<tulpar-button-ng severity="success" [icon]="Check">Save</tulpar-button-ng>

<!-- [iconSize] override — useful for larger CTAs -->
<tulpar-button-ng severity="premium" size="lg" [icon]="Crown" [iconSize]="24">Go Pro</tulpar-button-ng>

<!-- Auto icon-only: [icon] + no text = square, no extra props needed -->
<tulpar-button-ng severity="danger" [icon]="Trash2" ariaLabel="Delete"></tulpar-button-ng>

<!-- [icon] respects iconPosition for top/bottom layouts -->
<tulpar-button-ng [icon]="Check" iconPosition="top" size="lg">Confirm</tulpar-button-ng>`;

const TOOLTIP_CODE = `<!-- Tooltip on icon-only button (fills the a11y gap) -->
<tulpar-button-ng [icon]="Settings" tooltip="Open settings" ariaLabel="Open settings"></tulpar-button-ng>

<!-- Tooltip on a labelled button -->
<tulpar-button-ng severity="danger" [icon]="Trash2" tooltip="Permanently delete this item">
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

const SLOT_ESCAPE_HATCH_CODE = `<!-- Escape hatch: non-Lucide libraries (Heroicons, Tabler, custom SVG) -->
<!-- When [icon] is not an option, use <span slot="start"> directly -->
<tulpar-button-ng severity="primary">
  <span slot="start">
    <!-- Any component or SVG; you control sizing via class/style -->
    <my-hero-icon class="w-4 h-4"></my-hero-icon>
  </span>
  Save with Heroicon
</tulpar-button-ng>

<!-- Multi-icon pattern (two icons) — slot is the only option;
     [icon] supports a single leading icon only -->
<tulpar-button-ng severity="secondary" variant="outlined">
  <span slot="start"><lucide-angular [img]="ArrowLeft" [size]="16"></lucide-angular></span>
  Navigate
  <span slot="end"><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular></span>
</tulpar-button-ng>`;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TulparButtonComponent, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="page">
      <!-- ── Header ─────────────────────────────────────────────────────────── -->
      <header class="page-header">
        <div class="header-inner">
          <div class="header-text">
            <p class="eyebrow">Tulpar UI · Angular · v0.3.1</p>
            <h1 class="page-title">Button — full feature reference</h1>
            <p class="page-lede">
              Live previews and copy-paste code for every Button capability. Most examples use the
              <code class="inline-code">[icon]</code> input (v0.3.1) for Lucide icons. The
              <code class="inline-code">&lt;span slot="..."&gt;</code> pattern remains supported as
              a fallback for non-Lucide libraries.
            </p>
          </div>
          <button class="theme-toggle" (click)="toggleDark()">
            {{ isDark() ? '☀ Light' : '☾ Dark' }}
          </button>
        </div>
      </header>

      <main class="main">
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
            The <code class="inline-code">color</code> prop overrides the severity's palette with
            any design-system color. Severity remains as a DOM hint for accessibility semantics.
          </p>
          <div class="preview">
            <tulpar-button-ng color="gold">Gold</tulpar-button-ng>
            <tulpar-button-ng color="emerald">Emerald</tulpar-button-ng>
            <tulpar-button-ng color="rose">Rose</tulpar-button-ng>
            <tulpar-button-ng color="indigo">Indigo</tulpar-button-ng>
            <tulpar-button-ng color="cyan" variant="outlined">Cyan Outlined</tulpar-button-ng>
            <tulpar-button-ng color="purple" variant="tonal">Purple Tonal</tulpar-button-ng>
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
          <div class="preview preview--baseline">
            <tulpar-button-ng shape="default">Default</tulpar-button-ng>
            <tulpar-button-ng shape="round">Round</tulpar-button-ng>
            <tulpar-button-ng shape="circle" [icon]="Plus" ariaLabel="Add item"></tulpar-button-ng>
          </div>
          <pre class="code"><code>{{ shapeCode }}</code></pre>
        </section>

        <!-- ── 6. Icons — leading, trailing, both ──────────────────────────── -->
        <section class="doc-section">
          <h2 class="section-title">6. Icons — leading, trailing, both</h2>
          <p class="section-desc">
            Use the <code class="inline-code">[icon]</code> input for Lucide icons — it renders into
            <code class="inline-code">slot="start"</code> automatically. For a trailing icon, use
            <code class="inline-code">&lt;span slot="end"&gt;</code>. For multi-icon, combine both.
          </p>
          <div class="preview">
            <!-- Leading icon via [icon] prop -->
            <tulpar-button-ng severity="success" [icon]="Check">Save</tulpar-button-ng>
            <!-- Trailing icon via slot -->
            <tulpar-button-ng severity="primary">
              Continue
              <span slot="end"
                ><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular
              ></span>
            </tulpar-button-ng>
            <!-- Both: [icon] for start, slot for end -->
            <tulpar-button-ng severity="primary" [icon]="Check">
              Save and continue
              <span slot="end"
                ><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular
              ></span>
            </tulpar-button-ng>
          </div>
          <pre class="code"><code>{{ iconsCode }}</code></pre>
        </section>

        <!-- ── 7. Icon-only ────────────────────────────────────────────────── -->
        <section class="doc-section">
          <h2 class="section-title">7. Icon-only</h2>
          <p class="section-desc">
            When <code class="inline-code">[icon]</code> is set and no text is projected, icon-only
            mode is applied <em>automatically</em> — no extra input needed. Always include
            <code class="inline-code">ariaLabel</code> for screen reader accessibility.
          </p>
          <div class="preview preview--baseline">
            <!-- Auto icon-only -->
            <tulpar-button-ng
              severity="danger"
              [icon]="Trash2"
              ariaLabel="Delete item"
            ></tulpar-button-ng>
            <tulpar-button-ng
              severity="secondary"
              [icon]="Settings"
              ariaLabel="Settings"
            ></tulpar-button-ng>
            <!-- Auto icon-only + circle shape -->
            <tulpar-button-ng
              severity="success"
              [icon]="Save"
              shape="circle"
              ariaLabel="Save"
            ></tulpar-button-ng>
            <!-- Explicit iconOnly still works -->
            <tulpar-button-ng
              severity="premium"
              [iconOnly]="true"
              shape="round"
              [icon]="Crown"
              ariaLabel="Premium"
            ></tulpar-button-ng>
          </div>
          <pre class="code"><code>{{ iconOnlyCode }}</code></pre>
        </section>

        <!-- ── 8. Icon position ────────────────────────────────────────────── -->
        <section class="doc-section">
          <h2 class="section-title">8. Icon position</h2>
          <p class="section-desc">
            Control where the icon renders relative to the label:
            <code class="inline-code">start</code>, <code class="inline-code">end</code>,
            <code class="inline-code">top</code>, <code class="inline-code">bottom</code>. The
            <code class="inline-code">[icon]</code> input always renders in the start slot; for
            <code class="inline-code">iconPosition="end"</code> use
            <code class="inline-code">&lt;span slot="end"&gt;</code>.
          </p>
          <div class="preview preview--baseline">
            <tulpar-button-ng [icon]="Check" iconPosition="start" size="lg"
              >Confirm</tulpar-button-ng
            >
            <tulpar-button-ng iconPosition="end" size="lg">
              Confirm
              <span slot="end"><lucide-angular [img]="Check" [size]="18"></lucide-angular></span>
            </tulpar-button-ng>
            <tulpar-button-ng [icon]="Check" iconPosition="top" size="lg">Confirm</tulpar-button-ng>
            <tulpar-button-ng [icon]="Check" iconPosition="bottom" size="lg"
              >Confirm</tulpar-button-ng
            >
          </div>
          <pre class="code"><code>{{ iconPositionCode }}</code></pre>
        </section>

        <!-- ── 9. Icon separator ───────────────────────────────────────────── -->
        <section class="doc-section">
          <h2 class="section-title">9. Icon separator</h2>
          <p class="section-desc">
            The <code class="inline-code">iconSeparator</code> input draws a visual divider between
            icon and label. Works across all variants.
          </p>
          <div class="preview">
            <tulpar-button-ng variant="outlined" [iconSeparator]="true" [icon]="Download"
              >Download</tulpar-button-ng
            >
            <tulpar-button-ng variant="tonal" [iconSeparator]="true" [icon]="ArrowLeft">
              Navigate
              <span slot="end"
                ><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular
              ></span>
            </tulpar-button-ng>
            <tulpar-button-ng variant="solid" [iconSeparator]="true">
              Next
              <span slot="end"
                ><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular
              ></span>
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
            <code class="inline-code">justify</code> controls internal content alignment (start /
            center / end / between).
          </p>
          <div class="preview preview--col">
            <div class="preview-row">
              <tulpar-button-ng [raised]="true">Raised Solid</tulpar-button-ng>
              <tulpar-button-ng [raised]="true" variant="outlined"
                >Raised Outlined</tulpar-button-ng
              >
            </div>
            <tulpar-button-ng [block]="true">Block Button</tulpar-button-ng>
            <tulpar-button-ng [block]="true" justify="between" [icon]="Mail">
              Send Email
              <span slot="end"
                ><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular
              ></span>
            </tulpar-button-ng>
          </div>
          <pre class="code"><code>{{ modifiersCode }}</code></pre>
        </section>

        <!-- ── 11. Loading states ─────────────────────────────────────────── -->
        <section class="doc-section">
          <h2 class="section-title">11. Loading states</h2>
          <p class="section-desc">
            The <code class="inline-code">loading</code> input disables interaction and shows a
            spinner. Control spinner position with <code class="inline-code">loadingPosition</code>.
            Provide a <code class="inline-code">loadingLabel</code> for status announcements. Use
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
            <code class="inline-code">dataDisabled</code> applies disabled styling but still fires
            click events — useful when wrapping with a tooltip that explains why the action is
            unavailable.
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
              <span slot="start"
                ><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular
              ></span>
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
              <tulpar-button-ng type="submit" severity="primary" [icon]="Mail"
                >Submit</tulpar-button-ng
              >
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
            keyboard navigation. Horizontal: <kbd>ArrowLeft</kbd> / <kbd>ArrowRight</kbd>. Stacked
            (add <code class="inline-code">stacked</code> attr): <kbd>ArrowUp</kbd> /
            <kbd>ArrowDown</kbd>. Both: <kbd>Home</kbd> / <kbd>End</kbd>.
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
          <h2 class="section-title">16. Premium CTA — the gold marketing example</h2>
          <p class="section-desc">
            <code class="inline-code">severity="premium"</code> is the gold accent for marketing
            calls-to-action. Light theme: gold.500 background + dark text. Hover
            <em>brightens</em> (gold.500 &rarr; .400 &rarr; .300) — intentionally distinct from
            <code class="inline-code">primary</code> (navy), which darkens on hover.
          </p>
          <div class="preview preview--baseline">
            <tulpar-button-ng severity="premium" [icon]="Crown">Upgrade to Pro</tulpar-button-ng>
            <tulpar-button-ng severity="premium" variant="tonal" [icon]="Sparkles"
              >Get early access</tulpar-button-ng
            >
            <tulpar-button-ng severity="premium" size="lg" [icon]="Crown" [iconSize]="24"
              >Go Pro</tulpar-button-ng
            >
          </div>
          <pre class="code"><code>{{ premiumCode }}</code></pre>
        </section>

        <!-- ── 17. [icon] input — Lucide convenience API ────────────────── -->
        <section class="doc-section">
          <h2 class="section-title">17. [icon] input — Lucide convenience API (v0.3.1)</h2>
          <p class="section-desc">
            Pass any <code class="inline-code">LucideIconData</code> value via
            <code class="inline-code">[icon]</code>. The wrapper renders it inside
            <code class="inline-code">slot="start"</code> at the correct size for the button's
            <code class="inline-code">size</code>. Use <code class="inline-code">[iconSize]</code>
            to override. Auto icon-only kicks in when no projected text exists. Expose icons as
            <code class="inline-code">protected readonly</code> class properties so the template can
            reference them.
          </p>
          <div class="preview preview--baseline">
            <tulpar-button-ng severity="success" [icon]="Check">Save</tulpar-button-ng>
            <tulpar-button-ng severity="premium" size="lg" [icon]="Crown" [iconSize]="24"
              >Go Pro</tulpar-button-ng
            >
            <tulpar-button-ng
              severity="danger"
              [icon]="Trash2"
              ariaLabel="Delete"
            ></tulpar-button-ng>
            <tulpar-button-ng [icon]="Check" iconPosition="top" size="lg">Confirm</tulpar-button-ng>
          </div>
          <pre class="code"><code>{{ iconPropCode }}</code></pre>
        </section>

        <!-- ── 18. Tooltip ───────────────────────────────────────────────── -->
        <section class="doc-section">
          <h2 class="section-title">18. Tooltip (v0.3.1)</h2>
          <p class="section-desc">
            Pass a string to <code class="inline-code">tooltip</code> to show an inline tooltip on
            hover and focus. Especially useful for icon-only buttons where the label is visually
            hidden. Tooltip appears below the button, 150 ms fade.
          </p>
          <div class="preview preview--baseline">
            <!-- Tooltip on icon-only button -->
            <tulpar-button-ng
              [icon]="Settings"
              tooltip="Open settings"
              ariaLabel="Open settings"
            ></tulpar-button-ng>
            <!-- Tooltip on a labelled button -->
            <tulpar-button-ng
              severity="danger"
              [icon]="Trash2"
              tooltip="Permanently delete this item"
            >
              Delete
            </tulpar-button-ng>
            <!-- Tooltip on an anchor -->
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

        <!-- ── 19. Escape hatch — non-Lucide icon libraries ──────────────── -->
        <section class="doc-section">
          <h2 class="section-title">19. Escape hatch — non-Lucide icon libraries</h2>
          <p class="section-desc">
            The <code class="inline-code">[icon]</code> input is Lucide-optimised (<code
              class="inline-code"
              >lucide-angular</code
            >
            component with <code class="inline-code">[size]</code> auto-set). For Heroicons, Tabler,
            Material, or custom SVG, project via
            <code class="inline-code">&lt;span slot="start"&gt;</code> — the slot pattern remains
            fully supported. Multi-icon layouts also require slots since
            <code class="inline-code">[icon]</code> supports a single leading icon only.
          </p>
          <div class="preview preview--baseline">
            <!-- Custom icon via slot (simulated with inline SVG) -->
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
            <!-- Multi-icon via slots -->
            <tulpar-button-ng severity="secondary" variant="outlined">
              <span slot="start"
                ><lucide-angular [img]="ArrowLeft" [size]="16"></lucide-angular
              ></span>
              Navigate
              <span slot="end"
                ><lucide-angular [img]="ArrowRight" [size]="16"></lucide-angular
              ></span>
            </tulpar-button-ng>
          </div>
          <pre class="code"><code>{{ slotEscapeHatchCode }}</code></pre>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      :host {
        display: block;
      }

      .page {
        min-height: 100vh;
      }

      .page-header {
        background: var(--tulpar-color-bg-elevated, #ffffff);
        border-bottom: 1px solid var(--tulpar-color-border-default, #e7e5e4);
        padding: 40px 32px 36px;
      }

      .header-inner {
        max-width: 920px;
        margin: 0 auto;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
      }

      .eyebrow {
        margin: 0 0 8px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--tulpar-color-text-muted, #78716c);
      }

      .page-title {
        margin: 0 0 12px;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 36px;
        font-weight: 600;
        line-height: 1.15;
        color: var(--tulpar-color-text-primary, #1c1917);
      }

      .page-lede {
        margin: 0;
        font-size: 15px;
        color: var(--tulpar-color-text-secondary, #57534e);
        max-width: 620px;
        line-height: 1.6;
      }

      .theme-toggle {
        flex-shrink: 0;
        padding: 8px 16px;
        border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
        border-radius: 6px;
        background: var(--tulpar-color-bg-surface, #fafaf9);
        color: var(--tulpar-color-text-primary, #1c1917);
        font-family: var(--tulpar-font-family-ui, system-ui, sans-serif);
        font-size: 13px;
        cursor: pointer;
        white-space: nowrap;
      }

      .theme-toggle:hover {
        background: var(--tulpar-color-bg-subtle, #f5f5f4);
      }

      .main {
        max-width: 920px;
        margin: 0 auto;
        padding: 40px 32px 80px;
      }

      .doc-section {
        padding-bottom: 48px;
        margin-bottom: 48px;
        border-bottom: 1px solid var(--tulpar-color-border-default, #e7e5e4);
      }

      .doc-section:last-child {
        border-bottom: none;
      }

      .section-title {
        margin: 0 0 10px;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 26px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #1c1917);
      }

      .section-desc {
        margin: 0 0 20px;
        font-size: 14px;
        color: var(--tulpar-color-text-secondary, #57534e);
        max-width: 620px;
        line-height: 1.6;
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
        color: var(--tulpar-color-text-muted, #78716c);
      }

      .code {
        margin: 0;
        padding: 16px 20px;
        background: var(--tulpar-color-bg-inverse, #1c1917);
        border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
        border-radius: 0 0 6px 6px;
        overflow-x: auto;
        font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace;
        font-size: 13px;
        line-height: 1.55;
        color: #e7e5e4;
        white-space: pre;
      }

      .inline-code {
        font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
        font-size: 0.85em;
        background: var(--tulpar-color-bg-subtle, #f5f5f4);
        border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
        border-radius: 3px;
        padding: 1px 5px;
        color: var(--tulpar-color-text-primary, #1c1917);
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
        border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
        border-radius: 6px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        color: var(--tulpar-color-text-primary, #1c1917);
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
        border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
        border-radius: 3px;
        font-family: 'JetBrains Mono', Consolas, monospace;
        font-size: 11px;
        background: var(--tulpar-color-bg-elevated, #ffffff);
        color: var(--tulpar-color-text-primary, #1c1917);
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
export class App {
  isDark = signal(false);
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

  toggleDark(): void {
    const next = !this.isDark();
    this.isDark.set(next);
    document.documentElement.classList.toggle('dark', next);
  }

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
