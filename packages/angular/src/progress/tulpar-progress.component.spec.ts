import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparProgressComponent } from "./tulpar-progress.component";
import type { ProgressValueFormatter, ProgressSize, ProgressTone } from "./tulpar-progress.component";

@Component({
  standalone: true,
  imports: [TulparProgressComponent],
  template: `
    <tulpar-progress-ng
      [variant]="variant()"
      [value]="value()"
      [indeterminate]="indeterminate()"
      [valueLabel]="valueLabel()"
      [tone]="tone()"
      [size]="size()"
    ></tulpar-progress-ng>
  `,
})
class Host {
  variant = signal<"linear" | "circular" | undefined>(undefined);
  value = signal<number | undefined>(undefined);
  indeterminate = signal(false);
  valueLabel = signal<boolean | ProgressValueFormatter>(false);
  tone = signal<ProgressTone | undefined>(undefined);
  size = signal<ProgressSize | undefined>(undefined);
}

describe("TulparProgressComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("class is exported and defined", () => {
    expect(TulparProgressComponent).toBeDefined();
  });

  it("renders the inner tulpar-progress web component", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("tulpar-progress")).toBeTruthy();
  });

  it("forwards variant + value + indeterminate to the core element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant.set("circular");
    fixture.componentInstance.value.set(42);
    fixture.componentInstance.indeterminate.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-progress") as HTMLElement;
    expect(inner.getAttribute("variant")).toBe("circular");
    expect(inner.getAttribute("value")).toBe("42");
    expect(inner.hasAttribute("indeterminate")).toBe(true);
  });

  it('forwards tone="flow" and the xs/xl sizes to the core element', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.variant.set("circular");
    fixture.componentInstance.value.set(40);
    fixture.componentInstance.tone.set("flow");
    fixture.componentInstance.size.set("xs");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-progress") as HTMLElement;
    expect(inner.getAttribute("tone")).toBe("flow");
    expect(inner.getAttribute("size")).toBe("xs");
    fixture.componentInstance.size.set("xl");
    fixture.detectChanges();
    expect(inner.getAttribute("size")).toBe("xl");
  });

  it("sets boolean valueLabel as a DOM property (not an attribute)", async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.valueLabel.set(true);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-progress") as HTMLElement & {
      valueLabel: boolean | ProgressValueFormatter;
    };
    expect(inner.valueLabel).toBe(true);
    // attribute: false — never reflected to an attribute
    expect(inner.hasAttribute("value-label")).toBe(false);
  });

  it("sets a formatter FUNCTION valueLabel as a DOM property", async () => {
    const fixture = TestBed.createComponent(Host);
    const fmt: ProgressValueFormatter = (v, _min, max) => `${v} of ${max}`;
    fixture.componentInstance.valueLabel.set(fmt);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-progress") as HTMLElement & {
      valueLabel: boolean | ProgressValueFormatter;
    };
    expect(inner.valueLabel).toBe(fmt);
    expect(typeof inner.valueLabel).toBe("function");
  });
});
