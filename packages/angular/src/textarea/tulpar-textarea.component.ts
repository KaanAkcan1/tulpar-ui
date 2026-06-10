import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from "@angular/core";

import "@tulpar-ui/core/textarea";

import type {
  FieldSize,
  FieldVariant,
  LabelPosition,
  NecessityIndicator,
} from "@tulpar-ui/core/text-input";

export type { FieldSize, FieldVariant, LabelPosition, NecessityIndicator };
export type TextareaResize = "none" | "both" | "horizontal" | "vertical";

@Component({
  selector: "tulpar-textarea-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-textarea
      [attr.value]="value() || null"
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
      [attr.placeholder]="placeholder() ?? null"
      [attr.maxlength]="maxLength() ?? null"
      [attr.minlength]="minLength() ?? null"
      [attr.show-count]="showCount() ? '' : null"
      [attr.min-rows]="minRows()"
      [attr.max-rows]="maxRows()"
      [attr.rows]="rows() ?? null"
      [attr.resize]="resize()"
      [autosize]="autosize()"
      (input)="onInput($event)"
    >
      <ng-content select="[slot='label']" />
    </tulpar-textarea>
  `,
})
export class TulparTextareaComponent {
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
  readonly value = input<string>("");

  // Textarea-specific inputs
  readonly placeholder = input<string | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);
  readonly minLength = input<number | undefined>(undefined);
  readonly showCount = input<boolean>(false);
  // autosize defaults true — use property binding so the WC boolean property is
  // set directly (attribute presence alone cannot express "false" for booleans-defaulting-true).
  readonly autosize = input<boolean>(true);
  readonly minRows = input<number>(2);
  readonly maxRows = input<number>(6);
  readonly rows = input<number | undefined>(undefined);
  readonly resize = input<TextareaResize>("vertical");

  readonly valueChange = output<string>();

  onInput(e: Event) {
    const v = (e.target as HTMLElement & { value: string }).value;
    this.valueChange.emit(v);
  }
}
