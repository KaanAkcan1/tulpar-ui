import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparRadio from "./TulparRadio.vue";

describe("TulparRadio (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/radio");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparRadio).toBeDefined();
  });

  it("mounts with required value prop", () => {
    const wrapper = mount(TulparRadio, { props: { value: "option-a" } });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-radio element", () => {
    const wrapper = mount(TulparRadio, { props: { value: "option-a" } });
    expect(wrapper.find("tulpar-radio").exists()).toBe(true);
  });

  it("forwards value prop", () => {
    const wrapper = mount(TulparRadio, { props: { value: "option-a" } });
    const inner = wrapper.find("tulpar-radio");
    expect(inner.attributes("value")).toBe("option-a");
  });

  it("default modelValue=false: no checked attribute", () => {
    const wrapper = mount(TulparRadio, { props: { value: "option-a" } });
    const inner = wrapper.find("tulpar-radio");
    expect(inner.attributes("checked")).toBeUndefined();
  });

  it("modelValue=true sets checked attribute", () => {
    const wrapper = mount(TulparRadio, {
      props: { value: "option-a", modelValue: true },
    });
    const inner = wrapper.find("tulpar-radio");
    expect(inner.attributes("checked")).toBeTruthy();
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparRadio, {
      props: { value: "option-a", label: "Option A" },
    });
    const inner = wrapper.find("tulpar-radio");
    expect(inner.attributes("label")).toBe("Option A");
  });

  it("forwards variant prop", () => {
    const wrapper = mount(TulparRadio, {
      props: { value: "option-a", variant: "card" },
    });
    const inner = wrapper.find("tulpar-radio");
    expect(inner.attributes("variant")).toBe("card");
  });

  it("v-model: emits update:modelValue with el.checked on change", async () => {
    const wrapper = mount(TulparRadio, { props: { value: "option-a", modelValue: false } });
    const inner = wrapper.find("tulpar-radio");
    const el = inner.element as HTMLElement & { checked: boolean };
    el.checked = true;
    await inner.trigger("change");
    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([true]);
  });
});
