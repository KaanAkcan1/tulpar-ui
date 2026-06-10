import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparTextInputComponent } from "./tulpar-text-input.component";

@Component({
  standalone: true,
  imports: [TulparTextInputComponent],
  template: `
    <tulpar-text-input-ng
      [label]="label()"
      [value]="value()"
      [disabled]="disabled()"
      (valueChange)="onValueChange($event)"
    ></tulpar-text-input-ng>
  `,
})
class Host {
  label = signal<string | undefined>(undefined);
  value = signal("");
  disabled = signal(false);
  lastValue: string | undefined;
  onValueChange(v: string) {
    this.lastValue = v;
  }
}

describe("TulparTextInputComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("registers the wrapper class", () => {
    expect(TulparTextInputComponent).toBeDefined();
  });

  it("renders the underlying tulpar-text-input web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-text-input");
    expect(inner).toBeTruthy();
  });

  it("forwards label input", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Email");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-text-input");
    expect(inner.getAttribute("label")).toBe("Email");
  });

  it("emits valueChange on input event", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-text-input");
    inner.value = "hello";
    inner.dispatchEvent(new Event("input", { bubbles: true }));
    expect(fixture.componentInstance.lastValue).toBe("hello");
  });

  it("reflects disabled to inner element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-text-input") as HTMLElement;
    expect(inner.hasAttribute("disabled")).toBe(true);
  });
});
