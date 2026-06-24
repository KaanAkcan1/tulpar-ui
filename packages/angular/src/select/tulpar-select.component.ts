import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  model,
  output,
} from "@angular/core";

import "@tulpar-ui/core/select";

import type {
  SelectChangeDetail,
  FieldSize,
  FieldVariant,
  LabelPosition,
  NecessityIndicator,
} from "@tulpar-ui/core/select";

// Re-export the core types so consumers can import from the wrapper.
export type { SelectChangeDetail, FieldSize, FieldVariant, LabelPosition, NecessityIndicator };

/**
 * Angular signal wrapper for `<tulpar-select>` — single-select dropdown.
 *
 * Two-way binding: use `[(value)]="myString"` — synced via the core's bubbling
 * `change` CustomEvent `detail.value`.
 *
 * Slot projection: `<ng-content />` inside `<tulpar-select>` projects
 * `<tulpar-option-ng>` / `<tulpar-option>` children into the core's default
 * slot (the options list). Named slots `label`, `prefix`, `suffix` are
 * forwarded via `<ng-content select="[slot='...']" />`.
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-select-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-select
      [attr.value]="value() || null"
      [attr.placeholder]="placeholder() ?? null"
      [attr.clearable]="clearable() ? '' : null"
      [attr.loading]="loading() ? '' : null"
      [attr.open]="open() ? '' : null"
      [attr.name]="name() ?? null"
      [attr.size]="size() ?? null"
      [attr.variant]="variant() ?? null"
      [attr.disabled]="disabled() ? '' : null"
      [attr.readonly]="readonly() ? '' : null"
      [attr.label]="label() ?? null"
      [attr.label-position]="labelPosition() ?? null"
      [attr.required]="required() ? '' : null"
      [attr.necessity-indicator]="necessityIndicator() ?? null"
      [attr.helper-text]="helperText() ?? null"
      [attr.error-text]="errorText() ?? null"
      [attr.warn-text]="warnText() ?? null"
      [attr.invalid]="invalid() ? '' : null"
      [attr.warn]="warn() ? '' : null"
      [attr.validating]="validating() ? '' : null"
      [attr.no-message-space]="noMessageSpace() ? '' : null"
      [attr.prefix-interactive]="prefixInteractive() ? '' : null"
      [attr.suffix-interactive]="suffixInteractive() ? '' : null"
      [attr.empty-text]="emptyText() ?? null"
      [attr.loading-text]="loadingText() ?? null"
      [attr.error]="error() ?? null"
      (change)="onCoreChange($event)"
    >
      <ng-content select="[slot='label']" />
      <ng-content select="[slot='prefix']" />
      <ng-content select="[slot='suffix']" />
      <ng-content />
    </tulpar-select>
  `,
})
export class TulparSelectComponent {
  /** Two-way bindable selected value. Use \`[(value)]="myVar"\`. */
  readonly value = model<string>("");

  /** Placeholder text shown when no value is selected. */
  readonly placeholder = input<string | undefined>(undefined);

  /** When true, shows a clear (✕) affordance once a value is selected. */
  readonly clearable = input<boolean>(false);

  /** Shows a spinner in the trigger instead of the chevron. */
  readonly loading = input<boolean>(false);

  /** Controls open state of the listbox. */
  readonly open = input<boolean>(false);

  /** Form field name (native form association). */
  readonly name = input<string | undefined>(undefined);

  /** Size tier. */
  readonly size = input<FieldSize | undefined>(undefined);

  /** Visual variant. */
  readonly variant = input<FieldVariant | undefined>(undefined);

  /** Dim + non-interactive. */
  readonly disabled = input<boolean>(false);

  /** Read-only state — focusable but not editable. */
  readonly readonly = input<boolean>(false);

  /** Convenience label (alias of `slot="label"`). */
  readonly label = input<string | undefined>(undefined);

  /** Label position. */
  readonly labelPosition = input<LabelPosition | undefined>(undefined);

  /** Marks the field as required. */
  readonly required = input<boolean>(false);

  /** Necessity indicator display mode. */
  readonly necessityIndicator = input<NecessityIndicator | undefined>(undefined);

  /** Helper text shown below the field. */
  readonly helperText = input<string | undefined>(undefined);

  /** Error message shown below the field when `invalid`. */
  readonly errorText = input<string | undefined>(undefined);

  /** Warning message shown below the field when `warn`. */
  readonly warnText = input<string | undefined>(undefined);

  /** Puts the field in an invalid (error) state. */
  readonly invalid = input<boolean>(false);

  /** Puts the field in a warning state. */
  readonly warn = input<boolean>(false);

  /** Shows an in-progress validation indicator. */
  readonly validating = input<boolean>(false);

  /** Suppresses the reserved space below the field for helper/error/warn text. */
  readonly noMessageSpace = input<boolean>(false);

  /** Makes the prefix icon/slot slot focusable/interactive. */
  readonly prefixInteractive = input<boolean>(false);

  /** Makes the suffix icon/slot slot focusable/interactive. */
  readonly suffixInteractive = input<boolean>(false);

  /** Text shown inside the listbox when there are no options. */
  readonly emptyText = input<string | undefined>(undefined);

  /** Text shown inside the listbox loading status row. */
  readonly loadingText = input<string | undefined>(undefined);

  /** When set, shows an error status row inside the listbox. */
  readonly error = input<string | undefined>(undefined);

  /** Emitted when the selected value changes. */
  readonly changed = output<CustomEvent<SelectChangeDetail>>();

  onCoreChange(e: Event): void {
    const ce = e as CustomEvent<SelectChangeDetail>;
    if (ce.detail && "value" in ce.detail) {
      this.value.set(ce.detail.value);
      this.changed.emit(ce);
    }
  }
}
