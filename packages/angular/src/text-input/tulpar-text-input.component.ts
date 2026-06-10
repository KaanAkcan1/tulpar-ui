import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from "@angular/core";

import "@tulpar-ui/core/text-input";

import type {
  TextInputType,
  FieldSize,
  FieldVariant,
  LabelPosition,
  NecessityIndicator,
} from "@tulpar-ui/core/text-input";

export type { TextInputType, FieldSize, FieldVariant, LabelPosition, NecessityIndicator };

@Component({
  selector: "tulpar-text-input-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-text-input
      [attr.type]="type()"
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
      [attr.clearable]="clearable() ? '' : null"
      [attr.show-count]="showCount() ? '' : null"
      [attr.no-reveal-toggle]="noRevealToggle() ? '' : null"
      [attr.copyable]="copyable() ? '' : null"
      [attr.pastable]="pastable() ? '' : null"
      [attr.placeholder]="placeholder() ?? null"
      [attr.autocomplete]="autocomplete() ?? null"
      [attr.maxlength]="maxLength() ?? null"
      [attr.minlength]="minLength() ?? null"
      [attr.pattern]="pattern() ?? null"
      [attr.name]="name() ?? null"
      [attr.mask]="mask() ?? null"
      [attr.mask-emit]="maskEmit()"
      [attr.mask-display]="maskDisplay()"
      [attr.mask-slot-char]="maskSlotChar()"
      [attr.prefix-interactive]="prefixInteractive() ? '' : null"
      [attr.suffix-interactive]="suffixInteractive() ? '' : null"
      (input)="onInput($event)"
      (change)="onChangeEvent($event)"
    >
      <ng-content select="[slot='prefix']" />
      <ng-content select="[slot='suffix']" />
      <ng-content select="[slot='label']" />
    </tulpar-text-input>
  `,
})
export class TulparTextInputComponent {
  readonly type = input<TextInputType>("text");
  readonly value = input<string>("");
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
  readonly clearable = input<boolean>(false);
  readonly showCount = input<boolean>(false);
  readonly noRevealToggle = input<boolean>(false);
  readonly copyable = input<boolean>(false);
  readonly pastable = input<boolean>(false);
  readonly placeholder = input<string | undefined>(undefined);
  readonly autocomplete = input<string | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);
  readonly minLength = input<number | undefined>(undefined);
  readonly pattern = input<string | undefined>(undefined);
  readonly name = input<string | undefined>(undefined);
  readonly mask = input<string | undefined>(undefined);
  readonly maskEmit = input<"masked" | "raw">("masked");
  readonly maskDisplay = input<"eager" | "lazy">("eager");
  readonly maskSlotChar = input<string>("_");
  readonly prefixInteractive = input<boolean>(false);
  readonly suffixInteractive = input<boolean>(false);

  readonly valueChange = output<string>();
  readonly change = output<Event>();

  onInput(e: Event) {
    const v = (e.target as HTMLElement & { value: string }).value;
    this.valueChange.emit(v);
  }

  onChangeEvent(e: Event) {
    this.change.emit(e);
  }
}
