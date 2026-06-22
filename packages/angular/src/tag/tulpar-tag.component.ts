import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
} from "@angular/core";

import "@tulpar-ui/core/tag";

import type { TagVariant, TagShape, TagSize } from "@tulpar-ui/core/tag";

// Re-export the core types so consumers can import from the wrapper.
export type { TagVariant, TagShape, TagSize };

/**
 * Angular signal wrapper for `<tulpar-tag>` — static, read-only tonal metadata.
 *
 * Forwards every core attribute via `[attr.*]` and supports BOTH the `label` /
 * `icon` props and their slots (`slot="icon"`, default slot). The slot wins when
 * both are present (the core decides).
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-tag-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-tag
      [attr.tone]="tone() ?? null"
      [attr.color]="color() ?? null"
      [attr.bg]="bg() ?? null"
      [attr.accent]="accent() ?? null"
      [attr.text]="text() ?? null"
      [attr.variant]="variant() ?? null"
      [attr.shape]="shape() ?? null"
      [attr.size]="size() ?? null"
      [attr.dot]="dot() ? '' : null"
      [attr.icon]="icon() ?? null"
      [attr.disabled]="disabled() ? '' : null"
      [attr.label]="label() ?? null"
    >
      <ng-content select="[slot='icon']" />
      <ng-content />
    </tulpar-tag>
  `,
})
export class TulparTagComponent {
  /** Tone (status / category). `'neutral'|'info'|'success'|'warning'|'danger'|'custom'`. */
  readonly tone = input<string | undefined>(undefined);
  /** Custom-tone base: a brand family name or any raw CSS color. */
  readonly color = input<string | undefined>(undefined);
  /** Custom-tone surface override. */
  readonly bg = input<string | undefined>(undefined);
  /** Custom-tone accent override. */
  readonly accent = input<string | undefined>(undefined);
  /** Custom-tone text override. */
  readonly text = input<string | undefined>(undefined);
  /** Visual variant. */
  readonly variant = input<TagVariant | undefined>(undefined);
  /** Corner shape. */
  readonly shape = input<TagShape | undefined>(undefined);
  /** Size tier. */
  readonly size = input<TagSize | undefined>(undefined);
  /** Show a leading tone-colored dot (ignored when `icon` is set). */
  readonly dot = input<boolean>(false);
  /** Leading icon: raw SVG string or emoji. `slot="icon"` wins when both set. */
  readonly icon = input<string | undefined>(undefined);
  /** Dim + non-interactive. */
  readonly disabled = input<boolean>(false);
  /** Convenience label (alias of the default slot). Slot wins when both set. */
  readonly label = input<string | undefined>(undefined);
}
