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

  it("forwards lines prop", () => {
    const wrapper = mount(TulparSkeleton, { props: { lines: 3 } });
    expect(wrapper.find("tulpar-skeleton").attributes("lines")).toBe("3");
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
