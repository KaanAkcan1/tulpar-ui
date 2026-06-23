import { fixture, html, expect } from "@open-wc/testing";
import "./tulpar-skeleton";
import type { TulparSkeleton } from "./tulpar-skeleton";
import { skeletonStyles } from "./tulpar-skeleton.styles";

function bars(el: TulparSkeleton): HTMLElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll(".bar"));
}

describe("public type exports", () => {
  it("re-exports TulparSkeleton from index", async () => {
    const mod = await import("./index");
    expect(mod.TulparSkeleton).to.exist;
  });
  it("re-exports TulparSkeleton from core index", async () => {
    const mod = await import("../index");
    expect((mod as Record<string, unknown>).TulparSkeleton).to.exist;
  });
});

describe("<tulpar-skeleton>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("tulpar-skeleton")).to.exist;
  });

  it("defaults to text / shimmer / 1 line", async () => {
    const el = await fixture<TulparSkeleton>(html`<tulpar-skeleton></tulpar-skeleton>`);
    expect(el.variant).to.equal("text");
    expect(el.animation).to.equal("shimmer");
    expect(el.lines).to.equal(1);
    expect(el.getAttribute("variant")).to.equal("text");
    expect(el.getAttribute("animation")).to.equal("shimmer");
  });

  describe("text variant", () => {
    it("lines=3 renders 3 bars", async () => {
      const el = await fixture<TulparSkeleton>(html`<tulpar-skeleton lines="3"></tulpar-skeleton>`);
      await el.updateComplete;
      expect(bars(el).length).to.equal(3);
    });

    it("single line renders one bar", async () => {
      const el = await fixture<TulparSkeleton>(html`<tulpar-skeleton></tulpar-skeleton>`);
      await el.updateComplete;
      expect(bars(el).length).to.equal(1);
    });

    it("multi-line last bar is shortened (~60%)", async () => {
      const el = await fixture<TulparSkeleton>(html`<tulpar-skeleton lines="3"></tulpar-skeleton>`);
      await el.updateComplete;
      const last = bars(el)[2];
      expect(last.getAttribute("style") ?? "").to.contain("width:60%");
    });
  });

  describe("variant shapes", () => {
    it("rect variant renders one bar with 6px radius", async () => {
      const el = await fixture<TulparSkeleton>(
        html`<tulpar-skeleton variant="rect"></tulpar-skeleton>`,
      );
      await el.updateComplete;
      const b = bars(el);
      expect(b.length).to.equal(1);
      expect(getComputedStyle(b[0]).borderTopLeftRadius).to.equal("6px");
    });

    it("circle variant renders a round bar (50% radius)", async () => {
      const el = await fixture<TulparSkeleton>(
        html`<tulpar-skeleton variant="circle"></tulpar-skeleton>`,
      );
      await el.updateComplete;
      const b = bars(el)[0];
      expect(getComputedStyle(b).borderTopLeftRadius).to.equal("50%");
    });
  });

  describe("dimension overrides", () => {
    it("width / height props are applied to the bar", async () => {
      const el = await fixture<TulparSkeleton>(
        html`<tulpar-skeleton variant="rect" width="120px" height="40px"></tulpar-skeleton>`,
      );
      await el.updateComplete;
      const b = bars(el)[0];
      expect(getComputedStyle(b).width).to.equal("120px");
      expect(getComputedStyle(b).height).to.equal("40px");
    });

    it("radius prop overrides the variant radius", async () => {
      const el = await fixture<TulparSkeleton>(
        html`<tulpar-skeleton variant="rect" radius="12px"></tulpar-skeleton>`,
      );
      await el.updateComplete;
      expect(getComputedStyle(bars(el)[0]).borderTopLeftRadius).to.equal("12px");
    });

    it("explicit width on a multi-line text skeleton suppresses the 60% ragged last line", async () => {
      const el = await fixture<TulparSkeleton>(
        html`<tulpar-skeleton lines="3" width="200px"></tulpar-skeleton>`,
      );
      await el.updateComplete;
      const last = bars(el)[2].getAttribute("style") ?? "";
      expect(last).to.contain("width:200px");
      expect(last).to.not.contain("60%");
    });
  });

  describe("animation", () => {
    it('animation="none" removes the animation', async () => {
      const el = await fixture<TulparSkeleton>(
        html`<tulpar-skeleton animation="none"></tulpar-skeleton>`,
      );
      await el.updateComplete;
      expect(getComputedStyle(bars(el)[0]).animationName).to.equal("none");
    });
  });

  describe("accessibility", () => {
    it('sets aria-hidden="true" on the host', async () => {
      const el = await fixture<TulparSkeleton>(html`<tulpar-skeleton></tulpar-skeleton>`);
      expect(el.getAttribute("aria-hidden")).to.equal("true");
    });
  });

  describe("styles", () => {
    it("contains the shimmer @keyframes", () => {
      expect(skeletonStyles.cssText).to.include("@keyframes tulpar-skeleton-shimmer");
      expect(skeletonStyles.cssText).to.include("background-position: left");
    });
    it("contains a prefers-reduced-motion block", () => {
      expect(skeletonStyles.cssText).to.include("prefers-reduced-motion: reduce");
    });
    it("contains a forced-colors block", () => {
      expect(skeletonStyles.cssText).to.include("forced-colors");
    });
  });
});
