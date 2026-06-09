import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparButtonComponent } from "./tulpar-button.component";

@Component({
  standalone: true,
  imports: [TulparButtonComponent],
  template: `
    <tulpar-button-ng
      [severity]="sev()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [iconSize]="iconSize()"
      (clicked)="onClick($event)"
    >{{ label() }}</tulpar-button-ng>
  `,
})
class Host {
  sev = signal<"primary" | "danger">("primary");
  variant = signal<"solid" | "outlined">("solid");
  size = signal<"md" | "lg">("md");
  disabled = signal(false);
  iconSize = signal<number | undefined>(undefined);
  label = signal("Save");
  lastClick: MouseEvent | null = null;
  onClick(e: MouseEvent) {
    this.lastClick = e;
  }
}

describe("TulparButtonComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("creates and renders the inner tulpar-button", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-button");
    expect(inner).toBeTruthy();
  });

  it("reflects severity to the inner element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.sev.set("danger");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-button") as HTMLElement;
    expect(inner.getAttribute("severity")).toBe("danger");
  });

  it("emits click via the `clicked` output", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-button") as HTMLElement;
    inner.click();
    expect(fixture.componentInstance.lastClick).toBeInstanceOf(MouseEvent);
  });

  it("effectiveIconSize defaults to size-scale value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("lg");
    fixture.detectChanges();
    const cmp = fixture.debugElement.children[0].componentInstance as TulparButtonComponent;
    expect(cmp.effectiveIconSize()).toBe(18);
  });

  it("effectiveIconSize uses explicit iconSize override", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("md");
    fixture.componentInstance.iconSize.set(32);
    fixture.detectChanges();
    const cmp = fixture.debugElement.children[0].componentInstance as TulparButtonComponent;
    expect(cmp.effectiveIconSize()).toBe(32);
  });
});
