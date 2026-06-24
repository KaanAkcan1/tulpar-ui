import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";

import "@tulpar-ui/core/select";

/**
 * Angular signal wrapper for `<tulpar-option-group>` — groups
 * `<tulpar-option-ng>` children under a header label.
 *
 * Forwards `label` as an attribute. Slot projection: `slot="label"` is
 * forwarded via a named `<ng-content>` selector; the default slot projects
 * child options.
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-option-group-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-option-group [attr.label]="label() ?? null">
      <ng-content select="[slot='label']" />
      <ng-content />
    </tulpar-option-group>
  `,
})
export class TulparOptionGroupComponent {
  /** Convenience label for the group header (alias of `slot="label"`). Slot wins. */
  readonly label = input<string | undefined>(undefined);
}
