import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  model,
  output,
  viewChild,
} from "@angular/core";
import type { ElementRef } from "@angular/core";

import "@tulpar-ui/core/switch";

import type { SelectionSize, SelectionLabelPosition } from "@tulpar-ui/core/switch";

export type { SelectionSize, SelectionLabelPosition };

/**
 * Angular signal wrapper for `<tulpar-switch>`.
 *
 * Two-way binding: use `[(checked)]="myBool"` — the wrapper reads
 * `el.checked` from the core's `change` event and syncs the model.
 *
 * Note: Angular's DomSanitizer blocks `[attr.on-*]` bindings (treats them as
 * event handlers). `onColor` and `offColor` are applied imperatively via
 * `afterRenderEffect` + a `viewChild` reference to the core element.
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-switch-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-switch
      #switchEl
      [attr.checked]="checked() ? '' : null"
      [attr.value]="value()"
      [attr.loading]="loading() ? '' : null"
      [attr.show-icon]="showIcon() ? '' : null"
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
      (change)="onCoreChange($event)"
    >
      <ng-content select="[slot='icon-on']" />
      <ng-content select="[slot='icon-off']" />
      <ng-content select="[slot='label']" />
      <ng-content select="[slot='description']" />
    </tulpar-switch>
  `,
})
export class TulparSwitchComponent {
  // Two-way
  readonly checked = model<boolean>(false);

  // Value
  readonly value = input<string>("on");

  // Switch-specific
  readonly loading = input<boolean>(false);
  readonly showIcon = input<boolean>(false);
  /**
   * Custom track color when checked. Applied imperatively because Angular's
   * DomSanitizer blocks `[attr.on-*]` bindings.
   */
  readonly onColor = input<string | undefined>(undefined);
  /** Custom track color when unchecked. */
  readonly offColor = input<string | undefined>(undefined);

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

  readonly change = output<Event>();

  private readonly switchEl = viewChild<ElementRef<HTMLElement>>("switchEl");

  constructor() {
    // Apply on-color / off-color imperatively — Angular blocks [attr.on-*].
    afterRenderEffect(() => {
      const el = this.switchEl()?.nativeElement;
      if (!el) return;
      const on = this.onColor();
      const off = this.offColor();
      if (on) el.setAttribute("on-color", on);
      else el.removeAttribute("on-color");
      if (off) el.setAttribute("off-color", off);
      else el.removeAttribute("off-color");
    });
  }

  onCoreChange(e: Event) {
    const el = e.target as HTMLElement & { checked: boolean };
    this.checked.set(el.checked);
    this.change.emit(e);
  }
}
