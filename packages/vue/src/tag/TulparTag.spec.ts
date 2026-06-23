import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparTag from "./TulparTag.vue";

describe("TulparTag (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/tag");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparTag).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparTag);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-tag element", () => {
    const wrapper = mount(TulparTag);
    expect(wrapper.find("tulpar-tag").exists()).toBe(true);
  });

  it("forwards tone prop", () => {
    const wrapper = mount(TulparTag, { props: { tone: "success" } });
    expect(wrapper.find("tulpar-tag").attributes("tone")).toBe("success");
  });

  it("forwards label prop", () => {
    const wrapper = mount(TulparTag, { props: { label: "Active" } });
    expect(wrapper.find("tulpar-tag").attributes("label")).toBe("Active");
  });

  it("forwards size + variant props", () => {
    const wrapper = mount(TulparTag, { props: { size: "lg", variant: "outline" } });
    const inner = wrapper.find("tulpar-tag");
    expect(inner.attributes("size")).toBe("lg");
    expect(inner.attributes("variant")).toBe("outline");
  });

  it("default dot=false: no dot attribute", () => {
    const wrapper = mount(TulparTag);
    expect(wrapper.find("tulpar-tag").attributes("dot")).toBeUndefined();
  });

  it("dot=true sets dot attribute", () => {
    const wrapper = mount(TulparTag, { props: { dot: true } });
    expect(wrapper.find("tulpar-tag").attributes("dot")).toBeTruthy();
  });

  it("renders default slot content", () => {
    const wrapper = mount(TulparTag, { slots: { default: "Hello" } });
    expect(wrapper.text()).toContain("Hello");
  });

  it("forwards the icon named slot through a carrier with slot attr", () => {
    const wrapper = mount(TulparTag, { slots: { icon: "<svg></svg>" } });
    const carrier = wrapper.find('[slot="icon"]');
    expect(carrier.exists()).toBe(true);
  });
});
