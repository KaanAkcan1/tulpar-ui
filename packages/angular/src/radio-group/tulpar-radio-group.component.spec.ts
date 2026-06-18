import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { TulparRadioGroupComponent } from "./tulpar-radio-group.component";

@Component({
  standalone: true,
  imports: [TulparRadioGroupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <tulpar-radio-group-ng
      [value]="value()"
      [label]="label()"
      [disabled]="disabled()"
      [size]="size()"
      [orientation]="orientation()"
      (change)="onChange($event)"
    >
      <tulpar-radio value="a" label="Option A"></tulpar-radio>
      <tulpar-radio value="b" label="Option B"></tulpar-radio>
    </tulpar-radio-group-ng>
  `,
})
class Host {
  value = signal<string | null>(null);
  label = signal<string | undefined>(undefined);
  disabled = signal(false);
  size = signal<"md" | "lg">("md");
  orientation = signal<"vertical" | "horizontal">("vertical");
  lastEvent: CustomEvent<{ value: string | null }> | null = null;
  onChange(e: CustomEvent<{ value: string | null }>) {
    this.lastEvent = e;
  }
}

describe("TulparRadioGroupComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparRadioGroupComponent).toBeDefined();
  });

  it("renders the inner tulpar-radio-group web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group");
    expect(inner).toBeTruthy();
  });

  it("default value=null: no value attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    expect(inner.getAttribute("value")).toBeNull();
  });

  it("value='a' sets value attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value.set("a");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    expect(inner.getAttribute("value")).toBe("a");
  });

  it("forwards label attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Choose one");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Choose one");
  });

  it("forwards disabled attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    expect(inner.hasAttribute("disabled")).toBe(true);
  });

  it("forwards size attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("lg");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    expect(inner.getAttribute("size")).toBe("lg");
  });

  it("forwards orientation attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.orientation.set("horizontal");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    expect(inner.getAttribute("orientation")).toBe("horizontal");
  });

  it("core children (tulpar-radio) are descendants of core group (tulpar-radio-group)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const group = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    const radios = group.querySelectorAll("tulpar-radio");
    // Both <tulpar-radio> elements must be DOM descendants of <tulpar-radio-group>
    expect(radios.length).toBe(2);
  });

  it("two-way: core CustomEvent change updates value model", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.children[0]
      .componentInstance as TulparRadioGroupComponent;
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    inner.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "b" },
        bubbles: true,
        composed: true,
      }),
    );
    expect(wrapper.value()).toBe("b");
  });

  it("emits change output on core CustomEvent change", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio-group") as HTMLElement;
    inner.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "a" },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fixture.componentInstance.lastEvent).toBeInstanceOf(CustomEvent);
  });
});
