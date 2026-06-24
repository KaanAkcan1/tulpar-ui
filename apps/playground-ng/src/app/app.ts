import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LucideAngularModule, type LucideIconData } from 'lucide-angular';
import {
  BadgeCheck,
  Bell,
  BookOpen,
  CheckSquare,
  ChevronsUpDown,
  Circle,
  CircleDot,
  CircleUserRound,
  FormInput,
  Gauge,
  Hash,
  Layers,
  LoaderCircle,
  MessageCircle,
  MessageSquare,
  MessageSquareText,
  Palette,
  PanelTop,
  RectangleHorizontal,
  SquareMousePointer,
  Tag,
  TextCursorInput,
  ToggleLeft,
  WrapText,
} from 'lucide-angular';
import {
  TulparShellComponent,
  TulparTopbarComponent,
  TulparSidenavComponent,
  type TulparNavItemNgData,
} from '@tulpar-ui/angular';
import type { ShellSidenavMode } from '@tulpar-ui/angular';

type SidenavPosition = 'left' | 'right';
type SidenavDensity = 'comfortable' | 'compact';
type SidenavLayout = 'under-topbar' | 'over-topbar';

/**
 * Tiny standalone wrappers so a lucide icon (which is plain `LucideIconData`,
 * not an Angular component) can be passed as a nav item `icon` — the sidenav
 * wrapper projects component icons via `ngComponentOutlet`, which needs a `Type`.
 * One declarative component per icon keeps everything AOT-friendly.
 */
@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconButton {
  readonly icon: LucideIconData = SquareMousePointer;
}
@Component({
  selector: 'app-icon-text-input',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconTextInput {
  readonly icon: LucideIconData = TextCursorInput;
}
@Component({
  selector: 'app-icon-textarea',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconTextarea {
  readonly icon: LucideIconData = WrapText;
}
@Component({
  selector: 'app-icon-number-input',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconNumberInput {
  readonly icon: LucideIconData = Hash;
}
@Component({
  selector: 'app-icon-select',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconSelect {
  readonly icon: LucideIconData = ChevronsUpDown;
}
@Component({
  selector: 'app-icon-colors',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconColors {
  readonly icon: LucideIconData = Palette;
}
@Component({
  selector: 'app-icon-form-inputs',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconFormInputs {
  readonly icon: LucideIconData = FormInput;
}
@Component({
  selector: 'app-icon-guide',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconGuide {
  readonly icon: LucideIconData = BookOpen;
}
@Component({
  selector: 'app-icon-switch',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconSwitch {
  readonly icon: LucideIconData = ToggleLeft;
}
@Component({
  selector: 'app-icon-checkbox',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconCheckbox {
  readonly icon: LucideIconData = CheckSquare;
}
@Component({
  selector: 'app-icon-radio',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconRadio {
  readonly icon: LucideIconData = Circle;
}
@Component({
  selector: 'app-icon-checkbox-group',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconCheckboxGroup {
  readonly icon: LucideIconData = CheckSquare;
}
@Component({
  selector: 'app-icon-overlay',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconOverlay {
  readonly icon: LucideIconData = Layers;
}
@Component({
  selector: 'app-icon-tooltip',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconTooltip {
  readonly icon: LucideIconData = MessageSquare;
}
@Component({
  selector: 'app-icon-toggletip',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconToggletip {
  readonly icon: LucideIconData = MessageSquareText;
}
@Component({
  selector: 'app-icon-popover',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconPopover {
  readonly icon: LucideIconData = PanelTop;
}
@Component({
  selector: 'app-icon-toast',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconToast {
  readonly icon: LucideIconData = Bell;
}
@Component({
  selector: 'app-icon-message',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconMessage {
  readonly icon: LucideIconData = MessageCircle;
}
@Component({
  selector: 'app-icon-tag',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconTag {
  readonly icon: LucideIconData = Tag;
}
@Component({
  selector: 'app-icon-badge',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconBadge {
  readonly icon: LucideIconData = BadgeCheck;
}
@Component({
  selector: 'app-icon-chip',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconChip {
  readonly icon: LucideIconData = CircleDot;
}
@Component({
  selector: 'app-icon-avatar',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconAvatar {
  readonly icon: LucideIconData = CircleUserRound;
}
@Component({
  selector: 'app-icon-skeleton',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconSkeleton {
  readonly icon: LucideIconData = RectangleHorizontal;
}
@Component({
  selector: 'app-icon-spinner',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconSpinner {
  readonly icon: LucideIconData = LoaderCircle;
}
@Component({
  selector: 'app-icon-progress',
  standalone: true,
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="icon" [size]="18" />`,
})
class IconProgress {
  readonly icon: LucideIconData = Gauge;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TulparShellComponent, TulparTopbarComponent, TulparSidenavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tulpar-shell-ng
      [sidenavMode]="sidenavMode()"
      [sidenavLayout]="sidenavLayout()"
      persistKey="playground-ng-shell"
      [dark]="dark()"
      [(asideOpen)]="asideOpen"
      (tulpar-navigate)="onNavigate($event)"
    >
      <!-- ── Topbar ───────────────────────────────────────────────────────── -->
      <tulpar-topbar-ng slot="topbar">
        <span slot="start" class="topbar-tag">Angular playground</span>
      </tulpar-topbar-ng>

      <!-- ── Sidenav (self-contained: built-in brand, toggle, utility, account) -->
      <tulpar-sidenav-ng
        slot="sidenav"
        navLabel="Main navigation"
        [items]="menu"
        [position]="position()"
        [density]="density()"
        [singleExpand]="true"
        [showConfig]="true"
        configText="Configurator"
        userName="Kaan Akcan"
        userRole="Owner"
        [showSettings]="true"
        [showLogout]="true"
        (config)="asideOpen.set(true)"
        (settings)="asideOpen.set(true)"
        (logout)="onLogout()"
      />

      <!-- ── Routed page content (default slot) ───────────────────────────── -->
      <router-outlet />

      <!-- ── Aside: configurator drawer (dogfoods the shell's aside panel) ──── -->
      <section slot="aside" class="settings" aria-label="Shell configurator">
        <header class="settings-head">
          <h2>Configurator</h2>
          <button
            type="button"
            class="settings-close"
            aria-label="Close configurator"
            (click)="asideOpen.set(false)"
          >
            ✕
          </button>
        </header>

        <fieldset class="setting">
          <legend>Sidenav mode</legend>
          <div class="segmented" role="radiogroup" aria-label="Sidenav mode">
            @for (m of sidenavModes; track m.value) {
              <label [class.on]="sidenavMode() === m.value">
                <input
                  type="radio"
                  name="sidenav-mode"
                  [checked]="sidenavMode() === m.value"
                  (change)="sidenavMode.set(m.value)"
                />
                <span>{{ m.label }}</span>
              </label>
            }
          </div>
        </fieldset>

        <fieldset class="setting">
          <legend>Sidenav layout</legend>
          <div class="segmented" role="radiogroup" aria-label="Sidenav layout">
            @for (l of layouts; track l.value) {
              <label [class.on]="sidenavLayout() === l.value">
                <input
                  type="radio"
                  name="sidenav-layout"
                  [checked]="sidenavLayout() === l.value"
                  (change)="sidenavLayout.set(l.value)"
                />
                <span>{{ l.label }}</span>
              </label>
            }
          </div>
        </fieldset>

        <fieldset class="setting">
          <legend>Position</legend>
          <div class="segmented" role="radiogroup" aria-label="Sidenav position">
            @for (p of positions; track p.value) {
              <label [class.on]="position() === p.value">
                <input
                  type="radio"
                  name="position"
                  [checked]="position() === p.value"
                  (change)="position.set(p.value)"
                />
                <span>{{ p.label }}</span>
              </label>
            }
          </div>
        </fieldset>

        <fieldset class="setting">
          <legend>Density</legend>
          <div class="segmented" role="radiogroup" aria-label="Sidenav density">
            @for (d of densities; track d.value) {
              <label [class.on]="density() === d.value">
                <input
                  type="radio"
                  name="density"
                  [checked]="density() === d.value"
                  (change)="density.set(d.value)"
                />
                <span>{{ d.label }}</span>
              </label>
            }
          </div>
        </fieldset>

        <p class="settings-hint">
          Brand, navigation, the Dark/Light toggle and the account block are all rendered by
          <code>&lt;tulpar-sidenav-ng&gt;</code> from props — no app markup. Sidenav mode persists
          across reloads via <code>persistKey</code>; the rest reset on reload. Close with Esc, the
          ✕, or the backdrop.
        </p>
      </section>
    </tulpar-shell-ng>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .topbar-tag {
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.01em;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      /* ── Aside configurator panel ──────────────────────────────────────── */
      .settings {
        display: flex;
        flex-direction: column;
        gap: 22px;
        padding: 20px;
      }

      .settings-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .settings-head h2 {
        margin: 0;
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 18px;
        font-weight: 600;
      }

      .settings-close {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--tulpar-color-text-muted, #74777a);
        font-size: 15px;
        cursor: pointer;
      }

      .settings-close:hover {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .settings-close:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
        outline-offset: 2px;
      }

      .setting {
        margin: 0;
        padding: 0;
        border: none;
      }

      .setting legend {
        padding: 0 0 8px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .segmented {
        display: flex;
        gap: 4px;
        padding: 4px;
        border-radius: 10px;
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
      }

      .segmented label {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 40px;
        border-radius: 7px;
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #27231d);
        cursor: pointer;
        user-select: none;
        transition:
          background 150ms ease-out,
          color 150ms ease-out;
      }

      .segmented label:hover {
        color: var(--tulpar-color-text-primary, #15110b);
      }

      .segmented label.on {
        background: var(--tulpar-color-bg-surface, #fff);
        color: var(--tulpar-color-brand-default, #00c57a);
        font-weight: 600;
        box-shadow: var(--tulpar-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.08));
      }

      .segmented input {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        clip: rect(0 0 0 0);
        overflow: hidden;
      }

      .segmented label:focus-within {
        outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
        outline-offset: 2px;
      }

      @media (prefers-reduced-motion: reduce) {
        .segmented label {
          transition: none;
        }
      }

      .settings-hint {
        margin: 0;
        font-size: 12px;
        line-height: 1.6;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .settings-hint code {
        font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
        font-size: 11px;
        padding: 1px 5px;
        border-radius: 4px;
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
      }
    `,
  ],
})
export class App {
  private readonly router = inject(Router);

  /**
   * SPA navigation: the sidenav links (inline AND rail flyout) dispatch the
   * cancelable `tulpar-navigate` event. Intercept it, prevent the native full-page
   * navigation, and route via the Angular Router so app state (sidenav mode,
   * collapsed, dark) survives. Then notify the web components to refresh their
   * active state (they listen for `tulpar-location-changed`).
   */
  onNavigate(e: Event) {
    const ce = e as CustomEvent<{ href?: string }>;
    const href = ce.detail?.href;
    if (!href) return;
    ce.preventDefault();
    void this.router.navigateByUrl(href).then(() => {
      window.dispatchEvent(new Event('tulpar-location-changed'));
    });
  }

  /** Initial dark-mode state — the built-in sidenav toggle flips it from here on. */
  readonly dark = signal(false);

  /** Sidenav mode — bound to the shell, switchable live from the configurator. */
  readonly sidenavMode = signal<ShellSidenavMode>('static');

  /** Sidenav layout (under/over the topbar) — dogfood the new shell input. */
  readonly sidenavLayout = signal<SidenavLayout>('under-topbar');

  /** Sidenav position + density — dogfood the new sidenav inputs from the aside. */
  readonly position = signal<SidenavPosition>('left');
  readonly density = signal<SidenavDensity>('comfortable');

  /** Aside (configurator) drawer open state — two-way bound to the shell. */
  readonly asideOpen = signal(false);

  /** Data-driven menu with lucide component icons handled by the wrapper. */
  readonly menu: TulparNavItemNgData[] = [
    {
      type: 'section',
      label: 'Components',
      items: [
        { label: 'Button', href: '/button', icon: IconButton },
        // Collapsible group: a nav-item with its own `items` renders as an
        // expandable group with a chevron. Demonstrates nesting + single-expand.
        {
          label: 'Form Inputs',
          icon: IconFormInputs,
          items: [
            { label: 'TextInput', href: '/text-input', icon: IconTextInput },
            { label: 'Textarea', href: '/textarea', icon: IconTextarea },
            { label: 'NumberInput', href: '/number-input', icon: IconNumberInput },
            { label: 'Select', href: '/select', icon: IconSelect },
          ],
        },
        // Selection — a collapsible group under Components (matches playground-vue).
        {
          label: 'Selection',
          icon: IconCheckbox,
          items: [
            { label: 'Switch', href: '/switch', icon: IconSwitch },
            { label: 'Checkbox', href: '/checkbox', icon: IconCheckbox },
            { label: 'RadioGroup', href: '/radio-group', icon: IconRadio },
            { label: 'CheckboxGroup', href: '/checkbox-group', icon: IconCheckboxGroup },
          ],
        },
        // Overlay — directive-driven tooltip / toggletip / popover family (v0.11).
        {
          label: 'Overlay',
          icon: IconOverlay,
          items: [
            { label: 'Tooltip', href: '/tooltip', icon: IconTooltip },
            { label: 'Toggletip', href: '/toggletip', icon: IconToggletip },
            { label: 'Popover', href: '/popover', icon: IconPopover },
          ],
        },
      ],
    },
    // Feedback — transient notification family (v0.12).
    {
      type: 'section',
      label: 'Feedback',
      items: [
        { label: 'Toast', href: '/toast', icon: IconToast },
        { label: 'Message', href: '/message', icon: IconMessage },
      ],
    },
    // Display & Status atoms — one dedicated page per atom (v0.13).
    {
      type: 'section',
      label: 'Display & Status atoms',
      items: [
        { label: 'Tag', href: '/tag', icon: IconTag },
        { label: 'Badge', href: '/badge', icon: IconBadge },
        { label: 'Chip', href: '/chip', icon: IconChip },
        { label: 'Avatar', href: '/avatar', icon: IconAvatar },
        { label: 'Skeleton', href: '/skeleton', icon: IconSkeleton },
        { label: 'Spinner', href: '/spinner', icon: IconSpinner },
        { label: 'Progress', href: '/progress', icon: IconProgress },
      ],
    },
    {
      type: 'section',
      label: 'Foundations',
      items: [{ label: 'Colors', href: '/colors', icon: IconColors }],
    },
    {
      type: 'section',
      label: 'Guides',
      items: [{ label: 'Sidebar & Theme', href: '/guide', icon: IconGuide }],
    },
  ];

  readonly sidenavModes: { value: ShellSidenavMode; label: string }[] = [
    { value: 'static', label: 'Static' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'rail', label: 'Rail' },
  ];

  readonly layouts: { value: SidenavLayout; label: string }[] = [
    { value: 'under-topbar', label: 'Under topbar' },
    { value: 'over-topbar', label: 'Over topbar' },
  ];

  readonly positions: { value: SidenavPosition; label: string }[] = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ];

  readonly densities: { value: SidenavDensity; label: string }[] = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
  ];

  onLogout() {
    // Placeholder action — a real app would clear the session and redirect.
    console.info('[playground-ng] logout requested');
  }
}
