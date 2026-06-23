/**
 * Pure active-index math for a listbox/menu. Operates over a minimal item shape
 * `{ disabled }`; the caller owns the real option elements. No-wrap: movement
 * stops at the first/last ENABLED item (never cycles). `-1` means "no active".
 *
 * Shared Wave-2 foundation: Select uses it now; Combobox/MultiSelect/Menu later.
 */
export interface ActiveItem {
  disabled: boolean;
}

export function firstEnabled(items: readonly ActiveItem[]): number {
  for (let i = 0; i < items.length; i++) if (!items[i].disabled) return i;
  return -1;
}

export function lastEnabled(items: readonly ActiveItem[]): number {
  for (let i = items.length - 1; i >= 0; i--) if (!items[i].disabled) return i;
  return -1;
}

export function nextEnabled(items: readonly ActiveItem[], from: number): number {
  for (let i = from + 1; i < items.length; i++) if (!items[i].disabled) return i;
  // No enabled item after `from`: stay where we are if currently enabled, else
  // fall back to the first enabled (covers from = -1 with a leading disabled).
  if (from >= 0 && from < items.length && !items[from].disabled) return from;
  return from < 0 ? firstEnabled(items) : from;
}

export function prevEnabled(items: readonly ActiveItem[], from: number): number {
  if (from < 0) return -1;
  for (let i = from - 1; i >= 0; i--) if (!items[i].disabled) return i;
  return !items[from]?.disabled ? from : firstEnabled(items);
}

export function pageMove(items: readonly ActiveItem[], from: number, delta: number): number {
  const base = from < 0 ? (delta > 0 ? -1 : items.length) : from;
  let target = base + delta;
  target = Math.max(0, Math.min(items.length - 1, target));
  // Land on the nearest enabled in the direction of travel.
  const dir = delta >= 0 ? 1 : -1;
  for (let i = target; i >= 0 && i < items.length; i += dir) {
    if (!items[i].disabled) return i;
  }
  // Nothing enabled in that direction from target → search the other way.
  for (let i = target; i >= 0 && i < items.length; i -= dir) {
    if (!items[i].disabled) return i;
  }
  return from;
}

/** Nearest enabled index to `idx` (forward bias), or -1 if none enabled. */
export function clampActive(items: readonly ActiveItem[], idx: number): number {
  if (idx >= 0 && idx < items.length && !items[idx].disabled) return idx;
  for (let d = 1; d < items.length; d++) {
    const f = idx + d;
    if (f < items.length && !items[f].disabled) return f;
    const b = idx - d;
    if (b >= 0 && !items[b].disabled) return b;
  }
  return firstEnabled(items);
}
