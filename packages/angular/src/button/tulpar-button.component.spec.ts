import { describe, it, expect, beforeEach } from "vitest";
import { TestBed } from "@angular/core/testing";
import { Component, input, signal } from "@angular/core";
import { TulparButtonComponent } from "./tulpar-button.component";

@Component({
  standalone: true,
  imports: [TulparButtonComponent],
  template: `
    <tulpar-button-ng
      [severity]="sev()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [iconSize]="iconSize()"
      (clicked)="onClick($event)"
    >{{ label() }}</tulpar-button-ng>
  `,
})
class Host {
  sev = signal<"primary" | "danger">("primary");
  variant = signal<"solid" | "outlined">("solid");
  size = signal<"md" | "lg">("md");
  disabled = signal(false);
  iconSize = signal<number | undefined>(undefined);
  label = signal("Save");
  lastClick: MouseEvent | null = null;
  onClick(e: MouseEvent) {
    this.lastClick = e;
  }
}

describe("TulparButtonComponent (TestBed)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Host] });
  });

  it("creates and renders the inner tulpar-button", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-button");
    expect(inner).toBeTruthy();
  });

  it("reflects severity to the inner element", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.sev.set("danger");
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-button") as HTMLElement;
    expect(inner.getAttribute("severity")).toBe("danger");
  });

  it("emits click via the `clicked` output", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const inner = fixture.nativeElement.querySelector("tulpar-button") as HTMLElement;
    inner.click();
    expect(fixture.componentInstance.lastClick).toBeInstanceOf(MouseEvent);
  });

  it("effectiveIconSize defaults to size-scale value", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("lg");
    fixture.detectChanges();
    const cmp = fixture.debugElement.children[0].componentInstance as TulparButtonComponent;
    expect(cmp.effectiveIconSize()).toBe(18);
  });

  it("effectiveIconSize uses explicit iconSize override", () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.size.set("md");
    fixture.componentInstance.iconSize.set(32);
    fixture.detectChanges();
    const cmp = fixture.debugElement.children[0].componentInstance as TulparButtonComponent;
    expect(cmp.effectiveIconSize()).toBe(32);
  });

  it("renders a generic component class passed via the icon input", async () => {
    @Component({
      selector: "test-icon",
      standalone: true,
      template: `<span data-testid="test-icon-rendered" [attr.data-size]="size()"></span>`,
    })
    class TestIcon {
      size = input<number | undefined>(undefined);
    }

    @Component({
      standalone: true,
      imports: [TulparButtonComponent],
      template: `<tulpar-button-ng [icon]="iconCmp" size="lg">Save</tulpar-button-ng>`,
    })
    class HostWithIcon {
      readonly iconCmp = TestIcon;
    }

    TestBed.configureTestingModule({ imports: [HostWithIcon] });
    const fixture = TestBed.createComponent(HostWithIcon);
    fixture.detectChanges();
    await fixture.whenStable();

    const rendered = fixture.nativeElement.querySelector(
      '[data-testid="test-icon-rendered"]',
    ) as HTMLElement | null;
    expect(rendered).toBeTruthy();
    expect(rendered!.getAttribute("data-size")).toBe("18");
  });

  it("renders projected content into slot=start when icon input is omitted", () => {
    @Component({
      standalone: true,
      imports: [TulparButtonComponent],
      template: `
        <tulpar-button-ng>
          <span slot="start" data-testid="projected-start">START</span>
          Save
        </tulpar-button-ng>
      `,
    })
    class HostWithSlot {}

    TestBed.configureTestingModule({ imports: [HostWithSlot] });
    const fixture = TestBed.createComponent(HostWithSlot);
    fixture.detectChanges();

    const projected = fixture.nativeElement.querySelector(
      '[data-testid="projected-start"]',
    ) as HTMLElement | null;
    expect(projected).toBeTruthy();
    expect(projected!.getAttribute("slot")).toBe("start");
  });
});
