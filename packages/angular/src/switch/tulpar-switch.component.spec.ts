import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparSwitchComponent } from "./tulpar-switch.component";

@Component({
  standalone: true,
  imports: [TulparSwitchComponent],
  template: `
    <tulpar-switch-ng
      [checked]="checked()"
      [label]="label()"
      [disabled]="disabled()"
      [size]="size()"
      (change)="onChange($event)"
    ></tulpar-switch-ng>
  `,
})
class Host {
  checked = signal(false);
  label = signal<string | undefined>(undefined);
  disabled = signal(false);
  size = signal<"md" | "lg">("md");
  lastEvent: Event | null = null;
  onChange(e: Event) {
    this.lastEvent = e;
  }
}

describe("TulparSwitchComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparSwitchComponent).toBeDefined();
  });

  it("renders the inner tulpar-switch web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-switch");
    expect(inner).toBeTruthy();
  });

  it("default checked=false: no checked attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-switch") as HTMLElement;
    expect(inner.hasAttribute("checked")).toBe(false);
  });

  it("checked=true sets checked attribute on core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.checked.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-switch") as HTMLElement;
    expect(inner.hasAttribute("checked")).toBe(true);
  });

  it("forwards label attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Notifications");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-switch") as HTMLElement;
    expect(inner.getAttribute("label")).toBe("Notifications");
  });

  it("forwards disabled attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-switch") as HTMLElement;
    expect(inner.hasAttribute("disabled")).toBe(true);
  });

  it("forwards size attribute to core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("lg");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-switch") as HTMLElement;
    expect(inner.getAttribute("size")).toBe("lg");
  });

  it("two-way: core change event updates checked model (via checkedChange)", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const wrapper = fixture.debugElement.children[0]
      .componentInstance as TulparSwitchComponent;
    const inner = fixture.nativeElement.querySelector("tulpar-switch") as HTMLElement & {
      checked: boolean;
    };
    // Simulate the WC toggling itself and firing change
    inner.checked = true;
    inner.dispatchEvent(new Event("change", { bubbles: true }));
    // The wrapper's model should have updated
    expect(wrapper.checked()).toBe(true);
  });

  it("emits change output on core change", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-switch") as HTMLElement & {
      checked: boolean;
    };
    inner.checked = true;
    inner.dispatchEvent(new Event("change", { bubbles: true }));
    expect(fixture.componentInstance.lastEvent).toBeInstanceOf(Event);
  });
});
