import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  afterRenderEffect,
  computed,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";
import type { ElementRef ,
  Type} from "@angular/core";
import { NgComponentOutlet } from "@angular/common";

import "@tulpar-ui/core/button";

import type {
  ButtonSeverity,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  ButtonIconPosition,
  ButtonLoadingPosition,
  ButtonType,
  ButtonJustify,
  ButtonColor,
} from "@tulpar-ui/core";

export type {
  ButtonSeverity,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
  ButtonIconPosition,
  ButtonLoadingPosition,
  ButtonType,
  ButtonJustify,
  ButtonColor,
};

/** Default icon size per button size — matches the token scale. */
const ICON_SIZE_BY_BUTTON_SIZE: Record<ButtonSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 28,
};

@Component({
  selector: "tulpar-button-ng",
  standalone: true,
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
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
      [attr.icon-only]="iconOnly() || autoIconOnly() ? '' : null"
      [attr.icon-position]="iconPosition()"
      [attr.icon-separator]="iconSeparator() ? '' : null"
      [attr.href]="href() ?? null"
      [attr.target]="target() ?? null"
      [attr.rel]="rel() ?? null"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.tooltip]="tooltip() ?? null"
      [attr.name]="name() ?? null"
      [attr.value]="value() ?? null"
      (click)="clicked.emit($event)"
    >
      @if (icon(); as iconCmp) {
        <span slot="start">
          <ng-container
            *ngComponentOutlet="iconCmp; inputs: { size: effectiveIconSize() }"
          />
        </span>
      }
      <ng-content select="[slot=start]" />
      <span #contentWrapper><ng-content /></span>
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
  tooltip = input<string | undefined>(undefined);
  name = input<string | undefined>(undefined);
  value = input<string | undefined>(undefined);
  /**
   * Optional Angular component class to render in the start slot.
   * Receives `size` input (defaults to the per-size scale value).
   * Consumers may instead project content into `slot="start"` directly.
   */
  icon = input<Type<unknown> | undefined>(undefined);
  /** Optional override for icon size; defaults to button's size-scale value. */
  iconSize = input<number | undefined>(undefined);

  clicked = output<MouseEvent>();

  private readonly contentWrapper = viewChild<ElementRef<HTMLElement>>("contentWrapper");
  private readonly hasText = signal(false);

  /** Effective icon size — explicit override wins over per-size default. */
  effectiveIconSize = computed(() => this.iconSize() ?? ICON_SIZE_BY_BUTTON_SIZE[this.size()]);

  /** Auto icon-only when `icon` is set AND no projected text exists. */
  autoIconOnly = computed(() => Boolean(this.icon()) && !this.hasText());

  constructor() {
    afterRenderEffect(() => {
      const el = this.contentWrapper()?.nativeElement;
      if (!el) return;
      const trimmed = (el.textContent ?? "").trim();
      this.hasText.set(trimmed.length > 0);
    });
  }
}
