import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparRadioGroup from "./TulparRadioGroup.vue";

describe("TulparRadioGroup (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/radio-group");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparRadioGroup).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparRadioGroup);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-radio-group element", () => {
    const wrapper = mount(TulparRadioGroup);
    expect(wrapper.find("tulpar-radio-group").exists()).toBe(true);
  });

  it("default modelValue=null: no value attribute", () => {
    const wrapper = mount(TulparRadioGroup);
    const inner = wrapper.find("tulpar-radio-group");
    expect(inner.attributes("value")).toBeUndefined();
  });

  it("modelValue='a' sets value attribute", () => {
    const wrapper = mount(TulparRadioGroup, { props: { modelValue: "a" } });
    const inner = wrapper.find("tulpar-radio-group");
    expect(inner.attributes("value")).toBe("a");
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparRadioGroup, { props: { label: "Choose one" } });
    const inner = wrapper.find("tulpar-radio-group");
    expect(inner.attributes("label")).toBe("Choose one");
  });

  it("forwards orientation prop", () => {
    const wrapper = mount(TulparRadioGroup, { props: { orientation: "horizontal" } });
    const inner = wrapper.find("tulpar-radio-group");
    expect(inner.attributes("orientation")).toBe("horizontal");
  });

  it("forwards disabled prop", () => {
    const wrapper = mount(TulparRadioGroup, { props: { disabled: true } });
    const inner = wrapper.find("tulpar-radio-group");
    expect(inner.attributes("disabled")).toBeTruthy();
  });

  it("projects slot children inside tulpar-radio-group (nesting invariant)", () => {
    const wrapper = mount(TulparRadioGroup, {
      slots: {
        default: '<tulpar-radio value="a"></tulpar-radio><tulpar-radio value="b"></tulpar-radio>',
      },
    });
    const group = wrapper.find("tulpar-radio-group");
    // Children must be descendants of the core group element
    expect(group.findAll("tulpar-radio").length).toBe(2);
  });

  it("v-model: emits update:modelValue from composed change CustomEvent detail.value", async () => {
    const wrapper = mount(TulparRadioGroup, { props: { modelValue: null } });
    const inner = wrapper.find("tulpar-radio-group");
    inner.element.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "b" },
        bubbles: true,
        composed: true,
      }),
    );
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(["b"]);
  });

  it("emits change event on core CustomEvent change", async () => {
    const wrapper = mount(TulparRadioGroup, { props: { modelValue: null } });
    const inner = wrapper.find("tulpar-radio-group");
    inner.element.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "a" },
        bubbles: true,
        composed: true,
      }),
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("change")).toBeTruthy();
  });
});
