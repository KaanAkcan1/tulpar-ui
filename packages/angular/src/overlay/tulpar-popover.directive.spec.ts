import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

import { TulparPopoverDirective, TulparPopoverRefDirective } from "./tulpar-popover.directive";

@Component({
  standalone: true,
  imports: [TulparPopoverDirective],
  template: `
    <button
      [tulparPopover]="text()"
      [popoverPlacement]="placement()"
      [popoverTone]="tone()"
      (openChange)="onOpenChange($event)"
    >
      Open
    </button>
  `,
})
class InlineHost {
  text = signal("Hi");
  placement = signal<"top" | "bottom" | "left" | "right">("bottom");
  tone = signal<"neutral" | "info" | "success" | "warning" | "danger">("info");
  openEvents: boolean[] = [];
  onOpenChange(open: boolean) {
    this.openEvents.push(open);
  }
}

@Component({
  standalone: true,
  imports: [TulparPopoverRefDirective],
  template: `
    <tulpar-popover id="declaredPop"><h2>Account</h2></tulpar-popover>
    <button tulparPopoverRef="declaredPop">Trigger</button>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class RefHost {}

describe("TulparPopoverDirective (inline)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [InlineHost] });
  });

  it("directive class is exported", () => {
    expect(TulparPopoverDirective).toBeDefined();
  });

  it("mints an id on the host and creates a tulpar-popover with matching for + text", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(host.id).toBeTruthy();
    const pop = host.parentNode!.querySelector("tulpar-popover") as HTMLElement;
    expect(pop).toBeTruthy();
    expect(pop.getAttribute("for")).toBe(host.id);
    expect(pop.textContent).toBe("Hi");
  });

  it("forwards placement + tone companion inputs as attributes", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.componentInstance.placement.set("top");
    fixture.componentInstance.tone.set("warning");
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const pop = host.parentNode!.querySelector("tulpar-popover") as HTMLElement;
    expect(pop.getAttribute("placement")).toBe("top");
    expect(pop.getAttribute("tone")).toBe("warning");
  });

  it("emits openChange on dispatched tulpar-open / tulpar-close", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const pop = host.parentNode!.querySelector("tulpar-popover") as HTMLElement;
    pop.dispatchEvent(new CustomEvent("tulpar-open"));
    pop.dispatchEvent(new CustomEvent("tulpar-close"));
    expect(fixture.componentInstance.openEvents).toEqual([true, false]);
  });

  it("removes the inline-created element on teardown", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const parent = host.parentNode as HTMLElement;
    expect(parent.querySelector("tulpar-popover")).toBeTruthy();
    fixture.destroy();
    expect(parent.querySelector("tulpar-popover")).toBeNull();
  });
});

describe("TulparPopoverRefDirective", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RefHost] });
  });

  it("directive class is exported", () => {
    expect(TulparPopoverRefDirective).toBeDefined();
  });

  it("sets the declared element's for to the host id and leaves its content", () => {
    const fixture = TestBed.createComponent(RefHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const declared = fixture.nativeElement.querySelector("#declaredPop") as HTMLElement;
    expect(host.id).toBeTruthy();
    expect(declared.getAttribute("for")).toBe(host.id);
    // The consumer-owned rich content is untouched.
    expect(declared.querySelector("h2")?.textContent).toBe("Account");
  });

  it("does NOT remove the declared element on teardown", () => {
    const fixture = TestBed.createComponent(RefHost);
    fixture.detectChanges();
    const declared = fixture.nativeElement.querySelector("#declaredPop") as HTMLElement;
    fixture.destroy();
    expect(declared.querySelector("h2")).toBeTruthy();
  });
});
