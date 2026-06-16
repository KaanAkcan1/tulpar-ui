import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparShellComponent } from "./tulpar-shell.component";
import { TulparTopbarComponent } from "./tulpar-topbar.component";
import {
  TulparSidenavComponent,
  type TulparNavItemNgData,
} from "./tulpar-sidenav.component";
import { TulparNavItemComponent } from "./tulpar-nav-item.component";
import { TulparNavSectionComponent } from "./tulpar-nav-section.component";

@Component({ standalone: true, template: `<svg data-test-icon></svg>` })
class IconStub {}

@Component({
  standalone: true,
  imports: [
    TulparShellComponent,
    TulparTopbarComponent,
    TulparSidenavComponent,
    TulparNavItemComponent,
    TulparNavSectionComponent,
  ],
  template: `
    <tulpar-shell-ng
      [persistKey]="persistKey()"
      [(asideOpen)]="asideOpen"
      [sidenavLayout]="sidenavLayout()"
    >
      <tulpar-topbar-ng slot="topbar" [showMenuButton]="true"></tulpar-topbar-ng>
      <tulpar-sidenav-ng
        slot="sidenav"
        [position]="position()"
        [density]="density()"
        [singleExpand]="singleExpand()"
        [showConfig]="showConfig()"
        [userName]="userName()"
        (config)="configFired = configFired + 1"
        (settings)="settingsFired = settingsFired + 1"
        (logout)="logoutFired = logoutFired + 1"
      >
        <tulpar-nav-section-ng label="Main">
          <tulpar-nav-item-ng label="Home"></tulpar-nav-item-ng>
        </tulpar-nav-section-ng>
      </tulpar-sidenav-ng>
    </tulpar-shell-ng>
  `,
})
class Host {
  persistKey = signal<string | undefined>(undefined);
  asideOpen = signal(false);
  position = signal<"left" | "right">("left");
  density = signal<"comfortable" | "compact">("comfortable");
  singleExpand = signal(false);
  sidenavLayout = signal<"under-topbar" | "over-topbar">("under-topbar");
  showConfig = signal(false);
  userName = signal<string | undefined>(undefined);
  configFired = 0;
  settingsFired = 0;
  logoutFired = 0;
}

describe("Shell family wrappers (smoke)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("exports all five standalone wrapper classes", () => {
    expect(TulparShellComponent).toBeDefined();
    expect(TulparTopbarComponent).toBeDefined();
    expect(TulparSidenavComponent).toBeDefined();
    expect(TulparNavItemComponent).toBeDefined();
    expect(TulparNavSectionComponent).toBeDefined();
  });

  it("renders the underlying shell web components", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector("tulpar-shell")).toBeTruthy();
    expect(root.querySelector("tulpar-topbar")).toBeTruthy();
    expect(root.querySelector("tulpar-sidenav")).toBeTruthy();
    expect(root.querySelector("tulpar-nav-item")).toBeTruthy();
    expect(root.querySelector("tulpar-nav-section")).toBeTruthy();
  });

  it("sidenav wrapper defaults position/density/single-expand", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-sidenav") as HTMLElement;
    expect(inner.getAttribute("position")).toBe("left");
    expect(inner.getAttribute("density")).toBe("comfortable");
    expect(inner.hasAttribute("single-expand")).toBe(false);
  });

  it("sidenav wrapper forwards position/density/single-expand", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.position.set("right");
    fixture.componentInstance.density.set("compact");
    fixture.componentInstance.singleExpand.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-sidenav") as HTMLElement;
    expect(inner.getAttribute("position")).toBe("right");
    expect(inner.getAttribute("density")).toBe("compact");
    expect(inner.hasAttribute("single-expand")).toBe(true);
  });

  it("nav-section wrapper forwards label", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-nav-section") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Main");
  });

  it("supports two-way asideOpen and reflects it to the inner element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.asideOpen.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-shell") as HTMLElement;
    expect(inner.hasAttribute("aside-open")).toBe(true);
  });

  it("shell wrapper defaults + forwards sidenav-layout", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const shell = fixture.nativeElement.querySelector("tulpar-shell") as HTMLElement;
    expect(shell.getAttribute("sidenav-layout")).toBe("under-topbar");
    fixture.componentInstance.sidenavLayout.set("over-topbar");
    fixture.detectChanges();
    expect(shell.getAttribute("sidenav-layout")).toBe("over-topbar");
  });

  it("sidenav wrapper has sensible defaults for v2 utility/account inputs", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-sidenav") as HTMLElement;
    // show-mode-selection (default true) + show-logout (default true) + account block (default true)
    expect(inner.hasAttribute("show-mode-selection")).toBe(true);
    expect(inner.hasAttribute("show-account-block")).toBe(true);
    expect(inner.hasAttribute("show-logout")).toBe(true);
    // opt-in defaults are off
    expect(inner.hasAttribute("show-config")).toBe(false);
    expect(inner.hasAttribute("show-settings")).toBe(false);
  });

  it("sidenav wrapper forwards account/utility string + bool inputs", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.showConfig.set(true);
    fixture.componentInstance.userName.set("Ada Lovelace");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-sidenav") as HTMLElement;
    expect(inner.hasAttribute("show-config")).toBe(true);
    expect(inner.getAttribute("user-name")).toBe("Ada Lovelace");
  });

  it("sidenav outputs fire on tulpar-config-click / -settings-click / -logout", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-sidenav") as HTMLElement;
    inner.dispatchEvent(new CustomEvent("tulpar-config-click", { bubbles: true }));
    inner.dispatchEvent(new CustomEvent("tulpar-settings-click", { bubbles: true }));
    inner.dispatchEvent(new CustomEvent("tulpar-logout", { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.configFired).toBe(1);
    expect(fixture.componentInstance.settingsFired).toBe(1);
    expect(fixture.componentInstance.logoutFired).toBe(1);
  });
});

@Component({
  standalone: true,
  imports: [TulparSidenavComponent],
  template: `<tulpar-sidenav-ng [items]="items()"></tulpar-sidenav-ng>`,
})
class ItemsHost {
  items = signal<TulparNavItemNgData[] | undefined>(undefined);
}

describe("Sidenav data-driven items (smoke)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ItemsHost] });
  });

  it("string-icon items are delegated to the web component via the items property", () => {
    const fixture = TestBed.createComponent(ItemsHost);
    fixture.componentInstance.items.set([{ label: "Home", href: "/", icon: "<svg></svg>" }]);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-sidenav") as HTMLElement & {
      items?: unknown[];
    };
    expect(Array.isArray(inner.items)).toBe(true);
    expect(inner.items?.length).toBe(1);
    // No light-DOM nav-item rendered by the wrapper.
    expect(fixture.nativeElement.querySelector("tulpar-nav-item-ng")).toBeNull();
  });

  it("component-icon items are rendered in light DOM and projected into slot=icon", () => {
    const fixture = TestBed.createComponent(ItemsHost);
    fixture.componentInstance.items.set([{ label: "Home", href: "/", icon: IconStub }]);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-sidenav") as HTMLElement & {
      items?: unknown[];
    };
    // Wrapper must NOT also set the items property (avoid double render).
    expect(inner.items).toBeUndefined();
    const projected = fixture.nativeElement.querySelector(
      "tulpar-nav-item [slot='icon'] [data-test-icon]",
    );
    expect(projected).toBeTruthy();
  });
});
