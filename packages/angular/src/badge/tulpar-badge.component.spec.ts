import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparBadgeComponent } from "./tulpar-badge.component";

@Component({
  standalone: true,
  imports: [TulparBadgeComponent],
  template: `
    <tulpar-badge-ng
      [tone]="tone()"
      [count]="count()"
      [showZero]="showZero()"
      [dot]="dot()"
    ></tulpar-badge-ng>
  `,
})
class Host {
  tone = signal<"neutral" | "info" | "success" | "warning" | "danger" | undefined>(undefined);
  count = signal<number | undefined>(undefined);
  showZero = signal(false);
  dot = signal(false);
}

describe("TulparBadgeComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparBadgeComponent).toBeDefined();
  });

  it("renders the inner tulpar-badge web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-badge")).toBeTruthy();
  });

  it("forwards tone + count attributes to the core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.tone.set("danger");
    fixture.componentInstance.count.set(7);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-badge") as HTMLElement;
    expect(inner.getAttribute("tone")).toBe("danger");
    expect(inner.getAttribute("count")).toBe("7");
  });

  it("show-zero kebab attribute is forwarded", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.showZero.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-badge") as HTMLElement;
    expect(inner.hasAttribute("show-zero")).toBe(true);
  });
});
