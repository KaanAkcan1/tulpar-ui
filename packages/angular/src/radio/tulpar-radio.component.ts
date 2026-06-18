import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  model,
  output,
} from "@angular/core";

import "@tulpar-ui/core/radio";

import type { SelectionSize, SelectionLabelPosition } from "@tulpar-ui/core/radio";

export type { SelectionSize, SelectionLabelPosition };

/**
 * Angular signal wrapper for `<tulpar-radio>`.
 *
 * Normally used inside `<tulpar-radio-group-ng>`. The `value` identifies this
 * radio within its group. `checked` reflects group-driven selection.
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-radio-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-radio
      [attr.value]="value()"
      [attr.checked]="checked() ? '' : null"
      [attr.variant]="variant()"
      [attr.size]="size()"
      [attr.label]="label() ?? null"
      [attr.label-position]="labelPosition()"
      [attr.disabled]="disabled() ? '' : null"
      [attr.readonly]="readonly() ? '' : null"
      [attr.required]="required() ? '' : null"
      [attr.invalid]="invalid() ? '' : null"
      [attr.warn]="warn() ? '' : null"
      [attr.helper-text]="helperText() ?? null"
      [attr.error-text]="errorText() ?? null"
      [attr.warn-text]="warnText() ?? null"
      [attr.no-message-space]="noMessageSpace() ? '' : null"
      [attr.name]="name() ?? null"
      [attr.color]="color() ?? null"
      [attr.description]="description() ?? null"
      (change)="onCoreChange($event)"
    >
      <ng-content select="[slot='label']" />
      <ng-content select="[slot='description']" />
    </tulpar-radio>
  `,
})
export class TulparRadioComponent {
  // Identity (required)
  readonly value = input.required<string>();

  // Two-way
  readonly checked = model<boolean>(false);

  // Radio-specific
  readonly variant = input<"default" | "card">("default");

  // SelectionControlBase shared inputs
  readonly size = input<SelectionSize>("md");
  readonly label = input<string | undefined>(undefined);
  readonly labelPosition = input<SelectionLabelPosition>("end");
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly warn = input<boolean>(false);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly warnText = input<string | undefined>(undefined);
  readonly noMessageSpace = input<boolean>(false);
  readonly name = input<string | undefined>(undefined);
  readonly color = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);

  readonly change = output<Event>();

  onCoreChange(e: Event) {
    const el = e.target as HTMLElement & { checked: boolean };
    this.checked.set(el.checked);
    this.change.emit(e);
  }
}
