import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  TulparShellComponent,
  TulparTopbarComponent,
  TulparSidenavComponent,
} from '@tulpar-ui/angular';
import type { TulparNavItemData } from '@tulpar-ui/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TulparShellComponent, TulparTopbarComponent, TulparSidenavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <tulpar-shell-ng sidenavMode="static" persistKey="playground-ng-shell" [dark]="dark()">
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
          class="theme-toggle"
          [attr.aria-label]="dark() ? 'Switch to light mode' : 'Switch to dark mode'"
          (click)="dark.set(!dark())"
        >
          {{ dark() ? '☀ Light' : '☾ Dark' }}
        </button>
      </tulpar-topbar-ng>

      <!-- ── Sidenav ──────────────────────────────────────────────────────── -->
      <tulpar-sidenav-ng slot="sidenav" navLabel="Components" [items]="menu" />

      <!-- ── Routed page content (default slot) ───────────────────────────── -->
      <router-outlet />

      <!-- ── Footer ───────────────────────────────────────────────────────── -->
      <footer slot="footer" class="app-footer">Tulpar UI · Angular playground · v0.6</footer>
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

      .theme-toggle {
        padding: 6px 14px;
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

      .app-footer {
        font-size: 13px;
        color: var(--tulpar-color-text-muted, #78716c);
      }
    `,
  ],
})
export class App {
  /** Dark-mode flag — forwarded to the shell, which toggles the `.dark` class. */
  readonly dark = signal(false);

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
