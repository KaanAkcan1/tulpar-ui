/**
 * Listbox overlay lifecycle controller — the reusable open/close + top-layer +
 * positioning + dismissal machinery for a self-anchored listbox (Select now;
 * Combobox/MultiSelect later). It owns ONLY the generic overlay mechanics; the
 * host element keeps the component-specific bits (active-index seeding, commit,
 * focus policy) and drives this controller via {@link open}/{@link close}/
 * {@link reposition}.
 *
 * Mirrors the popover overlay lifecycle (`tulpar-popover`) with two differences:
 * - The anchor is the host's OWN shadow trigger (no `for`-id / external anchor),
 *   supplied via the `getTrigger` accessor.
 * - The floating surface is the host's OWN shadow listbox (`getListbox`).
 *
 * Composition (shared with the popover family):
 * - positioning math: `_internal/overlay/positioner` (pure, DOM-free).
 * - top-layer + Escape/top-most stack: `_internal/overlay/overlay-root`.
 * - native-Popover capability probe: `_internal/overlay/anchor`.
 *
 * The surface lives in the host's shadow root and, when open, is promoted to the
 * top layer via the native Popover API (when supported) or by reading rects +
 * applying fixed coordinates IN the shadow root (never portaled out — that would
 * strip the shadow-scoped styling). The surface is styled `position: fixed` with
 * `z-index: var(--tulpar-overlay-z-index)` so even the non-popover path escapes
 * ancestor overflow clipping.
 */

import { computePosition, type Rect, type Side } from "../overlay/positioner";
import { pushOverlay, popOverlay } from "../overlay/overlay-root";
import { supportsPopover } from "../overlay/anchor";

/** Host wiring the controller needs: the element + element accessors. */
export interface ListboxOverlayConfig {
  /** The host custom element (used for `updateComplete` + overlay-stack identity). */
  host: HTMLElement & { updateComplete: Promise<unknown> };
  /** Returns the shadow trigger that anchors the listbox (may be null pre-render). */
  getTrigger: () => HTMLElement | null;
  /** Returns the shadow listbox surface to position (may be null pre-render). */
  getListbox: () => HTMLElement | null;
  /** Called when the overlay is dismissed via Escape (top-of-stack). */
  onDismiss: () => void;
  /** Called for a window scroll/resize while open — host decides to close. */
  onScrollOrResize: () => void;
  /** Called for an outside pointerdown (light dismiss) — host decides to close. */
  onOutsidePointerDown: () => void;
}

const PLACEMENT = "bottom-start" as const;
const OFFSET = 6;
const CONTAINER_PADDING = 8;

export class ListboxOverlay {
  private readonly cfg: ListboxOverlayConfig;
  private _open = false;
  private _usePopover = false;
  private _resizeObserver: ResizeObserver | null = null;

  constructor(cfg: ListboxOverlayConfig) {
    this.cfg = cfg;
  }

  get isOpen(): boolean {
    return this._open;
  }

  // ------------------------------------------------------------------
  // Open / close orchestration (host calls these from _doOpen/_doClose)
  // ------------------------------------------------------------------

  /**
   * Wire the overlay open: push onto the Escape stack, attach light-dismiss +
   * scroll/resize listeners, then (after the host's render settles) promote to
   * the top layer, position, and observe for reposition. The host owns setting
   * its own `open` reflected property + active index BEFORE calling this.
   */
  async open(): Promise<void> {
    if (this._open) return;
    this._open = true;
    pushOverlay(this.cfg.host, () => this.cfg.onDismiss());
    document.addEventListener("pointerdown", this._onDocumentPointerDown, true);
    window.addEventListener("scroll", this._onScrollOrResize, true);
    window.addEventListener("resize", this._onScrollOrResize);

    await this.cfg.host.updateComplete;
    if (!this._open) return; // closed again before the surface settled
    this._promote();
    this.reposition();
    this._observeForReposition();
  }

  /**
   * Tear the overlay down: pop the Escape stack, remove listeners, demote from
   * the top layer, disconnect the ResizeObserver. The host owns clearing its own
   * `open` property + returning focus to the trigger.
   */
  close(): void {
    if (!this._open) return;
    this._open = false;
    popOverlay(this.cfg.host);
    document.removeEventListener("pointerdown", this._onDocumentPointerDown, true);
    window.removeEventListener("scroll", this._onScrollOrResize, true);
    window.removeEventListener("resize", this._onScrollOrResize);
    this._demote();
    this._teardownResizeObserver();
  }

  /** Full teardown for the host's `disconnectedCallback` (idempotent). */
  destroy(): void {
    this._open = false;
    popOverlay(this.cfg.host);
    document.removeEventListener("pointerdown", this._onDocumentPointerDown, true);
    window.removeEventListener("scroll", this._onScrollOrResize, true);
    window.removeEventListener("resize", this._onScrollOrResize);
    this._demote();
    this._teardownResizeObserver();
  }

  // ------------------------------------------------------------------
  // Light dismiss + scroll/resize dismissal
  // ------------------------------------------------------------------

  /**
   * Outside-pointerdown light dismiss. The trigger ∪ listbox UNION is the "stay
   * open" set — a pointerdown whose composed path includes EITHER the trigger or
   * the listbox is ignored (so clicking inside the open listbox never closes it).
   */
  private _onDocumentPointerDown = (e: PointerEvent): void => {
    if (!this._open) return;
    const path = e.composedPath();
    const trigger = this.cfg.getTrigger();
    const listbox = this.cfg.getListbox();
    if (trigger && path.includes(trigger)) return;
    if (listbox && path.includes(listbox)) return;
    this.cfg.onOutsidePointerDown();
  };

  private _onScrollOrResize = (): void => {
    if (!this._open) return;
    this.cfg.onScrollOrResize();
  };

  // ------------------------------------------------------------------
  // Top-layer promotion (native popover when available, else in-shadow fixed)
  // ------------------------------------------------------------------

  private _promote(): void {
    const surface = this.cfg.getListbox();
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
      // No native Popover: the surface is already `position: fixed` with
      // `z-index: var(--tulpar-overlay-z-index)`, so it escapes ancestor overflow
      // clipping and stacks above app chrome — no portal required.
      this._usePopover = false;
    }
  }

  private _demote(): void {
    const surface = this.cfg.getListbox();
    if (!surface) return;
    if (this._usePopover && surface.hasAttribute("popover")) {
      try {
        (surface as unknown as { hidePopover: () => void }).hidePopover();
      } catch {
        // Ignore.
      }
    }
  }

  // ------------------------------------------------------------------
  // Async reposition: re-measure when the surface (or its content) resizes.
  // ------------------------------------------------------------------

  private _observeForReposition(): void {
    if (typeof ResizeObserver === "undefined") return;
    this._teardownResizeObserver();
    this._resizeObserver = new ResizeObserver(() => {
      if (this._open) this.reposition();
    });
    const surface = this.cfg.getListbox();
    if (surface) this._resizeObserver.observe(surface);
  }

  private _teardownResizeObserver(): void {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  // ------------------------------------------------------------------
  // Positioning
  // ------------------------------------------------------------------

  /**
   * Resolve the clamping rect the positioner treats as its "viewport" — the
   * nearest scrollable ancestor's clipping rect intersected with the visual
   * viewport (so a listbox inside a scroll pane stays within it), falling back to
   * the full viewport. All rects are read in client coordinates (the same space
   * as `getBoundingClientRect`), so the math stays correct under a transformed
   * ancestor.
   */
  private _resolveBoundaryRect(): Rect {
    const viewport: Rect = {
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
    const sp = this._nearestScrollParent(this.cfg.getTrigger());
    if (!sp) return viewport;
    const clip = sp.getBoundingClientRect();
    const left = Math.max(viewport.x, clip.left);
    const top = Math.max(viewport.y, clip.top);
    const right = Math.min(viewport.x + viewport.width, clip.right);
    const bottom = Math.min(viewport.y + viewport.height, clip.bottom);
    return {
      x: left,
      y: top,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }

  /** Walk ancestors (through shadow boundaries) for the nearest scroll pane. */
  private _nearestScrollParent(start: HTMLElement | null): HTMLElement | null {
    let node: Node | null = start?.parentNode ?? null;
    while (node) {
      if (node instanceof HTMLElement) {
        const style = getComputedStyle(node);
        const oy = style.overflowY;
        const ox = style.overflowX;
        const scrollable = oy === "auto" || oy === "scroll" || ox === "auto" || ox === "scroll";
        if (
          scrollable &&
          (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)
        ) {
          return node;
        }
      }
      if (node instanceof ShadowRoot) {
        node = node.host;
      } else {
        node = node.parentNode;
      }
    }
    return null;
  }

  /**
   * Position the listbox under the trigger. Sets the listbox `min-inline-size` to
   * the trigger width so the panel matches the trigger, applies the computed
   * fixed coordinates, records `data-side` for motion, and applies the
   * containing-block correction nudge (see the popover for the full rationale).
   */
  reposition(): void {
    const anchor = this.cfg.getTrigger();
    const surface = this.cfg.getListbox();
    if (!anchor || !surface || !this._open) return;

    // Match the trigger width before measuring the floating size.
    surface.style.minInlineSize = `${anchor.offsetWidth}px`;

    const a = anchor.getBoundingClientRect();
    const anchorRect: Rect = { x: a.left, y: a.top, width: a.width, height: a.height };
    const floating = { width: surface.offsetWidth, height: surface.offsetHeight };
    const viewport = this._resolveBoundaryRect();

    const result = computePosition({
      anchor: anchorRect,
      floating,
      viewport,
      placement: PLACEMENT,
      offset: OFFSET,
      crossOffset: 0,
      containerPadding: CONTAINER_PADDING,
      flip: true,
      arrow: null,
    });

    const targetX = Math.round(result.x);
    const targetY = Math.round(result.y);
    surface.style.left = `${targetX}px`;
    surface.style.top = `${targetY}px`;
    surface.setAttribute("data-side", result.side);

    // Containing-block correction. `position: fixed` resolves against the viewport
    // UNLESS an ancestor establishes a containing block (any element with a
    // `transform`, `filter`, `perspective`, `contain`, etc.). The native top layer
    // does not change this. We measure the actual rendered position and nudge by
    // the delta so the surface lands at the intended viewport coordinates
    // regardless of any transformed ancestor.
    const actual = surface.getBoundingClientRect();
    const dx = targetX - actual.left;
    const dy = targetY - actual.top;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      surface.style.left = `${targetX + dx}px`;
      surface.style.top = `${targetY + dy}px`;
    }
  }
}

export type { Side };
