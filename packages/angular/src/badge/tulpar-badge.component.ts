import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from "@angular/core";

import "@tulpar-ui/core/badge";

import type { BadgeTone, BadgeVariant, BadgeShape, BadgeSize } from "@tulpar-ui/core/badge";

// Re-export the core types so consumers can import from the wrapper.
export type { BadgeTone, BadgeVariant, BadgeShape, BadgeSize };

/**
 * Angular signal wrapper for `<tulpar-badge>` — count / status indicator.
 *
 * Forwards every core attribute via `[attr.*]` and supports BOTH the `label`
 * prop and the default slot (the slot wins for rendered content; the prop still
 * seeds the numeric accessible-name noun).
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-badge-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-badge
      [attr.tone]="tone() ?? null"
      [attr.variant]="variant() ?? null"
      [attr.count]="count() ?? null"
      [attr.max]="max() ?? null"
      [attr.show-zero]="showZero() ? '' : null"
      [attr.dot]="dot() ? '' : null"
      [attr.shape]="shape() ?? null"
      [attr.size]="size() ?? null"
      [attr.label]="label() ?? null"
    >
      <ng-content />
    </tulpar-badge>
  `,
})
export class TulparBadgeComponent {
  /** Tone (status / category). */
  readonly tone = input<BadgeTone | undefined>(undefined);
  /** Visual variant. */
  readonly variant = input<BadgeVariant | undefined>(undefined);
  /** Numeric count. Ignored in `dot` mode. */
  readonly count = input<number | undefined>(undefined);
  /** Overflow cap: counts above this render as `${max}+`. */
  readonly max = input<number | undefined>(undefined);
  /** Show the badge when `count === 0` (hidden by default). */
  readonly showZero = input<boolean>(false);
  /** Bare status dot (ignores count). */
  readonly dot = input<boolean>(false);
  /** Corner shape. */
  readonly shape = input<BadgeShape | undefined>(undefined);
  /** Size tier. */
  readonly size = input<BadgeSize | undefined>(undefined);
  /** Convenience short label (alias of the default slot) + a11y noun source. */
  readonly label = input<string | undefined>(undefined);
}
