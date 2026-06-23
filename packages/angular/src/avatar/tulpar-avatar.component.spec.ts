import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparAvatarComponent } from "./tulpar-avatar.component";

@Component({
  standalone: true,
  imports: [TulparAvatarComponent],
  template: `
    <tulpar-avatar-ng [name]="name()" [src]="src()" [shape]="shape()"></tulpar-avatar-ng>
  `,
})
class Host {
  name = signal<string | undefined>(undefined);
  src = signal<string | undefined>(undefined);
  shape = signal<"rounded-square" | "circle" | undefined>(undefined);
}

describe("TulparAvatarComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparAvatarComponent).toBeDefined();
  });

  it("renders the inner tulpar-avatar web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-avatar")).toBeTruthy();
  });

  it("forwards name + shape attributes to the core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.name.set("Kaan Akcan");
    fixture.componentInstance.shape.set("circle");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-avatar") as HTMLElement;
    expect(inner.getAttribute("name")).toBe("Kaan Akcan");
    expect(inner.getAttribute("shape")).toBe("circle");
  });
});
