import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import TulparAvatar from "./TulparAvatar.vue";

describe("TulparAvatar (Vue)", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/core/avatar");
  });

  it("is defined (exported from SFC)", () => {
    expect(TulparAvatar).toBeDefined();
  });

  it("mounts with defaults", () => {
    const wrapper = mount(TulparAvatar);
    expect(wrapper.exists()).toBe(true);
  });

  it("renders inner tulpar-avatar element", () => {
    const wrapper = mount(TulparAvatar);
    expect(wrapper.find("tulpar-avatar").exists()).toBe(true);
  });

  it("forwards name prop", () => {
    const wrapper = mount(TulparAvatar, { props: { name: "Ada Lovelace" } });
    expect(wrapper.find("tulpar-avatar").attributes("name")).toBe("Ada Lovelace");
  });

  it("forwards src prop", () => {
    const wrapper = mount(TulparAvatar, { props: { src: "/u.png" } });
    expect(wrapper.find("tulpar-avatar").attributes("src")).toBe("/u.png");
  });

  it("forwards initials + size props", () => {
    const wrapper = mount(TulparAvatar, { props: { initials: "AL", size: "lg" } });
    const inner = wrapper.find("tulpar-avatar");
    expect(inner.attributes("initials")).toBe("AL");
    expect(inner.attributes("size")).toBe("lg");
  });
});
