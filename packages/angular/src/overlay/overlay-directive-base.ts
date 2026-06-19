import {
  Directive,
  ElementRef,
  Renderer2,
  effect,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

/**
 * Minimal structural type for the core overlay custom elements
 * (`<tulpar-tooltip>` / `<tulpar-toggletip>` / `<tulpar-popover>`). The directive
 * only touches the cross-cutting props it owns; element-specific props (tone,
 * arrow, …) are written generically via attributes/properties by subclasses.
 */
export interface TulparOverlayElement extends HTMLElement {
  for?: string;
  text?: string;
  open?: boolean;
}

let trgSeq = 0;

/**
 * Mint a stable, unique id for a trigger host. Only used when the host has no
 * author-supplied id — a consumer-set id is NEVER clobbered.
 */
function mintTriggerId(): string {
  return `tulpar-trg-${++trgSeq}`;
}

/**
 * Shared base for the Tulpar overlay attribute directives. It owns the
 * cross-cutting concerns that every overlay form needs and that are independent
 * of the concrete element tag / its bespoke props:
 *
 * - id-minting: ensure the host element has an `id` so a core overlay's `for`
 *   can resolve to it (a consumer-set id is preserved untouched);
 * - event bridging: forward the core element's `tulpar-open` / `tulpar-close`
 *   events to an `openChange` Angular output (and an optional controlled
 *   `open` input pushed back down to the element);
 * - teardown bookkeeping for the listeners.
 *
 * Inline vs Ref behaviour (element creation/lookup + per-input sync) is left to
 * the subclasses, which call the small protected helpers here.
 *
 * Signals only — `input()` / `output()` / `signal()` / `effect()`. No RxJS.
 */
@Directive()
export abstract class OverlayDirectiveBase {
  protected readonly hostRef = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly renderer = inject(Renderer2);
  protected readonly doc = inject(DOCUMENT);

  /**
   * Optional controlled open state. When provided (non-`undefined`) it is pushed
   * down onto the core element's `open` property; `openChange` always reflects
   * the element's actual transitions regardless.
   */
  readonly openControlled = input<boolean | undefined>(undefined);

  /** Emits the overlay's open state whenever it opens or closes. */
  readonly openChange = output<boolean>();

  /**
   * The core overlay element this directive drives (inline-created or declared).
   * A signal so the controlled-`open` effect (installed in the constructor's
   * injection context) reacts once the element is wired in `ngOnInit`.
   */
  protected readonly overlayElSig = signal<TulparOverlayElement | null>(null);

  /** Convenience accessor for the current element (untracked read). */
  protected get overlayEl(): TulparOverlayElement | null {
    return this.overlayElSig();
  }

  protected set overlayEl(el: TulparOverlayElement | null) {
    this.overlayElSig.set(el);
  }

  /** Detaches the open/close event bridge; set once the element is wired. */
  private unbridge: (() => void) | null = null;

  constructor() {
    // Controlled open: when a value is supplied, drive the element's `open`
    // property (the core element treats `open` as a controlled reactive prop).
    // Installed here so it lives in the directive's injection context.
    effect(() => {
      const el = this.overlayElSig();
      const controlled = this.openControlled();
      if (!el || controlled === undefined) return;
      el.open = controlled;
    });
  }

  /**
   * Ensure the host has an id and return it. A consumer-supplied id is returned
   * as-is and never overwritten; only a genuinely id-less host gets a minted one.
   */
  protected ensureHostId(): string {
    const host = this.hostRef.nativeElement;
    const existing = host.getAttribute("id");
    if (existing) return existing;
    const id = mintTriggerId();
    this.renderer.setAttribute(host, "id", id);
    return id;
  }

  /**
   * Wire the `tulpar-open` / `tulpar-close` bridge from the given element to the
   * `openChange` output, and install the controlled-`open` effect. Call once the
   * `overlayEl` reference exists.
   */
  protected bridgeEvents(el: TulparOverlayElement): void {
    this.overlayEl = el;
    const onOpen = (): void => this.openChange.emit(true);
    const onClose = (): void => this.openChange.emit(false);
    el.addEventListener("tulpar-open", onOpen);
    el.addEventListener("tulpar-close", onClose);
    this.unbridge = () => {
      el.removeEventListener("tulpar-open", onOpen);
      el.removeEventListener("tulpar-close", onClose);
    };
  }

  /** Remove the event bridge. Safe to call when nothing was wired. */
  protected teardownBridge(): void {
    this.unbridge?.();
    this.unbridge = null;
  }

  /**
   * Set a string/boolean attribute on the core element, removing it when the
   * value is `undefined`/`null`. Booleans use the empty-string presence form.
   */
  protected setOverlayAttr(name: string, value: string | number | boolean | undefined | null): void {
    const el = this.overlayEl;
    if (!el) return;
    if (value === undefined || value === null || value === false) {
      this.renderer.removeAttribute(el, name);
    } else if (value === true) {
      this.renderer.setAttribute(el, name, "");
    } else {
      this.renderer.setAttribute(el, name, String(value));
    }
  }
}
