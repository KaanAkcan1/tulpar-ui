/**
 * tulpar-toast.service.spec.ts — smoke tests for TulparToast + TulparMessage injectables
 *
 * Convention (per repo): wrapper tests are smoke-level. We spy on the core service methods and
 * assert delegation; we do NOT test the core service itself (that's covered in core's WTR tests).
 *
 * NO RxJS — zero imports from 'rxjs'.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TestBed } from "@angular/core/testing";

// ── Core spy targets ─────────────────────────────────────────────────────────
// Import the core toast / message modules before importing the service so the
// spies are in place before the service delegates to them.
import * as coreToast from "@tulpar-ui/core/toast";

import {
  TulparToastService,
  TulparMessageService,
  provideTulparToast,
} from "./tulpar-toast.service";

// ─────────────────────────────────────────────────────────────────────────────

describe("TulparToastService (smoke)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TulparToastService, TulparMessageService],
    });
    vi.spyOn(coreToast, "toast" as never).mockReturnValue("id-1");
    vi.spyOn(coreToast.toast, "success").mockReturnValue("id-success");
    vi.spyOn(coreToast.toast, "info").mockReturnValue("id-info");
    vi.spyOn(coreToast.toast, "warning").mockReturnValue("id-warn");
    vi.spyOn(coreToast.toast, "danger").mockReturnValue("id-danger");
    vi.spyOn(coreToast.toast, "custom").mockReturnValue("id-custom");
    vi.spyOn(coreToast.toast, "update").mockImplementation(() => undefined);
    vi.spyOn(coreToast.toast, "dismiss").mockImplementation(() => undefined);
    vi.spyOn(coreToast.toast, "setDefaults").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("TulparToastService is injectable", () => {
    const svc = TestBed.inject(TulparToastService);
    expect(svc).toBeInstanceOf(TulparToastService);
  });

  it(".show() delegates to core toast()", () => {
    const svc = TestBed.inject(TulparToastService);
    const id = svc.show("Hello");
    expect(coreToast.toast).toHaveBeenCalledWith("Hello", {});
    expect(id).toBe("id-1");
  });

  it(".show() passes options through", () => {
    const svc = TestBed.inject(TulparToastService);
    svc.show("Hi", { tone: "danger", duration: 10000 });
    expect(coreToast.toast).toHaveBeenCalledWith("Hi", { tone: "danger", duration: 10000 });
  });

  it(".success() delegates to core toast.success()", () => {
    const svc = TestBed.inject(TulparToastService);
    const id = svc.success("Done");
    expect(coreToast.toast.success).toHaveBeenCalledWith("Done", {});
    expect(id).toBe("id-success");
  });

  it(".info() delegates to core toast.info()", () => {
    const svc = TestBed.inject(TulparToastService);
    const id = svc.info("Note");
    expect(coreToast.toast.info).toHaveBeenCalledWith("Note", {});
    expect(id).toBe("id-info");
  });

  it(".warning() delegates to core toast.warning()", () => {
    const svc = TestBed.inject(TulparToastService);
    const id = svc.warning("Watch out");
    expect(coreToast.toast.warning).toHaveBeenCalledWith("Watch out", {});
    expect(id).toBe("id-warn");
  });

  it(".danger() delegates to core toast.danger()", () => {
    const svc = TestBed.inject(TulparToastService);
    const id = svc.danger("Error");
    expect(coreToast.toast.danger).toHaveBeenCalledWith("Error", {});
    expect(id).toBe("id-danger");
  });

  it(".custom() delegates to core toast.custom()", () => {
    const svc = TestBed.inject(TulparToastService);
    const id = svc.custom("Custom", { color: "ilay" });
    expect(coreToast.toast.custom).toHaveBeenCalledWith("Custom", { color: "ilay" });
    expect(id).toBe("id-custom");
  });

  it(".update() delegates to core toast.update()", () => {
    const svc = TestBed.inject(TulparToastService);
    svc.update("id-1", { title: "Updated" });
    expect(coreToast.toast.update).toHaveBeenCalledWith("id-1", { title: "Updated" });
  });

  it(".dismiss() with id delegates to core toast.dismiss(id)", () => {
    const svc = TestBed.inject(TulparToastService);
    svc.dismiss("id-1");
    expect(coreToast.toast.dismiss).toHaveBeenCalledWith("id-1");
  });

  it(".dismiss() without id delegates to core toast.dismiss() (dismiss all)", () => {
    const svc = TestBed.inject(TulparToastService);
    svc.dismiss();
    expect(coreToast.toast.dismiss).toHaveBeenCalledWith(undefined);
  });

  it(".setDefaults() delegates to core toast.setDefaults()", () => {
    const svc = TestBed.inject(TulparToastService);
    svc.setDefaults({ location: "top-right", maxVisible: 5 });
    expect(coreToast.toast.setDefaults).toHaveBeenCalledWith({
      location: "top-right",
      maxVisible: 5,
    });
  });

  it(".promise() returns the original Promise (no RxJS)", async () => {
    const svc = TestBed.inject(TulparToastService);
    // Restore promise spy to real (we want to test our wrapper's return value)
    vi.spyOn(coreToast.toast, "promise" as never).mockImplementation((p: Promise<unknown>) => p);
    const p = Promise.resolve("result");
    const returned = svc.promise(p, { loading: "…", success: "OK", error: "Err" });
    expect(returned).toBe(p);
    const value = await returned;
    expect(value).toBe("result");
  });

  it(".promise() propagates rejection", async () => {
    const svc = TestBed.inject(TulparToastService);
    vi.spyOn(coreToast.toast, "promise" as never).mockImplementation((p: Promise<unknown>) => p);
    const err = new Error("fail");
    const p = Promise.reject(err);
    const returned = svc.promise(p, { loading: "…", success: "OK", error: "Err" });
    await expect(returned).rejects.toThrow("fail");
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("TulparMessageService (smoke)", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TulparToastService, TulparMessageService],
    });
    vi.spyOn(coreToast, "message" as never).mockReturnValue("msg-1");
    vi.spyOn(coreToast.message, "success").mockReturnValue("msg-success");
    vi.spyOn(coreToast.message, "info").mockReturnValue("msg-info");
    vi.spyOn(coreToast.message, "warning").mockReturnValue("msg-warn");
    vi.spyOn(coreToast.message, "danger").mockReturnValue("msg-danger");
    vi.spyOn(coreToast.message, "dismiss").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("TulparMessageService is injectable", () => {
    const svc = TestBed.inject(TulparMessageService);
    expect(svc).toBeInstanceOf(TulparMessageService);
  });

  it(".show() delegates to core message()", () => {
    const svc = TestBed.inject(TulparMessageService);
    const id = svc.show("Saved");
    expect(coreToast.message).toHaveBeenCalledWith("Saved", {});
    expect(id).toBe("msg-1");
  });

  it(".success() delegates to core message.success()", () => {
    const svc = TestBed.inject(TulparMessageService);
    const id = svc.success("OK");
    expect(coreToast.message.success).toHaveBeenCalledWith("OK", {});
    expect(id).toBe("msg-success");
  });

  it(".info() delegates to core message.info()", () => {
    const svc = TestBed.inject(TulparMessageService);
    const id = svc.info("Info");
    expect(coreToast.message.info).toHaveBeenCalledWith("Info", {});
    expect(id).toBe("msg-info");
  });

  it(".warning() delegates to core message.warning()", () => {
    const svc = TestBed.inject(TulparMessageService);
    const id = svc.warning("Warn");
    expect(coreToast.message.warning).toHaveBeenCalledWith("Warn", {});
    expect(id).toBe("msg-warn");
  });

  it(".danger() delegates to core message.danger()", () => {
    const svc = TestBed.inject(TulparMessageService);
    const id = svc.danger("Danger");
    expect(coreToast.message.danger).toHaveBeenCalledWith("Danger", {});
    expect(id).toBe("msg-danger");
  });

  it(".dismiss() delegates to core message.dismiss()", () => {
    const svc = TestBed.inject(TulparMessageService);
    svc.dismiss("msg-1");
    expect(coreToast.message.dismiss).toHaveBeenCalledWith("msg-1");
  });

  it(".dismiss() without id dismisses all", () => {
    const svc = TestBed.inject(TulparMessageService);
    svc.dismiss();
    expect(coreToast.message.dismiss).toHaveBeenCalledWith(undefined);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("provideTulparToast()", () => {
  it("returns providers (EnvironmentProviders) and services resolve from them", () => {
    TestBed.configureTestingModule({
      providers: [provideTulparToast()],
    });
    const toast = TestBed.inject(TulparToastService);
    const msg = TestBed.inject(TulparMessageService);
    expect(toast).toBeInstanceOf(TulparToastService);
    expect(msg).toBeInstanceOf(TulparMessageService);
  });
});
