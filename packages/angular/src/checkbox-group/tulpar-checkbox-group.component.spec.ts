import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { TulparCheckboxGroupComponent } from "./tulpar-checkbox-group.component";

@Component({
  standalone: true,
  imports: [TulparCheckboxGroupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <tulpar-checkbox-group-ng
      [value]="value()"
      [label]="label()"
      [disabled]="disabled()"
      [size]="size()"
      [orientation]="orientation()"
      (change)="onChange($event)"
    >
      <tulpar-checkbox value="x" label="Option X"></tulpar-checkbox>
      <tulpar-checkbox value="y" label="Option Y"></tulpar-checkbox>
    </tulpar-checkbox-group-ng>
  `,
})
class Host {
  value = signal<string[]>([]);
  label = signal<string | undefined>(undefined);
  disabled = signal(false);
  size = signal<"md" | "lg">("md");
  orientation = signal<"vertical" | "horizontal">("vertical");
  lastEvent: CustomEvent<{ value: string[] }> | null = null;
  onChange(e: CustomEvent<{ value: string[] }>) {
    this.lastEvent = e;
  }
}

describe("TulparCheckboxGroupComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparCheckboxGroupComponent).toBeDefined();
  });

  it("renders the inner tulpar-checkbox-group web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox-group");
    expect(inner).toBeTruthy();
  });

  it("forwards label attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Pick options");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox-group") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Pick options");
  });

  it("forwards disabled attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox-group") as HTMLElement;
    expect(inner.hasAttribute("disabled")).toBe(true);
  });

  it("forwards size attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("lg");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox-group") as HTMLElement;
    expect(inner.getAttribute("size")).toBe("lg");
  });

  it("forwards orientation attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.orientation.set("horizontal");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox-group") as HTMLElement;
    expect(inner.getAttribute("orientation")).toBe("horizontal");
  });

  it("core children (tulpar-checkbox) are descendants of core group (tulpar-checkbox-group)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector("tulpar-checkbox-group") as HTMLElement;
    const checkboxes = group.querySelectorAll("tulpar-checkbox");
    // Both <tulpar-checkbox> elements must be DOM descendants of <tulpar-checkbox-group>
    expect(checkboxes.length).toBe(2);
  });

  it("two-way: core CustomEvent change updates value model", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.children[0]
      .componentInstance as TulparCheckboxGroupComponent;
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox-group") as HTMLElement;
    inner.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: ["x", "y"] },
        bubbles: true,
        composed: true,
      }),
    );
    expect(wrapper.value()).toEqual(["x", "y"]);
  });

  it("emits change output on core CustomEvent change", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox-group") as HTMLElement;
    inner.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: ["x"] },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fixture.componentInstance.lastEvent).toBeInstanceOf(CustomEvent);
  });
});
