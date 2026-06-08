import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from "@angular/core";

import "@tulpar-ui/core/button";

export type ButtonSeverity =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warn"
  | "help"
  | "danger"
  | "contrast"
  | "premium";

export type ButtonVariant = "solid" | "outlined" | "tonal" | "ghost" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type ButtonShape = "default" | "round" | "circle";
export type ButtonIconPosition = "start" | "end" | "top" | "bottom";
export type ButtonLoadingPosition = "start" | "center" | "end";
export type ButtonType = "button" | "submit" | "reset";
export type ButtonJustify = "start" | "center" | "end" | "between";
export type ButtonColor =
  | "navy"
  | "gold"
  | "stone"
  | "slate"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

@Component({
  selector: "tulpar-button-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <tulpar-button
      [attr.severity]="severity()"
      [attr.variant]="variant()"
      [attr.color]="color() ?? null"
      [attr.shape]="shape()"
      [attr.size]="size()"
      [attr.type]="type()"
      [attr.raised]="raised() ? '' : null"
      [attr.block]="block() ? '' : null"
      [attr.justify]="justify()"
      [attr.disabled]="disabled() ? '' : null"
      [attr.data-disabled]="dataDisabled() ? '' : null"
      [attr.loading]="loading() ? '' : null"
      [attr.loading-label]="loadingLabel() ?? null"
      [attr.loading-position]="loadingPosition()"
      [attr.icon-only]="iconOnly() ? '' : null"
      [attr.icon-position]="iconPosition()"
      [attr.icon-separator]="iconSeparator() ? '' : null"
      [attr.href]="href() ?? null"
      [attr.target]="target() ?? null"
      [attr.rel]="rel() ?? null"
      [attr.aria-label]="ariaLabel() ?? null"
      (click)="clicked.emit($event)"
    >
      <ng-content select="[slot=start]" />
      <ng-content />
      <ng-content select="[slot=end]" />
      <ng-content select="[slot=loading-icon]" />
    </tulpar-button>
  `,
})
export class TulparButtonComponent {
  severity = input<ButtonSeverity>("primary");
  variant = input<ButtonVariant>("solid");
  color = input<ButtonColor | undefined>(undefined);
  shape = input<ButtonShape>("default");
  size = input<ButtonSize>("md");
  type = input<ButtonType>("button");
  raised = input(false);
  block = input(false);
  justify = input<ButtonJustify>("center");
  disabled = input(false);
  dataDisabled = input(false);
  loading = input(false);
  loadingLabel = input<string | undefined>(undefined);
  loadingPosition = input<ButtonLoadingPosition>("center");
  iconOnly = input(false);
  iconPosition = input<ButtonIconPosition>("start");
  iconSeparator = input(false);
  href = input<string | undefined>(undefined);
  target = input<string | undefined>(undefined);
  rel = input<string | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);

  clicked = output<MouseEvent>();
}
