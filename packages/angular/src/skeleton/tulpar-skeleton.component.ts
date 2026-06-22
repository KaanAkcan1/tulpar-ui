import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from "@angular/core";

import "@tulpar-ui/core/skeleton";

import type { SkeletonVariant, SkeletonAnimation } from "@tulpar-ui/core/skeleton";

// Re-export the core types so consumers can import from the wrapper.
export type { SkeletonVariant, SkeletonAnimation };

/**
 * Angular signal wrapper for `<tulpar-skeleton>` — loading placeholder.
 *
 * Forwards every core attribute via `[attr.*]`. The skeleton is purely
 * decorative (`aria-hidden` set by the core); it has no slots.
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-skeleton-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-skeleton
      [attr.variant]="variant() ?? null"
      [attr.lines]="lines() ?? null"
      [attr.width]="width() ?? null"
      [attr.height]="height() ?? null"
      [attr.radius]="radius() ?? null"
      [attr.animation]="animation() ?? null"
    ></tulpar-skeleton>
  `,
})
export class TulparSkeletonComponent {
  /** Shape variant. */
  readonly variant = input<SkeletonVariant | undefined>(undefined);
  /** Number of text-line bars (text variant only). */
  readonly lines = input<number | undefined>(undefined);
  /** Explicit width override (any CSS length). */
  readonly width = input<string | undefined>(undefined);
  /** Explicit height override (any CSS length). */
  readonly height = input<string | undefined>(undefined);
  /** Explicit corner-radius override (any CSS length). */
  readonly radius = input<string | undefined>(undefined);
  /** Animation style. */
  readonly animation = input<SkeletonAnimation | undefined>(undefined);
}
