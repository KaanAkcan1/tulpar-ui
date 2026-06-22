/**
 * Single shared portal root for the toaster region.
 *
 * Responsibilities:
 * - Lazily creates ONE `<div role="region" aria-label="Notifications">` appended
 *   to `document.body`, so the region always lives at document top level and is
 *   never trapped inside an `aria-modal` dialog subtree (a known live-region
 *   announcement bug — see spec §5.3).
 * - Mirrors the page theme (`dark` class + `data-brand` attribute on
 *   `document.documentElement`) via a MutationObserver, matching the overlay-root
 *   pattern so portaled toasts inherit the active brand/mode.
 * - Lazily creates one child container per location (`getLocationContainer`) so
 *   the toast service can append individual toast elements directly into the right
 *   corner slot. Each container carries `data-location` for CSS positioning hooks.
 * - Installs a document `keydown` listener for **F6 / Shift+F6** focus jump:
 *   F6 moves focus into the region (first focusable toast, or the region itself as
 *   a fallback); Shift+F6 returns focus to the element that previously held it.
 *   The listener is bound exactly once regardless of how many times the module is
 *   imported.
 *
 * NO queue logic, NO timers, NO stacking math, NO toast rendering here — YAGNI.
 */

import type { Location } from "./queue";

const ROOT_ATTR = "data-tulpar-toaster-root";
const REGION_LABEL = "Notifications";
const STYLE_ATTR = "data-tulpar-toaster";

let root: HTMLElement | null = null;
let themeObserver: MutationObserver | null = null;
const containers = new Map<Location, HTMLElement>();
let keydownBound = false;
let globalStyleInjected = false;

/**
 * Previously-focused element before F6 jump; used by Shift+F6 to restore focus.
 * Kept as a WeakRef so it doesn't prevent GC of detached elements.
 */
let previousFocus: WeakRef<HTMLElement> | null = null;

// ─── global style injection ──────────────────────────────────────────────────

/**
 * Inject a single `<style data-tulpar-toaster>` sheet into `<head>` the first
 * time the toaster portal is created.  Because the region root is LIGHT DOM
 * (appended to `document.body`), shadow-DOM stylesheets cannot reach it — an
 * injected global sheet is the right solution.
 *
 * Rules:
 * - Region root: `position:fixed; inset:0; pointer-events:none; z-index:var(--tulpar-z-toast, 9000)`
 *   → covers the whole viewport but doesn't block pointer events.
 * - Each `[data-location]` container: `position:fixed; display:flex; pointer-events:none;`
 *   → anchored to the correct corner/edge.
 * - Individual `<tulpar-toast>` hosts inside containers: `pointer-events:auto`
 *   → restores interactivity per-toast even though the parent is `pointer-events:none`.
 *
 * The sheet is keyed off `[data-tulpar-toaster]` and injected only once regardless
 * of how many times the module is imported.
 */
function injectGlobalStyles(): void {
  if (globalStyleInjected) return;
  if (document.querySelector(`[${STYLE_ATTR}]`)) {
    globalStyleInjected = true;
    return;
  }
  globalStyleInjected = true;

  const style = document.createElement("style");
  style.setAttribute(STYLE_ATTR, "");
  style.textContent = `
/* Tulpar UI — toaster portal positioning */
[${ROOT_ATTR}] {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: var(--tulpar-feedback-z-index, 9000);
}

/* ── Location containers ──
 * Each container is a fixed-position anchor sized to zero.
 * Individual toast hosts are position:absolute, pinned to the anchored
 * edge.  The JS _applyStacking() transform is the SINGLE source of
 * position for both collapsed and expanded modes — no flex layout fights it.
 */
[data-location] {
  position: fixed;
  pointer-events: none;
  /* Zero-size anchor — children escape via position:absolute */
  width: 0;
  height: 0;
}

/* top edge */
[data-location^="top-"] {
  top: 16px;
}

/* bottom edge */
[data-location^="bottom-"] {
  bottom: 16px;
}

/* left-aligned */
[data-location$="-left"] {
  left: 16px;
}

/* right-aligned */
[data-location$="-right"] {
  right: 16px;
}

/* center-aligned (horizontal): anchor at the horizontal midpoint.
 * Children use a negative margin technique to avoid transform conflicts
 * with the service-applied translateY+scale transform. */
[data-location$="-center"] {
  left: 50%;
}

/* ── Individual toast hosts: absolutely anchored to the container edge ── */
[data-location] > * {
  position: absolute;
  pointer-events: auto;
}

/* Pin to the anchored edge so translateY(0) means "at the corner" */
[data-location^="top-"] > * {
  top: 0;
}
[data-location^="bottom-"] > * {
  bottom: 0;
}

/* Horizontal alignment */
[data-location$="-left"] > * {
  left: 0;
}
[data-location$="-right"] > * {
  right: 0;
}
/* Center: shift left by half the element's own width via negative translate.
 * The JS service will prepend "translateX(-50%)" to the stacking transform
 * so that horizontal centering + vertical stacking work together. */
[data-location$="-center"] > * {
  left: 0;
}
`;

  // Append to <head> (preferred) or <body> as fallback.
  (document.head ?? document.body).appendChild(style);
}

// ─── theme sync ─────────────────────────────────────────────────────────────

function syncTheme(el: HTMLElement): void {
  const docEl = document.documentElement;
  el.classList.toggle("dark", docEl.classList.contains("dark"));
  const brand = docEl.getAttribute("data-brand");
  if (brand === null) el.removeAttribute("data-brand");
  else el.setAttribute("data-brand", brand);
}

// ─── F6 / Shift+F6 handler ───────────────────────────────────────────────────

/**
 * Returns the first element inside `container` that can receive focus, or null.
 * We look for elements with tabindex >= 0 or natively focusable tags not disabled.
 *
 * **Shadow DOM limitation:** this query does NOT pierce shadow roots. Once
 * `<tulpar-toast>` elements render their close button / action inside a shadow
 * root, `firstFocusable` will return `null` and F6 will fall back to focusing
 * the region root element itself. The follow-up rendering task must handle this
 * via `delegatesFocus: true` on the toast's shadow root, or by setting a host
 * `tabindex` so that the host element itself is returned here and delegates
 * inward automatically.
 */
function firstFocusable(container: HTMLElement): HTMLElement | null {
  const candidates = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
      'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  return candidates.length > 0 ? candidates[0] : null;
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key !== "F6") return;

  // Prevent the browser's built-in F6 focus-ring / address-bar navigation so
  // only our region jump fires (applies to both F6 and Shift+F6).
  e.preventDefault();

  if (e.shiftKey) {
    // Shift+F6: return focus to the element that had it before the F6 jump.
    const prev = previousFocus?.deref();
    if (prev && prev.isConnected) {
      prev.focus();
      previousFocus = null;
    }
    // If we have nowhere to go, do nothing (browser defaults apply).
    return;
  }

  // F6: move focus into the toaster region.
  if (!root || !root.isConnected) return;

  // Capture where focus currently is so Shift+F6 can restore it.
  const active = document.activeElement as HTMLElement | null;
  if (active && active !== root) {
    previousFocus = new WeakRef(active);
  }

  // Try to focus the first focusable toast; fall back to the region itself.
  const target = firstFocusable(root) ?? root;
  // Ensure the root is focusable as a fallback target.
  if (target === root && !root.hasAttribute("tabindex")) {
    root.setAttribute("tabindex", "-1");
  }
  target.focus();
}

function ensureKeydownListener(): void {
  if (keydownBound) return;
  keydownBound = true;
  document.addEventListener("keydown", onKeydown);
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * Restore focus to the element that had focus before the F6 jump into the
 * toaster region, then clear the stored reference.
 *
 * Called by the toast service's `_doRemove` path when the dismissed toast
 * contained focus and no other toast remains in the same location to receive it.
 * This coordinates with the `previousFocus` WeakRef that the F6 handler stores.
 *
 * No-op (and does not throw) when:
 * - `previousFocus` is null (no F6 jump occurred before dismiss)
 * - The referenced element has been GC'd or disconnected
 *
 * @returns `true` if focus was successfully restored, `false` otherwise.
 */
export function restorePreviousFocus(): boolean {
  const prev = previousFocus?.deref();
  previousFocus = null; // always clear to avoid stale re-use
  if (prev && prev.isConnected) {
    prev.focus();
    return true;
  }
  return false;
}

/**
 * Lazily create (or return) the single toaster portal root. The root is appended
 * to `document.body` with `role="region"` and a label, and kept in sync with the
 * document theme via a MutationObserver on `documentElement`.
 */
export function getToasterRoot(): HTMLElement {
  if (root && root.isConnected) return root;

  injectGlobalStyles();

  root = document.createElement("div");
  root.setAttribute(ROOT_ATTR, "");
  root.setAttribute("role", "region");
  root.setAttribute("aria-label", REGION_LABEL);
  // tabindex=-1 allows programmatic focus (F6 fallback) without entering the tab
  // order; we set it upfront so focus tests can rely on the attribute being present
  // after the first getToasterRoot call.
  root.setAttribute("tabindex", "-1");
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

/**
 * Lazily create (or return) the child container for `location`. Each of the six
 * locations gets exactly one container that is a direct child of the toaster root.
 * The container carries `data-location` for CSS fixed-position targeting; precise
 * coordinates live in the component/styles layer, not here.
 */
export function getLocationContainer(location: Location): HTMLElement {
  const existing = containers.get(location);
  if (existing && existing.isConnected) return existing;

  const toasterRoot = getToasterRoot();
  const container = document.createElement("div");
  container.setAttribute("data-location", location);
  toasterRoot.appendChild(container);
  containers.set(location, container);
  return container;
}

/**
 * Test-only teardown: removes the root + observer + keydown listener, and clears
 * the location-container map so each test starts from a clean slate.
 */
export function __resetToasterRootForTest(): void {
  if (themeObserver) {
    themeObserver.disconnect();
    themeObserver = null;
  }
  if (root && root.parentElement) root.parentElement.removeChild(root);
  root = null;
  containers.clear();
  previousFocus = null;
  if (keydownBound) {
    document.removeEventListener("keydown", onKeydown);
    keydownBound = false;
  }
  // Remove the injected global style sheet so tests start from a clean slate.
  const injected = document.querySelector(`[${STYLE_ATTR}]`);
  if (injected) injected.parentElement?.removeChild(injected);
  globalStyleInjected = false;
}
