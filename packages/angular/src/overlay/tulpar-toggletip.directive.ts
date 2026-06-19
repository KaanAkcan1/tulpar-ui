import { Directive, effect, input } from "@angular/core";
import type { OnDestroy, OnInit } from "@angular/core";

import "@tulpar-ui/core/toggletip";
import type { ToggletipPlacement, ToggletipTone } from "@tulpar-ui/core/toggletip";

import { OverlayDirectiveBase } from "./overlay-directive-base";

export type { ToggletipPlacement, ToggletipTone };

/**
 * `tulparToggletip` — inline toggletip directive.
 *
 * Attaches a click-triggered `<tulpar-toggletip>` to ANY host element WITHOUT
 * wrapping it. Same mechanics as the tooltip directive (id-mint → create →
 * append → sync → destroy), with the addition of a `tone` companion input.
 *
 * `openChange` emits on the element's `tulpar-open` / `tulpar-close`. Signals
 * only — no RxJS.
 */
@Directive({
  selector: "[tulparToggletip]",
  standalone: true,
})
export class TulparToggletipDirective extends OverlayDirectiveBase implements OnInit, OnDestroy {
  /** Toggletip text (the directive value: `tulparToggletip="More info"`). */
  readonly text = input<string | undefined>(undefined, { alias: "tulparToggletip" });

  readonly placement = input<ToggletipPlacement | undefined>(undefined, {
    alias: "toggletipPlacement",
  });
  readonly tone = input<ToggletipTone | undefined>(undefined, { alias: "toggletipTone" });
  readonly arrow = input<boolean | undefined>(undefined, { alias: "toggletipArrow" });
  readonly offset = input<number | undefined>(undefined, { alias: "toggletipOffset" });

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
    const el = this.doc.createElement("tulpar-toggletip") as HTMLElement & {
      for?: string;
      text?: string;
    };
    el.setAttribute("for", id);
    el.text = this.text() ?? "";
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
 * `tulparToggletipRef` — reference form of the toggletip directive.
 *
 * The host references an already-declared `<tulpar-toggletip id="declaredId">…`
 * by id; on init it ensures the host has an id and sets the declared element's
 * `for` to the host id. Single-active-trigger (last-wins). The directive does
 * NOT own the declared element's lifecycle.
 */
@Directive({
  selector: "[tulparToggletipRef]",
  standalone: true,
})
export class TulparToggletipRefDirective extends OverlayDirectiveBase implements OnInit, OnDestroy {
  /** Id of the declared `<tulpar-toggletip>` to anchor to this host. */
  readonly ref = input.required<string>({ alias: "tulparToggletipRef" });

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
