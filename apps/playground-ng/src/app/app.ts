import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  TulparShellComponent,
  TulparTopbarComponent,
  TulparSidenavComponent,
} from '@tulpar-ui/angular';
import type { TulparNavItemData, ShellSidenavMode } from '@tulpar-ui/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TulparShellComponent, TulparTopbarComponent, TulparSidenavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tulpar-shell-ng
      [sidenavMode]="sidenavMode()"
      persistKey="playground-ng-shell"
      [dark]="dark()"
      [(asideOpen)]="asideOpen"
    >
      <!-- ── Topbar ───────────────────────────────────────────────────────── -->
      <tulpar-topbar-ng slot="topbar" [showMenuButton]="true">
        <div slot="start" class="brand">
          <span class="brand-mark">▲</span>
          <span class="brand-name">Tulpar UI</span>
          <span class="brand-tag">Angular playground</span>
        </div>
        <button
          slot="end"
          type="button"
          class="settings-trigger"
          aria-label="Open settings"
          (click)="asideOpen.set(true)"
        >
          <span aria-hidden="true">⚙</span>
          <span>Settings</span>
        </button>
      </tulpar-topbar-ng>

      <!-- ── Sidenav ──────────────────────────────────────────────────────── -->
      <tulpar-sidenav-ng slot="sidenav" navLabel="Components" [items]="menu" />

      <!-- ── Routed page content (default slot) ───────────────────────────── -->
      <router-outlet />

      <!-- ── Footer ───────────────────────────────────────────────────────── -->
      <footer slot="footer" class="app-footer">Tulpar UI · Angular playground · v0.6</footer>

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
          <legend>Theme</legend>
          <div class="segmented" role="radiogroup" aria-label="Theme">
            <label [class.on]="!dark()">
              <input type="radio" name="theme" [checked]="!dark()" (change)="dark.set(false)" />
              <span>☾ Light</span>
            </label>
            <label [class.on]="dark()">
              <input type="radio" name="theme" [checked]="dark()" (change)="dark.set(true)" />
              <span>★ Dark</span>
            </label>
          </div>
        </fieldset>

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

        <p class="settings-hint">
          State persists across reloads via <code>persistKey</code>. Close with Esc, the ✕, or the
          backdrop.
        </p>
      </section>
    </tulpar-shell-ng>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .brand {
        display: inline-flex;
        align-items: baseline;
        gap: 8px;
      }

      .brand-mark {
        font-size: 16px;
        color: var(--tulpar-color-brand-default, #2563eb);
      }

      .brand-name {
        font-family: var(--tulpar-font-family-display, Georgia, serif);
        font-size: 17px;
        font-weight: 600;
        color: var(--tulpar-color-text-primary, #1c1917);
      }

      .brand-tag {
        font-size: 12px;
        color: var(--tulpar-color-text-muted, #78716c);
      }

      .settings-trigger {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 40px;
        padding: 0 14px;
        border: 1px solid var(--tulpar-color-border-default, #e7e5e4);
        border-radius: 8px;
        background: var(--tulpar-color-bg-surface, #fafaf9);
        color: var(--tulpar-color-text-primary, #1c1917);
        font-family: inherit;
        font-size: 13px;
        cursor: pointer;
      }

      .settings-trigger:hover {
        background: var(--tulpar-color-bg-subtle, #f5f5f4);
      }

      .settings-trigger:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, #1e3a8a);
        outline-offset: 2px;
      }

      .app-footer {
        font-size: 13px;
        color: var(--tulpar-color-text-muted, #78716c);
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
        color: var(--tulpar-color-text-muted, #78716c);
        font-size: 15px;
        cursor: pointer;
      }

      .settings-close:hover {
        background: var(--tulpar-color-bg-subtle, #f5f5f4);
        color: var(--tulpar-color-text-primary, #1c1917);
      }

      .settings-close:focus-visible {
        outline: 2px solid var(--tulpar-color-focus-ring, #1e3a8a);
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
        color: var(--tulpar-color-text-muted, #78716c);
      }

      .segmented {
        display: flex;
        gap: 4px;
        padding: 4px;
        border-radius: 10px;
        background: var(--tulpar-color-bg-subtle, #f5f5f4);
      }

      .segmented label {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 40px;
        border-radius: 7px;
        font-size: 13px;
        color: var(--tulpar-color-text-secondary, #44403c);
        cursor: pointer;
        user-select: none;
        transition:
          background 150ms ease-out,
          color 150ms ease-out;
      }

      .segmented label:hover {
        color: var(--tulpar-color-text-primary, #1c1917);
      }

      .segmented label.on {
        background: var(--tulpar-color-bg-surface, #fff);
        color: var(--tulpar-color-brand-default, #2563eb);
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
        outline: 2px solid var(--tulpar-color-focus-ring, #1e3a8a);
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
        color: var(--tulpar-color-text-muted, #78716c);
      }

      .settings-hint code {
        font-family: var(--tulpar-font-family-mono, ui-monospace, monospace);
        font-size: 11px;
        padding: 1px 5px;
        border-radius: 4px;
        background: var(--tulpar-color-bg-subtle, #f5f5f4);
      }
    `,
  ],
})
export class App {
  /** Dark-mode flag — forwarded to the shell, which toggles the `.dark` class. */
  readonly dark = signal(false);

  /** Sidenav mode — bound to the shell, switchable live from the settings drawer. */
  readonly sidenavMode = signal<ShellSidenavMode>('static');

  /** Aside (settings) drawer open state — two-way bound to the shell. */
  readonly asideOpen = signal(false);

  readonly sidenavModes: { value: ShellSidenavMode; label: string }[] = [
    { value: 'static', label: 'Static' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'rail', label: 'Rail' },
  ];

  /** Sidenav menu — hrefs map 1:1 to the routes declared in app.routes.ts. */
  readonly menu: TulparNavItemData[] = [
    {
      label: 'Components',
      items: [
        { label: 'Button', href: '/button' },
        { label: 'TextInput', href: '/text-input' },
        { label: 'Textarea', href: '/textarea' },
        { label: 'NumberInput', href: '/number-input' },
      ],
    },
  ];
}
