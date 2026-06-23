import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparTagComponent } from "./tulpar-tag.component";

@Component({
  standalone: true,
  imports: [TulparTagComponent],
  template: `
    <tulpar-tag-ng
      [tone]="tone()"
      [label]="label()"
      [variant]="variant()"
      [dot]="dot()"
    ></tulpar-tag-ng>
  `,
})
class Host {
  tone = signal<string | undefined>(undefined);
  label = signal<string | undefined>(undefined);
  variant = signal<"soft-tonal" | "outline" | "solid" | undefined>(undefined);
  dot = signal(false);
}

describe("TulparTagComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparTagComponent).toBeDefined();
  });

  it("renders the inner tulpar-tag web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-tag")).toBeTruthy();
  });

  it("forwards tone + label attributes to the core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.tone.set("success");
    fixture.componentInstance.label.set("Active");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-tag") as HTMLElement;
    expect(inner.getAttribute("tone")).toBe("success");
    expect(inner.getAttribute("label")).toBe("Active");
  });

  it("dot=false: no dot attribute; dot=true sets it", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    let inner = fixture.nativeElement.querySelector("tulpar-tag") as HTMLElement;
    expect(inner.hasAttribute("dot")).toBe(false);
    fixture.componentInstance.dot.set(true);
    fixture.detectChanges();
    inner = fixture.nativeElement.querySelector("tulpar-tag") as HTMLElement;
    expect(inner.hasAttribute("dot")).toBe(true);
  });
});
