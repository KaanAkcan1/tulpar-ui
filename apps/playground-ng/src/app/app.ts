import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  TulparShellComponent,
  TulparTopbarComponent,
  TulparSidenavComponent,
  TulparNavSectionComponent,
  TulparNavItemComponent,
} from '@tulpar-ui/angular';
import type { ShellSidenavMode } from '@tulpar-ui/angular';

type SidenavPosition = 'left' | 'right';
type SidenavDensity = 'comfortable' | 'compact';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    TulparShellComponent,
    TulparTopbarComponent,
    TulparSidenavComponent,
    TulparNavSectionComponent,
    TulparNavItemComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tulpar-shell-ng
      [sidenavMode]="sidenavMode()"
      persistKey="playground-ng-shell"
      [dark]="dark()"
      [(asideOpen)]="asideOpen"
    >
      <!-- ── Topbar ───────────────────────────────────────────────────────── -->
      <tulpar-topbar-ng slot="topbar" [showMenuButton]="false">
        <div slot="start" class="topbar-start">
          <button
            type="button"
            class="menu-trigger"
            aria-label="Toggle navigation"
            (click)="toggleMenu($event)"
          >
            <img class="menu-mark" src="/brand/tulpar-ui-icon.svg" alt="" aria-hidden="true" />
          </button>
          <span class="topbar-tag">Angular playground</span>
        </div>
        <button
          slot="end"
          type="button"
          class="settings-trigger"
          aria-label="Open settings"
          (click)="asideOpen.set(true)"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <path
              d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
              stroke="currentColor"
              stroke-width="1.6"
            />
            <path
              d="M19.4 13a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V19a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 17.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 13a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 7a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 2.6h.07A1.7 1.7 0 0 0 10.1 1h.01a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 2.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 7v.07a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Settings</span>
        </button>
      </tulpar-topbar-ng>

      <!-- ── Sidenav ──────────────────────────────────────────────────────── -->
      <tulpar-sidenav-ng
        slot="sidenav"
        navLabel="Main navigation"
        [position]="position()"
        [density]="density()"
        [singleExpand]="true"
      >
        <!-- Brand header -->
        <div slot="header" class="brand">
          <img class="brand-mark" src="/brand/tulpar-ui-icon.svg" alt="" aria-hidden="true" />
          <img
            class="brand-wordmark"
            [src]="dark() ? '/brand/tulpar-ui-wordmark-dark.svg' : '/brand/tulpar-ui-wordmark.svg'"
            alt="Tulpar UI"
          />
          <span class="brand-name visually-hidden">Tulpar UI</span>
        </div>

        <!-- Components -->
        <tulpar-nav-section-ng label="Components">
          <tulpar-nav-item-ng label="Button" href="/button">
            <svg slot="icon" class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="8" width="18" height="8" rx="4" />
              <path d="M7 12h4" stroke-width="1.6" />
            </svg>
          </tulpar-nav-item-ng>
          <tulpar-nav-item-ng label="TextInput" href="/text-input">
            <svg slot="icon" class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="7" width="18" height="10" rx="2" />
              <path d="M8 12h.01" />
            </svg>
          </tulpar-nav-item-ng>
          <tulpar-nav-item-ng label="Textarea" href="/textarea">
            <svg slot="icon" class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 9h10M7 13h7" />
            </svg>
          </tulpar-nav-item-ng>
          <tulpar-nav-item-ng label="NumberInput" href="/number-input">
            <svg slot="icon" class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3" y="7" width="18" height="10" rx="2" />
              <path d="M16 10l2 2-2 2M14 12h4" />
            </svg>
          </tulpar-nav-item-ng>
        </tulpar-nav-section-ng>

        <!-- Foundations -->
        <tulpar-nav-section-ng label="Foundations">
          <tulpar-nav-item-ng label="Colors" href="/colors">
            <svg slot="icon" class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <circle cx="9" cy="9.5" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="15" cy="9.5" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="9" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
            </svg>
          </tulpar-nav-item-ng>
        </tulpar-nav-section-ng>

        <!-- Utility row: theme toggle + configurator placeholder -->
        <div slot="utility-start" class="utility-cell">
          <button
            type="button"
            class="theme-toggle"
            role="switch"
            [attr.aria-checked]="dark()"
            (click)="dark.set(!dark())"
          >
            @if (dark()) {
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path
                  d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Dark</span>
            } @else {
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              <span>Light</span>
            }
          </button>
        </div>
        <div slot="utility-end" class="utility-cell">
          <button
            type="button"
            class="configurator-btn"
            disabled
            title="Configurator — coming in a future version"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path
                d="M4 6h10M4 12h7M4 18h12"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
              <circle cx="18" cy="6" r="2" stroke="currentColor" stroke-width="1.6" />
              <circle cx="15" cy="12" r="2" stroke="currentColor" stroke-width="1.6" />
              <circle cx="20" cy="18" r="2" stroke="currentColor" stroke-width="1.6" />
            </svg>
            <span>Configurator</span>
          </button>
        </div>

        <!-- User / account block -->
        <div slot="footer" class="user">
          <span class="user-avatar" aria-hidden="true">KA</span>
          <span class="user-meta">
            <span class="user-name">Kaan Akcan</span>
            <span class="user-role">Owner · Workspace</span>
          </span>
        </div>
      </tulpar-sidenav-ng>

      <!-- ── Routed page content (default slot) ───────────────────────────── -->
      <router-outlet />

      <!-- ── Shell footer ─────────────────────────────────────────────────── -->
      <footer slot="footer" class="app-footer">
        <div class="app-footer-brand">
          <img class="app-footer-mark" src="/brand/tulpar-ui-icon.svg" alt="" aria-hidden="true" />
          <span class="app-footer-product">Tulpar UI</span>
          <span class="app-footer-version">v0.8</span>
        </div>
        <nav class="app-footer-links" aria-label="Footer">
          <a href="#" rel="noopener">Docs</a>
          <a href="#" rel="noopener">GitHub</a>
        </nav>
        <span class="app-footer-copy">© 2026 Kaan Akcan · MIT</span>
      </footer>

      <!-- ── Aside: settings drawer (dogfoods the shell's aside panel) ─────── -->
      <section slot="aside" class="settings" aria-label="Shell settings">
        <header class="settings-head">
          <h2>Settings</h2>
          <button
            type="button"
            class="settings-close"
            aria-label="Close settings"
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
          Theme lives in the sidenav utility toggle. Shell + sidenav state persists across reloads
          via <code>persistKey</code>. Close with Esc, the ✕, or the backdrop.
        </p>
      </section>
    </tulpar-shell-ng>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        overflow: hidden;
        white-space: nowrap;
      }

      /* ── Topbar ────────────────────────────────────────────────────────── */
      .topbar-start {
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }

      .menu-trigger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        padding: 6px;
        border: 1px solid transparent;
        border-radius: 10px;
        background: transparent;
        cursor: pointer;
        transition: background 150ms ease-out;
      }

      .menu-trigger:hover {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
      }

      .menu-trigger:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
        outline-offset: 2px;
      }

      .menu-mark {
        display: block;
        width: 24px;
        height: 24px;
      }

      .topbar-tag {
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0.01em;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .settings-trigger {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
        padding: 0 14px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 8px;
        background: var(--tulpar-color-bg-surface, #f0f7f5);
        color: var(--tulpar-color-text-primary, #15110b);
        font-family: inherit;
        font-size: 13px;
        cursor: pointer;
        transition:
          background 150ms ease-out,
          border-color 150ms ease-out;
      }

      .settings-trigger:hover {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        border-color: var(--tulpar-color-border-strong, #c3cdcb);
      }

      .settings-trigger:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
        outline-offset: 2px;
      }

      /* ── Sidenav brand header ──────────────────────────────────────────── */
      .brand {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        min-width: 0;
      }

      .brand-mark {
        display: block;
        width: 26px;
        height: 26px;
        flex: none;
      }

      .brand-wordmark {
        display: block;
        height: 19px;
        width: auto;
      }

      /* ── Nav item icons (slotted SVG) ──────────────────────────────────── */
      .nav-icon {
        width: 18px;
        height: 18px;
        flex: none;
        fill: none;
        stroke: currentColor;
        stroke-width: 1.6;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* ── Utility row ───────────────────────────────────────────────────── */
      .utility-cell {
        display: flex;
      }

      .theme-toggle,
      .configurator-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-height: 38px;
        padding: 0 12px;
        border: 1px solid var(--tulpar-color-border-default, #d9e0df);
        border-radius: 9px;
        background: var(--tulpar-color-bg-surface, #f0f7f5);
        color: var(--tulpar-color-text-secondary, #27231d);
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition:
          background 150ms ease-out,
          color 150ms ease-out,
          border-color 150ms ease-out;
      }

      .theme-toggle:hover {
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        color: var(--tulpar-color-text-primary, #15110b);
        border-color: var(--tulpar-color-border-strong, #c3cdcb);
      }

      .theme-toggle:focus-visible,
      .configurator-btn:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
        outline-offset: 2px;
      }

      .configurator-btn:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      /* ── User / account block ──────────────────────────────────────────── */
      .user {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        padding: 6px 4px;
      }

      .user-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        flex: none;
        border-radius: 999px;
        background: var(--tulpar-color-brand-default, #00c57a);
        color: var(--tulpar-color-brand-on-color, #07291f);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.02em;
      }

      .user-meta {
        display: flex;
        flex-direction: column;
        min-width: 0;
        line-height: 1.3;
      }

      .user-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #15110b);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .user-role {
        font-size: 11px;
        color: var(--tulpar-color-text-muted, #74777a);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ── Shell footer ──────────────────────────────────────────────────── */
      .app-footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 14px 24px;
        font-size: 13px;
        color: var(--tulpar-color-text-muted, #74777a);
      }

      .app-footer-brand {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }

      .app-footer-mark {
        display: block;
        width: 18px;
        height: 18px;
      }

      .app-footer-product {
        font-weight: 600;
        color: var(--tulpar-color-text-secondary, #27231d);
      }

      .app-footer-version {
        padding: 1px 7px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        background: var(--tulpar-color-bg-subtle, #e9f1ef);
        color: var(--tulpar-color-text-secondary, #27231d);
      }

      .app-footer-links {
        display: inline-flex;
        align-items: center;
        gap: 18px;
      }

      .app-footer-links a {
        color: var(--tulpar-color-text-secondary, #27231d);
        text-decoration: none;
        transition: color 150ms ease-out;
      }

      .app-footer-links a:hover {
        color: var(--tulpar-color-brand-default, #00c57a);
      }

      .app-footer-links a:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, rgba(81, 78, 207, 0.4));
        outline-offset: 2px;
        border-radius: 4px;
      }

      .app-footer-copy {
        margin-inline-start: auto;
        font-size: 12px;
      }

      /* ── Aside settings panel ──────────────────────────────────────────── */
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
        .menu-trigger,
        .settings-trigger,
        .theme-toggle,
        .configurator-btn,
        .app-footer-links a,
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
  /** Dark-mode flag — forwarded to the shell, which toggles the `.dark` class. */
  readonly dark = signal(false);

  /** Sidenav mode — bound to the shell, switchable live from the settings drawer. */
  readonly sidenavMode = signal<ShellSidenavMode>('static');

  /** Sidenav position + density — dogfood the new sidenav inputs from the aside. */
  readonly position = signal<SidenavPosition>('left');
  readonly density = signal<SidenavDensity>('comfortable');

  /** Aside (settings) drawer open state — two-way bound to the shell. */
  readonly asideOpen = signal(false);

  readonly sidenavModes: { value: ShellSidenavMode; label: string }[] = [
    { value: 'static', label: 'Static' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'rail', label: 'Rail' },
  ];

  readonly positions: { value: SidenavPosition; label: string }[] = [
    { value: 'left', label: 'Left' },
    { value: 'right', label: 'Right' },
  ];

  readonly densities: { value: SidenavDensity; label: string }[] = [
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'compact', label: 'Compact' },
  ];

  /**
   * Topbar brand-icon menu button → re-dispatch the shell's menu-toggle event
   * from the button element so it bubbles (composed) up to <tulpar-shell>,
   * matching what the topbar's built-in menu button does.
   */
  toggleMenu(event: Event) {
    event.target?.dispatchEvent(
      new CustomEvent('tulpar-menu-toggle', { bubbles: true, composed: true }),
    );
  }
}
