import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from "@angular/core";

import {
  TulparToggletipDirective,
  TulparToggletipRefDirective,
} from "./tulpar-toggletip.directive";

@Component({
  standalone: true,
  imports: [TulparToggletipDirective],
  template: `
    <button
      [tulparToggletip]="text()"
      [toggletipPlacement]="placement()"
      [toggletipTone]="tone()"
      (openChange)="onOpenChange($event)"
    >
      Info
    </button>
  `,
})
class InlineHost {
  text = signal("Hi");
  placement = signal<"top" | "bottom" | "left" | "right">("top");
  tone = signal<"neutral" | "info" | "success" | "warning" | "danger">("info");
  openEvents: boolean[] = [];
  onOpenChange(open: boolean) {
    this.openEvents.push(open);
  }
}

@Component({
  standalone: true,
  imports: [TulparToggletipRefDirective],
  template: `
    <tulpar-toggletip id="declaredTt" text="Declared"></tulpar-toggletip>
    <button tulparToggletipRef="declaredTt">Trigger</button>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
class RefHost {}

describe("TulparToggletipDirective (inline)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [InlineHost] });
  });

  it("directive class is exported", () => {
    expect(TulparToggletipDirective).toBeDefined();
  });

  it("mints an id on the host and creates a tulpar-toggletip with matching for + text", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    expect(host.id).toBeTruthy();
    const tt = host.parentNode!.querySelector("tulpar-toggletip") as HTMLElement & {
      text: string;
    };
    expect(tt).toBeTruthy();
    expect(tt.getAttribute("for")).toBe(host.id);
    expect(tt.text).toBe("Hi");
  });

  it("forwards placement + tone companion inputs as attributes", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.componentInstance.placement.set("bottom");
    fixture.componentInstance.tone.set("danger");
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const tt = host.parentNode!.querySelector("tulpar-toggletip") as HTMLElement;
    expect(tt.getAttribute("placement")).toBe("bottom");
    expect(tt.getAttribute("tone")).toBe("danger");
  });

  it("emits openChange on dispatched tulpar-open / tulpar-close", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const tt = host.parentNode!.querySelector("tulpar-toggletip") as HTMLElement;
    tt.dispatchEvent(new CustomEvent("tulpar-open"));
    tt.dispatchEvent(new CustomEvent("tulpar-close"));
    expect(fixture.componentInstance.openEvents).toEqual([true, false]);
  });

  it("removes the inline-created element on teardown", () => {
    const fixture = TestBed.createComponent(InlineHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const parent = host.parentNode as HTMLElement;
    expect(parent.querySelector("tulpar-toggletip")).toBeTruthy();
    fixture.destroy();
    expect(parent.querySelector("tulpar-toggletip")).toBeNull();
  });
});

describe("TulparToggletipRefDirective", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RefHost] });
  });

  it("directive class is exported", () => {
    expect(TulparToggletipRefDirective).toBeDefined();
  });

  it("sets the declared element's for to the host id", () => {
    const fixture = TestBed.createComponent(RefHost);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
    const declared = fixture.nativeElement.querySelector("#declaredTt") as HTMLElement;
    expect(host.id).toBeTruthy();
    expect(declared.getAttribute("for")).toBe(host.id);
  });
});
