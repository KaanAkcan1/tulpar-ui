/**
 * Pure active-index math for a listbox/menu. Operates over a minimal item shape
 * `{ disabled, hidden? }`; the caller owns the real option elements. No-wrap:
 * movement stops at the first/last NAVIGABLE item (never cycles). `-1` means
 * "no active".
 *
 * Shared Wave-2 foundation: Select uses it now; Combobox/MultiSelect/Menu later.
 */
export interface ActiveItem {
  disabled: boolean;
  /** Filtered out (search no-match) — skipped by navigation, like disabled. */
  hidden?: boolean;
}

/** An item is navigable when it is neither disabled nor hidden. */
function navigable(item: ActiveItem | undefined): boolean {
  return !!item && !item.disabled && !item.hidden;
}

export function firstEnabled(items: readonly ActiveItem[]): number {
  for (let i = 0; i < items.length; i++) if (navigable(items[i])) return i;
  return -1;
}

export function lastEnabled(items: readonly ActiveItem[]): number {
  for (let i = items.length - 1; i >= 0; i--) if (navigable(items[i])) return i;
  return -1;
}

export function nextEnabled(items: readonly ActiveItem[], from: number): number {
  for (let i = from + 1; i < items.length; i++) if (navigable(items[i])) return i;
  // No navigable item after `from`: stay where we are if currently navigable,
  // else fall back to the first navigable (covers from = -1 with a leading
  // disabled/hidden). When `from` itself is not navigable, return -1.
  if (from >= 0 && from < items.length && navigable(items[from])) return from;
  return from < 0 ? firstEnabled(items) : -1;
}

export function prevEnabled(items: readonly ActiveItem[], from: number): number {
  if (from < 0) return -1;
  for (let i = from - 1; i >= 0; i--) if (navigable(items[i])) return i;
  // navigable(items[from]) is false for an out-of-bounds `from` (the old code used
  // optional chaining and returned `from`); falling back to firstEnabled here is
  // intentionally safer — no existing test exercises a stale out-of-bounds index.
  return navigable(items[from]) ? from : firstEnabled(items);
}

export function pageMove(items: readonly ActiveItem[], from: number, delta: number): number {
  const base = from < 0 ? (delta > 0 ? -1 : items.length) : from;
  let target = base + delta;
  target = Math.max(0, Math.min(items.length - 1, target));
  // Land on the nearest navigable in the direction of travel.
  const dir = delta >= 0 ? 1 : -1;
  for (let i = target; i >= 0 && i < items.length; i += dir) if (navigable(items[i])) return i;
  // Nothing navigable in that direction from target → search the other way.
  for (let i = target; i >= 0 && i < items.length; i -= dir) if (navigable(items[i])) return i;
  return from;
}

/** Nearest navigable index to `idx` (forward bias), or -1 if none navigable. */
export function clampActive(items: readonly ActiveItem[], idx: number): number {
  if (idx >= 0 && idx < items.length && navigable(items[idx])) return idx;
  for (let d = 1; d < items.length; d++) {
    const f = idx + d;
    if (f < items.length && navigable(items[f])) return f;
    const b = idx - d;
    if (b >= 0 && b < items.length && navigable(items[b])) return b;
  }
  return firstEnabled(items);
}
