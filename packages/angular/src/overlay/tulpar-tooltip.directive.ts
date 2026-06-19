import { Directive, effect, input } from "@angular/core";
import type { OnDestroy, OnInit } from "@angular/core";

import "@tulpar-ui/core/tooltip";
import type { TooltipPlacement } from "@tulpar-ui/core/tooltip";

import { OverlayDirectiveBase } from "./overlay-directive-base";

export type { TooltipPlacement };

/**
 * `tulparTooltip` — inline tooltip directive.
 *
 * Attaches a `<tulpar-tooltip>` to ANY host element (button/icon/div) WITHOUT
 * wrapping it. The directive:
 *
 * 1. ensures the host has an `id` (mints `tulpar-trg-N` only if absent — a
 *    consumer-set id is preserved),
 * 2. creates a `<tulpar-tooltip>` element, sets its `for` = host id, `text` from
 *    the directive value, and config from the companion inputs,
 * 3. appends the element to the host's parent (so it lives in the light DOM where
 *    its `for` id resolves to the host), keeping it in sync as inputs change,
 * 4. removes the created element on destroy.
 *
 * Note: tooltips have no `tone` (the inverted chip is fixed). `openChange` emits
 * on the element's `tulpar-open` / `tulpar-close`.
 *
 * Signals only — no RxJS.
 */
@Directive({
  selector: "[tulparTooltip]",
  standalone: true,
})
export class TulparTooltipDirective extends OverlayDirectiveBase implements OnInit, OnDestroy {
  /** Tooltip text (the directive value: `tulparTooltip="Save changes"`). */
  readonly text = input<string | undefined>(undefined, { alias: "tulparTooltip" });

  readonly placement = input<TooltipPlacement | undefined>(undefined, {
    alias: "tooltipPlacement",
  });
  readonly arrow = input<boolean | undefined>(undefined, { alias: "tooltipArrow" });
  readonly offset = input<number | undefined>(undefined, { alias: "tooltipOffset" });

  constructor() {
    super();
    // Keep the element's props in sync as inputs change (post-creation).
    effect(() => {
      const el = this.overlayEl;
      if (!el) return;
      el.text = this.text() ?? "";
      this.setOverlayAttr("placement", this.placement());
      // `arrow` defaults true on the element; only set when explicitly toggled.
      const arrow = this.arrow();
      if (arrow !== undefined) this.setOverlayAttr("arrow", arrow);
      const offset = this.offset();
      if (offset !== undefined) this.setOverlayAttr("offset", offset);
    });
  }

  ngOnInit(): void {
    const id = this.ensureHostId();
    const el = this.doc.createElement("tulpar-tooltip") as HTMLElement & {
      for?: string;
      text?: string;
    };
    el.setAttribute("for", id);
    el.text = this.text() ?? "";
    // Append next to the host so the `for` id resolves within the same document.
    const host = this.hostRef.nativeElement;
    (host.parentNode ?? this.doc.body).appendChild(el);
    this.bridgeEvents(el);
  }

  ngOnDestroy(): void {
    this.teardownBridge();
    this.overlayEl?.remove();
    this.overlayEl = null;
  }
}

/**
 * `tulparTooltipRef` — reference form of the tooltip directive.
 *
 * The host references an already-declared `<tulpar-tooltip id="declaredId">…</tulpar-tooltip>`
 * by id. On init the directive ensures the host has an id and sets the declared
 * element's `for` to the host id (anchoring + wiring this host).
 *
 * Single-active-trigger: the declared element's `for` is last-wins. True
 * many-triggers-one-overlay simultaneous sharing is out of scope for v0.11. The
 * directive does NOT create or destroy the declared element — the consumer owns
 * its lifecycle.
 */
@Directive({
  selector: "[tulparTooltipRef]",
  standalone: true,
})
export class TulparTooltipRefDirective extends OverlayDirectiveBase implements OnInit, OnDestroy {
  /** Id of the declared `<tulpar-tooltip>` to anchor to this host. */
  readonly ref = input.required<string>({ alias: "tulparTooltipRef" });

  ngOnInit(): void {
    const id = this.ensureHostId();
    const declared = this.doc.getElementById(this.ref()) as
      | (HTMLElement & { for?: string; open?: boolean })
      | null;
    if (!declared) return;
    declared.setAttribute("for", id);
    this.bridgeEvents(declared);
  }

  ngOnDestroy(): void {
    this.teardownBridge();
    this.overlayEl = null;
  }
}
