import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparRadioComponent } from "./tulpar-radio.component";

@Component({
  standalone: true,
  imports: [TulparRadioComponent],
  template: `
    <tulpar-radio-ng
      value="option-a"
      [checked]="checked()"
      [label]="label()"
      [disabled]="disabled()"
      [variant]="variant()"
      (change)="onChange($event)"
    ></tulpar-radio-ng>
  `,
})
class Host {
  checked = signal(false);
  label = signal<string | undefined>(undefined);
  disabled = signal(false);
  variant = signal<"default" | "card">("default");
  lastEvent: Event | null = null;
  onChange(e: Event) {
    this.lastEvent = e;
  }
}

describe("TulparRadioComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparRadioComponent).toBeDefined();
  });

  it("renders the inner tulpar-radio web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio");
    expect(inner).toBeTruthy();
  });

  it("forwards value attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio") as HTMLElement;
    expect(inner.getAttribute("value")).toBe("option-a");
  });

  it("default checked=false: no checked attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio") as HTMLElement;
    expect(inner.hasAttribute("checked")).toBe(false);
  });

  it("checked=true sets checked attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.checked.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio") as HTMLElement;
    expect(inner.hasAttribute("checked")).toBe(true);
  });

  it("forwards label attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Option A");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Option A");
  });

  it("forwards variant attribute", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant.set("card");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio") as HTMLElement;
    expect(inner.getAttribute("variant")).toBe("card");
  });

  it("two-way: core change event updates checked model", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.children[0]
      .componentInstance as TulparRadioComponent;
    const inner = fixture.nativeElement.querySelector("tulpar-radio") as HTMLElement & {
      checked: boolean;
    };
    inner.checked = true;
    inner.dispatchEvent(new Event("change", { bubbles: true }));
    expect(wrapper.checked()).toBe(true);
  });

  it("emits change output on core change", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-radio") as HTMLElement & {
      checked: boolean;
    };
    inner.checked = true;
    inner.dispatchEvent(new Event("change", { bubbles: true }));
    expect(fixture.componentInstance.lastEvent).toBeInstanceOf(Event);
  });
});
