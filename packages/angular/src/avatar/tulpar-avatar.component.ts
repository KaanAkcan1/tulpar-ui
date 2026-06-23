import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, input } from "@angular/core";

import "@tulpar-ui/core/avatar";

import type { AvatarShape, AvatarSize } from "@tulpar-ui/core/avatar";

// Re-export the core types so consumers can import from the wrapper.
export type { AvatarShape, AvatarSize };

/**
 * Angular signal wrapper for `<tulpar-avatar>` — identity atom.
 *
 * Forwards every core attribute via `[attr.*]`. The avatar has no first-class
 * named slots in the core (its fallback cascade is internal); a default
 * `<ng-content />` is forwarded for forward-compatibility.
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-avatar-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-avatar
      [attr.src]="src() ?? null"
      [attr.name]="name() ?? null"
      [attr.initials]="initials() ?? null"
      [attr.alt]="alt() ?? null"
      [attr.shape]="shape() ?? null"
      [attr.size]="size() ?? null"
      [attr.color]="color() ?? null"
    >
      <ng-content />
    </tulpar-avatar>
  `,
})
export class TulparAvatarComponent {
  /** Image source. When it loads, the image renders over all fallbacks. */
  readonly src = input<string | undefined>(undefined);
  /** Person / entity name — drives initials, deterministic color + a11y name. */
  readonly name = input<string | undefined>(undefined);
  /** Manual initials override (wins over name-derived initials). */
  readonly initials = input<string | undefined>(undefined);
  /** Image alt text. Falls back to `name` when omitted. */
  readonly alt = input<string | undefined>(undefined);
  /** Corner shape. */
  readonly shape = input<AvatarShape | undefined>(undefined);
  /** Size tier. */
  readonly size = input<AvatarSize | undefined>(undefined);
  /** Single-accent override for the initials background (family name or CSS color). */
  readonly color = input<string | undefined>(undefined);
}
