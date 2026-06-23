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
    expect(nextEnabled(it3, 2)).to.equal(2); // at end, stays
  });

  it("prevEnabled skips disabled and stops at the start", () => {
    const it3 = items([false, true, false]);
    expect(prevEnabled(it3, 2)).to.equal(0); // skips 1
    expect(prevEnabled(it3, 0)).to.equal(0); // at start, stays
    expect(prevEnabled(it3, -1)).to.equal(-1); // none active, prev stays none
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

  it("clampActive returns the nearest enabled index or -1", () => {
    expect(clampActive(items([true, false]), 0)).to.equal(1); // 0 disabled → nearest enabled
    expect(clampActive(items([true, true]), 0)).to.equal(-1);
  });
});
