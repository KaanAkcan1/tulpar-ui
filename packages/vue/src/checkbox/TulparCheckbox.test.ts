import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparCheckbox from "./TulparCheckbox.vue";

describe("TulparCheckbox (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/checkbox");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparCheckbox).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparCheckbox);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-checkbox element", () => {
    const wrapper = mount(TulparCheckbox);
    expect(wrapper.find("tulpar-checkbox").exists()).toBe(true);
  });

  it("default modelValue=false: no checked attribute", () => {
    const wrapper = mount(TulparCheckbox);
    const inner = wrapper.find("tulpar-checkbox");
    expect(inner.attributes("checked")).toBeUndefined();
  });

  it("modelValue=true sets checked attribute", () => {
    const wrapper = mount(TulparCheckbox, { props: { modelValue: true } });
    const inner = wrapper.find("tulpar-checkbox");
    expect(inner.attributes("checked")).toBeTruthy();
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparCheckbox, { props: { label: "Accept terms" } });
    const inner = wrapper.find("tulpar-checkbox");
    expect(inner.attributes("label")).toBe("Accept terms");
  });

  it("forwards indeterminate prop", () => {
    const wrapper = mount(TulparCheckbox, { props: { indeterminate: true } });
    const inner = wrapper.find("tulpar-checkbox");
    expect(inner.attributes("indeterminate")).toBeTruthy();
  });

  it("forwards variant prop", () => {
    const wrapper = mount(TulparCheckbox, { props: { variant: "card" } });
    const inner = wrapper.find("tulpar-checkbox");
    expect(inner.attributes("variant")).toBe("card");
  });

  it("v-model: emits update:modelValue with el.checked on change", async () => {
    const wrapper = mount(TulparCheckbox, { props: { modelValue: false } });
    const inner = wrapper.find("tulpar-checkbox");
    const el = inner.element as HTMLElement & { checked: boolean };
    el.checked = true;
    await inner.trigger("change");
    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([true]);
  });

  it("emits change event on core change", async () => {
    const wrapper = mount(TulparCheckbox, { props: { modelValue: false } });
    const inner = wrapper.find("tulpar-checkbox");
    await inner.trigger("change");
    expect(wrapper.emitted("change")).toBeTruthy();
  });
});
