import { expect } from "@open-wc/testing";
import { computePosition, type ComputeInput, type Rect } from "./positioner";

const viewport: Rect = { x: 0, y: 0, width: 1000, height: 800 };

function input(overrides: Partial<ComputeInput> = {}): ComputeInput {
  return {
    anchor: { x: 400, y: 400, width: 100, height: 40 },
    floating: { width: 200, height: 80 },
    viewport,
    placement: "bottom-center",
    offset: 8,
    crossOffset: 0,
    containerPadding: 4,
    flip: true,
    arrow: null,
    ...overrides,
  };
}

describe("computePosition", () => {
  describe("offset + default placement", () => {
    it("honors default placement when it fits", () => {
      const r = computePosition(input());
      expect(r.side).to.equal("bottom");
      expect(r.align).to.equal("center");
      // below the anchor by offset
      expect(r.y).to.equal(400 + 40 + 8);
      // center align: anchor center - floating half width
      // anchor center x = 400 + 50 = 450; floating half = 100 => 350
      expect(r.x).to.equal(350);
    });

    it("applies crossOffset along the main axis cross direction", () => {
      const r = computePosition(input({ crossOffset: 10 }));
      expect(r.x).to.equal(360);
    });

    it("aligns start/end on the bottom side", () => {
      const start = computePosition(input({ placement: "bottom-start" }));
      expect(start.x).to.equal(400);
      const end = computePosition(input({ placement: "bottom-end" }));
      // anchor right - floating width = 500 - 200 = 300
      expect(end.x).to.equal(300);
    });

    it("places to the right with vertical alignment", () => {
      const r = computePosition(input({ placement: "right-center" }));
      expect(r.side).to.equal("right");
      expect(r.x).to.equal(400 + 100 + 8);
      // vertical center: anchor center y = 420; floating half h = 40 => 380
      expect(r.y).to.equal(380);
    });
  });

  describe("flip", () => {
    it("flips top -> bottom when anchor is near the top edge", () => {
      const r = computePosition(
        input({
          anchor: { x: 400, y: 10, width: 100, height: 40 },
          placement: "top-center",
        }),
      );
      expect(r.side).to.equal("bottom");
    });

    it("flips bottom -> top when anchor is near the bottom edge", () => {
      const r = computePosition(
        input({
          anchor: { x: 400, y: 760, width: 100, height: 40 },
          placement: "bottom-center",
        }),
      );
      expect(r.side).to.equal("top");
    });

    it("does not flip when flip:false even if overflowing", () => {
      const r = computePosition(
        input({
          anchor: { x: 400, y: 10, width: 100, height: 40 },
          placement: "top-center",
          flip: false,
        }),
      );
      expect(r.side).to.equal("top");
    });
  });

  describe("shift", () => {
    it("clamps x within the viewport padding when anchor is near the right edge", () => {
      const r = computePosition(
        input({
          anchor: { x: 940, y: 400, width: 100, height: 40 },
          placement: "bottom-center",
        }),
      );
      const max = viewport.x + viewport.width - 200 - 4; // 796
      expect(r.x).to.be.at.most(max);
      expect(r.x).to.equal(max);
      // side unchanged by shift
      expect(r.side).to.equal("bottom");
    });

    it("clamps x to the lower bound when anchor is near the left edge", () => {
      const r = computePosition(
        input({
          anchor: { x: 0, y: 400, width: 40, height: 40 },
          placement: "bottom-end",
        }),
      );
      const min = viewport.x + 4;
      expect(r.x).to.be.at.least(min);
      expect(r.x).to.equal(min);
      expect(r.side).to.equal("bottom");
    });

    it("clamps y on the main-cross axis for left/right placements", () => {
      const r = computePosition(
        input({
          anchor: { x: 400, y: 770, width: 100, height: 40 },
          placement: "right-center",
        }),
      );
      const max = viewport.y + viewport.height - 80 - 4; // 716
      expect(r.y).to.equal(max);
      expect(r.side).to.equal("right");
    });
  });

  describe("auto", () => {
    it("picks the side with the most available space", () => {
      // anchor near the top => bottom has the most room
      const r = computePosition(
        input({
          anchor: { x: 400, y: 40, width: 100, height: 40 },
          placement: "auto",
        }),
      );
      expect(r.side).to.equal("bottom");
    });

    it("picks top when the anchor sits near the bottom", () => {
      const r = computePosition(
        input({
          anchor: { x: 400, y: 720, width: 100, height: 40 },
          placement: "auto",
        }),
      );
      expect(r.side).to.equal("top");
    });

    it("picks right when horizontal space dominates", () => {
      // anchor centered vertically, hugging the left => right wins
      const r = computePosition(
        input({
          viewport: { x: 0, y: 0, width: 1000, height: 200 },
          anchor: { x: 20, y: 80, width: 40, height: 40 },
          placement: "auto",
        }),
      );
      expect(r.side).to.equal("right");
    });
  });

  describe("arrow", () => {
    const arrow = { size: 10, boundaryOffset: 6 };

    it("centers the arrow on the anchor for center align (bottom)", () => {
      const r = computePosition(input({ arrow }));
      expect(r.arrow).to.not.equal(null);
      // anchor center x = 450; arrow x is relative to floating left (350)
      // arrow center should sit under anchor center => 450 - 350 - size/2 = 95
      expect(r.arrow!.x).to.equal(95);
      expect(r.arrow!.hidden).to.equal(false);
    });

    it("keeps arrow on the cross axis for left/right placements", () => {
      const r = computePosition(input({ placement: "right-center", arrow }));
      // anchor center y = 420; floating top = 380 => 420 - 380 - 5 = 35
      expect(r.arrow!.y).to.equal(35);
      expect(r.arrow!.hidden).to.equal(false);
    });

    it("hides the arrow when shift moves the surface past the anchor span", () => {
      // anchor very small + far right so shift pushes the surface far from anchor center
      const r = computePosition(
        input({
          anchor: { x: 990, y: 400, width: 10, height: 40 },
          floating: { width: 300, height: 80 },
          placement: "bottom-center",
          arrow,
        }),
      );
      expect(r.arrow!.hidden).to.equal(true);
    });

    it("clamps the arrow within boundaryOffset and keeps it visible while it overlaps the anchor", () => {
      // moderate shift: arrow should be clamped but still within the anchor span
      const r = computePosition(
        input({
          anchor: { x: 900, y: 400, width: 100, height: 40 },
          floating: { width: 200, height: 80 },
          placement: "bottom-center",
          arrow,
        }),
      );
      expect(r.arrow!.hidden).to.equal(false);
      // arrow center stays within [boundaryOffset, floating.width - boundaryOffset - size]
      expect(r.arrow!.x).to.be.at.least(arrow.boundaryOffset);
      expect(r.arrow!.x).to.be.at.most(200 - arrow.boundaryOffset - arrow.size);
    });

    it("returns null arrow when arrow input is null", () => {
      const r = computePosition(input({ arrow: null }));
      expect(r.arrow).to.equal(null);
    });
  });
});
