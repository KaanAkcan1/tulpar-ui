import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
} from "@angular/core";

import "@tulpar-ui/core/chip";

import type { ChipVariant, ChipShape, ChipSize } from "@tulpar-ui/core/chip";

// Re-export the core types so consumers can import from the wrapper.
export type { ChipVariant, ChipShape, ChipSize };

/**
 * Angular signal wrapper for `<tulpar-chip>` — the interactive display atom.
 *
 * Forwards every core attribute via `[attr.*]`, supports BOTH the `label` /
 * `icon` / `avatar` props and their slots (`slot="icon"`, `slot="avatar"`,
 * default), and bridges the core CustomEvents:
 *   - `tulpar-click`  → `clicked` output
 *   - `tulpar-remove` → `removed` output
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-chip-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-chip
      [attr.tone]="tone() ?? null"
      [attr.color]="color() ?? null"
      [attr.bg]="bg() ?? null"
      [attr.accent]="accent() ?? null"
      [attr.text]="text() ?? null"
      [attr.variant]="variant() ?? null"
      [attr.shape]="shape() ?? null"
      [attr.size]="size() ?? null"
      [attr.icon]="icon() ?? null"
      [attr.avatar]="avatar() ?? null"
      [attr.removable]="removable() ? '' : null"
      [attr.disabled]="disabled() ? '' : null"
      [attr.label]="label() ?? null"
      (tulpar-click)="onCoreClick($event)"
      (tulpar-remove)="onCoreRemove($event)"
    >
      <ng-content select="[slot='avatar']" />
      <ng-content select="[slot='icon']" />
      <ng-content />
    </tulpar-chip>
  `,
})
export class TulparChipComponent {
  /** Tone (status / category). */
  readonly tone = input<string | undefined>(undefined);
  /** Custom-tone base: a brand family name or any raw CSS color. */
  readonly color = input<string | undefined>(undefined);
  /** Custom-tone surface override. */
  readonly bg = input<string | undefined>(undefined);
  /** Custom-tone accent override. */
  readonly accent = input<string | undefined>(undefined);
  /** Custom-tone text override. */
  readonly text = input<string | undefined>(undefined);
  /** Visual variant. `ghost` = transparent rest → soft-tonal hover. */
  readonly variant = input<ChipVariant | undefined>(undefined);
  /** Corner shape. */
  readonly shape = input<ChipShape | undefined>(undefined);
  /** Size tier. */
  readonly size = input<ChipSize | undefined>(undefined);
  /** Leading icon: name, raw SVG string, or emoji. `slot="icon"` wins. */
  readonly icon = input<string | undefined>(undefined);
  /** Leading avatar: an image URL or initials. `slot="avatar"` wins. */
  readonly avatar = input<string | undefined>(undefined);
  /** Show the trailing remove control (an independent tab stop). */
  readonly removable = input<boolean>(false);
  /** Dim + non-interactive + not focusable. */
  readonly disabled = input<boolean>(false);
  /** Convenience label (alias of the default slot). Slot wins when both set. */
  readonly label = input<string | undefined>(undefined);

  /** Emitted when the chip body is activated (click / Enter / Space). */
  readonly clicked = output<CustomEvent>();
  /** Emitted when the remove control fires (click / Delete / Backspace). */
  readonly removed = output<CustomEvent>();

  /** Bridge `tulpar-click` → `clicked` output. */
  onCoreClick(e: Event): void {
    this.clicked.emit(e as CustomEvent);
  }

  /** Bridge `tulpar-remove` → `removed` output. */
  onCoreRemove(e: Event): void {
    this.removed.emit(e as CustomEvent);
  }
}
