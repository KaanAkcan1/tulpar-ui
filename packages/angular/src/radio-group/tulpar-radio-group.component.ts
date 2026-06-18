import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  model,
  output,
} from "@angular/core";

import "@tulpar-ui/core/radio-group";

import type { SelectionSize } from "@tulpar-ui/core/radio-group";

export type { SelectionSize };

/**
 * Angular signal wrapper for `<tulpar-radio-group>`.
 *
 * Group nesting note: this wrapper uses `display:contents` so the core
 * `<tulpar-radio-group>` element is the direct DOM parent of any projected
 * `<tulpar-radio>` (or `<tulpar-radio-ng>`) children. The core group queries
 * children via descendant selector for `tulpar-radio`, so the core elements
 * must remain descendants of the core group — this `display:contents` host
 * ensures that.
 *
 * Two-way binding: use `[(value)]="myString"` — synced via the group's
 * composed `change` CustomEvent `detail.value`.
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-radio-group-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-radio-group
      [attr.value]="value() ?? null"
      [attr.name]="name() ?? null"
      [attr.orientation]="orientation()"
      [attr.size]="size()"
      [attr.label]="label() ?? null"
      [attr.disabled]="disabled() ? '' : null"
      [attr.readonly]="readonly() ? '' : null"
      [attr.required]="required() ? '' : null"
      [attr.invalid]="invalid() ? '' : null"
      [attr.warn]="warn() ? '' : null"
      [attr.helper-text]="helperText() ?? null"
      [attr.error-text]="errorText() ?? null"
      [attr.warn-text]="warnText() ?? null"
      [attr.no-message-space]="noMessageSpace() ? '' : null"
      [attr.color]="color() ?? null"
      [attr.description]="description() ?? null"
      (change)="onCoreChange($event)"
    >
      <ng-content select="[slot='label']" />
      <ng-content select="[slot='description']" />
      <ng-content />
    </tulpar-radio-group>
  `,
})
export class TulparRadioGroupComponent {
  // Two-way
  readonly value = model<string | null>(null);

  // Group props
  readonly name = input<string | undefined>(undefined);
  readonly orientation = input<"vertical" | "horizontal">("vertical");
  readonly size = input<SelectionSize>("md");
  readonly label = input<string | undefined>(undefined);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly warn = input<boolean>(false);
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly warnText = input<string | undefined>(undefined);
  readonly noMessageSpace = input<boolean>(false);
  readonly color = input<string | undefined>(undefined);
  readonly description = input<string | undefined>(undefined);

  readonly change = output<CustomEvent<{ value: string | null }>>();

  onCoreChange(e: Event) {
    const ce = e as CustomEvent<{ value: string | null }>;
    if (ce.detail && "value" in ce.detail) {
      this.value.set(ce.detail.value);
      this.change.emit(ce);
    }
  }
}
