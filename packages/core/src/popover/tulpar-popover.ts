import { LitElement, html } from "lit";
import { property, query } from "lit/decorators.js";
import { popoverStyles } from "./tulpar-popover.styles";
import {
  resolveAnchor,
  warnIfBadTrigger,
  warnIfUnresolvedFor,
  supportsPopover,
} from "../_internal/overlay/anchor";
import { setHasPopup, clearHasPopup } from "../_internal/overlay/aria";
import { pushOverlay, popOverlay } from "../_internal/overlay/overlay-root";
import {
  computePosition,
  type Placement,
  type Side,
  type Rect,
} from "../_internal/overlay/positioner";

/**
 * Boundary the popover keeps itself within. `viewport` clamps to the visual
 * viewport; `scroll-parent` clamps to the nearest scrollable ancestor's
 * clipping rect (intersected with the viewport), so a popover inside a scroll
 * pane stays inside that pane; an element id resolves to that element's rect.
 *
 * Authored as a plain `string` so an arbitrary element id is accepted while the
 * two well-known keywords (`"viewport"`, `"scroll-parent"`) are documented here.
 */
export type PopoverBoundary = string;

/** Author-facing placement: full `side-align` grammar plus bare sides + `auto`. */
export type PopoverPlacement = Placement | Side;

/** Semantic intent of the popover surface. */
export type PopoverTone = "neutral" | "info" | "success" | "warning" | "danger";

const BARE_SIDES = new Set<string>(["top", "bottom", "left", "right"]);

/** Expand a bare side (`"top"`) to its centered placement (`"top-center"`). */
function normalizePlacement(p: PopoverPlacement): Placement {
  if (p === "auto") return "auto";
  if (BARE_SIDES.has(p)) return `${p as Side}-center`;
  return p as Placement;
}

const ARROW_SIZE = 12;

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(",");

/**
 * `<tulpar-popover>` — an accessible, collision-aware, NON-MODAL dialog surface.
 *
 * The popover is the richest member of the overlay family: a click-triggered,
 * interactive card (`role="dialog"`) that hosts forms, menus or controls. It is
 * deliberately NON-MODAL — there is NO focus trap, NO scroll-lock, and NO
 * `inert` on the background. (A modal dialog is a future `<tulpar-dialog>`.)
 * Focus MOVES into the surface on open (first focusable, else the surface
 * container) but Tab then flows naturally OUT; `Escape` closes and returns focus
 * to the trigger; an outside pointerdown light-dismisses.
 *
 * Trigger binding is by id (matching the tooltip/toggletip): the popover
 * references an EXTERNAL trigger via the `for` attribute
 * (`<tulpar-popover for="acctBtn">`) and self-wires click listeners +
 * `aria-haspopup="dialog"`/`aria-expanded` onto it. The popover never wraps its
 * trigger. Its rich content is the popover's OWN children (default slot).
 *
 * Composition mirrors the toggletip:
 * - positioning math: `_internal/overlay/positioner` (pure, DOM-free).
 * - anchor resolution + capability probes: `_internal/overlay/anchor`.
 * - top-layer + Escape/top-most stack: `_internal/overlay/overlay-root`.
 *
 * The host is `display:contents`. The surface is rendered in the shadow root
 * and, when opened, promoted to the top layer via the native Popover API (when
 * supported) or by reading rects + applying fixed coordinates IN the shadow
 * root (never portaled out — that would strip the shadow-scoped styling).
 */
export class TulparPopover extends LitElement {
  static override styles = popoverStyles;

  // --- Positioning ---
  @property({ type: String, reflect: true })
  placement: PopoverPlacement = "bottom-start";

  @property({ type: Number })
  offset = 8;

  @property({ type: Number, attribute: "cross-offset" })
  crossOffset = 0;

  @property({ type: Number, attribute: "container-padding" })
  containerPadding = 12;

  @property({ type: String, reflect: true })
  boundary: PopoverBoundary = "viewport";

  @property({ type: Boolean })
  flip = true;

  @property({ type: Boolean })
  arrow = false;

  // --- Content / state ---
  @property({ type: String, reflect: true })
  tone: PopoverTone = "neutral";

  /** Accessible name for the dialog surface (wins over a slotted heading). */
  @property({ type: String })
  label?: string;

  @property({ type: Boolean, reflect: true })
  open?: boolean;

  @property({ type: Boolean, attribute: "default-open" })
  defaultOpen?: boolean;

  /**
   * Id of the EXTERNAL trigger element this popover is disclosed from. Resolved
   * against the host's `ownerDocument`; the popover wires click listeners +
   * `aria-haspopup="dialog"`/`aria-expanded` onto the resolved element. Reflected
   * so the attribute and property stay in sync.
   */
  @property({ type: String, reflect: true })
  for?: string;

  /**
   * Internal open flag, mirrored to `[data-open]` on the surface. Deliberately
   * NOT a reactive `@state`: visibility is driven imperatively via the
   * `[data-open]` attribute, not via `render()`.
   */
  protected _isOpen = false;

  @query(".surface")
  protected _surface!: HTMLElement;

  @query(".body")
  protected _body!: HTMLElement | null;

  @query(".arrow")
  protected _arrowEl!: HTMLElement | null;

  /** The currently-resolved anchor element (trigger), if any. */
  protected _anchorEl: HTMLElement | null = null;

  /** Test-only accessor for the resolved trigger element. */
  get _anchorElForTest(): HTMLElement | null {
    return this._anchorEl;
  }

  /**
   * Set while an internal open/close transition writes back to the reflected
   * `open` property, so the resulting `updated()` re-entry is ignored.
   */
  private _internalOpenChange = false;

  /** Observes surface/content size while open so the card re-anchors on growth. */
  private _resizeObserver: ResizeObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    void this.updateComplete.then(() => {
      this._wireTrigger();
      if (this.defaultOpen || this.open) this._doOpen();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    popOverlay(this);
    document.removeEventListener("pointerdown", this._onDocumentPointerDown, true);
    this._teardownResizeObserver();
    this._detachTriggerListeners();
    if (this._anchorEl) clearHasPopup(this._anchorEl);
  }

  override firstUpdated(): void {
    this._wireTrigger();
  }

  override updated(changed: Map<string, unknown>): void {
    // Re-wire when the trigger reference changes (detach the old trigger's
    // listeners/aria first; `_wireTrigger` handles that via the diff).
    if (changed.has("for")) this._wireTrigger();
    if (changed.has("open") && !this._internalOpenChange) {
      if (this.open && !this._isOpen) this._doOpen();
      else if (this.open === false && this._isOpen) this._doClose();
    }
    if (changed.has("placement") && this._isOpen) this.reposition();
  }

  // ------------------------------------------------------------------
  // Imperative API
  // ------------------------------------------------------------------

  show(): void {
    this._doOpen();
  }

  hide(): void {
    this._doClose();
  }

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
      // Dev-warn the unresolved-`for` case even when nothing changed (e.g. the
      // trigger simply never existed) so a typo'd id is still surfaced once.
      if (!this._anchorEl) warnIfUnresolvedFor(this, next);
      return;
    }
    this._detachTriggerListeners();
    if (this._anchorEl) clearHasPopup(this._anchorEl);
    this._anchorEl = next;
    if (next) {
      warnIfBadTrigger(next);
      this._attachTriggerListeners(next);
      // A popover is a dialog surface (interactive content disclosed on click).
      setHasPopup(next, "dialog");
      next.setAttribute("aria-expanded", this._isOpen ? "true" : "false");
    } else {
      warnIfUnresolvedFor(this, next);
    }
  };

  private _attachTriggerListeners(el: HTMLElement): void {
    el.addEventListener("click", this._onTriggerClick);
    el.addEventListener("keydown", this._onTriggerKeydown);
  }

  private _detachTriggerListeners(): void {
    const el = this._anchorEl;
    if (!el) return;
    el.removeEventListener("click", this._onTriggerClick);
    el.removeEventListener("keydown", this._onTriggerKeydown);
  }

  /**
   * Native buttons synthesize a `click` for mouse AND Enter/Space, so the single
   * `click` path covers all activation with no double-toggle bookkeeping (same
   * rationale as the toggletip).
   */
  private _onTriggerClick = (): void => {
    this.toggle();
  };

  /** Only suppress Space's page-scroll while the trigger is focused. */
  private _onTriggerKeydown = (e: KeyboardEvent): void => {
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
    }
  };

  private _syncExpanded(): void {
    this._anchorEl?.setAttribute("aria-expanded", this._isOpen ? "true" : "false");
  }

  // ------------------------------------------------------------------
  // Outside click (light dismiss)
  // ------------------------------------------------------------------

  private _onDocumentPointerDown = (e: PointerEvent): void => {
    if (!this._isOpen) return;
    const path = e.composedPath();
    if (this._anchorEl && path.includes(this._anchorEl)) return;
    if (this._surface && path.includes(this._surface)) return;
    this._doClose();
  };

  // ------------------------------------------------------------------
  // Open / close
  // ------------------------------------------------------------------

  protected _doOpen(): void {
    if (this._isOpen) return;
    if (!this._anchorEl) this._wireTrigger();
    if (!this._anchorEl) return;
    this._isOpen = true;
    if (this.open !== true) {
      this._internalOpenChange = true;
      this.open = true;
      void this.updateComplete.then(() => {
        this._internalOpenChange = false;
      });
    }
    this._syncExpanded();
    // Each popover Escape-dismisses only when it is the TOP-most overlay (the
    // overlay-root stack manager guarantees ordering), so nested overlays
    // (e.g. a tooltip inside this popover) close before the popover does.
    pushOverlay(this, () => this._dismiss());
    document.addEventListener("pointerdown", this._onDocumentPointerDown, true);

    if (this._exitCleanup) this._exitCleanup = null;

    this._surface?.setAttribute("data-open", "");
    this._surface?.removeAttribute("data-exiting");
    this._applyLabelling();

    const finishOpen = (): void => {
      if (!this._isOpen) return;
      this._promote();
      this.reposition();
      this._observeForReposition();
      this._focusInitial();
    };
    if (this._surface) finishOpen();
    else void this.updateComplete.then(finishOpen);
    this._emit("tulpar-open");
    this._emit("tulpar-toggle");
  }

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
    this._syncExpanded();
    popOverlay(this);
    document.removeEventListener("pointerdown", this._onDocumentPointerDown, true);
    this._teardownResizeObserver();

    const surface = this._surface;
    if (this._exitCleanup) {
      this._exitCleanup();
      this._exitCleanup = null;
    }
    surface?.removeAttribute("data-open");

    const finalize = (): void => {
      surface?.removeAttribute("data-exiting");
      this._demote();
    };

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
    if (trigger && typeof trigger.focus === "function") trigger.focus();
  }

  // ------------------------------------------------------------------
  // Non-modal focus model (focus moves in; Tab flows out; no trap)
  // ------------------------------------------------------------------

  /**
   * Move focus into the surface on open: the first focusable element in the
   * content slot, else the surface container itself (made programmatically
   * focusable via `tabindex="-1"`). Deliberately NO focus trap — Tab then leaves
   * the popover naturally (this is a non-modal dialog).
   */
  private _focusInitial(): void {
    const target = this._firstFocusableInContent();
    if (target) {
      target.focus();
      return;
    }
    const surface = this._surface;
    if (!surface) return;
    if (!surface.hasAttribute("tabindex")) surface.setAttribute("tabindex", "-1");
    surface.focus();
  }

  /** First focusable element among the default-slot (light-DOM) content nodes. */
  private _firstFocusableInContent(): HTMLElement | null {
    const roots = this._contentRoots();
    for (const root of roots) {
      if (root.matches(FOCUSABLE_SELECTOR)) return root;
      const inner = root.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      if (inner) return inner;
    }
    return null;
  }

  /**
   * The popover's default-slot content children. In the for-id model the trigger
   * is external, so every child of the host is rich content (no `slot` attribute,
   * tolerating a stray legacy `slot="content"`).
   */
  private _contentRoots(): HTMLElement[] {
    return Array.from(this.children).filter((c) => {
      const slot = c.getAttribute("slot");
      return slot === null || slot === "" || slot === "content";
    }) as HTMLElement[];
  }

  // ------------------------------------------------------------------
  // ARIA labelling (aria-label wins, else a slotted heading via labelledby)
  // ------------------------------------------------------------------

  private _applyLabelling(): void {
    const surface = this._surface;
    if (!surface) return;
    if (this.label) {
      surface.setAttribute("aria-label", this.label);
      surface.removeAttribute("aria-labelledby");
      return;
    }
    surface.removeAttribute("aria-label");
    const heading = this._slottedHeading();
    if (heading) {
      if (!heading.id) heading.id = `tulpar-popover-label-${++labelSeq}`;
      surface.setAttribute("aria-labelledby", heading.id);
    } else {
      surface.removeAttribute("aria-labelledby");
    }
  }

  /** A content heading (an `h1`–`h6` or `[role=heading]`) among the children. */
  private _slottedHeading(): HTMLElement | null {
    const roots = this._contentRoots();
    const HEADING = "h1,h2,h3,h4,h5,h6,[role=\"heading\"]";
    for (const root of roots) {
      if (root.matches(HEADING)) return root;
      const inner = root.querySelector<HTMLElement>(HEADING);
      if (inner) return inner;
    }
    return null;
  }

  // ------------------------------------------------------------------
  // Top-layer promotion (native popover when available, else in-shadow fixed)
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
      // No native Popover: keep the surface inside the shadow root so it retains
      // shadow-scoped styling. It is already `position: fixed` with
      // `z-index: var(--tulpar-overlay-z-index)`, so it escapes ancestor
      // overflow clipping and stacks above app chrome — no portal required.
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
  }

  // ------------------------------------------------------------------
  // Async reposition: re-measure when the surface (or its content) resizes.
  // ------------------------------------------------------------------

  private _observeForReposition(): void {
    if (typeof ResizeObserver === "undefined") return;
    this._teardownResizeObserver();
    this._resizeObserver = new ResizeObserver(() => {
      if (this._isOpen) this.reposition();
    });
    if (this._surface) this._resizeObserver.observe(this._surface);
    if (this._body) this._resizeObserver.observe(this._body);
  }

  private _teardownResizeObserver(): void {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  /** Re-measure on slotted content changes (e.g. async-loaded body). */
  private _onContentSlotChange = (): void => {
    if (this._isOpen) this.reposition();
  };

  // ------------------------------------------------------------------
  // Positioning
  // ------------------------------------------------------------------

  /**
   * Resolve the clamping rect the positioner treats as its "viewport". For
   * `viewport` it is the visual viewport; for `scroll-parent` it is the nearest
   * scrollable ancestor's content rect intersected with the viewport; for an
   * element id it is that element's rect intersected with the viewport.
   *
   * All rects are read in viewport (client) coordinates — the same space as the
   * anchor's `getBoundingClientRect()` — so the math stays correct even when an
   * ancestor has a CSS `transform` (which establishes a containing block but
   * does NOT shift `getBoundingClientRect`, which is always viewport-relative).
   */
  private _resolveBoundaryRect(): Rect {
    const viewport: Rect = {
      x: 0,
      y: 0,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
    let clip: DOMRect | null = null;
    if (this.boundary === "scroll-parent") {
      const sp = this._nearestScrollParent(this._anchorEl);
      if (sp) clip = sp.getBoundingClientRect();
    } else if (this.boundary && this.boundary !== "viewport") {
      const el = document.getElementById(this.boundary);
      if (el) clip = el.getBoundingClientRect();
    }
    if (!clip) return viewport;
    // Intersect the clip rect with the viewport (in client coords).
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

  reposition(): void {
    const anchor = this._anchorEl;
    const surface = this._surface;
    if (!anchor || !surface || !this._isOpen) return;

    const a = anchor.getBoundingClientRect();
    const anchorRect: Rect = { x: a.left, y: a.top, width: a.width, height: a.height };
    const floating = { width: surface.offsetWidth, height: surface.offsetHeight };
    const viewport = this._resolveBoundaryRect();

    const result = computePosition({
      anchor: anchorRect,
      floating,
      viewport,
      placement: normalizePlacement(this.placement),
      offset: this.offset,
      crossOffset: this.crossOffset,
      containerPadding: this.containerPadding,
      flip: this.flip,
      arrow: this.arrow ? { size: ARROW_SIZE, boundaryOffset: 8 } : null,
    });

    const targetX = Math.round(result.x);
    const targetY = Math.round(result.y);
    surface.style.left = `${targetX}px`;
    surface.style.top = `${targetY}px`;
    surface.setAttribute("data-placement", `${result.side}-${result.align}`);
    surface.setAttribute("data-side", result.side);

    // Containing-block correction. `position: fixed` resolves against the
    // viewport UNLESS an ancestor establishes a containing block (any element
    // with a `transform`, `filter`, `perspective`, `contain`, etc.). The native
    // top layer does not change this. So under a transformed ancestor our
    // viewport-space coordinates land at the wrong place. We measure the actual
    // rendered position and nudge by the delta so the surface lands exactly at
    // the intended viewport coordinates regardless of any transformed ancestor.
    const actual = surface.getBoundingClientRect();
    const dx = targetX - actual.left;
    const dy = targetY - actual.top;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      surface.style.left = `${targetX + dx}px`;
      surface.style.top = `${targetY + dy}px`;
    }

    this._applyArrow(result.side, result.arrow);
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

  override render() {
    return html`
      <div class="surface" role="dialog" data-placement=${this.placement} part="surface">
        <div class="body" part="body">
          <slot @slotchange=${this._onContentSlotChange}></slot>
        </div>
        ${this.arrow ? html`<span class="arrow" part="arrow" aria-hidden="true"></span>` : ""}
      </div>
    `;
  }
}

let labelSeq = 0;

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-popover": TulparPopover;
  }
}

if (!customElements.get("tulpar-popover")) {
  customElements.define("tulpar-popover", TulparPopover);
}
