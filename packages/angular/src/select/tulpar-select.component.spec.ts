import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";
import { TulparSelectComponent } from "./tulpar-select.component";

@Component({
  standalone: true,
  imports: [TulparSelectComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <tulpar-select-ng
      [value]="value()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [label]="label()"
      [size]="size()"
      (changed)="onChanged($event)"
    >
      <tulpar-option value="a" label="Option A"></tulpar-option>
      <tulpar-option value="b" label="Option B"></tulpar-option>
    </tulpar-select-ng>
  `,
})
class Host {
  value = signal("");
  placeholder = signal<string | undefined>(undefined);
  disabled = signal(false);
  label = signal<string | undefined>(undefined);
  size = signal<"xs" | "sm" | "md" | "lg" | "xl" | undefined>(undefined);
  lastEvent: CustomEvent | null = null;
  onChanged(e: CustomEvent) {
    this.lastEvent = e;
  }
}

describe("TulparSelectComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparSelectComponent).toBeDefined();
  });

  it("renders the inner tulpar-select web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-select")).toBeTruthy();
  });

  it("default value='': no value attribute on core element (value() || null = null)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    // value="" → value() || null → null → attribute removed
    expect(inner.getAttribute("value")).toBeNull();
  });

  it("value='a' sets value attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.value.set("a");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    expect(inner.getAttribute("value")).toBe("a");
  });

  it("forwards placeholder attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.placeholder.set("Select an option");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    expect(inner.getAttribute("placeholder")).toBe("Select an option");
  });

  it("forwards disabled attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    expect(inner.hasAttribute("disabled")).toBe(true);
  });

  it("forwards label attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Country");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Country");
  });

  it("forwards size attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("lg");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    expect(inner.getAttribute("size")).toBe("lg");
  });

  it("two-way: core CustomEvent change updates value model", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.children[0].componentInstance as TulparSelectComponent;
    const inner = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    inner.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "b" },
        bubbles: true,
        composed: true,
      }),
    );
    expect(wrapper.value()).toBe("b");
  });

  it("emits changed output on core CustomEvent change", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    inner.dispatchEvent(
      new CustomEvent("change", {
        detail: { value: "a" },
        bubbles: true,
        composed: true,
      }),
    );
    expect(fixture.componentInstance.lastEvent).toBeInstanceOf(CustomEvent);
  });

  it("projected tulpar-option children are descendants of core tulpar-select", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const select = fixture.nativeElement.querySelector("tulpar-select") as HTMLElement;
    const options = select.querySelectorAll("tulpar-option");
    expect(options.length).toBe(2);
  });
});
