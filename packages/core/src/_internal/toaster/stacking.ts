/**
 * Pure stacking math for Sonner-style toast stacks.
 *
 * NO DOM, NO Lit, NO timers — just arithmetic returning plain strings/numbers
 * that the region element can apply directly via `el.style.transform = ...`.
 *
 * Two modes:
 *  - Collapsed (Sonner default): scale + lift behind the front card; only the
 *    first `maxVisible` toasts are visible; the rest are hidden.
 *  - Expanded: real-height stacking with a configurable gap; all items visible.
 *
 * Sign convention:
 *  - Bottom-anchored locations (bottom-*) lift upward → negative translateY.
 *  - Top-anchored locations (top-*) push downward → positive translateY.
 */

import type { Location } from "./queue";

// ─── constants ────────────────────────────────────────────────────────────────

/** Scale decrement per stack depth step (Sonner default). */
export const SCALE_STEP = 0.05;

/** Vertical lift per stack depth step in pixels (Sonner default). */
export const LIFT_PX = 14;

/** Default number of visible toasts in collapsed mode. */
export const MAX_VISIBLE_DEFAULT = 3;

/** Default gap in pixels between toasts in expanded mode. */
export const GAP_DEFAULT = 8;

// ─── result type ─────────────────────────────────────────────────────────────

export interface StackEntry {
  /**
   * Plain CSS transform string — assign directly to `el.style.transform`.
   * Never a styleMap object (avoids Lit directive cross-instance crash).
   */
  transform: string;
  /** 0–1 opacity value. 0 for hidden items. */
  opacity: number;
  /** CSS z-index integer. Front item gets the highest value. */
  zIndex: number;
  /** Whether the item should be rendered (i < maxVisible in collapsed mode). */
  visible: boolean;
}

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns `true` when the location anchor is at the top of the viewport.
 * Top-anchored stacks grow downward (positive translateY for items behind).
 * Bottom-anchored stacks grow upward (negative translateY for items behind).
 */
export function isTopAnchor(location: Location): boolean {
  return location.startsWith("top-");
}

// ─── collapsed layout ─────────────────────────────────────────────────────────

export interface CollapsedOptions {
  /** Maximum number of visible items. Defaults to {@link MAX_VISIBLE_DEFAULT}. */
  maxVisible?: number;
}

/**
 * Compute the collapsed-stack `StackEntry` for a single toast at depth `i`
 * (0 = front/newest toast).
 *
 * Transform format: `"translateY(<y>px) scale(<s>)"`
 */
export function collapsedLayout(
  i: number,
  location: Location,
  options: CollapsedOptions = {},
): StackEntry {
  const maxVisible = options.maxVisible ?? MAX_VISIBLE_DEFAULT;
  const visible = i < maxVisible;

  if (!visible) {
    return {
      transform: `translateY(${_lift(i, location)}px) scale(${1 - SCALE_STEP * i})`,
      opacity: 0,
      zIndex: Math.max(0, maxVisible - i),
      visible: false,
    };
  }

  const scale = 1 - SCALE_STEP * i;
  const translateY = _lift(i, location);

  return {
    transform: `translateY(${translateY}px) scale(${scale})`,
    opacity: i === 0 ? 1 : 1 - i * 0.15,
    zIndex: maxVisible - i,
    visible: true,
  };
}

// ─── expanded layout ──────────────────────────────────────────────────────────

export interface ExpandedOptions {
  /** Pixel gap between toasts. Defaults to {@link GAP_DEFAULT}. */
  gap?: number;
}

/**
 * Compute expanded-stack `StackEntry` for each toast in the stack, given the
 * measured pixel height of every visible toast.
 *
 * `heights[i]` is the measured height of the toast at depth `i` (0 = front).
 *
 * Transform format: `"translateY(<y>px) scale(1)"`
 */
export function expandedLayout(
  heights: readonly number[],
  location: Location,
  options: ExpandedOptions = {},
): StackEntry[] {
  const gap = options.gap ?? GAP_DEFAULT;
  const top = isTopAnchor(location);
  const results: StackEntry[] = [];

  let cumulative = 0;
  for (let i = 0; i < heights.length; i++) {
    const translateY = top ? cumulative : -cumulative;

    results.push({
      transform: `translateY(${translateY}px) scale(1)`,
      opacity: 1,
      zIndex: heights.length - i,
      visible: true,
    });

    // Accumulate offset for the next item: height of this item + gap.
    cumulative += heights[i] + gap;
  }

  return results;
}

// ─── private helpers ──────────────────────────────────────────────────────────

/** Signed translateY value for collapsed lift at depth `i`. */
function _lift(i: number, location: Location): number {
  const magnitude = LIFT_PX * i;
  // Bottom anchor → push items upward (negative Y).
  // Top anchor    → push items downward (positive Y).
  return isTopAnchor(location) ? magnitude : -magnitude;
}
