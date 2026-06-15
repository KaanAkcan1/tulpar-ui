import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from "@angular/core";

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
      [attr.icon-class]="iconClass() ?? null"
      [attr.badge]="badge() ?? null"
      [attr.target]="target() ?? null"
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
  readonly iconClass = input<string | undefined>(undefined);
  readonly badge = input<string | undefined>(undefined);
  readonly active = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly target = input<string | undefined>(undefined);
}
