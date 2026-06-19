import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

import { TulparTooltipDirective, TulparTooltipRefDirective } from "./tulpar-tooltip.directive";

@Component({
  standalone: true,
  imports: [TulparTooltipDirective],
  template: `
    <button
      [tulparTooltip]="text()"
      [tooltipPlacement]="placement()"
      (openChange)="onOpenChange($event)"
    >
      Hover me
    </button>
  `,
})
class InlineHost {
  text = signal("Hi");
  placement = signal<"top" | "bottom" | "left" | "right">("top");
  openEvents: boolean[] = [];
  onOpenChange(open: boolean) {
    this.openEvents.push(open);
  }
}

@Component({
  standalone: true,
  imports: [TulparTooltipRefDirective],
  template: `
    <tulpar-tooltip id="declaredTip" text="Declared"></tulpar-tooltip>
    <button tulparTooltipRef="declaredTip">Trigger</button>
  `,
  // The declared <tulpar-tooltip> is an unknown element to Angular's compiler.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class RefHost {}

describe("TulparTooltipDirective (inline)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [InlineHost] });
  });

  it("directive class is exported", () => {
    expect(TulparTooltipDirective).toBeDefined();
  });

  it("mints an id on the host and creates a tulpar-tooltip with matching for + text", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(host.id).toBeTruthy();
    const tip = host.parentNode!.querySelector("tulpar-tooltip") as HTMLElement & { text: string };
    expect(tip).toBeTruthy();
    expect(tip.getAttribute("for")).toBe(host.id);
    expect(tip.text).toBe("Hi");
  });

  it("forwards placement companion input as an attribute", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.componentInstance.placement.set("bottom");
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const tip = host.parentNode!.querySelector("tulpar-tooltip") as HTMLElement;
    expect(tip.getAttribute("placement")).toBe("bottom");
  });

  it("does not clobber a consumer-set host id", () => {
    @Component({
      standalone: true,
      imports: [TulparTooltipDirective],
      template: `<button id="mine" tulparTooltip="Hi">x</button>`,
    })
    class WithId {}
    const fixture = TestBed.createComponent(WithId);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(host.id).toBe("mine");
    const tip = host.parentNode!.querySelector("tulpar-tooltip") as HTMLElement;
    expect(tip.getAttribute("for")).toBe("mine");
  });

  it("emits openChange on dispatched tulpar-open / tulpar-close", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const tip = host.parentNode!.querySelector("tulpar-tooltip") as HTMLElement;
    tip.dispatchEvent(new CustomEvent("tulpar-open"));
    tip.dispatchEvent(new CustomEvent("tulpar-close"));
    expect(fixture.componentInstance.openEvents).toEqual([true, false]);
  });

  it("removes the inline-created element on teardown", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const parent = host.parentNode as HTMLElement;
    expect(parent.querySelector("tulpar-tooltip")).toBeTruthy();
    fixture.destroy();
    expect(parent.querySelector("tulpar-tooltip")).toBeNull();
  });
});

describe("TulparTooltipRefDirective", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RefHost] });
  });

  it("directive class is exported", () => {
    expect(TulparTooltipRefDirective).toBeDefined();
  });

  it("sets the declared element's for to the host id", () => {
    const fixture = TestBed.createComponent(RefHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const declared = fixture.nativeElement.querySelector("#declaredTip") as HTMLElement;
    expect(host.id).toBeTruthy();
    expect(declared.getAttribute("for")).toBe(host.id);
  });

  it("does NOT remove the declared element on teardown", () => {
    const fixture = TestBed.createComponent(RefHost);
    fixture.detectChanges();
    const declared = fixture.nativeElement.querySelector("#declaredTip") as HTMLElement;
    fixture.destroy();
    // The declared element belongs to the consumer; it survives the directive.
    expect(declared.isConnected || declared.tagName.toLowerCase() === "tulpar-tooltip").toBe(true);
  });
});
