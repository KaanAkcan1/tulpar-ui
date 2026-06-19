/**
 * Pure overlay positioning math. NO DOM reads — operates entirely over rects so
 * it is deterministic and unit-testable. Callers (popover/tooltip elements) are
 * responsible for measuring the anchor/floating/viewport rects and applying the
 * resulting coordinates.
 *
 * Order of operations: offset → flip → shift → arrow. This mirrors the floating
 * positioning convention (place, then keep on the desired side, then keep on
 * screen, then point the arrow at the anchor).
 */

export type Side = "top" | "bottom" | "left" | "right";
export type Align = "start" | "center" | "end";
export type Placement = `${Side}-${Align}` | "auto";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComputeInput {
  anchor: Rect;
  floating: { width: number; height: number };
  viewport: Rect;
  placement: Placement;
  /** Main-axis gap between the anchor edge and the floating element. */
  offset: number;
  /** Cross-axis nudge applied after alignment. */
  crossOffset: number;
  /** Minimum distance the floating element keeps from the viewport edges. */
  containerPadding: number;
  flip: boolean;
  /** When non-null, an arrow position is computed. */
  arrow: { size: number; boundaryOffset: number } | null;
}

export interface ComputeResult {
  x: number;
  y: number;
  side: Side;
  align: Align;
  arrow: { x: number; y: number; hidden: boolean } | null;
}

const OPPOSITE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function isVertical(side: Side): boolean {
  return side === "top" || side === "bottom";
}

/** Available space between the anchor and the viewport edge on the given side. */
function spaceOnSide(side: Side, anchor: Rect, viewport: Rect): number {
  switch (side) {
    case "top":
      return anchor.y - viewport.y;
    case "bottom":
      return viewport.y + viewport.height - (anchor.y + anchor.height);
    case "left":
      return anchor.x - viewport.x;
    case "right":
      return viewport.x + viewport.width - (anchor.x + anchor.width);
  }
}

/** Does the floating element fit on `side` given the offset + padding? */
function fitsOnSide(
  side: Side,
  i: ComputeInput,
): boolean {
  const need =
    (isVertical(side) ? i.floating.height : i.floating.width) + i.offset + i.containerPadding;
  return spaceOnSide(side, i.anchor, i.viewport) >= need;
}

function pickAutoSide(i: ComputeInput): Side {
  const sides: Side[] = ["bottom", "top", "right", "left"];
  let best: Side = "bottom";
  let bestSpace = -Infinity;
  for (const side of sides) {
    const space = spaceOnSide(side, i.anchor, i.viewport);
    if (space > bestSpace) {
      bestSpace = space;
      best = side;
    }
  }
  return best;
}

/** Main-axis coordinate for the chosen side (no clamping — that's shift's job). */
function mainAxisCoord(side: Side, i: ComputeInput): number {
  const { anchor, floating, offset } = i;
  switch (side) {
    case "top":
      return anchor.y - floating.height - offset;
    case "bottom":
      return anchor.y + anchor.height + offset;
    case "left":
      return anchor.x - floating.width - offset;
    case "right":
      return anchor.x + anchor.width + offset;
  }
}

/**
 * Cross-axis coordinate for the chosen alignment, before shift clamping.
 * For vertical sides the cross axis is x; for horizontal sides it is y.
 */
function crossAxisCoord(side: Side, align: Align, i: ComputeInput): number {
  const { anchor, floating, crossOffset } = i;
  const vertical = isVertical(side);
  const anchorStart = vertical ? anchor.x : anchor.y;
  const anchorLen = vertical ? anchor.width : anchor.height;
  const floatingLen = vertical ? floating.width : floating.height;

  let pos: number;
  switch (align) {
    case "start":
      pos = anchorStart;
      break;
    case "center":
      pos = anchorStart + anchorLen / 2 - floatingLen / 2;
      break;
    case "end":
      pos = anchorStart + anchorLen - floatingLen;
      break;
  }
  return pos + crossOffset;
}

/** Clamp a cross-axis position within the viewport, respecting padding. */
function shiftClamp(side: Side, pos: number, i: ComputeInput): number {
  const vertical = isVertical(side);
  const floatingLen = vertical ? i.floating.width : i.floating.height;
  const viewStart = vertical ? i.viewport.x : i.viewport.y;
  const viewLen = vertical ? i.viewport.width : i.viewport.height;

  const min = viewStart + i.containerPadding;
  const max = viewStart + viewLen - floatingLen - i.containerPadding;
  // If the floating element is larger than the available band, prefer the min
  // edge (avoid max < min producing a nonsensical clamp).
  if (max < min) return min;
  return Math.min(Math.max(pos, min), max);
}

function computeArrow(
  side: Side,
  crossPos: number,
  i: ComputeInput,
): { x: number; y: number; hidden: boolean } | null {
  const arrow = i.arrow;
  if (!arrow) return null;

  const vertical = isVertical(side);
  const anchorStart = vertical ? i.anchor.x : i.anchor.y;
  const anchorLen = vertical ? i.anchor.width : i.anchor.height;
  const floatingLen = vertical ? i.floating.width : i.floating.height;

  // Desired arrow position (top-left of the arrow box) within the floating
  // element's local coordinates: centered under the anchor center.
  const anchorCenter = anchorStart + anchorLen / 2;
  const desired = anchorCenter - crossPos - arrow.size / 2;

  // Clamp within the floating element, respecting boundaryOffset on both ends.
  const min = arrow.boundaryOffset;
  const max = floatingLen - arrow.boundaryOffset - arrow.size;
  const clamped = max < min ? min : Math.min(Math.max(desired, min), max);

  // The arrow is hidden when its center would leave the anchor span — i.e. the
  // surface shifted so far that the arrow no longer points at the anchor.
  const arrowCenterAbsolute = crossPos + clamped + arrow.size / 2;
  const hidden = arrowCenterAbsolute < anchorStart || arrowCenterAbsolute > anchorStart + anchorLen;

  const result = { hidden };
  if (vertical) {
    return { ...result, x: clamped, y: 0 };
  }
  return { ...result, x: 0, y: clamped };
}

export function computePosition(i: ComputeInput): ComputeResult {
  const [reqSide, reqAlign] =
    i.placement === "auto"
      ? ([pickAutoSide(i), "center"] as const)
      : (i.placement.split("-") as [Side, Align]);

  let side: Side = reqSide;
  const align: Align = reqAlign;

  // flip: if the requested side doesn't fit but its opposite does, flip.
  if (i.placement !== "auto" && i.flip && !fitsOnSide(side, i)) {
    const opposite = OPPOSITE[side];
    if (fitsOnSide(opposite, i)) {
      side = opposite;
    }
  }

  // offset (main axis) — computed for the final side.
  const mainPos = mainAxisCoord(side, i);

  // shift (cross axis) — align then clamp into the viewport.
  const crossRaw = crossAxisCoord(side, align, i);
  const crossPos = shiftClamp(side, crossRaw, i);

  const arrow = computeArrow(side, crossPos, i);

  const vertical = isVertical(side);
  return {
    x: vertical ? crossPos : mainPos,
    y: vertical ? mainPos : crossPos,
    side,
    align,
    arrow,
  };
}
