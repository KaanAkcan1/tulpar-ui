import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  model,
  output,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

import "@tulpar-ui/shell";
import type { ShellSidenavMode, ShellState, TulparShell } from "@tulpar-ui/shell";
import { persistShellState } from "@tulpar-ui/shell";

export type { ShellSidenavMode, ShellState };

@Component({
  selector: "tulpar-shell-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-shell
      [attr.sidenav-mode]="sidenavMode()"
      [attr.sidenav-layout]="sidenavLayout()"
      [attr.mobile-breakpoint]="mobileBreakpoint()"
      [attr.sidenav-collapsed]="sidenavCollapsed() ? '' : null"
      [attr.aside-open]="asideOpen() ? '' : null"
      [attr.content-width]="contentWidth()"
      [attr.content-padding]="contentPadding()"
      [attr.footer-mode]="footerMode()"
      (tulpar-navigate)="onNavigate($event)"
      (tulpar-aside-close)="asideOpen.set(false)"
      (tulpar-shell-change)="shellChange.emit($any($event).detail)"
    >
      <ng-content select="[slot='topbar']" />
      <ng-content select="[slot='sidenav']" />
      <ng-content />
      <ng-content select="[slot='footer']" />
      <ng-content select="[slot='aside']" />
    </tulpar-shell>
  `,
})
export class TulparShellComponent {
  readonly sidenavMode = input<ShellSidenavMode>("static");
  readonly sidenavLayout = input<"under-topbar" | "over-topbar">("under-topbar");
  readonly mobileBreakpoint = input<string>("(max-width: 991px)");
  readonly sidenavCollapsed = input<boolean>(false);
  readonly asideOpen = model<boolean>(false);
  readonly contentWidth = input<"fluid" | "fixed">("fluid");
  readonly contentPadding = input<"none" | "compact" | "comfortable">("comfortable");
  readonly footerMode = input<"inline" | "fixed">("inline");
  readonly persistKey = input<string | undefined>(undefined);
  readonly dark = input<boolean>(false);
  readonly shellChange = output<ShellState>();

  private readonly router = inject(Router, { optional: true });
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Router → active item update. Subscribing to Router.events (Angular's own
    // Observable API) purely to re-dispatch a DOM event is the only allowed
    // RxJS touch — no state is stored in RxJS. Cleaned up via DestroyRef.
    const sub = this.router?.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        window.dispatchEvent(new Event("tulpar-location-changed"));
      }
    });
    this.destroyRef.onDestroy(() => sub?.unsubscribe());

    effect(() => {
      const el = this.host.nativeElement.querySelector<TulparShell>("tulpar-shell");
      if (el) el.dark = this.dark();
    });

    effect((onCleanup) => {
      const key = this.persistKey();
      const el = this.host.nativeElement.querySelector<TulparShell>("tulpar-shell");
      if (key && el) {
        const dispose = persistShellState(el, key);
        onCleanup(dispose);
      }
    });
  }

  onNavigate(e: Event) {
    if (!this.router) return; // no router → native <a> navigation
    e.preventDefault();
    this.router.navigateByUrl((e as CustomEvent).detail.href);
  }
}
