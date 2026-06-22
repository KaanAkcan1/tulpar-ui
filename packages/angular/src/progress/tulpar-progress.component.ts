import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  viewChild,
} from "@angular/core";
import type { ElementRef } from "@angular/core";

import "@tulpar-ui/core/progress";

import type {
  ProgressVariant,
  ProgressTone,
  ProgressThickness,
  ProgressSize,
  ProgressValueFormatter,
} from "@tulpar-ui/core/progress";

// Re-export the core types so consumers can import from the wrapper.
export type {
  ProgressVariant,
  ProgressTone,
  ProgressThickness,
  ProgressSize,
  ProgressValueFormatter,
};

/**
 * Angular signal wrapper for `<tulpar-progress>` — linear + circular progress.
 *
 * Forwards every core attribute via `[attr.*]` and supports the `slot="label"`.
 *
 * `valueLabel` is non-serialisable: the core declares it `attribute: false`
 * (PROPERTY only) and it may be either a boolean (`true` → `${pct}%`) OR a
 * formatter FUNCTION. The wrapper sets it as a DOM PROPERTY via `viewChild` +
 * `afterRenderEffect` so functions survive (they cannot pass through `[attr.*]`).
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-progress-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-progress
      #progressEl
      [attr.variant]="variant() ?? null"
      [attr.value]="value() ?? null"
      [attr.min]="min() ?? null"
      [attr.max]="max() ?? null"
      [attr.indeterminate]="indeterminate() ? '' : null"
      [attr.buffer]="buffer() ?? null"
      [attr.tone]="tone() ?? null"
      [attr.color]="color() ?? null"
      [attr.state-tone]="stateTone() ? '' : null"
      [attr.thickness]="thickness() ?? null"
      [attr.size]="size() ?? null"
    >
      <ng-content select="[slot='label']" />
    </tulpar-progress>
  `,
})
export class TulparProgressComponent {
  /** Linear (default) or circular. */
  readonly variant = input<ProgressVariant | undefined>(undefined);
  /** Current value (clamped to min..max). Ignored when indeterminate. */
  readonly value = input<number | undefined>(undefined);
  /** Lower bound. */
  readonly min = input<number | undefined>(undefined);
  /** Upper bound. */
  readonly max = input<number | undefined>(undefined);
  /** Unknown-duration mode (traveling bar / rotating arc). */
  readonly indeterminate = input<boolean>(false);
  /** Secondary "buffered" value (linear only). */
  readonly buffer = input<number | undefined>(undefined);
  /** Tone. Default fill is brand green; built-in / custom recolors it. */
  readonly tone = input<ProgressTone | undefined>(undefined);
  /** Custom-tone base: a brand family name or any CSS color. */
  readonly color = input<string | undefined>(undefined);
  /** Auto-promote to success once value >= max (a consumer's danger wins). */
  readonly stateTone = input<boolean>(false);
  /** Bar thickness (linear). */
  readonly thickness = input<ProgressThickness | undefined>(undefined);
  /** Ring size (circular). */
  readonly size = input<ProgressSize | undefined>(undefined);

  /**
   * Value label: `true` → `${pct}%`; a formatter FUNCTION → its return (also
   * seeds aria-valuetext). Set as a DOM property because the core declares it
   * `attribute: false` and a function cannot serialise to an attribute.
   */
  readonly valueLabel = input<boolean | ProgressValueFormatter>(false);

  private readonly progressEl =
    viewChild<ElementRef<HTMLElement & { valueLabel: boolean | ProgressValueFormatter }>>(
      "progressEl",
    );

  constructor() {
    // valueLabel is property-only (attribute: false) and may be a function —
    // set it imperatively so booleans AND formatters both propagate.
    afterRenderEffect(() => {
      const el = this.progressEl()?.nativeElement;
      if (!el) return;
      el.valueLabel = this.valueLabel();
    });
  }
}
