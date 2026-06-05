import { describe, it, expect, beforeEach } from "vitest";
import { createEnvironmentInjector, EnvironmentInjector, runInInjectionContext } from "@angular/core";
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

  it("instances have the expected signal-based inputs", () => {
    const instance = runInInjectionContext(injector, () => new TulparButtonComponent());
    expect(typeof instance.variant).toBe("function");
    expect(typeof instance.size).toBe("function");
    expect(typeof instance.type).toBe("function");
    expect(typeof instance.disabled).toBe("function");
    expect(typeof instance.loading).toBe("function");
  });

  it("defaults reflect spec (variant=primary, size=md, type=button)", () => {
    const instance = runInInjectionContext(injector, () => new TulparButtonComponent());
    expect(instance.variant()).toBe("primary");
    expect(instance.size()).toBe("md");
    expect(instance.type()).toBe("button");
    expect(instance.disabled()).toBe(false);
    expect(instance.loading()).toBe(false);
  });
});
