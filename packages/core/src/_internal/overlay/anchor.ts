/**
 * Anchor resolution + capability probes for overlay surfaces.
 *
 * The overlay and its trigger are SEPARATE nodes. The overlay references its
 * trigger by id via the `for` attribute/property (like `<label for>` and the
 * native `popovertarget` philosophy); it never contains the trigger as a
 * slotted child. Resolution is `host.for → host.ownerDocument.getElementById`.
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

/** Read the trigger id from the host's `for` property (preferred) or attribute. */
function readFor(host: HTMLElement & { for?: string }): string | null {
  if (typeof host.for === "string" && host.for !== "") return host.for;
  return host.getAttribute("for");
}

/**
 * Resolve the trigger element for an overlay host from its `for` id. Uses the
 * host's `ownerDocument` so resolution works inside test fixtures and any
 * document the host is adopted into. Returns `null` when `for` is unset or
 * points at no element.
 */
export function resolveAnchor(host: HTMLElement & { for?: string }): HTMLElement | null {
  const id = readFor(host);
  if (!id) return null;
  return host.ownerDocument.getElementById(id);
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
      "[tulpar overlay] Trigger has [disabled]; disabled elements dispatch no pointer/focus events, so the overlay will never open. Use aria-disabled instead.",
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

/**
 * Dev-only warning when `for` is set on the host but resolves to no element in
 * the document (typo'd id, or the trigger was removed). Silent when `for` is
 * unset — an overlay with no trigger reference is a legitimate transient state
 * (e.g. before the consumer wires it up). Tree-shaken out of prod by `warnDev`.
 */
export function warnIfUnresolvedFor(
  host: HTMLElement & { for?: string },
  resolved: HTMLElement | null,
): void {
  const id = readFor(host);
  if (!id || resolved) return;
  warnDev(
    `[tulpar overlay] for="${id}" did not resolve to any element; the overlay has no trigger to attach to. Check the id matches a focusable element in the same document.`,
    host,
  );
}
