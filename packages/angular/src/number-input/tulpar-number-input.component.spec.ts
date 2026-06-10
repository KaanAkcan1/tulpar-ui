import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparNumberInputComponent } from "./tulpar-number-input.component";

@Component({
  standalone: true,
  imports: [TulparNumberInputComponent],
  template: `
    <tulpar-number-input-ng
      [label]="label()"
      [value]="value()"
      [formatOptions]="formatOptions()"
      (valueChange)="onValueChange($event)"
    ></tulpar-number-input-ng>
  `,
})
class Host {
  label = signal<string | undefined>(undefined);
  value = signal<number | null>(null);
  formatOptions = signal<Intl.NumberFormatOptions | undefined>(undefined);
  lastValue: number | null | undefined;
  onValueChange(v: number | null) {
    this.lastValue = v;
  }
}

describe("TulparNumberInputComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("registers the wrapper class", () => {
    expect(TulparNumberInputComponent).toBeDefined();
  });

  it("renders the underlying tulpar-number-input web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-number-input");
    expect(inner).toBeTruthy();
  });

  it("forwards label input", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.label.set("Amount");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-number-input");
    expect(inner.getAttribute("label")).toBe("Amount");
  });

  it("forwards formatOptions property via effect", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const opts: Intl.NumberFormatOptions = { style: "currency", currency: "USD" };
    fixture.componentInstance.formatOptions.set(opts);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-number-input") as HTMLElement & {
      formatOptions?: Intl.NumberFormatOptions;
    };
    expect(inner.formatOptions).toEqual(opts);
  });
});
