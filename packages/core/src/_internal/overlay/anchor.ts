/**
 * Anchor resolution + capability probes for overlay surfaces.
 *
 * An overlay host can be anchored either by slotting a focusable trigger into
 * its `[slot="trigger"]`, or by pointing `host.anchor` at an element id. The
 * slotted trigger takes precedence (it is the common, self-contained case).
 */

import { warnDev } from "../warn-dev";

/** Native elements that are focusable without an explicit tabindex. */
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button",
  "input",
  "select",
  "textarea",
  "[tabindex]",
  '[contenteditable="true"]',
].join(",");

/** Is `el` focusable (native focusable tag or non-negative tabindex)? */
function isFocusable(el: Element): boolean {
  if (el.matches(FOCUSABLE_SELECTOR)) {
    const tabindex = el.getAttribute("tabindex");
    if (tabindex !== null && Number(tabindex) < 0) return false;
    return true;
  }
  return false;
}

/**
 * Resolve the anchor element for an overlay host. Prefers the first focusable
 * element assigned to the host's `[slot="trigger"]`; otherwise falls back to
 * `document.getElementById(host.anchor)`.
 */
export function resolveAnchor(host: HTMLElement & { anchor?: string }): HTMLElement | null {
  // Light-DOM children explicitly placed into the trigger slot.
  const slotted = Array.from(host.children).filter(
    (c) => c.getAttribute("slot") === "trigger",
  ) as HTMLElement[];

  for (const candidate of slotted) {
    if (isFocusable(candidate)) return candidate;
    // The slotted node might wrap the real focusable control.
    const inner = candidate.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    if (inner) return inner;
  }
  // No focusable found among slotted nodes — fall back to the first slotted
  // node if present (resolution succeeds; focusability is flagged separately
  // by warnIfBadTrigger).
  if (slotted.length > 0) return slotted[0];

  if (host.anchor) {
    return document.getElementById(host.anchor);
  }
  return null;
}

/** Feature probe: native Popover API support. */
export function supportsPopover(): boolean {
  return typeof HTMLElement !== "undefined" && "popover" in HTMLElement.prototype;
}

/** Feature probe: CSS Anchor Positioning support. */
export function supportsCssAnchor(): boolean {
  return typeof CSS !== "undefined" && CSS.supports("anchor-name: --x");
}

/**
 * Dev-only warning for a misconfigured trigger — non-focusable elements and the
 * classic "tooltip on a disabled button" trap (a disabled control fires no
 * pointer/focus events, so the overlay never opens). Tree-shaken out of prod by
 * `warnDev`.
 */
export function warnIfBadTrigger(el: Element | null): void {
  if (!el) return;
  if (el.hasAttribute("disabled")) {
    warnDev(
      "[tulpar overlay] Trigger has [disabled]; disabled elements dispatch no pointer/focus events, so the overlay will never open. Wrap the control or use aria-disabled instead.",
      el,
    );
    return;
  }
  if (!isFocusable(el)) {
    warnDev(
      "[tulpar overlay] Trigger is not focusable; keyboard and assistive-tech users cannot open the overlay. Use a <button> or add tabindex=\"0\".",
      el,
    );
  }
}
