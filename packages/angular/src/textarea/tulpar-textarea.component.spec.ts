import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparTextareaComponent } from "./tulpar-textarea.component";

@Component({
  standalone: true,
  imports: [TulparTextareaComponent],
  template: `
    <tulpar-textarea-ng
      [label]="label()"
      [value]="value()"
      (valueChange)="onValueChange($event)"
    ></tulpar-textarea-ng>
  `,
})
class Host {
  label = signal<string | undefined>(undefined);
  value = signal("");
  lastValue: string | undefined;
  onValueChange(v: string) {
    this.lastValue = v;
  }
}

describe("TulparTextareaComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("registers the wrapper class", () => {
    expect(TulparTextareaComponent).toBeDefined();
  });

  it("renders the underlying tulpar-textarea web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-textarea");
    expect(inner).toBeTruthy();
  });

  it("forwards label input", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Description");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-textarea");
    expect(inner.getAttribute("label")).toBe("Description");
  });

  it("emits valueChange on input event", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-textarea");
    inner.value = "hello world";
    inner.dispatchEvent(new Event("input", { bubbles: true }));
    expect(fixture.componentInstance.lastValue).toBe("hello world");
  });
});
