import { expect } from "@open-wc/testing";
import {
  getOverlayRoot,
  pushOverlay,
  popOverlay,
  topOverlay,
  __resetOverlayRootForTest,
} from "./overlay-root";

function nextMicrotask(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("overlay-root", () => {
  afterEach(() => {
    __resetOverlayRootForTest();
    document.documentElement.classList.remove("dark");
    document.documentElement.removeAttribute("data-brand");
  });

  describe("getOverlayRoot", () => {
    it("creates a single root appended to body and reuses it", () => {
      const a = getOverlayRoot();
      const b = getOverlayRoot();
      expect(a).to.equal(b);
      expect(a.parentElement).to.equal(document.body);
      expect(a.hasAttribute("data-tulpar-overlay-root")).to.equal(true);
      expect(document.querySelectorAll("[data-tulpar-overlay-root]").length).to.equal(1);
    });

    it("mirrors the `dark` class from documentElement onto the root", async () => {
      const root = getOverlayRoot();
      expect(root.classList.contains("dark")).to.equal(false);
      document.documentElement.classList.add("dark");
      await nextMicrotask();
      expect(root.classList.contains("dark")).to.equal(true);
      document.documentElement.classList.remove("dark");
      await nextMicrotask();
      expect(root.classList.contains("dark")).to.equal(false);
    });

    it("mirrors the data-brand attribute from documentElement onto the root", async () => {
      const root = getOverlayRoot();
      document.documentElement.setAttribute("data-brand", "tulpar");
      await nextMicrotask();
      expect(root.getAttribute("data-brand")).to.equal("tulpar");
    });

    it("reflects the initial dark/brand state at creation time", () => {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-brand", "tulpar");
      const root = getOverlayRoot();
      expect(root.classList.contains("dark")).to.equal(true);
      expect(root.getAttribute("data-brand")).to.equal("tulpar");
    });
  });

  describe("stack manager", () => {
    it("tracks the top overlay across push/pop", () => {
      const a = document.createElement("div");
      const b = document.createElement("div");
      expect(topOverlay()).to.equal(null);
      pushOverlay(a, () => {});
      expect(topOverlay()).to.equal(a);
      pushOverlay(b, () => {});
      expect(topOverlay()).to.equal(b);
      popOverlay(b);
      expect(topOverlay()).to.equal(a);
      popOverlay(a);
      expect(topOverlay()).to.equal(null);
    });

    it("Escape closes only the top overlay", () => {
      const a = document.createElement("div");
      const b = document.createElement("div");
      let aClosed = 0;
      let bClosed = 0;
      pushOverlay(a, () => {
        aClosed += 1;
      });
      pushOverlay(b, () => {
        bClosed += 1;
      });

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      expect(bClosed).to.equal(1);
      expect(aClosed).to.equal(0);

      // After the close callback runs, the element is expected to pop itself.
      popOverlay(b);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      expect(aClosed).to.equal(1);
      expect(bClosed).to.equal(1);

      popOverlay(a);
    });

    it("ignores non-Escape keys", () => {
      const a = document.createElement("div");
      let closed = 0;
      pushOverlay(a, () => {
        closed += 1;
      });
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      expect(closed).to.equal(0);
      popOverlay(a);
    });

    it("popOverlay is a no-op for an element not on the stack", () => {
      const a = document.createElement("div");
      expect(() => popOverlay(a)).to.not.throw();
      expect(topOverlay()).to.equal(null);
    });
  });
});
