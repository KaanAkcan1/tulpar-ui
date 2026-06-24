import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparSelect, { type SelectOptions } from "./TulparSelect.vue";

// Compile-time assertion that the SelectOptions re-export resolves (no runtime cost).
const _optionsTypeCheck: SelectOptions = [{ value: "a", label: "A" }];
void _optionsTypeCheck;

describe("TulparSelect (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/select");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparSelect).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparSelect);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-select element", () => {
    const wrapper = mount(TulparSelect);
    expect(wrapper.find("tulpar-select").exists()).toBe(true);
  });

  it("forwards value prop", () => {
    const wrapper = mount(TulparSelect, { props: { value: "opt-a" } });
    expect(wrapper.find("tulpar-select").attributes("value")).toBe("opt-a");
  });

  it("forwards placeholder prop", () => {
    const wrapper = mount(TulparSelect, { props: { placeholder: "Pick one…" } });
    expect(wrapper.find("tulpar-select").attributes("placeholder")).toBe("Pick one…");
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparSelect, { props: { label: "Country" } });
    expect(wrapper.find("tulpar-select").attributes("label")).toBe("Country");
  });

  it("forwards size + variant props", () => {
    const wrapper = mount(TulparSelect, { props: { size: "lg", variant: "filled" } });
    const inner = wrapper.find("tulpar-select");
    expect(inner.attributes("size")).toBe("lg");
    expect(inner.attributes("variant")).toBe("filled");
  });

  it("clearable=true sets clearable attribute", () => {
    const wrapper = mount(TulparSelect, { props: { clearable: true } });
    expect(wrapper.find("tulpar-select").attributes("clearable")).toBeTruthy();
  });

  it("disabled=true sets disabled attribute", () => {
    const wrapper = mount(TulparSelect, { props: { disabled: true } });
    expect(wrapper.find("tulpar-select").attributes("disabled")).toBeTruthy();
  });

  it("invalid=true sets invalid attribute", () => {
    const wrapper = mount(TulparSelect, { props: { invalid: true } });
    expect(wrapper.find("tulpar-select").attributes("invalid")).toBeTruthy();
  });

  it("noMessageSpace=true sets no-message-space attribute", () => {
    const wrapper = mount(TulparSelect, { props: { noMessageSpace: true } });
    expect(wrapper.find("tulpar-select").attributes("no-message-space")).toBeTruthy();
  });

  it("forwards errorText prop as error-text attribute", () => {
    const wrapper = mount(TulparSelect, { props: { errorText: "Required" } });
    expect(wrapper.find("tulpar-select").attributes("error-text")).toBe("Required");
  });

  it("emits update:value with the detail value on core change event", async () => {
    const wrapper = mount(TulparSelect);
    const inner = wrapper.find("tulpar-select");
    inner.element.dispatchEvent(
      new CustomEvent("change", { detail: { value: "opt-b" }, bubbles: true }),
    );
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted("update:value");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(["opt-b"]);
  });

  it("also emits raw change event on core change", async () => {
    const wrapper = mount(TulparSelect);
    const inner = wrapper.find("tulpar-select");
    const ev = new CustomEvent("change", { detail: { value: "opt-c" }, bubbles: true });
    inner.element.dispatchEvent(ev);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("change")).toBeTruthy();
  });

  it("forwards the label named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparSelect, { slots: { label: "Country" } });
    expect(wrapper.find('[slot="label"]').exists()).toBe(true);
  });

  it("forwards the prefix named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparSelect, { slots: { prefix: "<span>$</span>" } });
    expect(wrapper.find('[slot="prefix"]').exists()).toBe(true);
  });

  it("forwards the suffix named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparSelect, { slots: { suffix: "<span>▼</span>" } });
    expect(wrapper.find('[slot="suffix"]').exists()).toBe(true);
  });

  it("forwards options (property) + searchable to the core element", () => {
    const wrapper = mount(TulparSelect, {
      props: {
        options: [{ value: "a", label: "A" }],
        searchable: true,
        searchPlaceholder: "Find…",
        noMatchText: "None",
      },
    });
    // The SFC's root element IS <tulpar-select>, so use find().element (matching
    // the other tests) rather than querySelector (which only searches descendants).
    const inner = wrapper.find("tulpar-select").element as HTMLElement & {
      options?: unknown;
      searchable?: unknown;
    };
    expect(inner.options).toEqual([{ value: "a", label: "A" }]); // property, not attribute
    // `searchable` lands as a DOM PROPERTY (the core declares it as a reactive
    // property, so Vue binds it as a property — Lit's attribute reflection is async
    // and not observable synchronously in happy-dom).
    expect(inner.searchable).toBe(true);
    expect(inner.getAttribute("search-placeholder")).toBe("Find…");
    expect(inner.getAttribute("no-match-text")).toBe("None");
  });

  it("forwards the no-match named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparSelect, { slots: { "no-match": "<span>Nada</span>" } });
    expect(wrapper.find('[slot="no-match"]').exists()).toBe(true);
  });
});
