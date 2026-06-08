import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { LucideAngularModule, type LucideIconData } from "lucide-angular";

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
  imports: [LucideAngularModule],
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
      [attr.icon-only]="iconOnly() || autoIconOnly() ? '' : null"
      [attr.icon-position]="iconPosition()"
      [attr.icon-separator]="iconSeparator() ? '' : null"
      [attr.href]="href() ?? null"
      [attr.target]="target() ?? null"
      [attr.rel]="rel() ?? null"
      [attr.aria-label]="ariaLabel() ?? null"
      [attr.tooltip]="tooltip() ?? null"
      (click)="clicked.emit($event)"
    >
      @if (icon()) {
        <span slot="start">
          <lucide-angular [img]="icon()" [size]="effectiveIconSize()"></lucide-angular>
        </span>
      }
      <ng-content select="[slot=start]" />
      <ng-content />
      <ng-content select="[slot=end]" />
      <ng-content select="[slot=loading-icon]" />
    </tulpar-button>
  `,
})
export class TulparButtonComponent implements AfterContentInit {
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
  /** Lucide icon data (e.g. `Check`, `ArrowRight`) imported from `lucide-angular`. */
  icon = input<LucideIconData | undefined>(undefined);
  /** Optional override for icon size; defaults to button's size-scale value. */
  iconSize = input<number | undefined>(undefined);

  clicked = output<MouseEvent>();

  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly hasText = signal(false);

  /** Effective icon size — explicit override wins over per-size default. */
  effectiveIconSize = computed(
    () => this.iconSize() ?? ICON_SIZE_BY_BUTTON_SIZE[this.size()],
  );

  /** Auto icon-only when `icon` is set AND no projected text exists. */
  autoIconOnly = computed(() => Boolean(this.icon()) && !this.hasText());

  ngAfterContentInit(): void {
    // Detect projected text content. The host element's textContent reflects
    // light-DOM children (post-projection). Whitespace-only counts as empty.
    const text = (this.hostRef.nativeElement.textContent ?? "").trim();
    this.hasText.set(text.length > 0);
  }
}
