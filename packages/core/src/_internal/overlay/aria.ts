/**
 * ARIA wiring helpers shared by overlay surfaces. These manage the
 * trigger↔surface relationship attributes idempotently so a surface can be
 * linked/unlinked repeatedly (e.g. across open/close) without clobbering
 * author-provided tokens.
 */

let idCounter = 0;

/** Mint a process-unique id with the given prefix. */
function mintId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

/** Ensure the surface has an id, minting one if needed. */
function ensureId(el: Element): string {
  if (!el.id) el.id = mintId("tulpar-overlay");
  return el.id;
}

function tokenList(value: string | null): string[] {
  return (value ?? "").split(/\s+/).filter(Boolean);
}

/**
 * Append the surface id to the trigger's `aria-describedby` token list.
 * Idempotent; preserves any pre-existing tokens.
 */
export function linkDescribedBy(trigger: Element, surface: Element): void {
  const id = ensureId(surface);
  const tokens = tokenList(trigger.getAttribute("aria-describedby"));
  if (!tokens.includes(id)) tokens.push(id);
  trigger.setAttribute("aria-describedby", tokens.join(" "));
}

/**
 * Remove the surface id from the trigger's `aria-describedby`. Removes the
 * attribute entirely when no tokens remain.
 */
export function unlinkDescribedBy(trigger: Element, surface: Element): void {
  if (!surface.id) return;
  const tokens = tokenList(trigger.getAttribute("aria-describedby")).filter(
    (t) => t !== surface.id,
  );
  if (tokens.length === 0) trigger.removeAttribute("aria-describedby");
  else trigger.setAttribute("aria-describedby", tokens.join(" "));
}

export type HasPopupKind = "menu" | "listbox" | "tree" | "grid" | "dialog" | "true";

/** Set `aria-haspopup` on the trigger to the given kind. */
export function setHasPopup(trigger: Element, kind: HasPopupKind): void {
  trigger.setAttribute("aria-haspopup", kind);
}

/** Remove `aria-haspopup` from the trigger. */
export function clearHasPopup(trigger: Element): void {
  trigger.removeAttribute("aria-haspopup");
}

/**
 * Create a visually-hidden polite live region for announcing transient overlay
 * content (e.g. a tooltip's text for screen readers). The caller inserts it and
 * sets `textContent` to announce.
 */
export function makeLiveRegion(): HTMLElement {
  const region = document.createElement("div");
  region.setAttribute("aria-live", "polite");
  region.setAttribute("aria-atomic", "true");
  // Visually hidden but available to assistive tech.
  region.style.position = "absolute";
  region.style.width = "1px";
  region.style.height = "1px";
  region.style.margin = "-1px";
  region.style.padding = "0";
  region.style.border = "0";
  region.style.overflow = "hidden";
  region.style.clip = "rect(0 0 0 0)";
  region.style.clipPath = "inset(50%)";
  region.style.whiteSpace = "nowrap";
  return region;
}
