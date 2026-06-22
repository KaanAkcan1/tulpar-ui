import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparSkeleton from "./TulparSkeleton.vue";

describe("TulparSkeleton (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/skeleton");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparSkeleton).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparSkeleton);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-skeleton element", () => {
    const wrapper = mount(TulparSkeleton);
    expect(wrapper.find("tulpar-skeleton").exists()).toBe(true);
  });

  it("forwards variant prop", () => {
    const wrapper = mount(TulparSkeleton, { props: { variant: "circle" } });
    expect(wrapper.find("tulpar-skeleton").attributes("variant")).toBe("circle");
  });

  it("forwards lines as a DOM property", async () => {
    const wrapper = mount(TulparSkeleton, { props: { lines: 3 } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-skeleton").element as HTMLElement & { lines?: number };
    expect(el.lines).toBe(3);
  });

  it("omitting lines leaves the core default intact (no clobber)", async () => {
    // Binding :lines="undefined" would overwrite the core default (lines=1) and
    // collapse the text variant to zero bars. The wrapper sets lines only when
    // provided, so the default survives.
    const wrapper = mount(TulparSkeleton, { props: { variant: "text" } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-skeleton").element as HTMLElement & { lines?: number };
    expect(el.lines).toBe(1);
  });

  it("forwards width + height + animation props", () => {
    const wrapper = mount(TulparSkeleton, {
      props: { width: "120px", height: "16px", animation: "pulse" },
    });
    const inner = wrapper.find("tulpar-skeleton");
    expect(inner.attributes("width")).toBe("120px");
    expect(inner.attributes("height")).toBe("16px");
    expect(inner.attributes("animation")).toBe("pulse");
  });
});
