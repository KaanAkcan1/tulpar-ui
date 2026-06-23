import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";

import "@tulpar-ui/core/select";

/**
 * Angular signal wrapper for `<tulpar-option>` — a single selectable item
 * inside `<tulpar-select-ng>`.
 *
 * Forwards `value`, `label`, `description`, and `disabled` as attributes.
 * Slot projection: `slot="icon"` and `slot="description"` are forwarded via
 * named `<ng-content>` selectors; the default slot carries label text.
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-option-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-option
      [attr.value]="value() ?? null"
      [attr.label]="label() ?? null"
      [attr.description]="description() ?? null"
      [attr.disabled]="disabled() ? '' : null"
    >
      <ng-content select="[slot='icon']" />
      <ng-content select="[slot='description']" />
      <ng-content />
    </tulpar-option>
  `,
})
export class TulparOptionComponent {
  /** The option value — passed to the parent select on selection. REQUIRED. */
  readonly value = input<string>("");

  /** Convenience label (alias of the default slot). Slot wins when both set. */
  readonly label = input<string | undefined>(undefined);

  /** Optional description line (alias of `slot="description"`). Slot wins. */
  readonly description = input<string | undefined>(undefined);

  /** Dims + marks as non-selectable. Keyboard nav skips disabled options. */
  readonly disabled = input<boolean>(false);
}
