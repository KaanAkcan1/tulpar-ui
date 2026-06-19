import { expect } from "@open-wc/testing";
import {
  isTopAnchor,
  collapsedLayout,
  expandedLayout,
  SCALE_STEP,
  LIFT_PX,
  MAX_VISIBLE_DEFAULT,
  GAP_DEFAULT,
} from "./stacking";
import type { Location } from "./queue";

// ─── isTopAnchor ──────────────────────────────────────────────────────────────

describe("isTopAnchor", () => {
  it("returns true for top-left", () => {
    expect(isTopAnchor("top-left")).to.equal(true);
  });

  it("returns true for top-center", () => {
    expect(isTopAnchor("top-center")).to.equal(true);
  });

  it("returns true for top-right", () => {
    expect(isTopAnchor("top-right")).to.equal(true);
  });

  it("returns false for bottom-left", () => {
    expect(isTopAnchor("bottom-left")).to.equal(false);
  });

  it("returns false for bottom-center", () => {
    expect(isTopAnchor("bottom-center")).to.equal(false);
  });

  it("returns false for bottom-right", () => {
    expect(isTopAnchor("bottom-right")).to.equal(false);
  });
});

// ─── collapsedLayout ─────────────────────────────────────────────────────────

describe("collapsedLayout — bottom anchor (bottom-right)", () => {
  const loc: Location = "bottom-right";

  it("front item (i=0) → scale(1) translateY(0) identity", () => {
    const result = collapsedLayout(0, loc);
    expect(result.transform).to.equal("scale(1) translateY(0px)");
  });

  it("front item (i=0) → opacity 1, zIndex 3, visible", () => {
    const result = collapsedLayout(0, loc);
    expect(result.opacity).to.equal(1);
    expect(result.zIndex).to.equal(3);
    expect(result.visible).to.equal(true);
  });

  it("i=1 → scale(0.95) and lift 14px upward (negative Y for bottom anchor)", () => {
    const result = collapsedLayout(1, loc);
    expect(result.transform).to.equal("scale(0.95) translateY(-14px)");
  });

  it("i=1 → opacity and zIndex step down", () => {
    const result = collapsedLayout(1, loc);
    expect(result.opacity).to.be.lessThan(1);
    expect(result.zIndex).to.equal(2);
    expect(result.visible).to.equal(true);
  });

  it("i=2 → scale(0.9) and lift 28px upward (negative Y for bottom anchor)", () => {
    const result = collapsedLayout(2, loc);
    expect(result.transform).to.equal("scale(0.9) translateY(-28px)");
  });

  it("i=2 → visible (within maxVisible)", () => {
    const result = collapsedLayout(2, loc);
    expect(result.visible).to.equal(true);
  });

  it("i=3 → hidden (beyond default maxVisible of 3)", () => {
    const result = collapsedLayout(3, loc);
    expect(result.visible).to.equal(false);
    expect(result.opacity).to.equal(0);
  });

  it("i=4 → hidden", () => {
    const result = collapsedLayout(4, loc);
    expect(result.visible).to.equal(false);
  });

  it("respects a custom maxVisible option", () => {
    // maxVisible=2: i=2 should be hidden
    const hidden = collapsedLayout(2, loc, { maxVisible: 2 });
    expect(hidden.visible).to.equal(false);

    // maxVisible=4: i=3 should be visible
    const visible = collapsedLayout(3, loc, { maxVisible: 4 });
    expect(visible.visible).to.equal(true);
  });
});

describe("collapsedLayout — top anchor (top-center)", () => {
  const loc: Location = "top-center";

  it("front item (i=0) → scale(1) translateY(0) identity", () => {
    const result = collapsedLayout(0, loc);
    expect(result.transform).to.equal("scale(1) translateY(0px)");
  });

  it("i=1 → positive Y (top stacks grow downward, so lift is +14px)", () => {
    const result = collapsedLayout(1, loc);
    expect(result.transform).to.equal("scale(0.95) translateY(14px)");
  });

  it("i=2 → positive Y 28px", () => {
    const result = collapsedLayout(2, loc);
    expect(result.transform).to.equal("scale(0.9) translateY(28px)");
  });
});

describe("collapsedLayout — constants are exported", () => {
  it("SCALE_STEP is 0.05", () => {
    expect(SCALE_STEP).to.equal(0.05);
  });

  it("LIFT_PX is 14", () => {
    expect(LIFT_PX).to.equal(14);
  });

  it("MAX_VISIBLE_DEFAULT is 3", () => {
    expect(MAX_VISIBLE_DEFAULT).to.equal(3);
  });

  it("GAP_DEFAULT is a positive number (px gap for expanded mode)", () => {
    expect(GAP_DEFAULT).to.be.greaterThan(0);
  });
});

// ─── expandedLayout ───────────────────────────────────────────────────────────

describe("expandedLayout — bottom anchor (bottom-right)", () => {
  const loc: Location = "bottom-right";

  it("single item → translateY(0px) scale(1), visible, full opacity", () => {
    const results = expandedLayout([80], loc);
    expect(results).to.have.length(1);
    expect(results[0].transform).to.equal("translateY(0px) scale(1)");
    expect(results[0].opacity).to.equal(1);
    expect(results[0].visible).to.equal(true);
  });

  it("two items — i=0 at 0px, i=1 offset by height[0]+gap (upward = negative Y)", () => {
    const gap = GAP_DEFAULT;
    const heights = [80, 60];
    const results = expandedLayout(heights, loc, { gap });
    // i=0: front toast, no offset
    expect(results[0].transform).to.equal("translateY(0px) scale(1)");
    // i=1: offset by height[0] + gap, upward (negative Y) for bottom anchor
    const expected = -(heights[0] + gap);
    expect(results[1].transform).to.equal(`translateY(${expected}px) scale(1)`);
  });

  it("three items — cumulative offsets (negative Y for bottom anchor)", () => {
    const gap = 8;
    const heights = [80, 60, 40];
    const results = expandedLayout(heights, loc, { gap });
    expect(results[0].transform).to.equal("translateY(0px) scale(1)");
    const off1 = -(heights[0] + gap);
    expect(results[1].transform).to.equal(`translateY(${off1}px) scale(1)`);
    const off2 = -(heights[0] + gap + heights[1] + gap);
    expect(results[2].transform).to.equal(`translateY(${off2}px) scale(1)`);
  });

  it("all items are visible with opacity 1", () => {
    const results = expandedLayout([80, 60, 40], loc, { gap: 8 });
    for (const r of results) {
      expect(r.visible).to.equal(true);
      expect(r.opacity).to.equal(1);
    }
  });

  it("scale is always 1 in expanded mode", () => {
    const results = expandedLayout([100, 100, 100], loc, { gap: 12 });
    for (const r of results) {
      expect(r.transform).to.include("scale(1)");
    }
  });
});

describe("expandedLayout — top anchor (top-left)", () => {
  const loc: Location = "top-left";

  it("two items — i=1 offset is positive Y (top anchor grows downward)", () => {
    const gap = 8;
    const heights = [80, 60];
    const results = expandedLayout(heights, loc, { gap });
    expect(results[0].transform).to.equal("translateY(0px) scale(1)");
    const expected = heights[0] + gap;
    expect(results[1].transform).to.equal(`translateY(${expected}px) scale(1)`);
  });

  it("three items — cumulative positive Y offsets", () => {
    const gap = 8;
    const heights = [80, 60, 40];
    const results = expandedLayout(heights, loc, { gap });
    const off1 = heights[0] + gap;
    const off2 = heights[0] + gap + heights[1] + gap;
    expect(results[1].transform).to.equal(`translateY(${off1}px) scale(1)`);
    expect(results[2].transform).to.equal(`translateY(${off2}px) scale(1)`);
  });
});

describe("expandedLayout — zIndex ordering", () => {
  it("i=0 has the highest zIndex", () => {
    const results = expandedLayout([80, 60, 40], "bottom-right", { gap: 8 });
    expect(results[0].zIndex).to.be.greaterThan(results[1].zIndex);
    expect(results[1].zIndex).to.be.greaterThan(results[2].zIndex);
  });
});
