import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from "@angular/core";

import "@tulpar-ui/core/button";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonType = "button" | "submit" | "reset";

@Component({
  selector: "tulpar-button-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <tulpar-button
      [attr.variant]="variant()"
      [attr.size]="size()"
      [attr.type]="type()"
      [attr.disabled]="disabled() ? '' : null"
      [attr.loading]="loading() ? '' : null"
      [attr.icon-only]="iconOnly() ? '' : null"
      [attr.href]="href() ?? null"
      [attr.target]="target() ?? null"
      [attr.rel]="rel() ?? null"
      [attr.aria-label]="ariaLabel() ?? null"
      (click)="clicked.emit($event)"
    >
      <ng-content select="[slot=start]" />
      <ng-content />
      <ng-content select="[slot=end]" />
    </tulpar-button>
  `,
})
export class TulparButtonComponent {
  variant = input<ButtonVariant>("primary");
  size = input<ButtonSize>("md");
  type = input<ButtonType>("button");
  disabled = input(false);
  loading = input(false);
  iconOnly = input(false);
  href = input<string | undefined>(undefined);
  target = input<string | undefined>(undefined);
  rel = input<string | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);

  clicked = output<MouseEvent>();
}
