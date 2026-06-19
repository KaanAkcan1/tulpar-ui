/**
 * Single shared portal root for all overlay surfaces (popover/tooltip/menu),
 * plus a small stack manager so a top-of-stack Escape closes only the topmost
 * overlay.
 *
 * The root mirrors the host page's theme triggers — the `dark` class and the
 * `data-brand` attribute on `document.documentElement` — so portaled surfaces
 * inherit the active theme even though they live outside the component tree.
 */

const ROOT_ATTR = "data-tulpar-overlay-root";

interface OverlayEntry {
  el: Element;
  close: () => void;
}

let root: HTMLElement | null = null;
let themeObserver: MutationObserver | null = null;
const stack: OverlayEntry[] = [];
let keydownBound = false;

function syncTheme(el: HTMLElement): void {
  const docEl = document.documentElement;
  el.classList.toggle("dark", docEl.classList.contains("dark"));
  const brand = docEl.getAttribute("data-brand");
  if (brand === null) el.removeAttribute("data-brand");
  else el.setAttribute("data-brand", brand);
}

function ensureKeydownListener(): void {
  if (keydownBound) return;
  keydownBound = true;
  document.addEventListener("keydown", onKeydown);
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key !== "Escape") return;
  const top = stack[stack.length - 1];
  if (top) top.close();
}

/**
 * Lazily create (or return) the single overlay portal root. The root is
 * appended to `document.body` and kept in sync with the document theme via a
 * MutationObserver on `documentElement`.
 */
export function getOverlayRoot(): HTMLElement {
  if (root && root.isConnected) return root;

  root = document.createElement("div");
  root.setAttribute(ROOT_ATTR, "");
  syncTheme(root);
  document.body.appendChild(root);

  themeObserver = new MutationObserver(() => {
    if (root) syncTheme(root);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "data-brand"],
  });

  ensureKeydownListener();
  return root;
}

/** Register an overlay on the stack with a close callback (used by Escape). */
export function pushOverlay(el: Element, close: () => void): void {
  ensureKeydownListener();
  // De-dupe: if the element is already tracked, replace its entry and move it
  // to the top.
  popOverlay(el);
  stack.push({ el, close });
}

/** Remove an overlay from the stack (no-op if absent). */
export function popOverlay(el: Element): void {
  const idx = stack.findIndex((entry) => entry.el === el);
  if (idx !== -1) stack.splice(idx, 1);
}

/** The current topmost overlay element, or null when the stack is empty. */
export function topOverlay(): Element | null {
  const top = stack[stack.length - 1];
  return top ? top.el : null;
}

/**
 * Test-only teardown: removes the root + observer + listener and clears the
 * stack so each test starts from a clean slate.
 */
export function __resetOverlayRootForTest(): void {
  if (themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }
  if (root && root.parentElement) root.parentElement.removeChild(root);
  root = null;
  stack.length = 0;
  if (keydownBound) {
    document.removeEventListener("keydown", onKeydown);
    keydownBound = false;
  }
}
