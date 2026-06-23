import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";

import "@tulpar-ui/core/spinner";

import type { SpinnerSize, SpinnerTone } from "@tulpar-ui/core/spinner";

// Re-export the core types so consumers can import from the wrapper.
export type { SpinnerSize, SpinnerTone };

/**
 * Angular signal wrapper for `<tulpar-spinner>` — indeterminate loader.
 *
 * Forwards every core attribute via `[attr.*]` and supports BOTH the `label`
 * prop and the `slot="label"` (the slot wins). `track` defaults to `true` in the
 * core, so the wrapper input also defaults to `true` and only removes the attr
 * when explicitly set to `false`.
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-spinner-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-spinner
      [attr.size]="size() ?? null"
      [attr.tone]="tone() ?? null"
      [attr.color]="color() ?? null"
      [attr.track]="track() ? '' : null"
      [attr.delay]="delay() ?? null"
      [attr.label]="label() ?? null"
    >
      <ng-content select="[slot='label']" />
    </tulpar-spinner>
  `,
})
export class TulparSpinnerComponent {
  /** Size tier (outer diameter). */
  readonly size = input<SpinnerSize | undefined>(undefined);
  /** Tone. Omitted → inherit `currentColor`; built-in / `custom` colorizes. */
  readonly tone = input<SpinnerTone | undefined>(undefined);
  /** Custom-tone base: a brand family name or any CSS color. */
  readonly color = input<string | undefined>(undefined);
  /** Faint full track ring behind the arc (core default: true). */
  readonly track = input<boolean>(true);
  /** Delay (ms) before the spinner renders. 0 = render immediately. */
  readonly delay = input<number | undefined>(undefined);
  /** Accessible name (visually-hidden). `slot="label"` wins when both set. */
  readonly label = input<string | undefined>(undefined);
}
