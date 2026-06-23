import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparProgress from "./TulparProgress.vue";

describe("TulparProgress (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/progress");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparProgress).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparProgress);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-progress element", () => {
    const wrapper = mount(TulparProgress);
    expect(wrapper.find("tulpar-progress").exists()).toBe(true);
  });

  it("forwards value as a DOM property", async () => {
    const wrapper = mount(TulparProgress, { props: { value: 42 } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-progress").element as HTMLElement & { value?: number };
    expect(el.value).toBe(42);
  });

  it("omitting min/max leaves the core defaults intact (no clobber)", async () => {
    // Binding :max="undefined" in the template would overwrite the core default
    // (max=100) with undefined and collapse value→percent math. The wrapper sets
    // numeric props only when provided, so the defaults survive.
    const wrapper = mount(TulparProgress, { props: { value: 60 } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-progress").element as HTMLElement & {
      value?: number;
      min?: number;
      max?: number;
    };
    expect(el.value).toBe(60);
    expect(el.min).toBe(0);
    expect(el.max).toBe(100);
  });

  it("forwards variant prop", () => {
    const wrapper = mount(TulparProgress, { props: { variant: "circular" } });
    expect(wrapper.find("tulpar-progress").attributes("variant")).toBe("circular");
  });

  it("indeterminate=true sets the indeterminate attribute", () => {
    const wrapper = mount(TulparProgress, { props: { indeterminate: true } });
    expect(wrapper.find("tulpar-progress").attributes("indeterminate")).toBeTruthy();
  });

  it('forwards tone="flow" as an attribute', () => {
    const wrapper = mount(TulparProgress, { props: { tone: "flow", value: 40 } });
    expect(wrapper.find("tulpar-progress").attributes("tone")).toBe("flow");
  });

  it("forwards the xs and xl sizes as attributes", () => {
    const xs = mount(TulparProgress, { props: { variant: "circular", size: "xs" } });
    expect(xs.find("tulpar-progress").attributes("size")).toBe("xs");
    const xl = mount(TulparProgress, { props: { variant: "circular", size: "xl" } });
    expect(xl.find("tulpar-progress").attributes("size")).toBe("xl");
  });

  it("stateTone=true sets the state-tone attribute", () => {
    const wrapper = mount(TulparProgress, { props: { stateTone: true } });
    expect(wrapper.find("tulpar-progress").attributes("state-tone")).toBeTruthy();
  });

  it("sets valueLabel as a DOM property (not an attribute)", async () => {
    const wrapper = mount(TulparProgress, { props: { valueLabel: true } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-progress").element as HTMLElement & {
      valueLabel?: boolean | ((v: number, min: number, max: number) => string);
    };
    expect(el.valueLabel).toBe(true);
    // Never serialised as an attribute.
    expect(el.getAttribute("valuelabel")).toBeNull();
    expect(el.getAttribute("value-label")).toBeNull();
  });

  it("sets a valueLabel formatter function as a DOM property", async () => {
    const fmt = (v: number) => `${v} pts`;
    const wrapper = mount(TulparProgress, { props: { valueLabel: fmt } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-progress").element as HTMLElement & {
      valueLabel?: boolean | ((v: number, min: number, max: number) => string);
    };
    expect(el.valueLabel).toBe(fmt);
  });
});
