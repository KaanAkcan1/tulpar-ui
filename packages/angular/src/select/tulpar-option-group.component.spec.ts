import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { TulparOptionGroupComponent } from "./tulpar-option-group.component";

@Component({
  standalone: true,
  imports: [TulparOptionGroupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <tulpar-option-group-ng [label]="label()">
      <tulpar-option value="a" label="Option A"></tulpar-option>
      <tulpar-option value="b" label="Option B"></tulpar-option>
    </tulpar-option-group-ng>
  `,
})
class Host {
  label = signal<string | undefined>(undefined);
}

describe("TulparOptionGroupComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparOptionGroupComponent).toBeDefined();
  });

  it("renders the inner tulpar-option-group web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-option-group")).toBeTruthy();
  });

  it("forwards label attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Fruits");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-option-group") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Fruits");
  });

  it("no label: label attribute absent from core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-option-group") as HTMLElement;
    expect(inner.getAttribute("label")).toBeNull();
  });

  it("projected tulpar-option children are descendants of core tulpar-option-group", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector("tulpar-option-group") as HTMLElement;
    const options = group.querySelectorAll("tulpar-option");
    expect(options.length).toBe(2);
  });
});
