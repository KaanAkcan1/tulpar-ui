/**
 * tulpar-toast.component.spec.ts — smoke tests for <tulpar-toast-ng>
 *
 * Per repo convention: wrapper tests are smoke-level.
 *   - Component class is exported and creates without error.
 *   - Renders the inner <tulpar-toast> web component.
 *   - String inputs reflect to the right attribute on the core element.
 *   - Boolean inputs reflect as boolean attributes (present/absent).
 *   - `actions` is set as a property (not attr) on the core element via afterRenderEffect.
 *   - Named slots are projected (slot="title", slot="description", slot="icon" + default slot).
 *   - `dismissed` output emits on `tulpar-dismiss` event from core element.
 *   - `action` output emits on `tulpar-action` event from core element.
 *
 * NO RxJS — zero imports from 'rxjs'.
 */
import { describe, it, expect } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, signal } from "@angular/core";
import { TulparToastComponent } from "./tulpar-toast.component";
import type { ToastAction } from "./tulpar-toast.component";

// ─────────────────────────────────────────────────────────────────────────────
// Host helpers
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [TulparToastComponent],
  template: `
    <tulpar-toast-ng
      [tone]="tone()"
      [heading]="heading()"
      [description]="description()"
      [closable]="closable()"
      [timer]="timer()"
      [duration]="duration()"
      [timerStyle]="timerStyle()"
      [color]="color()"
      [bg]="bg()"
      [accent]="accent()"
      [text]="text()"
      [highContrast]="highContrast()"
      [icon]="icon()"
      [actions]="actions()"
      (dismissed)="onDismissed($event)"
      (action)="onAction($event)"
    ></tulpar-toast-ng>
  `,
})
class HostComponent {
  tone = signal<string | undefined>(undefined);
  heading = signal<string | undefined>(undefined);
  description = signal<string | undefined>(undefined);
  closable = signal<boolean | undefined>(undefined);
  timer = signal<boolean | undefined>(undefined);
  duration = signal<number | undefined>(undefined);
  timerStyle = signal<string | undefined>(undefined);
  color = signal<string | undefined>(undefined);
  bg = signal<string | undefined>(undefined);
  accent = signal<string | undefined>(undefined);
  text = signal<string | undefined>(undefined);
  highContrast = signal<boolean | undefined>(undefined);
  icon = signal<string | undefined>(undefined);
  actions = signal<ToastAction[] | undefined>(undefined);

  lastDismissEvent: CustomEvent | null = null;
  lastActionEvent: CustomEvent | null = null;

  onDismissed(e: CustomEvent) {
    this.lastDismissEvent = e;
  }
  onAction(e: CustomEvent) {
    this.lastActionEvent = e;
  }
}

@Component({
  standalone: true,
  imports: [TulparToastComponent],
  template: `
    <tulpar-toast-ng>
      <span slot="title">Slot title</span>
      <span slot="description">Slot description</span>
      <span slot="icon">★</span>
      <div>Default slot content</div>
    </tulpar-toast-ng>
  `,
})
class SlotHost {}

// ─────────────────────────────────────────────────────────────────────────────

describe("TulparToastComponent (smoke)", () => {
  it("class is exported and defined", () => {
    expect(TulparToastComponent).toBeDefined();
  });

  it("creates without error", () => {
    TestBed.configureTestingModule({ imports: [TulparToastComponent] });
    const fixture = TestBed.createComponent(TulparToastComponent);
    expect(fixture.componentInstance).toBeInstanceOf(TulparToastComponent);
  });

  it("renders the inner <tulpar-toast> web component", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast");
    expect(inner).toBeTruthy();
  });

  it("forwards tone attribute to core element", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.tone.set("success");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    expect(inner.getAttribute("tone")).toBe("success");
  });

  it("forwards heading attribute to core element", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.heading.set("Operation completed");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    expect(inner.getAttribute("heading")).toBe("Operation completed");
  });

  it("forwards description attribute to core element", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.description.set("Your data was saved.");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    expect(inner.getAttribute("description")).toBe("Your data was saved.");
  });

  it("forwards color attribute to core element", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.color.set("ilay");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    expect(inner.getAttribute("color")).toBe("ilay");
  });

  it("high-contrast boolean input sets [attr.high-contrast] as empty string when true", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.highContrast.set(true);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    expect(inner.hasAttribute("high-contrast")).toBe(true);
  });

  it("high-contrast false removes the attribute", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.highContrast.set(false);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    expect(inner.hasAttribute("high-contrast")).toBe(false);
  });

  it("closable=false sets [attr.closable] to null (removed)", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.closable.set(false);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    expect(inner.hasAttribute("closable")).toBe(false);
  });

  it("timer-style attribute forwarded via [attr.timer-style]", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.timerStyle.set("soft");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    expect(inner.getAttribute("timer-style")).toBe("soft");
  });

  it("actions array is set as a PROPERTY on the core element (not attr)", async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    const actions: ToastAction[] = [{ label: "Undo", onClick: () => {} }];
    fixture.componentInstance.actions.set(actions);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement & {
      actions: ToastAction[];
    };
    // Must be set as a property, not an attribute
    expect(inner.actions).toEqual(actions);
    expect(inner.hasAttribute("actions")).toBe(false);
  });

  it("slot='title' content is projected into the core element", () => {
    TestBed.configureTestingModule({ imports: [SlotHost] });
    const fixture = TestBed.createComponent(SlotHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const titleSlot = host.querySelector("[slot='title']");
    expect(titleSlot).toBeTruthy();
    expect(titleSlot!.textContent).toContain("Slot title");
  });

  it("slot='description' content is projected into the core element", () => {
    TestBed.configureTestingModule({ imports: [SlotHost] });
    const fixture = TestBed.createComponent(SlotHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const descSlot = host.querySelector("[slot='description']");
    expect(descSlot).toBeTruthy();
    expect(descSlot!.textContent).toContain("Slot description");
  });

  it("slot='icon' content is projected into the core element", () => {
    TestBed.configureTestingModule({ imports: [SlotHost] });
    const fixture = TestBed.createComponent(SlotHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const iconSlot = host.querySelector("[slot='icon']");
    expect(iconSlot).toBeTruthy();
    expect(iconSlot!.textContent).toContain("★");
  });

  it("default slot content is projected", () => {
    TestBed.configureTestingModule({ imports: [SlotHost] });
    const fixture = TestBed.createComponent(SlotHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain("Default slot content");
  });

  it("dismissed output emits on tulpar-dismiss from core element", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    const evt = new CustomEvent("tulpar-dismiss", {
      detail: { reason: "user" },
      bubbles: true,
      composed: true,
    });
    inner.dispatchEvent(evt);
    expect(fixture.componentInstance.lastDismissEvent).toBeInstanceOf(CustomEvent);
    expect(fixture.componentInstance.lastDismissEvent!.detail).toEqual({ reason: "user" });
  });

  it("action output emits on tulpar-action from core element", () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-toast") as HTMLElement;
    const action: ToastAction = { label: "Undo", onClick: () => {} };
    const evt = new CustomEvent("tulpar-action", {
      detail: { label: "Undo", action },
      bubbles: true,
      composed: true,
    });
    inner.dispatchEvent(evt);
    expect(fixture.componentInstance.lastActionEvent).toBeInstanceOf(CustomEvent);
    expect(fixture.componentInstance.lastActionEvent!.detail.label).toBe("Undo");
  });
});
