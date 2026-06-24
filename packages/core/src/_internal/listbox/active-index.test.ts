import { expect } from "@open-wc/testing";
import {
  nextEnabled,
  prevEnabled,
  firstEnabled,
  lastEnabled,
  pageMove,
  clampActive,
} from "./active-index";

const items = (flags: boolean[]) => flags.map((disabled) => ({ disabled }));

describe("active-index reducer", () => {
  it("nextEnabled skips disabled and stops at the end (no-wrap)", () => {
    const it3 = items([false, true, false]); // 0 enabled, 1 disabled, 2 enabled
    expect(nextEnabled(it3, -1)).to.equal(0);
    expect(nextEnabled(it3, 0)).to.equal(2); // skips 1
    expect(nextEnabled(it3, 2)).to.equal(2); // at end, stays (index 2 is ENABLED)
  });

  // Bug 1 regression: when `from` is disabled and no enabled item exists after it,
  // nextEnabled must return -1, NOT the disabled `from` index.
  it("nextEnabled returns -1 when from is disabled and no enabled item follows", () => {
    expect(nextEnabled(items([true, true]), 0)).to.equal(-1);
  });

  it("prevEnabled skips disabled and stops at the start", () => {
    const it3 = items([false, true, false]);
    expect(prevEnabled(it3, 2)).to.equal(0); // skips 1
    expect(prevEnabled(it3, 0)).to.equal(0); // at start, stays
    expect(prevEnabled(it3, -1)).to.equal(-1); // none active, prev stays none
  });

  // Extra small test: prevEnabled from a disabled index with nothing before it → -1
  it("prevEnabled returns -1 when from is disabled and no enabled item precedes it", () => {
    expect(prevEnabled(items([true, true]), 0)).to.equal(-1);
  });

  it("firstEnabled / lastEnabled find the edge enabled item", () => {
    const it = items([true, false, false, true]);
    expect(firstEnabled(it)).to.equal(1);
    expect(lastEnabled(it)).to.equal(2);
    expect(firstEnabled(items([true, true]))).to.equal(-1); // all disabled
  });

  it("pageMove jumps by page size, clamping to enabled edges", () => {
    const it = items([false, false, false, false, false]);
    expect(pageMove(it, 0, 3)).to.equal(3);
    expect(pageMove(it, 4, -3)).to.equal(1);
    expect(pageMove(it, 4, 3)).to.equal(4); // clamp at end
  });

  // Extra small test: pageMove from -1 with negative delta → nearest enabled (forward bias)
  it("pageMove from -1 with negative delta lands on a valid enabled index", () => {
    // base = items.length (4) because delta < 0 and from = -1
    // target = 4 + (-3) = 1, clamped to [0, 3] → 1; items[1] enabled → returns 1
    expect(pageMove(items([false, false, false, false]), -1, -3)).to.equal(1);
  });

  it("clampActive returns the nearest enabled index or -1", () => {
    expect(clampActive(items([true, false]), 0)).to.equal(1); // 0 disabled → nearest enabled
    expect(clampActive(items([true, true]), 0)).to.equal(-1);
  });

  // Bug 2 regression: clampActive must NOT throw when idx is past the end of the array
  // (stale index after option list shrinks). With items=[false,false] (length=2) and idx=5:
  // d=1: f=6 (>=2, skip), b=4 (b < items.length is false → skip with the fix; crashes without it).
  // Loop exhausts at d<2, falls through to firstEnabled → 0.
  it("clampActive does not throw and returns valid index for stale out-of-bounds idx", () => {
    expect(clampActive(items([false, false]), 5)).to.equal(0);
  });
});
