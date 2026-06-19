import { LitElement, html } from "lit";
import { property, query } from "lit/decorators.js";
import { tooltipStyles } from "./tulpar-tooltip.styles";
import { warnDev } from "../_internal/warn-dev";
import {
  resolveAnchor,
  warnIfBadTrigger,
  warnIfUnresolvedFor,
  supportsPopover,
} from "../_internal/overlay/anchor";
import { linkDescribedBy, unlinkDescribedBy } from "../_internal/overlay/aria";
import { pushOverlay, popOverlay, topOverlay } from "../_internal/overlay/overlay-root";
import { overlayDelay } from "../_internal/overlay/delay-controller";
import {
  computePosition,
  type Placement,
  type Side,
  type Rect,
} from "../_internal/overlay/positioner";

export type TooltipBoundary = "viewport";

/**
 * Author-facing placement: the full `side-align` grammar plus the bare sides
 * (which imply `-center`) and `auto`. Normalized to a `Placement` before being
 * handed to the pure positioner.
 */
export type TooltipPlacement = Placement | Side;

const BARE_SIDES = new Set<string>(["top", "bottom", "left", "right"]);

/** Expand a bare side (`"top"`) to its centered placement (`"top-center"`). */
function normalizePlacement(p: TooltipPlacement): Placement {
  if (p === "auto") return "auto";
  if (BARE_SIDES.has(p)) return `${p as Side}-center`;
  return p as Placement;
}

const ARROW_SIZE = 9;

let tooltipKeySeq = 0;

/**
 * `<tulpar-tooltip>` — an accessible, collision-aware tooltip chip.
 *
 * Composition:
 * - positioning math: `_internal/overlay/positioner` (pure, DOM-free).
 * - anchor resolution + capability probes: `_internal/overlay/anchor`.
 * - aria wiring: `_internal/overlay/aria`.
 * - timing: `_internal/overlay/delay-controller` (shared open/close delays +
 *   skip-delay grace between sibling tooltips).
 * - top-layer + Escape/topmost stack: `_internal/overlay/overlay-root`.
 *
 * Trigger binding is by id: the tooltip references an EXTERNAL trigger via the
 * `for` attribute (`<tulpar-tooltip for="saveBtn">`) and self-wires listeners +
 * `aria-describedby` onto it. The tooltip never wraps its trigger. The host owns
 * no layout box (`display:none`); only the surface (rendered in the shadow root)
 * is shown. When opened the surface is promoted to the top layer via the native
 * Popover API (when supported) or by reading rects + applying fixed coordinates
 * in the shadow root. WCAG 1.4.13 (hoverable / dismissible / persistent) is
 * honored.
 */
export class TulparTooltip extends LitElement {
  static override styles = tooltipStyles;

  // --- Positioning ---
  @property({ type: String, reflect: true })
  placement: TooltipPlacement = "top";

  @property({ type: Number })
  offset = 8;

  @property({ type: Number, attribute: "cross-offset" })
  crossOffset = 0;

  @property({ type: Number, attribute: "container-padding" })
  containerPadding = 12;

  @property({ type: String, reflect: true })
  boundary: TooltipBoundary = "viewport";

  @property({ type: Boolean })
  flip = true;

  @property({ type: Boolean })
  arrow = true;

  // --- Content / state ---
  @property({ type: String })
  text?: string;

  @property({ type: Boolean, reflect: true })
  open?: boolean;

  @property({ type: Boolean, attribute: "default-open" })
  defaultOpen?: boolean;

  /**
   * Id of the EXTERNAL trigger element this tooltip describes. Resolved against
   * the host's `ownerDocument`; the tooltip wires hover/focus/Esc listeners and
   * `aria-describedby` onto the resolved element. Reflected so the attribute and
   * property stay in sync.
   */
  @property({ type: String, reflect: true })
  for?: string;

  /**
   * Internal open flag, mirrored to `[data-open]` on the surface. Deliberately
   * NOT a reactive `@state`: visibility is driven imperatively via the
   * `[data-open]` attribute (set in `_doOpen`/`_doClose`), not via `render()`.
   * Keeping it a plain field means toggling it from inside `updated()` (the
   * controlled-`open` path) never schedules a re-entrant Lit update — which is
   * what produced the dev-mode "scheduled an update after an update completed"
   * warning.
   */
  protected _isOpen = false;

  @query(".surface")
  protected _surface!: HTMLElement;

  @query(".arrow")
  protected _arrowEl!: HTMLElement | null;

  @query(".bridge")
  protected _bridgeEl!: HTMLElement | null;

  /** The currently-resolved anchor element (trigger), if any. */
  protected _anchorEl: HTMLElement | null = null;

  /** Test-only accessor for the resolved trigger element. */
  get _anchorElForTest(): HTMLElement | null {
    return this._anchorEl;
  }

  /** Unique key for the shared delay controller (per instance). */
  private readonly _delayKey = `tooltip-${(tooltipKeySeq += 1)}`;

  /** Tracks whether the last focus arrived via a pointer (for 1.4.13 focus). */
  private _pointerFocus = false;

  /**
   * Set while an internal open/close transition writes back to the reflected
   * `open` property, so the resulting `updated()` re-entry is ignored (no Lit
   * "scheduled an update after an update completed" dev warning). `open` still
   * behaves as a controlled reactive property for external callers.
   */
  private _internalOpenChange = false;

  override connectedCallback(): void {
    super.connectedCallback();
    void this.updateComplete.then(() => {
      this._wireTrigger();
      if (this.defaultOpen || this.open) this._doOpen();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    overlayDelay.cancel(this._delayKey);
    popOverlay(this);
    this._detachTriggerListeners();
    if (this._anchorEl && this._surface) unlinkDescribedBy(this._anchorEl, this._surface);
  }

  override firstUpdated(): void {
    this._wireTrigger();
  }

  override updated(changed: Map<string, unknown>): void {
    // Re-wire when the trigger reference changes (detach the old trigger's
    // listeners/aria first; `_wireTrigger` handles that via the diff).
    if (changed.has("for")) this._wireTrigger();
    // Ignore the `open` change we wrote back ourselves during an internal
    // open/close transition — only react to externally-driven changes.
    if (changed.has("open") && !this._internalOpenChange) {
      // Controlled mode: the `open` property drives visibility.
      if (this.open && !this._isOpen) this._doOpen();
      else if (this.open === false && this._isOpen) this._doClose();
    }
    if (changed.has("placement") && this._isOpen) this.reposition();
  }

  // ------------------------------------------------------------------
  // Imperative API
  // ------------------------------------------------------------------

  /** Open the tooltip (imperative; bypasses hover delay). */
  show(): void {
    this._doOpen();
  }

  /** Close the tooltip (imperative). */
  hide(): void {
    this._doClose();
  }

  /** Toggle the tooltip open/closed. */
  toggle(): void {
    if (this._isOpen) this._doClose();
    else this._doOpen();
  }

  private _emit(type: "tulpar-open" | "tulpar-close" | "tulpar-toggle"): void {
    this.dispatchEvent(
      new CustomEvent(type, { detail: { open: this._isOpen }, bubbles: true, composed: true }),
    );
  }

  // ------------------------------------------------------------------
  // Trigger wiring
  // ------------------------------------------------------------------

  protected _wireTrigger = (): void => {
    const next = resolveAnchor(this);
    if (next === this._anchorEl) {
      if (this._anchorEl && this._surface) linkDescribedBy(this._anchorEl, this._surface);
      // Dev-warn the unresolved-`for` case even when nothing changed (e.g. the
      // trigger simply never existed) so a typo'd id is still surfaced once.
      else warnIfUnresolvedFor(this, next);
      return;
    }
    this._detachTriggerListeners();
    if (this._anchorEl && this._surface) unlinkDescribedBy(this._anchorEl, this._surface);
    this._anchorEl = next;
    if (next) {
      warnIfBadTrigger(next);
      this._attachTriggerListeners(next);
      if (this._surface) linkDescribedBy(next, this._surface);
    } else {
      warnIfUnresolvedFor(this, next);
    }
  };

  private _attachTriggerListeners(el: HTMLElement): void {
    el.addEventListener("mouseenter", this._onTriggerEnter);
    el.addEventListener("mouseleave", this._onTriggerLeave);
    el.addEventListener("pointerdown", this._onTriggerPointerDown);
    el.addEventListener("focus", this._onTriggerFocus);
    el.addEventListener("blur", this._onTriggerBlur);
  }

  private _detachTriggerListeners(): void {
    const el = this._anchorEl;
    if (!el) return;
    el.removeEventListener("mouseenter", this._onTriggerEnter);
    el.removeEventListener("mouseleave", this._onTriggerLeave);
    el.removeEventListener("pointerdown", this._onTriggerPointerDown);
    el.removeEventListener("focus", this._onTriggerFocus);
    el.removeEventListener("blur", this._onTriggerBlur);
  }

  // ------------------------------------------------------------------
  // Hover + focus handlers (WCAG 1.4.13)
  // ------------------------------------------------------------------

  private _onTriggerEnter = (): void => {
    overlayDelay.requestOpen(this._delayKey, () => this._doOpen());
  };

  private _onTriggerLeave = (): void => {
    overlayDelay.requestClose(this._delayKey, () => this._doClose());
  };

  /** A pointerdown immediately before focus marks the focus as mouse-driven. */
  private _onTriggerPointerDown = (): void => {
    this._pointerFocus = true;
    // Reset shortly after; focus fires synchronously after pointerdown.
    requestAnimationFrame(() => {
      this._pointerFocus = false;
    });
  };

  private _onTriggerFocus = (): void => {
    // Mouse-originated focus (a click) must NOT open — only keyboard focus does
    // (approximates :focus-visible without relying on the pseudo-class on the
    // light-DOM trigger).
    if (this._pointerFocus) return;
    overlayDelay.cancel(this._delayKey);
    this._doOpen();
  };

  private _onTriggerBlur = (): void => {
    overlayDelay.requestClose(this._delayKey, () => this._doClose());
  };

  // The surface + bridge keep the tooltip open while hovered (hoverable).
  private _onSurfaceEnter = (): void => {
    overlayDelay.cancel(this._delayKey);
  };

  private _onSurfaceLeave = (): void => {
    overlayDelay.requestClose(this._delayKey, () => this._doClose());
  };

  // ------------------------------------------------------------------
  // Open / close
  // ------------------------------------------------------------------

  protected _doOpen(): void {
    if (this._isOpen) return;
    if (!this._anchorEl) this._wireTrigger();
    if (!this._anchorEl) return;
    // Single-open: a tooltip is transient, so opening one closes any other
    // currently-open overlay tooltip before promoting this one.
    const current = topOverlay();
    if (current && current !== this && current instanceof TulparTooltip) {
      current._doClose();
    }
    this._isOpen = true;
    // Keep the reflected `open` property in sync (controlled mode round-trips).
    // Guard the write so the re-entrant `updated()` it schedules is ignored.
    if (this.open !== true) {
      this._internalOpenChange = true;
      this.open = true;
      void this.updateComplete.then(() => {
        this._internalOpenChange = false;
      });
    }
    // Register on the stack so a top-most Escape closes only this tooltip.
    pushOverlay(this, () => this._dismiss());
    // Cancel any in-flight exit so re-opening mid-close doesn't later demote a
    // now-open surface or leak listeners/timers.
    if (this._exitCleanup) {
      this._exitCleanup = null;
    }
    // Make the surface visible synchronously so the open state is observable on
    // the same task (the surface element is always rendered). The Popover API
    // also requires the element not be `display:none` before showPopover().
    this._surface?.setAttribute("data-open", "");
    this._surface?.removeAttribute("data-exiting");
    // Promote to the top layer, position, then attach surface hover listeners.
    const finishOpen = (): void => {
      if (!this._isOpen) return;
      this._promote();
      this.reposition();
      this._surface?.addEventListener("mouseenter", this._onSurfaceEnter);
      this._surface?.addEventListener("mouseleave", this._onSurfaceLeave);
    };
    if (this._surface) finishOpen();
    else void this.updateComplete.then(finishOpen);
    this._emit("tulpar-open");
    this._emit("tulpar-toggle");
  }

  /** Pending exit-animation cleanup, if any. */
  private _exitCleanup: (() => void) | null = null;

  protected _doClose(immediate = false): void {
    if (!this._isOpen) return;
    this._isOpen = false;
    if (this.open !== false) {
      this._internalOpenChange = true;
      this.open = false;
      void this.updateComplete.then(() => {
        this._internalOpenChange = false;
      });
    }
    popOverlay(this);
    const surface = this._surface;
    surface?.removeEventListener("mouseenter", this._onSurfaceEnter);
    surface?.removeEventListener("mouseleave", this._onSurfaceLeave);

    // Tear down any in-flight exit first (interruptible).
    if (this._exitCleanup) {
      this._exitCleanup();
      this._exitCleanup = null;
    }

    // Logical close is committed immediately: remove [data-open] so the open
    // state is observable synchronously. The brief exit animation plays under
    // [data-exiting] (which keeps the surface displayed), then we demote.
    surface?.removeAttribute("data-open");

    const finalize = (): void => {
      surface?.removeAttribute("data-exiting");
      this._demote();
    };

    // Esc/dismiss (immediate) removes instantly; so does any environment without
    // CSS animations. Otherwise play the exit, then demote on animationend
    // (timeout fallback so we never leave a detached surface around).
    if (immediate || !surface || typeof surface.animate !== "function") {
      finalize();
    } else {
      surface.setAttribute("data-exiting", "");
      let done = false;
      const onEnd = (): void => {
        if (done) return;
        done = true;
        surface.removeEventListener("animationend", onEnd);
        clearTimeout(fallback);
        this._exitCleanup = null;
        if (!this._isOpen) finalize();
      };
      surface.addEventListener("animationend", onEnd);
      const fallback = setTimeout(onEnd, 400);
      this._exitCleanup = () => {
        done = true;
        surface.removeEventListener("animationend", onEnd);
        clearTimeout(fallback);
        finalize();
      };
    }

    this._emit("tulpar-close");
    this._emit("tulpar-toggle");
  }

  /** Escape / programmatic dismiss — closes immediately and returns focus. */
  protected _dismiss(): void {
    const trigger = this._anchorEl;
    this._doClose(true);
    // Keep focus on the trigger (dismissible requirement).
    if (trigger && typeof trigger.focus === "function") trigger.focus();
  }

  // ------------------------------------------------------------------
  // Top-layer promotion (native popover when available, else portal)
  // ------------------------------------------------------------------

  private _usePopover = false;

  private _promote(): void {
    const surface = this._surface;
    if (!surface) return;
    if (supportsPopover()) {
      this._usePopover = true;
      if (!surface.hasAttribute("popover")) surface.setAttribute("popover", "manual");
      try {
        (surface as unknown as { showPopover: () => void }).showPopover();
      } catch {
        // Already shown / not connected — ignore.
      }
    } else {
      // No native Popover support: keep the surface inside the shadow root so it
      // retains its shadow-scoped styling (bg/padding/arrow/motion). The surface
      // is already `position: fixed` with `z-index: var(--tulpar-overlay-z-index)`,
      // so it escapes ancestor `overflow:hidden` clipping, uses viewport
      // coordinates (matching the positioner), and stacks above app chrome —
      // no portal out of the shadow root required.
      this._usePopover = false;
    }
  }

  private _demote(): void {
    const surface = this._surface;
    if (!surface) return;
    if (this._usePopover && surface.hasAttribute("popover")) {
      try {
        (surface as unknown as { hidePopover: () => void }).hidePopover();
      } catch {
        // Ignore.
      }
    }
    // Non-popover path: the surface never left the shadow root; visibility is
    // driven purely by the [data-open] attribute, so there is nothing to undo.
  }

  // ------------------------------------------------------------------
  // Positioning
  // ------------------------------------------------------------------

  /** Re-measure rects and apply the computed coordinates to the surface. */
  reposition(): void {
    const anchor = this._anchorEl;
    const surface = this._surface;
    if (!anchor || !surface || !this._isOpen) return;

    const a = anchor.getBoundingClientRect();
    const anchorRect: Rect = { x: a.left, y: a.top, width: a.width, height: a.height };
    const floating = { width: surface.offsetWidth, height: surface.offsetHeight };
    const viewport: Rect = {
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };

    const result = computePosition({
      anchor: anchorRect,
      floating,
      viewport,
      placement: normalizePlacement(this.placement),
      offset: this.offset,
      crossOffset: this.crossOffset,
      containerPadding: this.containerPadding,
      flip: this.flip,
      arrow: this.arrow ? { size: ARROW_SIZE, boundaryOffset: 6 } : null,
    });

    surface.style.left = `${Math.round(result.x)}px`;
    surface.style.top = `${Math.round(result.y)}px`;
    surface.setAttribute("data-placement", `${result.side}-${result.align}`);
    surface.setAttribute("data-side", result.side);

    this._applyArrow(result.side, result.arrow);
    this._applyBridge(result.side);
  }

  private _applyArrow(side: Side, arrow: { x: number; y: number; hidden: boolean } | null): void {
    const el = this._arrowEl;
    if (!el) return;
    if (!arrow || arrow.hidden) {
      el.setAttribute("data-hidden", "");
      return;
    }
    el.removeAttribute("data-hidden");
    const half = ARROW_SIZE / 2;
    // Reset, then place on the edge opposite the surface→anchor direction.
    el.style.top = "";
    el.style.bottom = "";
    el.style.left = "";
    el.style.right = "";
    const vertical = side === "top" || side === "bottom";
    if (vertical) {
      el.style.left = `${arrow.x}px`;
      if (side === "top") el.style.bottom = `${-half}px`;
      else el.style.top = `${-half}px`;
    } else {
      el.style.top = `${arrow.y}px`;
      if (side === "left") el.style.right = `${-half}px`;
      else el.style.left = `${-half}px`;
    }
  }

  /**
   * Position an invisible hover-bridge pad spanning the `offset` gap between the
   * trigger and the surface, so the pointer can travel without crossing dead
   * space (WCAG 1.4.13 hoverable). The pad is a child of the surface, so it
   * extends the surface's pointer region.
   */
  private _applyBridge(side: Side): void {
    const el = this._bridgeEl;
    if (!el) return;
    const gap = Math.max(this.offset, 1);
    el.style.top = "";
    el.style.bottom = "";
    el.style.left = "";
    el.style.right = "";
    el.style.width = "";
    el.style.height = "";
    if (side === "top") {
      el.style.left = "0";
      el.style.right = "0";
      el.style.top = "100%";
      el.style.height = `${gap}px`;
    } else if (side === "bottom") {
      el.style.left = "0";
      el.style.right = "0";
      el.style.bottom = "100%";
      el.style.height = `${gap}px`;
    } else if (side === "left") {
      el.style.top = "0";
      el.style.bottom = "0";
      el.style.left = "100%";
      el.style.width = `${gap}px`;
    } else {
      el.style.top = "0";
      el.style.bottom = "0";
      el.style.right = "100%";
      el.style.width = `${gap}px`;
    }
  }

  // ------------------------------------------------------------------
  // Slot guard
  // ------------------------------------------------------------------

  private _onContentSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const interactive = slot
      .assignedElements({ flatten: true })
      .some((el) =>
        el.matches(
          'a[href], button, input, select, textarea, [tabindex], [contenteditable="true"]',
        ),
      );
    if (interactive) {
      warnDev(
        "[tulpar-tooltip] Tooltips must not contain interactive content (links/buttons/inputs). " +
          "A tooltip is not reachable by pointer or keyboard for activation. Use a popover instead.",
        this,
      );
    }
  };

  override render() {
    return html`
      <div class="surface" role="tooltip" data-placement=${this.placement} part="surface">
        <span class="content">
          ${this.text ?? ""}
          <slot @slotchange=${this._onContentSlotChange}></slot>
        </span>
        ${this.arrow ? html`<span class="arrow" part="arrow" aria-hidden="true"></span>` : ""}
        <span class="bridge" aria-hidden="true"></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-tooltip": TulparTooltip;
  }
}

if (!customElements.get("tulpar-tooltip")) {
  customElements.define("tulpar-tooltip", TulparTooltip);
}
