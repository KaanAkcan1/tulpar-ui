import type {
  ElementRef} from "@angular/core";
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  input,
  output,
  viewChild,
} from "@angular/core";

import "@tulpar-ui/core/number-input";

import type {
  FieldSize,
  FieldVariant,
  LabelPosition,
  NecessityIndicator,
} from "@tulpar-ui/core/text-input";

export type { FieldSize, FieldVariant, LabelPosition, NecessityIndicator };
export type NumberFormatStyle = "decimal" | "currency" | "percent";

@Component({
  selector: "tulpar-number-input-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-number-input
      #host
      [attr.value]="value() ?? null"
      [attr.label]="label() ?? null"
      [attr.label-position]="labelPosition() ?? null"
      [attr.necessity-indicator]="necessityIndicator()"
      [attr.helper-text]="helperText() ?? null"
      [attr.error-text]="errorText() ?? null"
      [attr.warn-text]="warnText() ?? null"
      [attr.no-message-space]="noMessageSpace() ? '' : null"
      [attr.size]="size()"
      [attr.variant]="variant()"
      [attr.disabled]="disabled() ? '' : null"
      [attr.readonly]="readonly() ? '' : null"
      [attr.required]="required() ? '' : null"
      [attr.invalid]="invalid() ? '' : null"
      [attr.warn]="warn() ? '' : null"
      [attr.validating]="validating() ? '' : null"
      [attr.copyable]="copyable() ? '' : null"
      [attr.pastable]="pastable() ? '' : null"
      [attr.name]="name() ?? null"
      [attr.min]="min() ?? null"
      [attr.max]="max() ?? null"
      [attr.step]="step()"
      [attr.placeholder]="placeholder() ?? null"
      [attr.allow-empty]="allowEmpty() ? null : ''"
      [allowEmpty]="allowEmpty()"
      [attr.hide-steppers]="hideSteppers() ? '' : null"
      [attr.integer-only]="integerOnly() ? '' : null"
      [attr.format-style]="formatStyle()"
      [attr.currency]="currency() ?? null"
      [attr.locale]="locale()"
      [attr.min-fraction-digits]="minFractionDigits() ?? null"
      [attr.max-fraction-digits]="maxFractionDigits() ?? null"
      [useGrouping]="useGrouping()"
      [attr.format-prefix]="formatPrefix() ?? null"
      [attr.format-suffix]="formatSuffix() ?? null"
      [attr.step-hold-delay]="stepHoldDelay()"
      [attr.step-hold-interval]="stepHoldInterval()"
      (change)="onChangeEvent($event)"
    >
      <ng-content select="[slot='prefix']" />
      <ng-content select="[slot='suffix']" />
      <ng-content select="[slot='label']" />
    </tulpar-number-input>
  `,
})
export class TulparNumberInputComponent {
  // viewChild ref to the host WC element — used to forward formatOptions as a property
  // (formatOptions is attribute: false on the WC, so attr binding is not possible).
  readonly hostRef =
    viewChild<ElementRef<HTMLElement & { formatOptions?: Intl.NumberFormatOptions }>>("host");

  // FormFieldBase shared inputs
  readonly label = input<string | undefined>(undefined);
  readonly labelPosition = input<LabelPosition | undefined>(undefined);
  readonly necessityIndicator = input<NecessityIndicator>("icon");
  readonly helperText = input<string | undefined>(undefined);
  readonly errorText = input<string | undefined>(undefined);
  readonly warnText = input<string | undefined>(undefined);
  readonly noMessageSpace = input<boolean>(false);
  readonly size = input<FieldSize>("md");
  readonly variant = input<FieldVariant>("outlined");
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly warn = input<boolean>(false);
  readonly validating = input<boolean>(false);
  readonly copyable = input<boolean>(false);
  readonly pastable = input<boolean>(false);
  readonly name = input<string | undefined>(undefined);

  // Value
  readonly value = input<number | null>(null);

  // Number-specific inputs
  readonly min = input<number | undefined>(undefined);
  readonly max = input<number | undefined>(undefined);
  readonly step = input<number>(1);
  readonly placeholder = input<string | undefined>(undefined);
  // allowEmpty defaults true — use property binding so false can be expressed on the WC.
  readonly allowEmpty = input<boolean>(true);
  readonly hideSteppers = input<boolean>(false);
  readonly integerOnly = input<boolean>(false);

  // Format shorthand inputs
  readonly formatStyle = input<NumberFormatStyle>("decimal");
  readonly currency = input<string | undefined>(undefined);
  readonly locale = input<string>(
    typeof navigator !== "undefined" ? navigator.language : "en-US",
  );
  readonly minFractionDigits = input<number | undefined>(undefined);
  readonly maxFractionDigits = input<number | undefined>(undefined);
  // useGrouping defaults true — use property binding for the same reason as allowEmpty.
  readonly useGrouping = input<boolean>(true);
  readonly formatPrefix = input<string | undefined>(undefined);
  readonly formatSuffix = input<string | undefined>(undefined);
  readonly stepHoldDelay = input<number>(500);
  readonly stepHoldInterval = input<number>(50);

  // formatOptions is attribute: false on the WC — must be forwarded as a JS property.
  // We use an effect() to push the value onto the element reference whenever it changes.
  readonly formatOptions = input<Intl.NumberFormatOptions | undefined>(undefined);

  readonly valueChange = output<number | null>();

  constructor() {
    effect(() => {
      const opts = this.formatOptions();
      const el = this.hostRef()?.nativeElement;
      if (el) el.formatOptions = opts;
    });
  }

  onChangeEvent(e: Event) {
    const target = e.target as HTMLElement & { value: number | null };
    this.valueChange.emit(target.value);
  }
}
