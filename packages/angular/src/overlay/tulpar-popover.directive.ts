import { Directive, effect, input } from "@angular/core";
import type { OnDestroy, OnInit } from "@angular/core";

import "@tulpar-ui/core/popover";
import type { PopoverPlacement, PopoverTone } from "@tulpar-ui/core/popover";

import { OverlayDirectiveBase } from "./overlay-directive-base";

export type { PopoverPlacement, PopoverTone };

/**
 * `tulparPopover` — inline popover directive (the trivial text case).
 *
 * Attaches a click-triggered `<tulpar-popover>` to ANY host element WITHOUT
 * wrapping it, populating it from a plain `text` value. For RICH popover content
 * (forms/menus/headings) declare a `<tulpar-popover id="…">…</tulpar-popover>`
 * and use {@link TulparPopoverRefDirective} (`tulparPopoverRef`) instead.
 *
 * Mechanics match the tooltip/toggletip inline directives (id-mint → create →
 * append → sync → destroy). `openChange` emits on `tulpar-open` / `tulpar-close`.
 * Signals only — no RxJS.
 */
@Directive({
  selector: "[tulparPopover]",
  standalone: true,
})
export class TulparPopoverDirective extends OverlayDirectiveBase implements OnInit, OnDestroy {
  /** Popover text (the directive value: `tulparPopover="Quick note"`). */
  readonly text = input<string | undefined>(undefined, { alias: "tulparPopover" });

  readonly placement = input<PopoverPlacement | undefined>(undefined, {
    alias: "popoverPlacement",
  });
  readonly tone = input<PopoverTone | undefined>(undefined, { alias: "popoverTone" });
  readonly arrow = input<boolean | undefined>(undefined, { alias: "popoverArrow" });
  readonly offset = input<number | undefined>(undefined, { alias: "popoverOffset" });

  constructor() {
    super();
    effect(() => {
      const el = this.overlayEl;
      if (!el) return;
      el.text = this.text() ?? "";
      this.setOverlayAttr("placement", this.placement());
      this.setOverlayAttr("tone", this.tone());
      const arrow = this.arrow();
      if (arrow !== undefined) this.setOverlayAttr("arrow", arrow);
      const offset = this.offset();
      if (offset !== undefined) this.setOverlayAttr("offset", offset);
    });
  }

  ngOnInit(): void {
    const id = this.ensureHostId();
    const el = this.doc.createElement("tulpar-popover") as HTMLElement & {
      for?: string;
      text?: string;
    };
    el.setAttribute("for", id);
    // The popover surface renders default-slot content; a plain text case is set
    // as its text content so the inline form stays trivial.
    el.textContent = this.text() ?? "";
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
 * `tulparPopoverRef` — reference form of the popover directive (the RICH case).
 *
 * The host references an already-declared
 * `<tulpar-popover id="declaredId">…rich content…</tulpar-popover>` by id. On
 * init it ensures the host has an id and sets the declared element's `for` to the
 * host id (anchoring + wiring this host as the trigger).
 *
 * Single-active-trigger: the declared element's `for` is last-wins. True
 * many-triggers-one-overlay simultaneous sharing is out of scope for v0.11. The
 * directive does NOT create or destroy the declared element — the consumer owns
 * its lifecycle and its content.
 */
@Directive({
  selector: "[tulparPopoverRef]",
  standalone: true,
})
export class TulparPopoverRefDirective extends OverlayDirectiveBase implements OnInit, OnDestroy {
  /** Id of the declared `<tulpar-popover>` to anchor to this host. */
  readonly ref = input.required<string>({ alias: "tulparPopoverRef" });

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
