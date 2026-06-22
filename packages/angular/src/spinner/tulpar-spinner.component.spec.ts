import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparSpinnerComponent } from "./tulpar-spinner.component";

@Component({
  standalone: true,
  imports: [TulparSpinnerComponent],
  template: `
    <tulpar-spinner-ng
      [size]="size()"
      [tone]="tone()"
      [track]="track()"
      [label]="label()"
    ></tulpar-spinner-ng>
  `,
})
class Host {
  size = signal<"xs" | "sm" | "md" | "lg" | "xl" | undefined>(undefined);
  tone = signal<"neutral" | "info" | "success" | "warning" | "danger" | "custom" | undefined>(
    undefined,
  );
  track = signal(true);
  label = signal<string | undefined>(undefined);
}

describe("TulparSpinnerComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparSpinnerComponent).toBeDefined();
  });

  it("renders the inner tulpar-spinner web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-spinner")).toBeTruthy();
  });

  it("forwards size + tone + label attributes to the core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("lg");
    fixture.componentInstance.tone.set("info");
    fixture.componentInstance.label.set("Loading data");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-spinner") as HTMLElement;
    expect(inner.getAttribute("size")).toBe("lg");
    expect(inner.getAttribute("tone")).toBe("info");
    expect(inner.getAttribute("label")).toBe("Loading data");
  });

  it("track defaults to true (attr present); false removes it", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    let inner = fixture.nativeElement.querySelector("tulpar-spinner") as HTMLElement;
    expect(inner.hasAttribute("track")).toBe(true);
    fixture.componentInstance.track.set(false);
    fixture.detectChanges();
    inner = fixture.nativeElement.querySelector("tulpar-spinner") as HTMLElement;
    expect(inner.hasAttribute("track")).toBe(false);
  });
});
