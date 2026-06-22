import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparBadge from "./TulparBadge.vue";

describe("TulparBadge (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/badge");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparBadge).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparBadge);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-badge element", () => {
    const wrapper = mount(TulparBadge);
    expect(wrapper.find("tulpar-badge").exists()).toBe(true);
  });

  it("forwards count as a DOM property", async () => {
    const wrapper = mount(TulparBadge, { props: { count: 5 } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-badge").element as HTMLElement & { count?: number };
    expect(el.count).toBe(5);
  });

  it("forwards tone prop", () => {
    const wrapper = mount(TulparBadge, { props: { tone: "danger" } });
    expect(wrapper.find("tulpar-badge").attributes("tone")).toBe("danger");
  });

  it("forwards max as a DOM property", async () => {
    const wrapper = mount(TulparBadge, { props: { max: 9 } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-badge").element as HTMLElement & { max?: number };
    expect(el.max).toBe(9);
  });

  it("omitting max leaves the core default intact (count not capped at 0+)", async () => {
    // Binding :max="undefined" would overwrite the core default (max=99) with
    // undefined → every count renders as "0+". The wrapper sets max only when
    // provided, so the default survives.
    const wrapper = mount(TulparBadge, { props: { count: 5 } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-badge").element as HTMLElement & { max?: number };
    expect(el.max).toBe(99);
  });

  it("default showZero=false: no show-zero attribute", () => {
    const wrapper = mount(TulparBadge);
    expect(wrapper.find("tulpar-badge").attributes("show-zero")).toBeUndefined();
  });

  it("showZero=true sets show-zero attribute", () => {
    const wrapper = mount(TulparBadge, { props: { showZero: true } });
    expect(wrapper.find("tulpar-badge").attributes("show-zero")).toBeTruthy();
  });

  it("dot=true sets dot attribute", () => {
    const wrapper = mount(TulparBadge, { props: { dot: true } });
    expect(wrapper.find("tulpar-badge").attributes("dot")).toBeTruthy();
  });
});
