import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";

import "@tulpar-ui/shell";

@Component({
  selector: "tulpar-nav-section-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-nav-section [attr.label]="label() ?? null">
      <ng-content />
    </tulpar-nav-section>
  `,
})
export class TulparNavSectionComponent {
  readonly label = input<string | undefined>(undefined);
}
