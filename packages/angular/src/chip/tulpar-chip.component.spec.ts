import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparChipComponent } from "./tulpar-chip.component";

@Component({
  standalone: true,
  imports: [TulparChipComponent],
  template: `
    <tulpar-chip-ng
      [tone]="tone()"
      [label]="label()"
      [removable]="removable()"
      (clicked)="onClicked($event)"
      (removed)="onRemoved($event)"
    ></tulpar-chip-ng>
  `,
})
class Host {
  tone = signal<string | undefined>(undefined);
  label = signal<string | undefined>(undefined);
  removable = signal(false);
  lastClicked: CustomEvent | null = null;
  lastRemoved: CustomEvent | null = null;
  onClicked(e: CustomEvent) {
    this.lastClicked = e;
  }
  onRemoved(e: CustomEvent) {
    this.lastRemoved = e;
  }
}

describe("TulparChipComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparChipComponent).toBeDefined();
  });

  it("renders the inner tulpar-chip web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-chip")).toBeTruthy();
  });

  it("forwards tone + label + removable to the core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.tone.set("info");
    fixture.componentInstance.label.set("Filter");
    fixture.componentInstance.removable.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-chip") as HTMLElement;
    expect(inner.getAttribute("tone")).toBe("info");
    expect(inner.getAttribute("label")).toBe("Filter");
    expect(inner.hasAttribute("removable")).toBe(true);
  });

  it("emits clicked on the core tulpar-click event", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-chip") as HTMLElement;
    inner.dispatchEvent(new CustomEvent("tulpar-click", { bubbles: true }));
    expect(fixture.componentInstance.lastClicked).toBeInstanceOf(CustomEvent);
  });

  it("emits removed on the core tulpar-remove event", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-chip") as HTMLElement;
    inner.dispatchEvent(new CustomEvent("tulpar-remove", { bubbles: true }));
    expect(fixture.componentInstance.lastRemoved).toBeInstanceOf(CustomEvent);
  });
});
