import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparShellComponent } from "./tulpar-shell.component";
import { TulparTopbarComponent } from "./tulpar-topbar.component";
import { TulparSidenavComponent } from "./tulpar-sidenav.component";
import { TulparNavItemComponent } from "./tulpar-nav-item.component";

@Component({
  standalone: true,
  imports: [
    TulparShellComponent,
    TulparTopbarComponent,
    TulparSidenavComponent,
    TulparNavItemComponent,
  ],
  template: `
    <tulpar-shell-ng [persistKey]="persistKey()" [(asideOpen)]="asideOpen">
      <tulpar-topbar-ng slot="topbar" [showMenuButton]="true"></tulpar-topbar-ng>
      <tulpar-sidenav-ng slot="sidenav"></tulpar-sidenav-ng>
      <tulpar-nav-item-ng label="Home"></tulpar-nav-item-ng>
    </tulpar-shell-ng>
  `,
})
class Host {
  persistKey = signal<string | undefined>(undefined);
  asideOpen = signal(false);
}

describe("Shell family wrappers (smoke)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("exports all four standalone wrapper classes", () => {
    expect(TulparShellComponent).toBeDefined();
    expect(TulparTopbarComponent).toBeDefined();
    expect(TulparSidenavComponent).toBeDefined();
    expect(TulparNavItemComponent).toBeDefined();
  });

  it("renders the underlying shell web components", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector("tulpar-shell")).toBeTruthy();
    expect(root.querySelector("tulpar-topbar")).toBeTruthy();
    expect(root.querySelector("tulpar-sidenav")).toBeTruthy();
    expect(root.querySelector("tulpar-nav-item")).toBeTruthy();
  });

  it("supports two-way asideOpen and reflects it to the inner element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.asideOpen.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-shell") as HTMLElement;
    expect(inner.hasAttribute("aside-open")).toBe(true);
  });
});
