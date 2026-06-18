import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparSwitch from "./TulparSwitch.vue";

describe("TulparSwitch (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/switch");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparSwitch).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparSwitch);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-switch element", () => {
    const wrapper = mount(TulparSwitch);
    expect(wrapper.find("tulpar-switch").exists()).toBe(true);
  });

  it("default modelValue=false: no checked attribute", () => {
    const wrapper = mount(TulparSwitch);
    const inner = wrapper.find("tulpar-switch");
    expect(inner.attributes("checked")).toBeUndefined();
  });

  it("modelValue=true sets checked attribute", () => {
    const wrapper = mount(TulparSwitch, { props: { modelValue: true } });
    const inner = wrapper.find("tulpar-switch");
    // checked=true → :checked="true || undefined" → truthy attr
    expect(inner.attributes("checked")).toBeTruthy();
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparSwitch, { props: { label: "Dark mode" } });
    const inner = wrapper.find("tulpar-switch");
    expect(inner.attributes("label")).toBe("Dark mode");
  });

  it("forwards size prop", () => {
    const wrapper = mount(TulparSwitch, { props: { size: "lg" } });
    const inner = wrapper.find("tulpar-switch");
    expect(inner.attributes("size")).toBe("lg");
  });

  it("forwards disabled prop", () => {
    const wrapper = mount(TulparSwitch, { props: { disabled: true } });
    const inner = wrapper.find("tulpar-switch");
    expect(inner.attributes("disabled")).toBeTruthy();
  });

  it("v-model: emits update:modelValue with el.checked on change", async () => {
    const wrapper = mount(TulparSwitch, { props: { modelValue: false } });
    const inner = wrapper.find("tulpar-switch");
    const el = inner.element as HTMLElement & { checked: boolean };
    el.checked = true;
    await inner.trigger("change");
    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([true]);
  });

  it("emits change event on core change", async () => {
    const wrapper = mount(TulparSwitch, { props: { modelValue: false } });
    const inner = wrapper.find("tulpar-switch");
    await inner.trigger("change");
    expect(wrapper.emitted("change")).toBeTruthy();
  });
});
