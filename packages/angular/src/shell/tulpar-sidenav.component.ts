import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  effect,
  inject,
  input,
} from "@angular/core";

import "@tulpar-ui/shell";
import type { TulparNavItemData, TulparSidenav } from "@tulpar-ui/shell";

export type { TulparNavItemData };

@Component({
  selector: "tulpar-sidenav-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-sidenav [attr.nav-label]="navLabel() ?? null">
      <ng-content select="[slot='header']" />
      <ng-content />
      <ng-content select="[slot='footer']" />
    </tulpar-sidenav>
  `,
})
export class TulparSidenavComponent {
  readonly items = input<TulparNavItemData[] | undefined>(undefined);
  readonly navLabel = input<string | undefined>(undefined);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // `items` is a DOM property (not an attribute) — set it on the element.
    effect(() => {
      const el = this.host.nativeElement.querySelector<TulparSidenav>("tulpar-sidenav");
      if (el) el.items = this.items();
    });
  }
}
