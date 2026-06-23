import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  output,
  viewChild,
} from "@angular/core";
import type { ElementRef } from "@angular/core";

import "@tulpar-ui/core/toast";

import type { ToastAction, ToneValue } from "@tulpar-ui/core/toast";

// Re-export types so consumers can import from the wrapper without depending on core.
export type { ToastAction, ToneValue };

/**
 * Angular signal wrapper for `<tulpar-toast>`.
 *
 * Forwards all attributes + named slots (`title`, `description`, `icon`, default)
 * and re-emits `tulpar-dismiss` / `tulpar-action` as Angular `output()`s.
 *
 * `actions` (array property) is applied imperatively via `afterRenderEffect`
 * because functions cannot be serialised through HTML attributes.
 *
 * None of the toast attributes are blocked by Angular's DomSanitizer — only
 * `[attr.on-*]` bindings are blocked (treated as event handlers).  All toast
 * attrs (`tone`, `bg`, `accent`, `color`, `text`, …) are standard names and
 * can be bound via template `[attr.*]` bindings directly.
 *
 * Boolean attribute convention: `boolAttr() ? '' : null` (present/absent — no
 * string `"false"` which Lit's Boolean converter would treat as truthy).
 *
 * NO RxJS — signals only.
 */
@Component({
  selector: "tulpar-toast-ng",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [":host { display: contents; }"],
  template: `
    <tulpar-toast
      #toastEl
      [attr.tone]="tone() ?? null"
      [attr.heading]="heading() ?? null"
      [attr.description]="description() ?? null"
      [attr.icon]="icon() ?? null"
      [attr.color]="color() ?? null"
      [attr.bg]="bg() ?? null"
      [attr.accent]="accent() ?? null"
      [attr.text]="text() ?? null"
      [attr.high-contrast]="highContrast() ? '' : null"
      [attr.closable]="closable() === false ? null : ''"
      [attr.timer]="timer() === false ? null : ''"
      [attr.duration]="duration() ?? null"
      [attr.timer-style]="timerStyle() ?? null"
      (tulpar-dismiss)="onCoreDismiss($event)"
      (tulpar-action)="onCoreAction($event)"
    >
      <ng-content select="[slot='title']" />
      <ng-content select="[slot='description']" />
      <ng-content select="[slot='icon']" />
      <ng-content />
    </tulpar-toast>
  `,
})
export class TulparToastComponent {
  // ── Tone & custom colour ─────────────────────────────────────────────────

  /** Semantic tone: `'info' | 'success' | 'warning' | 'danger' | 'custom'`. */
  readonly tone = input<string | undefined>(undefined);

  /** Custom tone: brand family name (e.g. `'ilay'`) or raw CSS colour (`'#0d9488'`). */
  readonly color = input<string | undefined>(undefined);

  /** Custom tone surface override. */
  readonly bg = input<string | undefined>(undefined);

  /** Custom tone accent override. */
  readonly accent = input<string | undefined>(undefined);

  /** Custom tone on-surface text override. */
  readonly text = input<string | undefined>(undefined);

  /**
   * High-contrast danger escalation.
   * Maps to the `high-contrast` attribute (boolean).
   */
  readonly highContrast = input<boolean | undefined>(undefined);

  // ── Content ─────────────────────────────────────────────────────────────

  /**
   * Toast heading / title text.
   * Maps to the `heading` attribute (avoids clash with the HTML `title` global attr).
   * `slot="title"` wins when both are present.
   */
  readonly heading = input<string | undefined>(undefined);

  /**
   * Description / body text.
   * `slot="description"` wins when both are present.
   */
  readonly description = input<string | undefined>(undefined);

  /**
   * Icon control: built-in name / raw SVG / emoji / `''` (no icon).
   * `slot="icon"` wins when both are present.
   */
  readonly icon = input<string | undefined>(undefined);

  /**
   * Action buttons.
   * Set as a JS PROPERTY on the core element (not an attribute) because the
   * array contains `onClick` functions that cannot be serialised through attrs.
   * Applied imperatively via `afterRenderEffect`.
   */
  readonly actions = input<ToastAction[] | undefined>(undefined);

  // ── Behaviour ───────────────────────────────────────────────────────────

  /**
   * Show the × close button.
   * `undefined` → core element default (true).
   * `false` → attribute removed (core interprets absent as its default true —
   *   pass as property if you need false; the template binding here removes the
   *   attr so the core's default fires; use `[actions]="[]"` + no closable for
   *   fully persistent non-closable toasts).
   *
   * Note: Lit's Boolean `@property({ type: Boolean })` treats ANY attribute
   * presence as `true`.  To set `closable = false` on the WC, the Angular
   * wrapper must omit the attribute (`null`).  This means `closable=false`
   * and `closable=undefined` behave the same at the attribute level (both
   * absent).  If you need explicit `false`, set the property directly on the
   * host element via `viewChild`.
   */
  readonly closable = input<boolean | undefined>(undefined);

  /**
   * Show the perimeter countdown ring.
   * `false` → removes the `timer` attribute (persistent, no ring).
   */
  readonly timer = input<boolean | undefined>(undefined);

  /** Auto-dismiss duration in ms. `0` = persistent. Default 5000. */
  readonly duration = input<number | undefined>(undefined);

  /**
   * Ring visual style: `'track'` (default) or `'soft'`.
   * Maps to the `timer-style` attribute.
   */
  readonly timerStyle = input<string | undefined>(undefined);

  // ── Outputs ─────────────────────────────────────────────────────────────

  /**
   * Emitted when the toast dismisses for any reason
   * (`reason: 'user' | 'timeout' | 'swipe' | 'programmatic' | 'action'`).
   * Wraps the core `tulpar-dismiss` CustomEvent.
   */
  readonly dismissed = output<CustomEvent>();

  /**
   * Emitted when an action button is clicked.
   * Wraps the core `tulpar-action` CustomEvent (`detail.label`, `detail.action`).
   */
  readonly action = output<CustomEvent>();

  // ── Private ─────────────────────────────────────────────────────────────

  private readonly toastEl =
    viewChild<ElementRef<HTMLElement & { actions: ToastAction[] }>>("toastEl");

  constructor() {
    // Set `actions` as a property — arrays with onClick functions cannot go through attrs.
    afterRenderEffect(() => {
      const el = this.toastEl()?.nativeElement;
      if (!el) return;
      const acts = this.actions();
      // Always set the property so clearing (undefined → []) propagates.
      el.actions = acts ?? [];
    });
  }

  // ── Event bridging ────────────────────────────────────────────────────

  /** Bridge `tulpar-dismiss` → `dismissed` output. */
  onCoreDismiss(e: Event): void {
    this.dismissed.emit(e as CustomEvent);
  }

  /** Bridge `tulpar-action` → `action` output. */
  onCoreAction(e: Event): void {
    this.action.emit(e as CustomEvent);
  }
}
