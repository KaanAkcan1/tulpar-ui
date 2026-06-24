import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { TulparOptionComponent } from "./tulpar-option.component";

@Component({
  standalone: true,
  imports: [TulparOptionComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <tulpar-option-ng
      [value]="value()"
      [label]="label()"
      [description]="description()"
      [disabled]="disabled()"
    ></tulpar-option-ng>
  `,
})
class Host {
  value = signal("option-a");
  label = signal<string | undefined>(undefined);
  description = signal<string | undefined>(undefined);
  disabled = signal(false);
}

describe("TulparOptionComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparOptionComponent).toBeDefined();
  });

  it("renders the inner tulpar-option web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-option")).toBeTruthy();
  });

  it("forwards value attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-option") as HTMLElement;
    expect(inner.getAttribute("value")).toBe("option-a");
  });

  it("forwards label attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Option A");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-option") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Option A");
  });

  it("forwards description attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.description.set("A helpful description");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-option") as HTMLElement;
    expect(inner.getAttribute("description")).toBe("A helpful description");
  });

  it("forwards disabled attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-option") as HTMLElement;
    expect(inner.hasAttribute("disabled")).toBe(true);
  });

  it("disabled=false: no disabled attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-option") as HTMLElement;
    expect(inner.hasAttribute("disabled")).toBe(false);
  });
});
