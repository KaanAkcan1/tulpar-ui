import {
  ChangeDetectionStrategy,
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  model,
  output,
} from "@angular/core";
import type { Type } from "@angular/core";
import { NgComponentOutlet } from "@angular/common";

import "@tulpar-ui/core/checkbox";

import type { SelectionSize, SelectionLabelPosition } from "@tulpar-ui/core/checkbox";

export type { SelectionSize, SelectionLabelPosition };

/**
 * Angular signal wrapper for `<tulpar-checkbox>`.
 *
 * Two-way binding: use `[(checked)]="myBool"` — the wrapper reads
 * `el.checked` from the core's `change` event and syncs the model.
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-checkbox-ng",
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-checkbox
      [attr.checked]="checked() ? '' : null"
      [attr.indeterminate]="indeterminate() ? '' : null"
      [attr.value]="value()"
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
      @if (icon(); as i) {
        <span slot="icon"
          ><ng-container *ngComponentOutlet="i; inputs: { size: iconSize() }"
        /></span>
      }
      <ng-content select="[slot='icon']" />
      <ng-content select="[slot='label']" />
      <ng-content select="[slot='description']" />
    </tulpar-checkbox>
  `,
})
export class TulparCheckboxComponent {
  // Two-way
  readonly checked = model<boolean>(false);

  // Checkbox-specific
  readonly indeterminate = input<boolean>(false);
  readonly value = input<string>("on");
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

  /** Convenience: render a component into the `icon` slot (custom check glyph). */
  readonly icon = input<Type<unknown> | undefined>(undefined);

  /** Glyph px size per tier (~70% of the box) for the icon-component inputs. */
  protected readonly iconSize = computed(
    () => ({ xs: 10, sm: 11, md: 13, lg: 14, xl: 15 })[this.size()] ?? 13,
  );

  readonly change = output<Event>();

  onCoreChange(e: Event) {
    const el = e.target as HTMLElement & { checked: boolean };
    this.checked.set(el.checked);
    this.change.emit(e);
  }
}
