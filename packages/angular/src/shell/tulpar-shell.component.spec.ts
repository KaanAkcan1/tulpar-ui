import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparShellComponent } from "./tulpar-shell.component";
import { TulparTopbarComponent } from "./tulpar-topbar.component";
import { TulparSidenavComponent } from "./tulpar-sidenav.component";
import { TulparNavItemComponent } from "./tulpar-nav-item.component";
import { TulparNavSectionComponent } from "./tulpar-nav-section.component";

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
    <tulpar-shell-ng [persistKey]="persistKey()" [(asideOpen)]="asideOpen">
      <tulpar-topbar-ng slot="topbar" [showMenuButton]="true"></tulpar-topbar-ng>
      <tulpar-sidenav-ng
        slot="sidenav"
        [position]="position()"
        [density]="density()"
        [singleExpand]="singleExpand()"
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
});
