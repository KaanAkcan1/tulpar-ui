import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparSkeletonComponent } from "./tulpar-skeleton.component";

@Component({
  standalone: true,
  imports: [TulparSkeletonComponent],
  template: `
    <tulpar-skeleton-ng
      [variant]="variant()"
      [lines]="lines()"
      [width]="width()"
    ></tulpar-skeleton-ng>
  `,
})
class Host {
  variant = signal<"text" | "rect" | "circle" | undefined>(undefined);
  lines = signal<number | undefined>(undefined);
  width = signal<string | undefined>(undefined);
}

describe("TulparSkeletonComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparSkeletonComponent).toBeDefined();
  });

  it("renders the inner tulpar-skeleton web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-skeleton")).toBeTruthy();
  });

  it("forwards variant + lines + width attributes to the core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant.set("text");
    fixture.componentInstance.lines.set(3);
    fixture.componentInstance.width.set("120px");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-skeleton") as HTMLElement;
    expect(inner.getAttribute("variant")).toBe("text");
    expect(inner.getAttribute("lines")).toBe("3");
    expect(inner.getAttribute("width")).toBe("120px");
  });
});
