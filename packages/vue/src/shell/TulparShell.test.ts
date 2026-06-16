import { describe, it, expect, beforeAll } from "vitest";
import { defineComponent, h, markRaw } from "vue";
import { mount } from "@vue/test-utils";
import TulparShell from "./TulparShell.vue";
import TulparTopbar from "./TulparTopbar.vue";
import TulparSidenav, { type TulparNavItemVueData } from "./TulparSidenav.vue";
import TulparNavItem from "./TulparNavItem.vue";
import TulparNavSection from "./TulparNavSection.vue";
import type { TulparNavItemData } from "@tulpar-ui/shell";

const IconStub = markRaw(
  defineComponent({
    name: "IconStub",
    setup: () => () => h("svg", { "data-test-icon": "" }),
  }),
);

describe("shell family Vue wrappers", () => {
  beforeAll(async () => {
    await import("@tulpar-ui/shell");
  });

  it("all five SFCs are defined", () => {
    expect(TulparShell).toBeDefined();
    expect(TulparTopbar).toBeDefined();
    expect(TulparSidenav).toBeDefined();
    expect(TulparNavItem).toBeDefined();
    expect(TulparNavSection).toBeDefined();
  });

  // The component reads $router off the app context — a router-less mount must
  // still succeed (no crash, native <a> fallback). This is the core "vue-router
  // is optional" guarantee.
  it("TulparShell mounts WITHOUT vue-router installed", () => {
    const wrapper = mount(TulparShell, {
      props: { sidenavMode: "static", contentPadding: "comfortable" },
      slots: { default: "<p>Content</p>" },
    });
    expect(wrapper.exists()).toBe(true);
    const inner = wrapper.find("tulpar-shell");
    expect(inner.exists()).toBe(true);
    expect(inner.attributes("sidenav-mode")).toBe("static");
  });

  it("TulparShell forwards content-width and content-padding props", () => {
    const wrapper = mount(TulparShell, {
      props: { contentWidth: "fixed", contentPadding: "compact" },
    });
    const inner = wrapper.find("tulpar-shell");
    expect(inner.attributes("content-width")).toBe("fixed");
    expect(inner.attributes("content-padding")).toBe("compact");
  });

  it("TulparShell emits update:asideOpen on tulpar-aside-close (v-model:aside-open)", async () => {
    const wrapper = mount(TulparShell);
    wrapper
      .find("tulpar-shell")
      .element.dispatchEvent(new CustomEvent("tulpar-aside-close", { bubbles: true }));
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted("update:asideOpen");
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual([false]);
  });

  it("TulparShell sets dark as a DOM property on the element", async () => {
    const wrapper = mount(TulparShell, { props: { dark: true } });
    await wrapper.vm.$nextTick();
    const inner = wrapper.find("tulpar-shell").element as HTMLElement & { dark?: boolean };
    expect(inner.dark).toBe(true);
  });

  it("TulparTopbar forwards show-menu-button", () => {
    const wrapper = mount(TulparTopbar, { props: { showMenuButton: true } });
    const inner = wrapper.find("tulpar-topbar");
    expect(inner.exists()).toBe(true);
    expect(inner.attributes("show-menu-button")).toBeDefined();
  });

  it("TulparSidenav sets items as a DOM property (not a stringified attribute)", async () => {
    const menu: TulparNavItemData[] = [
      { label: "Dashboard", href: "/" },
      { label: "Settings", href: "/settings" },
    ];
    const wrapper = mount(TulparSidenav, { props: { items: menu } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-sidenav").element as HTMLElement & {
      items?: TulparNavItemData[];
    };
    // It must be the actual array, not a string serialization.
    expect(Array.isArray(el.items)).toBe(true);
    expect(el.items).toEqual(menu);
    expect(el.getAttribute("items")).toBeNull();
  });

  it("TulparNavItem forwards href + label", () => {
    const wrapper = mount(TulparNavItem, { props: { href: "/x", label: "X" } });
    const inner = wrapper.find("tulpar-nav-item");
    expect(inner.attributes("href")).toBe("/x");
    expect(inner.attributes("label")).toBe("X");
  });

  it("TulparNavItem forwards count/dot/dot-label/kbd", () => {
    const wrapper = mount(TulparNavItem, {
      props: { label: "Inbox", count: "12", dot: true, dotLabel: "new", kbd: "g i" },
    });
    const inner = wrapper.find("tulpar-nav-item");
    expect(inner.attributes("count")).toBe("12");
    expect(inner.attributes("dot-label")).toBe("new");
    expect(inner.attributes("kbd")).toBe("g i");
    expect(inner.attributes("dot")).toBeDefined();
  });

  it("TulparSidenav defaults position/density and omits single-expand", () => {
    const wrapper = mount(TulparSidenav);
    const inner = wrapper.find("tulpar-sidenav");
    expect(inner.attributes("position")).toBe("left");
    expect(inner.attributes("density")).toBe("comfortable");
    expect(inner.attributes("single-expand")).toBeUndefined();
  });

  it("TulparSidenav forwards position/density/single-expand", () => {
    const wrapper = mount(TulparSidenav, {
      props: { position: "right", density: "compact", singleExpand: true },
    });
    const inner = wrapper.find("tulpar-sidenav");
    expect(inner.attributes("position")).toBe("right");
    expect(inner.attributes("density")).toBe("compact");
    expect(inner.attributes("single-expand")).toBeDefined();
  });

  it("TulparNavSection forwards label", () => {
    const wrapper = mount(TulparNavSection, { props: { label: "Main" } });
    const inner = wrapper.find("tulpar-nav-section");
    expect(inner.exists()).toBe(true);
    expect(inner.attributes("label")).toBe("Main");
  });

  it("TulparShell forwards sidenav-layout (default under-topbar)", () => {
    const def = mount(TulparShell);
    expect(def.find("tulpar-shell").attributes("sidenav-layout")).toBe("under-topbar");
    const over = mount(TulparShell, { props: { sidenavLayout: "over-topbar" } });
    expect(over.find("tulpar-shell").attributes("sidenav-layout")).toBe("over-topbar");
  });

  it("TulparNavItem forwards icon (SVG string)", () => {
    const wrapper = mount(TulparNavItem, { props: { label: "X", icon: "<svg></svg>" } });
    expect(wrapper.find("tulpar-nav-item").attributes("icon")).toBe("<svg></svg>");
  });

  it("TulparSidenav defaults v2 utility/account bool props on", () => {
    const wrapper = mount(TulparSidenav);
    const inner = wrapper.find("tulpar-sidenav");
    expect(inner.attributes("show-mode-selection")).toBeDefined();
    expect(inner.attributes("show-account-block")).toBeDefined();
    expect(inner.attributes("show-logout")).toBeDefined();
    // opt-in defaults off
    expect(inner.attributes("show-config")).toBeUndefined();
    expect(inner.attributes("show-settings")).toBeUndefined();
  });

  it("TulparSidenav forwards account/utility props", () => {
    const wrapper = mount(TulparSidenav, {
      props: { showConfig: true, userName: "Ada", userRole: "Engineer", logoutLabel: "Sign out" },
    });
    const inner = wrapper.find("tulpar-sidenav");
    expect(inner.attributes("show-config")).toBeDefined();
    expect(inner.attributes("user-name")).toBe("Ada");
    expect(inner.attributes("user-role")).toBe("Engineer");
    expect(inner.attributes("logout-label")).toBe("Sign out");
  });

  it("TulparSidenav emits config/settings/logout on the corresponding element events", async () => {
    const wrapper = mount(TulparSidenav);
    const el = wrapper.find("tulpar-sidenav").element;
    el.dispatchEvent(new CustomEvent("tulpar-config-click", { bubbles: true }));
    el.dispatchEvent(new CustomEvent("tulpar-settings-click", { bubbles: true }));
    el.dispatchEvent(new CustomEvent("tulpar-logout", { bubbles: true }));
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("config")).toBeTruthy();
    expect(wrapper.emitted("settings")).toBeTruthy();
    expect(wrapper.emitted("logout")).toBeTruthy();
  });

  it("TulparSidenav delegates string-icon items to the web component property", async () => {
    const items: TulparNavItemVueData[] = [{ label: "Home", href: "/", icon: "<svg></svg>" }];
    const wrapper = mount(TulparSidenav, { props: { items } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-sidenav").element as HTMLElement & {
      items?: TulparNavItemVueData[];
    };
    expect(Array.isArray(el.items)).toBe(true);
    expect(el.items?.length).toBe(1);
    // No light-DOM nav-item rendered by the wrapper.
    expect(wrapper.find("tulpar-nav-item").exists()).toBe(false);
  });

  it("TulparSidenav renders component-icon items in light DOM with slot=icon", async () => {
    const items: TulparNavItemVueData[] = [{ label: "Home", href: "/", icon: IconStub }];
    const wrapper = mount(TulparSidenav, { props: { items } });
    await wrapper.vm.$nextTick();
    const el = wrapper.find("tulpar-sidenav").element as HTMLElement & {
      items?: TulparNavItemVueData[];
    };
    // Wrapper must NOT also set the items property (avoid double render).
    expect(el.items).toBeUndefined();
    const projected = wrapper.find("tulpar-nav-item [slot='icon'] [data-test-icon]");
    expect(projected.exists()).toBe(true);
  });
});
