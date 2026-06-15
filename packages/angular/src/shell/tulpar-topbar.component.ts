import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";

import "@tulpar-ui/shell";

@Component({
  selector: "tulpar-topbar-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-topbar
      [attr.show-menu-button]="showMenuButton() ? '' : null"
      [attr.menu-button-label]="menuButtonLabel() ?? null"
    >
      <ng-content select="[slot='start']" />
      <ng-content />
      <ng-content select="[slot='end']" />
    </tulpar-topbar>
  `,
})
export class TulparTopbarComponent {
  readonly showMenuButton = input<boolean>(false);
  readonly menuButtonLabel = input<string | undefined>(undefined);
}
