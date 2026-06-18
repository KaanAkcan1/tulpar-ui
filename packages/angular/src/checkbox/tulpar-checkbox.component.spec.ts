import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparCheckboxComponent } from "./tulpar-checkbox.component";

@Component({
  standalone: true,
  imports: [TulparCheckboxComponent],
  template: `
    <tulpar-checkbox-ng
      [checked]="checked()"
      [label]="label()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      [variant]="variant()"
      (change)="onChange($event)"
    ></tulpar-checkbox-ng>
  `,
})
class Host {
  checked = signal(false);
  label = signal<string | undefined>(undefined);
  disabled = signal(false);
  indeterminate = signal(false);
  variant = signal<"default" | "card">("default");
  lastEvent: Event | null = null;
  onChange(e: Event) {
    this.lastEvent = e;
  }
}

describe("TulparCheckboxComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparCheckboxComponent).toBeDefined();
  });

  it("renders the inner tulpar-checkbox web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox");
    expect(inner).toBeTruthy();
  });

  it("default checked=false: no checked attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox") as HTMLElement;
    expect(inner.hasAttribute("checked")).toBe(false);
  });

  it("checked=true sets checked attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.checked.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox") as HTMLElement;
    expect(inner.hasAttribute("checked")).toBe(true);
  });

  it("forwards label attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Accept terms");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Accept terms");
  });

  it("forwards indeterminate attribute", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox") as HTMLElement;
    expect(inner.hasAttribute("indeterminate")).toBe(true);
  });

  it("forwards variant attribute", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant.set("card");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox") as HTMLElement;
    expect(inner.getAttribute("variant")).toBe("card");
  });

  it("two-way: core change event updates checked model", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.children[0]
      .componentInstance as TulparCheckboxComponent;
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox") as HTMLElement & {
      checked: boolean;
    };
    inner.checked = true;
    inner.dispatchEvent(new Event("change", { bubbles: true }));
    expect(wrapper.checked()).toBe(true);
  });

  it("emits change output on core change", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-checkbox") as HTMLElement & {
      checked: boolean;
    };
    inner.checked = true;
    inner.dispatchEvent(new Event("change", { bubbles: true }));
    expect(fixture.componentInstance.lastEvent).toBeInstanceOf(Event);
  });
});
