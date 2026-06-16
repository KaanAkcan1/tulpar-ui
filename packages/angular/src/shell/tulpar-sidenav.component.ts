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
    <tulpar-sidenav
      [attr.nav-label]="navLabel() ?? null"
      [attr.position]="position()"
      [attr.density]="density()"
      [attr.single-expand]="singleExpand() ? '' : null"
    >
      <ng-content select="[slot='header']" />
      <ng-content select="[slot='header-actions']" />
      <ng-content select="[slot='search']" />
      <ng-content select="[slot='utility-start']" />
      <ng-content select="[slot='utility-end']" />
      <ng-content />
      <ng-content select="[slot='footer']" />
    </tulpar-sidenav>
  `,
})
export class TulparSidenavComponent {
  readonly items = input<TulparNavItemData[] | undefined>(undefined);
  readonly navLabel = input<string | undefined>(undefined);
  readonly position = input<"left" | "right">("left");
  readonly density = input<"comfortable" | "compact">("comfortable");
  readonly singleExpand = input<boolean>(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // `items` is a DOM property (not an attribute) — set it on the element.
    effect(() => {
      const el = this.host.nativeElement.querySelector<TulparSidenav>("tulpar-sidenav");
      if (el) el.items = this.items();
    });
  }
}
