import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  model,
  output,
} from "@angular/core";

import "@tulpar-ui/core/checkbox-group";

import type { SelectionSize } from "@tulpar-ui/core/checkbox-group";

export type { SelectionSize };

/**
 * Angular signal wrapper for `<tulpar-checkbox-group>`.
 *
 * Group nesting note: this wrapper uses `display:contents` so the core
 * `<tulpar-checkbox-group>` element is the direct DOM parent of any projected
 * `<tulpar-checkbox>` (or `<tulpar-checkbox-ng>`) children. The core group
 * queries children via descendant selector for `tulpar-checkbox`, so the core
 * elements must remain descendants of the core group — this `display:contents`
 * host ensures that.
 *
 * Two-way binding: use `[(value)]="myArray"` — synced via the group's composed
 * `change` CustomEvent `detail.value` (string[]).
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-checkbox-group-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-checkbox-group
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
      (change)="onCoreChange($event)"
    >
      <ng-content select="[slot='label']" />
      <ng-content select="[slot='description']" />
      <ng-content />
    </tulpar-checkbox-group>
  `,
})
export class TulparCheckboxGroupComponent {
  // Two-way (array value)
  readonly value = model<string[]>([]);

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

  readonly change = output<CustomEvent<{ value: string[] }>>();

  onCoreChange(e: Event) {
    const ce = e as CustomEvent<{ value: string[] }>;
    if (ce.detail && "value" in ce.detail) {
      this.value.set(ce.detail.value);
      this.change.emit(ce);
    }
  }
}
