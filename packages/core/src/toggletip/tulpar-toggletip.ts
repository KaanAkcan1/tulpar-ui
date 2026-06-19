import { LitElement, html } from "lit";
import { property, query } from "lit/decorators.js";
import { toggletipStyles } from "./tulpar-toggletip.styles";
import {
  resolveAnchor,
  warnIfBadTrigger,
  warnIfUnresolvedFor,
  supportsPopover,
} from "../_internal/overlay/anchor";
import { setHasPopup, clearHasPopup, makeLiveRegion } from "../_internal/overlay/aria";
import {
  pushOverlay,
  popOverlay,
  topOverlay,
} from "../_internal/overlay/overlay-root";
import {
  computePosition,
  type Placement,
  type Side,
  type Rect,
} from "../_internal/overlay/positioner";

export type ToggletipBoundary = "viewport";

/** Author-facing placement: full `side-align` grammar plus bare sides + `auto`. */
export type ToggletipPlacement = Placement | Side;

/** Semantic intent of the toggletip surface. */
export type ToggletipTone = "neutral" | "info" | "success" | "warning" | "danger";

const BARE_SIDES = new Set<string>(["top", "bottom", "left", "right"]);

/** Expand a bare side (`"top"`) to its centered placement (`"top-center"`). */
function normalizePlacement(p: ToggletipPlacement): Placement {
  if (p === "auto") return "auto";
  if (BARE_SIDES.has(p)) return `${p as Side}-center`;
  return p as Placement;
}

const ARROW_SIZE = 11;

/**
 * `<tulpar-toggletip>` — an accessible, collision-aware disclosure bubble.
 *
 * Unlike a tooltip (hover, inverted chip, `role="tooltip"` description), a
 * toggletip is CLICK-triggered: a button trigger toggles a brief, NON-interactive
 * bubble rendered on the neutral overlay surface. Because the content appears in
 * response to an explicit action, it is announced via a pre-inserted
 * `aria-live="polite"` region (the region exists in the DOM before injection so
 * SRs announce the change) rather than `aria-describedby`. Focus never moves into
 * the bubble; Escape returns focus to the trigger; outside-click light-dismisses.
 *
 * Trigger binding is by id (matching the tooltip): the toggletip references an
 * EXTERNAL trigger via the `for` attribute (`<tulpar-toggletip for="moreBtn">`)
 * and self-wires click listeners + `aria-haspopup`/`aria-expanded` onto it. The
 * toggletip never wraps its trigger. Its content is the toggletip's OWN children
 * (default slot) or the `text` prop.
 *
 * Composition mirrors the tooltip:
 * - positioning math: `_internal/overlay/positioner` (pure, DOM-free).
 * - anchor resolution + capability probes: `_internal/overlay/anchor`.
 * - top-layer + Escape/topmost stack: `_internal/overlay/overlay-root`.
 *
 * The host is `display:contents`. The surface is rendered in the shadow root and,
 * when opened, promoted to the top layer via the native Popover API (when
 * supported) or by reading rects + applying fixed coordinates IN the shadow root
 * (never portaled out — that would strip the shadow-scoped styling).
 */
export class TulparToggletip extends LitElement {
  static override styles = toggletipStyles;

  // --- Positioning ---
  @property({ type: String, reflect: true })
  placement: ToggletipPlacement = "top";

  @property({ type: Number })
  offset = 8;

  @property({ type: Number, attribute: "cross-offset" })
  crossOffset = 0;

  @property({ type: Number, attribute: "container-padding" })
  containerPadding = 12;

  @property({ type: String, reflect: true })
  boundary: ToggletipBoundary = "viewport";

  @property({ type: Boolean })
  flip = true;

  @property({ type: Boolean })
  arrow = true;

  // --- Content / state ---
  @property({ type: String, reflect: true })
  tone: ToggletipTone = "neutral";

  @property({ type: String })
  text?: string;

  @property({ type: Boolean, reflect: true })
  open?: boolean;

  @property({ type: Boolean, attribute: "default-open" })
  defaultOpen?: boolean;

  /**
   * Id of the EXTERNAL trigger element this toggletip is disclosed from. Resolved
   * against the host's `ownerDocument`; the toggletip wires click listeners +
   * `aria-haspopup`/`aria-expanded` onto the resolved element. Reflected so the
   * attribute and property stay in sync.
   */
  @property({ type: String, reflect: true })
  for?: string;

  /**
   * Internal open flag, mirrored to `[data-open]` on the surface. Deliberately
   * NOT a reactive `@state`: visibility is driven imperatively via the
   * `[data-open]` attribute, not via `render()`. Keeping it a plain field means
   * toggling it from inside `updated()` (the controlled-`open` path) never
   * schedules a re-entrant Lit update.
   */
  protected _isOpen = false;

  @query(".surface")
  protected _surface!: HTMLElement;

  @query(".arrow")
  protected _arrowEl!: HTMLElement | null;

  @query(".live")
  protected _liveSlotHost!: HTMLElement | null;

  /** The pre-inserted polite live region (announces content on open). */
  private _live: HTMLElement | null = null;

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

  override connectedCallback(): void {
    super.connectedCallback();
    void this.updateComplete.then(() => {
      this._ensureLiveRegion();
      this._wireTrigger();
      if (this.defaultOpen || this.open) this._doOpen();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    popOverlay(this);
    document.removeEventListener("pointerdown", this._onDocumentPointerDown, true);
    this._detachTriggerListeners();
    if (this._anchorEl) clearHasPopup(this._anchorEl);
  }

  override firstUpdated(): void {
    this._ensureLiveRegion();
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

  /**
   * Insert the polite live region into the shadow root once (before any open),
   * so assistive tech registers it and announces later text injection. It sits
   * next to the surface and is visually hidden via inline styles.
   */
  private _ensureLiveRegion(): void {
    if (this._live && this._live.isConnected) return;
    const host = this._liveSlotHost ?? this.shadowRoot;
    if (!host) return;
    this._live = makeLiveRegion();
    this._live.classList.add("live-region");
    host.appendChild(this._live);
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
      // Disclosure semantics: a toggletip reveals additional info on activation.
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
   * The trigger is a real focusable button (per spec), and native buttons
   * already synthesize a `click` for Enter and Space activation. So we toggle
   * purely on `click` — that single path covers mouse AND keyboard activation
   * with no double-toggle bookkeeping. (The previous keydown-driven toggle plus
   * an unbounded swallow-next-click flag wedged the control: calling
   * `preventDefault()` on a native button's activation keydown CANCELS the
   * synthesized click in Chromium, so the flag was never consumed and stranded
   * at `true`, then wrongly swallowed the next genuine mouse click.)
   */
  private _onTriggerClick = (): void => {
    this.toggle();
  };

  /**
   * Keyboard handling is intentionally minimal: only suppress Space's default
   * page scroll while the trigger is focused. We do NOT toggle here (the native
   * click does that) and we do NOT preventDefault Enter (which must flow through
   * to the synthesized click).
   */
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
    // A press on the trigger or inside the surface is not "outside".
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
    // Single-open among transient overlays: opening one closes the topmost.
    const current = topOverlay();
    if (current && current !== this && current instanceof TulparToggletip) {
      current._doClose();
    }
    this._isOpen = true;
    if (this.open !== true) {
      this._internalOpenChange = true;
      this.open = true;
      void this.updateComplete.then(() => {
        this._internalOpenChange = false;
      });
    }
    this._syncExpanded();
    pushOverlay(this, () => this._dismiss());
    document.addEventListener("pointerdown", this._onDocumentPointerDown, true);

    if (this._exitCleanup) this._exitCleanup = null;

    this._surface?.setAttribute("data-open", "");
    this._surface?.removeAttribute("data-exiting");

    // Announce the content via the live region (assistive tech reads the change).
    this._ensureLiveRegion();
    if (this._live) this._live.textContent = this._announceText();

    const finishOpen = (): void => {
      if (!this._isOpen) return;
      this._promote();
      this.reposition();
    };
    if (this._surface) finishOpen();
    else void this.updateComplete.then(finishOpen);
    this._emit("tulpar-open");
    this._emit("tulpar-toggle");
  }

  /** Resolve the text to announce: the `text` prop, else the default-slot content. */
  private _announceText(): string {
    if (this.text) return this.text;
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>("slot:not([name])");
    const nodes = slot?.assignedNodes({ flatten: true }) ?? [];
    return nodes
      .map((n) => n.textContent ?? "")
      .join(" ")
      .trim();
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

    // Clear the live region so a re-open re-announces (same text otherwise would
    // not register as a change).
    if (this._live) this._live.textContent = "";

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
  // Positioning
  // ------------------------------------------------------------------

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
  }

  private _applyArrow(
    side: Side,
    arrow: { x: number; y: number; hidden: boolean } | null,
  ): void {
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
      <div class="surface" data-placement=${this.placement} part="surface">
        <div class="body">
          <span class="icon" part="icon">
            <slot name="icon" @slotchange=${this._onIconSlotChange}></slot>
          </span>
          <span class="content">
            ${this.text ?? ""}
            <slot></slot>
          </span>
        </div>
        ${this.arrow ? html`<span class="arrow" part="arrow" aria-hidden="true"></span>` : ""}
      </div>
      <div class="live"></div>
    `;
  }

  /** Toggle the icon wrapper's filled state so it collapses when empty. */
  private _onIconSlotChange = (e: Event): void => {
    const slot = e.target as HTMLSlotElement;
    const filled = slot.assignedNodes({ flatten: true }).some((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return true;
      return (n.textContent ?? "").trim().length > 0;
    });
    const wrap = slot.parentElement;
    wrap?.classList.toggle("icon--filled", filled);
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "tulpar-toggletip": TulparToggletip;
  }
}

if (!customElements.get("tulpar-toggletip")) {
  customElements.define("tulpar-toggletip", TulparToggletip);
}
