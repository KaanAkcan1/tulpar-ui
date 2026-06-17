import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";

import "@tulpar-ui/shell";

@Component({
  selector: "tulpar-nav-item-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-nav-item
      [attr.href]="href() ?? null"
      [attr.label]="label() ?? null"
      [attr.icon]="icon() ?? null"
      [attr.icon-class]="iconClass() ?? null"
      [attr.badge]="badge() ?? null"
      [attr.target]="target() ?? null"
      [attr.count]="count() ?? null"
      [attr.dot-label]="dotLabel() ?? null"
      [attr.kbd]="kbd() ?? null"
      [attr.dot]="dot() ? '' : null"
      [attr.active]="active() ? '' : null"
      [attr.disabled]="disabled() ? '' : null"
    >
      <ng-content />
    </tulpar-nav-item>
  `,
})
export class TulparNavItemComponent {
  readonly href = input<string | undefined>(undefined);
  readonly label = input<string | undefined>(undefined);
  /** Raw SVG string forwarded to the element's `icon` attribute. */
  readonly icon = input<string | undefined>(undefined);
  readonly iconClass = input<string | undefined>(undefined);
  readonly badge = input<string | undefined>(undefined);
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly target = input<string | undefined>(undefined);
  readonly count = input<string | undefined>(undefined);
  readonly dot = input<boolean>(false);
  readonly dotLabel = input<string | undefined>(undefined);
  readonly kbd = input<string | undefined>(undefined);
}
