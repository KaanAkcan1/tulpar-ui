import { describe, it, expect, beforeEach } from "vitest";
import { createEnvironmentInjector, runInInjectionContext } from "@angular/core";
import type { EnvironmentInjector } from "@angular/core";
import { TulparButtonComponent } from "./tulpar-button.component";

let injector: EnvironmentInjector;

beforeEach(() => {
  injector = createEnvironmentInjector([]);
});

describe("TulparButtonComponent (smoke)", () => {
  it("is exported as a class", () => {
    expect(typeof TulparButtonComponent).toBe("function");
    expect(TulparButtonComponent.name).toBe("TulparButtonComponent");
  });

  it("provides the v0.3 signal-based inputs", () => {
    const instance = runInInjectionContext(injector, () => new TulparButtonComponent());
    expect(typeof instance.severity).toBe("function");
    expect(typeof instance.variant).toBe("function");
    expect(typeof instance.color).toBe("function");
    expect(typeof instance.shape).toBe("function");
    expect(typeof instance.size).toBe("function");
    expect(typeof instance.raised).toBe("function");
    expect(typeof instance.block).toBe("function");
    expect(typeof instance.justify).toBe("function");
    expect(typeof instance.iconPosition).toBe("function");
    expect(typeof instance.iconSeparator).toBe("function");
    expect(typeof instance.loadingLabel).toBe("function");
    expect(typeof instance.loadingPosition).toBe("function");
    expect(typeof instance.dataDisabled).toBe("function");
  });

  it("defaults match the v0.3 spec", () => {
    const instance = runInInjectionContext(injector, () => new TulparButtonComponent());
    expect(instance.severity()).toBe("primary");
    expect(instance.variant()).toBe("solid");
    expect(instance.shape()).toBe("default");
    expect(instance.size()).toBe("md");
    expect(instance.justify()).toBe("center");
    expect(instance.iconPosition()).toBe("start");
    expect(instance.loadingPosition()).toBe("center");
    expect(instance.raised()).toBe(false);
    expect(instance.block()).toBe(false);
    expect(instance.iconSeparator()).toBe(false);
    expect(instance.disabled()).toBe(false);
    expect(instance.dataDisabled()).toBe(false);
    expect(instance.loading()).toBe(false);
    expect(instance.color()).toBeUndefined();
    expect(instance.loadingLabel()).toBeUndefined();
  });
});
